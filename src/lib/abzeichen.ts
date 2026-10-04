/* Welche Abzeichen das Profil zeigt.
   ==================================

   22 Abzeichen auf einmal — drei verdiente zwischen neunzehn grauen Kacheln —
   waren 1700 bis 2100 Pixel Wand (E-095). Das Profil zeigt jetzt, was zählt:
   die zuletzt verdienten (höchstens sechs), die nächsten drei, und für den
   Rest eine Zeile. „Alle ansehen“ öffnet die Sammlung vollständig.

   Reine Auswahl ohne Oberfläche, damit sie sich prüfen lässt. */

export interface Ansicht<T extends { id: string }> {
  /** Die zuletzt verdienten, das neueste zuerst. */
  verdient: Array<{ def: T; seit: string }>;
  /** Wie viele verdiente über die gezeigten hinaus es noch gibt. */
  weitereVerdient: number;
  /** Die nächsten in der Reihenfolge der Sammlung, die noch fehlen. */
  naechste: T[];
  /** Wie viele insgesamt noch fehlen (die nächsten eingerechnet). */
  offen: number;
}

export const ZEIGE_VERDIENT = 6;
export const ZEIGE_NAECHSTE = 3;

export function waehleAbzeichen<T extends { id: string }>(
  alle: T[],
  erworben: Record<string, string>,
  verdientMax = ZEIGE_VERDIENT,
  naechsteMax = ZEIGE_NAECHSTE,
): Ansicht<T> {
  const mit = alle
    .map((def, i) => ({ def, i, seit: erworben[def.id] }))
    .filter((x): x is { def: T; i: number; seit: string } => typeof x.seit === 'string' && x.seit !== '');
  /* Das neueste zuerst; beim selben Zeitstempel die spätere der Sammlung, weil
     sie meist die schwerere ist. Ein unlesbares Datum zählt als alt. */
  const zeit = (s: string) => {
    const t = Date.parse(s);
    return Number.isNaN(t) ? -Infinity : t;
  };
  mit.sort((a, b) => zeit(b.seit) - zeit(a.seit) || b.i - a.i);
  const fehlend = alle.filter((d) => !(typeof erworben[d.id] === 'string' && erworben[d.id] !== ''));
  return {
    verdient: mit.slice(0, verdientMax).map(({ def, seit }) => ({ def, seit })),
    weitereVerdient: Math.max(0, mit.length - verdientMax),
    naechste: fehlend.slice(0, naechsteMax),
    offen: fehlend.length,
  };
}
