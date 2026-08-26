# STATUS — Arbeitsbereich `poker-trainer`

**Zweck:** Diese Datei ist so geschrieben, dass eine frische Sitzung ohne
jeden Kontext hier weiterarbeiten kann. Wer neu dazukommt, liest **nur diese
Datei** und weiß, wo es steht. Ganz unten steht die Vorgeschichte des
Projekts, unverändert übernommen.

- **Arbeitsbereich:** `/home/user/poker-trainer` (git worktree)
- **Branch:** `feature/pot-odds-trainer`, abgezweigt von `feature/poker-math`
- **Hauptverzeichnis:** `/home/user/poker` auf `feature/poker-math`. Dort
  läuft der B4-Rechenlauf; die Generator-Arbeit findet dort statt und wird
  hierher gemergt.
- **Letzte Aktualisierung:** 2026-08-26, während des Nachtlaufs
- **Stand in einem Satz:** Die vier Aufgaben und alle sieben Blocker sind
  erledigt; seit dem Abend läuft der Nachtlauf, der ein Designfundament,
  eine neue Startseite und die Live-Session gebaut hat. Offen ist nur noch
  der B4-Rechenlauf im Hauptverzeichnis.

> **Zuerst lesen:** `NACHTLAUF.log` — eine Zeile je Ereignis, in zeitlicher
> Reihenfolge. Der Abschnitt direkt darunter fasst denselben Stand in Prosa
> zusammen.

---

<!-- NACHTLAUF-ANFANG -->
## Nachtlauf 2026-08-26 — wo es steht

**Fertig und getestet**

| Phase | Was | Nachweis |
|-------|-----|----------|
| Teil C | Apple-Fingerabdruck aus dem Code entfernt, Prüfung bleibt Pflicht; Vorschaukarte und Freunde-Rangliste als Entscheidung abgelegt | `ENTSCHEIDUNGEN.md` E-021 bis E-024 |
| 0 | Bestandsaufnahme: 37 Bildschirme, 65 Routen, Datenvertrag 3, B4 lebt (PID geprüft) | `BESTAND.md` |
| 1 | Designfundament: fünf Schriftstufen nach Verwendung, eine Akzentfarbe, gerechneter Kontrast, Haptik, Sperrklinke gegen verstreute Werte | `DESIGN.md` 1–6, `design.test.ts`, `haptik.test.ts` |
| 2 | Startseite mit drei ungleich gewichteten Einstiegen und Fortsetzen-Karte; jeder Bildschirm in höchstens zwei Berührungen, null Sackgassen — im Browser bei 390 px gemessen | `DESIGN.md` 7, `docs/wege.json`, `wege.test.ts` |
| 3.1 | Chipverteilung aus vorhandenem Material: kleinster Chip = Small Blind, grobe Fünferleiter | `src/lib/live/verteilung.ts`, `live.test.ts` |
| 3.2 | Blindstruktur: gleichmäßige Steigung, Faktor gedeckelt auf 1,6, Zielgröße für das Finale hergeleitet | `src/lib/live/blinds.ts`, `live.test.ts` |
| 3.3 | Timer, Ton und Vorwarnung, Wachhalten des Bildschirms | `src/lib/live/signal.ts`, `src/pages/live/TischPage.tsx` |
| 3.4 | Laufender Abend überlebt Neuladen und Schließen: bei jeder Änderung lokal geschrieben, kein Speicherknopf | `src/lib/session/laufend.ts` |

**In Arbeit**

Phase 3 ist gebaut, aber die Tests für Timer und Zustand (Pause/Fortsetzen,
Überleben eines Neuladens) fehlen noch. Die Rechenwege aus 3.1 und 3.2 sind
abgedeckt, der Zeitverlauf nicht.

**Als Nächstes**

1. Tests für Pause/Fortsetzen und für den überlebenden Zustand.
2. Phase 4: Abende und Spieler (nur Name, frühere Abende über den Namen finden).
3. Warteschlange abarbeiten, sobald B4 fertig ist (`WARTESCHLANGE.md`, W-001 und W-002).
<!-- NACHTLAUF-ENDE -->

---

## Was gerade läuft

**Der B4-Rechenlauf** (Preflop-Equity, alle 14 365 Handpaare, exakt).

```bash
tail -3 tools/poker-math/output/b4_lauf.log      # Fortschritt und Restzeit
cat tools/poker-math/output/b4.pid               # Prozessnummer
kill "$(cat tools/poker-math/output/b4.pid)"     # sauber anhalten
```

Er sichert sich selbst alle 250 Handpaare nach
`output/b4_teil/matchups.jsonl`. Anhalten und neu starten kostet höchstens
ein paar Minuten Rechnung — der Lauf setzt an der ersten fehlenden Einheit
an. Nach dem letzten Handpaar baut er die Ausgabedatei selbst zusammen und
prüft die ganze Matrix auf Stimmigkeit; eine Abweichung bricht ab.

