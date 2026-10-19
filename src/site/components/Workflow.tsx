import { useState } from 'react'
import RichText, { inline } from './RichText'

/**
 * A short workflow as a row of stages. Click a stage to read it. The first is
 * open on load so the shape is obvious without clicking anything.
 *
 * The stage you picked reads ABOVE the row rather than below it, so choosing a
 * later stage does not push its own text off the bottom of a small screen.
 */
export interface WorkflowStage {
  title: string
  body: string[]
}

export default function Workflow({
  heading,
  intro,
  stages,
  footnote,
  source,
}: {
  heading?: string
  intro?: string
  stages: WorkflowStage[]
  footnote?: string
  source?: string
}) {
  const [open, setOpen] = useState(0)

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div id="workflow-stage" className="panel-flat mt-4 px-5 py-4" aria-live="polite">
        <h3 className="text-lg">{stages[open].title}</h3>
        <div className="prose-garden mt-2 text-body-sm">
          <RichText paragraphs={stages[open].body} />
        </div>
      </div>

      <ol className="mt-3 flex flex-wrap items-stretch gap-2">
        {stages.map((stage, i) => (
          <li key={stage.title} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              aria-controls="workflow-stage"
              className={
                'flex items-center gap-2 rounded-sm border-[3px] px-3 py-2 text-left text-sm font-semibold transition-colors ' +
                (open === i
                  ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                  : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
              }
            >
              <span className="badge">{i + 1}</span>
              {stage.title}
            </button>
            {i < stages.length - 1 && (
              <span aria-hidden className="pixel text-leaf-800">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      {footnote && <p className="mt-3 text-body-sm leading-relaxed text-leaf-800">{inline(footnote)}</p>}
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
