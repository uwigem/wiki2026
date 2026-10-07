/**
 * The team page roster.
 *
 * Names, subteams, emails and majors come from the team roster spreadsheet
 * (October 2026). Who counts as a student leader follows the leads marked on
 * that sheet, which matches the student leaders on the iGEM roster except for
 * Fundraising, where Charlotte took over from Winnie in summer 2026. Titles come
 * from the team's positions list.
 *
 * Everything on a profile beyond that (bio, photo, LinkedIn, website) is for
 * each person to add on their own line. See CONTRIBUTING.md. Do not publish the
 * demographics survey or scholarship data.
 */

export type FlowerKind = 'lilac' | 'bluebell' | 'white' | 'daisy' | 'pink' | 'heart' | 'fern' | 'berry' | 'tree'

export type SubteamId =
  | 'protein-design'
  | 'kinetic-modeling'
  | 'wet-lab'
  | 'human-practices'
  | 'creative'
  | 'web-dev'
  | 'fundraising'

export interface Subteam {
  id: SubteamId
  name: string
  /** The emblem beside the subteam's name. */
  flower: FlowerKind
  /** One or two plain sentences on what the subteam does. */
  blurb: string
}

/** One student. Only `name`, `email` and `subteams` are required. */
export interface Member {
  name: string
  /** Positions held, shown under the name. Leave out for members without one. */
  titles?: string[]
  email: string
  subteams: SubteamId[]
  /** Subteams this person leads. Their tile in that subteam is tagged. */
  leads?: SubteamId[]
  /** A student leader. These people are shown together at the top of the page. */
  leader?: true
  major?: string
  /** A sentence or two, written by the person themselves. */
  bio?: string
  /** Full address, starting with https://. Anything else is not shown. */
  linkedin?: string
  /** Full address, starting with https://. Anything else is not shown. */
  website?: string
  /**
   * Headshot, as a path inside `public/`, for example `team/your-name.jpg`. No
   * leading slash. Shown when someone opens the profile. Without one, the pixel
   * character stands in, which is also the opt-out for anyone who would rather
   * not have a photo on a public site.
   */
  photo?: string
  /**
   * The pixel character's hair: `'long'` or `'short'`. Set it to whatever you
   * prefer. Left unset, it is guessed from the first name, which is wrong for
   * some people. Colours come from the name; to pin those, see LOOK_OVERRIDES
   * in src/site/components/PixelPerson.tsx.
   */
  avatar?: 'long' | 'short'
}

export const SUBTEAMS: Subteam[] = [
  {
    id: 'protein-design',
    name: 'Protein Design',
    flower: 'lilac',
    blurb:
      'Runs the de novo pipeline (RFdiffusion3, ProteinMPNN, RoseTTAFold3, BindCraft, Rosetta) on Hyak and DIGS, mentored by Dr. Frank DiMaio at the Institute for Protein Design.',
  },
  {
    id: 'kinetic-modeling',
    name: 'Kinetic Modeling',
    flower: 'bluebell',
    blurb:
      'Builds the ODE model of the Hedgehog and MMM system, and tests whether the binder can bring ciliary SMO back to a normal level. Advised by Dr. Herbert Sauro.',
  },
  {
    id: 'wet-lab',
    name: 'Wet Lab',
    flower: 'white',
    blurb:
      'Cloning, transfection, and the induced-proximity and two-hybrid assays in NIH/3T3 and HEK293T cells. Advised by Dr. Jennifer Kong and Dr. Claudia Vasquez.',
  },
  {
    id: 'human-practices',
    name: 'Human Practices',
    flower: 'daisy',
    blurb:
      'Integrated Human Practices interviews, plus education and outreach: the video series, trivia tabling, the central dogma bracelet, and iGEM Alchemy.',
  },
  {
    id: 'creative',
    name: 'Creative',
    flower: 'pink',
    blurb: 'Brand, illustration, the post series, iGEM Alchemy artwork, the promo video, and the presentation video.',
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    flower: 'heart',
    blurb: 'The team website, this wiki, and iGEM Alchemy.',
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    flower: 'berry',
    blurb: 'Grants, the Student Technology Fee, departmental asks, and reagent sponsors.',
  },
]

/** Shown as one line in the page header. From the iGEM team roster. */
export const PRINCIPAL_INVESTIGATOR = 'Dr. Jennifer Kong, Assistant Professor'

/**
 * Every student on the team. Student leaders first, in this order; everyone
 * else alphabetically by surname.
 */
