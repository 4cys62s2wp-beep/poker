# Entscheidungen

Jede Entscheidung, die ohne Rückfrage getroffen wurde: was gewählt wurde, welche
Alternative es gab, warum. Neueste zuletzt.

Format: **E-nnn** · Datum · Phase

---

## E-001 · 2026-08-25 · Phase 1

**Serverseitiger Entitlement-Service wird gebaut, aber nicht deployt.**

Phase 1.3 verlangt eine serverseitige Wahrheitsquelle. PokerMentor ist eine
statische PWA auf GitHub Pages — ohne Server. Serverseitig heißt hier Firebase
Cloud Functions, und die verlangen den Blaze-Tarif, also ein Abrechnungskonto
mit Zahlungsmittel. Das ist derzeit nicht verfügbar (siehe `BLOCKER.md`,
B-001).

- **Gewählt:** Der komplette Funktionscode entsteht unter `functions/`, mit
  Tests gegen den Firebase-Emulator. Deploybar, sobald die Konten existieren.
- **Alternative A — Prüfung im Client lassen:** verstößt gegen die
  Anforderung und ist fälschbar. Verworfen.
- **Alternative B — fremder Server (Vercel/Cloudflare):** würde funktionieren
  und ist kostenlos, führt aber einen zweiten Anbieter neben Firebase ein,
  mit eigener Authentifizierung gegen Firebase-Tokens. Mehr bewegliche Teile
  für dieselbe Sache. Verworfen zugunsten der konservativen Option: bei dem
  bleiben, was schon da ist.
- **Folge:** Bis zum Deploy bleibt die Monetarisierung aus. Die App verhält
  sich unverändert als Gratis-Version — genau wie heute.

---

## E-002 · 2026-08-25 · Phase 1

**Kein PayPal.**

Die Aufgabe ließ PayPal offen und bat um eine begründete Abwägung.

- **Gewählt:** Stripe allein für den Web-Weg, StoreKit für iOS.
- **Begründung:** Bei wiederkehrenden Abos ist PayPal der schwächere Partner.
  Die Abo-API kennt keine mit Stripe vergleichbare Ereignis-Semantik für
  Zustände wie „Zahlung fehlgeschlagen, Wiederholung läuft"; Statuswechsel
  kommen später und gröber. Für ein Berechtigungssystem, das genau von diesen
  Übergängen lebt, ist das die falsche Grundlage. Dazu kommt: Ein zweiter
  Web-Anbieter verdoppelt Webhook-Härtung, Idempotenz und Statusabbildung —
  für eine Zahlungsart, die Stripe über PayPal-als-Zahlungsmethode ohnehin
  teilweise abdeckt.
- **Wenn es später doch sein soll:** Die Abstraktion aus 1.2 nimmt einen
  dritten Provider auf, ohne dass Frontend oder Berechtigungslogik es merken.
  Genau dafür ist sie da.

---

## E-003 · 2026-08-25 · Phase 1

**Lerninhalte bleiben im Bundle — die Paywall schützt den Status, nicht die Bytes.**

Der Umbau macht den Abo-*Status* fälschungssicher (nur ein signaturgeprüfter
Webhook schreibt ihn). Die Lern-*Inhalte* liegen weiterhin im
JavaScript-Bundle und sind für jeden lesbar, der die Entwicklerwerkzeuge
öffnet.

- **Gewählt:** So belassen, ehrlich dokumentiert.
- **Alternative — Inhalte serverseitig ausliefern:** technisch machbar, aber
  ein eigener großer Umbau (Inhalte aus dem Bundle lösen, authentifizierte
  Auslieferung, Offline-Fähigkeit der PWA neu denken). Verworfen: Bei einem
  5-€-Abo im Anfänger- und Freundesumfeld steht der Aufwand nicht im
  Verhältnis, und die Offline-Fähigkeit ist ein echtes Produktmerkmal, das
  dabei verloren ginge.
- **Wichtig:** Das ist eine bewusste Abwägung, kein Versehen. Wer später
  hochpreisige Inhalte verkauft, muss sie neu treffen.

---

## E-004 · 2026-08-25 · Phase 1

**Bestehende Gating-Aufrufe werden jetzt nicht angefasst.**

Rund zwölf Seiten fragen heute `enabled/pro/trialActive` einzeln ab, statt ein
gebündeltes `hasAccess(feature)` zu nutzen. Die Aufgabe verlangt, dass das
Frontend nur `hasAccess(feature)` kennt.

- **Gewählt:** Die Zusammenfassung erfolgt in Phase 2, wenn diese Screens für
  die neue Informationsarchitektur ohnehin umgebaut werden.
- **Begründung:** Die Seiten sind bereits provider-blind — die Anforderung
  „kein providerspezifischer Code außerhalb der Implementierungen" ist erfüllt.
  Sie jetzt zusätzlich anzufassen wäre Änderung ohne Funktionsgewinn, mit
  Regressionsrisiko an zwölf Stellen, die anschließend in Phase 2 erneut
  angefasst würden.
- **Nicht vergessen:** Steht als offener Punkt in `STATUS.md`.

---

## E-005 · 2026-08-26 · Phase 3.2

**Off-Scale-Abstände werden nicht automatisch auf das Raster gerundet.**

Die Aufgabe verlangt „keine Magic Numbers im CSS". Rund 110 Abstandswerte
liegen neben der 4er-Skala (3, 5, 6, 7, 9, 11, 13, 15 px).

- **Gewählt:** Sie bleiben stehen, mit vollständiger Liste in
  `docs/TOKEN_AUDIT.md` und einem priorisierten Eintrag in
  `docs/TODO_MANUELL.md`.
- **Verworfene Alternative:** Alle auf den nächsten Rasterwert runden.
- **Begründung:** Ein `7px` in `8px` zu ändern ist eine **optische Änderung**,
  kein Refactoring. Einzeln ist jede unauffällig; 110 auf einmal, ohne dass ein
  Mensch das Ergebnis sieht, verschieben das Bild in eine Richtung, die niemand
  beabsichtigt hat. Die Vorgabe „bestehende Funktionalität darf nicht kaputt
  gehen" schließt das Aussehen ein.
- **Stattdessen erfüllt:** Die schärfere und überprüfbare Regel *kein Wert, der
  mehr als einmal vorkommt, bleibt namenlos* — bei Farben zu 100 %, nachprüfbar
  mit dem Einzeiler in `docs/TOKEN_AUDIT.md`.

---

## E-006 · 2026-08-26 · Phase 3.2

**68 einmal verwendete Farbwerte bekommen keinen Token.**

- **Gewählt:** Nur Werte mit mehr als einer Verwendung werden benannt (63 Stück
  umgestellt, danach null Wiederholungen übrig).
- **Verworfene Alternative:** Jeden Literalwert in einen Token heben — das wäre
  die wörtliche Lesart von „keine Magic Numbers".
- **Begründung:** 68 Tokens mit je einer Verwendung koppeln nichts, was
  zusammengehört. Sie blähen die Token-Liste auf das Anderthalbfache und machen
  die echten Kopplungen unauffindbar. Ein Token ist ein Werkzeug gegen
  Auseinanderdriften — wo nichts driften kann, ist er Ballast.

---

## E-007 · 2026-08-26 · Phase 3.5

**Der Anker der Testphase liegt lokal, nicht auf dem Server.**

Im Gating-Test zeigte sich: Wer `trialStartedAt` im Browser-Speicher
zurücksetzt, bekommt beliebig oft neue sieben Tage.

- **Gewählt:** Ein getrennt abgelegter Anker (localStorage **und**
  IndexedDB-Spiegel) hält den frühesten je gesehenen Beginn fest; beim Laden
  gewinnt der frühere Wert (`src/lib/pro/trialAnchor.ts`, 8 Tests).
- **Verworfene Alternative:** Den Beginn beim ersten Anmelden serverseitig
  festschreiben.
- **Begründung:** Die serverseitige Lösung setzt laufende Cloud Functions
  voraus — die sind blockiert (`BLOCKER.md` B-001). Sie würde außerdem ein
  Konto erzwingen, obwohl die Testphase bewusst ohne Konto funktionieren soll.
- **Was der Anker nicht leistet:** Wer den gesamten Speicher löscht, bekommt
  eine neue Testphase — und verliert dabei allen Lernfortschritt. Für ein
  5-€-Abo ist das eine angemessene Hürde. Als offener Punkt O-6 in `STATUS.md`
  und als Nr. 10 in `docs/TODO_MANUELL.md` vermerkt.
- **Nicht betroffen:** Das bezahlte Abo. Dessen Status kommt aus
  `entitlements/{uid}` und darf laut `firestore.rules` nur der Server
  schreiben — durch Emulator-Tests belegt.

---

## E-008 · 2026-08-26 · Phase 1.3 (nachgetragen)

**Der iOS-Kauf verlangt eine Anmeldung, bevor er stattfindet.**

Die Aufgabe verlangte, die Konto-Verknüpfung zwischen iOS und Web zu
skizzieren: Jemand kauft in der App und öffnet danach die Web-App. Der
Entwurf steht jetzt in `docs/STATUSMASCHINE.md`, Abschnitt 8.

- **Gewählt:** Ohne angemeldetes Konto kein Kauf. Nach `purchase()` schickt
  die native Hülle `originalTransactionId` zusammen mit dem Firebase-ID-Token
  an unsere Function, die daraus die Zuordnung schreibt.
- **Verworfene Alternative:** Anonymer Kauf, spätere Verknüpfung über „Käufe
  wiederherstellen".
- **Begründung:** Ein Kauf ohne uid ist ein Kauf ohne Besitzer. Ihn
  nachträglich zuzuordnen hieße, dem Gerät zu glauben, das sich meldet — und
  wer zuerst kommt, bekommt das Abo. Apple erlaubt eine Anmeldepflicht
  ausdrücklich, wenn das Abo geräteübergreifend gilt; genau das ist hier der
  Fall.

**Zweite Entscheidung im selben Zug: Die erste Zuordnung gewinnt.** Beansprucht
ein zweites Konto denselben `originalTransactionId`, wird das abgelehnt statt
umgeschrieben. Sonst ließe sich ein Abo durch bloßes Wiederherstellen von
Konto zu Konto weiterreichen, und der ursprüngliche Käufer verlöre still
seinen Zugang. Ein echter Umzug braucht einen Menschen — selten genug, um ihn
von Hand zu machen, und zu gefährlich, um ihn zu automatisieren.

---

## E-009 · 2026-08-26 · Scope-Korrektur

**Kein aktiver Bezahl-Layer. Ein Schalter, nicht ein Rückbau.**

Neue Vorgabe nach Marktrecherche: Kein Feature ist kostenpflichtig, alle
Features sind frei zugänglich. Die Architektur aus Phase 1 bleibt vollständig
bestehen.

- **Gewählt:** `"enabled": false` in `public/monetization.json` bleibt der
  eine Schalter. Zusätzlich bekommt der Kontext einen abgeleiteten Wert
  `fullAccess`, den die Oberfläche liest, statt die Regel selbst zu bilden.
- **Verworfene Alternative 1:** Ein zweiter Schalter (`allFree: true`) neben
  `enabled`. Zwei Schalter für einen Zustand sind ein Widerspruch, der
  irgendwann eintritt — dann steht einer auf „frei" und der andere auf „zahlen".
- **Verworfene Alternative 2:** Die Gating-Aufrufe entfernen. Genau das war
  ausgeschlossen, und zu Recht: Sie wieder einzubauen wäre teurer als sie
  stehenzulassen, und ungeprüfter neuer Code ist gefährlicher als geprüfter
  alter.

**Was sich dabei herausstellte:** Acht Seiten bildeten die Regel
`!enabled || pro || trialActive` **selbst**. Das Ergebnis stimmte überall,
aber es waren acht Kopien derselben Entscheidung — und damit acht Stellen, an
denen der „eine Konfigurationswert" beim nächsten Umbau nicht mehr reicht. Sie
lesen jetzt alle denselben Wert. Offener Punkt O-1 ist damit wirklich
erledigt, nicht nur fast.

**Abgesichert:** Ein Test liest die **ausgelieferte**
`public/monetization.json` und prüft, dass ein frischer Nutzer ohne Abo und
ohne Testphase auf **jedes** Feature Vollzugriff hat. Wer den Wert
versehentlich umlegt, sieht es im Testlauf und nicht beim Nutzer.

---

## E-010 · 2026-08-26 · Scope-Korrektur

**Phase 4 wird beschnitten — festgehalten, bevor sie beginnt.**

Ersatzlos gestrichen: Modus B (animierter Pokertisch), Multiplayer-
Vorbereitung, `MULTIPLAYER_SPÄTER.md`.

**Begründung (übernommen):** Simulierte Pokertische mit Spielgeld-Ökonomie
treiben die Altersfreigabe hoch — Apple 17+/18+, in Deutschland § 10b JuSchG
bei glücksspielähnlichen Mechanismen. Das kostet Reichweite, ohne Umsatz zu
bringen.

**Es bleibt:** 4.1 Zustandsmodell · 4.2 nur Modus A (kompakt) · 4.3 Gesten mit
asymmetrischer Sicherheit · 4.4 Onboarding · 4.5 **Szenario-Drill** statt
Hand-Replayer · 4.6 kein Echtgeld.

**4.5 neu gerahmt:** Kein Poker-Spiel, sondern ein Drill. Eine Situation, eine
Entscheidung, eine Auflösung. Keine Chip-Ökonomie, kein Spielgeld-Guthaben,
keine Sitzung über mehrere Hände mit Stackverlauf.

**Nichts davon war begonnen.** Im Baum steht kein Modus-B-Code, keine
Multiplayer-Vorbereitung und kein Replayer — es gibt also nichts zu
entfernen. Der Auftrag für Phase 4 (die Punkte 4.1–4.6 im Wortlaut) liegt mir
nicht vor; festgehalten ist hier nur, was davon **nicht** gebaut wird.

**Offene Spannung, die ich nicht allein auflösen darf:** Dieselbe Begründung
trifft auf drei Dinge zu, die **bereits gebaut, getestet und live** sind — den
Übungstisch gegen Bots, den Pokerabend-Tisch und den Online-Tisch. Sie haben
keine Spielgeld-Ökonomie (kein Guthaben, kein Chipkauf, kein Verlauf über
Sitzungen), aber sie sind simulierte Pokertische. Gestrichen wurde
ausdrücklich die *Vorbereitung*, nicht der Bestand — und die stehende Regel
lautet, dass nichts Funktionstragendes ohne Ersatz gelöscht wird. Deshalb
bleibt der Bestand **unangetastet**, und die Frage steht als Nr. 1 in
`docs/TODO_MANUELL.md`.

---

## E-011 · 2026-08-26 · Scope-Korrektur

**Hub-Struktur endgültig: Lernen · Nachschlagen · Live-Session.**

Die bisherige Gliederung (Lernen · Live spielen · Session-Tools) wird ersetzt.
Kein vierter Einstieg — der Platzhalter „Mit Freunden spielen" entfällt.

Die neue Trennlinie ist nicht das Thema, sondern die **Absicht**:

| Bereich | Woran man ihn erkennt |
|---|---|
| **Lernen** | Es gibt einen Fortschritt. Man kommt wieder und ist weiter als vorher |
| **Nachschlagen** | Es gibt keinen Fortschritt. Man will eine Antwort und ist danach fertig |
| **Live-Session** | Man sitzt am echten Tisch. Die App zählt, rechnet, verwaltet |

**Zuordnungen, die eine Entscheidung verlangten:**

- **Übungstisch → Lernen.** Er ist die Übung zum Kurs und speist die
  Spielstil-Analyse. Unter „Live-Session" wäre er das einzige, was *nicht* am
  echten Tisch passiert.
- **Spielstil-Analyse → Lernen.** Sie zeigt Fortschritt. Genau das ist das
  Merkmal von „Lernen".
- **Live-Coach → Nachschlagen.** „Ich habe diese Hand, was tun?" ist eine
  Frage mit einer Antwort, kein Fortschritt. Verworfen: Live-Session — dort
  gehört hin, was der Tisch *braucht*, nicht was ein Spieler *fragt*.
- **Pokerabend + Online-Tisch → Live-Session.** Beide sind Werkzeuge für einen
  echten Abend: Sie verwalten Karten, Chips und Blinds für Menschen, die
  zusammensitzen.
- **Bankroll → Live-Session.** Er erfasst Ergebnisse echter Sitzungen.
  Verworfen: ein eigener vierter Bereich — es gibt keinen vierten Einstieg.
- **Glossar → Nachschlagen.** Es lag unter „Lernen", hat aber keinen
  Fortschritt. Es ist das Musterbeispiel für Nachschlagen.

**Alle alten Adressen leiten weiter.** Keine einzige Seite wird unerreichbar;
das wird wie in Phase 3.3 im Browser nachgeklickt, nicht am Quelltext
behauptet.

---

## E-012 · 2026-08-26 · Poker-Mathematik

**Hand-Evaluator: `eval7`.**

Vier Kandidaten waren zu vergleichen. Die Kriterien lauteten Geschwindigkeit,
Korrektheit, Wartungsstand und Lizenz.

### Der Befund, der die Entscheidung verschoben hat

**Alle vier sind nachweislich korrekt.** Jede wurde über **alle 2 598 960**
Fünfkartenblätter gegen einen unabhängig geschriebenen Regel-Evaluator
gehalten (pokerkit über eine deterministische Stichprobe von 20 147 Blättern,
weil es zweihundertmal langsamer ist). Alle vier erzeugen dieselben **7 462**
Stärkeklassen in derselben Reihenfolge.

Damit ist Korrektheit **kein Unterscheidungsmerkmal**. Die Wahl entscheidet
nur noch über Geschwindigkeit, Pflege und Lizenz — und ist deshalb auch
risikoarm: Ein späterer Wechsel ändert keine einzige Zahl.

### Die Messung

| | Version | Blätter/s | Lizenz | letzte Veröffentlichung |
|---|---|---:|---|---|
| **eval7** | 0.1.11 | **836 953** | MIT | vor 28 Tagen |
| phevaluator | 0.6.0 | 190 203 | Apache 2.0 | vor 46 Tagen |
| treys | 0.1.8 | 68 623 | MIT | vor 1527 Tagen |
| pokerkit | 0.7.5 | 3 225 | MIT | vor 4 Tagen |

Gemessen auf Siebenkarten-Blättern, also der echten Arbeitslast. Zahlen aus
`tools/poker-math/output/evaluator_auswahl.json`, erzeugt von
`src/pruefe_evaluatoren.py`.

- **Gewählt: eval7.** Viereinhalbmal schneller als der Zweitplatzierte,
  zweihundertsechzigmal schneller als pokerkit, MIT-Lizenz, aktiv gepflegt.
- **Warum Geschwindigkeit hier wirklich zählt:** B4 verlangt alle 169
  Starthände gegen alle 169. Bei exakter Auswertung sind das Größenordnungen
  von 10¹⁰ Blattbewertungen. Zwischen 837 000/s und 3 200/s liegt der
  Unterschied zwischen einem Lauf über Stunden und einem über Monate.

### Die verworfenen Alternativen, mit ihrem jeweiligen Vorzug

- **phevaluator** — die naheliegende zweite Wahl und deshalb **nicht
  entfernt**: Sie bleibt in der Testsuite als *zweite Meinung* installiert.
  Apache 2.0 ist unproblematisch, aber verlangt beim Weitergeben mehr
  Sorgfalt als MIT.
- **treys** — reines Python, dadurch überall lauffähig ohne Übersetzer. Aber
  seit über vier Jahren keine Veröffentlichung, und zwölfmal langsamer.
- **pokerkit** — die am aktivsten gepflegte und mit Abstand mächtigste (eine
  vollständige Spiel-Engine, nicht nur ein Evaluator). Für diese Aufgabe das
  falsche Werkzeug: Sie ist auf Ausdrucksstärke gebaut, nicht auf Milliarden
  von Auswertungen.

### Was mich am Vorgehen wichtiger ist als die Wahl selbst

Der Referenz-Evaluator (`src/referenz_evaluator.py`) ist **nicht** ein
Wegwerf-Prüfskript, sondern bleibt dauerhaft. In ihn fließen die **Regeln**
des Spiels — dass ein Flush eine Straße schlägt, dass das Ass in A-2-3-4-5
als Eins zählt. In ihn fließt **keine Zahl**: keine Häufigkeit, keine
Klassenzahl, kein Vergleichswert aus einer Quelle.

Die Kategorienverteilung im Bericht (40 Straight Flushes, 624 Vierlinge und
so weiter) ist **gezählt**, nicht nachgeschlagen. Genau so ist es für alle
folgenden Blöcke vorgesehen.

- **Verworfene Alternative:** Die Bibliothek gegen bekannte Werte aus einer
  Quelle prüfen.
- **Begründung:** Das hätte genau die Abhängigkeit hergestellt, die dieses
  Arbeitspaket ausschließen soll. Ein Vollständigkeitsbeweis über alle
  Blätter ist zudem stärker als jede Stichprobe aus einer Tabelle.

---

## E-013 · 2026-08-26 · Poker-Mathematik B1

**Ein Out ist nur, was eine eigene Karte trifft.**

Beim Durchrechnen der acht Zugbilder für B1 stellte sich heraus, dass die
naheliegende Definition unbrauchbar ist: „Karte, die mein bestes Blatt
stärker macht" trifft auf **47 von 47** Karten zu, weil auch ein besserer
Kicker das Blatt stärker macht. Die Zahl ist richtig gerechnet und ohne jede
Aussage.

Der zweite Versuch — „Karte, die meine Kategorie anhebt" — liefert für zwei
Überkarten **15** statt der erwarteten 6, weil auch ein Board-Paar die
Kategorie auf „Ein Paar" hebt.

- **Gewählt:** Als Out zählt eine Karte, die die Kategorie anhebt **und** bei
  der eine eigene Karte die neue Kategorie mitbildet — nicht bloß als Kicker
  danebensteht.
- **Verworfene Alternative:** Die Zahlen als bekannt hinschreiben (9 für den
  Flushdraw, 8 für die offene Straße). Genau das schließt der Auftrag aus.
- **Begründung:** Hero hält A-K, der Flop ist 9-7-2, es kommt eine weitere
  Neun. Heros Kategorie steigt, getroffen hat er nichts: Das Paar liegt auf
  dem Board und gehört jedem am Tisch. Es als Out zu zählen ist der
  klassische Anfängerfehler — eine Lern-App darf ihn nicht einbauen.
- **Nachweis, dass die Definition trägt:** Mit ihr fallen genau die Zahlen
  heraus, die am Tisch gemeint sind — 9 für den Flushdraw, 8 für die offene
  Straße, 4 für den Gutshot, 6 für zwei Überkarten, 15 für Flushdraw plus
  offene Straße. Keine davon steht im Quelltext.
- **Beide Zählweisen bleiben in der Ausgabe**, nebeneinander. Der Unterschied
  ist selbst der Lerninhalt.

---

## E-014 · 2026-08-26 · Poker-Mathematik B2

**Zwei Lesarten von „River-Wahrscheinlichkeit", beide ausgewiesen.**

- **Gewählt:** `river_nach_fehlschlag` (der Turn hat verfehlt, Nenner 46) und
  `river_unbedingt` (ohne Bedingung, Nenner 47) stehen **beide** in der
  Ausgabe, jede benannt.
- **Verworfene Alternative:** Sich für eine entscheiden und sie „die
  River-Wahrscheinlichkeit" nennen.
- **Begründung:** Beide sind richtig und beantworten verschiedene Fragen. Wer
  am Tisch nach dem Turn erneut zahlen muss, braucht die erste; wer wissen
  will, wie oft die Riverkarte überhaupt hilft, die zweite. Genau diese
  Verwechslung ist der Grund, warum kursierende Outs-Tabellen um einen halben
  Prozentpunkt auseinanderliegen — und wer eine davon abschreibt, weiß nicht,
  welche er erwischt hat.

---

## E-015 · 2026-08-26 · Poker-Mathematik, Korrektur

**Aussagen über Zahlen werden erzeugt, nicht formuliert.**

**Anlass:** In `b1_outs.json` stand „die Regel verspricht durchweg zu viel",
und in `POKER_MATH.md` „bis acht Outs untertreibt sie, ab neun übertreibt
sie". Beides falsch — der Vorzeichenwechsel liegt zwischen sechs und sieben
Outs. Die Sätze waren plausibel, passten zum Eindruck aus der Tabelle, und
kein Test hätte sie gefunden: Tests prüften bis dahin nur Zahlen.

- **Gewählt:** Jede Aussage über die Daten wird im Rechenskript **aus den
  Daten zusammengesetzt** (`src/befunde.py`). Steht in einem Satz eine Zahl,
  stammt sie aus dem Beleg daneben — sie kann gar nicht anders lauten. Ein
  Test verlangt, dass jede Zahl im Satz im Beleg wiederauffindbar ist, und ein
  zweiter, dass jeder Befundsatz **wörtlich** in `POKER_MATH.md` steht.
- **Verworfene Alternative:** Die falschen Sätze korrigieren und künftig
  sorgfältiger formulieren.
- **Begründung:** Der Fehler war nicht Unachtsamkeit, sondern strukturell.
  Formulierte Sätze driften von ihren Daten weg, sobald sich die Daten ändern
  — und niemand merkt es, weil kein Test Prosa liest. Erzeugte Sätze können
  das nicht.

**Drei Sorten von Aussagen** werden seither unterschieden und in der
Dokumentation gekennzeichnet:

| Sorte | Was sie ist | Deckung |
|---|---|---|
| **Befund** | Aus den Daten abgeleitet | Erzeugt, mit Beleg, durch Test gedeckt |
| **Begründung** | Warum so gerechnet wurde | Keine Datenaussage, braucht keine |
| **ungeprüft** | Könnte stimmen, ist nicht gerechnet | Ausdrücklich so markiert |

