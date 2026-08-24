import type { Module } from '../../types';

const m9: Module = {
  id: 'm9',
  title: 'Poker Variants',
  subtitle: 'PLO, Short Deck, Stud & more – the world beyond Hold\'em',
  icon: '🌍',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm9-l1',
      title: 'Pot-Limit Omaha (PLO)',
      duration: 10,
      intro:
        'Omaha is the second-biggest poker variant in the world after Hold\'em – and the place where Hold\'em players make their most expensive transition mistakes. This lesson explains the rules and the key strategic differences.',
      sections: [
        {
          heading: 'The rules: four cards, exactly two count',
          body:
            'In Omaha you are dealt **four** hole cards instead of two. The most important rule, which beginners forget constantly: you must combine **exactly two** of your four cards with **exactly three** board cards – no more, no less.\n\nIf four hearts are on the board and you hold only the ace of hearts, you do NOT have a flush – you need two hearts in your hand. Likewise, a pair on the board plus one matching card in your hand is nowhere near a full house.\n\nThe game is almost always played **pot-limit**: the maximum bet is the current size of the pot. Pots therefore grow more slowly than in no-limit, but they still explode regularly – because with four cards, everyone hits something more often.',
          example:
            'Board: K♥ Q♥ 7♥ 2♥ 3♠. You hold A♥ A♠ 9♦ 8♦. No flush! You have only ONE heart – you need two from your hand to make the flush.',
        },
        {
          heading: 'Equities run close together',
          body:
            'With four cards, every player has six two-card combinations – so preflop equities run much closer together than in Hold\'em. Even the best starting hand (A-A-K-K double-suited) is rarely much better than 60:40 against a decent hand.\n\nThe consequences: preflop aggression is worth less than in Hold\'em, dominated situations only arise after the flop, and variance is noticeably higher. That\'s why PLO is often called an "action game" – but the good players don\'t win through action, they win through better decisions on the turn and river.',
          tip:
            'Bankroll rule of thumb: because of the higher variance, PLO requires considerably more cushion than Hold\'em – more like 50–100 buy-ins instead of 25–50.',
        },
        {
          heading: 'The nuts or nothing',
          body:
            'The most important strategic difference: in PLO, showdowns are won far more often by the **nuts** or near-nuts. When three players see the flop, whoever is in the big all-in rarely holds less than a set, the nut flush, or the nut straight.\n\nThe classic PLO principles follow from this:\n\n- Play starting hands that **work together** (four cards that can make straights, flushes, and sets at the same time), e.g. J-T-9-8 double-suited.\n- Non-nut draws are dangerous: in PLO, the small flush constantly loses to the bigger one.\n- An overpair with no potential to improve is almost never a hand for big pots.\n\nWhat Hold\'em players overvalue most in PLO: bare aces, top pair, and small flushes. Those are the three most expensive transition mistakes.',
          cards: ['Jh', 'Th', '9s', '8s'],
        },
        {
          heading: 'Why PLO is booming',
          body:
            'PLO has been growing for years because it offers both: more action for recreational players (everyone hits more often) and more complexity for ambitious players (more combinations, more difficult decisions).\n\nIf you have solid Hold\'em fundamentals – pot odds, position, range thinking – you bring the foundation with you. But PLO punishes autopilot: hand values shift, blockers become even more important (four cards of your own block far more), and position is even more valuable than in Hold\'em because of the many close decisions.',
        },
      ],
      takeaways: [
        'Exactly two hole cards + exactly three board cards – no exceptions.',
        'Equities run close: preflop, nobody is a big favorite very often, and variance is high.',
        'PLO is a nuts game: non-nut flushes and bare overpairs are the most expensive traps.',
        'Play coordinated starting hands that can make several nut draws at once.',
        'Budget more buy-ins as your bankroll cushion (more like 50–100).',
      ],
      quiz: [
        {
          question: 'Board: A♠ K♠ Q♠ J♠ 2♦. You hold T♠ 9♥ 8♦ 7♣. What do you have?',
          options: [
            'A royal flush in spades',
            'An ace-high straight (Broadway)',
            'No straight at all – just ace-high',
            'A king-high straight (K-Q-J-T-9)',
          ],
          correctIndex: 3,
          explanation:
            'In Omaha you must use exactly two hole cards. T♠ + 9♥ combined with K♠ Q♠ J♠ from the board makes K-Q-J-T-9 – a king-high straight. A royal flush or Broadway is impossible: those would require using only a single hole card (T♠), and that is exactly what\'s forbidden. This is the rule Hold\'em converts miss most often.',
        },
        {
          question: 'Why is preflop aggression less valuable in PLO than in Hold\'em?',
          options: [
            'Because raising is not allowed in PLO',
            'Because the equities of the starting hands run much closer together',
            'Because there are no blinds',
            'Because all players always fold',
          ],
          correctIndex: 1,
          explanation:
            'Even top hands are rarely much better than 60:40 – the edge you\'re trying to build on with a raise is simply smaller than in Hold\'em.',
        },
        {
          question: 'Which hand is the classic Hold\'em-player trap in PLO?',
          options: [
            'The nut flush',
            'A set on a dry board',
            'Bare aces without coordinated side cards',
            'The nut straight with a flush draw',
          ],
          correctIndex: 2,
          explanation:
            'A-A-x-x without cooperating side cards looks powerful, but after the flop it is often just a vulnerable overpair – and it loses big pots to sets, straights, and flushes.',
        },
        {
          question: 'What does "pot-limit" mean?',
          options: [
            'You may bet at most the current size of the pot',
            'The pot is capped at 100bb',
            'You may bet only once per street',
            'There are no raises',
          ],
          correctIndex: 0,
          explanation:
            'The maximum bet/raise equals the size of the pot (including your own call when raising). Pots therefore grow more controlled than in no-limit – but exponentially fast when multiple streets get bet.',
        },
        {
          question: 'Why are small flushes so dangerous in PLO?',
          options: [
            'Because flushes don\'t count in PLO',
            'Because with four hole cards per player, the higher flush is in play far more often',
            'Because you\'re not allowed to bet with a flush',
            'Because the board always shows a pair then',
          ],
          correctIndex: 1,
          explanation:
            'With six two-card combinations per player, the probability that someone holds the better flush rises dramatically. Non-nut hands lose the big pots in PLO.',
        },
      ],
    },
    {
      id: 'm9-l2',
      title: 'Short Deck (6+ Hold\'em)',
      duration: 8,
      intro:
        'Short Deck is the high rollers\' favorite variant: Hold\'em with 36 cards, altered hand rankings, and significantly more action. If you don\'t know the differences, you pay dearly.',
      sections: [
        {
          heading: 'The game with 36 cards',
          body:
            'In Short Deck, all deuces through fives are removed from the deck – leaving 36 cards from the six to the ace. The ace stays flexible: it still makes the highest straight and stands in for the five in the lowest one, so **A-6-7-8-9** is a valid straight.\n\nThe game is usually played with **antes from all players** instead of classic blinds (the button often pays double) – which makes every pot bigger from the start and rewards aggressive play.\n\nThe variant became popular through the Triton high-roller series in Asia; by now the big online sites offer it too.',
        },
        {
          heading: 'New rankings: the flush moves up',
          body:
            'Because four ranks are missing, the probabilities shift – and with them the hand rankings. The most important change in today\'s standard rules: **a flush beats a full house.** With only nine cards per suit, a flush has become significantly rarer, while a full house has become significantly more common due to the denser ranks.\n\nIn some older rule variants, three of a kind additionally beats a straight – but the widespread online and Triton rules keep the normal order (straight > three of a kind). When in doubt, ALWAYS ask about the house rules before the first hand.',
          table: {
            headers: ['Hand', 'Classic', 'Short Deck (standard)'],
            rows: [
              ['Flush vs. full house', 'Full house wins', 'Flush wins'],
              ['Straight vs. three of a kind', 'Straight wins', 'Straight wins (check house rules!)'],
              ['Lowest straight', 'A-2-3-4-5', 'A-6-7-8-9'],
            ],
          },
        },
        {
          heading: 'Strategy: everything moves closer together',
          body:
            'With 36 cards, you hit everything more often: straight draws come in more frequently (an open-ended straight draw gets there almost half the time by the river), pairs and paired boards are everywhere, and equities run about as close as in PLO.\n\nThe most important adjustments:\n\n- **Suited and connected** gains value – A-K suited and connecting hands like J-T-9 play beautifully.\n- **Single pairs lose value**: with so many possible straights and full houses, top pair gets outdrawn faster than in Hold\'em.\n- **Flush draws are gold**, because a flush now even beats a full house – but they come in less often (only 5 outs instead of 9... more precisely: 5 cards of your suit remain).\n\nShort Deck rewards players who redo the math instead of recycling Hold\'em instincts.',
          tip:
            'The rule of 2 and 4 no longer applies in Short Deck – with 36 cards, each out is worth roughly 3% per card. A flush draw with 5 outs only gets you about 30% by the river.',
        },
      ],
      takeaways: [
        '36 cards (no 2–5), antes instead of blinds, A-6-7-8-9 is the lowest straight.',
        'Under the standard rules, a flush beats a full house – always check the house rules.',
        'Straights come in far more often; single pairs lose value.',
        'Old rules of thumb (the rule of 2 and 4) no longer apply – figure roughly 3% per out per card.',
      ],
      quiz: [
        {
          question: 'Which cards are missing in the Short Deck game?',
          options: ['All the face cards', 'The deuces through fives', 'The sixes through nines', 'The aces'],
          correctIndex: 1,
          explanation: '36 cards remain, from the six to the ace – hence the name "6+ Hold\'em".',
        },
        {
          question: 'Why does a flush usually beat a full house in Short Deck?',
          options: [
            'Out of tradition',
            'Because with only 9 cards per suit, a flush has become rarer than a full house',
            'Because full houses are not allowed',
            'Because the ace is missing',
          ],
          correctIndex: 1,
          explanation:
            'Rankings follow rarity: fewer cards per suit make flushes rarer, denser ranks make full houses more common – so they swap places.',
        },
        {
          question: 'What is the lowest straight in Short Deck?',
          options: ['A-2-3-4-5', '6-7-8-9-T', 'A-6-7-8-9', '5-6-7-8-9'],
          correctIndex: 2,
          explanation: 'The ace stands in for the missing five: A-6-7-8-9 is the new "wheel" straight.',
        },
        {
          question: 'Roughly how much is one out worth per card in Short Deck?',
          options: ['About 2%', 'About 3%', 'About 5%', 'About 10%'],
          correctIndex: 1,
          explanation:
            'With only 36 cards, every unseen card is "worth more": roughly 3% per out per card instead of ~2% with a full deck.',
        },
      ],
    },
    {
      id: 'm9-l3',
      title: 'Seven Card Stud & Razz',
      duration: 8,
      intro:
        'Before the Hold\'em boom, Seven Card Stud was THE poker game. Learning it trains skills that are pure gold in every variant: attention, memory, and patience.',
      sections: [
        {
          heading: 'How Stud works',
          body:
            'Seven Card Stud has no community cards and usually no no-limit – it is classically played with **fixed betting amounts (fixed limit)** and antes.\n\nEach player gradually receives **seven cards of their own**: two face down and one face up to start ("third street"), then three more face-up cards, and finally one face down. The worst exposed starting card must pay the "**bring-in**", which opens the action; from the fourth card onward, the best visible hand acts first.\n\nAt showdown, as usual, the best five-card hand from your seven cards wins.',
        },
        {
          heading: 'The core skill: reading dead cards',
          body:
            'Because so many cards are exposed, Stud is a game of observation: which cards are already visible – and therefore **dead** for your draws?\n\nAn example: you hold four spades to a flush. In Hold\'em, you mechanically count 9 outs. In Stud, you first count how many spades are already exposed in your opponents\' hands – if it\'s three, you only have six real outs left. Good Stud players remember EVERY folded exposed card.\n\nThe second core rule: starting hands need either a big pair, three connected high cards, or three of the same suit – and the strength of your hand always depends on how "live" your outs still are.',
          tip:
            'This observation training is exactly what makes Stud so valuable for Hold\'em players: once you\'ve learned to track dead cards, you automatically pick up more at the Hold\'em table too.',
        },
        {
          heading: 'Razz: Stud turned inside out',
          body:
            'Razz is Seven Card Stud as **lowball**: the LOWEST hand wins. Straights and flushes don\'t count against you, aces are always low – the best possible hand is **A-2-3-4-5**, the "wheel".\n\nRazz flips all your instincts: a king as your exposed starting card is a catastrophe, three cards below the eight are premium. And because everyone sees the opponents\' exposed cards, a fascinating information game emerges: if your opponent shows 2-4-6 up while you show 3-5-7 but hold two face cards in the hole, only YOU know how weak you really are – and vice versa.\n\nRazz is considered the most frustrating and at the same time most instructive game in the mixed-game world: pure discipline and odds calculation.',
        },
      ],
      takeaways: [
        'Stud: seven cards of your own, no community board, classically fixed limit with antes and a bring-in.',
        'The core skill is tracking dead cards – outs are only as good as their "liveness".',
        'Razz is Stud as lowball: A-2-3-4-5 (the "wheel") is the best hand.',
        'Stud training improves attention and memory for every other variant.',
      ],
      quiz: [
        {
          question: 'Who pays the bring-in in Stud?',
          options: [
            'The player to the left of the dealer',
            'The player with the worst exposed starting card',
            'The player with the best exposed starting card',
            'All players simultaneously',
          ],
          correctIndex: 1,
          explanation:
            'The lowest exposed card opens the third-street action with the bring-in. From the fourth card onward, the best visible hand acts first.',
        },
        {
          question: 'You have four spades to a flush, but three spades are exposed in your opponents\' hands. How many real outs do you have?',
          options: ['9', '6', '13', '3'],
          correctIndex: 1,
          explanation: 'Of 13 spades, 4 are in your hand and 3 are visibly dead – leaving 6 live outs.',
        },
        {
          question: 'What is the best hand in Razz?',
          options: ['A-A-A-A-K', 'A-2-3-4-5', '2-3-4-5-6', 'Royal flush'],
          correctIndex: 1,
          explanation:
            'Razz is lowball: the lowest hand wins, straights/flushes don\'t count, the ace is low – A-2-3-4-5 (the "wheel") is unbeatable.',
        },
        {
          question: 'In which betting format is Stud classically played?',
          options: ['No-limit', 'Pot-limit', 'Fixed limit', 'Without bets'],
          correctIndex: 2,
          explanation:
            'Stud games traditionally run with fixed bet sizes – which shifts the focus from big bluffs to precise odds calculation across many streets.',
        },
      ],
    },
    {
      id: 'm9-l4',
      title: 'Mixed Games, Split Pots & Home Game Formats',
      duration: 8,
      intro:
        'The most complete poker players in the world don\'t play just one variant. This lesson gives you the map: mixed games, split-pot games, and the formats that make private games more exciting.',
      sections: [
        {
          heading: 'HORSE & 8-Game: poker\'s decathlon',
          body:
            'In mixed games, the variant rotates on a fixed schedule. The best-known formats:\n\n- **HORSE**: Hold\'em, Omaha Hi/Lo, Razz, Stud, Stud Eight-or-better (Hi/Lo) – classically fixed limit.\n- **8-Game**: the five HORSE games plus 2-7 Triple Draw, No-Limit Hold\'em, and Pot-Limit Omaha.\n\nThe most prestigious mixed titles (such as the $50,000 Poker Players Championship at the WSOP) are regarded within the community as the true world championships – because there, you can\'t hide a single leak in unfamiliar variants.\n\nFor your learning, that means: every additional variant forces you to understand poker PRINCIPLES instead of memorized plays – equity, position, pot odds, and reading opponents work everywhere; only the signs flip.',
        },
        {
          heading: 'Split-pot games: two winners per hand',
          body:
            'In **Hi/Lo variants** (e.g. Omaha Hi/Lo, Stud Hi/Lo), the pot is split: the best high hand wins one half, the best low hand (usually "8 or better": five different cards no higher than an eight) wins the other.\n\nThe strategic goal is **scooping** – winning both halves with one hand, for instance with A-2-3-4-5, which is simultaneously a straight (high) and a perfect low. If you constantly play for only one half, you win almost nothing in the long run: half the pot also contains half of your own bets.\n\nThe beginner\'s rule for all split games: play hands with **scoop potential** (A-2-x-x with a suited ace in Omaha Hi/Lo) and avoid hands that can only go one way.',
          tip: 'The mixed-game pros\' motto: "Winning three quarters is good, scooping is the goal, fighting for half is losing in slow motion."',
        },
        {
          heading: 'Home game classics: bomb pots, stand-up & co.',
          body:
            'Private games love formats that guarantee action:\n\n- **Bomb pot**: Everyone posts a fixed amount before the hand, preflop is skipped, and you go straight to the flop with a big pot – often as a double-board variant with two flops.\n- **Stand-up game**: Whoever wins a hand first gets to "sit down" – the last player standing pays a penalty.\n- **Dealer\'s choice**: Whoever has the button picks the variant for that round – the home game version of mixed games.\n\nStrategically, the same applies to all action formats: big pots without preflop information mean **nut-oriented play**. In a bomb pot with seven players, top pair is nearly worthless – you play draws to the nuts and made monsters.',
        },
      ],
      takeaways: [
        'HORSE and 8-Game rotate through multiple variants – the ultimate discipline for complete players.',
        'In Hi/Lo games, scooping (both halves of the pot) is the goal – half pots are slow-motion losses.',
        'Bomb pots & co. are multiway action without preflop information: play strictly nut-oriented.',
        'Every new variant deepens your understanding of the universal poker principles.',
      ],
      quiz: [
        {
          question: 'What does the "R" in HORSE stand for?',
          options: ['River', 'Razz', 'Rush', 'Rebuy'],
          correctIndex: 1,
          explanation: 'HORSE = Hold\'em, Omaha Hi/Lo, Razz, Stud, Stud Eight-or-better.',
        },
        {
          question: 'What does "scooping" mean in a Hi/Lo game?',
          options: [
            'Giving up the pot',
            'Winning both halves of the pot (high and low) with one hand',
            'Winning only the low half',
            'Rebuying all your chips',
          ],
          correctIndex: 1,
          explanation:
            'Winning high and low at the same time collects the entire pot – the strategic goal of every split-pot variant.',
        },
        {
          question: 'Why is top pair nearly worthless in a 7-player bomb pot?',
          options: [
            'Because pairs don\'t count there',
            'Because without preflop selection, seven random ranges see the flop – someone almost always hits better',
            'Because you\'re not allowed to bet with top pair',
            'Because the pot gets split',
          ],
          correctIndex: 1,
          explanation:
            'Multiway without a preflop filter means: the winning hand is much stronger on average. Nuts and nut draws win, not marginal pairs.',
        },
        {
          question: 'Which Omaha Hi/Lo starting hand has the best scoop potential?',
          options: ['K-K-Q-J with no suits', 'A-2-3-4 with a suited ace', '9-9-8-8', 'Q-J-T-9 offsuit'],
          correctIndex: 1,
          explanation:
            'A-2-x-x with low side cards can make the best low AND (via wheel straights and the nut flush) the best high – the prototype of a scoop hand.',
        },
      ],
    },
    {
      id: 'm9-l5',
      title: 'Which Variant Is Right for You?',
      duration: 7,
      intro:
        'To wrap up: an honest decision guide. Which variant is worth it when – and how do you transfer your Hold\'em knowledge without making expensive transition mistakes?',
      sections: [
        {
          heading: 'The map at a glance',
          body:
            'There is no "best" variant – only the best one for your goal:\n\n- **No-Limit Hold\'em** remains the base: the biggest player pool, the most learning resources, the strategic foundation for everything else. Your main game until the fundamentals are solid.\n- **Pot-Limit Omaha** for anyone who wants more action and more complexity – and has the bankroll for higher variance.\n- **Short Deck** if you enjoy redoing the math and like flat equities.\n- **Stud/Razz/Mixed** for the patient, who want the most complete poker education.\n\nThe proven learning path: Hold\'em foundation (this app!) → occasional PLO to get a taste → mixed games once poker as a whole has you hooked.',
          table: {
            headers: ['Variant', 'Action', 'Variance', 'Learning curve', 'Who is it for?'],
            rows: [
              ['NL Hold\'em', 'medium', 'medium', 'moderate', 'The foundation for everyone'],
              ['PLO', 'high', 'high', 'steep', 'Action fans with a bankroll cushion'],
              ['Short Deck', 'very high', 'high', 'moderate', 'Calculators & gamblers'],
              ['Stud/Razz', 'low', 'low', 'long', 'Patient observers'],
              ['Mixed games', 'varies', 'medium', 'the longest', 'Complete players'],
            ],
          },
        },
        {
          heading: 'Skills that travel everywhere – and which don\'t',
          body:
            'These skills from your Hold\'em training transfer to EVERY variant:\n\n- Pot odds, equity, and EV thinking\n- Position and initiative\n- Range thinking instead of single-hand guessing\n- Tilt control and bankroll discipline\n- Observing and categorizing opponents\n\nNOT transferable, on the other hand, are concrete hand values and rules of thumb: what\'s a monster in Hold\'em is average in PLO; the rule of 2 and 4 dies in Short Deck; top pair is decoration in bomb pots. The most common mistake when switching variants is bringing your old hand valuations along – the principles travel with you, the numbers you have to learn anew.',
          tip:
            'Always switch variants one or two stakes LOWER than your regular Hold\'em stake – the tuition is much cheaper that way.',
        },
        {
          heading: 'Adjusting your bankroll for variance',
          body:
            'The closer the equities and the bigger the pots, the more cushion your bankroll needs:\n\n- NL Hold\'em cash: 25–50 buy-ins (your familiar guideline)\n- PLO cash: 50–100 buy-ins\n- Short Deck: even more conservative – the ante structure forces a lot of action\n- Fixed-limit games (Stud & co.): considerably milder swings; here 300–400 big bets suffice\n\nThe rule behind it is always the same: variance dictates the cushion. If you ignore this adjustment, you\'ll end up mistaking a normal PLO downswing for "I can\'t play this game" – or you\'re simply broke before your skill could kick in.',
        },
      ],
      takeaways: [
        'NL Hold\'em is and remains the foundation – variants come afterward.',
        'Principles (odds, position, ranges, discipline) travel with you – concrete hand values do not.',
        'When switching variants: start one or two stakes lower.',
        'Adjust your bankroll to the variance: PLO needs ~twice as much cushion as Hold\'em.',
      ],
      quiz: [
        {
          question: 'Which skill does NOT transfer directly from Hold\'em to other variants?',
          options: [
            'Pot odds calculation',
            'Positional awareness',
            'Concrete hand valuations like "top pair is strong"',
            'Tilt control',
          ],
          correctIndex: 2,
          explanation:
            'Principles travel; absolute hand values don\'t: top pair is often nearly worthless in PLO or bomb pots. You have to relearn the numbers for each variant.',
        },
        {
          question: 'How much bankroll cushion is recommended for PLO cash compared to Hold\'em?',
          options: [
            'Half as much – PLO is easier',
            'The same amount',
            'About twice as much (50–100 buy-ins)',
            'Bankroll doesn\'t matter in PLO',
          ],
          correctIndex: 2,
          explanation:
            'The closer equities and bigger multiway pots increase variance significantly – the cushion has to grow with it.',
        },
        {
          question: 'What is the recommended learning path for beginners?',
          options: [
            'Learn all variants in parallel right away',
            'Hold\'em foundation first, then explore variants',
            'Start with Razz',
            'Play only Short Deck',
          ],
          correctIndex: 1,
          explanation:
            'Hold\'em offers the most resources and opponents and builds the strategic foundation that every further variant builds on.',
        },
        {
          question: 'Why should you start a new variant at lower stakes?',
          options: [
            'Because higher stakes are not allowed',
            'Because you\'re guaranteed to win there',
            'Because transition mistakes are unavoidable – at small stakes they cost little tuition',
            'Because the rules are different there',
          ],
          correctIndex: 2,
          explanation:
            'Even strong Hold\'em players pay tuition in new variants at first. Starting lower buys you the same learning experience at a fraction of the price.',
        },
      ],
    },
  ],
};

export default m9;
