import { MISSING_DATES, TIMELINE } from '../content/timeline'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import PixelSign, { TodoPanel } from '../components/PixelSign'

/** The notebook / timeline. Content lives in content/timeline.ts. */
export default function NotebookPage() {
  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">notebook</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">The Season, In Order</h1>
          </PixelSign>
          <h2 className="sr-only">Timeline</h2>
          <p className="panel-flat max-w-2xl px-4 py-3 text-body-sm leading-relaxed">
            Every garden has a diary. Ours starts in November, with a protein nobody had a name for yet.
          </p>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <ol className="flex flex-col gap-4">
          {TIMELINE.map((entry, i) => (
            <li key={i}>
              <Reveal>
                <div className={'panel px-5 py-4 ' + (entry.milestone ? 'border-l-[10px] border-l-pool-400' : '')}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="badge">{entry.date}</span>
                    <h3 className="text-lg">{entry.title}</h3>
                    {entry.team && <span className="kicker normal-case">{entry.team}</span>}
                    {entry.milestone && (
                      <span className="pixel ml-auto text-tag tracking-widest text-leaf-800">milestone</span>
                    )}
                  </div>
                  <p className="mt-2 text-body-sm leading-relaxed">{entry.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* A drafting aid: shown by `npm run dev`, left out of the published
            site. What is missing is also tracked in docs/CONTENT_MAP.md. */}
        {import.meta.env.DEV && (
          <div className="mt-6">
            <TodoPanel
              items={[
                `TODO(ops): dates still missing (${MISSING_DATES.join(', ')}). Get these off the official iGEM calendar.`,
                'Wet-lab protocol summaries, linked out to the Benchling record.',
                'Mark each entry complete / in-progress so this reads as a live log rather than a history.',
              ]}
            />
          </div>
        )}
      </GardenSection>
    </article>
  )
}
