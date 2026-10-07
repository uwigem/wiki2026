import { SITE_PALETTE } from '../theme'
import { inline } from './RichText'

/**
 * A dose against response curve, with the safety threshold shown beside it.
 *
 * The two things this has to say are at completely different scales: the curve
 * rises to under three percent and then flattens, while the line it must not
 * cross is at twenty. Drawing both on one axis flattens the curve into a
 * straight line at the bottom and throws away the shape, which is half the
 * finding, because the flattening IS the result: past a certain dose, adding
 * more changes nothing.
 *
 * So the plot is scaled to the data and the threshold is a separate comparison
 * bar underneath. Each does one job honestly instead of one doing both badly.
 *
 * Doses are spaced evenly rather than by value. They span zero to five hundred
 * and cluster at the low end, so a linear axis would pile four of the eight
 * points on top of each other and a logarithmic one cannot show the zero dose
 * at all. The axis is labelled as a sequence of doses so nothing is implied
 * about the spacing.
 */

export interface DosePoint {
  /** The dose, as it should be printed on the axis. */
  label: string
  value: number
}

interface Props {
  heading?: string
  intro?: string
  points: DosePoint[]
  xLabel: string
  yLabel: string
  /** A line the response must stay under, drawn as a comparison below. */
  threshold?: { value: number; label: string }
  footnote?: string
  source?: string
}

const VW = 420
const VH = 190
const PAD = { left: 46, right: 14, top: 14, bottom: 34 }

export default function DoseCurve({
  heading,
  intro,
  points,
  xLabel,
  yLabel,
  threshold,
  footnote,
  source,
}: Props) {
  const peak = Math.max(...points.map((p) => p.value))
  // Round the top of the axis up to something a person would choose, so the
  // ticks are readable numbers rather than whatever the data happened to hit.
  const step = peak <= 1 ? 0.25 : peak <= 5 ? 1 : 10
  const top = Math.ceil(peak / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(Number(v.toFixed(4)))

  const plotW = VW - PAD.left - PAD.right
  const plotH = VH - PAD.top - PAD.bottom
  const xAt = (i: number) =>
    PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW)
  const yAt = (v: number) => PAD.top + plotH - (v / top) * plotH

  const line = points.map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.value).toFixed(1)}`).join(' ')

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="h-auto w-full min-w-[20rem]"
          role="img"
          aria-label={`${yLabel} against ${xLabel}. ${points
            .map((p) => `${p.label}: ${p.value}`)
            .join('; ')}.`}
        >
          {/* Gridlines first, so everything else sits on top of them. */}
          {ticks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={VW - PAD.right}
                y1={yAt(v)}
                y2={yAt(v)}
                stroke={SITE_PALETTE.grass4}
                strokeWidth={v === 0 ? 0 : 1}
                shapeRendering="crispEdges"
              />
              <text
                x={PAD.left - 7}
                y={yAt(v) + 3.5}
                textAnchor="end"
                fontSize={9}
                fill="currentColor"
                opacity={0.8}
              >
                {v}
              </text>
            </g>
          ))}

          {/* Axes. */}
          <line
            x1={PAD.left}
            x2={VW - PAD.right}
            y1={yAt(0)}
            y2={yAt(0)}
            stroke={SITE_PALETTE.shadow}
            strokeWidth={2}
            shapeRendering="crispEdges"
          />
          <line
            x1={PAD.left}
            x2={PAD.left}
            y1={PAD.top}
            y2={yAt(0)}
            stroke={SITE_PALETTE.shadow}
            strokeWidth={2}
            shapeRendering="crispEdges"
          />

          {/* The response itself: a line, then a square marker per measurement
              so the eight actual samples are distinguishable from the joins
              between them. */}
          <polyline
            points={line}
            fill="none"
            stroke={SITE_PALETTE.pinkDark}
            strokeWidth={3}
            strokeLinejoin="miter"
          />
          {points.map((p, i) => (
            <rect
              key={p.label}
              x={xAt(i) - 3.5}
              y={yAt(p.value) - 3.5}
              width={7}
              height={7}
              fill={SITE_PALETTE.bushHi}
              stroke={SITE_PALETTE.shadow}
              strokeWidth={2}
              shapeRendering="crispEdges"
            />
          ))}

          {points.map((p, i) => (
            <text
              key={p.label}
              x={xAt(i)}
              y={VH - PAD.bottom + 16}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.85}
            >
              {p.label}
            </text>
          ))}
          <text
            x={PAD.left + plotW / 2}
            y={VH - 4}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            opacity={0.7}
          >
            {xLabel}
          </text>
        </svg>
      </div>

      <p className="mt-1 text-note">{yLabel}</p>

      {threshold && (
        <div className="mt-4 panel-flat px-4 py-3">
          <p className="kicker">against the limit we set</p>
          <div className="mt-2 flex items-center gap-3">
            <span
              aria-hidden
              className="relative block h-5 flex-1 border-2 border-leaf-800 bg-leaf-100"
            >
              <span
                className="absolute inset-y-0 left-0 bg-petal-pink"
                style={{ width: `${(peak / threshold.value) * 100}%` }}
              />
            </span>
            <span className="numeral shrink-0 text-body-sm">
              {peak}% of {threshold.value}%
            </span>
          </div>
          <p className="mt-2 text-body-sm leading-relaxed">{threshold.label}</p>
        </div>
      )}

      {footnote && <p className="mt-3 max-w-2xl text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
