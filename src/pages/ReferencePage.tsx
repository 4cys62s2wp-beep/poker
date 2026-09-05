/* Bereich „Nachschlagen" – die mittlere Ebene zwischen Hub und Detail.
   ====================================================================

   Der Unterschied zu „Lernen" ist keine Themenfrage, sondern eine Frage der
   Absicht: Hier gibt es **keinen Fortschritt**. Wer hier landet, will eine
   Antwort und ist danach fertig. Deshalb steht hier nirgends „x von y",
   nirgends ein Balken, nirgends eine Streak.

   Warum Kacheln und keine erklärenden Karten (E-042): Hier stand unter jedem
   Namen ein Satz, der den Namen erklärte — „Glossar: Jeder Begriff, den am
   Tisch jemand fallen lässt". Sieben davon untereinander waren sieben
   Absätze und zweieinhalb Bildschirme; die Vorgabe lautet zwei Schritte bis
   zum Ziel.

   Jetzt trägt jede Kachel, was hinter ihr liegt: die Zahl der Begriffe, die
   Form der Eröffnungsrange, die zwei Prozentzahlen, nach denen am häufigsten
   gefragt wird. Das ist kürzer als der Satz — und es ist eine Auskunft, für
   die man vorher hätte tippen müssen.

   Die Suche ist genau dafür da: Ein Begriff, ein Tipp, angekommen. Sie sucht
   über die Bereiche UND über das Glossar, weil ein Nutzer, der „Squeeze"
   eintippt, nicht wissen kann, dass das ein Glossareintrag ist und keine
   eigene Seite. */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { Bereichskachel, MiniRaster } from '../components/Bereich';
import { CardsRow } from '../components/PlayingCard';
import { PageHeader } from '../components/ui';
import { RFI_CHARTS } from '../content/ranges';
import { expandRangeSpec, rangePercent } from '../lib/poker/ranges';
import {
  OUTS_FLUSHDRAW, OUTS_GUTSHOT, chanceZweiKarten,
} from '../lib/poker/outs';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/nachschlagen';

interface Eintrag {
  to: string;
  icon: IconName;
  title: string;
  /** Was hinter der Kachel liegt — eine Zeile aus echten Daten. */
  inhalt: ReactNode;
  /** Der Gegenstand selbst, klein. Nur wo es einen gibt. */
  vorschau?: ReactNode;
  /** Wonach in der Suche gefunden wird — auch das, was nicht auf der Kachel steht. */
  keywords: string[];
  /** Für die Trefferliste: der alte, erklärende Satz. Dort ist er richtig. */
  desc: string;
}

