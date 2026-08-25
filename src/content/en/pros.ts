// Pro insights: verified principles from well-known poker professionals.
// All statements are paraphrased summaries of publicly documented
// interviews, courses, books, and strategy articles (incl. PokerNews, Card Player,
// GipsyTeam, MasterClass, Upswing Poker, Pokercode) – no invented quotes.

import type { ProProfile, MistakeEntry, EdgeEntry } from '../pros';

export const PRO_PROFILES: ProProfile[] = [
  {
    id: 'holz',
    name: 'Fedor Holz',
    tagline: "Germany's most successful poker pro",
    knownFor:
      'Over $30 million in live tournament winnings, WSOP bracelet winner, legendary 2016 high-roller run. Founder of the poker school Pokercode and the mindset app Primed Mind.',
    color: '#d4af5e',
    principles: [
      {
        title: 'Mindset is half the battle',
        text:
          'Holz describes his success as the interplay of technical preparation and mental clarity under pressure – and deliberately puts mindset first in his courses. His honest number on it: around 80% of his tournament days were losing days. If you can\'t handle that emotionally, you can never access your technical knowledge.',
      },
      {
        title: 'Categorize opponents immediately',
        text:
          'With every new opponent, Holz tries to quickly place them in one of six categories (from the extremely tight "nit" to the aggressor) – not to pigeonhole them, but to understand HOW that player thinks and derive the right counter-strategy from it.',
      },
      {
        title: 'The most valuable tell: bet sizing & chip handling',
        text:
          'By his own account, almost nothing has made him as much money as observing bet sizes and the way chips are put in: bluffs tend to come out slightly smaller than expected, value bets slightly larger. Neatly stacked bets point to tight, passive players; tossed-in, "casual" chips often to weaker hands.',
      },
      {
        title: 'Reflection and environment',
        text:
          'Holz emphasizes how strongly the poker community around you shapes your game: regularly reviewing your own hands and exchanging ideas with better players accelerates learning more than any solo study. Poker changes constantly – whoever stops hunting for mistakes falls behind.',
      },
      {
        title: 'Logic beats memorization',
        text:
          'Rather than memorizing charts by rote, Holz wants to understand WHY a strategy works. If you grasp the logic behind a range, you can adapt it to any new situation – memorized knowledge collapses the moment your opponent goes off script.',
      },
    ],
  },
  {
    id: 'little',
    name: 'Jonathan Little',
    tagline: 'Two-time WPT champion & most prolific poker teacher',
    knownFor:
      'Over $7 million in live tournament winnings, more than 15 strategy books, founder of PokerCoaching.com. Known for his analyses of typical amateur mistakes.',
    color: '#5590d9',
    principles: [
      {
        title: 'Never put someone on exactly one hand',
        text:
          'The biggest beginner mistake in hand reading: pinning the opponent on exactly one hand ("He definitely has AK"). In reality, every opponent plays many different hands the same way – always think in ranges, never in single hands.',
      },
      {
        title: 'Stop being so sticky',
        text:
          'Amateurs can\'t let go of top pair – especially in multiway pots, check-calling with top pair and a weak kicker becomes a subscription to losing. A good hand is not a reason to pay off every bet.',
      },
      {
        title: 'Bet sizes with a purpose',
        text:
          'Undersized 3-bets are a classic, expensive mistake: they give the opponent such good pot odds that continuing is almost always correct for them. Every bet size should have a purpose – not be a habit.',
      },
      {
        title: 'Never play with a cluttered head',
        text:
          "Anyone sitting at the table with an argument, money worries, or frustration on their mind plays measurably worse. Little's advice: remove emotional thinking from your game as early as possible – if necessary by resolutely getting up.",
      },
      {
        title: "Don't carve a strategy in stone",
        text:
          'Most amateurs develop a comfort strategy once and keep it forever – with lines like "I ALWAYS call with top pair". Winners adapt: to opponents, stack depths, and how the game unfolds.',
      },
    ],
  },
  {
    id: 'polk',
    name: 'Doug Polk',
    tagline: "Three WSOP bracelets, for years the world's best heads-up player",
    knownFor:
      'Won the famous 2021 heads-up duel against Daniel Negreanu by $1.2 million. Founder of Upswing Poker.',
    color: '#e0564f',
    principles: [
      {
        title: 'Controlled aggression',
        text:
          "Polk's core principle: apply maximum pressure with good hands – not just premium hands – but without leaving yourself vulnerable to counter-aggression. Aggression is a tool with a dosage, not a permanent state.",
      },
      {
        title: "Don't bluff calling stations",
        text:
          'Against weak players, Polk explicitly advises against bluffing much: your "story" is invisible to them – they look at their two cards and call. Profit against these opponents comes from value, not creativity.',
      },
      {
        title: 'Precision beats wild aggression',
        text:
          'Playing loose-aggressive only maximizes your win rate if the aggression is precise. Indiscriminate bluffs "spill" money – every aggressive action needs a reason: fold equity, equity, or blockers.',
      },
    ],
  },
  {
    id: 'negreanu',
    name: 'Daniel Negreanu',
    tagline: 'Seven WSOP bracelets, two-time WSOP Player of the Year',
    knownFor:
      'One of the most famous poker players in the world, inventor of the "small ball" style, MasterClass instructor. Over $50 million in live tournament winnings.',
    color: '#58b368',
    principles: [
      {
        title: 'Small ball: lots of small pots',
        text:
          "Negreanu's trademark: play more hands, keep the pots small and controllable, and get your edge from better postflop decisions. In lots of small pots, bluffing is allowed – but when a giant pot develops by the river, he almost always holds a strong hand.",
      },
      {
        title: 'Postflop skill beats chart knowledge',
        text:
          'Poker is not just preflop tables: the quality of your decisions after the flop is what decides winning and losing in the long run. If you only learn charts, you have no plan after the flop.',
      },
      {
        title: 'Position grows in importance with stack depth',
        text:
          'The deeper the stacks, the more decisions are still to come – and the more valuable it is to make them last. Playing out of position means giving away information on every street.',
      },
      {
        title: 'Bet small when small is enough',
        text:
          'When a small bet does the same job as a big one – for example on boards both players usually miss – the small bet is the better one: same effect, less risk.',
      },
    ],
  },
  {
    id: 'galfond',
    name: 'Phil Galfond',
    tagline: 'Three WSOP bracelets, high-stakes online legend',
    knownFor:
      'As "OMGClayAiken" one of the most successful online high-stakes players of all time, founder of the training site Run It Once, winner of the "Galfond Challenge".',
    color: '#9b7fd4',
    principles: [
      {
        title: 'Ask "why?" about everything',
        text:
          "Galfond's most important learning question: Why do I check or bet here? Why does my opponent do what he does? Why do the charts look the way they do? If you understand the \"why\", you don't need memorization – and you can find the right answers even in situations no chart covers.",
      },
      {
        title: 'Self-knowledge is the best opponent read',
        text:
          'According to Galfond, the biggest edge comes from understanding your opponent\'s behavior better than he does himself. The way there: know your own fears and moments of discomfort at the table – because those exact same feelings drive your opponents too.',
      },
      {
        title: 'Review your own hands honestly',
        text:
          'Galfond recommends going through hands you played and justifying your own decisions. In doing so you uncover thinking errors and patterns – in yourself, and automatically in your player pool as well.',
      },
      {
        title: 'Be able to explain your intuition',
        text:
          'Galfond only trusts intuition when he can translate it into a clear line of reasoning: which pieces of information lead to which conclusion? "It felt right" is not a justification – it is the beginning of an analysis.',
      },
    ],
  },
  {
    id: 'elwood',
    name: 'Zachary Elwood',
    tagline: 'The leading expert on poker tells',
    knownFor:
      'Author of the standard works "Reading Poker Tells", "Verbal Poker Tells", and "Exploiting Poker Tells" – the most recommended tell literature among pros.',
    color: '#4fb8c9',
    principles: [
      {
        title: 'A tell is a tendency, not a law',
        text:
          'Elwood defines a tell as something a specific player is MORE likely to do than not do. Some behaviors are meaningless habits – a signal only becomes valuable through repetition by the same player.',
      },
      {
        title: 'Context decides everything',
        text:
          'The same gesture – staring, sighing, looking away – can mean strength in one situation and weakness in the next. If you don\'t understand the situation, even a "correct" tell will lead you to the wrong decision.',
      },
      {
        title: 'System over gut feeling',
        text:
          "Elwood's approach is a mental filing system: sort behavior by situation (before the bet, after the bet, while waiting), observe the baseline, note deviations. Reading tells is a craft, not magic.",
      },
    ],
  },
];

