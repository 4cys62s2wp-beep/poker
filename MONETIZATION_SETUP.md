# Pro-Abo aktivieren

Die komplette Paywall ist gebaut und getestet – aber **standardmäßig aus**. Solange
`public/monetization.json` fehlt, ist die App genau das, was sie heute ist: vollständig
kostenlos, ohne Preise, ohne Sperren, ohne Upgrade-Hinweise. Erst diese eine Datei
schaltet alles scharf.

Diese Anleitung sagt dir, was du tun musst, in welcher Reihenfolge – und wo die
ehrlichen Grenzen liegen.

---

## 1. Zuerst das Unangenehme: Was eine Web-App technisch nicht kann

**Eine rein clientseitige Paywall ist nicht fälschungssicher.** Die Lerninhalte liegen
als JavaScript im Browser des Nutzers. Wer die Entwicklerwerkzeuge öffnet, kommt an
die Texte – unabhängig davon, wie die Oberfläche sie sperrt.

Was das praktisch bedeutet:

- **Für 99 % der Nutzer reicht die eingebaute Sperre vollkommen.** Niemand, der
  4,99 € nicht zahlen will, liest stattdessen minifiziertes JavaScript.
- **Der Abo-Status selbst ist abgesichert.** Er kommt aus dem Firestore-Dokument
  `customers/{uid}`, das laut `firestore.rules` **nur serverseitig beschrieben**
  werden darf. Niemand kann sich lokal ein Abo eintragen, das der Server bestätigt.
- **Wenn du echte Durchsetzung brauchst** (z. B. weil ein Käufer das verlangt),
  müssen die Pro-Lektionen aus dem Bundle heraus und hinter eine
  authentifizierte Abfrage – als Firestore-Dokumente mit Sicherheitsregeln auf
  einen `pro`-Custom-Claim. Das ist ein größerer Umbau, aber mit dem vorhandenen
  Firebase-Setup machbar.

Sag Bescheid, wenn du diesen Umbau willst – für den Start ist er nicht nötig.

---

## 2. Zahlungsanbieter wählen

Du brauchst zwingend **einen Webhook-Empfänger**. Kein Anbieter kann den Bezahlstatus
ohne serverseitigen Endpunkt in deine Datenbank schreiben. GitHub Pages bleibt der
Host der App; der Webhook läuft in einer **Firebase Cloud Function** (Blaze-Tarif,
im Kleinbetrieb praktisch kostenlos) oder einem **Cloudflare Worker** (Gratis-Kontingent).

| | **Paddle** (Empfehlung) | **Stripe** |
|---|---|---|
| Gebühr bei 4,99 € | ~0,70 € (14 %) | ~0,36 € (7,2 %) |
| Gebühr bei 39,99 € | ~2,45 € (6,1 %) | ~1,13 € (2,8 %) |
| EU-Umsatzsteuer | **übernimmt Paddle komplett** | **du bist Steuerschuldner** |
| Rechnungen an Kunden | Paddle | du |
| Kleinunternehmer-Status | bleibt erhalten | gerät bei EU-Verkäufen unter Druck |

**Meine Empfehlung: Paddle.** Nicht wegen der Gebühren – die sind schlechter –,
sondern wegen der Umsatzsteuer. Paddle ist „Merchant of Record": Du verkaufst an
Paddle, Paddle verkauft an den Endkunden. Damit entfallen für dich das
Bestimmungslandprinzip, die 10.000-€-Schwelle, die OSS-Meldungen beim BZSt und
länderspezifische Rechnungen. Bei einer zweisprachigen App, die garantiert auch
ins EU-Ausland verkauft, ist das den Aufpreis wert – der Unterschied bei einem
Jahresabo sind 1,32 €, ein Steuerberater kostet mehr.

**Wichtig vorab klären:** Frag Paddle (bzw. Stripe) **schriftlich**, ob sie eine
Poker-**Lern**-App ohne Echtgeldspiel akzeptieren. Viele Zahlungsanbieter schließen
„Gambling" aus; eine reine Lern-App sollte durchgehen, aber lass es dir bestätigen,
bevor du Zeit investierst.

---

## 3. Einrichtung Schritt für Schritt

### 3.1 Voraussetzung: Cloud-Konten müssen laufen

Ohne Konto gibt es keinen Abo-Status. Arbeite zuerst **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**
komplett durch. Danach in der Firebase-Konsole die aktualisierten
[`firestore.rules`](firestore.rules) veröffentlichen – sie enthalten jetzt die
`customers/{uid}`-Regeln (Client darf nur lesen).

### 3.2 Produkte anlegen

