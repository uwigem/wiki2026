import { inline } from './RichText'

/**
 * A bench procedure: numbered steps, in groups with their own subheadings.
 *
 * Protocols are followed at a bench with gloves on, usually one line at a
 * time, so the steps are numbered and each group starts again at one, the way
 * the lab's own documents are written. Nothing here is a card or a grid: the
 * reading order is the order the work happens in, and a two-column layout
 * would break it.
 */

export interface ProcedureGroup {
  /** The subheading, for example "Transfection (day 0)". */
  title?: string
  steps: string[]
  /** A line after the steps: a caution, or what the group leaves you with. */
  note?: string
}

export default function Procedure({
  heading,
  intro,
  groups,
  source,
}: {
  heading?: string
  intro?: string
  groups: ProcedureGroup[]
  source?: string
}) {
  return (
    <section className="min-w-0">
      {heading && <h3 className="text-lg">{heading}</h3>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="flex flex-col gap-5">
        {groups.map((group, g) => (
          <div key={g} className={g === 0 && !heading && !intro ? '' : 'mt-1'}>
            {group.title && <h4 className="text-base font-semibold text-leaf-950">{group.title}</h4>}
            <ol className="mt-2 flex flex-col gap-2">
              {group.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="badge mt-0.5 shrink-0">{i + 1}</span>
                  <span className="min-w-0 pt-0.5 text-body-sm leading-relaxed">{inline(step)}</span>
                </li>
              ))}
            </ol>
            {group.note && <p className="mt-2 text-note leading-relaxed text-leaf-800">{inline(group.note)}</p>}
          </div>
        ))}
      </div>

      {source && <p className="mt-3 text-note text-leaf-800">{inline(source)}</p>}
    </section>
  )
}
