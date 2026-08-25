import { defineStrings } from '..';

export const STR = defineStrings(
  {
    navLegal: 'Rechtliches',
    title: 'Rechtliches & Datenschutz',
    sub: 'Wer diese App betreibt, was mit deinen Daten passiert und welche Rechte du hast.',

    imprintTitle: 'Impressum',
    imprintNote: 'Angaben gemäß § 5 DDG.',
    imprintMissing:
      'Die Anbieterangaben sind für diese Installation noch nicht hinterlegt. Solange die App nichts kostet und privat betrieben wird, ist das unkritisch – vor der ersten Bezahlfunktion muss hier ein vollständiges Impressum stehen.',
    contact: 'Kontakt',
    vatId: 'Umsatzsteuer-Identifikationsnummer',
    register: 'Registereintrag',
    represented: 'Vertreten durch',
    smallBusinessNote:
      'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen.',

    privacyTitle: 'Datenschutz',
    privacyIntro:
      'PokerMentor ist so gebaut, dass so wenig Daten wie möglich anfallen. Es gibt kein Tracking, keine Werbenetzwerke, keine Analyse-Cookies und keine Weitergabe von Daten an Dritte zu Werbezwecken.',
    privacyLocalTitle: 'Was auf deinem Gerät bleibt',
    privacyLocal:
      'Dein gesamter Lernfortschritt – XP, Level, abgeschlossene Lektionen, Quiz-Ergebnisse, Trainer-Statistiken, Abzeichen, Handhistorie, Bankroll-Sessions und Profilnamen – wird ausschließlich lokal in deinem Browser gespeichert (localStorage und IndexedDB). Ohne Konto verlässt davon nichts dein Gerät. Du kannst diese Daten jederzeit im Profil exportieren oder vollständig löschen.',
    privacyAccountTitle: 'Wenn du ein Konto anlegst',
    privacyAccount:
      'Für die geräteübergreifende Synchronisation werden deine E-Mail-Adresse, ein verschlüsselt gespeichertes Passwort und dein Lernfortschritt bei unserem Dienstleister Google Firebase (Google Ireland Limited) gespeichert. Rechtsgrundlage ist die Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO). Du kannst dein Konto jederzeit löschen lassen – schreib uns dazu eine kurze E-Mail.',
    privacyPaymentTitle: 'Bei einem Pro-Abo',
    privacyPayment:
      'Die Zahlungsabwicklung übernimmt Stripe. Zahlungsdaten wie Kartennummern werden ausschließlich von Stripe verarbeitet und sind für uns nicht einsehbar. Wir erhalten lediglich die Information, ob dein Abo aktiv ist, sowie die für die Rechnungsstellung nötigen Angaben.',
    privacyRightsTitle: 'Deine Rechte',
    privacyRights:
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Eine formlose E-Mail an die oben genannte Adresse genügt.',
    privacyHostingTitle: 'Hosting',
    privacyHosting:
      'Die Seite wird über GitHub Pages ausgeliefert. Dabei verarbeitet GitHub technisch notwendige Server-Logdaten wie deine IP-Adresse, um die Seite überhaupt ausliefern zu können.',

    termsTitle: 'Nutzungsbedingungen',
    termsUse:
      'PokerMentor ist eine Lern- und Trainingsanwendung für Poker. Sämtliche Spielsituationen laufen mit Spielgeld. Es findet kein Echtgeldspiel statt, es gibt keine Ein- oder Auszahlungen, keine Gewinnausschüttungen und keine Vermittlung an Glücksspielanbieter.',
    termsSubTitle: 'Abo, Laufzeit und Kündigung',
    termsSub:
      'Ein Pro-Abo verlängert sich automatisch um die jeweils gebuchte Laufzeit (monatlich oder jährlich), bis es gekündigt wird. Die Kündigung ist jederzeit zum Ende des laufenden Abrechnungszeitraums möglich – über den Button „Abo verwalten oder kündigen“ auf der Pro-Seite, ohne Angabe von Gründen und ohne Frist. Bereits freigeschaltete Inhalte bleiben bis zum Ende des bezahlten Zeitraums nutzbar.',
    termsRevokeTitle: 'Widerrufsrecht',
    termsRevoke:
      'Als Verbraucher hast du das Recht, den Vertrag binnen 14 Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt mit Vertragsschluss. Für den Widerruf genügt eine eindeutige Erklärung per E-Mail an die im Impressum genannte Adresse. Bereits gezahlte Beträge erstatten wir unverzüglich zurück.',
    termsRevokeExpiry:
      'Hinweis: Das Widerrufsrecht erlischt vorzeitig, wenn du ausdrücklich zustimmst, dass wir vor Ablauf der Widerrufsfrist mit der Leistung beginnen, und du bestätigst, dass du dadurch dein Widerrufsrecht verlierst. Wir machen davon keinen Gebrauch – du behältst deine vollen 14 Tage.',
    termsLiabilityTitle: 'Haftung für Inhalte',
    termsLiability:
      'Alle Lerninhalte werden sorgfältig erstellt, ersetzen aber keine individuelle Beratung und garantieren keinen Spielerfolg. Poker enthält einen erheblichen Glücksanteil; für Entscheidungen am Tisch und deren finanzielle Folgen bist du selbst verantwortlich.',

    responsibleTitle: 'Verantwortungsvoll spielen',
    responsible:
      'Poker kann süchtig machen. Spiele nur mit Geld, dessen Verlust du verkraften kannst, setze dir feste Grenzen für Zeit und Einsätze und mach Pausen. Wenn du das Gefühl hast, die Kontrolle zu verlieren, findest du in Deutschland kostenlose und anonyme Hilfe bei der Bundeszentrale für gesundheitliche Aufklärung unter 0800 1 37 27 00 sowie auf check-dein-spiel.de. Diese App richtet sich ausschließlich an Erwachsene.',

    lastUpdated: 'Stand',

    // Kündigungsseite (§ 312k BGB)
    cancelNav: 'Verträge hier kündigen',
    cancelTitle: 'Verträge hier kündigen',
    cancelSub: 'Hier kündigst du dein PokerMentor-Pro-Abo – ohne Anmeldung, ohne Begründung, ohne Frist.',
    cancelName: 'Vor- und Nachname',
    cancelEmail: 'E-Mail-Adresse deines Kontos',
    cancelKind: 'Art der Kündigung',
    cancelOrdinary: 'Ordentliche Kündigung zum nächstmöglichen Zeitpunkt',
    cancelExtraordinary: 'Außerordentliche Kündigung',
    cancelReason: 'Grund (nur bei außerordentlicher Kündigung erforderlich)',
    cancelNote: 'Nachricht (optional)',
    cancelSubmit: 'Jetzt kündigen',
    cancelSent: 'Kündigung abgeschickt',
    cancelSentBody:
      'Deine Kündigung ist auf dem Weg. Du erhältst eine Bestätigung per E-Mail mit Datum und dem Zeitpunkt, zu dem das Abo endet. Bis dahin kannst du Pro weiter nutzen; dein Lernfortschritt bleibt in jedem Fall vollständig erhalten.',
    cancelMailFallback:
      'Es öffnet sich dein E-Mail-Programm mit der fertigen Kündigung. Schick die Nachricht ab – das genügt.',
    cancelMissing: 'Bitte fülle Name und E-Mail-Adresse aus.',
    cancelUnavailable:
      'Für diese Installation ist noch kein Abo eingerichtet – es gibt daher nichts zu kündigen.',
  },
  {
    navLegal: 'Legal',
    title: 'Legal & Privacy',
    sub: 'Who runs this app, what happens to your data, and what rights you have.',

    imprintTitle: 'Provider identification',
    imprintNote: 'Information pursuant to § 5 DDG (German Digital Services Act).',
    imprintMissing:
      'Provider details have not been configured for this installation yet. While the app is free and privately operated this is uncritical – but a complete imprint must be in place before any paid feature goes live.',
    contact: 'Contact',
    vatId: 'VAT identification number',
    register: 'Register entry',
    represented: 'Represented by',
    smallBusinessNote:
      'Pursuant to § 19 of the German VAT Act, no VAT is charged and therefore none is shown.',

    privacyTitle: 'Privacy',
    privacyIntro:
      'PokerMentor is built to collect as little data as possible. There is no tracking, no ad networks, no analytics cookies and no sharing of your data with third parties for advertising.',
    privacyLocalTitle: 'What stays on your device',
    privacyLocal:
      'Your entire learning progress – XP, levels, completed lessons, quiz results, trainer statistics, badges, hand history, bankroll sessions and profile names – is stored exclusively in your browser (localStorage and IndexedDB). Without an account none of it ever leaves your device. You can export or completely delete this data at any time from your profile.',
    privacyAccountTitle: 'If you create an account',
    privacyAccount:
      'For cross-device sync, your email address, an encrypted password and your learning progress are stored with our processor Google Firebase (Google Ireland Limited). The legal basis is performance of the user agreement (Art. 6(1)(b) GDPR). You can have your account deleted at any time – just send us a short email.',
    privacyPaymentTitle: 'With a Pro subscription',
    privacyPayment:
      'Payments are processed by Stripe. Payment details such as card numbers are handled solely by Stripe and are never visible to us. We only receive whether your subscription is active, plus the information required for invoicing.',
    privacyRightsTitle: 'Your rights',
    privacyRights:
      'You have the right to access, rectification, erasure, restriction of processing, data portability and objection, as well as the right to lodge a complaint with a data protection authority. An informal email to the address above is enough.',
    privacyHostingTitle: 'Hosting',
    privacyHosting:
      'The site is served via GitHub Pages. In doing so, GitHub processes technically necessary server log data such as your IP address in order to deliver the site at all.',

    termsTitle: 'Terms of use',
    termsUse:
      'PokerMentor is a learning and training application for poker. All game situations use play money. There is no real-money play, no deposits or withdrawals, no payouts and no referral to gambling operators.',
    termsSubTitle: 'Subscription, term and cancellation',
    termsSub:
      'A Pro subscription renews automatically for the period booked (monthly or yearly) until cancelled. You can cancel at any time, effective at the end of the current billing period, via the “Manage or cancel subscription” button on the Pro page – no reason required, no notice period. Content already unlocked remains available until the end of the paid period.',
    termsRevokeTitle: 'Right of withdrawal',
    termsRevoke:
      'As a consumer you have the right to withdraw from the contract within 14 days without giving any reason. The period begins when the contract is concluded. A clear statement by email to the address in the imprint is sufficient. We refund any amounts already paid without delay.',
    termsRevokeExpiry:
      'Note: the right of withdrawal can expire early if you expressly agree that we begin performance before the withdrawal period ends and confirm that you thereby lose that right. We do not make use of this – you keep your full 14 days.',
    termsLiabilityTitle: 'Liability for content',
    termsLiability:
      'All learning content is produced carefully, but it does not replace individual advice and guarantees no winnings. Poker involves a substantial element of chance; you remain responsible for your decisions at the table and their financial consequences.',

    responsibleTitle: 'Play responsibly',
    responsible:
      'Poker can be addictive. Only play with money you can afford to lose, set firm limits for time and stakes, and take breaks. If you feel you are losing control, free and anonymous help is available in Germany from the BZgA on 0800 1 37 27 00 and at check-dein-spiel.de; in other countries look for your national helpline. This app is intended for adults only.',

    lastUpdated: 'Last updated',

    cancelNav: 'Cancel your contract here',
    cancelTitle: 'Cancel your contract here',
    cancelSub: 'Cancel your PokerMentor Pro subscription here – no login, no reason, no notice period.',
    cancelName: 'First and last name',
    cancelEmail: 'Email address of your account',
    cancelKind: 'Type of cancellation',
    cancelOrdinary: 'Ordinary cancellation at the next possible date',
    cancelExtraordinary: 'Extraordinary cancellation',
    cancelReason: 'Reason (only required for extraordinary cancellation)',
    cancelNote: 'Message (optional)',
    cancelSubmit: 'Cancel now',
    cancelSent: 'Cancellation submitted',
    cancelSentBody:
      'Your cancellation is on its way. You’ll receive an email confirmation with the date and the point at which the subscription ends. Until then you can keep using Pro; your learning progress stays fully intact either way.',
    cancelMailFallback:
      'Your email app will open with the cancellation ready to go. Just send the message – that’s all it takes.',
    cancelMissing: 'Please fill in your name and email address.',
    cancelUnavailable: 'No subscription is set up for this installation, so there is nothing to cancel.',
  },
);
