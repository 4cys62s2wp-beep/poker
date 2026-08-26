# Designfundament

Diese Datei ist keine Sammlung von Vorlieben. Jede Regel steht hier mit dem
Grund, aus dem sie gilt — und der Grund wiegt schwerer als die Regel: Wer
einen neuen Bildschirm baut, trifft Fälle, die hier nicht stehen, und muss
sie aus dem Grund ableiten können.

Die Werte leben an **einer** Stelle: im `:root`-Block von
`src/styles/global.css`, Abschnitt „Designfundament". Der Test
`src/lib/__tests__/design.test.ts` liest sie von dort und misst nach.

---

## 1. Schriftgrößen — fünf Stufen, benannt nach Verwendung

| Stufe | Token | Wert |
|-------|-------|------|
| Ergebnis | `--fs-ergebnis` | `clamp(64px, 20vw, 116px)` |
| Überschrift | `--fs-ueberschrift` | `clamp(19px, 2.4vw, 23px)` |
| Fließtext | `--fs-fliesstext` | `15px` |
| Beschriftung | `--fs-beschriftung` | `13.2px` |
| Kleingedrucktes | `--fs-kleingedrucktes` | `11.5px` |

**Warum nach Verwendung benannt und nicht nach Auszeichnungsebene.** Eine
Stufe, die `--fs-h2` heißt, wird genommen, weil sie gerade passt. Eine Stufe,
die `--fs-ueberschrift` heißt, wird genommen, weil es eine Überschrift ist.
Der Unterschied klingt klein und entscheidet nach zwanzig Bildschirmen
darüber, ob die App aussieht wie ein System oder wie eine Sammlung.

**Warum fünf und nicht sieben.** Sieben Stufen sind mehr, als ein Mensch
beim Bauen auseinanderhält; ab der vierten wird geraten. Fünf reichen für
jeden Bildschirm dieser App.

**Warum „Ergebnis" so viel größer ist.** Das Verhältnis zu „Fließtext" liegt
zwischen 4,3 und 7,7 — je nach Bildschirmbreite. Das ist Absicht: Die
Prozentzahl ist der Grund, warum jemand die App geöffnet hat. Alles andere
ist Beiwerk und darf so aussehen. Ein Test hält fest, dass das Verhältnis
mindestens 4 beträgt; darunter sähe es nach einer Überschrift aus und nicht
nach einem Ergebnis.

**Fett, nie dünn.** Ein dünner Schnitt wirkt in dieser Größe auf einem Handy
bei Sonnenlicht wie ein Wasserzeichen. Der ältere Token `--fs-stat` ist
bewusst leicht gesetzt und deshalb **nicht** die Ergebnisstufe.

**Ziffern in gleicher Breite** (`--ziffern: tabular-nums`). Ohne das springt
eine hochzählende Anzeige bei jedem Wechsel, weil die 1 schmaler ist als die
8. Am Tisch, wo der Timer läuft, ist das der Unterschied zwischen ruhig und
zappelig.

**Altbestand.** `--fs-h2`, `--fs-body`, `--fs-small` und `--fs-tiny` zeigen
auf die neuen Stufen — den Wert gibt es also nur einmal. `--fs-stat`,
`--fs-h1` und `--fs-h3` haben keine Entsprechung und werden abgebaut; die
Sperrklinke (Abschnitt 5) zählt ihre Verwendungen und lässt die Zahl nicht
wachsen.

---

## 2. Farben

**Dunkler Grund als Standard.** Die App wird abends benutzt, oft am Tisch mit
gedämpftem Licht. Ein heller Bildschirm in dieser Lage blendet die
Mitspieler.

### Kontrast, gerechnet statt behauptet

| Wofür | Mindestens | Warum |
|-------|------------|-------|
| Ergebniszahlen | **7 zu 1** | Sie werden mit dem Handy flach auf der Tischplatte gelesen, mit Licht von der Seite. Die Norm verlangt für großen Text weniger — aber „groß" hilft nicht gegen Spiegelungen. |
| Alles Übrige | **4,5 zu 1** | WCAG AA für normalen Text. |

Nachgemessen in `design.test.ts` gegen **beide** Gründe (`--bg` und
`--bg-card`). Eine Farbe, die auf der Seite gut aussieht und in der Karte
nicht mehr, fällt sonst niemandem auf.

Beim Aufstellen dieser Regel sind zwei bestehende Farben durchgefallen:

