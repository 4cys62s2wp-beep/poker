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

### Regel 4.3 — Die Rückmeldung wird an einer Stelle ausgelöst

Ein Zuhörer an der Wurzel der App (`horcheAufBedienung` in `App.tsx`) stößt
die Rückmeldung bei jedem Klick auf eine Bedienfläche an. Kein Bildschirm
ruft sie selbst auf; ein Test prüft, dass keiner es tut.

**Begründung.** In jeden Bildschirm einzeln geschrieben, fehlt sie beim
nächsten neuen Knopf — und niemandem fällt es auf. Eine Regel, die sich nicht
selbst durchsetzt, gilt nach drei Monaten nur noch da, wo jemand daran
gedacht hat.

Was **nicht** als Bestätigung zählt: ein Link mitten im Fließtext (er führt
woandershin, er bestätigt nichts), das Tippen in ein Textfeld (das ist
Schreiben), und ein abgeschaltetes Element (dort passiert gerade nichts, und
eine Rückmeldung auf nichts ist eine Lüge über den Zustand).

Zwei Stöße im selben Griff werden zu einem: Fünfzig Millisekunden sind kürzer
als jeder bewusste zweite Tipp und länger als jede Kette aus einem Griff. Der
Umschlag (`umschlag`) wird nicht entprellt — er kommt aus dem Ablauf der Zeit
und nicht aus einem Finger.

**Was diese Regel nicht kann.** `navigator.vibrate` gibt es auf iOS nicht.
Auf einem iPhone bleibt die App stumm, und daran ändert kein Code etwas. Das
steht hier, damit niemand den fehlenden Stoß für einen Fehler hält.

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
`npm run wege`. Ergebnis in `docs/wege.json`, Stand 2026-08-27T08:03:15Z.

**41 eigene Bildschirme**, größte Tiefe **2**, **null Sackgassen**, **null unerreichbare Adressen**.

### Tiefe 0 — die Startseite

`/`

### Tiefe 1 — eine Berührung

`/lernen` · `/lernen/m1/m1-l1` · `/nachschlagen` · `/nachschlagen/coach` ·
`/nachschlagen/glossar` · `/nachschlagen/haende` · `/nachschlagen/odds` ·
`/profil` · `/session` · `/session/live/einrichten`

Zehn statt vier, und das ist der Ertrag von E-035: Die Karten auf der
Startseite tragen seither Inhalt statt zweier Textzeilen, und dieser Inhalt
ist zugleich der kurze Weg. Sechs Bildschirme sind dadurch eine Berührung
näher gerückt:

| Bildschirm | vorher | jetzt | wodurch |
|------------|--------|-------|---------|
| `/nachschlagen/glossar` | 2 | 1 | eines der vier Felder in der Karte „Nachschlagen" |
| `/nachschlagen/haende` | 2 | 1 | dito |
| `/nachschlagen/odds` | 2 | 1 | dito |
| `/nachschlagen/coach` | 2 | 1 | dito |
| `/session/live/einrichten` | 2 | 1 | der Knopf „Abend starten" in der großen Karte |
| `/lernen/m1/m1-l1` | 3 | 1 | der Knopf an der nächsten offenen Lektion |

`/profil` liegt weiterhin bei eins — nicht mehr über die untere Leiste, die
es seit E-032 nicht mehr gibt, sondern über das Personensymbol oben rechts.
Wer seinen Namen oder den Farbmodus ändern will, sucht das nicht unter einem
der drei Einstiege.

`/session/abende` ist von zwei auf zwei geblieben, hat aber einen zweiten Weg
bekommen: Der zuletzt gespielte Abend steht in der großen Karte und führt
direkt zu sich selbst.

### Tiefe 2 — zwei Berührungen

**Lernen** — `/lernen/drill` · `/lernen/m1` · `/lernen/m2` · `/lernen/m3` · `/lernen/m4` · `/lernen/m5` · `/lernen/m6` · `/lernen/m7` · `/lernen/m8` · `/lernen/m9` · `/lernen/pros` · `/lernen/statistik` · `/lernen/tagesquiz` · `/lernen/trainer/equity` · `/lernen/trainer/handranking` · `/lernen/trainer/outs` · `/lernen/trainer/potodds` · `/lernen/trainer/preflop` · `/lernen/trainer/pushfold` · `/lernen/trainer/szenario` · `/lernen/uebungstisch` · `/lernen/wiederholen`

**Nachschlagen** — `/nachschlagen/equity` · `/nachschlagen/ranges` · `/nachschlagen/tells`

