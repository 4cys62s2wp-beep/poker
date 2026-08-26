# Blocker

Was aufhält, und was ich stattdessen getan habe. Nach der Vorgabe: eintragen
und mit dem nächsten Punkt weiter, nicht stehenbleiben.

---

## B-001 · Der B4-Lauf ist gestorben, und dabei sind Daten verloren gegangen

**Was ist**: Der Hintergrundlauf für B4 lief nicht mehr, als ich diese Sitzung
begann. Letzter Eintrag im Log um 09:51:48 bei 390 von 14 365 Handpaaren, dann
nichts mehr. Kein Python-Prozess auf der Maschine, CPU zu 97 % im Leerlauf.

**Warum er starb**: Vermutlich mit dem Ende der vorigen Sitzung. `nohup` hat
ihn nicht geschützt — die Prozessgruppe wurde mit abgeräumt.

**Der Datenverlust, und der ist mein Fehler**: Der Lauf schrieb nach
`matchups.live.jsonl`. Mein `--sichern` **löscht** diese Datei, nachdem es sie
übernommen hat. Ich habe es um 09:46:29 ausgeführt, während der Lauf noch
lief. Unter Linux bleibt eine gelöschte, aber geöffnete Datei für den Schreiber
bestehen — sie ist nur aus dem Verzeichnis verschwunden. Der Prozess schrieb
also weiter in eine Datei, die niemand mehr öffnen kann, und als er starb, war
alles darin weg.

**Verloren**: die Handpaare zwischen 270 (gesichert) und 390 (laut Log
gerechnet). Rund 120 Einheiten, etwa 15 Minuten Rechenzeit.

**Der Fehler im Code**: `sichere()` in `tools/poker-math/src/b4_preflop_equity.py`
ruft `LAUFDATEI.unlink()`. Das darf es nicht, solange ein Lauf schreiben kann.
Die Datei nicht zu löschen wäre unproblematisch: `alle_ergebnisse()` liest
beide Dateien in ein Wörterbuch, Dopplungen fallen von selbst weg.

**Warum ich es nicht behoben habe**: Die Vorgabe für diesen Arbeitsbereich
lautet, `tools/poker-math/` nicht zu beschreiben. Der Einzeiler wartet.

**Was zu entscheiden ist**: Ob der Lauf neu gestartet wird und wie. Bei
gemessener Parallelität von 2,78× auf drei Kernen und rund 2,3 s je
Farbkonfiguration sind es etwa **12 Stunden** — mehr, als eine Sitzung lebt.

---

## B-002 · B2 und B3 nennen keine Evaluator-Bibliothek

**Was ist**: Aufgabe 3 verlangt, dass die Oberfläche „welche Bibliothek in
welcher Version" zeigt. In `b1_outs.json` steht das (`eval7 0.1.11`), in
`b2_potodds.json` und `b3_kombinatorik.json` nicht.

**Warum**: Der Generator setzt dort `braucht_evaluator=False`. Sachlich ist das
richtig — Pot Odds sind Bruchrechnung, Kombinatorik ist Abzählen. Für beides
braucht es keinen Hand-Evaluator.

