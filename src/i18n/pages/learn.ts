import { defineStrings } from '..';

/* Texte der Lernpfad-Übersicht. */
export const STR = defineStrings(
  {
    eyebrow: 'Dein Curriculum',
    title: 'Lernpfad',
    sub: 'Neun Module vom ersten Blatt bis zu Profi-Strategie und Varianten. Arbeite sie der Reihe nach durch – jede Lektion endet mit einem Quiz, das dein Verständnis prüft und XP bringt.',
    searchPlaceholder: 'Alle Lektionen durchsuchen … (z. B. „Pot Odds“, „Tilt“, „Squeeze“)',
    noHits: 'Kein Treffer – versuch einen anderen Begriff (oder schau im Glossar).',
    sectionSnippet: (heading: string) => `Abschnitt: ${heading}`,
    proTitle: 'Pro-Insights: Von den Besten lernen',
    proSub: 'Die Prinzipien von Fedor Holz, Negreanu, Polk & Co. – plus die teuersten Anfängerfehler aus Profi-Sicht.',
    newPill: 'Neu',
    moduleN: (n: number) => `Modul ${n}`,
    lockedHint: 'Nur mit Pro freigeschaltet',
    doneLine: (done: number, total: number) => `${done} / ${total} Lektionen abgeschlossen`,
  },
  {
    eyebrow: 'Your Curriculum',
    title: 'Learning Path',
    sub: 'Nine modules from your first hand to pro strategy and variants. Work through them in order – every lesson ends with a quiz that checks your understanding and earns you XP.',
    searchPlaceholder: 'Search all lessons … (e.g. “Pot Odds”, “Tilt”, “Squeeze”)',
    noHits: 'No matches – try a different term (or check the glossary).',
    sectionSnippet: (heading: string) => `Section: ${heading}`,
    proTitle: 'Pro Insights: Learn from the Best',
    proSub: 'The principles of Fedor Holz, Negreanu, Polk & co. – plus the most expensive beginner mistakes from a pro’s point of view.',
    newPill: 'New',
    moduleN: (n: number) => `Module ${n}`,
    lockedHint: 'Unlocked with Pro',
    doneLine: (done: number, total: number) => `${done} / ${total} lessons completed`,
  },
);
