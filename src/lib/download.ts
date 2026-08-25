/* Datei-Download aus dem Browser heraus.

   Wichtig: Der Blob-Link muss im DOM hängen und darf erst NACH dem Klick
   freigegeben werden – sonst brechen Firefox und ältere Safari-Versionen
   den Download ab, bevor er begonnen hat. */

export function downloadBlob(content: BlobPart, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
}
