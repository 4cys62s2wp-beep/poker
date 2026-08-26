# Datenschnittstelle: Generator → App

Was das Frontend liest, in welcher Form, und was passiert, wenn etwas nicht
stimmt.

---

## Zwei Schichten, und warum

| | Wo | Wofür |
|---|---|---|
| **Nachweis** | `tools/poker-math/output/*.json` | Vollständig: Annahmen, Belege, ganze Verteilungen, Befunde. Für die Prüfung und für spätere Nachfragen |
| **Anzeige** | `public/pokermath/*.json` | Verschlankt auf das, was ein Bildschirm braucht |

Erzeugt wird die zweite Schicht aus der ersten von
`src/app_schnittstelle.py` — der **einzigen** Stelle, an der aus einem
Rechenergebnis Anzeigedaten werden. Damit gibt es genau einen Ort, an dem sich
ein Feldname ändern kann.

Das Skript schreibt beide Kopien in einem Zug, auch die nach `public/`. Ein
manueller Kopierschritt wäre eine Fehlerquelle: Er wird irgendwann vergessen,
und dann zeigt die App wochenlang alte Zahlen, ohne dass es auffällt.

---

## Die Feldnamen bleiben deutsch

Sie heißen in der App genauso wie im Generator. Das sieht in einer
TypeScript-Datei zunächst fremd aus, ist aber Absicht: Eine
Übersetzungsschicht ist genau die Stelle, an der `turn_oder_river` irgendwann
auf das Turn-Feld gemappt wird und es niemandem auffällt. Die Namen bleiben
von der Rechnung bis zum Bildschirm dieselben.

---

## Der Vertrag

Jede App-Datei trägt `vertrag_version`. Passt sie nicht zu
`ERWARTETE_VERTRAG_VERSION` in `src/lib/pokermath/typen.ts`, wird die Datei
**abgelehnt** — auch dann, wenn sie sonst gültig aussieht.

Genau dafür ist die Version da: Ein Feld kann seine Bedeutung ändern, ohne
seinen Typ zu ändern. Dann sieht die falsche Zahl völlig richtig aus.

**Erhöhen** bei: Feld verschwindet · Bedeutung eines Feldes wechselt ·
Einheit ändert sich (Anteil statt Prozent).
**Nicht erhöhen** bei: neues Feld. Was die App nicht kennt, ignoriert sie.

---

## Was jede Datei trägt

```
vertrag_version   Zahl
block             welcher Rechenblock
methode           "exakt" oder "monte-carlo"
erzeugt_am        Zeitstempel des Laufs
annahmen          sicht · unbekannte_karten · split_pot
quelle            Pfad zur vollständigen Fassung
befunde           Sätze über die Daten, im Generator ERZEUGT
```

**Der Annahmenblock ist nicht optional.** Fehlt er, wird die Datei abgelehnt.
Eine Wahrscheinlichkeit ohne ihre Annahme ist nicht ungenau, sondern
bedeutungslos — und die App zeigt sie an, wo sie Zahlen zeigt.

**Befunde sind erzeugt, nicht geschrieben.** Die App darf sie anzeigen, aber
nicht umformulieren: Sie gehören den Zahlen (siehe `ENTSCHEIDUNGEN.md`,
E-015).

---

## Die vier Blöcke

### `b1_outs.json` — rund 8 KB

| Feld | Inhalt |
|---|---|
| `outs[]` | Je Outs-Zahl: `turn`, `river_nach_fehlschlag`, `turn_oder_river` (alle 0..1), dazu `regel_zwei_karten` und `regel_abweichung_pp` |
| `zugbilder[]` | Flushdraw, offene Straße, Gutshot … je mit `outs` (richtig gezählt) und `outs_falsch_gezaehlt` (mit Boardtreffern) |
| `gegenbeispiele[]` | Drei nachgerechnete Fälle, in denen ein Out die Hand verbessert und man trotzdem verliert |

**Für den Trainer:** `turn_oder_river` gilt nur, wenn beide Karten auch
wirklich kommen. Wer nach dem Turn erneut zahlen muss, braucht
`river_nach_fehlschlag`. Die App muss wissen, welche Situation sie zeigt.

