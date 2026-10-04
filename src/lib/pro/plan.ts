/* Was ist gratis, was ist Pro?
   Diese Datei ist die EINZIGE Wahrheit über die Feature-Aufteilung.
   Reine Daten + reine Funktionen – vollständig testbar, kein React.

   Grundsatz (Fair-Freemium): Die kostenlose Version ist für sich genommen
   nützlich – ein Anfänger kann damit ernsthaft Poker lernen. Pro entfernt
   Limits und öffnet die Tiefe (Fortgeschrittene Module, Szenario- und
   Push/Fold-Trainer, Pro-Insights, unbegrenzter Coach und Übungstisch).
   Nichts, was gratis war, wird nachträglich weggesperrt: Bestandsdaten
   bleiben immer lesbar.

   Die Lernschleife bleibt gratis (E-098): Üben, Wiederholen und die
   Bewertung nach der Aktion. Ebenso Konto und Sicherung, Bankroll und Export –
   das sind die eigenen Daten, und Spielerschutz gehört nicht hinter eine
   Bezahlschranke. Pro verkauft Tiefe, keine Grundversorgung. */

export type FeatureKey =
  /** Module ab „Postflop" aufwärts (m4, m5, m7–m9). */
  | 'modules-advanced'
  /** Live-Coach: gratis mit Tageslimit. */
  | 'coach'
  /** Szenario-Trainer & Push/Fold-Trainer. */
  | 'trainers-advanced'
  /** Pro-Insights (Fedor Holz & Co.). */
  | 'pro-insights'
  /** Übungstisch: gratis mit Tageslimit an Händen. */
  | 'play-hands';

/** Ein Feature ist entweder ganz Pro oder gratis mit Tageslimit. */
export interface FeatureRule {
  key: FeatureKey;
  /** Tageslimit in der Gratis-Version. 0 = gar nicht nutzbar, undefined = unbegrenzt gratis. */
  freeDailyLimit?: number;
}

export const FEATURE_RULES: Record<FeatureKey, FeatureRule> = {
  'modules-advanced': { key: 'modules-advanced', freeDailyLimit: 0 },
  'trainers-advanced': { key: 'trainers-advanced', freeDailyLimit: 0 },
  'pro-insights': { key: 'pro-insights', freeDailyLimit: 0 },
  // Metered: gratis antesten, dann Limit
  'coach': { key: 'coach', freeDailyLimit: 3 },
  'play-hands': { key: 'play-hands', freeDailyLimit: 25 },
};

/**
 * Module, die in der Gratis-Version vollständig offen sind.
 * m1–m3: Grundlagen, Starthände, Mathematik – damit kann man ernsthaft lernen.
 * m6 („Psychologie & Bankroll"): enthält Suchtprävention und verantwortungs-
 * volles Spielen. Diese Inhalte hinter eine Paywall zu stellen, wäre bei einem
 * Poker-Produkt nicht vertretbar – sie bleiben dauerhaft frei.
 */
export const FREE_MODULE_IDS = ['m1', 'm2', 'm3', 'm6'] as const;

export function isFreeModule(moduleId: string): boolean {
  return (FREE_MODULE_IDS as readonly string[]).includes(moduleId);
}

/**
 * Die erste Lektion jedes Moduls ist immer frei: Wer den Anfang gesehen hat,
 * weiß, was ihm fehlt – das überzeugt weit besser als eine blanke Sperre.
 */
export function isFreeLesson(moduleId: string, lessonId: string): boolean {
  return isFreeModule(moduleId) || lessonId === `${moduleId}-l1`;
}

/** Trainer, die in der Gratis-Version offen sind (der Pot-Odds-Drill gehört
 *  dazu und steht nicht in der Trainerliste). */
export const FREE_TRAINER_PATHS = ['preflop', 'potodds', 'equity', 'handranking', 'outs'] as const;

/** Wie viele Trainer gratis sind: die fünf der Liste plus der Pot-Odds-Drill. */
export const GRATIS_TRAINER_ANZAHL = FREE_TRAINER_PATHS.length + 1;

/** Trainer hinter Pro. */
export const PRO_TRAINER_IDS = ['szenario', 'pushfold'] as const;

export function isFreeTrainer(trainerId: string): boolean {
  return (FREE_TRAINER_PATHS as readonly string[]).includes(trainerId);
}

