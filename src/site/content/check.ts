import { PAGES } from './pages'
import { ALL_ROUTES } from './nav'

/**
 * Development-time consistency check for the content files.
 *
 * Adding a page means editing two files, `pages.ts` and `nav.ts`, and nothing in
 * TypeScript connects them. Get the slug wrong in one of them and the failure is
 * silent: the page is simply unreachable, or a nav link lands on "This bed is
 * empty". That is a miserable thing to debug, so this shouts about it in the
 * browser console instead.
 *
 * It runs only in `npm run dev`. Vite strips the whole call from a production
 * build, so this costs the published wiki nothing.
 */

/** Routes that are real pages but are not built from `pages.ts`. */
const HAND_WRITTEN_ROUTES = new Set(['/', '/team', '/project/notebook', '/playground'])

export function checkContent() {
  const problems: string[] = []

  const slugs = PAGES.map((p) => p.slug)
  const navPaths = new Set(ALL_ROUTES.map((r) => r.to))

  for (const slug of slugs) {
    if (!navPaths.has(slug)) {
      problems.push(
        `"${slug}" is in the PAGES array but not in nav.ts, so nothing links to it and it is ` +
          `missing from the footer sitemap. Add it to a group in src/site/content/nav.ts.`,
      )
    }
  }

  for (const route of navPaths) {
    if (!slugs.includes(route) && !HAND_WRITTEN_ROUTES.has(route)) {
      problems.push(
        `nav.ts links to "${route}" but no page has that slug, so the link lands on the ` +
          `"This bed is empty" page. Check the slug in src/site/content/pages.ts matches exactly.`,
      )
    }
  }

  const seen = new Set<string>()
  for (const slug of slugs) {
    if (seen.has(slug)) problems.push(`Two pages share the slug "${slug}". Slugs must be unique.`)
    seen.add(slug)
  }

  for (const page of PAGES) {
    if (!page.slug.startsWith('/')) problems.push(`"${page.slug}" (${page.title}) must start with a "/".`)
    if (page.slug.length > 1 && page.slug.endsWith('/'))
      problems.push(`"${page.slug}" (${page.title}) must not end with a "/".`)
  }

  // The chapter number in each kicker has to follow the PAGES order by hand.
  PAGES.forEach((page, i) => {
    const match = page.kicker.match(/chapter\s+(\d+)/i)
    if (match && Number(match[1]) !== i + 1) {
      problems.push(
        `"${page.title}" is page ${i + 1} in the PAGES array but its kicker says ` +
          `"chapter ${match[1]}". Reading order comes from the PAGES array, so either move the ` +
          `page or renumber the kickers after it.`,
      )
    }
  })

  if (problems.length > 0) {
    console.warn(
      `Wiki content check found ${problems.length} problem(s):\n\n` +
        problems.map((p) => '  - ' + p).join('\n') +
        '\n\nThis warning only appears while running npm run dev.',
    )
  }
}
