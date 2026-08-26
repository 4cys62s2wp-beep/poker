# Sitzungsbericht

**Branch:** `feature/payments-und-hub` · abgezweigt von
`claude/poker-learning-app-concept-ml0xm6` @ `eb7899b`

Drei Arbeitspakete, strikt nacheinander. Alle drei abgeschlossen.

---

## Was gebaut wurde

| Commit | Phase | Inhalt |
|---|---|---|
| `7598f54` | 1.1 | Bestandsaufnahme, Betriebsdateien, Schlüsselprüfung der Historie |
| `a5f75da` | 1.2 | Provider-Abstraktion: Vertrag, Mock, Stripe, StoreKit-Gerüst |
| `93bb97c` | 1.3 | Entitlement-Statusmaschine, Firestore-Regeln umgezogen |
| `3624b84` | 1.4 | Apple-Signaturprüfung, Ereignis-Übersetzung, Firebase-Adapter |
| `17bd681` | 1.5/1.6 | Secrets, `SETUP_PAYMENTS.md`, Checkout ohne URL im Bundle |
| `5ccd621` | 2 | Hub-Screen, Bereichsstruktur, Design-Tokens, Spielstil-Analyse |
| `62b5357` | 3 | Qualitätsdurchlauf |

**376 Tests grün** (davon 29 Firestore-Regeltests gegen den Emulator),
Typecheck sauber, Build sauber, 0 Schwachstellen.

---

## Phase 1 — Zahlungen

### Der Kern: zwei Wege, ein Berechtigungsmodell

App-Store-Richtlinie 3.1.1 lässt keine Wahl: Digitale Inhalte, die in der
iOS-App freigeschaltet werden, müssen über StoreKit laufen. Also Stripe fürs
Web, StoreKit für iOS — aber **ein** Entitlement, das entscheidet.

Der Client kennt keinen Anbieter. Er ruft `startCheckout(plan)` und bekommt
entweder eine Weiterleitung oder einen nativen Dialog. Welchen, erfährt er
nicht.

### Was am gefährlichsten war und deshalb am gründlichsten getestet ist

Die Statusmaschine (`functions/src/entitlement.ts`) ist frei von Firebase,
Stripe und Apple — nur Rechnung. Drei Fälle, die ohne sie schiefgingen:

1. **Doppelzustellung.** Anbieter stellen bei Zeitüberschreitung erneut zu.
   Ohne Idempotenz überschreibt ein wiederholtes „aktiv" eine spätere
   Erstattung — der Nutzer behält den Zugang trotz zurückgezahltem Geld.
2. **Falsche Reihenfolge.** Webhooks kommen nicht in der Reihenfolge an, in
   der sie entstanden. Ein spätes „gekündigt" darf ein neueres „wieder aktiv"
   nicht überschreiben, sonst steht ein zahlender Kunde vor der Tür.
3. **Rückabwicklung.** Aus `refunded` führt nur ein echter Neukauf heraus.
   Sonst gäbe eine verspätete Laufzeitverlängerung, die *vor* der Erstattung
   entstand, den Zugang zurück.

### Ein Fehler, den ich in meinem eigenen Code gefunden habe

`createPublicKey()` auf einen bereits öffentlichen Schlüssel anzuwenden
**wirft** — und der Wurf landete in meinem `catch` und sah aus wie eine
falsche Signatur. Jede gültige Apple-Benachrichtigung wäre abgelehnt worden,
und der Fehler hätte wie ein Angriff ausgesehen.

Gefunden, weil ich Tests für den **Erfolgsfall** geschrieben habe, nicht nur
für die Ablehnungen. Ein Test, der nur prüft, dass Falsches abgewiesen wird,
ist auch dann grün, wenn schlicht alles abgewiesen wird.

---

## Phase 2 — Struktur und Gestaltung

### Die Referenz-App: was übernommen wurde und was nicht

Ausgewertet wurde **Offsuit** (`offsuit.app`). Analyse in
`docs/DESIGN_REFERENZ.md` als acht Prinzipien.

**Der zentrale Befund:** Offsuits Gestaltung ist brillant für *Offsuits* Ziel
— eine Spielgeld-App mit Casino-Schleife (Truhen für Edelsteine, Chip-Pakete
für 5,99 €, Buy-in-Stufen). Übernommen wurde, was unabhängig vom Ziel gut ist:
Reduktion, Rhythmus, unterscheidbare Karten, ehrliche Leerzustände.

**Nicht übernommen:** die Schleife selbst — sie widerspräche dem eigenen Modul
über verantwortungsvolles Spielen, das genau deshalb dauerhaft gratis bleibt.
Ebenso wenig der visuelle Stil (schwarz mit Pastell ist der Standard-Look
dieses Jahrgangs), 3D-Emoji, Navigation ohne Beschriftung, globale Rangliste.

