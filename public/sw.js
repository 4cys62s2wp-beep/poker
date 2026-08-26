/* PokerMentor Service Worker: Offline-Unterstützung.

   CACHE-Version bei jeder Strukturänderung erhöhen: Beim Aktivieren werden
   alle anderen Versionen gelöscht. In v6 hat sich die gesamte Navigation
   geändert (Hub → Bereich → Detail), in v7 die Gliederung erneut
   (Lernen · Nachschlagen · Live-Session) – ein alter Zwischenspeicher hätte
   Nutzern beim ersten Start noch die alte Startseite gezeigt.
   Strategie: Navigation network-first (Fallback Cache), Assets cache-first. */

const CACHE = 'pokermentor-v7';
const CORE = ['./', './index.html', './manifest.webmanifest'];

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
