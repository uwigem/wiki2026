import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks'
import { SITE_PALETTE } from '../theme'

/**
 * The whole project, in one picture you can press.
 *
 * A cell with its primary cilium. Receptors sit in the ciliary membrane, and
 * how many are in there is the thing this project controls. The two buttons
 * are the two arms of the device: block the MMM complex and receptors build
 * up, recruit it onto a receptor and they get cleared out.
 *
 * Everything is authored as text sprites rather than assembled from bare
 * rectangles, which read as a wiring diagram. Every piece has a dark keyline
 * and a lighter top, the way the balance mark does, so it matches the drawn
 * artwork elsewhere on the site.
 *
 * It is drawn, not simulated. Receptors are eased toward a target count rather
 * than modelled with real kinetics: the Model page is where rates get claimed,
 * and dressing an illustration up as a simulation would be a quiet lie. The
 * count and the current state are written out as text under the canvas, so
 * nothing here depends on seeing it or on motion.
 */

const W = 158
const H = 150
/** The cell surface, in buffer pixels. Everything above it is outside the cell. */
const SURFACE = 116
/**
 * Inner walls of the cilium; the membrane is drawn just outside these. The
 * tube sits left of centre so the complex has room beside it at the base.
 * Centring it would leave a wide empty margin on both sides and make the
 * drawing look like it had been cropped from something bigger.
 */
const TUBE_L = 40
const TUBE_R = 76
const TUBE_TOP = 10

export type Mode = 'resting' | 'block' | 'recruit'

const TARGET: Record<Mode, number> = { resting: 7, block: 13, recruit: 2 }

const MODE_TEXT: Record<Mode, { title: string; body: string }> = {
  resting: {
    title: 'Left alone',
    body: 'The MMM complex clears receptors out of the cilium at a steady rate while new ones arrive. The number settles somewhere in the middle.',
  },
  block: {
    title: 'Blocked',
    body: 'A designed minibinder wedges MEGF8 and MOSMO apart, so the complex cannot assemble. Nothing is clearing receptors now, and they build up.',
  },
  recruit: {
    title: 'Recruited',
    body: 'A linker drags the complex onto a receptor it would normally ignore. That receptor gets tagged with ubiquitin and pulled out, so the number falls.',
  },
}

/* ------------------------------------------------------------------ *
 * Sprites
 *
 * One character per pixel. A dot is transparent; every other letter is a
 * named colour, resolved once against the site palette below. Written out
 * as pictures so that changing how a receptor looks means redrawing it here
 * rather than working out which rectangle was which.
 * ------------------------------------------------------------------ */

/** A receptor in the membrane: a bundle of helices with a loop poking out. */
const RECEPTOR = [
  '.pp..pp.',
  '.pLppLp.',
  'ppLLLLpp',
  'pLLhhLLp',
  'pLhhhhLp',
  'pLhhhhLp',
  'pLhhhhLp',
  'pLhhhhLp',
  'pLhhhhLp',
  'ppLhhLpp',
  '.pppppp.',
]

/**
 * The MMM complex, assembled. Three subunits of different heights sharing one
 * base, so it reads as a machine made of parts rather than as a blob: MEGF8
 * and MOSMO are the adapters, MGRN1 is the enzyme that does the tagging.
 */
const MMM_WHOLE = [
  '..rr.....rr....rr...',
  '.rRRr...rRRr..rRRr..',
  '.rRRr...rRRr..rRRr..',
  '.rRRr...rRRr..rRRr..',
  '.rRRrrrrRRRrrrrRRr..',
  '.rRRmmRRmmRRmmmRRr..',
  '.rRRmmRRmmRRmmmRRr..',
  '.rRRRRRRRRRRRRRRRr..',
  '..rrrrrrrrrrrrrrr...',
]

/** The same complex, prised apart. The gap is where the binder sits. */
const MMM_SPLIT = [
  '..rr.......rr....rr.',
  '.rRRr.....rRRr..rRRr',
  '.rRRr.....rRRr..rRRr',
  '.rRRr.....rRRr..rRRr',
  '.rRRr.....rRRrrrrRRr',
  '.rRRmr....rmRRmmmRRr',
  '.rRRmr....rmRRmmmRRr',
  '.rRRRr....rRRRRRRRRr',
  '..rrr......rrrrrrrr.',
]

