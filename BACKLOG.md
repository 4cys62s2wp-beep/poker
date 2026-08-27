# Backlog

Was beschrieben, aber nicht gebaut ist. Je Eintrag vier Fragen: worum es
geht, warum es wertvoll ist, was daran schwierig ist, was es voraussetzt.

Ein Eintrag hier ist keine Absichtserklärung. Er ist eine Notiz an den, der
später entscheidet — damit er nicht bei null anfängt.

---

## Vorschaukarte je geteilter Aufgabe, samt Router-Umbau

**Worum es geht.** Ein geteilter Drill-Link zeigt heute für jede Aufgabe
dieselbe Karte in WhatsApp und Discord. Eine Karte, die die geteilte
Situation zeigt — Hand, Flop, Einsatz —, verlangt, dass beim Abruf jemand die
Adresse auswertet. Das geht nur mit einem Server oder mit vorab erzeugten
Seiten, und Letzteres verlangt den Umbau von `HashRouter` auf
`BrowserRouter`. Beides ist eine Entscheidung, nicht zwei.

**Warum es wertvoll wäre.** Eine Karte, die die Aufgabe zeigt, ist die
Einladung; eine, die nur die App zeigt, ist Werbung. Der Unterschied
entscheidet, ob jemand tippt.

**Was daran schwierig ist.** Das Fragment einer Adresse wird beim Abruf nicht
an den Server geschickt — das ist Protokoll und keine Nachlässigkeit. Vorab
erzeugte Seiten müssten bei **jeder** Datenänderung neu erzeugt werden; es
sind 2864 mögliche Zustände, oder 64, wenn man die Potgröße aus der Karte
lässt. Der Router-Umbau berührt jede Adresse der App.

**Was es voraussetzt.** Dass es Nutzer gibt, die teilen. Aktuell gibt es
keine. Damit ist es dauerhafte Last für einen erst später eintretenden
Vorteil — deshalb heute entschieden: bleibt ungebaut, fällig sobald das
Hosting feststeht. Siehe ENTSCHEIDUNGEN.md, E-023.

---

## Beitritt per QR-Code

**Worum es geht.** Das Tischgerät zeigt einen QR-Code; wer ihn scannt, trägt
seinen Namen selbst ein, statt ihn dem Gastgeber zuzurufen.

**Warum es wertvoll wäre.** Sechs Namen einzutippen dauert am Tisch länger,
als man denkt, und der Gastgeber tippt sie falsch. Jeder tippt seinen eigenen
Namen richtig.

**Was daran schwierig ist.** Ohne Server müssen die Geräte einander direkt
finden. Das geht über einen lokalen Kanal oder über einen Zustand, der
komplett im Code steckt — beides ist ungemütlich, sobald sechs Geräte
mitspielen.

**Was es voraussetzt.** Eingabe von Hand bleibt gleichwertig möglich. Ein
leerer Akku darf niemanden vom Tisch ausschließen, und ein Beitrittsweg, der
der einzige ist, tut genau das.

---

## Kleingeld-Modus

**Worum es geht.** Spielen mit echten Münzen, wenn kein Koffer da ist. Die
App verteilt aus dem, was die Anwesenden dabeihaben.

**Warum es wertvoll wäre.** Der häufigste Grund, warum ein spontaner
Pokerabend nicht stattfindet, ist fehlendes Material. Münzen hat jeder.

**Was daran schwierig ist.** Münzwerte sind fest und ungünstig gestuft: Von
1 Cent bis 2 Euro sind es acht Werte, aber die kleinen Stücke sind meist zu
wenige für die Blinds. Die Verteilung muss also aus einer festen, ungleich
verfügbaren Menge rechnen statt aus einer frei wählbaren.

**Was es voraussetzt.** Die Chipverteilung aus Phase 3.1 — sie löst dasselbe
Problem mit freieren Werten. Der Kleingeld-Modus ist ihr Sonderfall.

---

## Abrechnung: wer schuldet wem wie viel

**Worum es geht.** Am Ende stehen Stände und Einkäufe. Daraus folgt, wer wem
etwas schuldet — und zwar mit möglichst wenigen Zahlungen.

**Warum es wertvoll wäre.** Die letzten zehn Minuten eines Pokerabends
bestehen aus Kopfrechnen und Kleingeldschieben. Vier Leute können sich in
sechs Richtungen bezahlen oder in drei.

