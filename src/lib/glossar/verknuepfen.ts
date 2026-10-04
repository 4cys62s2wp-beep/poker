/* Fachbegriffe finden und verknüpfen.
   ====================================

   In Lektionen standen 858 **fett** gesetzte Begriffe, und keiner ließ sich
   antippen — nicht einmal die 104, zu denen es im Glossar einen Eintrag gibt.
   Wer „Implied Odds" nicht kannte, musste die Lektion verlassen, das Glossar
   öffnen und suchen. Hier steht, wie aus einem Text ein Begriff mit Eintrag
   wird.

   Zwei Wege:

   - **`findeEintrag`** — für Fettgedrucktes: Der Autor hat den Begriff schon
     markiert, gesucht wird nur sein Eintrag (mit Abkürzungen, Mehrzahl und
     Klammerzusätzen: „Big Blinds (BB)" → „Big Blind").
   - **`zerlege`** — für Fließtext ohne Markierung (Trainer, Coach): Das erste
     Vorkommen jedes Fachbegriffs wird verknüpft, höchstens `max` je Text.
     Die Grundwörter (Call, Raise, Pot …) bleiben bewusst ungebunden: Wer
     „Call" nachschlagen muss, liest keine Trainererklärung zu Pot Odds.

   Beides ist rein: Text rein, Stücke raus. */

import type { GlossaryEntry } from '../../content/types';
import { suchbar } from '../eingabe/suche';

/** Abkürzungen und Schreibweisen, die auf einen Eintrag zeigen, den es unter
 *  anderem Namen gibt. Die Begriffe stehen in beiden Sprachen gleich im
 *  Glossar, deshalb gilt eine Tabelle für beide. */
const ALIASE: Record<string, string> = {
  utg: 'Under the Gun',
  '3-bet': 'Three-Bet',
  '4-bet': 'Four-Bet',
  '3bet': 'Three-Bet',
  '4bet': 'Four-Bet',
  btn: 'Button',
  'dealer-button': 'Button',
  sb: 'Small Blind',
  bb: 'Big Blind',
  co: 'Cutoff',
  hj: 'Hijack',
  ip: 'Position',
  oop: 'Position',
  'in position': 'Position',
  'out of position': 'Position',
  'split pot': 'Chop',
  polar: 'Polarisiert',
  'c-bets': 'C-Bet',
  'c-betten': 'C-Bet',
  semibluff: 'Semi-Bluff',
};

/** Grundwörter, die im Fließtext nie von selbst verknüpft werden. */
const GRUNDWOERTER = new Set([
  'call', 'raise', 'fold', 'check', 'bet', 'pot', 'flop', 'turn', 'river', 'board', 'stack',
  'blinds', 'button', 'position', 'draw', 'set', 'air', 'blank', 'combo', 'range', 'tell',
  'tilt', 'rake', 'ante', 'limp', 'muck', 'nuts', 'fish', 'whale', 'steal', 'float', 'chop',
  'loose', 'tight', 'straight', 'flush', 'preflop', 'rebuy', 'bounty', 'protection', 'regular',
  'kicker', 'bluff', 'equity', 'outs', 'rush/zoom', 'blocker',
]);

export type Index = Map<string, GlossaryEntry>;

export function baueIndex(glossar: readonly GlossaryEntry[]): Index {
  const index: Index = new Map();
  const nachTerm = new Map(glossar.map((e) => [e.term, e]));
  for (const e of glossar) {
    const k = suchbar(e.term);
    index.set(k, e);
    /* „Texas Hold’em" bleibt, wie es ist; Klammerzusätze gibt es im Glossar
       nicht — falls einer dazukommt, findet ihn auch der Kurzname. */
    index.set(k.replace(/\s*\(.*\)\s*$/, ''), e);
  }
  for (const [alias, term] of Object.entries(ALIASE)) {
    const e = nachTerm.get(term);
    if (e && !index.has(alias)) index.set(alias, e);
  }
  return index;
}

