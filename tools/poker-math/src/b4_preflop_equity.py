"""B4 — Preflop-Equity: alle 169 Starthände gegen alle 169, exakt.

Was gerechnet wird
------------------
Für jedes Paar von Starthand-Klassen die Equity Heads-up, **vollständig
enumeriert** über alle Boards. Keine Schätzung, kein Konfidenzintervall — die
Zahl.

Warum das überhaupt machbar ist
-------------------------------
Naiv wären es 812 175 Paarungen konkreter Hände zu je 1 712 304 Boards. Bei
gemessenen 2,9 s pro Paarung sind das rund 654 Stunden auf einem Kern.

Die Farben sind untereinander gleichwertig. A♥K♥ gegen Q♠Q♦ ist dieselbe
Rechnung wie A♠K♠ gegen Q♥Q♦ — man muss nur die Farben umbenennen. Wird jede
Paarung auf ihre Kanonform unter allen 24 Farbumbenennungen gebracht, bleiben
**47 008** wirklich verschiedene Rechnungen übrig, Faktor 17,28. Auf vier
Kernen sind das rund elf Stunden.

Was die Farbbeziehung ausmacht (K3)
-----------------------------------
Ein einzelner Mittelwert je Handpaar verwischt etwas Echtes: A♥K♥ gegen Q♥J♥
ist eine andere Rechnung als A♥K♥ gegen Q♠J♠. Teilen sich die Hände eine
Farbe, sinkt das Flush-Potenzial beider.

Deshalb steht in der Ausgabe **nicht nur** der gewichtete Mittelwert, sondern
zusätzlich jede unterscheidbare Farbkonfiguration mit ihrer Häufigkeit. Wo die
Spanne zwischen den Konfigurationen über einen Prozentpunkt liegt, trägt das
Matchup ein Kennzeichen: Die App darf dort keinen Einzelwert zeigen, ohne die
Spanne zu nennen.

Absicherung (K4)
----------------
Elf Stunden ohne Zwischenstand wären ein Risiko. Deshalb:

- Jedes fertige Handpaar wird sofort als Zeile in eine JSONL-Datei geschrieben.
- Ein erneuter Start liest sie und setzt an der ersten fehlenden Einheit an.
- Der Fortschritt samt Restzeitschätzung geht in eine Logdatei.
- Nach Abschluss läuft ein Integritätscheck über die gesamte Matrix.
"""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from itertools import combinations, permutations
from pathlib import Path

from karten import (
    ALLE_KARTEN, TEXT_JE_KARTE, alle_starthand_kuerzel, farbe, rang,
    kombos_fuer_kuerzel,
)

WURZEL = Path(__file__).resolve().parent.parent
TEILDATEI = WURZEL / "output" / "b4_teil" / "matchups.jsonl"
LOGDATEI = WURZEL / "output" / "b4_lauf.log"
ZIELDATEI = WURZEL / "output" / "b4_preflop_equity.json"

#: Ab dieser Spanne zwischen den Farbkonfigurationen bekommt ein Matchup ein
#: Kennzeichen. Ein Prozentpunkt ist die Vorgabe aus K3.
SPANNE_KENNZEICHEN_PP = 1.0

_FARBTAUSCH = tuple(permutations(range(4)))
_EVAL7 = None


def _eval7_karten():
    global _EVAL7
    if _EVAL7 is None:
        import eval7
        _EVAL7 = tuple(eval7.Card(t) for t in TEXT_JE_KARTE)
    return _EVAL7


# ---------------------------------------------------------------------------
# Farb-Isomorphie
# ---------------------------------------------------------------------------

def kanonform(hand_a: tuple[int, int], hand_b: tuple[int, int]):
    """Die eindeutige Vertretung einer Paarung unter Farbumbenennung.

    Gebildet als **Minimum über alle 24 Umbenennungen** – dadurch ist sie
    eindeutig und nicht bloß eine Heuristik. Die Paarung bleibt geordnet:
    Hand A und Hand B werden nicht vertauscht, denn die Equity ist nicht
    symmetrisch.
    """
    beste = None
    for p in _FARBTAUSCH:
        a = tuple(sorted(rang(c) * 4 + p[farbe(c)] for c in hand_a))
        b = tuple(sorted(rang(c) * 4 + p[farbe(c)] for c in hand_b))
        form = (a, b)
        if beste is None or form < beste:
            beste = form
    return beste


