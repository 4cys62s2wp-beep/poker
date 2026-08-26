# Bericht zum Nachtlauf, 26. auf 27. August 2026

Kurz, sachlich, ohne Beschönigung. Wer wenig Zeit hat, liest die ersten
beiden Abschnitte und dann „Was Sie entscheiden müssen".

Der laufende Verlauf steht in `NACHTLAUF.log`, eine Zeile je Ereignis. Der
Stand für eine frische Sitzung ohne Kontext steht in `STATUS.md`.

---

## In einem Absatz

Alle fünf Phasen des Auftrags sind abgeschlossen, und die Warteschlange ist
leer. Der Live-Bereich ist neu und vollständig: Chipverteilung,
Blindstruktur, Uhr, Erfassung am Tisch, Abendarchiv. Das Designfundament
steht und wird an vier Stellen gemessen statt behauptet. Fünf echte Mängel
sind dabei gefunden und behoben worden, zwei davon betrafen jeden Bildschirm
der App. **Der B4-Rechenlauf ist um 23:00 Uhr durchgelaufen** — die
vollständige Preflop-Equity-Matrix liegt in der App, und die vier bis dahin
übersprungenen Tests laufen. Offen ist damit nur noch eine einzige Sache, und
die ist keine technische: ob der Online-Tisch in die App gehört.

---

## Was fertig und geprüft ist

| Phase | Ergebnis |
|-------|----------|
| Teil C | Alle vier offenen Punkte beantwortet; einer davon deckte einen Zählfehler in der Dokumentation auf |
| 0 | Bestandsaufnahme in `BESTAND.md` |
| 1 | Designfundament: fünf Schriftstufen nach Verwendung benannt, eine Akzentfarbe, Kontrast gerechnet, Haptik an einer Stelle für die ganze App |
| 2 | Startseite mit drei ungleich gewichteten Einstiegen; jeder Bildschirm in höchstens zwei Berührungen, keine Sackgasse |
| 3 | Live-Session vollständig, vom Koffer bis zur laufenden Uhr |
| 4 | Abende führen, ablegen und über einen Namen wiederfinden |
| 5 | `BACKLOG.md` mit zwölf beschriebenen, nicht gebauten Einträgen |

**19 Commits, 69 Dateien, rund 8800 Zeilen.**

**Geprüft wird mit:**

- 754 Tests, grün. Typprüfung sauber, `npm run build` baut durch.
- Vier Browserläufe an der gebauten App, alle ohne Beanstandung:
  `npm run wege` (Erreichbarkeit, 49 Bildschirme),
  `npm run tisch` (Lesbarkeit am Tisch, zwei Gerätebreiten),
  `npm run durchgang` (ein vollständiger Abend plus Lernbildschirm, 20 Schritte),
  `npm run pruefen` (Kontrast, Tippflächen, Abstände, 49 Bildschirme).

**Drei Dinge, die vorher behauptet und jetzt gemessen sind:**

- **Ohne Netz.** Der Durchgang schaltet das Netz im Browser wirklich ab und
  lädt neu. Der Tisch kommt zurück, die Uhr läuft weiter, der Abend ist da.
  Vorher war das aus dem Quelltext geschlossen.
- **Der Weg von B4 in die App.** Er war gebaut, aber noch nie gelaufen — die
  Datei entsteht erst nach Stunden. Jetzt läuft er in einem Test gegen eine
  Probe mit drei Handpaaren und wird von derselben Ladeprüfung angenommen,
  die im Browser läuft. Wenn der Rechenlauf durch ist, scheitert dieser
  Schritt nicht mehr an der Form.
- **Die Zahlen im Lehrtext.** Sechzehn Sätze der Art „9 Outs × 4 = 36 %,
  exakt 35,0 %" werden gegen die gerechneten Daten gehalten. Alle stimmen.
  Gegen genau diese Art von abgeschriebener Zahl ist das ganze Projekt
  gebaut.

---

## Was dabei an echten Mängeln gefunden wurde

Nicht Verbesserungen — Fehler, die vorher da waren:

1. **Der Zurück-Link war 29 Pixel hoch** statt der geforderten 44, auf allen
   49 Bildschirmen. Gefunden von der Messung am gerenderten Ergebnis; im
   Quelltext war nichts zu sehen.
2. **Herz und Kreuz auf den Spielkarten** lagen bei 4,07 und 3,94 zu 1 statt
   der geforderten 4,5. Betrifft 38 beziehungsweise 11 Bildschirme.
3. **Die drei Ziele der unteren Navigationsleiste berührten einander.** Zwei
   Flächen ohne Abstand sind eine Fläche mit zwei Bedeutungen.
