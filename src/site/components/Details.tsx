import type { ReactNode } from 'react'

/**
 * A section that is closed until asked for: references, the working behind
 * an estimate, background a reader may already know. The heading and a one
 * line summary stay visible, so a judge can see what is here without the
 * page carrying all of it open.
 *
 * A native `<details>`, so it works without script and is announced properly.
 * `revealSection` opens any of these on the way to a link target inside one.
 */
export default function Details({
  heading,
  summary,
  open,
  children,
}: {
  heading: string
  summary?: string
  open?: boolean
  children: ReactNode
}) {
  return (
    <details className="panel group px-5 py-4 sm:px-7 sm:py-5" open={open}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <span className="min-w-0">
          <h2 className="text-xl">{heading}</h2>
          {summary && <p className="mt-1 text-body-sm leading-relaxed text-leaf-800">{summary}</p>}
        </span>
        <span aria-hidden className="pixel-btn shrink-0 py-1 text-xs group-open:hidden">
          Show
        </span>
        <span aria-hidden className="pixel-btn hidden shrink-0 py-1 text-xs group-open:inline-block">
          Hide
        </span>
      </summary>
      <div className="details-body mt-4">{children}</div>
    </details>
  )
}
