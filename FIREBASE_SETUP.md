# Cloud-Konten aktivieren (ca. 5 Minuten)

PokerMentor funktioniert komplett ohne Server: Profile und Fortschritt werden doppelt auf dem
Gerät gesichert (localStorage + IndexedDB). Wenn du zusätzlich **echte Konten mit E-Mail-Verifizierung
und geräteübergreifender Synchronisation** willst, brauchst du ein kostenloses Firebase-Projekt.
Das kann nur der Betreiber der Seite anlegen (Google-Konto nötig) – so geht's:

## 1. Firebase-Projekt anlegen

1. Öffne <https://console.firebase.google.com> und melde dich mit deinem Google-Konto an.
2. **Projekt hinzufügen** → Name z. B. `pokermentor` → Google Analytics kannst du **deaktivieren**.

## 2. Web-App registrieren

1. Auf der Projektübersicht das **`</>`-Symbol** (Web) anklicken.
2. Name z. B. `PokerMentor Web`, **kein** Hosting nötig → **App registrieren**.
3. Firebase zeigt dir ein `firebaseConfig`-Objekt. Kopiere die Werte in eine neue Datei
   `public/firebase-config.json` (Vorlage: `public/firebase-config.example.json`):

```json
{
  "apiKey": "AIza…",
  "authDomain": "pokermentor-xxxxx.firebaseapp.com",
  "projectId": "pokermentor-xxxxx",
  "storageBucket": "pokermentor-xxxxx.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abcdef"
}
```

> Diese Werte sind **keine Geheimnisse** – sie identifizieren nur dein Projekt und dürfen im
> Repository liegen. Die Sicherheit kommt aus den Firestore-Regeln (Schritt 4) und der
> Domain-Freigabe (Schritt 5).

## 3. Anmeldung einschalten

1. In der Firebase-Konsole: **Sicherheit → Authentication → Los geht's**.
2. Anmeldemethode **E-Mail/Passwort** aktivieren (nur die erste Option, ohne „E-Mail-Link“).
3. Optional zusätzlich **Google** aktivieren (ein Klick, Support-E-Mail auswählen, Speichern –
   kein weiteres Konto oder Kosten nötig). Die App zeigt den Google-Button dann automatisch;
   ohne aktivierten Google-Provider bleibt er sichtbar, meldet beim Klick aber nur einen
   verständlichen Fehler statt etwas kaputt zu machen.

### „Mit Apple anmelden“ – bewusst nicht enthalten

Technisch vorbereitet (Firebase unterstützt es), aber **nicht eingebaut**, weil es zusätzlich zum
Firebase-Projekt einen **kostenpflichtigen Apple-Developer-Account** (99 $/Jahr) und eine eigene
Einrichtung im Apple-Entwicklerportal braucht (Services-ID, Rückgabe-URL, privater Schlüssel) –
Dinge, die nur du als Kontoinhaber anlegen kannst. Sag Bescheid, sobald du den Account hast (z. B.
wenn die App in Richtung App Store geht – dort verlangt Apples Regel 4.8 „Sign in with Apple“
ohnehin, sobald Google-Anmeldung angeboten wird), dann bauen wir es mit deinen Werten ein.

## 4. Firestore-Datenbank + Sicherheitsregeln

1. **Build → Firestore Database → Datenbank erstellen** → Modus egal (wir ersetzen die Regeln
   gleich), Region z. B. `europe-west3` (Frankfurt).
2. Reiter **Regeln**: kompletten Inhalt durch die Datei [`firestore.rules`](./firestore.rules)
   aus diesem Repository ersetzen → **Veröffentlichen**.

Die Regeln erzwingen: Jeder Nutzer kann **nur sein eigenes** Dokument lesen/schreiben, und nur
mit **bestätigter E-Mail-Adresse**. Alles andere ist gesperrt.

Das ist nicht nur behauptet: `npm run test:rules` fährt den Firestore-Emulator hoch und prüft die
Regeln mit 26 Tests – unter anderem, dass niemand fremde Lernstände liest, sich niemand selbst ein
Abo einträgt und kein Mitspieler die Handkarten eines anderen abrufen kann. Braucht Java, sonst
nichts.

## 5. Domain freigeben

**Authentication → Settings → Autorisierte Domains**: `localhost` ist schon drin, füge deine
GitHub-Pages-Domain hinzu, z. B. `4cys62s2wp-beep.github.io`.

## 6. Deployen

```bash
git add public/firebase-config.json
git commit -m "Cloud-Konten aktivieren"
git push
```

GitHub Actions baut und veröffentlicht die Seite automatisch. Sobald die Datei online liegt,
zeigt die Profilseite statt des Geräte-Modus-Hinweises die Anmeldung an: Konto erstellen →
Bestätigungs-E-Mail anklicken → fertig. Der Fortschritt synchronisiert ab dann automatisch
(beim Lernen im Hintergrund, zusätzlich beim Verlassen der Seite).

## Wie die Synchronisation funktioniert

- Jedes Konto hat genau ein Dokument `users/{uid}` mit dem kompletten Lernstand als JSON.
- Beim Login wird der Cloud-Stand mit dem lokalen Stand verglichen – **der Stand mit mehr XP
  gewinnt**, Lernfortschritt geht also nie verloren.
- Alle aus der Cloud geladenen Daten laufen durch dieselbe Validierung wie Backup-Importe
  (`sanitizeAppData`) – manipulierte Daten können die App nicht beschädigen.
- Ohne Internet arbeitet die App normal weiter; die lokale Doppelsicherung bleibt immer aktiv.
