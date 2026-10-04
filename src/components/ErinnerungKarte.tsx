/* Erinnern ohne Server: ein Kalendereintrag zum Mitnehmen (lib/erinnerung.ts). */

import { useState } from 'react';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/erinnerung';
import { downloadBlob } from '../lib/download';
import { baueIcs, UHRZEIT_MUSTER } from '../lib/erinnerung';
import { appMarkeMoeglich } from '../lib/appmarke';

/** Abends, wenn man ohnehin zur Ruhe kommt — und die Uhrzeit ist frei wählbar. */
const STARTZEIT = '19:00';

export function ErinnerungKarte() {
  const { lang } = useLang();
  const L = STR[lang];
  const [uhrzeit, setUhrzeit] = useState(STARTZEIT);
  const gueltig = UHRZEIT_MUSTER.test(uhrzeit);

  function laden() {
    if (!gueltig) return;
    /* Die Adresse der App ohne Suchteil und ohne Hash-Pfad: Der Eintrag soll
       auf die Startseite führen, nicht auf den Bildschirm, auf dem man ihn
       zufällig geladen hat. */
    const adresse = `${location.origin}${location.pathname}`;
    const ics = baueIcs({
      uhrzeit, adresse, titel: L.eintragTitel, beschreibung: L.eintragText, jetzt: new Date(),
    });
    downloadBlob(ics, L.dateiname, 'text/calendar;charset=utf-8');
  }

  return (
    <section className="erinnerung-karte card" aria-label={L.titel}>
      <div className="titel">{L.titel}</div>
      <p className="small muted">{L.text}</p>
      <div className="row wrap">
        <label className="small muted" htmlFor="erinnerung-uhrzeit">{L.uhrzeit}</label>
        <input
          id="erinnerung-uhrzeit"
          className="text-input"
          type="time"
          value={uhrzeit}
          onChange={(e) => setUhrzeit(e.target.value)}
          required
        />
        <button type="button" className="btn sm" disabled={!gueltig} onClick={laden}>{L.laden}</button>
      </div>
      <p className="small faint">{L.hinweis}</p>
      {appMarkeMoeglich() && <p className="small faint">{L.markeHinweis}</p>}
    </section>
  );
}
