/* Zufall aus einem Startwert.
   ===========================

   Dasselbe Datum soll dieselbe Auswahl geben (Tages-Quiz, Hand des Tages);
   ein frischer Startwert je Durchgang soll eine andere geben (Optionen
   mischen). Beides ist derselbe Zahlenstrom mit anderem Anfang. */

/** Ein deterministischer Zahlenstrom in [0, 1) aus einem Text.
 *
 *  Der Text wird erst gründlich durchgemischt (xmur3) und speist dann einen
 *  guten Zahlenstrom (mulberry32). Die erste Fassung — ein einfacher
 *  Kongruenzgenerator direkt auf der Quersumme des Textes — gab ähnlichen
 *  Texten („s1", „s2", …) fast dieselben ersten Zahlen: Von 24 möglichen
 *  Anordnungen kamen bei 40 Startwerten sechs vor. */
export function seededRng(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ein frischer Startwert, der sich bei jedem Aufruf unterscheidet. */
export function frischerStartwert(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