export const ROSTER: Member[] = [
  {
    name: 'Samaira Bakshi',
    titles: ['Co-President', 'Wet Lab Lead'],
    email: 'samaira@uw.edu',
    subteams: ['wet-lab'],
    leads: ['wet-lab'],
    leader: true,
    major: 'Biochemistry',
  },
  {
    name: 'Alex Devgan',
    titles: ['Co-President', 'Human Practices Lead (Education)'],
    email: 'adevgan@uw.edu',
    subteams: ['human-practices'],
    leads: ['human-practices'],
    leader: true,
    major: 'Biochemistry',
  },
  {
    name: 'Eliza Dawley',
    titles: ['Protein Design Lead'],
    email: 'elizapda@uw.edu',
    subteams: ['protein-design'],
    leads: ['protein-design'],
    leader: true,
    major: 'Bioengineering',
  },
  {
    name: 'Aimee Furlan',
    titles: ['Kinetic Modeling Lead'],
    email: 'afurlan@uw.edu',
    subteams: ['kinetic-modeling'],
    leads: ['kinetic-modeling'],
    leader: true,
    major: 'Biochemistry and Statistics',
  },
  {
    name: 'Jaiden Poon',
    titles: ['Human Practices Lead (Integrated)'],
    email: 'jpoon4@uw.edu',
    subteams: ['human-practices'],
    leads: ['human-practices'],
    leader: true,
    major: 'Bioengineering',
  },
  {
    name: 'Charlotte Hsu',
    titles: ['Fundraising Lead'],
    email: 'charhsu@uw.edu',
    subteams: ['fundraising'],
    leads: ['fundraising'],
    leader: true,
    major: 'Biochemistry',
  },
  {
    name: 'Rishabh Goenka',
    titles: ['Web Development Lead'],
    email: 'rish9@uw.edu',
    subteams: ['web-dev'],
    leads: ['web-dev'],
    leader: true,
    major: 'Electrical and Computer Engineering',
  },
  {
    name: 'Neel Sundar',
    email: 'sundarn@uw.edu',
    subteams: ['web-dev'],
    leader: true,
    major: 'Human Centered Design and Engineering',
  },

  { name: 'Skyler Choi', email: 'yschoiuw@uw.edu', subteams: ['wet-lab'], major: 'Bioengineering' },
  { name: 'Rohith Dinesh', email: 'rdinesh@uw.edu', subteams: ['kinetic-modeling'], major: 'Biochemistry and Statistics' },
  {
    name: 'Defne Dingiloglu',
    email: 'ddingi@uw.edu',
    subteams: ['protein-design', 'kinetic-modeling'],
    major: 'Computer Science',
  },
  { name: 'Teo Fine', email: 'tfine@uw.edu', subteams: ['protein-design'], major: 'Bioengineering' },
  { name: 'Alvin Fu', email: 'alvinf2@uw.edu', subteams: ['kinetic-modeling', 'protein-design'], major: 'Biochemistry' },
  {
    name: 'Ruhi Gottumukkala',
    email: 'rgottu@uw.edu',
    subteams: ['web-dev'],
    major: 'Computer Science, intended Physics',
  },
  {
    name: 'Iris Guo',
    email: 'iguo@uw.edu',
    subteams: ['human-practices', 'web-dev'],
    major: 'Computer Science and Mathematics',
  },
  {
    name: 'Navya Gupta',
    email: 'navyag6@uw.edu',
    subteams: ['wet-lab'],
    major: 'Molecular, Cellular and Developmental Biology',
  },
  { name: 'Sanjana Iyer', email: 'siyer3@uw.edu', subteams: ['kinetic-modeling'], major: 'Bioengineering' },
  {
    name: 'Darrien Liang',
    email: 'dliang06@uw.edu',
    subteams: ['human-practices'],
    major: 'Bioengineering and Computer Science',
  },
  {
    name: 'Winnie Lin',
    titles: ['Fundraising Lead until summer 2026'],
    email: 'winilin@uw.edu',
    subteams: ['fundraising'],
    major: 'Business',
  },
  {
    name: 'Sophia Nguyen',
    titles: ['Creative Lead'],
    email: 'hgnuyen@uw.edu',
    subteams: ['creative'],
    leads: ['creative'],
    major: 'Microbiology',
  },
  { name: 'Mansi Patwardhan', email: 'mpatwar4@uw.edu', subteams: ['fundraising'], major: 'Intended Bioengineering' },
  {
    name: 'Tanvi Penubothu',
    email: 'tpenubot@uw.edu',
    subteams: ['wet-lab'],
    major: 'Molecular, Cellular and Developmental Biology',
  },
  { name: 'Horry Ren', email: 'hren7@uw.edu', subteams: ['wet-lab'], major: 'Intended Bioengineering' },
  { name: 'Gurnoor Sandhu', email: 'gsandh23@uw.edu', subteams: ['creative'], major: 'General Biology' },
  { name: 'Selina Shah', email: 'sshah707@uw.edu', subteams: ['creative'], major: 'Intended Bioengineering' },
  { name: 'Zaina Sheikh', email: 'zainaskh@uw.edu', subteams: ['fundraising'], major: 'Business' },
  { name: 'Eva Trapido', email: 'evat20@uw.edu', subteams: ['protein-design'], major: 'Bioengineering' },
  { name: 'Shannon Victor', email: 'shavic@uw.edu', subteams: ['human-practices'], major: 'Intended Bioengineering' },
  {
    name: 'Victoria Wang',
    email: 'chingyen@uw.edu',
    subteams: ['wet-lab'],
    major: 'Biochemistry and Real Estate',
  },
  {
    name: 'Trevor White',
    email: 'tw256@uw.edu',
    subteams: ['protein-design', 'web-dev'],
    major: 'Computer Science, intended Biology',
  },
  {
    name: 'Selena Xu',
    email: 'selenax@uw.edu',
    subteams: ['human-practices', 'protein-design'],
    major: 'Intended Biochemistry and Computer Science',
  },
]

export const LEADERSHIP: Member[] = ROSTER.filter((m) => m.leader)

/** A subteam's members, with whoever leads it first. */
export function membersOf(id: SubteamId): Member[] {
  const inTeam = ROSTER.filter((m) => m.subteams.includes(id))
  return [...inTeam.filter((m) => m.leads?.includes(id)), ...inTeam.filter((m) => !m.leads?.includes(id))]
}

export const SUBTEAM_NAME: Record<SubteamId, string> = Object.fromEntries(
  SUBTEAMS.map((s) => [s.id, s.name]),
) as Record<SubteamId, string>

export const TEAM_PAGE_INTRO = `${ROSTER.length} University of Washington students across ${SUBTEAMS.length} subteams. Select anyone to see their profile.`
