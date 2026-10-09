/**
 * Page content for the whole wiki.
 *
 * Content is written from the team's 2026 project documents. See
 * docs/PROJECT_CONTENT.md for the source mapping. Anything not settled yet is a
 * plain TODO. Editing the wiki means editing this file; the components do not
 * hard-code copy.
 *
 * Inline formatting (**bold**, *italic*, `code`) works in a block's `body`, and
 * only there: `prose`, `cards` items, `steps` items and `quote`. Everywhere else
 * the characters are published literally. See docs/STYLE_GUIDE.md for the table.
 */
import type { CycleData } from '../components/CycleWheel'
import type { MatrixRow } from '../components/CapabilityMatrix'
import type { Stat } from '../components/StatRow'
import type { DosePoint } from '../components/DoseCurve'
import type { FunnelStage } from '../components/FunnelChart'
import type { Pillar } from '../components/ProgrammePillars'
import type { Stakeholder } from '../components/StakeholderGarden'
import type { TornadoRow } from '../components/TornadoChart'
import type { ToolEntry } from '../components/ToolShed'
import { SMO_5L7D, type Structure } from './structures'

/**
 * Anything with an `id` can be linked to from anywhere else in the wiki, with
 * `[label](/drylab/model#that-id)`. Ids are kebab-case and have to be unique
 * within their page. Add one the moment a section is worth pointing at.
 */
export interface Anchored {
  id?: string
}

export interface CardItem {
  title: string
  body: string
  note?: string
}

export type Block = Anchored &
  (
  /** Paragraphs in a clean cream panel. The default. */
  | { kind: 'prose'; heading?: string; body: string[]; source?: string }
  /** A grid of flower-bed cards. */
  | { kind: 'cards'; heading?: string; intro?: string; items: CardItem[]; source?: string }
  /** A numbered path of stepping stones, for pipelines and cycles. */
  | { kind: 'steps'; heading?: string; intro?: string; items: CardItem[]; source?: string }
    /** The design/build/test/learn wheel, with one tab per cycle. */
  | { kind: 'cycles'; heading?: string; intro?: string; cycles: CycleData[] }
  /** A pulled-out quote on a wooden sign. */
  | { kind: 'quote'; body: string[]; source?: string }
  /** Compact key/value facts. */
  | { kind: 'facts'; heading?: string; items: { title: string; body: string }[] }
  /** The guide explaining the paragraph above in plain words. */
  | { kind: 'narration'; body: string[]; label?: string }
  /** A row of figures that carry an argument. */
  | { kind: 'stats'; heading?: string; intro?: string; items: Stat[]; footnote?: string; source?: string }
  /** What existing tools can and cannot do, side by side. */
  | {
      kind: 'matrix'
      heading?: string
      intro?: string
      columns: string[]
      rows: MatrixRow[]
      source?: string
    }
  /** The garden shed: the tools researchers already have, and where each stops. */
  | { kind: 'toolshed'; heading?: string; intro?: string; tools: ToolEntry[]; source?: string }
  /** Which parameters in a model actually move the answer. */
  | {
      kind: 'tornado'
      heading?: string
      intro?: string
      rows: TornadoRow[]
      unit?: string
      positiveMeans?: string
      negativeMeans?: string
      footnote?: string
      source?: string
    }
  /** A dose against response curve, with the limit it has to stay under. */
  | {
      kind: 'dose'
      heading?: string
      intro?: string
      points: DosePoint[]
      xLabel: string
      yLabel: string
      threshold?: { value: number; label: string }
      footnote?: string
      source?: string
    }
  /** How many candidates survive each filter. */
  | {
      kind: 'funnel'
      heading?: string
      intro?: string
      stages: FunnelStage[]
      goal?: { label: string; count: number }
      footnote?: string
      source?: string
    }
  /** The outreach programme, under the team's own four principles. */
  | { kind: 'pillars'; heading?: string; intro?: string; pillars: Pillar[]; source?: string }
  /** The people who shaped the project, as beds of flowers. */
  | {
      kind: 'stakeholders'
      heading?: string
      intro?: string
      people: Stakeholder[]
      pending?: string[]
      source?: string
    }
  /** A protein structure, drawn from coordinates. */
  | { kind: 'structure'; structure: Structure }
  /** The animated project mark, with a line saying what it is getting at. */
  | { kind: 'logo'; caption: string }
  /**
   * The interactive explainer: SMO in, SMO out, a blocker and a recruiter,
   * and the hedgehog reading the level. It used to open Home 1 and Home 2;
   * Home 3 tells the story its own way, so it lives here with the two arms.
   */
  | { kind: 'explainer' }
  /** A figure, or the marked hole where one is going. */
  | {
      kind: 'figure'
      src?: string
      alt?: string
      caption: string
      owner?: string
      ratio?: 'wide' | 'square' | 'tall'
      source?: string
    }
  /** A visible "not written yet" marker. */
  | { kind: 'todo'; body: string[] }
  )

export interface Page {
  slug: string
  title: string
  /** Pixel eyebrow label above the title. */
  kicker: string
  /**
   * This page is evidence for a medal criterion, so it has to be finished and
   * specific. The homepage counts too, and is not in this file.
   *
   * Marked so `content/check.ts` can shout while a medal page still has a
   * `todo` block in it.
   */
  medal?: true
  /** The guide's narration for this stop in the garden. */
  storyBeat: string
  /** Lede paragraph, rendered large under the title. */
  intro?: string
  blocks: Block[]
}

/* ===================================================================== *
 * PROJECT
 * ===================================================================== */

const description: Page = {
  slug: '/project/description',
  title: 'The Idea',
  kicker: 'chapter 01 · description',
  storyBeat: 'Every garden has someone deciding how tall the hedge grows. In your cells, that someone is a small protein complex, and we built a way to lean on it.',
  intro:
    'We are building a modular device that controls how much of a receptor stays in the primary cilium. We prove it on Hedgehog signalling, then show the same parts work on other receptors.',
  blocks: [
    {
      kind: 'prose',
      heading: 'The short version',
      body: [
        'The **Hedgehog pathway** is one of the handful of signals that pattern an animal during development, and one that drives cancer when it switches back on in adults. Its central transducer is **Smoothened (SMO)**, a receptor that has to sit in the **primary cilium** to be active.',
        'How much SMO sits in that cilium is not fixed. A membrane-bound complex called **MMM**, made of **MEGF8, MOSMO and MGRN1**, tags SMO for degradation and clears it out. MGRN1 is the enzyme, and MEGF8 and MOSMO are its adapters.',
        'We build a device out of three modular parts, a **targeting module**, an **inducible linker**, and an **E3 module**, that borrows this natural machinery to raise or lower how much of a receptor stays in the cilium.',
      ],
      source: 'How to frame the project (Wet Lab wiki notes), 2026.',
    },
    {
      kind: 'cards',
      id: 'two-arms',
      heading: 'Two arms, opposite directions',
      intro: 'Both arms are engineered, both are genetically encodable, and they push the same pathway in opposite directions.',
      items: [
        {
          title: 'Up arm',
          body: 'A **de novo minibinder** pries apart the MEGF8 and MOSMO interface. [How we design one](/project/engineering#pipeline). The MMM complex can no longer assemble, so it stops clearing SMO, so SMO stays in the cilium and Hedgehog signalling goes up.',
        },
        {
          title: 'Down arm',
          body: 'A **chemically induced linker** forces MGRN1 onto a chosen receptor. That receptor now gets tagged and cleared, so signalling through it goes down. We test this by recruiting MGRN1 to GPR161, a receptor MMM does not normally touch.',
        },
        {
          title: 'A dial, not a switch',
          body: 'Because the device works through a graded degradation step rather than blocking the receptor outright, the goal is to set the amount of receptor in the cilium, not just turn it off.',
        },
      ],
    },
    { kind: 'explainer', id: 'explainer' },
    {
      kind: 'prose',
      heading: 'From a therapy to a platform',
      body: [
        'We started out framing this as a Hedgehog therapy. After talking with researchers it became clear the more useful thing is a **modular research platform**, a way for any cilia lab to raise or lower a receptor of their choice and watch what happens. The reason that is worth doing is [the gap nothing else fills](/human-practices/integrated#the-gap). SMO is the receptor where the ground truth is already known, so it is our proof, not our endpoint. The down arm test on GPR161 is how we show the same parts port to a receptor the complex has no natural relationship with.',
        'Dr. Ning Zheng, a ubiquitination expert we interviewed, pointed out that because we strengthen an interaction that already exists rather than forcing a brand new one, the right name for this is a **LockTAC**, not a PROTAC. He also noted a transmembrane version of this has not been shown in the literature, which is where the novelty sits.',
      ],
      source: 'Interview with Dr. Ning Zheng (UW Pharmacology); IHP wiki outline.',
    },
  ],
}

