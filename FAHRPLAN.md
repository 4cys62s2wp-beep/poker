# Fahrplan: PokerMentor professioneller machen

Entstanden am 3. Oktober 2026 aus einer Durchsicht der ganzen App: acht Gutachter mit je eigenem
Blickwinkel (visuelles Design, Struktur und Erststart, Lernerlebnis, Übungstisch und Trainer,
Live-Session, Geräte und PWA, Texte, Vertrauen und Marke) haben jeden Bildschirm an Fotos und im
Code geprüft und 111 Befunde gemeldet. Je Blickwinkel hat ein skeptischer Prüfer jeden Befund
nachgeprüft — echt? schon erledigt? bewusst anders entschieden? lohnt es? 108 haben bestanden.
Daraus sind die Pakete unten verdichtet; eine Vollständigkeitskritik hat danach noch Lücken ergänzt.

Jeder Punkt wird beim Umsetzen abgehakt: `[ ]` offen, `[x]` erledigt (mit Commit).

Wirkung 1–5 (5 = macht die App spürbar professioneller), Aufwand S/M/L.

## Warum diese Reihenfolge

Die Reihenfolge folgt der Hebelwirkung. Paket 1 (Design-Fundament) und Paket 2 (Rahmen und Navigation) ändern Tokens, Bausteine und den Seitenrahmen. Davon profitiert jeder Bildschirm auf einmal, und alle späteren Pakete bauen darauf auf: Aktionsfarben, Bereichsfarbe, Rückmeldungs-Baustein, Spielkarten, Breiten-Tokens, die klebende Kopfzeile und die Tabelle Route → Name. Würde man die Kernerlebnisse vorher umbauen, müsste man sie danach ein zweites Mal anfassen. Paket 3 (Marke, App-Hülle, Vertrauen) kommt direkt danach, weil es den ersten Eindruck bestimmt: unsichtbares Logo im hellen Modus, Entwicklertexte, Konto ohne Löschweg, Impressum ohne Adresse. Die Punkte sind meist klein, wirken aber stark. Darauf folgen die Kernerlebnisse in der Reihenfolge, in der Nutzer sie treffen. Zuerst die Startseite (4), weil sie bei jedem Öffnen erscheint und die Tagesserie trägt. Dann Lernen (5), Übungstisch und Trainer (6) sowie die Live-Session (7). Ausnahme bei der Dringlichkeit: Punkt 7.1 behebt einen echten Datenverlust und kann vorgezogen werden, weil er von nichts abhängt. Danach kommen Profil und Einstellungen (8), die auf den Kontoregeln aus Paket 3 und der Seitenleiste aus Paket 2 aufbauen, und zuletzt der Feinschliff in Nachschlagen, Desktop-Bedienung und Texten (9). Bewusst nicht im Fahrplan stehen, weil keine ausreichende Begründung gegen die bestehenden Entscheidungen vorliegt: die Tab-Leiste auf dem Handy (E-032, DESIGN §10; die klebende Kopfzeile löst das Kernproblem ohne Bruch), ein Vollbild-Tisch, Fast-Fold und Tempo-Optionen (E-010/E-030), FCM-Push (E-036, kein Server), Animationen zwischen Eingabe und Ergebnis (DESIGN §4/8a.2), eine Gewinnbilanz am Übungstisch (E-010), das Fortschreiben der Blindstruktur über die letzte Stufe hinaus (blinds.ts), das Umbenennen des Bereichs in „Pokerabend“ (E-011) und das Teilen des Lernpfads in Haupt- und Nebenpfad (10a.2). Drei Fragen kann Code nicht beantworten, sie müssen dem Auftraggeber vorgelegt werden: Anbieterangaben und Altersaussage (TODO_MANUELL Nr. 1/2, E-010), die Euro-Abrechnung zwischen Privatleuten (E-010/E-030) und ob Gold nur noch für Belohnungen stehen soll (neue E-Nummer).

## Paket 1 · Design-Fundament: Farbrollen, Schrift, Flächen, Spielkarten, Bausteine und eine Begriffsliste

**Ziel:** Jeder Bildschirm wirkt aus einem Guss: Farbe trägt wieder Bedeutung, Text ist lesbar, Karten sind eindeutig, und dieselbe Sache sieht überall gleich aus und heißt überall gleich.  
**Baut auf:** —

### [x] 1.1 Farbrollen festlegen und Gold entlasten, Bereichsfarbe auf die Bereichsseiten bringen  
*Wirkung 5 · Aufwand L*

Zuerst in DESIGN.md den Widerspruch zwischen §2 (eine Akzentfarbe, Z. 86ff.) und Regel 10.9 (Bereichsfarbe, Z. 631) mit einer neuen E-Nummer auflösen. Die farbigen Startkarten sind laut E-042 gewollt und bleiben. Ob Gold nur noch für Belohnungen (XP, Rang, Abzeichen) steht, entscheidet der Auftraggeber. Dann in global.css: (a) Auswahlzustand app-weit als neutrale Fläche plus Rand in --text, nie im Hauptknopf-Stil (Live-Coach-Segmente, „Deutsch“ im Willkommensdialog). (b) .btn.primary (global.css 855–860) als flache Fläche ohne Verlauf und Glow; E-034 erlaubt das, weil Knopfflächen eigene Tokens sind. (c) data-bereich am .modus-rahmen nach Pfadpräfix; .eyebrow (global.css 724, heute fest auf var(--auszeichnung)), der aktive .nav-link und BackLink lesen var(--bereich). Damit verschwindet das goldene „LIVE-SESSION“ und „NACHSCHLAGEN“, ein Verstoß gegen 10.9, den E-036 unter „noch nicht getan“ selbst aufführt. (d) Glow-Schatten an Fortschrittsbalken entfernen. Vorher- und Nachher-Fotos in hell und dunkel. Die Rangfarben für Daten kommen in Punkt 1.6.

<details><summary>Belege</summary>

- B1: mobil-dunkel/start.png, mobil-dunkel/lernen.png, mobil-dunkel/session.png, mobil-dunkel/nachschlagen_coach.png, mobil-dunkel/nachschlagen_ranges.png, zustaende/tagesquiz.png, zustaende/trainer-equity.png; global.css 855–860, 4405–4412; trainerliste.ts (5 Icon-Töne)
- B24: mobil-dunkel/nachschlagen.png, mobil-dunkel/session.png, mobil-dunkel/start.png; global.css Z. 724 (.eyebrow); E-036 „Bereichsfarben stehen bisher nur auf der Startseite“
- B15: Glow-Schatten an Fortschrittsbalken und Goldknöpfen (global.css box-shadow)

</details>

### [x] 1.2 Schriftskala durchsetzen: keine Mini-Größen, lesbarer Fließtext, Serife nur für Titel, Versalien nur für kurze Etiketten  
*Wirkung 5 · Aufwand M*

Die 34 festen font-size-Werte in global.css (darunter 0.4375rem, 0.5rem, 0.53125rem, 0.5625rem) und die 48 Inline-fontSize-Angaben in TSX auf die fünf Tokens zurückführen; die Sperrklinke npm run streuung lässt danach für font-size nur noch Tokens zu. Angaben, die für eine Entscheidung gebraucht werden, nie im Kleingedruckten: .heute-frage .lage („Er setzt 32 in 96“) in Fließtextgröße und --text. Fließtext von 15 auf 16 px (1rem) als neue E-Nummer zu DESIGN §1. Das widerspricht der bewussten Festlegung, der Nutzen überwiegt aber klar: 45.169 Wörter Lektionstext werden in dieser Größe gelesen. .prose auf max-width 65ch begrenzen, statt 730 px mit rund 95 Zeichen pro Zeile. Regel in DESIGN.md: Fraunces nur für Seiten- und Abschnittstitel ab --fs-ueberschrift; „Du“, .uebungsstand .zahl, Levelring, „50 %“ im Equity-Schätzer und .handwahl-knopf in Manrope mit tabular-nums. Ein Test verbietet --font-display unterhalb der Überschriftstufe. Versalien nur für Etiketten mit höchstens drei Wörtern; Fragen wie „WIE VIELE SPIELER SITZEN AM TISCH (MIT DIR)?“ in Satzschreibung. Handnotation im Starthand-Explorer (howToPlay „SO SPIELST DU AKS“) als span mit text-transform:none; das ist ein Bedeutungsfehler und kommt zuerst.

<details><summary>Belege</summary>

- B2: mobil-dunkel/start.png, mobil-dunkel/lernen.png, mobil-dunkel/nachschlagen.png, desktop/lernen_m1_m1-l1.png, eigen/lek_desk_0.png; --fs-kleingedrucktes 39× direkt + 7× über --fs-tiny
- B10: mobil-dunkel/start.png, mobil-dunkel/nachschlagen_haende.png, eigen/coach_karten.png, zustaende/trainer-equity.png, zustaende/live-laufend.png, mobil-dunkel/lernen.png; 21 CSS-Regeln mit --font-display
- B95: mobil-dunkel/nachschlagen_haende.png, mobil-dunkel/nachschlagen_coach.png, mobil-dunkel/nachschlagen_equity.png

</details>

### [x] 1.3 Flächen, Radien, Schatten und Inhaltsbreiten als Tokens  
*Wirkung 3 · Aufwand M*

Die 24 border-radius-Werte in global.css (4–56 px, Knöpfe mit 9, 12 und 13 px) auf die vier vorhandenen Radius-Tokens zurückführen, die 19 box-shadow-Werte auf Flächenstufen. npm run streuung um radius und shadow erweitern. Die Kartenfläche eine Stufe vom Seitengrund absetzen; heute sind es 1,12:1 (dunkel) bzw. 1,09:1 (hell), allein über Ränder mit Alpha 0,075. In beiden Modi messen. Breiten-Tokens Lesen, Standard und Weit anlegen; Paket 2 setzt sie ein.

<details><summary>Belege</summary>

- B15: desktop/start.png, desktop/lernen.png, desktop/nachschlagen.png, desktop/lernen_drill.png, zustaende/tagesquiz.png (schwebende Karte hell), mobil-dunkel/lernen.png

</details>

### [x] 1.4 Spielkarten auf Lesbarkeit bauen: keine „6“ auf einer 9, größere kleine Karten  
*Wirkung 5 · Aufwand M*

In PlayingCard.tsx 46–53 und global.css 985–991 den gedrehten Unterindex dort weglassen, wo Karten überlappen oder angeschnitten sind (eigene Hand am Tisch, Showdown, Drill, Hand des Tages, Trainer). Wo er bleibt, 6 und 9 in beiden Indizes unterstreichen (data-rang). Gegenentscheidung: E-036 bzw. DESIGN 10.8 (Z. 626) und E-034 wollen den zweiten Index bewusst „wie auf einer echten Karte“. Der Nutzen überwiegt klar, weil er heute an fünf Stellen eine 9 als 6 zeigt, ausgerechnet auch im Handranking-Trainer. Als Änderung der E-Nummer festhalten. .pcard.sm (global.css 1877–1880, heute 28×40 px mit 8,5-px-Rang und 7-px-Farbe) auf mindestens 32×44 px, Rang ≥ 0.75rem, ohne Mittelsymbol. Rangwahl in Live-Coach und Starthand-Explorer einheitlich mit „10“ als Taste; Kürzel wie „ATo“ bleiben.

<details><summary>Belege</summary>

- B3: eigen/tisch_vp_dunkel.png (9♦ zeigt „6“, J♠ wie „ſ“), zustaende/tisch-hand.png, eigen/coach_karten.png, mobil-dunkel/nachschlagen_haende.png, mobil-dunkel/start.png
- B48: eigen/tisch/showdown-0.png (6♦/9♠ vertauscht), eigen/drill_antwort_dunkel.png, mobil-dunkel/lernen_trainer_pushfold.png (K9o), mobil-dunkel/lernen_trainer_handranking.png; global.css 3239 (10 px Überlappung)
- B47: eigen/tisch/showdown-0.png (Gegnerkarten in sm kaum lesbar)

</details>

### [x] 1.5 Ein Symbol pro Ziel, kein Spielautomat  
*Wirkung 4 · Aufwand M*

Doppelvergaben in Icon.tsx auflösen, dafür 6–8 neue Symbole (Tisch, Rangliste, Verlauf, Pokal, Münze, Kalender): 'play'/red bei Handranking-Trainer und Übungstisch; 'chart' bei Equity-Schätzer, Spielstil und Odds; 'crown' bei Frühere Abende und Auszahlung (SessionPage.tsx 76/87); 'chip' bei Pro-Insights und Chip-Rechner (Layout.tsx 40/54); 'scale' dreifach. Ein Test verbietet gleiche Paare aus Icon und Ton in Layout.tsx, trainerliste.ts und LearnPage.tsx. 🎰 bei „Grinder“ und Modul Live-Poker sofort ersetzen, weil es dem Glücksspiel-Verzicht widerspricht. Die SVG-Medaillen für Abzeichen folgen in Paket 8.

<details><summary>Belege</summary>

- B5: mobil-dunkel/lernen.png (zwei identische Kacheln), mobil-dunkel/session.png, eigen/profil_d_1.png, eigen/profil_h_2.png, desktop/start.png; badges.ts
- B67: Kronen-Symbol doppelt bei „Frühere Abende“ und „Auszahlung“

</details>

### [x] 1.6 Gemeinsame Bausteine: Rückmeldung, Aktionsfarben, Leerzustand, Laden  
*Wirkung 4 · Aufwand M*

(1) Eine Komponente <Rueckmeldung> mit Icon aus Icon.tsx statt ✓/✗ als Textzeichen. Wörter festlegen: „Richtig“, „Nicht ganz“, „Hauchdünn“. Ersetzt die sieben Varianten in quiz.ts, review.ts, handranktrainer.ts, pushfoldtrainer.ts, equitytrainer.ts, Drill und Szenario. Damit gilt Regel 11.4 auch in ReviewPage.tsx:152 und PushFoldTrainer.tsx:112, wo heute nur die Farbe unterscheidet. Pfeile aus den Weiter-Strings entfernen. (2) Drill: Die Equity-Zahl in PotOddsDrill.tsx 263 in --text, das Urteil „lohnt nicht“ als farbige Marke mit Zeichen daneben. Das ist eine Änderung an E-026; der Nutzen überwiegt, weil heute ein lachsrotes „27,8 %“ neben „✓ Richtig“ steht. Keine Animation (DESIGN §4). (3) Aktions- und Range-Tokens --range-raise, --range-call und --range-fold, passend zur Legende der Range-Matrix, für Tisch, Trainer und Charts. (4) Die vorhandene EmptyState auf Frühere Abende, Freunde und Wiederholen einsetzen. In den Profilkacheln bleibt der Strich (E-038), darunter kommt der Link „Erste Aufgabe lösen →“. (5) Im Starthand-Explorer statt „berechne …“ ein Platzhalter in Endhöhe mit gedämpftem „–– %“.

<details><summary>Belege</summary>

