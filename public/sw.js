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

/* Die Zahl davor bei jeder Strukturänderung erhöhen (siehe Kopf der Datei). */
const CACHE = `pokermentor-v8-${DATEN_STAND}`;
const CORE = ['./', './index.html', './manifest.webmanifest', ...DATEN_DATEIEN];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => {}),
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
        .catch(() => caches.match('./index.html')),
    );
    return;
  }

  // Cache-first für Assets (gehashte Dateinamen)
  event.respondWith(
    caches.match(req).then(
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
