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
 * Playground is not in the architecture document. It is kept because it is the
 * team's own toy, as a single sign at the end rather than inside a group.
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
      { label: 'Engineering', to: '/project/engineering' },
      { label: 'Proposed Implementation', to: '/project/implementation' },
    ],
  },
  {
    label: 'Wetlab',
    to: '/wetlab/experiments',
    items: [
      { label: 'Experiments', to: '/wetlab/experiments' },
      { label: 'Notebook', to: '/wetlab/notebook' },
      { label: 'Parts and Registry', to: '/wetlab/parts' },
    ],
  },
  {
    label: 'Drylab',
    to: '/drylab/model',
    items: [{ label: 'Model', to: '/drylab/model' }],
  },
  {
    label: 'Human Practices',
    to: '/human-practices/integrated',
    items: [
      { label: 'Integrated Human Practices', to: '/human-practices/integrated' },
      { label: 'Education', to: '/human-practices/education' },
    ],
  },
  {
    label: 'Team and Resources',
    to: '/team/contribution',
    items: [
      { label: 'Contribution', to: '/team/contribution' },
      { label: 'Judging', to: '/team/judging' },
      { label: 'The Team', to: '/team' },
      { label: 'Attributions', to: '/team/attributions' },
      { label: 'Safety', to: '/team/safety' },
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
