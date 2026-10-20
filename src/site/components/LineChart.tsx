import { SITE_PALETTE } from '../theme'
import { CHART_TEXT, SERIES, fmt, frac, ink, makeAxis, type PaletteKey } from './chartKit'
import { inline } from './RichText'

/**
 * Lines against a shared axis: a dose sweep, a time course, a sensitivity that
 * changes over time. One or more panels; when there are several they share
 * both axes, so a reader compares them by eye without reading the ticks twice
 * (small multiples).
 *
 * Drawn as SVG in the browser, so its words are real text in the site's font
 * and the browser substitutes any symbol that font lacks.
 */

export interface LineSeries {
  label: string
  /** [x, y] pairs in order of x. Points that cannot be drawn (a zero on a log axis) are skipped. */
  points: [number, number][]
  /** A palette name. Series without one take the next colour in turn. */
  colour?: PaletteKey
  dashed?: boolean
  /** Draw thicker, for the one line the text talks about. */
  emphasis?: boolean
}

export interface LinePanel {
  title?: string
  series: LineSeries[]
}

/** A horizontal or vertical line marking a value, with its own label. */
export interface ChartReference {
  axis: 'x' | 'y'
  value: number
  label: string
}

interface Props {
  heading?: string
  intro?: string
  panels: LinePanel[]
  xLabel: string
  yLabel: string
  xLog?: boolean
  yLog?: boolean
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  references?: ChartReference[]
  /** Heading over the legend, for example "on-rate, times the baseline". */
  legendTitle?: string
  footnote?: string
  source?: string
}

const VW = 440
const VH = 250
const PAD = { left: 50, right: 16, top: 16, bottom: 38 }

