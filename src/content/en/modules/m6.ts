import type { Module } from '../../types';

const m6: Module = {
  id: 'm6',
  title: 'Psychology & Bankroll',
  subtitle: 'Tilt, variance, and the foundation of long-term success',
  icon: '🧘',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm6-l1',
      title: 'Understanding & Controlling Tilt',
      duration: 10,
      intro:
        'The most expensive opponent at the table is often you. This lesson shows you what tilt really is, the forms it takes, and how to get it under control with concrete tools.',
      sections: [
        {
          heading: 'What tilt is – and what it costs you',
          body:
            '**Tilt** is any emotional state that lowers the quality of your decisions. The classic image is the angry player firing off wild bets after losing a pot – but tilt is broader than that: fear, boredom, overconfidence after a big win, or resigned autopilot play are all forms of tilt too.\n\nWhy is it so expensive? Your win rate (usually measured in **bb/100**, big blinds per 100 hands) is the average of your best play (**A-game**) and your worst (**C-game**). Many players lose more in one hour of tilt than they win in several hours of focused play. The margin between winning and losing at poker is small – if you don\'t control your C-game, you give that margin away completely.\n\nThe key insight: tilt is not a character flaw but a normal human reaction to frustration and perceived injustice. Every player tilts – the difference between winners and losers lies in how quickly they notice it and how consistently they respond.',
          tip: 'Don\'t measure success by whether you never tilt, but by how quickly you recognize tilt and end or pause the session. Damage control is the real skill.',
        },
        {
          heading: 'The four most common types of tilt',
          body:
            'Tilt has many faces. Four patterns show up especially often:\n\n- **Injustice tilt**: You lose as a clear favorite (bad beat) and feel it\'s unfair. Typical thought: "He always hits!" The result is frustration and loose calls.\n- **Revenge tilt**: You want to win the pot back from the exact player who "took" it from you, deliberately playing hands against him that you would normally fold.\n- **Entitlement tilt**: You believe you deserve to win – because you folded for a long time, studied hard, or "played well". But poker owes you nothing; this expectation leads to forced bluffs and overplays.\n- **Frustration tilt**: Not one single event but the sum of many small annoyances – card-dead stretches, busted draws, missed value. It builds up slowly and eventually erupts in an unnecessarily big move.\n\nThe distinction matters in practice, because each type has its own early warning signs. If you know which pattern you lean toward, you spot tilt minutes earlier – and here, minutes are real money.',
          table: {
            headers: ['Type of tilt', 'Trigger', 'Typical symptom'],
            rows: [
              ['Injustice', 'Bad beat as the favorite', 'Loose calls, self-pity'],
              ['Revenge', 'Loss against a specific opponent', 'Too many hands against that player'],
              ['Entitlement', 'Feeling you "deserve" to win', 'Forced bluffs, overplays'],
              ['Frustration', 'Many small annoyances in a row', 'Gradually more aggressive, impatient'],
            ],
          },
        },
        {
          heading: 'Identify your personal triggers',
          body:
            'Tilt control starts long before the critical hand: with **self-observation**. Keep a short tilt log for two to three weeks. After every session, jot down two or three sentences: What annoyed me? When did my game start to slip? What did I do differently afterward?\n\nPay attention to three levels:\n\n- **Situations**: bad beats, bluffs that got called, long card-dead stretches, a particular type of opponent.\n- **Body signals**: faster pulse, tense shoulders, shallow breathing, hasty clicking – your body often reports tilt before your mind does.\n- **Game signals**: You call raises you would normally fold, open more hands, compulsively check your stats, or suddenly play faster.\n\nAfter a few weeks you\'ll recognize your pattern. Maybe you\'re surprisingly stable after bad beats but come apart when a weak player pays you off twice and then wins it all back. For exactly these personal triggers, you set up fixed if-then rules: "If X happens, I do Y." Pre-formulated responses like these keep working even when your clear thinking is already compromised.',
          example:
            'You pick up A♠ A♥, play the hand perfectly, and get all the money in as a clear favorite. Your opponent calls with K♦ K♣ – and hits his king on the river. You lose hands like this about one time in five even with perfect play. If you file that away as personal injustice instead of priced-in variance, you\'ve found your most important tilt trigger.',
          cards: ['As', 'Ah', 'Kd', 'Kc'],
        },
        {
          heading: 'In-the-moment remedies: breaks and breathing',
          body:
            'When you notice tilt symptoms, resolutions ("I\'ll just play better now") don\'t help – you need a **physical interruption**:\n\n- **Sit out or stand up**: Online, click "Sit out"; live, step away from the table briefly. Even 3–5 minutes of distance measurably lowers your arousal level. You\'re not missing anything – the games will still be running tomorrow.\n- **Breathing technique**: Inhale through your nose for 4 seconds, exhale slowly for 6 seconds, and repeat for one to two minutes. The extended exhale activates the parasympathetic nervous system and dampens the stress response – a simple, well-documented mechanism.\n- **Park the hand instead of dwelling on it**: Mark the frustrating hand for later review and forbid yourself from analyzing it during the session. At the table, it only turns into a spiral of rumination.\n- **Reality check**: Ask yourself: "Would a pro who can\'t see my cards approve of my last three decisions?" If the honest answer is no, the break is overdue.\n\nThese tools only work if you set them up **before** the session. In the middle of tilt, you\'ll talk yourself into every exception.',
          tip: 'Set up a fixed anchor: get a glass of water after every big pot you lose. The action is trivial – but it forces exactly the interruption your mind needs right then.',
        },
        {
          heading: 'Stop-loss and quitting rules',
          body:
            'The most effective tilt insurance is a set of rules you define **before the session** and follow mechanically – precisely because your judgment is no longer neutral in the decisive moment.\n\n- **Stop-loss**: End the session after a fixed loss, e.g. **3 buy-ins** (in cash games, 1 buy-in = 100bb). Not because the cards get worse afterward, but because after losing 3 buy-ins there\'s a high probability you\'re no longer playing your A-game.\n- **Time limit**: Set your maximum session length in advance (e.g. 90–120 minutes, then a break or quit). Concentration is a limited resource.\n- **Quitting rules**: Define clear signals that mean stopping immediately – you catch yourself making a revenge call, you\'re playing hands that don\'t belong in your ranges, you\'re tired, hungry, or distracted, or you\'re only playing on to "get back to even".\n\nThat last one is the most dangerous thought in poker: chasing losses (**chasing**) turns a normal downswing into a disaster. Ending the session today costs you nothing – the tables will be there again tomorrow, and then you\'ll be back to playing your best game.',
          example:
            'A disciplined player\'s rulebook: "Stop-loss 3 buy-ins. Maximum 2 hours at a stretch. Immediate quit if I can\'t cleanly justify a call or I\'m only playing on to recover losses." On a note next to the monitor – non-negotiable.',
        },
      ],
      takeaways: [
        'Tilt is any emotional state that lowers your decision quality – not just anger.',
        'The four most common forms: injustice, revenge, entitlement, and frustration tilt.',
        'Watch situations, body signals, and game signals to find your personal triggers.',
        'Physical interruption beats willpower: take a break, extend your exhale, mark the hand for later.',
        'Set your stop-loss (e.g. 3 buy-ins), time limit, and fixed quitting rules before the session – not in the middle of it.',
      ],
      quiz: [
        {
          question: 'What best describes the term tilt?',
          options: [
            'Anger after a bad beat',
            'Any emotional state that lowers the quality of your decisions',
            'A stretch of unusually bad cards',
            'Overly aggressive play against weak opponents',
          ],
          correctIndex: 1,
          explanation:
            'Tilt covers more than anger: fear, overconfidence, or resigned autopilot play are also tilt as soon as they degrade your decisions.',
        },
        {
          question:
            'After losing a pot, you deliberately play lots of hands against that exact opponent to win your money back. Which type of tilt is this?',
          options: [
            'Entitlement tilt',
            'Frustration tilt',
            'Revenge tilt',
            'Injustice tilt',
          ],
          correctIndex: 2,
          explanation:
            'Revenge tilt targets a specific player: you make decisions to get even, not because they\'re profitable.',
        },
        {
          question: 'Why should stop-loss rules be set before the session?',
          options: [
            'Because statistically better cards come after big losses',
            'Because your judgment can be impaired while tilting, and only rules defined in advance still hold reliably then',
            'Because the site automatically ends sessions otherwise',
            'Because after a stop-loss you\'re allowed to play higher stakes the next day',
          ],
          correctIndex: 1,
          explanation:
            'On tilt, you talk yourself into exceptions. A mechanical rule set in advance protects you precisely when you can no longer trust yourself. A stop-loss has no influence whatsoever on how the cards are dealt.',
        },
        {
          question:
            '"I\'ve folded with discipline for two hours – this pot is simply owed to me." Which tilt pattern does this thought reveal?',
          options: [
            'Entitlement tilt',
            'Revenge tilt',
            'Injustice tilt',
            'None – the thought is strategically sound',
          ],
          correctIndex: 0,
          explanation:
            'Entitlement tilt is the feeling of having earned a win. But poker doesn\'t reward patience by itself – every hand is decided on its own, and forced moves born of entitlement are expensive.',
        },
        {
          question:
            'Mid-session, you notice tilt symptoms: racing pulse, hasty calls. What is the most effective immediate response?',
          options: [
            'Keep playing with more focus and pull yourself together',
            'Move down to a lower stake and keep playing there',
            'Immediately analyze the frustrating hand in depth',
            'Take a physical break: sit out, stand up, breathe out slowly for a few minutes',
          ],
          correctIndex: 3,
          explanation:
            'Willpower alone rarely works on tilt. A physical interruption with calm, extended exhales lowers your arousal level – you analyze the hand later in review, not at the table.',
        },
      ],
    },
    {
      id: 'm6-l2',
      title: 'Bankroll Management',
      duration: 8,
      intro:
        'Bankroll management (BRM) determines whether you survive the game\'s inevitable swings. It is the one discipline that even the best player cannot replace with talent.',
      sections: [
        {
          heading: 'Why BRM is a matter of survival',
          body:
            'Your **bankroll** is the money set aside exclusively for poker. Bankroll management means choosing your stakes so that normal losing stretches can never ruin you.\n\nThe core of the problem: even a clearly winning player regularly loses several buy-ins in a row – that\'s not an exception, it\'s the mathematical norm (more on this in the next lesson). If you play a stake with 5 buy-ins, good play plus normal bad luck can cost you everything. This is called **risk of ruin**: the probability of going broke despite a positive expectation, because your cushion was too thin.\n\nBRM flips the logic around: instead of asking "How much can I win?", you ask "How much swing can I withstand?". With enough buy-ins, a downswing goes from an existential threat to a statistical footnote – annoying, but harmless.\n\nOn top of that comes a psychological effect that is often underestimated: playing with money whose loss hurts makes you play scared automatically (**scared money**). You fold good hands to pressure, miss thin value bets, and tilt more easily. A comfortable bankroll is therefore not just insurance – it is directly part of your playing strength.',
          tip: 'Scared money is doubly expensive: it costs you EV in every hand and makes you more vulnerable to tilt. If losing one buy-in ruins your evening, you\'re playing too high.',
        },
        {
          heading: 'Guidelines for your bankroll',
          body:
            'How many buy-ins you need depends on the format, because formats swing to different degrees:\n\n- **Cash games**: at least **25–50 buy-ins** (1 buy-in = 100bb). 25 is the absolute floor for recreational players at micro stakes; 50 is the solid standard.\n- **Sit & Gos**: at least **50 buy-ins**. The fixed payout structure creates more swing than cash.\n- **MTTs (multi-table tournaments)**: at least **100 buy-ins**, and considerably more for large fields. The reason: even good tournament players cash in only a minority of their tournaments, and the profit is concentrated in rare deep runs.\n\nThese numbers are minimums, not optimums. The more seriously you play, the more aggressive your style, and the thinner your win rate, the more cushion you need. If you demonstrably play in very beatable games and could easily redeposit, you can sit at the lower end – if you don\'t want to depend on poker or find it hard to reload, aim for the upper end.',
          table: {
            headers: ['Format', 'Minimum recommendation', 'Reason'],
            rows: [
              ['Cash game', '25–50 buy-ins (of 100bb each)', 'Moderate variance'],
              ['Sit & Go', '50+ buy-ins', 'Fixed payout structure, higher variance'],
              ['MTT', '100+ buy-ins', 'Rare big payouts, very high variance'],
            ],
          },
          example:
            'You want to play NL10 (a cash game with a €10 buy-in). By the 50-buy-in rule, you need a poker bankroll of €500 for that. With €250 (25 buy-ins), NL10 is just about defensible – with €100, you belong at NL2 or NL5.',
        },
        {
          heading: 'Move up with a plan, move down without debate',
          body:
            'Stakes are not status symbols – they are a function of your bankroll. Two rules follow from this:\n\n- **Move up conservatively**: Only move up once your bankroll fully supports the new stake (e.g. 40–50 buy-ins of the higher limit) and you have beaten your current stake over a decent sample. A **shot** – an attempt at the higher stake – is fine, but with a fixed budget: around 3–5 buy-ins, and if you lose it, you move back down without a word.\n- **Move down consistently**: If your bankroll falls below the threshold for your current stake, you move down immediately. Not "wait one more session", not "win it back first". That exact hesitation has destroyed more bankrolls than any downswing.\n\nMoving down feels like a defeat – but it isn\'t. It is the mechanism that guarantees you can **always** keep playing. At the lower stake you win back confidence and buy-ins, then move up again cleanly. The player who stubbornly stays up top plays scared money against better opponents – the worst combination there is.',
          example:
            'Your bankroll: €1,000. You play NL10 (100 buy-ins – very comfortable). Your plan: at €1,250 (50 buy-ins for NL25), take a shot at NL25 with a budget of at most 4 buy-ins. If your bankroll drops below €1,150 in the process, it\'s back to NL10 – automatically, no debate.',
        },
        {
          heading: 'Strict separation: bankroll is not personal money',
          body:
            'The most important rule stands above all the numbers: **Your poker bankroll is strictly separated from your personal money – and it consists exclusively of money whose total loss would not change your life.**\n\nConcretely, that means:\n\n- Keep the bankroll separate: its own sub-account, its own e-wallet, or at the very least clean written bookkeeping.\n- Rent, bills, savings, emergency fund: off limits. Never play with money you need or will need in the foreseeable future.\n- Topping up from personal funds is a deliberate, rare decision made in a calm moment – never a spontaneous reaction to a losing session.\n- Withdrawals are allowed and healthy: if you win long term, you\'re entitled to enjoy some of it. But define in advance the threshold at which you cash out, so the bankroll keeps serving its purpose.\n\nThis separation has two effects. Financially, it completely shields your real life from the swings of the game. Psychologically, it turns the bankroll into a pure unit of account: 3 lost buy-ins are then not a "lost week of groceries" but a number in your poker ledger – and that distance is exactly what you need to keep playing cleanly. If this separation starts to blur for you, that is a serious warning sign (more on this in Lesson 5).',
          tip: 'A simple self-test: could you lose your entire bankroll today without anything changing in your daily life? If not, it\'s too big – or it isn\'t a bankroll at all, but money that doesn\'t belong there.',
        },
        {
          heading: 'The most common BRM mistakes',
          body:
            'Almost all bankroll disasters follow the same patterns:\n\n- **Moving up to recover losses**: switching to a higher stake after a downswing "because it comes back faster there". Higher stakes mean bigger swings and stronger opponents – in your worst mental state, you\'re picking the hardest assignment.\n- **Treating bankroll rules as fair-weather rules**: guidelines that only apply while you\'re winning are worthless. Their entire purpose is the emergency.\n- **Risking everything at one stake**: sitting down with your whole bankroll in a single evening – one bad run is all it takes.\n- **Extrapolating success too early**: projecting your win rate onto the whole year after 5,000 good hands and skipping stakes. Short-term results say almost nothing (Lesson 3).\n- **Keeping no records**: if you don\'t document your results properly, you romanticize them. Memory recalls wins better than losses – a well-known cognitive bias.\n\nThe good news: BRM is the easiest discipline in poker to learn. It demands no talent, only honesty and consistency – and it is the precondition for all your strategic knowledge getting the time it needs to pay off.',
        },
      ],
      takeaways: [
        'BRM minimizes your risk of ruin: with too few buy-ins, even a winner can go broke.',
        'Guidelines: cash at least 25–50 buy-ins, Sit & Gos 50+, MTTs 100+ buy-ins.',
        'Move up conservatively; if you fall below the threshold, move down immediately and without debate.',
        'The bankroll is strictly separate from personal money – never play with money you need.',
        'Scared money directly worsens your play: a comfortable bankroll is part of your playing strength.',
      ],
      quiz: [
        {
          question: 'What does the term risk of ruin describe?',
          options: [
            'The risk of losing to stronger opponents',
            'The probability of losing your entire bankroll despite a positive win expectation',
            'The maximum loss per session',
            'The fee the site takes from every hand',
          ],
          correctIndex: 1,
          explanation:
            'Risk of ruin is the chance of going broke through normal swings even though you are a long-term winner. Enough buy-ins push this risk close to zero.',
        },
        {
          question: 'How many buy-ins are considered a sensible minimum bankroll for cash games?',
          options: ['5–10', '25–50', '100–200', '10–15'],
          correctIndex: 1,
          explanation:
            '25 buy-ins is the floor, 50 the solid standard. Less cushion means a normal downswing becomes an existential threat to the bankroll.',
        },
        {
          question: 'Why do MTTs require significantly more buy-ins (100+) than cash games?',
          options: [
            'Because tournaments take longer',
            'Because tournament buy-ins are higher',
            'Because even good players rarely run deep, and the profits are concentrated in a few big payouts',
            'Because you can\'t rebuy in tournaments',
          ],
          correctIndex: 2,
          explanation:
            'In MTTs, the profit comes from rare deep runs while most tournaments end without a cash. That structure creates very high variance – and that demands a much bigger cushion.',
        },
        {
          question:
            'A downswing pushes your bankroll below the minimum threshold for your stake. What is the correct response?',
          options: [
            'Stay at the stake and bet on the comeback',
            'Move up a stake to win the losses back faster',
            'Top up with personal money to hold the stake',
            'Move down to the lower stake immediately and keep playing there',
          ],
          correctIndex: 3,
          explanation:
            'Moving down is BRM\'s built-in safety mechanism. Moving up to catch up combines higher variance with stronger opponents and a bad mental state – the classic road to ruin.',
        },
        {
          question: 'What money belongs in a poker bankroll?',
          options: [
            'Whatever is left in your account at the end of the month',
            'Exclusively money whose complete loss would not touch your daily life or your obligations',
            'Savings too, as long as you play with discipline',
            'Borrowed money, if your win rate is demonstrably positive',
          ],
          correctIndex: 1,
          explanation:
            'The bankroll is strictly separate from personal money and consists only of freely disposable funds. Savings, needed money, or borrowed money never belong there – regardless of any win rate.',
        },
      ],
    },
    {
      id: 'm6-l3',
      title: 'Understanding Variance',
      duration: 9,
      intro:
        'Variance is the reason good players can lose for weeks and bad players can win for months. Once you understand it, you evaluate your game realistically – and stop being fooled by results.',
      sections: [
        {
          heading: 'Good decision, bad outcome',
          body:
            'Poker is a game of incomplete information with an element of chance. That\'s why a principle applies that is hard to accept at first: **The quality of a decision is independent of its outcome.**\n\nThe connecting link is **expected value (EV)**: the average profit or loss of a decision if you could repeat it infinitely often. A +EV decision is right – even when it loses this time. A -EV decision is wrong – even when it wins this time.\n\nThe best example: you get A♣ A♦ all-in preflop against K♥ K♠. Your **equity** (probability of winning) is around 80%. But that also means: about one time in five, you lose this perfectly played hand. That\'s not a bug in the system – it is the system.\n\nIt gets dangerous when you draw the wrong conclusions from results (**results-oriented thinking**): you win with a bad call and consider it good from then on. You lose with a correct bluff and never dare to make it again. Both systematically worsen your game. The right question after every hand is not "Did I win?", but "Was my decision correct given the information available at the time?".',
          cards: ['Ac', 'Ad', 'Kh', 'Ks'],
          example:
            'Two sessions, same situation: you correctly call the river with a bluff catcher because your opponent mathematically bluffs often enough. Monday he shows a bluff – you win. Tuesday he shows value – you lose. Both calls were exactly equally good. If you only remember Tuesday and stop making that call, you\'ve learned the wrong lesson from variance.',
        },
        {
          heading: 'Downswings are mathematically normal',
          body:
            'A **downswing** is an extended losing stretch despite solid play – and it is not a possibility but a certainty. The magnitudes surprise most people:\n\n- A good cash game player with a win rate of 5bb/100 and a typical standard deviation (around 80–100bb/100) has to expect downswings of **20–30 buy-ins** over the course of his career. Considerably deeper slumps are not out of the question over hundreds of thousands of hands.\n- **Breakeven or losing stretches of 20,000–50,000 hands** happen again and again at this win rate – depending on your volume, that can be several weeks to months.\n- In MTTs it\'s more extreme: even strong tournament players typically cash in only roughly 15–20% of their tournaments. Runs of 30, 50, or more tournaments without a meaningful cash are completely normal.\n\nThese numbers are not cause for discouragement but for calibration: if you know that 20 lost buy-ins are within the normal range, you don\'t panic, you don\'t frantically change your strategy, and you don\'t throw your BRM overboard. This is exactly where the buy-in rules from Lesson 2 kick in: they are sized precisely so that normal downswings cannot ruin you.',
          tip: 'Build downswings into your expectations in advance and they lose their terror. The question is never whether your next downswing is coming – only when, and whether your bankroll and your head are prepared for it.',
        },
        {
          heading: 'Sample size: when numbers mean something',
          body:
            'Your win rate in bb/100 is an estimate – and like any estimate, it only becomes reliable as the **sample** grows. The swing between individual sessions is so large that short periods say almost nothing about your skill.\n\nAs a rough guide:\n\n- **1,000–5,000 hands**: practically pure variance. Results in either direction are meaningless.\n- **10,000–20,000 hands**: a first rough tendency, but a lucky or unlucky run can still completely distort the picture.\n- **50,000 hands**: a usable orientation, but still with a lot of uncertainty.\n- **100,000+ hands**: reasonably reliable – and even here, an uncertainty band of several bb/100 remains around the measured win rate.\n\nFor perspective: 100,000 hands is many months of play online at moderate volume, and several years live at roughly 25–30 hands per hour. That\'s why the rule is: **never** judge yourself short term by results. More telling are questions like: Am I making my decisions for stated reasons? Am I finding real mistakes in review? Do I understand concepts today that I didn\'t understand three months ago? These signals respond immediately – your win rate only responds after tens of thousands of hands.',
          table: {
            headers: ['Sample', 'What the win rate tells you'],
            rows: [
              ['1,000–5,000 hands', 'Practically nothing – pure variance'],
              ['10,000–20,000 hands', 'Rough tendency, easily distorted'],
              ['50,000 hands', 'Usable orientation'],
              ['100,000+ hands', 'Reasonably reliable, with residual uncertainty'],
            ],
          },
        },
        {
          heading: 'Focusing on decision quality',
          body:
            'If results mean almost nothing in the short term, you need a different yardstick. The only one that works: **decision quality**.\n\nIn practice, that means:\n\n- **Judge hands by the process**: Did you have a plan for the hand? Can you justify bet, call, or fold with ranges, equity, and position? Then the hand was well played – no matter who got the pot.\n- **Separate review from emotion**: Only analyze big pots after some time has passed. Right after the session, your mind factors in the result whether you want it to or not.\n- **Celebrate correct folds and correctly played losing hands**: A disciplined fold that later turns out to be right is a bigger success than a won coin flip – even if it doesn\'t feel that way.\n- **Keep two accounts in your head**: one for results (matters long term), one for decisions (matters every day). Only the second one is directly under your control.\n\nThis attitude has a double benefit. Strategically, you learn faster because you distinguish real mistakes from bad luck. Mentally, you become more stable because your self-worth no longer hangs on the daily balance – the strongest tilt prevention there is. You can\'t switch variance off. But you can make sure it only moves your money in the short term – not your decisions.',
          tip: 'Ask yourself exactly one question after every tricky hand: "Would I play it the same way again in the same situation with the same information?" If yes, check it off – the result was just variance. If no, you\'ve found genuine study material.',
        },
      ],
      takeaways: [
        'The quality of a decision is independent of its outcome – judge the EV, not the result.',
        'Even with A♣ A♦ against K♥ K♠, you lose about one all-in in five: losing as the favorite is priced in.',
        'Downswings of 20–30 buy-ins and breakeven stretches over tens of thousands of hands are normal for winners.',
        'A win rate only becomes reasonably reliable over tens of thousands of hands (approaching 100,000).',
        'The short-term yardstick is decision quality – results only count in the long run.',
      ],
      quiz: [
        {
          question:
            'You go all-in preflop with A♣ A♦, your opponent calls with K♥ K♠ and wins on the river. How do you evaluate your decision?',
          options: [
            'A mistake – I should have played the aces more cautiously',
            'Well played: with around 80% equity the all-in was clearly +EV, the result is variance',
            'Unclear – it depends on the outcome',
            'Correct, but only because the pot was big',
          ],
          correctIndex: 1,
          explanation:
            'Aces against kings preflop is just about the best possible spot. A roughly 20% chance of losing comes with it – the decision remains correct, regardless of how this one hand turned out.',
        },
        {
          question:
            'From what sample size does a measured win rate become reasonably reliable?',
          options: [
            'After about 1,000 hands',
            'After about 5,000 hands',
            'After one successful week',
            'Only after tens of thousands of hands, approaching 100,000',
          ],
          correctIndex: 3,
          explanation:
            'Session-to-session swing is enormous. Below 10,000 hands, pure variance dominates; only in the range of 50,000–100,000+ hands does the win rate become a usable estimate – with residual uncertainty.',
        },
        {
          question:
            'A solid winner (5bb/100) loses 22 buy-ins over several weeks, even though his review says he played well. What is the most likely explanation?',
          options: [
            'He has actually become a losing player and should completely overhaul his strategy',
            'A normal downswing – slumps of this magnitude are part of every winner\'s career',
            'The software or the deck is rigged',
            'Downswings of more than 10 buy-ins are mathematically impossible for winners',
          ],
          correctIndex: 1,
          explanation:
            'Downswings of 20–30 buy-ins are fully within expectations at typical variance. As long as the review shows no systematic mistakes, the right response is: stick to BRM, keep playing, change nothing in a panic.',
        },
        {
          question: 'What does results-oriented thinking describe?',
          options: [
            'Judging decisions by their random outcome instead of their expected value',
            'Consistently setting results goals for every session',
            'Analyzing results over large samples',
            'A strategy aimed at maximizing pot sizes',
          ],
          correctIndex: 0,
          explanation:
            'Results-oriented thinking means: a call was "good" because it won this time. That way you learn from randomness instead of logic – and systematically reinforce bad habits.',
        },
        {
          question:
            'Why is focusing on decision quality also valuable mentally?',
          options: [
            'Because it guarantees that downswings will be shorter',
            'Because it reduces variance',
            'Because your self-worth no longer hangs on the daily balance – which protects against tilt and panic reactions',
            'Because opponents find process-oriented players harder to read',
          ],
          correctIndex: 2,
          explanation:
            'Variance can\'t be switched off. But if you define yourself by your decisions instead of your results, you stay stable through downswings – the most effective tilt prevention there is.',
        },
      ],
    },
    {
      id: 'm6-l4',
      title: 'Mindset & Study Routine',
      duration: 9,
      intro:
        'What separates a recreational player from a steadily improving one is rarely talent – it\'s a routine. This lesson builds you a study system that fits into a normal life.',
      sections: [
        {
          heading: 'Growth mindset: mistakes are data',
          body:
            'A **growth mindset** means: you regard poker skill not as a fixed trait ("I\'m just not a math person") but as a trainable competence. For poker, this attitude is not a feel-good platitude but a working principle:\n\n- **Mistakes are study material, not verdicts.** Every weakness uncovered in your game is a concrete, workable point of improvement – and thus worth more than ten winning sessions you take nothing away from.\n- **Compare yourself to your past self**, not to regulars who have played for years. The relevant question is: do I understand things today that I didn\'t understand three months ago?\n- **Actively seek refutation.** Weak players want confirmation ("That call was fine, right?"); strong players want to find their mistakes. If criticism of a hand annoys you instead of interesting you, you\'ve discovered a blind spot.\n\nThis mindset connects directly to the variance lesson: because results are random in the short term, honest error analysis is your only reliable measure of progress. If you deny mistakes to feel better, you take away from yourself the only instrument by which progress can be measured at all.',
          tip: 'Always phrase mistakes as an open task instead of a verdict: not "I play draws badly" but "I need to learn when my flush draws should raise as a semi-bluff". The first paralyzes you; the second hands you your next study unit.',
        },
        {
          heading: 'Study/play balance: the 20–30 percent rule',
          body:
            'Only playing makes you fast at executing your existing mistakes. Only studying makes you a theorist who never applies anything. The rule of thumb for steady improvement: **invest about 20–30% of your poker time in study**, and the rest in playing. At 8 hours of poker per week, that\'s around 2 hours of focused study work.\n\nWhat matters is the quality of the study. **Active learning** clearly beats passive consumption:\n\n- **Active**: analyzing your own hands, recalculating spots with an equity calculator, answering a specific question ("How do I play small pocket pairs against a 3-bet?"), writing down and comparing ranges.\n- **Passive**: watching training videos on the side, scrolling forums, watching highlight clips. It feels like learning but leaves little behind.\n\nStudy is most effective with a **topic focus**: pick exactly one concept per week (e.g. c-bet sizing on dry boards) and carry it through study and play: you read up on it, analyze your own hands on exactly that topic, and consciously watch for it in your next session. One topic per week, properly anchored, beats five topics you only skimmed.',
          example:
            'Weekly topic "delayed c-bet": On Monday you read the theory and write out three rules. During your sessions you mark every hand in which you check the flop as the preflop aggressor. On review day you check: did I check in the right spots – and then play the turn sensibly?',
        },
        {
          heading: 'Marking and reviewing hand histories',
          body:
            'Your own hands are your best textbook – they show exactly your mistakes, not those of a video coach. The workflow:\n\n- **During the session: mark only.** Every hand you were unsure about, every big pot, every spot that felt off – one click on the mark function (online) or a quick note (live), then keep playing. No analysis at the table: it costs focus and invites rumination.\n- **Review with distance**: the next day at the earliest, once the emotion is gone. 3–5 hands per review are plenty – depth beats volume.\n- **Analyze in a structured way**: Go through the hand street by street. What range does my opponent have here? What options did I have, and what speaks for each? Only at the very end are you allowed to look at the result.\n- **Collect patterns**: Note a one-sentence conclusion for every reviewed hand. After a few weeks you\'ll see recurring themes – those are your real leaks (systematic mistakes), and they determine your next weekly topic.\n\nImportant: don\'t review only losing hands. Won pots often hide the most expensive mistakes – value bets that were too small, or getting lucky after a bad call. Select hands by uncertainty, not by result.',
          tip: 'The best review question is not "What should I have done?" but "What did I know in the moment – and which part of it did I ignore?". That trains decisions under real conditions instead of hindsight smugness.',
        },
        {
          heading: 'A concrete weekly routine',
          body:
            'A routine only works if it fits your life. Here is a sample plan for someone with about 8–9 hours of poker time per week – a template to adapt, not a mandatory program:\n\nThe plan implements the 20–30% rule (around 2.5 of 9 hours are study), spreads the load across small units, and deliberately includes poker-free days. Recovery is part of the training, not an interruption of it.\n\nThree principles keep a plan like this stable:\n\n- **Fixed slots instead of good intentions**: "Tuesday 8 p.m., 30 minutes of review" happens. "I\'ll review sometime this week" doesn\'t.\n- **Start small**: Better 20 minutes you actually stick to than a 2-hour plan that dies after two weeks.\n- **Session rituals**: 2 minutes before playing – look at the weekly topic, confirm your stop-loss, close distractions. 3 minutes after playing – hands marked? Quick note on your mental state in the log. These five minutes interlock playing and learning.',
          table: {
            headers: ['Day', 'Activity', 'Duration'],
            rows: [
              ['Monday', 'Session (marking hands as you go)', '90 min'],
              ['Tuesday', 'Review: 3–5 marked hands', '30 min'],
              ['Wednesday', 'Session', '90 min'],
              ['Thursday', 'Study: weekly topic (video/article + notes)', '45 min'],
              ['Friday', 'No poker', '—'],
              ['Saturday', 'Longer session focused on the weekly topic', '2 × 90 min'],
              ['Sunday', 'Weekly recap: note leaks, pick the next topic', '30 min'],
            ],
          },
        },
        {
          heading: 'Process goals, sleep, and focus',
          body:
            'Results goals ("Win €500 this month") are useless in poker because you don\'t control the result short term – variance has a say. Instead, set **process goals** that lie entirely in your hands:\n\n- "I stick to my stop-loss in 100% of sessions."\n- "I review at least three marked hands every week."\n- "I only play when I\'m alert and undisturbed."\n\nProcess goals can be achieved 100% every week – even in a downswing. That keeps motivation stable where results goals would destroy it.\n\nFinally, the most underrated factor: your body. Poker is sustained concentration and impulse control, and both depend directly on your condition:\n\n- **Sleep**: Fatigue worsens risk assessment and self-control – playing tired is like driving with the handbrake on, only more expensive. No sessions after bad nights.\n- **Nutrition**: Heavy meals and lots of sugar right before a session create concentration slumps. Water instead of the third coffee.\n- **Focus**: Phone away, one screen, no show running on the side. One focused hour gives you more – in play and in study – than three distracted ones.\n\nYour A-game is not a question of wanting it, but of the conditions for it. Create them, and you\'ll play it more often.',
        },
      ],
      takeaways: [
        'Growth mindset means: mistakes are study material, and you measure yourself against your past self.',
        'Invest about 20–30% of your poker time in active study – ideally with a weekly topic.',
        'Mark uncertain hands during the session, review them with distance – selected by uncertainty, not by result.',
        'Fixed, small time slots and session rituals beat grand intentions.',
        'Set process goals instead of results goals – and treat sleep, nutrition, and focus as part of your game.',
      ],
      quiz: [
        {
          question: 'What is the rule of thumb for the ratio of study to playing time?',
          options: [
            'Invest about 20–30% of your poker time in study',
            'At most 5% – experience comes from playing',
            'At least 50% study, otherwise you learn nothing',
            'Study only makes sense at higher stakes',
          ],
          correctIndex: 0,
          explanation:
            'Around a fifth to a third of your time for focused, active study has proven itself as a rule of thumb: enough to correct mistakes without neglecting practical execution.',
        },
        {
          question: 'Which of the following goals is a process goal?',
          options: [
            'Reach €300 in profit this month',
            'Move up to NL50 by the end of the year',
            'Review at least three marked hands in a structured way after every week',
            'Never finish a session in the red again',
          ],
          correctIndex: 2,
          explanation:
            'Process goals lie entirely within your control. Profit amounts, moving up stakes, and session results depend on variance – the review commitment does not.',
        },
        {
          question: 'Which hands should you prefer to select for review?',
          options: [
            'Only the biggest lost pots',
            'Hands you were unsure about – regardless of whether you won them',
            'Only bad beats, to document the variance',
            'As many hands as possible, at least 20 per review',
          ],
          correctIndex: 1,
          explanation:
            'Uncertainty marks learning potential. Won hands hide mistakes too (e.g. missed value). A few hands in depth beat many at a glance.',
        },
        {
          question: 'Why should you only analyze marked hands after some time has passed?',
          options: [
            'Because hand histories only become available the next day',
            'Because right after the session, emotion gets factored into the verdict and distorts it',
            'Because reviews only make sense on weekends',
            'Because hands can only be evaluated after 10,000 further hands',
          ],
          correctIndex: 1,
          explanation:
            'Fresh after the session, anger or euphoria flows into your judgment – results-oriented thinking. With a day\'s distance, you analyze the decision, not the feeling about the result.',
        },
        {
          question: 'What characterizes a growth mindset in poker?',
          options: [
            'The conviction that poker talent cannot meaningfully change',
            'Comparing your own results with those of experienced regulars',
            'Avoiding error analysis to protect your confidence',
            'Regarding skills as trainable and actively seeking out mistakes as study material',
          ],
          correctIndex: 3,
          explanation:
            'Growth mindset means: skill is trainable, mistakes are data, and the yardstick is your own progress. Precisely because results are random short term, honest error analysis is your measure of progress.',
        },
      ],
    },
    {
      id: 'm6-l5',
      title: 'Responsible Play',
      duration: 8,
      intro:
        'Poker should be a hobby and a learning project – not a problem. This lesson helps you stay honest with yourself: with clear limits, a realistic view of the game, and the knowledge of where to find help.',
      sections: [
        {
          heading: 'An honest look at skill and luck',
          body:
            'In the long run, poker is a **game of skill**: over tens of thousands of hands, better decisions prevail, and the same players win year after year. But – and this "but" belongs to the whole truth – the **luck component is substantial**. Short term, meaning over days, weeks, and even months, variance can drown out any amount of skill. A single evening is closer to rolling dice than to chess.\n\nThree honest consequences follow from this dual nature:\n\n- **Poker is legally and practically gambling** and is regulated accordingly – for good reason: it can trigger the same problematic behavior patterns as other forms of gambling.\n- **The majority of players lose in the long run.** Besides the skill of the opposition, the **rake** (the operator\'s fee on every pot or tournament) alone ensures that poker is, in aggregate, a losing proposition for the average player.\n- **Poker is not a reliable source of income** – least of all at the beginning. Never plan around poker winnings, neither in your budget nor in your head.\n\nThis framing is no contradiction to this app\'s ambition to teach – on the contrary: those who respect the luck component learn more patiently, play with more control, and stay healthy at the game for longer.',
          tip: 'An honest standard to hold yourself to: play poker because the game fascinates you – not because you expect money. Winnings are then a possible bonus, not a condition.',
        },
        {
          heading: 'Set limits in advance',
          body:
            'All effective safeguards have one thing in common: they are set **before** playing, in a calm state – not in the heat of a session. Four levels:\n\n- **Money limits**: A fixed monthly poker budget drawn from freely disposable money (see Lesson 2). With licensed German online operators, you can and should additionally set a **deposit limit** directly in your account; by law, a cross-operator limit applies anyway (€1,000 per month by default).\n- **Time limits**: Set session length and playing days per week in advance – and deliberately schedule poker-free days. Poker should take place within your life, not your life within poker.\n- **Condition limits**: Don\'t play when tired, under the influence of alcohol, under acute stress, or emotionally strained – in these states, exactly the abilities poker demands suffer: judgment and impulse control.\n- **Use the technical tools**: Operators\' limits, reminders, and self-assessment tests are not tools for "problem gamblers" but sensible defaults for everyone – just as a seatbelt isn\'t only there for bad drivers.\n\nYou know the rule behind this from the tilt lesson: limits only work if they apply mechanically. A limit you can renegotiate mid-game is not a limit.',
          example:
            'A clean setup: monthly budget of €50, stored as a deposit limit with the operator. At most three evenings per week, 2 hours each with a timer. Fixed rule: no poker after midnight, no poker after alcohol, no second deposit in the same month – no matter how "safe" a game feels.',
        },
        {
          heading: 'Check the warning signs honestly',
          body:
            'Problematic gambling behavior rarely starts dramatically – it starts with small shifts you can justify well to yourself. Check yourself regularly and honestly against these warning signs:\n\n- You play with money you actually need – or borrow money to play.\n- You try to recover losses by playing on immediately or raising your stakes (chasing).\n- You conceal the extent of your playing or your losses from your partner, family, or friends.\n- You think about playing constantly, even when you want to do other things – or become restless and irritable when you can\'t play.\n- Playing time crowds out sleep, work, studies, or relationships.\n- Your mood noticeably depends on session results.\n- You play to escape from problems, stress, or unpleasant feelings – not because the game interests you.\n- Resolutions and limits get broken repeatedly ("just half an hour more").\n\nA single signal on a bad day doesn\'t make a problem. But if several points apply over weeks – or if just answering honestly already makes you nervous – take it seriously. The decisive question is simple and uncomfortable: **Is poker still fun – or have you long been playing on for other reasons?**',
          tip: 'Once a month, ask a person who knows you well: "Do you notice anything about my playing habits?" An outside view often spots shifts earlier than your own – and asking the question is itself self-control in action.',
        },
        {
          heading: 'Getting help is strength, not weakness',
          body:
            'If playing is no longer fun, you\'re losing control, or warning signs apply, there are good, free, and anonymous places to turn in Germany:\n\n- The **BZgA** (Federal Centre for Health Education) offers an anonymous self-test, information, and an online counseling program at **check-dein-spiel.de**.\n- The **BZgA\'s telephone helpline for gambling addiction** is available free and anonymously at **0800 1 37 27 00**.\n- Locally, **addiction counseling centers** (e.g. run by Caritas, Diakonie, and other organizations) can help – free, confidential, and open to family members too.\n- With licensed operators, you can bar yourself via the nationwide self-exclusion system **OASIS** – for individual operators or across all of them, temporarily or indefinitely.\n\nImportant: these services are not just "for emergencies". A self-test after a few months of playing is as sensible as a health check-up – especially if you believe you don\'t need it.\n\nAnd finally, the frame everything in this course sits within: poker is a fascinating strategy game and a great learning project – mathematics, psychology, and self-discipline in one. That is exactly what it should remain: a hobby that enriches your life. The moment it becomes something else, the strongest decision you will ever make at a poker table is to stand up and get support.',
        },
      ],
      takeaways: [
        'In the long run, poker is a game of skill – with a substantial luck component that can drown out everything short term.',
        'You set limits for money, time, and playing condition before the session – mechanically and non-negotiably.',
        'Check the warning signs honestly: chasing, concealment, playing with needed money, mood tied to results.',
        'Free, anonymous help in Germany: the BZgA with check-dein-spiel.de and the helpline 0800 1 37 27 00, addiction counseling centers, OASIS self-exclusion.',
        'Poker should remain a hobby and a learning project – when it no longer is, getting help is the strongest decision.',
      ],
      quiz: [
        {
          question: 'Which statement correctly describes the relationship between skill and luck in poker?',
          options: [
            'Poker is pure gambling, skill plays no role',
            'Long term, skill decides; short term, the substantial luck component can drown out any amount of skill',
            'Anyone who plays well enough wins every single session',
            'The luck component disappears beyond a certain skill level',
          ],
          correctIndex: 1,
          explanation:
            'Over large samples, better decisions prevail – but individual sessions, weeks, and even months are heavily shaped by variance. Both belong to an honest assessment.',
        },
        {
          question: 'When should money and time limits be set?',
          options: [
            'During the session, as soon as things go badly',
            'Only once warning signs appear',
            'Before playing, in a calm state – and then followed mechanically',
            'Limits are only necessary for players with problems',
          ],
          correctIndex: 2,
          explanation:
            'In the middle of a game, your judgment is not neutral – a limit that can be renegotiated there does not protect you. Limits set in advance are sensible defaults for all players.',
        },
        {
          question: 'Which of the following behavior patterns is a clear warning sign?',
          options: [
            'Ending the session after a fixed stop-loss',
            'Concealing losses from your partner and trying to win them back with higher stakes',
            'Scheduling one poker-free day per week',
            'Keeping a written record of your own results',
          ],
          correctIndex: 1,
          explanation:
            'Concealment and chasing are two of the clearest warning signs of problematic gambling behavior. The other options are, on the contrary, signs of controlled play.',
        },
        {
          question:
            'You notice that poker is no longer fun and that you repeatedly break your resolutions. What help is available in Germany?',
          options: [
            'The BZgA, e.g. via check-dein-spiel.de or the free, anonymous telephone helpline',
            'Only paid private clinics',
            'The poker site\'s customer support as the only option',
            'There are no support services for gambling',
          ],
          correctIndex: 0,
          explanation:
            'The BZgA offers free, anonymous help via check-dein-spiel.de and the telephone helpline (0800 1 37 27 00). There are also local addiction counseling centers and the option of OASIS self-exclusion.',
        },
        {
          question: 'What is OASIS?',
          options: [
            'A bonus program run by licensed poker operators',
            'Training software for tournament poker',
            'The nationwide self-exclusion system through which players can bar themselves from licensed operators',
            'An operator-run self-test of playing strength',
          ],
          correctIndex: 2,
          explanation:
            'OASIS is Germany\'s nationwide, cross-operator player exclusion system. Exclusion can be temporary or indefinite – an effective instrument for making a break binding.',
        },
      ],
    },
  ],
};

export default m6;
