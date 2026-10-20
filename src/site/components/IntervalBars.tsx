import { SITE_PALETTE } from '../theme'
import { fmt, ink, makeAxis, type PaletteKey } from './chartKit'
import { inline } from './RichText'

/**
 * Bars with an uncertainty whisker on each: sensitivity indices with their
 * confidence intervals, one or more numbers per row (a Sobol first-order index
 * beside its total-order index), most important row first.
 *
 * Built out of divs, like `TornadoChart`, so the bars stay sharp and reflow on
 * a phone. The whisker is the point of the chart as much as the bar: where it
 * crosses zero, the number cannot be told apart from nothing, and the text
 * often says exactly that.
 */

/** Room kept clear at the right of the track for the numbers. */
const GUTTER = '3rem'

export interface IntervalValue {
  value: number
  /** Half-width of the interval, so the whisker runs from value - conf to value + conf. */
  conf?: number
  /** Or the two ends of the interval, when it is not symmetric. */
  low?: number
  high?: number
}

export interface IntervalRow {
  label: string
  /** Optional short note under the name, for example the symbol in the equations. */
  note?: string
  /** One per series, in the order the series are listed. */
  values: IntervalValue[]
}

export interface IntervalSeries {
  label: string
  /** Bar fill, as a palette name. Defaults keep to the light fills the tornado chart uses. */
  colour?: PaletteKey
}

interface Props {
  heading?: string
  intro?: string
  series: IntervalSeries[]
  rows: IntervalRow[]
  /** What the axis measures, printed under it. */
  axisLabel: string
  min?: number
  max?: number
  /** Decimal places for the printed values. */
  digits?: number
  footnote?: string
  source?: string
}

const FILLS: PaletteKey[] = ['water', 'pinkBud', 'lilacPetal', 'daisyCore']

const ends = (v: IntervalValue): [number, number] => [
  v.low ?? (v.conf !== undefined ? v.value - v.conf : v.value),
  v.high ?? (v.conf !== undefined ? v.value + v.conf : v.value),
]

export default function IntervalBars({
  heading,
  intro,
  series,
  rows,
  axisLabel,
  min,
  max,
  digits = 3,
  footnote,
  source,
}: Props) {
  const all = rows.flatMap((r) => r.values.flatMap((v) => [v.value, ...ends(v)]))
  const lo = Math.min(0, ...all)
  const hi = Math.max(0, ...all)
  /*
   * A slightly negative estimate (an index that is zero within its error)
   * should not cost the chart a whole tick step of empty track on the left,
   * so the scale then starts just below that value instead of a round number.
   */
  const nearZero = lo < 0 && -lo < 0.06 * hi && min === undefined
  const axis = makeAxis(nearZero ? 0 : lo, hi, { min, max })
  const d0 = nearZero ? lo * 1.15 : axis.min
  const d1 = axis.max
  const ticks = axis.ticks.filter((t) => t >= d0 && t <= d1)
  const pos = (v: number) => `calc(${((Math.min(d1, Math.max(d0, v)) - d0) / (d1 - d0)).toFixed(4)} * (100% - ${GUTTER}))`
  const zero = pos(0)
  const fill = (i: number) => ink(series[i]?.colour ?? FILLS[i % FILLS.length])
  const barH = series.length > 1 ? 'h-3.5' : 'h-5'

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      {series.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-note">
          {series.map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-3 w-5 border-2 border-leaf-800" style={{ background: fill(i) }} />
              {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="relative inline-block h-3 w-5">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-leaf-800" />
              <span className="absolute inset-y-0 left-0 border-l-2 border-leaf-800" />
              <span className="absolute inset-y-0 right-0 border-l-2 border-leaf-800" />
            </span>
            confidence interval
          </span>
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-1 gap-x-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
            {/* A name with no spaces in it, like a pipeline's own file name,
                wraps rather than running across the bars. */}
            <span className="text-body-sm leading-tight break-words sm:self-center sm:text-right">
              {r.label}
              {r.note && <span className="block text-note opacity-70">{r.note}</span>}
            </span>

            <span className="relative flex flex-col gap-0.5 py-0.5">
              {/* Gridlines at the ticks, then the zero rule over them. */}
              {ticks.map((t) => (
                <span
                  key={t}
                  aria-hidden
                  className="absolute inset-y-0 w-0 border-l"
                  style={{ left: pos(t), borderColor: SITE_PALETTE.grass4 }}
                />
              ))}
              <span aria-hidden className="absolute inset-y-0 w-0 border-l-2 border-leaf-700" style={{ left: zero }} />

              {r.values.map((v, i) => {
                const [a, b] = ends(v)
                const neg = v.value < 0
                return (
                  <span key={i} className={'relative block ' + barH}>
                    <span
                      aria-hidden
                      className="absolute inset-y-0 border-2 border-leaf-800"
                      style={{
                        left: neg ? pos(v.value) : zero,
                        width: `calc(${pos(Math.max(v.value, 0))} - ${pos(Math.min(v.value, 0))})`,
                        background: fill(i),
                      }}
                    />
                    {b > a && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 h-2.5 border-x-2 border-leaf-800"
                        style={{ left: pos(a), width: `calc(${pos(b)} - ${pos(a)})`, translate: '0 -50%' }}
                      >
                        <span className="absolute inset-x-0 top-1/2 border-t-2 border-leaf-800" style={{ translate: '0 -50%' }} />
                      </span>
                    )}
                    {/* The number sits past whichever reaches further right, the bar or its whisker. */}
                    <span
                      className="numeral absolute top-1/2 px-1.5 text-[0.7rem] leading-none"
                      style={{ left: pos(Math.max(b, v.value, 0)), translate: '0 -50%' }}
                    >
                      {series.length > 1 && <span className="sr-only">{series[i]?.label}: </span>}
                      {v.value.toFixed(digits)}
                      {v.conf !== undefined && <span className="sr-only">, plus or minus {v.conf.toFixed(digits)}</span>}
                    </span>
                  </span>
                )
              })}
            </span>
          </li>
        ))}
      </ul>

      {/* The axis, in the same two columns as the rows so the ticks line up with the bars. */}
      <div aria-hidden className="mt-1 grid grid-cols-1 gap-x-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
        <span className="hidden sm:block" />
        <span className="relative block h-4 border-t-2 border-leaf-800" style={{ width: `calc(100% - ${GUTTER})` }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="numeral absolute top-0.5 text-[0.7rem]"
              style={{ left: `${(((t - d0) / (d1 - d0)) * 100).toFixed(2)}%`, translate: '-50% 0' }}
            >
              {fmt(t)}
            </span>
          ))}
        </span>
      </div>
      <p className="mt-2 text-note sm:pl-[10.75rem]">{axisLabel}</p>

      {footnote && <p className="mt-3 text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>}
    </section>
  )
}
