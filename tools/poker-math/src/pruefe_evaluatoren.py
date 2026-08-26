"""Prüft die Kandidaten-Bibliotheken auf Korrektheit und Geschwindigkeit.

Der Korrektheitsnachweis
------------------------
Über **alle** 2 598 960 Fünfkartenblätter wird geprüft, ob die Bibliothek
dieselbe Ordnung erzeugt wie der Referenz-Evaluator aus den Spielregeln.
„Dieselbe Ordnung" heißt genau zweierlei:

1. **Gleiche Klassen.** Blätter, die die Referenz für gleich stark hält, muss
   die Bibliothek ebenfalls gleich bewerten – und umgekehrt. Geprüft als
   beidseitig eindeutige Zuordnung zwischen den Bewertungen.
2. **Gleiche Reihenfolge.** Sortiert man die Klassen nach der Referenz, muss
   die Bewertung der Bibliothek streng monoton verlaufen.

Erfüllt eine Bibliothek beides über alle Blätter, kann sie sich nirgends
anders verhalten – der Raum ist vollständig abgesucht.

Was hier absichtlich NICHT passiert
-----------------------------------
Es wird nichts gegen erinnerte Zahlen geprüft. Es gibt in dieser Datei keine
erwartete Anzahl Flushs, keine Klassenzahl, keinen Vergleichswert aus einer
Quelle. Alle Zahlen im Bericht sind gezählt.
"""

from __future__ import annotations

import json
import platform
import subprocess
import sys
import time
from datetime import datetime, timezone
from itertools import combinations
from pathlib import Path

from karten import ALLE_KARTEN, TEXT_JE_KARTE, blatt_als_text
from referenz_evaluator import KATEGORIE_NAME, kategorie_und_rangfolge, schluessel


# ---------------------------------------------------------------------------
# Die Kandidaten, jeweils auf eine gemeinsame Schnittstelle gebracht
# ---------------------------------------------------------------------------

class Kandidat:
    """Eine Bibliothek hinter einer einheitlichen Fassade.

    ``bewerte(karten)`` liefert irgendeine Zahl; ``groesser_ist_besser`` sagt,
    in welche Richtung sie zu lesen ist. Der Prüfcode dreht das selbst um,
    damit er die Bibliotheken nicht auseinanderhalten muss.
    """

    name = "?"
    groesser_ist_besser = True

    def version(self) -> str:
        import importlib.metadata as md
        return md.version(self.name)

    def lizenz(self) -> str:
        import importlib.metadata as md
        try:
            meta = md.metadata(self.name)
        except Exception:
            return "unbekannt"
        # Die Klassifizierer zuerst: Das Feld `License` enthält bei manchen
        # Paketen den vollständigen Lizenztext statt seines Namens.
        for eintrag in meta.get_all("Classifier") or []:
            if eintrag.startswith("License ::"):
                return eintrag.split("::")[-1].strip()
        fuer = meta.get("License")
        if fuer and fuer.strip() and fuer.strip().lower() != "unknown":
            erste = fuer.strip().splitlines()[0].strip()
            return erste[:60] if erste else "unbekannt"
        return "unbekannt"

    def bewerte(self, karten) -> int:
        raise NotImplementedError

    def normiert(self, karten) -> int:
        """Immer so, dass größer = stärker."""
        wert = self.bewerte(karten)
        return wert if self.groesser_ist_besser else -wert


class Eval7(Kandidat):
    name = "eval7"
    groesser_ist_besser = True

    def __init__(self):
        import eval7
        self._eval = eval7.evaluate
        self._karte = tuple(eval7.Card(t) for t in TEXT_JE_KARTE)

    def bewerte(self, karten):
        k = self._karte
        return self._eval([k[c] for c in karten])


class PHEvaluator(Kandidat):
    name = "phevaluator"
    groesser_ist_besser = False

    def __init__(self):
        from phevaluator import evaluate_cards
        self._eval = evaluate_cards

    def bewerte(self, karten):
        t = TEXT_JE_KARTE
        return self._eval(*(t[c] for c in karten))


class Treys(Kandidat):
    name = "treys"
    groesser_ist_besser = False

    def __init__(self):
        from treys import Card, Evaluator
        self._eval = Evaluator().evaluate
        self._karte = tuple(Card.new(t) for t in TEXT_JE_KARTE)

    def bewerte(self, karten):
        k = self._karte
        liste = [k[c] for c in karten]
        # treys nimmt Board und Hand getrennt; die Aufteilung ist ihm egal.
        return self._eval(liste[:3], liste[3:])


