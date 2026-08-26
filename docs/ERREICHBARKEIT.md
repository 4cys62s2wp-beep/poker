# Erreichbarkeit (Phase 3.3)

Jeder Bildschirm, sein Weg vom Hub und sein Rückweg.

**Geprüft im echten Browser**, nicht am Quelltext: Ein Skript öffnet jede
Ausgangsseite und sucht dort den Link zum Ziel (`docs`-Lauf vom 26.08.2026,
Chromium, 390 × 844 px). Ein Link, der im Code steht, aber unter einer
Bedingung verborgen ist, würde dabei auffallen.

---

## 1. Wege vom Hub

| Weg | geprüft |
|---|:---:|
| Hub → Lernen | ✅ |
| Hub → Live spielen | ✅ |
| Hub → Session-Tools | ✅ |
| Lernen → Trainer | ✅ |
| Lernen → Pro-Insights | ✅ |
| Trainer → Szenario-Trainer | ✅ |
| Live → Live-Coach | ✅ |
| Live → Pokerabend | ✅ |
| Live → Übungstisch | ✅ |
| Live → Spielstil-Analyse | ✅ |
| Tools → Chip-Rechner | ✅ |
| Tools → Bankroll | ✅ |
| Profil → Freunde | ✅ |

---

## 2. Vollständige Tabelle

| Bildschirm | Pfad | erreichbar über | Tiefe | Rückweg |
|---|---|---|:---:|---|
| **Hub** | `/` | Leiste „Start" | 0 | — |
| Lernpfad | `/lernen` | Hub-Karte 1, Leiste | 1 | Leiste |
| Modulübersicht | `/lernen/:m` | Lernpfad | 2 | ← Lernpfad |
| Lektion | `/lernen/:m/:l` | Modulübersicht, Hub-Quick-Access | 3 | ← Modul |
| Trainer-Übersicht | `/lernen/trainer` | Lernpfad, Seitenleiste | 2 | ← Lernpfad |
| Einzeltrainer (7×) | `/lernen/trainer/:id` | Trainer-Übersicht | 3 | ← Trainer |
| Wiederholen | `/lernen/wiederholen` | Seitenleiste, Hub-Quick-Access | 2 | ← Lernpfad |
| Tages-Quiz | `/lernen/tagesquiz` | Trainer-Übersicht, Hub-Quick-Access | 2 | ← Trainer |
| Pro-Insights | `/lernen/pros` | Lernpfad, Seitenleiste | 2 | ← Lernpfad |
| Glossar | `/lernen/glossar` | Seitenleiste, Tools | 2 | ← Lernpfad |
| **Live spielen** | `/live` | Hub-Karte 2, Leiste | 1 | ← Start |
| Live-Coach | `/live/coach` | Live, Seitenleiste | 2 | ← Live |
| Pokerabend | `/live/tisch` | Live, Seitenleiste | 2 | ← Live |
| Online-Tisch | `/live/tisch/online` | Pokerabend | 3 | ← Pokerabend |
| Übungstisch | `/live/uebungstisch` | Live, Seitenleiste, Tools | 2 | ← Live |
| Spielstil-Analyse | `/live/statistik` | Live, Seitenleiste | 2 | ← Live |
| **Session-Tools** | `/tools` | Hub-Karte 3 | 1 | ← Start |
| Chip-Rechner | `/tools/chips` | Tools | 2 | ← Tools |
| Bankroll | `/tools/bankroll` | Tools | 2 | ← Tools |
| Equity-Rechner | `/tools/equity` | Tools | 2 | ← Tools |
| Odds-Tabellen | `/tools/odds` | Tools | 2 | ← Tools |
| Range-Charts | `/tools/ranges` | Tools | 2 | ← Tools |
| Starthand-Explorer | `/tools/hands` | Tools | 2 | ← Tools |
| Tells & Reads | `/tools/tells` | Tools | 2 | ← Tools |
| **Profil** | `/profil` | Leiste „Du", Seitenleiste | 1 | Leiste |
| Freunde | `/freunde` | Profil, Seitenleiste | 2 | ← Profil |
| Pro | `/pro` | Seitenleiste (nur mit Monetarisierung) | 2 | ← Profil |
| Rechtliches | `/rechtliches` | Fußzeile der Seitenleiste | 2 | ← Profil |
| Kündigung | `/kuendigen` | Fußzeile (nur mit Monetarisierung) | 2 | ← Profil |

**Maximale Tiefe: 3.** Keine Seite liegt tiefer.

---

## 3. Rückwege

Stichprobe im Browser geprüft:

| Von | Rückweg vorhanden |
|---|:---:|
| `/live/statistik` → `/live` | ✅ |
| `/live/coach` → `/live` | ✅ |
| `/lernen/trainer/szenario` → `/lernen/trainer` | ✅ |
| `/lernen/m1` → `/lernen` | ✅ |

**Der Rückweg ist kein Browser-Zurück.** Er führt immer eine Ebene nach oben
in der Struktur, unabhängig davon, woher man kam.

Der Grund: Browser-Zurück ist unzuverlässig. Wer über einen geteilten Link
direkt auf einer Detailseite landet, hat kein Zurück. Wer aus der Suche kommt,
landet in der Suche. Ein struktureller Rückweg ist immer richtig — und
Browser-Zurück funktioniert zusätzlich weiter.

---

## 4. Alte Pfade

Alle zehn geprüft und korrekt weitergeleitet:

| alt | neu |
|---|---|
| `/coach` | `/live/coach` |
| `/spielen` | `/live/uebungstisch` |
| `/tisch` | `/live/tisch` |
| `/tisch/online` | `/live/tisch/online` |
| `/trainer` | `/lernen/trainer` |
| `/trainer/:id` | `/lernen/trainer/:id` |
| `/wiederholen` | `/lernen/wiederholen` |
| `/tagesquiz` | `/lernen/tagesquiz` |
| `/pros` | `/lernen/pros` |
| `/glossar` | `/lernen/glossar` |

Ein unbekannter Pfad führt zum Hub, nicht auf eine Fehlerseite.

---

## 5. Nachprüfen

```bash
npm run build
node docs/../scripts/…   # siehe SESSION_REPORT.md, Abschnitt „Prüfskripte“
```

Die verwendeten Skripte liegen im Sitzungs-Arbeitsverzeichnis und sind im
Bericht beschrieben; sie brauchen nur den gebauten `dist/`-Ordner und
Chromium.
