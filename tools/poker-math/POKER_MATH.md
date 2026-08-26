# Poker-Mathematik

Jede Zahl, die die App anzeigt, wird hier berechnet. Keine stammt aus einem
Gedächtnis, keine aus einer Webseite. Was nicht rechenbar ist, steht in
`OPEN.md` statt im Code.

Dieser Text ist so geschrieben, dass er sich in der App als Erklärtext
weiterverwenden lässt.

---

## Warum das so streng gehandhabt wird

Eine Lern-App, die falsche Zahlen zeigt, ist schlimmer als keine: Sie bringt
Menschen etwas bei, das nicht stimmt, und sie merken es nie. Poker-Zahlen
werden im Netz seit Jahrzehnten voneinander abgeschrieben, oft gerundet, oft
mit stillschweigend geänderten Annahmen. Eine Zahl, die überall steht, ist
deshalb noch lange nicht geprüft.

Der Ausweg ist nicht die bessere Quelle, sondern die eigene Rechnung.

---

## Der Unterbau

### Die Bewertung eines Blattes

Verwendet wird **eval7 0.1.11** (MIT). Die Wahl und ihre Begründung stehen in
`ENTSCHEIDUNGEN.md`, E-012.

Wichtiger als die Wahl ist der Nachweis: Es gibt in `src/referenz_evaluator.py`
einen zweiten, unabhängig geschriebenen Evaluator, der **direkt aus den
Spielregeln** stammt — bewusst langsam und stumpf, damit er offensichtlich
richtig ist. Über **alle 2 598 960** möglichen Fünfkartenblätter wurde
geprüft, dass beide dieselbe Reihenfolge erzeugen und dieselben Blätter für
gleich stark halten.

Das ist kein Stichprobenargument: Der Raum ist vollständig abgesucht. Wenn
eine Bibliothek sich irgendwo anders verhielte, hätte der Lauf es gefunden.

Dasselbe wurde für `phevaluator`, `treys` und `pokerkit` gemacht. **Alle vier
stimmen überein.** Die Wahl entschied deshalb nicht über Korrektheit, sondern
über Geschwindigkeit.

### Was dabei ganz nebenbei herauskommt

Es gibt **7 462** unterscheidbare Blattstärken. Zwei Blätter, die in dieselbe
Klasse fallen, teilen sich am Showdown den Pot.

Die Verteilung der Kategorien über alle Fünfkartenblätter — **gezählt**, nicht
nachgeschlagen:

| Kategorie | Anzahl | Anteil |
|---|---:|---:|
| Straight Flush | 40 | 0,00154 % |
| Vierling | 624 | 0,02401 % |
| Full House | 3 744 | 0,14406 % |
| Flush | 5 108 | 0,19654 % |
| Straße | 10 200 | 0,39246 % |
| Drilling | 54 912 | 2,11285 % |
| Zwei Paare | 123 552 | 4,75390 % |
| Ein Paar | 1 098 240 | 42,25690 % |
| High Card | 1 302 540 | 50,11774 % |
| **Summe** | **2 598 960** | **100 %** |

**Achtung bei der Deutung:** Das sind die Häufigkeiten unter **zufälligen fünf
Karten**, nicht die Häufigkeiten am Ende einer Hold'em-Hand. Dort wählt man
das beste Fünfkartenblatt aus sieben, und die Verteilung verschiebt sich
deutlich nach oben. Genau solche stillschweigenden Annahmenwechsel sind der
Grund, warum kursierende Tabellen oft nicht zusammenpassen.

---

## Methodik

### Exakt, wo es geht

Wo der Raum abzählbar klein ist, wird **vollständig durchgezählt**. Das
Ergebnis ist dann keine Schätzung, sondern die Zahl.

### Monte Carlo nur, wo nötig

Wo vollständiges Durchzählen zu teuer ist, wird zufällig gezogen — aber unter
drei Auflagen:

1. **Fester Seed.** Derselbe Lauf liefert Bit für Bit dasselbe Ergebnis.
2. **Ausgewiesene Unsicherheit.** Jede Zahl trägt ihr 95-%-Konfidenzintervall
   mit sich. Die Iterationszahl wird so gewählt, dass die Halbbreite unter
   0,1 Prozentpunkten liegt.
3. **Kreuzvalidierung.** Für mindestens einen kleinen Teilfall wird derselbe
   Wert zusätzlich exakt durchgezählt. Weicht die Schätzung weiter ab, als das
   Konfidenzintervall zulässt, **bricht der Lauf mit Fehler ab** statt eine
   Zahl auszuliefern.

Der dritte Punkt ist der wichtigste. Ein Monte-Carlo-Lauf, der still ein
falsches Ergebnis liefert, sieht genauso aus wie einer, der stimmt.

---

## Was berechnet wird

| Block | Inhalt | Stand |
|---|---|---|
| B1 | Outs und Verbesserungswahrscheinlichkeit, Fehler der 2/4-Regel | offen |
| B2 | Pot Odds und die nötige Mindest-Equity | offen |
| B3 | Kombinatorik und Blocker | offen |
| B4 | Preflop-Equity, alle 169 gegen alle 169 | offen |
| B5 | Multiway-Equity gegen 2 bis 5 Gegner | offen |
| B6 | Set Mining und die nötigen impliziten Odds | offen |
| B7 | Flop-Texturen, rein auszählend | offen |

Bewusst **nicht** enthalten: Strategieempfehlungen, Ranges, GTO, ICM. Das sind
Fragen der Spielweise, keine Rechnungen — und wer sie mit derselben Autorität
präsentiert wie eine Wahrscheinlichkeit, täuscht Genauigkeit vor.

---

## Ausgabeformat

Ein JSON je Block unter `output/`. Jede Datei trägt einen Metadatenblock:
Schema-Version, Methode (exakt oder Monte Carlo), bei Monte Carlo Iterationen,
Seed und Konfidenzintervall je Wert, verwendete Bibliothek samt Version,
Zeitstempel und Laufzeit.

**Die App rechnet nichts zur Laufzeit.** Sie liest nur diese Dateien.

---

## Reproduzieren

```bash
cd tools/poker-math
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHONPATH=src .venv/bin/python src/pruefe_evaluatoren.py   # ~40 s
PYTHONPATH=src .venv/bin/python -m pytest tests -q
```

Der Nachweislauf schreibt `output/evaluator_auswahl.json`. Bis auf Zeitstempel
und Laufzeit ist die Datei bei jedem Lauf identisch.
