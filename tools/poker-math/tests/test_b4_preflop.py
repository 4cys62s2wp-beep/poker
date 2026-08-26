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
