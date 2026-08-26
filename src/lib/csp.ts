/* Die Content-Security-Policy der Produktions-App.
   ================================================

   Warum das eine eigene, geprüfte Datei ist
   -----------------------------------------
   Die CSP ist eine Sicherheitsmaßnahme, deren Fehler sich nicht durch
   Ausprobieren zeigen: Ist sie zu eng, scheitert eine Funktion still und
   meldet nur eine Konsolenzeile. Ist sie zu weit, merkt es niemand.

   Genau das ist in Phase 3 passiert – `script-src 'self'` blockierte
   `https://apis.google.com/js/api.js`, das Firebase für die Google-Anmeldung
   lädt. Die Anmeldung wäre auf dem echten Gerät nie zustande gekommen. Seit
   diese Datei getestet wird, fällt so etwas beim nächsten Mal im Testlauf auf
   und nicht erst beim Nutzer.

   Diese Datei enthält bewusst KEINEN Dateizugriff: Sie wird zur Bauzeit aus
   `vite.config.ts` aufgerufen, das die Anmelde-Domain beisteuert. Damit ist
   die Regel selbst prüfbar, ohne ein Dateisystem vorzutäuschen. */

/**
 * Prüft, ob ein Wert als Anmelde-Domain in die Richtlinie darf.
 *
 * Nur ein schlichter Hostname. Kein Schema, kein Pfad, kein Leerzeichen und
 * kein Semikolon – alles davon könnte die Richtlinie aufbrechen, weil
 * Direktiven mit `;` getrennt werden.
 */
export function isValidAuthDomain(v: unknown): v is string {
  return typeof v === 'string' && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(v)
    && v.length <= 120;
}

/**
 * Baut die Richtlinie.
 *
 * @param authDomain Die Firebase-Anmelde-Domain, oder `null`, wenn die App
 *   ohne Cloud-Konten gebaut wird. Ohne sie bleibt es bei der engsten
 *   Fassung: keine fremden Skripte, keine Rahmen.
 */
export function buildCsp(authDomain: string | null): string {
  const domain = isValidAuthDomain(authDomain) ? authDomain : null;

  /* Firebase lädt für Popup und Weiterleitung ein Hilfsskript von
     apis.google.com und hängt einen Rahmen auf
     https://<projekt>.firebaseapp.com/__/auth/iframe ein. Ohne beide
     Erlaubnisse gibt es keine Google-Anmeldung. */
  const script = ["'self'", ...(domain ? ['https://apis.google.com'] : [])];
  const frame = domain ? [`https://${domain}`, 'https://apis.google.com'] : ["'none'"];

  /* connect-src erlaubt neben 'self' nur die Firebase-Endpunkte (Auth +
     Firestore). wss:// steht mit dabei, weil CSP Schemata strikt trennt: eine
     https-Quelle erlaubt keine WebSocket-Verbindung zum selben Host.
     Firestore nutzt normalerweise WebChannel über HTTPS, kann aber je nach
     Netz auf WebSockets wechseln. */
  const connect = [
    "'self'",
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'https://firestore.googleapis.com',
    'https://www.googleapis.com',
    'wss://firestore.googleapis.com',
  ];

  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src ${connect.join(' ')}`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-src ${frame.join(' ')}`,
  ].join('; ');
}
