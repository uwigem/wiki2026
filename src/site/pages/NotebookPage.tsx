import { MISSING_DATES, NEXT_STEPS, TIMELINE, WETLAB_MILESTONES } from '../content/timeline'
import { RECRUITMENT_CONSTRUCTS } from '../content/constructs'
import ConstructDiagram from '../components/ConstructDiagram'
import Details from '../components/Details'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import StageRail, { type Stage } from '../components/StageRail'
import PixelSign, { TodoPanel } from '../components/PixelSign'
import { Link } from '../router'

/**
 * The notebook.
 *
 * The page leads with the wet lab's engineering record, because that is what
 * the Notebook is under in the navigation and what a judge looking for it
 * expects: what was designed, what was ordered, and what has not happened yet.
 * The whole team's season follows underneath, closed, so that none of it is
 * lost and none of it buries the part above.
 *
 * Nothing here may read as though the experiments have been run. The
 * constructs are on order.
 *
 * Content lives in `content/timeline.ts` and `content/constructs.ts`.
 */
/**
 * The milestones as rail stages. The one that has not started is marked
 * `here`, so the rail draws its line above it: everything above is done, and
 * that stage is what the lab is waiting to begin.
 */
const STAGES: Stage[] = WETLAB_MILESTONES.map((m) => ({
  title: m.title,
  meta: m.date,
  body: [m.body],
  here: m.status === 'upcoming' ? true : undefined,
}))

export default function NotebookPage() {
  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">notebook</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">The Season, In Order</h1>
          </PixelSign>
          <p className="panel max-w-2xl px-5 py-4 text-body leading-relaxed">
            Where the wet lab has got to: the system designed, the constructs drawn up and ordered, and the
            experiments waiting on delivery. The whole team's season is at the bottom.
          </p>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <Reveal>
          <StageRail
            heading="Wet lab, start to here"
            intro="Design work is finished and the orders are placed. Above the line is what is done; below it is what happens once the materials arrive."
            stages={STAGES}
            hereLabel="where we are"
          />
        </Reveal>

        <div className="mt-6 flex flex-col gap-5">
          <Reveal>
            <ConstructDiagram
              heading="What we designed"
              intro="The ten mammalian expression constructs, ordered from GenScript in pcDNA3.1(+)-based expression vectors. The same parts are listed, with what each one is for, on [parts and registry](/parts)."
              groups={RECRUITMENT_CONSTRUCTS}
              footnote="Domain widths are not to scale."
              source="Wet Lab: GenScript order, 2026."
            />
          </Reveal>

          <Reveal>
            <div className="panel px-5 py-5 sm:px-7 sm:py-6">
              <h3 className="text-xl">When they arrive</h3>
              <p className="mt-1 max-w-2xl text-body leading-relaxed">
                The order the work happens in, once there is something to work with.
              </p>
              <ol className="mt-4 flex flex-col gap-2">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 text-body-sm leading-relaxed">
                    <span className="badge shrink-0">{i + 1}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-body-sm leading-relaxed">
                What each experiment is for, and the controls it runs against, are on{' '}
                <Link to="/experiments" className="cross-link">
                  experiments
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection className="pb-10">
        <Details
          heading="The whole season, week by week"
          summary={`Every subteam's record, from November 2025. ${TIMELINE.length} entries.`}
        >
          <ol className="flex flex-col gap-4">
            {TIMELINE.map((entry, i) => (
              <li key={i}>
                <div
                  className={
                    'panel px-5 py-4 ' + (entry.milestone ? 'border-l-[10px] border-l-pool-400' : '')
                  }
                >
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
              </li>
            ))}
          </ol>
        </Details>

        {/* A drafting aid: shown by `npm run dev`, left out of the published
            site. What is missing is also tracked in docs/CONTENT_MAP.md. */}
        {import.meta.env.DEV && (
          <div className="mt-6">
            <TodoPanel
              items={[
                `TODO(ops): dates still missing (${MISSING_DATES.join(', ')}). Get these off the official iGEM calendar.`,
                'Wet-lab protocol summaries, linked out to the Benchling record.',
              ]}
            />
          </div>
        )}
      </GardenSection>
    </article>
  )
}
