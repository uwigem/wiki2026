import type { ReactNode } from 'react'
import { Link, asset } from '../router'
import { Cite } from './citations'
import { StakeholderLink } from './stakeholders'

/**
 * Inline formatting for the content files: `**bold**`, `*italic*`, `` `code` ``
 * and `[label](target)`.
 *
 * Four marks, no markdown dependency and no `dangerouslySetInnerHTML`, so a
 * paragraph in `content/pages.ts` can never inject markup into the page.
 * Anything else you type comes out as literal text.
 *
 * **Links are allowlisted, not parsed.** A target is accepted only if it starts
 * with `/`, which makes it a route inside this wiki, or with `https://`. Every
 * other target, `javascript:` included, is rendered as the plain characters
 * somebody typed. Content here is written by a dozen people across a season and
 * the wiki is public; the parser should not be the thing standing between a
 * pasted string and a script URL.
 *
 * A route may carry a section: `[the pipeline](/engineering#pipeline)` opens
 * the Design page scrolled to the block with `id: 'pipeline'`, and flashes it so
 * the reader can see what they were sent to look at.
 *
 * A third target form, `[Dr. Zheng](stakeholder:zheng)`, opens that person's
 * card on a page that has a `stakeholders` block. See `stakeholders.tsx`.
 *
 * A citation marker, `[4]` or `[9, 10]`, links to that entry in its section's
 * reference list where the page has one. See `citations.tsx`.
 */

const NUM = String.raw`\d+(?:\.\d+)?`
const TOKEN = new RegExp(
  String.raw`(\[[^\]\n]+\]\([^)\s]+\)|\[${NUM}(?:\s*,\s*${NUM})*\](?!\()|\*\*[^*]+\*\*|\*[^*]+\*|` + '`[^`]+`)',
  'g',
)
const CITE = new RegExp(String.raw`^\[(${NUM}(?:\s*,\s*${NUM})*)\]$`)
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/
/** Link targets that are files in public/, not pages. */
export const FILE = /\.(pdf|docx?|pptx?|xlsx?|csv|zip|png|jpe?g|webp|svg|mp4)$/i

export function inline(text: string): ReactNode[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
      if (part.startsWith('`') && part.endsWith('`'))
        return (
          <code key={i} className="rounded-sm bg-leaf-200 px-1 py-0.5 font-mono text-[0.86em]">
            {part.slice(1, -1)}
          </code>
        )

      const cite = CITE.exec(part)
      if (cite) return <Cite key={i} nums={cite[1].split(/\s*,\s*/)} />

      const link = LINK.exec(part)
      if (link) {
        const [, label, target] = link
        if (target.startsWith('/')) {
          // A file under public/ (a handbook PDF, say) opens as a file; a path
          // without an extension is a page of this wiki.
          if (FILE.test(target)) {
            return (
              <a key={i} href={asset(target)} target="_blank" rel="noreferrer noopener" className="cross-link">
                {label}
              </a>
            )
          }
          return (
            <Link key={i} to={target} className="cross-link">
              {label}
            </Link>
          )
        }
        if (target.startsWith('stakeholder:')) {
          return <StakeholderLink key={i} id={target.slice('stakeholder:'.length)} label={label} />
        }
        if (target.startsWith('https://')) {
          return (
            <a key={i} href={target} target="_blank" rel="noreferrer noopener" className="cross-link">
              {label}
            </a>
          )
        }
        // Not a target we will follow. Show what was typed rather than
        // silently dropping it, so the mistake is visible to whoever wrote it.
        return <span key={i}>{part}</span>
      }

      // Checked after links, so the parentheses in a link target cannot be
      // mistaken for emphasis.
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
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
