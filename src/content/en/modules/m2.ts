import type { Module } from '../../types';

const m2: Module = {
  id: 'm2',
  title: 'Preflop Strategy',
  subtitle: 'Starting hands, ranges, and the first decision',
  icon: '🃏',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm2-l1',
      title: 'Understanding Starting Hands',
      duration: 9,
      intro:
        'Every hand begins with two cards and a decision. Once you can classify the 169 starting hands systematically, you\'ll make that first decision with a plan instead of a gut feeling.',
      sections: [
        {
          heading: 'The 169 Starting Hands',
          body:
            'Texas Hold\'em has exactly **169 distinct starting hands** if you distinguish only by rank and the suited/offsuit question: 13 pairs (AA down to 22), 78 suited hands (both cards in the same suit), and 78 offsuit hands.\n\nBehind each of these hand classes sit different numbers of specific card combinations, known as **combos**. A pair like AA can be dealt 6 ways, a suited hand like AKs 4 ways, and an offsuit hand like AKo 12 ways. In total, that makes 1326 possible combos.\n\nWhy does this matter? Because it gives you a feel for frequencies: offsuit hands make up the lion\'s share of all hands dealt, suited hands only about 24%. And you get one specific pair only about once in 221 hands — so AA really is rare. You hold some pair about 6% of the time, roughly once every 17 hands.\n\nThis combo thinking is the foundation for everything that comes later: reading ranges, understanding blockers, estimating probabilities.',
          table: {
            headers: ['Type', 'Hand classes', 'Combos per hand', 'Total combos'],
            rows: [
              ['Pairs', '13', '6', '78'],
              ['Suited', '78', '4', '312'],
              ['Offsuit', '78', '12', '936'],
              ['Total', '169', '–', '1326'],
            ],
          },
        },
        {
          heading: 'Notation: AKs vs. AKo',
          body:
            'The standard notation is compact: ranks are abbreviated with 2–9, T (ten), J, Q, K, A. A small **s** after them stands for suited, an **o** for offsuit. So AKs is ace-king of the same suit, AKo in two different suits. Pairs need no suffix — QQ is simply QQ.\n\nThe difference between suited and offsuit looks small but is strategically significant. AKs wins against a random hand about 67% of the time, AKo about 65%. Two percentage points sound like little, but the real advantage lies in **playability**: a suited hand flops a flush draw about 11% of the time and makes a flush by the river a good 6% of the time. That means more situations in which you can profitably keep playing — semi-bluffing, applying pressure, winning big pots.\n\nHence the rule of thumb: you can add suited hands considerably further down your range than their offsuit siblings. K9s can be a solid open-raise in late position, while K9o usually belongs in the muck.',
          cards: ['As', 'Ks', 'Ah', 'Kd'],
          tip: 'Don\'t confuse equity with playability. Q7o has over 50% equity against a random hand but is barely playable at a profit, because it rarely makes strong, clearly dominating hands.',
        },
        {
          heading: 'The Key Hand Categories',
          body:
            'Instead of learning 169 hands individually, you think in categories with similar properties:\n\n- **Premiums** (AA, KK, QQ, AK): the strongest hands. They dominate almost everything and want to build the pot early — almost always raise or 3-bet.\n- **Broadways** (AQ, AJ, AT, KQ, KJ, QJ, etc.): two cards ten or higher. They often make top pair with a good kicker but are vulnerable to domination by premiums.\n- **Suited connectors** (JTs, T9s, 98s, 76s ...): connected suited cards. They hit straights and flushes and play best in position and with deep stacks.\n- **Small and medium pairs** (22–88): their main value lies in set mining — you flop a set just under 12% of the time, and a set can win big pots.\n- **Suited aces** (A2s–A9s): nut-flush potential plus blocker value. Hands like A5s are also classic bluff candidates later on.\n\nEach category has its own profile of showdown strength, draw potential, and positional dependence. The preflop ranges of the coming lessons are derived from exactly that.',
          example:
            'You hold 7♥ 6♥ — a classic suited connector. Against AA, this hand has around 23% equity — more than a hand like KQo (about 13%) — because it can win with straights and flushes instead of being dominated by the ace.',
        },
        {
          heading: 'Why Tight-Aggressive Is the Right Way to Start',
          body:
            'The best-proven starting style is **tight-aggressive** (TAG): you play relatively few hands (roughly 20–25% in 6-max), but when you play, you play with initiative — raising instead of calling, betting instead of checking.\n\nPlaying tight has two big advantages. First, you start with the stronger range than your opponents on average, and thereby win the many small standard situations. Second, you avoid the most expensive beginner mistakes: dominated hands like KTo or A7o from early position that flop a good — but second-best — pair.\n\nPlaying aggressively gives you two ways to win instead of one: you can hold the best hand at showdown, **or** you can make your opponents fold. If you only ever call, you can only win the first way, and you hand your opponent control of the pot.\n\nImportant: tight doesn\'t mean passive or timid. It means selective. You wait for situations with an edge — good hand, good position, clear plan — and then apply pressure consistently. As your experience grows, you can widen your ranges step by step, but the order is crucial: solid first, creative later.',
          tip: 'A rule of thumb for the start: if you\'re unsure whether a hand is playable, fold it. The mistake of folding a borderline hand costs far less in the long run than the mistake of playing too many weak hands.',
        },
      ],
      takeaways: [
        'There are 169 starting-hand classes: 13 pairs, 78 suited, 78 offsuit — 1326 combos in total.',
        'Suited hands are more valuable than offsuit: slightly more equity, considerably more playability thanks to flush potential.',
        'Think in categories (premiums, Broadways, suited connectors, small pairs, suited aces) instead of individual hands.',
        'Tight-aggressive is the best starting style: play few hands, but play them with initiative.',
        'Selectivity protects you from dominated hands — the most expensive beginner mistake.',
      ],
      quiz: [
        {
          question: 'How many combos does a pocket pair like 99 have compared to an offsuit hand like AJo?',
          options: [
            '4 vs. 12',
            '6 vs. 12',
            '6 vs. 16',
            '12 vs. 6',
          ],
          correctIndex: 1,
          explanation:
            'A pair has 6 combos (four cards of one rank form 6 two-card combinations), an offsuit hand 12. A suited hand would have 4 combos.',
        },
        {
          question: 'Why is A♠ K♠ stronger than A♥ K♦, even though both have the same ranks?',
          options: [
            'Because spades are the highest suit in the rankings',
            'Because suited hands hit a pair more often',
            'Because the suited version has flush potential, gaining extra equity and playability',
            'The difference is purely psychological',
          ],
          correctIndex: 2,
          explanation:
            'Suits have no ranking in Hold\'em, and the probability of making a pair is identical. AKs gains additional equity (about 2 percentage points) and many playable situations through flush draws.',
        },
        {
          question: 'Which category does 7♦ 6♦ belong to, and what is its main strength?',
          options: [
            'Broadway — strong top pairs',
            'Suited ace — nut-flush potential',
            'Suited connector — straight and flush potential',
            'Small pair — set mining',
          ],
          correctIndex: 2,
          explanation:
            '76s is a suited connector: two connected cards of the same suit that make big hands primarily through straights and flushes.',
        },
        {
          question: 'Roughly how often are you dealt some pocket pair?',
          options: [
            'About every 5th hand',
            'About every 17th hand',
            'About every 50th hand',
            'About every 221st hand',
          ],
          correctIndex: 1,
          explanation:
            'The probability of any pair is just under 6%, so about 1 in 17. 1 in 221 is the figure for one specific pair like AA.',
        },
        {
          question: 'What is the core of the tight-aggressive style?',
          options: [
            'Seeing as many cheap flops as possible and deciding from there',
            'Playing few, strong hands and driving them forward with raises and bets',
            'Playing only premiums and always going all-in with them',
            'Bluffing aggressively whenever opponents look weak',
          ],
          correctIndex: 1,
          explanation:
            'TAG means selectivity in hand selection plus initiative in play. That way you start with a range advantage and have two ways to win: the best hand or your opponent\'s fold.',
        },
      ],
    },
    {
      id: 'm2-l2',
      title: 'Open-Raising by Position',
      duration: 8,
      intro:
        'When everyone before you has folded, you have exactly two good options: raise or fold. How wide you raise depends almost entirely on your position.',
      sections: [
        {
          heading: 'Raise First In (RFI)',
          body:
            '**RFI (raise first in)** describes the situation where nobody before you has voluntarily put money into the pot, and you\'re the first to make the decision. The modern standard answer is a pure **raise-or-fold strategy**: either your hand is good enough for an open-raise, or it goes into the muck.\n\nWhy raise instead of call? An open-raise achieves three things at once. First, you can win immediately if everyone folds — the blinds are small, but those wins add up. Second, you build the pot with your strong hands while you\'re likely ahead. Third, you seize the **initiative**: as the preflop aggressor, you can fire a credible continuation bet (c-bet) on many flops, even when you\'ve missed.\n\nYour RFI range is not a matter of taste — it follows clear logic: the more players still sitting behind you, the likelier someone holds a strong hand — and the tighter you have to be. And the later your position, the more often you\'ll play postflop in position, which makes every hand more valuable.',
        },
        {
          heading: 'From UTG to the Button: Ranges Get Wider',
          body:
            'In 6-max, you open only about 15–18% of hands **under the gun (UTG)**: all pairs, good Broadways, strong suited hands. From the **hijack (HJ)** it becomes roughly 18–22%, from the **cutoff (CO)** about 25–28%.\n\nThe big jump comes on the **button (BTN)**: here, 40–48% is standard. Two reasons: only the two blinds can fight back, and postflop you\'re guaranteed to play in position — you see every action from your opponents first and control the pot size. The **small blind (SB)** also opens wide when everyone folds (roughly 40–50%), but plays essentially raise-or-fold — more on that in the blind-defense lesson.\n\nThe table gives you rough guidelines with typical borderline hands. Don\'t memorize the ranges rigidly — understand the pattern: with every position that opens up, the next-best hands join in — weaker suited aces, smaller suited connectors, more offsuit Broadways.',
          table: {
            headers: ['Position', 'RFI range (approx.)', 'Typical borderline hands'],
            rows: [
              ['UTG', '15–18%', 'AJo, KQo, ATs, T9s, 66'],
              ['HJ', '18–22%', 'ATo, KJo, A9s, 98s, 44'],
              ['CO', '25–28%', 'A9o, KTo, K8s, QTo, 76s'],
              ['BTN', '40–48%', 'A2o, K9o, Q9o, J8s, 54s'],
              ['SB', '40–50% (raise-or-fold)', 'similar to BTN, slightly tighter'],
            ],
          },
          tip: 'Memorize the two anchor points: UTG about 17% and the button about 45%. You can picture the positions in between as an even staircase.',
        },
        {
          heading: 'The Right Open Sizing',
          body:
            'Online, the standard open today is small: **2.2–3bb**, at many tables exactly 2.5bb. Small opens risk less when you run into a 3-bet and have to give up, and they let you play a wider range profitably. From the small blind, you\'ll choose more like 3–3.5bb, because you\'re out of position postflop and don\'t want to invite the big blind in with dream odds.\n\n**Live**, bigger opens are standard: **3–5bb**, and even more in loose games. The reason is practical: live players call far too much, and a 2.5bb open there often produces family pots with four or five players. You increase the sizing until you usually get only one or two callers.\n\nWhat\'s decisive in both worlds: **pick one fixed size per position and use it for your entire range.** If you raise big with AA and small with 76s, you\'re giving away your hand strength — observant opponents read that faster than you\'d think. Sizing is adjusted to the situation (position, limpers, table dynamics), never to the strength of your own hand.',
          example:
            'Online cash game, 100bb: you\'re in the CO with A♦ J♦ and everyone folds to you. The standard play: raise to 2.5bb. You would choose the same size here with 55, KQo, or AA.',
        },
        {
          heading: 'Why Open-Limping Is Almost Always a Mistake',
          body:
            'Open-limping — just calling the big blind as the first player in — is a leak in almost every situation. The reasons:\n\n- **No fold equity:** you can\'t win the pot immediately. A raise regularly picks up the blinds without a fight; a limp never does.\n- **No initiative:** postflop, nobody has the aggressor\'s story. Your c-bets are missing, your range looks weak — and that\'s exactly how it gets treated.\n- **You invite attacks:** good players relentlessly raise limpers (isolation). You then either pay too much with a weak hand or throw your limp away.\n- **Multiway pots:** limps produce pots with many players, in which your medium-strength hands lose massive value.\n- **Your range is capped:** since you would raise your strong hands, a limp almost always signals weakness.\n\nThe only notable exception in cash games: in some strategies, the small blind may limp part of its range against the big blind (a complete), because it only has to add half a blind. For now, though, the simple rule applies: **if nobody is in before you — raise or fold.**',
        },
      ],
      takeaways: [
        'When everyone folds to you, there are only two good options: open-raise or fold.',
        'Ranges widen with position: UTG about 15–18%, button about 40–48%.',
        'Standard sizing: 2.2–3bb online, 3–5bb live — always the same size for a position\'s entire range.',
        'Open-limping gives away fold equity and initiative and invites isolation raises.',
        'Position is the most important factor in your preflop decision — more important than the exact cards at the edge of the range.',
      ],
      quiz: [
        {
          question: 'Everyone folds to you on the button. Which statement describes the modern standard strategy?',
          options: [
            'Raise your strong hands, limp your speculative ones',
            'Raise about 40–48% of hands and fold the rest',
            'Raise only about 20%, because three players still sit behind you',
            'Play almost every hand, because the button is the best position',
          ],
          correctIndex: 1,
          explanation:
            'On the button, raise-or-fold applies with a wide range of around 40–48%. Limping gives away initiative, and playing 100% would be clearly losing against competent blinds.',
        },
        {
          question: 'Why can the button open so much wider than UTG?',
          options: [
            'Because the button is dealt its cards last',
            'Because only two opponents remain and the button always plays in position postflop',
            'Because the blinds are obligated to fold to the button',
            'Because the button is allowed to make smaller raises',
          ],
          correctIndex: 1,
          explanation:
            'Fewer remaining opponents means a strong hand behind you is rarer, and guaranteed position postflop makes every hand more profitable to play.',
        },
        {
          question: 'What is a typical online open sizing in a 6-max cash game with 100bb?',
          options: [
            '1bb (a limp)',
            '2.2–2.5bb',
            '4–5bb',
            'Always exactly 3.5bb, regardless of position',
          ],
          correctIndex: 1,
          explanation:
            'Online, 2.2–3bb is standard, very commonly 2.5bb. 4–5bb is more of a live sizing, where players call much looser.',
        },
        {
          question: 'Which reason does NOT argue against open-limping?',
          options: [
            'A limp can\'t win the pot immediately',
            'A limp gives away the initiative for the flop',
            'A limp keeps the pot small and thus automatically saves money in the long run',
            'A limp invites opponents to make isolation raises',
          ],
          correctIndex: 2,
          explanation:
            'The small pot is no advantage: you lose little per hand but also almost never win anything, and you surrender every strategic edge. The other three points are real drawbacks of limping.',
        },
        {
          question: 'You hold KTo under the gun in 6-max. What is the standard play?',
          options: [
            'Fold — the hand is outside the UTG range of about 15–18%',
            'Open-raise — any Broadway is playable from anywhere',
            'Limp, to see a cheap flop',
            'Open-raise to 5bb, to protect the hand',
          ],
          correctIndex: 0,
          explanation:
            'KTo is dominated too often by the ranges that fight back against a UTG raise (AK, KQ, KJ, TT+). From UTG, folding is standard; on the button, the same hand would be a clear raise.',
        },
      ],
    },
    {
      id: 'm2-l3',
      title: 'Using 3-Bets the Right Way',
      duration: 11,
      intro:
        'The 3-bet — a reraise against an open-raise — is one of the most profitable weapons in the modern game. If you only 3-bet aces and kings, you\'re easy to read; if you 3-bet at random, you burn money. This lesson shows you the balance.',
      sections: [
        {
          heading: 'What a 3-Bet Accomplishes',
          body:
            'A **3-bet** is the second raise preflop: the open-raise counts as the second bet (after the big blind as the first), so your reraise is the third — hence the name.\n\nA good 3-bet works on several levels at once:\n\n- **Value:** with strong hands, the pot grows while you have the equity lead. AA in a 3-bet pot wins considerably more on average than AA in a single-raised pot.\n- **Fold equity:** a large part of your opponents\' opening ranges can\'t profitably continue against a 3-bet. You often win the pot immediately — the open-raise included.\n- **Isolation:** you push the players behind you out of the pot and usually play the flop heads-up, with initiative and a clear plan.\n- **Protecting your calling range:** if you never 3-bet, you allow opponents to open very wide without a care.\n\nAs a rough benchmark: solid 6-max players 3-bet about 7–10% of their hands overall, depending on position and opponent. Considerably less almost always means: too passive.',
        },
        {
          heading: 'Value 3-Bets: The Core',
          body:
            'The foundation of every 3-bet range is the **value hands**: hands that are ahead of the opener\'s continue range (their calls and 4-bets). The undisputed core is **QQ+ and AK** — you 3-bet these hands against practically any open from any position.\n\nHow far you extend the value range beyond that depends on the opener\'s range. Against a tight UTG open (about 15–18%), it stays at the core, because hands like AQ or JJ are often only barely ahead — or behind — against the UTG continue range. Against a button open (40%+), the world looks different: now TT, 99, AQ, AJs, and KQs are clear value 3-bets too, because the opener has to continue with much weaker material.\n\nA widespread beginner mistake is **slowplaying premiums**: just calling with AA or KK to disguise the hand. That costs you twice — you miss value while you\'re ahead, and you let hands come along cheaply that overtake you on many flops. Build the pot while you have the best hand.',
          example:
            'The CO opens to 2.5bb and you\'re on the BTN with A♣ Q♠. Against the CO range of about 25–28%, AQo is a profitable value 3-bet to about 7.5–8bb. Against a UTG open, the same hand would be more of a call — or even a fold.',
        },
        {
          heading: 'Bluff 3-Bets and the Power of Blockers',
          body:
            'If you only ever 3-bet QQ+/AK, your opponents could respond perfectly: fold to your 3-bet, and move on. That\'s why you mix in **bluff 3-bets** — chosen not at random, but by two criteria: blockers and playability.\n\nThe prototype is **A5s** (and similar hands like A4s, A3s, A2s). The ace is a **blocker**: when you hold an ace, your opponent\'s AA combos drop from 6 to 3 and their AK combos from 16 to 12. The very hands that would most like to fight back have become rarer — your 3-bet generates a fold more often.\n\nThen there\'s the playability: if you get called, A5s can make a nut flush, hit a wheel straight (A-2-3-4-5) with the 5, and at least occasionally win at showdown with a pair of aces. Compare that to a hand like 96o, which is almost always hopeless after a call.\n\nOther good bluff candidates, depending on the situation: suited connectors like 76s, suited Broadways like KJs at the edge of your continue range, and suited kings like K6s against very wide opens.',
          cards: ['Ah', '5h'],
          tip: 'Pick your bluff 3-bets from hands that are just barely too weak to call. Your clear calls (e.g. 99, AJs in position) keep calling — that way, neither part of your strategy loses anything.',
        },
        {
          heading: 'Linear vs. Polarized',
          body:
            'There are two basic types of 3-bet ranges:\n\n- **Linear (merged):** you 3-bet your best hands from the top down — roughly QQ+, AK, then JJ, TT, AQ, AJs, KQs, and so on. There are hardly any pure bluffs, just a continuum from strong to solid.\n- **Polarized:** your 3-bet range consists of two blocks — premiums at the top, bluffs like A5s at the bottom. The medium-strength hands (99, AJs, KQs, JTs) go into your **calling range** instead.\n\nThe choice follows a simple rule: **if you have a calling range, polarize. If you don\'t, play linear.** In position against an open, you can comfortably call with medium-strength hands — so you 3-bet polarized. In the small blind, by contrast, calling is unattractive (you\'re always out of position postflop, and the big blind can squeeze), which is why many play raise-or-fold there with a rather linear 3-bet range.\n\nOpponent type matters too: against players who call 3-bets too often, you shift toward linear — more solid value hands, fewer bluffs, because your bluffs aren\'t getting folds. Against players who fold too often, you can get more polarized and more bluff-heavy.',
        },
        {
          heading: 'The Right 3-Bet Sizing',
          body:
            'The proven rule of thumb: **about 3x the size of the open in position, about 4x out of position.**\n\nWhy the difference? Out of position, you need more fold equity and want to give the opener worse odds and worse playability for their call — after all, they have the positional advantage postflop. In position, you may stay somewhat smaller: if you get called, you play the flop with the positional advantage and the initiative — a very profitable setup.\n\nJust as important as with the open-raise: **one sizing for the entire range.** If you 3-bet AA to 12bb and A5s to 8bb, you\'re handing observant opponents a manual for playing back at you.\n\nTwo practical adjustments: if callers already sit between the opener and you, increase the sizing (see the squeeze in Lesson 5). And with stacks deeper than 100bb, the 3-bet may grow a little as well, so the stack-to-pot ratio — the remaining stack relative to the pot size — stays favorable for your strong hands. As a sanity check, watch your opponent: if they call your 3-bets with obviously too-weak hands, your sizing is more likely too small than too big.',
          table: {
            headers: ['Situation', 'Open size', '3-bet size (approx.)'],
            rows: [
              ['In position (e.g. BTN vs. CO)', '2.5bb', '7.5–8bb (~3x)'],
              ['Out of position (e.g. BB vs. BTN)', '2.5bb', '10–11bb (~4x)'],
              ['Live, in position', '4bb', '12–14bb (~3x)'],
            ],
          },
        },
        {
          heading: 'When You Get 3-Bet Yourself',
          body:
            'Sooner or later it happens to you: you open, and a 3-bet comes in behind you. Now the basic logic is **4-bet / call / fold**:\n\n- **4-bet for value:** KK and AA always; QQ and AK depending on opponent and positions. Sizing: about 2.2–2.5 times the 3-bet, somewhat larger out of position.\n- **4-bet as a bluff:** once again, blocker hands like A5s are ideal — they block AA/AK and have equity in case it does go to showdown. Use sparingly.\n- **Call:** hands that play well against the 3-bet range, especially in position — e.g. TT, 99, AQs, KQs, JTs. Out of position, you call considerably tighter.\n- **Fold:** the rest — and that\'s completely fine. The bottom part of your opening range (say A9o or K7s from the button) has no business continuing against a 3-bet. Roughly half of your opens may go into the muck against a 3-bet.\n\nThe most common mistake is calling too wide out of position: you pay 8–10bb only to play a flop without position and without initiative — a flop you\'ll miss two-thirds of the time. Disciplined folding here is money in the bank.',
          tip: 'Take notes on which opponents almost never 3-bet. Against their 3-bets, you can occasionally just call — or even fold — hands like QQ and AK: a 3-bet frequency of 2–3% almost always means QQ+/AK.',
        },
      ],
      takeaways: [
        'The value core of every 3-bet range is QQ+/AK; against wide opens you extend it (TT+, AQ, good suited Broadways).',
        'Choose bluff 3-bets by blockers and playability — A5s is the prototype.',
        'With a calling range, 3-bet polarized; without one (e.g. in the SB), lean linear.',
        'Sizing: about 3x the open in position, about 4x out of position — one sizing for the whole range.',
        'Against 3-bets, it\'s 4-bet/call/fold: disciplined folding is often the most profitable option, especially out of position.',
      ],
      quiz: [
        {
          question: 'Which hands form the core of the value 3-bet range that you play against practically any open?',
          options: [
            'All pairs and all suited aces',
            'QQ+, AK',
            'TT+, AJ+, KQ',
            'Only AA and KK',
          ],
          correctIndex: 1,
          explanation:
            'QQ+/AK is the undisputed core. TT/AQ and company only join against wider opens (e.g. from the button); only AA/KK would be too tight and too easy to read.',
        },
        {
          question: 'Why is A♥ 5♥ a better bluff 3-bet candidate than 9♠ 6♦?',
          options: [
            'Because A5s flops a pair more often',
            'Because the ace blocks AA/AK, and when called the hand has nut-flush and straight potential',
            'Because A5s is ahead of AA',
            'Because suited hands generate more fold equity when bluffing',
          ],
          correctIndex: 1,
          explanation:
            'The ace blocker reduces the combos of the strongest opposing hands (AA from 6 to 3, AK from 16 to 12), and the hand stays playable after a call. Fold equity itself depends on the sizing, not on suitedness.',
        },
        {
          question: 'When is a polarized 3-bet range preferable to a linear one?',
          options: [
            'When you have no calling range, as in the small blind',
            'When you can call your medium-strength hands instead, e.g. in position against an open',
            'Always against tight players from early position',
            'Only in tournaments with short stacks',
          ],
          correctIndex: 1,
          explanation:
            'Polarized means: 3-bet premiums plus bluffs, call the middle. That only works when calling is a good option — typically in position. Without a calling range (e.g. SB), you play more linear.',
        },
        {
          question: 'The BTN opens to 2.5bb and you\'re in the big blind with KK. What 3-bet sizing is standard?',
          options: [
            'About 5bb (2x)',
            'About 7.5bb (3x)',
            'About 10–11bb (4x)',
            'All-in, to protect the hand',
          ],
          correctIndex: 2,
          explanation:
            'Out of position, you 3-bet bigger, about 4x the open. You don\'t want to give the button — who would have the positional advantage postflop — attractive odds to call.',
        },
        {
          question: 'You open 2.5bb from the CO with A♦ 9♦, and the BTN 3-bets to 8bb. What is the standard response?',
          options: [
            '4-bet, because the ace blocks AA',
            'Call, because the hand is suited',
            'Fold — the bottom part of the opening range doesn\'t continue against 3-bets',
            'Call, to hit the flush',
          ],
          correctIndex: 2,
          explanation:
            'A9s sits at the edge of the CO range and is dominated or behind against a BTN 3-bet range. A large part of your opens may simply fold to 3-bets — that\'s priced in.',
        },
        {
          question: 'What is the most common mistake when defending against 3-bets?',
          options: [
            '4-betting premiums too often',
            'Calling too wide out of position and then playing without position or initiative',
            'Folding AA too often',
            'Ignoring the opponent\'s 3-bet size',
          ],
          correctIndex: 1,
          explanation:
            'Wide OOP calls are expensive: you miss most flops, have no initiative, and are left guessing without the positional edge. Disciplined folding is the simpler and more profitable solution.',
        },
      ],
    },
    {
      id: 'm2-l4',
      title: 'Blind Defense',
      duration: 8,
      intro:
        'In the blinds, you already have money in the pot before you know your cards. How you defend that forced investment decides a large share of your win rate — because in no other position do even good players lose more money.',
      sections: [
        {
          heading: 'The Big Blind\'s Discount',
          body:
            'When it comes to defending, the big blind has one decisive advantage over every other position: **you have already invested 1bb, so you get the call at a discount.**\n\nLet\'s run the numbers: the button opens to 2.5bb, the small blind folds. The pot now holds 2.5bb (the open) + 0.5bb (SB) + 1bb (your blind) = 4bb. The call costs you only 1.5bb more. So you\'re paying 1.5bb for a pot that will hold 5.5bb after your call — you need only around **27% equity** for the call to work out mathematically.\n\nOn top of that comes a second advantage: you\'re the last player to decide preflop (**closing the action**). Nobody behind you can raise and push you out of the pot — your call is safe.\n\nAgainst a random hand, even weak hands like 96s or Q7o have over 40% equity. That\'s why the big blind can defend astonishingly wide against small opens. The catch: raw equity isn\'t everything, because you play the rest of the hand out of position — more on that in a moment.',
          table: {
            headers: ['BTN open', 'Your call', 'Pot after call', 'Equity needed'],
            rows: [
              ['2bb', '1bb', '4.5bb', '~22%'],
              ['2.5bb', '1.5bb', '5.5bb', '~27%'],
              ['3bb', '2bb', '6.5bb', '~31%'],
            ],
          },
        },
        {
          heading: 'The Defending Range Against a Button Open',
          body:
            'Against a 2.5bb open from the button, modern theory has the big blind defending very wide: **around half of all hands in total**, split between 3-bets and calls.\n\n- **3-bet (about 10–15%):** polarized — value with QQ+/AK, and against the wide button range also TT/JJ, AQ, and good suited Broadways, plus bluffs like A5s–A2s, K9s, or suited connectors.\n- **Call (about 30–40%):** the broad middle — pairs, suited hands of almost every kind, connected cards, Broadways, many Ax hands. Suited hands like 86s or J7s are clear defends thanks to the pot odds.\n- **Fold:** the unplayable rest — disconnected offsuit hands like 92o, T4o, J3o. Even with the discount, these hands are too weak: they rarely hit, and when they do, they\'re dominated.\n\nThe logic behind it: the smaller the open and the later the opener\'s position, the wider you may defend. Against a UTG open to 3bb, your defending range shrinks considerably — the odds are worse and the opposing range is much stronger.',
          example:
            'The BTN opens 2.5bb and you hold 8♣ 6♣ in the BB. Folding would be too tight: the hand has a good 40% equity against the button range, costs only 1.5bb with the discount, and hits draws that are playable even out of position. Standard: call. The same hand offsuit (8♥ 6♦), on the other hand, is a fold.',
        },
        {
          heading: 'The Small Blind: The Hardest Position',
          body:
            'The small blind is the most thankless position at the table, for three reasons:\n\n- **Always out of position:** postflop, you have to act first against every opponent — including the big blind.\n- **Only half the discount:** your forced investment is 0.5bb, so your pot odds are considerably worse than in the big blind.\n- **One player still sits behind you:** your call doesn\'t close the action. The big blind can squeeze, and even if they just call, you\'re playing a multiway pot from the worst position.\n\nThe consequence in modern theory: **in the small blind, you play mostly raise-or-fold against opens.** You 3-bet your good hands (leaning linear, as discussed in Lesson 3), and the rest folds. Flat calls you cut down to a minimum — a few strong hands that don\'t quite make the 3-bet, against small opens.\n\nExpect to lose money in both blinds over the long run — that\'s normal and unavoidable, because you\'re forced to invest blind. Your goal is not to turn the blinds into winning positions, but **to lose less than your opponents do in the same situation**.',
          tip: 'When everyone folds to you in the small blind, the opposite of caution applies: against only one remaining opponent, you open wide (roughly 40–50%), ideally to 3–3.5bb. Many players fold far too often in the big blind against SB opens.',
        },
        {
          heading: 'Don\'t Over-Defend: Equity Is Not Profit',
          body:
            'The pot-odds math above has a catch: it assumes that you fully **realize** your equity — that is, you win as often as your raw winning probability promises. Out of position, you don\'t.\n\nWithout position, you give away information first on every street, you bluff less effectively, you get pushed off good draws by bets more often, and you win smaller pots with marginal hands. A hand like J4o may have 35% raw equity against the button range — out of position, you\'ll realize only part of it, and the hand becomes a losing proposition, even though the pot odds seem to justify it.\n\nThree practical rules follow:\n\n- **Suited clearly beats offsuit:** suited hands realize their equity better, because they more often hit strong, clearly playable draws. Defend suited hands generously; fold offsuit junk with discipline.\n- **Connectedness counts:** 76s is a clear defend, 72s is not.\n- **Tighten up against bigger opens:** against 3bb+ and against early positions, your defending range shrinks substantially.\n\nOver-defending on principle ("but I\'m getting the odds") is one of the most expensive leaks in the big blind. The odds are a necessary argument, but not a sufficient one.',
        },
      ],
      takeaways: [
        'The big blind defends at a discount: against a 2.5bb open, you need only around 27% equity to call.',
        'Against a button open, the BB defends about half of all hands — via calls and a polarized 3-bet range.',
        'The small blind is the hardest position: always out of position, half the discount, one player behind you — hence mostly raise-or-fold.',
        'Out of position, you only partially realize your equity: defend suited and connected hands, fold offsuit junk despite the odds.',
        'Losing money in the blinds is normal — your goal is to lose less than average.',
      ],
      quiz: [
        {
          question: 'The BTN opens to 2.5bb, the SB folds. Roughly how much equity do you need in the big blind for a profitable call (pure pot odds)?',
          options: [
            '~15%',
            '~27%',
            '~38%',
            '~50%',
          ],
          correctIndex: 1,
          explanation:
            'You pay 1.5bb into a pot that holds 5.5bb after your call: 1.5 / 5.5 ≈ 27%. Your posted blind belongs to the pot and no longer counts as your investment.',
        },
        {
          question: 'Which two factors allow the big blind to defend so wide?',
          options: [
            'Position postflop and initiative',
            'The 1bb discount and closing the action (nobody can raise behind you)',
            'The ability to squeeze and the half blind',
            'Fold equity and nut potential',
          ],
          correctIndex: 1,
          explanation:
            'The blind you\'ve already posted makes the call cheaper, and as the last to decide, you risk no reraise. Position and initiative are exactly what the BB does not have after a call.',
        },
        {
          question: 'Why is the small blind considered the hardest position?',
          options: [
            'Because it pays the largest forced bet',
            'Because it must always act first postflop, gets only half the discount, and the BB still sits behind it',
            'Because it\'s never allowed to 3-bet',
            'Because its range is capped',
          ],
          correctIndex: 1,
          explanation:
            'That combination — guaranteed out of position, worse odds than the BB, action not closed — makes flat calls unattractive and leads to the raise-or-fold tendency.',
        },
        {
          question: 'The BTN opens 2.5bb. Which hand is the clearest fold in the big blind?',
          options: [
            '8♠ 6♠',
            'J♣ 3♦',
            '5♥ 5♦',
            'K♦ 9♦',
          ],
          correctIndex: 1,
          explanation:
            'J3o is disconnected, offsuit, and hits almost nothing but dominated pairs — hands like that realize far too little equity out of position. 86s, 55, and K9s, by contrast, are standard defends.',
        },
        {
          question: 'What does the statement "I\'m getting pot odds, so I have to call" overlook in the big blind?',
          options: [
            'That rake makes the pot smaller',
            'That raw equity is only partially realized out of position',
            'That the button is always stronger than the big blind',
            'That you should always raise in the big blind',
          ],
          correctIndex: 1,
          explanation:
            'Without position, you win less often and win less with marginal hands than the raw equity promises. Pot odds are necessary but not sufficient — playability weighs in too.',
        },
      ],
    },
    {
      id: 'm2-l5',
      title: 'Isolation, Squeeze & Multiway',
      duration: 9,
      intro:
        'Not every pot begins with a clean open-raise. Limpers, callers, and multiple opponents change the picture fundamentally — and if you know the right tools, you turn these messy situations into profit.',
      sections: [
        {
          heading: 'Isolating Limpers',
          body:
            'When one or more players limp in front of you, the standard answer with playable hands is the **isolation raise** (iso-raise for short). You raise bigger than usual in order to play the pot heads-up against the limper whenever possible — with initiative, position, and the stronger range.\n\nThe proven online sizing formula: **3bb plus 1bb per limper.** One limper: raise to 4bb. Two limpers: 5bb. If you\'re out of position, add about another 1bb. Live, you scale up in line with the bigger standard opens — 5–6bb against one limper is common there, more in call-happy games.\n\nWhy bigger than a normal open? The limper has already invested and therefore gets better odds to call. With too small a raise, you accomplish nothing: everyone calls, and you\'re playing a multiway pot with no real edge.\n\nYour iso range is wider than your normal opening range in the same position, because limpers usually signal weak, passive ranges — they would have raised their strong hands. Good candidates: all the hands in your normal opening range, plus additional Broadways and suited hands that profit from the weak limper range.',
          example:
            'Online 6-max: a player limps from the HJ and you\'re on the BTN with K♠ J♠. Standard: iso-raise to 4bb (3bb + 1 per limper). If only the limper calls, you play the flop in position, with initiative, and against a range that almost never contains a premium hand.',
        },
        {
          heading: 'The Squeeze Play',
          body:
            'A **squeeze** is a 3-bet after one player has opened and at least one other has called the open. The name captures the principle: the opponents get caught in a vise.\n\nThe situation is ideal for a big 3-bet, because both opponents are under pressure:\n\n- **The opener** has to worry about the caller still lurking behind — they can\'t simply call wide and need a real hand against your big bet.\n- **The caller** has already shown weakness with their call: they would usually have 3-bet their strongest hands (QQ+, AK) themselves. Their range is **capped** and folds often.\n\nOn top of that, there\'s already considerably more money in the pot than with a normal 3-bet — you win more right away when both fold.\n\nWith sizing, you have to price in the caller. Rule of thumb: **about 4x the open in position, 5x out of position, plus around one open per additional caller.** Example: open 2.5bb, one caller — you squeeze to about 10–11bb in position, more like 12–13bb from the big blind. Undersized squeezes are a classic mistake — they give both opponents good odds, and suddenly you\'re playing a bloated multiway pot.\n\nYou build your squeeze range like a polarized 3-bet range: value with QQ+/AK (wider against loose opponents), bluffs with blocker hands like A5s.',
          tip: 'Squeeze bluffs work best when the opener comes from late position (wide range) and the caller is known to be loose-passive. Against a UTG open plus a call from a tight player, you squeeze almost exclusively for value.',
        },
        {
          heading: 'How Multiway Pots Shift Hand Values',
          body:
            'As soon as three or more players see the flop, hand values shift fundamentally. The reason is simple math: **your equity drops with every additional opponent**, because more hands can beat you. AA wins around 85% heads-up against a random hand — against four random hands, only about 56%.\n\nEven more important is the shift in **relative** values:\n\n- **Nut potential gains:** hands that can make the best possible hand rise in value — small pairs (sets), suited aces (nut flushes), suited connectors (straights). In big multiway pots, a very strong hand usually gets shown at the end; you want to be holding the one that wins.\n- **Marginal hands lose:** offsuit Broadways like KJo or QTo live off top pair with a good kicker. Heads-up, that\'s often enough — against four opponents, top pair is frequently only the second-best hand, and you lose big exactly when you hit (reverse implied odds).\n- **Small flushes and dominated hands turn dangerous:** hitting a flush with 96s when three opponents can also hold suited hands is a classic setup for big losses.\n\nRemember: **heads-up, the best pair often wins — multiway, the best hand wins.** So play hands multiway that can make the nuts, and be careful with anything that only produces a good pair.',
          cards: ['Ad', '4d', 'Kh', 'Jc'],
        },
        {
          heading: 'Practical Adjustments for Multiway Pots',
          body:
            'The shifted value landscape translates into concrete rules for your game as soon as a pot goes multiway:\n\n- **Bluff considerably less:** a bluff has to make every single opponent fold. With three opponents who each fold 50% of the time, that works only 12.5% of the time. The classic c-bet with no hand also loses massive value multiway.\n- **Value-bet stronger, but more honestly:** your value range gets tighter — top pair with a weak kicker is rarely a value bet multiway. But when you do bet, you get paid off more often, because with several opponents, someone more often has a piece.\n- **Respect aggression:** a raise in a multiway pot almost always represents a very strong range. Hardly anyone bluffs into multiple opponents — believe the story more often than you would heads-up.\n- **Prevent it preflop:** the best multiway adjustment happens before the flop — with sufficiently large iso-raises and squeezes, you stop unwieldy family pots before they form.\n\nAnd a word on self-control: multiway pots full of limpers and callers feel like action and easy money. Stick to your criteria — nut potential, position, a clear plan — instead of tagging along with every pretty hand. Disciplined passing is the most common right answer here too.',
          tip: 'Before entering any multiway pot, ask yourself: which hand do I want to be showing at the end? If the realistic answer is "a pair with a good kicker," caution is in order.',
        },
      ],
      takeaways: [
        'Against limpers, isolate with playable hands: online 3bb + 1bb per limper; bigger out of position and live.',
        'A squeeze is a 3-bet after an open and at least one call — size it big (about 4x IP / 5x OOP plus one open per extra caller), because the caller\'s range is capped.',
        'Multiway, your equity drops with every opponent — nut potential (sets, nut flushes, straights) gains, marginal top-pair hands lose value.',
        'Multiway, you bluff less often, value-bet more honestly, and give raises considerably more respect.',
        'The best multiway adjustment is prevention: sufficiently large iso-raises and squeezes already preflop.',
      ],
      quiz: [
        {
          question: 'Two players limp, and you want to isolate on the button with A♠ Q♦. What is the standard online sizing?',
          options: [
            '2.5bb, like a normal open',
            '4bb',
            '5bb',
            '8bb',
          ],
          correctIndex: 2,
          explanation:
            'The formula is 3bb + 1bb per limper: with two limpers, that\'s 5bb. A normal open sizing would give both limpers far too good odds to call.',
        },
        {
          question: 'What defines a squeeze play?',
          options: [
            'A raise against multiple limpers',
            'A 3-bet after an open has already found at least one caller',
            'A 4-bet from the blinds',
            'An all-in with a draw',
          ],
          correctIndex: 1,
          explanation:
            'Squeeze = a 3-bet against an open plus caller. The vise effect arises because the opener has to fear the caller behind them, and the caller\'s range is capped.',
        },
        {
          question: 'Why is the caller\'s range typically capped in a squeeze situation?',
          options: [
            'Because they sit out of position',
            'Because they would usually have 3-bet their strongest hands (QQ+, AK) themselves instead of just calling',
            'Because callers are fundamentally weak players',
            'Because they have invested fewer chips than the opener',
          ],
          correctIndex: 1,
          explanation:
            'A flat call largely removes the top hands from the range — which is exactly why the caller folds so often against a big squeeze.',
        },
        {
          question: 'Which hand gains the most relative value in a pot with four players?',
          options: [
            'K♥ J♦',
            'A♦ 4♦',
            'Q♠ T♥',
            'A♣ 8♥',
          ],
          correctIndex: 1,
          explanation:
            'A4s can make the nut flush and the wheel straight — genuine nut potential. The offsuit Broadways and Ax hands live off top pair, which multiway is often only the second-best hand.',
        },
        {
          question: 'Three opponents see the flop with you, and you\'ve missed completely with A♣ K♦. Why is a bluff c-bet much weaker here than heads-up?',
          options: [
            'Because the pot is too small for a bluff',
            'Because all opponents have to fold at the same time, which gets less likely with every additional player',
            'Because AK has no equity left against three opponents',
            'Because c-bets only work in position',
          ],
          correctIndex: 1,
          explanation:
            'A bluff needs folds from every single opponent. If three players each fold, say, 50% of the time, the complete bluff succeeds only 12.5% of the time. AK keeps its equity, but the fold equity collapses.',
        },
      ],
    },
  ],
};

export default m2;