**Live-Session** — `/session/abende` · `/session/auszahlung` · `/session/bankroll` · `/session/chips`

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

---

## 8. Das Tischgerät: drei Angaben, aus zwei Metern lesbar

Zwei Geräterollen, zwei verschiedene Aufgaben. Das **private Gerät** gehört
einer Person und liegt in ihrer Hand; das **Tischgerät** liegt in der Mitte,
alle sehen es, niemand hält es. Für das Tischgerät gelten deshalb eigene
Regeln.

### Regel 8.1 — Höchstens drei Angaben

Auf dem Tischgerät stehen die geltenden Blinds, die Restzeit der Stufe und
die kommenden Blinds. Sonst nichts.

**Begründung.** Der Bildschirm ist so groß, wie er ist. Jede vierte Angabe
nimmt den drei übrigen Platz weg, und Platz ist hier nicht Komfort, sondern
die eigentliche Leistung: Die Zahl muss aus zwei Metern lesbar sein, sonst
nimmt jemand das Gerät hoch — und in dem Moment ist es kein Tischgerät mehr,
sondern ein weiteres Handy in einer Hand.

Was dabei weggefallen ist und warum, steht in `ENTSCHEIDUNGEN.md`, E-027.

Die Grenze zählt **Angaben**, nicht Knöpfe. Ein Knopf steht unten und nimmt
den Zahlen keinen Platz; eine Angabe steht in der Mitte und tut es. Für die
Bedienung gilt trotzdem eine eigene Obergrenze: höchstens drei nebeneinander,
weil ein vierter bei 390 Pixern jeden auf unter eine Fingerbreite drückt.
Nachgemessen wird beides.

### Regel 8.2 — Die nötige Schriftgröße wird gerechnet, nicht geschätzt

Ein Zeichen ist bequem lesbar, wenn es unter einem Sehwinkel von rund 0,3°
erscheint. Daraus folgt für zwei Meter Abstand:

```
Zeichenhöhe   = 2000 mm × tan(0,3°)        ≈ 10,5 mm
Schriftgröße  = 10,5 mm ÷ 0,7              ≈ 15,0 mm   (Versalhöhe ≈ 70 %)
in CSS-Pixeln = 15,0 mm ÷ (25,4/96) mm     ≈ 56,5 px
```

**Begründung.** „Groß genug" ist keine prüfbare Angabe. 56,5 px ist eine.
Die Rechnung steht im Messskript, ihre Zwischenwerte in `docs/tisch.json`,
und der Test rechnet sie ein zweites Mal nach — sonst wird aus der
gerechneten Zahl über die Zeit wieder eine behauptete.

### Regel 8.3 — Alle drei Angaben liegen über dieser Grenze

Die Grenze ist eine Untergrenze, keine Rangfolge. Die Rangfolge machen
Größe, Farbe und Ort: die Restzeit weiß und am größten, die geltenden Blinds
im Akzent, die kommenden gedämpft.

**Begründung.** Wäre die dritte Angabe zu klein für zwei Meter, wäre sie in
Wahrheit keine Angabe des Tischgeräts, sondern eine, die man in die Hand
nehmen muss — also eine, die dort nicht hingehört.

Gemessen (`npm run tisch`):

| Angabe | Handy, 390 px | Tablet quer, 1024 px |
|--------|---------------|----------------------|
| Restzeit | 105,3 px | 220 px |
| Blinds jetzt | 74,1 px | 148 px |
| Blinds danach | 58,5 px | 96 px |
| **nötig** | **56,5 px** | **56,5 px** |

### Regel 8.4 — Gemessen wird im Browser, bei beiden Gerätebreiten

`npm run tisch` legt einen laufenden Abend in den Gerätespeicher, öffnet den
Tischbildschirm bei 390 px und bei 1024 px und schreibt jede sichtbare
Textzeile mit ihrer tatsächlichen Schriftgröße nach `docs/tisch.json`.

**Begründung.** Dieselbe wie in Abschnitt 6: Eine Schriftgröße aus `clamp()`
kennt man erst, wenn ein Browser sie ausgerechnet hat. Im Quelltext steht
`clamp(58px, 15vw, 96px)` — was daraus wird, entscheidet die Fensterbreite.

Mitgemessen und mitgeprüft werden außerdem: keine Navigationsleiste, kein
Überlauf in beide Richtungen, zwei Bedienknöpfe von mindestens 44 px im
unteren Drittel, und ein freier Streifen an der Unterkante für die
Systemgesten.

