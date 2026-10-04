import { defineStrings } from '..';
import type { ChipWarning } from '../../lib/chips';

/* Texte für den Chip-Rechner (/tools). Hinweise:
   - `colorNames` muss in der Reihenfolge zu CHIP_COLORS in ChipCalculator.tsx passen;
     die Namen dienen nur als Vorbelegung neuer Zeilen – vom Nutzer getippte Labels
     bleiben unverändert gespeichert.
   - `warnings` übersetzt die Hinweis-Codes (ChipWarning) aus lib/chips.ts;
     jede Funktion bekommt den Startstack in BB, auch wenn sie ihn nicht nutzt. */
export const STR = defineStrings(
  {
    title: 'Chip-Rechner',
    sub: 'Koffer aufmachen, Chips zählen, eintragen – und du bekommst sofort die faire Verteilung, den Startstack und passende Blinds. Auch wenn Chips fehlen oder ihr mehrere Koffer mischt.',
    playersQuestion: 'Wie viele Spieler seid ihr?',
    fewerPlayersAria: 'Weniger Spieler',
    morePlayersAria: 'Mehr Spieler',
    whichChips: 'Welche Chips habt ihr?',
    chipsHelp: 'Anzahl pro Sorte eintragen. Die Werte vergibt der Rechner nach derselben Regel wie „Abend einrichten“: Die häufigste Sorte ist der kleinste Chip und zugleich der Small Blind.',
    chipNameAria: 'Chip-Name',
    countPlaceholder: 'Stück',
    countAria: (label: string) => `Anzahl ${label}`,
    removeAria: (label: string) => `${label} entfernen`,
    addChip: '+ Chip-Sorte',
    presetNames: ['300er-Koffer', '500er-Koffer', '1000er-Koffer'],
    colorNames: ['Weiß', 'Rot', 'Blau', 'Grün', 'Schwarz', 'Lila', 'Orange', 'Gelb'],
    emptyHint: 'Trag mindestens eine Chip-Sorte mit Anzahl ein – es müssen genug Chips für alle Spieler da sein.',
    startStack: 'Startstack pro Spieler',
    stackSub: (bb: number) => `Punkte · entspricht ~${bb} Big Blinds`,
    blindsStart: 'Blinds zum Start',
    blindsSub: 'Small Blind / Big Blind',
    dealTitle: 'So teilt ihr aus – jeder Spieler bekommt:',
    thValue: 'Wert',
    thCount: 'Stück',
    thPoints: 'Punkte',
    thLeftover: 'übrig',
    bankNote: 'Übrige Chips kommen in die Bank – zum Wechseln oder für Rebuys.',
    tourneyTitle: 'Turnier-Modus: Blind-Fahrplan',
    tourneyHelp: 'Erhöht die Blinds alle 15–20 Minuten eine Stufe (kürzer = schnelleres Turnier). Bei einem Cash-Game bleiben die Start-Blinds einfach den ganzen Abend stehen.',
    toSetup: 'Mit diesem Koffer Abend einrichten →',
    thLevel: 'Stufe',
    thSmallBlind: 'Small Blind',
    thBigBlind: 'Big Blind',
    warnings: {
      fewSmallChips: (_bb: number) =>
        'Ihr habt pro Person nur wenige kleine Chips – tauscht am Tisch großzügig oder gebt eine Sorte komplett als Kleingeld aus.',
      shortStacks: (bb: number) =>
        `Kurze Stacks (~${bb} BB): Das wird ein schnelles Spiel. Für längere Abende Blinds seltener erhöhen.`,
      chipsBelowPlayers: (_bb: number) =>
        'Von mindestens einer Sorte gibt es weniger Chips als Spieler – diese Chips bleiben in der Bank.',
      unusedChips: (_bb: number) =>
        'Mehr als fünf Sorten kann am Tisch niemand auseinanderhalten: Die seltensten bleiben im Koffer.',
    } as Record<ChipWarning, (stackBB: number) => string>,
  },
  {
    title: 'Chip Calculator',
    sub: 'Open the case, count your chips, type them in – and you instantly get a fair distribution, the starting stack and sensible blinds. Even if chips are missing or you’re mixing several sets.',
    playersQuestion: 'How many players are you?',
    fewerPlayersAria: 'Fewer players',
    morePlayersAria: 'More players',
    whichChips: 'Which chips do you have?',
    chipsHelp: 'Enter the count for each denomination. The calculator assigns values by the same rule as “Set up an evening”: the most plentiful chip is the smallest one and also the small blind.',
    chipNameAria: 'Chip name',
    countPlaceholder: 'Count',
    countAria: (label: string) => `Count of ${label}`,
    removeAria: (label: string) => `Remove ${label}`,
    addChip: '+ Chip type',
    presetNames: ['300-chip set', '500-chip set', '1000-chip set'],
    colorNames: ['White', 'Red', 'Blue', 'Green', 'Black', 'Purple', 'Orange', 'Yellow'],
    emptyHint: 'Enter at least one chip type with a count – there need to be enough chips for all players.',
    startStack: 'Starting stack per player',
    stackSub: (bb: number) => `points · equals ~${bb} big blinds`,
    blindsStart: 'Starting blinds',
    blindsSub: 'Small blind / big blind',
    dealTitle: 'How to deal them out – each player gets:',
    thValue: 'Value',
    thCount: 'Count',
    thPoints: 'Points',
    thLeftover: 'left over',
    bankNote: 'Leftover chips go to the bank – for making change or for rebuys.',
    tourneyTitle: 'Tournament mode: blind schedule',
    tourneyHelp: 'Raise the blinds one level every 15–20 minutes (shorter = a faster tournament). In a cash game, the starting blinds simply stay put all night.',
    toSetup: 'Set up an evening with this case →',
    thLevel: 'Level',
    thSmallBlind: 'Small blind',
    thBigBlind: 'Big blind',
    warnings: {
      fewSmallChips: (_bb: number) =>
        'You only have a few small chips per person – trade generously at the table or hand out one denomination purely as change.',
      shortStacks: (bb: number) =>
        `Short stacks (~${bb} BB): this will be a fast game. For longer nights, raise the blinds less often.`,
      chipsBelowPlayers: (_bb: number) =>
        'At least one denomination has fewer chips than players – those chips stay in the bank.',
      unusedChips: (_bb: number) =>
        'Nobody at the table can tell more than five denominations apart: the rarest ones stay in the case.',
    } as Record<ChipWarning, (stackBB: number) => string>,
  },
);
