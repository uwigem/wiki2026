/**
 * The wet lab's milestones, and the whole team's season.
 *
 * `WETLAB_MILESTONES` and `NEXT_STEPS` are the Notebook page. `TIMELINE` is
 * the team's *project* timeline, which the Notebook used to carry as well; it
 * no longer does, because the lab record was the thing a judge came for and
 * the outreach, web development and ideation entries buried it. The data is
 * kept here for whichever page takes it on.
 *
 * TODO(content): add the wet-lab protocol summaries, and decide where the
 * whole-team season log belongs now.
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
    body: 'Human Practices, Kinetic Modeling, Operations, Wiki Development, Fundraising and Creative all hold their first meetings of the season.',
  },
  {
    date: '26 Jan 2026',
    title: 'Wiki Dev kickoff',
    body: 'Wiki research assignment, moodboards, and a refresh of the team website put on the board.',
    team: 'Wiki Development',
  },
  {
    date: '11 Feb 2026',
    title: 'New site published',
    body: 'The team website goes live and the source moves onto GitHub.',
    team: 'Wiki Development',
  },
  {
    date: '12 & 19–25 Feb 2026',
    title: 'Ideation presentations',
    body: 'A dozen-plus project proposals presented to the full team, each with target, mechanism and a feasibility case.',
    milestone: true,
  },
  {
    date: '2 Mar 2026',
    title: 'Joint Creative × HP × Wiki Dev',
    body: 'iGEM Alchemy asset pipeline agreed: 512×512 PNGs, darker outlines, finals into the shared Drive by week four.',
    team: 'Wiki Development',
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
    body: 'Wiki Dev starts building the synbio combination game.',
    team: 'Wiki Development',
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
    body: 'Wiki Dev finishes the home page. The to-do list reads: more alchemy stuff, pixel art.',
    team: 'Wiki Development',
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
    body: 'Wiki Dev and Creative land on the garden: "hedgehog trimming hedge, garden, sonic the hedgehog." The Engineering page becomes the hub, with direct links out to each subteam.',
    team: 'Wiki Development',
    milestone: true,
  },
  {
    date: '18 Aug 2026',
    title: 'Wiki Dev presents',
    body: 'Wiki Dev\'s slot in the August all-hands rotation (HP 8/4, Creative + Wet Lab 8/11, Wiki Dev 8/18, Kinetic Modeling 8/25).',
    team: 'Wiki Development',
  },
  {
    date: 'Nov 2026',
    title: 'Final presentation video',
    body: 'The one deadline nobody misses. The team is disqualified without it.',
    milestone: true,
  },
]

/**
 * The wet lab's own engineering milestones, which the Notebook page leads
 * with. Separate from TIMELINE above: that is the whole team's season, this is
 * the record of designing and ordering the constructs.
 *
 * `status` says whether something has happened. Nothing here may imply that
 * laboratory experiments have been run; the constructs are still on order.
 */
export interface Milestone {
  /** Free text, shown as a tag: "August to September 2026", or "Upcoming". */
  date: string
  title: string
  /** One or more paragraphs. Inline formatting works. */
  body: string[]
  status: 'done' | 'upcoming'
}