---

## 8a. Das private Gerät: Ergebnis groß, Weg dahin klein

Das private Gerät gehört einer Person und liegt in ihrer Hand. Für es gelten
zwei eigene Regeln, beide am gerenderten Ergebnis gemessen (`npm run
durchgang`):

**Regel 8a.1 — Vor der Antwort steht keine Ergebniszahl da.** Der größte
Text auf dem Aufgabenbildschirm ist der Name des Zugbilds (27 px), nicht
etwas, das nach einer Zahl aussieht. Wer schon vorher eine große Zahl sieht,
rät nicht mehr, sondern liest ab.

**Regel 8a.2 — Zwischen Eingabe und Ergebnis liegt nichts.** Gemessen: 40 ms
bis die Auflösung dasteht, `transition-duration: 0s`, keine Animation, und
die Knöpfe verschieben sich um **0 px**.

*Begründung.* Eine Animation auf einer Ergebniszahl ist eine Wartezeit mit
besserem Namen — beim ersten Mal hübsch, beim fünfzigsten im Weg. Und ein
Knopf, der sich beim Antworten verschiebt, ist schlimmer als jede Wartezeit:
Man tippt daneben und weiß nicht, warum.

Die Ergebniszahl selbst ist 78 px groß, das Fünffache des Fließtextes.

---

## 9. Kontrast und Tippflächen werden am gerenderten Ergebnis geprüft

Abschnitt 5 zählt verstreute Gestaltungswerte im Quelltext. Zwei Dinge kann
diese Zählung nicht sehen:

- Im Quelltext steht `color: var(--text-dim)`. Ob das lesbar ist, hängt
  davon ab, **worauf** es liegt — und das steht in einer anderen Datei, oft
  zwei Ebenen weiter oben, manchmal unter einem Verlauf.
- Im Quelltext steht `min-height: var(--tipp-min)`. Ob der Knopf am Ende 44
  Pixel hoch ist, entscheidet die Zeile, in der er steht.

`npm run pruefen` misst deshalb beides an der laufenden App, bei 390 Pixeln,
über alle Bildschirme aus `docs/wege.json`. Ergebnis in `docs/pruefung.json`,
festgehalten von `pruefung.test.ts`.

### Wie mit Verläufen umgegangen wird

Ein Verlauf hat keine Farbe, sondern viele. Statt ihn für „nicht messbar" zu
erklären, legt die Prüfung jeden seiner Farbstopps einzeln auf den Grund
darunter und nimmt **den ungünstigsten**. Das ist strenger als die
Wirklichkeit — wo genau ein Wort auf dem Verlauf sitzt, entscheidet der
Zeilenumbruch.

**Begründung.** Strenge ist hier die richtige Richtung: Ein Befund zu viel
kostet eine Prüfung, ein Befund zu wenig kostet Lesbarkeit. Und die erste
Fassung dieser Prüfung, die Verläufe für „nicht messbar" erklärte, lieferte
3512 nutzlose Meldungen und keinen einzigen brauchbaren Befund.

### Was sie beim ersten Lauf gefunden hat

| Stelle | Befund | Behoben durch |
|--------|--------|---------------|
| Zurück-Link (`a.pill`) auf 49 Bildschirmen | 110 × **29** px statt 44 | eigene Regel für `a.pill` und `button.pill` |
| Herz auf der Spielkarte, 38 Bildschirme | **4,07** statt 4,5 | `--suit-h` von `#c43e38` auf `#b43934` |
| Kreuz auf der Spielkarte, 11 Bildschirme | **3,94** statt 4,5 | `--suit-c` von `#2c7f42` auf `#28723b` |
| Untere Navigationsleiste, 49 Bildschirme | drei Ziele mit **0 px** Abstand statt 8 | `gap: var(--tipp-abstand)` (E-028) |

Beide Farben sind nur so weit abgedunkelt, bis die Grenze erreicht ist. Die
Farbe ist auf einer Spielkarte ohnehin nicht das Unterscheidungsmerkmal — das
ist das Zeichen selbst.

Seither: **null Befunde**. Hier steht ausdrücklich keine Sperrklinke: Ab null
ist jeder neue Befund eine Verschlechterung, und die soll auffallen, bevor
ein Nutzer sie bemerkt.

---

## 10. Es gibt keine untere Navigationsleiste

Die Startseite hat drei Karten, und die sind die Navigation. Eine zweite
Navigation daneben — eine Tableiste am unteren Rand — gibt es nicht, und sie
kommt auch nicht zurück.

