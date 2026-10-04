/* Ein vollständiger Durchgang: Koffer → Uhr → Beenden.
   ===================================================

   Die Rechenwege der Live-Session sind einzeln geprüft. Was dabei nicht
   auffällt: ob jemand tatsächlich durchkommt. Ein Eingabefeld, das seinen
   Wert nicht weitergibt; ein Startknopf, der gesperrt bleibt; ein Übergang in
   den Vollbildmodus, der den Zustand verliert — jeder einzelne Rechenweg
   bliebe dabei grün.

   `npm run durchgang` klickt den Weg deshalb in einem echten Browser durch
   und schreibt jeden Schritt mit seinem beobachteten Ergebnis nach
   `docs/durchgang.json`. Dieser Test liest das Protokoll und lässt weder
   einen Fehlschlag noch ein stillschweigendes Weglassen durch. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Schritt {
  name: string;
  ergebnis: Record<string, unknown> | null;
  uebersprungen: boolean;
  fehler?: string;
}

interface Durchgang {
  geprueft_am: string;
  breite: number;
  seitenfehler: string[];
  abgebrochen_bei: string | null;
  schritte: Schritt[];
}

const D: Durchgang = JSON.parse(readFileSync('docs/durchgang.json', 'utf8'));

/** Das Ergebnis eines Schritts, oder ein sprechender Fehlschlag. */
function schritt(name: string): Record<string, unknown> {
  const s = D.schritte.find((x) => x.name === name);
  expect(s, `Schritt „${name}" fehlt im Protokoll — `
    + '`npm run durchgang` nach einer Änderung erneut ausführen.').toBeDefined();
  expect(s!.fehler, `Schritt „${name}" ist fehlgeschlagen`).toBeUndefined();
  expect(s!.uebersprungen, `Schritt „${name}" wurde übersprungen`).toBe(false);
  return s!.ergebnis as Record<string, unknown>;
}

describe('Der Durchgang kommt überhaupt durch', () => {
  it('bricht nirgendwo ab', () => {
    expect(D.abgebrochen_bei).toBeNull();
  });

  it('läuft ohne einen einzigen Fehler im Browser', () => {
    expect(D.seitenfehler).toEqual([]);
  });

  it('geht jeden Schritt wirklich, statt welche zu überspringen', () => {
    expect(D.schritte.length).toBeGreaterThanOrEqual(40);
    for (const s of D.schritte) {
      expect(s.uebersprungen, s.name).toBe(false);
      expect(s.ergebnis, s.name).not.toBeNull();
    }
  });

  it('misst bei der Breite, für die die App gebaut ist', () => {
    expect(D.breite).toBeLessThanOrEqual(430);
  });
});

describe('Einrichten', () => {
  it('gibt den Start erst frei, wenn er etwas zu starten hat', () => {
    /* Ein Knopf, der ins Leere führt, ist schlimmer als ein gesperrter: Er
       verspricht etwas. Vorher steht auf ihm, was fehlt. */
    const vorher = schritt('Einrichten öffnen');
    expect(vorher.startknopf_gesperrt).toBe(true);
    expect(String(vorher.startknopf_text)).toMatch(/eintragen/i);

    const nachher = schritt('Start ist jetzt freigegeben');
    expect(nachher.gesperrt).toBe(false);
  });

  it('zeigt das Ergebnis, bevor irgendetwas beginnt', () => {
    /* Kein Assistent mit Schritten, keine Wartezeit: Der Plan steht da,
       während man noch tippt. */
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    expect(Number(String(e.startchips).replace(/\D/g, ''))).toBeGreaterThan(0);
    expect(e.blindstufen as number).toBeGreaterThanOrEqual(2);
    expect(String(e.erste_stufe)).toMatch(/^\d+ \/ \d+$/);
    expect(String(e.letzte_stufe)).toMatch(/^\d+ \/ \d+$/);
  });

  it('sagt in einem Satz, ob der Abend ein Finale trägt', () => {
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    expect(String(e.finale_satz).length).toBeGreaterThan(20);
    expect(String(e.finale_satz)).toMatch(/Big Blinds|Stunden/);
  });

  it('lässt die Blinds steigen statt springen', () => {
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    const bb = (s: string) => Number(s.split('/')[1].trim());
    const erste = bb(String(e.erste_stufe));
    const letzte = bb(String(e.letzte_stufe));
    const stufen = e.blindstufen as number;
    const faktor = (letzte / erste) ** (1 / (stufen - 1));
    expect(faktor).toBeGreaterThan(1);
    expect(faktor, 'Ein Faktor über 1,6 ist eine Verdopplung in Tarnkleidung')
      .toBeLessThanOrEqual(1.6);
  });
});

describe('Der Übergang an den Tisch', () => {
  it('nimmt alles mit, was eingetragen wurde', () => {
    const e = schritt('Abend starten');
    expect(e.gespeichert_spieler).toBe(5);
    expect(e.gespeichert_startchips as number).toBeGreaterThan(0);
    expect(e.gespeichert_stufen as number).toBeGreaterThanOrEqual(2);
  });

  it('beginnt bereit und stehend — die Uhr läuft erst mit „Uhr starten"', () => {
    /* Sonst läuft die erste Blindstufe, während noch Chips verteilt werden. */
    const e = schritt('Abend starten');
    expect(e.startet_pausiert).toBe(true);
    expect(String(e.marke)).toMatch(/bereit/i);
    const start = schritt('Uhr starten setzt die Uhr in Gang');
    expect(start.laeuft).toBe(true);
    expect(start.marke_weg).toBe(true);
  });

  it('zeigt vor dem Start einen Zeitplan mit Uhrzeiten', () => {
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    expect(e.zeitplan_mit_uhrzeit).toBe(true);
  });

  it('landet im Vollbild ohne Navigationsleiste', () => {
    const e = schritt('Abend starten');
    expect(e.adresse).toBe('#/session/live');
    expect(e.navigationsleiste).toBe(false);
  });

  it('zeigt sofort Zeit, Blinds und die kommende Stufe', () => {
    const e = schritt('Abend starten');
    expect(String(e.zeit)).toMatch(/^\d+:\d{2}$/);
    expect(String(e.blinds)).toMatch(/^\d+ \/ \d+$/);
    expect(String(e.danach)).toMatch(/^\d+ \/ \d+$/);
  });
});

describe('Fortsetzen statt Menü', () => {
  /* Die Regel aus Phase 2 gilt weiter: Läuft eine Runde, steht sie auf der
     Startseite und ist einen Tipp entfernt. Seit E-035 steht sie nicht mehr
     in einer eigenen kleinen Karte oben, sondern in der großen unten — sie
     ist dort größer und im Daumenbereich, und dieselbe Auskunft zweimal auf
     einem Bildschirm ist einmal zu viel. */

  it('steht in der großen Karte und nicht mehr in einer eigenen darüber', () => {
    const e = schritt('Die laufende Runde steht in der großen Karte');
    expect(e.alte_karte_oben).toBe(0);
  });

  it('nennt Startzeit, Spielerzahl und Blindstufe', () => {
    /* Wer die App am Tisch aufmacht, will wissen, ob das noch die Runde von
       vorhin ist. Die Startzeit allein beantwortet das; Spielerzahl und
       Blindstufe machen aus der Karte zugleich die Auskunft, für die man
       sonst hineingehen müsste (E-035). */
    const e = schritt('Die laufende Runde steht in der großen Karte');
    expect(String(e.text)).toMatch(/Läuft seit /);
    expect(e.nennt_spielerzahl).toBe(true);
    expect(e.nennt_blinds).toBe(true);
  });

  it('führt in die Runde und nicht in ihr Menü', () => {
    /* Wer die App öffnet, während der Abend läuft, will die Uhr sehen. Ein
       Zwischenschritt ist an dieser Stelle einer zu viel. */
    const e = schritt('Die laufende Runde steht in der großen Karte');
    expect(e.ziel).toBe('#/session/live');
    expect(e.fuehrt_an_den_tisch).toBe(true);
  });

  it('macht den Weg zurück groß genug für einen Daumen', () => {
    /* Der Knopf wird einhändig getroffen, während die andere Hand Chips
       stapelt. Die Mindestgröße aus DESIGN.md ist die Untergrenze. */
    const e = schritt('Die laufende Runde steht in der großen Karte');
    expect(e.knopf_hoehe as number).toBeGreaterThanOrEqual(44);
  });
});

describe('Die Uhr am Tisch', () => {
  it('läuft', () => {
    expect(schritt('Die Uhr läuft wirklich').hat_sich_bewegt).toBe(true);
  });

  it('verliert beim Neuladen keine Sekunde', () => {
    const e = schritt('Neu laden setzt an derselben Stelle fort');
    expect(e.abend_noch_da).toBe(true);
    /* Eine Sekunde Spielraum: Das Neuladen selbst dauert, und die Zeit läuft
       dabei richtigerweise weiter. Mehr wäre ein Fehler in der Rechnung. */
    expect(e.abstand_s as number).toBeLessThanOrEqual(1);
  });

  it('steht in der Pause wirklich still und zeigt das an', () => {
    const e = schritt('Pause hält an');
    expect(e.steht_still).toBe(true);
    expect(e.marke_sichtbar).toBe(true);
  });

  it('springt beim Fortsetzen nicht und läuft danach weiter', () => {
    const e = schritt('Weiter läuft an derselben Stelle an');
    expect(e.kein_sprung).toBe(true);
    expect(e.laeuft_wieder).toBe(true);
  });
});

describe('Ohne Netz', () => {
  it('meldet einen Service Worker an', () => {
    /* Ohne ihn ist die App beim nächsten Start ohne Empfang eine weiße
       Seite — und zwar mitten im Abend. */
    expect(schritt('Ohne Netz weiterspielen').service_worker_angemeldet).toBe(true);
  });

  it('startet mit abgeschaltetem Netz neu und zeigt den Tisch', () => {
    /* Wirklich abgeschaltet, nicht nur „im Quelltext steht kein fetch". */
    const e = schritt('Ohne Netz weiterspielen');
    expect(e.neu_geladen_ohne_netz).toBe(true);
    expect(String(e.zeit)).toMatch(/^\d+:\d{2}$/);
    expect(String(e.blinds)).toMatch(/^\d+ \/ \d+$/);
  });

  it('behält den laufenden Abend', () => {
    expect(schritt('Ohne Netz weiterspielen').abend_noch_da).toBe(true);
  });
});

