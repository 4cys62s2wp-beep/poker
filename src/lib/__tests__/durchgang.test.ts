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
    expect(D.schritte.length).toBeGreaterThanOrEqual(29);
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
    expect(e.laeuft).toBe(true);
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
    expect(e.adresse_danach).toBe('#/session/abende');
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
    const e = schritt('Nach dem Neuladen steht die Farbe vor dem ersten Zeichnen fest');
    expect(e.bei_domcontentloaded).toBe(e.spaeter);
    expect(e.skript_vor_stilblatt, 'Das Skript muss vor dem Stilblatt stehen').toBe(true);
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
    const css = readFileSync('src/styles/global.css', 'utf8');
    const fliesstext = Number(css.match(/--fs-fliesstext:\s*([\d.]+)px/)![1]);
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
    expect(e.adresse_danach).toBe('#/session/abende');
  });
});
