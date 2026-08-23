// Abzeichen-Definitionen. Die Vergabelogik liegt in src/state/AppState.tsx.

export interface BadgeDef {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', icon: '📖', title: 'Erste Schritte', description: 'Erste Lektion abgeschlossen' },
  { id: 'quiz-perfect', icon: '💯', title: 'Fehlerfrei', description: 'Ein Quiz ohne Fehler bestanden' },
  { id: 'module-basics', icon: '🎓', title: 'Grundausbildung', description: 'Modul „Grundlagen“ abgeschlossen' },
  { id: 'module-math', icon: '🧮', title: 'Mathe-Ass', description: 'Modul „Poker-Mathematik“ abgeschlossen' },
  { id: 'five-lessons', icon: '📚', title: 'Wissbegierig', description: '5 Lektionen abgeschlossen' },
  { id: 'twenty-lessons', icon: '🏫', title: 'Stammschüler', description: '20 Lektionen abgeschlossen' },
  { id: 'all-modules', icon: '👑', title: 'Absolvent', description: 'Alle Module abgeschlossen' },
  { id: 'trainer-first', icon: '🎯', title: 'Aufgewärmt', description: 'Erste Trainer-Aufgabe gelöst' },
  { id: 'trainer-streak-10', icon: '🔥', title: 'Heißgelaufen', description: '10 richtige Antworten in Serie in einem Trainer' },
  { id: 'trainer-100', icon: '🏋️', title: 'Trainingsfleiß', description: '100 richtige Trainer-Antworten insgesamt' },
  { id: 'first-hand', icon: '🃏', title: 'Erste Hand', description: 'Erste Hand am Übungstisch gespielt' },
  { id: 'first-win', icon: '💰', title: 'Erster Pot', description: 'Erste Hand am Übungstisch gewonnen' },
  { id: 'hands-100', icon: '🎰', title: 'Grinder', description: '100 Hände am Übungstisch gespielt' },
  { id: 'bankroll-start', icon: '📒', title: 'Buchhalter', description: 'Erste Session im Bankroll-Tracker erfasst' },
  { id: 'streak-3', icon: '📅', title: 'Dranbleiber', description: 'An 3 Tagen in Folge gelernt' },
  { id: 'streak-7', icon: '🗓️', title: 'Wochenkämpfer', description: 'An 7 Tagen in Folge gelernt' },
  { id: 'level-5', icon: '⭐', title: 'Aufsteiger', description: 'Level 5 erreicht' },
  { id: 'level-10', icon: '🌟', title: 'Poker-Mentor', description: 'Level 10 erreicht' },
];
