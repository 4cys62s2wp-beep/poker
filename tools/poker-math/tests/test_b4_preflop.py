"""B4 — die Farb-Isomorphie muss exakt dasselbe liefern wie die volle Rechnung.

Die Reduktion um Faktor 17 ist der einzige Grund, warum B4 in Stunden statt in
Wochen rechnet. Wäre sie falsch, wäre jede Zahl in der Matrix falsch — und
zwar plausibel falsch, was schlimmer ist als offensichtlich falsch.

Deshalb wird sie hier gegen die **vollständige Enumeration ohne jede
Reduktion** gehalten: jedes konkrete Kombo-Paar einzeln gerechnet, ungewichtet
gemittelt. Verlangt wird exakte Übereinstimmung, keine Toleranz.
"""

import pytest

from b4_preflop_equity import (
    enumeriere, farbbeziehung, farbkonfigurationen, kanonform, rechne_matchup,
)
from karten import aus_text, kombos_fuer_kuerzel

#: Bewusst kleine Klassen, damit die volle Gegenrechnung in Minuten läuft.
GEGENPROBEN = [
    ("AKs", "QJs"),
    ("AKs", "AKs"),
    ("AA", "KK"),
    ("AA", "AKs"),
    ("72o", "AKs"),
]


def _h(text):
    return tuple(aus_text(x) for x in text.split())


def voll_ohne_reduktion(kuerzel_a: str, kuerzel_b: str) -> float:
    """Jedes konkrete Kombo-Paar einzeln, ohne Farb-Isomorphie."""
    summe = 0.0
    anzahl = 0
    for a in kombos_fuer_kuerzel(kuerzel_a):
        for b in kombos_fuer_kuerzel(kuerzel_b):
            if set(a) & set(b):
                continue
            summe += enumeriere(a, b)["equity_a"]
            anzahl += 1
    return summe / anzahl


@pytest.mark.langsam
@pytest.mark.parametrize("a,b", GEGENPROBEN)
def test_reduktion_liefert_exakt_dasselbe(a, b):
    mit = rechne_matchup(a, b)["equity_a"]
    ohne = voll_ohne_reduktion(a, b)
    # Die winzige Schranke deckt nur die Reihenfolge der Gleitkomma-Additionen
    # ab, nicht einen Rechenunterschied.
    assert abs(mit - ohne) < 1e-12, f"{a} gegen {b}: mit {mit!r}, ohne {ohne!r}"


@pytest.mark.parametrize("a,b", GEGENPROBEN)
def test_die_gewichte_decken_alle_paarungen_ab(a, b):
    """Schnelle Gegenprobe ohne Enumeration: Die Häufigkeiten der
    Farbkonfigurationen müssen genau alle konkreten Paarungen abdecken."""
    gruppen = farbkonfigurationen(a, b)
    summe = sum(g["anzahl"] for g in gruppen.values())
    erwartet = sum(
        1
        for x in kombos_fuer_kuerzel(a)
        for y in kombos_fuer_kuerzel(b)
        if not set(x) & set(y)
    )
    assert summe == erwartet


def test_kanonform_ist_unter_farbumbenennung_stabil():
    """Zwei Paarungen, die durch Farbtausch auseinander hervorgehen, müssen
    dieselbe Kanonform haben – sonst rechnet B4 dieselbe Sache mehrfach."""
    assert kanonform(_h("Ah Kh"), _h("Qs Qd")) == kanonform(_h("As Ks"), _h("Qh Qd"))
    # Eine geteilte Farbe ist dagegen etwas anderes.
    assert kanonform(_h("Ah Kh"), _h("Qh Qd")) != kanonform(_h("Ah Kh"), _h("Qs Qd"))


def test_farbbeziehung_erkennt_die_geteilte_farbe():
    getrennt = farbbeziehung(_h("Ah Kh"), _h("Qs Js"))
    geteilt = farbbeziehung(_h("Ah Kh"), _h("Qh Jh"))
    assert "keine gemeinsame Farbe" in getrennt["de"]
    assert "no shared suit" in getrennt["en"]
    assert "gleiche Farbe" in geteilt["de"]
    assert "same suit" in geteilt["en"]


def test_farbbeziehung_ist_zweisprachig():
    """Der Name steht in der App. Fehlt eine Sprache, steht dort ein
    deutsches Wort auf einem englischen Bildschirm."""
    for a, b in (("Ah Kh", "Qs Js"), ("Ah Kh", "Qh Jh"), ("Ah Kd", "Qh Js")):
        n = farbbeziehung(_h(a), _h(b))
        assert set(n) == {"de", "en"}
        assert n["de"] and n["en"]


