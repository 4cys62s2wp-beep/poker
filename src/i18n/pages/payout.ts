import { defineStrings } from '..';

/* Texte des Auszahlungs-Rechners (src/pages/session/PayoutPage.tsx). */
export const STR = defineStrings(
  {
    eyebrow: 'Live-Session',
    title: 'Auszahlung',
    sub: 'Wer bekommt am Ende wie viel? Diese Frage gehört an den Anfang des Abends – danach hat der Sieger die großzügigste Meinung.',
    back: 'Live-Session',

    playersLabel: 'Spieler',
    buyInLabel: 'Buy-in je Spieler',
    rebuysLabel: 'Zusätzliche Buy-ins',
    rebuysHint: 'Rebuys und Add-ons zusammen',
    roundingLabel: 'Runden auf',
    roundingHint: 'Der kleinste Schein oder Chip, der am Tisch liegt',
    roundingNone: 'nicht runden',

    potLabel: 'Im Topf',
    placesPaid: (n: number) => (n === 1 ? '1 Platz wird bezahlt' : `${n} Plätze werden bezahlt`),
    place: (n: number) => `${n}.`,
    restNote: (rest: string) =>
      `${rest} Rundungsrest liegen auf Platz 1 – abwärts gerundet, damit nie mehr versprochen wird, als im Topf ist.`,

    emptyTitle: 'Noch nichts zu rechnen',
    emptyBody: 'Ab zwei Spielern und einem Buy-in über null steht der Plan.',

    ruleTitle: 'Wonach sich das richtet',
    ruleBody:
      'Faustregel: etwa jeder zehnte Spieler wird bezahlt, mindestens einer. Je größer das Feld, desto mehr Plätze sehen Geld – und desto weniger bekommt der Sieger relativ.',
    smallFieldNote:
      'Unter sechs Spielern bekommt nur der Sieger etwas. Ein zweiter Platz bekäme sonst weniger zurück, als er eingezahlt hat.',

    printHint: 'Vor dem ersten Blatt zeigen, nicht nach dem letzten.',
  },
  {
    eyebrow: 'Live session',
    title: 'Payouts',
    sub: 'Who gets what at the end? Settle it at the start of the night – afterwards the winner has the most generous opinion.',
    back: 'Live session',

    playersLabel: 'Players',
    buyInLabel: 'Buy-in per player',
    rebuysLabel: 'Extra buy-ins',
    rebuysHint: 'Rebuys and add-ons combined',
    roundingLabel: 'Round to',
    roundingHint: 'The smallest note or chip on the table',
    roundingNone: 'no rounding',

    potLabel: 'In the pot',
    placesPaid: (n: number) => (n === 1 ? '1 place gets paid' : `${n} places get paid`),
    place: (n: number) => `${n}.`,
    restNote: (rest: string) =>
      `${rest} left over from rounding goes to first place – rounded down, so the plan never promises more than the pot holds.`,

    emptyTitle: 'Nothing to work out yet',
    emptyBody: 'From two players and a buy-in above zero, the plan appears.',

    ruleTitle: 'What this is based on',
    ruleBody:
      'Rule of thumb: roughly one in ten players gets paid, at least one. The bigger the field, the more places see money – and the less the winner takes relatively.',
    smallFieldNote:
      'Below six players only the winner gets paid. Second place would otherwise get back less than they put in.',

    printHint: 'Show it before the first hand, not after the last.',
  },
);
