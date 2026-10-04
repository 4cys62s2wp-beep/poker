/* „Mein Koffer": der Chip-Koffer, den jemand im Chip-Rechner eingetragen hat.
   =========================================================================

   Er wird im Gerätespeicher gemerkt und von zwei Bildschirmen gelesen: dem
   Chip-Rechner und „Abend einrichten". Vorher trug man denselben Koffer in
   beiden ein — im einen mit Farbpunkten, im anderen als Freitext „weiß". */

import { durableSet } from './storage';
import type { Sorte } from './live/verteilung';

export const KOFFER_SCHLUESSEL = 'pokermentor-chips-setup';

export interface KofferZeile {
  id: string;
  label: string;
  /** Hex, `#rrggbb`. */
  color: string;
  /** Wie getippt — ein Textfeld kennt keine halbfertigen Zahlen. */
  count: string;
}

export interface Koffer {
  players: number;
  rows: KofferZeile[];
}

export const FARBEN = ['#e8e4d8', '#c94f44', '#3f6fb5', '#3f8f5a', '#494952', '#7b5ea7', '#d98c3a', '#cdb83d'];

export function ladeKoffer(): Koffer | null {
  try {
    const raw = localStorage.getItem(KOFFER_SCHLUESSEL);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { players?: unknown; rows?: unknown };
    if (
      typeof parsed.players === 'number' && parsed.players >= 2 && parsed.players <= 10
      && Array.isArray(parsed.rows) && parsed.rows.length > 0 && parsed.rows.length <= 8
      && parsed.rows.every((r: Partial<KofferZeile>) => typeof r?.id === 'string' && typeof r?.label === 'string'
        && typeof r?.color === 'string' && typeof r?.count === 'string')
    ) {
      return {
        players: parsed.players,
        rows: (parsed.rows as KofferZeile[]).map((r) => ({
          id: r.id.slice(0, 20),
          label: r.label.slice(0, 20),
          color: /^#[0-9a-fA-F]{6}$/.test(r.color) ? r.color : FARBEN[0],
          count: r.count.slice(0, 6),
        })),
      };
    }
  } catch {
    // fällt durch: kein gemerkter Koffer
  }
  return null;
}

export function speichereKoffer(k: Koffer): void {
  durableSet(KOFFER_SCHLUESSEL, JSON.stringify(k));
}

/** Der Koffer als Chipsorten für „Abend einrichten" — mit der Farbe für den Punkt. */
export function kofferAlsSorten(k: Koffer): Sorte[] {
  return k.rows
    .map((r) => ({ name: r.label.trim(), anzahl: Math.max(0, Math.floor(Number(r.count) || 0)), farbe: r.color }))
    .filter((s) => s.name !== '' && s.anzahl > 0);
}
