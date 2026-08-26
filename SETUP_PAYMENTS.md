# Zahlungen aktivieren

Der gesamte Code steht und ist geprüft. Was fehlt, sind **Konten** — und die
gibt es nach eigener Planung ab Oktober 2026. Diese Anleitung sagt, was dann
in welcher Reihenfolge zu tun ist.

**Solange in `public/monetization.json` `"enabled": false` steht, ist die
Monetarisierung aus.** Die App ist dann genau das, was sie heute ist:
vollständig kostenlos, ohne Preise, ohne Sperren, ohne Upgrade-Hinweise. Diese
eine Datei schaltet alles scharf — und zwar erst, wenn alles andere
nachweislich funktioniert.

Zwei Riegel, nicht einer: `"enabled": true` allein reicht nicht. Ohne gültige
`https`-Adresse in `functionsBaseUrl` bleibt alles aus. Der Grund steht in
`src/lib/pro/config.ts`: Lieber gar keine Paywall als eine, die ins Leere
führt. Fehlt die Datei ganz, ist ebenfalls alles aus.

Löst ab: `MONETIZATION_SETUP.md` (dort stand Paddle als Merchant of Record im
Mittelpunkt; mit StoreKit als Pflichtweg auf iOS ändert sich die Rechnung).

---

## 0. Warum es zwei Zahlungswege gibt

**App-Store-Richtlinie 3.1.1:** Digitale Inhalte, die in der iOS-App
freigeschaltet werden, müssen über StoreKit laufen. Stripe oder PayPal im
iOS-Client bedeuten Ablehnung. Die Reader-App-Ausnahme greift für eine Lern-App
nicht, und External-Purchase-Entitlements sind Sonderfälle, auf die man nicht
bauen sollte.

Daraus folgt: **zwei Zahlungswege, ein Berechtigungsmodell.**

| | Web (Browser, PWA) | iOS (native Hülle) |
|---|---|---|
| Anbieter | Stripe | StoreKit / In-App-Kauf |
| Gebühr | ~1,5 % + 0,25 € (EU-Karten) | **15 % im ersten Jahr, danach 30 %** |
| Kündigung | Stripe-Kundenportal | nur über die iOS-Systemeinstellungen |
| Berechtigung | `entitlements/{uid}` | dasselbe Dokument |

Wer auf dem iPhone kauft und sich im Browser anmeldet, hat denselben Zugang.
Das entscheidet allein der Entitlement-Service.

**Kein PayPal.** Begründung in `ENTSCHEIDUNGEN.md`, E-002: Bei wiederkehrenden
Abos ist die Ereignis-Semantik zu grob für ein Berechtigungssystem, das genau
von den Statuswechseln lebt.

---

## 1. Was der Preis mit Apple macht

**Rechne den iOS-Preis nicht wie den Webpreis.** Bei 4,99 € im Monat:

| | Web (Stripe) | iOS (Apple, 15 %) | iOS (Apple, 30 %) |
|---|---|---|---|
| Nutzer zahlt | 4,99 € | 4,99 € | 4,99 € |
| Abzüglich MwSt. (19 %) | 4,19 € | 4,19 € | 4,19 € |
| Abzüglich Anbieter | ~3,88 € | 3,56 € | 2,93 € |

Über Apple bleiben bei gleichem Preis **bis zu 25 % weniger** übrig.

Drei Wege damit umzugehen:

1. **Gleicher Preis überall.** Einfach, ehrlich, kostet Marge. Empfohlen für den
   Start — Preisunterschiede zwischen Plattformen verärgern Nutzer mehr, als sie
   einbringen.
2. **iOS teurer** (z. B. 5,99 €). Erlaubt, aber begründungsbedürftig, sobald
   jemand beides sieht.
3. **Web-Kauf bewerben.** Heikel: Innerhalb der iOS-App darf **nicht** auf
   externe Kaufmöglichkeiten hingewiesen werden. Außerhalb (Website, E-Mail,
   Social Media) sehr wohl.

**Der 15-%-Satz** gilt über das *Small Business Program* (unter 1 Mio. $
Jahresumsatz) — dafür muss man sich **aktiv anmelden**, es passiert nicht
automatisch. Erste Handlung nach Erhalt des Developer-Accounts.

---

## 2. Reihenfolge ab Oktober

