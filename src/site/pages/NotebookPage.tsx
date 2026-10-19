import { MISSING_DATES, NEXT_STEPS, WETLAB_MILESTONES } from '../content/timeline'
import { RECRUITMENT_CONSTRUCTS } from '../content/constructs'
import Callout from '../components/Callout'
import ConstructDiagram from '../components/ConstructDiagram'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import StageRail, { type Stage } from '../components/StageRail'
import PixelSign, { TodoPanel } from '../components/PixelSign'
import RichText from '../components/RichText'
import { Link } from '../router'

/**
 * The wet-lab notebook.
 *
 * Four parts, in the order a reader needs them: the development timeline, the
 * constructs that came out of it, the workflow waiting on delivery, and what
 * is on record so far.
 *
 * This page is the wet lab's and only the wet lab's. An earlier version also
 * carried the whole team's season week by week, which buried the lab record
 * under outreach, web development and ideation meetings. Those entries still
 * live in `content/timeline.ts` for whichever page takes them on.
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
  body: m.body,
  here: m.status === 'upcoming' ? true : undefined,
}))

export default function NotebookPage() {
  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">notebook</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">Wet-Lab Notebook</h1>
          </PixelSign>
          <p className="panel w-full px-5 py-4 text-body leading-relaxed">
            This notebook documents the development of HedgehogSense's experimental strategy, from the
            initial investigation of the MGRN1, MEGF8 and MOSMO (MMM) complex to the design of mammalian
            expression constructs and proposed validation assays. It provides a chronological record of our
            wet-lab planning, construct development, and experimental milestones.
          </p>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <Reveal>
          <StageRail
            heading="Wet-lab development timeline"
            intro="The following timeline summarises completed work and upcoming experimental milestones. Activities are distinguished according to their completion status."
            stages={STAGES}
            hereLabel="where we are"
          />
        </Reveal>

        <div className="mt-6 flex flex-col gap-5">
          <Reveal>
            <ConstructDiagram
              heading="Engineered recruitment constructs"
              intro="Ten mammalian expression constructs were designed and ordered to evaluate MGRN1 recruitment, catalytic activity, and the regulation of SMO and GPR161. Detailed construct architectures, sequences and intended functions are documented on [parts and registry](/parts)."
              groups={RECRUITMENT_CONSTRUCTS}
              footnote="Schematic representation of the ten engineered mammalian expression constructs. Protein domains and tags are shown for illustration and are not drawn to scale."
            />
          </Reveal>

          <Reveal>
            <div className="panel px-5 py-5 sm:px-7 sm:py-6">
              <h2 className="text-xl">Planned experimental workflow</h2>
              <p className="mt-1 text-body leading-relaxed">
                Following delivery of the synthesised constructs, experimental validation will proceed
                through the following stages.
              </p>
              <ol className="mt-4 flex flex-col gap-3">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="badge mt-0.5 shrink-0">{i + 1}</span>
                    <span>
                      <span className="block text-body font-semibold leading-snug">{step.title}</span>
                      <span className="mt-0.5 block text-body-sm leading-relaxed">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-body-sm leading-relaxed">
                Detailed experimental methods, controls and expected outcomes are provided on{' '}
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
        <div className="flex flex-col gap-5">
          <Reveal>
            <div className="panel px-5 py-5 sm:px-7 sm:py-6">
              <h2 className="text-xl">Experimental documentation</h2>
              <div className="prose-garden mt-2 text-body">
                <RichText
                  paragraphs={[
                    'The wet lab subteam maintains records of construct development, experimental planning and laboratory activities. The current documentation covers the mammalian expression construct designs and sequence information, the GenScript and Twist Bioscience synthesis orders, and the proposed experimental protocols and assay controls.',
                    'As laboratory experiments are performed, this section will be expanded with dated experimental records, observations, troubleshooting notes and supporting results.',
                  ]}
                />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Callout
              label="current experimental status"
              heading="Nothing has been run at the bench yet"
              body={[
                'Construct design, experimental planning and DNA synthesis orders have been completed. Functional validation experiments remain pending, and no hypothetical results presented elsewhere on the wiki should be interpreted as experimentally measured data.',
              ]}
            />
          </Reveal>
        </div>

        {/* A drafting aid: shown by `npm run dev`, left out of the published
            site. What is missing is also tracked in docs/CONTENT_MAP.md. */}
        {import.meta.env.DEV && (
          <div className="mt-6">
            <TodoPanel
              items={[
                `TODO(ops): dates still missing (${MISSING_DATES.join(', ')}). Get these off the official iGEM calendar.`,
                'Wet-lab protocol summaries, linked out to the Benchling record.',
                'TODO(content): the whole-team season log is no longer on this page. TIMELINE in content/timeline.ts is kept for whichever page takes it on.',
              ]}
            />
          </div>
        )}
      </GardenSection>
    </article>
  )
}
