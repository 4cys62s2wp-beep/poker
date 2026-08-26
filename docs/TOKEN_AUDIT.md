# Token-Audit (Phase 3.2)

Systematische Suche nach hartkodierten Farb- und Pixelwerten in
`src/styles/global.css`, mit Entscheidung je Gruppe.

**Ergebnis in einem Satz:** Kein einziger Farbwert kommt mehr mehrfach vor;
alle wiederholten Werte tragen jetzt einen Namen. Bei den Pixelwerten wurden
die eindeutigen Fälle umgestellt, die mehrdeutigen bewusst nicht — mit
Begründung.

---

## 1. Farben

| | vorher | nachher |
|---|---:|---:|
| Tokens im `:root` | 42 | **107** |
| Farbwerte außerhalb `:root` | 110 | 68 |
| davon **mehrfach** verwendet | 26 verschiedene | **0** |

**63 Farbwerte umgestellt.** Neu benannt wurden:

### Abgeleitete Farbtöne
`--text-bright` · `--on-gold` · `--on-ok` · `--ok-bright` · `--info-bright` ·
`--danger-bright` · `--violet-bright` · `--warn` · `--warn-bright` · `--warn-dim`

Das waren durchweg helle Varianten der Signalfarben, die in Plaketten und
Knopftexten wiederkehrten.

### Schleier und Verdunkelungen
`--veil-1/2/3` (Text auf dunklem Grund mit 4/5/8 % Deckkraft) ·
`--scrim` · `--scrim-strong` (Hintergründe von Leisten und Dialogen) ·
`--gold-a28/a30/a40/a45` · `--gold-bright-a35`

### Verlaufs-Stützen
`--gold-grad-hi/-lo` · `--felt-grad-hi/-lo` · `--btn-gold-hi/-lo` ·
`--btn-ok-hi` · `--btn-danger-hi/-lo`

Diese kommen je zweimal vor (Marke und Hauptknopf bzw. Normal- und
Aktivzustand). Genau solche Paare driften beim nächsten Feinschliff
auseinander, wenn sie keinen gemeinsamen Namen haben.

### Bewusst eigenständig
`--focus-ring: #fff` — reines Weiß, absichtlich **nicht** `--text`. Der
Fokusring muss auf jedem Untergrund maximal auffallen, auch auf hellen
Karten. Ihn an die Textfarbe zu koppeln würde ihn irgendwann unsichtbar
machen.

### Was stehen bleibt: 68 Einmal-Werte

Ausschließlich Stützfarben in Verläufen und Schatten, jede genau einmal
verwendet. Für jede einen Token anzulegen ergäbe **68 Tokens mit je einer
Verwendung** — das ist schlechter als das Problem: Es bläht die Token-Liste
auf, ohne irgendetwas zu koppeln, was zusammengehört.

Die Regel lautet daher nicht „kein Literal im CSS", sondern:
**kein Wert, der mehr als einmal vorkommt, bleibt namenlos.** Diese Regel
ist erfüllt und lässt sich mit einem Einzeiler nachprüfen:

```bash
awk '/^:root \{/{r=1} /^\}/{if(r){r=0;next}} !r' src/styles/global.css \
  | grep -oE '#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)' | tr 'A-F' 'a-f' \
  | sort | uniq -d
# leere Ausgabe = Regel eingehalten
```

---

## 2. Abstände

**39 Werte umgestellt** — ausschließlich exakte Treffer auf der neuen Skala
(4/8/12/16/22/30/40/56 px) und ausschließlich in Abstands-Eigenschaften
(`margin`, `padding`, `gap` und deren Varianten).

Nicht angefasst wurden Deklarationen mit `calc()`, `var()`, `clamp()`,
`env()`, `min()` oder `max()` — dort steckt Absicht, die eine stumpfe
Ersetzung zerstört hätte (etwa die Safe-Area-Berechnungen der unteren
Leiste).

---

## 3. Pixelwerte: was bleibt und warum

369 Pixelwerte außerhalb des `:root`-Blocks. Aufgeschlüsselt:

| Gruppe | Anzahl | Entscheidung |
|---|---:|---|
| `1px` / `2px` — Rahmen, Trennlinien, Umrisse | 55 | **bleiben.** Das ist die kleinste sinnvolle Einheit, kein Magic Number. Ein `--border-width: 1px` wäre eine Umbenennung ohne Erkenntnisgewinn |
| Schriftgrößen (11–17 px) | ~70 | **bleiben vorerst.** Sie in `--fs-*` zu zwingen hieße, sie zu **ändern** — die Skala hat sieben Stufen, im Bestand kommen elf verschiedene Größen vor |
| Off-Scale-Abstände (3, 5, 6, 7, 9, 11, 13, 15 px) | ~110 | **bleiben vorerst**, siehe unten |
| Feste Maße (Icon-Größen, Mindestbreiten, Höhen) | ~100 | **bleiben.** Ein `--icon-26` wäre ein Name für genau eine Verwendung |
| Schatten- und Positionsangaben | ~34 | **bleiben.** Gehören zur jeweiligen Wirkung, nicht zu einer Skala |

### Warum die Off-Scale-Werte nicht einfach gerundet wurden

Ein `7px` in `var(--sp-2)` (8 px) zu ändern ist **kein Refactoring, sondern
eine optische Änderung.** Dasselbe gilt für 5→4, 13→12, 15→16.

Rund 110 solcher Änderungen auf einmal, ohne dass ein Mensch das Ergebnis
Bildschirm für Bildschirm gegenprüfen kann, ist genau die Art von Eingriff,
die ein Design leise verschlechtert: Jede einzelne Änderung ist unauffällig,
zusammen verschieben sie das Bild.

**Empfohlenes Vorgehen** (steht auch in `docs/TODO_MANUELL.md`): bildschirmweise
angehen, jeweils mit Vorher-Nachher-Vergleich. Die häufigsten Abweichler
zuerst:

| Wert | Vorkommen | naheliegendes Ziel |
|---|---:|---|
| `5px` | 44 | `--sp-1` (4 px) |
| `14px` | 23 | `--sp-4` (16 px) oder Schriftgröße |
| `10px` | 19 | `--sp-3` (12 px) |
| `13px` | 17 | Schriftgröße `--fs-small` |
| `11px` | 11 | `--fs-tiny` |
| `6px` | 11 | `--sp-2` (8 px) |
| `7px` | 10 | `--sp-2` (8 px) |
| `3px` | 10 | `--sp-1` (4 px) |

---

## 4. Inline-Stile in Komponenten

Die neuen Bausteine (`src/components/ui/index.tsx`) und die neuen Seiten
(Hub, Live, Statistik) verwenden durchgehend `var(--sp-*)`, `var(--fs-*)` und
`var(--radius*)` statt Zahlen. Die Ausnahmen sind einzeln kommentiert und
betreffen feste Bildmaße (Diagramm-Kantenlänge, Icon-Größen).

Der Bestand der älteren Seiten enthält weiterhin Inline-Pixelwerte. Auch hier
gilt: Sie zu ändern heißt, das Aussehen zu ändern — das gehört bildschirmweise
gemacht, nicht per Suchen-und-Ersetzen.
