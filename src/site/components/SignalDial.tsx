import { useCallback, useEffect, useRef, useState } from 'react'
import { BALANCE_LOGO, HEDGEHOG_SIDE, HEDGEHOG_SIDE_SIZE, decodeLayer } from '../content/balanceLogo'
import { useReducedMotion } from '../hooks'
import { SITE_PALETTE } from '../theme'

/**
 * The team's own four panel storyboard, animated.
 *
 * One entrance on the left, one gauge in the middle, one exit on the right,
 * and the hedgehog reading the gauge. SMO enters the cilium at a rate we never
 * touch. It leaves through the exit, and the only thing the reader changes is
 * how fast that removal happens. Block the remover and SMO piles up and the
 * signal rises; recruit more remover and SMO thins out and the signal drops.
 *
 * **This is a drawing of a storyboard, not an invention.** Three earlier
 * attempts replaced the team's own picture with a cleverer one: a needle with
 * nothing feeding it, then a tank with a pipe and a drain, then a clearing
 * full of visitors. Each was less legible than the sketch it replaced. The
 * layout, the gauge, the hexagons, the blocking cross, the recruiting squiggle
 * and the captions all come from the storyboard; the work here is to move them
 * and to make them hold still at the right size.
 *
 * Rules carried over from those attempts, which were about the frame rather
 * than the picture and were worth keeping:
 *   - Every region is a fixed height, so nothing reflows between panels.
 *   - The canvas is 385 wide at exactly 2x, which is the real content width
 *     inside the panel, so no outline gains or loses a pixel.
 *   - The whole component fits in 620 CSS px, because a 1280 by 720 laptop has
 *     only 661 px under the sticky header and one earlier version needed 1073.
 *   - Words are HTML over the canvas. Text rendered into the buffer blurs.
 *   - The comic rides the same clock as the drawing, so it cannot play itself
 *     out while nobody is watching.
 */

const W = 385
const H = 130

/**
 * The cilium itself, drawn as a chamber with one doorway in and one out.
 *
 * Three attempts left this out and put the molecules in empty space, which is
 * why "SMO enters cilium" meant nothing: there was no cilium to enter.
 */
const CH_L = 52
const CH_R = 232
const CH_T = 22
const CH_B = 104
const WALL = 4
const IN_L = CH_L + WALL
const IN_R = CH_R - WALL
/** The two doorways, at the same height, so the route through is one line. */
const DOOR_T = 52
const DOOR_B = 76
const LANE_Y = 57

/** Fifteen resting places, filled COLUMN BY COLUMN from the doorway end, so
    how much SMO is in there reads as a length and not as a count. */
const COL_X = [63, 96, 129, 162, 195]
const ROW_Y = [28, 50, 72]
const SLOTS = COL_X.length * ROW_Y.length

/** The level strip along the chamber floor. The storyboard's gauge, unrolled. */
const STRIP_T = 92
const STRIP_H = 7

const HOG_SCALE = 3
const HOG_X = 302
const HOG_FEET = 104

/** One SMO. A fat hexagon, because that is what the storyboard draws. */
const SMO = [
  '....oooooo....',
  '..oohhhhhhoo..',
  '.ohhhhhhhhbbo.',
  'ohhhhhhbbbbbbo',
  'ohhhhbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  'obbbbbbbbbbbbo',
  '.obbbbbbbbbbo.',
  '..oobbbbbboo..',
  '....oooooo....',
]

/** The remover we recruit onto SMO. The storyboard's pink squiggle. */
const REMOVER = [
  '.rrrr.',
  'rr..rr',
  'rr....',
  '.rrrr.',
  '....rr',
  'rr..rr',
  '.rrrr.',
]

type Grid = readonly string[]

function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface Beat {
  title: string
  caption: string
  seconds: number
  /** 0 removal fully recruited, 0.5 a normal cell, 1 removal fully blocked. */
  setting: number
  /** Panel one states the rule alone: a gauge and a hedgehog, no traffic. */
  quiet?: boolean
}

const BEATS: Beat[] = [
  {
    title: 'SMO in the cilium controls the Hedgehog signal',
    caption: 'More SMO in the cilium means a stronger Hedgehog signal.',
    seconds: 5.5,
    setting: 0.5,
    quiet: true,
  },
  {
    title: 'In a normal cell, SMO levels stay steady',
    caption: 'SMO enters and SMO leaves at similar rates, so the level stays roughly steady.',
    seconds: 6.5,
    setting: 0.5,
  },
  {
    title: 'Block the remover, signal increases',
    caption: 'If SMO cannot be removed, it builds up in the cilium, turning the Hedgehog signal up.',
    seconds: 7,
    setting: 1,
  },
  {
    title: 'Recruit the remover, signal decreases',
    caption:
      'If we recruit more removal, less SMO stays in the cilium, turning the Hedgehog signal down.',
    seconds: 7,
    setting: 0,
  },
]