**Wo die Referenz versagt und wir es besser machen:** Sie zeigt „VPIP 33 %"
bei neun Händen. Für eine Spiel-App eine Lässlichkeit; für eine **Lern-App**
das Gegenteil von Lehren — sie brächte Nutzern bei, aus Zufallszahlen
Schlüsse zu ziehen. Unsere Kennzahlen tragen ihren Nenner sichtbar mit sich
und sagen ausdrücklich, ab wann sie etwas bedeuten.

### Der Hub

Drei Karten mit je eigener Akzentfarbe und Bildzeichen, ein vierter Platz für
„Mit Freunden spielen" sichtbar vorgesehen. Streak, Level und XP in einer
schmalen Kopfzeile. **Ein** Quick Access statt fünf — wer fünf Dinge
gleichzeitig angeboten bekommt, tut oft keins davon.

Erstnutzer sehen erklärende Untertitel statt „0 von 49 Lektionen", was einem
Neuling nichts sagt.

### Die alte Gliederung war nach Art benannt, nicht nach Absicht

Unter „Anwenden" lagen Live-Coach, Übungstisch, Pokerabend und Rechner
nebeneinander — vier grundverschiedene Situationen. Die neue Bereichsseite
`/live` beantwortet für jedes die Frage, die die Namen nicht beantworten:
*Wann brauche ich das?*

Untere Leiste von 5 auf 4 Punkte, **mit** Beschriftung. Drei ohne Beschriftung
wie bei der Referenz funktionieren nur, wenn alle Ziele konventionell sind —
ein Symbol für „Live-Coach" ist ohne Wort nicht erratbar.

### Drei eigene Fehler dabei gefunden

- Der Statistik-Kopf zeigte „Dein Spielstil" **dreimal** (Rückweg,
  Bereichszeile, Überschrift)
- Die Platzhalter-Karte trug ein **Häkchen** — das bedeutet „erledigt", bei
  einem Platzhalter das Gegenteil der Wahrheit
- Die Markierung im Spielstil-Diagramm wurde bei Extremwerten am Rand
  **angeschnitten** — also genau im interessantesten Fall

---

## Phase 3 — Qualitätsdurchlauf

### Token-Audit

| | vorher | nachher |
|---|---:|---:|
| Tokens | 42 | **107** |
| Farbwerte mit **mehr als einer** Verwendung | 26 | **0** |

63 Farbwerte und 39 Abstände umgestellt. Die verbleibenden 68 Farbwerte
kommen je genau **einmal** vor — für jeden einen Token anzulegen ergäbe 68
Namen mit je einer Verwendung, was schlechter wäre als das Problem.

**Was ich bewusst nicht gemacht habe:** die ~110 Abstände, die nicht auf dem
4er-Raster liegen (5, 7, 11, 13, 15 px), automatisch runden. Ein `7px` in
8 px zu ändern ist eine **optische Änderung**, kein Refactoring. 110 davon auf
einmal, ohne dass ein Mensch sie sieht, verschieben das Bild leise. Die volle
Liste steht in `docs/TOKEN_AUDIT.md`.

### Gating-Test

Mit **aktiver** Monetarisierung und abgelaufener Testphase im echten Browser:

- Fünf Pro-Seiten über die **direkte Adresse**: alle gesperrt
- **Manipulierter Browser-Speicher** (`pro: true`, gefälschtes Entitlement,
  eigene Schlüssel): weiterhin gesperrt

**Eine echte Lücke gefunden und geschlossen:** Die Testphase ließ sich durch
Zurücksetzen von `trialStartedAt` beliebig oft neu starten. Jetzt hält ein
getrennt abgelegter Anker den frühesten je gesehenen Beginn fest; der frühere
Wert gewinnt (`src/lib/pro/trialAnchor.ts`, 8 Tests). Nach dem Fix meldet der
Test: „Testphase durch lokalen Eingriff reaktivierbar: **nein**".

Wer den gesamten Speicher löscht, bekommt eine neue Testphase — und verliert
dabei allen Lernfortschritt. Für ein 5-€-Abo ist das eine angemessene Hürde.

### Der schwerste Fund der Sitzung: die Google-Anmeldung wäre nie gelaufen

Die Konsolenprüfung über alle 33 Bildschirme meldete auf dem Profil einen
CSP-Verstoß: `script-src 'self'` blockierte
`https://apis.google.com/js/api.js`. Genau dieses Skript lädt Firebase für
Popup und Weiterleitung — **die gerade erst eingerichtete Google-Anmeldung
hätte auf dem echten Gerät nie funktioniert.**

