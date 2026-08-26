"""Der Metadatenblock, den jede Ausgabedatei trägt.

Warum das eine eigene Datei ist
-------------------------------
Die Annahmen, unter denen eine Zahl gilt, sind Teil der Zahl. Eine
Verbesserungswahrscheinlichkeit von 31,45 % ist ohne den Zusatz „aus
Heldensicht, 47 unbekannte Karten, saubere Outs" nicht falsch, sondern
**bedeutungslos** – und genau daraus entstehen die widersprüchlichen Tabellen,
die im Netz kursieren.

Wenn der Annahmentext an einer Stelle steht und von dort in jede Datei
geschrieben wird, kann er nicht auseinanderdriften. Stünde er in jedem
Rechenskript einzeln, wäre er nach der dritten Änderung dreimal verschieden.

Was hier NICHT hineingehört
---------------------------
Ergebnisse. Dieser Block beschreibt nur, **wie** gerechnet wurde.
"""

from __future__ import annotations

import importlib.metadata as _md
import platform
from datetime import datetime, timezone
from typing import Any

#: Version des Ausgabeformats. Erhöhen, wenn sich die Struktur so ändert,
#: dass ein Leser der alten Fassung sie missverstehen würde.
SCHEMA_VERSION = 1


def _kartenzahlen() -> dict[str, int]:
    """Die Deckgrößen, gezählt statt hingeschrieben.

    52 minus zwei eigene Karten minus die sichtbaren Boardkarten. Die Zahlen
    47 und 46 stehen deshalb nirgends im Quelltext – sie fallen heraus.
    """
    from karten import ALLE_KARTEN

    deck = len(ALLE_KARTEN)
    eigene = 2          # Hold'em: jeder Spieler bekommt zwei Karten (Regel)
    flop, turn = 3, 1   # Regel
    return {
        "deck": deck,
        "eigene_karten": eigene,
        "unbekannt_nach_flop": deck - eigene - flop,
        "unbekannt_nach_turn": deck - eigene - flop - turn,
    }


def standard_annahmen() -> dict[str, Any]:
    """Die Annahmen, die für ALLE Rechnungen in diesem Ordner gelten."""
    z = _kartenzahlen()
    return {
        "sicht": (
            "Heldensicht. Bekannt sind ausschließlich die eigenen zwei Karten "
            "und das sichtbare Board. Über die Karten der Gegner wird nichts "
            "angenommen."
        ),
        "unbekannte_karten": (
            f"Alle übrigen Karten gelten als unbekannt und verbleiben im Deck: "
            f"{z['unbekannt_nach_flop']} nach dem Flop, "
            f"{z['unbekannt_nach_turn']} nach dem Turn. Es wird NICHT "
            f"herausgerechnet, dass ein Teil davon bereits als Gegnerhand "
            f"ausgeteilt ist."
        ),
        "warum_diese_sicht": (
            "Sie ist die einzige, die ein Spieler am Tisch tatsächlich "
            "einnehmen kann. Rechnungen, die ausgeteilte Gegnerkarten aus dem "
            "Deck nehmen, liefern leicht andere Zahlen – beide sind richtig, "
            "aber sie beantworten verschiedene Fragen. Vermischt man sie, "
            "entstehen genau die Tabellen, die einander widersprechen."
        ),
        "split_pot": (
            "Geteilte Pötte zählen in jeder Equity-Rechnung als 0,5 für jede "
            "Seite."
        ),
        "kartenzahlen": z,
    }


def evaluator_angabe() -> dict[str, str]:
    """Welche Bibliothek gerechnet hat – mit Version, für die Nachvollziehbarkeit."""
    return {
        "name": "eval7",
        "version": _md.version("eval7"),
        "gegenprobe": "phevaluator " + _md.version("phevaluator"),
        "nachweis": (
            "Über alle 2 598 960 Fünfkartenblätter gegen einen unabhängigen "
            "Evaluator aus den Spielregeln geprüft; siehe "
            "output/evaluator_auswahl.json und ENTSCHEIDUNGEN.md, E-012."
        ),
    }


def metadatenblock(
    *,
    block: str,
    zweck: str,
    methode: str,
    laufzeit_s: float,
    besondere_annahmen: dict[str, Any] | None = None,
    monte_carlo: dict[str, Any] | None = None,
    braucht_evaluator: bool = True,
) -> dict[str, Any]:
    """Baut den Metadatenblock einer Ausgabedatei.

    ``methode`` ist ``"exakt"`` oder ``"monte-carlo"``. Bei Monte Carlo gehören
    Iterationen, Seed und die Konfidenzangaben in ``monte_carlo`` – ohne sie
    wirft diese Funktion, damit keine Datei ohne Unsicherheitsangabe entsteht.
    """
    if methode not in ("exakt", "monte-carlo"):
        raise ValueError(f"Unbekannte Methode: {methode!r}")
    if methode == "monte-carlo":
        fehlend = {"iterationen", "seed"} - set(monte_carlo or {})
        if fehlend:
            raise ValueError(
                f"Monte-Carlo-Läufe müssen {sorted(fehlend)} angeben – "
                f"eine Schätzung ohne Angabe ihrer Unsicherheit ist keine Zahl, "
                f"sondern eine Behauptung."
            )

    annahmen = standard_annahmen()
    if besondere_annahmen:
        annahmen = {**annahmen, "block_spezifisch": besondere_annahmen}

    daten: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "block": block,
        "zweck": zweck,
        "methode": methode,
        "annahmen": annahmen,
        "erzeugt_am": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "laufzeit_s": round(laufzeit_s, 3),
        "umgebung": {
            "python": platform.python_version(),
            "system": platform.system(),
            "maschine": platform.machine(),
        },
        "reproduzierbar": (
            "Derselbe Lauf liefert bis auf 'erzeugt_am' und 'laufzeit_s' Bit für "
            "Bit dieselbe Datei."
        ),
    }
    if braucht_evaluator:
        daten["evaluator"] = evaluator_angabe()
    if monte_carlo:
        daten["monte_carlo"] = monte_carlo
    return daten


def schreibe(pfad, metadaten: dict[str, Any], inhalt: dict[str, Any]) -> None:
    """Ausgabedatei schreiben: erst die Metadaten, dann der Inhalt.

    Getrennte Schlüssel statt einer Vermischung, damit ein Leser sofort sieht,
    was Beschreibung und was Ergebnis ist.
    """
    import json
    from pathlib import Path

    p = Path(pfad)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(
        json.dumps({"metadaten": metadaten, **inhalt}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
