# Erreichbarkeit

Jeder Bildschirm, sein Weg vom Hub und sein Rückweg.

**Geprüft im echten Browser bei 390 × 844 px**, nicht am Quelltext: Ein Skript
öffnet jede Seite, liest **alle sichtbaren Links im Inhaltsbereich** aus und
klickt sie an. Lauf vom 26.08.2026, Chromium.

---

## 0. Korrektur einer früheren Fassung

Die Fassung dieser Datei vom selben Tag behauptete für mehrere Seiten eine
Erreichbarkeit, die es nicht gab. Sie war am **Quelltext** und an der
**Seitenleiste** geprüft — und die Seitenleiste ist unter 920 px ausgeblendet.

Der neue Durchlauf, der pro Seite die sichtbaren Links im Inhalt ausliest,
fand **elf Seiten ohne Rückweg** und **sieben Ziele, die auf dem Handy
überhaupt nicht erreichbar waren**:

| Seite | behauptet | tatsächlich (Handy) |
|---|---|---|
| Trainer-Übersicht | „über Lernpfad, Seitenleiste" | gar nicht — der Lernpfad verlinkte sie nie |
| Wiederholen | „über Seitenleiste, Hub-Quick-Access" | nur wenn zufällig Karten fällig waren |
| Übungstisch, Spielstil-Analyse | über den Live-Bereich | nach dem Umbau gar nicht mehr |
| Freunde | „über Profil, Seitenleiste" | gar nicht — das Profil verlinkte sie nie |
| Rechtliches | „Fußzeile der Seitenleiste" | gar nicht |

Alles davon ist behoben. Die Lehre steckt in der Methode: Eine
Erreichbarkeits­tabelle, die am Quelltext entsteht, prüft die Absicht des
Entwicklers, nicht das Gerät des Nutzers.

---

## 1. Die drei Bereiche

Getrennt wird nach **Absicht**, nicht nach Thema (`ENTSCHEIDUNGEN.md`, E-011):

| Bereich | Merkmal |
|---|---|
| **Lernen** `/lernen` | Es gibt einen Fortschritt |
| **Nachschlagen** `/nachschlagen` | Es gibt keinen — man will eine Antwort |
| **Live-Session** `/session` | Man sitzt am echten Tisch |

---

## 2. Vollständige Tabelle

| Bildschirm | Pfad | erreichbar über | Tiefe | Rückweg |
|---|---|---|:---:|---|
| **Hub** | `/` | Leiste „Start" | 0 | — |
| **Lernen** | `/lernen` | Hub-Karte 1, Leiste | 1 | ← Start |
| Modulübersicht | `/lernen/:m` | Lernpfad | 2 | ← Lernen |
| Lektion | `/lernen/:m/:l` | Modulübersicht, Quick Access | 3 | ← Modul |
| Trainer-Übersicht | `/lernen/trainer` | **Lernen (Übungsblock)**, Seitenleiste | 2 | ← Lernen |
| Einzeltrainer (7×) | `/lernen/trainer/:id` | Trainer-Übersicht | 3 | ← Trainer |
| Wiederholen | `/lernen/wiederholen` | **Lernen (Übungsblock)**, Quick Access | 2 | ← Lernen |
| Tages-Quiz | `/lernen/tagesquiz` | **Lernen (Übungsblock)**, Trainer | 2 | ← Trainer |
| Übungstisch | `/lernen/uebungstisch` | **Lernen (Übungsblock)** | 2 | ← Lernen |
| Spielstil-Analyse | `/lernen/statistik` | **Lernen (Übungsblock)** | 2 | ← Lernen |
| Pro-Insights | `/lernen/pros` | Lernen | 2 | ← Lernen |
| **Nachschlagen** | `/nachschlagen` | Hub-Karte 2, Leiste | 1 | ← Start |
| Live-Coach | `/nachschlagen/coach` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Glossar | `/nachschlagen/glossar` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Starthände | `/nachschlagen/haende` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Range-Charts | `/nachschlagen/ranges` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Odds-Tabellen | `/nachschlagen/odds` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Equity-Rechner | `/nachschlagen/equity` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| Tells & Reads | `/nachschlagen/tells` | Nachschlagen, Suche | 2 | ← Nachschlagen |
| **Live-Session** | `/session` | Hub-Karte 3, Leiste | 1 | ← Start |
| Chip-Rechner | `/session/chips` | Live-Session | 2 | ← Live-Session |
| **Auszahlung** | `/session/auszahlung` | Live-Session | 2 | ← Live-Session |
| Pokerabend | `/session/tisch` | Live-Session | 2 | ← Live-Session |
| Online-Tisch | `/session/tisch/online` | Pokerabend | 3 | ← Pokerabend |
| Bankroll | `/session/bankroll` | Live-Session | 2 | ← Live-Session |
| **Profil** | `/profil` | Kopfzeile „Du", Seitenleiste | 1 | — |
| Freunde | `/freunde` | **Profil (Weiterführungen)** | 2 | ← Profil |
| Rechtliches | `/rechtliches` | **Profil (Weiterführungen)** | 2 | ← Profil |
| Pro | `/pro` | Profil (nur mit Monetarisierung) | 2 | ← Profil |
| Kündigung | `/kuendigen` | Profil (nur mit Monetarisierung) | 2 | ← Profil |

