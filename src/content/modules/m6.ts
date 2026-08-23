import type { Module } from '../types';

const m6: Module = {
  id: 'm6',
  title: 'Psychologie & Bankroll',
  subtitle: 'Tilt, Varianz und das Fundament langfristigen Erfolgs',
  icon: '🧘',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm6-l1',
      title: 'Tilt verstehen & kontrollieren',
      duration: 10,
      intro:
        'Der teuerste Gegner am Tisch bist oft du selbst. Diese Lektion zeigt dir, was Tilt wirklich ist, welche Formen er annimmt und wie du ihn mit konkreten Werkzeugen in den Griff bekommst.',
      sections: [
        {
          heading: 'Was Tilt ist – und was er dich kostet',
          body:
            '**Tilt** ist jeder emotionale Zustand, der die Qualität deiner Entscheidungen senkt. Das klassische Bild ist der wütende Spieler, der nach einem verlorenen Pot wild um sich setzt – aber Tilt ist breiter: Auch Angst, Langeweile, Übermut nach einem großen Gewinn oder resigniertes Autopilot-Spiel sind Tilt-Formen.\n\nWarum ist das so teuer? Deine Winrate (Gewinnrate, meist in **bb/100**, also Big Blinds pro 100 Hände gemessen) ist der Durchschnitt aus deinem besten Spiel (**A-Game**) und deinem schlechtesten (**C-Game**). Viele Spieler verlieren in einer Stunde Tilt mehr, als sie in mehreren Stunden konzentriertem Spiel gewinnen. Die Marge zwischen Gewinnen und Verlieren ist im Poker klein – wer sein C-Game nicht kontrolliert, verschenkt sie komplett.\n\nWichtig ist die Einsicht: Tilt ist keine Charakterschwäche, sondern eine normale menschliche Reaktion auf Frustration und wahrgenommene Ungerechtigkeit. Jeder Spieler tiltet – der Unterschied zwischen Gewinnern und Verlierern liegt darin, wie schnell sie es bemerken und wie konsequent sie reagieren.',
          tip: 'Miss deinen Erfolg nicht daran, ob du nie tiltest, sondern daran, wie schnell du Tilt erkennst und die Session beendest oder unterbrichst. Schadensbegrenzung ist die eigentliche Fähigkeit.',
        },
        {
          heading: 'Die vier häufigsten Tilt-Arten',
          body:
            'Tilt hat viele Gesichter. Vier Muster tauchen besonders oft auf:\n\n- **Ungerechtigkeits-Tilt**: Du verlierst als klarer Favorit (Bad Beat) und empfindest das als unfair. Typische Gedanken: "Immer trifft der!" Die Folge sind Frustration und lockere Calls.\n- **Revenge-Tilt**: Du willst den Pot von genau dem Spieler zurückholen, der ihn dir "genommen" hat, und spielst gezielt Hände gegen ihn, die du sonst folden würdest.\n- **Entitlement-Tilt**: Du glaubst, dir stehe ein Gewinn zu – weil du lange gefoldet, viel studiert oder "gut gespielt" hast. Poker schuldet dir aber nichts; diese Erwartung führt zu erzwungenen Bluffs und Overplays.\n- **Frustrations-Tilt**: Kein einzelnes Ereignis, sondern die Summe vieler kleiner Ärgernisse – Kartentotphasen, geplatzte Draws, verpasste Value. Er baut sich schleichend auf und entlädt sich irgendwann in einer unnötig großen Aktion.\n\nDie Unterscheidung ist praktisch wichtig, denn jede Art hat eigene Frühwarnzeichen. Wer weiß, zu welchem Muster er neigt, erkennt Tilt Minuten früher – und Minuten sind hier bares Geld.',
          table: {
            headers: ['Tilt-Art', 'Auslöser', 'Typisches Symptom'],
            rows: [
              ['Ungerechtigkeit', 'Bad Beat als Favorit', 'Lockere Calls, Selbstmitleid'],
              ['Revenge', 'Verlust gegen bestimmten Gegner', 'Zu viele Hände gegen diesen Spieler'],
              ['Entitlement', 'Gefühl, Gewinn "verdient" zu haben', 'Erzwungene Bluffs, Overplays'],
              ['Frustration', 'Viele kleine Ärgernisse in Folge', 'Schleichend aggressiver, ungeduldiger'],
            ],
          },
        },
        {
          heading: 'Erkenne deine persönlichen Auslöser',
          body:
            'Tilt-Kontrolle beginnt lange vor der kritischen Hand: mit **Selbstbeobachtung**. Führe für zwei bis drei Wochen ein kurzes Tilt-Protokoll. Notiere nach jeder Session in zwei, drei Sätzen: Was hat mich geärgert? Wann ist mein Spiel gekippt? Was habe ich danach anders gemacht?\n\nAchte dabei auf drei Ebenen:\n\n- **Situationen**: Bad Beats, Bluffs, die gecallt wurden, lange Kartentotphasen, ein bestimmter Gegnertyp.\n- **Körpersignale**: schnellerer Puls, angespannte Schultern, flache Atmung, hastiges Klicken – der Körper meldet Tilt oft früher als der Verstand.\n- **Spielsignale**: Du callst Raises, die du sonst foldest, öffnest mehr Hände, checkst deine Statistiken zwanghaft oder spielst plötzlich schneller.\n\nNach wenigen Wochen erkennst du dein Muster. Vielleicht bist du nach Bad Beats erstaunlich stabil, kippst aber, wenn ein schwacher Spieler dich zweimal auszahlt und dann alles zurückgewinnt. Genau für diese persönlichen Auslöser legst du dir dann feste Wenn-dann-Regeln zurecht: "Wenn X passiert, dann mache ich Y." Solche vorformulierten Reaktionen funktionieren auch dann noch, wenn dein klares Denken bereits leidet.',
          example:
            'Du bekommst A♠ A♥, spielst die Hand perfekt und bringst alles Geld als klarer Favorit in die Mitte. Dein Gegner callt mit K♦ K♣ – und trifft am River seinen König. Solche Hände verlierst du auch bei bestem Spiel in etwa jedem fünften Fall. Wer das als persönliche Ungerechtigkeit verbucht statt als eingepreiste Varianz, hat seinen wichtigsten Tilt-Auslöser gefunden.',
          cards: ['As', 'Ah', 'Kd', 'Kc'],
        },
        {
          heading: 'Gegenmittel im Moment: Pause und Atmung',
          body:
            'Wenn du Tilt-Symptome bemerkst, hilft kein Vorsatz ("Ich spiele jetzt einfach besser") – du brauchst eine **physische Unterbrechung**:\n\n- **Aussitzen oder aufstehen**: Online klickst du "Sit out", live verlässt du kurz den Tisch. Schon 3–5 Minuten Abstand senken das Erregungsniveau messbar. Du verpasst dadurch nichts – die Spiele laufen auch morgen noch.\n- **Atemtechnik**: Atme 4 Sekunden durch die Nase ein, 6 Sekunden langsam aus, und wiederhole das für ein bis zwei Minuten. Die verlängerte Ausatmung aktiviert das parasympathische Nervensystem und dämpft die Stressreaktion – ein einfacher, gut belegter Mechanismus.\n- **Hand parken statt grübeln**: Markiere die ärgerliche Hand für den späteren Review und verbiete dir, sie während der Session zu analysieren. Am Tisch entsteht daraus nur eine Grübelspirale.\n- **Realitätscheck**: Frage dich: "Würde ein Profi, der meine Karten nicht kennt, meine letzten drei Entscheidungen gut finden?" Wenn die ehrliche Antwort Nein ist, ist die Pause überfällig.\n\nDiese Werkzeuge wirken nur, wenn du sie **vor** der Session festlegst. Im Tilt selbst redest du dir sonst jede Ausnahme schön.',
          tip: 'Lege dir einen festen Anker zurecht: ein Glas Wasser holen nach jedem verlorenen großen Pot. Die Handlung ist banal – aber sie erzwingt genau die Unterbrechung, die dein Kopf gerade braucht.',
        },
        {
          heading: 'Stop-Loss und Abbruchkriterien',
          body:
            'Die wirksamste Tilt-Versicherung sind Regeln, die du **vor der Session** festlegst und mechanisch befolgst – gerade weil dein Urteilsvermögen im entscheidenden Moment nicht mehr neutral ist.\n\n- **Stop-Loss**: Beende die Session nach einem festen Verlust, z. B. **3 Buy-ins** (im Cash Game ist 1 Buy-in = 100bb). Nicht weil die Karten danach schlechter wären, sondern weil nach 3 verlorenen Buy-ins die Wahrscheinlichkeit hoch ist, dass du nicht mehr dein A-Game spielst.\n- **Zeitlimit**: Lege die maximale Sessionlänge vorher fest (z. B. 90–120 Minuten, dann Pause oder Schluss). Konzentration ist eine begrenzte Ressource.\n- **Abbruchkriterien**: Definiere klare Signale, bei denen sofort Schluss ist – du erwischst dich bei einem Revenge-Call, du spielst Hände, die nicht in deine Ranges gehören, du bist müde, hungrig oder abgelenkt, oder du spielst nur weiter, um "auf null zu kommen".\n\nDer letzte Punkt ist der gefährlichste Gedanke im Poker: Verlusten hinterherzujagen (**Chasing**) verwandelt einen normalen Downswing in ein Desaster. Die Session heute zu beenden kostet nichts – die Tische sind morgen wieder da, und dann spielst du wieder dein bestes Spiel.',
          example:
            'Regelwerk eines disziplinierten Spielers: "Stop-Loss 3 Buy-ins. Maximal 2 Stunden am Stück. Sofortiger Abbruch, wenn ich einen Call nicht sauber begründen kann oder nur weiterspiele, um Verluste aufzuholen." Auf einem Zettel neben dem Monitor – nicht verhandelbar.',
        },
      ],
      takeaways: [
        'Tilt ist jeder emotionale Zustand, der deine Entscheidungsqualität senkt – nicht nur Wut.',
        'Die vier häufigsten Formen: Ungerechtigkeits-, Revenge-, Entitlement- und Frustrations-Tilt.',
        'Beobachte Situationen, Körpersignale und Spielsignale, um deine persönlichen Auslöser zu finden.',
        'Physische Unterbrechung schlägt Willenskraft: Pause, verlängerte Ausatmung, Hand für später markieren.',
        'Stop-Loss (z. B. 3 Buy-ins), Zeitlimit und feste Abbruchkriterien legst du vor der Session fest – nicht mittendrin.',
      ],
      quiz: [
        {
          question: 'Was beschreibt den Begriff Tilt am treffendsten?',
          options: [
            'Wut nach einem Bad Beat',
            'Jeden emotionalen Zustand, der die Qualität deiner Entscheidungen senkt',
            'Eine Phase mit ungewöhnlich schlechten Karten',
            'Zu aggressives Spiel gegen schwache Gegner',
          ],
          correctIndex: 1,
          explanation:
            'Tilt umfasst mehr als Wut: Auch Angst, Übermut oder resigniertes Autopilot-Spiel sind Tilt, sobald sie deine Entscheidungen verschlechtern.',
        },
        {
          question:
            'Nach einem verlorenen Pot spielst du gezielt viele Hände gegen genau diesen Gegner, um dir das Geld zurückzuholen. Welche Tilt-Art ist das?',
          options: [
            'Entitlement-Tilt',
            'Frustrations-Tilt',
            'Revenge-Tilt',
            'Ungerechtigkeits-Tilt',
          ],
          correctIndex: 2,
          explanation:
            'Revenge-Tilt richtet sich gegen einen bestimmten Spieler: Du triffst Entscheidungen, um dich zu revanchieren, statt weil sie profitabel sind.',
        },
        {
          question: 'Warum sollten Stop-Loss-Regeln vor der Session festgelegt werden?',
          options: [
            'Weil nach großen Verlusten statistisch bessere Karten kommen',
            'Weil dein Urteilsvermögen im Tilt beeinträchtigt sein kann und nur vorab definierte Regeln dann noch zuverlässig greifen',
            'Weil der Anbieter Sessions sonst automatisch beendet',
            'Weil man nach einem Stop-Loss am nächsten Tag höhere Limits spielen darf',
          ],
          correctIndex: 1,
          explanation:
            'Im Tilt redest du dir Ausnahmen schön. Eine mechanische, vorab festgelegte Regel schützt dich genau dann, wenn du dir selbst nicht mehr trauen kannst. Auf die Kartenverteilung hat ein Stop-Loss keinerlei Einfluss.',
        },
        {
          question:
            '"Ich habe zwei Stunden lang diszipliniert gefoldet – jetzt steht mir dieser Pot einfach zu." Welches Tilt-Muster zeigt dieser Gedanke?',
          options: [
            'Entitlement-Tilt',
            'Revenge-Tilt',
            'Ungerechtigkeits-Tilt',
            'Gar keins – der Gedanke ist strategisch korrekt',
          ],
          correctIndex: 0,
          explanation:
            'Entitlement-Tilt ist das Gefühl, einen Gewinn verdient zu haben. Poker belohnt aber keine Geduld an sich – jede Hand wird für sich entschieden, und erzwungene Aktionen aus Anspruchsdenken sind teuer.',
        },
        {
          question:
            'Du bemerkst mitten in der Session Tilt-Symptome: schneller Puls, hastige Calls. Was ist die wirksamste Sofortmaßnahme?',
          options: [
            'Konzentrierter weiterspielen und sich zusammenreißen',
            'Auf ein niedrigeres Limit wechseln und dort weiterspielen',
            'Die ärgerliche Hand sofort gründlich analysieren',
            'Eine physische Pause machen: aussitzen, aufstehen, einige Minuten langsam ausatmen',
          ],
          correctIndex: 3,
          explanation:
            'Willenskraft allein reicht im Tilt selten. Eine physische Unterbrechung mit ruhiger, verlängerter Ausatmung senkt das Erregungsniveau – die Hand analysierst du später im Review, nicht am Tisch.',
        },
      ],
    },
    {
      id: 'm6-l2',
      title: 'Bankroll-Management',
      duration: 8,
      intro:
        'Bankroll-Management (BRM) entscheidet darüber, ob du die unvermeidlichen Schwankungen des Spiels überlebst. Es ist die eine Disziplin, die auch der beste Spieler nicht durch Talent ersetzen kann.',
      sections: [
        {
          heading: 'Warum BRM überlebenswichtig ist',
          body:
            'Deine **Bankroll** ist das Geld, das ausschließlich für Poker reserviert ist. Bankroll-Management bedeutet, deine Limits so zu wählen, dass normale Verlustphasen dich niemals ruinieren können.\n\nDer Kern des Problems: Selbst ein klar gewinnender Spieler verliert regelmäßig mehrere Buy-ins in Folge – das ist keine Ausnahme, sondern mathematischer Normalfall (mehr dazu in der nächsten Lektion). Wer mit 5 Buy-ins auf einem Limit spielt, kann mit gutem Spiel und normalem Pech alles verlieren. Das nennt man **Risk of Ruin**: die Wahrscheinlichkeit, trotz positiver Erwartung pleitezugehen, weil das Polster zu dünn war.\n\nBRM dreht die Logik um: Statt zu fragen "Wie viel kann ich gewinnen?", fragst du "Wie viele Schwankungen kann ich aushalten?". Mit genügend Buy-ins wird ein Downswing vom Existenzproblem zur statistischen Randnotiz – ärgerlich, aber folgenlos.\n\nDazu kommt der psychologische Effekt, der oft unterschätzt wird: Wer mit Geld spielt, dessen Verlust wehtut, spielt automatisch ängstlich (**Scared Money**). Du foldest gute Hände gegen Druck, verpasst dünne Value-Bets und bist leichter zu tilten. Eine komfortable Bankroll ist damit nicht nur Versicherung, sondern direkt Teil deiner Spielstärke.',
          tip: 'Scared Money ist doppelt teuer: Es kostet dich EV in jeder Hand und macht dich anfälliger für Tilt. Wenn dir ein verlorener Buy-in den Abend verdirbt, spielst du zu hoch.',
        },
        {
          heading: 'Richtwerte für deine Bankroll',
          body:
            'Wie viele Buy-ins du brauchst, hängt vom Format ab, denn die Formate schwanken unterschiedlich stark:\n\n- **Cash Game**: mindestens **25–50 Buy-ins** (1 Buy-in = 100bb). 25 ist die absolute Untergrenze für Freizeitspieler auf Micro-Limits, 50 der solide Standard.\n- **Sit & Gos**: mindestens **50 Buy-ins**. Die feste Auszahlungsstruktur erzeugt mehr Schwankung als Cash.\n- **MTTs (Multi-Table-Turniere)**: mindestens **100 Buy-ins**, bei großen Feldern eher deutlich mehr. Der Grund: Selbst gute Turnierspieler erreichen nur in einer Minderheit der Turniere die Geldränge, und der Gewinn konzentriert sich auf seltene tiefe Runs.\n\nDiese Zahlen sind Mindestwerte, keine Optimalwerte. Je ernsthafter du spielst, je aggressiver dein Stil und je knapper deine Winrate, desto mehr Puffer brauchst du. Wer nachweislich stark schlagbare Spiele spielt und problemlos neu einzahlen könnte, darf sich am unteren Rand bewegen – wer von Poker nicht abhängig sein will oder schwer nachladen kann, orientiert sich am oberen.',
          table: {
            headers: ['Format', 'Mindestempfehlung', 'Grund'],
            rows: [
              ['Cash Game', '25–50 Buy-ins (à 100bb)', 'Moderate Varianz'],
              ['Sit & Go', '50+ Buy-ins', 'Feste Payout-Struktur, höhere Varianz'],
              ['MTT', '100+ Buy-ins', 'Seltene große Auszahlungen, sehr hohe Varianz'],
            ],
          },
          example:
            'Du willst NL10 spielen (Cash Game mit 10 € Buy-in). Nach der 50-Buy-in-Regel brauchst du dafür eine Poker-Bankroll von 500 €. Mit 250 € (25 Buy-ins) ist NL10 gerade noch vertretbar – mit 100 € gehörst du auf NL2 oder NL5.',
        },
        {
          heading: 'Aufsteigen mit Plan, Absteigen ohne Diskussion',
          body:
            'Limits sind keine Statussymbole, sondern eine Funktion deiner Bankroll. Daraus folgen zwei Regeln:\n\n- **Konservativ aufsteigen**: Steige erst auf, wenn deine Bankroll das neue Limit voll trägt (z. B. 40–50 Buy-ins des höheren Limits) und du das aktuelle Limit über eine ordentliche Stichprobe geschlagen hast. Ein **Shot** – der Versuch auf dem höheren Limit – ist in Ordnung, aber mit festem Budget: etwa 3–5 Buy-ins, und bei Verlust gehst du kommentarlos zurück.\n- **Konsequent absteigen**: Fällt deine Bankroll unter die Schwelle deines aktuellen Limits, steigst du sofort ab. Nicht "noch eine Session abwarten", nicht "erst mal zurückgewinnen". Genau dieses Zögern hat mehr Bankrolls zerstört als jeder Downswing.\n\nAbsteigen fühlt sich wie eine Niederlage an – ist es aber nicht. Es ist der Mechanismus, der dafür sorgt, dass du **immer** weiterspielen kannst. Auf dem niedrigeren Limit gewinnst du Selbstvertrauen und Buy-ins zurück und steigst dann sauber wieder auf. Der Spieler, der stur oben bleibt, spielt mit Scared Money gegen bessere Gegner – die schlechteste Kombination, die es gibt.',
          example:
            'Deine Bankroll: 1.000 €. Du spielst NL10 (100 Buy-ins – sehr komfortabel). Dein Plan: bei 1.250 € (50 Buy-ins für NL25) ein Shot auf NL25 mit maximal 4 Buy-ins Budget. Fällt die Bankroll dabei unter 1.150 €, geht es zurück auf NL10 – automatisch, ohne Debatte.',
        },
        {
          heading: 'Strikte Trennung: Bankroll ist nicht Privatgeld',
          body:
            'Die wichtigste Regel steht über allen Zahlen: **Deine Poker-Bankroll ist strikt vom Privatgeld getrennt – und sie besteht ausschließlich aus Geld, dessen Totalverlust dein Leben nicht verändert.**\n\nKonkret heißt das:\n\n- Führe die Bankroll getrennt: eigenes Unterkonto, eigenes E-Wallet oder zumindest eine saubere schriftliche Buchführung.\n- Miete, Rechnungen, Rücklagen, Notgroschen: tabu. Niemals mit Geld spielen, das du brauchst oder in absehbarer Zeit brauchen wirst.\n- Nachschießen aus dem Privatvermögen ist eine bewusste, seltene Entscheidung in ruhiger Minute – niemals eine spontane Reaktion auf eine Verlust-Session.\n- Auszahlungen sind erlaubt und gesund: Wer langfristig gewinnt, darf sich davon etwas gönnen. Definiere aber vorher, ab welcher Grenze du auszahlst, damit die Bankroll ihre Funktion behält.\n\nDiese Trennung hat zwei Effekte. Finanziell schützt sie dein reales Leben vollständig vor den Schwankungen des Spiels. Psychologisch macht sie aus der Bankroll eine reine Recheneinheit: 3 verlorene Buy-ins sind dann kein "verlorener Wocheneinkauf", sondern eine Zahl in deiner Poker-Buchhaltung – und genau diese Distanz brauchst du, um sauber weiterzuspielen. Wenn diese Trennung bei dir verschwimmt, ist das ein ernstes Warnsignal (mehr dazu in Lektion 5).',
          tip: 'Ein einfacher Selbsttest: Könntest du deine komplette Bankroll heute verlieren, ohne dass sich an deinem Alltag irgendetwas ändert? Wenn nein, ist sie zu groß – oder es ist keine Bankroll, sondern Geld, das dort nicht hingehört.',
        },
        {
          heading: 'Die häufigsten BRM-Fehler',
          body:
            'Fast alle Bankroll-Katastrophen folgen denselben Mustern:\n\n- **Aufsteigen, um Verluste aufzuholen**: Nach einem Downswing auf ein höheres Limit wechseln, "weil es da schneller zurückkommt". Höheres Limit bedeutet größere Schwankungen und stärkere Gegner – im schlechtesten mentalen Zustand suchst du dir die schwerste Aufgabe.\n- **Die Bankroll-Regeln als Schönwetter-Regeln behandeln**: Richtwerte, die nur gelten, solange du gewinnst, sind wertlos. Ihr ganzer Sinn ist der Ernstfall.\n- **Alles auf einem Limit riskieren**: Mit der gesamten Bankroll an einem Abend an den Tisch – ein einziger schlechter Lauf genügt.\n- **Erfolge zu früh hochrechnen**: Nach 5.000 guten Händen die Winrate auf das Jahr hochrechnen und Limits überspringen. Kurzfristige Ergebnisse sagen fast nichts aus (Lektion 3).\n- **Keine Aufzeichnungen führen**: Wer seine Ergebnisse nicht sauber dokumentiert, verklärt sie. Das Gedächtnis erinnert Gewinne besser als Verluste – ein bekannter kognitiver Bias.\n\nDie gute Nachricht: BRM ist die am leichtesten erlernbare Disziplin im Poker. Sie verlangt kein Talent, nur Ehrlichkeit und Konsequenz – und sie ist die Voraussetzung dafür, dass all dein strategisches Wissen überhaupt Zeit bekommt, sich auszuzahlen.',
        },
      ],
      takeaways: [
        'BRM minimiert dein Risk of Ruin: Mit zu wenigen Buy-ins kann auch ein Gewinner pleitegehen.',
        'Richtwerte: Cash mindestens 25–50 Buy-ins, Sit & Gos 50+, MTTs 100+ Buy-ins.',
        'Konservativ aufsteigen, bei Unterschreiten der Schwelle sofort und ohne Diskussion absteigen.',
        'Die Bankroll ist strikt vom Privatgeld getrennt – niemals mit Geld spielen, das du brauchst.',
        'Scared Money verschlechtert dein Spiel direkt: Eine komfortable Bankroll ist Teil deiner Spielstärke.',
      ],
      quiz: [
        {
          question: 'Was beschreibt der Begriff Risk of Ruin?',
          options: [
            'Das Risiko, gegen stärkere Gegner zu verlieren',
            'Die Wahrscheinlichkeit, trotz positiver Gewinnerwartung die gesamte Bankroll zu verlieren',
            'Den maximalen Verlust pro Session',
            'Die Gebühr, die der Anbieter pro Hand einbehält',
          ],
          correctIndex: 1,
          explanation:
            'Risk of Ruin ist die Chance, durch normale Schwankungen pleitezugehen, obwohl man langfristig gewinnend spielt. Genügend Buy-ins drücken dieses Risiko auf nahe null.',
        },
        {
          question: 'Wie viele Buy-ins gelten im Cash Game als sinnvolle Mindestbankroll?',
          options: ['5–10', '25–50', '100–200', '10–15'],
          correctIndex: 1,
          explanation:
            '25 Buy-ins sind die Untergrenze, 50 der solide Standard. Weniger Puffer bedeutet, dass ein normaler Downswing existenzbedrohend für die Bankroll wird.',
        },
        {
          question: 'Warum brauchen MTTs deutlich mehr Buy-ins (100+) als Cash Games?',
          options: [
            'Weil Turniere länger dauern',
            'Weil die Buy-ins bei Turnieren höher sind',
            'Weil selbst gute Spieler nur selten tief laufen und die Gewinne sich auf wenige große Auszahlungen konzentrieren',
            'Weil man in Turnieren nicht nachkaufen darf',
          ],
          correctIndex: 2,
          explanation:
            'In MTTs kommt der Gewinn aus seltenen tiefen Runs, während die meisten Turniere ohne Cash enden. Diese Struktur erzeugt sehr hohe Varianz – und die verlangt ein viel größeres Polster.',
        },
        {
          question:
            'Deine Bankroll fällt durch einen Downswing unter die Mindestschwelle deines Limits. Was ist die richtige Reaktion?',
          options: [
            'Auf dem Limit bleiben und auf die Aufholjagd setzen',
            'Ein Limit aufsteigen, um Verluste schneller zurückzugewinnen',
            'Privatgeld nachschießen, um das Limit zu halten',
            'Sofort auf das niedrigere Limit absteigen und dort weiterspielen',
          ],
          correctIndex: 3,
          explanation:
            'Absteigen ist der eingebaute Schutzmechanismus des BRM. Aufsteigen zum Aufholen kombiniert höhere Varianz mit stärkeren Gegnern und schlechtem mentalen Zustand – der klassische Weg in den Ruin.',
        },
        {
          question: 'Welches Geld gehört in eine Poker-Bankroll?',
          options: [
            'Alles, was am Monatsende auf dem Konto übrig ist',
            'Ausschließlich Geld, dessen kompletter Verlust deinen Alltag und deine Verpflichtungen nicht berührt',
            'Auch Rücklagen, solange man diszipliniert spielt',
            'Geliehenes Geld, wenn die Winrate nachweislich positiv ist',
          ],
          correctIndex: 1,
          explanation:
            'Die Bankroll ist strikt vom Privatgeld getrennt und besteht nur aus frei verfügbarem Geld. Rücklagen, benötigtes oder geliehenes Geld haben dort niemals etwas zu suchen – unabhängig von jeder Winrate.',
        },
      ],
    },
    {
      id: 'm6-l3',
      title: 'Varianz verstehen',
      duration: 9,
      intro:
        'Varianz ist der Grund, warum gute Spieler wochenlang verlieren und schlechte Spieler monatelang gewinnen können. Wer sie versteht, bewertet sein Spiel realistisch – und lässt sich von Ergebnissen nicht mehr täuschen.',
      sections: [
        {
          heading: 'Gute Entscheidung, schlechtes Ergebnis',
          body:
            'Poker ist ein Spiel unvollständiger Information mit Zufallselement. Deshalb gilt ein Grundsatz, der anfangs schwer zu akzeptieren ist: **Die Qualität einer Entscheidung ist unabhängig von ihrem Ergebnis.**\n\nDas Bindeglied ist der **Erwartungswert (EV)**: der durchschnittliche Gewinn oder Verlust einer Entscheidung, wenn man sie unendlich oft wiederholen würde. Eine +EV-Entscheidung ist richtig – auch wenn sie diesmal verliert. Eine -EV-Entscheidung ist falsch – auch wenn sie diesmal gewinnt.\n\nDas beste Beispiel: Du bringst A♣ A♦ preflop all-in gegen K♥ K♠. Deine **Equity** (Gewinnwahrscheinlichkeit) liegt bei rund 80 %. Das heißt aber auch: In etwa einem von fünf Fällen verlierst du diese perfekt gespielte Hand. Das ist kein Fehler im System – es ist das System.\n\nGefährlich wird es, wenn du aus Ergebnissen falsche Schlüsse ziehst (**Results-Oriented Thinking**): Du gewinnst mit einem schlechten Call und hältst ihn fortan für gut. Du verlierst mit einem korrekten Bluff und traust dich nie wieder. Beides verschlechtert dein Spiel systematisch. Die richtige Frage nach jeder Hand lautet nicht "Habe ich gewonnen?", sondern "War meine Entscheidung mit den damals verfügbaren Informationen richtig?".',
          cards: ['Ac', 'Ad', 'Kh', 'Ks'],
          example:
            'Zwei Sessions, dieselbe Situation: Du callst am River korrekt mit einem Bluff-Catcher, weil dein Gegner rechnerisch oft genug blufft. Montag zeigt er einen Bluff – du gewinnst. Dienstag zeigt er Value – du verlierst. Beide Calls waren exakt gleich gut. Wer nur den Dienstag erinnert und den Call künftig unterlässt, hat aus Varianz eine falsche Lektion gelernt.',
        },
        {
          heading: 'Downswings sind mathematisch normal',
          body:
            'Ein **Downswing** ist eine längere Verlustphase trotz solidem Spiel – und er ist keine Möglichkeit, sondern eine Gewissheit. Die Größenordnungen überraschen die meisten:\n\n- Ein guter Cash-Game-Spieler mit einer Winrate von 5bb/100 und typischer Standardabweichung (rund 80–100bb/100) muss im Laufe seiner Karriere mit Downswings von **20–30 Buy-ins** rechnen. Auch deutlich tiefere Einbrüche sind über hunderttausende Hände nicht ausgeschlossen.\n- **Breakeven- oder Verlustphasen über 20.000–50.000 Hände** kommen bei dieser Winrate immer wieder vor – das können je nach Spielpensum mehrere Wochen bis Monate sein.\n- In MTTs ist es extremer: Selbst starke Turnierspieler erreichen meist nur in grob 15–20 % ihrer Turniere die Geldränge. Serien von 30, 50 oder mehr Turnieren ohne nennenswerten Cash sind völlig normal.\n\nDiese Zahlen sind kein Grund zur Entmutigung, sondern zur Kalibrierung: Wenn du weißt, dass 20 verlorene Buy-ins im Rahmen des Normalen liegen, gerätst du nicht in Panik, wechselst nicht hektisch deine Strategie und wirfst nicht dein BRM über Bord. Genau hier greifen die Buy-in-Regeln aus Lektion 2: Sie sind exakt so dimensioniert, dass normale Downswings dich nicht ruinieren.',
          tip: 'Rechne Downswings vorab in deine Erwartung ein, dann verlieren sie ihren Schrecken. Die Frage ist nie, ob dein nächster Downswing kommt – nur wann, und ob deine Bankroll und dein Kopf darauf vorbereitet sind.',
        },
        {
          heading: 'Stichprobengröße: Wann Zahlen etwas bedeuten',
          body:
            'Deine Winrate in bb/100 ist eine Schätzung – und wie jede Schätzung wird sie erst mit wachsender **Stichprobe** belastbar. Die Schwankung zwischen einzelnen Sessions ist so groß, dass kurze Zeiträume fast nichts über dein Können aussagen.\n\nAls grobe Orientierung:\n\n- **1.000–5.000 Hände**: praktisch reine Varianz. Ergebnisse in beide Richtungen bedeutungslos.\n- **10.000–20.000 Hände**: erste grobe Tendenz, aber ein Glücks- oder Pechlauf kann das Bild noch komplett verzerren.\n- **50.000 Hände**: brauchbare Orientierung, aber immer noch mit großer Unsicherheit.\n- **100.000+ Hände**: halbwegs belastbar – und selbst hier bleibt ein Unsicherheitsband von mehreren bb/100 um die gemessene Winrate.\n\nZur Einordnung: 100.000 Hände sind online bei moderatem Pensum viele Monate Spielzeit, live mit etwa 25–30 Händen pro Stunde mehrere Jahre. Deshalb gilt: Bewerte dich kurzfristig **niemals über Ergebnisse**. Aussagekräftiger sind Fragen wie: Treffe ich meine Entscheidungen begründet? Finde ich im Review echte Fehler? Verstehe ich Konzepte heute, die ich vor drei Monaten nicht verstanden habe? Diese Signale reagieren sofort – deine Winrate erst nach zehntausenden Händen.',
          table: {
            headers: ['Stichprobe', 'Aussagekraft der Winrate'],
            rows: [
              ['1.000–5.000 Hände', 'Praktisch keine – reine Varianz'],
              ['10.000–20.000 Hände', 'Grobe Tendenz, stark verzerrbar'],
              ['50.000 Hände', 'Brauchbare Orientierung'],
              ['100.000+ Hände', 'Halbwegs belastbar, mit Restunsicherheit'],
            ],
          },
        },
        {
          heading: 'Der Fokus auf Entscheidungsqualität',
          body:
            'Wenn Ergebnisse kurzfristig fast nichts bedeuten, brauchst du einen anderen Maßstab. Der einzige, der funktioniert: **Entscheidungsqualität**.\n\nPraktisch heißt das:\n\n- **Bewerte Hände nach dem Prozess**: Hattest du einen Plan für die Hand? Kannst du Bet, Call oder Fold mit Ranges, Equity und Position begründen? Dann war die Hand gut gespielt – egal, wer den Pot bekam.\n- **Trenne Review von Emotion**: Analysiere große Pötte erst mit zeitlichem Abstand. Direkt nach der Session bewertet dein Kopf das Ergebnis mit, ob du willst oder nicht.\n- **Feiere richtige Folds und korrekte verlorene Hände**: Ein disziplinierter Fold, der sich später als richtig herausstellt, ist ein größerer Erfolg als ein gewonnener Coinflip – auch wenn er sich nicht so anfühlt.\n- **Führe zwei Konten im Kopf**: eines für Ergebnisse (interessiert langfristig), eines für Entscheidungen (interessiert jeden Tag). Nur das zweite kannst du direkt kontrollieren.\n\nDiese Haltung hat einen doppelten Nutzen. Strategisch lernst du schneller, weil du echte Fehler von Pech unterscheidest. Mental wirst du stabiler, weil dein Selbstwert nicht mehr an der Tagesbilanz hängt – die stärkste Tilt-Prophylaxe, die es gibt. Varianz kannst du nicht abschalten. Aber du kannst dafür sorgen, dass sie nur dein Geld kurzfristig bewegt – nicht deine Entscheidungen.',
          tip: 'Stelle dir nach jeder kniffligen Hand genau eine Frage: "Würde ich in derselben Situation mit denselben Informationen wieder so spielen?" Wenn ja, abhaken – das Ergebnis war nur Varianz. Wenn nein, hast du echtes Lernmaterial gefunden.',
        },
      ],
      takeaways: [
        'Die Qualität einer Entscheidung ist unabhängig vom Ergebnis – bewerte den EV, nicht den Ausgang.',
        'Selbst mit A♣ A♦ gegen K♥ K♠ verlierst du rund jedes fünfte All-in: Verlieren als Favorit ist eingepreist.',
        'Downswings von 20–30 Buy-ins und Breakeven-Phasen über zehntausende Hände sind für Gewinner normal.',
        'Eine Winrate wird erst über zehntausende Hände (Richtung 100.000) halbwegs belastbar.',
        'Kurzfristiger Maßstab ist die Entscheidungsqualität – Ergebnisse zählen nur langfristig.',
      ],
      quiz: [
        {
          question:
            'Du gehst mit A♣ A♦ preflop all-in, dein Gegner callt mit K♥ K♠ und gewinnt am River. Wie bewertest du deine Entscheidung?',
          options: [
            'Fehler – ich hätte die Asse vorsichtiger spielen müssen',
            'Richtig gespielt: Mit rund 80 % Equity war das All-in klar +EV, das Ergebnis ist Varianz',
            'Unklar – das hängt vom Ergebnis ab',
            'Richtig, aber nur weil der Pot groß war',
          ],
          correctIndex: 1,
          explanation:
            'Asse gegen Könige preflop ist nahezu der bestmögliche Spot. Rund 20 % Verlustwahrscheinlichkeit gehören dazu – die Entscheidung bleibt korrekt, unabhängig vom Ausgang dieser einen Hand.',
        },
        {
          question:
            'Ab welcher Größenordnung wird eine gemessene Winrate halbwegs belastbar?',
          options: [
            'Nach etwa 1.000 Händen',
            'Nach etwa 5.000 Händen',
            'Nach einer erfolgreichen Woche',
            'Erst nach zehntausenden Händen, Richtung 100.000',
          ],
          correctIndex: 3,
          explanation:
            'Die Session-zu-Session-Schwankung ist enorm. Unter 10.000 Händen dominiert reine Varianz; erst im Bereich von 50.000–100.000+ Händen wird die Winrate zur brauchbaren Schätzung – mit Restunsicherheit.',
        },
        {
          question:
            'Ein solider Gewinner (5bb/100) verliert über mehrere Wochen 22 Buy-ins, obwohl er sein Spiel im Review als gut bewertet. Was ist die wahrscheinlichste Erklärung?',
          options: [
            'Er ist in Wahrheit ein Verlierer geworden und sollte die Strategie komplett umstellen',
            'Ein normaler Downswing – Einbrüche dieser Größenordnung gehören zur Karriere jedes Gewinners',
            'Die Software oder das Kartenglück ist manipuliert',
            'Downswings über 10 Buy-ins sind bei Gewinnern mathematisch unmöglich',
          ],
          correctIndex: 1,
          explanation:
            'Downswings von 20–30 Buy-ins liegen bei typischer Varianz voll im Erwartbaren. Solange der Review keine systematischen Fehler zeigt, ist die richtige Reaktion: BRM einhalten, weiterspielen, nichts Hektisches ändern.',
        },
        {
          question: 'Was beschreibt Results-Oriented Thinking?',
          options: [
            'Entscheidungen anhand ihres zufälligen Ausgangs statt anhand ihres Erwartungswerts zu bewerten',
            'Das konsequente Setzen von Ergebnis-Zielen für jede Session',
            'Die Analyse von Ergebnissen über große Stichproben',
            'Eine Strategie, die auf maximale Pots abzielt',
          ],
          correctIndex: 0,
          explanation:
            'Results-Oriented Thinking heißt: Ein Call war "gut", weil er diesmal gewann. So lernst du aus Zufall statt aus Logik – und verstärkst systematisch falsche Gewohnheiten.',
        },
        {
          question:
            'Warum ist der Fokus auf Entscheidungsqualität auch mental wertvoll?',
          options: [
            'Weil er garantiert, dass Downswings kürzer ausfallen',
            'Weil man damit die Varianz reduziert',
            'Weil der Selbstwert nicht mehr an der Tagesbilanz hängt – das schützt vor Tilt und Panikreaktionen',
            'Weil Gegner prozessorientierte Spieler schlechter lesen können',
          ],
          correctIndex: 2,
          explanation:
            'Varianz lässt sich nicht abschalten. Aber wer sich über Entscheidungen statt über Ergebnisse definiert, bleibt in Downswings stabil – die wirksamste Tilt-Prophylaxe überhaupt.',
        },
      ],
    },
    {
      id: 'm6-l4',
      title: 'Mindset & Lernroutine',
      duration: 9,
      intro:
        'Zwischen einem Freizeitspieler und einem sich stetig verbessernden Spieler liegt selten Talent – sondern eine Routine. Diese Lektion baut dir ein Lernsystem, das in einen normalen Alltag passt.',
      sections: [
        {
          heading: 'Wachstums-Mindset: Fehler sind Daten',
          body:
            'Ein **Wachstums-Mindset** (Growth Mindset) bedeutet: Du betrachtest Pokerfähigkeit nicht als festen Wesenszug ("Ich bin halt kein Mathe-Mensch"), sondern als trainierbare Kompetenz. Für Poker ist diese Haltung keine Wohlfühl-Floskel, sondern eine Arbeitsgrundlage:\n\n- **Fehler sind Lernmaterial, keine Urteile.** Jede aufgedeckte Schwäche in deinem Spiel ist ein konkreter, bearbeitbarer Verbesserungspunkt – und damit wertvoller als zehn gewonnene Sessions, aus denen du nichts mitnimmst.\n- **Vergleiche dich mit deinem früheren Ich**, nicht mit Regulars, die seit Jahren spielen. Die relevante Frage ist: Verstehe ich heute Dinge, die ich vor drei Monaten nicht verstanden habe?\n- **Suche aktiv nach Widerlegung.** Schwache Spieler wollen bestätigt werden ("Der Call war doch okay, oder?"), starke Spieler wollen ihre Fehler finden. Wenn dich Kritik an einer Hand ärgert statt interessiert, hast du einen blinden Fleck entdeckt.\n\nDieses Mindset verbindet sich direkt mit der Varianz-Lektion: Weil Ergebnisse kurzfristig zufällig sind, ist ehrliche Fehleranalyse dein einziger verlässlicher Fortschrittsmesser. Wer Fehler leugnet, um sich besser zu fühlen, nimmt sich selbst das einzige Instrument, mit dem sich Fortschritt überhaupt feststellen lässt.',
          tip: 'Formuliere Fehler immer als offene Aufgabe statt als Urteil: nicht "Ich spiele Draws schlecht", sondern "Ich muss lernen, wann meine Flush Draws als Semi-Bluff raisen sollen". Das eine lähmt, das andere gibt dir die nächste Studieneinheit vor.',
        },
        {
          heading: 'Study/Play-Balance: Die 20–30-Prozent-Regel',
          body:
            'Nur spielen macht dich schnell im Ausführen deiner bestehenden Fehler. Nur studieren macht dich zum Theoretiker ohne Umsetzung. Die Faustregel für stetige Verbesserung: **Investiere etwa 20–30 % deiner Pokerzeit ins Studium**, den Rest ins Spielen. Bei 8 Stunden Poker pro Woche wären das rund 2 Stunden gezielte Lernarbeit.\n\nEntscheidend ist die Qualität des Studiums. **Aktives Lernen** schlägt passives Konsumieren deutlich:\n\n- **Aktiv**: eigene Hände analysieren, Spots mit einem Equity-Rechner nachrechnen, eine konkrete Frage klären ("Wie spiele ich kleine Pocket Pairs gegen ein 3-Bet?"), Ranges aufschreiben und vergleichen.\n- **Passiv**: nebenbei Trainingsvideos schauen, Foren scrollen, Highlight-Clips ansehen. Das fühlt sich nach Lernen an, hinterlässt aber wenig.\n\nAm wirksamsten ist Studium mit **Themenfokus**: Nimm dir pro Woche genau ein Konzept vor (z. B. C-Bet-Größen auf trockenen Boards) und ziehe es durch Studium und Spiel: Du liest dazu, analysierst eigene Hände zu genau diesem Thema und achtest in der nächsten Session bewusst darauf. Ein Thema pro Woche, sauber verankert, schlägt fünf Themen, die du nur angelesen hast.',
          example:
            'Wochenthema "Delayed C-Bet": Montag liest du die Theorie und schreibst dir drei Regeln heraus. In den Sessions markierst du jede Hand, in der du als Preflop-Aggressor den Flop checkst. Am Reviewtag prüfst du: Habe ich in den richtigen Spots gecheckt – und den Turn dann sinnvoll weitergespielt?',
        },
        {
          heading: 'Handhistorien markieren und reviewen',
          body:
            'Deine eigenen Hände sind dein bestes Lehrbuch – sie zeigen exakt deine Fehler, nicht die eines Video-Coaches. Der Arbeitsablauf:\n\n- **Während der Session: nur markieren.** Jede Hand, bei der du unsicher warst, jeder große Pot, jeder Spot, der sich komisch angefühlt hat – ein Klick auf die Markierfunktion (online) oder eine Kurznotiz (live), dann weiterspielen. Keine Analyse am Tisch: Sie kostet Fokus und lädt zum Grübeln ein.\n- **Mit Abstand reviewen**: frühestens am nächsten Tag, wenn die Emotion raus ist. 3–5 Hände pro Review reichen völlig – Tiefe schlägt Menge.\n- **Strukturiert analysieren**: Gehe die Hand Straße für Straße durch. Welche Range hat mein Gegner hier? Welche Optionen hatte ich, und was spricht für welche? Erst am Ende darfst du auf das Ergebnis schauen.\n- **Muster sammeln**: Notiere zu jeder reviewten Hand ein Fazit in einem Satz. Nach einigen Wochen siehst du wiederkehrende Themen – das sind deine echten Leaks (systematische Fehler), und sie bestimmen dein nächstes Wochenthema.\n\nWichtig: Reviewe nicht nur verlorene Hände. Gewonnene Pötte verstecken oft die teuersten Fehler – etwa zu kleine Value-Bets oder Glück nach einem schlechten Call. Wähle die Hände nach Unsicherheit aus, nicht nach Ergebnis.',
          tip: 'Die beste Review-Frage ist nicht "Was hätte ich tun sollen?", sondern "Was wusste ich in dem Moment – und was davon habe ich ignoriert?". So trainierst du Entscheidungen unter echten Bedingungen statt Besserwisserei im Nachhinein.',
        },
        {
          heading: 'Eine konkrete Wochenroutine',
          body:
            'Eine Routine funktioniert nur, wenn sie in dein Leben passt. Hier ein Beispielplan für jemanden mit etwa 8–9 Stunden Pokerzeit pro Woche – als Vorlage zum Anpassen, nicht als Pflichtprogramm:\n\nDer Plan setzt die 20–30-%-Regel um (rund 2,5 von 9 Stunden sind Studium), verteilt die Last auf kleine Einheiten und enthält bewusst pokerfreie Tage. Regeneration ist Teil des Trainings, nicht seine Unterbrechung.\n\nDrei Prinzipien machen so einen Plan stabil:\n\n- **Feste Slots statt guter Vorsätze**: "Dienstag 20:00, 30 Minuten Review" passiert. "Diese Woche mal reviewen" passiert nicht.\n- **Klein anfangen**: Lieber 20 Minuten, die du wirklich einhältst, als ein 2-Stunden-Plan, der nach zwei Wochen stirbt.\n- **Session-Rituale**: Vor dem Spielen 2 Minuten – Wochenthema ansehen, Stop-Loss bestätigen, Ablenkungen schließen. Nach dem Spielen 3 Minuten – Hände markiert? Kurznotiz zur mentalen Verfassung ins Protokoll. Diese fünf Minuten verzahnen Spielen und Lernen miteinander.',
          table: {
            headers: ['Tag', 'Aktivität', 'Dauer'],
            rows: [
              ['Montag', 'Session (mit Hände-Markieren)', '90 Min.'],
              ['Dienstag', 'Review: 3–5 markierte Hände', '30 Min.'],
              ['Mittwoch', 'Session', '90 Min.'],
              ['Donnerstag', 'Studium: Wochenthema (Video/Artikel + Notizen)', '45 Min.'],
              ['Freitag', 'Pokerfrei', '—'],
              ['Samstag', 'Längere Session mit Fokus aufs Wochenthema', '2 × 90 Min.'],
              ['Sonntag', 'Wochenrückblick: Leaks notieren, nächstes Thema wählen', '30 Min.'],
            ],
          },
        },
        {
          heading: 'Prozessziele, Schlaf und Fokus',
          body:
            'Ergebnisziele ("Diesen Monat 500 € gewinnen") sind im Poker unbrauchbar, weil du das Ergebnis kurzfristig nicht kontrollierst – die Varianz entscheidet mit. Setze stattdessen **Prozessziele**, die vollständig in deiner Hand liegen:\n\n- "Ich halte meinen Stop-Loss in 100 % der Sessions ein."\n- "Ich reviewe jede Woche mindestens drei markierte Hände."\n- "Ich spiele nur, wenn ich wach und ungestört bin."\n\nProzessziele kannst du jede Woche zu 100 % erreichen – auch im Downswing. Das hält die Motivation stabil, wo Ergebnisziele sie zerstören würden.\n\nZuletzt der am meisten unterschätzte Faktor: dein Körper. Poker ist Dauerkonzentration und Impulskontrolle, und beides hängt direkt an deinem Zustand:\n\n- **Schlaf**: Müdigkeit verschlechtert Risikoabwägung und Selbstkontrolle – müde zu spielen ist, wie mit angezogener Handbremse zu fahren, nur teurer. Keine Session nach schlechten Nächten.\n- **Ernährung**: Schwere Mahlzeiten und viel Zucker direkt vor der Session erzeugen Konzentrationstäler. Wasser statt des dritten Kaffees.\n- **Fokus**: Handy weg, ein Bildschirm, keine Serie nebenbei. Eine konzentrierte Stunde bringt dir mehr – spielerisch wie lernend – als drei abgelenkte.\n\nDein A-Game ist keine Frage des Wollens, sondern der Voraussetzungen. Wer sie schafft, spielt es öfter.',
        },
      ],
      takeaways: [
        'Wachstums-Mindset heißt: Fehler sind Lernmaterial, und du misst dich an deinem früheren Ich.',
        'Investiere etwa 20–30 % deiner Pokerzeit in aktives Studium – am besten mit einem Wochenthema.',
        'Markiere unsichere Hände während der Session, reviewe sie mit Abstand – nach Unsicherheit, nicht nach Ergebnis ausgewählt.',
        'Feste, kleine Zeitslots und Session-Rituale schlagen große Vorsätze.',
        'Setze Prozessziele statt Ergebnisziele – und behandle Schlaf, Ernährung und Fokus als Teil deines Spiels.',
      ],
      quiz: [
        {
          question: 'Welche Faustregel gilt für das Verhältnis von Studium zu Spielzeit?',
          options: [
            'Etwa 20–30 % der Pokerzeit ins Studium investieren',
            'Höchstens 5 % – Erfahrung kommt vom Spielen',
            'Mindestens 50 % Studium, sonst lernt man nichts',
            'Studium ist erst ab höheren Limits sinnvoll',
          ],
          correctIndex: 0,
          explanation:
            'Rund ein Fünftel bis ein Drittel der Zeit für gezieltes, aktives Studium hat sich als Faustregel bewährt: genug, um Fehler zu korrigieren, ohne die praktische Umsetzung zu vernachlässigen.',
        },
        {
          question: 'Welches der folgenden Ziele ist ein Prozessziel?',
          options: [
            'Diesen Monat 300 € Gewinn erreichen',
            'Bis Jahresende auf NL50 aufsteigen',
            'Nach jeder Woche mindestens drei markierte Hände strukturiert reviewen',
            'Nie wieder eine Session im Minus beenden',
          ],
          correctIndex: 2,
          explanation:
            'Prozessziele liegen vollständig in deiner Kontrolle. Gewinnbeträge, Limitaufstiege und Session-Ergebnisse hängen von der Varianz ab – der Review-Vorsatz nicht.',
        },
        {
          question: 'Welche Hände solltest du bevorzugt für den Review auswählen?',
          options: [
            'Nur die größten verlorenen Pötte',
            'Hände, bei denen du dir unsicher warst – unabhängig davon, ob du sie gewonnen hast',
            'Nur Bad Beats, um die Varianz zu dokumentieren',
            'Möglichst viele Hände, mindestens 20 pro Review',
          ],
          correctIndex: 1,
          explanation:
            'Unsicherheit markiert Lernpotenzial. Auch gewonnene Hände verstecken Fehler (z. B. verpasste Value). Wenige Hände in der Tiefe schlagen viele im Schnelldurchlauf.',
        },
        {
          question: 'Warum solltest du markierte Hände erst mit zeitlichem Abstand analysieren?',
          options: [
            'Weil die Handhistorien erst am nächsten Tag verfügbar sind',
            'Weil direkt nach der Session die Emotion mitbewertet und das Urteil verzerrt',
            'Weil Reviews nur am Wochenende sinnvoll sind',
            'Weil man Hände erst nach 10.000 weiteren Händen einordnen kann',
          ],
          correctIndex: 1,
          explanation:
            'Frisch nach der Session fließen Ärger oder Euphorie ins Urteil ein – Results-Oriented Thinking. Mit einem Tag Abstand analysierst du die Entscheidung, nicht das Gefühl zum Ergebnis.',
        },
        {
          question: 'Was kennzeichnet ein Wachstums-Mindset im Poker?',
          options: [
            'Die Überzeugung, dass sich Pokertalent nicht wesentlich verändern lässt',
            'Der Vergleich der eigenen Ergebnisse mit denen erfahrener Regulars',
            'Das Vermeiden von Fehleranalysen, um das Selbstvertrauen zu schützen',
            'Fähigkeiten als trainierbar zu betrachten und Fehler aktiv als Lernmaterial zu suchen',
          ],
          correctIndex: 3,
          explanation:
            'Wachstums-Mindset heißt: Können ist trainierbar, Fehler sind Daten, und der Maßstab ist dein eigener Fortschritt. Gerade weil Ergebnisse kurzfristig zufällig sind, ist ehrliche Fehleranalyse dein Fortschrittsmesser.',
        },
      ],
    },
    {
      id: 'm6-l5',
      title: 'Verantwortungsvolles Spielen',
      duration: 8,
      intro:
        'Poker soll ein Hobby und ein Lernprojekt sein – kein Problem. Diese Lektion hilft dir, ehrlich mit dir selbst zu bleiben: mit klaren Grenzen, einem realistischen Blick auf das Spiel und dem Wissen, wo es Hilfe gibt.',
      sections: [
        {
          heading: 'Geschick und Glück ehrlich einordnen',
          body:
            'Poker ist langfristig ein **Geschicklichkeitsspiel**: Über zehntausende Hände setzen sich bessere Entscheidungen durch, und dieselben Spieler gewinnen Jahr für Jahr. Aber – und dieses Aber gehört zur ganzen Wahrheit – der **Glücksanteil ist erheblich**. Kurzfristig, also über Tage, Wochen und selbst Monate, kann die Varianz jedes Können überdecken. Ein einzelner Abend ist näher am Würfeln als am Schach.\n\nAus dieser Doppelnatur folgen drei ehrliche Konsequenzen:\n\n- **Poker ist rechtlich und praktisch Glücksspiel** und wird entsprechend reguliert – mit gutem Grund: Es kann dieselben problematischen Verhaltensmuster auslösen wie andere Glücksspiele.\n- **Die Mehrheit der Spieler verliert langfristig.** Neben der Spielstärke der Gegner sorgt allein schon der **Rake** (die Gebühr des Anbieters an jedem Pot bzw. Turnier) dafür, dass Poker in Summe ein Minusgeschäft für den Durchschnitt ist.\n- **Poker ist keine verlässliche Einkommensquelle** – schon gar nicht am Anfang. Plane niemals mit Pokergewinnen, weder im Budget noch im Kopf.\n\nDiese Einordnung ist kein Widerspruch zum Lernanspruch dieser App – im Gegenteil: Wer den Glücksanteil respektiert, lernt geduldiger, spielt kontrollierter und bleibt länger gesund beim Spiel.',
          tip: 'Ein ehrlicher Anspruch an dich selbst: Spiele Poker, weil dich das Spiel fasziniert – nicht, weil du Geld erwartest. Gewinne sind dann ein möglicher Bonus, keine Bedingung.',
        },
        {
          heading: 'Grenzen im Voraus setzen',
          body:
            'Alle wirksamen Schutzmechanismen haben eines gemeinsam: Sie werden **vor** dem Spielen festgelegt, in ruhigem Zustand – nicht in der Hitze einer Session. Vier Ebenen:\n\n- **Geldgrenzen**: Ein festes Monatsbudget für Poker, das aus frei verfügbarem Geld stammt (siehe Lektion 2). Bei lizenzierten deutschen Online-Anbietern kannst und solltest du zusätzlich ein **Einzahlungslimit** direkt im Konto hinterlegen; gesetzlich gilt ohnehin ein anbieterübergreifendes Limit (standardmäßig 1.000 € pro Monat).\n- **Zeitgrenzen**: Lege Sessionlänge und Spieltage pro Woche vorher fest – und plane bewusst pokerfreie Tage ein. Poker soll in deinem Leben stattfinden, nicht dein Leben im Poker.\n- **Zustandsgrenzen**: Nicht spielen bei Müdigkeit, unter Alkohol, bei akutem Stress oder emotionaler Belastung – in diesen Zuständen leiden genau die Fähigkeiten, die Poker verlangt: Urteilsvermögen und Impulskontrolle.\n- **Technische Hilfen nutzen**: Limits, Erinnerungen und Selbsttests der Anbieter sind keine Werkzeuge für "Problemspieler", sondern sinnvolle Standardeinstellungen für alle – so wie ein Anschnallgurt nicht nur für schlechte Fahrer da ist.\n\nDie Regel dahinter kennst du aus der Tilt-Lektion: Grenzen funktionieren nur, wenn sie mechanisch gelten. Eine Grenze, die du im Spiel neu verhandeln kannst, ist keine.',
          example:
            'Ein sauberes Setup: Monatsbudget 50 €, als Einzahlungslimit beim Anbieter hinterlegt. Maximal drei Abende pro Woche, je 2 Stunden mit Timer. Feste Regel: kein Poker nach Mitternacht, kein Poker nach Alkohol, keine zweite Einzahlung im selben Monat – egal, wie "sicher" sich ein Spiel anfühlt.',
        },
        {
          heading: 'Warnsignale ehrlich prüfen',
          body:
            'Problematisches Spielverhalten beginnt selten dramatisch – es beginnt mit kleinen Verschiebungen, die man vor sich selbst gut begründen kann. Prüfe dich regelmäßig und ehrlich anhand dieser Warnsignale:\n\n- Du spielst mit Geld, das du eigentlich brauchst – oder leihst dir Geld zum Spielen.\n- Du versuchst, Verluste durch sofortiges Weiterspielen oder höhere Einsätze zurückzuholen (Chasing).\n- Du verheimlichst Ausmaß deines Spielens oder deiner Verluste vor Partner, Familie oder Freunden.\n- Du denkst ständig ans Spielen, auch wenn du anderes tun willst – oder wirst unruhig und gereizt, wenn du nicht spielen kannst.\n- Spielzeiten verdrängen Schlaf, Arbeit, Studium oder Beziehungen.\n- Deine Stimmung hängt spürbar an den Session-Ergebnissen.\n- Du spielst, um vor Problemen, Stress oder unangenehmen Gefühlen zu fliehen – nicht, weil dich das Spiel interessiert.\n- Vorsätze und Limits werden wiederholt gebrochen ("nur noch eine halbe Stunde").\n\nEin einzelnes Signal an einem schlechten Tag macht noch kein Problem. Aber wenn mehrere Punkte über Wochen zutreffen – oder dich schon die ehrliche Beantwortung nervös macht –, nimm das ernst. Die entscheidende Frage ist einfach und unbequem: **Macht dir Poker noch Spaß – oder spielst du längst aus anderen Gründen weiter?**',
          tip: 'Frage einmal im Monat eine Person, die dich gut kennt: "Fällt dir an meinem Spielverhalten etwas auf?" Außensicht erkennt Verschiebungen oft früher als der eigene Blick – und die Frage zu stellen ist bereits gelebte Selbstkontrolle.',
        },
        {
          heading: 'Hilfe holen ist Stärke, nicht Schwäche',
          body:
            'Wenn Spielen keinen Spaß mehr macht, du Kontrolle verlierst oder Warnsignale zutreffen, gibt es in Deutschland gute, kostenlose und anonyme Anlaufstellen:\n\n- Die **BZgA** (Bundeszentrale für gesundheitliche Aufklärung) bietet mit **check-dein-spiel.de** einen anonymen Selbsttest, Informationen und ein Online-Beratungsprogramm.\n- Die **telefonische Beratung der BZgA zur Glücksspielsucht** erreichst du kostenlos und anonym unter **0800 1 37 27 00**.\n- Vor Ort helfen **Suchtberatungsstellen** (z. B. von Caritas, Diakonie und anderen Trägern) – kostenlos, vertraulich und auch für Angehörige offen.\n- Bei lizenzierten Anbietern kannst du dich über das bundesweite Sperrsystem **OASIS** selbst sperren lassen – für einzelne Anbieter oder übergreifend, auf Zeit oder unbefristet.\n\nWichtig: Diese Angebote sind nicht erst "für den Notfall". Ein Selbsttest nach ein paar Monaten Spielpraxis ist so vernünftig wie ein Gesundheitscheck – gerade wenn du glaubst, ihn nicht zu brauchen.\n\nUnd zuletzt der Rahmen, in dem alles in diesem Kurs steht: Poker ist ein faszinierendes Strategiespiel und ein großartiges Lernprojekt – Mathematik, Psychologie, Selbstdisziplin in einem. Genau das soll es bleiben: ein Hobby, das dein Leben bereichert. In dem Moment, in dem es etwas anderes wird, ist die stärkste Entscheidung, die du am Pokertisch je treffen kannst, aufzustehen und dir Unterstützung zu holen.',
        },
      ],
      takeaways: [
        'Poker ist langfristig ein Geschicklichkeitsspiel – mit erheblichem Glücksanteil, der kurzfristig alles überdecken kann.',
        'Grenzen für Geld, Zeit und Spielzustand setzt du vor der Session – mechanisch und nicht verhandelbar.',
        'Prüfe Warnsignale ehrlich: Chasing, Verheimlichen, Spielen mit benötigtem Geld, Stimmung am Ergebnis.',
        'Kostenlose, anonyme Hilfe in Deutschland: BZgA mit check-dein-spiel.de und der Telefonberatung 0800 1 37 27 00, Suchtberatungsstellen, OASIS-Selbstsperre.',
        'Poker soll Hobby und Lernprojekt bleiben – wenn es das nicht mehr ist, ist Hilfe holen die stärkste Entscheidung.',
      ],
      quiz: [
        {
          question: 'Welche Aussage beschreibt das Verhältnis von Geschick und Glück im Poker korrekt?',
          options: [
            'Poker ist reines Glücksspiel, Können spielt keine Rolle',
            'Langfristig entscheidet Können, kurzfristig kann der erhebliche Glücksanteil jedes Können überdecken',
            'Wer gut genug spielt, gewinnt in jeder einzelnen Session',
            'Der Glücksanteil verschwindet ab einer bestimmten Spielstärke',
          ],
          correctIndex: 1,
          explanation:
            'Über große Stichproben setzen sich bessere Entscheidungen durch – aber einzelne Sessions, Wochen und selbst Monate werden stark von der Varianz geprägt. Beides gehört zur ehrlichen Einordnung.',
        },
        {
          question: 'Wann sollten Geld- und Zeitgrenzen festgelegt werden?',
          options: [
            'Während der Session, sobald es schlecht läuft',
            'Erst, wenn Warnsignale auftreten',
            'Vor dem Spielen, in ruhigem Zustand – und dann mechanisch eingehalten',
            'Grenzen sind nur für Spieler mit Problemen nötig',
          ],
          correctIndex: 2,
          explanation:
            'Im Spiel selbst ist das Urteilsvermögen nicht neutral – eine Grenze, die sich dort neu verhandeln lässt, schützt nicht. Vorab gesetzte Limits sind sinnvolle Standardeinstellungen für alle Spieler.',
        },
        {
          question: 'Welches der folgenden Verhaltensmuster ist ein klares Warnsignal?',
          options: [
            'Nach einem festen Stop-Loss die Session beenden',
            'Verluste vor dem Partner verheimlichen und mit höheren Einsätzen zurückholen wollen',
            'Einen pokerfreien Tag pro Woche einplanen',
            'Die eigenen Ergebnisse schriftlich dokumentieren',
          ],
          correctIndex: 1,
          explanation:
            'Verheimlichen und Chasing sind zwei der deutlichsten Warnsignale für problematisches Spielverhalten. Die anderen Optionen sind im Gegenteil Zeichen kontrollierten Spielens.',
        },
        {
          question:
            'Du merkst, dass Poker dir keinen Spaß mehr macht und du deine Vorsätze wiederholt brichst. Welche Anlaufstelle gibt es in Deutschland?',
          options: [
            'Die BZgA, z. B. über check-dein-spiel.de oder die kostenlose, anonyme Telefonberatung',
            'Nur kostenpflichtige Privatkliniken',
            'Den Kundensupport des Pokeranbieters als einzige Option',
            'Es gibt keine Hilfsangebote für Glücksspiel',
          ],
          correctIndex: 0,
          explanation:
            'Die BZgA bietet mit check-dein-spiel.de und der Telefonberatung (0800 1 37 27 00) kostenlose, anonyme Hilfe. Dazu kommen lokale Suchtberatungsstellen und die Möglichkeit der OASIS-Selbstsperre.',
        },
        {
          question: 'Was ist OASIS?',
          options: [
            'Ein Bonusprogramm lizenzierter Pokeranbieter',
            'Eine Trainingssoftware für Turnierpoker',
            'Das bundesweite Sperrsystem, über das sich Spieler bei lizenzierten Anbietern sperren lassen können',
            'Ein Selbsttest der Anbieter zur Spielstärke',
          ],
          correctIndex: 2,
          explanation:
            'OASIS ist das bundesweite, anbieterübergreifende Spielersperrsystem in Deutschland. Eine Sperre ist auf Zeit oder unbefristet möglich – ein wirksames Instrument, um eine Pause verbindlich zu machen.',
        },
      ],
    },
  ],
};

export default m6;