**Begründung.** Sie führte zu denselben drei Zielen wie die Karten. Damit war
„Start" ein Bildschirm ohne eigenen Inhalt: Alles, was er anbot, bot die
Leiste auch, und zwar von überall. Ein Bildschirm, dessen einziger Zweck
darin besteht, Wege anzubieten, die es schon gibt, hat keinen Inhalt — und
genau daher kam die leere untere Bildschirmhälfte. Sie war kein
Layoutproblem.

Das Zweite, was daran hing: Die Leiste hielt sich 98 Pixel am unteren Rand
frei. Diese 98 Pixel waren der Leerraum, den man sah.

### Regel 10.1 — Die drei Karten füllen die Höhe

Keine festen Höhen. Zuerst steht der Inhalt jeder Karte, dann wird verteilt,
was übrig bleibt — im Verhältnis 1 zu 2,4 zwischen „Lernen" und
„Live-Session".

**„Nachschlagen" bekommt keinen Anteil.** Es hat vier Felder und eine
Überschrift, und damit ist es fertig: Ein Feld, das schon die Mindestgröße
hat, trifft man nicht besser, wenn es höher wird. Jeder Pixel darüber hinaus
fehlt unten im Daumenbereich.

**Der Bezugspunkt ist der Inhalt, nicht null.** Teilten die Anteile die
gesamte Höhe, landete die inhaltsreichste Karte an ihrer Mindesthöhe und die
ganze übrige Höhe flösse in eine einzige: gemessen 415 Pixel Karte für 274
Pixel Inhalt.

Nachgemessen mit `npm run durchgang` auf drei schmalen Geräten, im Zustand
nach einem gespielten Abend:

| Gerät | Nachschlagen | Lernen | Live-Session | unter der letzten Karte | Füllung |
|-------|--------------|--------|--------------|--------------------------|---------|
| 375 × 667 | 103 px | 222 px | **226 px** | 24 px | 1.00 / 1.00 / 0.93 |
| 390 × 844 | 103 px | 274 px | **351 px** | 24 px | 1.00 / 0.80 / 0.57 |
| 360 × 740 | 103 px | 243 px | **278 px** | 24 px | 1.00 / 0.92 / 0.73 |

Die letzte Spalte ist der Anteil der Innenfläche, den der Inhalt belegt
(Regel 10.5). Die Zahlen vor dem Gestenstreifen sind der Streifen aus
Abschnitt 3. Mehr steht dort nicht, und gescrollt wird auf keinem der drei
Geräte.

### Regel 10.2 — Die Live-Session liegt unten und ist am größten

**Begründung.** Sie wird unter Zeitdruck geöffnet, oft einhändig, während die
andere Hand Chips stapelt. Der Daumen erreicht die untere Bildschirmhälfte,
mehr nicht. Die anderen beiden werden in Ruhe geöffnet; wer gezielt
nachschlägt, findet auch ein kleines Ziel.

„Am größten" heißt: mindestens doppelt so hoch wie die kleinste Karte, und
höher als die mittlere. Beides wird auf allen drei Bezugsgeräten geprüft,
nicht nur auf einem — die Regel stand schon einmal auf dem Kopf, ohne dass
es auffiel: Als die Lernkarte Streak, Level und XP aufnahm, war sie auf dem
375 × 667 großen Gerät 235 Pixel hoch und die Live-Session darunter 209.

Die große Karte verteilt ihre übrige Höhe außerdem **zwischen** ihren
Gruppen, nicht um sie herum: Überschrift oben, der Knopf unten im
Daumenbereich. Zentriert lag der Knopf in der Kartenmitte und darunter stand
ein leerer Streifen — ausgerechnet dort, wo der Daumen hinkommt.

### Regel 10.3 — Der Weg zur Startseite hängt an der Marke

Ohne Leiste braucht jeder Bildschirm einen sichtbaren Rückweg. Den trägt die
Marke oben links: auf jedem Bildschirm dieselbe Stelle, 44 Pixel hoch. Der
Sackgassen-Lauf prüft es an jedem Bildschirm, nicht stichprobenartig.

### Regel 10.4 — Höhen ergeben sich, sie werden nicht hingeschrieben

Startseite und Drill bekommen ihre Höhe vom Hauptbereich, der sie von der
Kopfzeile bekommt. Nirgends steht eine Zahl dafür.

