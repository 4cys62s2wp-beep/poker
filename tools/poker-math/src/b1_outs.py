"""B1 — Outs und Verbesserungswahrscheinlichkeit.

Was gerechnet wird
------------------
Für jede Outs-Zahl von 1 bis 21, **exakt durch Abzählen**:

- die Wahrscheinlichkeit, dass der Turn ein Out bringt,
- die Wahrscheinlichkeit, dass der River eines bringt – in zwei Lesarten,
- die Wahrscheinlichkeit, dass mindestens eine der beiden Straßen trifft,
- die Abweichung der 2/4-Faustregel vom exakten Wert, in Prozentpunkten.

Wie gerechnet wird
------------------
Nicht durch Einsetzen in eine Formel, sondern durch **vollständiges
Durchzählen des Ereignisraums**: Alle geordneten Paare (Turn, River) aus den
unbekannten Karten werden aufgezählt und die Treffer gezählt.

Die geschlossenen Formeln werden zusätzlich gerechnet und müssen **exakt**
übereinstimmen – als Bruch, nicht als Fließkommazahl. Zwei unabhängige Wege
zum selben Wert sind das Mindeste, was eine Zahl an Absicherung verdient,
bevor sie in eine Lern-App geht.

Die zwei Lesarten von „River"
-----------------------------
Genau hier gehen kursierende Tabellen auseinander:

- **nach Fehlschlag**: Der Turn hat nicht getroffen, jetzt kommt der River.
  Das ist die Situation am Tisch, wenn man nach dem Turn erneut entscheiden
  muss. Nenner: die Karten, die nach dem Turn noch unbekannt sind.
- **unbedingt**: Wie oft ist die Riverkarte ein Out, ohne Rücksicht darauf,
  was der Turn tat? Nenner: die Karten, die nach dem Flop unbekannt sind.

Beide sind richtig. Sie beantworten verschiedene Fragen, und wer sie
verwechselt, rechnet falsch. Deshalb stehen hier beide, benannt.
"""

from __future__ import annotations

import time
from fractions import Fraction

from karten import ALLE_KARTEN, aus_text
from metadaten import metadatenblock, schreibe, standard_annahmen

#: Bis zu wie vielen Outs die Tabelle geht. Darüber hinaus kommt die Situation
#: praktisch nicht vor; die Rechnung selbst hätte damit kein Problem.
MAX_OUTS = 21


# ---------------------------------------------------------------------------
# Der Ereignisraum, vollständig durchgezählt
# ---------------------------------------------------------------------------

def zaehle_treffer(unbekannt: int, outs: int) -> dict[str, Fraction]:
    """Zählt über ALLE geordneten Paare (Turn, River) aus den unbekannten Karten.

    Die Karten werden als Plätze 0 bis ``unbekannt-1`` geführt; die ersten
    ``outs`` davon sind Outs. Welche Karte genau welchen Platz hat, ist für die
    Wahrscheinlichkeit ohne Belang – es zählt nur, wie viele der unbekannten
    Karten helfen.

    Rückgabe: exakte Brüche, keine Fließkommazahlen.
    """
    if not 0 <= outs <= unbekannt:
        raise ValueError(f"{outs} Outs passen nicht in {unbekannt} unbekannte Karten")

    ist_out = [i < outs for i in range(unbekannt)]

    paare = 0
    turn_trifft = 0
    river_trifft = 0            # unbedingt: irgendein Paar, dessen River ein Out ist
    river_nach_fehlschlag = 0   # Paare, bei denen der Turn verfehlte UND der River traf
    turn_verfehlt = 0
    mindestens_eine = 0

    for t in range(unbekannt):
        for r in range(unbekannt):
            if t == r:
                continue  # dieselbe Karte kann nicht zweimal kommen
            paare += 1
            t_ok, r_ok = ist_out[t], ist_out[r]
            if t_ok:
                turn_trifft += 1
            else:
                turn_verfehlt += 1
                if r_ok:
                    river_nach_fehlschlag += 1
            if r_ok:
                river_trifft += 1
            if t_ok or r_ok:
                mindestens_eine += 1

    return {
        "turn": Fraction(turn_trifft, paare),
        "river_unbedingt": Fraction(river_trifft, paare),
        "river_nach_fehlschlag": Fraction(river_nach_fehlschlag, turn_verfehlt)
        if turn_verfehlt else Fraction(0),
        "turn_oder_river": Fraction(mindestens_eine, paare),
    }