/** Den Glossareintrag zu einem markierten Begriff finden — oder `null`. */
export function findeEintrag(index: Index, roh: string): GlossaryEntry | null {
  const text = suchbar(roh.trim().replace(/^[„“”"'’‘]+|[„“”"'’‘:.,;!?]+$/g, ''));
  if (!text) return null;
  const versuche = new Set<string>([text]);
  const ohneKlammer = text.replace(/\s*\(.*\)\s*$/, '').trim();
  versuche.add(ohneKlammer);
  const inKlammer = /\(([^)]+)\)/.exec(text)?.[1]?.trim();
  if (inKlammer) versuche.add(inKlammer);
  /* Mehrzahl: „Big Blinds" → „Big Blind", „Outs" → „Out". Nur, wenn der Rest
     lang genug ist, dass es kein Zufallstreffer wird. */
  for (const v of [...versuche]) {
    for (const endung of ['s', 'n', 'en', 'e']) {
      if (v.length > endung.length + 3 && v.endsWith(endung)) versuche.add(v.slice(0, -endung.length));
    }
  }
  for (const v of versuche) {
    const e = index.get(v);
    if (e) return e;
  }
  return null;
}

export interface Stueck {
  text: string;
  eintrag?: GlossaryEntry;
}

function maskiere(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Die Wörter, die im Fließtext verknüpft werden dürfen: Fachbegriffe mit
 *  mindestens vier Zeichen — und die großgeschriebenen Kürzel, die jeder
 *  kennen sollte (EV, SPR, ICM, GTO, MDF). Ohne Grundwörter. */
function kandidaten(glossar: readonly GlossaryEntry[]): GlossaryEntry[] {
  return glossar.filter((e) => {
    const k = suchbar(e.term);
    if (GRUNDWOERTER.has(k)) return false;
    if (e.term.length >= 4) return true;
    return /^[A-Z]{2,5}$/.test(e.term);
  });
}

const regexCache = new WeakMap<readonly GlossaryEntry[], { re: RegExp; nachSchluessel: Map<string, GlossaryEntry> }>();

function regexFuer(glossar: readonly GlossaryEntry[]) {
  let c = regexCache.get(glossar);
  if (c) return c;
  const liste = kandidaten(glossar).sort((a, b) => b.term.length - a.term.length);
  const nachSchluessel = new Map(liste.map((e) => [suchbar(e.term), e]));
  /* Wortgrenze davor, deutsche Endungen dahinter erlaubt („Semi-Bluffs",
     „Fold Equity", „c-bettet"). Nur echte Endungen, nicht irgendwelche
     drei Buchstaben: „Squeezebox" ist kein „Squeeze". `\p{L}` statt `\w`,
     damit Umlaute zählen. */
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}-])(${liste.map((e) => maskiere(e.term)).join('|')})(?:s|n|en|e|er|es|st|t|te|ten|tet|test)?(?![\\p{L}\\p{N}])`,
    'giu',
  );
  c = { re, nachSchluessel };
  regexCache.set(glossar, c);
  return c;
}

/**
 * Zerlegt einen Text in Stücke; das erste Vorkommen jedes Fachbegriffs trägt
 * seinen Eintrag, höchstens `max` Stück je Text.
 */
export function zerlege(text: string, glossar: readonly GlossaryEntry[], max = 2): Stueck[] {
  const { re, nachSchluessel } = regexFuer(glossar);
  const stuecke: Stueck[] = [];
  const gesehen = new Set<string>();
  let letzter = 0;
  re.lastIndex = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (gesehen.size >= max) break;
    const e = nachSchluessel.get(suchbar(m[1]));
    if (!e || gesehen.has(e.term)) continue;
    gesehen.add(e.term);
    if (m.index > letzter) stuecke.push({ text: text.slice(letzter, m.index) });
    stuecke.push({ text: m[0], eintrag: e });
    letzter = m.index + m[0].length;
  }
  if (letzter < text.length) stuecke.push({ text: text.slice(letzter) });
  return stuecke.length > 0 ? stuecke : [{ text }];
}