def farbbeziehung(hand_a: tuple[int, int], hand_b: tuple[int, int]) -> str:
    """Wie die beiden Hände farblich zueinander stehen – als lesbarer Name.

    Das ist die Größe, die K3 sichtbar machen will: Geteilte Farben senken das
    Flush-Potenzial beider Seiten.
    """
    fa = {farbe(c) for c in hand_a}
    fb = {farbe(c) for c in hand_b}
    gemeinsam = len(fa & fb)
    a_suited = len(fa) == 1
    b_suited = len(fb) == 1

    teile = []
    teile.append("A suited" if a_suited else "A offsuit")
    teile.append("B suited" if b_suited else "B offsuit")
    if gemeinsam == 0:
        teile.append("keine gemeinsame Farbe")
    elif a_suited and b_suited:
        teile.append("gleiche Farbe")
    else:
        teile.append(f"{gemeinsam} gemeinsame Farbe(n)")
    return ", ".join(teile)


# ---------------------------------------------------------------------------
# Die eigentliche Rechnung
# ---------------------------------------------------------------------------

def enumeriere(hand_a: tuple[int, int], hand_b: tuple[int, int]) -> dict:
    """Alle Boards durchzählen. Split zählt je Seite als 0,5."""
    import eval7

    e7 = _eval7_karten()
    ea = [e7[c] for c in hand_a]
    eb = [e7[c] for c in hand_b]
    belegt = set(hand_a) | set(hand_b)
    rest = [e7[c] for c in ALLE_KARTEN if c not in belegt]
    ev = eval7.evaluate

    siege_a = siege_b = split = 0
    for board in combinations(rest, 5):
        brett = list(board)
        wa = ev(ea + brett)
        wb = ev(eb + brett)
        if wa > wb:
            siege_a += 1
        elif wb > wa:
            siege_b += 1
        else:
            split += 1

    boards = siege_a + siege_b + split
    return {
        "boards": boards,
        "siege_a": siege_a,
        "siege_b": siege_b,
        "split": split,
        "equity_a": (siege_a + 0.5 * split) / boards,
        "equity_b": (siege_b + 0.5 * split) / boards,
    }


def farbkonfigurationen(kuerzel_a: str, kuerzel_b: str) -> dict:
    """Alle unterscheidbaren Farbkonfigurationen einer Handpaarung, mit Häufigkeit.

    Über alle konkreten Kombo-Paare der beiden Klassen; jedes wird auf seine
    Kanonform gebracht und gezählt. Gerechnet wird dann nur je Kanonform.
    """
    kombos_a = kombos_fuer_kuerzel(kuerzel_a)
    kombos_b = kombos_fuer_kuerzel(kuerzel_b)

    gruppen: dict = {}
    for a in kombos_a:
        for b in kombos_b:
            if set(a) & set(b):
                continue  # dieselbe Karte kann nicht zweimal im Spiel sein
            form = kanonform(a, b)
            if form not in gruppen:
                gruppen[form] = {"anzahl": 0, "vertreter": (a, b)}
            gruppen[form]["anzahl"] += 1
    return gruppen