describe('Ein Ereignis am Tisch', () => {
  it('kostet vier Griffe für zwei Ereignisse', () => {
    /* Der Auftrag setzt dreißig Sekunden als Obergrenze. Die eigentliche
       Aussage ist aber die Zahl der Griffe: aufmachen, tippen, tippen,
       zumachen. Wer dafür eine Eingabemaske bauen muss, überschreitet die
       Grenze auch dann, wenn der Browser schnell ist. */
    const e = schritt('Ein Ereignis am Tisch erfassen');
    expect(e.griffe as number).toBeLessThanOrEqual(4);
    expect(e.dauer_ms as number).toBeLessThan(30_000);
  });

  it('zeigt jede Person in einer eigenen Zeile', () => {
    const e = schritt('Ein Ereignis am Tisch erfassen');
    expect(e.zeilen).toBe(5);
  });

  it('schreibt Ausscheiden mit dem Zeitpunkt fort, nicht mit einem Platz', () => {
    /* Der Zeitpunkt fällt am Tisch ohnehin an; ein Platz wäre eine zweite
       Angabe, die dem Stand widersprechen kann. */
    const e = schritt('Ein Ereignis am Tisch erfassen');
    expect(e.ausgeschieden).toBe(1);
    expect(e.raus_um_gesetzt).toBe(true);
  });

  it('rechnet einen Nachkauf auf das Eingekaufte an', () => {
    expect(schritt('Ein Ereignis am Tisch erfassen').nachgekauft).toBe(1);
  });

  it('sagt in einem Satz, wie viele noch dabei sind', () => {
    const e = schritt('Ein Ereignis am Tisch erfassen');
    expect(String(e.noch_dabei_text)).toMatch(/^4 /);
  });

  it('macht das Blatt wieder zu und gibt den Tisch frei', () => {
    expect(schritt('Ein Ereignis am Tisch erfassen').blatt_wieder_zu).toBe(true);
  });
});

describe('Was vom Abend bleibt', () => {
  it('legt den beendeten Abend in die Liste', () => {
    const e = schritt('Beenden fragt nach und tut es dann');
    expect(e.abende_gespeichert).toBe(1);
    expect(e.adresse_danach).toBe('#/session/abende/ID?neu=1');
  });

  it('endet im Abschluss mit Prüfzeile und Teilen, nicht in einer Liste', () => {
    const a = (schritt('Beenden fragt nach und tut es dann').abschluss) as Record<string, unknown>;
    expect(a.ueberschrift).toBe('Abend beendet');
    expect(a.hat_pruefzeile).toBe(true);
    expect(a.hat_teilen).toBe(true);
  });

  it('zeigt Datum, Sieger und Umfang in einer Zeile', () => {
    const e = schritt('Der Abend steht in der Liste');
    expect(e.abende).toBe(1);
    expect(String(e.erste_karte)).toMatch(/gewonnen/);
    expect(String(e.erste_karte)).toMatch(/5 Personen/);
  });

  it('stellt jeden Namen als Knopf hin, statt ein Suchfeld anzubieten', () => {
    const e = schritt('Der Abend steht in der Liste');
    expect(e.namen_als_knoepfe).toBe(5);
    const t = schritt('Ein Tipp auf einen Namen führt zu dieser Person');
    expect(t.suchfeld, 'Ein Suchfeld verlangt, dass man den Namen gleich '
      + 'schreibt wie damals — bei handgetippten Namen trifft das nicht zu.')
      .toBe(0);
  });

  it('führt vom Namen zu den Abenden dieser Person', () => {
    const t = schritt('Ein Tipp auf einen Namen führt zu dieser Person');
    expect(t.adresse).toBe(`#/session/spieler/${t.getippt}`);
    expect(t.ueberschrift).toBe(t.getippt);
    expect(t.abende as number).toBeGreaterThanOrEqual(1);
    expect(String(t.untertitel)).toMatch(/Abend/);
  });

  it('zeigt im Abend jede Person mit ihrem gerechneten Platz', () => {
    const e = schritt('Ein Tipp auf einen Abend zeigt den Abend');
    expect(e.zeilen).toBe(5);
    const plaetze = (e.plaetze as string[]).map((t) => Number(t.replace('.', '')));
    expect(plaetze[0]).toBe(1);
    /* Die Plätze steigen und sind nie erfunden: Gleichstand teilt sich einen
       Platz, danach wird entsprechend übersprungen. */
    for (let i = 1; i < plaetze.length; i += 1) {
      expect(plaetze[i]).toBeGreaterThanOrEqual(plaetze[i - 1]);
    }
    expect(Math.max(...plaetze)).toBeLessThanOrEqual(plaetze.length);
  });

  it('lässt von jedem dieser Bildschirme einen Weg zurück', () => {
    expect(schritt('Ein Tipp auf einen Abend zeigt den Abend').zurueck_sichtbar).toBe(true);
  });
});

describe('Die Farbmodi', () => {
  it('bietet drei Möglichkeiten mit der Systemvorgabe vorausgewählt', () => {
    const e = schritt('Die Farbwahl liegt unter dem Personensymbol');
    const eintraege = e.eintraege as Array<{ text: string; gewaehlt: boolean }>;
    expect(e.anzahl).toBe(3);
    expect(eintraege.map((x) => x.text)).toEqual(['Systemvorgabe', 'Hell', 'Dunkel']);
    expect(eintraege.filter((x) => x.gewaehlt).map((x) => x.text)).toEqual(['Systemvorgabe']);
  });

  it('liegt unter dem Personensymbol und nicht auf der Startseite', () => {
    /* Die Wahl wird einmal getroffen und dann jahrelang nicht mehr. Fläche
       auf der Startseite brauchen die drei Karten. */
    expect(schritt('Die Farbwahl liegt unter dem Personensymbol').auf_startseite).toBe(false);
  });

  it('wirkt sofort, ohne Neustart, in beide Richtungen', () => {
    const e = schritt('Umschalten wirkt sofort und wird gemerkt');
    expect(e.hat_gewechselt).toBe(true);
    expect(e.ohne_neuladen).toBe(true);
  });

  it('merkt sich die Wahl und zieht das Farbschema des Browsers mit', () => {
    /* Ohne `color-scheme` stünde ein weißes Eingabefeld im dunklen
       Bildschirm, und niemand wüsste warum. */
    const e = schritt('Umschalten wirkt sofort und wird gemerkt');
    for (const satz of ['dunkel', 'hell'] as const) {
      const m = e[satz] as { attribut: string; farbschema: string; gespeichert: string };
      expect(m.attribut).toBe(satz);
      expect(m.gespeichert).toBe(satz);
      expect(m.farbschema).toBe(satz === 'hell' ? 'light' : 'dark');
    }
  });

  it('steht vor dem ersten Zeichnen fest — kein Aufblitzen', () => {
    /* Gemessen wird bei `commit`, nicht bei `domcontentloaded`: Das
       Programm hängt als `type="module"` im Dokument und läuft VOR diesem
       Ereignis. Der alte Vergleich hätte auch dann Grün gemeldet, wenn das
       inline-Skript gar nicht gelaufen wäre — und genau das war der Fall
       (E-043). */
    const e = schritt('Nach dem Neuladen steht die Farbe vor dem ersten Zeichnen fest');
    expect(e.bei_commit).toBe(e.spaeter);
    expect(e.skript_vor_stilblatt, 'Das Skript muss vor dem Stilblatt stehen').toBe(true);
  });

  it('wird von der Sicherheitsrichtlinie nicht verboten', () => {
    /* `script-src 'self'` verbietet inline-Skripte — still, mit einer Zeile
       in der Konsole, die niemand liest. Erlaubt wird das eine Skript jetzt
       über seinen Hash, den die Bauzeit aus dem fertigen HTML rechnet. */
    const e = schritt('Nach dem Neuladen steht die Farbe vor dem ersten Zeichnen fest');
    expect(e.konsolenfehler).toEqual([]);
  });
});

describe('Der Live-Bereich folgt der Wahl nicht', () => {
  it('bleibt dunkel, auch wenn hell gewählt ist', () => {
    /* Das Gerät liegt bei gedimmtem Licht auf einem Pokertisch; eine helle
       Fläche blendet die Runde und beleuchtet Gesichter. */
    const e = schritt('Der Live-Bereich bleibt dunkel, auch bei heller Wahl');
    const live = e.live as Record<string, string>;
    expect(live.wahl_am_dokument).toBe('hell');
    expect(live.rahmen_attribut).toBe('dunkel');
    expect(live.grund).toBe('#0c110e');
  });

  it('lässt Lernen und Nachschlagen der Wahl folgen', () => {
    /* Die Ausnahme gilt für den Live-Bereich und sonst nirgends — sonst
       wäre sie keine Ausnahme, sondern ein zweiter dunkler Modus. */
    const e = schritt('Der Live-Bereich bleibt dunkel, auch bei heller Wahl');
    const lernen = e.lernen as Record<string, string | null>;
    expect(lernen.rahmen_attribut).toBeNull();
    expect(lernen.grund).not.toBe((e.live as Record<string, string>).grund);
  });
});

