/* Chip-Rechner: Pokerkoffer eingeben → faire Verteilung, Startstack, Blinds
   und ein Blind-Fahrplan für den Pokerabend. Das Setup wird lokal gemerkt,
   damit der eigene Koffer beim nächsten Abend sofort wieder da ist. */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { STR as NAV } from '../../i18n/pages/layout';
import { Zurueck } from '../../components/ui';
import { planChips, type ChipInput } from '../../lib/chips';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/chips';
import { Icon } from '../../components/Icon';
import { FARBEN, ladeKoffer, speichereKoffer, type KofferZeile } from '../../lib/koffer';

/* Die Anzeigenamen der Farben kommen sprachabhängig aus STR[lang].colorNames
   (gleiche Reihenfolge wie `FARBEN`) – sie dienen nur als Vorbelegung neuer Zeilen. */
const CHIP_COLORS = FARBEN;

type Row = KofferZeile;

/* Namen der Presets stehen sprachabhängig in STR[lang].presetNames (gleiche Reihenfolge). */
const PRESETS: Array<{ counts: number[] }> = [
  { counts: [100, 100, 50, 25, 25] }, // 300er-Koffer
  { counts: [150, 150, 100, 50, 50] }, // 500er-Koffer
  { counts: [300, 300, 200, 100, 100] }, // 1000er-Koffer
];

function makeRows(counts: number[], colorNames: string[]): Row[] {
  return counts.map((count, i) => ({
    id: `chip-${i}`,
    label: colorNames[i % colorNames.length],
    color: CHIP_COLORS[i % CHIP_COLORS.length],
    count: String(count),
  }));
}

export function ChipCalculator() {
  const { lang } = useLang();
  const L = STR[lang];
  // Zahlformat folgt der Sprache (1.500 vs. 1,500).
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const saved = useMemo(ladeKoffer, []);
  const [players, setPlayers] = useState(saved?.players ?? 5);
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? makeRows(PRESETS[0].counts, L.colorNames));

  /* „Mein Koffer": Was hier steht, liest auch „Abend einrichten". */
  useEffect(() => {
    speichereKoffer({ players, rows });
  }, [players, rows]);

  const plan = useMemo(() => {
    const input: ChipInput[] = rows.map((r) => ({
      id: r.id,
      label: r.label.trim() || 'Chip',
      color: r.color,
      count: Math.max(0, Math.floor(Number(r.count) || 0)),
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
      return [...rs, { id: `chip-${Date.now()}`, label: L.colorNames[idx], color: CHIP_COLORS[idx], count: '' }];
    });
  }

  return (
    <div>
      <Zurueck to="/session" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="stat-label satz" style={{ marginBottom: 6 }}>{L.playersQuestion}</div>
          <div className="row" style={{ marginBottom: 16 }}>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.max(2, p - 1))} aria-label={L.fewerPlayersAria}>−</button>
            <span style={{ fontWeight: 800, fontSize: 'var(--fs-ueberschrift)', minWidth: 34, textAlign: 'center' }}>{players}</span>
            <button className="btn sm" onClick={() => setPlayers((p) => Math.min(10, p + 1))} aria-label={L.morePlayersAria}>+</button>
          </div>

          <div className="stat-label satz" style={{ marginBottom: 6 }}>{L.whichChips}</div>
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
              {rows.length > 1 && (
                <button
                  className="btn sm ghost"
                  onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                  aria-label={L.removeAria(r.label)}
                >
                  <Icon name="x" size={16} />
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
                  <div className="big-stat" style={{ fontSize: '1.625rem' }}>{plan.stackValue.toLocaleString(nf)}</div>
                  <div className="small faint">{L.stackSub(plan.stackBB)}</div>
                </div>
                <div className="card">
                  <div className="stat-label">{L.blindsStart}</div>
                  <div className="big-stat" style={{ fontSize: '1.625rem' }}>
                    {plan.smallBlind.toLocaleString(nf)} / {plan.bigBlind.toLocaleString(nf)}
                  </div>
                  <div className="small faint">{L.blindsSub}</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>{L.dealTitle}</div>
                {/* Eine Karte je Farbe statt einer Tabelle: Auf dem Handy war die Spalte
                    „übrig" abgeschnitten, und der Name der Farbe stand dort, wo am
                    wenigsten Platz war. */}
                <ul className="koffer-karten">
                  {plan.chips.map((c) => (
                    <li key={c.id} className="koffer-karte">
                      <span className="koffer-name">
                        <span className="chip-punkt" style={{ background: c.color }} aria-hidden="true" />
                        {c.label}
                      </span>
                      <dl>
                        <div><dt>{L.thValue}</dt><dd>{c.value.toLocaleString(nf)}</dd></div>
                        <div><dt>{L.thCount}</dt><dd className="fett">{c.perPlayer}</dd></div>
                        <div><dt>{L.thPoints}</dt><dd>{c.perPlayerValue.toLocaleString(nf)}</dd></div>
                        <div><dt>{L.thLeftover}</dt><dd className="leise">{c.leftover}</dd></div>
                      </dl>
                    </li>
                  ))}
                </ul>
                <p className="small faint" style={{ marginTop: 8 }}>
                  {L.bankNote}
                </p>
              </div>

              {plan.warnings.map((w) => (
                <div key={w} className="feedback-box bad" style={{ marginBottom: 14 }}>
                  {L.warnings[w](plan.stackBB)}
                </div>
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
                          <td style={{ textAlign: 'right' }}>{l.sb.toLocaleString(nf)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800 }}>{l.bb.toLocaleString(nf)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Link className="btn primary lg" to="/session/live/einrichten" style={{ marginTop: 14 }}>
                {L.toSetup}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
