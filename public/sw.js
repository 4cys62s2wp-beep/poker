/* PokerMentor Service Worker: Offline-Unterstützung.

   CACHE-Version bei jeder Strukturänderung erhöhen: Beim Aktivieren werden
   alle anderen Versionen gelöscht. In v6 hat sich die gesamte Navigation
   geändert (Hub → Bereich → Detail), in v7 die Gliederung erneut
   (Lernen · Nachschlagen · Live-Session) – ein alter Zwischenspeicher hätte
   Nutzern beim ersten Start noch die alte Startseite gezeigt.
   Strategie: Navigation network-first (Fallback Cache), Assets cache-first. */

/* ── Von `npm run daten` gesetzt – nicht von Hand ändern ─────────────────
   Warum der Datenstand im Cache-Namen steht: Die gerechneten Zahlen werden
   mitgespeichert, damit der Drill ohne Netz läuft. Wären sie unter demselben
   Cache-Namen abgelegt, würde ein Gerät nach neuen Zahlen wochenlang die
   alten zeigen, ohne dass es jemandem auffällt. Ein neuer Datenstand ergibt
   einen neuen Cache-Namen, und der alte wird beim Aktivieren gelöscht. */
const DATEN_STAND = '2026-08-26T22-59-59-00-00';
const DATEN_DATEIEN = ['./pokermath/b1_outs.json', './pokermath/b2_potodds.json', './pokermath/b3_kombinatorik.json', './pokermath/b4_preflop_equity.json', './pokermath/b4_preflop_equity.bin'];
/* ── Ende des erzeugten Bereichs ──────────────────────────────────────── */

/* ── Von `npm run build` gesetzt – nicht von Hand ändern ─────────────────
   Die gebauten Dateien tragen einen Namen mit Streuwert, den erst der Build
   kennt. Ohne diese Liste legte der Worker nur ab, was jemand **tatsächlich
   abgerufen** hatte: nach zwei Besuchen zwölf Dateien — Hülle, Daten,
   Skript, Stilblatt und zwei Schriftschnitte. Die englischen Lerninhalte
   liegen in einem eigenen Paket und wurden nie geholt; wer offline auf
   Englisch umschaltete, bekam keine Lektionen. Dasselbe galt für die
   Schriftschnitte, die auf der Startseite nicht vorkommen (E-071). */
const GEBAUTE_DATEIEN = [];
const BAU_STAND = 'entwicklung';
/* ── Ende des erzeugten Bereichs ──────────────────────────────────────── */

/* Die Zahl davor bei jeder Strukturänderung erhöhen (siehe Kopf der Datei).
   Der Baustand gehört in den Namen: Ein neuer Build bringt neue Dateinamen,
   und der alte Zwischenspeicher wird beim Aktivieren gelöscht. */
const CACHE = `pokermentor-v9-${DATEN_STAND}-${BAU_STAND}`;
const CORE = ['./', './index.html', './manifest.webmanifest', ...DATEN_DATEIEN, ...GEBAUTE_DATEIEN];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      /* Einzeln statt `addAll`: Das scheitert vollständig, sobald eine
         einzige Datei nicht kommt — und dann läge gar nichts bereit. */
      Promise.allSettled(CORE.map((pfad) => cache.add(pfad))),
    ).catch(() => {}),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // Konfigurationsdateien nie cachen: Sie entscheiden live über Konten,
  // Preise und Anbieterangaben – ein veralteter Stand wäre hier fatal.
  if (/\/(firebase-config|monetization|legal)\.json$/.test(url.pathname)) return;

  if (req.mode === 'navigate') {
    // Network-first für die Seite selbst
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreVary: true })),
    );
    return;
  }

  /* Cache-first für Assets (gehashte Dateinamen).

     `ignoreVary` ist hier kein Feinschliff, sondern der Kern: Der Server
     schickt `Vary: Origin` (Vite ebenso wie GitHub Pages), und die Seite
     fordert Skript und Stilblatt als `<script type="module" crossorigin>`
     an — also **mit** `Origin`-Kopf. Abgelegt hat der Worker sie beim
     Installieren mit seiner eigenen Anfrage, die **keinen** hat. Ohne
     `ignoreVary` vergleicht `caches.match` die Köpfe, findet nichts und
     geht ins Netz — und ohne Netz bleibt der Bildschirm leer. Genau das
     war der Fehler, den keine Messung sah (E-072).

     Der Dateiname trägt einen Streuwert; die Adresse allein ist damit ein
     eindeutiger Schlüssel. Genau dafür gibt es `ignoreVary`. */
  event.respondWith(
    caches.match(req, { ignoreVary: true }).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        }),
    ),
  );
});