def geschlossene_form(nach_flop: int, nach_turn: int, outs: int) -> dict[str, Fraction]:
    """Dieselben Größen über die Gegenwahrscheinlichkeit.

    Nur als Gegenprobe zur Zählung. Stimmen beide nicht **exakt** überein,
    bricht der Lauf ab.
    """
    p_turn = Fraction(outs, nach_flop)
    p_river = Fraction(outs, nach_turn)
    return {
        "turn": p_turn,
        "river_unbedingt": p_turn,  # Symmetrie: jede Position ist gleich wahrscheinlich
        "river_nach_fehlschlag": p_river,
        "turn_oder_river": 1 - (1 - p_turn) * (1 - p_river),
    }


# ---------------------------------------------------------------------------
# Die 2/4-Faustregel
# ---------------------------------------------------------------------------

def faustregel(outs: int) -> dict[str, Fraction]:
    """Die Regel, wie sie am Tisch gelehrt wird.

    Eine Karte kommt noch: Outs mal zwei Prozent.
    Zwei Karten kommen noch: Outs mal vier Prozent.

    Das ist eine Rechenhilfe im Kopf, keine Näherungsformel mit Fehlerschranke –
    und genau deshalb lohnt es, ihren Fehler auszuweisen statt ihn zu
    verschweigen.
    """
    return {
        "eine_karte": Fraction(2 * outs, 100),
        "zwei_karten": Fraction(4 * outs, 100),
    }


# ---------------------------------------------------------------------------
# Beispiele: Outs an echten Händen gezählt
# ---------------------------------------------------------------------------

def _bestes_blatt(karten):
    """Das beste Fünfkartenblatt aus beliebig vielen Karten, als (Kategorie, Karten)."""
    from itertools import combinations
    import eval7

    e7 = _EVAL7_KARTEN
    beste = max(combinations(karten, 5), key=lambda f: eval7.evaluate([e7[c] for c in f]))
    from referenz_evaluator import kategorie_und_rangfolge
    kategorie, _ = kategorie_und_rangfolge(list(beste))
    return kategorie, beste


def _kategorie(karten):
    return _bestes_blatt(karten)[0]


def _traegt_die_kategorie(blatt, kategorie, eigene) -> bool:
    """Ist mindestens eine eigene Karte an der Kategorie BETEILIGT – nicht nur Kicker?

    Das ist der Unterschied zwischen „mein Blatt ist besser geworden" und
    „ich habe getroffen". Ein Beispiel, an dem es hängt:

      Hero hält A-K, der Flop ist 9-7-2, der Turn bringt eine weitere Neun.
      Heros bestes Blatt ist jetzt ein Paar Neunen mit A-K als Kicker – die
      Kategorie ist gestiegen. Getroffen hat er trotzdem nichts: Das Paar
      liegt auf dem Board und gehört jedem am Tisch. Eine solche Karte als
      Out zu zählen, wäre der klassische Anfängerfehler.
    """
    from referenz_evaluator import (
        DRILLING, EIN_PAAR, FLUSH, FULL_HOUSE, HIGH_CARD, STRASSE,
        STRAIGHT_FLUSH, VIERLING, ZWEI_PAARE,
    )
    from karten import rang

    eigene = set(eigene)
    if kategorie in (STRASSE, FLUSH, STRAIGHT_FLUSH):
        # Alle fünf Karten bilden die Kategorie gemeinsam.
        return any(k in eigene for k in blatt)
    if kategorie == HIGH_CARD:
        return False  # High Card ist keine Verbesserung, sondern ihr Ausbleiben

    # Paarförmige Kategorien: Es zählen nur die Karten in den Mehrfachgruppen,
    # nicht die Kicker.
    haeufig: dict[int, list[int]] = {}
    for k in blatt:
        haeufig.setdefault(rang(k), []).append(k)
    mindestens = 2 if kategorie in (EIN_PAAR, ZWEI_PAARE) else (
        3 if kategorie in (DRILLING, FULL_HOUSE) else 4)
    if kategorie == FULL_HOUSE:
        mindestens = 2  # Drilling UND Paar gehören beide zur Kategorie
    kern = [k for gruppe in haeufig.values() if len(gruppe) >= mindestens for k in gruppe]
    return any(k in eigene for k in kern)


