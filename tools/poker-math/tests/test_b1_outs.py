"""B1 — innere Konsistenz der Outs-Tabelle.

Geprüft wird nicht gegen erinnerte Werte, sondern gegen Eigenschaften, die
gelten MÜSSEN, wenn die Rechnung stimmt: Wahrscheinlichkeiten liegen zwischen
null und eins, mehr Outs sind nie schlechter, und die Gegenwahrscheinlichkeit
ergänzt sich zu eins.
"""

from fractions import Fraction

import pytest

from b1_outs import (
    MAX_OUTS, BEISPIELE, faustregel, geschlossene_form, zaehle_outs, zaehle_treffer,
)
from metadaten import standard_annahmen

Z = standard_annahmen()["kartenzahlen"]
NACH_FLOP = Z["unbekannt_nach_flop"]
NACH_TURN = Z["unbekannt_nach_turn"]


def test_deckgroessen_ergeben_sich_aus_den_regeln():
    """47 und 46 stehen nirgends im Code – sie fallen aus 52 minus Hand minus
    Board heraus. Dieser Test hält fest, dass die Ableitung stimmt."""
    assert NACH_FLOP == Z["deck"] - Z["eigene_karten"] - 3
    assert NACH_TURN == NACH_FLOP - 1


@pytest.mark.parametrize("outs", range(0, MAX_OUTS + 1))
def test_zaehlung_und_geschlossene_form_sind_exakt_gleich(outs):
    """Zwei unabhängige Wege, exakt derselbe Bruch – keine Fließkommatoleranz."""
    gezaehlt = zaehle_treffer(NACH_FLOP, outs)
    formel = geschlossene_form(NACH_FLOP, NACH_TURN, outs)
    assert gezaehlt == formel


@pytest.mark.parametrize("outs", range(0, MAX_OUTS + 1))
def test_wahrscheinlichkeiten_liegen_zwischen_null_und_eins(outs):
    for name, wert in zaehle_treffer(NACH_FLOP, outs).items():
        assert Fraction(0) <= wert <= Fraction(1), f"{name} bei {outs} Outs: {wert}"


@pytest.mark.parametrize("outs", range(0, MAX_OUTS + 1))
def test_gegenwahrscheinlichkeit_ergaenzt_sich_zu_eins(outs):
    """P(mindestens einer trifft) + P(keiner trifft) = 1, ausgezählt."""
    w = zaehle_treffer(NACH_FLOP, outs)
    verfehlt = Fraction(NACH_FLOP - outs, NACH_FLOP) * Fraction(NACH_TURN - outs, NACH_TURN)
    assert w["turn_oder_river"] + verfehlt == 1


def test_null_outs_treffen_nie_und_alle_outs_immer():
    keine = zaehle_treffer(NACH_FLOP, 0)
    assert all(w == 0 for w in keine.values())
    alle = zaehle_treffer(NACH_FLOP, NACH_FLOP)
    assert alle["turn"] == 1 and alle["turn_oder_river"] == 1


def test_mehr_outs_ist_nie_schlechter():
    vorher = None
    for outs in range(0, MAX_OUTS + 1):
        w = zaehle_treffer(NACH_FLOP, outs)
        if vorher is not None:
            for name in w:
                assert w[name] >= vorher[name], f"{name} fällt bei {outs} Outs"
        vorher = w


@pytest.mark.parametrize("outs", range(1, MAX_OUTS + 1))
def test_zwei_strassen_sind_besser_als_eine(outs):
    w = zaehle_treffer(NACH_FLOP, outs)
    assert w["turn_oder_river"] > w["turn"]
    assert w["turn_oder_river"] > w["river_nach_fehlschlag"]


@pytest.mark.parametrize("outs", range(1, MAX_OUTS + 1))
def test_river_nach_fehlschlag_ist_etwas_besser_als_der_turn(outs):
    """Weniger Karten im Deck, gleich viele Outs – die Chance steigt leicht."""
    w = zaehle_treffer(NACH_FLOP, outs)
    assert w["river_nach_fehlschlag"] > w["turn"]


@pytest.mark.parametrize("outs", range(1, MAX_OUTS + 1))
def test_river_unbedingt_ist_genauso_wahrscheinlich_wie_der_turn(outs):
    """Ohne Bedingung ist jede Position im Deck gleich wahrscheinlich ein Out.
    Das ist keine Näherung, sondern gilt exakt – hier ausgezählt."""
    w = zaehle_treffer(NACH_FLOP, outs)
    assert w["river_unbedingt"] == w["turn"]