const PRESETS = [
  { label: 'Recruit the remover', value: 0 },
  { label: 'A normal cell', value: 0.5 },
  { label: 'Block the remover', value: 1 },
]

interface DialProps {
  /**
   * Drop the bordered, shadowed panel. For the minimal homepage, where the
   * explainer sits straight on the page like everything else around it.
   */
  bare?: boolean
}

export default function SignalDial({ bare = false }: DialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  /** -1 before the comic starts, 0..3 during it, BEATS.length once done. */
  const [beatIdx, setBeatIdx] = useState(-1)
  const [setting, setSetting] = useState(0.5)

  const playing = beatIdx < BEATS.length
  const beat = playing ? BEATS[Math.max(0, beatIdx)] : null
  const live = beat ? beat.setting : setting
  const showTraffic = !beat?.quiet

  const stateRef = useRef({ setting: live, beatIdx, showTraffic })
  stateRef.current = { setting: live, beatIdx, showTraffic }

  const advanceRef = useRef(() => {})
  advanceRef.current = () => {
    // Hand over holding the last panel's setting, so the picture does not jump
    // at the moment the reader takes the controls.
    if (beatIdx >= BEATS.length - 1) setSetting(BEATS[BEATS.length - 1].setting)
    setBeatIdx((i) => i + 1)
  }

  const startedRef = useRef(false)
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const startOnce = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true
    if (reducedRef.current) {
      setBeatIdx(BEATS.length)
      setSetting(1)
      return
    }
    setBeatIdx(0)
  }, [])

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
    const BG = toRgb(P.grass2)
    const DARK = toRgb(P.shadow)
    const RIM = toRgb(P.petalWhite)
    const MEMBRANE = toRgb(P.bushDark)
    const INSIDE = toRgb(P.bushHi)
    const ARC_LOW = toRgb(P.bushLight)
    const ARC_HIGH = toRgb(P.bushDark)
    const SIGNAL = toRgb(P.daisyCore)
    const PINK = toRgb(P.pinkDark)

    const INK: Record<string, [number, number, number]> = {
      o: toRgb(P.eye),
      b: toRgb(P.lilacPetal),
      h: toRgb(P.lilacHi),
      r: PINK,
    }

    const hog = decodeLayer(HEDGEHOG_SIDE)
    const hogPal = BALANCE_LOGO.palette.map((c) => toRgb('#' + c))

    const set = (x: number, y: number, c: [number, number, number]) => {
      x |= 0
      y |= 0
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
    const stamp = (g: Grid, fx: number, fy: number) => {
      const x = Math.round(fx)
      const y = Math.round(fy)
      g.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const c = INK[row[i]]
          if (c) set(x + i, y + j, c)
        }
      })
    }
    /** The storyboard's connector: a shaft with a solid triangular head. */
    const arrow = (x: number, y: number, w: number) => {
      box(x, y - 2, w - 7, 4, DARK)
      for (let i = 0; i < 8; i++) box(x + w - 8 + i, y - 8 + i, 1, 16 - 2 * i, DARK)
    }

    let shown = 0.5
    let filled = 7
    let flow = 0

    /** The chamber. Walls, two doorways, and a rounded cap at each end. */
    function drawCilium() {
      box(CH_L, CH_T, CH_R - CH_L, CH_B - CH_T, MEMBRANE)
      box(IN_L, CH_T + WALL, IN_R - IN_L, CH_B - CH_T - WALL * 2, INSIDE)
      for (let j = 0; j < 7; j++) {
        const back = 7 - Math.round(Math.sqrt(49 - (7 - j) * (7 - j)))
        box(CH_L, CH_T + j, back, 2, BG)
        box(CH_L, CH_B - j - 2, back, 2, BG)
        box(CH_R - back, CH_T + j, back, 2, BG)
        box(CH_R - back, CH_B - j - 2, back, 2, BG)
      }
      // The doorways: the wall simply stops, and the lane colour runs through.
      box(CH_L, DOOR_T, WALL, DOOR_B - DOOR_T, BG)
      box(CH_R - WALL, DOOR_T, WALL, DOOR_B - DOOR_T, BG)
      // Jambs, so each opening reads as a door rather than as a broken wall.
      box(CH_L - 1, DOOR_T - 3, WALL + 2, 3, DARK)
      box(CH_L - 1, DOOR_B, WALL + 2, 3, DARK)
      box(CH_R - WALL - 1, DOOR_T - 3, WALL + 2, 3, DARK)
      box(CH_R - WALL - 1, DOOR_B, WALL + 2, 3, DARK)
    }

    /** The level, as a length: a graduated strip along the chamber floor. */
    function drawStrip() {
      const x0 = IN_L + 2
      const x1 = IN_R - 2
      for (let x = x0; x < x1; x++) {
        const f = (x - x0) / (x1 - x0)
        box(x, STRIP_T, 1, STRIP_H, [
          ARC_LOW[0] + (ARC_HIGH[0] - ARC_LOW[0]) * f,
          ARC_LOW[1] + (ARC_HIGH[1] - ARC_LOW[1]) * f,
          ARC_LOW[2] + (ARC_HIGH[2] - ARC_LOW[2]) * f,
        ])
      }
      const mx = Math.round(x0 + (filled / SLOTS) * (x1 - x0))
      box(mx - 2, STRIP_T - 3, 5, STRIP_H + 6, DARK)
      box(mx - 1, STRIP_T - 2, 3, STRIP_H + 4, RIM)
    }

    function drawHog(t: number, loud: number) {
      const rate = 2 + loud * 6
      const bounce = Math.max(0, Math.sin(t * rate)) * (1 + loud * 7)
      const hy = Math.round(HOG_FEET - HEDGEHOG_SIDE_SIZE.h * HOG_SCALE - bounce)
      for (let i = 0; i < hog.length; i += 3) {
        const c = hogPal[hog[i + 2] - 1]
        // Mirrored: the sprite's cream face is on its left as stored.
        const mx = HEDGEHOG_SIDE_SIZE.w - 1 - hog[i]
        box(HOG_X + mx * HOG_SCALE, hy + hog[i + 1] * HOG_SCALE, HOG_SCALE, HOG_SCALE, c)
      }
      // Sound dashes, fanning UP AND RIGHT from a point clear of the sprite.
      // An earlier version put the origin inside the body, so the dashes were
      // painted across the hedgehog's own face at every volume.
      const ox = HOG_X + HEDGEHOG_SIDE_SIZE.w * HOG_SCALE + 3
      const oy = hy + 6
      const n = 2 + Math.round(loud * 3)
      for (let k = 0; k < n; k++) {
        // Steep, so the fan grows UPWARD into empty sky rather than sideways
        // off the right edge of the frame, which is where it used to clip.
        const a = (-80 + k * (60 / Math.max(1, n - 1))) * (Math.PI / 180)
        const len = 7 + loud * 13 + Math.sin(t * 5 + k) * 1.5
        for (let r = 4; r < 4 + len; r++) {
          box(ox + Math.cos(a) * r, oy + Math.sin(a) * r, 3, 3, SIGNAL)
        }
      }
    }

    function draw(t: number, dt: number) {
      const st = stateRef.current
      // Exponential against real elapsed time, so this behaves the same at
      // 3fps as at 60fps. A fixed fraction per frame never reached the ends.
      const k = 1 - Math.exp(-dt * 7)
      shown += (st.setting - shown) * k
      filled += (1 + (SLOTS - 2) * shown - filled) * k
      const removal = Math.max(0, 2 - 2 * shown)
      flow += dt

      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = BG[0]
        img.data[i + 1] = BG[1]
        img.data[i + 2] = BG[2]
        img.data[i + 3] = 255
      }

      drawCilium()

      if (st.showTraffic) {
        // SMO arrives at a pace the slider never touches. The arrow sits on
        // the lane the molecules travel, pointing at the doorway.
        // Molecules, THEN the arrow, THEN the doorway. An earlier version ran
        // three of them along the arrow itself and they piled into an
        // unreadable clump with an arrowhead poking out of the middle.
        for (let i = 0; i < 2; i++) {
          const ph = (flow * 0.3 + i / 2) % 1
          stamp(SMO, -18 + ph * 34, LANE_Y)
        }
        arrow(34, LANE_Y + 5, 20)
      }

      // What is in the chamber, filling column by column from the door.
      const n = Math.max(0, Math.min(SLOTS, Math.round(filled)))
      for (let i = 0; i < n; i++) {
        stamp(SMO, COL_X[Math.floor(i / ROW_Y.length)] - 7, ROW_Y[i % ROW_Y.length])
      }
      drawStrip()

      if (st.showTraffic) {
        if (removal < 0.25) {
          // Blocked. The cross sits ON the doorway, not out in the open.
          const cx = CH_R - 2
          const cy = (DOOR_T + DOOR_B) / 2
          for (let i = -11; i <= 11; i++) {
            box(cx + i - 2, cy + i - 2, 6, 6, PINK)
            box(cx + i - 2, cy - i - 2, 6, 6, PINK)
          }
        } else {
          // Door, THEN arrow, THEN molecules, and the lane stops short of the
          // hedgehog. Previously the molecules ran over both the arrow and
          // the hedgehog's flank.
          arrow(236, LANE_Y + 5, 20)
          // One at a time. Two in a 26px lane touched and read as a single
          // lumpy blob; the RATE is already carried by how fast it travels.
          const count = 1
          for (let i = 0; i < count; i++) {
            const ph = (flow * 0.22 * removal + i / count) % 1
            const x = 258 + ph * 28
            stamp(SMO, x, LANE_Y)
            // Recruited removal rides out latched onto the SMO it is clearing.
            if (removal > 1.2) stamp(REMOVER, x + 14, LANE_Y + 2)
          }
        }
      }

      drawHog(t, shown)
      ctx.putImageData(img, 0, 0)
    }

    let raf = 0
    let last = performance.now()
    let clock = 0
    let running = false
    let onScreen = false
    let beatClock = 0
    let lastBeat = -2

    const frame = (now: number) => {
      const raw = (now - last) / 1000
      last = now
      // Two clamps, guarding different things. The drawing gets a tight one so
      // a stalled tab cannot teleport everything across the frame in one step.
      // The comic gets a loose one, because sharing the tight clamp made the
      // NARRATION run in slow motion wherever frames are throttled.
      const dt = Math.min(0.05, raw)
      const beatDt = Math.min(0.25, raw)
      clock += dt

      const idx = stateRef.current.beatIdx
      if (idx !== lastBeat) {
        lastBeat = idx
        beatClock = 0
      } else if (idx >= 0 && idx < BEATS.length) {
        beatClock += beatDt
        // Zero the clock BEFORE asking for the next panel. The state update is
        // asynchronous, so otherwise every frame until the re-render sees an
        // expired clock and the comic skips two or three panels at once.
        if (beatClock >= BEATS[idx].seconds) {
          beatClock = 0
          advanceRef.current()
        }
      }

      draw(clock, dt)
      raf = requestAnimationFrame(frame)
    }

    const startLoop = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => (onScreen && !document.hidden ? startLoop() : stopLoop())

    draw(0, 0.016)
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            for (const e of entries) {
              onScreen = e.isIntersecting
              // Only ever start from the untouched state. Scrolling in can
              // fire AFTER a reader has already pressed Skip, and this used
              // to drag them back to panel one.
              if (e.isIntersecting && stateRef.current.beatIdx < 0) startOnce()
            }
            sync()
          })
        : null
    if (io) io.observe(canvas)
    else {
      onScreen = true
      startOnce()
      sync()
    }
    document.addEventListener('visibilitychange', sync)
    return () => {
      stopLoop()
      if (io) io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [startOnce])

  const band = live > 0.62 ? 'HIGH' : live < 0.38 ? 'LOW' : 'STEADY'
  const signal = live > 0.62 ? 'LOUD' : live < 0.38 ? 'QUIET' : 'MIDDLING'
  const removalWord = live > 0.62 ? 'blocked' : live < 0.38 ? 'recruited' : 'normal'
  // Kept short and on ONE line each. The long forms wrapped to two lines,
  // which ran this label into "Hedgehog signal" beside it and pushed both
  // down over the top wall of the chamber.
  const exitLabel =
    live > 0.62 ? 'removal blocked' : live < 0.38 ? 'removal recruited' : 'SMO leaves'
  const atPreset = (v: number) => Math.abs(live - v) < 0.06

  return (
    <div className={bare ? 'min-w-0' : 'panel min-w-0 px-5 py-5 sm:px-7'}>
      {/* ---------------------------------------------------- the comic panel */}
      <div className="h-[9.75rem] overflow-hidden sm:h-[7rem]">
        <div className="flex items-center gap-2">
          <span className="badge">
            {playing ? `${Math.max(0, beatIdx) + 1} of ${BEATS.length}` : 'your turn'}
          </span>
          <p className="kicker">the one idea</p>
        </div>
        <h2 className="mt-1.5 text-xl leading-tight sm:text-2xl">
          {beat ? beat.title : 'Now work the remover yourself'}
        </h2>
        <p className="mt-1.5 text-body-sm leading-snug">
          {beat
            ? beat.caption
            : 'SMO keeps entering at the same rate. You only change how fast it gets removed.'}
        </p>
      </div>

      {/* --------------------------------------------------------- the picture */}
      {/* No border on the canvas: a 3px border-box border would shrink the
          drawable area to 764 and break the exact 2x scale. */}
      <div className="relative mx-auto mt-4 w-full" style={{ maxWidth: `${W * 2}px` }}>
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pixelated block w-full rounded-sm"
          style={{ aspectRatio: `${W} / ${H}` }}
        />
        {showTraffic && (
          <>
            <span
              className="pixel absolute whitespace-nowrap text-xs leading-tight text-leaf-950 sm:text-sm"
              style={{ left: '0.5%', top: '1.5%' }}
            >
              SMO enters
            </span>
            <span
              className="pixel absolute whitespace-nowrap text-xs leading-tight text-leaf-950 sm:text-sm"
              style={{ left: '59%', top: '1.5%' }}
            >
              {exitLabel}
            </span>
          </>
        )}
        {/* Bottom right, on the same row as the strip's labels. Along the
            top it collided with the exit label at every width between the
            small breakpoint and the full 770, because both are fixed strings
            on a canvas that keeps changing width. Down here nothing competes
            with it, so it can stay at every size. */}
        <span
          className="pixel absolute whitespace-nowrap text-right text-xs leading-tight text-leaf-950 sm:text-sm"
          style={{ right: '1%', top: '83%' }}
        >
          Hedgehog signal
        </span>
        {/* One row under the chamber: the two ends of the level strip, and
            the strip's name on a plate, laid out as the storyboard has it. */}
        <span className="pixel absolute text-xs text-leaf-950 sm:text-sm" style={{ left: '14%', top: '83%' }}>
          LOW
        </span>
        <span
          className="pixel absolute rounded-sm border-2 border-leaf-700 bg-leaf-50 px-1.5 text-xs text-leaf-950 sm:text-sm"
          style={{ left: '29%', top: '80%' }}
        >
          SMO in cilium
        </span>
        <span className="pixel absolute text-xs text-leaf-950 sm:text-sm" style={{ left: '58%', top: '83%' }}>
          HIGH
        </span>
      </div>

      {/* --------------------------------------------------------- the control */}
      <div className="mt-4">
        <label className="block">
          <span className="pixel text-base sm:text-lg">How fast is SMO removed from the cilium?</span>
          <span className="mt-2 flex h-5 items-center">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(live * 100)}
              disabled={playing}
              onChange={(e) => setSetting(Number(e.target.value) / 100)}
              className="pond-range w-full disabled:opacity-50"
              aria-label="How fast SMO is removed from the cilium"
            />
          </span>
        </label>
        <div className="mt-1 flex justify-between text-note">
          <span>removal recruited, level drops</span>
          <span>removal blocked, level climbs</span>
        </div>

        {/* A grid, not flex-wrap, so this row can never become two rows. */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((pre) => (
            <button
              key={pre.label}
              type="button"
              disabled={playing}
              aria-pressed={atPreset(pre.value)}
              onClick={() => setSetting(pre.value)}
              className={
                'pixel-btn py-1 text-xs disabled:opacity-50 sm:text-sm ' +
                (atPreset(pre.value) ? 'pixel-btn-primary' : '')
              }
            >
              {pre.label}
            </button>
          ))}
          <button
            type="button"
            className="pixel-btn py-1 text-xs sm:text-sm"
            onClick={playing ? () => setBeatIdx(BEATS.length) : () => setBeatIdx(0)}
          >
            {playing ? 'Skip to controls' : 'Replay'}
          </button>
        </div>

        {/* Fixed height. The three readouts wrap to a different number of
            lines ("STEADY ... MIDDLING" is the long one), which moved the
            bottom of the panel by 20px as the reader worked the slider. */}
        <p
          className="mt-2 min-h-[3.25rem] text-body-sm leading-snug sm:min-h-[2rem]"
          aria-live="polite"
        >
          {playing ? (
            `The comic is working the slider for you. Panel ${Math.max(0, beatIdx) + 1} of ${BEATS.length}.`
          ) : (
            <>
              Removal <strong>{removalWord}</strong>: SMO in the cilium is <strong>{band}</strong>, Hedgehog
              signal <strong>{signal}</strong>.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
