"""Erzeugt die App-Sicht auf die gerechneten Daten.

Warum zwei Schichten
--------------------
Die Dateien in ``output/`` sind für den **Nachweis** gebaut: Sie tragen ihre
Annahmen, ihre Belege, ihre vollständigen Verteilungen und die Befunde mit
sich. Das ist richtig so — nur muss die App das nicht alles laden.

Diese Datei erzeugt daraus ``output/app/``: dieselbe Wahrheit, auf das
reduziert, was ein Bildschirm braucht. Sie ist die **einzige** Stelle, an der
aus Rechenergebnis Anzeigedaten werden. Damit gibt es genau einen Ort, an dem
sich ein Feldname ändern kann.

Was dabei NICHT passiert
------------------------
Es wird nichts umgerechnet, nichts gerundet und nichts umbenannt, dessen
Bedeutung dabei verrutschen könnte. Die Feldnamen bleiben **dieselben** wie im
Rechenergebnis — auch die deutschen. Eine Übersetzungsschicht wäre genau die
Stelle, an der ``turn_oder_river`` irgendwann auf das Feld für den Turn
gemappt wird und es niemandem auffällt.

Der Vertrag
-----------
Jede App-Datei trägt ``vertrag_version``. Erhöht wird sie, sobald ein Feld
verschwindet oder seine Bedeutung wechselt. Die App lehnt eine Datei mit
unbekannter Version ab, statt sie halb zu verstehen.
"""

from __future__ import annotations

import json
import time
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "output"
ZIEL = QUELLE / "app"

#: Zusätzlich direkt dorthin, wo die App die Dateien erwartet. Der Umweg über
#: einen manuellen Kopierschritt wäre eine Fehlerquelle: Er wird irgendwann
#: vergessen, und dann zeigt die App wochenlang alte Zahlen an, ohne dass es
#: auffällt.
APP_ZIEL = WURZEL.parent.parent / "public" / "pokermath"

#: Version des Datenvertrags zwischen Generator und App.
#: Erhöhen, sobald ein Feld verschwindet oder seine Bedeutung wechselt.
#: Ein NEUES Feld allein ist kein Grund – die App ignoriert, was sie nicht kennt.
VERTRAG_VERSION = 1

#: Ab dieser Spanne darf die App keinen Einzelwert ohne Hinweis zeigen (K3).
SPANNE_KENNZEICHEN_PP = 1.0


def _lade(name: str) -> dict | None:
    pfad = QUELLE / f"{name}.json"
    if not pfad.exists():
        return None
    return json.loads(pfad.read_text(encoding="utf-8"))


def _kopf(quelle: dict, block: str) -> dict:
    """Der kleine Kopf, den jede App-Datei trägt.

    Die Annahmen kommen mit — gekürzt, aber vollständig genug, dass die App
    sie anzeigen kann. Eine Zahl ohne ihre Annahme ist in dieser App nicht
    erlaubt, auch nicht im Frontend.
    """
    m = quelle["metadaten"]
    return {
        "vertrag_version": VERTRAG_VERSION,
        "block": block,
        "methode": m["methode"],
        "erzeugt_am": m["erzeugt_am"],
        "annahmen": {
            "sicht": m["annahmen"]["sicht"],
            "unbekannte_karten": m["annahmen"]["unbekannte_karten"],
            "split_pot": m["annahmen"]["split_pot"],
        },
        "quelle": f"tools/poker-math/output/{block}.json",
    }


# ---------------------------------------------------------------------------
# B1
# ---------------------------------------------------------------------------

def app_b1(d: dict) -> dict:
    """Outs-Tabelle, Zugbilder, Gegenbeispiele.

    Weggelassen: die Bruchdarstellungen (die App rechnet nicht weiter) und die
    Belege der Befunde (die gehören in die Prüfung, nicht auf den Bildschirm).
    """
    return {
        **_kopf(d, "b1_outs"),
        "outs": [
            {
                "outs": z["outs"],
                "turn": z["turn"],
                "river_nach_fehlschlag": z["river_nach_fehlschlag"],
                "turn_oder_river": z["turn_oder_river"],
                "regel_zwei_karten": z["faustregel"]["zwei_karten"],
                "regel_abweichung_pp": z["faustregel"]["abweichung_pp_turn_oder_river"],
            }
            for z in d["outs"]
        ],
        "zugbilder": [
            {
                "name": b["name"],
                "hand": b["hand"],
                "flop": b["flop"],
                "zielkategorie": b["zielkategorie"],
                "outs": b["outs_bis_zielkategorie"],
                "outs_falsch_gezaehlt": b["outs_mit_boardtreffern"],
            }
            for b in d["beispiele"]
        ],
        "gegenbeispiele": [
            {
                "name": g["name"],
                "hand": g["hand"],
                "flop": g["flop"],
                "out": g["out"],
                "gegner": g["gegner"],
                "hero_nachher": g["hero_nachher"],
                "gegner_nachher": g["gegner_nachher"],
                "erklaerung": g["erklaerung"],
            }
            for g in d["gegenbeispiele_saubere_outs"]
        ],
        "befunde": [{"schluessel": b["schluessel"], "aussage": b["aussage"]}
                    for b in d["befunde"]],
    }


# ---------------------------------------------------------------------------
# B2
# ---------------------------------------------------------------------------

def app_b2(d: dict) -> dict:
    return {
        **_kopf(d, "b2_potodds"),
        "einsatzgroessen": [
            {
                "name": z["name"],
                "einsatz_als_potanteil": z["einsatz_als_potanteil"],
                "einsatz_als_bruch": z["einsatz_als_bruch"],
                "noetige_equity": z["anteil_am_endpot"],
                "pot_odds_zu_eins": z["pot_odds_zu_eins"],
                "mindest_outs_turn": z["mindest_outs"]["turn"],
                "mindest_outs_river": z["mindest_outs"]["river_nach_fehlschlag"],
                "mindest_outs_beide": z["mindest_outs"]["turn_oder_river"],
            }
            for z in d["einsatzgroessen"]
        ],
        "befunde": [{"schluessel": b["schluessel"], "aussage": b["aussage"]}
                    for b in d["befunde"]],
    }


