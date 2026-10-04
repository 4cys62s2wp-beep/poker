/* Ein Konto löschen — was dabei verschwindet.
   ===========================================

   Art. 17 DSGVO: Wer ein Konto anlegen kann, muss es auch löschen können, ohne
   dem Anbieter eine E-Mail zu schreiben. Bis E-084 stand in der Datenschutz-
   erklärung „schreib uns eine kurze E-Mail"; eine Funktion in der App gab es
   nicht.

   Was gelöscht wird, hängt an den Firestore-Regeln: Der Client darf seine
   eigenen Dokumente und beide Seiten einer Freundschaft entfernen, aber nicht
   den Eintrag im Code-Verzeichnis (`friendCodes`, „Einmal vergeben,
   unveränderlich" — sonst könnte jemand einen freien Code kapern) und nicht
   die Abo-Berechtigung (nur der Server schreibt). Beides räumt die
   Cloud-Function `kontoGeloescht` weg, sobald sie läuft
   (`functions/src/konto.ts`); bis dahin bleiben dort ein Verweis auf eine
   gelöschte Nutzer-ID und der Abo-Vermerk stehen — beide ohne Namen und
   ohne E-Mail-Adresse.

   Diese Datei kennt keine Firebase-Typen: Sie rechnet nur aus, welche
   Dokumente es sind. Ein Test hält sie mit der Fassung des Servers zusammen. */

export interface Kontodaten {
  /** Nutzer-IDs der Freunde. */
  freunde: string[];
  /** Absender offener Anfragen an mich. */
  anfragen: string[];
  /** Empfänger meiner gesendeten Anfragen. */
  gesendet: string[];
}

/** Die Dokumentpfade, die ein Client beim Löschen eines Kontos entfernen darf. */
export function pfadeZumLoeschen(uid: string, d: Kontodaten): string[] {
  const pfade: string[] = [];
  for (const f of d.freunde) pfade.push(`social/${uid}/friends/${f}`, `social/${f}/friends/${uid}`);
  for (const a of d.anfragen) pfade.push(`social/${uid}/requests/${a}`, `social/${a}/outgoing/${uid}`);
  for (const o of d.gesendet) pfade.push(`social/${uid}/outgoing/${o}`, `social/${o}/requests/${uid}`);
  pfade.push(`presence/${uid}`, `users/${uid}`);
  return pfade;
}

/** Stimmt die getippte Adresse? Groß- und Kleinschreibung zählt nicht, Leerzeichen am Rand auch nicht. */
export function adresseStimmt(eingabe: string, email: string): boolean {
  return eingabe.trim().toLowerCase() === email.trim().toLowerCase() && email.trim() !== '';
}
