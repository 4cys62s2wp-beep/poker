"""K2 — jede Aussage ÜBER Zahlen muss aus den Zahlen kommen.

Der Anlass
----------
In `b1_outs.json` stand einmal „die Regel verspricht durchweg zu viel". Sie
verspricht bis sechs Outs zu wenig. Der Satz war plausibel, passte zum
Eindruck aus der Tabelle und war falsch — und kein Test hätte ihn gefunden,
weil Tests bis dahin nur Zahlen prüften, nicht Sätze.

Was diese Datei erzwingt
------------------------
1. Jeder Befund ist **erzeugt**, nicht geschrieben: Jede Zahl in seinem Satz
   muss in seinem Beleg wiederzufinden sein.
2. Jeder Befundsatz steht **wörtlich** in `POKER_MATH.md`. Wer dort etwas
   umformuliert, ohne die Rechnung zu ändern, bricht den Test.
3. `POKER_MATH.md` enthält keine wertende Aussage, die nicht entweder ein
   Befund, eine gekennzeichnete Begründung oder ausdrücklich als ungeprüft
   markiert ist.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

WURZEL = Path(__file__).resolve().parent.parent
DOKU = WURZEL / "POKER_MATH.md"
BLOCKDATEIEN = sorted((WURZEL / "output").glob("b*_*.json"))


def alle_befunde() -> list[tuple[str, dict]]:
    treffer = []
    for datei in BLOCKDATEIEN:
        d = json.loads(datei.read_text(encoding="utf-8"))
        for b in d.get("befunde", []):
            treffer.append((datei.name, b))
    return treffer


BEFUNDE = alle_befunde()


def test_es_gibt_ueberhaupt_befunde():
    assert BEFUNDE, "Kein Block liefert Befunde – dann prüft diese Datei nichts"


@pytest.mark.parametrize("datei,b", BEFUNDE, ids=lambda x: x if isinstance(x, str) else x["schluessel"])
def test_jede_zahl_im_satz_steht_im_beleg(datei, b):
    """Ein Satz mit einer Zahl, die nirgends belegt ist, ist eine Behauptung."""
    def zahlen_aus(knoten) -> set[str]:
        gefunden: set[str] = set()
        if isinstance(knoten, dict):
            for v in knoten.values():
                gefunden |= zahlen_aus(v)
        elif isinstance(knoten, list):
            for v in knoten:
                gefunden |= zahlen_aus(v)
        elif isinstance(knoten, bool):
            pass
        elif isinstance(knoten, (int, float)):
            gefunden.add(f"{knoten}")
            gefunden.add(f"{knoten:.0f}")
            gefunden.add(f"{knoten:.2f}".replace(".", ","))
            gefunden.add(f"{100 * knoten:.0f}")
            gefunden.add(f"{100 * knoten:.2f}".replace(".", ","))
        elif isinstance(knoten, str):
            gefunden |= set(re.findall(r"\d+(?:[.,]\d+)?", knoten))
        return gefunden

    belegt = zahlen_aus(b["beleg"])
    im_satz = re.findall(r"\d+(?:[.,]\d+)?", b["aussage"])
    unbelegt = [z for z in im_satz if z not in belegt and z.rstrip("0").rstrip(",") not in belegt]
    assert not unbelegt, (
        f"{datei} / {b['schluessel']}: Diese Zahlen im Satz stehen in keinem "
        f"Beleg: {unbelegt}\n  Satz: {b['aussage']}"
    )


@pytest.mark.parametrize("datei,b", BEFUNDE, ids=lambda x: x if isinstance(x, str) else x["schluessel"])
def test_jeder_befund_steht_woertlich_in_der_doku(datei, b):
    """Die Dokumentation darf die Daten nicht umschreiben.

    Wer einen Befundsatz in POKER_MATH.md umformuliert, ohne die Rechnung zu
    ändern, bricht diesen Test. Genau so soll es sein: Der Satz gehört den
    Daten, nicht dem Autor.
    """
    text = DOKU.read_text(encoding="utf-8")
    # Zeilenumbrüche in der Doku dürfen den Satz zerlegen.
    flach = re.sub(r"\s+", " ", text)
    satz = re.sub(r"\s+", " ", b["aussage"])
    assert satz in flach, (
        f"{datei} / {b['schluessel']}: Der Befundsatz fehlt in POKER_MATH.md "
        f"oder wurde dort umformuliert.\n  Erwartet: {satz}"
    )


WERTENDE_WOERTER = [
    "wächst", "übertreibt", "untertreibt", "am größten", "am stärksten",
    "kippt", "durchweg", "deutlich", "erheblich", "meistens", "immer",
    "nie ", "stets", "typischerweise", "in der Regel",
]


def test_keine_ungedeckte_wertung_in_der_doku():
    """Jede wertende Aussage braucht eine Deckung.

    Zulässig sind drei Formen, und jede muss im selben Absatz erkennbar sein:
    ein Befundsatz, eine als **Begründung** gekennzeichnete Passage, oder eine
    ausdrücklich als **ungeprüft** markierte Stelle.
    """
    text = DOKU.read_text(encoding="utf-8")
    befundsaetze = [re.sub(r"\s+", " ", b["aussage"]) for _, b in BEFUNDE]

    absaetze = re.split(r"\n\s*\n", text)
    ungedeckt = []
    for absatz in absaetze:
        flach = re.sub(r"\s+", " ", absatz)
        if not any(w in flach for w in WERTENDE_WOERTER):
            continue
        gedeckt = (
            any(satz in flach for satz in befundsaetze)
            or "**Begründung**" in absatz
            or "**ungeprüft**" in absatz
            or absatz.lstrip().startswith("|")   # Tabellenzeilen: die Zahlen selbst
        )
        if not gedeckt:
            ungedeckt.append(flach[:150])

    assert not ungedeckt, (
        "Wertende Aussagen ohne Deckung in POKER_MATH.md:\n  - "
        + "\n  - ".join(ungedeckt)
    )


def test_der_umschlagpunkt_ist_gerechnet_und_nicht_geraten():
    """Der konkrete Fehler von damals, als Regressionstest."""
    from b1_outs import umschlagpunkt

    d = json.loads((WURZEL / "output" / "b1_outs.json").read_text(encoding="utf-8"))
    aus_datei = next(b for b in d["befunde"] if b["schluessel"] == "umschlagpunkt")
    punkt = aus_datei["beleg"]["umschlagpunkt_outs"]

    # Neu berechnet aus derselben Tabelle – muss übereinstimmen.
    assert umschlagpunkt(d["outs"]) == punkt

    # Und die Eigenschaft, die den Punkt definiert, muss dort wirklich gelten.
    abw = {z["outs"]: z["faustregel"]["abweichung_pp_turn_oder_river"] for z in d["outs"]}
    assert abw[punkt - 1] < 0, "Davor müsste die Regel zu wenig versprechen"
    assert abw[punkt] >= 0, "Ab dort müsste sie zu viel versprechen"