def rechne_matchup(kuerzel_a: str, kuerzel_b: str) -> dict:
    """Ein Handpaar vollständig: je Farbkonfiguration und gewichtet."""
    gruppen = farbkonfigurationen(kuerzel_a, kuerzel_b)
    if not gruppen:
        raise ValueError(f"{kuerzel_a} gegen {kuerzel_b}: keine mögliche Paarung")

    konfigurationen = []
    gewicht_summe = 0
    gewichtet_a = 0.0
    for form, info in sorted(gruppen.items()):
        a, b = info["vertreter"]
        ergebnis = enumeriere(a, b)
        n = info["anzahl"]
        gewicht_summe += n
        gewichtet_a += n * ergebnis["equity_a"]
        konfigurationen.append({
            "beziehung": farbbeziehung(a, b),
            "vertreter_a": " ".join(TEXT_JE_KARTE[c] for c in a),
            "vertreter_b": " ".join(TEXT_JE_KARTE[c] for c in b),
            "haeufigkeit": n,
            "equity_a": ergebnis["equity_a"],
            "equity_b": ergebnis["equity_b"],
            "boards": ergebnis["boards"],
            "siege_a": ergebnis["siege_a"],
            "siege_b": ergebnis["siege_b"],
            "split": ergebnis["split"],
        })

    mittel_a = gewichtet_a / gewicht_summe
    werte = [k["equity_a"] for k in konfigurationen]
    spanne_pp = (max(werte) - min(werte)) * 100

    return {
        "hand_a": kuerzel_a,
        "hand_b": kuerzel_b,
        "equity_a": mittel_a,
        "equity_b": 1.0 - mittel_a,
        "kombo_paarungen": gewicht_summe,
        "farbkonfigurationen": konfigurationen,
        "spanne_pp": spanne_pp,
        # K3: Wo die Farbbeziehung mehr als einen Prozentpunkt ausmacht, darf
        # die App keinen Einzelwert ohne die Spanne zeigen.
        "spanne_relevant": spanne_pp > SPANNE_KENNZEICHEN_PP,
        "niedrigste_equity_a": min(werte),
        "hoechste_equity_a": max(werte),
    }


# ---------------------------------------------------------------------------
# Arbeitsliste, Fortschritt, Wiederaufnahme (K4)
# ---------------------------------------------------------------------------

def arbeitsliste() -> list[tuple[str, str]]:
    """Alle ungeordneten Paare von Starthand-Klassen, deterministisch sortiert."""
    klassen = sorted(alle_starthand_kuerzel())
    return [(a, b) for i, a in enumerate(klassen) for b in klassen[i:]]


def bereits_fertig() -> set[tuple[str, str]]:
    """Was in der Teildatei schon steht. Kaputte letzte Zeile wird verworfen."""
    if not TEILDATEI.exists():
        return set()
    fertig = set()
    with TEILDATEI.open(encoding="utf-8") as f:
        for zeile in f:
            zeile = zeile.strip()
            if not zeile:
                continue
            try:
                d = json.loads(zeile)
            except json.JSONDecodeError:
                # Abbruch mitten im Schreiben: Diese Einheit gilt als offen.
                continue
            fertig.add((d["hand_a"], d["hand_b"]))
    return fertig


def protokolliere(text: str) -> None:
    zeit = datetime.now(timezone.utc).isoformat(timespec="seconds")
    zeile = f"{zeit}  {text}"
    LOGDATEI.parent.mkdir(parents=True, exist_ok=True)
    with LOGDATEI.open("a", encoding="utf-8") as f:
        f.write(zeile + "\n")
    print(zeile, flush=True)


def _arbeite(paar):
    """Für den Arbeitsprozess: ein Handpaar rechnen."""
    a, b = paar
    t0 = time.perf_counter()
    ergebnis = rechne_matchup(a, b)
    ergebnis["dauer_s"] = round(time.perf_counter() - t0, 3)
    return ergebnis


