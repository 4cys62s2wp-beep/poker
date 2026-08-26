"""B4 — die Farb-Isomorphie muss exakt dasselbe liefern wie die volle Rechnung.

Die Reduktion um Faktor 17 ist der einzige Grund, warum B4 in Stunden statt in
Wochen rechnet. Wäre sie falsch, wäre jede Zahl in der Matrix falsch — und
zwar plausibel falsch, was schlimmer ist als offensichtlich falsch.

Deshalb wird sie hier gegen die **vollständige Enumeration ohne jede
Reduktion** gehalten: jedes konkrete Kombo-Paar einzeln gerechnet, ungewichtet
gemittelt. Verlangt wird exakte Übereinstimmung, keine Toleranz.
"""

import pytest

from b4_preflop_equity import (
    enumeriere, farbbeziehung, farbkonfigurationen, kanonform, rechne_matchup,
)
from karten import aus_text, kombos_fuer_kuerzel

#: Bewusst kleine Klassen, damit die volle Gegenrechnung in Minuten läuft.
GEGENPROBEN = [
    ("AKs", "QJs"),
    ("AKs", "AKs"),
    ("AA", "KK"),
    ("AA", "AKs"),
    ("72o", "AKs"),
]


def _h(text):
    return tuple(aus_text(x) for x in text.split())


def voll_ohne_reduktion(kuerzel_a: str, kuerzel_b: str) -> float:
    """Jedes konkrete Kombo-Paar einzeln, ohne Farb-Isomorphie."""
    summe = 0.0
    anzahl = 0
    for a in kombos_fuer_kuerzel(kuerzel_a):
        for b in kombos_fuer_kuerzel(kuerzel_b):
            if set(a) & set(b):
                continue
            summe += enumeriere(a, b)["equity_a"]
            anzahl += 1
    return summe / anzahl


@pytest.mark.langsam
@pytest.mark.parametrize("a,b", GEGENPROBEN)
def test_reduktion_liefert_exakt_dasselbe(a, b):
    mit = rechne_matchup(a, b)["equity_a"]
    ohne = voll_ohne_reduktion(a, b)
    # Die winzige Schranke deckt nur die Reihenfolge der Gleitkomma-Additionen
    # ab, nicht einen Rechenunterschied.
    assert abs(mit - ohne) < 1e-12, f"{a} gegen {b}: mit {mit!r}, ohne {ohne!r}"


@pytest.mark.parametrize("a,b", GEGENPROBEN)
def test_die_gewichte_decken_alle_paarungen_ab(a, b):
    """Schnelle Gegenprobe ohne Enumeration: Die Häufigkeiten der
    Farbkonfigurationen müssen genau alle konkreten Paarungen abdecken."""
    gruppen = farbkonfigurationen(a, b)
    summe = sum(g["anzahl"] for g in gruppen.values())
    erwartet = sum(
        1
        for x in kombos_fuer_kuerzel(a)
        for y in kombos_fuer_kuerzel(b)
        if not set(x) & set(y)
    )
    assert summe == erwartet


def test_kanonform_ist_unter_farbumbenennung_stabil():
    """Zwei Paarungen, die durch Farbtausch auseinander hervorgehen, müssen
    dieselbe Kanonform haben – sonst rechnet B4 dieselbe Sache mehrfach."""
    assert kanonform(_h("Ah Kh"), _h("Qs Qd")) == kanonform(_h("As Ks"), _h("Qh Qd"))
    # Eine geteilte Farbe ist dagegen etwas anderes.
    assert kanonform(_h("Ah Kh"), _h("Qh Qd")) != kanonform(_h("Ah Kh"), _h("Qs Qd"))


def test_farbbeziehung_erkennt_die_geteilte_farbe():
    assert "keine gemeinsame Farbe" in farbbeziehung(_h("Ah Kh"), _h("Qs Js"))
    assert "gleiche Farbe" in farbbeziehung(_h("Ah Kh"), _h("Qh Jh"))


@pytest.mark.parametrize("a,b", [("AKs", "QJs"), ("AA", "KK")])
def test_ein_matchup_ist_in_sich_stimmig(a, b):
    e = rechne_matchup(a, b)
    assert abs(e["equity_a"] + e["equity_b"] - 1.0) < 1e-12
    assert e["niedrigste_equity_a"] <= e["equity_a"] <= e["hoechste_equity_a"]
    assert e["spanne_relevant"] == (e["spanne_pp"] > 1.0)
    for k in e["farbkonfigurationen"]:
        assert k["siege_a"] + k["siege_b"] + k["split"] == k["boards"]


def test_eine_hand_gegen_sich_selbst_ist_genau_ausgeglichen():
    """Symmetrie: Halten beide dieselbe Klasse, muss 50 % herauskommen. Das
    prüft die Gewichtung mit – die einzelnen Konfigurationen sind es nicht."""
    e = rechne_matchup("AKs", "AKs")
    assert abs(e["equity_a"] - 0.5) < 1e-9