### Schritt 1 — Firebase auf Blaze

Cloud Functions verlangen den Blaze-Tarif (Abrechnungskonto mit Zahlungsmittel).

1. <https://console.firebase.google.com/project/pokermentor-9ac7f/usage/details>
2. Auf Blaze umstellen.
3. **Sofort danach ein Budget einrichten:**
   <https://console.cloud.google.com/billing/budgets> — Blaze rechnet nach
   Nutzung ab. Eine Endlosschleife im Code kann echtes Geld kosten. Ein
   Alarm bei 5 € genügt für den Anfang.

### Schritt 2 — Stripe einrichten

1. Konto anlegen, Identität bestätigen (dauert 1–3 Tage).
2. **Produkte anlegen** (Dashboard → Products):
   - „PokerMentor Pro — Monat", wiederkehrend monatlich, 4,99 € inkl. MwSt.
   - „PokerMentor Pro — Jahr", wiederkehrend jährlich, 39,99 € inkl. MwSt.
   - Beide Preis-Kennungen (`price_…`) notieren.
3. **Steuer:** Stripe Tax aktivieren, sonst muss die Umsatzsteuer für jedes
   EU-Land selbst berechnet und abgeführt werden. Kostet 0,5 % pro Transaktion
   und ist das Geld wert.
4. **Kundenportal** aktivieren (Settings → Billing → Customer portal).
   Kündigung, Zahlungsdaten, Rechnungen laufen darüber — und Stripe verschickt
   die Kündigungsbestätigung, die § 312k BGB ohnehin verlangt.

### Schritt 3 — Schlüssel hinterlegen

Nichts davon gehört ins Repository. Befehle stehen in `RUNME.sh`:

