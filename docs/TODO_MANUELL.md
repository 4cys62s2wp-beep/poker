# Was du selbst prüfen oder entscheiden musst

Priorisiert. Alles hier braucht entweder einen Menschen, ein Konto oder eine
Geschäftsentscheidung — Code allein löst es nicht.

---

## 🔴 Blockierend — vor dem ersten Euro Umsatz

### 1. Impressum als Minderjähriger klären
**Warum es dringend ist:** Sobald Geld fließt, greift die
Anbieterkennzeichnung nach § 5 DDG. Als Minderjähriger ist die Rechtslage
nicht trivial — Verträge sind schwebend unwirksam, und die Frage, wer
Anbieter ist, muss beantwortet sein, bevor jemand zahlt.

**Was zu tun ist:** Einmal fachlich prüfen lassen (Verbraucherzentrale,
IHK-Gründungsberatung oder Anwalt). Nicht selbst zusammenreimen.

**Bis dahin:** Die Monetarisierung bleibt aus. Genau so ist sie eingestellt.

### 2. Apple Root CA gegenprüfen
**Wo:** `functions/src/webhooks/appleVerify.ts`, Konstante
`APPLE_ROOT_CA_G3_SHA256`.

**Warum:** Dieser Fingerabdruck ist der Kern der gesamten Apple-Prüfung. Ich
habe ihn eingesetzt, aber **nie gegen das echte Zertifikat verglichen** — das
ginge nur mit dem Original von
<https://www.apple.com/certificateauthority/>.

**Was zu tun ist:** Zertifikat herunterladen, Fingerabdruck bilden
(`openssl x509 -in AppleRootCA-G3.cer -inform DER -fingerprint -sha256 -noout`),
mit der Konstante vergleichen. Fünf Minuten.

### 3. Budget-Alarm bei Google Cloud
**Wann:** Unmittelbar nach der Umstellung auf Blaze, nicht danach.

**Warum:** Blaze rechnet nach Nutzung ab. Eine Endlosschleife in einer
Funktion kostet echtes Geld, und es merkt niemand, bis die Rechnung kommt.

**Wo:** <https://console.cloud.google.com/billing/budgets> — ein Alarm bei
5 € genügt für den Anfang.

---

## 🟠 Wichtig — vor dem ersten iOS-Build

### 4. Zahlungs-Texte für iOS trennen
**Wo:** `src/i18n/pages/pro.ts`, Schlüssel `securePay` und die FAQ-Antwort
„Wie wird bezahlt?".

**Das Problem:** Dort steht „Über Stripe – mit Apple Pay, Google Pay,
Kreditkarte, PayPal oder SEPA". In der iOS-App ist das (a) sachlich falsch,
weil dort StoreKit zahlt, und (b) ein Verstoß gegen Richtlinie 3.1.1: In der
App darf nicht auf fremde Zahlungswege hingewiesen werden.

**Warum ich es nicht schon gemacht habe:** Die iOS-Hülle existiert noch
nicht. Eine Verzweigung zu bauen, die niemand ausprobieren kann, hieße,
ungetesteten Code für einen Fall zu schreiben, dessen genaue Form noch offen
ist.

### 5. „Sign in with Apple" einbauen
**Warum:** Apples Regel 4.8 verlangt es, sobald eine Drittanbieter-Anmeldung
angeboten wird. Google-Anmeldung ist eingebaut — die Pflicht besteht also.

**Voraussetzung:** Apple-Developer-Account.

### 6. Preisentscheidung iOS vs. Web
**Die Zahlen** stehen in `SETUP_PAYMENTS.md`, Abschnitt 1. Kurz: Bei 4,99 €
bleiben über Stripe ~3,88 €, über Apple 3,56 € (15 %) oder 2,93 € (30 %).

**Das ist keine technische Frage.** Gleicher Preis überall ist einfach und
ehrlich, kostet aber Marge. Höherer iOS-Preis ist erlaubt, aber
begründungsbedürftig, sobald jemand beides sieht.

**Meine Empfehlung für den Start:** gleicher Preis. Preisunterschiede
zwischen Plattformen verärgern Nutzer mehr, als sie einbringen.

### 7. Small Business Program beantragen
15 % statt 30 % — aber nur, wenn man sich **aktiv anmeldet**. Passiert nicht
von selbst. Erste Handlung nach Erhalt des Developer-Accounts.

