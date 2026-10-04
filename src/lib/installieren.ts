/* Installieren: im passenden Moment, mit einem echten Knopf.
   ==========================================================

   Vorher stand im Profil ein Fließtext („PokerMentor ist eine PWA: Öffne die
   Website auf dem Handy und wähle im Browser-Menü …") — und kein einziger
   `beforeinstallprompt` im Code, obwohl Chromium einen richtigen Knopf anbietet.
   Wer die App zum Pokerabend dabeihaben will — Vollbild, Bildschirm bleibt an —,
   muss sie installiert haben, und das sollte dort angeboten werden, wo man es
   braucht: beim Einrichten eines Abends. Dazu eine kurze Profilkarte.

   Nicht gebaut, mit Absicht: Aufforderungen nach dem dritten Besuch oder nach der
   ersten Lektion. Eine App, die beim Lernen um Installation bittet, bittet zur
   falschen Zeit. */

import { useEffect, useState } from 'react';

/** Was die Seite dem Nutzer anbieten kann. */
export type Installation =
  /** Läuft schon als installierte App: nichts anbieten. */
  | 'installiert'
  /** Der Browser hat einen Installationsdialog angeboten: ein Knopf. */
  | 'knopf'
  /** iPhone/iPad: Es gibt keinen Dialog, nur „Zum Home-Bildschirm“ im Teilen-Menü. */
  | 'anleitung'
  /** Weder noch (Desktop-Firefox, Safari am Mac): nichts anbieten. */
  | 'keine';

export function installationsart(p: { standalone: boolean; hatDialog: boolean; ios: boolean }): Installation {
  if (p.standalone) return 'installiert';
  if (p.hatDialog) return 'knopf';
  if (p.ios) return 'anleitung';
  return 'keine';
}

interface Installationsdialog extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let dialog: Installationsdialog | null = null;
const hoerer = new Set<() => void>();

if (typeof window !== 'undefined') {
  /* Der Browser meldet es **einmal**, früh — wer erst später zuhört, verpasst es. */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    dialog = e as Installationsdialog;
    hoerer.forEach((h) => h());
  });
  window.addEventListener('appinstalled', () => {
    dialog = null;
    hoerer.forEach((h) => h());
  });
}

function laeuftInstalliert(): boolean {
  try {
    return window.matchMedia('(display-mode: standalone)').matches
      || (navigator as { standalone?: boolean }).standalone === true;
  } catch {
    return false;
  }
}

function istIos(): boolean {
  const ua = navigator.userAgent;
  /* iPadOS meldet sich als Mac, hat aber einen Touchbildschirm. */
  return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function useInstallieren(): { art: Installation; installiere: () => Promise<void> } {
  const [, neu] = useState(0);
  useEffect(() => {
    const h = () => neu((n) => n + 1);
    hoerer.add(h);
    return () => { hoerer.delete(h); };
  }, []);
  const art = installationsart({ standalone: laeuftInstalliert(), hatDialog: dialog !== null, ios: istIos() });
  return {
    art,
    installiere: async () => {
      if (!dialog) return;
      await dialog.prompt();
      await dialog.userChoice.catch(() => null);
      dialog = null;
      hoerer.forEach((h) => h());
    },
  };
}
