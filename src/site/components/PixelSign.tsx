import type { ReactNode } from 'react'
import RichText from './RichText'

/**
 * Signboards and reading panels.
 *
 * No sprites are used as ornament here. The garden is alive behind the page, so
 * these only have one job: be opaque enough that body copy is comfortable to
 * read on top of moving water.
 */

export default function PixelSign({
  children,
  posts = true,
  className,
}: {
  children: ReactNode
  posts?: boolean
  className?: string
}) {
  return (
    <div className={'relative inline-block ' + (className ?? '')}>
      <div className="sign px-5 py-3 sm:px-7 sm:py-4">{children}</div>
      {posts && (
        <div aria-hidden className="flex justify-center gap-[38%]">
          <span className="block h-5 w-3 border-x-2 border-wood-line bg-wood" />
          <span className="block h-5 w-3 border-x-2 border-wood-line bg-wood" />
        </div>
      )}
    </div>
  )
}

/** The reading panel: a cream card. Body copy lives on one of these. */
export function TextPanel({
  children,
  heading,
  source,
  className,
  flat,
}: {
  children: ReactNode
  heading?: string
  source?: string
  className?: string
  flat?: boolean
}) {
  return (
    <section className={(flat ? 'panel-flat' : 'panel') + ' px-5 py-5 sm:px-7 sm:py-6 ' + (className ?? '')}>
      {heading && <h2 className="mb-3 text-xl">{heading}</h2>}
      <div className="prose-garden text-body">{children}</div>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}

/**
 * A pulled-out quote on a wooden sign.
 *
 * The quote is body copy, so it is set in the body font even though it sits on
 * a sign. A sentence in Pixelify Sans is a display effect, not something anyone
 * wants to read.
 */
export function QuoteSign({ paragraphs, source }: { paragraphs: string[]; source?: string }) {
  return (
    <figure className="my-1 flex flex-col items-center text-center">
      <PixelSign>
        <blockquote className="quote-sign prose-garden mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
          <RichText paragraphs={paragraphs} />
        </blockquote>
      </PixelSign>
      {source && <figcaption className="kicker mt-3 normal-case">{source}</figcaption>}
    </figure>
  )
}

/**
 * The placeholder marker. This whole site is scaffolding for content that hasn't
 * been written yet, so these are meant to be conspicuous. Every page carries
 * one, and they stay until the content lands.
 */
export function TodoPanel({ items, title = 'still to come' }: { items: string[]; title?: string }) {
  return (
    <div className="panel-flat px-5 py-4">
      <h2 className="kicker mb-3">{title}</h2>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="todo-note">
            <span aria-hidden>▸</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
