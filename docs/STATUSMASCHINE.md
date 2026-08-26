# Statusmaschine des Abo-Zugangs

Was ein Abo für Zustände annehmen kann, wie Stripe und Apple sie benennen,
und wann Zugang gewährt wird.

Verbindlich umgesetzt in:
- `functions/src/types.ts` — `grantsAccess()`
- `functions/src/entitlement.ts` — `applyEvent()`, `isAllowedTransition()`
- `functions/src/webhooks/map.ts` — die Übersetzung

Jede Zeile dieser Tabelle ist durch einen Test belegt.

---

## 1. Die Zustände

| Zustand | Bedeutung | Zugang? | Warum |
|---|---|:---:|---|
| `active` | bezahlt und gültig | **ja** | — |
| `trialing` | kostenlose Testphase des Anbieters | **ja** | Nicht zu verwechseln mit unserer eigenen 7-Tage-Testphase, die lokal läuft |
| `past_due` | Zahlung fehlgeschlagen, Anbieter versucht es erneut | **ja** | Eine abgelaufene Karte ist ein Verwaltungsproblem. Wer hier sperrt, bestraft zahlungswillige Kunden für ein Bankproblem |
| `grace` | ausdrückliche Kulanzfrist (Apple) | **ja** | Apple räumt sie selbst ein — dagegen zu handeln wäre widersinnig |
| `canceled` | gekündigt, Laufzeit läuft aus | **ja**, bis `currentPeriodEnd` | Wer den Monat bezahlt hat, bekommt den Monat |
| `expired` | Laufzeit abgelaufen | nein | — |
| `refunded` | Geld erstattet | **nein, sofort** | Das Geld ist zurück. Restlaufzeit spielt keine Rolle mehr |
| `revoked` | entzogen (z. B. Familienfreigabe zurückgezogen) | **nein, sofort** | Die Berechtigung ist weg, nicht abgelaufen |

**Zusätzlich gilt immer:** Ist `currentPeriodEnd` bekannt und erreicht, endet
der Zugang — unabhängig vom Status. Der Grenzfall ist festgelegt: genau am
Ablaufzeitpunkt gilt der Zugang als beendet (`<=`, nicht `<`).

---

## 2. Zulässige Übergänge

Bewusst großzügig. Anbieter schicken Zustände auch in unerwarteter
Reihenfolge, und ein zu strenges Modell sperrt dann zahlende Kunden aus.

| Von → Nach | erlaubt? |
|---|---|
| alles → alles | **ja** |
| `refunded` → `active` / `trialing` | ja — ein echter Neukauf, oder eine abgelehnte/zurückgenommene Erstattung |
| `refunded` → alles andere | **nein** |
| `revoked` → `active` / `trialing` | ja |
| `revoked` → alles andere | **nein** |
| gleicher Zustand → gleicher Zustand | ja |

**Warum die Sperre aus `refunded` heraus:** Ein Ereignis, das vor der
Erstattung entstand, kann danach eintreffen — Webhooks kommen nicht in der
Reihenfolge ihrer Entstehung an. Eine verspätete „Laufzeitverlängerung" würde
sonst den Zugang zurückgeben, obwohl das Geld erstattet ist.

---

## 3. Was vor jedem Übergang geprüft wird

In genau dieser Reihenfolge (`applyEvent`):

| # | Prüfung | Bei Verstoß | Warum die Reihenfolge |
|---|---|---|---|
| 1 | Pflichtfelder: Ereignis-Kennung, Nutzer, Zeitstempel | `ignore` | Unbrauchbares wird gar nicht erst als „gesehen" vermerkt |
| 2 | Schon verarbeitet? | `duplicate` | Muss vor allem anderen greifen |
| 3 | Älter als der gespeicherte Stand? | `stale` | Wird als gesehen vermerkt, damit ein Wiederholungsversuch nicht erneut prüft |
| 4 | Übergang zulässig? | `ignore` | — |

---

## 4. Übersetzung Stripe → unser Modell

