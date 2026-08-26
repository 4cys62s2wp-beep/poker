# Design-Referenz: Offsuit

Auswertung der Referenz-App **Offsuit** (`offsuit.app`, „Casual poker,
redesigned", iOS + Android seit April 2023) anhand von zehn Screenshots.

**Auftrag: analysieren, nicht nachbauen.** Was hier steht, sind Prinzipien und
daraus abgeleitete Regeln — keine Pixel, keine Farben, keine Icons, keine
Illustrationen aus der Referenz. PokerMentor muss eigenständig aussehen.

---

## 0. Vorbemerkung: Es ist ein anderes Produkt

Bevor irgendetwas übernommen wird, muss klar sein, **was Offsuit eigentlich
löst**. Die Screenshots zeigen: Chips als Währung (993), Buy-ins mit
Preispools (250 → 1k, 1k → 4k), gesperrte Tische als Aufstiegsziel,
Wochen-Rangliste, Truhen für Edelsteine, Chip-Pakete für 5,99 €.

Das ist eine **Spielgeld-Poker-App mit Casino-Schleife**. Jedes Element dient
demselben Zweck: noch eine Sitzung.

PokerMentor ist eine **Lern-App**. Sie hat einen Lernpfad mit 49 Lektionen,
einen Live-Coach für echte Pokerabende, sieben Trainer, Werkzeuge — und ein
Modul über Suchtprävention, das bewusst dauerhaft gratis bleibt.

Daraus folgt die Leitlinie für dieses ganze Dokument:

> **Offsuits Gestaltung ist brillant für Offsuits Ziel.** Übernommen wird, was
> unabhängig vom Ziel gut ist (Reduktion, Rhythmus, Umgang mit Zahlen).
> Nicht übernommen wird, was nur für Offsuits Ziel gut ist (Anreiz-Schleifen)
> — und nichts, was gegen unseres arbeitet.

---

## 1. Was dort funktioniert — und warum

### 1.1 Radikale Reduktion pro Screen

**Beobachtung:** Der Startbildschirm trägt genau **eine** Entscheidung: welcher
Tisch. Ein horizontal wischbares Karussell, darunter die Rangliste. Die untere
Navigation hat **drei** Symbole, alle ohne Beschriftung.

**Warum es funktioniert:** Wer die App öffnet, will spielen. Eine einzige
sichtbare Entscheidung heißt: kein Lesen, kein Suchen, kein Nachdenken.
Aufmerksamkeit ist knapp, und jedes zusätzliche Element auf dem Startbildschirm
verteilt sie.

**Was das für uns heißt:** Unser Bestand hat 5 Punkte in der unteren Leiste und
in der Seitenleiste 4 Gruppen mit ~12 Links. Für „massentauglich und intuitiv"
ist das zu viel. Aber wir können nicht auf eine Entscheidung reduzieren —
PokerMentor hat legitim **drei verschiedene Absichten** (lernen, live spielen,
Sitzung verwalten), und die sind nicht dieselbe Sache in drei Varianten.

→ **Regel R1:** Der Startbildschirm trägt **drei** Entscheidungen, nicht mehr.
Alles Weitere ist eine Ebene tiefer erreichbar.

### 1.2 Karten sind unterscheidbar, nicht nur beschriftet

**Beobachtung:** Jede Karte im Karussell hat einen **eigenen Farbverlauf**
(Mint, Lavendel, Pfirsich, Türkis) und ein großes eigenes Bildzeichen. Man
erkennt „Cash Games" am Grün, bevor man den Text liest.

**Warum es funktioniert:** Wiedererkennung schlägt Lesen. Nach dreimaliger
Nutzung tippt man auf die Farbe, nicht auf das Wort. Drei identische Kacheln
mit unterschiedlicher Beschriftung leisten das nicht.

→ **Regel R2:** Jede Hub-Karte bekommt eine **eigene Akzentfarbe und ein
eigenes Bildzeichen** aus unserem Bestand. Nicht drei gleiche Kacheln.

### 1.3 Zahlen sind groß, dünn und ohne Zierrat

**Beobachtung:** Der Chipstand „993" steht in etwa 64 px, in einem sehr leichten
Schnitt, ohne Beschriftung. Kein „Chips:", kein Symbol. Beim Scrollen schrumpft
er in die Kopfzeile und bleibt dort sichtbar.

**Warum es funktioniert:** Zwei Dinge zugleich. Die Zahl ist die wichtigste
Information — sie bekommt Größe. Der leichte Schnitt verhindert, dass Größe in
Lautstärke umschlägt. Und der Wechsel in die Kopfzeile hält sie verfügbar, ohne
dauerhaft Platz zu kosten.

→ **Regel R3:** Kennzahlen groß und in leichtem Schnitt, tabellarische Ziffern,
Beschriftung klein darunter statt davor.

### 1.4 Statistiken erklären sich selbst

**Beobachtung (Screenshots 7–10):** Das Spielstil-Diagramm zeigt die vier
Ecken benannt (Tight / Loose / Aggressiv / Passiv) **mit einer Zeile Erklärung
darunter** („weniger Hände", „mehr Bets & Raises"), dazu die Einordnung als
Plakette am Rand. Jede Kennzahl-Kachel hat ein „?" für die Erklärung.

**Warum es funktioniert:** VPIP, PFR, AFq sind Fachbegriffe. Sie ungeklärt
hinzustellen wirkt professionell und ist wertlos für jeden, der sie nicht
kennt.

**Wo Offsuit dabei versagt — und wir es besser machen müssen:** Die Screenshots
zeigen „VPIP 33 %" bei **9 gespielten Händen**. Das ist reines Rauschen und
wird als Diagnose verkauft. Für eine Spiel-App ist das eine Lässlichkeit; für
eine **Lern-App wäre es das Gegenteil von Lehren** — sie brächte Nutzern bei,
aus Zufallszahlen Schlüsse zu ziehen.

→ **Regel R4:** Jede Kennzahl trägt ihren Nenner sichtbar mit sich, und
unterhalb einer belastbaren Stichprobe steht ausdrücklich dabei, dass die Zahl
noch nichts bedeutet. (In `src/lib/poker/stats.ts` bereits so gebaut.)

### 1.5 Ein Rhythmus statt vieler Abstände

**Beobachtung:** Die Abstände wirken auf ein Raster gesetzt — Karten haben
ringsum denselben Rand, zwischen Abschnitten steht immer derselbe größere
Abstand, innerhalb einer Liste immer derselbe kleinere.

**Warum es funktioniert:** Gleichmäßigkeit liest sich als Sorgfalt, auch wenn
niemand die Abstände bewusst wahrnimmt. Uneinheitliche Abstände wirken
umgekehrt „selbstgebaut", ohne dass man sagen könnte, warum.

→ **Regel R5:** Eine Abstands-Skala, überall dieselbe. Keine freien Pixelwerte
mehr im CSS.

### 1.6 Sparsame Farbe, gezielt eingesetzt

**Beobachtung:** Der Hintergrund ist reines Schwarz. Farbe erscheint fast
ausschließlich auf den Karten und beim einen grünen Knopf („Join
leaderboard"). Sonst Weiß und Grau.

**Warum es funktioniert:** Wenn fast nichts farbig ist, zieht das Farbige den
Blick — ohne dass es schreien muss. Eine App, in der alles bunt ist, hat keine
Hierarchie mehr.

→ **Regel R6:** Farbe markiert Bereiche und die eine Hauptaktion. Nicht mehr.

### 1.7 Ehrliche Leerzustände

**Beobachtung:** Bei 0 Freunden steht „0 / Friends" mit einem deutlichen
Knopf „ADD FRIENDS" daneben. Die Rangliste bei 0 XP zeigt trotzdem die anderen
Spieler und darunter „Join leaderboard".

**Warum es funktioniert:** Der Leerzustand ist nicht leer, sondern **zeigt, was
entstehen würde**, und nennt die eine Handlung dorthin.

→ **Regel R7:** Kein Leerzustand ohne (a) Bild davon, was hier stehen wird,
und (b) genau einer Handlung.

### 1.8 Poker-Ikonografie: fast keine

**Beobachtung:** Keine Filztische, keine Spielkarten-Ornamente, keine
Pik-As-Verzierungen. Spielkarten erscheinen nur dort, wo tatsächlich Karten
liegen — und dann als schlichte weiße Rechtecke mit Ziffer und Farbe.

**Warum es funktioniert:** Poker-Ornamentik ist verbraucht. Ihr Fehlen wirkt
teurer als ihre Anwesenheit.

**Wo wir bewusst anders sind:** Unsere „Kartenlounge"-Ästhetik (Filzgrün, Gold,
Fraunces als Anzeigeschrift) ist **das einzige, was uns optisch von hunderten
Poker-Apps unterscheidet**. Sie aufzugeben, um auszusehen wie alle anderen
schwarz-mit-Pastell-Apps, wäre der teuerste denkbare Tausch.

→ **Regel R8:** Ornament reduzieren, **Identität behalten**. Das Wasserzeichen-♠
im Hero und dekorative Kartenmotive kommen weg. Filzgrün, Gold und Fraunces
bleiben.

---

## 2. Was übernommen wird — als Tokens und Regeln

| Regel | Umsetzung |
|---|---|
| R1 · drei Entscheidungen | Hub-Screen mit drei Karten (2.1) |
| R2 · unterscheidbare Karten | je eigene Akzentfarbe + Bildzeichen, Tokens `--accent-learn/-play/-tools` |
| R3 · Zahlen groß und leicht | Typo-Stufe `--fs-stat` mit `font-weight: 300`, `font-variant-numeric: tabular-nums` |
| R4 · Nenner sichtbar | bereits in `stats.ts`; die Seite zeigt `confidenceOf()` an |
| R5 · ein Rhythmus | Abstands-Skala `--sp-1` … `--sp-8`, Token-Audit in 3.2 |
| R6 · sparsame Farbe | Farbe nur für Bereichs-Akzente und die primäre Aktion |
| R7 · ehrliche Leerzustände | Komponente `<EmptyState>` mit Bild + genau einer Handlung |
| R8 · Ornament weg, Identität bleibt | Wasserzeichen entfernt, Palette und Schriften unverändert |

---

## 3. Was bewusst NICHT übernommen wird

### 3.1 Die Casino-Schleife — der wichtigste Punkt

Truhen (Wooden/Silver/Golden für 50/100/150 Edelsteine), Chip-Pakete für
5,99 €, Buy-in-Stufen mit Preispools, gesperrte Tische als Aufstiegsziel.

**Warum nicht:** Das ist die Architektur von Glücksspiel-Gewöhnung ohne
Echtgeld. Truhen gegen Währung sind Lootboxen — in Deutschland
jugendschutzrechtlich heikles Terrain. Vor allem aber: PokerMentor hat ein
Modul über verantwortungsvolles Spielen, das aus genau diesem Grund dauerhaft
gratis bleibt. Diese Schleife einzubauen hieße, dem eigenen Inhalt zu
widersprechen.

### 3.2 Der visuelle Stil selbst

Schwarz mit Pastell-Verläufen und 3D-Emoji ist der Standard-Look sehr vieler
Apps dieses Jahrgangs. Ihn zu übernehmen kostet unsere Unterscheidbarkeit und
bringt nichts, was Reduktion und Rhythmus nicht auch in unserer eigenen
Palette bringen.

### 3.3 3D-Emoji als Bildsprache

Verlockend, weil kostenlos und sofort verständlich. Zwei Gründe dagegen: Sie
sehen auf jeder Plattform anders aus (Apple, Google und Windows rendern
verschieden), und wir haben bereits ein eigenes, konsistentes SVG-Icon-Set.
Emoji wären ein Rückschritt zu dem, was wir gezielt ersetzt haben.

### 3.4 Icon-only-Navigation mit drei Punkten

Offsuit kommt damit durch, weil es genau drei Ziele gibt und alle drei
konventionell sind (Shop, Home, Profil). Unsere Ziele sind nicht konventionell
— ein Symbol für „Live-Coach" ist ohne Beschriftung nicht erratbar.

→ Wir reduzieren auf **vier** Punkte, aber **mit Beschriftung**.

### 3.5 Die globale Rangliste als Kernmechanik

Bei Offsuit ist die Wochen-Rangliste der Wiederkehr-Anker. Für eine Lern-App
ist ein Wettbewerb gegen Fremde der falsche Antrieb: Er belohnt Menge, nicht
Verstehen — und wer auf Platz 400 landet, hört auf.

→ Eine **Rangliste unter Freunden** wäre sinnvoll (siehe `STATUS.md`, offene
Punkte). Eine globale nicht.

---

## 4. Wo Referenz und Anforderungen kollidieren

Laut Auftrag gewinnen bei Widerspruch die Anforderungen aus 2.1/2.2.

| Kollision | Entscheidung |
|---|---|
| Offsuit: **eine** Entscheidung pro Screen · Anforderung 2.1: **drei** Karten | Anforderung. PokerMentor hat drei echte Absichten. |
| Offsuit: Navigation ohne Beschriftung · Anforderung 2.2: „intuitiv" | Anforderung. Beschriftung bleibt. |
| Offsuit: Fortschritt (XP, Rang) prominent · Anforderung 2.2: „sichtbar, aber nicht dominant" | Anforderung. Streak und Level in einer schmalen Leiste, nicht als Held des Screens. |
| Offsuit: keinerlei Poker-Ikonografie · unsere Identität | Mittelweg (R8): Ornament weg, Palette und Schriften bleiben. |
| Offsuit: Kennzahlen ab 9 Händen · Lern-Auftrag | Anforderung. Belastbarkeit wird ausgewiesen. |

---

## 5. Verbindliche Abgrenzung

Nicht übernommen werden und dürfen nirgends im Projekt auftauchen:

- Logo, Wortmarke oder Schriftzug von Offsuit
- deren Farbwerte, Verläufe, Icon-Set oder Illustrationen
- Screen-Aufbauten in erkennbarer 1:1-Übernahme
- Produkt- und Feature-Namen („AI Arena", „Dave's Garage", „The Pub")

Übernommen werden ausschließlich **Prinzipien**, wie oben unter R1–R8
formuliert, umgesetzt in eigener Palette, eigener Typografie und eigenem
Icon-Set.
