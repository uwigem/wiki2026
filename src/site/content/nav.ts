/**
 * Navigation structure: the team's final site architecture, agreed 2026-10-08.
 *
 * Grouped rather than flat, because a flat list of every page would not fit a
 * laptop nav and judges expect these families. Groups open on hover (desktop)
 * and as an accordion (mobile).
 *
 * The group labels are the architecture's own words. Page labels are the names
 * iGEM uses, so a judge can find a required page by its official name; the
 * titles inside the pages are written in the site's own voice.
 *
 * iGEM Alchemy sits in Human Practices, where it belongs, and again as a single
 * sign at the end: it is the one page people open for the fun of it, so it is
 * worth reaching without opening a group first.
 *
 * Paths are flat and use iGEM's names (`/model`, `/human-practices`, ...), the
 * same as the iGEM wiki template. Judges reach the award and medal pages from
 * fixed links on their ballot, https://2026.igem.wiki/washington/<name>, so
 * those names must not change. See STANDARD_PAGES below.
 */

export interface NavItem {
  label: string
  to: string
}

export interface NavGroup {
  label: string
  /** Where the group's own sign points (its first page). */
  to: string
  items?: NavItem[]
}

export const NAV: NavGroup[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Project',
    to: '/description',
    items: [
      { label: 'Description', to: '/description' },
      { label: 'Background', to: '/background' },
      { label: 'Engineering', to: '/engineering' },
      { label: 'Proposed Implementation', to: '/implementation' },
    ],
  },
  {
    label: 'Drylab',
    to: '/model',
    items: [{ label: 'Model', to: '/model' }],
  },
  {
    label: 'Human Practices',
    to: '/human-practices',
    items: [
      { label: 'Integrated Human Practices', to: '/human-practices' },
      { label: 'Education', to: '/education' },
      { label: 'iGEM Alchemy', to: '/alchemy' },
    ],
  },
  {
    label: 'Wetlab',
    to: '/experiments',
    items: [
      { label: 'Experiments', to: '/experiments' },
      { label: 'Protocols', to: '/protocols' },
      { label: 'Notebook', to: '/notebook' },
      { label: 'Parts and Registry', to: '/parts' },
      { label: 'Results', to: '/results' },
    ],
  },
  {
    label: 'Team and Resources',
    to: '/contribution',
    items: [
      { label: 'Contribution', to: '/contribution' },
      { label: 'Judging', to: '/judging' },
      { label: 'The Team', to: '/team' },
      { label: 'Attributions', to: '/attributions' },
    ],
  },
  { label: 'iGEM Alchemy', to: '/alchemy' },
]

/**
 * Flat list of every routable path, for the footer sitemap. A page may be in
 * the nav twice, the way iGEM Alchemy is in Human Practices and again at the
 * end, so the list keeps the first sign for each path and drops the repeats.
 */
export const ALL_ROUTES: NavItem[] = NAV.flatMap((g) =>
  g.items ? g.items : [{ label: g.label, to: g.to }],
).filter((r, i, all) => all.findIndex((o) => o.to === r.to) === i)

/** Which nav group owns a given path (drives the active-sprout marker). */
export function activeGroup(path: string): NavGroup | undefined {
  return NAV.find((g) => g.to === path || g.items?.some((i) => i.to === path))
}

/**
 * The iGEM Standard Pages this wiki is judged on. The ballot links straight to
 * these paths, so each one must be a real route with that exact name; the dev
 * content check fails loudly if one is not.
 *
 * Two sources, and the list is exactly the union of them for the awards we
 * actually declared. From the medal table (judge handbook p. 45):
 * `/contribution` for Bronze 3, `/engineering` for Silver 1 and
 * `/human-practices` for Silver 2. From the special-award table (p. 48), one
 * per declared award: `/model` and `/education`, with `/human-practices`
 * serving Best Integrated Human Practices as well.
 *
 * `/safety-and-security` is NOT here. It is a standard page only for the
 * Safety and Security Special Award (p. 48), which we did not pick, and safety
 * itself is judged from the Project Safety Form on the team dashboard (p. 24)
 * rather than from the wiki. Add the path back only if the Judging Form
 * changes.
 */
export const STANDARD_PAGES = [
  '/contribution',
  '/engineering',
  '/human-practices',
  '/model',
  '/education',
]

/**
 * Where the site's old addresses went, so a saved or shared link still lands on
 * the right page. Covers the nested paths used before October 2026, which also
 * arrive as old hash links such as `#/drylab/model`.
 */
export const OLD_PATHS: Record<string, string> = {
  '/playground': '/alchemy',
  '/project/description': '/description',
  '/project/background': '/background',
  '/project/engineering': '/engineering',
  '/project/design': '/engineering',
  '/project/implementation': '/implementation',
  '/project/model': '/model',
  '/wetlab/experiments': '/experiments',
  '/wetlab/notebook': '/notebook',
  '/wetlab/parts': '/parts',
  '/drylab/model': '/model',
  '/human-practices/integrated': '/human-practices',
  '/human-practices/education': '/education',
  '/team/contribution': '/contribution',
  '/team/judging': '/judging',
  '/team/attributions': '/attributions',
}