| Stripe | unser Status | Anmerkung |
|---|---|---|
| `active` | `active` | |
| `trialing` | `trialing` | |
| `past_due` | `past_due` | Stripe versucht weiter einzuziehen |
| `unpaid` | `expired` | **Stripe hat aufgegeben** — nicht dasselbe wie `past_due` |
| `canceled` | `canceled` | |
| `incomplete` | *(kein Wechsel)* | Erstzahlung läuft noch, z. B. 3-D-Secure |
| `incomplete_expired` | `expired` | Der Kauf kam nie zustande |
| `paused` | `expired` | |
| Ereignis `charge.refunded` | `refunded` | |
| alles Übrige | *(ignoriert)* | Rechnungen, Zahlungsmethoden usw. |

**Einheiten:** Stripe rechnet in **Sekunden**, wir in Millisekunden. Ein
übersehener Faktor 1000 setzt jedes Laufzeitende in den Januar 1970 und
sperrt damit jeden Zugang. Durch einen Test abgesichert.

---

## 5. Übersetzung Apple → unser Modell

| notificationType | subtype | unser Status |
|---|---|---|
| `SUBSCRIBED` | — | `active` |
| `DID_RENEW` | — | `active` |
| `OFFER_REDEEMED` | — | `active` |
| `DID_CHANGE_RENEWAL_STATUS` | `AUTO_RENEW_DISABLED` | `canceled` |
| `DID_CHANGE_RENEWAL_STATUS` | `AUTO_RENEW_ENABLED` | `active` |
| `DID_CHANGE_RENEWAL_STATUS` | *(fehlt)* | *(kein Wechsel)* |
| `DID_FAIL_TO_RENEW` | — | `past_due` |
| `DID_FAIL_TO_RENEW` | `GRACE_PERIOD` | `grace` |
| `EXPIRED` | — | `expired` |
| `GRACE_PERIOD_EXPIRED` | — | `expired` |
| `REFUND` | — | `refunded` |
| `REVOKE` | — | `revoked` |
| `REFUND_DECLINED` | — | `active` |
| `REFUND_REVERSED` | — | `active` |
| `TEST`, `CONSUMPTION_REQUEST`, `RENEWAL_EXTENDED` | — | *(kein Wechsel)* |
| alles Übrige | — | *(ignoriert)* |

**Achtung `DID_CHANGE_RENEWAL_STATUS`:** Derselbe Typ bedeutet je nach
Untertyp Gegensätzliches. Wer nur den Typ auswertet, kündigt Kunden, die
gerade ihre Kündigung zurückgenommen haben.

**Einheiten:** Apple rechnet bereits in **Millisekunden** — anders als Stripe.

---

## 6. Zuordnung zum Nutzer

Die Firebase-`uid` kommt **niemals** aus dem Ereignis selbst, sondern
ausschließlich aus einer Zuordnung, die wir beim Anlegen des Kaufs gespeichert
haben:

| Anbieter | Schlüssel |
|---|---|
| Stripe | `customer` (Kunden-Kennung) → uid |
| Apple | `originalTransactionId` → uid |

Ohne Treffer wird das Ereignis verworfen. Andernfalls könnte ein Ereignis
behaupten, für einen fremden Nutzer zu gelten.

---

## 7. Was durch die Signaturprüfung abgefangen wird

Bevor irgendetwas von oben greift:

| Anbieter | Verfahren | Geprüft wird |
|---|---|---|
| Stripe | HMAC-SHA256 über `{t}.{rawBody}` | Signatur passt; Zeitstempel innerhalb ±5 min (**beide** Richtungen) |
| Apple | JWS ES256 mit `x5c`-Kette | Kette lückenlos, Wurzel = fest hinterlegter Fingerabdruck der Apple Root CA G3, kein Zertifikat abgelaufen, Signatur passt, Bundle-ID ist unsere |

Beide Prüfungen sind mit Angriffspfaden getestet: gefälschte Signatur,
manipulierter Rumpf, fremde Wurzel, unterbrochene Kette, fremde App,
wiedereingespielter Aufruf.

---

## 8. Ein Konto, zwei Plattformen

Der Fall, um den es geht: **Jemand kauft in der iOS-App und öffnet danach die
Web-App.** Oder umgekehrt. Beides muss dasselbe Abo sein.

