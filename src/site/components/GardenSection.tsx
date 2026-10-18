import type { ReactNode } from 'react'
import { useRevealOnScroll } from '../hooks'

/**
 * A page section: the reading column.
 *
 * Keeps content in a readable width over the garden background (`GardenBackdrop`) and
 * leaves enough margin either side that the world stays visible. The width and
 * padding classes here are mirrored in `site/layout.ts`, which the canvases use
 * to line up with this column. Change both together.
 */
export default function GardenSection({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={'relative ' + (className ?? '')}>
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

/** A gap between sections. The garden showing through is the transition. */
export function SectionDivider() {
  return <div aria-hidden className="h-10 sm:h-14" />
}

/**
 * The break between two sections of a long page.
 *
 * A long page's sections were separated by space alone, which read as the same
 * break as the dashed rule between two blocks inside one section. This is a
 * louder, different mark, so a change of topic looks like a change of topic.
 */
export function SectionBreak() {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <span className="h-[3px] flex-1 bg-leaf-400" />
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 bg-leaf-600" />
        <span className="h-1.5 w-1.5 bg-leaf-600" />
        <span className="h-1.5 w-1.5 bg-leaf-600" />
      </span>
      <span className="h-[3px] flex-1 bg-leaf-400" />
    </div>
  )
}

/**
 * Fades its children in the first time they scroll into view.
 *
 * Starts at `opacity-0`, so anything inside is invisible until the observer
 * fires. Print styles in index.css force it back to 1, or printed pages would
 * be blank below the fold.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  id,
}: {
  children: ReactNode
  delay?: number
  className?: string
  /** Makes this block a link target. See `useSectionJump` in the router. */
  id?: string
}) {
  const { ref, shown } = useRevealOnScroll<HTMLDivElement>()
  return (
    <div
      id={id}
      ref={ref}
      className={(shown ? 'reveal' : 'opacity-0') + (className ? ' ' + className : '')}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