**Begründung.** Vorher tat es der Drill mit `min-height: 78svh` — ein Wert,
der auf die Navigationshöhe abgestimmt war. Als die Navigation verschwand,
sprang der Antwortknopf wieder um 34 Pixel, genau der Fehler, den diese Zahl
einmal geheilt hatte. Und der erste Versuch, die Höhe der Startseite
auszurechnen, setzte die Kopfzeile mit 56 Pixeln an; gemessen waren es 58,
und diese zwei Pixel machten die Seite scrollbar.

Eine Zahl, die auf eine andere Zahl abgestimmt ist, hält nur bis zur nächsten
Änderung der anderen. Eine Höhe, die sich ergibt, kann nicht danebenliegen.

### Regel 10.5 — Jede Karte trägt Inhalt, keine Abbildung

Eine Karte, die die Bildschirmhöhe füllt, aber innen aus zwei Textzeilen
besteht, sieht aus wie ein Versehen. Jede Karte trägt deshalb das, was sie
ohnehin zu sagen hat — und ist dadurch zugleich ein kürzerer Weg (E-035):

| Karte | Inhalt | Ziel des Inhalts |
|-------|--------|------------------|
| Nachschlagen | vier Felder: Glossar, Starthände, Odds, Live-Coach | jedes direkt an sein Ziel, nicht auf die Übersicht |
| Lernen | die nächste offene Lektion mit Namen, ein Knopf dorthin, ein Balken ohne Gesamtzahl, Streak/Level/XP | der Knopf führt direkt in die Lektion |
| Live-Session | läuft eine Runde: Dauer, Spielerzahl, Blindstufe, Knopf zurück; sonst: der zuletzt gespielte Abend und der Knopf, der einen neuen startet | beide Ziele ohne Zwischenschritt |

Die Überschrift jeder Karte bleibt antippbar und führt auf die
Bereichsübersicht. Die Karten selbst sind deshalb keine Links mehr, sondern
Kästen: Ein Link in einem Link ist kein gültiges HTML.

**Keine dekorativen Abbildungen.** Sie füllen Fläche, ohne etwas auszusagen,
und altern schlecht. Inhalt, den es ohnehin gibt, füllt dieselbe Fläche und
verkürzt zugleich den Weg.

**Gemessen wird das, nicht behauptet.** `npm run durchgang` bestimmt für jede
Karte auf jedem der drei Bezugsgeräte den Anteil der Innenfläche, den ihr
Inhalt belegt — die Summe der Kindhöhen samt Abständen, geteilt durch die
Innenhöhe. Nicht die Spanne vom ersten zum letzten Kind: Die zählt die Lücke
dazwischen mit und wäre bei zwei Zeilen an Ober- und Unterkante immer 1.
Unterschreitet eine Karte 0,4, schlägt der Test an. Woher die 0,4 kommt,
steht in `durchgang.test.ts`; kurz: kleinster gemessener Wert über 72
Kombinationen (0,492) minus eine Textzeile, gegen 0,142 bis 0,230 im Zustand
vor E-035.

**Was diese Messung nicht sieht.** Ob ein Kind mit der Fläche etwas anfängt.
Der erste Versuch ließ den Hauptknopf auf die volle Höhe wachsen: 0,89
gemessen, auf dem Bild ein 176 Pixel hohes leeres Rechteck. Das ist derselbe
Fehler wie eine dekorative Abbildung, nur in Knopfform. Dagegen hilft keine
Zahl, sondern ein Deckel — die Knöpfe der Startseite werden höchstens so
hoch wie ein großer Knopf in dieser App — und ein Blick auf das Bild.
Dieselbe Lehre wie in Abschnitt 11.6.

### Regel 10.6 — Die Startseite hat zwei Zustände

Seit E-036 sieht die Startseite verschieden aus, je nachdem, ob gerade
gespielt wird.

| | **Alltag** (keine Runde läuft) | **Am Tisch** (eine Runde läuft) |
|---|---|---|
| Ganz oben | die **Hand des Tages**: große Karten, eine Frage, zwei Knöpfe | nichts davon |
| Die drei Karten | stehen auf ihrem Inhalt | teilen sich die Höhe (Regel 10.1) |
| Live-Session | unterste Karte | unterste **und größte** Karte (Regel 10.2) |
| Scrollen | auf kurzen Geräten ja | **nie** |

**Begründung.** Wer das Gerät zwischen Chips und Karten aufnimmt, will die
Uhr sehen, keine Übungsaufgabe. Und wer die App auf dem Sofa öffnet, will
nicht als Erstes ein Menü. Das sind zwei Situationen, keine zwei Meinungen
über dieselbe.

