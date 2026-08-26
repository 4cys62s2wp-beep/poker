# Bestandsaufnahme

Aufgenommen am 2026-08-26 gegen 19:40 UTC, zu Beginn des Nachtlaufs.
Alles hier ist nachgesehen, nichts vermutet.

---

## 0.1 Arbeitsbereich, Branch, Stand

| | |
|---|---|
| App-Arbeitsbereich | `/home/user/poker-trainer` (git worktree) |
| Branch | `feature/pot-odds-trainer` |
| Stand bei Beginn | `2b5757e` (Teil C beantwortet) |
| Rechenordner | `/home/user/poker/tools/poker-math/` — gehört dem B4-Prozess, hier nur lesen |
| Ausliefer-Branch | `claude/poker-learning-app-concept-ml0xm6`, wird über `/home/user/poker-merge` bedient |

Drei Arbeitsbäume auf demselben Repository: `poker` (Rechengenerator),
`poker-trainer` (App, hier), `poker-merge` (nur zum Zusammenführen).

---

## 0.2 Was tatsächlich existiert

**37 Bildschirme** unter `src/pages/`:

| Bereich | Dateien |
|---------|---------|
| Einstieg | `HubPage`, `LearnPage`, `ReferencePage`, `SessionPage` |
| Lernen | `ModulePage`, `LessonPage`, `ReviewPage`, `DailyQuizPage`, `ProInsightsPage`, `TrainerHub`, `StatsPage`, `PlayPage` |
| Trainer | `trainers/PotOddsDrill`, `PotOddsTrainer`, `PreflopTrainer`, `EquityTrainer`, `HandRankTrainer`, `OutsTrainer`, `ScenarioTrainer`, `PushFoldTrainer` |
| Nachschlagen | `tools/OddsTables`, `HandExplorer`, `RangeViewer`, `EquityCalc`, `TellsPage`, `CoachPage`, `GlossaryPage` |
| Live-Session | `session/PayoutPage`, `tools/ChipCalculator`, `tools/BankrollTracker`, `table/LocalTablePage`, `table/OnlineTablePage` |
| Konto und Recht | `ProfilePage`, `FriendsPage`, `UpgradePage`, `LegalPage`, `CancelPage` |

**16 Komponenten** unter `src/components/`: `Layout`, `Icon`, `PlayingCard`,
`CardPicker`, `HandMatrix`, `QuizRunner`, `MarkdownLite`, `Onboarding`,
`ShareCard`, `ErrorBoundary`, `CloudAccountCard`, **`Herkunft`** (neu von
heute), `ui/index`, `pro/PaywallModal`, `pro/ProLock`, `social/OnlineBadge`.

**65 Routen** in `src/App.tsx`, davon ein erheblicher Teil Umleitungen aus
der früheren Navigationsstruktur.

**Bibliotheken** unter `src/lib/`: `poker/` (Kern: Evaluator, Engine,
Equity, Ranges, Statistik), `pokermath/` (Datenschnittstelle zum Generator),
`potodds/` (Aufgabengenerator und Adressen), `payments/`, `pro/`, `cloud/`,
`social/`, `table/`, dazu `chips`, `storage`, `csp`, `legal`, `download`.

---

## 0.3 Pot-Odds-Trainer: fertig

Nicht mittendrin abgebrochen. Vollständig, mit Adresse, Herkunftsanzeige und
Teilen-Knopf.

- Bildschirm: `src/pages/trainers/PotOddsDrill.tsx` — **enthält keine Ziffer**,
  ein Test erzwingt das
- Aufgaben: `src/lib/potodds/aufgabe.ts`
- Adressen: `src/lib/potodds/adresse.ts`
- Route: `/lernen/drill` und `/lernen/drill/:code`
- Tests: 61 in `src/lib/__tests__/potodds-drill.test.ts`

Der ältere `trainers/PotOddsTrainer.tsx` (Multiple-Choice) steht unberührt
daneben. Zwei Bildschirme mit ähnlichem Thema — für Phase 2 zu klären.

---

