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

from befunde import befund, prozent, prozentpunkte, zahl
from karten import ALLE_KARTEN, aus_text
from metadaten import (
    Faelle, evaluator_angabe, metadatenblock, schreibe, standard_annahmen, zs,
)

#: Zählt mit, was diese Rechnung tatsächlich durchgeht. Die Zahl landet im
#: Metadatenblock und von dort in die Herkunftsanzeige der App: „über wie
#: viele Fälle wurde gerechnet?" darf keine hergeleitete Behauptung sein,
#: sondern eine Beobachtung am laufenden Code.
#: Jede Zählstelle einmal benannt, in beiden Sprachen. Die Namen stehen in
#: der Herkunftsanzeige der App und sagen, was mit „Fällen" gemeint ist.
ZAEHLSTELLEN = {
    "turn_river_paare": zs("Paare aus Turn- und Riverkarte",
                           "pairs of turn and river card"),
    "fuenfkartenblaetter_bewertet": zs("bewertete Fünfkartenblätter",
                                       "five-card hands evaluated"),
    "kandidatenkarten_geprueft": zs("geprüfte Kandidatenkarten",
                                    "candidate cards checked"),
    "gegnerhaende_geprueft": zs("geprüfte Gegnerhände", "opponent hands checked"),
}

FAELLE = Faelle(ZAEHLSTELLEN)

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

    FAELLE.zaehle("turn_river_paare", paare)
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
    # Erst auflisten, dann das beste suchen: Nur so lässt sich zählen, wie
    # viele Blätter tatsächlich geprüft wurden, statt die Zahl hinterher aus
    # einer Formel zu behaupten.
    kandidaten = list(combinations(karten, 5))
    FAELLE.zaehle("fuenfkartenblaetter_bewertet", len(kandidaten))
    beste = max(kandidaten, key=lambda f: eval7.evaluate([e7[c] for c in f]))
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
        FAELLE.zaehle("kandidatenkarten_geprueft")
        kategorie, blatt = _bestes_blatt(bekannt + [c])
        if kategorie < schwelle:
            continue
        if nur_mit_eigener_karte and not _traegt_die_kategorie(blatt, kategorie, eigene):
            continue
        treffer += 1
    return treffer


#: Zwei Boards, an denen sich zeigt, dass die Gefahr am Board hängt und nicht
#: an der Hand. Beide mit Heros vollendeter Straße; gezählt wird, wie viele
#: Gegner-Kombos sie schlagen.
VERBUNDEN = {"hand": "7d 6d", "board": "9c 8s 2h Th",
             "beschreibung": "Board liefert selbst drei Straßenkarten"}
UNVERBUNDEN = {"hand": "9d 8d", "board": "7c 6s 2h 5s",
               "beschreibung": "Board liefert keine zusammenhängende Folge"}