export const BEGINNER_MISTAKES: MistakeEntry[] = [
  {
    title: 'Passive play after the flop',
    text:
      'By far the most common major leak in analyses of low-stakes players: checking and calling where betting and raising is correct. Passive players only win when they hold the best hand – aggressive players also win all the pots nobody wants.',
    source: 'Leak analyses (incl. Holdem Pro: the biggest leak for 44% of players)',
  },
  {
    title: 'Open-limping',
    text:
      'The most classic live and micro-stakes mistake: just calling instead of raising. You never win the pot outright, you invite everyone in cheaply, and you play without initiative. If a hand is playable, it is raisable.',
    source: 'Upswing Poker, practically every modern course',
  },
  {
    title: 'Giving up the big blind too often',
    text:
      'Modern analyses show that recreational players fold their big blind far too often, quietly giving away blind after blind. With the discount of the blind already posted, you can defend considerably wider than what "feels" right.',
    source: 'Upswing Poker, GTO analyses',
  },
  {
    title: 'Raising too many hands',
    text:
      'The counterpart to limping and, according to Upswing, even worse: raising with too wide a range builds exponentially bigger pots with hands that are too weak – and loses money faster than any limper ever could.',
    source: 'Upswing Poker',
  },
  {
    title: 'Reading one hand instead of a range',
    text:
      '"He definitely has aces" is not a read, it is guessing. Opponents play many hands identically – if you only see one possibility, you make systematically wrong decisions.',
    source: 'Jonathan Little',
  },
  {
    title: 'Being unable to fold top pair',
    text:
      'Top pair feels like a winning ticket – but against big aggression, especially multiway, it is often clearly beaten. Being "sticky" is one of the most expensive character traits at the poker table.',
    source: 'Jonathan Little',
  },
  {
    title: 'Trying to bluff calling stations',
    text:
      'The beautiful triple-barrel bluff story only works on opponents who are listening. Recreational players look at their two cards and call. Against them the rule is: more value, zero heroics.',
    source: 'Doug Polk',
  },
  {
    title: 'Playing on while emotional',
    text:
      'Wanting to "win it back quickly" after a bad beat is how every nightmare session begins. Pros treat emotional clarity as a prerequisite for playing – not as a nice-to-have.',
    source: 'Jonathan Little, Fedor Holz',
  },
];

