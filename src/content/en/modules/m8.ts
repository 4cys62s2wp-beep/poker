import type { Module } from '../../types';

const m8: Module = {
  id: 'm8',
  title: 'Online Poker',
  subtitle: 'Software, multi-tabling, and the digital edge',
  icon: '💻',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm8-l1',
      title: 'Getting Started Online',
      duration: 9,
      intro:
        'Online poker offers you more hands, more choice, and better learning tools than any live casino. This lesson shows you how to start responsibly, small, and with realistic expectations.',
      sections: [
        {
          heading: 'Play Only on Reputable, Licensed Sites',
          body:
            'Before strategy comes the most important decision: **where** you play. Play exclusively on licensed sites. In Germany, the **GGL** (Gemeinsame Glücksspielbehörde der Länder, the joint gambling authority of the federal states) is in charge – it maintains a public list of approved operators (a whitelist). An operator with a German license must meet player protection standards: age verification (**18+**, no exceptions), connection to the **OASIS** self-exclusion system, deposit limits, and certified random number generators.\n\nWhy does this matter so much? On unregulated sites you carry risks that have nothing to do with poker: delayed or refused withdrawals, unclear handling of your data, and nobody to turn to in a dispute. Your skill at the table is worthless if your balance isn’t safe.\n\nCheck before registering:\n\n- **License**: Is the operator on the GGL’s official whitelist (or does it hold a reputable EU license, if you play outside Germany)?\n- **Withdrawals**: Are there transparent, documented withdrawal methods?\n- **Limits and self-protection**: Can you set your own deposit and loss limits?\n\nSet a deposit limit that fits your bankroll right when you sign up – not once you need it.',
          tip: 'Treat your poker account like a separate hobby budget: only deposit money you can comfortably afford to lose. Poker is a skill game with high variance – not an income and not an investment.',
        },
        {
          heading: 'Start at the Micro Stakes',
          body:
            'Even if you already have live experience: start online at the smallest stakes, the **micro stakes** (e.g., NL2 or NL5 – the number stands for the maximum buy-in in cents or euros, and the standard buy-in is 100 big blinds).\n\nThere are three reasons for this:\n\n- **Minimize the cost of learning**: Your first thousands of online hands are full of adjustment mistakes – new software, new pace, new opponent types. Those mistakes should cost cents, not euros.\n- **Automate the mechanics**: Buttons, bet slider, time bank, and lobby need to become second nature before real money is on the line.\n- **An honest benchmark**: A tracker (more on that later) shows you after a decent sample whether you are actually beating your stakes. Only then does moving up make sense.\n\nMoving up follows your bankroll, not your ego: with a conservative rule like **at least 25–40 buy-ins** for your current stakes, you are protected against normal downswings. If you clearly beat NL2 over a proper sample and have the bankroll for NL5, you move up – and if a bigger downswing hits, you move back down a level with discipline. This up and down is normal, not a step backwards.',
          example:
            'You deposit €50 and play NL2 (buy-in €2). That is 25 buy-ins – enough cushion for normal swings. Only once your bankroll has grown through winnings to about €125–200 is NL5 next.',
        },
        {
          heading: 'Cash Game, Sit & Go, or MTT?',
          body:
            'Online you can choose between three basic formats – and they differ greatly in time commitment, variance, and the skills they train:\n\n- **Cash game**: You can join and leave at any time, the blinds stay constant, stacks are usually around 100bb. Ideal for learning fundamental postflop strategy – and the default format of this app.\n- **Sit & Go (SNG)**: A single-table tournament that starts as soon as enough players are seated. Fixed duration (often 30–60 minutes), predictable, trains push/fold and short-stack play.\n- **MTT (multi-table tournament)**: Many tables, one winner. Big prizes are possible but rare – the variance is enormous, and a deep run can take many hours.\n\nFor starting out, a clear focus on **one** format is recommended. If you play everything at once, you learn everything only halfway. Cash games are the best teacher for postflop poker, because you play almost every hand at a relevant stack depth and mistakes become visible immediately.',
          table: {
            headers: ['Format', 'Time commitment', 'Variance', 'Primarily trains'],
            rows: [
              ['Cash game', 'Flexible, leave anytime', 'Moderate', 'Postflop play, deep stacks'],
              ['Sit & Go', 'Predictable, 30–60 min.', 'Medium', 'Push/fold, short stacks, ICM basics'],
              ['MTT', 'Unpredictable, often several hours', 'Very high', 'Adapting to stack sizes, late stages'],
            ],
          },
        },
        {
          heading: 'Table Selection: The Underrated Skill',
          body:
            'Online, dozens of tables often run at the same stakes – and they are not equally profitable. **Table selection** (deliberately choosing your tables) is one of the most underrated edges there is: your profit does not come from playing well, but from playing **better than your opponents**. Applying the same skill at a softer table raises your win rate without a single new piece of strategy.\n\nWhat to look for in the lobby (where the operator shows the data):\n\n- **Players per flop** (e.g., "Plrs/Flop"): High values suggest lots of loose players.\n- **Average pot**: Large at loose-passive tables with many callers.\n- **Observe at the table**: Limpers, min-bets, odd stack sizes, and showdowns with weak hands are good signs.\n\nJust as important is **seat selection**: you want the weakest, loosest players to your **right** wherever possible, so you have position on them in most hands. And be ruthless about leaving: when the weak players go and only regulars remain (**regs** – frequent, usually solid players), change tables. Sentimentality costs win rate.',
          tip: 'Make table selection a fixed routine: every 15–20 minutes, briefly check whether your table is still good and whether the lobby offers a better one. Two minutes of effort, a measurable effect.',
        },
        {
          heading: 'Realistic Expectations',
          body:
            'A responsible start includes honest expectation management. Even good players at the micro stakes achieve win rates of just a few big blinds per 100 hands – in absolute terms, that is a few euros per evening at NL2, on good days. For the foreseeable future, online poker is **not an income**, but a demanding strategy hobby where skill pays off in the long run.\n\nThree truths you should accept from the start:\n\n- **Variance dominates in the short term**: Even with a clear skill edge, break-even or losing stretches over tens of thousands of hands are normal. Individual sessions say almost nothing.\n- **Progress happens away from the table**: If you only play, you stagnate. Review, theory, and honest mistake analysis make the difference (Lesson 6).\n- **Discipline beats talent**: Consistently applying bankroll rules, stop-losses, and game selection is worth more than any single fancy play.\n\nAnd once more, in all clarity: only play with money you can spare, set yourself limits, and take breaks. If poker no longer feels like a hobby but like a compulsion, use your operator’s self-protection tools or support services such as the counseling offered by Germany’s Federal Centre for Health Education (BZgA).',
        },
      ],
      takeaways: [
        'Play only on licensed sites (in Germany: the GGL whitelist, 18+) and set deposit limits from the start.',
        'Start at the micro stakes with at least 25–40 buy-ins of bankroll and only move up after proven success.',
        'Focus on one format – cash games are the best teacher for postflop strategy.',
        'Table selection and seat selection (weak players to your right) raise your win rate without any new strategy work.',
        'Expect small profits, big swings, and slow progress – poker is a strategy hobby, not an income.',
      ],
      quiz: [
        {
          question: 'Why should you check the GGL whitelist in Germany before registering with a poker site?',
          options: [
            'Because it lists the operators with the biggest bonuses',
            'Because only listed operators meet the German player protection requirements and may operate legally',
            'Because the whitelist shows the operators with the weakest opponents',
            'Because unlicensed operators fundamentally deal rigged cards',
          ],
          correctIndex: 1,
          explanation:
            'The GGL whitelist shows which operators are approved in Germany – with age verification, OASIS connection, limits, and certified software. It says nothing about bonuses or opponent strength, and blanket rigging accusations are not a factual argument.',
        },
        {
          question: 'You have a €60 bankroll and want to play cash games by the conservative buy-in rule. Which stakes fit?',
          options: [
            'NL10 (buy-in €10), to move up faster',
            'NL5 (buy-in €5), that’s still 12 buy-ins',
            'NL2 (buy-in €2), that’s 30 buy-ins',
            'The highest stakes where weak opponents are seated',
          ],
          correctIndex: 2,
          explanation:
            'With 25–40 buy-ins for your current stakes, you are protected against normal downswings. €60 gives you exactly that cushion at NL2 – NL5 or NL10 would be clearly underfunded.',
        },
        {
          question: 'What is the core of table selection?',
          options: [
            'Always pick the table with the biggest average pot, no matter who is seated there',
            'Deliberately choosing tables and seats where your skill edge over your opponents is greatest',
            'Seeking out tables full of regulars to learn from them',
            'Changing tables as often as possible so nobody gets reads on you',
          ],
          correctIndex: 1,
          explanation:
            'Your profit comes from the skill gap between you and your opponents. A big average pot is only a clue – what matters is that weak players are seated at the table, ideally to your right.',
        },
        {
          question: 'Why are cash games usually better suited than MTTs for starting to learn?',
          options: [
            'Because you cannot lose in cash games',
            'Because cash game results are not subject to variance',
            'Because MTTs are forbidden while you are a beginner',
            'Because you play almost every hand at a relevant stack depth and train postflop fundamentals – at more moderate variance',
          ],
          correctIndex: 3,
          explanation:
            'In cash games, blinds and stack depth stay constant, you constantly train postflop play, and the variance is much lower than in MTTs, where big prizes are rare and a run can take hours. You can of course lose in any format.',
        },
        {
          question: 'Which expectation about starting online is realistic?',
          options: [
            'Even with a skill edge, longer break-even stretches over thousands of hands are normal',
            'If you master the theory, you win practically every session',
            'At the micro stakes, discipline quickly builds a side income',
            'After 1,000 hands you know for sure whether you are a winner',
          ],
          correctIndex: 0,
          explanation:
            'In the short term, variance dominates: even good players go through long break-even or losing stretches. 1,000 hands is a tiny sample, session guarantees do not exist, and micro-stakes profits remain small in absolute terms.',
        },
      ],
    },
    {
      id: 'm8-l2',
      title: 'Understanding Online Dynamics',
      duration: 8,
      intro:
        'Online poker is not simply live poker on a screen: the pace, the opponents, and the cost structure follow their own laws. If you understand these dynamics, you adjust your strategy and your expectations correctly.',
      sections: [
        {
          heading: 'More Hands: Faster Learning, Faster Swings',
          body:
            'The biggest difference from live poker is **volume**. Live, you play about 25–30 hands per hour. Online, a single 6-max table deals around 70–90 hands per hour – and with multiple tables that multiplies. One online evening can contain as many hands as an entire live week.\n\nThis cuts both ways:\n\n- **Faster learning**: You see rare situations (set over set, 3-bet pots, river bluff spots) far more often and accumulate in months the experience live players need years for. With a tracker, every hand becomes analyzable, too.\n- **Faster swings**: Variance is measured in hands, not in hours. A 30,000-hand downswing is a year of suffering live – online, maybe three weeks. The swings therefore feel more violent, even though they are identical per hand.\n\nPractically, this means: your bankroll rules and your mental stability get tested faster and harder online. At the same time, you also get reliable data much sooner on whether you are actually winning. Together, this makes online poker the most efficient training environment there is – provided you can withstand the swings financially and emotionally.',
          tip: 'Never judge yourself by sessions but by samples: only from several tens of thousands of hands does your win rate say anything reliable. Everything below that is mostly noise.',
        },
        {
          heading: 'The Field Is Tougher Than Live',
          body:
            'If you come from live poker, online is often a reality check: at comparable blinds, the opponents are **significantly stronger**. A €1/€2 live table often plays softer than online stakes that nominally cost only a fraction of that.\n\nThe reasons:\n\n- **Selection**: Online regs play tens of thousands of hands per month, use trackers and study tools, and some make a living from the game. Recreational players are spread across many tables and formats.\n- **Low barriers to entry for pros**: Players who can beat €2/€5 live often sit at online stakes that would be the next step up for players climbing out of the micros.\n- **Tools**: Statistics, databases, and solver knowledge (Lesson 6) are standard among ambitious players online.\n\nWhat follows? First: take the stakes ladder seriously – "NL10 is just pocket change" is the wrong lens; measured by opponent strength, it is honest poker. Second: at every level, your edge comes mainly from the weaker players at the table, not from outwitting regs. Game selection therefore remains your best friend online too. Third: see the strong competition as a feature – nowhere else do you get more honest feedback about your true level.',
        },
        {
          heading: 'Fast-Fold: Zoom, Snap & Co.',
          body:
            'Many operators offer **fast-fold formats** (called Zoom, fastforward, Snap, or similar depending on the site): you do not play at a fixed table but in a player pool. As soon as you fold, you are instantly seated in a new hand with new opponents. That way, a single "table" gets you over 200 hands per hour.\n\nThis changes the strategy noticeably:\n\n- **The pool plays tighter**: Because everyone can throw away weak hands for free and instantly move on, a lot of boredom-driven loose play disappears. Aggression – especially 3-bets and big turn/river bets – is more honest on average. Tend to give big bets more credit.\n- **Barely any reads, no image**: You only see the same opponents sporadically. Your table image practically does not exist – bluffs that rely on your tight reputation work worse. Play closer to a solid standard strategy and base adjustments on pool tendencies rather than individual reads.\n- **The autopilot temptation**: The high pace seduces you into mechanical clicking. That is exactly when standard mistakes creep in.\n\nFast-fold is excellent for putting in volume and training preflop discipline – but a weaker environment for exploits that rely on observing individual opponents.',
          example:
            'You open A♦ J♣ from the button in the fast-fold pool and the big blind 3-bets. At a normal table, you might know this player 3-bets light. In the pool, that read is missing – and pool 3-bets are value-heavy on average. A disciplined fold or call instead of a light 4-bet is usually the better choice here.',
          cards: ['Ad', 'Jc'],
        },
        {
          heading: 'Rake and Rakeback: The Invisible Cost Structure',
          body:
            'The operator earns through the **rake**: a small percentage of every pot (usually around 3–5% in cash games, capped by a **cap**, a maximum amount per pot). That sounds harmless but adds up enormously – especially at the micro stakes, where the cap is high relative to the blinds. There, the total rake paid can reach double-digit bb/100 – more than good players achieve in win rate.\n\nTwo consequences:\n\n- **Rake changes strategy**: The higher the rake, the more valuable tight, simple play becomes. Marginal calls and small pots that often end at showdown lose value, because the operator takes a cut everywhere. Preflop aggression (winning pots before rake is due – many sites take no rake without a flop, "no flop, no drop") gains value.\n- **Claw back rakeback**: Many operators return part of the rake through loyalty programs, missions, or direct repayments (**rakeback**). For high-volume players, that is worth several bb/100 – with slim win rates, the difference between profit and loss.\n\nSo never compare operators by player pool alone, but always by the package of rake structure, cap, and rakeback. A nominally softer pool can be less profitable due to brutal rake than a tougher pool with a fair cost structure.',
        },
      ],
      takeaways: [
        'Online you play roughly three to four times as many hands per table as live – you learn faster, but you also experience downswings in weeks instead of years.',
        'At comparable blinds, online opponents are significantly stronger on average than live – take even small stakes seriously.',
        'In fast-fold pools the rule is: tighter and more honest – give big bets more credit and rely on pool tendencies instead of individual reads.',
        'Rake is a massive cost factor at the micro stakes; rakeback and the rake structure belong in every choice of operator.',
        'Judge your game over large samples, not over individual sessions.',
      ],
      quiz: [
        {
          question: 'Why do downswings often feel more brutal online than live, even though the variance per hand is the same?',
          options: [
            'Because online software amplifies losing streaks',
            'Because more hands are played per unit of time online, so a downswing of the same length (in hands) happens in much less time',
            'Because opponents get luckier online',
            'Because the rake influences the cards',
          ],
          correctIndex: 1,
          explanation:
            'Variance is measured in hands. A 30,000-hand downswing is a year live, a few weeks online – the same swing, compressed into a short time. Software and rake have no influence on the card distribution.',
        },
        {
          question: 'A solid live €1/€2 player moves online to NL200 (€1/€2 blinds). What is the most realistic expectation?',
          options: [
            'Roughly the same opponent strength, since the blinds are identical',
            'Weaker opponents, because there are more recreational players online',
            'Significantly stronger opponents than live – starting at much smaller online stakes would be wiser',
            'Opponent strength doesn’t matter as long as the strategy is right',
          ],
          correctIndex: 2,
          explanation:
            'Online fields are clearly stronger at the same blinds: regs with huge volume, trackers, and study routines dominate the mid stakes. The blinds say nothing about opponent strength – and opponent strength is exactly what determines your win rate.',
        },
        {
          question: 'Which adjustment is typically correct in fast-fold formats (e.g., Zoom)?',
          options: [
            'Bluff more, because opponents have no reads on you',
            'Give big bets and 3-bets more credit, because the pool plays tighter and more honestly',
            'Play looser, because you get rid of opponents quickly',
            'Drop preflop discipline, because pace is what counts',
          ],
          correctIndex: 1,
          explanation:
            'Because everyone can instantly fold weak hands and move on, the fast-fold pool is tighter on average and aggression is more value-heavy. Bluffs that build on your image, by contrast, work worse – there simply is no image.',
        },
        {
          question: 'What does the rake cap mean?',
          options: [
            'The maximum number of hands on which rake is due',
            'The minimum amount the operator keeps from each pot',
            'The percentage the operator takes from every buy-in',
            'The maximum amount the operator keeps from each pot as rake',
          ],
          correctIndex: 3,
          explanation:
            'The rake is a percentage of the pot, but capped per pot by the cap. Important: relative to the blinds, the cap is often high at the micro stakes, which makes the effective rake especially expensive there.',
        },
        {
          question: 'Why can rakeback be decisive for a high-volume player?',
          options: [
            'Because returned rake can amount to several bb/100 – with slim win rates, the difference between plus and minus',
            'Because rakeback eliminates variance',
            'Because operators with rakeback guarantee weaker opponents',
            'Because rakeback raises the rake cap',
          ],
          correctIndex: 0,
          explanation:
            'At small stakes, the rake eats a large part of the achievable win rate. Getting a portion of it back through loyalty programs directly improves your results – rakeback changes nothing about variance or opponent strength.',
        },
      ],
    },
    {
      id: 'm8-l3',
      title: 'Multi-Tabling',
      duration: 8,
      intro:
        'Playing several tables at once is online poker’s great efficiency lever – and one of the most common causes of stagnating win rates. This lesson shows you when and how to scale sensibly.',
      sections: [
        {
          heading: 'One Table First, Then Scale',
          body:
            'Multi-tabling multiplies your volume – but it also multiplies your mistakes. Hence one clear precondition: only add a second table once a single table runs **profitably and largely on autopilot**.\n\nConcretely, you should meet three criteria:\n\n- **Proven profitability**: Your tracker shows over a decent sample (on the order of several tens of thousands of hands) that you beat your stakes – not just the feeling after a few good evenings.\n- **Automated standards**: Preflop ranges, standard c-bets (continuation bets), and clear folds run without conscious thought. You only need deliberate thinking time for genuinely difficult spots.\n- **No time pressure**: You practically never run out of time at one table, and you already use the free time to observe opponents.\n\nThen you scale **step by step**: from one table to two, stabilize for a few sessions, then three – and after each step, honestly check (see the section below) whether quality holds. Jumping from zero to eight tables trains one thing above all: fast, bad poker. Remember: volume amplifies the game you bring – good or bad.',
          tip: 'A good intermediate test: at one table, can you follow your opponents’ ranges and take notes on the side without producing mistakes? Then you have capacity for another table.',
        },
        {
          heading: 'Tiling vs. Stacking',
          body:
            'Two basic layouts have become established for arranging tables on your screen:\n\n- **Tiling**: All tables sit side by side and are visible at the same time. Advantage: you see every action instantly, can observe opponents even when you are not in the hand, and keep the overview. Disadvantage: from about four to six tables the windows get small, and your eyes are constantly jumping.\n- **Stacking**: All tables sit on top of each other; the table where you need to act pops to the foreground. Advantage: full window size, any number of tables, one fixed focal point. Disadvantage: you only see the active table – reads, history, and context of the other hands are largely lost, and you end up merely reacting instead of observing.\n\nIn between there are hybrids (e.g., cascading, or a main grid with a stack for extra tables). For learners, **tiling with few tables** is clearly the better choice: observation is training time. Stacking only pays off once you deliberately go for maximum volume with a well-grooved standard strategy – a legitimate model, but one that trades learning for throughput.',
          example:
            'A typical setup for an ambitious micro grinder: four tables in a 2x2 tiling on one monitor, tracker statistics beside them. Everything visible, no overlapping windows, every opponent showdown gets registered.',
        },
        {
          heading: 'Hotkeys and the Lobby’s Bet Presets',
          body:
            'The more tables, the more valuable every saved second. Almost every poker client offers built-in tools for this, which you should set up **before** multi-tabling:\n\n- **Hotkeys**: Keyboard shortcuts for fold, check/call, bet/raise, and confirming amounts. That is faster and more precise than clicking – especially when several tables demand action at once.\n- **Bet presets**: Predefined sizings such as 2.5bb for the open-raise or 33%, 50%, 66%, and 75% pot for postflop bets, as buttons or shortcuts. That keeps your sizings consistent instead of degenerating into random values under time pressure.\n- **Automatic time bank and auto top-up**: Activate the time cushion, automatically refill your stack to 100bb – two fewer sources of clicks.\n\nOne important boundary: use the **built-in features of your operator**. External automation tools that click or make decisions for you violate the terms of service at practically every operator and can lead to account closure. The distinction is easy to remember: software may take over chores for you – never decisions.',
        },
        {
          heading: 'The Honest Price of Every Extra Table',
          body:
            'Every additional table lowers your attention per hand – and with it your **win rate per table**. That is not failure, it is the arithmetic of attention: less time per decision means more standard mistakes, less observation, and fewer exploits. The decisive question is therefore not "How many tables can I handle?" but: does my **hourly profit** still rise with the last table added?\n\nThe math behind it is simple: hourly profit = win rate (bb/100) times hands played per hour. More tables increase the hands but lower the win rate – somewhere lies your personal sweet spot, and it is different for everyone. The table shows an illustrative example calculation (only your tracker delivers the real numbers): going from one to four tables, the hourly profit rises clearly; on the jump to eight, the win rate collapses so hard that the bottom line is less than with four.\n\nTwo hidden costs honestly belong in the picture: first, with many tables you learn less per hand, because observation time is missing – if you still want to move up, you are paying for volume with development time as well. Second, the mental load rises disproportionately; tilt then hits all tables at once.',
          table: {
            headers: ['Tables', 'Win rate per table (bb/100)', 'Hands/hour total', 'Profit/hour (bb)'],
            rows: [
              ['1', '8', '80', '6.4'],
              ['2', '7', '160', '11.2'],
              ['4', '5', '320', '16.0'],
              ['8', '2', '640', '12.8'],
            ],
          },
          tip: 'Regularly filter your tracker by the number of simultaneous tables and compare the win rates. If your hourly profit no longer rises with the last scaling step, drop a table – your ego is not a metric.',
        },
        {
          heading: 'Focus Rules for Clean Sessions',
          body:
            'Multi-tabling does not forgive divided attention – it divides it enough on its own. A few rules that have proven themselves among disciplined players:\n\n- **No second activity**: No stream, no chat, no phone next to the tables. What looks like harmless distraction costs exactly the residual attention that difficult spots need.\n- **One format per session**: Playing cash and tournaments at the same time forces constant strategy switches (stack depths, push/fold vs. postflop) – a reliable mistake generator.\n- **Be able to drop tables**: At signs of fatigue, tilt, or a particularly tough table, reduce your table count immediately. Scaling down is a strength, not a retreat.\n- **Fixed blocks with breaks**: Play 60–90 minutes with focus, then 10 minutes away from the screen. Concentration is a limited resource, and multi-tabling burns it faster.\n- **Mark difficult hands, don’t brood**: One click on the marking function, and on you go. Analysis belongs in the post-session review (Lesson 6), not between two running tables.\n\nThese rules sound banal – but the difference between a four-table grinder with and without focus discipline is often several bb/100.',
        },
      ],
      takeaways: [
        'Only scale once one table is demonstrably profitable and your standard decisions are automated – then step by step.',
        'Tiling (all tables visible) is better for learning; stacking maximizes volume at the cost of observation and reads.',
        'Set up the lobby’s hotkeys and bet presets – but never use external tools that automate decisions.',
        'Every extra table lowers the win rate per table; what matters is the hourly profit, which you measure per table count in your tracker.',
        'Focus rules (no distractions, one format, breaks, dropping tables) are hard cash when multi-tabling.',
      ],
      quiz: [
        {
          question: 'When is the right time for the second table?',
          options: [
            'As soon as the bankroll covers two buy-ins',
            'When one table runs profitably over a large sample and standard decisions happen without conscious thought',
            'Immediately – more tables automatically mean more profit',
            'Only once you play NL50 or higher',
          ],
          correctIndex: 1,
          explanation:
            'Multi-tabling multiplies your current game – mistakes included. Only proven profitability plus automated standards create the spare capacity that another table demands. Bankroll or stakes are not the criterion for this.',
        },
        {
          question: 'What is the most important drawback of stacking compared to tiling?',
          options: [
            'Stacking only works with two monitors',
            'Stacked tables consume more processing power',
            'You see almost only the active table and lose observation, reads, and hand context from the other tables',
            'Hotkeys are disabled when stacking',
          ],
          correctIndex: 2,
          explanation:
            'With stacking, only the table with pending action pops to the foreground – you react instead of observing. But that observation time is exactly your training and read time, which is why tiling is the better choice for learners.',
        },
        {
          question: 'Your tracker data: 4 tables = 16 bb hourly profit, 6 tables = 13 bb hourly profit. What is the right conclusion?',
          options: [
            'Increase to 8 tables to offset the decline with volume',
            'Stay at 6 tables, because more hands are always better for learning',
            'Ignore the win rate per table – only volume counts',
            'Back to 4 tables – the last scaling step lowers your hourly profit',
          ],
          correctIndex: 3,
          explanation:
            'The hourly profit is what matters. If it falls as you scale up, the declining attention per hand has more than offset the volume advantage – the right response is a step back, not even more tables.',
        },
        {
          question: 'Which use of software is unproblematic when multi-tabling?',
          options: [
            'An external tool that automatically folds weak hands',
            'The built-in hotkeys and bet presets of the operator’s software',
            'A script that autonomously fires 3-bets based on stats',
            'A program that bypasses the time bank and clicks for you',
          ],
          correctIndex: 1,
          explanation:
            'Built-in operator features (hotkeys, sizing buttons, auto top-up) take chores off your hands and are allowed. External tools that make decisions or act automatically violate the terms of service practically everywhere.',
        },
        {
          question: 'In the middle of a four-table session you notice fatigue and the first signs of tilt. What is the best way to handle it?',
          options: [
            'Reduce the table count immediately or end the session',
            'Open a fifth table to drown out the distraction',
            'Keep playing, but only look at premium hands',
            'Put on music and push through – volume comes first',
          ],
          correctIndex: 0,
          explanation:
            'Scaling down is one of the most important multi-tabling skills: fatigue and tilt lower decision quality at all tables simultaneously. Fewer tables or calling it a day limits the damage immediately.',
        },
      ],
    },
    {
      id: 'm8-l4',
      title: 'HUDs, Stats & Tracking',
      duration: 10,
      intro:
        'Tracking software turns your hands into data – about you and your opponents. This lesson explains the most important statistics, their typical value ranges, and why you must know your operator’s rules first.',
      sections: [
        {
          heading: 'What Trackers and HUDs Are',
          body:
            'A **tracker** (well-known programs include PokerTracker, Hold\'em Manager, and Hand2Note) reads along with the hand histories your poker client saves locally and builds a database from them: every hand played, every opponent, every statistic. With it, you can filter and analyze your own game after the session – the true core of the tool.\n\nA **HUD** (heads-up display) is the live component: an overlay that displays statistics right next to each opponent at the table while you play. Instead of relying on your memory ("he raises kind of a lot"), you see numbers: How many hands does he play? How often does he raise preflop? How often does he give up against a c-bet?\n\nTwo things you should frame correctly from the start:\n\n- **Sample beats number**: Every statistic is only as good as the number of hands behind it (its own section below).\n- **The HUD does not replace thinking**: It answers the question "How does this type of opponent typically play?" – translating that into concrete decisions remains your job.\n\nAnd crucially, before you install anything: not every operator allows HUDs – more on that below.',
        },
        {
          heading: 'The Core Stats and Their Typical Ranges',
          body:
            'Six statistics form the foundation of almost every opponent assessment (value ranges refer to 6-max cash games, 100bb):\n\n- **VPIP** (Voluntarily Put Money In Pot): The share of hands in which a player voluntarily invests money (call or raise preflop). The measure of looseness.\n- **PFR** (Preflop Raise): The share of hands with a preflop raise. The measure of preflop aggression.\n- **Gap** (VPIP minus PFR): A small gap means: when he plays, he usually raises. A large gap reveals lots of passive calls and limps – typical of weak players.\n- **3-bet%**: How often someone re-raises against an open-raise. Low values almost always mean strong value hands.\n- **Fold to C-Bet**: How often someone gives up on the flop against a continuation bet. Extreme values in either direction are directly exploitable.\n- **AF** (Aggression Factor): The ratio of aggressive actions (bet/raise) to calls postflop. Shows whether someone tends to bet or to call.\n\nThe table shows rough reference values – the transitions are fluid, and individual stats only form a picture in combination.',
          table: {
            headers: ['Stat', 'Solid reg (6-max)', 'Notably tight/passive', 'Notably loose'],
            rows: [
              ['VPIP', '22–27%', 'below 18%', 'above 35%'],
              ['PFR', '17–22%', 'below 12%', 'above 30%'],
              ['Gap (VPIP−PFR)', '3–6 points', '—', 'above 10 points (passive)'],
              ['3-bet%', '7–10%', 'below 4%', 'above 12%'],
              ['Fold to C-Bet', '40–60%', 'above 65%', 'below 35% (station)'],
              ['AF', '2–4', 'below 1.5', 'above 5'],
            ],
          },
        },
        {
          heading: 'Translating Stats into Decisions',
          body:
            'Numbers are only useful once you translate them into adjustments. Three typical patterns:\n\n- **The nit** (e.g., VPIP 14 / PFR 11 / 3-bet 3%): Plays only strong hands. Consequence: steal his blinds generously – but when he 3-bets or raises the river, your top-pair hand is often beaten. Disciplined folds against nits are one of the easiest sources of money.\n- **The loose-passive** (e.g., VPIP 45 / PFR 8, large gap, AF below 1.5): Calls too much, raises too rarely. Consequence: value bet thinner and bigger, bluff far less – he isn’t folding anyway. When this player type suddenly raises, he almost always has a very strong hand.\n- **The hyper-aggressive reg** (e.g., 3-bet 13%, high c-bet and barrel frequencies): Puts you under constant pressure. Consequence: pick more good bluff catchers, call down more often with solid hands instead of folding, occasionally 4-bet light.\n\nWhat matters is the combination: a VPIP of 30 means something completely different with a fold-to-c-bet of 70% (folds a lot postflop – bet frequently) than with 25% (calling station – never bluff, value bet thin). Always read stats as a profile, never as a single number.',
          example:
            'You hold A♥ Q♠ on the button. A player with VPIP 13 / PFR 10 / 3-bet 2% (over 1,500 hands) 3-bets your open-raise from the small blind. Despite the pretty hand, folding is strong here: his 3-bet range consists almost entirely of QQ+ and AK – against that range, A♥ Q♠ is way behind.',
          cards: ['Ah', 'Qs'],
        },
        {
          heading: 'Sample Size: When Are Stats Reliable?',
          body:
            'The most common HUD mistake is not the wrong number, but the right number on too small a sample. Rules of thumb:\n\n- **VPIP and PFR** stabilize fastest, because every hand delivers a data point. From about 100–200 hands you can see the rough direction (tight or loose); after a few hundred hands the picture becomes reliable.\n- **3-bet%** needs considerably more, because the opportunity to 3-bet only comes up in a fraction of hands: below about 500–1,000 hands, treat the value with caution.\n- **Postflop stats** like fold to c-bet or river aggression are based on even rarer situations – here you often need four-digit hand counts before basing big decisions on them.\n\nThe practical consequence: with a 40-hand sample, a VPIP of 55 at least says "probably loose" – but a fold-to-c-bet of 80% across five opportunities says almost nothing. Many players therefore display the hand count directly in the HUD and only color-code stats once minimum samples are reached.\n\nThe principle: the bigger the deviation from the normal range and the bigger the sample, the stronger the adjustment may be. Small sample plus moderate deviation is usually a case for standard strategy.',
          tip: 'With small samples, use prior knowledge about the pool: an unknown player at the micro stakes with 60% VPIP over 30 hands is very likely genuinely loose – extreme values like that rarely arise by chance.',
        },
        {
          heading: 'Respect the Operator’s Rules – and the Alternatives',
          body:
            'Crucially: **many operators now ban or restrict HUDs and trackers.** Some allow no third-party software at all, some anonymize player names, some permit tracking only your own hands without a live overlay. The rules are in the terms of service – and violating them can mean a warning, account closure, and confiscation of your balance. So find out **before** installing what your operator allows, and stick to it. No informational edge is worth a frozen bankroll.\n\nThe good news: even without a HUD, you can collect reads systematically:\n\n- **Color labels**: Almost every poker client lets you color-code players (e.g., green = weak/loose, red = strong reg, blue = nit). It takes seconds and is worth gold across sessions.\n- **Notes**: Short notes on concrete showdowns ("3-bets A5s from the SB", "overbets river with the nuts") are often more valuable than any statistic, because they document real decisions.\n- **Session review in the tracker**: Where tracking your own hands is allowed, the biggest benefit remains anyway – analyzing your own game after the session. Your biggest leak rarely sits at the other end of the table.',
        },
      ],
      takeaways: [
        'Trackers build a database from your hand histories; HUDs display opponent stats live at the table.',
        'Core stats for 6-max: VPIP 22–27 and PFR 17–22 are solid; a large gap = passive, low 3-bet% = value-heavy.',
        'Always read stats as a profile and mind the sample: VPIP/PFR are usable early, 3-bet% and postflop stats only after hundreds to thousands of hands.',
        'Check your operator’s rules before any installation – HUD violations can cost you your account.',
        'Color labels, notes, and reviewing your own hands are strong alternatives that are allowed almost everywhere.',
      ],
      quiz: [
        {
          question: 'An opponent has VPIP 44 and PFR 7. What does this large gap tell you?',
          options: [
            'He is an aggressive reg who 3-bets a lot',
            'He plays many hands but almost always passively by calling or limping – a classically weak profile',
            'He plays too few hands and should loosen up',
            'The gap is meaningless as long as the AF is unknown',
          ],
          correctIndex: 1,
          explanation:
            'VPIP 44 means: almost every second hand gets played. PFR 7 means: almost never by raising. The 37-point difference reveals masses of passive calls – the profile of a loose-passive, against whom you should value bet thin and rarely bluff.',
        },
        {
          question: 'A tight player (3-bet 2% over 1,500 hands) 3-bets your button open while you hold A♥ Q♠. Why is folding usually correct here?',
          options: [
            'Because against 3-bets you fundamentally only continue with aces',
            'Because AQ offsuit is generally a losing hand',
            'Because at 2% his 3-bet range consists almost entirely of QQ+ and AK, and AQ is clearly behind against it',
            'Because the 1,500-hand sample is too small for a decision',
          ],
          correctIndex: 2,
          explanation:
            'A 3-bet rate of 2% corresponds to practically nothing but the premium hands. Against QQ+/AK, AQ is dominated or far behind. Moreover, 1,500 hands is a decent sample for a preflop stat like 3-bet% – the read is reliable.',
        },
        {
          question: 'Why is a fold-to-c-bet value after 30 hands barely reliable, while a VPIP after 30 hands is at least a rough hint?',
          options: [
            'Because VPIP delivers a data point every hand, while a c-bet situation only occurs in a few of those hands',
            'Because fold to c-bet is only measured in tournaments',
            'Because VPIP is calculated by the operator and fold to c-bet by the tracker',
            'Both values are exactly equally reliable after 30 hands',
          ],
          correctIndex: 0,
          explanation:
            'Reliability depends on the number of opportunities. VPIP collects data with every hand dealt; in 30 hands, a player has faced a c-bet maybe three to five times – mini-samples like that scatter wildly.',
        },
        {
          question: 'You switch to a new operator and want to use your usual HUD. What is the correct first step?',
          options: [
            'Install and test it – if it runs, it’s allowed',
            'Run the HUD covertly as long as nobody asks',
            'Check the terms of service to see whether and in what form trackers/HUDs are allowed – and comply',
            'Ask in a forum and follow the majority opinion',
          ],
          correctIndex: 2,
          explanation:
            'The operator’s terms of service are the only thing that counts. Many sites ban or restrict HUDs; violations can lead to closure and confiscation of funds. That software works technically says nothing about whether it is permitted.',
        },
        {
          question: 'Your operator does not allow HUDs. Which combination best replaces the lost information?',
          options: [
            'Memorizing all opponent names',
            'Color labels for player types, notes on concrete showdowns, and consistent review of your own hands',
            'Only playing fast-fold, where reads don’t matter anyway',
            'Using a hidden third-party HUD',
          ],
          correctIndex: 1,
          explanation:
            'Color labels and notes are allowed almost everywhere, quick to maintain, and document opponents’ real decisions. Reviewing your own hands remains the most valuable part of tracking anyway. Hiding banned software risks your account.',
        },
      ],
    },
    {
      id: 'm8-l5',
      title: 'Timing Tells & Online Reads',
      duration: 8,
      intro:
        'Even without faces, there are tells online: how fast someone clicks, which amounts they choose, and how they manage their stack reveals more than many think. This lesson shows you the most important patterns – and their limits.',
      sections: [
        {
          heading: 'Insta-Actions: The Pre-Clicked Buttons',
          body:
            'Poker software offers checkboxes that let players **pre-select** their action before it is their turn ("Check/Fold", "Call Any", "Check"). This pre-selection creates the most conspicuous class of online tells: actions that happen **instantly**, with zero thinking time.\n\n- **Insta-check**: Often a pre-clicked "Check/Fold" – the player had no interest in the hand before seeing the action. That is an invitation to bet more often. Beware of repetition, though: attentive opponents occasionally use insta-checks with strong hands as a trap.\n- **Insta-call**: The player had already decided to call before your bet came – typical of draws and medium-strength hands that never thought about raising. Very strong hands, by contrast, usually pause briefly to consider whether a raise would be better.\n- **Insta-bet/raise**: Often a preconceived, emotional, or automatic decision; the range runs from frustration bluffs to auto-value. On its own it is not very reliable – it only becomes interesting in combination with the sizing.\n\nThe logic behind all insta-tells is the same: **zero thinking time means no decision between multiple options took place.** What that means concretely depends on the situation – but it rules out certain hand classes, and exactly that is a read.',
          tip: 'Draw conclusions from insta-actions mainly against passive recreational players. Regs know these tells themselves and occasionally plant deliberately false signals.',
        },
        {
          heading: 'The Long Tank – and What Comes After',
          body:
            'The counterpart to the insta-action is the **tank**: an unusually long pause for thought, often deep into the time bank. What matters is less the tank itself than what happens afterwards:\n\n- **Long tank, then check or small bet**: With recreational players, often genuine helplessness with a weak to mediocre hand – someone thought for a long time and then chose the most passive or cheapest option. Against this pattern, you can tend to apply more pressure.\n- **Long tank, then big bet or raise**: Careful. Part of this is Hollywood – the classic "tough decision" meant to disguise strength – and another part is players who were pondering the optimal sizing with a monster. With recreational players at small stakes, the combination of a tank and big river aggression is strong disproportionately often.\n- **A genuine tank followed by a call**: Usually exactly what it looks like – a real borderline decision with a bluff catcher.\n\nTwo caveats always apply: multi-tablers tank constantly because action is happening at another table – their timing is mostly noise. And connection problems or distraction produce the same patterns as strategy. A timing read should therefore never carry a big decision on its own.',
        },
        {
          heading: 'Sizing Tells: Amounts Speak',
          body:
            'More reliable than timing are **sizing tells** – because the sizing is always a conscious choice:\n\n- **Round vs. odd amounts**: Players who use the bet slider or the standard buttons produce typical values (half pot, 2/3 pot). Manually typed amounts (e.g., €1.37 into a €2 pot) reveal that someone thought about that exact number – with recreational players, often an "I want a cheap showdown" or a "please don’t make me pay you off" amount.\n- **Min-raises on the turn and river**: At the micro stakes, one of the most reliable patterns of all: a minimum raise against your bet on late streets comes from recreational players overwhelmingly with very strong hands. The thinking behind it: "I want action, but I don’t want to scare him off." Calling such raises without a strong hand is a widespread leak.\n- **A sudden deviation from their own pattern**: A player who bet 60% pot three times and suddenly chooses 20% or 150% on the river is sending a signal. Small block bets are often thin showdown hands; sudden overbets from passive players are almost always value.\n\nThe golden rule for small stakes: **unusual aggression from passive players is value until proven otherwise.** Recreational players bluff far less often in big, strange sizings than it feels like at the table.',
          example:
            'You value bet top pair with K♠ Q♦ on K♥ 8♣ 3♦ 6♠ 2♣ on the river. A passive recreational player (AF 1.2) who has only called so far min-raises your bet. At the micro stakes, this is almost never a bluff – he usually shows up with two pair or better. A disciplined fold saves a lot of money here in the long run.',
          cards: ['Ks', 'Qd'],
        },
        {
          heading: 'Stack Sizes and Auto-Rebuy as Information',
          body:
            'Even before the first hand is played, an opponent’s stack provides clues:\n\n- **A constant 100bb**: A player who always sits with a full stack and is right back at 100bb after losing pots is using **auto-rebuy** (automatic top-up) – a typical marker of regs and serious players. Calibrate for solid ranges.\n- **Odd stacks** (e.g., 47bb or 23bb): The player lost and did not top up, or bought in for a partial amount. Both often point to a recreational player who is not actively managing his stack. This frequently correlates with more passive, weaker play – but verify it at the table.\n- **Deliberate short stacks** (e.g., exactly the minimum buy-in at every table): This can be an intentional short-stack strategy – these players are not weak; they are playing a narrow, push-oriented scheme. The difference from the "forgotten" odd stack: consistency across tables and sessions.\n\nAdd context information: if the same name sits at many tables simultaneously, it is very likely a reg. Such preliminary assessments are not certainties, but they give you a starting assumption that you update with every showdown – far better than starting every session from zero.',
        },
        {
          heading: 'Reliability: Sizing Beats Timing',
          body:
            'Finally, the most important framing: online tells are **hints, not proof** – and they are not equally strong.\n\nThe hierarchy in practice:\n\n- **Sizing patterns** are the most reliable, because every bet size is an active decision and patterns can be observed across many hands.\n- **Timing** is much weaker: multi-tabling, distraction, connection problems, and deliberate counter-manipulation constantly generate false signals. A timing read is a tiebreaker in close decisions – never the main argument for a hero call or a big bluff.\n- **Stack and context information** delivers starting assumptions about the player type, which you must keep verifying.\n\nTwo principles turn tells into a genuine edge instead of a source of mistakes: First, weight reads by **player type** – with distraction-prone recreational players, timing and sizing tells are honest; with experienced regs, they are potentially staged. Second, combine: when timing, sizing, and the story the hand tells all point in the same direction, you may deviate from the standard line. If only one of the three points one way, stick with solid baseline strategy. A single soft read has never saved anyone a stack – but it has cost plenty of people one.',
          tip: 'Watch your own patterns too: use consistent sizings and deliberately vary your thinking time (the time bank is yours to use). If you insta-call yourself and always tank with monsters, you are giving away the same information you are hunting for in others.',
        },
      ],
      takeaways: [
        'Insta-actions come from pre-clicked buttons: an insta-check signals disinterest, an insta-call usually draws or medium hands with no intention to raise.',
        'Min-raises and unusual aggression from passive players on turn/river are overwhelmingly value at small stakes.',
        'Manually typed, odd amounts and sudden sizing deviations reveal deliberate intent – read them in context.',
        'Auto-rebuy to 100bb points to regs, unreplenished odd stacks often to recreational players; consistent min buy-ins, by contrast, are strategy.',
        'Sizing reads are more reliable than timing reads: timing decides close spots at most, never big ones on its own.',
      ],
      quiz: [
        {
          question: 'Your opponent calls your turn bet with zero thinking time (insta-call). Which hand class does this make least likely?',
          options: [
            'A flush draw',
            'A middle pair',
            'A monster like a set, which would have considered a raise',
            'A weak bluff catcher',
          ],
          correctIndex: 2,
          explanation:
            'An insta-call means: the decision was made before the bet even came – call versus raise was never weighed. Very strong hands typically at least briefly consider raising; draws and medium hands, by contrast, often call pre-decided.',
        },
        {
          question: 'A passive recreational player min-raises your river value bet while you hold top pair. What is the best standard reaction at the micro stakes?',
          options: [
            'Fold – with passive players, this pattern is overwhelmingly a very strong hand',
            '3-bet to punish the obvious bluff',
            'Call, because min-raises are always weak',
            'Call, because you must never fold to river raises',
          ],
          correctIndex: 0,
          explanation:
            'The min-raise on late streets from passive players is one of the most reliable online tells: he wants action with a monster without scaring you off. With a mere top pair, the disciplined fold is clearly the most profitable choice long term.',
        },
        {
          question: 'Why are timing tells fundamentally less reliable online than sizing tells?',
          options: [
            'Because the software randomly delays thinking times',
            'Because timing is noisy from multi-tabling, distraction, and deliberate manipulation, while every sizing represents an active decision',
            'Because sizing tells only work against regs',
            'They are not less reliable – timing is the strongest online read',
          ],
          correctIndex: 1,
          explanation:
            'A tank can be strategy – or another table, a phone call, a bad connection. The bet size, on the other hand, is always chosen by the player himself, and sizing patterns can be verified across many hands. That is why the greater weight belongs on sizing.',
        },
        {
          question: 'A player has been sitting with 41bb for an hour and does not top up after losing pots. What is the most plausible initial assessment?',
          options: [
            'A pro with a deliberate short-stack strategy',
            'A reg whose auto-rebuy is technically broken',
            'A recreational player who is not actively managing his stack – as a starting assumption you verify at the table',
            'Stack sizes fundamentally allow no conclusions',
          ],
          correctIndex: 2,
          explanation:
            'Deliberate short-stack players consistently buy in for the minimum and actively maintain that size. An odd, unreplenished stack, by contrast, points to absent stack management – typical of recreational players. It remains a starting assumption, not a verdict.',
        },
        {
          question: 'Timing (a long tank) suggests weakness, but the sizing (an overbet from a passive player) suggests strength. How do you decide a close river bluff catch?',
          options: [
            'Follow the timing and call – tanks are almost always weak',
            'Flip a coin, since the reads cancel out',
            'Always call, to buy yourself information about the opponent',
            'Follow the sizing and fold – sizing reads carry more weight than timing reads',
          ],
          correctIndex: 3,
          explanation:
            'When signals conflict, the more reliable one wins: the overbet from a passive recreational player is a strong value signal, while the tank may have come from distraction or theatrics. Without additional evidence, the fold is the disciplined choice.',
        },
      ],
    },
    {
      id: 'm8-l6',
      title: 'Study Workflow & Tools',
      duration: 10,
      intro:
        'Among ambitious players, it is not talent that decides but the study workflow: how systematically do you turn played hands into better play? This lesson builds you a complete learning routine – from marking hands to a weekly plan.',
      sections: [
        {
          heading: 'Mark Now, Analyze Later',
          body:
            'The foundation of every study workflow is the separation of **playing time** and **learning time**. During the session, you have exactly one job: make good decisions. Analysis in the middle of a session is doubly harmful – it ties up attention your running tables need, and it happens at the emotionally worst moment, right after the frustration over a hand.\n\nTherefore: **mark instead of brooding.** Every poker client and every tracker offers a one-click function to mark hands. Mark everything that made you hesitate: unclear river decisions, big lost pots, but also hands you won while feeling unsure (those are the most often forgotten – winning does not mean playing well).\n\nAfter the session – or better: the next day with a cool head – you go through the marked hands. Quality beats quantity: analyzing **three hands thoroughly** (assigning ranges, calculating equity, thinking through alternatives, writing down one concrete lesson) beats thirty hands at a skim. Keep a simple leak list while you do it: if a mistake type repeats ("I call rivers too often against passive players"), you have found your next study topic.',
          tip: 'End every review session with one sentence you write down: "Next session, I will pay attention to X." One concrete intention per review changes more than ten vague insights.',
        },
        {
          heading: 'Using an Equity Calculator Properly',
          body:
            'An **equity calculator** (like the trainer in this app) computes how often one hand or range wins against another. It is the most important beginner study tool – if you use it correctly:\n\n- **Hand against range, not hand against hand**: Calculating "my top pair against his set" is results-oriented thinking. The right question is: "My top pair against all hands he plausibly plays here." Assign your opponent an honest range and calculate against that.\n- **Memorize standard matchups**: You should know a few numbers in your sleep, e.g.: a flush draw on the flop hits by the river about 35% of the time, an open-ended straight draw about 31%. An overpair against a smaller pair is around 80% preflop; two overcards against a pair (the classic "coinflip" like A♣ K♦ against 8♠ 8♥) around 45 to 55.\n- **Combine with pot odds**: Equity alone decides nothing. Only the comparison with the price (pot odds) turns it into a decision: 25% equity is a clear call if you only need 15% – and a clear fold if you need 33%.\n\nUse the calculator in your review for every marked hand: estimate first, then calculate. The gap between your estimate and the result is your learning progress – over time you will not need the calculator for standard spots at all.',
          cards: ['Ac', 'Kd', '8s', '8h'],
        },
        {
          heading: 'Solvers: The Basic Idea in Plain Words',
          body:
            'Hardly any tool gets talked about more than **solvers** (GTO software like PioSOLVER or GTO Wizard). The basic idea is simpler than the hype suggests: a solver is given a concrete situation – both players’ ranges, the stack depth, the board, and the allowed bet sizes – and then computes an **equilibrium strategy** (GTO, Game Theory Optimal): a way of playing for both sides in which neither player can improve by deviating. The output is frequencies ("this hand bets 70%, checks 30%") rather than simple yes/no answers.\n\nWhat solvers are good for:\n\n- **Learning principles**: Which boards favor whose range? When are small bets sensible, when big ones? Which hand classes make good bluffs? These patterns generalize to many situations.\n- **Checking your own lines**: Was my river overbet fundamentally defensible or an invention of the moment?\n\nWhat solvers are bad for:\n\n- **Blindly copying against weak opponents**: GTO is the defensive strategy against perfect opponents. Against a player who calls too much, the best answer is not equilibrium but exploitation: more value, fewer bluffs.\n- **Frequency perfectionism**: Whether a hand bets at 70% or 55% is meaningless for your results at the micro stakes.\n\nFor the micro stakes, the rule is: understanding solver **concepts** is worthwhile; memorizing solver **frequencies** is not.',
        },
        {
          heading: 'Combining Learning Resources Sensibly',
          body:
            'The supply of poker knowledge is enormous – the art lies in the selection:\n\n- **Videos and streams**: Training videos in which strong players explain their decisions out loud are the fastest entry into modern thinking. Look for content covering your format and stakes – NL2 plays differently from high stakes. Pure highlight clips are entertainment, not training.\n- **Forums and communities**: Posting and discussing hands forces you to justify decisions – one of the strongest learning effects there is. Read critically: even confident answers can be wrong.\n- **Book classics**: "The Theory of Poker" (David Sklansky) for timeless core concepts, "Applications of No-Limit Hold\'em" (Matthew Janda) and "Modern Poker Theory" (Michael Acevedo) for theory-based no-limit play, "The Mental Game of Poker" (Jared Tendler) for tilt and mindset. Books are slower than videos, but deeper.\n- **Coaching and study groups**: A good coach finds your leaks faster than any self-study – but it only makes sense once your fundamentals and your own database are in place. Cheaper and often almost as effective: a regular study group that swaps hands weekly.\n\nThe most important rule: **active beats passive.** One hour of analyzing and discussing your own hands is worth more than three hours of videos running in the background.',
        },
        {
          heading: 'Your Weekly Study Plan',
          body:
            'Knowledge only becomes skill through routine. A proven ratio for ambitious recreational players is roughly **3:1 to 4:1 between playing time and study time** – if you only play, you repeat your mistakes; if you only study, you lack the practice where theory has to prove itself.\n\nThree principles make a weekly plan effective:\n\n- **Interlocking**: Every session starts with the focus intention from your last review; every review draws on the marked hands from your last session. Playing and studying form a cycle, not separate worlds.\n- **One topic per week**: Work deliberately on your currently biggest leak (e.g., blind defense or river calls) instead of on everything at once. Switch topics only once something has measurably changed in your game.\n- **Small, fixed units**: 30–45 minutes of focused study beat the rare four-hour marathon, because they actually happen.\n\nThe example plan below distributes around eight hours of poker per week – adapt the duration to your life, but keep the structure: session, review, and theory in rotation, plus one deliberately free day as distance from the game.',
          table: {
            headers: ['Day', 'Activity', 'Duration'],
            rows: [
              ['Monday', 'Session (focus intention from last review)', '90 min.'],
              ['Tuesday', 'Review: 3 marked hands + equity calculator', '30 min.'],
              ['Wednesday', 'Session', '90 min.'],
              ['Thursday', 'Theory: video or book chapter on your current leak', '45 min.'],
              ['Friday', 'Session', '90 min.'],
              ['Saturday', 'Review + discuss one hand in the forum/study group', '45 min.'],
              ['Sunday', 'Off – a deliberate break', '—'],
            ],
          },
          tip: 'Schedule study units in your calendar like appointments – "sometime this week" never happens. And keep the day off: distance protects against burnout and is responsible gaming in practice.',
        },
      ],
      takeaways: [
        'Separate playing and learning: only mark hands during the session, analyze afterwards with a cool head.',
        'In your review, calculate hand against range (not against single hands) and always combine equity with pot odds.',
        'Solvers compute equilibrium strategies – learn the concepts behind them instead of copying frequencies; against weak opponents, exploitation beats equilibrium.',
        'Active learning (analyzing and discussing your own hands) clearly beats passive video consumption.',
        'A fixed weekly plan with roughly 3:1 to 4:1 play-to-study time and one day off makes progress plannable.',
      ],
      quiz: [
        {
          question: 'Why should you only mark a debatable hand during the session instead of analyzing it immediately?',
          options: [
            'Because in-session analysis ties up the attention your running tables need and happens at the emotionally worst moment',
            'Because the hand history only becomes available after the session',
            'Because analyzing at the table violates the terms of service',
            'Because marked hands are automatically solved by the tracker',
          ],
          correctIndex: 0,
          explanation:
            'During the session, your job is to make decisions – not to evaluate past ones. Right after a frustrating pot, your analysis is also emotionally distorted. Marking takes one click; the clean analysis follows later with a cool head.',
        },
        {
          question: 'What is the most important principle when working with an equity calculator?',
          options: [
            'Always enter the opponent’s exact hand as soon as the showdown reveals it',
            'Calculate your hand against the opponent’s plausible range and compare the result with the pot odds',
            'Only calculate preflop situations, because postflop is too complex',
            'Equity above 50% always means call, below always fold',
          ],
          correctIndex: 1,
          explanation:
            'Calculating against the one revealed hand is results-oriented thinking – what matters is the entire plausible range. And equity only becomes a decision in comparison with the price: 30% equity can be a clear call or a clear fold depending on the pot odds.',
        },
        {
          question: 'What does a solver compute at its core?',
          options: [
            'Your hand’s probability of winning against a random hand',
            'The most profitable exploitative strategy against the specific opponent at the table',
            'An equilibrium strategy for a defined situation, in which no player can improve by deviating',
            'The probability that your opponent is bluffing',
          ],
          correctIndex: 2,
          explanation:
            'A solver is given ranges, stacks, board, and bet sizes, and finds the GTO equilibrium strategy for that spot in the form of frequencies. It specifically does not compute opponent exploits – for that you would first have to build the opponent’s mistakes in as assumptions.',
        },
        {
          question: 'Your opponent at NL2 calls far too often (calling station). What is the right takeaway from the solver lesson?',
          options: [
            'Play the exact GTO frequencies, because they are unexploitable',
            'Deviate from equilibrium: value bet considerably more and thinner, barely bluff at all',
            'Bluff more, because the solver includes bluffs in every range',
            'Feed the solver higher stakes to get better answers',
          ],
          correctIndex: 1,
          explanation:
            'GTO is the defense against perfect opponents. Against systematic mistakes – here: too many calls – the targeted deviation is more profitable: bluffs lose value, thin value bets gain massively. That is exactly what exploitative play is for.',
        },
        {
          question: 'Which weekly routine best matches the principles of this lesson (with about 8 hours available for poker)?',
          options: [
            'Play 8 hours – nothing replaces practice',
            'Watch 6 hours of training videos, play 2 hours',
            '8 hours on a single day: 4 playing, 4 studying',
            'About 6 hours of play and 2 hours of active study (review, theory, discussing hands), spread across the week, with one day off',
          ],
          correctIndex: 3,
          explanation:
            'A ratio of about 3:1 between playing and active study time, spread across the week with a deliberate break, combines practice, analysis, and recovery. Only playing repeats mistakes, mostly passive video consumption builds little skill, and marathon days are friendly to neither learning nor concentration.',
        },
      ],
    },
  ],
};

export default m8;
