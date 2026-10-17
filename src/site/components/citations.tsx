import { createContext, useContext } from 'react'
import { revealSection } from '../router'

/**
 * Citation markers that go somewhere.
 *
 * A long page keeps one reference list per section (each numbered from 1, the
 * way the authors wrote them), all gathered at the foot of the page. A marker
 * such as `[4]` therefore means a different source in different sections. The
 * page tells every block which section it sits in (`scope`), and which
 * sections have a list (`lists`); a marker then links to entry 4 of its own
 * section's list, opening the collapsed references on the way.
 *
 * Where there is no list to point at (a page without references, or a section
 * whose list does not exist) the marker stays plain text rather than becoming
 * a link that leads nowhere.
 */
export interface CitationScope {
  scope: string | null
  lists: ReadonlySet<string>
}

export const CitationContext = createContext<CitationScope>({ scope: null, lists: new Set() })

/** A section label as an id fragment: "Community need" becomes "community-need". */
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** The element id of one reference entry. */
export function refId(scope: string, n: string): string {
  return `ref-${scope}-${n.replace(/\./g, '-')}`
}

/** `[4]` or `[9, 10]` in running text. */
export function Cite({ nums }: { nums: string[] }) {
  const { scope, lists } = useContext(CitationContext)
  if (!scope || !lists.has(scope)) return <span>[{nums.join(', ')}]</span>
  return (
    <span className="cite">
      [
      {nums.map((n, i) => {
        const id = refId(scope, n)
        return (
          <span key={n}>
            {i > 0 && ', '}
            <a
              href={'#' + id}
              onClick={(e) => {
                e.preventDefault()
                window.history.replaceState(null, '', '#' + id)
                revealSection(id)
              }}
              aria-label={`Reference ${n}`}
            >
              {n}
            </a>
          </span>
        )
      })}
      ]
    </span>
  )
}
