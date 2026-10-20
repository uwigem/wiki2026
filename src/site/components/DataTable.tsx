import type { CSSProperties } from 'react'
import { inline } from './RichText'

/**
 * A table of text. Cells take the same inline formatting as body copy, so a
 * cell can link to another page.
 *
 * On a laptop it is a table. On a phone the same rows become a stack of
 * cards, one per row, with the column name before each value, because a
 * four-column table of sentences scrolled sideways is unreadable and a judge
 * on a phone would skip it.
 */
export interface TableData {
  columns: string[]
  rows: string[][]
}

/** A cell's text as a number, or null when it is not one. Accepts a typographic minus. */
function numeric(cell: string): number | null {
  const t = cell.replace(/\u2212/g, '-').replace(/[*`]/g, '').trim()
  return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t) ? Number(t) : null
}

/**
 * Shading for a numeric cell: pink for a positive value and blue for a
 * negative one, the colours the tornado chart uses for the same two
 * directions, deeper as the value grows. Mixed from the palette variables, so
 * the table re-themes with the site.
 */
function shade(v: number | null, maxAbs: number): CSSProperties | undefined {
  if (v === null || v === 0 || maxAbs === 0) return undefined
  const pct = Math.round(Math.min(1, Math.abs(v) / maxAbs) * 85)
  return { background: `color-mix(in srgb, var(--p-${v > 0 ? 'pinkBud' : 'water'}) ${pct}%, transparent)` }
}

export default function DataTable({
  heading,
  intro,
  columns,
  rows,
  caption,
  source,
  heat,
}: TableData & {
  heading?: string
  intro?: string
  /** Shade every number after the first column by its size and sign, like a heat map. */
  heat?: boolean
  /** One line under the table saying what it shows. */
  caption?: string
  source?: string
}) {
  const maxAbs = heat
    ? Math.max(0, ...rows.flatMap((row) => row.slice(1).map((c) => Math.abs(numeric(c) ?? 0))))
    : 0
  const tint = (cell: string) => (heat ? shade(numeric(cell), maxAbs) : undefined)

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-4 hidden md:block">
        <table className="w-full border-collapse text-body-sm leading-relaxed">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col" className="border-b-[3px] border-leaf-700 px-3 py-2 text-left align-bottom text-sm font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-b-2 border-leaf-300 align-top last:border-b-0">
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row" className="px-3 py-2.5 text-left text-sm font-semibold">
                      {inline(cell)}
                    </th>
                  ) : (
                    <td key={c} className={'px-3 py-2.5' + (heat ? ' numeral' : '')} style={tint(cell)}>
                      {inline(cell)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 flex flex-col gap-3 md:hidden">
        {rows.map((row, r) => (
          <li key={r} className="panel-flat px-4 py-3">
            <p className="font-semibold">{inline(row[0])}</p>
            {/* An empty cell says nothing, so it does not get a line of its own
                here: a half-filled table would otherwise become a stack of
                column names with no values after them. */}
            {row.slice(1).map((cell, c) => (cell.trim() === '' ? null : (
              <p key={c} className="mt-2 text-body-sm leading-relaxed">
                <span className="kicker mr-1.5 normal-case">{columns[c + 1]}</span>
                {heat ? (
                  <span className="numeral px-1.5 py-0.5" style={tint(cell)}>
                    {inline(cell)}
                  </span>
                ) : (
                  inline(cell)
                )}
              </p>
            )))}
          </li>
        ))}
      </ul>

      {caption && <p className="mt-3 text-body-sm leading-relaxed text-leaf-800">{inline(caption)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
