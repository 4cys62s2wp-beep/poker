import { defineStrings } from '..';

/* Texte des Bereichs „Live-Session" (src/pages/SessionPage.tsx).

   Hier sitzt jemand am echten Tisch. Die Frage ist nie „was ist das?",
   sondern „wann brauche ich das?" – deshalb trägt jede Karte eine Zeile,
   die genau das beantwortet. */
export const STR = defineStrings(
  {
    eyebrow: 'Live-Session',
    title: 'Der Abend läuft',
    sub: 'Chips einteilen, Blinds hochziehen, am Ende gerecht auszahlen.',
    backHome: 'Start',

    chipsTitle: 'Chip-Rechner',
    chipsWhen: 'Bevor die erste Karte fällt',

    payoutTitle: 'Auszahlung',
    payoutWhen: 'Bevor gespielt wird, nicht danach',



    abendTitle: 'Abend führen',
    abendWhen: 'Vom ersten bis zum letzten Blatt',

    abendeTitle: 'Frühere Abende',

    bankrollTitle: 'Bankroll',
    bankrollWhen: 'Nach der Session',

    /* Der Zeitpunkt im Ablauf als Marke, nicht als Absatz (E-042). */
    markeVorher: 'Vorher',
    markeAbend: 'Am Abend',
    markeDanach: 'Danach',

    /* Und der eigene Stand, wo es einen gibt. */
    laeuftSeit: (dauer: string) => `Läuft seit ${dauer}`,
    abendeStand: (n: number, wann: string) =>
      `${n === 1 ? '1 Abend' : `${n} Abende`} · zuletzt ${wann}`,
    abendeLeer: 'Noch kein Abend erfasst',
    bankrollStand: (n: number, bilanz: string) =>
      `${n === 1 ? '1 Session' : `${n} Sessions`} · Bilanz ${bilanz}`,

    sessionsLabel: 'Sessions',
    resultLabel: 'Bilanz',
    handsLabel: 'Hände am Tisch',
  },
  {
    eyebrow: 'Live session',
    title: 'The night is on',
    sub: 'Split the chips, raise the blinds, pay out fairly at the end.',
    backHome: 'Home',

    chipsTitle: 'Chip calculator',
    chipsWhen: 'Before the first card',

    payoutTitle: 'Payouts',
    payoutWhen: 'Before play starts, not after',



    abendTitle: 'Run the evening',
    abendWhen: 'From the first hand to the last',

    abendeTitle: 'Earlier evenings',

    bankrollTitle: 'Bankroll',
    bankrollWhen: 'After the session',

    markeVorher: 'Before',
    markeAbend: 'During',
    markeDanach: 'After',

    laeuftSeit: (dauer: string) => `Running for ${dauer}`,
    abendeStand: (n: number, wann: string) =>
      `${n === 1 ? '1 night' : `${n} nights`} · last ${wann}`,
    abendeLeer: 'No night recorded yet',
    bankrollStand: (n: number, bilanz: string) =>
      `${n === 1 ? '1 session' : `${n} sessions`} · result ${bilanz}`,

    sessionsLabel: 'sessions',
    resultLabel: 'Balance',
    handsLabel: 'hands at the table',
  },
);
