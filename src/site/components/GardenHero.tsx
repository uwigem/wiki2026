import { useEffect } from 'react'
import { HOME_CTAS, PROJECT_SUBTITLE, PROJECT_TAGLINE, PROJECT_TITLE, TEAM_LONG } from '../content/site'
import type { IntroStage } from '../hooks'
import { Link } from '../router'
import HeroGarden, { gardenStage } from './HeroGarden'

interface Props {
  at: (s: IntroStage) => boolean
  stage: IntroStage
  playing: boolean
  onSkip: () => void
}

/**
 * The homepage hero, over the live garden.
 *
 * The section is full viewport height and pulls up under the nav with -mt-16, so
 * the opening animation covers the whole screen with no strip of the static page
 * background showing at the top. The nav only appears once the intro is done (see
 * App), so during the animation the screen is just the hero.
 *
 * Every piece of text is always in the DOM and only its opacity changes as the
 * beats fire. That keeps the layout fixed, so the sign does not jump upward when
 * the subtitle and buttons arrive.
 */
export default function GardenHero({ at, stage, playing, onSkip }: Props) {
  useEffect(() => {
    if (stage === 'hop') gardenStage.walk('right', 900)
  }, [stage])

  // fade plus a tiny rise, opacity and transform only, so nothing reflows
  const reveal = (on: boolean) =>
    'transition-[opacity,transform] duration-700 ease-out ' + (on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')

  return (
    <section className="relative -mt-16 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* the live garden, hero only */}
      <HeroGarden />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        {/* the garden sign carrying the title */}
        <div className={reveal(at('sign'))}>
          <div className="sign px-6 py-5 sm:px-10 sm:py-7">
            <p className="pixel text-tag tracking-[0.22em] sm:text-note">{TEAM_LONG}</p>
            <h1 className="mt-2 text-3xl leading-[1.1] sm:text-5xl">
              <span className={'inline-block transition-opacity duration-700 ease-out ' + (at('title') ? 'opacity-100' : 'opacity-0')}>
                {PROJECT_TITLE}
              </span>
            </h1>
            <p
              className={
                'mt-2 max-w-xl text-sm sm:text-base transition-opacity duration-700 ease-out ' +
                (at('title') ? 'opacity-100' : 'opacity-0')
              }
            >
              {PROJECT_TAGLINE}
            </p>
          </div>
          {/* two posts holding the board up */}
          <div aria-hidden className="flex justify-center gap-[42%]">
            <span className="block h-6 w-3.5 border-x-2 border-wood-line bg-wood" />
            <span className="block h-6 w-3.5 border-x-2 border-wood-line bg-wood" />
          </div>
        </div>

        {/* subtitle, buttons, scroll cue. Always rendered so the layout is fixed;
            only fades in at the end, so the sign above never shifts. */}
        <div className={'flex w-full flex-col items-center gap-6 ' + reveal(at('done'))}>
          <p className="panel max-w-2xl px-5 py-4 text-body-sm leading-relaxed">{PROJECT_SUBTITLE}</p>

          <div className="flex flex-wrap justify-center gap-3">
            {HOME_CTAS.map((cta) => (
              <Link key={cta.to} to={cta.to} className={'pixel-btn ' + (cta.primary ? 'pixel-btn-primary' : '')}>
                {cta.label}
              </Link>
            ))}
          </div>

          <p className="pixel panel-flat px-3 py-1 text-tag tracking-[0.16em]">scroll to follow the hedgehog ▾</p>
        </div>
      </div>

      {playing && (
        <button
          type="button"
          onClick={onSkip}
          className="pixel absolute bottom-4 right-4 z-30 rounded-sm border-2 border-leaf-700 bg-leaf-100 px-2 py-1 text-xs"
        >
          skip intro →
        </button>
      )}

      {/* The opening dim. Covers the whole screen until the garden beat, then lifts. */}
      <div
        aria-hidden
        className={
          'pointer-events-none absolute inset-0 z-[5] bg-leaf-950 transition-opacity duration-[1100ms] ' +
          (at('garden') ? 'opacity-0' : 'opacity-50')
        }
      />
    </section>
  )
}
