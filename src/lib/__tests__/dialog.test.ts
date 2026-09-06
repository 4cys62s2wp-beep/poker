/* Jeder modale Dialog ist mit der Tastatur zu bedienen.
   ====================================================

   Vier Dialoge hat diese App, und bis E-058 konnten sie drei verschiedene
   Dinge. Am schlechtesten waren die beiden am Live-Tisch — gemessen mit
   wirklich gedrückter Tastatur:

   | | vorher | nachher |
   |---|---|---|
   | Fokus nach dem Öffnen im Dialog | **nein** | ja |
   | Escape schließt | **nein** | ja |
   | Tab-Schritte außerhalb (von 8) | **4** | 0 |

   „Außerhalb" hieß dort: auf den Knöpfen „Weiter", „Stände" und „Beenden",
   die der Dialog verdeckt. Wer am Pokerabend mit einer Tastatur bedient,
   drückte Knöpfe, die er nicht sehen konnte.

   Dieser Test prüft nicht das Verhalten — das misst der Browser. Er prüft
   das, was ein Browserlauf nicht sieht: **dass es nur eine Umsetzung gibt.**
   Drei Abschriften waren der Grund, warum drei verschiedene Stände
   nebeneinander bestanden. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (p.endsWith('.tsx')) aus.push(p);
  }
  return aus;
}

const QUELLEN = [...dateien('src/pages'), ...dateien('src/components')]
  .map((datei) => [datei, readFileSync(datei, 'utf8')] as const);

const MIT_DIALOG = QUELLEN.filter(([, text]) => text.includes('role="dialog"'));

describe('Modale Dialoge', () => {
  it('findet überhaupt welche — sonst prüft dieser Test nichts', () => {
    expect(MIT_DIALOG.length).toBeGreaterThanOrEqual(4);
  });

  it('benutzt überall denselben Tastaturweg', () => {
    const ohne = MIT_DIALOG
      .filter(([, text]) => !text.includes('useDialogTastatur'))
      .map(([datei]) => datei);
    expect(ohne, 'Ein Dialog ohne `useDialogTastatur` hat weder Startfokus '
      + 'noch Escape noch Fokusfalle — außer, es steht daneben, warum.').toEqual([]);
  });

  it('schreibt den Fokusselektor nur einmal auf', () => {
    /* Zwei Abschriften laufen auseinander: Die eine kennt `[tabindex]`, die
       andere nicht, und dann hält der eine Dialog den Fokus fest und der
       andere lässt ihn laufen. */
    const doppelt = QUELLEN
      .filter(([, text]) => text.includes('button:not([disabled])'))
      .map(([datei]) => datei);
    expect(doppelt).toEqual([]);
  });

  it('hört auf die Taste am Dokument, nicht am Dialog', () => {
    /* `onKeyDown` am Dialog greift nur, wenn der Fokus schon drin ist. Genau
       das war am Live-Tisch nicht der Fall — der Fokus stand hinter dem
       Dialog, also kam dort nie eine Taste an. */
    const hook = readFileSync('src/lib/dialog/tastatur.ts', 'utf8');
    expect(hook).toContain("document.addEventListener('keydown'");
    expect(hook).toContain("document.removeEventListener('keydown'");
  });

  it('gibt den Fokus beim Schließen zurück', () => {
    const hook = readFileSync('src/lib/dialog/tastatur.ts', 'utf8');
    expect(hook).toMatch(/vorher.*focus\(\)/s);
  });

  it('nennt die eine Ausnahme, die kein Escape hat', () => {
    /* Beim ersten Start muss eine Sprache gewählt werden. Wer diese Ausnahme
       ausweitet, soll es begründen müssen. */
    const ohneEscape = MIT_DIALOG
      .filter(([, text]) => /useDialogTastatur\([^)]*\)/.test(text)
        && !/useDialogTastatur\([^)]*schliessen/s.test(text.match(/useDialogTastatur\([^;]*\);/s)?.[0] ?? ''))
      .map(([datei]) => datei);
    expect(ohneEscape).toEqual(['src/components/Onboarding.tsx']);
  });
});