describe('Die Startseite trägt die Navigation allein', () => {
  /* Die drei folgenden Prüfungen sichern eine **Regel**, keinen Selektor.
     Die erste Fassung suchte nach `nav.bottom-nav` und war damit wertlos:
     Eine neue Leiste hieße beim nächsten Mal anders und käme durch. Geprüft
     wird deshalb, was ein Screenreader als Navigation sieht — `<nav>` und
     `role="navigation"` — und wo es auf dem Bildschirm sitzt.

     Worum es geht: Auf der Startseite SIND die drei Karten die Navigation.
     Eine zweite Navigation daneben führt zu denselben Zielen und macht
     diesen Bildschirm damit zu einem ohne eigenen Inhalt — das war der
     Grund für die leere untere Hälfte, nicht ein Layoutfehler (E-032). Und
     der untere Rand gehört der großen Karte: Er ist der Teil, den der Daumen
     erreicht. */

  it('trägt höchstens eine Navigation — nicht zwei nebeneinander', () => {
    const e = schritt('Die Startseite füllt den Bildschirm');
    const navigationen = e.navigationen as Array<{ marke: string }>;
    /* Alles ab der zweiten ist zu viel — und die Meldung nennt sie beim
       Namen, damit niemand raten muss, welche gemeint ist. */
    expect(navigationen.slice(1).map((n) => n.marke),
      'Zwei Navigationen auf einem Bildschirm führen zu denselben Zielen. '
      + 'Eine davon ist überflüssig — und die überflüssige nimmt den Karten '
      + 'die Fläche.').toEqual([]);
  });

  it('lässt keine Navigation am unteren Bildschirmrand sitzen', () => {
    /* „Unterer Rand" ist hier nicht geschätzt, sondern aus der Regel
       abgeleitet: Unterhalb der großen Karte steht nur noch der
       Gestenstreifen. Was tiefer sitzt als ihre Unterkante, sitzt dort, wo
       eine Tableiste säße. */
    const e = schritt('Die Startseite füllt den Bildschirm');
    const gross = e.gross as { unten: number };
    const navigationen = e.navigationen as Array<{
      marke: string; unten: number; abstand_unterkante: number; spannt_die_breite: boolean;
    }>;
    const unten = navigationen.filter((n) => n.unten > gross.unten);
    expect(unten.map((n) => `${n.marke} endet ${n.abstand_unterkante} px über dem Rand`),
      'Der untere Rand gehört der großen Karte — er ist der Teil, den der '
      + 'Daumen erreicht.').toEqual([]);
  });

  it('erkennt eine zurückgekehrte Leiste an ihrer Form, nicht an ihrem Namen', () => {
    /* Die Gegenprobe zur Prüfung selbst: Eine Leiste am unteren Rand spannt
       die Breite und endet dicht am Rand. Genau diese beiden Merkmale werden
       gemessen — eine Umbenennung ändert daran nichts. */
    const e = schritt('Die Startseite füllt den Bildschirm');
    const navigationen = e.navigationen as Array<{
      marke: string; spannt_die_breite: boolean; abstand_unterkante: number;
    }>;
    const leistenartig = navigationen.filter(
      (n) => n.spannt_die_breite && n.abstand_unterkante < 96,
    );
    expect(leistenartig.map((n) => n.marke),
      'Breit, unten, und eine Navigation: Das ist eine Tableiste, egal wie '
      + 'die Klasse heißt.').toEqual([]);
  });

  it('ordnet die Karten von klein nach groß, von oben nach unten', () => {
    const e = schritt('Die Startseite füllt den Bildschirm');
    expect(e.reihenfolge).toEqual(['klein', 'mittel', 'gross']);
    const [k, m, g] = ['klein', 'mittel', 'gross']
      .map((n) => e[n] as { oben: number; hoehe: number });
    expect(k.oben).toBeLessThan(m.oben);
    expect(m.oben).toBeLessThan(g.oben);
  });



  it('hält die Kennzahlen aus dem Daumenbereich heraus', () => {
    /* Streak, Level und XP standen einmal unter den Karten und drückten die
       große aus dem Daumenbereich. Seit E-035 stehen sie in der Lernkarte —
       sie gehören zum Lernteil und wirkten in einer eigenen Zeile darüber
       abgetrennt. Was von der alten Regel bleibt und hier geprüft wird: Sie
       stehen oberhalb der großen Karte, nicht darin und nicht darunter.

       Beim ersten Öffnen gibt es sie noch nicht — dann ist hier nichts zu
       prüfen. */
    const e = schritt('Die Startseite füllt den Bildschirm');
    if (e.stand_oben_px === null) return;
    expect(e.stand_oben_px as number)
      .toBeLessThan((e.gross as { oben: number }).oben);
  });
});

/* ── Die Karten sind innen gefüllt ────────────────────────────────────────
   Die Karten füllen die Bildschirmhöhe (Regel 10.1). Solange ihr Inhalt aus
   zwei Textzeilen bestand, waren sie deshalb außen groß und innen leer —
   der Anlass für E-035. Was das erkennt, ist nicht die Höhe der Karte,
   sondern das Verhältnis von belegter zu verfügbarer Innenfläche. */

/** Der kleinste Anteil, den eine Karte belegen darf.
 *
 *  Gemessen wird die Summe der Kindhöhen samt ihrer eigenen Abstände,
 *  geteilt durch die Innenhöhe der Karte. Nicht die Spanne vom ersten zum
 *  letzten Kind: Die zählt die Lücke dazwischen als belegt mit und wäre bei
 *  einer Karte, die ihre zwei Zeilen an den oberen und den unteren Rand
 *  schiebt, immer 1. Was übrig bleibt, ist der Leerraum, den die
 *  Höhenverteilung nicht vergeben konnte — und genau der ist gemeint.
 *
 *  Die Zahl ist gemessen, nicht gewählt. Zwei Messreihen:
 *
 *  1. Was heute vorkommt: 72 Werte — drei Karten × drei Bezugsgeräte aus
 *     Regel 10.1 × beide Sprachen × die vier Zustände der Startseite
 *     (erstes Öffnen, benutzt, mit früheren Abenden, laufende Runde). Der
 *     kleinste Wert war **0,492**: die große Karte auf dem 390 × 844 großen
 *     Gerät im Zustand „benutzt, aber noch nie gespielt". Sie hat dort außer
 *     dem Knopf nichts zu zeigen und muss trotzdem die größte Karte sein
 *     (Regel 10.2) — der Leerraum ist dort keine Nachlässigkeit, sondern die
 *     Folge zweier Regeln, die beide gelten.
 *  2. Was der Test fangen muss: derselbe Bildschirm im Zustand vor E-035 —
 *     Karten, deren Inhalt aus zwei Textzeilen besteht. Nachgestellt, indem
 *     genau die Kinder ausgeblendet wurden, die dieser Durchgang hinzugefügt
 *     hat. Ergebnis für die beiden unteren Karten: 0,142 bis **0,230**.
 *
 *  Der Schwellwert liegt eine Textzeile unter dem kleinsten Wert aus (1):
 *  Eine Zeile im Fließtext ist auf jener Karte 22 von 351 Pixeln, also 0,063;
 *  0,492 − 0,063 = 0,429, abgerundet auf das nächste Zehntel. Eine
 *  Übersetzung, die eine Zeile anders umbricht, soll den Test nicht rot
 *  machen.
 *
 *  Nach unten bleibt fast doppelt so viel Abstand wie nach oben
 *  (0,4 → 0,230 gegenüber 0,4 → 0,492). Der Schwellwert trennt also die
 *  beiden Fälle, statt zwischen ihnen zu kleben.
 *
 *  Was diese Messung NICHT sieht: ob ein Kind mit der Fläche etwas anfängt.
 *  Ein Knopf, der auf die volle Höhe gestreckt wird, belegt sie — und sieht
 *  aus wie ein leerer Rahmen mit einem Wort darin. Der erste Versuch tat
 *  genau das: 0,89 gemessen, 176 Pixel hohes Rechteck auf dem Bild. Dagegen
 *  hilft keine Zahl, sondern der Deckel in `global.css` (Abschnitt
 *  „Startseite") und ein Blick auf das Bild. Dieselbe Lehre wie in
 *  DESIGN.md 11.6, an einer anderen Stelle: Eine Prüfung sichert die
 *  Eigenschaft, die sie misst, nicht die Absicht dahinter. */
const MINDESTFUELLUNG = 0.4;

interface Fuellung {
  karte: string;
  aussen_px: number;
  innen_px: number;
  belegt_px: number;
  anteil: number;
  ueberlauf_px: number;
}

/* ── Der Tischzustand ─────────────────────────────────────────────────────
   Seit E-036 hat die Startseite zwei Gesichter. Läuft eine Runde, entfällt
   die Hand des Tages: Wer das Gerät zwischen Chips und Karten aufnimmt, will
   die Uhr sehen, keine Übungsaufgabe. Der Bildschirm ist dann wieder genau
   der aus E-032/E-035 — und für ihn gelten dessen Höhenregeln unverändert.
   Sie stehen deshalb hier und nicht mehr beim Alltagszustand: nicht
   abgeschafft, sondern an die Lage gebunden, für die sie gedacht waren. */

describe('Am Tisch bleibt die Startseite der Bildschirm von vorher', () => {
  const e = () => schritt('Am Tisch bleibt die Startseite der Bildschirm von vorher');

  it('zeigt keine Tagesaufgabe, solange gespielt wird', () => {
    expect(e().hand_des_tages_da).toBe(0);
  });

  it('passt ohne Scrollen auf den Bildschirm', () => {
    /* Am Tisch ist Scrollen das Schlimmste: Eine Hand hält Chips, die
       andere sucht. */
    expect(e().scrollt).toBe(false);
  });

  it('gibt der Live-Session die größte Fläche', () => {
    const hoehe = (name: string) => (e()[name] as { hoehe: number }).hoehe;
    expect(hoehe('gross')).toBeGreaterThan(hoehe('mittel'));
    /* Deutlich größer, nicht ein bisschen: mindestens das Doppelte der
       kleinsten Karte (Regel 10.2). */
    expect(hoehe('gross')).toBeGreaterThanOrEqual(hoehe('klein') * 2);
  });

  it('lässt unter der letzten Karte nur den Sicherheitsabstand', () => {
    expect(e().rest_unten_px).toBe(e().gestenstreifen_px);
  });
});

/* ── Die Hand des Tages ───────────────────────────────────────────────────
   Der Grund, die App zu öffnen (E-036). Geprüft wird nicht, dass es sie
   gibt, sondern dass sie leistet, wozu sie da ist: Sie steht ganz oben, sie
   ist ohne einen einzigen Weg beantwortbar, und die Antwort bleibt. */

