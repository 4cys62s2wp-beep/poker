/* Bereich „Nachschlagen" – die mittlere Ebene zwischen Hub und Detail.
   ====================================================================

   Der Unterschied zu „Lernen" ist keine Themenfrage, sondern eine Frage der
   Absicht: Hier gibt es **keinen Fortschritt**. Wer hier landet, will eine
   Antwort und ist danach fertig. Deshalb steht hier nirgends „x von y",
   nirgends ein Balken, nirgends eine Streak.

   Warum ein dichtes Raster und keine großen Karten wie unter „Live-Session":
   Dort sind es vier Einträge, die jeweils erklären müssen, wann man sie
   braucht. Hier sind es sieben, und ihre Namen sagen es bereits. Sieben große
   Karten wären Scrollen statt Nachschlagen – und die Vorgabe lautet zwei
   Schritte bis zum Ziel.

   Die Suche ist genau dafür da: Ein Begriff, ein Tipp, angekommen. Sie sucht
   über die Bereiche UND über das Glossar, weil ein Nutzer, der „Squeeze"
   eintippt, nicht wissen kann, dass das ein Glossareintrag ist und keine
   eigene Seite. */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { PageHeader } from '../components/ui';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/nachschlagen';

type Tone = 'gold' | 'green' | 'blue' | 'red' | 'violet';

interface Eintrag {
  to: string;
  icon: IconName;
  tone: Tone;
  title: string;
  desc: string;
  /** Zusätzliche Suchwörter, unter denen Nutzer diesen Eintrag erwarten. */
  keywords: string[];
}

export function ReferencePage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const eintraege: Eintrag[] = [
    {
      to: '/nachschlagen/coach', icon: 'coach', tone: 'red',
      title: L.coachTitle, desc: L.coachDesc,
      keywords: ['coach', 'hand', 'empfehlung', 'advice', 'was tun', 'spot'],
    },
    {
      to: '/nachschlagen/glossar', icon: 'glossary', tone: 'blue',
      title: L.glossaryTitle, desc: L.glossaryDesc,
      keywords: ['glossar', 'glossary', 'begriff', 'term', 'bedeutung', 'wort'],
    },
    {
      to: '/nachschlagen/haende', icon: 'search', tone: 'green',
      title: L.handsTitle, desc: L.handsDesc,
      keywords: ['starthand', 'starting hand', 'hände', 'hands', 'position', 'ak', 'aa'],
    },
    {
      to: '/nachschlagen/ranges', icon: 'grid', tone: 'gold',
      title: L.rangesTitle, desc: L.rangesDesc,
      keywords: ['range', 'chart', 'raster', 'open', 'eröffnen', '3bet', '3-bet'],
    },
    {
      to: '/nachschlagen/odds', icon: 'chart', tone: 'blue',
      title: L.oddsTitle, desc: L.oddsDesc,
      keywords: ['odds', 'outs', 'pot odds', 'wahrscheinlichkeit', 'chance', 'prozent'],
    },
    {
      to: '/nachschlagen/equity', icon: 'scale', tone: 'violet',
      title: L.equityTitle, desc: L.equityDesc,
      keywords: ['equity', 'rechner', 'calculator', 'gegen', 'versus', 'ausrechnen'],
    },
    {
      to: '/nachschlagen/tells', icon: 'eye', tone: 'violet',
      title: L.tellsTitle, desc: L.tellsDesc,
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

      <form onSubmit={springen} role="search" style={{ marginBottom: 'var(--sp-5)' }}>
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
              <div className="grid cols-2" style={{ marginTop: 'var(--sp-2)' }}>
                {treffer.bereiche.map((e) => (
                  <Link key={e.to} to={e.to} className="card clickable">
                    <div className="row" style={{ alignItems: 'flex-start' }}>
                      <IconTile name={e.icon} tone={e.tone} />
                      <div>
                        <div style={{ fontWeight: 'var(--fw-bold)' }}>{e.title}</div>
                        <div className="small muted" style={{ marginTop: 3 }}>{e.desc}</div>
                      </div>
                    </div>
                  </Link>
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

      {/* Ohne Suchbegriff: alles, dicht und scannbar. */}
      {!treffer && (
        <div className="grid cols-2">
          {eintraege.map((e) => (
            <Link key={e.to} to={e.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <IconTile name={e.icon} tone={e.tone} />
                <div>
                  <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-body)' }}>{e.title}</div>
                  <div className="small muted" style={{ marginTop: 3 }}>{e.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