**Was ich getan habe**: Das Feld steht als `bibliothek: null` in der App-Fassung.
Die Oberfläche **sagt das offen** („keine nötig — reine Rechnung"), statt die
Zeile wegzulassen. Eine fehlende Angabe ist selbst eine Auskunft.

**Was zu tun wäre**: Nichts, sofern die Erklärung reicht. Wer es einheitlich
will, ergänzt im Generator einen Vermerk `evaluator: {name: null, grund: "..."}`.

---

## B-003 · Keine Ausgabe nennt eine Fallzahl

**Was ist**: Aufgabe 3 verlangt „wie viele Fälle enumeriert wurden". Keine der
drei Ausgabedateien enthält eine solche Zahl. Die Metadaten beschreiben das
Verfahren („alle geordneten Paare (Turn, River)"), nennen aber keinen Wert.

**Was ich NICHT getan habe**: Sie ausrechnen. Für B1 wäre es
`unbekannt_nach_flop × unbekannt_nach_turn`, und die beiden Zahlen stehen in
den Metadaten — aber das selbst zu rechnen ist genau das, was die Vorgabe V3
ausschließt. Eine Zahl, die die App anzeigt und die ich nebenbei ausgerechnet
habe, wäre der Fehler, den dieser ganze Ordner verhindern soll.

**Was ich getan habe**: `faelle_enumeriert: null` in der App-Fassung, und die
Oberfläche schreibt dort ausdrücklich, dass die Angabe fehlt.

**Was zu tun wäre**: Im Generator je Block ein Feld `faelle_enumeriert`
ergänzen — B1 zählt die Paare ohnehin durch, B3 die Kombos. Ein paar Zeilen,
sobald `tools/poker-math/` wieder beschreibbar ist.

---

## B-004 · Zwei Konvertierungsskripte

**Was ist**: `tools/poker-math/src/app_schnittstelle.py` erzeugt die App-Fassung
in Vertragsversion 1. Dieses Arbeitspaket verlangte ein Konvertierungsskript;
weil ich `tools/poker-math/` nicht beschreiben darf, liegt es jetzt unter
`scripts/pokermath-app-daten.mjs` und erzeugt Version 2.

**Die Gefahr**: Zwei Skripte, die dieselbe Datei schreiben, driften
auseinander. Wer das Python-Skript ausführt, überschreibt die neueren Dateien
mit älteren — und die App wirft dann beim Laden, weil die Vertragsversion nicht
passt. Immerhin laut und nicht still.

**Was zu tun ist**: `app_schnittstelle.py` entfernen, sobald
`tools/poker-math/` wieder beschreibbar ist. Das Node-Skript kann alles, was
es konnte, und mehr.

---

## B-005 · Die gerechneten Daten gibt es nur auf Deutsch

**Was fehlt.** Die Dateien unter `public/pokermath/` tragen ihre Texte nur in
einer Sprache: Zugbildnamen („Offene Straße", „Gutshot"), Zielkategorien
(„Straße", „Full House"), Einsatznamen („Halber Pot") und sämtliche Befunde
und Annahmen sind deutsch.

**Was das heißt.** Wer die App auf Englisch stellt, bekommt im Pot-Odds-Drill
englische Beschriftungen um deutsche Begriffe herum: „4 outs · target:
Straße". Die Zahlen stimmen, die Sprache nicht.

**Warum ich es nicht behoben habe.** Eine Übersetzungstabelle in der App wäre
genau die Schicht, die dieses Projekt vermeidet: Sie bildet Datenwerte auf
Anzeigetexte ab, und beim nächsten neuen Zugbild fehlt der Eintrag, ohne dass
es auffällt. Richtig wäre, dass der Rechengenerator die Bezeichnungen
zweisprachig ausgibt — das ist eine Änderung an `tools/poker-math/`, und
dieser Arbeitsbereich darf dort nicht schreiben.

**Was zu entscheiden ist.** Ob der Generator zweisprachige Bezeichnungen
mitliefern soll (sauber, aber Arbeit im Generator) oder ob die englische
Fassung der App vorerst deutsche Fachbegriffe zeigt (in Kauf zu nehmen: Es
sind Pokerbegriffe, von denen mehrere ohnehin englisch sind).

---

## B-006 · Beim allerersten Start sind es drei Berührungen, nicht zwei

**Was gefordert war.** Höchstens zwei Berührungen vom Öffnen bis zur ersten
Aufgabe.

**Was ist.** Erfüllt — ab dem zweiten Start: Hub → Lernen → Drill, und die
Aufgabe steht sofort da, ohne Startknopf. Beim **allerersten** Start liegt
davor der Willkommensdialog (Sprache wählen, Name eintragen). Das kostet
mindestens eine weitere Berührung.

**Warum ich es nicht angefasst habe.** Der Dialog gehört nicht zum Drill,
sondern zur ganzen App, und er hat einen Zweck (Sprachwahl). Ihn für einen
Bildschirm zu umgehen, hieße, ihn für alle anderen zu behalten — eine
Sonderregel, die niemand mehr versteht.

**Was zu entscheiden ist.** Ob der Willkommensdialog übersprungen werden darf,
wenn jemand die App über einen geteilten Link direkt auf einer Aufgabe öffnet
(Aufgabe 4). Dort wäre er besonders störend: Man will die geteilte Aufgabe
sehen, nicht einen Namen eintragen.

---

## B-007 · Eine Vorschaukarte je Aufgabe braucht einen Server

**Was gefordert war.** Ein geteilter Link soll in WhatsApp und Discord als
Karte erscheinen.

**Was geht.** Er tut es. Jeder geteilte Link zeigt die PokerMentor-Karte:
Titel, Beschreibung, Bild (`public/og.png`, 1200 × 630), Sprache und
Bildbeschreibung stehen in `index.html`.

**Was nicht geht.** Eine Karte, die *die geteilte Aufgabe* zeigt — also „Ah 7h
auf Kh 4h 2c, er setzt Potgröße". Der Grund ist kein Versäumnis, sondern das
Protokoll: Die Aufgabe steht im Fragment der Adresse
(`#/lernen/drill/2-1-5-npxu`), und ein Fragment wird beim Abruf **nicht an
den Server geschickt**. Ein Vorschaudienst sieht also immer nur `index.html`
und kann nicht wissen, welche Aufgabe gemeint war.

Ohne Fragment wäre es genauso: Bei einer Einzelseiten-App liefert der Server
für jede Adresse dieselbe `index.html`. Eine eigene Karte je Aufgabe
verlangt, dass **beim Abruf** jemand die Adresse auswertet.

**Die Wege dahin, mit Preis.**

| Weg | Was er kostet |
|-----|---------------|
| Eine kleine Funktion beim Hoster (Netlify/Vercel/Cloudflare), die für Anfragen von Vorschaudiensten eigene Metadaten ausliefert | Ein Server. Der Auftrag sagt ausdrücklich: keiner. |
| Alle Aufgaben vorab als statische Seiten erzeugen | Es gibt 2864 Zustände (nachgezählt, nicht geschätzt: `zaehleZustaende` im Test). Technisch machbar, aber eine absurde Menge Seiten für einen Vorschautext. |
| Nur die Zugbild-Einsatz-Paare vorab erzeugen, ohne Potgröße | 64 Seiten. Die Karte zeigte die Hand und die Einsatzgröße, nicht den genauen Topf. Braucht `BrowserRouter` statt `HashRouter` — eine Änderung an der ganzen App. |

**Was zu entscheiden ist.** Ob die eine Karte für alle Aufgaben reicht (dann
ist nichts zu tun) oder ob die 64 vorab erzeugten Seiten den Umbau auf
`BrowserRouter` wert sind.
