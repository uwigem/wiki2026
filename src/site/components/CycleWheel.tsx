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
const BLOCK = 17
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

export default function CycleWheel({ heading, intro, cycles }: Props) {
  const [cycleIdx, setCycleIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  if (cycles.length === 0) return null

  const cycle = cycles[cycleIdx]
  const { tab, subtitle } = splitHeading(cycle.heading)
  const step = selected !== null ? cycle.items[selected] : undefined
  const stage = selected !== null ? STAGES[selected] : undefined

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-2 text-body-sm leading-relaxed">{inline(intro)}</p>}

      {cycles.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Cycles">
          {cycles.map((c, i) => (
            <button
              key={c.heading}
              type="button"
              role="tab"
              aria-selected={i === cycleIdx}
              onClick={() => {
                setCycleIdx(i)
                setSelected(null)
              }}
              className={`pixel-btn ${i === cycleIdx ? 'pixel-btn-primary' : ''}`}
            >
              {splitHeading(c.heading).tab}
            </button>
          ))}
        </div>
      )}

      {(subtitle || cycle.intro) && (
        <div className="mx-auto mt-4 max-w-2xl text-center">
          {subtitle && <p className="pixel text-base sm:text-lg">{subtitle}</p>}
          {cycle.intro && <p className="mt-1 text-body-sm leading-relaxed">{inline(cycle.intro)}</p>}
        </div>
      )}

      {/* The ring. A square box so the absolutely placed stage buttons can be
          positioned as percentages and stay on the circle at any size. */}
      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[380px]">
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {STAGES.map((s, i) => {
            const isSel = selected === i
            const dim = selected !== null && !isSel
            // Each arc is the step FROM this stage TO the next one, so it runs
            // between two stations rather than sitting under one. Blocks taper
            // toward the far end, which gives the loop a direction without
            // needing an arrowhead: a rotated arrowhead cannot stay on the
            // pixel grid, and four tilted diamonds look like debris.
            const from = i * 90 + 45 + GAP_DEG
            const to = (i + 1) * 90 + 45 - GAP_DEG
            return (
              <g key={s.name}>
                {Array.from({ length: PER_QUADRANT }, (_, b) => {
                  const t = b / (PER_QUADRANT - 1)
                  const p = polar(RADIUS, from + t * (to - from))
                  const size = (isSel ? BLOCK + 3 : BLOCK) * (1 - t * 0.3)
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
                      opacity={dim ? 0.4 : 1}
                      shapeRendering="crispEdges"
                    />
                  )
                })}
              </g>
            )
          })}
        </svg>

        {/* The hub: which cycle you are looking at. */}
        <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-sm border-[3px] border-leaf-700 bg-leaf-50 text-center shadow-[3px_3px_0_var(--p-shadow)]">
          <span className="numeral text-2xl leading-none sm:text-3xl">
            {String(cycleIdx + 1).padStart(2, '0')}
          </span>
          <span className="kicker mt-1 text-[0.6rem]">of {cycles.length}</span>
        </div>

        {/* One button per stage, sitting on the ring at the middle of its arc. */}
        {STAGES.map((s, i) => {
          const mid = polar(RADIUS, i * 90 + 45)
          const isSel = selected === i
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={isSel}
              onClick={() => setSelected(isSel ? null : i)}
              style={{ left: `${(mid.x / VIEW) * 100}%`, top: `${(mid.y / VIEW) * 100}%` }}
              className={
                'absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-sm border-[3px] px-2 py-1 transition-colors ' +
                (isSel
                  ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                  : 'border-leaf-700 bg-leaf-50 hover:bg-leaf-100')
              }
            >
              <PixelSprite sprite={s.sprite} scale={2} />
              <span className="pixel text-tag leading-none">
                <span className="opacity-60">{i + 1}</span> {s.name}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-body-sm opacity-80">
        {selected === null ? 'Pick a stage to see what happened in it.' : stage?.note}
      </p>

      {/* The detail. The stage colour is an inset stripe inside the panel's own
          border rather than a replacement for it: these are pastels, and one of
          them as a border measures 1.2:1 against cream, which is no border. */}
      <div
        className="panel-flat mt-3 px-5 py-4"
        style={stage ? { boxShadow: `inset 8px 0 0 ${stage.colour}` } : undefined}
        aria-live="polite"
      >
        {step && selected !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="badge">{String(selected + 1).padStart(2, '0')}</span>
              <p className="kicker">
                {tab} · {STAGES[selected].name}
              </p>
            </div>
            <h3 className="mt-1 text-lg sm:text-xl">{step.title || STAGES[selected].name}</h3>
            <p className="mt-2 text-body-sm leading-relaxed">{inline(step.body)}</p>
            {step.bullets && step.bullets.length > 0 && (
              <ul className="mt-3 list-disc pl-5 text-body-sm leading-relaxed">
                {step.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-center text-body-sm leading-relaxed">
            Four stages, then round again. {tab} is {cycle.items.length === 4 ? 'all four' : 'in progress'}.
          </p>
        )}
      </div>
    </section>
  )
}