Die Höhenregeln 10.1 und 10.2 sind damit nicht abgeschafft, sondern an die
Lage gebunden, für die sie geschrieben wurden. `durchgang.test.ts` prüft
beide Zustände getrennt.

**Was in beiden Zuständen gilt:** Die Live-Session ist die unterste Karte,
die Marke oben trägt den Rückweg, und unter der letzten Karte steht nichts
als der Gestenstreifen.

### Regel 10.7 — Die Hand des Tages ist ohne Scrollen beantwortbar

Auf **jedem** Bezugsgerät. Wonach man scrollen muss, sind die Wege — und
Wege darf man suchen. Eine Aufgabe unterhalb des Bildrands ist dagegen keine
Aufgabe, sondern eine, die man findet, wenn man ohnehin schon sucht.

### Regel 10.8 — Der Gegenstand ist keine Verzierung

E-035 verbietet dekorative Abbildungen. Große Spielkarten sind keine.

Die Trennlinie ist nicht „Bild oder Text", sondern **trägt es die Sache oder
umrahmt es sie**. Der Prüfstein: Deckt man die Karten in einer Aufgabe ab,
ist die Aufgabe nicht mehr lösbar. Deckt man eine Abbildung von Chips ab,
ändert sich nichts.

Spielkarten werden deshalb in erkennbarer Größe gezeigt — in der Hand des
Tages 62 Pixel, mit zweitem Index unten rechts wie auf einer echten Karte.
Die Größe `xl` mit 96 Pixeln steht für die Aufgabenbildschirme bereit.

### Regel 10.9 — Jeder Bereich hat seine Farbe

Nachschlagen blau, Lernen gold, Live-Session grün. Farbe ist hier keine
Verzierung, sondern die schnellste Art zu sagen, wo man ist: Man findet eine
Farbe, bevor man ein Wort gelesen hat. Die Töne sind keine neuen — es sind
die, die die App für diese Bereiche ohnehin verwendet, und sie laufen durch
denselben Kontrastlauf über beide Modi wie alles andere.

### Was diese Regeln festhält

`durchgang.test.ts` prüft am gerenderten Ergebnis: kein Scrollen, die
Reihenfolge klein → mittel → groß, die Live-Session mindestens doppelt so
hoch wie die kleinste Karte, unter der letzten Karte genau der
Gestenstreifen, die Kennzahlen oberhalb der großen Karte, die Füllung jeder
Karte, und die Marke als 44 Pixel großer Weg nach `#/`. Reihenfolge,
Verhältnis, Gestenstreifen und Füllung auf allen drei Bezugsgeräten.

Dass keine zweite Navigation zurückkommt, prüft er an der **Rolle** und an
der **Lage**, nicht an einer Klasse: höchstens ein Element mit
Navigationsrolle (`<nav>` oder `role="navigation"`), keines unterhalb der
großen Karte, und keines, das breit ist und dicht am unteren Rand endet. Die
erste Fassung suchte nach `nav.bottom-nav` und war damit wertlos — eine neue
Leiste hieße beim nächsten Mal anders und käme durch. Gegengeprüft: Eine
eingebaute Probeleiste ohne diese Klasse lässt beide Lageprüfungen fallen.

---

## 11. Drei Farbmodi

Hell, Dunkel, Systemvorgabe. Die Systemvorgabe ist keine dritte Farbwelt,
sondern eine Regel darüber, welche der beiden gerade gilt: Die App löst sie
beim Start auf und hört auf Änderungen, solange niemand ausdrücklich gewählt
hat. Fünf Farbwelten sind bewusst nicht das Ziel — die Begründung steht in
`ENTSCHEIDUNGEN.md`, E-034.

### Regel 11.1 — Der Live-Bereich bleibt in jedem Modus dunkel

Das Gerät liegt bei gedimmtem Licht auf einem Pokertisch. Eine helle Fläche
blendet die Runde und beleuchtet Gesichter — beides ist am Tisch mehr als ein
Schönheitsfehler. Nachschlagen und Lernen folgen der Wahl, die Live-Session
nicht.

**Wie das umgesetzt ist, gehört zur Regel.** Nicht als Sonderfall in einem
Bildschirm: Ein Sonderfall je Bildschirm fehlt beim nächsten neuen, und dann
sitzt jemand mit einer weißen Fläche am Tisch. Stattdessen hängt der dunkle
Tokensatz an `[data-modus="dunkel"]` und nicht nur an `:root`. Jedes Element
mit diesem Attribut erzwingt ihn für alles darunter. Der Live-Bereich setzt es
einmal, in `App.tsx`, an einer Liste von Bereichen — heute steht dort genau
ein Eintrag.

