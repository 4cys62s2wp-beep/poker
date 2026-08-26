import { describe, expect, it } from 'vitest';
import { reconcileTrialStart } from '../pro/trialAnchor';

const FRÜH = '2026-08-01T10:00:00.000Z';
const SPÄT = '2026-08-20T10:00:00.000Z';

describe('Anker der Testphase', () => {
  it('lässt den Beginn beim ersten Mal durch und merkt ihn sich', () => {
    const r = reconcileTrialStart(FRÜH, null);
    expect(r.effective).toBe(FRÜH);
    expect(r.writeAnchor).toBe(FRÜH);
  });

  it('verhindert das Vorschieben des Beginns – der Kern der Sache', () => {
    // Jemand setzt trialStartedAt im Browser-Speicher auf heute, um sieben
    // neue Tage zu bekommen. Der Anker steht auf dem echten Beginn.
    const r = reconcileTrialStart(SPÄT, FRÜH);
    expect(r.effective).toBe(FRÜH);
    expect(r.writeAnchor).toBeNull();
  });

  it('zieht den Anker mit, wenn der echte Beginn früher liegt', () => {
    // Kann vorkommen, wenn ein älterer Stand aus der Cloud kommt.
    const r = reconcileTrialStart(FRÜH, SPÄT);
    expect(r.effective).toBe(FRÜH);
    expect(r.writeAnchor).toBe(FRÜH);
  });

  it('stellt den Beginn aus dem Anker wieder her, wenn er gelöscht wurde', () => {
    // Wer nur trialStartedAt entfernt, bekommt keine neue Testphase.
    const r = reconcileTrialStart(null, FRÜH);
    expect(r.effective).toBe(FRÜH);
    expect(r.writeAnchor).toBeNull();
  });

  it('meldet ohne beides, dass keine Testphase läuft', () => {
    const r = reconcileTrialStart(null, null);
    expect(r.effective).toBeNull();
    expect(r.writeAnchor).toBeNull();
  });

  it('verwirft unbrauchbare Datumsangaben, statt sie gelten zu lassen', () => {
    expect(reconcileTrialStart('völliger unsinn', null).effective).toBeNull();
    expect(reconcileTrialStart('', FRÜH).effective).toBe(FRÜH);
    expect(reconcileTrialStart(SPÄT, 'kaputt').effective).toBe(SPÄT);
  });

  it('behandelt denselben Zeitpunkt beidseitig gleich', () => {
    const r = reconcileTrialStart(FRÜH, FRÜH);
    expect(r.effective).toBe(FRÜH);
  });

  it('lässt sich nicht durch ein Datum in der Zukunft aushebeln', () => {
    // Ein weit in der Zukunft liegender Beginn würde die Testphase sonst
    // dauerhaft „noch nicht begonnen“ erscheinen lassen.
    const zukunft = '2030-01-01T00:00:00.000Z';
    expect(reconcileTrialStart(zukunft, FRÜH).effective).toBe(FRÜH);
  });
});
