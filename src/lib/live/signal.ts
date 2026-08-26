/* Signal und Wachhalten am Tisch.
   ==============================

   Zwei Dinge, die der Tischbildschirm können muss und die sonst nirgends
   gebraucht werden.

   **Der Ton.** Beim Stufenwechsel schaut niemand hin — es wird gerade eine
   Hand gespielt. Ein Ton ist die einzige Ansage, die ankommt. Er kommt aus
   dem Browser selbst und nicht aus einer Tondatei: eine Datei müsste geladen
   werden, und genau dann, wenn sie gebraucht wird, ist kein Netz da.

   **Der Bildschirm bleibt an.** Ein Tischgerät, das nach dreißig Sekunden
   dunkel wird, ist kein Tischgerät. Die Sperre gibt es nicht in jedem
   Browser; wo es sie nicht gibt, läuft alles andere trotzdem. */

/** Ein kurzer Ton. `hoehe` in Hertz, `dauer_ms` in Millisekunden. */
async function ton(hoehe: number, dauer_ms: number, lautstaerke = 0.25): Promise<void> {
  const Klang = (window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  });
  const Bau = Klang.AudioContext ?? Klang.webkitAudioContext;
  if (!Bau) return;
  const ctx = new Bau();
  try {
    /* Manche Browser starten den Klangzusammenhang angehalten, bis der
       Nutzer etwas getippt hat. Am Tisch hat er das längst. */
    if (ctx.state === 'suspended') await ctx.resume();
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
  } catch {
    /* Kein Ton ist kein Grund, den Timer anzuhalten. */
  } finally {
    try { await ctx.close(); } catch { /* egal */ }
  }
}

/** Die Vorankündigung: ein einzelner heller Ton. */
export async function gleichIstEsSoweit(): Promise<void> {
  await ton(880, 180);
}

/** Der Stufenwechsel: zwei Töne, der zweite höher. Unverwechselbar. */
export async function stufeGewechselt(): Promise<void> {
  await ton(660, 200);
  await ton(990, 320);
}

/** Hält den Bildschirm an, solange die Session läuft.
 *
 *  Gibt eine Funktion zurück, die die Sperre wieder löst. Wo es die Sperre
 *  nicht gibt, tut sie nichts — der Rest läuft trotzdem. */
export async function haltWach(): Promise<() => void> {
  type Sperre = { release: () => Promise<void> };
  const wl = (navigator as unknown as {
    wakeLock?: { request: (art: 'screen') => Promise<Sperre> };
  }).wakeLock;
  if (!wl) return () => { /* nichts zu lösen */ };
  let sperre: Sperre | null = null;
  try {
    sperre = await wl.request('screen');
  } catch {
    return () => { /* verweigert – nicht schlimm */ };
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
  return () => {
    document.removeEventListener('visibilitychange', beiRueckkehr);
    sperre?.release().catch(() => { /* egal */ });
  };
}
