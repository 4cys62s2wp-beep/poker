/* Die Zahlen der Pro-Seite — aus `plan.ts`, nicht aus dem Gedächtnis (E-099).
   =========================================================================

   Die Tabelle sagte „Trainer 5 von 7 / Alle 7“, als es acht gab, und „Alle 9
   Module statt 4“, „24 Spots“ — Zahlen, die jemand einmal in einen Text
   geschrieben hat. Jetzt rechnet diese Funktion sie aus den Regeln und den
   Inhalten; die Texte setzen sie nur ein. Ein Test hält fest, dass eine
   geänderte Grenze die Seite ändert. */

import { FEATURE_RULES, FREE_MODULE_IDS, GRATIS_TRAINER_ANZAHL, isFreeModule } from './plan';

export interface VergleichsZahlen {
  moduleFrei: number;
  moduleAlle: number;
  /** Lektionen, die Pro zusätzlich öffnet: alle in den gesperrten Modulen
      außer der ersten je Modul, die gratis bleibt. */
  lektionenMehr: number;
  trainerFrei: number;
  trainerAlle: number;
  coachProTag: number;
  tischProTag: number;
  spots: number;
  profile: number;
}

export interface Inhaltsstand {
  module: ReadonlyArray<{ id: string; lessons: ReadonlyArray<unknown> }>;
  /** Trainer in der Liste (ohne den Pot-Odds-Drill, der immer dazukommt). */
  trainerInListe: number;
  szenarien: number;
  profile: number;
}

export function vergleichsZahlen(inhalt: Inhaltsstand): VergleichsZahlen {
  const gesperrt = inhalt.module.filter((m) => !isFreeModule(m.id));
  return {
    moduleFrei: FREE_MODULE_IDS.length,
    moduleAlle: inhalt.module.length,
    lektionenMehr: gesperrt.reduce((summe, m) => summe + Math.max(0, m.lessons.length - 1), 0),
    trainerFrei: GRATIS_TRAINER_ANZAHL,
    trainerAlle: inhalt.trainerInListe + 1,
    coachProTag: FEATURE_RULES.coach.freeDailyLimit ?? 0,
    tischProTag: FEATURE_RULES['play-hands'].freeDailyLimit ?? 0,
    spots: inhalt.szenarien,
    profile: inhalt.profile,
  };
}
