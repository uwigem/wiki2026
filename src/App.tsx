import { useEffect, useRef, useState } from 'react'
import { PAGES, pageBySlug } from './site/content/pages'
import { PROJECT_TITLE, TEAM_NAME } from './site/content/site'
import { useIntro, type Intro } from './site/hooks'
import { Link, currentAnchor, useRoute } from './site/router'
import FooterGarden from './site/components/FooterGarden'
import HedgehogGuide from './site/components/HedgehogGuide'
import PageGarden, { variantFor } from './site/components/PageGarden'
import GardenSection from './site/components/GardenSection'
import PixelSign from './site/components/PixelSign'
import TopNav from './site/components/TopNav'
import Home from './site/pages/Home'
import NotebookPage from './site/pages/NotebookPage'
import PlaygroundPage from './site/pages/PlaygroundPage'
import TeamPage from './site/pages/TeamPage'
import WikiPage from './site/pages/WikiPage'

/**
 * App shell: hash router plus layout.
 *
 * `PageGarden` and `HedgehogGuide` are mounted once here, above the router, so
 * the engine's world is built a single time and the hedgehog keeps walking
 * continuously as you move between pages rather than respawning on every
 * navigation.
 *
 * The playground route is the full-screen toy and owns the whole viewport, so
 * the shell gets out of its way: nav, footer and background all step aside.
 * Two gardens would mean two requestAnimationFrame loops.
 */
export default function App() {
  const path = useRoute()
  const intro = useIntro()
  const isHome = path === '/'
  const isPlayground = path === '/playground'
  const mainRef = useRef<HTMLElement>(null)
  // Empty until the visitor actually navigates. A live region that already has
  // text when it is inserted can be read out to someone who has only just
  // arrived, which is not what it is for. Keyed off the previous path rather
  // than a "first render" flag, because StrictMode runs effects twice in
  // development and a flag would announce on load there.
  const [announced, setAnnounced] = useState('')
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    // A new page normally starts at the top. The exception is a link that
    // named a section: `#/project/design#pipeline` is a request to land part
    // way down, and jumping to the top first would fight the scroll that
    // `useSectionJump` is about to do.
    if (currentAnchor()) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [path])

  useEffect(() => {
    document.title = titleFor(path)
    if (lastPath.current !== null && lastPath.current !== path) setAnnounced(titleFor(path))
    lastPath.current = path
  }, [path])

  if (isPlayground) return <PlaygroundPage />

  return (
    <>
      {/* Garden in the margins, clean grass down the middle. One variant per
          page family. The homepage hero paints the live garden on top. */}
      <PageGarden variant={variantFor(path)} />
      <HedgehogGuide />

      {/* Everything readable lives above the garden in one z-10 layer. */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <a
          href="#garden-main"
          className="skip-link"
          onClick={(e) => {
            // The hash router would read "#garden-main" as a route and send the
            // visitor home, so move focus directly instead of following the link.
            e.preventDefault()
            mainRef.current?.focus()
            mainRef.current?.scrollIntoView({ block: 'start' })
          }}
        >
          Skip to content
        </a>

        {/* On the homepage the nav stays hidden until the intro has played. */}
        <TopNav visible={!isHome || intro.at('done')} />

        {/* tabIndex -1 so the skip link can move focus here. */}
        <main id="garden-main" ref={mainRef} tabIndex={-1} className="flex-1">
          <RouteView path={path} intro={intro} />
        </main>

        <FooterGarden onReplayIntro={isHome ? intro.replay : undefined} />
      </div>

      {/* Announces the new page to screen readers after a hash navigation,
          which otherwise swaps the whole document silently. */}
      <p aria-live="polite" className="sr-only">
        {announced}
      </p>
    </>
  )
}

/** The document title for a route, also used as the route-change announcement. */
function titleFor(path: string): string {
  const label = pageBySlug(path)?.title ?? SPECIAL_TITLES[path] ?? null
  return label ? `${label} · ${PROJECT_TITLE} · ${TEAM_NAME}` : `${PROJECT_TITLE} · ${TEAM_NAME}`
}

/** Routes whose copy lives in a component rather than in `content/pages.ts`. */
const SPECIAL_TITLES: Record<string, string> = {
  '/team': 'Team',
  '/playground': 'Playground',
  '/project/notebook': 'Notebook',
}

function RouteView({ path, intro }: { path: string; intro: Intro }) {
  if (path === '/')
    return <Home at={intro.at} stage={intro.stage} playing={intro.playing} onSkip={intro.skip} />
  if (path === '/team') return <TeamPage />
  if (path === '/project/notebook') return <NotebookPage />

  const page = pageBySlug(path)
  if (page) return <WikiPage page={page} />

  return <NotFound />
}

function NotFound() {
  return (
    <GardenSection className="py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <PixelSign>
          <h1 className="text-2xl sm:text-3xl">This bed is empty</h1>
        </PixelSign>
        <p className="panel-flat max-w-md px-4 py-3 text-body-sm">
          Nothing planted at this address yet. Try one of these:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link to="/" className="pixel-btn pixel-btn-primary">
            Back to the gate
          </Link>
          {PAGES.slice(0, 3).map((p) => (
            <Link key={p.slug} to={p.slug} className="pixel-btn">
              {p.title}
            </Link>
          ))}
        </div>
      </div>
    </GardenSection>
  )
}
