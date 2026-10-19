/**
 * The attributions page: who did what.
 *
 * Student entries come from the team's iGEM Attributions Form (October 2026),
 * all written the same way: a task, then one or two sentences in the past
 * tense saying what the person did for it. Keep new entries to that pattern so
 * every card reads alike. The task names follow iGEM's own list on the form.
 *
 * Students and the principal investigators are matched by name to the team
 * page (content/team.ts), which is where their photo, subteam and pixel
 * character come from. Mentors, and students who are not on the team page,
 * are defined here instead.
 */
import type { CreditLogoId } from './creditLogos'
import { PRINCIPAL_INVESTIGATORS, ROSTER, SUBTEAM_NAME, type Investigator, type Profile, type SubteamId } from './team'

export type Task =
  | 'analysis'
  | 'background-research'
  | 'conceptualisation'
  | 'data-curation'
  | 'entrepreneurship'
  | 'fundraising'
  | 'investigation'
  | 'lab-notebook'
  | 'project-administration'
  | 'public-engagement'
  | 'safety'
  | 'software'
  | 'visualisation'
  | 'wiki-coding'
  | 'writing'
  // For advisors, who are not on the iGEM form's task list.
  | 'mentorship'
  | 'protocols'
  | 'resources'

export const TASK_LABEL: Record<Task, string> = {
  analysis: 'Analysis',
  'background-research': 'Background Research',
  conceptualisation: 'Conceptualisation',
  'data-curation': 'Data Curation',
  entrepreneurship: 'Entrepreneurship',
  fundraising: 'Fundraising',
  investigation: 'Investigation',
  'lab-notebook': 'Lab Notebook',
  'project-administration': 'Project Administration',
  'public-engagement': 'Public Engagement',
  safety: 'Safety',
  software: 'Software',
  visualisation: 'Visualisation',
  'wiki-coding': 'Wiki Coding',
  writing: 'Writing',
  mentorship: 'Mentorship',
  protocols: 'Protocols',
  resources: 'Resources',
}

export interface Contribution {
  task: Task
  /** What they did, past tense, starting with the verb. Links and bold work. */
  did: string
}

/** The mentors, shown after the principal investigators. */
export const MENTORS: Investigator[] = [
  {
    name: 'Kirsten Thompson',
    titles: ['MD/PhD Student, Baker Lab'],
    photo: 'team/kirsten-thompson.jpg',
    bio: 'Kirsten Thompson is an MD/PhD student in the Baker Lab.',
  },
]

/**
 * Students on the iGEM roster who are not on the team page. They appear here
 * with a generated pixel character and no photo.
 */
export const ROSTER_EXTRAS: Profile[] = [{ name: 'Arhan', subteams: ['wet-lab'] }]

/** The principal investigators, then the mentors. */
export const ADVISORS: Investigator[] = [...PRINCIPAL_INVESTIGATORS, ...MENTORS]

/** Every student, in the team page's order, then anyone above. */
export const STUDENTS: Profile[] = [...ROSTER, ...ROSTER_EXTRAS]

/** Subteams to show on this page, where they differ from the team page's. */
const SUBTEAMS_HERE: Record<string, SubteamId[]> = {
  'Iris Guo': ['human-practices'],
}

/**
 * What someone is to the project, in a few words: shown under their name on
 * the card and over it in the opened card.
 */
export function roleOf(person: Profile): string {
  if (PRINCIPAL_INVESTIGATORS.some((p) => p.name === person.name)) return 'principal investigator'
  if (MENTORS.some((p) => p.name === person.name)) return 'mentor'
  return (SUBTEAMS_HERE[person.name] ?? person.subteams ?? []).map((id) => SUBTEAM_NAME[id]).join(' · ')
}

/**
 * What each person did, keyed by their name exactly as it appears on the team
 * page. Someone without an entry still gets a card, with their subteam only.
 */
