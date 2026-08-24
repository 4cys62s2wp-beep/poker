// Badge definitions. The awarding logic lives in src/state/AppState.tsx.

import type { BadgeDef } from '../badges';

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', icon: '📖', title: 'First Steps', description: 'Completed your first lesson' },
  { id: 'quiz-perfect', icon: '💯', title: 'Flawless', description: 'Passed a quiz without a single mistake' },
  { id: 'module-basics', icon: '🎓', title: 'Basic Training', description: 'Completed the "Fundamentals" module' },
  { id: 'module-math', icon: '🧮', title: 'Math Whiz', description: 'Completed the "Poker Math" module' },
  { id: 'five-lessons', icon: '📚', title: 'Curious Mind', description: 'Completed 5 lessons' },
  { id: 'twenty-lessons', icon: '🏫', title: 'Regular Student', description: 'Completed 20 lessons' },
  { id: 'all-modules', icon: '👑', title: 'Graduate', description: 'Completed all modules' },
  { id: 'trainer-first', icon: '🎯', title: 'Warmed Up', description: 'Solved your first trainer exercise' },
  { id: 'trainer-streak-10', icon: '🔥', title: 'On Fire', description: '10 correct answers in a row in one trainer' },
  { id: 'trainer-100', icon: '🏋️', title: 'Training Grind', description: '100 correct trainer answers in total' },
  { id: 'first-hand', icon: '🃏', title: 'First Hand', description: 'Played your first hand at the practice table' },
  { id: 'first-win', icon: '💰', title: 'First Pot', description: 'Won your first hand at the practice table' },
  { id: 'hands-100', icon: '🎰', title: 'Grinder', description: 'Played 100 hands at the practice table' },
  { id: 'bankroll-start', icon: '📒', title: 'Bookkeeper', description: 'Logged your first session in the bankroll tracker' },
  { id: 'daily-quiz', icon: '☀️', title: 'Daily Form', description: 'Completed your first daily quiz' },
  { id: 'scenario-10', icon: '🎬', title: 'Spot Analyst', description: 'Solved 10 scenarios correctly' },
  { id: 'pushfold-20', icon: '🚀', title: 'Shove Master', description: '20 push/fold exercises correct' },
  { id: 'review-clear', icon: '🧠', title: 'All in Your Head', description: 'Cleared the review stack' },
  { id: 'streak-3', icon: '📅', title: 'Sticking With It', description: 'Studied 3 days in a row' },
  { id: 'streak-7', icon: '🗓️', title: 'Week Warrior', description: 'Studied 7 days in a row' },
  { id: 'level-5', icon: '⭐', title: 'Riser', description: 'Reached level 5' },
  { id: 'level-10', icon: '🌟', title: 'Poker Mentor', description: 'Reached level 10' },
];
