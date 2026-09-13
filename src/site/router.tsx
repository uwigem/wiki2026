import { useEffect, useState, type ReactNode } from 'react'

/**
 * A small hash router.
 *
 * Deliberately not react-router: iGEM serves each wiki as static files from a
 * subpath, and hash routes survive that with no server rewrite rules and no
 * extra dependency. Routes look like `#/project/design`.
 */

/**
 * The current route, normalised.
 *
 * Trailing slashes and query strings are stripped so that a link someone pasted
 * from a browser bar (`#/project/design/`) or one a share tool decorated
 * (`#/project/design?utm_source=x`) still finds the page instead of falling
 * through to the 404.
 */
export function currentPath(): string {
  const raw = window.location.hash.replace(/^#/, '')
  const path = raw.split('?')[0].split('#')[0].replace(/\/+$/, '')
  if (!path) return '/'
  return path.startsWith('/') ? path : '/'
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function navigate(path: string) {
  if (currentPath() === path) {
    // Already here: treat the click as "take me back to the top".
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    return
  }
  window.location.hash = path
}

/** Current route path, for example `/`, `/project/design`, `/team`. */
export function useRoute(): string {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => setPath(currentPath())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return path
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
