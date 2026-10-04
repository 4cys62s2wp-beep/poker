// Abzeichen-Definitionen. Die Vergabelogik liegt in src/state/AppState.tsx.

import type { IconName } from '../components/Icon';

export interface BadgeDef {
  id: string;
  /** Das Zeichen der Medaille (E-095) — ein Symbol aus dem eigenen Satz statt eines
   *  Emoji, das auf jedem Gerät anders aussieht und sich nicht einfärben lässt. */
  icon: IconName;
  title: string;
  description: string;
}

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', icon: 'learn', title: 'Erste Schritte', description: 'Erste Lektion abgeschlossen' },
  { id: 'quiz-perfect', icon: 'check', title: 'Fehlerfrei', description: 'Ein Quiz ohne Fehler bestanden' },
  { id: 'module-basics', icon: 'notes', title: 'Grundausbildung', description: 'Modul „Grundlagen“ abgeschlossen' },
  { id: 'module-math', icon: 'pie', title: 'Mathe-Ass', description: 'Modul „Poker-Mathematik“ abgeschlossen' },
  { id: 'five-lessons', icon: 'glossary', title: 'Wissbegierig', description: '5 Lektionen abgeschlossen' },
  { id: 'twenty-lessons', icon: 'grid', title: 'Stammschüler', description: '20 Lektionen abgeschlossen' },
  { id: 'all-modules', icon: 'crown', title: 'Absolvent', description: 'Alle Module abgeschlossen' },
  { id: 'trainer-first', icon: 'trainer', title: 'Aufgewärmt', description: 'Erste Trainer-Aufgabe gelöst' },
  { id: 'trainer-streak-10', icon: 'flame', title: 'Heißgelaufen', description: '10 richtige Antworten in Serie in einem Trainer' },
  { id: 'trainer-100', icon: 'bolt', title: 'Trainingsfleiß', description: '100 richtige Trainer-Antworten insgesamt' },
  { id: 'first-hand', icon: 'cards', title: 'Erste Hand', description: 'Erste Hand am Übungstisch gespielt' },
  { id: 'first-win', icon: 'coin', title: 'Erster Pot', description: 'Erste Hand am Übungstisch gewonnen' },
  { id: 'hands-100', icon: 'tools', title: 'Grinder', description: '100 Hände am Übungstisch gespielt' },
  { id: 'bankroll-start', icon: 'chart', title: 'Buchhalter', description: 'Erste Session im Bankroll-Tracker erfasst' },
  { id: 'daily-quiz', icon: 'sun', title: 'Tagesform', description: 'Erstes Tages-Quiz absolviert' },
  { id: 'scenario-10', icon: 'scene', title: 'Spot-Analyst', description: '10 Szenarien richtig gelöst' },
  { id: 'pushfold-20', icon: 'push', title: 'All-in-Meister', description: '20 Push/Fold-Aufgaben richtig' },
  { id: 'review-clear', icon: 'repeat', title: 'Alles im Kopf', description: 'Wiederholungsstapel geleert' },
  { id: 'streak-3', icon: 'calendar', title: 'Dranbleiber', description: 'An 3 Tagen in Folge gelernt' },
  { id: 'streak-7', icon: 'history', title: 'Wochenkämpfer', description: 'An 7 Tagen in Folge gelernt' },
  { id: 'level-5', icon: 'star', title: 'Aufsteiger', description: 'Level 5 erreicht' },
  { id: 'level-10', icon: 'trophy', title: 'Poker-Mentor', description: 'Level 10 erreicht' },
];
