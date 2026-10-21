import { DOMAIN_ROLES, REGISTRY_PART, registrySlug, type ConstructGroup, type DomainRole } from '../content/constructs'
import { inline } from './RichText'

/**
 * Genetic constructs, each drawn as one bar of butted domain segments.
 *
 * A fusion protein is one chain, so it is drawn as one bar: the segments share
 * edges rather than floating apart, and the bar carries the site's own heavy
 * outline and hard shadow, the way every panel on the wiki does. Labels are
 * real text, which stays sharp at any size, wraps when it has to, and reads in
 * order to a screen reader.
 *
 * Colour says which role a domain plays and nothing else, so the same kind of
 * part is the same colour in every construct. Nothing is carried by colour
 * alone: every segment is labelled, and the legend under the diagram names the
 * roles.
 *
 * Segment widths are even, and are not to scale.
 *
 * A construct we registered carries a link to its entry on the iGEM Registry,
 * under the bar. The link is outside the `aria-hidden` wrapper the bar sits
 * in, so it can be reached from the keyboard and read out, and the part name
 * is in the spoken description as well.
 */

/**
 * One fill per role. Kept quiet on purpose: the receptor, the machinery and
 * the recruitment domains are what a reader is tracking across constructs, so
 * the strong colour is saved for the parts we designed ourselves, which appear
 * only in the screening diagram.
 */
const FILL: Record<DomainRole, string> = {
  receptor: 'bg-pool-200',
  machinery: 'bg-petal-lilac',
  recruitment: 'bg-petal-cream',
  marker: 'bg-petal-daisy',
  tag: 'bg-leaf-200',
  other: 'bg-petal-pink',
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
    // `min-w-0` because this is a flex item: without it the widest bar would
    // push the whole page sideways instead of letting its labels wrap.
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-6 flex flex-col gap-7">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="pixel text-base text-leaf-950">{group.name}</h3>
            {group.blurb && (
              <p className="mt-1 text-body-sm leading-relaxed text-leaf-900">{inline(group.blurb)}</p>
            )}

            <ul className="mt-4 flex flex-col gap-5">
              {group.constructs.map((c) => (
                <li key={c.name}>
                  {/* The fusion in order, for anyone who cannot see the bar.
                      The bar itself is decoration once this has been read. */}
                  <span className="sr-only">
                    {c.name}
                    {c.purpose ? `. ${c.purpose}.` : '.'}
                    {c.registry ? ` Registered as ${c.registry}.` : ''}
                  </span>

                  <div aria-hidden>
                    <div className="flex overflow-hidden rounded-sm border-[3px] border-leaf-700 shadow-[4px_4px_0_var(--p-shadow)]">
                      {c.domains.map((d, i) => (
                        <div
                          key={i}
                          className={
                            'flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-2.5 text-center ' +
                            (i > 0 ? 'border-l-[3px] border-leaf-700 ' : '') +
                            FILL[d.role]
                          }
                        >
                          <span className="pixel text-tag leading-tight text-leaf-950 sm:text-sm">{d.label}</span>
                          {d.note && (
                            <span className="mt-0.5 text-note leading-tight text-leaf-900">{d.note}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {c.purpose && (
                      <p className="mt-1.5 text-note leading-snug text-leaf-800">{c.purpose}</p>
                    )}
                  </div>

                  {c.registry && (
                    <p className="mt-1 text-note leading-snug">
                      <a
                        href={REGISTRY_PART + registrySlug(c.registry)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="cross-link"
                      >
                        {c.registry} on the iGEM Registry &#8599;
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t-2 border-dashed border-leaf-300 pt-3 text-note">
        {DOMAIN_ROLES.map(({ role, label }) => (
          <li key={role} className="flex items-center gap-1.5">
            <span aria-hidden className={'inline-block h-3 w-5 border-2 border-leaf-700 ' + FILL[role]} />
            {label}
          </li>
        ))}
      </ul>

      {footnote && <p className="mt-3 text-body-sm leading-relaxed text-leaf-900">{inline(footnote)}</p>}
      {source && <p className="mt-3 text-note text-leaf-800">{inline(source)}</p>}
    </section>
  )
}