export const WETLAB_MILESTONES: Milestone[] = [
  {
    date: 'March to June 2026',
    title: 'Project conceptualisation',
    body: [
      'Our initial research focused on the role of the MMM complex in regulating Smoothened (SMO) ubiquitination and Hedgehog signalling.',
      'Following discussions with our advisors, we identified two complementary strategies for engineering SMO regulation. **Downregulation:** induced recruitment of MGRN1 to SMO to promote ubiquitination. **Upregulation:** disruption of MMM-mediated SMO regulation using computationally designed MEGF8- and MOSMO-targeting binders.',
      'These strategies formed the basis of the HedgehogSense bidirectional signalling platform.',
    ],
    status: 'done',
  },
  {
    date: 'July to August 2026',
    title: 'Experimental workflow development',
    body: [
      'In consultation with the Kong Lab, we developed experimental strategies to evaluate the two proposed regulatory mechanisms.',
      'For induced recruitment, we established plans to test DmrA/DmrC-mediated heterodimerisation and ALFA/NbALFA-based recruitment. We identified appropriate negative and catalytic controls, and developed assays to assess SMO ubiquitination and abundance.',
      'In parallel, we planned a 96-well mammalian split-transcription-factor assay to screen computationally designed binders against MEGF8 and MOSMO. The proposed assay uses GFP and BFP expression to quantify intracellular binder and target interactions relative to matched negative controls.',
      'We also outlined subsequent functional assays, including ciliary SMO imaging and GLI-responsive luciferase measurements.',
    ],
    status: 'done',
  },
  {
    date: 'August to September 2026',
    title: 'Mammalian expression construct design',
    body: [
      'We designed ten mammalian expression constructs for evaluating chemically induced recruitment, ALFA/NbALFA-mediated recruitment, and the regulation of ciliary receptors.',
      'The constructs included SMO and GPR161 receptor fusions, MGRN1 recruitment constructs, catalytically inactive MGRN1 controls, MEGF8 intracellular-domain recruitment constructs, and a proximity-only control.',
      'Construct architectures were selected to evaluate recruitment efficiency, ubiquitination activity, and the potential applicability of the system to multiple ciliary receptors.',
    ],
    status: 'done',
  },
  {
    date: 'October 2026',
    title: 'DNA synthesis and cloning orders',
    body: [
      'Following construct design and sequence review, we submitted ten mammalian expression constructs to GenScript for synthesis and cloning into pcDNA3.1(+)-based expression vectors.',
      'Additional DNA fragments encoding computationally designed MEGF8 and MOSMO binders, and components of the mammalian interaction-screening system, were ordered from Twist Bioscience.',
      'These materials will support the proposed recruitment assays, intracellular binder screening, and downstream functional validation.',
      '**Status:** orders placed, delivery pending.',
    ],
    status: 'done',
  },
  {
    date: 'Upcoming',
    title: 'Experimental validation',
    body: [
      'Following construct delivery, the next stage will focus on plasmid preparation and verification, mammalian expression, and evaluation of the engineered recruitment systems.',
      'Subsequent experiments will investigate SMO ubiquitination, binder and target recognition, ciliary SMO localisation, and Hedgehog pathway activity.',
      'Experimental observations and results will be documented as the work progresses.',
    ],
    status: 'upcoming',
  },
]

/** What happens once the orders land, in order. */
export const NEXT_STEPS: { title: string; body: string }[] = [
  {
    title: 'Plasmid preparation and verification',
    body: 'Prepare and verify mammalian expression plasmids for subsequent transfection experiments.',
  },
  {
    title: 'Mammalian expression and recruitment assays',
    body: 'Evaluate construct expression and recruitment using the DmrA/DmrC and ALFA/NbALFA systems.',
  },
  {
    title: 'SMO ubiquitination analysis',
    body: 'Determine whether induced recruitment increases SMO ubiquitination relative to matched negative and catalytic controls.',
  },
  {
    title: 'Computational binder screening',
    body: 'Screen MEGF8- and MOSMO-targeting designs in HEK293T cells using the 96-well split-transcription-factor assay.',
  },
  {
    title: 'SMO trafficking and functional characterisation',
    body: 'Quantify ciliary SMO abundance and evaluate downstream Hedgehog signalling using fluorescence imaging and GLI-responsive reporter assays. Selected binders will undergo additional functional testing following expression and purification.',
  },
  {
    title: 'Combined regulatory system',
    body: 'If both regulatory mechanisms are independently validated, evaluate their combined effects on Hedgehog pathway activity.',
  },
]

/**
 * TODO(ops): no Jamboree date or wiki-freeze date appears anywhere in the Notion
 * export. Get both from the official iGEM calendar and add them here. The wiki
 * freeze in particular needs to be visible to everyone editing this site.
 */
export const MISSING_DATES = ['Wiki freeze', 'Jamboree', 'Judging form deadline', 'Safety form deadline']