# ---------------------------------------------------------------------------
# B3
# ---------------------------------------------------------------------------

def app_b3(d: dict) -> dict:
    """Kombinatorik.

    Die vollständigen Blocker-Verteilungen bleiben draußen: Sie sind für den
    Nachweis da, nicht für die Anzeige. Die App bekommt je Handtyp und Anzahl
    bekannter Karten den schlimmsten, den besten und den mittleren Fall.
    """
    def kurz(zeilen):
        return [
            {
                "bekannte_karten": z["bekannte_karten"],
                "ohne_blocker": z["kombos_ohne_blocker"],
                "schlimmstenfalls": z["schlimmstenfalls_uebrig"],
                "bestenfalls": z["bestenfalls_uebrig"],
                "im_mittel": z["im_mittel_uebrig"],
            }
            for z in zeilen
        ]

    return {
        **_kopf(d, "b3_kombinatorik"),
        "kombos_je_typ": d["kombos_je_typ"],
        "klassen_je_typ": d["klassen_je_typ"],
        "gesamt": {
            "starthand_klassen": d["gesamt"]["starthand_klassen"],
            "zweikartenblaetter": d["gesamt"]["zweikartenblaetter"],
        },
        "blocker": {
            "Paar": kurz(d["blocker"]["Paar"]),
            "suited": kurz(d["blocker"]["suited"]),
            "offsuit": kurz(d["blocker"]["offsuit"]),
        },
        "beispiel": {
            "hand": d["beispiel"]["hand"],
            "board": d["beispiel"]["board"],
            "summe_vorher": d["beispiel"]["summe_vorher"],
            "summe_nachher": d["beispiel"]["summe_nachher"],
            "je_starthand": d["beispiel"]["je_starthand"],
        },
        "befunde": [{"schluessel": b["schluessel"], "aussage": b["aussage"]}
                    for b in d["befunde"]],
    }


# ---------------------------------------------------------------------------
# B4
# ---------------------------------------------------------------------------

def app_b4(d: dict) -> dict:
    """Die Equity-Matrix, auf Anzeigegröße gebracht.

    Die vollständige Datei trägt für jedes der 14 365 Handpaare alle
    Farbkonfigurationen mit Boardzahlen — mehrere Dutzend Megabyte. Die App
    bekommt:

    - je Handpaar den gewichteten Wert, die Spanne und das Kennzeichen,
    - die einzelnen Farbkonfigurationen **nur** für die gekennzeichneten
      Handpaare. Nur dort braucht die App sie, und nur dort darf sie einen
      Einzelwert nicht ohne Hinweis zeigen (K3).
    """
    matchups = []
    for m in d["matchups"]:
        eintrag = {
            "a": m["hand_a"],
            "b": m["hand_b"],
            "equity_a": round(m["equity_a"], 6),
            "spanne_pp": round(m["spanne_pp"], 4),
            "spanne_relevant": m["spanne_relevant"],
        }
        if m["spanne_relevant"]:
            eintrag["farbkonfigurationen"] = [
                {
                    "beziehung": k["beziehung"],
                    "haeufigkeit": k["haeufigkeit"],
                    "equity_a": round(k["equity_a"], 6),
                }
                for k in m["farbkonfigurationen"]
            ]
        matchups.append(eintrag)

    return {
        **_kopf(d, "b4_preflop_equity"),
        "hinweis_zur_spanne": (
            f"Ist 'spanne_relevant' wahr, hängt die Equity um mehr als "
            f"{SPANNE_KENNZEICHEN_PP} Prozentpunkt davon ab, wie die Farben "
            f"zwischen den Händen liegen. Die App darf dort keinen Einzelwert "
            f"anzeigen, ohne die Spanne zu nennen."
        ),
        "matchups": matchups,
        "befunde": [{"schluessel": b["schluessel"], "aussage": b["aussage"]}
                    for b in d["befunde"]],
    }


# ---------------------------------------------------------------------------
# Lauf
# ---------------------------------------------------------------------------

BLOECKE = [
    ("b1_outs", app_b1),
    ("b2_potodds", app_b2),
    ("b3_kombinatorik", app_b3),
    ("b4_preflop_equity", app_b4),
]


def main() -> int:
    ZIEL.mkdir(parents=True, exist_ok=True)
    start = time.perf_counter()
    gebaut, fehlend = [], []

    for name, bauen in BLOECKE:
        quelle = _lade(name)
        if quelle is None:
            fehlend.append(name)
            continue
        inhalt = bauen(quelle)
        # Kompakt, weil die App das liest und nicht ein Mensch.
        text = json.dumps(inhalt, ensure_ascii=False, separators=(",", ":")) + "\n"
        pfad = ZIEL / f"{name}.json"
        pfad.write_text(text, encoding="utf-8")
        APP_ZIEL.mkdir(parents=True, exist_ok=True)
        (APP_ZIEL / f"{name}.json").write_text(text, encoding="utf-8")
        gebaut.append((name, pfad.stat().st_size))

    for name, groesse in gebaut:
        print(f"  {name:24} {groesse / 1024:9.1f} KB")
    for name in fehlend:
        print(f"  {name:24} noch nicht gerechnet – übersprungen")
    print(f"Vertrag Version {VERTRAG_VERSION}, in {time.perf_counter() - start:.2f} s")
    print(f"Auch geschrieben nach: {APP_ZIEL}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
