# Blocker

Was mich aufgehalten hat. Jeder Eintrag steht hier, weil ich ihn **nicht**
selbst geradebiegen wollte, ohne dass es jemand mitbekommt — entweder weil
eine Entscheidung dranhängt oder weil der saubere Weg woanders lag.

Erledigte Punkte werden nicht gelöscht. Wer wissen will, warum eine Sache so
gebaut ist, wie sie gebaut ist, findet den Grund hier und nicht in einem
Commit-Titel.

---

# Offen

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

---

# Erledigt

## B-001 · Der B4-Lauf ist gestorben, und dabei sind Daten verloren gegangen ✅

**Was war.** `--sichern` hat die Laufdatei nach dem Übernehmen gelöscht,
während der Rechenlauf sie noch offen hatte. Unter Linux bleibt eine
geöffnete Datei für den schreibenden Prozess am Leben, aber sie hat keinen
Namen mehr — der Lauf schrieb also weiter in etwas, das niemand mehr finden
konnte. Als er starb, waren rund 120 gerechnete Handpaare weg. Mein Fehler,
und kein Zufall: Ich hatte `--sichern` selbst ausgeführt, während der Lauf
noch lief.

**Was jetzt gilt.**

- Jede Laufdatei gehört genau einem Prozess und trägt seine Nummer im Namen.
- Gelesen werden alle Laufdateien, gelöscht wird nur, was einem Prozess
  gehört, den es nicht mehr gibt (`os.kill(pid, 0)`; im Zweifel behalten).
- Der gesicherte Stand wird **atomar** geschrieben: erst in eine Nebendatei,
  dann umbenannt. Die alte Fassung schnitt ihn mit `open("w")` ab, bevor sie
  ihn neu schrieb — ein Abbruch in dieser Sekunde hätte alles gelöscht, was
  je gerechnet wurde. Das war der zweite, größere Fehler, und der ist nie
  eingetreten.
- Der Lauf sichert selbst alle 250 Handpaare. Ein Abbruch kostet damit
  Minuten statt Stunden.

Vier Tests in `tools/poker-math/tests/test_b4_preflop.py` halten genau die
Eigenschaften fest, deren Fehlen den Verlust verursacht hat.

**Der Lauf ist neu gestartet** und rechnet auf allen vier Kernen weiter —
etwa 1,1 s je Handpaar statt 2,8 s vorher, weil dem Hauptprozess kein Kern
mehr freigehalten wird: Er rechnet nicht, er schreibt nur.

---

## B-002 · B2 und B3 nannten keine Evaluator-Bibliothek ✅

**Was war.** Beide Blöcke ließen das Feld leer, weil sie keine Bibliothek
brauchen. Ein leeres Feld sieht aber aus wie ein Versäumnis, und die
Oberfläche musste sich selbst einen Satz dazu ausdenken — genau das, was
dieses Projekt nirgends tun will.

**Was jetzt gilt.** Jeder Block gibt an, womit gerechnet wurde: entweder eine
Bibliothek samt Version und Korrektheitsnachweis, oder — über
`ohne_evaluator(...)` — den Grund, warum keine nötig war, in beiden Sprachen.
Der Metadatenblock wirft, wenn beides fehlt. Die App gibt den Satz weiter,
statt einen zu formulieren.

---

## B-003 · Keine Ausgabe nannte eine Fallzahl ✅

**Was war.** Die Herkunftsanzeige verspricht die Auskunft, über wie viele
Fälle gerechnet wurde. Die Daten lieferten sie nicht.

**Was jetzt gilt.** Jeder Block meldet seine Zählstellen einmal an — mit Namen
in beiden Sprachen — und zählt beim Rechnen mit. Die Zahl ist damit eine
Beobachtung am laufenden Code und keine Herleitung aus einer Formel. Der
Metadatenblock verlangt sie; ein Block ohne Zählung kommt nicht durch.

Die Aufschlüsselung wandert bis in die App: Wer im Drill auf das Fragezeichen
tippt, sieht nicht nur „67.863 Fälle", sondern woraus sie bestehen.

---

## B-004 · Zwei Konvertierungsskripte ✅

**Was war.** `tools/poker-math/src/app_schnittstelle.py` und
`scripts/pokermath-app-daten.mjs` taten dasselbe in zwei Sprachen. Wer ein
Feld ergänzt, ergänzt es in einem von beiden — und ab dann hängt es davon ab,
wer zuletzt gelaufen ist.

**Was jetzt gilt.** Das Python-Skript ist weg, `output/app/` als zweite Kopie
der Dateien ebenfalls. Geblieben ist das Node-Skript (`npm run daten`), weil
die App es beim Bauen ohnehin aufruft und weil es drei Dinge tut, die das
andere nicht tat: jedes Feld über eine Prüfung mit Pfadangabe holen, erst
schreiben, wenn **alle** Blöcke vollständig gebaut sind, und den Datenstand
in den Service Worker eintragen. Ein Hinweis liegt an der alten Stelle:
`src/APP_SCHNITTSTELLE_ENTFERNT.md`.

---

## B-005 · Die gerechneten Daten gab es nur auf Deutsch ✅

**Was war.** Auf Englisch stand „4 outs · target: Straße". Die Zahlen
stimmten, die Sprache nicht.

**Was jetzt gilt.** Jeder Text, den die App anzeigen kann, ist ein Paar aus
deutscher und englischer Fassung — Zweck, Annahmen, Besonderheiten,
Zugbildnamen, Zielkategorien, Einsatzgrößen, Gegenbeispiele, Namen der
Zählstellen und alle Befunde. Erzeugt werden beide dort, wo auch die Zahl
entsteht.

Eine Übersetzungstabelle in der Oberfläche wäre der naheliegende Weg gewesen
und der falsche: Sie ist genau die Stelle, an der beim nächsten neuen Zugbild
der Eintrag fehlt, und das sieht nur, wer die App auf Englisch benutzt.

Drei Tests halten es fest: die Form (kein anzeigbares Feld ohne beide
Sprachen), die Zahlen (beide Fassungen eines Befundes müssen dieselben Zahlen
nennen) und das Laden (eine nackte Zeichenkette wird abgelehnt, nicht
durchgereicht).

---

## B-006 · Beim allerersten Start waren es drei Berührungen ✅

**Was war.** Vor der ersten Aufgabe lag der Willkommensdialog.

**Was jetzt gilt.** Wer über einen geteilten Link auf einer Aufgabe landet,
sieht die Aufgabe. Der Dialog ist damit nicht abgeschafft, sondern
aufgeschoben: `firstRun` bleibt gesetzt, und sobald jemand von der geteilten
Aufgabe weiter in die App geht, kommt er. Im Browser nachgemessen — beides.

Der Weg über den Hub bleibt bei zwei Berührungen: Hub → Lernen → Drill, und
die Aufgabe steht sofort da.
