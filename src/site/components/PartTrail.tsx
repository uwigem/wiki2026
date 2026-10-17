import { Link } from '../router'

/**
 * Where you are in a page that runs in numbered parts.
 *
 * A page told as "part one, then part two, then part three" needs to answer
 * one question at every scroll position: which part is this. The section
 * signboard answers it only while it is on screen, and the outline in the
 * margin is not there below a wide window. So each part opens with this: the
 * whole run of parts, the current one marked, the others as links.
 *
 * It is an ordered list of links rather than a progress bar, because the parts
 * are places a reader may want to jump to, not a task being completed. The
 * current step is a span and not a link, and carries `aria-current`, so a
 * screen reader is told where it is rather than offered a link to here.
 */
export interface TrailStep {
  label: string
  /** Where this part begins, for example `/engineering#kinetics`. */
  to: string
}

export default function PartTrail({
  steps,
  current,
  label = 'Where you are',
}: {
  steps: TrailStep[]
  /** Zero-based index of the part this trail is sitting at the top of. */
  current: number
  label?: string
}) {
  return (
    <nav aria-label={label} className="min-w-0">
      <ol className="-mx-1 flex items-stretch gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {steps.map((s, i) => {
          const here = i === current
          const done = i < current
          const body = (
            <>
              <span
                aria-hidden
                className={
                  'numeral shrink-0 rounded-sm border-2 px-1.5 text-[0.7rem] leading-snug ' +
                  (here
                    ? 'border-leaf-50 text-leaf-50'
                    : 'border-leaf-700 text-leaf-800')
                }
              >
                {i + 1}
              </span>
              <span className="truncate">{s.label}</span>
            </>
          )
          const shape =
            'flex items-center gap-2 rounded-sm border-[3px] px-2.5 py-1.5 text-body-sm leading-tight whitespace-nowrap'
          return (
            <li key={s.to} className="flex min-w-0 items-center gap-1.5">
              {here ? (
                <span
                  aria-current="step"
                  className={
                    shape +
                    ' border-leaf-800 bg-leaf-700 font-semibold text-leaf-50 shadow-[3px_3px_0_var(--p-shadow)]'
                  }
                >
                  {body}
                </span>
              ) : (
                <Link
                  to={s.to}
                  className={
                    shape +
                    ' border-leaf-700 bg-leaf-50 text-leaf-900 hover:bg-leaf-100 ' +
                    (done ? 'opacity-80' : '')
                  }
                >
                  {body}
                </Link>
              )}
              {i < steps.length - 1 && (
                <span aria-hidden className="pixel select-none text-leaf-700">
                  ›
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