- `--felt-light` (#2f7f5e), der bisherige Live-Akzent: **3,92 zu 1** — als
  Text unzulässig.
- `--danger` (#e05c55) als Ergebniszahl: **5,29 zu 1** — für kleine
  Zustandsanzeigen in Ordnung, für die große Zahl nicht.

Deshalb gibt es jetzt eigene Töne für Ergebniszahlen:
`--ergebnis-gut` (#6ec97d, 9,36) und `--ergebnis-schlecht` (#f29b95, 8,98).
`--ok` und `--danger` bleiben den kleinen Zustandsanzeigen vorbehalten.

### Genau eine Akzentfarbe

`--akzent` (#4fbf8e), reserviert für den **Live-Bereich**. Sonst neutrale
Grautöne.

**Warum eine.** Wenn jede Ecke der App ihre eigene Farbe hat, heißt Farbe
nichts mehr. Ein Akzent, der nur an einer Stelle vorkommt, sagt: *hier*.

**Warum ausgerechnet der Live-Bereich.** Er ist der einzige, der unter
Zeitdruck geöffnet wird. Farbe ist schneller zu finden als Text.

**Stand der Umsetzung, ehrlich.** Die Regel gilt ab sofort für neu gebaute
Bildschirme. Der Bestand trägt noch vier Bereichsfarben (Gold für Lernen,
Blau für Werkzeuge, Violett für Freunde, Grün für Live). Sie über 37
Bildschirme in einer Nacht auszutauschen hieße, einen Unterschied zu
erzeugen, den niemand mehr prüfen kann. Der Umbau steht in `BACKLOG.md`;
begründet in `ENTSCHEIDUNGEN.md`, E-025.

### Zustände nicht nur an der Farbe

Erfolg und Fehler unterscheiden sich **zusätzlich** durch Form oder Zeichen —
ein Haken, ein Kreuz, eine Umrandung. Bei schlechtem Licht und für
farbfehlsichtige Nutzer ist die Farbe allein keine Auskunft. Rund jeder
zwölfte Mann sieht Rot und Grün nicht zuverlässig auseinander; genau die
beiden Farben, mit denen man „richtig" und „falsch" gern anzeigt.

---

## 3. Berührflächen

| Regel | Token | Wert |
|-------|-------|------|
| Kleinste Tippfläche | `--tipp-min` | `44px` |
| Abstand zwischen zwei Zielen | `--tipp-abstand` | `8px` |
| Freier Streifen am unteren Rand | `--gestenstreifen` | `24px` |

**44 Punkt** ist die kleinste Fläche, die ein Daumen zuverlässig trifft
(Apple HIG). Kleiner heißt nicht „schwerer zu treffen", sondern „wird
danebengetippt", und danebengetippt heißt am Tisch: falsche Zahl.

**8 Punkt Abstand**, damit zwei Ziele nicht als eines wirken. Ohne Abstand
trifft der Daumen die Grenze, und welches der beiden Ziele reagiert, ist
Zufall.

**Bedienelemente im unteren Drittel.** Wer einhändig hält, erreicht mit dem
Daumen etwa die untere Hälfte. Alles darüber verlangt Umgreifen — am Tisch
mit Karten in der anderen Hand also gar nicht.

**Die untersten 24 Punkt bleiben frei.** Dort liegen die Systemgesten. Ein
Knopf, der mit dem Wischen zum Startbildschirm konkurriert, verliert immer.

---

## 4. Rückmeldung

**Jede bestätigte Eingabe stößt kurz an** (`src/lib/design/haptik.ts`,
`bestaetigt()`). Am Tisch ist es laut, und man schaut nicht hin. Wer eine
Zahl einträgt, während er Chips schiebt, bekommt vom Bildschirm nichts mit —
der Stoß in der Hand ist die einzige Rückmeldung, die ankommt.

Zwölf Millisekunden fühlen sich wie ein Tastendruck an. Alles darüber fühlt
sich wie eine Fehlermeldung an, und das ist es nicht. Ein grundsätzlicher
Wechsel — Blindstufe, Rundenende — bekommt zwei Stöße (`umschlag()`), damit
er sich unterscheidet.

Wer „Bewegung reduzieren" eingestellt hat, bekommt keine. Und eine
fehlgeschlagene Vibration darf **nie** eine Eingabe scheitern lassen — manche
Browser werfen, statt `false` zurückzugeben.

**Zwischen Eingabe und Ergebnis liegt keine Wartezeit und keine Animation.**
Gerechnet wird sofort. Eine Animation an dieser Stelle verkauft Rechenzeit,
die es nicht gibt, und kostet den Blick, der auf der Zahl liegen sollte.

---

## 5. Umsetzung: eine Stelle, eine Sperrklinke

Die Werte stehen in `src/styles/global.css`. Ein Bildschirm, der eine Zahl
selbst hinschreibt, hebelt das aus — und es passiert ständig, weil
`marginBottom: 18` schneller getippt ist als der Token.

`npm run streuung` zählt solche Stellen und schreibt den Stand nach
`src/lib/design/streuung-basis.json`. Der Test vergleicht dagegen und schlägt
an, sobald

- eine Datei **mehr** Werte enthält als festgehalten,
- eine **neue** Datei mit Werten dazukommt,
- oder der Gesamtstand wächst.

**Warum eine Sperrklinke und kein Verbot.** Ein Test, der sofort alle 966
bestehenden Stellen anmahnt, wäre am ersten Tag rot und am zweiten
abgeschaltet. Einer, der die heutige Zahl festhält, bleibt grün und lässt den
Bestand trotzdem nur in eine Richtung laufen.

**Stand am 2026-08-26:** 966 Stellen in 48 Dateien. Wer aufräumt, ruft
`npm run streuung` auf und schreibt die kleinere Zahl fest.

Neu gebaute Bildschirme verwenden **ausschließlich** Tokens. Dafür gibt es
keine Sperrklinke, sondern eine Regel: Eine neue Datei mit verstreuten Werten
lässt der Test gar nicht erst zu.

---

## 6. Erreichbarkeit wird am gerenderten Ergebnis geprüft

**Die Regel.** Ob ein Bildschirm erreichbar ist, wird im laufenden Browser
bei schmaler Gerätebreite geprüft — nicht am Quelltext.

**Warum das keine Formalie ist.** Ein Prüflauf über den Quelltext hat elf
Sackgassen und sieben unerreichbare Ziele **nicht** gefunden, weil die Links
alle da waren. Sie standen in der Seitenleiste, und die ist unter 920 Pixel
ausgeblendet. Auf dem Handy — dem Gerät, für das diese App gebaut ist —
existierten sie nicht.

**Was daraus folgt.** Ein `<Link>` im Quelltext ist kein Beweis für
Erreichbarkeit. Der Beweis ist ein Klick im gerenderten Bildschirm bei
390 Pixel Breite. Die Wegeliste in Abschnitt 7 ist so entstanden und wird so
geprüft.

---

## 7. Wege und Tiefen

Gemessen am **gerenderten** Ergebnis bei 390 Pixel Breite mit
`npm run wege`. Ergebnis in `docs/wege.json`, Stand 2026-08-26T20:01:29Z.

**41 eigene Bildschirme**, größte Tiefe **2**, **null Sackgassen**, **null unerreichbare Adressen**.

### Tiefe 0 — die Startseite

`/`

### Tiefe 1 — eine Berührung

`/lernen` · `/nachschlagen` · `/profil` · `/session`

Vier statt drei: `/profil` hängt an der unteren Navigation und ist
damit von überall eine Berührung entfernt. Das ist Absicht — wer
seinen Namen ändern will, sucht ihn nicht unter einem der drei
Einstiege.

### Tiefe 2 — zwei Berührungen

**Lernen** — `/lernen/drill` · `/lernen/m1` · `/lernen/m2` · `/lernen/m3` · `/lernen/m4` · `/lernen/m5` · `/lernen/m6` · `/lernen/m7` · `/lernen/m8` · `/lernen/m9` · `/lernen/pros` · `/lernen/statistik` · `/lernen/tagesquiz` · `/lernen/trainer/equity` · `/lernen/trainer/handranking` · `/lernen/trainer/outs` · `/lernen/trainer/potodds` · `/lernen/trainer/preflop` · `/lernen/trainer/pushfold` · `/lernen/trainer/szenario` · `/lernen/uebungstisch` · `/lernen/wiederholen`

**Nachschlagen** — `/nachschlagen/coach` · `/nachschlagen/equity` · `/nachschlagen/glossar` · `/nachschlagen/haende` · `/nachschlagen/odds` · `/nachschlagen/ranges` · `/nachschlagen/tells`

**Live-Session** — `/session/auszahlung` · `/session/bankroll` · `/session/chips` · `/session/tisch` · `/session/tisch/online`

**Übriges** — `/freunde` · `/rechtliches`

### Was nicht mitzählt

**Lektionen** (`/lernen/m3/m3-l2` und so weiter) sind Inhalt des
Modulbildschirms, kein eigener Bildschirm — so wie ein Glossareintrag Inhalt
des Glossars ist. Zählte man sie mit, lägen 49 Adressen bei Tiefe drei, und
die Zahl sagte nichts mehr über die Navigation aus, sondern nur noch darüber,
wie viele Lektionen es gibt.

**Absichtlich nicht verlinkt** sind `/pro` (erscheint nur, solange die
Monetarisierung läuft — sie läuft nicht) und `/kuendigen` (wird aus der
Zahlungsverwaltung heraus geöffnet). Beides steht mit Begründung im
Prüfskript.

### Was sich dafür geändert hat

Zwei Bildschirme lagen bei drei Berührungen, und beide aus demselben Grund:
Vor ihnen lag ein Menü.

- Die **sieben Trainer** standen hinter `/lernen/trainer` — einem
  Bildschirm, dessen einziger Zweck ein Menü war. Sie stehen jetzt samt ihrer
  Trefferquote auf der Lernseite; die alte Adresse leitet dorthin um.
- Der **Online-Tisch** stand hinter dem Ein-Gerät-Tisch. Er steht jetzt
  daneben.

Die elf Sackgassen aus der früheren Prüfung sind bereits behoben — der Lauf
findet keine mehr. Was er stattdessen fand, war die Tiefe.
