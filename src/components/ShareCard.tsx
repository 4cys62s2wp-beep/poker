/* „App teilen“: QR-Code (komplett offline generiert), System-Teilen-Dialog
   und Link kopieren. Der QR-Code zeigt immer auf die aktuelle Domain –
   zieht die App später auf eine eigene Domain um, stimmt er automatisch. */

import { useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/share';

function appUrl(): string {
  return `${location.origin}${location.pathname}`;
}

/** QR-Code als React-SVG (ein Pfad aus allen dunklen Modulen – kein innerHTML).
    Wird auch vom Online-Tisch benutzt (Beitritts-Code als QR). */
export function QrSvg({ text, size, label = 'QR-Code' }: { text: string; size: number; label?: string }) {
  const path = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { d, n };
  }, [text]);

  return (
    <svg
      viewBox={`0 0 ${path.n} ${path.n}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      style={{ background: '#fff', borderRadius: 12, padding: 10, boxSizing: 'content-box' }}
    >
      <path d={path.d} fill="#10241b" />
    </svg>
  );
}

export function ShareCard() {
  const { lang } = useLang();
  const L = STR[lang];
  const [copied, setCopied] = useState(false);

  // Nur sinnvoll, wenn die App über eine echte URL läuft (nicht im Einzeldatei-Preview).
  if (__SINGLE__ || !location.origin.startsWith('http')) return null;
  const url = appUrl();
  const canShare = typeof navigator.share === 'function';

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard gesperrt – kein Drama, QR-Code bleibt
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.title}</div>
      <p className="small muted" style={{ marginBottom: 14 }}>{L.desc}</p>
      <div className="row wrap" style={{ alignItems: 'center', gap: 18 }}>
        <QrSvg text={url} size={150} />
        <div style={{ display: 'grid', gap: 10, minWidth: 150 }}>
          {canShare && (
            <button
              className="btn sm primary"
              onClick={() => navigator.share({ title: 'PokerMentor', url }).catch(() => {})}
            >
              {L.share}
            </button>
          )}
          <button className="btn sm" onClick={copy}>
            {copied ? `✓ ${L.copied}` : L.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
