import { Fragment, useMemo, type ReactNode } from 'react';
import { useLang } from '../i18n';
import { baueIndex, findeEintrag, type Index } from '../lib/glossar/verknuepfen';
import { Begriff } from './Begriff';

/** Rendert **fett** innerhalb einer Zeile. Ein fett gesetzter Begriff, zu dem
 *  es einen Glossareintrag gibt, ist antippbar (E-092). */
function renderInline(text: string, keyPrefix: string, index: Index): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
    const eintrag = findeEintrag(index, part);
    return (
      <strong key={`${keyPrefix}-${i}`}>
        {eintrag ? <Begriff eintrag={eintrag}>{part}</Begriff> : part}
      </strong>
    );
  });
}

/**
 * Minimaler Markdown-Renderer für Lektionstexte:
 * Absätze (Leerzeile), Listen ("- "), **fett**.
 */
export function MarkdownLite({ text }: { text: string }) {
  const { content } = useLang();
  const index = useMemo(() => baueIndex(content.glossary), [content.glossary]);
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
                <li key={li}>{renderInline(l.slice(2), `${bi}-${li}`, index)}</li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(lines.join(' '), `${bi}`, index)}</p>;
      })}
    </>
  );
}