export function ReferencePage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  /* Die Vorschauen kommen aus denselben Daten wie die Seiten dahinter —
     eine Kachel, die eine Zahl behauptet, die auf der Zielseite anders
     lautet, ist schlimmer als eine ohne Zahl. */
  const btn = useMemo(() => {
    const chart = RFI_CHARTS.find((c) => c.position === 'BTN') ?? RFI_CHARTS[0];
    const range = expandRangeSpec(chart.raise);
    /* `rangePercent` liefert einen Anteil zwischen 0 und 1. */
    return { range, anteil: Math.round(rangePercent(range) * 100) };
  }, []);
  const utg = useMemo(() => {
    const chart = RFI_CHARTS.find((c) => c.position === 'UTG') ?? RFI_CHARTS[0];
    return expandRangeSpec(chart.raise);
  }, []);
  const flushdraw = Math.round(chanceZweiKarten(OUTS_FLUSHDRAW) * 100);
  const gutshot = Math.round(chanceZweiKarten(OUTS_GUTSHOT) * 100);

  const eintraege: Eintrag[] = [
    {
      to: '/nachschlagen/coach', icon: 'coach',
      title: L.coachTitle, desc: L.coachDesc,
      inhalt: L.coachInhalt,
      vorschau: <CardsRow cards={['As', 'Kh']} size="sm" />,
      keywords: ['coach', 'hand', 'empfehlung', 'advice', 'was tun', 'spot'],
    },
    {
      to: '/nachschlagen/glossar', icon: 'glossary',
      title: L.glossaryTitle, desc: L.glossaryDesc,
      inhalt: L.glossaryInhalt(content.glossary.length),
      keywords: ['glossar', 'glossary', 'begriff', 'term', 'bedeutung', 'wort'],
    },
    {
      to: '/nachschlagen/haende', icon: 'search',
      title: L.handsTitle, desc: L.handsDesc,
      inhalt: L.handsInhalt(btn.anteil),
      vorschau: <MiniRaster range={btn.range} />,
      keywords: ['starthand', 'starting hand', 'hände', 'hands', 'position', 'ak', 'aa'],
    },
    {
      to: '/nachschlagen/ranges', icon: 'grid',
      title: L.rangesTitle, desc: L.rangesDesc,
      inhalt: L.rangesInhalt(RFI_CHARTS.length),
      vorschau: <MiniRaster range={utg} />,
      keywords: ['range', 'chart', 'raster', 'open', 'eröffnen', '3bet', '3-bet'],
    },
    {
      to: '/nachschlagen/odds', icon: 'chart',
      title: L.oddsTitle, desc: L.oddsDesc,
      inhalt: L.oddsInhalt(flushdraw, gutshot),
      keywords: ['odds', 'outs', 'pot odds', 'wahrscheinlichkeit', 'chance', 'prozent'],
    },
    {
      to: '/nachschlagen/equity', icon: 'scale',
      title: L.equityTitle, desc: L.equityDesc,
      inhalt: L.equityInhalt,
      keywords: ['equity', 'rechner', 'calculator', 'gegen', 'versus', 'ausrechnen'],
    },
    {
      to: '/nachschlagen/tells', icon: 'eye',
      title: L.tellsTitle, desc: L.tellsDesc,
      inhalt: L.tellsInhalt(content.tells.length),
      keywords: ['tell', 'tells', 'read', 'gegner', 'körpersprache', 'verhalten'],
    },
  ];

  const q = query.trim().toLowerCase();

  /* Zwei Trefferarten, bewusst getrennt dargestellt: Bereiche zuerst (ein Tipp
     ist man am Ziel), Glossarbegriffe darunter (zwei Tipps, aber mit dem Wort
     schon eingesetzt – deshalb der ?q=-Parameter). */
  const treffer = useMemo(() => {
    if (q.length < 2) return null;

    const bereiche = eintraege.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.includes(q)),
    );

    const begriffe = content.glossary
      .filter((g) => g.term.toLowerCase().includes(q))
      .slice(0, 6);

    return { bereiche, begriffe };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, content.glossary, lang]);

  /* Enter springt auf den besten Treffer. Wer tippt und Enter drückt, will
     ankommen, nicht noch einmal zielen. */
  const springen = (e: React.FormEvent) => {
    e.preventDefault();
    const ziel = treffer?.bereiche[0]?.to
      ?? (treffer?.begriffe[0]
        ? `/nachschlagen/glossar?q=${encodeURIComponent(treffer.begriffe[0].term)}`
        : null);
    if (ziel) navigate(ziel);
  };

  return (
    <div>
      <PageHeader
        eyebrow={L.eyebrow}
        title={L.title}
        sub={L.sub}
        backTo="/"
        backLabel={L.backHome}
      />

      <form onSubmit={springen} role="search" style={{ marginBottom: 'var(--sp-4)' }}>
        <label htmlFor="nachschlagen-suche" className="sr-only">{L.searchLabel}</label>
        <div style={{ position: 'relative' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', left: 'var(--sp-3)', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-faint)',
              display: 'flex', pointerEvents: 'none',
            }}
          >
            <Icon name="search" size={17} />
          </span>
          <input
            id="nachschlagen-suche"
            className="search-input"
            type="search"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder={L.searchPlaceholder}
            autoComplete="off"
            style={{ paddingLeft: 'calc(var(--sp-3) + 17px + var(--sp-2))' }}
          />
        </div>
      </form>

      {treffer && (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          {treffer.bereiche.length === 0 && treffer.begriffe.length === 0 && (
            <p className="small muted" style={{ margin: 0 }}>{L.searchNothing(query.trim())}</p>
          )}

          {treffer.bereiche.length > 0 && (
            <>
              <div className="eyebrow">{L.searchHintTool}</div>
              <div className="bereiche nachschlagen" style={{ marginTop: 'var(--sp-2)' }}>
                {treffer.bereiche.map((e) => (
                  <Bereichskachel
                    key={e.to} to={e.to} icon={e.icon} titel={e.title}
                    /* In der Trefferliste steht der erklärende Satz: Wer
                       sucht, will wissen, ob das das Gesuchte ist. */
                    inhalt={e.desc}
                  />
                ))}
              </div>
            </>
          )}

          {treffer.begriffe.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginTop: 'var(--sp-4)' }}>{L.searchHintGlossary}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
                {treffer.begriffe.map((g) => (
                  <Link
                    key={g.term}
                    to={`/nachschlagen/glossar?q=${encodeURIComponent(g.term)}`}
                    className="chip-link"
                  >
                    {g.term}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Ohne Suchbegriff: alles, dicht und mit Inhalt. */}
      {!treffer && (
        <div className="bereiche nachschlagen">
          {eintraege.map((e) => (
            <Bereichskachel
              key={e.to} to={e.to} icon={e.icon} titel={e.title}
              inhalt={e.inhalt} vorschau={e.vorschau}
            />
          ))}
        </div>
      )}
    </div>
  );
}
