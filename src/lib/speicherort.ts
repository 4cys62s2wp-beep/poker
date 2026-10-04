/* Wo liegt der Fortschritt gerade?
   ================================

   Das Profil sagte oben „doppelt auf diesem Gerät gesichert – und mit Konto
   zusätzlich in der Cloud“, weiter unten „Alle Daten liegen nur auf diesem
   Gerät“ — beides auf derselben Seite, beides zu jedem Zeitpunkt. Eines davon
   stimmte immer nicht. Jetzt hängt der Satz am Zustand (E-095). */

export type Speicherort = 'geraet' | 'konto' | 'konto-offen';

/**
 * - kein Konto, keine Cloud, Netz weg, Cloud noch nicht geladen → `geraet`
 * - angemeldet und die E-Mail bestätigt → `konto`
 * - angemeldet, aber noch nicht bestätigt → `konto-offen`: Bis zur Bestätigung
 *   wird nichts in die Cloud geschrieben, der Stand liegt also nur hier.
 */
export function speicherort(user: { verified: boolean } | null | undefined): Speicherort {
  if (!user) return 'geraet';
  return user.verified ? 'konto' : 'konto-offen';
}