Ein dritter Test durchsucht `POKER_MATH.md` nach wertenden Wörtern („wächst",
„übertreibt", „erheblich", „nie") und verlangt für jede Fundstelle eine der
drei Deckungen. Beim ersten Lauf schlug er an fünf Stellen an — darunter eine
Aussage über verbreitete Poker-Tabellen im Netz, die ich gar nicht belegen
kann und die jetzt durch eine belegbare ersetzt ist.

**Ein Befund kam beim Aufräumen neu hinzu:** Ob ein Out dem Gegner die höhere
Straße geben kann, hängt am Board. Auf einem verbundenen Board schlagen 28 von
1035 Gegner-Kombos Heros Straße, auf einem unverbundenen null. Das stand
vorher als Behauptung in der Dokumentation und ist jetzt ausgezählt.

---

## E-016 · 2026-08-26 · Datenschnittstelle

**Zwei Fassungen der Daten: eine für den Nachweis, eine für den Bildschirm.**

- **Gewählt:** Der Generator schreibt die vollständige Fassung nach
  `tools/poker-math/output/` und eine verschlankte nach `public/pokermath/`.
  Nur die zweite liest die App. Erzeugt werden beide von
  `src/app_schnittstelle.py` in einem Zug.
- **Verworfene Alternative 1:** Die App liest die vollständigen Dateien.
  B4 wird mehrere Dutzend Megabyte groß — das über das Netz zu holen, um
  daraus 14 365 Zahlen zu zeigen, wäre nicht vertretbar.
- **Verworfene Alternative 2:** Ein manueller Kopierschritt nach `public/`.
  Er wird irgendwann vergessen, und dann zeigt die App wochenlang alte Zahlen,
  ohne dass es auffällt.

**Die Feldnamen bleiben deutsch**, auch im TypeScript. Eine
Übersetzungsschicht wäre genau die Stelle, an der `turn_oder_river` irgendwann
auf das Turn-Feld gemappt wird und es niemandem auffällt.

**Der Annahmenblock ist nicht optional.** Fehlt er, lehnt der Loader die Datei
ab. Eine Wahrscheinlichkeit ohne ihre Annahme ist nicht ungenau, sondern
bedeutungslos — und die App zeigt sie an, wo sie Zahlen zeigt.

**Vertragsversion statt Schemaprüfung allein.** Ein Feld kann seine Bedeutung
ändern, ohne seinen Typ zu ändern; dann sieht die falsche Zahl völlig richtig
aus. Passt die Version nicht, wird abgelehnt — auch bei sonst gültiger Datei.

**Der Loader prüft auch Aussagen über die Sache, nicht nur Typen:**
`turn_oder_river` kleiner als `turn`, eine nötige Equity über 50 %, eine
Blocker-Zeile, die nicht aufgeht. Das sind genau die Fehler, bei denen jeder
Einzelwert für sich gültig aussieht.

**Und er setzt K3 durch:** Ist bei einem Handpaar `spanne_relevant` gesetzt und
fehlen die Farbkonfigurationen, wird die **ganze Datei** abgelehnt. Die App
kann damit nicht in einen Zustand geraten, in dem sie einen Einzelwert ohne
die Spanne zeigen möchte und es nicht merkt.

---

## E-017 · 2026-08-26 · Pot-Odds-Drill

**Lage.** Der Drill zeigt eine Situation und fragt, ob der Call sich lohnt.
Dafür sind vier Entscheidungen nötig gewesen, bei denen es mehr als eine
vertretbare Antwort gab.

### Zwei Karten statt einer

**Gewählt:** Verglichen wird `turn_oder_river` aus B1 mit `noetige_equity`
aus B2 — also die Chance, bis zum River zu treffen.

**Alternative:** `turn`, die Chance, dass schon die nächste Karte trifft.
Das ist die genauere Lesart für einen einzelnen Call: Wer auf dem Flop
bezahlt, kauft eine Karte, nicht zwei.

**Warum trotzdem die andere:** Über alle acht Zugbilder und alle acht
Einsatzgrößen — 64 Fälle — lohnt der Call in der Zwei-Karten-Lesart in
**genau der Hälfte** der Fälle, in der Turn-Lesart in **weniger als einem
Fünftel**. Ein Drill, bei dem „lohnt nicht" fast immer richtig ist, bringt
einem den falschen Reflex bei; man lernt, blind abzulehnen, und liegt damit
oft genug richtig, um es nicht zu merken. Beide Zahlen sind nachgerechnet und
stehen als Testfälle in `potodds-drill.test.ts`.

Der Turn-Wert verschwindet nicht: Er steht in der Auflösung daneben, mit dem
Satz, was die Zwei-Karten-Lesart voraussetzt (kein zweiter Einsatz auf dem
Turn). Damit steht die vorsichtigere Lesart neben der optimistischeren, statt
sie zu ersetzen.

### Die größte Zahl ist die Equity, nicht die Schwelle

**Gewählt:** Das größte Element auf dem Bildschirm ist die eigene Trefferquote.

**Alternative:** die nötige Equity — schließlich heißt der Drill „Pot Odds".

**Warum:** Die nötige Equity lässt sich aus dem ablesen, was ohnehin auf dem
Bildschirm steht (Topf und Einsatz). Die Trefferquote nicht — die ist die
Zahl, die man nicht sieht und deshalb schätzt. Sie steht direkt darunter,
deutlich kleiner, damit der Vergleich trotzdem in einem Blick geht.

### Die Potgröße ist frei gewählt

Sie ist keine Poker-Tatsache, sondern der Maßstab der Aufgabe: Ob 24 oder 48
Big Blinds im Topf liegen, ändert nichts — nur das Verhältnis zählt, und das
kommt aus B2. Deshalb darf sie im Aufgabengenerator frei gewählt werden, ohne
gegen die Regel „keine Zahl aus dem Gedächtnis" zu verstoßen. Der Topf ist
immer ein Vielfaches des Bruchnenners, damit der Einsatz ganzzahlig bleibt;
das prüft ein Test für alle 64 Kombinationen.

### Keine Ziffer im Quelltext der Oberfläche

`PotOddsDrill.tsx` enthält keinen einzigen Zahlenwert. Ein Test liest die
Datei, entfernt Kommentare und Zeichenketten und schlägt fehl, sobald eine
Ziffer auftaucht, vor der kein Bezeichnerzeichen steht (`b1` ist keine Zahl,
`12` schon). Der Test prüft sich zuerst an einem Beispiel selbst.

Größen und Abstände stehen deshalb vollständig in `global.css`.

---

## E-018 · 2026-08-26 · „Warum diese Zahl"

**Lage.** Neben jeder angezeigten Zahl soll ein Zeichen stehen, das ihre
Herkunft aufklappt. Drei Entscheidungen waren dabei nicht selbstverständlich.

### Ein Blatt von unten statt einer Ausklappzeile

**Gewählt:** Ein Blatt, das über den Inhalt fährt.

**Alternative:** Eine Zeile, die sich unter der Zahl auftut — das ist es, was
„aufklappen" wörtlich heißt.

**Warum trotzdem nicht:** Sie verschiebt alles darunter. Im Pot-Odds-Drill
ist genau das verboten; die Lage bewegt sich zwischen Antwort und Auflösung
um null Pixel, und eine Ausklappzeile hätte das zunichtegemacht. Das Blatt
kommt außerdem von unten, wo der Daumen ist.

### Zwei Sätze sind formuliert, nicht aus den Daten

Alles im Blatt kommt wörtlich aus dem Herkunftsblock — mit einer Ausnahme:
Die Erklärungen zu `exakt` und `monte-carlo`. Sie stehen in
`src/i18n/pages/herkunft.ts` und lauten sinngemäß „jeder mögliche Fall wurde
einzeln durchgerechnet" beziehungsweise „sehr viele zufällig gezogene".

**Warum das zulässig ist:** Sie sagen nichts über einen konkreten Wert aus,
sondern erklären das Fachwort, das in den Daten steht. Die Regel K2 richtet
sich gegen formulierte Aussagen **über Zahlen** („wächst", „ab hier kippt
es"); eine Worterklärung ist keine.

**Warum es trotzdem hier steht:** Damit es auffällt, falls jemand später auf
die Idee kommt, in derselben Datei noch etwas anderes zu „erklären".

### Fehlende Angaben werden benannt, nicht gefüllt

`faelle_enumeriert` ist in allen Blöcken `null`, `bibliothek` in B2 und B3.
Das Blatt sagt das in Gold und mit einem ganzen Satz, statt den Abschnitt
wegzulassen. Eine weggelassene Zeile sieht aus wie eine Zeile, die es nicht
gibt; eine benannte Lücke sieht aus wie eine Lücke.

Ein Test hält das von der anderen Seite fest: Solange B-002 und B-003 offen
sind, **müssen** diese Felder `null` sein. Stünde dort eine Zahl, käme sie
nicht aus der Rechnung — und der Test schlägt an, bevor jemand sie für bare
Münze nimmt.

### Der Feldpfad wird nachgeprüft

Die App behauptet neben jeder Zahl, wo sie steht. Ein Test löst diesen Pfad
in der echten Datei auf und vergleicht den Wert dort mit dem angezeigten —
für alle 64 Aufgaben und alle fünf Zahlen. Ohne diesen Test wäre die
Herkunftsangabe eine Zierde: Sie sähe genauso aus, wenn sie falsch wäre.

---

## E-019 · 2026-08-26 · Teilbare Aufgaben

### Der Zustand steht lesbar in der Adresse

**Gewählt:** `#/lernen/drill/2-1-5-npxu` — drei Zahlen zur Basis 36 und ein
Fingerabdruck, durch Bindestriche getrennt.

**Alternative:** Die drei Werte in eine Zahl packen und als eine kurze
Zeichenfolge ausgeben. Das wäre zwei Zeichen kürzer.

**Warum nicht:** Feste Feldbreiten brechen, sobald ein neuntes Zugbild
dazukommt — und zwar still, weil die alte Adresse dann eine gültige neue
ergibt. Getrennte Stellen haben diese Grenze nicht. Dass man die Adresse
lesen kann, ist außerdem kein Nachteil in einer App, deren ganzer Punkt die
Nachprüfbarkeit ist.

### Der Fingerabdruck geht über die Adressierung, nicht über die Datei

**Gewählt:** Der Abdruck läuft über die Hände und Flops der Zugbilder und
über die Brüche der Einsatzgrößen — also über genau das, worauf die Indizes
zeigen.

**Alternative 1:** über die ganze Datei. Dann macht jede neu gerechnete
Nachkommastelle alle geteilten Links ungültig, obwohl sie auf dieselbe Hand
zeigen.

**Alternative 2:** gar kein Abdruck. Dann zeigt ein alter Link nach einer
Umsortierung stillschweigend eine andere Hand — genau der Fehler, gegen den
dieses Projekt gebaut ist.

Vier Testfälle halten die Grenze fest: gerechnete Zahl geändert → Links
bleiben gültig; Zugbild ergänzt, Reihenfolge gedreht oder Einsatzgröße
ergänzt → Links werden abgelehnt.

### Die Adresse führt, nicht der Bildschirm

**Gewählt:** „Nächste Aufgabe" setzt eine neue Adresse und zeigt nichts
selbst an. Was erscheint, liest der Bildschirm wieder aus der Adresse.

**Warum der Umweg:** Es gibt damit genau einen Weg, auf dem eine Aufgabe
entsteht. Ein zweiter Weg — Aufgabe direkt setzen, Adresse hinterherziehen —
wäre die Stelle, an der beide irgendwann auseinanderlaufen, und dann zeigt
ein geteilter Link etwas anderes als der Bildschirm, von dem er stammt.

### Eine Vorschaukarte je Aufgabe gibt es nicht

Nicht aus Nachlässigkeit: Das Fragment einer Adresse wird beim Abruf nicht an
den Server geschickt, ein Vorschaudienst sieht also immer nur `index.html`.
Auch ohne Fragment wäre es so, weil eine Einzelseiten-App für jede Adresse
dieselbe Datei ausliefert. Die drei Wege dahin und ihr Preis stehen in
`BLOCKER.md`, B-007; entscheiden muss das ein Mensch, weil zwei davon dem
Auftrag widersprechen („kein Server").

---

## E-020 · 2026-08-26 · Die offenen Blocker abgearbeitet

Nach der Freigabe „alles fertigmachen, was geplant ist" sind sechs der sieben
Punkte aus `BLOCKER.md` erledigt. Vier davon hatten eine Entscheidung im
Bauch, die nicht selbstverständlich war.

### Die Fallzahl wird gezählt, nicht gerechnet

**Gewählt:** Jeder Rechenblock meldet seine Zählstellen an und zählt beim
Laufen hoch.

**Alternative:** Die Zahl am Ende aus einer Formel herleiten — für B1 etwa
47 × 46 × 21 Zeilen. Kürzer, und für diesen Fall sogar richtig.

**Warum nicht:** Eine hergeleitete Zahl ist eine Behauptung über den Code.
Ändert jemand eine Schleife, stimmt die Formel nicht mehr, und niemand merkt
es — die Zahl sieht ja weiterhin plausibel aus. Eine mitgezählte Zahl kann
gar nicht falsch werden, ohne dass sich das Ergebnis mit ändert.

Der Preis ist ein Zähler in der inneren Schleife. Gemessen: kein Unterschied,
der auffällt.

### Die Zählstellen werden vorher angemeldet

Nicht `zaehle("irgendein_name")` mit freiem Text, sondern ein Zähler, der
seine Stellen kennt und einen unbekannten Schlüssel ablehnt. Grund: Ein
Tippfehler legt sonst still eine zweite Zählstelle an, und in der Anzeige
stehen dann zwei Zeilen für dieselbe Sache.

### Zweisprachigkeit gehört zu den Daten, nicht zur Oberfläche

**Gewählt:** Jeder anzeigbare Text ist im Generator ein `{de, en}`-Paar.

**Alternative:** Eine Übersetzungstabelle in der App, die deutsche Werte auf
englische Anzeigetexte abbildet.

**Warum nicht:** Sie ist genau die Stelle, an der beim nächsten neuen Zugbild
der Eintrag fehlt — und das sieht nur, wer die App auf Englisch benutzt, also
so gut wie niemand aus dem Team. Wer den Text erzeugt, liefert beide
Sprachen; fehlt eine, wirft der Generator, und zwar sofort.

**Was bewusst deutsch bleibt:** Die Belege in `output/*.json` und
`POKER_MATH.md`. Das ist Prüfmaterial, keine Anzeige.

### Der Willkommensdialog wird aufgeschoben, nicht übersprungen

**Gewählt:** Auf einer geteilten Aufgabe erscheint er nicht; sobald jemand
weiter in die App geht, kommt er.

**Alternative 1:** Ihn auch dort zeigen. Dann tippt jemand, der eine Aufgabe
geschickt bekommen hat, erst seinen Namen ein.

**Alternative 2:** Ihn nach dem geteilten Link ganz überspringen. Dann fehlt
die Sprachwahl dauerhaft, und niemand weiß, warum.

Die gewählte Fassung kostet eine Zeile in `App.tsx` und erklärt sich selbst.

### Die doppelte Konvertierung ist beendet

Zwei Programme mit derselben Aufgabe sind keine Redundanz. Geblieben ist das
Node-Skript, weil die App es beim Bauen ohnehin aufruft. Das Python-Skript
ist gelöscht, aber nicht spurlos: An seiner Stelle liegt eine Datei, die
sagt, wohin es gegangen ist und warum.

---

## E-021 · 2026-08-26 · Apple-Wurzelzertifikat: Wert raus, Prüfung bleibt

**Auftrag (C3).** Prüfen, ob ein aktiver Pfad den Fingerabdruck erreicht.
Falls nicht: entfernen.

**Gefunden.** Kein aktiver Pfad.

- Der Auslieferungsablauf (`.github/workflows`) baut die Seite und stellt sie
  auf GitHub Pages. **Firebase Functions werden nicht ausgeliefert** — der
  Webhook existiert im Quelltext und läuft nirgends.
- Der Weg zu StoreKit greift nur, wenn `isNativeIos` wahr ist
  (`src/lib/payments/provider.ts`). Es gibt keinen nativen iOS-Build.
- `linkAppleTransaction` wird von `src/` nirgends aufgerufen.

**Gewählt.** Der **Wert** ist entfernt, die **Prüfung** bleibt vollständig.
Der Fingerabdruck ist jetzt ein Pflichtargument und kommt als Geheimnis
`APPLE_ROOT_CA_SHA256` aus der Umgebung; fehlt es, nimmt der Webhook nichts
an und antwortet mit 503.

**Alternative:** Den ganzen Apple-Weg löschen — appleVerify.ts, appleWebhook,
linkAppleTransaction — und ihn bei Wiederaufnahme der Zahlungen neu bauen.

**Warum nicht:** E-009 hält ausdrücklich fest, dass die Payment-Architektur
aus Phase 1 **vollständig bestehen bleibt** — sie ist korrekt gebaut und wird
später gebraucht. Der Auftrag C3 nennt als Problem außerdem nicht den Code,
sondern den ungeprüften Wert. Die Prüfkette selbst ist echte Arbeit mit 18
Tests dahinter; sie noch einmal zu schreiben wäre Verlust ohne Gewinn.

**Was der Umbau bringt, was Löschen nicht gebracht hätte:** Aus einer stillen
ungeprüften Annahme wird eine laute Forderung. Wer den Weg wieder anschaltet,
**muss** den Fingerabdruck selbst bilden:

```
openssl x509 -in AppleRootCA-G3.cer -inform DER -fingerprint -sha256 -noout
```

Er kann ihn nicht mehr aus Versehen erben.

**Abweichung vom Auftrag, bewusst.** C3 nennt „Eintrag Nr. 2 in
docs/TODO_MANUELL.md". Nr. 2 ist „Impressum als Minderjähriger klären" — ein
rechtlicher Punkt, der nichts damit zu tun hat. Gemeint ist ersichtlich
Nr. 3, „Apple Root CA gegenprüfen". Entfernt wurde Nr. 3. Nr. 2 steht
unverändert.

---

## E-022 · 2026-08-26 · Freunde-Rangliste bleibt gestrichen

**Entschieden (C2).** Der Eintrag stammt aus dem Mehrspieler-Paket, das wegen
der Altersfreigabe entfernt wurde. Ranglisten setzen außerdem eine
Nutzermasse voraus, die es nicht gibt — eine Rangliste unter drei Leuten ist
keine.

**Alternative:** Den Eintrag in `docs/TODO_MANUELL.md` löschen.

**Warum nicht:** Ein gelöschter Eintrag taucht in einem halben Jahr als „gute
Idee" wieder auf, und dann fängt die Überlegung von vorn an. Nr. 13 steht
deshalb als durchgestrichene Zeile mit Begründung da.

---

## E-023 · 2026-08-26 · Vorschaukarte je Aufgabe bleibt ungebaut

**Entschieden (C1).** Die allgemeine Karte reicht. Der Umbau von `HashRouter`
auf `BrowserRouter` samt vorab erzeugter Seiten bleibt ungebaut.

**Alternative:** Den Router jetzt umbauen und die Seiten vorab erzeugen.

**Warum nicht:** Teilbare Links entfalten ihren Wert erst, wenn es Nutzer
gibt, die teilen. Aktuell gibt es keine. Vorab erzeugte Seiten müssten
dagegen bei jeder Datenänderung neu erzeugt werden — dauerhafte Last für
einen erst später eintretenden Vorteil.

Beides ist **eine** Entscheidung und keine zwei: Ohne Router-Umbau keine
eigenen Seiten, ohne eigene Seiten keine eigene Karte. Fällig, sobald das
Hosting feststeht. Als zusammenhängender Eintrag in `BACKLOG.md`.

Damit ist B-007 in `BLOCKER.md` beantwortet und geschlossen.

---

## E-024 · 2026-08-26 · Restzeit von B4: Grundlage geprüft, ein Zählfehler gefunden

**Auftrag (C4).** Prüfen, worauf die laufende Restzeitschätzung beruht, und
gegebenenfalls auf Sekunden je Farbkonfiguration umstellen.

**Gefunden — die Grundlage.** Die Schätzung rechnet aus den in **diesem Lauf**
fertigen Handpaaren hoch (`je_einheit = verstrichen / erledigt`). Der Verdacht
war, dass sie dadurch systematisch zu optimistisch ist, weil frühe Handpaare
billiger sind.

**Nachgemessen — der Verdacht trifft hier nicht zu.** Die Zahl der
Farbkonfigurationen je Handpaar ist über die Arbeitsliste hinweg fast
gleichverteilt: 3,26 je fertigem gegen 3,28 je offenem Handpaar. Beide
Grundlagen kommen deshalb aufs Gleiche — 15,6 Stunden Arbeitszeit über
Konfigurationen gegen 15,8 Stunden über Handpaare. Der Grund ist die
alphabetische Sortierung der Klassen: Sie mischt Paare, suited und offsuit
durch, statt sie zu gruppieren.

**Gefunden — ein echter Zählfehler.** Der Kopfkommentar von
`b4_preflop_equity.py` nennt **47 008** verschiedene Rechnungen. Vollständig
nachgezählt sind es **47 086**. Die Differenz von 78 ist exakt die Zahl der
Handpaare aus derselben Rangkombination, einmal offsuit und einmal suited —
`32o` gegen `32s`, `42o` gegen `42s`, und so weiter, C(13,2) = 78 Stück, jedes
mit genau einer Farbkonfiguration. Sie fehlen in der dokumentierten Zahl.

Nachgerechnet mit einem lesenden Skript, zweifach abgesichert: einmal über
alle 14 365 Handpaare einzeln (36 s), einmal über 21 Signaturen aus Handtyp
und Rangüberschneidung. Beide Wege ergeben 47 086.

**Nicht geändert, und warum.** Die Umstellung im Code betrifft
`tools/poker-math/`. Der Ordner gehört dem laufenden Prozess (A1), und eine
Änderung dort würde ohnehin erst nach einem Neustart wirken. Beides — die
Umstellung der Schätzgrundlage und die Korrektur der 47 008 — steht in
`WARTESCHLANGE.md`.

---

## E-025 · 2026-08-26 · Eine Akzentfarbe — Regel sofort, Umbau später

**Vorgabe (Phase 1.2).** Genau eine Akzentfarbe, reserviert für den
Live-Bereich, sonst neutrale Grautöne.

**Gewählt.** Die Regel gilt ab sofort für neu gebaute Bildschirme.
`--akzent` (#4fbf8e) ist die eine Akzentfarbe. Der Bestand behält vorerst
seine vier Bereichsfarben.

**Alternative:** Alle 37 Bildschirme in derselben Nacht umstellen.

**Warum nicht:** Ein Farbumbau über 37 Bildschirme ist keine Änderung,
sondern eine Neugestaltung. Der Unterschied wäre morgen früh nicht mehr
prüfbar — man könnte nicht auseinanderhalten, was Absicht war und was
Kollateralschaden. Und die Regel selbst ist damit nicht schwächer: Jeder
Bildschirm, der ab heute entsteht, hält sie ein, und das sind in dieser Nacht
die wichtigsten.

**Was stattdessen sofort passiert ist:** Der alte Live-Akzent `--felt-light`
lag bei 3,92 zu 1 auf dunklem Grund und war damit als Text schlicht
unzulässig. Der neue Akzent liegt bei 8,32 zu 1. Das war kein
Geschmacksurteil, sondern ein Messfehler, der jetzt behoben ist.

**Wo der Umbau steht:** `BACKLOG.md`, gemeinsam mit der Ablösung der drei
Alt-Schriftstufen.

---

## E-026 · 2026-08-26 · Ergebniszahlen bekommen eigene Farben

**Gefunden.** `--danger` (#e05c55) erreicht auf dem Kartengrund 4,73 zu 1.
Für eine kleine Zustandsanzeige ist das zulässig, für eine Ergebniszahl
verlangt Phase 1.2 sieben.

**Gewählt.** Zwei neue Töne nur für die Ergebnisstufe: `--ergebnis-gut`
(#6ec97d, 9,36 zu 1) und `--ergebnis-schlecht` (#f29b95, 8,98 zu 1).
`--ok` und `--danger` bleiben unverändert für kleine Anzeigen.

**Alternative:** `--ok` und `--danger` selbst aufhellen.

**Warum nicht:** Dann wären alle bestehenden Zustandsanzeigen mit
umgestellt — dieselbe Art unprüfbarer Nachtaktion wie oben. Zwei zusätzliche
Töne für genau einen Zweck sind ehrlicher als eine Änderung, die überall
durchschlägt.

**Zusätzlich:** Das Urteil im Drill trägt jetzt ein Zeichen (✓ / ✕) vor dem
Wort. Rund jeder zwölfte Mann sieht Rot und Grün nicht zuverlässig
auseinander — ausgerechnet die beiden Farben, mit denen man „richtig" und
„falsch" gern anzeigt.

---

## E-027 · 2026-08-26 · Das Tischgerät zeigt drei Angaben — Stufennummer und Spielerzahl fallen weg

**Der Auftrag** setzt für das Gerät in der Tischmitte eine Obergrenze: „nur
gemeinsame Information, große Schrift, aus zwei Metern lesbar, höchstens drei
Angaben".

**Vorher** standen fünf Dinge auf dem Bildschirm: die Nummer der laufenden
Stufe, die Zahl der verbliebenen Spieler, die geltenden Blinds, die Restzeit
und die kommenden Blinds. Gemessen (`npm run tisch`, 390 px) waren die Blinds
dabei 42,9 px groß und die kommende Stufe 15 px — zu klein für zwei Meter.

**Gewählt.** Stufennummer und Spielerzahl sind entfernt. Übrig bleiben
Restzeit, geltende Blinds, kommende Blinds.

**Warum diese drei.** Sie sind genau die Fragen, die am Tisch laut gestellt
werden: „Wie lange noch?", „Was ist der Big Blind?", „Was kommt als
Nächstes?" Die Stufennummer beantwortet keine davon — die Blindwerte benennen
die Stufe besser als ihre Nummer. Und wer noch dabei ist, sieht man am Tisch,
indem man aufschaut.

**Alternative 1:** Alle fünf lassen und kleiner setzen.

**Warum nicht:** Dann ist die Regel gebrochen, um die es geht. Aus zwei
Metern unlesbar heißt: Jemand nimmt das Gerät hoch, und in dem Moment ist es
kein Tischgerät mehr, sondern ein weiteres Handy in einer Hand.

**Alternative 2:** Die Stufennummer klein als Beschriftung stehen lassen.

**Warum nicht:** Eine kleine Zahl neben großen Zahlen ist keine Beschriftung,
sondern eine vierte Angabe in Tarnkleidung. Die Grenze wäre damit
verhandelbar, und die nächste Ausnahme käme in der nächsten Woche.

**Nachgemessen statt behauptet.** Die nötige Schriftgröße ist ausgerechnet,
nicht gesetzt: bei 2 m Abstand und einem Sehwinkel von 0,3° ergibt sich eine
Zeichenhöhe von 10,5 mm, bei einer Versalhöhe von 70 % der Schriftgröße also
15 mm, und bei 25,4/96 mm je CSS-Pixel **56,5 px**. Gemessen liegen jetzt
alle drei Angaben darüber: Handy 105,3 / 74,1 / 58,5 px, Tablet quer
220 / 148 / 96 px. Der Rechenweg steht in `docs/tisch.json`, der Test rechnet
ihn nach.

---

## E-028 · 2026-08-26 · Die untere Navigationsleiste bekommt Abstände

**Gefunden.** `npm run pruefen` meldet auf allen 49 Bildschirmen dieselbe
Stelle: Die drei Ziele der unteren Leiste berühren einander, Abstand 0 px.
Phase 1 des Auftrags verlangt 44 × 44 Punkt **mit mindestens 8 Punkt
Abstand**.

**Gewählt.** `gap: var(--tipp-abstand)` auf der Leiste. Bei 390 px Breite
bleibt jedes Ziel rund 124 px breit — weit über der Mindestgröße.

**Alternative:** Die Leiste als Ausnahme führen und die Regel für sie
aussetzen.

**Warum nicht:** Tab-Leisten stoßen üblicherweise aneinander, das stimmt —
und es wäre hier das schwächere Argument. Zwei Flächen ohne Abstand sind eine
Fläche mit zwei Bedeutungen: Ein Tipp knapp neben der Mitte landet auf dem
Nachbarn, und der Nutzer erfährt nie, warum er auf einmal woanders ist. Der
Preis für die Regel sind 16 von 390 Pixeln. Der Preis für die Ausnahme wäre,
dass die nächste Ausnahme leichter fällt als diese.

**Was dagegen keine Ausnahme braucht.** Der Streifen an der Unterkante für
die Systemgesten war schon frei; er ist ein anderer Fall und in `global.css`
als `--gestenstreifen` geregelt.

---

## E-029 · 2026-08-27 · Die Restzeitschätzung bleibt bei Handpaaren

**Warteschlange W-001, jetzt abgearbeitet.** Der Auftrag (C4) verlangte,
die Grundlage der Restzeitschätzung zu prüfen und auf gemessene Sekunden je
fertiger Einheit gegen die Zahl der verbleibenden Einheiten umzustellen.

**Befund.** Genau das tut der Code bereits: `verstrichen / erledigt` mal
offene Handpaare. Meine eigene Verschärfung in W-001 — je **Farbkonfiguration**
statt je Handpaar — wäre die feinere Grundlage, weil die Arbeit dort anfällt.

**Gewählt.** Die Grundlage bleibt das Handpaar. Stattdessen ist die Rechnung
aus der Schleife in die eigene Funktion `restschaetzung()` gewandert, mit der
Begründung im Docstring, und der Lauf schreibt seine Grundlage jetzt beim
Start ins Protokoll.

**Alternative:** Vor dem Lauf alle Farbkonfigurationen abzählen und danach
schätzen.

**Warum nicht:** Nachgemessen mitten im Lauf (E-024) sind es 3,26
Konfigurationen je fertigem gegen 3,28 je offenem Handpaar — die feinere
Grundlage käme auf dasselbe Ergebnis. Der Grund ist die alphabetische
Sortierung der Klassen: Sie mischt Paare, suited und offsuit durch, statt sie
zu gruppieren. Dafür kostete das Abzählen rund eine halbe Minute Vorlauf bei
jedem Start. Genauigkeit, die man nicht sieht, gegen Wartezeit, die man sieht.

**Was der eigentliche Mangel war.** Die Frage „worauf beruht diese Zahl?"
ließ sich nur beantworten, indem man einen Ausdruck mitten in einer Schleife
las. Das ist jetzt behoben — und durch fünf Tests abgedeckt, darunter der
Fall „noch kein einziges Handpaar fertig", der vorher eine Division durch null
gewesen wäre.

---

## E-030 · 2026-08-27 · Beide Tische fallen aus dem Rahmen

**Entschieden vom Auftraggeber (W-003).** Der Ein-Geräte-Tisch
(`/session/tisch`) und der Online-Tisch (`/session/tisch/online`) sind beides
gespieltes Poker, nicht verwaltetes. Der inhaltliche Rahmen erlaubt zwei
Arten von Inhalt: reine Zahlenverwaltung — Listen, Stände, Uhren, Rechner —
und Lehrmaterial als Standbild. Ein Tisch, an dem Hände gespielt werden, ist
keines von beidem.

**Umgesetzt.** Beide Bildschirme, ihre Bibliotheken, ihre Texte und ihre
Tests sind entfernt: neun Dateien, rund 2700 Zeilen, davon 938 Zeilen Tests.
Beide stehen mit ausdrücklichem Vorbehalt in `BACKLOG.md`.

**Der Vorbehalt ist der eigentliche Inhalt dieser Entscheidung.** Sie kommen
nur über eine ausdrückliche Entscheidung über eine höhere Altersstufe zurück
— vorher getroffen, nicht nachträglich begründet. Ein Backlog-Eintrag ohne
diesen Satz wäre in einem halben Jahr eine „gute Idee, die mal fertig war",
und genau so schleicht sich ein Rahmen zurück, den jemand bewusst gezogen
hat.

**Alternative:** Die Bildschirme stehen lassen und nur nicht mehr verlinken.

**Warum nicht:** Unverlinkter Code ist keine Entscheidung, sondern ein
Aufschub. Er läuft weiter, er wird mitausgeliefert, er taucht in jeder
Suche auf — und der Nächste, der ihn findet, hält die fehlende Verlinkung
für ein Versehen und behebt es.

**Was die alten Adressen angeht:** `/tisch`, `/tisch/online`, `/live/tisch`
und `/live/tisch/online` leiten weiter auf `/session`. Ein geteilter Link
darf nicht ins Leere laufen, nur weil eine Entscheidung gefallen ist.

**Was diese Entscheidung offenlässt — bitte lesen.** Unter
`/lernen/uebungstisch` liegt der **Übungstisch**: eine vollständige Partie
gegen Bots, mit Engine, Gegnerlogik und Showdown. Nach demselben Maßstab ist
auch er gespieltes Poker und nicht verwaltetes. Er ist **nicht** entfernt,
weil der Auftrag zwei Bildschirme namentlich genannt hat und ich einen
dritten nicht ungefragt dazunehme — eine Entscheidung über den Rahmen gehört
dem Auftraggeber, auch wenn sie in dieselbe Richtung zeigt. Er sollte beim
nächsten Mal ausdrücklich mitentschieden werden.

**Nachgemessen.** Nach dem Entfernen: 41 statt 43 eigene Bildschirme, größte
Tiefe weiterhin 2, null Sackgassen, null unerreichbare Adressen. 707 Tests
grün.

---

## E-031 · 2026-08-27 · Die Equity-Matrix als Binärdatei

**Auftrag.** Equity als Ganzzahl in Basispunkten, zwei Byte je
Farbkonfiguration, dazu ein Index über Handpaar und Konfiguration. Erwartung
nach überschlägiger Rechnung: rund 150 KB statt 5,0 MB.

**Gebaut.** `public/pokermath/b4_preflop_equity.bin`, geschrieben von
`scripts/pokermath-app-daten.mjs`, gelesen von `src/lib/pokermath/b4binaer.ts`.
Herkunft und Befunde bleiben JSON: Sie sind Text, sie sind klein, und sie
sind die Grundlage von „Warum diese Zahl?". Text in ein Binärformat zu
pressen spart nichts und kostet Lesbarkeit.

**Kein Wert fehlt.** Dieselben 14 365 Handpaare, dieselben 25 473
Farbkonfigurationen, dieselben Häufigkeiten. Eine Datei kleiner zu machen,
indem man Daten daraus entfernt, wäre keine Leistung.

### Gemessen, nicht überschlagen (`npm run binaer`)

| | vorher (JSON) | nachher (Binär + Kopf) | Faktor |
|---|---|---|---|
| roh | 5005,5 KB | **203,3 KB** | 24,6 |
| gepackt (gzip -9) | 277,2 KB | **116,2 KB** | 2,4 |
| Abruf + Auswertung, Median aus 9 Läufen | 98,9 ms | **8,1 ms** | 12,2 |

**Die Erwartung von 150 KB ist um 53 KB verfehlt.** Roh sind es 203,3 KB. Wo
die Bytes liegen: 100,6 KB in der Handpaar-Tabelle (14 365 × 7 Byte) und
101,9 KB in der Konfigurationstabelle (25 473 × 4 Byte). Auf 150 KB käme man
mit zwei weiteren Schritten — die Klassenpaare aus der Position ableiten
statt speichern (−28 KB) und die Spanne nur dort ablegen, wo keine
Konfigurationen danebenstehen (−15 KB). Beide sind nicht gemacht: Der erste
verlegt die Reihenfolge der 169 Klassen aus der Datei in den Lesecode, der
zweite macht die Sätze verschieden lang und damit den Index zu einer
Rechnung statt zu einer Multiplikation. 53 KB sind das nicht wert.

### Der überraschende Teil der Messung

**Über die Leitung war der Unterschied nie 25-fach, sondern 2,4-fach.** Das
JSON packt sich von 5005 KB auf 277 KB — Zahlentext komprimiert sehr gut.
Wer nur roh gegen roh vergleicht, rechnet sich einen Faktor schön, den kein
Nutzer je sieht.

Der Gewinn liegt woanders, und dort ist er echt:

- **Im Gerät.** Der Service Worker hält die Datei offline vor, und dort liegt
  sie ungepackt: 203 KB statt 5,0 MB.
- **In der Auswertung.** 8 ms statt 99 ms. `JSON.parse` baut für jedes
  Handpaar Objekte; der Binärleser läuft einmal durch die Bytes.

### Der Backlog-Eintrag „Matrix nachladen statt mitliefern" ist gestrichen

**Warum.** Er stand auf der Annahme, 5 MB seien zu viel, um sie beim ersten
Start mitzuliefern. Diese Annahme ist weg: 116 KB über die Leitung und 8 ms
Auswertung sind kein Grund, irgendetwas nachzuladen.

**Was das Streichen zusätzlich spart**, und das ist der wichtigere Teil: Die
Zusage „funktioniert vollständig ohne Netz" bleibt **uneingeschränkt**.
Nachladen hätte sie geteilt — für den Live-Bereich immer, für den
Starthand-Vergleich erst nach dem ersten Aufruf mit Empfang. Eine Zusage mit
Fußnote ist am Küchentisch ohne Empfang keine.

**Alternative:** Den Eintrag stehen lassen, weil die 150 KB nicht erreicht
sind.

**Warum nicht:** Die Zahl war ein Mittel, nicht der Zweck. Der Zweck war,
das Nachladen überflüssig zu machen, und das ist erreicht — deutlicher, als
die Erwartung es verlangt hätte.

**Zur Kenntnis:** Heute liest **kein einziger Bildschirm** die Matrix.
`ladeB4` existiert, der Starthand-Vergleich ist noch nicht daran
angeschlossen. Die 203 KB liegen also derzeit ungenutzt im Gerät — vorher
waren es 5,0 MB ungenutzt.

---

## E-032 · 2026-08-27 · Die untere Leiste entfällt, die drei Karten sind die Navigation

**Vom Auftraggeber erkannt und entschieden.** Die untere Leiste und die drei
Karten der Startseite führten zu denselben Zielen. Damit war „Start" ein
Bildschirm ohne eigenen Inhalt — und **das** war der Grund für die leere
untere Bildschirmhälfte, nicht ein Layoutfehler.

Diese Diagnose ist der eigentliche Wert der Entscheidung. Ich hatte den
Leerraum vor mir und ihn nicht erkannt: Phase 2 hat die Startseite gemessen
(Erreichbarkeit, Tiefe, Sackgassen) und dabei geprüft, ob man überall
hinkommt — nicht, ob die Wege dorthin doppelt sind. Eine Prüfung findet nur,
wonach sie sucht.

**Umgesetzt.**

- Die Leiste ist entfernt, samt ihrer Höhe `--nav-h` und den 98 Pixeln
  Innenabstand, die der Hauptbereich für sie freihielt. Diese 98 Pixel waren
  der Leerraum.
- Die drei Karten teilen die verfügbare Höhe unter sich auf, im Verhältnis
  1 zu 1,5 zu 2,4. Keine festen Höhen: Auf einem 667 Pixel hohen Gerät sind
  es 101/147/223, auf einem 844er 137/201/310.
- Reihenfolge von oben nach unten: NACHSCHLAGEN, LERNEN, LIVE-SESSION. Die
  Live-Session liegt unten und ist am größten — das stand seit Phase 1 in
  `DESIGN.md` und war nicht umgesetzt.
- Die Kennzahlenzeile steht jetzt über den Karten. Unten drückte sie die
  große Karte aus dem Daumenbereich.
- Nachgemessen auf drei schmalen Geräten (375×667, 390×844, 360×740): kein
  Scrollen, und zwischen der untersten Karte und dem Bildschirmrand stehen
  **genau 24 Pixel** — der Gestenstreifen aus `DESIGN.md`, kein Pixel mehr.

**Der Weg zurück.** Ohne Leiste braucht jeder Bildschirm einen sichtbaren Weg
zur Startseite. Den trägt jetzt die Marke oben links — auf jedem Bildschirm
an derselben Stelle, 44 Pixel hoch, und genau das, was eine Marke oben links
seit jeher bedeutet. Der Sackgassen-Lauf danach: 41 Bildschirme, **null
Sackgassen**, größte Tiefe weiterhin 2.

**Alternative:** Die Leiste behalten und der Startseite eigenen Inhalt geben
— eine Übersicht, Empfehlungen, „weiter, wo du warst".

**Warum nicht:** Das hätte den doppelten Weg nicht beseitigt, sondern
verdeckt. Und es hätte einen Bildschirm erfunden, den niemand verlangt hat,
um eine Leiste zu rechtfertigen, die niemand braucht. Wenn zwei Dinge zum
selben Ziel führen, entfernt man eines — man erfindet keinen Grund für beide.

### Was dabei zurückkam und wieder behoben ist

Mit der Leiste verschwanden ihre 98 Pixel Innenabstand — und damit sprang im
Drill der Antwortknopf wieder um 34 Pixel zwischen Frage und Auflösung. Genau
dieser Fehler stand schon einmal im Kommentar von `.drill`, damals als 43
Pixel, und war mit einer auf die Navigationshöhe abgestimmten Zahl
(`min-height: 78svh`) geheilt worden.

Eine Zahl, die auf eine andere Zahl abgestimmt ist, hält nur, bis sich die
andere ändert. Auf dem Handy bekommen Startseite und Drill ihre Höhe jetzt
vom Hauptbereich, der sie von der Kopfzeile bekommt — niemand schreibt mehr
eine Höhe hin. Gemessen: 0 Pixel Bewegung.

Der erste Versuch tat das noch mit einer gesetzten Kopfzeilenhöhe von 56 px.
Gemessen waren es 58, und diese zwei Pixel machten die Startseite scrollbar.
Auch das ist jetzt weg: Eine Höhe, die sich ergibt, kann nicht um zwei Pixel
danebenliegen.

### „3 von 49 Lektionen" ist gestrichen

Der Satz war zwei Aussagen in einem: was jemand geschafft hat, und wie viel
es insgesamt gibt. Die zweite ist eine Zusage über den Inhalt, und die deckt
der vorhandene nicht — sie zählt, was da ist, und verspricht dabei
stillschweigend, dass es vollständig ist.

Jetzt steht dort „3 Lektionen abgeschlossen". Ein Test hält fest, dass in
diesem Satz genau **eine** Zahl vorkommt, und dass die Funktion nur ein
Argument annimmt: Wer eine Gesamtzahl übergeben kann, zeigt sie irgendwann
wieder an.

---

## E-033 · 2026-08-27 · Farbtokens heißen nach Verwendung, nicht nach Farbe

**Vorbedingung für die Farbmodi, vom Auftraggeber so gestellt.** `--gold`,
`--felt` und `--violet` sagen, welche Farbe ein Token hat. Für einen hellen
Modus ist das die falsche Sorte Name: Ein Farbname ist ein Wert, der sich
nicht ändern darf; ein Verwendungsname ist einer, der es kann.

**Umbenannt:** `--gold` → `--auszeichnung` (Fortschritt, Rang, Pro),
`--felt` → `--flaeche-tisch`, `--violet` → `--kategorie-sozial`, samt aller
Abstufungen. In einem zweiten Durchgang dann die Helligkeitsstufen:
`--ok-bright` und Verwandte heißen jetzt `--*-lesbar`, `--text-bright` heißt
`--text-stark`. Auch „bright" ist keine Verwendung — im hellen Modus müsste
die lesbare Variante *dunkel* sein.

**Getrennt committet**, beide Male ohne einen einzigen geänderten Farbwert.
Wer später sucht, wann ein Ton anders wurde, soll nicht durch eine
Umbenennung waten.

**Alternative:** Die Namen lassen und die Modi darüberlegen.

**Warum nicht:** Dann stünde in `[data-modus="hell"]` die Zeile
`--gold: #7d5f14;` — ein dunkles Ocker, das „Gold" heißt. Der nächste, der
das liest, hält es für einen Fehler und „korrigiert" es.

---

## E-034 · 2026-08-27 · Drei Modi, keine fünf Farbwelten

**Vom Auftraggeber entschieden.** Hell, Dunkel, Systemvorgabe. Die Idee
weiterer Farbwelten ist in `BACKLOG.md` notiert, nicht gebaut.

**Die Begründung ist eine Rechnung.** Jede Farbwelt verlangt dieselbe
Prüfung wie die anderen: Bei sechs Textfarben, sechs Farbmarken und fünf
Flächen sind das 60 Kontrastwerte je Welt. Bei drei Modi (von denen einer
keine eigene Welt ist) sind es 120; bei fünf Welten wären es 300 — und jede
Farbänderung an einer Stelle zieht alle nach sich. Der Test rechnet sie zwar
alle, aber er kann nicht entscheiden, welcher Ton **gut** aussieht. Das bleibt
Handarbeit, und die wächst mit jeder Welt.

**Was stattdessen zählt.** Zwei Sätze, die beide sitzen, sind mehr wert als
fünf, von denen drei nur die Prüfung bestehen.

**Alternative:** Fünf Welten anlegen und die Pflege dem Test überlassen.

**Warum nicht:** Der Test prüft Lesbarkeit, nicht Stimmigkeit. Eine Welt, die
4,5 zu 1 erreicht und trotzdem aussieht wie ein Unfall, ist grün.

### Die Regel, die über der Auswahl steht

**Der Live-Bereich bleibt in jedem Modus dunkel.** Das Gerät liegt bei
gedimmtem Licht auf einem Pokertisch; eine helle Fläche blendet die Runde und
beleuchtet Gesichter. Umgesetzt nicht als Sonderfall in einem Bildschirm,
sondern über den Tokensatz: Weil der dunkle Satz an `[data-modus="dunkel"]`
hängt und nicht nur an `:root`, erzwingt ihn jedes Element mit diesem Attribut
für alles darunter. `App.tsx` setzt es an genau einer Stelle.

### Was die Prüfung dabei gefunden hat

Der Kontrastlauf über **beide** Modi am gerenderten Ergebnis meldete eine
Stelle: Der Hauptknopf trug im hellen Modus dunkle Schrift auf dunklem Gold,
**2,76 zu 1**. Ursache war mein eigener Fehler — ich hatte den Farbverlauf des
Knopfs mit abgedunkelt, weil `--auszeichnung` als Textfarbe im hellen Modus
dunkel sein muss.

Behoben, indem die Knopfflächen aus den Modusblöcken herausgenommen wurden:
Ein gefüllter Knopf ist eine eigene Fläche mit eigener Schriftfarbe, er steht
nicht auf dem Seitengrund, sondern auf sich selbst — genau wie die
Kartenfarben. Der mittlere Farbstopp hat dafür einen eigenen Token bekommen.

**Das ist das Argument für den Lauf über beide Modi.** Die Tokenprüfung war
grün: Jeder einzelne Token hielt seine Grenze. Der Fehler entstand erst aus
der Kombination, und die sieht nur ein Browser.

---

## E-035 · 2026-08-27 · Die Karten tragen Inhalt, keine Abbildungen

**Stand:** entschieden und umgesetzt.

**Die Lage.** Seit E-032 füllen die drei Karten der Startseite die
Bildschirmhöhe. Ihr Inhalt bestand aus zwei Textzeilen — einer Überschrift
und einem Halbsatz. Die Höhenregel streckte diese zwei Zeilen über die ganze
Fläche. Die Karten waren damit außen groß und innen leer.

**Die Entscheidung.** Die Höhenregel bleibt, der Inhalt kommt dazu. Jede
Karte bekommt das, was sie ohnehin zu sagen hat — und wird dadurch zugleich
ein kürzerer Weg. Was genau, steht in DESIGN.md, Regel 10.5.

### Warum keine dekorativen Abbildungen

Der naheliegende Griff wäre ein Bild gewesen: Karten, Chips, ein Tisch. Eine
Abbildung füllt die Fläche sofort und ohne Nachdenken.

**Sie sagt aber nichts.** Wer die Karte „Nachschlagen" ansieht, weiß nach
einem Bild von Spielkarten genau so viel wie vorher — nämlich, dass es um
Poker geht, was auf jedem Bildschirm dieser App zutrifft. Ein Feld mit der
Aufschrift „Glossar" sagt, was dahinter liegt, **und** ist der Weg dorthin.

**Sie altert schlecht.** Ein Bild ist an einen Stil gebunden, an eine
Auflösung, an einen Geschmack. Es muss mitgepflegt werden, ohne je etwas
beizutragen. Inhalt, den es ohnehin gibt, altert mit der App und nicht
gegen sie.

**Sie kostet zweimal.** Erst Bytes, dann Aufmerksamkeit: Auf einer Fläche,
die der Daumen unter Zeitdruck trifft, steht sie zwischen der Hand und ihrem
Ziel.

**Alternative:** Eine ruhige Fläche mit Farbverlauf statt eines Bildes.

**Warum nicht:** Dasselbe Argument in schwächerer Form. Eine Fläche, die
nichts sagt, ist eine Fläche, die nichts sagt — ob sie nun ein Bild trägt
oder einen Verlauf. Der Unterschied ist nur, wie lange es dauert, bis es
auffällt.

### Der Fehler, den dabei fast dieselbe Falle gestellt hätte

Der erste Versuch ließ den Hauptknopf der großen Karte auf die übrige Höhe
wachsen — bis zum Vierfachen der Mindest-Tippgröße. Die Füllungsmessung sprang
damit auf **0,89**, und auf dem Bildschirmfoto stand ein **176 Pixel hohes
leeres Rechteck mit einem Wort in der Mitte**.

Das ist genau der Fehler, den dieser Durchgang beseitigen sollte: Fläche, die
gefüllt aussieht und nichts sagt — nur in Knopfform statt in Bildform. Die
Messung konnte ihn nicht sehen; sie zählt, ob ein Kind die Höhe belegt, nicht,
ob das Kind etwas damit anfängt.

**Was daraus folgt.** Die Knöpfe der Startseite werden höchstens so hoch wie
ein großer Knopf sonst in dieser App (`--tipp-min + --sp-4`). Die übrige Höhe
verteilt die große Karte zwischen ihren Gruppen statt um sie herum:
Überschrift oben, Knopf unten im Daumenbereich.

**Und was daraus über Prüfungen folgt:** Eine Messung sichert die Eigenschaft,
die sie misst — nicht die Absicht dahinter. Dieselbe Lehre wie bei den
Farbtokens (DESIGN.md 11.6), an einer anderen Stelle gefunden.

### Der Schwellwert ist gemessen, nicht gewählt

Der Auftrag verlangte ausdrücklich, den Anteil aus der Messung abzuleiten und
zu begründen, statt eine Zahl zu setzen. Zwei Messreihen:

- **Was heute vorkommt:** 72 Werte — drei Karten × drei Bezugsgeräte × beide
  Sprachen × vier Zustände der Startseite. Kleinster Wert **0,492**.
- **Was der Test fangen muss:** derselbe Bildschirm im Zustand vor dieser
  Entscheidung, nachgestellt durch Ausblenden genau der neuen Kinder:
  **0,142 bis 0,230**.

Der Schwellwert liegt eine Textzeile unter dem kleinsten Wert der ersten
Reihe: 0,492 − 0,063 = 0,429, abgerundet **0,4**. Nach unten bleibt fast
doppelt so viel Abstand wie nach oben.

### Zwei Regelbrüche, die erst die Messung auf drei Geräten zeigte

**Die mittlere Karte war zeitweise die größte.** Als die Lernkarte Streak,
Level und XP aufnahm, war sie auf dem 375 × 667 großen Gerät 235 Pixel hoch
und die Live-Session darunter 209 — Regel 10.2 stand auf dem Kopf. Der bis
dahin einzige Durchgang lief nur auf 390 × 844 und war grün. Behoben, indem
die Kennzahlen in einer Zeile stehen statt in drei Säulen; geprüft wird die
Reihenfolge jetzt auf allen drei Bezugsgeräten.

**Die Anteile teilten die falsche Größe.** Mit `flex-basis: 0` teilten
1 zu 1,5 zu 2,4 die **gesamte** Höhe. Weil die Lernkarte den meisten Inhalt
hat, landete sie an ihrer Mindesthöhe, und die ganze übrige Höhe floss in die
Live-Session: 415 Pixel Karte für 274 Pixel Inhalt. Behoben mit
`flex-basis: auto` — zuerst der Inhalt, dann der Rest.

### Zwei Änderungen, die der Auftrag nicht wörtlich verlangt hat

Beide entstanden aus seiner eigenen Regel („Inhalt, den sie ohnehin hat"),
und beide sind hier vermerkt, damit sie nicht unbemerkt bleiben:

1. **Der zuletzt gespielte Abend steht in der großen Karte**, wenn keine Runde
   läuft. Der Auftrag nannte für diesen Fall nur den Startknopf. Ohne die
   Zeile hat die größte Karte der Seite genau ein Kind zu zeigen; gemessen
   0,6 der Innenfläche. Die Zeile ist Inhalt, den die App hat, und ein Tipp
   darauf führt direkt zu diesem Abend.
2. **Gespielte Abende zählen als Benutzung.** Vorher hing „erstes Öffnen" nur
   an Lektionen, XP und Händen. Wer die App ausschließlich für den Pokerabend
   benutzt, hätte auch nach dem zehnten Abend noch den Satz vor sich gehabt,
   der erklärt, was die App tut. Aufgefallen im Durchgang: Er spielt einen
   vollständigen Abend und landet danach auf einer Startseite, die ihn für
   einen Neuling hält.

### Was die Wege dazugewonnen haben

Sechs Bildschirme sind eine Berührung näher gerückt, weil der Inhalt der
Karten zugleich der Weg ist: die vier Nachschlage-Ziele, das Einrichten eines
Abends und die nächste offene Lektion. Die Tiefe-1-Liste in DESIGN.md,
Abschnitt 7, ist von vier auf zehn Adressen gewachsen; größte Tiefe unverändert
zwei, null Sackgassen.

---

## E-036 · 2026-08-29 · Die App bekommt einen Grund, geöffnet zu werden

**Stand:** entschieden, erster Teil umgesetzt.

**Der Anlass.** Der Auftraggeber, Besitzer und einziger täglicher Nutzer
sagt: Die App liegt auf dem Startbildschirm, und er tippt sie fast nie an.
Nicht zum Lernen, nicht zum Spielen. Das ist die härteste Rückmeldung, die
eine App bekommen kann, und sie ist kein Geschmacksurteil — sie ist ein
Messwert.

### Was ein Rundgang durch die eigene App zeigt

Aufgenommen wurden dreizehn Bildschirme bei 390 Pixeln Breite. Was auf allen
gleich aussieht:

1. **Poker ist unsichtbar.** Auf keinem Bildschirm ist der Gegenstand zu
   sehen, um den es geht. Wo Karten vorkommen — im Drill —, sind sie 48
   Pixel breit und stehen als graue Leiste neben dem Text, während die
   Bildschirmmitte leer bleibt. Eine Poker-App, auf der man kein Poker
   sieht.
2. **Jeder Bildschirm beginnt mit Hausaufgaben.** Erst ein Absatz Fließtext,
   dann ein Menü, dann eine Entscheidung, und danach passiert etwas. Bis zur
   ersten Handlung: zwei bis drei Berührungen und drei Sätze.
3. **Es gibt kein „heute".** Zwischen zwei Öffnungen ändert sich nichts. Ein
   Tages-Quiz existiert — zwei Ebenen tief, auf der Startseite nie erwähnt.
4. **Der Fortschritt ist eine Wand aus Nullen.** Das Profil zeigt acht
   Kennzahlen, für neue Nutzer achtmal null, dazu „0/49" und „0/22".
5. **Nichts belohnt.** Eine richtige Antwort ändert Text. 22 Abzeichen sind
   angelegt und werden nie gezeigt, bevor man sie hat.

**Der gemeinsame Nenner:** Der App fehlen keine Funktionen. Sie hat acht
Trainer, ein Tages-Quiz, Szenarien, Push/Fold, einen Wiederholungsstapel und
einen Übungstisch. Sie versteckt sie hinter Menüs und erzählt sie in
Fließtext.

### Die Entscheidung

**Beim Öffnen steht eine Hand da und eine Frage. Kein Menü.**

Das ist die ganze These. Alles Weitere folgt daraus:

- **Die Hand des Tages** steht ganz oben auf der Startseite, mit großen
  Karten, einer Frage und zwei Knöpfen. Sie ist beantwortbar, ohne einen
  einzigen Weg zu gehen. Morgen steht eine andere da.
- **Die Karten werden groß.** Von 48 auf 62 Pixel in der Hand und mit
  zweitem Index unten rechts wie auf einer echten Karte. Eine Größe `xl` mit
  96 Pixeln steht für die Bildschirme bereit, die als Nächstes drankommen.
- **Jeder Bereich bekommt seine Farbe.** Nachschlagen blau, Lernen gold,
  Live-Session grün. Farbe findet man, bevor man ein Wort gelesen hat.
- **Die Woche wird sichtbar.** Sieben Punkte statt einer Zahl.
- **Die Antwort bekommt einen Moment.** Die Auflösung tritt auf, die eigenen
  Karten heben sich kurz.

### Warum eine Hand pro Tag und nicht „unendlich üben"

Unendlich üben gibt es schon — der Drill liegt einen Weg entfernt und wird
nicht benutzt. Ein Angebot, das immer da ist, ist nie dringend. Genau ein
Stück pro Tag ist die einzige Menge, die morgen wieder einen Grund erzeugt.

### Warum das nichts Neues rechnet

Die Hand des Tages zieht aus **demselben** Generator wie der Pot-Odds-Drill
und löst mit derselben Funktion. Neu ist allein die **Auswahl**: Der Tag
wird zu einem Startwert verrechnet (FNV-1a), der Startwert speist einen
wiederholbaren Zufallsstrom (mulberry32), und der zieht die Aufgabe. Damit
gilt die Regel des Projekts unverändert: Jede Zahl kommt aus
`tools/poker-math/`.

Ein Test führt das vor: Aus dem gezogenen Zustand allein muss sich dieselbe
Aufgabe und dieselbe Auflösung ergeben.

**Warum aus dem Datum und nicht aus dem Zufall:** Wer mittags noch einmal
öffnet, soll dieselbe Hand sehen — sonst ist die Antwort von heute Morgen
verschwunden und die Frage war nichts wert. Und alle Geräte ziehen dieselbe
Hand, ohne dass ein Server sie verteilen müsste. Das ist der billigste
denkbare tägliche Inhalt: keine Zeile Serverkode, funktioniert im Flugzeug.

Der Tag ist der **lokale** Tag. Nach UTC gerechnet bekäme jemand um 23 Uhr
die Hand von morgen und um 1 Uhr dieselbe noch einmal.

### Der Widerspruch zu E-035, und wie er aufgelöst ist

E-035 hat festgehalten: keine dekorativen Abbildungen. Große Spielkarten
sehen zunächst wie ein Verstoß aus.

Sie sind keiner. Was E-035 verbietet, ist **Fläche, die nichts sagt** — ein
Bild von Chips auf einer Karte, deren Thema „Nachschlagen" ist, sagt nichts,
was der Rest des Bildschirms nicht schon sagt. Eine Herz-Dame in einer
Aufgabe über Herz-Damen ist dagegen der Gegenstand selbst. Die Trennlinie
ist nicht „Bild oder Text", sondern „trägt es die Sache oder umrahmt es
sie".

Der Prüfstein: Deckt man die Karten ab, ist die Aufgabe nicht mehr lösbar.
Deckt man eine Abbildung von Chips ab, ändert sich nichts.

### Was das kostet: Die Startseite scrollt jetzt — außer am Tisch

Ausgerechnet und in Kauf genommen: Drei Karten mit Inhalt und eine Aufgabe
brauchen zusammen rund 670 Pixel. Ein 667 Pixel hohes Gerät hat nach
Kopfzeile und Rändern 567. Auf dem Bezugsgerät 390 × 844 passt es genau; auf
dem kürzesten scrollt es.

**Zwei Dinge machen das vertretbar:**

1. **Die Aufgabe steht immer oben und ist immer ohne Scrollen zu
   beantworten** — auf jedem der drei Bezugsgeräte geprüft. Wonach man
   scrollen muss, sind die Wege, und Wege darf man suchen.
2. **Am Tisch tritt der Fall nicht ein.** Läuft eine Runde, entfällt die
   Hand des Tages: Wer das Gerät zwischen Chips und Karten aufnimmt, will
   die Uhr sehen, keine Übungsaufgabe. Der Bildschirm ist dann wieder genau
   der aus E-032/E-035 — kein Scrollen, Live-Session doppelt so hoch wie die
   kleinste Karte, darunter nur der Gestenstreifen.

Die Höhenregeln aus E-032/E-035 sind damit **nicht abgeschafft, sondern an
die Lage gebunden, für die sie gedacht waren.** Der Durchgang misst seither
beide Zustände getrennt.

**Alternative:** Die Aufgabe kleiner machen, damit alles auf ein 667 Pixel
hohes Gerät passt.

**Warum nicht:** Dann wären die Karten wieder Briefmarken, und der einzige
Grund, die App zu öffnen, sähe aus wie eine Fußnote. Die Größe ist hier
nicht Geschmack, sondern die Aussage.

### Was noch nicht getan ist

Diese Entscheidung beschreibt mehr, als heute umgesetzt ist. Offen und
bewusst als Nächstes vorgesehen:

- Der Drill und die acht Trainer zeigen die Karten weiterhin klein.
- Das Profil ist weiterhin eine Wand aus Nullen; die 22 Abzeichen werden
  nicht gezeigt, bevor man sie hat.
- Die Bereichsfarben stehen bisher nur auf der Startseite, nicht auf den
  Bildschirmen der Bereiche selbst.
- Die Fließtext-Absätze am Kopf jedes Bildschirms sind unverändert.

---

## E-037 · 2026-08-30 · Der Lernpfad wird ein Pfad, der Rang wird ein Bild

**Stand:** entschieden und umgesetzt.

**Der Anlass.** E-036 hat die Startseite geändert; die Rückmeldung dazu war
„schon viel besser". Der Satz danach: die Unterseiten und die Lernlevel
müssen nach.

### Was der Rundgang durch die Unterseiten zeigt

**Der Lernpfad stand 3707 Pixel weit unten.** Gemessen, nicht geschätzt: Wer
„Lernen" antippte, bekam zuerst einen Absatz Fließtext, dann ein Suchfeld,
dann den Pot-Odds-Drill, dann elf Trainerkarten, dann Pro-Insights — und
danach erst das, wonach der Bildschirm benannt ist. Der Zweck der Seite lag
hinter ihrem Werkzeugkasten.

**Der Pfad war ein Kachelraster.** Neun gleich große Karten in zwei Spalten.
Ein Raster zeigt neun gleichwertige Möglichkeiten; ein Pfad zeigt, wo man
steht. Das ist der Unterschied zwischen einem Inhaltsverzeichnis und einem
Spiel.

**Das Modul zeigte keinen Stand.** Fünf Lektionen als flache Liste. Kein
Fortschritt, kein „hier weiter", keine Auskunft darüber, was eine Lektion
einbringt. Erledigtes war an einem Haken erkennbar — das war alles.

**Das Profil war eine Wand aus Nullen.** Acht gleich große Felder, für einen
Anfänger achtmal die Ziffer null, darunter „0/49" und „0/22". Das Levelsystem
mit fünfzehn Rangnamen und einer Kurve stand darin als „Level 1" in einem
Kasten.

### Die Entscheidung

**Fortschritt wird gezeigt, nicht aufgezählt.**

- **Der Rang bekommt einen Ring** und steht oben auf dem Lernpfad, nicht nur
  im Profil. Wer lernt, soll sehen, worauf er hinlernt: „Level 3 · Solider
  Anfänger · noch 260 XP bis Aufsteiger".
- **Der Lernpfad wird ein Pfad:** eine Spalte, eine Linie, neun Stufen, jede
  mit ihrem eigenen Fortschrittsring. Erledigte Stufen färben die Linie
  hinter sich ein — der zurückgelegte Weg ist sichtbar, nicht nur der Stand.
- **Genau eine Stufe trägt den Wegweiser** „Hier weiter": die erste, die
  weder fertig noch gesperrt ist. Zwei Wegweiser sind keiner.
- **Der Weg steht vor den Trainern.** Das Suchfeld steht darunter: Wer
  sucht, weiß schon, wonach — das ist der seltenere Fall.
- **Das Modul zeigt seinen Stand** als Ring, markiert die nächste Lektion und
  sagt bei den offenen, was sie einbringen („bis 100 XP").
- **Das Profil führt mit dem Rang** statt mit vier Kästen, von denen drei
  eine Null zeigen.

### Warum ein Ring und kein Balken

Ein Balken hat einen Anfang und ein Ende und wirkt wie eine Strecke, die man
abarbeitet. Ein Ring schließt sich und fängt wieder an — genau das tut ein
Level. Und ein Ring hat eine Mitte, in der die Zahl stehen kann, ohne dass
daneben eine Beschriftung nötig wäre.

### Der Nenner, und warum er hier erlaubt ist

E-032 hat „3 von 49 Lektionen" von der Startseite entfernt: Der Nenner war
eine Zusage über Inhalt, die der vorhandene nicht deckt.

Im Modul steht jetzt „2 von 5 Lektionen", und das ist kein Rückfall. Ein
Modul hat genau die Lektionen, die es hat — der Nenner ist dort eine
Tatsache, keine Ankündigung. Die Trennlinie: **Zählt der Nenner etwas, das
fertig ist, oder etwas, das noch werden soll?**

### Was die Tests dabei gefunden haben

**Die Level laufen über die Rangnamen hinaus weiter.** `levelForXp` kennt
keine Obergrenze, die Titelliste hat fünfzehn Einträge. Beim Schreiben des
Tests fiel auf, dass ein Bildschirm daraus „nächster Rang: undefined" machen
würde. Die Auskunft unterscheidet jetzt zwischen „letzter Rangname erreicht"
und „letztes Level" — ein Spielstand soll nicht aufhören zu wachsen, nur
weil die Namen ausgehen.

**Die XP-Zahl stand an zwei Stellen.** Der Bildschirm zeigt „bis 100 XP",
vergeben werden sie in `completeLesson`. Ein Test liest die Vergabe aus dem
Quelltext und vergleicht sie mit der angezeigten Zahl: Wer die eine ändert
und die andere vergisst, sieht es sofort.

**Zwei eigene Fehler beim Umbauen**, beide vom Typprüfer und vom Auge
gefangen: Das Suchfeld landete im Zweig „wird gerade nicht gesucht" und wäre
beim dritten getippten Zeichen verschwunden; und ein Kommentar blieb offen.
Das Suchfeld steht jetzt außerhalb der Verzweigung — ein Feld, das beim
Tippen an eine andere Stelle im Baum wandert, verliert den Fokus.

### Was noch nicht getan ist

- Der Drill und die acht Trainer zeigen die Karten weiterhin klein (aus
  E-036 offen geblieben).
- Die Fließtext-Absätze am Kopf der übrigen Bildschirme sind unverändert.
- Ein Abzeichen, das man neu bekommt, meldet sich als Hinweis — aber die
  Sammlung im Profil feiert es nicht.
- Die Bereichsfarben stehen auf der Startseite und im Lernpfad, noch nicht
  überall.

---

## E-038 · 2026-09-03 · Der Drill und die Trainer bekommen einen Spielstand

**Stand:** entschieden und umgesetzt.

**Der Anlass.** Nach E-036 (Startseite) und E-037 (Lernpfad) die dritte
Etappe derselben Sache: „mach den Drill und die Trainer auch noch".

### Was der Rundgang gezeigt hat

**Im Drill waren die Karten 28 Pixel breit.** Die kleinsten in der ganzen
App — ausgerechnet auf dem Bildschirm, dessen ganze Aufgabe darin besteht,
eine Hand anzusehen und zu bewerten. Die Bildschirmmitte war leer.

**Der Punktestand war dreimal Grau.** In jedem der sieben Trainer stand
dieselbe Zeile: „✓ 0 richtig", „0 gesamt", „Serie: 0". Drei Pillen
nebeneinander, alle gleich wichtig aussehend — und die interessanteste, die
Serie, sah aus wie die anderen.

**Die Bestserie war unsichtbar.** `bestStreak` wurde seit jeher mitgezählt
und nirgends gezeigt. Eine Bestmarke, die niemand kennt, ist keine.

**Der Drill führte gar keinen Stand.** Er zählte „3 von 5" für die laufende
Sitzung, und mit dem Schließen des Bildschirms war das weg.

**Jeder Trainer begann mit einem Absatz.** Zwei bis vier Zeilen Fließtext,
die erklärten, was die Übung ist — was man von der Karte weiß, die man
gerade angetippt hat.

### Die Entscheidung

- **Ein gemeinsamer Übungsstand** über jedem Trainer, drei Werte: Serie,
  Trefferquote, Bestserie. **Die Serie ist die Hauptzahl** — sie ist das
  Einzige, was man beim nächsten Antippen verlieren kann, und deshalb das
  Einzige, was Spannung erzeugt. Sie bekommt als Einzige Farbe, und nur
  wenn sie läuft: Eine Null ist keine Serie.
- **Die Bestserie wird gezeigt**, und wenn die laufende sie erreicht, sagt
  die Leiste das („Neue Bestserie").
- **Keine Quote ohne Versuche.** „0 %" nach null Aufgaben ist keine
  Auskunft, sondern ein Vorwurf; dort steht ein Strich.
- **Der Drill zählt wie die anderen** — Serie, Bestserie, XP, Abzeichen —
  unter eigener Kennung, weil Drill und Pot-Odds-Trainer zwei Übungen sind.
  Der Sitzungsstand unten entfällt: zweimal dieselbe Auskunft, davon einmal
  die schlechtere, ist einmal zu viel.
- **Die Karten im Drill werden groß** (62 statt 28 Pixel), eigene Hand
  größer als der Flop, mit einem Strich dazwischen — wie auf der Startseite.
- **Die Absätze über den Trainern werden zu einer Zeile.** Was die Übung
  ist, weiß man; was gilt, muss dastehen. Aus „Kurzer Stack im Turnier, alle
  folden zu dir: All-in oder Fold? Trainiere die vereinfachten Nash-Ranges
  für 10bb und 5bb – ohne Antes." wird „Vereinfachte Nash-Ranges für 10 bb
  und 5 bb · ohne Antes".

### Der Fehler, den der Durchgang gefunden hat

Der neue Schritt „Die Serie im Drill überlebt das Schließen" schlug beim
ersten Lauf fehl — und zwar zu Recht.

Die Kennung hieß zuerst `potodds-drill`. `sanitizeAppData` prüft beim Laden
aus dem Gerätespeicher jede Trainer-Kennung gegen `/^[a-z]+$/` und wirft
weg, was nicht passt. Der Bindestrich fiel durch. Die Folge: Die Zahlen
standen im Bildschirm, standen im Gerätespeicher — und waren nach dem
Neuladen verschwunden, ohne eine einzige Fehlermeldung.

**Warum das Muster trotzdem bleibt.** Ein beschädigter Gerätespeicher darf
die App nicht verbiegen, und dort still zu verwerfen ist richtig — anders als
bei den gerechneten Daten, wo laut gescheitert wird (E-007). Die Kennung
heißt jetzt `potoddsdrill`.

**Was dazukommt, ist das Netz.** `trainerkennungen.test.ts` schickt **jede**
Kennung, die die App verwendet, durch `sanitizeAppData` und prüft, dass sie
heil ankommt — mit der Begründung in der Fehlermeldung. Die Gegenprobe steht
daneben: Offensichtlicher Unsinn wird weiterhin verworfen.

**Die Lehre, schon wieder dieselbe:** Eine stille Prüfung ist eine Falle für
den Nächsten. Wo still verworfen werden muss, gehört ein Test daneben, der
laut wird.

### Was noch nicht getan ist

- Die Antwortknöpfe der sieben Trainer liegen weiter in der Bildschirmmitte,
  nicht im Daumenbereich. Der Drill hat sie unten; die anderen müssten dafür
  einzeln umgebaut werden.
- Zwei Trainer scrollen auf einem 844 Pixel hohen Gerät (Handranking wegen
  sieben Kategorien, Pot-Odds wegen der Formelzeile).
- Ein neu verdientes Abzeichen meldet sich als Hinweis, die Sammlung im
  Profil feiert es nicht.

---

## E-039 · 2026-09-04 · Der Prüflauf sah zwei Jahre lang denselben Seitentyp

**Stand:** entschieden und umgesetzt.

**Der Anlass.** Die Bitte, alles noch einmal durchzusehen und „bis es
wirklich perfekt läuft" zu optimieren — ausdrücklich auch die Knöpfe.

### Der Befund, der alles andere nach sich zog

`npm run pruefen` meldete seit Monaten „49 Bildschirme in 2 Modi geprüft, 0
Befunde". Die Zeile, die die Bildschirme auswählt, lautete:

```js
const bildschirme = wege.wege.filter((w) => w.inhalt).map((w) => w.hash);
```

`inhalt: true` bedeutet in `wege.json` aber **„ist eine Lektion"**, nicht
„ist ein Bildschirm". Der Lauf hat also 49 Lektionsseiten geprüft — und
keinen einzigen Trainer, keine Startseite, keinen Tisch, kein Profil. Der
Test daneben bestätigte ihm die 49, weil er dieselbe Zeile noch einmal
schrieb.

**Zwei Stellen, die dieselbe falsche Annahme teilen, prüfen einander nicht.**

Auf alle 90 Adressen ausgeweitet: **3661 Befunde an 97 Stellen.**

### Was darin steckte

**Der ganze Live-Bereich war im hellen Modus praktisch unlesbar.** Gemessen
1,02 zu 1 bei „Abend führen", 1,20 bei den Überschriften — dunkle Schrift
auf dunklem Grund.

Die Ursache ist lehrreich: `body { color: var(--text) }` wird **einmal**
aufgelöst, auf dem body, mit dem Satz, der dort gilt. Der Live-Bereich
schaltet weiter unten `data-modus="dunkel"` und ändert damit die Variable —
aber nicht die schon aufgelöste Farbe. Alles darin, was keine eigene Farbe
setzt, erbt weiter die helle.

Behoben mit einer Regel, die am Attribut hängt statt an einer Klasse, damit
sie auch für die nächste Stelle gilt, die den Satz wechselt:

```css
[data-modus] { color: var(--text); }
```

**Warum es nie auffiel:** Der Kontrastlauf sah nur Lektionen. Und der
Durchgangsschritt „Der Live-Bereich bleibt dunkel, auch bei heller Wahl"
prüfte die **Fläche**, nicht die **Schrift**.

**Die Handmatrix hatte denselben Fehler:** eine fest verdrahtete dunkle
Zellfläche mit `--text-faint` darauf — im hellen Modus 1,21 zu 1. Und die
aktive Schaltfläche des segmentierten Umschalters nutzte `--auszeichnung` in
ihrem Verlauf, das im hellen Modus dunkel wird: 2,76 zu 1. Genau der Fund
aus E-034, beim Aufräumen an zwei Stellen übersehen.

**Dazu:** hart geschriebene Dunkelmodus-Hexwerte in Komponenten (`#d8d5cb`,
`#eda49f`, `#90d69c`, `#94bdea`, `#bda6e8`), Kennfarben von Personen als
Schriftfarbe (1,83 bis 2,02), zu kleine Bedienflächen (der „−"-Knopf im
Einrichten war **10 Pixel breit**), Kartenüberschriften auf der Startseite
mit 17 Pixeln Höhe.

**Ergebnis nach dem Aufräumen: 90 Bildschirme, 2 Modi, 180 Messungen, null
Befunde.**

### Der neue Lauf: `npm run daumen`

Die vorhandenen Läufe messen, ob eine Bedienfläche groß genug ist und
Kontrast hat. Beides kann stimmen, während der Knopf falsch sitzt: **Eine
44 Pixel große Fläche in der Bildschirmmitte besteht jede dieser Prüfungen
und ist einhändig trotzdem schlecht zu treffen.**

`npm run daumen` misst, ob das, was man tun soll, dort liegt, wo der Daumen
ist — auf jedem der 90 Bildschirme.

**Gemessen wird an einer Auszeichnung, nicht an einer Heuristik.** Jeder
Bildschirm, auf dem man antwortet, trägt seine Knöpfe in einem Element mit
der Klasse `entscheidung`. Eine Regel, die „irgendwie erkennt", welcher
Knopf wichtig ist, erkennt beim nächsten Bildschirm etwas anderes.

**Die Leiste klebt.** Zwei Übungen sind länger als ein Bildschirm, und wie
lang eine Szenario-Aufgabe wird, entscheidet der Zufall. Die erste Fassung
der Regel lautete „ein Entscheidungsbildschirm scrollt nicht" — sie meldete
zwei Trainer und beim nächsten Lauf andere Zahlen. **Eine Regel, deren
Ergebnis vom Zufall abhängt, prüft nichts.** Jetzt gilt: Scrollen ist
erlaubt, eine mitscrollende Leiste nicht.

### Die Ausnahme für die Handmatrix, und ihr Preis

169 Felder bei einer Fingerbreite je Feld wären 668 Pixel breit — auf einem
390 Pixel breiten Gerät nicht mehr als Ganzes zu sehen. Als Ganzes gesehen
zu werden ist aber ihr einziger Zweck.

Sie ist deshalb von der Größen- und Abstandsregel ausgenommen — **unter
einer Bedingung: Was über ein Diagramm erreichbar ist, muss auch ohne
erreichbar sein.** Der Starthand-Explorer hat dafür eine zweite Auswahl
bekommen: zwei Reihen Rangknöpfe und ein Umschalter für Suited/Offsuit, alle
in Mindestgröße.

Eine Ausnahme ohne Ausgleich wäre ein Freibrief.

### Zwei Verfeinerungen an den Regeln selbst

**Abstand zählt nur bei kleinen Zielen.** Der Abstand ist kein Selbstzweck,
er ist der Ausgleich für zu kleine Ziele. Zwei Flächen, die beide eine
Fingerbreite messen, darf man aneinanderlegen — so ist jede Tastatur gebaut.
Ohne diese Bedingung meldete der Lauf 2442 Befunde, von denen keiner ein
Fehlgriff war, und verdeckte damit die, die es waren.

**Gemessen wird die Fläche, die den Klick annimmt.** Ein Kontrollkästchen
ist 14 × 22 Pixel groß, und daran ändert kein Stilblatt etwas — der Browser
zeichnet es selbst. Bedient wird es über sein `<label>`. Das ist keine
Ausnahme, sondern die genauere Messung.

### Eine Regression, die der Durchgang sofort meldete

Als die Entscheidungsleiste auch am Pot-Odds-Drill hing, sprang dessen
Antwortknopf um **24 Pixel** — die Zusage „zwischen Eingabe und Ergebnis
bewegt sich nichts" war weg.

Behoben, indem Marke und Bauart getrennt wurden: `entscheidung` sagt, **dass**
hier entschieden wird (daran misst der Lauf); `entscheidung-leiste` ist
**eine** Bauart davon. Der Drill trägt nur die erste, weil seine Höhenkette
eine Zusage hält, die keine andere hält.

---

## E-040 · 2026-09-04 · Der Übungstisch wird eine Spielansicht

**Stand:** entschieden und umgesetzt.

**Der Anlass, im Wortlaut:** „Ich hab grad auf den Übungstisch geklickt. Er
ist total schlecht gemacht. […] Dann, wenn man das spielt, dann ist auf
einmal der obere Spieler überdeckt dann auf einmal den River oder den Flop."

### Der Fehler war die Anordnung, nicht die Zahl

Die Sitze standen an Prozentkoordinaten:

```js
6: [{ x: 50, y: 88 }, { x: 8, y: 62 }, { x: 12, y: 12 }, { x: 50, y: 2 }, …]
```

Jeder Sitz hing an seinem `top: y%` und **wuchs von dort nach unten aus sich
heraus** — Name, Stapel, Position, zwei Karten. Der oberste Sitz begann bei
2 % eines 380 Pixel hohen Filzes, also bei 8 Pixeln, und war rund 118 Pixel
hoch. Das Board lag bei 42 %, also ab 135 Pixeln. Sobald ein Sitz eine Zeile
mehr trug, lag er darüber.

**Man hätte die Koordinate nachstellen können.** Das wäre eine Zahl gewesen,
die auf eine andere Zahl abgestimmt ist — und die hält bis zur nächsten
Änderung (DESIGN.md 10.4).

**Stattdessen: drei Bänder untereinander.** Gegner, Mitte, eigene Hand. Ein
Band kann das Band daneben nicht überdecken; das ist keine Einstellung,
sondern eine Eigenschaft der Anordnung.

### Was daraus eine Spielansicht macht

- **Fünf Board-Plätze, immer.** Die noch nicht ausgeteilten stehen als leere
  Umrisse da — an einem echten Tisch sieht man, wie viele Karten noch
  kommen. Vorher zeigte das Board nur, was schon lag.
- **Die eigene Hand ist die größte Darstellung** auf dem Tisch: 96 Pixel
  gegen 28 bei den verdeckten Karten der Gegner. Sie ist der Gegenstand
  (Regel 10.8).
- **Der Filz nimmt die Höhe, die die Seite übrig lässt** — keine
  hingeschriebenen 380 Pixel mehr.
- **Wer dran ist, hat einen Ring**, nicht nur eine andere Schrift: Am Tisch
  sucht man den Blick, nicht den Text.
- **Der Einsatz liegt vor dem Sitz**, wie die Chips vor dem Spieler.
- **Beim Showdown steht in der Tischmitte, wer gewonnen hat.** Vorher stand
  das unterhalb des Bildrands — die Auskunft, auf die man gewartet hat.
- **Die Aktionsknöpfe liegen in der Entscheidungsleiste** (E-039), unten im
  Daumenbereich, an derselben Stelle wie in jedem Trainer.

### Bei fünf Gegnern drei oben, zwei darunter

Nebeneinander blieben jedem 78 Pixel — eine halbe Kartenbreite. Zwei Reihen
sind die Anordnung, die ein Sechser-Tisch auf einem Handy verträgt.

Der Einsatz-Chip hängt unter dem Sitz heraus; deshalb ist der Zeilenabstand
größer als der Spaltenabstand. Ohne das stieß er an die Sitze darunter — der
kleine Bruder desselben Fehlers.

### Was der Durchgang jetzt festhält

Nicht die Anordnung, sondern ihre Folge: kein Sitz schneidet das Board, kein
Sitz die eigene Hand, beide ohne Scrollen sichtbar, fünf Board-Plätze, die
eigene Hand mehr als doppelt so breit wie eine Gegnerkarte, die Entscheidung
im Daumenbereich.

**Eine neue Anordnung, die denselben Fehler macht, fällt dort auf.**

---

## E-041 · 2026-09-05 · Der Tisch bekommt einen Ring, die Prüfung bekommt Augen

**Stand:** entschieden und umgesetzt.

**Der Anlass, im Wortlaut:** „mach den übungstisch noch schöner, mehr wie ein
echter tisch".

### Drei Bänder waren richtig und sahen trotzdem falsch aus

E-040 hat die gemeldete Überdeckung beseitigt, indem es die Sitze
untereinanderlegte. Der Fehler war weg. Aber das Ergebnis war eine Liste auf
grünem Grund: fünf breite Kästen in einem 3+2-Raster, darunter das Board,
darunter ein schwarzer Balken über die volle Breite. Ein Tisch hat die
Plätze **um** die Mitte.

**Der Ring ist ein Raster mit benannten Feldern.** Zwei Rasterfelder können
sich genauso wenig überlappen wie zwei Bänder — die Zusage aus E-040 gilt
unverändert, und der Durchgangsschritt, der sie festhält, blieb Wort für
Wort stehen. Was sich ändert, ist, wo die Felder liegen:

```
schmal              breit (ab 860 px)
p2  p3  p4          .  p2    p3    p4    .
p1 topf p5          p1 topf  topf  topf  p5
board board board   p1 board board board p5
lage  lage  lage    .  lage  lage  lage  .
du    du    du      .  du    du    du    .
```

Welcher Platz wo sitzt, entscheidet `data-platz` (der Sitzindex) zusammen
mit `data-gegner`. Keine Koordinate im Skript, keine Zeilenhöhe: Die Felder
sind so hoch wie ihr Inhalt, und `align-content: space-evenly` verteilt, was
übrig bleibt (Regel 10.4).

### Was aus einer Anordnung einen Tisch macht

- **Ein Namensschild statt eines Kastens.** Name oben, Stapel und Lage
  darunter, auf einer Plakette mit Lichtkante — das, was am echten Tisch vor
  dem Spieler steht und was man aus zwei Metern noch liest.
- **Die Karten liegen auf dem Schild auf**, leicht gefächert, mit Schatten
  auf dem Tuch. Zwei gerade Rechtecke sehen aus wie zwei Rechtecke.
- **Jetons statt Punkte.** Der Chip ist ein Kegelverlauf mit acht
  Kanteneinlagen und einem glatten Kern, der Topf ein Stapel aus drei
  Scheiben, der Dealerknopf eine Elfenbeinscheibe mit eingeprägtem Rand.
  Alles gezeichnet, keine Datei.
- **Die Rail ist von oben beleuchtet** (vier Randfarben statt einer) und
  wirft einen Schatten in den Raum. Am breiten Bildschirm wird aus der
  Rennbahn eine Ellipse und die Kante breiter — 13 Pixel um eine 930 Pixel
  breite Ellipse sind ein Strich, keine Kante.
- **Die leeren Board-Plätze sind Vertiefungen**, keine gestrichelten
  Umrisse: Eine gestrichelte Linie liest sich als Platzhalter einer
  Oberfläche, eine Vertiefung als Stelle auf dem Tisch.
- **Eine Zeile, die ihren Inhalt tauscht**: erst wer dran ist, dann wer
  gewonnen hat. Sie bleibt im Baum, weil ein `aria-live`-Bereich, der neu
  entsteht, nichts vorliest — vorher tat sie genau das.

### Der Filz ist eine dunkle Fläche, auch im hellen Modus

Im hellen Modus standen die Namen der Gegner in Anthrazit auf Dunkelgrün.
Gemessen: **1,79 zu 1.** Praktisch unlesbar.

Das ist **keine zweite Ausnahme von der Farbwahl** — die Liste in `App.tsx`
hat weiterhin genau einen Eintrag, und die Begründung dort (der Live-Bereich
liegt bei gedimmtem Licht auf einem Pokertisch) bleibt die einzige. Der
Unterschied: Ein *Bereich* der App folgt der Wahl; ein *gezeichneter
Gegenstand* hat seine eigene Farbe. Grüner Filz ist dunkel, in jedem Modus,
so wie ein roter Kartenrücken rot ist. Die Regel `[data-modus] { color }`
aus E-039 war genau dafür gemacht.

### Warum das erst jetzt auffiel: die Prüfung hatte zwei blinde Flecken

**Erstens: Sie hatte den Tisch nie gesehen.** E-039 hat den Lauf von 49 auf
90 Bildschirme ausgeweitet — auf *alle Adressen*. Der Übungstisch hat unter
seiner Adresse aber **zwei** Bildschirme: die Auswahl der Tischgröße und den
Tisch, auf dem gespielt wird. Der Lauf sah die Auswahl und meldete „90
Bildschirme geprüft".

Dieselbe Lehre wie in E-039 (DESIGN.md 9.1), eine Ebene tiefer: *Alle
Adressen* ist nicht dasselbe wie *alles, was man zu sehen bekommt*. Es gibt
jetzt eine kurze, namentliche Liste von Bildschirmen hinter einem Klick —
und der Test vergleicht nicht mehr eine Zahl, sondern die Liste der
geprüften Bildschirme gegen jede Adresse aus `wege.json`.

**Zweitens: Sie kannte `opacity` nicht.** `opacity: 0.5` blendet einen
ganzen Teilbaum gegen das, was dahinter liegt — Schrift und eigenen Grund
gleichermaßen. Wer nur `color` und `background-color` liest, misst eine
Lesbarkeit, die es auf dem Bildschirm nicht gibt: Für den Namen eines
ausgestiegenen Gegners meldete die alte Rechnung 8,9 zu 1; gemalt waren es
2,4.

Nachgerüstet kamen **303 Befunde** ans Licht, keiner davon vom Tisch:

| Stelle | Deckkraft | gemessen |
|---|---|---|
| Beschreibung einer gesperrten Lektion (hell) | 0,72 | 3,78 |
| Nummer einer späteren Lektion (dunkel) | 0,72 | 4,41 |
| Symbol einer nicht verdienten Auszeichnung (hell) | 0,32 | 1,99 |
| „Erst Koffer und Spieler eintragen" (Knopf aus) | 0,45 | 1,65 |

An sechs Stellen standen sechs Werte zwischen 0,25 und 0,72, und keiner war
je nachgerechnet worden.

**Drittens, dabei gefunden: Verläufe wurden verrührt.** Alle Ebenen eines
`background-image` landeten in einer Liste von Farbstopps. Auf dem Filz
liegen drei: zwei fast durchsichtige Gewebemuster und darunter ein deckender
Verlauf. Verrührt ergab das „vielleicht liegt der Text auf einem 1,4 %
weißen Schleier über dem Seitenhintergrund" — im hellen Modus also fast auf
Weiß. Gemeldet wurden 1,25 zu 1 für weiße Schrift auf dunkelgrünem Filz.
Ebenen werden jetzt einzeln betrachtet, und eine Ebene, deren Stopps alle
deckend sind, **deckt**: Darunter endet die Suche.

### Ein Wert für „tritt zurück", gemessen statt gewählt

`--gedimmt: 0.88`. Der Durchlauf über 0,6 bis 1,0 zeigt, wo es kippt: Bei
0,85 erreicht der schlechteste Fall (die Marke „Einsteiger" auf dem
Lernpfad, hell) 4,52 zu 1. 0,88 lässt Luft.

Daraus folgt ein Entwurfsurteil (DESIGN.md 10.10): **Bei 0,88 sieht man den
Unterschied kaum noch — also darf Ausgrautsein nicht länger das Kennzeichen
sein.** Es war ohnehin nie eines: Der Lernpfad hat ein Schloss an der
gesperrten Stufe und die Akzentfarbe an der, die dran ist; die nicht
verdiente Auszeichnung ist grau statt farbig; der ausgestiegene Sitz hat
keine Karten mehr, sondern eine Marke. Die Deckkraft hat das nur begleitet —
und dabei die Lesbarkeit gekostet.

Zwei Stellen kamen mit keiner Deckkraft aus und wurden anders gelöst:

- **Die Marke des Ausgestiegenen und die Zugzeile** liegen direkt auf dem
  Filz und kamen auf 1,2 zu 1. Sie haben jetzt einen eigenen dunklen Grund —
  hellgrau auf Mittelgrün ist keine Schrift, das ist ein Schatten.
- **Ein ausgeschalteter Knopf, der in seiner Beschriftung sagt, warum er
  nicht geht**, muss lesbar bleiben. Er zeigt das jetzt über die Fläche, nicht
  über Deckkraft. (Die WCAG nimmt ausgeschaltete Bedienelemente vom
  Kontrast aus. Diese Auskunft steht aber nirgends sonst.)

### Und eine Ausnahme, die begründet ist

Das Symbol in der Mitte einer Spielkarte ist 52 Pixel groß und fiel damit
unter die schärfere Grenze für Ergebniszahlen (7 zu 1). Es ist keine: Es
wiederholt, was in der Ecke schon steht. Rot auf Elfenbein ist die Farbe
einer Spielkarte — auf 7 zu 1 gedunkelt wäre es keine mehr.

Die Bedingung, unter der die Ausnahme gilt (DESIGN.md 9.2): Was das Symbol
sagt, sagt der Rang in der Ecke auch — und der wird nach der normalen Grenze
gemessen, wie jeder andere Text.

### Stand nach dem Lauf

**91 Bildschirme in 2 Modi (182 Messungen), 0 Befunde** — mit Deckkraft,
mit einzeln betrachteten Verläufen und mit dem Tisch, auf dem gespielt wird.

---

## E-042 · 2026-09-05 · Die Unterseiten zeigen, was hinter ihnen liegt

**Stand:** entschieden und umgesetzt.

**Der Anlass, im Wortlaut:** „mach die anderen unterseiten auch nochmal so
schön".

### Dieselbe Lehre, drei Ebenen tiefer

Am Tisch (E-041) hieß sie: Zeig den Gegenstand, nicht seine Beschriftung.
Auf den mittleren Ebenen — Nachschlagen und Live-Session — stand unter jedem
Namen ein Satz, der den Namen erklärte:

> **Glossar** — Jeder Begriff, den am Tisch jemand fallen lässt

Sieben davon untereinander sind sieben Absätze, kein Bereich; zweieinhalb
Bildschirme, auf denen nichts stand, was man nicht schon aus dem Namen wusste.

**Jetzt trägt jede Kachel, was hinter ihr liegt** — und alle Zahlen kommen
aus denselben Daten wie die Seite dahinter:

| Kachel | vorher | jetzt |
|---|---|---|
| Glossar | „Jeder Begriff, den am Tisch jemand fallen lässt" | 159 Begriffe von A bis Z |
| Starthände | „Welche Hand aus welcher Position spielbar ist" | Alle 169 Hände · Button eröffnet 42 % + das Raster in klein |
| Odds-Tabellen | „Outs, Pot Odds und Verbesserungschancen zum Ablesen" | Flushdraw 35 %, Gutshot 16 % bis zum River |
| Tells & Reads | „Worauf man bei Gegnern achtet" | 27 Tells, jeder mit Zuverlässigkeit |
| Frühere Abende | drei Zeilen Erklärung | 3 Abende · zuletzt 2. Sept. |
| Bankroll | drei Zeilen Erklärung | 12 Sessions · Bilanz +240 |

Das ist **kürzer** als der Satz, den es ersetzt: Der ganze Bereich passt jetzt
auf einen Bildschirm (804 von 844 Pixeln), vorher waren es zweieinhalb. Und
„zwei Schritte bis zur Antwort" stimmt wieder — manche Antworten stehen schon
im ersten.

**Warum die Zahl gerechnet und nicht hingeschrieben wird:** Eine Kachel, die
159 behauptet, während dahinter 160 stehen, ist schlimmer als eine ohne Zahl —
sie kostet das Vertrauen in alle anderen mit. `bereich.test.ts` prüft deshalb,
dass die Seite `content.glossary.length` benutzt und nicht eine Ziffernfolge.
Der erste Versuch stand auch prompt falsch da: **„Button eröffnet 0 %"**,
weil `rangePercent` einen Anteil zwischen 0 und 1 liefert und nicht Prozent.
Im Bild sofort zu sehen, im Quelltext gar nicht.

### Eine Farbe je Bereich, nicht eine je Eintrag

Die sieben Symbole standen in sieben Farben: rot, blau, grün, gold, blau,
violett, violett. Sieben Farben nebeneinander sagen „sieben unverwandte
Dinge" — und der Chip-Rechner stand in Rot da wie eine Fehlermeldung.

Regel 10.9 sagt: Der **Bereich** hat eine Farbe. Nachschlagen blau,
Live-Session grün. Die Farbe steht jetzt an der Liste (`--bereichsfarbe`),
nicht am Eintrag; der Durchgang zählt nach, dass es genau eine ist.

### Das Glossar war eine Wand

159 Begriffe mit vollständiger Definition, alle gleichzeitig ausgeklappt:
**30 219 Pixel** Seitenhöhe bei 844 Pixeln Bildschirm — 36 Bildschirmlängen
Fließtext für ein Nachschlagewerk.

Jetzt ist es ein Wörterbuch: eine Zeile je Begriff mit der ersten Zeile der
Erklärung, nach Anfangsbuchstaben gruppiert, der Buchstabe klebt beim
Scrollen oben. Ein Tipp klappt den Eintrag auf. **11 425 Pixel**, ein Drittel.

Die Vorschauzeile ist der Grund, warum das kein zusätzlicher Weg ist:
Meistens steht die Antwort schon da. Und der Text bleibt in beiden Zuständen
im Baum — für ein Vorlesegerät fehlt nichts, beschnitten wird nur optisch.

**Ein einziger Suchtreffer klappt sich von selbst auf.** Das ist keine
Schwelle, sondern eine Regel: Bei genau einem Treffer gibt es nichts zu
wählen — und genau dort landet, wer aus der Suche unter „Nachschlagen" mit
`?q=` herkommt.

### Die Sammlung feiert, was verdient ist

Ein verdientes Abzeichen unterschied sich von einem unverdienten durch einen
Rahmen und das Wort „verdient" — dabei ist das Verdienen der ganze Zweck. Ein
neues meldete sich beim Erhalten mit einem Hinweis und verschwand danach in
einer Kachelwand. (Offen seit E-038, dort benannt.)

Jetzt ist es eine Medaille: eine Scheibe mit Ring in der Auszeichnungsfarbe,
ein Schimmer, ein warmer Anflug auf der Karte — und darunter der Tag, an dem
es dazukam. **Das Datum ist keine Verzierung: Es ist das, was eine Sammlung
von einer Liste unterscheidet.** Über der Sammlung steht der Stand, „3 von 22".

### Fünf Seiten schickten nach „Tools" zurück

Beim Durchsehen gefunden: Equity-Rechner, Starthand-Explorer, Odds-Tabellen,
Range-Charts, Tells und Bankroll trugen oben „← Tools" — einen Bereich, den
die App seit dem Umbau auf Lernen / Nachschlagen / Live-Session (E-030) nicht
mehr hat. Sie benutzten außerdem eine eigene Rückweg-Bauform, während alle
anderen Seiten `BackLink` verwenden.

Der Wegelauf hat das nie gesehen: Er prüft, ob ein Link **ankommt**, nicht,
wohin er zu führen **behauptet**. Der Durchgang prüft jetzt beides — die
Beschriftung jedes Rückwegs muss ein Bereich sein, den es gibt.

### Jedes Eingabefeld war im hellen Modus ein grauer Klotz

`.search-input` und `.text-input` lagen auf `--scrim` — einem
durchscheinenden Schleier, der für Überlagerungen auf dunklem Grund gedacht
ist. Im hellen Modus ergab das 45 % Dunkel auf Creme.

Der Kontrastlauf konnte es nicht finden: `--scrim` steht in `farbrollen.ts`
unter `OHNE_TEXTGRENZE`, also unter „hier steht kein Text". In einem
Eingabefeld steht aber welcher. Es gibt jetzt `--feld` als eigene **Fläche**,
und damit prüft der Lauf auch, ob man darin lesen kann.

### Was nicht gemacht wurde, und warum

Der Vorspann jeder Unterseite — vier bis fünf Zeilen Fließtext unter der
Überschrift — sah nach der nächsten Baustelle aus. Gemessen wurde, wo auf
jedem Bildschirm das Erste beginnt, mit dem man etwas tun kann, auf dem
**kleinsten** Bezugsgerät (375 × 667):

```
447 / 667  #/profil
404 / 667  #/lernen/pros
398 / 667  #/lernen
…
330 / 667  #/nachschlagen/coach
```

Kein einziger Bildschirm schiebt seinen Inhalt unter die Falz. Der Vorspann
kostet nichts, was jemand vermisst — **also bleibt er.** Eine Änderung, für
die es nur ein Gefühl gibt und keine Messung, ist keine Verbesserung.

### Stand nach dem Lauf

91 Bildschirme in 2 Modi (182 Messungen), 0 Befunde. 1053 Tests grün,
Durchgang vollständig (drei neue Schritte), Daumenlauf ohne Befund,
90 Adressen erreichbar, 0 Sackgassen.

---

## E-043 · 2026-09-05 · Was keine Prüfung ansah: Tastatur, Konsole, Kilobytes

**Stand:** entschieden und umgesetzt.

**Der Anlass, im Wortlaut:** „Schau dir alles Weitere auch noch mal an, wo Du
noch was findest, was Du noch verbessern oder auch optimieren kannst."

Kein einzelner Bildschirm, also auch keine Suche nach Geschmack. Stattdessen
die Frage: **Welche Art, diese App zu benutzen, deckt bisher keine Zahl ab?**
Vier Antworten — und in jeder war etwas kaputt.

### 1. Die Tastatur: 55 von 90 Bildschirmen ohne sichtbaren Fokus

Es gab drei Fokusregeln in der ganzen App — für die Starthand-Matrix, für
eine ihrer Zellen und für ein Herkunftszeichen. Überall sonst zeigte das
Weiterspringen mit der Tabulatortaste **nichts** an: Der Browserumriss ist
`auto 1px` in einem Grau, das auf dunklem Grund unsichtbar ist.

Für jeden, der die App mit der Tastatur bedient, ist das derselbe Verlust wie
ein unsichtbarer Mauszeiger.

Es gibt jetzt eine Regel für alles: `:focus-visible` mit einem 2,5 Pixel
breiten Ring in der Fokusfarbe plus einem dunklen Saum, damit er auch auf
gleichfarbigem Grund zu sehen ist. `:focus-visible` und nicht `:focus` — der
Ring gehört dem, der tastet; wer tippt, hat den Finger schon dort.

### 2. Fünf Bedienelemente ohne Namen

Für ein Vorlesegerät hießen sie „Schaltfläche" beziehungsweise
„Eingabefeld": ein Schieberegler im Equity-Trainer, die Lektionssuche, die
Glossarsuche, das E-Mail- und das Namensfeld im Profil. Vier davon hatten
einen Platzhalter — der **verschwindet beim ersten Zeichen**, also genau
dann, wenn man ihn bräuchte.

Zwei hatten sogar eine sichtbare Beschriftung darüber, nur war sie nie mit
dem Feld verbunden: ein `<div>` statt eines `<label for>`.

### 3. Die Konsole meldete auf jeder Seite dasselbe — seit wann, weiß niemand

```
Refused to execute inline script because it violates the following
Content-Security-Policy directive: "script-src 'self' https://apis.google.com"
```

In `index.html` steht genau ein inline-Skript: das, welches den Farbmodus
setzt, **bevor** das Stilblatt greift. Sein Kommentar sagt, es sei die
Vorbeugung gegen das Aufblitzen des falschen Modus, „die sich nicht
wegdiskutieren lässt". Es lief nie.

**Warum der Durchgang das nicht gefunden hat**, ist die eigentliche Lehre.
Der Schritt „Nach dem Neuladen steht die Farbe vor dem ersten Zeichnen fest"
maß bei `domcontentloaded`. Das Programm hängt als `type="module"` im
Dokument und läuft **vor** diesem Ereignis — gemessen wurde also, was React
gesetzt hatte, nicht, was das inline-Skript getan hätte. Der Schritt hätte
auch dann Grün gemeldet, wenn es die Datei gar nicht gäbe.

Zwei Änderungen:

- Gemessen wird bei `commit` — direkt nachdem das Dokument zu laufen
  beginnt und bevor irgendein Modul an der Reihe war. Vorher: `null`.
  Nachher: `hell` beziehungsweise `dunkel`.
- Die Konsole wird mitgelesen. Eine Richtlinie, die etwas still verbietet,
  meldet sich nur dort — und `konsolenfehler: []` ist jetzt Teil des
  Ergebnisses.

Erlaubt wird das Skript über seinen **Hash**, nicht über `'unsafe-inline'`:
genau dieses eine Skript, Zeichen für Zeichen. Gerechnet wird er zur Bauzeit
aus dem fertigen HTML (`order: 'post'`), damit er zum ausgelieferten Text
passt und nicht zum Entwurf. Ein von Hand eingetragener Hash wäre beim
nächsten Komma im Skript falsch — und die Vorbeugung wieder still aus.

### 4. Die Startseite lud 706 kB Firebase, die sie nicht braucht

Gemessen auf gedrosseltem 4G mit vierfach verlangsamter Rechenleistung:

| | vorher | jetzt |
|---|---|---|
| Dateien beim Start | 5 | **1** |
| davon Firebase | 706 kB (≈ 213 kB übertragen) | 0 |
| erster Start | 2,97 s | 2,94 s |
| **zweiter Start** | **367 ms** | 367 ms |
| offline | 408 ms | 408 ms |

Der `CloudProvider` rief beim Einhängen bedingungslos `getCloud()` — auch
bei jemandem, der sich nie anmeldet und die App nur zum Üben benutzt. 37 %
der Bytes des ersten Starts für eine Funktion, die die meisten nie anfassen.

Firebase muss aber **sofort** geladen werden, wenn jemand angemeldet ist —
sonst stünde er beim Öffnen als abgemeldet da. Die Frage war also: Woher
weiß man das, bevor man Firebase fragt? Aus zwei Spuren, die die App selbst
hinterlässt: einem verknüpften Profil (`activeProfile.cloudUid`) und einer
Marke, die beim Anmelden gesetzt und beim Abmelden gelöscht wird. Gehen
beide verloren, heilt es von selbst: Sobald die Kontokarte im Profil
erscheint, wird nachgeladen und die Sitzung wiederhergestellt.

**Was ausdrücklich NICHT gemacht wurde.** Der erste Start bleibt bei rund
drei Sekunden, weil 408 kB Programm über eine gedrosselte Leitung nun einmal
zwei Sekunden brauchen. Ihn wirklich zu halbieren hieße, die Lektionstexte
aus dem Startpaket zu lösen — ein Umbau der Inhaltsschicht, an der die
Lektionssuche, das Tagesquiz und die Wiederholung hängen. Dem steht die
Zahl gegenüber, die zählt: **Die App, die als Symbol auf dem
Startbildschirm liegt und einmal am Tag geöffnet wird, startet in 367
Millisekunden.** Die drei Sekunden zahlt man einmal, bei der Installation.

Ein Umbau mit echtem Risiko für eine Zahl, die den täglichen Gebrauch nicht
berührt, ist keine Verbesserung. Die Messung steht im Durchgang, damit die
Entscheidung nachprüfbar bleibt — und damit auffällt, wenn die Startseite
wieder anfängt, Dinge zu laden, die sie nicht braucht.

### 5. Nebenbei: „150 XP to Küchentisch-Spieler"

Ein Wegwerf-Skript, das die englische Oberfläche nach deutschen Wörtern
absucht, fand die Rangnamen: eine deutsche Liste, in beiden Sprachen
angezeigt. Gespeichert wird nur die Zahl — die Namen sind reine Anzeige und
gehören übersetzt.

Weil ein Wegwerf-Skript beim nächsten Mal nicht mehr da ist, steht die Suche
jetzt im Bedienbarkeitslauf. Mit einer **benannten Ausnahmeliste**: BZgA,
check-dein-spiel.de, „Gemeinsame Glücksspielbehörde der Länder",
Glücksspielstaatsvertrag. Das sind deutsche Eigennamen, die auch im
englischen Text deutsch bleiben — ein Text, der sie übersetzt, wäre falsch,
nicht höflich.

### Der neue Lauf: `npm run bedienbar`

90 Bildschirme in zwei **Sprachen** (nicht Farbmodi — die Namen der
Bedienelemente und die Dokumentsprache hängen an der Sprache). Gemessen
wird am gerenderten Ergebnis: Namen von Bedienelementen, Überschriften­
gliederung, doppelte Kennungen, Bilder ohne Alternative, genau ein
Hauptbereich, die Dokumentsprache, Deutsch in der englischen Oberfläche —
und der Fokus, indem wirklich Tab gedrückt und danach verglichen wird.

Zwei Dinge, ohne die der Lauf wertlos wäre:

- **Er prüft mehrere Bauformen je Bildschirm, nicht nur die erste.** Der
  erste Knopf ist auf 55 von 90 Bildschirmen derselbe — der Rückweg. Eine
  Regel, die nur ihn trifft, sähe grün aus, während alles darunter
  unsichtbar bliebe.
- **Er ist gegengeprüft.** Mit abgeschalteter Fokusregel meldet er 66× den
  Rückweg, 51× den Hauptknopf, 22× den kleinen Link, 9× die Lektionskarte.
  Ein Lauf, der nie rot werden kann, ist eine Beruhigung, keine Prüfung.

Und ein eigener Fehler auf dem Weg dorthin, der hierher gehört: Der erste
Lauf meldete 110 Fokusbefunde, obwohl die Regel längst da war. Ursache: Die
App wechselt den Bildschirm über den Teil hinter dem Doppelkreuz — das
Dokument wird dabei nicht neu geladen, und der Tastaturfokus überlebt den
Wechsel. Gemessen wurde ein Element, das noch von der Seite davor den Fokus
hatte. Seitdem wird vor jeder Messung aufgeräumt.

### Stand nach dem Lauf

- `npm run bedienbar`: 90 Bildschirme in 2 Sprachen (180 Messungen), 446
  angesprungene Bedienelemente, **0 Befunde**
- `npm run pruefen`: 91 Bildschirme in 2 Modi (182 Messungen), 0 Befunde
- `npm run daumen`: 0 Befunde · `npm run wege`: 0 Sackgassen
- Durchgang vollständig, **1079 Tests grün**
- Konsole über alle 90 Bildschirme in beiden Sprachen: **0 Fehler**

---

## E-044 · 2026-09-05 · Quer gehalten war der Tisch nicht zu sehen

**Stand:** entschieden und umgesetzt.

Beim Weitersuchen gemessen, was noch keine Prüfung ansieht: die **Ausrichtung
des Geräts**. Alle Läufe messen hochkant — 390 × 844, 375 × 667, 430 × 932.
Ein Gerät, auf dem ein Pokertisch liegt, hält man aber quer.

Bei 844 × 390 war der Filz **564 Pixel hoch** in einem 390 Pixel hohen Bild:

- die fünf Gegner vollständig über dem Bildrand,
- das Board zur Hälfte abgeschnitten,
- sichtbar waren die eigenen Karten und die Entscheidungsleiste.

Man entschied also, ohne zu sehen, gegen wen und worauf. Und die Anwendung
legt die Ausrichtung nicht fest (kein `orientation` im Manifest) — das wäre
auch keine Lösung, weil iOS es ohnehin nicht beachtet.

### Quer hat man Breite und keine Höhe

Also wird aus den drei Reihen eine andere Anordnung — kein zweites Layout,
sondern dieselben benannten Felder in einer anderen Aufteilung:

```
hochkant                    quer
p2  p3  p4                  p1 p2    p3    p4    p5
p1 topf p5                  du board board board topf
board board board           du lage  lage  lage  topf
lage  lage  lage
du    du    du
```

Alle Gegner nebeneinander — quer ist Platz für fünf Namensschilder in einer
Reihe. Und **die eigene Hand steht neben dem Board, nicht darunter**: Das
ist der Schritt, der die zwei Reihen spart, die vorher gefehlt haben.

Dazu quer: schmalerer Rand, kleinere Abstände, kein Tischzeichen, kleinere
Karten — und zwar **beide** kleiner. Die eigene Hand bleibt die größte
Darstellung auf dem Tisch (Regel 10.8): 55 × 77 gegen 40 × 56 auf dem Board.
Eine Regel, die nur hochkant gilt, ist keine.

### Gemessen

| bei 844 × 390 | vorher | jetzt |
|---|---|---|
| Höhe des Filzes | 564 px | **228 px** |
| Gegner über der Leiste sichtbar | 0 von 5 | **5 von 5** |
| Board über der Leiste | nein (halb) | **ja** |
| eigene Karten über der Leiste | nein | **ja** |

Was **nicht** ganz hineinpasst, ist das eigene Namensschild — „Du · 200
Chips · CO" steht 25 Pixel hinter der Leiste. Dafür müsste die Kopfzeile der
App quer schmaler werden, und die gehört allen Bildschirmen: Ich hätte einen
geprüften Zustand gegen einen ungeprüften getauscht, um eine Zeile zu retten,
die nebenan im Klartext steht.

### Ein Fehler auf dem Weg, der hierher gehört

Die ersten drei Anläufe wirkten nicht: Der Medienblock stand **vor** den
Regeln, die er überschreiben sollte. Bei gleicher Spezifität gewinnt die
spätere Regel — `.filz-du { flex-direction: column }` stand weiter unten und
schlug den Block darüber. Sichtbar wurde es erst, als ich im Browser
`getComputedStyle` abgefragt habe statt aufs Bild zu schauen: Die Rasterfelder
waren schon die neuen, die Flussrichtung noch die alte.

**Ein Medienblock gehört hinter das, was er ändert.** Er steht jetzt am Ende
des Tischabschnitts, der für die Entscheidungsleiste hinter deren Regel.

### Der Durchgang misst jetzt auch quer

Ein neuer Schritt bei 844 × 390: alle fünf Sitze, das Board und die eigenen
Karten über der Entscheidungsleiste, kein seitlicher Überlauf, die eigene
Hand breiter als eine Boardkarte, der Filz flacher als 280 Pixel.

**Stand:** 1085 Tests grün, `pruefen` 0 Befunde, `bedienbar` 0 Befunde,
`daumen` 0 Befunde, Durchgang vollständig.

### Nachtrag: dieselbe Liste an drei Stellen — zwei davon von mir

Beim Suchen nach Exporten ohne Abnehmer fiel `LEVEL_TITLES_I18N` auf: eine
**übersetzte** Rangnamensliste in `i18n/index.tsx`, benutzt von der
Kopfzeile über `levelTitleFor`. Sie war schon da, als ich in E-043 die
englischen Rangnamen „ergänzt" habe — ich hatte sie nicht gesehen und eine
zweite englische Liste angelegt.

Die beiden wichen bereits voneinander ab: „Rookie" gegen „Newcomer",
„Climber" gegen „Riser". Der Fehler aus E-043 wäre damit zur Hälfte
zurückgekommen, sobald jemand die eine Liste pflegt und die andere nicht.

Das ist genau das Problem, vor dem die Kommentare in diesem Projekt an einem
Dutzend Stellen warnen — und es entsteht nicht durch Nachlässigkeit, sondern
dadurch, **dass man die andere Stelle nicht kennt**. Ein Kommentar hilft
dagegen nicht; er steht ja an der Stelle, die man schon gefunden hat.

Die Liste steht jetzt in `lib/rang/titel.ts`: ein Modul, das nichts weiter
tut, das beide Seiten ohne Kreis importieren können, und das den Sprachtyp
als `'de' | 'en'` selbst mitbringt, statt ihn aus `i18n` zu holen (sonst
zöge es die gesamten Lerninhalte hinter sich her). Gültig sind die Namen aus
`i18n` — sie waren zuerst da.

Ein Test hält fest, dass keine zweite Aufzählung zurückkommt: Weder
`AppState.tsx` noch `i18n/index.tsx` dürfen das Wort „Küchentisch-Spieler"
enthalten.

---

## E-045 · 2026-09-06 · Der Motor hatte keine Prüfung

**Stand:** entschieden und umgesetzt.

Weitergesucht, diesmal nicht im Bild, sondern in der Testabdeckung. Fünfzig
Testdateien, 1094 Prüfungen — und **zwei der drei wichtigsten Dateien der
App hatten keine eigene**:

- `poker/engine.ts` (517 Zeilen): teilt aus, nimmt Einsätze an, baut Side
  Pots, zahlt aus. Berührt wurde er nur nebenbei von `stats.test.ts`, das
  Spielstil-Kennzahlen prüft und dafür ein paar Hände durchspielt.
- `poker/coach.ts` (632 Zeilen): beantwortet die Frage, für die es diese App
  gibt — „was mache ich hier?" — im Live-Coach, am Übungstisch und in der
  Hand des Tages.

Das ist die gefährlichste Art von Lücke. Ein Fehler in der Maschine fällt
nicht auf, er **verschiebt Chips**: Wer verliert, hat ja auch verloren. Und
ein Coach, der auf einem seltenen Board gar nichts sagt, sieht aus wie eine
hängende App.

### Eigenschaften statt Beispiele

Ein Beispieltest prüft den Fall, an den jemand gedacht hat. Die Fehler mit
Side Pots sitzen aber genau dort, wo niemand hingedacht hat: drei Spieler
All-in mit verschiedenen Stapeln, einer davon schon vor dem Flop.

Also **4000 zufällige Hände zu sechst, 800 mit sehr ungleichen Stapeln, 800
heads-up** — und nach *jedem einzelnen Zug* nachgerechnet:

- Die Summe aus allen Stapeln und allen Einsätzen ist unverändert. Es
  entstehen keine Chips und es verschwinden keine.
- Niemand hat einen negativen Stapel, niemand Bruchteile von Chips.
- Wer All-in ist, hat nichts mehr.
- Keine Karte ist doppelt vergeben, das Board passt zur Straße.
- Wer am Zug ist, kann auch ziehen — nicht gefoldet, nicht All-in.
- Ein Call kostet nie mehr, als der Stapel hergibt; `minRaiseTo` liegt nie
  über `maxRaiseTo` und erhöht den Einsatz wirklich.
- Nach der Hand liegt alles wieder bei den Spielern, der Pot ist leer, und
  niemand, der gefoldet hat, kassiert.

Dazu drei Läufe, die die Ränder absuchen: 500 Hände gegen die **echte KI**
des Übungstischs (spielt sie je einen Zug, den die Maschine ablehnt, bleibt
der Tisch mitten in der Hand stehen — für den Spielenden sähe das aus, als
hinge die App), und ein Lauf, der **jeden als legal gemeldeten Zug** einmal
auf einer Kopie ausführt: Was der Tisch als Knopf anbietet, muss die
Maschine auch annehmen.

**Ergebnis: kein einziger Verstoß.** Der Motor ist sauber. Das ist ein
Befund, kein Nicht-Befund — vorher wusste es niemand.

### Zwei Verträge, die dabei sichtbar wurden

1. **`allIn` bleibt nach dem Handende stehen.** Beim Auszahlen werden
   `bet` und `committed` geleert und die Stapel gefüllt, die Marke aber
   nicht zurückgesetzt; das erledigt `createHand` für die nächste Hand. Die
   Zusage lautet also „wer All-in **ist**, hat nichts mehr" und nicht „wer
   die Marke trägt, hat nie wieder etwas". Kein Fehler — aber eine Falle für
   den Nächsten, deshalb steht sie jetzt im Test.

2. **Zu wenig wird abgelehnt, zu viel gedeckelt.** Eine Erhöhung unter dem
   Mindestbetrag wirft; eine über dem Stapel wird auf All-in gedeckelt. Die
   Asymmetrie ist richtig: Zu wenig stillschweigend anzuheben spielte einen
   anderen Zug als den gewollten, während „mehr als alles" nur All-in meinen
   kann. Nachgerechnet wird die Folge — nach dem Deckeln ist die Summe
   unverändert, aus einer zu großen Zahl entstehen keine Chips.

### Was der Coach zusagt — und was nicht

**Nicht** die Güte des Rats. Ob „Call" hier besser ist als „Raise", ist eine
Frage der Strategie; wer das im Test prüfen wollte, müsste die Antwort ein
zweites Mal hinschreiben, und dann prüft der Test die Abschrift.

**Sondern:** Er antwortet immer, vollständig (Handlung, Überschrift,
mindestens eine Begründung — „Fold" ohne Grund ist kein Unterricht, sondern
ein Befehl) und in der Sprache, in der gefragt wurde.

Preflop wird nicht gestichprobt, sondern durchgezählt: **16 224 Fragen** —
alle 169 Hände × 4 Positionen × 4 Tischgrößen × mit und ohne Erhöhung × drei
Limper-Zahlen × zwei Sprachen. Postflop 4000 zufällige Situationen, Hand und
Board aus einem gemischten Deck gezogen und durch dieselbe Auswertung
geschickt wie in der App.

Dazu drei Aussagen, die unabhängig von jeder Pokerschule gelten: Asse wirft
man nicht weg. 7-2 offsuit eröffnet man nicht unter der Pistole. Und mit
nichts in der Hand, ohne Draw und mit 2 % Equity setzt man nicht.

**Ergebnis: kein Verstoß.** Ein Fehler war meiner: Ich hatte verlangt, dass
sich die Überschrift zwischen den Sprachen unterscheidet — „Fold" heißt auf
Englisch aber auch „Fold". Verglichen wird jetzt der ganze Rat.

### Und ein Test, der zu langsam war, um zu prüfen

Der erste Entwurf rief `expect` für jedes Feld nach jedem Zug: über fünf
Millionen Aufrufe, jeder mit einer aus einer Vorlage gebauten
Fehlermeldung. Er lief zwei Minuten und wurde abgebrochen — und ein Test,
der nicht durchläuft, prüft nichts.

Die Prüfung gibt jetzt den ersten Verstoß als Satz zurück und sonst `null`;
`expect` wird nur gerufen, wenn wirklich etwas gefunden wurde. Aus zwei
Minuten wurden elf Sekunden.

**Stand:** 1105 Tests grün (davon 11 neue für den Coach, 6 für die
Maschine), Gesamtlauf 13 Sekunden.

## E-046 · 2026-09-06 · Die Tür, durch die fremde Daten hereinkommen

**Stand:** entschieden und umgesetzt.

Weitergesucht — und nach dem Motor (E-045) blieb die Frage: **Welcher Code
bekommt Eingaben, die nicht aus der App selbst stammen?** Es gibt genau eine
solche Stelle, `sanitizeAppData` in `state/AppState.tsx`, und sie hat drei
Schlüssel:

1. **Die Sicherungsdatei.** „Fortschritt exportieren" schreibt eine JSON-Datei,
   „importieren" liest sie wieder ein. Was dazwischen mit ihr passiert, weiß
   niemand: Sie liegt auf einer Festplatte, geht durch einen Messenger, wird
   von Hand editiert.
2. **Der Gerätespeicher.** Ein abgebrochener Schreibvorgang, ein zweiter Tab,
   ein Browser-Update — halb geschriebene Daten sind kein theoretischer Fall.
3. **Die Cloud.** Was von dort zurückkommt, nimmt dieselbe Tür.

Geprüft wurde diese Funktion bisher nur *nebenbei*: `badges.test.ts` benutzt
sie, um sich eine gültige Grundlage zu bauen, `trainerkennungen.test.ts`
schickt Trainer-Kennungen hindurch. **Kaputte Eingaben hat ihr niemand
gegeben** — also genau das, wofür es sie gibt.

### Die Messlatte

Nicht „sie wirft keinen Fehler". Sondern: **Was herauskommt, muss die App
anzeigen können, ohne dass Unsinn dasteht.** Ein Zustand mit
`handsPlayed: 9007199254740991` stürzt nirgends ab; er zeigt nur
„9007199254740991 Hände gespielt", und das ist auf seine Art schlimmer, weil
es aussieht wie ein Fehler der App.

`src/lib/__tests__/eingang.test.ts` schreibt diese Messlatte als Funktion
`unbrauchbar(d)` auf: Zähler sind ganz, nicht negativ und anzeigbar groß,
Datumsfelder sind Daten, Karten sind Plätze im Blatt, und die Ordnung der
Zähler stimmt. Dreizehn Prüfungen, die diese eine Funktion beschießen.

### Was dabei kaputt war

**Zähler waren keine ganzen Zahlen.** `num()` prüfte auf `typeof number` und
`isFinite` — mehr nicht. `xp: 12.7` überlebte, `handsPlayed: 3.5` auch. Ein
halb gespieltes Blatt gibt es nicht; solche Werte entstehen, wenn jemand eine
Sicherung von Hand bearbeitet oder irgendwo eine Division stehen bleibt.

**Zähler hatten keine Obergrenze.** Nur `xp` war bei zehn Millionen gedeckelt,
alle anderen nicht. Jetzt gilt dieselbe Grenze überall, und wo ein Feld eine
natürliche Schranke hat, gilt die: eine Tagesserie zählt höchstens 36 500 Tage
(hundert Jahre), ein Tagesquiz höchstens 100 Fragen.

**Die Ordnung der Zähler galt nicht.** `{attempts: 3, correct: 22}` kam
unverändert durch und stünde als „22 richtig von 3 Versuchen" auf der Seite.
`recordTrainer` zählt aber immer zuerst den Versuch — die Tür hält jetzt
dieselbe Ordnung ein wie die Buchführung: Versuche ≥ richtig ≥ Serie, beste
Serie ≥ laufende, gewonnene Hände ≤ gespielte, Quizpunkte ≤ Quizfragen.

**Ein Kartenindex durfte gebrochen sein.** `c >= 0 && c <= 51` ließ 12,5
durch. `RANKS[12.5 % 13]` ist `undefined` — eine leere Karte auf dem Tisch.

**Datumsfelder waren freie Zeichenketten.** `str(s.date).slice(0, 10)` nahm
„gestern", „2026-13-45" und „=1+1" an. So etwas wird angezeigt, sortiert und
exportiert. Jetzt muss ein Datum eines sein, sonst ist es leer — „noch nie"
ist ein gültiger Zustand, „gestern" ist keiner.

**In der Statistik fehlte dieselbe Grenze.** `sanitizeHandFacts` schnitt
Nachkommastellen bereits ab (die Bibliothek war mit dieser Sorgfalt
geschrieben), deckelte aber die Größe nicht: ein Blatt mit 1e308 Chips hätte
jeden Durchschnitt ins Sinnlose verschoben.

**Nicht** kaputt war der Prototyp-Angriff: `__proto__` aus `JSON.parse`
scheitert bereits an den Schlüsselfiltern (`/^m\d+-l\d+$/`, `/^[a-z]+$/`,
`/^[a-z-]{1,40}$/`). Die Gegenprobe steht trotzdem im Test — sie hält den
Schutz fest, den es schon gibt.

### Gegenprobe

Zwei Wächter versuchsweise entfernt (`tag()` auf `slice(0,10)` zurückgedreht,
`zaehler()` auf `Math.max(0, num(v))`): drei Prüfungen fallen. Und die
Gegenrichtung, ohne die eine Tür, die alles abweist, auch keine wäre: echte
Daten gehen unverändert hindurch, und zweimal hindurchgereicht ändert nichts —
sonst driftete ein Gerätestand bei jedem Cloud-Abgleich weiter.

---

## E-047 · 2026-09-06 · Der Export war für Excel unlesbar

**Stand:** entschieden und umgesetzt.

Dieselbe Frage einen Schritt weitergedacht: Wenn Daten *hereinkommen*, gehen
auch welche *hinaus*. Der Bankroll-Tracker schreibt eine CSV-Datei, und die
landet in einer fremden Anwendung — meistens Excel.

Die Datei ist bewusst deutsch: deutsche Kopfzeile, Semikolon als Trennzeichen,
BOM voran (so steht es seit jeher in `i18n/pages/bankroll.ts`). Dann muss aber
auch der Rest deutsch sein — **war er nicht**:

```
2026-09-01;live;"1/2 NLH";100;180.5;80.50;240;"gut gelaufen"
```

Im deutschen Gebietsschema liest Excel `180.5` nicht als Betrag, sondern als
**18. Mai**. Der Buy-in wurde zum Datum, die Summenzeile darunter blieb leer.
Das ist kein Randfall, sondern der Normalfall: Wer die Datei exportiert, will
rechnen.

Zwei weitere Löcher in derselben Zeile:

- **`s.date` und `s.type` gingen ungeschützt hinein.** Der Schutz vor
  Formel-Injection (`'` vor `=`, `+`, `-`, `@`) lag in `csvCell`, und durch
  `csvCell` liefen nur `game` und `notes`. Ein Datum aus einer importierten
  Sicherung konnte `=cmd|'/c calc'!A1` heißen (E-046 schließt das jetzt auch
  von der anderen Seite).
- **Ein Semikolon oder Zeilenumbruch im Datum** hätte alle folgenden Spalten
  verschoben.

`src/lib/export/csv.ts` macht daraus eine Bibliothek mit drei Regeln: Text
kommt in Anführungszeichen, Text mit Formelanfang bekommt ein Hochkomma,
Zahlen bekommen ein Komma als Dezimaltrennzeichen und keinen Tausenderpunkt.
Zeilen enden nach RFC 4180 mit CRLF, damit ein Umbruch *innerhalb* einer Notiz
eindeutig bleibt.

Geprüft wird das nicht am Format, sondern am Ergebnis: `csv.test.ts` enthält
einen kleinen CSV-**Leser** und liest die geschriebene Datei zurück. Eine
Notiz „Tilt; früh weg\nnächstes Mal Pause" muss als *eine* Zelle
zurückkommen — acht Prüfungen, die alle die Frage stellen, was auf der
anderen Seite ankommt.

## E-048 · 2026-09-06 · „1.250" war einskommazweifünf

**Stand:** entschieden und umgesetzt.

Der Export (E-047) führte zur Gegenfrage: Wenn die App Zahlen *hinausschreibt*
— wie liest sie welche *herein*? Vier Stellen taten das, alle mit derselben
Zeile:

```ts
parseFloat(text.replace(',', '.'))
```

Sie ist auf zwei Arten falsch. Gemessen, nicht vermutet:

| Eingabe     | was herauskam | was gemeint war |
|-------------|---------------|-----------------|
| `1.250`     | 1,25          | 1250            |
| `1.234,56`  | 1,234         | 1234,56         |
| `1 250`     | 1             | 1250            |
| `1.000.000` | 1             | 1000000         |
| `12abc`     | 12            | (keine Zahl)    |

**Sie versteht die deutsche Schreibweise nicht.** „1.250" ist auf Deutsch
Tausendzweihundertfünfzig. Der Punkt wurde als Dezimalpunkt gelesen — eine
Verwechslung um den Faktor 1000.

**Und sie nimmt an, was keine Zahl ist.** `parseFloat` liest, so weit es
kommt, und gibt zurück, was es hat.

Das Entscheidende an beidem: Jeder dieser Werte kam an der Prüfung
`isFinite(n) && n > 0` vorbei. Es gab **keine Fehlermeldung** — nur einen
falschen Betrag. Wer 1250 € Cash-out eintrug, sah 1,25 € in seiner Bilanz und
konnte nur rätseln, warum.

### Wo das stand

- **Bankroll-Tracker** — Buy-in und Cash-out. Eine falsche Bilanz.
- **Live-Coach** — Pot und Einsatz für die Pot-Odds. Ein falscher Rat, und
  das ist die eine Sache, für die es diese App gibt.
- **Pokerabend einrichten** — Euro je Spieler.
- **Upgrade-Seite** — der Jahrespreis aus der Konfiguration.

### Die Lösung

`src/lib/eingabe/zahl.ts` liefert entweder eine Zahl oder `null` — und nichts
dazwischen. Stehen beide Trennzeichen da, entscheidet die Reihenfolge und
nicht die Sprache: das rechte ist das Dezimaltrennzeichen („1.234,56" wie
„1,234.56"). Steht nur eines da, entscheidet die Sprache — außer die Zahl
sieht eindeutig gruppiert aus (`1.250` ja, `0.125` nein, `12.50` nein: zwei
Stellen sind keine Tausendergruppe). Währungszeichen dürfen am Rand stehen,
nicht in der Mitte: „1 250 €" ist eine Zahl, „12€34" ist keine.

Milde ist dabei Absicht: Wer in der englischen Oberfläche „12,50" tippt, meint
zwölf fünfzig und keinen Fehler.

### Gegenprobe im Browser

Nicht nur im Test, sondern in der gebauten App, 390 × 844, deutsche Sprache:
Buy-in „1.250", Cash-out „2.500", 240 Minuten. Ergebnis auf dem Bildschirm:

```
+1.250,00 €      312,50 €/h
```

Vorher wären das 1,25 € gewesen. Und „abc" als Buy-in bringt jetzt
„Buy-in: bitte eine Zahl ≥ 0 angeben." statt einer stillen Null.

Dieselbe Sitzung exportiert (E-047):

```
"Datum";"Art";"Spiel";"Buy-in";"Cash-out";"Gewinn";"Minuten";"Notizen"
"2026-09-06";"online";"NL2 Cash";1250;2500;1250;240;"Test; mit Semikolon"
```

Das Semikolon in der Notiz bleibt in seiner Zelle.

## E-049 · 2026-09-06 · Das Auffangnetz hing zu tief

**Stand:** entschieden und umgesetzt.

Nach der Eingangstür (E-046) die Anschlussfrage: **Was passiert, wenn hinter
der Tür trotzdem etwas bricht?** Dafür gibt es den `ErrorBoundary` — den
einen Bildschirm, den niemand sehen soll und den deshalb auch nie jemand
angesehen hat. Er steht in keiner der 91 gemessenen Ansichten, weil man ihn
nur durch einen Absturz erreicht.

Also einmal hingesehen: einen Absturz erzwungen (vorübergehend eine
werfende Komponente, danach wieder entfernt) und im gebauten Bundle
gemessen, 390 × 844, hell und dunkel.

### Was gut war

Der Bildschirm ist gestaltet wie die App — Manrope, Goldknopf, 142 × 44
Pixel, Kontrast 14,6:1 auf der Überschrift und 7,3:1 im Fließtext, in beiden
Farbmodi. Der Knopf führt zurück auf die Startseite, und die App läuft
danach.

(Eine erste Messung meldete „Knopfbeschriftung 1,28:1". Das war die
Messung, nicht der Knopf: `.btn.primary` malt mit einem Verlauf, also ist
`backgroundColor` durchsichtig. Der Bildschirmabzug zeigte einen goldenen
Knopf. Wieder ein Fall für die alte Regel — die Zahl ansehen *und* das Bild.)

### Was nicht gut war

**Das Netz hing unter allen sechs Providern.** `<ErrorBoundary>` stand *in*
`App`, und `App` steht in `main.tsx` unter `FarbmodusProvider`,
`LanguageProvider`, `AppStateProvider`, `CloudProvider`, `ProProvider` und
`SocialProvider`. Ausgerechnet `AppStateProvider` ist der Provider, der
`localStorage` liest, JSON auspackt und `sanitizeAppData` aufruft — der
einzige, der überhaupt mit fremden Daten zu tun hat. Ein Fehler dort kam beim
Netz nie an.

Gemessen mit einem Absturz im Provider, zwei gebaute Fassungen, gleicher
Fehler:

| | `#root` | Text | Knöpfe |
|---|---|---|---|
| Netz in `App` (vorher) | **leer** | – | – |
| Netz in `main.tsx` (nachher) | gefüllt | „Da ist etwas schiefgelaufen" | „App neu laden" |

Das war die weiße Seite, gegen die es diesen Bildschirm gibt. Für eine App,
deren Daten auf dem Gerät liegen, ist das die schlimmste Fehlerform: kein Weg
zurück, und der Fortschritt liegt hinter genau der Anwendung, die nicht mehr
startet.

**Und „neu laden" half nicht immer.** Liegt der Fehler an gespeicherten
Daten, führt jeder Neustart in denselben Absturz — eine Schleife ohne
Ausgang. Der Bildschirm zählt jetzt mit: Beim **zweiten** Mal in derselben
Sitzung heißt er „Das Neuladen hat nicht geholfen" und bietet zwei weitere
Wege an, in dieser Reihenfolge:

1. **Daten als Datei sichern** — liest den Gerätespeicher direkt aus, nicht
   über `exportJson()`: Wenn die App abgestürzt ist, ist ihr Zustand
   womöglich genau das Problem.
2. **Daten zurücksetzen** — fragt erst nach („Wirklich alles löschen?",
   daneben „Doch nicht") und löscht dann auch den IndexedDB-Spiegel, der
   sonst beim nächsten Start genau die Daten zurückholte, die den Absturz
   ausgelöst haben.

Beim zweiten Punkt steckt die Tücke im Warten. `deleteDatabase` wird
*blockiert*, solange noch eine Verbindung offen ist — und die App hält eine.
Wer danach sofort neu lädt, startet ein Wettrennen zwischen dem ausstehenden
Löschen und `restoreFromMirrorIfNeeded()`, das beim nächsten Start genau die
Daten zurückholt, die man gerade loswerden wollte. `loescheAllesVonUns()`
schließt deshalb erst die eigene Verbindung, wartet dann auf das Löschen und
lädt erst danach neu — mit einer Notbremse nach 1,5 Sekunden, falls ein
zweiter Tab den Spiegel festhält.

Die erste Gegenprobe hätte das nicht gefunden: Sie stürzte im Provider ab, da
war noch gar keine Verbindung offen. Also eine zweite, mit einem Absturz an
einer *Route* — die App läuft dann, der Spiegel ist angelegt und offen.
Danach trug der Gerätespeicher `pokermentor-data-pmtpyxemg17g` statt
`pokermentor-data-pmtpyx7ushn98`: ein frisches Profil, die alten Daten weg,
vom Spiegel nichts zurückgeholt.

Nach einem gelungenen Start wird der Zähler gelöscht — ein Absturz von
vorgestern ist kein Muster.

**Zwei kleinere Sachen** fielen beim Hinsehen noch auf: Der Bildschirm hatte
kein `<main>` (die Regel, die für die anderen 90 gilt) und meldete sich
Bildschirmlesern nicht. Beides steht jetzt da: `<main role="alert">`.

### Gegenprobe

Der ganze Weg im gebauten Bundle durchgespielt: erster Absturz → ein Knopf.
Neu laden → derselbe Absturz → drei Knöpfe und die andere Überschrift. Die
Notsicherung enthält `pokermentor-data-p1`. Zurücksetzen fragt nach, „Doch
nicht" bricht ab, und nach dem Bestätigen ist der alte Schlüssel weg und die
Startseite da.

Zwischendurch meldete die Probe zwei Befunde, die keine waren: Das
Playwright-`addInitScript` legt bei *jedem* Laden dieselben Schlüssel wieder
an — gemessen wurde also das eigene Messskript, das die gerade gelöschten
Daten sofort neu säte.

## E-050 · 2026-09-06 · Die Oberfläche war typografisch sauber, die Inhalte nicht

**Stand:** entschieden und umgesetzt.

Weitergesucht, diesmal im Text selbst. Alle 10 625 Zeichenketten der App
ausgelesen — nicht aus dem Quelltext, sondern aus den geladenen Bündeln, also
genau das, was auf dem Bildschirm steht — und die Anführungszeichen gezählt:

| | Oberfläche | Lerninhalte |
|---|---|---|
| „ und " (typografisch) | 16 / 16 | 45 |
| " (gerade) | **0** | **883** |
| ’ (Apostroph) | 25 | 249 |
| ' (gerader Apostroph) | 4 | 553 |

Die Oberfläche war von Anfang an richtig gesetzt. Die **Inhalte** — also das,
was man minutenlang liest — waren es nicht, und zwar uneinheitlich: In
derselben Lektion steht einmal „ich habe doch Odds" und ein paar Absätze
weiter "zur besten Hand". Das ist keine Geschmacksfrage, sondern ein Bruch
mit dem, was die App sonst überall tut.

### Wie umgestellt wurde

Nicht mit einem Regex über den Quelltext. Ein Anführungszeichen als
Begrenzer und eines als Inhalt sehen gleich aus, und nur der Parser weiß,
welches was ist — also lieferte der TypeScript-Parser die Spannen, und
ersetzt wurde ausschließlich *innerhalb* von Zeichenketten-Literalen. Ob ein
gerades Anführungszeichen öffnet oder schließt, entscheidet der Zustand
davor; ein Apostroph ist ein gerades Zeichen nach einem Buchstaben, im Wort
(„isn't") wie am Wortende („players'", der englische Plural-Genitiv).

### Die Gegenprobe, auf die es ankam

Vor und nach der Umstellung alle 10 625 Zeichenketten ausgelesen und **alle
Anführungs- und Apostrophformen auf eine reduziert**. Die beiden Abzüge sind
Zeichen für Zeichen identisch — die Umstellung hat also nichts am Text
geändert, nur an der Form der Zeichen. Danach: 0 gerade Anführungszeichen,
0 gerade Apostrophe.

### Was dabei kaputtging

Ein Literal mit Einsetzungen besteht aus mehreren Stücken, und das Zitat lief
quer darüber:

```
`Nichts zu „${begriff}" gefunden.`
```

Kopf und Schwanz sind getrennte Spannen. Im Schwanz stand das schließende
Zeichen ohne den Zustand „hier ist etwas offen" — und wurde zu einem zweiten
**öffnenden**: „Nichts zu „Flop„ gefunden."

Gefunden nicht durch den Test, sondern beim Lesen des eigenen Diffs. Die
bleibende Prüfung (`typografie.test.ts`) betrachtet ein solches Literal
deshalb als **ein** Stück und prüft, ob jedes Zitat aufgeht: öffnet, schließt,
und zwar mit dem passenden Gegenstück. Sie prüft sich selbst gegen sieben
Beispiele, von denen fünf durchfallen müssen.

## E-051 · 2026-09-06 · Die Suche fand „Hold'em" nicht mehr

**Stand:** entschieden und umgesetzt.

Eine Änderung zieht die nächste nach sich: Seit E-050 steht in den Texten
„Hold’em" mit typografischem Apostroph. Drei Stellen der App suchen in diesen
Texten — Lernen, Glossar, Nachschlagen — und alle drei taten es so:

```ts
e.term.toLowerCase().includes(query.trim().toLowerCase())
```

Wer „Hold'em" mit gerader Taste eintippt, hätte danach **nichts** gefunden,
obwohl das Wort auf jeder zweiten Seite steht. Und das ist kein Randfall: iOS
setzt beim Tippen automatisch das typografische Zeichen, ein angestecktes
Keyboard und die meisten Android-Tastaturen das gerade. Dasselbe Wort, zwei
Zeichen, je nach Gerät.

`lib/eingabe/suche.ts` bringt beide Formen auf eine. Entscheidend dabei:
Die Umformung bleibt **zeichenweise** — jedes ersetzte Zeichen wird durch
genau eines ersetzt. Nur so stimmt die Fundstelle noch mit dem Originaltext
überein, denn die Lernsuche sucht im aufbereiteten Text und schneidet den
Auszug aus dem *ursprünglichen* heraus. Ein Test hält diese Länge fest.

Im Browser gegengeprüft, 390 × 844, beide Schreibweisen nacheinander in
dasselbe Feld getippt:

| | „Hold'em" | „Hold’em" |
|---|---|---|
| Lernen | 15 Nennungen | 15 |
| Glossar | 5 | 5 |
| Nachschlagen | 1 | 1 |

## E-052 · 2026-09-06 · Der Offline-Betrieb war ein ungeprüftes Versprechen

**Stand:** entschieden und umgesetzt.

PokerMentor verspricht Offline-Betrieb an drei Stellen: Sie lässt sich
installieren, die Daten liegen auf dem Gerät, und der Drill soll im Zug
funktionieren. Geprüft hat das **nichts**. Der Durchgang misst, wie schnell
die *Startseite* ohne Netz kommt (445 ms, E-039) — ob die anderen 89
Bildschirme dann noch etwas zeigen, stand nirgends.

Also gemessen: jeden der 90 Bildschirme bei abgeschaltetem Netz öffnen und
nachsehen, ob etwas dasteht, ob ein Ladepunkt hängen bleibt und ob die Seite
einen Fehler wirft. Ergebnis: **90 von 90 geladen, 0 Befunde.**

### Zwei Fallen, die ein grünes Ergebnis ohne Bedeutung ergeben

Der erste Lauf meldete ebenfalls „90 von 90, keine Befunde" — und war
wertlos. Zwei Gründe, beide erst beim Nachsehen aufgefallen:

1. **Auf `localhost` meldet sich der Service Worker gar nicht an.**
   `main.tsx` schließt das ausdrücklich aus, damit die Entwicklung nicht auf
   einem alten Stand hängen bleibt. Die Probe lief also ganz ohne Worker —
   sie hätte nur gemessen, dass die Seite noch im Speicher liegt. Der Lauf
   geht deshalb über `127.0.0.1` und **bricht ab**, wenn kein Worker aktiv
   ist. Ein Lauf, der ohne seine Voraussetzung grün wird, ist schlimmer als
   keiner.
2. **Ein Hash-Wechsel lädt das Dokument nicht neu.** Die App benutzt
   `HashRouter`; `#/glossar` anzusteuern rührt das Netz nicht an. Gemessen
   wurde also 89-mal dieselbe längst geladene Seite. Jeder Bildschirm wird
   jetzt wirklich neu geladen — so, wie jemand die installierte App öffnet.

### Gegenprobe

Derselbe Lauf mit vorher abgemeldetem Service Worker: **0 von 90**
Bildschirmen laden, 90 Befunde („net::ERR_INTERNET_DISCONNECTED"). Der
Unterschied zwischen 90/90 und 0/90 ist der Beweis, dass diese Prüfung
wirklich den Offline-Fall ansieht.

`npm run ohnenetz` schreibt nach `docs/ohnenetz.json`, `ohnenetz.test.ts`
hält das Ergebnis fest — und prüft zuerst, dass die Messung echt war:
Service Worker aktiv, nicht über `localhost`, alle 90 Bildschirme dabei.

## E-053 · 2026-09-06 · Dieselbe Rechenzeile stand zweimal da

**Stand:** entschieden und umgesetzt.

Die Equity wird auf zwei Wegen gerechnet: normalerweise in einem Web Worker,
und wenn der ausfällt — Einzeldatei-Build, alte WebView, CSP, Zeitüberschreitung
— synchron im Hauptthread. Beide Wege sind gut gebaut: Der Rückfall greift
still, offene Anfragen werden nachgerechnet, der Hauptthread blockiert nie.

Nur stand die eigentliche Rechnung **zweimal** da, wörtlich derselbe Ausdruck
in zwei Dateien:

```ts
jobs.map((j) => equityVsRandomHands(j.hero, j.board, Math.max(1, j.opponents), j.iterations))
```

Solange beide gleich blieben, fiel das nicht auf. Wer eine davon geändert
hätte — andere Iterationszahl, andere Behandlung von null Gegnern —, hätte
**je nach Browser verschiedene Zahlen** bekommen. Und die Zahl ist hier nicht
Deko: „Call" oder „Fold" hängt daran. Der Fehler wäre auch schwer zu finden
gewesen, weil der Rückfallweg genau dort greift, wo niemand entwickelt.

Also dieselbe Antwort wie bei den Rangnamen (E-045): eine Stelle,
`rechneAuftraege` in `equityProtocol.ts` — der Datei, die ohnehin den Vertrag
zwischen beiden Seiten hält. `equityweg.test.ts` hält fest, dass weder der
Worker noch der Rückfallweg den Rechenkern noch selbst aufruft.

Im Browser gegengeprüft, weil ein Refactor an einer Worker-Datei genau die
Sorte Änderung ist, die im Test grün und im Bundle kaputt ist: Live-Coach
geöffnet, A♠K♥ eingegeben. Die Worker-Datei erscheint in den geladenen
Ressourcen, es kommt „Empfehlung: Raise", und die Konsole bleibt still.

## E-054 · 2026-09-06 · Die Prüfläufe liefen nur auf einer Maschine

**Stand:** entschieden und umgesetzt.

Beim Eintragen der Messläufe ins README fiel auf, dass die Anleitung, die ich
gerade schrieb, für niemanden funktioniert hätte. In allen acht
Browser-Skripten stand:

```js
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
```

Ein absoluter Pfad auf eine globale Installation. Playwright steht in keiner
Abhängigkeitsliste des Projekts. Das heißt: Auf jedem anderen Rechner — dem
des Entwicklers, dem GitHub-Runner — bricht `npm run pruefen` sofort mit
`ERR_MODULE_NOT_FOUND` ab.

Damit war die **ganze Prüfapparatur**, auf der die Qualität dieses Projekts
ruht, in genau einer Umgebung benutzbar. Neun Läufe, 182 Messungen,
446 geprüfte Fokusziele — und niemand außerhalb dieses Containers hätte je
einen davon starten können.

`scripts/browser.mjs` sucht Playwright jetzt dort, wo es liegen kann (im
Projekt, als `playwright-core`, global), und sagt sonst, was zu tun ist:

```
Playwright nicht gefunden. Die Messläufe brauchen einen echten Browser:
  npm i -D playwright && npx playwright install chromium
```

Eine Fehlermeldung, die nur `ERR_MODULE_NOT_FOUND` sagt, hilft niemandem.

**Warum Playwright nicht in die `devDependencies` kommt:** Es zieht einen
Browser nach sich und würde jedes `npm ci` verlangsamen — auch das im
Deploy-Job, der es nie braucht. Es ist Werkzeug für gelegentliche Messungen,
keine Abhängigkeit der App.

### Und weil sie jetzt überall laufen, laufen sie auch in der Action

Bis hierher liefen die Läufe nur, wenn jemand daran dachte. Die
Lock-Tests in `vitest` fangen zwar strukturelle Abweichungen (eine neue
Adresse ohne Wegelauf), aber **keine** Stiländerung, die den Kontrast auf
einem bestehenden Bildschirm kippt — dafür muss der Browser laufen.

Der neue Job `messungen` in `deploy.yml` holt sich den Browser, baut, startet
die Vorschau und fährt fünf Läufe: Design, Bedienbarkeit, Daumen, Wege, ohne
Netz. `durchgang` bleibt draußen, weil er auch Zeiten misst — auf einem
geteilten Runner wäre er die Sorte Prüfung, die man nach dem dritten
Fehlalarm ignoriert.

**Der Deploy hängt bewusst nicht daran.** Ein Browserlauf kann aus Gründen
scheitern, die mit der App nichts zu tun haben; dann soll trotzdem
veröffentlicht werden. Ein rotes Kreuz an diesem Job ist der Hinweis zum
Nachsehen, nicht der Schalter, der alles anhält.

**Was hier ehrlich gesagt gehört:** Dieser Job ist der einzige Teil dieser
Sitzung, den ich nicht selbst laufen lassen konnte — eine GitHub-Action
lässt sich hier nicht ausführen. Geprüft ist, dass die YAML-Datei gültig ist,
dass der Deploy weiterhin nur an `build` hängt und dass die Schrittfolge
(bauen, Vorschau mit Warteschleife, fünf Läufe) lokal genau so funktioniert.
Ungeprüft sind die beiden Zeilen, die den Browser holen. Deshalb hängt nichts
daran.

## E-055 · 2026-09-06 · Die Einzeldatei gab einen Rat, der nicht half

**Stand:** entschieden und umgesetzt.

`npm run build:single` erzeugt eine HTML-Datei, die man weitergeben kann.
Geprüft hat sie nie jemand — sie steht im README, aber in keinem Lauf und in
keinem Test. Also einmal gebaut, über `file://` geöffnet und durchgeklickt.

**Das meiste funktioniert.** Startseite, Lernpfad, Nachschlagen, Übungstisch,
Pokerabend, sogar der Pot-Odds-Trainer (der rechnet aus der Formel). Die
Navigation läuft ohne Server, der Verzicht auf den Web Worker greift wie
vorgesehen (`workerUnavailable = __SINGLE__`).

**Eine Stelle nicht:** Der Drill braucht die gerechneten Daten
(`pokermath/*.json` und `.bin`, zusammen 246 KB), und `file://` verbietet
`fetch`. Der Bildschirm sagt das auch sauber — nur der Rat darunter lautete:

> Im Projekt neu erzeugen: `npm run daten`

Für den, der diese eine Datei bekommen hat, ist das kein Rat, sondern eine
Zumutung. Er hat kein Projekt. Im Einzeldatei-Build steht dort jetzt:

> Diese Einzeldatei braucht den Ordner „pokermath" neben sich.

### Was ich bewusst *nicht* getan habe

Die Daten in die Datei einzubetten, wäre die andere Antwort — dann hielte der
Name „Alles-in-einer-HTML-Datei" auch für den Drill. Gerechnet: 246 KB Daten,
davon 204 KB die Binärmatrix; als Base64 rund 330 KB auf eine 2,08-MB-Datei,
also ein Sechstel mehr.

Dagegen spricht nicht die Größe, sondern der Ort des Eingriffs: Der Ladeweg
für diese Daten ist der schnellste Teil der App (6,9 ms statt 237 ms, seit die
Matrix binär ist). Ihn für ein Nebenerzeugnis umzubauen, wäre ein Risiko am
Hauptweg für einen Gewinn am Rand. Die Zahlen stehen hier, damit die
Entscheidung später ohne neue Messung revidierbar ist.

## E-056 · 2026-09-06 · „5,9 % (1 zu 16)" — die App widersprach sich selbst

**Stand:** entschieden und umgesetzt.

Weitergesucht in dem, was diese App eigentlich tut: Sie **unterrichtet
Zahlen.** Der schlimmste Fehler wäre nicht ein verrutschter Knopf, sondern
eine falsch gelehrte Zahl, die jemand sich merkt.

Zuerst die Breite gemessen: 518 Prozentangaben im deutschen Lehrtext,
496 Quizfragen in zwei Sprachen. Geprüft war davon eine Handvoll — die
Outs-Behauptungen der Form „9 × 4 = 36 %, exakt 35,0 %".

Nachgerechnet wurden dann die Klassen, die sich nachrechnen lassen:
Verhältnis → nötige Equity, Bet-Größe → nötige Equity, Kombinationen aus
1326, Bluff-Break-even, Ergänzung auf 100 %. **Alle richtig.** Die
Pot-Odds-Tabelle stimmt Zeile für Zeile, die Quizfragen sind strukturell in
Ordnung, die Zahlen auf dem gerenderten Bildschirm decken sich mit den
gerechneten Daten.

### Bis auf eine Tabelle

Der Odds-Spickzettel schreibt hinter manche Prozentzahl eine Häufigkeit.
Dafür gibt es zwei Schreibweisen, die sich um genau eins unterscheiden:

- **Kehrwert** („1 von N", englisch „1 in N"): N = 1/p.
- **Gegenquote** („N : 1"): N = (1−p)/p.

In dieser Tabelle stand beides durcheinander, unter derselben Beschriftung:

| Zeile | Prozent | 1/p | Gegenquote | stand da |
|---|---|---|---|---|
| Ein bestimmtes Paar | 0,45 % | **221** | 220 | 221 ✓ |
| Irgendein Pocket Pair | 5,9 % | **17** | 16 | 16 ✗ |
| AK | 1,2 % | **83** | 81,9 | 82 ✗ |
| Set am Flop | 11,8 % | **8,5** | 7,5 | 7,5 ✗ |

Im Deutschen ließ sich „1 zu 16" noch als Gegenquote lesen. Die englische
Fassung schrieb „1 in 16" — das heißt eindeutig Kehrwert, und dort waren drei
von vier Zeilen schlicht falsch.

### Das Schlimmere daran

Der **Lehrtext hatte recht**. In Modul 2 steht wörtlich:

> „Die Wahrscheinlichkeit für irgendein Paar liegt bei knapp 6 %, also etwa
> 1 zu 17. 1 zu 221 gilt für ein bestimmtes Paar wie AA."

Und die Quizfragen in Modul 3 nennen durchgehend Kehrwerte (1 zu 83, 1 zu
221, 1 zu 17, 1 zu 110). Zwei Tipps von dieser Lektion entfernt zeigte die
Nachschlagetabelle 1 zu 16. Die App hat sich also **selbst widersprochen** —
genau der Fehler, gegen den dieses ganze Projekt gebaut ist: Tabellen, die
einander widersprechen, weil irgendwann jemand eine Zahl abgeschrieben und
die Annahme weggelassen hat.

Die Tabelle folgt jetzt dem Lehrtext: Kehrwert überall, und im Deutschen
„1 **von** N" statt „1 zu N", weil „zu" beides heißen kann.

### Die Prüfung, die das festhält

`kehrwert.test.ts` braucht kein Poker-Wissen. Er nimmt die Prozentzahl aus
derselben Zelle und prüft, ob die Zahl daneben ihr Kehrwert ist — über die
Tabelle **und** über den gesamten Lehrtext beider Sprachen, 18 Behauptungen.
Die Toleranz trägt die Rundung der Prozentzahl, aber nicht den Unterschied
von eins zwischen den beiden Schreibweisen; die Gegenprobe mit dem alten Wert
16 fällt durch.

### Was dabei sonst geprüft und in Ordnung war

- **496 Quizfragen**: `correctIndex` immer im gültigen Bereich, mindestens
  zwei Antworten, keine doppelte Option, überall eine Erklärung.
  `quiz.test.ts` hält das fest — bisher ungeprüft war, ob der Index
  überhaupt auf eine Option zeigt. Eine Frage mit `correctIndex: 4` bei vier
  Optionen kann niemand richtig beantworten.
- **Eine Heuristik habe ich verworfen**: „Steht die Zahl der richtigen
  Antwort in der Erklärung?" ergab 52 Treffer und **alle 52 waren
  Fehlalarme** — gute Erklärungen umschreiben („Rund ein Fünftel bis ein
  Drittel" für „20–30 %") oder nennen die falsche Antwort, um sie zu
  widerlegen. Eine Prüfung mit 52 Fehlalarmen wird nach dem dritten
  ignoriert; sie steht deshalb nicht im Testbestand.
- **Die Annahme hinter „Nächste Karte"** stand ungenau im Quelltext:
  `chanceEineKarte` rechnet mit 46 unbekannten Karten (der River steht aus),
  der Kommentar sagte aber „Turn ODER River". Bei 9 Outs sind das 19,6 statt
  19,1 % — ein Unterschied, der nicht auffällt und genau deshalb gefährlich
  ist. Kommentar und Fußnote nennen die Annahme jetzt beide präzise.

## E-057 · 2026-09-06 · Die Schriftgröße des Browsers bewirkte nichts

**Stand:** entschieden und umgesetzt.

Jeder Browser hat sie, und Menschen mit nachlassenden Augen benutzen sie:
Einstellungen → Darstellung → Schriftgröße. Sie wirkt, indem der Browser die
**Wurzel-Schriftgröße** ändert — und erreicht damit nur, was in `rem` oder
`em` bemessen ist.

Diese App hatte **114 Schriftgrößen, alle in Pixeln**: 67 im Stylesheet, 47
direkt in Komponenten, kein einziges `rem`. Gemessen mit
`Page.setFontSizes` auf 24 px Standardschrift, Lektion „Outs zählen":

| | vorher | nachher |
|---|---|---|
| Wurzel-Schriftgröße | 24 | 24 |
| Fließtext | **15,5** | 23,3 |
| Seitenüberschrift | **27** | 40,5 |
| Kleingedrucktes | **13,5** | 20,3 |
| Höhe der Lektion | **5507 px** | 10 371 px |

Vorher änderte sich außer der Wurzel **nichts**. Die Einstellung wurde still
ignoriert — für eine App, in der man minutenlange Lesestrecken vor sich hat,
kein Randfall. (Der Zoom des Browsers half; er vergrößert aber alles, auch
das Layout, und ist etwas anderes als „ich lese den Text schlecht".)

### Umgestellt, und der Beweis dafür

114 Angaben mechanisch durch 16 geteilt. Bei der Standard-Wurzelgröße von
16 px ergibt das exakt dieselben Pixel — und genau das wurde nachgewiesen,
nicht behauptet: Von jedem der 90 Bildschirme ein Abzug **aller vorkommenden
Schriftgrößen**, einmal vorher, einmal nachher. Ergebnis: 89 von 90
Bildschirmen zeichnen dieselben Größen.

Der eine Ausreißer war der Equity-Trainer — dort fehlten zwei Größen. Die
Erklärung stand nicht im Diff, sondern auf dem Bildschirm: Der Trainer teilt
zufällige Hände aus, und Kartensymbole sind je nach Kartengröße 10 oder
13 px groß. Ein zweiter Abzug desselben Bildschirms zeigte die Größen wieder.
Beinahe hätte ich einen Zufall für einen Fehler gehalten.

### Was dabei fast durchgerutscht wäre

Nach der Umstellung der Token wuchs der Fließtext — die **Seitenüberschrift
nicht**. Sie stand bei 27 px fest, weil `.page-header h1` ihre Größe nicht
aus einem Token nimmt, sondern selbst setzt:
`font-size: clamp(27px, 4.4vw, 38px)`.

Deshalb prüft `schriftgroesse.test.ts` nicht die fünf Stufen, sondern
**jede** Schriftgröße im Stylesheet und in jedem Bildschirm. Ein Test, der
nur die Token angesehen hätte, wäre grün gewesen, während jede
Seitenüberschrift der App weiter festgenagelt war.

### Drei Ausnahmen, benannt

`.tisch-zeit` und zwei weitere Anzeigeziffern bleiben in Pixeln. Sie hängen
an der Bildschirmbreite, nicht am Lesebedürfnis: Sie messen bereits 58 bis
220 Pixel und werden aus zwei Metern gelesen. Wer die Browserschrift
vergrößert, braucht den Fließtext größer — diese Zahl mitwachsen zu lassen
sprengte nur ihren Platz. Die Ausnahmen stehen namentlich im Test; alles
andere fällt durch.

### Und am engsten Ort nachgesehen

Der Übungstisch ist das dichteste Layout der App. Bei 24 px Wurzelgröße
wächst der Filz von 458 auf 498 Pixel, das Board bleibt sichtbar, es gibt
kein Querscrollen, und die Namensschilder kürzen wie vorgesehen („Bruno
B…"). Zwei Bildschirmabzüge, hell und am Tisch, zeigen ein Bild, das größer
ist — nicht ein kaputtes.

## E-058 · 2026-09-06 · Der Dialog verdeckte die Knöpfe, die man bediente

**Stand:** entschieden und umgesetzt.

`npm run bedienbar` prüft, ob der Tastaturfokus **sichtbar** ist. Was es nicht
prüft: ob man mit der Tastatur allein etwas **zu Ende bringt**. Genau da fällt
ein modaler Dialog auseinander, und diese App hat vier davon.

Drei Eigenschaften machen einen Dialog bedienbar:

1. Der Fokus wandert beim Öffnen hinein.
2. Escape schließt.
3. Tab bleibt drin.

Gemessen am Live-Tisch, mit wirklich gedrückten Tasten, Dialog „Abend
beenden?":

| | vorher | nachher |
|---|---|---|
| Fokus nach dem Öffnen im Dialog | **nein**, blieb auf „Beenden" dahinter | ja |
| Escape schließt | **nein** | ja |
| Tab-Schritte außerhalb (von 8) | **4** | 0 |

„Außerhalb" hieß: auf den Knöpfen **„Weiter", „Stände" und „Beenden"** —
denen, die der Dialog gerade verdeckt. Wer am Pokerabend eine Tastatur
benutzt, konnte also die Blindstufe weiterschalten oder den Abend beenden,
während ihn eine Rückfrage danach fragte, ob er das wirklich will. Und
abbrechen konnte er nicht.

### Drei Stände nebeneinander

Der Grund war nicht Nachlässigkeit an einer Stelle, sondern **drei
Abschriften**:

- `Onboarding`: vollständig — Startfokus, Fokusfalle, `aria-hidden` auf dem
  Rest, und bewusst kein Escape (eine Sprache muss gewählt werden).
- `Herkunft` und `PaywallModal`: Startfokus und Escape, aber keine Falle.
- Die beiden Dialoge am Live-Tisch: nichts davon.

Also dieselbe Antwort wie bei den Rangnamen (E-045) und dem Equity-Weg
(E-053): eine Stelle. `lib/dialog/tastatur.ts` kann die drei Eigenschaften,
gibt den Fokus beim Schließen an den Auslöser zurück, und lässt zwei Dinge
bewusst zu:

- **`schliessen` weglassen** heißt „kein Escape" — die eine begründete
  Ausnahme, die Sprachwahl beim ersten Start. `dialog.test.ts` erlaubt genau
  diese eine Datei und keine zweite.
- **`zuerst`** setzt den Startfokus woanders hin als auf das erste Element.
  Die Paywall braucht das: Dort steht der Kaufknopf zuerst, der Fokus gehört
  aber auf „später". Ein Dialog, der ungefragt erscheint, drängt niemanden
  mit dem Cursor zur Kasse.

### Zwei Fallen beim Bauen

**Die Taste hängt am Dokument, nicht am Dialog.** `onKeyDown` auf dem
Dialog-Element greift nur, wenn der Fokus schon drin ist — und genau das war
am Live-Tisch nicht der Fall. Ein Escape-Handler dort hätte nichts geändert.

**`schliessen` darf nicht in den Abhängigkeiten stehen.** Es ist meist eine
Pfeilfunktion aus dem Rendern und bei jedem Durchlauf eine andere; der Effekt
liefe ständig neu an und holte den Fokus jedes Mal zurück auf den ersten
Knopf — mitten im Tippen. Sie liegt deshalb in einer Ref.

### Gegenprobe

Im gebauten Stand, drei Dialoge nacheinander: Startfokus drin, 0 von 8
Tab-Schritten außerhalb, Escape schließt. Und der umgebaute
Willkommensdialog, an dem vorher nichts kaputt war, verhält sich unverändert:
Fokus gefangen, Escape schließt **nicht**, Enter wählt die Sprache und die
App startet.

## E-059 · 2026-09-06 · Was der Tisch einem sagt, der ihn nicht sieht

**Stand:** entschieden und umgesetzt.

Der Übungstisch ist das Herzstück der App und rein visuell: Karten, Chips,
Sitze. `npm run bedienbar` prüft die **Namen von Bedienelementen** — eine
Spielkarte ist keines. Also nachgesehen, was ein Vorlesegerät am Tisch
überhaupt vorfindet.

**Erfreulich viel.** Jede Karte ist ein `<div role="img">` mit `aria-label`
(„Pik Sechs", „Herz König"), verdeckte Karten heißen „Noch nicht
aufgedeckt", der Topf trägt „Pot 2", und der Live-Bereich meldet den Ausgang
(„Du gewinnst 2 Chips"). Im Bauteil steht sogar, warum es so gemacht ist:
`role="img"` auf einem `div`, weil die meisten Vorlesegeräte das `aria-label`
auf einem rollenlosen Element ignorieren. Das war jemandem wichtig.

**Ein Zwischenfall beim Messen, der hierher gehört:** Playwrights
`accessibility.snapshot()` zeigte die eigene Hand als Folge einzelner Zeichen
— „A", „♠", „♠" — und sah nach einem klaren Befund aus. Die Abfrage über die
**Rolle** (`getByRole('img', { name: 'Pik Sechs' })`) fand die Karten dann
aber sauber. Der Schnappschuss ist eine Annäherung, nicht der Baum selbst.
Beinahe hätte ich ein Werkzeug für einen Fehler gehalten und etwas
„repariert", das in Ordnung war.

### Der eigentliche Befund

Nicht die Auszeichnung war das Problem, sondern dass **nichts sie festhielt**.
`bedienbar` kannte zwölf Prüfarten, und keine davon sah `role="img"` an. Eine
neue Kartenvariante ohne Label — oder ein Umbau, der es verliert — wäre
niemandem aufgefallen, außer dem, der die App nicht sehen kann.

Die dreizehnte Art heißt `bildrolle-ohne-namen`: Jedes sichtbare Element mit
Bildrolle braucht einen Namen, es sei denn, es ist ausdrücklich
`aria-hidden`.

### Gegenprobe

Im Kartenbauteil das `aria-label` entfernt, neu gebaut, Lauf wiederholt:
**296 Befunde an 57 Stellen**, in beiden Sprachen, auf jedem Bildschirm mit
Karten. Danach zurückgebaut, neu gebaut, Lauf wiederholt: 0.

Eine Prüfung, die nie rot werden kann, ist eine Beruhigung und keine Prüfung
— der Unterschied zwischen 296 und 0 ist der Beleg, dass diese hier wirklich
hinsieht.

## E-060 · 2026-09-06 · Die Sicherheitsgrenze lief nur auf Zuruf

**Stand:** entschieden und umgesetzt.

Ein letzter Blick auf das, was in dieser ganzen Sitzung **kein einziges Mal
gelaufen** war: `npm run test:rules`. 29 Prüfungen der Firestore-Regeln —
die Zugriffsgrenze für Cloud-Konten, Online-Tisch und Freundesliste. Sie
sind aus `npm test` ausgeschlossen, weil sie Java und den Firestore-Emulator
brauchen (`vitest.config.ts` nennt den Grund: sonst wären sie bei jedem Lauf
zwangsläufig rot).

Also ausgeführt. Java 21 ist da, der Emulator startet, und das Ergebnis ist:
**29 von 29 bestanden.**

Die Abdeckung ist keine Stichprobe, sondern eine Liste dessen, was schiefgehen
könnte:

- **Handkarten**: Jeder liest nur seine eigenen — ein Mitspieler nicht die des
  anderen, und *nicht einmal der Gastgeber*.
- **Lernstand**: nur der eigene, und erst nach bestätigter E-Mail.
- **Abo-Berechtigung**: lesbar, aber niemals selbst beschreibbar, auch nicht
  in Teilen; das Ereignis-Gedächtnis der Webhooks ist ganz gesperrt.
- **Tischzustand**: nur der Gastgeber schreibt fort, die Version lässt sich
  nicht zurückrollen, niemand trägt sich beim Anlegen als fremder Gastgeber
  ein.
- **Freunde**: kein Durchblättern aller Codes, keine Anfrage im fremden
  Namen, kein Herzschlag in der Zukunft.
- Und ein „Alles Übrige", das den Rest verweigert.

### Der Befund ist derselbe wie bei E-054

Kein Fehler in den Regeln — sondern darin, **wann** sie geprüft werden. Die
Action fährt `npx vitest run`, und das schließt genau diese Datei aus. Die
Grenze, die verhindert, dass jemand fremde Handkarten liest, wurde also nur
geprüft, wenn ein Mensch daran dachte und Java installiert hatte.

Sie läuft jetzt im Job `messungen` mit — demselben, der die fünf Browserläufe
fährt und den Deploy bewusst nicht aufhält. Der Runner bringt Java mit; der
Befehl ist derselbe, der hier eben durchgelaufen ist.

**Ehrlich dazu:** Wie schon in E-054 konnte ich die Action selbst nicht
ausführen. Geprüft ist, dass die YAML gültig bleibt, dass der Deploy
weiterhin nur an `build` hängt — und dass der Befehl in einer vergleichbaren
Linux-Umgebung mit Java 21 sauber durchläuft.

---

## E-061 · 2026-09-06 · Die Messung, die alles für in Ordnung hielt

**Stand:** entschieden und umgesetzt.

Die Frage: Was zeigt PokerMentor im privaten Fenster, bei gesperrten
Website-Daten, unter einer Unternehmensrichtlinie? Dort ist `localStorage`
kein Feld, das leer ist — dort **wirft** schon der Lesezugriff.

Die erste Messung sagte: 90 von 90 Bildschirmen in Ordnung, null Befunde.

Das war falsch. Und zwar so falsch, wie eine Messung nur sein kann.

### Der Gegenversuch

Zur Regel geworden ist es nach E-052: Eine Prüfung, die noch nie rot war,
ist keine Prüfung. Also ein `try` aus `leseModus()` entfernt — der
Farbmodus wird beim Start jedes Bildschirms gelesen —, neu gebaut, gemessen.

Ergebnis: **wieder null Befunde.** Bei einer App, die in Wahrheit auf jedem
einzelnen Bildschirm abstürzte.

Zwei Annahmen waren schuld, beide plausibel und beide falsch:

1. **„Ein Absturz erzeugt einen `pageerror`."** Tut er nicht. React fängt
   ihn ab, `componentDidCatch` greift, die Fehlergrenze rendert. Im Fenster
   kommt nur eine `console.error` an — auf die niemand hörte.
2. **„Eine kaputte Seite ist leer."** Ist sie nicht. Die Absturzseite ist
   seit E-046 eine ordentliche Seite: Überschrift, Erklärung, Schaltflächen.
   150 Zeichen. Die Schwelle stand bei 30.

Die Messung suchte also nach einem leeren Bildschirm und fand eine gut
gestaltete Fehlermeldung — und hielt sie für die App. Je besser die
Absturzseite, desto blinder die Prüfung. Das ist die unangenehme Pointe:
E-046 hat die Prüfung von E-061 sabotiert, und beide waren gut gemeint.

### Was jetzt geprüft wird

**Erstens im Quelltext** (`speichersperre.test.ts`, läuft bei jedem `npm
test`, braucht keinen Browser): Jeder Zugriff auf `localStorage` oder
`sessionStorage` muss in einem `try` mit `catch` liegen — und zwar in
*derselben* Funktion. Ein `try` weiter außen fängt nichts mehr, sobald ein
Rückruf oder ein `await` dazwischensteht, also endet die Suche an jeder
Funktionsgrenze.

Gelesen wird über den TypeScript-Parser, nicht per Regex: Nur der Parser
weiß, ob ein `localStorage` ein Zugriff oder ein Wort in einem Kommentar
ist. Ein zweiter Test zählt die gefundenen Zugriffe (mindestens 20) — sonst
wäre die Regel eines Tages grün, weil der Parser nichts mehr erkennt.

Gegenprobe: dasselbe `try` entfernt →
`src/lib/design/modus.ts:43 — localStorage`. Mit Datei und Zeile.

**Zweitens im Browser** (`npm run speichersperre`): Der Quelltext ist nur
die Hälfte. Firebase, der Router und die Browser-Laufzeit fassen den
Speicher selbst an — ein Versionssprung kann das ändern, ohne dass sich im
Projekt eine Zeile rührt. Der Lauf sperrt beide Web-Speicher vor jedem
Skript, lädt alle 90 Bildschirme und **lädt sie erneut** (beim ersten Start
ist der Speicher ohnehin leer; erst der Neuaufbau zeigt, ob die App ohne ihr
Gedächtnis wieder hochkommt).

Er sucht jetzt nach `main[role="alert"]` — der Absturzseite selbst — und
hört auf `console.error` mit. Und er prüft im Fenster nach, ob die Sperre
überhaupt greift; tut sie es nicht, bricht er ab, statt grün zu melden. Das
ist dieselbe Vorsichtsmaßnahme wie `service_worker_aktiv` in E-052, aus
demselben Grund.

Gegenprobe mit dem entfernten `try`: 6 von 6 geprüften Bildschirmen melden
„Absturzseite" plus „SecurityError: Zugriff verweigert".

### Das Ergebnis

Mit der berichtigten Messung und dem wiederhergestellten `try`: **90 von 90
Bildschirmen, null Befunde.** Die App kommt im privaten Fenster hoch, zeigt
Inhalte, und die zehn abgesicherten Zugriffe im Startpfad tun genau das,
wofür sie geschrieben wurden.

Diesmal heißt das auch etwas.

Festgehalten in `docs/speichersperre.json`; der Lauf hängt im Job
`messungen` neben den fünf anderen.

### Was bleibt

Kein Fund in der App — aber ein Fund über das Prüfen selbst, und der wiegt
schwerer: **Eine Fehlerseite, die gut aussieht, sieht für eine Messung aus
wie eine funktionierende Seite.** Jede Prüfung, die „ist da Inhalt?" fragt,
muss auch fragen „ist es der *richtige* Inhalt?".

Rückwirkend angewandt: `ohnenetz` (E-052) sucht die Absturzseite jetzt
ebenfalls und wurde neu gemessen — weiterhin 90 von 90, null Befunde. Die
Lücke war dort nie aufgegangen, aber sie war offen.

---

## E-062 · 2026-09-07 · Gespeichert sah es aus

**Stand:** entschieden und umgesetzt.

Die Frage nach E-061 lag nahe: Der Speicher kann nicht nur **gesperrt** sein,
er kann auch **voll** sein. Dann wirft `localStorage.setItem` einen
`QuotaExceededError`, und alles andere funktioniert weiter.

`durableSet` hatte dafür längst eine Zeile:

```ts
try { localStorage.setItem(key, value); }
catch { /* localStorage voll/gesperrt – Spiegel versucht es trotzdem */ }
mirrorSet(key, value);
```

Gemessen, was daraus wird — Namen im Profil ändern, Speicher voll, speichern:

| | |
|---|---|
| Feld zeigt | „Zweiter Name" |
| In `localStorage` steht | „Erster Name" |
| Hinweis an die Nutzerin | keiner |
| Fehler in der Konsole | keiner |
| **Nach dem Neustart** | **„Erster Name"** |

Die Eingabe war weg. Ohne ein Wort.

### Warum der vorhandene Spiegel nicht half

Der IndexedDB-Spiegel hatte „Zweiter Name" bekommen — `mirrorSet` läuft ja
unabhängig. Nur holt ihn niemand: `restoreFromMirrorIfNeeded()` stellt nur
wieder her, wenn in `localStorage` **kein** Fortschrittsschlüssel liegt. Hier
lag einer. Ein alter.

Das Sicherheitsnetz war für den Fall gebaut, dass `localStorage` **geleert**
wird. Für den Fall, dass es **veraltet**, war es blind — und das ist der
häufigere.

### Wer führt

Bisher implizit: `localStorage`, weil es zuerst geschrieben wird. Ab jetzt
explizit, und mit einer Ausnahme:

> Normalerweise führt `localStorage`. Lehnt es einen Schreibvorgang ab, führt
> von diesem Moment an der Spiegel.

Festgehalten wird das mit einer Marke — im Spiegel, nicht in `localStorage`:
Dort war ja gerade kein Platz. Sie trägt bewusst nicht das Präfix der App,
damit sie beim Wiederherstellen nicht selbst als Datensatz zurückgeschrieben
wird. Beim nächsten Start sieht `restoreFromMirrorIfNeeded()` die Marke und
schreibt den Spiegel zurück — diesmal **überschreibend**, nicht ergänzend.
Gelingt auch das nicht (immer noch kein Platz), bleibt die Marke stehen und
der nächste Start versucht es wieder.

Die Marke wird nur bei einem **Wechsel** geschrieben, nicht bei jedem
Speichern: Ein voller Speicher lässt jede Änderung scheitern, und ein
IndexedDB-Schreibvorgang je Tastendruck wäre Lärm mit Kosten.

### Und gesagt wird es auch

`durableSet` gibt jetzt zurück, ob `localStorage` den Wert genommen hat. Beim
Wechsel von „nimmt" zu „nimmt nicht" erscheint ein Hinweis:

> **Nicht auf dem Gerät gespeichert**
> Der Speicher ist voll. Beim nächsten Start holt die App diesen Stand aus
> ihrer Sicherung — schaffe trotzdem Platz.

Beides zusammen, nicht eines davon. Ein Hinweis ohne Rettung wäre eine
Entschuldigung; eine Rettung ohne Hinweis ließe die Nutzerin im Glauben, alles
sei in Ordnung, während sie in Wahrheit auf einem Gerät arbeitet, das nichts
mehr annimmt. Steht als Regel 10.17 in `DESIGN.md`.

### Was das kostet

`restoreFromMirrorIfNeeded()` muss die Marke lesen, bevor es die alte
Abkürzung nehmen darf — der Spiegel wird also bei **jedem** Start geöffnet,
nicht nur wenn `localStorage` leer aussieht. Und das hält den ersten Anblick
auf, denn die Funktion läuft vor `render()`.

Gemessen statt geschätzt, zwölf Neustarts je Fassung, Median des First
Contentful Paint:

| | |
|---|---|
| Ohne die Änderung | **48 ms** |
| Mit der Änderung | **48 ms** |

Der Unterschied liegt unter dem Rauschen. Die Datenbank ist zu diesem
Zeitpunkt ohnehin gleich zu öffnen — die Änderung zieht das nur ein paar
Millisekunden vor.

### Gegenproben

- **Rückgabewert** (`storage.test.ts`, ohne Browser): Ein Ersatzspeicher, der
  auf Kommando wirft. `return gelungen` durch `return true` ersetzt → rot.
- **Ganzer Weg** (`npm run speichersperre`, zweiter Teil): Beide Dateien auf
  den Stand davor zurückgesetzt, neu gebaut, gemessen → „kein Hinweis, dass
  nicht gespeichert werden konnte". Mit der Änderung: Hinweis kommt, und nach
  dem Neustart steht „Zweiter Name".

Der zweite Teil hängt am selben Lauf wie E-061, weil es dieselbe Frage aus
zwei Richtungen ist: Was tut die App, wenn das Gerät ihre Daten nicht nimmt.

---

## E-063 · 2026-09-07 · Zehn Läufe, eine Haltung des Geräts

**Stand:** entschieden und umgesetzt.

Beim Nachzählen der Messungen fiel eine Lücke auf, die keine der zehn
Prüfungen schließt: Alle messen **hochkant**, 390 × 844. Quer ist dasselbe
Gerät 844 × 390 — ein Fünftel der Höhe.

Das ist keine Randlage. Wer am Tisch die Blindstufen laufen lässt, stellt das
Gerät hin. Wer am Übungstisch spielt, dreht es. Und niedrige Höhe bricht
Layouts auf andere Weise als schmale Breite: Was hochkant knapp über dem Rand
liegt, verschwindet quer unter der festen Leiste — und ist dann nicht mehr
erreichbar, nicht bloß hässlich.

`npm run quer` misst drei Dinge auf allen 90 Bildschirmen:

1. **Waagerechtes Überlaufen** — eine Breite, die hochkant nie auffällt.
2. **Bedienelemente, die ganz unter einer festen Leiste liegen** und nicht zu
   ihr gehören.
3. **Eine feste Leiste über 40 % der Höhe**, die vom Inhalt zu wenig übrig
   lässt.

### Das Ergebnis

| | |
|---|---|
| Höchster waagerechter Überlauf | **0 px** |
| Höchste feste Leiste | **86 px** von 390 (22 %) |
| Verdeckte Bedienelemente | **0** |
| Befunde insgesamt | **0** |

Nichts zu reparieren. Das Layout hält quer, obwohl es nie daraufhin gebaut
wurde — die durchgehend relativen Maße und der Verzicht auf feste Höhen
zahlen sich hier aus.

### Warum daraus trotzdem ein Lauf wurde

Ein sauberes Ergebnis ist ein Grund, es festzuhalten, kein Grund, es
wegzuwerfen. Ein Umbau am Layout kann diese Lage jederzeit brechen, und keine
andere Prüfung würde es sehen — sie schauen alle hochkant. Der Lauf hängt im
Job `messungen` neben den anderen und hält den Deploy nicht auf.

Gegenprobe: ein 1200 px breites Element und eine 120-px-Leiste in die Seite
gesetzt → 356 px Überlauf und 2 verdeckte Bedienelemente. Beide Regeln
schlagen an.

---

## E-064 · 2026-09-07 · Drei Verdachtsmomente, einer davon berechtigt

**Stand:** geprüft; eine Zeile geändert.

Nach E-062 lag die Frage nahe, wo sonst noch etwas still schiefgehen kann.
Drei Stellen geprüft, jede gemessen statt beurteilt.

### Kaputte Sicherungsdatei — in Ordnung

Vier Dateien eingespielt und gelesen, was auf dem Schirm steht:

| Datei | Antwort |
|---|---|
| kein JSON | „Das war keine gültige PokerMentor-Backup-Datei." |
| leere Datei | dieselbe |
| JSON ohne `xp` | dieselbe |
| gültige Sicherung | „Backup erfolgreich eingespielt …" |

Kein stiller Fall. **Bis auf einen:** Wenn schon das *Lesen* der Datei
scheitert — sie verschwindet zwischen Auswahl und Zugriff, die Berechtigung
fehlt —, feuert `onload` nie, und es passierte **gar nichts**. Kein Haken,
kein Fehler, keine Erklärung. Eine Zeile (`reader.onerror`) schließt das.
„Nichts passiert" ist die schlechteste aller Antworten.

### Sehr lange Namen — in Ordnung

Ein Spielername mit 264 Zeichen ohne Leerzeichen (der schlimmste Fall für
den Umbruch), eingesetzt in einen laufenden Abend:

| Bildschirm | Überlauf | Elemente über den Rand |
|---|---|---|
| `#/session/live` | 0 px | 0 |
| Stände-Dialog | 0 px | 0 |
| `#/session/auszahlung` | 0 px | 0 |
| `#/session/abende` | 0 px | 0 |

Der Name wird auf eine 30-px-Zeile gekürzt, das Layout hält. Die
Eingabefelder haben zwar kein `maxLength` — aber der Schaden, gegen den es
schützen soll, tritt nicht ein, und zehn Spieler mit solchen Namen kosten
2,6 KB. Also nichts geändert: Eine Grenze ohne Not ist auch nur eine Grenze.

### Bewegung reduzieren — in Ordnung

`@media (prefers-reduced-motion: reduce)` setzt Animations- und
Übergangsdauer per `!important` auf dem Universalselektor herab; im Quelltext
gibt es weder `element.animate()` noch `requestAnimationFrame`-Schleifen noch
`scrollIntoView({ behavior: 'smooth' })`. Die beiden `window.scrollTo(0, 0)`
springen ohne Animation. Es gibt also keine Bewegung an der Regel vorbei.

---

## E-065 · 2026-09-07 · Beim Nachlesen von vorne: zwei falsche Zahlen im README

**Stand:** entschieden und umgesetzt.

Der Durchgang von vorne durch die eigenen Dokumente — nicht durch den Code —
förderte drei Stellen zutage, an denen die Dokumentation etwas behauptete,
was nicht mehr stimmte:

| Stelle | Stand dort | Wirklich |
|---|---|---|
| README, Messläufe | „Neun Läufe" | **elf** |
| README, Sicherheit | „26 Tests" gegen den Emulator | **29** |
| DESIGN.md, Wege | „Stand 2026-08-27T08:03:15Z" | gemessen am 2026-09-06 |

Keine davon war je gelogen. Alle drei haben einmal gestimmt und sind
liegengeblieben, während die Sache weiterwuchs. Genau so veraltet
Dokumentation: nicht durch Nachlässigkeit im Moment, sondern durch
Wachstum danach.

### Warum das mehr als ein Tippfehler ist

Dieses Projekt begründet fast jede Entscheidung mit einer gemessenen Zahl.
Wenn die Zahlen in der Dokumentation nicht nachgerechnet werden, ist die
Begründung nur noch ein Stil. Eine Zahl ist eine Behauptung wie jede andere —
wer sie nicht prüfen lässt, hat sie aufgeschrieben, nicht belegt.

### Was jetzt nachgerechnet wird

`readme.test.ts` und ein Zusatz in `wege.test.ts` rechnen vier Behauptungen
aus ihrer Quelle nach:

- **Wie viele Messläufe es gibt** — gezählt in `package.json`, verglichen mit
  dem Zahlwort im README. Die Zahlwörter bleiben ausgeschrieben („Elf Läufe"
  liest sich besser als „11 Läufe"); der Test kennt sie deshalb bis zwanzig.
- **Dass jeder Lauf auch einzeln im README steht** — ein Lauf, den niemand
  findet, wird von niemandem ausgeführt.
- **Wie viele Regelprüfungen es gibt** — gezählt in `rules.test.ts`.
- **Welche Version unter dem Profil steht** — verglichen mit `package.json`,
  und zwar in beiden Sprachen. Das ist die einzige Stelle, an der die App
  der Nutzerin sagt, welchen Stand sie vor sich hat.

Dazu die Zahlen aus `docs/wege.json`, die in DESIGN.md ein zweites Mal im
Fließtext stehen: 41 Bildschirme, Tiefe 2, null Sackgassen.

Das doppelte Messdatum ist ersatzlos weg. Es stand an zwei Stellen und war
an einer davon falsch — eine Zahl gehört an eine Stelle.

### Gegenproben

Alle sechs Regeln einzeln rot gesehen: „Neun" statt „Elf", „26" statt „29",
eine Zeile aus der Laufliste entfernt, `package.json` auf 2.3.0 gesetzt,
„42 eigene Bildschirme" statt 41.
