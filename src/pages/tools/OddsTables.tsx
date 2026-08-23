import { Link } from 'react-router-dom';

function pct(x: number, digits = 1): string {
  return (100 * x).toFixed(digits).replace('.', ',') + ' %';
}

/** Equity mit `outs` Outs: eine Karte (River) bzw. Turn + River. */
function oneCard(outs: number): number {
  return outs / 46;
}
function twoCards(outs: number): number {
  return 1 - ((47 - outs) / 47) * ((46 - outs) / 46);
}

const OUTS_EXAMPLES: Record<number, string> = {
  1: 'Set → Quads (eine Karte)',
  2: 'Pocket Pair → Set',
  4: 'Gutshot',
  6: 'Zwei Overcards',
  8: 'Open-Ended Straight Draw',
  9: 'Flushdraw',
  12: 'Flushdraw + Gutshot',
  15: 'Flushdraw + OESD oder + 2 Overcards',
};

const MATCHUPS = [
  ['Overpair vs. kleineres Paar', 'QQ vs. 77', '≈ 80 : 20'],
  ['Paar vs. zwei Overcards („Coinflip“)', '88 vs. A♠K♦', '≈ 55 : 45'],
  ['Paar vs. eine Overcard', 'TT vs. A♣7♦', '≈ 70 : 30'],
  ['Dominierte Hand', 'AK vs. AQ', '≈ 74 : 26'],
  ['Zwei höhere vs. zwei niedrigere Karten', 'AK vs. 87', '≈ 62 : 38'],
  ['Overpair vs. Suited Connector', 'AA vs. 7♥6♥', '≈ 77 : 23'],
];

const POT_ODDS = [
  ['¼ Pot', '16,7 %', '5 : 1'],
  ['⅓ Pot', '20,0 %', '4 : 1'],
  ['½ Pot', '25,0 %', '3 : 1'],
  ['⅔ Pot', '28,6 %', '2,5 : 1'],
  ['¾ Pot', '30,0 %', '2,33 : 1'],
  ['Pot', '33,3 %', '2 : 1'],
  ['1,5x Pot', '37,5 %', '1,67 : 1'],
  ['2x Pot', '40,0 %', '1,5 : 1'],
];

const PREFLOP_PROBS = [
  ['Ein bestimmtes Paar (z. B. AA)', '0,45 % (1 zu 221)'],
  ['Irgendein Pocket Pair', '5,9 % (1 zu 16)'],
  ['AK (suited oder offsuit)', '1,2 % (1 zu 82)'],
  ['Zwei suited Karten', '23,5 %'],
  ['Mit Pocket Pair ein Set (oder besser) am Flop', '≈ 11,8 % (1 zu 7,5)'],
  ['Mit zwei ungepaarten Karten mind. ein Paar am Flop', '≈ 32 %'],
  ['Mit suited Karten ein Flushdraw am Flop', '≈ 10,9 %'],
  ['Mit suited Karten ein fertiger Flush am Flop', '≈ 0,8 %'],
];

export function OddsTables() {
  const outsRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20];

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <h1>Odds-Spickzettel</h1>
        <p className="sub">Die wichtigsten Zahlen zum Nachschlagen – exakt berechnet, nicht nur Faustregel.</p>
      </div>

      <div className="section-title">Outs → Equity</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>Outs</th>
              <th>Typischer Draw</th>
              <th>Nächste Karte</th>
              <th>Flop → River</th>
              <th>Regel von 4</th>
            </tr>
          </thead>
          <tbody>
            {outsRows.map((o) => (
              <tr key={o}>
                <td><strong>{o}</strong></td>
                <td>{OUTS_EXAMPLES[o] ?? '–'}</td>
                <td>{pct(oneCard(o))}</td>
                <td>{pct(twoCards(o))}</td>
                <td>{Math.min(100, o * 4)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small faint" style={{ maxWidth: 700 }}>
        „Nächste Karte“ = Wahrscheinlichkeit, mit genau der nächsten Karte zu treffen (46 unbekannte Karten am Turn).
        Ab ca. 12 Outs überschätzt die Regel von 4 leicht.
      </p>

      <div className="section-title">Klassische Preflop-Matchups</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>Matchup</th>
              <th>Beispiel</th>
              <th>Equity</th>
            </tr>
          </thead>
          <tbody>
            {MATCHUPS.map((m, i) => (
              <tr key={i}>
                <td>{m[0]}</td>
                <td>{m[1]}</td>
                <td><strong>{m[2]}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">Pot Odds nach Bet-Größe</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>Bet-Größe</th>
              <th>Benötigte Equity für Call</th>
              <th>Odds</th>
            </tr>
          </thead>
          <tbody>
            {POT_ODDS.map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td><strong>{row[1]}</strong></td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">Preflop- & Flop-Wahrscheinlichkeiten</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>Ereignis</th>
              <th>Wahrscheinlichkeit</th>
            </tr>
          </thead>
          <tbody>
            {PREFLOP_PROBS.map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td><strong>{row[1]}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