**Maximale Tiefe: 3.** **Rückweg auf 25 von 25 geprüften Seiten vorhanden.**

Fett markiert: durch diesen Durchlauf neu entstandene oder reparierte Wege.

---

## 3. Untere Leiste

Vier Punkte, alle mit Beschriftung, jede Zelle 98 × 63 px, kein Text läuft
über:

`Start | Lernen | Suchen | Session`

„Suchen" statt „Nachschlagen": Bei 10,5 px Schrift passt das lange Wort nicht
in eine 98-px-Zelle. Überall sonst heißt der Bereich „Nachschlagen".

**„Du" steht nicht mehr in der Leiste**, sondern rechts oben in der mobilen
Kopfzeile — sichtbar und beschriftet auf jedem Bildschirm. Ein fünfter Punkt
hätte alle Zellen auf 78 px gedrückt, und dann passt kein Bereichsname mehr.

---

## 4. Alte Pfade

Alle **26** geprüft, alle korrekt:

| alt | neu |
|---|---|
| `/live/coach` · `/coach` | `/nachschlagen/coach` |
| `/lernen/glossar` · `/glossar` | `/nachschlagen/glossar` |
| `/tools/hands` | `/nachschlagen/haende` |
| `/tools/ranges` · `/tools/odds` · `/tools/equity` · `/tools/tells` | `/nachschlagen/…` |
| `/live/tisch` · `/tisch` | `/session/tisch` |
| `/live/tisch/online` · `/tisch/online` | `/session/tisch/online` |
| `/tools/chips` | `/session/chips` |
| `/tools/bankroll` | `/session/bankroll` |
| `/live/uebungstisch` · `/spielen` | `/lernen/uebungstisch` |
| `/live/statistik` | `/lernen/statistik` |
| `/trainer` · `/trainer/:id` | `/lernen/trainer…` |
| `/wiederholen` · `/tagesquiz` · `/pros` | `/lernen/…` |
| **`/live`** · **`/tools`** | **`/`** (Hub) |

Die letzte Zeile ist eine bewusste Ausnahme: Diese beiden Sammelpfade haben
keinen Nachfolger, ihr Inhalt liegt jetzt in **zwei verschiedenen** Bereichen.
Auf einen davon weiterzuleiten wäre in drei von vier Fällen das falsche Ziel;
der Hub ist immer richtig und von dort ist alles einen Tipp entfernt.

Ein unbekannter Pfad führt ebenfalls zum Hub, nicht auf eine Fehlerseite.

---

## 5. Konsole

39 Bildschirme durchlaufen, jeweils mit einer Interaktion und einmal quer auf
Englisch: **keine Fehler, keine Warnungen** — mit einer Ausnahme, die nicht
die App betrifft: Diese Prüfumgebung erreicht `apis.google.com` nicht (der
Proxy antwortet mit 403), weshalb das Firebase-Hilfsskript für die Anmeldung
nicht lädt. Auf einem echten Gerät ist das nicht so.

---

## 6. Nachprüfen

```bash
npm run build
```

Die Skripte (`ia.mjs` für Struktur und Weiterleitungen, `links.mjs` für
Rückwege, `console.mjs` für die Konsole) liegen im Sitzungs-Arbeitsverzeichnis
und brauchen nur den gebauten `dist/`-Ordner und Chromium.
