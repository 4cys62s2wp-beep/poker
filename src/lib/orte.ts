/* Ein Name pro Ort.
   =================

   Dieselbe Seite hieß in der Seitenleiste „Spielstil", als Titel „Dein
   Spielstil", auf der Kachel „Spielstil-Analyse"; „Nachschlagen" hieß als Seite
   „Schnell etwas wissen"; zwei Rücklinks hießen „← Trainer" und führten auf
   eine Seite, die es seit E-037 nicht mehr gibt. Jede Liste hatte ihre eigene
   Beschriftung, weil jede Liste sie selbst schrieb.

   Jetzt steht der Name am Ort — an dieser einen Stelle. Seitenleiste,
   Rückweg, Kopfzeile und Dokumenttitel fragen hier; und eine Prüfung
   (`orte.test.ts`) verlangt, dass der Titel einer Seite ihrem Namen entspricht.

   Zu jedem Ort gehört sein **Eltern**-Ort: das, wohin „Zurück" führt. Der
   Rückweg führt immer eine Ebene nach oben in der Struktur, nicht dorthin,
   woher man kam (DESIGN.md §9). */

import type { Lang } from '../i18n';
import { STR as LAYOUT } from '../i18n/pages/layout';
import { STR as FRIENDS } from '../i18n/pages/friends';
import { STR as LEGAL } from '../i18n/pages/legal';
import { STR as PRO } from '../i18n/pages/pro';
import { STR as SESSION } from '../i18n/pages/session';
import { STR as TRAINERTEXTE } from '../i18n/pages/trainerhub';
import { STR as DRILL } from '../i18n/pages/potoddsdrill';

export type OrtPfad =
  | '/'
  | '/lernen' | '/lernen/wiederholen' | '/lernen/tagesquiz' | '/lernen/pros'
  | '/lernen/uebungstisch' | '/lernen/statistik' | '/lernen/drill'
  | '/lernen/trainer/szenario' | '/lernen/trainer/preflop' | '/lernen/trainer/potodds'
  | '/lernen/trainer/equity' | '/lernen/trainer/handranking' | '/lernen/trainer/outs'
  | '/lernen/trainer/pushfold'
  | '/nachschlagen' | '/nachschlagen/coach' | '/nachschlagen/glossar'
  | '/nachschlagen/haende' | '/nachschlagen/ranges' | '/nachschlagen/odds'
  | '/nachschlagen/equity' | '/nachschlagen/tells'
  | '/session' | '/session/live' | '/session/live/einrichten' | '/session/abende'
  | '/session/chips' | '/session/auszahlung' | '/session/bankroll'
  | '/profil' | '/freunde' | '/pro' | '/rechtliches' | '/kuendigen';

export type Breite = 'schmal' | 'standard' | 'weit';

interface Ort {
  pfad: OrtPfad;
  /** Voller Name: Titel der Seite, Beschriftung im Rückweg. */
  name: (l: Lang) => string;
  /** Kurzform für enge Stellen (Kopfzeile am Handy). */
  kurz?: (l: Lang) => string;
  /** Wohin „Zurück" führt; `null` heißt: Start, hier endet der Weg. */
  eltern: OrtPfad | null;
  /** Wie breit die Seite sein darf (Breiten-Tokens in global.css). Eine Aufgabe
   *  je Bildschirm ist `schmal`, Listen und Lesetext sind `standard`, nur wo
   *  zwei Spalten oder ein Raster gebraucht werden, ist es `weit`. */
  breite?: Breite;
}

const T = (id: keyof (typeof TRAINERTEXTE)['de']['trainers']) => (l: Lang) =>
  TRAINERTEXTE[l].trainers[id].title;

