"""Ein unabhängiger Fünfkarten-Evaluator, direkt aus den Spielregeln.

Wozu das gut ist
----------------
Um eine fremde Bibliothek als korrekt zu **belegen**, brauche ich etwas
Unabhängiges, an dem ich sie messen kann. Dieser Evaluator ist dieses
Etwas. Er ist bewusst langsam und stumpf geschrieben – er soll offensichtlich
richtig sein, nicht schnell.

Was hier hineinfließt und was nicht
-----------------------------------
Hineinfließen die **Regeln** von Texas Hold'em: dass ein Flush einen Straight
schlägt, dass Gleichstand über die Ränge in einer bestimmten Reihenfolge
aufgelöst wird, dass das Ass in A-2-3-4-5 als Eins zählen darf. Das ist die
Definition des Spiels, keine berechnete Größe.

**Nicht** hinein fließt irgendeine Zahl: keine Häufigkeiten, keine
Wahrscheinlichkeiten, keine Kategoriegrößen. Alles Quantitative in diesem
Ordner wird gerechnet.

Der Vergleich
-------------
Verglichen wird nicht der Zahlenwert – jede Bibliothek nummeriert anders –,
sondern die **Ordnung**: Zwei Evaluatoren sind genau dann gleich, wenn sie
dieselben Blätter für gleich stark halten und dieselben Blätter in dieselbe
Reihenfolge bringen. Das prüft ``pruefe_evaluatoren.py`` über **alle**
2 598 960 Fünfkartenblätter.
"""

from __future__ import annotations

from karten import RANG_ZEICHEN, farbe, rang

# Ränge, die in den Regeln namentlich vorkommen. Kein Zahlenwissen, sondern
# die Position im Rangalphabet.
ASS = RANG_ZEICHEN.index("A")
FUENF = RANG_ZEICHEN.index("5")
VIER = RANG_ZEICHEN.index("4")
DREI = RANG_ZEICHEN.index("3")
ZWEI = RANG_ZEICHEN.index("2")

# Kategorien, aufsteigend nach Stärke. Die Reihenfolge IST die Spielregel.
HIGH_CARD = 0
EIN_PAAR = 1
ZWEI_PAARE = 2
DRILLING = 3
STRASSE = 4
FLUSH = 5
FULL_HOUSE = 6
VIERLING = 7
STRAIGHT_FLUSH = 8

KATEGORIE_NAME = {
    HIGH_CARD: "High Card",
    EIN_PAAR: "Ein Paar",
    ZWEI_PAARE: "Zwei Paare",
    DRILLING: "Drilling",
    STRASSE: "Straße",
    FLUSH: "Flush",
    FULL_HOUSE: "Full House",
    VIERLING: "Vierling",
    STRAIGHT_FLUSH: "Straight Flush",
}

#: Dieselben Kategorien auf Englisch. Sie stehen hier und nicht in der App,
#: weil sonst beim nächsten Eintrag der Gegenpart fehlt und auf Englisch ein
#: deutsches Wort erscheint, ohne dass es jemandem auffällt.
KATEGORIE_NAME_EN = {
    HIGH_CARD: "High card",
    EIN_PAAR: "One pair",
    ZWEI_PAARE: "Two pair",
    DRILLING: "Three of a kind",
    STRASSE: "Straight",
    FLUSH: "Flush",
    FULL_HOUSE: "Full house",
    VIERLING: "Four of a kind",
    STRAIGHT_FLUSH: "Straight flush",
}

assert set(KATEGORIE_NAME) == set(KATEGORIE_NAME_EN), (
    "Für jede Kategorie muss es beide Sprachen geben"
)


def kategorie_und_rangfolge(karten) -> tuple[int, tuple[int, ...]]:
    """Kategorie und Gleichstands-Reihenfolge eines Fünfkartenblatts.

    Rückgabe: ``(kategorie, ränge)``. Zwei Blätter sind gleich stark, wenn
    beide Teile übereinstimmen; sonst entscheidet zuerst die Kategorie, dann
    die Ränge von links nach rechts.
    """
    if len(karten) != 5:
        raise ValueError("Dieser Evaluator bewertet genau fünf Karten")

    raenge = [rang(k) for k in karten]
    farben = [farbe(k) for k in karten]

    # Wie oft kommt jeder Rang vor?
    anzahl: dict[int, int] = {}
    for r in raenge:
        anzahl[r] = anzahl.get(r, 0) + 1

    # Erst nach Häufigkeit, dann nach Rang – beides absteigend. Damit steht
    # der Vierling vor seinem Kicker, der Drilling vor dem Paar, das höhere
    # Paar vor dem niedrigeren. Das ist genau die Gleichstandsregel.
    gruppen = sorted(anzahl.items(), key=lambda paar: (-paar[1], -paar[0]))
    form = tuple(n for _, n in gruppen)
    gruppen_raenge = tuple(r for r, _ in gruppen)

    ist_flush = len(set(farben)) == 1

    # Straße: fünf verschiedene, lückenlos aufeinanderfolgende Ränge.
    verschieden = sorted(set(raenge), reverse=True)
    strassen_hoch: int | None = None
    if len(verschieden) == len(karten):
        if verschieden[0] - verschieden[-1] == len(verschieden) - 1:
            strassen_hoch = verschieden[0]
        elif verschieden == [ASS, FUENF, VIER, DREI, ZWEI]:
            # Das „Rad": Hier zählt das Ass als Eins, die Straße ist Fünf-hoch.
            # Der einzige Fall, in dem das Ass die schwächste Karte ist.
            strassen_hoch = FUENF

    if strassen_hoch is not None and ist_flush:
        return STRAIGHT_FLUSH, (strassen_hoch,)
    if form == (4, 1):
        return VIERLING, gruppen_raenge
    if form == (3, 2):
        return FULL_HOUSE, gruppen_raenge
    if ist_flush:
        return FLUSH, tuple(sorted(raenge, reverse=True))
    if strassen_hoch is not None:
        return STRASSE, (strassen_hoch,)
    if form == (3, 1, 1):
        return DRILLING, gruppen_raenge
    if form == (2, 2, 1):
        return ZWEI_PAARE, gruppen_raenge
    if form == (2, 1, 1, 1):
        return EIN_PAAR, gruppen_raenge
    return HIGH_CARD, tuple(sorted(raenge, reverse=True))


def schluessel(karten) -> int:
    """Eine einzelne Zahl, die genau dann größer ist, wenn das Blatt stärker ist.

    Nur für den Vergleich gedacht, nicht für die Anzeige. Die Kodierung nutzt
    Basis 13 (so viele Ränge gibt es), aufgefüllt auf fünf Stellen, damit
    Blätter derselben Kategorie mit unterschiedlich langer Rangfolge nicht
    versehentlich gleich werden.
    """
    kategorie, raenge = kategorie_und_rangfolge(karten)
    wert = kategorie
    for i in range(5):
        wert = wert * 13 + (raenge[i] if i < len(raenge) else 0)
    return wert
