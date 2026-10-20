import { SITE_PALETTE } from '../theme'
import { CHART_TEXT, SERIES, fitLine, fmt, frac, ink, makeAxis, type PaletteKey } from './chartKit'
import type { ChartReference } from './LineChart'
import { inline } from './RichText'

/**
 * Points against two measured quantities: hotspot attempts against successes,
 * one score per design, a sensitivity screen's mean against its spread.
 *
 * Optional extras, each for a specific claim a page makes: a fitted line with
 * its R squared (a rate that holds whatever the input), a reference line (a
 * native complex to beat), and the 1:1 diagonal (in a Morris screen, points
 * above it act through interactions more than directly).
 */

export interface ScatterPoint {
  x: number
  y: number
  /** Which group the point belongs to; must match a group id. */
  group?: string
  /** Printed beside the point. Leave out for unlabelled points. */
  label?: string
  /** Which side of the point the label sits on. Default is the right. */
  labelAt?: 'left' | 'right' | 'above' | 'below'
  /**
   * Place the label by hand instead, in the drawing's own units, measured from
   * the point. For a crowd of points whose names would otherwise sit on top of
   * one another: move each one clear, and a leader line is drawn to it.
   */
  labelDx?: number
  labelDy?: number
}

export interface ScatterGroup {
  id: string
  label: string
  colour?: PaletteKey
  shape?: 'square' | 'circle' | 'diamond'
}

export interface ScatterPanel {
  title?: string
  points: ScatterPoint[]
}

interface Props {
  heading?: string
  intro?: string
  panels: ScatterPanel[]
  groups?: ScatterGroup[]
  xLabel: string
  yLabel: string
  xLog?: boolean
  yLog?: boolean
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  /** A fitted line per group: ordinary least squares, or forced through the origin. */
  trend?: 'ols' | 'origin'
  references?: ChartReference[]
  /** Draw y = x. */
  diagonal?: boolean
  /** Give every panel the same axes. Off by default: panels often differ in scale. */
  sharedAxes?: boolean
  footnote?: string
  source?: string
}

const VW = 440
const VH = 280
const PAD = { left: 52, right: 18, top: 16, bottom: 38 }

function Marker({ shape, x, y, fill }: { shape: ScatterGroup['shape']; x: number; y: number; fill: string }) {
  const stroke = SITE_PALETTE.shadow
  if (shape === 'circle') return <circle cx={x} cy={y} r={3.6} fill={fill} stroke={stroke} strokeWidth={1.2} />
  if (shape === 'diamond')
    return (
      <rect
        x={x - 3.2}
        y={y - 3.2}
        width={6.4}
        height={6.4}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.2}
        transform={`rotate(45 ${x} ${y})`}
      />
    )
  return <rect x={x - 3.3} y={y - 3.3} width={6.6} height={6.6} fill={fill} stroke={stroke} strokeWidth={1.2} />
}

