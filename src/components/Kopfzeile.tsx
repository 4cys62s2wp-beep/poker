/* Die Kopfzeile am Handy: klebt oben, nennt den Ort, führt zurück.
   ==============================================================

   Vorher war sie ein Block am Anfang der Seite. Wer in einer Lektion (5600 px),
   im Glossar (11 400 px) oder in den Tells (6700 px) nach unten gescrollt war,
   hatte weder Rückweg noch Titel noch Stand — nur den Daumen, der 20 Wischer
   zurück musste. Eine untere Tab-Leiste schließen E-032 und DESIGN §10 aus;
   den Hauptnutzen, den Rückweg aus der Tiefe, liefert diese Zeile ohne den
   Bruch.

   Was sie zeigt:
   - ganz oben: Marke und „Du", wie bisher;
   - nach dem Scrollen: in der Mitte „‹ Zurückziel · Titel" — Beschriftung und
     Ziel des Rückwegs und die Überschrift der Seite, **aus dem Bild gelesen**,
     nicht ein zweites Mal gepflegt: Der `<Zurueck>`-Link der Seite trägt sein
     Ziel in `data-ziel`, die h1 ist die h1. Die Zeile kann deshalb nie etwas
     anderes sagen als die Seite darunter;
   - in Lektionen eine 2-px-Leiste: wie weit man ist.

   Sie bleibt an Ort und Stelle (kein Ein- und Ausblenden beim Scrollen): Eine
   Leiste, die auftaucht, wenn man hoch wischt, taucht auf, wo der Daumen
   gerade etwas anderes tun wollte. */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Marke } from './Marke';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/layout';
import { STR as SUCHE } from '../i18n/pages/suche';
import { useAppState } from '../state/AppState';

/** Ab dieser Scrolltiefe (px) zeigt die Zeile den Ort. */
const AB = 24;

interface Ort {
  titel: string;
  rueckLabel: string | null;
  rueckZiel: string | null;
}

function lies(haupt: HTMLElement | null): Ort {
  const h1 = haupt?.querySelector('h1')?.textContent?.trim() ?? '';
  const zurueck = haupt?.querySelector<HTMLElement>('.zurueck');
  return {
    titel: h1,
    rueckLabel: zurueck?.textContent?.replace('←', '').trim() || null,
    rueckZiel: zurueck?.getAttribute('data-ziel') ?? null,
  };
}

export function Kopfzeile({ mainRef, onSuche }: { mainRef: RefObject<HTMLElement>; onSuche: () => void }) {
  const { lang } = useLang();
  const L = STR[lang];
  const { data } = useAppState();
  /* Der Name, den jemand eingegeben hat, statt „Du": Die Stelle ist die Antwort
     auf „Wer bin ich in dieser App?" und soll sie geben. Ohne Namen bleibt es
     bei „Du". */
  const eigenerName = data.name.trim();
  const ort = useLocation();
  const navigate = useNavigate();
  const [gescrollt, setGescrollt] = useState(false);
  const [stand, setStand] = useState<Ort>({ titel: '', rueckLabel: null, rueckZiel: null });
  const balken = useRef<HTMLDivElement>(null);

  /* Lektionen sind lang genug, dass man den Stand sehen will. */
  const seg = ort.pathname.split('/').filter(Boolean);
  const istLektion = seg[0] === 'lernen' && seg.length === 3;

  useEffect(() => {
    let rahmen = 0;
    const lesen = () => {
      rahmen = 0;
      setGescrollt(window.scrollY > AB);
      const el = balken.current;
      if (el) {
        const strecke = document.documentElement.scrollHeight - window.innerHeight;
        el.style.setProperty('--lese', strecke > 0 ? String(Math.min(1, Math.max(0, window.scrollY / strecke))) : '0');
      }
    };
    const beiScroll = () => { if (!rahmen) rahmen = requestAnimationFrame(lesen); };
    lesen();
    window.addEventListener('scroll', beiScroll, { passive: true });
    window.addEventListener('resize', beiScroll);
    return () => {
      window.removeEventListener('scroll', beiScroll);
      window.removeEventListener('resize', beiScroll);
      if (rahmen) cancelAnimationFrame(rahmen);
    };
  }, [ort.pathname]);

  /* Titel und Rückweg stehen erst im Bild, wenn die (lazy geladene) Seite da
     ist: beobachten statt raten. */
  useEffect(() => {
    const haupt = mainRef.current;
    if (!haupt) return undefined;
    const lesen = () => setStand((alt) => {
      const neu = lies(haupt);
      return alt.titel === neu.titel && alt.rueckLabel === neu.rueckLabel && alt.rueckZiel === neu.rueckZiel ? alt : neu;
    });
    lesen();
    if (typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver(lesen);
    mo.observe(haupt, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [mainRef, ort.pathname]);

  const zeigeOrt = gescrollt && stand.titel !== '';

  return (
    <div className={`mobile-top${gescrollt ? ' gescrollt' : ''}${zeigeOrt ? ' mit-ort' : ''}`}>
      {/* Seit die untere Leiste weg ist (E-032), ist die Marke der Weg
          zurück zur Startseite. Sie steht auf jedem Bildschirm an
          derselben Stelle — genau das, was eine Marke oben links seit
          jeher bedeutet, und was ein Nutzer dort ohnehin antippt. */}
      <Link to="/" className="mobile-top-marke" aria-label={L.start}>
        <Marke groesse={30} />
        <span className="grad">PokerMentor</span>
      </Link>

      {zeigeOrt && (
        <button
          type="button"
          className="mobile-top-ort"
          onClick={() => { if (stand.rueckZiel) navigate(stand.rueckZiel); else window.scrollTo({ top: 0 }); }}
          aria-label={stand.rueckLabel ? `${L.back}: ${stand.rueckLabel}` : stand.titel}
        >
          {stand.rueckLabel && (
            <>
              <span className="pfeil" aria-hidden="true">‹</span>
              <span className="rueckname">{stand.rueckLabel}</span>
              <span className="trenner" aria-hidden="true">·</span>
            </>
          )}
          <span className="seitentitel">{stand.titel}</span>
        </button>
      )}

      {/* Die Lupe: die Suche von überall (E-096). */}
      <button type="button" className="mobile-top-suche" onClick={onSuche} aria-label={SUCHE[lang].oeffnen}>
        <Icon name="search" size={20} />
      </button>

      {/* Der Weg zum Profil auf dem Handy. Er stand vorher in der unteren
          Leiste; dort ist mit drei Bereichen kein Platz mehr für einen
          fünften beschrifteten Punkt. Hier ist er sichtbar, beschriftet
          und auf jedem Bildschirm erreichbar. */}
      <Link
        to="/profil"
        className={`mobile-top-you${ort.pathname === '/profil' ? ' active' : ''}`}
        aria-current={ort.pathname === '/profil' ? 'page' : undefined}
      >
        <Icon name="profile" size={16} />
        {eigenerName ? (
          <>
            <span className="sr-only">{L.profile}: </span>
            <span className="name">{eigenerName}</span>
          </>
        ) : (
          <span>{L.mobileYou}</span>
        )}
      </Link>

      {istLektion && <div className="lesefortschritt" ref={balken} aria-hidden="true" />}
    </div>
  );
}
