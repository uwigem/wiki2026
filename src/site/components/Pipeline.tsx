import { inline } from './RichText'

/**
 * A pipeline read downwards: one card per stage, with what goes in and what
 * comes out, and an arrow to the next one.
 *
 * The `workflow` block is the horizontal version of this idea and shows one
 * stage at a time, which is right for a four-step procedure a reader skims.
 * This is for the opposite case: a chain someone is going to copy and run, so
 * every stage has to be on screen at once, in order, with the thing it hands
 * on named. Nothing is hidden behind a click.
 *
 * The arrow is drawn as a block between cards rather than as a border trick so
 * it survives a phone, where the cards stack anyway and the chain still reads
 * top to bottom.
 */
export interface PipelineStage {
  title: string
  body: string[]
  /** What this stage is handed. */
  input?: string
  /** What it hands on. */
  output?: string
  /** The script that does it, named as it is in the repository. */
  script?: string
  /** Anything worth knowing that is not the main line. */
  note?: string
}

function Flow({ input, output }: { input?: string; output?: string }) {
  if (!input && !output) return null
  return (
    <dl className="mt-3 grid gap-x-4 gap-y-1 border-t-2 border-dashed border-leaf-300 pt-2 text-note sm:grid-cols-2">
      {input && (
        <div className="min-w-0">
          <dt className="kicker">in</dt>
          <dd className="text-leaf-800">{inline(input)}</dd>
        </div>
      )}
      {output && (
        <div className="min-w-0">
          <dt className="kicker">out</dt>
          <dd className="text-leaf-800">{inline(output)}</dd>
        </div>
      )}
    </dl>
  )
}

export default function Pipeline({
  heading,
  intro,
  stages,
  source,
}: {
  heading?: string
  intro?: string
  stages: PipelineStage[]
  source?: string
}) {
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}
      <ol className={'flex flex-col ' + (heading || intro ? 'mt-4' : '')}>
        {stages.map((stage, i) => (
          <li key={stage.title} className="min-w-0">
            <div className="panel-flat min-w-0 px-4 py-4">
              <div className="flex items-baseline gap-2">
                <span className="badge">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-base">{stage.title}</h3>
              </div>
              {stage.script && <p className="kicker mt-1">{stage.script}</p>}
              {stage.body.map((p) => (
                <p key={p} className="mt-2 text-body-sm leading-relaxed">
                  {inline(p)}
                </p>
              ))}
              <Flow input={stage.input} output={stage.output} />
              {stage.note && <p className="mt-2 text-note text-leaf-800">{inline(stage.note)}</p>}
            </div>
            {i < stages.length - 1 && (
              <div aria-hidden className="flex justify-center py-2">
                <span className="pixel text-2xl leading-none text-leaf-700">↓</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
