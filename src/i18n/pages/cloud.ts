import { defineStrings } from '..';

/* Texte der Konto-Karte (src/components/CloudAccountCard.tsx) und die
   Info-Meldungen des CloudProviders (info*-Schlüssel). Fehlertexte kommen aus
   describeCloudError() in src/lib/cloud/cloud.ts – die kennen nur Firebase-Codes. */
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
    noMailHint:
      'Keine Mail bekommen? Schau im Spam-Ordner nach – manche Anbieter (besonders iCloud) filtern sie weg. Am zuverlässigsten: abmelden und stattdessen „Mit Google anmelden“ nehmen, dabei entfällt die Bestätigung komplett.',
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
    orDivider: 'oder mit E-Mail',
    continueWithGoogle: 'Mit Google anmelden',
    googleHint: 'Am schnellsten – kein Passwort, keine Bestätigungsmail.',

    // Rückmeldungen des CloudProviders
    infoCloudLoaded: 'Fortschritt aus der Cloud geladen.',
    infoCloudSaved: 'Dein Fortschritt ist jetzt in der Cloud gesichert.',
    infoAccountCreated:
      'Konto erstellt! Wir haben dir eine Bestätigungs-E-Mail geschickt – bitte klicke auf den Link darin.',
    infoResetSent: 'E-Mail zum Zurücksetzen des Passworts ist unterwegs.',
    infoVerificationResent: 'Bestätigungs-E-Mail erneut verschickt – schau auch im Spam-Ordner nach.',
    infoNotVerifiedYet: 'Noch nicht bestätigt – klicke zuerst auf den Link in der E-Mail.',
    infoSynced: 'Synchronisiert.',
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
    noMailHint:
      'No email? Check your spam folder – some providers (iCloud especially) filter it out. Most reliable: sign out and use “Sign in with Google” instead, which skips confirmation entirely.',
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
    orDivider: 'or with email',
    continueWithGoogle: 'Sign in with Google',
    googleHint: 'Fastest way – no password, no confirmation email.',

    // Rückmeldungen des CloudProviders
    infoCloudLoaded: 'Progress loaded from the cloud.',
    infoCloudSaved: 'Your progress is now backed up in the cloud.',
    infoAccountCreated:
      'Account created! We have sent you a confirmation email – please click the link inside.',
    infoResetSent: 'The email to reset your password is on its way.',
    infoVerificationResent: 'Confirmation email sent again – have a look in your spam folder too.',
    infoNotVerifiedYet: 'Not confirmed yet – please click the link in the email first.',
    infoSynced: 'Synced.',
  },
);