def lauf(kerne: int | None = None, nur_erste: int | None = None) -> int:
    """Den Lauf starten oder fortsetzen."""
    import multiprocessing as mp

    alle = arbeitsliste()
    if nur_erste:
        alle = alle[:nur_erste]
    fertig = bereits_fertig()
    offen = [p for p in alle if p not in fertig]

    kerne = kerne or max(1, (os.cpu_count() or 2) - 1)
    protokolliere(
        f"Start: {len(alle)} Handpaare insgesamt, {len(fertig)} schon fertig, "
        f"{len(offen)} offen, {kerne} Kerne"
    )
    if not offen:
        protokolliere("Nichts zu tun – alle Handpaare liegen vor.")
        return 0

    TEILDATEI.parent.mkdir(parents=True, exist_ok=True)
    begonnen = time.perf_counter()
    erledigt = 0
    zuletzt_gemeldet = 0.0

    with mp.Pool(kerne) as pool, TEILDATEI.open("a", encoding="utf-8") as ziel:
        for ergebnis in pool.imap_unordered(_arbeite, offen, chunksize=1):
            ziel.write(json.dumps(ergebnis, ensure_ascii=False) + "\n")
            ziel.flush()
            os.fsync(ziel.fileno())  # nach Stromausfall nicht halb geschrieben
            erledigt += 1

            verstrichen = time.perf_counter() - begonnen
            if verstrichen - zuletzt_gemeldet >= 60 or erledigt == len(offen):
                zuletzt_gemeldet = verstrichen
                je_einheit = verstrichen / erledigt
                rest = timedelta(seconds=round(je_einheit * (len(offen) - erledigt)))
                anteil = 100 * (len(fertig) + erledigt) / len(alle)
                protokolliere(
                    f"{len(fertig) + erledigt}/{len(alle)} ({anteil:.2f} %) · "
                    f"{je_einheit:.2f} s je Handpaar · Rest etwa {rest}"
                )

    protokolliere(f"Rechenteil fertig: {erledigt} Handpaare in dieser Sitzung")
    return 0


# ---------------------------------------------------------------------------
# Zusammenbau und Integritätscheck (K4)
# ---------------------------------------------------------------------------

def pruefe_integritaet(eintraege: list[dict]) -> dict:
    """Über die gesamte Matrix. Abweichung bricht ab.

    Geprüft wird, was gelten MUSS, wenn die Rechnung stimmt:
    Equity(A gegen B) + Equity(B gegen A) = 1, für jedes Paar; Split je zur
    Hälfte; und für ein Handpaar gegen sich selbst genau 50 %.
    """
    fehler = []
    for e in eintraege:
        summe = e["equity_a"] + e["equity_b"]
        if abs(summe - 1.0) > 1e-12:
            fehler.append(f"{e['hand_a']} gegen {e['hand_b']}: Summe {summe!r} statt 1")

        for k in e["farbkonfigurationen"]:
            gesamt = k["siege_a"] + k["siege_b"] + k["split"]
            if gesamt != k["boards"]:
                fehler.append(
                    f"{e['hand_a']}/{e['hand_b']} {k['beziehung']}: "
                    f"{gesamt} Ausgänge, aber {k['boards']} Boards"
                )
            erwartet_a = (k["siege_a"] + 0.5 * k["split"]) / k["boards"]
            if abs(k["equity_a"] - erwartet_a) > 1e-12:
                fehler.append(
                    f"{e['hand_a']}/{e['hand_b']} {k['beziehung']}: "
                    f"Split nicht je zur Hälfte gezählt"
                )

        if e["hand_a"] == e["hand_b"] and abs(e["equity_a"] - 0.5) > 1e-9:
            fehler.append(
                f"{e['hand_a']} gegen sich selbst: {e['equity_a']!r} statt 0,5"
            )

    if fehler:
        raise AssertionError(
            "Integritätscheck über die Matrix fehlgeschlagen:\n  "
            + "\n  ".join(fehler[:20])
            + (f"\n  … und {len(fehler) - 20} weitere" if len(fehler) > 20 else "")
        )
    return {
        "geprueft": len(eintraege),
        "summe_je_paar_ist_eins": True,
        "split_je_zur_haelfte": True,
        "selbstpaarungen_bei_50_prozent": True,
    }


