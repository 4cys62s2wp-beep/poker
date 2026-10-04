/* Konto gelöscht → alle Daten dazu entfernen.
   ===========================================

   Auslöser ist `auth.user().onDelete` (siehe index.ts): Wer sein Konto in der
   App löscht, löscht damit auch seine Anmeldung; der Server räumt danach auf,
   was der Client nach den Firestore-Regeln nicht darf — den Eintrag im
   Code-Verzeichnis `friendCodes` und die Abo-Berechtigung `entitlements`.
   Dazu alles, was der Client vor dem Löschen versäumt haben könnte (Abbruch,
   abgelaufene Sitzung): Es darf kein Rest von einem gelöschten Konto stehen
   bleiben, weil ein einzelner Schritt schiefging.

   Diese Datei kennt weder Firebase noch das Netz: Sie rechnet aus, welche
   Dokumente es sind, und reicht sie an einen Speicher weiter. So läuft der Test
   ohne Emulator. NOCH NICHT DEPLOYT (siehe index.ts). */

export interface KontoSpeicher {
  /** Die Dokument-IDs einer Sammlung, z. B. `social/u1/friends`. */
  liste: (sammlung: string) => Promise<string[]>;
  /** Der Eintrag im Code-Verzeichnis, der auf diese Nutzer-ID zeigt. */
  findeCodes: (uid: string) => Promise<string[]>;
  /** Löschen; ein nicht vorhandenes Dokument ist kein Fehler. */
  loesche: (pfade: string[]) => Promise<void>;
}

/** Alle Dokumente, die zu einem Konto gehören. Reihenfolge: erst Verknüpfungen, zuletzt das Konto. */
export async function kontoPfade(uid: string, s: KontoSpeicher): Promise<string[]> {
  const [freunde, anfragen, gesendet, codes] = await Promise.all([
    s.liste(`social/${uid}/friends`),
    s.liste(`social/${uid}/requests`),
    s.liste(`social/${uid}/outgoing`),
    s.findeCodes(uid),
  ]);
  const pfade: string[] = [];
  for (const f of freunde) pfade.push(`social/${uid}/friends/${f}`, `social/${f}/friends/${uid}`);
  for (const a of anfragen) pfade.push(`social/${uid}/requests/${a}`, `social/${a}/outgoing/${uid}`);
  for (const o of gesendet) pfade.push(`social/${uid}/outgoing/${o}`, `social/${o}/requests/${uid}`);
  for (const c of codes) pfade.push(`friendCodes/${c}`);
  pfade.push(`presence/${uid}`, `users/${uid}`, `entitlements/${uid}`);
  return pfade;
}

export async function loescheKonto(uid: string, s: KontoSpeicher): Promise<string[]> {
  if (!uid) throw new Error('Ohne Nutzer-ID wird nichts gelöscht.');
  const pfade = await kontoPfade(uid, s);
  await s.loesche(pfade);
  return pfade;
}