const background: Page = {
  slug: '/project/background',
  title: 'A Problem in the Garden',
  kicker: 'chapter 02 · background',
  storyBeat: 'The hedge can grow too tall or not grow at all, and both are a problem. The tools we have today can only cut, not trim.',
  intro:
    'Hedgehog signalling has to be kept in a narrow band. Too much drives cancer, too little breaks development, and the drugs we have can only shut it off.',
  blocks: [
    {
      kind: 'logo',
      caption:
        'Hedgehog signalling is a balance, and both ends of it are dangerous. Tip it one way and you get cancer; tip it the other and development goes wrong. The drugs we have can only take one hedgehog off the scale entirely. What is missing is a way to set where the beam sits.',
    },
    {
      kind: 'prose',
      heading: 'Why the amount matters',
      body: [
        'Hedgehog signalling is a dial that cells read by how much SMO reaches the primary cilium. When it runs too high in adults it drives cancers, most clearly **basal cell carcinoma** and about **30 percent of medulloblastoma**, the childhood brain tumour. When it runs too low during development it causes serious birth defects.',
        'That is the core problem. The pathway is not something you want to switch off, it is something you want to hold in range. Dr. Stacey Ogden, a Hedgehog researcher at St. Jude we interviewed, made the point plainly. You do not give young children Hedgehog inhibitors, so a tool that can set the level rather than block it outright would be genuinely useful.',
      ],
      source: 'Interview with Dr. Stacey Ogden (St. Jude).',
    },
    {
      kind: 'prose',
      id: 'current-drugs',
      heading: 'The limits of the current drugs',
      body: [
        'The approved SMO inhibitors, vismodegib and sonidegib, block the receptor directly. Tumours mutate SMO and become resistant, and the drugs carry harsh side effects, which is why they are not given to children. Blocking is a blunt move on a pathway that is really about amount.',
        'We also state the limit up front, from the same interview. This approach works on cases driven by too much SMO. It does not help cases driven by mutations further down the pathway, in **SUFU** or **GLI**.',
        'What we propose instead is [a device with two arms](/project/description#two-arms), which sets the amount rather than blocking the receptor.',
      ],
      source: 'Interview with Dr. Stacey Ogden (St. Jude).',
    },
    {
      kind: 'cards',
      heading: 'What we get to build on',
      items: [
        {
          title: 'A membrane E3 ligase',
          body: 'The Kong lab identified the MMM complex, a membrane-bound E3 ubiquitin ligase that naturally controls SMO levels. That is the machine our device borrows.',
        },
        {
          title: 'MEGF8, MOSMO, MGRN1',
          body: 'MGRN1 is the enzyme. MEGF8 and MOSMO are adapters, and MOSMO stabilises the MEGF8 to MGRN1 binding. Take a part away and the complex stops working, which is what the up arm exploits.',
        },
        {
          title: 'A real structure',
          body: 'The Kong lab has cryo-EM of the complex and a preprint identifying a site whose mutation breaks it, so we have something concrete to design a binder against.',
        },
      ],
      source: 'Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358).',
    },
  ],
}

/**
 * How the binder is designed. These were a Design page of their own until the
 * team settled its final architecture (2026-10-08), which has no Design page,
 * so they now open the Engineering page: first how a design is made and
 * filtered, then the cycles of what went wrong and what changed.
 */
const designBlocks: Block[] = [
    {
      kind: 'prose',
      heading: 'What we are designing against',
      body: [
        'The up arm of the device is a **de novo minibinder** that sits on the **MEGF8 to MOSMO interface**. Break that interface and the MMM complex cannot assemble, so it stops ubiquitinating **Smoothened (SMO)**, so SMO stays in the cilium and Hedgehog signalling goes up.',
        'We picked this interface because the Kong lab has cryo-EM of the MMM complex and a preprint that points to a specific site whose mutation breaks the complex. That gives us a real structure and a real binding site to design toward, which is what a good target needs.',
      ],
      source: 'Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358); target-selection notes from Dr. Frank DiMaio.',
    },
    {
      kind: 'steps',
      id: 'pipeline',
      heading: 'The pipeline',
      intro: 'Every candidate walks this path. Most do not finish it.',
      items: [
        {
          title: 'Generate backbones',
          body: '**RFdiffusion3** builds candidate binder backbones against the target, guided by hotspot residues and a length range. It runs on the UW Hyak cluster inside a RosettaCommons foundry container.',
        },
        {
          title: 'Design sequences',
          body: '**ProteinMPNN** threads sequences onto each backbone, five sequences per backbone.',
        },
        {
          title: 'Forward fold',
          body: '**RoseTTAFold3** folds each designed sequence together with the target to check that it is predicted to bind, at about 40 sequences per hour per GPU. MOSMO and MEGF8 are templated because the sequence databases were a bottleneck.',
        },
        {
          title: 'Filter hard',
          body: 'Keep a design only if it clears the **2 by 2 filter**: a **minPAE under 2** and a **backbone RMSD under 2 Angstrom** between the shape we asked for and the shape the sequence actually folds into. Both cutoffs are the published gold standard, and Dr. DiMaio told us minPAE is the single best predictor of a real binder.',
        },
        {
          title: 'Score the interface',
          body: 'Survivors get **pLDDT** for per-residue confidence, where we treat 80 as satisfactory, and **ddG** as a computational stand-in for binding strength, where we want a negative number. **PyRosetta InterfaceAnalyzer** adds buried surface area, unsatisfied hydrogen bonds and shape complementarity, and **PyMOL** is used to look at each one by hand.',
        },
      ],
      source: 'Protein Design pipeline docs (RFD3, MPNN, RF3 how-to; Hyak minidocs) and DiMaio mentorship sessions.',
    },
    {
      kind: 'narration',
      body: [
        'Three programs, doing three jobs. The first **sculpts a shape** that should stick to the target. The second **picks an amino acid sequence** that might fold into that shape. The third **checks the sequence actually folds that way**, and still lands in the right place.',
        'If the shape we asked for and the shape we got are more than about two atoms-widths apart, we throw it away.',
      ],
    },
    {
      kind: 'funnel',
      id: 'funnel',
      heading: 'How much gets thrown away',
      intro:
        'Almost all of it, which is the point. These are the numbers from our MOSMO and MEGF8 campaign.',
      stages: [
        {
          label: 'binders designed and folded',
          count: 5700,
          note: 'backbones from RFdiffusion3, sequences from ProteinMPNN, folded by RoseTTAFold3',
        },
        {
          label: 'cleared the 2 by 2 filter',
          count: 255,
          note: 'minPAE under 2 and backbone RMSD under 2 Angstrom',
        },
        {
          label: 'survived the membrane checks',
          count: 25,
          note: 'refolded against the extracellular surfaces only, then checked for self-consistency',
        },
      ],
      goal: { label: 'what we want to order and test', count: 96 },
      footnote:
        'The drop from 255 to about 25 is the interesting one. Our first filters were passing designs that bound a part of the target buried inside the membrane, where no protein could ever reach them. That is [the third engineering cycle](/project/engineering#cycles).',
      source: 'Protein Design: binder design pipeline and engineering cycles, 2026.',
    },
    {
      kind: 'structure',
      id: 'smo-structure',
      structure: SMO_5L7D,
    },
    {
      kind: 'prose',
      heading: 'Why this structure is here and not ours',
      body: [
        'The receptor above is **Smoothened**, the protein the whole project is aimed at, with a molecule of **cholesterol** bound in the domain that sits outside the cell. The helices below it cross the membrane seven times, which is the shape that makes it a GPCR. Cholesterol binding is the activation step [our kinetic model argues about](/drylab/model#sensitivity), so this is the picture that page is describing in equations.',
        'It is a published structure rather than one of ours, and labelled that way on purpose. Our own targets, the MOSMO and MEGF8 interface, were solved by the Kong lab by cryo-EM and are not ours to publish. **Our designed binders are not here yet** because none has been validated at a bench. When they are, they drop into the same viewer.',
      ],
      source: 'PDB 5L7D, Byrne et al., Nature 2016. Viewer written for this site, no third-party 3D library.',
    },
    {
      kind: 'prose',
      heading: 'A second design track, and a twist',
      body: [
        'We also run **BindCraft**, which co-designs the backbone, sequence, and interface together through AlphaFold2 hallucination. It produces fewer designs but filters them more strictly, so we use it alongside the main pipeline.',
        'MOSMO and MEGF8 are awkward targets because their surfaces are mostly **beta sheet**, and binder design tools are tuned for helical targets. We are testing **beta-strand-conditioned RFdiffusion** to design binders that pair against an exposed edge strand instead of a helix.',
      ],
      source: 'BindCraft runbook; Principles of Minibinder Design (beta-strand method, Nat Commun 2025 s41467-025-67866-3).',
    },
    {
      kind: 'facts',
      heading: 'Where the compute runs',
      items: [
        { title: 'Hyak', body: 'UW\'s SLURM cluster, reached through the Research Computing Club and funded by the Student Technology Fee. Most design runs happen here.' },
        { title: 'DIGS', body: 'The Institute for Protein Design cluster. We have one seat, arranged through Dr. DiMaio.' },
        { title: 'Mentorship', body: 'Dr. Frank DiMaio at the Institute for Protein Design set the tool choices, the filter metrics, and the target-selection rules.' },
      ],
    },
    {
      kind: 'prose',
      heading: 'Where the design stands',
      body: [
        'We have about **24 MOSMO binder backbones** carried through sequence design, most with two or three candidate sequences of roughly 160 residues. The MEGF8 binders are still in progress.',
      ],
      source: 'Minibinder sequence sheet (Mosmo/MEGF8), Protein Design, summer 2026.',
  },
]

