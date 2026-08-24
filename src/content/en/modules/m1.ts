import type { Module } from '../../types';

const m1: Module = {
  id: 'm1',
  title: 'Fundamentals',
  subtitle: 'Rules, hand rankings, and the foundation for everything that follows',
  icon: '🎓',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm1-l1',
      title: 'How Texas Hold\'em Works',
      duration: 9,
      intro:
        'Texas Hold\'em takes five minutes to learn and a lifetime to master. This lesson walks you through one complete hand — from the blinds all the way to the showdown.',
      sections: [
        {
          heading: 'The Object of the Game',
          body:
            'Texas Hold\'em is played with a standard **52-card deck**. Each player is dealt two face-down cards — their **hole cards** — that belong to them alone. Over the course of the hand, up to five face-up shared cards (**community cards**) are dealt in the middle of the table, available to every player.\n\nYour final hand is always the **best five-card combination** you can make from those seven cards. You may use both hole cards, just one, or even none at all — in the last case, you\'re playing the board.\n\nThere are exactly two ways to win a pot:\n\n- You hold the best hand at **showdown**.\n- Every other player **folds** before showdown — then you win immediately, no matter what cards you hold.\n\nThat second path is why poker is a game of strategy rather than pure card luck: a large share of all pots is decided without a showdown. In the long run, the winner isn\'t the player who gets the best cards — it\'s the player who makes the better decisions with the cards they get.',
          tip: 'Think in decisions, not results, from day one. A well-played hand can lose, and a badly played hand can win — over the long run, only the quality of your decisions matters.',
        },
        {
          heading: 'The Blinds and the Dealer Button',
          body:
            'Without forced bets, everyone would simply wait for aces. That\'s what the **blinds** are for: the player to the left of the **dealer button** posts the **small blind** (SB), and the player to their left posts the **big blind** (BB) — typically the small blind is half the size of the big blind, e.g. 0.50/1 or 1/2.\n\nThe dealer button is a small disc marking who is formally the dealer. After every hand, the button moves one seat **clockwise**. The blinds rotate around the table with it, so every player pays them equally often — the game stays fair.\n\nThe blinds serve two purposes:\n\n- They seed a **starting pot** that\'s worth fighting for.\n- They force action: if you only ever wait, you bleed away your blinds round after round.\n\nThe size of the big blind is also poker\'s central unit of measurement. Stack sizes and bets are quoted in **big blinds (bb)** — a standard cash-game stack is 100bb. That lets you compare situations regardless of the actual money amounts involved.',
          example:
            'At a 1/2 table you sit down with 200 units — that\'s 100bb. The player to the left of the button posts 1 (the small blind), the next player posts 2 (the big blind). There are already 3 units in the pot before anyone has looked at their cards.',
        },
        {
          heading: 'Preflop: The First Betting Round',
          body:
            'Once every player has received their two hole cards, the first betting round begins: **preflop**. The action starts with the player to the left of the big blind — a position called **UTG** (under the gun). They have three options:\n\n- **Fold**: throw the cards away and give up the hand.\n- **Call**: match the big blind (also known as a **limp**).\n- **Raise**: increase the bet, usually to 2 to 3 times the big blind.\n\nThe action then continues clockwise until every player has either folded or matched the same amount. The big blind is a special case: they already have a full bet in the pot. If nobody has raised, they may **check** for free and see the flop; if there has been a raise, they too must call, raise, or fold.\n\nA core principle of sound strategy shows up right here: when you enter a pot preflop, you should usually do it with a raise, not a limp. A raise builds the pot with a strong hand, pushes out weaker hands, and hands you the **initiative** for the betting rounds to come.',
        },
        {
          heading: 'Flop, Turn, and River',
          body:
            'After the preflop round come three more streets, each with its own betting round:\n\n- **Flop**: the first three community cards are turned over at once.\n- **Turn**: the fourth community card is added.\n- **River**: the fifth and final community card completes the board.\n\nFrom the flop onward, the order changes: the action no longer starts with UTG but with the **first still-active player to the left of the button** — usually the small blind. The player on the button always acts last postflop, an enormous advantage we examine closely in Lesson 3.\n\nAs long as nobody has bet, you can **check** or make a **bet** yourself. Once a bet is on the table, your options are call, raise, or fold. A betting round ends when all active players have matched the same amount or everyone has checked.\n\nIn live poker, the dealer burns one card face-down before the flop, turn, and river (the **burn card**) — a historical safeguard against marked cards that changes nothing about the game itself.',
          example:
            'You hold A♥ K♥ and the flop comes K♠ 8♥ 3♦. You\'ve flopped top pair with the best kicker. The turn brings the 8♦, the river the 2♣ — your final hand is two pair: kings and eights with an ace kicker (K-K-8-8-A).',
        },
        {
          heading: 'The Showdown',
          body:
            'If at least two players are still in after the river betting round, the hand goes to **showdown**: the hole cards are turned face-up, and the best five-card hand wins the pot.\n\nThe order of showing follows a simple rule: whoever bet or raised last on the river (the last **aggressor**) shows first. If the river checked through, the first active player to the left of the button starts. If you see that you\'re beaten, you may throw your cards away unshown (**muck** them) — but doing so forfeits any claim to the pot.\n\nIf two or more players hold exactly equivalent five-card hands, the pot is split (**split pot**). Important: only the best five cards count — a sixth or seventh card can never serve as a tiebreaker.\n\nThe dealer then pushes the pot to the winner, the button moves one seat, and the next hand begins. Online, a complete hand often takes less than a minute — and that high frequency is exactly what makes poker so intensive to learn: you make hundreds of decisions every hour.',
          tip: 'If you\'re not sure who won: simply turn your cards face-up. The dealer (or the software) determines the best hand — when in doubt, never muck your own hand.',
        },
      ],
      takeaways: [
        'Your hand is always the best five-card combination of your two hole cards and the five community cards.',
        'There are two ways to win: hold the best hand at showdown, or get every opponent to fold.',
        'Blinds are forced bets that create action; the button and blinds rotate clockwise.',
        'Preflop, the action starts with UTG (left of the big blind); from the flop on, it starts with the first active player left of the button.',
        'Four betting rounds structure every hand: preflop, flop, turn, river — followed by the showdown.',
      ],
      quiz: [
        {
          question: 'Which player has to act first preflop?',
          options: [
            'The player on the button',
            'The small blind',
            'The player to the left of the big blind (UTG)',
            'The big blind',
          ],
          correctIndex: 2,
          explanation:
            'Preflop, the action starts with the player to the left of the big blind, known as UTG (under the gun). The blinds already have money in the pot and act last preflop.',
        },
        {
          question: 'Who opens the betting round after the flop if every player is still in the hand?',
          options: [
            'UTG, same as preflop',
            'The small blind, as the first active player to the left of the button',
            'The player who raised preflop',
            'The button, because they\'re the dealer',
          ],
          correctIndex: 1,
          explanation:
            'Postflop, the first still-active player to the left of the button always starts — usually the small blind. The button always acts last postflop.',
        },
        {
          question: 'You hold 7♣ 2♦ and the board reads A-K-Q-J-T in mixed suits. What hand do you show down?',
          options: [
            'Ace high with a 7 kicker',
            'The straight on the board — you play all five community cards',
            'Nothing at all, because your hole cards don\'t connect',
            'One pair, because at least one hole card has to play',
          ],
          correctIndex: 1,
          explanation:
            'Your hand is the best five-card combination out of seven cards. You may use both, one, or neither of your hole cards — here, you play the board (A-K-Q-J-T).',
        },
        {
          question: 'Why do blinds exist in the first place?',
          options: [
            'They reward the dealer for dealing',
            'They force action and make sure there\'s something to win in every pot',
            'They compensate for the disadvantage of the early positions',
            'They\'re a fee paid to the card room',
          ],
          correctIndex: 1,
          explanation:
            'Without blinds, everyone could wait for premium hands risk-free. The forced bets seed a starting pot and punish pure waiting.',
        },
        {
          question: 'All of your opponents fold to your bet on the turn. What happens?',
          options: [
            'You have to show your hand to claim the pot',
            'The pot is split between you and the last player to fold',
            'You win the pot immediately without showing your cards',
            'The hand still plays out to the river',
          ],
          correctIndex: 2,
          explanation:
            'When every opponent folds, you win the pot on the spot and never have to show your cards. That\'s the second way to win besides the showdown — and it\'s what makes bluffing possible in the first place.',
        },
      ],
    },
    {
      id: 'm1-l2',
      title: 'The Hand Rankings',
      duration: 10,
      intro:
        'You need to know the ten hand categories in your sleep — every decision at the table builds on them. This lesson shows you all the rankings, the kicker concept, and the traps beginners fall into most often.',
      sections: [
        {
          heading: 'The 10 Categories at a Glance',
          body:
            'Every poker hand falls into one of ten categories. The ranking order isn\'t arbitrary — it reflects **rarity**: the less likely a hand, the higher it ranks. A flush beats a straight because it comes around less often, not because it looks prettier.\n\nWithin each category, card ranks decide: an ace-high flush beats a king-high flush, a pair of aces beats a pair of kings. The suits (spades, hearts, diamonds, clubs) are **completely equal** — there is no suit ranking in poker.\n\nThe table shows all ten categories along with the approximate probability that your best five-card hand out of seven cards (that is, by the river in Hold\'em) lands in exactly that category. Above all, memorize the order in the middle of the ladder: **a full house beats a flush, a flush beats a straight, a straight beats three of a kind** — that\'s exactly where the most expensive mix-ups happen.',
          table: {
            headers: ['Rank', 'Hand', 'Example', 'Frequency by the river'],
            rows: [
              ['1', 'Royal flush', 'A-K-Q-J-T in one suit', '~0.003%'],
              ['2', 'Straight flush', '9-8-7-6-5 in one suit', '~0.03%'],
              ['3', 'Four of a kind (quads)', 'Q-Q-Q-Q-7', '~0.17%'],
              ['4', 'Full house', 'K-K-K-9-9', '~2.6%'],
              ['5', 'Flush', 'A-J-8-5-2 in one suit', '~3.0%'],
              ['6', 'Straight', '9-8-7-6-5, mixed suits', '~4.6%'],
              ['7', 'Three of a kind (trips/set)', '7-7-7-K-2', '~4.8%'],
              ['8', 'Two pair', 'J-J-8-8-A', '~23.5%'],
              ['9', 'One pair', 'T-T-A-7-4', '~43.8%'],
              ['10', 'High card', 'A-Q-9-6-3', '~17.4%'],
            ],
          },
        },
        {
          heading: 'The Monsters: Royal Flush Down to Full House',
          body:
            'At the very top sits the **royal flush**: A-K-Q-J-T of the same suit — the best possible hand, unbeatable and extremely rare. Strictly speaking, it\'s just the highest **straight flush**: five consecutive cards of one suit. A straight flush like 9♥ 8♥ 7♥ 6♥ 5♥ beats everything except a higher straight flush.\n\n**Four of a kind** (quads) is all four cards of one rank plus a side card. If two players hold quads — possible when the quads are on the board — the side card decides.\n\nA **full house** combines three of a kind with a pair, e.g. K-K-K-9-9, read as kings full of nines. When two full houses collide, the trips are compared first, then the pair: K-K-K-2-2 beats Q-Q-Q-A-A, because the kings in the trips outrank the queens — the aces in the pair only come into play when the trips are identical.\n\nThese hands are so strong that the question is rarely whether you\'ll win, but how you get the pot **as big as possible**. Still, remember: even monsters lose occasionally — flush over flush or full house over full house is among the most expensive situations in poker (known as a cooler).',
          cards: ['As', 'Ks', 'Qs', 'Js', 'Ts'],
          example:
            'Board: K♦ K♣ 9♠ 9♦ 2♥. Player A holds K♥ Q♥ (a full house, kings full of nines); Player B holds 9♣ 8♣ (a full house, nines full of kings). A wins clearly — the higher trips decide, not the pair.',
        },
        {
          heading: 'The Middle of the Ladder: Flush, Straight, Three of a Kind',
          body:
            'A **flush** is five cards of the same suit that don\'t run consecutively. When two flushes meet, the highest card decides; if that ties, the second-highest, and so on. An ace-high flush (the **nut flush**) is unbeatable among flushes.\n\nA **straight** is five consecutive cards in mixed suits. The ace is flexible: it makes the highest straight, A-K-Q-J-T (**Broadway**), and the lowest straight, 5-4-3-2-A (the **wheel**). What doesn\'t work: a straight around the corner like K-A-2-3-4 — the ace plays either at the very top or the very bottom, never in the middle.\n\n**Three of a kind** (three cards of one rank) goes by two names in Hold\'em, and you should know both. A **set** is what you make with a pocket pair plus a matching board card — strong and well hidden. **Trips** happen when a pair is on the board and you hold the third card — also strong, but visible to everyone and vulnerable to an opponent holding the same trips with a better kicker.\n\nYou need instant recall of the order of these three categories: **a flush beats a straight, a straight beats three of a kind.** Both mix-ups regularly cost beginners entire stacks.',
          cards: ['Ad', '2c', '3h', '4s', '5d'],
          tip: 'A memory hook for the middle of the ladder: the harder to make, the higher the rank. Five suited cards are rarer than five consecutive ones — that\'s why the flush outranks the straight.',
        },
        {
          heading: 'The Kicker Decides',
          body:
            'The most common showdown situation is unspectacular: both players hold the same pair. Then the **kicker** decides — the highest side card that makes it into the five-card hand.\n\nAn example: the board is A♣ 8♠ 6♥ 4♦ 2♣. Player A holds A♥ K♦, Player B holds A♦ Q♦. Both have a pair of aces, but the complete hands read A-A-K-8-6 versus A-A-Q-8-6. The king beats the queen — Player A wins. This is exactly why hands like A♥ K♦ are so much more valuable than A♦ 7♣: when the ace hits, you win the big pair-versus-pair battles with the better kicker. We say A7 is **dominated** by AK.\n\nThe concept has an important limit, though: only **five cards** ever count. If your kicker doesn\'t make it into the best five-card hand, it\'s worthless — it gets crowded out by the board. So at showdown, never just check who has the higher pair. Build both complete five-card hands and compare them card by card. That discipline protects you from misreads that even experienced players still make.',
          cards: ['Ah', 'Kd', 'Ad', 'Qd'],
        },
        {
          heading: 'Split Pots and Classic Mix-Ups',
          body:
            'If the best five-card hands are exactly equal, the pot is split. That happens more often than beginners expect — especially when the board equalizes the hands. Example: board A♠ K♥ Q♦ J♣ 3♠, Player A holds A♥ 2♥, Player B holds A♦ 9♦. Both play A-A-K-Q-J — the 2 and the 9 don\'t make the best five cards. Split pot, even though B appears to hold the better kicker.\n\nThe most common beginner mistakes at a glance:\n\n- **Ranking a straight over a flush**: wrong — the flush wins, because it\'s rarer.\n- **Ranking two pair over three of a kind**: wrong — three of a kind wins.\n- **Inventing a suit ranking**: a spade flush supposedly beats a heart flush — wrong, only the card ranks decide.\n- **A straight around the corner**: K-A-2-3-4 is not a straight.\n- **Counting six cards**: two pair plus a third pair is still just two pair — the best two count, plus the highest kicker.\n\nAt every showdown, take the two seconds to read out both hands cleanly as five cards. That routine builds the certainty every further strategy rests on.',
          example:
            'Board 7♥ 7♦ 5♣ 5♠ Q♦. You hold 9♠ 9♣. Your hand is NOT three pair but two pair: nines and sevens with a queen kicker (9-9-7-7-Q). The fives drop out of the reckoning entirely.',
        },
      ],
      takeaways: [
        'The rankings reflect rarity: a full house beats a flush, a flush beats a straight, a straight beats three of a kind.',
        'Suits are equal — when categories match, only the card ranks decide.',
        'The kicker settles battles between equal pairs, but only counts if it makes the best five cards.',
        'The ace plays high (Broadway A-K-Q-J-T) and low (the wheel 5-4-3-2-A), but never around the corner.',
        'At showdown, always compare complete five-card hands — never more, never fewer.',
      ],
      quiz: [
        {
          question: 'Your opponent shows a straight (T-9-8-7-6); you hold a king-high flush. Who wins?',
          options: [
            'Your opponent — straights beat flushes',
            'You — a flush beats any straight',
            'Split pot, both hands are equally strong',
            'It depends on which suit your flush is',
          ],
          correctIndex: 1,
          explanation:
            'The flush ranks above the straight because five suited cards are rarer than five consecutive ones. The suit of your flush is irrelevant — suits have no ranking.',
        },
        {
          question: 'Board: A♣ 8♠ 6♥ 4♦ 2♣. Player A holds A♥ K♦, Player B holds A♦ Q♦. Who wins the pot?',
          options: [
            'Player B, because they also had flush chances',
            'Split pot — both have a pair of aces',
            'Player A — with equal pairs the kicker decides, and K beats Q',
            'Player B, because diamonds rank above hearts',
          ],
          correctIndex: 2,
          explanation:
            'Both hold a pair of aces, so the kicker decides: A-A-K-8-6 beats A-A-Q-8-6. Missed draws and suits play no role at showdown.',
        },
        {
          question: 'You hold 4♠ 3♠ and the board reads K♦ A♥ 2♣ 5♦ 9♠. What hand do you have?',
          options: [
            'Just ace high',
            'A straight: 5-4-3-2-A (the wheel)',
            'A straight around the corner: K-A-2-3-4',
            'A pair of threes',
          ],
          correctIndex: 1,
          explanation:
            'The ace can play as the lowest card, forming the wheel — the lowest straight — with 2-3-4-5. A straight around the corner (K-A-2-3-4), on the other hand, doesn\'t exist.',
        },
        {
          question: 'Board: A♠ K♥ Q♦ J♣ 3♠. Player A holds A♥ 2♥, Player B holds A♦ 9♦. What happens at showdown?',
          options: [
            'Player B wins, because the 9 beats the 2 as a kicker',
            'Split pot — both play A-A-K-Q-J, and the second hole card doesn\'t count',
            'Player A wins, because they called first',
            'Player B wins with two pair',
          ],
          correctIndex: 1,
          explanation:
            'Only the best five cards count: both players play A-A-K-Q-J. The 9 and the 2 don\'t make the cut — the kicker is crowded out by the board, and the pot is split.',
        },
        {
          question: 'Two full houses collide: K-K-K-2-2 against Q-Q-Q-A-A. Which one wins?',
          options: [
            'Q-Q-Q-A-A, because aces are the highest pair',
            'K-K-K-2-2, because the trips are compared first',
            'Split pot, both are full houses',
            'It depends on the kickers',
          ],
          correctIndex: 1,
          explanation:
            'With full houses, the trips are compared first: kings beat queens. The pair only serves as a tiebreaker between identical trips. There is no kicker in a full house — it already consists of five cards.',
        },
        {
          question: 'What is the difference between a set and trips?',
          options: [
            'A set ranks higher than trips',
            'Set: a pocket pair hits the board; trips: a pair is on the board and you hold the third card',
            'Trips are four cards of the same rank',
            'There is no difference — both terms are defined identically',
          ],
          correctIndex: 1,
          explanation:
            'Both are three of a kind and rank identically. A set (pocket pair + board card) is much better hidden, however, while trips are visible to everyone and can run into kicker trouble.',
        },
      ],
    },
    {
      id: 'm1-l3',
      title: 'Position Is Power',
      duration: 8,
      intro:
        'No single factor affects your win rate as much as position. Once you understand why the button is worth its weight in gold, you\'ll be playing a different game from here on out.',
      sections: [
        {
          heading: 'The Positions at a 6-Max Table',
          body:
            'At a 6-max table (up to six players), every seat has a name relative to the dealer button:\n\n- **UTG** (under the gun): acts first preflop — also called the **lojack (LJ)**.\n- **HJ** (hijack): one seat before the cutoff.\n- **CO** (cutoff): one seat before the button.\n- **BTN** (button): the dealer — always acts last postflop.\n- **SB** (small blind): left of the button, posts the half forced bet.\n- **BB** (big blind): posts the full forced bet.\n\nSince the button moves on every hand, you rotate through all the positions in turn. Your position determines two things: **when** you have to act and **how many players** still hold cards after you.\n\nUTG speaks first preflop while five opponents are still waiting — so you should play correspondingly **tight** there. The button speaks third-from-last preflop and last postflop, with only the two blinds behind — by far the most hands can be played profitably from that seat. Broadly, we distinguish **early position** (UTG), **middle position** (HJ), **late position** (CO, BTN), and the **blinds** as a special case.',
          table: {
            headers: ['Position', 'Abbreviation', 'Preflop order', 'Character'],
            rows: [
              ['Under the gun / lojack', 'UTG/LJ', '1st', 'early — play tight'],
              ['Hijack', 'HJ', '2nd', 'middle'],
              ['Cutoff', 'CO', '3rd', 'late — open wider'],
              ['Button', 'BTN', '4th', 'best position'],
              ['Small blind', 'SB', '5th', 'worst position'],
              ['Big blind', 'BB', '6th (closes the action)', 'defends the blind'],
            ],
          },
        },
        {
          heading: 'The 9-Max Table (Full Ring)',
          body:
            'At a full-ring table with nine players, three additional early positions come before the lojack: **UTG**, **UTG+1**, and **UTG+2**. After that, LJ, HJ, CO, BTN, SB, and BB follow as usual.\n\nThe principle stays identical; only the weights shift. If you open UTG at a 9-max table, you still have **eight** opponents behind you, any of whom can hold a strong hand. The chance that at least one of them wakes up with a premium like QQ+ or AK is considerably higher than at a 6-max table with five opponents. That\'s why the early positions\' opening ranges are even tighter in full ring.\n\nA useful conversion principle: the last six positions at a 9-max table (LJ through BB) correspond strategically almost exactly to a complete 6-max table. In a sense, a 6-max player permanently sits in a game where the three tightest positions have already folded — which is exactly why 6-max is the more active, more aggressive format.\n\nFor your learning, that means the position logic you internalize here transfers one-to-one to any table size. All that changes is how many players are lurking behind you.',
          tip: 'Before every decision, quickly count how many players still act after you. That single number is the fastest guide to how strong your hand needs to be.',
        },
        {
          heading: 'In Position vs. Out of Position',
          body:
            'You are **in position (IP)** when you act **after** your opponent in the postflop betting rounds. **Out of position (OOP)** means you have to act first. That difference holds for the entire hand — whoever is IP postflop is IP on the flop, turn, and river.\n\nThe advantages of acting last are concretely measurable:\n\n- **More information**: you see your opponent\'s check or bet before you have to commit. They have to guess — you know.\n- **Pot control**: you decide whether a street ends with a bet or for free. If your opponent checks, you can take a free card with a draw or keep the pot small with a marginal hand.\n- **Better bluffs**: if your opponent shows weakness with a check, you can apply pressure profitably.\n- **Maximizing value**: with strong hands, you can slide in one more bet at the end of every street.\n\nOne important subtlety concerns the blinds: the small blind acts late preflop but is **OOP against every player postflop** — that\'s why the SB is the worst position at the table. The big blind is also OOP against everyone except the SB, but as compensation gets to close the preflop round and already has a bet in the pot.',
          example:
            'You hold 8♥ 7♥ on the button and the flop comes K♠ 6♥ 5♦ — an open-ended straight draw. Your opponent checks. In position, you get to choose: see the turn for free or bet as a semi-bluff. Out of position with the same hand, you\'d have to act first — and after checking, often pay off a bet with no idea where you stand.',
        },
        {
          heading: 'Why the Button Is the Best Position',
          body:
            'The button combines every positional advantage: it is **guaranteed to act last postflop**, no matter who else is in the hand. Preflop, only the two blinds sit behind it — two players who had to put money into the pot with no initiative of their own and who always play OOP postflop.\n\nThe consequences are measurable: in the databases of virtually every winning player, the button is the **most profitable position**, well clear of the cutoff. The blinds, on the other hand, are long-term losing positions for every player in the world — the forced bets and the permanent positional disadvantage can only be softened, never fully offset. Winning means earning more in the other positions than the blinds cost you.\n\nThat\'s why a solid 6-max player opens roughly **40–50%** of all hands from the button, but only about **15–20%** from UTG. The same hand switches category depending on the seat: K♦ 9♦ is a clear fold from UTG and a standard raise on the button.\n\nThe information edge compounds like interest: on each of the three postflop streets, you make your decision knowing more than your opponent. Over hundreds of hands, these small edges add up to a large share of your total win rate.',
          tip: 'If you remember only one rule from this lesson: play considerably more hands on the button than anywhere else — and considerably fewer from the early positions and the small blind.',
        },
      ],
      takeaways: [
        'Position determines when you act and how many opponents still hold cards after you.',
        'Being in position (acting after your opponent) brings more information, pot control, and better bluffing and value opportunities.',
        'The button is the most profitable position: always last to act postflop, with only the blinds behind it preflop.',
        'The small blind is the worst position — out of position against every opponent postflop.',
        'The same hand can be a fold or a raise depending on position: play tight early, open up your range late.',
      ],
      quiz: [
        {
          question: 'Why is the button considered the best position at the table?',
          options: [
            'Because the button deals the cards and sees them first',
            'Because it always acts last postflop and has only the blinds left behind it preflop',
            'Because it doesn\'t have to pay blinds and therefore plays for free',
            'Because it gets to act first preflop',
          ],
          correctIndex: 1,
          explanation:
            'The button is guaranteed to act last in every postflop betting round and has only the two blinds behind it preflop. That permanent information edge makes it the most profitable position.',
        },
        {
          question: 'You\'re in the small blind and call a raise from the button. What is your situation postflop?',
          options: [
            'You\'re in position, because you acted after UTG preflop',
            'You\'re out of position and have to act first on the flop, turn, and river',
            'Position switches on every street',
            'You act first only on the flop; after that, the button does',
          ],
          correctIndex: 1,
          explanation:
            'Postflop, the first active player to the left of the button always starts — in the blind-versus-button battle, that\'s you. That disadvantage lasts the entire hand and makes the SB the worst position.',
        },
        {
          question: 'What, concretely, is the core of the information advantage when you\'re in position?',
          options: [
            'You\'re allowed more time for your decisions',
            'You see your opponent\'s action (check or bet) before you have to commit yourself',
            'You\'re dealt your cards later',
            'Your bets count for more, because they close the action',
          ],
          correctIndex: 1,
          explanation:
            'In position, you react to your opponent\'s action instead of having to guess. A check often reveals weakness, a bet often strength — you make every decision knowing more.',
        },
        {
          question: 'Why should you play far fewer hands from UTG at a 6-max table than from the button?',
          options: [
            'Because UTG has to post bigger bets',
            'Because five opponents still act behind you, any of whom can hold a strong hand — and you\'re usually OOP postflop',
            'Because UTG statistically gets dealt worse cards',
            'Because the rules only allow certain hands from UTG',
          ],
          correctIndex: 1,
          explanation:
            'UTG speaks first and has the maximum number of opponents behind. The more players still to act, the likelier a strong hand wakes up — and without the positional edge, you need more substance yourself.',
        },
        {
          question: 'Which statement about the blinds is correct?',
          options: [
            'Good players turn a long-term profit in the big blind',
            'The blinds are long-term losing positions for virtually every player — the goal is to lose as little as possible there',
            'The small blind is better than the big blind, because it pays less',
            'The blinds are neutral, because the forced bets even out over the orbit',
          ],
          correctIndex: 1,
          explanation:
            'A forced bet plus a permanent positional disadvantage makes the blinds losing positions for everyone. The money is won in the other positions — in the blinds, it\'s about damage control.',
        },
      ],
    },
    {
      id: 'm1-l4',
      title: 'Actions & Betting Rules',
      duration: 9,
      intro:
        'Check, bet, call, raise, fold, all-in — six actions that every poker hand is made of. This lesson lays out the betting rules of No-Limit Hold\'em precisely, including the minimum raise and side pots.',
      sections: [
        {
          heading: 'The Basic Actions',
          body:
            'When the action is on you, your options depend on whether someone has already bet before you:\n\n**No bet yet this round:**\n\n- **Check**: you pass — no chips go in, and the action moves on. If everyone checks, the round ends for free.\n- **Bet**: you\'re the first to put chips into the round and open the betting.\n\n**A bet is already in front of you:**\n\n- **Fold**: you give up the hand. Any chips you\'ve already put in stay in the pot.\n- **Call**: you match the bet and stay in the hand.\n- **Raise**: you increase the bet — your opponents have to respond again.\n\nOn top of these comes the **all-in**: you bet all of your remaining chips. Under the **table stakes** principle, you can never lose more than what\'s in front of you at the start of the hand — nobody can buy you out of a hand with a giant bet; you can always call for your stack.\n\nTwo formalities are worth knowing for live play: verbal declarations (e.g. raise to 20) are **binding**. And chips must go in with a single motion — if you go back for more (a **string bet**), the raise doesn\'t count and only the first amount stands.',
          tip: 'Live, always announce clearly what you\'re doing first (call, or raise to amount X), and only then push in the chips. That prevents string-bet problems and misunderstandings.',
        },
        {
          heading: 'The Minimum Raise in No-Limit',
          body:
            'In no-limit, you may bet any amount at any time — right up to your entire stack. There are lower bounds, though:\n\n- The **minimum bet** is one big blind.\n- A **raise** must be at least as large as the last bet or raise of the same betting round.\n\nThat sounds abstract, but with numbers it\'s simple. Blinds 1/2: the big blind (2) is the first bet of the preflop round. The minimum raise adds another 2, making it **4** in total. If someone then raises to 6 (an increase of 4), the next raise must go up by at least 4 — that is, to at least **10**. What always counts is the **raise increment**, not the total amount.\n\nA special rule covers short all-ins: if a player moves all-in without reaching a full minimum raise, it doesn\'t count as a real raise. Players who have already acted may then only call or fold — the betting round is not reopened for them.\n\nIn practice, you\'ll rarely bet the minimum. Common sizes preflop are an open to 2.2 to 3 times the big blind; postflop, bets are scaled to the pot — roughly one third of it up to a full pot. You still need to know the minimum rules — they determine which actions are legal in the first place.',
          example:
            'Blinds 1/2. Player A raises to 7 (an increase of 5). Player B wants to 3-bet: the raise must add at least 5, so it has to be at least 12. A raise to 10 would be against the rules and would be corrected in a live game.',
        },
        {
          heading: 'No-Limit, Pot-Limit, Fixed-Limit',
          body:
            'The betting structure fundamentally shapes the character of a game:\n\n- **No-limit (NL)**: any amount at any time, up to the entire stack. Maximum pressure, maximum punishment for mistakes — the standard for Texas Hold\'em and the subject of this app.\n- **Pot-limit (PL)**: the maximum bet is capped at the current pot size. For a raise, the rule is: first put your call into the pot mentally, then you may raise by that new pot. Example: the pot holds 10, your opponent bets 10. After your imagined call, the pot would be 30 — so you may raise by up to 30, putting in a maximum of 40 in total. Pot-limit today is mainly the structure of Omaha (PLO).\n- **Fixed-limit (FL)**: bets and raises come in fixed sizes. In a 2/4 game, betting preflop and on the flop moves in increments of 2, on the turn and river in increments of 4; each round is usually capped at one bet plus three raises. Fixed-limit used to be dominant and is a niche format today.\n\nFor you as a learner, one thing matters most: in no-limit, every single decision can cost or win your entire stack. That\'s exactly why solid fundamentals are so valuable here — and exactly why we focus on NL Hold\'em.',
        },
        {
          heading: 'All-Ins and Side Pots',
          body:
            'What happens when one player is all-in but the others want to keep playing? **Side pots** are created — it sounds complicated but follows one simple rule: **each player can only win, from each opponent, as much as they put in themselves.**\n\nAn example with three players: A has 40 left, B and C have 200 each. A moves all-in for 40, B and C call. The **main pot** holds 120 (3 × 40) — that\'s the only pot A is playing for. If B and C put in more chips afterwards, those go into a **side pot** that only B and C can win. If B bets 60 on the turn and C calls, the side pot holds 120.\n\nAt showdown, the pots are settled from the outside in: first the side pot is compared between B and C, then the main pot between all three. So it\'s entirely possible that A wins the main pot with the best hand while B collects the side pot with the second-best hand.\n\nWith multiple all-ins at different stack sizes, multiple side pots form accordingly — the principle stays the same, and the dealer or software splits everything correctly and automatically. You don\'t have to calculate it live, but you should understand **who is playing for which money**: it shapes how the remaining players should play against one another.',
          example:
            'A (stack 40) is all-in on the flop; B and C keep playing with full stacks. On the river, A holds the best hand, B the second-best. Result: A wins the main pot (120), and B wins the entire side pot — even though B\'s hand is worse than A\'s.',
        },
        {
          heading: 'Thinking Betting Rounds Through to the End',
          body:
            'A betting round only ends when every active player has responded to the last bet or raise and everyone has the same amount in for the round — or is all-in. Two consequences of this trip up beginners regularly:\n\nFirst: a call only closes the round if nobody may act after it. If you call a raise preflop, a player behind you can raise again (**3-bet**) — then the action is back on you, and you must call the difference, raise yourself, or give up the chips you\'ve already invested.\n\nSecond: preflop, the big blind has what\'s called the **option**. If everyone has only called, the BB may check or raise — the round isn\'t over until they\'ve decided.\n\nFinally, a look at etiquette that doubles as a rule: act only when it\'s **your turn**. Folding or betting out of turn gives away information and influences the hand unfairly. When you fold, slide your cards face-down toward the dealer, and don\'t comment on live hands — including which cards you threw away. These standards instantly mark you as a serious player at any live table and keep the game fair for everyone.',
          tip: 'Burn the difference between a bet and a raise into memory: a bet opens the betting in a round; a raise increases an existing bet. Preflop, the big blind counts as the first bet — which is why the first increase preflop is already a raise.',
        },
      ],
      takeaways: [
        'No bet in front of you: check or bet. Facing a bet: fold, call, or raise.',
        'A raise must be at least as large as the last bet or raise — the raise increment counts, not the total amount.',
        'Table stakes: you can never lose more than your stack — a short all-in never takes away your right to call.',
        'No-limit allows any amount, pot-limit at most the pot (after the imagined call), fixed-limit only fixed increments.',
        'Side pots govern all-in situations: from each opponent, you can win at most what you put in yourself.',
      ],
      quiz: [
        {
          question: 'Blinds 1/2, an opponent has raised to 6. What is the minimum total your raise must reach?',
          options: [
            '8 — twice the big blind on top',
            '10 — the last increase was 4, so at least 6 + 4',
            '12 — double the last bet',
            '7 — one more big blind is always enough',
          ],
          correctIndex: 1,
          explanation:
            'Your opponent raised from 2 to 6, an increment of 4. Your raise must add at least the same increment on top: 6 + 4 = 10.',
        },
        {
          question: 'The pot holds 10 and your opponent bets 10. What is the maximum total you may put in, in a pot-limit game?',
          options: [
            '20 — double their bet',
            '30 — the pot including their bet',
            '40 — call 10, then raise by the new pot of 30',
            'Any amount — pot-limit only caps the first bet',
          ],
          correctIndex: 2,
          explanation:
            'The pot-limit calculation: first put in the call mentally (pot: 10 + 10 + 10 = 30), then you may raise by that pot. In total, a 10 call + a 30 raise = 40.',
        },
        {
          question: 'Player A (stack 40) moves all-in; B and C (200 each) call and bet more chips on the turn. Who can win which pot?',
          options: [
            'A can win everything if they hold the best hand',
            'A plays only for the main pot (3 × 40); the further bets form a side pot for B and C only',
            'All three play for one shared pot, and A owes the difference',
            'B and C are not allowed to keep betting after the all-in',
          ],
          correctIndex: 1,
          explanation:
            'From each opponent, you can win at most what you put in yourself. A is in the main pot (120) for 40; everything beyond that goes into the side pot, which only B and C play for.',
        },
        {
          question: 'When are you allowed to check?',
          options: [
            'Whenever it\'s your turn',
            'Only preflop as the big blind',
            'When no bet has been made before you in the current betting round',
            'Only when every opponent has checked before you and you\'re on the button',
          ],
          correctIndex: 2,
          explanation:
            'Checking means passing without a bet — that\'s only possible while nobody has bet in the current round. Facing a bet, your only options are fold, call, or raise. The BB\'s preflop check is a special case of the same rule: their blind already counts as a bet.',
        },
        {
          question: 'What does the table-stakes principle mean?',
          options: [
            'You may buy more chips during a hand if your stack runs out',
            'You can never lose more than your stack at the start of the hand — and can always call for your stack',
            'The minimum buy-in is always 100 big blinds',
            'All players must start with equally sized stacks',
          ],
          correctIndex: 1,
          explanation:
            'Table stakes limits your risk to the chips in front of you. A bet larger than your stack can be called all-in for less — nobody can buy you out of a hand.',
        },
      ],
    },
    {
      id: 'm1-l5',
      title: 'Variants & Formats',
      duration: 8,
      intro:
        'Cash game, tournament, or sit & go? 6-max or full ring? The format determines which strategy is right — and which environment is best suited for learning.',
      sections: [
        {
          heading: 'Cash Games: Chips Are Money',
          body:
            'In a **cash game**, every chip corresponds directly to a money value. The blinds stay constant, you can join or leave at any time, and you can top your stack back up after a lost hand (**rebuy**). The standard buy-in is **100 big blinds** — which is why almost all of modern theory assumes 100bb stacks.\n\nStrategically, the cash game is poker at its **purest**: because the conditions never change, every hand is a self-contained, repeatable situation. A decision is good precisely when it wins chips in the long run — there are no tournament side effects to distort that. That\'s exactly what makes the format so well suited to learning: you can practice the same situations (button open, blind defense, flop c-bet) hundreds of times and analyze your mistakes cleanly.\n\nMentally, the cash game demands **composure about money swings** above all. Because the chips are real money, a lost stack tempts you into frustrated continue-playing (**tilt**). Two safeguards help: first, fixed rules for when to end a session. Second, **bankroll management** — only play stakes for which your poker budget covers at least 25 to 30 buy-ins. That way, a normal losing stretch stays a footnote instead of a catastrophe.',
          tip: 'Never judge your sessions by one evening\'s money result — judge them by the quality of your decisions. In the short term, luck rules; in the long term, the better strategy wins out.',
        },
        {
          heading: 'Tournaments: Survive and Grow',
          body:
            'In a **tournament**, you pay a fixed buy-in once and receive tournament chips with no direct cash value. The **blinds increase** at fixed intervals, and whoever runs out of chips is eliminated. Usually only about the top **15%** of entrants get paid, with prizes rising steeply toward the top.\n\nThat creates real strategic differences from the cash game:\n\n- **Changing stack depths**: rising blinds shrink the stacks in big-blind terms. Instead of 100bb, you\'ll often play with 40, 20, or 10bb — short stacks demand different, often simpler decisions, all the way down to pure push-or-fold.\n- **Chips are not linearly worth money**: losing your last chip costs you the entire tournament, but doubling your stack doesn\'t double your prospects. This concept is called **ICM** (Independent Chip Model), and it makes close decisions near the money more cautious.\n- **No rebuy** (outside re-entry periods): mistakes are more final, and survival has value of its own.\n\nMentally, tournaments are a rollercoaster: hours of discipline, then suddenly all-deciding moments — and in the large majority of tournaments, you bust without any prize money. The **variance** is considerably higher than in cash games; even very good players go through long dry spells. In exchange, a single win pays out disproportionately large prize money.',
        },
        {
          heading: 'Sit & Gos: The Tournament in Miniature',
          body:
            'A **sit & go** (SnG) is a tournament with no fixed start time: it begins as soon as all seats are filled — classically a single table of 6 or 9 players in which roughly the top three get paid (traditionally 50/30/20% of the prize pool).\n\nFor learners, SnGs have a special appeal: in 30 to 60 minutes, they run through **every phase of a tournament** in fast-forward — deep stacks at the start, a middle phase with rising blinds, the tense **bubble** (the last unpaid spot), and the endgame with short stacks. Anyone who plays SnGs inevitably learns push-or-fold situations and first ICM considerations — skills that are worth gold in big tournaments.\n\nModern offshoots vary the formula: **spin-and-go formats** with three players and a randomly drawn prize pool are extremely fast and high-variance; **multi-table SnGs** bridge the gap to large tournaments.\n\nThe manageable duration is also an advantage from a responsible-gaming perspective: an SnG has a clear end and a fixed stake known in advance — which makes controlling your budget and time far easier compared to open-ended cash-game sessions.',
          example:
            'A 9-player SnG with a buy-in of 10 units: the prize pool is 90 (plus a fee to the operator). First place gets 45, second place gets 27, third place gets 18. Places 4 through 9 get nothing — 4th place, the bubble, is the bitterest finish in poker.',
        },
        {
          heading: 'Full Ring, 6-Max, Heads-Up',
          body:
            'Table size shapes strategy as well:\n\n- **Full ring** (9–10 players): more players per hand mean tighter ranges — someone has a strong hand more often. The game is slower and more patient; good starting-hand discipline is rewarded more, and aggression is less often mandatory.\n- **6-max** (up to 6 players): the early positions disappear, you pay blinds more often, and you have to play considerably more hands. The game is more aggressive, with more battles between marginal hands — and therefore more learning opportunities per hour. 6-max is the de facto standard for online cash games, and most strategy content (including in this app) is built around it.\n- **Heads-up** (1 on 1): you\'re involved in every hand and have to play extremely wide ranges — almost every hand has value. Heads-up is the most intense format and trains aggression and hand reading like nothing else, but it\'s too demanding as a starting point.\n\nYou already met the underlying rule in Lesson 3: **the fewer players at the table, the wider everyone\'s ranges become.** A hand like A♦ 8♦ is a fold from early position in full ring, a normal open in 6-max, and a clearly strong hand heads-up.',
        },
        {
          heading: 'A Look at Omaha, and Our Recommendation',
          body:
            'Beyond Hold\'em, you\'ll sooner or later run into **Omaha**, usually as **Pot-Limit Omaha (PLO)**: you\'re dealt **four** hole cards and must use **exactly two** of them for your final hand — no more, no fewer. That sounds like a detail, but it changes everything: with four cards, every player makes strong hands and strong draws far more often, pots escalate faster, and the variance is considerably higher. A classic beginner mistake there: seeing a flush with only one card of the suit — a flush that isn\'t one. PLO is a great game — but only once your Hold\'em is solid.\n\nFor getting started, we recommend two paths:\n\n- **6-max cash games at micro stakes**: constant conditions, repeatable situations, pausable at any time — the most efficient learning environment. The following modules are built exactly for it.\n- **Small tournaments or low buy-in SnGs**: a fixed, manageable stake and the complete tournament cycle as course material.\n\nWhichever you choose: only play with money whose loss won\'t burden you, set firm time and budget limits, and treat your first months as an education, not a source of income. Poker rewards good decisions in the long run — but in the short run, any streak can swing either way.',
          tip: 'Pick ONE format and stick with it for several weeks. If you keep jumping between cash games, tournaments, and formats, you learn a little of everything and nothing properly.',
        },
      ],
      takeaways: [
        'Cash games: constant blinds, chips are money, every hand a repeatable situation — the best learning environment.',
        'Tournaments: rising blinds, changing stack depths, and ICM mean chips are not linearly worth money; the variance is considerably higher.',
        'Sit & gos run through every tournament phase in fast-forward, with clearly limited duration and stake.',
        'The fewer players at the table, the wider the ranges: full ring tight, 6-max aggressive, heads-up extremely wide.',
        'Recommendation: 6-max cash at micro stakes or small tournaments — with a fixed budget and clear limits.',
      ],
      quiz: [
        {
          question: 'What is the most fundamental strategic difference between cash games and tournaments?',
          options: [
            'Different hand rankings apply in tournaments',
            'In cash games, blinds and stack depth are constant and chips are directly money; in tournaments, the blinds rise and chips are not linearly worth money',
            'There are no blinds in cash games',
            'Tournaments are always played heads-up',
          ],
          correctIndex: 1,
          explanation:
            'The cash game offers constant, repeatable conditions with chips of direct cash value. In a tournament, rising blinds constantly change the stack depths, and because elimination is final (ICM), chip value does not equal cash value.',
        },
        {
          question: 'Why do you play wider ranges in 6-max than in full ring?',
          options: [
            'Because the blinds are higher in 6-max',
            'Because fewer opponents sit at the table: the chance of a strong hand against you drops, and you pay blinds more often',
            'Because more community cards are dealt in 6-max',
            'Because full-ring rules forbid loose hands',
          ],
          correctIndex: 1,
          explanation:
            'With five opponents instead of eight or nine, it\'s less likely that someone holds a premium hand — and the blinds hit you more often. Both make wider, more aggressive ranges correct.',
        },
        {
          question: 'In Pot-Limit Omaha you hold A♠ K♠ Q♦ J♦ and the board shows four spades. Do you have a flush with the A♠?',
          options: [
            'Yes, the ace completes the flush from the board',
            'No — in Omaha you must use exactly two hole cards, and with only one spade there is no flush',
            'Yes, but only if nobody holds two spades',
            'No, there are no flushes in Omaha',
          ],
          correctIndex: 1,
          explanation:
            'The central Omaha rule: exactly two of your four hole cards plus exactly three board cards. With only one spade in your hand, you cannot make a flush — one of the most common beginner mistakes in PLO.',
        },
        {
          question: 'What does the ICM concept describe in tournament poker?',
          options: [
            'The optimal raise size as blinds increase',
            'That tournament chips do not translate linearly into money — losing all your chips hurts more than doubling up helps',
            'The rule that blinds must rise every 15 minutes',
            'A system for assigning seats at the start of a tournament',
          ],
          correctIndex: 1,
          explanation:
            'ICM (Independent Chip Model) translates chip counts into monetary expected value. Because elimination is final, the first chip you lose is worth more than the last chip you win — which makes close spots near the money more cautious.',
        },
        {
          question: 'Why is a sit & go a sensible practice format for beginners?',
          options: [
            'Because the opponents there are always weaker',
            'Because it runs through every tournament phase in a short time, with the stake and duration clearly limited',
            'Because the blinds stay constant, as in a cash game',
            'Because you can rebuy without limit there',
          ],
          correctIndex: 1,
          explanation:
            'An SnG compresses deep stacks, the bubble, and the endgame into 30 to 60 minutes and has a fixed buy-in — ideal training for tournament skills with full control over budget and time.',
        },
      ],
    },
  ],
};

export default m1;