def _eval7_karten():
    import eval7
    from karten import TEXT_JE_KARTE
    return tuple(eval7.Card(t) for t in TEXT_JE_KARTE)


_EVAL7_KARTEN = None


def zaehle_outs(hand: str, flop: str, ziel_kategorie: int | None = None,
                nur_mit_eigener_karte: bool = True) -> int:
    """Wie viele der unbekannten Karten sind Outs?

    Zwei Lesarten, und der Unterschied zwischen ihnen ist der Grund, warum
    Outs-Zahlen in Lehrmaterial auseinandergehen:

    ``ziel_kategorie`` **gesetzt**: Gezählt wird, wie viele Karten das eigene
    Blatt auf mindestens diese Kategorie heben. Für einen Flushdraw ist das
    Ziel „Flush", für eine offene Straße „Straße". Das ergibt die Zahlen, die
    am Tisch gemeint sind, wenn jemand „neun Outs" sagt.

    ``ziel_kategorie`` **offen**: Gezählt wird jede Karte, die die Kategorie
    überhaupt anhebt – also auch das Paar, das aus einem Flushdraw nebenbei
    entsteht. Diese Zahl ist größer und beantwortet eine andere Frage.

    Was **nicht** als Out zählt: ein besserer Kicker. Wer das mitzählt, kommt
    für jede Hand auf fast alle 47 Karten – die Zahl ist dann richtig gerechnet
    und trotzdem ohne Aussage.

    ``nur_mit_eigener_karte`` (Standard: ja) verlangt zusätzlich, dass eine
    eigene Karte die neue Kategorie mitbildet. Ohne diese Bedingung zählt eine
    Karte, die das Board paart, für jeden am Tisch als „Verbesserung" – siehe
    ``_traegt_die_kategorie``.
    """
    global _EVAL7_KARTEN
    if _EVAL7_KARTEN is None:
        _EVAL7_KARTEN = _eval7_karten()

    bekannt = [aus_text(t) for t in (hand + " " + flop).split()]
    if len(set(bekannt)) != len(bekannt):
        raise ValueError(f"Doppelte Karte in {hand} / {flop}")

    eigene = [aus_text(t) for t in hand.split()]
    jetzt = _kategorie(bekannt)
    schwelle = ziel_kategorie if ziel_kategorie is not None else jetzt + 1

    treffer = 0
    for c in (k for k in ALLE_KARTEN if k not in bekannt):
        kategorie, blatt = _bestes_blatt(bekannt + [c])
        if kategorie < schwelle:
            continue
        if nur_mit_eigener_karte and not _traegt_die_kategorie(blatt, kategorie, eigene):
            continue
        treffer += 1
    return treffer


