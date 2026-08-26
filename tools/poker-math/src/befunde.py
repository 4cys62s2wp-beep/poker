"""Aussagen ÜBER Zahlen — erzeugt, nicht formuliert.

Das Problem, das diese Datei löst
---------------------------------
Die Zahlen in diesem Ordner sind alle gerechnet. Die **Sätze über die Zahlen**
waren es nicht — und genau dort ist mir ein Fehler unterlaufen: In
`b1_outs.json` stand „die Regel verspricht durchweg zu viel", obwohl sie bis
sechs Outs zu wenig verspricht. Der Satz war plausibel, passte zum Eindruck
aus der Tabelle und war falsch.

Formulierte Sätze driften von ihren Daten weg, sobald sich die Daten ändern.
Erzeugte Sätze können das nicht.

Wie es funktioniert
-------------------
Ein Befund ist kein Text, sondern eine Ableitung: Er nimmt die gerechneten
Daten entgegen, zieht daraus seine Kennzahlen und **setzt den Satz aus ihnen
zusammen**. Steht in einem Befundsatz eine Zahl, kommt sie aus dem Beleg
daneben — sie kann gar nicht anders lauten.

Drei Sorten von Aussagen
------------------------
Nicht jeder Satz in der Dokumentation ist ein Befund. Unterschieden wird:

- **Befund** — aus den Daten abgeleitet, mit Beleg, durch einen Test gedeckt.
- **Begründung** — warum so gerechnet wurde. Keine Aussage über Daten,
  sondern über die Wahl der Methode. Nicht prüfbar und muss es nicht sein.
- **Ungeprüft** — eine Aussage, die stimmen könnte, für die aber keine
  Rechnung vorliegt. Sie wird ausdrücklich als solche gekennzeichnet.

`POKER_MATH.md` markiert jede Aussage entsprechend, und ein Test prüft, dass
jeder Befundsatz dort **wörtlich** so steht, wie er hier erzeugt wurde.
"""

from __future__ import annotations

from typing import Any


def befund(schluessel: str, aussage: str, beleg: dict[str, Any]) -> dict[str, Any]:
    """Einen Befund bauen.

    ``aussage`` muss mit f-String aus den Werten in ``beleg`` zusammengesetzt
    sein — nicht danebengeschrieben. Ob das eingehalten wurde, prüft
    ``tests/test_aussagen.py``, indem es jede Zahl im Satz im Beleg wiederfindet.
    """
    if not aussage or not aussage[0].isupper():
        raise ValueError(f"Befund {schluessel!r}: Aussage fehlt oder beginnt klein")
    if not beleg:
        raise ValueError(f"Befund {schluessel!r}: ohne Beleg ist es keine Ableitung")
    return {"schluessel": schluessel, "aussage": aussage, "beleg": beleg}


def zahlen_im_satz(satz: str) -> list[str]:
    """Alle Zahlen aus einem Satz ziehen — für die Prüfung, ob sie belegt sind."""
    import re
    # Deutsche Schreibweise: Komma als Dezimaltrenner, Leerzeichen als Tausender.
    return re.findall(r"\d+(?:[.,]\d+)?", satz)


def zahl(wert: float, stellen: int = 2) -> str:
    """Eine Zahl in deutscher Schreibweise, für die Satzbildung."""
    return f"{wert:.{stellen}f}".replace(".", ",")


def prozent(anteil: float, stellen: int = 2) -> str:
    return zahl(100 * anteil, stellen) + " %"


def prozentpunkte(pp: float, stellen: int = 2) -> str:
    return zahl(pp, stellen) + " pp"
