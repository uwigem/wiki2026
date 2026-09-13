import type { ReactNode } from 'react'

/**
 * Inline formatting for the content files: `**bold**`, `*italic*` and
 * `` `code` ``.
 *
 * Three marks, no markdown dependency and no `dangerouslySetInnerHTML`, so a
 * paragraph in `content/pages.ts` can never inject markup into the page.
 * Anything else you type, including a `[link](url)`, comes out as literal text.
 * If you need more than these three, say so before adding a parser.
 */

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g

export function inline(text: string): ReactNode[] {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code key={i} className="rounded-sm bg-leaf-200 px-1 py-0.5 font-mono text-[0.86em]">
          {part.slice(1, -1)}
        </code>
      )
    return <span key={i}>{part}</span>
  })
}

/** Renders an array of paragraph strings with inline formatting. */
export default function RichText({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{inline(p)}</p>
      ))}
    </>
  )
}