**Was daran schwierig ist.** Die kleinste Zahl von Zahlungen zu finden ist im
Allgemeinen schwer. Für sechs bis acht Personen genügt ein einfaches
Verfahren — größten Gläubiger gegen größten Schuldner, wiederholt —, das
nachweislich höchstens n−1 Zahlungen braucht. Das ist gut genug und
erklärbar.

**Was es voraussetzt.** Phase 4: Stände und Einkäufe müssen erfasst sein.

---

## Rebuys mitzählen

**Worum es geht.** Wer nachkauft, zahlt noch einmal ein. Ohne diese Zahl
stimmt die Abrechnung nicht.

**Warum es wertvoll wäre.** Es ist die häufigste Streitquelle des Abends,
weil sich niemand erinnert, wer wie oft nachgekauft hat.

**Was daran schwierig ist.** Nichts Technisches. Die Schwierigkeit ist, dass
es am Tisch in unter fünf Sekunden gehen muss, sonst wird es nicht gemacht.

**Was es voraussetzt.** Phase 4.5 — die grobkörnige Erfassung bei
Ereignissen.

---

## Dealer auslosen und reihum weiterrücken

**Worum es geht.** Wer teilt zuerst, und wie wandert der Knopf?

**Warum es wertvoll wäre.** Das Auslosen am Anfang ist ein kleines Ritual,
und der wandernde Knopf wird tatsächlich vergessen.

**Was daran schwierig ist.** Nichts — aber es berührt die Altersfreigabe:
Eine Zufallsentscheidung ist harmlos, eine animierte Kartenausgabe wäre es
nicht. Reine Namensliste mit einer Markierung, sonst nichts.

**Was es voraussetzt.** Die Spielerliste aus Phase 4.

---

## Farbtausch, wenn kleine Chips knapp werden

**Worum es geht.** Steigen die Blinds, sind die kleinen Chips irgendwann nur
noch Ballast. Dann werden sie eingesammelt und gegen größere getauscht.

**Warum es wertvoll wäre.** Ohne Tausch stapeln sich hundert Ein-Cent-Chips
vor jedem, und das Zählen dauert länger als die Hand.

**Was daran schwierig ist.** Der Tausch geht selten glatt auf. Es braucht
eine Regel für den Rest — aufrunden zugunsten des Spielers, und die App muss
sagen, wie viele Chips insgesamt dazukommen.

**Was es voraussetzt.** Chipverteilung und Blindstruktur aus Phase 3.

---

## Prüfsumme über alle Stacks

**Worum es geht.** Die Summe aller Stacks muss der Summe aller Einkäufe
entsprechen. Weicht sie ab, hat sich jemand verzählt.

**Warum es wertvoll wäre.** Ein Zählfehler fällt sonst erst bei der
Abrechnung auf, und dann weiß niemand mehr, wo er entstand.

**Was daran schwierig ist.** Nichts. Es ist eine Subtraktion — die
Schwierigkeit liegt darin, den Hinweis so zu zeigen, dass er nicht nervt,
solange er nicht zutrifft.

**Was es voraussetzt.** Phase 4.

---

## Bilanz über mehrere Runden eines Abends

**Worum es geht.** Ein Abend besteht oft aus zwei oder drei Runden. Die
Bilanz interessiert über den ganzen Abend, nicht je Runde.

**Warum es wertvoll wäre.** Wer die erste Runde verliert und die zweite
gewinnt, will das verrechnet sehen.

**Was daran schwierig ist.** Die Zuordnung: Was ist derselbe Abend? Ein
Datum reicht nicht, wenn es nach Mitternacht weitergeht.

**Was es voraussetzt.** Phase 4, und eine Entscheidung darüber, was ein Abend
ist.

---

## Szenario-Drill als Standbild

**Worum es geht.** Eine einzelne Situation, eine Entscheidung, eine
Auflösung. Kein Tisch, keine Animation, keine Runde — das Standbild ist die
Form, die die Altersfreigabe erlaubt.

**Warum es wertvoll wäre.** Der Pot-Odds-Drill zeigt, dass die Form trägt.
Dieselbe Form für andere Fragen — welche Hand gewinnt, wie viele Outs, lohnt
der Call — ergibt eine Lernstrecke aus wenigen Bausteinen.

