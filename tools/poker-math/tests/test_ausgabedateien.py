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
    assert "Heldensicht" in a["sicht"]
    assert "0,5" in a["split_pot"]


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
