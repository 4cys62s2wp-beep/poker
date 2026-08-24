// Poker glossary for PokerMentor (English).
// 159 entries, sorted alphabetically. `related` references exact
// `term` strings of other entries.

import type { GlossaryEntry } from '../types';

const glossary: GlossaryEntry[] = [
  {
    term: 'Aggression Factor',
    definition:
      'A statistic from tracking software that measures the ratio of aggressive actions (bets, raises) to passive calls. A high value indicates an aggressive playing style, a low value a passive one.',
    category: 'Online',
    related: ['HUD', 'VPIP', 'PFR'],
  },
  {
    term: 'Air',
    definition:
      'A hand with no value at all, holding neither a pair nor a usable draw. Betting with air is a pure bluff that relies entirely on fold equity.',
    category: 'Slang',
    related: ['Bluff', 'Fold Equity'],
  },
  {
    term: 'All-in',
    definition:
      'A bet in which a player puts all of their remaining chips into the pot. That player can take no further actions afterward; if other players keep betting, side pots are created.',
    category: 'Aktionen',
    related: ['Side Pot', 'Stack', 'Pot Committed'],
  },
  {
    term: 'Angle Shooting',
    definition:
      'Unfair tricks at the edge of the rules, such as hiding the size of your stack or making deliberately ambiguous declarations. Angle shooting is often not explicitly forbidden, but it is considered a serious breach of poker etiquette.',
    category: 'Live',
    related: ['String Bet', 'Tell'],
  },
  {
    term: 'Ante',
    definition:
      'A forced bet that all players pay before the cards are dealt. Antes grow the pot and increase the incentive to fight for it; in tournaments they are standard from the middle levels onward.',
    category: 'Grundlagen',
    related: ['Blinds', 'Dead Money'],
  },
  {
    term: 'Backdoor',
    definition:
      'A draw that needs two matching cards in a row, such as three cards of one suit on the flop that still need the turn and river of the same suit. Backdoor draws are weak on their own, but they often make a hand just strong enough for a semi-bluff.',
    category: 'Grundlagen',
    related: ['Runner-Runner', 'Draw', 'Semi-Bluff'],
  },
  {
    term: 'Bad Beat',
    definition:
      'Losing despite having the clearly better hand when the money went in, because the opponent hits an unlikely draw. Bad beats are an unavoidable part of variance, not a sign of bad play.',
    category: 'Slang',
    related: ['Suckout', 'Varianz', 'Tilt'],
  },
  {
    term: 'Bankroll',
    definition:
      'All the money a player has set aside exclusively for poker. The bankroll is your working capital and should be kept strictly separate from the rest of your finances.',
    category: 'Grundlagen',
    related: ['Bankroll Management', 'Buy-in'],
  },
  {
    term: 'Bankroll Management',
    definition:
      'Rules that govern how large a share of your bankroll you risk in any one game, keeping the risk of ruin small despite variance. Common guidelines are at least 20 to 30 buy-ins for cash games and considerably more for tournaments.',
    category: 'Strategie',
    related: ['Bankroll', 'Varianz', 'Downswing'],
  },
  {
    term: 'Bet Sizing',
    definition:
      'The choice of how much to bet, usually expressed as a fraction of the pot. Good bet sizing takes board texture, ranges, and the purpose of the bet into account, whether that is value, bluffing, or protection.',
    category: 'Strategie',
    related: ['Value Bet', 'Overbet', 'Boardtextur'],
  },
  {
    term: 'Blank',
    definition:
      'A turn or river card that is unlikely to change the balance of power, such as a low card unconnected to any flush or straight. Also called a brick.',
    category: 'Slang',
    related: ['Boardtextur', 'Scare Card'],
  },
  {
    term: 'Blinds',
    definition:
      'The two forced bets to the left of the button: the small blind and the big blind. They create an initial pot for the game to revolve around and rotate clockwise with every hand.',
    category: 'Grundlagen',
    related: ['Button', 'Ante', 'Position'],
  },
  {
    term: 'Blocker',
    definition:
      'A card in your own hand that reduces the number of combinations your opponent can hold. Holding the ace of a suit, for example, blocks your opponent from having the nut flush, letting you bluff more credibly on the right boards.',
    category: 'Strategie',
    related: ['Combo', 'Range', 'Bluff'],
  },
  {
    term: 'Bluff',
    definition:
      'A bet made with a weak hand that aims to make better hands fold. Its success depends on fold equity, a credible story, and the opponent\'s range.',
    category: 'Strategie',
    related: ['Semi-Bluff', 'Fold Equity', 'Air'],
  },
  {
    term: 'Board',
    definition:
      'The community cards lying face up in the middle of the table: flop, turn, and river. All players combine the board with their hole cards to make the best possible five-card hand.',
    category: 'Grundlagen',
    related: ['Community Cards', 'Flop', 'Boardtextur'],
  },
  {
    term: 'Boardtextur',
    definition:
      'The character of the community cards, such as dry, coordinated, paired, or monotone. The texture determines which ranges connect with the board and which bet sizes and frequencies make sense.',
    category: 'Strategie',
    related: ['Dry Board', 'Wet Board', 'Scare Card'],
  },
  {
    term: 'Bomb Pot',
    definition:
      'An agreement at a live table where every player puts in a fixed amount before the hand and the preflop betting round is skipped. The flop is dealt straight away, creating big multiway pots.',
    category: 'Live',
    related: ['Ante', 'Multiway Pot'],
  },
  {
    term: 'Bounty',
    definition:
      'A prize on players\' heads in special tournament formats: whoever eliminates an opponent immediately collects a reward. Bounties change correct strategy, because calls against short stacks gain extra value.',
    category: 'Turnier',
    related: ['Buy-in', 'MTT'],
  },
  {
    term: 'Broadway',
    definition:
      'A collective term for the high cards ten through ace; the Broadway straight is the highest possible straight, running from ten to ace. Starting hands like KQ or AJ are called Broadway hands.',
    category: 'Grundlagen',
    related: ['Straight', 'Nuts'],
  },
  {
    term: 'Bubble',
    definition:
      'The phase of a tournament just before the paid places. On the bubble, ICM pressure rises sharply: big stacks can steal aggressively, while short stacks have to play tight.',
    category: 'Turnier',
    related: ['ICM', 'ITM', 'Final Table'],
  },
  {
    term: 'Button',
    definition:
      'The dealer position, marked by a disc that moves clockwise after every hand. The button acts last postflop, making it the most profitable position at the table.',
    category: 'Grundlagen',
    related: ['Position', 'Cutoff', 'Blinds'],
  },
  {
    term: 'Buy-in',
    definition:
      'The amount you bring to the table when joining a cash game, or the entry fee for a tournament. In tournaments the buy-in usually includes an additional fee for the organizer.',
    category: 'Grundlagen',
    related: ['Bankroll', 'Rake', 'Rebuy'],
  },
  {
    term: 'C-Bet',
    definition:
      'Short for continuation bet: the bet the preflop aggressor makes on the flop, continuing the initiative. C-bets work especially well on dry boards that hit your own range better than your opponent\'s.',
    category: 'Aktionen',
    related: ['Open Raise', 'Double Barrel', 'Dry Board'],
  },
  {
    term: 'Call',
    definition:
      'Matching an existing bet to stay in the hand. If no other player raises afterward, the betting round ends.',
    category: 'Aktionen',
    related: ['Raise', 'Fold', 'Check'],
  },
  {
    term: 'Calling Station',
    definition:
      'A passive player who calls too many bets and rarely folds or raises. Bluffs are unprofitable against calling stations; instead, bet consistently for value, including thin value.',
    category: 'Slang',
    related: ['Fish', 'Value Bet', 'Loose'],
  },
  {
    term: 'Cash Game',
    definition:
      'A game format in which chips have direct cash value and you can join or leave at any time. The blinds stay constant, unlike in tournaments with rising levels.',
    category: 'Grundlagen',
    related: ['Buy-in', 'MTT'],
  },
  {
    term: 'Check',
    definition:
      'Passing the action without betting, only possible if no one has bet yet in the current betting round. Checking keeps the pot small and can also serve as a trap.',
    category: 'Aktionen',
    related: ['Check-Raise', 'Slowplay', 'Call'],
  },
  {
    term: 'Check-Raise',
    definition:
      'Checking first, then raising after an opponent bets in the same betting round. The check-raise applies maximum pressure and is used both with very strong hands and as a bluff.',
    category: 'Aktionen',
    related: ['Check', 'Raise', 'Slowplay'],
  },
  {
    term: 'Chip Leader',
    definition:
      'The player with the biggest stack in a tournament or at a table. Chip leaders can threaten their opponents\' stacks and apply enormous pressure, especially on the bubble.',
    category: 'Turnier',
    related: ['Stack', 'Bubble'],
  },
  {
    term: 'Chop',
    definition:
      'Splitting the pot between several players with equally strong hands. In tournaments, a chop also refers to a deal in which the remaining players divide the leftover prize money among themselves.',
    category: 'Grundlagen',
    related: ['Showdown', 'Side Pot'],
  },
  {
    term: 'Coin Flip',
    definition:
      'A situation in which two hands have roughly equal chances of winning, classically a pair against two overcards at about 50-50. In tournaments, such flips often decide who advances.',
    category: 'Mathematik',
    related: ['Equity', 'All-in', 'Varianz'],
  },
  {
    term: 'Cold Call',
    definition:
      'Calling a raise without having previously invested anything in the pot. Cold calls are often weaker than a three-bet, because they give up both initiative and fold equity.',
    category: 'Aktionen',
    related: ['Flat Call', 'Three-Bet'],
  },
  {
    term: 'Combo',
    definition:
      'A specific card combination within a hand category. AK exists in 16 combos, 4 of them suited and 12 offsuit; pocket pairs have 6 combos each. Counting combos makes range analysis precise.',
    category: 'Mathematik',
    related: ['Range', 'Blocker'],
  },
  {
    term: 'Community Cards',
    definition:
      'The shared cards visible to everyone in the middle of the table, at most five in Hold\'em. Every player can use them to build their best five-card hand.',
    category: 'Grundlagen',
    related: ['Board', 'Flop', 'Hole Cards'],
  },
  {
    term: 'Cooler',
    definition:
      'A practically unavoidable clash between two very strong hands, such as set over set. Unlike a bad beat, nobody makes a mistake here; the loss is pure variance.',
    category: 'Slang',
    related: ['Bad Beat', 'Set', 'Varianz'],
  },
  {
    term: 'Crying Call',
    definition:
      'A reluctant call with a hand you suspect is beaten, usually on the river against a small bet. It is correct when the pot odds require only a small chance of winning.',
    category: 'Slang',
    related: ['Pot Odds', 'Hero Call'],
  },
  {
    term: 'Cutoff',
    definition:
      'The position directly to the right of the button and the second-best seat at the table. Players often raise from the cutoff to steal the blinds or to cut the button out of position.',
    category: 'Grundlagen',
    related: ['Button', 'Position', 'Steal'],
  },
  {
    term: 'Dead Money',
    definition:
      'Chips in the pot from players who are no longer contesting it, such as abandoned blinds and limps. Dead money increases the incentive for steals and squeezes.',
    category: 'Strategie',
    related: ['Ante', 'Steal', 'Squeeze'],
  },
  {
    term: 'Deep Stack',
    definition:
      'A stack of considerably more than 100 big blinds. Deep stacks increase the importance of position and implied odds, and make speculative hands like suited connectors more valuable.',
    category: 'Strategie',
    related: ['Effective Stack', 'Implied Odds', 'Suited Connectors'],
  },
  {
    term: 'Donk Bet',
    definition:
      'A bet made out of position into the preflop aggressor before they can make their c-bet. Long dismissed as a beginner\'s mistake, the donk bet is now a legitimate play on certain board textures.',
    category: 'Aktionen',
    related: ['C-Bet', 'Position'],
  },
  {
    term: 'Double Barrel',
    definition:
      'The second bet in a row: after a c-bet on the flop, you bet again on the turn. A double barrel makes the most sense on turn cards that strengthen your range or put your opponent under pressure.',
    category: 'Aktionen',
    related: ['C-Bet', 'Scare Card'],
  },
  {
    term: 'Downswing',
    definition:
      'An extended losing stretch in which results fall well below expected value. Downswings hit winning players too and, depending on the format, can last tens of thousands of hands.',
    category: 'Mathematik',
    related: ['Varianz', 'Upswing', 'Bankroll Management'],
  },
  {
    term: 'Draw',
    definition:
      'An unfinished hand that still needs the right cards to become strong, such as a flush draw or a straight draw. Draws are evaluated using outs, pot odds, and implied odds.',
    category: 'Grundlagen',
    related: ['Outs', 'Flush Draw', 'OESD'],
  },
  {
    term: 'Dry Board',
    definition:
      'An uncoordinated board with no flush draws and few straight possibilities, such as K-7-2 rainbow. On dry boards, small c-bets at a high frequency are standard.',
    category: 'Strategie',
    related: ['Boardtextur', 'Wet Board', 'C-Bet'],
  },
  {
    term: 'Effective Stack',
    definition:
      'The smaller of the stacks involved, which determines the maximum that can be played for in a hand. All considerations of implied odds and commitment refer to the effective stack.',
    category: 'Strategie',
    related: ['Stack', 'SPR', 'Pot Committed'],
  },
  {
    term: 'Equity',
    definition:
      'The percentage share of the pot that a hand is mathematically entitled to based on its chance of winning. With 60 percent equity in a pot of 100, your average share is 60.',
    category: 'Mathematik',
    related: ['EV', 'Outs', 'Coin Flip'],
  },
  {
    term: 'EV',
    definition:
      'Short for expected value: the average profit or loss of a decision if it were repeated many times. Plus-EV decisions are profitable in the long run, regardless of how any single hand turns out.',
    category: 'Mathematik',
    related: ['Equity', 'Pot Odds', 'Varianz'],
  },
  {
    term: 'Final Table',
    definition:
      'The last table of a tournament, where the biggest prizes are decided. ICM considerations dominate at the final table, because every finishing position means a large jump in money.',
    category: 'Turnier',
    related: ['ICM', 'MTT', 'Chip Leader'],
  },
  {
    term: 'Fish',
    definition:
      'A term for a weak recreational player with clear strategic flaws. Fish can often be spotted by playing too many hands, limping, and playing passively.',
    category: 'Slang',
    related: ['Calling Station', 'Whale', 'Regular'],
  },
  {
    term: 'Flat Call',
    definition:
      'Simply calling a bet or raise even though raising is an option. Players flat, for example, to disguise their range, exploit position, or keep weaker players in the hand.',
    category: 'Aktionen',
    related: ['Cold Call', 'Slowplay'],
  },
  {
    term: 'Float',
    definition:
      'Calling a c-bet with a weak hand, intending to take the pot away with a bluff on a later street. Floats work best in position against players who often give up after the flop.',
    category: 'Strategie',
    related: ['C-Bet', 'Bluff', 'Position'],
  },
  {
    term: 'Flop',
    definition:
      'The first three community cards, revealed at the same time and followed by the second betting round. The flop largely defines the character of the hand.',
    category: 'Grundlagen',
    related: ['Turn', 'River', 'Board'],
  },
  {
    term: 'Flush',
    definition:
      'Five cards of the same suit, in any order. A flush beats a straight and loses to a full house; if several players hold a flush, the highest card decides.',
    category: 'Grundlagen',
    related: ['Flush Draw', 'Full House', 'Straight'],
  },
  {
    term: 'Flush Draw',
    definition:
      'Four cards of one suit with nine outs to make the flush. On the flop, a flush draw completes by the river about 35 percent of the time and is excellent material for semi-bluffs.',
    category: 'Grundlagen',
    related: ['Draw', 'Outs', 'Semi-Bluff'],
  },
  {
    term: 'Fold',
    definition:
      'Giving up the hand; the cards are discarded and any bets already made stay in the pot. Disciplined folding is one of the most important skills in poker.',
    category: 'Aktionen',
    related: ['Call', 'Muck', 'Fold Equity'],
  },
  {
    term: 'Fold Equity',
    definition:
      'The share of your expected profit that comes from your opponent folding to a bet. Fold equity makes semi-bluffs profitable even when your draw does not come in.',
    category: 'Strategie',
    related: ['Semi-Bluff', 'Bluff', 'EV'],
  },
  {
    term: 'Four-Bet',
    definition:
      'The fourth level of betting: a raise against a three-bet. Four-bet ranges are typically polarized, consisting of premium hands and selected bluffs.',
    category: 'Aktionen',
    related: ['Three-Bet', 'Polarisiert', 'Raise'],
  },
  {
    term: 'Freeroll',
    definition:
      'A tournament with no buy-in that still pays out prize money or tickets. Freeroll also describes a situation in which a player can only split or win the pot, with no way left to lose.',
    category: 'Turnier',
    related: ['Buy-in', 'Satellite'],
  },
  {
    term: 'Freezeout',
    definition:
      'A tournament format with no rebuys or re-entries: once you lose your chips, you are out for good. The classic among tournament formats, used for example in the WSOP Main Event.',
    category: 'Turnier',
    related: ['Rebuy', 'MTT', 'WSOP'],
  },
  {
    term: 'Full House',
    definition:
      'Three of a kind plus a pair, such as three queens and two fives. A full house beats a flush and loses only to four of a kind, a straight flush, and higher full houses.',
    category: 'Grundlagen',
    related: ['Set', 'Quads', 'Trips'],
  },
  {
    term: 'Grinder',
    definition:
      'A player who treats poker as a source of income through high volume and constant discipline. Grinders often maximize their hourly rate by playing many tables at once or putting in long sessions.',
    category: 'Slang',
    related: ['Regular', 'Win Rate'],
  },
  {
    term: 'GTO',
    definition:
      'Short for Game Theory Optimal: a game-theoretically balanced strategy that cannot be exploited. GTO serves as a foundation; against weak opponents, deliberately deviating from it (exploiting) is more profitable.',
    category: 'Strategie',
    related: ['Solver', 'Range', 'MDF'],
  },
  {
    term: 'Gutshot',
    definition:
      'A straight draw missing exactly one card in the middle, with only four outs. Also called an inside straight draw; often a useful addition to a semi-bluffing range.',
    category: 'Grundlagen',
    related: ['OESD', 'Draw', 'Outs'],
  },
  {
    term: 'Hand History',
    definition:
      'The automatic record of played hands kept by the poker site or tracking software. Hand histories are the basis for database analysis and for systematically studying your own mistakes.',
    category: 'Online',
    related: ['HUD', 'Solver'],
  },
  {
    term: 'Heads-Up',
    definition:
      'A duel between exactly two players, either as its own format or as the final stage of a tournament. Heads-up play requires very wide ranges and considerably more aggression than full-ring play.',
    category: 'Grundlagen',
    related: ['Position', 'Final Table'],
  },
  {
    term: 'Hero Call',
    definition:
      'A brave call with a weak hand that essentially only beats bluffs, based on a strong read that the opponent is bluffing. The counterpart to the disciplined fold.',
    category: 'Aktionen',
    related: ['Crying Call', 'Bluff', 'Tell'],
  },
  {
    term: 'Hijack',
    definition:
      'The position two seats to the right of the button, directly before the cutoff. From the hijack onward, increasingly profitable opportunities to steal the blinds open up.',
    category: 'Grundlagen',
    related: ['Cutoff', 'Button', 'Position'],
  },
  {
    term: 'Hole Cards',
    definition:
      'A player\'s face-down starting cards, exactly two in Texas Hold\'em. Only their owner may see them and combine them with the board to form the best five-card hand.',
    category: 'Grundlagen',
    related: ['Community Cards', 'Texas Hold\'em'],
  },
  {
    term: 'HUD',
    definition:
      'Short for Heads-Up Display: a software overlay that shows real-time statistics about your opponents at the online table. Typical HUD stats are VPIP, PFR, and Aggression Factor.',
    category: 'Online',
    related: ['VPIP', 'PFR', 'Aggression Factor'],
  },
  {
    term: 'ICM',
    definition:
      'The Independent Chip Model converts tournament chips into money value, because chips in a tournament do not gain value linearly. ICM explains why you have to play much tighter on the bubble and at the final table than in a cash game.',
    category: 'Turnier',
    related: ['Bubble', 'Final Table', 'MTT'],
  },
  {
    term: 'Implied Odds',
    definition:
      'Extended pot odds that factor in future winnings if your draw hits. Good implied odds justify calls that would be too expensive on pure pot odds, especially with deep stacks.',
    category: 'Mathematik',
    related: ['Pot Odds', 'Reverse Implied Odds', 'Set Mining'],
  },
  {
    term: 'Isolation',
    definition:
      'A raise aimed at getting heads-up with a weak player, typically against a limper. The iso-raise pushes out the other players and secures the initiative, and usually position as well.',
    category: 'Strategie',
    related: ['Limp', 'Open Raise', 'Fish'],
  },
  {
    term: 'ITM',
    definition:
      'Short for In the Money: reaching the paid places of a tournament. The ITM rate alone says little about success; what matters are deep runs and final-table finishes.',
    category: 'Turnier',
    related: ['Bubble', 'ROI', 'Final Table'],
  },
  {
    term: 'Kicker',
    definition:
      'The side card that breaks the tie between otherwise equal hands. If two players both pair an ace, the higher kicker wins; dominated hands like A5 regularly lose to AK this way.',
    category: 'Grundlagen',
    related: ['Top Pair', 'Showdown'],
  },
  {
    term: 'LAG',
    definition:
      'Short for loose-aggressive: a style with many played hands and high aggression. Executed well, LAG is very profitable, but it demands excellent postflop play and a lot of experience.',
    category: 'Strategie',
    related: ['TAG', 'Loose', 'Maniac'],
  },
  {
    term: 'Limp',
    definition:
      'Merely calling the big blind before the flop instead of raising. Limping is considered weak in most situations, because it neither builds initiative nor creates fold equity.',
    category: 'Aktionen',
    related: ['Open Raise', 'Isolation'],
  },
  {
    term: 'Loose',
    definition:
      'A playing style involving more starting hands than average. Loose play can be aggressive (LAG) or passive (calling station); the opposite is tight.',
    category: 'Strategie',
    related: ['LAG', 'Calling Station', 'VPIP'],
  },
  {
    term: 'Maniac',
    definition:
      'An extremely loose and hyper-aggressive player who plays almost every hand and applies constant pressure. You beat maniacs by patiently calling down with strong hands rather than trying to bluff them.',
    category: 'Slang',
    related: ['LAG', 'Tilt'],
  },
  {
    term: 'MDF',
    definition:
      'Short for Minimum Defense Frequency: the minimum share of your range you must defend against a bet so that your opponent cannot automatically profit by bluffing with anything. Against a pot-sized bet, the MDF is 50 percent.',
    category: 'Mathematik',
    related: ['Fold Equity', 'GTO', 'Pot Odds'],
  },
  {
    term: 'Min-Raise',
    definition:
      'The smallest possible raise, exactly double the previous bet. Min-raises are most common in tournaments with short stacks, as a cheap way to apply pressure.',
    category: 'Aktionen',
    related: ['Raise', 'Open Raise'],
  },
  {
    term: 'MTT',
    definition:
      'Short for Multi-Table Tournament: a tournament spread across many tables and played down to a single winner. MTTs offer big prizes with high variance, because most of the money sits in the top few places.',
    category: 'Turnier',
    related: ['Sit and Go', 'ICM', 'Freezeout'],
  },
  {
    term: 'Muck',
    definition:
      'The pile of discarded and burned cards next to the dealer; as a verb, throwing away your hand without showing it. Once a hand touches the muck, it is generally dead.',
    category: 'Grundlagen',
    related: ['Fold', 'Showdown'],
  },
  {
    term: 'Multiway Pot',
    definition:
      'A pot contested by three or more players. In multiway pots, the value of bluffs and single pairs drops, while draws to the nuts gain value.',
    category: 'Grundlagen',
    related: ['Heads-Up', 'Nuts'],
  },
  {
    term: 'Nit',
    definition:
      'An extremely tight player who plays only premium hands and makes big bets almost exclusively with the nuts. Against nits you should steal frequently and respect their rare aggression.',
    category: 'Slang',
    related: ['TAG', 'Steal', 'Nuts'],
  },
  {
    term: 'Nuts',
    definition:
      'The best possible hand on a given board. If you hold the nuts, you cannot be beaten in that betting round and should build the pot as much as possible.',
    category: 'Grundlagen',
    related: ['Blocker', 'Slowplay'],
  },
  {
    term: 'OESD',
    definition:
      'Short for Open-Ended Straight Draw: a straight draw open at both ends with eight outs, such as 9-8 on 7-6-2. It completes by the river about 31 percent of the time.',
    category: 'Grundlagen',
    related: ['Gutshot', 'Draw', 'Outs'],
  },
  {
    term: 'Offsuit',
    definition:
      'Two starting cards of different suits, written with an o as in AKo. Offsuit hands have twelve combos and slightly less equity and playability than their suited counterparts.',
    category: 'Grundlagen',
    related: ['Suited', 'Combo'],
  },
  {
    term: 'Open Raise',
    definition:
      'The first raise in a preflop round that no one has entered yet. Common sizes range from 2 to 3 big blinds; the right range depends heavily on your position.',
    category: 'Aktionen',
    related: ['Raise', 'Three-Bet', 'Position'],
  },
  {
    term: 'Outs',
    definition:
      'The cards left in the deck that are likely to improve your hand into the winner. With the rule of four and two, you can quickly convert outs into a probability of hitting.',
    category: 'Mathematik',
    related: ['Draw', 'Equity', 'Pot Odds'],
  },
  {
    term: 'Overbet',
    definition:
      'A bet larger than the current pot. Overbets apply maximum pressure and are usually made with a polarized range of very strong hands and bluffs.',
    category: 'Aktionen',
    related: ['Polarisiert', 'Bet Sizing', 'Value Bet'],
  },
  {
    term: 'Overcard',
    definition:
      'A hole card higher than every card on the board, or a board card above your own pair. Two overcards against a smaller pair is the classic coin flip.',
    category: 'Grundlagen',
    related: ['Coin Flip', 'Overpair'],
  },
  {
    term: 'Overpair',
    definition:
      'A pocket pair higher than every community card, such as QQ on J-8-3. Overpairs are usually strong, but they quickly come under pressure on coordinated boards.',
    category: 'Grundlagen',
    related: ['Pocket Pair', 'Top Pair', 'Wet Board'],
  },
  {
    term: 'PFR',
    definition:
      'Short for Preflop Raise: the percentage of hands a player raises before the flop. Together with VPIP, PFR characterizes a playing style; a large gap between the two values points to passive play.',
    category: 'Online',
    related: ['VPIP', 'HUD', 'Aggression Factor'],
  },
  {
    term: 'Pocket Pair',
    definition:
      'Two hole cards of the same rank, such as two eights. Small pocket pairs are often played for set mining, while big pocket pairs count among the premium hands.',
    category: 'Grundlagen',
    related: ['Set', 'Set Mining', 'Overpair'],
  },
  {
    term: 'Polarisiert',
    definition:
      'A range consisting only of very strong hands and bluffs, with no medium-strength hands in between. Polarized ranges bet big; the opposite is a condensed or merged range.',
    category: 'Strategie',
    related: ['Range', 'Overbet', 'Four-Bet'],
  },
  {
    term: 'Position',
    definition:
      'The seating order relative to the button, which determines who acts last in the betting rounds. Being in position lets you see your opponents\' actions first, allowing you to realize considerably more equity.',
    category: 'Strategie',
    related: ['Button', 'Cutoff', 'Under the Gun'],
  },
  {
    term: 'Pot Committed',
    definition:
      'The state in which the share of your stack already invested is so large that folding can hardly ever be mathematically correct anymore. A pot-committed player calls virtually any remaining bet.',
    category: 'Strategie',
    related: ['Pot Odds', 'SPR', 'All-in'],
  },
  {
    term: 'Pot Odds',
    definition:
      'The ratio between the size of the pot and the bet you have to call, converted into the win probability you need. If you must pay 20 into a pot of 80, you need 20 percent equity to call.',
    category: 'Mathematik',
    related: ['Implied Odds', 'Equity', 'Outs'],
  },
  {
    term: 'Preflop',
    definition:
      'The first betting round, after the hole cards are dealt and before the flop. Preflop decisions largely follow standardized ranges based on position.',
    category: 'Grundlagen',
    related: ['Flop', 'Open Raise', 'Hole Cards'],
  },
  {
    term: 'Probe Bet',
    definition:
      'A bet made out of position on the turn or river after the preflop aggressor declined to c-bet the flop. The probe bet directly attacks the weakness they have shown.',
    category: 'Aktionen',
    related: ['C-Bet', 'Donk Bet'],
  },
  {
    term: 'Protection',
    definition:
      'Betting with a made but vulnerable hand so that draws and overcards do not get to see cheap additional cards. Protection is especially important on wet boards.',
    category: 'Strategie',
    related: ['Value Bet', 'Wet Board', 'Draw'],
  },
  {
    term: 'Quads',
    definition:
      'Four of a kind: all four cards of one rank, such as four kings. Quads are beaten only by a straight flush or higher quads, and are accordingly rare.',
    category: 'Grundlagen',
    related: ['Full House', 'Set'],
  },
  {
    term: 'Rainbow',
    definition:
      'A flop with three different suits, on which no immediate flush draw is possible. Rainbow boards tend to be dry and often favor the preflop aggressor.',
    category: 'Grundlagen',
    related: ['Dry Board', 'Boardtextur'],
  },
  {
    term: 'Raise',
    definition:
      'Increasing an existing bet. A raise builds the pot, creates fold equity, and forces opponents into difficult decisions.',
    category: 'Aktionen',
    related: ['Open Raise', 'Check-Raise', 'Three-Bet'],
  },
  {
    term: 'Rake',
    definition:
      'The fee the operator keeps from the pot or from the tournament buy-in. Rake lowers every player\'s win rate; rakeback programs return part of it.',
    category: 'Grundlagen',
    related: ['Buy-in', 'Win Rate'],
  },
  {
    term: 'Range',
    definition:
      'The complete set of hands a player can plausibly hold in a given situation. Good players do not think in terms of single hands; they assign their opponents ranges and narrow them with every action.',
    category: 'Strategie',
    related: ['Combo', 'Polarisiert', 'GTO'],
  },
  {
    term: 'Rebuy',
    definition:
      'Buying additional chips in tournaments that offer the option, usually limited to a fixed early phase. With the related re-entry, you enter the tournament again from scratch after being eliminated.',
    category: 'Turnier',
    related: ['Freezeout', 'Buy-in'],
  },
  {
    term: 'Regular',
    definition:
      'A regular player who plays the same stakes frequently, usually with solid, standard play. Reg for short; the counterpart to the recreational player.',
    category: 'Slang',
    related: ['Grinder', 'Fish', 'TAG'],
  },
  {
    term: 'Reverse Implied Odds',
    definition:
      'The risk of losing additional money on later streets even though your hand hits, because your opponent then holds an even better hand. Typical of dominated draws such as small flush draws.',
    category: 'Mathematik',
    related: ['Implied Odds', 'Kicker', 'Draw'],
  },
  {
    term: 'River',
    definition:
      'The fifth and final community card, followed by the last betting round. There are no more draws on the river; every bet is either value or a bluff.',
    category: 'Grundlagen',
    related: ['Turn', 'Showdown', 'Board'],
  },
  {
    term: 'River Rat',
    definition:
      'A mocking term for a player who calls along with weak draws and strikingly often hits the winning hand only on the river. The term belongs to the same family as suckout and bad beat.',
    category: 'Slang',
    related: ['Suckout', 'Bad Beat', 'Fish'],
  },
  {
    term: 'ROI',
    definition:
      'Short for Return on Investment: the average profit relative to the buy-in invested, usually given as a percentage. A tournament ROI of 20 percent means an average profit of 20 per 100 in buy-ins.',
    category: 'Mathematik',
    related: ['Win Rate', 'ITM', 'Buy-in'],
  },
  {
    term: 'Royal Flush',
    definition:
      'The highest possible hand: a straight flush from ten to ace in one suit. A royal flush is unbeatable and extremely rare.',
    category: 'Grundlagen',
    related: ['Straight', 'Flush', 'Nuts'],
  },
  {
    term: 'Run it Twice',
    definition:
      'An agreement, after an all-in, to deal the remaining cards twice and play out the pot in two halves. This reduces variance without changing the expected value.',
    category: 'Live',
    related: ['All-in', 'Varianz'],
  },
  {
    term: 'Runner-Runner',
    definition:
      'A draw that needs the turn and river to bring two matching cards in a row, such as a backdoor flush. Runner-runner hits are rare and a frequent source of bad-beat stories.',
    category: 'Grundlagen',
    related: ['Backdoor', 'Suckout'],
  },
  {
    term: 'Rush/Zoom',
    definition:
      'Fast-fold poker variants in which you are moved to a new table with a new hand the moment you fold. The format multiplies your hand volume and reduces the importance of reads and history.',
    category: 'Online',
    related: ['Hand History', 'Grinder'],
  },
  {
    term: 'Satellite',
    definition:
      'A qualifying tournament whose prizes are tickets to a more expensive tournament instead of money. In a satellite, all that matters is reaching the ticket places, which requires extreme ICM adjustments.',
    category: 'Turnier',
    related: ['ICM', 'Buy-in', 'WSOP'],
  },
  {
    term: 'Scare Card',
    definition:
      'A turn or river card that completes many draws or suddenly threatens strong hands, such as a third card of one suit or an ace. Scare cards are good candidates for bluffs.',
    category: 'Strategie',
    related: ['Blank', 'Boardtextur', 'Double Barrel'],
  },
  {
    term: 'Semi-Bluff',
    definition:
      'A bet with a draw that is currently behind but can become the best hand. Semi-bluffs win in two ways: immediately when the opponent folds, or later by hitting the draw.',
    category: 'Strategie',
    related: ['Bluff', 'Fold Equity', 'Flush Draw'],
  },
  {
    term: 'Set',
    definition:
      'Three of a kind made from a pocket pair and a matching board card. Sets are well disguised and among the most profitable hands in No-Limit Hold\'em.',
    category: 'Grundlagen',
    related: ['Trips', 'Set Mining', 'Pocket Pair'],
  },
  {
    term: 'Set Mining',
    definition:
      'Calling with small pocket pairs before the flop purely in the hope of hitting a set. The chance of hitting is around 12 percent, so set mining needs deep stacks and good implied odds.',
    category: 'Strategie',
    related: ['Set', 'Implied Odds', 'Pocket Pair'],
  },
  {
    term: 'Short Stack',
    definition:
      'A comparatively small stack, roughly 40 big blinds or less in cash games and often under 20 in tournaments. Short stacks simplify the game toward push-or-fold and devalue speculative hands.',
    category: 'Strategie',
    related: ['Deep Stack', 'All-in', 'Stack'],
  },
  {
    term: 'Showdown',
    definition:
      'The revealing of hands after the final betting round, when at least two players remain. The best five-card hand wins the pot; on a tie, it is split.',
    category: 'Grundlagen',
    related: ['Muck', 'River', 'Chop'],
  },
  {
    term: 'Showdown Value',
    definition:
      'The value of a hand that will occasionally win at showdown but is too weak for a value bet, such as a middle pair. Hands with showdown value are usually checked rather than turned into bluffs.',
    category: 'Strategie',
    related: ['Value Bet', 'Bluff', 'Showdown'],
  },
  {
    term: 'Side Pot',
    definition:
      'A secondary pot created when one player is all-in and the remaining players keep betting. The all-in player can only win the main pot they are part of.',
    category: 'Grundlagen',
    related: ['All-in', 'Chop'],
  },
  {
    term: 'Sit and Go',
    definition:
      'A tournament with no fixed start time that begins as soon as enough players have registered, often at a single table. Classic sit and gos pay the top three places.',
    category: 'Turnier',
    related: ['MTT', 'Heads-Up', 'ICM'],
  },
  {
    term: 'Slowplay',
    definition:
      'Deliberately playing a very strong hand passively to lull opponents into a false sense of security and cash in later. Slowplaying pays off mainly on dry boards against aggressive opponents; on wet boards it is risky.',
    category: 'Strategie',
    related: ['Check-Raise', 'Nuts', 'Dry Board'],
  },
  {
    term: 'Snap Call',
    definition:
      'An instant call without a moment\'s thought, usually with a very strong hand or in a clear-cut situation. In live play, the speed of an action can itself be a tell.',
    category: 'Slang',
    related: ['Tell', 'Hero Call'],
  },
  {
    term: 'Solver',
    definition:
      'Software that computes approximately game-theory-optimal strategies for defined game situations. Solvers have shaped modern poker study, but they are no substitute for understanding the fundamentals.',
    category: 'Online',
    related: ['GTO', 'Range', 'Hand History'],
  },
  {
    term: 'SPR',
    definition:
      'Short for Stack-to-Pot Ratio: the ratio of the effective stack to the pot size on the flop. A low SPR favors committing with one pair, while a high SPR demands stronger hands for big pots.',
    category: 'Mathematik',
    related: ['Effective Stack', 'Pot Committed'],
  },
  {
    term: 'Squeeze',
    definition:
      'A three-bet against an open raise plus at least one caller. The squeeze exploits the dead money in the pot and the capped ranges of players who just called.',
    category: 'Aktionen',
    related: ['Three-Bet', 'Dead Money', 'Cold Call'],
  },
  {
    term: 'Stack',
    definition:
      'All of a player\'s chips at the table. Stack size, measured in big blinds, is a major factor in determining correct strategy.',
    category: 'Grundlagen',
    related: ['Effective Stack', 'Short Stack', 'Deep Stack'],
  },
  {
    term: 'Steal',
    definition:
      'A raise from late position whose primary goal is to pick up the blinds and antes without a fight. As the blinds rise, steals become a key source of profit in tournaments.',
    category: 'Strategie',
    related: ['Blinds', 'Cutoff', 'Button'],
  },
  {
    term: 'Straddle',
    definition:
      'A voluntary blind bet of twice the big blind, posted before the deal, usually from the seat to the left of the big blind. In return, the straddler acts last preflop; in effect, a straddle doubles the stakes.',
    category: 'Live',
    related: ['Blinds', 'Position'],
  },
  {
    term: 'Straight',
    definition:
      'Five cards in unbroken sequence, regardless of suit, such as 5-6-7-8-9. The ace can play high (Broadway) or low (the wheel: A-2-3-4-5).',
    category: 'Grundlagen',
    related: ['Broadway', 'OESD', 'Gutshot'],
  },
  {
    term: 'String Bet',
    definition:
      'An illegal bet made in several installments without announcing it first. In live poker, only the first motion counts; the rule prevents players from reading opponents\' reactions between the partial amounts.',
    category: 'Live',
    related: ['Angle Shooting', 'Tell'],
  },
  {
    term: 'Suckout',
    definition:
      'Winning a hand as a clear underdog thanks to a lucky late card. From the loser\'s point of view, the same event is a bad beat.',
    category: 'Slang',
    related: ['Bad Beat', 'River Rat', 'Runner-Runner'],
  },
  {
    term: 'Suited',
    definition:
      'Two starting cards of the same suit, written with an s as in AKs. Suited hands have four combos and, thanks to their flush potential, more equity and playability than offsuit hands.',
    category: 'Grundlagen',
    related: ['Offsuit', 'Suited Connectors', 'Flush Draw'],
  },
  {
    term: 'Suited Connectors',
    definition:
      'Consecutive cards of the same suit, such as 87s. They make straights and flushes and play best in position with deep stacks and good implied odds.',
    category: 'Grundlagen',
    related: ['Suited', 'Implied Odds', 'Deep Stack'],
  },
  {
    term: 'Table Image',
    definition:
      'The picture your opponents have of your playing style, shaped by the hands you have shown and the frequencies they have observed. A tight image makes your bluffs more credible; a wild image gets your value hands more action.',
    category: 'Strategie',
    related: ['Tell', 'Bluff', 'Value Bet'],
  },
  {
    term: 'TAG',
    definition:
      'Short for tight-aggressive: a style built on carefully selected starting hands that are then played with consistent aggression. TAG is considered a solid foundation for beginners and low stakes.',
    category: 'Strategie',
    related: ['LAG', 'Nit', 'Regular'],
  },
  {
    term: 'Tell',
    definition:
      'An unconscious behavior that reveals something about hand strength, such as trembling, breathing, or the speed of a bet. Live tells are valuable, but they should only supplement your strategy, not replace it.',
    category: 'Live',
    related: ['Table Image', 'Snap Call'],
  },
  {
    term: 'Texas Hold\'em',
    definition:
      'The world\'s most popular poker variant: two face-down hole cards, up to five community cards, and four betting rounds. It is usually played with no cap on bets, as No-Limit Hold\'em.',
    category: 'Grundlagen',
    related: ['Hole Cards', 'Community Cards'],
  },
  {
    term: 'Three-Bet',
    definition:
      'The third level of betting: a raise against an open raise, with the big blind counting as the first bet. Three-bets are made for value and as bluffs, and they are a cornerstone of aggressive preflop strategy.',
    category: 'Aktionen',
    related: ['Open Raise', 'Four-Bet', 'Squeeze'],
  },
  {
    term: 'Tilt',
    definition:
      'An emotional state, usually after bad beats or losing streaks, in which decisions are driven by frustration instead of logic. Tilt control is a crucial part of the mental game; when in doubt, take a break.',
    category: 'Slang',
    related: ['Bad Beat', 'Downswing', 'Varianz'],
  },
  {
    term: 'Time Bank',
    definition:
      'An extra time allowance for difficult decisions in online poker that extends the normal thinking time. Depending on the format, the time bank is refilled per hand or per level.',
    category: 'Online',
    related: ['Snap Call', 'Rush/Zoom'],
  },
  {
    term: 'Top Pair',
    definition:
      'A pair made with the highest card on the board, such as AK on A-9-4. Top pair with a good kicker is usually a value hand for one or two betting rounds, but rarely for a huge pot.',
    category: 'Grundlagen',
    related: ['Kicker', 'Overpair', 'Value Bet'],
  },
  {
    term: 'Trips',
    definition:
      'Three of a kind made from one of your own cards and a pair on the board. Trips are more obvious and, because of possible kicker problems, slightly weaker than a set.',
    category: 'Grundlagen',
    related: ['Set', 'Kicker'],
  },
  {
    term: 'Turn',
    definition:
      'The fourth community card, followed by the third betting round. Bet sizes grow considerably on the turn, and both players\' ranges narrow substantially.',
    category: 'Grundlagen',
    related: ['Flop', 'River', 'Double Barrel'],
  },
  {
    term: 'Under the Gun',
    definition:
      'The position directly to the left of the big blind, first to act preflop. UTG requires the tightest opening range, because every other player still acts behind you.',
    category: 'Grundlagen',
    related: ['Position', 'Open Raise'],
  },
  {
    term: 'Upswing',
    definition:
      'A stretch in which results run well above expected value. Upswings feel like skill, but they are just as much a product of variance as downswings.',
    category: 'Mathematik',
    related: ['Downswing', 'Varianz'],
  },
  {
    term: 'Value Bet',
    definition:
      'A bet made with what is probably the best hand, intended to get paid off by worse hands. The art lies in choosing a size that extracts the maximum from your opponent\'s range.',
    category: 'Aktionen',
    related: ['Bluff', 'Bet Sizing', 'Showdown Value'],
  },
  {
    term: 'Varianz',
    definition:
      'The natural fluctuation of results around the expected value, known as variance. Because of variance, short periods say almost nothing about skill; what counts is long-term EV.',
    category: 'Mathematik',
    related: ['EV', 'Downswing', 'Upswing'],
  },
  {
    term: 'Villain',
    definition:
      'A neutral term for the opponent in a hand discussion, while the player under review is called Hero. The term is not a judgment; it simply structures the analysis.',
    category: 'Slang',
    related: ['Hero Call', 'Range'],
  },
  {
    term: 'VPIP',
    definition:
      'Short for Voluntarily Put Money In Pot: the percentage of hands in which a player voluntarily invests money. VPIP is the key measure of how loose a player is; solid regulars usually sit at 20 to 28 percent.',
    category: 'Online',
    related: ['PFR', 'HUD', 'Loose'],
  },
  {
    term: 'Wet Board',
    definition:
      'A highly coordinated board with many possible draws, such as 9-8-7 with two cards of one suit. On wet boards, larger bets for protection are standard, and equities run much closer together.',
    category: 'Strategie',
    related: ['Dry Board', 'Boardtextur', 'Protection'],
  },
  {
    term: 'Whale',
    definition:
      'A very weak player with very deep pockets who loses large sums at high stakes. Whales are often the reason entire high-stakes cash games get going in the first place.',
    category: 'Slang',
    related: ['Fish', 'Calling Station'],
  },
  {
    term: 'Win Rate',
    definition:
      'The average rate of winning, in cash games usually measured in big blinds per 100 hands (bb/100). Because of variance, a reliable win rate requires very large samples.',
    category: 'Mathematik',
    related: ['ROI', 'Varianz', 'EV'],
  },
  {
    term: 'WSOP',
    definition:
      'The World Series of Poker in Las Vegas, the biggest and most storied tournament series in the world, with the Main Event as its centerpiece. Winners receive, alongside the prize money, a bracelet, the most prestigious trophy in poker.',
    category: 'Turnier',
    related: ['MTT', 'Freezeout', 'Satellite'],
  },
];

export default glossary;
