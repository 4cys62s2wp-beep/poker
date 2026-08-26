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

from befunde import befund, zahl
from karten import (
    ALLE_KARTEN, RANG_ZEICHEN, alle_starthand_kuerzel, aus_text,
    kombos_fuer_kuerzel, starthand_kuerzel,
)
from metadaten import Faelle, metadatenblock, ohne_evaluator, schreibe, zs

#: Zählt mit, was diese Rechnung durchgeht – für die Herkunftsanzeige.
FAELLE = Faelle()


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
        FAELLE.zaehle("zweikartenblaetter_eingeordnet")
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
            FAELLE.zaehle("bekannte_kartenmengen_geprueft")
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
        FAELLE.zaehle("starthandklassen_am_board_geprueft")
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
    globals()["FAELLE"] = Faelle()
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
        "befunde": [],  # wird unten gefüllt, weil es die obigen Werte braucht
    }


def befunde_zu_b3(inhalt: dict) -> list[dict]:
    """Aussagen über die Kombinatorik, aus ihr erzeugt."""
    k = inhalt["kombos_je_typ"]
    g = inhalt["gesamt"]
    beispiel = inhalt["beispiel"]

    # Ein einzelnes Ass in der eigenen Hand: Wie viele Ass-Paare bleiben?
    ein_ass = next(z for z in inhalt["blocker"]["Paar"] if z["bekannte_karten"] == 1)
    schlimmster = ein_ass["schlimmstenfalls_uebrig"]
    bester = ein_ass["bestenfalls_uebrig"]

    am_meisten = beispiel["am_staerksten_geblockt"][0]

    return [
        befund(
            "kombos_je_typ",
            f"Ein Paar hat {k['Paar']} Kombos, eine suited Hand {k['suited']}, "
            f"eine offsuit Hand {k['offsuit']} – zusammen {k['suited_und_offsuit_zusammen']} "
            f"je Rangpaar.",
            f"A pair has {k['Paar']} combos, a suited hand {k['suited']}, an "
            f"offsuit hand {k['offsuit']} – together "
            f"{k['suited_und_offsuit_zusammen']} per pair of ranks.",
            {**k, "gezaehlt_ueber": g["zweikartenblaetter"]},
        ),
        befund(
            "einteilung_geht_auf",
            f"Die {g['starthand_klassen']} Klassen decken genau die "
            f"{g['zweikartenblaetter']} Zweikartenblätter ab – lückenlos und "
            f"ohne Überschneidung.",
            f"The {g['starthand_klassen']} classes cover exactly the "
            f"{g['zweikartenblaetter']} two-card hands – with no gap and no "
            f"overlap.",
            {
                "klassen": g["starthand_klassen"],
                "zweikartenblaetter": g["zweikartenblaetter"],
                "klassen_je_typ": inhalt["klassen_je_typ"],
            },
        ),
        befund(
            "blocker_sind_keine_feste_zahl",
            f"Eine einzige bekannte Karte lässt von den {k['Paar']} Kombos eines "
            f"Paares zwischen {schlimmster} und {bester} übrig – je nachdem, ob "
            f"sie die Hand berührt.",
            f"A single known card leaves between {schlimmster} and {bester} of "
            f"a pair's {k['Paar']} combos – depending on whether it touches the "
            f"hand.",
            {
                "kombos_ohne_blocker": k["Paar"],
                "schlimmstenfalls_uebrig": schlimmster,
                "bestenfalls_uebrig": bester,
                "im_mittel_uebrig": ein_ass["im_mittel_uebrig"],
                "faelle_geprueft": ein_ass["faelle_geprueft"],
            },
        ),
        befund(
            "beispielboard",
            f"Am Board {beispiel['board']} mit {beispiel['hand']} in der Hand "
            f"bleiben von {beispiel['summe_vorher']} Kombos noch "
            f"{beispiel['summe_nachher']}. Am stärksten trifft es "
            f"{am_meisten['hand']}: {am_meisten['vorher']} Kombos werden zu "
            f"{am_meisten['nachher']}.",
            f"On the board {beispiel['board']} holding {beispiel['hand']}, "
            f"{beispiel['summe_nachher']} of {beispiel['summe_vorher']} combos "
            f"remain. Hit hardest is {am_meisten['hand']}: "
            f"{am_meisten['vorher']} combos become {am_meisten['nachher']}.",
            {
                "hand": beispiel["hand"],
                "board": beispiel["board"],
                "vorher": beispiel["summe_vorher"],
                "nachher": beispiel["summe_nachher"],
                "am_staerksten_geblockt": am_meisten,
            },
        ),
    ]


def main() -> int:
    start = time.perf_counter()
    inhalt = berechne()
    inhalt["befunde"] = befunde_zu_b3(inhalt)
    meta = metadatenblock(
        block="b3_kombinatorik",
        zweck=zs(
            f"Kombos je Starthand-Typ, Wirkung von Blockern und ein "
            f"durchgerechnetes Beispiel über alle "
            f"{inhalt['gesamt']['starthand_klassen']} Starthände.",
            f"Combos per starting-hand type, the effect of blockers and one "
            f"worked example across all "
            f"{inhalt['gesamt']['starthand_klassen']} starting hands.",
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        faelle=FAELLE,
        evaluator=ohne_evaluator(
            "Hier wird nichts bewertet, sondern gezählt: Welche Kartenpaare es "
            "gibt und welche eine bekannte Karte wegnimmt. Eine Bibliothek zum "
            "Bewerten von Blättern kommt nicht vor.",
            "Nothing is evaluated here, things are counted: which pairs of "
            "cards exist and which ones a known card removes. No hand-"
            "evaluation library is involved.",
        ),
        besondere_annahmen={
            "farben_gleichwertig": zs(
                "Die 169 Klassen entstehen daraus, dass die vier Farben "
                "untereinander gleichwertig sind: Es zählt nur, ob beide Karten "
                "dieselbe Farbe haben.",
                "The 169 classes arise because the four suits are equivalent to "
                "one another: all that counts is whether both cards share a "
                "suit.",
            ),
            "blocker_sind_rein_kombinatorisch": zs(
                "Gezählt wird, welche Kombos noch im Deck sein KÖNNEN. Dass ein "
                "Gegner eine bestimmte Hand auch spielen würde, ist eine ganz "
                "andere Frage und hier ausdrücklich nicht enthalten.",
                "What is counted is which combos CAN still be in the deck. "
                "Whether an opponent would actually play a given hand is an "
                "entirely different question and expressly not included here.",
            ),
            "keine_range_annahmen": zs(
                "Es wird keine Gegner-Range unterstellt. Alle Kombos gelten als "
                "gleich möglich.",
                "No opponent range is assumed. Every combo counts as equally "
                "possible.",
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
    print("  Befunde:")
    for eintrag in inhalt["befunde"]:
        print(f"    · {eintrag['aussage']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