/* Welche Adresse liegt hinter welchem Feature?
   Eine Tabelle, aus der Kacheln, Suche und Seiten ihr Schloss lesen — vorher
   trugen nur die Module eines, und die Seiten dahinter sperrten trotzdem. Ein
   Test (sperren.test.ts) hält fest, dass jede Seite mit `ProLock` hier steht. */
const PRO_ADRESSEN: Record<string, FeatureKey> = {
  ...Object.fromEntries(PRO_TRAINER_IDS.map((id) => [`/lernen/trainer/${id}`, 'trainers-advanced' as const])),
  '/lernen/pros': 'pro-insights',
};

/** Das Feature, das eine Adresse ganz oder teilweise sperrt — oder `null`.
 *  Module und Lektionen: gesperrt, was nicht in `isFreeModule` / `isFreeLesson`
 *  steht (die erste Lektion jedes Moduls bleibt offen). */
export function proZiel(pfad: string): FeatureKey | null {
  const sauber = pfad.split(/[?#]/)[0].replace(/\/+$/, '');
  const fest = PRO_ADRESSEN[sauber];
  if (fest) return fest;
  const m = /^\/lernen\/(m\d+)(?:\/(m\d+-l\d+)(?:\/quiz)?)?$/.exec(sauber);
  if (!m) return null;
  const [, modul, lektion] = m;
  const frei = lektion ? isFreeLesson(modul, lektion) : isFreeModule(modul);
  return frei ? null : 'modules-advanced';
}

/** Alle Adressen mit fester Sperre (für Tests und Vorschau). */
export const PRO_ADRESSEN_LISTE: readonly string[] = Object.keys(PRO_ADRESSEN);

// ---------- Zugriffsentscheidung ----------

export type Access =
  /** Nutzbar (Pro, Testphase oder gratis ohne Limit). */
  | { state: 'allowed'; remaining?: number; limit?: number }
  /** Gratis nutzbar, aber Limit erreicht. */
  | { state: 'limit-reached'; limit: number }
  /** Nur mit Pro. */
  | { state: 'pro-only' };

export interface EntitlementContext {
  /** Monetarisierung aktiv? Ohne Konfiguration ist alles frei. */
  enabled: boolean;
  /** Aktives Pro-Abo. */
  pro: boolean;
  /** Laufende Testphase (voller Zugriff). */
  trialActive: boolean;
  /** Verbrauch des heutigen Tages bzw. Gesamtzähler. */
  used: Record<string, number>;
}

export function checkAccess(ctx: EntitlementContext, key: FeatureKey): Access {
  if (!ctx.enabled || ctx.pro || ctx.trialActive) return { state: 'allowed' };

  const limit = FEATURE_RULES[key].freeDailyLimit;
  if (limit === undefined) return { state: 'allowed' };
  if (limit <= 0) return { state: 'pro-only' };

  const used = Math.max(0, ctx.used[key] ?? 0);
  if (used >= limit) return { state: 'limit-reached', limit };
  return { state: 'allowed', remaining: limit - used, limit };
}

export function isUsable(access: Access): boolean {
  return access.state === 'allowed';
}

/** Trägt die Kachel zu dieser Adresse ein Schloss? Genau dann, wenn die
 *  Adresse hinter Pro liegt und der Nutzer es (noch) nicht hat. */
export function istGesperrt(ctx: EntitlementContext, pfad: string): boolean {
  const key = proZiel(pfad);
  return key !== null && checkAccess(ctx, key).state === 'pro-only';
}

// ---------- Testphase ----------

/** Tage voller Zugriff für neue Nutzer („Reverse Trial"). */
export const TRIAL_DAYS = 7;

/**
 * Verbleibende Testtage. `startedAt` ist ein ISO-Datum; ohne Startdatum
 * (Bestandsnutzer vor Einführung) gilt die Testphase als nicht gestartet.
 * Rückgabe 0 = abgelaufen oder nie gestartet.
 */
export function trialDaysLeft(startedAt: string | null, now: Date = new Date()): number {
  if (!startedAt) return 0;
  const start = new Date(startedAt);
  if (!isFinite(start.getTime())) return 0;
  const elapsedMs = now.getTime() - start.getTime();
  if (elapsedMs < 0) return TRIAL_DAYS; // Uhr verstellt: Nutzer nicht bestrafen
  const left = TRIAL_DAYS - Math.floor(elapsedMs / 86_400_000);
  return Math.max(0, Math.min(TRIAL_DAYS, left));
}
