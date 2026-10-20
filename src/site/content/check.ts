import { PAGES } from './pages'
import { ALL_ROUTES, OLD_PATHS, STANDARD_PAGES } from './nav'
import { alchemyProblems } from './alchemy'
import { stakeholderId } from '../components/stakeholders'
import type { Block } from './pages'

/** Every block on a page, including those inside collapsed `details` sections. */
function flatten(blocks: Block[]): Block[] {
  return blocks.flatMap((b) => (b.kind === 'details' ? [b, ...flatten(b.blocks)] : [b]))
}

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
const HAND_WRITTEN_ROUTES = new Set(['/', '/team', '/notebook', '/alchemy'])

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

  // The ballot links judges straight to these paths (handbook pp. 45 and 48).
  for (const path of STANDARD_PAGES) {
    if (!slugs.includes(path) && !HAND_WRITTEN_ROUTES.has(path)) {
      problems.push(
        `"${path}" is an iGEM Standard Page, so judges' ballots link straight to it, but no page ` +
          `has that slug. Keep the exact name; see STANDARD_PAGES in src/site/content/nav.ts.`,
      )
    }
  }

  for (const [from, to] of Object.entries(OLD_PATHS)) {
    if (!navPaths.has(to) && !HAND_WRITTEN_ROUTES.has(to)) {
      problems.push(`OLD_PATHS sends "${from}" to "${to}", which is not a page any more.`)
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

  /*
   * The chapter number in each kicker has to follow the PAGES order by hand.
   *
   * Only pages whose kicker carries a chapter number count towards it. A page
   * with a plain kicker ("wetlab · results") is an interlude: it sits in the
   * reading order, so previous and next walk through it, but it does not take
   * a number and does not push the chapters after it along.
   */
  let chapter = 0
  for (const page of PAGES) {
    const match = page.kicker.match(/chapter\s+(\d+)/i)
    if (!match) continue
    chapter += 1
    if (Number(match[1]) !== chapter) {
      problems.push(
        `"${page.title}" is numbered chapter ${chapter} by its place in the PAGES array ` +
          `but its kicker says "chapter ${match[1]}". Reading order comes from the PAGES array, ` +
          `so either move the page or renumber the kickers after it.`,
      )
    }
  }

  /*
   * Links written inside the copy, for example
   * `[the pipeline](/engineering#pipeline)`.
   *
   * These are plain strings, so moving a page silently turns every link to it
   * into a trip to "This bed is empty". That is exactly what happened when the
   * site moved to the team's final architecture, so it is checked now. Every
   * string of a page is searched, whatever block it belongs to.
   */
  const idsByPage = new Map(
    PAGES.map((p) => [p.slug, new Set(flatten(p.blocks).map((b) => b.id).filter(Boolean) as string[])]),
  )
  for (const page of PAGES) {
    const content = JSON.stringify(page.blocks)
    for (const [, target] of content.matchAll(LINK)) {
      const [path, anchor] = target.split('#')
      // A link to a file under public/ (a handbook PDF) is not a page.
      if (/\.[a-z0-9]{2,5}$/i.test(path)) continue
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
    if (page.medal && flatten(page.blocks).some((b) => b.kind === 'todo')) {
      problems.push(
        `"${page.title}" (${page.slug}) is a medal page and still has a todo block on it. ` +
          `It has to be finished and specific before the wiki freeze.`,
      )
    }
  }

  // `[Name](stakeholder:id)` only works on a page whose stakeholders block has that id.
  const STAKEHOLDER_LINK = /\]\(stakeholder:([^)\s]+)\)/g
  for (const page of PAGES) {
    const ids = new Set(flatten(page.blocks).flatMap((b) => (b.kind === 'stakeholders' ? b.people.map(stakeholderId) : [])))
    for (const [, id] of JSON.stringify(page.blocks).matchAll(STAKEHOLDER_LINK)) {
      if (!ids.has(id)) {
        problems.push(
          `"${page.title}" links to stakeholder "${id}", but no person in its stakeholders block has that id, ` +
            `so the name renders as plain text. Ids default to the surname in lower case.`,
        )
      }
    }
    if (/\[placeholder/i.test(JSON.stringify(page.blocks))) {
      problems.push(`"${page.title}" (${page.slug}) still contains "[placeholder" text.`)
    }
    /*
     * Drafts arrive from the planning docs carrying their own markers, for
     * example "[REF TO Binder Design: HPC/Hyak]". They are not markdown links,
     * so the link check above never sees them, and they would otherwise ship
     * as literal text on a medal page.
     */
    if (/\[REF TO/i.test(JSON.stringify(page.blocks))) {
      problems.push(
        `"${page.title}" (${page.slug}) still contains a "[REF TO ...]" marker from a planning ` +
          `doc. Replace it with a real link, for example [Hyak](/contribution#hyak).`,
      )
    }
  }

  // The game's recipes: every level has to be finishable.
  for (const p of alchemyProblems()) problems.push(`iGEM Alchemy: ${p}`)

  if (problems.length > 0) {
    console.warn(
      `Wiki content check found ${problems.length} problem(s):\n\n` +
        problems.map((p) => '  - ' + p).join('\n') +
        '\n\nThis warning only appears while running npm run dev.',
    )
  }
}