4. **Die Fortsetzen-Karte führte ins Menü statt in die laufende Runde.** Beim
   Bau in Phase 2 gab es den Tischbildschirm noch nicht; der Zwischenschritt
   war stehengeblieben.
5. **Die haptische Rückmeldung galt in drei von 43 Bildschirmen.** Sie war
   sauber gebaut — aber nur dort, wo jemand daran gedacht hatte.

Alle fünf behoben. Alle fünf sind jetzt durch eine Messung abgesichert, die
beim nächsten Mal von selbst anschlägt.

---

## B4 — durchgelaufen

Die vollständige Preflop-Equity-Matrix: **14 365 von 14 365 Handpaaren**,
exakt enumeriert über sämtliche Boards. Keine Simulation, keine Stichprobe.
Rund fünfeinhalb Stunden auf vier Kernen, 80 625 607 595 gezählte Einzelfälle.

Die Datei prüft sich beim Zusammenbauen selbst, und alle drei Prüfungen gehen
auf: Die Equity beider Seiten summiert sich bei jedem Paar auf eins, geteilte
Pötte zählen für beide Seiten zur Hälfte, eine Hand gegen sich selbst bekommt
genau 50 %. Eine Abweichung hätte abgebrochen, statt eine Datei zu schreiben,
die richtig aussieht.

Zwei Befunde, beide aus den Daten erzeugt:

- Bei **7408 von 14 365** Handpaaren hängt die Equity um mehr als einen
  Prozentpunkt davon ab, wie die Farben zwischen den Händen liegen. Das ist
  gut die Hälfte. Eine Tabelle, die nur einen Mittelwert je Handpaar nennt,
  verschweigt bei jedem zweiten Paar etwas — und genau daraus entstehen die
  widersprüchlichen Tabellen im Netz.
- Am stärksten wirkt die Farbbeziehung bei **92s gegen JTs**: zwischen
  28,24 % und 32,20 %, also 3,96 Prozentpunkte.

`npm run daten` lief beim ersten Versuch durch. Das war kein Glück: Der Weg
war zwei Stunden vorher gegen eine Probe mit drei Handpaaren geprüft worden,
weil ein Formfehler nach fünfeinhalb Stunden Rechnung die schlechteste Zeit
für einen Fehler gewesen wäre.

**Eine Zahl zum Nachdenken:** Die Anzeigefassung ist **5,0 MB** groß und wird
für den Offline-Betrieb mitgespeichert. Das ist der Preis für „jede Zahl aus
den gerechneten Daten". Ob das so bleiben soll oder ob die Matrix nachgeladen
statt mitgeliefert wird, steht in `BACKLOG.md`.

---

## Die Warteschlange ist leer

Beide technischen Einträge sind nach dem Ende des Rechenlaufs abgearbeitet:

- **W-002 war ein echter Fehler.** Der Kopfkommentar von
  `b4_preflop_equity.py` nannte über Monate 47 008 wirklich verschiedene
  Rechnungen. Es sind 47 086. Die 78 fehlenden sind genau die Handpaare aus
  derselben Rangkombination, einmal offsuit und einmal suited. Gerechnet
  wurde immer richtig — nur die Beschreibung war falsch, und niemandem fiel
  es auf, weil keine Prüfung sie anfasste. Neun Tests zählen sie jetzt nach.
- **W-001 wurde anders erledigt als geplant.** Die von Ihnen verlangte
  Grundlage der Restzeitschätzung war bereits im Code. Meine eigene
  Verschärfung hätte hier nichts gebracht (nachgemessen: 3,26 gegen 3,28) und
  eine halbe Minute Vorlauf je Start gekostet. Der eigentliche Mangel war,
  dass die Grundlage nirgends stand. Sie steht jetzt in einer eigenen,
  prüfbaren Funktion und im Startprotokoll. Begründung in E-029.
- **W-003** ist keine technische Sperre, sondern eine Frage an Sie. Siehe
  unten.

---

## Entscheidungen, die ich selbst getroffen habe

Alle mit Begründung und verworfener Alternative in `ENTSCHEIDUNGEN.md`. Die
sieben aus dieser Nacht:

