/**
 * Season timeline for the Notebook page.
 *
 * Every entry is dated from the 2026 Notion meeting-notes database. This is the
 * team's *project* timeline, not a lab notebook: wet-lab protocol records live
 * in Benchling and should be summarised (and linked) here rather than retyped.
 *
 * TODO(content): add the wet-lab protocol summaries, and mark which entries are
 * complete vs in-progress once the season is further along.
 */

export interface TimelineEntry {
  /**
   * Free text, shown as a tag. Not parsed and not sorted on, so keep the house
   * format: "22 Nov 2025", or "20-28 Jan 2026" for a range. Entries appear in
   * the order they are written in the TIMELINE array below, not by date.
   */
  date: string
  title: string
  body: string
  /** Which subteam this belongs to. Shown as a small label beside the title. */
  team?: string
  /** A turning point. Adds a thick blue rule down the left of the entry. */
  milestone?: boolean
}

export const TIMELINE: TimelineEntry[] = [
  {
    date: '22 Nov 2025',
    title: 'A new E3 ligase',
    body: 'First advisor conversation sets the scope. The Kong lab has identified the MMM complex, a membrane E3 ubiquitin ligase, and that becomes the machine the whole project borrows.',
    team: 'Leadership',
    milestone: true,
  },
  {
    date: '2 Dec 2025',
    title: 'First DiMaio session',
    body: 'Dr. Frank DiMaio walks the team through the de novo design stack and the rules for choosing a target. Extracellular or membrane facing, and a solved structure preferred.',
    team: 'Protein Design',
  },
  {
    date: '23 Dec 2025',
    title: 'Winter plan drafted',
    body: 'Five-week ideation runway laid out: intro → other teams\' projects → mixer → ideation → worksheet → presentations and a vote.',
    team: 'Operations',
  },
  {
    date: '15 Jan 2026',
    title: 'Season kickoff',
    body: 'First all-hands of the year.',
    team: 'Leadership',
  },
  {
    date: '20–28 Jan 2026',
    title: 'Subteams launch',
    body: 'Human Practices, Kinetic Modeling, Operations, Web Development, Fundraising and Creative all hold their first meetings of the season.',
  },
  {
    date: '26 Jan 2026',
    title: 'Web Dev kickoff',
    body: 'Wiki research assignment, moodboards, and a refresh of the team website put on the board.',
    team: 'Web Development',
  },
  {
    date: '11 Feb 2026',
    title: 'New site published',
    body: 'The team website goes live and the source moves onto GitHub.',
    team: 'Web Development',
  },
  {
    date: '12 & 19–25 Feb 2026',
    title: 'Ideation presentations',
    body: 'A dozen-plus project proposals presented to the full team, each with target, mechanism and a feasibility case.',
    milestone: true,
  },
  {
    date: '2 Mar 2026',
    title: 'Joint Creative × HP × WebDev',
    body: 'iGEM Alchemy asset pipeline agreed: 512×512 PNGs, darker outlines, finals into the shared Drive by week four.',
    team: 'Web Development',
  },
  {
    date: '5 Mar 2026',
    title: 'Top-three vote closes',
    body: 'The field narrows. Finalists go to Dr. Kong and Dr. Vasquez for feasibility review during dead week.',
  },
  {
    date: '31 Mar 2026',
    title: 'Last year\'s feedback, distilled',
    body: 'Human Practices turns 2025 judging feedback into a concrete wiki brief: clearer flow, definitions alongside bolded terms, popups with pictures for hard words, charts instead of walls of text, and get it accessible early enough to collect feedback.',
    team: 'Human Practices',
    milestone: true,
  },
  {
    date: '8 Apr 2026',
    title: 'Project locked',
    body: 'The device targets the MMM complex (MEGF8, MOSMO, MGRN1) and Smoothened. Feasibility in the advising lab decided it.',
    milestone: true,
  },
  {
    date: '9 Apr 2026',
    title: 'iGEM Alchemy begins',
    body: 'Web Dev starts building the synbio combination game.',
    team: 'Web Development',
  },
  {
    date: '15 Apr 2026',
    title: 'First minibinder backbones',
    body: 'Protein Design has RFdiffusion backbones against the target.',
    team: 'Protein Design',
    milestone: true,
  },
  {
    date: '17 Apr 2026',
    title: 'ASUW spring fair',
    body: 'Tabling, spinny wheel, QR code through to the site.',
    team: 'Human Practices',
  },
  {
    date: '14 Apr – 5 May 2026',
    title: 'Version 0 model',
    body: 'Kinetic Modeling drafts the V0 construction doc, identifies target relationships from literature, and assigns parameters.',
    team: 'Kinetic Modeling',
  },
  {
    date: '30 Apr – 1 May 2026',
    title: 'Engineering Discovery Days',
    body: 'Two days of outreach with the UW College of Engineering.',
    team: 'Human Practices',
  },
  {
    date: '30 Apr 2026',
    title: 'Homepage done, pixel art next',
    body: 'Web Dev finishes the home page. The to-do list reads: more alchemy stuff, pixel art.',
    team: 'Web Development',
  },
  {
    date: '26 May 2026',
    title: 'Research symposium',
    body: 'The team presents.',
    milestone: true,
  },
  {
    date: '30 Jun – 23 Jul 2026',
    title: 'Robinson Center Summer Challenge',
    body: 'Summer teaching block with UW\'s Robinson Center, plus SoundBio camp sessions.',
    team: 'Human Practices',
  },
  {
    date: 'May to Jul 2026',
    title: 'Advisor meetings shape the model',
    body: 'Dr. Herbert Sauro meets the modeling subteam twice and moves it to a model-selection approach. A mid-quarter check-in with Dr. Jennifer Kong sets the wet-lab experiment plan.',
    team: 'Kinetic Modeling',
  },
  {
    date: 'Summer 2026',
    title: 'MOSMO binders and the assay plan',
    body: 'Protein Design has about 24 MOSMO binder backbones through sequence design. Wet Lab writes up the induced-proximity and two-hybrid assays.',
    team: 'Protein Design',
  },
  {
    date: '16 Jul 2026',
    title: 'Wiki theme chosen',
    body: 'Web Dev and Creative land on the garden: "hedgehog trimming hedge, garden, sonic the hedgehog." The Engineering page becomes the hub, with direct links out to each subteam.',
    team: 'Web Development',
    milestone: true,
  },
  {
    date: '18 Aug 2026',
    title: 'Web Dev presents',
    body: 'Web Dev\'s slot in the August all-hands rotation (HP 8/4, Creative + Wet Lab 8/11, Web Dev 8/18, Kinetic Modeling 8/25).',
    team: 'Web Development',
  },
  {
    date: 'Nov 2026',
    title: 'Final presentation video',
    body: 'The one deadline nobody misses. The team is disqualified without it.',
    milestone: true,
  },
]

/**
 * TODO(ops): no Jamboree date or wiki-freeze date appears anywhere in the Notion
 * export. Get both from the official iGEM calendar and add them here. The wiki
 * freeze in particular needs to be visible to everyone editing this site.
 */
export const MISSING_DATES = ['Wiki freeze', 'Jamboree', 'Judging form deadline', 'Safety form deadline']
