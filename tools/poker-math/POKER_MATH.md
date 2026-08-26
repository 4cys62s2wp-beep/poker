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

## Die Annahmen — sie gehören zur Zahl

Eine Wahrscheinlichkeit ohne ihre Annahmen ist nicht falsch, sondern
**bedeutungslos**. Genau daraus entstehen die Tabellen im Netz, die einander
widersprechen: Sie rechnen verschiedene Fragen und nennen beide „die
Wahrscheinlichkeit".

Deshalb steht der folgende Block **in jeder einzelnen Ausgabedatei**, erzeugt
aus einer gemeinsamen Quelle (`src/metadaten.py`), damit er nicht
auseinanderdriften kann.

### Heldensicht

Bekannt sind **ausschließlich die eigenen zwei Karten und das sichtbare
Board**. Über die Karten der Gegner wird nichts angenommen. Alle übrigen
Karten gelten als unbekannt und verbleiben im Deck:

| Zeitpunkt | unbekannte Karten |
|---|---:|
| nach dem Flop | 47 |
| nach dem Turn | 46 |

Diese beiden Zahlen stehen nirgends im Quelltext. Sie ergeben sich aus 52
minus zwei eigenen Karten minus den sichtbaren Boardkarten.

**Warum diese Sicht:** Sie ist die einzige, die ein Spieler am Tisch
tatsächlich einnehmen kann. Es wird also *nicht* herausgerechnet, dass ein
Teil der unbekannten Karten längst als Gegnerhand ausgeteilt ist. Rechnungen,
die das tun, liefern leicht andere Zahlen — beide sind richtig, aber sie
beantworten verschiedene Fragen.

### Geteilte Pötte

Ein Split zählt in **jeder** Equity-Rechnung als 0,5 für jede Seite.

---

## Saubere Outs — die Vereinfachung, die B1 macht

B1 rechnet mit **sauberen Outs**: der Annahme, dass jedes Out die eigene Hand
tatsächlich zur besten macht.

Das stimmt oft, aber nicht immer — und wo es nicht stimmt, ist der Fehler
teuer. Drei Fälle, alle **nachgerechnet** und in `output/b1_outs.json`
hinterlegt; der Rechenlauf bricht ab, wenn einer davon nicht mehr trägt:

**1. Das Out gibt dem Gegner den Flush.**
Hero hält 9♦8♦, der Flop ist 7♣6♣2♥. Die Fünf ist ein sauber gezähltes
Straßen-Out. Kommt aber die 5♣, liegen drei Kreuz auf dem Board — wer zwei
Kreuz hält, hat den Flush und schlägt Heros Straße.

**2. Das Out gibt dem Gegner die höhere Straße.**
Hero hält 7♦6♦, der Flop ist 9♣8♠2♥. Die Zehn vollendet Heros Straße von der
Zehn abwärts. Weil das Board selbst drei Straßenkarten liefert, reicht dem
Gegner ein einzelner Bube für die Straße bis zum Buben. Das ist die
**dominierte Straße**, der teuerste Fall dieser Art.

Bemerkenswert daran: Bei einem Flop wie 7-6-2 kann *niemand* eine höhere
Straße halten. Ob dieser Fehler überhaupt möglich ist, hängt am Board — nicht
an der Hand. Diese Unterscheidung ist selbst ein Lerninhalt.

**3. Das Out paart das Board und füllt das Full House.**
Hero hält A♥K♥, der Flop ist Q♥7♥7♣. Die 2♥ vollendet den Nut-Flush — und
paart zugleich die Zwei, sodass ein Gegner mit 7-2 das Full House hat.

**Nicht modelliert in Version 1.** Ein Out als „vielleicht nicht sauber" zu
kennzeichnen, setzt ein Modell der Gegnerhand voraus, und das ist eine
Strategiefrage, keine Rechnung. Vermerkt als Kandidat für V2 in `OPEN.md`.

### Was in B1 als Out zählt — und was nicht

Für die acht durchgerechneten Zugbilder gilt eine scharfe Definition, weil
sonst jede Zahl herauskommt, die man haben will:

| gilt als Out | gilt **nicht** als Out |
|---|---|
| Die Karte hebt die Kategorie des eigenen Blattes | Ein besserer Kicker |
| **und** eine eigene Karte bildet die neue Kategorie mit | Ein Paar, das nur auf dem Board liegt |

