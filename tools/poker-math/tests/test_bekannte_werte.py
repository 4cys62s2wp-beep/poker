"""Gegenprobe gegen Werte aus einer Quelle, der Lorenz vertraut.

Diese Datei prüft, was in `bekannte_werte.json` steht. Sie ist bewusst so
gebaut, dass sie **nicht still durchläuft**, wenn etwas nicht stimmt:

- Ein Pfad, der in der Ausgabedatei nicht existiert, ist ein Fehler.
  (Sonst wäre ein Tippfehler im Pfad ein bestandener Test.)
- Eine fehlende Ausgabedatei ist ein Fehler, kein Überspringen.
- Nur der leere Zustand – noch keine Werte eingetragen – wird als „offen"
  gemeldet statt als Fehler.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

WURZEL = Path(__file__).resolve().parent.parent
DATEI = Path(__file__).resolve().parent / "bekannte_werte.json"


def lade_bekannte_werte() -> list[dict]:
    if not DATEI.exists():
        pytest.fail(f"{DATEI.name} fehlt – sie gehört zum Testaufbau dazu.")
    inhalt = json.loads(DATEI.read_text(encoding="utf-8"))
    werte = inhalt.get("werte")
    if not isinstance(werte, list):
        pytest.fail("In bekannte_werte.json muss 'werte' eine Liste sein.")
    return werte


def hole(daten, pfad: str):
    """Punktgetrennten Pfad auflösen. Listen über den Index."""
    stelle = daten
    for teil in pfad.split("."):
        if isinstance(stelle, list):
            try:
                stelle = stelle[int(teil)]
            except (ValueError, IndexError) as fehler:
                raise KeyError(f"{pfad}: '{teil}' ist kein gültiger Listenindex") from fehler
        elif isinstance(stelle, dict):
            if teil not in stelle:
                raise KeyError(f"{pfad}: '{teil}' gibt es an dieser Stelle nicht. "
                               f"Vorhanden wären: {sorted(stelle)[:12]}")
            stelle = stelle[teil]
        else:
            raise KeyError(f"{pfad}: bei '{teil}' ist der Weg zu Ende, "
                           f"dort steht bereits ein Einzelwert")
    return stelle


def test_datei_ist_lesbar_und_hat_einen_hinweis():
    """Der Hinweistext ist Teil des Aufbaus – ohne ihn weiß niemand, wozu die
    Datei da ist. Er darf nicht verlorengehen."""
    inhalt = json.loads(DATEI.read_text(encoding="utf-8"))
    assert inhalt.get("_hinweis"), "Der erklärende Hinweis fehlt."
    assert "werte" in inhalt


def test_gegen_bekannte_werte():
    werte = lade_bekannte_werte()
    if not werte:
        pytest.skip(
            "bekannte_werte.json ist noch leer – das ist der vorgesehene Zustand. "
            "Sobald du eigene Vergleichswerte einträgst, prüft dieser Test sie."
        )

    zwischenspeicher: dict[str, dict] = {}
    fehler: list[str] = []

    for eintrag in werte:
        for feld in ("block", "pfad", "wert"):
            if feld not in eintrag:
                fehler.append(f"Eintrag ohne '{feld}': {eintrag}")
                break
        else:
            block = eintrag["block"]
            if block not in zwischenspeicher:
                datei = WURZEL / "output" / f"{block}.json"
                if not datei.exists():
                    fehler.append(
                        f"Ausgabedatei fehlt: output/{block}.json – "
                        f"erst den zugehörigen Rechenlauf ausführen."
                    )
                    continue
                zwischenspeicher[block] = json.loads(datei.read_text(encoding="utf-8"))

            try:
                ist = hole(zwischenspeicher[block], eintrag["pfad"])
            except KeyError as k:
                fehler.append(str(k))
                continue

            toleranz = float(eintrag.get("toleranz", 0.0))
            soll = float(eintrag["wert"])
            if not isinstance(ist, (int, float)):
                fehler.append(f"{block}.{eintrag['pfad']}: dort steht kein Zahlenwert, "
                              f"sondern {type(ist).__name__}")
            elif abs(float(ist) - soll) > toleranz:
                quelle = eintrag.get("quelle", "ohne Quellenangabe")
                fehler.append(
                    f"{block}.{eintrag['pfad']}: gerechnet {ist!r}, "
                    f"erwartet {soll!r} ± {toleranz} (Quelle: {quelle})"
                )

    assert not fehler, "Abweichungen gegen die hinterlegten Werte:\n  " + "\n  ".join(fehler)