Das ist die unangenehmste Sorte Fehler: Er zeigt sich nicht als Absturz,
sondern als eine Anmeldung, die einfach nichts tut, plus einer Konsolenzeile,
die niemand sieht. Kein Test hätte ihn gefunden, weil kein Test die
Sicherheitsrichtlinie gegen die Anmeldung gehalten hat.

**Behoben und gegen Wiederkehr gesichert:** Die Richtlinie steht jetzt in
`src/lib/csp.ts`, wird zur Bauzeit mit der Anmelde-Domain aus
`public/firebase-config.json` zusammengesetzt und hat **11 eigene Tests** —
darunter einer, der einen Hostnamen mit Semikolon abweist, weil der sonst
eine zweite, selbst gewählte Direktive in die Richtlinie schreiben könnte.

### Zwei 404 bei jedem Seitenaufruf

`monetization.json` und `legal.json` waren als *fehlende* Dateien gedacht —
fehlt die Datei, ist das Feature aus. Das funktionierte, erzeugte aber bei
jedem Start zwei rote Zeilen in der Konsole. Eine Konsole, in der immer Rot
steht, wird nicht mehr gelesen.

Beide werden jetzt ausgeliefert: ausdrücklich ausgeschaltet bzw. als leere
Vorlage. Die Prüfroutinen bleiben unverändert streng — `enabled: true` wirkt
weiterhin nur mit gültiger `https`-Adresse, ein halbes Impressum zählt
weiterhin als keines.

### Erreichbarkeit

Alle 30 Bildschirme, **im Browser geklickt statt am Quelltext gelesen**.
Maximale Tiefe 3, jeder Rückweg vorhanden, alle 10 alten Pfade leiten korrekt
weiter. Tabelle in `docs/ERREICHBARKEIT.md`.

### PWA

Manifest vollständig, alle Icons vorhanden (inkl. maskable), iPhone-Meta-Tags
gesetzt, Safe Areas mit Rückfallwerten gelöst (98 px Freiraum bei 64 px
Leiste). Service Worker aktiv, **offline nachweislich lauffähig**.
Cache-Version auf v6 erhöht, damit niemand beim ersten Start noch die alte
Startseite sieht.

### Toter Code

`src/pages/Dashboard.tsx` und `src/i18n/pages/dashboard.ts` entfernt — durch
den Hub ersetzt. Alle anderen Verdachtsfälle (Verzeichnis-Importe, Worker,
Schriften) einzeln gegengeprüft und in Benutzung. Keine ungenutzten
Abhängigkeiten.

---

## Was du prüfen oder entscheiden musst

Vollständig und priorisiert in **`docs/TODO_MANUELL.md`**. Die drei
blockierenden Punkte:

1. **Impressum als Minderjähriger klären** — fachlich prüfen lassen, bevor
   Geld fließt
2. **Apple Root CA gegenprüfen** — der hinterlegte Fingerabdruck ist der Kern
   der Apple-Prüfung und wurde nie gegen das echte Zertifikat verglichen
3. **Budget-Alarm bei Google Cloud** — unmittelbar nach der Blaze-Umstellung,
   nicht danach

---

## Was nicht geht und warum

| | Grund |
|---|---|
| Cloud Functions sind nicht deployt | Blaze-Tarif verlangt ein Abrechnungskonto (`BLOCKER.md` B-001). Der Code ist vollständig und gegen den Emulator geprüft |
| Apple-Weg ist nur ein Gerüst | Kein Developer-Account, und eine PWA kann StoreKit grundsätzlich nicht aufrufen (B-002) |
| Zahlungs-Texte stimmen für iOS nicht | `O-5` in `STATUS.md`. Nicht gelöst, weil die iOS-Hülle nicht existiert und eine Verzweigung sonst ungetestet bliebe |
| Paywall schützt den Status, nicht die Inhalte | Bewusste Abwägung, `ENTSCHEIDUNGEN.md` E-003 |

---

## Prüfskripte

Alle Prüfungen dieser Sitzung sind wiederholbar. Sie brauchen nur den
gebauten `dist/`-Ordner und Chromium:

```bash
npm run build        # Voraussetzung für alles Weitere
npm test             # 376 Unit-Tests
npm run test:rules   # 29 Firestore-Regeltests (braucht Java)
npx tsc --noEmit     # Typecheck inkl. functions/src
npm audit            # Abhängigkeiten
```

Die Browser-Skripte (Hub-Durchlauf, Gating, PWA) liegen im
Sitzungs-Arbeitsverzeichnis. Sie starten einen kleinen Server auf `dist/` und
fahren Chromium mit `executablePath: '/opt/pw-browsers/chromium'`.