@pytest.mark.parametrize("a,b", [("AKs", "QJs"), ("AA", "KK")])
def test_ein_matchup_ist_in_sich_stimmig(a, b):
    e = rechne_matchup(a, b)
    assert abs(e["equity_a"] + e["equity_b"] - 1.0) < 1e-12
    assert e["niedrigste_equity_a"] <= e["equity_a"] <= e["hoechste_equity_a"]
    assert e["spanne_relevant"] == (e["spanne_pp"] > 1.0)
    for k in e["farbkonfigurationen"]:
        assert k["siege_a"] + k["siege_b"] + k["split"] == k["boards"]


def test_eine_hand_gegen_sich_selbst_ist_genau_ausgeglichen():
    """Symmetrie: Halten beide dieselbe Klasse, muss 50 % herauskommen. Das
    prüft die Gewichtung mit – die einzelnen Konfigurationen sind es nicht."""
    e = rechne_matchup("AKs", "AKs")
    assert abs(e["equity_a"] - 0.5) < 1e-9


# ---------------------------------------------------------------------------
# Die Sicherung darf keine Rechnung verlieren
# ---------------------------------------------------------------------------
#
# Diese Tests gibt es wegen eines echten Verlusts: `--sichern` hat die
# Laufdatei nach dem Übernehmen gelöscht, während der Lauf sie noch offen
# hatte. Unter Linux schreibt ein Prozess dann weiter in eine Datei, die
# niemand mehr findet — rund 120 gerechnete Handpaare waren weg.
#
# Geprüft wird deshalb nicht, dass die Sicherung „funktioniert", sondern die
# drei Eigenschaften, deren Fehlen den Verlust verursacht hat.

import json
import os

import b4_preflop_equity as b4


def _eintrag(a, b):
    return {"hand_a": a, "hand_b": b, "equity_a": 0.5, "equity_b": 0.5,
            "farbkonfigurationen": [], "spanne_pp": 0.0, "spanne_relevant": False}


def _stelle_um(tmp_path, monkeypatch):
    """Alle Pfade des Moduls in ein Wegwerfverzeichnis lenken."""
    monkeypatch.setattr(b4, "TEILDATEI", tmp_path / "matchups.jsonl")
    monkeypatch.setattr(b4, "LAUFVERZEICHNIS", tmp_path)
    monkeypatch.setattr(b4, "LOGDATEI", tmp_path / "lauf.log")


def test_sichern_laesst_die_datei_eines_lebenden_prozesses_stehen(tmp_path, monkeypatch):
    _stelle_um(tmp_path, monkeypatch)
    meine = tmp_path / f"matchups.live.{os.getpid()}.jsonl"
    meine.write_text(json.dumps(_eintrag("AA", "KK")) + "\n", encoding="utf-8")

    b4.sichere(still=True)

    # Der eigene Prozess lebt – also bleibt seine Datei, wo sie ist.
    assert meine.exists(), "Die Laufdatei eines lebenden Prozesses wurde gelöscht"
    gesichert = b4.alle_ergebnisse()
    assert ("AA", "KK") in gesichert


def test_sichern_uebernimmt_und_verliert_nichts(tmp_path, monkeypatch):
    _stelle_um(tmp_path, monkeypatch)
    (tmp_path / "matchups.jsonl").write_text(
        json.dumps(_eintrag("AA", "AA")) + "\n", encoding="utf-8")
    meine = tmp_path / f"matchups.live.{os.getpid()}.jsonl"
    meine.write_text(json.dumps(_eintrag("AA", "KK")) + "\n", encoding="utf-8")

    b4.sichere(still=True)

    zeilen = (tmp_path / "matchups.jsonl").read_text(encoding="utf-8").splitlines()
    paare = {tuple(json.loads(z)[k] for k in ("hand_a", "hand_b")) for z in zeilen}
    assert paare == {("AA", "AA"), ("AA", "KK")}


def test_sichern_raeumt_die_datei_eines_toten_prozesses_weg(tmp_path, monkeypatch):
    _stelle_um(tmp_path, monkeypatch)
    # Eine Prozessnummer, die es sicher nicht gibt: Nach dem Ende des
    # Kindprozesses ist sie frei, und os.kill(pid, 0) findet sie nicht mehr.
    tot = os.fork()
    if tot == 0:
        os._exit(0)
    os.waitpid(tot, 0)

    verwaist = tmp_path / f"matchups.live.{tot}.jsonl"
    verwaist.write_text(json.dumps(_eintrag("QQ", "JJ")) + "\n", encoding="utf-8")

    b4.sichere(still=True)

    assert not verwaist.exists(), "Verwaiste Laufdatei blieb liegen"
    # Der Inhalt ist trotzdem übernommen worden.
    assert ("QQ", "JJ") in b4.alle_ergebnisse()


