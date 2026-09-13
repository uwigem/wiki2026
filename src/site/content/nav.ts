/**
 * Navigation structure.
 *
 * Grouped rather than flat: 13 top-level signs would not fit a laptop nav, and
 * iGEM judges expect the standard page families. Groups open on hover (desktop)
 * and as an accordion (mobile).
 *
 * TODO(wiki): cross-check against the official 2026 required-pages list.
 * WebDev 7/27/26 has "Neel Task: Find required pages and make repo", and
 * "Things to Ask: Gold Categories" is still open. Contribution / Collaborations
 * / Judging-form pages may need to be added here.
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
    to: '/project/description',
    items: [
      { label: 'Description', to: '/project/description' },
      { label: 'Background', to: '/project/background' },
      { label: 'Design', to: '/project/design' },
      { label: 'Engineering', to: '/project/engineering' },
      { label: 'Results', to: '/project/results' },
      { label: 'Model', to: '/project/model' },
      { label: 'Notebook', to: '/project/notebook' },
    ],
  },
  {
    label: 'Impact',
    to: '/impact/human-practices',
    items: [
      { label: 'Human Practices', to: '/impact/human-practices' },
      { label: 'Education & Outreach', to: '/impact/education' },
      { label: 'Safety', to: '/impact/safety' },
    ],
  },
  {
    label: 'Team',
    to: '/team',
    items: [
      { label: 'The Team', to: '/team' },
      { label: 'Attributions', to: '/attributions' },
    ],
  },
  { label: 'Playground', to: '/playground' },
]

/** Flat list of every routable path, for the footer sitemap. */
export const ALL_ROUTES: NavItem[] = NAV.flatMap((g) => (g.items ? g.items : [{ label: g.label, to: g.to }]))

/** Which nav group owns a given path (drives the active-sprout marker). */
export function activeGroup(path: string): NavGroup | undefined {
  return (
    NAV.find((g) => g.to === path || g.items?.some((i) => i.to === path)) ??
    NAV.find((g) => g.to !== '/' && path.startsWith(g.to.split('/').slice(0, 2).join('/')))
  )
}
