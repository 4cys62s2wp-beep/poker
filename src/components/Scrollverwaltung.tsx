/* Setzt die Scrollposition bei jedem Seitenwechsel — siehe src/lib/scroll.ts. */

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { entscheideScroll, gemerktePosition, merkePosition } from '../lib/scroll';

/** Wie lange (in Bildern) auf eine nachgeladene Seite gewartet wird. */
const GEDULD = 45;

export function Scrollverwaltung() {
  const ort = useLocation();
  const art = useNavigationType();
  const letzteY = useRef(0);
  const vorherPfad = useRef<string | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const merke = () => { letzteY.current = window.scrollY; };
    window.addEventListener('scroll', merke, { passive: true });
    return () => window.removeEventListener('scroll', merke);
  }, []);

  useLayoutEffect(() => {
    /* `default` ist der Schlüssel jedes Eintrags, den der Router nicht selbst
       angelegt hat (Adresse von Hand geändert, Link von außen): Mit dem Pfad
       zusammen bleibt er je Seite eindeutig. */
    const key = `${ort.key}:${ort.pathname}`;
    const e = entscheideScroll({
      art,
      pfadGeaendert: vorherPfad.current === null ? null : vorherPfad.current !== ort.pathname,
      gespeichert: gemerktePosition(key),
    });
    vorherPfad.current = ort.pathname;
    let abgebrochen = false;
    let rahmen = 0;

    if (e.aktion === 'oben') {
      window.scrollTo(0, 0);
      letzteY.current = 0;
    } else if (e.aktion === 'wiederherstellen') {
      /* Die Seite ist vielleicht noch nicht da: Eine nachgeladene Lektion ist
         beim ersten Bild ein paar hundert Pixel hoch. Also so lange versuchen,
         bis sie hoch genug ist — oder die Geduld aufgebraucht ist. */
      let n = 0;
      const versuche = () => {
        if (abgebrochen) return;
        const hoeheGenug = document.documentElement.scrollHeight - window.innerHeight >= e.y;
        window.scrollTo(0, e.y);
        n += 1;
        if (!hoeheGenug && n < GEDULD) rahmen = requestAnimationFrame(versuche);
        else letzteY.current = window.scrollY;
      };
      versuche();
    }

    if (e.fokus) {
      /* Nach dem Zeichnen, weil die Seite lazy geladen sein kann. */
      let versuche = 0;
      const fokussiere = () => {
        if (abgebrochen) return;
        const h1 = document.querySelector<HTMLElement>('main h1');
        if (h1) {
          h1.tabIndex = -1;
          h1.focus({ preventScroll: true });
        } else if ((versuche += 1) < GEDULD) {
          rahmen = requestAnimationFrame(fokussiere);
        }
      };
      rahmen = requestAnimationFrame(fokussiere);
    }

    return () => {
      abgebrochen = true;
      if (rahmen) cancelAnimationFrame(rahmen);
      merkePosition(key, letzteY.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ort.key, ort.pathname]);

  return null;
}
