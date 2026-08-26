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
SCHEMA_VERSION = 2


def zs(de: str, en: str) -> dict[str, str]:
    """Ein anzeigbarer Text in beiden Sprachen.

    Warum das hier steht und nicht in der App: Eine Übersetzungstabelle in der
    Oberfläche ist genau die Stelle, an der beim nächsten neuen Zugbild der
    Eintrag fehlt — und dann steht auf Englisch ein deutsches Wort, ohne dass
    es jemandem auffällt. Wer den Text erzeugt, liefert ihn in beiden
    Sprachen; fehlt eine, fällt es hier auf und nicht auf dem Bildschirm.

    Nur für Texte, die die App **anzeigen** kann. Belege und Nachweise, die im
    Rechenergebnis bleiben, sind Prüfmaterial und bleiben deutsch.
    """
    if not de or not en:
        raise ValueError("Ein anzeigbarer Text braucht beide Sprachen")
    return {"de": de, "en": en}


class Faelle:
    """Zählt mit, wie viele Einzelfälle eine Rechnung tatsächlich durchging.

    Der Grund: „Warum diese Zahl?" verspricht der App-Nutzerin unter anderem
    die Auskunft, über wie viele Fälle gerechnet wurde. Diese Zahl darf nicht
    im Nachhinein aus einer Formel hergeleitet werden — dann wäre sie eine
    Behauptung über den Code statt eine Beobachtung an ihm. Also zählt der
    Code mit, während er läuft.

    Die Teilnamen sind bewusst grob: Es geht nicht um ein Profil, sondern
    darum, dass jemand nachvollziehen kann, was mit „Fällen" gemeint ist.
    """

    def __init__(self) -> None:
        self._je_teil: dict[str, int] = {}

    def zaehle(self, teil: str, anzahl: int = 1) -> None:
        if anzahl < 0:
            raise ValueError("Fälle lassen sich nicht abziehen")
        self._je_teil[teil] = self._je_teil.get(teil, 0) + anzahl

    @property
    def gesamt(self) -> int:
        return sum(self._je_teil.values())

    def block(self) -> dict[str, Any]:
        if not self._je_teil:
            raise ValueError(
                "Es wurde kein einziger Fall gezählt. Entweder rechnet der "
                "Block nichts, oder das Mitzählen wurde vergessen — beides "
                "muss auffallen."
            )
        return {"gesamt": self.gesamt, "je_teil": dict(sorted(self._je_teil.items()))}


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
        "sicht": zs(
            "Heldensicht. Bekannt sind ausschließlich die eigenen zwei Karten "
            "und das sichtbare Board. Über die Karten der Gegner wird nichts "
            "angenommen.",
            "The hero's point of view. Known are only your own two cards and "
            "the visible board. Nothing is assumed about anyone else's cards.",
        ),
        "unbekannte_karten": zs(
            f"Alle übrigen Karten gelten als unbekannt und verbleiben im Deck: "
            f"{z['unbekannt_nach_flop']} nach dem Flop, "
            f"{z['unbekannt_nach_turn']} nach dem Turn. Es wird NICHT "
            f"herausgerechnet, dass ein Teil davon bereits als Gegnerhand "
            f"ausgeteilt ist.",
            f"Every other card counts as unknown and stays in the deck: "
            f"{z['unbekannt_nach_flop']} after the flop, "
            f"{z['unbekannt_nach_turn']} after the turn. It is NOT discounted "
            f"that some of them have already been dealt to opponents.",
        ),
        "warum_diese_sicht": (
            "Sie ist die einzige, die ein Spieler am Tisch tatsächlich "
            "einnehmen kann. Rechnungen, die ausgeteilte Gegnerkarten aus dem "
            "Deck nehmen, liefern leicht andere Zahlen – beide sind richtig, "
            "aber sie beantworten verschiedene Fragen. Vermischt man sie, "
            "entstehen genau die Tabellen, die einander widersprechen."
        ),
        "split_pot": zs(
            "Geteilte Pötte zählen in jeder Equity-Rechnung als 0,5 für jede "
            "Seite.",
            "Split pots count as 0.5 for each side in every equity computation.",
        ),
        "kartenzahlen": z,
    }


def ohne_evaluator(begruendung_de: str, begruendung_en: str) -> dict[str, Any]:
    """Die Angabe für Blöcke, die keine Bibliothek brauchen.

    Ein fehlendes Feld sieht aus wie ein Versäumnis. Diese Blöcke zählen
    Kartenkombinationen, sie bewerten keine Blätter — das ist eine Auskunft
    und keine Lücke, also steht sie da.
    """
    return {"name": None, "begruendung": zs(begruendung_de, begruendung_en)}


def evaluator_angabe() -> dict[str, Any]:
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
    zweck: dict[str, str],
    methode: str,
    laufzeit_s: float,
    faelle: "Faelle",
    besondere_annahmen: dict[str, Any] | None = None,
    monte_carlo: dict[str, Any] | None = None,
    evaluator: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Baut den Metadatenblock einer Ausgabedatei.

    ``methode`` ist ``"exakt"`` oder ``"monte-carlo"``. Bei Monte Carlo gehören
    Iterationen, Seed und die Konfidenzangaben in ``monte_carlo`` – ohne sie
    wirft diese Funktion, damit keine Datei ohne Unsicherheitsangabe entsteht.

    ``faelle`` ist Pflicht. Die App verspricht neben jeder Zahl die Auskunft,
    über wie viele Fälle gerechnet wurde; ein Block, der nicht mitzählt, kann
    dieses Versprechen nicht halten. Lieber hier scheitern als dort schweigen.

    ``evaluator`` ist ebenfalls Pflicht — entweder ``evaluator_angabe()`` oder
    ``ohne_evaluator(...)``. Ein weggelassenes Feld sieht aus wie ein
    Versäumnis; „hier war keine Bibliothek nötig, weil …" ist eine Auskunft.
    """
    if methode not in ("exakt", "monte-carlo"):
        raise ValueError(f"Unbekannte Methode: {methode!r}")
    if not isinstance(zweck, dict) or set(zweck) != {"de", "en"}:
        raise ValueError("Der Zweck muss zweisprachig sein – zs(de, en)")
    if evaluator is None:
        raise ValueError(
            "Jeder Block muss angeben, womit gerechnet wurde: "
            "evaluator_angabe() oder ohne_evaluator(...)."
        )
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
        "faelle_enumeriert": faelle.block(),
        "evaluator": evaluator,
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