- B88: eigen/quiz_falsch_dunkel.png, eigen/drill_antwort_dunkel.png, eigen/heute_antwort_dunkel.png, mobil-dunkel/lernen_trainer_preflop.png
- B8: eigen/drill_antwort_dunkel.png (✓ Richtig neben roter 27,8 %), eigen/quiz_falsch_dunkel.png, eigen/coach_karten.png, eigen/tisch_vp_dunkel.png
- B51: Matrix-Legende Raise gold/Call grün/Fold grau, am Tisch Fold rot
- B12: Raise-Zellen in Auszeichnungs-Gold (.matrix .cell.raise)
- B9: mobil-dunkel/lernen_statistik.png, mobil-dunkel/lernen_wiederholen.png, mobil-dunkel/session_abende.png, mobil-dunkel/freunde.png, eigen/profil_d_0.png, eigen/ha_d_1.png
- B93: „berechne …“ gegen „Rechne …“, „Daten werden geladen …“

</details>

### [x] 1.7 Eine Begriffsliste mit Test: jede Pokeraktion hat genau ein Wort  
*Wirkung 5 · Aufwand M*

src/i18n/begriffe.ts mit bevorzugten und verbotenen Begriffen anlegen, dazu einen Test nach dem Muster von typografie.test.ts über alle de-Strings. Zuerst die Fälle, in denen ein Bildschirm zwei Wörter benutzt: Live-Coach-Umschalter „Noch kein Raise“ / „Jemand hat erhöht“ (coach.ts), Übungstisch-Knopf „Raise …“ gegen Verlauf „erhöht auf 7“ (play.ts, engine.ts:115), Push/All-in/Shove/schieben (pushfoldtrainer.ts), Topf/Pot (potoddsdrill.ts gegen potoddstrainer.ts). Danach Flushdraw (82/13/9 Schreibweisen), Überkarten/Overcards, KI-Gegner/Computergegner, Dealer-Button/Dealer-Knopf. Die Drill-Zugbilder in tools/poker-math umbenennen und npm run daten laufen lassen, nicht die JSON von Hand ändern (E-020). „folded“ zu „foldet“ (stats.ts hints.wtsd.low). Fortschrittswörter: „Stufe“ für die Zahl, „Rang“ für den Titel, „Serie“ statt „Streak“, „Pro“ nur für das Abo; die Marke „Profi“ an Modul 5 („Fortgeschrittene Konzepte“) in „Experte“ ändern oder das Modul umbenennen.

<details><summary>Belege</summary>

- B83: mobil-dunkel/nachschlagen_coach.png, zustaende/tisch-hand.png, mobil-dunkel/lernen_trainer_pushfold.png, zustaende/drill-frage.png, mobil-dunkel/nachschlagen_odds.png, mobil-dunkel/lernen_trainer_potodds.png; public/pokermath/b1_outs.json, oddstables.ts
- B94: eigen/sprache/lernen_0.png, lernen_1.png, lernen_3.png, profil_0.png, profil_2.png, desktop/lernen_uebungstisch.png; learn.ts rangRing

</details>

### [x] 1.8 Regeln für Augenbraue und Untertitel: Nutzen statt Designbegründung  
*Wirkung 3 · Aufwand S*

Regel in DESIGN.md: Die Augenbraue nennt den Bereich oder entfällt; kein Englisch, keine Slogans. Weg fallen „SPACED REPETITION“, „DEIN CURRICULUM“, „TURNIER-ENDGAME“, „WISSEN WIRD KÖNNEN“, und dort, wo darüber schon „← Nachschlagen“ steht, entfällt die Wiederholung. Untertitel, die das Design begründen, ersetzen: nachschlagen.ts „Such oder tipp – zwei Schritte …“, abende.ts listeSub „Getippt wird auf einen Namen …“, Session-Karte „Bevor gespielt wird, nicht danach“. Die Belehrung im Bankroll („Wer seine Ergebnisse nicht kennt …“) ersetzen. Die Stimme durchgehend in der Du-Form statt „wir“ und „die App“. printHint in payout.ts bleibt, weil er eine Handlungsanweisung ist.

<details><summary>Belege</summary>

- B92: mobil-dunkel/nachschlagen.png, mobil-dunkel/nachschlagen_glossar.png, mobil-dunkel/session.png, mobil-dunkel/session_bankroll.png, mobil-dunkel/lernen_wiederholen.png, mobil-dunkel/lernen_trainer_szenario.png
- B6: Augenbraue wiederholt nur den Bereich, Titel „Lernpfad“ erst bei ~180 px

</details>

## Paket 2 · Rahmen und Navigation: auf Handy und Desktop jederzeit wissen, wo man ist

**Ziel:** Von jeder Scrolltiefe und auf jedem Gerät ist der Rückweg einen Tipp entfernt, Zurück führt an die Stelle, an der man war, und Desktop und Tablet nutzen ihre Breite statt einer linksbündigen Handyspalte.  
**Baut auf:** 1

### [x] 2.1 Klebende Kopfzeile mit Ort, Rückweg und Lesefortschritt  
*Wirkung 5 · Aufwand M*

.mobile-top (global.css ab Z. 655, Layout.tsx Z. 184, heute position: static) wird position: sticky; top: 0, mit safe-area und deckendem --bg; der Haarstrich erscheint erst nach dem Scrollen. Nach dem Scrollen zeigt eine kompakte Mittelzeile „‹ Bereich · Seitentitel“, der Titel kommt aus der titles-Tabelle in Layout.tsx. In Lektionen kommt ein 2-px-Lesefortschritt dazu. Für Sprungziele scroll-margin-top setzen. Die Kopfzeile wird beim Scrollen nicht aus- und eingeblendet. Danach die Startseite mit npm run daumen nachmessen (Regel 10.1). Eine Tab-Leiste kommt nicht in den Fahrplan: E-032 und DESIGN §10 schließen sie ausdrücklich aus, und den Hauptnutzen, den Rückweg aus der Tiefe einer langen Seite, liefert die klebende Kopfzeile ohne diesen Bruch. DESIGN 9a.2 bevorzugt sticky ausdrücklich.

<details><summary>Belege</summary>

- B16: mobil-dunkel/lernen_m1_m1-l1.png, mobil-dunkel/nachschlagen_glossar.png, eigen/lektion-mitte.png, eigen/glossar-mitte.png, desktop/start.png; Seitenhöhen: Lektion 5612 px, Glossar 11.425 px, Tells 6679 px, Profil 5280 px
- B71: eigen/plattform/lektion-gescrollt.png, eigen/lektion-mitte.png, mobil-dunkel/profil.png; Regel 10.3
- B20: eigen/lektion-mitte.png (kein Titel, kein Stand)

</details>

### [x] 2.2 Scrollposition: neue Seiten oben, Zurück an die alte Stelle  
*Wirkung 4 · Aufwand S*

history.scrollRestoration = 'manual'. Bei PUSH auf 0 scrollen und den Fokus auf die h1 (tabIndex=-1) legen. Bei POP die gespeicherte Position erst nach dem Rendern wiederherstellen (useLayoutEffect plus requestAnimationFrame), weil lazy geladene Seiten sonst auf 0 klemmen. Ein Test prüft /lernen → Trainer → zurück in beide Richtungen. Zusätzlich ruft PlayPage beim startSession() scrollTo(0,0) auf.

<details><summary>Belege</summary>

- B19: eigen/pros-nach-klick.png (Pro-Insights öffnet bei scrollY 2836), mobil-dunkel/lernen.png; scrollTo nur in LessonPage.tsx
- B44: eigen/tisch/mob-klein-6max.png (Tisch öffnet bei scrollY 343)

</details>

### [x] 2.3 Ein Zurück-Baustein und ein Name pro Ort  
*Wirkung 4 · Aufwand S*

