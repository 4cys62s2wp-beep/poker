# STATUS · Poker-Mathematik

Eigenständiges Arbeitspaket. Branch `feature/poker-math`.

Diese Datei ist so geschrieben, dass eine frische Sitzung ohne Kontext hier
weiterarbeiten kann.

- **Letzte Aktualisierung:** 2026-08-26, während B4 rechnet
- **Stand in einem Satz:** B1 bis B3 sind exakt gerechnet und ausgeliefert,
  die Datenschnittstelle zur App steht, und **B4 läuft** — Option 1 (exakt),
  im Hintergrund, wiederaufnehmbar.

---

## Die harte Regel dieses Ordners

**Keine Zahl, die in der App erscheint, stammt aus einem Gedächtnis oder aus
einer Webquelle.** Alles wird gerechnet. Was nicht rechenbar ist, steht in
`OPEN.md` statt im Code.

Ausgenommen sind Definitionen — 52 Karten, 13 Ränge, die Rangfolge der
Kategorien, das Ass als Eins in A-2-3-4-5. Die vollständige Liste steht in
`OPEN.md`.

---

## Fertig

| Einheit | Was | Nachweis |
|---|---|---|
| Aufbau | venv, vier Kandidaten, Versionen in `requirements.txt` festgenagelt | — |
| Referenz | `src/referenz_evaluator.py` — ein zweiter Evaluator aus den Regeln | 5 Mutationen geprüft |
| Auswahl | **eval7 0.1.11** (E-012) | `output/evaluator_auswahl.json` |
| Nachweis | Alle vier Bibliotheken über **alle** 2 598 960 Blätter geprüft | alle einig, 7 462 Stärkeklassen |
| Annahmen | Ein Block, erzeugt aus `src/metadaten.py`, in **jeder** Ausgabedatei | Test erzwingt ihn |
| **B1** | Outs, Verbesserung, Fehler der 2/4-Regel, 8 gezählte Zugbilder, 3 nachgerechnete Gegenbeispiele | `output/b1_outs.json` |
| **B2** | Pot Odds, Mindest-Equity, Mindest-Outs für 8 Einsatzgrößen | `output/b2_potodds.json` |
| **B3** | Kombos je Typ, Blockerverteilung, alle 169 Hände an einem Beispielboard | `output/b3_kombinatorik.json` |

**240 Tests grün, 1 übersprungen** (die noch leere externe Gegenprobe).

### Was B1 bis B3 methodisch absichert

- **B1** rechnet jede Zeile **doppelt**: einmal durch vollständiges Durchzählen
  aller geordneten Paare (Turn, River), einmal über die
  Gegenwahrscheinlichkeit. Beide müssen als **Bruch** exakt übereinstimmen,
  sonst bricht der Lauf ab.
- **B2** rechnet durchgehend mit Brüchen. Ein Drittel Pot ist ein Drittel.
- **B3** prüft, dass Klassen mal Kombos genau die Zahl aller
  Zweikartenblätter ergibt, und dass nach Blocker-Abzug genau so viele Kombos
  übrig bleiben, wie es Zweikartenblätter aus den unbekannten Karten gibt.

---

## B4 läuft

Gestartet am 26.08.2026, Option 1 (exakt, kein Monte Carlo), auf drei Kernen.

| | |
|---|---|
| Arbeitseinheiten | 14 365 Handpaare |
| Enumerationen | 47 008 Farbkonfigurationen |
| Gemessen | rund 2,1 s je Handpaar |
| Geschätzte Gesamtdauer | **rund 8,5 Stunden** |
| Fortschritt | `output/b4_lauf.log` |
| Laufender Strom | `output/b4_teil/matchups.live.jsonl` – **nicht** in git |
| Gesicherter Stand | `output/b4_teil/matchups.jsonl` – in git, eine Zeile je fertigem Handpaar |

### Wenn der Lauf abbricht

Er ist **wiederaufnehmbar**. Erneut starten genügt:

```bash
cd tools/poker-math
PYTHONPATH=src .venv/bin/python src/b4_preflop_equity.py --kerne 3
```

Er liest die Teildatei, überspringt alles Fertige und setzt an der ersten
offenen Einheit an. Eine mitten im Schreiben abgebrochene Zeile wird verworfen
und die Einheit neu gerechnet — geprüft, indem eine kaputte Zeile absichtlich
angehängt wurde.

Nach jedem Handpaar wird geschrieben **und** `fsync` aufgerufen. Ein
Stromausfall kostet höchstens die gerade laufende Einheit.

### Warum zwei Dateien

Eine Datei, die ein Prozess gerade beschreibt, kann nicht gleichzeitig
committet und sauber sein — jeder Commit ist im selben Augenblick veraltet.
Deshalb schreibt der Lauf in `matchups.live.jsonl` (nicht in git), und der
Stand wird bewusst übernommen:

```bash
PYTHONPATH=src .venv/bin/python src/b4_preflop_equity.py --sichern
```

Danach steht alles in `matchups.jsonl`, der Arbeitsbaum ist sauber und der
Fortschritt liegt in git. Geschrieben wird sortiert, damit dieselbe Menge
Ergebnisse immer dieselbe Datei ergibt — sonst wäre jede Sicherung ein großer
Diff. Beim Fortsetzen liest der Lauf **beide** Dateien.

### Den Lauf beenden

```bash
kill "$(cat output/b4.pid)"
```

Nicht `pkill -f b4_preflop_equity`: Das trifft auch die eigene Shell, wenn der
Suchbegriff in ihrer Kommandozeile steht. Genau so ist mir dieser Lauf einmal
mitsamt der Sitzung abgestürzt.

