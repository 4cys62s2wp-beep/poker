import type { Module } from '../../types';

const m3: Module = {
  id: 'm3',
  title: 'Poker Math',
  subtitle: 'Outs, odds, and equity – run the numbers like a pro',
  icon: '🧮',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm3-l1',
      title: 'Counting Outs',
      duration: 8,
      intro:
        'Before you can calculate odds, you need to know how many cards actually help you. Counting outs is the foundational skill of all poker math – and you can learn it in a few minutes.',
      sections: [
        {
          heading: 'What Are Outs?',
          body:
            'An **out** is an unseen card that improves your hand to (what is presumably) the best hand. Perspective is everything here: you only know your two hole cards and the board cards. After the flop that’s 5 of 52 cards, leaving **47 unknown cards** – after the turn, **46**. The fact that some of them sit in your opponents’ hands or in the muck doesn’t matter for the math: from your point of view, every unknown card is equally likely to be the next board card.\n\nThe counting itself is simple inventory. Example: you hold A♥ Q♥ and the flop comes K♥ 7♥ 2♠. You need one more heart for the flush. There are 13 hearts, you hold two, and two are on the board – leaving **9 outs** to the nut flush.\n\nThe qualifier “to the best hand” matters. A card that improves you but still leaves you losing is not a real out. So count gross first, then take a critical second look at which outs are actually clean – more on that in a moment.',
          cards: ['Ah', 'Qh'],
          tip: 'Always count outs concretely by suits and ranks, never by feel. “I need a heart” becomes “13 minus 2 minus 2 equals 9”. That discipline prevents the most common counting mistakes.',
        },
        {
          heading: 'The Standard Draws at a Glance',
          body:
            'The most common draw situations come up over and over – you should know their out counts by heart so you never lose time doing math at the table.\n\nThe key numbers: a **flush draw** has 9 outs. An **OESD** (open-ended straight draw) has 8 outs – two ranks of four cards each. A **gutshot** (a straight draw with a gap in the middle) has only 4 outs. Two overcards like A♦ K♣ on Q-8-4 have 6 outs to top pair – though those are notoriously unreliable outs. A pocket pair has 2 outs to a set, two pair has 4 outs to a full house, and a flopped set has 7 outs on the turn to improve to a full house or quads (6 cards pair the board, 1 card makes quads).\n\nWith combined draws you add the outs but subtract the **overlap**: a flush draw plus an OESD is not 17 but 15 outs, because two of the straight cards also complete the flush and must not be counted twice.',
          table: {
            headers: ['Draw', 'Outs', 'Example'],
            rows: [
              ['Pocket pair → set', '2', '5♦ 5♣ on A-9-2'],
              ['One overcard', '3', 'A♠ 7♠ on K-8-3 (only the ace helps)'],
              ['Gutshot', '4', '9♣ 8♦ on J-7-2 (only a ten helps)'],
              ['Two pair → full house', '4', 'K♥ Q♣ on K-Q-6'],
              ['Two overcards', '6', 'A♦ K♣ on Q-8-4'],
              ['Set → full house/quads (on the turn)', '7', '8♠ 8♦ on 8♥-K-4'],
              ['OESD', '8', 'J♠ T♠ on 9-8-3'],
              ['Flush draw', '9', 'A♥ Q♥ on K♥-7♥-2♠'],
              ['Flush draw + gutshot', '12', 'Q♥ J♥ on K♥-9♥-4♠'],
              ['Flush draw + OESD', '15', 'J♥ T♥ on 9♥-8♥-2♣'],
            ],
          },
        },
        {
          heading: 'Combined Draws: Spotting the Monsters',
          body:
            'Combined draws are among the strongest hands you can hold on the flop – often they are actually the favorite against a made top pair.\n\nWork through the example of J♥ T♥ on 9♥ 8♥ 2♣: all four queens and all four sevens complete your straight (8 outs). Nine hearts complete your flush. But Q♥ and 7♥ appear on both lists and only count once: 8 + 9 − 2 = **15 outs**. A draw like this has about 54% equity over two cards against top pair – you are genuinely ahead with a “nothing” hand.\n\nFlush draw plus gutshot works the same way: 9 + 4 − 1 = **12 outs**. And a flush draw plus two overcards (say A♥ K♥ on Q♥ 8♥ 3♦) adds up to 9 + 6 = 15 outs, though the overcard outs are shakier than the flush outs.\n\nThe strategic takeaway: you rarely play hands like these passively. With this much equity plus fold equity (the chance your opponent folds), raising and semi-bluffing is usually the most profitable line.',
          cards: ['Jh', 'Th'],
          example:
            'J♥ T♥ on 9♥ 8♥ 2♣ against A♠ 9♦ (top pair): your combo draw wins more than half the time – even though all you hold right now is jack high.',
        },
        {
          heading: 'Discounting Outs: Clean vs. Dirty',
          body:
            'Not every out is a real out. **Tainted outs** improve your hand but simultaneously give your opponent an even better one. Count gross, and you systematically overestimate your equity.\n\nThe three most common cases:\n\n- **Draw against draw**: You hold J♣ T♦ on 9♥ 8♥ 2♣ (OESD, 8 outs). If your opponent plausibly has a flush draw, the Q♥ and 7♥ make your straight but complete his flush. Count 6 clean outs.\n- **Overcards against strong ranges**: With A♦ K♣ on Q-8-4 you count 6 outs to top pair. Against a set or two pair those outs are practically worthless; against KQ only the ace helps you. The stronger your opponent’s range, the harder you have to discount – often down to 3 or fewer.\n- **Dominated draws**: With 8♥ 7♥ on a heart board, your 9 flush outs can even lead to disaster against a higher flush draw.\n\nA workable rule of thumb: in unclear situations, knock off one or two outs. There is no perfect precision here – but the difference between 8 gross and 6 net regularly decides between a call and a fold.',
          tip: 'Ask yourself about every out: “If this card comes and my opponent doesn’t fold – do I actually win most of the time?” If the honest answer is “not sure”, discount it.',
        },
      ],
      takeaways: [
        'An out is an unknown card that makes your hand the best hand – there are 47 unknown cards after the flop and 46 after the turn.',
        'Know the standard numbers cold: flush draw 9, OESD 8, gutshot 4, two overcards 6, pocket pair to a set 2.',
        'For combined draws, add the outs and subtract the overlap: flush draw + OESD = 15, not 17.',
        'Discount tainted outs that give your opponent a better hand – above all straight outs on flush boards and overcard outs against strong ranges.',
        'Play monster draws with 12+ outs aggressively: they often have more equity than a made top pair.',
      ],
      quiz: [
        {
          question: 'You hold A♥ Q♥ and the flop comes K♥ 7♥ 2♠. How many outs do you have to the flush?',
          options: ['7', '9', '11', '13'],
          correctIndex: 1,
          explanation:
            'There are 13 hearts. You hold two and two are on the board – that leaves 9 outs.',
        },
        {
          question: 'How many outs do an OESD and a gutshot have?',
          options: [
            'OESD 8, gutshot 4',
            'OESD 4, gutshot 8',
            'Both 8',
            'OESD 8, gutshot 6',
          ],
          correctIndex: 0,
          explanation:
            'An OESD is completed by two ranks of 4 cards each (8 outs), a gutshot by only one rank (4 outs).',
        },
        {
          question: 'You hold 5♦ 5♣ and the flop misses your set. How many outs to your set do you have on the turn?',
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation:
            'Of the four fives you hold two – exactly 2 outs remain (5♥ and 5♠).',
        },
        {
          question:
            'You have J♣ T♦ on 9♥ 8♥ 2♣ and strongly suspect your opponent has a flush draw. How many clean outs should you count?',
          options: ['8', '6', '4', '10'],
          correctIndex: 1,
          explanation:
            'The Q♥ and 7♥ complete your straight, but they also complete your opponent’s flush. You discount those two outs: 8 − 2 = 6.',
        },
        {
          question: 'A flush draw and an OESD at the same time – how many outs do you have in total?',
          options: ['17', '15', '13', '12'],
          correctIndex: 1,
          explanation:
            '9 flush outs plus 8 straight outs minus the 2 cards that appear on both lists: 15 outs.',
        },
      ],
    },
    {
      id: 'm3-l2',
      title: 'The Rule of 2 and 4',
      duration: 7,
      intro:
        'Outs become equity – in your head, in under a second. The rule of 2 and 4 is the most important shortcut in all of poker math.',
      sections: [
        {
          heading: 'How the Rule Works',
          body:
            '**Equity** is your percentage share of the pot – the probability that your hand wins in the end. The rule of 2 and 4 converts outs straight into equity:\n\n- **Outs × 2**: your approximate equity in percent when **one** card is still to come (flop to turn, or turn to river).\n- **Outs × 4**: your approximate equity when you will see **both** remaining cards – that is, from the flop all the way to the river.\n\nWhy does this work? After the turn, 46 cards are unknown, so each out hits with probability 1/46 ≈ 2.2%. The factor 2 is a slightly rounded-down version of that. Over two cards you get two chances, hence roughly double – factor 4.\n\nFlush draw example: 9 outs × 2 = 18% for one card (exact: 19.6% on the river). 9 × 4 = 36% from flop to river (exact: 35.0%). For decisions at the table that accuracy is more than enough – the source of error is almost never the rule, it’s miscounted outs.',
          tip: 'Memorize the three most important results as fixed anchors: gutshot roughly 8/16%, OESD roughly 16/32%, flush draw roughly 18/36% (one card / two cards).',
        },
        {
          heading: 'Working Through Examples',
          body:
            'Three typical situations:\n\n- **Gutshot on the turn**: 4 outs × 2 = 8%. The exact number is 4/46 ≈ 8.7%. You only get there about one time in eleven – gutshots alone rarely justify big calls.\n- **OESD on the flop, you’re all-in**: 8 outs × 4 = 32%. Exact: 31.5%. The straight arrives about one time in three.\n- **Flush draw plus gutshot on the flop, all-in**: 12 outs × 4 = 48%. Exact: 45.0%. Against most made hands you’re nearly a coinflip.\n\nThe table shows how closely the rule tracks reality – and where the drift begins: up to about 8 outs the rule of 4 is almost spot-on; beyond that it increasingly overestimates.',
          table: {
            headers: ['Outs', 'Rule of 4', 'Exact (flop to river)'],
            rows: [
              ['4 (gutshot)', '16%', '16.5%'],
              ['8 (OESD)', '32%', '31.5%'],
              ['9 (flush draw)', '36%', '35.0%'],
              ['12 (flush + gutshot)', '48%', '45.0%'],
              ['15 (flush + OESD)', '60%', '54.1%'],
            ],
          },
        },
        {
          heading: 'The Most Common Mistake: ×4 Without an All-In',
          body:
            'The rule of 4 only applies when you are **guaranteed to see both cards without having to pay again** – in practice, only when someone is all-in on the flop (you or your opponent).\n\nThe classic error goes like this: you hold a flush draw on the flop, your opponent bets, and you talk yourself into 36% equity. But your call only pays for the turn card! If the flush doesn’t arrive there, your opponent will usually bet again on the turn – and you have to pay **once more** for the river. For the current decision, only the rule of 2 counts: about 18%.\n\nThe right way to think about it: every street is its own decision with its own price. Only when no further betting is possible may you evaluate both cards together.\n\nThis one difference – 18% instead of 36% – is one of the most expensive calculation errors there is, because it turns clear folds into apparent calls. If you use ×4 against a flop bet while there are still chips behind the stacks, you systematically overpay for your draws.',
          example:
            'Flush draw on the flop, opponent bets, both stacks still deep: use 9 × 2 = 18% for the call. Only if your opponent moves all-in does 9 × 4 = 36% apply.',
        },
        {
          heading: 'Accuracy Limits with Many Outs',
          body:
            'From about 9 or 10 outs, the rule of 4 starts to overestimate. The reason: the multiplication pretends you could hit on the turn **and** the river and counts those cases twice. With few outs that barely matters; with many outs the error adds up.\n\nIt becomes obvious with the 15-out monster draw: 15 × 4 = 60%, but the exact figure is 54.1% – almost six percentage points apart. With 20 outs the rule would even claim 80%, when the real number is about 68%.\n\nFor these cases there is a simple **correction formula**: with more than 8 outs, compute (outs × 4) − (outs − 8).\n\n- 12 outs: 48 − 4 = 44% (exact 45.0%)\n- 15 outs: 60 − 7 = 53% (exact 54.1%)\n\nThe rule of 2, by the way, barely has this problem – it runs slightly **low** across the whole range (9 outs: 18% instead of 19.6%), which in practice is a harmless, conservative bias.\n\nBottom line: use the rule of 2 without hesitation, the rule of 4 without hesitation up to 8 outs, and with the correction beyond that.',
          tip: 'Memory hook for big draws: from 9 outs up, subtract the difference above 8 outs from the ×4 estimate. That keeps you within a point or two even on monster draws.',
        },
      ],
      takeaways: [
        'Outs × 2 estimates your equity for one card to come; outs × 4 for both cards from flop to river.',
        'The rule of 4 only applies when all-in on the flop – otherwise you pay for each street separately and use × 2.',
        'Anchors: gutshot about 16%, OESD about 32%, flush draw about 36% (two cards each, all-in).',
        'From 9 outs the rule of 4 overestimates: correct with (outs × 4) − (outs − 8).',
        'The biggest error is rarely the estimation formula – it’s miscounted or undiscounted outs.',
      ],
      quiz: [
        {
          question:
            'You hold a flush draw on the turn with only the river to come. What equity does the rule of 2 give you?',
          options: ['9%', '18%', '27%', '36%'],
          correctIndex: 1,
          explanation:
            '9 outs × 2 = 18%. The exact value is 9/46 ≈ 19.6% – the rule runs slightly below it.',
        },
        {
          question: 'When are you allowed to multiply your outs by 4?',
          options: [
            'Any time you’re on the flop',
            'Only when you’re guaranteed to see the turn and river without paying more, e.g. when all-in on the flop',
            'Any time you have more than 8 outs',
            'Only with flush draws',
          ],
          correctIndex: 1,
          explanation:
            'The ×4 rule prices in both coming cards. That’s only valid if you don’t have to pay for them again – in practice, only when all-in on the flop.',
        },
        {
          question: 'You’re all-in on the flop with a gutshot (4 outs). What equity does the rule of 4 give you?',
          options: ['8%', '12%', '16%', '20%'],
          correctIndex: 2,
          explanation: '4 outs × 4 = 16%. The exact value is 16.5% – the rule is almost perfect here.',
        },
        {
          question:
            'With 15 outs on the flop (all-in), the rule of 4 claims 60%. Roughly where is the exact value?',
          options: ['60%', '54%', '48%', '65%'],
          correctIndex: 1,
          explanation:
            'The exact figure is 54.1%. With many outs the rule overestimates; the correction (outs × 4) − (outs − 8) = 53% comes close.',
        },
        {
          question:
            'Flush draw on the flop, your opponent bets, both stacks are still deep. What do you use for this call?',
          options: [
            '9 × 4 = 36%, because two cards are still to come',
            '9 × 2 = 18%, because your call only pays for the turn card',
            '9 × 3 = 27% as a compromise',
            '50%, because the flush either comes or it doesn’t',
          ],
          correctIndex: 1,
          explanation:
            'Without an all-in you pay for each street separately. Only the next card counts for the current decision – so the rule of 2 applies.',
        },
      ],
    },
    {
      id: 'm3-l3',
      title: 'Pot Odds',
      duration: 9,
      intro:
        'Pot odds answer the most important question at the table: is this call worth the money? If you can compare the price of a call with your equity, you make mathematically grounded decisions instead of gut calls.',
      sections: [
        {
          heading: 'The Core Idea: the Price of a Call',
          body:
            '**Pot odds** describe the ratio between what you can win and what you have to risk for it. From that follows directly the minimum equity you need for a profitable call.\n\nThe formula: **Required equity = call / (pot after your call)** – that is, the call divided by the sum of the existing pot, your opponent’s bet, and your own call.\n\nExample: there’s €100 in the pot and your opponent bets €50. You have to call €50; the pot after your call is 100 + 50 + 50 = €200. Required equity: 50/200 = **25%**. If you win more often than one time in four, the call is profitable in the long run.\n\nThe same information as a ratio: you’re getting €150 (pot plus bet) for a €50 stake, i.e. **3:1**. Converting to a percentage: 1/(3+1) = 25%. Both notations are equivalent – get comfortable with whichever one you compute faster.\n\nThe crucial point: you do **not** have to win more often than you lose. At 3:1, 25% is enough, because the pot pays for your three losses with a single win.',
          tip: 'Drill the mindset: “What does the call cost me, and what’s in the pot afterwards?” – not “How strong is my hand?”. Pot odds are a question of price, not of strength.',
        },
        {
          heading: 'Step by Step Through an Example',
          body:
            'Take this turn situation: you hold A♥ Q♥ on K♥ 7♥ 2♠ 4♦ – the nut flush draw, 9 outs. The pot is €120 and your opponent bets €60.\n\n- **Step 1 – determine the price**: your call costs €60. Pot after the call: 120 + 60 + 60 = €240. Required equity: 60/240 = 25%.\n- **Step 2 – estimate your equity**: one card to come, so rule of 2: 9 × 2 = 18% (exact 19.6%).\n- **Step 3 – compare**: 19.6% equity against 25% required. Your equity falls short – on direct pot odds alone, the call is a mistake.\n\nThis three-step routine – price, equity, compare – is the backbone of every call decision. With a little practice it takes less than five seconds.\n\nImportant: “fold by direct pot odds” isn’t always the final word. If you can win additional bets after hitting your flush, those future winnings improve your effective price – that’s the implied odds of the next lesson. But the direct calculation is always the starting point: only once you know how big the gap is can you judge whether future winnings can realistically close it.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'Required Equity by Bet Size',
          body:
            'Because bet sizes are almost always framed relative to the pot, you can simply memorize the required equity for the standard sizes – then the math at the table disappears entirely.\n\nThe derivation, using a half-pot bet: with pot P, your opponent bets P/2. You call P/2; the final pot is P + P/2 + P/2 = 2P. Required equity: (P/2) / 2P = 25%.\n\nTwo observations are worth making. First, the required equity grows **more slowly** than the bet size – a 2x-pot bet doesn’t demand twice as much equity as a pot-sized bet, but 40% instead of 33.3%. Second, even big bets are never an automatic fold: against 2x pot you need 40% – a strong combo draw brings that.\n\nThe flip side applies to you as the aggressor: the bigger your bet, the more equity you force your opponent’s draws to bring. A 1/3-pot bet gives every flush draw a profitable call; a pot-sized bet puts it to a real decision.',
          table: {
            headers: ['Bet size', 'Pot odds', 'Required equity'],
            rows: [
              ['1/3 pot', '4:1', '20%'],
              ['1/2 pot', '3:1', '25%'],
              ['2/3 pot', '2.5:1', 'about 28.6%'],
              ['3/4 pot', '2.33:1', '30%'],
              ['Pot', '2:1', 'about 33.3%'],
              ['2x pot', '1.5:1', '40%'],
            ],
          },
        },
        {
          heading: 'Deciding: Equity vs. Price',
          body:
            'Now you put both tools together: counting outs and the rule of 2 and 4 give you your equity, the pot-odds table gives you the price. If your equity is above the required threshold, the call is profitable; if it’s below, you fold – or you check whether implied odds close the gap.\n\nA few reference cases for the turn (one card to come):\n\n- **Flush draw (about 19.6%)**: calling a 1/3-pot bet (20% required) is essentially break-even; against anything bigger you need implied odds.\n- **OESD (about 17.4%)**: a similar picture – only small bets are directly callable.\n- **Gutshot (about 8.7%)**: nowhere near profitable even against 1/3 pot; without massive implied odds, folding is standard.\n\nOn the flop against an all-in, the picture flips because the rule of 4 applies: a flush draw with 35% profitably calls any bet up to pot-sized (33.3% required), and a 12-out draw with 45% is a call against almost any sizing.\n\nRemember that a fold by pot odds isn’t a lost battle but a won calculation: every losing call you avoid is money that stays in your stack.',
          example:
            'Turn, pot €90, opponent bets €90 (pot-sized, 33.3% required). You hold a flush draw with about 19.6% equity. Straightforward fold – even good implied odds rarely close a gap of almost 14 percentage points.',
        },
      ],
      takeaways: [
        'Required equity = call / (pot after your call) – pot plus your opponent’s bet plus your own call.',
        'Memorize: 1/3 pot → 20%, 1/2 pot → 25%, 2/3 pot → about 28.6%, pot → about 33.3%, 2x pot → 40%.',
        'Decide in three steps: work out the price, estimate your equity (rule of 2 and 4), compare.',
        'You don’t have to win more often than you lose – at 3:1, 25% is enough, because one win pays for three losses.',
        'If your equity is just below the price, implied odds decide – if it’s far below, the fold is clear.',
      ],
      quiz: [
        {
          question: 'There’s €80 in the pot and your opponent bets €40. How much equity do you need for a profitable call?',
          options: ['20%', '25%', '33%', '40%'],
          correctIndex: 1,
          explanation:
            'Call €40, pot after the call: 80 + 40 + 40 = €160. Required equity: 40/160 = 25%.',
        },
        {
          question: 'Your opponent bets exactly pot-sized. What equity do you need to call?',
          options: ['25%', '28.6%', '33.3%', '50%'],
          correctIndex: 2,
          explanation:
            'With pot P and a bet of P, you call P into a final pot of 3P: P/3P = 33.3%. As a ratio: 2:1.',
        },
        {
          question: 'You’re getting pot odds of 4:1. What is the minimum equity you need?',
          options: ['15%', '20%', '25%', '30%'],
          correctIndex: 1,
          explanation: 'Conversion: 1/(4+1) = 20%. One win pays for four losses.',
        },
        {
          question:
            'Flush draw on the turn (about 20% equity), your opponent bets 1/2 pot (25% required). What’s the verdict on direct pot odds alone?',
          options: [
            'Clear call – you always call flush draws',
            'Fold – your equity is below the required threshold',
            'A raise is mathematically forced',
            'Call, because 20% is close enough to 25%',
          ],
          correctIndex: 1,
          explanation:
            'Taken directly, you’re about 5 percentage points short. Only good implied odds can justify the call – the pure pot-odds math says fold.',
        },
        {
          question: 'What required equity goes with a 2/3-pot bet?',
          options: ['20%', '25%', 'about 28.6%', 'about 33.3%'],
          correctIndex: 2,
          explanation:
            'Call 2/3 P into a final pot of P + 2/3 P + 2/3 P = 7/3 P: (2/3)/(7/3) = 2/7 ≈ 28.6%.',
        },
      ],
    },
    {
      id: 'm3-l4',
      title: 'Implied Odds & Reverse Implied Odds',
      duration: 8,
      intro:
        'Direct pot odds only look at the current pot – but poker is played across multiple streets. Implied odds factor in future winnings and explain why some draws are highly profitable despite “too bad” pot odds.',
      sections: [
        {
          heading: 'What Are Implied Odds?',
          body:
            '**Implied odds** are your effective odds once you count the bets you win **in addition** on later streets if your draw arrives. The pot you’re really playing for is often bigger than the pot sitting on the table right now.\n\nExample: on the turn there’s €100 in the pot and your opponent bets €50. Direct math: 50/200 = 25% required, but your flush draw only brings 19.6% – fold. If, however, you expect to win another €100 on average on the river after hitting your flush, you’re effectively playing for €300: 50/300 ≈ 16.7% required. Now the call is profitable.\n\nSo the honest question is: **how much more do I have to win on the river for the call to be worth it – and is that realistic?** In the example you can compute the minimum directly: you need roughly €55 in additional winnings for the numbers to work.\n\nBeware of self-deception: “implied odds” is the most popular excuse for bad calls. Future winnings aren’t wishful thinking – they’re an estimate that has to depend on the opponent, the stack depth, and the board.',
          tip: 'Work out the gap concretely: (total winnings required) minus (current pot plus bet). If you realistically can’t extract that amount from your opponent after an obvious flush river, your implied odds are an illusion.',
        },
        {
          heading: 'When Draws Are Profitable Despite Bad Pot Odds',
          body:
            'Good implied odds don’t appear on their own – they need concrete preconditions:\n\n- **Deep effective stacks**: you can only win later what’s still behind the stacks. If your opponent is nearly all-in, there are no implied odds.\n- **A disguised draw**: a gutshot that arrives with an innocent-looking card gets paid off far more often than the third flush card everyone can see. Disguised straights have the best implied odds, obvious flushes the worst.\n- **An opponent with a strong hand who’s willing to pay**: against an overpair or a set you get paid; against an opponent who’s only bluffing or gives up quickly, you don’t.\n- **Position**: in position you control the size of the river pot and can extract maximum value.\n\nThe more of these boxes are ticked, the bigger the gap between your equity and the direct pot odds is allowed to be. If none of them apply, the direct pot odds stand almost unchanged.\n\nFor scale: a narrowly missed price (a gap of 2–5 percentage points) is usually callable under good conditions. A gap of around 25 percentage points – say, a gutshot against a pot-sized bet – you close only in exceptional cases with very deep stacks.',
          example:
            'You call the turn with a disguised gutshot against a likely overpair, stacks 200bb deep. If your straight arrives on a harmless-looking card, you often win the entire remaining stack – exactly what makes the slightly unprofitable direct call worth it.',
        },
        {
          heading: 'Set Mining: the 15:1 Rule of Thumb',
          body:
            '**Set mining** – calling preflop with a small or medium pocket pair to flop a set – is the purest form of implied-odds poker. The numbers: with a pocket pair you flop a set or better about **11.8%** of the time, roughly once in 8.5 tries (7.5:1 against).\n\nYet the proven rule of thumb says: only call if the **effective stacks are at least about 15 times the call** (15:1; some recommend a more conservative 20:1). Why so much more than 7.5:1? Because three haircuts are needed: you won’t always get paid off in full after hitting (your opponent often has nothing or gives up), your set occasionally loses to a higher set or a draw that gets there, and sometimes your opponent already folds to your first bet on the flop.\n\nConcretely at 100bb: you can comfortably call an open raise to 3bb with 22–66 (3 × 15 = 45bb needed). A 3-bet to 12bb, however, is no longer a pure set-mining call: 12 × 15 = 180bb – more than the stack holds. Then the hand has to bring other value, or it goes in the muck.\n\nThe rule scales with stack depth: the deeper, the more profitable set mining becomes; the shorter the stacks, the faster the standard call turns into a standard fold.',
          cards: ['6d', '6c'],
        },
        {
          heading: 'Reverse Implied Odds: When Hitting Gets Expensive',
          body:
            '**Reverse implied odds** are the dark side of the coin: you lose additional money on later streets precisely **because** your hand arrives – as the second-best hand.\n\nThe classics are dominated draws:\n\n- **Small flush draw**: with 8♥ 7♥ you hit your flush just as often as with A♥ 5♥ – but if an opponent holds a higher flush draw at the same time, he wins the big pot and you pay for it. You win small (when nobody has anything) and lose big (when flush meets flush).\n- **The dumb end of the straight**: with 6♠ 5♠ on 7-8-9 you do have a made straight, but every T-6 and every J-T combination in your opponent’s hand turns you into the underdog in a fat pot.\n- **Dominated pairs**: KTo makes top pair on king-high boards – and then pays dearly against KQ, AK, and better. Even made hands can have reverse-implied-odds problems.\n\nThe consequence for your math: with nut draws you may count implied odds generously; with non-nut draws you have to trim them – and sometimes even budget for negative future amounts. That’s exactly why A♥ 5♥ and K♥ Q♥ are far better preflop candidates than 8♥ 7♥, even though all three hit the flush equally often: the difference isn’t in the hit rate but in what the hit is worth.',
          tip: 'Before every draw call, ask yourself: “If I hit – am I certain to be ahead?” Nut draws may hope to get paid off; dominated draws have to fear it.',
        },
      ],
      takeaways: [
        'Implied odds fold future winnings into the price: the pot that matters is the one you’re really playing for.',
        'Good implied odds need deep stacks, a disguised draw, an opponent willing to pay off, and ideally position.',
        'Set-mining rule of thumb: only call if the effective stacks are at least about 15 times the call.',
        'The 15:1 requirement sits far above the 7.5:1 against flopping a set because you don’t always get paid and sets occasionally lose.',
        'Reverse implied odds hit dominated draws: you win small pots and lose big ones – which is why nut draws are worth far more than their hit rate suggests.',
      ],
      quiz: [
        {
          question: 'What do implied odds describe?',
          options: [
            'The odds your opponent is getting on his draw',
            'The probability that your draw arrives by the river',
            'Expected additional winnings on later streets that improve your effective price for the call',
            'Pot odds after subtracting the rake',
          ],
          correctIndex: 2,
          explanation:
            'Implied odds extend the direct pot-odds math by the money you expect to win after hitting.',
        },
        {
          question:
            'What is the set-mining rule of thumb for a preflop call with a small pocket pair?',
          options: [
            'Effective stacks at least 5 times the call',
            'Effective stacks at least 10 times the call',
            'Effective stacks at least about 15 times the call',
            'Effective stacks at least 50 times the call',
          ],
          correctIndex: 2,
          explanation:
            'The common rule of thumb demands about 15:1 (up to a conservative 20:1) so that set mining pays despite incomplete payoffs.',
        },
        {
          question:
            'Why does the set-mining rule demand about 15:1 when the odds against flopping a set are only about 7.5:1?',
          options: [
            'Because the rule includes a fixed surcharge for the rake',
            'Because you don’t always get paid off in full on your set and it occasionally loses',
            'Because sets come in less often in practice than theory says',
            'Because the rule also has to cover turn and river sets',
          ],
          correctIndex: 1,
          explanation:
            'The surcharge compensates for two realities: your opponent often doesn’t pay off your set, and even a flopped set sometimes loses.',
        },
        {
          question:
            'You hold 8♥ 7♥ with a flush draw. Why are your implied odds worse than with A♥ 5♥ in the same situation?',
          options: [
            'Because your flush can lose to a higher flush – you win small pots and lose big ones',
            'Because 87s has fewer flush outs than A5s',
            'Because 87s hits the flush less often',
            'Because the ace increases the chance of hitting',
          ],
          correctIndex: 0,
          explanation:
            'Both hands hit equally often. But the non-nut flush has reverse implied odds: if a higher flush arrives at the same time, you lose a big pot.',
        },
        {
          question:
            'Effective stacks 40bb, an opponent raises to 4bb, you hold 3♠ 3♦. What does the set-mining rule of thumb say?',
          options: [
            'Call – sets almost always win big pots',
            'Fold – you’d need about 60bb effective (4bb × 15)',
            'Call – 40bb is easily enough for 15:1',
            'All-in, to maximize your implied odds',
          ],
          correctIndex: 1,
          explanation:
            '4bb × 15 = 60bb of effective stack depth required. With only 40bb, pure set mining is unprofitable – the hand goes in the muck (or needs another plan).',
        },
      ],
    },
    {
      id: 'm3-l5',
      title: 'Expected Value (EV)',
      duration: 9,
      intro:
        'Expected value is the common currency of all poker decisions: the average profit or loss of an action if you repeated it endlessly. Thinking in EV means you stop judging individual hands – and start judging decisions.',
      sections: [
        {
          heading: 'The EV Formula',
          body:
            '**Expected value (EV)** condenses a decision into a single number:\n\n**EV = (probability of winning × amount won) − (probability of losing × amount risked)**\n\nHere, the **amount won** is what you gain on success – for a call, the pot including your opponent’s bet but excluding your own money. The **amount risked** is what you lose on failure – for a call, exactly the call amount. The two probabilities add up to 100%.\n\nA quick example: you call €25 and win a €100 pot 25% of the time. EV = 0.25 × 100 − 0.75 × 25 = 25 − 18.75 = **+€6.25**. On average this call earns you €6.25 – not in this one hand, but averaged over many repetitions.\n\nEV and pot odds are two sides of the same calculation: the required equity from the pot-odds formula is exactly the point at which a call’s EV hits zero. Pot odds answer the yes/no question faster; the EV calculation additionally tells you **how** profitable or costly a decision is.',
          tip: 'Positive-EV decisions are called +EV, negative ones −EV. Your entire poker results are nothing but the sum of the EVs of your decisions plus short-term card luck – and only the first part is under your control.',
        },
        {
          heading: 'Worked Example 1: Calling with a Flush Draw on the Turn',
          body:
            'Situation: pot €100, your opponent bets €50. You hold the nut flush draw with one card to come – equity 9/46 ≈ 19.6%. Is the €50 call worth it?\n\n- **If you win**: 19.6% of the time you win the pot plus the bet = €150.\n- **If you lose**: 80.4% of the time you lose your €50 call.\n\nEV = 0.1957 × 150 − 0.8043 × 50 = 29.35 − 40.22 ≈ **−€10.90**.\n\nEach of these calls costs you almost eleven euros on average – regardless of whether the flush comes in on this particular hand. That matches the pot-odds view: 25% required, 19.6% available.\n\nThe cross-check is where it gets interesting: how big would the pot have to be for the same call to become +EV? The EV turns neutral at a win amount of about €205 (0.196 × 205 ≈ 0.804 × 50). So you’d need a good €55 in additional future winnings – exactly the number that appeared in the implied-odds lesson. EV math, pot odds, and implied odds are one single connected system.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'Worked Example 2: All-In Call with a Combo Draw',
          body:
            'Situation: on the flop there’s €120 in the pot, and your opponent goes all-in for his last €80. You hold a flush draw plus a gutshot – 12 outs, both cards guaranteed, so the rule of 4 with the correction applies: about 45% equity.\n\n- **If you win**: 45% of the time you win 120 + 80 = €200.\n- **If you lose**: 55% of the time you lose your €80 call.\n\nEV = 0.45 × 200 − 0.55 × 80 = 90 − 44 = **+€46**.\n\nEven though you lose the majority of the time, this call is highly profitable: the pot offers you more than your underdog status costs. That is the core message of EV thinking – “losing most of the time” and “playing profitably” are not mutually exclusive.\n\nFor comparison, the pot-odds view: you call €80 into a final pot of €280, so you need 80/280 ≈ 28.6% equity. At 45% you’re far above that. Both methods necessarily reach the same verdict; the EV number just makes visible how much money is at stake: refusing calls like this out of fear of losing gives away €46 per decision on average.',
        },
        {
          heading: 'Worked Example 3: the EV of a Bluff',
          body:
            'EV math isn’t just for calls. For a bluff, the probability of winning is your opponent’s **probability of folding**.\n\nSituation: on the river there’s €100 in the pot and your hand can’t win at showdown. You’re considering a €50 bluff.\n\nEV = (fold probability × 100) − (call probability × 50).\n\nThe break-even point is where the EV hits zero: F × 100 = (1 − F) × 50, so F = 50/150 = **33.3%**. In general: a bluff has to get through bet/(bet + pot) of the time – the same structure as the pot-odds formula, just from the aggressor’s perspective.\n\nIf your opponent folds 45% of the time, EV = 0.45 × 100 − 0.55 × 50 = 45 − 27.50 = **+€17.50**. A bluff that usually fails is still clearly profitable.\n\nRemarkable: your opponent only has to fold a third of the time even though you’re risking half the pot. Small bluffs need a low success rate, big bluffs a high one – a pot-sized bluff bet needs 50%. That’s why a realistic read on your opponent’s willingness to fold matters more than any arithmetic skill.',
          example:
            'Bluffing €50 into a €100 pot: break-even from 33.3% folds. If you estimate your opponent’s fold rate at 45%, the bluff earns €17.50 on average – even though it fails more often than it works.',
        },
        {
          heading: 'Think in EV, Not in Results',
          body:
            'The hardest lesson in poker math is psychological: **the result of a single hand says almost nothing about the quality of your decision.** The +€46 call from example 2 loses 55% of the time – and was still right every single time. The −€10.90 call from example 1 wins almost one time in five – and was still wrong every single time.\n\nIf you judge decisions by their results, you systematically learn the wrong lessons. This thought pattern has a name: **results-oriented thinking**. It makes you give up on correct draws because they missed three times in a row, or repeat bad calls because one of them happened to win.\n\nThe alternative: judge by the decision. After every big hand, don’t ask “did I win?” but “was the action +EV, given the information I had?”. In the long run – over tens of thousands of hands – your results converge toward the sum of your EVs; the variance washes out, the decision quality remains.\n\nThis mindset is also the foundation of responsible play: if you understand EV, you accept downswings as statistical normality, play only with a bankroll whose loss you can absorb, and don’t chase losses. In the short run, luck rules – in the long run, the math does.',
          tip: 'Build a small review routine: after each session, analyze two or three big pots purely on the question “was the decision right?” – and deliberately ignore how the hand turned out.',
        },
      ],
      takeaways: [
        'EV = (probability of winning × amount won) − (probability of losing × amount risked) – the average return of a decision over many repetitions.',
        'A call can be +EV even though you lose most of the time – what matters is the ratio of pot to stake.',
        'For bluffs: break-even fold rate = bet / (bet + pot); a half-pot bluff needs only 33.3% folds.',
        'Pot odds, implied odds, and EV are one system: the required equity is exactly the point where the EV hits zero.',
        'Judge decisions, not results – in the short run variance rules, in the long run the sum of your EVs does.',
      ],
      quiz: [
        {
          question:
            'You call €25 and win a €100 pot 25% of the time. What is the EV of the call?',
          options: ['−€6.25', '€0', '+€6.25', '+€25'],
          correctIndex: 2,
          explanation:
            'EV = 0.25 × 100 − 0.75 × 25 = 25 − 18.75 = +€6.25.',
        },
        {
          question: 'What does a negative EV mean for a call?',
          options: [
            'You are certain to lose this particular hand',
            'The call wins at most half the pot',
            'The call is only allowed with deep stacks',
            'In the long run, this call loses you money on average',
          ],
          correctIndex: 3,
          explanation:
            'EV is an average over many repetitions. A −EV call can win individual hands, but it costs money in the long run.',
        },
        {
          question:
            'You bluff €50 into a €100 pot (your hand never wins at showdown). How often does your opponent have to fold at minimum for the bluff to break even?',
          options: ['25%', '33.3%', '50%', '66.7%'],
          correctIndex: 1,
          explanation:
            'Break-even fold rate = bet / (bet + pot) = 50/150 = 33.3%.',
        },
        {
          question: 'You make a clearly profitable (+EV) call but lose the hand. How do you judge the decision?',
          options: [
            'The decision was right – EV judges decisions, not individual results',
            'The decision was wrong; the result proves it',
            'EV calculations only apply to all-in situations',
            'The decision was neutral, because luck and skill cancel out',
          ],
          correctIndex: 0,
          explanation:
            'Individual results are variance. Over many repetitions your results converge toward the EV – the decision stays right even when the hand loses.',
        },
        {
          question:
            'Pot €120, your opponent goes all-in for €80, and your combo draw has about 45% equity. What is the EV of your call?',
          options: ['−€44', '+€10', '+€46', '+€90'],
          correctIndex: 2,
          explanation:
            'EV = 0.45 × 200 − 0.55 × 80 = 90 − 44 = +€46. Despite being the underdog, the call is clearly profitable.',
        },
      ],
    },
    {
      id: 'm3-l6',
      title: 'Combinatorics & Probabilities',
      duration: 9,
      intro:
        'Counting combos turns vague guesses into precise hand reading: instead of “he could have AK”, you know how many AK combinations are even still possible. On top of that, you get the key probabilities every serious player should know.',
      sections: [
        {
          heading: 'Combos: the Basic Unit of Hand Reading',
          body:
            'A **combo** is one specific two-card combination. There are 1326 possible starting hands in total – but for hand reading, what matters most is how many combos each hand class has:\n\n- **Pocket pairs: 6 combos.** Four cards of one rank form six pairs (A♠A♥, A♠A♦, A♠A♣, A♥A♦, A♥A♣, A♦A♣).\n- **Unpaired hands: 16 combos.** 4 × 4 combinations of two different ranks – of which **4 suited** and **12 offsuit**.\n\nThis asymmetry is strategically enormous. AKo comes around three times as often as AKs. And a range like “AK or QQ” consists of 16 + 6 = 22 combos, so it’s AK almost three quarters of the time – a detail that flips many decisions against exactly that range.\n\nGet used to thinking about ranges in combo counts rather than hand names: “he has QQ+ and AK” means 6 + 6 + 6 + 16 = 34 combos. Only these numbers make claims like “he usually has an overpair” testable – and in this case, by the way, it would be false: 18 overpair combos (without AA it would be fewer, depending on the board) face 16 AK combos – it’s nearly a coinflip.',
          cards: ['As', 'Kh'],
        },
        {
          heading: 'Preflop Probabilities',
          body:
            'The preflop probabilities follow directly from the combo counts: probability = combos / 1326.\n\n- **One specific pair** (e.g. AA): 6/1326 = **0.45%**, i.e. once every 221 hands. Play two tables online for an hour and you’ll see aces about once on average.\n- **Any pocket pair**: 78/1326 = **5.9%**, roughly once every 17 hands.\n- **AK (suited or offsuit)**: 16/1326 = **1.2%**, about once every 83 hands. AA, KK, and AK together – the classic premium confrontation hands – add up to just over 2% of all starting hands.\n\nThese numbers ground your game in two directions. First, against impatience: premiums are rare, and anyone who tries to force them inevitably plays too many weak hands. Second, against paranoia: when you hold KK, a single opponent has AA only about 0.5% of the time – fear of the monster under the bed usually costs more than the monster itself.',
          table: {
            headers: ['Event', 'Probability', 'Odds'],
            rows: [
              ['A specific pair (e.g. AA)', '0.45%', '220:1'],
              ['Any pocket pair', '5.9%', 'about 16:1'],
              ['AK (suited or offsuit)', '1.2%', 'about 82:1'],
              ['Two suited cards', '23.5%', 'about 3.3:1'],
            ],
          },
        },
        {
          heading: 'The Key Flop Probabilities',
          body:
            'Postflop, too, the same numbers come up again and again – these four you should be able to recall instantly:\n\n- **Set or better with a pocket pair: about 11.8%** – roughly once in 8.5 flops. The basis of the set-mining math from lesson 4.\n- **A made flush with two suited cards: about 0.8%** – a genuine rarity. Anyone who plays suited hands for the made flush is playing them for the wrong reason.\n- **A flush draw with two suited cards: about 11%** – that is the real value of suited: regularly strong draws that can be played on aggressively.\n- **At least one pair with two unpaired cards: about 32%** – so you miss the flop two times out of three. This number explains why continuation bets work: your opponent usually misses too.\n\nA pattern stands out: direct bullseyes (flush, set) are rare, useful partial hits (draws, one pair) are common. That’s why postflop poker is rarely a duel of made monster hands – it’s mostly a fight between medium-strength hands, draws, and completely whiffed boards. Knowing the frequencies tells you how often pressure pays.',
          tip: 'Remember the pairing: 11.8% for a set (pocket pair) and 11% for a flush draw (suited) are almost identical – about one flop in nine. And one third for “any pair with unpaired cards” may be the most-used number in poker.',
        },
        {
          heading: 'Using Combos in Hand Reading',
          body:
            'The practical value of combinatorics: **card removal**. Every visible card – your hole cards, the board – strikes combos from your opponent’s range.\n\nA worked example: the board shows A♠ 7♦ 2♣ and you want to know how often your opponent holds top pair or better. Before the flop he had 16 AK combos. Now an ace sits on the board: 3 aces × 4 kings = **12 AK combos** remain. In the same way, AA shrinks from 6 to **3 combos** (from the three remaining aces), and 77 as well as 22 to **3 combos** each.\n\nSuppose his preflop range contains AA, AK, AQ, 77, and 22. On this flop he then holds: 3 + 3 + 3 = 9 set/overset combos against 12 + 12 = 24 top-pair combos. Top pair is almost three times as likely as a set – an insight that would be pure guesswork without counting.\n\nIf you hold an ace yourself, everything shifts once more: his AK combos drop to 8, his AA combos to 3 (or 1, if you also count the board ace). This is exactly how modern hand reading works: don’t guess – count how many combos of each hand category remain, and align your decision with those majorities.',
          example:
            'Board A♠ 7♦ 2♣, opponent’s range AA/AK/AQ/77/22: 9 set combos against 24 top-pair combos. Against a big bet, “he’s just got the set anyway” is measurably too pessimistic.',
        },
        {
          heading: 'Blockers: the Core Idea',
          body:
            'A **blocker** is a card in your hand that makes certain opposing combos impossible. It’s card removal thought of actively: you don’t just ask “what can he hold?” but “what can he **not** hold because of my cards?”.\n\nThe two most important applications:\n\n- **Choosing bluffs**: on a board with three hearts you hold the A♥ (without a second heart). That makes the nut flush impossible for every opponent – every opposing flush combo containing the A♥ is gone. Your bluffs on this board are more credible and more successful, because the strongest hand your opponent could call you with simply doesn’t exist. That’s exactly why hands like A♥ 5♠ are standard bluff candidates on heart boards.\n- **Fine-tuning calls and folds**: if you hold an ace, your opponent’s AA combos are cut in half from 6 to 3, and his AK combos drop from 16 to 12. With A♣ K♦ against a 4-bet, AA is simply rarer than it feels.\n\nImportant for starters: blockers shift probabilities by percentage points; they don’t conjure certainties. A blocker turns a close spot into a slightly better one – it doesn’t turn a bad bluff into a good one. But as a fine adjustment on top of solid fundamentals, blocker thinking belongs firmly in every advanced player’s repertoire.',
          cards: ['Ah', '5s'],
        },
      ],
      takeaways: [
        'Core combo counts: pocket pair 6, unpaired hand 16 (4 suited + 12 offsuit), 1326 starting hands in total.',
        'Key preflop probabilities: any pair 5.9%, AA 0.45% (1 in 221), AK 1.2%.',
        'Key flop probabilities: set with a pocket pair 11.8%, flush draw with suited cards about 11%, made flush only 0.8%.',
        'Card removal makes hand reading measurable: visible cards strike combos – on ace-high boards, 16 AK combos become 12.',
        'Blockers are active card removal: cards in your hand that make opposing combos impossible – ideal for choosing bluffs, but only as fine-tuning.',
      ],
      quiz: [
        {
          question: 'How many combos do AKs, AKo, and AK have in total?',
          options: ['4 / 12 / 16', '6 / 12 / 18', '4 / 8 / 12', '6 / 16 / 22'],
          correctIndex: 0,
          explanation:
            'Suited exists once per suit (4); offsuit is 4 × 4 − 4 = 12. Together, 16 combos for an unpaired hand.',
        },
        {
          question: 'How likely are you to be dealt AA?',
          options: [
            'About 1.2% (1 in 83)',
            'About 0.45% (1 in 221)',
            'About 5.9% (1 in 17)',
            'About 0.9% (1 in 110)',
          ],
          correctIndex: 1,
          explanation:
            '6 of the 1326 combos are AA: 6/1326 = 0.45%, i.e. once in 221 hands. 5.9% applies to any pair, 1.2% to AK.',
        },
        {
          question: 'The board shows A♠ 7♦ 2♣. How many AK combos can your opponent still hold?',
          options: ['16', '12', '9', '8'],
          correctIndex: 1,
          explanation:
            'One ace is visible on the board: 3 aces × 4 kings = 12 combos remain.',
        },
        {
          question: 'How often do you flop a set (or better) with a pocket pair?',
          options: ['About 6%', 'About 11.8%', 'About 17%', 'About 25%'],
          correctIndex: 1,
          explanation:
            'With two cards of the rank in your own hand, two outs remain in the deck – across three flop cards that comes to about 11.8%, roughly once in 8.5 flops.',
        },
        {
          question: 'How often do you flop a made flush with two suited cards?',
          options: ['About 0.8%', 'About 5%', 'About 11%', 'About 19.6%'],
          correctIndex: 0,
          explanation:
            'All three flop cards would have to come from the 11 remaining cards of your suit: only about 0.8%. The flush draw (about 11%) is the realistic value of suited hands.',
        },
        {
          question:
            'On a board with three hearts you hold the A♥ (without a second heart). What is the most important consequence?',
          options: [
            'You should never bluff, because you block the flush',
            'Nobody can hold the nut flush – your A♥ is a blocker and makes your bluffs more credible',
            'Your opponent has more flush combos in his range because of it',
            'Blockers only matter preflop',
          ],
          correctIndex: 1,
          explanation:
            'Your A♥ strikes every opposing nut-flush combo. Hands exactly like this are preferred bluff candidates on monotone boards.',
        },
      ],
    },
  ],
};

export default m3;