**Was daran schwierig ist.** Die Grenze zum simulierten Spiel. Sobald Stände
über mehrere Hände hinweg weiterlaufen, ist es eine Runde und keine Übung
mehr.

**Was es voraussetzt.** Daten für die jeweilige Frage. Für „welche Hand
gewinnt" reicht B1 nicht, dafür braucht es B4.

---

## Der Knopf, der die Herkunft einer Zahl aufklappt

**Worum es geht.** Neben jeder gerechneten Zahl ein kleines Zeichen; wer es
antippt, sieht Methode, aufgezählte Fälle, Annahmen und Bibliotheksversion.

**Warum es wertvoll wäre.** Es ist das Unterscheidungsmerkmal. Jede App kann
eine Prozentzahl anzeigen; nachweisen, woher sie kommt, kann fast keine —
und beim ersten Kontakt trägt genau das die Glaubwürdigkeit.

**Was daran schwierig ist.** Nichts mehr: Der Knopf **existiert** seit heute
im Pot-Odds-Drill (`src/components/Herkunft.tsx`), samt Feldpfad, Fallzahl,
Annahmen und Bibliothek, zweisprachig und aus den Daten statt formuliert.

**Was es voraussetzt.** Nur noch die Ausweitung: Jede andere Seite, die eine
gerechnete Zahl zeigt — Odds-Tabellen, Starthand-Explorer, Equity-Rechner —
kann die Komponente unverändert verwenden. Das ist der offene Teil.

---

## Bestand auf das Designfundament umstellen

**Worum es geht.** Zwei Aufräumarbeiten, die zusammengehören: die vier
Bereichsfarben des Bestands auf die eine Akzentfarbe zurückführen, und die
drei Alt-Schriftstufen (`--fs-stat`, `--fs-h1`, `--fs-h3`) durch die
Fünferskala ersetzen. Dazu die 966 verstreuten Gestaltungswerte in 48
Dateien.

**Warum es wertvoll wäre.** Solange der Bestand vier Akzentfarben trägt,
sagt Farbe in dieser App nichts. Und solange 966 Werte neben den Tokens
stehen, ist das Fundament eine Absichtserklärung.

**Was daran schwierig ist.** Nichts einzeln — aber es sind 48 Dateien, und
ein Umbau über 48 Dateien in einem Zug erzeugt einen Unterschied, den
niemand mehr prüfen kann. Es gehört bildschirmweise gemacht, mit einem Blick
auf das Ergebnis nach jedem.

**Was es voraussetzt.** Die Sperrklinke steht schon: `npm run streuung`
zählt, der Test lässt die Zahl nicht wachsen. Wer aufräumt, sieht die Zahl
fallen. Mehr braucht es nicht — nur Zeit und einen Bildschirm nach dem
anderen.

## Ein-Geräte-Tisch — gebaut, entfernt, nur mit Altersentscheidung zurück

> **Vorbehalt.** Dieser Eintrag kommt **nicht nebenbei** zurück. Er setzt eine
> ausdrückliche Entscheidung über eine höhere Altersstufe voraus — getroffen,
> bevor eine Zeile davon wieder eingebaut wird, nicht danach begründet.

**Worum es geht.** Ein Tisch für einen Abend ohne Kartendeck: Die App
übernimmt Karten, Chips, Blinds und Showdown, das Gerät wandert reihum. Er
lag unter `/session/tisch`, war fertig und geprüft und ist am 27.08.2026
entfernt worden (E-030). Der Code steht in der Historie:
`src/pages/table/LocalTablePage.tsx` und `src/lib/table/local.ts`, zuletzt
vollständig in Commit `fc9848d`.

**Warum es wertvoll wäre.** Es ist die einzige Funktion, die einen Pokerabend
auch dann trägt, wenn niemand ein Kartendeck dabeihat. Sie war die
meistgenannte Idee des ursprünglichen Mehrspieler-Pakets.

**Was daran schwierig ist.** Nicht die Technik — die stand. Schwierig ist der
Rahmen: Gespieltes Poker ist etwas anderes als verwaltetes, und die
Altersstufe der App hängt daran. Eine Rückkehr verlangt außerdem, dass die
Zusage „nur Zahlenverwaltung und Lehrmaterial als Standbild" ausdrücklich
zurückgenommen wird — sonst stehen zwei Versprechen nebeneinander, die
einander widersprechen.