Im Dashboard deines Zahlungsanbieters zwei Preise anlegen:

- **Monatlich: 4,99 €** (inkl. MwSt. ausweisen)
- **Jährlich: 39,99 €** (inkl. MwSt.)

Dann einen **Payment Link / Checkout-Link** je Preis erzeugen sowie den Link zum
**Kundenportal**.

### 3.3 Webhook, der den Abo-Status schreibt

Der Webhook muss bei `checkout.completed`, `subscription.updated` und
`subscription.canceled` das Dokument `customers/{uid}` schreiben:

```js
// Cloud Function (Pseudocode) – läuft mit Admin-Rechten
await db.collection('customers').doc(uid).set({
  status: 'active',            // 'active' | 'trialing' | 'canceled' | 'past_due'
  currentPeriodEnd: 1767225600, // Unix-Sekunden ODER ISO-String
  updatedAt: FieldValue.serverTimestamp(),
}, { merge: true });
```

Die App liest genau diese zwei Felder (`src/lib/cloud/cloud.ts` → `watchSubscription`)
und schaltet Pro frei, wenn `status` `active`/`trialing` ist **und** `currentPeriodEnd`
in der Zukunft liegt.

**Wie kommt die UID zum Webhook?** Gib sie beim Checkout mit – bei Stripe über
`client_reference_id`, bei Paddle über `custom_data`. Die App hängt bereits die
E-Mail-Adresse an den Checkout-Link an, damit Zahlung und Konto zusammenfinden.

> Hinweis: Die fertige Firebase-Extension „Run Payments with Stripe" existiert zwar,
> wird aber laut Recherche nicht mehr aktiv gepflegt, und Firebase Extensions sollen
> 2027 abgeschaltet werden. Schreib die Function lieber selbst – es sind ~50 Zeilen.

### 3.4 Konfigurationsdatei anlegen

`public/monetization.example.json` nach `public/monetization.json` kopieren und
ausfüllen:

```json
{
  "enabled": true,
  "checkoutMonthlyUrl": "https://…",
  "checkoutAnnualUrl": "https://…",
  "portalUrl": "https://…",
  "priceMonthly": "4,99 €",
  "priceAnnual": "39,99 €",
  "annualNote": "4 Monate geschenkt",
  "supportEmail": "hallo@deine-domain.de"
}
```

Nur `https`-URLs werden akzeptiert; alles andere schaltet die Paywall automatisch ab.

### 3.5 Anbieterdaten für das Impressum

`public/legal.example.json` nach `public/legal.json` kopieren und **vollständig**
ausfüllen. Ohne vollständige Daten zeigt die App bewusst **kein** Impressum an –
erfundene Angaben wären schlimmer als keine.

### 3.6 Deployen

```bash
git add public/monetization.json public/legal.json
git commit -m "Pro-Abo aktivieren"
git push
```

---

## 4. Rechts-Checkliste Deutschland

Was die App bereits erledigt:

- ✅ **§ 312j BGB** – Bestell-Button heißt „Zahlungspflichtig abonnieren"; die
  Pflichtangaben (Leistung, Gesamtpreis inkl. MwSt., Laufzeit, Kündigung) stehen
  unmittelbar darüber.
- ✅ **§ 312k BGB** – eigene Kündigungsseite unter `/kuendigen`, **ohne Anmeldung**
  erreichbar, dauerhaft im Footer verlinkt, führt direkt zum Formular und enthält
  **keine** Rückhalteangebote (die sind laut aktueller Rechtsprechung unzulässig).
- ✅ **PAngV** – alle Preise inkl. MwSt.; das Monatsäquivalent beim Jahresabo ist
  als Zusatzangabe gekennzeichnet, nicht als ausgezeichneter Preis.
- ✅ **Widerrufsrecht** – 14 Tage, ohne die vorzeitige Erlöschens-Klausel. Du
  verzichtest also bewusst darauf, das Widerrufsrecht früher enden zu lassen. Das
  ist kundenfreundlich und rechtssicher.
- ✅ **Datenschutz** – beschreibt lokale Speicherung, Firebase, Zahlungsanbieter,
  Hosting und Betroffenenrechte.
- ✅ **Keine Dark Patterns** – kein Fake-Countdown, kein versteckter
  Schließen-Button, „Später" gleichwertig sichtbar.

Was **du** noch erledigen musst:

- ⬜ `legal.json` mit echten Anbieterdaten ausfüllen.
- ⬜ **Kündigungsbestätigung in Textform**: Die Kündigungsseite schickt dir eine
  E-Mail. Du musst dem Kunden den Eingang **schriftlich bestätigen** (Datum +
  Vertragsende). Für den Anfang reicht eine manuelle Antwort; bei mehr Volumen
  automatisieren.