Ist er fertig, fehlt nur noch:

```bash
npm run daten     # nimmt b4_preflop_equity.json mit in public/pokermath/
```

Dafür braucht der Konverter noch einen `appB4`-Block — er ist der einzige,
den es noch nicht gibt.

---

## Der Auftrag, in vier Aufgaben

| # | Aufgabe | Stand |
|---|---------|-------|
| 1 | Datenschnittstelle: schlankes, direkt ladbares Format aus B1–B3, reproduzierbar erzeugt, beim Laden **laut** validiert | ✅ fertig |
| 2 | Pot-Odds-Trainer: der erste echte Bildschirm | ✅ fertig |
| 3 | „Warum diese Zahl": Herkunft neben jeder Zahl, aufklappbar | ✅ fertig |
| 4 | Teilbare Ergebnisse: Zustand in der Adresse, Vorschaubild-Metadaten | ✅ fertig |

---

## Die Blocker

| # | Was | Stand |
|---|-----|-------|
| B-001 | B4-Lauf tot, `--sichern` hat Daten vernichtet | ✅ behoben, Lauf neu gestartet |
| B-002 | B2/B3 nannten keine Evaluator-Bibliothek | ✅ nennen jetzt den Grund |
| B-003 | Keine Ausgabe nannte eine Fallzahl | ✅ wird mitgezählt |
| B-004 | Zwei Konvertierungsskripte | ✅ eines entfernt |
| B-005 | Gerechnete Daten nur auf Deutsch | ✅ zweisprachig ab Vertrag 3 |
| B-006 | Willkommensdialog vor der geteilten Aufgabe | ✅ aufgeschoben statt vorgedrängt |
| B-007 | Vorschaukarte je Aufgabe | ⬜ **braucht eine Entscheidung** |

Ausführlich, mit Begründung und Nachweis: `BLOCKER.md`.

---

## Der Datenvertrag

Version **3**. `ERWARTETE_VERTRAG_VERSION` in
`src/lib/pokermath/typen.ts` muss zu `VERTRAG_VERSION` in
`scripts/pokermath-app-daten.mjs` passen; tut sie es nicht, lehnt die App die
Datei ab, statt sie halb zu verstehen.

Was Version 3 gegenüber 2 ändert:

- Jeder anzeigbare Text ist ein `{de, en}`-Paar statt einer deutschen
  Zeichenkette.
- `faelle_enumeriert` trägt die mitgezählte Fallzahl und ihre
  Aufschlüsselung, jede Zählstelle mit Namen in beiden Sprachen.
- `bibliothek` nennt bei Blöcken ohne Evaluator den Grund, statt `null` zu
  sein.

---


---

## Aufgabe 1 — was jetzt steht

### Der Weg der Zahlen

```
tools/poker-math/output/*.json     ← der Nachweis, vollständig, mit Belegen
        │
        │  scripts/pokermath-app-daten.mjs   (npm run daten)
        ▼
public/pokermath/*.json            ← die Anzeigefassung, schlank
        │
        │  src/lib/pokermath/laden.ts        (prüft, wirft bei Abweichung)
        ▼
die App
```

Die App rechnet **nichts** nach. Sie liest nur, was der Generator geschrieben
hat.

### Die drei Teile

**`scripts/pokermath-app-daten.mjs`** — das Umwandlungsskript. Node, keine
Abhängigkeiten, ein Aufruf: `npm run daten`. Es liest die Rechenergebnisse aus
`tools/poker-math/output/` (nur lesend) und schreibt die Anzeigefassung nach
`public/pokermath/`.

Zwei Eigenschaften, die wichtig sind:

- **Es holt jedes Feld über `hole(datei, wurzel, pfad, pruefung)`.** Fehlt ein
  Feld oder hat es den falschen Typ, fliegt ein `QuellFehler` mit dem exakten
  Pfad (`b1_outs.json: outs[7].turn fehlt`). Kein `?.`, kein Standardwert.
- **Erst bauen, dann schreiben.** Alle vier Blöcke werden vollständig im
  Speicher gebaut; erst wenn keiner geworfen hat, wird geschrieben. Bricht
  einer ab, liegt **nichts** Halbes auf der Platte. Nachgeprüft: mit einem
  entfernten Pflichtfeld meldet das Skript `ABBRUCH – nichts geschrieben.`
  und schreibt null Dateien.

**`src/lib/pokermath/typen.ts`** — der Vertrag als Typen.
`ERWARTETE_VERTRAG_VERSION = 2`. Die Feldnamen sind deutsch, weil sie im
Generator so heißen; eine Übersetzungsschicht wäre genau die Stelle, an der
`turn_oder_river` irgendwann auf das Turn-Feld gemappt wird und es niemandem
auffällt.

