import { defineStrings } from '..';

/* Texte für Pro-Insights (/pros). Profile, Fehler, Edge-Spots und die
   Quellen-Notiz kommen aus dem sprachabhängigen Content-Bundle. */
export const STR = defineStrings(
  {
    eyebrow: 'Von den Besten lernen',
    title: 'Pro-Insights',
    sub: 'Was Fedor Holz, Daniel Negreanu, Doug Polk & Co. wirklich lehren – verdichtet auf die Prinzipien, die dein Spiel verändern. Dazu: die teuersten Anfängerfehler aus Profi-Sicht und die Spots, in denen dein Edge liegt.',
    headsTitle: 'Die Köpfe',
    mistakesTitle: 'Die teuersten Anfängerfehler – aus Profi-Sicht',
    source: (s: string) => `Quelle: ${s}`,
    edgeTitle: 'Wo dein Edge liegt',
  },
  {
    eyebrow: 'Learn from the best',
    title: 'Pro Insights',
    sub: 'What Fedor Holz, Daniel Negreanu, Doug Polk & co. actually teach – distilled into the principles that will change your game. Plus: the most expensive beginner mistakes from a pro’s perspective, and the spots where your edge lies.',
    headsTitle: 'The Minds',
    mistakesTitle: 'The most expensive beginner mistakes – from a pro’s perspective',
    source: (s: string) => `Source: ${s}`,
    edgeTitle: 'Where your edge lies',
  },
);
