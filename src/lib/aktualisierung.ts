/* Neue Fassung: sichtbar machen, nicht still austauschen.
   =======================================================

   Der Service Worker übernahm jede neue Fassung sofort (`skipWaiting`). Wer
   gerade eine Lektion las oder am Tisch saß, bekam den Zwischenspeicher unter
   der Seite getauscht — und der nächste Abruf holte eine Datei der neuen
   Fassung zur alten Seite. Ein fehlender Schnipsel (`Failed to fetch
   dynamically imported module`) war die Folge, mitten in der Benutzung.

   Jetzt wartet die neue Fassung, bis die App sie übernimmt: Ein Band sagt
   „Neue Version bereit", ein Tipp lädt neu. Nie am Tisch (der Tisch liegt
   außerhalb des Rahmens, in dem das Band steht).

   Zusätzlich fängt ein globaler Zuhörer den Rest: Scheitert das Nachladen eines
   Seitenpakets, weil der Server schon die neue Fassung ausliefert, lädt die App
   **einmal** neu. Einmal — sonst wäre ein dauerhafter Fehler eine Endlosschleife. */

type Hoerer = () => void;

let wartend: ServiceWorker | null = null;
/** Hat der Nutzer die Übernahme ausgelöst? Nur dann lädt ein Wechsel des Workers neu. */
let uebernahmeAngefordert = false;
const hoerer = new Set<Hoerer>();
const melde = () => hoerer.forEach((h) => h());

export function abonniere(h: Hoerer): () => void {
  hoerer.add(h);
  return () => hoerer.delete(h);
}

/** Die Übernahme. Eine feste Funktion, keine neue je Aufruf: `useSyncExternalStore`
 *  vergleicht den Rückgabewert von `uebernimmFassung` mit dem vorigen, und eine
 *  frisch erzeugte Funktion wäre jedes Mal eine „Änderung" — eine Endlosschleife. */
function uebernehmen(): void {
  uebernahmeAngefordert = true;
  wartend?.postMessage({ type: 'SKIP_WAITING' });
}

/** Wartet eine neue Fassung? Dann gibt es die Funktion, die sie übernimmt. */
export function uebernimmFassung(): (() => void) | null {
  return wartend ? uebernehmen : null;
}

const NEULADEN_MARKE = 'pokermentor-neugeladen-v1';

/** Höchstens einmal je Sitzung neu laden. */
export function ladeEinmalNeu(): boolean {
  try {
    if (sessionStorage.getItem(NEULADEN_MARKE)) return false;
    sessionStorage.setItem(NEULADEN_MARKE, String(Date.now()));
  } catch {
    /* Gesperrter Speicher: lieber nicht neu laden als in einer Schleife. */
    return false;
  }
  window.location.reload();
  return true;
}

export function registriereWorker(): void {
  if (__SINGLE__ || !('serviceWorker' in navigator)) return;

  /* Ein Seitenpaket, das nicht mehr da ist, weil eine neue Fassung ausgeliefert
     wurde: einmal neu laden holt die passende Fassung. */
  window.addEventListener('vite:preloadError', (e) => {
    if (ladeEinmalNeu()) e.preventDefault();
  });

  if (location.hostname.includes('localhost')) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      const merke = (w: ServiceWorker | null) => {
        /* Nur wenn schon ein Worker die Seite steuert, ist es eine **neue**
           Fassung. Die allererste Installation ist keine Neuigkeit. */
        if (w && navigator.serviceWorker.controller) {
          wartend = w;
          melde();
        }
      };
      merke(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const neu = reg.installing;
        neu?.addEventListener('statechange', () => {
          if (neu.state === 'installed') merke(neu);
        });
      });
    }).catch(() => {
      // Offline-Modus optional – Fehler still ignorieren
    });

    /* Nach der Übernahme neu laden, damit Seite und Dateien aus derselben
       Fassung kommen — aber **nur** nach einer Übernahme: Bei der allerersten
       Installation wechselt der Worker auch (`clients.claim()`), und ein
       Neuladen ausgerechnet dann hieße, dem neuen Nutzer die Seite unter den
       Händen wegzuziehen. */
    let neugeladen = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (neugeladen || !uebernahmeAngefordert) return;
      neugeladen = true;
      window.location.reload();
    });
  });
}
