/* Eine Suche für Werkzeuge, Lektionen und Begriffe.
   =================================================

   Es gab zwei Suchfelder, und jedes kannte nur einen Teil: Das auf
   „Nachschlagen“ fand Bereiche und Glossarbegriffe, das auf „Lernen“ nur
   Lektionen. Wer „Bankroll“ eintippte, fand je nach Feld den Bankroll-Tracker
   oder die Lektion — nie beides. Dabei weiß, wer sucht, nicht, ob das, was er
   sucht, eine Seite, eine Lektion oder ein Eintrag im Glossar ist (E-096).

   Dieser Index führt die drei Quellen zusammen. Er ist reine Rechnung ohne
   Oberfläche; die Felder und der Suchdialog fragen ihn nur noch. Gruppen und
   Reihenfolge sind überall gleich: **Werkzeuge · Lektionen · Begriffe**. */

import { suchbar } from '../eingabe/suche';

/** Ein Ort, an den die Suche führen kann: Werkzeug, Trainer, Seite. */
export interface Ziel {
  to: string;
  titel: string;
  /** Ein erklärender Satz — in der Trefferliste ist er richtig, auf der Kachel nicht. */
  beschreibung: string;
  /** Wonach sonst noch gefunden wird, auch in der anderen Sprache. */
  keywords: string[];
}

export interface LektionQuelle {
  id: string;
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
}

export interface ModulQuelle {
  id: string;
  title: string;
  lessons: LektionQuelle[];
}

export interface Quellen {
  werkzeuge: Ziel[];
  module: ModulQuelle[];
  glossar: Array<{ term: string }>;
}

export interface LektionsTreffer {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  /** Wo es steht: im Titel, in der Einleitung, unter einer Überschrift oder im Text. */
  art: 'titel' | 'einleitung' | 'ueberschrift' | 'text';
  /** Titel: die Einleitung; Überschrift: deren Wortlaut; sonst ein Auszug rund um den Fund. */
  ausschnitt: string;
}

export interface Ergebnis {
  werkzeuge: Ziel[];
  lektionen: LektionsTreffer[];
  begriffe: string[];
  /** Keine Gruppe hat etwas. */
  leer: boolean;
}

/** Ab so vielen Zeichen wird gesucht. Kürzer fände „a“ die halbe App. */
export const MIN_ZEICHEN = 2;
/** Im Fließtext der Lektionen erst ab drei Zeichen: Zwei Buchstaben stehen
 *  in jedem Absatz, und der Auszug sagte nichts. */
export const MIN_ZEICHEN_TEXT = 3;

export interface Grenzen {
  lektionen: number;
  begriffe: number;
}
export const STANDARD_GRENZEN: Grenzen = { lektionen: 6, begriffe: 6 };

/** Ein Auszug rund um den Fund, mit Auslassungspunkten, wo gekürzt wurde. */
export function ausschnittUm(text: string, abfrage: string): string {
  const idx = suchbar(text).indexOf(abfrage);
  if (idx < 0) return '';
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + abfrage.length + 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\n/g, ' ')}${end < text.length ? '…' : ''}`;
}

function suchLektion(m: ModulQuelle, l: LektionQuelle, q: string): LektionsTreffer | null {
  const mach = (art: LektionsTreffer['art'], ausschnitt: string): LektionsTreffer => ({
    moduleId: m.id, moduleTitle: m.title, lessonId: l.id, lessonTitle: l.title, art, ausschnitt,
  });
  if (suchbar(l.title).includes(q)) return mach('titel', l.intro);
  if (q.length < MIN_ZEICHEN_TEXT) return null;
  if (suchbar(l.intro).includes(q)) return mach('einleitung', ausschnittUm(l.intro, q));
  for (const sec of l.sections) {
    if (suchbar(sec.heading).includes(q)) return mach('ueberschrift', sec.heading);
    if (suchbar(sec.body).includes(q)) return mach('text', ausschnittUm(sec.body.replace(/\*\*/g, ''), q));
  }
  return null;
}

/**
 * Sucht in allen drei Quellen. Treffer im Titel stehen vor Treffern im Text,
 * sonst in der Reihenfolge der Quelle.
 */
export function suche(abfrage: string, quellen: Quellen, grenzen: Grenzen = STANDARD_GRENZEN): Ergebnis {
  const q = suchbar(abfrage.trim());
  if (q.length < MIN_ZEICHEN) return { werkzeuge: [], lektionen: [], begriffe: [], leer: true };

  const werkzeuge = quellen.werkzeuge.filter((z) =>
    suchbar(z.titel).includes(q)
    || suchbar(z.beschreibung).includes(q)
    || z.keywords.some((k) => suchbar(k).includes(q)));
  /* Wer den Namen eines Werkzeugs trifft, steht vor dem, bei dem nur ein
     Stichwort passt. */
  werkzeuge.sort((a, b) => Number(suchbar(b.titel).includes(q)) - Number(suchbar(a.titel).includes(q)));

  const alle: LektionsTreffer[] = [];
  for (const m of quellen.module) {
    for (const l of m.lessons) {
      const t = suchLektion(m, l, q);
      if (t) alle.push(t);
    }
  }
  alle.sort((a, b) => Number(b.art === 'titel') - Number(a.art === 'titel'));
  const lektionen = alle.slice(0, grenzen.lektionen);

  const begriffe = quellen.glossar
    .map((g) => g.term)
    .filter((t) => suchbar(t).includes(q))
    .sort((a, b) => Number(suchbar(b) === q) - Number(suchbar(a) === q))
    .slice(0, grenzen.begriffe);

  return { werkzeuge, lektionen, begriffe, leer: werkzeuge.length + lektionen.length + begriffe.length === 0 };
}

/** Wohin Enter führt: auf den besten Treffer — Werkzeug, dann Lektion, dann Begriff. */
export function bestesZiel(e: Ergebnis): string | null {
  if (e.werkzeuge[0]) return e.werkzeuge[0].to;
  if (e.lektionen[0]) return `/lernen/${e.lektionen[0].moduleId}/${e.lektionen[0].lessonId}`;
  if (e.begriffe[0]) return `/nachschlagen/glossar?q=${encodeURIComponent(e.begriffe[0])}`;
  return null;
}
