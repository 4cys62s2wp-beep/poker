# STATUS · Poker-Mathematik

Eigenständiges Arbeitspaket. Branch `feature/poker-math`.

Diese Datei ist so geschrieben, dass eine frische Sitzung ohne Kontext hier
weiterarbeiten kann.

- **Letzte Aktualisierung:** 2026-08-26, nach B1/B2/B3
- **Stand in einem Satz:** Der Unterbau ist bewiesen, B1 bis B3 sind exakt
  gerechnet und ausgeliefert. B4 ist vorbereitet, aber **noch nicht gestartet**
  — die gemessene Laufzeit verlangt eine Entscheidung, siehe unten.

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

## Exakt nächster Schritt: B4 — und eine Entscheidung davor

### Die Laufzeitabschätzung (E3), gemessen statt geschätzt

Ein **einzelnes vollständig enumeriertes Matchup** wurde gemessen:

| | |
|---|---|
| Beispiel | A♥K♥ gegen Q♠Q♦ |
| Boards | 1 712 304 (alle) |
| Dauer | **2,9 s** |
| Durchsatz | ~600 000 Boards/s |
| Ergebnis | 46,2145 % für A♥K♥ (Split als 0,5 gezählt) |

Hochgerechnet auf alle Paarungen:

| Weg | Matchups | Ein Kern | Vier Kerne |
|---|---:|---:|---:|
| ohne Reduktion | 812 175 | ~654 h | ~187 h |
| **mit Farb-Isomorphie** | **47 008** | **~38 h** | **~11 h** |

Der Reduktionsfaktor **17,28×** ist nicht geschätzt, sondern ausgezählt: Über
alle 812 175 Paarungen wurde die Kanonform unter allen 24 Farbumbenennungen
gebildet und die verschiedenen Formen gezählt.

### Was daraus folgt

Die Schwelle aus E3 (zwei Stunden) ist **auch nach beiden vorgeschriebenen
Maßnahmen überschritten** — Farb-Isomorphie und Multiprocessing zusammen
landen bei rund elf Stunden. Beide sind trotzdem zu implementieren, denn ohne
sie wären es Wochen.

**Vor dem Start von B4 ist zu entscheiden**, und das ist keine technische
Frage:

1. **Elf Stunden exakt durchrechnen.** Liefert die Zahl, nicht die Schätzung.
   Einmalig, das Ergebnis ist für immer gültig.
2. **Monte Carlo für die volle Matrix**, mit exakter Kreuzvalidierung auf
   einem Teilfall, wie in `POKER_MATH.md` beschrieben. Deutlich schneller,
   liefert aber Werte mit Konfidenzintervall statt exakter Zahlen.
3. **Gemischt:** die 169 Klassen gegen sich selbst exakt (die Diagonale und
   die häufig nachgeschlagenen Paarungen), der Rest per Monte Carlo.

**Meine Empfehlung: Weg 1.** Elf Stunden sind einmalig, das Ergebnis ist
danach für immer exakt, und eine Lern-App, die „46,21 %" sagt, sollte 46,21 %
meinen und nicht „46,2 % ± 0,1". Die Rechnung kann im Hintergrund laufen.

### Was für B4 vorher zu bauen ist (E3, verbindlich)

- **Farb-Isomorphie** mit Gewichten. Die Reduktion ist an **mindestens fünf**
  Paarungen gegen die vollständige Enumeration ohne Reduktion zu prüfen; die
  Werte müssen **exakt** übereinstimmen, nicht näherungsweise.
- **Multiprocessing** über die vier Kerne, mit deterministischem
  Zusammenführen der Teilergebnisse.
- **Split-Pötte** zählen als 0,5 je Seite — gilt für alle Equity-Rechnungen.

Danach: **B5** (Multiway), **B6** (Set Mining), **B7** (Flop-Texturen).

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
| `src/b1_outs.py` · `b2_potodds.py` · `b3_kombinatorik.py` | Die Rechenblöcke |
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
2. **B4 dauert Stunden.** Siehe die Entscheidung oben. Ein abgebrochener Lauf
   darf keine halbe Datei hinterlassen — die Zwischenstände gehören gesichert.
3. **eval7 ist eine C-Erweiterung.** Auf einer Plattform ohne fertiges Rad
   muss übersetzt werden. Betrifft nur diesen Generator, nicht die App.
4. **eval7 warnt beim Import** über eine veraltete pyparsing-Schnittstelle.
   Fremder Code, keine Auswirkung auf die Ergebnisse — aber beim nächsten
   pyparsing-Sprung möglicherweise ein echter Bruch.
