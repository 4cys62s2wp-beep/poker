import type { Module } from '../../types';

const m5: Module = {
  id: 'm5',
  title: 'Advanced Concepts',
  subtitle: 'Ranges, GTO, blockers, and tournament strategy',
  icon: '🧠',
  level: 'Profi',
  lessons: [
    {
      id: 'm5-l1',
      title: 'Thinking in Ranges',
      duration: 11,
      intro:
        'Strong players don\'t try to guess which two cards their opponent holds. They work with the set of all hands he can have in this situation – and narrow that set street by street. This range-based thinking is the single most important step from casual player to serious player.',
      sections: [
        {
          heading: 'Why Hand-Guessing Fails',
          body:
            'The classic beginner line goes: "I put him on AK." The problem: even the best player in the world cannot deduce a single hand from actions. Dozens of hands fit any betting line, and if you commit to one, you\'re almost always wrong – and making decisions based on a fiction.\n\nA **range**, by contrast, is the set of all hands a player can consistently hold at a given point based on his actions so far – ideally weighted, because some hands are only played that way part of the time. Instead of "He has AK," you think: "His barreling range is roughly top pair or better, a few strong draws, and some bluffs."\n\nThe advantage is mathematical: against a range you can calculate equity, count combos, and determine defense frequencies. Against a guessed single hand, all you can do is hope. Range thinking also makes decisions reproducible: the same situation leads to the same analysis, regardless of whether you\'re winning or tilting.',
          tip: 'Never phrase reads as a single hand – phrase them as a category list: "Value: X, draws: Y, bluffs: Z." If you can\'t come up with anything for a category, that itself is valuable information.',
        },
        {
          heading: 'Step 1: Establish the Preflop Range',
          body:
            'Every range analysis starts preflop, because that\'s where the information is most reliable: position plus action define the starting set. An open-raise from early position means a tight, strong range; an open from the button a very wide one.\n\nFor 6-max at 100bb, these are rough modern guidelines for open-raises (RFI, "Raise First In"):\n\n- **UTG**: about 16% – roughly 22+, A9s+, A5s, KTs+, QTs+, JTs, T9s, 98s, ATo+, KJo+\n- **Hijack**: about 20%\n- **Cutoff**: about 27%\n- **Button**: about 43% – including many suited hands and weak broadways\n- **Small blind**: about 45%, possibly with a limping component depending on strategy\n\nJust as important: calls define ranges too. A player who just calls in the big blind against a button open usually has no premiums left (he would mostly 3-bet those), but plenty of medium and speculative hands. This preflop classification is your foundation – everything after it is just filtering.',
          example:
            'A tight player open-raises UTG and you hold Q♥ J♥. Against his roughly 16% range you\'re often dominated (AQ, KQ, QQ, JJ hit the same boards better). The same hand against a button open, however, is clearly playable – same cards, completely different situation, because the opposing range is different.',
        },
        {
          heading: 'Step 2: Narrow It Street by Street',
          body:
            'Every action is a filter: hands that would (almost) never take this action drop out of the range. Hands that would always take it stay fully weighted. That\'s how you narrow the preflop range across the flop, turn, and river.\n\nThree principles help:\n\n- **Categories instead of single hands**: sort the remaining range into value hands, draws, and bluffs/air. Watch how the proportions shift with each street.\n- **Pay attention to sizing**: a small c-bet (continuation bet, the follow-up bet by the preflop aggressor) on a dry board barely narrows the range – many players bet their entire range there. A big turn bet after a check-raise narrows it dramatically.\n- **Factor in card effects**: every new board card changes the range without anyone acting. If the flush comes in, draws become value; if the draw misses on the river, those same combos move into the bluff category.\n\nThe asymmetry matters: aggressive actions (bets, raises) filter strongly, passive ones (checks, calls) weakly. And what a player does NOT do counts too. Someone who checks back the flop rarely has strong hands afterward – his range is "capped".',
          tip: 'With every opponent action, ask yourself: "Which hands from his range so far play this way – and which don\'t?" If you ask that question routinely in game, you\'re already thinking in ranges.',
        },
        {
          heading: 'Example Hand: A Complete Range Analysis',
          body:
            'Cash game, 6-max, 100bb. A solid reg open-raises to 2.5bb in the cutoff, you call in the big blind with 8♠ 8♦. His starting range: about 27% – all pairs, broadways, suited aces, suited connectors, plus ATo+, KJo+.\n\n**Flop K♦ 7♣ 2♥** (pot 5.5bb): You check, he bets 1.8bb. On this dry king-high board, good regs c-bet small and very often, frequently with their entire range. Filtering effect: minimal. Your call with 88 is standard – you beat his many unpaired hands.\n\n**Turn 4♠** (pot 9.1bb): He barrels 6.5bb, about 70%. Now the filter kicks in: the second, bigger bet is played mainly by Kx (AK, KQ, KJs, KTs), sets (KK, 77, 22), AA – and, as bluffs, gutshots and open-ended draws like 65s, 86s, 53s, A5s. Hands like QJ or A8s usually give up. Your 88 now only beats the bluffs, but there are enough of them: call.\n\n**River A♥** (pot 22.1bb): He bets 16.5bb. Count it out: the ace turns his ace-high bluffs into value (A5s now has top pair, 53s even the A-2-3-4-5 straight), AK becomes two pair, AA a set. What remains as bluffs is almost exclusively missed 65s and 86s – few combos. Your 88 blocks none of the relevant ones. The range analysis is unambiguous: **fold**.',
          cards: ['Kd', '7c', '2h', '4s', 'Ah'],
          example:
            'The core of the analysis: not "Does he have me beat?" but "How many value combos versus how many bluff combos remain after this line on this card?" On the river above, roughly 40+ value combos face a handful of missed draws – that\'s why the fold is mathematically clear, even though 88 is a pair.',
        },
        {
          heading: 'Common Thinking Errors',
          body:
            'Range thinking rarely fails on the concept – it usually fails on discipline. The typical errors:\n\n- **Single-hand fixation**: "He has aces" or "He\'s definitely bluffing" – both replace analysis with gut feeling. Always keep the entire weighted set in view.\n- **Range morphing**: you want to call, so you retroactively talk bluffs into the opposing range that his line simply doesn\'t contain. The range is defined by his actions, not by your desired outcome.\n- **Projection**: you assign the opponent your own range. A player who never raises with draws simply has no draws after raising – even if you would raise there yourself.\n- **Monsters under the bed**: out of fear you give the opponent nothing but the nuts and fold hands that continue clearly profitably against his actual overall range.\n- **No updating**: you set a preflop range and then ignore that the turn barrel and the river card have long since changed it.\n\nThe common denominator: emotion overriding logic. The countermeasure is a fixed process – establish the starting range, filter after every action, compare combos at the end. Always in that order, regardless of how the session is going.',
          tip: 'After the session, write up one marked hand as a range walkthrough. Ten clean written analyses are worth more than a hundred gut-feel reads at the table.',
        },
      ],
      takeaways: [
        'A range is the weighted set of all hands consistent with the actions so far – never a single guessed hand.',
        'Position plus preflop action define the starting range; every subsequent action and every board card filters it.',
        'Aggressive actions narrow ranges sharply, passive ones only slightly – and a player who only checks and calls often ends up "capped".',
        'On the river, the ratio of value combos to bluff combos decides, not the absolute strength of your hand.',
        'The biggest errors are emotional: range morphing, projection, and fear of the nuts. A fixed analysis process protects you from them.',
      ],
      quiz: [
        {
          question: 'What is the core difference between range thinking and "I put him on AK"?',
          options: [
            'Range thinking only works with tracking software',
            'Range thinking means always assuming the worst',
            'There is none – both are reads',
            'Range thinking works with the weighted set of all consistent hands instead of a single guessed hand',
          ],
          correctIndex: 3,
          explanation:
            'Guessing a single hand is almost always wrong and impossible to calculate against. Against a range, however, you can compute equity and combos and reach reproducible decisions.',
        },
        {
          question: 'A good reg c-bets one third pot on K♦ 7♣ 2♥. How much does that narrow his range?',
          options: [
            'A great deal – it signals at least top pair',
            'Barely – on dry boards many players bet almost their entire range small there',
            'It removes all bluffs from his range',
            'It removes all strong hands, because he would slowplay those',
          ],
          correctIndex: 1,
          explanation:
            'Small c-bets on dry, range-friendly boards are often made with (almost) the entire range. The filtering effect is minimal – real information only comes from later, bigger bets.',
        },
        {
          question: 'What best describes the thinking error known as "range morphing"?',
          options: [
            'You forget to update the range after the turn',
            'You give the opponent too many nut combos',
            'You retroactively adjust the opposing range so it justifies the call you want to make',
            'You confuse suited and offsuit combos',
          ],
          correctIndex: 2,
          explanation:
            'With range morphing, you invent bluffs or weaker hands in the opponent\'s range because you want to call. But the range has to follow from his actions, not from your desired outcome.',
        },
        {
          question: 'In the example hand (board K♦ 7♣ 2♥ 4♠ A♥), 88 becomes a fold on the river. What is the main reason?',
          options: [
            'The ace turns many of his bluffs into value hands, so hardly any bluff combos remain',
            '88 can no longer beat a bluff',
            'The opponent always has AK when he bets three times',
            'Pocket pairs are always folds on the river',
          ],
          correctIndex: 0,
          explanation:
            'The river smashes his barreling range: A5s, 53s, AK, and AA turn into value, while almost the only bluffs left are missed 65s/86s. The value-to-bluff ratio tips so far that the call becomes unprofitable.',
        },
        {
          question: 'Why does a big-blind calling range against a button open usually contain no more premiums like AA or AK?',
          options: [
            'Because you fold premiums in the big blind',
            'Because the button blocks premiums',
            'Because premiums are unplayable out of position',
            'Because those hands would mostly be 3-bet and are therefore filtered out of the pure calling range',
          ],
          correctIndex: 3,
          explanation:
            'Your own actions filter your range too: a player who almost always 3-bets premiums signals with a call that he rarely holds exactly those hands. Calls define ranges just as much as raises do.',
        },
      ],
    },
    {
      id: 'm5-l2',
      title: 'GTO vs. Exploitative Play',
      duration: 11,
      intro:
        'GTO and exploitative play are often sold as opposites – in truth, they are two tools of the same craft. This lesson explains both mindsets, the math behind them (MDF and alpha), and how to combine them in practice.',
      sections: [
        {
          heading: 'What GTO Really Means',
          body:
            'GTO stands for **Game Theory Optimal** and describes an equilibrium strategy (Nash equilibrium): a mixed strategy against which no opponent can profitably deviate in the long run – no matter what he does. GTO is therefore **unexploitable**, not "maximally profitable".\n\nThe central tool is **indifference**: a GTO strategy mixes value bets and bluffs in exactly the ratio at which the opponent\'s bluff-catchers have the same expected value whether they call or fold – namely zero extra profit. The opponent cannot improve no matter what he chooses. That\'s precisely why solvers play so many actions at mixed frequencies ("30% bet, 70% check").\n\nAvoid two misconceptions. First: GTO does not mean tight or passive – equilibrium strategies bluff a lot and aggressively, just in balanced proportions. Second: against players with big mistakes, GTO leaves money on the table, because it doesn\'t attack those mistakes directly. It automatically wins something against mistakes, but not the maximum.\n\nThe practical value of GTO study lies less in memorizing frequencies than in understanding the structure: which hands make good bluffs, which boards belong to which range, how much defense is required.',
          tip: 'Use solver outputs as a map, not a rulebook: understand WHY a hand gets bet (equity, blockers, playability) – the reasoning transfers, the exact frequency doesn\'t.',
        },
        {
          heading: 'MDF: How Often Do You Have to Defend?',
          body:
            'The **minimum defense frequency (MDF)** answers the question: what share of my range must I continue with against a bet, at minimum, so that the opponent can\'t automatically profit with any random bluff?\n\nThe formula: **MDF = pot / (pot + bet)**.\n\nIts counterpart is **alpha**, the break-even success rate of a bluff: **alpha = bet / (bet + pot)** – the share of folds a pure bluff needs to pay for itself. It always holds that alpha = 1 − MDF.\n\nExample: with a pot-size bet, the bluffer risks one pot unit to win one. If you fold more than 50% of the time, he prints money with every bluff. Against a small one-third-pot bet, by contrast, a fold 25% of the time is already enough for him – which is why you have to defend very wide against small bets.\n\nAn important caveat: MDF is a concept for opponents who bluff often enough. Against someone who practically never bluffs, folding below MDF is not a leak but the correct exploit. MDF tells you what balance would require – not what wins the most against this specific opponent.',
          table: {
            headers: ['Bet size', 'MDF (your defense share)', 'Alpha (bluff break-even)'],
            rows: [
              ['33% pot', '75%', '25%'],
              ['50% pot', '67%', '33%'],
              ['66% pot', '60%', '40%'],
              ['100% pot', '50%', '50%'],
              ['150% pot', '40%', '60%'],
              ['200% pot', '33%', '67%'],
            ],
          },
          example:
            'Your opponent bets 50 into a 100 pot (half pot). Alpha = 50 / 150 = 33%: if you fold more than a third of the time, every one of his bluffs automatically profits. Your MDF = 100 / 150 = 67% – roughly two thirds of your range should continue if you want to be unexploitable.',
        },
        {
          heading: 'Exploitative Play: Punishing Mistakes to the Maximum',
          body:
            'Exploitative play means: you identify a systematic deviation from equilibrium in your opponent\'s game and deviate yourself far enough to punish that mistake maximally.\n\nThe logic is always the same: every opponent mistake has a matching counter-lever.\n\n- He folds too often to c-bets? You bluff (almost) every hand.\n- He calls too much? You barely bluff anymore and value bet thinner and bigger.\n- He bluffs too rarely on big river bets? You fold your bluff-catchers well below MDF.\n- He only 3-bets premiums? You fold hands that are dominated against that range and set-mine cheaply.\n\nTwo things make exploitative play demanding. First, you need reliable observations – a single showdown is a hint, not proof. Second, every deviation opens an attack surface of your own: a player who never bluffs can himself be exploited. Against weak, inattentive opponents that doesn\'t matter – they don\'t adapt. Against strong regs, you have to weigh how visible your exploit is and how quickly it will be picked off.\n\nThe rule of thumb: the bigger and more stable the opponent\'s mistake and the less attentive the opponent, the more extreme your deviation can be.',
          example:
            'An opponent has check-called the river three times in two hours and never shown a bluff; his big river raises always had the nuts. When he now raises your river value bet, you fold even a strong two pair – far below MDF, but clearly profitable against this profile.',
        },
        {
          heading: 'The Synthesis: GTO as Baseline, Exploits as Deviation',
          body:
            'In practice, the two approaches don\'t exclude each other – they form a tiered model:\n\n- **Tier 1 – baseline**: against unknowns, you play a solid, roughly balanced strategy close to GTO principles. It protects you from being exploited yourself while you gather information.\n- **Tier 2 – hypotheses**: you observe deviations – stats, showdowns, sizings, timing – and form concrete hypotheses from them ("folds too much to turn barrels").\n- **Tier 3 – exploits**: the more confident the hypothesis, the further you deviate deliberately. If it doesn\'t hold up, you return to the baseline.\n\nGTO knowledge is the prerequisite for good exploitative play, not its enemy: only someone who knows roughly what equilibrium looks like can recognize WHAT a mistake even is and which direction the lever points. Without a reference point, "exploit" is just another word for gut feeling.\n\nThe reverse also holds: stubbornly replaying solver frequencies while your opponent makes obvious, massive mistakes gives away exactly the edge the money at the table comes from. The highest win rate almost always comes from a solid baseline plus bold, well-reasoned deviations.',
          tip: 'Phrase every exploit as a testable statement with a countermeasure: "He overfolds the turn, so I barrel every gutshot – until a showdown proves otherwise." That keeps your game adaptive instead of dogmatic.',
        },
        {
          heading: 'Low-Stakes Reality: More Value, Less Fancy Play',
          body:
            'At low stakes – online and live alike – the player population has stable, well-documented tendencies: too much calling, too little folding, and far too little bluffing against big river sizings. That yields a clear priority list:\n\n- **Value betting is king**: bet your good hands bigger and thinner than GTO would. Against players who call with third pair, the thin value bet is the single biggest moneymaker there is.\n- **Fewer big bluffs**: multi-street bluffs and hero calls in the name of "balance" simply don\'t pay off against opponents who don\'t fold or don\'t bluff.\n- **Overfold against aggression**: a river check-raise at low stakes is almost always value. You can let your bluff-catchers go there with a clear conscience.\n- **No fancy play syndrome**: tricky slowplays, wild overbet bluffs, and leveling wars are solutions to problems that barely exist at these stakes. They usually cost more than they earn.\n\nThis doesn\'t mean GTO study is worthless there – it provides the baseline and the understanding. But the deviations from that baseline at low stakes almost all point in the same direction: simple, value-oriented, disciplined.',
          example:
            'You hold top pair with a medium kicker on the river against a calling station. The solver would often check here to stay balanced. Against this player type, the half-pot bet is still clearly better: he calls with so many worse hands that the thin value bet beats the check by a wide margin.',
        },
      ],
      takeaways: [
        'GTO is the unexploitable equilibrium strategy: it mixes value and bluffs so the opponent becomes indifferent – but it doesn\'t maximize profit against mistakes.',
        'MDF = pot / (pot + bet) tells you the minimum you must defend against a bet; alpha = bet / (bet + pot) is a bluff\'s break-even fold rate.',
        'Exploitative play deliberately deviates from equilibrium to punish identified mistakes maximally – and becomes exploitable itself.',
        'The practical formula: a solid, GTO-adjacent baseline against unknowns, bold deviations on reliable reads.',
        'At low stakes, the same adjustment nearly always wins: more and thinner value bets, fewer big bluffs, overfolding against river aggression.',
      ],
      quiz: [
        {
          question: 'Your opponent bets 2/3 pot. What is your minimum defense frequency?',
          options: ['40%', '50%', '60%', '67%'],
          correctIndex: 2,
          explanation:
            'MDF = pot / (pot + bet) = 1 / (1 + 2/3) = 60%. The remaining 40% is alpha – the fold rate beyond which every one of your opponent\'s bluffs becomes profitable.',
        },
        {
          question: 'What does a true GTO strategy guarantee – and what does it NOT guarantee?',
          options: [
            'It guarantees you can\'t be exploited in the long run – but not maximum profit against flawed opponents',
            'It guarantees maximum profit against every player type',
            'It guarantees you never lose a big pot',
            'It guarantees profits only against other GTO players',
          ],
          correctIndex: 0,
          explanation:
            'GTO is a defensive guarantee: no opponent can profitably deviate against it. Against big mistakes it automatically wins something, but less than a deliberately exploitative strategy would.',
        },
        {
          question: 'A pot-size bet as a pure bluff is break-even when the opponent folds how often?',
          options: ['25%', '33%', '50%', '67%'],
          correctIndex: 2,
          explanation:
            'Alpha = bet / (bet + pot) = 1 / 2 = 50%. You risk one pot unit to win one – if the opponent folds more than half the time, every bluff is immediately profitable.',
        },
        {
          question: 'You notice that an opponent practically never bluffs on big river bets. What is the correct adjustment?',
          options: [
            'Keep defending exactly at MDF to stay balanced',
            'Bluff more on the river yourself',
            'Only call with the nuts and slowplay them',
            'Fold your bluff-catchers well below MDF – overfolding is the exploit against this mistake',
          ],
          correctIndex: 3,
          explanation:
            'MDF only protects you against opponents who actually bluff. If someone never bluffs, your bluff-catchers lose to his betting range almost every time – consistent folding is then the most profitable path.',
        },
        {
          question: 'Why is "more value, less fancy play" the right default at low stakes?',
          options: [
            'Because the rake forbids bluffing there',
            'Because the population calls too much and bluffs too little – thin value bets win the most there, big bluffs the least',
            'Because GTO doesn\'t work at low stakes',
            'Because you can\'t gather reads there',
          ],
          correctIndex: 1,
          explanation:
            'The most stable population tendency at low stakes is call-happiness combined with too few bluffs of their own. The matching exploit: value bet thinner and bigger, run fewer big bluffs, and overfold against aggression.',
        },
      ],
    },
    {
      id: 'm5-l3',
      title: 'Blockers & Card Removal',
      duration: 9,
      intro:
        'Your own cards tell you more than their face value: every card in your hand is one your opponent can\'t have in his range. This card removal principle decides, in close spots, which hand you bluff with and which one you call with.',
      sections: [
        {
          heading: 'The Principle: Your Cards Are Missing from His Range',
          body:
            'A **blocker** is a card in your hand (or on the board) that reduces the number of certain opposing combos – the effect is called **card removal**.\n\nThe math behind it is simple combo arithmetic: four cards of every rank exist. AA normally comes in 6 combos. If you hold an ace yourself, only 3 remain for your opponent – you\'ve halved his chance of having aces. AK comes in 16 combos; with an ace in your hand, only 12.\n\nWhy is that strategically relevant? Because many river decisions are razor thin: whether a call or a bluff is profitable often depends on whether the opposing range contains a few value combos more or fewer. Blockers shift exactly that ratio – sometimes in your favor, sometimes against you.\n\nThat leads to the two basic applications:\n\n- **When bluffing**, you want to block the hands your opponent would call with – above all his strongest.\n- **When bluff-catching**, you want to block his value hands and specifically NOT block his bluffs ("unblock" them), so that as many bluff combos as possible remain.',
          example:
            'On the board K♦ 7♣ 2♥, without removal there are 3 combos of top set KK. If you hold a king yourself, say K♠ Q♦, exactly 1 combo remains – you\'ve removed two thirds of his top set from his range. It\'s exactly these combo shifts that turn a close spot into a clear one.',
        },
        {
          heading: 'The Classic: The Naked A♠ on a Flush Board',
          body:
            'The best-known blocker example: on a board with three spades – say 9♠ 6♠ 2♠ – you hold the A♠ without a second spade, for example A♠ K♦.\n\nTwo effects work at once. First: your opponent **cannot possibly hold the nut flush**, because the card required for it is in your hand. His calling range against big bets loses its top end. Second: you can credibly **represent** the nut flush – from your opponent\'s perspective, A♠ X♠ is a central part of your possible value range.\n\nThat\'s why hands with the naked nut blocker are first-class bluff candidates on monotone boards and on boards where the flush draw arrives on the turn or river: you bet or raise big and put hands like small flushes, sets, and overpairs under maximum pressure.\n\nThe same logic works, in weakened form, with the K♠ as the second-nut blocker. But the range logic from lesson 1 still applies: the blocker makes the bluff better, not automatically good. Against an opponent who never folds a flush anyway, the prettiest A♠ does you no good – then you\'re better off not bluffing it in the first place.',
          cards: ['As', 'Kd', '9s', '6s', '2s'],
          tip: 'Remember the hierarchy on flush boards: the nut blocker is valuable for bluffing because it removes the strongest calling hand AND makes your story credible. Hardly any other blocker type gives you both at once.',
        },
        {
          heading: 'Nut Blockers Preflop: Why A5s Is the Perfect 3-Bet Bluff',
          body:
            'Blockers work preflop too. Modern 3-bet ranges (a 3-bet is the re-raise against an open-raise) contain targeted bluffs alongside value hands – and the classics for that role are **A5s through A2s**, A5s above all.\n\nThree reasons make these hands ideal:\n\n- **Blocker effect**: your ace halves your opponent\'s AA combos (6 down to 3) and cuts AK from 16 to 12. Exactly the hands that would 4-bet you or call your 3-bet and dominate you become rarer. Your 3-bet therefore wins the pot outright more often.\n- **Playability**: if you get called, you have a real hand: nut flush potential, the wheel straight (A-2-3-4-5), and with the five a connection to low boards that miss the caller\'s range.\n- **No range loss**: A5s is only mediocre as a call against an open – so you aren\'t "burning" a hand that would be worth much more as a call. An ace with a better kicker like ATs prefers to call; a hand like 96o is simply too weak to play as a 3-bet bluff.\n\nThis pattern – nut blocker plus playability plus low opportunity cost – is the blueprint for good bluff selection in almost any spot.',
          cards: ['Ah', '5h'],
          example:
            'The button open-raises and you hold A♥ 5♥ in the small blind. Instead of calling (out of position, mediocre hand), you 3-bet: you block AA/AK, immediately fold out many worse button hands, and if called you keep nut draws and wheel potential as a fallback.',
        },
        {
          heading: 'Removal When Bluff-Catching: Block Value, Unblock Bluffs',
          body:
            'When calling, the logic flips. A good bluff-catcher meets two removal criteria:\n\n- It **blocks value**: cards that make the opponent\'s nut hands less likely increase the bluff share of his betting range.\n- It **unblocks bluffs**: it contains as few cards as possible from the missed draws your opponent bluffs with. If you hold pieces of his bluff region yourself, fewer bluff combos remain – and your call gets worse.\n\nExample: board T♠ 8♠ 4♦ 2♣ 3♠, your opponent overbets the river. With A♦ A♠ your call is clearly better than with A♦ A♥ – same hand strength, but the A♠ removes every single nut flush combo from his value range. Conversely, J♥ T♥ (top pair) is a worse bluff-catcher here than it looks: your jack sits right inside the missed straight draws (QJ, J9), so you block part of the very hands he can bluff with at all.\n\nThis kind of thinking explains seemingly paradoxical solver decisions: sometimes the weaker hand calls and the stronger one folds, because the weaker one has the better removal properties. On the river, where equity is essentially locked in, blockers are often the only criterion that still separates two equally strong bluff-catchers.',
          tip: 'Before close river calls, always ask both questions: "Which of his value hands do I block?" AND "Which of his bluffs do I block?" A call gets stronger through the former and weaker through the latter.',
        },
        {
          heading: 'The Limits of Blocker Thinking',
          body:
            'Blockers are a fine-tuning tool – and often dramatically overrated. Know these three limits:\n\n- **Small effects**: a blocker typically shifts a few combos in ranges holding dozens of combinations. It changes probabilities by a few percentage points – it doesn\'t flip a clearly lost situation. Only when a spot is close to begin with does the blocker tip the scales.\n- **Range before removal**: the order of analysis is fixed: ranges and frequencies first, then combos, blockers at the very end. "I have the A♠, so I raise" is not a plan if the opposing range doesn\'t contain enough foldable hands in the first place.\n- **Opponents have to cooperate**: blocker bluffs only win against opponents who are capable of folding strong hands at all. And blocker calls only win against opponents who bluff at all. At low stakes, where too little bluffing happens, the "removal hero call" is one of the most expensive mistakes ambitious players make – the concept is right, the population is wrong.\n\nIn short: blockers never answer the question of WHETHER a line makes sense in the first place. They answer the question of WHICH of your candidate hands executes the line best.',
          example:
            'Two players bluff the same river spot: one because the solver bluffs nut-blocker hands there and his opponent is a capable reg. The other because he "has the A♠" – against a calling station who never folds. Same concept, applied correctly once and expensively once.',
        },
      ],
      takeaways: [
        'Card removal is combo arithmetic: every card in your hand reduces certain opposing combos – an ace, for example, halves his AA combos from 6 to 3.',
        'Good bluffing hands block the opponent\'s calling and nut hands – the classic is the naked A♠ on spade boards.',
        'A5s is the model 3-bet bluff: nut blocker against AA/AK, real playability (wheel, nut flush), low opportunity cost.',
        'Good bluff-catchers block value and unblock bluffs – on the river, that\'s often the deciding criterion between call and fold.',
        'Blockers are a tie-breaker in close spots, not a substitute for range analysis – and worthless against opponents who never fold or never bluff.',
      ],
      quiz: [
        {
          question: 'You hold A♥ K♦. How many AA combos can your opponent still hold?',
          options: ['6', '4', '3', '1'],
          correctIndex: 2,
          explanation:
            'Without removal there are 6 AA combos. With one ace in your hand, three aces remain in the deck, which form only 3 possible two-card combinations.',
        },
        {
          question: 'Why is A♠ K♦ a strong bluff candidate on the board 9♠ 6♠ 2♠?',
          options: [
            'Because your opponent can\'t hold the nut flush and you credibly represent it at the same time',
            'Because ace-high often wins at showdown',
            'Because the board is low and your overcards are live',
            'Because the K♦ blocks the second-best hand',
          ],
          correctIndex: 0,
          explanation:
            'The A♠ in your hand removes every nut flush combo from the opposing range and makes your own story ("I have the nut flush") credible – the double effect of the classic nut-blocker bluff.',
        },
        {
          question: 'What makes A5s a better 3-bet bluff than, say, K9o?',
          options: [
            'A5s wins unimproved at showdown more often',
            'A5s blocks AA/AK, has nut flush and wheel potential, and is only mediocre as a call anyway',
            'K9o blocks too many of the opponent\'s bluffs',
            'A5s is a favorite against all of the opponent\'s hands',
          ],
          correctIndex: 1,
          explanation:
            'A5s combines the three criteria of good bluff selection: a nut blocker against the continuing range (AA halved, AK reduced), real playability when called, and low opportunity cost. K9o offers none of that to a comparable degree.',
        },
        {
          question: 'On the river, your opponent\'s most important bluffs are missed QJ straight draws. Which statement about your bluff-catcher is true?',
          options: [
            'With a Q or a J in your hand, your call gets better',
            'With a Q or a J in your hand, your call gets worse, because you block his bluff combos',
            'Blockers don\'t matter when calling, only when bluffing',
            'You should only call if you hold QJ yourself',
          ],
          correctIndex: 1,
          explanation:
            'When bluff-catching, you want to unblock the opponent\'s bluffs: if you hold a Q or J yourself, fewer QJ bluff combos exist – the bluff share of his betting range drops and your call loses value.',
        },
        {
          question: 'What is the most important limit of blocker thinking?',
          options: [
            'Blockers only work with suited hands',
            'Blockers shift only a few combos – they\'re a tie-breaker in close spots, but no substitute for range analysis, and they do nothing against opponents who never fold or never bluff',
            'Blockers only apply preflop, not postflop',
            'Blockers are only relevant when you hold the nuts yourself',
          ],
          correctIndex: 1,
          explanation:
            'Removal effects are small relative to the entire range. Only when range analysis and frequencies make a spot close does the blocker decide – and only against opponents whose behavior can make the line profitable in the first place.',
        },
      ],
    },
    {
      id: 'm5-l4',
      title: 'Polarized vs. Linear',
      duration: 9,
      intro:
        'It\'s not just WHAT you bet, but HOW your entire betting range is constructed that determines the right sizing. The two basic blueprints are called polarized and linear – once you understand them, you suddenly read opposing sizings like an open book.',
      sections: [
        {
          heading: 'Two Blueprints for a Range',
          body:
            'A **polarized range** consists of two extremes: very strong value hands (the "nuts" or close to it) and bluffs – the middle is missing. The logic: your strong hands want maximum value, your bluffs want maximum fold pressure, and both benefit from the same aggressive approach. Medium-strength hands don\'t fit in: they win nothing from worse hands that call and fold out no better ones – they prefer to check.\n\nA **linear range** (also called "merged") is the counter-model: it starts with the strongest hands and runs down without gaps to a cutoff – nuts, strong hands, good medium hands. It contains few bluffs in the strict sense; its weakest hands are more like thin value bets or semi-bluffs with substance.\n\nThe difference becomes tangible with a 3-bet range: polarized, you 3-bet QQ+/AK plus bluffs like A5s – and call the middle (TT, AQs, KQs). Linear, you simply 3-bet the best X percent in one block: QQ+, AK, AQ, TT, KQs and so on, with no classic bluffs at all.\n\nWhich blueprint is right depends on how your opponent reacts to pressure – that\'s the key to the next sections.',
          tip: 'Mnemonic: polarized = barbell (two heavy ends, nothing in the middle). Linear = ramp (sloping down from the top with no gaps). With every bet – yours and your opponent\'s – ask yourself: barbell or ramp?',
        },
        {
          heading: 'Sizing Follows Range Structure',
          body:
            'Range blueprint and bet size belong together – that\'s not a matter of style, it\'s math.\n\n**Polarized = big.** Your nut hands want to inflate the pot maximally, and your bluffs need fold equity against exactly the medium hands that beat you. Add the frequency effect: the bigger the bet, the worse the pot odds for the caller – and the more bluffs your range may contain at equilibrium without becoming exploitable. That\'s why overbets (bets above pot size) exist practically only from polarized ranges, typically when your range can contain the nuts and the opponent\'s is capped.\n\n**Linear = small to medium.** A range full of good but not overwhelming hands wants value from worse hands, equity denial (making weak hands fold their outs), and a controlled pot. Big sizings would fold out exactly the hands you want value from and inflate the pot against the hands that beat you.\n\nAs river guidelines from equilibrium logic: the bluff share of a polarized bet grows with the sizing – it corresponds exactly to the pot odds the caller is being offered.',
          table: {
            headers: ['River sizing', 'Bluff share (GTO guideline)', 'Value : bluff'],
            rows: [
              ['50% pot', '25%', '3 : 1'],
              ['75% pot', '30%', 'approx. 2.3 : 1'],
              ['100% pot', '33%', '2 : 1'],
              ['200% pot', '40%', '1.5 : 1'],
            ],
          },
          example:
            'Check the math on the pot-size bet: the caller pays 1 unit to win 3 (pot 1 + your bet 1 + his call 1), so he needs 33% equity. If exactly one third of your range is bluffs, his bluff-catcher wins exactly 33% of the time – he is indifferent between calling and folding.',
        },
        {
          heading: 'Typical Polarized Spots',
          body:
            'You construct your range polarized whenever the middle of your range would rather get to showdown cheaply while the extremes profit from pressure:\n\n- **River bets after missed or completed draws**: on the river there are no semi-bluffs left – every bet is value or bluff. Whoever bets there does so almost by definition polarized, choosing the size based on the strength of his value region.\n- **Overbets against capped ranges**: if your opponent\'s line has ruled out strong hands (e.g. checking back the flop, calling instead of raising the turn) while you can hold the nuts, the overbet is the tool of choice – maximum value, maximum bluff capacity.\n- **3-bets out of position against competent opens**: from the small blind against a button open, you tend to play "3-bet or fold" with a polarized structure – value plus blocker bluffs like A5s – because calls out of position against good players are expensive.\n- **Check-raises on dynamic boards**: a check-raise embodies sets, two pairs, and strong draws as semi-bluffs – barbell structure in its purest form.\n\nThe reader works in reverse too: when a solid player overbets the river, you know immediately – nuts or air, rarely in between. Your medium-strength hands thereby become pure bluff-catchers, and the blocker criteria from the last lesson take over.',
          example:
            'You check the turn as the preflop caller and your opponent checks back – his range is now largely capped. On a river that can complete your straights and sets, you overbet polarized: all nut combos plus the matching amount of blocker bluffs. His top-pair hands face the maximum-pressure decision.',
        },
        {
          heading: 'Typical Linear Spots',
          body:
            'You build your range linear when folds are unlikely or unwanted – in other words, when you primarily want to get paid by worse hands:\n\n- **Value 3-bets against loose callers**: against a player who calls 3-bets with far too many hands, bluff 3-bets are pointless (he doesn\'t fold) and thin value 3-bets are gold. You 3-bet linear: simply every hand that dominates his calling range – down to AJs, KQs, 99.\n- **Small c-bets on dry boards**: on boards like K♦ 7♣ 2♥ that clearly favor your preflop range, modern strategy often bets (almost) the entire range small – a linear construct: lots of thin value hands and equity-denial bets, hardly any pure polarity.\n- **Thin river value against stations**: against players who call with any pair, you bet top pair with a medium kicker small to medium for value – a hand that would be a check in polarized logic.\n- **Isolation raises against limpers**: here too, you don\'t want a fold – you want to build the pot with the better hand in position, so you raise a linear, dominating range.\n\nThe rule to take with you: **against players who fold too much, you polarize. Against players who call too much, you play linear.** Anyone who bluffs polarized into a calling station or value bets thin and linear against a nit has matched the wrong blueprint to the opponent.',
          tip: 'Test your river sizing with one question: "Which hands do I want to get called by – and does this opponent really call them at this size?" If the answers don\'t line up, either the sizing or the blueprint is wrong.',
        },
      ],
      takeaways: [
        'Polarized = nuts plus bluffs with no middle ("barbell"); linear/merged = gapless from the top down, value-heavy ("ramp").',
        'Sizing follows structure: polarized ranges bet big up to overbets, linear ranges small to medium.',
        'The bigger the bet, the more bluffs the range supports at equilibrium – around one third for a pot-size river bet (value:bluff = 2:1).',
        'Play polarized on river bets, overbets against capped ranges, OOP 3-bets, and check-raises; linear on value 3-bets against callers, small range c-bets, and thin value against stations.',
        'Exploit compass: polarize against overfolders; play linear and value-heavy against overcallers.',
      ],
      quiz: [
        {
          question: 'What does a polarized betting range consist of?',
          options: [
            'The best X percent of all hands, descending without gaps',
            'Very strong value hands and bluffs – without the medium-strength hands in between',
            'Only bluffs with good blockers',
            'All hands with at least 50% equity',
          ],
          correctIndex: 1,
          explanation:
            'Polarized means: the two ends of the spectrum. The middle is missing, because medium-strength hands gain nothing from big bets – they prefer to check their way toward showdown.',
        },
        {
          question: 'Why do overbets belong almost exclusively to polarized ranges?',
          options: [
            'Because overbets are only allowed with the nuts',
            'Because at huge sizings medium hands neither get value nor fold out better hands – only nuts and bluffs profit, and the big sizing simultaneously allows more bluffs',
            'Because overbets reduce variance',
            'Because linear ranges never bet the river',
          ],
          correctIndex: 1,
          explanation:
            'An overbet serves exactly two hand classes: nuts (maximum value) and bluffs (maximum pressure – and the caller\'s bad pot odds allow a higher bluff share at equilibrium). The middle loses in both directions at this sizing.',
        },
        {
          question: 'Roughly what is the GTO bluff share of a pot-size bet on the river?',
          options: ['25%', '33%', '50%', '67%'],
          correctIndex: 1,
          explanation:
            'At pot size the caller gets 2:1 on his call and needs 33% equity. If one third of the betting range is bluffs, his bluff-catcher is exactly indifferent – that\'s the equilibrium ratio of 2:1 value to bluff.',
        },
        {
          question: 'A loose player calls 3-bets with far too many dominated hands. How do you construct your 3-bet range against him?',
          options: [
            'Polarized: premiums plus A5s bluffs',
            'Linear: every hand that dominates his calling range, including thinner value like AJs or 99 – and practically no bluffs',
            'Don\'t 3-bet at all, just call',
            'Only AA and KK, to be safe',
          ],
          correctIndex: 1,
          explanation:
            'Against someone who doesn\'t fold, bluff 3-bets lose their purpose, while thin value 3-bets profit strongly. The right structure is linear and value-heavy – the opposite of the standard polarized construction against good regs.',
        },
        {
          question: 'A solid reg overbets the river after betting the turn hard. What follows for your medium-strength hands?',
          options: [
            'They are now clear value raises',
            'They become pure bluff-catchers – his range is nuts or bluff, and blocker criteria decide between call and fold',
            'They are automatic calls because of the pot odds',
            'They are automatic folds, because overbets are never bluffs',
          ],
          correctIndex: 1,
          explanation:
            'From competent players, an overbet signals a polarized range. Your middle beats all his bluffs and loses to his entire value range – exactly the definition of a bluff-catcher, where removal considerations tip the scales.',
        },
      ],
    },
    {
      id: 'm5-l5',
      title: 'Tournament Strategy & ICM',
      duration: 12,
      intro:
        'Tournaments follow the same card rules as cash games – but a completely different economy: blinds rise, stacks get shallow, and chips no longer convert one-to-one into money. If you carry cash game logic unchanged into a tournament, you burn equity in exactly the most expensive places.',
      sections: [
        {
          heading: 'What Makes Tournaments Different',
          body:
            'Three structural differences shape every tournament decision:\n\n- **Rising blinds**: in a cash game, stack depth stays constant at around 100bb – in a tournament, your stack measured in big blinds shrinks constantly, even when you don\'t play a pot. Waiting has a price; controlled aggression (above all blind steals) becomes mandatory.\n- **Antes**: from the middle stages on, the table also pays antes (usually as a big blind ante). The preflop pot is noticeably bigger as a result, and a steal immediately wins more – opening ranges and big blind defense widen accordingly.\n- **Shallow stacks and no re-buys**: while 100bb+ in a cash game leaves room for multi-street maneuvers, in a tournament you often play with 15–40bb. Implied odds shrink (set mining and speculative calls lose value), the preflop decision becomes the main decision – and a lost stack means elimination, not a rebuy.\n\nOn top of that comes the most fundamental difference: you get paid by finishing position, not per chip. This fact – formalized in ICM – changes the math of every big decision and is the subject of the final sections.',
          tip: 'In a tournament, constantly track two numbers: your own stack depth in big blinds and that of your opponents at the table. Almost every strategic adjustment hangs on these values, not on the absolute chip count.',
        },
        {
          heading: 'Strategy by Stack Depth',
          body:
            'Stack depth dictates which tools are even available to you:\n\n- **Above 60bb**: close to cash game play – full range diversity, postflop room to maneuver, speculative hands keep their value.\n- **25–60bb**: beware of bloated pots: a 3-bet plus call quickly ties up a quarter of the stack. 4-bets effectively commit you; hands like small pairs and suited connectors lose implied odds.\n- **15–25bb**: the 3-bet often becomes an all-in ("3-bet shove" or resteal) – shallow enough to combine fold equity with showdown equity, too shallow for raise-then-call maneuvers.\n- **Below 15–20bb**: the **push/fold tendency** takes over: raising first and then folding to a shove burns too much of the stack, and postflop play out of position with a mini stack is barely playable profitably. Below about 10bb, open-shove or fold is almost always the best choice.\n\nShoving principles: **position beats card strength** – as a rough Nash guideline, at 10bb you shove well over 40% of hands from the button, but more like 15–20% from early position in 6-max. The first raiser has the advantage of fold equity; **calling ranges are therefore always considerably tighter than shoving ranges**. And: better to shove a round too early with fold equity than to get blinded down to 4bb with no leverage left.',
          example:
            'Blinds 500/1,000 with a big blind ante, you hold 9,500 chips (under 10bb) on the button with A♦ 7♣. A standard raise to 2,200 would be a mistake: facing a shove from the blinds, you\'d usually have to fold and would have given away a quarter of your stack. The correct play is the open-shove – at this depth, A7o sits clearly inside the button shoving range.',
        },
        {
          heading: 'ICM: Why Chips Don\'t Convert Linearly into Money',
          body:
            'The **Independent Chip Model (ICM)** translates chip stacks into money equity – your fair share of the prize pool. The core insight: **the monetary value of chips grows sublinearly** – every additional chip is worth less than the one before.\n\nThe reason lies in the payout structure: finishing positions get paid, not chips. Whoever wins all the chips still only receives first prize – typically 20–30% of the prize pool, not 100%. The rest of the value sits in the places below, and short stacks still have a claim on those too.\n\nA numerical example makes it tangible: a 9-player sit-and-go paying 50/30/20, everyone starts with equal chips – so 11.1% equity in the prize pool each. If you double your stack in the first hand, you have twice the chips, but by ICM only around 20% equity instead of 22.2%. Put the other way around: the player who risked his tournament life put more money equity on the line than he could possibly win.\n\nFrom this follows the most important tournament rule: **a chip-EV-neutral flip is a losing proposition under ICM.** Close spots that would be automatic calls in a cash game become folds in a tournament – and all the more clearly, the closer the next payout jump gets.',
          tip: 'Memorize this: lose your stack and you lose 100% of your tournament equity – double it and you gain less than 100%. That asymmetry is ICM in one sentence.',
        },
        {
          heading: 'Risk Premium: The Bubble and the Final Table',
          body:
            'The difference between the equity a call would need on pure chip EV and the equity it needs under ICM is called the **risk premium**. It\'s the surcharge for risking your tournament life – and it isn\'t constant, it explodes in two places:\n\n**The bubble** (just before the paid places): here the risk premium is at its highest, often 5–15 percentage points of additional equity a call requires. The practical consequences: big stacks shove and raise almost with impunity, because nobody wants to call without a monster. Medium stacks suffer the most – they have a lot to lose and must play the tightest. Short stacks stay comparatively free, because their residual value is small.\n\n**The final table**: every other player\'s bust means a pay jump for you. That\'s why, with a short stack, it can be correct to wait very tight while two other short stacks fight for survival ("laddering"). Confrontations between two big stacks are especially expensive under ICM – the one who profits is always the one watching from the sidelines.\n\nThe extreme case is the satellite: if five equal tickets go to the last five of six players, it can be correct to **fold even AA before the flop** when a bigger stack covers you – your possible gain is minimal, your risk total. No other example shows so clearly that chips and money are two different currencies.',
          example:
            'Tournament bubble, you hold Q♠ Q♥ in the big blind with 25bb. The chip leader shoves from the button, and a mini stack with 2bb sits at the neighboring table. On chip EV, QQ is a standard call – under ICM the fold can be correct: against his wide range you usually win chips, but the bubble\'s risk premium eats up the money EV of the call, while the guaranteed min-cash is within reach.',
        },
        {
          heading: 'Tournament Reality: Variance and Bankroll',
          body:
            'Finally, the uncomfortable part: tournaments are the highest-variance form of poker. The payout structure is extremely top-heavy – most of the prize pool sits in the top places, which even an excellent player reaches only rarely. Even long-term winners go through dry spells of dozens – in large fields, hundreds – of tournaments without a meaningful cash. That\'s not a sign of bad play; it\'s mathematical normality.\n\nThree consequences follow:\n\n- **Bankroll**: for multi-table tournaments, 100+ buy-ins is considered a sensible minimum, and for large fields considerably more. Playing MTTs on 20 buy-ins means playing against variance, not against your opponents.\n- **Judge decisions, not results**: a single tournament result says almost nothing about your skill. Evaluate yourself on the quality of your push/fold, ICM, and bubble decisions – results only follow over very large samples.\n- **A responsible framework**: only play with money you can comfortably afford to lose, set limits for buy-ins and session time, and take breaks after deep runs – the emotional rollercoaster of a deep run ending in a bubble bust is among the most tilt-prone situations in all of poker.\n\nAccept these ground rules and you can enjoy the strategic depth of tournaments without variance damaging your judgment or your finances.',
          tip: 'Keep a tournament log with buy-ins, cashes, and the two or three most important decisions of each tournament. It objectifies your development – and protects you from mistaking variance for skill (or for the lack of it).',
        },
      ],
      takeaways: [
        'Rising blinds, antes, and shallow stacks make tournaments a different game: waiting costs, steals win more, preflop dominates.',
        'Stack depth dictates the tools – below 15–20bb, push/fold logic takes over, and shoving ranges are considerably wider than calling ranges.',
        'ICM: the monetary value of chips grows sublinearly – an early double-up in a 9-player SNG yields about 20% instead of 22.2% equity.',
        'The risk premium turns close calls on the bubble and at the final table into folds; big stacks apply pressure, medium stacks suffer the most.',
        'Tournaments carry extreme variance: 100+ buy-ins of bankroll, judge decisions instead of results, set firm limits.',
      ],
      quiz: [
        {
          question: 'Why is a chip-EV-neutral coinflip for your entire stack usually a money-EV loss in a tournament?',
          options: [
            'Because flips are won less often in tournaments',
            'Because chips grow sublinearly in money equity: the doubled stack is worth less than twice as much, while the lost stack costs 100%',
            'Because the rake is higher in tournaments',
            'Because you have to play tighter after a flip',
          ],
          correctIndex: 1,
          explanation:
            'That\'s the core of ICM: payouts follow finishing positions, so every additional chip is worth less than the one before. A 50/50 flip trades 100% of your equity for a gain of less than 100%.',
        },
        {
          question: 'You start a 9-player SNG (paying 50/30/20) with 11.1% equity and double up in hand one. Roughly how much equity do you have under ICM?',
          options: ['22.2%', 'About 20%', '25%', 'Exactly 16.7%'],
          correctIndex: 1,
          explanation:
            'Double the chips doesn\'t mean double the equity: under ICM, the doubled stack lands at around 20% instead of the linear 22.2%. The difference is the price of the capped payout structure.',
        },
        {
          question: 'With 9bb on the button you hold A♦ 7♣. What is the best standard action?',
          options: [
            'Fold – A7o is too weak for aggression',
            'Min-raise intending to fold to a shove',
            'Open-shove – at this depth, the hand clearly belongs in the button push range',
            'Limp and see a flop',
          ],
          correctIndex: 2,
          explanation:
            'Below about 10bb, push/fold dominates: raise-folding gives away a meaningful part of the stack, and there\'s barely any postflop room. A7o sits well inside the (over 40% wide) Nash shoving range on the button at this depth.',
        },
        {
          question: 'Who suffers most from ICM pressure on the bubble?',
          options: [
            'The chip leader',
            'The shortest stacks',
            'The medium stacks – they have a lot to lose and must give up the closest spots',
            'Everyone equally, ICM is symmetric',
          ],
          correctIndex: 2,
          explanation:
            'Big stacks risk relatively little and can apply pressure; short stacks have little residual value to protect. Medium stacks carry the highest risk premium: one lost flip costs them an almost certain payout.',
        },
        {
          question: 'In which scenario can folding AA preflop be correct?',
          options: [
            'Never – AA is always a call',
            'On the bubble of a satellite with equal-value tickets, when a bigger stack covers you: minimal gain, total risk',
            'Whenever three players are all-in',
            'At the final table of a normal tournament, as a rule',
          ],
          correctIndex: 1,
          explanation:
            'In satellites, only crossing the ticket line matters – extra chips are worth almost nothing. When a call risks your tournament life but can barely gain any equity, even AA is a fold under ICM. This extreme example proves it: chips and money are different currencies.',
        },
        {
          question: 'Why do multi-table tournaments demand a much bigger bankroll than cash games?',
          options: [
            'Because the buy-ins are always higher',
            'Because the top-heavy payout structure creates extreme variance – even winners rarely cash big and endure long dry spells',
            'Because you can\'t rebuy in tournaments',
            'Because ICM halves your win rate',
          ],
          correctIndex: 1,
          explanation:
            'Most of the prize pool sits in the top places, which even strong players reach only rarely. Long stretches without a meaningful cash are mathematically normal – which is why 100+ buy-ins is the sensible minimum.',
        },
      ],
    },
    {
      id: 'm5-l6',
      title: 'Player Types & Stats',
      duration: 10,
      intro:
        'The most profitable skill in poker is not a perfect strategy of your own, but quickly and accurately profiling your opponents. This lesson gives you the five basic types, the most important stats – and a method for building profiles live, without any software at all.',
      sections: [
        {
          heading: 'The Five Basic Types',
          body:
            'Player types are pigeonholes – but useful ones: they compress hundreds of individual observations into an actionable prediction. The classics arise from two axes: tight vs. loose (how many hands someone plays) and passive vs. aggressive (whether he tends to call, or to bet and raise).\n\n- **TAG** (tight-aggressive): the solid standard reg. Few but strong hands, played with initiative.\n- **LAG** (loose-aggressive): plays many hands with constant pressure. In good hands the toughest opponent; in bad ones, an ATM with a self-destruct button.\n- **Nit**: extremely tight and risk-averse. Aggression almost always means a monster hand.\n- **Calling station**: loose-passive – calls with everything, almost never raises, rarely folds. The most profitable opponent type, if you adjust correctly.\n- **Maniac**: hyperaggressive without a plan. Raises and bluffs far beyond any notion of balance.\n\nImportant: types are starting points, not lifetime verdicts. A TAG can tilt into a maniac after losing a buy-in; a supposed nit can loosen up after two beers. Keep updating your profile – the pigeonhole only helps as long as the player is actually still in it.',
          table: {
            headers: ['Type', 'VPIP/PFR (rough)', 'Telltale signs', 'Your exploit'],
            rows: [
              ['TAG', '23/19', 'selective, takes initiative, position-aware', 'hard to attack – respect his ranges, attack capped spots'],
              ['LAG', '28/23', 'many opens and 3-bets, constant pressure', 'call in position, 4-bet lighter, give your bluff-catchers more weight'],
              ['Nit', '14/10', 'folds almost everything, only raises premiums', 'steal blinds relentlessly, fold almost everything to aggression'],
              ['Calling station', '45/8', 'calls every street, almost never raises', 'value bet thin and big, never bluff'],
              ['Maniac', '55/40', 'raises blindly, huge sizings', 'call down his bets with premiums instead of raising, don\'t let him bluff you off hands'],
            ],
          },
          tip: 'Give every opponent a working label after two or three orbits – and note which observation would disprove it. That keeps your read a hypothesis instead of a prejudice.',
        },
        {
          heading: 'VPIP and PFR: The Foundation of Every Profile',
          body:
            '**VPIP** ("Voluntarily Put Money In Pot") measures the percentage of hands in which a player voluntarily invests money – by calling or raising; blinds don\'t count. **PFR** ("Preflop Raise") measures how often he raises preflop while doing so. Read together, they are a player\'s X-ray.\n\nGuidelines for 6-max online cash:\n\n- Solid regs: VPIP 21–26, with PFR 2–4 points below it (e.g. 24/20).\n- Below 18 VPIP: tight to nitty. Above 32: loose. Above 40: almost always a recreational player.\n\nThe most valuable information sits in the **gap between VPIP and PFR**: it shows how often someone passively just calls. A 24/20 plays almost all of his hands with initiative – dangerous. A 35/10 calls constantly without a plan – the classic fish, whose wide, weak calling ranges you isolate with value hands.\n\nAlso crucial is **sample size**: VPIP and PFR start saying something reliable after about 50–100 hands. Anyone reading "24/20, solid reg" after eight hands is interpreting noise. As a rule of thumb: only when a stat is based on several dozen opportunities may you bet on it strategically.',
          example:
            'Two opponents with an identical VPIP of 28: one is 28/24 – a LAG who will put you under pressure with 3-bets and barrels. The other is 28/6 – a passive caller you value bet thin against and waste no big bluffs on. Same first number, opposite adjustments: only the VPIP/PFR pair completes the picture.',
        },
        {
          heading: 'AF and 3-Bet%: Measuring Aggression',
          body:
            'The **aggression factor (AF)** measures postflop behavior: AF = (bets + raises) / calls. An AF of 2–3 counts as healthily balanced. Below 1.5, someone is playing passively – take his bets seriously; his calls are weak and wide. Above 4, someone is hyperaggressive – his betting range contains many bluffs, and your bluff-catchers rise in value.\n\nThe **3-bet%** shows how often someone re-raises against an open-raise. Modern guidelines for 6-max:\n\n- 7–9%: a healthy, mixed 3-bet range (value plus bluffs like A5s).\n- Below 4%: almost exclusively premiums. Against this player\'s 3-bet you fold hands like AQo or 99 with a clear conscience – and 4-bet bluffs are burning money.\n- Above 11%: very light. Here your defense widens: more 4-bets (including as bluffs with blocker hands) and more calls in position.\n\nThe sample-size warning applies here too, only more so: a 3-bet opportunity arises in just a fraction of hands. Below 300–500 hands, a 3-bet% is barely reliable; the AF also needs a few hundred hands. Until then, a single hand shown at showdown often carries more weight than the number in the HUD (heads-up display, the stat overlay shown in online play).',
          tip: 'Prioritize stats by stability: VPIP/PFR first (quickly meaningful), then fold-to-c-bet and 3-bet%, and only then subtleties like river aggression. And one showdown that confirms or refutes a stat is worth more than ten additional hands of sample.',
        },
        {
          heading: 'Live Without Stats: Profiles from Observation',
          body:
            'At the live table there\'s no HUD – but more information than most players ever tap into. Here\'s how to build profiles systematically:\n\n- **Showdowns are gold**: every revealed hand exposes a complete line in reverse. Someone who shows 74s from early position has just revealed his entire range philosophy to you. After every showdown, briefly reconstruct: how did he play this hand on each street?\n- **Count hands played per orbit**: an orbit at a full table is nine hands. Someone who plays three or four of them is running a VPIP of 35–45 – your live substitute for the stat. Two orbits of observation are enough for a first classification.\n- **Watch the how**: does he limp or raise? How big are his raises – and do the sizings change with hand strength? Many live players bet their strong hands big and their weak ones small (or the other way around) and never notice.\n- **Context signals**: buy-in amount (a minimum buy-in often suggests caution or a thin bankroll), how he handles his chips, chattiness after won and lost pots, drinking habits, visible tilt behavior after bad beats.\n\nAs long as you have no individual reads, play against the **population default** for live low stakes: too loose and too passive preflop, too many calls postflop, big bets and raises almost always value. That is exactly the calling-station adjustment package – value bet thin, bluff little, respect aggression – until a player individually shows you otherwise.',
          example:
            'New table, live 1/2: after two orbits you\'ve noted: player A limps every other hand and calls every c-bet (station – value bet thin). Player B has raised twice in 18 hands and folded everything else (tight – respect her raises, steal her blinds). Player C raises every third hand to five times the big blind (suspected maniac – call him down with premiums). Three usable profiles, zero software.',
        },
      ],
      takeaways: [
        'The five basic types (TAG, LAG, nit, calling station, maniac) arise from the tight/loose and passive/aggressive axes – each comes with a fixed exploit package.',
        'VPIP and PFR together are the X-ray: solid 6-max regs sit around 21–26 VPIP with a small gap to PFR; a big gap betrays passive calling.',
        'AF 2–3 is healthy; a 3-bet% below 4 means premiums-only, above 11 means light – but all stats need adequate samples (3-bet% only from several hundred hands).',
        'Live, observation replaces the HUD: reconstruct showdowns, count hands played per orbit, read sizing patterns and context signals.',
        'Without individual reads, the low-stakes population default applies: lots of value, few bluffs, respect big aggression.',
      ],
      quiz: [
        {
          question: 'An opponent runs 45/8 with a low AF over 400 hands. Which type, and which exploit?',
          options: [
            'LAG – play tighter and upgrade your bluff-catchers',
            'Calling station – value bet thin and big, practically never bluff',
            'Nit – steal blinds and fold to aggression',
            'TAG – hold your own solidly and attack capped spots',
          ],
          correctIndex: 1,
          explanation:
            'Playing 45% of hands with only 8% raises and little postflop aggression is the profile of the loose-passive caller. Thin value bets earn the maximum against him – and bluffs lose, because he doesn\'t fold.',
        },
        {
          question: 'What does a big gap between VPIP and PFR (e.g. 35/10) reveal?',
          options: [
            'The player 3-bets too much',
            'The player plays many hands passively as calls instead of with initiative – a classic sign of weakness',
            'The player is especially tricky and balanced',
            'The player folds too often preflop',
          ],
          correctIndex: 1,
          explanation:
            'The difference VPIP minus PFR is the share of hands played passively. A big gap means wide, weak calling ranges without initiative – which you isolate with value raises and value bet thinly against.',
        },
        {
          question: 'A player with a 3-bet% of 3 (over a large sample) 3-bets your cutoff open. You hold AQo. Best response?',
          options: [
            'Fold – his 3-bet range is almost exclusively premiums that dominate AQo',
            '4-bet as a bluff to apply pressure',
            'Call and stack off on any ace-high flop',
            'Call, because AQo is ahead of any 3-bet range',
          ],
          correctIndex: 0,
          explanation:
            'A 3-bet% of 3 effectively means QQ+/AK. Against that, AQo is massively dominated (AK) or far behind (QQ+), and 4-bet bluffs don\'t work against a premium range. The disciplined fold is clearly the most profitable play.',
        },
        {
          question: 'How do you estimate an opponent\'s VPIP live without software?',
          options: [
            'By the size of his buy-in',
            'By counting how many hands he voluntarily plays per orbit',
            'By his seat at the table',
            'You can\'t – VPIP can\'t be estimated without a HUD',
          ],
          correctIndex: 1,
          explanation:
            'An orbit at a full table is nine hands: someone who plays three or four of them sits roughly at VPIP 35–45. Two or three orbits of focused observation deliver the same core read as a HUD.',
        },
        {
          question: 'Why should you NOT interpret a 3-bet% of 15 after only 40 hands as a "light 3-bettor"?',
          options: [
            'Because 15% is a normal 3-bet frequency',
            'Because only a few 3-bet opportunities occur in 40 hands – the stat is almost pure noise and needs several hundred hands',
            'Because 3-bet% is only meaningful live',
            'Because 3-bets can\'t be exploited',
          ],
          correctIndex: 1,
          explanation:
            'A 3-bet situation arises in only a fraction of all hands; after 40 hands, the number rests on a handful of opportunities. Frequency stats like 3-bet% only become reliable from about 300–500 hands – before that, one shown-down hand carries more weight.',
        },
      ],
    },
  ],
};

export default m5;