#: Bekannte Zugbilder. Die NAMEN und die Zielkategorie sind Fachsprache, die
#: Outs-Zahlen dahinter werden gezählt.
#: (Name deutsch, Name englisch, Hand, Flop, Zielkategorie deutsch)
#: Die Zielkategorie ist zugleich der Nachschlageschlüssel in KATEGORIE_NAME;
#: ihre englische Entsprechung kommt aus KATEGORIE_NAME_EN und wird nicht hier
#: danebengeschrieben – sonst gäbe es zwei Wahrheiten für dasselbe Wort.
BEISPIELE = [
    ("Flushdraw",                      "Flush draw",                    "Ah 7h", "Kh 4h 2c", "Flush"),
    ("Offene Straße",                  "Open-ended straight draw",      "9c 8d", "7h 6s 2c", "Straße"),
    ("Gutshot",                        "Gutshot",                       "9c 8d", "7h 5s 2c", "Straße"),
    ("Zwei Überkarten",                "Two overcards",                 "Ac Kd", "9h 7s 2c", "Ein Paar"),
    ("Flushdraw plus zwei Überkarten", "Flush draw plus two overcards", "Ah Kh", "9h 7h 2c", "Ein Paar"),
    ("Flushdraw plus offene Straße",   "Flush draw plus open-ender",    "9h 8h", "7h 6h 2c", "Straße"),
    ("Unterpaar sucht das Set",        "Underpair looking for a set",   "5c 5d", "Ah 9s 2c", "Drilling"),
    ("Set sucht das Full House",       "Set looking for the full house","9c 9d", "9h 7s 2c", "Full House"),
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
        "name_en": "The out hands the opponent a flush",
        "hand": "9d 8d",
        "flop": "7c 6c 2h",
        "out": "5c",
        "gegner": "Ac Jc",
        "erklaerung": (
            "Die Fünf ist ein sauber gezähltes Straßen-Out: Hero hält "
            "9-8-7-6-5. Sie ist aber ein Kreuz, und damit liegen drei Kreuz "
            "auf dem Board – der Gegner mit zwei Kreuz hat den Flush."
        ),
        "erklaerung_en": (
            "The five is a properly counted straight out: the hero holds "
            "9-8-7-6-5. But it is a club, which puts three clubs on the board "
            "– an opponent holding two clubs has the flush."
        ),
    },
    {
        "name": "Das Out gibt dem Gegner die höhere Straße",
        "name_en": "The out hands the opponent the better straight",
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
        "erklaerung_en": (
            "The ten completes the hero's straight to the ten. Because the "
            "board itself supplies three straight cards, a single jack is "
            "enough for the opponent to hold the higher straight – the "
            "dominated straight, the most expensive case of its kind. Note: "
            "this only works when the board makes the connection; on a flop "
            "like 7-6-2 nobody can hold a higher straight."
        ),
    },
    {
        "name": "Das Out paart das Board und füllt das Full House",
        "name_en": "The out pairs the board and fills a full house",
        "hand": "Ah Kh",
        "flop": "Qh 7h 7c",
        "out": "2h",
        "gegner": "7s 2c",
        "erklaerung": (
            "Das Herz vollendet Heros Nut-Flush. Dieselbe Karte paart die Zwei "
            "und gibt dem Gegner mit Siebener-Drilling das Full House."
        ),
        "erklaerung_en": (
            "The heart completes the hero's nut flush. The same card pairs the "
            "deuce and gives the opponent with trip sevens a full house."
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
    from referenz_evaluator import KATEGORIE_NAME, KATEGORIE_NAME_EN

    def kat(i):
        return zs(KATEGORIE_NAME[i], KATEGORIE_NAME_EN[i])

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
            **{k: v for k, v in fall.items()
               if k not in ("name", "name_en", "erklaerung", "erklaerung_en")},
            "name": zs(fall["name"], fall["name_en"]),
            "erklaerung": zs(fall["erklaerung"], fall["erklaerung_en"]),
            "hero_vorher": kat(vorher_kat),
            "hero_nachher": kat(nachher_kat),
            "gegner_nachher": kat(gegner_kat),
            "hero_verbessert_sich": verbessert,
            "hero_verliert_trotzdem": verliert,
        })
    return ergebnis


# ---------------------------------------------------------------------------
# Lauf
# ---------------------------------------------------------------------------

def berechne() -> dict:
    # Der Zähler beginnt bei null: Er soll diesen Lauf beschreiben, nicht
    # alles, was ein Testlauf vorher durch das Modul geschickt hat.
    globals()["FAELLE"] = Faelle(ZAEHLSTELLEN)
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

    from referenz_evaluator import KATEGORIE_NAME, KATEGORIE_NAME_EN
    nach_name = {v: k for k, v in KATEGORIE_NAME.items()}
    beispiele = []
    for name, name_en, hand, flop, ziel in BEISPIELE:
        beispiele.append({
            "name": zs(name, name_en),
            "hand": hand,
            "flop": flop,
            "zielkategorie": zs(ziel, KATEGORIE_NAME_EN[nach_name[ziel]]),
            "outs_bis_zielkategorie": zaehle_outs(hand, flop, nach_name[ziel]),
            "outs_beliebige_verbesserung": zaehle_outs(hand, flop),
            "outs_mit_boardtreffern": zaehle_outs(
                hand, flop, nach_name[ziel], nur_mit_eigener_karte=False),
        })

    gegenbeispiele = pruefe_gegenbeispiele()

    return {
        "outs": zeilen,
        "beispiele": beispiele,
        "gegenbeispiele_saubere_outs": gegenbeispiele,
        "befunde": befunde_zu_b1(zeilen, beispiele, nach_flop),
    }


def umschlagpunkt(zeilen: list[dict]) -> int | None:
    """Bei welcher Outs-Zahl wechselt der Fehler der Regel das Vorzeichen?

    Gesucht wird die kleinste Outs-Zahl, ab der die Regel **zu viel**
    verspricht, nachdem sie vorher zu wenig versprochen hat. Der Punkt wird
    hier bestimmt und nicht formuliert — genau daran ist die erste Fassung
    dieser Datei gescheitert.
    """
    vorher = None
    for z in zeilen:
        a = z["faustregel"]["abweichung_pp_turn_oder_river"]
        if vorher is not None and vorher < 0 <= a:
            return z["outs"]
        vorher = a
    return None