export const CONTRIBUTIONS: Record<string, Contribution[]> = {
  /* ---- Principal investigators and mentors ---- */
  'Dr. Jennifer Kong': [
    { task: 'conceptualisation', did: 'Helped guide the team to the final project idea.' },
    { task: 'background-research', did: 'Helped guide the team with years of expertise.' },
    { task: 'mentorship', did: 'Guided the team’s biology, building on her lab’s work on the MMM complex.' },
    { task: 'project-administration', did: 'Coordinated shipments and lab equipment with the team.' },
    { task: 'resources', did: 'Supplied reagents.' },
    { task: 'safety', did: 'Trained the team on proper safety precautions.' },
  ],
  'Dr. Frank DiMaio': [
    { task: 'mentorship', did: 'Mentored the protein design work at the Institute for Protein Design.' },
    { task: 'conceptualisation', did: 'Set the tool choices, the filter metrics, and the target-selection rules.' },
    { task: 'resources', did: 'Gave us a seat on the DIGS cluster.' },
  ],
  'Kirsten Thompson': [
    { task: 'mentorship', did: 'Assisted the wet lab with its experimental protocols.' },
    {
      task: 'protocols',
      did: 'Designed the protocol for [Experiment 2, the computational binder screen](/protocols#exp2-golden-gate), for us to use.',
    },
  ],

  /* ---- Students ---- */
  'Samaira Bakshi': [
    { task: 'analysis', did: 'Analysed experimental data and reviewed results to help guide the next steps of our project.' },
    {
      task: 'conceptualisation',
      did: 'Helped develop our project idea, including the use of chemically induced protein recruitment to regulate Hedgehog signalling. Contributed to experimental planning and identifying appropriate controls.',
    },
    {
      task: 'background-research',
      did: 'Reviewed scientific literature on Hedgehog signalling, protein interactions, ubiquitination, and existing approaches to pathway regulation.',
    },
    {
      task: 'investigation',
      did: 'Contributed to wet lab work, including molecular cloning, cell culture, and experiments designed to test our system.',
    },
    { task: 'data-curation', did: 'Helped organise experimental results, protocols, and other research data for the team.' },
    {
      task: 'lab-notebook',
      did: 'Maintained records of laboratory activities, experimental procedures, and results to document our progress.',
    },
    {
      task: 'project-administration',
      did: 'Helped lead and coordinate team activities, assign responsibilities, organise meetings, and keep the project on schedule.',
    },
    {
      task: 'fundraising',
      did: 'Contributed to fundraising and to securing financial and material support for the team’s research and Jamboree participation.',
    },
    {
      task: 'visualisation',
      did: 'Contributed to planning the wiki layout, developing figures and graphics, and presenting our project in a clear and accessible format.',
    },
    {
      task: 'writing',
      did: 'Helped write, edit, and review wiki content, including scientific explanations, experimental documentation, and other project materials.',
    },
    {
      task: 'safety',
      did: 'Oversaw laboratory safety practices, completed iGEM safety documentation, and helped ensure that our experiments followed institutional and iGEM safety guidelines.',
    },
  ],
  'Alex Devgan': [
    { task: 'conceptualisation', did: 'Facilitated the ideation process and conducted literature review to refine project ideas.' },
    { task: 'background-research', did: 'Conducted a thorough literature review to guide the project’s direction.' },
    {
      task: 'project-administration',
      did: 'Delegated tasks throughout the team, and communicated between subteams to coordinate final deliverables.',
    },
    { task: 'public-engagement', did: 'Led the Education subteam in various outreach campaigns.' },
    {
      task: 'entrepreneurship',
      did: 'Conducted interviews with stakeholders to inform the project’s direction and identify possible customer groups.',
    },
    { task: 'writing', did: 'Wrote several components of the wiki to communicate the goals and scope of our project effectively.' },
  ],
  'Eliza Dawley': [
    { task: 'conceptualisation', did: 'Helped with ideation.' },
    { task: 'background-research', did: 'Conducted literature review.' },
    { task: 'software', did: 'Developed protein design pipelines.' },
  ],
  'Aimee Furlan': [
    { task: 'analysis', did: 'Reviewed data from the literature to identify and adapt data for use in modelling work.' },
    { task: 'conceptualisation', did: 'Assisted in literature review for project development.' },
    {
      task: 'background-research',
      did: 'Conducted literature review to identify modelling applications in the literature and to understand our target case.',
    },
    {
      task: 'project-administration',
      did: 'Delegated and identified tasks for the Kinetic Modeling subteam, and communicated between subteams to facilitate wiki writing.',
    },
    { task: 'software', did: 'Implemented model analytics tools and developed the ordinary differential equation system.' },
    { task: 'visualisation', did: 'Developed supplemental materials to showcase the outcomes of modelling results and mechanisms.' },
    { task: 'writing', did: 'Contributed to writing the modelling pages of the wiki.' },
  ],
  'Jaiden Poon': [
    {
      task: 'conceptualisation',
      did: 'Assisted with project ideation, pitching potential project ideas and voicing opinions and votes on them.',
    },
    { task: 'background-research', did: 'Conducted literature review to determine the scope and impact of the project.' },
    {
      task: 'project-administration',
      did: 'Led the Integrated Human Practices work, particularly the targeted stakeholder conversations, coordinated wiki ideas and design, and delegated research areas to subteam members.',
    },
    {
      task: 'public-engagement',
      did: 'Participated in and helped design Washington iGEM outreach programmes. Conducted stakeholder interviews on project direction, customer discovery, and go-to-market strategy.',
    },
    {
      task: 'entrepreneurship',
      did: 'Developed market models, conducted stakeholder interviews with startups and UW CoMotion on broader adoption pathways, and identified potential users to target.',
    },
    {
      task: 'writing',
      did: 'Wrote components of the Human Practices and Education pages, documenting our team’s work and the potential impact of our project.',
    },
  ],
  'Rishabh Goenka': [
    {
      task: 'visualisation',
      did: 'Designed the team’s design language and theme and the wiki’s visuals, including its pixel-art garden, animations, and interactive figures.',
    },
    {
      task: 'wiki-coding',
      did: 'Built the wiki from scratch: structure, layout, navigation, accessibility, and the final submission build.',
    },
    {
      task: 'software',
      did: 'Wrote the site’s code, including the scroll-driven homepage story, interactive charts, and the in-wiki version of iGEM Alchemy.',
    },
    { task: 'writing', did: 'Wrote and edited portions of the wiki, and turned each subteam’s drafts into finished pages.' },
    { task: 'background-research', did: 'Contributed to the literature review behind the project’s background.' },
    {
      task: 'project-administration',
      did: 'Led the Wiki Development subteam and coordinated the wiki’s content and deadlines across subteams.',
    },
  ],
  'Trevor White': [
    {
      task: 'analysis',
      did: 'Analysed and evaluated de novo binder outputs, and reviewed scientific literature on past iGEM projects, project proposals, and our current project.',
    },
    {
      task: 'conceptualisation',
      did: 'Proposed one of the final project ideas, and researched and gave feedback on several others, including the one that was chosen.',
    },
    {
      task: 'background-research',
      did: 'Read and summarised many peer-reviewed articles and other scientific literature to prepare for and take part in project ideation and early planning.',
    },
    {
      task: 'data-curation',
      did: 'Helped build the team’s cloud computing environment for de novo protein design, adding to this year’s and future years’ protein design capabilities. Filtered and organised the de novo binder outputs to choose which would be sent to the wet lab.',
    },
    {
      task: 'project-administration',
      did: 'Scheduled meetings and delegated tasks to organise the dry lab parts of the wiki. Organised and led many Protein Design meetings later in the year, including several with our PI.',
    },
    {
      task: 'software',
      did: 'Wrote scripts to run, manage, and use key components of our de novo protein generation pipeline, mainly organising and filtering the final results.',
    },
    {
      task: 'wiki-coding',
      did: 'Contributed to the wiki’s code as a member of the Wiki Development subteam, mainly on the dry lab pages.',
    },
    { task: 'visualisation', did: 'Planned the layouts and visual designs of several wiki pages.' },
    {
      task: 'writing',
      did: 'Helped write, edit, and review the wiki’s written content, again mainly on the dry lab pages.',
    },
  ],
  'Neel Sundar': [
    { task: 'analysis', did: 'Reviewed literature and past iGEM teams for our current project.' },
    { task: 'conceptualisation', did: 'Helped with project ideation.' },
    {
      task: 'project-administration',
      did: 'Helped with overall club planning through operations meetings, and helped run Wiki Development meetings.',
    },
    { task: 'public-engagement', did: 'Volunteered at Washington iGEM events.' },
    { task: 'wiki-coding', did: 'Helped code and build the wiki, including the Engineering page.' },
  ],
  'Skyler Choi': [
    { task: 'background-research', did: 'Conducted literature review.' },
    { task: 'investigation', did: 'Aided in wet lab testing.' },
  ],
  'Rohith Dinesh': [
    { task: 'visualisation', did: 'Curated the kinetic modelling graphs.' },
    { task: 'software', did: 'Developed kinetic models.' },
  ],
  'Defne Dingiloglu': [
    { task: 'analysis', did: 'Inspected designed binders and filtered them against metrics.' },
    {
      task: 'background-research',
      did: 'Read literature on binder design techniques, cellular protein concentrations, and the statistical analysis that can be used to evaluate model output.',
    },
    {
      task: 'investigation',
      did: 'Ran the binder design pipeline to generate novel proteins. Performed local sensitivity analysis and graphed the model outputs.',
    },
    { task: 'data-curation', did: 'Used six different metrics to filter designed binders.' },
    {
      task: 'software',
      did: 'Built the binder design pipeline script that automates protein generation, and wrote the script for local sensitivity analysis.',
    },
    {
      task: 'writing',
      did: 'Wrote the local sensitivity analysis section of the Model page and reviewed other wiki pages.',
    },
  ],
  'Teo Fine': [
    { task: 'conceptualisation', did: 'Aided in the ideation process.' },
    { task: 'background-research', did: 'Conducted literature review.' },
  ],
  'Alvin Fu': [
    {
      task: 'background-research',
      did: 'Reviewed the literature on Smoothened signalling to identify mechanisms of Smoothened regulation and to design ODE models of Smoothened signalling.',
    },
    {
      task: 'analysis',
      did: 'Identified literature values and experimental results to set objectives for the models and estimate parameters. Compared models on their accuracy against those objectives and on their simplicity.',
    },
    {
      task: 'software',
      did: 'Wrote ODE models in Tellurium and model-fitting pipelines. Implemented and compared variations of the models with different kinetic descriptions and reactions from the literature.',
    },
    { task: 'writing', did: 'Documented the modelling of Smoothened signalling, and its results, on the team wiki.' },
  ],
  'Ruhi Gottumukkala': [
    {
      task: 'wiki-coding',
      did: 'Contributed to the early gameplay of iGEM Alchemy as a member of the Wiki Development subteam.',
    },
  ],
  'Iris Guo': [
    { task: 'wiki-coding', did: 'Helped develop the wiki, including the Integrated Human Practices page.' },
    { task: 'public-engagement', did: 'Helped the Education subteam.' },
  ],
  'Charlotte Hsu': [
    {
      task: 'project-administration',
      did: 'Led the finance subteam to fund the team’s project and educational events.',
    },
    { task: 'fundraising', did: 'Collected and managed funds for the entire team.' },
  ],
  'Sanjana Iyer': [
    {
      task: 'background-research',
      did: 'Reviewed the literature on computational models of PROTAC systems, previous iGEM projects, and the Hedgehog signalling cascade.',
    },
    {
      task: 'software',
      did: 'Developed the core deterministic model, incorporating the de novo components into the SMO ubiquitination pathway, and implemented it computationally using Gillespie’s algorithm.',
    },
    { task: 'writing', did: 'Contributed to writing and editing the team wiki.' },
  ],
  'Darrien Liang': [
    {
      task: 'background-research',
      did: 'Reviewed the literature on the Hedgehog signalling pathway and ciliary protein function.',
    },
    {
      task: 'public-engagement',
      did: 'Created procedures and instructional guides for science education activities, and took part in outreach events.',
    },
    {
      task: 'entrepreneurship',
      did: 'Interviewed bioethicists and business experts, and identified key insights for regulatory approval and market modelling.',
    },
    { task: 'writing', did: 'Contributed to the project description and Human Practices sections.' },
  ],
  'Winnie Lin': [
    {
      task: 'project-administration',
      did: 'Led the finance subteam to fund the team’s project and educational events.',
    },
    { task: 'fundraising', did: 'Collected and managed funds for the entire team.' },
  ],
  'Sophia Nguyen': [
    { task: 'conceptualisation', did: 'Brainstormed and developed ideas for this year’s project.' },
    { task: 'project-administration', did: 'Helped coordinate projects and assignments between subteams.' },
    { task: 'public-engagement', did: 'Created graphics and videos to increase media engagement.' },
    {
      task: 'visualisation',
      did: 'Designed and edited visuals for the project, and created the project and presentation videos.',
    },
    { task: 'writing', did: 'Proofread and edited the team wiki.' },
  ],
  'Mansi Patwardhan': [
    {
      task: 'fundraising',
      did: 'Emailed major departments to secure funding for all of this year’s entrance fees and projects.',
    },
    {
      task: 'background-research',
      did: 'Reviewed scientific papers on the MMM complex and the Hedgehog signalling pathway to better understand the project.',
    },
  ],
  'Tanvi Penubothu': [
    { task: 'background-research', did: 'Conducted literature review.' },
    { task: 'investigation', did: 'Aided in wet lab testing.' },
  ],
  'Ho Ren': [
    {
      task: 'conceptualisation',
      did: 'Participated in brainstorming and developing ideas for the 2026 iGEM Jamboree.',
    },
    {
      task: 'background-research',
      did: 'Read papers on past iGEM projects, potential projects for this year, and other molecular and synthetic biology topics.',
    },
    {
      task: 'investigation',
      did: 'Developed the experimental protocol for the miniprep portion of testing the MGRN1-MOSMO minibinder. Actively participated in the wet lab experiments.',
    },
    { task: 'lab-notebook', did: 'Used the lab notebook to record all experimental procedures.' },
  ],
  'Gurnoor Sandhu': [
    {
      task: 'background-research',
      did: 'Read articles and research papers to better understand the project background.',
    },
    { task: 'conceptualisation', did: 'Brainstormed ideas for social media posts and other content.' },
    {
      task: 'public-engagement',
      did: 'Worked with other team members to engage high school students in an engineering exploration event.',
    },
    { task: 'visualisation', did: 'Created visuals for social media content and preliminary wiki designs.' },
    {
      task: 'writing',
      did: 'Reviewed and edited wiki pages, the promo video script, and the presentation video, as well as other documents throughout the season.',
    },
  ],
  'Selina Shah': [
    { task: 'conceptualisation', did: 'Brainstormed and developed ideas for social media content.' },
    { task: 'background-research', did: 'Read scientific papers to better understand the project’s direction.' },
    {
      task: 'public-engagement',
      did: 'Created and published content for social media platforms to communicate project details.',
    },
    {
      task: 'visualisation',
      did: 'Edited promotional materials and created animations for video content to communicate scientific information effectively.',
    },
  ],
  'Zaina Sheikh': [{ task: 'fundraising', did: 'Helped gather funds for the team.' }],
  'Eva Trapido': [
    {
      task: 'analysis',
      did: 'Analysed the literature for binder generation parameters, and analysed the metrics of generated binders for filtering.',
    },
    { task: 'background-research', did: 'Read primary literature on binder design and the MMM complex target.' },
    {
      task: 'investigation',
      did: 'Ran the binder design pipeline to generate protein binders that disrupt the MMM complex.',
    },
    {
      task: 'software',
      did: 'Wrote scripts to calculate, extract, and analyse metrics for generated binders, including energy calculations compared with the native binder complex and metadata on successful hotspots.',
    },
    { task: 'visualisation', did: 'Helped edit the presentation video deliverables.' },
    { task: 'writing', did: 'Contributed to the Engineering, Model, and Binder Design Pipeline wiki pages.' },
  ],
  'Shannon Victor': [{ task: 'public-engagement', did: 'Planned and helped run education events.' }],
  'Victoria Wang': [
    {
      task: 'conceptualisation',
      did: 'Participated in brainstorming and developing project ideas for the 2026 iGEM Jamboree.',
    },
    {
      task: 'analysis',
      did: 'Reviewed scientific literature on past iGEM projects, potential projects, and relevant topics in molecular and synthetic biology.',
    },
    {
      task: 'data-curation',
      did: 'Developed experimental protocols, including the procedures for the induced proximity assay and flow cytometry.',
    },
    { task: 'investigation', did: 'Conducted wet lab experiments to support project development and implementation.' },
    { task: 'lab-notebook', did: 'Helped maintain a detailed lab notebook of experimental procedures and results.' },
    {
      task: 'writing',
      did: 'Contributed to the wiki content for the Integrated Human Practices and Wet Lab pages.',
    },
  ],
  'Selena Xu': [
    { task: 'conceptualisation', did: 'Helped brainstorm and develop project ideas for the season.' },
    { task: 'investigation', did: 'Performed computational de novo protein design work.' },
    { task: 'data-curation', did: 'Helped curate de novo protein design software and data for future use.' },
    {
      task: 'public-engagement',
      did: 'Created activities and projects to increase public engagement with synthetic biology and improve accessibility to the field. Supported the reproducibility of our activities through open-source protocols.',
    },
    {
      task: 'entrepreneurship',
      did: 'Discussed how we would bring our project to market with industry experts and potential consumers (cilia researchers).',
    },
    {
      task: 'software',
      did: 'Contributed to the codebase for protein design, creating filtering criteria for transmembrane binder designs.',
    },
    {
      task: 'writing',
      did: 'Contributed to the Binder Design, Education, and Integrated Human Practices pages of the wiki.',
    },
  ],
  Arhan: [
    { task: 'investigation', did: 'Conducted wet lab testing.' },
    { task: 'background-research', did: 'Conducted literature review.' },
  ],
}

