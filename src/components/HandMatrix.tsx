import { useRef, useState, type KeyboardEvent } from 'react';
import { matrixLabel } from '../lib/poker/ranges';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/handmatrix';

interface Props {
  /** Labels, die als "Raise" markiert werden (Gold). */
  raise?: ReadonlySet<string>;
  /** Labels, die als "Call" markiert werden (Grün). */
  call?: ReadonlySet<string>;
  /** Ein Label hervorheben (z. B. die aktuelle Trainingshand). */
  highlight?: string;
  onCellClick?: (label: string) => void;
  /** Nur zum Ansehen, in die Breite des Bildschirms gepasst: keine Beschriftung
   *  außer der markierten Hand. */
  kompakt?: boolean;
  /** Ein Tipp auf eine Zelle gibt Auskunft (Name und Aktion), schaltet aber
   *  nichts um: kein `aria-pressed`. Für die Range-Charts am Handy, wo die
   *  Zellen für „AKs“ zu schmal sind und den Namen erst der Tipp zeigt (E-096). */
  nurAuskunft?: boolean;
}

const SIZE = 13;

/** 13×13-Starthand-Matrix (oben links AA, oben rechts AKs–A2s, unten links AKo–A2o).
 *
 *  Bedienbarkeit: Jede Zelle ist ein <button> (Maus, Touch, Enter/Leertaste).
 *  Damit die Matrix nicht 169 Tab-Stopps erzeugt, wandert der Tab-Stopp mit dem
 *  Fokus („roving tabindex“): Tab springt in die Matrix, die Pfeiltasten bewegen
 *  sich darin, Tab springt wieder heraus. */
export function HandMatrix({ raise, call, highlight, onCellClick, kompakt = false, nurAuskunft = false }: Props) {
  const { lang } = useLang();
  const T = STR[lang];
  const gridRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const interactive = Boolean(onCellClick) && !nurAuskunft;

  const cells: Array<{ idx: number; label: string; isRaise: boolean; isCall: boolean; marked: boolean }> = [];
  let highlightIdx = -1;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const idx = r * SIZE + c;
      const label = matrixLabel(r, c);
      const isRaise = raise?.has(label) ?? false;
      const isCall = !isRaise && (call?.has(label) ?? false);
      const marked = highlight === label;
      if (marked) highlightIdx = idx;
      cells.push({ idx, label, isRaise, isCall, marked });
    }
  }

  // Tab-Stopp: die markierte Hand, sonst die zuletzt fokussierte, sonst AA.
  const tabIdx = cursor ?? (highlightIdx >= 0 ? highlightIdx : 0);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    let row = Math.floor(idx / SIZE);
    let col = idx % SIZE;
    switch (e.key) {
      case 'ArrowRight': col = Math.min(SIZE - 1, col + 1); break;
      case 'ArrowLeft': col = Math.max(0, col - 1); break;
      case 'ArrowDown': row = Math.min(SIZE - 1, row + 1); break;
      case 'ArrowUp': row = Math.max(0, row - 1); break;
      case 'Home': col = 0; break;
      case 'End': col = SIZE - 1; break;
      case 'PageUp': row = 0; break;
      case 'PageDown': row = SIZE - 1; break;
      default: return;
    }
    e.preventDefault();
    const next = row * SIZE + col;
    if (next === idx) return;
    setCursor(next);
    const target = gridRef.current?.children[next];
    if (target instanceof HTMLElement) target.focus();
  }

  if (kompakt) {
    const markiert = cells.find((c) => c.marked);
    const was = markiert ? `: ${markiert.label}, ${markiert.isRaise ? T.raise : markiert.isCall ? T.call : T.fold}` : '';
    return (
      <div className="matrix-scroll">
        <div className="matrix kompakt" role="img" aria-label={`${T.gridLabel}${was}`}>
          {cells.map(({ idx, label, isRaise, isCall, marked }) => (
            <div
              key={idx}
              className={`cell${isRaise ? ' raise' : isCall ? ' call' : ''}${marked ? ' mark' : ''}`}
              aria-hidden="true"
            >
              {marked ? label : ''}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="matrix-scroll">
      <div className="matrix" role="group" aria-label={T.gridLabel} ref={gridRef}>
        {cells.map(({ idx, label, isRaise, isCall, marked }) => {
          let cls = 'cell';
          if (isRaise) cls += ' raise';
          else if (isCall) cls += ' call';
          if (marked) cls += ' mark';
          if (onCellClick) cls += ' interactive';
          // Reine Anzeige-Matrizen (Range-Charts) nennen die Aktion mit, weil sie
          // sonst nur farbig – und damit für Screenreader unsichtbar – wäre.
          const action = isRaise ? T.raise : isCall ? T.call : T.fold;
          return (
            <button
              key={label}
              type="button"
              className={cls}
              tabIndex={idx === tabIdx ? 0 : -1}
              aria-pressed={interactive ? isRaise || isCall : undefined}
              aria-label={interactive ? label : `${label}, ${action}`}
              title={label}
              onClick={onCellClick ? () => onCellClick(label) : undefined}
              onFocus={() => setCursor(idx)}
              onKeyDown={(e) => onKeyDown(e, idx)}
            >
              {/* Am Handy ist die Zelle 22 Pixel breit: „AK“ passt, „AKs“ nicht.
                  Die Lage zur Diagonale sagt ohnehin, ob suited oder offsuit. */}
              {label.slice(0, 2)}<span className="art">{label.slice(2)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
