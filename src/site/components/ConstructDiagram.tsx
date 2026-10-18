import { DOMAIN_ROLES, type ConstructGroup, type DomainRole } from '../content/constructs'
import { inline } from './RichText'

/**
 * Genetic constructs, drawn as a row of labelled domains each.
 *
 * Built from HTML rather than drawn, for the same reason the other figures put
 * their words in HTML over the picture: text that the browser lays out stays
 * sharp at any size, wraps when the screen is narrow, can be selected and
 * searched, and is read out in order by a screen reader. A drawn version would
 * need its labels to be legible at 375px wide, which is where diagrams of this
 * kind usually fail.
 *
 * Colour carries one meaning only, which role a domain plays, so the same kind
 * of part is the same colour in every construct and across both diagrams. The
 * legend under each diagram says what the colours mean, and no information is
 * carried by colour alone: every block is labelled.
 *
 * Domain widths are not to scale.
 */

const CHIP: Record<DomainRole, string> = {
  receptor: 'bg-petal-blue',
  machinery: 'bg-petal-lilac',
  recruitment: 'bg-petal-pink',
  marker: 'bg-petal-daisy',
  tag: 'bg-leaf-200',
  other: 'bg-petal-cream',
}

function Chip({ label, note, role }: { label: string; note?: string; role: DomainRole }) {
  return (
    <span
      className={
        'flex min-w-0 flex-col items-center justify-center rounded-sm border-2 border-leaf-700 px-2 py-1 text-center leading-tight ' +
        CHIP[role]
      }
    >
      <span className="text-body-sm text-leaf-950">{label}</span>
      {note && <span className="text-note text-leaf-900">{note}</span>}
    </span>
  )
}

export default function ConstructDiagram({
  heading,
  intro,
  groups,
  footnote,
  source,
}: {
  heading?: string
  intro?: string
  groups: ConstructGroup[]
  footnote?: string
  source?: string
}) {
  return (
    // `min-w-0` because this is a flex item: without it the widest construct
    // row would push the whole page sideways instead of wrapping.
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-5 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="pixel text-base text-leaf-950">{group.name}</h3>
            {group.blurb && (
              <p className="mt-1 max-w-2xl text-body-sm leading-relaxed text-leaf-900">{inline(group.blurb)}</p>
            )}

            <ul className="mt-3 grid gap-3 lg:grid-cols-2">
              {group.constructs.map((c) => (
                <li
                  key={c.name}
                  className="rounded-sm border-[3px] border-leaf-300 bg-leaf-50 px-3 py-3 shadow-[3px_3px_0_var(--p-shadow)]"
                >
                  {/* The fusion in order, for anyone who cannot see the blocks.
                      The blocks themselves are decoration once this is read. */}
                  <span className="sr-only">
                    {c.name}
                    {c.purpose ? `. ${c.purpose}.` : '.'}
                  </span>
                  <div aria-hidden className="flex flex-wrap items-stretch gap-1.5">
                    {c.domains.map((d, i) => (
                      <Chip key={i} label={d.label} note={d.note} role={d.role} />
                    ))}
                  </div>
                  {c.purpose && (
                    <p aria-hidden className="mt-2 text-note leading-snug text-leaf-800">
                      {c.purpose}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t-2 border-dashed border-leaf-300 pt-3 text-note">
        {DOMAIN_ROLES.map(({ role, label }) => (
          <li key={role} className="flex items-center gap-1.5">
            <span aria-hidden className={'inline-block h-3 w-5 border-2 border-leaf-700 ' + CHIP[role]} />
            {label}
          </li>
        ))}
      </ul>

      {footnote && <p className="mt-3 text-body-sm leading-relaxed text-leaf-900">{inline(footnote)}</p>}
      {source && <p className="mt-3 text-note text-leaf-800">{source}</p>}
    </section>
  )
}