/** An organisation, or a piece of software, that the project relied on. */
export interface Credit {
  name: string
  /** One logo for each organisation the card names. */
  logos: CreditLogoId[]
  /** What it gave us. */
  did: string
  /** Where to find each organisation named on the card. Full https:// addresses. */
  links: { label: string; href: string }[]
}

export const SPONSORS: Credit[] = [
  {
    name: 'Institute for Protein Design',
    logos: ['ipd'],
    did: 'Lab space, mentorship, and funding.',
    links: [{ label: 'Institute for Protein Design', href: 'https://www.ipd.uw.edu/' }],
  },
  {
    name: 'Biochemistry Department',
    logos: ['uw'],
    did: 'Recurring annual support and the lab that hosts us.',
    links: [{ label: 'UW Biochemistry', href: 'https://sites.uw.edu/biochemistry/' }],
  },
  {
    name: 'Student Technology Fee',
    logos: ['stf'],
    did: 'Funds the Hyak compute we run the design pipeline on.',
    links: [{ label: 'Student Technology Fee', href: 'https://techfee.uw.edu/' }],
  },
  {
    name: 'Biology and Microbiology',
    logos: ['uw'],
    did: 'Departmental support.',
    links: [
      { label: 'UW Biology', href: 'https://www.biology.washington.edu/' },
      { label: 'UW Microbiology', href: 'https://microbiology.washington.edu/' },
    ],
  },
  {
    name: 'Reagent grants',
    logos: ['twist', 'genscript', 'neb', 'zymo'],
    did: 'DNA and reagents in kind from Twist Bioscience, GenScript, NEB, and Zymo.',
    links: [
      { label: 'Twist Bioscience', href: 'https://www.twistbioscience.com/' },
      { label: 'GenScript', href: 'https://www.genscript.com/' },
      { label: 'NEB', href: 'https://www.neb.com/' },
      { label: 'Zymo Research', href: 'https://www.zymoresearch.com/' },
    ],
  },
  {
    name: 'Research Computing Club',
    logos: ['rcc'],
    did: 'Access to the Hyak cluster.',
    links: [{ label: 'Research Computing Club', href: 'https://depts.washington.edu/uwrcc/' }],
  },
]

