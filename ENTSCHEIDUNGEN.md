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

**Wie gestrichen.** `docs/TODO_MANUELL.md`, Nr. 13, steht als durchgestrichene
Zeile mit Begründung da, statt gelöscht zu sein. Ein gelöschter Eintrag taucht
in einem halben Jahr als „gute Idee" wieder auf; ein durchgestrichener nicht.

---

## E-023 · 2026-08-26 · Vorschaukarte je Aufgabe bleibt ungebaut

**Entschieden (C1).** Die allgemeine Karte reicht. Der Umbau von `HashRouter`
auf `BrowserRouter` samt vorab erzeugter Seiten bleibt ungebaut.

**Begründung.** Teilbare Links entfalten ihren Wert erst, wenn es Nutzer
gibt, die teilen. Aktuell gibt es keine. Vorab erzeugte Seiten müssten bei
jeder Datenänderung neu erzeugt werden — dauerhafte Last für einen erst
später eintretenden Vorteil.

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
