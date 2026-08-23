# ♠ PokerMentor – Die Poker-Lern-App

Lerne Texas Hold'em von Grund auf, trainiere Strategien und werde ein besserer
Spieler – **online wie live**. Ohne Echtgeld, ohne Risiko: eine reine Lern- und
Trainings-App als Website und installierbare PWA.

> Das vollständige Produktkonzept steht in [CONCEPT.md](CONCEPT.md).

## Features

- **🧭 Live-Coach:** Hand per 2-Tap-Picker eingeben → Street für Street eine klare
  Empfehlung (Aktion, Sizing, Begründung, Gewinnchance) – gebaut für lockere
  Low-Stakes-Runden mit Freunden
- **📚 Lernpfad:** 8 Module, ~43 Lektionen mit Quiz – von den Regeln bis zu GTO,
  inklusive eigener Module für Live- und Online-Poker
- **🎯 5 Trainer:** Preflop-Ranges, Pot Odds, Equity-Schätzen, Handrankings, Outs
- **🃏 Übungstisch:** No-Limit Hold'em gegen KI-Gegner (Heads-Up bis 6-max) mit
  Coach-Modus (Live-Equity, Pot Odds, Handstärke)
- **🔍 Starthand-Explorer:** alle 169 Hände mit Gewinnwahrscheinlichkeit gegen
  1/3/5 Gegner und konkreter Spielanleitung
- **🫣 Tells & Reads:** 25+ Live-Tells mit Zuverlässigkeits-Bewertung
- **🧰 Tools:** Monte-Carlo-Equity-Rechner, Range-Charts, Odds-Spickzettel,
  Bankroll-Tracker mit Verlaufs-Chart
- **📖 Glossar:** 150+ Begriffe mit Suche und Kategorien
- **🏆 Gamification:** XP, 11 Level, 18 Abzeichen, Lern-Streaks
- **📲 PWA:** offline-fähig, aufs Handy installierbar, alle Daten bleiben lokal
- **🎨 Eigenständiges Design:** „Kartenlounge“-Ästhetik mit Fraunces & Manrope,
  4-Color-Deck, mobile-first

## Entwicklung

```bash
npm install
npm run dev        # Dev-Server
npm test           # Unit-Tests (Evaluator, Engine, Equity, Simulation)
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
