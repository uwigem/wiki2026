import { useEffect, useRef, useState } from 'react'
import { revealSection } from '../router'

/**
 * A floating menu of the page's sections, for long pages.
 *
 * On a wide screen it sits in the right margin beside the reading column and
 * follows the reader: the section they are in is marked, and that section's
 * own headings are listed under it so they can jump within it. On narrower
 * screens the same list folds into one floating button in the corner, whose
 * label is the section the reader is in.
 *
 * Jumps go through `revealSection`, which opens a collapsed section on the way
 * to a target inside it.
 */
export interface RailItem {
  id: string
  label: string
}

export interface RailSection extends RailItem {
  /** The headed blocks inside the section, in page order. */
  items: RailItem[]
}

/**
 * How far below the top of the window a block must reach before it counts as
 * current. A jump lands a block at `scroll-padding-top` (5.5rem, index.css),
 * so this sits just under that, and the section jumped to is the one marked.
 */
const LINE = 100

/** Index of the last listed element whose top has passed the line, or -1. Hidden elements do not count. */
function lastPassed(ids: string[]): number {
  let at = -1
  ids.forEach((id, i) => {
    const el = document.getElementById(id)
    if (!el || el.getClientRects().length === 0) return
    if (el.getBoundingClientRect().top <= LINE) at = i
  })
  return at
}

export default function SectionRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(0)
  const [activeItem, setActiveItem] = useState(-1)
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)

  // Follow the reader. Recomputed on scroll, on resize, and whenever a
  // collapsed section opens or closes (which moves everything below it).
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const s = Math.max(0, lastPassed(sections.map((x) => x.id)))
      setActive(s)
      setActiveItem(lastPassed((sections[s]?.items ?? []).map((x) => x.id)))
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('toggle', schedule, true)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('toggle', schedule, true)
    }
  }, [sections])

  // The folded menu closes on Escape and on a click anywhere else.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onDown = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  if (sections.length === 0) return null

  const jump = (id: string) => {
    window.history.replaceState(null, '', '#' + id)
    revealSection(id, false)
    setOpen(false)
  }

  const list = (withItems: boolean) => (
    <ol className="flex flex-col gap-1">
      {sections.map((s, i) => {
        const on = i === active
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => jump(s.id)}
              aria-current={on ? 'location' : undefined}
              className={
                'flex w-full items-baseline gap-2 rounded-sm border-[3px] px-2 py-1 text-left text-xs leading-snug transition-colors ' +
                (on ? 'border-leaf-800 bg-leaf-200' : 'border-transparent hover:bg-leaf-100')
              }
            >
              <span className="pixel shrink-0 text-[0.6rem] text-leaf-800">{i + 1}</span>
              <span>{s.label}</span>
            </button>
            {withItems && on && s.items.length > 0 && (
              <ol className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-leaf-300 pl-2">
                {s.items.map((it, j) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => jump(it.id)}
                      aria-current={j === activeItem ? 'location' : undefined}
                      className={
                        'w-full rounded-sm px-1.5 py-0.5 text-left text-[0.7rem] leading-snug transition-colors ' +
                        (j === activeItem ? 'bg-leaf-100 font-semibold' : 'text-leaf-800 hover:bg-leaf-100')
                      }
                    >
                      {it.label}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      {/* Wide screens: the rail in the margin. */}
      <nav aria-label="On this page" className="fixed right-4 top-1/2 z-30 hidden w-48 -translate-y-1/2 print:hidden xl:block">
        <div className="panel max-h-[calc(100vh-8rem)] overflow-y-auto px-3 py-3">
          <p className="kicker mb-2">On this page</p>
          {list(true)}
        </div>
      </nav>

      {/* Everything narrower: one button in the corner that says where you are. */}
      <div ref={popRef} className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 print:hidden xl:hidden">
        {open && (
          <nav id="section-menu" aria-label="On this page" className="panel max-h-[60vh] w-64 overflow-y-auto px-3 py-3">
            <p className="kicker mb-2">On this page</p>
            {list(false)}
          </nav>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="section-menu"
          className="pixel-btn pixel-btn-primary flex max-w-[16rem] items-baseline gap-2 py-2 text-xs"
        >
          <span className="pixel shrink-0 text-[0.6rem]">
            {active + 1}/{sections.length}
          </span>
          <span className="truncate">{sections[active]?.label}</span>
          <span aria-hidden className="pixel shrink-0 text-[0.6rem]">
            {open ? '▾' : '▴'}
          </span>
        </button>
      </div>
    </>
  )
}
