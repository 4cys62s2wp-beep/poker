import { Link } from 'react-router-dom';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/oddstables';
/* Die beiden Formeln stehen in der Bibliothek, nicht hier: Dieselben Zahlen
   erscheinen als Vorschau auf der Nachschlagen-Seite, und eine zweite
   Abschrift läuft irgendwann auseinander. */
import { chanceEineKarte as oneCard, chanceZweiKarten as twoCards } from '../../lib/poker/outs';
import { BackLink } from '../../components/ui';
import { STR as NAV } from '../../i18n/pages/layout';

export function OddsTables() {
  const { lang } = useLang();
  const L = STR[lang];
  const outsRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20];

  return (
    <div>
      <BackLink to="/nachschlagen" label={NAV[lang].navLookup} />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="section-title">{L.sectionOuts}</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>{L.thOuts}</th>
              <th>{L.thDraw}</th>
              <th>{L.thNextCard}</th>
              <th>{L.thFlopRiver}</th>
              <th>{L.thRule4}</th>
            </tr>
          </thead>
          <tbody>
            {outsRows.map((o) => (
              <tr key={o}>
                <td><strong>{o}</strong></td>
                <td>{L.outsExamples[o] ?? '–'}</td>
                <td>{L.fmtPct(oneCard(o))}</td>
                <td>{L.fmtPct(twoCards(o))}</td>
                <td>{L.fmtIntPct(Math.min(100, o * 4))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small faint" style={{ maxWidth: 700 }}>
        {L.outsNote}
      </p>

      <div className="section-title">{L.sectionMatchups}</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>{L.thMatchup}</th>
              <th>{L.thExample}</th>
              <th>{L.thEquity}</th>
            </tr>
          </thead>
          <tbody>
            {L.matchups.map((m, i) => (
              <tr key={i}>
                <td>{m[0]}</td>
                <td>{m[1]}</td>
                <td><strong>{m[2]}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">{L.sectionPotOdds}</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>{L.thBetSize}</th>
              <th>{L.thNeededEquity}</th>
              <th>{L.thOdds}</th>
            </tr>
          </thead>
          <tbody>
            {L.potOdds.map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td><strong>{row[1]}</strong></td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title">{L.sectionPreflop}</div>
      <div className="table-wrap" style={{ maxWidth: 760 }}>
        <table className="data">
          <thead>
            <tr>
              <th>{L.thEvent}</th>
              <th>{L.thProbability}</th>
            </tr>
          </thead>
          <tbody>
            {L.preflopProbs.map((row, i) => (
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