def zaehle_gegner_die_schlagen(hand: str, board: str) -> dict:
    """Wie viele der verbleibenden Gegner-Kombos schlagen Heros Blatt?

    Reine Auszählung, ohne jede Annahme über die Spielweise. Sie beantwortet
    nicht „wie oft verliere ich", sondern „wie viele Hände wären besser" – und
    genau das ist der Unterschied zwischen Kombinatorik und Strategie.
    """
    global _EVAL7_KARTEN
    if _EVAL7_KARTEN is None:
        _EVAL7_KARTEN = _eval7_karten()
    import eval7
    from itertools import combinations

    e7 = _EVAL7_KARTEN
    eigene = [aus_text(t) for t in hand.split()]
    brett = [aus_text(t) for t in board.split()]
    bekannt = set(eigene) | set(brett)

    _, hero_blatt = _bestes_blatt(eigene + brett)
    hero_wert = eval7.evaluate([e7[c] for c in hero_blatt])

    frei = [c for c in ALLE_KARTEN if c not in bekannt]
    besser = gleich = gesamt = 0
    for a, b in combinations(frei, 2):
        gesamt += 1
        FAELLE.zaehle("gegnerhaende_geprueft")
        _, g_blatt = _bestes_blatt([a, b] + brett)
        w = eval7.evaluate([e7[c] for c in g_blatt])
        if w > hero_wert:
            besser += 1
        elif w == hero_wert:
            gleich += 1
    return {"kombos_gesamt": gesamt, "schlagen_hero": besser, "gleichstand": gleich}


