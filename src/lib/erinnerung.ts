/* Eine Erinnerung ohne Server.
   ============================

   Die App kennt dich nicht und soll es nicht: keine Mitteilungen über einen
   Cloud-Dienst, kein Konto, keine Geräteadresse bei Dritten (E-036 „keine
   Zeile Serverkode", und das Versprechen „ohne Tracking"). Wer erinnert
   werden will, bekommt einen Kalendereintrag — eine .ics-Datei, die jeder
   Kalender versteht, auf jedem Gerät, auch auf dem iPhone. Der Kalender
   erinnert dann, nicht die App.

   Alles hier ist eine reine Funktion: Zeit rein, Text raus. Dadurch lässt sich
   prüfen, was ein Kalender bekommt — gefaltete Zeilen, maskierte Zeichen,
   Zeilenenden —, ohne einen Browser. */

export const UHRZEIT_MUSTER = /^([01]\d|2[0-3]):[0-5]\d$/;

export interface IcsEingabe {
  /** `HH:MM`, die Uhrzeit des täglichen Termins (Ortszeit des Geräts). */
  uhrzeit: string;
  /** Wohin der Termin führt. */
  adresse: string;
  titel: string;
  beschreibung: string;
  /** Der Moment der Erzeugung — für `DTSTAMP` und den ersten Termin. */
  jetzt: Date;
}

const zwei = (n: number) => String(n).padStart(2, '0');

/** Maskiert, was in einem iCalendar-Textwert eine Bedeutung hat. */
export function maskiere(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Bricht eine Zeile bei 75 Byte (UTF-8). Fortsetzungen beginnen mit einem
 *  Leerzeichen, das selbst ein Byte kostet. Mehrbyte-Zeichen werden nie
 *  zerschnitten. */
export function falte(zeile: string): string {
  const enc = new TextEncoder();
  const teile: string[] = [];
  let aktuell = '';
  let bytes = 0;
  let grenze = 75;
  for (const zeichen of zeile) {
    const b = enc.encode(zeichen).length;
    if (bytes + b > grenze) {
      teile.push(aktuell);
      aktuell = '';
      bytes = 0;
      grenze = 74;
    }
    aktuell += zeichen;
    bytes += b;
  }
  teile.push(aktuell);
  return teile.join('\r\n ');
}

/** Der erste Termin: heute zur gewünschten Zeit, wenn die noch nicht vorbei
 *  ist, sonst morgen. Ohne Zeitzone („schwebend"): Der Termin gilt dort, wo
 *  das Gerät gerade ist — wer reist, bleibt bei seiner Abendstunde. */
export function ersterTermin(jetzt: Date, uhrzeit: string): string {
  const [h, m] = uhrzeit.split(':').map(Number);
  const tag = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate(), h, m);
  if (tag.getTime() <= jetzt.getTime()) tag.setDate(tag.getDate() + 1);
  return `${tag.getFullYear()}${zwei(tag.getMonth() + 1)}${zwei(tag.getDate())}T${zwei(h)}${zwei(m)}00`;
}

function utcStempel(d: Date): string {
  return `${d.getUTCFullYear()}${zwei(d.getUTCMonth() + 1)}${zwei(d.getUTCDate())}`
    + `T${zwei(d.getUTCHours())}${zwei(d.getUTCMinutes())}${zwei(d.getUTCSeconds())}Z`;
}

/** Der Text der .ics-Datei, mit CRLF-Zeilenenden, wie RFC 5545 es verlangt. */
export function baueIcs(e: IcsEingabe): string {
  if (!UHRZEIT_MUSTER.test(e.uhrzeit)) throw new Error(`Ungültige Uhrzeit: ${e.uhrzeit}`);
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PokerMentor//Erinnerung//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    /* Eine feste Kennung: Wer die Datei ein zweites Mal öffnet — etwa mit
       einer neuen Uhrzeit —, ersetzt den Termin, statt einen zweiten
       danebenzulegen. */
    'UID:hand-des-tages@pokermentor',
    `DTSTAMP:${utcStempel(e.jetzt)}`,
    `DTSTART:${ersterTermin(e.jetzt, e.uhrzeit)}`,
    'DURATION:PT10M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${maskiere(e.titel)}`,
    `DESCRIPTION:${maskiere(`${e.beschreibung}\n${e.adresse}`)}`,
    `URL:${e.adresse}`,
    /* Frei statt „beschäftigt": Eine Übungshand blockiert keinen Kalender. */
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${maskiere(e.titel)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${zeilen.map(falte).join('\r\n')}\r\n`;
}
