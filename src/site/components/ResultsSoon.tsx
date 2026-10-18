import { useEffect, useRef } from 'react'
import {
  BALANCE_LOGO,
  HEDGEHOG_SIDE,
  HEDGEHOG_SIDE_SIZE,
  decodeLayer,
} from '../content/balanceLogo'
import { SITE_PALETTE } from '../theme'
import { inline } from './RichText'

/**
 * A page with nothing on it yet, saying so in the site's own voice.
 *
 * A results page before there are results is an awkward thing: left empty it
 * looks broken, and filled with an apology it reads worse. So the hedgehog
 * stands there imagining the experiment it has not run, and the page says
 * plainly that the numbers will arrive when they exist. Nothing here pretends
 * to be data.
 *
 * Two rules decide the whole arrangement.
 *
 * **The drawing faces left and is never mirrored.** The quills, the paw and
 * the lit side of its face are all drawn for that direction, so flipping it
 * lights the animal from the wrong side. Everything it looks at therefore has
 * to be placed on its left: the cloud sits up and to the left of the hedgehog,
 * and inside the cloud the flask sits to the left of the hedgehog watching it.
 *
 * **A thought is a cloud, not a box.** The bubble is a real cloud, built as
 * the union of a handful of circles resolved onto a coarse grid, so its edge
 * comes out in hard steps like everything else here rather than as a smooth
 * curve. It is tinted a step away from the panel behind it, so it reads as a
 * shape and not as an outline drawn on the card. Three round puffs fall from
 * its underside to the top of the hedgehog's head, which is the one drawing
 * convention everybody reads without a caption.
 *
 * The scene is the one chosen from five drawn side by side: the hedgehog as
 * it is, no coat and no goggles, watching a flask fizz on the bench.
 */

const { w: HOG_W, h: HOG_H } = HEDGEHOG_SIDE_SIZE

/* ---------------------------------------------------------------- the hog */

/** The hedgehog from the team's own mark, exactly as drawn. */
function paintHog(ctx: CanvasRenderingContext2D) {
  const cells = decodeLayer(HEDGEHOG_SIDE)
  for (let i = 0; i < cells.length; i += 3) {
    ctx.fillStyle = '#' + BALANCE_LOGO.palette[cells[i + 2] - 1]
    ctx.fillRect(cells[i], cells[i + 1], 1, 1)
  }
}

function Hog({ scale = 5 }: { scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, HOG_W, HOG_H)
    paintHog(ctx)
  }, [])
  return (
    <canvas
      ref={ref}
      width={HOG_W}
      height={HOG_H}
      aria-hidden
      className="pixelated shrink-0"
      style={{ width: HOG_W * scale, height: HOG_H * scale }}
    />
  )
}

/* -------------------------------------------------------------- the scene */

/**
 * An Erlenmeyer flask: a narrow neck, a wide round base, liquid two thirds
 * up with bubbles in it, and a highlight down the left of the glass.
 */
const FLASK = [
  '.....dddddd.....',
  '.....dBbbbd.....',
  '.....dBbbbd.....',
  '.....dBbbbd.....',
  '.....dBbbbd.....',
  '.....dBbbbd.....',
  '....dBbbbbbd....',
  '....dBbbfbbd....',
  '...dBbbbbbbbd...',
  '...dBbbbbfbbd...',
  '..dBbbbbbbbbbd..',
  '..dbwwwwwwwwbd..',
  '.dbwwwwfwwwwwbd.',
  '.dwwwwwwwwwwwwd.',
  'dwwwwwwwwfwwwwwd',
  'dwwwfwwwwwwwwwwd',
  'dwwwwwwwwwwwwwwd',
  'dwwwwwwwwwwwwwwd',
  '.dddddddddddddd.',
]
const INK: Record<string, string> = {
  d: SITE_PALETTE.shadow,
  b: SITE_PALETTE.sparkle,
  B: SITE_PALETTE.sparkleHi,
  w: SITE_PALETTE.waterDeep,
  f: SITE_PALETTE.petalWhiteHi,
}
/** Fizz drifting up off the flask and towards the hedgehog, as [x, y, size]. */
const FIZZ: [number, number, number][] = [
  [6, -3, 2],
  [9, -7, 1],
  [4, -9, 2],
  [8, -13, 1],
]

const FLASK_W = FLASK[0].length
const FLASK_H = FLASK.length
/** Space between the flask and the hedgehog's snout. */
const GAP = 3
const SCENE_W = FLASK_W + GAP + HOG_W
/** Tall enough for the fizz above the flask, plus the bench under everything. */
const SCENE_H = HOG_H + 3
const BENCH_Y = SCENE_H - 3

function paintScene(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SCENE_W, SCENE_H)

  // The bench, a top with a darker front edge, under both of them.
  ctx.fillStyle = SITE_PALETTE.bark
  ctx.fillRect(0, BENCH_Y, SCENE_W, 2)
  ctx.fillStyle = SITE_PALETTE.barkDark
  ctx.fillRect(0, BENCH_Y + 2, SCENE_W, 1)

  // The flask, standing on the bench.
  const fy = BENCH_Y - FLASK_H
  FLASK.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const colour = INK[row[x]]
      if (!colour) continue
      ctx.fillStyle = colour
      ctx.fillRect(x, fy + y, 1, 1)
    }
  })
  ctx.fillStyle = SITE_PALETTE.petalWhiteHi
  for (const [x, y, s] of FIZZ) ctx.fillRect(x, fy + y, s, s)

  // The hedgehog, standing on the same bench, watching.
  ctx.save()
  ctx.translate(FLASK_W + GAP, BENCH_Y - HOG_H)
  paintHog(ctx)
  ctx.restore()
}

