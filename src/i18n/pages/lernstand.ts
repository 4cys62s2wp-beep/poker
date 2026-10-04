import { defineStrings } from '..';
import type { ThemaId } from '../../lib/lernstand';

/* Texte des Blocks „Dein Lernstand“ auf dem Profil (src/components/Lernstand.tsx). */
export const STR = defineStrings(
  {
    titel: 'Dein Lernstand',
    sub: 'Wie sicher du zuletzt warst — die letzten 20 Antworten je Thema.',
    themen: {
      handranking: 'Handstärke',
      preflop: 'Preflop-Ranges',
      outs: 'Outs',
      potodds: 'Pot Odds',
      equity: 'Equity',
      pushfold: 'Push/Fold',
      szenario: 'Entscheidungen im Spot',
    } as Record<ThemaId, string>,
    stufen: {
      sicher: 'sicher',
      wackelt: 'wackelt',
      offen: 'noch offen',
      zuWenig: 'noch zu wenig Daten',
    },
    bilanz: (richtig: number, von: number) => `${richtig} von ${von} richtig`,
    bisher: (n: number, noetig: number) => `${n} von ${noetig} Antworten`,
    ueben: 'Jetzt üben',
    nachlesen: 'Nachlesen',
    leer: 'Löse ein paar Aufgaben in den Trainern. Ab zehn Antworten je Thema steht hier, wo du sicher bist und was wackelt.',
    leerWeg: 'Zu den Übungen',
  },
  {
    titel: 'Your skill level',
    sub: 'How sure you were lately — the last 20 answers per topic.',
    themen: {
      handranking: 'Hand strength',
      preflop: 'Preflop ranges',
      outs: 'Outs',
      potodds: 'Pot odds',
      equity: 'Equity',
      pushfold: 'Push/Fold',
      szenario: 'Decisions in a spot',
    } as Record<ThemaId, string>,
    stufen: {
      sicher: 'solid',
      wackelt: 'shaky',
      offen: 'still open',
      zuWenig: 'not enough data yet',
    },
    bilanz: (richtig: number, von: number) => `${richtig} of ${von} correct`,
    bisher: (n: number, noetig: number) => `${n} of ${noetig} answers`,
    ueben: 'Practise now',
    nachlesen: 'Read up',
    leer: 'Solve a few tasks in the trainers. From ten answers per topic, this shows where you are solid and what is shaky.',
    leerWeg: 'To the exercises',
  },
);
