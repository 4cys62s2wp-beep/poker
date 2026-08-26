"""Was jede Ausgabedatei erfüllen muss.

Diese Tests prüfen keine Ergebnisse, sondern die Form: Ohne Annahmenblock ist
eine Zahl nicht verwertbar, und ohne Methodenangabe weiß niemand, ob sie exakt
ist oder geschätzt.
"""

import json
from pathlib import Path

import pytest

AUSGABE = Path(__file__).resolve().parent.parent / "output"
BLOCKDATEIEN = sorted(AUSGABE.glob("b*_*.json"))


def test_es_gibt_ueberhaupt_ausgabedateien():
    assert BLOCKDATEIEN, "Kein Rechenblock hat etwas geschrieben"


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_metadatenblock_ist_vollstaendig(datei):
    d = json.loads(datei.read_text(encoding="utf-8"))
    m = d.get("metadaten")
    assert m, f"{datei.name} hat keinen Metadatenblock"
    for feld in ("schema_version", "block", "zweck", "methode", "annahmen",
                 "erzeugt_am", "laufzeit_s", "umgebung"):
        assert feld in m, f"{datei.name}: '{feld}' fehlt"
    assert m["methode"] in ("exakt", "monte-carlo")
    if m["methode"] == "monte-carlo":
        assert "monte_carlo" in m, f"{datei.name}: Schätzung ohne Angabe der Unsicherheit"
        for feld in ("iterationen", "seed"):
            assert feld in m["monte_carlo"], f"{datei.name}: {feld} fehlt"


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_die_annahmen_stehen_in_jeder_datei(datei):
    """E1: Der Annahmenblock gehört in JEDE Datei, nicht einmal am Rand."""
    a = json.loads(datei.read_text(encoding="utf-8"))["metadaten"]["annahmen"]
    for feld in ("sicht", "unbekannte_karten", "split_pot", "kartenzahlen"):
        assert feld in a, f"{datei.name}: Annahme '{feld}' fehlt"
    # Seit dem Umstieg auf zweisprachige Anzeigetexte ist jede dieser
    # Annahmen ein {de, en}-Paar. Beide Sprachen sind Pflicht: Eine App, die
    # auf Englisch eine deutsche Annahme zeigt, hat keine Annahme gezeigt.
    for feld in ("sicht", "unbekannte_karten", "split_pot"):
        assert set(a[feld]) == {"de", "en"}, f"{datei.name}: '{feld}' nicht zweisprachig"
        assert a[feld]["de"] and a[feld]["en"]
    assert "Heldensicht" in a["sicht"]["de"]
    assert "0,5" in a["split_pot"]["de"]
    assert "0.5" in a["split_pot"]["en"]


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_die_deckgroessen_sind_ueberall_dieselben(datei):
    """Ein Annahmenblock, der zwischen Dateien abweicht, wäre schlimmer als
    keiner – dann glaubt man ihm."""
    from metadaten import standard_annahmen
    a = json.loads(datei.read_text(encoding="utf-8"))["metadaten"]["annahmen"]
    assert a["kartenzahlen"] == standard_annahmen()["kartenzahlen"]


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_kein_wert_ist_unendlich_oder_keine_zahl(datei):
    """NaN und Infinity sind in JSON zwar erlaubt, aber in einer Zahlentabelle
    immer ein Fehler."""
    import math

    def pruefe(knoten, pfad="")  :
        if isinstance(knoten, dict):
            for k, v in knoten.items():
                pruefe(v, f"{pfad}.{k}")
        elif isinstance(knoten, list):
            for i, v in enumerate(knoten):
                pruefe(v, f"{pfad}[{i}]")
        elif isinstance(knoten, float):
            assert math.isfinite(knoten), f"{datei.name}{pfad} ist {knoten}"

    pruefe(json.loads(datei.read_text(encoding="utf-8")))


