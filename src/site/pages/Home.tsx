import { pageBySlug } from '../content/pages'
import { ROSTER, SUBTEAMS } from '../content/team'
import { PROJECT_BLURB } from '../content/site'
import { Link } from '../router'
import type { IntroStage } from '../hooks'
import GardenHero from '../components/GardenHero'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import PixelSign, { TodoPanel } from '../components/PixelSign'

/**
 * The story path down the homepage.
 *
 * Each stop borrows its narration from the page it points at (`storyBeat` in
 * content/pages.ts), so the homepage and the wiki can't drift apart.
 */
const STOPS: { slug: string; label: string; cta: string }[] = [
  { slug: '/project/background', label: 'the problem', cta: 'See what went wrong' },
  { slug: '/project/description', label: 'the idea', cta: 'Read the idea' },
  { slug: '/project/design', label: 'the design', cta: 'See the designs' },
  { slug: '/project/engineering', label: 'building it', cta: 'Follow the cycles' },
  { slug: '/impact/human-practices', label: 'the people', cta: 'Meet our stakeholders' },
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

      <GardenSection className="pt-6">
        <Reveal>
          <p className="panel mx-auto max-w-2xl px-5 py-4 text-center text-base leading-relaxed sm:text-lg">
            {PROJECT_BLURB}
          </p>
        </Reveal>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <PixelSign>
            <h2 className="text-xl sm:text-2xl">Walk the garden path</h2>
          </PixelSign>
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
                      {stop.cta} →
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
                Meet the Team →
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
                Open the Playground →
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-5">
          <TodoPanel
            title="work in progress"
            items={[
              'The project pages are written from the team documents. Figures, results, and citations are still being added.',
              'TODO(creative): project name and logo.',
              'TODO(ops): roster photos and bios. Each page lists what it still needs.',
            ]}
          />
        </div>
      </GardenSection>
    </>
  )
}
