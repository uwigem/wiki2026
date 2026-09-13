import type { ReactNode } from 'react'
import { useRevealOnScroll } from '../hooks'

/**
 * A page section: the reading column.
 *
 * Keeps content in a readable width over the garden canvas (`PageGarden`) and
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
 * Fades its children in the first time they scroll into view.
 *
 * Starts at `opacity-0`, so anything inside is invisible until the observer
 * fires. Print styles in index.css force it back to 1, or printed pages would
 * be blank below the fold.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, shown } = useRevealOnScroll<HTMLDivElement>()
  return (
    <div ref={ref} className={shown ? 'reveal' : 'opacity-0'} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}