Eine Tabelle Route → Name, abgeleitet aus layout.ts, mit den Kurzformen „Suchen“ und „Du“ als zweiter Spalte. Eine <Zurueck>-Komponente (BackLink) holt ihr Label nur noch daraus und ersetzt die Pille in LessonPage.tsx 62, ModulePage und den 8 Trainern, die Pille in voller Breite und den Ghost-Link „← Zurück zur Lektion“. „← Trainer“ (i18n/pages/*trainer.ts back, dailyquiz.ts) führt auf eine Seite, die es nicht mehr gibt (App.tsx:146 leitet um), und wird so automatisch zu „← Lernen“. Die Prüfung aus E-042 wird erweitert: Die Beschriftung muss dem Titel des Ziels entsprechen. Seitentitel als Ortsnamen: „Schnell etwas wissen“ wird „Nachschlagen“; Lernen/Lernpfad/Dein Weg/Dein Curriculum werden vereinheitlicht, ebenso Starthände/Starthand-Explorer, Odds/Odds-Tabellen/Odds-Spickzettel, Spielstil/Spielstil-Analyse/Dein Spielstil und „Du“/„Profil & Fortschritt“.

<details><summary>Belege</summary>

- B6: mobil-dunkel/lernen.png, zustaende/lektion-quiz.png, zustaende/trainer-preflop.png, zustaende/tagesquiz.png; ui/index.tsx 286ff., LessonPage.tsx 62
- B24: mobil-dunkel/lernen_m1.png, mobil-dunkel/lernen_trainer_preflop.png, mobil-dunkel/lernen_tagesquiz.png, mobil-dunkel/lernen_drill.png; E-042
- B87: zustaende/tagesquiz.png, mobil-dunkel/lernen_m1.png, eigen/sprache/wdh_0.png, desktop/lernen_uebungstisch.png, mobil-dunkel/nachschlagen_haende.png, mobil-dunkel/nachschlagen_odds.png; PreflopTrainer.tsx:77
- B51: sieben Trainer mit „← Trainer“, Drill und Tisch mit „← Lernen“
- B36: Tages-Quiz-Rücklink „← Trainer“ führt nach #/lernen

</details>

### [x] 2.4 Desktop und Tablet: zentrierter Inhalt, einheitliche Breiten, zweispaltige Startseite  
*Wirkung 5 · Aufwand L*

.main (global.css Z. 643, max-width 1140px) bekommt margin-inline: auto. Die Breiten-Tokens aus Paket 1 werden je Seitentyp eingesetzt: Auf dem Lernpfad stehen heute Rangkarte (~390), Modulliste (~520) und Trainerraster (~830) auf einer Seite; im Profil die Inline-maxWidth 520 sowie Karten mit 462, 523 und 440 px; im Drill stehen die Kacheln links, der Titel zentriert. Die Startseite wird ab etwa 1100 px zweispaltig: links Hand des Tages und Lernen, rechts Live-Session, Nachschlagen und „n fällig“. Ab 1200 px bekommt die Lektion ein mitlaufendes Inhaltsverzeichnis rechts (nachrangig). Die Höhenregeln 10.1–10.7 sind fürs Handy gemessen, eine Entscheidung zum Desktop-Layout gibt es nicht.

<details><summary>Belege</summary>

- B72: desktop/start.png, eigen/plattform/fhd-start.png (über 1000 px leer bei 1920), eigen/plattform/tablet-start.png (iPad 820×1180 linksbündig), eigen/plattform/tablet-lernen_uebungstisch.png, desktop/lernen_m1_m1-l1.png, desktop/profil.png, desktop/session.png
- B15: desktop/start.png, desktop/lernen.png, desktop/nachschlagen.png, desktop/lernen_drill.png

</details>

### [x] 2.5 Seitenleiste: genau ein aktiver Eintrag, Live-Session vollständig, Fußzeile immer sichtbar  
*Wirkung 4 · Aufwand S*

In Layout.tsx (Z. 35–57) die Aktiv-Logik so bauen, dass der längste passende Pfad gewinnt. Ein bloßes end auf /lernen reicht nicht, sonst wäre auf /lernen/m1/… nichts mehr aktiv. Heute sind auf #/lernen/uebungstisch, /wiederholen, /pros und /statistik zwei Einträge aktiv, auf #/nachschlagen/coach ebenfalls zwei, auf #/session und #/session/live/einrichten keiner. Die Live-Gruppe bekommt „Live-Session“ (/session, mit grünem Punkt und Blinds, wenn eine Runde läuft), „Abend führen“ (bei laufender Runde Ziel /session/live) und „Frühere Abende“. Die Gruppe Lernen wird auf Lernpfad, Üben, Wiederholen (n) und Übungstisch gekürzt. „Du“, Level/XP und Rechtliches stehen als feste Fußzeile (position: sticky; bottom: 0), damit bei 768 und 860 px Höhe nichts abgeschnitten wird. In der titles-Tabelle /session/live/einrichten und /session/abende ergänzen. Keine Symbolspalte bei 920–1200 px.

<details><summary>Belege</summary>

- B26: desktop/start.png, desktop/lernen.png, eigen/desktop-einrichten.png; scrollHeight 1109 bei clientHeight 860
- B74: desktop/lernen_uebungstisch.png (zwei goldene Balken), desktop/start.png, desktop/session.png
- B67: desktop/session_live_einrichten.png; Layout.tsx 51–57
- B6: desktop/lernen_uebungstisch.png, desktop/start.png (halbes Icon unten links)
- B102: eigen/vertrauen2/desktop_768_start.png (Profil y=843, Rechtliches y=1031)

</details>

### [x] 2.6 Meldungen nicht über Marke und Notch  
*Wirkung 3 · Aufwand S*

.toast-stack (global.css Z. 1664, heute top: 16px; right: 16px) auf top: calc(var(--safe-top) + 8px) setzen, auf schmalen Geräten mittig mit min(92vw, 360px) unter der Kopfzeile oder am unteren Rand, nie über Marke und „Du“.

<details><summary>Belege</summary>

- B75: eigen/plattform/toast-oben.png
- B8: eigen/coach_karten.png, eigen/drill_antwort_dunkel.png („PokerMent…“ abgeschnitten)
- B34: eigen/L1_ergebnis_viewport.png („PokerMen…“)
- B68: Abzeichen-Hinweis „Buchhalter“ liegt über dem Datumsfeld

</details>

## Paket 3 · Erster Eindruck und Vertrauen: eine Marke, eine saubere App-Hülle, ehrliche Texte zu Konto und Daten

**Ziel:** Wer die App über einen Link öffnet oder installiert, sieht in beiden Modi dieselbe klare Marke, keine Entwickleranweisungen, funktionierende Verknüpfungen, und kann sein Konto selbst verwalten und löschen.  
**Baut auf:** 1

### [x] 3.1 Eine Marke, in hell und dunkel sichtbar, gleich auf Favicon, Home-Bildschirm und in der App  
*Wirkung 4 · Aufwand S*

Die Tokens --marke-pik (#edcf87) und --marke-grund (#2f7f5e → #123a2b) außerhalb der Modusblöcke anlegen, nach dem Muster aus E-034, statt --auszeichnung-lesbar (heute #5f4810 auf Grün: 1,4–1,6:1). Icon.tsx:74 übernimmt den Pfad aus public/icons/icon.svg, der Pik füllt etwa 55–60 % der Kachel. scripts/gen-icons.mjs rendert die PNGs (180/192/512, maskable) per Playwright aus icon.svg statt aus der Herzformel insideSpade; apple-touch-icon und maskable als volle Quadrate ohne Alpha-Ecken. Ein Test in farbmodi.test.ts bzw. design.test.ts prüft ≥ 3:1. og.png mit eingebetteter Fraunces und Manrope neu erzeugen (nachrangig).

<details><summary>Belege</summary>

- B4: mobil-hell/start.png, erststart/willkommen.png, eigen/heute_antwort_hell.png, zustaende/tagesquiz.png, public/og.png
- B76: eigen/plattform/icons-vergleich.png, eigen/plattform/kopf-hell.png, erststart/willkommen.png, public/icons/icon-512.png, public/og.png
- B101: eigen/plattform/icons-vergleich.png, eigen/vertrauen/marke_mobil-hell.png, erststart/willkommen.png, public/icons/icon-512.png, public/og.png

</details>

### [x] 3.2 Statusleiste passt zum Farbmodus  
*Wirkung 4 · Aufwand S*

Das Inline-Skript in index.html setzt theme-color passend zur gespeicherten Wahl (heute fest #0b100d, auch im Manifest), der FarbmodusProvider zieht beim Umschalten nach. Zwei media-Tags allein reichen nicht, weil die Nutzerwahl die Systemeinstellung überschreibt. Für iOS apple-mobile-web-app-status-bar-style im hellen Modus erst nach einem Test auf dem Gerät ändern; das Tag lässt sich nicht live umschalten.

<details><summary>Belege</summary>

- B75: mobil-hell/start.png, eigen/plattform/fhd-start.png; gemessen theme-color #0b100d bei Seitengrund rgb(244,242,236)
- B101: index.html:6

</details>

### [x] 3.3 Manifest reparieren: tote Verknüpfung, zweisprachige Beschreibung, Vorschaubilder  
*Wirkung 3 · Aufwand S*

Die Verknüpfung „Pokerabend“ in public/manifest.webmanifest:38 zeigt auf ./#/session/tisch, eine Route, die es seit E-030 nicht mehr gibt; „*“ leitet zur Startseite um. Ihr Text „Die App übernimmt Karten, Chips und Blinds“ beschreibt den entfernten Tisch. Neu: Name „Abend starten“, Text „Blind-Uhr und Chips für euren Abend“, Ziel ./#/session/live/einrichten. Das erst ausliefern, wenn Punkt 7.1 verhindert, dass Einrichten einen laufenden Abend überschreibt; bis dahin ./#/session/live (B21). description nur auf Deutsch. Ein Test prüft, dass jede shortcuts[].url auf eine Route aus App.tsx zeigt. screenshots (narrow/wide) aus dem vorhandenen Playwright-Lauf erzeugen. Eine gestaltete 404-Seite statt stiller Umleitung und die Zeile „Modul nicht gefunden“ sind nachrangig.

<details><summary>Belege</summary>

- B78: public/manifest.webmanifest (keine screenshots, zweisprachige description, gleiche Icons)
- B106: manifest.webmanifest:38, eigen/vertrauen/shortcut_pokerabend.png, eigen/vertrauen2/modul_unbekannt.png, eigen/vertrauen2/lektion_unbekannt.png; App.tsx:232
- B21: Punkt ③ – Manifest-URL nachgeprüft auf #/ umgeleitet

</details>

### [x] 3.4 Marke ab dem ersten Bild beim Kaltstart  
*Wirkung 3 · Aufwand S*

In index.html ein Inline-SVG mit Markenkachel und Schriftzug in #root (React ersetzt es); die Farben kommen über das vorhandene Farbmodus-Skript, dazu ein <noscript>-Hinweis. Das Paket bleibt unverändert (E-043/E-067). apple-touch-startup-image weglassen, weil es über 20 Gerätegrößen mal 2 Modi verlangt.

<details><summary>Belege</summary>

- B79: eigen/plattform/kaltstart-800.png, eigen/plattform/kaltstart-1600.png, index.html; Paket 1,26 MB / 417 kB gzip
- B107: eigen/vertrauen/laden_500ms.png, eigen/plattform/ohne-js.png, dist/index.html

</details>

### [x] 3.5 Keine Entwicklersprache in der Oberfläche, Konto bleibt offline sichtbar  
*Wirkung 5 · Aufwand S*

Pot-Odds-Drill-Fehler (PotOddsDrill.tsx 191–203, potoddsdrill.ts errorHint): „Die Aufgaben konnten nicht geladen werden.“, Knopf „Erneut versuchen“ und der technische Text in einem einklappbaren „Details“ statt „npm run daten“. public/sw.js holt firebase-config.json zuerst aus dem Netz und fällt auf den Cache zurück; die Begründung im Kommentar sw.js:63–65 trifft auf diese Datei kaum zu, monetization.json und legal.json bleiben ungecacht. loadConfig (cloud.ts 66–87) unterscheidet Netzfehler von 404, daraus wird eine Phase 'offline' mit dem Band „offline – wird synchronisiert, sobald Netz da ist“. In der Phase 'unavailable' Kontokarte und Freunde-Eintrag ausblenden, Betreiberanleitungen nur bei import.meta.env.DEV. Texte ersetzen: cloud.ts deviceBody2/3 („localStorage + IndexedDB“, „FIREBASE_SETUP.md“), friends.ts unconfiguredBody, „für diese Installation“, „PokerMentor ist eine PWA“, die Firebase-Fehlertexte, die Platzhalter „z. B. Lorenz“ und „du@example.de“ („Dein Name“, „name@beispiel.de“). Der Prüflauf sucht in der sichtbaren Oberfläche nach „.json“, „.md“, „Firebase“ und „Installation“. Die Versionszeile bleibt, sie ist per readme.test.ts abgesichert (E-065).

<details><summary>Belege</summary>

- B84: #/lernen/drill (Fehlerzustand), #/freunde, eigen/sprache/profil_0.png, profil_3.png, profil_4.png, profil_5.png; CloudAccountCard.tsx:30
- B99: eigen/vertrauen/offline_profil_konto.png, eigen/vertrauen/offline_freunde.png; sw.js:65, CloudProvider.tsx:91, CloudAccountCard.tsx:24–34

</details>

### [x] 3.6 Rechtsseite ehrlich machen und die Kontofunktion an die Rechtsangaben koppeln  
*Wirkung 5 · Aufwand S*

Solange legal.email in public/legal.json leer ist, zeigt CloudAccountCard weder Registrierung noch Google-Login; angemeldete Nutzer behalten Abmelden und Löschen. Ein Test prüft das. privacyRights und privacyAccount (legal.ts) bekommen zwei Fassungen: mit mailto auf legal.email, oder ohne Adresse ganz ohne Verweis auf eine „oben genannte Adresse“. Den Satz „… ist das unkritisch“ (legal.ts:12) streichen. Hotline und check-dein-spiel.de (LegalPage.tsx:120) als tel:- und https-Links mit 44-px-Tippfläche; den Behördennamen BZgA auf BIÖG prüfen. Beim Auftraggeber liegen, nicht im Code entscheidbar: die Anbieterangaben (TODO_MANUELL Nr. 1/2, Art. 13 DSGVO verlangt sie schon für Konten) und die Aussage „richtet sich ausschließlich an Erwachsene“ gegen die niedrige Altersfreigabe aus E-010.

<details><summary>Belege</summary>

- B97: #/rechtliches, mobil-dunkel/rechtliches.png; public/legal.json, legal.ts:12
- B104: mobil-dunkel/rechtliches.png (Hinweis bei y≈1880 von 2188), erststart/willkommen.png; legal.ts:56

</details>

### [x] 3.7 Konto in der App löschen können  
*Wirkung 5 · Aufwand M*

In functions/src einen auth.user().onDelete-Trigger anlegen, der mit dem Admin-SDK users/{uid}, den friendCodes-Eintrag, Freundschaften und Anfragen löscht. Der Client ruft nach erneuter Anmeldung deleteUser() auf (auch bei auth/requires-recent-login). Bestätigung durch Eintippen der E-Mail, Ergebnis „Konto und Cloud-Daten gelöscht – dein Fortschritt auf diesem Gerät bleibt“. Den Datenschutztext auf diesen Weg umschreiben. „Passwort ändern“ über sendPasswordResetEmail. Einen Download der Cloud-Daten nicht bauen, weil backupDownload denselben Fortschritt exportiert.

<details><summary>Belege</summary>

- B100: #/profil (angemeldet), CloudAccountCard.tsx:76–93; kein deleteUser im Quelltext, keine Löschfunktion in functions/src

</details>

### [x] 3.8 Updates sichtbar machen statt still auszutauschen  
*Wirkung 4 · Aufwand M*

In public/sw.js das automatische self.skipWaiting() entfernen. main.tsx hört auf updatefound und waiting und zeigt die Leiste „Neue Version bereit · Neu laden“ (postMessage SKIP_WAITING, Neuladen nach controllerchange), nie während #/session/live. Ein globaler Fang für vite:preloadError lädt einmal neu. Den Baustand per Vite-define in der Über-Karte zeigen. Das Blatt „Neu in dieser Version“ ist optional.

<details><summary>Belege</summary>

- B80: public/sw.js, src/main.tsx, #/profil; „Version 2.2“ fest in i18n/pages/profile.ts Z. 85
- B103: Updates still per skipWaiting, ohne „Was ist neu“

</details>

### [x] 3.9 Installieren im passenden Moment statt als Fließtext  
*Wirkung 4 · Aufwand M*

Ein Hook useInstallieren(): unter Chromium beforeinstallprompt abfangen und einen echten Knopf zeigen, auf iOS ein Anleitungsblatt; bei matchMedia('(display-mode: standalone)') bzw. navigator.standalone alles ausblenden. Angeboten wird es an einer Stelle, beim Einrichten des Live-Abends (Vollbild, Bildschirm bleibt an), dazu die gekürzte Profilkarte (ProfilePage.tsx 446–452) ohne „PWA“. Keine Auslöser nach dem dritten Besuch oder nach der ersten Lektion.

<details><summary>Belege</summary>

- B73: eigen/profil_d_5.png, mobil-dunkel/profil.png, desktop/profil.png; kein beforeinstallprompt/appinstalled im Code
- B108: eigen/profil_d_5.png, ProfilePage.tsx:447–452, public/manifest.webmanifest

</details>

### [x] 3.10 Eigene Domain statt 4cys62s2wp-beep.github.io  
*Wirkung 4 · Aufwand S*

Die Domain kauft der Mensch, danach DOMAIN_SETUP.md abarbeiten. og:url und og:image in index.html (Z. 28) beim Build aus einer Variable erzeugen (VITE_PUBLIC_URL), damit sie nicht wieder veralten. Zuerst Adresszeile, QR-Code und Link-kopieren in ShareCard.tsx:11 umstellen; authDomain (pokermentor-9ac7f.firebaseapp.com) kann später folgen.

<details><summary>Belege</summary>

- B98: index.html (og:url, og:image), #/profil Karte „PokerMentor teilen“, eigen/profil_d_5.png; public/firebase-config.json authDomain

</details>

## Paket 4 · Startseite und Tagesroutine: ein klarer Tagesplan und eine einzige Serie

**Ziel:** Die Startseite sagt Neulingen und Wiederkehrern, was heute zu tun ist, erklärt die erste Frage verständlich, und jede Lernhandlung, auch die Hand des Tages, zählt für dieselbe Serie.  
**Baut auf:** 1, 2

### [ ] 4.1 Die Hand des Tages zählt, und es gibt nur eine Serie  
*Wirkung 5 · Aufwand M*

HubPage.beantworte ruft heute nur speichereAntworten (pokermentor-heute-v1) auf. Künftig ruft es zusätzlich touchStreak auf und vergibt kleine XP. Die Wochenpunkte lesen data.streak. Die Liste der Tage nach lib/heute/stand.ts bleibt, weil E-036 „Sieben Punkte statt einer Zahl“ festlegt; deshalb keine große Flammenzahl und kein Streak Freeze. Die Bezeichnung überall „Tage in Folge“ mit korrektem Singular (hub.ts streakLabel ergibt heute „1 Tage-Streak“; das Profil sagt „LERN-STREAK“). Ein Test prüft nach der Antwort streak.count ≥ 1 und erstesMal = false. Der Hinweis „Halte deine Serie“ ist sinnvoll.

<details><summary>Belege</summary>

- B17: eigen/start-wiederkehrend.png, eigen/start-nach-antwort.png, desktop/start.png; nachgeprüft: Karte „1 Tag in Folge“ bei data.streak 0
- B31: eigen/start-nach-antwort.png, eigen/start-wiederkehrend.png („3 Tage-Streak“ neben „1 Tag in Folge“), eigen/L1_start_nach_0von5.png, eigen/profil_d_0.png

</details>

### [ ] 4.2 „Heute noch“ nach der Antwort: fällige Wiederholungen und nächster Schritt  
*Wirkung 5 · Aufwand M*

Erst nach der Antwort klappt unter der Hand des Tages ein schmaler Block mit höchstens zwei Zeilen auf: „n Fragen wiederholen“ (nur bei n > 0) und Tages-Quiz bzw. nächste Lektion. Der Hauptknopf der beantworteten Karte führt zum ersten offenen Punkt; heute gibt es nach der Antwort nur „Warum? Ganze Rechnung ansehen“. Die Lernen-Karte zeigt bei fälligen Fragen „X Fragen wiederholen“ vor „Weiterlernen“. Heute steht die Zahl nur in der DueBubble der Desktop-Leiste (Layout.tsx Z. 126/263, unter 920 px ausgeblendet) und auf der Kachel „Wiederholen“ etwa 2900 px tief. Das Tagesziel als Zeile „Heute: Hand ✓ · 5 Fragen ○“; der Nenner zählt Fertiges und ist nach 10a.4 erlaubt. Die Hand des Tages bleibt ohne Scrollen beantwortbar (E-036, 10.7); mit npm run daumen nachmessen.

<details><summary>Belege</summary>

- B17: eigen/start-wiederkehrend.png (2 fällig, Tages-Quiz offen, nicht erwähnt), eigen/start-nach-antwort.png, mobil-dunkel/lernen.png
- B35: eigen/L1_start_nach_0von5.png (5 fällig, Startseite zeigt nichts), mobil-dunkel/lernen.png
- B82: mobil-dunkel/start.png, desktop/lernen.png
- B32: Tagesziel „Heute: Hand ✓ · 5 Fragen ○“

</details>

### [ ] 4.3 Die erste Frage verständlich machen, ohne das Höhenbudget zu sprengen  
*Wirkung 5 · Aufwand S*

Die Erklärung kommt in die Karte, nicht als Absatz darüber; das `!heute` in HubPage.tsx:194 hält das Höhenbudget aus E-036. Die Marke heißt „Hand des Tages“ statt „Heute“. Die Aufgabe wird ein vollständiger Satz mit Einheit, alsBB (lib/potodds/aufgabe.ts:286) mit „BB“: „Dein Gegner setzt 32 BB in einen Pot von 96 BB.“ Solange m1-l1 offen ist, lautet die Frage „Mitgehen (Call) – lohnt sich das?“, mit Glossar-Verknüpfung auf „Call“ und der Rechenzeile „Du zahlst 32, um 128 zu gewinnen“. Den Kern von wasDieAppTut in die Karte übernehmen. Die Tagline im Willkommensdialog (Onboarding.tsx:17) ohne „Skills“ und ohne „besser gewinnen“ neu schreiben. Auf 667 px mit npm run daumen nachmessen.

<details><summary>Belege</summary>

- B85: mobil-dunkel/start.png, erststart/willkommen.png, eigen/heute_antwort_dunkel.png; HubPage.tsx:194
- B18: erststart/willkommen.png, eigen/onboarding-name.png, eigen/nach-onboarding.png (.start-erklaerung nicht vorhanden), mobil-dunkel/start.png

</details>

### [ ] 4.4 Onboarding: Ziel optional, Name sichtbar, Einstieg für Bestandsnutzer  
*Wirkung 4 · Aufwand M*

Optionaler dritter Schritt in Onboarding.tsx: „Was hast du vor?“ (Poker lernen / Pokerabende leiten). Er setzt nur Gewichte, die Reihenfolge der Startseite bleibt (E-036: Aufgabe oben; 10.2: Live im Daumenbereich). Bei „Pokerabende leiten“ bekommt der Lernteil keine Erklärung. Der eingegebene Name erscheint statt „Du“ in .mobile-top-you. Ein Link „Ich habe schon ein Konto“ springt zur Kontokarte (Anker plus Fokus); er erscheint nur, wenn die Kontofunktion nach Punkt 3.6 aktiv ist. Kein Tagesziel-Schritt mit drei Stufen.

<details><summary>Belege</summary>

- B18: erststart/willkommen.png, eigen/onboarding-name.png; ENTSCHEIDUNGEN Z. 231 Phase 4.4 „Onboarding“
- B32: Onboarding.tsx Schritte 'lang' | 'name'
- B105: eigen/onboarding-name.png; Anmeldung 2500 px tief im Profil

</details>

### [ ] 4.5 Tages-Quiz nur aus Gelerntem  
*Wirkung 4 · Aufwand S*

DailyQuizPage zieht heute 5 aus allen 248 Fragen; am 2026-10-02 stammen vier aus nie gesehenen Modulen, darunter m5 „Profi“, das für Gratisnutzer gesperrt ist. Der Pool besteht künftig nur aus bestandenen Lektionen (Bestehensgrenze aus Punkt 5.1); ist er leer, folgt der Hinweis, zuerst eine Lektion abzuschließen. Falsche Antworten kommen nur bei abgeschlossenen Lektionen in den Wiederholstapel (addReviewItem). Der Rücklink läuft über die Namenstabelle aus Paket 2. „Fünf Fragen“ nur einmal nennen statt viermal.

<details><summary>Belege</summary>

- B36: #/lernen/tagesquiz, mobil-dunkel/lernen_tagesquiz.png, zustaende/tagesquiz.png, src/pages/DailyQuizPage.tsx
- B93: zustaende/tagesquiz.png („fünf Fragen“ viermal)

</details>

### [ ] 4.6 Erinnern ohne Server  
*Wirkung 3 · Aufwand M*

Eine .ics-Erinnerung über das vorhandene downloadBlob (lib/download.ts). setAppBadge mit dueReviewCount nur dort, wo die Funktion vorhanden ist (Desktop-Chromium, installierte Apps); auf iOS keine Mitteilungserlaubnis ungefragt anfordern. Web-Push über FCM nicht bauen: Das steht quer zu E-036 („keine Zeile Serverkode“) und zum Versprechen „ohne Tracking“.

<details><summary>Belege</summary>

- B32: erststart/willkommen.png, eigen/onboarding-name.png, mobil-dunkel/start.png, src/components/Onboarding.tsx; keine Notification-API in src
- B82: mobil-dunkel/start.png, desktop/lernen.png, #/lernen/wiederholen; kein setAppBadge

</details>

## Paket 5 · Lernpfad, Lektionen und Quiz: kurze Schritte, echtes Bestehen, Wege ins Training

**Ziel:** Lernen fühlt sich an wie in den besten Lern-Apps: Lektionen in überschaubaren Schritten mit Wiedereinstieg, ein Quiz, das Verstehen prüft und Fehler zeigt, antippbare Begriffe und ein direkter Weg ins passende Training.  
**Baut auf:** 1, 2

### [ ] 5.1 Bestehen heißt verstanden, und der Abschluss zeigt, was falsch war  
*Wirkung 5 · Aufwand M*

Heute gilt 0 von 5 als „abgeschlossen“ und bringt das Abzeichen „Erste Schritte“ und 60 XP, weil QuizRunner immer onFinish aufruft und completeLesson in AppState.tsx keine Schwelle kennt. Neu: Bestehensgrenze ceil(0,8 × total). Darunter kein completeLesson, sondern der Zustand „versucht“ mit dem besten Ergebnis, und der Hauptknopf heißt „Fehler nochmal üben“ (nur die falschen Fragen). XP aufgeteilt 20/80 statt 60 + 40 × Anteil. Der Ergebnisbildschirm zeigt Kacheln für „+XP“, „Modul 2/5“ und gegebenenfalls „neues Abzeichen“ (statt Toast), dazu die Liste „Das hattest du falsch“ mit richtiger Antwort, aufklappbarer Erklärung und der Zeile „kommt in deine Wiederholung“. Keinen sich füllenden Ring: Regel 8a.2 nennt das eine Wartezeit.

<details><summary>Belege</summary>

- B29: eigen/L1_ergebnis_viewport.png, eigen/L1_modul_nach_0von5.png („Abgeschlossen · Quiz: 0/5“), eigen/L1_lernen_nach_0von5.png
- B34: eigen/L1_ergebnis_viewport.png, zustaende/lektion-quiz.png, src/components/QuizRunner.tsx; quiz.ts good

</details>

### [ ] 5.2 Quiz als Fokusmodus mit fester Ergebnisleiste  
*Wirkung 5 · Aufwand M*

Eigene Route /lernen/:m/:l/quiz statt des Komponentenzustands showQuiz in LessonPage.tsx; Zurück verlässt nur das Quiz. Das Fokuslayout kommt ohne page-header aus: X links, Balken, „2/5“; die Frage beginnt heute erst bei y≈500. Die Ergebnisleiste liegt fixed am unteren Rand, ihr Platz ist von Anfang an per padding-bottom reserviert. Sie überlagert und verschiebt keine Option (8a.2: 0 px Versatz). Heute liegt die Rückmeldung bei y=823 und „Nächste Frage“ bei y=962. QuizRunner, ReviewPage und DailyQuizPage bekommen die Klasse entscheidung, damit Regel 9a.1 greift und npm run daumen sie prüft. Eine Rückfrage beim Abbrechen kommt erst ab einer beantworteten Frage; der Zwischenstand liegt in sessionStorage („Quiz fortsetzen bei Frage 3“). Haptik bei falsch mit umschlag() (haptik.ts), ohne dass der globale Listener zusätzlich bestaetigt auslöst.

<details><summary>Belege</summary>

- B22: zustaende/lektion-quiz.png, zustaende/tagesquiz.png, mobil-dunkel/lernen_tagesquiz.png; nachgeprüft: Zurück bei Frage 2/5 verwirft das Quiz
- B30: eigen/L1_nach_antwort_viewport.png, eigen/L2_feedback_gescrollt.png, zustaende/lektion-quiz.png, eigen/quiz_falsch_dunkel.png
- B6: zwei Ausgänge untereinander (Pille „← Grundlagen“ und „← Zurück zur Lektion“)

</details>

### [ ] 5.3 Antworten mischen und Distraktoren angleichen  
*Wirkung 5 · Aufwand M*

In 58 % der 248 Fragen ist B richtig, in 75 % die längste Option. QuizRunner und ReviewPage mischen die Optionen künftig je Anzeige, das Tages-Quiz mit Datums-Seed; im State steht die Abbildung gemischter Index → Originalindex. Danach die 187 Distraktoren in src/content/modules/m1.ts … m9.ts umschreiben. Eine Testsperre für den Anteil „längste Antwort“ je Modul startet beim heutigen Wert und sinkt schrittweise auf höchstens 40 %.

<details><summary>Belege</summary>

- B33: src/content/modules/m1.ts … m9.ts, src/components/QuizRunner.tsx, eigen/L1_wiederholen.png (wieder C)

</details>

### [ ] 5.4 Lektion in Abschnitten mit Fortschritt und Wiedereinstieg  
*Wirkung 5 · Aufwand L*

Stufe 1: Fortschrittsanzeige („Abschnitt 3 von 6“) und ein klebendes „Weiter“ in der entscheidung-leiste (9a.2). Die Leseposition wird neu erhoben: lessonProgress[lessonId] = Abschnittsindex in AppData, per IntersectionObserver auf die Abschnittsüberschriften. window.scrollTo(0,0) in LessonPage.tsx:33 springt künftig an die gemerkte Stelle. Erst danach zeigt die Startkarte „Weiter bei Abschnitt 3 von 6“, weil HubPage keine ungemessene Zahl zeigen darf. Stufe 2: Abschnitte über 180 Wörter in den Inhaltsdateien von Hand teilen, nicht automatisch, damit Beispiel und Tipp nicht vom Text getrennt werden. Zwischenfragen über nachAbschnitt?: number, Modul für Modul. Ein echter Schrittmodus braucht eine eigene Entscheidung; E-036 führt die Fließtext-Absätze selbst als offen.

<details><summary>Belege</summary>

- B20: mobil-dunkel/lernen_m1_m1-l1.png (5612 px), mobil-dunkel/lernen_m5_m5-l3.png (6790 px), eigen/lektion-mitte.png, eigen/start-wiederkehrend.png
- B28: mobil-dunkel/lernen_m1_m1-l1.png, eigen/lek_d_0.png … lek_d_5.png, desktop/lernen_m1_m1-l1.png; 49 Lektionen, Ø 922 Wörter, 224 Abschnitte
- B71: 2-px-Lesefortschritt in der Kopfzeile

</details>

### [ ] 5.5 Lektionstext gestalten: weniger Gold, echte Karten, eine Tischskizze  
*Wirkung 5 · Aufwand L*

.prose strong (global.css 1220) in --text-stark mit Gewicht 700, ohne Gold; die Hervorhebungen in den Inhalten halbieren (m1 hat 144, insgesamt 858). Das Feld cards (types.ts, heute in 36 von 224 Abschnitten) in den Beispielabschnitten pflegen, vorrangig in m1 und m2, statt Karten per Regex im Fließtext zu erkennen. Minikarten im Fließtext nur mit Kontrasttest in hell und dunkel (rote Farben 4,5:1). Für Blinds und Position (m1-l3) das Positionsschema aus Punkt 6.8 einbauen; als Inhalt statt Dekoration besteht es den Prüfstein aus E-035/E-036. .prose-Breite kommt aus Punkt 1.2.

<details><summary>Belege</summary>

- B7: mobil-dunkel/lernen_m1_m1-l1.png, eigen/lek_d_0.png, lek_d_1.png, lek_d_3.png, eigen/lek_desk_0.png
- B40: eigen/lek_d_0.png, eigen/lek_d_2.png, eigen/lek_desk_1.png, src/components/MarkdownLite.tsx; 628 Kartenangaben als Text

</details>

### [ ] 5.6 Fachbegriffe antippbar machen  
*Wirkung 5 · Aufwand M*

MarkdownLite.tsx, QuizRunner.tsx und die Trainer haben heute keine Verbindung zum Glossar. In Lektionen werden die **fett** markierten Begriffe mit Glossareintrag (rund 208 von 858) antippbar, in Trainern, Übungstisch-Coach und Live-Coach jeweils das erste Vorkommen pro Bildschirm („c-bettet“, „Semi-Bluff“, „polar“, „Standard-Shove“, „Implied Odds“, „Fold Equity“). Das Unterblatt aus Herkunft.tsx wird wiederverwendet, die Tippfläche ist mindestens 44 px. Ein Test prüft, dass jede verlinkte id im Glossar existiert.

<details><summary>Belege</summary>

- B86: mobil-dunkel/lernen_trainer_szenario.png, zustaende/trainer-preflop.png, eigen/lek_d_1.png, zustaende/tisch-hand.png; prefloptrainer.ts bbDefenseDesc
- B40: 858 fette Begriffe, keiner antippbar

</details>

### [ ] 5.7 Lektion und Training verweisen aufeinander  
*Wirkung 4 · Aufwand M*

Lesson bekommt das Feld ueben?: TrainerId. Nach dem Quiz erscheint der zweite Knopf „Jetzt üben: <Trainer>“ (z. B. m3 „Pot Odds“ → Pot-Odds-Drill), jeder Trainer in src/pages/trainers/*.tsx zeigt „Konzept nachlesen: <Lektion>“, umgekehrt aus denselben Daten abgeleitet. Übungsknoten im Pfad und Bonus-XP folgen später. Das fordert CONCEPT.md, Leitprinzip 2.

<details><summary>Belege</summary>

- B37: #/lernen/m3, #/lernen/drill, #/lernen/trainer/potodds, eigen/L1_ergebnis_viewport.png, mobil-dunkel/lernen.png; grep nach /lernen/m: in Trainern ohne Treffer

</details>

### [ ] 5.8 Lernpfad verdichten: eine aufgeklappte Stufe, ehrliche Marken, Übungen nach Bedarf  
*Wirkung 4 · Aufwand M*

Innerhalb von Regel 10a.2 (eine Linie, neun Stufen, ein Wegweiser): Die Stufe mit „Hier weiter“ ist aufgeklappt, zeigt ihre Lektionen und einen Knopf mit der nächsten Lektion und ihrer Dauer. Die anderen Stufen werden zu einer Zeile von ~56 px, fertige bekommen einen Haken. Die Niveau-Reihenfolge korrigieren: m5 „Profi“ steht vor m6 „Einsteiger“ (m5.ts/m6.ts level); das ist eine Inhaltsfrage. Die „Neu“-Pillen (LearnPage.tsx 274/310, learn.ts drillPill/newPill) bleiben nur bis zum ersten Besuch. „Wiederholen“ erscheint nur mit fälligen Karten und Zahl, „Spielstil“ erst ab handsPlayed > 0. Platzhalter der Suche auf „Lektionen durchsuchen“ kürzen (heute „„Pot O“). Keine Aufteilung in Hauptpfad und Vertiefungen, das bräche 10a.2.

<details><summary>Belege</summary>

- B23: mobil-dunkel/lernen.png (3680 px), desktop/lernen.png, eigen/lernen-oben.png, mobil-dunkel/lernen_wiederholen.png, mobil-dunkel/lernen_statistik.png
- B93: eigen/sprache/lernen_1.png (Platzhalter abgeschnitten), „Neu“ ohne Bedingung
- B94: Marke „Profi“ an Modul 5 „Fortgeschrittene Konzepte“
- B15: Modulkarten brechen unterschiedlich um (Preflop-Strategie gegen Poker-Mathematik)

</details>

### [ ] 5.9 Wiederholen verständlich machen und auf Trainerfehler ausweiten  
*Wirkung 4 · Aufwand M*

ReviewPage zeigt nextDue relativ („morgen“, „in 3 Tagen“) statt „2026-10-05“. Die Dopplung zwischen Untertitel und Leerzustand sowie „0 fällig · 0 im Stapel“ entfernen. In einem zweiten Schritt kommen Fehler aus Preflop-, Push/Fold- und Szenario-Trainer in den Stapel. Dafür wird ReviewItem eine Union mit Trainer-Zustand, und der Trainer muss einen Spot neu aufbauen können; das ist deutlich mehr Arbeit.

<details><summary>Belege</summary>

- B35: eigen/L1_wiederholen.png, mobil-dunkel/lernen.png; addReviewItem nur in LessonPage und DailyQuizPage
- B93: eigen/sprache/wdh_0.png

</details>

### [ ] 5.10 Kartenfragen statt reiner Textauswahl  
*Wirkung 4 · Aufwand L*

QuizQuestion (src/content/types.ts) bekommt die optionalen Felder cards?/board?. Dann stehen Fragen wie „Board A♣ 8♠ 6♥ 4♦ 2♣ … Wer gewinnt?“ als PlayingCards über den Optionen. Dazu optionFeedback?: string[], damit eine bestimmte falsche Option ihren eigenen Denkfehler erklärt. Danach die Typen 'zahl' und 'karten' (CardPicker) nur für m1-l2 und m3; 'matrix' (HandMatrix) braucht eine eigene Bewertungslogik und kommt später.

<details><summary>Belege</summary>

- B39: src/content/types.ts, src/components/CardPicker.tsx, src/components/HandMatrix.tsx, zustaende/lektion-quiz.png

</details>

## Paket 6 · Übungstisch und Trainer: alles in einem Bild, ein Coach, der der eigenen Strategie folgt, Rückmeldung nach der Entscheidung

**Ziel:** Am Übungstisch sieht man Tisch, eigene Karten, Gegneraktionen und Knöpfe auf einen Blick, der Coach rät nicht mehr gegen die eigenen Ranges, und jede Entscheidung bekommt danach eine Rückmeldung, aus der man lernt.  
**Baut auf:** 1, 2

### [ ] 6.1 Coach auf die vorhandene Range-Logik umstellen  
*Wirkung 5 · Aufwand M*

Heute rät der Coach mit 77 im CO bei ungeöffnetem Pot zum Fold („Equity vs. 3 zufällige Hände ~35 %“), obwohl die CO-Range in ranges.ts „22+“ enthält. Der Grund: PlayPage.tsx 187–197 und 478–486 vergleichen nur equityVsRandomHands mit call/(pot+call). Neu ist eine reine, getestete Funktion coachForTable(g). Sie bildet positionOf auf CoachPosition ab, leitet raisedBefore und limpers aus g.log ab und nutzt preflopAdvice (coach.ts:379), postflopAdvice, madeHandInfo/detectDraws und facingBetVerdict wie CoachPage.tsx 89–105. Preflop entfällt die Zahl „Equity vs. Zufallshände“. Regressionstests: Eine Hand außerhalb der RFI-Range bekommt im ungeöffneten Pot nie Raise; 77 im CO bekommt nicht Fold.

<details><summary>Belege</summary>

- B43: eigen/tisch/desk-6max-raise.png, zustaende/tisch-hand.png, #/lernen/trainer/preflop; play.ts:105
- B38: zustaende/tisch-hand.png, eigen/tisch_vp_dunkel.png; equityVsRandomHands

</details>

### [ ] 6.2 Einsatzwahl in die klebende Leiste, Beträge in BB  
*Wirkung 5 · Aufwand M*

Heute öffnet „Raise …“ die Einsatzwahl außerhalb des Bildes: bei 390×844 ab y=958, bei 1366×860 hinter der Leiste. .erhoehen (PlayPage.tsx 497–505, global.css 3487) wandert in <Entscheidung> und damit in die klebende Leiste (global.css 3500). Jeder Vorgabeknopf trägt seinen Zielbetrag: preflop 2,5/3/4 BB, im 3-Bet-Fall das Dreifache des Opens, postflop 33/50/75/100 % Pot, dazu All-in. Ein Feld mit −/+ und der Bestätigungsknopf „Raise auf 6“, damit ein Fehltipp nicht sofort ausgeführt wird. Fast gleiche Vorgaben zusammenlegen (Min 4, ½ Pot 5, ¾ Pot 6, Pot 7 aus raiseTo() 309–322). aria-expanded am Knopf. Den Tisch fest auf BB umstellen, ohne Schalter: Pot, Call, Stacks (START_STACK in PlayPage.tsx:25), Verlauf; halbe BB mit Komma. Den Durchgangstest auf Sichtbarkeit übernehmen.

<details><summary>Belege</summary>

- B42: eigen/tisch/02-raise-offen.png, eigen/tisch/02b-raise-offen-ganz.png, eigen/tisch/desk-6max-raise.png
- B54: eigen/tisch/04-hand-ende.png („POT 57“), eigen/tisch/drill-antwort-vp.png (BB), zustaende/trainer-preflop.png („2,5bb“); coach.ts:46

</details>

### [ ] 6.3 Tisch, eigene Karten, Coach und Knöpfe in einem Bild, und die Leiste bleibt stehen  
*Wirkung 5 · Aufwand M*

Die Seite wird ein Raster mit min-height 100dvh; die Größe der eigenen Karten richtet sich per Container-Query nach der Höhe (xl → lg unter 720 px). Heute verdeckt bei 375×667 die Leiste die halbe Hand und das eigene Namensschild, bei 390×844 liegt der Coach-Kasten unter der Leiste. Der Coach wird ein Einzeiler in der Leiste („Equity 23 % · nötig 41 %“ mit Haken oder Kreuz), die Erklärung kommt per „Warum?“ als Blatt (E-018). Die Leiste bleibt zwischen den Zügen stehen, mit deaktivierten Knöpfen und dem Text „Carla überlegt …“ statt einer eigenen Karte (PlayPage.tsx 495–539). Nach einem eigenen Fold gibt es „Hand zu Ende spielen“ ohne Bot-Verzögerung (heute 550–1250 ms je Aktion, PlayPage.tsx:174). Botnamen am Sitz nur mit Vornamen. Kein Vollbild-Tisch, keine Vorauswahl-Kästchen, kein Fast-Fold, kein Tempo-Schalter: Das verstärkt den Spielcharakter, den E-010/E-030 begrenzen. Der Prüflauf testet bei 375×667, dass das eigene Namensschild nicht unter der Leiste liegt.

<details><summary>Belege</summary>

- B44: eigen/tisch/klein-oben.png, eigen/tisch/mob-klein-6max.png, eigen/tisch_vp_dunkel.png, zustaende/tisch-hand.png
- B11: eigen/tisch_vp_dunkel.png, eigen/tisch_vp2_dunkel.png, zustaende/tisch-hand.png, mobil-dunkel/lernen_uebungstisch.png („Carla Callst…“, Leerfläche unter der Leiste)
- B49: eigen/tisch/03b-nach-aktion-1.png, eigen/tisch/03-street-1.png; 91 s von 115 s Warten auf Bots

</details>

### [ ] 6.4 Am Tisch steht, was passiert ist: Gegneraktionen und Showdown  
*Wirkung 4 · Aufwand M*

Die Aktionsmarke je Sitz („Check“, „Bet 4“, „Raise 7“) aus g.log der laufenden Street ableiten (LogEntry hat playerId und street); heute gibt es nur L.foldedTag und den Einsatz-Chip (PlayPage.tsx 356–384). Dazu eine Kurzzeile „David erhöht auf 7“ in der Zeile filz-lage, die schon aria-live hat. Keine Gold-Animation für neue Boardkarten (E-010, Regel 8a). Showdown: eine Ergebniszeile mit beiden Händen und Kicker („Paar Damen schlägt dein Paar Zweien“), „mit Ein Paar“ wird klein geschrieben, der eigene Verlust steht am Tisch. Aufgedeckte Gegnerkarten (PlayPage.tsx 357–358) mindestens in md und vor Namensschild und D-Knopf. Die fünf Gewinnerkarten hervorzuheben ist nachrangig.

<details><summary>Belege</summary>

- B46: zustaende/tisch-hand.png (nur „1“, „2“, „7“), eigen/tisch/03-street-1.png, eigen/tisch/01-hero-dran.png
- B47: eigen/tisch/showdown-0.png, eigen/tisch/04-hand-ende.png

</details>

### [ ] 6.5 Bewerten nach der Aktion statt die Lösung vorher anzusagen  
*Wirkung 5 · Aufwand L*

Erst nach Punkt 6.1. Heute erscheint das Coach-Panel (PlayPage.tsx 465–490) vor der Entscheidung mit dem Urteil und verschwindet danach; bewertet wird nie. Neu: Der Coach ist standardmäßig aus bzw. erscheint auf „Tipp anzeigen“; „Tipp vorher“ bleibt wählbar. Nach der Aktion kommt ein Urteil in drei Stufen (Gut / Vertretbar / Fehler), nur dort, wo es eindeutig ist, ausdrücklich als Schätzung gekennzeichnet, ohne vorgetäuschten EV-Verlust. XP pauschal je gespielter Hand statt won ? 10 : 2 (recordHand); das Abzeichen „Erster Pot“ überprüfen. Lektion m1-l1 lehrt „in Entscheidungen, nicht in Ergebnissen“. Gegenentscheidung: E-045 sagt, die Güte des Rats wird nicht geprüft. Der Nutzen überwiegt, weil erst so der Lernkreis entscheiden → Rückmeldung entsteht; Voraussetzung ist die rangebasierte Grundlage aus 6.1. Ein Rückblick nur als statische Liste, kein Replayer (E-010).

<details><summary>Belege</summary>

- B45: eigen/tisch_vp2_dunkel.png, eigen/tisch/03b-nach-aktion-1.png, eigen/tisch/04-hand-ende.png; HandTracker (stats.ts) ohne Bewertung
- B38: zustaende/tisch-hand.png, eigen/tisch_vp_dunkel.png, src/pages/PlayPage.tsx

</details>

### [ ] 6.6 Einheitliche Aktionen in Tisch und Trainern  
*Wirkung 4 · Aufwand S*

Feste Reihenfolge Fold · Call · Raise am Tisch (PlayPage.tsx 506–526), im Preflop-Trainer (PreflopTrainer.tsx 155–164, heute „Raise | Fold“) und im Push/Fold-Trainer (PushFoldTrainer.tsx 140–150). Farben aus den Aktions-Tokens von Paket 1, passend zur Matrix-Legende (Fold heute am Tisch rot, in der Legende grau). Fold und Call neutral, Raise als einziger betonter Knopf; heute rot, grau und Gold-Glow. Antwortknöpfe als gleich breites Raster (heute im Szenario linksbündig mit „Fold“ allein in Zeile zwei). Der Szenario-Trainer mischt weiter, weil seine Antworten ausformuliert sind. Die Tischwahl wird ein Segment 1 · 2 · 5 statt drei hoher Karten in Gold, Grün und Rot, der Coach-Modus ein Schalter statt Browser-Checkbox.

<details><summary>Belege</summary>

- B51: eigen/tisch_vp_dunkel.png, zustaende/trainer-preflop.png, mobil-dunkel/lernen_trainer_pushfold.png, mobil-dunkel/lernen_trainer_szenario.png, eigen/preflop_antwort.png; ScenarioTrainer.tsx:50
- B11: drei Knopfstile, Tischwahl-Karten, Checkbox
- B13: mobil-dunkel/lernen_trainer_szenario.png, mobil-hell/lernen_trainer_outs.png
- B14: mobil-dunkel/lernen_uebungstisch.png (Coach-Checkbox)

</details>

### [ ] 6.7 Trainer-Kopf und Leiste aufräumen, die Erklärung nach der Antwort sichtbar machen  
*Wirkung 4 · Aufwand M*

.drill-unten (global.css 2327–2340) bekommt den Grund --bg-deep, durchgezogen bis zur Unterkante; die Knöpfe bleiben 24 pt über dem Gestenstreifen (DESIGN §3). Der Inhalt bekommt unten ein padding von --drill-bedienung-h, damit nichts unter der Leiste verschwindet. Die drei Werte aus E-038 (Serie, Treffer, Beste) in eine kompakte Zeile statt drei Kacheln mit ~70 px; „Teilen“ als Icon oben rechts. Nach der Antwort holt scrollIntoView({block:'nearest'}) ohne smooth (E-064) die Kernbegründung über die Leiste; heute liegen „ABSTAND −4,4 pp“ und die Begründung darunter. Die Preflop-Matrix nach der Antwort kompakt und nur zum Ansehen (heute nach „J5s“ abgeschnitten und verdeckt). „Neue Bestserie“ wird „Rekord!“. Im Drill statt „Ziel: Ein Paar“ die Marke „zählt ab: Ein Paar“.

<details><summary>Belege</summary>

- B13: zustaende/drill-frage.png, desktop/lernen_drill.png, zustaende/trainer-preflop.png (200 px Leerraum), mobil-dunkel/lernen_trainer_szenario.png, mobil-hell/lernen_trainer_outs.png
- B50: eigen/tisch/drill-antwort-vp.png, eigen/tisch/drill-antwort-vp-unten.png, eigen/preflop_antwort.png; PreflopTrainer.tsx 104–145
- B93: eigen/drill_antwort_dunkel.png („NEUE BESTSE…“)
- B8: Kachel „NEUE BESTSE…“
- B90: zustaende/drill-frage.png („Ziel: Ein Paar“)

</details>

### [ ] 6.8 Positionsschema statt Lagebeschreibung in Sätzen  
*Wirkung 4 · Aufwand M*

Ein statisches SVG: sechs Plätze im Oval, Positionskürzel, der eigene Platz in der Bereichsfarbe, Einsätze als Zahl in BB, gefoldete Plätze blass, kein Filz, keine Chip-Grafik. Einsatz im Preflop-Trainer (PreflopTrainer.tsx 89–101), Szenario- und Push/Fold-Trainer, auf der heutigen Leerfläche über den Knöpfen. Dieselbe Komponente dient der Lektion zu Blinds und Position (Punkt 5.5). Gedeckt durch E-030 (Lehrmaterial als Standbild); BACKLOG sagt ausdrücklich „Kein Tisch, keine Animation“, daher kein Filz.

<details><summary>Belege</summary>

- B52: zustaende/trainer-preflop.png, mobil-dunkel/lernen_trainer_szenario.png, mobil-dunkel/lernen_trainer_pushfold.png
- B7: Tisch-Skizze für Blinds und Position
- B40: Tischskizze für m1-l3

</details>

### [ ] 6.9 Aufgaben, die etwas lehren: Grenzhände und seltene Hände gezielt ziehen  
*Wirkung 4 · Aufwand M*

PreflopTrainer newScenario() (23–43) zieht heute gleichverteilt, deshalb ist „immer Fold“ in 69,1 % richtig (RFI 74,4 %). Neu: gewichtete Ziehung mit etwa 50 % Grenzhänden (Abstand ≤ 1 Feld zur Range-Grenze), Spot-Chips oben (Position, RFI oder Verteidigung), Trefferquote je Spot über recordTrainer. HandRankTrainer: die Zielkategorie gewichtet per Ablehnungsverfahren mit Obergrenze ziehen (heute 85 % High Card, Paar oder zwei Paare; Straße/Flush 7,6 %), die fünf besten Karten über die 21 Kombinationen von evaluateBest hervorheben. award('trainer-first') nur bei correct (eine Zeile in recordTrainer).

<details><summary>Belege</summary>

- B53: #/lernen/trainer/preflop, zustaende/trainer-preflop.png, eigen/tisch/anteil.ts
- B41: eigen/L2_handranking_antwort.png, mobil-dunkel/lernen_trainer_handranking.png, src/pages/trainers/HandRankTrainer.tsx

</details>

### [ ] 6.10 Handliste und Spielstil führen zum nächsten Schritt  
*Wirkung 3 · Aufwand M*

Die Handzeile (PlayPage.tsx 581–585, heute <div onClick> ohne role und tabindex) wird ein <button aria-expanded>; das ist für die Barrierefreiheit Pflicht. Die Liste zeigt die letzten 10 und „Alle anzeigen“ statt 3618 px nach 22 Händen. Jede Schwachstelle auf der Spielstil-Seite (StatsPage.tsx:216, heute nur „← Lernen“) bekommt „Jetzt üben“ zur passenden Lektion oder zum passenden Trainer. „Tisch verlassen“ (PlayPage.tsx:331) zeigt eine Lern-Bilanz mit Zahl der Entscheidungen und Fehler-Marken aus Punkt 6.5, aber keinen Gewinn oder Verlust (E-010/E-030).

<details><summary>Belege</summary>

- B55: eigen/tisch/auswahl-mit-haenden.png, eigen/tisch/verlauf-offen.png, eigen/tisch/statistik.png

</details>

## Paket 7 · Live-Session: kein Datenverlust, eine steuerbare Uhr, auch im Querformat, und ein Abend mit Abrechnung

**Ziel:** Gastgeber verlieren nie einen laufenden Abend, steuern die Blind-Uhr wie in Profi-Timern, lesen sie aus 2 m auch quer auf dem Handy und beenden den Abend mit einer fertigen, teilbaren Abrechnung.  
**Baut auf:** 1, 2

### [x] 7.1 Laufenden Abend nie überschreiben (Datenverlust-Fehler)  
*Wirkung 5 · Aufwand S*

SessionPage.tsx:66 verlinkt bei laufender Runde auf /session/live; die Kachel zeigt Blinds und Restzeit aus standDerUhr() wie HubPage. EinrichtenPage liest beim Laden ladeLaufende(); läuft ein Abend, zeigt sie ein Band [Zurück zur Uhr] [Laufenden Abend beenden & speichern]. Als Schutznetz archiviert starte() (EinrichtenPage.tsx:75) eine vorhandene Runde immer zuerst: speichereAbende(ergaenze(ladeAbende(), archiviere(alt, Date.now()))). Regressionstest in src/lib/__tests__/live.test.ts. Höchste Dringlichkeit und unabhängig vom Rest, kann vorgezogen werden.

<details><summary>Belege</summary>

- B56: #/session, #/session/live/einrichten, eigen/session-laufend.png, eigen/abend-fuehren-klick.png; nachgestellt: alter Abend mit 5 Spielern und Rebuy weg, pokermentor-session-abende-v1 null
- B21: Punkt ① – eigen/session-laufend.png, eigen/abend-fuehren-klick.png

</details>

### [ ] 7.2 Blind-Uhr im Querformat  
*Wirkung 5 · Aufwand S*

Für .tisch einen Block @media (orientation: landscape) and (max-height: 500px): zweispaltiges Raster (Zeit über die volle Höhe, Blinds und „Danach“ daneben), Größen über min(…vw, …vh) statt clamp(72px, 27vw, 220px) (global.css 4564ff.). Polster links und rechts max(var(--sp-4), var(--safe-left/right)), damit Pause nicht unter der Notch liegt. Die Knöpfe quer als flache Zeile mit min-height var(--tipp-min). npm run tisch um 844×390, 932×430 und 667×375 mit laufendem Abend erweitern: alle drei Angaben vollständig im Bild, ≥ 56,5 px, keine Überlappung mit .tisch-unten. Kein Vollbild-Knopf (auf iOS wirkungslos).

<details><summary>Belege</summary>

- B63: eigen/live/quer-handy.png, eigen/live/quer-tablet.png; .tisch-blinds top −98 px, .tisch-naechste 339–449 px
- B70: eigen/plattform/live-quer-844x390.png, live-quer-932x430.png, live-quer-667x375.png, eigen/live/quer-tablet.png; docs/quer.json meldet 0 Befunde

</details>

### [ ] 7.3 Uhr steuerbar: Stufe vor/zurück, Minute dazu, pausiert starten  
*Wirkung 5 · Aufwand M*

In lib/live/uhr.ts reine Funktionen Stufe ± und ±1 Minute, die verbraucht_ms verschieben; Bedienung über ein Steuerblatt, die Daueranzeige bleibt bei drei Angaben (E-027). Der Abend startet pausiert (laeuft_seit: null statt Date.now() in EinrichtenPage.tsx:86), mit großem Knopf „Uhr starten“. Auf der letzten Stufe zählt die gespielte Zeit hoch („Letzte Stufe · seit 0:12“) statt bei 0:00 stehen zu bleiben. Die Struktur wird nicht fortgeschrieben, weil blinds.ts die letzte Stufe auf ein Finale mit 12–30 BB rechnet und der uhr.ts-Kommentar sie bis zum Ende gelten lässt. Pausenstufen sind nachrangig.

<details><summary>Belege</summary>

- B58: #/session/live, zustaende/live-laufend.png, eigen/live/letzte-stufe.png; session.stufe wird nie benutzt

</details>

### [ ] 7.4 Warnung, Wechsel und Pause aus 2 m erkennbar  
*Wirkung 4 · Aufwand S*

In der letzten Minute steht die Restzeit (.tisch-zeit.knapp, global.css:4572) in --auszeichnung statt in Akzentgrün, das wie die Blinds aussieht. In der Pause bleibt die Zeit in --text (global.css:4631 macht sie --text-faint und verstößt damit gegen Regel 10.10 „Zurücktreten heißt nicht verblassen“); „PAUSIERT“ steht in ≥ 56,5 px über der Zeit, an der Stelle des Kopf-Etiketts (Regel 11.4). Beim Stufenwechsel wird die Marke „BLINDS“ 10 s lang zu „NEUE BLINDS“, ohne Blinken und ohne Vollbild-Band (E-027). npm run tisch um die Zustände knapp und pausiert erweitern.

<details><summary>Belege</summary>

- B61: #/session/live, zustaende/live-laufend.png, eigen/live/knapp-hoch.png, eigen/live/quer-tablet.png; DESIGN.md Abschnitt 8 (56,5 px)

</details>

### [ ] 7.5 Ton und Wachhalten zuverlässig und prüfbar  
*Wirkung 4 · Aufwand M*

signal.ts erzeugt heute für jeden Ton einen neuen AudioContext aus dem Sekundentakt; auf iOS bleibt er ohne Nutzergeste „suspended“. Neu: ein einziger AudioContext auf Modulebene, angelegt und entsperrt im Klick-Handler von „Uhr starten“ bzw. „Weiter“ (kurzer Bestätigungston), danach wiederverwendet. navigator.audioSession.type = 'playback', wo vorhanden, navigator.vibrate als Rückfall. Im Steuerblatt aus Punkt 7.3 [Ton testen] und Ton an/aus. haltWach() gibt seinen Erfolg zurück; bei Misserfolg erscheint einmal „Bildschirm bleibt nicht an – Auto-Sperre ausschalten“. Eine Sprachansage ist nachrangig.

<details><summary>Belege</summary>

- B60: #/session/live, src/lib/live/signal.ts (ton(), fest 0,25 / 880 Hz / 180 ms)

</details>

### [ ] 7.6 Cash-Abend ohne sinnlosen Countdown  
*Wirkung 4 · Aufwand M*

Bei „Blinds bleiben, wie sie sind“ baut baueStruktur() heute N gleiche Stufen; die Uhr zeigt „1 / 2 · 19:59 · Danach 1 / 2“ und piept alle 20 Minuten. Neu: das Feld modus: 'cash' in LaufendeSession; standDerUhr liefert dann naechste = null und knapp = false. Der Tisch zeigt Blinds und die hochzählende gespielte Zeit, ohne „Danach“-Zeile und ohne Töne. Einkauf und Cash-out in Euro gehören in den Abschluss aus Punkt 7.8.

<details><summary>Belege</summary>

- B62: #/session/live/einrichten, #/session/live, eigen/live/cash-uhr.png; blinds.ts gleichbleibend

</details>

### [ ] 7.7 Stände-Blatt: volle Namen, Rebuy-Zähler, Rückgängig, Nachzügler  
*Wirkung 4 · Aufwand M*

Zweizeilige Zeile: der Name in voller Breite (heute „Bene…“, „Charl…“), darunter klein „2× Rebuy · 9.000 eingesetzt“. Nach „Nachgekauft“ (TischPage.tsx:212) erscheint 5 s lang ein Rückgängig-Hinweis, aber keine Rückfrage (CSS-Kommentar: ein Griff je Ereignis). „+ Spieler dazu“ für Nachzügler. Eine Prüfsummenzeile nur bei Abweichung (BACKLOG „Prüfsumme“). Zahlen mit toLocaleString („3.000“). Das Blatt bekommt max-height 60vh, damit die Restzeit sichtbar bleibt. Add-on nur, wenn eine Add-on-Regel eingeführt wird.

<details><summary>Belege</summary>

- B59: #/session/live (Stände), zustaende/live-staende.png, eigen/live/staende-8.png

</details>

### [ ] 7.8 Abschlussbildschirm mit Abrechnung und Teilen, frühere Abende korrigierbar  
*Wirkung 5 · Aufwand L*

„Beenden“ (TischPage.tsx:136) führt auf einen Abschlussbildschirm, ohne Assistenten mit Schritten (EinrichtenPage: „Ein Bildschirm, kein Assistent“). Oben die Endstände mit Prüfzeile, darunter das berechnete Ergebnis und die Ausgleichszahlungen aus einer reinen Funktion lib/session/abrechnung.ts (Test: höchstens n−1 Zahlungen, Summe 0). Im Turniermodus kommt das Geld aus payout.ts nach Platz, im Cash-Modus aus Chips × Kurs. Unten [Teilen] über navigator.share({text}), sonst Zwischenablage mit Toast, und [Kopieren]. euroJeSpieler und punkteJeEuro werden in LaufendeSession und Abend gespeichert; alte Einträge bleiben lesbar. Frühere Abende: „Abend löschen“ mit Rückgängig, „Als Probe verwerfen?“ bei Abenden unter 10 Minuten, die Spalte „eingesetzt“ bzw. Netto, Endstände und Rebuys korrigierbar. Der Untertitel abende.ts:8 wird eine Zusammenfassung („3 Abende · 7 Personen · zuletzt Fr., 2. Okt.“). Die Knopf-Optik der Namen bleibt (bewusst). Vom Auftraggeber freizugeben: die Euro-Abrechnung zwischen Privatleuten, wegen E-010 (kein Echtgeld) und E-030 (reine Zahlenverwaltung). BACKLOG beschreibt sie gewollt.

<details><summary>Belege</summary>

- B57: #/session/live, #/session/abende, eigen/live/abend-detail.png, eigen/live/nach-beenden.png (zwei Sieger mit je 950 Chips); BACKLOG „Abrechnung: wer schuldet wem“
- B69: eigen/live/nach-beenden.png, eigen/live/abend-detail.png; i18n/pages/abende.ts:8
- B77: eigen/live/abend-detail.png; navigator.share nur in ShareCard/PotOddsDrill

</details>

### [ ] 7.9 Bereichsseite zeigt den laufenden Abend, Titel nach Zustand, Ausgang am Tisch  
*Wirkung 4 · Aufwand S*

Die Live-Karte aus HubPage.tsx (297ff.) wird eine gemeinsame Komponente und steht auch auf #/session. Der Titel (session.ts:11, SessionPage.tsx:108) heißt „Live-Session“ und nur bei laufender Runde „Der Abend läuft – seit 1:20 h“. Der Bereichsname bleibt nach E-011, weil auch der Bankroll dazugehört. Der Tisch bekommt oben links „‹ App“; unten sind nach Regel 8.1 höchstens drei Knöpfe erlaubt. Heute führt bei laufender Runde kein Weg aus TischPage außer „Beenden“. Den Kopfkommentar „vorher, währenddessen, danach“ in SessionPage korrigieren; die Reihenfolge der Kacheln bleibt (10a.3). Leerzustände einheitlich „Noch kein Abend gespeichert“.

<details><summary>Belege</summary>

- B21: Punkte ②/④ – zustaende/live-laufend.png, mobil-dunkel/session.png
- B67: #/session, mobil-dunkel/session.png, desktop/session_live_einrichten.png; Regel 10.11
- B89: mobil-dunkel/session.png, mobil-dunkel/session_bankroll.png, mobil-dunkel/session_abende.png

</details>

### [ ] 7.10 Ein Chip-Rechner für beide Bildschirme  
*Wirkung 4 · Aufwand M*

Für denselben Koffer (150/100/50, 5 Spieler) liefert src/lib/chips.ts heute weiß 5, Stack 1.650, Blinds 10/20, Einrichten (verteilung.ts + blinds.ts) dagegen weiß 1, Stack 380, Blinds 1/2. chips.ts wird ein Adapter auf verteile() und baueStruktur() (E-053: eine Rechnung nur an einer Stelle; blinds.ts lehnt die ×2,5-Sprünge ab). Ein Test prüft gleiche Werte. Ein gespeicherter „Mein Koffer“ mit Farbpunkten aus dem Chip-Rechner, auch in „Abend einrichten“ statt Freitext „weiß“. Am Ende „Mit diesem Koffer Abend einrichten →“. Auf dem Handy die Tabelle als Karten je Farbe (heute ist „ÜB…“ abgeschnitten), das Namensfeld breiter (heute „Schwa“).

<details><summary>Belege</summary>

- B64: #/session/chips, #/session/live/einrichten, mobil-dunkel/session_chips.png, mobil-dunkel/session_live_einrichten.png
- B12: mobil-dunkel/session_chips.png (Spalte „ÜB…“, Namensfeld „Schwa“)
- B14: desktop/session_live_einrichten.png (Chips als reine Textfelder)

</details>

### [ ] 7.11 „Abend einrichten“ merkt sich die Runde und zeigt einen Zeitplan  
*Wirkung 4 · Aufwand M*

(1) Namens-Chips „Zuletzt dabei“ aus spielerUebersicht() (lib/session/abende.ts), ein Tipp fügt hinzu. (2) Koffer, Dauer und Tempo vom letzten Abend als Vorbelegung statt des festen VORSCHLAG (EinrichtenPage.tsx:26), beim Start in einem eigenen Schlüssel abgelegt. (3) Die Struktur als schlichte Liste „Stufe · Blinds · ab ~20:40“ plus „Ende gegen 22:30“ statt knopfähnlicher Felder „1 / 2“, beim pausierten Start ab dem Startzeitpunkt gerechnet. Einzelne Stufen bearbeiten, Antes und Rebuy-Regeln werden nicht gebaut.

<details><summary>Belege</summary>

- B65: #/session/live/einrichten, mobil-dunkel/session_live_einrichten.png, eigen/live/einrichten-ergebnis.png

</details>

### [ ] 7.12 Auszahlung: Eingabe, die nicht verfälscht, und ein Text, der zur Zahl passt  
*Wirkung 4 · Aufwand S*

Feld() in PayoutPage.tsx klemmt heute bei jeder Eingabe; aus „10“ wird über „210“ der Wert 200. Künftig ein Textfeld mit zahlAusEingabe() (E-048): leer erlaubt, geklemmt wird erst bei onBlur. Einheit: Umschaltung Euro/Chips oder Übernahme aus dem laufenden Abend; kein fest verdrahtetes €, weil roundingHint „Schein oder Chip“ meint. Vorbelegung aus dem laufenden Abend (Spielerzahl, Rebuys × Buy-in). Die Faustregel „etwa jeder zehnte“ widerspricht der Tabelle in payout.ts (8 Spieler → 2 Plätze); den Text aus STRUKTUREN erzeugen und mit einem Test absichern. Anpassbare Prozente sind nachrangig.

<details><summary>Belege</summary>

- B66: #/session/auszahlung, mobil-dunkel/session_auszahlung.png, eigen/live/auszahlung-tippen.png
- B90: mobil-dunkel/session_auszahlung.png (Faustregel gegen „2 Plätze“)

</details>

### [ ] 7.13 Bankroll: Liste zuerst, regelkonforme Farben, Löschen mit Rückgängig, Spielerschutz  
*Wirkung 4 · Aufwand M*

Farben auf Bereichsgrün statt Gold und Freunde-Violett (Regel 10.9); Ergebniszahlen in --ergebnis-gut/-schlecht statt --ok/--danger (DESIGN Z. 79–84, E-026). Datum deutsch statt „2026-10-02“ ({s.date} in BankrollTracker.tsx). Die Liste kommt vor das 7-Felder-Formular, „+ Session“ öffnet es. ✕ löscht mit 5-s-Rückgängig. Die Kurve bekommt Null-Linie und Endwert. Vorbelegung Art „Live“ und leeres Spiel statt „Online“/„NL2 Cash“ (BankrollTracker.tsx 22–23). Live/Online als Segment statt <select>; das Datumsfeld bleibt nativ, wird gestaltet und bekommt lang='de'. Eine ruhige Fußzeile „Spiel mit Grenzen · Hilfe: check-dein-spiel.de“ nur auf Bankroll und Auszahlung. Das Abzeichen „Buchhalter“ überprüfen. Die Übernahme von Abenden kommt erst nach Punkt 7.8.

<details><summary>Belege</summary>

- B68: #/session/bankroll, mobil-dunkel/session_bankroll.png, eigen/live/bankroll-daten.png
- B104: mobil-dunkel/session_bankroll.png, eigen/live/bankroll-daten.png, mobil-dunkel/session_auszahlung.png
- B14: mobil-dunkel/session_bankroll.png (Datumsfeld „10/02/2026“, System-Select)

</details>

## Paket 8 · Profil, Konto und Einstellungen: aufgeräumt und eindeutig

**Ziel:** Das Profil zeigt Fortschritt statt einer 5280 px langen Sammelseite, Einstellungen und Konto sind sofort auffindbar, und Konto und Profil werden nicht mehr verwechselt.  
**Baut auf:** 2, 3

### [ ] 8.1 Einstellungen auf eine eigene Seite, die zerstörende Aktion zuletzt  
*Wirkung 4 · Aufwand M*

Neue Route /profil/einstellungen als gruppierte Liste (Konto, Darstellung, Daten, Über). „Fortschritt zurücksetzen …“ steht heute bei y=4042 direkt unter dem Farbmodus; künftig kommt es ans Ende hinter Backup, mit „Vorher sichern?“ und dem Backup-Knopf in der Bestätigung. #/profil zeigt nur noch Identität und Fortschritt. Einstieg über ein Zahnrad im Profil und über die Fußzeile der Seitenleiste aus Paket 2. E-036 nennt das Profil selbst eine offene Baustelle („Wand aus Nullen“).

<details><summary>Belege</summary>

- B27: mobil-dunkel/profil.png (5280 px; Einstellungen bei 3552), mobil-dunkel/freunde.png
- B102: mobil-dunkel/profil.png, desktop/profil.png, eigen/profil_d_3.png, eigen/profil_d_4.png

</details>

### [ ] 8.2 Konto und Profil trennen, die zwecklose E-Mail streichen  
*Wirkung 4 · Aufwand M*

Das Feld „E-Mail (optional, für die Profil-Zuordnung)“ wird nur gespeichert und angezeigt (AppState.tsx:849, ProfilePage.tsx:232) und entfällt, weil es der versprochenen Datensparsamkeit widerspricht. Begriffe: „Konto“ meint die Cloud mit E-Mail, „Profil“ die Person auf dem Gerät; „Cloud-Konto“, „Geräte-Sync“ und „Synchronisation“ werden vereinheitlicht. Die Texte zur Speicherung hängen am Zustand, statt sich zu widersprechen („doppelt auf diesem Gerät … zusätzlich in der Cloud“ gegen „Alle Daten liegen nur auf diesem Gerät“). Ein Profil ohne Namen heißt „Profil 1“ und bekommt den Anfangsbuchstaben als Avatar statt „?“.

<details><summary>Belege</summary>

- B91: eigen/sprache/profil_0.png, profil_2.png, profil_3.png, profil_4.png
- B102: Profil-E-Mail ohne Zweck, Widerspruch der Sicherungstexte

</details>

### [ ] 8.3 Konto-Einstieg ohne Sprung und mit einem echten Google-Knopf  
*Wirkung 4 · Aufwand S*

CloudAccountCard gibt während des Ladens (gemessen 1,96 s bei 4G) heute null zurück (Z. 23), danach springt eine ~550 px hohe Karte herein. Künftig steht dort ein Platzhalter in fester Kartenhöhe. „Mit Google anmelden“ (CloudAccountCard.tsx 126–134) wird nach Googles Branding-Vorgaben gestaltet: neutrale Fläche, farbiges G, kein goldener Hauptknopf. Er bleibt oben, wie der Codekommentar begründet. „Anmelden“ und „Neues Konto“ werden gleichwertig gestaltet statt Umrissknopf neben nacktem Text. Wie ein leeres lokales Profil mit dem Konto zusammengeführt wird, ist eine eigene Aufgabe.

<details><summary>Belege</summary>

- B105: eigen/vertrauen2/konto_laedt.png, eigen/profil_d_2.png, eigen/onboarding-name.png
- B14: eigen/profil_d_3.png (Anmelden umrandet, Neues Konto als Text)

</details>

### [ ] 8.4 Abzeichen kompakt und einheitlich  
*Wirkung 3 · Aufwand M*

Auf dem Profil höchstens 6 Abzeichen, dazu „Nächste 3“ und „Alle ansehen“; die gesperrten werden zu einer Zeile „Noch 19 Abzeichen zu entdecken“ statt rund 1700–2100 px grauer Kacheln. Die 22 Emoji-Abzeichen (badges.ts) werden SVG-Medaillen; gesperrte erhalten einen Umriss statt filter: grayscale(1). Das ist mit Regel 10.10 vereinbar, weil sie mit einem Zeichen zurücktreten. Das Kalender-Abzeichen zeigt deutsches Datum statt „July 17“.

<details><summary>Belege</summary>

- B5: eigen/profil_d_1.png, eigen/profil_h_2.png („July 17“); badges.ts
- B27: 22 Abzeichen von 720 bis ~2500 px
- B102: rund 1700 px graue, gesperrte Kacheln

</details>

### [ ] 8.5 Über, Kontakt und Feedback  
*Wirkung 4 · Aufwand M*

Eine Gruppe „Über“ in den Einstellungen mit den vier Versprechen (kein Echtgeld, kein Tracking, funktioniert offline, Herkunft jeder Zahl im Blatt „Warum diese Zahl“) sowie Version und Baustand aus Punkt 3.8, statt eines grauen Absatzes bei y=5019. Sobald legal.email eingetragen ist (Punkt 3.6): „Feedback geben“ und in ErrorBoundary.tsx „Fehlerbericht senden“ als mailto mit Version, Sprache, userAgent und error.message. Der Freunde-Eintrag erscheint in Profil und Navigation nur bei konfigurierter Cloud; die Route bleibt als Umleitung.

<details><summary>Belege</summary>

- B103: eigen/profil_d_5.png, src/components/ErrorBoundary.tsx, src/i18n/pages/profile.ts:85
- B84: Freunde-Eintrag ohne Cloud, Versionszeile
- B27: Freunde bei 3056 px praktisch versteckt

</details>

## Paket 9 · Nachschlagen, Desktop-Bedienung und Feinschliff

**Ziel:** Nachschlagen funktioniert auf jeder Breite ohne Abschneiden, Karten werden gewählt statt getippt, eine Suche findet alles, auf dem Desktop geht die Bedienung per Tastatur, und nirgends steht mehr ein abgeschnittenes Wort.  
**Baut auf:** 1, 2

### [ ] 9.1 Range-Matrix auf dem Handy vollständig sichtbar  
*Wirkung 4 · Aufwand M*

`.matrix { min-width: 400px }` (global.css 1144) läuft heute in einem ~318 px breiten Container über, rechts fehlen zweieinhalb Spalten. Unter 430 px die Zellen ohne min-width auf 1fr (etwa 23 px), die Beschriftung bei Pocket Pairs und Ecken verkleinern oder weglassen; den Namen zeigt Tippen in der vorhandenen Detailkarte (E-039 verlangt den zweiten Zugang, der Befund erfüllt E-039, statt ihm zu widersprechen). Die Zellen bekommen die Range-Tokens aus Paket 1. Die Spielerzahl 2–9 im Live-Coach wird ein einzeiliges Segment mit 8 gleichen Spalten, die Positions-Chips umbrechen nicht mehr („BB vs. BTN“).

<details><summary>Belege</summary>

- B12: mobil-dunkel/nachschlagen_ranges.png, eigen/ha_d_0.png, mobil-dunkel/nachschlagen_coach.png

</details>

### [ ] 9.2 Equity-Rechner mit Kartenauswahl statt Kürzel-Syntax  
*Wirkung 4 · Aufwand M*

Den vorhandenen CardPicker (cardpicker.ts, deutsche Texte) für Hand 1, Hand 2, die optionale Hand 3 und das Board einsetzen; bereits gewählte Karten sind gesperrt. Die Texteingabe („As Kh“) bleibt als Schnelleingabe. Der Untertitel in equitycalc.ts mit Anleitung zu s/h/d/c und „T“ wird ein Nutzensatz.

<details><summary>Belege</summary>

- B96: mobil-dunkel/nachschlagen_equity.png, eigen/coach_karten.png
- B14: mobil-dunkel/nachschlagen_equity.png (Kürzel-Eingabe neben Kartenauswahl im Coach)

</details>

### [ ] 9.3 Eine Suche für Werkzeuge, Lektionen und Begriffe  
*Wirkung 3 · Aufwand M*

Zuerst den Index zusammenführen: lib/suche/index.ts aus Lektionen (aus der Lernsuche), Glossar, allen Werkzeugen und Trainern samt keywords und den Live-Session-Seiten. Beide Felder (ReferencePage.tsx Z. 130ff., LearnPage.tsx) nutzen ihn, mit Gruppen „Werkzeuge · Lektionen · Begriffe“. Ein Test: „Bankroll“ findet Bankroll-Tracker, die Lektion aus M6 und den Glossarbegriff. Danach eine Lupe in der klebenden Kopfzeile und „/“ bzw. Strg+K auf dem Desktop.

<details><summary>Belege</summary>

- B25: eigen/nachschlagen-suche-bankroll.png, mobil-dunkel/nachschlagen.png, mobil-dunkel/lernen.png; SCREEN_STRUKTUR.md
- B81: Suche nicht per „/“ oder Strg+K erreichbar

</details>

### [ ] 9.4 Tastenkürzel am Desktop, kein Loch über den Drill-Knöpfen  
*Wirkung 3 · Aufwand M*

Ein Hook useTasten, der in Eingabefeldern schweigt: Quiz 1–4 bzw. A–D und Enter (QuizRunner.tsx 82–88 beschriftet heute mit A–D ohne Wirkung), Drill J/N bzw. ←/→, Übungstisch F/C/R, global „/“ für die Suche. Kbd-Hinweise an den Knöpfen und das Hochziehen der Drill-Knöpfe direkt unter die Situationskarte nur unter (hover:hover) and (pointer:fine); heute klafft dort ein ~170 px leerer Streifen. Eine „?“-Übersicht ist entbehrlich.

<details><summary>Belege</summary>

- B81: desktop/lernen_drill.png, eigen/tisch/desk-6max.png, desktop/nachschlagen.png; keydown nur in Onboarding, HandMatrix, lib/dialog/tastatur.ts

</details>

### [ ] 9.5 Tages-Quiz-Ergebnis teilen  
*Wirkung 3 · Aufwand S*

Am Ende des Tages-Quiz eine Ergebniszeile als Text über navigator.share({text, url}), sonst Zwischenablage mit Toast. Teilbilder (Canvas 1080×1350) und Abzeichen erst, wenn sich das Teilen von Text bewährt. Das Teilen des Abends steckt in Punkt 7.8. In Ergebnistexten Chips nennen, kein Geld.

<details><summary>Belege</summary>

- B77: zustaende/tagesquiz.png, #/lernen/tagesquiz; BACKLOG Z. 30

</details>

### [ ] 9.6 Nichts Abgeschnittenes, nichts Doppeltes, gleiche Ladetexte  
*Wirkung 3 · Aufwand S*

Den Durchgang (npm run daumen bzw. bedienbar) so erweitern, dass Abschneiden mit Ellipse als Fehler zählt; das deckt „NEUE BESTSE…“, „Carla Callst…“, „„Pot O“ und die Chip-Tabelle künftig automatisch auf. Dopplungen entfernen: Push/Fold sagt „Vereinfachte Nash-Ranges … ohne Antes“ in Untertitel und Fußnote. Ladetexte vereinheitlichen („berechne …“, „Rechne …“, „Daten werden geladen …“, „Einen Moment …“), soweit Punkt 1.6 sie nicht durch Platzhalter ersetzt. Die Modulkarten auf dem Handy einheitlich umbrechen lassen.

<details><summary>Belege</summary>

- B93: eigen/drill_antwort_dunkel.png, eigen/sprache/lernen_1.png, zustaende/tagesquiz.png, mobil-dunkel/lernen_trainer_pushfold.png, eigen/sprache/wdh_0.png
- B15: mobil-dunkel/lernen.png (Modulkarten, Platzhalter „„Pot O“)
- B11: abgeschnittene Botnamen („Anna „die St…“)

</details>

## Lücken aus der Vollständigkeitskritik

### [ ] Pro-Start ab Oktober 2026: Rückkehr aus dem Kauf, Ladezustand von /pro, Bestätigung und stimmige Pro-Seite  
*Wirkung 5 · gehört zu Paket 3*

Der Fahrplan erwähnt Monetarisierung nur beim Wort „Pro nur für das Abo“. SETUP_PAYMENTS.md plant den Start aber „ab Oktober 2026“, also jetzt. Der Kaufweg hat dabei einen echten Fehler: UpgradePage.tsx:31 leitet mit `if (!enabled) return <Navigate to="/" replace />` um, solange monetization.json noch lädt. Weil `enabled` beim ersten Rendern immer false ist, landet jeder direkte Aufruf von #/pro auf der Startseite. Genau dorthin schickt Stripe nach Kauf oder Abbruch zurück (ProProvider.tsx:192–193: successUrl/cancelUrl = …#/pro). Wer bezahlt, kommt also ohne jede Bestätigung auf der Startseite an. Dazu kommen Widersprüche auf der Pro-Seite: Die Tabelle sagt „Trainer 5 von 7 / Alle 7“ (i18n/pages/pro.ts:61), es gibt aber 8 Trainer (trainerliste.ts). Die Slogans „Pro macht dich zu dem Spieler, gegen den am Tisch keiner gern sitzt“ (pro.ts:8) und „genau die Situationen, die Geld kosten“ (pro.ts:44) stehen gegen den Ton aus E-010. Das Coach-Overlay wird als Pro-Nutzen beworben, obwohl Punkt 6.5 genau dieses Vorab-Overlay abschaffen will. PaywallModal.tsx baut seinen Dialog aus Inline-Stilen mit festem rgba-Gold (Z. 41–58) statt aus Tokens. Lösung: (1) In UpgradePage und CancelPage zuerst einen Zustand 'laedt' aus ProProvider abwarten und einen Platzhalter in Endhöhe zeigen; erst nach dem Laden umleiten. (2) Eine Route #/pro/danke bzw. den Parameter ?kauf=ok mit Bestätigung „Pro ist aktiv – gilt auf allen Geräten mit deinem Konto“ und einen Zustand „Zahlung wird bestätigt …“, solange der Webhook die Berechtigung noch nicht geschrieben hat. (3) Die Vergleichstabelle aus plan.ts erzeugen (FREE_MODULE_IDS, freeDailyLimit) und per Test absichern, damit Zahlen und Versprechen nicht auseinanderlaufen. (4) Die Nutzenzeilen an E-010 ausrichten, ohne „Geld kosten“ und „keiner gern sitzt“. (5) Paywall und ProLock auf die Bausteine aus Paket 1 umstellen. (6) Drei Tage und einen Tag vor Ende der Testphase ein ruhiger Hinweis, was danach gratis bleibt.

Beleg: Eigener Lauf eigen/luecken/k2.mjs mit monetization.json enabled:true: page.goto('#/pro') → URL #/ (gemessen), erst ein Hash-Wechsel nach dem Laden zeigt eigen/luecken/pro_an.png. Darin: „Trainer 5 von 7 / Alle 7“, „Alle 9 Module statt 4“, „Übungstisch ohne Limit … Coach-Overlay“. Code: UpgradePage.tsx:31, ProProvider.tsx:192–193, config.ts:65–68, pro.ts:8/44/61, PaywallModal.tsx:41–58; SETUP_PAYMENTS.md Z. 4 („ab Oktober 2026“).

### [ ] Gratis-/Pro-Grenze mit dem Fahrplan abgleichen: Lernschleife nicht hinter die Paywall, Sperren überall gleich anzeigen  
*Wirkung 5 · gehört zu Paket 3*

Mehrere Kernpunkte des Fahrplans setzen Funktionen voraus, die für Gratisnutzer nach Ende der Testphase gesperrt sind. plan.ts:46 sperrt 'review' (Wiederholen) mit freeDailyLimit 0, plan.ts:47 'play-coach'. Trotzdem soll die Startseite „n Fragen wiederholen“ anbieten (4.2), das Quiz-Ergebnis „kommt in deine Wiederholung“ sagen (5.1), das Tages-Quiz falsche Antworten in den Stapel legen (4.5), Trainerfehler sollen in den Stapel (5.9), und der neue Tisch-Coach (6.1/6.5) ist für Gratisnutzer gar nicht sichtbar. Heute sammelt addReviewItem für Gratisnutzer Fragen, die sie nie wiederholen dürfen. Die Sperren sind außerdem uneinheitlich markiert: Im Lernpfad tragen nur die Module ein Schloss. Die Kacheln Push/Fold-Trainer, Szenario-Trainer, Wiederholen und Pro-Insights (sogar mit „Neu“) zeigen keins, die Seiten dahinter sind aber gesperrt. Die Wiederholen-Seite erklärt erst den Stapel samt „0 fällig · 0 im Stapel“ und zeigt darunter „Diese Funktion gehört zu PokerMentor Pro.“. Lösung: Vor Paket 4 eine E-Nummer zur Grenze. Vorschlag: Wiederholen und die Bewertung nach der Aktion bleiben gratis, weil sie die Lernschleife bilden; Pro verkauft Tiefe (Module m4/m5/m7–m9, Szenario, Push/Fold, unbegrenzter Coach, Sync). Danach liest eine Funktion zugang(ziel) aus plan.ts das Schloss für jede Kachel in LearnPage.tsx, trainerliste.ts und Layout.tsx. Ein Test prüft, dass jede Route mit ProLock auch an ihrer Kachel ein Schloss hat. Die gesperrten Seiten zeigen statt der Einleitung eine Vorschau (z. B. 2 Beispiel-Spots) und den Satz, was gratis bleibt.

Beleg: Eigener Lauf eigen/luecken/k4.mjs (Testphase abgelaufen, Monetarisierung an): eigen/luecken/gesperrt_wiederholen.png (Erklärtext + „Pro-Funktion“), eigen/luecken/gesperrt_lernen.png bzw. gl_2.png (Push/Fold, Wiederholen, Pro-Insights ohne Schloss), eigen/luecken/gesperrt_tisch.png („Coach-Modus Pro“), eigen/luecken/gesperrt_m5.png. Code: plan.ts:43–53 und 63 (FREE_MODULE_IDS m1, m2, m3, m6), ReviewPage.tsx:91, PushFoldTrainer.tsx:77, ScenarioTrainer.tsx:88, ProInsightsPage.tsx:58, PlayPage.tsx:54.

### [ ] Layout hält größere Schrift aus: Prüflauf bei 200 % Schriftgröße  
*Wirkung 4 · gehört zu Paket 1*

Regel 10.15 sorgt dafür, dass die Schrift mitwächst; ob das Layout das trägt, prüft niemand. Bei html{font-size:200%} (Browser-Einstellung „Schriftgröße“, 390 px) entsteht horizontales Scrollen (scrollWidth 396 bei 390). Auf der Startseite laufen die Nachschlagen-Chips ineinander („GlossarStarthänd“), „Du“ wird rechts angeschnitten. Die Session-Kacheln heißen nur noch „Abend f…“, „Frühere A…“, „Chip-Rech…“, weil die Zeitmarken („Am Abend“, „Danach“, „Vorher“) daneben stehen bleiben. Im Preflop-Trainer verdeckt die klebende Leiste die Situationskarte samt Handkarten, und das Etikett heißt „TREFF…“. Spielkarten und Icons bleiben in px klein, während der Text daneben doppelt so groß ist. Lösung: (1) Ein npm-Lauf „gross“ mit 200 % Schriftgröße über alle Routen; er schlägt fehl bei scrollWidth > innerWidth, bei Ellipsen in Titeln (zusammen mit 9.6) und wenn .entscheidung Inhalt der Situationskarte überdeckt. (2) Nachschlagen-Chips und Session-Kacheln mit flex-wrap bzw. Marke unter dem Titel ab einer Container-Breite (Container-Query statt Viewport). (3) Die Höhe der Drill-Leiste aus dem Inhalt messen (--drill-bedienung-h per ResizeObserver) statt fest. (4) Kartengröße und Icons in em an die Schriftgröße koppeln, mit Obergrenze.

Beleg: Eigener Lauf eigen/luecken/k1.mjs: eigen/luecken/zoom_start.png (Chips überlappen, „Du“ angeschnitten), eigen/luecken/zoom_session.png („Abend f…“, „Frühere A…“, „Chip-Rech…“), eigen/luecken/zoom_preflop.png (Situationskarte unter der Leiste, „TREFF…“); gemessen scrollWidth 396 bei innerWidth 390 auf allen drei Seiten. DESIGN.md Regel 10.15 (Z. 757ff.) prüft nur die Schriftgrößen (schriftgroesse.test.ts), nicht das Layout.

### [ ] Lernstand je Thema: Stärken, Schwächen und der nächste Übungsschritt  
*Wirkung 4 · gehört zu Paket 8*

Erstklassige Lern-Apps zeigen, wie gut man ein Thema beherrscht, und schlagen das Schwächste zum Üben vor. Die Daten dafür liegen bereits vor: AppData führt trainers[trainerId] mit attempts, correct und bestStreak (AppState.tsx:629–645), completedLessons mit Quizergebnis je Lektion und reviews mit falsch beantworteten Fragen. Das Profil zeigt davon nur die Summe „Trainer-Antworten 0“ mit Prozentsatz (ProfilePage.tsx:85, 135–139). Die Spielstil-Seite wertet nur Übungstisch-Hände aus. Der Fahrplan ergänzt „Jetzt üben“ nur für Spielstil-Schwachstellen (6.10) und sortiert das Profil um (8.1/8.4), eine Übersicht nach Thema fehlt aber ganz. Lösung: Ein Block „Dein Lernstand“ im Profil, auf dem Desktop auch in der rechten Spalte der Startseite (2.4). Je Thema eine Zeile (Pot Odds, Outs, Handstärke, Preflop-Ranges, Push/Fold, Equity) mit Trefferquote der letzten 20 Antworten, Zahl der Antworten und einer Einstufung in drei Stufen („sicher“ / „wackelt“ / „noch offen“, ab mindestens 10 Antworten, darunter „noch zu wenig Daten“). Die schwächste Zeile bekommt „Jetzt üben“ in den Trainer und „Nachlesen“ in die Lektion (über die Zuordnung aus 5.7). Dafür speichert recordTrainer zusätzlich ein Ringpuffer-Feld letzte: boolean[20]. Keine Ranglisten, kein Vergleich mit anderen.

Beleg: eigen/profil_d_0.png (eine Kachel „Trainer-Antworten 0“, darunter nur Zähler), mobil-dunkel/lernen_statistik.png (Spielstil nur für Tischhände); Code: src/state/AppState.tsx AppData {trainers, completedLessons, reviews, daily}, recordTrainer Z. 629–645, ProfilePage.tsx:85 (trainerTotals = Summe über alle Trainer).

### [ ] Preflop gegen eine Erhöhung: Call-/3-Bet-Ranges je Position in Charts, Trainer und Coach  
*Wirkung 4 · gehört zu Paket 6*

Die häufigste und teuerste Preflop-Entscheidung von Anfängern ist die Antwort auf ein Open. Die App kennt dafür nur RFI-Charts und eine einzige Verteidigung: src/content/ranges.ts enthält RFI_CHARTS (Z. 24) und BB_DEFENSE_VS_BTN (Z. 70). Der Range-Viewer bietet entsprechend UTG, HJ, CO, BTN, SB und „BB vs. BTN“, der Preflop-Trainer nur „RFI / BB-Defense“ (CONCEPT.md Z. 54). Hat jemand erhöht, entscheidet preflopAdvice (lib/poker/coach.ts 424–468) über positionsunabhängige Listen PREMIUM/STRONG/SETMINE. AJo auf dem Button gegen ein UTG-Open bekommt also denselben Rat wie gegen ein Button-Open. Die Legendenfarbe „Call“, die Paket 1 als --range-call festlegt, kommt dadurch fast nirgends vor. Der Fahrplan schärft nur die RFI-Seite (6.1, 6.9). Lösung: Ein Datensatz „vs. Open“ (Fold / Call / 3-Bet) für die wichtigsten Paare: jede Position gegen UTG-, CO- und BTN-Open, SB und BB gegen jede Position. Er wird in tools/poker-math erzeugt und über npm run daten ausgeliefert (E-020), mit Quellenangabe im Blatt „Warum diese Zahl“. Im Range-Viewer kommt eine zweite Segmentzeile „Erstes Open / Gegen Open von …“ dazu, die Matrix dreifarbig mit den Range-Tokens. Im Preflop-Trainer ein Spot-Typ „vs. Open“, im Coach (coachForTable aus 6.1) die Ablösung der PREMIUM/STRONG-Listen durch diese Tabelle. Regressionstest: AJo BTN vs. UTG ≠ AJo BTN vs. CO.

Beleg: mobil-dunkel/nachschlagen_ranges.png und mobil-hell/nachschlagen_ranges.png (Segmente nur UTG/HJ/CO/BTN/SB/„BB vs. BTN“, Legende nur Raise/Fold), mobil-dunkel/nachschlagen_coach.png (Umschalter „Jemand hat erhöht“), zustaende/trainer-preflop.png; Code: src/content/ranges.ts:24/70, src/lib/poker/coach.ts:424–468, CONCEPT.md:54/104.

### [ ] Einstieg für Spieler mit Vorkenntnissen: Modultest statt Pflichtlektüre  
*Wirkung 3 · gehört zu Paket 5*

Ein großer Teil der Zielgruppe kann schon spielen, gerade wer über die Live-Session kommt. Der Lernpfad schickt trotzdem jeden mit „Hier weiter“ zu „So funktioniert Texas Hold’em“ (Startseite „ERSTE LEKTION“) und zählt erledigte Module nur über gelesene Lektionen. Ein Modul als bekannt zu markieren oder einen Einstufungstest zu machen ist nirgends vorgesehen; die Suche nach überspringen/Einstufung findet nur den Knopf „Überspringen“ im Namensschritt (Onboarding.tsx:22). Punkt 4.4 fragt zwar das Ziel ab („Poker lernen / Pokerabende leiten“), ändert aber den Einstiegspunkt nicht. Erfahrene Nutzer sehen deshalb 0 von 49 Lektionen, Rang „Neuling“ und Grundlagen-Fragen im Tages-Quiz. Lösung: Auf jeder Modulseite der Knopf „Kenne ich schon – Modultest“. Er zieht 8 Fragen aus den vorhandenen Lektionsquizzen des Moduls (Mischung aus 5.3). Wer mindestens 7 schafft, bekommt das Modul als „per Test bestanden“ (eigener Zustand in completedLessons, ohne XP-Regen und ohne Abzeichen „Erste Schritte“). Falsche Fragen kommen in die Wiederholung, und „Hier weiter“ springt zum nächsten offenen Modul. Im Onboarding (4.4) wird bei „Ich spiele schon“ derselbe Test für m1–m3 als Angebot gezeigt, nicht erzwungen.

Beleg: mobil-dunkel/start.png und mobil-hell/start.png („ERSTE LEKTION – So funktioniert Texas Hold’em“), eigen/luecken/gesperrt_lernen.png („Hier weiter“ an Modul 1, „0 / 5 Lektionen abgeschlossen“), eigen/profil_d_0.png („Neuling … 0 von 49 Lektionen“), erststart/willkommen.png, eigen/onboarding-name.png; Code: LearnPage.tsx:184 (naechste = erstes nicht fertiges Modul), Onboarding.tsx:13–33 (nur Sprache und Name).

## Verworfen in der Gegenprüfung

- **Keine Einstufung, kein Überspringen, und die Schwierigkeit springt im Pfad** — Gegenentscheidung: E-037 legt fest: genau ein Wegweiser „Hier weiter“, nämlich die erste Stufe, die nicht fertig ist. Eine Einstufung würde
- **Einheiten uneinheitlich: „100 bb“ und „2,5bb“ auf demselben Bildschirm, „BB“ im Drill, „1,5x“ statt „1,5×“** — Gegenentscheidung: DESIGN.md Regel 10a.7 zeigt „10 bb und 5 bb“ als Beispiel, legt die Schreibweise aber nicht als Regel fest. Eine Entsche
- **Freunde: leere Seite beim Laden und ein Versprechen ohne Funktion** — Gegenentscheidung: E-022 (keine Freunde-Rangliste) wird beachtet. Der Vorschlag nach einem kooperativen Signal widerspricht dem nicht, ist 