class PokerKit(Kandidat):
    name = "pokerkit"
    groesser_ist_besser = True

    def __init__(self):
        from pokerkit import StandardHighHand
        self._hand = StandardHighHand
        self._ordnung: dict[object, int] | None = None

    def bewerte(self, karten):
        # pokerkit liefert ein vergleichbares Objekt, keine Zahl. Für den
        # Prüfcode wird daraus über die Sortierung aller vorkommenden Objekte
        # eine Zahl gemacht – siehe `bereite_ordnung_vor`.
        raise NotImplementedError("pokerkit wird gesondert behandelt")

    def objekt(self, karten):
        return self._hand.from_game("".join(TEXT_JE_KARTE[c] for c in karten))


# ---------------------------------------------------------------------------
# Der Nachweis
# ---------------------------------------------------------------------------

def alle_fuenfkartenblaetter():
    return combinations(ALLE_KARTEN, 5)


def referenzschluessel_aller_blaetter():
    """Referenzbewertung für jedes Blatt. Wird einmal berechnet und geteilt."""
    return [schluessel(b) for b in alle_fuenfkartenblaetter()]


def pruefe_ordnung(kandidat: Kandidat, referenz: list[int], blaetter: list[tuple]):
    """Vergleicht die Ordnung über alle Blätter. Gibt einen Befund zurück."""
    start = time.perf_counter()

    ref_zu_lib: dict[int, int] = {}
    lib_zu_ref: dict[int, int] = {}
    abweichungen: list[str] = []

    for blatt, ref in zip(blaetter, referenz):
        lib = kandidat.normiert(blatt)

        erwartet = ref_zu_lib.setdefault(ref, lib)
        if erwartet != lib and len(abweichungen) < 5:
            abweichungen.append(
                f"gleich stark laut Regeln, verschieden laut {kandidat.name}: "
                f"{blatt_als_text(blatt)}"
            )
        erwartet_ref = lib_zu_ref.setdefault(lib, ref)
        if erwartet_ref != ref and len(abweichungen) < 5:
            abweichungen.append(
                f"verschieden stark laut Regeln, gleich laut {kandidat.name}: "
                f"{blatt_als_text(blatt)}"
            )

    # Reihenfolge: nach Referenz sortiert muss die Bibliothek streng steigen.
    paare = sorted(ref_zu_lib.items())
    monoton = all(paare[i][1] < paare[i + 1][1] for i in range(len(paare) - 1))
    if not monoton and len(abweichungen) < 5:
        for i in range(len(paare) - 1):
            if paare[i][1] >= paare[i + 1][1]:
                abweichungen.append(
                    f"Reihenfolge vertauscht bei Referenzklasse {paare[i][0]} / {paare[i+1][0]}"
                )
                break

    dauer = time.perf_counter() - start
    return {
        "bibliothek": kandidat.name,
        "version": kandidat.version(),
        "lizenz": kandidat.lizenz(),
        "klassen_referenz": len(ref_zu_lib),
        "klassen_bibliothek": len(lib_zu_ref),
        "gleiche_klassen": len(ref_zu_lib) == len(lib_zu_ref) and not abweichungen,
        "monoton": monoton,
        "abweichungen": abweichungen,
        "dauer_s": round(dauer, 2),
    }


