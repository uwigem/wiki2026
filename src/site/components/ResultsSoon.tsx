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
 * The dream is a thought bubble rather than a speech bubble, because the
 * hedgehog is picturing something rather than claiming it: three dots rising
 * from its head into a cloud, which is the one drawing convention everybody
 * already reads without a caption.
 */

const { w: HOG_W, h: HOG_H } = HEDGEHOG_SIDE_SIZE

/** The scene inside the bubble, beside a second copy of the hedgehog. */
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

/** Bubbles rising out of the flask, as [x, y, size] in scene pixels. */
const FIZZ: [number, number, number][] = [
  [4, 3, 2],
  [8, 0, 1],
  [10, 5, 2],
]

const GAP = 7
const SCENE_W = HOG_W + GAP + FLASK[0].length
const SCENE_H = Math.max(HOG_H, FLASK.length + 6)

/** Paints the hedgehog's daydream: itself, at a bench, with something fizzing. */
function paintScene(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SCENE_W, SCENE_H)

  // The hedgehog, from the team's own mark, standing on the floor of the scene.
  const cells = decodeLayer(HEDGEHOG_SIDE)
  const hogTop = SCENE_H - HOG_H
  for (let i = 0; i < cells.length; i += 3) {
    ctx.fillStyle = '#' + BALANCE_LOGO.palette[cells[i + 2] - 1]
    ctx.fillRect(cells[i], hogTop + cells[i + 1], 1, 1)
  }

  // The flask it is watching, sitting on the same floor.
  const fx = HOG_W + GAP
  const fy = SCENE_H - FLASK.length
  FLASK.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const colour = INK[row[x]]
      if (colour) {
        ctx.fillStyle = colour
        ctx.fillRect(fx + x, fy + y, 1, 1)
      }
    }
  })

  // Fizz coming off the top of it.
  ctx.fillStyle = SITE_PALETTE.foam
  for (const [x, y, s] of FIZZ) ctx.fillRect(fx + x, fy - 4 + y, s, s)
}

function Scene() {
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
      className="pixelated shrink-0"
      style={{ width: SCENE_W * 4, height: SCENE_H * 4 }}
    />
  )
}

/** The hedgehog itself, the one doing the thinking. */
function Hog({ scale = 4 }: { scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    const cells = decodeLayer(HEDGEHOG_SIDE)
    for (let i = 0; i < cells.length; i += 3) {
      ctx.fillStyle = '#' + BALANCE_LOGO.palette[cells[i + 2] - 1]
      ctx.fillRect(cells[i], cells[i + 1], 1, 1)
    }
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
      <div className="flex flex-col items-center gap-2">
        {/* The cloud. A panel with its corners rounded right off, which is as
            close to a cloud as this site's hard-edged boxes should get. */}
        <div className="panel-flat max-w-md rounded-2xl px-5 py-4 text-center">
          <div className="flex items-end justify-center gap-3">
            <Scene />
          </div>
          <p className="mt-3 text-body leading-relaxed">
            {inline(note)}{' '}
            <span aria-hidden className="whitespace-nowrap">
              :)
            </span>
          </p>
        </div>

        {/* The dots and the hedgehog are one group, so the trail always rises
            out of the top of its head however the panel is sized. Biggest
            nearest the cloud, smallest nearest the head, which is the way
            round that reads as thinking rather than as falling. Squares
            rather than circles, for the same reason nothing else here is
            smooth. */}
        <div className="flex flex-col items-center">
          <span aria-hidden className="mb-1 block h-3.5 w-3.5 border-[3px] border-leaf-700 bg-leaf-50" />
          <span aria-hidden className="mb-1 block h-2.5 w-2.5 border-2 border-leaf-700 bg-leaf-50" />
          <span aria-hidden className="mb-1 block h-2 w-2 border-2 border-leaf-700 bg-leaf-50" />
          <Hog />
        </div>
      </div>

      {caption && <p className="mt-5 text-center text-note text-leaf-800">{caption}</p>}
    </section>
  )
}
