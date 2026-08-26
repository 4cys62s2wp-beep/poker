"""B3 — Kombinatorik der Starthände und die Wirkung von Blockern.

Was gerechnet wird
------------------
- Wie viele konkrete Zweikartenblätter („Kombos") es je Handtyp gibt.
- Wie viele davon übrig bleiben, wenn Karten bekannt sind — die eigene Hand
  und das Board blockieren Gegnerhände.
- Für ein konkretes Beispiel: alle 169 Starthände vor und nach Blocker-Abzug.

Warum das eine Lerneinheit ist
------------------------------
Blocker sind der Grund, warum „er könnte A-K haben" nach dem eigenen A-K
nur noch halb so oft stimmt. Wer die Zahlen einmal gesehen hat, schätzt
Gegnerhände anders ein.

Alles gezählt
-------------
Keine der Zahlen in dieser Datei steht im Quelltext. Auch die 6, die 4 und
die 12 nicht — sie fallen aus der Aufzählung aller Zweikartenblätter heraus.
"""

from __future__ import annotations

import time
from itertools import combinations

from karten import (
    ALLE_KARTEN, RANG_ZEICHEN, alle_starthand_kuerzel, aus_text,
    kombos_fuer_kuerzel, starthand_kuerzel,
)
from metadaten import metadatenblock, schreibe


def typ_von(kuerzel: str) -> str:
    """Paar, suited oder offsuit – aus der Schreibweise abgelesen."""
    if len(kuerzel) == 2:
        return "Paar"
    return "suited" if kuerzel.endswith("s") else "offsuit"


def kombos_je_typ() -> dict[str, int]:
    """Wie viele Kombos hat eine Hand je Typ? Gezählt, nicht behauptet.

    Zusätzlich wird geprüft, dass die Zahl innerhalb eines Typs für ALLE
    Klassen dieselbe ist – sonst wäre „ein Paar hat sechs Kombos" keine
    allgemeine Aussage, sondern ein Einzelfall.
    """
    je_klasse: dict[str, int] = {}
    for a, b in combinations(ALLE_KARTEN, 2):
        k = starthand_kuerzel(a, b)
        je_klasse[k] = je_klasse.get(k, 0) + 1

    je_typ: dict[str, set[int]] = {}
    for kuerzel, anzahl in je_klasse.items():
        je_typ.setdefault(typ_von(kuerzel), set()).add(anzahl)

    for typ, werte in je_typ.items():
        if len(werte) != 1:
            raise AssertionError(f"Typ {typ} hat unterschiedlich viele Kombos: {werte}")

    return {typ: werte.pop() for typ, werte in je_typ.items()}


def klassen_je_typ() -> dict[str, int]:
    zaehler: dict[str, int] = {}
    for k in alle_starthand_kuerzel():
        t = typ_von(k)
        zaehler[t] = zaehler.get(t, 0) + 1
    return zaehler


# ---------------------------------------------------------------------------
# Blocker
# ---------------------------------------------------------------------------

def uebrige_kombos(kombos: list[tuple[int, int]], bekannt: frozenset[int]) -> int:
    """Wie viele der Kombos sind noch möglich, wenn ``bekannt`` weg ist?"""
    return sum(1 for a, b in kombos if a not in bekannt and b not in bekannt)


def blockerbild(kuerzel: str, bis_karten: int = 4) -> list[dict]:
    """Wie viele Kombos bleiben, wenn 1 bis n Karten bekannt sind?

    Die Antwort ist **keine einzelne Zahl**: Sie hängt davon ab, ob die
    bekannten Karten die Hand berühren. Deshalb wird über **alle** möglichen
    Mengen bekannter Karten aufgezählt und die Verteilung ausgegeben — mit
    schlimmstem Fall, bestem Fall und Durchschnitt.
    """
    kombos = kombos_fuer_kuerzel(kuerzel)
    gesamt = len(kombos)
    zeilen = []
    for k in range(1, bis_karten + 1):
        verteilung: dict[int, int] = {}
        for menge in combinations(ALLE_KARTEN, k):
            uebrig = uebrige_kombos(kombos, frozenset(menge))
            verteilung[uebrig] = verteilung.get(uebrig, 0) + 1
        faelle = sum(verteilung.values())
        mittel = sum(u * n for u, n in verteilung.items()) / faelle
        zeilen.append({
            "bekannte_karten": k,
            "kombos_ohne_blocker": gesamt,
            "bestenfalls_uebrig": max(verteilung),
            "schlimmstenfalls_uebrig": min(verteilung),
            "im_mittel_uebrig": round(mittel, 4),
            "verteilung": {str(u): n for u, n in sorted(verteilung.items(), reverse=True)},
            "faelle_geprueft": faelle,
        })
    return zeilen