## 0.4 Welche Daten im App-Format vorliegen

Drei von vier Blöcken, in `public/pokermath/`, **Vertrag Version 3**.

| Block | Größe | Fälle | Bibliothek | Inhalt |
|-------|-------|-------|------------|--------|
| `b1_outs` | 13,8 KB | 67 863 | eval7 0.1.11 | 21 Outs-Zeilen, 8 Zugbilder, 3 Gegenbeispiele, 7 Befunde |
| `b2_potodds` | 6,1 KB | 294 | keine, mit Begründung | 8 Einsatzgrößen, 3 Befunde |
| `b3_kombinatorik` | 17,7 KB | 884 104 | keine, mit Begründung | Kombos und Klassen je Typ, Blocker für Paar/suited/offsuit, ein Beispielboard, 4 Befunde |

**Der Metadaten-Block ist dabei**, in jeder Datei, als `herkunft`:

- `methode` (`exakt`), `erzeugt_am`, `zweck` (zweisprachig)
- `annahmen`: `sicht`, `unbekannte_karten`, `split_pot` (alle zweisprachig),
  `kartenzahlen` (Deck 52, eigene 2, nach Flop 47, nach Turn 46),
  `besonderheiten` (3 bis 4 je Block, zweisprachig)
- `bibliothek`: Name und Version — oder `name: null` **mit Begründung**,
  zweisprachig
- `faelle_enumeriert`: Gesamtzahl und Aufschlüsselung je Zählstelle, jede mit
  zweisprachigem Namen
- `quelle`: Pfad zur vollständigen Fassung

**B4 fehlt noch** — der Lauf rechnet. Der Anschluss ist vorbereitet: `appB4`
im Konverter, `pruefeB4` im Lader, Typen, vier Tests, die übersprungen
werden, solange die Datei fehlt.

---

## 0.5 BLOCKER.md und WARTESCHLANGE.md

**BLOCKER.md** — alle sieben Punkte sind zu:

| # | Was | Stand |
|---|-----|-------|
| B-001 | B4-Lauf tot, `--sichern` vernichtete Daten | behoben |
| B-002 | B2/B3 nannten keine Bibliothek | nennen jetzt den Grund |
| B-003 | Keine Ausgabe nannte eine Fallzahl | wird mitgezählt |
| B-004 | Zwei Konvertierungsskripte | eines entfernt |
| B-005 | Daten nur auf Deutsch | zweisprachig ab Vertrag 3 |
| B-006 | Willkommensdialog vor geteilter Aufgabe | aufgeschoben |
| B-007 | Vorschaukarte je Aufgabe | **heute Nacht entschieden** (C1, E-023) |

**WARTESCHLANGE.md** — zwei Einträge, beide dieselbe Sperre:

- **W-001**: Restzeitschätzung von B4 auf Konfigurationen umstellen
- **W-002**: Die dokumentierte Zahl 47 008 auf 47 086 korrigieren, mit Test

Beide betreffen `tools/poker-math/` und damit den Ordner, der dem laufenden
Prozess gehört. Keiner der beiden betrifft die Phasen 1 bis 4.

---

## 0.6 Läuft der B4-Prozess?

**Ja.** Über die PID geprüft, nicht über die Fortschrittsdatei:

```
PID 5006  ELAPSED 22:20  .venv/bin/python src/b4_preflop_equity.py --kerne 4
Arbeiter 5007–5010, jeder bei rund 96 % CPU
```

Vier Arbeitsprozesse unter dem Hauptprozess, alle rechnend. Stand
19:38:56 UTC: 2799 von 14 365 Handpaaren (19,48 %).

Restzeit nach der eigenen Angabe des Laufs: 3:24. Nachgemessen über
Farbkonfigurationen (E-024): rund 4 Stunden. Die beiden Grundlagen kommen
hier fast aufs Gleiche — der in C4 vermutete systematische Fehler tritt bei
dieser Sortierung der Arbeitsliste nicht auf.

Der Lauf sichert sich selbst alle 250 Handpaare. **Nicht anfassen.**
