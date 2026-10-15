import { useEffect, useRef, useState } from 'react'
import DataTable, { type TableData } from './DataTable'
import RichText, { inline } from './RichText'

/**
 * A strategy told in stages, one open at a time, with a rail beside it.
 *
 * Every stage's heading is always visible; its text shows only when it is
 * open, and the stage the team is at opens first. The rail lists the stages,
 * marks the open one, and draws a "we are here" line between what is done
 * and what is planned. The same line is drawn in the stage list itself, so
 * a phone reader (who has no rail) still sees where past turns to future.
 */
export interface Stage {
  title: string
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
  const refs = useRef<(HTMLElement | null)[]>([])
  // Set by the rail: scroll to the stage once it has opened. Opening one
  // stage closes another, which moves everything below it, so the scroll
  // has to wait for that layout rather than measure the old one.
  const scrollTo = useRef<number | null>(null)

  useEffect(() => {
    if (scrollTo.current === null) return
    refs.current[scrollTo.current]?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    scrollTo.current = null
  }, [open])

  const show = (i: number) => {
    scrollTo.current = i
    setOpen(i)
  }

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
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-5 gap-6 md:grid md:grid-cols-[1fr_11rem]">
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
                  ref={(el) => {
                    refs.current[i] = el
                  }}
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
                      <span className="min-w-0 flex-1 text-base font-semibold leading-snug">{stage.title}</span>
                      {done && <span className="pixel shrink-0 text-[0.6rem] text-leaf-800">done</span>}
                      {!done && hereAt >= 0 && i > hereAt && <span className="pixel shrink-0 text-[0.6rem] text-leaf-800">planned</span>}
                      <span aria-hidden className="pixel shrink-0 text-xs text-leaf-800">
                        {isOpen ? '▴' : '▾'}
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

        <nav aria-label="Stages" className="hidden md:block">
          <ol className="sticky top-24 flex flex-col gap-1.5">
            {stages.map((stage, i) => (
              <li key={stage.title} className="flex flex-col gap-1.5">
                {i === hereAt && <HereLine small />}
                <button
                  type="button"
                  onClick={() => show(i)}
                  aria-current={i === open ? 'step' : undefined}
                  className={
                    'flex items-start gap-2 rounded-sm border-[3px] px-2 py-1.5 text-left text-xs leading-snug transition-colors ' +
                    (i === open
                      ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                      : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
                  }
                >
                  <span className="pixel shrink-0 text-[0.6rem] text-leaf-800">{i + 1}</span>
                  <span>{stage.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
