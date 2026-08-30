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
