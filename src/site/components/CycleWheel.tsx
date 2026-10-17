import { useState } from 'react'
import { BERRY_BUSH, DAISY, FERN, TUFT } from '../../engine/sprites'
import { SITE_PALETTE } from '../theme'
import PixelSprite from './PixelSprite'
import { inline } from './RichText'

/**
 * Design, build, test, learn, drawn as a growing season.
 *
 * The ring is built out of square blocks with hard outlines, laid around a
 * circle and rendered with `shapeRendering: crispEdges`, so nothing in it is
 * smoothed. Anti-aliased arcs next to hand-placed pixels would read as a stock
 * infographic dropped onto a garden.
 *
 * The four stages carry the garden's own plants, at four points in a season:
 * a tuft of new growth, a fern filling out, a daisy in flower, and a berry bush
 * setting the seed that starts the next round. That is the whole argument of an
 * engineering cycle, and it means the labels are not the only thing telling you
 * where you are.
 *
 * The ring used to be the interface: a large circle with four buttons on it,
 * and the writing hidden until one was clicked. That cost half a screen to say
 * nothing and buried the actual content behind four clicks, so the ring is now
 * an emblem beside the cycle's name and all four stages are on the page at
 * once, in order, each carrying its own colour. Nothing here has to be opened.
 *
 * The data shape matches the `steps` block, so a `steps` block can be dropped
 * into `cycles` with no rewriting. Items map to stages by position: items[0] is
 * Design, items[1] Build, items[2] Test, items[3] Learn.
 */

export interface CycleStep {
  title: string
  body: string
  /** Optional short list shown under the body text. */
  bullets?: string[]
}

export interface CycleData {
  /** e.g. "Cycle 1: choosing the target". Text before the colon becomes the tab label. */
  heading: string
  intro?: string
  items: CycleStep[]
}

interface Props {
  heading?: string
  intro?: string
  cycles: CycleData[]
}

const STAGES = [
  { name: 'Design', colour: SITE_PALETTE.sparkle, sprite: TUFT, note: 'what we planted' },
  { name: 'Build', colour: SITE_PALETTE.daisyCore, sprite: FERN, note: 'getting it growing' },
  { name: 'Test', colour: SITE_PALETTE.pinkDark, sprite: DAISY, note: 'seeing what came up' },
  { name: 'Learn', colour: SITE_PALETTE.lilacPetal, sprite: BERRY_BUSH, note: 'seed for next time' },
] as const

/* Ring geometry, in viewBox units. */
const VIEW = 340
const C = VIEW / 2
const RADIUS = 118
/** Side of one block in the ring. Big enough to read as a pixel, not a dot. */
const BLOCK = 20
const PER_QUADRANT = 11
/** Gap between the end of one quadrant and the start of the next, in degrees. */
const GAP_DEG = 17

function polar(radius: number, deg: number) {
  const a = (Math.PI / 180) * deg
  return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) }
}

function splitHeading(heading: string) {
  const i = heading.indexOf(':')
  if (i === -1) return { tab: heading, subtitle: '' }
  return { tab: heading.slice(0, i).trim(), subtitle: heading.slice(i + 1).trim() }
}

/**
 * The loop itself, as an emblem. Decorative: the stage names and colours are
 * repeated as text on the cards below, so nothing is said only in here.
 */
function Ring({ label }: { label?: string }) {
  return (
    <div className="relative aspect-square w-[124px] shrink-0 sm:w-[148px]">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {STAGES.map((s, i) => {
          // Each arc runs FROM this stage TO the next one, so it sits between
          // two stations rather than under one. Blocks taper toward the far
          // end, which gives the loop a direction without an arrowhead: a
          // rotated arrowhead cannot stay on the pixel grid, and four tilted
          // diamonds look like debris.
          const from = i * 90 + 45 + GAP_DEG
          const to = (i + 1) * 90 + 45 - GAP_DEG
          return (
            <g key={s.name}>
              {Array.from({ length: PER_QUADRANT }, (_, b) => {
                const t = b / (PER_QUADRANT - 1)
                const p = polar(RADIUS, from + t * (to - from))
                const size = BLOCK * (1 - t * 0.3)
                return (
                  <rect
                    key={b}
                    x={p.x - size / 2}
                    y={p.y - size / 2}
                    width={size}
                    height={size}
                    fill={s.colour}
                    stroke={SITE_PALETTE.shadow}
                    strokeWidth={2}
                    shapeRendering="crispEdges"
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
      {label && (
        <span className="pixel absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-leaf-800">
          {label}
        </span>
      )}
    </div>
  )
}

function StageCard({ index, step }: { index: number; step: CycleStep }) {
  const stage = STAGES[index]
  return (
    <li
      className="panel-flat flex min-w-0 flex-col gap-1.5 px-4 py-3.5"
      style={{ boxShadow: `inset 8px 0 0 ${stage.colour}` }}
    >
      <div className="flex items-center gap-2">
        <PixelSprite sprite={stage.sprite} scale={2} />
        <span className="kicker">
          {index + 1} · {stage.name}
        </span>
      </div>
      {/* The kicker already names the stage. A title that only repeats it
          would print "Design" twice in two type sizes. */}
      {step.title && step.title.toLowerCase() !== stage.name.toLowerCase() && (
        <h3 className="text-base leading-tight">{step.title}</h3>
      )}
      <p className="text-body-sm leading-relaxed">{inline(step.body)}</p>
      {step.bullets && step.bullets.length > 0 && (
        <ul className="mt-0.5 list-disc pl-5 text-body-sm leading-relaxed">
          {step.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function CycleWheel({ heading, intro, cycles }: Props) {
  const [cycleIdx, setCycleIdx] = useState(0)

  if (cycles.length === 0) return null

  const cycle = cycles[cycleIdx]
  const { tab, subtitle } = splitHeading(cycle.heading)
  const many = cycles.length > 1

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-2 text-body-sm leading-relaxed">{inline(intro)}</p>}

      {many && (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Cycles">
          {cycles.map((c, i) => (
            <button
              key={c.heading}
              type="button"
              role="tab"
              aria-selected={i === cycleIdx}
              onClick={() => setCycleIdx(i)}
              className={`pixel-btn ${i === cycleIdx ? 'pixel-btn-primary' : ''}`}
            >
              {splitHeading(c.heading).tab}
            </button>
          ))}
        </div>
      )}

      {/* The emblem and the cycle's name share a line, so the loop is present
          without taking a screen to say so. */}
      <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Ring label={many ? `${cycleIdx + 1} of ${cycles.length}` : undefined} />
        <div className="min-w-0">
          <p className="pixel text-base sm:text-lg">{subtitle || tab}</p>
          {cycle.intro && (
            <p className="mt-1 text-body-sm leading-relaxed">{inline(cycle.intro)}</p>
          )}
          <p className="mt-1.5 text-note text-leaf-800">
            Design, build, test, learn, then round again.
          </p>
        </div>
      </div>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {cycle.items.map((step, i) => (
          <StageCard key={step.title + i} index={i} step={step} />
        ))}
      </ol>
    </section>
  )
}