Der zweite Ausschluss ist der wichtige. Hero hält A-K, der Flop ist 9-7-2, es
kommt eine weitere Neun: Heros bestes Blatt ist jetzt ein Paar Neunen — die
Kategorie ist gestiegen, getroffen hat er trotzdem nichts. Das Paar liegt auf
dem Board und gehört jedem am Tisch.

Zum Vergleich stehen in `b1_outs.json` beide Zählweisen nebeneinander. Der
Unterschied ist erheblich: „zwei Überkarten" hat sechs Outs, wenn man richtig
zählt, und fünfzehn, wenn man Boardtreffer mitzählt.

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
| B1 | Outs und Verbesserungswahrscheinlichkeit, Fehler der 2/4-Regel | ✅ exakt, `b1_outs.json` |
| B2 | Pot Odds und die nötige Mindest-Equity | ✅ exakt, `b2_potodds.json` |
| B3 | Kombinatorik und Blocker | ✅ exakt, `b3_kombinatorik.json` |
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


---

## Was B1 bis B3 ergeben haben

### Die 2/4-Regel wird mit wachsender Outs-Zahl unbrauchbar

Die Regel lautet: Outs mal zwei für eine Karte, Outs mal vier für zwei
Karten. Ihr Fehler ist **gerechnet**, nicht geschätzt:

| Outs | exakt (beide Straßen) | Regel | Fehler |
|---:|---:|---:|---:|
| 4 | 16,47 % | 16 % | −0,47 pp |
| 8 | 31,45 % | 32 % | +0,55 pp |
| 9 | 34,97 % | 36 % | +1,03 pp |
| 12 | 44,96 % | 48 % | +3,04 pp |
| 15 | 54,12 % | 60 % | +5,88 pp |
| 21 | 69,94 % | 84 % | +14,06 pp |

Bei wenigen Outs **untertreibt** die Regel leicht, ab neun Outs übertreibt
sie um mehr als einen Prozentpunkt, und der Fehler wächst danach ununterbrochen.

Das ist der eigentliche Lerninhalt: Die Regel ist für den Flushdraw brauchbar
und für die großen Draws gefährlich — sie lässt Calls richtig aussehen, die
es nicht sind.

### Pot Odds

| Einsatz | nötige Equity | Pot Odds | Outs (beide Straßen) |
|---|---:|---:|---:|
| ¼ Pot | 16,67 % | 5,00 zu 1 | 5 |
| ⅓ Pot | 20,00 % | 4,00 zu 1 | 5 |
| ½ Pot | 25,00 % | 3,00 zu 1 | 7 |
| ⅔ Pot | 28,57 % | 2,50 zu 1 | 8 |
| ¾ Pot | 30,00 % | 2,33 zu 1 | 8 |
| Pot | 33,33 % | 2,00 zu 1 | 9 |
| 1,5× Pot | 37,50 % | 1,67 zu 1 | 10 |
| 2× Pot | 40,00 % | 1,50 zu 1 | 11 |

Gerechnet mit Brüchen: Ein Drittel Pot ist ein Drittel, nicht 0,3333.

Eine Schranke fällt dabei heraus, die man selten liest: **Egal wie groß der
Einsatz ist, nötig sind nie 50 % Equity.** Der Gegner legt ja dasselbe hinein.
Ein Einsatz vom Doppelten des Pots verlangt 40 %.

### Kombinatorik

Alle Zahlen gezählt, keine hingeschrieben:

| | Kombos |
|---|---:|
| Paar | 6 |
| suited | 4 |
| offsuit | 12 |
| suited + offsuit zusammen | 16 |

169 Starthand-Klassen, 1326 Zweikartenblätter. Klassen mal Kombos ergibt
genau 1326 — sonst wäre die Einteilung lückenhaft oder überlappend.

**Blocker:** Wie viele Kombos eine bekannte Karte wegnimmt, ist keine feste
Zahl. Sie hängt davon ab, ob die Karte die Hand berührt. In
`b3_kombinatorik.json` steht deshalb die vollständige Verteilung über alle
möglichen Mengen bekannter Karten, mit bestem Fall, schlimmstem Fall und
Mittelwert.

Der einprägsamste Einzelwert: Wer selbst ein Ass hält, lässt von den sechs
Ass-Paaren des Gegners nur noch drei zu — die Hälfte.
