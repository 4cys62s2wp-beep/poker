# Mit Freunden spielen

Es gibt zwei Wege. Der erste funktioniert **sofort**, der zweite braucht einmalig
ein kostenloses Firebase-Projekt.

---

## 1. Tisch auf einem Gerät — läuft ohne alles

**In der App: „Pokerabend"** (`/tisch`)

Legt ein Handy oder Tablet in die Tischmitte. Die App mischt, gibt, führt den Pot,
zieht die Blinds hoch und wertet den Showdown aus. Wer am Zug ist, nimmt das Gerät
kurz auf, sieht **nur seine** Karten und entscheidet — danach wandert es weiter.
Genau so läuft Poker ohnehin, deshalb fällt das Weiterreichen kaum auf.

- **Kein Internet, kein Konto, keine Einrichtung.** Funktioniert im Keller ohne Empfang.
- 2 bis 9 Spieler, freie Startchips und Blinds, optional steigende Blinds fürs Turnier
- Ersetzt Kartendeck **und** Chips — praktisch, wenn im Koffer die Hälfte fehlt
- Die Werte kannst du direkt aus dem [Chip-Rechner](#) übernehmen

Das ist der Modus, den ihr am nächsten Pokerabend einfach benutzen könnt.

---

## 2. Online-Tisch — jeder mit eigenem Handy

**In der App: „Pokerabend" → „Online-Tisch öffnen"** (`/tisch/online`)

Einer eröffnet den Tisch, die anderen **scannen seinen QR-Code** oder tippen den
6-stelligen Code ein. Jeder sieht seine eigenen Karten auf dem eigenen Display,
Board und Pot laufen synchron. Funktioniert am selben Tisch genauso wie über
hunderte Kilometer.

### Warum das Firebase braucht

Die App ist eine reine Web-App ohne eigenen Server. Zwei Browser können nicht
direkt miteinander sprechen — dafür braucht es eine Vermittlungsstelle. Firebase
ist genau das, und im Umfang eines Pokerabends kostenlos.

**Es ist dasselbe Projekt, das du für Konten und Freundesliste ohnehin brauchst.**
Arbeite dafür einmal **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** durch (rund fünf
Minuten), dann veröffentliche die Datei **[`firestore.rules`](firestore.rules)** in
der Firebase-Konsole unter *Firestore Database → Regeln*. Danach sind Online-Tische,
Freundesliste und Geräte-Synchronisation gleichzeitig aktiv.

### Wie es dann abläuft

1. Alle melden sich einmal mit E-Mail an (Bestätigungslink klicken).
2. Einer tippt auf **Tisch eröffnen** → QR-Code erscheint.
3. Die anderen scannen ihn mit der Handy-Kamera — der Link öffnet den Tisch direkt.
4. Alle auf **Bereit**, der Gastgeber gibt die erste Hand.

### Was du über die Karten wissen solltest

Das Gerät des Gastgebers mischt und gibt. Für alle anderen gilt: **Niemand am Tisch
kann deine Karten sehen** — sie liegen in einem Bereich, den nur dein eigenes Konto
lesen darf, und das erzwingen die Sicherheitsregeln. Technisch kennt aber das Gerät
des Gastgebers alle Blätter, weil es ja austeilt.

Unter Freunden ist das exakt dasselbe Vertrauen wie beim Geben am Küchentisch. Für
Spiel um echtes Geld wäre es das nicht — dafür müsste das Austeilen in eine
serverseitige Funktion wandern. Die Architektur ist darauf vorbereitet: Alle
Entscheidungen des Gastgebers sind reine Funktionen in `src/lib/table/protocol.ts`,
sie müssten nur umziehen. Sag Bescheid, wenn du das brauchst.

### Wenn jemand rausfliegt

- Verliert der Gastgeber die Verbindung, übernimmt nach ~20 Sekunden automatisch ein
  anderer Spieler. Eine laufende Hand wird dabei abgebrochen und die Stacks stehen
  wie davor — das Kartendeck lag nur auf dem alten Gerät.
- Reagiert ein Spieler 45 Sekunden nicht, checkt oder foldet die App für ihn, damit
  der Tisch nicht einfriert.
- Ein Neuladen der Seite bringt dich zurück an den Tisch.

---

## 3. Freundesliste

**In der App: „Freunde"** (`/freunde`) — braucht dasselbe Firebase-Projekt.

Jeder hat einen kurzen Freundescode (z. B. `GBRV-7TDX`) zum Weitergeben. Anfragen
lassen sich annehmen oder ablehnen, und in der Seitenleiste zeigt ein grüner Punkt,
wie viele Freunde gerade online sind.

**Datenschutz:** Freunde sehen ausschließlich deinen Anzeigenamen und ob du online
bist. E-Mail-Adressen werden nie an andere Nutzer weitergegeben, und niemand kann
die Freundesliste eines anderen einsehen oder die Nutzerschaft durchblättern.

---

## Was noch offen ist

Ehrlich benannt, damit es keine Überraschungen gibt:

- **Die Sicherheitsregeln sind noch nie gegen ein echtes Firebase gelaufen.** Sie
  sind sorgfältig geschrieben und kommentiert, aber weder kompiliert noch getestet.
  Prüfe sie vor dem ersten echten Spiel einmal mit dem Firebase-Emulator
  (`firebase emulators:exec`) oder beobachte die erste Runde aufmerksam.
- **Kein Rebuy:** Wer alle Chips verloren hat, muss den Tisch verlassen und neu
  beitreten, um wieder Chips zu bekommen.
- **Der Verlauf** („Spieler X setzt 40") wird vom Gerät des Gastgebers geschrieben
  und erscheint deshalb in dessen Sprache. Gewinnerzeile und Handname werden bei
  jedem lokal in seiner eigenen Sprache berechnet.
- **Aufräumen:** Alte Tische bleiben in der Datenbank stehen. Bei eurem Volumen
  völlig unkritisch, aber irgendwann lohnt eine Aufräum-Funktion.
