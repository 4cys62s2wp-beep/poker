/* Signal und Wachhalten am Tisch.
   ==============================

   Zwei Dinge, die der Tischbildschirm können muss und die sonst nirgends
   gebraucht werden.

   **Der Ton.** Beim Stufenwechsel schaut niemand hin — es wird gerade eine
   Hand gespielt. Ein Ton ist die einzige Ansage, die ankommt. Er kommt aus
   dem Browser selbst und nicht aus einer Tondatei: eine Datei müsste geladen
   werden, und genau dann, wenn sie gebraucht wird, ist kein Netz da.

   Ein einziger Klangzusammenhang (E-094). Vorher entstand für jeden Ton ein
   neuer `AudioContext` aus dem Sekundentakt; auf dem iPhone bleibt ein solcher
   ohne Nutzergeste angehalten — der Ton kam nie. Jetzt wird er **im Klick auf
   „Uhr starten" / „Weiter"** angelegt und entsperrt (mit einem kurzen
   Bestätigungston), danach wiederverwendet. Wo es nicht klappt, vibriert das
   Gerät, wo es das kann.

   **Der Bildschirm bleibt an.** Ein Tischgerät, das nach dreißig Sekunden
   dunkel wird, ist kein Tischgerät. Die Sperre gibt es nicht in jedem
   Browser; wo es sie nicht gibt, läuft alles andere trotzdem — und die
   Oberfläche sagt es einmal, statt still zu scheitern. */

type KlangBau = typeof AudioContext;

/** Der eine Klangzusammenhang des Tisches. */
let kontext: AudioContext | null = null;

function bauer(): KlangBau | null {
  const w = (typeof window === 'undefined' ? {} : window) as unknown as {
    AudioContext?: KlangBau;
    webkitAudioContext?: KlangBau;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function holeKontext(): AudioContext | null {
  if (kontext && kontext.state !== 'closed') return kontext;
  const Bau = bauer();
  if (!Bau) return null;
  try {
    kontext = new Bau();
  } catch {
    kontext = null;
  }
  return kontext;
}

/** Nur für Tests: den gemerkten Klangzusammenhang vergessen. */
export function vergissKontext(): void {
  kontext = null;
}

/** Ein kurzes Vibrieren, wo das Gerät es kann — der Rückfall, wenn der Ton
 *  nicht kommt. */
export function vibriere(muster: number | number[]): boolean {
  try {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
      ? navigator.vibrate(muster)
      : false;
  } catch {
    return false;
  }
}

/** Ein kurzer Ton auf dem gemeinsamen Klangzusammenhang. `true`, wenn er
 *  tatsächlich gespielt wurde. */
async function ton(hoehe: number, dauer_ms: number, lautstaerke = 0.25): Promise<boolean> {
  const ctx = holeKontext();
  if (!ctx) return false;
  try {
    /* Ohne Nutzergeste bleibt der Zusammenhang angehalten. Der Versuch kostet
       nichts; klappt er nicht, steht der Zustand danach noch auf „suspended". */
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running') return false;
    const quelle = ctx.createOscillator();
    const regler = ctx.createGain();
    quelle.type = 'sine';
    quelle.frequency.value = hoehe;
    /* Ein- und ausblenden, sonst knackt es an beiden Enden. */
    regler.gain.setValueAtTime(0, ctx.currentTime);
    regler.gain.linearRampToValueAtTime(lautstaerke, ctx.currentTime + 0.02);
    regler.gain.linearRampToValueAtTime(0, ctx.currentTime + dauer_ms / 1000);
    quelle.connect(regler).connect(ctx.destination);
    quelle.start();
    quelle.stop(ctx.currentTime + dauer_ms / 1000);
    await new Promise((fertig) => { quelle.onended = () => fertig(null); });
    return true;
  } catch {
    /* Kein Ton ist kein Grund, den Timer anzuhalten. */
    return false;
  }
}

/** Im Klick-Handler von „Uhr starten" und „Weiter" aufrufen: legt den
 *  Klangzusammenhang an, entsperrt ihn und spielt einen kurzen Bestätigungston.
 *  `true`, wenn das Gerät danach Töne spielen kann. */
export async function entsperreTon(): Promise<boolean> {
  try {
    /* iOS: Eine Web-App spielt sonst als „Umgebungsklang" und verstummt mit dem
       Stummschalter. Der Tisch ist Wiedergabe. */
    const nav = navigator as unknown as { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch { /* nicht überall vorhanden */ }
  const ctx = holeKontext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
  } catch { /* gleich noch einmal prüfen */ }
  if (ctx.state !== 'running') return false;
  await ton(1320, 70, 0.1);
  return true;
}

export type Tontest = 'ok' | 'stumm';

/** „Ton testen" im Steuerblatt: Der Stufenwechsel, wie er klingt. `stumm`, wenn
 *  nichts zu hören war — dann vibriert das Gerät stattdessen. */
export async function tonTesten(): Promise<Tontest> {
  const ok = await stufeGewechselt(true);
  if (!ok) vibriere([120, 80, 120]);
  return ok ? 'ok' : 'stumm';
}

/** Die Vorankündigung: ein einzelner heller Ton. */
export async function gleichIstEsSoweit(an = true): Promise<boolean> {
  if (!an) return false;
  const ok = await ton(880, 180);
  if (!ok) vibriere(200);
  return ok;
}

/** Der Stufenwechsel: zwei Töne, der zweite höher. Unverwechselbar. */
export async function stufeGewechselt(an = true): Promise<boolean> {
  if (!an) return false;
  const a = await ton(660, 200);
  const b = a ? await ton(990, 320) : false;
  if (!a && !b) vibriere([200, 100, 300]);
  return a && b;
}

export interface Wachhalten {
  /** Hat das Gerät die Sperre gewährt? `false`: Der Bildschirm kann dunkel werden. */
  ok: boolean;
  loesen: () => void;
}

/** Hält den Bildschirm an, solange die Session läuft.
 *
 *  Gibt zurück, ob es geklappt hat, und eine Funktion, die die Sperre wieder
 *  löst. Wo es die Sperre nicht gibt, tut sie nichts — der Rest läuft trotzdem,
 *  aber der Aufrufer weiß es und kann es sagen. */
export async function haltWach(): Promise<Wachhalten> {
  type Sperre = { release: () => Promise<void> };
  const wl = (typeof navigator === 'undefined' ? undefined : (navigator as unknown as {
    wakeLock?: { request: (art: 'screen') => Promise<Sperre> };
  }).wakeLock);
  if (!wl) return { ok: false, loesen: () => { /* nichts zu lösen */ } };
  let sperre: Sperre | null = null;
  try {
    sperre = await wl.request('screen');
  } catch {
    return { ok: false, loesen: () => { /* verweigert */ } };
  }
  /* Wechselt jemand kurz in eine andere App, verfällt die Sperre. Beim
     Zurückkommen wird sie neu angefordert, sonst wird der Tisch dunkel,
     sobald einmal jemand aufs Handy geschaut hat. */
  const beiRueckkehr = () => {
    if (document.visibilityState === 'visible') {
      wl.request('screen').then((s) => { sperre = s; }).catch(() => { /* egal */ });
    }
  };
  document.addEventListener('visibilitychange', beiRueckkehr);
  return {
    ok: true,
    loesen: () => {
      document.removeEventListener('visibilitychange', beiRueckkehr);
      sperre?.release().catch(() => { /* egal */ });
    },
  };
}
