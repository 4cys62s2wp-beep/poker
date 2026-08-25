import { defineStrings } from '..';

export const STR = defineStrings(
  {
    // Upgrade-Seite
    eyebrow: 'PokerMentor Pro',
    title: 'Hör auf zu raten. Fang an zu wissen.',
    sub: 'Die Gratis-Version bringt dir die Grundlagen bei. Pro macht dich zu dem Spieler, gegen den am Tisch keiner gern sitzt.',
    monthly: 'Monatlich',
    annual: 'Jährlich',
    perMonth: 'pro Monat',
    perYear: 'pro Jahr',
    billedAnnually: (price: string) => `${price} jährlich abgerechnet`,
    // § 312j BGB: Der Bestell-Button MUSS die Zahlungspflicht ausdrücken.
    cta: 'Zahlungspflichtig abonnieren',
    ctaTrial: 'Zahlungspflichtig abonnieren',
    manage: 'Abo verwalten',
    cancelLink: 'Verträge hier kündigen',
    reassure: 'Jederzeit kündbar. Kein Echtgeld-Glücksspiel, keine Werbung, kein Datenverkauf.',
    securePay: 'Sichere Zahlung · Apple Pay, Google Pay, Karte, PayPal, SEPA',
    // § 312j BGB: Pflichtangaben unmittelbar über dem Bestell-Button.
    checkoutSummaryTitle: 'Das bestellst du',
    checkoutSummary: (price: string, period: string) =>
      `PokerMentor Pro – voller Zugriff auf alle Lerninhalte, den unbegrenzten Live-Coach, alle Trainer und die Geräte-Synchronisation. Gesamtpreis ${price} ${period}, inklusive Mehrwertsteuer. Das Abo verlängert sich automatisch um denselben Zeitraum und ist jederzeit zum Ende des laufenden Abrechnungszeitraums kündbar.`,
    periodMonthly: 'pro Monat',
    periodAnnual: 'pro Jahr',
    vatNote: 'Alle Preise inkl. MwSt.',
    perMonthEquivalent: (price: string) => `entspricht ${price} im Monat`,

    // Status
    activeTitle: 'Du bist Pro',
    activeSub: 'Danke, dass du PokerMentor unterstützt. Alle Inhalte und Werkzeuge sind für dich freigeschaltet.',
    trialTitle: (days: number) => `Deine Pro-Testphase läuft – noch ${days} ${days === 1 ? 'Tag' : 'Tage'}`,
    trialSub: 'Du hast gerade vollen Zugriff auf alles. Danach bleibt die Gratis-Version erhalten – dein Fortschritt geht nie verloren.',

    // Nutzen
    benefitsTitle: 'Das bekommst du mit Pro',
    benefits: [
      { t: 'Alle 9 Module statt 4', d: 'Postflop, Ranges & GTO, Psychologie, Live-Poker, Online-Poker und alle Varianten – über 30 zusätzliche Lektionen.' },
      { t: 'Live-Coach ohne Limit', d: 'Am Pokerabend jede Hand durchrechnen lassen, statt drei pro Tag. Street für Street, mit Begründung.' },
      { t: 'Szenario- & Push/Fold-Trainer', d: '24 handgeschriebene Spots und die Turnier-Endgame-Ranges – genau die Situationen, die Geld kosten.' },
      { t: 'Pro-Insights', d: 'Die Prinzipien von Fedor Holz, Negreanu, Polk & Co. – verdichtet, geprüft, anwendbar.' },
      { t: 'Übungstisch ohne Limit', d: 'Unbegrenzt Hände gegen die KI – mit Coach-Overlay: Equity, Pot Odds und Handstärke live.' },
      { t: 'Intelligentes Wiederholen', d: 'Falsch beantwortete Fragen kommen automatisch wieder – im wissenschaftlich optimalen Abstand.' },
      { t: 'Bankroll ohne Limit + Export', d: 'Alle Sessions erfassen, auswerten und als CSV mitnehmen.' },
      { t: 'Auf allen Geräten', d: 'Fortschritt sicher in der Cloud, synchron auf Handy, Tablet und Laptop.' },
    ],

    // Vergleich
    compareTitle: 'Gratis und Pro im Vergleich',
    compareFeature: 'Funktion',
    compareFree: 'Gratis',
    comparePro: 'Pro',
    rows: [
      ['Lernmodule', '4 von 9 · überall Lektion 1', 'Alle 9'],
      ['Live-Coach', '3 Hände / Tag', 'Unbegrenzt'],
      ['Übungstisch', '25 Hände / Tag', 'Unbegrenzt'],
      ['Trainer', '5 von 7', 'Alle 7'],
      ['Chip-Rechner & Glossar', 'Voll enthalten', 'Voll enthalten'],
      ['Tells & Starthände', 'Voll enthalten', 'Voll enthalten'],
      ['Pro-Insights', '–', 'Enthalten'],
      ['Wiederholen (Spaced Repetition)', '–', 'Enthalten'],
      ['Bankroll-Tracker', '15 Sessions', 'Unbegrenzt + CSV'],
      ['Geräte-Sync', '–', 'Enthalten'],
    ],

    // FAQ
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: 'Kann ich jederzeit kündigen?', a: 'Ja. Ein Klick im Kundenportal, keine Frist, keine Rückfragen. Du behältst Pro bis zum Ende des bezahlten Zeitraums.' },
      { q: 'Was passiert mit meinem Fortschritt, wenn ich kündige?', a: 'Nichts geht verloren. XP, Level, Abzeichen, Statistiken und deine Bankroll-Daten bleiben vollständig erhalten und lesbar – du siehst danach wieder die Gratis-Version.' },
      { q: 'Spiele ich hier um echtes Geld?', a: 'Nein, niemals. PokerMentor ist eine reine Lern-App mit Spielgeld. Es gibt kein Echtgeldspiel, keine Ein- oder Auszahlungen und keine Verbindung zu Glücksspielanbietern.' },
      { q: 'Wie wird bezahlt?', a: 'Über Stripe – mit Apple Pay, Google Pay, Kreditkarte, PayPal oder SEPA-Lastschrift. Deine Zahlungsdaten sehen wir nie.' },
      { q: 'Brauche ich ein Konto?', a: 'Für Pro ja, damit dein Abo auf allen Geräten funktioniert. Die Gratis-Version läuft auch komplett ohne Konto.' },
    ],

    // Sperren & Limits
    lockedTitle: 'Pro-Funktion',
    lockedGeneric: 'Diese Funktion gehört zu PokerMentor Pro.',
    lockedModule: 'Diese Lektion gehört zu Pro. Vier Module sind komplett gratis – und die erste Lektion jedes Moduls ebenfalls.',
    lockedTrainer: 'Dieser Trainer gehört zu Pro. Fünf weitere Trainer sind gratis.',
    unlock: 'Pro ansehen',
    limitTitle: 'Tageslimit erreicht',
    limitCoach: 'Du hast deine 3 Gratis-Coach-Hände für heute genutzt. Morgen gibt es wieder drei – oder du schaltest Pro frei und rechnest jede Hand durch.',
    limitPlay: 'Du hast deine 25 Gratis-Hände für heute gespielt. Morgen geht es weiter – mit Pro sofort und unbegrenzt.',
    limitBankroll: 'Der Gratis-Tracker fasst 15 Sessions. Mit Pro erfasst du unbegrenzt viele und exportierst sie als CSV.',
    remaining: (n: number, total: number) => `Noch ${n} von ${total} heute gratis`,
    later: 'Später',

    // Navigation & Hinweise
    navPro: 'Pro',
    trialBadge: (days: number) => `Pro-Test: ${days} ${days === 1 ? 'Tag' : 'Tage'}`,
    proBadge: 'Pro',
    upgradeNudge: 'Auf Pro upgraden',
  },
  {
    eyebrow: 'PokerMentor Pro',
    title: 'Stop guessing. Start knowing.',
    sub: 'The free version teaches you the fundamentals. Pro turns you into the player nobody wants to sit next to.',
    monthly: 'Monthly',
    annual: 'Yearly',
    perMonth: 'per month',
    perYear: 'per year',
    billedAnnually: (price: string) => `billed ${price} per year`,
    cta: 'Subscribe – payment required',
    ctaTrial: 'Subscribe – payment required',
    manage: 'Manage subscription',
    cancelLink: 'Cancel your contract here',
    reassure: 'Cancel anytime. No real-money gambling, no ads, no data selling.',
    securePay: 'Secure payment · Apple Pay, Google Pay, card, PayPal, SEPA',
    checkoutSummaryTitle: 'What you’re ordering',
    checkoutSummary: (price: string, period: string) =>
      `PokerMentor Pro – full access to all lessons, the unlimited Live Coach, every trainer and device sync. Total price ${price} ${period}, VAT included. The subscription renews automatically for the same period and can be cancelled at any time, effective at the end of the current billing period.`,
    periodMonthly: 'per month',
    periodAnnual: 'per year',
    vatNote: 'All prices include VAT.',
    perMonthEquivalent: (price: string) => `that’s ${price} per month`,

    activeTitle: 'You’re Pro',
    activeSub: 'Thanks for supporting PokerMentor. Every lesson and tool is unlocked for you.',
    trialTitle: (days: number) => `Your Pro trial is running – ${days} ${days === 1 ? 'day' : 'days'} left`,
    trialSub: 'You have full access right now. Afterwards the free version stays – your progress is never lost.',

    benefitsTitle: 'What you get with Pro',
    benefits: [
      { t: 'All 9 modules instead of 4', d: 'Postflop, ranges & GTO, psychology, live poker, online poker and every variant – over 30 extra lessons.' },
      { t: 'Unlimited Live Coach', d: 'Run every hand at poker night, not three a day. Street by street, with the reasoning.' },
      { t: 'Scenario & push/fold trainers', d: '24 hand-written spots plus tournament endgame ranges – exactly the situations that cost money.' },
      { t: 'Pro Insights', d: 'The principles of Fedor Holz, Negreanu, Polk & co. – condensed, verified, applicable.' },
      { t: 'Unlimited practice table', d: 'Play as many hands against the AI as you like – with the coach overlay: live equity, pot odds and hand strength.' },
      { t: 'Smart review', d: 'Questions you got wrong come back automatically, at scientifically optimal intervals.' },
      { t: 'Unlimited bankroll + export', d: 'Track every session, analyse it, and take it with you as CSV.' },
      { t: 'On all your devices', d: 'Progress safely in the cloud, in sync across phone, tablet and laptop.' },
    ],

    compareTitle: 'Free vs Pro',
    compareFeature: 'Feature',
    compareFree: 'Free',
    comparePro: 'Pro',
    rows: [
      ['Learning modules', '4 of 9 · lesson 1 everywhere', 'All 9'],
      ['Live Coach', '3 hands / day', 'Unlimited'],
      ['Practice table', '25 hands / day', 'Unlimited'],
      ['Trainers', '5 of 7', 'All 7'],
      ['Chip calculator & glossary', 'Fully included', 'Fully included'],
      ['Tells & starting hands', 'Fully included', 'Fully included'],
      ['Pro Insights', '–', 'Included'],
      ['Review (spaced repetition)', '–', 'Included'],
      ['Bankroll tracker', '15 sessions', 'Unlimited + CSV'],
      ['Device sync', '–', 'Included'],
    ],

    faqTitle: 'Frequently asked',
    faq: [
      { q: 'Can I cancel anytime?', a: 'Yes. One click in the customer portal, no notice period, no questions. You keep Pro until the end of the period you paid for.' },
      { q: 'What happens to my progress if I cancel?', a: 'Nothing is lost. XP, levels, badges, statistics and your bankroll data all stay intact and readable – you simply see the free version again.' },
      { q: 'Am I playing for real money here?', a: 'No, never. PokerMentor is a pure learning app with play money. There is no real-money play, no deposits or withdrawals, and no connection to gambling operators.' },
      { q: 'How do I pay?', a: 'Through Stripe – with Apple Pay, Google Pay, credit card, PayPal or SEPA direct debit. We never see your payment details.' },
      { q: 'Do I need an account?', a: 'For Pro yes, so your subscription works across devices. The free version runs entirely without an account.' },
    ],

    lockedTitle: 'Pro feature',
    lockedGeneric: 'This feature is part of PokerMentor Pro.',
    lockedModule: 'This lesson is part of Pro. Four modules are completely free – and so is the first lesson of every module.',
    lockedTrainer: 'This trainer is part of Pro. Five other trainers are free.',
    unlock: 'See Pro',
    limitTitle: 'Daily limit reached',
    limitCoach: 'You’ve used your 3 free coach hands for today. Three more tomorrow – or unlock Pro and run every single hand.',
    limitPlay: 'You’ve played your 25 free hands for today. More tomorrow – with Pro, right now and without limits.',
    limitBankroll: 'The free tracker holds 15 sessions. With Pro you track unlimited sessions and export them as CSV.',
    remaining: (n: number, total: number) => `${n} of ${total} free left today`,
    later: 'Later',

    navPro: 'Pro',
    trialBadge: (days: number) => `Pro trial: ${days}d`,
    proBadge: 'Pro',
    upgradeNudge: 'Upgrade to Pro',
  },
);
