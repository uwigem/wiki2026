/*
 * ARCHIVED. Nothing routes here: this page is not reachable on the site.
 * Kept as a record of a homepage the team tried. See ./README.md.
 */
import type { ReactNode } from 'react'
import { Link, useSectionJump } from '../../router'
import { pageBySlug } from '../../content/pages'
import { PROJECT_TITLE } from '../../content/site'
import BalanceLogo from '../../components/BalanceLogo'
import SignalDial from '../../components/SignalDial'
import StoryArt, { type StoryArtKind } from '../../components/StoryArt'
import { Reveal } from '../../components/GardenSection'

/**
 * The minimal homepage.
 *
 * Modelled on the clearest iGEM wikis rather than on this site's own garden:
 * Duke 2026 (one big name and one tagline on a quiet background), and
 * Barcelona-UB and McGill 2025 (the story told one short sentence at a time,
 * each beside one simple picture, with a lot of empty space around it).
 *
 * What makes it ours is the type, the palette and the pixel art, not
 * decoration. So there are no panels, borders, shadows, wooden signs, cards,
 * section dividers or garden margins on this page. The background is flat.
 * The only thing that moves before the reader asks it to is the logo.
 *
 * The original homepage is untouched at `#/`.
 */

const TAGLINE = 'Tune the signal. Don’t just switch it off.'

/**
 * The story, one sentence per beat. The claims come from the Background page
 * and the team's interview with Dr. Stacey Ogden; if those change, change
 * these with them.
 */
const BEATS: { art: StoryArtKind; text: ReactNode }[] = [
  {
    art: 'antenna',
    text: <>Almost every cell in your body grows a single, tiny antenna.</>,
  },
  {
    art: 'smo',
    text: (
      <>
        Inside it, a protein called <B>SMO</B> sets how loud one of the cell&rsquo;s signals is: the{' '}
        <B>Hedgehog</B> signal.
      </>
    ),
  },
  {
    art: 'band',
    text: (
      <>
        That signal has to stay in a narrow band. Too loud, and it drives <B>cancer</B>. Too quiet, and a
        growing baby cannot <B>develop</B> properly.
      </>
    ),
  },
  {
    art: 'off',
    text: <>The drugs we have today can only switch it off.</>,
  },
  {
    art: 'dial',
    text: (
      <>
        So we are building a <B>dial</B> instead.
      </>
    ),
  },
]

/** Where to go next. Plain links, in reading order, titles from the pages. */
const NEXT: { slug: string; label: string }[] = [
  { slug: '/project/background', label: 'Why it matters' },
  { slug: '/project/description', label: 'What we built' },
  { slug: '/project/design', label: 'Designing the binder' },
  { slug: '/project/engineering', label: 'What broke, and what we changed' },
  { slug: '/project/model', label: 'Does it hold up' },
  { slug: '/impact/human-practices', label: 'Who shaped it' },
]

/**
 * Emphasis without the yellow highlight that `strong` carries site-wide. The
 * references this page follows use weight alone, and a highlight on every key
 * word is exactly the kind of busyness this page exists to remove.
 */
/** The address this page had while it was on the site. Nothing routes here now. */
const SELF = '/archive/home-2'

function B({ children }: { children: ReactNode }) {
  return <span className="font-extrabold">{children}</span>
}

export default function HomeAlt() {
  useSectionJump(SELF)

  return (
    <div className="bg-leaf-50 text-leaf-950">
      {/* ------------------------------------------------------------ hero */}
      {/* One screen, nothing on it but the mark, the name and the line. */}
      <section className="flex min-h-[calc(100svh-3.75rem)] flex-col items-center justify-center px-6 py-12 text-center">
        <BalanceLogo fluid width={360} alt="Two hedgehogs on a balance scale, gently rocking" />
        <h1 className="mt-6 text-4xl leading-none min-[400px]:text-5xl sm:text-7xl lg:text-8xl">{PROJECT_TITLE}</h1>
        <p className="pixel mt-5 text-xl leading-snug text-leaf-800 sm:text-3xl">{TAGLINE}</p>
        <Link
          to={`${SELF}#story`}
          className="pixel mt-12 text-sm text-leaf-800 underline decoration-2 underline-offset-4 hover:text-leaf-950"
        >
          Scroll for the story &darr;
        </Link>
      </section>

      {/* ----------------------------------------------------------- story */}
      <section id="story" className="mx-auto max-w-5xl px-6">
        {BEATS.map((beat, i) => (
          <Reveal key={beat.art}>
            <div className="grid items-center gap-8 py-14 sm:py-20 md:grid-cols-2 md:gap-16">
              <StoryArt kind={beat.art} className={i % 2 === 1 ? 'md:order-2' : ''} />
              <p className="mx-auto max-w-md text-center text-2xl font-semibold leading-snug sm:text-3xl md:text-left">
                {beat.text}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ------------------------------------------------------- try it out */}
      <section id="how" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <Reveal>
          <p className="mx-auto max-w-2xl text-center text-2xl font-semibold leading-snug sm:text-3xl">
            The cell already has a machine that clears SMO out of the antenna. Our tool works that machine in{' '}
            <B>both directions</B>.
          </p>
          <p className="pixel mt-4 text-center text-base text-leaf-800">Try it yourself.</p>
        </Reveal>
        <div className="mt-10">
          <SignalDial bare />
        </div>
      </section>

      {/* -------------------------------------------------------- go deeper */}
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <h2 className="text-center text-2xl sm:text-3xl">Read the whole story</h2>
        <ol className="mt-8 border-t-2 border-leaf-300">
          {NEXT.map((n, i) => {
            const page = pageBySlug(n.slug)
            if (!page) return null
            return (
              <li key={n.slug} className="border-b-2 border-leaf-300">
                <Link
                  to={n.slug}
                  className="group flex items-baseline gap-4 py-4 hover:text-leaf-800"
                >
                  <span className="pixel w-8 shrink-0 text-sm text-leaf-700">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold leading-tight sm:text-xl">{n.label}</span>
                    {page.title.toLowerCase() !== n.label.toLowerCase() && (
                      <span className="block text-body-sm text-leaf-800">{page.title}</span>
                    )}
                  </span>
                  <span aria-hidden className="pixel text-lg transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
        <p className="mt-10 text-center">
          <Link to="/team" className="pixel underline decoration-2 underline-offset-4 hover:text-leaf-800">
            Meet the team &rarr;
          </Link>
        </p>
      </section>
    </div>
  )
}
