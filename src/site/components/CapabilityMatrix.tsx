/**
 * What existing tools can and cannot do, side by side.
 *
 * This is the single most load-bearing figure in Human Practices: the whole
 * case for the project is that no row before the last one has a mark in every
 * column. Built as a real table so that is still true when it is read aloud,
 * printed, or opened with styles off.
 *
 * Marks are never carried by colour or by glyph alone. Each cell holds a
 * visually hidden word, so a screen reader hears "strong" or "none" rather
 * than a tick character, and the three levels differ in shape as well as in
 * fill for anyone who cannot separate the colours.
 */

import { inline } from './RichText'

export type Level = 'full' | 'partial' | 'none'

export interface MatrixRow {
  label: string
  levels: Level[]
  /** Draws the row as the conclusion rather than as another comparator. */
  isGoal?: boolean
}

interface Props {
  heading?: string
  intro?: string
  columns: string[]
  rows: MatrixRow[]
  source?: string
}

const WORD: Record<Level, string> = {
  full: 'strong capability',
  partial: 'partial capability',
  none: 'no capability',
}

function Mark({ level }: { level: Level }) {
  const base = 'inline-flex h-6 w-6 items-center justify-center border-2 text-sm leading-none'
  const style =
    level === 'full'
      ? 'rounded-full border-leaf-800 bg-pool-400'
      : level === 'partial'
        ? 'rounded-sm border-leaf-700 bg-petal-cream'
        : 'rounded-sm border-leaf-400 bg-leaf-100'
  return (
    <>
      <span aria-hidden className={`${base} ${style}`}>
        {level === 'full' ? '✓' : level === 'partial' ? '–' : ''}
      </span>
      <span className="sr-only">{WORD[level]}</span>
    </>
  )
}

export default function CapabilityMatrix({ heading, intro, columns, rows, source }: Props) {
  return (
    // `min-w-0` is load bearing. This section is a flex item, and a flex item
    // defaults to min-width:auto, which refuses to shrink below its content.
    // Without it the wide table pushes the whole PAGE sideways on a phone
    // instead of scrolling inside its own box below.
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      {/* The table is wider than a phone. It scrolls inside this box rather
          than making the whole page scroll sideways. `relative` matters: the
          screen-reader labels in the cells are absolutely positioned, and
          without a positioned box here they escape the scroll and widen the
          page. */}
      <div className="relative mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            Capability of existing tools against the four things a ciliary tool needs to do
          </caption>
          <thead>
            <tr>
              <th scope="col" className="pixel border-b-[3px] border-leaf-700 pb-2 pr-3 text-tag">
                tool
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="pixel border-b-[3px] border-leaf-700 px-2 pb-2 text-center text-tag"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={row.isGoal ? 'bg-leaf-200' : undefined}>
                <th
                  scope="row"
                  className={
                    'border-b-2 border-leaf-300 py-2 pr-3 text-body-sm font-normal ' +
                    (row.isGoal ? 'pixel text-sm' : '')
                  }
                >
                  {row.label}
                </th>
                {row.levels.map((lv, i) => (
                  <td key={columns[i]} className="border-b-2 border-leaf-300 px-2 py-2 text-center">
                    <Mark level={lv} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-note">
        {(['full', 'partial', 'none'] as Level[]).map((lv) => (
          <li key={lv} className="flex items-center gap-1.5">
            <Mark level={lv} />
            <span aria-hidden>{WORD[lv]}</span>
          </li>
        ))}
      </ul>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
