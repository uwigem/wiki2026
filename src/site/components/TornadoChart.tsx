import { inline } from './RichText'

/**
 * A tornado plot: which numbers in a model actually move the answer.
 *
 * Bars run left and right from a centre line. Right means turning that
 * parameter up pushes the output up; left means it pushes the output down.
 * Rows are given in the order they are passed, which should be most influential
 * first, because the shape of the plot is the finding: a few long bars at the
 * top and a tail of short ones means most of the model does not matter much.
 *
 * Built out of divs rather than an SVG. Bars are rectangles, and a rectangle
 * sized as a percentage of its container is sharp at any width, reflows on a
 * phone without a viewBox fighting it, and can carry its own text. The only
 * thing drawn is the centre rule.
 *
 * Every bar is also a table row underneath, so the numbers survive a screen
 * reader, a stylesheet failing to load, and being printed.
 */

export interface TornadoRow {
  label: string
  value: number
  /** Optional short note, for example the symbol used in the equations. */
  note?: string
}

interface Props {
  heading?: string
  intro?: string
  rows: TornadoRow[]
  /** What one unit on the axis means, for the caption under the plot. */
  unit?: string
  positiveMeans?: string
  negativeMeans?: string
  footnote?: string
  source?: string
}

export default function TornadoChart({
  heading,
  intro,
  rows,
  unit = 'percent change in the output per one percent change in the parameter',
  positiveMeans = 'pushes it up',
  negativeMeans = 'pushes it down',
  footnote,
  source,
}: Props) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 0.1)

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-note">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-3 w-5 border-2 border-leaf-800 bg-pool-400" />
          {negativeMeans}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-3 w-5 border-2 border-leaf-800 bg-petal-pink" />
          {positiveMeans}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {rows.map((r) => {
          const pct = (Math.abs(r.value) / max) * 50
          const positive = r.value >= 0
          // Past about two thirds of the half-track there is no room left
          // outside the bar for its own number.
          const inside = pct > 32
          return (
            <li key={r.label} className="grid grid-cols-1 gap-x-3 sm:grid-cols-[minmax(0,12rem)_1fr]">
              <span className="text-body-sm leading-tight sm:text-right">
                {r.label}
                {/* The symbol goes on its own line. Run inline, it joins onto
                    the end of the name and reads as part of it. */}
                {r.note && <span className="block text-note opacity-70">{r.note}</span>}
              </span>

              {/* The bar track. The centre rule is a border on a zero-width
                  spacer rather than a background gradient, so it lands on a
                  whole pixel at every width. */}
              <span className="relative block h-6">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-1/2 w-0 border-l-2 border-leaf-700"
                />
                <span
                  aria-hidden
                  className={
                    'absolute top-0.5 bottom-0.5 border-2 border-leaf-800 ' +
                    (positive ? 'bg-petal-pink' : 'bg-pool-400')
                  }
                  style={
                    positive
                      ? { left: '50%', width: `${pct}%` }
                      : { right: '50%', width: `${pct}%` }
                  }
                />
                {/* The value sits just past the end of its bar, unless the bar
                    is long enough that doing so would push the number out of
                    the track and across the row label. Then it goes inside. */}
                <span
                  className={'numeral absolute top-1/2 -translate-y-1/2 px-1.5 text-[0.7rem]'}
                  style={
                    positive
                      ? inside
                        ? { left: `calc(50% + ${pct}%)`, transform: 'translate(-100%, -50%)' }
                        : { left: `calc(50% + ${pct}%)` }
                      : inside
                        ? { right: `calc(50% + ${pct}%)`, transform: 'translate(100%, -50%)' }
                        : { right: `calc(50% + ${pct}%)` }
                  }
                >
                  {r.value > 0 ? '+' : ''}
                  {r.value.toFixed(2)}
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-note">Bar length is {unit}.</p>

      {footnote && <p className="mt-3 max-w-2xl text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
