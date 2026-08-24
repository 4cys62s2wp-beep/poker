import type { Module } from '../../types';

const m4: Module = {
  id: 'm4',
  title: 'Postflop Play',
  subtitle: 'C-bets, value bets, and bluffs – where the money is made',
  icon: '🎯',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm4-l1',
      title: 'Reading Board Textures',
      duration: 9,
      intro:
        'The flop turns two hidden cards into a concrete balance of power. If you can classify board textures quickly and correctly, you know who the board belongs to before your first postflop decision – and the better lines almost find themselves.',
      sections: [
        {
          heading: 'Why Texture Dictates Your Strategy',
          body:
            '**Board texture** describes how the community cards interact: How high are the cards? Are they connected? Are there two or three cards of one suit? Is the board paired? From these features follows how many strong hands, how many draws, and how much air each preflop range holds on this board.\n\nThe same hand plays completely differently on different textures. Top pair on a dry board is a comfortable value candidate across multiple streets. The same top pair on a tightly connected board with two cards of one suit is often just a hand looking for a cheap way to showdown.\n\nThat’s why every good postflop decision starts with two questions: First, what is the texture like – dry or wet, static or dynamic? Second, which of the two ranges benefits from it? Only then do your own two cards come into play. Internalize that order and you’ll automatically think in ranges instead of individual hands – the most important thinking habit in postflop play.',
          tip: 'Get in the habit of naming the texture out loud (or in your head) on every flop before you look at your own cards. After a few sessions it happens automatically – and your decisions become noticeably more structured.',
        },
        {
          heading: 'Dry vs. Wet',
          body:
            'A **dry board** is disconnected and usually rainbow (three different suits): K♦ 7♠ 2♥, A♠ 8♦ 3♣, Q♥ 6♣ 2♠. There are hardly any draws – whoever is ahead here is usually still ahead after the turn. Ranges rarely hit these boards hard: the most common scenario is “no pair against no pair”.\n\nA **wet board** is connected and/or two-tone: J♥ T♥ 8♣, T♠ 9♠ 8♦, Q♦ J♦ 9♠. It’s crawling with flush draws, open-ended straight draws, and gutshots. Many hands have real equity against each other, and even strong made hands are vulnerable.\n\nThe strategic consequence: on dry boards you can accomplish a lot with small bets, because your opponent usually has little and draws barely exist. On wet boards you have to work with bigger sizings – draws should pay for their equity, and your strong hands want to build the pot while they are still clearly ahead.',
          cards: ['Kd', '7s', '2h'],
          table: {
            headers: ['Feature', 'Dry board', 'Wet board'],
            rows: [
              ['Examples', 'K♦ 7♠ 2♥, A♠ 8♦ 3♣', 'J♥ T♥ 8♣, T♠ 9♠ 8♦'],
              ['Draws', 'hardly any', 'many flush and straight draws'],
              ['Typical c-bet sizing', 'small (25–33%)', 'large (66–75%)'],
              ['Vulnerability of strong hands', 'low', 'high'],
            ],
          },
        },
        {
          heading: 'Static vs. Dynamic',
          body:
            'The second dimension: how much can the balance of power still shift on the turn and river?\n\nA **static board** like K♦ 7♠ 2♥ barely changes. Whoever holds the best hand on the flop very often still holds it on the river. Paired boards like 7♣ 7♦ 2♠ are extremely static. On these textures you have time: you can spread value across three streets, choose smaller sizings, and rarely have to fear reversals.\n\nA **dynamic board** like T♠ 9♠ 8♦ is the opposite: almost any turn – any Q, J, 7, 6, or third spade – can completely upend the hand rankings. Here the rule is: whoever is ahead now needs to get money into the pot now. Strong but vulnerable hands want to bet big while their equity is still there. Slowplaying on dynamic boards is almost always a mistake.\n\nImportant: wet and dynamic overlap heavily but are not identical. A♥ K♥ 2♥ is wet (a monotone board) but relatively static – the made flush is already there, and only a fourth heart changes much.',
          example:
            'On K♦ 7♠ 2♥, A♣ K♠ (top pair, top kicker) is still very often the best hand by the river. On T♠ 9♠ 8♦, even two pair with T♥ 9♥ can be overtaken on the turn by any Q, J, 7, 6, or third spade – same relative strength, completely different risk.',
        },
        {
          heading: 'Range Advantage: Whose Range Hits the Board?',
          body:
            '**Range advantage** answers the question: which of the two overall ranges has more equity on this board?\n\nThe classic example: you raise preflop, the big blind calls, and the flop comes A♥ 7♦ 2♣. This board belongs to you. Your range contains all of the strongest hands in full: AA, AK, AQ, AJ, and all the big pocket pairs like KK and QQ. The big blind, by contrast, would usually have 3-bet AA, KK, and AK – his calling range is **capped** at the top. On top of that: your raising range is full of Ax hands, his calling range full of middling cards that miss this board completely.\n\nThe consequence of a clear range advantage: you get to c-bet very often and very cheaply, because your opponent can barely fight back against small bets – he simply has something too rarely. This is exactly where the modern strategy of small range bets on ace-high and king-high dry boards comes from.\n\nRemember: range advantage almost always comes down to who the high cards help and who has the uncapped range – and on high, dry boards that is the preflop aggressor.',
          cards: ['Ah', '7d', '2c'],
          tip: 'On every flop, ask yourself: “Which of us has more overpairs and top pairs with a good kicker here?” The answer tells you in seconds who holds the range advantage.',
        },
        {
          heading: 'Nut Advantage: Who Holds the Monsters?',
          body:
            '**Nut advantage** is the second, finer question: who holds more of the very strongest hands – sets, straights, two pairs? It can sit with a different player than the raw equity edge.\n\nExample: you raise on the button, the big blind calls, flop T♠ 9♠ 8♦. The big blind defends lots of hands preflop like T9s, 98s, 87s, 76s, J7s, and small pairs – exactly the material that makes straights, two pairs, and sets on this board. Your overpairs like QQ or KK are still ahead a lot of the time, but here they are no longer monsters – more like bluff catchers against aggression.\n\nMiddling, connected boards like this help the big blind’s calling range far more than the raiser’s range. The consequence: as the raiser you c-bet less often and more carefully here, and you have to expect to get raised. Conversely, the big blind may get aggressive on these textures – with his strong hands and suitable semi-bluffs.\n\nRule of thumb: high, dry boards belong to the preflop raiser. Middling and low, connected boards help the caller. Paired and very low boards sit in between and deserve a closer look.',
          cards: ['Ts', '9s', '8d'],
        },
      ],
      takeaways: [
        'Board texture first, your own hand second: dry or wet, static or dynamic – the plan follows from that.',
        'Dry, static boards allow small bets and value across several streets; wet, dynamic boards demand big bets while the equity is still there.',
        'Range advantage = whose overall range has more equity. High, dry boards like A72 rainbow belong to the preflop raiser.',
        'Nut advantage = who holds more sets, straights, and two pairs. Middling, connected boards like T98 two-tone help the caller.',
        'Your opponent’s calling range is usually capped – he often no longer has your strongest hands in his range at all.',
      ],
      quiz: [
        {
          question: 'Which of these boards is the most dry and static?',
          options: ['K♦ 7♠ 2♥', 'T♠ 9♠ 8♦', 'Q♥ J♥ 9♣', 'J♠ T♦ 8♠'],
          correctIndex: 0,
          explanation:
            'K72 rainbow is disconnected, with no flush or straight draws – hardly any turn or river changes the balance of power. The other boards are connected and/or two-tone, making them wet and dynamic.',
        },
        {
          question: 'What does it mean when a board is “dynamic”?',
          options: [
            'There are at least two high cards',
            'The balance of power can shift heavily on the turn and river',
            'The pot automatically grows faster',
            'It is always a paired board',
          ],
          correctIndex: 1,
          explanation:
            'Dynamic means: many upcoming cards can upend the hand rankings. That’s why strong but vulnerable hands on dynamic boards need to take value immediately instead of playing slow.',
        },
        {
          question: 'Why does the preflop raiser have a clear range advantage over the big blind on A♥ 7♦ 2♣?',
          options: [
            'Because the big blind can never hold an ace on this board',
            'Because only the raiser has hands like AA, AK, and all the overpairs fully in range, while the big blind would usually have 3-bet those',
            'Because dry boards fundamentally always belong to the raiser',
            'Because the raiser has position on the big blind',
          ],
          correctIndex: 1,
          explanation:
            'The big blind holds Ax hands too, but his calling range is capped: the absolute top hands are missing, because he would have 3-bet them preflop. The raiser has them all – plus plenty of strong Ax. Position is a separate, independent edge.',
        },
        {
          question: 'Why is T♠ 9♠ 8♦ a good board for the big-blind caller’s range?',
          options: [
            'His calling range is packed with hands like T9s, 98s, 87s, and 76s that make two pairs, straights, and strong draws here – he has the nut advantage',
            'The big blind has more equity than the raiser on every flop',
            'The raiser cannot hold an overpair on this board',
            'Because there are two spades and the big blind only calls suited hands',
          ],
          correctIndex: 0,
          explanation:
            'Middling, connected cards hit exactly the suited connectors and medium hands the big blind defends with preflop. The raiser’s overpairs are still often ahead, but the monsters sit disproportionately with the caller.',
        },
        {
          question: 'You hold A♦ K♠ on K♦ 7♠ 2♥ (top pair, top kicker). What follows from the static texture?',
          options: [
            'You must bet big immediately, because many draws can overtake you',
            'You can bet smaller and calmly spread the value across several streets, because your hand is rarely overtaken',
            'You should check, because no worse hand calls you',
            'You should immediately inflate the pot to the maximum with an overbet',
          ],
          correctIndex: 1,
          explanation:
            'On static boards there are hardly any draws, and your hand almost always stays best. There is no rush – smaller bets across three streets keep weaker hands in your opponent’s range and thereby maximize your value.',
        },
      ],
    },
    {
      id: 'm4-l2',
      title: 'Continuation Bets',
      duration: 9,
      intro:
        'The continuation bet (c-bet) – the preflop raiser’s bet on the flop – is the most-used tool in postflop play. Used well, it wins countless small pots almost risk-free; used badly, it burns your win rate piece by piece.',
      sections: [
        {
          heading: 'Why the C-Bet Is So Powerful',
          body:
            'Two forces make the c-bet profitable. First, **initiative**: you signaled strength preflop and get to credibly continue that story on the flop. Second, **fold equity**: an unpaired starting hand flops a pair or better only about one time in three. So your opponent usually has little – and hands with no substance can barely continue against a bet.\n\nThe math behind it is compelling: a bluff bet of one third of the pot only needs to generate an immediate fold 25% of the time to pay for itself. Every extra percent of folds beyond that is pure profit – and that’s before counting the times you can still win after getting called.\n\nBut beware of autopilot: the days of c-betting every hand on every board are over. Good opponents attack players who bet too often with raises and floats. Modern c-bet strategy is therefore strictly driven by board texture: on some boards you bet small almost always, on others rarely and big – the next sections show you the system behind it.',
          tip: 'Before every c-bet, ask yourself: what is this bet trying to achieve – folds from better hands, calls from worse ones, or protection of my equity? If you can’t find an answer, checking is usually the better choice.',
        },
        {
          heading: 'Small on Dry Boards: the Range Bet',
          body:
            'On high, dry boards with a clear range advantage – A♥ 7♦ 2♣, K♦ 8♠ 3♥, Q♠ 7♦ 2♣ as the preflop raiser against the big blind – the modern standard is a **small c-bet of 25–33% of the pot with nearly your entire range**.\n\nWhy does this work? On these boards your opponent usually has nothing and cannot profitably continue against any bet size. So you don’t need a big sizing to generate folds. At the same time, the small bet accomplishes three things at once:\n\n- Your bluffs and weak hands buy the pot cheaply, or a free card on the turn.\n- Your value hands get calls from hands that would fold to a big bet.\n- You take away the free chance of hands like two overcards or gutshots to overtake you (equity denial).\n\nBecause you bet almost your whole range here, the bet is also hard to exploit: your opponent can’t read anything about your hand strength from the small bet. The precondition matters, though: this recipe applies to boards with a clear range advantage – not as a universal answer for every flop.',
          example:
            'You raise to 2.5bb on the button and the big blind calls. Flop K♦ 8♠ 3♥, pot 5.5bb. You bet 1.75bb (about 33%) – with AK just as with 65s. The big blind folds everything without a piece or draw potential, and that frequent case alone makes the bet highly profitable.',
        },
        {
          heading: 'Big and Polarized on Wet Boards',
          body:
            'On wet, dynamic boards like J♥ T♥ 8♣, the logic flips. Here your opponent’s range hits plenty too – small bets generate hardly any folds, and your strong hands are vulnerable. So you bet **less often, but bigger: 66–75% of the pot, with a polarized range**.\n\nPolarized means: you bet your strong value hands (two pair+, sets, strong combinations of pair and draw) and your best semi-bluffs (flush draws, open-ended straight draws). The middle of your range – weak pairs, medium showdown hands – checks.\n\nThe big bet serves two purposes: your value hands build the pot while they are clearly ahead and force draws to pay a bad price for their equity. And your semi-bluffs apply real pressure, because even medium made hands face unpleasant decisions against a 75% sizing – with the draw as your parachute if you get called.\n\nOn boards that clearly hit the caller’s range (say, T♠ 9♠ 8♦ as the button against the big blind), you cut your overall c-bet frequency sharply and check plenty of decent hands too.',
          cards: ['Jh', 'Th', '8c'],
        },
        {
          heading: 'When to Check: Check-Back Candidates',
          body:
            'Not betting isn’t capitulation – it’s often the plan with the highest expected value. The classic **check-back candidates** in position:\n\n- **Medium showdown hands**: second or third pair, ace high. These hands are rarely called by worse and not folded by better – so a bet accomplishes almost nothing. They want a cheap showdown, or a fresh evaluation on the turn.\n- **Vulnerable hands on dangerous boards** that couldn’t handle a check-raise well.\n- **Weak hands with live equity**, such as two overcards with backdoor draws, which can turn into a semi-bluff on a good turn (see the delayed c-bet in lesson 6).\n\nThe check-back controls the pot size, keeps you from betting yourself into difficult spots with medium hands, and invites aggressive opponents to bluff into you on later streets – bluffs your showdown strength can then comfortably call.',
          example:
            'You raise on the button with A♣ 9♣ and the big blind calls. Flop Q♦ 9♦ 5♠. Your second pair with top kicker is too strong to give up but too weak for three streets of value. A check-back keeps the pot small, and on the turn you decide fresh – often with a comfortable call against a turn bet.',
        },
        {
          heading: 'Out of Position: Ease Off the Gas',
          body:
            'All the recipes so far become more cautious once you are **out of position (OOP)** – say, when you raise from UTG and the button calls. Without position you lack information about your opponent’s action, you have less control over the pot size, and your opponent can **float** you: he calls the flop lightly in order to take the pot away from you on the turn or river as soon as you show weakness.\n\nSo OOP the rule is: **a much lower c-bet frequency, more checks – even with decent hands**. Especially on middling, connected boards that help your opponent’s calling range, checking is often clearly the best option. A check OOP doesn’t mean giving up: your checking range contains check-calls with showdown hands, check-raises with strong hands, and semi-bluffs – which keeps it unpleasant to attack.\n\nOn boards with a massive range advantage (A♥ 7♦ 2♣ after your UTG raise), you may still bet small frequently. But the rule of thumb is: the better the board for the caller and the worse your position, the more often you check – and the more clearly you need a plan for the turn and river before you invest chips.',
          tip: 'If you want to c-bet OOP, run the turn test first: do you already know which turn cards you’ll keep betting on and which you’ll give up on? If not, better to check right away.',
        },
      ],
      takeaways: [
        'The c-bet lives on initiative and fold equity: your opponent misses the flop about two times out of three.',
        'Dry boards with a range advantage: bet small (25–33%) with nearly your entire range.',
        'Wet boards: bet less often but big (66–75%) and polarized – strong hands plus semi-bluffs, the middle checks.',
        'Medium showdown hands are check-back candidates: they win more through pot control than through a bet.',
        'Out of position you c-bet far less often – without a plan for the turn, checking is almost always better.',
      ],
      quiz: [
        {
          question: 'You bet 33% of the pot as a pure bluff. How often does your opponent have to fold at minimum for the bet to be profitable on its own?',
          options: ['25%', '33%', '50%', '66%'],
          correctIndex: 0,
          explanation:
            'Break-even = bet divided by (bet + pot): 0.33 / 1.33 ≈ 25%. Exactly this favorable math is what makes small c-bets on dry boards so strong.',
        },
        {
          question: 'On which board does a big, polarized c-bet (66–75%) make the most sense as the preflop raiser?',
          options: ['A♥ 7♦ 2♣', 'K♦ 8♠ 3♥', 'J♥ T♥ 8♣', 'K♣ K♠ 4♦'],
          correctIndex: 2,
          explanation:
            'J♥ T♥ 8♣ is wet and dynamic: strong hands need to build the pot right away and charge the draws. On the dry boards A72, K83, and KK4, the small range bet is the standard.',
        },
        {
          question: 'Which hand is the most typical check-back candidate in position?',
          options: [
            'Top pair with top kicker',
            'Second pair or ace high with showdown value',
            'A strong flush draw',
            'A set on a wet board',
          ],
          correctIndex: 1,
          explanation:
            'Medium showdown hands barely profit from a bet: worse folds, better calls. Top pair and sets bet for value; strong flush draws are ideal semi-bluffs.',
        },
        {
          question: 'Why should you c-bet less often out of position than in position?',
          options: [
            'OOP you have less control over the turn and river, and your opponent can float you with position',
            'OOP the range advantage automatically belongs to your opponent',
            'OOP you should fundamentally only bet monsters',
            'OOP check-raises are not possible',
          ],
          correctIndex: 0,
          explanation:
            'Without position you act first on every street and without information. Opponents in position can call lightly and contest the pot later. The range advantage itself depends on the board, not on position.',
        },
        {
          question: 'You raise on the button, the big blind calls. Flop K♦ 7♠ 2♥. What is the modern standard approach?',
          options: [
            'Only bet with a king or better',
            'C-bet small (25–33%) with nearly your entire range',
            'Bet big (75%) with a polarized range',
            'Mostly check, because the board helps no one',
          ],
          correctIndex: 1,
          explanation:
            'On this high, dry board the raiser has a clear range advantage and the big blind usually has nothing. The small range bet wins lots of pots cheaply, extracts value, and gives away nothing about your hand.',
        },
      ],
    },
    {
      id: 'm4-l3',
      title: 'Value Betting',
      duration: 9,
      intro:
        'Bluffs are spectacular, but the big money in poker comes from value bets – above all from the ones weaker players miss. This lesson shows you how to maximize value systematically.',
      sections: [
        {
          heading: 'The Definition That Is Worth Money',
          body:
            'A **value bet** is a bet that is meant to get called by worse hands. That sounds trivial but is constantly misunderstood. The decisive yardstick is not “I’m probably ahead”, but: **if my opponent calls, do I win more than half the time?**\n\nThe difference is enormous. You can hold the best hand with 80% probability – but if only the 20% of better hands call your bet and everything worse folds, your “value bet” loses money. Conversely, a bet with a medium-strength hand can be highly profitable if your opponent’s calling range is stuffed with worse hands.\n\nThat’s why value betting always starts from your opponent’s calling range: which specific hands call me – and how many of them do I beat? This question decides not only whether you bet, but also how much. It is the through-line of this entire lesson.\n\nAn important side effect: if you ask this question consistently, you automatically stop betting medium hands “just to be safe” – one of the most expensive habits there is, because such bets keep only the wrong half of your opponent’s range in the pot.',
        },
        {
          heading: 'Thin Value Bets: the Win-Rate Engine',
          body:
            'A **thin value bet** is a bet that gets called only slightly more often by worse than by better – say, with top pair and a medium kicker on the river. This is exactly where the wheat separates from the chaff: average players anxiously check these hands down, good players consistently collect the last bet.\n\nThe effect on your win rate is bigger than it seems. Spots for thin value bets come up constantly – far more often than the rare monster hands. Winning an extra half bet in hundreds of such spots per month shifts your entire win rate measurably upward.\n\nThin value bets are especially rewarding against **calling stations** – opponents who call with too many weak hands. Against them your value range expands dramatically: second pair with a good kicker can be a clear river bet when your opponent pays off with any pair and any ace high.\n\nThe reverse holds just as much: against very tight opponents who only call with strong hands, your value range shrinks – the same hand that is a mandatory bet against the station becomes a check against the nit.',
          example:
            'River board K♠ 9♦ 5♣ 2♦ 2♠, you hold K♦ T♦ against a calling station. They call with any king, many nines, and some pocket pairs. Your small-to-medium bet wins against the bulk of that range – checking would be giving away money.',
        },
        {
          heading: 'Sizing Logic: Tailor the Bet to Its Target',
          body:
            'The right bet size follows from two questions: which worse hands are supposed to call – and how price-sensitive are they?\n\nSome calling ranges are **elastic**: your opponent calls a small bet with many hands, a big one with only a few. The rule here: with very strong hands, pick the biggest sizing your target hands will still call. With thin value hands, bet smaller so enough worse hands stay in the pot – a small bet that gets called by second pairs beats a big one that only better kings pay off.\n\nOther calling ranges are **inelastic**: calling stations and players glued to their draw or top pair call almost regardless of size. Against them, simply bet big with your strong hands – every percent of pot you shave off the bet is value given away.\n\nDoing this, you automatically avoid two common mistakes: first, the one-size-fits-all bet (“always 50%”), which neither maximizes value nor keeps bluffs cheap. Second, the reverse pattern of many amateurs – big with monsters, tiny with thin value – which observant opponents exploit immediately.',
          tip: 'Before you bet, ask: “Which specific hand is supposed to call me here – and what is the highest price it will pay?” The sizing then almost picks itself.',
        },
        {
          heading: 'Planning Three Streets of Value',
          body:
            'With a very strong hand – a set, two pair, a strong overpair on a good board – the planning starts on the flop with one simple question: **how do I get a big pot by the river?**\n\nThe answer lies in pot geometry. The pot grows multiplicatively: every bet enlarges the base for the next one. An example with 100bb stacks: after a raise and a call, the flop pot is about 5.5bb. Three bets of about 70% of the pot, each called, produce a final pot of about 75bb – a mini pot turns into a large share of the stacks.\n\nSkip the flop instead, and on the turn you face the same 5.5bb pot – and even two big bets only get it to just over 30bb. The skipped street cannot be made up without implausible overbets. Hence: **if you want a big pot on the river, you have to start betting on the flop.**\n\nSlowplay has its place – on extremely dry boards against hyper-aggressive opponents who do the betting for you. But as a default it loses twice over: the pot stays small, and free cards give your opponent free chances to overtake you or lose faith in his hand.',
          cards: ['8h', '8d'],
          example:
            'You hold 8♥ 8♦ and flop a set on K♠ 8♣ 3♦. The plan is set immediately: bet flop, bet turn, bet river – against Kx hands you want three growing streets of value. Check the flop “to hide your strength” and you almost never get the stacks in anymore.',
        },
        {
          heading: 'Defining Your Value Targets',
          body:
            'The final building block is a simple discipline: **before every value bet, name the specific worse hands that will call you.** Not “he could have something worse”, but: “he calls with KQ, KJ, QJ, and flush draws.”\n\nThis test protects you in both directions. If you can produce a clear list, you can bet with confidence and tailor the sizing to exactly those hands. If you can’t find a single worse hand that calls, your bet is not a value bet – then checking is right, or the bet would have to work as a bluff and fold out better hands. A bet that only gets called by better and only folds out worse is the most expensive move in poker.\n\nYour value targets shift from street to street. On the flop, draws and weak pairs still call you; by the river the draws have arrived or busted, and the calling range consists only of made hands. That’s why the same hand value often gets thinner across the streets – top pair that was thick value on the flop can be no more than a check on a river after four overcards.\n\nThis one question – “who calls me with worse?” – is the most reliable compass in all of postflop play.',
        },
      ],
      takeaways: [
        'A value bet means: when called, you win more often than you lose – the calling range decides, not your gut feeling.',
        'Thin value bets are the biggest win-rate lever: frequent spots where weak players systematically leave money behind.',
        'Sizing follows the target: big against inelastic callers, smaller for thin value, never one uniform sizing for everything.',
        'Big pots only come from early bets: start on the flop with strong hands and plan three streets.',
        'Before every bet, name specific worse hands that call – if there are none, it is not a value bet.',
      ],
      quiz: [
        {
          question: 'When is a bet a genuine value bet?',
          options: [
            'When you probably hold the best hand',
            'When worse hands call you often enough – meaning you are usually ahead when called',
            'When your opponent folds frequently',
            'When you have at least top pair',
          ],
          correctIndex: 1,
          explanation:
            'The calling range is what matters: even with the probable best hand, a bet loses money if only better hands call. Folds make bluffs, not value bets.',
        },
        {
          question: 'River board K♠ 9♦ 5♣ 2♦ 2♠, you hold K♦ T♦ against a calling station that calls with any king and many nines. Best line?',
          options: [
            'Check – you only beat bluffs',
            'A small-to-medium value bet, because worse Kx and 9x hands call frequently',
            'Overbet all-in for maximum pressure',
            'Hope for a check-raise opportunity',
          ],
          correctIndex: 1,
          explanation:
            'Against a station, top pair with a good kicker is a clear thin value bet: their calling range is full of worse kings and nines. A check gives away exactly those calls.',
        },
        {
          question: 'You flop a set with 100bb stacks on a dry board. Why should you usually start value betting right away?',
          options: [
            'Because too many draws will overtake you otherwise',
            'Because it takes three growing bets to build a big pot by the river – skip a street and you can hardly get the stacks in anymore',
            'Because slowplay violates etiquette',
            'Because otherwise your opponent always folds the turn',
          ],
          correctIndex: 1,
          explanation:
            'The pot grows multiplicatively: every bet enlarges the base for the next one. On dry boards protection is secondary – the argument for the flop bet is pot geometry.',
        },
        {
          question: 'Your opponent calls river bets almost regardless of size (an inelastic calling range). How do you adjust your sizing with a very strong hand?',
          options: [
            'Bet smaller, to be sure of getting called',
            'Bet bigger – every percent less is value given away',
            'The sizing doesn’t matter',
            'Check and hope your opponent bets',
          ],
          correctIndex: 1,
          explanation:
            'When the call probability barely depends on the price, the biggest credible bet maximizes your expected value. Betting small here would be a pure gift.',
        },
        {
          question: 'You want to bet the river but can’t find a single worse hand that would call. What follows?',
          options: [
            'Bet anyway – for protection',
            'The bet would not be a value bet: check, or consider it only if it works as a bluff that folds out better hands',
            'Bet bigger so your opponent makes a mistake',
            'Always play check-call',
          ],
          correctIndex: 1,
          explanation:
            'There is no protection left on the river – every bet is either value or a bluff. If nothing worse calls, the bet can only make sense as a bluff; otherwise the check is correct.',
        },
      ],
    },
    {
      id: 'm4-l4',
      title: 'Bluffing with a System',
      duration: 9,
      intro:
        'Good bluffs are not tests of courage but calculated investments: they use hands with the right properties, tell a credible story, and know when to quit.',
      sections: [
        {
          heading: 'What Makes a Good Bluff Candidate',
          body:
            'Not every weak hand is a good bluff. The best candidates meet three criteria:\n\n- **Equity and backdoor potential**: the hand can improve – via a draw, or at least backdoor draws (draws that need two matching cards). If you get called, the hand isn’t dead, and good turn cards allow credible further bets.\n- **Blockers**: your cards reduce the number of strong combos your opponent can hold. If you hold an ace, he can less often have AA or top pair with an ace – your fold equity rises.\n- **Little showdown value**: the hand almost never wins at showdown on its own. A medium pair, by contrast, wins unimproved often enough – it loses more through a bluff than it gains.\n\nThe third point is the most important sorting rule for your range: hands with showdown value check and call; hands without showdown value – but with potential – take on the bluffing work. That keeps your betting range dangerous and your checking range stable.\n\nCompletely hopeless hands without any potential, on the other hand, you bluff sparingly: they lack the plan B if your opponent doesn’t fold immediately.',
          example:
            'Flop K♠ 8♥ 3♦ after your preflop raise. Q♠ J♠ is an ideal bluff candidate: no showdown value, but two overcards against medium pairs, a backdoor flush draw, and backdoor straight draws. 7♥ 7♣, by contrast, prefers to check – the pair wins the showdown unimproved often enough.',
        },
        {
          heading: 'Semi-Bluffs: Bluffing with a Parachute',
          body:
            'The **semi-bluff** – a bet or raise with a draw – is the backbone of any solid bluffing strategy, because it wins in two ways: your opponent folds immediately, or you hit your draw and win an inflated pot.\n\nThis double chance to win fundamentally changes the math. A pure bluff has to generate enough folds to pay for itself on its own. A semi-bluff needs far less fold equity, because your equity when called covers a large part of the bill.\n\nAn example: you hold 9♥ 8♥ on T♥ 6♥ 2♣ – flush draw plus gutshot, 12 outs in total and thus about 45% equity to the river. If you bet or raise and get called, you’re nearly a coinflip against top pair. If your opponent folds even occasionally, the aggressive line is clearly profitable – and when your draw arrives, the pot is already nicely sized.\n\nHence the rule: build your big, aggressive bluffing lines preferably around flush draws, open-ended straight draws, and combo draws. Pure air bluffs remain the exception for special spots – say, with strong blockers on the river.',
          cards: ['9h', '8h'],
          tip: 'If you’re unsure whether a hand may be played aggressively enough: count the outs. From about 8 outs plus fold equity, aggression is almost never a big mistake.',
        },
        {
          heading: 'Using Blockers Deliberately',
          body:
            'A **blocker** is a card in your hand that makes certain combos impossible for your opponent. For bluffs, blockers are worth gold, because they thin out exactly the hands your bluff would have to fear.\n\nThe textbook example: on a river board with three hearts you hold the A♥ – but no flush. Your opponent now cannot hold the nut flush, and many of his medium heart hands would have played differently earlier. At the same time, it is extremely hard for him to call a big bet without a flush of his own. Spots exactly like this carry bluffs with a high expected value.\n\nOther classic blocker effects: an ace in your hand blocks AA and top-pair combos on ace-high boards. If you hold a king yourself on K♠ Q♦ 7♣ 4♥ 2♦, your opponent has top pair less often – your river bluffs win more often.\n\nThe flip side is called **unblocking**: ideal bluff cards do not block your opponent’s folding hands. If you bluff with cards that block precisely his weak hands – the ones folding anyway – you remove the wrong combos from his range. Rule of thumb for the river: block his strong calling hands, not his folds.',
        },
        {
          heading: 'Storytelling: Tell a Credible Story',
          body:
            'Every bet makes a claim. A bluff only works if your entire line – from preflop to the river – tells the story of a strong hand **that you would actually play exactly this way**.\n\nThe central test question is: which value hands play exactly this line? If you suddenly raise big on the river after passively calling two streets, your opponent has to ask himself which strong hand would play like that. If there are barely any, the story collapses – and good opponents call you with astonishingly weak hands.\n\nBluffs are most credible where the board hits your range: you raised preflop and the turn brings an ace? Your barrel represents exactly the Ax hands you hold in abundance. The river completes a flush draw you can credibly hold as the aggressor? That, too, carries a big bet.\n\nThe reverse holds as well: don’t bluff against your own story. A big bet on a card that obviously doesn’t help your range but does help your opponent’s – say, a middling connecting turn after your raise on a high board – is money poured into an implausible narrative.',
          tip: 'Before you bluff, briefly switch perspectives: “If I had his hand – would this line really make me fold?” If you would call yourself, the bluff usually isn’t one.',
        },
        {
          heading: 'Give-Up Discipline and the Right Ratio',
          body:
            'Systematic bluffing includes systematic giving up. A flop bluff with backdoor draws is a conditional investment: if the turn improves your equity or brings a credible scare card, the story continues. If it brings a brick – a card that changes nothing – giving up is usually right. Following every started bluff through to the river turns small, calculated losses into big ones.\n\nThe overall quantity needs structure too. On the river, where no more equity is coming, game theory offers a clear guideline: with a pot-sized bet, your opponent gets 2:1 on a call and needs 33% equity. So that he can neither call nor fold automatically at a profit, your betting range should consist of roughly **2:1 value to bluffs** – about one third bluffs. The smaller your bet, the fewer bluffs it can support.\n\nThese numbers are orientation, not dogma: against players who fold too much, you bluff more; against stations, hardly at all. But they protect you from the two classic extremes – chronic overbluffing and total abstinence, which makes your value bets predictable.\n\nAnd not least: an abandoned bluff is not a lost duel but a correctly capped investment. Accept that, and you bluff more calmly – and tilt less often.',
          table: {
            headers: ['River sizing', 'Share of bluffs (rough)', 'Value:bluff'],
            rows: [
              ['1/2 pot', '25%', '3:1'],
              ['2/3 pot', 'about 29%', '2.5:1'],
              ['Pot', 'about 33%', '2:1'],
            ],
          },
        },
      ],
      takeaways: [
        'Good bluff candidates have equity or backdoors, useful blockers, and little showdown value.',
        'Semi-bluffs with draws are the backbone: two ways to win instead of one, so they need far less fold equity.',
        'Blockers raise your fold equity by thinning out your opponent’s strong calling hands – block his calls, not his folds.',
        'A bluff needs a consistent story: there must be value hands that play exactly the same line.',
        'Give-up discipline and rough ratios (pot-sized river bet: about 2:1 value to bluffs) keep your bluffs profitable.',
      ],
      quiz: [
        {
          question: 'Which hand is the best bluff candidate on K♠ 8♥ 3♦ after your preflop raise?',
          options: [
            'Q♠ J♠',
            '7♥ 7♣',
            'A♦ 8♦',
            'K♥ Q♥',
          ],
          correctIndex: 0,
          explanation:
            'Q♠ J♠ has no showdown value but holds overcards to your opponent’s medium pairs plus backdoor flush and straight draws. 77 and A8 have showdown value and prefer to check; KQ is a value hand.',
        },
        {
          question: 'Why are semi-bluffs the backbone of a good bluffing strategy?',
          options: [
            'Because they always have more fold equity than pure bluffs',
            'Because they win in two ways: through immediate folds or by hitting the draw',
            'Because draws frequently win at showdown even unimproved',
            'Because draws entitle you to bigger sizings',
          ],
          correctIndex: 1,
          explanation:
            'The draw’s equity covers part of the bill: even when the fold doesn’t come, you still win often. That’s why semi-bluffs need far less fold equity than pure bluffs.',
        },
        {
          question: 'River board with three hearts, you hold the A♥ without a flush. Why is this a strong bluff spot?',
          options: [
            'Because if called you can still hit the flush',
            'Because you block the nut flush: your opponent cannot hold it and can hardly call big bets without a flush of his own',
            'Because the ace often wins at showdown by itself',
            'Because heart boards statistically produce more folds',
          ],
          correctIndex: 1,
          explanation:
            'The A♥ as a blocker removes the strongest calling hand from your opponent’s range entirely. No more cards are coming on the river – the value lies purely in the blocker effect, not in equity.',
        },
        {
          question: 'You bet pot-sized on the river. What value:bluff ratio is roughly balanced?',
          options: ['1:1', '2:1', '3:1', '4:1'],
          correctIndex: 1,
          explanation:
            'Against a pot-sized bet your opponent gets 2:1 and needs 33% equity to call. If about a third of your betting range is bluffs (2:1 value to bluffs), he can profit automatically neither by calling nor by folding.',
        },
        {
          question: 'You c-bet Q♠ J♠ on K♠ 8♥ 3♦ and get called. The turn is the 4♣ – a brick that also buries your backdoor flush draw. What is usually right?',
          options: [
            'Keep betting, because giving up shows weakness',
            'Usually give up – the turn added neither equity nor credibility',
            'All-in as maximum pressure',
            'Whatever comes: only bet again on the river',
          ],
          correctIndex: 1,
          explanation:
            'The flop bluff was a conditional investment. Without new equity and without a scare card, the second bullet has no foundation – give-up discipline caps the loss at the small flop bet.',
        },
      ],
    },
    {
      id: 'm4-l5',
      title: 'Playing Draws the Right Way',
      duration: 10,
      intro:
        'Draws are hands in waiting – and exactly that is why they are misplayed so often. This lesson gives you the numbers and the decision logic to either call every draw profitably, turn it into aggression, or lay it down with discipline.',
      sections: [
        {
          heading: 'Count Outs, Know Your Odds',
          body:
            '**Outs** are the cards that make your hand the (presumably) best one. From the outs follow your chances of hitting – and you need those memorized, because they are the basis of every draw decision.\n\nThe key numbers: a flush draw has 9 outs, an open-ended straight draw (OESD) 8, a gutshot 4. A combo draw of flush draw plus OESD comes to 15 outs, making it actually a slight favorite against top pair.\n\nFor quick math at the table there is the **rule of 2 and 4**: outs times 2 gives roughly your chance of hitting in percent for the next card. Outs times 4 gives the chance from flop to river – but careful: that number only applies when you are guaranteed to see both cards, say after an all-in on the flop. If you call the flop using “outs times 4” but have to pay again on the turn, you are rating your draw twice as good as it is.\n\nCount honestly, too: outs that can give your opponent an even better hand are not full outs. A straight out that simultaneously completes the flush, or a draw to the low end of the straight, is worth less than the raw number suggests.',
          table: {
            headers: ['Draw', 'Outs', 'Next card', 'Flop to river'],
            rows: [
              ['Gutshot', '4', 'about 9%', 'about 17%'],
              ['OESD', '8', 'about 17%', 'about 32%'],
              ['Flush draw', '9', 'about 19%', 'about 35%'],
              ['Flush draw + OESD', '15', 'about 32%', 'about 54%'],
            ],
          },
        },
        {
          heading: 'Applying Pot Odds in Practice',
          body:
            '**Pot odds** compare the price of a call with what there is to win in the pot. The formula: required equity = call divided by (pot after your call).\n\nAn example: there’s €10 in the pot and your opponent bets €5 (half pot). You have to call €5 to win a total pot of €20: 5 / 20 = **25% required equity**.\n\nNow match that against your draw: a flush draw hits with the next card about 19% of the time. That is below the required 25% – on pure pot odds, the call is narrowly not justified. A combo draw with 32%, on the other hand, calls easily, and against a smaller bet of one third pot (required equity: 20%), even the plain flush draw with its roughly 19% is only a hair below the threshold – already minimal implied odds make that call profitable.\n\nTwo mistakes to avoid here. First: using the flop-to-river number on the flop when the next bet looms on the turn – calculate per street whenever further bets are to be expected. Second: viewing pot odds in isolation. Narrowly unprofitable calls often become profitable once future winnings are added – which is the subject of the next section.',
          example:
            'Pot €10, bet €5: you need 25% equity. A flush draw (about 19% per street) isn’t enough on its own – an OESD + flush draw (about 32%), on the other hand, calls clearly profitably.',
        },
        {
          heading: 'Implied Odds: the Hidden Money',
          body:
            '**Implied odds** extend the pot-odds math by the money you additionally win on future streets when your draw arrives. They explain why many narrowly “unprofitable” draw calls are actually good – and when they are not.\n\nYour implied odds are good when three things come together:\n\n- **Deep stacks**: behind the current bet there has to be money left that you can win. At 100bb that is usually the case; after big bets across several streets the room shrinks.\n- **A disguised draw**: nobody sees a straight coming with 8♥ 7♠ on a rainbow board – whereas the third heart completing the obvious flush draw sets off every alarm bell in your opponent’s head. Disguised draws get paid, obvious ones rarely.\n- **An opponent willing to pay** with a strong but second-best hand – say, an overpair that cannot fold.\n\nRule of thumb for the gutshot: at about 9% per street, you should be able to win roughly ten times your call in total for the call to carry itself.\n\nThe dark sister is called **reverse implied odds**: draws that can hit and still lose – the low flush draw against a higher one, the bottom end of the straight – win small pots and lose big ones. Value such draws far more conservatively.',
        },
        {
          heading: 'Aggressive or Passive? The Four Factors',
          body:
            'Every draw poses the same question: **call and draw cheaply – or apply pressure yourself with a bet or raise?** Four factors decide:\n\n- **Fold equity**: can your opponent fold at all? Against a tight player whose range holds many medium-strength hands, a semi-bluff raise wins twice over. Against a station that never folds, the raise loses half its value – then the call with correct odds is better.\n- **Nut potential**: draws to the nuts (nut flush draw, top end of the straight) like to play big pots and may go aggressive. Weak draws want small pots and prefer the call.\n- **Position**: in position you can control the turn after a call, take free cards, and fully realize your equity – the call becomes more attractive. Out of position, aggression is often the better way out of an unpleasant spot.\n- **Stack depth**: deep stacks strengthen the implied odds and thus the call. As the stacks get small relative to the pot, the value of the semi-bluff raise rises – all the way to all-in if need be, because you combine fold equity with equity and can no longer be pushed off your hand.\n\nThe ideal case for aggression: a strong draw with nut potential and real fold equity against a range full of weak hands – like 8♠ 7♠ on 9♠ 6♠ 2♦ with 15 outs.',
          cards: ['8s', '7s'],
        },
        {
          heading: 'Draws Out of Position',
          body:
            'Out of position, draws lose value: you cannot take free cards, you don’t know your opponent’s intentions, and you realize your equity worse. So the strategy shifts.\n\nThe **check-raise as a semi-bluff** becomes your most important weapon OOP. Example: you defend the big blind, flop a flush draw on 9♠ 6♠ 2♦, and check-raise the raiser’s small c-bet. That takes over the initiative, generates immediate fold equity against his many weak range bets – and if he calls, you still have your outs. Strong draws with nut potential are the perfect candidates, because they want to play big pots.\n\nThe **check-call** remains right for medium draws with suitable pot odds, especially against small bets. But be honest in the recount: OOP you get full payment less often after hitting – your effective implied odds are worse than in position. Weak, non-nutted draws without a fold-equity plan quickly become money burners OOP, especially in already-large pots.\n\nAnd leading out (the **donk bet** into the preflop aggressor) remains the exception: on most textures, the check-raise or check-call is the stronger structure, because it first collects your opponent’s bet instead of scaring it away.',
          tip: 'Sort your draws OOP into two drawers: strong draws with nut potential want to check-raise, medium draws with good odds want to check-call. Whatever fits neither drawer folds to pressure.',
        },
      ],
      takeaways: [
        'Core numbers by heart: flush draw about 19% per street and 35% to the river, OESD about 17%/32%, gutshot about 9%/17%.',
        'Rule of 4 only with two guaranteed cards (all-in on the flop) – otherwise calculate per street.',
        'Pot odds provide the baseline, implied odds the hidden money: best with deep stacks, a disguised draw, and an opponent willing to pay off.',
        'Aggressive with fold equity and nut potential (semi-bluff raise), passive with good odds in position – four factors: position, fold equity, nut potential, stack depth.',
        'Out of position, the check-raise with strong draws is your most important weapon; weak draws without a plan are money burners there.',
      ],
      quiz: [
        {
          question: 'You flop a flush draw (9 outs). How likely are you to hit the flush by the river if you see both cards?',
          options: ['about 19%', 'about 35%', 'about 45%', 'about 54%'],
          correctIndex: 1,
          explanation:
            '9 outs times 4 gives 36% by the rule of thumb – exactly it is about 35%. The 19% applies to a single card, 54% to the combo draw with 15 outs.',
        },
        {
          question: 'Pot €12, your opponent bets €6. You hold only a gutshot (4 outs). Call or fold?',
          options: [
            'Call – the pot odds are easily enough',
            'Leaning fold: you need 25% equity but have only about 9% for the next card – defensible only with very good implied odds',
            'Call – by the rule of 4 you have 16% and that is enough',
            'A raise is the only sensible option',
          ],
          correctIndex: 1,
          explanation:
            'Calling €6 for a €24 pot = 25% required equity; the gutshot delivers only about 9% per street. The rule of 4 doesn’t apply here, because further bets loom on the turn. Without strong implied odds, folding is right.',
        },
        {
          question: 'Which combination argues most strongly for a semi-bluff raise instead of a call?',
          options: [
            'High fold equity and a draw to the nuts',
            'No fold equity, but good position',
            'An opponent who never folds and a weak draw',
            'An already-huge pot and a gutshot',
          ],
          correctIndex: 0,
          explanation:
            'The semi-bluff lives on two ways to win: folds and completed draws. Both are maximized when your opponent can fold and your draw makes the strongest hand when called.',
        },
        {
          question: 'When are your implied odds at their best?',
          options: [
            'Deep stacks, a disguised draw with nut potential, and an opponent willing to pay off',
            'Short stacks and an obvious flush draw',
            'A tight opponent who instantly gives up after the third flush card',
            'Implied odds are roughly the same in every situation',
          ],
          correctIndex: 0,
          explanation:
            'Implied odds are future money: there has to be stack left behind, your opponent must not see the draw coming, and he has to be willing to pay with a second-best hand.',
        },
        {
          question: 'When may you use the rule of 4 (outs times 4 on the flop)?',
          options: [
            'Any time you hold a draw on the flop',
            'Only when you are guaranteed to see both cards, for example after an all-in on the flop',
            'Only with flush draws of 9 or more outs',
            'Only when you are in position',
          ],
          correctIndex: 1,
          explanation:
            'Outs times 4 describes the chance over two cards. If you have to pay again on the turn, your flop call only buys one card – then outs times 2 applies.',
        },
        {
          question: 'Big blind against a button raiser: you flop a combo draw on 9♠ 6♠ 2♦ (flush draw + OESD, 15 outs) and he c-bets small. What favors the check-raise over the check-call?',
          options: [
            'With about 54% equity to the river plus fold equity you win in two ways and avoid difficult turn spots out of position',
            'Out of position, the check-raise is fundamentally mandatory',
            'The check-raise keeps the pot small',
            'It is the cheapest way to get to the river',
          ],
          correctIndex: 0,
          explanation:
            'The combo draw is actually the favorite against top pair. The check-raise attacks the raiser’s many weak range bets and makes you independent of how unpleasant the turn card gets.',
        },
      ],
    },
    {
      id: 'm4-l6',
      title: 'Mastering the Turn & River',
      duration: 10,
      intro:
        'On the turn and river the pots get big and the mistakes get expensive. If you plan here instead of reacting – in barreling as in bluff catching – you win exactly the big blinds that make up your win rate at the end of the month.',
      sections: [
        {
          heading: 'The Double Barrel: the Right Second Bullet',
          body:
            'A **double barrel** is the second bet on the turn after your c-bet, a **triple barrel** the third one on the river. Whether they make sense is decided above all by the turn card – good barrel cards have at least one of these properties:\n\n- **They hit your range**: overcards like an ace or king on middling boards are classic **scare cards** – cards that make the preflop raiser’s range significantly stronger and put your opponent’s medium pairs in trouble.\n- **They improve your equity**: a turn that additionally gifts you a flush draw or gutshot gives your bluff a second way to win – barreling becomes almost automatically correct.\n- **They don’t help your opponent’s range**: bricks like an offsuit 2 change nothing – here you keep barreling selectively, above all with equity or good blockers.\n\nExample: you raise on the button, c-bet on 9♠ 6♥ 2♦, and the big blind calls. The A♦ turn is the perfect barrel card: it hits your range full of Ax hands, while your opponent’s 9x and pocket-pair hands are suddenly playing against a credibly stronger range.\n\nFor the triple barrel: it should be planned, not improvised. By the turn you should already know on which rivers you will finish telling the story – ideally with blockers to your opponent’s calling hands.',
          cards: ['9s', '6h', '2d', 'Ad'],
        },
        {
          heading: 'The Delayed C-Bet',
          body:
            'The **delayed c-bet** is the deferred continuation: as the preflop raiser you check the flop (usually in position), and when your opponent checks again on the turn, you bet.\n\nWhy is that strong? Your opponent’s double check says a lot: hands with real substance would often have bet the turn themselves after you showed weakness on the flop. After check-check his range is unusually weak and capped – so your turn bet wins astonishingly often on the spot, and at the price of a single small bet instead of two streets of barreling.\n\nYou know the ideal candidates from lesson 2: hands that checked the flop but bring potential – two overcards that picked up a gutshot, backdoor draws that got there, or medium hands that bet the turn thin for value after your opponent has shown weakness twice.\n\nThe delayed c-bet has one more structural advantage: it protects your flop checking range. If you never bet the turn after a check-back, every observant opponent gets a license to pounce automatically after your flop check. A healthy share of delayed c-bets makes your checks unattackable – and turns apparent passivity into a trap.',
          tip: 'Against players who almost always give up on the turn after your check-back, the delayed c-bet is nearly automatic – make a point of noting such tendencies.',
        },
        {
          heading: 'The River: Value Bet or Bluff Catcher?',
          body:
            'On the river the last card falls – from now on there is no more equity, only made hands. So before every river decision, sort your hand into one of three classes:\n\n- **Value hand**: worse hands call your bet often enough. Then bet – the size follows from the calling range (lesson 3).\n- **Bluff catcher**: your hand beats your opponent’s bluffs but practically none of his value hands. A bluff catcher never bets itself: it checks and, facing a bet, decides between call and fold.\n- **Air**: the hand wins no showdown. It is either a give-up or – with the right blockers and a credible story – a bluff candidate.\n\nThe most common expensive mistake is mixing the first two classes: players bet medium hands “to see where they stand”, get called only by better, folded only by worse – and have turned a solid bluff catcher into a money bonfire. Remember: on the river there is no protection and no information bet anymore. Every bet is either value or a bluff, and every hand in between wants to check.\n\nThis three-way sort takes a few seconds per river at first – with practice it becomes a reflex that saves you from most big river mistakes.',
        },
        {
          heading: 'Bluff Catching by the Numbers',
          body:
            'Whether a bluff catcher may call is pure arithmetic: you compare the **required equity from the pot odds** with your opponent’s **estimated bluffing frequency**. Since your bluff catcher wins exactly when he is bluffing, your equity is roughly his bluff share.\n\nYou know the price list: against a pot-sized bet you need 33%, against a half-pot bet 25%. Now the other side: how many bluffs reach the river on this line? Concrete pointers:\n\n- Did draws miss that he would have played this way? A river on which the flush draw and the OESD bust at the same time carries many natural bluffs.\n- Is this opponent even capable of firing three times? Many players bluff the flop, some the turn – but on the river most give up.\n- Do I block his value hands or his bluffs? A blocker to the completed flush suit makes the call better.\n\nThe uncomfortable truth from millions of analyzed hands: **the average opponent bluffs the river far too rarely**, especially with big sizings. If your estimate falls below the required equity, fold – even if it feels like giving up. Good folds are invisible winnings.',
          table: {
            headers: ['Opponent’s river bet', 'Required equity to call'],
            rows: [
              ['1/3 pot', '20%'],
              ['1/2 pot', '25%'],
              ['2/3 pot', 'about 29%'],
              ['Pot', 'about 33%'],
            ],
          },
          example:
            'Pot €20, your opponent bets €20. You need 33% equity. By your estimate his line contains at most 20% bluffs (few missed draws, a passive player type). 20% < 33% – the fold is clear, no matter how “bluffy” it feels.',
        },
        {
          heading: 'Big River Raises: Respect Pays Off',
          body:
            'The most expensive single situation in cash games: you value bet the river, and your opponent raises big. The statistics on this are unambiguous – **big river raises from the average opponent are massively value-heavy**. The reason is psychological: a river-raise bluff risks a lot of money without any equity against a range that has just shown strength. Very few players have that in their repertoire; most only raise straights, flushes, sets, and better two pairs there.\n\nThe consequence: against unknown and passive opponents you may – and must – usually fold even strong one-pair hands like top pair top kicker after a big river raise. Yes, occasionally you let a bluff get away unpunished. But the mix of rare bluffs and your visibly strong hand makes the call a long-term loser. It’s different only against demonstrably creative, aggressive opponents – and for that you need actual observations, not just a gut feeling.\n\nA closing word on discipline: the turn and river are the streets where tilt is most expensive. A disciplined fold, an abandoned bluff, or a lost big pot are part of the game – judge your decisions by the quality of the reasoning, not by the outcome of the single hand. Keep those separate, and you play the big streets calmer, better, and with a healthy distance from the money.',
          tip: 'Keep a list of the opponents you have actually caught bluffing with a big river raise. It will stay short – and that is exactly the lesson.',
        },
      ],
      takeaways: [
        'Good barrel cards hit your range (overcards, scare cards) or improve your equity – triple barrels are planned on the turn, not improvised on the river.',
        'The delayed c-bet attacks your opponent’s weak check-check range while protecting your own flop checking range.',
        'Classify every hand on the river: a value hand bets, a bluff catcher checks and does the math, air gives up or bluffs with blockers.',
        'Bluff catching is arithmetic: required equity (pot-sized bet: 33%) against estimated bluffing frequency – the average opponent bluffs the river too rarely.',
        'Big river raises from the average opponent are almost always value – disciplined folds with strong one-pair hands win in the long run.',
      ],
      quiz: [
        {
          question: 'You raise on the button and c-bet on 9♠ 6♥ 2♦; the big blind calls. Which turn is the best card for a double barrel?',
          options: ['A♦', '7♥', '2♣', '6♦'],
          correctIndex: 0,
          explanation:
            'The ace hits the preflop raiser’s range full of Ax hands and puts the opponent’s 9x and pocket-pair hands under pressure. The 7 rather connects the caller’s range, and the pairing cards change little to his disadvantage.',
        },
        {
          question: 'What is a delayed c-bet?',
          options: [
            'An especially small c-bet on the flop',
            'As the preflop raiser you check the flop and only bet the turn, after your opponent has checked again',
            'A c-bet you only make after thinking for a long time',
            'Any bet on the river after two checked streets',
          ],
          correctIndex: 1,
          explanation:
            'After check-check your opponent’s range is unusually weak and capped – the deferred turn bet therefore wins very often on the spot while also protecting your flop checking range.',
        },
        {
          question: 'On the river your opponent bets big. Your hand beats his bluffs but none of his value hands. What is your hand now?',
          options: [
            'A thin value hand that should bet itself',
            'A bluff catcher – the decision depends on pot odds and his estimated bluffing frequency',
            'An automatic fold, regardless of any numbers',
            'A candidate for a raise as a bluff',
          ],
          correctIndex: 1,
          explanation:
            'That is precisely the definition of a bluff catcher: it only wins against bluffs. Whether the call is right is decided by comparing the required equity to the bluff share – not by gut feeling.',
        },
        {
          question: 'Pot €20, your opponent bets €20 on the river. You estimate his bluffing frequency on this line at about 20%. Call or fold with your bluff catcher?',
          options: [
            'Call – 33% pot odds is a good price',
            'Fold – you need 33% equity but only win against about 20% of his range',
            'Call, because you should never let big bets push you around',
            'Raise as a bluff to fold out his value hands',
          ],
          correctIndex: 1,
          explanation:
            'Against the pot-sized bet you need 33% equity; his estimated 20% bluffs deliver only 20%. The call loses money in the long run – the fold is clearly the better decision.',
        },
        {
          question: 'An average, rather passive opponent raises your river value bet big. You hold top pair top kicker. Best reaction?',
          options: [
            'Usually fold – big river raises from this player type are almost always value',
            'Always call, because top pair top kicker is too strong to fold',
            '3-bet all-in for protection',
            'Call, because opponents bluff the river just as often as they value bet',
          ],
          correctIndex: 0,
          explanation:
            'River-raise bluffs are extremely rare from the average opponent – the raising range consists mostly of two pair and better. Against that range, top pair is a long-term loser, and protection doesn’t exist on the river.',
        },
      ],
    },
  ],
};

export default m4;
