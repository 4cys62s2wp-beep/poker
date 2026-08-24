// Scenario trainer: complete game situations with rated options.
// Context (unless stated otherwise): 6-max cash game, 100bb effective.
// quality: 'best' = best option (exactly one per scenario), 'ok' = defensible, 'bad' = mistake.

import type { Scenario } from '../scenarios';

export const SCENARIOS: Scenario[] = [
  // ---------- Preflop ----------
  {
    id: 'pre-1',
    street: 'Preflop',
    title: 'Pretty but poisonous',
    situation: 'You are under the gun at a 6-max table. Everyone is waiting on you.',
    heroCards: ['Kh', 'Ts'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'KTo from early position is a classic money-loser: when you get called, you are often dominated by a better K (KQ, AK) or a better T. "Pretty" offsuit hands like this belong in the muck up front.',
      },
      {
        label: 'Raise to 2.5bb',
        quality: 'bad',
        explanation:
          'From early position there are still five players behind you – the odds that someone holds a dominating hand are high. KTo only becomes an open from the cutoff onward.',
      },
      {
        label: 'Limp (just call)',
        quality: 'bad',
        explanation:
          'Open-limping is almost always the worst choice: you never win the pot outright, you play a bloated multiway pot without initiative, and you make yourself readable.',
      },
    ],
    lesson: 'Position determines which hands are playable – offsuit broadways without an ace are pure trap hands up front.',
  },
  {
    id: 'pre-2',
    street: 'Preflop',
    title: 'Small pair, big plan',
    situation: 'A solid player opens under the gun to 2.5bb. You are in the hijack, and you both have full 100bb stacks.',
    heroCards: ['6c', '6d'],
    board: [],
    options: [
      {
        label: 'Call (set mining)',
        quality: 'best',
        explanation:
          "With 100bb stacks the call is perfect: you flop a set about 12% of the time and then often win a big pot against his overpair or top pair. The 15x rule is comfortably satisfied.",
      },
      {
        label: '3-bet to 8bb',
        quality: 'bad',
        explanation:
          "A 3-bet with 66 against an early-position opening range builds a bloated pot with a hand that is almost never ahead when big money goes in. Against 4-bets you have to fold; against calls you're playing a guessing game.",
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Not wrong if stacks were short or aggressive players behind you like to squeeze. But with deep stacks you are giving up one of the most profitable standard spots in poker.',
      },
    ],
    lesson: "Set mining: small pair + deep stacks + a likely strong opponent range = the dream combination.",
  },
  {
    id: 'pre-3',
    street: 'Preflop',
    title: 'The trap that isn’t one',
    situation: 'Under the gun, you are dealt the best hand in poker. The table calls a lot.',
    heroCards: ['As', 'Ah'],
    board: [],
    options: [
      {
        label: 'Raise to 3bb',
        quality: 'best',
        explanation:
          'With aces you want to build the pot while you are certain to be ahead. At call-happy tables you will almost always get paid – the limp "trap" is unnecessary and dangerous.',
      },
      {
        label: 'Limp and hope for a raise',
        quality: 'bad',
        explanation:
          'The classic beginner trick rarely works: usually everyone just limps behind, and you play AA against five random hands – exactly the scenario in which aces lose most often.',
      },
      {
        label: 'Shove all-in right away',
        quality: 'bad',
        explanation:
          'A 100bb preflop all-in folds out everything except KK/AA – you only win the blinds. Maximum risk, minimum reward: the opposite of value.',
      },
    ],
    lesson: 'Strong hands want growing pots: raise normally and give your opponents a chance to pay you on every street.',
  },
  {
    id: 'pre-4',
    street: 'Preflop',
    title: 'Putting kings to work',
    situation: 'The cutoff opens to 2.5bb, and you are on the button.',
    heroCards: ['Kd', 'Kc'],
    board: [],
    options: [
      {
        label: '3-bet to about 8bb',
        quality: 'best',
        explanation:
          'KK is the second-best starting hand – you want value from worse hands (AK, QQ, AQ, bluffs), a bigger pot, and the blinds pushed out. In position, ~3x is the standard.',
      },
      {
        label: 'Just call',
        quality: 'ok',
        explanation:
          "Occasionally defensible as a trap against very aggressive players, but you let the blinds in cheaply and the pot stays small when you win. As a default, you're leaving money on the table.",
      },
      {
        label: 'Fold – "he must have aces"',
        quality: 'bad',
        explanation:
          'Folding KK preflop is a legendary mistake. The probability that someone holds AA right now is tiny – against a normal opening range you are a massive favorite.',
      },
    ],
    lesson: 'Build value aggressively with premium hands – fear of the monster under the bed is what costs the most in the long run.',
  },
  {
    id: 'pre-5',
    street: 'Preflop',
    title: 'Using the big blind discount',
    situation: 'The button opens to 2.5bb, the small blind folds. You are in the big blind.',
    heroCards: ['Ah', '4h'],
    board: [],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'You only have to add 1.5bb to win 4.5bb – excellent pot odds. A4s plays well: nut flush potential, wheel draws, ace pairs. A clear defend against a wide button range.',
      },
      {
        label: '3-bet to 11bb',
        quality: 'ok',
        explanation:
          'A4s is a legitimate 3-bet bluff candidate (ace blocker, playable when called). Fine as part of a mixed strategy – but as a default against unknown opponents, the call is the simpler, safer choice.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation:
          'Far too tight: against a 40% button range with these pot odds, you are folding a hand that defends clearly profitably. Players who fold too much in the BB get carved up by stealers.',
      },
    ],
    lesson: 'The big blind gets a discount – suited aces almost always belong in the defense.',
  },
  {
    id: 'pre-6',
    street: 'Preflop',
    title: 'Family pot at the home game',
    situation: 'Loose 9-handed game: three players limp in front of you. You are in middle position.',
    heroCards: ['Qd', 'Jc'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'QJo looks playable but is a kicker nightmare against four opponents: when you hit your pair, you often lose to a better one. Multiway, the nut hands win – not the second-best ones.',
      },
      {
        label: 'Limp along',
        quality: 'ok',
        explanation:
          'Seeing a cheap flop is not catastrophic, but you are playing a dominated hand without initiative from middle position. There are better spots.',
      },
      {
        label: 'Iso-raise to 6bb',
        quality: 'bad',
        explanation:
          "Against limpers you raise to isolate with strong hands – QJo is not one. In call-happy games the limpers won't fold anyway: you're just building a big pot with a mediocre hand.",
      },
    ],
    lesson: 'In multiway pots, nut potential and kickers are what count – dominated broadways get expensive.',
  },
  {
    id: 'pre-7',
    street: 'Preflop',
    title: 'Starting suited connectors right',
    situation: 'Everyone folds to you in the cutoff.',
    heroCards: ['8h', '7h'],
    board: [],
    options: [
      {
        label: 'Raise to 2.5bb',
        quality: 'best',
        explanation:
          '87s belongs in the standard opening range from the cutoff onward: you can win the blinds outright, you have position, and you hold a hand that can flop hard-to-read monsters (straights, flushes).',
      },
      {
        label: 'Limp',
        quality: 'bad',
        explanation:
          'Limping gives up the chance at the blinds and telegraphs weakness. If a hand is good enough to play, it is good enough to raise.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Not a disaster, but too tight: from late position, suited connectors are clearly profitable. Folding them leaves steal profits and hidden monsters on the table.',
      },
    ],
    lesson: 'Late position opens wider – suited connectors are raise candidates there, not limping hands.',
  },
  {
    id: 'pre-8',
    street: 'Preflop',
    title: 'The rock awakens',
    situation:
      'You open on the button to 2.5bb. The tightest player of the night – his first 4-bet in hours – raises from the big blind to 12bb.',
    heroCards: ['Ac', 'Kd'],
    board: [],
    options: [
      {
        label: 'Call and see a flop',
        quality: 'best',
        explanation:
          'Against the 4-bet range of an extreme nit (practically only QQ+/AK), AKo is at best a coin flip. The call keeps the pot controlled; you continue when you hit an ace or a king.',
      },
      {
        label: 'All-in (5-bet shove)',
        quality: 'ok',
        explanation:
          'Against normal opponents, shoving AKo is standard. But against a rock who holds almost exclusively KK/AA here, you are often getting the money in as a clear underdog. Reads beat standard lines.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          "Sounds cowardly, but against the most extreme nits it's debatable: if his range really is only KK/AA, you are far behind almost every time. A disciplined exploit – just don't do it too often.",
      },
    ],
    lesson: 'Reads change standard strategy: against ultra-tight 4-bet ranges, even AK loses massive value.',
  },
  // ---------- Flop ----------
  {
    id: 'flop-1',
    street: 'Flop',
    title: 'Dry board, small bet',
    situation:
      'You open on the button, the big blind calls. Pot: 5.5bb. The flop is as dry as it gets – and it smashes your range.',
    heroCards: ['As', 'Ks'],
    board: ['Kd', '7c', '2h'],
    options: [
      {
        label: 'Small c-bet (about 1/3 pot)',
        quality: 'best',
        explanation:
          'Top pair top kicker on a dry board: there are hardly any draws to protect against. A small bet extracts value from worse kings, pairs, and ace-high – and keeps his weaker hands in the pot.',
      },
      {
        label: 'Check back',
        quality: 'ok',
        explanation:
          'Fine as an occasional trap, but you are giving up one of three possible value streets. On dry boards, little changes in your favor by the turn.',
      },
      {
        label: 'Pot-size bet',
        quality: 'bad',
        explanation:
          'A big bet folds out exactly the hands you want money from (77-QQ without a set; K-x stays anyway). On dry boards, small bets win more because they get paid more often.',
      },
    ],
    lesson: 'Bet sizing follows board texture: dry = small and frequent, wet = big and selective.',
  },
  {
    id: 'flop-2',
    street: 'Flop',
    title: 'Overpair in the minefield',
    situation:
      'Multiway pot with three players, pot 12bb. One opponent bets full pot, the second calls. You are last to act.',
    heroCards: ['Qc', 'Qd'],
    board: ['Js', 'Ts', '9d'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'On J-T-9 with two spades, every straight (KQ, Q8, 87), two pair, and set already beats you – and those are exactly the hands betting and calling here. On this board your overpair is little more than a bluff catcher, and multiway it is beaten.',
      },
      {
        label: 'Call',
        quality: 'ok',
        explanation:
          'Heads-up against an aggressive player, the call would be good. But against a bet AND a call on the wettest of all boards, you are usually burning money – at least one of them has you.',
      },
      {
        label: 'Raise all-in',
        quality: 'bad',
        explanation:
          'You isolate yourself against exactly the hands that beat you. No worse hand calls – the classic "I don\'t want to know" move that costs stacks.',
      },
    ],
    lesson: 'An overpair is not a monster: on coordinated boards against multiple opponents, let it go with discipline.',
  },
  {
    id: 'flop-3',
    street: 'Flop',
    title: 'Nut draw with backup',
    situation:
      'The cutoff opened preflop and you called on the button. Pot 6.5bb. He c-bets 1/2 pot (3.25bb).',
    heroCards: ['Ah', '9h'],
    board: ['Kh', '7h', '2c'],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'Nut flush draw (9 outs, ~35% by the river) plus a possible ace as an overcard: against a half-pot bet you only need 25% equity – a comfortable call with position and big implied odds.',
      },
      {
        label: 'Raise (semi-bluff)',
        quality: 'ok',
        explanation:
          'Aggressive and legitimate: you win outright when he folds, and you have a strong draw as a fallback. Slightly riskier, because a 3-bet puts you in an awkward spot.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation:
          'Folding the best draw on the board with excellent pot odds throws away massive equity. Nut draws are hands you want to stay in the pot with.',
      },
    ],
    lesson: 'Nut flush draws in position are money machines: call at minimum, and feel free to play them aggressively at times.',
  },
  {
    id: 'flop-4',
    street: 'Flop',
    title: 'Set meets c-bet',
    situation:
      'The hijack opens, you call in the big blind. Pot 5.5bb. You flop your set – he c-bets 4bb.',
    heroCards: ['7s', '7d'],
    board: ['Ad', '7c', '2s'],
    options: [
      {
        label: 'Raise to about 12bb',
        quality: 'best',
        explanation:
          "He often has an ace that will pay you off – and right now his range contains the most top-pair hands it ever will. Raise for value while he's in love with his A-x; on later cards it gets harder to get the stacks in.",
      },
      {
        label: 'Just call (slowplay)',
        quality: 'ok',
        explanation:
          'Not terrible on this dry board, since few cards devalue your hand. But you risk the action drying up on the turn/river – you rarely get 100bb in with only one raising street.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation: 'You hold the third-strongest possible hand. Folding here would be a misclick-level error.',
      },
    ],
    lesson: 'Fast-play sets on ace-high boards: your opponent has top pair now – later he might get cold feet.',
  },
  {
    id: 'flop-5',
    street: 'Flop',
    title: 'Pressing your range advantage',
    situation:
      'You open in the cutoff, the big blind calls. Pot 5.5bb. The flop misses you – but whose range hits boards like this?',
    heroCards: ['Ac', '5c'],
    board: ['Ks', '8d', '3h'],
    options: [
      {
        label: 'Small c-bet (about 1/3 pot)',
        quality: 'best',
        explanation:
          'K-8-3 rainbow hits your preflop range (AK, KQ, overpairs) much harder than his calling range. A small bet folds out his many missed hands – cheap, effective, with an ace blocker and a backdoor flush as insurance.',
      },
      {
        label: 'Check and give up',
        quality: 'ok',
        explanation:
          'Too passive for this spot: boards exactly like this are where the c-bet is most profitable. Checking is defensible against very sticky opponents, but it gives up fold equity.',
      },
      {
        label: 'Pot-size bet as a "real" bluff',
        quality: 'bad',
        explanation:
          'Too expensive for the job: his weak hands fold to 1/3 pot as well. The big bet risks three times as much for the same result – terrible value for money.',
      },
    ],
    lesson: 'C-bets work on boards that hit your own range – and there, the small coin is all it takes.',
  },
  {
    id: 'flop-6',
    street: 'Flop',
    title: 'Bottom pair in the family pot',
    situation: 'Four players see the flop in a limped pot (4bb). A player in early position bets 3bb and another calls.',
    heroCards: ['5c', '4c'],
    board: ['Qs', '9d', '4h'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Bottom pair with a mini kicker against a bet and a call in a four-way pot: you are almost certainly behind, have five outs at most, and no implied odds to speak of. The simple, disciplined fold saves real money.',
      },
      {
        label: 'Call – "maybe a 4 will come"',
        quality: 'bad',
        explanation:
          'Two outs to trips (the 4) plus weak five-outs do not justify a call against genuine action. It is exactly these "hope calls" that add up to a big loss by the end of the night.',
      },
      {
        label: 'Raise as a bluff',
        quality: 'bad',
        explanation:
          'You don\'t bluff with bottom pair against two players in a multiway pot – somebody always has a queen. The most expensive option with the worst chance of success.',
      },
    ],
    lesson: 'Weak pairs multiway are fold candidates – good players lose the least with them.',
  },
  // ---------- Turn ----------
  {
    id: 'turn-1',
    street: 'Turn',
    title: 'The price is too steep',
    situation:
      'You called the flop with your straight draw. The turn is a blank. Pot 14bb – your opponent now bets 10bb (2/3 pot). You both have about 80bb behind.',
    heroCards: ['8s', '7s'],
    board: ['9c', '6d', '2s', '2d'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Eight outs on the turn are only ~17% – the call mathematically requires 29%. Implied odds would have to fill the gap, but your draw is obvious: when the straight hits, he rarely pays you off big.',
      },
      {
        label: 'Call',
        quality: 'ok',
        explanation:
          'Defensible with very deep stacks against a player who never folds and always pays off. But as a default, this call loses money over time – the direct odds simply are not there.',
      },
      {
        label: 'Raise all-in as a semi-bluff',
        quality: 'bad',
        explanation:
          'A 2/3-pot turn bet signals genuine strength – your fold equity is low, and when you get called you are a clear underdog. Semi-bluffs need a realistic chance that the opponent folds.',
      },
    ],
    lesson: 'On the turn, your draw odds are cut in half – good players recalculate instead of feeling "committed".',
  },
  {
    id: 'turn-2',
    street: 'Turn',
    title: 'The passive player wakes up',
    situation:
      'You bet the flop and turn with top pair. Now the player who has done nothing but call and fold all night raises you to triple your bet.',
    heroCards: ['Ad', 'Jh'],
    board: ['Jc', '8s', '4d', 'Kh'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'When passive recreational players suddenly raise, they practically always have a strong hand – here often two pair, a set, or KJ. Top pair with a good kicker is far behind that range. The fold stings for a moment and saves stacks in the long run.',
      },
      {
        label: 'Call and see the river',
        quality: 'ok',
        explanation:
          'Against unknown or aggressive opponents, the call would be standard. But against a proven passive player, you are usually just paying to receive the bad news on the river.',
      },
      {
        label: '3-bet all-in',
        quality: 'bad',
        explanation:
          'You are escalating against exactly the range that beats you. Worse hands fold, better hands snap-call – the textbook example of worthless aggression.',
      },
    ],
    lesson: 'The strongest read in low-stakes poker: unexpected aggression from passive players is almost never a bluff.',
  },
  {
    id: 'turn-3',
    street: 'Turn',
    title: 'The nuts – now what?',
    situation:
      'You called the flop with your straight draw and the turn completes the nuts. Your opponent (who bet the flop) now checks. Pot 15bb.',
    heroCards: ['Th', '9h'],
    board: ['8c', '7d', '2s', '6s'],
    options: [
      {
        label: 'Bet about 2/3 pot',
        quality: 'best',
        explanation:
          'With the best hand you want to feed the pot – and on this board there are plenty of hands (sets, two pair, flush draws, smaller straight draws) that will pay a solid bet. Don\'t go too small: every street counts.',
      },
      {
        label: 'Check back as a trap',
        quality: 'ok',
        explanation:
          'Against hyper-aggressive opponents who will surely bet the river, the trap can work. But usually you give up an entire value street and hand flush draws a free card that kills your action.',
      },
      {
        label: 'Mini bet (1bb) "to bait him in"',
        quality: 'bad',
        explanation:
          'The mini bet wins almost nothing and gives every draw perfect odds to outdraw you on the river or get away cheap. If you bet, bet an amount that actually grows the pot.',
      },
    ],
    lesson: 'Maximize value with the nuts: solid bets on every street beat tricks almost every time.',
  },
  {
    id: 'turn-4',
    street: 'Turn',
    title: 'Aces on the horror board',
    situation:
      'You 3-bet preflop and got called. On the fully coordinated board, your opponent check-called the flop. The turn does not bring the fourth spade, but the danger remains. He now bets small (1/4 pot). You hold no spade.',
    heroCards: ['Ad', 'Ac'],
    board: ['9s', '8s', '7s', '2h'],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'Your overpair is now nothing more than a bluff catcher: flushes, straights, and sets beat you, but the small bet can also come from draws and weaker hands. At the price of 1/4 pot you call – but not a chip more.',
      },
      {
        label: 'Raise "for protection"',
        quality: 'bad',
        explanation:
          'Protection from what? Made flushes are not folding, and draws pay you at most once. You are inflating the pot with a one-pair hand on a board that destroys your range.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Against big bets, folding would be strong. Against 1/4 pot it is too tight – at this price your opponent only has to bluff occasionally for the call to be correct.',
      },
    ],
    lesson: 'Even aces are sometimes just a bluff catcher: on monotone, coordinated boards, call small instead of inflating the pot.',
  },
  // ---------- River ----------
  {
    id: 'river-1',
    street: 'River',
    title: 'The most expensive trap in poker',
    situation:
      'You bet three streets of value with top pair. On the river, an easygoing recreational player suddenly raises you to four times your bet.',
    heroCards: ['Kc', 'Qd'],
    board: ['Kh', '9c', '5d', '3s', '8h'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'The big river raise from a recreational player is the most reliable information in low-stakes poker: practically always two pair or better. "But he could be bluffing" is the most expensive excuse in poker history.',
      },
      {
        label: 'Call – "I have to see it"',
        quality: 'bad',
        explanation:
          'Curiosity costs real money here: for the call to be right, he would have to be bluffing more than one time in four – passive recreational players almost never bluff in this spot.',
      },
      {
        label: '3-bet all-in',
        quality: 'bad',
        explanation: 'Escalating with one pair against the strongest range of the night is the fastest way to lose your stack.',
      },
    ],
    lesson: 'Believe river raises from passive players – the disciplined fold is one of the most valuable skills in poker.',
  },
  {
    id: 'river-2',
    street: 'River',
    title: 'The thin value bet',
    situation:
      'Heads-up against a calling station who goes to showdown with any pair. The river changes nothing. She checks to you. Pot 18bb.',
    heroCards: ['Ad', 'Qd'],
    board: ['Qs', '8c', '4d', '2h', '7c'],
    options: [
      {
        label: 'Value bet about 1/2 pot',
        quality: 'best',
        explanation:
          'Top pair top kicker against someone who pays off with Q-x, 8-x, and pocket pairs: this bet wins real money on average. Exactly these "thin" value bets are what separate winners from break-even players.',
      },
      {
        label: 'Check back – "better safe than sorry"',
        quality: 'ok',
        explanation:
          'You usually win the showdown anyway, but you give up the third value street. Against calling stations, caution on the river is almost always money lost.',
      },
      {
        label: 'Overbet 2x pot',
        quality: 'bad',
        explanation:
          'Even calling stations have a pain threshold: the giant bet folds out the weak hands and only gets called by hands that could beat you. Too big for value this thin.',
      },
    ],
    lesson: 'Value bet thin against callers: if you only bet the nuts, you leave most of the money on the table.',
  },
  {
    id: 'river-3',
    street: 'River',
    title: 'Recognizing showdown value',
    situation:
      'Heads-up. Your flush draw got there – no, wait, it didn’t: the river misses everything. Your opponent checks for the second time. Pot 12bb.',
    heroCards: ['Ah', '6h'],
    board: ['Kh', '9h', '4c', '2d', '8s'],
    options: [
      {
        label: 'Check – take the showdown',
        quality: 'best',
        explanation:
          'Ace-high beats all of your opponent\'s missed draws – and those are exactly what he often checks here. Your "nothing" has real showdown value: bluffing with hands like this turns winning spots into losing ones.',
      },
      {
        label: 'Small bluff bet (1/3 pot)',
        quality: 'ok',
        explanation:
          'Will a better pair fold? Rarely. Usually only the hands you already beat fold, and the better ones call. Defensible against very tight opponents, but the check is smarter.',
      },
      {
        label: 'Overbet bluff all-in',
        quality: 'bad',
        explanation:
          'Maximum risk to push out hands you partly beat anyway – and every K-x snap-calls you. Bluff with your most hopeless hands, not with showdown value.',
      },
    ],
    lesson: 'Before every river bluff, ask: do I already beat enough by checking? Ace-high is often good enough.',
  },
  // ---------- Tournament ----------
  {
    id: 'tour-1',
    street: 'Turnier',
    title: 'Short stack, clear message',
    situation:
      'Tournament, and the blinds are eating you alive: 8bb left on the button. Everyone folds to you – the small blind and big blind are solid players.',
    heroCards: ['Ad', '8d'],
    board: [],
    options: [
      {
        label: 'All-in',
        quality: 'best',
        explanation:
          'A8s on the button with 8bb is a clear standard shove (the Nash range there is considerably wider). You put maximum fold pressure on two random blind hands, and when called you are rarely dominated.',
      },
      {
        label: 'Min-raise with a plan to fold',
        quality: 'bad',
        explanation:
          'With 8bb you can no longer fold sensibly after a min-raise – you are chopping your stack into ineffective pieces. Short-stacked, there are only two buttons left: all-in or fold.',
      },
      {
        label: 'Fold – wait for a better spot',
        quality: 'bad',
        explanation:
          'At 8bb, every orbit of blinds costs nearly 20% of your stack. A8s on the button is well above the shoving threshold – players who fold these spots blind themselves into irrelevance.',
      },
    ],
    lesson: 'Below ~12bb, push-or-fold becomes the main strategy – half measures burn fold equity.',
  },
  {
    id: 'tour-2',
    street: 'Turnier',
    title: 'Bubble math',
    situation:
      'Tournament bubble: 10 players left, 9 get paid. You have a comfortable middle stack (35bb). The chip leader (110bb) shoves all-in in front of you – he does this almost every hand. Two short stacks (4bb each) sit at the other tables.',
    heroCards: ['Ac', 'Qs'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'In pure chips you are ahead of his any-two range – but this is not about chips, it is about money (ICM): if you lose, you miss the guaranteed payout while two short stacks are practically blinding out. The fold costs little; the call risks everything.',
      },
      {
        label: 'Call – "I’m ahead after all"',
        quality: 'ok',
        explanation:
          'AQo has good equity against his wide range, and doubling up would make you chip leader. But on the bubble, with short stacks dying, you pay a high "risk premium" – a close spot, usually too thin.',
      },
      {
        label: 'Snap-call without thinking',
        quality: 'bad',
        explanation:
          'Playing pure chip math on the bubble throws away prize-money expectation. ICM situations always demand an extra second of thought.',
      },
    ],
    lesson: 'ICM: on the bubble, chips do not equal money – avoid big confrontations while others are nearly out.',
  },
];
