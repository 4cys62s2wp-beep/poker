import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildCsp, isValidAuthDomain } from '../csp';

const DOMAIN = 'pokermentor-9ac7f.firebaseapp.com';

/** Eine Direktive aus der fertigen Richtlinie herausziehen. */
function directive(csp: string, name: string): string | null {
  const teil = csp.split('; ').find((d) => d.startsWith(name + ' '));
  return teil ? teil.slice(name.length + 1) : null;
}

describe('Content-Security-Policy', () => {
  describe('mit Anmelde-Domain', () => {
    const csp = buildCsp(DOMAIN);

    it('erlaubt das Hilfsskript, ohne das die Google-Anmeldung scheitert', () => {
      // Der Fehler, wegen dem diese Datei existiert: script-src 'self' allein
      // blockiert apis.google.com/js/api.js – die Anmeldung kommt nie zustande.
      expect(directive(csp, 'script-src')).toContain('https://apis.google.com');
    });

    it('erlaubt den Rahmen auf der eigenen Anmelde-Domain', () => {
      expect(directive(csp, 'frame-src')).toContain(`https://${DOMAIN}`);
    });

    it('erlaubt trotzdem keine Inline-Skripte und kein eval', () => {
      const s = directive(csp, 'script-src') ?? '';
      expect(s).not.toContain('unsafe-inline');
      expect(s).not.toContain('unsafe-eval');
      expect(s).not.toContain(' *');
    });

    it('nennt bei Firestore ausdrücklich auch wss', () => {
      // CSP trennt Schemata strikt: https://host erlaubt keine WebSocket-
      // Verbindung zu demselben Host. Firestore wechselt je nach Netz darauf.
      expect(directive(csp, 'connect-src')).toContain('wss://firestore.googleapis.com');
    });

    it('hält die übrigen Riegel geschlossen', () => {
      expect(directive(csp, 'object-src')).toBe("'none'");
      expect(directive(csp, 'base-uri')).toBe("'self'");
      expect(directive(csp, 'form-action')).toBe("'self'");
      expect(directive(csp, 'default-src')).toBe("'self'");
    });
  });

  describe('ohne Anmelde-Domain', () => {
    const csp = buildCsp(null);

    it('bleibt bei der engsten Fassung', () => {
      expect(directive(csp, 'script-src')).toBe("'self'");
      expect(directive(csp, 'frame-src')).toBe("'none'");
    });

    it('erlaubt kein fremdes Skript – auch nicht das von Google', () => {
      expect(csp).not.toContain('apis.google.com');
    });
  });

  describe('Prüfung der Domain', () => {
    it('nimmt echte Hostnamen an', () => {
      expect(isValidAuthDomain(DOMAIN)).toBe(true);
      expect(isValidAuthDomain('projekt.web.app')).toBe(true);
    });

    it('weist alles ab, was die Richtlinie aufbrechen könnte', () => {
      // Direktiven werden mit ';' getrennt – ein Semikolon im Hostnamen wäre
      // eine zweite, selbst gewählte Direktive.
      for (const böse of [
        "evil.com; script-src *",
        'evil.com script-src *',
        'https://evil.com',
        'evil.com/pfad',
        '*',
        '*.firebaseapp.com',
        '',
        null,
        undefined,
        42,
        'a'.repeat(200) + '.com',
      ]) {
        expect(isValidAuthDomain(böse), String(böse)).toBe(false);
      }
    });

    it('lässt einen abgewiesenen Wert nicht durch die Hintertür in die Richtlinie', () => {
      const csp = buildCsp("evil.com; script-src *");
      expect(csp).not.toContain('evil.com');
      expect(directive(csp, 'frame-src')).toBe("'none'");
    });
  });

  it('setzt keine leere oder doppelte Direktive', () => {
    for (const csp of [buildCsp(DOMAIN), buildCsp(null)]) {
      expect(csp).not.toMatch(/;\s*;/);
      expect(csp).not.toMatch(/\s{2}/);
      const namen = csp.split('; ').map((d) => d.split(' ')[0]);
      expect(new Set(namen).size).toBe(namen.length);
    }
  });
});

describe('Das Skript gegen das Aufblitzen darf laufen', () => {
  /* `script-src 'self'` verbietet inline-Skripte. In index.html steht genau
     eines: das, welches den Farbmodus setzt, bevor das Stilblatt greift.
     Es wurde auf jeder Seite blockiert — die Konsole meldete es, und die
     Vorbeugung gegen das Aufblitzen lief nie (E-043).

     Erlaubt wird es über seinen Hash, nicht über `'unsafe-inline'`: genau
     dieses eine Skript, Zeichen für Zeichen. */
  it('nimmt übergebene Hashes in script-src auf', () => {
    const csp = buildCsp(DOMAIN, ["'sha256-abc123'"]);
    const zeile = csp.split(';').find((t) => t.trim().startsWith('script-src'))!;
    expect(zeile).toContain("'self'");
    expect(zeile).toContain("'sha256-abc123'");
  });

  it('erlaubt niemals inline-Skripte pauschal', () => {
    /* Der bequeme Weg wäre `'unsafe-inline'` — und damit wäre jede
       eingeschleuste Zeile erlaubt. Geprüft wird gezielt `script-src`:
       `style-src` trägt es weiterhin, weil React Stile inline setzt, und
       ein eingeschleustes Stilblatt kann keinen Code ausführen. */
    const skriptzeile = (csp: string) =>
      csp.split(';').find((t) => t.trim().startsWith('script-src'))!;
    expect(skriptzeile(buildCsp(DOMAIN, ["'sha256-abc123'"]))).not.toContain('unsafe-inline');
    expect(skriptzeile(buildCsp(null))).not.toContain('unsafe-inline');
  });

  it('rechnet den Hash im Bau aus dem fertigen HTML', () => {
    /* Ein von Hand eingetragener Hash wäre beim nächsten Komma im Skript
       falsch — und die Vorbeugung wäre wieder still aus. */
    const konfig = readFileSync('vite.config.ts', 'utf8');
    expect(konfig).toContain("createHash('sha256')");
    expect(konfig).toContain("order: 'post'");
  });
});
