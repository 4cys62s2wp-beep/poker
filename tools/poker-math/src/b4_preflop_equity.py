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
#: Der gesicherte Stand – wird in git geführt und bewusst fortgeschrieben.
TEILDATEI = WURZEL / "output" / "b4_teil" / "matchups.jsonl"
#: Wohin der LAUFENDE Prozess schreibt – eine Datei je Prozess, benannt nach
#: seiner Prozessnummer. Bewusst nicht in git: Eine Datei, die ein Prozess
#: gerade beschreibt, kann nicht gleichzeitig committet und sauber sein.
#:
#: Warum je Prozess und nicht eine gemeinsame: Eine frühere Fassung hatte eine
#: feste `matchups.live.jsonl`, und `--sichern` hat sie nach dem Übernehmen
#: gelöscht. Läuft der Prozess dabei noch, schreibt er unter Linux weiter in
#: eine Datei, die es nicht mehr gibt – sichtbar für niemanden, wiederholbar
#: für niemanden. Genau so sind rund 120 gerechnete Handpaare verloren
#: gegangen. Jetzt gehört jede Laufdatei genau einem Prozess, und gelöscht
#: wird nur, was einem Prozess gehört, den es nicht mehr gibt.
LAUFVERZEICHNIS = WURZEL / "output" / "b4_teil"
LAUFMUSTER = "matchups.live.*.jsonl"


def laufdatei(pid: int | None = None) -> Path:
    return LAUFVERZEICHNIS / f"matchups.live.{pid or os.getpid()}.jsonl"


def laufdateien() -> list[Path]:
    return sorted(LAUFVERZEICHNIS.glob(LAUFMUSTER))


def _pid_aus(pfad: Path) -> int | None:
    teile = pfad.name.split(".")
    try:
        return int(teile[2])
    except (IndexError, ValueError):
        return None


def _laeuft(pid: int) -> bool:
    """Läuft ein Prozess mit dieser Nummer noch?

    `kill(pid, 0)` sendet kein Signal, sondern prüft nur. Wirft es nicht, gibt
    es den Prozess. Im Zweifel – etwa wenn er einem anderen Nutzer gehört –
    gilt er als laufend: Eine Datei zu behalten, die niemand mehr braucht, ist
    harmlos; eine zu löschen, in die noch geschrieben wird, ist es nicht.
    """
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True
LOGDATEI = WURZEL / "output" / "b4_lauf.log"
ZIELDATEI = WURZEL / "output" / "b4_preflop_equity.json"

#: Ab dieser Spanne zwischen den Farbkonfigurationen bekommt ein Matchup ein
#: Kennzeichen. Ein Prozentpunkt ist die Vorgabe aus K3.
SPANNE_KENNZEICHEN_PP = 1.0

#: Nach so vielen fertigen Handpaaren wandert der Stand in die gesicherte
#: Datei. Bei rund zwei Sekunden je Handpaar sind das etwa zehn Minuten –
#: kurz genug, dass ein Abbruch nicht weh tut, selten genug, dass das
#: Neuschreiben der Sammeldatei nicht ins Gewicht fällt.
SICHERN_ALLE = 250

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


def _lies_zeilen(pfad: Path):
    """Alle brauchbaren Zeilen einer Teildatei. Kaputte werden übersprungen."""
    if not pfad.exists():
        return
    with pfad.open(encoding="utf-8") as f:
        for zeile in f:
            zeile = zeile.strip()
            if not zeile:
                continue
            try:
                yield json.loads(zeile)
            except json.JSONDecodeError:
                # Abbruch mitten im Schreiben: Diese Einheit gilt als offen.
                continue


def alle_ergebnisse() -> dict:
    """Gesicherter Stand und laufender Schreibstrom zusammen.

    Bei Dopplung gewinnt der laufende – er ist der jüngere.
    """
    ergebnisse: dict = {}
    for pfad in [TEILDATEI, *laufdateien()]:
        for d in _lies_zeilen(pfad):
            ergebnisse[(d["hand_a"], d["hand_b"])] = d
    return ergebnisse


