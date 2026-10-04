/* Die öffentliche Adresse kommt aus einer Variable (E-086). */

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PLATZHALTER, STANDARD_ADRESSE, bereinige, setzeAdresse } from '../oeffentlicheAdresse';

describe('bereinige', () => {
  it('nimmt eine https-Adresse und setzt den Schrägstrich ans Ende', () => {
    expect(bereinige('https://pokermentor.app')).toBe('https://pokermentor.app/');
    expect(bereinige(' https://pokermentor.app/ ')).toBe('https://pokermentor.app/');
  });

  it('fällt bei Unbrauchbarem auf die Vorgabe zurück', () => {
    for (const roh of [undefined, '', 'http://unsicher.de/', 'pokermentor.app', 'javascript:alert(1)', 'https://a b.de/']) {
      expect(bereinige(roh), String(roh)).toBe(STANDARD_ADRESSE);
    }
  });
});

describe('setzeAdresse', () => {
  it('ersetzt jeden Platzhalter', () => {
    const html = `<a content="${PLATZHALTER}"><b content="${PLATZHALTER}og.png">`;
    expect(setzeAdresse(html, 'https://x.de/')).toBe('<a content="https://x.de/"><b content="https://x.de/og.png">');
  });
});

describe('index.html', () => {
  const html = readFileSync('index.html', 'utf8');

  it('trägt die Adresse nicht fest ein', () => {
    expect(html).not.toMatch(/4cys62s2wp-beep\.github\.io/);
    expect(html).toContain(`<meta property="og:url" content="${PLATZHALTER}" />`);
    expect(html).toContain(`content="${PLATZHALTER}og.png"`);
  });

  it('wird beim Bauen gefüllt', () => {
    expect(readFileSync('vite.config.ts', 'utf8')).toContain('setzeAdresse(html, process.env.VITE_PUBLIC_URL)');
    expect(readFileSync('.github/workflows/deploy.yml', 'utf8')).toContain('VITE_PUBLIC_URL: ${{ vars.VITE_PUBLIC_URL }}');
    /* Nur wenn gebaut wurde: In der Action läuft dieser Test vor dem Bauen. */
    if (existsSync('dist/index.html')) {
      const gebaut = readFileSync('dist/index.html', 'utf8');
      expect(gebaut).not.toContain(PLATZHALTER);
      expect(gebaut).toMatch(/og:url" content="https:\/\//);
    }
  });
});