export default function LineChart({
  heading,
  intro,
  panels,
  xLabel,
  yLabel,
  xLog,
  yLog,
  xMin,
  xMax,
  yMin,
  yMax,
  references = [],
  legendTitle,
  footnote,
  source,
}: Props) {
  // One colour per series label across every panel, so a line keeps its
  // colour from one panel to the next.
  const colourOf = new Map<string, string>()
  const legend: LineSeries[] = []
  for (const p of panels)
    for (const s of p.series)
      if (!colourOf.has(s.label)) {
        colourOf.set(s.label, ink(s.colour ?? SERIES[colourOf.size % SERIES.length]))
        legend.push(s)
      }

  const ok = (x: number, y: number) =>
    Number.isFinite(x) && Number.isFinite(y) && (!xLog || x > 0) && (!yLog || y > 0)
  const all = panels.flatMap((p) => p.series.flatMap((s) => s.points.filter(([x, y]) => ok(x, y))))
  const xs = all.map((p) => p[0]).concat(references.filter((r) => r.axis === 'x').map((r) => r.value))
  const ys = all.map((p) => p[1]).concat(references.filter((r) => r.axis === 'y').map((r) => r.value))
  const xAxis = makeAxis(Math.min(...xs), Math.max(...xs), { log: xLog, min: xMin, max: xMax })
  const yAxis = makeAxis(Math.min(...ys), Math.max(...ys), { log: yLog, min: yMin, max: yMax })

  const plotW = VW - PAD.left - PAD.right
  const plotH = VH - PAD.top - PAD.bottom
  const X = (v: number) => PAD.left + frac(xAxis, v) * plotW
  const Y = (v: number) => PAD.top + plotH - frac(yAxis, v) * plotH

  const describe = (p: LinePanel) =>
    `${p.title ? p.title + '. ' : ''}${yLabel} against ${xLabel}. ` +
    p.series
      .map((s) => {
        const pts = s.points.filter(([x, y]) => ok(x, y))
        if (pts.length === 0) return ''
        const [x0, y0] = pts[0]
        const [x1, y1] = pts[pts.length - 1]
        return `${s.label}: from ${fmt(y0)} at ${fmt(x0)} to ${fmt(y1)} at ${fmt(x1)}`
      })
      .filter(Boolean)
      .join('; ') +
    '.'

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className={'mt-4 grid gap-4 ' + (panels.length > 1 ? 'lg:grid-cols-2' : '')}>
        {panels.map((p, pi) => (
          <figure key={pi} className="m-0 min-w-0">
            {p.title && <figcaption className="text-body-sm font-semibold">{inline(p.title)}</figcaption>}
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full min-w-[20rem]" role="img" aria-label={describe(p)}>
                {yAxis.ticks.map((v) => (
                  <g key={`y${v}`}>
                    <line
                      x1={PAD.left}
                      x2={VW - PAD.right}
                      y1={Y(v)}
                      y2={Y(v)}
                      stroke={SITE_PALETTE.grass4}
                      strokeWidth={1}
                      shapeRendering="crispEdges"
                    />
                    <text x={PAD.left - 7} y={Y(v) + 3.5} textAnchor="end" {...CHART_TEXT} opacity={0.8}>
                      {fmt(v)}
                    </text>
                  </g>
                ))}
                {xAxis.ticks.map((v) => (
                  <text key={`x${v}`} x={X(v)} y={PAD.top + plotH + 15} textAnchor="middle" {...CHART_TEXT} opacity={0.8}>
                    {fmt(v)}
                  </text>
                ))}

                {references.map((r) =>
                  r.axis === 'y' ? (
                    <g key={`r${r.label}`}>
                      <line
                        x1={PAD.left}
                        x2={VW - PAD.right}
                        y1={Y(r.value)}
                        y2={Y(r.value)}
                        stroke={SITE_PALETTE.shadow}
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                      />
                      <text x={VW - PAD.right - 2} y={Y(r.value) - 4} textAnchor="end" {...CHART_TEXT}>
                        {r.label}
                      </text>
                    </g>
                  ) : (
                    <g key={`r${r.label}`}>
                      <line
                        x1={X(r.value)}
                        x2={X(r.value)}
                        y1={PAD.top}
                        y2={PAD.top + plotH}
                        stroke={SITE_PALETTE.shadow}
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                      />
                      <text x={X(r.value) + 4} y={PAD.top + 10} {...CHART_TEXT}>
                        {r.label}
                      </text>
                    </g>
                  ),
                )}

                {p.series.map((s) => {
                  const pts = s.points.filter(([x, y]) => ok(x, y))
                  return (
                    <polyline
                      key={s.label}
                      points={pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}
                      fill="none"
                      stroke={colourOf.get(s.label)}
                      strokeWidth={s.emphasis ? 3.5 : 2.25}
                      strokeDasharray={s.dashed ? '7 4' : undefined}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )
                })}

                {/* Axes last, so the lines start under them rather than over. */}
                <line
                  x1={PAD.left}
                  x2={VW - PAD.right}
                  y1={PAD.top + plotH}
                  y2={PAD.top + plotH}
                  stroke={SITE_PALETTE.shadow}
                  strokeWidth={2}
                  shapeRendering="crispEdges"
                />
                <line
                  x1={PAD.left}
                  x2={PAD.left}
                  y1={PAD.top}
                  y2={PAD.top + plotH}
                  stroke={SITE_PALETTE.shadow}
                  strokeWidth={2}
                  shapeRendering="crispEdges"
                />
                <text x={PAD.left + plotW / 2} y={VH - 4} textAnchor="middle" {...CHART_TEXT} opacity={0.75}>
                  {xLabel}
                </text>
              </svg>
            </div>
          </figure>
        ))}
      </div>

      <p className="mt-1 text-note">{yLabel}</p>

      {legend.length > 1 && (
        <div className="mt-3">
          {legendTitle && <p className="kicker">{legendTitle}</p>}
          <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-note">
            {legend.map((s) => (
              <li key={s.label} className="flex items-center gap-1.5">
                <svg aria-hidden width={22} height={8} className="shrink-0">
                  <line
                    x1={1}
                    x2={21}
                    y1={4}
                    y2={4}
                    stroke={colourOf.get(s.label)}
                    strokeWidth={s.emphasis ? 3.5 : 2.5}
                    strokeDasharray={s.dashed ? '6 3' : undefined}
                  />
                </svg>
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {footnote && <p className="mt-3 text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>}
    </section>
  )
}
