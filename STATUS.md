# STATUS

**Zweck:** Diese Datei ist so geschrieben, dass eine frische Sitzung ohne
jeden Kontext hier weiterarbeiten kann. Wer neu dazukommt, liest **nur diese
Datei** und weiß, wo es steht.

- **Branch:** `feature/payments-und-hub`
- **Abgezweigt von:** `claude/poker-learning-app-concept-ml0xm6` @ `eb7899b`
- **Letzte Aktualisierung:** 2026-08-26, nach Phase 3
- **Stand in einem Satz:** Alle drei Arbeitspakete sind abgeschlossen,
  committet und gepusht. Offen ist nur noch, was ein Mensch, ein Konto oder
  eine Geschäftsentscheidung braucht — gesammelt in `docs/TODO_MANUELL.md`.

---

## Worum es ging

Drei Arbeitspakete, strikt nacheinander:

1. **Phase 1 — Zahlungen & Architektur** ✅ *fertig, Gate 1 erfüllt*
2. **Phase 2 — Informationsarchitektur & Design** ✅ *fertig, Gate 2 erfüllt*
3. **Phase 3 — Qualitätsdurchlauf** ✅ *fertig*

---

## Das Wichtigste zuerst

**Die App ist ein statisches Frontend ohne Server.** PWA auf GitHub Pages,
Firebase nur für Konten und Datenbank. Alles, was „serverseitig" heißen soll,
muss als Cloud Function gebaut werden — und die sind derzeit **nicht
deploybar** (Blaze-Tarif fehlt, siehe `BLOCKER.md` B-001). Deshalb: Code
vollständig gebaut, gegen den **Emulator** geprüft, Deploy auf später.

**Die Monetarisierung ist aus und bleibt es**, solange keine
`public/monetization.json` existiert. Keine Änderung dieser Sitzung ändert am
Verhalten der laufenden App etwas, was Geld betrifft.

---

## Fertig (mit Commit-Hashes)

| Commit | Was | Tests |
|---|---|---:|
| `eb7899b` | *(Vorgänger-Branch)* Spielstil-Kennzahlen: Bibliothek + Erfassung am Übungstisch | 244 |
| `7598f54` | Phase 1.1: Bestandsaufnahme, Betriebsdateien, Schlüssel-Prüfung der Historie | 244 |
| `a5f75da` | Phase 1.2: Provider-Abstraktion (Vertrag, Mock, Stripe, StoreKit-Gerüst) | 270 |
| `93bb97c` | Phase 1.3: Entitlement-Service — Statusmaschine, Regeln umgezogen | 313 |
| `3624b84` | Phase 1.4: Apple-Signaturprüfung, Ereignis-Übersetzung, Adapter | 357 |
| `17bd681` | Phase 1.5 + 1.6: Secrets, `SETUP_PAYMENTS.md`, Checkout ohne URL im Bundle → **Gate 1** | 357 |
| `5ccd621` | Phase 2: Hub-Screen, Bereichsstruktur, Design-Tokens, Spielstil-Analyse → **Gate 2** | 357 |
| `62b5357` | Phase 3: Token-Audit, Erreichbarkeit, PWA, Gating-Test, toter Code | **365** |

Zusammenfassung der ganzen Sitzung: **`SESSION_REPORT.md`**.

---

## Exakt nächster Schritt

**Es gibt keinen Schritt mehr, der ohne einen Menschen weitergeht.**

Die drei blockierenden Punkte stehen in `docs/TODO_MANUELL.md` und brauchen
alle etwas, das Code nicht liefern kann:

1. **Impressum als Minderjähriger fachlich klären** — bevor Geld fließt
2. **Apple Root CA gegenprüfen** — der Fingerabdruck in
   `functions/src/webhooks/appleVerify.ts` wurde nie gegen das echte
   Zertifikat verglichen (fünf Minuten mit `openssl`)
3. **Budget-Alarm bei Google Cloud** — unmittelbar bei der Blaze-Umstellung

**Falls doch weitergearbeitet werden soll, ohne auf Konten zu warten**, ist
die lohnendste offene Arbeit in dieser Reihenfolge:

- **Freunde-Rangliste** (`docs/TODO_MANUELL.md` Nr. 12) — die Freundesliste
  steht bereits; nötig ist ein Dokument `stats/{uid}` mit Name und XP, das nur
  Freunde lesen dürfen, plus Regeln **und** Regeltests in
  `src/lib/__tests__/rules.test.ts`
- **Off-Scale-Abstände bildschirmweise** (Nr. 10) — Liste in
  `docs/TOKEN_AUDIT.md` Abschnitt 3. **Nicht** per Suchen-und-Ersetzen: Das
  ist eine optische Änderung, keine Umbenennung
- **Spielstil-Erfassung am Online-Tisch** (Nr. 11) — setzt voraus, dass der
  Gastgeber die tatsächlich angewandten Züge zurückmeldet

---

## Dateien gerade in Arbeit

**Keine.** Der Baum ist sauber, alles ist committet und gepusht.

Neu angelegt in Phase 3:
- `src/lib/pro/trialAnchor.ts` + Test — schließt die gefundene Gating-Lücke
- `docs/TOKEN_AUDIT.md` — was umgestellt wurde und was bewusst nicht
- `docs/ERREICHBARKEIT.md` — jeder Bildschirm, Weg und Rückweg
- `docs/TODO_MANUELL.md` — was ein Mensch entscheiden muss
- `SESSION_REPORT.md` — Bericht über alle drei Phasen

Entfernt (durch den Hub ersetzt, nichts ging verloren):
- `src/pages/Dashboard.tsx`, `src/i18n/pages/dashboard.ts`

