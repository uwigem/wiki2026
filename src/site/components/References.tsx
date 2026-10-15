/**
 * A numbered reference list for the section above it. Every entry carries a
 * link that resolves (a DOI or a stable URL), which is what lets a judge check
 * a claim rather than take it on trust. The numbers match the `[n]` markers in
 * the text of that section.
 */
export interface Reference {
  /** The marker used in the text, for example "3" or "3.1". */
  n: string
  text: string
  /** Where to read it. A DOI link where one exists. */
  href?: string
}

export default function References({ heading = 'References', items }: { heading?: string; items: Reference[] }) {
  return (
    <section className="panel-flat px-5 py-4 sm:px-7 sm:py-5">
      <h2 className="kicker">{heading}</h2>
      <ol className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-leaf-800">
        {items.map((r) => (
          <li key={r.n} className="flex gap-2">
            <span className="pixel shrink-0 text-[0.65rem] text-leaf-800">[{r.n}]</span>
            <span className="min-w-0">
              {r.text}{' '}
              {r.href && (
                <a href={r.href} target="_blank" rel="noreferrer noopener" className="cross-link break-all">
                  {r.href.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