def test_sichern_schreibt_atomar(tmp_path, monkeypatch):
    """Bricht das Schreiben ab, bleibt der alte Stand vollständig stehen.

    Die alte Fassung öffnete die gesicherte Datei mit "w" und schnitt sie
    damit ab, bevor sie den neuen Inhalt schrieb. Ein Abbruch in dieser
    Sekunde hätte alles gelöscht, was je gerechnet wurde.
    """
    _stelle_um(tmp_path, monkeypatch)
    ziel = tmp_path / "matchups.jsonl"
    alt = json.dumps(_eintrag("AA", "AA")) + "\n"
    ziel.write_text(alt, encoding="utf-8")

    def platzt(*_a, **_k):
        raise OSError("Platte voll")

    monkeypatch.setattr(b4.os, "replace", platzt)
    with pytest.raises(OSError):
        b4.sichere(still=True)

    assert ziel.read_text(encoding="utf-8") == alt, "Der gesicherte Stand wurde beschädigt"


# ---------------------------------------------------------------------------
# W-002 — die dokumentierte Zahl wird nachgezählt
# ---------------------------------------------------------------------------
#
# Der Kopfkommentar von b4_preflop_equity.py nennt die Zahl der wirklich
# verschiedenen Rechnungen. Sie stand dort über Monate falsch: 47 008 statt
# 47 086. Gerechnet wurde immer richtig — nur die Beschreibung war es nicht,
# und niemandem fiel es auf, weil keine Prüfung sie anfasste.
#
# Genau dagegen ist dieses Projekt gebaut. Also wird sie ab jetzt gezählt.

import json
import re
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
QUELLTEXT = WURZEL / "src" / "b4_preflop_equity.py"
AUSGABE = WURZEL / "output" / "b4_preflop_equity.json"

