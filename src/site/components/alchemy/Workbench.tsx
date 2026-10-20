import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ELEMENT, LEVELS, WELCOME, reachable } from '../../content/alchemy'
import { BubbleTail } from '../HedgehogNote'
import { useEscape, useReducedMotion } from '../../hooks'
import ElementIcon, { iconURL } from './ElementIcon'
import FieldGuide from './FieldGuide'
import Hog from './Hog'
import type { Alchemy } from './useAlchemy'

/**
 * The game: a workbench, a sidebar of elements, a strip on top. A box on the
 * page rather than the whole screen, so a drag is a short one.
 *
 * It plays like Little Alchemy. Drag an element from the sidebar onto the
 * bench, drag one piece onto another and they combine where they met. A tap
 * on a sidebar element puts it on the bench; a tap on one piece and then
 * another combines them, which is how it plays on a phone. Dragging a piece
 * back onto the sidebar takes it off the bench.
 *
 * Pieces never land on top of each other: anything placed or made goes to the
 * nearest free spot, and a pair that does not combine is nudged apart, so
 * nothing is ever hidden (and a hidden piece can never count as "touching").
 *
 * The bench is only ever what is on screen; progress (what has been found)
 * lives in `useAlchemy` and survives a reload.
 */

/** The size of a piece, matching `.alc-piece` in index.css. */
const PIECE_W = 88
const PIECE_H = 76
/** Space kept clear round the bench's edge, and the gap between pieces. */
const EDGE = 6
const GAP = 10

interface Piece {
  id: number
  el: string
  x: number
  y: number
}

type Toast =
  | { kind: 'welcome' }
  | { kind: 'made'; el: string; fresh: boolean }
  | { kind: 'nothing'; a: string; b: string }
  | { kind: 'third'; a: string; b: string }
  | { kind: 'hint'; inputs: string[]; full: boolean }
  | { kind: 'nohint' }

/**
 * How long a message stays before fading on its own, in ms. The welcome stays
 * until the first move, and a hint until it is used.
 */
const TOAST_MS: Record<Toast['kind'], number | null> = {
  welcome: null,
  made: 7000,
  nothing: 3500,
  third: 9000,
  hint: null,
  nohint: 4000,
}

let nextId = 1

/** Keep the pointer on the element it started on. Some synthetic pointers cannot be captured; that is fine. */
function capture(e: ReactPointerEvent<HTMLElement>) {
  try {
    e.currentTarget.setPointerCapture(e.pointerId)
  } catch {
    // not a real pointer
  }
}

function overlaps(a: { x: number; y: number }, b: { x: number; y: number }, gap = 0) {
  return a.x < b.x + PIECE_W + gap && a.x + PIECE_W + gap > b.x && a.y < b.y + PIECE_H + gap && a.y + PIECE_H + gap > b.y
}

/** A phone or tablet: the instructions talk about tapping rather than dragging. */
function useTouch(): boolean {
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const on = () => setTouch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return touch
}

