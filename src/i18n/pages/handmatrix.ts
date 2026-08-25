import { defineStrings } from '..';

/* 13×13-Starthand-Matrix (Range-Viewer, Preflop-/Push-Fold-Trainer, Hand-Explorer).
   Die Zellen sind Buttons – Screenreader brauchen ein sprechendes Label. */
export const STR = defineStrings(
  {
    gridLabel: 'Starthand-Matrix, 13 × 13 Felder – mit den Pfeiltasten navigieren',
    raise: 'Raise',
    call: 'Call',
    fold: 'Fold',
  },
  {
    gridLabel: 'Starting hand matrix, 13 by 13 cells – use the arrow keys to navigate',
    raise: 'Raise',
    call: 'Call',
    fold: 'Fold',
  },
);