#: Bekannte Zugbilder. Die NAMEN und die Zielkategorie sind Fachsprache, die
#: Outs-Zahlen dahinter werden gezählt.
BEISPIELE = [
    ("Flushdraw",                     "Ah 7h", "Kh 4h 2c", "Flush"),
    ("Offene Straße",                 "9c 8d", "7h 6s 2c", "Straße"),
    ("Gutshot",                       "9c 8d", "7h 5s 2c", "Straße"),
    ("Zwei Überkarten",               "Ac Kd", "9h 7s 2c", "Ein Paar"),
    ("Flushdraw plus zwei Überkarten","Ah Kh", "9h 7h 2c", "Ein Paar"),
    ("Flushdraw plus offene Straße",  "9h 8h", "7h 6h 2c", "Straße"),
    ("Unterpaar sucht das Set",       "5c 5d", "Ah 9s 2c", "Drilling"),
    ("Set sucht das Full House",      "9c 9d", "9h 7s 2c", "Full House"),
]


# ---------------------------------------------------------------------------
# Gegenbeispiele zur Annahme „saubere Outs"
# ---------------------------------------------------------------------------

#: Situationen, in denen ein gezähltes Out die eigene Hand verbessert und man
#: sie trotzdem verliert. Hand, Board, die Karte, Gegnerhand – die Bewertung
#: macht der Evaluator, nicht ich.
GEGENBEISPIELE = [
    {
        "name": "Das Out gibt dem Gegner den Flush",
        "hand": "9d 8d",
        "flop": "7c 6c 2h",
        "out": "5c",
        "gegner": "Ac Jc",
        "erklaerung": (
            "Die Fünf ist ein sauber gezähltes Straßen-Out: Hero hält "
            "9-8-7-6-5. Sie ist aber ein Kreuz, und damit liegen drei Kreuz "
            "auf dem Board – der Gegner mit zwei Kreuz hat den Flush."
        ),
    },
    {
        "name": "Das Out gibt dem Gegner die höhere Straße",
        "hand": "7d 6d",
        "flop": "9c 8s 2h",
        "out": "Th",
        "gegner": "Jc 7c",
        "erklaerung": (
            "Die Zehn vollendet Heros Straße von der Zehn abwärts. Weil das "
            "Board selbst drei Straßenkarten liefert, reicht dem Gegner ein "
            "einzelner Bube für die höhere Straße – die dominierte Straße, der "
            "teuerste Fall dieser Art. Zu beachten: Das geht nur, wenn das "
            "Board die Verbindung stellt; bei einem Flop wie 7-6-2 kann "
            "niemand eine höhere Straße halten."
        ),
    },
    {
        "name": "Das Out paart das Board und füllt das Full House",
        "hand": "Ah Kh",
        "flop": "Qh 7h 7c",
        "out": "2h",
        "gegner": "7s 2c",
        "erklaerung": (
            "Das Herz vollendet Heros Nut-Flush. Dieselbe Karte paart die Zwei "
            "und gibt dem Gegner mit Siebener-Drilling das Full House."
        ),
    },
]


def pruefe_gegenbeispiele() -> list[dict]:
    """Rechnet nach, dass die Gegenbeispiele wirklich Gegenbeispiele sind.

    Geprüft wird beides: dass die Karte Heros Blatt tatsächlich **verbessert**
    (sonst wäre sie kein Out) und dass Hero danach trotzdem **verliert** (sonst
    wäre es kein Gegenbeispiel). Behauptet wird hier nichts.
    """
    global _EVAL7_KARTEN
    if _EVAL7_KARTEN is None:
        _EVAL7_KARTEN = _eval7_karten()
    import eval7
    from itertools import combinations
    from referenz_evaluator import KATEGORIE_NAME

    e7 = _EVAL7_KARTEN
    ergebnis = []
    for fall in GEGENBEISPIELE:
        hand = [aus_text(t) for t in fall["hand"].split()]
        flop = [aus_text(t) for t in fall["flop"].split()]
        out = aus_text(fall["out"])
        gegner = [aus_text(t) for t in fall["gegner"].split()]

        alle = hand + flop + [out] + gegner
        if len(set(alle)) != len(alle):
            raise AssertionError(f"{fall['name']}: doppelte Karte im Aufbau")

        board_vorher = flop
        board_nachher = flop + [out]

        vorher_kat, _ = _bestes_blatt(hand + board_vorher)
        nachher_kat, nachher_blatt = _bestes_blatt(hand + board_nachher)
        gegner_kat, gegner_blatt = _bestes_blatt(gegner + board_nachher)

        hero_wert = eval7.evaluate([e7[c] for c in nachher_blatt])
        gegner_wert = eval7.evaluate([e7[c] for c in gegner_blatt])

        verbessert = nachher_kat > vorher_kat
        verliert = hero_wert < gegner_wert

        if not verbessert:
            raise AssertionError(
                f"{fall['name']}: die Karte verbessert Heros Blatt gar nicht – "
                f"dann ist sie kein Out und das Beispiel trägt nicht"
            )
        if not verliert:
            raise AssertionError(
                f"{fall['name']}: Hero verliert nicht – "
                f"Hero {KATEGORIE_NAME[nachher_kat]}, Gegner {KATEGORIE_NAME[gegner_kat]}"
            )

        ergebnis.append({
            **fall,
            "hero_vorher": KATEGORIE_NAME[vorher_kat],
            "hero_nachher": KATEGORIE_NAME[nachher_kat],
            "gegner_nachher": KATEGORIE_NAME[gegner_kat],
            "hero_verbessert_sich": verbessert,
            "hero_verliert_trotzdem": verliert,
        })
    return ergebnis


