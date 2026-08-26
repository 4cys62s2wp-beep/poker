# Poker-Mathematik

Jede Zahl, die die App anzeigt, wird hier berechnet. Keine stammt aus einem
Gedächtnis, keine aus einer Webseite. Was nicht rechenbar ist, steht in
`OPEN.md` statt im Code.

Dieser Text ist so geschrieben, dass er sich in der App als Erklärtext
weiterverwenden lässt.

---

## Warum das so streng gehandhabt wird

**Begründung** (eine Aussage über das Vorgehen, nicht über Daten): Eine
Lern-App, die falsche Zahlen zeigt, bringt Menschen etwas bei, das nicht
stimmt — und sie merken es nie. Über die Verbreitung falscher Zahlen im Netz
lässt sich hier nichts belegen, das wäre eine Behauptung über die Welt. Was
sich belegen lässt, steht weiter unten: Dieselbe Frage liefert unter zwei
verschiedenen, jeweils vertretbaren Annahmen verschiedene Zahlen. Wer eine
davon abschreibt, ohne die Annahme zu kennen, weiß nicht, was er hat.

Der Ausweg ist deshalb nicht die bessere Quelle, sondern die eigene Rechnung.

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
Karten**. Am Ende einer Hold'em-Hand gelten sie nicht: Dort wählt man das
beste Fünfkartenblatt aus sieben.

Wie stark sich die Verteilung dadurch verschiebt, ist hier **ungeprüft** — die
Rechnung über alle Siebenkartenblätter steht als V2-3 in `OPEN.md` und wurde
noch nicht ausgeführt. Bis dahin gilt: Diese Tabelle beantwortet die Frage
nach fünf zufälligen Karten und keine andere.

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

Das stimmt nicht in jedem Fall. Drei Gegenbeispiele, alle **nachgerechnet**
und in `output/b1_outs.json` hinterlegt; der Rechenlauf bricht ab, wenn eines
davon nicht mehr trägt. Für jedes ist geprüft, dass die Karte Heros Blatt
verbessert **und** dass Hero danach trotzdem verliert:

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

Zum Vergleich stehen in `b1_outs.json` beide Zählweisen nebeneinander:

*Zwei Überkarten haben 6 Outs. Zählt man Paare mit, die nur auf dem Board
liegen, sind es 15.*

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

> **Begründung** zur Form dieses Abschnitts. **Zu den Sätzen:** Jeder kursiv gesetzte Satz ist
> **erzeugt**, nicht geschrieben — er entsteht im Rechenskript aus den
> berechneten Werten und steht mit seinem Beleg in der jeweiligen
> Ausgabedatei. Ein Test prüft, dass er hier **wörtlich** so steht. Wer ihn
> umformuliert, ohne die Rechnung zu ändern, bricht den Testlauf.
>
> Der Anlass für diese Regelung: Hier stand einmal „bis acht Outs untertreibt
> die Regel, ab neun übertreibt sie". Beides war falsch, der Wechsel liegt
> zwischen sechs und sieben. Der Satz war plausibel, passte zum Eindruck aus
> der Tabelle — und kein Test hätte ihn gefunden, weil Tests bis dahin nur
> Zahlen prüften, nicht Sätze.

### Die 2/4-Regel

| Outs | exakt (beide Straßen) | Regel | Abweichung |
|---:|---:|---:|---:|
| 4 | 16,47 % | 16 % | −0,47 pp |
| 6 | 24,14 % | 24 % | −0,14 pp |
| 7 | 27,84 % | 28 % | +0,16 pp |
| 9 | 34,97 % | 36 % | +1,03 pp |
| 12 | 44,96 % | 48 % | +3,04 pp |
| 15 | 54,12 % | 60 % | +5,88 pp |
| 21 | 69,94 % | 84 % | +14,06 pp |

*Bis 6 Outs verspricht die 2/4-Regel zu wenig, ab 7 Outs zu viel.*