def befunde_zu_b1(zeilen: list[dict], beispiele: list[dict], nach_flop: int) -> list[dict]:
    """Alle Aussagen über die B1-Daten, aus den Daten erzeugt."""
    abw = {z["outs"]: z["faustregel"]["abweichung_pp_turn_oder_river"] for z in zeilen}
    exakt = {z["outs"]: z["turn_oder_river"] for z in zeilen}

    wechsel = umschlagpunkt(zeilen)
    ab_1pp = next((o for o in sorted(abw) if abs(abw[o]) >= 1.0), None)
    schlimmster = max(abw, key=lambda o: abs(abw[o]))

    # Wächst der Fehler ab dem Wechsel ununterbrochen? Nicht behaupten – prüfen.
    ab_wechsel = [o for o in sorted(abw) if wechsel is not None and o >= wechsel]
    waechst_durchgehend = all(abw[b] > abw[a] for a, b in zip(ab_wechsel, ab_wechsel[1:]))

    # Der größte Unterschied zwischen den beiden River-Lesarten.
    river_spanne = max(
        (z["river_nach_fehlschlag"] - z["river_unbedingt"]) * 100 for z in zeilen)
    river_spanne_bei = max(
        zeilen, key=lambda z: z["river_nach_fehlschlag"] - z["river_unbedingt"])["outs"]

    ueberkarten = next(b for b in beispiele if b["name"]["de"] == "Zwei Überkarten")

    verbunden = zaehle_gegner_die_schlagen(VERBUNDEN["hand"], VERBUNDEN["board"])
    unverbunden = zaehle_gegner_die_schlagen(UNVERBUNDEN["hand"], UNVERBUNDEN["board"])

    liste = [
        befund(
            "umschlagpunkt",
            f"Bis {wechsel - 1} Outs verspricht die 2/4-Regel zu wenig, "
            f"ab {wechsel} Outs zu viel.",
            f"Up to {wechsel - 1} outs the 2/4 rule promises too little, "
            f"from {wechsel} outs on too much.",
            {
                # Die Faktoren stehen hier, weil der Satz die Regel bei ihrem
                # Namen nennt („2/4-Regel") – und auch ein Name, der aus Zahlen
                # besteht, gehört belegt.
                "regel_faktor_eine_karte": 2,
                "regel_faktor_zwei_karten": 4,
                "letzte_outs_mit_zu_wenig": wechsel - 1,
                "umschlagpunkt_outs": wechsel,
                "abweichung_pp_davor": round(abw[wechsel - 1], 4),
                "abweichung_pp_danach": round(abw[wechsel], 4),
            },
        ),
        befund(
            "erste_grosse_abweichung",
            f"Ab {ab_1pp} Outs liegt die Regel um mehr als einen Prozentpunkt daneben.",
            f"From {ab_1pp} outs on the rule is off by more than one "
            f"percentage point.",
            {
                "outs": ab_1pp,
                "abweichung_pp": round(abw[ab_1pp], 4),
                "abweichung_pp_eins_darunter": round(abw[ab_1pp - 1], 4),
            },
        ),
        befund(
            "groesste_abweichung",
            f"Am weitesten daneben liegt sie bei {schlimmster} Outs: "
            f"{prozent(exakt[schlimmster])} tatsächlich gegen "
            f"{zahl(4 * schlimmster, 0)} % nach der Regel, "
            f"also {prozentpunkte(abw[schlimmster])} zu viel.",
            f"It is furthest off at {schlimmster} outs: "
            f"{100 * exakt[schlimmster]:.2f} % in fact against "
            f"{4 * schlimmster:.0f} % by the rule, so "
            f"{abw[schlimmster]:.2f} pp too much.",
            {
                "outs": schlimmster,
                "exakt": round(exakt[schlimmster], 6),
                "regel": 4 * schlimmster / 100,
                "abweichung_pp": round(abw[schlimmster], 4),
                "hinweis": (
                    "Das ist der Rand der geprüften Tabelle. Der Fehler wächst "
                    "darüber hinaus weiter."
                ),
            },
        ),
        befund(
            "fehler_waechst",
            f"Ab dem Umschlagpunkt wächst der Fehler von Outs-Zahl zu Outs-Zahl "
            f"ohne Ausnahme: {'ja' if waechst_durchgehend else 'nein'}.",
            f"From the turning point on, the error grows from one outs count to "
            f"the next without exception: {'yes' if waechst_durchgehend else 'no'}.",
            {
                "geprueft_von_outs": wechsel,
                "geprueft_bis_outs": max(abw),
                "durchgehend_wachsend": waechst_durchgehend,
                "abweichungen_pp": [round(abw[o], 4) for o in ab_wechsel],
            },
        ),
        befund(
            "river_lesarten",
            f"Die beiden Lesarten von „River\" unterscheiden sich um bis zu "
            f"{prozentpunkte(river_spanne)}, am stärksten bei {river_spanne_bei} Outs.",
            f"The two readings of \"river\" differ by up to "
            f"{river_spanne:.2f} pp, most strongly at {river_spanne_bei} outs.",
            {
                "groesste_spanne_pp": round(river_spanne, 4),
                "bei_outs": river_spanne_bei,
                "erlaeuterung": (
                    "Wer die eine Lesart abschreibt und die andere meint, irrt "
                    "genau um diesen Betrag."
                ),
            },
        ),
        befund(
            "hoehere_strasse_haengt_am_board",
            f"Ob ein Out dem Gegner die höhere Straße geben kann, hängt am "
            f"Board: Auf {VERBUNDEN['board']} schlagen "
            f"{verbunden['schlagen_hero']} von {verbunden['kombos_gesamt']} "
            f"Gegner-Kombos Heros Straße, auf {UNVERBUNDEN['board']} sind es "
            f"{unverbunden['schlagen_hero']}.",
            f"Whether an out can hand the opponent the higher straight depends "
            f"on the board: on {VERBUNDEN['board']}, "
            f"{verbunden['schlagen_hero']} of {verbunden['kombos_gesamt']} "
            f"opponent combos beat the hero's straight; on "
            f"{UNVERBUNDEN['board']} it is {unverbunden['schlagen_hero']}.",
            {
                "verbundenes_board": {**VERBUNDEN, **verbunden},
                "unverbundenes_board": {**UNVERBUNDEN, **unverbunden},
                "erlaeuterung": (
                    "Auf dem verbundenen Board liefert das Board selbst drei "
                    "Straßenkarten; ein einzelner Bube reicht dem Gegner. Auf dem "
                    "unverbundenen Board kann niemand eine höhere Straße halten – "
                    "gefährlich sind dort andere Blätter, nicht die Straße."
                ),
            },
        ),
        befund(
            "boardtreffer",
            f"Zwei Überkarten haben {ueberkarten['outs_bis_zielkategorie']} Outs. "
            f"Zählt man Paare mit, die nur auf dem Board liegen, sind es "
            f"{ueberkarten['outs_mit_boardtreffern']}.",
            f"Two overcards have {ueberkarten['outs_bis_zielkategorie']} outs. "
            f"Counting pairs that sit on the board alone, it is "
            f"{ueberkarten['outs_mit_boardtreffern']}.",
            {
                "richtig_gezaehlt": ueberkarten["outs_bis_zielkategorie"],
                "mit_boardtreffern": ueberkarten["outs_mit_boardtreffern"],
                "hand": ueberkarten["hand"],
                "flop": ueberkarten["flop"],
            },
        ),
    ]
    return liste


