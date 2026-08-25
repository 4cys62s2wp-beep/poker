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