export const ORTE: Ort[] = [
  { pfad: '/', name: (l) => LAYOUT[l].start, eltern: null, breite: 'weit' },

  { pfad: '/lernen', name: (l) => LAYOUT[l].learnPath, eltern: '/' },
  { pfad: '/lernen/wiederholen', name: (l) => LAYOUT[l].review, eltern: '/lernen' },
  { pfad: '/lernen/tagesquiz', name: (l) => LAYOUT[l].dailyQuiz, eltern: '/lernen', breite: 'schmal' },
  { pfad: '/lernen/pros', name: (l) => LAYOUT[l].proInsights, eltern: '/lernen' },
  { pfad: '/lernen/uebungstisch', name: (l) => LAYOUT[l].practiceTable, eltern: '/lernen' },
  { pfad: '/lernen/statistik', name: (l) => LAYOUT[l].playStyle, eltern: '/lernen' },
  { pfad: '/lernen/drill', name: (l) => DRILL[l].title, eltern: '/lernen', breite: 'schmal' },
  { pfad: '/lernen/trainer/szenario', name: T('szenario'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/preflop', name: T('preflop'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/potodds', name: T('potodds'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/equity', name: T('equity'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/handranking', name: T('handranking'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/outs', name: T('outs'), eltern: '/lernen' },
  { pfad: '/lernen/trainer/pushfold', name: T('pushfold'), eltern: '/lernen' },

  { pfad: '/nachschlagen', name: (l) => LAYOUT[l].navLookup, kurz: (l) => LAYOUT[l].mobileLookup, eltern: '/' },
  { pfad: '/nachschlagen/coach', name: (l) => LAYOUT[l].liveCoach, eltern: '/nachschlagen' },
  { pfad: '/nachschlagen/glossar', name: (l) => LAYOUT[l].glossary, eltern: '/nachschlagen' },
  { pfad: '/nachschlagen/haende', name: (l) => LAYOUT[l].handExplorer, eltern: '/nachschlagen', breite: 'weit' },
  { pfad: '/nachschlagen/ranges', name: (l) => LAYOUT[l].ranges, eltern: '/nachschlagen' },
  { pfad: '/nachschlagen/odds', name: (l) => LAYOUT[l].odds, eltern: '/nachschlagen' },
  { pfad: '/nachschlagen/equity', name: (l) => LAYOUT[l].equity, eltern: '/nachschlagen' },
  { pfad: '/nachschlagen/tells', name: (l) => LAYOUT[l].tells, eltern: '/nachschlagen' },

  { pfad: '/session', name: (l) => LAYOUT[l].navSession, eltern: '/' },
  { pfad: '/session/live', name: (l) => SESSION[l].abendTitle, eltern: '/session' },
  { pfad: '/session/live/einrichten', name: (l) => LAYOUT[l].setupEvening, eltern: '/session', breite: 'schmal' },
  { pfad: '/session/abende', name: (l) => SESSION[l].abendeTitle, eltern: '/session' },
  { pfad: '/session/chips', name: (l) => LAYOUT[l].chipCalc, eltern: '/session', breite: 'schmal' },
  { pfad: '/session/auszahlung', name: (l) => LAYOUT[l].payout, eltern: '/session', breite: 'schmal' },
  { pfad: '/session/bankroll', name: (l) => LAYOUT[l].bankroll, eltern: '/session' },

  { pfad: '/profil', name: (l) => LAYOUT[l].profile, kurz: (l) => LAYOUT[l].mobileYou, eltern: '/' },
  { pfad: '/freunde', name: (l) => FRIENDS[l].navFriends, eltern: '/profil' },
  { pfad: '/pro', name: (l) => PRO[l].navPro, eltern: '/profil', breite: 'schmal' },
  { pfad: '/rechtliches', name: (l) => LEGAL[l].navLegal, eltern: '/profil' },
  { pfad: '/kuendigen', name: (l) => LEGAL[l].cancelNav, eltern: '/rechtliches', breite: 'schmal' },
];

const NACH_PFAD = new Map<string, Ort>(ORTE.map((o) => [o.pfad, o]));

export function istOrt(pfad: string): pfad is OrtPfad {
  return NACH_PFAD.has(pfad);
}

/** Der Name eines Ortes in der Beschriftung des Rückwegs und im Titel. */
export function ortName(pfad: OrtPfad, lang: Lang): string {
  return NACH_PFAD.get(pfad)!.name(lang);
}

/** Die Kurzform — oder, wo es keine gibt, der volle Name. */
export function ortKurz(pfad: OrtPfad, lang: Lang): string {
  const o = NACH_PFAD.get(pfad)!;
  return (o.kurz ?? o.name)(lang);
}

export interface Treffer {
  /** Der Ort, auf dem man steht — oder der nächste benannte darüber. */
  ort: OrtPfad;
  /** Wohin „Zurück" führt. Bei Lektionen ist das ein Modul, kein benannter Ort. */
  eltern: string | null;
  /** Ob die Seite selbst ein eigener Ort ist (kein dynamisches Kind). */
  genau: boolean;
}

/**
 * Wo steht man? Feste Orte zuerst; dynamische Seiten (Modul, Lektion,
 * früherer Abend, Spieler) hängen unter ihrem Elternort.
 */
export function findeOrt(pathname: string): Treffer {
  const pfad = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const fest = NACH_PFAD.get(pfad);
  if (fest) return { ort: fest.pfad, eltern: fest.eltern, genau: true };

  const seg = pfad.split('/').filter(Boolean);
  if (seg[0] === 'lernen') {
    if (seg[1] === 'drill') return { ort: '/lernen/drill', eltern: '/lernen', genau: false };
    if (seg.length === 2) return { ort: '/lernen', eltern: '/lernen', genau: false };
    if (seg.length === 3) return { ort: '/lernen', eltern: `/lernen/${seg[1]}`, genau: false };
    /* Das Quiz einer Lektion: Zurück führt in die Lektion, nicht in die Liste. */
    if (seg.length === 4 && seg[3] === 'quiz') {
      return { ort: '/lernen', eltern: `/lernen/${seg[1]}/${seg[2]}`, genau: false };
    }
  }
  if (seg[0] === 'session') {
    if (seg[1] === 'abende' || seg[1] === 'spieler') {
      return { ort: '/session/abende', eltern: '/session/abende', genau: false };
    }
  }
  /* Unbekannter Pfad: der nächste bekannte Vorfahr. */
  for (let n = seg.length - 1; n > 0; n -= 1) {
    const vorfahr = NACH_PFAD.get(`/${seg.slice(0, n).join('/')}`);
    if (vorfahr) return { ort: vorfahr.pfad, eltern: vorfahr.pfad, genau: false };
  }
  return { ort: '/', eltern: null, genau: false };
}

export interface NavZiel {
  to: string;
  /** Weitere Pfade, bei denen dieser Eintrag der aktive ist. */
  pfade?: string[];
}

function passt(pfad: string, praefix: string): boolean {
  return praefix === '/' ? pfad === '/' : pfad === praefix || pfad.startsWith(`${praefix}/`);
}

/**
 * Welcher Eintrag der Seitenleiste ist der aktive? **Genau einer**: der mit
 * dem längsten passenden Pfad. Vorher bekam jeder Eintrag, dessen Pfad ein
 * Anfang der Adresse war, den goldenen Balken — auf „Übungstisch" standen
 * „Lernpfad" und „Übungstisch" beide da, auf „Live-Coach" ebenso, und auf
 * der Live-Session-Seite keiner.
 */
export function waehleAktiv(ziele: NavZiel[], pathname: string): string | null {
  const pfad = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  let bester: { to: string; laenge: number } | null = null;
  for (const z of ziele) {
    for (const p of z.pfade ?? [z.to]) {
      if (passt(pfad, p) && (bester === null || p.length > bester.laenge)) {
        bester = { to: z.to, laenge: p.length };
      }
    }
  }
  return bester?.to ?? null;
}

/** Die Seitenbreite am Ort; dynamische Seiten erben vom nächsten benannten Ort. */
export function breiteVon(pathname: string): Breite {
  /* Eine Aufgabe je Bildschirm ist schmal — auch das Quiz einer Lektion. */
  if (/^\/lernen\/[^/]+\/[^/]+\/quiz\/?$/.test(pathname)) return 'schmal';
  const t = findeOrt(pathname);
  return NACH_PFAD.get(t.ort)?.breite ?? 'standard';
}
