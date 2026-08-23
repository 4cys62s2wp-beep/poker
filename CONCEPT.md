# PokerMentor – Konzept

**Die Poker-Lern-App: nicht spielen, um zu zocken – spielen, um zu lernen.**

PokerMentor ist eine vollständige Lernplattform für Texas Hold'em No-Limit. Sie richtet
sich an alle, die Poker systematisch lernen und besser werden wollen – vom absoluten
Einsteiger bis zum ambitionierten Hobbyspieler. Kein Echtgeld, keine Gegner-Lobbys,
kein Glücksspiel: Der gesamte Fokus liegt auf **Verstehen, Trainieren, Anwenden**.

---

## 1. Vision & Leitprinzipien

1. **Lernen mit System:** Ein roter Faden von den Regeln bis zu GTO-Konzepten –
   nicht 1000 lose Tipps, sondern ein Curriculum.
2. **Wissen → Fähigkeit:** Jedes Konzept wird sofort trainiert (Quiz, Drills,
   Übungstisch). Wiederholung macht aus Wissen Instinkt.
3. **Online UND Live:** Eigene Module für beide Welten – Timing-Tells und HUDs
   online, Tells, Etikette und Casino-Ablauf live.
4. **Ehrliche Mathematik:** Alle Zahlen (Odds, Equity, Combos) sind korrekt
   berechnet, nicht gerundet erfunden. Der Equity-Rechner simuliert echt.
5. **Verantwortung:** Poker ist ein Geschicklichkeitsspiel mit Glücksanteil.
   Bankroll-Management und Spielverhalten sind fester Teil des Lehrplans.

## 2. Zielgruppen

| Persona | Bedürfnis | Was PokerMentor bietet |
|---|---|---|
| Einsteiger | Regeln, Handrankings, erste Strategie | Module 1–2, Handranking-Trainer, Übungstisch mit Coach |
| Aufsteiger | Mathe, Postflop, Fehler abstellen | Module 3–4, Pot-Odds-/Outs-/Equity-Trainer |
| Ambitionierte | Ranges, GTO, Exploits, Turniere | Modul 5, Preflop-Trainer, Range-Charts |
| Live-Spieler | Casino-Praxis, Tells, Etikette | Modul 7, Live-Strategieanpassungen |
| Online-Spieler | Multi-Tabling, HUD, Study-Workflow | Modul 8, Bankroll-Tracker, Equity-Rechner |

## 3. Lern-Curriculum (8 Module, ~43 Lektionen)

1. **🎓 Grundlagen** – Spielablauf, Handrankings, Position, Setzregeln, Varianten & Formate
2. **🃏 Preflop-Strategie** – Starthände, Open-Raises nach Position, 3-Bets, Blind Defense, Squeeze/Multiway
3. **🧮 Poker-Mathematik** – Outs, Regel von 2 und 4, Pot Odds, Implied Odds, EV, Kombinatorik
4. **🎯 Postflop-Spiel** – Boardtexturen, C-Bets, Value Betting, Bluffs, Draws, Turn & River
5. **🧠 Fortgeschrittene Konzepte** – Range-Denken, GTO vs. Exploit, Blocker, Polarisierung, ICM/Turniere, Gegnertypen
6. **🧘 Psychologie & Bankroll** – Tilt, Bankroll-Management, Varianz, Mindset & Lernroutine, verantwortungsvolles Spielen
7. **🎰 Live-Poker** – Unterschiede zu online, Casino-Etikette, Tells lesen, eigene Tells minimieren, Live-Anpassungen
8. **💻 Online-Poker** – Anbieterwahl & Start, Online-Dynamiken, Multi-Tabling, HUD & Stats, Timing-Tells, Study-Workflow

Jede Lektion: Einleitung → 3–6 Abschnitte mit Beispielen, Coach-Tipps und Tabellen →
Kernaussagen → Quiz (4–6 Fragen). Abschluss bringt XP; das beste Quiz-Ergebnis wird gespeichert.

## 4. Trainer (Drills)

| Trainer | Trainiert | Mechanik |
|---|---|---|
| 🃏 Preflop-Trainer | Ranges nach Position | Zufällige Hand + Situation (RFI / BB-Defense), Antwort vs. Chart, Matrix-Anzeige |
| 🧮 Pot-Odds-Trainer | Benötigte Equity | Zufälliger Pot & Bet, Multiple Choice, Rechenweg als Erklärung |
| ⚖️ Equity-Schätzer | Matchup-Gefühl | Hand vs. Hand (+Board), Schätzung per Slider, Monte-Carlo-Auflösung |
| 🏆 Handranking-Trainer | Handlesen | 7 Karten, beste Hand erkennen |
| 🔢 Outs-Zähler | Draw-Bewertung | Typische Draw-Szenarien, Outs zählen, Regel-von-4-Umrechnung |

Alle Trainer zählen Versuche, Trefferquote und Serien – mit XP und Abzeichen.

## 5. Übungstisch (Spielen gegen KI)

- No-Limit Hold'em, Heads-Up / 3-handed / 6-max, Blinds 1/2, 100bb, Spielgeld
- Vollständige Engine: Setzrunden, Min-Raise-Regeln, All-ins, **Side Pots**, Split Pots
- KI-Gegner mit Persönlichkeiten (tight, solide, loose, aggressiv), preflop chartbasiert,
  postflop equity- und potodds-basiert mit Zufallsanteil
- **Coach-Modus:** Live-Anzeige von Equity, Pot Odds, aktueller Handstärke und einer
  Einschätzung („Call ist rechnerisch profitabel“)
- Handverlauf als Log; gespielte/gewonnene Hände fließen in Profil & Abzeichen

## 6. Live-Coach – der Berater für den Pokerabend

