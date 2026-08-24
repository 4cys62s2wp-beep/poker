import type { Module } from '../../types';

const m7: Module = {
  id: 'm7',
  title: 'Live Poker',
  subtitle: 'Tells, etiquette, and strategy at a real table',
  icon: '🎰',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm7-l1',
      title: 'Live vs. Online: The Differences',
      duration: 9,
      intro:
        'Live poker follows the same rules as online poker – and still plays like a different game. Once you understand the differences in pace, player pool, sizings, and variance, you can turn your online skills into a real edge at the physical table.',
      sections: [
        {
          heading: 'Pace: A Fraction of the Hands',
          body:
            'The most fundamental difference is the pace. A live table (usually 8- or 9-handed) deals about **25–30 hands per hour**: the dealer shuffles physically, chips are counted by hand, players take their time. Online, a single 6-max table delivers 75–90 hands per hour, and if you play four tables at once you get over 300 – more than ten times as many.\n\nThis has three practical consequences:\n\n- **Premiums are rare**: Live, you wait an average of roughly four hours for AA or KK. Patience is not a virtue here – it is a core skill.\n- **Every hand matters more**: One big mistake per hour weighs heavier live, because you cannot dilute it with hundreds of clean hands.\n- **Downtime is work time**: The many hands you are not involved in are your most important source of information. If you spend them on your phone, you throw away the biggest live edge there is: observation.\n\nPrepare yourself mentally for a live session to feel slow. Boredom is the most common reason disciplined online players suddenly play far too many hands live.',
          table: {
            headers: ['Environment', 'Hands per hour'],
            rows: [
              ['Live, 8–9 players', 'approx. 25–30'],
              ['Online, 1 table (6-max)', 'approx. 75–90'],
              ['Online, 4 tables', '300+'],
            ],
          },
        },
        {
          heading: 'The Player Pool: Looser and More Passive',
          body:
            'The average live opponent at low and mid stakes is significantly weaker than the average online opponent at comparable blinds. Online, tracking tools, solvers, and training material have raised the level massively; live, by contrast, you find plenty of recreational players who are there for fun, out of curiosity, or for the atmosphere.\n\nTypical patterns in the live pool:\n\n- **Lots of limping**: Whole chains of limpers before the flop are normal – at serious online stakes they are all but extinct.\n- **Too many calls**: Many players call far too wide both preflop and postflop, and fold far too rarely.\n- **Too little aggression**: 3-bets (re-raising a raise) are rare, and when they happen they are usually very strong.\n- **Multiway pots**: Four or five players seeing the flop is the rule rather than the exception at 1/2 or 1/3.\n\nBeware of the reverse conclusion, though: not every live player is weak. Almost every table has one or two solid regulars who, just like you, are waiting for the recreational players. Your first job in every session is to identify both groups.',
          tip: 'In the first half hour, focus above all on showdowns: who shows up with what hand strength after which line? Two or three showdowns tell you more about a player than any outward appearance.',
        },
        {
          heading: 'Preflop: Bigger Sizings Are Normal',
          body:
            'Online, open-raises of 2.2–2.5bb are standard. Live, they would often be a mistake: at typical 1/2 or 1/3 tables, opens of **4–6bb** are common – and still get called by multiple players. The reason is simple: loose players barely react to sizing. Anyone who wants to call will call double just the same.\n\nTwo adjustments follow from this:\n\n- **Size to the table**: If 6bb opens still get three callers, you are giving up value with your good hands by opening 2.5bb. Over limpers, the rule of thumb is: about 4bb plus 1bb per limper.\n- **Expect lower SPRs**: Bigger preflop pots mean a smaller stack-to-pot ratio. At 100bb, after a called 6bb open you land much sooner in spots where top pair can be good enough for your whole stack.\n\nAt the same time, the price of speculation goes up: a call over 6bb with 7♠ 6♠ needs much better implied odds (expected future winnings when you hit) than a call over 2.5bb. Adjust your calling ranges to the actual sizings at the table, not to your online habits.',
          example:
            'At a 1/2 table, three players limp. You hold A♥ Q♥ in the cutoff. Instead of the online-standard 2.5bb, you raise to about 7bb (4bb + 3 limpers). If two limpers call, you play a pot of around 23bb with position and the best hand range – exactly the scenario live win rates are built on.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'The Social Side and the Flow of Information',
          body:
            'Live, there is no HUD (heads-up display with opponent statistics), no hand histories, and no note-taking feature – but in return you get information that does not exist online: body language, table talk, reactions to cards, and the way someone handles their chips. A player who mentions he is "just here for fun" or has to leave for dinner soon is giving away strategically usable information.\n\nYou have to collect and retain that information yourself, though. Actively commit showdowns to memory ("Seat 3 called the river with bottom pair against the flush draw") and assign every opponent a rough profile early.\n\nThe social side has a strategic dimension too: good live games thrive on recreational players feeling comfortable. Be friendly, congratulate players on pots they win, and never make disparaging comments about weak plays – lecturing the fish either drives him away or makes him better. Both cost you money.\n\nAnd finally: live sessions are long, and alcohol is often served at the table. Plan breaks, do not drink alcohol when playing seriously, and set yourself a time and loss limit before the session. That is not an empty phrase – it is part of professional self-management.',
        },
        {
          heading: 'Variance: Same Game, Longer Timeframes',
          body:
            'Variance **per hand** is similar live and online – poker is poker. But because you only play a fraction of the hands live, swings stretch out enormously in real time: a sample of 30,000 hands is doable in a month online; live, that is more than 1,000 table hours – a full year or more for most players.\n\nConcretely, that means:\n\n- **Downswings last months instead of weeks** – not because the game is any less fair, but because the same number of hands simply takes longer.\n- **Individual sessions say almost nothing** about your skill. Live results are measured in bb per hour and need hundreds of hours before they mean anything.\n- **Your bankroll and your mindset** have to be prepared for this: anyone who overhauls their game after ten losing sessions is reacting to noise, not signal.\n\nThe good news: because the live pool is weaker, achievable win rates per 100 hands in good games are higher than online – which dampens the relative swings. There are still no guarantees. Keep honest records from your very first session (date, stakes, hours, result); it is the only way to separate skill from luck in the long run.',
          tip: 'Never judge your live sessions by the result – judge them by the quality of your decisions. A winning session full of mistakes is a bad sign; a losing session full of good decisions is a good one.',
        },
      ],
      takeaways: [
        'Live, you only play about 25–30 hands per hour – patience and observation during the hands you are not involved in are core skills.',
        'The live pool is looser and more passive on average: lots of limping, too many calls, few 3-bets, frequent multiway pots.',
        'Preflop opens of 4–6bb are normal live – adjust your sizings and calling ranges to the table, not to online habits.',
        'Variance per hand is similar, but swings take much longer in real time; evaluate yourself over hours and decisions, not over sessions.',
        'A friendly demeanor and disciplined handling of time, money, and alcohol are part of live strategy.',
      ],
      quiz: [
        {
          question: 'You switch from four online tables to a single live table. Roughly how does your hand volume change?',
          options: [
            'It stays about the same, because live dealing is faster',
            'It roughly halves',
            'It drops to around one tenth or less',
            'It goes up, because more players sit at a live table',
          ],
          correctIndex: 2,
          explanation:
            'Four online tables deliver 300+ hands per hour, a live table about 25–30. Your volume therefore falls to around one tenth – with direct consequences for patience, the cost of mistakes, and how long swings last.',
        },
        {
          question: 'The typical low-stakes live pool calls too much and folds too rarely. What core adjustment follows from that?',
          options: [
            'More big bluffs, because the opponents are inattentive',
            'More and thinner value bets, fewer bluffs',
            'Play tighter and only touch premiums',
            'Smaller preflop raises to shake off the callers',
          ],
          correctIndex: 1,
          explanation:
            'Against players who call too much, value bets earn more and bluffs earn less. The core adjustment: bet for value more often and thinner, and cut big bluffs way down.',
        },
        {
          question: 'Why do downswings often feel more dramatic live than online, even though the game is the same?',
          options: [
            'Live, the variance per hand is much higher',
            'The rake makes live poker unbeatable',
            'Live dealers shuffle worse than the random number generator',
            'The same number of hands takes much longer live, so swings stretch out over months',
          ],
          correctIndex: 3,
          explanation:
            'Variance per hand is comparable. But 30,000 hands take over 1,000 hours live – a downswing that lasts weeks online drags on for months of real time live.',
        },
        {
          question: 'At a lively 1/2 table, three players limp in front of you. You want to raise with a strong hand. What sizing is appropriate as a rule of thumb?',
          options: [
            'About 2.5bb, as is standard online',
            'About 4bb plus 1bb per limper, so around 7bb here',
            'Always all-in, to punish the limpers',
            'Just call, to keep the pot small',
          ],
          correctIndex: 1,
          explanation:
            'Live players barely react to sizing. The rule of thumb of 4bb plus 1bb per limper builds value with strong hands and at least thins the field somewhat – 2.5bb would give up value here.',
        },
        {
          question: 'Online, a HUD gives you opponent statistics. What best replaces that source of information live?',
          options: [
            'Active observation, above all memorizing showdowns',
            'The opponents’ chip stacks – big stacks mean good players',
            'Your gut feeling after the first two hands',
            'Nothing – live, you fundamentally play without reads',
          ],
          correctIndex: 0,
          explanation:
            'Showdowns connect observed lines with actual hands, which makes them the most reliable source of reads. If you use the hands you are not involved in to observe, you build your own HUD in your head.',
        },
      ],
    },
    {
      id: 'm7-l2',
      title: 'Casino Procedures & Etiquette',
      duration: 10,
      intro:
        'Your first casino visit can feel intimidating: unfamiliar procedures, unwritten rules, watchful eyes. In truth, it is all simple once you know the routine. This lesson walks you step by step through the visit and the most important rules at the table.',
      sections: [
        {
          heading: 'Your First Visit: Step by Step',
          body:
            'Here is how a typical cardroom visit works:\n\n- **Entry**: Bring ID (mandatory) and mind the dress code – neat casual clothing is usually enough.\n- **Signing up**: Go to the poker room desk or straight to the **floor** (the supervising staff member who settles disputes and organizes the tables). Simply say: "I’d like to get on the list for 1/2 No-Limit Hold’em."\n- **Waiting list**: If the tables are full, you go on a list and are called by name or shown on a display. Stay within earshot.\n- **Buying in**: You get chips at the cashier (the cage) or, depending on the house, right at the table. Buy-ins typically range between the minimum (often 50bb) and the maximum (often 100–250bb). Buy in for as much as your bankroll and your game plan allow – deep stacks favor the better player.\n- **Taking your seat**: You may post a blind immediately or wait for free until the big blind reaches you. Either is fine; you can use the waiting time to observe.\n\nIf there is anything you do not know: ask the dealer between hands. Nobody expects newcomers to know all the procedures – dealers are happy to help, and asking beats guessing every time.',
          tip: 'Feel free to tell the dealer when you sit down that it’s your first time playing live. It takes the pressure off, and the dealer will be more likely to keep you from making procedural mistakes.',
        },
        {
          heading: 'Rake: The Cost of the Game',
          body:
            'The casino makes its money from poker through the **rake** – a fee taken out of almost every pot. The two common models:\n\n- **Pot rake**: A percentage of the pot (roughly 3–10% depending on the house) up to a maximum amount per hand, the **cap**. Example: 10% up to a maximum of €6. A widespread rule is "no flop, no drop": if the hand ends before the flop, no rake is taken.\n- **Time rake**: At higher stakes, each player instead pays a fixed amount per half hour, regardless of the pots.\n\nWhy this matters strategically: at low stakes, the rake is high relative to the blinds and eats a substantial part of your achievable win rate. Small pots that just barely cross the flop threshold are hit hardest in percentage terms. That is one more argument for a value-oriented style live: you want to win big pots with strong hands, not lots of tiny pots that the cap takes a big bite out of each time.\n\nCheck your casino’s rake structure before the session – it is usually posted at the table or on the website. A difference of a few euros in the cap can, over hundreds of hours, be the difference between a beatable game and a barely beatable one.',
          table: {
            headers: ['Model', 'How it works', 'Where it’s used'],
            rows: [
              ['Pot rake', 'Percentage of the pot up to the cap, often "no flop, no drop"', 'Standard at low stakes'],
              ['Time rake', 'Fixed amount per player per time interval', 'Common at higher stakes'],
            ],
          },
        },
        {
          heading: 'Conduct at the Table: The Ground Rules',
          body:
            'A few rules make the difference between a welcome guest and a nuisance:\n\n- **Act only when it is your turn**. Acting out of turn gives away information and can be binding. Follow the action so you are ready when it reaches you.\n- **Verbal declarations are binding**. If you say "raise," you must raise – even if you change your mind.\n- **Protect your cards**. Place a chip or card protector on your hole cards. The dealer can accidentally sweep up unprotected cards (muck them) – and mucked cards are almost always dead, even in the middle of a big pot.\n- **Keep your chips visible**. Your highest-denomination chips must be at the front and in plain view; opponents always have the right to gauge your approximate stack size. Hiding chips is considered an angle.\n- **One player to a hand**: Never talk about your cards or possible hands while a hand is in progress – not even after you have folded. Comments like "the flush is definitely out there" influence the hand and are off limits.\n- **Phone away while you are in a hand** – in many rooms this is even a formal rule.\n\nNone of this is complicated. If you pay attention and act at a normal pace, you will never stand out in a bad way.',
        },
        {
          heading: 'String Bets and the One-Chip Rule',
          body:
            'Two procedural rules trip up almost every live newcomer at some point:\n\n**String bet**: Chips must go into the pot in **one continuous motion** – or you announce your action first. If you first put out one stack, reach back, and add more ("I call your 20 ... and raise another 50"), that is a string bet: only the first motion counts, and your intended raise becomes a mere call. The rule prevents players from gauging their opponent’s reaction to the first part of the bet.\n\nThe safe method: **declare, then act.** Clearly say "raise to 75," and after that you may push the chips in with as many motions as you like.\n\n**One-chip rule**: If, facing a bet, you toss in a single chip larger than the call amount without saying anything, it counts as a **call** – not a raise. The 100 chip on a 25 bet is just a call without the word "raise." Here too, the verbal declaration protects you.\n\nSo get into the habit from day one of announcing every non-trivial action: "call," "raise to X," "all-in." It is rule-proof, unambiguous for the dealer – and, as a bonus, a building block of a low-tell routine.',
          example:
            'Your opponent bets €25. Without a word, you push forward a single €100 chip. Result: a call of €25, and you get €75 back. Had you said "raise to 100" first, it would have been a raise. Same chips, completely different action – the difference lies entirely in the declaration.',
        },
        {
          heading: 'Tipping and Table Manners',
          body:
            'In the US, tipping the dealer is firmly established: $1–2 per pot won is customary, more for very big pots. In Europe the picture is mixed – in some countries and rooms tipping is common, in others unusual or even forbidden for the staff. The pragmatic solution: watch what the other players do during the first few orbits, or ask the dealer between hands about the house customs. As a winning player you should realistically budget tips as a cost factor, but do not pinch pennies in the wrong place: dealers and service staff shape the atmosphere that good games depend on.\n\nAs for table manners: be the player people like sitting next to. Concretely, that means:\n\n- No lecturing, no mocking of weak plays.\n- No **slowroll**: If you are certain you hold the best hand at showdown, show it immediately – deliberately stalling to make your opponent suffer is considered a serious breach of etiquette.\n- Take losses without drama; outbursts and throwing cards damage your image and can get you ejected.\n\nEtiquette is not an end in itself: a pleasant table keeps recreational players in the game and makes your session both more profitable and more enjoyable.',
        },
        {
          heading: 'Spotting Angle Shooting and Protecting Yourself',
          body:
            '**Angle shooting** refers to actions in the gray area of the rules, designed to deceive opponents without being formal cheating. The most common patterns:\n\n- **Pump fake**: A feinted betting motion to test your reaction, without actually putting chips in.\n- **Ambiguous gestures**: A hand motion that looks like a check but is later reinterpreted as "I never checked."\n- **Hidden big chips**: Concealing high denominations behind small stacks so you underestimate the stack.\n- **False declarations at showdown**: "I have the straight" when there is nothing there – hoping you will throw away (muck) your better hand unshown.\n- **Acting out of turn** to provoke reactions.\n\nHow to protect yourself:\n\n- **At showdown, only what is on the table counts**: "Cards speak" – the tabled cards decide, not the declaration. Never throw your hand away because someone claims something. Table it face up and let the dealer read it.\n- **When in doubt, ask the dealer** before you act ("Is that a check?").\n- **Calling the floor is your right** – it is not drama, it is the normal way to settle disputes. Do not hesitate, even as a newcomer.\n\nMost players are fair. But if you know the patterns, you are armed against the few exceptions.',
          tip: 'Make it a habit to always table your hand face up at showdown whenever you want or have to show it – never just announce it, never muck on demand. This one habit neutralizes the most dangerous angles.',
        },
      ],
      takeaways: [
        'The procedure is simple: sign up with the floor, waiting list, buy chips, sit down – and ask the dealer whenever you are unsure.',
        'Rake is usually a percentage of the pot with a cap ("no flop, no drop"); at low stakes it is a significant cost factor.',
        'Core rules: act only in turn, protect your cards, keep your chips visible, verbal declarations are binding.',
        'You reliably avoid string-bet and one-chip-rule trouble by clearly announcing every action in advance.',
        'Three habits protect you against angle shooting: table your cards face up (cards speak), ask the dealer when in doubt, call the floor if needed.',
      ],
      quiz: [
        {
          question: 'You enter a cardroom for the first time and want to play 1/2 NLH. What is the correct first step?',
          options: [
            'Sit down in the first empty seat you see and put cash on the table',
            'Get on the list for your stakes at the poker room desk or with the floor',
            'Ask the dealer for a seat while a hand is in progress',
            'Play the slot machines until a seat opens up',
          ],
          correctIndex: 1,
          explanation:
            'Seats are assigned via waiting lists managed by the desk or the floor. Simply sitting down does not work, and dealers should not be interrupted with logistics during live hands.',
        },
        {
          question: 'A casino takes "10% rake, €6 cap, no flop no drop." What does that mean?',
          options: [
            'Every player pays €6 per hour of play',
            'From every pot that sees a flop, 10% is taken, but at most €6; if the hand ends preflop, no rake is due',
            'The winner always pays exactly €6 to the casino',
            '10% is withheld from every player’s buy-in',
          ],
          correctIndex: 1,
          explanation:
            'Pot rake is a percentage of the pot up to a per-hand cap. "No flop, no drop" means hands decided preflop are rake-free. Time charges per player are a different model (time rake).',
        },
        {
          question: 'Without saying anything, you first put €20 over the line, reach back, and add another €40. What stands?',
          options: [
            'A raise to €60, because your intention was clear',
            'Your hand is dead',
            'Only the first €20 counts – a string bet is reduced to the first motion',
            'The dealer decides by coin flip',
          ],
          correctIndex: 2,
          explanation:
            'Without a verbal declaration, only the first continuous forward motion counts. Adding more chips is a string bet and gets struck. You are only safe with a prior declaration: "raise to 60."',
        },
        {
          question: 'Your opponent bets €10. Without a word, you toss a €50 chip into the pot. What action have you taken?',
          options: [
            'A raise to €50',
            'A call of €10 – the one-chip rule treats a single chip without a declaration as a call',
            'A fold, because the action is unclear',
            'An all-in',
          ],
          correctIndex: 1,
          explanation:
            'A single oversized chip without a declaration always counts as a call when facing a bet. If you want to raise, you must announce it first. The rule prevents ambiguity and angle attempts.',
        },
        {
          question: 'Why should you cover your hole cards with a chip or card protector?',
          options: [
            'So opponents cannot analyze the card backs',
            'It is pure decoration with no practical function',
            'The dealer can accidentally sweep up unprotected cards – and mucked cards are almost always dead',
            'Because uncovered cards automatically count as a fold',
          ],
          correctIndex: 2,
          explanation:
            'The dealer collects cards routinely, and unprotected hands occasionally end up in the muck. Once swept in, the hand is generally dead – even if it would have won the pot. The chip on top prevents that.',
        },
        {
          question: 'At showdown, your opponent confidently announces "straight" while you hold two pair. What is the correct reaction?',
          options: [
            'Table your cards face up and let the dealer read the hands – cards speak',
            'Muck your hand to save time',
            'Call security immediately',
            'Accept his declaration and push the pot over',
          ],
          correctIndex: 0,
          explanation:
            'Verbal declarations at showdown are worthless – only the tabled cards count ("cards speak"). False declarations are a classic angle to get you to muck the better hand. Always table your hand face up, never fold on command.',
        },
      ],
    },
    {
      id: 'm7-l3',
      title: 'Reading Tells – Systematically',
      duration: 9,
      intro:
        'Tells – unconscious behavioral signals about hand strength – are the most famous part of live poker and, at the same time, the most overrated. This lesson shows you which signals actually have substance, how to gather them systematically, and how much weight they deserve in your decisions.',
      sections: [
        {
          heading: 'Forget Hollywood',
          body:
            'In the movies, a twitching eye betrays the bluff and a cookie crunch betrays the nuts. Reality is less spectacular: usable tells are subtle, player-specific, and never one hundred percent. Players who believe they can read opponents like a book typically make two expensive mistakes:\n\n- **Over-interpretation**: A single observation ("He swallowed!") becomes a confident diagnosis. People swallow, tremble, and look away – for a hundred reasons.\n- **Wrong priorities**: Physical signals overrule betting logic. If range analysis and sizing clearly point to a fold, a supposed nervousness tell does not rescue the call.\n\nThe correct framing: tells are the **tiebreaker in close spots** – not the foundation of your strategy. First comes the normal analysis (range, sizing, board, player type). If the decision is close after that, a solid read may tip the scales. If it is clear, you ignore the tell.\n\nOn top of that: against attentive opponents, signals can also be staged. Conspicuously displayed behavior in particular – demonstrative sighing, exaggerated disinterest – is more often theater than leak. As a rule of thumb: deliberately sent signals often mean the opposite, while unconscious leaks are the valuable ones.',
        },
        {
          heading: 'Baseline: Observe First, Interpret Later',
          body:
            'No tell means anything without a point of comparison. That is why systematic tell reading starts with the **baseline**: a player’s normal behavior when nothing is at stake.\n\nFirst observe each opponent in non-critical moments: How does he sit when he is not in a hand? Does he talk a lot or a little? How quickly does he act in standard situations? How does he handle his chips? Only once you know this background noise does a **deviation** become a signal: the constant talker who goes silent in the middle of a big pot. The fidgety player who suddenly sits perfectly still. It is not the behavior itself that carries the information, but the break in the pattern.\n\nThe most valuable calibration moment is the **showdown**: there you see behavior and the actual hand side by side. Commit it to memory: How did Seat 5 behave while betting his set? What did his one revealed bluff look like? Two or three data points like that turn vague impressions into a reliable player-specific read.\n\nIn practice, that means: the best time to observe is during the hands you are **not** involved in. Deliberately watch one player per orbit instead of vaguely scanning the whole table – and when opponents act, look at the players, not the board: the board is not going anywhere, the reactions are.',
          tip: 'When the flop is dealt, don’t look at the cards – look at the opponents who act before you. Their first reaction to the board is more unfiltered than anything that comes afterward.',
        },
        {
          heading: 'Timing Tells: The Speed of the Decision',
          body:
            'Timing is one of the most reliable sources of signals, because it is hard to control and directly mirrors the decision process:\n\n- **Insta-call**: A call with zero thinking time almost never means a monster – a very strong hand at least briefly considers raising. The lightning-fast call says: "I don’t need to weigh a raise or a fold" – typical of draws and medium-strength hands that want to continue but don’t want a big pot.\n- **Insta-bet**: A bet that comes before the previous action has even fully finished was preplanned. It is often an automatic continuation bet or an impulsive-weak action – less often a carefully planned value bet.\n- **Long thought, then check**: usually genuine weakness or a hand that has given up.\n- **Long thought, then bet or raise**: Careful – especially with recreational players, this is strong more often than weak. Genuine bluffers usually want to get the moment over with quickly; a player pondering the sizing of his value bet needs time. That said, it is also popular as staged theater ("agonize, then raise") – the baseline decides.\n\nImportant: all of these are pool tendencies, not laws of nature. With a specific opponent, his individual pattern outweighs any rule of thumb.',
          example:
            'You c-bet on 9♣ 7♦ 3♠ and your opponent calls before your chips even reach the pot. His insta-call argues against a set (with a set, he would at least consider a raise) and for middle pairs, gutshots, or backdoor hands. On many good turn cards you can keep applying pressure with an improved expectation of success.',
          cards: ['9c', '7d', '3s'],
        },
        {
          heading: 'Hands, Chips, and Voice',
          body:
            'Alongside timing, three areas provide usable signals:\n\n**Chip handling before the action**: If an opponent demonstratively reaches for his chips while you are deliberating, it is often a deterrence attempt – he is signaling readiness to call in order to stop your bet, and is then more likely weak to medium-strength. Conversely, quietly counted-out chips sitting ready and inconspicuous more often signal genuine intent to call or raise.\n\n**Trembling hands**: The classic from the tell literature – and counterintuitive: trembling while betting usually means **strength**, not nerves. It is adrenaline release after hitting a big hand. Bluffers rarely tremble; they tend to over-control themselves and look wooden.\n\n**Talkativeness and going silent**: A player who keeps chatting in a relaxed way in the middle of a big pot, answers fluently, and seems at ease is strong more often than average – genuine relaxation is hard to fake. The opposite – suddenly going silent, a frozen posture, shallow breathing, a fixed stare – clusters around bluffs: the body takes cover to give nothing away, and by doing so gives something away.\n\nAll three categories only work relative to each player’s baseline – a naturally quiet person who stays quiet tells you nothing.',
        },
        {
          heading: 'Bet Sizing: The Biggest Tell of All',
          body:
            'The most reliable "tell" is not a physical one at all: it is **bet sizing**. Recreational players unconsciously size their bets by hand strength, not by strategy – and these patterns are more stable and easier to read than any gesture:\n\n- **Unusually large bets** (overbets, a sudden tripling) from passive players are disproportionately often very strong – "I finally want to get paid" or protection panic with a monster.\n- **Conspicuously small bets** in big pots are often medium-strength hands trying to reach showdown cheaply (blocking bets).\n- **The min-raise from a passive player** on the turn or river is one of the strongest alarm signals in live poker – behind it is almost always a very big hand.\n- **Deviations from a player’s personal pattern** count the most: someone who bet 60% pot for value three times and suddenly bets 130% is telling a new story – find out which one.\n\nSo deliberately arrange your information sources into a hierarchy (see table) and weight them accordingly. Sizing and action patterns are at the top, facial expressions at the very bottom. That is how you systematize reads instead of chasing impressions.',
          table: {
            headers: ['Rank', 'Signal source', 'Reliability'],
            rows: [
              ['1', 'Bet sizing and action patterns', 'high – hard to disguise, directly relevant to strategy'],
              ['2', 'Decision timing', 'medium to high – hard to keep consciously constant'],
              ['3', 'Speech and vocal behavior', 'medium – meaningful mainly as a break from the baseline'],
              ['4', 'Posture, hands, facial expressions', 'low – only with a baseline and never decisive on their own'],
            ],
          },
          tip: 'Keep a mental mini-file on every opponent with exactly two entries: "What sizing does he use with value?" and "What sizing with bluffs or weakness?" Those two answers are worth more than ten observed gestures.',
        },
      ],
      takeaways: [
        'Tells are the tiebreaker in close spots – never a substitute for range, board, and sizing analysis.',
        'No baseline, no read: first learn a player’s normal behavior, then interpret deviations – showdowns are the best calibration moments.',
        'Insta-calls rarely show monsters; they usually mean draws and medium-strength hands, because no raise was ever considered.',
        'Trembling hands usually mean strength; a talkative player suddenly going silent and freezing up points toward bluffs more often than not.',
        'The most reliable source of information is bet sizing – weight signals by the hierarchy: sizing over timing over speech over body language.',
      ],
      quiz: [
        {
          question: 'What role should tells play in your decision process?',
          options: [
            'They are the primary basis for decisions in live poker',
            'They tip the scales in otherwise close spots, but never overrule a clear strategic analysis',
            'They are completely worthless and should be ignored',
            'They replace range analysis once you have watched an opponent for an hour',
          ],
          correctIndex: 1,
          explanation:
            'Tells are supplementary information with limited reliability. First comes the normal analysis of range, sizing, and player type; only if the decision is close after that may a solid read decide.',
        },
        {
          question: 'Why do you need a baseline before interpreting behavior?',
          options: [
            'Because tells only work against beginners',
            'Because the casino mandates baselines',
            'Because it is not the behavior itself that carries information, but the deviation from that player’s normal behavior',
            'Because tells may only be interpreted at showdown',
          ],
          correctIndex: 2,
          explanation:
            'Silence from a quiet player means nothing; silence from a nonstop talker in the middle of a big pot is a signal. Without knowing the background noise, you cannot recognize a deviation.',
        },
        {
          question: 'Your opponent calls your flop bet before your chips have even landed. What is the most likely interpretation?',
          options: [
            'He almost certainly has a set and is slowplaying',
            'He never needed to weigh a raise or a fold – typical of draws and medium-strength hands',
            'He misclicked',
            'Insta-calls fundamentally cannot be interpreted',
          ],
          correctIndex: 1,
          explanation:
            'The insta-call reveals that neither a raise nor a fold was seriously considered. Very strong hands at least briefly think about raising – which is why lightning-fast calls point toward draws and medium-strength made hands.',
        },
        {
          question: 'An opponent puts out a big turn bet and his hands visibly tremble while doing so. The classic interpretation?',
          options: [
            'Nerves because of a bluff – a clear call',
            'He drank too much coffee, the signal is worthless',
            'Usually genuine strength: trembling is the typical adrenaline release after hitting a big hand',
            'He wants to show the trembling, so it is definitely staged',
          ],
          correctIndex: 2,
          explanation:
            'The counterintuitive classic: trembling hands while betting usually accompany big hands. Bluffers tend to over-control themselves and look frozen rather than shaky. As always: check it against the player’s baseline.',
        },
        {
          question: 'Which source of information sits at the top of the reliability hierarchy?',
          options: [
            'Facial expressions and eye movements',
            'Bet sizing and action patterns',
            'Sitting posture',
            'The opponent’s clothing',
          ],
          correctIndex: 1,
          explanation:
            'Sizing patterns are hard to disguise, directly relevant to strategy, and observable across many hands – for example, the passive player’s min-raise as an alarm signal. Body language and facial expressions rank at the very bottom and only count with a baseline.',
        },
      ],
    },
    {
      id: 'm7-l4',
      title: 'Minimizing Your Own Tells',
      duration: 7,
      intro:
        'While you are reading your opponents, they are reading you. The good news: you don’t need a poker face of stone – you just need to be consistent. This lesson builds you a low-tell routine for every situation at the table.',
      sections: [
        {
          heading: 'A Fixed Routine for Every Action',
          body:
            'Tells arise from **variation**: if you act differently with the nuts than with a bluff, you are readable. The solution is not acting talent but standardization – identical procedures for all hands:\n\n- **Same timing**: Build a short, fixed pause into every action – count to five in your head, say, whether the decision is trivial or hard. That eliminates insta-actions (which betray weakness) as well as conspicuous thinking pauses. For genuinely tough decisions you may of course take longer – the base pause ensures that "short" and "long" sit closer together for you.\n- **Same motion**: Always put chips in with the same hand, the same gesture, to the same spot. No forceful splash bets with strong hands, no timid nudging with bluffs.\n- **Same declarations**: Announce actions with the same terse words ("raise, 75") – always in the same tone.\n- **Same posture after the bet**: Pick a neutral position (e.g., hands resting calmly in front of you, eyes on the middle of the table) and adopt it after every bet – after value bets and bluffs alike.\n\nThe benchmark is simple: an observer who sees only your behavior should not be able to tell the difference between your strongest and your weakest hand. Routines achieve that more reliably than any act of willpower in the moment.',
          tip: 'Train the routine where it costs nothing: in tiny pots and standard situations. Once it runs automatically there, it will hold up in a 400bb pot when your pulse is at 140.',
        },
        {
          heading: 'Looking at Your Cards: Once, the Same Way, and Remember',
          body:
            'The moment you look at your hole cards is a classic leak. Three rules seal it:\n\n- **Always look at the same point in time**. Many experienced players wait until the action reaches them: before that, there is simply nothing to give away, and meanwhile you can watch the reactions of the opponents in front of you. What matters is less the chosen moment than its consistency – looking immediately sometimes and late other times creates a pattern.\n- **Look once and remember everything**: ranks **and** suits. The classic leak: three hearts appear on the flop, and you have to check whether your ace is red. Attentive opponents then know: a player who double-checks on a monotone board almost never has the made flush (he would have remembered that) – he is checking for a single card. So memorize both suits on every first look – after a short while it becomes automatic.\n- **No reaction, no chip glance**: After the flop, don’t reflexively look at your chips – the quick glance at your own stack when the board hits you is one of the best-known beginner tells of all. Look at the board, take your short fixed pause, then act.\n\nThese habits cost nothing, work immediately, and last a whole poker lifetime.',
          example:
            'You hold A♠ 7♠ and the turn brings the third spade. Because you memorized both suits at first glance, you bet at your normal rhythm without checking again. Your opponent, who is watching for exactly that double-check, doesn’t get the information – and your flush stays invisible.',
          cards: ['As', '7s'],
        },
        {
          heading: 'When You Get Talked To in a Big Pot',
          body:
            'Sooner or later it happens: you bet your stack on the river, and your opponent starts talking. "Do you have the set?" – "If I call, will you show?" – some just stare at you. This **speech play** has one goal: to provoke a reaction that can be read.\n\nThe most robust defense is a **predetermined, always identical response policy**. The simplest and most widely recommended: friendly silence. A brief smile or a neutral "good luck with the decision" – and then consistently nothing more, in every pot, with every hand. What matters is not what you do, but that it is **always the same**. If you sometimes answer and sometimes stay silent, the deviation itself becomes the tell: talking with value, silence with bluffs (or the reverse) is a pattern good opponents will know after two showdowns.\n\nThe physical side belongs to this too: same posture, calm breathing (consciously keep breathing normally – shallow breathing can be seen and heard), eyes on a fixed point instead of staring contests. Don’t answer even seemingly harmless questions ("Do you want me to call?") – every genuine answer is information, and very few people can lie convincingly under pressure.\n\nIf you enjoy table talk: that’s allowed and even good for the atmosphere – but stop talking the moment you are in a big ongoing hand. Consistently, not depending on your hand.',
        },
        {
          heading: 'Sunglasses, Hoodie, Headphones: A Pragmatic Look',
          body:
            'The equipment question is overrated. A sober assessment:\n\n- **Sunglasses**: Hide gaze direction and pupils – signals that sit at the bottom of the reliability hierarchy anyway. Costs: worse vision of cards and chips in dark rooms, harder social contact (bad for the table atmosphere and thus for game quality), and for some opponents an invitation to avoid you as a serious player. Low benefit, real costs – dispensable for most.\n- **Hoodie and scarf**: Cover the neck and parts of the face (such as a visible pulse). Marginal effect, but cheap and less conspicuous than the glasses. A matter of taste.\n- **Headphones**: Block speech play and help some players concentrate – but you miss table talk, announcements, and valuable verbal information from opponents. If at all, keep one ear free, and take them out as soon as you are in a hand.\n\nThe honest truth: **your exploitable leaks are timing, sizing, and breaks in routine – and no pair of glasses helps against those.** Equipment may serve as a crutch for the nerves of your first sessions; the real foundation is the routines from this lesson. If you act consistently, you are barely readable even with an uncovered face. If you act inconsistently, you give yourself away even behind mirrored lenses.',
          tip: 'Invest the energy you would put into disguises into a single metric: how uniform are your timing and your motions across all hand strengths? That is the entire core of tell avoidance.',
        },
      ],
      takeaways: [
        'Tells arise from variation – the countermeasure is standardization: same timing, same motion, same declaration, same posture for every hand strength.',
        'A fixed short pause before every action eliminates insta-actions and levels out thinking times.',
        'Always look at your cards at the same moment and memorize ranks plus suits immediately – double-checking on monotone boards is a well-known leak.',
        'Against speech play in big pots, an always-identical response policy protects you – usually friendly, consistent silence.',
        'Sunglasses and the like only cover the least reliable signals; discipline in timing, sizing, and routine is the real protection.',
      ],
      quiz: [
        {
          question: 'What is the most effective basic protection against your own timing tells?',
          options: [
            'Always act as fast as possible so you never show thinking time',
            'A fixed short pause before every action, regardless of hand strength',
            'Deliberately think for a long time with strong hands',
            'Randomly vary your timing to create confusion',
          ],
          correctIndex: 1,
          explanation:
            'The constant base pause makes trivial and difficult decisions look more alike from the outside. Always acting fast is itself a pattern and impossible to sustain on hard decisions; deliberate variation is hard to execute consistently.',
        },
        {
          question: 'Why should you memorize the suits as well on your first look at your hole cards?',
          options: [
            'Because the dealer is allowed to quiz you on the suits',
            'Because you would otherwise violate the one-chip rule',
            'So you don’t have to double-check on monotone boards – the double-check reveals that you hold at most one card of the suit',
            'Suits are irrelevant, only the ranks matter',
          ],
          correctIndex: 2,
          explanation:
            'A player who checks his hole cards on a board with three cards of the same suit almost never has the made flush – he would have remembered it. Attentive opponents read the double-check as "at most one matching card."',
        },
        {
          question: 'You bet all-in on the river and your opponent asks: "Will you show if I fold?" What is the best reaction?',
          options: [
            'Answer honestly, to be fair',
            'Answer only when bluffing, to nudge him toward folding',
            'Stare back until he looks away',
            'Show your predetermined standard reaction – for example friendly silence, just like in every other big pot',
          ],
          correctIndex: 3,
          explanation:
            'Consistency is what matters: if you sometimes answer and sometimes stay silent, the deviation itself becomes the tell. A fixed response policy – typically polite silence – gives away zero information regardless of hand strength.',
        },
        {
          question: 'How should sunglasses at the poker table be assessed soberly?',
          options: [
            'Indispensable – without them you are an open book to good opponents',
            'Low benefit, because they only cover the least reliable signals – timing and sizing leaks remain unprotected',
            'Banned in all casinos',
            'Useful, because they automatically improve your bet sizing',
          ],
          correctIndex: 1,
          explanation:
            'Eye signals sit at the very bottom of the reliability hierarchy. The exploitable leaks – timing, motions, sizing patterns – are not covered by any glasses. Routines protect you; equipment is at best a crutch for the beginning.',
        },
        {
          question: 'The flop hits your hand hard. Which behavior would be a classic beginner tell you should avoid?',
          options: [
            'The reflexive quick glance at your own chips',
            'Looking at the board at a normal pace',
            'Your usual fixed pause before acting',
            'Keeping your usual neutral posture',
          ],
          correctIndex: 0,
          explanation:
            'The quick glance at your own stack after hitting signals betting intent and therefore strength – one of the best-known unconscious leaks. The routine instead: look at the board, fixed pause, then act in your usual manner.',
        },
      ],
    },
    {
      id: 'm7-l5',
      title: 'Live Strategy Adjustments',
      duration: 11,
      intro:
        'Online standard strategy is the foundation – but if you carry it unadjusted to a loose, passive live table, you leave a lot of money on the table. This lesson translates the quirks of the live environment into concrete strategic adjustments: value, bluffs, multiway pots, deep stacks, straddles, and game selection.',
      sections: [
        {
          heading: 'More Value Bets – and Thinner Ones',
          body:
            'The most important live adjustment in one sentence: **shift your money-making from bluffs to value bets.** Loose-passive opponents fold too rarely and call too wide – each of those traits makes value betting more profitable.\n\nConcretely, that means:\n\n- **Bet your strong hands relentlessly across three streets.** Slowplaying against players who are going to call anyway is usually pure waste of money.\n- **Value bet thinner.** A bet is "thin value" when it beats only a slim majority of the opponent’s calling range. Against calling stations (players who notoriously call too much), river bets with top pair mediocre kicker or even second pair are often clearly profitable – hands you would tend to check against online regs.\n- **Size up.** Loose callers are barely elastic to sizing: they call 75% pot almost as often as 40%. If the calling probability hardly drops, the bigger bet maximizes your expected value.\n\nThe mental hurdle is real: thin value bets get snap-called regularly, and sometimes you table the worse hand. That is part of the deal – what matters is that the pool of hands calling your bet is mostly worse, not that you win every single confrontation.',
          example:
            'You hold K♦ J♦ on K♠ 8♥ 4♣ 7♦ 2♠ against a calling station who called flop and turn. Online against a reg, the river would often be a check. Here you clearly bet for value, around 60–70% pot: his calling range is packed with worse kings, eights, and stubborn pairs that pay you off.',
          cards: ['Kd', 'Jd'],
        },
        {
          heading: 'Fewer Big Bluffs',
          body:
            'The flip side of the same coin: **big bluffs lose massive value in loose pools.** A bluff is only profitable if the opponent folds often enough – and that is exactly what live recreational players do not do. The triple barrel that has solid fold equity online gets called at 1/2 by an unimpressed station with third pair.\n\nThe conclusion is not bluff abstinence but selection:\n\n- **Bluff the right people**: Against the tight reg who is capable of folding, bluffs still work. Against the station who "just wants to see," pure river bluffs are burning money.\n- **Bluff with equity**: Semi-bluffs with flush or straight draws keep their value because they have two ways to win – a fold now or a hit later. Pure air bluffs with no chance of improvement get cut almost entirely.\n- **Small bluffs with real fold equity stay**: Picking up orphaned limped pots or betting into obvious disinterest costs little and works live too.\n- **You barely bluff multiway**: Every additional player has to fold for the bluff to get through – with three or four opponents, someone almost always holds a hand that will not let go.\n\nThe rule of thumb for loose-passive tables: if you are unsure whether a bet counts as a bluff or as value, and the opponent is a station – check the bluffs, bet the value.',
          tip: 'Before every planned bluff, check a single question: "Which specific better hands does THIS opponent fold?" If you cannot come up with a plausible answer, the bluff does not exist.',
        },
        {
          heading: 'Multiway Pots: Play Nut-Oriented',
          body:
            'Live, you see flops with three, four, or five players far more often. Multiway, the requirements shift fundamentally: **the more players, the stronger the winning hand at the end tends to be** – someone almost always hits something.\n\nThe consequences:\n\n- **Preflop hand selection**: Hands with nut potential gain value – pocket pairs (set mining with excellent implied odds against many payers), suited aces (nut-flush potential), good suited connectors. Dominatable offsuit broadways like KJo or QTo lose value: they make top pair with kicker problems and, in multiway pots, regularly end up paying off better versions of the same pair rather than the other way around.\n- **Careful with non-nut draws**: The small flush draw is dangerous multiway – if it hits, the risk of losing your stack to a higher flush is real (flush over flush is no longer a rarity with five players on the flop).\n- **Play more honestly postflop**: One pair shrinks in value, bluffs are rarely sensible (see above), and strong hands want to bet – for value and for protection against the many draws that are live multiway. Slowplaying a set on a draw-heavy board against four opponents is an invitation to get outdrawn for free.\n\nThe mantra: heads-up, the bolder hand often wins; multiway, the better hand wins. Play hands that can be the better one.',
          example:
            'Five players see the flop. With 6♥ 5♥ you hit your flush draw on A♥ 9♥ 2♣ – but it is the baby flush draw in a field where A♥ X♥ and K♥ X♥ are realistically out there. Instead of maximizing the draw at any price, you play it under control: coming along yes, but no building big pots that practically only a higher flush calls.',
          cards: ['6h', '5h'],
        },
        {
          heading: 'Deep Stacks: 200bb and More',
          body:
            'Online cash games are usually capped at 100bb. Live, stacks grow unchecked over long sessions – effective depths of 200bb, 300bb, or more are normal as soon as two big stacks collide. That changes strategy profoundly:\n\n- **One pair loses value for big pots**: At 100bb, top pair top kicker is often a legitimate stack-off. At 250bb the rule is: when the whole stack goes in the middle, the winners are overwhelmingly two pair plus, sets, straights, flushes. If you cannot demote AA from its overpair throne at 300bb against a tight player, you will pay expensive tuition – **big pots need big hands**.\n- **Implied odds explode**: Speculative hands with nut potential – pocket pairs, suited aces, suited connectors – rise in value, because a hit can win a multiple of the preflop investment.\n- **Position matters even more**: The deeper the stacks, the more streets with big decisions – and the more valuable it is to make them with an information advantage. Play deep spots out of position noticeably more cautiously.\n- **3-bet ranges shift**: Very deep, the value of pure blocker 3-bets drops, and even AKo stack-offs preflop lose their appeal; playable, board-hitting hands gain.\n\nThe simple heuristic for deep live spots: ask yourself early in the hand what hand strength will justify a 250bb pot at the end – and plan backwards whether your hand has that potential.',
        },
        {
          heading: 'Understanding Straddles',
          body:
            'A **straddle** is a voluntary blind bet posted before the deal, classically from the UTG position (the player to the left of the big blind) for **2 big blinds**. The straddler buys the right to act last preflop; the action starts to his left.\n\nThe math is unromantic: as a blind bet made without looking at the cards, the straddle is a losing proposition for the straddler himself – he pays a double blind with no information advantage. Why it exists anyway: it doubles the game and makes it more action-packed; at some tables it is part of the culture, occasionally as a round straddle played by everyone.\n\nWhat matters strategically is the conversion: **the straddle doubles the blinds and thereby halves the effective stack depth.** Treat the straddle as the new big blind: size raises as a multiple of the straddle (e.g., 3–4x), and adjust ranges to the shallower effective depth – raw high-card strength gains, speculative implied-odds hands lose a bit of value. And note the changed preflop order: the straddler closes the action, the blinds act before him.\n\nImportant for self-management: a table that straddles every hand is effectively playing double stakes. Honestly check whether your bankroll supports that game – "1/2 with a straddle" is economically a 2/4 game.',
          table: {
            headers: ['Situation', 'Stack €200', 'Effective depth'],
            rows: [
              ['Blinds 1/2 without straddle', '€200', '100bb'],
              ['Blinds 1/2 with €4 straddle', '€200', '50 units of the straddle'],
            ],
          },
        },
        {
          heading: 'Table and Seat Selection: The Underrated Edge',
          body:
            'No strategic detail adds as much win rate live as choosing the right game. Online you switch tables with a click – live, a single table change often decides the value of the entire evening.\n\n**Table selection** – good signs as you walk by or look around:\n\n- Lots of limpers and multiway flops, high average pots\n- Laughter, drinks, conversation – players who are primarily there to have fun\n- Big, irregular stacks instead of uniform 100bb buy-ins\n\nA quiet table full of focused regs with headphones is the opposite. Ask the floor to put you on the transfer list for better tables – that is standard practice and nobody takes offense.\n\n**Seat selection**: Money at the poker table tends to flow clockwise – you win the most from the players you have position on. Ideally you therefore sit **to the left of the loose, aggressive, and weakest players** (you have position on them and control the pots against them), while tight, predictable players to your left do little damage. If the dream seat opens up, ask the dealer for the seat change.\n\nFinally, the discipline question: stay as long as the game is good **and** you are good. If either factor leaves the room – the fish go home or your concentration fades – the game is over for today. In the long run, this exit discipline separates successful live players from the rest more reliably than any technical knowledge.',
          tip: 'Never rate a table by your current result – rate it by its quality: winning at a bad table is luck, losing at a good one is bad luck. Stick to the good tables and the results will follow.',
        },
      ],
      takeaways: [
        'Against loose-passive pools you earn with value: more value bets, thinner and bigger – slowplay and big bluffs lose massive value.',
        'Bluff selectively: against opponents capable of folding and with equity (semi-bluffs); multiway and against stations, bluffs remain the exception.',
        'In multiway pots, nut potential is what counts: pocket pairs, suited aces, and suited connectors gain value; dominatable offsuit broadways and non-nut draws lose it.',
        'At 200bb+ the rule is: big pots need big hands – one pair is rarely enough for the stack, while implied-odds hands and position gain importance.',
        'A straddle effectively doubles the stakes and halves the effective depth; table and seat selection (to the left of the weakest players) are the biggest single live edge.',
      ],
      quiz: [
        {
          question: 'What is a "thin" value bet, and why is it important against calling stations?',
          options: [
            'A very small bet with the nuts, to induce calls',
            'A bet with a hand that beats only a slim majority of the opponent’s calling range – against wide calling ranges such bets become profitable',
            'A small bluff with a completely worthless hand',
            'A bet you only make in position',
          ],
          correctIndex: 1,
          explanation:
            'Thin value means: the bet wins against the larger share of the hands that call – even if the edge is small. The wider the opponent’s calling range, the more hands qualify; that is why you value bet hands against stations that you check against regs.',
        },
        {
          question: 'Why do big river bluffs work poorly against typical live recreational players?',
          options: [
            'Because bluffing live is against etiquette',
            'Because the rake makes bluffs unprofitable',
            'Because bluffs need fold equity – and loose-passive players simply fold too rarely',
            'Because live you have to show your cards when a bluff gets through',
          ],
          correctIndex: 2,
          explanation:
            'A bluff earns its money through folds. Players who "just want to see" with third pair do not deliver those folds – the bluff becomes a donation. Bluffs remain sensible against fold-capable opponents and as semi-bluffs with equity.',
        },
        {
          question: 'Five players see the flop. Which statement about multiway pots is correct?',
          options: [
            'The winning hand is stronger on average, so the value of nut potential rises and the value of dominatable hands like KJo falls',
            'Bluffs become more profitable because more players can fold',
            'Top pair wins just as often multiway as heads-up',
            'Small flush draws become more valuable multiway because more opponents pay off',
          ],
          correctIndex: 0,
          explanation:
            'With every additional player, the chance rises that someone hits a strong hand. Nut-oriented hands (pocket pairs, suited aces) gain; dominatable broadways and non-nut draws run into better versions of the same hand more often – and bluffs fail because everyone would have to fold.',
        },
        {
          question: 'You are playing 300bb deep against a tight opponent. He raises your turn bet big and you hold an overpair. What guideline applies?',
          options: [
            'Overpairs are a clear stack-off at any stack depth',
            'The deeper the stacks, the stronger a hand must be to play for the whole stack – one pair is rarely enough at 300bb',
            'With deep stacks you should basically call every bet, because the implied odds are so good',
            'Deep stacks change nothing strategically',
          ],
          correctIndex: 1,
          explanation:
            'At 100bb an overpair is often a legitimate stack-off; at 300bb the all-in pot is dominated by two pair plus, sets, and better hands – all the more so against tight opponents. Big pots need big hands: plan early which hand strength justifies the monster pot.',
        },
        {
          question: 'At the 1/2 table, UTG straddles every hand to €4. What does that mean in practice?',
          options: [
            'Nothing – the straddle is just a tip to the pot',
            'The effective stack depth doubles',
            'The straddler gets an extra card',
            'The game effectively becomes double stakes: blinds doubled, effective depth in straddle units halved, and raises are sized off the straddle',
          ],
          correctIndex: 3,
          explanation:
            'The straddle acts like a new, doubled big blind: €200 becomes just 50 straddle units instead of 100bb, sizings key off the straddle, and economically you are playing a 2/4 game – including the bankroll question of whether you want that.',
        },
        {
          question: 'A very loose, aggressive recreational player moves to your table. Which seat relative to him is ideal?',
          options: [
            'Directly to his right, so he has to act after you',
            'Directly to his left, so you have position on him in most hands',
            'As far away as possible, to stay out of his hands',
            'The seat doesn’t matter as long as the table is good',
          ],
          correctIndex: 1,
          explanation:
            'Money tends to flow clockwise: with position on the loose aggressor, you see his actions before your decision, control the pot size, and isolate him more easily. Sitting to his left means profiting from his action to the maximum.',
        },
      ],
    },
  ],
};

export default m7;
