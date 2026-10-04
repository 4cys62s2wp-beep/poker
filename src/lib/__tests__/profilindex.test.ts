/* Das Profil speichert keine E-Mail-Adresse mehr (FAHRPLAN 8.2).

   Das Feld „E-Mail (optional, für die Profil-Zuordnung)“ wurde gespeichert und
   angezeigt, aber von nichts gelesen. Es widersprach der Datensparsamkeit, die
   die App verspricht — und alte Einträge verschwinden beim Laden. */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadProfilesIndex } from '../../state/AppState';

const KEY = 'pokermentor-profiles-v1';

class SpeicherErsatz {
  private daten = new Map<string, string>();
  getItem(k: string) { return this.daten.has(k) ? this.daten.get(k)! : null; }
  setItem(k: string, v: string) { this.daten.set(k, String(v)); }
  removeItem(k: string) { this.daten.delete(k); }
}

const echterSpeicher = (globalThis as Record<string, unknown>).localStorage;
beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new SpeicherErsatz(), configurable: true, writable: true,
  });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: echterSpeicher, configurable: true, writable: true,
  });
});

describe('loadProfilesIndex', () => {
  it('lässt eine früher eingegebene E-Mail-Adresse fallen', () => {
    localStorage.setItem(KEY, JSON.stringify({
      activeId: 'p1',
      profiles: [{ id: 'p1', name: 'Mira', email: 'mira@example.com', createdAt: '2026-01-01', color: '#c94f44' }],
    }));
    const idx = loadProfilesIndex();
    expect(idx.profiles).toHaveLength(1);
    expect(idx.profiles[0].name).toBe('Mira');
    expect('email' in idx.profiles[0]).toBe(false);
  });

  it('behält Name und Konto-Zuordnung', () => {
    localStorage.setItem(KEY, JSON.stringify({
      activeId: 'p2',
      profiles: [
        { id: 'p1', name: '', createdAt: '2026-01-01', color: '#c94f44' },
        { id: 'p2', name: 'Ben', createdAt: '2026-01-02', color: '#3f6fb5', cloudUid: 'u-1' },
      ],
    }));
    const idx = loadProfilesIndex();
    expect(idx.activeId).toBe('p2');
    expect(idx.profiles[1].cloudUid).toBe('u-1');
  });
});
