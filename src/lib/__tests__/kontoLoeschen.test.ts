/* Ein Konto in der App löschen (E-084).
   =====================================

   Bis dahin stand in der Datenschutzerklärung „schreib uns eine kurze E-Mail";
   eine Funktion gab es nicht, und kein `deleteUser` im Quelltext. Diese Tests
   halten die Rechnung fest, die Bestätigung und die Abstimmung zwischen Client
   und Server — beide müssen dieselben Dokumente kennen. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { adresseStimmt, pfadeZumLoeschen } from '../cloud/konto';
import { kontoPfade, loescheKonto, type KontoSpeicher } from '../../../functions/src/konto';

const D = { freunde: ['f1', 'f2'], anfragen: ['a1'], gesendet: ['g1'] };

describe('pfadeZumLoeschen', () => {
  const pfade = pfadeZumLoeschen('u0', D);

  it('entfernt beide Seiten jeder Verbindung', () => {
    expect(pfade).toContain('social/u0/friends/f1');
    expect(pfade).toContain('social/f1/friends/u0');
    expect(pfade).toContain('social/u0/requests/a1');
    expect(pfade).toContain('social/a1/outgoing/u0');
    expect(pfade).toContain('social/u0/outgoing/g1');
    expect(pfade).toContain('social/g1/requests/u0');
  });

  it('nimmt Anwesenheit und Fortschritt mit', () => {
    expect(pfade).toContain('presence/u0');
    expect(pfade).toContain('users/u0');
  });

  it('fasst nichts an, was nur der Server darf (Code-Verzeichnis, Abo)', () => {
    expect(pfade.some((p) => p.startsWith('friendCodes/') || p.startsWith('entitlements/'))).toBe(false);
  });

  it('darf nach den Firestore-Regeln gelöscht werden', () => {
    const regeln = readFileSync('firestore.rules', 'utf8');
    for (const [muster, delete_] of [
      ['match /social/{uid}/friends/{friendUid}', 'allow delete: if isMe(uid) || isMe(friendUid)'],
      ['match /social/{uid}/requests/{fromUid}', 'allow delete: if isMe(uid) || isMe(fromUid)'],
      ['match /social/{uid}/outgoing/{toUid}', 'allow delete: if isMe(uid) || isMe(toUid)'],
      ['match /presence/{uid}', 'allow delete: if isMe(uid)'],
    ] as const) {
      const block = regeln.slice(regeln.indexOf(muster), regeln.indexOf(muster) + 1400);
      expect(regeln, muster).toContain(muster);
      expect(block, `${muster} → ${delete_}`).toContain(delete_);
    }
    expect(regeln).toMatch(/match \/users\/\{uid\} \{\s*allow read, write: if isMe\(uid\)/);
  });
});

describe('adresseStimmt', () => {
  it('verlangt die eigene Adresse, ohne auf Schreibweise zu achten', () => {
    expect(adresseStimmt('Mira@Beispiel.de ', 'mira@beispiel.de')).toBe(true);
    expect(adresseStimmt('mira@beispiel.de', 'mira@beispiel.de')).toBe(true);
  });

  it('lässt eine andere oder leere Eingabe nicht durch', () => {
    expect(adresseStimmt('ja', 'mira@beispiel.de')).toBe(false);
    expect(adresseStimmt('', '')).toBe(false);
    expect(adresseStimmt('x@y.de', 'mira@beispiel.de')).toBe(false);
  });
});

describe('Der Server räumt dasselbe auf — und mehr', () => {
  function speicher(): KontoSpeicher & { geloescht: string[] } {
    const geloescht: string[] = [];
    return {
      geloescht,
      liste: async (s) => ({ 'social/u0/friends': D.freunde, 'social/u0/requests': D.anfragen, 'social/u0/outgoing': D.gesendet } as Record<string, string[]>)[s] ?? [],
      findeCodes: async () => ['ABCD-1234'],
      loesche: async (p) => { geloescht.push(...p); },
    };
  }

  it('kennt jedes Dokument, das der Client kennt', async () => {
    const server = await kontoPfade('u0', speicher());
    for (const p of pfadeZumLoeschen('u0', D)) expect(server, p).toContain(p);
  });

  it('löscht zusätzlich Code-Eintrag und Abo-Vermerk', async () => {
    const s = speicher();
    const pfade = await loescheKonto('u0', s);
    expect(pfade).toContain('friendCodes/ABCD-1234');
    expect(pfade).toContain('entitlements/u0');
    expect(s.geloescht).toEqual(pfade);
  });

  it('löscht das Konto selbst zuletzt', async () => {
    const pfade = await kontoPfade('u0', speicher());
    expect(pfade.slice(-3)).toEqual(['presence/u0', 'users/u0', 'entitlements/u0']);
  });

  it('weigert sich ohne Nutzer-ID (die Prüfung prüft sich selbst)', async () => {
    await expect(loescheKonto('', speicher())).rejects.toThrow();
  });
});

describe('Bedienung', () => {
  const karte = readFileSync('src/components/CloudAccountCard.tsx', 'utf8');

  it('verlangt die eigene Adresse und gibt das Löschen erst dann frei', () => {
    expect(karte).toMatch(/!adresseStimmt\(bestaetigung, user\.email\)/);
    expect(karte).toContain('cloud.deleteAccount');
  });

  it('fragt bei Konten mit Passwort danach, bei Google nicht', () => {
    expect(karte).toMatch(/user\.passwort \? \(/);
    expect(karte).toContain('deleteGoogleHint');
  });

  it('ruft nach erneuter Anmeldung zuerst die Daten, dann das Konto', () => {
    const cloud = readFileSync('src/lib/cloud/cloud.ts', 'utf8');
    const i = cloud.indexOf('async deleteAccount');
    const k = cloud.slice(i, cloud.indexOf('async resetPassword', i));
    expect(k.indexOf('reauthenticate')).toBeGreaterThan(-1);
    expect(k.indexOf('reauthenticate')).toBeLessThan(k.indexOf('batch.commit'));
    expect(k.indexOf('batch.commit')).toBeLessThan(k.indexOf('deleteUser'));
  });

  it('bietet „Passwort ändern“ nur Konten mit Passwort an', () => {
    expect(karte).toMatch(/user\.passwort && \(\s*<button[\s\S]*?resetPassword\(user\.email\)/);
  });

  it('wird vom Server-Auslöser nur über die eigene Datei bedient', () => {
    const index = readFileSync('functions/src/index.ts', 'utf8');
    expect(index).toContain('functionsV1.auth.user().onDelete');
    expect(index).toContain("from './konto'");
  });
});