### Regel 11.2 — Jeder farbige Token steht genau einmal je Modus

Zwei Stellen mit derselben Farbe gehen auseinander, und zwar an der Stelle,
die niemand ansieht. Deshalb keine Kopie für die Systemvorgabe, kein zweiter
Block für den Live-Bereich. Ein Test prüft, dass beide Sätze **dieselben**
Tokens kennen und dass kein Token in beiden denselben Wert hat — wäre er
gleich, gehörte er nach `:root`.

### Die Flächen

| Fläche | dunkel | hell |
|--------|--------|------|
| `--bg` | `#0c110e` | `#f4f2ec` |
| `--bg-deep` | `#090d0b` | `#efece5` |
| `--bg-elev` | `#121814` | `#fbfaf6` |
| `--bg-card` | `#161e19` | `#fdfcf9` |
| `--bg-card-hover` | `#1b241e` | `#f2efe7` |

Im hellen Modus **kein Reinweiß**: Es wirft bei Tageslicht mehr Licht zurück
als Papier, und das Auge regelt dauernd nach. Und **kein Reinschwarz** für
Text: Der harte Hell-Dunkel-Sprung erzeugt beim Weiterlesen Nachbilder.
Stattdessen ein warmes Off-White und ein sehr dunkles Grüngrau — dieselbe
warme Grundstimmung wie im dunklen Satz, nur umgedreht.

### Gemessene Kontraste

Jeder Wert unten ist der **schlechteste** über alle fünf Flächen. Keine dieser
Zahlen steht im Quelltext; `farbmodi.test.ts` rechnet sie bei jedem Lauf neu.

| Token | dunkel | schlechtester Kontrast | hell | schlechtester Kontrast | Grenze |
|-------|--------|------------------------|------|------------------------|--------|
| `--ergebnis-gut` | `#6ec97d` | **7,83** | `#0f5a32` | **7,04** | 7,00 |
| `--ergebnis-schlecht` | `#f29b95` | **7,51** | `#95231c` | **7,02** | 7,00 |
| `--text` | `#ece9df` | **13,12** | `#1c211d` | **13,86** | 4,50 |
| `--text-dim` | `#a8a79b` | **6,58** | `#4b514c` | **6,90** | 4,50 |
| `--text-faint` | `#949384` | **5,13** | `#5c6259` | **5,32** | 4,50 |
| `--text-stark` | `#d8d5cb` | **10,85** | `#0f120f` | **15,98** | 4,50 |
| `--akzent` | `#4fbf8e` | **6,96** | `#0a6b47` | **5,55** | 4,50 |
| `--auszeichnung` | `#d4af5e` | **7,66** | `#7d5f14` | **5,06** | 4,50 |
| `--ok-lesbar` auf `--ok-dim` | `#90d69c` | **7,35** | `#14622d` | **5,40** | 4,50 |
| `--danger-lesbar` auf `--danger-dim` | `#eda49f` | **6,83** | `#8f1f18` | **6,28** | 4,50 |
| `--info-lesbar` auf `--info-dim` | `#94bdea` | **6,70** | `#164a8c` | **6,25** | 4,50 |
| `--warn-lesbar` auf `--warn-dim` | `#e8bd7a` | **6,99** | `#744d0e` | **5,34** | 4,50 |
| `--kategorie-sozial-lesbar` auf `--kategorie-sozial-schwach` | `#bda6e8` | **6,09** | `#4c3484` | **6,96** | 4,50 |
| `--auszeichnung-lesbar` auf `--auszeichnung-schwach` | `#edcf87` | **8,03** | `#5f4810` | **6,28** | 4,50 |

Die letzten sechs Zeilen stehen auf einer durchscheinenden Fläche. Was der
Text wirklich unter sich hat, hängt davon ab, was unter der Fläche liegt —
deshalb wird die gedämpfte Farbe erst auf jeden Grund gelegt und dann
gerechnet.

### Regel 11.3 — Der Akzent braucht je Modus einen eigenen Wert

Derselbe Grünton besteht die Prüfung nicht auf beiden Gründen. Nachgerechnet
statt behauptet: Der dunkle Akzent erreicht auf hellem Grund **2,04 zu 1**,
der helle auf dunklem Grund **2,91 zu 1** — beide weit unter 4,5.

