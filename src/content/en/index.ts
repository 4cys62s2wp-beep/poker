/* Englisches Inhalts-Bundle. Wird per dynamischem Import geladen,
   sobald die Sprache auf Englisch steht – deutsche Nutzer laden es nie. */

import type { ContentBundle } from '../../i18n';
import type { Module } from '../types';
import m1 from './modules/m1';
import m2 from './modules/m2';
import m3 from './modules/m3';
import m4 from './modules/m4';
import m5 from './modules/m5';
import m6 from './modules/m6';
import m7 from './modules/m7';
import m8 from './modules/m8';
import m9 from './modules/m9';
import glossary from './glossary';
import { TELLS, TELL_CATEGORIES } from './tells';
import { SCENARIOS } from './scenarios';
import { PRO_PROFILES, BEGINNER_MISTAKES, EDGE_SPOTS, PRO_SOURCE_NOTE } from './pros';
import { BADGES } from './badges';
import { PUSH_CHARTS, PUSH_STACK_INFO } from './pushfold';

const EN_MODULES: Module[] = [m1, m2, m3, m4, m5, m6, m7, m8, m9];

export const EN_BUNDLE: ContentBundle = {
  modules: EN_MODULES,
  glossary,
  tells: TELLS,
  tellCategories: TELL_CATEGORIES,
  scenarios: SCENARIOS,
  proProfiles: PRO_PROFILES,
  beginnerMistakes: BEGINNER_MISTAKES,
  edgeSpots: EDGE_SPOTS,
  proSourceNote: PRO_SOURCE_NOTE,
  badges: BADGES,
  pushCharts: PUSH_CHARTS,
  pushStackInfo: PUSH_STACK_INFO,
};
