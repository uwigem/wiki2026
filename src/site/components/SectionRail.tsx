import { useEffect, useRef, useState } from 'react'
import { DAISY, TUFT } from '../../engine/sprites'
import { revealSection } from '../router'
import PixelSprite from './PixelSprite'

/**
 * The outline of a long page: every section, and the subsections inside each.
 *
 * Two parts, because they sit in different places:
 *
 * - `SectionAside` is the outline beside the reading column on wide screens.
 *   It is placed inside the column of section cards, so it appears where the
 *   sections start, sticks while they scroll past, and stops where they end.
 * - `SectionMenu` is the same outline behind a corner button on everything
 *   narrower, plus a way back to the top.
 *
 * The whole outline is always open. An earlier version showed only the
 * current section's subsections, so the list grew and shrank every time the
 * reader crossed into a section with a different number of them, and the
 * entries jumped about under the cursor. Now nothing in it ever changes size:
 * the current section and subsection are marked, and if the outline is taller
 * than the window it scrolls inside itself to keep the marked entry in view.
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
 * current. A jump lands a block at `scroll-padding-top` (5.5rem, see
 * index.css), so this sits just under that, and the entry jumped to is the
 * one marked.
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

interface Active {
  section: number
  item: number
}

/** Where the reader is. Recomputed on scroll, resize, and when a collapsed section opens or closes. */
function useActive(sections: RailSection[]): Active {
  const [active, setActive] = useState<Active>({ section: -1, item: -1 })
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const section = lastPassed(sections.map((s) => s.id))
      const item = section >= 0 ? lastPassed(sections[section].items.map((i) => i.id)) : -1
      setActive((prev) => (prev.section === section && prev.item === item ? prev : { section, item }))
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
  return active
}

function jump(id: string) {
  window.history.replaceState(null, '', '#' + id)
  revealSection(id, false)
}

