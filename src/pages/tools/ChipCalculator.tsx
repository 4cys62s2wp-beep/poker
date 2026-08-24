/* Chip-Rechner: Pokerkoffer eingeben → faire Verteilung, Startstack, Blinds
   und ein Blind-Fahrplan für den Pokerabend. Das Setup wird lokal gemerkt,
   damit der eigene Koffer beim nächsten Abend sofort wieder da ist. */

import { useEffect, useMemo, useState } from 'react';
import { planChips, type ChipInput } from '../../lib/chips';

const CHIP_COLORS: Array<{ label: string; color: string }> = [
  { label: 'Weiß', color: '#e8e4d8' },
  { label: 'Rot', color: '#c94f44' },
  { label: 'Blau', color: '#3f6fb5' },
  { label: 'Grün', color: '#3f8f5a' },
  { label: 'Schwarz', color: '#494952' },
  { label: 'Lila', color: '#7b5ea7' },
  { label: 'Orange', color: '#d98c3a' },
  { label: 'Gelb', color: '#cdb83d' },
];

interface Row {
  id: string;
  label: string;
  color: string;
  count: string;
  value: string;
}

const PRESETS: Array<{ name: string; counts: number[] }> = [
  { name: '300er-Koffer', counts: [100, 100, 50, 25, 25] },
  { name: '500er-Koffer', counts: [150, 150, 100, 50, 50] },
  { name: '1000er-Koffer', counts: [300, 300, 200, 100, 100] },
];

const STORAGE_KEY = 'pokermentor-chips-setup';

function makeRows(counts: number[]): Row[] {
  return counts.map((count, i) => ({
    id: `chip-${i}`,
    label: CHIP_COLORS[i % CHIP_COLORS.length].label,
    color: CHIP_COLORS[i % CHIP_COLORS.length].color,
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
          color: /^#[0-9a-fA-F]{6}$/.test(r.color) ? r.color : CHIP_COLORS[0].color,
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
  const saved = useMemo(loadSaved, []);
  const [players, setPlayers] = useState(saved?.players ?? 5);
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? makeRows(PRESETS[0].counts));

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
      const next = CHIP_COLORS.find((c) => !used.has(c.color)) ?? CHIP_COLORS[rs.length % CHIP_COLORS.length];
      return [...rs, { id: `chip-${Date.now()}`, label: next.label, color: next.color, count: '', value: '' }];
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Für den Pokerabend</div>
        <h1>Chip-Rechner</h1>
        <p className="sub">
          Koffer aufmachen, Chips zählen, eintragen – und du bekommst sofort die faire Verteilung, den Startstack
          und passende Blinds. Auch wenn Chips fehlen oder ihr mehrere Koffer mischt.
        </p>
      </div>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="stat-label" style={{ marginBottom: 6 }}>Wie viele Spieler seid ihr?</div>
          <div className="row" style={{ marginBottom: 16 }}>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.max(2, p - 1))} aria-label="Weniger Spieler">−</button>
            <span style={{ fontWeight: 800, fontSize: 22, minWidth: 34, textAlign: 'center' }}>{players}</span>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.min(10, p + 1))} aria-label="Mehr Spieler">+</button>
          </div>

          <div className="stat-label" style={{ marginBottom: 6 }}>Welche Chips habt ihr?</div>
          <p className="small muted" style={{ marginBottom: 10 }}>
            Anzahl pro Sorte eintragen. Werte vergibt der Rechner automatisch (häufigste Sorte = kleinster Wert) –
            du kannst sie aber überschreiben, falls eure Chips aufgedruckte Werte haben.
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
                aria-label="Chip-Name"
              />
              <input
                className="text-input"
                style={{ width: 66, flexShrink: 0, padding: '12px 10px' }}
                inputMode="numeric"
                placeholder="Stück"
                value={r.count}
                maxLength={6}
                onChange={(e) => updateRow(r.id, { count: e.target.value.replace(/\D/g, '') })}
                aria-label={`Anzahl ${r.label}`}
              />
              <input
                className="text-input"
                style={{ width: 60, flexShrink: 0, padding: '12px 10px' }}
                inputMode="numeric"
                placeholder="Wert"
                value={r.value}
                maxLength={8}
                onChange={(e) => updateRow(r.id, { value: e.target.value.replace(/\D/g, '') })}
                aria-label={`Wert ${r.label}`}
              />
              {rows.length > 1 && (
                <button
                  className="btn sm ghost"
                  onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                  aria-label={`${r.label} entfernen`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="row wrap" style={{ marginTop: 12 }}>
            {rows.length < 8 && (
              <button className="btn sm" onClick={addRow}>+ Chip-Sorte</button>
            )}
            {PRESETS.map((p) => (
              <button key={p.name} className="btn sm ghost" onClick={() => setRows(makeRows(p.counts))}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          {!plan && (
            <div className="card">
              <p className="muted">
                Trag mindestens eine Chip-Sorte mit Anzahl ein – es müssen genug Chips für alle Spieler da sein.
              </p>
            </div>
          )}

          {plan && (
            <>
              <div className="grid cols-2" style={{ marginBottom: 14 }}>
                <div className="card">
                  <div className="stat-label">Startstack pro Spieler</div>
                  <div className="big-stat" style={{ fontSize: 26 }}>{plan.stackValue.toLocaleString('de-DE')}</div>
                  <div className="small faint">Punkte · entspricht ~{plan.stackBB} Big Blinds</div>
                </div>
                <div className="card">
                  <div className="stat-label">Blinds zum Start</div>
                  <div className="big-stat" style={{ fontSize: 26 }}>
                    {plan.smallBlind.toLocaleString('de-DE')} / {plan.bigBlind.toLocaleString('de-DE')}
                  </div>
                  <div className="small faint">Small Blind / Big Blind</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>So teilt ihr aus – jeder Spieler bekommt:</div>
                <div className="table-wrap compact">
                  <table className="data" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Chip</th>
                        <th style={{ textAlign: 'right' }}>Wert</th>
                        <th style={{ textAlign: 'right' }}>Stück</th>
                        <th style={{ textAlign: 'right' }}>Punkte</th>
                        <th style={{ textAlign: 'right' }}>übrig</th>
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
                  Übrige Chips kommen in die Bank – zum Wechseln oder für Rebuys.
                </p>
              </div>

              {plan.warnings.map((w) => (
                <div key={w} className="feedback-box bad" style={{ marginBottom: 14 }}>{w}</div>
              ))}

              <div className="card">
                <div style={{ fontWeight: 800, marginBottom: 4 }}>Turnier-Modus: Blind-Fahrplan</div>
                <p className="small muted" style={{ marginBottom: 10 }}>
                  Erhöht die Blinds alle 15–20 Minuten eine Stufe (kürzer = schnelleres Turnier). Bei einem
                  Cash-Game bleiben die Start-Blinds einfach den ganzen Abend stehen.
                </p>
                <div className="table-wrap compact">
                  <table className="data" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Stufe</th>
                        <th style={{ textAlign: 'right' }}>Small Blind</th>
                        <th style={{ textAlign: 'right' }}>Big Blind</th>
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