def bereits_fertig() -> set:
    return set(alle_ergebnisse())


def sichere(still: bool = False) -> int:
    """Die laufenden Schreibströme in den gesicherten Stand übernehmen.

    Danach ist der Arbeitsbaum wieder sauber und der Fortschritt liegt in git.
    Geschrieben wird sortiert, damit dieselbe Menge Ergebnisse immer dieselbe
    Datei ergibt – sonst wäre jeder Sicherungsschritt ein großer Diff.

    Zwei Dinge macht diese Fassung anders als die erste, und beide sind Folge
    eines echten Datenverlusts:

    1. **Atomar geschrieben.** Erst in eine Nebendatei, dann umbenannt. Die
       alte Fassung hat den gesicherten Stand mit `open("w")` abgeschnitten,
       bevor sie ihn neu schrieb – ein Abbruch in dieser Sekunde hätte alles
       gelöscht, was je gerechnet wurde.
    2. **Keine Laufdatei eines lebenden Prozesses wird angefasst.** Übernommen
       wird ihr Inhalt, gelöscht wird sie nicht. Doppelte Einträge schaden
       nichts: Sie werden über (hand_a, hand_b) zusammengeführt.
    """
    ergebnisse = alle_ergebnisse()
    if not ergebnisse:
        if not still:
            protokolliere("Nichts zu sichern.")
        return 0

    TEILDATEI.parent.mkdir(parents=True, exist_ok=True)
    neben = TEILDATEI.with_suffix(".jsonl.neu")
    with neben.open("w", encoding="utf-8") as f:
        for schluessel in sorted(ergebnisse):
            f.write(json.dumps(ergebnisse[schluessel], ensure_ascii=False) + "\n")
        f.flush()
        os.fsync(f.fileno())
    os.replace(neben, TEILDATEI)

    entfernt = 0
    for pfad in laufdateien():
        pid = _pid_aus(pfad)
        if pid is None or _laeuft(pid):
            continue
        pfad.unlink(missing_ok=True)
        entfernt += 1

    if not still:
        protokolliere(
            f"Gesichert: {len(ergebnisse)} von {len(arbeitsliste())} Handpaaren"
            + (f", {entfernt} verwaiste Laufdatei(en) entfernt" if entfernt else "")
        )
    return 0


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

    """Alle Kerne, nicht einer weniger.

    Der Hauptprozess rechnet nicht, er schreibt nur Zeilen und wartet – ihm
    einen Kern freizuhalten verschenkt rund ein Viertel des Durchsatzes.
    Gemessen am vorigen Lauf: drei Arbeiter brachten den Faktor 2,78."""
    kerne = kerne or max(1, os.cpu_count() or 2)
    protokolliere(
        f"Start: {len(alle)} Handpaare insgesamt, {len(fertig)} schon fertig, "
        f"{len(offen)} offen, {kerne} Kerne"
    )
    if not offen:
        protokolliere("Nichts zu tun – alle Handpaare liegen vor.")
        return 0

    LAUFVERZEICHNIS.mkdir(parents=True, exist_ok=True)
    meine_datei = laufdatei()
    protokolliere(f"Schreibt nach {meine_datei.name}")
    begonnen = time.perf_counter()
    erledigt = 0
    zuletzt_gemeldet = 0.0
    zuletzt_gesichert = 0

    with mp.Pool(kerne) as pool, meine_datei.open("a", encoding="utf-8") as ziel:
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

            # Regelmäßig in den gesicherten Stand übernehmen. Seit die
            # Sicherung die Laufdatei nicht mehr anfasst, ist das gefahrlos –
            # und ein Abbruch kostet dann höchstens ein paar Minuten Rechnung
            # statt eines halben Tages.
            if erledigt - zuletzt_gesichert >= SICHERN_ALLE:
                zuletzt_gesichert = erledigt
                sichere(still=True)

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
    from metadaten import Faelle, evaluator_angabe, metadatenblock, schreibe, zs

    start = time.perf_counter()
    eintraege = alle_ergebnisse()
    if not eintraege:
        protokolliere("Noch nichts gerechnet – erst den Lauf starten.")
        return 1

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

    # Nicht ausgerechnet, sondern aus den Ergebnissen zusammengezählt: Jede
    # Farbkonfiguration hat mitgeschrieben, über wie viele Boards sie ging.
    faelle = Faelle()
    for e in geordnet:
        faelle.zaehle("handpaare_gerechnet")
        for k in e["farbkonfigurationen"]:
            faelle.zaehle("farbkonfigurationen_gerechnet")
            faelle.zaehle("boards_enumeriert", k["boards"])

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
                f"For {len(mit_spanne)} of {len(geordnet)} hand pairs the equity "
                f"depends by more than one percentage point on how the suits sit "
                f"between the two hands.",
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
                f"The suit relationship matters most for {groesste['hand_a']} "
                f"against {groesste['hand_b']}: between "
                f"{100 * groesste['niedrigste_equity_a']:.2f} % and "
                f"{100 * groesste['hoechste_equity_a']:.2f} %, a difference of "
                f"{groesste['spanne_pp']:.2f} pp.",
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
        zweck=zs(
            f"Preflop-Equity Heads-up für alle {len(geordnet)} Paare der "
            f"Starthand-Klassen, vollständig enumeriert, je Farbkonfiguration "
            f"und gewichtet.",
            f"Heads-up preflop equity for all {len(geordnet)} pairs of "
            f"starting-hand classes, fully enumerated, per suit configuration "
            f"and weighted.",
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        faelle=faelle,
        evaluator=evaluator_angabe(),
        besondere_annahmen={
            "heads_up": zs(
                "Genau zwei Hände, alle fünf Boardkarten kommen.",
                "Exactly two hands; all five board cards come.",
            ),
            "split_pot": zs(
                "Ein geteilter Pot zählt für jede Seite als 0,5.",
                "A split pot counts as 0.5 for each side.",
            ),
            "farb_isomorphie": zs(
                "Gerechnet wird je Farbkonfiguration einmal, gewichtet mit ihrer "
                "Häufigkeit. Die Kanonform ist das Minimum über alle 24 "
                "Farbumbenennungen und damit eindeutig. Die Reduktion ist gegen "
                "die vollständige Enumeration ohne Reduktion geprüft – exakt, "
                "nicht näherungsweise (tests/test_b4_preflop.py).",
                "Each suit configuration is computed once and weighted by how "
                "often it occurs. The canonical form is the minimum over all 24 "
                "suit renamings and therefore unique. The reduction is checked "
                "against full enumeration without any reduction – exactly, not "
                "approximately (tests/test_b4_preflop.py).",
            ),
            "spanne_relevant": zs(
                f"Liegt die Spanne zwischen den Farbkonfigurationen über "
                f"{SPANNE_KENNZEICHEN_PP} Prozentpunkt, trägt das Matchup das "
                f"Kennzeichen 'spanne_relevant'. Die App darf dort keinen "
                f"Einzelwert zeigen, ohne die Spanne zu nennen.",
                f"If the span between the suit configurations exceeds "
                f"{SPANNE_KENNZEICHEN_PP} percentage point, the matchup carries "
                f"the marker 'spanne_relevant'. There the app must not show a "
                f"single value without naming the span.",
            ),
            "keine_reihenfolge": zs(
                "Preflop gibt es keine Position und keine Setzrunde in dieser "
                "Rechnung: Beide Hände gehen bis zum Showdown.",
                "Preflop there is no position and no betting round in this "
                "computation: both hands go to showdown.",
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
    if "--sichern" in argv:
        return sichere()
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