export const SOFTWARE: Credit[] = [
  {
    name: 'IPD software',
    logos: ['ipd'],
    did: '**RFdiffusion3** for backbone generation, **ProteinMPNN** for sequence design, and **RoseTTAFold3** for forward folding to check designs. All three come from the Institute for Protein Design.',
    links: [
      { label: 'RFdiffusion3', href: 'https://github.com/RosettaCommons/foundry' },
      { label: 'ProteinMPNN', href: 'https://github.com/dauparas/ProteinMPNN' },
      { label: 'RoseTTAFold3', href: 'https://github.com/RosettaCommons/foundry' },
    ],
  },
  {
    name: 'BindCraft',
    logos: ['software'],
    did: 'The second, more stringent design track.',
    links: [{ label: 'BindCraft', href: 'https://github.com/martinpacesa/BindCraft' }],
  },
  {
    name: 'Rosetta',
    logos: ['rosetta'],
    did: 'Interface scoring.',
    links: [{ label: 'Rosetta', href: 'https://rosettacommons.org/' }],
  },
  {
    name: 'PyMOL',
    logos: ['pymol'],
    did: 'Structural inspection.',
    links: [{ label: 'PyMOL', href: 'https://www.pymol.org/' }],
  },
  {
    name: 'Tellurium',
    logos: ['tellurium'],
    did: 'Modelling the ODE system.',
    links: [{ label: 'Tellurium', href: 'https://tellurium.analogmachine.org/' }],
  },
  {
    name: 'SciPy',
    logos: ['scipy'],
    did: 'Modelling the ODE system.',
    links: [{ label: 'SciPy', href: 'https://scipy.org/' }],
  },
]

/** Work that inspired the wiki's look, credited for the inspiration only. */
export const INSPIRATION: Credit[] = [
  {
    name: 'mellowminx',
    logos: ['game'],
    did: 'The look of this wiki’s garden is loosely inspired by *Reincarnated As An Adorable Walking Rock In A Peaceful Gardening Sim Game*, a cosy top-down pixel-art gardening game by the indie artist mellowminx, made for My First Game Jam: Winter 2023. We credit them for the inspiration.',
    links: [
      {
        label: 'The game on itch.io',
        href: 'https://mellowminx.itch.io/reincarnated-as-an-adorable-walking-rock-in-a-peaceful-gardening-sim-game',
      },
    ],
  },
]
