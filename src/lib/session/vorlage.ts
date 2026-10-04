/* Die Vorlage für „Abend einrichten": was beim letzten Mal eingestellt war.
   =========================================================================

   Dieselbe Runde spielt meist wieder mit demselben Koffer, in derselben Länge,
   im selben Tempo. Wer jedes Mal mit dem festen Vorschlag anfängt, ändert
   jedes Mal dasselbe. Die Vorlage wird beim Start eines Abends abgelegt und
   beim nächsten Einrichten als Vorbelegung gelesen. */

import { durableSet } from '../storage';
import type { Tempo } from '../live/blinds';
import type { Sorte } from '../live/verteilung';

export const VORLAGE_SCHLUESSEL = 'pokermentor-session-vorlage-v1';

export interface Vorlage {
  sorten: Sorte[];
  dauer: number;
  tempo: Tempo;
  gleich: boolean;
  euro: string;
}

const TEMPI: Tempo[] = ['gemuetlich', 'normal', 'schnell'];

export function ladeVorlage(): Vorlage | null {
  try {
    const roh = localStorage.getItem(VORLAGE_SCHLUESSEL);
    if (!roh) return null;
    const d = JSON.parse(roh) as Partial<Vorlage>;
    if (!Array.isArray(d.sorten) || typeof d.dauer !== 'number' || !TEMPI.includes(d.tempo as Tempo)) return null;
    const sorten = d.sorten
      .filter((s): s is Sorte => typeof s?.name === 'string' && typeof s?.anzahl === 'number')
      .map((s) => ({
        name: s.name.slice(0, 20),
        anzahl: Math.max(0, Math.floor(s.anzahl)),
        ...(typeof s.farbe === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.farbe) ? { farbe: s.farbe } : {}),
      }));
    if (sorten.length === 0) return null;
    return {
      sorten,
      dauer: d.dauer,
      tempo: d.tempo as Tempo,
      gleich: d.gleich === true,
      euro: typeof d.euro === 'string' ? d.euro.slice(0, 8) : '',
    };
  } catch {
    return null;
  }
}

export function speichereVorlage(v: Vorlage): void {
  durableSet(VORLAGE_SCHLUESSEL, JSON.stringify(v));
}
