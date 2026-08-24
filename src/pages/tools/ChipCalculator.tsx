/* Chip-Rechner: Pokerkoffer eingeben → faire Verteilung, Startstack, Blinds
   und ein Blind-Fahrplan für den Pokerabend. Das Setup wird lokal gemerkt,
   damit der eigene Koffer beim nächsten Abend sofort wieder da ist. */

import { useEffect, useMemo, useState } from 'react';
import { planChips, type ChipInput } from '../../lib/chips';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/chips';

/* Die Anzeigenamen der Farben kommen sprachabhängig aus STR[lang].colorNames
   (gleiche Reihenfolge wie hier) – sie dienen nur als Vorbelegung neuer Zeilen. */
const CHIP_COLORS: string[] = [
  '#e8e4d8', // Weiß / white
  '#c94f44', // Rot / red
  '#3f6fb5', // Blau / blue
  '#3f8f5a', // Grün / green
  '#494952', // Schwarz / black
  '#7b5ea7', // Lila / purple
  '#d98c3a', // Orange
  '#cdb83d', // Gelb / yellow
];

interface Row {
  id: string;
  label: string;
  color: string;
  count: string;
  value: string;
}

/* Namen der Presets stehen sprachabhängig in STR[lang].presetNames (gleiche Reihenfolge). */
const PRESETS: Array<{ counts: number[] }> = [
  { counts: [100, 100, 50, 25, 25] }, // 300er-Koffer
  { counts: [150, 150, 100, 50, 50] }, // 500er-Koffer
  { counts: [300, 300, 200, 100, 100] }, // 1000er-Koffer
];

const STORAGE_KEY = 'pokermentor-chips-setup';

function makeRows(counts: number[], colorNames: string[]): Row[] {
  return counts.map((count, i) => ({
    id: `chip-${i}`,
    label: colorNames[i % colorNames.length],
    color: CHIP_COLORS[i % CHIP_COLORS.length],
    count: String(count),
    value: '',
  }));
}

function loadSaved(): { players: number; rows: Row[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { players?: unknown; rows?: unknown };
    if (
      typeof parsed.players === 'number' &&
      parsed.players >= 2 &&
      parsed.players <= 10 &&
      Array.isArray(parsed.rows) &&
      parsed.rows.length > 0 &&
      parsed.rows.length <= 8 &&
      parsed.rows.every(
        (r: Row) =>
          typeof r.id === 'string' && typeof r.label === 'string' && typeof r.color === 'string' &&
          typeof r.count === 'string' && typeof r.value === 'string',
      )
    ) {
      return {
        players: parsed.players,
        rows: (parsed.rows as Row[]).map((r) => ({
          id: r.id.slice(0, 20),
          label: r.label.slice(0, 20),
          color: /^#[0-9a-fA-F]{6}$/.test(r.color) ? r.color : CHIP_COLORS[0],
          count: r.count.slice(0, 6),
          value: r.value.slice(0, 8),
        })),
      };
    }
  } catch {
    // fällt durch zum Standard
  }
  return null;
}

