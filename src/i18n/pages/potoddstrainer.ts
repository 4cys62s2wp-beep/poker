import { defineStrings } from '..';

export const STR = defineStrings(
  {
    back: '← Trainer',
    title: 'Pot-Odds-Trainer',
    sub: 'Formel: Call ÷ (Pot + Bet + Call)',
    streak: (n: number) => `Serie: ${n}`,
    potLabel: 'Pot',
    betLabel: 'Gegner setzt',
    callLabel: 'Dein Call',
    questionBefore: 'Wie viel ',
    questionStrong: 'Equity',
    questionAfter: ' brauchst du mindestens für einen profitablen Call?',
    option: (pct: number) => `ca. ${pct.toLocaleString('de-DE')} %`,
    calc: (bet: number, pot: number, total: number) =>
      `Rechnung: Du callst ${bet} und kannst ${pot} + ${bet} + ${bet} = ${total} gewinnen. Benötigte Equity = ${bet} ÷ ${total} = `,
    requiredPct: (req: number) => `${req.toFixed(1).replace('.', ',')} %`,
    mnemonic: 'Merksatz: Halbe Pot-Bet → 25 %, Pot-Bet → 33 %.',
    nextProblem: 'Nächste Aufgabe',
  },
  {
    back: '← Trainers',
    title: 'Pot Odds Trainer',
    sub: 'Formula: call ÷ (pot + bet + call)',
    streak: (n: number) => `Streak: ${n}`,
    potLabel: 'Pot',
    betLabel: 'Opponent Bets',
    callLabel: 'Your Call',
    questionBefore: 'How much ',
    questionStrong: 'equity',
    questionAfter: ' do you need at minimum for a profitable call?',
    option: (pct: number) => `about ${pct.toLocaleString('en-US')}%`,
    calc: (bet: number, pot: number, total: number) =>
      `The math: you call ${bet} to win ${pot} + ${bet} + ${bet} = ${total}. Required equity = ${bet} ÷ ${total} = `,
    requiredPct: (req: number) => `${req.toFixed(1)}%`,
    mnemonic: 'Rule of thumb: half-pot bet → 25%, pot-sized bet → 33%.',
    nextProblem: 'Next Problem',
  },
);
