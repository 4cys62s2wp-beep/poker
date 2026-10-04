import { defineStrings } from '..';

/* Texte des Bereichs „Live-Session" (src/pages/SessionPage.tsx).

   Hier sitzt jemand am echten Tisch. Die Frage ist nie „was ist das?",
   sondern „wann brauche ich das?" – deshalb trägt jede Karte eine Zeile,
   die genau das beantwortet. */
export const STR = defineStrings(
  {
    title: 'Live-Session',
    sub: 'Chips einteilen, Blinds hochziehen, am Ende gerecht auszahlen.',

    chipsTitle: 'Chip-Rechner',
    chipsWhen: 'Bevor die erste Karte fällt',

    payoutTitle: 'Auszahlung',
    payoutWhen: 'Vorab festlegen, wer wie viel bekommt',



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
    abendLaeuft: (dauer: string) => `Der Abend läuft — seit ${dauer}`,
    abendeStand: (n: number, wann: string) =>
      `${n === 1 ? '1 Abend' : `${n} Abende`} · zuletzt ${wann}`,
    abendeLeer: 'Noch kein Abend gespeichert',
    bankrollStand: (n: number, bilanz: string) =>
      `${n === 1 ? '1 Session' : `${n} Sessions`} · Bilanz ${bilanz}`,

    sessionsLabel: 'Sessions',
    resultLabel: 'Bilanz',
    handsLabel: 'Hände am Tisch',
  },
  {
    title: 'Live session',
    sub: 'Split the chips, raise the blinds, pay out fairly at the end.',

    chipsTitle: 'Chip calculator',
    chipsWhen: 'Before the first card',

    payoutTitle: 'Payouts',
    payoutWhen: 'Settle up front who gets what',



    abendTitle: 'Run the evening',
    abendWhen: 'From the first hand to the last',

    abendeTitle: 'Earlier evenings',

    bankrollTitle: 'Bankroll',
    bankrollWhen: 'After the session',

    markeVorher: 'Before',
    markeAbend: 'During',
    markeDanach: 'After',

    abendLaeuft: (dauer: string) => `The evening is running — for ${dauer}`,
    abendeStand: (n: number, wann: string) =>
      `${n === 1 ? '1 night' : `${n} nights`} · last ${wann}`,
    abendeLeer: 'No night saved yet',
    bankrollStand: (n: number, bilanz: string) =>
      `${n === 1 ? '1 session' : `${n} sessions`} · result ${bilanz}`,

    sessionsLabel: 'sessions',
    resultLabel: 'Balance',
    handsLabel: 'hands at the table',
  },
);
