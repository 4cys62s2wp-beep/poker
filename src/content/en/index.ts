/* Englisches Inhalts-Bundle. Wird per dynamischem Import geladen,
   sobald die Sprache auf Englisch steht – deutsche Nutzer laden es nie.
   HINWEIS: Platzhalter, wird nach der Übersetzung durch echte EN-Dateien ersetzt. */

import { DE_BUNDLE, type ContentBundle } from '../../i18n';

export const EN_BUNDLE: ContentBundle = DE_BUNDLE;
