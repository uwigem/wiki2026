/**
 * Site-wide strings. Change these first, everything else reads from here.
 *
 * Content is drawn from the team's 2026 project documents. Anything not settled
 * yet is marked with a plain TODO.
 */

export const TEAM_NAME = 'Washington iGEM'
export const TEAM_YEAR = '2026'
export const TEAM_LONG = 'Washington iGEM · University of Washington'

/**
 * The project's name. It replaced the brainstorm placeholder "Tending the
 * Hedge" in October 2026. Changing it here updates the nav, the footer, the
 * homepage sign and every browser tab title.
 */
export const PROJECT_TITLE = 'HedgehogSense'

export const PROJECT_TAGLINE = 'A dial for the cell’s antenna, not a switch.'

export const PROJECT_SUBTITLE =
  'Almost every cell grows a single antenna called the primary cilium, and some receptors only work while they are sitting in it. We are building a modular tool that sets how much of a chosen receptor stays there. Hedgehog signaling is where we prove it works.'

/** One-sentence version for cards, meta description, and social previews. */
export const PROJECT_BLURB =
  'We build a modular tool that sets how much of a chosen receptor stays in the primary cilium, by redirecting the cell’s own MMM degradation complex rather than blocking the receptor outright.'

export interface Cta {
  label: string
  to: string
  primary?: boolean
}

export const HOME_CTAS: Cta[] = [
  { label: 'Explore Project', to: '/project/description', primary: true },
  { label: 'Meet the Team', to: '/team' },
  { label: 'Playground', to: '/playground' },
]

export const FOOTER_LINKS = [
  { label: 'Washington iGEM team', href: 'https://students.washington.edu/uwigem/' },
  { label: 'Linktree', href: 'https://linktr.ee/WAigem' },
  // Ops 5/14/26 shared this as the donations page.
  { label: 'Donate', href: 'https://sites.google.com/uw.edu/washington-igem-donate/home' },
  // TODO(content): add Instagram / GitHub org links once confirmed with Creative + Neel.
]