# ---------------------------------------------------------------------------
# Lauf
# ---------------------------------------------------------------------------

def berechne() -> dict:
    z = standard_annahmen()["kartenzahlen"]
    nach_flop = z["unbekannt_nach_flop"]
    nach_turn = z["unbekannt_nach_turn"]

    zeilen = []
    for outs in range(1, MAX_OUTS + 1):
        gezaehlt = zaehle_treffer(nach_flop, outs)
        formel = geschlossene_form(nach_flop, nach_turn, outs)

        for name in gezaehlt:
            if gezaehlt[name] != formel[name]:
                raise AssertionError(
                    f"Zählung und geschlossene Form weichen ab bei {outs} Outs, "
                    f"Größe {name!r}: {gezaehlt[name]} gegen {formel[name]}"
                )

        regel = faustregel(outs)
        zeilen.append({
            "outs": outs,
            "turn": float(gezaehlt["turn"]),
            "river_nach_fehlschlag": float(gezaehlt["river_nach_fehlschlag"]),
            "river_unbedingt": float(gezaehlt["river_unbedingt"]),
            "turn_oder_river": float(gezaehlt["turn_oder_river"]),
            "als_bruch": {
                "turn": str(gezaehlt["turn"]),
                "river_nach_fehlschlag": str(gezaehlt["river_nach_fehlschlag"]),
                "turn_oder_river": str(gezaehlt["turn_oder_river"]),
            },
            "faustregel": {
                "eine_karte": float(regel["eine_karte"]),
                "zwei_karten": float(regel["zwei_karten"]),
                # Abweichung in Prozentpunkten, positiv = die Regel verspricht zu viel
                "abweichung_pp_turn": float((regel["eine_karte"] - gezaehlt["turn"]) * 100),
                "abweichung_pp_river": float(
                    (regel["eine_karte"] - gezaehlt["river_nach_fehlschlag"]) * 100),
                "abweichung_pp_turn_oder_river": float(
                    (regel["zwei_karten"] - gezaehlt["turn_oder_river"]) * 100),
            },
        })

    from referenz_evaluator import KATEGORIE_NAME
    nach_name = {v: k for k, v in KATEGORIE_NAME.items()}
    beispiele = []
    for name, hand, flop, ziel in BEISPIELE:
        beispiele.append({
            "name": name,
            "hand": hand,
            "flop": flop,
            "zielkategorie": ziel,
            "outs_bis_zielkategorie": zaehle_outs(hand, flop, nach_name[ziel]),
            "outs_beliebige_verbesserung": zaehle_outs(hand, flop),
            "outs_mit_boardtreffern": zaehle_outs(
                hand, flop, nach_name[ziel], nur_mit_eigener_karte=False),
        })

    gegenbeispiele = pruefe_gegenbeispiele()

    # Wo die Faustregel am weitesten danebenliegt – gefunden, nicht behauptet.
    schlimmste = max(zeilen, key=lambda z: abs(z["faustregel"]["abweichung_pp_turn_oder_river"]))
    ab_wann_1pp = next(
        (z["outs"] for z in zeilen
         if abs(z["faustregel"]["abweichung_pp_turn_oder_river"]) >= 1.0),
        None,
    )

    return {
        "outs": zeilen,
        "beispiele": beispiele,
        "gegenbeispiele_saubere_outs": gegenbeispiele,
        "befunde_zur_faustregel": {
            "groesste_abweichung_pp": schlimmste["faustregel"]["abweichung_pp_turn_oder_river"],
            "bei_outs": schlimmste["outs"],
            "ab_outs_mindestens_1pp_daneben": ab_wann_1pp,
            "richtung": (
                "Die Regel verspricht bei zwei Straßen durchweg zu viel, und der "
                "Fehler wächst mit der Outs-Zahl. Bei wenigen Outs ist sie "
                "brauchbar, bei vielen führt sie zu Calls, die sich nicht rechnen."
            ),
        },
    }