**`src/lib/pokermath/laden.ts`** — die Prüfung beim Laden. Sie gibt bei einem
Fehler **nicht** `null` zurück, sondern wirft `SchemaFehler` mit dem Pfad des
schuldigen Feldes. Grund: Ein `null` wandert durch die App und wird irgendwo
zu einem leeren Bildschirm ohne Ursache. Eine geworfene Ausnahme mit
`b1_outs.outs[7].turn` im Text nennt die Stelle.

Geprüft wird mehr als der Typ:

| Prüfung | Warum |
|---------|-------|
| `turn_oder_river >= turn` | zwei Straßen können nicht schlechter sein als eine |
| `outs_falsch_gezaehlt >= outs` | die falsche Zählweise zählt mehr, nie weniger |
| `noetige_equity <= 0.5` | bei einem Einsatz in einen nicht-leeren Pot |
| `weggeblockt === vorher - nachher` | die Blocker-Rechnung muss aufgehen |
| Blocker nach `bekannte_karten` aufsteigend | sonst zeigt die App Zeilen in falscher Reihenfolge |

### Der Kopf jeder Datei — für Aufgabe 3

Jede Anzeigedatei trägt einen `herkunft`-Block. Der ist nicht Zierde, sondern
die Grundlage von Aufgabe 3 („Warum diese Zahl"):

```
herkunft: {
  methode, erzeugt_am, zweck,
  annahmen: { sicht, unbekannte_karten, split_pot, kartenzahlen, besonderheiten },
  bibliothek: { name, version } | null,
  faelle_enumeriert: null,
  quelle
}
```

Zwei Felder sind heute leer und das ist absichtlich sichtbar:
`bibliothek` ist bei B2 und B3 `null` (dort wird kombinatorisch gerechnet, kein
Evaluator im Spiel — siehe B-002), und `faelle_enumeriert` ist überall `null`,
weil die Rechenergebnisse die Fallzahl nicht mitschreiben (B-003). Beides
gehört in `BLOCKER.md`, nicht in eine ausgedachte Zahl.

### Geprüft

- `src/lib/__tests__/pokermath.test.ts` — 25 Tests, lesen die **echten**
  Dateien aus `public/pokermath/`, nicht erfundene Beispiele. Ein Test prüft
  den exakten Fehlerpfad `b1_outs.outs[7].turn`.
- Gesamtlauf: **424 Tests in 28 Dateien, grün.**
- `npx tsc --noEmit`: sauber.
- `npm run build`: baut durch.

---

## Aufgabe 2 — was jetzt steht

**Der Bildschirm:** `/lernen/drill` → `src/pages/trainers/PotOddsDrill.tsx`.
Erreichbar über eine eigene Karte oben auf der Lernseite.

Eine Situation, eine Entscheidung, die Auflösung. Der Nutzer sieht Hand,
Flop, Topf und Einsatz und entscheidet, ob der Call sich lohnt. Danach steht
die gerechnete Zahl da.

**Die Arbeitsteilung:**

| Datei | Rolle |
|-------|-------|
| `src/lib/potodds/aufgabe.ts` | erzeugt Aufgaben, löst sie, formatiert Zahlen |
| `src/pages/trainers/PotOddsDrill.tsx` | zeigt an — **keine einzige Ziffer** |
| `src/styles/global.css`, Abschnitt „Pot-Odds-Drill" | alle Größen und Abstände |
| `src/i18n/pages/potoddsdrill.ts` | alle Texte, zweisprachig |

**Die Gestaltungsregeln aus dem Auftrag — nachgemessen, nicht geschätzt.**
Gemessen im echten Browser auf 390 × 844 (Handy) und 1280 × 800:

| Regel | Messung |
|-------|---------|
| Ergebniszahl das größte Element | 78 px gegen 19 px für das nächstgrößte |
| in der oberen Hälfte | Oberkante bei 205 px von 844 |
| fetter Schnitt, kein dünner | `font-weight: 800` |
| dunkler Grund, hoher Kontrast | die App ist durchgehend dunkel |
| höchstens zwei Berührungen | Hub → Lernen → Drill; kein Startknopf (Ausnahme: B-006) |
| Bedienung im unteren Drittel | Knöpfe bei 656–716 px, unteres Drittel ab 563 |
| nicht von der Navigation verdeckt | Knopfunterkante 716, Navigation ab 780 |
| keine Bewegung zwischen Antwort und Auflösung | die Lage bewegt sich um **0 px**, der Knopf um **0 px** |
| kein Zeitdruck | kein Timer im Quelltext |
| kein Konto, kein Netz | nur statische Dateien, vom Service Worker mitgespeichert |
| keine Zahl im Quelltext der Oberfläche | von einem Test erzwungen |

**Was dabei aufgefallen und behoben wurde** (alles erst im Browser sichtbar,
kein Test hätte es gefunden):

1. Die Antwortknöpfe lagen hinter der unteren Navigation. Behoben mit einer
   schwebenden Bedienleiste (`position: sticky`) statt einer Höhenrechnung
   aus Kopfleiste, Zurück-Link und Navigationshöhe — die wäre bei der ersten
   Änderung an einem der drei falsch gewesen, und zwar unbemerkt.
2. Der Weiter-Knopf saß 43 px höher als die Antwortknöpfe zuvor. Zwei
   Flächen, die sich teilweise überlappen, laden zum versehentlichen
   Doppeltipp ein. Jetzt sitzen beide auf derselben Linie.
3. Die Begründung verschwand unter der Bedienleiste, mitten im Wort.
4. „8 Outs bis zum Straße" — die Zielkategorie kommt aus den Daten, und keine
   deutsche Präposition passt zu allen. Jetzt: „8 Outs · Ziel: Straße".
5. Dreimal dieselbe Zahl nebeneinander (Topf, sein Einsatz, dein Call). Der
   dritte Wert ist jetzt der Endtopf.

**Nebenbei abgesichert:** Der Service Worker speichert die gerechneten Daten
für den Betrieb ohne Netz mit — und trägt dafür den Datenstand im
Cache-Namen. `npm run daten` trägt ihn automatisch ein. Ohne das würde ein
installiertes Gerät nach neuen Zahlen wochenlang die alten zeigen, und bei
einer Zahl fällt das niemandem auf.

---

## Aufgabe 3 — was jetzt steht

**Die Komponente:** `src/components/Herkunft.tsx`, Texte in
`src/i18n/pages/herkunft.ts`.

Neben jeder gerechneten Zahl steht ein Fragezeichen im Kreis, 26 px, in
gedämpftem Grau. Die Tippfläche darum ist 44 px groß, liegt aber außerhalb
des Sichtbaren und verschiebt deshalb nichts. Wer tippt, bekommt ein Blatt
von unten mit:

| Abschnitt | Woher |
|-----------|-------|
| Wo sie steht | der Feldpfad, z. B. `b1_outs.outs[6].turn_oder_river` |
| Wie gerechnet wurde | `herkunft.methode` und `herkunft.faelle_enumeriert` |
| Wofür der Block gerechnet wurde | `herkunft.zweck`, wörtlich |
| Woraus gerechnet wurde | Sicht, unbekannte Karten, Kartenzahlen, Split-Pötte |
| Was zu beachten ist | jede `besonderheiten[].satz`, wörtlich |
| Womit gerechnet wurde | `herkunft.bibliothek` mit Version |
| Stand | `herkunft.erzeugt_am` und `herkunft.quelle` |

**Es wird nichts nachformuliert.** Die einzige Ausnahme sind zwei Sätze, die
erklären, was „exakt" und „monte-carlo" bedeuten. Sie sagen nichts über einen
konkreten Wert, sondern über das Wort, das in den Daten steht — ohne sie wäre
die Anzeige für den wertlos, für den sie gedacht ist.

**Fehlende Angaben werden benannt, nicht gefüllt.** Wo `faelle_enumeriert`
oder `bibliothek` `null` ist, steht ein Satz in Gold, der genau das sagt. Ein
Test hält das fest: Solange B-002 und B-003 offen sind, **müssen** diese
Felder `null` sein. Stünde da eine Zahl, käme sie nicht aus der Rechnung.

**Der wichtigste Test:** Der Feldpfad wird gegen die echte Datei aufgelöst,
und der Wert dort muss der angezeigte sein — für alle 64 Aufgaben und alle
fünf Zahlen. Eine Herkunftsangabe, die niemand prüft, ist eine Zierde.

**Wo Zeichen stehen und wo nicht:** Neben Outs, Trefferquote, nötiger Equity,
Turn-Wert, Abstand und Mindest-Outs. **Nicht** neben Topf, Einsatz und
Endtopf — die sind der Maßstab der Aufgabe und stehen in keiner Datei. Der
Abstand steht auch in keiner Datei: Ihn bildet die App aus zwei Werten,
deshalb nennt sein Blatt **beide** Quellen, jede mit ihren eigenen Annahmen.

**Warum ein Blatt und keine Ausklappzeile:** Eine Zeile, die sich unter der
Zahl auftut, verschiebt alles darunter — und im Drill darf sich nichts
bewegen. Das Blatt fährt über den Inhalt und kommt von unten, wo der Daumen
ist.

Die Komponente ist nicht an den Drill gebunden. Jeder Bildschirm, der eine
gerechnete Zahl zeigt, kann sie verwenden; bisher tut es nur der Drill.

---

## Aufgabe 4 — was jetzt steht

**Die Adresse:** `src/lib/potodds/adresse.ts`, Route `/lernen/drill/:code`.

Jede Situation hat eine eigene Adresse, und in der Adresse steht die Situation
vollständig drin:

```
#/lernen/drill/2-1-5-npxu
                │ │ │  └── Fingerabdruck der Daten
                │ │ └───── Potfaktor
                │ └─────── Index der Einsatzgröße in b2_potodds
                └───────── Index des Zugbilds in b1_outs
```

Drei Zahlen zur Basis 36 und ein Fingerabdruck. Keine Datenbank, kein Server,
nichts, was ablaufen kann. Absichtlich lesbar: Wer wissen will, was in der
Adresse steht, kann es nachschlagen — das passt zu einer App, deren ganzer
Punkt ist, dass man ihre Zahlen nachprüfen kann.

**Die Adresse führt, nicht der Bildschirm.** „Nächste Aufgabe" setzt eine
neue Adresse; was daraufhin erscheint, liest der Bildschirm wieder aus ihr
heraus. Das ist ein Umweg, und er ist der Grund, warum jeder Link
zuverlässig dieselbe Situation zeigt: Es gibt keinen zweiten Weg, auf dem
eine Aufgabe entstehen könnte. Auch die allererste Aufgabe bekommt sofort
ihre Adresse, damit sie ohne Umweg teilbar ist.

**Der Fingerabdruck ist der eigentliche Kern.** Indizes sind nur so gut wie
die Liste, in die sie zeigen. Käme ein neuntes Zugbild an dritter Stelle
dazu, zeigte jeder alte Link ab dort auf eine andere Hand — und niemand
würde es merken. Deshalb steht in der Adresse ein Fingerabdruck über **genau
das, worauf die Indizes zeigen**: die Hände und Flops der Zugbilder, die
Brüche der Einsatzgrößen. Vier Tests halten das fest:

| Was sich ändert | Was mit alten Links passiert |
|-----------------|------------------------------|
| eine gerechnete Zahl, ein neuer Zeitstempel | bleiben gültig |
| ein Zugbild kommt dazu | werden abgelehnt |
| die Reihenfolge der Zugbilder wechselt | werden abgelehnt |
| eine Einsatzgröße kommt dazu | werden abgelehnt |

Abgelehnt heißt: ein Hinweis, kein stiller Austausch der Hand. Dazu ein
Knopf, der eine neue Aufgabe holt.

**Teilen:** ein Knopf unten rechts in der Bedienleiste. Wo das Gerät es kann,
öffnet er den Teilen-Dialog des Systems; sonst kopiert er den Link und sagt
es. Geprüft im Browser: Der kopierte Link öffnet in einer frischen Sitzung
dieselbe Aufgabe.

**Vorschaukarte.** Ein geteilter Link erscheint in WhatsApp und Discord als
Karte — mit Titel, Beschreibung, Bild (1200 × 630), Sprache und
Bildbeschreibung. Eine Karte, die *die geteilte Aufgabe* zeigt, gibt es
nicht: Das Fragment einer Adresse wird beim Abruf nicht mitgeschickt, ein
Vorschaudienst sieht also immer nur `index.html`. Das ist kein Versäumnis,
sondern das Protokoll. Die Wege dahin und ihr Preis stehen in **B-007**.

---

## Was als Nächstes zu tun ist

**1. Auf B4 warten und dann anschließen.** Der Lauf braucht noch etwa vier
Stunden (Stand 19:10 Uhr: 1152 von 14 365, rund 1,1 s je Handpaar). Danach
liegt `output/b4_preflop_equity.json` bereit, und es fehlt nur der
`appB4`-Block im Konverter, damit die Matrix in `public/pokermath/` landet.
Der Zuschnitt ist schon entschieden (K3): je Handpaar der gewichtete Wert,
die Spanne und das Kennzeichen — die einzelnen Farbkonfigurationen **nur**
dort, wo die Spanne über einen Prozentpunkt liegt.

**2. Die Herkunftsanzeige ausweiten.** `Herkunft.tsx` ist nicht an den Drill
gebunden. Jede andere Seite, die eine gerechnete Zahl zeigt — die
Odds-Tabellen, der Starthand-Explorer, der Equity-Rechner — könnte sie
verwenden. Bisher tut es nur der Drill.

**3. Die Befunde anzeigen.** Sie liegen zweisprachig in den App-Daten und
werden nirgends gezeigt. Ein Satz wie „Bis 6 Outs verspricht die 2/4-Regel zu
wenig, ab 7 Outs zu viel" ist genau das, was diese App von einer
Odds-Tabelle unterscheidet.

---

## Was ein Mensch entscheiden muss

Ein Punkt, `BLOCKER.md`, **B-007**: Eine Vorschaukarte je geteilter Aufgabe
ist ohne Server nicht möglich — das Fragment einer Adresse wird beim Abruf
nicht mitgeschickt. Die allgemeine Karte funktioniert. Zu entscheiden ist, ob
sie reicht oder ob 64 vorab erzeugte Seiten den Umbau von `HashRouter` auf
`BrowserRouter` wert sind.

Alles andere ist erledigt und in `BLOCKER.md` mit Begründung nachgehalten.

---
---


---
---

# Vorgeschichte — Stand vor diesem Arbeitsbereich

*Unverändert übernommen aus dem Branch `feature/poker-math`. Beschreibt die
Phasen 1–3 und die Scope-Korrektur.*


**Zweck:** Diese Datei ist so geschrieben, dass eine frische Sitzung ohne
jeden Kontext hier weiterarbeiten kann. Wer neu dazukommt, liest **nur diese
Datei** und weiß, wo es steht.

- **Branch:** `feature/payments-und-hub`
- **Abgezweigt von:** `claude/poker-learning-app-concept-ml0xm6` @ `eb7899b`
- **Letzte Aktualisierung:** 2026-08-26, nach der Scope-Korrektur
- **Veröffentlicht:** ja. `feature/payments-und-hub` wurde ohne Umweg
  (Fast-Forward) nach `claude/poker-learning-app-concept-ml0xm6` gezogen und
  gepusht; der Workflow „Test & Deploy" ist bei `c4989bb` grün durchgelaufen.
  Die Live-App zeigt also den Stand dieser Sitzung.
- **Stand in einem Satz:** Alle drei Arbeitspakete sind abgeschlossen,
  committet, gepusht und ausgeliefert. Offen ist nur noch, was ein Mensch, ein
  Konto oder eine Geschäftsentscheidung braucht — gesammelt in
  `docs/TODO_MANUELL.md`.

---

## Worum es ging

Drei Arbeitspakete, strikt nacheinander:

1. **Phase 1 — Zahlungen & Architektur** ✅ *fertig, Gate 1 erfüllt*
2. **Phase 2 — Informationsarchitektur & Design** ✅ *fertig, Gate 2 erfüllt*
3. **Phase 3 — Qualitätsdurchlauf** ✅ *fertig*

Danach kam eine **Scope-Korrektur** (E-009 bis E-011):

4. **Kein aktiver Bezahl-Layer** ✅ — alle Features frei, per Schalter statt
   Rückbau. Die Architektur aus Phase 1 bleibt vollständig stehen.
5. **Hub endgültig: Lernen · Nachschlagen · Live-Session** ✅ — kein vierter
   Einstieg.
6. **Phase 4 beschnitten** 📌 *festgehalten, nicht begonnen* — Modus B und die
   Multiplayer-Vorbereitung sind gestrichen. Der Auftrag für die verbleibenden
   Punkte 4.1–4.6 liegt mir im Wortlaut **nicht** vor; E-010 hält nur fest,
   was **nicht** gebaut wird.

---

## Das Wichtigste zuerst

**Die App ist ein statisches Frontend ohne Server.** PWA auf GitHub Pages,
Firebase nur für Konten und Datenbank. Alles, was „serverseitig" heißen soll,
muss als Cloud Function gebaut werden — und die sind derzeit **nicht
deploybar** (Blaze-Tarif fehlt, siehe `BLOCKER.md` B-001). Deshalb: Code
vollständig gebaut, gegen den **Emulator** geprüft, Deploy auf später.

**Kein Feature ist kostenpflichtig.** Der Schalter dafür ist ein einziger
Wert: `"enabled": false` in `public/monetization.json`. Solange er steht,
liefert `checkAccess()` für jedes Feature `allowed` und `usePro().fullAccess`
ist wahr. Ein Test liest die ausgelieferte Datei und würde rot, wenn das
kippt (`src/lib/__tests__/allesFrei.test.ts`).

Die Zahlungsarchitektur aus Phase 1 bleibt vollständig erhalten und wird
später gebraucht — sie ist nur ausgeschaltet, nicht ausgebaut.

---

## Fertig (mit Commit-Hashes)

| Commit | Was | Tests |
|---|---|---:|
| `eb7899b` | *(Vorgänger-Branch)* Spielstil-Kennzahlen: Bibliothek + Erfassung am Übungstisch | 244 |
| `7598f54` | Phase 1.1: Bestandsaufnahme, Betriebsdateien, Schlüssel-Prüfung der Historie | 244 |
| `a5f75da` | Phase 1.2: Provider-Abstraktion (Vertrag, Mock, Stripe, StoreKit-Gerüst) | 270 |
| `93bb97c` | Phase 1.3: Entitlement-Service — Statusmaschine, Regeln umgezogen | 313 |
| `3624b84` | Phase 1.4: Apple-Signaturprüfung, Ereignis-Übersetzung, Adapter | 357 |
| `17bd681` | Phase 1.5 + 1.6: Secrets, `SETUP_PAYMENTS.md`, Checkout ohne URL im Bundle → **Gate 1** | 357 |
| `5ccd621` | Phase 2: Hub-Screen, Bereichsstruktur, Design-Tokens, Spielstil-Analyse → **Gate 2** | 357 |
| `62b5357` | Phase 3: Token-Audit, Erreichbarkeit, PWA, Gating-Test, toter Code | 365 |
| `c166a37` | Commit-Hash der dritten Phase nachgetragen | 365 |
| `c4989bb` | CSP: Google-Anmeldung war blockiert; Konfigurationsdateien ausgeliefert | 376 |
| `9f560f0` · `9d9e828` | Veröffentlichung, Konto-Verknüpfung iOS ↔ Web | 376 |
| `c5aecc7` | Zentraler Zugriffsschalter `fullAccess`, alles frei (E-009) | 385 |
| `21537ee` | Hub endgültig: Lernen · Nachschlagen · Live-Session (E-011) | **399** |

Zusammenfassung der ganzen Sitzung: **`SESSION_REPORT.md`**.

---

## Exakt nächster Schritt

**Auf eine Entscheidung wartend, nicht auf Arbeit.**

Die größte offene Frage steht als Nr. 1 in `docs/TODO_MANUELL.md`: Ob die
Begründung, mit der Modus B und die Multiplayer-Vorbereitung gestrichen
wurden (Altersfreigabe bei simulierten Pokertischen), auch für den bereits
gebauten **Übungstisch**, den **Pokerabend-Tisch** und den **Online-Tisch**
gelten soll. Ich habe nichts davon entfernt — gestrichen war ausdrücklich die
*Vorbereitung*, nicht der Bestand. Fällt die Entscheidung gegen sie, braucht
die Spielstil-Analyse eine neue Datenquelle.

**Falls Phase 4 beginnen soll:** Der Auftrag für 4.1 bis 4.6 liegt mir nicht
vor. Bekannt ist nur, was gestrichen ist (E-010) und dass 4.5 ein
**Szenario-Drill** wird: eine Situation, eine Entscheidung, eine Auflösung —
keine Chip-Ökonomie, kein Spielgeld-Guthaben, keine Sitzung über mehrere
Hände mit Stackverlauf.

**Was ohne Entscheidung weitergehen könnte**, in dieser Reihenfolge:

- **Freunde-Rangliste** (`docs/TODO_MANUELL.md` Nr. 13) — die Freundesliste
  steht bereits; nötig ist ein Dokument `stats/{uid}` mit Name und XP, das nur
  Freunde lesen dürfen, plus Regeln **und** Regeltests
- **Off-Scale-Abstände bildschirmweise** (Nr. 11) — Liste in
  `docs/TOKEN_AUDIT.md` Abschnitt 3. **Nicht** per Suchen-und-Ersetzen
- **Auszahlungs-Rechner erweitern** — Deals und ICM fehlen bewusst; für ein
  Heimspiel ist beides Overkill, für einen ernsteren Turnierabend nicht

## Dateien gerade in Arbeit

**Keine.** Der Baum ist sauber, alles ist committet und gepusht.

Neu angelegt in der Scope-Korrektur:
- `src/pages/ReferencePage.tsx`, `src/pages/SessionPage.tsx` — die zwei neuen
  Bereichsseiten (ersetzen `LivePage` und `ToolsHub`)
- `src/pages/session/PayoutPage.tsx` + `src/lib/poker/payout.ts` + Test —
  der Auszahlungs-Rechner, den es noch nicht gab (14 Tests)
- `src/lib/__tests__/allesFrei.test.ts` — der Beweis, dass alles frei ist
- `BackLink` in `src/components/ui` — der strukturelle Rückweg als eigene
  Komponente, weil elf Seiten gar keinen hatten

Neu angelegt in Phase 3 und danach:
- `src/lib/csp.ts` + Test — die Sicherheitsrichtlinie, jetzt geprüft
- `public/monetization.json`, `public/legal.json` — ausdrücklich aus bzw. leer
- `src/lib/pro/trialAnchor.ts` + Test — schließt die gefundene Gating-Lücke
- `docs/TOKEN_AUDIT.md` — was umgestellt wurde und was bewusst nicht
- `docs/ERREICHBARKEIT.md` — jeder Bildschirm, Weg und Rückweg
- `docs/TODO_MANUELL.md` — was ein Mensch entscheiden muss
- `SESSION_REPORT.md` — Bericht über alle drei Phasen

Entfernt (durch den Hub ersetzt, nichts ging verloren):
- `src/pages/Dashboard.tsx`, `src/i18n/pages/dashboard.ts`

---

## Offene Punkte

| # | Was | Wann | Stand |
|---|---|---|---|
| O-1 | `enabled/pro/trialActive` zu `hasAccess(feature)` zusammenfassen | Phase 2 | ✅ erledigt: `can()` / `checkAccess()` in `src/lib/pro/plan.ts`, Screens rufen nur noch das |
| O-2 | Statistik-Seite zur Spielstil-Analyse | Phase 2 | ✅ erledigt: `src/pages/StatsPage.tsx` unter `/live/statistik` |
| O-3 | `customers/{uid}` → `entitlements/{uid}` umziehen | Phase 1.3 | ✅ erledigt, 29 Regeltests gegen den Emulator |
| O-4 | Spielstil-Erfassung fehlt am Online-Tisch (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden kann) | später | offen, bewusst — `docs/TODO_MANUELL.md` Nr. 12 |
| O-5 | **Zahlungs-Texte müssen im iOS-Build anders lauten.** `src/i18n/pages/pro.ts` nennt „Über Stripe – mit Apple Pay, Google Pay, Kreditkarte, PayPal oder SEPA". In der iOS-App ist das (a) falsch, weil dort StoreKit zahlt, und (b) ein Verstoß gegen Richtlinie 3.1.1 | vor dem ersten iOS-Build, **zwingend** | offen — `docs/TODO_MANUELL.md` Nr. 5 |
| O-6 | Testphase serverseitig führen | wenn Cloud Functions laufen | offen — lokal gegen einfaches Zurücksetzen abgesichert (`trialAnchor.ts`), siehe Risiko 5 |

---

## Bekannte Risiken

1. **Die Paywall schützt den Status, nicht die Inhalte.** Lerninhalte liegen im
   JavaScript-Bundle und sind auslesbar. Bewusste Entscheidung (`ENTSCHEIDUNGEN.md`
   E-003), kein Versehen. Wer später hochpreisige Inhalte verkauft, muss sie neu
   treffen.
2. **Der Apple-Weg ist ungetestet gegen echte Apple-Server.** Die
   Signaturprüfung läuft gegen selbst erzeugte Testschlüssel — die Logik stimmt
   dann, aber echte Apple-Schlüssel und -Formate hat noch nie jemand
   dagegengehalten (B-002). Der hinterlegte Root-Fingerabdruck ist ungeprüft
   (`docs/TODO_MANUELL.md` Nr. 3).
3. **Eine PWA kann StoreKit nicht aufrufen.** Der iOS-Weg setzt eine native
   Hülle voraus, die es noch nicht gibt. Der Code ist darauf vorbereitet, aber
   der Weg endet heute in der Hülle.
4. **Preisgestaltung iOS ≠ Web.** Apple behält 15–30 %. Wer beide Wege gleich
   bepreist, verdient auf iOS deutlich weniger. Zahlen in `SETUP_PAYMENTS.md`,
   Empfehlung in `docs/TODO_MANUELL.md` Nr. 8.
5. **Die Testphase läuft lokal.** Wer den *gesamten* Browser-Speicher löscht,
   bekommt eine neue — und verliert dabei allen Lernfortschritt. Das bloße
   Zurücksetzen des Datums wirkt nicht mehr (`src/lib/pro/trialAnchor.ts`,
   8 Tests, im Browser gegengeprüft). Für ein 5-€-Abo ist die Hürde angemessen.
6. **Cloud Functions sind nicht deployt.** Ohne sie gibt es keine Webhooks und
   damit keine echten Abo-Status. Alles davon ist gebaut und gegen den Emulator
   geprüft, aber nichts davon läuft (`BLOCKER.md` B-001).

---

## Wie man hier weiterarbeitet

```bash
git checkout feature/payments-und-hub
npm install
npm test            # 376 Unit-Tests, braucht nichts weiter
npm run test:rules  # 29 Firestore-Regeltests gegen den Emulator (braucht Java)
npx tsc --noEmit    # Typecheck inkl. functions/src
npm run build       # muss fehlerfrei durchlaufen
npm audit           # muss 0 Schwachstellen melden
```

Befehle, die ein Mensch selbst ausführen muss (Konten, Schlüssel, Deploy),
stehen gesammelt in `RUNME.sh` — nichts davon läuft automatisch.

---

## Landkarte der Dokumente

| Datei | Inhalt |
|---|---|
| `STATUS.md` | *diese Datei* — Stand, nächster Schritt, offene Punkte, Risiken |
| `SESSION_REPORT.md` | Bericht über alle drei Phasen |
| `ENTSCHEIDUNGEN.md` | Jede Entscheidung ohne Rückfrage, mit verworfener Alternative |
| `BLOCKER.md` | Was aufhält und welche Wege es gibt |
| `RUNME.sh` | Befehle für Konten, Schlüssel, Deploy |
| `SETUP_PAYMENTS.md` | Zahlungen ab Oktober, Schritt für Schritt |
| `docs/TODO_MANUELL.md` | Was ein Mensch entscheiden oder prüfen muss |
| `docs/BESTANDSAUFNAHME.md` | Zahlungs-/Gating-Stellen vor dem Umbau |
| `docs/STATUSMASCHINE.md` | Alle Abo-Zustände und Übergänge, dazu die Konto-Verknüpfung iOS ↔ Web |
| `docs/DESIGN_REFERENZ.md` | Auswertung der Referenz-App |
| `docs/SCREEN_STRUKTUR.md` | Navigation vorher/nachher |
| `docs/ERREICHBARKEIT.md` | Jeder Bildschirm, Weg und Rückweg |
| `docs/TOKEN_AUDIT.md` | Farb- und Pixelwerte, was umgestellt wurde |
| `tools/poker-math/STATUS.md` | Eigenes Arbeitspaket auf `feature/poker-math`: Generator für alle Zahlen der App |
