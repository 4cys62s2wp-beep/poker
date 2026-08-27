/* Der Farbmodus als Zustand der App.
   ================================

   Wenig Zustand, weil wenig nötig ist: die Wahl selbst, und der Satz, der
   daraus gerade folgt. Alles andere — Anwenden, Speichern, Auflösen der
   Systemvorgabe — steht in `modus.ts` und ist ohne React prüfbar.

   Warum überhaupt ein Zustand, wo doch ein Attribut am Dokument reicht: Die
   Bedienung muss zeigen, was gewählt ist, und sie muss sich neu zeichnen,
   wenn sich die Systemvorgabe unter ihr ändert. */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import {
  horcheAufSystem, leseModus, speichereModus, tokensatzFuer, wendeAn,
  type Modus, type Tokensatz,
} from './modus';

interface Farbmodus {
  /** Was gewählt ist — einschließlich „Systemvorgabe". */
  modus: Modus;
  /** Was daraus gerade folgt. */
  satz: Tokensatz;
  setzeModus: (m: Modus) => void;
}

const Ctx = createContext<Farbmodus | null>(null);

export function FarbmodusProvider({ children }: { children: ReactNode }) {
  /* Der Anfangswert kommt aus dem Speicher, nicht aus einer Vorgabe: Das
     Skript in index.html hat ihn schon angewandt, und ein abweichender
     Startwert hier wäre genau das Aufblitzen, das dieses Skript verhindert. */
  const [modus, setModus] = useState<Modus>(() => leseModus());
  const [satz, setSatz] = useState<Tokensatz>(() => tokensatzFuer(leseModus()));

  /* Einmal nach dem Laden anwenden. Das Skript in index.html hat dasselbe
     getan — hier steht es für den Fall, dass es nicht lief (alte Datei im
     Zwischenspeicher, abgeschaltetes Skript). */
  useEffect(() => { setSatz(wendeAn(modus)); }, [modus]);

  /* Zieht die Systemvorgabe um, zieht die App mit — aber nur, wenn niemand
     ausdrücklich gewählt hat. */
  useEffect(() => horcheAufSystem(modus, setSatz), [modus]);

  const setzeModus = useCallback((m: Modus) => {
    setModus(m);
    setSatz(speichereModus(m));
  }, []);

  const wert = useMemo(() => ({ modus, satz, setzeModus }), [modus, satz, setzeModus]);
  return <Ctx.Provider value={wert}>{children}</Ctx.Provider>;
}

export function useFarbmodus(): Farbmodus {
  const wert = useContext(Ctx);
  if (!wert) throw new Error('useFarbmodus braucht den FarbmodusProvider');
  return wert;
}