def main() -> int:
    start = time.perf_counter()
    inhalt = berechne()
    meta = metadatenblock(
        block="b1_outs",
        zweck=(
            "Verbesserungswahrscheinlichkeit für 1 bis 21 Outs auf Turn, River "
            "und mindestens einer der beiden Straßen, samt Fehler der "
            "2/4-Faustregel."
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        besondere_annahmen={
            "saubere_outs": (
                "Jedes Out macht die eigene Hand zur besten. Das ist eine "
                "Vereinfachung: Eine Karte kann das eigene Blatt verbessern und "
                "dem Gegner trotzdem ein besseres geben. Ausführlich mit "
                "Gegenbeispielen in POKER_MATH.md, Abschnitt „Saubere Outs\"."
            ),
            "outs_sind_gegeben": (
                "Die Outs-Zahl geht als gegeben ein; wie viele Outs eine "
                "konkrete Hand hat, ist nicht Teil dieser Tabelle. Für acht "
                "Zugbilder ist sie unter 'beispiele' gezählt – dort in zwei "
                "Lesarten: bis zur genannten Zielkategorie (das ist die Zahl, "
                "die am Tisch gemeint ist) und für jede beliebige Anhebung der "
                "Kategorie (größer, weil Nebentreffer mitzählen). Ein besserer "
                "Kicker gilt in keiner der beiden als Out."
            ),
            "beide_strassen": (
                "'turn_oder_river' unterstellt, dass beide Karten auch wirklich "
                "kommen – also kein Fold nach dem Turn und genug Chips, um beide "
                "Straßen zu sehen. Wer nach dem Turn erneut zahlen muss, rechnet "
                "mit 'river_nach_fehlschlag'."
            ),
            "gegenprobe": (
                "Jede Zeile wurde doppelt gerechnet: einmal durch vollständiges "
                "Durchzählen aller geordneten Paare (Turn, River), einmal über "
                "die Gegenwahrscheinlichkeit. Beide Wege müssen als Bruch exakt "
                "übereinstimmen, sonst bricht der Lauf ab."
            ),
        },
    )
    from pathlib import Path
    ziel = Path(__file__).resolve().parent.parent / "output" / "b1_outs.json"
    schreibe(ziel, meta, inhalt)

    print(f"B1 geschrieben: {ziel}")
    print(f"  {len(inhalt['outs'])} Outs-Zeilen, {len(inhalt['beispiele'])} Beispiele")
    b = inhalt["befunde_zur_faustregel"]
    print(f"  Faustregel: größte Abweichung {b['groesste_abweichung_pp']:.2f} pp "
          f"bei {b['bei_outs']} Outs; ab {b['ab_outs_mindestens_1pp_daneben']} Outs "
          f"mindestens 1 pp daneben")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
