import { useState } from 'react'
import { SITE_PALETTE } from '../theme'

/**
 * Design / Build / Test / Learn wheel with a cycle switcher.
 *
 * Data shape matches the existing `steps` block (heading, intro, items[]), so a
 * `steps` block can be dropped into `cycles` with no rewriting. The four items
 * in each cycle are matched to the four wedges by position:
 * items[0] = Design, items[1] = Build, items[2] = Test, items[3] = Learn.
 *
 * Styling reuses classes the site already has (panel, kicker, badge, pixel-btn).
 * The four wedge colours are the garden's own flowers, taken from the engine
 * palette like every other colour on the site, so they re-theme with it.
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

/**
 * One flower colour per stage, each the palette's closest match in hue to the
 * teal, amber, red and purple the wheel was first drawn in. The palette is
 * pastel, so a stage's colour is never used for text: badge numbers use the
 * page ink, which is readable on any of them.
 */
const STAGES = [
  { name: 'Design', color: SITE_PALETTE.sparkle },
  { name: 'Build', color: SITE_PALETTE.daisyCore },
  { name: 'Test', color: SITE_PALETTE.pinkDark },
  { name: 'Learn', color: SITE_PALETTE.lilacPetal },
] as const

const CX = 220
const CY = 220
const R = 150
const GAP = 7

function polar(radius: number, deg: number) {
  const a = (Math.PI / 180) * deg
  return { x: CX + radius * Math.sin(a), y: CY - radius * Math.cos(a) }
}

function arcPath(radius: number, startDeg: number, endDeg: number) {
  const s = polar(radius, startDeg)
  const e = polar(radius, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

function splitHeading(heading: string) {
  const i = heading.indexOf(':')
  if (i === -1) return { tab: heading, subtitle: '' }
  return { tab: heading.slice(0, i).trim(), subtitle: heading.slice(i + 1).trim() }
}

export default function CycleWheel({ heading, intro, cycles }: Props) {
  const [cycleIdx, setCycleIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  if (cycles.length === 0) return null

  const cycle = cycles[cycleIdx]
  const { subtitle } = splitHeading(cycle.heading)
  const step = selected !== null ? cycle.items[selected] : undefined
  const stageColor = selected !== null ? STAGES[selected].color : undefined

  return (
    <section className="flex flex-col gap-5">
      {(heading || intro) && (
        <div>
          {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
          {intro && <p className="mt-2 text-body-sm leading-relaxed">{intro}</p>}
        </div>
      )}

      {/* Cycle switcher */}
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Cycles">
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

      {(subtitle || cycle.intro) && (
        <div className="mx-auto max-w-2xl text-center">
          {subtitle && <p className="kicker">{subtitle}</p>}
          {cycle.intro && <p className="mt-1 text-body-sm leading-relaxed">{cycle.intro}</p>}
        </div>
      )}

      {/* Wheel */}
      <div className="mx-auto w-full max-w-[400px]">
        <svg
          viewBox="0 0 440 440"
          className="h-auto w-full overflow-visible"
          role="group"
          aria-label="Design, build, test, learn cycle"
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeOpacity={0.2} />

          {STAGES.map((stage, i) => {
            const start = i * 90
            const end = start + 90
            const mid = start + 45
            const isSelected = selected === i
            const isActive = isSelected || hovered === i
            const dimmed = selected !== null && !isSelected

            const label = polar(R + 38, mid)
            const badge = polar(R, mid)
            const tip = polar(R, end - GAP)
            const tangent = end - GAP + 90

            return (
              <g
                key={stage.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${stage.name}, stage ${i + 1} of 4`}
                className="cursor-pointer outline-none"
                onClick={() => setSelected(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(i)
                  }
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                {/* Fat invisible stroke so the whole wedge is easy to hit */}
                <path
                  d={arcPath(R, start + GAP, end - GAP)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={44}
                />
                <path
                  d={arcPath(R, start + GAP, end - GAP)}
                  fill="none"
                  stroke={stage.color}
                  strokeWidth={isSelected ? 28 : isActive ? 25 : 22}
                  strokeLinecap="butt"
                  opacity={dimmed ? 0.55 : 1}
                  shapeRendering="crispEdges"
                  style={{ transition: 'stroke-width 150ms, opacity 150ms' }}
                />
                <path
                  d="M -6 -5 L 6 0 L -6 5 Z"
                  fill={stage.color}
                  transform={`translate(${tip.x.toFixed(2)}, ${tip.y.toFixed(2)}) rotate(${tangent.toFixed(2)})`}
                />
                <circle cx={badge.x} cy={badge.y} r={11} fill={SITE_PALETTE.bushHi} stroke={stage.color} strokeWidth={1.6} />
                <text
                  x={badge.x}
                  y={badge.y + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="currentColor"
                >
                  {String(i + 1).padStart(2, '0')}
                </text>
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fill="currentColor"
                  opacity={isActive ? 1 : 0.75}
                >
                  {stage.name}
                </text>
              </g>
            )
          })}

          {/* Hub shows the active cycle */}
          <circle cx={CX} cy={CY} r={60} fill="none" stroke="currentColor" strokeOpacity={0.2} />
          <text x={CX} y={CY - 2} textAnchor="middle" fontSize={26} fontWeight={700} fill="currentColor">
            {String(cycleIdx + 1).padStart(2, '0')}
          </text>
          <text x={CX} y={CY + 20} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
            active cycle
          </text>
        </svg>
        <p className="mt-2 text-center text-body-sm opacity-70">Click a quadrant to open it</p>
      </div>

      {/* Detail panel */}
      {/* The stage colour is an inset stripe inside the panel's own border, not a
          replacement for it. Replacing the dark border with a pastel one made the
          panel look like it had lost its left edge (sparkle on cream is 1.2:1).
          The second shadow restates .panel's offset shadow, which an inline
          box-shadow would otherwise override. */}
      <div
        className="panel px-5 py-5"
        style={
          stageColor ? { boxShadow: `inset 8px 0 0 ${stageColor}, 4px 4px 0 var(--p-shadow)` } : undefined
        }
        aria-live="polite"
      >
        {step && selected !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="badge">{String(selected + 1).padStart(2, '0')}</span>
              <p className="kicker">
                {splitHeading(cycle.heading).tab} · stage {selected + 1} of 4
              </p>
            </div>
            <h3 className="mt-1 text-xl sm:text-2xl">{step.title || STAGES[selected].name}</h3>
            <p className="mt-2 text-body-sm leading-relaxed">{step.body}</p>
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
            Pick Design, Build, Test, or Learn on the wheel to see what happened in{' '}
            {splitHeading(cycle.heading).tab.toLowerCase()}.
          </p>
        )}
      </div>
    </section>
  )
}