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
  und als Nr. 9 in `docs/TODO_MANUELL.md` vermerkt.
- **Nicht betroffen:** Das bezahlte Abo. Dessen Status kommt aus
  `entitlements/{uid}` und darf laut `firestore.rules` nur der Server
  schreiben — durch Emulator-Tests belegt.