export default function Workbench({ game }: { game: Alchemy }) {
  const { level, known, counted, toFind, done } = game
  const touch = useTouch()
  const reduced = useReducedMotion()
  const boardRef = useRef<HTMLDivElement>(null)
  const sideRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [pieces, setPieces] = useState<Piece[]>([])
  const piecesRef = useRef(pieces)
  piecesRef.current = pieces

  const [selected, setSelected] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  /** Pieces that pop or wobble: id to the effect, cleared after it plays. */
  const [effects, setEffects] = useState<Record<number, 'pop' | 'wobble'>>({})
  /** Made but not yet picked up from the sidebar: these sit at the top and glow. */
  const [fresh, setFresh] = useState<string[]>([])
  /** The game opens with the hedgehog saying what it is about. */
  const [toast, setToast] = useState<Toast | null>({ kind: 'welcome' })
  const openedOn = useRef(level)
  /** The welcome waits until the bench is on screen, so it is not said to nobody. */
  const [benchSeen, setBenchSeen] = useState(false)
  /** The level-finished card, shown once when the goal is made. */
  const [celebrate, setCelebrate] = useState(false)
  const [search, setSearch] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)

  const drag = useRef<{ id: number; offX: number; offY: number; moved: boolean } | null>(null)
  const sideDrag = useRef<{ el: string; moved: boolean; ghost: HTMLDivElement } | null>(null)

  /**
   * Drop whatever drag is in flight and take its ghost off the page.
   *
   * The ghost is a plain node parented to `document.body`, so it sits outside
   * React's tree and nothing else will ever tidy it: one that outlives its
   * drag stays `position: fixed` over every page until a reload, because
   * routing only replaces what is inside the root. Belt and braces, this
   * sweeps every `.alc-ghost` rather than the one in the ref, since a ghost
   * orphaned by a second drag is no longer reachable through it.
   */
  const endDrag = useCallback(() => {
    sideDrag.current = null
    drag.current = null
    document.querySelectorAll('.alc-ghost').forEach((g) => g.remove())
    setDragging(null)
    setOver(null)
  }, [])

  /**
   * A drag can end without the button it began on ever hearing about it: the
   * pointer is released somewhere else because capture failed or was never
   * taken (touch takes none), a second finger starts a drag of its own, the
   * button unmounts because the list filtered or the level changed, or the
   * reader navigates away mid-drag. The window hears all of those. React's
   * own handler runs first on the way up to the root, so an ordinary drop
   * still does its work and this only tidies up behind it.
   */
  useEffect(() => {
    const done = () => {
      if (sideDrag.current || drag.current) endDrag()
    }
    window.addEventListener('pointerup', done)
    window.addEventListener('pointercancel', done)
    // Released over the browser's own chrome, or the tab sent to the back.
    window.addEventListener('blur', done)
    return () => {
      window.removeEventListener('pointerup', done)
      window.removeEventListener('pointercancel', done)
      window.removeEventListener('blur', done)
      // Leaving mid-drag: the ghost would otherwise outlive the whole game.
      endDrag()
    }
  }, [endDrag])

  useEscape(selected !== null || toast !== null || celebrate, () => {
    setSelected(null)
    setToast(null)
    setCelebrate(false)
  })

  // A new level starts with an empty bench and the list scrolled to the top,
  // with the things this level adds (not seen in the level before) pinned
  // there as new.
  useEffect(() => {
    const prev = LEVELS[LEVELS.indexOf(level) - 1]
    const seen = prev ? [...prev.starters, ...reachable(prev)] : level.starters
    setPieces([])
    setSelected(null)
    setFresh(level.starters.filter((id) => !seen.includes(id)))
    // The welcome survives the first run of this, when the page opens.
    setToast((t) => (t?.kind === 'welcome' && level === openedOn.current ? t : null))
    setCelebrate(false)
    setSearch('')
    if (listRef.current) listRef.current.scrollTop = 0
  }, [level])

  useEffect(() => {
    const b = boardRef.current
    if (!b || typeof IntersectionObserver === 'undefined') {
      setBenchSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setBenchSeen(true)
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(b)
    return () => io.disconnect()
  }, [])

  // Messages fade on their own, except the welcome and a hint (see TOAST_MS).
  useEffect(() => {
    if (!toast) return
    const ms = toast.kind === 'made' && !toast.fresh ? 3000 : TOAST_MS[toast.kind]
    if (ms === null) return
    const t = window.setTimeout(() => setToast(null), ms)
    return () => window.clearTimeout(t)
  }, [toast])

  const effect = useCallback((id: number, kind: 'pop' | 'wobble') => {
    setEffects((e) => ({ ...e, [id]: kind }))
    window.setTimeout(
      () =>
        setEffects((e) => {
          const { [id]: _gone, ...rest } = e
          return rest
        }),
      500,
    )
  }, [])

  /**
   * The free spot nearest (x, y): inside the bench and clear of every piece
   * except the ones in `ignore`. Searches outwards in rings.
   */
  const freeSpot = useCallback((x: number, y: number, ignore: number[] = []) => {
    const b = boardRef.current
    const w = b?.clientWidth ?? 600
    const h = b?.clientHeight ?? 400
    const cx = (v: number) => Math.max(EDGE, Math.min(w - PIECE_W - EDGE, v))
    const cy = (v: number) => Math.max(EDGE, Math.min(h - PIECE_H - EDGE, v))
    const others = piecesRef.current.filter((p) => !ignore.includes(p.id))
    const clear = (px: number, py: number) => !others.some((o) => overlaps({ x: px, y: py }, o, GAP))
    const start = { x: cx(x), y: cy(y) }
    if (clear(start.x, start.y)) return start
    for (let ring = 1; ring <= 14; ring++) {
      const steps = ring * 8
      for (let k = 0; k < steps; k++) {
        const a = (k / steps) * Math.PI * 2
        const px = cx(start.x + Math.cos(a) * ring * 26)
        const py = cy(start.y + Math.sin(a) * ring * 22)
        if (clear(px, py)) return { x: px, y: py }
      }
    }
    return start
  }, [])

  /** Where a tapped element goes: the first free cell of a grid from the top left. */
  const spawn = useCallback(() => {
    const b = boardRef.current
    const w = b?.clientWidth ?? 600
    const h = b?.clientHeight ?? 400
    for (let y = EDGE + 30; y + PIECE_H <= h - EDGE; y += PIECE_H + GAP)
      for (let x = EDGE + 8; x + PIECE_W <= w - EDGE; x += PIECE_W + GAP) {
        if (!piecesRef.current.some((o) => overlaps({ x, y }, o, GAP))) return { x, y }
      }
    return freeSpot(w / 2 - PIECE_W / 2, h / 2 - PIECE_H / 2)
  }, [freeSpot])

  const add = useCallback(
    (el: string, at?: { x: number; y: number }) => {
      const pos = at ? freeSpot(at.x, at.y) : spawn()
      const piece: Piece = { id: nextId++, el, x: pos.x, y: pos.y }
      piecesRef.current = [...piecesRef.current, piece]
      setPieces(piecesRef.current)
      setFresh((f) => f.filter((x) => x !== el))
      setToast((t) => (t?.kind === 'welcome' ? null : t))
      effect(piece.id, 'pop')
      return piece
    },
    [spawn, freeSpot, effect],
  )

  /** `moved` was dropped on `target`. Combine if there is a recipe for it. */
  const tryCombine = useCallback(
    (moved: Piece, target: Piece) => {
      const all = piecesRef.current
      const made = game.combine([moved.el, target.el])
      const finish = (used: Piece[], makes: { id: string; fresh: boolean }) => {
        const gone = new Set(used.map((p) => p.id))
        const x = used.reduce((s, p) => s + p.x, 0) / used.length
        const y = used.reduce((s, p) => s + p.y, 0) / used.length
        piecesRef.current = piecesRef.current.filter((q) => !gone.has(q.id))
        const pos = freeSpot(x, y)
        const piece: Piece = { id: nextId++, el: makes.id, ...pos }
        piecesRef.current = [...piecesRef.current, piece]
        setPieces(piecesRef.current)
        effect(piece.id, 'pop')
        if (makes.fresh) setFresh((f) => [makes.id, ...f.filter((z) => z !== makes.id)])
        const goalsLeft = level.goals.filter((g) => g !== makes.id && !game.found.includes(g))
        if (makes.fresh && level.goals.includes(makes.id) && goalsLeft.length === 0) {
          setToast(null)
          setCelebrate(true)
        } else setToast({ kind: 'made', el: makes.id, fresh: makes.fresh })
      }
      if (made) {
        finish([moved, target], made)
        return
      }
      // A three-way recipe: the third ingredient has to be touching one of them.
      const third = game.thirdFor(moved.el, target.el)
      if (third) {
        const t = all.find((p) => p.id !== moved.id && p.id !== target.id && p.el === third && (overlaps(p, moved) || overlaps(p, target)))
        if (t) {
          const made3 = game.combine([moved.el, target.el, third])
          if (made3) {
            finish([moved, target, t], made3)
            return
          }
        }
        // Keep the two side by side, just touching, and ask for the third.
        setPieces((p) => p.map((q) => (q.id === moved.id ? { ...q, x: target.x + PIECE_W - 12, y: target.y + 8 } : q)))
        setToast({ kind: 'third', a: moved.el, b: target.el })
        return
      }
      // No recipe: nudge the dropped piece aside so neither is hidden.
      const pos = freeSpot(moved.x + PIECE_W * 0.6, moved.y + PIECE_H * 0.4, [moved.id])
      piecesRef.current = piecesRef.current.map((q) => (q.id === moved.id ? { ...q, ...pos } : q))
      setPieces(piecesRef.current)
      effect(moved.id, 'wobble')
      setToast({ kind: 'nothing', a: moved.el, b: target.el })
    },
    [game, level.goals, freeSpot, effect],
  )

  /**
   * Any new move clears a passing message. A hint stays until it is used, and
   * the welcome until something is put on the bench (see `add`).
   */
  const nextMove = () => setToast((t) => (t?.kind === 'hint' || t?.kind === 'welcome' ? t : null))

  /* ------------------------------------------------------- bench pointer */
  const onPiecePointerDown = (e: ReactPointerEvent<HTMLButtonElement>, piece: Piece) => {
    if (e.button !== 0) return
    e.preventDefault()
    nextMove()
    setCelebrate(false)
    const b = boardRef.current!.getBoundingClientRect()
    drag.current = { id: piece.id, offX: e.clientX - b.left - piece.x, offY: e.clientY - b.top - piece.y, moved: false }
    capture(e)
    // Bring it to the top.
    setPieces((p) => [...p.filter((q) => q.id !== piece.id), piece])
  }

  const onPiecePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return
    const b = boardRef.current!.getBoundingClientRect()
    const x = Math.max(-PIECE_W / 2, Math.min(b.width - PIECE_W / 2, e.clientX - b.left - d.offX))
    const y = Math.max(-PIECE_H / 2, Math.min(b.height - PIECE_H / 2, e.clientY - b.top - d.offY))
    if (!d.moved) {
      const start = piecesRef.current.find((p) => p.id === d.id)
      if (start && Math.hypot(x - start.x, y - start.y) < 4) return
      d.moved = true
      setDragging(d.id)
      setSelected(null)
    }
    piecesRef.current = piecesRef.current.map((q) => (q.id === d.id ? { ...q, x, y } : q))
    setPieces(piecesRef.current)
    const hit = [...piecesRef.current].reverse().find((q) => q.id !== d.id && overlaps({ x, y }, q))
    setOver(hit?.id ?? null)
  }

  const onPiecePointerUp = (e: ReactPointerEvent<HTMLButtonElement>, piece: Piece) => {
    const d = drag.current
    drag.current = null
    setDragging(null)
    setOver(null)
    if (!d) return
    if (!d.moved) {
      // A tap: pick it, or combine it with the one picked before.
      if (selected === null) {
        setSelected(piece.id)
      } else if (selected === piece.id) {
        setSelected(null)
      } else {
        const a = piecesRef.current.find((p) => p.id === selected)
        setSelected(null)
        if (a) tryCombine(a, piecesRef.current.find((p) => p.id === piece.id) ?? piece)
      }
      return
    }
    // Dropped on the sidebar: off the bench.
    const s = sideRef.current?.getBoundingClientRect()
    if (s && e.clientX >= s.left && e.clientX <= s.right && e.clientY >= s.top && e.clientY <= s.bottom) {
      piecesRef.current = piecesRef.current.filter((q) => q.id !== d.id)
      setPieces(piecesRef.current)
      return
    }
    const moved = piecesRef.current.find((p) => p.id === d.id)
    if (!moved) return
    const target = [...piecesRef.current].reverse().find((q) => q.id !== d.id && overlaps(moved, q))
    if (target) tryCombine(moved, target)
    else {
      // Dropped half off the edge: bring it back in, clear of the others.
      const pos = freeSpot(moved.x, moved.y, [moved.id])
      piecesRef.current = piecesRef.current.map((q) => (q.id === moved.id ? { ...q, ...pos } : q))
      setPieces(piecesRef.current)
    }
  }

  /* ----------------------------------------------------- sidebar pointer */
  const onItemPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, el: string) => {
    if (e.button !== 0) return
    // On touch, a swipe on the list scrolls it, so only a tap places (see touch-action in index.css).
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') e.preventDefault()
    // A drag already in flight means its end was missed; clear it first, or
    // replacing the ref below strands its ghost for good.
    if (sideDrag.current) endDrag()
    const ghost = document.createElement('div')
    ghost.className = 'alc-ghost alc-piece flex flex-col items-center'
    ghost.style.left = `${e.clientX - PIECE_W / 2}px`
    ghost.style.top = `${e.clientY - PIECE_H / 2}px`
    ghost.style.display = 'none'
    const img = document.createElement('img')
    img.src = iconURL(el)
    img.width = 48
    img.height = 48
    img.className = 'pixelated'
    const label = document.createElement('span')
    label.className = 'pixel block text-center text-xs leading-tight'
    label.textContent = ELEMENT[el].name
    ghost.append(img, label)
    document.body.appendChild(ghost)
    sideDrag.current = { el, moved: false, ghost }
    if (e.pointerType !== 'touch') capture(e)
  }

  const onItemPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = sideDrag.current
    if (!d || e.pointerType === 'touch') return
    d.moved = true
    d.ghost.style.display = 'flex'
    d.ghost.style.left = `${e.clientX - PIECE_W / 2}px`
    d.ghost.style.top = `${e.clientY - PIECE_H / 2}px`
  }

  const onItemPointerUp = (e: ReactPointerEvent<HTMLButtonElement>, el: string) => {
    const d = sideDrag.current
    sideDrag.current = null
    if (!d) return
    d.ghost.remove()
    nextMove()
    setCelebrate(false)
    const b = boardRef.current?.getBoundingClientRect()
    if (!d.moved) {
      add(el)
      return
    }
    if (b && e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom) {
      const drop = { x: e.clientX - b.left - PIECE_W / 2, y: e.clientY - b.top - PIECE_H / 2 }
      // Dropped straight onto another piece: combine, the way Little Alchemy does.
      const target = [...piecesRef.current].reverse().find((q) => overlaps(drop, q))
      if (target) {
        const piece: Piece = { id: nextId++, el, ...drop }
        piecesRef.current = [...piecesRef.current, piece]
        setPieces(piecesRef.current)
        setFresh((f) => f.filter((x) => x !== el))
        tryCombine(piece, target)
      } else add(el, drop)
    }
  }

  /* ------------------------------------------------------------- level */
  const clearBench = () => {
    piecesRef.current = []
    setPieces([])
    setSelected(null)
    setToast(null)
  }

  const askHint = () => {
    setCelebrate(false)
    if (toast?.kind === 'hint' && !toast.full) {
      setToast({ ...toast, full: true })
      return
    }
    const inputs = game.nextHint()
    setToast(inputs ? { kind: 'hint', inputs, full: false } : { kind: 'nohint' })
  }

  // On a phone the hedgehog only shows to say hello: after that the bench needs the room.
  const hogShows = toast?.kind === 'welcome' ? 'block' : 'hidden md:block'
  const hinted = toast?.kind === 'hint' ? (toast.full ? toast.inputs : toast.inputs.slice(0, 1)) : []
  // Bring a hinted element into view in the list.
  useEffect(() => {
    if (!hinted.length || !listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-hint]`)
    el?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [hinted.join('+'), reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  const q = search.trim().toLowerCase()
  // New finds first, so they are never below the fold; then everything else.
  const ordered = [...fresh.filter((id) => known.includes(id)), ...known.filter((id) => !fresh.includes(id))]
  const list = q ? ordered.filter((id) => ELEMENT[id].name.toLowerCase().includes(q)) : ordered
  const levelIndex = LEVELS.indexOf(level)
  const nextLevel = LEVELS[levelIndex + 1]
  const goalNames = level.goals.map((g) => ELEMENT[g].name).join(' and ')
  const left = toFind.length - counted.length

  return (
    <div className="panel flex flex-col overflow-hidden text-leaf-950">
      {/* -------------------------------------------------------- strip */}
      <header className="flex min-h-11 shrink-0 items-center gap-2 border-b-[3px] border-leaf-300 bg-leaf-50 px-2 py-1">
        <span className="pixel shrink-0 text-xs text-leaf-800">Goal</span>
        <span className="flex shrink-0 items-center gap-1">
          {level.goals.map((g) => (
            <ElementIcon key={g} id={g} className={game.found.includes(g) ? '' : 'opacity-70'} />
          ))}
        </span>
        <span className="min-w-0 truncate text-sm font-semibold">
          {done ? `${goalNames}: made` : `make ${goalNames}`}
        </span>
        <span className="flex-1" />
        {done && nextLevel && (
          <button type="button" onClick={() => game.setLevel(nextLevel.id)} className="pixel-btn pixel-btn-primary alc-btn shrink-0">
            Next level
          </button>
        )}
        <button type="button" onClick={askHint} className="pixel-btn alc-btn shrink-0">
          Hint
        </button>
        <button type="button" onClick={() => setGuideOpen(true)} className="pixel-btn alc-btn shrink-0">
          Guide
        </button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* -------------------------------------------------------- bench */}
        <div
          ref={boardRef}
          className="alc-board relative h-[17rem] min-w-0 shrink-0 overflow-hidden sm:h-[22rem] md:h-[24rem] md:flex-1"
          role="region"
          aria-label="Workbench"
        >
          <p className="pointer-events-none absolute bottom-1.5 left-3 flex select-none items-baseline gap-1.5 text-leaf-800/70" aria-hidden>
            <span className="pixel text-5xl leading-none sm:text-6xl">
              {counted.length}/{toFind.length}
            </span>
            <span className="pixel text-xs">found</span>
          </p>
          <p className="sr-only" role="status">
            {counted.length} of {toFind.length} found in this level
          </p>
          {pieces.length === 0 && !toast && !celebrate && (
            <p className="pixel pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-sm leading-relaxed text-leaf-800">
              {touch
                ? 'Tap an element in the list to put it here. Tap two pieces to combine them.'
                : 'Drag elements here from the list, then drop one onto another.'}
            </p>
          )}
          {pieces.length > 0 && (
            <button
              type="button"
              onClick={clearBench}
              className="pixel-btn alc-btn absolute right-2 top-2 z-10"
              title="Take everything off the bench"
            >
              Clear
            </button>
          )}
          {pieces.map((p) => (
            <button
              key={p.id}
              type="button"
              className="alc-piece flex flex-col items-center"
              style={{ left: p.x, top: p.y }}
              data-dragging={dragging === p.id ? '' : undefined}
              data-over={over === p.id ? '' : undefined}
              data-pop={effects[p.id] === 'pop' ? '' : undefined}
              data-wobble={effects[p.id] === 'wobble' ? '' : undefined}
              aria-pressed={selected === p.id}
              aria-label={`${ELEMENT[p.el].name}${selected === p.id ? ', picked up' : ''}`}
              onPointerDown={(e) => onPiecePointerDown(e, p)}
              onPointerMove={onPiecePointerMove}
              onPointerUp={(e) => onPiecePointerUp(e, p)}
              onPointerCancel={() => {
                drag.current = null
                setDragging(null)
                setOver(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Delete' || e.key === 'Backspace') setPieces((all) => all.filter((q) => q.id !== p.id))
              }}
            >
              <ElementIcon id={p.el} scale={2} />
              <span className="pixel text-center text-xs leading-tight">{ELEMENT[p.el].name}</span>
            </button>
          ))}

          {/* The hedgehog's note: clicks pass through it to the bench, except
              on its own buttons. A strip along the bottom on a phone. */}
          {toast && !celebrate && (toast.kind !== 'welcome' || benchSeen) && (
            <div
              className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex items-end justify-end gap-4 md:bottom-3 md:left-48 md:right-3"
              data-arrive={toast.kind === 'welcome' ? '' : undefined}
            >
              <div
                className="alc-bubble panel-flat relative w-full px-3 py-2 text-sm leading-snug md:w-auto md:max-w-md [&_button]:pointer-events-auto"
                role="status"
              >
                <ToastBody toast={toast} touch={touch} onMore={askHint} />
                {/* The site's speech-bubble tail, pointing at the hedgehog's face. */}
                <BubbleTail className={'absolute left-full bottom-5 -ml-[3px] ' + hogShows} />
              </div>
              <span className={'alc-hog ' + hogShows}>
                <Hog />
              </span>
            </div>
          )}

          {celebrate && (
            <LevelFinished
              game={game}
              left={left}
              onNext={nextLevel ? () => game.setLevel(nextLevel.id) : undefined}
              onClose={() => setCelebrate(false)}
              reduced={reduced}
            />
          )}
        </div>

        {/* ------------------------------------------------------ sidebar */}
        <aside
          ref={sideRef}
          className="flex h-64 shrink-0 flex-col border-t-[3px] border-leaf-300 bg-leaf-50 sm:h-56 md:h-[24rem] md:w-56 md:border-l-[3px] md:border-t-0"
          aria-label="Elements"
        >
          <div className="border-b-2 border-leaf-300 px-2 py-1.5">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              aria-label="Search elements"
              className="alc-input"
            />
          </div>
          <ul ref={listRef} className="alc-list grid min-h-0 flex-1 grid-cols-2 content-start gap-1 overflow-y-auto p-1.5 md:grid-cols-1">
            {list.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className="alc-item"
                  data-fresh={fresh.includes(id) ? '' : undefined}
                  data-hint={hinted.includes(id) ? '' : undefined}
                  aria-label={`${ELEMENT[id].name}: put on the bench`}
                  onPointerDown={(e) => onItemPointerDown(e, id)}
                  onPointerMove={onItemPointerMove}
                  onPointerUp={(e) => onItemPointerUp(e, id)}
                  onPointerCancel={endDrag}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      add(id)
                    }
                  }}
                >
                  <ElementIcon id={id} />
                  <span className="min-w-0 truncate text-[13px] font-semibold leading-tight">{ELEMENT[id].name}</span>
                  {fresh.includes(id) && <span className="pixel ml-auto shrink-0 text-[11px] text-leaf-800">new</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t-2 border-leaf-300 px-2 py-1 text-xs text-leaf-800">
            {left > 0 ? `${left} more to find in this level` : 'Everything in this level found'}
          </p>
        </aside>
      </div>

      {guideOpen && <FieldGuide game={game} onClose={() => setGuideOpen(false)} />}
    </div>
  )
}

/** The card that comes up when the level's goal is made: what it is, and where to go next. */
function LevelFinished({
  game,
  left,
  onNext,
  onClose,
  reduced,
}: {
  game: Alchemy
  left: number
  onNext?: () => void
  onClose: () => void
  reduced: boolean
}) {
  const { level } = game
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-leaf-950/25 p-3">
      <div className={'panel relative w-full max-w-sm px-4 py-4 text-center' + (reduced ? '' : ' alc-cheer')} role="dialog" aria-label="Level finished">
        {!reduced && (
          <span aria-hidden className="alc-sparkles">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} />
            ))}
          </span>
        )}
        <p className="kicker">level {LEVELS.indexOf(level) + 1} finished</p>
        <div className="mt-2 flex justify-center gap-2">
          {level.goals.map((g) => (
            <ElementIcon key={g} id={g} scale={2} />
          ))}
        </div>
        <p className="mt-1 font-semibold">You made {level.goals.map((g) => ELEMENT[g].name).join(' and ')}!</p>
        {level.goals.map((g) => (
          <p key={g} className="mt-1 text-body-sm leading-snug text-leaf-800">
            {ELEMENT[g].description}
          </p>
        ))}
        <p className="mt-2 text-xs text-leaf-800">
          {left > 0 ? `${left} more to find in this level, if you want them.` : 'You found everything in this level.'}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {onNext && (
            <button type="button" onClick={onNext} className="pixel-btn pixel-btn-primary alc-btn">
              Next level
            </button>
          )}
          <button type="button" onClick={onClose} className="pixel-btn alc-btn">
            {onNext ? 'Keep playing' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ToastBody({ toast, touch, onMore }: { toast: Toast; touch: boolean; onMore: () => void }) {
  switch (toast.kind) {
    case 'welcome':
      return (
        <LineByLine>
          <p>
            <Words text={WELCOME} />
          </p>
          <p className="mt-1 text-body-sm text-leaf-800">
            <Words text={touch ? 'Tap an element in the list to start.' : 'Drag an element from the list onto the bench to start.'} />
          </p>
        </LineByLine>
      )
    case 'made': {
      const e = ELEMENT[toast.el]
      if (!toast.fresh)
        return (
          <p>
            <strong>{e.name}</strong> again.
          </p>
        )
      return (
        <>
          <p className="kicker">new discovery</p>
          <p className="font-semibold">{e.name}</p>
          <p className="line-clamp-2 text-body-sm text-leaf-800 md:line-clamp-none">{e.description}</p>
        </>
      )
    }
    case 'nothing':
      return (
        <p>
          <strong>{ELEMENT[toast.a].name}</strong> and <strong>{ELEMENT[toast.b].name}</strong> do not combine.
        </p>
      )
    case 'third':
      return (
        <p>
          <strong>{ELEMENT[toast.a].name}</strong> and <strong>{ELEMENT[toast.b].name}</strong> need one more thing.{' '}
          {touch ? 'Tap it, then tap one of them.' : 'Drop it on them.'}
        </p>
      )
    case 'hint':
      return (
        <p>
          <span className="kicker">hint</span>
          <br />
          {toast.full ? (
            <>
              Try{' '}
              {toast.inputs.map((i, k) => (
                <span key={k}>
                  {k > 0 && (k === toast.inputs.length - 1 ? ' and ' : ', ')}
                  <strong>{ELEMENT[i].name}</strong>
                </span>
              ))}
              . They are lit up in the list.
            </>
          ) : (
            <>
              Try <strong>{ELEMENT[toast.inputs[0]].name}</strong> with something.{' '}
              <button type="button" onClick={onMore} className="cross-link">
                Show the rest
              </button>
            </>
          )}
        </p>
      )
    case 'nohint':
      return <p>You have found everything in this level. Try the next one.</p>
  }
}

/**
 * Each word in its own span, so `LineByLine` can find where the lines break.
 * The spaces sit between the spans: a span holding a space could straddle a
 * line break and be measured on the wrong line.
 */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="alc-word">{w}</span>
        </Fragment>
      ))}
    </>
  )
}

/** When the first line starts, after the bubble has come up, and how long all the lines take, in ms. */
const LINES_START = 350
const LINES_TOTAL = 1600

/**
 * Text that comes in a line at a time, as if the hedgehog were saying it, so
 * the eye goes to it. Everything is laid out from the start (the bubble never
 * changes size); the words of each line just fade in together. The lines are
 * found by measuring where the words wrap, before the first paint.
 */
function LineByLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const box = ref.current
    if (!box) return
    const words = Array.from(box.querySelectorAll<HTMLElement>('.alc-word'))
    const tops: number[] = []
    const line = words.map((w) => {
      const top = Math.round(w.getBoundingClientRect().top)
      let i = tops.findIndex((t) => Math.abs(t - top) < 4)
      if (i < 0) i = tops.push(top) - 1
      return i
    })
    const step = tops.length > 1 ? Math.min(320, LINES_TOTAL / (tops.length - 1)) : 0
    words.forEach((w, k) => (w.style.animationDelay = `${LINES_START + line[k] * step}ms`))
    box.dataset.go = ''
  }, [])
  return <div ref={ref}>{children}</div>
}