function Scene({ scale = 4 }: { scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (ctx) paintScene(ctx)
  }, [])
  return (
    <canvas
      ref={ref}
      width={SCENE_W}
      height={SCENE_H}
      aria-hidden
      className="pixelated"
      style={{ width: SCENE_W * scale, maxWidth: '100%', height: 'auto' }}
    />
  )
}

/* -------------------------------------------------------------- the cloud */

/** The cloud, as circles on a coarse grid so its edge steps like a pixel. */
const CELL = 8
const CLOUD_COLS = 44
const CLOUD_ROWS = 34
const PUFFS: [number, number, number][] = [
  [22, 18, 12],
  [12, 18, 9],
  [32, 18, 9],
  [15, 10, 7],
  [29, 10, 7.5],
  [22, 8, 8],
  [13, 26, 6.5],
  [31, 26, 6.5],
]

function cloudCells() {
  const inside = (cx: number, cy: number) =>
    PUFFS.some(([x, y, r]) => (cx + 0.5 - x) ** 2 + (cy + 0.5 - y) ** 2 <= r * r)
  const fill: [number, number][] = []
  const edge: [number, number][] = []
  for (let y = 0; y < CLOUD_ROWS; y++) {
    for (let x = 0; x < CLOUD_COLS; x++) {
      if (!inside(x, y)) continue
      const open =
        !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)
      ;(open ? edge : fill).push([x, y])
    }
  }
  return { fill, edge }
}

const CLOUD = cloudCells()
const CLOUD_W = CLOUD_COLS * CELL
const CLOUD_H = CLOUD_ROWS * CELL

/**
 * The cloud's fill. One step away from the panel it sits on: the same colour
 * as the panel made it read as an outline drawn on the card rather than as a
 * shape in front of it.
 */
const CLOUD_FILL = SITE_PALETTE.fallLight

function Cloud({ children }: { children: React.ReactNode }) {
  return (
    /* Fixed size on a laptop, but never wider than the column it is in: on a
       phone the cloud and everything drawn inside it shrink together. */
    <div
      className="relative w-full shrink-0"
      style={{ maxWidth: CLOUD_W, aspectRatio: `${CLOUD_W} / ${CLOUD_H}` }}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${CLOUD_COLS} ${CLOUD_ROWS}`}
        className="absolute inset-0 h-full w-full"
        shapeRendering="crispEdges"
      >
        {CLOUD.fill.map(([x, y]) => (
          <rect key={`f${x}-${y}`} x={x} y={y} width={1} height={1} fill={CLOUD_FILL} />
        ))}
        {CLOUD.edge.map(([x, y]) => (
          <rect key={`e${x}-${y}`} x={x} y={y} width={1} height={1} fill={SITE_PALETTE.bushDark} />
        ))}
      </svg>
      {/* The straight middle of the cloud, where the picture can sit without
          running into a bump. */}
      <div className="absolute inset-x-[18%] inset-y-[12%] flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

/**
 * The puffs between the cloud and the hedgehog's head, read top to bottom:
 * each one smaller and further right than the one above, so the trail falls
 * from the cloud's underside down to the head rather than standing beside
 * the cloud like a column of bubbles. The sizes are [diameter, shift from
 * the page's centre line] in pixels.
 */
const TRAIL: [number, number][] = [
  [24, 58],
  [16, 86],
  [10, 108],
]

function Puffs() {
  return (
    <span aria-hidden className="flex flex-col items-center gap-2">
      {TRAIL.map(([d, shift]) => (
        <svg
          key={d}
          width={d}
          height={d}
          viewBox="0 0 10 10"
          className="block"
          /* The shift is scaled by --k, which the layout sets smaller on a
             phone so the trail and the hedgehog slide inward together. */
          style={{ translate: `calc(${shift}px * var(--k, 1)) 0` }}
        >
          <circle cx="5" cy="5" r="4" fill={CLOUD_FILL} stroke={SITE_PALETTE.bushDark} strokeWidth="2" />
        </svg>
      ))}
    </span>
  )
}

/* --------------------------------------------------------------- the page */

export default function ResultsSoon({
  note,
  caption,
}: {
  /** What the hedgehog is thinking. */
  note: string
  /** One line under the drawing, in the page's own voice. */
  caption?: string
}) {
  return (
    <section className="panel px-5 py-6 sm:px-7 sm:py-8">
      {/* What the hedgehog is thinking, said once, above the drawing. The
          cloud holds only the picture; a caption inside it fought the bumps
          for room and never sat quite level. */}
      <p className="mb-5 text-center text-body leading-relaxed">
        {inline(note)} <span className="whitespace-nowrap">:)</span>
      </p>

      {/* A thought hangs ABOVE the thinker. The cloud is at the top, the
          hedgehog at the bottom and to the right of it, and the puffs fall
          from the cloud's underside down to the top of its head. The hedgehog
          sits right of centre because it faces left and cannot be flipped: a
          cloud over its right shoulder would be behind its back. */}
      <div className="flex flex-col items-center [--k:0.7] sm:[--k:1]">
        <Cloud>
          <Scene />
        </Cloud>

        {/* Pulled up into the empty bottom of the cloud's box, where the
            drawn cloud has already ended. */}
        <div className="-mt-3">
          <Puffs />
        </div>
        {/* The head is on the left of the drawing, so the hedgehog shifts
            far enough right for the last puff to sit over it. Pulled up a
            little, because the drawing's top rows are only quill tips and the
            head itself starts four pixels down. */}
        <div className="-mt-2" style={{ translate: 'calc(126px * var(--k, 1)) 0' }}>
          <Hog />
        </div>
      </div>

      {caption && <p className="mt-5 text-center text-note text-leaf-800">{inline(caption)}</p>}
    </section>
  )
}
