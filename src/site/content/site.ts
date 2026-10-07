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
 * TODO(creative): project name and logo are not final. "Tending the Hedge" is a
 * placeholder from the wiki-theme brainstorm. Swap it once Creative delivers.
 */
export const PROJECT_TITLE = 'Tending the Hedge'

export const PROJECT_TAGLINE = 'A dial for Hedgehog signaling, not a switch.'

export const PROJECT_SUBTITLE =
  'A modular device that borrows a natural degradation complex to raise or lower how much of a receptor stays in the primary cilium. We prove it on Hedgehog signaling, then show the same parts work on other receptors.'

/** One-sentence version for cards, meta description, and social previews. */
export const PROJECT_BLURB =
  'We build a modular tool that controls how much of a receptor stays in the primary cilium, using the cell’s own MMM degradation complex instead of blocking the receptor outright.'

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
  { label: 'iGEM 2025 wiki', href: 'https://2025.igem.wiki/washington/' },
  { label: 'Linktree', href: 'https://linktr.ee/WAigem' },
  // Ops 5/14/26 shared this as the donations page.
  { label: 'Donate', href: 'https://sites.google.com/uw.edu/washington-igem-donate/home' },
  // TODO(content): add Instagram / GitHub org links once confirmed with Creative + Neel.
]
