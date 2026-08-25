# STATUS

**Zweck:** Diese Datei ist so geschrieben, dass eine frische Sitzung ohne
jeden Kontext hier weiterarbeiten kann. Wer neu dazukommt, liest **nur diese
Datei** und weiß, wo es steht.

- **Branch:** `feature/payments-und-hub`
- **Abgezweigt von:** `claude/poker-learning-app-concept-ml0xm6` @ `eb7899b`
- **Letzte Aktualisierung:** 2026-08-25, Phase 1

---

## Worum es geht

Drei Arbeitspakete, strikt nacheinander:

1. **Phase 1 — Zahlungen & Architektur** ← *läuft gerade*
2. **Phase 2 — Informationsarchitektur & Design** (Hub-Screen)
3. **Phase 3 — Qualitätsdurchlauf**

Eine Phase startet erst, wenn die vorherige committet und ihr Gate erfüllt ist.

---

## Das Wichtigste zuerst

**Die App ist ein statisches Frontend ohne Server.** PWA auf GitHub Pages,
Firebase nur für Konten und Datenbank. Alles, was „serverseitig" heißen soll,
muss als Cloud Function gebaut werden — und die sind derzeit **nicht
deploybar** (Blaze-Tarif fehlt, siehe `BLOCKER.md` B-001). Deshalb: Code
vollständig bauen, gegen den **Emulator** testen, Deploy auf später.

**Die Monetarisierung ist aus und bleibt es**, solange keine
`public/monetization.json` existiert. Alle Änderungen dieser Phase ändern am
Verhalten der laufenden App zunächst **nichts**.

---

## Fertig (mit Commit-Hashes)

| Commit | Was |
|---|---|
| `eb7899b` | *(Vorgänger-Branch)* Spielstil-Kennzahlen: Bibliothek + Erfassung am Übungstisch, 244 Tests |
| `7598f54` | Phase 1.1: Bestandsaufnahme, Betriebsdateien, Schlüssel-Prüfung der Historie |
| `a5f75da` | Phase 1.2: Provider-Abstraktion (Vertrag, Mock, Stripe, StoreKit-Gerüst), 270 Tests |
| `93bb97c` | Phase 1.3: Entitlement-Service – Statusmaschine, Regeln umgezogen, 313 Tests |
| *folgt* | Phase 1.4: Apple-Signaturprüfung, Ereignis-Übersetzung, Adapter, 357 Tests |

---

## Exakt nächster Schritt

**Phase 1.5 + 1.6 — Secrets und Setup-Anleitung.** (Gate 1 danach erreicht.)

1. `.env.example` mit Platzhaltern anlegen (1.5). Die Prüfung der
   Git-Historie ist bereits erfolgt (Commit `7598f54`): keine Schlüssel
   gefunden.
2. `MONETIZATION_SETUP.md` → `SETUP_PAYMENTS.md` überführen (1.6):
   Reihenfolge ab Oktober, Produkte/Preise anlegen, Webhook-Adressen,
   Sandbox-Tests. Muss enthalten: Apple behält 15–30 %, der iOS-Preis darf
   nicht wie der Webpreis kalkuliert werden.
3. `public/monetization.example.json` an die neue Form anpassen
   (Checkout-URLs raus, nur noch Anzeigedaten).
4. `UpgradePage.tsx` auf `createCheckout()` umstellen statt `href`.
5. Gate 1 prüfen, committen, dann Phase 2.

---

## Dateien gerade in Arbeit

Keine. Letzter Stand ist committet und der Baum ist sauber.

Neu angelegt in dieser Phase:
- `docs/BESTANDSAUFNAHME.md` — jede Zahlungs-/Gating-Stelle mit Entscheidung
- `ENTSCHEIDUNGEN.md` — E-001 bis E-004
- `BLOCKER.md` — B-001 (Blaze), B-002 (Apple-Account)
- `STATUS.md` — diese Datei

---

## Offene Punkte

| # | Was | Wann |
|---|---|---|
| O-1 | `enabled/pro/trialActive` an ~12 Stellen zu `hasAccess(feature)` zusammenfassen | Phase 2, wenn die Screens ohnehin umgebaut werden (siehe E-004) |
| O-2 | Statistik-Seite zur Spielstil-Analyse — Bibliothek und Erfassung stehen (`eb7899b`), die Seite fehlt noch. Texte liegen fertig in `src/i18n/pages/stats.ts` | Phase 2, gehört in die neue Informationsarchitektur |
| O-3 | `firestore.rules`: `customers/{uid}` → `entitlements/{uid}` umziehen, Regeltests mitziehen | Phase 1.3 |
| O-4 | Spielstil-Erfassung fehlt am Online-Tisch (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden kann) | später, bewusst offen |

---

## Bekannte Risiken

1. **Die Paywall schützt den Status, nicht die Inhalte.** Lerninhalte liegen im
   JavaScript-Bundle und sind auslesbar. Bewusste Entscheidung (E-003), kein
   Versehen.
2. **Der Apple-Weg ist ungetestet gegen echte Apple-Server.** Signaturprüfung
   wird gegen selbst erzeugte Testschlüssel geprüft — die Logik stimmt dann,
   aber die echten Apple-Schlüssel und -Formate hat noch nie jemand
   dagegengehalten (B-002).
3. **Eine PWA kann StoreKit nicht aufrufen.** Der iOS-Weg setzt eine native
   Hülle voraus, die es noch nicht gibt. Der Code ist darauf vorbereitet, aber
   der Weg endet heute in der Hülle.
4. **Preisgestaltung iOS ≠ Web.** Apple behält 15–30 %. Wer beide Wege gleich
   bepreist, verdient auf iOS deutlich weniger. Gehört in `SETUP_PAYMENTS.md`
   und ist eine Geschäftsentscheidung, keine technische.

---

## Wie man hier weiterarbeitet

```bash
git checkout feature/payments-und-hub
npm install
npm test            # Unit-Tests, braucht nichts weiter
npm run test:rules  # Firestore-Regeln gegen den Emulator (braucht Java)
npm run build       # muss fehlerfrei durchlaufen
```

Befehle, die ein Mensch selbst ausführen muss (Konten, Schlüssel, Deploy),
stehen gesammelt in `RUNME.sh` — nichts davon läuft automatisch.
