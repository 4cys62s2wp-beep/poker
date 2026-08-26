/* Gemeinsame Bausteine der Oberfläche.
   ====================================

   Warum es diese Datei gibt: Vor dem Umbau war jede Karte, jeder
   Fortschrittsbalken und jede Kennzahl-Plakette an Ort und Stelle neu
   geschrieben. Das führt unweigerlich dazu, dass sich Abstände und Größen
   auseinanderentwickeln – nicht durch Nachlässigkeit, sondern weil niemand
   35 Kopien gleichzeitig im Kopf hat.

   Alle Maße kommen aus den Tokens in global.css. Keine freien Pixelwerte.
   (docs/DESIGN_REFERENZ.md, R5) */

import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../Icon';

/* ------------------------------------------------------------------ *
 * Karte
 * ------------------------------------------------------------------ */

export type Accent = 'learn' | 'live' | 'tools' | 'friends' | 'neutral';

const ACCENT_VAR: Record<Accent, { color: string; dim: string }> = {
  learn: { color: 'var(--accent-learn)', dim: 'var(--accent-learn-dim)' },
  live: { color: 'var(--accent-live)', dim: 'var(--accent-live-dim)' },
  tools: { color: 'var(--accent-tools)', dim: 'var(--accent-tools-dim)' },
  friends: { color: 'var(--accent-friends)', dim: 'var(--accent-friends-dim)' },
  neutral: { color: 'var(--text-dim)', dim: 'transparent' },
};

export function accentColor(accent: Accent): string {
  return ACCENT_VAR[accent].color;
}

interface HubCardProps {
  to: string;
  icon: IconName;
  accent: Accent;
  title: string;
  /** Eine Zeile: was man hier tut. */
  subtitle: string;
  /** Fortschritt oder Zustand – erscheint statt des Untertitels, sobald es
      etwas zu zeigen gibt. Erstnutzer sehen den erklärenden Untertitel. */
  status?: string;
  /** Anteil 0–100 für den Fortschrittsbalken. Fehlt er, gibt es keinen. */
  progress?: number;
  /** Gesperrt (Paywall) – die Karte bleibt sichtbar, aber gedämpft. */
  locked?: boolean;
  /** Noch nicht gebaut: sichtbarer Platzhalter statt Leerstelle. */
  comingSoon?: boolean;
}

/**
 * Die große Einstiegskarte des Hubs.
 *
 * Jede bekommt eine eigene Akzentfarbe und ein eigenes Bildzeichen – nicht
 * drei identische Kacheln mit unterschiedlicher Beschriftung. Wiedererkennung
 * schlägt Lesen (R2).
 */
export function HubCard({
  to, icon, accent, title, subtitle, status, progress, locked, comingSoon,
}: HubCardProps) {
  const a = ACCENT_VAR[accent];
  const inner = (
    <>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 52, height: 52, borderRadius: 'var(--radius)',
          background: a.dim, color: a.color,
          border: `1px solid ${a.color}33`, flexShrink: 0,
        }}
      >
        <Icon name={icon} size={26} />
      </span>

      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block', fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-bold)',
            lineHeight: 'var(--lh-tight)', color: 'var(--text)',
          }}
        >
          {title}
        </span>
        <span
          className="small"
          style={{ display: 'block', color: 'var(--text-dim)', marginTop: 'var(--sp-1)' }}
        >
          {status ?? subtitle}
        </span>
        {progress !== undefined && (
          <span
            className="progressbar"
            style={{ marginTop: 'var(--sp-3)', display: 'block' }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              style={{
                display: 'block', height: '100%',
                width: `${Math.max(0, Math.min(100, progress))}%`,
                background: a.color, borderRadius: 'var(--radius-pill)',
              }}
            />
          </span>
        )}
      </span>

      {/* Nur bei echter Sperre ein Schloss. Ein Häkchen hieße „erledigt“ –
          das ist bei einem Platzhalter das Gegenteil der Wahrheit; der
          Untertitel „Kommt bald“ sagt es ohnehin. */}
      {locked && (
        <span className="pill" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
          <Icon name="lock" size={12} />
        </span>
      )}
    </>
  );

  const style: CSSProperties = {
    display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-4)',
    padding: 'var(--sp-5)', minHeight: 96,
    textDecoration: 'none', color: 'inherit',
    borderColor: comingSoon ? 'var(--border)' : `${a.color}2e`,
    opacity: comingSoon ? 0.5 : 1,
  };

  // Ein Platzhalter ist kein Ziel: Er darf nicht anklickbar sein und nicht
  // in der Tab-Reihenfolge auftauchen.
  if (comingSoon) {
    return <div className="card" style={style} aria-disabled="true">{inner}</div>;
  }
  return <Link className="card hub-card" to={to} style={style}>{inner}</Link>;
}