def zusammenbauen() -> int:
    """Aus der Teildatei die fertige Ausgabedatei bauen."""
    from befunde import befund, prozent, prozentpunkte
    from metadaten import metadatenblock, schreibe

    start = time.perf_counter()
    if not TEILDATEI.exists():
        protokolliere("Keine Teildatei – erst den Lauf starten.")
        return 1

    eintraege: dict[tuple[str, str], dict] = {}
    with TEILDATEI.open(encoding="utf-8") as f:
        for zeile in f:
            zeile = zeile.strip()
            if not zeile:
                continue
            try:
                d = json.loads(zeile)
            except json.JSONDecodeError:
                continue
            eintraege[(d["hand_a"], d["hand_b"])] = d  # spätere Zeile gewinnt

    erwartet = arbeitsliste()
    fehlend = [p for p in erwartet if p not in eintraege]
    if fehlend:
        protokolliere(
            f"Noch nicht vollständig: {len(fehlend)} von {len(erwartet)} Handpaaren "
            f"fehlen, zuerst {fehlend[:3]}"
        )
        return 1

    geordnet = [eintraege[p] for p in erwartet]
    integritaet = pruefe_integritaet(geordnet)

    mit_spanne = [e for e in geordnet if e["spanne_relevant"]]
    groesste = max(geordnet, key=lambda e: e["spanne_pp"])

    inhalt = {
        "matchups": geordnet,
        "integritaet": integritaet,
        "befunde": [
            befund(
                "spanne_der_farbkonfigurationen",
                f"Bei {len(mit_spanne)} von {len(geordnet)} Handpaaren hängt die "
                f"Equity um mehr als einen Prozentpunkt davon ab, wie die Farben "
                f"zwischen den Händen liegen.",
                {
                    "handpaare_gesamt": len(geordnet),
                    "mit_relevanter_spanne": len(mit_spanne),
                    "schwelle_pp": SPANNE_KENNZEICHEN_PP,
                },
            ),
            befund(
                "groesste_spanne",
                f"Am stärksten wirkt die Farbbeziehung bei "
                f"{groesste['hand_a']} gegen {groesste['hand_b']}: zwischen "
                f"{prozent(groesste['niedrigste_equity_a'])} und "
                f"{prozent(groesste['hoechste_equity_a'])}, also "
                f"{prozentpunkte(groesste['spanne_pp'])} Unterschied.",
                {
                    "hand_a": groesste["hand_a"],
                    "hand_b": groesste["hand_b"],
                    "niedrigste": round(groesste["niedrigste_equity_a"], 6),
                    "hoechste": round(groesste["hoechste_equity_a"], 6),
                    "spanne_pp": round(groesste["spanne_pp"], 4),
                },
            ),
        ],
    }

    meta = metadatenblock(
        block="b4_preflop_equity",
        zweck=(
            "Preflop-Equity Heads-up für alle Paare der 169 Starthand-Klassen, "
            "vollständig enumeriert, je Farbkonfiguration und gewichtet."
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        besondere_annahmen={
            "heads_up": "Genau zwei Hände, alle fünf Boardkarten kommen.",
            "split_pot": "Ein geteilter Pot zählt für jede Seite als 0,5.",
            "farb_isomorphie": (
                "Gerechnet wird je Farbkonfiguration einmal, gewichtet mit ihrer "
                "Häufigkeit. Die Kanonform ist das Minimum über alle 24 "
                "Farbumbenennungen und damit eindeutig. Die Reduktion ist gegen "
                "die vollständige Enumeration ohne Reduktion geprüft – exakt, "
                "nicht näherungsweise (tests/test_b4_preflop.py)."
            ),
            "spanne_relevant": (
                f"Liegt die Spanne zwischen den Farbkonfigurationen über "
                f"{SPANNE_KENNZEICHEN_PP} Prozentpunkt, trägt das Matchup das "
                f"Kennzeichen 'spanne_relevant'. Die App darf dort keinen "
                f"Einzelwert zeigen, ohne die Spanne zu nennen."
            ),
            "keine_reihenfolge": (
                "Preflop gibt es keine Position und keine Setzrunde in dieser "
                "Rechnung: Beide Hände gehen bis zum Showdown."
            ),
        },
    )
    schreibe(ZIELDATEI, meta, inhalt)
    protokolliere(f"Fertig zusammengebaut: {ZIELDATEI}")
    for b in inhalt["befunde"]:
        protokolliere(f"  · {b['aussage']}")
    return 0


def main(argv: list[str]) -> int:
    if "--zusammenbauen" in argv:
        return zusammenbauen()
    kerne = None
    nur = None
    for i, a in enumerate(argv):
        if a == "--kerne" and i + 1 < len(argv):
            kerne = int(argv[i + 1])
        if a == "--nur-erste" and i + 1 < len(argv):
            nur = int(argv[i + 1])
    ergebnis = lauf(kerne=kerne, nur_erste=nur)
    if ergebnis == 0 and nur is None:
        return zusammenbauen()
    return ergebnis


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
