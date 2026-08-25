# Bestandsaufnahme: Zahlung, Abo-Status, Feature-Gating

Stand vor dem Umbau, Branch `feature/payments-und-hub`, Basis-Commit `eb7899b`.

Jede Stelle im Code, die Zahlung, Abo-Status oder Feature-Gating berührt, mit
Entscheidung und Begründung. **Diese Liste entsteht vor dem Refactoring**, damit
nachvollziehbar bleibt, was warum angefasst wurde.

---

## Ausgangslage in einem Satz

Die Paywall ist bereits vollständig gebaut, aber **rein clientseitig** und über
eine Konfigurationsdatei abschaltbar. Sie ist derzeit **aus** (keine
`monetization.json` im Repository). Der Abo-Status kommt aus einem
Firestore-Dokument, das nur ein Webhook schreiben dürfte — den Webhook gibt es
noch nicht.

---

## 1. Konfiguration und Provider-Anbindung

| Datei | Was sie tut | Entscheidung | Begründung |
|---|---|---|---|
| `src/lib/pro/config.ts` | Lädt `monetization.json`, validiert streng (nur `https`-URLs), liefert `MONETIZATION_OFF` als sicheren Standard | **Refactoren** | Die Validierung ist gut und bleibt. Aber die Datei kennt heute Stripe-Payment-Links als *URLs im Client* — genau das darf laut Guideline 3.1.1 auf iOS nicht existieren. Die URLs wandern hinter die Provider-Abstraktion; die Datei behält nur noch Anzeigedaten (Preise, Support-Kontakt) und den Master-Schalter. |
| `public/monetization.example.json` | Vorlage | **Refactoren** | Muss die neuen Felder abbilden. |
| `MONETIZATION_SETUP.md` | Anleitung Paddle vs. Stripe | **Refactoren → `SETUP_PAYMENTS.md`** | Inhaltlich überholt: entschied sich für Paddle als Merchant of Record, plante aber keinen zweiten Weg für iOS. Mit StoreKit als Pflichtweg auf iOS ändert sich die Rechnung. Alter Text wird nicht gelöscht, sondern überführt. |

### Warum die Checkout-URL nicht im Client bleiben darf

Heute steht in `monetization.json` ein fertiger Stripe-Payment-Link, den die
Upgrade-Seite direkt verlinkt. Das ist bequem und für eine reine Web-App auch
zulässig. Sobald dieselbe Codebasis als iOS-App ausgeliefert wird, ist genau
dieser Link ein Ablehnungsgrund: Digitale Inhalte, die in der App freigeschaltet
werden, müssen über StoreKit laufen. Ein `<a href="https://checkout.stripe...">`
im Bundle ist auch dann ein Verstoß, wenn er auf iOS nie angezeigt wird —
Apple prüft das Verhalten, aber Prüfer finden auch Links.

Konsequenz: Der Client fragt nie nach einer URL. Er ruft
`createCheckout(plan)` auf, und die Provider-Implementierung entscheidet, was
passiert (Stripe-Session serverseitig erzeugen, oder StoreKit-Kauf auslösen).

---

## 2. Berechtigungsmodell

| Datei | Was sie tut | Entscheidung | Begründung |
|---|---|---|---|
| `src/lib/pro/plan.ts` | Einzige Wahrheit über die Gratis/Pro-Aufteilung, Feature-Regeln, Limits, Testphase. Rein funktional, 13 Tests | **Behalten**, unverändert in der Logik | Das ist der wertvollste Teil des bestehenden Systems: keine Provider-Kenntnis, keine React-Abhängigkeit, vollständig geprüft. Genau die Schicht, die bei zwei Zahlungswegen identisch bleiben muss. Ergänzt wird nur die Herkunft (`source`) im Kontext. |
| `src/lib/pro/ProProvider.tsx` | React-Kontext: lädt Konfiguration, beobachtet `customers/{uid}`, rechnet Testphase, stellt `access()`/`can()`/`consume()` bereit | **Refactoren** | Die Struktur stimmt. Zwei Änderungen: (1) Der Abo-Status kommt künftig aus `entitlements/{uid}` statt `customers/{uid}` — mit Feldern für Herkunft und Ablauf. (2) `createCheckout` kommt dazu, statt dass die Upgrade-Seite eine URL öffnet. |
| `src/lib/__tests__/plan.test.ts` | 13 Tests der Zugriffslogik | **Behalten**, erweitern | Bleiben gültig. Neue Tests für die Statusmaschine kommen dazu. |

---

## 3. Abo-Status aus der Cloud

| Datei | Was sie tut | Entscheidung | Begründung |
|---|---|---|---|
| `src/lib/cloud/cloud.ts` → `watchSubscription()` | Liest `customers/{uid}`, prüft `status` gegen `active`/`trialing` und `currentPeriodEnd` | **Refactoren** | Die Prüfung ist im Ansatz richtig (Client liest nur), aber das Datenmodell ist zu dünn: keine Herkunft (Stripe/Apple), kein Umgang mit `past_due`/Kulanzfrist, kein Änderungszeitpunkt. Wird auf das neue Entitlement-Modell umgestellt. |
| `firestore.rules` → `match /customers/{uid}` | Client darf lesen, niemals schreiben; Unterkollektionen für Checkout-Sessions und Abos | **Refactoren** | Regel-Idee bleibt exakt so (nur lesen). Pfad und Felder ändern sich auf `entitlements/{uid}`. Die bestehende Absicherung gegen Selbst-Eintragung ist bereits durch einen Test belegt und bleibt es. |
| `src/lib/__tests__/rules.test.ts` | Belegt u. a., dass niemand sich selbst ein Abo einträgt | **Behalten**, anpassen | Der Test ist eine der wichtigsten Zusicherungen des Systems. Er zieht auf den neuen Pfad um. |

