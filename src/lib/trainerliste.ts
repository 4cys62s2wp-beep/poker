/* Die Liste der Trainer — an einer Stelle.
   ========================================

   Sie stand einmal in `TrainerHub.tsx`, und seit die Lernseite dieselben
   Trainer zeigt, gäbe es sie zweimal. Zwei Listen derselben Sache sind nach
   der ersten Ergänzung verschieden.

   Die Texte stehen weiter in `i18n/pages/trainerhub.ts` — hier nur, welche
   es gibt, in welcher Reihenfolge und mit welchem Zeichen. */

import type { IconName } from '../components/Icon';
import { zeichenFuer } from './zeichen';

export type TrainerId =
  | 'szenario' | 'preflop' | 'potodds' | 'equity'
  | 'handranking' | 'outs' | 'pushfold';

export interface TrainerEintrag {
  id: TrainerId;
  zu: string;
  zeichen: IconName;
  ton: 'gold' | 'green' | 'blue' | 'red' | 'violet';
}

/** Reihenfolge nach Einstiegshöhe: Wer neu ist, fängt oben an. */
export const TRAINER: TrainerEintrag[] = [
  { id: 'szenario', zu: '/lernen/trainer/szenario', zeichen: zeichenFuer('/lernen/trainer/szenario'), ton: 'gold' },
  { id: 'preflop', zu: '/lernen/trainer/preflop', zeichen: zeichenFuer('/lernen/trainer/preflop'), ton: 'green' },
  { id: 'potodds', zu: '/lernen/trainer/potodds', zeichen: zeichenFuer('/lernen/trainer/potodds'), ton: 'blue' },
  { id: 'equity', zu: '/lernen/trainer/equity', zeichen: zeichenFuer('/lernen/trainer/equity'), ton: 'violet' },
  { id: 'handranking', zu: '/lernen/trainer/handranking', zeichen: zeichenFuer('/lernen/trainer/handranking'), ton: 'red' },
  { id: 'outs', zu: '/lernen/trainer/outs', zeichen: zeichenFuer('/lernen/trainer/outs'), ton: 'blue' },
  { id: 'pushfold', zu: '/lernen/trainer/pushfold', zeichen: zeichenFuer('/lernen/trainer/pushfold'), ton: 'gold' },
];
