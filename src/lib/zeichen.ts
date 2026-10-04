/* Ein Symbol je Ziel — an einer Stelle.
   =====================================

   Vorher trug jede Liste ihre Symbole selbst: die Seitenleiste in
   `Layout.tsx`, die Kacheln in `LearnPage.tsx`, `SessionPage.tsx` und
   `ReferencePage.tsx`, die Trainer in `trainerliste.ts`. Dabei entstanden
   Paare, die man nur sieht, wenn man sie nebeneinander legt: Handranking-
   Trainer und Übungstisch beide „zwei Karten, rot“; Odds, Equity und
   Spielstil dasselbe Säulendiagramm; „Frühere Abende“ und „Auszahlung“
   dieselbe Krone; der Pro-Bereich und die Auszahlung ebenso.

   Jetzt steht das Symbol am **Ziel**, nicht an der Liste. Eine Liste fragt
   `zeichenFuer(pfad)`; dieselbe Seite hat damit überall dasselbe Zeichen,
   und zwei verschiedene Seiten teilen eines nur, wenn es unten ausdrücklich
   steht. */

import type { IconName } from '../components/Icon';

export const ZEICHEN = {
  '/': 'spade',

  '/lernen': 'learn',
  '/lernen/wiederholen': 'repeat',
  '/lernen/tagesquiz': 'sun',
  '/lernen/uebungstisch': 'play',
  '/lernen/drill': 'bolt',
  '/lernen/statistik': 'chart',
  '/lernen/pros': 'star',
  '/lernen/trainer/szenario': 'scene',
  '/lernen/trainer/preflop': 'grid',
  '/lernen/trainer/potodds': 'scale',
  '/lernen/trainer/equity': 'pie',
  '/lernen/trainer/handranking': 'podium',
  '/lernen/trainer/outs': 'trainer',
  '/lernen/trainer/pushfold': 'push',

  '/nachschlagen': 'search',
  '/nachschlagen/coach': 'coach',
  '/nachschlagen/glossar': 'glossary',
  '/nachschlagen/haende': 'cards',
  '/nachschlagen/ranges': 'grid',
  '/nachschlagen/odds': 'scale',
  '/nachschlagen/equity': 'pie',
  '/nachschlagen/tells': 'eye',

  '/session': 'history',
  '/session/live': 'table',
  '/session/abende': 'calendar',
  '/session/chips': 'chip',
  '/session/auszahlung': 'trophy',
  '/session/bankroll': 'coin',

  '/profil': 'profile',
  '/profil/einstellungen': 'settings',
  '/freunde': 'friends',
  '/pro': 'crown',
  '/rechtliches': 'notes',
  '/kuendigen': 'trash',
} as const satisfies Record<string, IconName>;

export type ZeichenPfad = keyof typeof ZEICHEN;

/** Das Symbol zu einem Pfad, der als Text vorliegt (Suchtreffer) — oder `null`. */
export function zeichenFuerPfad(pfad: string): IconName | null {
  return (ZEICHEN as Record<string, IconName>)[pfad] ?? null;
}

/** Das Symbol einer Seite. Ein Pfad ohne Eintrag ist ein Tippfehler und
 *  fällt beim Übersetzen auf. */
export function zeichenFuer(pfad: ZeichenPfad): IconName {
  return ZEICHEN[pfad];
}

/**
 * Was gleichzeitig auf einem Bildschirm steht. Innerhalb einer Gruppe darf
 * kein Symbol zweimal vorkommen — sonst sucht man die Kachel nach der Form
 * und findet zwei.
 */
export const BILDSCHIRME: Record<string, ZeichenPfad[]> = {
  seitenleiste: [
    '/', '/lernen', '/lernen/wiederholen', '/lernen/uebungstisch',
    '/nachschlagen', '/nachschlagen/coach', '/nachschlagen/glossar',
    '/session', '/session/live', '/session/abende', '/session/chips',
    '/session/auszahlung', '/session/bankroll', '/profil', '/profil/einstellungen', '/freunde', '/pro',
  ],
  lernen: [
    '/lernen/trainer/szenario', '/lernen/trainer/preflop',
    '/lernen/trainer/potodds', '/lernen/trainer/equity',
    '/lernen/trainer/handranking', '/lernen/trainer/outs',
    '/lernen/trainer/pushfold', '/lernen/wiederholen', '/lernen/tagesquiz',
    '/lernen/uebungstisch', '/lernen/statistik', '/lernen/drill',
  ],
  nachschlagen: [
    '/nachschlagen/coach', '/nachschlagen/glossar', '/nachschlagen/haende',
    '/nachschlagen/ranges', '/nachschlagen/odds', '/nachschlagen/equity',
    '/nachschlagen/tells',
  ],
  session: [
    '/session/live', '/session/abende', '/session/chips',
    '/session/auszahlung', '/session/bankroll',
  ],
  profil: ['/freunde', '/pro', '/rechtliches', '/kuendigen'],
};

/**
 * Paare verschiedener Seiten, die ein Symbol teilen dürfen: der Trainer und
 * das Nachschlagewerk zum selben Gegenstand. Sie stehen nie auf demselben
 * Bildschirm, und das gleiche Zeichen sagt „das gehört zusammen“.
 */
export const GETEILT: ReadonlyArray<readonly [ZeichenPfad, ZeichenPfad]> = [
  ['/lernen/trainer/preflop', '/nachschlagen/ranges'],
  ['/lernen/trainer/potodds', '/nachschlagen/odds'],
  ['/lernen/trainer/equity', '/nachschlagen/equity'],
];
