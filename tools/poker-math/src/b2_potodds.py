"""B2 — Pot Odds und die nötige Mindest-Equity.

Was gerechnet wird
------------------
Für acht gebräuchliche Einsatzgrößen, ausgedrückt als Anteil des Pots:

- der zu callende Betrag im Verhältnis zum **Endpot**,
- die daraus folgende **Mindest-Equity**, ab der ein Call sich rechnet,
- die Pot Odds in der Sprechweise „X zu 1",
- und — abgeleitet aus B1 — wie viele **Outs** man dafür mindestens braucht.

Die Rechnung
------------
Der Pot enthält vor dem Einsatz eine Einheit. Der Gegner setzt den Anteil *b*.
Wer callt, legt ebenfalls *b* nach. Danach enthält der Pot

    1 + b + b = 1 + 2b

und der eigene Anteil daran ist *b*. Der Call lohnt sich also ab einer Equity von

    b / (1 + 2b)

Gerechnet wird durchgehend mit **Brüchen**, nicht mit Fließkommazahlen: Ein
Drittel Pot ist ein Drittel und nicht 0,3333333.

Was diese Zahl NICHT enthält
----------------------------
Implizite Odds — also das Geld, das man in späteren Runden noch gewinnt, wenn
man trifft. Sie machen marginale Calls oft doch profitabel und sind der
Hauptgrund, warum diese Tabelle eine **Untergrenze** angibt und keine
Entscheidung. Das Gegenstück, wie viel man später gewinnen muss, steht in B6.
"""

from __future__ import annotations

import time
from fractions import Fraction

from b1_outs import MAX_OUTS, zaehle_treffer
from befunde import befund, prozent, zahl
from metadaten import metadatenblock, schreibe, standard_annahmen

#: Einsatzgrößen als Anteil des Pots. Als Bruch, weil „ein Drittel Pot" ein
#: Drittel ist – jede Dezimaldarstellung wäre schon eine Rundung.
EINSATZGROESSEN = [
    ("Viertel Pot", Fraction(1, 4)),
    ("Drittel Pot", Fraction(1, 3)),
    ("Halber Pot", Fraction(1, 2)),
    ("Zwei Drittel Pot", Fraction(2, 3)),
    ("Drei Viertel Pot", Fraction(3, 4)),
    ("Pot", Fraction(1, 1)),
    ("Anderthalbfacher Pot", Fraction(3, 2)),
    ("Doppelter Pot", Fraction(2, 1)),
]


def noetige_equity(einsatz: Fraction) -> Fraction:
    """Ab welcher Gewinnwahrscheinlichkeit lohnt der Call?

    Der eigene Einsatz geteilt durch den Pot, in dem er landet.
    """
    return einsatz / (1 + 2 * einsatz)


def pot_odds(einsatz: Fraction) -> Fraction:
    """Wie viel liegt schon drin, je Einheit, die man nachlegen muss?

    Das ist die Sprechweise „ich bekomme drei zu eins".
    """
    return (1 + einsatz) / einsatz


def mindest_outs(noetig: Fraction, nach_flop: int) -> dict[str, int | None]:
    """Die kleinste Outs-Zahl, deren Trefferchance die nötige Equity erreicht.

    Abgeleitet aus B1 – dieselbe Zählung, kein zweiter Rechenweg. ``None``
    bedeutet: Mit bis zu ``MAX_OUTS`` Outs wird diese Equity nicht erreicht.
    """
    ergebnis: dict[str, int | None] = {}
    for feld in ("turn", "river_nach_fehlschlag", "turn_oder_river"):
        ergebnis[feld] = next(
            (o for o in range(1, MAX_OUTS + 1)
             if zaehle_treffer(nach_flop, o)[feld] >= noetig),
            None,
        )
    return ergebnis


def berechne() -> dict:
    nach_flop = standard_annahmen()["kartenzahlen"]["unbekannt_nach_flop"]

    zeilen = []
    for name, b in EINSATZGROESSEN:
        noetig = noetige_equity(b)
        odds = pot_odds(b)
        outs = mindest_outs(noetig, nach_flop)

        # Wie viel Luft bleibt, wenn man mit genau so vielen Outs callt?
        ueberschuss = {}
        for feld, o in outs.items():
            if o is None:
                ueberschuss[feld] = None
            else:
                ist = zaehle_treffer(nach_flop, o)[feld]
                ueberschuss[feld] = float((ist - noetig) * 100)

        zeilen.append({
            "name": name,
            "einsatz_als_potanteil": float(b),
            "einsatz_als_bruch": str(b),
            "anteil_am_endpot": float(noetig),
            "anteil_am_endpot_als_bruch": str(noetig),
            "noetige_equity_prozent": float(noetig * 100),
            "pot_odds_zu_eins": float(odds),
            "pot_odds_text": f"{float(odds):.2f} zu 1",
            "mindest_outs": outs,
            "ueberschuss_pp": ueberschuss,
        })

    return {"einsatzgroessen": zeilen, "befunde": befunde_zu_b2(zeilen)}


