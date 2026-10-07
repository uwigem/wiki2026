/**
 * A row of figures that carry an argument.
 *
 * Used where a few numbers make a point faster than a paragraph: how large the
 * GPCR drug market is, against how many drugs target a ciliary one. The numbers
 * are set in the body font with tabular figures, not the pixel face, because
 * Pixelify Sans renders 0 and 8 close enough to be misread, and a misread
 * statistic is an error rather than a style.
 *
 * One item can be marked as the point being made. That one gets the emphasis,
 * so the row reads as an argument rather than as four unrelated facts.
 */

import { inline } from './RichText'

export interface Stat {
  value: string
  label: string
  /** Optional source or qualifier, set small under the label. */
  note?: string
  /** The figure the row exists to deliver. */
  emphasis?: boolean
}

interface Props {
  heading?: string
  intro?: string
  items: Stat[]
  /** Sentence under the row, for the "so what". */
  footnote?: string
  source?: string
}

export default function StatRow({ heading, intro, items, footnote, source }: Props) {
  return (
    <section className="panel px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <div
            key={s.label}
            className={
              'flex flex-col px-4 py-3 ' +
              (s.emphasis
                ? 'border-[3px] border-leaf-700 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                : 'panel-flat')
            }
          >
            <dd className="numeral order-1 text-3xl leading-none sm:text-4xl">{s.value}</dd>
            <dt className="order-2 mt-2 text-body-sm leading-snug">{s.label}</dt>
            {s.note && <p className="order-3 mt-1 text-note text-leaf-800">{s.note}</p>}
          </div>
        ))}
      </dl>

      {footnote && <p className="mt-4 max-w-2xl text-body-sm leading-relaxed">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
