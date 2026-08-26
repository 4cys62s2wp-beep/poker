"""Kartendarstellung und Umrechnung in die Formate der Fremdbibliotheken.

Interne Darstellung
-------------------
Eine Karte ist ein ``int`` von 0 bis 51.

    rang = karte // 4     0 = Zwei, 1 = Drei, ..., 11 = Dame, 12 = Ass
    farbe = karte % 4     0 = Kreuz, 1 = Karo, 2 = Herz, 3 = Pik

Warum ``int`` und nicht eine Klasse: Alle Rechnungen in diesem Ordner gehen
über Millionen von Blättern. Ein ``int`` passt in ein Register, ein Objekt
nicht. Die Lesbarkeit stellen die Hilfsfunktionen unten her.

Die Reihenfolge der Farben ist willkürlich und **bedeutungslos** – im Poker
sind alle Farben gleichwertig. Sie ist nur festgelegt, damit dieselbe
Kartennummer immer dieselbe Karte meint und Läufe reproduzierbar bleiben.
"""

from __future__ import annotations

RANG_ZEICHEN = "23456789TJQKA"
FARB_ZEICHEN = "cdhs"

#: Alle 52 Karten als Kartennummern.
ALLE_KARTEN: tuple[int, ...] = tuple(range(52))


def rang(karte: int) -> int:
    """0 = Zwei ... 12 = Ass."""
    return karte // 4


def farbe(karte: int) -> int:
    """0..3 – ohne Rangfolge, Farben sind gleichwertig."""
    return karte % 4


def als_text(karte: int) -> str:
    """``0`` -> ``'2c'``, ``51`` -> ``'As'``."""
    return RANG_ZEICHEN[rang(karte)] + FARB_ZEICHEN[farbe(karte)]


def aus_text(text: str) -> int:
    """``'As'`` -> ``51``. Wirft bei unbekanntem Text."""
    text = text.strip()
    if len(text) != 2:
        raise ValueError(f"Kartentext muss zwei Zeichen haben: {text!r}")
    r = RANG_ZEICHEN.index(text[0].upper())
    f = FARB_ZEICHEN.index(text[1].lower())
    return r * 4 + f


#: Vorberechnete Textform je Kartennummer – spart Millionen von Aufrufen.
TEXT_JE_KARTE: tuple[str, ...] = tuple(als_text(k) for k in ALLE_KARTEN)


def blatt_als_text(karten) -> str:
    """Für Fehlermeldungen und Ausgabedateien: ``'As Kd 7h'``."""
    return " ".join(TEXT_JE_KARTE[k] for k in karten)


# ---------------------------------------------------------------------------
# Starthände (169 Klassen)
# ---------------------------------------------------------------------------

def starthand_kuerzel(karte_a: int, karte_b: int) -> str:
    """Zwei Karten zur Starthand-Klasse verdichten: ``'AKs'``, ``'AKo'``, ``'77'``.

    Die 1326 möglichen Zweikartenblätter fallen in 169 Klassen zusammen, weil
    die Farben untereinander gleichwertig sind: Es zählt nur, ob beide Karten
    dieselbe Farbe haben.
    """
    r1, r2 = rang(karte_a), rang(karte_b)
    hoch, tief = max(r1, r2), min(r1, r2)
    if hoch == tief:
        return RANG_ZEICHEN[hoch] * 2
    endung = "s" if farbe(karte_a) == farbe(karte_b) else "o"
    return RANG_ZEICHEN[hoch] + RANG_ZEICHEN[tief] + endung


def alle_starthand_kuerzel() -> list[str]:
    """Alle 169 Klassen, berechnet statt aufgezählt.

    Die Zahl 169 steht hier absichtlich nirgends im Code – sie ergibt sich.
    """
    gesehen: dict[str, None] = {}
    for a in ALLE_KARTEN:
        for b in ALLE_KARTEN:
            if a < b:
                gesehen.setdefault(starthand_kuerzel(a, b), None)
    return list(gesehen)


def kombos_fuer_kuerzel(kuerzel: str, ausgeschlossen: frozenset[int] = frozenset()) -> list[tuple[int, int]]:
    """Alle konkreten Zweikartenblätter zu einer Starthand-Klasse.

    ``ausgeschlossen`` entfernt bekannte Karten (eigene Hand, Board) – das ist
    die Blocker-Rechnung aus B3.
    """
    treffer = []
    for a in ALLE_KARTEN:
        if a in ausgeschlossen:
            continue
        for b in ALLE_KARTEN:
            if b <= a or b in ausgeschlossen:
                continue
            if starthand_kuerzel(a, b) == kuerzel:
                treffer.append((a, b))
    return treffer