Die beiden Werte bleiben trotzdem dieselbe Farbe: Farbton 158 Grad gegen 154
Grad. Gleiche Farbe, andere Helligkeit. Ein Test hält fest, dass zwischen
ihnen höchstens 20 Grad liegen — mehr wären zwei Farben, nicht zwei Fassungen
einer.

### Regel 11.4 — Erfolg und Fehler bleiben zusätzlich an der Form erkennbar

Unverändert gegenüber Abschnitt 2: Das Urteil im Drill trägt ein Zeichen
(✓ / ✕) vor dem Wort, eine ausgeschiedene Zeile ist durchgestrichen, eine
angehaltene Uhr trägt das Wort „Pausiert". Ein Modus ändert daran nichts —
er ändert Farben, und Farbe war hier nie das einzige Merkmal.

### Regel 11.5 — Kein Aufblitzen

Die Wahl steht vor dem ersten Zeichnen fest. Ein kurzes Skript im `<head>`
von `index.html` liest den Speicher und setzt dasselbe Attribut, bevor das
Stilblatt geladen ist. Nachgemessen im Durchgang: Das Attribut ist schon bei
`DOMContentLoaded` gesetzt, und das Skript steht im Dokument vor dem ersten
Stilblatt.

Der Schlüssel steht dadurch zweimal — im Skript und in `modus.ts`. Ein Test
hält beide zusammen; ohne ihn blitzt es irgendwann wieder, und niemand weiß
warum.

### Regel 11.6 — Der Lauf über beide Modi ist die eigentliche Prüfung

Eine Tokenprüfung sichert **Bausteine**, nicht ihre **Zusammensetzung**.

Das ist keine Vermutung, sondern die Lehre aus dem einzigen echten Fehler
dieser Änderung. Der Hauptknopf trug im hellen Modus dunkle Schrift auf
dunklem Gold — **2,76 zu 1**, gut vierzig Prozent unter der Grenze. Und
dabei war die Tokenprüfung **grün**: `--auf-auszeichnung` war als Schriftfarbe
in Ordnung, `--auszeichnung` war als Textfarbe in Ordnung. Jeder Baustein
hielt seine Grenze. Erst ihre Zusammensetzung — dunkle Schrift auf einem
Farbverlauf, dessen dunkelster Stopp ausgerechnet die Textfarbe war — ergab
etwas Unlesbares.

Diese Zusammensetzung entsteht im Browser. Sie steht in keiner Datei: Der
Verlauf kommt aus einer Regel, die Schriftfarbe aus einer zweiten, der Grund
darunter aus einer dritten, und welcher Farbstopp gerade hinter dem Wort
liegt, entscheidet die Zeilenumbrechung. Kein Test über Werte kann das sehen.

**Daraus folgt die Reihenfolge, in der diese beiden Prüfungen stehen.** Der
Lauf über beide Modi am gerenderten Ergebnis (`npm run pruefen`) ist nicht
die Zugabe zur Tokenprüfung, sondern die eigentliche Prüfung; die
Tokenprüfung ist der schnelle Vorabfilter, der die groben Fehler abfängt,
bevor ein Browser startet. Wer einmal Zeit sparen muss, spart sie bei der
Tokenprüfung — nicht hier.

Und deshalb läuft er über **beide** Modi und nicht über den eingestellten.
Der helle Satz ist der, den niemand von uns täglich sieht; ein Lauf über den
dunklen sagt über ihn genau nichts.

### Was diese Regeln festhält

- `farbmodi.test.ts`: jede Kombination aus Token, Fläche und Modus; beide
  Sätze vollständig und deckungsgleich; jeder Token in genau einer Rolle;
  kein Reinweiß, kein Reinschwarz; der Akzent als eigener Wert und dieselbe
  Farbe. Dazu die Liste der Bereiche, die den dunklen Satz erzwingen: Sie hat
  genau einen Eintrag, und der Test schlägt bei jeder Erweiterung fehl — mit
  der Begründung in der Fehlermeldung, damit sie gelesen wird.
- `npm run pruefen`: derselbe Kontrast, aber am **gerenderten** Ergebnis und
  in **beiden** Modi — 49 Bildschirme, 98 Messungen. Siehe Regel 11.6.
- `durchgang.test.ts`: drei Einträge mit vorausgewählter Systemvorgabe, unter
  dem Personensymbol statt auf der Startseite, Umschalten in beide Richtungen
  ohne Neustart, kein Aufblitzen, Live-Bereich dunkel bei heller Wahl.
