"""Die gewählte Bibliothek gegen den Regel-Evaluator und gegen eine zweite.

Der vollständige Nachweis über alle 2 598 960 Blätter läuft in
`src/pruefe_evaluatoren.py` und dauert rund vierzig Sekunden. Hier steht die
schnelle Fassung für den täglichen Testlauf: eine **deterministische**
Auswahl, die jeden Blatttyp trifft, plus die Randfälle, an denen Evaluatoren
erfahrungsgemäß scheitern.

Zusätzlich läuft `phevaluator` als zweite Meinung mit. Zwei unabhängige
Implementierungen, die sich einig sind, sind ein deutlich stärkeres Argument
als eine.
"""

from itertools import combinations

import pytest

from karten import ALLE_KARTEN, aus_text, blatt_als_text
from referenz_evaluator import schluessel

eval7 = pytest.importorskip("eval7")
phe = pytest.importorskip("phevaluator")

from karten import TEXT_JE_KARTE  # noqa: E402

EVAL7_KARTEN = tuple(eval7.Card(t) for t in TEXT_JE_KARTE)


def eval7_wert(karten):
    return eval7.evaluate([EVAL7_KARTEN[c] for c in karten])


def phe_wert(karten):
    # phevaluator zählt andersherum: kleiner ist besser.
    return -phe.evaluate_cards(*(TEXT_JE_KARTE[c] for c in karten))


def _teildeck(raenge: str) -> list[int]:
    """Alle vier Farben zu den genannten Rängen."""
    return [aus_text(r + f) for r in raenge for f in "cdhs"]


# Zwei verkleinerte Decks, in denen jeweils VOLLSTÄNDIG durchgezählt wird.
#
# Warum nicht einfach jedes n-te Blatt aus dem ganzen Deck: Genau das stand
# hier zuerst – und es hat eine absichtlich eingebaute Fehlfunktion NICHT
# gefunden. Der Kicker beim Vierling wurde ignoriert, und der Test blieb grün,
# weil Vierlinge nur 0,024 % aller Blätter ausmachen und in einer Stichprobe
# von wenigen tausend Blättern praktisch nie zweimal vorkommen.
#
# Vollständiges Durchzählen in einem kleinen Deck löst das: Dort ist jede
# Kategorie und jede Gleichstandsform garantiert mehrfach vertreten.
#
#   Deck A: nicht benachbarte Ränge -> keine Straßen, dafür alle Paarformen
#           bis zum Vierling, in jeder Farbverteilung
#   Deck B: benachbarte Ränge plus Ass -> Straßen, Straight Flushes und das
#           Rad (A-2-3-4-5), das die häufigste Fehlerquelle überhaupt ist
DECK_OHNE_STRASSEN = _teildeck("258JA")
DECK_MIT_STRASSEN = _teildeck("23456A")


def deterministische_auswahl(schrittweite: int = 977):
    """Vollständige kleine Decks plus jedes n-te Blatt aus dem ganzen Deck.

    Die kleinen Decks sichern die Abdeckung, die Stichprobe aus dem vollen
    Deck sichert die Breite (echte Kicker-Kombinationen über alle 13 Ränge).
    Die Schrittweite ist eine Primzahl, damit die Auswahl nicht mit der
    Kartenreihenfolge in Takt gerät.
    """
    for deck in (DECK_OHNE_STRASSEN, DECK_MIT_STRASSEN):
        yield from combinations(deck, 5)
    for i, blatt in enumerate(combinations(ALLE_KARTEN, 5)):
        if i % schrittweite == 0:
            yield blatt


RANDFAELLE = [
    "As Ks Qs Js Ts",   # höchster Straight Flush
    "5s 4s 3s 2s As",   # das Rad in einer Farbe
    "5h 4d 3c 2s Ah",   # das Rad ohne Flush
    "Ah Kd Qc Js Th",   # Ass-hohe Straße
    "2h 2d 2c 2s 3h",   # kleinster Vierling
    "2h 3d 4c 5s 7h",   # schwächstes Blatt überhaupt
    "2h 2d 3c 3s 4h",   # kleinste zwei Paare
    "Ah Ad Ac Ks Kh",   # größtes Full House
]


