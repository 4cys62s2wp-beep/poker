# Blocker

Was die Arbeit aufhält, warum, und welche Wege es gibt. Kein Blocker hält die
Session an — die Arbeit geht am nächsten unabhängigen Paket weiter.

---

## B-001 · offen · Phase 1

### Cloud Functions lassen sich nicht deployen (Blaze-Tarif fehlt)

**Was:** Der serverseitige Entitlement-Service und die Webhook-Endpunkte
brauchen Firebase Cloud Functions. Das Projekt `pokermentor-9ac7f` läuft auf
dem Spark-Tarif (kostenlos). Functions verlangen **Blaze** — ein
Abrechnungskonto bei Google Cloud mit hinterlegtem Zahlungsmittel.

**Warum das gerade nicht geht:** Ein Google-Cloud-Abrechnungskonto setzt
Volljährigkeit und ein eigenes Zahlungsmittel voraus. Beides ist nach eigener
Angabe erst ab Oktober 2026 gegeben.

**Was trotzdem geht — und deshalb gemacht wird:**
- Der vollständige Funktionscode entsteht unter `functions/`.
- Er wird gegen den **Firebase-Emulator** getestet. Der läuft lokal, kostenlos,
  ohne jedes Konto, und führt dieselben Regeln und Funktionen aus.
- Signaturprüfung, Idempotenz und Statusmaschine sind damit heute
  nachweisbar korrekt, nicht nur behauptet.

**Was nicht geht:** Ein echter Webhook von Stripe oder Apple erreicht die
Funktion nicht, solange sie nicht deployt ist. Der Weg „Stripe schickt
Ereignis → Status ändert sich" ist erst ab Oktober vollständig prüfbar.

**Wege, falls es früher gebraucht wird:**
1. **Warten bis Oktober.** Kostet nichts, ändert am Code nichts. Empfohlen —
   solange keine zahlenden Nutzer da sind, fehlt nichts.
2. **Blaze über einen Erziehungsberechtigten.** Das Konto läuft dann auf
   dessen Namen; bei einem Produkt, das später Umsätze erzielt, will das
   sauber geregelt sein (auch steuerlich). Nicht nebenbei entscheiden.
3. **Anderer Anbieter für die Funktionen** (Vercel, Cloudflare Workers,
   Netlify Functions — jeweils mit kostenloser Stufe ohne Kreditkarte). Würde
   heute funktionieren, führt aber einen zweiten Anbieter mit eigener
   Authentifizierung ein. Siehe `ENTSCHEIDUNGEN.md`, E-001.

**Auswirkung auf die App heute:** Keine. Ohne `monetization.json` ist die
Monetarisierung aus, die App ist vollständig gratis nutzbar — genau der
aktuelle Zustand.

---

## B-002 · offen · Phase 1

### Apple-Weg ist ohne Developer-Account nur als Gerüst baubar

**Was:** `StoreKitProvider` kann heute nicht mehr sein als eine klar
gekennzeichnete Hülle. Für die echte Anbindung fehlen: Apple-Developer-Account
(99 $/Jahr), App-Store-Connect-Zugang zum Anlegen der Abo-Produkte, der
Signaturschlüssel für App Store Server Notifications V2, und eine native
iOS-Hülle, die StoreKit überhaupt aufrufen kann — eine PWA kann das nicht.

**Was trotzdem geht:**
- Die Schnittstelle steht vollständig, mit denselben Methoden wie Stripe.
- Die serverseitige Prüfung der Apple-Benachrichtigungen (JWS gegen Apple Root
  CA) wird gebaut und mit selbst erzeugten Testschlüsseln geprüft. Die Logik
  ist damit korrekt, nur die echten Apple-Schlüssel fehlen.
- Alle Stellen, an denen später echte Werte einzusetzen sind, sind mit `TODO
  (Apple)` markiert und in `SETUP_PAYMENTS.md` aufgelistet.

**Reihenfolge, wenn die Konten da sind:** steht in `SETUP_PAYMENTS.md`.
