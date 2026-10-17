import { useEffect, useRef, useState } from 'react'
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
 * setting the seed that starts the next round.
 *
 * Three things this has to do at once, which earlier versions each got wrong:
 *
 * 1. **Look like a cycle.** Four stations sit in the four gaps in the ring and
 *    bridge them, so the eye runs station, arc, station all the way round and
 *    closes. Drop the stations and the gaps orphan the arcs: it stops being a
 *    loop and becomes four unrelated curved bars.
 * 2. **Show the writing.** All four stages are on the page at once as cards.
 *    An earlier version hid each one behind a click on its station, which cost
 *    half a screen to say nothing.
 * 3. **Say where you are.** The ring sticks beside the cards as they scroll
 *    past, and the station for the stage you are reading lights up. The arc
 *    leading into it fills at the same time, so the loop reads as progress
 *    rather than as decoration.
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
  { name: 'Design', colour: SITE_PALETTE.sparkle, sprite: TUFT },
  { name: 'Build', colour: SITE_PALETTE.daisyCore, sprite: FERN },
  { name: 'Test', colour: SITE_PALETTE.pinkDark, sprite: DAISY },
  { name: 'Learn', colour: SITE_PALETTE.lilacPetal, sprite: BERRY_BUSH },
] as const

/* Ring geometry, in viewBox units. */
const VIEW = 340
const C = VIEW / 2
const RADIUS = 118
/** Side of one block in the ring. Big enough to read as a pixel, not a dot. */
const BLOCK = 19
const PER_QUADRANT = 11
/** Gap left for a station to sit in, each side of it, in degrees. */
const GAP_DEG = 19
/** Where the reading line sits, as a fraction of the window height. */
const LINE = 0.38

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
 * Which of the four stage cards the reader is level with.
 *
 * One listener, coalesced into a frame, measuring four elements. The same
 * shape as the section outline's own scroll spy, which measured at 0.05 ms a
 * scroll event.
 */
function useStageInView(cards: React.RefObject<(HTMLElement | null)[]>, count: number) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * LINE
      /*
       * Nearest card to the line, not the last one above it. On a cycle whose
       * four stages all fit on one screen the second rule never advances past
       * the first stage, because no later card ever crosses the line before
       * the whole block has scrolled away.
       */
      let found = 0
      let best = Infinity
      for (let i = 0; i < count; i++) {
        const el = cards.current?.[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - line)
        if (d < best) {
          best = d
          found = i
        }
      }
      setActive(found)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [cards, count])
  return active
}

/**
 * The loop, with its four stations. Decorative: every stage name, number and
 * colour is repeated as text on the cards, so nothing is said only in here.
 */
function Ring({ active, caption }: { active: number; caption?: string }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {STAGES.map((s, i) => {
          // Each arc runs FROM this station TO the next one, so it sits between
          // two of them rather than under one. Blocks taper toward the far end,
          // which gives the loop a direction without an arrowhead: a rotated
          // arrowhead cannot stay on the pixel grid, and four tilted diamonds
          // look like debris.
          const from = i * 90 + 45 + GAP_DEG
          const to = (i + 1) * 90 + 45 - GAP_DEG
          // The arc leading INTO the active station is the one that has just
          // been travelled, so it is the one that fills.
          const travelled = i < active
          return (
            <g key={s.name}>
              {Array.from({ length: PER_QUADRANT }, (_, b) => {
                const t = b / (PER_QUADRANT - 1)
                const p = polar(RADIUS, from + t * (to - from))
                const size = BLOCK * (1 - t * 0.28)
                return (
                  <rect
                    key={b}
                    x={p.x - size / 2}
                    y={p.y - size / 2}
                    width={size}
                    height={size}
                    fill={s.colour}
                    // Arcs still to come keep their colour but sit back, so
                    // the loop reads as a loop at a glance and as progress on
                    // a second look.
                    opacity={travelled ? 1 : 0.38}
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

      {/* The stations, sitting in the gaps so the loop closes through them. */}
      {STAGES.map((s, i) => {
        const p = polar(RADIUS, i * 90 + 45)
        const here = i === active
        return (
          <span
            key={s.name}
            style={{
              left: `${(p.x / VIEW) * 100}%`,
              top: `${(p.y / VIEW) * 100}%`,
              translate: '-50% -50%',
              ...(here ? { background: s.colour } : undefined),
            }}
            className={
              'absolute flex items-center gap-1 rounded-sm border-[3px] px-1.5 py-0.5 transition-colors ' +
              (here
                ? 'border-leaf-800 shadow-[3px_3px_0_var(--p-shadow)]'
                : 'border-leaf-700 bg-leaf-50')
            }
          >
            <PixelSprite sprite={s.sprite} scale={1} />
            <span className="pixel text-tag leading-none">{s.name}</span>
          </span>
        )
      })}

      {/* The hub. How far round the loop you are, as a number you can read
          from the corner of your eye while the stations stay small. */}
      <span className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
        <span className="numeral text-3xl leading-none">{active + 1}</span>
        <span className="kicker mt-0.5 text-[0.55rem] leading-none">of {STAGES.length}</span>
        {caption && <span className="kicker mt-1 text-[0.5rem] leading-none opacity-70">{caption}</span>}
      </span>
    </div>
  )
}

export default function CycleWheel({ heading, intro, cycles }: Props) {
  const [cycleIdx, setCycleIdx] = useState(0)
  const cards = useRef<(HTMLElement | null)[]>([])
  const cycle = cycles[cycleIdx]
  const active = useStageInView(cards, cycle ? cycle.items.length : 0)

  if (cycles.length === 0) return null

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

      <div className="mt-3">
        <p className="pixel text-base sm:text-lg">{subtitle || tab}</p>
        {cycle.intro && <p className="mt-1 text-body-sm leading-relaxed">{inline(cycle.intro)}</p>}
      </div>

      {/* The ring keeps pace with the cards: it sticks while they scroll past,
          so the station that is lit always answers "which stage is this". */}
      <div className="mt-4 grid gap-5 md:grid-cols-[16rem_1fr] md:gap-7">
        <div className="md:sticky md:top-24 md:self-start">
          <Ring active={active} caption={many ? `cycle ${cycleIdx + 1} of ${cycles.length}` : undefined} />
          <p className="mt-2 text-center text-note text-leaf-800">Four stages, then round again.</p>
        </div>

        <ol className="flex min-w-0 flex-col gap-3">
          {cycle.items.map((step, i) => {
            const stage = STAGES[i]
            const here = i === active
            return (
              <li
                key={step.title + i}
                ref={(el) => {
                  cards.current[i] = el
                }}
                /* No dimming of the cards the reader is not level with. On a
                   short cycle all four are on screen together, and greying
                   three of them makes most of the writing look switched off.
                   The ring carries the "you are here" on its own. */
                className="panel-flat flex min-w-0 flex-col gap-1.5 px-4 py-3.5"
                style={{
                  boxShadow: here
                    ? `inset 8px 0 0 ${stage.colour}, 3px 3px 0 var(--p-shadow)`
                    : `inset 8px 0 0 ${stage.colour}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <PixelSprite sprite={stage.sprite} scale={2} />
                  <span className="kicker">
                    {i + 1} · {stage.name}
                  </span>
                </div>
                {/* The kicker already names the stage. A title that only
                    repeats it would print "Design" twice in two type sizes. */}
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
          })}
        </ol>
      </div>
    </section>
  )
}
