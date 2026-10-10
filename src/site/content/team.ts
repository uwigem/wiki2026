/**
 * The team page roster.
 *
 * Names, subteams and emails come from the team roster spreadsheet (October
 * 2026). Who counts as a student leader follows the leads marked on that sheet,
 * which matches the student leaders on the iGEM roster except for Fundraising,
 * where Charlotte took over from Winnie in summer 2026. Titles come from the
 * team's positions list.
 *
 * Bios, photos and links come from the profile form each member filled in
 * (October 2026). The bios are rewritten from their answers into one pattern,
 * so every profile reads the same way. Charlotte, Ruhi and Winnie did not fill
 * it in, so theirs are short and use the roster. Do not publish the
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
  /**
   * Two or three sentences, first person, in one pattern: "Hi, I’m Name! I’m a
   * second-year Bioengineering major on the Wet Lab subteam." then a line on
   * what they do or enjoy. Keep to it, so the profiles read alike.
   */
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
    bio:
      'Hi, I’m Samaira! I’m a fourth-year Biochemistry major with an Applied Mathematics minor, and I co-lead the team and lead the wet lab. Outside of iGEM, I love eating my way through Seattle and playing board games with friends.',
    linkedin: 'https://www.linkedin.com/in/samaira-bakshi',
    photo: 'team/samaira-bakshi.jpg',
  },
  {
    name: 'Alex Devgan',
    titles: ['Co-President', 'Human Practices Lead (Education)'],
    email: 'adevgan@uw.edu',
    subteams: ['human-practices'],
    leads: ['human-practices'],
    leader: true,
    bio:
      'Hi, I’m Alex! I’m a senior Biochemistry major, and I co-lead the team and lead the Education subteam. Outside of iGEM, I enjoy reading, going to the movies, and crocheting.',
    photo: 'team/alex-devgan.jpg',
  },
  {
    name: 'Eliza Dawley',
    titles: ['Protein Design Lead'],
    email: 'elizapda@uw.edu',
    subteams: ['protein-design'],
    leads: ['protein-design'],
    leader: true,
    bio:
      'Hi, I’m Eliza! I’m a third-year Bioengineering major interested in computational biology and neuroscience, and I lead Protein Design. Outside of iGEM, I love backpacking, downhill skiing, ping pong, and poker.',
    linkedin: 'https://www.linkedin.com/in/eliza-dawley-592000327',
    photo: 'team/eliza-dawley.jpg',
  },
  {
    name: 'Aimee Furlan',
    titles: ['Kinetic Modeling Lead'],
    email: 'afurlan@uw.edu',
    subteams: ['kinetic-modeling'],
    leads: ['kinetic-modeling'],
    leader: true,
    bio:
      'Hi, I’m Aimee! I’m a Statistics and Biochemistry major, and I lead Kinetic Modeling. In my free time, I paint landscapes and try out new baking recipes.',
    photo: 'team/aimee-furlan.jpg',
  },
  {
    name: 'Jaiden Poon',
    titles: ['Human Practices Lead (Integrated)'],
    email: 'jpoon4@uw.edu',
    subteams: ['human-practices'],
    leads: ['human-practices'],
    leader: true,
    bio:
      'Hi, I’m Jaiden! I’m a Bioengineering major, and I lead Integrated Human Practices. I’m excited about using synthetic biology to build technologies that improve accessibility and quality of life. Outside of iGEM, I enjoy learning languages and travelling.',
    linkedin: 'https://www.linkedin.com/in/jaiden-poon',
  },
  {
    name: 'Charlotte Hsu',
    titles: ['Fundraising Lead'],
    email: 'charhsu@uw.edu',
    subteams: ['fundraising'],
    leads: ['fundraising'],
    leader: true,
    bio:
      'Hi, I’m Charlotte! I’m a Biochemistry major, and I lead Fundraising.',
  },
  {
    name: 'Rishabh Goenka',
    titles: ['Web Development Lead'],
    email: 'rish9@uw.edu',
    subteams: ['web-dev'],
    leads: ['web-dev'],
    leader: true,
    bio:
      'Hi, I’m Rishabh! I’m an Electrical and Computer Engineering major, and I lead Web Development. I’m passionate about research and photography.',
    linkedin: 'https://www.linkedin.com/in/rishabh-goenkx',
    website: 'https://www.rishabhgoenka.com/',
    photo: 'team/rishabh-goenka.jpg',
  },
  {
    name: 'Neel Sundar',
    email: 'sundarn@uw.edu',
    subteams: ['web-dev'],
    leader: true,
    bio:
      'Hi, I’m Neel! I’m a third-year Human Centered Design and Engineering major on Web Development. I joined iGEM because I love making science easy for everyone to understand. Fun fact: I finished this iGEM season studying abroad in Hong Kong.',
    linkedin: 'https://www.linkedin.com/in/neel-sundar',
    photo: 'team/neel-sundar.jpg',
  },

  {
    name: 'Skyler Choi',
    email: 'yschoiuw@uw.edu',
    subteams: ['wet-lab'],
    bio:
      'Hi, I’m Skyler! I’m a senior Bioengineering major with minors in Data Science and Applied Mathematics, on the Wet Lab subteam. I love wet lab work and want to be great at dry lab too. Outside the lab, I like teaching, mentoring, and drinking matcha.',
    linkedin: 'https://www.linkedin.com/in/skyler-choi-2538152a3',
    photo: 'team/skyler-choi.jpg',
  },
  {
    name: 'Rohith Dinesh',
    email: 'rdinesh@uw.edu',
    subteams: ['kinetic-modeling'],
    bio:
      'Hi, I’m Rohith! I’m a second-year Biochemistry and Statistics major on the Kinetic Modeling subteam. I love music, and in my free time I play the saxophone.',
    linkedin: 'https://www.linkedin.com/in/rohithdinesh',
    photo: 'team/rohith-dinesh.jpg',
  },
  {
    name: 'Defne Dingiloglu',
    email: 'ddingi@uw.edu',
    subteams: ['protein-design', 'kinetic-modeling'],
    bio:
      'Hi, I’m Defne! I’m a second-year Computer Science major on the Protein Design and Kinetic Modeling subteams. I love reading, swimming, and hiking.',
    linkedin: 'https://www.linkedin.com/in/defne-dingiloglu',
    photo: 'team/defne-dingiloglu.jpg',
  },
  {
    name: 'Teo Fine',
    email: 'tfine@uw.edu',
    subteams: ['protein-design'],
    bio:
      'Hi, I’m Teo! I’m a Bioengineering major on the Protein Design subteam, and I’m interested in creating the future of synthetic biology.',
  },
  {
    name: 'Alvin Fu',
    email: 'alvinf2@uw.edu',
    subteams: ['kinetic-modeling', 'protein-design'],
    bio:
      'Hi, I’m Alvin! I’m a Biochemistry major on the Kinetic Modeling and Protein Design subteams, and I enjoy all kinds of modeling. In my free time, I play instruments and practice martial arts tricking.',
    linkedin: 'https://www.linkedin.com/in/alvin-fu-66a022344',
    photo: 'team/alvin-fu.jpg',
  },
  {
    name: 'Ruhi Gottumukkala',
    email: 'rgottu@uw.edu',
    subteams: ['web-dev'],
    bio:
      'Hi, I’m Ruhi! I’m a Computer Science major on the Web Development subteam.',
  },
  {
    name: 'Iris Guo',
    email: 'iguo@uw.edu',
    subteams: ['human-practices', 'web-dev'],
    bio:
      'Hi, I’m Iris! I’m a third-year Computer Science and Mathematics major on the Web Development and Human Practices subteams. I enjoy video games, drawing, and reading.',
    photo: 'team/iris-guo.jpg',
  },
  {
    name: 'Navya Gupta',
    email: 'navyag6@uw.edu',
    subteams: ['wet-lab'],
    bio:
      'Hi, I’m Navya! I’m a third-year Molecular, Cellular and Developmental Biology major on the Wet Lab subteam.',
    photo: 'team/navya-gupta.jpg',
  },
  {
    name: 'Sanjana Iyer',
    email: 'siyer3@uw.edu',
    subteams: ['kinetic-modeling'],
    bio:
      'Hi, I’m Sanjana! I’m a third-year Bioengineering major on the Kinetic Modeling subteam. I love knitting, crocheting, and working out.',
    linkedin: 'https://www.linkedin.com/in/sanjanaiyer16',
    photo: 'team/sanjana-iyer.jpg',
  },
  {
    name: 'Darrien Liang',
    email: 'dliang06@uw.edu',
    subteams: ['human-practices'],
    bio:
      'Hi, I’m Darrien! I’m a third-year Bioengineering and Computer Science major from Bellevue, WA, on the Human Practices subteam. When I’m free, I love golfing and doing puzzles with friends.',
    linkedin: 'https://www.linkedin.com/in/darrienliang',
    photo: 'team/darrien-liang.jpg',
  },
  {
    name: 'Winnie Lin',
    titles: ['Fundraising Lead until summer 2026'],
    email: 'winilin@uw.edu',
    subteams: ['fundraising'],
    bio:
      'Hi, I’m Winnie! I’m a Business major, and I led Fundraising until summer 2026.',
  },
  {
    name: 'Sophia Nguyen',
    titles: ['Creative Lead'],
    email: 'hgnuyen@uw.edu',
    subteams: ['creative'],
    leads: ['creative'],
    bio:
      'Hi, I’m Sophia! I’m a Microbiology major, and I lead the Creative subteam.',
    photo: 'team/sophia-nguyen.jpg',
  },
  {
    name: 'Mansi Patwardhan',
    email: 'mpatwar4@uw.edu',
    subteams: ['fundraising'],
    bio:
      'Hi, I’m Mansi! I’m a second-year Bioengineering major on the Fundraising subteam, helping secure funding for our project. Outside of iGEM, you can often find me baking or reading.',
    linkedin: 'https://www.linkedin.com/in/mansi-patwardhan',
    photo: 'team/mansi-patwardhan.jpg',
  },
  {
    name: 'Tanvi Penubothu',
    email: 'tpenubot@uw.edu',
    subteams: ['wet-lab'],
    bio:
      'Hi, I’m Tanvi! I’m a third-year Molecular, Cellular and Developmental Biology major on the Wet Lab subteam. Outside the lab, I enjoy reading, creative writing, and photography.',
    linkedin: 'https://www.linkedin.com/in/tpenubot',
    photo: 'team/tanvi-penubothu.jpg',
  },
  {
    name: 'Ho Ren',
    email: 'hren7@uw.edu',
    subteams: ['wet-lab'],
    bio:
      'Hi, I’m Ho! I’m a second-year Bioengineering major on the Wet Lab subteam, interested in genetic engineering and synthetic biology.',
    linkedin: 'https://www.linkedin.com/in/ho-ren-bioengineer',
    photo: 'team/ho-ren.jpg',
  },
  {
    name: 'Gurnoor Sandhu',
    email: 'gsandh23@uw.edu',
    subteams: ['creative'],
    bio:
      'Hi, I’m Gurnoor! I’m a senior Biology major on the Creative subteam. I helped create our informational and promotional posts and worked with the other subteams on outreach.',
  },
  {
    name: 'Selina Shah',
    email: 'sshah707@uw.edu',
    subteams: ['creative'],
    bio:
      'Hi, I’m Selina! I’m a second-year Bioengineering major on the Creative subteam, and I helped design the visuals for our project.',
    linkedin: 'https://www.linkedin.com/in/selina-shah',
    photo: 'team/selina-shah.jpg',
  },
  {
    name: 'Zaina Sheikh',
    email: 'zainaskh@uw.edu',
    subteams: ['fundraising'],
    bio:
      'Hi, I’m Zaina! I’m a second-year Accounting major with a Chemistry minor, on the Fundraising subteam.',
    linkedin: 'https://www.linkedin.com/in/zainanskh',
    photo: 'team/zaina-sheikh.jpg',
  },
  {
    name: 'Eva Trapido',
    email: 'evat20@uw.edu',
    subteams: ['protein-design'],
    bio:
      'Hi, I’m Eva! I’m a third-year Bioengineering major on the Protein Design subteam, where I help create, run, and validate our de novo protein design pipelines. Outside of school, I love to knit, read, bake, and walk around Seattle.',
    photo: 'team/eva-trapido.jpg',
  },
  {
    name: 'Shannon Victor',
    email: 'shavic@uw.edu',
    subteams: ['human-practices'],
    bio:
      'Hi, I’m Shannon! I’m a second-year Bioengineering major on the Human Practices subteam. I’m excited about synthetic biology in medicine and hope to work in translational research. Outside of iGEM, I love reading and exploring new places.',
    linkedin: 'https://www.linkedin.com/in/shannon-victor-99ba6b2b3',
    photo: 'team/shannon-victor.jpg',
  },
  {
    name: 'Victoria Wang',
    email: 'chingyen@uw.edu',
    subteams: ['wet-lab'],
    bio:
      'Hi, I’m Victoria! I’m a Biochemistry and Real Estate major on the Wet Lab subteam. In my free time, I enjoy playing tennis and trying new restaurants.',
    linkedin: 'https://www.linkedin.com/in/victoria-ching-yen-wang',
    photo: 'team/victoria-wang.jpg',
  },
  {
    name: 'Trevor White',
    email: 'tw256@uw.edu',
    subteams: ['protein-design', 'web-dev'],
    bio:
      'Hi, I’m Trevor! I’m a second-year Computer Science and Biology major on the Protein Design and Web Development subteams. I write and organize the scripts for our de novo protein design pipelines, and I helped build this wiki. Outside of school, I love to read, cook, and play games.',
    linkedin: 'https://www.linkedin.com/in/trevor-white-aa40123bb',
    photo: 'team/trevor-white.jpg',
  },
  {
    name: 'Selena Xu',
    email: 'selenax@uw.edu',
    subteams: ['human-practices', 'protein-design'],
    bio:
      'Hi, I’m Selena! I’m a second-year Computer Science and Biochemistry major on the Human Practices and Protein Design subteams. Outside of iGEM, I enjoy knitting, painting, and playing video games.',
    linkedin: 'https://www.linkedin.com/in/selenaxu29',
    photo: 'team/selena-xu.jpg',
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