@pytest.mark.parametrize("bewerte,name", [(eval7_wert, "eval7"), (phe_wert, "phevaluator")])
def test_ordnung_stimmt_ueber_eine_deterministische_auswahl(bewerte, name):
    """Gleiche Klassen und gleiche Reihenfolge wie die Regeln."""
    ref_zu_lib: dict[int, int] = {}
    lib_zu_ref: dict[int, int] = {}

    for b in deterministische_auswahl():
        r, l = schluessel(b), bewerte(b)
        if ref_zu_lib.setdefault(r, l) != l:
            pytest.fail(f"{name}: gleich stark laut Regeln, verschieden laut Bibliothek "
                        f"– {blatt_als_text(b)}")
        if lib_zu_ref.setdefault(l, r) != r:
            pytest.fail(f"{name}: verschieden stark laut Regeln, gleich laut Bibliothek "
                        f"– {blatt_als_text(b)}")

    paare = sorted(ref_zu_lib.items())
    for (r1, l1), (r2, l2) in zip(paare, paare[1:]):
        assert l1 < l2, f"{name}: Reihenfolge vertauscht zwischen {r1} und {r2}"

    # Gegenprobe gegen einen Test, der grün bleibt, weil er nichts sieht.
    # Die Zahl ist keine gewünschte Größe, sondern eine untere Schranke weit
    # unterhalb des Gemessenen – sie schlägt an, wenn die Auswahl versehentlich
    # zusammenschrumpft, und nicht bei jeder kleinen Änderung.
    assert len(paare) > 500, "Die Auswahl ist zu klein, um etwas zu belegen"


@pytest.mark.parametrize("text", RANDFAELLE)
def test_randfaelle_stimmen_bei_beiden(text):
    b = tuple(aus_text(t) for t in text.split())
    for anderes in RANDFAELLE:
        a = tuple(aus_text(t) for t in anderes.split())
        if set(a) & set(b) and a != b:
            continue  # überlappende Karten: nicht gleichzeitig möglich
        richtung_regeln = (schluessel(b) > schluessel(a)) - (schluessel(b) < schluessel(a))
        for bewerte, name in ((eval7_wert, "eval7"), (phe_wert, "phevaluator")):
            richtung_lib = (bewerte(b) > bewerte(a)) - (bewerte(b) < bewerte(a))
            assert richtung_regeln == richtung_lib, (
                f"{name}: {text} gegen {anderes} – Regeln sagen {richtung_regeln}, "
                f"Bibliothek sagt {richtung_lib}"
            )


def test_beide_bibliotheken_sind_sich_einig():
    """Zwei unabhängige Implementierungen, dieselbe Ordnung."""
    paare_a: dict[int, int] = {}
    for b in deterministische_auswahl(schrittweite=2003):
        a, p = eval7_wert(b), phe_wert(b)
        if paare_a.setdefault(a, p) != p:
            pytest.fail(f"eval7 und phevaluator uneins bei {blatt_als_text(b)}")
    assert len(paare_a) > 500


def test_die_auswahl_deckt_jede_kategorie_mehrfach_ab():
    """Ohne diesen Test wäre der obige wertlos.

    Eine Auswahl, die eine Kategorie nur in einer Stärke enthält, kann dort
    keine Gleichstandsregel prüfen. Genau daran ist die erste Fassung dieses
    Tests gescheitert: Sie enthielt im Mittel weniger als einen Vierling, und
    eine absichtlich eingebaute Fehlfunktion beim Vierling-Kicker blieb
    deshalb unentdeckt.
    """
    from referenz_evaluator import KATEGORIE_NAME, kategorie_und_rangfolge

    # Gezählt werden nicht Blätter, sondern unterschiedliche STÄRKEN je
    # Kategorie. Zwanzig gleich starke Vierlinge belegen nichts über die
    # Kicker-Regel; zwei verschieden starke tun es.
    zaehler: dict[int, set[int]] = {}
    for b in deterministische_auswahl():
        kat, _ = kategorie_und_rangfolge(b)
        zaehler.setdefault(kat, set()).add(schluessel(b))

    fehlend = [KATEGORIE_NAME[k] for k in KATEGORIE_NAME if len(zaehler.get(k, ())) < 2]
    assert not fehlend, (
        "In diesen Kategorien enthält die Auswahl weniger als zwei "
        f"unterschiedlich starke Blätter, dort ist also keine Gleichstandsregel "
        f"prüfbar: {fehlend}"
    )
