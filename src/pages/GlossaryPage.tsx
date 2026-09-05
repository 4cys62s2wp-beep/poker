import { useMemo, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { useSearchParams } from 'react-router-dom';
import type { GlossaryCategory } from '../content/types';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/glossarypage';

/* Kategorie-Schlüssel bleiben in beiden Sprachen deutsch (GlossaryCategory);
   angezeigt wird das übersetzte Label aus STR[lang].categoryLabels. */
const CATEGORIES: Array<GlossaryCategory | 'Alle'> = [
  'Alle',
  'Grundlagen',
  'Aktionen',
  'Mathematik',
  'Strategie',
  'Online',
  'Live',
  'Turnier',
  'Slang',
];

/* Das Glossar war eine Wand.
   ========================
   159 Begriffe mit vollständiger Definition, alle gleichzeitig ausgeklappt:
   **30 219 Pixel** Seitenhöhe auf einem 844 Pixel hohen Bildschirm. Wer
   „Squeeze" nachschlagen wollte, bekam 36 Bildschirmlängen Fließtext.

   Jetzt ist es ein Wörterbuch (E-042): eine Zeile je Begriff mit der ersten
   Zeile der Erklärung, nach Anfangsbuchstaben gruppiert, und ein Tipp klappt
   den Eintrag auf. Die Vorschauzeile ist der Grund, warum das kein
   zusätzlicher Weg ist: Meistens steht die Antwort schon da.

   Ein einziger Suchtreffer klappt sich von selbst auf. Das ist keine
   Schwelle, sondern eine Regel: Bei genau einem Treffer gibt es nichts zu
   wählen — und genau dort landet, wer aus der Suche unter „Nachschlagen"
   mit `?q=` herkommt. */
export function GlossaryPage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  /* ?q=… kommt aus der Suche im Bereich „Nachschlagen": Wer dort einen
     Begriff antippt, soll ihn hier bereits eingesetzt vorfinden – das ist der
     zweite der zwei Schritte bis zum Ziel. Nur der Startwert wird übernommen;
     danach gehört das Feld dem Nutzer, deshalb kein useEffect, der ihn
     zurückschreibt. */
  const [params] = useSearchParams();
  const [query, setQuery] = useState(() => (params.get('q') ?? '').slice(0, 60));
  const [category, setCategory] = useState<GlossaryCategory | 'Alle'>('Alle');
  const [offen, setOffen] = useState<ReadonlySet<string>>(() => new Set());

  const umschalten = (term: string) => setOffen((alt2) => {
    const neu2 = new Set(alt2);
    if (!neu2.delete(term)) neu2.add(term);
    return neu2;
  });

  const glossary = content.glossary;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter((e) => {
      if (category !== 'Alle' && e.category !== category) return false;
      if (!q) return true;
      return e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q);
    });
  }, [glossary, query, category]);

  /* Nach Anfangsbuchstaben gruppiert — das ist es, was ein Wörterbuch von
     einer Liste unterscheidet. Was nicht mit einem Buchstaben anfängt (etwa
     „3-Bet"), kommt unter „#". */
  const gruppen = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const e of filtered) {
      const erster = e.term[0]?.toUpperCase() ?? '#';
      const schluessel = /[A-ZÄÖÜ]/.test(erster) ? erster : '#';
      const liste = map.get(schluessel) ?? [];
      liste.push(e);
      map.set(schluessel, liste);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'de'));
  }, [filtered]);

  /* Genau ein Treffer: Es gibt nichts zu wählen. */
  const einzigerTreffer = query.trim().length > 0 && filtered.length === 1;

  return (
    <div>
      <BackLink to="/nachschlagen" label={NAV[lang].navLookup} />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub(glossary.length)}</p>
      </div>

      <input
        className="search-input"
        style={{ maxWidth: 480, marginBottom: 14 }}
        placeholder={L.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="row wrap" style={{ marginBottom: 18 }}>
        {CATEGORIES.map((c) => (
          <button key={c} className={`btn sm${category === c ? ' primary' : ''}`} onClick={() => setCategory(c)}>
            {L.categoryLabels[c]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="muted">{L.noResults}</p>}

      <div className="glossar">
        {gruppen.map(([buchstabe, eintraege]) => (
          <section key={buchstabe} className="glossar-gruppe">
            <h2 className="glossar-buchstabe" aria-label={L.buchstabe(buchstabe)}>
              {buchstabe}
            </h2>
            {eintraege.map((e) => {
              const auf = einzigerTreffer || offen.has(e.term);
              return (
                <button
                  key={e.term}
                  type="button"
                  className={`glossar-eintrag${auf ? ' auf' : ''}`}
                  aria-expanded={auf}
                  onClick={() => umschalten(e.term)}
                >
                  <span className="glossar-kopf">
                    <span className="glossar-begriff">{e.term}</span>
                    <span className="glossar-marke">{L.categoryLabels[e.category]}</span>
                  </span>
                  {/* Immer im Baum, zugeklappt auf eine Zeile beschnitten:
                      Meistens steht die Antwort damit schon da, und für ein
                      Vorlesegerät fehlt nichts. */}
                  <span className="glossar-def">{e.definition}</span>
                  {auf && e.related && e.related.length > 0 && (
                    <span className="glossar-verwandt">
                      {L.seeAlso} {e.related.join(' · ')}
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
