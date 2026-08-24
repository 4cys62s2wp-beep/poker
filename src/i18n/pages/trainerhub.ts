import { defineStrings } from '..';

export const STR = defineStrings(
  {
    eyebrow: 'Wissen wird Können',
    title: 'Trainer',
    sub: 'Wissen wird erst durch Wiederholung zur Fähigkeit. Jede richtige Antwort bringt 5 XP – und lange Serien bringen Abzeichen.',
    dailyQuiz: 'Tages-Quiz',
    dailyDone: (score: number, total: number) => `Heute erledigt: ${score}/${total}`,
    dailyBonus: '+30 XP Bonus',
    dailyDesc: 'Fünf Fragen quer durch alle Module – jeden Tag neu.',
    attempts: (n: number) => `${n} Aufgaben`,
    accuracy: (pct: number) => `${pct} % richtig`,
    bestStreak: (n: number) => `Beste Serie: ${n}`,
    notStarted: 'Noch nicht gestartet',
    trainers: {
      szenario: {
        title: 'Szenario-Trainer',
        desc: 'Komplette Spielsituationen mit allen Infos – finde die beste Entscheidung und verstehe das Konzept dahinter.',
      },
      preflop: {
        title: 'Preflop-Trainer',
        desc: 'Raise oder Fold? Triff Preflop-Entscheidungen nach Position und vergleiche dich mit den Charts.',
      },
      potodds: {
        title: 'Pot-Odds-Trainer',
        desc: 'Berechne blitzschnell, wie viel Equity du für einen profitablen Call brauchst.',
      },
      equity: {
        title: 'Equity-Schätzer',
        desc: 'Hand gegen Hand: Schätze die Gewinnwahrscheinlichkeit – und entwickle ein Gefühl für Matchups.',
      },
      handranking: {
        title: 'Handranking-Trainer',
        desc: 'Erkenne in Sekunden, welche beste Hand aus sieben Karten entsteht.',
      },
      outs: {
        title: 'Outs-Zähler',
        desc: 'Zähle deine Outs in typischen Draw-Situationen – die Grundlage jeder Equity-Rechnung.',
      },
      pushfold: {
        title: 'Push/Fold-Trainer',
        desc: 'Kurzer Stack im Turnier: All-in oder Fold? Trainiere die Nash-Ranges für 10bb und 5bb.',
      },
    },
  },
  {
    eyebrow: 'Turn Knowledge into Skill',
    title: 'Trainers',
    sub: 'Knowledge only becomes skill through repetition. Every correct answer earns 5 XP – and long streaks earn badges.',
    dailyQuiz: 'Daily Quiz',
    dailyDone: (score: number, total: number) => `Done today: ${score}/${total}`,
    dailyBonus: '+30 XP bonus',
    dailyDesc: 'Five questions from across all modules – fresh every day.',
    attempts: (n: number) => `${n} drills`,
    accuracy: (pct: number) => `${pct}% correct`,
    bestStreak: (n: number) => `Best streak: ${n}`,
    notStarted: 'Not started yet',
    trainers: {
      szenario: {
        title: 'Scenario Trainer',
        desc: 'Complete game situations with full context – find the best decision and understand the concept behind it.',
      },
      preflop: {
        title: 'Preflop Trainer',
        desc: 'Raise or fold? Make preflop decisions by position and compare yourself against the charts.',
      },
      potodds: {
        title: 'Pot Odds Trainer',
        desc: 'Work out in a flash how much equity you need for a profitable call.',
      },
      equity: {
        title: 'Equity Estimator',
        desc: 'Hand versus hand: estimate the win probability – and build an intuition for matchups.',
      },
      handranking: {
        title: 'Hand Ranking Trainer',
        desc: 'Spot in seconds which best hand seven cards make.',
      },
      outs: {
        title: 'Outs Counter',
        desc: 'Count your outs in typical draw situations – the foundation of every equity calculation.',
      },
      pushfold: {
        title: 'Push/Fold Trainer',
        desc: 'Short stack in a tournament: all-in or fold? Train the Nash ranges for 10bb and 5bb.',
      },
    },
  },
);
