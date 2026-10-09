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
const HAND_WRITTEN_ROUTES = new Set(['/', '/team', '/wetlab/notebook', '/playground'])

/** `[label](/some/page#section)` inside any string of a page's content. */
const LINK = /\]\((\/[^)\s]*)\)/g

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

  /*
   * Links written inside the copy, for example
   * `[the pipeline](/project/engineering#pipeline)`.
   *
   * These are plain strings, so moving a page silently turns every link to it
   * into a trip to "This bed is empty". That is exactly what happened when the
   * site moved to the team's final architecture, so it is checked now. Every
   * string of a page is searched, whatever block it belongs to.
   */
  const idsByPage = new Map(
    PAGES.map((p) => [p.slug, new Set(p.blocks.map((b) => b.id).filter(Boolean) as string[])]),
  )
  for (const page of PAGES) {
    const content = JSON.stringify(page.blocks)
    for (const [, target] of content.matchAll(LINK)) {
      const [path, anchor] = target.split('#')
      if (!navPaths.has(path) && !HAND_WRITTEN_ROUTES.has(path)) {
        problems.push(
          `"${page.title}" links to "${target}", but no page lives at "${path}", so the link ` +
            `lands on "This bed is empty". Pages moved on 2026-10-08: check src/site/content/nav.ts ` +
            `for the address it has now.`,
        )
        continue
      }
      const ids = idsByPage.get(path)
      if (anchor && ids && !ids.has(anchor)) {
        problems.push(
          `"${page.title}" links to "${target}", and that page exists, but nothing on it has ` +
            `the id "${anchor}", so the link opens the page at the top. Add "id: '${anchor}'" to ` +
            `the block it should land on.`,
        )
      }
    }
  }

  // Pages that are evidence for a medal cannot ship with a placeholder on them.
  for (const page of PAGES) {
    if (page.medal && page.blocks.some((b) => b.kind === 'todo')) {
      problems.push(
        `"${page.title}" (${page.slug}) is a medal page and still has a todo block on it. ` +
          `It has to be finished and specific before the wiki freeze.`,
      )
    }
  }

  if (problems.length > 0) {
    console.warn(
      `Wiki content check found ${problems.length} problem(s):\n\n` +
        problems.map((p) => '  - ' + p).join('\n') +
        '\n\nThis warning only appears while running npm run dev.',
    )
  }
}
