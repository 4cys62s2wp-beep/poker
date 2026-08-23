import { matrixLabel } from '../lib/poker/ranges';

interface Props {
  /** Labels, die als "Raise" markiert werden (Gold). */
  raise?: Set<string>;
  /** Labels, die als "Call" markiert werden (Grün). */
  call?: Set<string>;
  /** Ein Label hervorheben (z. B. die aktuelle Trainingshand). */
  highlight?: string;
  onCellClick?: (label: string) => void;
}

/** 13×13-Starthand-Matrix (oben links AA, oben rechts AKs–A2s, unten links AKo–A2o). */
export function HandMatrix({ raise, call, highlight, onCellClick }: Props) {
  const rows = [];
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const label = matrixLabel(r, c);
      let cls = 'cell';
      if (raise?.has(label)) cls += ' raise';
      else if (call?.has(label)) cls += ' call';
      if (highlight === label) cls += ' mark';
      if (onCellClick) cls += ' interactive';
      rows.push(
        <div
          key={label}
          className={cls}
          onClick={onCellClick ? () => onCellClick(label) : undefined}
          title={label}
        >
          {label}
        </div>,
      );
    }
  }
  return <div className="matrix">{rows}</div>;
}
