/* Das Positionsschema: sechs Plätze um einen Tisch, ohne Filz.
   ============================================================

   Eine Aufgabe wie „Du sitzt im Cutoff, alle vor dir haben gefoldet" besteht
   aus einem Satz — und der Satz ist das Schwerste daran. Das Schema zeigt
   dasselbe als Bild: wer wo sitzt, wer noch dabei ist, wer schon etwas
   eingesetzt hat, wo der Dealerknopf liegt.

   Es ist Lehrmaterial, kein Spiel (E-030): ein Standbild ohne Filz, ohne
   Chip-Grafik, ohne Bewegung. Der eigene Platz trägt die Bereichsfarbe,
   gefoldete Plätze sind blass, Einsätze stehen als Zahl in Big Blinds. */

import type { Position } from '../content/ranges';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/positionsschema';
import { formatBB } from '../lib/poker/bb';

/** Die Plätze im Uhrzeigersinn, mit dem Button beginnend. */
const PLAETZE: Position[] = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
/** Winkel in Grad (0 = rechts, wächst im Uhrzeigersinn). */
const WINKEL: Record<Position, number> = { BTN: 62, SB: 118, BB: 180, UTG: 242, HJ: 298, CO: 360 };

const MX = 160;
const MY = 74;
const RX = 118;
const RY = 46;

interface Props {
  /** Der eigene Platz — oder keiner (reines Lehrbild). */
  eigen?: Position;
  /** Plätze, die schon gefoldet haben. */
  gefoldet?: Position[];
  /** Einsätze je Platz in Big Blinds (Zahlen, keine Chips). */
  einsaetze?: Partial<Record<Position, number>>;
  /** Wer noch nicht dran war und dessen Platz offen bleibt (nur Beschriftung). */
  className?: string;
}

function punkt(p: Position, faktor = 1): { x: number; y: number } {
  const w = (WINKEL[p] * Math.PI) / 180;
  return { x: MX + faktor * RX * Math.cos(w), y: MY + faktor * RY * Math.sin(w) };
}

export function Positionsschema({ eigen, gefoldet = [], einsaetze = {}, className }: Props) {
  const { lang } = useLang();
  const T = STR[lang];
  const beschreibung = [
    eigen ? T.duSitzt(eigen) : T.sitzplan,
    ...PLAETZE.filter((p) => einsaetze[p] !== undefined).map((p) => T.einsatz(p, formatBB(einsaetze[p]! * 2, 2, lang))),
    gefoldet.length > 0 ? T.gefoldet(gefoldet.join(', ')) : '',
  ].filter(Boolean).join('. ');

  return (
    <svg
      className={`schema${className ? ` ${className}` : ''}`}
      viewBox="0 0 320 150"
      role="img"
      aria-label={beschreibung}
    >
      <ellipse className="schema-tisch" cx={MX} cy={MY} rx={RX - 8} ry={RY - 4} />
      {PLAETZE.map((p) => {
        const { x, y } = punkt(p);
        const weg = gefoldet.includes(p);
        const du = p === eigen;
        const bet = einsaetze[p];
        const innen = punkt(p, 0.62);
        return (
          <g key={p} className={`schema-platz${du ? ' du' : ''}${weg ? ' weg' : ''}`}>
            <circle cx={x} cy={y} r={17} />
            <text x={x} y={y + 4} textAnchor="middle">{p}</text>
            {bet !== undefined && bet > 0 && (
              <text className="schema-einsatz" x={innen.x} y={innen.y + 4} textAnchor="middle">
                {formatBB(bet * 2, 2, lang)}
              </text>
            )}
            {p === 'BTN' && (
              <g className="schema-dealer">
                <circle cx={x + 17} cy={y - 15} r={9} />
                <text x={x + 17} y={y - 11} textAnchor="middle">D</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
