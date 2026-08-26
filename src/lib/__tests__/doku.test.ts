/* Die Dokumente, die entscheiden helfen sollen.
   ============================================

   `BACKLOG.md` und `ENTSCHEIDUNGEN.md` sind kein Beiwerk: Sie sind die
   einzige Stelle, an der steht, **warum** etwas so ist und warum etwas
   anderes nicht gebaut wurde. Ein Eintrag, der nur seinen Titel trägt, sieht
   aus wie eine Notiz und ist keine — er verschiebt die Denkarbeit auf den,
   der später entscheidet, und der weiß dann weniger als der Autor damals.

   Deshalb prüft dieser Test die Form: Jeder Backlog-Eintrag beantwortet
   dieselben vier Fragen, jede Entscheidung nennt eine verworfene Alternative
   mit Begründung. Inhalt lässt sich nicht prüfen — Vollständigkeit schon. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const BACKLOG = readFileSync('BACKLOG.md', 'utf8');
const ENTSCHEIDUNGEN = readFileSync('ENTSCHEIDUNGEN.md', 'utf8');

/** Ein Abschnitt je `## `-Überschrift, mit seinem Text. */
function abschnitte(text: string): Array<{ titel: string; inhalt: string }> {
  const teile = text.split(/^## /m).slice(1);
  return teile.map((t) => {
    const zeilenumbruch = t.indexOf('\n');
    return { titel: t.slice(0, zeilenumbruch).trim(), inhalt: t.slice(zeilenumbruch) };
  });
}

const VIER_FRAGEN = [
  '**Worum es geht.**',
  '**Warum es wertvoll wäre.**',
  '**Was daran schwierig ist.**',
  '**Was es voraussetzt.**',
];

describe('BACKLOG.md', () => {
  const eintraege = abschnitte(BACKLOG);

  it('hat überhaupt Einträge', () => {
    expect(eintraege.length).toBeGreaterThanOrEqual(11);
  });

  it.each(abschnitte(BACKLOG).map((e) => [e.titel, e.inhalt]))(
    '„%s" beantwortet alle vier Fragen',
    (titel, inhalt) => {
      const fehlend = VIER_FRAGEN.filter((f) => !inhalt.includes(f));
      expect(fehlend, `„${titel}" lässt offen: ${fehlend.join(', ')}`).toEqual([]);
    },
  );

  it.each(abschnitte(BACKLOG).map((e) => [e.titel, e.inhalt]))(
    '„%s" beschreibt, statt nur zu benennen',
    (titel, inhalt) => {
      /* Vier Überschriften mit je einem Halbsatz sind keine Notiz. Die
         Untergrenze ist bewusst niedrig — sie fängt den leeren Eintrag ab,
         nicht den knappen. */
      expect(inhalt.trim().length, titel).toBeGreaterThan(400);
    },
  );
});

describe('ENTSCHEIDUNGEN.md', () => {
  const eintraege = abschnitte(ENTSCHEIDUNGEN).filter((e) => /^E-\d+/.test(e.titel));

  /** Wie viele Einträge heute eine verworfene Alternative benennen.
   *
   *  Eine Sperrklinke, kein Sollwert: Die frühen Einträge sind vor dieser
   *  Gewohnheit entstanden, und sie im Nachhinein um „Alternativen" zu
   *  ergänzen, hieße sich welche auszudenken. Was zählt, ist, dass die Zahl
   *  nicht wieder fällt. Beim Ergänzen eines Eintrags hochsetzen. */
  const MIT_ALTERNATIVE = 12;

  it('hat fortlaufende Nummern ohne Lücke und ohne Dopplung', () => {
    /* Eine Lücke bedeutet, dass eine Entscheidung gelöscht wurde statt
       widerrufen — und ein Widerruf ist selbst eine Entscheidung. */
    const nummern = eintraege.map((e) => Number(e.titel.match(/^E-(\d+)/)![1]));
    expect(nummern).toEqual([...nummern].sort((a, b) => a - b));
    expect(new Set(nummern).size).toBe(nummern.length);
    for (let i = 1; i < nummern.length; i += 1) {
      expect(nummern[i] - nummern[i - 1], `zwischen E-${nummern[i - 1]} und E-${nummern[i]}`).toBe(1);
    }
  });

  it.each(abschnitte(ENTSCHEIDUNGEN).filter((e) => /^E-\d+/.test(e.titel))
    .map((e) => [e.titel, e.inhalt]))(
    '„%s" begründet, statt nur festzustellen',
    (titel, inhalt) => {
      /* Eine Entscheidung ohne Begründung ist eine Anweisung. Wer sie in
         einem halben Jahr liest, kann dann nur gehorchen oder umwerfen. */
      expect(inhalt.trim().length, titel).toBeGreaterThan(300);
      expect(inhalt, `${titel} hat keinen einzigen benannten Abschnitt`)
        .toMatch(/\*\*[^*]+\*\*/);
    },
  );

  it('benennt in mindestens zwölf Einträgen die verworfene Alternative', () => {
    /* Was jemanden später wirklich weiterbringt, ist nicht die getroffene
       Wahl, sondern die verworfene: Er muss wissen, was schon bedacht war. */
    const mit = eintraege.filter((e) => /\*\*Alternative/.test(e.inhalt));
    expect(mit.length).toBeGreaterThanOrEqual(MIT_ALTERNATIVE);
  });

  it('begründet jede benannte Alternative, statt sie nur aufzuzählen', () => {
    const ohneGrund = eintraege
      .filter((e) => /\*\*Alternative/.test(e.inhalt))
      .filter((e) => !/\*\*Warum (nicht|trotzdem)/.test(e.inhalt))
      .map((e) => e.titel);
    /* Auch hier eine Sperrklinke: Die vier frühesten Einträge nennen ihre
       Alternative im Fließtext. Neue Einträge sollen es nicht. */
    expect(ohneGrund.length, `ohne Begründung: ${ohneGrund.join(', ')}`)
      .toBeLessThanOrEqual(4);
  });
});
