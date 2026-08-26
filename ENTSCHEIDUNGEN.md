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
