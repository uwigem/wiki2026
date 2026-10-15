import { useEffect, useState, type ReactNode } from 'react'
import { OLD_PATHS } from './content/nav'

/**
 * A small path router.
 *
 * Pages live at real paths under the site's base: on iGEM that is
 * https://2026.igem.wiki/washington/model, on the preview
 * https://uwigem.github.io/wiki2026/model, and in `npm run dev` just /model.
 * The base comes from Vite (`base` in vite.config.ts). Judges reach the award
 * pages from fixed links on their ballot, which is why these are real paths and
 * not `#/` routes.
 *
 * Deliberately not react-router: this is all the site needs, with no extra
 * dependency.
 */

/** The site's base path with no trailing slash: `''`, `/washington` or `/wiki2026`. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

/** A route as a URL: `/model#sensitivity` becomes `/washington/model#sensitivity`. */
export function href(to: string): string {
  const [path, anchor] = to.split('#')
  const url = BASE + (path === '/' ? '/' : path)
  return anchor ? `${url}#${anchor}` : url
}

/** A file in `public/` as a URL, for example `asset('team/ana.jpg')`. */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\.?\//, '')}`
}

/** A path with the base, trailing slashes and old names taken off. */
function normalise(raw: string): string {
  let path = raw.startsWith(BASE + '/') || raw === BASE ? raw.slice(BASE.length) : raw
  path = path.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/'
  return OLD_PATHS[path] ?? path
}

/**
 * An old `#/drylab/model#pipeline` link: the route and section it meant, or
 * null for an ordinary `#section` hash.
 */
function oldHashLink(): { path: string; anchor: string } | null {
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw.startsWith('/')) return null
  const [path, ...rest] = raw.split('#')
  return { path: normalise(path.split('?')[0]), anchor: rest.join('#').split('?')[0] }
}

/**
 * The current route, for example `/`, `/model`, `/team`.
 *
 * Trailing slashes and query strings are ignored, so a link pasted from a
 * browser bar (`/model/`) or decorated by a share tool (`/model?utm_source=x`)
 * still finds the page.
 */
export function currentPath(): string {
  return oldHashLink()?.path ?? normalise(window.location.pathname)
}

/** The section a link asked for: `/engineering#pipeline` points at the block with `id: 'pipeline'`. */
export function currentAnchor(): string {
  const old = oldHashLink()
  if (old) return old.anchor
  return decodeURIComponent(window.location.hash.replace(/^#/, ''))
}

/**
 * Rewrites the address bar to the canonical URL when a visitor arrives on an
 * old link (`#/drylab/model`, `/drylab/model`) or a trailing slash, so what
 * they copy next is the address that will keep working.
 */
function tidyAddress() {
  const path = currentPath()
  const anchor = currentAnchor()
  const canonical = href(anchor ? `${path}#${anchor}` : path)
  const now = window.location.pathname + window.location.hash
  if (now !== canonical) window.history.replaceState(null, '', canonical + window.location.search)
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scrolls a section into view and flashes it, so the jump is visible.
 *
 * The sticky nav is kept off the heading by the `html { scroll-padding-top }`
 * rule in index.css. The flash is the `data-jump-flash` attribute set below.
 */
export function revealSection(id: string, flash = true) {
  const el = document.getElementById(id)
  if (!el) return false
  // A target inside a closed section is opened first, or it stays hidden.
  for (let p = el.parentElement; p; p = p.parentElement) if (p instanceof HTMLDetailsElement) p.open = true
  // A target that is itself a closed section (its id sits on the block's
  // wrapper, with the `<details>` just inside) opens too, so a jump to
  // "References" shows the references rather than only the heading.
  const own =
    el instanceof HTMLDetailsElement
      ? el
      : [...el.querySelectorAll('details')].find((d) => d.parentElement?.closest('[id]') === el)
  if (own) own.open = true
  if (flash) {
    // A data attribute, not a class. These blocks fade in on scroll, and that
    // fade is React rewriting `className` on the same element: a class added
    // here imperatively gets wiped the moment the block reveals itself. React
    // leaves attributes it does not manage alone.
    el.removeAttribute('data-jump-flash')
    // Force a reflow, so re-adding it restarts the animation when the same
    // link is followed twice in a row.
    void el.offsetWidth
    el.setAttribute('data-jump-flash', '')
  }
  el.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  return true
}

/** Fired after the router changes the URL itself; the browser only fires `popstate` for back and forward. */
const ROUTE_EVENT = 'wiki:route'

export function navigate(to: string) {
  const [path, anchor] = to.split('#')
  if (currentPath() === normalise(path)) {
    if (anchor) {
      // Same page, different section. Keep the URL honest, then jump.
      window.history.replaceState(null, '', href(to))
      revealSection(anchor)
      return
    }
    // Already here with nothing more specific asked for: back to the top.
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    return
  }
  window.history.pushState(null, '', href(to))
  window.dispatchEvent(new Event(ROUTE_EVENT))
}

/** Current route path, for example `/`, `/model`, `/team`. */
export function useRoute(): string {
  const [path, setPath] = useState(() => {
    tidyAddress()
    return currentPath()
  })
  useEffect(() => {
    const onChange = () => {
      tidyAddress()
      setPath(currentPath())
    }
    window.addEventListener('popstate', onChange)
    window.addEventListener(ROUTE_EVENT, onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(ROUTE_EVENT, onChange)
    }
  }, [])
  return path
}

/**
 * After a route change, jump to the section the link asked for.
 *
 * It retries for a short while because the target may not be in the DOM on the
 * first frame: blocks fade in, images settle, and the page can still be growing
 * when the route changes.
 */
export function useSectionJump(path: string) {
  useEffect(() => {
    const anchor = currentAnchor()
    if (!anchor) return

    // Finding the element is not enough. The page is still settling when the
    // route changes: blocks fade in, canvases size themselves, and the garden
    // background re-bakes, all of which move the target after the first scroll
    // has been aimed at it. So keep checking where it actually ended up and
    // correct, until it holds still near the top or we run out of patience.
    let tries = 0
    let timer = 0
    const check = () => {
      const el = document.getElementById(anchor)
      if (!el) {
        if (tries++ < 20) timer = window.setTimeout(check, 50)
        return
      }
      const top = el.getBoundingClientRect().top
      // Settled: the heading is in the upper part of the screen and not under
      // the nav. Anything in this band is a good landing.
      if (top > 40 && top < 200) return
      revealSection(anchor, tries === 0)
      if (tries++ < 14) timer = window.setTimeout(check, 120)
    }
    timer = window.setTimeout(check, 60)
    return () => window.clearTimeout(timer)
  }, [path])
}

interface LinkProps {
  to: string
  children: ReactNode
  className?: string
  title?: string
  /**
   * Screen-reader marker for "you are here". `'page'` for the exact current
   * page, `'section'` for a nav group that contains it. ARIA has no `section`
   * token, so a section maps to the generic `aria-current="true"`.
   */
  current?: 'page' | 'section' | false
  /** Runs after a successful in-page navigation, for example to close a menu. */
  onNavigate?: () => void
}

export function Link({ to, children, className, title, current, onNavigate }: LinkProps) {
  return (
    <a
      href={href(to)}
      className={className}
      title={title}
      aria-current={current === 'section' ? 'true' : current || undefined}
      onClick={(e) => {
        // Let cmd/ctrl/shift-click open a new tab as normal.
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(to)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}
