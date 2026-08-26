# Offen

Hier steht jede Stelle, an der ich versucht war, eine Zahl hinzuschreiben
statt sie zu berechnen — und was stattdessen zu tun ist.

**Die Regel:** Keine Zahl, die in der App erscheint, darf aus meinem Gedächtnis
oder aus einer Webquelle stammen. Wenn eine Größe nicht rechenbar ist, kommt
sie hierher statt in den Code.

---

## Offen: nichts, was ich nicht rechnen konnte

Stand nach B1, B2 und B3. Jede ausgelieferte Zahl ist berechnet. Es gibt
keinen Wert, den ich mangels Rechenweg hinschreiben musste.

---

## Kandidaten für Version 2

Das sind keine offenen Zahlen, sondern bewusst nicht modellierte
Zusammenhänge. Sie stehen hier, damit sie nicht vergessen werden.

### V2-1 · Unsaubere Outs

**Was fehlt:** B1 nimmt an, jedes Out mache die eigene Hand zur besten. Drei
nachgerechnete Gegenbeispiele stehen in POKER_MATH.md und in
`output/b1_outs.json`: Das Out gibt dem Gegner den Flush, die höhere Straße,
oder es füllt sein Full House.

**Warum nicht in V1:** Ein Out als „vielleicht nicht sauber" zu kennzeichnen,
setzt ein Modell der Gegnerhand voraus. Das ist eine Strategiefrage, keine
Rechnung — und Strategie ist aus V1 ausdrücklich ausgeschlossen.

**Was rechenbar wäre, ohne Strategie zu unterstellen:** Für ein gegebenes
Board ließe sich auszählen, *wie viele* der verbleibenden Gegner-Kombos ein
bestimmtes Out schlagen würde. Das ist reine Kombinatorik und käme ohne jede
Annahme über die Spielweise aus. Es beantwortet nicht „wie oft verliere ich",
aber „wie gefährlich ist dieses Board" — und das ist ehrlich abgrenzbar.

### V2-2 · Implizite Odds jenseits von B6

B2 gibt die Untergrenze für einen Call an, der sich sofort rechnet. B6 rechnet
aus, wie viel man später gewinnen muss, damit sich ein Set-Mining-Call lohnt.
Der allgemeine Fall — beliebiger Draw, beliebige Stackgröße — bräuchte eine
Annahme darüber, wie viel der Gegner nach dem Treffer noch zahlt. Das ist
Verhalten, keine Rechnung.

### V2-3 · Verteilung am Ende einer Hold'em-Hand

POKER_MATH.md weist die Häufigkeit der neun Kategorien unter **fünf zufälligen
Karten** aus. Für eine Hold'em-Hand gilt sie nicht: Dort wählt man das beste
Fünfkartenblatt aus sieben, und die Verteilung verschiebt sich deutlich nach
oben. Beides ist exakt rechenbar – der Aufwand ist `math.comb(52, 7)` Blätter,
also gut fünfzigmal so viele wie bei fünf Karten. Bisher nicht Teil des
Auftrags.

**Anmerkung zum Vorgehen:** Hier stand zuerst die ausgerechnete Zahl, von mir
hingeschrieben statt gerechnet. Sie war zufällig richtig – aber das ist Glück,
keine Methode, und genau der Fehler, den dieser Ordner verhindern soll. Jetzt
steht der Rechenweg da.

---

## Was hier NICHT hingehört

Zahlen, die keine berechneten Größen sind, sondern Definitionen. Sie stehen
im Code, und das ist richtig so:

| Zahl | Warum sie keine Rechnung braucht |
|---|---|
| 52 Karten, 13 Ränge, 4 Farben | Die Definition eines Blattes |
| Rangfolge der Kategorien | Die Regel des Spiels |
| Ass zählt in A-2-3-4-5 als Eins | Die Regel des Spiels |
| 5 Karten bilden ein Blatt | Die Regel des Spiels |

Alles andere — Häufigkeiten, Wahrscheinlichkeiten, Equities, Kombinationszahlen
— wird gerechnet. Auch dort, wo ich den Wert zu kennen glaube.

**Probe aufs Exempel:** Dass es 2 598 960 Fünfkartenblätter und 7 462
Stärkeklassen gibt, steht nirgends im Code. Beides fällt aus der Rechnung
heraus und wird im Bericht ausgewiesen.