**Was es voraussetzt.** Die Altersentscheidung, und danach eine Prüfung, was
sie sonst noch mitzieht: Store-Angaben, Impressum, die Frage, ob ein
Minderjähriger die App unter diesen Angaben veröffentlichen kann.

---

## Online-Tisch mit Code und QR — gebaut, entfernt, nur mit Altersentscheidung zurück

> **Vorbehalt.** Wie oben: Rückkehr nur über eine ausdrückliche Entscheidung
> über die Altersstufe, vorher getroffen und nicht nachträglich begründet.

**Worum es geht.** Mehrere Geräte spielen über einen sechsstelligen Code oder
einen QR-Code an einem gemeinsamen Tisch, jeder sieht seine eigenen Karten.
Gespielt wurde mit Punkten, nie mit Geld. Er lag unter
`/session/tisch/online`, entfernt am 27.08.2026 (E-030). Der Code:
`src/pages/table/OnlineTablePage.tsx`, `src/lib/table/online.ts` und
`src/lib/table/protocol.ts` — Letzteres mit 814 Zeilen Tests, die den
Zustandsabgleich zwischen Geräten absichern.

**Warum es wertvoll wäre.** Es ist die einzige Funktion für den Fall, dass
jemand nicht dabei sein kann. Und das Protokoll ist der aufwendigste Teil des
ganzen Projekts gewesen — es löst optimistische Konflikte zwischen Geräten
ohne Server-Logik.

**Was daran schwierig ist.** Dasselbe wie oben, und zusätzlich: Der
Online-Tisch bringt fremde Menschen an einen Tisch. Das ist eine andere
Größenordnung von Verantwortung als eine Runde unter Freunden — Moderation,
Meldewege, Umgang mit Namen, die andere lesen.

**Was es voraussetzt.** Die Altersentscheidung. Und die Firestore-Regeln:
Der Block `match /tables/{code}` in `firestore.rules` ist **absichtlich
stehengeblieben**, samt seinen Tests. Eine Regeländerung ist eine
Bereitstellung und keine Aufräumarbeit — sie gehört in eine Sitzung, in der
jemand auf die Datenbank schaut. Solange sie steht, dürfen angemeldete Nutzer
theoretisch Tischräume anlegen, die kein Client mehr benutzt. Das ist kein
Datenleck, aber es ist eine offene Tür, die beim nächsten Aufspielen zugehen
sollte.

---

## Weitere Farbwelten über Hell und Dunkel hinaus

**Worum es geht.** Statt zwei Tokensätzen mehrere: gedämpft, kontraststark,
warm, kühl — Farbwelten, zwischen denen jemand wählt, so wie manche Apps eine
Handvoll Themes anbieten. Die Technik dafür steht seit E-034 bereit: Jeder
farbige Token liegt in einem Block, den ein Attribut auswählt; eine weitere
Welt wäre ein weiterer Block.

**Warum es wertvoll wäre.** Ein kontraststarker Satz hilft Menschen, denen
4,5 zu 1 nicht reicht — die Grenze ist ein Mindestmaß und kein Komfortwert.
Und ein gedämpfter Satz für sehr dunkle Räume wäre am Pokertisch das, was der
Live-Bereich heute pauschal löst.

**Was daran schwierig ist.** Nicht das Anlegen, sondern das Pflegen. Bei sechs
Textfarben, sechs Farbmarken und fünf Flächen sind es 60 Kontrastwerte je
Welt; der Test rechnet sie alle, aber er kann nicht entscheiden, welcher Ton
gut aussieht. Diese Beurteilung bleibt Handarbeit und wächst mit jeder Welt —
und sie fällt bei **jeder** Farbänderung erneut an, nicht nur beim Anlegen.

**Was es voraussetzt.** Einen Grund, der von außen kommt: jemanden, dem die
zwei Sätze nicht genügen, und zwar mit Angabe, woran es liegt. „Mehr Auswahl"
ist keiner — die zwei Sätze sind nicht deshalb zwei, weil niemand an mehr
gedacht hätte.