describe('Die Hand des Tages', () => {
  const geometrie = () => schritt('Die Startseite füllt den Bildschirm').heute as {
    ist_erstes_kind: boolean; steht_ueber_den_karten: boolean;
    knoepfe: number; knopf_hoehe: number; knoepfe_ohne_scrollen: boolean;
    karten_sichtbar: number; kartenbreite_px: number; wochenpunkte: number;
  } | null;
  const ablauf = () => schritt('Die Hand des Tages wird auf der Startseite beantwortet');

  it('steht ganz oben, vor den drei Karten', () => {
    /* Sie ist das Einzige auf dieser Seite, das man tun kann, ohne
       irgendwohin zu gehen. Was man tun kann, steht vor dem, wohin man
       gehen kann. */
    const g = geometrie();
    expect(g).not.toBeNull();
    expect(g!.ist_erstes_kind).toBe(true);
    expect(g!.steht_ueber_den_karten).toBe(true);
  });

  it('lässt sich beantworten, ohne zu scrollen', () => {
    /* Eine Aufgabe unterhalb des Bildrands ist keine Aufgabe, sondern eine,
       die man findet, wenn man ohnehin schon sucht. */
    const g = geometrie()!;
    expect(g.knoepfe).toBe(2);
    expect(g.knoepfe_ohne_scrollen).toBe(true);
    expect(g.knopf_hoehe).toBeGreaterThanOrEqual(44);
  });

  it('zeigt die Karten in erkennbarer Größe, nicht als Briefmarke', () => {
    /* Der Kern von E-036: Poker hat genau einen Gegenstand, den man ansehen
       will, und der war in dieser App 48 Pixel breit und stand als graue
       Leiste neben dem Text. Fünf Karten — zwei eigene und der Flop. */
    const g = geometrie()!;
    expect(g.karten_sichtbar).toBe(5);
    expect(g.kartenbreite_px).toBeGreaterThanOrEqual(60);
  });

  it('zeigt die Woche als sieben Punkte', () => {
    /* Eine Zahl stellt fest, sieben Punkte laden ein: Man sieht die Lücke. */
    expect(geometrie()!.wochenpunkte).toBe(7);
  });

  it('zählt für die eine Serie und gibt kleine XP (E-087)', () => {
    /* Die Hand des Tages führte eine eigene Reihe, die nur sie kannte: Die
       Startseite zeigte „1 Tag in Folge" neben „3 Tage-Streak". Jetzt füttert
       die Antwort `data.streak` wie jede Lernhandlung — und ein
       Neuladen verbucht den Tag nicht noch einmal. */
    const a = ablauf();
    expect(a.streak_nachher as number).toBeGreaterThanOrEqual(1);
    expect(a.streak_nachher).toBeGreaterThanOrEqual((a.streak_vorher as number) ?? 0);
    expect(a.xp_dazu as number).toBeGreaterThan(0);
    expect(a.xp_nach_neuladen_unveraendert).toBe(true);
  });

  it('nennt die Serie in der Karte und in der Lernkarte gleich, im richtigen Numerus', () => {
    const a = ablauf();
    const n = a.streak_nachher as number;
    const wort = n === 1 ? 'Tag in Folge' : 'Tage in Folge';
    expect(String(a.serie_in_der_karte)).toBe(`${n} ${wort}`);
    expect(String(a.serie_in_der_lernkarte)).toContain(`${n} ${wort}`);
    /* Kein „Tage-Streak" mehr, kein „1 Tage". */
    expect(String(a.serie_in_der_lernkarte)).not.toMatch(/Streak|1 Tage/);
  });

  it('hält die Startseite danach nicht mehr für die eines Erstnutzers', () => {
    const a = ablauf();
    expect(a.lernkarte_zeigt_stand).toBe(true);
    expect(a.erklaerung_nach_antwort_weg).toBe(true);
  });

  it('stellt eine Frage und nennt die Karten beim Namen', () => {
    const a = ablauf();
    expect(String(a.frage)).toMatch(/\?$/);
    expect(a.karten_vorher).toHaveLength(5);
    /* Sprechbar, nicht „10♦": Ein Screenreader liest sonst ein Symbol vor. */
    for (const name of a.karten_vorher as string[]) {
      expect(name).toMatch(/\w+ \w+/);
    }
  });

  it('antwortet mit einem Urteil und der gerechneten Zahl dahinter', () => {
    const a = ablauf();
    expect(String(a.urteil)).not.toBe('');
    /* Zwei Prozentwerte: was man trifft, und was nötig wäre. Beide kommen
       aus den gerechneten Tabellen, nicht aus dem Bildschirm. */
    expect(String(a.zahlen)).toMatch(/%.*%/);
    expect(a.knoepfe_weg).toBe(0);
  });

  it('füllt den Punkt für heute', () => {
    const a = ablauf();
    expect(a.punkte_offen_vorher).toBe(1);
    expect(a.punkt_gefuellt).toBeGreaterThanOrEqual(1);
  });

  it('behält die Antwort über ein Neuladen', () => {
    /* Sonst wäre die Antwort von heute Morgen mittags verschwunden, und die
       Frage war nichts wert. */
    const a = ablauf();
    expect(a.urteil_nach_neuladen).toBe(a.urteil);
    expect(a.frage_wieder_da).toBe(0);
    expect(a.hand_bleibt).toBe(true);
  });

  it('führt zur ganzen Rechnung derselben Hand, nicht zu irgendeiner', () => {
    /* „Warum?" muss die Rechnung zu **dieser** Hand zeigen. Eine fremde
       Aufgabe wäre eine Themaverfehlung. */
    expect(String(ablauf().warum_ziel)).toMatch(/^#\/lernen\/drill\/.+/);
  });
});

describe('Die Karten sind innen gefüllt, nicht nur außen groß', () => {
  const messungen = (schritt('Die Karten sind auf jedem Bezugsgerät innen gefüllt')
    .messungen as Array<{
      geraet: string; scrollt: boolean; rest_unten_px: number;
      heute_knoepfe_ohne_scrollen: boolean; letzte_karte: string; karten: Fuellung[];
    }>);

  it('misst auf allen drei Bezugsgeräten aus Regel 10.1', () => {
    /* Eine Karte, die nur auf einem Gerät gefüllt ist, ist nicht gefüllt.
       Genau die Geräte, für die DESIGN.md die Höhen ausweist. */
    expect(messungen.map((m) => m.geraet)).toEqual(['375x667', '390x844', '360x740']);
    for (const m of messungen) expect(m.karten).toHaveLength(3);
  });

  it('lässt keine Karte unter den gemessenen Mindestanteil fallen', () => {
    for (const m of messungen) {
      for (const k of m.karten) {
        expect(
          k.anteil,
          `Die Karte „${k.karte}" belegt auf ${m.geraet} nur ${k.anteil} ihrer `
          + `Innenfläche (${k.belegt_px} von ${k.innen_px} px). Eine Karte, die `
          + 'die Bildschirmhöhe füllt, aber innen leer bleibt, sieht aus wie ein '
          + 'Versehen — das war der Anlass für E-035. Entweder fehlt der Karte '
          + 'Inhalt, oder ein Kind darf die übrige Höhe nicht mehr aufnehmen. '
          + 'Eine dekorative Abbildung ist ausdrücklich nicht die Antwort: Sie '
          + 'füllt dieselbe Fläche, ohne etwas zu sagen.',
        ).toBeGreaterThanOrEqual(MINDESTFUELLUNG);
      }
    }
  });

  it('schneidet dabei nichts ab — abgeschnitten wäre schlimmer als leer', () => {
    /* Die Gegenprobe zum Anteil: Wer eine Karte füllt, indem er mehr
       hineinlegt, als hineinpasst, hat sie nicht gefüllt, sondern
       beschnitten. */
    for (const m of messungen) {
      for (const k of m.karten) {
        expect(k.ueberlauf_px, `Die Karte „${k.karte}" läuft auf ${m.geraet} um `
          + `${k.ueberlauf_px} px über.`).toBe(0);
      }
    }
  });





  it('lässt die Hand des Tages auf jedem Gerät ohne Scrollen beantworten', () => {
    /* Seit E-036 passt die Startseite im Alltagszustand nicht mehr auf jedes
       Gerät: Drei Karten mit Inhalt und eine Aufgabe brauchen zusammen rund
       670 Pixel, ein 667 Pixel hohes Gerät hat nach Kopfzeile und Rändern
       567. Das ist ausgerechnet und in Kauf genommen — aber unter einer
       Bedingung: Die Aufgabe selbst steht immer oben und ist immer ohne
       Scrollen zu beantworten. Wonach man scrollen muss, sind die Wege, und
       Wege darf man suchen.

       Die Regel „kein Scrollen" gilt unverändert dort, wo sie herkam: am
       Tisch. Sie wird im Schritt „Am Tisch bleibt die Startseite der
       Bildschirm von vorher" geprüft. */
    for (const m of messungen) {
      expect(m.heute_knoepfe_ohne_scrollen, m.geraet).toBe(true);
    }
  });

  it('lässt die Live-Session auf jedem Gerät die unterste Karte sein', () => {
    /* Von Regel 10.2 gilt im Alltagszustand die Lage, nicht die Höhe: Die
       Höhe gehört dem, was man gerade tut — am Tisch der Live-Session, sonst
       der Aufgabe. Unten im Daumenbereich bleibt sie in beiden Fällen. */
    for (const m of messungen) {
      expect(m.letzte_karte, m.geraet).toBe('gross');
    }
  });

  it('misst auch auf dem Gerät des Durchgangs selbst', () => {
    /* Der Schritt, der die Höhenverteilung prüft, misst die Füllung mit —
       damit die beiden Messungen nicht auseinanderlaufen können. */
    const e = schritt('Die Startseite füllt den Bildschirm');
    const fuellung = e.fuellung as Fuellung[];
    expect(fuellung).toHaveLength(3);
    for (const k of fuellung) {
      expect(k.anteil, `Karte „${k.karte}"`).toBeGreaterThanOrEqual(MINDESTFUELLUNG);
      expect(k.ueberlauf_px).toBe(0);
    }
  });
});

describe('Der Willkommensdialog (FAHRPLAN 4.4)', () => {
  const w = () => schritt('Der Willkommensdialog führt durch Name und Ziel');

  it('sagt in einem Satz, was die App tut — ohne „Skills" und „besser gewinnen"', () => {
    const t = String(w().tagline);
    expect(t).not.toMatch(/Skills|besser gewinnen|Strategien/);
    expect(t).toMatch(/Echtgeld/);
  });

  it('fragt nach dem Ziel, freiwillig und mit zwei gleichwertigen Wegen', () => {
    expect(w().ziel_frage).toMatch(/Was hast du vor/i);
    expect(w().ziel_knoepfe).toEqual(['Poker lernen', 'Pokerabende leiten', 'Zurück', 'Überspringen']);
  });

  it('passt auch auf ein 667 Pixel hohes Gerät', () => {
    expect(w().dialog_passt_auf_667).toBe(true);
  });

  it('zeigt den eingegebenen Namen statt „Du" und merkt sich das Ziel', () => {
    expect(String(w().oben_rechts)).toContain('Mira');
    expect(String(w().oben_rechts)).not.toMatch(/\bDu\b/);
    expect(w().ziel_gespeichert).toBe('abend');
    expect(w().dialog_weg).toBe(true);
  });

  it('erklärt dem, der Abende leiten will, den Lernteil nicht', () => {
    expect(w().erklaerung_da).toBe(0);
    expect(w().frage).toBe('Lohnt der Call?');
  });

  it('nennt die Marke der Karte „Hand des Tages"', () => {
    expect(w().marke).toBe('Hand des Tages');
  });

  it('bietet „Ich habe schon ein Konto" nur an, wo es eine Anmeldung gibt', () => {
    expect(w().konto_link_ohne_anbieter).toBe(0);
  });

  it('springt von dort zur Kontokarte, setzt den Fokus und verdeckt sie nicht', () => {
    const k = schritt('„Ich habe schon ein Konto“ springt zur Kontokarte');
    expect(k.adresse).toBe('#/profil/einstellungen?konto=1');
    expect(k.fokus_auf_konto).toBe(true);
    expect(k.sichtbar).toBe(true);
    expect(k.unter_der_kopfzeile).toBe(true);
    expect(k.dialog_weg).toBe(true);
  });
});

describe('Das Tages-Quiz fragt nur, was man gelernt hat (FAHRPLAN 4.5)', () => {
  const q = () => schritt('Das Tages-Quiz fragt nur, was man gelernt hat');

  it('gibt ohne abgeschlossene Lektion kein Quiz, sondern einen Weg zur Lektion', () => {
    expect(q().ohne_fortschritt_titel).toBe('Erst eine Lektion abschließen');
    expect(q().ohne_fortschritt_start_knopf).toBe(0);
    expect(String(q().ohne_fortschritt_weg)).toMatch(/^#\/lernen\/m1\/m1-l1$/);
  });

  it('gibt mit einer abgeschlossenen Lektion eins, aus abgeschlossenen Lektionen', () => {
    expect(q().mit_lektion_start_knopf).toBe(1);
    expect(String(q().mit_lektion_text)).toMatch(/abgeschlossenen Lektionen/);
  });

  it('nennt die Zahl der Fragen genau einmal', () => {
    expect(q().fuenf_fragen_genannt).toBe(1);
  });
});

describe('Das Tagesziel auf der Startseite (FAHRPLAN 4.2)', () => {
  it('zeigt Hand erledigt und die Fragen offen, sobald es ein Quiz geben kann', () => {
    const ziel = String(schritt('Das Tages-Quiz fragt nur, was man gelernt hat').tagesziel_auf_start);
    expect(ziel).toMatch(/^Heute: Hand/);
    expect(ziel).toMatch(/5 Fragen/);
  });
});

describe('Erinnern ohne Server (FAHRPLAN 4.6)', () => {
  const e = () => schritt('Erinnern ohne Server: Kalendereintrag und Glossar-Sprung');

  it('liefert einen täglichen Kalendereintrag zur gewählten Uhrzeit', () => {
    expect(e().dateiname).toBe('pokermentor-erinnerung.ics');
    expect(e().beginnt_richtig).toBe(true);
    expect(e().taeglich).toBe(true);
    expect(e().uhrzeit_im_termin).toBe(true);
    expect(e().mit_erinnerung).toBe(true);
  });

  it('fragt dabei keine Mitteilungserlaubnis an', () => {
    expect(e().mitteilungsanfragen).toBe(0);
  });

  it('öffnet im Glossar den Begriff, mit dem man kommt', () => {
    expect(e().glossar_offen).toEqual(['Call']);
    expect(e().glossar_treffer_mehr_als_einer).toBe(true);
  });
});

describe('Die Lektion führt durch (FAHRPLAN 5.4)', () => {
  const l = () => schritt('Die Lektion zeigt, wo man liest, und führt mit „Weiter“ durch');

  it('nennt den Abschnitt und die Zahl der Abschnitte', () => {
    expect(l().stand_am_anfang).toBe(`Abschnitt 1 von ${l().abschnitte}`);
  });

  it('hat eine klebende Leiste am unteren Rand mit „Weiter"', () => {
    expect(l().klebt).toBe(true);
    expect(l().leiste_unten_am_fensterrand).toBe(true);
    expect(l().knopf_am_anfang).toBe('Weiter');
  });

  it('scrollt mit „Weiter" zum nächsten Abschnitt und zählt mit', () => {
    expect(l().scrollte_beim_weiter).toBe(true);
    expect(l().stand_nach_zweimal_weiter).toBe(`Abschnitt 3 von ${l().abschnitte}`);
  });

  it('misst beim Lesen, wie weit man ist, und merkt es', () => {
    /* Der Abschnitt kommt aus dem Bild (Index 2 = dritter Abschnitt), nicht aus
       einer Annahme. Am Ende steht der letzte. */
    expect(l().abschnitt_gemerkt_nach_weiter).toBe(2);
    expect(l().abschnitt_gemerkt_am_ende).toBe((l().abschnitte as number) - 1);
  });

  it('macht am Ende aus „Weiter" das Quiz', () => {
    expect(String(l().knopf_am_ende)).toMatch(/^Quiz starten/);
  });

  it('springt beim Wiederkommen an die gemerkte Stelle und sagt es', () => {
    expect(l().wiederkehr_sprang).toBe(true);
    expect(String(l().wiederkehr_hinweis)).toMatch(/Weiter bei Abschnitt \d+ von \d+/);
  });
});

describe('Das Quiz im Fokusmodus (FAHRPLAN 5.2)', () => {
  const q = () => schritt('Das Quiz ist eine eigene Adresse im Fokusmodus');

  it('hat eine eigene Adresse', () => {
    expect(q().adresse).toBe('/lernen/m1/m1-l1/quiz');
  });

  it('kommt ohne Seitenkopf aus: Kreuz, Balken, Zähler', () => {
    const k = q().kopf as { schliessen: number; seitenkopf: number; h1: number };
    expect(k.schliessen).toBe(1);
    expect(k.seitenkopf).toBe(0);
    /* Heute begann die Frage erst bei y ≈ 500. */
    expect(q().frage_oben_px as number).toBeLessThan(200);
  });

  it('verschiebt beim Antworten keinen Pixel (Regel 8a.2)', () => {
    expect(q().verschiebung_beim_antworten_px).toBe(0);
  });

  it('hat eine klebende Ergebnisleiste mit fester Höhe, die in der unteren Hälfte beginnt', () => {
    expect(q().leiste_klebt).toBe(true);
    expect(q().leiste_hoehe_px as number).toBeGreaterThan(150);
  });

  it('zeigt Urteil und „Nächste Frage" in der Leiste, ohne scrollen zu müssen', () => {
    const n = q().nach_antwort as { urteil: string; knopf: string; karten_unter_leiste: boolean };
    expect(n.urteil).toMatch(/Richtig|Nicht ganz/);
    expect(n.knopf).toBe('Nächste Frage');
    expect(n.karten_unter_leiste).toBe(true);
  });

  it('fragt beim Verlassen erst ab der ersten Antwort und behält den Stand', () => {
    expect(String(q().rueckfrage)).toMatch(/Quiz verlassen\?.*Frage 2/);
    expect(q().nach_verlassen).toBe('/lernen/m1/m1-l1');
    expect(q().knopf_danach).toBe('Quiz fortsetzen bei Frage 2');
    expect(q().zaehler_nach_fortsetzen).toBe('2/5');
  });

  it('lässt Browser-Zurück nur das Quiz verlassen', () => {
    expect(q().nach_browser_zurueck).toBe('/lernen/m1/m1-l1');
  });
});

describe('Bestehen heißt verstanden (FAHRPLAN 5.1, 5.3)', () => {
  const b = () => schritt('Bestehen heißt verstanden');
  const f = () => b().fehlschlag as {
    urteil: string; punkte: string; kacheln: string[]; falsch_liste: number;
    in_wiederholung: number; knoepfe: string[]; toasts: number; leiste_im_daumenbereich: boolean;
  };
  const g = () => b().bestanden as {
    urteil: string; punkte: string; kacheln: string[]; knoepfe: string[]; toasts: number;
    leiste_im_daumenbereich: boolean;
  };

  it('lässt einen schlechten Durchgang nicht bestehen — kein Haken, keine XP, kein Abzeichen', () => {
    expect(f().urteil).toBe('Noch nicht bestanden');
    expect(b().lektion_fertig_nach_fehlschlag).toBe(false);
    expect(b().xp_nach_fehlschlag).toBe(0);
    expect(b().abzeichen_nach_fehlschlag).toEqual([]);
  });

  it('merkt sich das beste Ergebnis als „versucht"', () => {
    const v = b().versucht_gemerkt as { bestScore: number; total: number; tries: number };
    expect(v.total).toBe(5);
    expect(v.tries).toBe(1);
    expect(v.bestScore).toBeLessThan(4);
  });

  it('zeigt in der Modulübersicht „versucht", nicht „abgeschlossen"', () => {
    const z = b().modul_zeile as { klassen: string[]; meta: string; hinweis: string };
    expect(z.klassen).not.toContain('fertig');
    expect(z.meta).toMatch(/Quiz: \d\/5/);
    expect(z.hinweis).toBe('Noch einmal');
  });

  it('zeigt jede falsche Frage mit „kommt in deine Wiederholung" und legt sie in den Stapel', () => {
    expect(f().falsch_liste).toBeGreaterThan(0);
    expect(f().in_wiederholung).toBe(f().falsch_liste);
    expect(b().wiederholung_nach_fehlschlag).toBe(f().falsch_liste);
  });

  it('bietet „Fehler nochmal üben" als Hauptweg', () => {
    expect(f().knoepfe[0]).toBe('Fehler nochmal üben');
    expect(f().knoepfe).toContain('Quiz noch einmal von vorn');
  });

  it('hält das Üben aus der Lektion heraus', () => {
    const u = b().uebung as { titel: string; hinweis: string };
    expect(u.titel).toBe('Fehler üben');
    expect(u.hinweis).toMatch(/zählt nicht/);
    expect(b().lektion_fertig_nach_uebung).toBe(false);
  });

  it('lässt einen guten Durchgang bestehen: Haken, 20/80-XP, Abzeichen als Kachel statt Toast', () => {
    expect(g().urteil).toBe('Bestanden');
    expect(b().lektion_fertig_nach_bestehen).toBe(true);
    expect(b().xp_durch_bestehen).toBe(100);
    expect(b().versucht_danach).toBeNull();
    expect(b().abzeichen_nach_bestehen).toEqual(expect.arrayContaining(['first-lesson', 'quiz-perfect']));
    expect(g().kacheln.some((k) => /\+100\s*XP/.test(k))).toBe(true);
    expect(g().kacheln.some((k) => /1\/5\s*im Modul/.test(k))).toBe(true);
    expect(g().kacheln.some((k) => /Neues Abzeichen/.test(k))).toBe(true);
    expect(g().toasts).toBe(0);
  });

  it('führt nach dem Bestehen weiter und ins passende Training', () => {
    expect(g().knoepfe[0]).toMatch(/^Nächste Lektion/);
    expect(g().knoepfe.some((k) => /^Jetzt üben:/.test(k))).toBe(true);
  });

  it('legt die Ergebnisleiste in den Daumenbereich', () => {
    expect(f().leiste_im_daumenbereich).toBe(true);
    expect(g().leiste_im_daumenbereich).toBe(true);
  });

  it('mischt die Optionen bei jedem Durchgang anders', () => {
    /* Der Grund: In 58 % der Fragen war B richtig. */
    expect(b().optionen_gemischt as number).toBeGreaterThan(0);
  });
});

describe('Ohne untere Leiste braucht jeder Bildschirm einen Weg zurück', () => {
  it('trägt die Marke oben als sichtbaren Weg zur Startseite', () => {
    const e = schritt('Jeder Bildschirm hat einen sichtbaren Weg zur Startseite');
    expect(e.sichtbar).toBe(true);
    expect(e.fuehrt_nach).toBe('#/');
  });

  it('macht diesen Weg so groß, dass man ihn trifft', () => {
    /* Sichtbar allein genügt nicht: Ein 29 Pixel hoher Weg ist einer, den
       man dreimal antippt. */
    const e = schritt('Jeder Bildschirm hat einen sichtbaren Weg zur Startseite');
    expect(e.hoehe_px as number).toBeGreaterThanOrEqual(44);
    expect(e.breite_px as number).toBeGreaterThanOrEqual(44);
  });
});

/* ── Der Lernpfad ────────────────────────────────────────────────────────
   Seit E-037 ist er ein Pfad und kein Kachelraster. Was ein Pfad leisten
   muss, ist nicht „schön aussehen", sondern: zeigen, wo man steht. Das
   heißt genau ein Wegweiser, erledigte Stufen als solche erkennbar, und der
   Weg an der Stelle, an der man ihn sucht. */

describe('Der Lernpfad zeigt, wo man steht', () => {
  const e = () => schritt('Der Lernpfad zeigt genau eine Stelle zum Weitermachen');

  it('hat für jedes Modul eine Stufe', () => {
    expect(e().stufen).toBe(9);
  });

  it('setzt genau einen Wegweiser', () => {
    /* Zwei Wegweiser sind keiner. Und keiner wäre schlimmer: Dann steht man
       vor neun gleichwertigen Möglichkeiten — genau der Zustand, den das
       Kachelraster vorher erzeugt hat. */
    expect(e().offen).toBe(1);
    expect(e().hinweise).toContain('Hier weiter');
  });

  it('ordnet erledigt, offen und später in dieser Reihenfolge', () => {
    /* Ein Wegweiser hinter einer noch gesperrten Stufe zeigte ins Nichts.
       Geprüft wird die Abfolge im Baum, nicht nur die Anzahl. */
    const folge = e().reihenfolge as string[];
    const ersteOffen = folge.indexOf('offen');
    expect(ersteOffen).toBeGreaterThanOrEqual(0);
    /* Vor dem Wegweiser nur Erledigtes … */
    for (const z of folge.slice(0, ersteOffen)) expect(z).toBe('fertig');
    /* … danach nichts Erledigtes mehr. */
    for (const z of folge.slice(ersteOffen + 1)) expect(z).not.toBe('fertig');
  });

  it('zeigt eine abgeschlossene Stufe als abgeschlossen', () => {
    expect(e().fertig).toBeGreaterThanOrEqual(1);
    expect(e().hinweise).toContain('Fertig');
  });

  it('stellt den Rang über den Weg', () => {
    /* Wer lernt, soll sehen, worauf er hinlernt. Der Rang stand vorher im
       Profil, zwei Wege entfernt. */
    expect(e().rang_steht_oben).toBe(true);
    expect(String(e().rang_text)).toMatch(/XP/);
  });

  it('stellt den Weg vor die Trainer', () => {
    /* Das war der Befund, der diese Änderung ausgelöst hat: Der Lernpfad —
       der Zweck dieses Bildschirms — stand hinter dreizehn Trainerkarten,
       3707 Pixel weit unten. Wer „Lernen" antippt, will wissen, wo er
       steht, nicht als Erstes eine Werkzeugliste. */
    expect(e().pfad_vor_den_trainern).toBe(true);
    expect(e().pfad_oben_px as number).toBeLessThan(844);
  });
});

describe('Ein Modul zeigt seinen Fortschritt', () => {
  const e = () => schritt('Das Modul zeigt Fortschritt und die nächste Lektion');

  it('nennt den Stand mit Gesamtzahl', () => {
    /* Hier steht ein Nenner, anders als auf der Startseite — und das ist
       kein Widerspruch zu E-032: Dort war „49 Lektionen" eine Zusage über
       Inhalt, den es noch nicht vollständig gibt. Ein Modul hat genau die
       Lektionen, die es hat. */
    expect(String(e().stand_text)).toMatch(/\d+ von \d+/);
  });

  it('markiert genau eine Lektion als die nächste', () => {
    expect(e().dran).toBe(1);
  });

  it('setzt die nächste Lektion hinter die erledigten', () => {
    const folge = e().zustaende as string[];
    const dran = folge.indexOf('dran');
    for (const z of folge.slice(0, dran)) expect(z).toBe('fertig');
  });

  it('sagt bei den offenen Lektionen, was sie einbringen', () => {
    /* Und nur bei den offenen: Hinterher ist es keine Auskunft mehr,
       sondern eine Erinnerung an etwas Erledigtes. */
    const hinweise = e().xp_hinweise as string[];
    expect(hinweise.length).toBeGreaterThan(0);
    for (const h of hinweise) expect(h).toMatch(/XP/);
  });

  it('lässt den Ring sprechen, statt ihn nur zu zeigen', () => {
    /* Ein Ring ist für einen Screenreader ein Bild und sonst nichts. */
    expect(String(e().ring_beschriftung)).toMatch(/\d+ von \d+/);
  });
});

/* ── Der Übungsstand ─────────────────────────────────────────────────────
   Seit E-038 führt jeder Trainer Serie, Trefferquote und Bestserie in
   derselben Leiste — und der Drill, der bisher gar keine führte, auch. */

describe('Der Übungsstand über den Trainern', () => {
  const e = () => schritt('Die Serie im Drill überlebt das Schließen');

  it('zeigt drei Werte: Serie, Trefferquote, Bestserie', () => {
    expect(e().felder).toBe(3);
  });

  it('nennt ohne Versuche keine Quote', () => {
    /* „0 %" nach null Aufgaben ist keine Auskunft, sondern ein Vorwurf. */
    expect(e().ohne_versuche_kein_prozent).toBe(true);
    expect(String(e().vorher)).not.toMatch(/%/);
  });

  it('zählt eine Antwort sofort mit', () => {
    expect(String(e().nach_zwei)).toMatch(/%/);
  });

  it('behält den Stand über ein Neuladen', () => {
    /* Das ist der Punkt. Der Drill war der einzige Trainer, dessen Ergebnis
       mit dem Bildschirm verschwand — eine Serie, die man nicht behalten
       kann, ist keine.

       Dieser Schritt hat beim ersten Lauf einen echten Fehler gefunden: Die
       Kennung hieß `potodds-drill`, und `sanitizeAppData` wirft beim Laden
       alles weg, was nicht nur aus Kleinbuchstaben besteht. Die Zahlen
       standen im Bildschirm, standen im Gerätespeicher — und waren nach dem
       Neuladen weg, ohne Fehlermeldung. `trainerkennungen.test.ts` ist das
       Netz, das jede künftige Kennung prüft. */
    expect(e().quote_bleibt).toBe(true);
    expect(e().nach_neuladen).toBe(e().nach_zwei);
  });
});

/* ── Der Übungstisch ─────────────────────────────────────────────────────
   Vom Auftraggeber gemeldet: „Der obere Spieler überdeckt auf einmal den
   River oder den Flop." Ursache war die Anordnung — Sitze an
   Prozentkoordinaten, die nach unten aus sich herauswachsen und irgendwann
   in die Mitte reichen. Seit E-040 sind es Bänder.

   Geprüft wird die Folge, nicht die Anordnung: Eine neue Anordnung, die
   denselben Fehler macht, fällt hier auf. */

describe('Der Übungstisch ist eine Spielansicht', () => {
  const e = () => schritt('Am Übungstisch überdeckt kein Sitz das Board');

  it('setzt fünf Gegner an den Tisch', () => {
    expect(e().sitze).toBe(5);
  });

  it('lässt keinen Sitz das Board überdecken', () => {
    /* Der gemeldete Fehler, als Zahl. */
    expect(e().sitz_ueber_board).toBe(0);
  });

  it('lässt keinen Sitz die eigene Hand überdecken', () => {
    expect(e().sitz_ueber_du).toBe(0);
  });

  it('zeigt Board und eigene Hand ohne Scrollen', () => {
    /* Ein Tisch, für den man scrollen muss, ist kein Tisch. */
    expect(e().board_ohne_scrollen).toBe(true);
    expect(e().du_ohne_scrollen).toBe(true);
  });

  it('zeigt fünf Board-Plätze, auch wenn erst drei liegen', () => {
    /* An einem echten Tisch sieht man, wie viele Karten noch kommen. */
    expect(e().board_plaetze).toBe(5);
  });

  it('macht die eigene Hand zur größten Darstellung auf dem Tisch', () => {
    /* Regel 10.8: Der Gegenstand ist keine Verzierung — und die eigene Hand
       ist der Gegenstand. Sie muss deutlich größer sein als die verdeckten
       Karten der Gegner, nicht nur ein bisschen. */
    const a = e().eigene_kartenbreite as number;
    const b = e().groesste_gegnerkarte as number;
    expect(a).toBeGreaterThanOrEqual(90);
    expect(a).toBeGreaterThan(b * 2);
  });

  it('legt die Entscheidung nach unten in den Daumenbereich', () => {
    expect(e().leiste_im_daumenbereich).toBe(true);
    expect(e().knoepfe as string[]).not.toHaveLength(0);
  });
});

/* ── Der Übungstisch: alles im Bild (FAHRPLAN 6.2, 6.3, 6.5) ────────────
   Vor E-093 verdeckte die Leiste bei 375 × 667 die halbe Hand und das eigene
   Namensschild, öffnete sich die Einsatzwahl hinter der Leiste, und der Coach
   riet vor dem Zug, statt danach zu bewerten. */

describe('Am Übungstisch liegt alles im Bild', () => {
  type Geraet = {
    dran: boolean;
    bild: {
      fenster: number;
      leiste: { oben: number; unten: number };
      schild: { oben: number; unten: number };
      karten: { oben: number; unten: number };
      board: { oben: number; unten: number };
      leiste_am_rand: boolean;
    };
    tipp_knopf: number;
    status_vorher: string;
    wahl: {
      vorgaben: string[];
      alle_im_bild: boolean;
      bestaetigen: string;
      leiste: { oben: number; unten: number };
      schild_unten: number;
      karten_unten: number;
    };
    mehr: string;
    wieder_weniger: string;
    noch_nicht_gesetzt: boolean;
    danach: { status: string; gesperrte_knoepfe: number; urteil: string[] };
  };
  const e = () => schritt('Am Übungstisch liegt alles im Bild: Hand, Einsatzwahl, Urteil') as unknown as {
    geraete: Record<'klein' | 'mittel' | 'breit', Geraet>;
    fold: { status_nach_fold: string; dauer_ms: number };
  };
  const geraete: Array<'klein' | 'mittel' | 'breit'> = ['klein', 'mittel', 'breit'];

  it('legt auf jedem Gerät das eigene Namensschild und die Karten über die Leiste', () => {
    /* Bei 375 × 667 lag das Schild zur Hälfte darunter. */
    for (const n of geraete) {
      const g = e().geraete[n];
      expect(g.dran, n).toBe(true);
      expect(g.bild.schild.unten, `${n}: Schild`).toBeLessThanOrEqual(g.bild.leiste.oben);
      expect(g.bild.karten.unten, `${n}: Karten`).toBeLessThanOrEqual(g.bild.leiste.oben);
      expect(g.bild.board.unten, `${n}: Board`).toBeLessThanOrEqual(g.bild.leiste.oben);
    }
  });

  it('lässt die Leiste auf dem Handy am unteren Rand stehen', () => {
    for (const n of ['klein', 'mittel'] as const) expect(e().geraete[n].bild.leiste_am_rand, n).toBe(true);
  });

  it('zeigt die Einsatzgrößen im Bild, jede mit ihrem Zielbetrag', () => {
    for (const n of geraete) {
      const w = e().geraete[n].wahl;
      expect(w.alle_im_bild, `${n}: alles im Bild`).toBe(true);
      expect(w.vorgaben.length, n).toBeGreaterThanOrEqual(4);
      for (const v of w.vorgaben) expect(v, `${n}: ${v}`).toMatch(/\d/);
      expect(w.vorgaben[w.vorgaben.length - 1], n).toMatch(/All-in/);
      expect(w.bestaetigen, n).toMatch(/^(Raise auf|Bet) \d/);
    }
  });

  it('lässt auch mit geöffneter Einsatzwahl die eigene Hand über der Leiste', () => {
    for (const n of geraete) {
      const w = e().geraete[n].wahl;
      expect(w.karten_unten, `${n}: Karten`).toBeLessThanOrEqual(w.leiste.oben);
    }
  });

  it('verändert den Betrag um einen Schritt und führt nichts ohne Bestätigung aus', () => {
    for (const n of geraete) {
      const g = e().geraete[n];
      expect(g.mehr, n).not.toBe(g.wahl.bestaetigen);
      expect(g.wieder_weniger, n).toBe(g.wahl.bestaetigen);
      expect(g.noch_nicht_gesetzt, n).toBe(true);
    }
  });

  it('zeigt den Tipp erst auf Wunsch', () => {
    for (const n of geraete) {
      const g = e().geraete[n];
      expect(g.tipp_knopf, n).toBeGreaterThan(0);
      expect(g.status_vorher, n).toBe('Du bist dran');
    }
  });

  it('lässt die Leiste nach dem Zug stehen, mit gesperrten Knöpfen und dem Namen dessen, der überlegt', () => {
    for (const n of geraete) {
      const d = e().geraete[n].danach;
      expect(d.gesperrte_knoepfe, n).toBe(3);
      expect(d.status, n).toMatch(/überlegt/);
    }
  });

  it('bewertet den Zug nach der Aktion — in drei Stufen', () => {
    for (const n of geraete) {
      const d = e().geraete[n].danach;
      expect(d.urteil.length, n).toBeGreaterThan(0);
      expect(d.urteil[0], n).toMatch(/Gut|Vertretbar|Fehler/);
    }
  });

  it('bietet nach dem eigenen Fold an, die Hand ohne Wartezeit zu Ende zu spielen', () => {
    expect(e().fold.status_nach_fold).toBe('Du hast gefoldet');
    /* Die Bots warten sonst 550–1250 ms je Aktion. */
    expect(e().fold.dauer_ms).toBeLessThan(2500);
  });
});

describe('Das private Gerät: der Lernbildschirm', () => {
  it('zeigt vor der Antwort keine Ergebniszahl', () => {
    /* Die Aufgabe steht da, das Ergebnis nicht. Der größte Text ist der Name
       des Zugbilds — nichts, was nach einer Zahl aussieht. */
    const e = schritt('Der Drill zeigt eine Aufgabe');
    const groesste = e.groesste as { klasse: string; px: number };
    expect(groesste.klasse).not.toMatch(/drill-zahl/);
    expect(e.knoepfe).toBe(2);
  });

  it('macht die Ergebniszahl um ein Vielfaches größer als den Fließtext', () => {
    /* Die Regel aus Phase 1, hier am gerenderten Ergebnis statt am Token. */
    /* Die Skala steht seit E-057 in `rem`; die Messläufe messen bei der
       Wurzelgröße 16, also wird hier damit umgerechnet. */
    const css = readFileSync('src/styles/global.css', 'utf8');
    const roh = css.match(/--fs-fliesstext:\s*([\d.]+)(px|rem)/)!;
    const fliesstext = Number(roh[1]) * (roh[2] === 'rem' ? 16 : 1);
    const e = schritt('Zwischen Eingabe und Ergebnis liegt nichts');
    expect(e.ergebnis_px as number).toBeGreaterThanOrEqual(fliesstext * 4);
  });

  it('lässt zwischen Eingabe und Ergebnis nichts liegen', () => {
    const e = schritt('Zwischen Eingabe und Ergebnis liegt nichts');
    expect(e.dauer_ms as number).toBeLessThan(300);
    expect(e.uebergang, 'Ein Übergang auf der Ergebniszahl ist eine Wartezeit '
      + 'mit besserem Namen').toBe('0s');
    expect(e.belebung).toBe('none');
  });

  it('lässt beim Antworten nichts unter dem Finger wegrutschen', () => {
    /* Ein Knopf, der sich beim Antworten verschiebt, ist schlimmer als eine
       Wartezeit: Man tippt daneben und weiß nicht, warum. */
    expect(schritt('Zwischen Eingabe und Ergebnis liegt nichts').knopf_bewegt_px).toBe(0);
  });

  it('zeigt als Ergebnis eine Zahl mit Einheit', () => {
    expect(String(schritt('Zwischen Eingabe und Ergebnis liegt nichts').ergebnis_text))
      .toMatch(/^\d+,\d\s?%$/u);
  });
});

describe('Beenden', () => {
  it('fragt nach, statt es einfach zu tun', () => {
    /* Ein Fehlgriff auf dem Tischgerät darf nicht den Abend beenden. */
    const e = schritt('Beenden fragt nach und tut es dann');
    expect(e.gefragt).toBe(true);
    expect(String(e.frage)).toMatch(/\?$/);
  });

  it('beendet danach wirklich und zeigt, was geblieben ist', () => {
    /* Nicht zurück ins Menü, sondern in die Liste der Abende: Der eben
       beendete Abend ist das Erste, was jemand danach sehen will — und es
       ist zugleich der Beweis, dass er nicht verloren ist. */
    const e = schritt('Beenden fragt nach und tut es dann');
    expect(e.abend_beendet).toBe(true);
    expect(e.adresse_danach).toBe('#/session/abende/ID?neu=1');
  });
});

/* ── Die mittleren Ebenen ────────────────────────────────────────────────
   Nachschlagen und Live-Session bestanden aus Karten mit einem Namen und
   einem Satz, der den Namen erklärte — sieben Absätze, zweieinhalb
   Bildschirme. Das Glossar war 30 219 Pixel hoch. Siehe E-042.

   Geprüft wird die Folge, nicht das Aussehen. */

describe('Der Nachschlagen-Bereich ist eine Übersicht', () => {
  const e = () => schritt('Der Nachschlagen-Bereich ist eine Übersicht, keine Strecke');

  it('zeigt alle sieben Wege auf dem Bezugsgerät ohne Scrollen', () => {
    expect(e().kacheln).toBe(7);
    expect(e().sichtbar_ohne_scrollen).toBe(7);
    expect(Number(e().unterkante_px)).toBeLessThanOrEqual(Number(e().fenster));
  });

  it('trägt auf jeder Kachel Inhalt statt einer Beschreibung', () => {
    expect(e().mit_inhalt).toBe(e().kacheln);
    /* Sieben Kacheln, sieben Inhaltszeilen. */
    /* Und mindestens ein paar zeigen den Gegenstand selbst: zwei Karten,
       das Raster der Eröffnungshände. */
    expect(e().mit_vorschau).toBeGreaterThanOrEqual(3);
  });

  it('holt die Zahlen aus den Daten', () => {
    /* Wer einen Begriff ergänzt, sieht die neue Zahl hier — und wer sie
       hinschreibt statt zu rechnen, fällt hier auf. */
    const zeilen = e().inhalte as string[];
    expect(zeilen.some((z) => /\d+ Begriffe/.test(z))).toBe(true);
    expect(zeilen.some((z) => /\d+ Tells/.test(z))).toBe(true);
    /* Der Anteil einer Range in Prozent, nicht als Anteil: „0 %" war der
       erste Versuch. */
    const range = zeilen.find((z) => z.includes('Button eröffnet'));
    expect(range).toBeDefined();
    expect(range).not.toMatch(/eröffnet 0 %/);
  });

  it('benutzt eine Bereichsfarbe, nicht sieben', () => {
    /* Regel 10.9. Vorher hatte jeder Eintrag seine eigene, und der
       Chip-Rechner stand in Rot da wie eine Fehlermeldung. */
    expect(e().symbolfarben).toBe(1);
  });
});

describe('Das Glossar ist ein Wörterbuch', () => {
  const e = () => schritt('Das Glossar ist ein Wörterbuch, keine Wand');

  it('zeigt jeden Begriff in einer Zeile statt in einem Absatz', () => {
    expect(e().eintraege).toBeGreaterThan(100);
    /* Eine Zeile Begriff plus eine Zeile Erklärung — nicht der ganze
       Absatz. Die Zahl ist die gemessene Höhe eines zugeklappten
       Eintrags; sie darf sinken, aber nicht wieder wachsen. */
    expect(e().erste_hoehe).toBeLessThanOrEqual(70);
  });

  it('ist keine Wand mehr', () => {
    /* Vorher: 30 219 Pixel bei 844 Pixeln Bildschirmhöhe — 36
       Bildschirmlängen Fließtext für ein Nachschlagewerk. */
    expect(e().seitenhoehe).toBeLessThan(15000);
  });

  it('gruppiert nach Anfangsbuchstaben', () => {
    /* Das unterscheidet ein Wörterbuch von einer Liste. */
    expect(e().buchstaben).toBeGreaterThan(15);
  });

  it('klappt einen Eintrag auf Tipp auf', () => {
    const nachTipp = e().nach_tipp as Record<string, unknown>;
    expect(e().aufgeklappt).toBe(0);
    expect(nachTipp.aufgeklappt).toBe(1);
    expect(Number(nachTipp.erste_hoehe)).toBeGreaterThan(Number(e().erste_hoehe));
    /* Und sagt es auch an, nicht nur optisch. */
    expect(nachTipp.angesagt).toBe('true');
  });
});

describe('Jeder Rückweg nennt einen Bereich, den es gibt', () => {
  const e = () => schritt('Kein Rückweg nennt einen Bereich, den es nicht gibt');

  it('schickt niemanden nach „Tools" zurück', () => {
    /* Fünf Werkzeugseiten trugen „← Tools" — einen Bereich, den die App
       seit dem Umbau auf Lernen / Nachschlagen / Live-Session (E-030) nicht
       mehr hat. Der Wegelauf sah nur, dass der Link ankommt, nicht, wohin
       er zu führen behauptet. */
    expect(e().unbekannte_bereiche).toEqual([]);
  });

  it('lässt keine Unterseite ohne Rückweg', () => {
    expect(e().ohne_rueckweg).toEqual([]);
  });
});

/* ── Was der erste Start kostet ──────────────────────────────────────────
   Firebase wiegt gebaut 706 kB (rund 213 kB übertragen) und wurde bis
   E-043 bei jedem Start geholt — auch bei jemandem, der sich nie anmeldet
   und die App nur zum Üben benutzt. Siehe E-043. */

describe('Die Startseite lädt nichts, was sie nicht braucht', () => {
  const e = () => schritt('Die Startseite lädt nichts, was sie nicht braucht');

  it('holt genau eine Datei', () => {
    /* Vorher waren es fünf: das Programm und vier Firebase-Teile. */
    expect(e().dateien_startseite).toBe(1);
  });

  it('holt das Konto trotzdem, sobald jemand es aufruft', () => {
    /* Der Preis der Verzögerung darf nicht sein, dass die Funktion fehlt.
       In den Einstellungen erscheint die Kontokarte, und dafür wird Firebase
       nachgeladen — vier Dateien, dieselben wie vorher. */
    expect(e().dateien_nach_profil).toBeGreaterThan(0);
    expect(e().kontokarte_da).toBe(true);
  });
});

/* ── Quer gehalten ───────────────────────────────────────────────────────
   Ein Gerät, auf dem ein Pokertisch liegt, hält man quer. Bei 844 × 390 lag
   der Tisch 564 Pixel hoch im Bild: Die Gegner waren vollständig über dem
   Bildrand, das Board zur Hälfte. Siehe E-044. */

describe('Quer gehalten sieht man den ganzen Tisch', () => {
  const e = () => schritt('Quer gehalten sieht man den ganzen Tisch');

  it('zeigt alle fünf Gegner über der Entscheidungsleiste', () => {
    expect(e().sitze).toBe(5);
    expect(e().sitze_ueber_der_leiste).toBe(5);
  });

  it('zeigt Board und eigene Karten über der Entscheidungsleiste', () => {
    /* Man soll nicht entscheiden müssen, ohne zu sehen, worauf. */
    expect(e().board_ueber_der_leiste).toBe(true);
    expect(e().eigene_karten_ueber_der_leiste).toBe(true);
  });

  it('lässt die eigene Hand auch quer die größte Darstellung sein', () => {
    /* Regel 10.8 gilt in jeder Ausrichtung. Quer werden beide kleiner —
       die Rangfolge bleibt. */
    expect(Number(e().eigene_kartenbreite))
      .toBeGreaterThan(Number(e().boardkartenbreite));
  });

  it('läuft nicht seitlich über', () => {
    expect(e().seitlicher_ueberlauf).toBe(0);
  });

  it('macht den Tisch quer flacher, nicht nur schmaler', () => {
    /* Vorher 564 Pixel bei 390 Pixeln Bildhöhe. */
    expect(Number(e().filz_hoehe)).toBeLessThan(280);
  });
});

describe('Auszahlung und Bankroll (E-094)', () => {
  const a = () => schritt('Auszahlung: Tippen verfälscht nichts, der Text passt zur Tabelle');
  const b = () => schritt('Bankroll: Liste vor dem Formular, Löschen mit Rückgängig');

  it('lässt beim Tippen stehen, was getippt wurde', () => {
    /* Das Feld klemmte vorher bei jeder Eingabe: Wer „12" tippte, sah nach der
       „1" schon die „2" (Mindestwert). */
    expect(a().nach_eins_getippt).toBe('1');
    expect(a().nach_zwoelf_getippt).toBe('12');
  });

  it('rechnet mit Komma und zeigt das Geld in der gewählten Einheit', () => {
    expect(a().topf_in_euro).toBe(true);
    expect(a().einheit_chips).toBe(true);
  });

  it('nennt die Staffel aus der Tabelle statt einer Faustregel, die nicht stimmt', () => {
    expect(a().plaetze_bei_12).toBe(true);
    expect(a().staffel_genannt).toBe(true);
    expect(a().alte_faustregel_da).toBe(false);
  });

  it('sagt es, wenn ein Feld keine Zahl enthält', () => {
    expect(a().fehler_bei_buchstaben).toBe(1);
  });

  it('übernimmt Spieler, Einsatz und Rebuys aus dem laufenden Abend', () => {
    const e = schritt('Auszahlung übernimmt den laufenden Abend');
    expect(e.angeboten).toBe(1);
    expect(e.spieler).toBe('5');
    expect(Number(e.buyin)).toBeGreaterThan(0);
    // Im Durchgang kauft eine Person einmal nach.
    expect(e.rebuys).toBe('1');
    // Ohne Euro-Einsatz im Abend rechnet der Rechner in Chips.
    expect(e.einheit_chips).toBe('true');
  });

  it('trägt die ruhige Spielerschutz-Zeile', () => {
    expect(a().spielerschutz_zeile).toBe(true);
  });

  it('zeigt beim ersten Besuch das Formular, danach zuerst die Liste', () => {
    expect(b().erstes_formular_offen).toBe(true);
    const n = b().nach_speichern as Record<string, unknown>;
    expect(n.formular_zu).toBe(true);
    expect(n.knopf).toBe(true);
    expect(n.zeilen).toBe(1);
  });

  it('beginnt mit Art „Live" und ohne erfundenes Spiel', () => {
    expect(b().art_vorbelegt_live).toBe('true');
    expect(b().spiel_leer).toBe(true);
  });

  it('schreibt das Datum in der Sprache, nicht als 2026-10-02', () => {
    expect((b().nach_speichern as Record<string, unknown>).datum_iso).toBe(false);
  });

  it('löscht mit fünf Sekunden Rückweg — und danach wirklich', () => {
    const l = b().nach_loeschen as Record<string, unknown>;
    expect(l.zeilen).toBe(0);
    expect(l.rueckgaengig).toBe(true);
    expect(b().nach_rueckgaengig).toBe(1);
    expect(b().nach_ablauf_und_neuladen).toBe(0);
  });
});

describe('Profil, Einstellungen und Konto (E-095)', () => {
  const profil = () => schritt('Profil: Identität und Fortschritt, Einstellungen hinter dem Zahnrad');
  const einst = () => schritt('Einstellungen: gruppiert, Zurücksetzen zuletzt und mit „Vorher sichern?“');
  const konto = () => schritt('Kontokarte: kein Sprung, Google-Knopf nach Vorgabe, gleichwertige Wahl');

  it('nennt ein Profil ohne Namen „Profil 1“ und gibt ihm einen Buchstaben statt „?“', () => {
    const l = profil().leer as Record<string, unknown>;
    expect(l.name).toBe('Profil 1');
    expect(l.avatar).toBe('P');
  });

  it('ist kurz: Identität und Fortschritt, nicht 5280 Pixel Sammelseite', () => {
    const l = profil().leer as Record<string, unknown>;
    expect(Number(l.hoehe)).toBeLessThan(2200);
    expect(l.namensfeld, 'Das Namensfeld gehört in die Einstellungen').toBe(0);
    expect(l.zuruecksetzen, 'Zurücksetzen gehört in die Einstellungen').toBe(0);
  });

  it('führt mit einem Zahnrad zu den Einstellungen', () => {
    expect((profil().leer as Record<string, unknown>).zahnrad).toBe('Einstellungen');
    const z = profil().ziel as Record<string, unknown>;
    expect(z.adresse).toBe('#/profil/einstellungen');
    expect(z.ueberschrift).toBe('Einstellungen');
  });

  it('zeigt die nächsten drei Abzeichen und zählt den Rest in einer Zeile', () => {
    const l = profil().leer as Record<string, unknown>;
    expect(l.naechste).toBe(3);
    expect(l.medaillen_verdient).toBe(0);
    expect(String(l.offen_zeile)).toBe('Noch 22 Abzeichen zu entdecken');
    expect(l.emoji_in_abzeichen, 'Medaillen sind Zeichen aus dem eigenen Satz').toBe(false);
  });

  it('zeigt auch bei vielen verdienten höchstens sechs, das neueste zuerst', () => {
    const v = profil().viele as Record<string, unknown>;
    expect(v.verdient).toBe(6);
    expect(v.erstes).toBe('Trainingsfleiß');
    expect(String(v.weitere)).toBe('3 weitere verdient');
  });

  it('öffnet mit „Alle ansehen“ die ganze Sammlung, die Offenen als Umriss', () => {
    const a = profil().alle as Record<string, unknown>;
    expect(a.stuecke).toBe(22);
    expect(a.offene).toBe(22 - 9);
    expect(a.ausgeklappt).toBe('true');
  });

  it('gruppiert die Einstellungen und stellt die Daten ans Ende', () => {
    expect(einst().gruppen).toEqual([
      'Konto', 'Profil auf diesem Gerät', 'Darstellung', 'App', 'Über PokerMentor', 'Daten',
    ]);
  });

  it('hat die zerstörende Aktion als letztes Bedienelement der Seite', () => {
    expect(einst().reset_ist_letztes_bedienelement).toBe(true);
  });

  it('fragt „Vorher sichern?“ und bietet das Backup in der Bestätigung an', () => {
    const f = einst().frage as Record<string, unknown>;
    expect(f.titel).toBe('Vorher sichern?');
    expect(f.knoepfe).toEqual(['Erst Backup herunterladen', 'Ja, alles löschen', 'Abbrechen']);
    expect(einst().abgebrochen_ok).toBe(true);
  });

  it('fragt keine E-Mail-Adresse fürs Profil mehr ab', () => {
    expect(einst().email_feld).toBe(0);
  });

  it('hält der Kontokarte den Platz frei, sodass nichts springt', () => {
    const k = konto();
    const karte = k.karte as Record<string, unknown>;
    expect(Math.abs(Number(k.platzhalter_hoehe) - Number(karte.hoehe))).toBeLessThanOrEqual(24);
  });

  it('gestaltet den Google-Knopf neutral und nicht als Hauptknopf', () => {
    const karte = konto().karte as Record<string, unknown>;
    expect(karte.google_ist_hauptknopf).toBe(false);
    expect(karte.google_g_farben).toBe(4);
    expect(String(karte.google_flaeche)).toMatch(/^rgb\((255, 255, 255|19, 19, 20)\)$/);
    expect(Number(karte.google_hoehe)).toBeGreaterThanOrEqual(44);
  });

  it('stellt „Anmelden“ und „Neues Konto“ gleichwertig nebeneinander', () => {
    const karte = konto().karte as { tabs: Array<{ text: string; breite: number }> };
    expect(karte.tabs.map((t) => t.text)).toEqual(['Anmelden', 'Neues Konto']);
    expect(karte.tabs[0].breite).toBe(karte.tabs[1].breite);
    const neu = konto().neu as Record<string, unknown>;
    expect(neu.titel).toBe('Konto erstellen');
    expect(neu.name_feld).toBe(1);
  });

  it('zeigt Feedback-Link, Google und „Neues Konto“ nur mit hinterlegten Anbieterangaben', () => {
    expect(konto().feedback_mit_adresse).toBe(1);
    const o = konto().ohne_anbieter as Record<string, unknown>;
    expect(o.google).toBe(0);
    expect(o.umschalter).toBe(0);
    expect(o.feedback).toBe(0);
  });
});