### Der Anker ist das Firebase-Konto, nicht das Gerät

Ein Entitlement steht in `entitlements/{uid}`. Es gibt keinen zweiten
Speicherort und keine gerätegebundene Kopie. Wer sich auf beiden Plattformen
mit demselben Konto anmeldet, sieht dasselbe Abo — ohne dass irgendetwas
„übertragen" werden müsste. Der ganze Aufwand steckt deshalb an genau einer
Stelle: **den Kauf mit einer uid zu verbinden.**

### Web → iOS

Unproblematisch. Beim Stripe-Checkout kennt unsere Function die uid aus dem
mitgeschickten ID-Token und legt die Zuordnung `customer → uid` an. Wer sich
später in der iOS-Hülle mit demselben Konto anmeldet, liest dasselbe Dokument.

### iOS → Web

Hier liegt die Arbeit, weil Apple die uid nicht kennt und nie kennen wird. Der
einzige stabile Schlüssel ist `originalTransactionId` — er bleibt über
Verlängerungen, Plan-Wechsel und Neuinstallationen hinweg gleich.

**Der vorgesehene Ablauf:**

1. Die native Hülle verlangt eine **Anmeldung vor dem Kauf**. Ohne uid kein
   Kauf.
2. Nach erfolgreichem `purchase()` schickt die Hülle
   `originalTransactionId` **zusammen mit dem Firebase-ID-Token** an unsere
   Function.
3. Die Function prüft das Token (nur so ist die uid echt) und schreibt die
   Zuordnung `originalTransactionId → uid`.
4. Ab da laufen alle weiteren Apple-Benachrichtigungen über Abschnitt 6 in
   dasselbe `entitlements/{uid}`.

**Warum Anmeldung vor dem Kauf und nicht danach:** Ein Kauf ohne uid ist ein
Kauf ohne Besitzer. Ihn nachträglich zuzuordnen hieße, dem Gerät zu glauben,
das sich meldet — und genau darauf darf man sich nicht verlassen. Apple
erlaubt eine Anmeldepflicht ausdrücklich, wenn das Abo geräteübergreifend
gilt; das tut es hier.

**Verworfene Alternative:** anonymer Kauf plus späteres Verknüpfen über
„Käufe wiederherstellen". Das ist bequemer, öffnet aber ein Fenster, in dem
ein Kauf herrenlos ist — und wer ihn dann zuerst beansprucht, bekommt ihn.

### Käufe wiederherstellen

Apple schreibt einen sichtbaren Knopf dafür vor; sein Fehlen ist ein
Ablehnungsgrund. Die Brücke hat ihn bereits: `restorePurchases()` in
`StoreKitBridge`. Er löst denselben Ablauf wie Schritt 2–4 aus.

### Wenn zwei Konten denselben Kauf beanspruchen

Das passiert, wenn jemand die App mit Konto A kauft und sich später mit Konto
B anmeldet und wiederherstellt.

**Regel: Die erste Zuordnung gewinnt.** Der zweite Versuch wird abgelehnt und
nicht etwa umgeschrieben. Andernfalls ließe sich ein Abo durch bloßes
Wiederherstellen von Konto zu Konto weiterreichen — und der ursprüngliche
Käufer verlöre still seinen Zugang.

Wer sein Abo wirklich auf ein anderes Konto umziehen will, braucht einen
Menschen. Das ist selten genug, um es von Hand zu machen, und zu gefährlich,
um es zu automatisieren.

### Kündigen ist nicht symmetrisch

| Gekauft über | Kündigung läuft über | Im Code |
|---|---|---|
| Stripe | eigene Kündigungsseite | `cancelRouteFor()` → `'web'` |
| Apple | Einstellungen des Geräts | `cancelRouteFor()` → `'native'` |

Ein über Apple gekauftes Abo kann **niemand außer Apple** beenden — auch wir
nicht. Die App darf das nicht verschweigen, sondern führt zu
`APPLE_MANAGE_SUBSCRIPTIONS_URL`. Das ist keine Bequemlichkeitsfrage, sondern
die einzige Stelle, an der die Kündigung tatsächlich wirkt.
