/* Ein einzelner Abend — und der Abschluss eines Abends.
   =====================================================

   Wer einen Abend beendet, landet hier (`?neu=1`): oben die Endstände mit einer
   Prüfzeile, darunter das berechnete Ergebnis und wer wem wie viel überweist,
   unten Teilen und Kopieren. Ohne Assistenten mit Schritten — „Ein Bildschirm,
   kein Assistent" (E-094).

   Dieselbe Seite ist später der gespeicherte Abend: Die Namen sind Knöpfe, von
   hier kommt man zu den anderen Abenden derselben Person. Endstände und
   Rebuys lassen sich korrigieren (die Plätze werden neu gerechnet), ein Abend
   lässt sich löschen — mit Rückgängig, bei einer Probe unter zehn Minuten mit
   der Frage „Als Probe verwerfen?".

   Die Rechnung steht in `lib/session/abrechnung.ts`. Hier wird nur angezeigt.
   Die App bewegt kein Geld; sie rechnet auf, was die Runde ohnehin
   untereinander ausmacht (E-010, E-030). */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/abende';
import { zahlAusEingabe } from '../../lib/eingabe/zahl';
import {
  ergaenze, istProbe, korrigiere, ladeAbende, loescheAbend, speichereAbende, type Abend,
} from '../../lib/session/abende';
import { abrechne } from '../../lib/session/abrechnung';
import { grobeDauer } from '../../lib/session/dauer';
import { vorbelegungAusAbend } from '../../lib/bankroll';