def beispiel_am_board(hand: str, board: str) -> dict:
    """Alle 169 Starthände vor und nach Abzug der bekannten Karten."""
    bekannt = frozenset(aus_text(t) for t in (hand + " " + board).split())

    eintraege = []
    for kuerzel in alle_starthand_kuerzel():
        kombos = kombos_fuer_kuerzel(kuerzel)
        uebrig = uebrige_kombos(kombos, bekannt)
        eintraege.append({
            "hand": kuerzel,
            "typ": typ_von(kuerzel),
            "vorher": len(kombos),
            "nachher": uebrig,
            "weggeblockt": len(kombos) - uebrig,
        })

    summe_vorher = sum(e["vorher"] for e in eintraege)
    summe_nachher = sum(e["nachher"] for e in eintraege)

    # Gegenprobe: Was übrig bleibt, muss genau die Zahl der Zweikartenblätter
    # aus den unbekannten Karten sein.
    unbekannt = [c for c in ALLE_KARTEN if c not in bekannt]
    erwartet = len(list(combinations(unbekannt, 2)))
    if summe_nachher != erwartet:
        raise AssertionError(
            f"Blocker-Rechnung stimmt nicht: {summe_nachher} übrig, "
            f"aber {erwartet} Zweikartenblätter aus {len(unbekannt)} Karten"
        )

    am_staerksten_betroffen = sorted(
        eintraege, key=lambda e: (-e["weggeblockt"], e["hand"]))[:8]

    return {
        "hand": hand,
        "board": board,
        "bekannte_karten": len(bekannt),
        "summe_vorher": summe_vorher,
        "summe_nachher": summe_nachher,
        "am_staerksten_geblockt": am_staerksten_betroffen,
        "je_starthand": eintraege,
    }


def berechne() -> dict:
    je_typ = kombos_je_typ()
    klassen = klassen_je_typ()

    gesamt_kombos = sum(je_typ[t] * klassen[t] for t in je_typ)
    alle_zweikartenblaetter = len(list(combinations(ALLE_KARTEN, 2)))
    if gesamt_kombos != alle_zweikartenblaetter:
        raise AssertionError(
            f"Die Klassen decken nicht alle Blätter ab: {gesamt_kombos} "
            f"gegen {alle_zweikartenblaetter}"
        )

    # „suited und offsuit zusammen" – für ein Rangpaar wie A und K.
    zusammen = je_typ["suited"] + je_typ["offsuit"]

    return {
        "kombos_je_typ": {
            **je_typ,
            "suited_und_offsuit_zusammen": zusammen,
        },
        "klassen_je_typ": klassen,
        "gesamt": {
            "starthand_klassen": sum(klassen.values()),
            "zweikartenblaetter": alle_zweikartenblaetter,
            "probe": (
                "Klassen mal Kombos je Klasse ergibt genau die Zahl aller "
                "Zweikartenblätter – sonst wäre die Einteilung lückenhaft oder "
                "überlappend."
            ),
        },
        "blocker": {
            "erklaerung": (
                "Wie viele Kombos eine bekannte Karte wegnimmt, hängt davon ab, "
                "ob sie die Hand berührt. Deshalb steht hier keine einzelne "
                "Zahl, sondern die vollständige Verteilung über alle möglichen "
                "Mengen bekannter Karten."
            ),
            "Paar": blockerbild("AA"),
            "suited": blockerbild("AKs"),
            "offsuit": blockerbild("AKo"),
        },
        "beispiel": beispiel_am_board("Ah Kh", "Qh 7c 2d"),
    }


def main() -> int:
    start = time.perf_counter()
    inhalt = berechne()
    meta = metadatenblock(
        block="b3_kombinatorik",
        zweck=(
            "Kombos je Starthand-Typ, Wirkung von Blockern und ein "
            "durchgerechnetes Beispiel über alle 169 Starthände."
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        braucht_evaluator=False,
        besondere_annahmen={
            "farben_gleichwertig": (
                "Die 169 Klassen entstehen daraus, dass die vier Farben "
                "untereinander gleichwertig sind: Es zählt nur, ob beide Karten "
                "dieselbe Farbe haben."
            ),
            "blocker_sind_rein_kombinatorisch": (
                "Gezählt wird, welche Kombos noch im Deck sein KÖNNEN. Dass ein "
                "Gegner eine bestimmte Hand auch spielen würde, ist eine ganz "
                "andere Frage und hier ausdrücklich nicht enthalten."
            ),
            "keine_range_annahmen": (
                "Es wird keine Gegner-Range unterstellt. Alle Kombos gelten als "
                "gleich möglich."
            ),
        },
    )
    from pathlib import Path
    ziel = Path(__file__).resolve().parent.parent / "output" / "b3_kombinatorik.json"
    schreibe(ziel, meta, inhalt)

    k = inhalt["kombos_je_typ"]
    g = inhalt["gesamt"]
    print(f"B3 geschrieben: {ziel}")
    print(f"  Kombos: Paar {k['Paar']}, suited {k['suited']}, offsuit {k['offsuit']}, "
          f"zusammen {k['suited_und_offsuit_zusammen']}")
    print(f"  {g['starthand_klassen']} Klassen, {g['zweikartenblaetter']} Zweikartenblätter")
    b = inhalt["beispiel"]
    print(f"  Beispiel {b['hand']} auf {b['board']}: {b['summe_vorher']} → {b['summe_nachher']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