- ⬜ **Auftragsverarbeitungsverträge** mit Google/Firebase und dem Zahlungsanbieter
  abschließen (beide bieten das im Dashboard an, ein Klick).
- ⬜ **Bestellbestätigung per E-Mail** nach jedem Kauf (übernimmt der
  Zahlungsanbieter – nachprüfen, ob es aktiviert ist).
- ⬜ **Einmal anwaltlich prüfen lassen**, bevor du Geld nimmst. Gemessen am
  Abmahnrisiko im deutschen E-Commerce ist das gut investiert.

> Das hier ist keine Rechtsberatung – es ist eine sorgfältig recherchierte
> Vorarbeit, die dir teure Stunden beim Anwalt spart.

---

## 5. Warum die Preise so gewählt sind

Aus der Marktrecherche (Quellen in der Zusammenfassung der Sitzung):

- **4,99 € statt 5,00 €** – der Left-Digit-Effekt ist gut belegt und kostet nichts.
- **39,99 € im Jahr statt der üblichen „2 Monate geschenkt"-Rechnung (49,99 €)** –
  aus zwei Gründen: Lern-Apps sind bei Jahresverlängerungen schwach, ein tiefer
  Rabatt holt den Umsatz vorn ab; und die Gebührenlast fällt von 14 % auf 6 %.
- **Jahresabo als Voreinstellung** – Standard bei allen gut konvertierenden Apps.
- **Keine Wochen-Abos** – im deutschen Markt unseriös und gebührentechnisch schlecht.
- **Später eher hoch- als runtertesten:** Höherpreisige Apps konvertieren laut den
  Benchmarks *besser*, nicht schlechter. Nach ~500 Testphasen lohnt ein A/B-Test
  4,99 € gegen 6,99 € – Zielgröße ist der **Umsatz je Neuregistrierung nach
  30 Tagen**, nicht die Abschlussquote.

**Realistische Erwartung:** 2–5 % der wiederkehrenden Nutzer werden zahlen. Bei
1.000 aktiven Nutzern im Monat und 3 % sind das ~30 Abos, also rund 1.400 € Umsatz
im Jahr vor Gebühren. **Der Engpass ist die Reichweite, nicht der Preis** – deshalb
ist der Gratis-Bereich bewusst großzügig gehalten.

---

## 6. Wie die Aufteilung aussieht

Festgelegt in `src/lib/pro/plan.ts` – dort und nur dort änderst du sie.

**Gratis (dauerhaft):** Module 1–3 komplett · **die erste Lektion jedes Moduls** ·
**Modul „Psychologie & Bankroll" komplett** · 5 von 7 Trainern · Live-Coach 3 Hände/Tag ·
Übungstisch 25 Hände/Tag · Chip-Rechner · Starthand-Explorer · Tells · Odds-Tabellen ·
Glossar · Tages-Quiz · XP, Level, Abzeichen · Backup-Export

**Pro:** alle 9 Module · Live-Coach unbegrenzt · alle 7 Trainer · Pro-Insights ·
Übungstisch unbegrenzt + Coach-Overlay · Wiederholen (Spaced Repetition) ·
Bankroll unbegrenzt + CSV · Geräte-Synchronisation

Zwei Entscheidungen bewusst gegen den Umsatz:

1. **Das Modul zu Psychologie, Bankroll und verantwortungsvollem Spielen bleibt
   gratis.** Suchtprävention hinter eine Kasse zu stellen, wäre bei einem
   Poker-Produkt nicht vertretbar.
2. **Die erste Lektion jedes Moduls ist frei.** Wer den Anfang gesehen hat, weiß,
   was ihm fehlt – das überzeugt besser als eine blanke Sperre.

**Testphase:** 7 Tage voller Zugriff, automatisch beim ersten Start, **ohne
Zahlungsdaten**. Danach Rückfall auf Gratis – es wird **nichts gelöscht**.

---

## 7. Vor dem Scharfschalten testen

```bash
cp public/monetization.example.json public/monetization.json   # Testdaten
npm run dev
```

Prüfen:
- Ohne `monetization.json`: keine Paywall, keine Preise, „Pro" fehlt in der Navigation
- Mit Datei: Testphase läuft, Badge in der Seitenleiste, `/pro` erreichbar
- Testphase künstlich ablaufen lassen (im Browser-Speicher `trialStartedAt`
  zurückdatieren): Sperren greifen, Limits zählen, Dialog erscheint
- `/kuendigen` ohne Anmeldung erreichbar
- Fortschritt bleibt nach Ablauf vollständig erhalten