### Wenn der Lauf durch ist

```bash
PYTHONPATH=src .venv/bin/python src/b4_preflop_equity.py --zusammenbauen
npm run daten     # im Projektstamm
```

Der erste Befehl baut `output/b4_preflop_equity.json` und lässt den
**Integritätscheck** über die ganze Matrix laufen: Equity(A gegen B) +
Equity(B gegen A) = 1 für jedes Paar, Split je zur Hälfte gezählt, und eine
Hand gegen sich selbst bei genau 50 %. Eine Abweichung bricht mit Fehler ab,
statt eine Datei zu schreiben.

Der zweite erzeugt die App-Fassung.

### Was vorher geprüft wurde

Die Farb-Isomorphie ist der einzige Grund, warum B4 in Stunden statt in Wochen
rechnet. Wäre sie falsch, wäre jede Zahl falsch — und zwar plausibel falsch.
Deshalb wurde sie für **fünf Handpaare** gegen die vollständige Enumeration
ohne jede Reduktion gehalten, mit exakter Übereinstimmung
(`tests/test_b4_preflop.py`, Kennzeichen `langsam`, Laufzeit 5:39 min).

---

## Die Datenschnittstelle zur App

Steht und ist getestet: **`SCHNITTSTELLE.md`**.

Kurz: Der Generator schreibt zwei Fassungen — die vollständige nach
`output/` (Nachweis) und eine verschlankte nach `public/pokermath/`
(Anzeige). Die App liest nur die zweite und prüft sie streng: falsche
Vertragsversion, fehlender Annahmenblock, `NaN`, Wahrscheinlichkeiten außerhalb
0..1 oder eine in sich widersprüchliche Zeile führen zu `null` statt zu einer
halb verstandenen Tabelle.

Für B4 setzt der Loader die K3-Regel durch: Ist bei einem Handpaar
`spanne_relevant` gesetzt, **müssen** die Farbkonfigurationen beiliegen —
sonst wird die ganze Datei abgelehnt. Die App kann also nicht in einen
Zustand geraten, in dem sie einen Einzelwert ohne die Spanne zeigen möchte und
es nicht merkt.

---

## Danach: B5 bis B7

Erst wenn B4 durch ist. **B5** (Multiway-Equity gegen 2 bis 5 Gegner) wird der
nächste rechenintensive Block — dort ist vorab dieselbe Laufzeitabschätzung zu
machen wie bei B4, und dieselbe Frage nach exakt gegen Monte Carlo zu
beantworten.

---

## Dateien

| Datei | Inhalt |
|---|---|
| `POKER_MATH.md` | Was gerechnet wird, mit welcher Methode, wo die Grenzen liegen. Als Erklärtext für die App verwendbar |
| `OPEN.md` | Nicht gerechnete Größen und Kandidaten für V2. Derzeit keine offene Zahl |
| `src/metadaten.py` | Der Annahmenblock, den jede Ausgabedatei trägt |
| `src/karten.py` | Kartendarstellung, Starthand-Klassen |
| `src/referenz_evaluator.py` | Der Evaluator aus den Regeln — bleibt dauerhaft |
| `src/pruefe_evaluatoren.py` | Der vollständige Nachweislauf, ~40 s |
| `SCHNITTSTELLE.md` | Der Datenvertrag zwischen Generator und App |
| `src/b1_outs.py` · `b2_potodds.py` · `b3_kombinatorik.py` · `b4_preflop_equity.py` | Die Rechenblöcke |
| `src/befunde.py` | Aussagen über Zahlen, aus den Zahlen erzeugt |
| `scripts/pokermath-app-daten.mjs` (Projektstamm) | Erzeugt die App-Fassung nach `public/pokermath/`; Aufruf: `npm run daten` |
| `tests/bekannte_werte.json` | **Leer, von Lorenz zu füllen** |
| `output/*.json` | Die Ergebnisse, die die App liest |

---

## Wie man hier weiterarbeitet

```bash
cd tools/poker-math
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHONPATH=src .venv/bin/python -m pytest tests -q            # ~5 s
PYTHONPATH=src .venv/bin/python src/b1_outs.py                # jeder Block
PYTHONPATH=src .venv/bin/python src/b2_potodds.py
PYTHONPATH=src .venv/bin/python src/b3_kombinatorik.py
PYTHONPATH=src .venv/bin/python src/pruefe_evaluatoren.py     # ~40 s
```

---

## Bekannte Risiken

1. **`tests/bekannte_werte.json` ist leer.** Bis Lorenz sie füllt, gibt es
   keine externe Gegenprobe — nur innere Konsistenz und den Regel-Evaluator.
   Das ist stark, aber es ist dieselbe Denkweise zweimal. Der zugehörige Test
   meldet sich als übersprungen, nicht als bestanden.
2. **B4 dauert Stunden und überlebt das Sitzungsende nicht.** Der Container
   wird nach der Sitzung eingezogen. Was bis dahin gerechnet ist, liegt in
   `output/b4_teil/matchups.jsonl` und ist committet; eine neue Sitzung setzt
   dort an. Der Zwischenstand ist damit gesichert, die Wartezeit nicht.
3. **eval7 ist eine C-Erweiterung.** Auf einer Plattform ohne fertiges Rad
   muss übersetzt werden. Betrifft nur diesen Generator, nicht die App.
4. **eval7 warnt beim Import** über eine veraltete pyparsing-Schnittstelle.
   Fremder Code, keine Auswirkung auf die Ergebnisse — aber beim nächsten
   pyparsing-Sprung möglicherweise ein echter Bruch.
