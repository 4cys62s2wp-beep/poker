/* Zahlen im README veralten leise.
   ===============================

   Beim Nachlesen von vorne standen dort zwei Behauptungen, die einmal
   gestimmt hatten: „Neun Läufe" (es waren elf) und „26 Tests" für die
   Firestore-Regeln (es sind 29). Beide sind über Monate gewachsen, und
   niemand hat sie mitgezogen — es gab nichts, was sie geprüft hätte.

   Eine Zahl in der Dokumentation ist eine Behauptung wie jede andere. Wer
   sie nicht nachrechnen lässt, hat sie nicht belegt, sondern nur
   aufgeschrieben. Also rechnet dieser Test sie aus der Quelle nach:
   `package.json` weiß, wie viele Messläufe es gibt, und `rules.test.ts`
   weiß, wie viele Regelprüfungen darin stehen.

   Die Zahlwörter bleiben ausgeschrieben — „Elf Läufe" liest sich besser als
   „11 Läufe". Der Test kennt sie deshalb beide. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const README = readFileSync('README.md', 'utf8');
const STATUS = readFileSync('STATUS.md', 'utf8');
const PROFILTEXTE = readFileSync('src/i18n/pages/profile.ts', 'utf8');
const PAKET = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>;
};
const REGELN = readFileSync('src/lib/__tests__/rules.test.ts', 'utf8');

const ZAHLWORT: Record<number, string> = {
  1: 'Ein', 2: 'Zwei', 3: 'Drei', 4: 'Vier', 5: 'Fünf', 6: 'Sechs', 7: 'Sieben',
  8: 'Acht', 9: 'Neun', 10: 'Zehn', 11: 'Elf', 12: 'Zwölf', 13: 'Dreizehn',
  14: 'Vierzehn', 15: 'Fünfzehn', 16: 'Sechzehn', 17: 'Siebzehn', 18: 'Achtzehn',
  19: 'Neunzehn', 20: 'Zwanzig',
};

/** Die Läufe, die einen Browser starten — nicht die Hilfsskripte. */
function messlaeufe(): string[] {
  return Object.entries(PAKET.scripts)
    .filter(([, befehl]) => befehl.startsWith('node scripts/'))
    .filter(([, befehl]) => !/gen-icons|pokermath-app-daten/.test(befehl))
    .map(([name]) => name);
}

describe('README', () => {
  it('nennt so viele Messläufe, wie es gibt', () => {
    const anzahl = messlaeufe().length;
    const wort = ZAHLWORT[anzahl];
    expect(wort, `${anzahl} Läufe – dafür fehlt das Zahlwort in der Tabelle`).toBeDefined();
    expect(README, `Es gibt ${anzahl} Messläufe; das README muss „${wort} Läufe" sagen.`)
      .toContain(`${wort} Läufe messen die gebaute App`);
  });

  it('führt jeden Messlauf auch einzeln auf', () => {
    // Ein Lauf, der nirgends steht, wird von niemandem ausgeführt.
    const fehlend = messlaeufe().filter((name) => !README.includes(`npm run ${name}`));
    expect(fehlend, 'diese Läufe fehlen im README').toEqual([]);
  });

  it('nennt die richtige Zahl der Regelprüfungen', () => {
    const anzahl = (REGELN.match(/^\s*it\(/gm) ?? []).length;
    expect(anzahl).toBeGreaterThan(0);
    expect(README, `rules.test.ts hat ${anzahl} Prüfungen.`)
      .toContain(`mit ${anzahl} Tests gegen den echten Emulator`);
  });
});

describe('STATUS.md', () => {
  /* Die Übergabedatei sagt von sich, eine frische Sitzung könne **nur** sie
     lesen und wisse Bescheid. Dieser Anspruch steht und fällt damit, dass
     ihre Zahlen stimmen — im Sommer standen dort sechs Messläufe, während es
     elf waren, und ein Rechenlauf im Präsens, den es nicht mehr gab. */
  it('nennt so viele Messläufe, wie es gibt', () => {
    const anzahl = messlaeufe().length;
    expect(STATUS, `Es gibt ${anzahl} Messläufe.`)
      .toContain(`| Messläufe im Browser | ${ZAHLWORT[anzahl].toLowerCase()},`);
  });

  it('nennt die richtige Zahl der Regelprüfungen', () => {
    const anzahl = (REGELN.match(/^\s*it\(/gm) ?? []).length;
    expect(STATUS).toContain(`${anzahl} Regelprüfungen`);
  });

  it('nennt keine Testzahl, die niemand nachrechnet', () => {
    /* Eine Gesamtzahl grüner Tests veraltet mit jedem Commit. Sie gehört in
       die Ausgabe von `npm test`, nicht in ein Dokument. */
    const kopf = STATUS.slice(0, STATUS.indexOf('<!-- NACHTLAUF-ANFANG -->'));
    expect(kopf).not.toMatch(/\d{3,} (JavaScript-)?Tests/);
  });
});

describe('Die Versionsangabe im Profil', () => {
  it('stimmt mit package.json überein, in beiden Sprachen', () => {
    /* Unter dem Profil steht „Version 2.2 · …". Das ist die einzige Stelle,
       an der die App der Nutzerin sagt, welchen Stand sie vor sich hat — und
       sie steht zweimal da, deutsch und englisch. Eine Versionserhöhung, die
       den Text vergisst, macht aus einer Auskunft eine Falschauskunft. */
    const paket = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
    const kurz = paket.version.split('.').slice(0, 2).join('.');
    const treffer = PROFILTEXTE.match(/Version \d+\.\d+/g) ?? [];
    expect(treffer.length, 'die Versionszeile steht deutsch und englisch da').toBe(2);
    for (const t of treffer) expect(t).toBe(`Version ${kurz}`);
  });
});
