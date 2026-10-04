/* Pro-Start: Zahlen aus den Regeln, Rückkehr aus dem Kauf, ruhiger Hinweis (E-099). */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DE_BUNDLE } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { FEATURE_RULES, FREE_MODULE_IDS, GRATIS_TRAINER_ANZAHL } from '../pro/plan';
import { vergleichsZahlen } from '../pro/vergleich';
import { TRAINER } from '../trainerliste';
import { WARTEZEIT_MS, kaufStand } from '../pro/kauf';
import { HINWEIS_STUFEN, faelligerHinweis } from '../pro/testende';

const ECHT = vergleichsZahlen({
  module: DE_BUNDLE.modules,
  trainerInListe: TRAINER.length,
  szenarien: DE_BUNDLE.scenarios.length,
  profile: DE_BUNDLE.proProfiles.length,
});

describe('Die Pro-Tabelle rechnet aus plan.ts und den Inhalten', () => {
  it('Module, Trainer und Limits kommen aus den Regeln', () => {
    expect(ECHT.moduleFrei).toBe(FREE_MODULE_IDS.length);
    expect(ECHT.moduleAlle).toBe(DE_BUNDLE.modules.length);
    expect(ECHT.trainerFrei).toBe(GRATIS_TRAINER_ANZAHL);
    expect(ECHT.trainerAlle).toBe(TRAINER.length + 1);
    expect(ECHT.coachProTag).toBe(FEATURE_RULES.coach.freeDailyLimit);
    expect(ECHT.tischProTag).toBe(FEATURE_RULES['play-hands'].freeDailyLimit);
  });

  it('die zusätzlichen Lektionen sind alle in gesperrten Modulen außer der ersten je Modul', () => {
    // m4 6, m5 6, m7 5, m8 6, m9 5 Lektionen → 5 + 5 + 4 + 5 + 4
    expect(ECHT.lektionenMehr).toBe(23);
  });

  it('der Trainer-Satz stimmt mit der Trainerliste überein (der Fehler war „5 von 7“ bei acht)', () => {
    const zeile = STR.de.rows(ECHT).find((r) => r[0] === 'Trainer')!;
    expect(zeile[1]).toBe(`${GRATIS_TRAINER_ANZAHL} von ${TRAINER.length + 1}`);
    expect(zeile[2]).toBe(`Alle ${TRAINER.length + 1}`);
  });

  it('eine geänderte Grenze ändert die Seite', () => {
    const anders = vergleichsZahlen({
      module: [...DE_BUNDLE.modules, { id: 'm10', lessons: [1, 2, 3] }],
      trainerInListe: TRAINER.length + 2,
      szenarien: 40,
      profile: 3,
    });
    expect(anders.moduleAlle).toBe(ECHT.moduleAlle + 1);
    expect(anders.lektionenMehr).toBe(ECHT.lektionenMehr + 2);
    expect(STR.de.rows(anders)[0][2]).toBe(`Alle ${ECHT.moduleAlle + 1}`);
    expect(STR.en.benefits(anders)[2].d).toContain('40 hand-written');
  });

  it('beide Sprachen haben gleich viele Zeilen und Nutzen', () => {
    expect(STR.en.rows(ECHT).length).toBe(STR.de.rows(ECHT).length);
    expect(STR.en.benefits(ECHT).length).toBe(STR.de.benefits(ECHT).length);
  });
});

describe('Die Nutzenzeilen versprechen nur, was es gibt', () => {
  const texte = (l: 'de' | 'en') => JSON.stringify([STR[l].benefits(ECHT), STR[l].rows(ECHT), STR[l].sub, STR[l].checkoutSummary('1', 'x')]);

  it('keine Slogans gegen den Ton aus E-010, kein Coach-Overlay als Pro-Nutzen', () => {
    for (const l of ['de', 'en'] as const) {
      expect(texte(l), l).not.toMatch(/Geld kosten|keiner gern|nobody wants to sit|cost money|Overlay/i);
    }
  });

  it('Sync, Export, Bankroll und Wiederholen stehen nicht als Pro-Vorteil (E-098)', () => {
    for (const l of ['de', 'en'] as const) {
      const nutzen = JSON.stringify(STR[l].benefits(ECHT));
      expect(nutzen, l).not.toMatch(/Sync|Synchronis|CSV|Bankroll|Wiederhol|Review/i);
      const proSpalte = STR[l].rows(ECHT).filter((r) => r[1] !== r[2]).map((r) => r[0]).join(' ');
      expect(proSpalte, l).not.toMatch(/Sync|Export|Bankroll|Wiederhol|Review/i);
    }
  });

  it('der Satz vor dem Bestell-Knopf nennt, was Pro tatsächlich öffnet', () => {
    expect(STR.de.checkoutSummary('4,99 €', 'pro Monat')).not.toMatch(/Synchronisation/);
    expect(STR.de.checkoutSummary('4,99 €', 'pro Monat')).toMatch(/Trainer/);
  });
});

