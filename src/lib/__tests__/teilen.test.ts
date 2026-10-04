/* Teilen als Text (FAHRPLAN 9.5). */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { quizErgebnisText, teileText } from '../teilen';

const echt = (globalThis as Record<string, unknown>).navigator;
function setzeNavigator(n: unknown) {
  Object.defineProperty(globalThis, 'navigator', { value: n, configurable: true, writable: true });
}
afterEach(() => setzeNavigator(echt));

describe('teileText', () => {
  it('teilt über den Dialog des Geräts, wenn es einen gibt', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    setzeNavigator({ share });
    expect(await teileText('Hallo', 'https://x.test/')).toBe('geteilt');
    expect(share).toHaveBeenCalledWith({ text: 'Hallo', url: 'https://x.test/' });
  });

  it('nimmt die Zwischenablage, wenn der Dialog fehlt', async () => {
    const schreibe = vi.fn().mockResolvedValue(undefined);
    setzeNavigator({ clipboard: { writeText: schreibe } });
    expect(await teileText('Hallo', 'https://x.test/')).toBe('kopiert');
    expect(schreibe).toHaveBeenCalledWith('Hallo\nhttps://x.test/');
  });

  it('nimmt die Zwischenablage auch, wenn jemand den Dialog abbricht', async () => {
    const schreibe = vi.fn().mockResolvedValue(undefined);
    setzeNavigator({ share: vi.fn().mockRejectedValue(new Error('abort')), clipboard: { writeText: schreibe } });
    expect(await teileText('Hallo')).toBe('kopiert');
    expect(schreibe).toHaveBeenCalledWith('Hallo');
  });

  it('meldet „fehler“, wenn nichts geht', async () => {
    setzeNavigator({});
    expect(await teileText('Hallo')).toBe('fehler');
  });
});

describe('quizErgebnisText', () => {
  it('nennt Stand und Serie, aber nur ab zwei Tagen', () => {
    expect(quizErgebnisText({ datum: '4. Okt. 2026', score: 4, total: 5, serie: 3 }, 'de'))
      .toBe('PokerMentor Tages-Quiz, 4. Okt. 2026: 4 von 5 richtig · 3 Tage in Folge');
    expect(quizErgebnisText({ datum: 'x', score: 5, total: 5, serie: 1 }, 'de')).not.toContain('Folge');
  });

  it('spricht Englisch, wenn die Oberfläche englisch ist', () => {
    expect(quizErgebnisText({ datum: '4 Oct 2026', score: 2, total: 5, serie: 0 }, 'en'))
      .toBe('PokerMentor Daily Quiz, 4 Oct 2026: 2 of 5 correct');
  });

  it('enthält weder Geld noch Währungszeichen', () => {
    const t = quizErgebnisText({ datum: 'x', score: 3, total: 5, serie: 4 }, 'de');
    expect(t).not.toMatch(/[€$£]|Euro|Gewinn/);
  });
});