const engineering: Page = {
  slug: '/project/engineering',
  title: 'Build, Test, Learn',
  kicker: 'chapter 03 · engineering',
  medal: true,
  storyBeat: 'Nothing in a garden works the first time. You plant, you watch, you move it two feet to the left.',
  intro:
    'How we design a binder and filter it down, and then the build, test, learn cycles in the order we actually ran them, including the parts that did not work the first time.',
  blocks: [
    ...designBlocks,
    {
      kind: 'cycles',
      id: 'cycles',
      cycles: [
        {
          heading: 'Cycle 1: choosing the target',
          intro: 'This cycle is complete. It is how the project became the project.',
          items: [
            {
              title: 'Design',
              body: 'More than a dozen project proposals were developed across the team in early 2026, each with a target, a mechanism, and a feasibility argument.',
            },
            {
              title: 'Build',
              body: 'Proposals were presented to the full team, then narrowed by a top-three vote.',
            },
            {
              title: 'Test',
              body: 'The finalists were pressure-tested with the advisors against one repeated question. How are you going to test this, and are the assays actually feasible.',
            },
            {
              title: 'Learn',
              body: 'Feasibility decided it, not novelty. The MMM and SMO project won because the advising lab already has the cell lines, the reporters, and the readouts to test it.',
            },
          ],
        },
        {
          heading: 'Cycle 2: generating binders',
          intro: 'Complete. Getting a pipeline to produce candidate binders at all.',
          items: [
            {
              title: 'Design',
              body: 'We set the generation parameters from our own earlier campaigns, from Dr. DiMaio, and from the Kong lab preprint: a small helical bundle, 50 to 150 amino acids. The usual advice is to aim hotspots at hydrophobic residues, but this interface is largely polar, so we aimed instead at the beta sheet contacts the preprint identified as the ones holding MOSMO and MEGF8 together.',
            },
            {
              title: 'Build',
              body: 'We set up a Washington iGEM workspace on **Hyak** and pulled the RosettaCommons **Foundry** container into it, which carries RFdiffusion3, ProteinMPNN and RoseTTAFold3 together.',
            },
            {
              title: 'Test',
              body: 'We wrote Bash and Python to drive each model in turn, generated binders, and then looked at which hotspots the surviving designs had come from.',
            },
            {
              title: 'Learn',
              body: 'The result was flat. How often a hotspot succeeded tracked **how many designs we had attempted with it**, and not the chemistry of the residues. Talking it through with Dr. DiMaio, the reading is that hotspots tell RFdiffusion3 roughly where to aim rather than specifying residue to residue contacts. We also folded the separate scripts into one that runs the whole pipeline, so any future Washington iGEM team can design binders with a single command.',
            },
          ],
        },
        {
          heading: 'Cycle 3: learning to throw designs away',
          intro: 'Complete, and the cycle we learned the most from. Our first filter was passing designs that could never work.',
          items: [
            {
              title: 'Design',
              body: 'With several thousand candidates we needed a cutoff. We took the two published gold standards: backbone **RMSD under 2 Angstrom** between the shape we asked for and the shape we got, and **minPAE under 2**. We call it the 2 by 2 filter.',
            },
            {
              title: 'Build',
              body: 'A Python script aligned every folded output against the backbone it came from, computed the RMSD, and pulled minPAE out of the RoseTTAFold3 confidence files.',
            },
            {
              title: 'Test',
              body: 'Of about **5,700 designs, 255 passed**. Then we opened a few in PyMOL and found the problem: most of them were binding parts of MOSMO and MEGF8 that are **buried inside the membrane**. On the metrics they looked excellent. In a cell no protein could ever reach them. We had been designing against an incomplete picture of our own target.',
            },
            {
              title: 'Learn',
              body: 'Good numbers are not the same as a good binder. We rebuilt the filtering around what is physically reachable: re-fold every survivor against only the **extracellular** parts of the targets and apply the 2 by 2 filter again, then run a custom check that rejects anything still sitting within 5 to 10 Angstrom of the transmembrane helices. Dr. DiMaio added a third test, folding the binder **on its own** with no target present, to confirm it holds its shape rather than being propped up by the thing it is supposed to bind. About **25 designs** survived all of it. The filters are listed in order in [the pipeline](/project/engineering#pipeline) above.',
            },
          ],
        },
        {
          heading: 'Cycle 4: rescuing the near misses',
          intro: 'In progress. Twenty five binders is not enough to fill a 96-well plate.',
          items: [
            {
              title: 'Design',
              body: 'We were about 70 designs short of the 96 we want to order. Rather than generate more backbones from scratch, we re-ran **ProteinMPNN and RoseTTAFold3** on two groups: the near misses, and the designs that had already passed. Giving a backbone a fresh sequence is known to lower RMSD and raise prediction confidence, so a slightly misaligned design gets another chance to settle into the shape we asked for.',
            },
            {
              title: 'Build',
              body: 'We targeted near misses at **minPAE under 4 and RMSD under 6**, loose enough to catch designs that were close without reopening the whole pool.',
            },
            {
              title: 'Test',
              body: 'Running now. The rescue rate is not in yet.',
            },
            {
              title: 'Learn',
              body: 'Too early for a rescue rate, but one cost is already clear. Redesigning sequences onto backbones that already passed means more of the final set comes from the **same few backbone shapes**, so the plate is less diverse than the count suggests.',
            },
          ],
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Cycle 2: designing a binder against a hard surface',
      body: [
        'This cycle is in progress. The first real change came before any protein was made. We began aiming at ATRN, then switched to the **MMM complex** once it was clear MMM had cryo-EM and an accessible interface while ATRN only had an AlphaFold model. Better data to design against was worth the switch.',
        'A second problem showed up in the pipeline itself. RoseTTAFold3 could not fold our targets well because the sequence databases were thin, so the designs were failing the fold check for the wrong reason. We fixed it by **templating MOSMO and MEGF8** during forward folding. We now have about 24 MOSMO binder backbones through sequence design. [The pipeline](/project/engineering#pipeline) above has every step.',
      ],
      source: 'Protein Design ideation notes and pipeline docs, 2026.',
    },
    {
      kind: 'cards',
      heading: 'Engineering the constructs',
      intro: 'Real decisions forced by the biology, worth recording because each one shaped the build.',
      items: [
        {
          title: 'MEGF8 is enormous',
          body: 'Full-length MEGF8 is 2,845 amino acids, over the size cap of our gene synthesis service. So full-length MEGF8 comes from the advising lab instead of being ordered.',
        },
        {
          title: 'A slow readout needs a strong promoter',
          body: 'Seeing SMO change in the cilium takes three to four days, so constructs use a CMV promoter to keep expression up over that window.',
        },
        {
          title: 'No P2A on the SMO arm',
          body: 'A common way to express two proteins from one construct leaves a proline scar. On SMO that scar would affect signalling, so the SMO arm avoids it.',
        },
      ],
      source: 'Wet Lab construct planning and Induced Proximity Assay protocol.',
    },
  ],
}

const experiments: Page = {
  slug: '/wetlab/experiments',
  title: 'What Grew',
  kicker: 'chapter 05 · experiments',
  storyBeat: 'This bed is still mostly soil. Come back when the season turns.',
  intro: 'Four experiments, each answering one question, in the order they have to be answered.',
  blocks: [
    {
      kind: 'steps',
      id: 'experiments',
      heading: 'The four experiments',
      intro: 'Each one answers a specific question, in order.',
      items: [
        {
          title: 'Does forced proximity work',
          body: 'Put SMO, MGRN1, and tagged ubiquitin into NIH/3T3 cells with a rapalog-controlled linker, then pull down and blot for ubiquitin. Controls include a catalytically dead MGRN1 and a no-linker SMO. This proves the down arm before any binder is involved.',
        },
        {
          title: 'Which binders work',
          body: 'Screen the designed binders in a 96-well mammalian two-hybrid, with the target on one half and the binder on the other driving a GFP reporter. About 125 to 130 binders can be screened this way.',
        },
        {
          title: 'Does SMO actually move',
          body: 'Transfect the best hits into NIH/3T3, induce cilia by dropping serum, add varying amounts of SHH, then image how much SMO sits in the cilium. Readouts are median ciliary SMO intensity and the fraction of cilia that are SMO positive.',
        },
        {
          title: 'Purify the winners',
          body: 'Express the top 5 to 10 binders and purify them by IMAC using a His-tag, so they can be characterised directly.',
        },
      ],
      source: 'Wet Lab: mid-quarter check-in and Induced Proximity Assay protocol, 2026.',
    },
    {
      kind: 'facts',
      heading: 'What we test in',
      items: [
        { title: 'Cell lines', body: 'NIH/3T3 mouse cells for the ciliary and proximity work, and HEK293T for transfection and the two-hybrid screen. Designs are mouse-optimised for NIH/3T3.' },
        { title: 'Reagents', body: 'Constructs come from gene synthesis, with full-length MEGF8 supplied by the advising lab because of its size.' },
        { title: 'Honest gap', body: 'We do not have SPR access, so we cannot yet measure binding affinities directly or confirm the binding order. The model treats binder strength as a swept range until then.' },
      ],
    },
  ],
}

const model: Page = {
  slug: '/drylab/model',
  title: 'The Model',
  kicker: 'chapter 07 · model',
  medal: true,
  storyBeat: 'Before you dig, it helps to know how fast things grow. So we did the maths, and then we asked a systems biologist to tell us where the maths was wrong.',
  intro:
    'A kinetic model of the Hedgehog and MMM system, built to answer one question. Can the binder bring ciliary SMO back to a normal level, or is tunable just a nice word.',
  blocks: [
    {
      kind: 'prose',
      heading: 'What the model is for',
      body: [
        'The whole point of the device is graded control. Acting on the three-part MMM complex should let us dial the amount of **SMO in the primary cilium**, where blocking SMO directly only gives on or off. That is a claim about rates, so it has to survive a kinetic model.',
        'Version 0 is a small **ODE model** of the Hedgehog and MMM system. We track MMM, SMO in its active and ubiquitinated states, the linker, the designed binder, and the parts of the pathway that read SMO out. The chosen output is ciliary SMO over time rather than the downstream transcription factors, because adding the GLI layer made the model less trustworthy, not more.',
      ],
      source: 'Kinetic Modeling: Version 0 Construction doc and Project Design Document.',
    },
    {
      kind: 'prose',
      heading: 'The test',
      body: [
        'We run the model twice. Once as **wild type**, and once with **PTCH1 set to zero**, which is the most common mutation in basal cell carcinoma and drives SMO too high. The **tunability window** is the range where adding the binder brings the second run back onto the first run over time.',
        'The team goal, in one line, is a model-guided recruitment platform that lets us dial SMO levels in the cilium instead of simply blocking SMO activity.',
      ],
      source: 'Kinetic Modeling Version 0; mid-quarter check-in with Dr. Jennifer Kong.',
    },
    {
      kind: 'facts',
      heading: 'Where the parameters come from',
      items: [
        { title: 'Concentrations', body: 'Protein abundances from PaxDb, BioNumbers, and DepMap. The MMM complex sits around 28.8 copies per cell, which is low enough that we had to check whether a deterministic model is even fair.' },
        { title: 'Enzyme kinetics', body: 'Km and kcat from BRENDA, looked up by EC number. MGRN1 comes out around Km 0.30 mM and kcat 1.24 per mM per second.' },
        { title: 'Degradation rates', body: 'Pulled from specific papers, for example SMO at about 8.6e-5 per second and PTCH1 losing about 45 percent over 3 hours.' },
        { title: 'Every value is sourced', body: 'The parameter database records a source and an assumption for each number, so the table can be audited.' },
      ],
    },
    {
      kind: 'prose',
      heading: 'What Dr. Sauro told us to do differently',
      body: [
        'Dr. Herbert Sauro, a systems biologist at UW, met with the subteam twice and reset how we work. Instead of building one big model, we build a **set of candidate models** that each change one relationship, then use **AIC and BIC** to see which is best supported by the data we have. He also had us move to **Tellurium and Antimony**, run **Morris and Sobol sensitivity analysis**, sample uncertain parameters and report the spread rather than a single line, and use fold changes from knockouts as constraints, since we only have relative data.',
        'His framing stuck with us. As he put it, you can only really show how models are wrong.',
      ],
      source: 'Kinetic Modeling: Dr. Herbert Sauro meeting notes (two meetings, summer 2026).',
    },
    {
      kind: 'narration',
      label: 'what a sensitivity analysis is',
      body: [
        'The model has dozens of numbers in it, and most of them we had to look up or guess. So before trusting any prediction, we nudge each number by ten percent and see which ones actually move the answer.',
        'The ones that move it are the ones worth measuring properly at a bench. The ones that do not, we can stop worrying about.',
      ],
    },
    {
      kind: 'tornado',
      id: 'sensitivity',
      heading: 'What actually controls ciliary SMO',
      intro:
        'Each bar shows how strongly ciliary SMO responds when that one parameter is raised: a bar of 1.3 means SMO moves about 1.3 percent for every one percent change in the parameter.',
      rows: [
        { label: 'SMO made in the cytoplasm', note: 'k form, SMO-cyt', value: 1.3 },
        { label: 'MMM complex made', note: 'k form, MMM', value: -1.28 },
        { label: 'Tagging rate once bound', note: 'kcat', value: -1.28 },
        { label: 'MMM complex degraded', note: 'k deg, MMM', value: 1.26 },
        { label: 'Cooperativity in the three-way complex', note: 'alpha', value: -0.87 },
        { label: 'Binder holding onto SMO', note: 'K SMO-Linker', value: 0.51 },
        { label: 'Binder holding onto MMM', note: 'K MMM-Linker', value: 0.31 },
        { label: 'SMO entering the cilium', note: 'k in', value: 0.28 },
        { label: 'SMO cleared from the cytoplasm', note: 'k deg, SMO-cyt', value: -0.28 },
      ],
      positiveMeans: 'more of it means more SMO in the cilium',
      negativeMeans: 'more of it means less SMO in the cilium',
      footnote:
        'Supply and disposal, almost exactly balanced. Turn the MMM pool up one percent and ciliary SMO falls about 1.3 percent, which is the graded response the whole device depends on. Note what is **missing** from the top of this list: how fast SMO enters the cilium, and PTCH1 itself, both come out near 0.28 or below. At these settings ciliary SMO sits around 3.1 nM against 17.9 nM in the cytoplasm.',
      source:
        'Kinetic Modeling: local sensitivity analysis of the recruitment model, run in Tellurium over a 120 hour simulation.',
    },
    {
      kind: 'prose',
      id: 'mc4r-safety',
      heading: 'Checking it cannot do harm somewhere else',
      body: [
        '[The up arm](/project/description#two-arms) works by pulling the MMM complex apart. That frees MGRN1, and MGRN1 has another job: with a different partner called ATRN it controls **MC4R**, a receptor in the pathway that regulates appetite and body weight. If our binder released a flood of MGRN1 into that other role, we could be causing a metabolic side effect while congratulating ourselves on the ciliary result.',
        'So we modelled it. Adding binder does shift MC4R, but the effect is **small and it saturates**: about 2.3 percent at 50 nM, and still only **2.75 percent at 500 nM**, well under the 20 percent we had set as the point where an effect becomes biologically meaningful. Past about 50 nM, adding more binder changes nothing. The reason is that MGRN1 is the scarce component at roughly 0.18 nM in total, so there is only so much of it to redistribute no matter how hard we push.',
        'The useful part is that this holds regardless of how good our binder turns out to be. In the global sensitivity analysis the binder\'s own binding strength had **zero** influence on the MC4R result, which means we do not have to trade therapeutic dose against this particular risk.',
      ],
      source:
        'Kinetic Modeling: MC4R safety model, mass-action kinetics in Tellurium. Abundances from PaxDb; Kong et al. 2020 and 2025.',
    },
    {
      kind: 'dose',
      id: 'mc4r-dose',
      heading: 'How far off-target it actually goes',
      points: [
        { label: '0', value: 0 },
        { label: '1', value: 0.23 },
        { label: '5', value: 0.87 },
        { label: '10', value: 1.33 },
        { label: '50', value: 2.3 },
        { label: '100', value: 2.53 },
        { label: '250', value: 2.69 },
        { label: '500', value: 2.75 },
      ],
      xLabel: 'minibinder added (nM)',
      yLabel: 'drop in surface MC4R (percent)',
      threshold: {
        value: 20,
        label:
          'We set twenty percent as the point where an effect becomes biologically meaningful. The worst case, at a dose ten times higher than anything we would use, reaches 2.75 percent.',
      },
      footnote:
        'The curve flattens by about 50 nM. Past that, adding more binder changes nothing, because MGRN1 is the scarce part at roughly 0.18 nM in total and there is only so much of it to redistribute.',
      source: 'Kinetic Modeling: MC4R safety model.',
    },
  ],
}

/* ===================================================================== *
 * IMPACT
 * ===================================================================== */

const humanPractices: Page = {
  slug: '/human-practices/integrated',
  title: 'Who the Garden Is For',
  kicker: 'chapter 08 · integrated human practices',
  medal: true,
  storyBeat: 'A garden nobody visits is just a field. So we went and asked people, and one of those conversations changed what the project even is.',
  intro:
    'We are handing other researchers a tool that changes what stays in the primary cilium. This page is about what that means, and the people who told us how to do it responsibly.',
  blocks: [
    {
      kind: 'prose',
      heading: 'The question we are asking',
      body: [
        'Partway through the season the project stopped being a single Hedgehog therapy and became a **platform for controlling which proteins stay in the primary cilium**. That shift came out of these conversations, so it belongs here.',
        'Our guiding question is this. How can we make a ciliary protein engineering platform easy for researchers to adopt, and encourage responsible use in biologically sensitive systems.',
      ],
      source: 'Integrated Human Practices: IHP wiki outline.',
    },
    {
      kind: 'narration',
      body: [
        'Nearly every cell in you grows a single tiny antenna, called the **primary cilium**. It is not decoration. Certain receptors only do their job while they are sitting in it.',
        'So a protein can be in the right cell and still be in the wrong place. That one idea is what the rest of this page is about.',
      ],
    },
    {
      kind: 'prose',
      heading: 'Why location matters',
      body: [
        'The primary cilium is an extension of the cell membrane, but it keeps its own separate contents. Barriers at its base control what gets in and out, so the cell can concentrate particular receptors inside it. That makes it a distinct signalling compartment rather than just another patch of surface.',
        '**Smoothened is the clean example.** When Hedgehog signalling is switched on, SMO moves into the cilium and builds up there, and that is when it drives the GLI transcription factors. Engineer SMO so it can no longer enter the cilium and Hedgehog signalling cannot be activated properly, even though the protein is still in the cell. Being in the cilium is not incidental to what SMO does; it is the thing that makes it work.',
      ],
      source:
        'Nachury and Mick, Nat Rev Mol Cell Biol 2019; Corbit et al., Nature 2005 (Vertebrate Smoothened functions at the primary cilium).',
    },
    {
      kind: 'prose',
      heading: 'Why the amount matters too',
      body: [
        'Signalling pathways are not simple switches. Cells respond differently to a weak signal and a strong one, and during development small differences in Hedgehog signalling help decide which cell types form.',
        'That holds inside the cilium. Reducing how much SMO is in the cilium impairs pathway activation, and a mutant SMO that cannot concentrate there properly fails to reach the highest levels of Hedgehog response. So a tool that removes a protein completely can only tell you whether it was necessary. Being able to move the amount up and down gradually is what reveals thresholds, and the intermediate states in between.',
      ],
      source:
        'Stamataki et al., Genes Dev 2005; Mahjoub, Organogenesis 2013; Gigante et al., Dev Biol 2018.',
    },
    {
      kind: 'toolshed',
      id: 'toolbox',
      heading: 'What is already in the shed',
      intro:
        'Cilia labs are not short of tools. We went through the ones they actually reach for, and asked the same question of each: can it change one chosen protein, only inside the cilium, at a time you pick, by an amount you pick.',
      tools: [
        {
          name: 'Genetic knockout (CRISPR-Cas9)',
          how: 'A guide RNA directs Cas9 to cut a chosen DNA sequence. The cell repairs the break imperfectly, and the resulting mutations stop the gene making a working protein.',
          good: 'The strongest way to ask whether a protein matters at all. If removing it changes ciliary structure or signalling, that is good evidence the protein has a real role, and it scales up into large genetic screens.',
          gap: 'It removes the protein from the whole cell, not just the cilium, so it cannot separate what the protein was doing in the cilium from what it was doing elsewhere. It also offers little control over amount: the comparison is normal against near total loss.',
        },
        {
          name: 'Gene silencing (CRISPRi and RNAi)',
          how: 'CRISPRi parks a catalytically dead Cas9 on a gene to block transcription rather than cutting it. RNAi uses small RNAs that bind the matching mRNA so it is destroyed or never translated.',
          good: 'Useful when a full knockout would be too disruptive and you want to reduce a protein rather than remove it. RNAi screens have already found genes involved in building and regulating cilia.',
          gap: 'It controls how much protein the whole cell makes, not where the remaining protein ends up. How far you suppress a gene does not translate into a predictable amount left in the cilium.',
        },
        {
          name: 'Small molecule antagonists',
          how: 'Compounds that bind a protein and block its activity. They act within minutes of being added and leave the DNA untouched, and the dose can be varied.',
          good: 'Fast, reversible, and dose dependent, which makes them good for watching how a pathway responds to partial inhibition. SMO antagonists have taught the field a great deal about how SMO activity relates to the pathway.',
          gap: 'Blocking what a protein does is not the same as controlling how much of it is there. Some SMO antagonists keep SMO out of the cilium while others make it pile up inside, and Hedgehog signalling is inhibited either way, which is exactly the confound.',
        },
        {
          name: 'Inducible degrons',
          how: 'The target protein is fused to a degron tag. Adding the matching trigger, auxin in the AID system, recruits an E3 ubiquitin ligase that marks the protein for destruction by the proteasome.',
          good: 'Excellent control over *when*. Cilia assemble and disassemble on short timescales, and auxin-inducible degradation has been used to strip out ciliary proteins fast enough to watch the consequences.',
          gap: 'Almost no control over *where*. If the protein sits both in the cilium and elsewhere, the system cannot tell the two pools apart, and degradation tends to be close to total rather than tunable.',
        },
        {
          name: 'Ciliary trafficking perturbation (IFT and the BBSome)',
          how: 'The cilium has its own transport system. Intraflagellar transport moves cargo along the axoneme, and the BBSome couples membrane signalling proteins to that machinery.',
          good: 'This does act inside the cilium. Losing IFT27 stops GPR161 being cleared out, so it accumulates, and BBSome-dependent transport is needed to move SMO in and out. Perturbing trafficking really does change ciliary protein levels.',
          gap: 'The machinery carries everything. Disrupt it and many ciliary proteins shift at once, and depending on the part you break you can interfere with building the cilium at all. There is no way to single out one receptor.',
        },
        {
          name: 'Targeted protein degradation (PROTACs, molecular glues, LYTACs, AbTACs)',
          how: 'All of these force a chosen protein next to the cell\'s own disposal machinery. PROTACs and molecular glues bring a target to an E3 ligase for the proteasome; LYTACs and AbTACs route surface proteins to the lysosome or to a membrane E3 ligase.',
          good: 'Genuinely target specific, and fast. LYTACs and AbTACs have shown the approach reaches cell surface receptors, which is the category most ciliary signalling proteins fall into.',
          gap: 'Almost all of it is built to work across the whole cell or the whole cell surface. For a ciliary biologist that reintroduces the original problem: you cannot tell the ciliary pool from the rest.',
        },
        {
          name: 'Cilia-targeted ubiquitination',
          how: 'Certain ciliary GPCRs are tagged with K63-linked ubiquitin chains, which signal the BBSome to carry them out. Researchers can change this by targeting the enzymes that add or remove those chains inside the cilium.',
          good: 'The closest existing approach to what we want, and it proves the principle. Targeting the deubiquitinase AMSH to strip K63 chains stopped GPR161, SSTR3 and SMO leaving the cilium, so ciliary ubiquitination really does control which receptors stay.',
          gap: 'It changes the ubiquitination environment of the whole cilium rather than aiming at one receptor, and it gives little ability to set how much of a particular protein remains.',
        },
      ],
      source:
        'Integrated Human Practices: Community Need section, fully cited in the IHP draft (references 8 to 20).',
    },
    {
      kind: 'matrix',
      id: 'the-gap',
      heading: 'The same gap, every time',
      intro:
        'Reading down the columns is the argument. Plenty of tools are target specific. A couple act only inside the cilium. None of them does both and lets you choose the amount.',
      columns: ['target specific', 'cilium only', 'timing', 'tunable'],
      rows: [
        { label: 'Genetic knockout', levels: ['full', 'none', 'none', 'none'] },
        { label: 'CRISPRi and RNAi', levels: ['full', 'none', 'full', 'partial'] },
        { label: 'Small molecule antagonists', levels: ['full', 'none', 'full', 'partial'] },
        { label: 'Inducible degrons', levels: ['full', 'none', 'full', 'partial'] },
        { label: 'BBSome and IFT perturbation', levels: ['partial', 'full', 'partial', 'none'] },
        { label: 'Targeted protein degradation', levels: ['full', 'none', 'full', 'partial'] },
        { label: 'Cilia-targeted ubiquitination', levels: ['partial', 'full', 'partial', 'partial'] },
        { label: 'What we are building', levels: ['full', 'full', 'full', 'full'], isGoal: true },
      ],
      source: 'Opportunity matrix, Integrated Human Practices. Assessment from the literature review above.',
    },
    {
      kind: 'facts',
      id: 'four-requirements',
      heading: 'Four things a ciliary tool has to do',
      items: [
        { title: 'What', body: 'Act on one protein you choose, not on everything in the compartment.' },
        { title: 'Where', body: 'Act inside the primary cilium, and leave the same protein elsewhere in the cell alone.' },
        { title: 'When', body: 'Change on a timescale you control, rather than permanently from the start.' },
        { title: 'How much', body: 'Set the amount that remains, instead of only all or nothing.' },
      ],
    },
    {
      kind: 'narration',
      label: 'so what is the idea',
      body: [
        'The cell already owns a machine that clears one specific receptor out of the cilium. That is the **MMM complex**, and its usual job is keeping SMO in check.',
        'We are not building a new machine. We are redirecting that one, so a researcher can point it at a protein of their choosing and decide how much of it stays.',
      ],
    },
    {
      kind: 'stats',
      id: 'market',
      heading: 'How big is this, really',
      intro:
        'We looked at whether a ciliary tool would matter to anyone outside our own lab. Two of these numbers are encouraging and one of them is the actual opportunity.',
      items: [
        { value: '516', label: 'approved drugs that target a GPCR', note: 'Nat Rev Drug Discov, 2025' },
        { value: '36%', label: 'of all approved drugs, by the same count' },
        { value: '30+', label: 'human diseases and syndromes linked to faulty cilia' },
        {
          value: '0',
          label: 'approved drugs targeting a ciliary GPCR',
          note: 'Saito et al., Front Mol Biosci 2023',
          emphasis: true,
        },
      ],
      footnote:
        'Not every GPCR is ciliary, and our platform is a research tool rather than a therapeutic. But a receptor class that drives a third of the drug market, a compartment tied to more than thirty diseases, and nothing approved against it is a gap worth naming.',
      source: 'Market model, Integrated Human Practices.',
    },
    {
      kind: 'prose',
      heading: 'And how many people would use it',
      body: [
        'There is no published market figure for cilia research tools, so we estimated one rather than quoting a number we could not source. Cilia papers are roughly **0.05 percent** of PubMed, about one in every two thousand. Applying that share to the NIH Bioengineering and Biotechnology funding categories gives on the order of **3.6 to 4.4 million dollars a year** of NIH-supported cilia research technology activity.',
        'That is a small number, and it changed what we are building. It says our first users are not a mass market, they are the labs already working on ciliary signalling. So the platform should be cheap to adopt in a single lab and easy to point at a new target, rather than polished into a product. We have written the assumptions behind the estimate down, including that publication share is a poor proxy for spending.',
      ],
      source: 'Market model, Integrated Human Practices. Full working and limitations in the IHP draft.',
    },
    {
      kind: 'stakeholders',
      id: 'stakeholders',
      heading: 'Who we asked, and what it changed',
      intro:
        'Thirteen conversations, planted by what each person knows. Each has a line saying what we did differently afterwards, or says plainly where that is not written up yet.',
      people: [
      {
        name: 'Dr. Samuel Miller',
        role:
          'Professor in the UW Department of Medicine, Division of Allergy and Infectious Diseases, with extensive experience studying bacterial pathogenesis and developing biological research tools',
        group: 'signalling researcher',
        why:
          'The team returned to him because his feedback during their 2025 project had stressed identifying a clear user and use case before investing heavily in technology development.',
        said:
          'He challenged the team to first establish whether changing receptor copy number produces a meaningful biological effect, noting that in some GPCR systems ligand availability or downstream signal amplification may matter more than receptor abundance itself, and recommended a well characterised system where receptor abundance is already known to influence a measurable phenotype as a rigorous proof of principle. He also highlighted that ubiquitin mediated control could alter protein abundance much more rapidly than transcriptional regulation, and that researchers weigh cost, technical difficulty, equipment requirements, reproducibility and the likelihood of false negatives or positives when adopting a tool.',
        changed:
          'The team will prioritise a biologically meaningful proof of principle system before expanding to additional GPCRs, and its adoption guide will include detailed methods, controls, validation data, reagent sources and construction procedures so other researchers can reproduce and evaluate the platform.',
      },
      {
        name: 'Dr. Paul Pottinger',
        role:
          'Professor of Medicine in UW\'s Division of Allergy and Infectious Diseases and a practising infectious disease physician with experience in antimicrobial stewardship and medical education',
        group: 'bioethics',
        why:
          'To understand what biological and safety considerations would need to be addressed before a system like this could be explored in more disease related contexts.',
        said:
          'He advised that the current goal of building a research platform and the long term potential of therapeutic application are not incompatible, but that the team should clearly communicate the distinction between what the technology can do now and what remains a future possibility. He also emphasised considering unintended effects at a systems level and seeking additional systems biology expertise to examine how perturbing one component of a pathway could influence broader pathways.',
        changed:
          'The team will build clear boundaries around validation and uncertainty into its responsible use material, test a validated platform in more physiologically complex models such as organoids, use system level modelling to explore off target consequences, and set clearer goalposts for what counts as successful platform development.',
      },
      {
        name: 'Dr. Herbert Sauro',
        role:
          'Professor in the UW Department of Bioengineering and Principal Investigator of the Predictive Sys-Bio Lab, focused on in silico biological models and pathway analysis',
        group: 'modelling expert',
        why:
          'To get feedback on the team\'s kinetic models while they were developing a representation of the Hedgehog signalling pathway and their two modulators, a binder inhibiting the MOSMO and MEGF8 interaction and a linker recruiting the MMM complex to SMO.',
        said:
          'He introduced the team to modelling platforms including BioModels, LibRoadRunner, WebIridium and Spyder, and explained how to use them to write and analyse kinetic models. He also guided the model development process by having the team create a wiring diagram to identify which components were most important, and gave detailed feedback as the model progressed.',
        changed:
          'The team simplified its kinetic model through a wiring diagram and used that process to work out which wet lab experimental data it needed.',
      },
      {
        name: 'Dr. John B. Wallingford',
        role:
          'Professor at the University of Texas at Austin Department of Molecular Biosciences and the Mr. and Mrs. Robert P. Doherty, Jr. Regents Chair in Molecular Biology, whose lab works on morphogenesis, cilia and systems biology',
        group: 'ciliary biologist',
        why:
          'To better understand how the foundational advancement could support ciliary researchers like those in his lab, and to get feedback on the current project.',
        said:
          'He set out what researchers and clinicians need to know when using a new tool, including degradation rate, effectiveness and efficiency. He explained that a primary limitation in ciliary research is the inability to study cilia dynamics, since expansion microscopy requires fixing cells and so disables a direct link between structure and dynamics.',
        changed:
          'The meeting narrowed down how the project could be used by ciliary researchers and what steps were needed to establish it as a foundational advancement, with live cell study of Hedgehog signalling without fixture as the intended contribution.',
      },
      {
        name: 'Dr. Stacey Ogden',
        role: 'Researcher at St. Jude who focuses on hedgehog signalling',
        group: 'signalling researcher',
        why:
          'The team initially reached out to better understand what hedgehog signalling is implicated in, in order to grasp the project\'s scope.',
        said:
          'She advised on what the hedgehog signalling pathway is implicated in, discussing the majority of cancer cases coming from rhabdomyosarcoma and medulloblastoma, and the cardiovascular conditions that occur with hedgehog misregulation in children, many of which are diagnosed via amniocentesis. She also raised the implications of tampering with such a ubiquitous system.',
        changed:
          'Given the histories of developmental biology being used to support eugenics efforts, the team recognised how important responsible use of the tool is.',
      },
      {
        name: 'Changho Chun and Justin Lee',
        role:
          'Co-founders of NuukBio, an early stage biotechnology company developing a live-cell phenotyping platform',
        group: 'startup or industry',
        why:
          'The team\'s own platform is at a similar early stage, so they wanted to learn how NuukBio translated an academic scientific capability into a broader research platform.',
        said:
          'They emphasised that deep tech platforms cannot rely on assumed value and that the underlying science first needs rigorous experimental validation, with researchers acting as the first users. They encouraged the team to define the specific unanswered scientific questions the platform enables before identifying broad markets, users or applications, and to develop an evolving founder\'s theory, a clear hypothesis of why the platform is useful and what problem it solves, refined repeatedly through stakeholder feedback.',
        changed:
          'Wet lab and modelling teams will organise validation around clearly defined scientific questions, Human Practices will develop an initial value hypothesis and test it through interviews with potential end users, and the team will broaden outreach through referrals and local life science networks.',
      },
      {
        name: 'Dr. Ning Zheng',
        role:
          'Professor of Pharmacology at the University of Washington School of Medicine, whose lab specialises in protein structure and ubiquitination',
        group: 'signalling researcher',
        why:
          'To receive guidance on developing a modular platform that addresses a prominent gap in the field.',
        said:
          'He explained that because SMO is endogenously targeted and ubiquitinated by the MMM complex, the team would not be able to prove that regulation of SMO was due to their platform rather than the pre-existing biological relationship. He recommended selecting a protein that is not naturally targeted by MMM, to test whether the system can create a synthetic interaction and so demonstrate a truly modular tool.',
        changed:
          'The platform shifted from focusing only on SMO as a target to a modular system that can target and regulate any ciliary membrane protein.',
      },
      {
        name: 'Dr. Thomas Matula',
        role:
          'President and CEO of Matchstick Technologies, where he developed PIXUL, an instrument using cavitation for fragmenting DNA for genetic and epigenetic analysis',
        group: 'startup or industry',
        why:
          'To learn from his experience developing a research tool with a wide range of applications, since PIXUL started as an academic research tool before being commercialised.',
        said:
          'He described customer discovery and product development from working with UW CoMotion through to early grant applications, and urged the team to quickly develop small proof of concept technologies to attract early investors. He stressed staying utilitarian, iterating constantly on customer feedback rather than personal preference, and noted that people in labs are often set in how they already do things, so the key is finding a specific pain point the tool solves.',
        changed: 'No change from this conversation is written up yet.',
      },
      {
        name: 'Dr. David Younger',
        role:
          'Co-founder and CEO at A-Alpha Bio and a co-inventor of the AlphaSeq protein interaction platform',
        group: 'startup or industry',
        why:
          'To better understand the tradeoffs of the team\'s protein, antibody and small molecule design strategies, and how a modular biological tool could be made accessible to other researchers as a platform.',
        said:
          'He raised no fundamental concerns with the de novo protein design approach but said the choice between a small molecule, a protein based PROTAC and an antibody system should depend on the intended application, with biologics and minibinders more feasible within the iGEM timeline. He cautioned that full length knob and hole antibodies are not easy to design, synthesise or screen, suggesting two minibinders connected by a flexible linker as a minimal proof of concept, and warned that fully open sourcing too early could reduce investor incentives before a defensible IP foundation exists.',
        changed:
          'The wet lab team will prioritise validating a smaller minibinder system before pursuing more complex antibody or small molecule formats, the protein modelling and kinetics team will focus on scalable candidate generation, and Human Practices will continue examining platform implementation strategies.',
      },
      {
        name: 'Dr. Steven Vokes',
        role:
          'Professor at the University of Texas at Austin\'s Department of Molecular Biosciences, whose lab focuses on transcriptional response to Hedgehog signalling with GLI transcription activators and repressors',
        group: 'signalling researcher',
        why:
          'To learn how the platform could be useful to and adopted by scientists working with ciliary transmembrane proteins, and to hear his views on the linker system and potential off target effects.',
        said:
          'He suggested expanding wet lab experimentation to NIH/3T3 cells, an embryonic murine cell line with Hh signalling present, and using levels of the ciliary protein ARL13B as a control when testing effects on Smoothened in the cilia. As an in vivo researcher he was concerned about applying antibodies in murine or other live models, explaining that in vitro cancer lines lose ciliary response quite quickly. He also asked what advantages the system offers over cheap pre-existing small molecules, pointing to less druggable targets such as PTCH1 or GPR161, and noted the lack of quantitative live cell imaging in vivo at molecular or single cell resolution.',
        changed:
          'The team decided to use minibinders for its linker system, giving an easier delivery route for in vivo researchers studying downregulation of transmembrane ciliary proteins while remaining usable in cell culture.',
      },
      {
        name: 'Zach Chamberlain',
        role:
          'Manager of CoMotion Labs at UW CoMotion, working closely with student and faculty teams translating research into startups and licensed technologies',
        group: 'commercialisation',
        why:
          'To better understand what it actually takes for a research tool like theirs to be adopted outside of iGEM, and what CoMotion typically looks for when supporting student projects.',
        said:
          'He emphasised flexibility, awareness of the target audience, and simplifying the project down to its core point of innovation. On funding, he explained that investors want to see robust proof and results but also evidence that a team is flexible and aware of its surrounding environment, rather than locked into building a perfect product before ever engaging with its target audience.',
        changed:
          'The team plans to keep its scope realistic and grounded in what its current data actually supports, focusing on demonstrating a clear pain point the platform solves for cilia researchers.',
      },
      {
        name: 'Roi Eisenkot',
        role:
          'Associate Director of Bioengineering at UW CoMotion, managing a portfolio of bioengineering technologies and helping UW researchers think through translation, commercialisation and routes for getting technologies beyond the university',
        group: 'commercialisation',
        why:
          'To understand what realistic translational pathways the platform could take, and what decisions on dissemination, intellectual property and commercialisation should be made this early.',
        said:
          'He emphasised that the first step is defining the end goal, since patenting, open sourcing or distributing directly to researchers depend heavily on whether the priority is commercial sustainability or broad nonprofit dissemination. He noted that patents require significant resources and a plausible mechanism for recovering that investment, while distributing a biological technology as a black box may limit adoption because users cannot understand or adapt the system. His major recommendation was to ramp up customer discovery, since actions speak louder than words, and to define the minimum features the platform must have.',
        changed:
          'Wet lab and modelling teams will focus on establishing convincing and reproducible proof of concept and clarifying what the minimum viable research tool should contain, while Human Practices will expand customer discovery around existing workflows and unmet needs.',
      },
      {
        name: 'Dr. Mark Bothwell',
        role:
          'UW neurobiologist and member of faculty at the Institute for Stem Cell and Regenerative Medicine (ISCRM), with a long standing interest in primary cilia and receptor localisation',
        group: 'ciliary biologist',
        why:
          'To identify meaningful biological systems for the proposed platform and to evaluate whether tuning ciliary receptor abundance would address a real experimental need.',
        said:
          'He said a major gap in cilia research is that existing approaches typically disrupt formation of the entire cilium rather than selectively manipulating the localisation or abundance of an individual ciliary receptor. He identified promising systems including the GLP-1 receptor in pancreatic beta cells, ciliary GPCRs in hypothalamic control of appetite and body weight, PC1 in renal epithelial cells, somatostatin receptor 3 and serotonin receptor 6, and suggested eventually expanding beyond GPCRs to cilia enriched receptor tyrosine kinases such as FGF and PDGF. He recommended moving beyond HEK293T cells after initial proof of concept toward iPSC derived neuronal, renal or pancreatic beta cell models, stressed selectivity as a critical control, and said developmental and unintended effects should be carefully evaluated but are not unique to this platform.',
        changed:
          'The wet lab team can incorporate localisation and negative control assays and consider a disease relevant cell model after the SMO proof of concept, modelling teams can evaluate adapting the platform to additional receptor classes, and Human Practices will sharpen the proposed user need around selective receptor level perturbation.',
      },
      ],
      source: 'Integrated Human Practices: stakeholder interview write-ups, 2026.',
    },
    {
      kind: 'quote',
      body: [
        'A useful research tool should give researchers control over **which** protein changes, and over **when**, **where**, and **by how much** it changes. A tool that can set those independently lets scientists find the thresholds and the cilium-specific jobs that current methods cannot separate.',
      ],
      source: 'our founder\'s theory, written after the interviews and still being revised',
    },
    {
      kind: 'prose',
      heading: 'Where this goes next',
      body: [
        'We are organising Integrated Human Practices around three pillars. **Adoption**, what cilia researchers actually need before they would use this. **Responsible use**, what it means to give people a tool that alters ciliary localization, including a case study on auditory cilia as an example of a system that needs extra care. **Design safety**, designing the tool so that it is used safely, for example checking whether neighbouring proteins get ubiquitinated by accident.',
        'On openness we have moved from a yes or no question to a sequence. Roi Eisenkot at UW CoMotion reframed patents for us: a patent is not only a way to keep control, it can also be the thing that keeps a technology in the open. His stronger point was about evidence. A researcher saying an idea sounds interesting is not evidence they would adopt it, so we need to find out what labs currently spend time and money doing to work around this limit.',
      ],
      source:
        'Integrated Human Practices: IHP wiki outline; interview with Roi Eisenkot (UW CoMotion); NuukBio and Matchstick Technologies interviews.',
    },
  ],
}

const education: Page = {
  slug: '/human-practices/education',
  title: 'Sharing the Garden',
  kicker: 'chapter 09 · education',
  medal: true,
  storyBeat: 'The best part of a garden is showing someone else around it.',
  intro: 'We built our outreach around one idea: synthetic biology should be engaging, accessible, fun for kids, fun for the elderly, and inspiring. Here is what that looked like.',
  blocks: [
    {
      kind: 'pillars',
      id: 'programme',
      heading: 'What we built, and the gap each one fills',
      intro:
        'Nine activities, grouped under those qualities, with fun for kids and fun for the elderly sharing one bed.',
      pillars: [
        {
          word: 'engaging',
          activities: [
            {
              name: 'SynBio Hotline',
              audience: 'anyone with a question, online',
              why:
                'Synthetic biology has not been well understood and the field often feels out of reach for a general audience, possibly due to a lack of familiarity with the phrase in popular media, confusion surrounding what SynBio is, or hesitation to jump into a new, unknown field of study. Most people do not have a scientist in their life.',
              what:
                'An interactive, judgement free space where anyone could ask anything about synbio and get a detailed answer and explanation. People emailed in their questions relating to synbio, the team researched them and responded with short form content, with the platform chosen to lower barriers to access and meet audiences where they were.',
            },
            {
              name: 'Trivia Tabling',
              audience: 'high school and college students',
              why:
                'Students learn fundamental concepts of each science subject in school but often have fewer chances to explore the real world applications of science.',
              what:
                'An interactive trivia challenge hosted at club fairs. Participants spun a wheel to choose a trivia category. Four categories, Sustainable Synthetic Biology, (Bio)Ethics/Policy, Synthetic Biology Techniques, and Famous Scientists, covered everything from lab procedures to ethical considerations, representing the considerations made across all iGEM subteams. A fifth wild card category, Washington iGEM, covered the design principles behind the team\'s past projects. The ethics section used open ended questions to open dialogue about public perceptions of synbio.',
            },
          ],
        },
        {
          word: 'accessible',
          activities: [
            {
              name: 'Can You Beat DNA Polymerase',
              audience: 'school students, plus their parents and teachers',
              why:
                'People of all ages and backgrounds are familiar with the term DNA and with it being the blueprint of life, but public understanding largely stops there.',
              what:
                'Students acted as DNA polymerase, attaching corresponding base pairs to a given template strand using the basis of widely recognised stacking toys, racing another player to build a complementary strand. Run at the University of Washington\'s Engineering Discovery Days, where the activity was adapted on the fly: errors were used to discuss mutations, and older participants used Uracil instead of Thymine so they acted as RNA polymerase instead. After educators and parents asked to reproduce it, the team made a pamphlet or handbook on how to recreate the activity, using universal design principles, written and visual instructions for constructing each station, and colorblind friendly graphics.',
              numbers:
                'Run at Engineering Discovery Days, a free two-day campus festival that invited over 12,000 students in years 4 to 8, with their parents and teachers, from across Washington State. The take-home kit costs under five dollars a set.',
            },
            {
              name: 'How to Read Scientific Papers (Video Series)',
              audience: 'students meeting research papers for the first time',
              why:
                'Science is often inaccessible due to jargon filled literature and institutional paywalls, and undergraduate students often struggle with getting started on reading scientific literature.',
              what:
                'A tutorial series on how to read research papers, built as recorded interviews with first authors of academic publications: Dr. Swati Mishra of UW Medicine, UT Austin grad students Kangsan Kim and Clay Kosonocky, and postdoc Dr. Nikol Kaderabkova. Short associated worksheets were provided for educators to distribute to students.',
            },
          ],
        },
        {
          word: 'fun for all ages',
          activities: [
            {
              name: 'A SynBio Whodunnit!',
              audience: 'younger students',
              why:
                'Most education events targeted at a younger audience give little detail into the given field and opt to focus on the scientific method, which leaves many children lacking a sense of what science actually looks like.',
              what:
                'A murder mystery activity taking inspiration from the board game CLUE, giving a high level overview of basic laboratory techniques in three parts. Determine who committed the crime: students extracted DNA from a strawberry sample, a visual demonstration of the basics of genomics. Determine where the crime was done: students used pH strips on samples taken in different rooms to learn how different chemicals have unique properties like acidity. Determine the poison used: students performed paper chromatography with paper towels and food dyes to see a visual representation of polarity in action. The team also created a document outlining the procedure so the activity stays open source and easy to adopt.',
            },
            {
              name: 'Build a Baselet',
              audience: 'any age, with a harder version for older students',
              why:
                'The central dogma is the foundation of biology and advanced science builds on it, yet it is often not fully understood. Many younger students struggle to comprehend how DNA, RNA and proteins work together and find it difficult to visualize the microscopic processes.',
              what:
                'A hands on bracelet building kit introducing the central dogma. Each kit contains 12 colored beads, 2 charms, string, and a detailed handbook. Students string 6 colored beads, each color a different nitrogenous base, then string 6 complementary beads using RNA base pairing rules. The RNA is split into groups of 3 to model codons, and students use the handbook\'s amino acid chart to work out which amino acids their RNA codes for, each represented by a charm, so they add a miniature protein to the bracelet. For students who already understand the central dogma, the handbook provides mutations they can experiment with on their bracelet.',
            },
            {
              name: 'SYNBIngO',
              audience: 'older adults',
              why:
                'Most education efforts are directed to younger age ranges, which leaves the elderly and most adults disconnected from the sciences, and in America today academics and the life sciences have only grown farther away from the general public. People are also more likely to trust and stick to a treatment when they understand what it is doing in their body.',
              what:
                'An education event geared towards the elderly: a presentation on how synthetic biology impacts their lives by outlining how many common medications work, paired with bingo boards and a prize for the first BINGO to help with attention. The event closed with discussion prompts to foster open dialogue, asking participants to question the sciences and how involved they are in their lives, and inviting both the anxieties and the excitements they have about the future of synthetic biology.',
            },
          ],
        },
        {
          word: 'inspiring',
          activities: [
            {
              name: 'Conversations in Synthetic Biology',
              audience: 'students new to the field',
              why:
                'SynBio is not included in a typical K-12 curriculum and most extracurricular resources contain extremely technical language, so the field remains relatively unfamiliar and daunting to many students.',
              what:
                'A welcome week panel event. Speakers opened with an introduction of their career journey, followed by a guided Q&A led by iGEM members, after which students asked their own questions and participated in conversations with the panelists. The objectives were to showcase the many disciplines SynBio intersects with and to give students the opportunity to interact with professionals in the field, keeping the information easy to understand for students at different familiarity levels.',
            },
            {
              name: 'Scientists You Might Not Know',
              audience: 'middle and high school students',
              why:
                'When we hear about major scientific accomplishments we often hear the same few names, yet many discoveries we take for granted are already integrated into everyday science, among wet lab protocols, new therapeutics, or medical practices, without us knowing the people behind these innovations.',
              what:
                'A set of profiles highlighting scientists whose work changed medicine and biotechnology even though their names do not always appear in textbooks, showing that progress can come from asking an unexpected question, challenging what people thought was possible, or continuing to investigate when others might have stopped.',
            },
          ],
        },
      ],
      source: 'Education and Outreach draft, 2026.',
    },
    {
      kind: 'prose',
      heading: 'And this website',
      body: [
        'The garden you are reading is part of the outreach, not decoration around it. The **Playground** is a small space where anyone can walk the hedgehog around and plant flowers, which is exactly the audience that will not sit through a paragraph about ubiquitin ligases.',
      ],
    },
  ],
}

const safety: Page = {
  slug: '/team/safety',
  title: 'Tending Safely',
  kicker: 'chapter 13 · safety',
  storyBeat: 'Gloves on. Some things in a garden bite.',
  intro: 'This page is not finished. It records what we can state now, and the rest follows once the iGEM safety form is done.',
  blocks: [
    {
      kind: 'facts',
      heading: 'What we can state now',
      items: [
        {
          title: 'Where we work',
          body: 'Cloning in E. coli plasmids, and mammalian cell culture in NIH/3T3 and HEK293T lines. Work is done in the advising lab under its existing protocols.',
        },
        {
          title: 'Reagents',
          body: 'Any hazardous reagents come through the advising lab under its protocols, rather than being bought on a student grant.',
        },
        {
          title: 'The honest state',
          body: 'There is no biosafety document written yet. The exact biosafety level and a dual-use statement will be set out here once the safety form is done.',
        },
      ],
    },
  ],
}

/* ===================================================================== *
 * ATTRIBUTIONS
 * ===================================================================== */

const attributions: Page = {
  slug: '/team/attributions',
  title: 'Who Helped Us Dig',
  kicker: 'chapter 12 · attributions',
  storyBeat: 'None of this was one hedgehog.',
  intro: 'What we did ourselves, and what we had help with.',
  blocks: [
    {
      kind: 'cards',
      heading: 'Advisors and mentors',
      items: [
        { title: 'Dr. Frank DiMaio', body: 'Protein design mentor at the Institute for Protein Design. Set the tool choices, the filter metrics, and the target-selection rules, and gave us a seat on the DIGS cluster.' },
        { title: 'Dr. Jennifer Kong', body: 'Wet lab advisor. The MMM complex comes from her lab, and she guides the biology and supplies reagents.' },
        { title: 'Dr. Claudia Vasquez', body: 'Wet lab advisor. Feasibility review and experimental design.' },
        { title: 'Dr. Herbert Sauro', body: 'Systems biology advisor. Reshaped the kinetic modelling into a model-selection approach.' },
        { title: 'Dr. Stacey Ogden', body: 'Hedgehog signalling researcher at St. Jude. Gave us the disease picture and the honest limits of the approach.' },
        { title: 'Adam Chazin-Gray', body: 'PhD student at the Institute for Protein Design who mentored hands-on lab work.' },
      ],
    },
    {
      kind: 'cards',
      heading: 'Support and sponsors',
      items: [
        { title: 'Institute for Protein Design', body: 'Lab space, mentorship, and funding.' },
        { title: 'Biochemistry Department', body: 'Recurring annual support and the lab that hosts us.' },
        { title: 'Student Technology Fee', body: 'Funds the Hyak compute we run the design pipeline on.' },
        { title: 'Biology and Microbiology', body: 'Departmental support.' },
        { title: 'Reagent grants', body: 'DNA and reagents in kind from Twist Bioscience, IDT, GenScript, NEB, and Zymo.' },
        { title: 'Research Computing Club', body: 'Access to the Hyak cluster.' },
      ],
    },
    {
      kind: 'cards',
      heading: 'Software we did not write',
      items: [
        { title: 'RFdiffusion3', body: 'Backbone generation.' },
        { title: 'ProteinMPNN', body: 'Sequence design.' },
        { title: 'RoseTTAFold3', body: 'Forward folding to check designs.' },
        { title: 'BindCraft', body: 'The second, more stringent design track.' },
        { title: 'Rosetta and PyMOL', body: 'Interface scoring and structural inspection.' },
        { title: 'Tellurium and SciPy', body: 'Modelling the ODE system.' },
      ],
    },
  ],
}

/* ===================================================================== *
 * PAGES THE ARCHITECTURE ASKS FOR THAT ARE NOT WRITTEN YET
 *
 * Each one is a real page with a real address, so the nav is the agreed
 * architecture from the first day rather than growing into it. Each says what
 * belongs on it. Delete the `todo` block as the content arrives.
 * ===================================================================== */

const implementation: Page = {
  slug: '/project/implementation',
  title: 'Out of the Greenhouse',
  kicker: 'chapter 04 · proposed implementation',
  storyBeat: 'A seedling is not a garden. Who plants this, and where?',
  intro: 'Who would use this tool outside our lab, how it would reach them, and what has to be true first.',
  blocks: [
    {
      kind: 'todo',
      body: [
        'Not written yet. What belongs here:',
        'Who the user is. Our Human Practices work points at cilia labs who want to raise or lower one receptor, not at patients, so say that plainly and say why.',
        'What they would receive: a plasmid, a registry part, a protocol, or a service.',
        'What has to be true before any of that: a validated binder, a delivery route, and the safety position.',
        'The honest limits, including what we would not claim this is ready for.',
      ],
    },
  ],
}

const parts: Page = {
  slug: '/wetlab/parts',
  title: 'Seeds We Logged',
  kicker: 'chapter 06 · parts and registry',
  storyBeat: 'Every seed saved and labelled, so the next gardener can plant it.',
  intro: 'The parts we designed, built and submitted to the iGEM Registry.',
  blocks: [
    {
      kind: 'todo',
      body: [
        'Not written yet. What belongs here:',
        'Each part: its registry number, what it is, and the sequence.',
        'Which are basic parts and which are composite.',
        'The characterisation data for each one, and a link to the experiment it came from.',
        'Which parts we improved rather than made, and what the improvement was.',
      ],
    },
  ],
}

const contribution: Page = {
  slug: '/team/contribution',
  title: 'What We Leave Behind',
  kicker: 'chapter 10 · contribution',
  medal: true,
  storyBeat: 'The part of the garden that is for whoever comes next.',
  intro: 'The documented thing a future team gets to start from.',
  blocks: [
    {
      kind: 'todo',
      body: [
        'Not written yet, and this one is a medal page, so it needs to be specific.',
        'The contribution itself: the part, the data, the method or the documentation another team can pick up.',
        'Why it is useful to someone who is not us, with the evidence that it works.',
        'Where it lives, so it can be found: registry entry, repository, or protocol.',
      ],
    },
  ],
}

const judging: Page = {
  slug: '/team/judging',
  title: 'The Checklist',
  kicker: 'chapter 11 · judging',
  storyBeat: 'Everything we claim, and where on this wiki to check it.',
  intro: 'Where each medal criterion is evidenced, so nothing has to be hunted for.',
  blocks: [
    {
      kind: 'todo',
      body: [
        'Not written yet. What belongs here:',
        'One row per medal criterion we are claiming, each with a link straight to the page and section that evidences it.',
        'The safety and security form, the attributions, and the deliverables, each ticked off or honestly marked as outstanding.',
        'Cross-check against the official 2026 requirements before the wiki freeze. WebDev 7/27/26 left this open.',
      ],
    },
  ],
}

/* ===================================================================== *
 * Registry
 * ===================================================================== */

/**
 * Every page built from this file, in reading order. The order drives the
 * previous and next links at the foot of each page and the chapter numbers in
 * the kickers, and it follows the nav groups in `nav.ts`.
 *
 * Two routes are pages but are not here, because their content is a component
 * rather than blocks: the Team page and the Notebook.
 */
export const PAGES: Page[] = [
  description,
  background,
  engineering,
  implementation,
  experiments,
  parts,
  model,
  humanPractices,
  education,
  contribution,
  judging,
  attributions,
  safety,
]

export function pageBySlug(slug: string): Page | undefined {
  return PAGES.find((p) => p.slug === slug)
}

/** Previous/next page in reading order, for the "keep walking" footer link. */
export function pageNeighbours(slug: string): { prev?: Page; next?: Page } {
  const i = PAGES.findIndex((p) => p.slug === slug)
  if (i < 0) return {}
  return { prev: PAGES[i - 1], next: PAGES[i + 1] }
}
