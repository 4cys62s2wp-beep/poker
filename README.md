# ♠ PokerMentor – Die Poker-Lern-App

Lerne Texas Hold'em von Grund auf, trainiere Strategien und werde ein besserer
Spieler – **online wie live**. Ohne Echtgeld, ohne Risiko: eine reine Lern- und
Trainings-App als Website und installierbare PWA. **Komplett zweisprachig
(Deutsch/Englisch)** mit Sprachwahl beim ersten Start und Umschalter im Profil.

> Das vollständige Produktkonzept steht in [CONCEPT.md](CONCEPT.md).

## Features

- **🧭 Live-Coach:** Hand per 2-Tap-Picker eingeben → Street für Street eine klare
  Empfehlung (Aktion, Sizing, Begründung, Gewinnchance) – gebaut für lockere
  Low-Stakes-Runden mit Freunden
- **📚 Lernpfad:** 9 Module, ~49 Lektionen mit Quiz – von den Regeln bis zu GTO,
  inklusive Live-Poker, Online-Poker und Poker-Varianten (PLO, Short Deck, Stud,
  Mixed Games)
- **⭐ Pro-Insights:** verifizierte Prinzipien von Fedor Holz, Jonathan Little,
  Doug Polk, Daniel Negreanu, Phil Galfond & Zachary Elwood – plus die teuersten
  Anfängerfehler und Edge-Spots aus Profi-Sicht
- **🎯 7 Trainer:** Preflop-Ranges, Pot Odds, Equity-Schätzen, Handrankings, Outs,
  Szenario-Spots, Push/Fold
- **🃏 Übungstisch:** No-Limit Hold'em gegen KI-Gegner (Heads-Up bis 6-max) mit
  Coach-Modus (Live-Equity, Pot Odds, Handstärke)
- **🔍 Starthand-Explorer:** alle 169 Hände mit Gewinnwahrscheinlichkeit gegen
  1/3/5 Gegner und konkreter Spielanleitung
- **🫣 Tells & Reads:** 25+ Live-Tells mit Zuverlässigkeits-Bewertung
- **🧰 Tools:** Monte-Carlo-Equity-Rechner, Range-Charts, Odds-Spickzettel,
  Bankroll-Tracker mit Verlaufs-Chart
- **📖 Glossar:** 150+ Begriffe mit Suche und Kategorien
- **🏆 Gamification:** XP, 15 Level, 22 Abzeichen, Lern-Streaks, Tages-Quiz,
  Spaced-Repetition-Wiederholung
- **👥 Profile & Konten:** mehrere Profile pro Gerät (parallel trainieren),
  Fortschritt doppelt gesichert (localStorage + IndexedDB); optional echte
  Cloud-Konten mit E-Mail-Verifizierung und Geräte-Sync via Firebase –
  Anleitung in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **🔒 Sicherheit:** Content-Security-Policy, validierte Datenimporte
  (Backups/Cloud), 0 bekannte Abhängigkeits-Schwachstellen (`npm audit`);
  die Firestore-Regeln sind mit 26 Tests gegen den echten Emulator abgesichert
  (`npm run test:rules`) – inklusive Nachweis, dass niemand fremde Handkarten liest
- **🌍 Zwei Sprachen:** komplette App und alle Lerninhalte auf Deutsch und
  Englisch; englische Inhalte werden nur geladen, wenn Englisch aktiv ist
- **📤 Teilen:** QR-Code + System-Teilen-Dialog in der App, professionelle
  Link-Vorschau (Open Graph) für WhatsApp & Social Media; eigene Domain via
  [DOMAIN_SETUP.md](DOMAIN_SETUP.md)
- **👥 Mit Freunden spielen:** Pokertisch **auf einem Gerät** (App als Dealer und
  Chipverwaltung, ohne Internet und ohne Konto) sowie **Online-Tisch** mit QR-Code
  und 6-stelligem Code, bei dem jeder sein eigenes Handy nutzt; dazu Freundesliste
  mit Anfragen und Online-Anzeige – siehe [MULTIPLAYER_SETUP.md](MULTIPLAYER_SETUP.md)
- **🎰 Chip-Rechner:** Pokerkoffer eingeben → faire Verteilung, Startstack,
  Blinds und Turnier-Fahrplan für den Pokerabend
- **📲 PWA:** offline-fähig und aufs Handy installierbar; ohne Konto bleiben alle
  Daten auf dem Gerät, mit Konto kommt die Cloud-Synchronisation dazu
- **💳 Pro-Abo (optional):** komplette Paywall-Infrastruktur mit 7-Tage-Testphase,
  Rechtsseiten und Kündigungsseite nach § 312k BGB – standardmäßig **aus**, siehe
  [SETUP_PAYMENTS.md](SETUP_PAYMENTS.md)
- **🎨 Eigenständiges Design:** „Kartenlounge“-Ästhetik mit Fraunces & Manrope,
  4-Color-Deck, mobile-first

## Entwicklung

```bash
npm install
npm run dev        # Dev-Server
npm test           # Unit-Tests (Evaluator, Engine, Equity, Simulation)
npm run test:rules # Firestore-Sicherheitsregeln gegen den Emulator (braucht Java)
npm run build      # Produktions-Build nach dist/
npm run build:single  # Alles-in-einer-HTML-Datei nach dist-single/
npm run icons      # App-Icons neu generieren
```

## Deployment (automatisch via GitHub Actions)

Der Workflow `.github/workflows/deploy.yml` testet, baut und veröffentlicht die
App bei jedem Push automatisch auf **GitHub Pages**.

**Einmalig aktivieren** (aus Sicherheitsgründen kann das nur der Repo-Besitzer):

1. Auf GitHub: **Settings → Pages**
2. Bei „Source“ **„GitHub Actions“** auswählen – fertig.

Danach läuft jeder Push automatisch durch (Tests → Build → Deploy), und die App
ist unter `https://<owner>.github.io/poker/` erreichbar – als Website und als
installierbare PWA („Zum Startbildschirm hinzufügen“).

Alternativ manuell: `npm run build` erzeugt eine statische Seite in `dist/` –
lauffähig auf jedem statischen Hosting (Netlify, Vercel, eigener Webspace).
Dank Hash-Routing ist keine Server-Konfiguration nötig.

## Hinweis

PokerMentor ist eine Lern-App mit Spielgeld. Sie bietet kein Echtgeldspiel an und
ruft nicht zum Glücksspiel auf. Poker ist ein Geschicklichkeitsspiel mit
erheblichem Glücksanteil – Modul 6 behandelt Bankroll-Management und
verantwortungsvolles Spielen ausführlich.
