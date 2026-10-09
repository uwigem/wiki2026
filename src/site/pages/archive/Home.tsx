/*
 * ARCHIVED. Nothing routes here: this page is not reachable on the site.
 * Kept as a record of a homepage the team tried. See ./README.md.
 */
import { pageBySlug } from '../../content/pages'
import { ROSTER, SUBTEAMS } from '../../content/team'
import { Link } from '../../router'
import type { IntroStage } from '../../hooks'
import SignalDial from '../../components/SignalDial'
import GardenHero from '../../components/GardenHero'
import GardenSection, { Reveal, SectionDivider } from '../../components/GardenSection'
import HedgehogNote from '../../components/HedgehogNote'
import PixelSign from '../../components/PixelSign'

/**
 * The homepage, told as one argument rather than as a menu.
 *
 * The order is deliberate and it is the order a stranger needs, not the order
 * the subteams work in. First the one idea, as something you can press: a
 * compartment with a number in it that we can move. Then why that is hard with
 * what exists today. Only then the path into the detail.
 *
 * Each stop on the path borrows its narration from the page it points at
 * (`storyBeat` in content/pages.ts), so the homepage and the wiki cannot drift
 * apart. Adding a page to the path is one line here plus its `storyBeat`.
 */
const STOPS: { slug: string; label: string; cta: string }[] = [
  { slug: '/project/background', label: 'why it matters', cta: 'See what goes wrong' },
  { slug: '/project/description', label: 'what we built', cta: 'Read the idea' },
  { slug: '/project/design', label: 'designing the binder', cta: 'See the designs' },
  { slug: '/project/engineering', label: 'what broke', cta: 'Follow the cycles' },
  { slug: '/project/model', label: 'does it hold up', cta: 'Check the maths' },
  { slug: '/impact/human-practices', label: 'who asked for it', cta: 'Meet our stakeholders' },
]

interface Props {
  at: (s: IntroStage) => boolean
  stage: IntroStage
  playing: boolean
  onSkip: () => void
}

export default function Home({ at, stage, playing, onSkip }: Props) {
  return (
    <>
      <GardenHero at={at} stage={stage} playing={playing} onSkip={onSkip} />

      {/* The fold between the hero and the rest of the site. The scroll hedgehog
          is revealed from just under this line (see HedgehogGuide, which clips to
          data-hero-fold). */}
      <div data-hero-fold aria-hidden className="relative z-10 h-1.5 w-full bg-leaf-800" />

      {/* The hook. It plays once as a short film, then hands over the dial.
          Everything else on this page is downstream of this one idea. */}
      <GardenSection className="pt-6">
        <Reveal>
          <SignalDial />
        </Reveal>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <PixelSign>
            <h2 className="text-xl sm:text-2xl">Why that is hard</h2>
          </PixelSign>
        </div>

        <Reveal>
          <div className="panel px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-body leading-relaxed">
              A cilium is not a sealed box. Nearly every protein in it is also somewhere else in the cell,
              so the usual tools cannot tell the two apart. Delete the gene and it goes from{' '}
              <strong>everywhere</strong>. Add a drug and it is blocked <strong>everywhere</strong>. Either
              way, if the cell behaves differently afterwards, you cannot say whether the antenna had
              anything to do with it.
            </p>
            <p className="mt-3 text-body leading-relaxed">
              The tools that <em>are</em> specific to the cilium have the opposite problem: they move
              everything in the compartment at once, rather than the one protein you care about. We went
              through seven of them one by one, and none does both.
            </p>
            <Link to="/impact/human-practices" className="pixel-btn mt-4">
              See the whole toolbox, and the gap &rarr;
            </Link>
          </div>
        </Reveal>

        <div className="mt-5">
          <Reveal delay={0.05}>
            <HedgehogNote
              label="so here is the trick"
              body={[
                'We did not build a new machine. The cell already owns one: a three-part complex called **MMM** that clears a specific receptor out of the cilium.',
                'Block it and receptors pile up. Point it at something new and that gets cleared instead. **Same machine, both directions.**',
              ]}
            />
          </Reveal>
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <PixelSign>
            <h2 className="text-xl sm:text-2xl">Walk the garden path</h2>
          </PixelSign>
          <p className="panel-flat max-w-xl px-4 py-2 text-body-sm">
            The whole project in order, from the problem to the people who shaped it.
          </p>
        </div>

        <ol className="flex flex-col gap-5">
          {STOPS.map((stop, i) => {
            const page = pageBySlug(stop.slug)
            if (!page) return null
            return (
              <li key={stop.slug}>
                <Reveal>
                  <div className="panel px-5 py-5">
                    <div className="flex items-baseline gap-2">
                      <span className="badge">{String(i + 1).padStart(2, '0')}</span>
                      <p className="kicker">{stop.label}</p>
                    </div>
                    <h3 className="mt-1 text-xl sm:text-2xl">{page.title}</h3>
                    <p className="mt-2 text-body-sm leading-relaxed">{page.storyBeat}</p>
                    {page.intro && <p className="mt-2 text-body-sm leading-relaxed">{page.intro}</p>}
                    <Link to={stop.slug} className="pixel-btn mt-4">
                      {stop.cta} &rarr;
                    </Link>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </GardenSection>

      <SectionDivider />

      <GardenSection className="pb-12">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="panel flex h-full flex-col px-5 py-6">
              <h3 className="text-xl sm:text-2xl">The team</h3>
              <p className="mt-2 text-body-sm leading-relaxed">
                {ROSTER.length} students across {SUBTEAMS.length} subteams, each with a profile and a way to get in
                touch.
              </p>
              <Link to="/team" className="pixel-btn mt-auto self-start">
                Meet the Team &rarr;
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="panel flex h-full flex-col px-5 py-6">
              <h3 className="text-xl sm:text-2xl">The playground</h3>
              <p className="mt-2 text-body-sm leading-relaxed">
                Take the controls. Walk the whole meadow yourself, switch the light from day to dusk to night, and turn
                on the ambient soundscape.
              </p>
              <Link to="/playground" className="pixel-btn pixel-btn-primary mt-auto self-start">
                Open the Playground &rarr;
              </Link>
            </div>
          </Reveal>
        </div>

      </GardenSection>
    </>
  )
}