---

## 🟡 Lohnend — wenn Zeit ist

### 8. Testphase serverseitig führen
**Stand:** Der Beginn der Testphase liegt lokal und ist gegen einfaches
Zurücksetzen abgesichert (`src/lib/pro/trialAnchor.ts`, 8 Tests). Wer den
kompletten Browser-Speicher löscht, bekommt eine neue Testphase — verliert
dabei aber allen Lernfortschritt.

**Für ein 5-€-Abo ist diese Hürde angemessen.** Wer später mehr verlangt,
sollte den Beginn beim ersten Anmelden serverseitig festschreiben. Dafür
müssen die Cloud Functions laufen.

### 9. Off-Scale-Abstände bildschirmweise angleichen
**Umfang:** ~110 Werte, die nicht auf dem 4er-Raster liegen (5, 7, 11, 13,
15 px). Vollständige Liste in `docs/TOKEN_AUDIT.md`, Abschnitt 3.

**Warum nicht automatisch:** Ein `7px` in 8 px zu ändern ist eine optische
Änderung, kein Refactoring. 110 davon auf einmal, ohne Sichtprüfung,
verschieben das Bild leise in eine Richtung, die niemand beabsichtigt hat.

**Vorgehen:** Bildschirm für Bildschirm, mit Vorher-Nachher-Vergleich.

### 10. Spielstil-Analyse am Online-Tisch
**Stand:** Nur der Übungstisch wird ausgewertet. Der Pokerabend-Tisch nicht
(mehrere Menschen an einem Gerät — nicht zuordenbar), der Online-Tisch auch
nicht (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden
kann).

**Machbar wäre es**, wenn der Gastgeber die tatsächlich angewandten Züge
zurückmeldet. Aufwand mittel, Nutzen ebenfalls.

### 11. Freunde-Rangliste
Die Freundesliste steht, eine Wochen-Rangliste nach Lern-XP wäre der
stärkste Motivator, den die App noch nicht hat. Braucht ein neues Dokument
`stats/{uid}` mit Name und XP, das nur Freunde lesen dürfen — plus
Sicherheitsregeln und Regeltests.

**Bewusst nicht global**, sondern nur unter Freunden: Ein Wettbewerb gegen
Fremde belohnt Menge statt Verstehen, und wer auf Platz 400 landet, hört auf.

---

## 🟢 Zum Nachlesen

### 12. Was der Abo-Schutz leistet — und was nicht
**Geschützt:** Der Abo-*Status*. Er kommt aus `entitlements/{uid}` und darf
laut `firestore.rules` nur der Server schreiben. Durch Tests gegen den
Emulator belegt, und im Browser gegengeprüft: Weder eine direkte Adresse noch
manipulierter Browser-Speicher öffnen Pro-Inhalte.

**Nicht geschützt:** Die Lern-*Inhalte*. Sie liegen als JavaScript im Browser.
Wer die Entwicklerwerkzeuge öffnet, kommt an die Texte.

Das ist eine bewusste Abwägung (`ENTSCHEIDUNGEN.md`, E-003), kein Versehen.
Wer später hochpreisige Inhalte verkauft, muss sie neu treffen.

### 13. Wo was steht

| Datei | Inhalt |
|---|---|
| `STATUS.md` | Stand, nächster Schritt, offene Punkte, Risiken |
| `ENTSCHEIDUNGEN.md` | Jede Entscheidung ohne Rückfrage, mit verworfener Alternative |
| `BLOCKER.md` | Was aufhält und welche Wege es gibt |
| `RUNME.sh` | Befehle für Konten, Schlüssel, Deploy |
| `SETUP_PAYMENTS.md` | Zahlungen ab Oktober, Schritt für Schritt |
| `docs/BESTANDSAUFNAHME.md` | Zahlungs-/Gating-Stellen vor dem Umbau |
| `docs/STATUSMASCHINE.md` | Alle Abo-Zustände und Übergänge |
| `docs/DESIGN_REFERENZ.md` | Auswertung der Referenz-App |
| `docs/SCREEN_STRUKTUR.md` | Navigation vorher/nachher |
| `docs/ERREICHBARKEIT.md` | Jeder Bildschirm, Weg und Rückweg |
| `docs/TOKEN_AUDIT.md` | Farb- und Pixelwerte, was umgestellt wurde |
