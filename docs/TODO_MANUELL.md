# Was du selbst prüfen oder entscheiden musst

Priorisiert. Alles hier braucht entweder einen Menschen, ein Konto oder eine
Geschäftsentscheidung — Code allein löst es nicht.

---

## 🔴 Entscheidung, die nur du treffen kannst

### 1. Bleiben die simulierten Pokertische?
**Warum die Frage jetzt kommt:** Die Scope-Korrektur streicht Modus B und die
Multiplayer-Vorbereitung mit der Begründung, dass simulierte Pokertische mit
Spielgeld-Ökonomie die Altersfreigabe hochtreiben — Apple 17+/18+, in
Deutschland § 10b JuSchG bei glücksspielähnlichen Mechanismen.

**Dieselbe Begründung trifft auf drei Dinge zu, die schon gebaut, getestet und
live sind:**

| | Was es ist | Spielgeld-Ökonomie? |
|---|---|:---:|
| Übungstisch | gegen Computergegner, `/lernen/uebungstisch` | nein |
| Pokerabend | Karten und Chips für Menschen am selben Tisch | nein |
| Online-Tisch | dasselbe über mehrere Geräte | nein |

Keines hat ein Guthaben, einen Chipkauf oder einen Verlauf über Sitzungen
hinweg. Sie sind aber **simulierte Pokertische**, und darauf zielt die
Einstufung.

**Was ich getan habe:** nichts entfernt. Gestrichen wurde ausdrücklich die
*Vorbereitung*, nicht der Bestand, und die stehende Regel lautet, dass nichts
Funktionstragendes ohne Ersatz gelöscht wird. Der Übungstisch ist außerdem die
Datenquelle der Spielstil-Analyse — mit ihm fiele auch die weg.

**Was du entscheiden musst:** ob die Reichweiten-Rechnung, die für Modus B
gilt, auch für diese drei gilt. Wenn ja, sag es — dann kommen sie raus, und
die Spielstil-Analyse braucht eine neue Quelle. Details in `ENTSCHEIDUNGEN.md`,
E-010.

---

## 🔴 Blockierend — vor dem ersten Euro Umsatz

### 2. Impressum als Minderjähriger klären
**Warum es dringend ist:** Sobald Geld fließt, greift die
Anbieterkennzeichnung nach § 5 DDG. Als Minderjähriger ist die Rechtslage
nicht trivial — Verträge sind schwebend unwirksam, und die Frage, wer
Anbieter ist, muss beantwortet sein, bevor jemand zahlt.

**Was zu tun ist:** Einmal fachlich prüfen lassen (Verbraucherzentrale,
IHK-Gründungsberatung oder Anwalt). Nicht selbst zusammenreimen.

**Bis dahin:** Die Monetarisierung bleibt aus. Genau so ist sie eingestellt.

### 3. ~~Apple Root CA gegenprüfen~~ — erledigt, anders als gedacht
Die Konstante `APPLE_ROOT_CA_G3_SHA256` gibt es nicht mehr. Sie stand im
Quelltext, trug die gesamte Apple-Prüfung und war nie gegen das echte
Zertifikat gehalten worden — ein Wert, der nach Sicherheit aussieht, ohne
welche zu sein.

Die Prüfung selbst ist vollständig geblieben. Der Fingerabdruck ist jetzt ein
**Pflichtargument** und kommt als Geheimnis `APPLE_ROOT_CA_SHA256` aus der
Umgebung. Wer den Weg wieder in Betrieb nimmt, bildet ihn selbst:

```
openssl x509 -in AppleRootCA-G3.cer -inform DER -fingerprint -sha256 -noout
```

Fehlt das Geheimnis, nimmt der Webhook nichts an. Lieber keine Zahlung als
eine, deren Herkunft niemand geprüft hat. Begründung in ENTSCHEIDUNGEN.md,
E-021.

### 4. Budget-Alarm bei Google Cloud
**Wann:** Unmittelbar nach der Umstellung auf Blaze, nicht danach.

**Warum:** Blaze rechnet nach Nutzung ab. Eine Endlosschleife in einer
Funktion kostet echtes Geld, und es merkt niemand, bis die Rechnung kommt.

**Wo:** <https://console.cloud.google.com/billing/budgets> — ein Alarm bei
5 € genügt für den Anfang.

---

## 🟠 Wichtig — vor dem ersten iOS-Build

### 5. Zahlungs-Texte für iOS trennen
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

### 6. Google-Anmeldung einmal auf dem echten Gerät ausprobieren
**Warum:** Die Sicherheitsrichtlinie blockierte bis heute das Hilfsskript, das
Firebase für die Anmeldung lädt — die Anmeldung hätte still nichts getan. Der
Fehler ist behoben und durch 11 Tests gegen Wiederkehr gesichert
(`src/lib/csp.ts`), aber gegen die **echten** Google-Server ist er nie gelaufen:
Diese Umgebung erreicht `apis.google.com` nicht.

