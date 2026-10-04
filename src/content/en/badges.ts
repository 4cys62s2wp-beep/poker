// Badge definitions. The awarding logic lives in src/state/AppState.tsx.

import type { BadgeDef } from '../badges';

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', icon: 'learn', title: 'First Steps', description: 'Completed your first lesson' },
  { id: 'quiz-perfect', icon: 'check', title: 'Flawless', description: 'Passed a quiz without a single mistake' },
  { id: 'module-basics', icon: 'notes', title: 'Basic Training', description: 'Completed the “Fundamentals” module' },
  { id: 'module-math', icon: 'pie', title: 'Math Whiz', description: 'Completed the “Poker Math” module' },
  { id: 'five-lessons', icon: 'glossary', title: 'Curious Mind', description: 'Completed 5 lessons' },
  { id: 'twenty-lessons', icon: 'grid', title: 'Regular Student', description: 'Completed 20 lessons' },
  { id: 'all-modules', icon: 'crown', title: 'Graduate', description: 'Completed all modules' },
  { id: 'trainer-first', icon: 'trainer', title: 'Warmed Up', description: 'Solved your first trainer exercise' },
  { id: 'trainer-streak-10', icon: 'flame', title: 'On Fire', description: '10 correct answers in a row in one trainer' },
  { id: 'trainer-100', icon: 'bolt', title: 'Training Grind', description: '100 correct trainer answers in total' },
  { id: 'first-hand', icon: 'cards', title: 'First Hand', description: 'Played your first hand at the practice table' },
  { id: 'first-win', icon: 'coin', title: 'First Pot', description: 'Won your first hand at the practice table' },
  { id: 'hands-100', icon: 'tools', title: 'Grinder', description: 'Played 100 hands at the practice table' },
  { id: 'bankroll-start', icon: 'chart', title: 'Bookkeeper', description: 'Logged your first session in the bankroll tracker' },
  { id: 'daily-quiz', icon: 'sun', title: 'Daily Form', description: 'Completed your first daily quiz' },
  { id: 'scenario-10', icon: 'scene', title: 'Spot Analyst', description: 'Solved 10 scenarios correctly' },
  { id: 'pushfold-20', icon: 'push', title: 'Shove Master', description: '20 push/fold exercises correct' },
  { id: 'review-clear', icon: 'repeat', title: 'All in Your Head', description: 'Cleared the review stack' },
  { id: 'streak-3', icon: 'calendar', title: 'Sticking With It', description: 'Studied 3 days in a row' },
  { id: 'streak-7', icon: 'history', title: 'Week Warrior', description: 'Studied 7 days in a row' },
  { id: 'level-5', icon: 'star', title: 'Riser', description: 'Reached level 5' },
  { id: 'level-10', icon: 'trophy', title: 'Poker Mentor', description: 'Reached level 10' },
];