# ---------------------------------------------------------------------------
# Was die App neben jeder Zahl verspricht, muss in der Datei stehen
# ---------------------------------------------------------------------------
#
# Die Herkunftsanzeige („Warum diese Zahl?") nennt Rechenweg, Fallzahl und
# Bibliothek. Fehlt eine dieser Angaben, kann die App nur schweigen oder
# raten — und Raten ist hier der schlimmere Fehler. Also muss sie in der
# Datei stehen, und zwar in jeder.

@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_jede_datei_nennt_ihre_fallzahl(datei):
    m = json.loads(datei.read_text(encoding="utf-8"))["metadaten"]
    f = m["faelle_enumeriert"]
    assert f["gesamt"] > 0, f"{datei.name}: null Fälle gezählt"
    assert f["je_teil"], f"{datei.name}: keine Aufschlüsselung der Fälle"
    assert sum(f["je_teil"].values()) == f["gesamt"], (
        f"{datei.name}: die Aufschlüsselung ergibt nicht die Gesamtzahl"
    )


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_jede_datei_sagt_womit_gerechnet_wurde(datei):
    """Entweder eine Bibliothek mit Version — oder der Grund, warum keine.

    Ein weggelassenes Feld sieht aus wie ein Versäumnis. „Hier war keine
    nötig, weil es reine Kombinatorik ist" ist eine Auskunft.
    """
    m = json.loads(datei.read_text(encoding="utf-8"))["metadaten"]
    e = m["evaluator"]
    if e["name"] is None:
        assert set(e["begruendung"]) == {"de", "en"}, (
            f"{datei.name}: Begründung ohne Bibliothek muss zweisprachig sein"
        )
        assert e["begruendung"]["de"] and e["begruendung"]["en"]
    else:
        assert e["version"], f"{datei.name}: Bibliothek ohne Version"
        assert e["nachweis"], f"{datei.name}: Bibliothek ohne Korrektheitsnachweis"


@pytest.mark.parametrize("datei", BLOCKDATEIEN, ids=lambda p: p.name)
def test_jeder_anzeigbare_text_ist_zweisprachig(datei):
    """Kein Feld, das die App zeigen kann, darf einsprachig sein.

    Geprüft wird nicht der Text, sondern die Form: Wo ein {de, en}-Paar
    hingehört, darf keine nackte Zeichenkette stehen. Eine englische Fassung,
    die deutsche Begriffe zeigt, ist der Fehler, der niemandem auffällt, weil
    ihn nur sieht, wer die App auf Englisch benutzt.
    """
    d = json.loads(datei.read_text(encoding="utf-8"))
    m = d["metadaten"]

    def paar(wert, wo):
        assert isinstance(wert, dict) and set(wert) == {"de", "en"}, (
            f"{datei.name}: {wo} ist nicht zweisprachig: {wert!r}"
        )
        assert wert["de"].strip() and wert["en"].strip(), f"{datei.name}: {wo} halb leer"

    paar(m["zweck"], "metadaten.zweck")
    for feld in ("sicht", "unbekannte_karten", "split_pot"):
        paar(m["annahmen"][feld], f"metadaten.annahmen.{feld}")
    for schluessel, wert in m["annahmen"].get("block_spezifisch", {}).items():
        paar(wert, f"metadaten.annahmen.block_spezifisch.{schluessel}")
    for i, b in enumerate(d.get("befunde", [])):
        assert b.get("aussage_en"), f"{datei.name}: befunde[{i}] ohne englische Fassung"

    for i, e in enumerate(d.get("beispiele", [])):
        paar(e["name"], f"beispiele[{i}].name")
        paar(e["zielkategorie"], f"beispiele[{i}].zielkategorie")
    for i, e in enumerate(d.get("gegenbeispiele_saubere_outs", [])):
        paar(e["name"], f"gegenbeispiele[{i}].name")
        paar(e["erklaerung"], f"gegenbeispiele[{i}].erklaerung")
    for i, e in enumerate(d.get("einsatzgroessen", [])):
        paar(e["name"], f"einsatzgroessen[{i}].name")