export function AbendPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const { id } = useParams();
  const [params] = useSearchParams();
  const neu = params.get('neu') === '1';
  const navigate = useNavigate();
  const [abend, setAbend] = useState<Abend | undefined>(() => ladeAbende().find((a) => a.id === id));
  const [bearbeite, setBearbeite] = useState(false);
  const [entwurf, setEntwurf] = useState<Record<string, { stand: string; eingezahlt: string }>>({});
  const [euro, setEuro] = useState('');
  const [kurs, setKurs] = useState('');
  const [kopiert, setKopiert] = useState(false);
  const [frageLoeschen, setFrageLoeschen] = useState(false);
  const [ichBin, setIchBin] = useState('');
  /* Nach dem Löschen acht Sekunden lang ein Weg zurück — dann zur Liste. */
  const [geloescht, setGeloescht] = useState<Abend | null>(null);
  const loeschtimer = useRef<number | null>(null);
  useEffect(() => () => { if (loeschtimer.current) window.clearTimeout(loeschtimer.current); }, []);

  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const zahl = (n: number) => n.toLocaleString(nf);
  const betrag = (n: number) => n.toLocaleString(nf, { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
  const vorzeichen = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${betrag(Math.abs(n))} €`;

  const abrechnung = useMemo(() => (abend ? abrechne(abend) : null), [abend]);

  if (geloescht) {
    return (
      <div className="page">
        <PageHeader title={L.geloescht} backTo="/session/abende" />
        <div className="rueckgaengig-zeile" role="status">
          <span>{L.geloescht}</span>
          <button
            type="button"
            className="btn sm"
            onClick={() => {
              if (loeschtimer.current) window.clearTimeout(loeschtimer.current);
              speichereAbende(ergaenze(ladeAbende(), geloescht));
              setAbend(geloescht);
              setGeloescht(null);
            }}
          >
            {L.rueckgaengig}
          </button>
        </div>
      </div>
    );
  }

  if (!abend) {
    return (
      <div className="page">
        <PageHeader title={L.unbekannterAbend} backTo="/session/abende" />
      </div>
    );
  }

  const datum = new Date(abend.begonnen).toLocaleDateString(nf, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const kurzDatum = new Date(abend.begonnen).toLocaleDateString(nf, {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const letzte = abend.stufen[Math.max(0, abend.erreichte_stufe - 1)];
  const cash = abend.modus === 'cash';
  const gezaehlt = abend.spieler.reduce((n, s) => n + (s.stand ?? 0), 0);
  const eingekauft = abend.spieler.reduce((n, s) => n + s.eingekauft, 0);

  /** Der Abend als Text, zum Teilen und Kopieren. */
  function alsText(): string {
    const zeilen = [L.teilenKopf(kurzDatum)];
    if (abrechnung) {
      for (const z of [...abrechnung.zeilen].sort((a, b) => a.platz - b.platz)) {
        zeilen.push(`${L.platz(z.platz)} ${z.name} ${vorzeichen(z.netto)}`);
      }
      if (abrechnung.zahlungen.length > 0) {
        zeilen.push('');
        for (const p of abrechnung.zahlungen) zeilen.push(L.zahlt(p.von, p.an, betrag(p.betrag)));
      }
    } else {
      for (const s of abend!.spieler) {
        zeilen.push(`${L.platz(s.platz)} ${s.name} ${s.stand === null ? L.ausgeschieden : `${zahl(s.stand)} ${L.chips}`}`);
      }
    }
    return zeilen.join('\n');
  }

  async function teile() {
    const text = alsText();
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* Abgebrochen oder verweigert: dann eben die Zwischenablage. */
    }
    await kopiere(text);
  }

  async function kopiere(text = alsText()) {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      window.setTimeout(() => setKopiert(false), 2500);
    } catch {
      /* Ohne Zwischenablage bleibt der Text im Abend sichtbar. */
    }
  }

  function startBearbeiten() {
    setEntwurf(Object.fromEntries(abend!.spieler.map((s) => [s.name, {
      stand: s.stand === null ? '' : String(s.stand),
      eingezahlt: String(s.eingekauft),
    }])));
    setEuro(abend!.euroJeSpieler ? String(abend!.euroJeSpieler).replace('.', lang === 'de' ? ',' : '.') : '');
    setKurs(abend!.punkteJeEuro ? String(abend!.punkteJeEuro) : '');
    setBearbeite(true);
  }

  function speichere() {
    const aenderungen = Object.fromEntries(Object.entries(entwurf).map(([name, e]) => [name, {
      stand: e.stand.trim() === '' ? null : Number(e.stand.replace(/\D/g, '')),
      eingekauft: Number(e.eingezahlt.replace(/\D/g, '')) || 0,
    }]));
    let neuer = korrigiere(abend!, aenderungen);
    const e = zahlAusEingabe(euro, lang);
    const k = zahlAusEingabe(kurs, lang);
    neuer = {
      ...neuer,
      ...(e && e > 0 ? { euroJeSpieler: e } : {}),
      ...(k && k > 0 ? { punkteJeEuro: k } : {}),
    };
    speichereAbende(ergaenze(ladeAbende(), neuer));
    setAbend(neuer);
    setBearbeite(false);
  }

  function loesche() {
    const a = abend!;
    speichereAbende(loescheAbend(ladeAbende(), a.id));
    setGeloescht(a);
    setFrageLoeschen(false);
    loeschtimer.current = window.setTimeout(() => navigate('/session/abende'), 8000);
  }

  return (
    <div className="page">
      <PageHeader
        title={neu ? L.neuTitel : datum}
        sub={neu ? `${datum} — ${L.neuSub}` : undefined}
        backTo="/session/abende"
      />

      <div className="abend-kopfzahlen">
        <div><span className="hinweis">{L.dauer}</span><span>{grobeDauer(abend.gespielt_ms, lang)}</span></div>
        {!cash && <div><span className="hinweis">{L.stufe}</span><span>{letzte[0]} / {letzte[1]}</span></div>}
        <div><span className="hinweis">{L.startchips}</span><span>{zahl(abend.startchips)}</span></div>
      </div>

      {/* ── Endstände ───────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.staendeTitel}</h2>
      {bearbeite ? (
        <div className="abend-bearbeiten">
          {abend.spieler.map((s) => (
            <div key={s.name} className="abend-bearbeiten-zeile">
              <strong>{s.name}</strong>
              <label>
                <span className="hinweis">{L.standFeld}</span>
                <input
                  inputMode="numeric"
                  value={entwurf[s.name]?.stand ?? ''}
                  onChange={(e) => setEntwurf({ ...entwurf, [s.name]: { ...entwurf[s.name], stand: e.target.value } })}
                />
              </label>
              <label>
                <span className="hinweis">{L.eingezahltFeld}</span>
                <input
                  inputMode="numeric"
                  value={entwurf[s.name]?.eingezahlt ?? ''}
                  onChange={(e) => setEntwurf({ ...entwurf, [s.name]: { ...entwurf[s.name], eingezahlt: e.target.value } })}
                />
              </label>
            </div>
          ))}
          <div className="abend-bearbeiten-zeile">
            <strong>{L.einsatzNachtragen}</strong>
            <label>
              <span className="hinweis">{L.euroJePerson}</span>
              <input inputMode="decimal" value={euro} onChange={(e) => setEuro(e.target.value)} />
            </label>
            {cash && (
              <label>
                <span className="hinweis">{L.chipsJeEuro}</span>
                <input inputMode="decimal" value={kurs} onChange={(e) => setKurs(e.target.value)} />
              </label>
            )}
          </div>
          <div className="row wrap">
            <button type="button" className="btn primary" onClick={speichere}>{L.speichern}</button>
            <button type="button" className="btn" onClick={() => setBearbeite(false)}>{L.abbrechen}</button>
          </div>
        </div>
      ) : (
        <div className="abend-tabelle">
          {abend.spieler.map((s) => {
            const z = abrechnung?.zeilen.find((x) => x.name === s.name);
            return (
              <div key={s.name} className={`abend-zeile${s.stand === null ? ' raus' : ''}`}>
                <span className="abend-platz">{L.platz(s.platz)}</span>
                <Link to={`/session/spieler/${encodeURIComponent(s.name)}`} className="abende-name">
                  {s.name}
                </Link>
                <span className="abend-stand">
                  {s.stand === null ? L.keineChips : `${zahl(s.stand)} ${L.chips}`}
                </span>
                {z && (
                  <span className={`abend-netto${z.netto > 0 ? ' plus' : z.netto < 0 ? ' minus' : ''}`}>
                    {vorzeichen(z.netto)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Die Prüfzeile: Stimmt, was gezählt wurde, mit dem, was gekauft wurde? */}
      <p className={`hinweis abend-pruefung${gezaehlt === eingekauft ? '' : ' warn'}`} role="status">
        {gezaehlt === eingekauft
          ? L.pruefungOk(zahl(gezaehlt))
          : L.pruefungAbweichung(zahl(gezaehlt), zahl(eingekauft))}
      </p>

      {/* ── Abrechnung ──────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.abrechnungTitel}</h2>
      {abrechnung ? (
        <div className="abend-abrechnung">
          <p className="hinweis">{L.topf(betrag(abrechnung.topf))}</p>
          {abrechnung.pruefung.abweichung !== 0 ? (
            <p className="abend-pruefung warn">{L.erstKorrigieren}</p>
          ) : abrechnung.zahlungen.length === 0 ? (
            <p>{L.ausgeglichen}</p>
          ) : (
            <ul className="list-plain abend-zahlungen">
              {abrechnung.zahlungen.map((p) => (
                <li key={`${p.von}-${p.an}`}>{L.zahlt(p.von, p.an, betrag(p.betrag))}</li>
              ))}
            </ul>
          )}
          {/* Für die eigene Bankroll: dieselben Zahlen, die der Abend schon
              kennt — zum Prüfen in das Formular gelegt, nicht still gebucht. */}
          {abrechnung.pruefung.abweichung === 0 && (
            <div className="abend-bankroll">
              <label htmlFor="abend-ich" className="small muted">{L.bankrollWer}</label>
              <div className="row wrap">
                <select
                  id="abend-ich"
                  className="text-input"
                  value={ichBin}
                  onChange={(e) => setIchBin(e.target.value)}
                >
                  <option value="">{L.bankrollWaehlen}</option>
                  {abend.spieler.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
                <button
                  type="button"
                  className="btn"
                  disabled={!ichBin}
                  onClick={() => {
                    const v = vorbelegungAusAbend(abend, ichBin);
                    if (v) navigate('/session/bankroll', { state: { vorbelegung: v } });
                  }}
                >
                  {L.bankrollKnopf}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="hinweis">{L.ohneEuro}</p>
      )}

      {/* ── Unten, was man mit dem Abend tut ─────────────────────────────── */}
      <div className="row wrap abend-aktionen">
        <button type="button" className="btn primary" onClick={() => void teile()}>{L.teilen}</button>
        <button type="button" className="btn" onClick={() => void kopiere()}>{kopiert ? L.kopiert : L.kopieren}</button>
        {!bearbeite && <button type="button" className="btn" onClick={startBearbeiten}>{L.bearbeiten}</button>}
        <button type="button" className="btn ghost" onClick={() => setFrageLoeschen(true)}>{L.loeschen}</button>
      </div>

      {frageLoeschen && (
        <div className="rueckgaengig-zeile" role="alertdialog" aria-label={istProbe(abend.gespielt_ms) ? L.probeFrage : L.loeschen}>
          <div>
            <strong>{istProbe(abend.gespielt_ms) ? L.probeFrage : L.loeschen}</strong>
            {istProbe(abend.gespielt_ms) && <p className="hinweis">{L.probeSub}</p>}
          </div>
          <div className="row">
            <button type="button" className="btn sm danger" onClick={loesche}>
              {istProbe(abend.gespielt_ms) ? L.probeJa : L.loeschen}
            </button>
            <button type="button" className="btn sm" onClick={() => setFrageLoeschen(false)}>{L.nein}</button>
          </div>
        </div>
      )}
    </div>
  );
}
