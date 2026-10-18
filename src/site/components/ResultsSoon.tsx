import { useEffect, useRef } from 'react'
import {
  BALANCE_LOGO,
  HEDGEHOG_SIDE,
  HEDGEHOG_SIDE_SIZE,
  decodeLayer,
} from '../content/balanceLogo'
import PixelIcon from './PixelIcon'
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
 * to be placed on its left: the cloud sits to the left of the hedgehog, and
 * inside the cloud the flask sits to the left of the hedgehog imagining it.
 *
 * **A thought is a cloud, not a box.** The bubble is a real cloud, built as
 * the union of a handful of circles resolved onto a coarse grid, so its edge
 * comes out in hard steps like everything else here rather than as a smooth
 * curve. Three round puffs climb from the top of the hedgehog's head to reach
 * it, which is the one drawing convention everybody reads without a caption.
 */

const { w: HOG_W, h: HOG_H } = HEDGEHOG_SIDE_SIZE

/* ---------------------------------------------------------------- the hog */

/**
 * The lab coat, in sprite pixels. It faces left like the animal, so its open
 * front is on the left: everything from COAT_EDGE rightwards is coat, the
 * strip in front of that stays the hedgehog's own belly, and a dark line down
 * the edge is the lapel. Painting the whole lower body white made a
 * straitjacket; the opening is what makes it a coat.
 */
const COAT_FROM = 12
const COAT_EDGE = 6
/** A pocket: the top seam, three pixels wide, on the hip. */
const POCKET = { x: 9, y: 17, w: 3 }
/** Goggles: the lens box, in sprite pixels. */
const LENS = { x: 4, y: 5, w: 5, h: 4 }
/** The strap, running back over the head to the quills. */
const STRAP = { x: 9, y: 5, w: 5, h: 2 }

/**
 * The hedgehog, optionally dressed for the bench.
 *
 * The coat and the goggles are painted only where the base drawing already
 * has a pixel, so they can never spill past the silhouette however roughly
 * their boxes are specified.
 */
function paintHog(ctx: CanvasRenderingContext2D, lab: boolean) {
  const cells = decodeLayer(HEDGEHOG_SIDE)
  // Which pixels the animal occupies, and which of them are its pale body.
  const solid = new Set<number>()
  const body = new Set<number>()
  const arm = new Set<number>()
  for (let i = 0; i < cells.length; i += 3) {
    const x = cells[i]
    const y = cells[i + 1]
    const key = y * HOG_W + x
    solid.add(key)
    // Palette entries 21 and 19 are the cream of its belly and the tan of
    // its arms; the coat and its sleeves go over those and nothing else, so
    // the quills stay quills.
    if (cells[i + 2] === 21 || cells[i + 2] === 19) body.add(key)
    if (cells[i + 2] === 19) arm.add(key)
    ctx.fillStyle = '#' + BALANCE_LOGO.palette[cells[i + 2] - 1]
    ctx.fillRect(x, y, 1, 1)
  }
  if (!lab) return

  for (let y = COAT_FROM; y < HOG_H - 2; y++) {
    for (let x = COAT_EDGE; x < HOG_W; x++) {
      if (!body.has(y * HOG_W + x)) continue
      ctx.fillStyle =
        x === COAT_EDGE
          ? SITE_PALETTE.stoneDark // the lapel, a line down the open front
          : y === COAT_FROM
            ? SITE_PALETTE.stoneMid // the collar
            : SITE_PALETTE.petalWhite
      ctx.fillRect(x, y, 1, 1)
    }
  }
  // The near arm hangs in front of the open coat, so it gets a sleeve of its
  // own even though it sits forward of the lapel. Row 13 is the arm; the
  // tan pixels on it are the only ones painted.
  for (let x = 0; x < COAT_EDGE; x++) {
    if (arm.has(13 * HOG_W + x)) {
      ctx.fillStyle = SITE_PALETTE.petalWhite
      ctx.fillRect(x, 13, 1, 1)
    }
  }
  // The lapel folds back at the top: one step up and out from the edge.
  ctx.fillStyle = SITE_PALETTE.stoneDark
  ctx.fillRect(COAT_EDGE + 1, COAT_FROM - 1, 1, 1)
  for (let x = POCKET.x; x < POCKET.x + POCKET.w; x++) ctx.fillRect(x, POCKET.y, 1, 1)

  const put = (x: number, y: number, colour: string) => {
    if (solid.has(y * HOG_W + x)) {
      ctx.fillStyle = colour
      ctx.fillRect(x, y, 1, 1)
    }
  }
  for (let y = STRAP.y; y < STRAP.y + STRAP.h; y++) {
    for (let x = STRAP.x; x < STRAP.x + STRAP.w; x++) put(x, y, SITE_PALETTE.stoneDark)
  }
  for (let y = LENS.y - 1; y <= LENS.y + LENS.h; y++) {
    for (let x = LENS.x - 1; x <= LENS.x + LENS.w; x++) {
      const inside =
        x >= LENS.x && x < LENS.x + LENS.w && y >= LENS.y && y < LENS.y + LENS.h
      put(x, y, inside ? SITE_PALETTE.sparkle : SITE_PALETTE.stoneDark)
    }
  }
  // One highlight in the glass, so it reads as glass and not as a hole.
  put(LENS.x + 1, LENS.y + 1, SITE_PALETTE.sparkleHi)
}

