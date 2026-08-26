# STATUS

**Zweck:** Diese Datei ist so geschrieben, dass eine frische Sitzung ohne
jeden Kontext hier weiterarbeiten kann. Wer neu dazukommt, liest **nur diese
Datei** und weiß, wo es steht.

- **Branch:** `feature/payments-und-hub`
- **Abgezweigt von:** `claude/poker-learning-app-concept-ml0xm6` @ `eb7899b`
- **Letzte Aktualisierung:** 2026-08-26, nach der Scope-Korrektur
- **Veröffentlicht:** ja. `feature/payments-und-hub` wurde ohne Umweg
  (Fast-Forward) nach `claude/poker-learning-app-concept-ml0xm6` gezogen und
  gepusht; der Workflow „Test & Deploy" ist bei `c4989bb` grün durchgelaufen.
  Die Live-App zeigt also den Stand dieser Sitzung.
- **Stand in einem Satz:** Alle drei Arbeitspakete sind abgeschlossen,
  committet, gepusht und ausgeliefert. Offen ist nur noch, was ein Mensch, ein
  Konto oder eine Geschäftsentscheidung braucht — gesammelt in
  `docs/TODO_MANUELL.md`.

---

## Worum es ging

Drei Arbeitspakete, strikt nacheinander:

1. **Phase 1 — Zahlungen & Architektur** ✅ *fertig, Gate 1 erfüllt*
2. **Phase 2 — Informationsarchitektur & Design** ✅ *fertig, Gate 2 erfüllt*
3. **Phase 3 — Qualitätsdurchlauf** ✅ *fertig*

Danach kam eine **Scope-Korrektur** (E-009 bis E-011):

4. **Kein aktiver Bezahl-Layer** ✅ — alle Features frei, per Schalter statt
   Rückbau. Die Architektur aus Phase 1 bleibt vollständig stehen.
5. **Hub endgültig: Lernen · Nachschlagen · Live-Session** ✅ — kein vierter
   Einstieg.
6. **Phase 4 beschnitten** 📌 *festgehalten, nicht begonnen* — Modus B und die
   Multiplayer-Vorbereitung sind gestrichen. Der Auftrag für die verbleibenden
   Punkte 4.1–4.6 liegt mir im Wortlaut **nicht** vor; E-010 hält nur fest,
   was **nicht** gebaut wird.

---

## Das Wichtigste zuerst

**Die App ist ein statisches Frontend ohne Server.** PWA auf GitHub Pages,
Firebase nur für Konten und Datenbank. Alles, was „serverseitig" heißen soll,
muss als Cloud Function gebaut werden — und die sind derzeit **nicht
deploybar** (Blaze-Tarif fehlt, siehe `BLOCKER.md` B-001). Deshalb: Code
vollständig gebaut, gegen den **Emulator** geprüft, Deploy auf später.

**Kein Feature ist kostenpflichtig.** Der Schalter dafür ist ein einziger
Wert: `"enabled": false` in `public/monetization.json`. Solange er steht,
liefert `checkAccess()` für jedes Feature `allowed` und `usePro().fullAccess`
ist wahr. Ein Test liest die ausgelieferte Datei und würde rot, wenn das
kippt (`src/lib/__tests__/allesFrei.test.ts`).

Die Zahlungsarchitektur aus Phase 1 bleibt vollständig erhalten und wird
später gebraucht — sie ist nur ausgeschaltet, nicht ausgebaut.

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
| `62b5357` | Phase 3: Token-Audit, Erreichbarkeit, PWA, Gating-Test, toter Code | 365 |
| `c166a37` | Commit-Hash der dritten Phase nachgetragen | 365 |
| `c4989bb` | CSP: Google-Anmeldung war blockiert; Konfigurationsdateien ausgeliefert | 376 |
| `9f560f0` · `9d9e828` | Veröffentlichung, Konto-Verknüpfung iOS ↔ Web | 376 |
| `c5aecc7` | Zentraler Zugriffsschalter `fullAccess`, alles frei (E-009) | 385 |
| `21537ee` | Hub endgültig: Lernen · Nachschlagen · Live-Session (E-011) | **399** |

Zusammenfassung der ganzen Sitzung: **`SESSION_REPORT.md`**.

---

## Exakt nächster Schritt

**Auf eine Entscheidung wartend, nicht auf Arbeit.**