#: Konkrete Paarungen zweier Hände aus einem Deck: C(52,2) · C(50,2) / 2.
#: Ausgerechnet statt hingeschrieben – sonst wäre das die nächste Zahl,
#: die niemand prüft.
KOMBO_PAARUNGEN = (52 * 51 // 2) * (50 * 49 // 2) // 2


def _dokumentierte_zahl() -> int:
    text = QUELLTEXT.read_text(encoding="utf-8")
    # „bleiben **47 086** wirklich verschiedene Rechnungen übrig"
    treffer = re.search(r"bleiben\s+\*\*([\d\s ]+)\*\*\s+wirklich verschiedene", text)
    assert treffer, "Der Kopfkommentar nennt keine Zahl verschiedener Rechnungen mehr"
    return int(re.sub(r"\D", "", treffer.group(1)))


def _dokumentierter_faktor() -> float:
    text = QUELLTEXT.read_text(encoding="utf-8")
    treffer = re.search(r"Faktor\s+(\d+,\d+)", text)
    assert treffer, "Der Kopfkommentar nennt keinen Faktor mehr"
    return float(treffer.group(1).replace(",", "."))


@pytest.mark.skipif(not AUSGABE.exists(), reason="B4 ist noch nicht durchgerechnet")
def test_die_dokumentierte_zahl_stimmt_mit_der_ausgabe():
    """Die Zahl im Kommentar gegen die tatsächlich gerechneten Konfigurationen."""
    daten = json.loads(AUSGABE.read_text(encoding="utf-8"))
    gezaehlt = sum(len(m["farbkonfigurationen"]) for m in daten["matchups"])
    assert gezaehlt == _dokumentierte_zahl(), (
        f"Der Kopfkommentar nennt {_dokumentierte_zahl()}, gerechnet wurden "
        f"{gezaehlt} Farbkonfigurationen."
    )


@pytest.mark.skipif(not AUSGABE.exists(), reason="B4 ist noch nicht durchgerechnet")
def test_der_dokumentierte_faktor_folgt_aus_der_zahl():
    """Der Faktor ist keine eigene Behauptung, sondern eine Division."""
    gezaehlt = _dokumentierte_zahl()
    assert round(KOMBO_PAARUNGEN / gezaehlt, 2) == _dokumentierter_faktor()


@pytest.mark.skipif(not AUSGABE.exists(), reason="B4 ist noch nicht durchgerechnet")
def test_die_ausgabe_kennt_jedes_handpaar_genau_einmal():
    daten = json.loads(AUSGABE.read_text(encoding="utf-8"))
    paare = {(m["hand_a"], m["hand_b"]) for m in daten["matchups"]}
    assert len(paare) == len(daten["matchups"]) == 169 * 170 // 2


@pytest.mark.parametrize("a,b", [
    ("AA", "AA"), ("32o", "32s"), ("AKs", "QJs"), ("72o", "72o"), ("KK", "AKo"),
])
def test_die_zahl_der_konfigurationen_kommt_aus_dem_code(a, b):
    """Stichprobe: Was in der Datei steht, rechnet der Code auch nach.

    Die vollständige Gegenrechnung über alle 14 365 Handpaare dauert rund eine
    halbe Minute — zu lang für jeden Lauf, zu wertvoll, um sie ganz zu lassen.
    Fünf Paare decken die Fälle ab, die sich unterscheiden: gleiche Klasse,
    gleicher Rang mit verschiedenen Farbbildern, suited gegen suited, offsuit
    gegen sich selbst, Paar gegen Nicht-Paar.
    """
    aus_code = len(farbkonfigurationen(a, b))
    if not AUSGABE.exists():
        assert aus_code > 0
        return
    daten = json.loads(AUSGABE.read_text(encoding="utf-8"))
    eintrag = next(m for m in daten["matchups"]
                   if {m["hand_a"], m["hand_b"]} == {a, b})
    assert len(eintrag["farbkonfigurationen"]) == aus_code


@pytest.mark.skipif(not AUSGABE.exists(), reason="B4 ist noch nicht durchgerechnet")
def test_die_78_fehlenden_sind_die_gleichrangigen_paarungen():
    """Der Grund für die alte Abweichung, als bleibender Nachweis.

    47 086 − 47 008 = 78 = C(13,2). Das sind genau die Handpaare aus derselben
    Rangkombination, einmal offsuit gegen einmal suited: 32o gegen 32s und so
    weiter. Jedes davon hat genau eine Farbkonfiguration.
    """
    daten = json.loads(AUSGABE.read_text(encoding="utf-8"))
    gleichrangig = [
        m for m in daten["matchups"]
        if m["hand_a"][:2] == m["hand_b"][:2]
        and m["hand_a"] != m["hand_b"]
        and len(m["hand_a"]) == 3 and len(m["hand_b"]) == 3
    ]
    assert len(gleichrangig) == 13 * 12 // 2 == 78
    for m in gleichrangig:
        assert len(m["farbkonfigurationen"]) == 1, (
            f"{m['hand_a']} gegen {m['hand_b']} hat "
            f"{len(m['farbkonfigurationen'])} Konfigurationen, erwartet 1"
        )


# ---------------------------------------------------------------------------
# W-001 — die Restzeitschätzung
# ---------------------------------------------------------------------------

from datetime import timedelta

from b4_preflop_equity import restschaetzung


def test_restzeit_rechnet_die_gemessene_geschwindigkeit_hoch():
    """Eine Stunde für ein Fünftel heißt: vier Stunden für den Rest."""
    assert restschaetzung(3600, 1000, 5000) == timedelta(hours=4)


def test_restzeit_ist_null_wenn_nichts_mehr_offen_ist():
    assert restschaetzung(1234, 5000, 5000) == timedelta(0)


def test_restzeit_wird_nie_negativ():
    """Mehr erledigt als offen gemeldet — kann bei einem Neustart vorkommen."""
    assert restschaetzung(1234, 6000, 5000) == timedelta(0)


def test_restzeit_ohne_messpunkt_behauptet_nichts():
    """Vor dem ersten fertigen Handpaar gibt es keine Grundlage.

    Null zu melden ist ehrlicher als eine Hochrechnung aus einem Messwert,
    den es nicht gibt — und eine Division durch null wäre ein Absturz mitten
    im Start.
    """
    assert restschaetzung(0, 0, 5000) == timedelta(0)
    assert restschaetzung(60, 0, 5000) == timedelta(0)


def test_die_schaetzung_nennt_ihre_grundlage_im_quelltext():
    """Die eigentliche Frage aus C4 war: worauf beruht die Zahl?

    Sie ließ sich damals nur beantworten, indem man den Ausdruck mitten in
    der Schleife las. Jetzt steht die Grundlage in der Funktion und im
    Startprotokoll des Laufs.
    """
    text = QUELLTEXT.read_text(encoding="utf-8")
    assert "Grundlage der Restzeitschätzung" in text
    assert restschaetzung.__doc__ and "Grundlage" in restschaetzung.__doc__