function toTop() {
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Keeps the marked entry visible inside a scrolling outline, by scrolling the
 * outline itself (never the page).
 */
function useKeepInView(box: React.RefObject<HTMLElement | null>, active: Active) {
  useEffect(() => {
    const el = box.current
    if (!el) return
    const mark = el.querySelector<HTMLElement>('[data-mark="item"]') ?? el.querySelector<HTMLElement>('[data-mark="section"]')
    if (!mark) return
    const top = mark.offsetTop
    const bottom = top + mark.offsetHeight
    const pad = 24
    if (top - pad < el.scrollTop) el.scrollTo({ top: Math.max(0, top - pad), behavior: 'smooth' })
    else if (bottom + pad > el.scrollTop + el.clientHeight)
      el.scrollTo({ top: bottom + pad - el.clientHeight, behavior: 'smooth' })
  }, [box, active])
}

function Outline({
  sections,
  active,
  onPick,
  touch,
}: {
  sections: RailSection[]
  active: Active
  onPick?: () => void
  /** Sized for a finger rather than a cursor, for the pop-up menu. */
  touch?: boolean
}) {
  const pick = (id: string) => {
    jump(id)
    onPick?.()
  }
  return (
    <ol className="flex flex-col gap-1">
      {sections.map((s, si) => {
        const inSection = si === active.section
        const onSection = inSection && active.item < 0
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => pick(s.id)}
              aria-current={onSection ? 'location' : undefined}
              data-mark={onSection ? 'section' : undefined}
              className={
                'flex w-full items-center gap-2 rounded-sm px-2 py-1 text-left text-[0.8rem] font-semibold leading-snug transition-colors ' +
                (touch ? 'min-h-9 ' : '') +
                (inSection ? 'bg-leaf-200' : 'hover:bg-leaf-100')
              }
            >
              {/* A daisy for the section you are in, a tuft of grass for the rest. */}
              <span aria-hidden className="flex h-[14px] w-[14px] shrink-0 items-end justify-center">
                <PixelSprite sprite={inSection ? DAISY : TUFT} scale={2} />
              </span>
              <span>{s.label}</span>
            </button>
            {s.items.length > 0 && (
              <ol className="ml-[1.05rem] mt-0.5 flex flex-col border-l-2 border-leaf-300">
                {s.items.map((it, ii) => {
                  const on = inSection && ii === active.item
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        onClick={() => pick(it.id)}
                        aria-current={on ? 'location' : undefined}
                        data-mark={on ? 'item' : undefined}
                        className={
                          '-ml-[2px] block w-full border-l-2 py-[3px] pl-2.5 pr-1 text-left text-[0.72rem] leading-snug transition-colors ' +
                          (touch ? 'min-h-8 content-center ' : '') +
                          (on
                            ? 'border-leaf-800 bg-leaf-100 font-semibold text-[var(--ink)]'
                            : 'border-transparent text-leaf-800 hover:border-leaf-500 hover:text-[var(--ink)]')
                        }
                      >
                        {it.label}
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/** The outline in the left margin, beside the section cards. Wide screens only. */
export function SectionAside({ sections }: { sections: RailSection[] }) {
  const active = useActive(sections)
  const box = useRef<HTMLDivElement>(null)
  useKeepInView(box, active)
  return (
    <nav
      aria-label="Sections of this page"
      className="absolute inset-y-0 right-full mr-6 hidden w-44 print:hidden xl:block min-[1400px]:w-56"
    >
      <div className="panel sticky top-24 flex max-h-[calc(100vh-7.5rem)] flex-col py-3">
        <p className="kicker mb-1.5 px-4">On this page</p>
        <div ref={box} className="relative min-h-0 flex-1 overflow-y-auto px-2">
          <Outline sections={sections} active={active} />
        </div>
        <button
          type="button"
          onClick={toTop}
          className="mx-2 mt-2 border-t-2 border-dashed border-leaf-300 px-2 pt-2 text-left text-[0.75rem] text-leaf-800 hover:underline"
        >
          ↑ Back to top
        </button>
      </div>
    </nav>
  )
}

/**
 * Below the wide layout: one button in the corner that names the section the
 * reader is in and opens the outline. On wide screens it is a plain
 * back-to-top arrow, once the reader has scrolled far enough to want one.
 */
export function SectionMenu({ sections }: { sections: RailSection[] }) {
  const active = useActive(sections)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  /** Stood aside: the reader is going down the page and is not looking for this. */
  const [stood, setStood] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useKeepInView(box, open ? active : { section: -2, item: -2 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /*
   * The button floats over the reading column, so it steps aside while the
   * reader is going down the page and comes back the moment they scroll up,
   * which is when somebody is looking for a way out rather than reading. It
   * also stays put near the top, where it covers nothing.
   */
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 240) setStood(false)
      else if (y > last + 6) setStood(true)
      else if (y < last - 6) setStood(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Closes on Escape and on a click anywhere else.
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
  const current = active.section >= 0 ? sections[active.section] : null

  return (
    <>
      {/* Wide screens: back to top, once it is useful. */}
      {scrolled && (
        <button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          className="pixel-btn fixed bottom-4 right-4 z-30 hidden px-3 py-2 print:hidden xl:inline-flex"
        >
          ↑
        </button>
      )}

      {/* Everything narrower: the outline behind one button. */}
      <div
        ref={popRef}
        className={
          'fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 transition-transform duration-200 motion-reduce:transition-none print:hidden xl:hidden ' +
          (stood && !open ? 'pointer-events-none translate-y-[calc(100%+1.5rem)]' : 'translate-y-0')
        }
      >
        {open && (
          <nav id="section-menu" aria-label="Sections of this page" className="panel flex max-h-[70vh] w-72 flex-col py-3">
            <p className="kicker mb-1.5 px-4">On this page</p>
            <div ref={box} className="relative min-h-0 flex-1 overflow-y-auto px-2">
              <Outline sections={sections} active={active} onPick={() => setOpen(false)} touch />
            </div>
            <button
              type="button"
              onClick={() => {
                toTop()
                setOpen(false)
              }}
              className="mx-2 mt-2 min-h-9 border-t-2 border-dashed border-leaf-300 px-2 pt-2 text-left text-[0.75rem] text-leaf-800"
            >
              ↑ Back to top
            </button>
          </nav>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="section-menu"
          /* Narrow on a phone: even standing aside between scrolls, a long
             section name would cover half a line of text. */
          className="pixel-btn pixel-btn-primary flex min-h-11 max-w-[11rem] items-center gap-2 py-2 text-xs sm:max-w-[15rem]"
        >
          <span aria-hidden>☰</span>
          <span className="truncate">{current ? current.label : 'Sections'}</span>
        </button>
      </div>
    </>
  )
}