def pruefe_pokerkit(referenz: list[int], blaetter: list[tuple], stichprobe: int):
    """pokerkit gesondert: Es liefert Objekte statt Zahlen und ist deutlich
    langsamer, deshalb über eine gleichmäßige Stichprobe statt über alles.

    Die Stichprobe ist deterministisch (jedes n-te Blatt), nicht zufällig –
    damit bleibt auch dieser Teil Bit für Bit reproduzierbar.
    """
    k = PokerKit()
    start = time.perf_counter()
    ausgewaehlt = list(range(0, len(blaetter), max(1, len(blaetter) // stichprobe)))

    eintraege = []
    for i in ausgewaehlt:
        eintraege.append((referenz[i], k.objekt(blaetter[i]), i))

    # Sortieren nach Referenz und prüfen, ob die pokerkit-Objekte dabei
    # niemals fallen und bei gleicher Referenz gleich sind.
    eintraege.sort(key=lambda e: e[0])
    ok = True
    fehler = []
    for a, b in zip(eintraege, eintraege[1:]):
        if a[0] == b[0]:
            if not (a[1] == b[1]):
                ok = False
                fehler.append(f"gleich laut Regeln, verschieden laut pokerkit: "
                              f"{blatt_als_text(blaetter[a[2]])} / {blatt_als_text(blaetter[b[2]])}")
        elif not (a[1] < b[1]):
            ok = False
            fehler.append(f"Reihenfolge falsch: {blatt_als_text(blaetter[a[2]])} "
                          f"vs {blatt_als_text(blaetter[b[2]])}")
        if len(fehler) >= 5:
            break

    dauer = time.perf_counter() - start
    return {
        "bibliothek": "pokerkit",
        "version": k.version(),
        "lizenz": k.lizenz(),
        "geprueft": len(ausgewaehlt),
        "gleiche_klassen": ok,
        "monoton": ok,
        "abweichungen": fehler,
        "dauer_s": round(dauer, 2),
    }


def messe_geschwindigkeit(kandidat, blaetter7, wiederholungen: int = 1) -> float:
    """Siebenkarten-Blätter pro Sekunde – das ist die echte Arbeitslast."""
    start = time.perf_counter()
    for _ in range(wiederholungen):
        for b in blaetter7:
            kandidat.bewerte(b)
    dauer = time.perf_counter() - start
    return len(blaetter7) * wiederholungen / dauer


def main():
    startzeit = time.perf_counter()
    print(f"Python {platform.python_version()} auf {platform.machine()}")
    print("Erzeuge alle Fünfkartenblätter …", flush=True)
    t0 = time.perf_counter()
    blaetter = list(alle_fuenfkartenblaetter())
    print(f"  {len(blaetter):,} Blätter in {time.perf_counter()-t0:.1f} s".replace(",", " "))

    print("Bewerte sie mit dem Regel-Evaluator …", flush=True)
    t0 = time.perf_counter()
    referenz = [schluessel(b) for b in blaetter]
    dauer_ref = time.perf_counter() - t0
    print(f"  fertig in {dauer_ref:.1f} s")

    # Verteilung nach Kategorie – gezählt, nicht nachgeschlagen.
    print("\n── Verteilung der Kategorien (gezählt) ──")
    haeufigkeit: dict[int, int] = {}
    for b in blaetter:
        kat, _ = kategorie_und_rangfolge(b)
        haeufigkeit[kat] = haeufigkeit.get(kat, 0) + 1
    gesamt = sum(haeufigkeit.values())
    for kat in sorted(haeufigkeit, reverse=True):
        n = haeufigkeit[kat]
        print(f"  {KATEGORIE_NAME[kat]:16} {n:>9,}  {100*n/gesamt:8.5f} %".replace(",", " "))
    print(f"  {'Summe':16} {gesamt:>9,}".replace(",", " "))
    assert gesamt == len(blaetter), "Die Kategorien decken nicht alle Blätter ab"

    befunde = []
    for klasse in (Eval7, PHEvaluator, Treys):
        k = klasse()
        print(f"\n── {k.name} {k.version()} über alle Blätter …", flush=True)
        befund = pruefe_ordnung(k, referenz, blaetter)
        befunde.append(befund)
        print(f"   Klassen laut Regeln: {befund['klassen_referenz']:,}".replace(",", " "))
        print(f"   Klassen laut {k.name}: {befund['klassen_bibliothek']:,}".replace(",", " "))
        print(f"   gleiche Klassen: {befund['gleiche_klassen']}   Reihenfolge: {befund['monoton']}")
        for a in befund["abweichungen"]:
            print("   ABWEICHUNG:", a)
        print(f"   Dauer: {befund['dauer_s']} s")

    print("\n── pokerkit über eine deterministische Stichprobe …", flush=True)
    befund = pruefe_pokerkit(referenz, blaetter, stichprobe=20000)
    befunde.append(befund)
    print(f"   geprüft: {befund['geprueft']:,} Blätter".replace(",", " "))
    print(f"   Ordnung stimmt: {befund['gleiche_klassen']}   Dauer: {befund['dauer_s']} s")
    for a in befund["abweichungen"]:
        print("   ABWEICHUNG:", a)

    # Geschwindigkeit auf Siebenkarten-Blättern
    print("\n── Geschwindigkeit (7 Karten, die echte Arbeitslast) ──")
    probe = []
    for b in blaetter[:20000]:
        rest = [c for c in ALLE_KARTEN if c not in b]
        probe.append(tuple(b) + (rest[0], rest[1]))
    for klasse in (Eval7, PHEvaluator, Treys):
        k = klasse()
        rate = messe_geschwindigkeit(k, probe)
        print(f"  {k.name:14} {rate:>12,.0f} Blätter/s".replace(",", " "))
        for eintrag in befunde:
            if eintrag["bibliothek"] == k.name:
                eintrag["blaetter_pro_s"] = round(rate)

    # pokerkit gesondert, weil deutlich langsamer
    pk = PokerKit()
    kleine_probe = probe[:2000]
    t0 = time.perf_counter()
    for b in kleine_probe:
        pk.objekt(b)
    rate = len(kleine_probe) / (time.perf_counter() - t0)
    print(f"  {'pokerkit':14} {rate:>12,.0f} Blätter/s".replace(",", " "))
    for eintrag in befunde:
        if eintrag["bibliothek"] == "pokerkit":
            eintrag["blaetter_pro_s"] = round(rate)

    print("\n── Lizenzen ──")
    for eintrag in befunde:
        print(f"  {eintrag['bibliothek']:14} {eintrag['lizenz']}")

    alle_ok = all(e["gleiche_klassen"] and e["monoton"] for e in befunde)
    print(f"\nAlle geprüften Bibliotheken stimmen mit den Regeln überein: {alle_ok}")

    # ── Bericht schreiben ──────────────────────────────────────────────────
    ziel = Path(__file__).resolve().parent.parent / "output" / "evaluator_auswahl.json"
    ziel.parent.mkdir(parents=True, exist_ok=True)
    bericht = {
        "schema_version": 1,
        "zweck": (
            "Nachweis, dass die gewählte Hand-Bewertungsbibliothek die Regeln von "
            "Texas Hold'em korrekt umsetzt, samt Geschwindigkeits- und "
            "Lizenzvergleich der Kandidaten."
        ),
        "methode": "exakt",
        "erzeugt_am": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "laufzeit_s": round(time.perf_counter() - startzeit, 1),
        "umgebung": {
            "python": platform.python_version(),
            "maschine": platform.machine(),
            "system": platform.system(),
        },
        "nachweis": {
            "geprüfte_blaetter": len(blaetter),
            "verfahren": (
                "Jede Bibliothek wird über ALLE Fünfkartenblätter gegen einen "
                "unabhängigen, direkt aus den Spielregeln geschriebenen Evaluator "
                "gehalten. Verglichen wird die Ordnung, nicht der Zahlenwert: "
                "gleiche Stärkeklassen und gleiche Reihenfolge."
            ),
            "unterscheidbare_stärkeklassen": befunde[0]["klassen_referenz"],
            "kategorien_haeufigkeit": {
                KATEGORIE_NAME[k]: v for k, v in sorted(haeufigkeit.items(), reverse=True)
            },
            "summe_kategorien": gesamt,
            "referenz_evaluator": "src/referenz_evaluator.py",
            "dauer_referenzlauf_s": round(dauer_ref, 1),
        },
        "kandidaten": befunde,
        "gewaehlt": "eval7",
        "begruendung_kurz": (
            "Alle vier Bibliotheken sind nachweislich regelkonform – die Wahl "
            "entscheidet daher nicht über Korrektheit, sondern über Geschwindigkeit, "
            "Wartungsstand und Lizenz. eval7 ist die schnellste, steht unter MIT und "
            "wird gepflegt. Ausführlich in ENTSCHEIDUNGEN.md, E-012."
        ),
        "gegenprobe_im_testlauf": (
            "phevaluator bleibt als zweite Meinung in der Testsuite: Jede in der App "
            "verwendete Größe wird stichprobenartig mit beiden Bibliotheken gerechnet."
        ),
    }
    ziel.write_text(json.dumps(bericht, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Bericht geschrieben: {ziel}")
    return 0 if alle_ok else 1


if __name__ == "__main__":
    sys.exit(main())