function Hog({ lab = false, scale = 5 }: { lab?: boolean; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, HOG_W, HOG_H)
    paintHog(ctx, lab)
  }, [lab])
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

/* -------------------------------------------------------------- the flask */

const FLASK = [
  '....######....',
  '....#oooo#....',
  '....#oooo#....',
  '....#oooo#....',
  '...#oooooo#...',
  '...#oobooo#...',
  '..#oooooooo#..',
  '..#oooobooo#..',
  '.#oooooooooo#.',
  '.#gggggggggg#.',
  '#gggggggggggg#',
  '#gggggggggggg#',
  '#gggggggggggg#',
  '#gggggggggggg#',
  '##############',
]
const INK: Record<string, string> = {
  '#': SITE_PALETTE.shadow,
  o: SITE_PALETTE.bushHi,
  g: SITE_PALETTE.waterDeep,
  b: SITE_PALETTE.foam,
}
/** Fizz coming off the top, as [x, y, size]. */
const FIZZ: [number, number, number][] = [
  [4, 3, 2],
  [8, 0, 1],
  [10, 5, 2],
]

const FLASK_W = FLASK[0].length
const FLASK_H = FLASK.length
const GAP = 6
/** Flask on the LEFT, hedgehog on the right: it has to face what it watches. */
const SCENE_W = FLASK_W + GAP + HOG_W
const SCENE_H = HOG_H + 5

function paintScene(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SCENE_W, SCENE_H)
  const floor = SCENE_H

  const fy = floor - FLASK_H
  FLASK.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const colour = INK[row[x]]
      if (!colour) continue
      ctx.fillStyle = colour
      ctx.fillRect(x, fy + y, 1, 1)
    }
  })
  ctx.fillStyle = SITE_PALETTE.foam
  for (const [x, y, s] of FIZZ) ctx.fillRect(x, fy - 4 + y, s, s)

  ctx.save()
  ctx.translate(FLASK_W + GAP, floor - HOG_H)
  paintHog(ctx, true)
  ctx.restore()
}

function Scene({ scale = 3 }: { scale?: number }) {
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
          <rect key={`f${x}-${y}`} x={x} y={y} width={1} height={1} fill={SITE_PALETTE.bushHi} />
        ))}
        {CLOUD.edge.map(([x, y]) => (
          <rect key={`e${x}-${y}`} x={x} y={y} width={1} height={1} fill={SITE_PALETTE.bushDark} />
        ))}
      </svg>
      {/* The straight middle of the cloud, where content can sit without
          running into a bump. */}
      <div className="absolute inset-x-[18%] inset-y-[12%] flex flex-col items-center justify-center gap-2 text-center">
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
          <circle cx="5" cy="5" r="4" fill={SITE_PALETTE.bushHi} stroke={SITE_PALETTE.bushDark} strokeWidth="2" />
        </svg>
      ))}
    </span>
  )
}

/**
 * A smile. An outline, not a filled disc: filled, the two eye holes and the
 * mouth gap read as a face in a respirator.
 */
const SMILEY = [
  '...#####...',
  '..#.....#..',
  '.#.......#.',
  '#...#.#...#',
  '#.........#',
  '#.........#',
  '#..#...#..#',
  '#...###...#',
  '.#.......#.',
  '..#.....#..',
  '...#####...',
]

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
      {/* A thought hangs ABOVE the thinker. The cloud is at the top, the
          hedgehog at the bottom and to the right of it, and the puffs fall
          from the cloud's underside down to the top of its head. The hedgehog
          sits right of centre because it faces left and cannot be flipped: a
          cloud over its right shoulder would be behind its back. */}
      <div className="flex flex-col items-center [--k:0.7] sm:[--k:1]">
        <Cloud>
          <Scene />
          {/* The smile runs on the end of the sentence, not under it: as a
              flex item it became its own line whenever the words wrapped. */}
          <p className="text-body-sm leading-snug">
            {inline(note)}{' '}
            <PixelIcon
              rows={SMILEY}
              className="ml-1 inline-block h-[1.05em] w-[1.05em] align-[-0.15em] text-leaf-900"
            />
          </p>
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