/** The minibinder, wedged into the gap it just opened. */
const BINDER = ['.bb.', 'bBBb', 'bBBb', 'bBBb', 'bBBb', '.bb.']

/** A ubiquitin tag, beaded onto a receptor on its way out. */
const TAG = ['.gg.', 'gGGg', 'gGGg', '.gg.']

type Grid = readonly string[]

interface Receptor {
  /** -1 on the left wall of the cilium, +1 on the right. */
  side: -1 | 1
  y: number
  goal: number
  /** Climbs from 0 while the receptor is being tagged for removal. */
  tags: number
  leaving: boolean
  /** Per-receptor offset so they do not all bob in step. */
  phase: number
}

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function CiliumScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('resting')
  const [count, setCount] = useState(TARGET.resting)
  const reduced = useReducedMotion()
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const got = canvas.getContext('2d')
    if (!got) return
    const ctx = got

    canvas.width = W
    canvas.height = H
    const img = ctx.createImageData(W, H)

    const P = SITE_PALETTE
    /** Sprite letters to colours. */
    const INK: Record<string, [number, number, number]> = {
      p: toRgb(P.eye), //        receptor keyline
      L: toRgb(P.lilacHi), //    receptor highlight
      h: toRgb(P.lilacPetal), // receptor body
      r: toRgb(P.spikeLow), //   complex keyline
      R: toRgb(P.pinkBud), //    complex body
      m: toRgb(P.pinkDark), //   complex shading
      b: toRgb(P.shadow), //     binder keyline
      B: toRgb(P.sparkle), //    binder body
      g: toRgb(P.bark), //       tag keyline
      G: toRgb(P.daisyCore), //  tag body
    }
    const SKY = toRgb(P.bushHi)
    const CELL = toRgb(P.bushLight)
    const CELL_DEEP = toRgb(P.grass4)
    const MEMBRANE = toRgb(P.bushDark)
    const MEMBRANE_HI = toRgb(P.grass3)
    const LUMEN = toRgb(P.petalWhite)
    const LINKER = toRgb(P.berry)
    const AXONEME = toRgb(P.bushLight)

    const set = (x: number, y: number, c: [number, number, number]) => {
      if (x < 0 || y < 0 || x >= W || y >= H) return
      const o = (y * W + x) * 4
      img.data[o] = c[0]
      img.data[o + 1] = c[1]
      img.data[o + 2] = c[2]
      img.data[o + 3] = 255
    }
    const box = (x: number, y: number, w: number, h: number, c: [number, number, number]) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c)
    }
    /** Stamps a text sprite with its top-left at (x, y). */
    const stamp = (grid: Grid, x: number, y: number) => {
      grid.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const c = INK[row[i]]
          if (c) set(x + i, y + j, c)
        }
      })
    }
    const gridW = (g: Grid) => Math.max(...g.map((r) => r.length))

    const recs: Receptor[] = []
    // Sides alternate rather than being picked at random: eight coin flips
    // regularly put six receptors on one wall, which reads as a bug.
    let nextSide: -1 | 1 = -1
    const lowY = SURFACE - 18
    const highY = TUBE_TOP + 14
    const spawn = (atBase: boolean): Receptor => ({
      side: (nextSide = nextSide === -1 ? 1 : -1),
      y: atBase ? lowY + 6 : highY + Math.random() * (lowY - highY),
      goal: highY + Math.random() * (lowY - highY),
      tags: 0,
      leaving: false,
      phase: Math.random() * 6.3,
    })
    for (let i = 0; i < TARGET.resting; i++) recs.push(spawn(false))

    let sinceChange = 0

    function step(dt: number, t: number) {
      const want = TARGET[modeRef.current]
      const staying = recs.filter((r) => !r.leaving)
      sinceChange += dt

      // Arrivals and departures happen on a slow tick, so the change is
      // readable instead of the population snapping to its new size.
      if (sinceChange > 0.6) {
        sinceChange = 0
        if (staying.length < want) recs.push(spawn(true))
        else if (staying.length > want) {
          // The one nearest the base is the one the complex reaches first.
          let lowest: Receptor | null = null
          for (const r of staying) if (!lowest || r.y > lowest.y) lowest = r
          if (lowest) lowest.leaving = true
        }
      }

      for (let i = recs.length - 1; i >= 0; i--) {
        const r = recs[i]
        if (r.leaving) {
          if (r.tags < 3) r.tags += dt * 3.2
          else r.y += dt * 30
          if (r.y > SURFACE + 16) recs.splice(i, 1)
        } else {
          const d = r.goal - r.y
          if (Math.abs(d) < 1.5) r.goal = highY + Math.random() * (lowY - highY)
          r.y += Math.sign(d) * Math.min(Math.abs(d), dt * 6)
          r.y += Math.sin(t * 1.3 + r.phase) * dt * 1.5
        }
      }
      return staying.length
    }

    function draw(t: number) {
      const m = modeRef.current
      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = SKY[0]
        img.data[i + 1] = SKY[1]
        img.data[i + 2] = SKY[2]
        img.data[i + 3] = 255
      }

      // The cell: a body with a lighter band just under its surface, so it
      // reads as a solid thing rather than a flat strip of colour.
      box(0, SURFACE, W, H - SURFACE, CELL_DEEP)
      box(0, SURFACE + 6, W, 10, CELL)
      box(0, SURFACE, W, 3, MEMBRANE)
      box(0, SURFACE + 3, W, 2, MEMBRANE_HI)

      // The cilium: lumen, then a membrane wall either side with a highlight
      // down the inside edge, then a domed cap.
      box(TUBE_L, TUBE_TOP + 3, TUBE_R - TUBE_L, SURFACE - TUBE_TOP - 3, LUMEN)
      box(TUBE_L - 3, TUBE_TOP + 3, 3, SURFACE - TUBE_TOP - 3, MEMBRANE)
      box(TUBE_R, TUBE_TOP + 3, 3, SURFACE - TUBE_TOP - 3, MEMBRANE)
      box(TUBE_L, TUBE_TOP + 3, 1, SURFACE - TUBE_TOP - 3, MEMBRANE_HI)
      box(TUBE_R - 1, TUBE_TOP + 3, 1, SURFACE - TUBE_TOP - 3, MEMBRANE_HI)
      // Cap: rows that narrow as they rise, which is how a dome is drawn on a
      // pixel grid. A single flat lid makes the cilium look like a pipe.
      box(TUBE_L - 3, TUBE_TOP + 4, TUBE_R - TUBE_L + 6, 3, MEMBRANE)
      box(TUBE_L - 1, TUBE_TOP + 2, TUBE_R - TUBE_L + 2, 3, MEMBRANE)
      box(TUBE_L + 3, TUBE_TOP, TUBE_R - TUBE_L - 6, 3, MEMBRANE)
      box(TUBE_L + 5, TUBE_TOP + 1, TUBE_R - TUBE_L - 10, 1, MEMBRANE_HI)
      // The lumen stops just under the dome.
      box(TUBE_L, TUBE_TOP + 7, TUBE_R - TUBE_L, 2, LUMEN)

      // The axoneme, the bundle of microtubules that runs the length of a
      // cilium. Drawn faintly, because it is structure rather than the point,
      // but without it the lumen is a white rectangle and the whole drawing
      // looks unfinished.
      const mid = (TUBE_L + TUBE_R) / 2
      for (const dx of [-4, 3]) {
        box(Math.round(mid + dx), TUBE_TOP + 7, 2, SURFACE - TUBE_TOP - 9, AXONEME)
      }

      // The complex, sitting in the cell surface beside the cilium.
      const whole = m !== 'block'
      const sprite = whole ? MMM_WHOLE : MMM_SPLIT
      const mx = TUBE_R + 14
      const my = SURFACE - 9
      stamp(sprite, mx, my)
      if (!whole) {
        // The binder, breathing slightly so the eye goes to it.
        const lift = Math.round((Math.sin(t * 2.4) + 1) * 1.2)
        stamp(BINDER, mx + 6, my - 1 - lift)
      }

      // The linker, hauling the complex toward the cilium.
      if (m === 'recruit') {
        for (let x = TUBE_R + 3; x < mx + 3; x++) {
          const y = SURFACE - 1 + Math.round(Math.sin(x * 0.45 + t * 5) * 1.8)
          set(x, y, LINKER)
          set(x, y + 1, LINKER)
        }
      }

      // Receptors, embedded in the ciliary membrane on either wall.
      const rw = gridW(RECEPTOR)
      for (const r of recs) {
        const x = r.side < 0 ? TUBE_L - 3 - Math.floor(rw / 2) + 1 : TUBE_R + 3 - Math.ceil(rw / 2)
        const y = Math.round(r.y)
        stamp(RECEPTOR, x, y)
        for (let k = 0; k < Math.floor(r.tags); k++) {
          stamp(TAG, x + (r.side < 0 ? -5 : rw + 1), y + 1 + k * 5)
        }
      }

      ctx.putImageData(img, 0, 0)
    }

    // Reduced motion still gets the right picture for the chosen mode, just
    // without the drift: jump the population to its target, draw one frame.
    if (reduced) {
      const want = TARGET[modeRef.current]
      while (recs.filter((r) => !r.leaving).length < want) recs.push(spawn(false))
      while (recs.filter((r) => !r.leaving).length > want) recs.pop()
      draw(0)
      setCount(want)
      return
    }

    let raf = 0
    let last = performance.now()
    let running = false
    let acc = 0
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const live = step(dt, now / 1000)
      draw(now / 1000)
      // The readout is React state, so it is throttled well below frame rate.
      acc += dt
      if (acc > 0.2) {
        acc = 0
        setCount(live)
      }
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Run only while the canvas is on screen AND the tab is in front.
    //
    // Being on screen and the tab being visible both feed one `sync`, the only
    // thing allowed to start or stop the loop. With a separate handler for
    // each, switching tabs and back would leave the animation stopped: the
    // observer has nothing new to report, so nothing would restart it.
    let onScreen = false
    const sync = () => (onScreen && !document.hidden ? start() : stop())

    draw(0)
    if (!('IntersectionObserver' in window)) {
      onScreen = true
      sync()
      document.addEventListener('visibilitychange', sync)
      return () => {
        stop()
        document.removeEventListener('visibilitychange', sync)
      }
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) onScreen = e.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reduced])

  const text = MODE_TEXT[mode]

  return (
    <div className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pixelated mx-auto w-full max-w-[400px] shrink-0 rounded-sm border-[3px] border-leaf-700 lg:mx-0 lg:w-[370px] lg:max-w-none"
          style={{ aspectRatio: `${W} / ${H}` }}
        />

        <div className="min-w-0 flex-1">
          <p className="kicker">the one idea</p>
          <h2 className="mt-1 text-xl sm:text-2xl">How many receptors are in the antenna</h2>
          <p className="mt-2 text-body-sm leading-relaxed">
            Almost every cell grows a single <strong>primary cilium</strong>. Some receptors only work
            while they are sitting in it, so the number in there is what sets the signal. We built a way
            to move that number in either direction. Try it.
          </p>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="What to do to the complex">
            {(['block', 'resting', 'recruit'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={'pixel-btn ' + (mode === m ? 'pixel-btn-primary' : '')}
              >
                {m === 'block' ? 'Block it' : m === 'recruit' ? 'Recruit it' : 'Leave alone'}
              </button>
            ))}
          </div>

          <div className="panel-flat mt-4 px-4 py-3" aria-live="polite">
            <p className="text-body-sm">
              <span className="pixel">{text.title}.</span>{' '}
              <span className="numeral">{count}</span> receptors in the cilium.
            </p>
            <p className="mt-1 text-body-sm leading-relaxed">{text.body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