*Ab 9 Outs liegt die Regel um mehr als einen Prozentpunkt daneben.*

*Ab dem Umschlagpunkt wächst der Fehler von Outs-Zahl zu Outs-Zahl ohne
Ausnahme: ja.*

*Am weitesten daneben liegt sie bei 21 Outs: 69,94 % tatsächlich gegen 84 %
nach der Regel, also 14,06 pp zu viel.*

**Begründung**, warum das eine Lerneinheit ist und keine Fußnote: Für einen
Flushdraw ist die Regel eine brauchbare Kopfrechnung. Für die großen Draws
lässt sie Calls richtig aussehen, die es nicht sind — und zwar in der
Richtung, die Geld kostet.

### Die zwei Lesarten von „River"

*Die beiden Lesarten von „River" unterscheiden sich um bis zu 0,97 pp, am
stärksten bei 21 Outs.*

**Begründung**, warum beide in der Ausgabe stehen: Sie beantworten
verschiedene Fragen. Wer nach dem Turn erneut zahlen muss, braucht
`river_nach_fehlschlag` (Nenner: die nach dem Turn unbekannten Karten). Wer
wissen will, wie oft die Riverkarte überhaupt hilft, braucht
`river_unbedingt` (Nenner: die nach dem Flop unbekannten). Wer eine davon
abschreibt, ohne zu wissen welche, irrt um genau den Betrag oben.

### Was als Out zählt

*Zwei Überkarten haben 6 Outs. Zählt man Paare mit, die nur auf dem Board
liegen, sind es 15.*

Die Definition dahinter steht oben im Abschnitt „Saubere Outs": Die Karte muss
die Kategorie anheben **und** eine eigene Karte muss die neue Kategorie
mitbilden.

### Die Gefahr hängt am Board, nicht an der Hand

*Ob ein Out dem Gegner die höhere Straße geben kann, hängt am Board: Auf
9c 8s 2h Th schlagen 28 von 1035 Gegner-Kombos Heros Straße, auf 7c 6s 2h 5s
sind es 0.*

Beide Male hält Hero eine vollendete Straße. Auf dem einen Board liefert das
Board selbst drei Straßenkarten, sodass dem Gegner ein einzelner Bube reicht;
auf dem anderen kann niemand eine höhere Straße halten. Ausgezählt über alle
Gegner-Kombos, ohne jede Annahme über die Spielweise.

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

*Beim halben Pot liegt die Schwelle bei genau 25 %, beim vollen Pot bei
33,33 %.*

*Über alle 8 Einsatzgrößen steigt die nötige Equity durchgehend: ja. Die Zahl
der nötigen Outs steigt mit: ja.*

*Selbst der größte Einsatz dieser Tabelle verlangt nur 40,00 %. Die Schwelle
erreicht nie 50 %, weil der Gegner denselben Betrag hineinlegt.*

Gerechnet mit Brüchen: Ein Drittel Pot ist ein Drittel, nicht 0,3333.

### Kombinatorik

*Ein Paar hat 6 Kombos, eine suited Hand 4, eine offsuit Hand 12 – zusammen 16
je Rangpaar.*

*Die 169 Klassen decken genau die 1326 Zweikartenblätter ab – lückenlos und
ohne Überschneidung.*

*Eine einzige bekannte Karte lässt von den 6 Kombos eines Paares zwischen 3
und 6 übrig – je nachdem, ob sie die Hand berührt.*

*Am Board Qh 7c 2d mit Ah Kh in der Hand bleiben von 1326 Kombos noch 1081.
Am stärksten trifft es AKo: 12 Kombos werden zu 6.*

Die vollständige Blocker-Verteilung über alle möglichen Mengen bekannter
Karten steht in `b3_kombinatorik.json` — mit bestem Fall, schlimmstem Fall und
Mittelwert je Anzahl bekannter Karten.