describe('Rückkehr von der Zahlungsseite', () => {
  it('ohne Parameter ist nichts zu melden', () => {
    expect(kaufStand(null, false, 0)).toBe('keiner');
    expect(kaufStand('irgendwas', true, 0)).toBe('keiner');
  });

  it('Abbruch: nichts gebucht', () => {
    expect(kaufStand('abbruch', false, 0)).toBe('abbruch');
  });

  it('bezahlt, aber die Berechtigung fehlt noch: „wird bestätigt“, dann „dauert länger“', () => {
    expect(kaufStand('ok', false, 0)).toBe('wartet');
    expect(kaufStand('ok', false, WARTEZEIT_MS - 1)).toBe('wartet');
    expect(kaufStand('ok', false, WARTEZEIT_MS)).toBe('dauertLange');
  });

  it('sobald die Berechtigung da ist, ist Pro aktiv — gleich, wie lange es dauerte', () => {
    expect(kaufStand('ok', true, 0)).toBe('aktiv');
    expect(kaufStand('ok', true, WARTEZEIT_MS * 10)).toBe('aktiv');
  });
});

describe('Der Hinweis vor dem Ende der Testphase', () => {
  it('erst ab drei Tagen, nie davor und nie danach', () => {
    expect(faelligerHinweis(7, null)).toBeNull();
    expect(faelligerHinweis(4, null)).toBeNull();
    expect(faelligerHinweis(3, null)).toBe(3);
    expect(faelligerHinweis(2, null)).toBe(3);
    expect(faelligerHinweis(1, null)).toBe(1);
    expect(faelligerHinweis(0, null)).toBeNull();
    expect(faelligerHinweis(Number.NaN, null)).toBeNull();
  });

  it('je Stufe einmal: Wer „Verstanden“ sagt, bekommt denselben Hinweis nicht noch einmal', () => {
    expect(faelligerHinweis(3, 3)).toBeNull();
    expect(faelligerHinweis(2, 3)).toBeNull();
  });

  it('einen Tag vorher kommt der zweite, auch nach dem ersten', () => {
    expect(faelligerHinweis(1, 3)).toBe(1);
    expect(faelligerHinweis(1, 1)).toBeNull();
  });

  it('wer den engen Hinweis gesehen hat, bekommt den weiten nicht nachträglich', () => {
    expect(faelligerHinweis(3, 1)).toBeNull();
  });

  it('es gibt genau zwei Stufen', () => {
    expect([...HINWEIS_STUFEN]).toEqual([3, 1]);
  });
});

describe('Die Seite leitet erst nach dem Laden um', () => {
  const quelle = readFileSync('src/pages/UpgradePage.tsx', 'utf8');
  const kuendigen = readFileSync('src/pages/CancelPage.tsx', 'utf8');

  it('UpgradePage prüft `bereit` vor dem Umleiten', () => {
    const laden = quelle.indexOf('if (!bereit)');
    const umleiten = quelle.indexOf('<Navigate to="/"');
    expect(laden).toBeGreaterThan(0);
    expect(umleiten).toBeGreaterThan(laden);
  });

  it('die Kündigungsseite zeigt „nicht verfügbar“ erst, wenn feststeht, dass es kein Abo gibt', () => {
    expect(kuendigen.indexOf('!bereit')).toBeLessThan(kuendigen.indexOf('!enabled'));
  });

  it('der Rücksprung nennt die Parameter, die die Seite liest', () => {
    const provider = readFileSync('src/lib/pro/ProProvider.tsx', 'utf8');
    expect(provider).toContain('#/pro?kauf=ok');
    expect(provider).toContain('#/pro?kauf=abbruch');
    expect(quelle).toContain("suche.get('kauf')");
  });
});
