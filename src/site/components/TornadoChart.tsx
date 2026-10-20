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
 * The bars themselves are hidden from assistive technology and each row's name
 * and number are plain text, so the chart reads as a list of values whether or
 * not the stylesheet arrives.
 */

/** Room kept clear at each end of the axis for the bars' own numbers. */
const GUTTER = '3.25rem'

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
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

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
          const positive = r.value >= 0
          /*
           * How far along its half of the track this bar runs. The half is
           * shortened by a fixed gutter so the longest bar still has room for
           * its own number beyond the tip: every number then sits outside its
           * bar, in the same relationship to it, at any width. Shortening in
           * `rem` rather than in percent keeps all the bars on one linear
           * scale, so their lengths stay comparable.
           */
          const len = `calc(${(Math.abs(r.value) / max).toFixed(4)} * (50% - ${GUTTER}))`
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
                  style={positive ? { left: '50%', width: len } : { right: '50%', width: len }}
                />
                {/* The value sits just past the tip of its bar, always on the
                    outside. The vertical centring rides on the `translate`
                    property and never on `transform`: a Tailwind translate
                    utility sets `translate`, so mixing the two applies both
                    and the number drifts off the top of its bar. */}
                <span
                  className="numeral absolute top-1/2 px-1.5 text-[0.7rem]"
                  style={{
                    ...(positive
                      ? { left: `calc(50% + ${len})` }
                      : { right: `calc(50% + ${len})` }),
                    translate: '0 -50%',
                  }}
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

      {footnote && <p className="mt-3 text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
