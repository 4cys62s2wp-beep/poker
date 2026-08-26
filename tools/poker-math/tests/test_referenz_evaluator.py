"""Der Regel-Evaluator gegen die Regeln selbst.

Diese Tests prüfen keine Zahlen, sondern Regeln: welche Kategorie ein Blatt
hat und welches von zwei Blättern gewinnt. Beides ist die Definition des
Spiels, keine berechnete Größe.
"""

from itertools import combinations

import pytest

from karten import ALLE_KARTEN, aus_text, als_text, starthand_kuerzel
from referenz_evaluator import KATEGORIE_NAME, kategorie_und_rangfolge, schluessel


def blatt(text: str):
    return [aus_text(t) for t in text.split()]


@pytest.mark.parametrize("text,erwartet", [
    ("As Ks Qs Js Ts", "Straight Flush"),
    ("5s 4s 3s 2s As", "Straight Flush"),      # das Rad in einer Farbe
    ("9h 9d 9c 9s 2h", "Vierling"),
    ("8h 8d 8c 3s 3h", "Full House"),
    ("Ah Th 7h 4h 2h", "Flush"),
    ("9h 8d 7c 6s 5h", "Straße"),
    ("5h 4d 3c 2s Ah", "Straße"),              # das Rad ohne Flush
    ("Ah Kd Qc Js Th", "Straße"),              # Ass als höchste Karte
    ("Qh Qd Qc 8s 3h", "Drilling"),
    ("Jh Jd 4c 4s 9h", "Zwei Paare"),
    ("7h 7d Kc 9s 2h", "Ein Paar"),
    ("Kh Jd 9c 6s 3h", "High Card"),
])
def test_kategorie(text, erwartet):
    kategorie, _ = kategorie_und_rangfolge(blatt(text))
    assert KATEGORIE_NAME[kategorie] == erwartet


@pytest.mark.parametrize("stark,schwach,warum", [
    ("As Ks Qs Js Ts", "5s 4s 3s 2s As", "Ass-hoher Straight Flush schlägt das Rad"),
    ("2h 2d 2c 2s 3h", "As Ks Qs Js 9s", "Vierling Zweien schlägt Ass-Flush"),
    ("2h 2d 2c 3s 3h", "As Ks Qs Js 9s", "Full House schlägt Flush"),
    ("2h 3h 4h 5h 7h", "Ah Kd Qc Js Th", "Der kleinste Flush schlägt die höchste Straße"),
    ("9h 8d 7c 6s 5h", "5h 4d 3c 2s Ah", "Neun-hohe Straße schlägt das Rad"),
    ("Ah Ad Kh Kd 2h", "Ah Ad Qh Qd Kh", "Höheres zweites Paar entscheidet"),
    ("Ah Kd Qc Js 9h", "Ah Kd Qc Js 8h", "Der letzte Kicker entscheidet"),
    ("3h 3d 3c 2s 2h", "2h 2d 2c 3s 3h", "Beim Full House zählt der Drilling zuerst"),
])
def test_reihenfolge(stark, schwach, warum):
    assert schluessel(blatt(stark)) > schluessel(blatt(schwach)), warum


def test_farben_sind_gleichwertig():
    """Dasselbe Blatt in einer anderen Farbe ist exakt gleich stark."""
    a = schluessel(blatt("Ah Kh Qh Jh 9h"))
    b = schluessel(blatt("As Ks Qs Js 9s"))
    assert a == b


def test_reihenfolge_der_karten_ist_egal():
    a = schluessel(blatt("Ah Kd Qc Js 9h"))
    b = schluessel(blatt("9h Js Qc Kd Ah"))
    assert a == b


def test_verlangt_genau_fuenf_karten():
    for text in ("Ah Kd Qc Js", "Ah Kd Qc Js 9h 8h"):
        with pytest.raises(ValueError):
            kategorie_und_rangfolge(blatt(text))


def test_kartendarstellung_ist_umkehrbar():
    """Text -> Zahl -> Text muss dasselbe ergeben, für alle 52 Karten."""
    for k in ALLE_KARTEN:
        assert aus_text(als_text(k)) == k


def test_es_gibt_genau_so_viele_starthandklassen_wie_gezaehlt():
    """Die Zahl steht nirgends im Code – sie wird hier auf zwei voneinander
    unabhängigen Wegen gezählt und muss übereinstimmen."""
    # Weg 1: über alle konkreten Zweikartenblätter
    ueber_blaetter = {starthand_kuerzel(a, b) for a, b in combinations(ALLE_KARTEN, 2)}
    # Weg 2: über die Bauvorschrift – Paare, suited und offsuit je Rangpaar
    from karten import RANG_ZEICHEN
    ueber_vorschrift = set()
    for i, hoch in enumerate(RANG_ZEICHEN):
        ueber_vorschrift.add(hoch * 2)
        for tief in RANG_ZEICHEN[:i]:
            ueber_vorschrift.add(hoch + tief + "s")
            ueber_vorschrift.add(hoch + tief + "o")
    assert ueber_blaetter == ueber_vorschrift


def test_jedes_zweikartenblatt_faellt_in_genau_eine_klasse():
    """Die Klassen müssen die 1326 Blätter vollständig und überschneidungsfrei
    aufteilen. Auch 1326 steht nirgends im Code."""
    blaetter = list(combinations(ALLE_KARTEN, 2))
    zaehler: dict[str, int] = {}
    for a, b in blaetter:
        k = starthand_kuerzel(a, b)
        zaehler[k] = zaehler.get(k, 0) + 1
    assert sum(zaehler.values()) == len(blaetter)