---

## Offene Punkte

| # | Was | Wann | Stand |
|---|---|---|---|
| O-1 | `enabled/pro/trialActive` zu `hasAccess(feature)` zusammenfassen | Phase 2 | ✅ erledigt: `can()` / `checkAccess()` in `src/lib/pro/plan.ts`, Screens rufen nur noch das |
| O-2 | Statistik-Seite zur Spielstil-Analyse | Phase 2 | ✅ erledigt: `src/pages/StatsPage.tsx` unter `/live/statistik` |
| O-3 | `customers/{uid}` → `entitlements/{uid}` umziehen | Phase 1.3 | ✅ erledigt, 29 Regeltests gegen den Emulator |
| O-4 | Spielstil-Erfassung fehlt am Online-Tisch (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden kann) | später | offen, bewusst — `docs/TODO_MANUELL.md` Nr. 11 |
| O-5 | **Zahlungs-Texte müssen im iOS-Build anders lauten.** `src/i18n/pages/pro.ts` nennt „Über Stripe – mit Apple Pay, Google Pay, Kreditkarte, PayPal oder SEPA". In der iOS-App ist das (a) falsch, weil dort StoreKit zahlt, und (b) ein Verstoß gegen Richtlinie 3.1.1 | vor dem ersten iOS-Build, **zwingend** | offen — `docs/TODO_MANUELL.md` Nr. 4 |
| O-6 | Testphase serverseitig führen | wenn Cloud Functions laufen | offen — lokal gegen einfaches Zurücksetzen abgesichert (`trialAnchor.ts`), siehe Risiko 5 |

---

## Bekannte Risiken

1. **Die Paywall schützt den Status, nicht die Inhalte.** Lerninhalte liegen im
   JavaScript-Bundle und sind auslesbar. Bewusste Entscheidung (`ENTSCHEIDUNGEN.md`
   E-003), kein Versehen. Wer später hochpreisige Inhalte verkauft, muss sie neu
   treffen.
2. **Der Apple-Weg ist ungetestet gegen echte Apple-Server.** Die
   Signaturprüfung läuft gegen selbst erzeugte Testschlüssel — die Logik stimmt
   dann, aber echte Apple-Schlüssel und -Formate hat noch nie jemand
   dagegengehalten (B-002). Der hinterlegte Root-Fingerabdruck ist ungeprüft
   (`docs/TODO_MANUELL.md` Nr. 2).
3. **Eine PWA kann StoreKit nicht aufrufen.** Der iOS-Weg setzt eine native
   Hülle voraus, die es noch nicht gibt. Der Code ist darauf vorbereitet, aber
   der Weg endet heute in der Hülle.
4. **Preisgestaltung iOS ≠ Web.** Apple behält 15–30 %. Wer beide Wege gleich
   bepreist, verdient auf iOS deutlich weniger. Zahlen in `SETUP_PAYMENTS.md`,
   Empfehlung in `docs/TODO_MANUELL.md` Nr. 7.
5. **Die Testphase läuft lokal.** Wer den *gesamten* Browser-Speicher löscht,
   bekommt eine neue — und verliert dabei allen Lernfortschritt. Das bloße
   Zurücksetzen des Datums wirkt nicht mehr (`src/lib/pro/trialAnchor.ts`,
   8 Tests, im Browser gegengeprüft). Für ein 5-€-Abo ist die Hürde angemessen.
6. **Cloud Functions sind nicht deployt.** Ohne sie gibt es keine Webhooks und
   damit keine echten Abo-Status. Alles davon ist gebaut und gegen den Emulator
   geprüft, aber nichts davon läuft (`BLOCKER.md` B-001).

---

## Wie man hier weiterarbeitet

```bash
git checkout feature/payments-und-hub
npm install
npm test            # 376 Unit-Tests, braucht nichts weiter
npm run test:rules  # 29 Firestore-Regeltests gegen den Emulator (braucht Java)
npx tsc --noEmit    # Typecheck inkl. functions/src
npm run build       # muss fehlerfrei durchlaufen
npm audit           # muss 0 Schwachstellen melden
```

Befehle, die ein Mensch selbst ausführen muss (Konten, Schlüssel, Deploy),
stehen gesammelt in `RUNME.sh` — nichts davon läuft automatisch.

---

## Landkarte der Dokumente

| Datei | Inhalt |
|---|---|
| `STATUS.md` | *diese Datei* — Stand, nächster Schritt, offene Punkte, Risiken |
| `SESSION_REPORT.md` | Bericht über alle drei Phasen |
| `ENTSCHEIDUNGEN.md` | Jede Entscheidung ohne Rückfrage, mit verworfener Alternative |
| `BLOCKER.md` | Was aufhält und welche Wege es gibt |
| `RUNME.sh` | Befehle für Konten, Schlüssel, Deploy |
| `SETUP_PAYMENTS.md` | Zahlungen ab Oktober, Schritt für Schritt |
| `docs/TODO_MANUELL.md` | Was ein Mensch entscheiden oder prüfen muss |
| `docs/BESTANDSAUFNAHME.md` | Zahlungs-/Gating-Stellen vor dem Umbau |
| `docs/STATUSMASCHINE.md` | Alle Abo-Zustände und Übergänge |
| `docs/DESIGN_REFERENZ.md` | Auswertung der Referenz-App |
| `docs/SCREEN_STRUKTUR.md` | Navigation vorher/nachher |
| `docs/ERREICHBARKEIT.md` | Jeder Bildschirm, Weg und Rückweg |
| `docs/TOKEN_AUDIT.md` | Farb- und Pixelwerte, was umgestellt wurde |