---

## 4. Oberfläche: Kaufabschluss und Kündigung

| Datei | Was sie tut | Entscheidung | Begründung |
|---|---|---|---|
| `src/pages/UpgradePage.tsx` | Preisvergleich, Monats-/Jahresumschalter, Bestell-Button nach § 312j BGB, verlinkt direkt die Checkout-URL | **Refactoren** | Die rechtliche Gestaltung (Button-Beschriftung, Pflichtangaben unmittelbar darüber, Preise inkl. MwSt.) ist geprüft und bleibt. Nur der Klick-Pfad ändert sich: statt `href` auf eine externe URL ein Aufruf von `createCheckout()`. Auf iOS zeigt derselbe Screen dann den StoreKit-Kauf. |
| `src/pages/CancelPage.tsx` | Kündigungsseite ohne Anmeldung nach § 312k BGB | **Behalten** | Gesetzlich vorgeschrieben und korrekt umgesetzt. Ergänzung: Wer über Apple gekauft hat, muss über Apple kündigen — das gehört genannt, sonst läuft der Nutzer ins Leere. |
| `src/components/pro/PaywallModal.tsx` | Sperr-Dialog beim Erreichen eines Limits | **Behalten** | Kennt keine Zahlungsdetails, führt nur auf die Upgrade-Seite. Genau richtig geschnitten. |
| `src/pages/LegalPage.tsx` | Rechtsseite, blendet Abo-Abschnitte nur bei aktiver Monetarisierung ein | **Behalten** | Unverändert korrekt. |

---

## 5. Gesperrte Stellen in der App

Alle folgenden Dateien fragen ausschließlich über `usePro()` an und kennen
**keine** Zahlungsdetails. Das ist bereits der Zielzustand und bleibt so:

| Datei | Art der Prüfung |
|---|---|
| `src/pages/LearnPage.tsx`, `ModulePage.tsx`, `LessonPage.tsx` | `enabled/pro/trialActive` für gesperrte Lektionen |
| `src/pages/TrainerHub.tsx`, `trainers/ScenarioTrainer.tsx`, `trainers/PushFoldTrainer.tsx` | dito |
| `src/pages/ReviewPage.tsx`, `ProInsightsPage.tsx` | dito |
| `src/pages/CoachPage.tsx` | `access('coach')` + `consume()` mit Tageslimit |
| `src/pages/PlayPage.tsx` | `access('play-hands')`, `can('play-coach')` |
| `src/components/Layout.tsx` | Zeigt Pro-Plakette / Testphasen-Hinweis |

**Entscheidung: alle behalten.** Sie sind bereits provider-blind. Der einzige
Eingriff wäre kosmetisch — `enabled/pro/trialActive` ließe sich zu einem
`hasAccess(feature)` zusammenfassen. Das ist eine echte Verbesserung und wird
in Phase 2 mitgenommen, wenn diese Screens ohnehin angefasst werden; jetzt
wäre es Änderung ohne Nutzen und mit Regressionsrisiko.

---

## 6. Was gelöscht wird

**Nichts.** Es gibt keine tote oder doppelte Zahlungslogik im Bestand. Die
einzige Datei, die verschwindet, ist `MONETIZATION_SETUP.md` — und die wird
nicht gelöscht, sondern zu `SETUP_PAYMENTS.md` überführt und dort inhaltlich
korrigiert.

---

## 7. Der eine wirkliche Konstruktionsfehler

Die bestehende Paywall ist **clientseitig nicht durchsetzbar**. Der gesamte
Lerninhalt liegt im JavaScript-Bundle; wer die Prüfung im Browser umgeht, sieht
alles. Das steht bereits ehrlich in `MONETIZATION_SETUP.md` und ändert sich
durch diesen Umbau nur teilweise:

- **Was der Umbau löst:** Der *Status* ist nicht mehr fälschbar. Er kommt aus
  einem Dokument, das ausschließlich ein signaturgeprüfter Webhook schreibt.
- **Was der Umbau nicht löst:** Die *Inhalte* liegen weiterhin im Bundle.

Echte Durchsetzung hieße: Lerninhalte erst nach serverseitiger Prüfung
ausliefern. Das ist machbar, aber ein eigener Umbau (Inhalte aus dem Bundle
lösen, über eine authentifizierte Funktion ausliefern, Offline-Fähigkeit der
PWA neu denken). Bewertung: Für ein 5-€-Abo im Freundes- und Anfängerumfeld
steht der Aufwand nicht im Verhältnis zum Risiko. Festgehalten in
`ENTSCHEIDUNGEN.md`, damit die Entscheidung bewusst und nicht versehentlich
getroffen ist.