Das Herzstück für die Praxis, gebaut für lockere Low-Stakes-Runden mit Freunden:

1. **Setup:** Spielerzahl, Sitzposition, Situation (Raise davor? Limper?)
2. **Hand eingeben:** blitzschneller 2-Tap-Karten-Picker (Rang → Farbe), fürs Handy optimiert
3. **Street für Street:** Preflop → Flop → Turn → River – jede Karte nachtragen und sofort sehen:
   - **Klare Empfehlung** (Raise/Bet/Call/Check/Fold) mit Sizing („Bet 50–65 % des Pots“)
   - **Begründungen** in verständlichem Deutsch + Homegame-Tipps („Gegen Callstations nicht bluffen“)
   - **Gewinnchance** per Monte-Carlo-Simulation gegen einstellbare Gegnerzahl
   - **Handanalyse:** Overpair/Top Pair/…, erkannte Draws mit Out-Zählung
   - **„Jemand setzt“-Rechner:** Pot & Einsatz eingeben → lohnt sich der Call?

Hinweis in der App: gedacht für private Runden und Training – in Casinos ist Handy-Hilfe verboten.

## 7. Tools

- **🔍 Starthand-Explorer:** alle 169 Starthände antippen → Gewinnwahrscheinlichkeit gegen 1/3/5
  Gegner, Einordnung (Premium/Stark/Set-Mining/…) und konkrete Spielanleitung
- **🫣 Tells & Reads:** 25+ Live-Tells mit Zuverlässigkeits-Sternen (Körpersprache, Einsätze,
  Timing, Sprechverhalten, Homegame-Muster) – inklusive „eigene Tells vermeiden“
- **⚖️ Equity-Rechner:** 2–3 Hände + beliebiges Board, 30.000 Monte-Carlo-Simulationen
- **🗺️ Range-Charts:** RFI-Ranges aller Positionen + BB-Verteidigung, interaktive 13×13-Matrix
- **📊 Odds-Spickzettel:** Outs→Equity (exakt berechnet), klassische Matchups, Pot-Odds-Tabelle
- **📒 Bankroll-Tracker:** Live-/Online-Sessions, Gewinn, Stundenlohn, Verlaufs-Chart – lokal gespeichert
- **📖 Glossar:** 150+ Begriffe mit Kategorien, Suche und Querverweisen

## 8. Motivation & Gamification

- **XP & Level:** Lektionen (60–100 XP), Trainer-Antworten (5 XP), Hände am Tisch;
  11 Level-Titel von „Neuling“ bis „Poker-Mentor“
- **18 Abzeichen:** Meilensteine über alle Bereiche (Lernen, Trainer, Tisch, Bankroll, Streak)
- **Lern-Streak:** tägliches Lernen wird belohnt
- **Fortschritt überall sichtbar:** Modul-Balken, Quiz-Bestleistungen, Trainer-Serien

## 9. Plattform: Website + App

- **Progressive Web App (PWA):** volle Website im Browser, auf dem Handy „Zum
  Startbildschirm hinzufügen“ → startet wie eine native App (standalone, eigenes Icon)
- **Offline-fähig:** Service Worker cached App & Inhalte – lernen auch ohne Netz
- **Responsive:** Desktop mit Sidebar, mobil mit Bottom-Tab-Navigation, Safe-Area-Support
- **Privacy by Design:** alle Fortschritts- und Bankroll-Daten bleiben im localStorage
  des Geräts; keine Accounts, kein Tracking, keine Server

## 10. Design

- **Eigenständige „Kartenlounge“-Ästhetik:** tiefes Filzgrün, Gold-Akzente, warme Cremetöne –
  kein generisches Dashboard-Design
- **Typografie:** Fraunces (Serif-Display) für Überschriften, Manrope für UI und Fließtext –
  beide selbst gehostet (offlinefähig)
- **4-Color-Deck** für schnelle Farberkennung, realistische Spielkarten mit Ecken-Index
- **Mobile-first:** Bottom-Tab-Navigation, große Touch-Ziele (Karten-Picker), Safe-Area-Support

## 11. Technik

- React 18 + TypeScript + Vite, React Router (Hash-Routing → überall hostbar)
- Eigene Poker-Bibliothek (`src/lib/poker/`): Kartenmodell, 7-Karten-Evaluator,
  Monte-Carlo-Equity, Range-Notation/Expansion, Spiel-Engine, Bot-KI
- 37+ Unit-Tests (Vitest): Evaluator, Engine (inkl. Side Pots), Equity-Sanity-Checks,
  Ranges, plus 300 simulierte Bot-Hände mit Chip-Erhaltungs-Invariante
- Inhalte als typisierte TypeScript-Daten (`src/content/`), leicht erweiterbar
- Kein Backend nötig; Deployment als statische Seite (jeder Webspace/Pages-Dienst)

## 12. Ausbaustufen (Roadmap-Ideen)

1. **Karten-Scan per Kamera:** Hand im Live-Coach per Foto erkennen statt tippen
   (on-device Erkennung, z. B. TensorFlow.js – der 2-Tap-Picker bleibt als Fallback)
2. **Spaced Repetition:** falsch beantwortete Quizfragen kommen automatisch wieder
3. **Session-Reader:** Hände aus dem Übungstisch speichern und im Nachhinein analysieren
4. **Mehr Charts:** vs. 3-Bet, Squeeze-Spots, Turnier-Stacktiefen, Push/Fold-Tabellen
5. **Szenario-Trainer:** komplette Spots („Flop-Quiz“) mit Bewertungslogik
6. **Accounts & Sync (optional):** Cloud-Backup des Fortschritts, weiterhin ohne Echtgeld
7. **Mehrsprachigkeit:** Englisch als zweite Sprache
8. **Omaha-Grundkurs** als eigenes Modul