### `b2_potodds.json` — rund 3 KB

| Feld | Inhalt |
|---|---|
| `einsatzgroessen[]` | `noetige_equity` (0..1), `pot_odds_zu_eins`, `mindest_outs_turn/_river/_beide` |

`mindest_outs_*` kann `null` sein: Mit bis zu 21 Outs nicht erreichbar. Die
App muss das darstellen können und darf nicht `0` daraus machen.

### `b3_kombinatorik.json` — rund 15 KB

| Feld | Inhalt |
|---|---|
| `kombos_je_typ` | Paar / suited / offsuit / zusammen |
| `blocker` | Je Handtyp und Anzahl bekannter Karten: schlimmster, bester, mittlerer Fall |
| `beispiel.je_starthand[]` | Alle 169 Klassen an einem Beispielboard, vorher/nachher |

Die vollständigen Blocker-Verteilungen bleiben in der Nachweis-Fassung. Die
App bekommt die drei Kennzahlen — mehr braucht ein Bildschirm nicht.

### `b4_preflop_equity.json` — Größe steht nach dem Lauf fest

| Feld | Inhalt |
|---|---|
| `matchups[]` | `a`, `b`, `equity_a` (0..1), `spanne_pp`, `spanne_relevant` |
| `matchups[].farbkonfigurationen[]` | **Nur bei `spanne_relevant`** |

**Die Regel, die die App einhalten muss:** Ist `spanne_relevant` wahr, hängt
die Equity um mehr als einen Prozentpunkt davon ab, wie die Farben zwischen
den Händen liegen. Dann darf **kein Einzelwert ohne die Spanne** angezeigt
werden.

Der Loader setzt das durch: Ist das Kennzeichen gesetzt und fehlen die
Konfigurationen, wird die ganze Datei abgelehnt. Die App kann also nicht in
einen Zustand geraten, in dem sie die Regel verletzen möchte und es nicht
merkt.

Die vollständige Fassung trägt zusätzlich Boardzahlen und Siege je
Konfiguration — mehrere Dutzend Megabyte, für die Anzeige unnötig.

---

## Wie die App lädt

`src/lib/pokermath/laden.ts`, nach demselben Muster wie `monetization.json`
und `legal.json`:

```ts
const daten = await ladeB1();
if (!daten) { /* Zahlen fehlen – das sagen, nicht raten */ }
```

**Bei jedem Zweifel `null`.** Eine Seite ohne Zahlen kann sagen „Daten
fehlen"; eine Seite mit falschen Zahlen bringt jemandem etwas Falsches bei.

Abgelehnt wird unter anderem:

- falsche `vertrag_version`, falscher `block`, unbekannte `methode`
- fehlender Annahmenblock
- `NaN`, `Infinity`, Wahrscheinlichkeiten außerhalb 0..1
- eine nötige Equity über 50 % (mathematisch unmöglich — der Gegner legt
  denselben Betrag hinein)
- `turn_oder_river` kleiner als `turn` (zwei Straßen können nie schlechter
  sein als eine)
- eine Blocker-Zeile, in der `vorher − nachher ≠ weggeblockt`
- **eine einzelne unbrauchbare Zeile** — dann fällt die ganze Datei durch.
  Eine Tabelle mit stillschweigend fehlender Zeile ist gefährlicher als gar
  keine Tabelle.

Die letzten vier sind keine Typprüfungen, sondern Aussagen über die Sache
selbst. Sie fangen genau die Fehler, bei denen jeder Einzelwert für sich
gültig aussieht.

`b4` ist groß und wird **erst geladen, wenn jemand die Equity-Ansicht
öffnet** — nicht beim Start.

---

## Wenn sich etwas ändert

```bash
cd tools/poker-math
PYTHONPATH=src .venv/bin/python src/app_schnittstelle.py   # schreibt beide Kopien
cd ../.. && npx vitest run src/lib/__tests__/pokermath.test.ts
```

Der Test liest die **echten** Dateien aus `public/pokermath/`, nicht erfundene.
Ein Test mit selbstgebauten Daten würde nur prüfen, dass die Prüfung zu sich
selbst passt.
