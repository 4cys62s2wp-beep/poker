"""B2 — innere Konsistenz der Pot-Odds-Tabelle."""

from fractions import Fraction

import pytest

from b1_outs import MAX_OUTS, zaehle_treffer
from b2_potodds import EINSATZGROESSEN, mindest_outs, noetige_equity, pot_odds
from metadaten import standard_annahmen

NACH_FLOP = standard_annahmen()["kartenzahlen"]["unbekannt_nach_flop"]


@pytest.mark.parametrize("name,name_en,b", EINSATZGROESSEN)
def test_noetige_equity_liegt_zwischen_null_und_der_haelfte(name, name_en, b):
    """Selbst ein unendlich großer Einsatz verlangt nie mehr als 50 % –
    der Gegner legt ja dasselbe hinein. Das ist die harte Schranke."""
    e = noetige_equity(b)
    assert Fraction(0) < e < Fraction(1, 2), f"{name}: {e}"


@pytest.mark.parametrize("name,name_en,b", EINSATZGROESSEN)
def test_die_drei_darstellungen_beschreiben_dieselbe_sache(name, name_en, b):
    """Anteil am Endpot, nötige Equity und Pot Odds müssen sich ineinander
    umrechnen lassen – exakt, als Bruch."""
    e = noetige_equity(b)
    odds = pot_odds(b)
    # Aus „X zu 1" folgt die nötige Equity als 1/(X+1).
    assert e == 1 / (odds + 1)


def test_groesserer_einsatz_verlangt_mehr_equity_und_mehr_outs():
    vorher_e, vorher_outs = None, None
    for _, _en, b in EINSATZGROESSEN:
        e = noetige_equity(b)
        outs = mindest_outs(e, NACH_FLOP)["turn_oder_river"]
        if vorher_e is not None:
            assert e > vorher_e
            assert outs >= vorher_outs
        vorher_e, vorher_outs = e, outs


@pytest.mark.parametrize("name,name_en,b", EINSATZGROESSEN)
def test_die_genannten_outs_reichen_wirklich_und_eines_weniger_nicht(name, name_en, b):
    """Der eigentliche Inhalt der Tabelle: die Zahl muss die KLEINSTE sein,
    die genügt. Ein Test, der nur „reicht aus" prüft, wäre auch mit einer
    viel zu großen Zahl grün."""
    noetig = noetige_equity(b)
    for feld, o in mindest_outs(noetig, NACH_FLOP).items():
        if o is None:
            # Dann darf auch die größte geprüfte Outs-Zahl nicht genügen.
            assert zaehle_treffer(NACH_FLOP, MAX_OUTS)[feld] < noetig, f"{name}/{feld}"
            continue
        assert zaehle_treffer(NACH_FLOP, o)[feld] >= noetig, f"{name}/{feld}: {o} reicht nicht"
        if o > 1:
            assert zaehle_treffer(NACH_FLOP, o - 1)[feld] < noetig, (
                f"{name}/{feld}: {o-1} hätte auch gereicht – die Zahl ist nicht minimal"
            )


def test_halber_pot_verlangt_genau_ein_viertel():
    """Der bekannteste Fall, hier nicht behauptet, sondern gerechnet:
    Bei einem halben Pot landet der eigene Einsatz in einem Pot doppelter
    Größe plus dem eigenen – also genau ein Viertel."""
    assert noetige_equity(Fraction(1, 2)) == Fraction(1, 4)


def test_pot_einsatz_verlangt_genau_ein_drittel():
    assert noetige_equity(Fraction(1, 1)) == Fraction(1, 3)


def test_winziger_einsatz_verlangt_fast_nichts():
    """Grenzverhalten: gegen null geht auch die nötige Equity gegen null."""
    assert noetige_equity(Fraction(1, 1000)) < Fraction(1, 500)