| Nr. | Entscheidung | Warum sie Sie interessieren könnte |
|-----|--------------|-----------------------------------|
| E-021 | Der Apple-Wurzelzertifikat-Fingerabdruck ist aus dem Code entfernt, die Prüfung bleibt Pflicht | Ich bin von Ihrer Angabe abgewichen: Sie nannten Eintrag Nr. 2 in `docs/TODO_MANUELL.md`, der Apple-Eintrag ist Nr. 3. Nr. 2 („Impressum als Minderjähriger") habe ich **nicht** angefasst |
| E-022 | Freunde-Rangliste bleibt gestrichen, der Eintrag durchgestrichen statt gelöscht | Ein gelöschter Eintrag kommt in einem halben Jahr als „gute Idee" zurück |
| E-023 | Vorschaukarte und Router-Umbau bleiben ungebaut, als **eine** Entscheidung | Damit ist B-007 geschlossen; fällig, sobald das Hosting feststeht |
| E-024 | Die Restzeitschätzung von B4 bleibt, wie sie ist | Ihr Verdacht traf hier nicht zu — nachgemessen: 3,26 gegen 3,28 Konfigurationen je Handpaar. Dabei fiel der Zählfehler auf |
| E-025 | Eine Akzentfarbe gilt ab jetzt als Regel; die 47 alten Dateien werden **nicht** heute Nacht umgestellt | Ein Umbau von 47 Dateien ohne Prüfung durch einen Menschen ist genau die Nachtaktion, die man morgens bereut |
| E-026 | Ergebniszahlen bekommen zwei eigene Farben | Die vorhandenen Zustandsfarben erreichen 4,73 zu 1; für eine Ergebniszahl verlangt Ihr Auftrag sieben |
| E-027 | Das Tischgerät verliert Stufennummer und Spielerzahl | Damit die drei übrigen Angaben groß genug für zwei Meter werden. Nachgerechnet: 56,5 Pixel sind nötig |
| E-028 | Die untere Navigationsleiste bekommt Abstände | Kostet 16 von 390 Pixeln. Die Ausnahme hätte gekostet, dass die nächste leichter fällt |
| E-029 | Die Restzeitschätzung bleibt bei Handpaaren statt Farbkonfigurationen | Ich weiche hier von meiner eigenen Vorgabe in W-001 ab — die feinere Grundlage kommt nachgemessen aufs Gleiche und kostet Vorlauf |

---

## Was Sie entscheiden müssen

**1. Gehört der Online-Tisch noch in die App? (W-003)**

Ihr inhaltlicher Rahmen erlaubt zwei Arten von Inhalt: reine
Zahlenverwaltung und Lehrmaterial als Standbild. Unter
`/session/tisch/online` liegt ein Tisch, an dem mehrere Geräte über einen
Code zusammen spielen — mit Punkten, nicht mit Geld. Das ist kein
Glücksspiel, aber es ist gespieltes Poker und nicht verwaltetes. Dasselbe
gilt für den Ein-Geräte-Tisch unter `/session/tisch`.

Entscheiden Sie streng, fallen beide. Der Bildschirm liegt seit Phase 2 so,
dass er sich ohne Bruch entfernen lässt, und der Wegetest bestätigt es
sofort.

**2. Sollen die 47 alten Dateien auf das Designfundament umgestellt werden?**

Die neuen Bildschirme benutzen die Schriftstufen und die eine Akzentfarbe.
Die alten benutzen ihre eigenen Werte — heute 947 Stellen, festgehalten von
einer Sperrklinke, die nur bei Zuwachs anschlägt. Der Umbau ist mechanisch,
aber breit; er gehört in eine Sitzung mit Sichtprüfung, nicht in eine Nacht.
Als Eintrag in `BACKLOG.md` beschrieben.

**3. Nur zur Kenntnis: Auf iPhones gibt es keine Vibration.**

`navigator.vibrate` existiert dort nicht. Ihre Anweisung „haptische
Rückmeldung bei jeder bestätigten Eingabe" ist auf Android und im Browser
umgesetzt; auf einem iPhone bleibt die App stumm, und daran ändert kein
Code etwas. Das steht auch in `DESIGN.md` 4.3, damit niemand den fehlenden
Stoß für einen Fehler hält.

---

## Was ich als nächsten Schritt empfehle

**Den Live-Bereich einmal an einem echten Abend benutzen, bevor irgendetwas
anderes gebaut wird.**

Er ist vollständig geprüft, aber alles daran ist gerechnet und gemessen —
nichts davon ist erlebt. Ein Abend zu fünft mit einem echten Koffer
beantwortet in drei Stunden Fragen, für die ich hier nur Annahmen habe: ob
zwanzig Minuten je Stufe sich richtig anfühlen, ob die Vorwarnung eine
Minute vorher reicht, ob die Erfassung wirklich niemanden unterbricht, ob
die Uhr aus zwei Metern tatsächlich lesbar ist und nicht nur rechnerisch.

Danach erst: die Entscheidung zu W-003, dann der Umbau der alten
Bildschirme.

Was ich **nicht** empfehle: neue Funktionen. Der Backlog hat zwölf
beschriebene Einträge; keiner davon ist so wertvoll wie die Antwort auf die
Frage, ob das Gebaute am Tisch funktioniert.
