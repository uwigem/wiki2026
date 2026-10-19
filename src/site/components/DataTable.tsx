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

export default function DataTable({
  heading,
  intro,
  columns,
  rows,
  caption,
  source,
}: TableData & {
  heading?: string
  intro?: string
  /** One line under the table saying what it shows. */
  caption?: string
  source?: string
}) {
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
                    <td key={c} className="px-3 py-2.5">
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
            {row.slice(1).map((cell, c) => (
              <p key={c} className="mt-2 text-body-sm leading-relaxed">
                <span className="kicker mr-1.5 normal-case">{columns[c + 1]}</span>
                {inline(cell)}
              </p>
            ))}
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