def befunde_zu_b2(zeilen: list[dict]) -> list[dict]:
    """Aussagen über die Pot-Odds-Tabelle, aus ihr erzeugt."""
    groesster = zeilen[-1]
    halber = next(z for z in zeilen if z["einsatz_als_bruch"] == "1/2")
    voller = next(z for z in zeilen if z["einsatz_als_bruch"] == "1")

    # Steigt die nötige Equity über alle Einsatzgrößen? Geprüft, nicht behauptet.
    steigt = all(b["noetige_equity_prozent"] > a["noetige_equity_prozent"]
                 for a, b in zip(zeilen, zeilen[1:]))
    outs_steigen = all(
        (b["mindest_outs"]["turn_oder_river"] or 0) >= (a["mindest_outs"]["turn_oder_river"] or 0)
        for a, b in zip(zeilen, zeilen[1:]))

    # Die Schranke: Wohin läuft die nötige Equity bei beliebig großem Einsatz?
    from fractions import Fraction
    riesig = float(noetige_equity(Fraction(10**6)))

    return [
        befund(
            "hoechstens_die_haelfte",
            f"Selbst der größte Einsatz dieser Tabelle verlangt nur "
            f"{prozent(groesster['noetige_equity_prozent'] / 100)}. Die Schwelle "
            f"erreicht nie 50 %, weil der Gegner denselben Betrag hineinlegt.",
            {
                "groesster_einsatz": groesster["einsatz_als_bruch"],
                "noetige_equity": round(groesster["noetige_equity_prozent"] / 100, 6),
                "grenzwert_bei_millionenfachem_pot": round(riesig, 6),
                "obere_schranke": 0.5,
            },
        ),
        befund(
            "steigt_durchgehend",
            f"Über alle {len(zeilen)} Einsatzgrößen steigt die nötige Equity "
            f"durchgehend: {'ja' if steigt else 'nein'}. Die Zahl der nötigen "
            f"Outs steigt mit: {'ja' if outs_steigen else 'nein'}.",
            {
                "einsatzgroessen": len(zeilen),
                "equity_steigt_durchgehend": steigt,
                "outs_steigen_mit": outs_steigen,
                "von": zeilen[0]["noetige_equity_prozent"] / 100,
                "bis": groesster["noetige_equity_prozent"] / 100,
            },
        ),
        befund(
            "halber_pot",
            f"Beim halben Pot liegt die Schwelle bei genau "
            f"{prozent(halber['noetige_equity_prozent'] / 100, 0)}, beim vollen Pot bei "
            f"{prozent(voller['noetige_equity_prozent'] / 100)}.",
            {
                "halber_pot_equity": round(halber["noetige_equity_prozent"] / 100, 6),
                "voller_pot_equity": round(voller["noetige_equity_prozent"] / 100, 6),
                "halber_pot_als_bruch": halber["anteil_am_endpot_als_bruch"],
                "voller_pot_als_bruch": voller["anteil_am_endpot_als_bruch"],
                "halber_pot_outs_beide_strassen": halber["mindest_outs"]["turn_oder_river"],
                "voller_pot_outs_beide_strassen": voller["mindest_outs"]["turn_oder_river"],
            },
        ),
    ]


def main() -> int:
    start = time.perf_counter()
    inhalt = berechne()
    meta = metadatenblock(
        block="b2_potodds",
        zweck=(
            "Mindest-Equity und Mindest-Outs für acht Einsatzgrößen, jeweils als "
            "Anteil des Pots."
        ),
        methode="exakt",
        laufzeit_s=time.perf_counter() - start,
        braucht_evaluator=False,
        besondere_annahmen={
            "einsatz_als_potanteil": (
                "Der Pot enthält vor dem Einsatz eine Einheit; der Einsatz wird "
                "als Anteil davon angegeben. Gerechnet wird mit Brüchen, nicht "
                "mit Dezimalzahlen."
            ),
            "heads_up": (
                "Es zahlt genau ein Gegner. Bei mehreren Callern wächst der Pot "
                "weiter, und die nötige Equity sinkt – diese Tabelle gibt dann "
                "eine zu strenge Schwelle an."
            ),
            "keine_impliziten_odds": (
                "Späteres Geld bleibt unberücksichtigt. Die Werte sind eine "
                "Untergrenze für einen Call, der sich sofort rechnet, keine "
                "Spielempfehlung."
            ),
            "outs_aus_b1": (
                "Die Mindest-Outs kommen aus derselben Zählung wie B1 und tragen "
                "damit dieselben Annahmen – insbesondere die der sauberen Outs."
            ),
        },
    )
    from pathlib import Path
    ziel = Path(__file__).resolve().parent.parent / "output" / "b2_potodds.json"
    schreibe(ziel, meta, inhalt)

    print(f"B2 geschrieben: {ziel}")
    for z in inhalt["einsatzgroessen"]:
        o = z["mindest_outs"]
        print(f"  {z['name']:22} {z['einsatz_als_bruch']:>4} Pot → "
              f"{z['noetige_equity_prozent']:5.2f} % nötig, "
              f"{z['pot_odds_text']:>9}, "
              f"Outs: Turn {o['turn']}, beide {o['turn_oder_river']}")
    print("  Befunde:")
    for b in inhalt["befunde"]:
        print(f"    · {b['aussage']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