**Was zu tun ist:** Auf dem iPhone die Seite öffnen, Profil → „Mit Google
anmelden". Erwartet wird ein Popup. Passiert nichts, in Safari unter
Einstellungen → Erweitert → Web-Inspektor die Konsole ansehen — dort steht
dann, welche Quelle fehlt.

**Falls das Popup blockiert wird:** Die App fällt automatisch auf eine
Weiterleitung zurück. Voraussetzung ist, dass die Domain in der Firebase-
Konsole unter Authentication → Einstellungen → Autorisierte Domains steht —
das ist bereits erledigt.

### 7. „Sign in with Apple" einbauen
**Warum:** Apples Regel 4.8 verlangt es, sobald eine Drittanbieter-Anmeldung
angeboten wird. Google-Anmeldung ist eingebaut — die Pflicht besteht also.

**Voraussetzung:** Apple-Developer-Account.

### 8. Preisentscheidung iOS vs. Web
**Die Zahlen** stehen in `SETUP_PAYMENTS.md`, Abschnitt 1. Kurz: Bei 4,99 €
bleiben über Stripe ~3,88 €, über Apple 3,56 € (15 %) oder 2,93 € (30 %).

**Das ist keine technische Frage.** Gleicher Preis überall ist einfach und
ehrlich, kostet aber Marge. Höherer iOS-Preis ist erlaubt, aber
begründungsbedürftig, sobald jemand beides sieht.

**Meine Empfehlung für den Start:** gleicher Preis. Preisunterschiede
zwischen Plattformen verärgern Nutzer mehr, als sie einbringen.

### 9. Small Business Program beantragen
15 % statt 30 % — aber nur, wenn man sich **aktiv anmeldet**. Passiert nicht
von selbst. Erste Handlung nach Erhalt des Developer-Accounts.

---

## 🟡 Lohnend — wenn Zeit ist

### 10. Testphase serverseitig führen
**Stand:** Der Beginn der Testphase liegt lokal und ist gegen einfaches
Zurücksetzen abgesichert (`src/lib/pro/trialAnchor.ts`, 8 Tests). Wer den
kompletten Browser-Speicher löscht, bekommt eine neue Testphase — verliert
dabei aber allen Lernfortschritt.

**Für ein 5-€-Abo ist diese Hürde angemessen.** Wer später mehr verlangt,
sollte den Beginn beim ersten Anmelden serverseitig festschreiben. Dafür
müssen die Cloud Functions laufen.

### 11. Off-Scale-Abstände bildschirmweise angleichen
**Umfang:** ~110 Werte, die nicht auf dem 4er-Raster liegen (5, 7, 11, 13,
15 px). Vollständige Liste in `docs/TOKEN_AUDIT.md`, Abschnitt 3.

**Warum nicht automatisch:** Ein `7px` in 8 px zu ändern ist eine optische
Änderung, kein Refactoring. 110 davon auf einmal, ohne Sichtprüfung,
verschieben das Bild leise in eine Richtung, die niemand beabsichtigt hat.

**Vorgehen:** Bildschirm für Bildschirm, mit Vorher-Nachher-Vergleich.

### 12. Spielstil-Analyse am Online-Tisch
**Stand:** Nur der Übungstisch wird ausgewertet. Der Pokerabend-Tisch nicht
(mehrere Menschen an einem Gerät — nicht zuordenbar), der Online-Tisch auch
nicht (dort geht nur ein Zug-*Wunsch* an den Gastgeber, der abgelehnt werden
kann).

**Machbar wäre es**, wenn der Gastgeber die tatsächlich angewandten Züge
zurückmeldet. Aufwand mittel, Nutzen ebenfalls.

### 13. ~~Freunde-Rangliste~~ — gestrichen
Der Eintrag stammt aus dem Mehrspieler-Paket, das wegen der Altersfreigabe
entfernt wurde. Ranglisten setzen außerdem eine Nutzermasse voraus, die es
nicht gibt: Eine Rangliste unter drei Leuten ist keine.

Er bleibt als durchgestrichene Zeile stehen, damit er nicht in einem halben
Jahr als „gute Idee" wieder auftaucht. Begründung in ENTSCHEIDUNGEN.md,
E-022.

---

## 🟢 Zum Nachlesen

### 14. Was der Abo-Schutz leistet — und was nicht
**Geschützt:** Der Abo-*Status*. Er kommt aus `entitlements/{uid}` und darf
laut `firestore.rules` nur der Server schreiben. Durch Tests gegen den
Emulator belegt, und im Browser gegengeprüft: Weder eine direkte Adresse noch
manipulierter Browser-Speicher öffnen Pro-Inhalte.

**Nicht geschützt:** Die Lern-*Inhalte*. Sie liegen als JavaScript im Browser.
Wer die Entwicklerwerkzeuge öffnet, kommt an die Texte.

Das ist eine bewusste Abwägung (`ENTSCHEIDUNGEN.md`, E-003), kein Versehen.
Wer später hochpreisige Inhalte verkauft, muss sie neu treffen.

### 15. Wo was steht

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
