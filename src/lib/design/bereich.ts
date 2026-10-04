/* Zu welchem Bereich gehört ein Pfad?
   ===================================

   Davon hängt die Farbe ab, in der Augenbraue und Seitenleiste sprechen
   (DESIGN.md, Regel 12.5). Start, Profil, Freunde und alles Übrige haben
   keine eigene Farbe — dort spricht alles in der Textfarbe.

   Eigene Datei, damit der Test sie ohne die ganze App laden kann. */

export type Bereich = 'lernen' | 'nachschlagen' | 'session' | 'neutral';

export function bereichVon(pfad: string): Bereich {
  if (pfad === '/lernen' || pfad.startsWith('/lernen/')) return 'lernen';
  if (pfad === '/nachschlagen' || pfad.startsWith('/nachschlagen/')) return 'nachschlagen';
  if (pfad === '/session' || pfad.startsWith('/session/')) return 'session';
  return 'neutral';
}
