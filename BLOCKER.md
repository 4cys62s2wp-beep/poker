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
