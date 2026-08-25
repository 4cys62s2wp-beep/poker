#!/usr/bin/env bash
#
# Befehle, die ein MENSCH ausführen muss – nichts hiervon läuft automatisch.
# Alles, was Konten, Schlüssel, Geld oder eine Veröffentlichung berührt,
# steht hier und nur hier.
#
# Nutzung: einzelne Blöcke lesen, verstehen, dann von Hand ausführen.
# Dieses Skript ist bewusst NICHT am Stück lauffähig.

set -euo pipefail
echo "Dieses Skript ist zum Lesen, nicht zum Ausführen am Stück." >&2
echo "Öffne es und arbeite die Blöcke einzeln ab." >&2
exit 1

# ═══════════════════════════════════════════════════════════════════
# JETZT MÖGLICH – ohne jedes Konto
# ═══════════════════════════════════════════════════════════════════

# --- Alles prüfen, was ohne Konten prüfbar ist ---------------------
npm install
npm test              # Unit-Tests
npm run typecheck     # TypeScript
npm run build         # Produktions-Build
npm audit             # Abhängigkeiten

# --- Firestore-Sicherheitsregeln gegen den Emulator ----------------
# Braucht Java, sonst nichts. Startet den Emulator und beendet ihn wieder.
npm run test:rules

# --- Cloud Functions lokal im Emulator ausprobieren ----------------
# Läuft ohne Blaze-Tarif und ohne Kreditkarte.
# (Sobald functions/ existiert – siehe STATUS.md)
npx firebase-tools@15.28.1 emulators:start --only functions,firestore

# ═══════════════════════════════════════════════════════════════════
# AB OKTOBER 2026 – sobald die Konten existieren
# ═══════════════════════════════════════════════════════════════════
# Reihenfolge einhalten. Ausführliche Begründung in SETUP_PAYMENTS.md.

# --- 1. Firebase auf Blaze umstellen -------------------------------
# Nur über die Konsole, nicht per Kommandozeile:
#   https://console.firebase.google.com/project/pokermentor-9ac7f/usage/details
# Achtung: Blaze ist nutzungsabhängig. Vorher ein Budget-Alarm einrichten,
# sonst kann eine Endlosschleife im Code echtes Geld kosten:
#   https://console.cloud.google.com/billing/budgets

# --- 2. Bei Firebase anmelden --------------------------------------
npx firebase-tools@15.28.1 login

# --- 3. Stripe: Schlüssel hinterlegen ------------------------------
# Die Werte kommen aus dem Stripe-Dashboard. NICHT ins Repository!
# Erst mit Testschlüsseln (sk_test_…) arbeiten, nie direkt live.
npx firebase-tools@15.28.1 functions:secrets:set STRIPE_SECRET_KEY
npx firebase-tools@15.28.1 functions:secrets:set STRIPE_WEBHOOK_SECRET

# --- 4. Apple: Schlüssel hinterlegen -------------------------------
npx firebase-tools@15.28.1 functions:secrets:set APPLE_ISSUER_ID
npx firebase-tools@15.28.1 functions:secrets:set APPLE_KEY_ID
npx firebase-tools@15.28.1 functions:secrets:set APPLE_PRIVATE_KEY
npx firebase-tools@15.28.1 functions:secrets:set APPLE_BUNDLE_ID

# --- 5. Funktionen veröffentlichen ---------------------------------
npx firebase-tools@15.28.1 deploy --only functions

# --- 6. Webhook-Adressen eintragen ---------------------------------
# Nach dem Deploy nennt die Ausgabe die URLs. Diese eintragen:
#   Stripe → Dashboard → Developers → Webhooks → Add endpoint
#   Apple  → App Store Connect → App-Informationen → App Store Server
#            Notifications → Production/Sandbox URL
#
# Danach in Stripe ein Testereignis schicken und prüfen, dass in Firestore
# unter entitlements/{uid} der Status ankommt.

# --- 7. Monetarisierung einschalten --------------------------------
# Erst wenn Schritt 6 nachweislich funktioniert hat:
#   public/monetization.json aus der Vorlage anlegen, committen, pushen.
# Vorher bleibt die App vollständig gratis – das ist Absicht.