def test_die_faustregel_verspricht_bei_vielen_outs_zu_viel():
    """Der Lerninhalt selbst: Der Fehler wächst und wechselt das Vorzeichen."""
    abweichungen = {}
    for outs in range(1, MAX_OUTS + 1):
        w = zaehle_treffer(NACH_FLOP, outs)
        r = faustregel(outs)
        abweichungen[outs] = (r["zwei_karten"] - w["turn_oder_river"]) * 100

    # Bei wenigen Outs untertreibt die Regel, bei vielen übertreibt sie.
    assert abweichungen[1] < 0
    assert abweichungen[MAX_OUTS] > 0
    # Und die Übertreibung wächst ab dem Vorzeichenwechsel durchgehend.
    ab = [o for o in abweichungen if abweichungen[o] > 0]
    for a, b in zip(ab, ab[1:]):
        assert abweichungen[b] > abweichungen[a], f"Fehler wächst nicht von {a} auf {b}"


def test_unmoegliche_outszahl_wird_abgelehnt():
    with pytest.raises(ValueError):
        zaehle_treffer(NACH_FLOP, NACH_FLOP + 1)
    with pytest.raises(ValueError):
        zaehle_treffer(NACH_FLOP, -1)


# ---------------------------------------------------------------------------
# Die gezählten Beispiele
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("name,hand,flop,ziel", BEISPIELE)
def test_beispiele_sind_in_sich_stimmig(name, hand, flop, ziel):
    from referenz_evaluator import KATEGORIE_NAME
    nach_name = {v: k for k, v in KATEGORIE_NAME.items()}

    streng = zaehle_outs(hand, flop, nach_name[ziel])
    mit_board = zaehle_outs(hand, flop, nach_name[ziel], nur_mit_eigener_karte=False)
    beliebig = zaehle_outs(hand, flop)

    assert 0 < streng <= NACH_FLOP, f"{name}: {streng} Outs sind nicht plausibel"
    # Wer Boardtreffer mitzählt, kommt nie auf weniger.
    assert mit_board >= streng, name
    # Jede beliebige Verbesserung schließt die Verbesserung bis zum Ziel ein.
    assert beliebig >= 1, name


def test_ein_boardpaar_ist_kein_out_fuer_zwei_ueberkarten():
    """Der Fall, an dem die Definition hängt.

    Hero hält A-K, der Flop ist 9-7-2. Eine weitere Neun hebt Heros Kategorie
    auf „Ein Paar" – aber das Paar liegt auf dem Board und gehört jedem am
    Tisch. Als Out zählt nur, was eine eigene Karte trifft.
    """
    from referenz_evaluator import EIN_PAAR
    streng = zaehle_outs("Ac Kd", "9h 7s 2c", EIN_PAAR)
    mit_board = zaehle_outs("Ac Kd", "9h 7s 2c", EIN_PAAR, nur_mit_eigener_karte=False)
    assert mit_board > streng, "Die Unterscheidung greift nicht"
    # Genau die Karten, die einen eigenen Rang treffen.
    assert streng == 2 * (4 - 1)


def test_flushdraw_zaehlt_die_restlichen_karten_der_farbe():
    """Vier der dreizehn Karten einer Farbe sind bekannt, der Rest sind Outs."""
    from referenz_evaluator import FLUSH
    from karten import RANG_ZEICHEN
    assert zaehle_outs("Ah 7h", "Kh 4h 2c", FLUSH) == len(RANG_ZEICHEN) - 4


# ---------------------------------------------------------------------------
# Die Gegenbeispiele zur Annahme „saubere Outs"
# ---------------------------------------------------------------------------

def test_die_gegenbeispiele_tragen_wirklich():
    """Jedes Gegenbeispiel muss BEIDES zeigen: dass die Karte Heros Blatt
    verbessert (sonst ist sie kein Out) und dass Hero trotzdem verliert
    (sonst ist es kein Gegenbeispiel).

    Die Prüffunktion wirft, wenn eines von beidem nicht stimmt – genau das ist
    beim Aufbau des zweiten Beispiels passiert: Bei einem Flop wie 7-6-2 kann
    niemand eine höhere Straße halten, das Beispiel trug nicht und musste neu
    gebaut werden.
    """
    from b1_outs import GEGENBEISPIELE, pruefe_gegenbeispiele

    faelle = pruefe_gegenbeispiele()
    assert len(faelle) == len(GEGENBEISPIELE)
    for f in faelle:
        assert f["hero_verbessert_sich"], f["name"]
        assert f["hero_verliert_trotzdem"], f["name"]


def test_die_gegenbeispiele_decken_verschiedene_ursachen_ab():
    """Drei Beispiele derselben Ursache wären eines."""
    from b1_outs import pruefe_gegenbeispiele
    ursachen = {f["gegner_nachher"] for f in pruefe_gegenbeispiele()}
    assert len(ursachen) >= 3, f"Nur {ursachen} – zu wenig Vielfalt"
