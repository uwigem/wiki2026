import { useEffect, useState, type ReactNode } from 'react'

/**
 * A small hash router.
 *
 * Deliberately not react-router: iGEM serves each wiki as static files from a
 * subpath, and hash routes survive that with no server rewrite rules and no
 * extra dependency. Routes look like `#/drylab/model`.
 */

/**
 * The current route, normalised.
 *
 * Trailing slashes and query strings are stripped so that a link someone pasted
 * from a browser bar (`#/drylab/model/`) or one a share tool decorated
 * (`#/drylab/model?utm_source=x`) still finds the page instead of falling
 * through to the 404.
 */
export function currentPath(): string {
  const raw = window.location.hash.replace(/^#/, '')
  const path = raw.split('?')[0].split('#')[0].replace(/\/+$/, '')
  if (!path) return '/'
  return path.startsWith('/') ? path : '/'
}

/**
 * The section a link asked for, from a SECOND hash: `#/drylab/model#pipeline`
 * points at the block with `id: 'pipeline'` on the Design page.
 *
 * Two hashes in one URL looks odd, but the first one belongs to the router and
 * the browser only ever reads the whole thing as one fragment, so the second is
 * free for us to use. It survives being copied and pasted, which a query
 * parameter inside a fragment also would, but this reads like an anchor because
 * it behaves like one.
 */
export function currentAnchor(): string {
  const raw = window.location.hash.replace(/^#/, '')
  const parts = raw.split('#')
  return parts.length > 1 ? parts.slice(1).join('#').split('?')[0] : ''
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scrolls a section into view and flashes it, so the jump is visible.
 *
 * The sticky nav is kept off the heading by the `[id] { scroll-margin-top }`
 * rule in index.css. The flash is the `data-jump-flash` attribute set below.
 */
export function revealSection(id: string, flash = true) {
  const el = document.getElementById(id)
  if (!el) return false
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

export function navigate(to: string) {
  const [path, anchor] = to.split('#')
  if (currentPath() === (path.replace(/\/+$/, '') || '/')) {
    if (anchor) {
      // Same page, different section. Keep the URL honest, then jump.
      window.history.replaceState(null, '', '#' + to)
      revealSection(anchor)
      return
    }
    // Already here with nothing more specific asked for: back to the top.
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    return
  }
  window.location.hash = to
}

/** Current route path, for example `/`, `/drylab/model`, `/team`. */
export function useRoute(): string {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => setPath(currentPath())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return path
}

/**
 * After a route change, jump to the section the link asked for.
 *
 * It retries for a short while because the target may not be in the DOM on the
 * first frame: blocks fade in on scroll, images settle, and the page can still
 * be growing when the hash changes.
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
      href={'#' + to}
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
