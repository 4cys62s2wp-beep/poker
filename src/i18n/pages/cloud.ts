import { defineStrings } from '..';

/* Texte der Konto-Karte (src/components/CloudAccountCard.tsx).
   Fehler-/Info-Meldungen aus src/lib/cloud/ bleiben dort und sind hier bewusst nicht enthalten. */
export const STR = defineStrings(
  {
    deviceTitle: 'Geräte-Modus aktiv',
    deviceBody1: 'Diese Installation läuft im',
    deviceStrong: 'Geräte-Modus',
    deviceBody2:
      ': Alle Profile und Fortschritte werden doppelt auf diesem Gerät gesichert (localStorage + IndexedDB) und überleben Neuladen, Abstürze und das Schließen des Browsers. Geräteübergreifende Konten mit E-Mail-Verifizierung lassen sich mit einem kostenlosen Firebase-Projekt freischalten – die Anleitung steht in',
    deviceBody3: 'im Projekt.',

    accountTitle: 'Dein Konto',
    verifiedPill: '✓ E-Mail bestätigt',
    unverifiedPill: 'E-Mail unbestätigt',
    signedInAs: 'Angemeldet als',
    verifiedInfo:
      'Dein Fortschritt wird automatisch verschlüsselt übertragen und in der Cloud gesichert – auf jedem Gerät, auf dem du dich anmeldest, geht es genau dort weiter.',
    unverifiedInfo:
      'Bitte bestätige zuerst deine E-Mail-Adresse über den Link, den wir dir geschickt haben – erst danach wird dein Fortschritt in der Cloud gesichert.',
    lastSync: (ts: string) => `Zuletzt synchronisiert: ${new Date(ts).toLocaleTimeString('de-DE')} Uhr`,
    syncNow: 'Jetzt synchronisieren',
    checkedVerification: 'Ich habe bestätigt',
    resendEmail: 'E-Mail erneut senden',
    logout: 'Abmelden',

    titleRegister: 'Konto erstellen',
    titleReset: 'Passwort zurücksetzen',
    titleLogin: 'Anmelden',
    introRegister:
      'Mit einem Konto (E-Mail + Verifizierung) wird dein Fortschritt in der Cloud gesichert und auf all deinen Geräten synchronisiert.',
    introReset: 'Wir schicken dir einen Link zum Zurücksetzen deines Passworts.',
    introLogin: 'Melde dich an, um deinen Fortschritt geräteübergreifend zu synchronisieren.',
    namePlaceholder: 'Dein Name',
    emailPlaceholder: 'E-Mail-Adresse',
    passwordRegisterPlaceholder: 'Passwort (mind. 8 Zeichen)',
    passwordPlaceholder: 'Passwort',
    busy: 'Einen Moment …',
    submitRegister: 'Konto erstellen',
    submitReset: 'Link schicken',
    submitLogin: 'Anmelden',
    toLogin: 'Zur Anmeldung',
    newAccount: 'Neues Konto',
    forgotPassword: 'Passwort vergessen?',
  },
  {
    deviceTitle: 'Device mode active',
    deviceBody1: 'This installation runs in',
    deviceStrong: 'device mode',
    deviceBody2:
      ': all profiles and progress are saved twice on this device (localStorage + IndexedDB) and survive reloads, crashes and closing the browser. Cross-device accounts with email verification can be enabled with a free Firebase project – the guide is in',
    deviceBody3: 'in the project.',

    accountTitle: 'Your Account',
    verifiedPill: '✓ Email verified',
    unverifiedPill: 'Email not verified',
    signedInAs: 'Signed in as',
    verifiedInfo:
      'Your progress is automatically transferred encrypted and backed up in the cloud – on every device you sign in on, you pick up exactly where you left off.',
    unverifiedInfo:
      'Please confirm your email address first via the link we sent you – only then will your progress be backed up in the cloud.',
    lastSync: (ts: string) => `Last synced: ${new Date(ts).toLocaleTimeString('en-GB')}`,
    syncNow: 'Sync now',
    checkedVerification: 'I have confirmed',
    resendEmail: 'Resend email',
    logout: 'Sign out',

    titleRegister: 'Create Account',
    titleReset: 'Reset Password',
    titleLogin: 'Sign In',
    introRegister:
      'With an account (email + verification) your progress is backed up in the cloud and synced across all your devices.',
    introReset: 'We will send you a link to reset your password.',
    introLogin: 'Sign in to sync your progress across all your devices.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Email address',
    passwordRegisterPlaceholder: 'Password (at least 8 characters)',
    passwordPlaceholder: 'Password',
    busy: 'One moment …',
    submitRegister: 'Create account',
    submitReset: 'Send link',
    submitLogin: 'Sign in',
    toLogin: 'Back to sign-in',
    newAccount: 'New account',
    forgotPassword: 'Forgot password?',
  },
);
