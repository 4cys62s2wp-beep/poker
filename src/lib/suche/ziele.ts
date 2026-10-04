/* Wohin die Suche führen kann.
   ============================

   Alle Werkzeuge, Trainer und Seiten, die jemand suchen würde — mit den
   Stichworten, unter denen er sie sucht. Der Name kommt aus der Ortstabelle
   (`orte.ts`, ein Name pro Ort), der erklärende Satz aus den Texten der Seite,
   wo es einen gibt. Die Stichworte stehen in beiden Sprachen: Wer auf Deutsch
   „Auszahlung“ tippt, soll es auch finden, wenn die Oberfläche englisch ist. */

import type { Lang } from '../../i18n';
import { STR as NACHSCHLAGEN } from '../../i18n/pages/nachschlagen';
import { STR as TRAINERTEXTE } from '../../i18n/pages/trainerhub';
import { STR as LERNEN } from '../../i18n/pages/learn';
import { TRAINER } from '../trainerliste';
import { ortName, type OrtPfad } from '../orte';
import type { Ziel } from './index';

type Beschreibung = (l: Lang) => string;

const ohne: Beschreibung = () => '';

interface Eintrag {
  pfad: OrtPfad;
  beschreibung: Beschreibung;
  keywords: string[];
}

const EINTRAEGE: Eintrag[] = [
  /* Lernen */
  { pfad: '/lernen/drill', beschreibung: (l) => LERNEN[l].drillSub, keywords: ['pot odds', 'call', 'drill', 'rechnen', 'quote'] },
  { pfad: '/lernen/wiederholen', beschreibung: (l) => LERNEN[l].reviewSub, keywords: ['wiederholen', 'review', 'karteikarten', 'fällig', 'due'] },
  { pfad: '/lernen/tagesquiz', beschreibung: (l) => LERNEN[l].quizSub, keywords: ['quiz', 'täglich', 'daily', 'tagesquiz'] },
  { pfad: '/lernen/uebungstisch', beschreibung: (l) => LERNEN[l].practiceSub, keywords: ['tisch', 'üben', 'spielen', 'practice', 'table', 'bots', 'computergegner'] },
  { pfad: '/lernen/statistik', beschreibung: ohne, keywords: ['spielstil', 'stil', 'statistik', 'vpip', 'play style', 'stats'] },

  /* Nachschlagen */
  { pfad: '/nachschlagen/coach', beschreibung: (l) => NACHSCHLAGEN[l].coachDesc, keywords: ['coach', 'hand', 'empfehlung', 'advice', 'was tun', 'spot'] },
  { pfad: '/nachschlagen/glossar', beschreibung: (l) => NACHSCHLAGEN[l].glossaryDesc, keywords: ['glossar', 'glossary', 'begriff', 'term', 'bedeutung', 'wort'] },
  { pfad: '/nachschlagen/haende', beschreibung: (l) => NACHSCHLAGEN[l].handsDesc, keywords: ['starthand', 'starting hand', 'hände', 'hands', 'position'] },
  { pfad: '/nachschlagen/ranges', beschreibung: (l) => NACHSCHLAGEN[l].rangesDesc, keywords: ['range', 'chart', 'raster', 'open', 'eröffnen', '3bet', '3-bet', 'rfi'] },
  { pfad: '/nachschlagen/odds', beschreibung: (l) => NACHSCHLAGEN[l].oddsDesc, keywords: ['odds', 'outs', 'pot odds', 'wahrscheinlichkeit', 'chance', 'prozent'] },
  { pfad: '/nachschlagen/equity', beschreibung: (l) => NACHSCHLAGEN[l].equityDesc, keywords: ['equity', 'rechner', 'calculator', 'gegen', 'versus', 'ausrechnen'] },
  { pfad: '/nachschlagen/tells', beschreibung: (l) => NACHSCHLAGEN[l].tellsDesc, keywords: ['tell', 'tells', 'read', 'gegner', 'körpersprache', 'verhalten'] },

  /* Live-Session */
  { pfad: '/session/live/einrichten', beschreibung: ohne, keywords: ['abend', 'turnier', 'blinds', 'uhr', 'timer', 'cash game', 'evening', 'clock', 'einrichten'] },
  { pfad: '/session/abende', beschreibung: ohne, keywords: ['abende', 'früher', 'historie', 'abend', 'evenings', 'history'] },
  { pfad: '/session/chips', beschreibung: ohne, keywords: ['chips', 'koffer', 'verteilung', 'stapel', 'case', 'stack'] },
  { pfad: '/session/auszahlung', beschreibung: ohne, keywords: ['auszahlung', 'preisgeld', 'plätze', 'payout', 'prizes', 'preise'] },
  { pfad: '/session/bankroll', beschreibung: ohne, keywords: ['bankroll', 'gewinn', 'verlust', 'sessions', 'tracker', 'profit', 'csv'] },

  /* Profil */
  { pfad: '/profil/einstellungen', beschreibung: ohne, keywords: ['einstellungen', 'sprache', 'farbe', 'dunkel', 'hell', 'backup', 'sichern', 'konto', 'settings', 'language', 'dark', 'light', 'account'] },
];

/** Alle Ziele der Suche in der gewählten Sprache. */
export function werkzeugZiele(lang: Lang): Ziel[] {
  const aus: Ziel[] = EINTRAEGE.map((e) => ({
    to: e.pfad, titel: ortName(e.pfad, lang), beschreibung: e.beschreibung(lang), keywords: e.keywords,
  }));
  for (const t of TRAINER) {
    const text = TRAINERTEXTE[lang].trainers[t.id];
    aus.push({ to: t.zu, titel: text.title, beschreibung: text.desc, keywords: ['trainer', 'üben', 'aufgabe', 'training'] });
  }
  return aus;
}
