import type { Milestone } from '../content/timeline'

/**
 * The wet lab's milestones as a connected track: left to right on a laptop,
 * top to bottom on a phone.
 *
 * The line is one element behind the markers rather than a border on each
 * card, so it joins marker to marker however many there are: the inset is half
 * a column at each end, which is where the first and last markers sit.
 *
 * Status is never carried by the marker alone. A finished milestone is filled
 * and says "complete"; one that has not started is hollow and dashed and says
 * "planned", so the difference survives a greyscale print and a screen reader.
 */
export default function MilestoneTrack({ milestones }: { milestones: Milestone[] }) {
  const half = 50 / milestones.length

  return (
    <ol className="relative flex flex-col gap-5 lg:flex-row lg:gap-4">
      {/* The joining line, behind the markers. Laptop only: on a phone each
          item draws its own, because the cards are different heights. */}
      <span
        aria-hidden
        className="absolute hidden h-[3px] bg-leaf-300 lg:block"
        style={{ left: `${half}%`, right: `${half}%`, top: 7 }}
      />

      {milestones.map((m, i) => {
        const done = m.status === 'done'
        return (
          <li key={m.title} className="relative flex gap-3 lg:flex-1 lg:flex-col lg:gap-0">
            {/* marker, and the joining line on a phone */}
            <div className="relative flex w-4 shrink-0 justify-center lg:mb-3 lg:w-auto lg:justify-start">
              {i < milestones.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-4 w-[3px] -translate-x-1/2 bg-leaf-300 lg:hidden"
                  style={{ height: 'calc(100% + 1.25rem)' }}
                />
              )}
              <span
                aria-hidden
                className={
                  'relative mt-1 block h-4 w-4 rounded-sm border-[3px] border-leaf-700 lg:mt-0 ' +
                  (done ? 'bg-leaf-700' : 'border-dashed bg-leaf-50')
                }
              />
            </div>

            <div className="panel flex min-w-0 flex-1 flex-col px-3 py-3">
              <span className="badge">{m.date}</span>
              <h3 className="mt-2 text-base leading-tight">{m.title}</h3>
              <p className="mt-2 text-body-sm leading-snug lg:text-note">{m.body}</p>
              <p
                className={
                  'pixel mt-3 self-start rounded-sm px-1.5 text-tag tracking-wide lg:mt-auto lg:pt-3 ' +
                  (done ? 'bg-leaf-200 text-leaf-950' : 'border-2 border-dashed border-leaf-400 text-leaf-800')
                }
              >
                {done ? 'complete' : 'planned'}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
