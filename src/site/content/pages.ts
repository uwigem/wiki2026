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
 * `[label](/project/design#that-id)`. Ids are kebab-case and have to be unique
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
          body: 'A **de novo minibinder** pries apart the MEGF8 and MOSMO interface. [How we design one](/project/design#pipeline). The MMM complex can no longer assemble, so it stops clearing SMO, so SMO stays in the cilium and Hedgehog signalling goes up.',
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
    {
      kind: 'prose',
      heading: 'From a therapy to a platform',
      body: [
        'We started out framing this as a Hedgehog therapy. After talking with researchers it became clear the more useful thing is a **modular research platform**, a way for any cilia lab to raise or lower a receptor of their choice and watch what happens. The reason that is worth doing is [the gap nothing else fills](/impact/human-practices#the-gap). SMO is the receptor where the ground truth is already known, so it is our proof, not our endpoint. The down arm test on GPR161 is how we show the same parts port to a receptor the complex has no natural relationship with.',
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

const design: Page = {
  slug: '/project/design',
  title: 'Designing the Binder',
  kicker: 'chapter 03 · design',
  storyBeat: 'We went to the design shed and grew proteins that never existed before, aimed at one small, stubborn interface.',
  intro:
    'The up arm needs a minibinder that pries apart the MEGF8 and MOSMO interface. We design these de novo on the computer and filter them hard before anything reaches a bench.',
  blocks: [
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
        'The receptor above is **Smoothened**, the protein the whole project is aimed at, with a molecule of **cholesterol** bound in the domain that sits outside the cell. The helices below it cross the membrane seven times, which is the shape that makes it a GPCR. Cholesterol binding is the activation step [our kinetic model argues about](/project/model#sensitivity), so this is the picture that page is describing in equations.',
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
  ],
}

const engineering: Page = {
  slug: '/project/engineering',
  title: 'Build, Test, Learn',
  kicker: 'chapter 04 · engineering',
  storyBeat: 'Nothing in a garden works the first time. You plant, you watch, you move it two feet to the left.',
  intro: 'The build, test, learn cycles, in the order we actually ran them, including the parts that did not work the first time.',
  blocks: [
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
              body: 'Good numbers are not the same as a good binder. We rebuilt the filtering around what is physically reachable: re-fold every survivor against only the **extracellular** parts of the targets and apply the 2 by 2 filter again, then run a custom check that rejects anything still sitting within 5 to 10 Angstrom of the transmembrane helices. Dr. DiMaio added a third test, folding the binder **on its own** with no target present, to confirm it holds its shape rather than being propped up by the thing it is supposed to bind. About **25 designs** survived all of it. The filters are listed in order on [the Design page](/project/design#pipeline).',
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
        'A second problem showed up in the pipeline itself. RoseTTAFold3 could not fold our targets well because the sequence databases were thin, so the designs were failing the fold check for the wrong reason. We fixed it by **templating MOSMO and MEGF8** during forward folding. We now have about 24 MOSMO binder backbones through sequence design. The Design page has the full pipeline.',
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

const results: Page = {
  slug: '/project/results',
  title: 'What Grew',
  kicker: 'chapter 05 · results',
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
  slug: '/project/model',
  title: 'The Model',
  kicker: 'chapter 06 · model',
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
  slug: '/impact/human-practices',
  title: 'Who the Garden Is For',
  kicker: 'chapter 07 · human practices',
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
      kind: 'cards',
      heading: 'Three interviews that changed the project',
      intro: 'These are the conversations we have written notes for. Each one moved a real decision.',
      items: [
        {
          title: 'Dr. Ning Zheng, UW Pharmacology',
          body: 'A ubiquitination expert. He told us a transmembrane E3 PROTAC does not exist in the literature, so this is genuinely new. He also corrected our vocabulary. Because we strengthen an interaction that already exists, we are building a **LockTAC**, not a PROTAC. And he pushed us to stop thinking about only SMO and prove that any protein can be attached, which is the moment the project became a modular platform.',
        },
        {
          title: 'Dr. Stacey Ogden, St. Jude',
          body: 'A Hedgehog signalling researcher. She gave us the disease picture, that Hedgehog going up drives basal cell carcinoma and about 30 percent of medulloblastoma, and that you cannot give young children Hedgehog inhibitors, which is exactly why a tunable tool matters. She also set an honest limit. Our approach does not help cases driven by SUFU or GLI mutations.',
        },
        {
          title: 'Dr. Herbert Sauro, UW Bioengineering',
          body: 'A systems biologist who met with the modeling subteam twice. He moved us from one big model to a set of candidate models chosen by AIC and BIC, and gave us the sensitivity and uncertainty methods now on the Model page. See the Model page for the details.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'How the page will be built',
      body: [
        'We are organising Integrated Human Practices around three pillars. **Adoption**, what cilia researchers actually need before they would use this. **Responsible use**, what it means to give people a tool that alters ciliary localization, including a case study on auditory cilia as an example of a system that needs extra care. **Design safety**, designing the tool so that it is used safely, for example checking whether neighbouring proteins get ubiquitinated by accident.',
      ],
      source: 'Integrated Human Practices: IHP wiki outline (three pillars and guiding question).',
    },
    {
      kind: 'todo',
      body: [
        'TODO(human practices): write up the fuller stakeholder set. Many are contacted but not yet confirmed, so do not list anyone as interviewed until the conversation has happened.',
        'TODO(human practices): add the "what changed" line to every interview, and tie the interviews forward into Design and Results so this reads as one story.',
        'TODO(human practices): build the auditory-cilia responsible-use case study.',
      ],
    },
  ],
}

const education: Page = {
  slug: '/impact/education',
  title: 'Sharing the Garden',
  kicker: 'chapter 08 · education & outreach',
  storyBeat: 'The best part of a garden is showing someone else around it.',
  intro: 'We built our outreach around one idea: synthetic biology should be engaging, accessible, fun for kids, fun for the elderly, and inspiring. Here is what that looked like.',
  blocks: [
    {
      kind: 'cards',
      heading: 'What we made',
      items: [
        {
          title: 'iGEM Alchemy',
          body: 'A browser game where you drag and combine atoms into bigger and bigger pieces of biology, from a single amino acid all the way up to a GFP plasmid, across four levels. Recipes and descriptions from Human Practices, art from Creative, built by Web Dev. The name is not final.',
        },
        {
          title: 'Paper-reading video series',
          body: 'Each episode takes one real UW research paper and decodes it for a general audience, teaching a reusable roadmap of title, abstract, figures, and discussion, then interviews the author. Episode one is on firefly luciferase in cancer research, with Prof. Elizabeth Wayne.',
        },
        {
          title: 'Trivia tabling',
          body: 'A spin-the-wheel game with five categories, from synthetic biology techniques to ethics and policy, each with a question, an explanation, and a discussion prompt. Run at the ASUW Spring Fair and Admitted Students Day.',
        },
        {
          title: 'Build a Baselet',
          body: 'A take-home bracelet that models the central dogma with colour-coded nucleotide beads and a codon chart. Scan the QR at the end to see an AlphaFold model of the protein you just built. Aimed at ages 8 to 18, about 20 cents per person.',
        },
        {
          title: 'Talking with elders',
          body: 'A two-way session at an elderly home that teaches the central dogma and cell signalling, with a survey before and after, built to listen as much as to explain.',
        },
        {
          title: 'Scientists You Might Not Know',
          body: 'Short profiles of overlooked scientists, from Osamu Shimomura, who discovered GFP, to Alice Ball, a UW chemistry alumna.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'And this website',
      body: [
        'The garden you are reading is part of the outreach, not decoration around it. The **Playground** is a small space where anyone can walk the hedgehog around and plant flowers, which is exactly the audience that will not sit through a paragraph about ubiquitin ligases.',
      ],
    },
    {
      kind: 'todo',
      body: [
        'TODO(education): link the finished iGEM Alchemy build next to the meadow in the Playground.',
        'TODO(education): add participation numbers, age groups, and photos from each event.',
        'TODO(education): add the feedback we collected and what we changed because of it.',
      ],
    },
  ],
}

const safety: Page = {
  slug: '/impact/safety',
  title: 'Tending Safely',
  kicker: 'chapter 09 · safety',
  storyBeat: 'Gloves on. Some things in a garden bite.',
  intro: 'This page is not finished. We are recording what we can state now, and marking the rest as pending until the safety form is done.',
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
          body: 'There is no biosafety document written yet. The items below are pending, not decided.',
        },
      ],
    },
    {
      kind: 'todo',
      body: [
        'TODO(ops): complete the official iGEM Safety and Security form and mirror the answers here.',
        'TODO(ops): confirm the exact cell lines, hosts, and biosafety level with the advising lab.',
        'TODO(ops): write a real dual-use paragraph. This is a tool that changes a developmental pathway, so it needs more than boilerplate.',
        'TODO(wetlab): list the lab safety training each member completed.',
      ],
    },
  ],
}

/* ===================================================================== *
 * ATTRIBUTIONS
 * ===================================================================== */

const attributions: Page = {
  slug: '/attributions',
  title: 'Who Helped Us Dig',
  kicker: 'attributions',
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
    {
      kind: 'todo',
      body: [
        'TODO(content): per-part and per-page attribution statements in the format iGEM requires.',
        'TODO(content): clearly separate student work from advisor and lab-staff work.',
        'TODO(webdev): credit the pixel garden and this site build in the footer.',
      ],
    },
  ],
}

/* ===================================================================== *
 * Registry
 * ===================================================================== */

export const PAGES: Page[] = [
  description,
  background,
  design,
  engineering,
  results,
  model,
  humanPractices,
  education,
  safety,
  attributions,
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
