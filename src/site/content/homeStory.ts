/**
 * Home 3: the scroll-driven story, as data.
 *
 * Every word on Home 3 lives here, in the order of the team's script
 * ("HedgehogSense Main Page (scroll-driven animation)"). The drawing for each
 * scene is in `components/story/scenes.ts`; this file is only what it says
 * and how long each scene holds the screen.
 *
 * The script marks website copy in bold, and that formatting did not survive
 * being pasted in. So the split below is a judgement call, flagged in
 * docs/HOME3_PLAN.md: short statements are copy, and sentences that describe
 * what the picture does ("The garden moves aside...") are stage directions and
 * are not shown.
 *
 * To edit copy, change the strings below. Each scene is one scroll step: one
 * flick of the wheel or swipe moves to the next scene, and the scene then
 * plays by itself over `seconds`. Scrolling again before it finishes skips to
 * its end. To slow a scene down, raise its `seconds`.
 */

export type SceneId =
  | 'garden'
  | 'diseases'
  | 'cilium'
  | 'smo'
  | 'water'
  | 'parts'
  | 'mmm'
  | 'recruit'
  | 'release'
  | 'closing'

export interface Beat {
  /** Progress through the scene (0 to 1) at which this text takes over. */
  from: number
  /** Optional small line above the main text. */
  eyebrow?: string
  /** The main statement. Large type. */
  lead: string
  /** Supporting sentences. Smaller type, under the lead. */
  body?: string
}

export interface Scene {
  id: SceneId
  /** How long the scene takes to play by itself once the reader arrives. */
  seconds: number
  /** Text for the band beside or under the picture. Hero and closing have none. */
  beats: Beat[]
}

export const STORY: Scene[] = [
  { id: 'garden', seconds: 0, beats: [] },
  {
    id: 'diseases',
    seconds: 7.5,
    beats: [
      { from: 0, lead: 'Different diseases. Different parts of the body.' },
      {
        from: 0.8,
        lead: 'Different diseases. Different parts of the body.',
        body: 'But what do they all have in common?',
      },
    ],
  },
  {
    id: 'cilium',
    seconds: 6,
    beats: [
      { from: 0, lead: 'The connection is smaller than you think.' },
      {
        from: 0.62,
        lead: 'Meet the primary cilium.',
        body: 'A tiny hair on our cells with an important role in signaling.',
      },
    ],
  },
  {
    id: 'smo',
    seconds: 7.5,
    beats: [
      { from: 0, lead: 'Cells don’t just receive signals through the cilia. They need to regulate them.' },
      { from: 0.32, lead: 'Meet Smoothened, a key regulator of the signaling pathway called Hedgehog.' },
    ],
  },
  {
    id: 'water',
    seconds: 8.5,
    beats: [
      {
        from: 0,
        lead: 'Every garden needs balance.',
        body: 'Too little water, and a plant wilts. Too much, and it struggles just as much.',
      },
      { from: 0.8, lead: 'What if we could bring that same level of control to cellular signaling?' },
    ],
  },
  {
    id: 'parts',
    seconds: 4.5,
    beats: [{ from: 0, lead: 'What if we could control which proteins remain in the primary cilium?' }],
  },
  {
    id: 'mmm',
    seconds: 7,
    beats: [
      {
        from: 0,
        lead: 'Most cells have complex machinery to regulate proteins on the cilia, in order to achieve the precise level of control needed for health.',
        body: 'Meet the MMM complex.',
      },
      {
        from: 0.5,
        lead: 'Meet the MMM complex.',
        body: 'The MMM system helps control how much Smoothened accumulates in the primary cilium, influencing Hedgehog pathway regulation.',
      },
    ],
  },
  {
    id: 'recruit',
    seconds: 8,
    beats: [
      {
        from: 0,
        lead: 'Our project aims to build tools to recruit these machines to regulate new targets all throughout the primary cilia.',
      },
      {
        from: 0.45,
        lead: 'Our project aims to build tools to recruit these machines to regulate new targets all throughout the primary cilia.',
        body: 'We’re engineering ways to recruit MMM regulatory machinery to selected proteins, with the goal of giving researchers new tools to study and manipulate ciliary signaling.',
      },
    ],
  },
  {
    id: 'release',
    seconds: 8,
    beats: [
      { from: 0, lead: 'Just like a garden, cellular signaling needs careful regulation.' },
      {
        from: 0.4,
        lead: 'Just like a garden, cellular signaling needs careful regulation.',
        body: 'Alongside recruiting the MMM complex to new targets, we engineered a way to disrupt its regulatory interactions, potentially allowing ciliary protein abundance to recover.',
      },
    ],
  },
  // The last screen is the garden again, with the name, the line and the
  // gates to the rest of the site on it, all on one screen.
  { id: 'closing', seconds: 3.5, beats: [] },
]

export const HERO = {
  eyebrow: 'A living world depends on balance',
  welcome: 'Welcome to',
  tagline: 'Engineering control over cellular signaling.',
}

/**
 * Scene 2: one body region per condition, lit one at a time as you scroll.
 *
 * Only conditions the team has a source for: the Background page and the
 * team's interview with Dr. Stacey Ogden (St. Jude). Kidney and eye
 * ciliopathies are the obvious additions once the team has a source for them
 * (Dan Doherty was contacted about ciliopathies but not yet interviewed).
 */
export interface Condition {
  id: 'brain' | 'skin' | 'heart' | 'muscle'
  region: string
  name: string
  explanation: string
}

export const CONDITIONS: Condition[] = [
  {
    id: 'brain',
    region: 'Brain',
    name: 'Medulloblastoma',
    explanation:
      'A childhood brain tumour. About 30 percent of cases are driven by too much Hedgehog signaling.',
  },
  {
    id: 'skin',
    region: 'Skin',
    name: 'Basal cell carcinoma',
    explanation: 'A skin cancer, and the clearest case of Hedgehog signaling running too high.',
  },
  {
    id: 'heart',
    region: 'Heart',
    name: 'Heart conditions in children',
    explanation:
      'When Hedgehog signaling is misregulated during development, a child’s heart can form incorrectly.',
  },
  {
    id: 'muscle',
    region: 'Muscle',
    name: 'Rhabdomyosarcoma',
    explanation: 'A cancer of muscle tissue, one of the cancers linked to Hedgehog signaling.',
  },
]

export const CONDITION_SOURCE = 'Background page; interview with Dr. Stacey Ogden (St. Jude).'

/**
 * The closing screen's line. There is no button: the closing screen carries
 * the explore cards, and a separate "Explore the project" button beside them
 * would only repeat the first card.
 */
export const CLOSING = {
  tagline: 'Engineering control over cellular signaling.',
}