export const EDGE_SPOTS: EdgeEntry[] = [
  {
    title: 'The golden low-stakes rule: value first',
    text:
      'At low limits, people call too much. The consequence: value bet thinner and more often, and cut the big bluffs. The edge is not in spectacular moves – it is in getting paid consistently with your good hands.',
  },
  {
    title: "Attack other players' leaks deliberately",
    text:
      "Isolate limpers, steal from over-folding blinds, value bet calling stations, respect big bets from nits: every typical opponent mistake has a direct countermeasure – and low-stakes tables are made of exactly these mistakes.",
  },
  {
    title: 'Table and seat selection',
    text:
      'Pros pick their games: better to be the fifth-best player at a soft table than the best at a tough one. Live, one more rule applies: the loosest players should ideally sit to your right, so you act after them.',
  },
  {
    title: 'Study what nobody else studies',
    text:
      'The brutal truth about low stakes: hardly anyone there works on their game. Just 20–30 minutes of structured study per day – exactly what this app provides – will overtake the average table within a few weeks.',
  },
  {
    title: 'Discipline in the big moments',
    text:
      "A single disciplined fold against a passive player's sudden river raise saves more than ten clever bluffs bring in. Pros don't win because they risk more – they win because they cut out the expensive mistakes.",
  },
];

export const PRO_SOURCE_NOTE =
  'All principles are paraphrased summaries of publicly documented statements from interviews, courses, and books by the pros named (incl. PokerNews, Card Player, GipsyTeam, MasterClass, Upswing Poker, Pokercode, "Reading Poker Tells"). No verbatim quotes, no invented statements. PokerMentor is not affiliated with any of the people named: no partnership, no sponsorship, no endorsement by them.';
