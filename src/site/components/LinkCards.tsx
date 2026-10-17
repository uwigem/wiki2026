import { asset } from '../router'
import { FILE, inline } from './RichText'

/**
 * Things to open or download, as a row of cards: a handbook to print, a
 * post to watch, a document to read. Each card says what it is, and ends in
 * one button. A file under `public/` is served from this site; anything else
 * opens where it lives, in a new tab.
 */
export interface LinkItem {
  title: string
  body: string
  /** A path inside `public/` (for example `education/handbook.pdf`) or a full https:// address. */
  href: string
  /** The button's words. Defaults to "Open". */
  label?: string
  /** A small tag over the title: "PDF, 6 pages", "Instagram", "Google Doc". */
  tag?: string
}

export default function LinkCards({
  heading,
  intro,
  items,
  source,
}: {
  heading?: string
  intro?: string
  items: LinkItem[]
  source?: string
}) {
  const cols = items.length === 1 ? 'max-w-xl' : items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}
      <ul className={'mt-4 grid gap-3 ' + cols}>
        {items.map((it) => {
          const local = !/^https?:\/\//.test(it.href)
          const href = local ? asset(it.href.replace(/^\//, '')) : it.href
          const isFile = FILE.test(it.href)
          return (
            <li key={it.href} className="panel-flat flex min-w-0 flex-col gap-2 px-4 py-4">
              {it.tag && <p className="kicker">{it.tag}</p>}
              <h3 className="text-base">{it.title}</h3>
              <p className="flex-1 text-body-sm leading-relaxed">{inline(it.body)}</p>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                download={local && isFile ? '' : undefined}
                className="pixel-btn self-start py-1.5 text-sm"
              >
                {it.label ?? (isFile ? 'Download' : 'Open')} →
              </a>
            </li>
          )
        })}
      </ul>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
