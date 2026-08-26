"""B3 — innere Konsistenz der Kombinatorik."""

from itertools import combinations

import pytest

from b3_kombinatorik import (
    beispiel_am_board, klassen_je_typ, kombos_je_typ, typ_von, uebrige_kombos,
)
from karten import (
    ALLE_KARTEN, RANG_ZEICHEN, alle_starthand_kuerzel, aus_text, kombos_fuer_kuerzel,
)


def test_klassen_mal_kombos_ergibt_alle_zweikartenblaetter():
    """Die zentrale Probe: Die Einteilung ist vollständig und überlappungsfrei."""
    je_typ = kombos_je_typ()
    klassen = klassen_je_typ()
    summe = sum(je_typ[t] * klassen[t] for t in je_typ)
    assert summe == len(list(combinations(ALLE_KARTEN, 2)))


def test_jede_klasse_eines_typs_hat_gleich_viele_kombos():
    """Sonst wäre „ein Paar hat sechs Kombos" keine Regel, sondern Zufall."""
    je_typ = kombos_je_typ()
    for kuerzel in alle_starthand_kuerzel():
        assert len(kombos_fuer_kuerzel(kuerzel)) == je_typ[typ_von(kuerzel)], kuerzel


def test_die_kombozahlen_ergeben_sich_aus_der_farbenzahl():
    """Gegenprobe über einen zweiten Rechenweg, aus der Zahl der Farben.

    Paar: zwei aus vier Farben. Suited: eine Farbe für beide. Offsuit: alle
    Farbpaare außer den gleichfarbigen.
    """
    farben = len({c % 4 for c in ALLE_KARTEN})
    je_typ = kombos_je_typ()
    assert je_typ["Paar"] == farben * (farben - 1) // 2
    assert je_typ["suited"] == farben
    assert je_typ["offsuit"] == farben * farben - farben


def test_es_gibt_so_viele_klassen_wie_raenge_erlauben():
    raenge = len(RANG_ZEICHEN)
    klassen = klassen_je_typ()
    assert klassen["Paar"] == raenge
    assert klassen["suited"] == raenge * (raenge - 1) // 2
    assert klassen["offsuit"] == klassen["suited"]


@pytest.mark.parametrize("kuerzel", ["AA", "AKs", "AKo", "72o", "22"])
def test_eine_eigene_karte_blockt_hoechstens_alle_kombos(kuerzel):
    kombos = kombos_fuer_kuerzel(kuerzel)
    for karte in ALLE_KARTEN:
        uebrig = uebrige_kombos(kombos, frozenset({karte}))
        assert 0 <= uebrig <= len(kombos)


def test_ein_ass_halbiert_die_asse_paare_nicht_sondern_drittelt_sie():
    """Konkretes Blockerbild, gerechnet: Wer selbst ein Ass hält, lässt von
    den Ass-Paaren nur noch die Kombos aus den drei übrigen Assen zu."""
    kombos = kombos_fuer_kuerzel("AA")
    uebrig = uebrige_kombos(kombos, frozenset({aus_text("As")}))
    verbleibende_asse = 4 - 1
    assert uebrig == verbleibende_asse * (verbleibende_asse - 1) // 2


def test_beide_eigenen_karten_blocken_die_gleiche_hand_stark():
    """A-K in der Hand lässt von A-K des Gegners deutlich weniger übrig."""
    bekannt = frozenset({aus_text("Ah"), aus_text("Kh")})
    for kuerzel in ("AKs", "AKo"):
        kombos = kombos_fuer_kuerzel(kuerzel)
        uebrig = uebrige_kombos(kombos, bekannt)
        assert uebrig < len(kombos), kuerzel


def test_beispiel_geht_genau_auf():
    """Was nach dem Blocker-Abzug übrig bleibt, muss exakt die Zahl der
    Zweikartenblätter aus den unbekannten Karten sein."""
    b = beispiel_am_board("Ah Kh", "Qh 7c 2d")
    unbekannt = len(ALLE_KARTEN) - b["bekannte_karten"]
    assert b["summe_nachher"] == unbekannt * (unbekannt - 1) // 2
    assert b["summe_vorher"] == len(list(combinations(ALLE_KARTEN, 2)))


def test_kein_eintrag_im_beispiel_wird_negativ():
    b = beispiel_am_board("Ah Kh", "Qh 7c 2d")
    for e in b["je_starthand"]:
        assert 0 <= e["nachher"] <= e["vorher"]
        assert e["weggeblockt"] == e["vorher"] - e["nachher"]


def test_unberuehrte_haende_verlieren_keine_kombos():
    """Eine Hand, deren Ränge nirgends bekannt sind, bleibt vollständig."""
    b = beispiel_am_board("Ah Kh", "Qh 7c 2d")
    beruehrt = set("AKQ72")
    for e in b["je_starthand"]:
        if not (set(e["hand"][:2]) & beruehrt):
            assert e["weggeblockt"] == 0, e["hand"]
