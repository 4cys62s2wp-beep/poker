import { defineStrings } from '..';

/* Texte der Freundes-Seite (src/pages/FriendsPage.tsx) und des
   Online-Abzeichens (src/components/social/OnlineBadge.tsx).
   Beide Sprachobjekte müssen dieselben Schlüssel haben – TypeScript prüft das. */
export const STR = defineStrings(
  {
    navFriends: 'Freunde',

    eyebrow: 'Gemeinsam',
    title: 'Freunde',
    sub: 'Sieh, wer gerade übt – und verabredet euch zum Trainieren.',

    // Online-Abzeichen
    badgeOnline: (n: number) => `${n} online`,
    badgeNobody: 'Freunde',
    badgeAria: (n: number) =>
      n === 1 ? '1 Freund ist gerade online' : `${n} Freunde sind gerade online`,

    // Zustände ohne Cloud / ohne Anmeldung
    offlineTitle: 'Freunde brauchen ein Konto',
    offlineBody:
      'Diese App speichert deinen Fortschritt zuerst auf dem Gerät. Für Freunde und den Online-Status wird ein kostenloses Cloud-Konto gebraucht – lege es im Profil an oder melde dich dort an.',
    offlineCta: 'Zum Profil',
    unconfiguredTitle: 'Freunde sind hier nicht eingerichtet',
    unconfiguredBody:
      'Diese Installation läuft ohne Cloud-Anbindung. Sobald eine firebase-config.json hinterlegt ist (siehe FIREBASE_SETUP.md), erscheinen hier Freundesliste, Anfragen und der Online-Status.',
    unverifiedTitle: 'Bitte bestätige zuerst deine E-Mail',
    unverifiedBody:
      'Freundschaftsanfragen sind erst nach dem Klick auf den Bestätigungslink möglich. Das schützt alle vor Anfragen aus Wegwerf-Konten.',

    // Anfragen
    requestsTitle: 'Anfragen an dich',
    requestsSub: 'Jemand möchte dich als Freund hinzufügen.',
    accept: 'Annehmen',
    decline: 'Ablehnen',
    outgoingTitle: 'Von dir gesendet',
    outgoingSub: 'Warten auf Antwort.',
    cancelRequest: 'Zurückziehen',
    pendingPill: 'offen',
    unknownPerson: 'Unbekannt',

    // Freundesliste
    listTitle: 'Deine Freunde',
    listCount: (online: number, total: number) => `${online} von ${total} online`,
    onlinePill: 'online',
    offlinePill: 'offline',
    remove: 'Entfernen',
    confirmRemove: 'Wirklich entfernen?',
    confirmRemoveYes: 'Ja, entfernen',
    confirmRemoveNo: 'Abbrechen',
    removeAria: (name: string) => `${name} aus der Freundesliste entfernen`,

    // Leerer Zustand
    emptyTitle: 'Noch keine Freunde hier',
    emptyBody:
      'Freunde sind die kleine soziale Ebene der App: Du siehst, wer gerade trainiert, und könnt euch zum gemeinsamen Üben verabreden. Es gibt keine Chats und keine Rangliste – nur Name und Online-Status.',
    emptyStep1: 'Gib deinen Code an jemanden weiter, der PokerMentor nutzt.',
    emptyStep2: 'Oder tippe den Code deines Gegenübers unten ein.',
    emptyStep3: 'Sobald die Anfrage angenommen ist, seht ihr euch gegenseitig.',

    // Hinzufügen
    addTitle: 'Freund hinzufügen',
    addLabel: 'Code deines Freundes',
    addPlaceholder: 'z. B. 7K2M-4XQ9',
    addButton: 'Anfrage senden',
    addHint: 'Acht Zeichen, Groß-/Kleinschreibung egal. Bindestrich optional.',

    // Eigener Code
    myCodeTitle: 'Dein Code',
    myCodeSub: 'Gib ihn weiter, damit dich jemand hinzufügen kann.',
    copy: 'Kopieren',
    copied: 'Kopiert',
    copyAria: 'Eigenen Freundescode kopieren',

    // Rückmeldungen
    msgSent: 'Anfrage verschickt. Sobald sie angenommen wird, erscheint der Name in deiner Liste.',
    msgFriends: 'Ihr hattet euch gegenseitig angefragt – ihr seid jetzt Freunde.',
    errInvalidCode: 'Dieser Code stimmt nicht. Bitte prüfe die acht Zeichen.',
    errSelf: 'Das ist dein eigener Code.',
    errUnknownCode: 'Zu diesem Code gehört (noch) niemand.',
    errAlreadyFriends: 'Ihr seid bereits Freunde.',
    errAlreadySent: 'Diese Anfrage läuft schon.',
    errUnavailable: 'Die Freundesfunktion ist gerade nicht erreichbar.',
    errGeneric: 'Das hat nicht geklappt – bitte versuche es später noch einmal.',

    privacyNote:
      'Datenschutz: Freunde sehen ausschließlich deinen Anzeigenamen und ob du gerade online bist. Deine E-Mail-Adresse, dein Fortschritt und deine Statistiken bleiben privat.',
  },
  {
    navFriends: 'Friends',

    eyebrow: 'Together',
    title: 'Friends',
    sub: 'See who is practising right now – and meet up for a session.',

    badgeOnline: (n: number) => `${n} online`,
    badgeNobody: 'Friends',
    badgeAria: (n: number) => (n === 1 ? '1 friend is online' : `${n} friends are online`),

    offlineTitle: 'Friends need an account',
    offlineBody:
      'This app keeps your progress on the device first. Friends and the online status need a free cloud account – create one or sign in from your profile.',
    offlineCta: 'Go to profile',
    unconfiguredTitle: 'Friends are not set up here',
    unconfiguredBody:
      'This installation runs without a cloud backend. As soon as a firebase-config.json is in place (see FIREBASE_SETUP.md), the friend list, requests and online status appear here.',
    unverifiedTitle: 'Please confirm your email first',
    unverifiedBody:
      'Friend requests work once you have clicked the confirmation link. That keeps everyone safe from throwaway accounts.',

    requestsTitle: 'Requests for you',
    requestsSub: 'Someone would like to add you as a friend.',
    accept: 'Accept',
    decline: 'Decline',
    outgoingTitle: 'Sent by you',
    outgoingSub: 'Waiting for an answer.',
    cancelRequest: 'Withdraw',
    pendingPill: 'pending',
    unknownPerson: 'Unknown',

    listTitle: 'Your friends',
    listCount: (online: number, total: number) => `${online} of ${total} online`,
    onlinePill: 'online',
    offlinePill: 'offline',
    remove: 'Remove',
    confirmRemove: 'Really remove?',
    confirmRemoveYes: 'Yes, remove',
    confirmRemoveNo: 'Cancel',
    removeAria: (name: string) => `Remove ${name} from your friend list`,

    emptyTitle: 'No friends here yet',
    emptyBody:
      'Friends are the small social layer of this app: you can see who is training right now and arrange to practise together. There are no chats and no leaderboards – just a name and an online dot.',
    emptyStep1: 'Share your code with someone who uses PokerMentor.',
    emptyStep2: 'Or type in their code below.',
    emptyStep3: 'Once the request is accepted, you can see each other.',

    addTitle: 'Add a friend',
    addLabel: "Your friend's code",
    addPlaceholder: 'e.g. 7K2M-4XQ9',
    addButton: 'Send request',
    addHint: 'Eight characters, case does not matter. The dash is optional.',

    myCodeTitle: 'Your code',
    myCodeSub: 'Share it so others can add you.',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy your friend code',

    msgSent: 'Request sent. Once it is accepted, the name shows up in your list.',
    msgFriends: 'You had both sent a request – you are friends now.',
    errInvalidCode: 'That code is not right. Please check the eight characters.',
    errSelf: 'That is your own code.',
    errUnknownCode: 'Nobody is using this code (yet).',
    errAlreadyFriends: 'You are already friends.',
    errAlreadySent: 'That request is already pending.',
    errUnavailable: 'The friends feature is unreachable right now.',
    errGeneric: 'That did not work – please try again later.',

    privacyNote:
      'Privacy: friends only ever see your display name and whether you are online. Your email address, your progress and your stats stay private.',
  },
);
