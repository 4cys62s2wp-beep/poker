/* Die Mail für Feedback und Fehlerberichte (FAHRPLAN 8.5). */

import { describe, expect, it } from 'vitest';
import { FEHLER_MAX, feedbackMail } from '../feedback';

const basis = {
  email: 'hallo@example.org', betreff: 'PokerMentor – Feedback', bau: 'Stand: abc123',
  version: 'Version 2.2', sprache: 'de', userAgent: 'Mozilla/5.0 (Test)',
};

function lies(link: string) {
  const [kopf, rest] = link.split('?');
  const p = new URLSearchParams(rest);
  return { an: kopf.replace('mailto:', ''), betreff: p.get('subject'), text: p.get('body') ?? '' };
}

describe('feedbackMail', () => {
  it('richtet sich an die hinterlegte Adresse und trägt den Betreff', () => {
    const m = lies(feedbackMail(basis));
    expect(m.an).toBe('hallo@example.org');
    expect(m.betreff).toBe('PokerMentor – Feedback');
  });

  it('legt Version, Sprache und Browser unter eine Trennlinie', () => {
    const m = lies(feedbackMail({ ...basis, kopf: 'Dein Feedback:' }));
    expect(m.text.startsWith('Dein Feedback:')).toBe(true);
    expect(m.text).toContain('—\nVersion 2.2 · Stand: abc123 · de\nMozilla/5.0 (Test)');
  });

  it('nimmt bei einem Absturz die Fehlermeldung mit, einzeilig und gekürzt', () => {
    const lang = `Fehler\n  in   Zeile ${'x'.repeat(1000)}`;
    const m = lies(feedbackMail({ ...basis, fehler: lang }));
    const teile = m.text.split('\n');
    const zeile = teile[teile.length - 1];
    expect(zeile.startsWith('Fehler in Zeile')).toBe(true);
    expect(zeile.length).toBeLessThanOrEqual(FEHLER_MAX);
  });

  it('kodiert Sonderzeichen, sodass der Link ein Link bleibt', () => {
    const link = feedbackMail({ ...basis, betreff: 'a&b=c ?', fehler: 'x&y=z' });
    expect(link.split('?')).toHaveLength(2);
    expect(link).not.toMatch(/\s/);
    expect(lies(link).betreff).toBe('a&b=c ?');
  });

  it('lässt ohne Kopf nichts vor der Trennlinie stehen', () => {
    expect(lies(feedbackMail(basis)).text.startsWith('—')).toBe(true);
  });
});
