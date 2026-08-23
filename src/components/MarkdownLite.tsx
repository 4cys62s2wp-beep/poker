import { Fragment, type ReactNode } from 'react';

/** Rendert **fett** innerhalb einer Zeile. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-${i}`}>{part}</strong> : <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>,
  );
}

/**
 * Minimaler Markdown-Renderer für Lektionstexte:
 * Absätze (Leerzeile), Listen ("- "), **fett**.
 */
export function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const isList = lines.every((l) => l.startsWith('- '));
        if (isList) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.slice(2), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(lines.join(' '), `${bi}`)}</p>;
      })}
    </>
  );
}
