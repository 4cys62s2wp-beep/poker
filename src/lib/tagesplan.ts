/* Was heute noch offen ist.
   =========================

   Nach der Hand des Tages fragt jeder: Und jetzt? Die App wusste es längst —
   fällige Wiederholungen, ein ungemachtes Tages-Quiz, die nächste Lektion —,
   sagte es aber nur an Orten, an die man erst hinfinden musste (eine Blase in
   der Desktop-Leiste, eine Kachel 2900 Pixel tief). Diese Funktion macht aus
   dem Stand eine kurze, geordnete Liste; die Startseite zeigt die ersten
   zwei.

   Die Reihenfolge ist die der Dringlichkeit: Was verfällt, kommt zuerst
   (Wiederholungen werden mit jedem Tag schwerer), dann das, was heute
   abläuft (das Quiz ist morgen ein anderes), zuletzt das, was warten kann
   (die Lektion läuft nicht weg). */

export type PunktArt = 'wiederholen' | 'tagesquiz' | 'lektion';

export interface Punkt {
  art: PunktArt;
  zu: string;
  /** Anzahl Fragen bei `wiederholen`. */
  zahl?: number;
  /** Titel bei `lektion`. */
  titel?: string;
  /** Bei `lektion`: ob es die allererste ist. */
  erste?: boolean;
}

export interface Stand {
  faellig: number;
  /** Gibt es ein Quiz, das man heute noch machen kann? */
  quizOffen: boolean;
  naechste: { modul: string; lektion: string; titel: string; erste: boolean } | null;
}

export function offenePunkte(s: Stand): Punkt[] {
  const p: Punkt[] = [];
  if (s.faellig > 0) p.push({ art: 'wiederholen', zu: '/lernen/wiederholen', zahl: s.faellig });
  if (s.quizOffen) p.push({ art: 'tagesquiz', zu: '/lernen/tagesquiz' });
  if (s.naechste) {
    p.push({
      art: 'lektion',
      zu: `/lernen/${s.naechste.modul}/${s.naechste.lektion}`,
      titel: s.naechste.titel,
      erste: s.naechste.erste,
    });
  }
  return p;
}

export interface Tagesziel {
  hand: boolean;
  /** `null`, wenn es heute kein Quiz geben kann (noch nichts gelernt). */
  fragen: boolean | null;
}

/** Das Tagesziel besteht nur aus dem, was heute wirklich möglich ist: Wer
 *  noch keine Lektion gemacht hat, bekommt kein Ziel „5 Fragen", das er nicht
 *  erfüllen kann. */
export function tagesziel(handErledigt: boolean, quizMoeglich: boolean, quizErledigt: boolean): Tagesziel {
  return { hand: handErledigt, fragen: quizMoeglich ? quizErledigt : null };
}
