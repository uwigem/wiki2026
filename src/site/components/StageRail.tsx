import { useState } from 'react'
import DataTable, { type TableData } from './DataTable'
import RichText, { inline } from './RichText'

/**
 * A strategy told in stages, one open at a time.
 *
 * Every stage's heading is always visible; its text shows only when it is
 * open, and the stage the team is at opens first. A "we are here" line sits
 * between what is done and what is planned. There is no second list of the
 * stages beside it: the page already has a section list in the margin, and
 * two sticky lists side by side read as clutter.
 */
export interface Stage {
  title: string
  /** A date or other short tag, shown beside the title while it is collapsed. */
  meta?: string
  body: string[]
  /** A table inside the stage, for example the dissemination pathways. */
  table?: TableData
  /** This stage is where the team is now: the line is drawn above it. */
  here?: boolean
}

export default function StageRail({
  heading,
  intro,
  stages,
  hereLabel = 'we are here',
  source,
}: {
  heading?: string
  intro?: string
  stages: Stage[]
  hereLabel?: string
  source?: string
}) {
  const hereAt = stages.findIndex((s) => s.here)
  const [open, setOpen] = useState(hereAt >= 0 ? hereAt : 0)

  const HereLine = ({ small }: { small?: boolean }) => (
    <div className="flex items-center gap-2" aria-label={hereLabel}>
      <span className="h-[3px] flex-1 bg-petal-daisy" />
      <span className={'pixel text-petal-daisy ' + (small ? 'text-[0.6rem]' : 'text-xs')}>{hereLabel}</span>
      <span className="h-[3px] flex-1 bg-petal-daisy" />
    </div>
  )

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-5">
        <ol className="flex min-w-0 flex-col gap-2">
          {stages.map((stage, i) => {
            const isOpen = i === open
            const done = hereAt >= 0 && i < hereAt
            return (
              <li key={stage.title} className="flex flex-col gap-2">
                {i === hereAt && (
                  <div className="my-2">
                    <HereLine />
                  </div>
                )}
                <section
                  className={'rounded-sm border-[3px] ' + (isOpen ? 'border-leaf-700 bg-leaf-50' : 'border-leaf-300 bg-leaf-50')}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className="badge shrink-0">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        {/* A long single word (a stage called "conceptualisation")
                            would otherwise run out of its box and under the
                            status label beside it on a narrow screen. */}
                        <span className="block break-words text-base font-semibold leading-snug">
                          {stage.title}
                        </span>
                        {stage.meta && <span className="pixel block text-note text-leaf-800">{stage.meta}</span>}
                      </span>
                      {done && <span className="pixel shrink-0 text-note text-leaf-800">done</span>}
                      {!done && hereAt >= 0 && i > hereAt && <span className="pixel shrink-0 text-note text-leaf-800">planned</span>}
                      {/* The whole heading is the button, so on a phone this
                          pill is dropped: it is decoration, and the room it
                          takes was breaking long titles mid-word. */}
                      <span aria-hidden className="pixel-btn hidden shrink-0 py-1 text-xs sm:inline-block">
                        {isOpen ? 'Hide' : 'Show'}
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="border-t-2 border-leaf-300 px-4 pb-4 pt-3">
                      <div className="prose-garden text-body">
                        <RichText paragraphs={stage.body} />
                      </div>
                      {stage.table && (
                        <div className="mt-3 -mx-1">
                          <DataTable columns={stage.table.columns} rows={stage.table.rows} />
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </li>
            )
          })}
        </ol>

      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