/* ------------------------------------------------------------------ *
 * Fortschrittsbalken
 * ------------------------------------------------------------------ */

export function ProgressBar({
  value, accent = 'neutral', label,
}: { value: number; accent?: Accent; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progressbar"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div style={{ width: `${pct}%`, background: ACCENT_VAR[accent].color }} />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Kennzahl-Plakette
 * ------------------------------------------------------------------ */

/**
 * Eine Zahl mit Beschriftung darunter – nicht davor.
 *
 * Die Zahl ist die Information, die Beschriftung nur ihre Einordnung. Wer
 * „Level: 7" schreibt, lässt das Auge erst über ein Wort laufen, bevor es die
 * Zahl findet. (R3)
 */
export function StatPill({
  value, label, accent = 'neutral', icon,
}: { value: string | number; label: string; accent?: Accent; icon?: IconName }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        minWidth: 0, flex: '1 1 0',
      }}
    >
      <span
        className="row"
        style={{
          gap: 'var(--sp-1)', color: ACCENT_VAR[accent].color,
          fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {icon && <Icon name={icon} size={14} />}
        {value}
      </span>
      <span
        style={{
          fontSize: 'var(--fs-tiny)', color: 'var(--text-faint)',
          letterSpacing: '0.4px', textTransform: 'uppercase',
          fontWeight: 'var(--fw-medium)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Leerzustand
 * ------------------------------------------------------------------ */

/**
 * Ein Leerzustand ist nicht leer.
 *
 * Er zeigt, was hier entstehen wird, und nennt **genau eine** Handlung
 * dorthin. „Noch keine Daten" allein ist eine Sackgasse. (R7)
 */
export function EmptyState({
  icon, title, body, actionLabel, actionTo, onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center', padding: 'var(--sp-7) var(--sp-5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 'var(--sp-3)',
      }}
    >
      <span style={{ color: 'var(--text-faint)' }}>
        <Icon name={icon} size={34} />
      </span>
      <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-h3)' }}>{title}</div>
      <p className="small muted" style={{ margin: 0, maxWidth: 380 }}>{body}</p>
      {actionLabel && actionTo && (
        <Link className="btn primary sm" to={actionTo} style={{ marginTop: 'var(--sp-2)' }}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button className="btn primary sm" type="button" onClick={onAction} style={{ marginTop: 'var(--sp-2)' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Seitenkopf mit Rückweg
 * ------------------------------------------------------------------ */

/**
 * Der Rückweg führt immer eine Ebene NACH OBEN in der Struktur – nicht
 * dorthin, woher man kam.
 *
 * Browser-Zurück ist unzuverlässig: Wer über einen geteilten Link direkt auf
 * einer Detailseite landet, hat kein Zurück. Wer über die Suche kam, landet
 * in der Suche. Ein struktureller Rückweg ist immer richtig – und das
 * Browser-Zurück funktioniert zusätzlich weiter.
 */
export function PageHeader({
  eyebrow, title, sub, backTo, backLabel, actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      {backTo && (
        <Link
          to={backTo}
          className="small"
          style={{
            /* Eigene Zeile, nicht inline: Sonst stünde der Rückweg neben der
               Bereichszeile und beide läsen sich als ein Text. */
            display: 'flex', alignItems: 'center', gap: 'var(--sp-1)',
            width: 'fit-content',
            color: 'var(--text-dim)', textDecoration: 'none',
            marginBottom: 'var(--sp-2)', minHeight: 'var(--touch-min)',
          }}
        >
          <span aria-hidden="true">←</span> {backLabel ?? 'Zurück'}
        </Link>
      )}
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <div className="row between wrap" style={{ gap: 'var(--sp-3)' }}>
        <h1>{title}</h1>
        {actions}
      </div>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}
