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
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { IconName } from '../components/Icon';
import { SuchFeld } from '../components/SuchFeld';
import { SuchTreffer } from '../components/SuchTreffer';
import { MIN_ZEICHEN, bestesZiel, suche } from '../lib/suche';
import { useSuchquellen } from '../lib/suche/nutzen';
import { Bereichskachel, MiniRaster } from '../components/Bereich';
import { CardsRow } from '../components/PlayingCard';
import { PageHeader } from '../components/ui';
import { RFI_CHARTS } from '../content/ranges';
import { expandRangeSpec, rangePercent } from '../lib/poker/ranges';
import {
  OUTS_FLUSHDRAW, OUTS_GUTSHOT, chanceZweiKarten,
} from '../lib/poker/outs';
import { zeichenFuer } from '../lib/zeichen';
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
      to: '/nachschlagen/coach', icon: zeichenFuer('/nachschlagen/coach'),
      title: L.coachTitle,
      inhalt: L.coachInhalt,
      vorschau: <CardsRow cards={['As', 'Kh']} size="sm" />,
    },
    {
      to: '/nachschlagen/glossar', icon: zeichenFuer('/nachschlagen/glossar'),
      title: L.glossaryTitle,
      inhalt: L.glossaryInhalt(content.glossary.length),
    },
    {
      to: '/nachschlagen/haende', icon: zeichenFuer('/nachschlagen/haende'),
      title: L.handsTitle,
      inhalt: L.handsInhalt(btn.anteil),
      vorschau: <MiniRaster range={btn.range} />,
    },
    {
      to: '/nachschlagen/ranges', icon: zeichenFuer('/nachschlagen/ranges'),
      title: L.rangesTitle,
      inhalt: L.rangesInhalt(RFI_CHARTS.length),
      vorschau: <MiniRaster range={utg} />,
    },
    {
      to: '/nachschlagen/odds', icon: zeichenFuer('/nachschlagen/odds'),
      title: L.oddsTitle,
      inhalt: L.oddsInhalt(flushdraw, gutshot),
    },
    {
      to: '/nachschlagen/equity', icon: zeichenFuer('/nachschlagen/equity'),
      title: L.equityTitle,
      inhalt: L.equityInhalt,
    },
    {
      to: '/nachschlagen/tells', icon: zeichenFuer('/nachschlagen/tells'),
      title: L.tellsTitle,
      inhalt: L.tellsInhalt(content.tells.length),
    },
  ];

  /* Eine Suche für alles (E-096): Werkzeuge, Lektionen, Begriffe — in
     derselben Reihenfolge wie auf „Lernen“ und im Suchdialog. */
  const quellen = useSuchquellen();
  const ergebnis = useMemo(() => suche(query, quellen), [query, quellen]);
  const sucht = query.trim().length >= MIN_ZEICHEN;

  /* Enter springt auf den besten Treffer. Wer tippt und Enter drückt, will
     ankommen, nicht noch einmal zielen. */
  const springen = (e: React.FormEvent) => {
    e.preventDefault();
    const ziel = bestesZiel(ergebnis);
    if (ziel) navigate(ziel);
  };

  return (
    <div>
      <PageHeader
        title={L.title}
        sub={L.sub}
        backTo="/"
      />

      <form onSubmit={springen} role="search" style={{ marginBottom: 'var(--sp-4)' }}>
        <SuchFeld id="nachschlagen-suche" value={query} onChange={setQuery} />
      </form>

      {sucht && (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <SuchTreffer ergebnis={ergebnis} abfrage={query} />
        </div>
      )}

      {/* Ohne Suchbegriff: alles, dicht und mit Inhalt. */}
      {!sucht && (
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
