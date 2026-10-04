import { defineStrings } from '..';
import type { VergleichsZahlen } from '../../lib/pro/vergleich';

export const STR = defineStrings(
  {
    // Upgrade-Seite
    title: 'Hör auf zu raten. Fang an zu wissen.',
    sub: 'Die Gratis-Version bringt dir die Grundlagen bei. Pro geht in die Tiefe: Postflop, Fortgeschrittenes, Turnierendspiel und mehr Übung am Tag.',
    monthly: 'Monatlich',
    annual: 'Jährlich',
    perMonth: 'pro Monat',
    perYear: 'pro Jahr',
    // § 312j BGB: Der Bestell-Button MUSS die Zahlungspflicht ausdrücken.
    cta: 'Zahlungspflichtig abonnieren',
    ctaTrial: 'Zahlungspflichtig abonnieren',
    ctaBusy: 'Einen Moment …',
    errorSignIn: 'Bitte melde dich zuerst an – sonst lässt sich das Abo keinem Konto zuordnen.',
    errorCheckout: 'Der Bezahlvorgang lässt sich gerade nicht öffnen. Bitte versuche es später noch einmal.',
    manage: 'Abo verwalten',
    manageNative: 'In den Einstellungen verwalten',
    cancelLink: 'Verträge hier kündigen',
    reassure: 'Jederzeit kündbar. Kein Echtgeld-Glücksspiel, keine Werbung, kein Datenverkauf.',
    securePay: 'Sichere Zahlung · Apple Pay, Google Pay, Karte, PayPal, SEPA',
    // § 312j BGB: Pflichtangaben unmittelbar über dem Bestell-Button.
    checkoutSummaryTitle: 'Das bestellst du',
    checkoutSummary: (price: string, period: string) =>
      `PokerMentor Pro – voller Zugriff auf alle Lerninhalte und Trainer, den unbegrenzten Live-Coach und den Übungstisch ohne Tageslimit. Gesamtpreis ${price} ${period}, inklusive Mehrwertsteuer. Das Abo verlängert sich automatisch um denselben Zeitraum und ist jederzeit zum Ende des laufenden Abrechnungszeitraums kündbar.`,
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
    benefits: (z: VergleichsZahlen) => [
      { t: `Alle ${z.moduleAlle} Module statt ${z.moduleFrei}`, d: `Postflop-Spiel, Fortgeschrittene Konzepte, Live-Poker, Online-Poker und Varianten – ${z.lektionenMehr} zusätzliche Lektionen.` },
      { t: 'Live-Coach ohne Limit', d: `Am Pokerabend jede Hand durchrechnen lassen, statt ${z.coachProTag} pro Tag. Street für Street, mit Begründung.` },
      { t: 'Szenario- und Push/Fold-Trainer', d: `${z.spots} handgeschriebene Spots und die Turnier-Endgame-Ranges – mit der Begründung zu jeder Antwort.` },
      { t: 'Pro-Insights', d: `Die Prinzipien von ${z.profile} Profis – verdichtet, geprüft, anwendbar.` },
      { t: 'Übungstisch ohne Limit', d: `So viele Hände gegen die Computergegner, wie du magst – statt ${z.tischProTag} pro Tag.` },
    ],

    // Vergleich
    compareTitle: 'Gratis und Pro im Vergleich',
    compareFeature: 'Funktion',
    compareFree: 'Gratis',
    comparePro: 'Pro',
    rows: (z: VergleichsZahlen) => [
      ['Lernmodule', `${z.moduleFrei} von ${z.moduleAlle} · überall Lektion 1`, `Alle ${z.moduleAlle}`],
      ['Trainer', `${z.trainerFrei} von ${z.trainerAlle}`, `Alle ${z.trainerAlle}`],
      ['Live-Coach', `${z.coachProTag} Hände / Tag`, 'Unbegrenzt'],
      ['Übungstisch', `${z.tischProTag} Hände / Tag`, 'Unbegrenzt'],
      ['Pro-Insights', '–', 'Enthalten'],
      ['Wiederholen, Tages-Quiz, Coach am Tisch', 'Enthalten', 'Enthalten'],
      ['Bankroll, Export, Konto und Sicherung', 'Enthalten', 'Enthalten'],
      ['Chip-Rechner, Glossar, Tells, Starthände', 'Enthalten', 'Enthalten'],
    ],

    // FAQ
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: 'Kann ich jederzeit kündigen?', a: 'Ja. Ein Klick im Kundenportal, keine Frist, keine Rückfragen. Du behältst Pro bis zum Ende des bezahlten Zeitraums.' },
      { q: 'Was passiert mit meinem Fortschritt, wenn ich kündige?', a: 'Nichts geht verloren. XP, Level, Abzeichen, Statistiken und deine Bankroll-Daten bleiben vollständig erhalten und lesbar – du siehst danach wieder die Gratis-Version.' },
      { q: 'Spiele ich hier um echtes Geld?', a: 'Nein, niemals. PokerMentor ist eine reine Lern-App mit Spielgeld. Es gibt kein Echtgeldspiel, keine Ein- oder Auszahlungen und keine Verbindung zu Glücksspielanbietern.' },
      { q: 'Wie wird bezahlt?', a: 'Über Stripe – mit Apple Pay, Google Pay, Kreditkarte, PayPal oder SEPA-Lastschrift. Deine Zahlungsdaten bleiben bei Stripe – PokerMentor sieht sie nie.' },
      { q: 'Brauche ich ein Konto?', a: 'Für Pro ja, damit dein Abo auf jedem Gerät gilt, auf dem du dich anmeldest. Die Gratis-Version läuft auch komplett ohne Konto; mit Konto wird dein Fortschritt gesichert, ebenfalls gratis.' },
    ],

    // Sperren & Limits
    lockedTitle: 'Pro-Funktion',
    lockedGeneric: 'Diese Funktion gehört zu PokerMentor Pro.',
    lockedLesson: (module: number) =>
      `Diese Lektion gehört zu Pro. ${module} Module sind komplett gratis – und die erste Lektion jedes Moduls ebenfalls.`,
    lockedScenario: (n: number) => `${n} handgeschriebene Spots – zu jeder Antwort die Begründung, warum sie trägt oder nicht.`,
    lockedPushFold: 'Mit welchen Händen du bei 10 bb und 5 bb von welcher Position All-in gehst – zum Üben und zum Nachsehen.',
    lockedInsights: (n: number) => `Die Prinzipien von ${n} Profis – verdichtet, geprüft, anwendbar.`,
    previewTitle: 'So sieht es aus',
    previewPush: (position: string, stack: string, pct: number) =>
      `${position} bei ${stack}: ${pct} % der Hände gehen All-in`,
    staysFree: (module: number, trainer: number) =>
      `Gratis bleiben: ${module} Module, ${trainer} Trainer, Wiederholen, Tages-Quiz, der Übungstisch samt Coach und alle Werkzeuge zum Nachschlagen.`,
    lockedTile: 'Nur mit Pro',
    lockedTileModule: 'Ab Lektion 2 nur mit Pro',
    unlock: 'Pro ansehen',
    limitTitle: 'Tageslimit erreicht',
    limitCoach: (n: number) => `Du hast deine ${n} Gratis-Coach-Hände für heute genutzt. Morgen gibt es wieder ${n} – oder du schaltest Pro frei und rechnest jede Hand durch.`,
    limitPlay: (n: number) => `Du hast deine ${n} Gratis-Hände für heute gespielt. Morgen geht es weiter – mit Pro sofort und unbegrenzt.`,
    remaining: (n: number, total: number) => `Noch ${n} von ${total} heute gratis`,
    later: 'Später',

    // Navigation & Hinweise
    navPro: 'Pro',
    trialBadge: (days: number) => `Pro-Test: ${days} ${days === 1 ? 'Tag' : 'Tage'}`,
    proBadge: 'Pro',
    upgradeNudge: 'Auf Pro upgraden',

    // Zurück von der Zahlungsseite
    kaufWartetTitel: 'Zahlung wird bestätigt …',
    kaufWartetText: 'Das dauert meist ein paar Sekunden. Du musst nichts tun – diese Seite aktualisiert sich selbst.',
    kaufLangeTitel: 'Das dauert länger als üblich',
    kaufLangeText: 'Deine Zahlung geht nicht verloren. Schau in ein paar Minuten wieder hierher; erscheint Pro dann nicht, schreib uns mit der E-Mail-Adresse deines Kontos.',
    kaufAktivTitel: 'Pro ist aktiv',
    kaufAktivText: 'Gilt auf allen Geräten mit deinem Konto. Danke, dass du PokerMentor unterstützt.',
    kaufAbbruchTitel: 'Nichts gebucht',
    kaufAbbruchText: 'Du hast den Kauf abgebrochen. Es wurde nichts berechnet.',
    weiterLernen: 'Weiter lernen',
    laedtSeite: 'Einen Moment …',

    // Ende der Testphase
    testendeTitel: (tage: number) =>
      tage <= 1 ? 'Deine Pro-Testphase endet morgen' : `Deine Pro-Testphase endet in ${tage} Tagen`,
    testendeText: (modul: number, trainer: number) =>
      `Danach bleiben gratis: ${modul} Module, ${trainer} Trainer, Wiederholen, Tages-Quiz, der Übungstisch samt Coach und alle Werkzeuge. Dein Fortschritt bleibt in jedem Fall erhalten.`,
    testendeOk: 'Verstanden',
  },
  {
    title: 'Stop guessing. Start knowing.',
    sub: 'The free version teaches you the fundamentals. Pro goes deeper: postflop, advanced concepts, tournament endgame and more practice per day.',
    monthly: 'Monthly',
    annual: 'Yearly',
    perMonth: 'per month',
    perYear: 'per year',
    cta: 'Subscribe – payment required',
    ctaTrial: 'Subscribe – payment required',
    ctaBusy: 'One moment …',
    errorSignIn: 'Please sign in first – otherwise the subscription cannot be linked to an account.',
    errorCheckout: 'Checkout cannot be opened right now. Please try again later.',
    manage: 'Manage subscription',
    manageNative: 'Manage in Settings',
    cancelLink: 'Cancel your contract here',
    reassure: 'Cancel anytime. No real-money gambling, no ads, no data selling.',
    securePay: 'Secure payment · Apple Pay, Google Pay, card, PayPal, SEPA',
    checkoutSummaryTitle: 'What you’re ordering',
    checkoutSummary: (price: string, period: string) =>
      `PokerMentor Pro – full access to all lessons and trainers, the unlimited Live Coach and the practice table without a daily limit. Total price ${price} ${period}, VAT included. The subscription renews automatically for the same period and can be cancelled at any time, effective at the end of the current billing period.`,
    periodMonthly: 'per month',
    periodAnnual: 'per year',
    vatNote: 'All prices include VAT.',
    perMonthEquivalent: (price: string) => `that’s ${price} per month`,

    activeTitle: 'You’re Pro',
    activeSub: 'Thanks for supporting PokerMentor. Every lesson and tool is unlocked for you.',
    trialTitle: (days: number) => `Your Pro trial is running – ${days} ${days === 1 ? 'day' : 'days'} left`,
    trialSub: 'You have full access right now. Afterwards the free version stays – your progress is never lost.',

    benefitsTitle: 'What you get with Pro',
    benefits: (z: VergleichsZahlen) => [
      { t: `All ${z.moduleAlle} modules instead of ${z.moduleFrei}`, d: `Postflop Play, Advanced Concepts, Live Poker, Online Poker and Variants – ${z.lektionenMehr} extra lessons.` },
      { t: 'Unlimited Live Coach', d: `Run every hand at poker night, not ${z.coachProTag} a day. Street by street, with the reasoning.` },
      { t: 'Scenario and push/fold trainers', d: `${z.spots} hand-written spots and the tournament endgame ranges – with the reasoning behind every answer.` },
      { t: 'Pro Insights', d: `The principles of ${z.profile} pros – condensed, verified, applicable.` },
      { t: 'Unlimited practice table', d: `Play as many hands against the computer opponents as you like – instead of ${z.tischProTag} a day.` },
    ],

    compareTitle: 'Free vs Pro',
    compareFeature: 'Feature',
    compareFree: 'Free',
    comparePro: 'Pro',
    rows: (z: VergleichsZahlen) => [
      ['Learning modules', `${z.moduleFrei} of ${z.moduleAlle} · lesson 1 everywhere`, `All ${z.moduleAlle}`],
      ['Trainers', `${z.trainerFrei} of ${z.trainerAlle}`, `All ${z.trainerAlle}`],
      ['Live Coach', `${z.coachProTag} hands / day`, 'Unlimited'],
      ['Practice table', `${z.tischProTag} hands / day`, 'Unlimited'],
      ['Pro Insights', '–', 'Included'],
      ['Review, Daily Quiz, coach at the table', 'Included', 'Included'],
      ['Bankroll, export, account and backup', 'Included', 'Included'],
      ['Chip calculator, glossary, tells, starting hands', 'Included', 'Included'],
    ],

    faqTitle: 'Frequently asked',
    faq: [
      { q: 'Can I cancel anytime?', a: 'Yes. One click in the customer portal, no notice period, no questions. You keep Pro until the end of the period you paid for.' },
      { q: 'What happens to my progress if I cancel?', a: 'Nothing is lost. XP, levels, badges, statistics and your bankroll data all stay intact and readable – you simply see the free version again.' },
      { q: 'Am I playing for real money here?', a: 'No, never. PokerMentor is a pure learning app with play money. There is no real-money play, no deposits or withdrawals, and no connection to gambling operators.' },
      { q: 'How do I pay?', a: 'Through Stripe – with Apple Pay, Google Pay, credit card, PayPal or SEPA direct debit. We never see your payment details.' },
      { q: 'Do I need an account?', a: 'For Pro yes, so your subscription applies on every device you sign in on. The free version runs entirely without an account; with an account your progress is backed up, also free.' },
    ],

    lockedTitle: 'Pro feature',
    lockedGeneric: 'This feature is part of PokerMentor Pro.',
    lockedLesson: (module: number) =>
      `This lesson is part of Pro. ${module} modules are completely free – and so is the first lesson of every module.`,
    lockedScenario: (n: number) => `${n} hand-written spots – with the reasoning behind every answer, why it holds or doesn’t.`,
    lockedPushFold: 'Which hands go all-in at 10 bb and 5 bb from which position – to practise and to look up.',
    lockedInsights: (n: number) => `The principles of ${n} pros – condensed, verified, applicable.`,
    previewTitle: 'What it looks like',
    previewPush: (position: string, stack: string, pct: number) =>
      `${position} at ${stack}: ${pct}% of hands go all-in`,
    staysFree: (module: number, trainer: number) =>
      `Staying free: ${module} modules, ${trainer} trainers, Review, Daily Quiz, the practice table with its coach and every lookup tool.`,
    lockedTile: 'Pro only',
    lockedTileModule: 'Pro from lesson 2',
    unlock: 'See Pro',
    limitTitle: 'Daily limit reached',
    limitCoach: (n: number) => `You’ve used your ${n} free coach hands for today. ${n} more tomorrow – or unlock Pro and run every single hand.`,
    limitPlay: (n: number) => `You’ve played your ${n} free hands for today. More tomorrow – with Pro, right now and without limits.`,
    remaining: (n: number, total: number) => `${n} of ${total} free left today`,
    later: 'Later',

    navPro: 'Pro',
    trialBadge: (days: number) => `Pro trial: ${days}d`,
    proBadge: 'Pro',
    upgradeNudge: 'Upgrade to Pro',

    kaufWartetTitel: 'Confirming your payment …',
    kaufWartetText: 'This usually takes a few seconds. You don’t need to do anything – this page updates itself.',
    kaufLangeTitel: 'This is taking longer than usual',
    kaufLangeText: 'Your payment is not lost. Check back here in a few minutes; if Pro still doesn’t show, write to us with the email address of your account.',
    kaufAktivTitel: 'Pro is active',
    kaufAktivText: 'Applies on every device with your account. Thanks for supporting PokerMentor.',
    kaufAbbruchTitel: 'Nothing booked',
    kaufAbbruchText: 'You cancelled the purchase. Nothing was charged.',
    weiterLernen: 'Keep learning',
    laedtSeite: 'One moment …',

    testendeTitel: (tage: number) =>
      tage <= 1 ? 'Your Pro trial ends tomorrow' : `Your Pro trial ends in ${tage} days`,
    testendeText: (modul: number, trainer: number) =>
      `Afterwards these stay free: ${modul} modules, ${trainer} trainers, Review, Daily Quiz, the practice table with its coach and every tool. Your progress is kept either way.`,
    testendeOk: 'Got it',
  },
);