```
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

Preis-Kennungen in `functions/src/index.ts` bzw. als Umgebungsvariablen
eintragen (`STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`).

### Schritt 4 — Funktionen veröffentlichen

```
cd functions && npm install && npm run build
firebase deploy --only functions
```

Die Ausgabe nennt die URLs. Die des `stripeWebhook` wird in Schritt 5 gebraucht.

### Schritt 5 — Webhook eintragen

Stripe → Developers → Webhooks → Add endpoint:

- **URL:** die aus Schritt 4
- **Ereignisse:** `customer.subscription.created`, `.updated`, `.deleted`,
  `charge.refunded`
- Das **Signing secret** (`whsec_…`) kopieren und als
  `STRIPE_WEBHOOK_SECRET` setzen (Schritt 3 wiederholen).

### Schritt 6 — Im Testmodus prüfen

**Vor jedem Echtbetrieb.** Stripe stellt Testkarten bereit:

| Karte | Verhalten |
|---|---|
| `4242 4242 4242 4242` | Zahlung erfolgreich |
| `4000 0000 0000 0341` | Erste Zahlung scheitert |
| `4000 0000 0000 9995` | Karte gedeckt, spätere Abbuchung scheitert |

Zu prüfen ist jedes Mal, ob in Firestore unter `entitlements/{uid}` der
erwartete Status ankommt:

- [ ] Kauf → `active`, Zugang da
- [ ] Kündigung im Kundenportal → `canceled`, Zugang **bleibt** bis Laufzeitende
- [ ] Laufzeit vorbei → `expired`, Zugang weg
- [ ] Zahlung scheitert → `past_due`, Zugang **bleibt**
- [ ] Rückerstattung → `refunded`, Zugang **sofort** weg
- [ ] Denselben Webhook zweimal schicken → zweites Mal wirkungslos

Die Statusmaschine dahinter steht in `docs/STATUSMASCHINE.md`.

### Schritt 7 — Erst jetzt scharfschalten

In `public/monetization.json` `"enabled"` auf `true` setzen und
`functionsBaseUrl`, `priceMonthly` sowie – falls angeboten – `priceAnnual`
ausfüllen. Committen, pushen, und **danach auf dem Handy nachsehen**, ob die
Preise stehen und der Kaufweg bis zur Stripe-Seite führt.

Der Schlüssel `_hinweis` in der Datei wird ignoriert und darf stehen bleiben.

Zurückdrehen geht genauso schnell: `"enabled"` wieder auf `false`.

---

## 3. Der Apple-Weg (später, mit eigener App)

Braucht zusätzlich zu allem oben:

1. **Apple-Developer-Account**, 99 $/Jahr.
2. **Small Business Program** beantragen (15 % statt 30 %).
3. **Eine native iOS-Hülle.** Eine PWA kann StoreKit nicht aufrufen — das ist
   eine harte Grenze des Browsers, keine Bequemlichkeitsfrage. Nötig ist eine
   echte App (Capacitor ist der geringste Aufwand), die die Brücke aus
   `src/lib/payments/storekit.ts` bereitstellt.
4. **Abo-Produkte in App Store Connect** mit exakt den Kennungen aus
   `APPLE_PRODUCT_IDS`.
5. **Schlüssel für App Store Server Notifications V2** (Benutzer und Zugriff →
   Integrationen). Der `.p8`-Schlüssel ist nur **einmal** herunterladbar.
6. **Benachrichtigungs-URL** eintragen (Production und Sandbox getrennt).
7. **„Sign in with Apple"** einbauen — Apples Regel 4.8 verlangt es, sobald
   Google-Anmeldung angeboten wird. Die ist bereits eingebaut, also fällig.
8. **Wiederherstellen-Knopf** sichtbar machen. Sein Fehlen ist ein
   Ablehnungsgrund; `StoreKitProvider.restorePurchases()` ist vorbereitet.

Alle Stellen im Code sind mit `TODO (Apple)` markiert.

---

## 4. Doppelte Abos vermeiden

Wer im Browser abschließt und später die iOS-App installiert, kann dort
versehentlich **ein zweites Abo** kaufen — Apple weiß nichts vom ersten.

Der Entitlement-Service erkennt den Wechsel (`isSourceSwitch`) und der Nutzer
verliert keinen Zugang. Was er verliert, ist Geld.

**Was die App tun muss:** vor dem Kauf warnen, wenn bereits ein aktives Abo bei
einem anderen Anbieter besteht.

**Was die App bewusst NICHT tut:** das alte Abo automatisch kündigen. Software,
die ungefragt fremde Vertragsverhältnisse beendet, ist ein Haftungsrisiko. Sie
weist hin — entscheiden muss der Mensch.

---

## 5. Rechtliches (Deutschland)

Bereits umgesetzt und beim Scharfschalten zu prüfen:

- **§ 312j BGB:** Bestell-Button heißt „Zahlungspflichtig abonnieren"; die
  Pflichtangaben stehen unmittelbar darüber. Umgesetzt in `UpgradePage.tsx`.
- **§ 312k BGB:** Kündigungsseite ohne Anmeldung erreichbar, ohne
  Rückhalteangebote. Umgesetzt in `CancelPage.tsx`.
- **PAngV:** Alle Preise inkl. MwSt.
- **Impressum:** erst mit echten Daten füllen. Als Minderjähriger ist die
  Anbieterkennzeichnung nicht trivial — das gehört einmal fachlich geprüft,
  bevor Geld fließt.
- **Widerrufsrecht:** Bei digitalen Inhalten erlischt es erst mit
  ausdrücklicher Zustimmung zum sofortigen Beginn. Der Text steht auf der
  Rechtsseite.

Alles zusammen unter `/rechtliches` in der App.

---

## 6. Die ehrliche Grenze

**Die Paywall schützt den Status, nicht die Inhalte.**

- **Abgesichert:** Der Abo-Status. Er kommt aus `entitlements/{uid}`, das
  laut `firestore.rules` niemand außer dem Server beschreiben darf — belegt
  durch einen Test gegen den echten Emulator.
- **Nicht abgesichert:** Die Lerninhalte liegen als JavaScript im Browser. Wer
  die Entwicklerwerkzeuge öffnet, kommt an die Texte.

Für 99 % der Nutzer reicht das: Niemand, der 4,99 € nicht zahlen will, liest
stattdessen minifiziertes JavaScript. Echte Durchsetzung hieße, die Inhalte aus
dem Bundle zu lösen und über eine authentifizierte Funktion auszuliefern — ein
eigener großer Umbau, bei dem die Offline-Fähigkeit der PWA verloren ginge.
Bewusst nicht gemacht (`ENTSCHEIDUNGEN.md`, E-003).

Wer später hochpreisige Inhalte verkauft, muss diese Abwägung neu treffen.
