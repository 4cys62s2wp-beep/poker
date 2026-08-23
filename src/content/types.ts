// Zentrale Typdefinitionen für alle Lerninhalte.
// Diese Schemas werden von den Modul-Dateien (m1.ts – m8.ts), dem Glossar
// und den Trainern verwendet.

export type Level = 'Einsteiger' | 'Fortgeschritten' | 'Profi';

export interface QuizQuestion {
  /** Die Frage (Deutsch, du-Form). */
  question: string;
  /** 3–4 Antwortoptionen. */
  options: string[];
  /** Index der korrekten Antwort in `options`. */
  correctIndex: number;
  /** Kurze Erklärung, warum die Antwort korrekt ist. */
  explanation: string;
}

export interface LessonSection {
  heading: string;
  /**
   * Fließtext im Markdown-Lite-Format:
   * - Absätze durch Leerzeile getrennt
   * - **fett** für Betonung
   * - Zeilen, die mit "- " beginnen, werden als Liste gerendert
   */
  body: string;
  /** Optional: konkretes Beispiel (wird als hervorgehobene Box gerendert). */
  example?: string;
  /** Optional: Coach-Tipp (wird als Tipp-Box gerendert). */
  tip?: string;
  /** Optional: kleine Tabelle. */
  table?: { headers: string[]; rows: string[][] };
  /** Optional: Karten, die als Grafik gerendert werden, z. B. ["As", "Kh"].
   *  Format: Rang (2-9, T, J, Q, K, A) + Farbe (s=Pik, h=Herz, d=Karo, c=Kreuz). */
  cards?: string[];
}

export interface Lesson {
  /** Eindeutige ID, z. B. "m1-l1". */
  id: string;
  title: string;
  /** Geschätzte Lesedauer in Minuten. */
  duration: number;
  /** Kurze Einleitung (1–3 Sätze). */
  intro: string;
  sections: LessonSection[];
  /** 3–5 Kernaussagen zum Mitnehmen. */
  takeaways: string[];
  /** 4–6 Quizfragen zur Lektion. */
  quiz: QuizQuestion[];
}

export interface Module {
  /** Eindeutige ID, z. B. "m1". */
  id: string;
  title: string;
  subtitle: string;
  /** Ein Emoji als Icon. */
  icon: string;
  level: Level;
  lessons: Lesson[];
}

export type GlossaryCategory =
  | 'Grundlagen'
  | 'Aktionen'
  | 'Mathematik'
  | 'Strategie'
  | 'Online'
  | 'Live'
  | 'Turnier'
  | 'Slang';

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: GlossaryCategory;
  /** Verwandte Begriffe (exakte `term`-Strings anderer Einträge). */
  related?: string[];
}