def main() -> int:
    start = time.perf_counter()
    inhalt = berechne()
    meta = metadatenblock(
        block="b1_outs",
        zweck=zs(
            f"Verbesserungswahrscheinlichkeit für 1 bis {MAX_OUTS} Outs auf "
            f"Turn, River und mindestens einer der beiden Straßen, samt Fehler "
            f"der 2/4-Faustregel.",
            f"Probability of improving with 1 to {MAX_OUTS} outs on the turn, "
            f"the river and at least one of the two streets, together with the "
            f"error of the 2/4 rule of thumb.",
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        faelle=FAELLE,
        evaluator=evaluator_angabe(),
        besondere_annahmen={
            "saubere_outs": zs(
                "Jedes Out macht die eigene Hand zur besten. Das ist eine "
                "Vereinfachung: Eine Karte kann das eigene Blatt verbessern und "
                "dem Gegner trotzdem ein besseres geben. Ausführlich mit "
                "Gegenbeispielen in POKER_MATH.md, Abschnitt „Saubere Outs\".",
                "Every out turns your hand into the best one. That is a "
                "simplification: a card can improve your hand and still give an "
                "opponent a better one. Spelled out with counter-examples in "
                "POKER_MATH.md, section \"Saubere Outs\".",
            ),
            "outs_sind_gegeben": zs(
                "Die Outs-Zahl geht als gegeben ein; wie viele Outs eine "
                "konkrete Hand hat, ist nicht Teil dieser Tabelle. Für acht "
                "Zugbilder ist sie unter 'beispiele' gezählt – dort in zwei "
                "Lesarten: bis zur genannten Zielkategorie (das ist die Zahl, "
                "die am Tisch gemeint ist) und für jede beliebige Anhebung der "
                "Kategorie (größer, weil Nebentreffer mitzählen). Ein besserer "
                "Kicker gilt in keiner der beiden als Out.",
                "The number of outs is taken as given; how many outs a "
                "particular hand has is not part of this table. For eight draw "
                "pictures it is counted under 'beispiele' – in two readings: up "
                "to the named target category (the number meant at the table) "
                "and for any raise of the category at all (larger, because "
                "incidental hits count). A better kicker is an out in neither.",
            ),
            "beide_strassen": zs(
                "'turn_oder_river' unterstellt, dass beide Karten auch wirklich "
                "kommen – also kein Fold nach dem Turn und genug Chips, um beide "
                "Straßen zu sehen. Wer nach dem Turn erneut zahlen muss, rechnet "
                "mit 'river_nach_fehlschlag'.",
                "'turn_oder_river' assumes both cards actually come – so no fold "
                "after the turn and enough chips to see both streets. Anyone who "
                "has to pay again after the turn uses 'river_nach_fehlschlag'.",
            ),
            "gegenprobe": zs(
                "Jede Zeile wurde doppelt gerechnet: einmal durch vollständiges "
                "Durchzählen aller geordneten Paare (Turn, River), einmal über "
                "die Gegenwahrscheinlichkeit. Beide Wege müssen als Bruch exakt "
                "übereinstimmen, sonst bricht der Lauf ab.",
                "Every row was computed twice: once by fully counting all "
                "ordered (turn, river) pairs, once via the complementary "
                "probability. Both ways must agree exactly as fractions, "
                "otherwise the run aborts.",
            ),
        },
    )
    from pathlib import Path
    ziel = Path(__file__).resolve().parent.parent / "output" / "b1_outs.json"
    schreibe(ziel, meta, inhalt)

    print(f"B1 geschrieben: {ziel}")
    print(f"  {len(inhalt['outs'])} Outs-Zeilen, {len(inhalt['beispiele'])} Beispiele")
    print(f"  {len(inhalt['gegenbeispiele_saubere_outs'])} Gegenbeispiele nachgerechnet")
    print(f"  {FAELLE.gesamt} Einzelfälle durchgerechnet: {FAELLE.block()['je_teil']}")
    print("  Befunde (aus den Daten erzeugt):")
    for b in inhalt["befunde"]:
        print(f"    · {b['aussage']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