Die größte offene Frage steht als Nr. 1 in `docs/TODO_MANUELL.md`: Ob die
Begründung, mit der Modus B und die Multiplayer-Vorbereitung gestrichen
wurden (Altersfreigabe bei simulierten Pokertischen), auch für den bereits
gebauten **Übungstisch**, den **Pokerabend-Tisch** und den **Online-Tisch**
gelten soll. Ich habe nichts davon entfernt — gestrichen war ausdrücklich die
*Vorbereitung*, nicht der Bestand. Fällt die Entscheidung gegen sie, braucht
die Spielstil-Analyse eine neue Datenquelle.

**Falls Phase 4 beginnen soll:** Der Auftrag für 4.1 bis 4.6 liegt mir nicht
vor. Bekannt ist nur, was gestrichen ist (E-010) und dass 4.5 ein
**Szenario-Drill** wird: eine Situation, eine Entscheidung, eine Auflösung —
keine Chip-Ökonomie, kein Spielgeld-Guthaben, keine Sitzung über mehrere
Hände mit Stackverlauf.

**Was ohne Entscheidung weitergehen könnte**, in dieser Reihenfolge:

- **Freunde-Rangliste** (`docs/TODO_MANUELL.md` Nr. 13) — die Freundesliste
  steht bereits; nötig ist ein Dokument `stats/{uid}` mit Name und XP, das nur
  Freunde lesen dürfen, plus Regeln **und** Regeltests
- **Off-Scale-Abstände bildschirmweise** (Nr. 11) — Liste in
  `docs/TOKEN_AUDIT.md` Abschnitt 3. **Nicht** per Suchen-und-Ersetzen
- **Auszahlungs-Rechner erweitern** — Deals und ICM fehlen bewusst; für ein
  Heimspiel ist beides Overkill, für einen ernsteren Turnierabend nicht

## Dateien gerade in Arbeit

**Keine.** Der Baum ist sauber, alles ist committet und gepusht.

Neu angelegt in der Scope-Korrektur:
- `src/pages/ReferencePage.tsx`, `src/pages/SessionPage.tsx` — die zwei neuen
  Bereichsseiten (ersetzen `LivePage` und `ToolsHub`)
- `src/pages/session/PayoutPage.tsx` + `src/lib/poker/payout.ts` + Test —
  der Auszahlungs-Rechner, den es noch nicht gab (14 Tests)
- `src/lib/__tests__/allesFrei.test.ts` — der Beweis, dass alles frei ist
- `BackLink` in `src/components/ui` — der strukturelle Rückweg als eigene
  Komponente, weil elf Seiten gar keinen hatten

Neu angelegt in Phase 3 und danach:
- `src/lib/csp.ts` + Test — die Sicherheitsrichtlinie, jetzt geprüft
- `public/monetization.json`, `public/legal.json` — ausdrücklich aus bzw. leer
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
| O-4 | Spielstil-Erfassung fehlt am Online-Tisch (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden kann) | später | offen, bewusst — `docs/TODO_MANUELL.md` Nr. 12 |
| O-5 | **Zahlungs-Texte müssen im iOS-Build anders lauten.** `src/i18n/pages/pro.ts` nennt „Über Stripe – mit Apple Pay, Google Pay, Kreditkarte, PayPal oder SEPA". In der iOS-App ist das (a) falsch, weil dort StoreKit zahlt, und (b) ein Verstoß gegen Richtlinie 3.1.1 | vor dem ersten iOS-Build, **zwingend** | offen — `docs/TODO_MANUELL.md` Nr. 5 |
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
   (`docs/TODO_MANUELL.md` Nr. 3).
3. **Eine PWA kann StoreKit nicht aufrufen.** Der iOS-Weg setzt eine native
   Hülle voraus, die es noch nicht gibt. Der Code ist darauf vorbereitet, aber
   der Weg endet heute in der Hülle.
4. **Preisgestaltung iOS ≠ Web.** Apple behält 15–30 %. Wer beide Wege gleich
   bepreist, verdient auf iOS deutlich weniger. Zahlen in `SETUP_PAYMENTS.md`,
   Empfehlung in `docs/TODO_MANUELL.md` Nr. 8.
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
| `docs/STATUSMASCHINE.md` | Alle Abo-Zustände und Übergänge, dazu die Konto-Verknüpfung iOS ↔ Web |
| `docs/DESIGN_REFERENZ.md` | Auswertung der Referenz-App |
| `docs/SCREEN_STRUKTUR.md` | Navigation vorher/nachher |
| `docs/ERREICHBARKEIT.md` | Jeder Bildschirm, Weg und Rückweg |
| `docs/TOKEN_AUDIT.md` | Farb- und Pixelwerte, was umgestellt wurde |
