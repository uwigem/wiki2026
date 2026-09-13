/**
 * The team, as flower beds.
 *
 * Roster and leads come from the team's own leader roster and all-student
 * roster (2026). Subteam placements follow those rosters. Anyone whose subteam
 * is not recorded is listed under UNPLACED_ROSTER, not guessed.
 *
 * TODO(ops): confirm every placement, and add a headshot and a one-line bio per
 * member. Do not publish the demographics survey or scholarship data.
 */

export type FlowerKind = 'lilac' | 'bluebell' | 'white' | 'daisy' | 'pink' | 'heart' | 'fern' | 'berry' | 'tree'

export interface Member {
  name: string
  role?: string
  bio?: string
  /**
   * Path under /public to this person's photo, shown in their profile card.
   * Without one, their pixel character stands in, which is also the opt-out for
   * anyone who would rather not have a photo up. TODO(ops): headshots.
   */
  photo?: string
  /**
   * Which pixel-character template this person gets: `'long'` or `'short'`
   * hair. Set it to whatever the person themselves prefers.
   *
   * Left unset, the template is guessed from the first name, which is wrong for
   * some people and is only a stopgap until everyone has said. Correcting your
   * own is a one-word edit on your own line. Colours (hair, skin, top,
   * trousers) are drawn deterministically from the name; to pin those too, see
   * LOOK_OVERRIDES in src/site/components/PixelPerson.tsx.
   */
  avatar?: 'long' | 'short'
}

export interface Subteam {
  id: string
  name: string
  flower: FlowerKind
  tagline: string
  blurb: string
  members: Member[]
}

export const SUBTEAMS: Subteam[] = [
  {
    id: 'leads',
    name: 'Leadership',
    flower: 'tree',
    tagline: 'the old tree everything else grows around',
    blurb:
      'Sets the season, runs the weekly all-hands, and keeps the subteams pointed at the same project.',
    members: [
      { name: 'Samaira Bakshi', role: 'Co-President, Wet Lab lead' },
      { name: 'Alex Devgan', role: 'Co-President, Human Practices (Education) lead' },
      { name: 'Skyler Choi', role: 'Project originator (Kong Lab)' },
    ],
  },
  {
    id: 'protein-design',
    name: 'Protein Design',
    flower: 'lilac',
    tagline: 'grows proteins that never existed before',
    blurb:
      'Runs the de novo pipeline (RFdiffusion3, ProteinMPNN, RoseTTAFold3, BindCraft, Rosetta) on Hyak and DIGS, mentored by Dr. Frank DiMaio at the Institute for Protein Design.',
    members: [
      { name: 'Eliza Dawley', role: 'Subteam lead' },
      { name: 'Trevor White' },
      { name: 'Eva Trapido' },
      { name: 'Rohith Dinesh', role: 'Immunogenicity screening' },
      { name: 'Defne Dingiloglu' },
      { name: 'Alvin Fu' },
      { name: 'Teo Fine' },
    ],
  },
  {
    id: 'kinetic-modeling',
    name: 'Kinetic Modeling',
    flower: 'bluebell',
    tagline: 'works out how fast things grow',
    blurb:
      'Builds the ODE model of the Hedgehog and MMM system, and tests whether the binder can bring ciliary SMO back to a normal level. Advised by Dr. Herbert Sauro.',
    members: [
      { name: 'Aimee Furlan', role: 'Subteam lead' },
      { name: 'Ruhi Gottumukkala', role: 'Model page' },
      { name: 'Sanjana Iyer' },
      { name: 'Lakshmi Osorio' },
    ],
  },
  {
    id: 'wet-lab',
    name: 'Wet Lab',
    flower: 'white',
    tagline: 'the hands in the soil',
    blurb:
      'Cloning, transfection, and the induced-proximity and two-hybrid assays in NIH/3T3 and HEK293T cells. Advised by Dr. Jennifer Kong and Dr. Claudia Vasquez.',
    members: [
      { name: 'Samaira Bakshi', role: 'Subteam lead' },
      { name: 'Horry Ren' },
      { name: 'Victoria Wang' },
      { name: 'Navya Gupta' },
      { name: 'Tanvi Penubothu' },
    ],
  },
  {
    id: 'human-practices',
    name: 'Human Practices',
    flower: 'daisy',
    tagline: 'opens the gate to everyone else',
    blurb:
      'Integrated Human Practices interviews plus education and outreach: the video series, trivia tabling, the central dogma bracelet, and the recipes behind iGEM Alchemy.',
    members: [
      { name: 'Jaiden Poon', role: 'Integrated HP lead' },
      { name: 'Alex Devgan', role: 'Education lead' },
      { name: 'Selena Xu' },
      { name: 'Iris Guo' },
      { name: 'Darrien Liang' },
      { name: 'Shannon Victor' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    flower: 'pink',
    tagline: 'paints the whole garden',
    blurb:
      'Brand, illustration, the post series, iGEM Alchemy artwork, the promo video, and the final presentation video.',
    members: [
      { name: 'Sophia Nguyen', role: 'Subteam lead' },
      { name: 'Gurnoor Sandhu' },
      { name: 'Selina Shah' },
      { name: 'Ivy Lee' },
    ],
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    flower: 'heart',
    tagline: 'built the garden you are standing in',
    blurb: 'The team website, this wiki, and iGEM Alchemy.',
    members: [
      { name: 'Neel Sundar', role: 'Subteam lead' },
      { name: 'Rishabh Goenka' },
      { name: 'Iris Guo' },
      { name: 'Trevor White' },
    ],
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    flower: 'berry',
    tagline: 'makes sure there is money for seeds',
    blurb:
      'Grants, the Student Technology Fee, departmental asks, and reagent sponsors.',
    members: [
      { name: 'Charlotte Hsu', role: 'Subteam lead' },
      { name: 'Winnie Lin', role: 'Outgoing lead' },
      { name: 'Mansi Patwardhan' },
      { name: 'Zaina Sheikh' },
    ],
  },
]

/**
 * People in the 2026 roster whose subteam is not recorded yet. Placement
 * pending, not a guess.
 */
export const UNPLACED_ROSTER: string[] = []

export const TEAM_PAGE_INTRO =
  'Every subteam is planted with its own flower. Click any bloom to meet the person tending it.'