export function ChipCalculator() {
  const { lang } = useLang();
  const L = STR[lang];
  const saved = useMemo(loadSaved, []);
  const [players, setPlayers] = useState(saved?.players ?? 5);
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? makeRows(PRESETS[0].counts, L.colorNames));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, rows }));
    } catch {
      // Speicher voll o. Ä. – Rechner funktioniert trotzdem
    }
  }, [players, rows]);

  const plan = useMemo(() => {
    const input: ChipInput[] = rows.map((r) => ({
      id: r.id,
      label: r.label.trim() || 'Chip',
      color: r.color,
      count: Math.max(0, Math.floor(Number(r.count) || 0)),
      value: r.value.trim() ? Math.max(0, Math.floor(Number(r.value) || 0)) : undefined,
    }));
    return planChips(players, input);
  }, [players, rows]);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((rs) => {
      if (rs.length >= 8) return rs;
      const used = new Set(rs.map((r) => r.color));
      const freeIdx = CHIP_COLORS.findIndex((c) => !used.has(c));
      const idx = freeIdx >= 0 ? freeIdx : rs.length % CHIP_COLORS.length;
      return [...rs, { id: `chip-${Date.now()}`, label: L.colorNames[idx], color: CHIP_COLORS[idx], count: '', value: '' }];
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="stat-label" style={{ marginBottom: 6 }}>{L.playersQuestion}</div>
          <div className="row" style={{ marginBottom: 16 }}>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.max(2, p - 1))} aria-label={L.fewerPlayersAria}>−</button>
            <span style={{ fontWeight: 800, fontSize: 22, minWidth: 34, textAlign: 'center' }}>{players}</span>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.min(10, p + 1))} aria-label={L.morePlayersAria}>+</button>
          </div>

          <div className="stat-label" style={{ marginBottom: 6 }}>{L.whichChips}</div>
          <p className="small muted" style={{ marginBottom: 10 }}>
            {L.chipsHelp}
          </p>

          {rows.map((r) => (
            <div key={r.id} className="row" style={{ marginBottom: 8, flexWrap: 'nowrap' }}>
              <span
                aria-hidden
                style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: r.color, border: '3px dashed rgba(0,0,0,0.35)', boxShadow: '0 0 0 1.5px rgba(236,233,223,0.25)',
                }}
              />
              <input
                className="text-input"
                style={{ flex: 1, minWidth: 60, width: 'auto' }}
                value={r.label}
                maxLength={20}
                onChange={(e) => updateRow(r.id, { label: e.target.value })}
                aria-label={L.chipNameAria}
              />
              <input
                className="text-input"
                style={{ width: 66, flexShrink: 0, padding: '12px 10px' }}
                inputMode="numeric"
                placeholder={L.countPlaceholder}
                value={r.count}
                maxLength={6}
                onChange={(e) => updateRow(r.id, { count: e.target.value.replace(/\D/g, '') })}
                aria-label={L.countAria(r.label)}
              />
              <input
                className="text-input"
                style={{ width: 60, flexShrink: 0, padding: '12px 10px' }}
                inputMode="numeric"
                placeholder={L.valuePlaceholder}
                value={r.value}
                maxLength={8}
                onChange={(e) => updateRow(r.id, { value: e.target.value.replace(/\D/g, '') })}
                aria-label={L.valueAria(r.label)}
              />
              {rows.length > 1 && (
                <button
                  className="btn sm ghost"
                  onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                  aria-label={L.removeAria(r.label)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="row wrap" style={{ marginTop: 12 }}>
            {rows.length < 8 && (
              <button className="btn sm" onClick={addRow}>{L.addChip}</button>
            )}
            {PRESETS.map((p, i) => (
              <button key={i} className="btn sm ghost" onClick={() => setRows(makeRows(p.counts, L.colorNames))}>
                {L.presetNames[i]}
              </button>
            ))}
          </div>
        </div>

        <div>
          {!plan && (
            <div className="card">
              <p className="muted">
                {L.emptyHint}
              </p>
            </div>
          )}

          {plan && (
            <>
              <div className="grid cols-2" style={{ marginBottom: 14 }}>
                <div className="card">
                  <div className="stat-label">{L.startStack}</div>
                  <div className="big-stat" style={{ fontSize: 26 }}>{plan.stackValue.toLocaleString('de-DE')}</div>
                  <div className="small faint">{L.stackSub(plan.stackBB)}</div>
                </div>
                <div className="card">
                  <div className="stat-label">{L.blindsStart}</div>
                  <div className="big-stat" style={{ fontSize: 26 }}>
                    {plan.smallBlind.toLocaleString('de-DE')} / {plan.bigBlind.toLocaleString('de-DE')}
                  </div>
                  <div className="small faint">{L.blindsSub}</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>{L.dealTitle}</div>
                <div className="table-wrap compact">
                  <table className="data" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>{L.thChip}</th>
                        <th style={{ textAlign: 'right' }}>{L.thValue}</th>
                        <th style={{ textAlign: 'right' }}>{L.thCount}</th>
                        <th style={{ textAlign: 'right' }}>{L.thPoints}</th>
                        <th style={{ textAlign: 'right' }}>{L.thLeftover}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.chips.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <span className="row" style={{ gap: 8 }}>
                              <span
                                aria-hidden
                                style={{
                                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                                  background: c.color, border: '2.5px dashed rgba(0,0,0,0.35)',
                                  boxShadow: '0 0 0 1px rgba(236,233,223,0.25)',
                                }}
                              />
                              {c.label}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>{c.value.toLocaleString('de-DE')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800 }}>{c.perPlayer}</td>
                          <td style={{ textAlign: 'right' }}>{c.perPlayerValue.toLocaleString('de-DE')}</td>
                          <td style={{ textAlign: 'right', color: 'var(--text-faint)' }}>{c.leftover}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="small faint" style={{ marginTop: 8 }}>
                  {L.bankNote}
                </p>
              </div>

              {plan.warnings.map((w) => (
                <div key={w} className="feedback-box bad" style={{ marginBottom: 14 }}>{w}</div>
              ))}

              <div className="card">
                <div style={{ fontWeight: 800, marginBottom: 4 }}>{L.tourneyTitle}</div>
                <p className="small muted" style={{ marginBottom: 10 }}>
                  {L.tourneyHelp}
                </p>
                <div className="table-wrap compact">
                  <table className="data" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>{L.thLevel}</th>
                        <th style={{ textAlign: 'right' }}>{L.thSmallBlind}</th>
                        <th style={{ textAlign: 'right' }}>{L.thBigBlind}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.levels.map((l) => (
                        <tr key={l.level}>
                          <td>{l.level}</td>
                          <td style={{ textAlign: 'right' }}>{l.sb.toLocaleString('de-DE')}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800 }}>{l.bb.toLocaleString('de-DE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