export default function ScatterChart({
  heading,
  intro,
  panels,
  groups = [],
  xLabel,
  yLabel,
  xLog,
  yLog,
  xMin,
  xMax,
  yMin,
  yMax,
  trend,
  references = [],
  diagonal,
  sharedAxes,
  footnote,
  source,
}: Props) {
  const groupOf = (id?: string) => groups.find((g) => g.id === id)
  const colourOf = (id?: string) => {
    const i = Math.max(0, groups.findIndex((g) => g.id === id))
    return ink(groupOf(id)?.colour ?? SERIES[i % SERIES.length])
  }
  const ok = (p: ScatterPoint) =>
    Number.isFinite(p.x) && Number.isFinite(p.y) && (!xLog || p.x > 0) && (!yLog || p.y > 0)

  const axesFor = (pts: ScatterPoint[]) => {
    const xs = pts.map((p) => p.x).concat(references.filter((r) => r.axis === 'x').map((r) => r.value))
    const ys = pts.map((p) => p.y).concat(references.filter((r) => r.axis === 'y').map((r) => r.value))
    if (diagonal) {
      const lo = Math.min(...xs, ...ys)
      const hi = Math.max(...xs, ...ys)
      xs.push(lo, hi)
      ys.push(lo, hi)
    }
    return {
      x: makeAxis(Math.min(...xs), Math.max(...xs), { log: xLog, min: xMin, max: xMax }),
      y: makeAxis(Math.min(...ys), Math.max(...ys), { log: yLog, min: yMin, max: yMax }),
    }
  }
  const shared = axesFor(panels.flatMap((p) => p.points.filter(ok)))

  const plotW = VW - PAD.left - PAD.right
  const plotH = VH - PAD.top - PAD.bottom

  // The fitted lines, per panel and group, computed once for the plot and the legend.
  const fits = panels.map((p) =>
    trend
      ? (groups.length ? groups.map((g) => g.id) : [undefined]).map((id) => {
          const pts = p.points.filter((q) => ok(q) && q.group === id)
          return pts.length >= 2 ? { id, ...fitLine(pts, trend === 'origin') } : null
        })
      : [],
  )

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className={'mt-4 grid gap-4 ' + (panels.length > 1 ? 'lg:grid-cols-2' : '')}>
        {panels.map((p, pi) => {
          const pts = p.points.filter(ok)
          const ax = sharedAxes ? shared : axesFor(pts)
          const X = (v: number) => PAD.left + frac(ax.x, v) * plotW
          const Y = (v: number) => PAD.top + plotH - frac(ax.y, v) * plotH
          const clampX = (v: number) => Math.min(ax.x.max, Math.max(ax.x.min, v))
          const label =
            `${p.title ? p.title + '. ' : ''}${pts.length} points, ${yLabel} against ${xLabel}.` +
            fits[pi]
              .filter(Boolean)
              .map((f) => ` ${groupOf(f!.id)?.label ?? 'Fit'}: R squared ${f!.r2.toFixed(3)}.`)
              .join('')
          return (
            <figure key={pi} className="m-0 min-w-0">
              {p.title && <figcaption className="text-body-sm font-semibold">{inline(p.title)}</figcaption>}
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full min-w-[20rem]" role="img" aria-label={label}>
                  {ax.y.ticks.map((v) => (
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
                  {ax.x.ticks.map((v) => (
                    <text key={`x${v}`} x={X(v)} y={PAD.top + plotH + 15} textAnchor="middle" {...CHART_TEXT} opacity={0.8}>
                      {fmt(v)}
                    </text>
                  ))}

                  {diagonal && (
                    <line
                      x1={X(Math.max(ax.x.min, ax.y.min))}
                      y1={Y(Math.max(ax.x.min, ax.y.min))}
                      x2={X(Math.min(ax.x.max, ax.y.max))}
                      y2={Y(Math.min(ax.x.max, ax.y.max))}
                      stroke={SITE_PALETTE.stoneDark}
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                    />
                  )}

                  {references.map((r) =>
                    r.axis === 'y' ? (
                      <g key={r.label}>
                        <line
                          x1={PAD.left}
                          x2={VW - PAD.right}
                          y1={Y(r.value)}
                          y2={Y(r.value)}
                          stroke={SITE_PALETTE.shadow}
                          strokeWidth={1.5}
                          strokeDasharray="5 4"
                        />
                        {/* Kept well inside the right edge: on a phone the chart
                            scrolls sideways and the last stripe of it is hidden,
                            which would otherwise cut this label in half. */}
                        <text x={VW - PAD.right - 30} y={Y(r.value) - 4} textAnchor="end" {...CHART_TEXT}>
                          {r.label}
                        </text>
                      </g>
                    ) : (
                      <g key={r.label}>
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

                  {fits[pi].map((f) => {
                    if (!f) return null
                    const x0 = clampX(trend === 'origin' ? 0 : ax.x.min)
                    const x1 = ax.x.max
                    // Clip the line to the plot so a steep fit does not run off the top.
                    const yAt = (x: number) => f.slope * x + f.intercept
                    const inside = (x: number) => yAt(x) >= ax.y.min && yAt(x) <= ax.y.max
                    let xa = x0
                    let xb = x1
                    if (!inside(xb) && f.slope !== 0) xb = ((f.slope > 0 ? ax.y.max : ax.y.min) - f.intercept) / f.slope
                    if (!inside(xa) && f.slope !== 0) xa = ((f.slope > 0 ? ax.y.min : ax.y.max) - f.intercept) / f.slope
                    return (
                      <line
                        key={`fit${f.id}`}
                        x1={X(clampX(xa))}
                        y1={Y(yAt(clampX(xa)))}
                        x2={X(clampX(xb))}
                        y2={Y(yAt(clampX(xb)))}
                        stroke={colourOf(f.id)}
                        strokeWidth={2}
                        strokeDasharray="8 4"
                      />
                    )
                  })}

                  {pts.map((q, i) => (
                    <Marker key={i} shape={groupOf(q.group)?.shape} x={X(q.x)} y={Y(q.y)} fill={colourOf(q.group)} />
                  ))}
                  {pts
                    .filter((q) => q.label)
                    .map((q, i) => {
                      const placed = q.labelDx !== undefined || q.labelDy !== undefined
                      // A label on the right of a point near the right edge is
                      // cut off by the frame, so it goes on the left instead.
                      const width = (q.label?.length ?? 0) * 5.2
                      const at =
                        q.labelAt ?? (X(q.x) + 7 + width > VW - PAD.right / 2 ? 'left' : 'right')
                      const dx = placed ? q.labelDx ?? 0 : at === 'left' ? -7 : at === 'right' ? 7 : 0
                      const dy = placed ? q.labelDy ?? 0 : at === 'above' ? -8 : at === 'below' ? 14 : 3.5
                      // A hand-placed label far from its point needs a line to
                      // it, or the reader cannot tell which point it names.
                      const leader = placed && Math.hypot(dx, dy) > 16
                      const anchor = placed ? (dx < -2 ? 'end' : dx > 2 ? 'start' : 'middle') : at === 'left' ? 'end' : at === 'right' ? 'start' : 'middle'
                      /*
                       * Keep the whole label inside the plot. A point near an
                       * edge would otherwise have its name cut in half by the
                       * frame, which is worse than having it sit slightly off
                       * centre over its marker.
                       */
                      const half = anchor === 'middle' ? width / 2 : 0
                      const left = X(q.x) + dx - (anchor === 'end' ? width : half)
                      const right = X(q.x) + dx + (anchor === 'start' ? width : half)
                      const nudge =
                        right > VW - PAD.right ? VW - PAD.right - right : left < PAD.left ? PAD.left - left : 0
                      return (
                        <g key={`l${i}`}>
                          {leader && (
                            <line
                              x1={X(q.x) + Math.sign(dx) * 4}
                              y1={Y(q.y) + Math.sign(dy) * 4}
                              x2={X(q.x) + dx - Math.sign(dx) * 2}
                              y2={Y(q.y) + dy - 3}
                              stroke={SITE_PALETTE.stoneDark}
                              strokeWidth={1}
                            />
                          )}
                          <text
                            x={X(q.x) + dx + nudge}
                            y={Y(q.y) + dy}
                            textAnchor={anchor}
                            stroke={SITE_PALETTE.bushHi}
                            strokeWidth={3.5}
                            strokeLinejoin="round"
                            paintOrder="stroke"
                            {...CHART_TEXT}
                          >
                            {q.label}
                          </text>
                        </g>
                      )
                    })}

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
              {fits[pi].some(Boolean) && (
                <p className="mt-1 text-note">
                  {fits[pi]
                    .filter(Boolean)
                    .map(
                      (f) =>
                        `${groups.length ? groupOf(f!.id)?.label + ': ' : ''}fitted slope ${fmt(f!.slope)}, R² ${f!.r2.toFixed(3)}`,
                    )
                    .join('. ')}
                </p>
              )}
            </figure>
          )
        })}
      </div>

      <p className="mt-1 text-note">{yLabel}</p>

      {groups.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-note">
          {groups.map((g) => (
            <li key={g.id} className="flex items-center gap-1.5">
              <svg aria-hidden width={12} height={12} className="shrink-0">
                <Marker shape={g.shape} x={6} y={6} fill={colourOf(g.id)} />
              </svg>
              {g.label}
            </li>
          ))}
        </ul>
      )}

      {footnote && <p className="mt-3 text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>}
    </section>
  )
}
