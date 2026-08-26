# STATUS · Poker-Mathematik

Eigenständiges Arbeitspaket. Branch `feature/poker-math`.

Diese Datei ist so geschrieben, dass eine frische Sitzung ohne Kontext hier
weiterarbeiten kann.

- **Letzte Aktualisierung:** 2026-08-26
- **Stand in einem Satz:** Der Unterbau steht und ist bewiesen — der Evaluator
  ist gewählt und über **alle** 2 598 960 Fünfkartenblätter als regelkonform
  nachgewiesen. Die Rechenblöcke B1 bis B7 sind noch offen.

---

## Die harte Regel dieses Ordners

**Keine Zahl, die in der App erscheint, stammt aus einem Gedächtnis oder aus
einer Webquelle.** Alles wird gerechnet. Was nicht rechenbar ist, steht in
`OPEN.md` statt im Code.

Was davon ausgenommen ist, sind Definitionen — 52 Karten, 13 Ränge, die
Rangfolge der Kategorien, das Ass als Eins in A-2-3-4-5. Das sind die Regeln
des Spiels, keine Ergebnisse. Die Liste steht vollständig in `OPEN.md`.

---

## Fertig

| Einheit | Was | Nachweis |
|---|---|---|
| Aufbau | venv, vier Kandidaten installiert, Versionen in `requirements.txt` festgenagelt | — |
| Referenz | `src/referenz_evaluator.py` — ein zweiter Evaluator, direkt aus den Regeln | 39 Tests, 5 Mutationen geprüft |
| Auswahl | **eval7 0.1.11** gewählt (E-012) | `output/evaluator_auswahl.json` |
| Nachweis | Alle vier Bibliotheken über **alle** 2 598 960 Blätter gegen die Regeln gehalten | alle vier stimmen überein, 7 462 Stärkeklassen |

### Was der Nachweis wert ist

Er ist **vollständig**, keine Stichprobe: Wenn eine der Bibliotheken sich
irgendwo anders verhielte als die Spielregeln, hätte der Lauf es gefunden.
Geprüft wurde nicht der Zahlenwert (jede Bibliothek nummeriert anders),
sondern die Ordnung: gleiche Blätter gleich stark, stärkere Blätter höher.

**Alle vier sind korrekt.** Die Wahl entschied deshalb nicht über Korrektheit,
sondern über Geschwindigkeit — und ist damit auch leicht rückgängig zu machen:
Ein Wechsel würde keine einzige Zahl ändern.

---

## Exakt nächster Schritt

**B1 — Outs und Verbesserungswahrscheinlichkeit.** Vollständig exakt
rechenbar, kein Monte Carlo nötig:

Für jede Outs-Zahl von 1 bis 21 die Wahrscheinlichkeit, dass mindestens ein
Out erscheint — auf dem Turn, auf dem River, und auf mindestens einer der
beiden Straßen. Dazu die Abweichung der 2/4-Faustregel vom exakten Wert in
Prozentpunkten.

Vorgehen: Nach dem Flop sind 47 Karten unbekannt, nach dem Turn 46. Beides
wird durch Abzählen der Kartenmengen bestimmt, nicht durch Einsetzen in eine
erinnerte Formel. Ausgabe nach `output/b1_outs.json` mit dem in
`POKER_MATH.md` beschriebenen Metadatenblock.

Danach in dieser Reihenfolge: **B2** (Pot Odds, leitet aus B1 ab), **B3**
(Kombinatorik und Blocker), dann die rechenintensiven **B4** und **B5**,
zuletzt **B6** und **B7**.

### Was bei B4 zu bedenken ist, bevor es losgeht

169 gegen 169 heißt bei exakter Auswertung Größenordnungen von 10¹⁰
Blattbewertungen — bei gemessenen 837 000 Bewertungen pro Sekunde also
Stunden bis Tage. Zwei Auswege stehen zur Wahl, beide sind zu prüfen:

1. **Repräsentanten mit Gewichten:** Nicht jede Farbverteilung einzeln
   rechnen, sondern je Handpaar die wenigen wirklich verschiedenen
   Farbmuster mit ihrer Häufigkeit gewichten. Bleibt exakt.
2. **Monte Carlo mit Kreuzvalidierung**, wie in `POKER_MATH.md` beschrieben.

Weg 1 ist vorzuziehen, solange er rechenbar bleibt — er liefert die Zahl statt
einer Schätzung.

---

## Dateien

| Datei | Inhalt |
|---|---|
| `POKER_MATH.md` | Was gerechnet wird, mit welcher Methode, wo die Grenzen liegen. Als Erklärtext für die App verwendbar |
| `OPEN.md` | Jede Stelle, an der eine Zahl nicht gerechnet werden konnte. Derzeit leer |
| `src/karten.py` | Kartendarstellung, Starthand-Klassen |
| `src/referenz_evaluator.py` | Der Evaluator aus den Regeln — bleibt dauerhaft |
| `src/pruefe_evaluatoren.py` | Der vollständige Nachweislauf, ~40 s |
| `tests/bekannte_werte.json` | **Leer, von Lorenz zu füllen.** Gegenprobe aus einer Quelle, der er vertraut |
| `output/evaluator_auswahl.json` | Messwerte und Befund der Auswahl |
| `requirements.txt` | Festgenagelte Versionen |

---

## Wie man hier weiterarbeitet

```bash
cd tools/poker-math
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHONPATH=src .venv/bin/python -m pytest tests -q          # ~3 s
PYTHONPATH=src .venv/bin/python src/pruefe_evaluatoren.py   # ~40 s, schreibt den Bericht
```

---

## Bekannte Risiken

1. **`tests/bekannte_werte.json` ist leer.** Bis Lorenz sie füllt, gibt es
   keine externe Gegenprobe — nur die interne Konsistenz und den
   Regel-Evaluator. Das ist stark, aber es ist dieselbe Denkweise zweimal.
   Der zugehörige Test meldet sich als übersprungen, nicht als bestanden.
2. **eval7 ist eine C-Erweiterung.** Auf einer Plattform ohne fertiges Rad
   muss übersetzt werden. Betrifft nur diesen Generator, nicht die App — die
   liest ausschließlich die JSON-Dateien.
3. **Der schnelle Testlauf zählt nicht alles durch.** Er nutzt zwei
   verkleinerte Decks vollständig plus eine Stichprobe aus dem ganzen Deck.
   Der vollständige Nachweis steckt in `pruefe_evaluatoren.py` und gehört vor
   jede Veröffentlichung einmal ausgeführt.
