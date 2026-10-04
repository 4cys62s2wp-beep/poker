import { defineStrings } from '..';

/* Texte des Auszahlungs-Rechners (src/pages/session/PayoutPage.tsx). */
export const STR = defineStrings(
  {
    title: 'Auszahlung',
    sub: 'Wer bekommt am Ende wie viel? Diese Frage gehört an den Anfang des Abends – danach hat der Sieger die großzügigste Meinung.',

    playersLabel: 'Spieler',
    buyInLabel: 'Buy-in je Spieler',
    rebuysLabel: 'Zusätzliche Buy-ins',
    rebuysHint: 'Rebuys und Add-ons zusammen',
    einheitLabel: 'Einheit',
    einheitEuro: 'Euro',
    einheitChips: 'Chips',
    ausAbend: 'Aus dem laufenden Abend übernehmen',
    ausAbendHinweis: (spieler: number, extra: number) =>
      extra > 0 ? `${spieler} Spieler, ${extra} zusätzliche Buy-ins` : `${spieler} Spieler, keine Rebuys`,
    zahlFehler: 'Das ist keine Zahl.',
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
    ruleBody: (staffel: string) =>
      `Je größer das Feld, desto mehr Plätze sehen Geld – und desto weniger bekommt der Sieger relativ. Bezahlte Plätze nach Feldgröße: ${staffel}.`,
    staffelTeil: (ab: number, plaetze: number) =>
      `ab ${ab} Spielern ${plaetze} ${plaetze === 1 ? 'Platz' : 'Plätze'}`,
    smallFieldNote:
      'Unter sechs Spielern bekommt nur der Sieger etwas. Ein zweiter Platz bekäme sonst weniger zurück, als er eingezahlt hat.',

    printHint: 'Vor dem ersten Blatt zeigen, nicht nach dem letzten.',
  },
  {
    title: 'Payouts',
    sub: 'Who gets what at the end? Settle it at the start of the night – afterwards the winner has the most generous opinion.',

    playersLabel: 'Players',
    buyInLabel: 'Buy-in per player',
    rebuysLabel: 'Extra buy-ins',
    rebuysHint: 'Rebuys and add-ons combined',
    einheitLabel: 'Unit',
    einheitEuro: 'Euro',
    einheitChips: 'Chips',
    ausAbend: 'Use the running evening',
    ausAbendHinweis: (spieler: number, extra: number) =>
      extra > 0 ? `${spieler} players, ${extra} extra buy-ins` : `${spieler} players, no rebuys`,
    zahlFehler: 'That is not a number.',
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
    ruleBody: (staffel: string) =>
      `The bigger the field, the more places see money – and the less the winner takes relatively. Places paid by field size: ${staffel}.`,
    staffelTeil: (ab: number, plaetze: number) =>
      `${plaetze} ${plaetze === 1 ? 'place' : 'places'} from ${ab} players`,
    smallFieldNote:
      'Below six players only the winner gets paid. Second place would otherwise get back less than they put in.',

    printHint: 'Show it before the first hand, not after the last.',
  },
);
