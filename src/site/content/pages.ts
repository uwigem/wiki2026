/**
 * Page content for the whole wiki.
 *
 * Content is written from the team's 2026 project documents. Anything
 * not settled yet is a plain TODO. Editing the wiki means editing this file; the components do not
 * hard-code copy.
 *
 * Inline formatting (**bold**, *italic*, `code`) works in a block's `body`, and
 * only there: `prose`, `cards` items, `steps` items and `quote`. Everywhere else
 * the characters are published literally. See docs/STYLE_GUIDE.md for the table.
 */
import type { CycleData } from "../components/CycleWheel";
import type { MatrixRow } from "../components/CapabilityMatrix";
import type { Stat } from "../components/StatRow";
import type { DosePoint } from "../components/DoseCurve";
import type { FunnelStage } from "../components/FunnelChart";
import type { Pillar } from "../components/ProgrammePillars";
import type { Stakeholder } from "../components/StakeholderGarden";
import type { TornadoRow } from "../components/TornadoChart";
import type { ToolEntry } from "../components/ToolShed";
import type { Reference } from "../components/References";
import type { Stage } from "../components/StageRail";
import type { ScienceFigureKind } from "../components/ScienceFigure";
import type { BorrowItem } from "../components/BorrowStrip";
import type { TreeNode } from "../components/DecisionTree";
import type { MembraneProtein } from "../components/MembraneLandscape";
import type { WorkflowStage } from "../components/Workflow";
import type { PersonaKey } from "../components/gardenArt";
import { SMO_5L7D, type Structure } from "./structures";

/**
 * Anything with an `id` can be linked to from anywhere else in the wiki, with
 * `[label](/model#that-id)`. Ids are kebab-case and have to be unique
 * within their page. Add one the moment a section is worth pointing at.
 */
export interface Anchored {
  id?: string;
  /**
   * This block starts a named section of the page. A page with three or
   * more sections is laid out as one signboard and card per section, with a
   * list of the sections in the left margin (a corner button on a phone).
   */
  section?: string;
}

export interface CardItem {
  title: string;
  body: string;
  note?: string;
}

/** One kind of researcher who might pick the platform up. */
export interface Persona {
  title: string;
  /** What this kind of researcher does. */
  role?: string;
  /** Why the platform matters to them. */
  stake?: string;
  /** What they would need to see before trusting it. */
  cares?: string;
  /** How they would actually use it. */
  use?: string;
  /** A single paragraph instead of the four fields. */
  body?: string;
  /** Which accessory the hedgehog carries for this kind of researcher. */
  persona?: PersonaKey;
}

export type Block = Anchored &
  /** Paragraphs in a clean cream panel. The default. */
  (| { kind: "prose"; heading?: string; body: string[]; source?: string }
    /** A grid of flower-bed cards. */
    | {
        kind: "cards";
        heading?: string;
        intro?: string;
        items: CardItem[];
        source?: string;
      }
    /** A numbered path of stepping stones, for pipelines and cycles. */
    | {
        kind: "steps";
        heading?: string;
        intro?: string;
        items: CardItem[];
        source?: string;
      }
    /** The design/build/test/learn wheel, with one tab per cycle. */
    | { kind: "cycles"; heading?: string; intro?: string; cycles: CycleData[] }
    /** A pulled-out quote on a wooden sign. */
    | { kind: "quote"; body: string[]; source?: string }
    /** Compact key/value facts. */
    | {
        kind: "facts";
        heading?: string;
        items: { title: string; body: string }[];
      }
    /** The guide explaining the paragraph above in plain words. */
    | { kind: "narration"; body: string[]; label?: string }
    /** A row of figures that carry an argument. */
    | {
        kind: "stats";
        heading?: string;
        intro?: string;
        items: Stat[];
        footnote?: string;
        source?: string;
      }
    /** What existing tools can and cannot do, side by side. */
    | {
        kind: "matrix";
        heading?: string;
        intro?: string;
        columns: string[];
        rows: MatrixRow[];
        source?: string;
      }
    /** The garden shed: the tools researchers already have, and where each stops. */
    | {
        kind: "toolshed";
        heading?: string;
        intro?: string;
        tools: ToolEntry[];
        source?: string;
      }
    /** Which parameters in a model actually move the answer. */
    | {
        kind: "tornado";
        heading?: string;
        intro?: string;
        rows: TornadoRow[];
        unit?: string;
        positiveMeans?: string;
        negativeMeans?: string;
        footnote?: string;
        source?: string;
      }
    /** A dose against response curve, with the limit it has to stay under. */
    | {
        kind: "dose";
        heading?: string;
        intro?: string;
        points: DosePoint[];
        xLabel: string;
        yLabel: string;
        threshold?: { value: number; label: string };
        footnote?: string;
        source?: string;
      }
    /** How many candidates survive each filter. */
    | {
        kind: "funnel";
        heading?: string;
        intro?: string;
        stages: FunnelStage[];
        goal?: { label: string; count: number };
        footnote?: string;
        source?: string;
      }
    /** The outreach programme, under the team's own four principles. */
    | {
        kind: "pillars";
        heading?: string;
        intro?: string;
        pillars: Pillar[];
        source?: string;
      }
    /** The people who shaped the project, as beds of flowers. */
    | {
        kind: "stakeholders";
        heading?: string;
        intro?: string;
        people: Stakeholder[];
        pending?: string[];
        source?: string;
      }

    /** The kinds of researcher who would pick this up, one at a time. */
    | {
        kind: "personas";
        heading?: string;
        intro?: string;
        people: Persona[];
        source?: string;
      }
    /** A boxed statement with a daisy border: our system, the founder's theory. */
    | {
        kind: "callout";
        heading?: string;
        label?: string;
        body: string[];
        source?: string;
      }
    /** A table of text. Cells take inline formatting. Rows stack into cards on a phone. */
    | {
        kind: "table";
        heading?: string;
        intro?: string;
        columns: string[];
        rows: string[][];
        caption?: string;
        source?: string;
      }
    /** Numbered references for the section above, matching its [n] markers. */
    /**
     * A numbered reference list. `for` names the section whose `[n]` markers
     * it answers (the section label, for example "Community need"), so those
     * markers link to it.
     */
    | { kind: "references"; heading?: string; for?: string; items: Reference[] }
    /** A strategy in stages, with a rail beside it and a "we are here" line. */
    | {
        kind: "rail";
        heading?: string;
        intro?: string;
        stages: Stage[];
        hereLabel?: string;
        source?: string;
      }
    /** A yes/no decision tree a reader answers one question at a time. */
    | {
        kind: "flowchart";
        heading?: string;
        intro?: string;
        start: string;
        nodes: TreeNode[];
        source?: string;
      }
    /** The ciliary membrane and the proteins in it, one card each. */
    | {
        kind: "landscape";
        heading?: string;
        intro?: string;
        proteins: MembraneProtein[];
        source?: string;
      }
    /** A short workflow as a row of stages, one open at a time. */
    | {
        kind: "workflow";
        heading?: string;
        intro?: string;
        stages: WorkflowStage[];
        footnote?: string;
        source?: string;
      }
    /**
     * Blocks that stay closed until asked for: references, the working behind
     * a number, background a reader may know. The heading and summary stay
     * visible. Links into a closed section open it.
     */
    | {
        kind: "details";
        heading: string;
        summary?: string;
        open?: boolean;
        blocks: Block[];
      }
    /** A protein structure, drawn from coordinates. */
    | { kind: "structure"; structure: Structure }
    /** The animated project mark, with a line saying what it is getting at. */
    | { kind: "logo"; caption: string }
    /**
     * The interactive explainer: SMO in, SMO out, a blocker and a recruiter,
     * and the hedgehog reading the level. It used to open Home 1 and Home 2;
     * Home 3 tells the story its own way, so it lives here with the two arms.
     */
    | { kind: "explainer" }
    /** A figure, or the marked hole where one is going. */
    | {
        kind: "figure";
        src?: string;
        alt?: string;
        caption: string;
        owner?: string;
        ratio?: "wide" | "square" | "tall";
        source?: string;
      }
    /**
     * One of the page's own explanatory drawings: still, no controls, and
     * showing only what the text beside it says. See `ScienceFigure`.
     */
    | { kind: "diagram"; figure: ScienceFigureKind; caption?: string; source?: string }
    /** Things that already exist, and the one thing added to them. */
    | {
        kind: "borrow";
        heading?: string;
        items: BorrowItem[];
        outcome: string;
        source?: string;
      }
    /** A visible "not written yet" marker. */
    | { kind: "todo"; body: string[] }
  );

export interface Page {
  slug: string;
  title: string;
  /** Pixel eyebrow label above the title. */
  kicker: string;
  /**
   * This page is evidence for a medal criterion, so it has to be finished and
   * specific. The homepage counts too, and is not in this file.
   *
   * Marked so `content/check.ts` can shout while a medal page still has a
   * `todo` block in it.
   */
  medal?: true;
  /** The guide's narration for this stop in the garden. */
  storyBeat: string;
  /** Lede paragraph, rendered large under the title. */
  intro?: string;
  blocks: Block[];
}

/* ===================================================================== *
 * PROJECT
 * ===================================================================== */

const description: Page = {
  slug: "/description",
  title: "The Idea",
  kicker: "chapter 01 · description",
  storyBeat:
    "Every garden has someone deciding how tall the hedge grows. In your cells, that someone is a small protein complex, and we built a way to lean on it.",
  intro:
    "We are building a modular device that controls how much of a receptor stays in the primary cilium. We prove it on Hedgehog signalling, then show the same parts work on other receptors.",
  blocks: [
    {
      kind: "prose",
      heading: "The short version",
      body: [
        "The **Hedgehog pathway** is one of the handful of signals that pattern an animal during development, and one that drives cancer when it switches back on in adults. Its central transducer is **Smoothened (SMO)**, a receptor that has to sit in the **primary cilium** to be active.",
        "How much SMO sits in that cilium is not fixed. A membrane-bound complex called **MMM**, made of **MEGF8, MOSMO and MGRN1**, tags SMO for degradation and clears it out. MGRN1 is the enzyme, and MEGF8 and MOSMO are its adapters.",
        "We build a device out of three modular parts, a **targeting module**, an **inducible linker**, and an **E3 module**, that borrows this natural machinery to raise or lower how much of a receptor stays in the cilium.",
      ],
      source: "How to frame the project (Wet Lab wiki notes), 2026.",
    },
    {
      kind: "cards",
      id: "two-arms",
      heading: "Two arms, opposite directions",
      intro:
        "Both arms are engineered, both are genetically encodable, and they push the same pathway in opposite directions.",
      items: [
        {
          title: "Up arm",
          body: "A **de novo minibinder** pries apart the MEGF8 and MOSMO interface. [How we design one](/engineering#pipeline). The MMM complex can no longer assemble, so it stops clearing SMO, so SMO stays in the cilium and Hedgehog signalling goes up.",
        },
        {
          title: "Down arm",
          body: "A **chemically induced linker** forces MGRN1 onto a chosen receptor. That receptor now gets tagged and cleared, so signalling through it goes down. We test this by recruiting MGRN1 to GPR161, a receptor MMM does not normally touch.",
        },
        {
          title: "A dial, not a switch",
          body: "Because the device works through a graded degradation step rather than blocking the receptor outright, the goal is to set the amount of receptor in the cilium, not just turn it off.",
        },
      ],
    },
    { kind: "explainer", id: "explainer" },
    {
      kind: "prose",
      heading: "From a therapy to a platform",
      body: [
        "We started out framing this as a Hedgehog therapy. After talking with researchers it became clear the more useful thing is a **modular research platform**, a way for any cilia lab to raise or lower a receptor of their choice and watch what happens. The reason that is worth doing is [the gap nothing else fills](/human-practices#the-gap). SMO is the receptor where the ground truth is already known, so it is our proof, not our endpoint. The down arm test on GPR161 is how we show the same parts port to a receptor the complex has no natural relationship with.",
        "Dr. Ning Zheng, a ubiquitination expert we interviewed, pointed out that because we strengthen an interaction that already exists rather than forcing a brand new one, the right name for this is a **LockTAC**, not a PROTAC. He also noted a transmembrane version of this has not been shown in the literature, which is where the novelty sits.",
      ],
      source:
        "Interview with Dr. Ning Zheng (UW Pharmacology); IHP wiki outline.",
    },
  ],
};

const background: Page = {
  slug: "/background",
  title: "A Problem in the Garden",
  kicker: "chapter 02 · background",
  storyBeat:
    "The hedge can grow too tall or not grow at all, and both are a problem. The tools we have today can only cut, not trim.",
  intro:
    "Hedgehog signalling has to be kept in a narrow band. Too much drives cancer, too little breaks development, and the drugs we have can only shut it off.",
  blocks: [
    {
      kind: "logo",
      caption:
        "Hedgehog signalling is a balance, and both ends of it are dangerous. Tip it one way and you get cancer; tip it the other and development goes wrong. The drugs we have can only take one hedgehog off the scale entirely. What is missing is a way to set where the beam sits.",
    },
    {
      kind: "prose",
      heading: "Why the amount matters",
      body: [
        "Hedgehog signalling is a dial that cells read by how much SMO reaches the primary cilium. When it runs too high in adults it drives cancers, most clearly **basal cell carcinoma** and about **30 percent of medulloblastoma**, the childhood brain tumour. When it runs too low during development it causes serious birth defects.",
        "That is the core problem. The pathway is not something you want to switch off, it is something you want to hold in range. Dr. Stacey Ogden, a Hedgehog researcher at St. Jude we interviewed, made the point plainly. You do not give young children Hedgehog inhibitors, so a tool that can set the level rather than block it outright would be genuinely useful.",
      ],
      source: "Interview with Dr. Stacey Ogden (St. Jude).",
    },
    {
      kind: "prose",
      id: "current-drugs",
      heading: "The limits of the current drugs",
      body: [
        "The approved SMO inhibitors, vismodegib and sonidegib, block the receptor directly. Tumours mutate SMO and become resistant, and the drugs carry harsh side effects, which is why they are not given to children. Blocking is a blunt move on a pathway that is really about amount.",
        "We also state the limit up front, from the same interview. This approach works on cases driven by too much SMO. It does not help cases driven by mutations further down the pathway, in **SUFU** or **GLI**.",
        "What we propose instead is [a device with two arms](/description#two-arms), which sets the amount rather than blocking the receptor.",
      ],
      source: "Interview with Dr. Stacey Ogden (St. Jude).",
    },
    {
      kind: "cards",
      heading: "What we get to build on",
      items: [
        {
          title: "A membrane E3 ligase",
          body: "The Kong lab identified the MMM complex, a membrane-bound E3 ubiquitin ligase that naturally controls SMO levels. That is the machine our device borrows.",
        },
        {
          title: "MEGF8, MOSMO, MGRN1",
          body: "MGRN1 is the enzyme. MEGF8 and MOSMO are adapters, and MOSMO stabilises the MEGF8 to MGRN1 binding. Take a part away and the complex stops working, which is what the up arm exploits.",
        },
        {
          title: "A real structure",
          body: "The Kong lab has cryo-EM of the complex and a preprint identifying a site whose mutation breaks it, so we have something concrete to design a binder against.",
        },
      ],
      source:
        "Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358).",
    },
  ],
};

/**
 * How the binder is designed. These were a Design page of their own until the
 * team settled its final architecture (2026-10-08), which has no Design page,
 * so they now open the Engineering page: first how a design is made and
 * filtered, then the cycles of what went wrong and what changed.
 */
const designBlocks: Block[] = [
  {
    kind: "prose",
    heading: "What we are designing against",
    body: [
      "The up arm of the device is a **de novo minibinder** that sits on the **MEGF8 to MOSMO interface**. Break that interface and the MMM complex cannot assemble, so it stops ubiquitinating **Smoothened (SMO)**, so SMO stays in the cilium and Hedgehog signalling goes up.",
      "We picked this interface because the Kong lab has cryo-EM of the MMM complex and a preprint that points to a specific site whose mutation breaks the complex. That gives us a real structure and a real binding site to design toward, which is what a good target needs.",
    ],
    source:
      "Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358); target-selection notes from Dr. Frank DiMaio.",
  },
  {
    kind: "steps",
    id: "pipeline",
    heading: "The pipeline",
    intro: "Every candidate walks this path. Most do not finish it.",
    items: [
      {
        title: "Generate backbones",
        body: "**RFdiffusion3** builds candidate binder backbones against the target, guided by hotspot residues and a length range. It runs on the UW Hyak cluster inside a RosettaCommons foundry container.",
      },
      {
        title: "Design sequences",
        body: "**ProteinMPNN** threads sequences onto each backbone, five sequences per backbone.",
      },
      {
        title: "Forward fold",
        body: "**RoseTTAFold3** folds each designed sequence together with the target to check that it is predicted to bind, at about 40 sequences per hour per GPU. MOSMO and MEGF8 are templated because the sequence databases were a bottleneck.",
      },
      {
        title: "Filter hard",
        body: "Keep a design only if it clears the **2 by 2 filter**: a **minPAE under 2** and a **backbone RMSD under 2 Angstrom** between the shape we asked for and the shape the sequence actually folds into. Both cutoffs are the published gold standard, and Dr. DiMaio told us minPAE is the single best predictor of a real binder.",
      },
      {
        title: "Score the interface",
        body: "Survivors get **pLDDT** for per-residue confidence, where we treat 80 as satisfactory, and **ddG** as a computational stand-in for binding strength, where we want a negative number. **PyRosetta InterfaceAnalyzer** adds buried surface area, unsatisfied hydrogen bonds and shape complementarity, and **PyMOL** is used to look at each one by hand.",
      },
    ],
    source:
      "Protein Design pipeline docs (RFD3, MPNN, RF3 how-to; Hyak minidocs) and DiMaio mentorship sessions.",
  },
  {
    kind: "narration",
    body: [
      "Three programs, doing three jobs. The first **sculpts a shape** that should stick to the target. The second **picks an amino acid sequence** that might fold into that shape. The third **checks the sequence actually folds that way**, and still lands in the right place.",
      "If the shape we asked for and the shape we got are more than about two atoms-widths apart, we throw it away.",
    ],
  },
  {
    kind: "funnel",
    id: "funnel",
    heading: "How much gets thrown away",
    intro:
      "Almost all of it, which is the point. These are the numbers from our MOSMO and MEGF8 campaign.",
    stages: [
      {
        label: "binders designed and folded",
        count: 5700,
        note: "backbones from RFdiffusion3, sequences from ProteinMPNN, folded by RoseTTAFold3",
      },
      {
        label: "cleared the 2 by 2 filter",
        count: 255,
        note: "minPAE under 2 and backbone RMSD under 2 Angstrom",
      },
      {
        label: "survived the membrane checks",
        count: 25,
        note: "refolded against the extracellular surfaces only, then checked for self-consistency",
      },
    ],
    goal: { label: "what we want to order and test", count: 96 },
    footnote:
      "The drop from 255 to about 25 is the interesting one. Our first filters were passing designs that bound a part of the target buried inside the membrane, where no protein could ever reach them. That is [the third engineering cycle](/engineering#cycles).",
    source:
      "Protein Design: binder design pipeline and engineering cycles, 2026.",
  },
  {
    kind: "structure",
    id: "smo-structure",
    structure: SMO_5L7D,
  },
  {
    kind: "prose",
    heading: "Why this structure is here and not ours",
    body: [
      "The receptor above is **Smoothened**, the protein the whole project is aimed at, with a molecule of **cholesterol** bound in the domain that sits outside the cell. The helices below it cross the membrane seven times, which is the shape that makes it a GPCR. Cholesterol binding is the activation step [our kinetic model argues about](/model#sensitivity), so this is the picture that page is describing in equations.",
      "It is a published structure rather than one of ours, and labelled that way on purpose. Our own targets, the MOSMO and MEGF8 interface, were solved by the Kong lab by cryo-EM and are not ours to publish. **Our designed binders are not here yet** because none has been validated at a bench. When they are, they drop into the same viewer.",
    ],
    source:
      "PDB 5L7D, Byrne et al., Nature 2016. Viewer written for this site, no third-party 3D library.",
  },
  {
    kind: "prose",
    heading: "A second design track, and a twist",
    body: [
      "We also run **BindCraft**, which co-designs the backbone, sequence, and interface together through AlphaFold2 hallucination. It produces fewer designs but filters them more strictly, so we use it alongside the main pipeline.",
      "MOSMO and MEGF8 are awkward targets because their surfaces are mostly **beta sheet**, and binder design tools are tuned for helical targets. We are testing **beta-strand-conditioned RFdiffusion** to design binders that pair against an exposed edge strand instead of a helix.",
    ],
    source:
      "BindCraft runbook; Principles of Minibinder Design (beta-strand method, Nat Commun 2025 s41467-025-67866-3).",
  },
  {
    kind: "facts",
    heading: "Where the compute runs",
    items: [
      {
        title: "Hyak",
        body: "UW's SLURM cluster, reached through the Research Computing Club and funded by the Student Technology Fee. Most design runs happen here.",
      },
      {
        title: "DIGS",
        body: "The Institute for Protein Design cluster. We have one seat, arranged through Dr. DiMaio.",
      },
      {
        title: "Mentorship",
        body: "Dr. Frank DiMaio at the Institute for Protein Design set the tool choices, the filter metrics, and the target-selection rules.",
      },
    ],
  },
  {
    kind: "prose",
    heading: "Where the design stands",
    body: [
      "We have about **24 MOSMO binder backbones** carried through sequence design, most with two or three candidate sequences of roughly 160 residues. The MEGF8 binders are still in progress.",
    ],
    source:
      "Minibinder sequence sheet (Mosmo/MEGF8), Protein Design, summer 2026.",
  },
];

const engineering: Page = {
  slug: "/engineering",
  title: "Build, Test, Learn",
  kicker: "chapter 03 · engineering",
  medal: true,
  storyBeat:
    "Nothing in a garden works the first time. You plant, you watch, you move it two feet to the left.",
  intro:
    "How we design a binder and filter it down, and then the build, test, learn cycles in the order we actually ran them, including the parts that did not work the first time.",
  blocks: [
    ...designBlocks,
    {
      kind: "cycles",
      id: "cycles",
      cycles: [
        {
          heading: "Cycle 1: choosing the target",
          intro:
            "This cycle is complete. It is how the project became the project.",
          items: [
            {
              title: "Design",
              body: "More than a dozen project proposals were developed across the team in early 2026, each with a target, a mechanism, and a feasibility argument.",
            },
            {
              title: "Build",
              body: "Proposals were presented to the full team, then narrowed by a top-three vote.",
            },
            {
              title: "Test",
              body: "The finalists were pressure-tested with the advisors against one repeated question. How are you going to test this, and are the assays actually feasible.",
            },
            {
              title: "Learn",
              body: "Feasibility decided it, not novelty. The MMM and SMO project won because the advising lab already has the cell lines, the reporters, and the readouts to test it.",
            },
          ],
        },
        {
          heading: "Cycle 2: generating binders",
          intro:
            "Complete. Getting a pipeline to produce candidate binders at all.",
          items: [
            {
              title: "Design",
              body: "We set the generation parameters from our own earlier campaigns, from Dr. DiMaio, and from the Kong lab preprint: a small helical bundle, 50 to 150 amino acids. The usual advice is to aim hotspots at hydrophobic residues, but this interface is largely polar, so we aimed instead at the beta sheet contacts the preprint identified as the ones holding MOSMO and MEGF8 together.",
            },
            {
              title: "Build",
              body: "We set up a Washington iGEM workspace on **Hyak** and pulled the RosettaCommons **Foundry** container into it, which carries RFdiffusion3, ProteinMPNN and RoseTTAFold3 together.",
            },
            {
              title: "Test",
              body: "We wrote Bash and Python to drive each model in turn, generated binders, and then looked at which hotspots the surviving designs had come from.",
            },
            {
              title: "Learn",
              body: "The result was flat. How often a hotspot succeeded tracked **how many designs we had attempted with it**, and not the chemistry of the residues. Talking it through with Dr. DiMaio, the reading is that hotspots tell RFdiffusion3 roughly where to aim rather than specifying residue to residue contacts. We also folded the separate scripts into one that runs the whole pipeline, so any future Washington iGEM team can design binders with a single command.",
            },
          ],
        },
        {
          heading: "Cycle 3: learning to throw designs away",
          intro:
            "Complete, and the cycle we learned the most from. Our first filter was passing designs that could never work.",
          items: [
            {
              title: "Design",
              body: "With several thousand candidates we needed a cutoff. We took the two published gold standards: backbone **RMSD under 2 Angstrom** between the shape we asked for and the shape we got, and **minPAE under 2**. We call it the 2 by 2 filter.",
            },
            {
              title: "Build",
              body: "A Python script aligned every folded output against the backbone it came from, computed the RMSD, and pulled minPAE out of the RoseTTAFold3 confidence files.",
            },
            {
              title: "Test",
              body: "Of about **5,700 designs, 255 passed**. Then we opened a few in PyMOL and found the problem: most of them were binding parts of MOSMO and MEGF8 that are **buried inside the membrane**. On the metrics they looked excellent. In a cell no protein could ever reach them. We had been designing against an incomplete picture of our own target.",
            },
            {
              title: "Learn",
              body: "Good numbers are not the same as a good binder. We rebuilt the filtering around what is physically reachable: re-fold every survivor against only the **extracellular** parts of the targets and apply the 2 by 2 filter again, then run a custom check that rejects anything still sitting within 5 to 10 Angstrom of the transmembrane helices. Dr. DiMaio added a third test, folding the binder **on its own** with no target present, to confirm it holds its shape rather than being propped up by the thing it is supposed to bind. About **25 designs** survived all of it. The filters are listed in order in [the pipeline](/engineering#pipeline) above.",
            },
          ],
        },
        {
          heading: "Cycle 4: rescuing the near misses",
          intro:
            "In progress. Twenty five binders is not enough to fill a 96-well plate.",
          items: [
            {
              title: "Design",
              body: "We were about 70 designs short of the 96 we want to order. Rather than generate more backbones from scratch, we re-ran **ProteinMPNN and RoseTTAFold3** on two groups: the near misses, and the designs that had already passed. Giving a backbone a fresh sequence is known to lower RMSD and raise prediction confidence, so a slightly misaligned design gets another chance to settle into the shape we asked for.",
            },
            {
              title: "Build",
              body: "We targeted near misses at **minPAE under 4 and RMSD under 6**, loose enough to catch designs that were close without reopening the whole pool.",
            },
            {
              title: "Test",
              body: "Running now. The rescue rate is not in yet.",
            },
            {
              title: "Learn",
              body: "Too early for a rescue rate, but one cost is already clear. Redesigning sequences onto backbones that already passed means more of the final set comes from the **same few backbone shapes**, so the plate is less diverse than the count suggests.",
            },
          ],
        },
      ],
    },
    {
      kind: "prose",
      heading: "Cycle 2: designing a binder against a hard surface",
      body: [
        "This cycle is in progress. The first real change came before any protein was made. We began aiming at ATRN, then switched to the **MMM complex** once it was clear MMM had cryo-EM and an accessible interface while ATRN only had an AlphaFold model. Better data to design against was worth the switch.",
        "A second problem showed up in the pipeline itself. RoseTTAFold3 could not fold our targets well because the sequence databases were thin, so the designs were failing the fold check for the wrong reason. We fixed it by **templating MOSMO and MEGF8** during forward folding. We now have about 24 MOSMO binder backbones through sequence design. [The pipeline](/engineering#pipeline) above has every step.",
      ],
      source: "Protein Design ideation notes and pipeline docs, 2026.",
    },
    {
      kind: "cards",
      heading: "Engineering the constructs",
      intro:
        "Real decisions forced by the biology, worth recording because each one shaped the build.",
      items: [
        {
          title: "MEGF8 is enormous",
          body: "Full-length MEGF8 is 2,845 amino acids, over the size cap of our gene synthesis service. So full-length MEGF8 comes from the advising lab instead of being ordered.",
        },
        {
          title: "A slow readout needs a strong promoter",
          body: "Seeing SMO change in the cilium takes three to four days, so constructs use a CMV promoter to keep expression up over that window.",
        },
        {
          title: "No P2A on the SMO arm",
          body: "A common way to express two proteins from one construct leaves a proline scar. On SMO that scar would affect signalling, so the SMO arm avoids it.",
        },
      ],
      source:
        "Wet Lab construct planning and Induced Proximity Assay protocol.",
    },
  ],
};

const experiments: Page = {
  slug: "/experiments",
  title: "What Grew",
  kicker: "chapter 05 · experiments",
  storyBeat: "This bed is still mostly soil. Come back when the season turns.",
  intro:
    "Four experiments, each answering one question, in the order they have to be answered.",
  blocks: [
    {
      kind: "steps",
      id: "experiments",
      heading: "The four experiments",
      intro: "Each one answers a specific question, in order.",
      items: [
        {
          title: "Does forced proximity work",
          body: "Put SMO, MGRN1, and tagged ubiquitin into NIH/3T3 cells with a rapalog-controlled linker, then pull down and blot for ubiquitin. Controls include a catalytically dead MGRN1 and a no-linker SMO. This proves the down arm before any binder is involved.",
        },
        {
          title: "Which binders work",
          body: "Screen the designed binders in a 96-well mammalian two-hybrid, with the target on one half and the binder on the other driving a GFP reporter. About 125 to 130 binders can be screened this way.",
        },
        {
          title: "Does SMO actually move",
          body: "Transfect the best hits into NIH/3T3, induce cilia by dropping serum, add varying amounts of SHH, then image how much SMO sits in the cilium. Readouts are median ciliary SMO intensity and the fraction of cilia that are SMO positive.",
        },
        {
          title: "Purify the winners",
          body: "Express the top 5 to 10 binders and purify them by IMAC using a His-tag, so they can be characterised directly.",
        },
      ],
      source:
        "Wet Lab: mid-quarter check-in and Induced Proximity Assay protocol, 2026.",
    },
    {
      kind: "facts",
      heading: "What we test in",
      items: [
        {
          title: "Cell lines",
          body: "NIH/3T3 mouse cells for the ciliary and proximity work, and HEK293T for transfection and the two-hybrid screen. Designs are mouse-optimised for NIH/3T3.",
        },
        {
          title: "Reagents",
          body: "Constructs come from gene synthesis, with full-length MEGF8 supplied by the advising lab because of its size.",
        },
        {
          title: "Honest gap",
          body: "We do not have SPR access, so we cannot yet measure binding affinities directly or confirm the binding order. The model treats binder strength as a swept range until then.",
        },
      ],
    },
  ],
};

const model: Page = {
  slug: "/model",
  title: "The Model",
  kicker: "chapter 07 · model",
  medal: true,
  storyBeat:
    "Before you dig, it helps to know how fast things grow. So we did the maths, and then we asked a systems biologist to tell us where the maths was wrong.",
  intro:
    "A kinetic model of the Hedgehog and MMM system, built to answer one question. Can the binder bring ciliary SMO back to a normal level, or is tunable just a nice word.",
  blocks: [
    {
      kind: "prose",
      heading: "What the model is for",
      body: [
        "The whole point of the device is graded control. Acting on the three-part MMM complex should let us dial the amount of **SMO in the primary cilium**, where blocking SMO directly only gives on or off. That is a claim about rates, so it has to survive a kinetic model.",
        "Version 0 is a small **ODE model** of the Hedgehog and MMM system. We track MMM, SMO in its active and ubiquitinated states, the linker, the designed binder, and the parts of the pathway that read SMO out. The chosen output is ciliary SMO over time rather than the downstream transcription factors, because adding the GLI layer made the model less trustworthy, not more.",
      ],
      source:
        "Kinetic Modeling: Version 0 Construction doc and Project Design Document.",
    },
    {
      kind: "prose",
      heading: "The test",
      body: [
        "We run the model twice. Once as **wild type**, and once with **PTCH1 set to zero**, which is the most common mutation in basal cell carcinoma and drives SMO too high. The **tunability window** is the range where adding the binder brings the second run back onto the first run over time.",
        "The team goal, in one line, is a model-guided recruitment platform that lets us dial SMO levels in the cilium instead of simply blocking SMO activity.",
      ],
      source:
        "Kinetic Modeling Version 0; mid-quarter check-in with Dr. Jennifer Kong.",
    },
    {
      kind: "facts",
      heading: "Where the parameters come from",
      items: [
        {
          title: "Concentrations",
          body: "Protein abundances from PaxDb, BioNumbers, and DepMap. The MMM complex sits around 28.8 copies per cell, which is low enough that we had to check whether a deterministic model is even fair.",
        },
        {
          title: "Enzyme kinetics",
          body: "Km and kcat from BRENDA, looked up by EC number. MGRN1 comes out around Km 0.30 mM and kcat 1.24 per mM per second.",
        },
        {
          title: "Degradation rates",
          body: "Pulled from specific papers, for example SMO at about 8.6e-5 per second and PTCH1 losing about 45 percent over 3 hours.",
        },
        {
          title: "Every value is sourced",
          body: "The parameter database records a source and an assumption for each number, so the table can be audited.",
        },
      ],
    },
    {
      kind: "prose",
      heading: "What Dr. Sauro told us to do differently",
      body: [
        "Dr. Herbert Sauro, a systems biologist at UW, met with the subteam twice and reset how we work. Instead of building one big model, we build a **set of candidate models** that each change one relationship, then use **AIC and BIC** to see which is best supported by the data we have. He also had us move to **Tellurium and Antimony**, run **Morris and Sobol sensitivity analysis**, sample uncertain parameters and report the spread rather than a single line, and use fold changes from knockouts as constraints, since we only have relative data.",
        "His framing stuck with us. As he put it, you can only really show how models are wrong.",
      ],
      source:
        "Kinetic Modeling: Dr. Herbert Sauro meeting notes (two meetings, summer 2026).",
    },
    {
      kind: "narration",
      label: "what a sensitivity analysis is",
      body: [
        "The model has dozens of numbers in it, and most of them we had to look up or guess. So before trusting any prediction, we nudge each number by ten percent and see which ones actually move the answer.",
        "The ones that move it are the ones worth measuring properly at a bench. The ones that do not, we can stop worrying about.",
      ],
    },
    {
      kind: "tornado",
      id: "sensitivity",
      heading: "What actually controls ciliary SMO",
      intro:
        "Each bar shows how strongly ciliary SMO responds when that one parameter is raised: a bar of 1.3 means SMO moves about 1.3 percent for every one percent change in the parameter.",
      rows: [
        {
          label: "SMO made in the cytoplasm",
          note: "k form, SMO-cyt",
          value: 1.3,
        },
        { label: "MMM complex made", note: "k form, MMM", value: -1.28 },
        { label: "Tagging rate once bound", note: "kcat", value: -1.28 },
        { label: "MMM complex degraded", note: "k deg, MMM", value: 1.26 },
        {
          label: "Cooperativity in the three-way complex",
          note: "alpha",
          value: -0.87,
        },
        { label: "Binder holding onto SMO", note: "K SMO-Linker", value: 0.51 },
        { label: "Binder holding onto MMM", note: "K MMM-Linker", value: 0.31 },
        { label: "SMO entering the cilium", note: "k in", value: 0.28 },
        {
          label: "SMO cleared from the cytoplasm",
          note: "k deg, SMO-cyt",
          value: -0.28,
        },
      ],
      positiveMeans: "more of it means more SMO in the cilium",
      negativeMeans: "more of it means less SMO in the cilium",
      footnote:
        "Supply and disposal, almost exactly balanced. Turn the MMM pool up one percent and ciliary SMO falls about 1.3 percent, which is the graded response the whole device depends on. Note what is **missing** from the top of this list: how fast SMO enters the cilium, and PTCH1 itself, both come out near 0.28 or below. At these settings ciliary SMO sits around 3.1 nM against 17.9 nM in the cytoplasm.",
      source:
        "Kinetic Modeling: local sensitivity analysis of the recruitment model, run in Tellurium over a 120 hour simulation.",
    },
    {
      kind: "prose",
      id: "mc4r-safety",
      heading: "Checking it cannot do harm somewhere else",
      body: [
        "[The up arm](/description#two-arms) works by pulling the MMM complex apart. That frees MGRN1, and MGRN1 has another job: with a different partner called ATRN it controls **MC4R**, a receptor in the pathway that regulates appetite and body weight. If our binder released a flood of MGRN1 into that other role, we could be causing a metabolic side effect while congratulating ourselves on the ciliary result.",
        "So we modelled it. Adding binder does shift MC4R, but the effect is **small and it saturates**: about 2.3 percent at 50 nM, and still only **2.75 percent at 500 nM**, well under the 20 percent we had set as the point where an effect becomes biologically meaningful. Past about 50 nM, adding more binder changes nothing. The reason is that MGRN1 is the scarce component at roughly 0.18 nM in total, so there is only so much of it to redistribute no matter how hard we push.",
        "The useful part is that this holds regardless of how good our binder turns out to be. In the global sensitivity analysis the binder's own binding strength had **zero** influence on the MC4R result, which means we do not have to trade therapeutic dose against this particular risk.",
      ],
      source:
        "Kinetic Modeling: MC4R safety model, mass-action kinetics in Tellurium. Abundances from PaxDb; Kong et al. 2020 and 2025.",
    },
    {
      kind: "dose",
      id: "mc4r-dose",
      heading: "How far off-target it actually goes",
      points: [
        { label: "0", value: 0 },
        { label: "1", value: 0.23 },
        { label: "5", value: 0.87 },
        { label: "10", value: 1.33 },
        { label: "50", value: 2.3 },
        { label: "100", value: 2.53 },
        { label: "250", value: 2.69 },
        { label: "500", value: 2.75 },
      ],
      xLabel: "minibinder added (nM)",
      yLabel: "drop in surface MC4R (percent)",
      threshold: {
        value: 20,
        label:
          "We set twenty percent as the point where an effect becomes biologically meaningful. The worst case, at a dose ten times higher than anything we would use, reaches 2.75 percent.",
      },
      footnote:
        "The curve flattens by about 50 nM. Past that, adding more binder changes nothing, because MGRN1 is the scarce part at roughly 0.18 nM in total and there is only so much of it to redistribute.",
      source: "Kinetic Modeling: MC4R safety model.",
    },
  ],
};

/* ===================================================================== *
 * IMPACT
 * ===================================================================== */

/**
 * Everything under "Deliverables" in the Human Practices draft. It is rendered
 * on the Human Practices page and again on Proposed Implementation, from this
 * one array, so the two cannot drift apart.
 */
const DELIVERABLES: Block[] = [
{
    kind: "prose",
    section: "Deliverables",
    id: "technology-evaluation",
    heading: "Technology evaluation",
    body: [
      "We first wanted to provide researchers with a way to evaluate whether their research project will benefit from our ciliary platform. Not every protein is connected to ciliary function, and proteins in the ciliary membrane can also have important functions in other pathways of the cell [1]. This is why it is important to determine whether a research question and its targets are even a suitable fit for our platform's approach of modifying the ciliary membrane. Otherwise, researchers could end up spending a lot of time and resources on a platform that is not appropriate for their experiment.",
      "The flowchart is designed to walk researchers through a list of yes or no questions to decide if their project is suitable for our platform and to clarify what they should consider moving forward. It includes considerations about the target, the intended outcome and the procedure. We hope this allows researchers to make an informed decision about adopting the platform before beginning their experimentation.",
    ],
  },
{
    kind: "flowchart",
    id: "platform-fit",
    heading: "Is our platform right for your project?",
    intro: "Answer each question in turn. The coloured boxes in the chart are the buttons you reach at the end.",
    start: "cilia",
    nodes: [
      {
        id: "cilia",
        text: "Are you working with the cilia?",
        answers: [
          { label: "Yes", to: "protein" },
          { label: "No", to: "other-tool" },
        ],
      },
      {
        id: "protein",
        text: "Are you focusing on protein targets?",
        answers: [
          { label: "Yes", to: "membrane" },
          { label: "No", to: "other-tool" },
        ],
      },
      {
        id: "membrane",
        text: "Are those proteins transmembrane and localised to the ciliary membrane?",
        answers: [
          { label: "Yes", to: "abundance-or-tag" },
          { label: "No", to: "other-tool" },
        ],
      },
      {
        id: "abundance-or-tag",
        text: "Are you manipulating abundance, or just looking for a protein tag?",
        answers: [
          { label: "Manipulating abundance", to: "binder" },
          { label: "Tagging", to: "smo" },
        ],
      },
      {
        id: "smo",
        text: "Are you targeting SMO?",
        answers: [
          { label: "Yes", to: "proof-of-concept" },
          { label: "No", to: "binder" },
        ],
      },
      {
        id: "binder",
        text: "Do you already have a targeting binder or antibody?",
        answers: [
          { label: "Yes", to: "platform" },
          { label: "No", to: "design-binder" },
        ],
      },
      {
        id: "other-tool",
        text: "Another tool may be more suitable. Have a look at [what is already in the shed](/human-practices#toolbox).",
        stop: true,
      },
      {
        id: "proof-of-concept",
        text: "Use our proof of concept.",
        action: { label: "Our workflow", to: "/human-practices#workflow" },
      },
      {
        id: "platform",
        text: "Use our platform to design your own ciliary abundance modulator.",
        action: { label: "Our platform", to: "/description" },
      },
      {
        id: "design-binder",
        text: "Use our guide to design a de novo protein binder for your target protein, then come back to the platform with it.",
        action: { label: "Our implementation strategy", to: "/human-practices#implementation-strategy" },
      },
    ],
  },
    {
      kind: "details",
      id: "platform-fit-drawing",
      heading: "See the whole chart",
      summary: "The same questions as a drawing, every branch at once.",
      blocks: [
{
    kind: "figure",
    id: "platform-fit-chart",
    src: "ihp/platform-fit.png",
    alt: "A flowchart. Are you working with the cilia? If no, another tool may be more suitable. If yes, are you focusing on protein targets? If no, another tool. If yes, are those proteins transmembrane and localised to the ciliary membrane? If no, another tool. If yes, are you manipulating abundance or just looking for a protein tag? Tagging leads to: are you targeting SMO? Yes leads to: use our proof of concept, with a button labelled Our Workflow. Manipulating abundance, or tagging something other than SMO, leads to: do you already have a targeting binder or antibody? Yes leads to: use our platform to design your own ciliary abundance modulator, with a button labelled Our Platform. No leads to: use our guide to design a de novo protein binder for your target protein, with a button labelled Our Implementation Strategy, and then on to the platform.",
    caption:
      "Is our platform right for your project? Start at the top left and follow the arrows. The same questions are below as something you can answer.",
    ratio: "wide",
  },
      ],
    },
{
    kind: "workflow",
    id: "workflow",
    heading: "Experimental workflow",
    intro:
      "Many researchers are wary of using a novel platform when there are no detailed, validated protocols to refer to along the way. Our proof of concept demonstrates that the ciliary platform can be used to modulate SMO, but applying it to other ciliary proteins will require researchers to modify the information provided accordingly. The high-level workflow sets out how a scientist can apply the platform to their own research question: identify an appropriate target, modulate its ciliary localisation, and validate whether the experiment produced the intended outcome. Pick a stage to read it.",
    stages: [
      {
        title: "Question",
        body: [
          "Decide what you want to learn about a protein in the primary cilium, and whether the question is really about its ciliary pool rather than the protein across the whole cell. The [technology evaluation](/human-practices#platform-fit) above is the quick version of this step.",
        ],
      },
      {
        title: "Target",
        body: [
          "Identify an appropriate target: a transmembrane protein localised to the ciliary membrane, together with a binder or antibody that can bring the MMM complex to it. Our [implementation strategy](/human-practices#implementation-strategy) covers the options for that targeting component.",
        ],
      },
      {
        title: "Modulate ciliary abundance",
        body: [
          "Recruit the MMM complex to the target with the linker to reduce its ciliary abundance, or block the complex with the inhibitor to let the target accumulate. Our proof of concept does this for SMO; see [how the two arms work](/description).",
        ],
      },
      {
        title: "Validate",
        body: [
          "Check whether the experiment produced the intended outcome: that the target's ciliary abundance changed, that the change came from the MMM machinery rather than from damage to the cilium, and that any downstream readout moved as expected. Our [experiments](/experiments) show the controls we use.",
        ],
      },
    ],
    footnote:
      "The guide will also provide appropriate readouts for validation at each stage, so researchers can move forward confidently or modify their experiment early on. Our troubleshooting and best-practice instructions will offer newer researchers experiments to try, rather than leaving them to determine the protocol entirely on their own. This workflow is not a specific protocol to follow; it is a general understanding of how to apply the platform to a project, with validation and troubleshooting steps throughout to reduce experimental error.",
  },
    {
      kind: "details",
      id: "flyer-section",
      heading: "The flyer we hand out",
      summary: "What the platform is, its two components, the targets it could be pointed at, and how to reach us.",
      blocks: [
{
    kind: "figure",
    id: "flyer",
    src: "ihp/flyer.jpg",
    alt: "The HedgehogSense flyer. It introduces a research platform for studying the effects of ciliary abundance of transmembrane proteins, explains that the MMM complex is used as an E3 ubiquitin ligase for targeted ubiquitination, lists the two components (a linker system that upregulates ubiquitination by bringing a protein into proximity with the MMM complex, and an inhibitor system that downregulates it by disrupting the MEGF8 and MOSMO interface), shows a structure of the MMM complex, lists potential targets SMO, GPR161, PTCH1, SSTR3 and ARL13B, and gives a QR code and a contact email.",
    caption:
      "The flyer we hand out: what the platform is, its two components, the targets it could be pointed at, and how to reach us.",
    ratio: "tall",
  },
      ],
    },
{
    kind: "prose",
    id: "next-steps",
    heading: "Next steps",
    body: [
      "Thinking beyond our team's project as it stands, we developed a five and ten year roadmap to communicate how our platform could continue to grow and how we plan to achieve our goal of contributing to disease research. These steps describe the next stages of development we plan to carry out in order to extend the platform's impact.",
      "**Five year vision: prove that the platform can manipulate ciliary proteins beyond SMO.** Our current proof of concept is built around SMO. We believe the platform can eventually be used to modulate any ciliary membrane protein, even ones that are not endogenously targeted by the MMM complex. Establishing this would demonstrate that we can engineer novel interactions.",
      "**Five year vision: make the platform reproducible.** We want the platform to be an adaptable and reliable tool that researchers can use. To achieve this, we plan to create a database of validated protocols and experimental results that researchers can access at any time. Since the platform is new, we would collaborate with researchers outside our team to incorporate their feedback and publish the materials they have validated, so that the growing database stays current and accurate.",
      "**Ten year vision: apply the platform to study disease.** Ciliopathies, diseases caused by mutations affecting the ciliary membrane, can lead to severe organ defects. We hope first to identify which proteins are responsible for a disease by comparing healthy and affected models, then to apply our platform to manipulate the identified protein and document any change in phenotype. That information could be passed to pharmaceutical companies in the hope of developing effective therapeutics.",
    ],
  },
];

const humanPractices: Page = {
  slug: "/human-practices",
  title: "Who the Garden Is For",
  kicker: "chapter 08 · integrated human practices",
  medal: true,
  storyBeat:
    "A garden nobody visits is just a field. So we went and asked people, and one of those conversations changed what the project even is.",
  intro:
    "We are handing other researchers a tool that changes what stays in the primary cilium. Our guiding question: how do we make it easy for them to adopt, and encourage responsible use in biologically sensitive systems? This page is what they told us, and what we changed.",
  blocks: [
{
      kind: "stats",
      id: "integration",
      heading: "Integration counter",
      items: [
        { value: "13", label: "stakeholders consulted" },
        { value: "6", label: "professional communities represented" },
        { value: "5", label: "shared adoption needs" },
        { value: "5", label: "design requirements defined", emphasis: true },
      ],
    },
{
      kind: "stakeholders",
      section: "Who we asked",
      id: "stakeholders",
      heading: "Who we asked, and what it changed",
      intro:
        "Thirteen conversations, planted by what each person knows. Each has a line saying what we did differently afterwards, or says plainly where that is not written up yet.",
      people: [
        {
          id: "miller",
          name: "Dr. Samuel Miller",
          role: "Professor in the UW Department of Medicine, Division of Allergy and Infectious Diseases, with extensive experience studying bacterial pathogenesis and developing biological research tools",
          group: "signalling researcher",
          why: "The team returned to him because his feedback during their 2025 project had stressed identifying a clear user and use case before investing heavily in technology development.",
          said: "He challenged the team to first establish whether changing receptor copy number produces a meaningful biological effect, noting that in some GPCR systems ligand availability or downstream signal amplification may matter more than receptor abundance itself, and recommended a well characterised system where receptor abundance is already known to influence a measurable phenotype as a rigorous proof of principle. He also highlighted that ubiquitin mediated control could alter protein abundance much more rapidly than transcriptional regulation, and that researchers weigh cost, technical difficulty, equipment requirements, reproducibility and the likelihood of false negatives or positives when adopting a tool.",
          changed:
            "The team will prioritise a biologically meaningful proof of principle system before expanding to additional GPCRs, and its adoption guide will include detailed methods, controls, validation data, reagent sources and construction procedures so other researchers can reproduce and evaluate the platform.",
        },
        {
          id: "pottinger",
          name: "Dr. Paul Pottinger",
          role: "Professor of Medicine in UW's Division of Allergy and Infectious Diseases and a practising infectious disease physician with experience in antimicrobial stewardship and medical education",
          group: "bioethics",
          why: "To understand what biological and safety considerations would need to be addressed before a system like this could be explored in more disease related contexts.",
          said: "He advised that the current goal of building a research platform and the long term potential of therapeutic application are not incompatible, but that the team should clearly communicate the distinction between what the technology can do now and what remains a future possibility. He also emphasised considering unintended effects at a systems level and seeking additional systems biology expertise to examine how perturbing one component of a pathway could influence broader pathways.",
          changed:
            "The team will build clear boundaries around validation and uncertainty into its responsible use material, test a validated platform in more physiologically complex models such as organoids, use system level modelling to explore off target consequences, and set clearer goalposts for what counts as successful platform development.",
        },
        {
          id: "sauro",
          name: "Dr. Herbert Sauro",
          role: "Professor in the UW Department of Bioengineering and Principal Investigator of the Predictive Sys-Bio Lab, focused on in silico biological models and pathway analysis",
          group: "modelling expert",
          why: "To get feedback on the team's kinetic models while they were developing a representation of the Hedgehog signalling pathway and their two modulators, a binder inhibiting the MOSMO and MEGF8 interaction and a linker recruiting the MMM complex to SMO.",
          said: "He introduced the team to modelling platforms including BioModels, LibRoadRunner, WebIridium and Spyder, and explained how to use them to write and analyse kinetic models. He also guided the model development process by having the team create a wiring diagram to identify which components were most important, and gave detailed feedback as the model progressed.",
          changed:
            "The team simplified its kinetic model through a wiring diagram and used that process to work out which wet lab experimental data it needed.",
        },
        {
          id: "wallingford",
          name: "Dr. John B. Wallingford",
          role: "Professor at the University of Texas at Austin Department of Molecular Biosciences and the Mr. and Mrs. Robert P. Doherty, Jr. Regents Chair in Molecular Biology, whose lab works on morphogenesis, cilia and systems biology",
          group: "ciliary biologist",
          why: "To better understand how the foundational advancement could support ciliary researchers like those in his lab, and to get feedback on the current project.",
          said: "He set out what researchers and clinicians need to know when using a new tool, including degradation rate, effectiveness and efficiency. He explained that a primary limitation in ciliary research is the inability to study cilia dynamics, since expansion microscopy requires fixing cells and so disables a direct link between structure and dynamics.",
          changed:
            "The meeting narrowed down how the project could be used by ciliary researchers and what steps were needed to establish it as a foundational advancement, with live cell study of Hedgehog signalling without fixture as the intended contribution.",
        },
        {
          id: "ogden",
          name: "Dr. Stacey Ogden",
          role: "Researcher at St. Jude who focuses on hedgehog signalling",
          group: "signalling researcher",
          why: "The team initially reached out to better understand what hedgehog signalling is implicated in, in order to grasp the project's scope.",
          said: "She advised on what the hedgehog signalling pathway is implicated in, discussing the majority of cancer cases coming from rhabdomyosarcoma and medulloblastoma, and the cardiovascular conditions that occur with hedgehog misregulation in children, many of which are diagnosed via amniocentesis. She also raised the implications of tampering with such a ubiquitous system.",
          changed:
            "Given the histories of developmental biology being used to support eugenics efforts, the team recognised how important responsible use of the tool is.",
        },
        {
          id: "nuukbio",
          name: "Changho Chun and Justin Lee",
          role: "Co-founders of NuukBio, an early stage biotechnology company developing a live-cell phenotyping platform",
          group: "startup or industry",
          why: "The team's own platform is at a similar early stage, so they wanted to learn how NuukBio translated an academic scientific capability into a broader research platform.",
          said: "They emphasised that deep tech platforms cannot rely on assumed value and that the underlying science first needs rigorous experimental validation, with researchers acting as the first users. They encouraged the team to define the specific unanswered scientific questions the platform enables before identifying broad markets, users or applications, and to develop an evolving founder's theory, a clear hypothesis of why the platform is useful and what problem it solves, refined repeatedly through stakeholder feedback.",
          changed:
            "Wet lab and modelling teams will organise validation around clearly defined scientific questions, Human Practices will develop an initial value hypothesis and test it through interviews with potential end users, and the team will broaden outreach through referrals and local life science networks.",
        },
        {
          id: "zheng",
          name: "Dr. Ning Zheng",
          role: "Professor of Pharmacology at the University of Washington School of Medicine, whose lab specialises in protein structure and ubiquitination",
          group: "signalling researcher",
          why: "To receive guidance on developing a modular platform that addresses a prominent gap in the field.",
          said: "He explained that because SMO is endogenously targeted and ubiquitinated by the MMM complex, the team would not be able to prove that regulation of SMO was due to their platform rather than the pre-existing biological relationship. He recommended selecting a protein that is not naturally targeted by MMM, to test whether the system can create a synthetic interaction and so demonstrate a truly modular tool.",
          changed:
            "The platform shifted from focusing only on SMO as a target to a modular system that can target and regulate any ciliary membrane protein.",
        },
        {
          id: "matula",
          name: "Dr. Thomas Matula",
          role: "President and CEO of Matchstick Technologies, where he developed PIXUL, an instrument using cavitation for fragmenting DNA for genetic and epigenetic analysis",
          group: "startup or industry",
          why: "To learn from his experience developing a research tool with a wide range of applications, since PIXUL started as an academic research tool before being commercialised.",
          said: "He described customer discovery and product development from working with UW CoMotion through to early grant applications, and urged the team to quickly develop small proof of concept technologies to attract early investors. He stressed staying utilitarian, iterating constantly on customer feedback rather than personal preference, and noted that people in labs are often set in how they already do things, so the key is finding a specific pain point the tool solves.",
          changed: "No change from this conversation is written up yet.",
        },
        {
          id: "younger",
          name: "Dr. David Younger",
          role: "Co-founder and CEO at A-Alpha Bio and a co-inventor of the AlphaSeq protein interaction platform",
          group: "startup or industry",
          why: "To better understand the tradeoffs of the team's protein, antibody and small molecule design strategies, and how a modular biological tool could be made accessible to other researchers as a platform.",
          said: "He raised no fundamental concerns with the de novo protein design approach but said the choice between a small molecule, a protein based PROTAC and an antibody system should depend on the intended application, with biologics and minibinders more feasible within the iGEM timeline. He cautioned that full length knob and hole antibodies are not easy to design, synthesise or screen, suggesting two minibinders connected by a flexible linker as a minimal proof of concept, and warned that fully open sourcing too early could reduce investor incentives before a defensible IP foundation exists.",
          changed:
            "The wet lab team will prioritise validating a smaller minibinder system before pursuing more complex antibody or small molecule formats, the protein modelling and kinetics team will focus on scalable candidate generation, and Human Practices will continue examining platform implementation strategies.",
        },
        {
          id: "vokes",
          name: "Dr. Steven Vokes",
          role: "Professor at the University of Texas at Austin's Department of Molecular Biosciences, whose lab focuses on transcriptional response to Hedgehog signalling with GLI transcription activators and repressors",
          group: "signalling researcher",
          why: "To learn how the platform could be useful to and adopted by scientists working with ciliary transmembrane proteins, and to hear his views on the linker system and potential off target effects.",
          said: "He suggested expanding wet lab experimentation to NIH/3T3 cells, an embryonic murine cell line with Hh signalling present, and using levels of the ciliary protein ARL13B as a control when testing effects on Smoothened in the cilia. As an in vivo researcher he was concerned about applying antibodies in murine or other live models, explaining that in vitro cancer lines lose ciliary response quite quickly. He also asked what advantages the system offers over cheap pre-existing small molecules, pointing to less druggable targets such as PTCH1 or GPR161, and noted the lack of quantitative live cell imaging in vivo at molecular or single cell resolution.",
          changed:
            "The team decided to use minibinders for its linker system, giving an easier delivery route for in vivo researchers studying downregulation of transmembrane ciliary proteins while remaining usable in cell culture.",
        },
        {
          id: "chamberlain",
          name: "Zach Chamberlain",
          role: "Manager of CoMotion Labs at UW CoMotion, working closely with student and faculty teams translating research into startups and licensed technologies",
          group: "commercialisation",
          why: "To better understand what it actually takes for a research tool like theirs to be adopted outside of iGEM, and what CoMotion typically looks for when supporting student projects.",
          said: "He emphasised flexibility, awareness of the target audience, and simplifying the project down to its core point of innovation. On funding, he explained that investors want to see robust proof and results but also evidence that a team is flexible and aware of its surrounding environment, rather than locked into building a perfect product before ever engaging with its target audience.",
          changed:
            "The team plans to keep its scope realistic and grounded in what its current data actually supports, focusing on demonstrating a clear pain point the platform solves for cilia researchers.",
        },
        {
          id: "eisenkot",
          name: "Roi Eisenkot",
          role: "Associate Director of Bioengineering at UW CoMotion, managing a portfolio of bioengineering technologies and helping UW researchers think through translation, commercialisation and routes for getting technologies beyond the university",
          group: "commercialisation",
          why: "To understand what realistic translational pathways the platform could take, and what decisions on dissemination, intellectual property and commercialisation should be made this early.",
          said: "He emphasised that the first step is defining the end goal, since patenting, open sourcing or distributing directly to researchers depend heavily on whether the priority is commercial sustainability or broad nonprofit dissemination. He noted that patents require significant resources and a plausible mechanism for recovering that investment, while distributing a biological technology as a black box may limit adoption because users cannot understand or adapt the system. His major recommendation was to ramp up customer discovery, since actions speak louder than words, and to define the minimum features the platform must have.",
          changed:
            "Wet lab and modelling teams will focus on establishing convincing and reproducible proof of concept and clarifying what the minimum viable research tool should contain, while Human Practices will expand customer discovery around existing workflows and unmet needs.",
        },
        {
          id: "bothwell",
          name: "Dr. Mark Bothwell",
          role: "UW neurobiologist and member of faculty at the Institute for Stem Cell and Regenerative Medicine (ISCRM), with a long standing interest in primary cilia and receptor localisation",
          group: "ciliary biologist",
          why: "To identify meaningful biological systems for the proposed platform and to evaluate whether tuning ciliary receptor abundance would address a real experimental need.",
          said: "He said a major gap in cilia research is that existing approaches typically disrupt formation of the entire cilium rather than selectively manipulating the localisation or abundance of an individual ciliary receptor. He identified promising systems including the GLP-1 receptor in pancreatic beta cells, ciliary GPCRs in hypothalamic control of appetite and body weight, PC1 in renal epithelial cells, somatostatin receptor 3 and serotonin receptor 6, and suggested eventually expanding beyond GPCRs to cilia enriched receptor tyrosine kinases such as FGF and PDGF. He recommended moving beyond HEK293T cells after initial proof of concept toward iPSC derived neuronal, renal or pancreatic beta cell models, stressed selectivity as a critical control, and said developmental and unintended effects should be carefully evaluated but are not unique to this platform.",
          changed:
            "The wet lab team can incorporate localisation and negative control assays and consider a disease relevant cell model after the SMO proof of concept, modelling teams can evaluate adapting the platform to additional receptor classes, and Human Practices will sharpen the proposed user need around selective receptor level perturbation.",
        },
      ],
      source: "Integrated Human Practices: stakeholder interview write-ups, 2026.",
    },
      {
        kind: "details",
        id: "where-this-started",
        section: "Background",
        heading: "Where this started: the Hedgehog pathway, and why we pivoted",
        summary: "Hedgehog signalling runs through the primary cilium; the cell's MMM complex clears SMO out of it; we began as a therapy and became a platform for controlling what stays in the cilium.",
        blocks: [
{
      kind: "prose",
      id: "background",
      heading: "Project inspiration: the Hedgehog signalling pathway",
      body: [
        "In nature, cells communicate with each other and their environment through processes known as cell signalling pathways. A typical pathway begins when a signalling molecule, called a ligand, binds to a protein shaped to recognise that specific molecule. On binding, the receptor protein changes shape, leading to the activation of various controlled chemical reactions. Together, these reactions can trigger a cascade of events in the cell, coordinating essential processes from immune response to tissue repair [1].",
        "One particularly interesting signalling pathway found in humans is the Hedgehog (Hh) signalling pathway. Initiated by a group of signalling proteins called Hedgehog ligands, the Hedgehog pathway is crucial for an organism's healthy development, specifically by regulating embryonic development and tissue patterning. Because of its role in driving cell growth, overactivation of Hh signalling is directly linked to certain cancers, including medulloblastoma and basal cell carcinoma [2].",
        "Unlike most signalling pathways, which act across the cell surface, Hh signalling is coordinated specifically at the primary cilium, a receptor-rich organelle that protrudes from the cell membrane [3]. In this pathway, the primary cilium contains a receptor protein called Patched-1 (PTCH1), which normally inhibits another protein, Smoothened (SMO), from entering and accumulating inside the cilium [2]. When Hedgehog ligands bind to PTCH1, this inhibition is lifted, allowing SMO to accumulate inside the cilium and trigger downstream activation of the pathway. One of the major downstream effects is the activation of GLI transcription factors, specialised proteins that bind to DNA to turn genes on or off, ultimately turning on genes that drive embryonic development [2].",
        "Cells can also regulate levels of SMO through the MEGF8-MOSMO-MGRN1 (MMM) complex, named for its three constituent proteins. Within the complex, structure is primarily provided by MEGF8, a transmembrane protein which binds both MOSMO and MGRN1 and contains a surface that recognises SMO. The abundance of MEGF8 on the cell surface is promoted by MOSMO, which helps stabilise it. Finally, MGRN1 provides the enzymatic activity, attaching chemical tags to SMO [4].",
        "Together, these proteins function as an E3 ubiquitin ligase, a type of enzyme that attaches tags to target molecules through a process called ubiquitination. The tagging triggers cellular degradation, allowing the MMM complex to eliminate SMO and so downregulate downstream Hh signalling [4].",
        "For our project, we initially aimed to design a therapeutic that could remove excess SMO, in order to reduce the risk of cancer. With the MMM complex able to regulate the Hh pathway and its downstream effects, we explored developing a therapeutic that modulated the recruitment of the MMM complex and the resulting ubiquitination of SMO. As we continued researching methods to modulate that recruitment, we realised that the principles behind the therapeutic had much broader applications. Rather than only investigating the MMM complex's ability to regulate levels of SMO, we considered whether it could regulate the abundance of other proteins in the primary cilium. By designing a method directing the MMM complex at other ciliary proteins, we could convert a single-purpose therapeutic into a modular tool for fine-tuning protein abundance within the primary cilium. Controlling the abundance of ciliary proteins would open a new frontier in synthetic biology. Besides our original goal of slowing the progression of certain cancers, the approach could provide strategies for slowing other genetic diseases associated with defective ciliary signalling, and would let researchers decouple the primary cilium from the rest of the cell, evaluating how a drug affects the cilium independently. Recognising what this could mean for cell biology research, clinical practice and drug development, we pivoted to designing a research platform for cilium-specific control of protein abundance.",
      ],
    },
{
      kind: "diagram",
      id: "pathway-figure",
      figure: "pathway",
      caption:
        "The pathway as it occurs. PTCH1 keeps SMO out of the cilium until a Hedgehog ligand binds; SMO then accumulates there and GLI turns genes on. Separately, the MMM complex tags SMO and the cell degrades it.",
    },
{
      kind: "prose",
      id: "gpcrs",
      heading: "Impacts on G protein-coupled receptors",
      body: [
        "While many transmembrane ciliary proteins could be targeted with our platform, perhaps its greatest opportunity for advancing scientific understanding and drug development is the regulation of G protein-coupled receptors, or GPCRs. Characteristically marked by seven membrane-spanning helices, GPCRs are the most diverse class of membrane receptors and the targets of an estimated 30 percent of all FDA-approved drugs [5]. In humans, approximately 800 different GPCRs have been identified, many of which govern essential functions in response to hormones or environmental stimuli [5, 6].",
        "While most often associated with cell membranes, many GPCRs, such as SMO, SSTR3 and HTR6, selectively localise to primary cilia and contribute to a cell's sensory functions [7]. Dysfunction of ciliary GPCR localisation or function can cause various metabolic disorders known as ciliopathies, such as polycystic kidney disease [8].",
        "Despite the importance of GPCRs in medicine, gaps remain that limit the development of new GPCR-targeting drugs. Current tools for drug discovery, such as CRISPR or RNAi, knock out proteins at the cellular level, making it hard to assess whether a drug affects GPCRs on the cell membrane or only those in the primary cilium [9, 10]. Additionally, approximately one hundred human GPCRs are still orphans: present in the body, with potential as pharmaceutical targets, but with no known endogenous ligand [11].",
        "By moving from the cell-wide protein regulation of current methods to controlling ciliary abundance in our platform, we aim to give researchers the tools to better understand GPCRs, and ciliary membrane proteins that are not GPCRs, such as PTCH1, and to accelerate the development of GPCR-targeting therapeutics. And since most GPCR-targeting drugs act by occupying a receptor's binding site, altering GPCR levels through targeted ubiquitination is a novel alternative, opening opportunities for future treatments for ciliopathies.",
      ],
    },
{
      kind: "diagram",
      id: "cell-vs-cilium-figure",
      figure: "cell-vs-cilium",
      caption:
        "Why the place matters. CRISPR and RNAi take the receptor out of the whole cell; we are aiming to change how much of it sits in the cilium, leaving the rest alone.",
    },
        ],
      },
{
      kind: "narration",
      body: [
        "Nearly every cell in you grows a single tiny antenna, called the **primary cilium**. It is not decoration. Certain receptors only do their job while they are sitting in it.",
        "So a protein can be in the right cell and still be in the wrong place. That one idea is what the next part of this page is about.",
      ],
    },
{
      kind: "landscape",
      section: "Community need",
      id: "community-need",
      heading: "Community need: the ciliary membrane landscape",
      intro:
        "With so many ciliary signalling proteins sharing the same compartment, researchers studying ciliary pathways need a tool that can do more than detect whether a protein is present. They need tools that can deliberately tune ciliary protein abundance and reveal how those changes affect signalling and cell behaviour. Pick a protein to read what tuning it would let someone ask.",
      proteins: [
        {
          short: "SMO",
          look: "gpcr-blue",
          name: "SMO: Smoothened",
          family: "G protein-coupled receptor (GPCR)",
          body: [
            "When Hedgehog signalling is activated, SMO accumulates in the primary cilium and helps activate downstream GLI transcription factors. The amount and localisation of SMO in the cilium are closely linked to Hedgehog pathway activity, which is in charge of embryonic development, tissue repair and stem cell maintenance.",
            "Changing SMO abundance could help researchers study how receptor quantity affects the strength and timing of Hedgehog signalling. It is also our initial proof of concept target, because SMO is naturally regulated by the MMM system.",
          ],
        },
        {
          short: "PTCH1",
          look: "ptch",
          name: "PTCH1: Patched 1",
          family: "12-transmembrane cell-surface receptor",
          body: [
            "PTCH1 is the primary cell surface receptor for Hedgehog ligands, acting upstream of SMO in the Hedgehog signalling pathway. When Hedgehog ligands are absent, PTCH1 is present in the primary cilium and suppresses SMO activity. Hedgehog binding causes PTCH1 to leave the cilium, allowing SMO to accumulate and activate downstream signalling.",
            "Changing PTCH1 abundance would let researchers study the inhibitory side of Hedgehog signalling, hypothetically producing the opposite result to experiments that perturb SMO. Comparing PTCH1 and SMO could reveal how different levels of opposing pathway regulators shape Hedgehog signalling output.",
          ],
        },
        {
          short: "GPR161",
          look: "gpcr-lilac",
          name: "GPR161: G protein-coupled receptor 161",
          family: "G protein-coupled receptor (GPCR)",
          body: [
            "GPR161 is a ciliary GPCR and an important negative regulator of Hedgehog signalling, normally enriched in the primary cilium when the pathway is inactive. GPR161 promotes cAMP and PKA signalling that helps suppress Hedgehog pathway activation. Following Hedgehog stimulation, GPR161 is removed from the cilium as the pathway switches toward an active state.",
            "Changing GPR161 abundance could help researchers test how much negative regulator is required to maintain Hedgehog repression. Comparing GPR161 with SMO and PTCH1 could also reveal how different ciliary regulators interact to establish signalling thresholds.",
          ],
        },
        {
          short: "GLP-1R",
          look: "gpcr-pink",
          name: "GLP-1R: Glucagon-like peptide-1 receptor",
          family: "Class B1 (secretin family) G protein-coupled receptor",
          body: [
            "GLP-1R is involved in glucose regulation and metabolic signalling in the primary cilia of metabolically relevant cell types. GLP-1 is an important metabolic hormone helping regulate blood glucose and appetite, making its receptor a major target in treatments for type 2 diabetes and obesity. Research into its ciliary localisation may help us understand how certain cells respond to GLP-1 signals within a specialised signalling compartment.",
            "Changing only its ciliary abundance could help researchers determine whether this receptor population has a distinct role in metabolic signalling. [Dr. Mark Bothwell](stakeholder:bothwell) identified GLP-1R as an interesting future target for connecting ciliary biology with questions surrounding diabetes and metabolism.",
          ],
        },
        {
          short: "MC4R",
          look: "gpcr-blue",
          name: "MC4R: Melanocortin-4 receptor",
          family: "Class A G protein-coupled receptor",
          body: [
            "MC4R localises to the primary cilia of specific neurons involved in metabolic regulation. Its localisation contributes to signalling pathways that influence feeding and body weight regulation. Disruption of its localisation has been associated with impaired metabolic signalling.",
            "Tuning MC4R abundance could help researchers test the effect of changing receptor quantity in the cilium on metabolic responses.",
          ],
        },
        {
          short: "PKD1/2",
          look: "channel",
          name: "PKD1 and PKD2: Polycystin-1 and Polycystin-2",
          family: "A receptor and ion channel that function together as a complex",
          body: [
            "PKD1 and PKD2 are ciliary membrane proteins that form a polycystin signalling complex. Mutations in either protein are associated with autosomal dominant polycystic kidney disease. The PKD1/PKD2 complex in the ciliary membrane has been linked to the regulation of ion and calcium associated signalling. In the renal primary cilium, their presence is important for understanding how kidney cells respond to their environment.",
            "Tuning PKD1/PKD2 abundance in the primary cilium could allow researchers to study partial changes in polycystin signalling rather than relying only on complete genetic knockouts. [Dr. Bothwell](stakeholder:bothwell) specifically highlighted PKD1 as an interesting future system for connecting ciliary protein abundance with kidney disease biology.",
          ],
        },
        {
          short: "SSTR3",
          look: "gpcr-lilac",
          name: "SSTR3: Somatostatin receptor 3",
          family: "Class A G protein-coupled receptor",
          body: [
            "SSTR3 responds to the hormone somatostatin and is strongly enriched in the primary cilia of several different neuronal cell types. It participates in ciliary GPCR signalling and is also used as a model for studying how receptors enter, remain in and exit the cilium. That makes it a well characterised target, useful for studying ciliary trafficking mechanisms.",
            "Changing SSTR3 abundance could help researchers study how receptor quantity in the cilium affects ciliary trafficking in general. It could also be an attractive future test of whether our MMM-based platform can be redirected toward a well characterised ciliary GPCR other than SMO.",
          ],
        },
      ],
      source: "Ciliary membrane landscape, Integrated Human Practices. Sprites for each protein are being drawn by Creative.",
    },
      {
        kind: "details",
        id: "location-and-amount",
        heading: "Why location and amount matter",
        summary: "A protein can be in the right cell and the wrong place, and pathways respond to how much of a protein is there, not only whether it is.",
        blocks: [
{
      kind: "prose",
      id: "location",
      heading: "Why location matters: spatial control",
      body: [
        "A protein can be in the right cell but the wrong place. Cells are divided into specialised organelles, and proteins often need to reach the right compartment to perform their cellular function. The primary cilium is no different.",
        "This antenna shaped structure extends from the surface of many cells and acts as a specialised signalling hub, involved in pathways that control cell migration, cellular growth, development and many other functions critical to the cell's survival [1]. Although the ciliary membrane is an extension of the cell membrane, the cilium maintains its own controlled environment of proteins and signalling molecules. Barriers at the base of the cilium control the entry and exit of proteins, allowing cells to concentrate specific receptors and signalling molecules within this space [2]. This organisation lets the primary cilium function as a distinct signalling compartment, where the presence and abundance of receptors can influence pathways involved in cellular trafficking, development and cell communication [3].",
        "Smoothened (SMO), a [GPCR](/human-practices#gpcrs) in the Hedgehog (Hh) signalling pathway, is a clear example that the location of a protein can change its cellular function. When Hh signalling is activated, SMO moves into and accumulates on the primary cilium membrane, where it triggers downstream transcriptional activation of Hedgehog target genes through GLI transcription factors. When SMO is artificially altered so that it can no longer enter the cilium, Hedgehog signalling cannot be properly activated, showing that ciliary localisation is necessary for SMO function [4]. Other GPCRs and signalling proteins can move in and out of the cilium, allowing the same cell to organise signalling differently depending on where a receptor is located. For researchers studying these pathways, being able to change when a protein enters the cilium and whether it accumulates there could help reveal how ciliary localisation shapes signalling pathways.",
      ],
    },
{
      kind: "prose",
      id: "abundance",
      heading: "Protein abundance matters: signalling exists on a spectrum",
      body: [
        "How much of a signalling protein is present can also change how a cell responds. Many signalling pathways are not simple on/off switches. In Hh signalling, cells produce different responses based on the strength and duration of the signals they receive. During development, small changes in Hedgehog signalling help determine which cell types form in the process of differentiation. Intermediate levels of signalling therefore carry important biological information [5].",
        "The abundance of a protein inside the primary cilium contributes to this response. Researchers found that when the concentration of SMO within the cilium was reduced, Hedgehog pathway activation was also impaired [6]. Other studies have shown that accumulation of SMO in the cilium is important for achieving the highest levels of Hedgehog signalling [7]. For researchers, this means a technology that completely removes a protein may only answer whether that protein is necessary; and, translationally, a technology that overly disrupts the balance of signalling pathways such as Hedgehog can interfere with normal development. Being able to gradually increase or decrease the ciliary abundance of these signalling proteins could reveal thresholds and intermediate states that an all-or-nothing experiment would miss.",
      ],
    },
        ],
      },
{
      kind: "toolshed",
      id: "toolbox",
      heading: "Current tools",
      intro:
        "Cilia labs are not short of tools. We went through the ones they actually reach for, and asked the same question of each: can it change one chosen protein, only inside the cilium, at a time you pick, by an amount you pick.",
      tools: [
        {
          name: "Genetic knockout (CRISPR-Cas9)",
          short: "Knockout",
          prop: "axe",
          how: "Genetic knockout removes the function of a gene so researchers can study what happens when the associated protein is no longer produced. Common methods use CRISPR-Cas9, in which a designed guide RNA directs Cas9 to a chosen DNA sequence, where it cuts the DNA. When the cell attempts to repair the break, small mutations can be introduced that disrupt the gene and prevent it from making a functional protein [8].",
          good: "Knockouts are great for answering questions about the importance of a protein to a process. If removing a gene changes ciliary structure, signalling or cell behaviour, researchers gain strong evidence that the protein plays an important role. CRISPR knockouts are especially useful for loss-of-function studies and large genetic screens [9].",
          gap: "A knockout usually removes the protein not just from the primary cilium but from the entire cell. This makes it hard to distinguish the role of the protein inside the cilium from its role elsewhere in the cell. It also provides limited control over abundance, as normal conditions are usually compared with strong or complete loss of function rather than a gradual change in the amount of protein present in the cilium.",
        },
        {
          name: "Gene silencing (CRISPRi and RNAi)",
          short: "Silencing",
          prop: "shears",
          how: "Gene silencing reduces how much a gene is expressed without permanently removing the gene. In CRISPR interference (CRISPRi), a catalytically dead Cas9 (dCas9) is guided to a chosen DNA sequence but does not cut it. Instead, it blocks transcription or recruits repressor proteins to reduce the quantity of mRNA produced from that gene [10]. RNA interference (RNAi) uses small RNA molecules such as siRNA to bind the matching mRNA produced from the target gene, causing it to be broken down or preventing it from being translated [11].",
          good: "Gene silencing is useful when researchers want to study what happens when the quantity of a protein is reduced rather than completely removed, which suits loss-of-function studies where a full knockout is too disruptive. RNAi screens have also been used in cilia research to identify genes involved in cilium formation and regulation, including large-scale screens that revealed proteins affecting ciliogenesis [12].",
          gap: "CRISPRi and RNAi mainly control how much protein the whole cell produces, and cannot directly control whether the remaining protein is in the primary cilium, making it difficult to determine the protein's specific role there. The amount of gene suppression also does not translate directly into a precise amount of protein in the cilium, so while these tools offer some control over total abundance, there is less control over where the protein is reduced and how much remains in the ciliary compartment.",
        },
        {
          name: "Small molecule antagonists",
          short: "Antagonists",
          prop: "spray",
          how: "Small molecule antagonists are compounds that bind to a protein and reduce or block its activity. Unlike genetic approaches, they do not change the underlying DNA and act relatively quickly after being added to cells. In ciliary biology, Smoothened (SMO) antagonists bind to SMO and inhibit Hedgehog signalling, affecting SMO in different ways, including changing whether it moves into the primary cilium [13].",
          good: "Small molecule antagonists allow researchers to temporarily reduce the activity of a signalling protein and observe how the pathway responds. Because the quantity of antagonist can be varied, they are also useful for studying dose-dependent changes in signalling without permanently altering the gene. In the Hedgehog pathway, SMO antagonists have given insight into SMO activity and how its movement into the primary cilium contributes to pathway signalling [13].",
          gap: "Blocking a protein's activity is not the same as controlling how much of that protein is present in the cilium. For SMO, some antagonists prevent SMO from entering the cilium while others actually cause SMO to accumulate there, even though Hedgehog signalling is inhibited in both cases. Small molecules also act on a protein wherever the molecule can reach it, so while the dose can be modulated, they do not give researchers precise control over where the protein is located or how much of it is present within the primary cilium.",
        },
        {
          name: "Inducible degrons",
          short: "Degrons",
          prop: "puller",
          how: "Researchers use inducible degrons to rapidly remove a target protein after an external trigger. In systems such as the auxin-inducible degron (AID), the target protein is fused to a degron tag. When the matching trigger is added, the tagged protein is brought to an E3 ubiquitin ligase, marked with ubiquitin, and degraded by the proteasome. This gives researchers better control over when a protein is removed [14].",
          good: "Inducible degrons are useful for studying the immediate effects of protein loss on a system. Cilia research benefits because structures in the cilium change over relatively short timescales. Auxin-inducible degradation has been used to rapidly remove proteins involved in the assembly and disassembly of the primary cilium, letting researchers observe how rapid protein loss changes ciliary behaviour [15].",
          gap: "Although inducible degrons have strong temporal control, they have little control over where the target protein is degraded within the cell. If a protein is present both on the ciliary membrane and elsewhere, the system does not distinguish between the two populations. The target protein also needs to be genetically tagged, and degradation tends to be substantial, which makes the strategy less suited to precise control over the protein abundance remaining in the cilium.",
        },
        {
          name: "Ciliary trafficking perturbation (IFT and the BBSome)",
          short: "Trafficking",
          prop: "cart",
          how: "The primary cilium has its own transport system to help control which proteins enter, move through and leave the compartment. Two important parts of it are intraflagellar transport (IFT) and the BBSome. IFT uses motor proteins to move protein cargo along the ciliary membrane, while the BBSome connects membrane signalling proteins to that transport machinery; both contribute to the protein composition of the ciliary membrane [16].",
          good: "By disrupting parts of the IFT pathway and the BBSome, researchers can test how trafficking affects the localisation of ciliary proteins. For example, loss of IFT27 prevents the normal removal of GPR161 from the cilium [17], causing it to accumulate there. Similar studies have shown that BBSome-dependent transport is essential for moving signalling receptors such as SMO in and out of the cilium, so changes in ciliary trafficking can directly alter the amount of a signalling protein.",
          gap: "While trafficking perturbations directly affect where proteins are located in the cilium, the BBSome and IFT machinery transport many different ciliary proteins rather than one selected target. Disrupting these pathways can change the localisation of many ciliary proteins at once and, depending on the component perturbed, can interfere with normal ciliary assembly. This makes it difficult to change the abundance of one signalling protein precisely, or to gradually tune how much of it remains in the cilium without affecting the broader system.",
        },
        {
          name: "Targeted protein degradation (PROTACs, molecular glues, LYTACs and AbTACs)",
          short: "Degradation",
          prop: "grabber",
          how: "Targeted protein degradation is a group of technologies that redirects the cell's own protein degradation machinery toward a chosen protein. PROTACs bring an intracellular target close to an E3 ubiquitin ligase, causing the target to be marked with ubiquitin and degraded by the proteasome. Molecular glues achieve a similar result, using a small molecule to promote interaction between a protein and an E3 ligase. LYTACs connect cell surface proteins to receptors that carry them to the lysosome, and AbTACs use a two-sided antibody to bring a cell surface target close to a membrane E3 ligase, promoting internalisation and degradation [18].",
          good: "These technologies allow researchers to remove specific proteins directly, which makes targeted degradation useful for studying how quickly a cell responds when a particular protein is reduced. LYTACs and AbTACs have recently shown that targeted degradation can also be applied to cell-surface receptors and membrane proteins [19], which makes it especially interesting for ciliary research, where cellular degradation machinery could be deliberately recruited to selected ciliary membrane signalling proteins such as GPCRs.",
          gap: "Existing targeted protein degradation systems can selectively remove proteins, but most are designed to act across the cell or the cell surface rather than solely in the primary cilium. For ciliary biologists, that makes it difficult to separate the role of the ciliary protein from the protein elsewhere in the cell. Degradation efficiency can also depend on which E3 ubiquitin ligase is recruited and how the two are positioned relative to one another. These limitations suggest an opportunity to adapt targeted degradation toward more spatially focused and tunable control of ciliary proteins.",
        },
        {
          name: "Cilia-targeted ubiquitination",
          short: "Ubiquitination",
          prop: "tagger",
          how: "Researchers can manipulate ubiquitination directly within the primary cilium to study how it controls protein trafficking. Ubiquitin is a small molecular tag that tells the cell what should happen to the tagged protein. In the primary cilium, certain GPCRs receive a K63-linked ubiquitin chain, which acts as a signal for the BBSome machinery to remove those receptors from the cilium. Researchers have altered this process by targeting the enzymes that add or remove ubiquitin specifically within the ciliary compartment [20].",
          good: "This lets researchers test directly whether ubiquitination inside the cilium controls receptor localisation. For example, targeting the K63-specific deubiquitinase AMSH to the cilium, and so removing K63-linked ubiquitin chains, prevented the normal exit of several signalling proteins, including GPR161, SSTR3 and Smoothened (SMO), causing them to remain in the cilium. This shows that ciliary ubiquitination directly regulates which GPCRs are retained in or removed from the primary cilium [20].",
          gap: "While cilia-targeted ubiquitination can be restricted to the primary cilium instead of the entire cell, current approaches change the ubiquitination environment of the cilium broadly, rather than directing ubiquitination toward one selected receptor. They also give limited ability to adjust the abundance of one specific protein in the ciliary membrane precisely, leaving a gap for a system with target specificity and tunable control over protein abundance in the primary cilium.",
        },
      ],
      source: "Community Need, Integrated Human Practices. References [8] to [20] below.",
    },
{
      kind: "prose",
      id: "the-gap",
      heading: "A recurring gap",
      body: [
        "Across the tools researchers already use, a pattern emerges. Genetic knockouts can ask whether a protein is important, but they usually change protein levels across the whole cell rather than only in the primary cilium [8, 9]. Small molecule antagonists and inducible degrons add more control over when a change occurs, but still do not reliably distinguish between a protein's action in the primary cilium and elsewhere in the cell [13, 14, 15]. Approaches that perturb ciliary trafficking or ciliary ubiquitination can act solely within the cilium, but often affect many proteins at once rather than one chosen target [16, 17, 20]. Targeted protein degradation improves target specificity, but most existing systems are still designed to act across the cell surface rather than selectively on the ciliary membrane [18, 19].",
        "Click on [Market Model](/human-practices#market) to learn more about the quantitative economic gap.",
        "Together, these tools point to a common gap. A useful ciliary research tool would need to combine several abilities that are currently spread across different technologies.",
      ],
    },
{
      kind: "facts",
      id: "four-requirements",
      heading: "Four things a ciliary tool has to do",
      items: [
        { title: "What", body: "Target a specific protein of choice." },
        { title: "Where", body: "Act specifically within the primary cilium." },
        { title: "When", body: "Control when that change happens." },
        { title: "How much", body: "Tune how much of the signalling protein remains in the cilium." },
      ],
    },
{
      kind: "matrix",
      id: "matrix",
      heading: "The same gap, every time",
      intro:
        "Reading down the columns is the argument. Plenty of tools are target specific. A couple act only inside the cilium. None of them does both and lets you choose the amount. Combining these features gives researchers a much easier way to study the impact of a specific protein on the ciliary membrane independently of the rest of the cell, while also testing how different levels of that protein change signalling and cellular pathways.",
      columns: ["target specific", "cilium only", "timing", "tunable"],
      rows: [
        { label: "Genetic knockout", levels: ["full", "none", "none", "none"] },
        { label: "CRISPRi and RNAi", levels: ["full", "none", "full", "partial"] },
        { label: "Small molecule antagonists", levels: ["full", "none", "full", "partial"] },
        { label: "Inducible degrons", levels: ["full", "none", "full", "partial"] },
        { label: "BBSome and IFT perturbation", levels: ["partial", "full", "partial", "none"] },
        { label: "Targeted protein degradation", levels: ["full", "none", "full", "partial"] },
        { label: "Cilia-targeted ubiquitination", levels: ["partial", "full", "partial", "partial"] },
        { label: "Our design goal", levels: ["full", "full", "full", "full"], isGoal: true },
      ],
      source:
        "Opportunity matrix, Integrated Human Practices. Capability assessment based on the literature review above, indicating a biological opportunity for a technology with tunable, target specific, timely control in the primary cilium.",
    },
{
      kind: "callout",
      id: "our-system",
      label: "our system",
      heading: "What we are building",
      body: [
        "To address this gap, we are developing a research tool for modulating protein abundance on the primary cilium. Our system uses the MMM complex, a ciliary membrane associated ubiquitination complex that naturally regulates Smoothened in the Hedgehog signalling pathway, and redirects its E3 ubiquitin ligase activity toward a chosen ciliary membrane protein. By bringing the target protein and the MMM complex into close proximity, our goal is to give researchers more control over how much of a target protein remains in the primary cilium. Rather than replacing existing tools, the platform is designed to combine the strengths of several of them into a system built specifically for ciliary biology.",
        "[Learn more about our system](/description)",
      ],
    },
{
      kind: "prose",
      id: "why-it-matters",
      heading: "Why this capability matters",
      body: [
        "The value of our system comes from giving researchers a way to study a protein within the primary cilium as its own population. Many ciliary proteins are also found elsewhere in the cell, so altering the entire cellular pool can make it difficult to tell whether an observed effect actually came from the cilium [1]. A signalling researcher might want to know whether changing only the ciliary pool of a GPCR changes pathway activity. A trafficking researcher might ask how quickly a receptor must leave the cilium before signalling changes. A ciliopathy researcher studying disease or drug response may want to compare partial reductions in receptor abundance instead of complete losses. These are different questions, but they all depend on the same ability: to control a specific target protein, in the primary cilium, by a controllable amount.",
        "Tunability adds another layer of information. Researchers could begin to test whether signalling changes gradually as receptor abundance falls, whether there is a minimum amount needed before a response occurs, or whether faster removal from the cilium shuts signalling down more quickly. The exact research question may differ, but the underlying need is the same: more precise control over protein location and abundance could reveal biological relationships that are difficult to identify with today's separate tools.",
        "Across the research questions and the interviews we conducted, we recognised a common perspective behind all of these needs. Understanding ciliary signalling requires control not only over which protein is changed, but also over where, when, and by what increment it changes. We summarised this idea in our founder's theory, a guiding principle that captures what we believe an effective ciliary research tool should let researchers control.",
      ],
    },
{
      kind: "callout",
      id: "founders-theory",
      label: "founder's theory",
      heading: "What a useful ciliary tool must let you control",
      body: [
        "We believe that understanding ciliary signalling requires more than knowing whether a protein is present or not. A useful research tool should give researchers control over the target protein, and over when, where, and by how much its abundance changes. In the primary cilium, these factors shape the impact of signalling proteins on cellular pathways. A research tool that can independently control these variables lets scientists uncover signalling thresholds and cilium-specific functions that are difficult to separate with current methods.",
      ],
      source: "Written after the interviews, and still being revised as we speak to more researchers.",
    },
{
      kind: "prose",
      body: [
        "Our founder's theory therefore proposes that the most useful ciliary tools will combine target specificity, location control and tunability in the same system. Instead of an on/off switch, our platform allows researchers to explore the intermediate states that exist between the two. As we continue speaking with researchers and validating our platform, this theory will continue to evolve alongside the needs of the community.",
      ],
    },
{
      kind: "prose",
      section: "Market",
      id: "market",
      heading: "Market model",
      body: [
        "Our technology sits at the intersection of several research areas, including GPCR signalling, cilia biology and tunable systems. To adapt approaches researchers already use toward controlling the abundance of selected proteins within the primary cilium, we need to understand the size of the opportunity, from both the scientific importance of these fields and the technologies researchers currently use to study them.",
      ],
    },
{
      kind: "stats",
      id: "biological-opportunity",
      heading: "Biological opportunity",
      items: [
        { value: "516", label: "approved drugs that target a GPCR", note: "Nat. Rev. Drug Discov., 2025 [1]" },
        { value: "36%", label: "of approved drugs target a GPCR" },
        { value: "30+", label: "human diseases and syndromes caused by mutations affecting cilia", note: "[2]" },
        { value: "0", label: "approved drugs targeting a ciliary GPCR", note: "[3]", emphasis: true },
      ],
      footnote:
        "A 2025 Nature Reviews Drug Discovery analysis identified 516 approved GPCR-targeting drugs, 36 percent of approved drugs, with another 337 GPCR-targeting agents in clinical trials; the same analysis reported that GPCR drugs for diabetes and obesity alone generated nearly 30 billion dollars in sales in 2023 [1]. Meanwhile, primary cilia defects are associated with more than 30 human diseases and syndromes [2], and cilia regulate signalling during both development and adult tissue maintenance. Despite this, there are no approved drugs targeting ciliary GPCRs [3]. Not every GPCR is ciliary, and our platform is not itself a therapeutic. But the data shows that the impact of our research platform belongs to a highly active biomedical research space.",
    },
{
      kind: "stats",
      heading: "What the cilia research tool market is worth",
      intro: "There is no published figure, so we built one from the cilia share of PubMed and the NIH's technology funding. The working is in the section below.",
      items: [
        { value: "$3.6M a year", label: "lower estimate: Bioengineering funding, 7.212 billion dollars × 0.05%" },
        { value: "$4.4M a year", label: "upper estimate: Biotechnology funding, 8.846 billion dollars × 0.05%", emphasis: true },
      ],
      footnote: "This gives an estimate of 3.6 to 4.4 million dollars of annual NIH-supported cilia research-technology opportunity.",
    },
      {
        kind: "details",
        id: "market-working",
        heading: "How we built the estimate",
        summary: "Two questions, four steps, and the five limitations we know about.",
        blocks: [
{
      kind: "prose",
      id: "market-estimate",
      heading: "Estimating the cilia research tool market",
      body: [
        "To understand our potential market, we initially sought to quantify the exact size of the cilia research tools sector. Unlike larger, more established fields such as gene editing and therapeutics, however, there is no published market estimate for research tools used to study the primary cilium. To understand the potential size of this research community, we developed our own market model.",
        "Rather than presenting the result as an exact market size, our goal was a reasonable estimate from publicly available information, built around two questions. **What proportion of biomedical research is focused on cilia?** Answering this would give us insight into how cilia research is represented across biomedical research. **How much technology-development funding could reasonably be associated with cilia research?** Answering this would give us insight into the commercial focus on research tool development.",
        "By assuming that the cilium's representation in the research tool development space follows the same distribution as its representation across the whole biomedical space, we can make a more accurate estimate of the potential commercialisation of, and need for, a cilium-based research tool.",
      ],
    },
{
      kind: "steps",
      items: [
        {
          title: "Estimate the share of research focused on cilia",
          body: "CiliaKB, a recently developed database of cilia-associated genes, reports that a PubMed search for the keyword “cilia” identified 6,357 publications between 2015 and 2025, roughly 578 cilia publications per year across this eleven year period [3.1]. To estimate the size of biomedical research overall, we used PubMed as our denominator: the National Library of Medicine reports 5,734,130 PubMed records published from 2015 to 2019, approximately 1,146,826 biomedical publications per year [3.2]. Dividing the two gives an estimated share of biomedical research represented by cilia of **0.05 percent**. In other words, roughly one in every two thousand biomedical publications is associated with cilia research.",
        },
        {
          title: "Estimate the funding pool for research tool development",
          body: "The NIH has programmes designed specifically for this purpose. The National Institute of General Medical Sciences (NIGMS) operates dedicated Technology Development programmes; its Focused Technology Research and Development R01 programme supports projects focused on developing new biomedical technologies rather than answering new biological questions, with eligible outcomes including laboratory instruments, software, chemical reagents, and biological molecules or systems engineered for use as research tools [3.3], which makes it particularly relevant to our project. NIGMS also supports Biomedical Technology Optimization and Dissemination (BTOD) centres, which focus on later-stage development and distribution of research tools, receiving up to 850,000 dollars in recurring direct costs per year. Both funds give insight into spending on research tool development, but they do not cover the full market scope of research tools, and the NIH does not publish one consolidated annual budget for research-tool development: programmes have no set-aside funds, and the number and value of awards depend on appropriations and successful applications.",
        },
        {
          title: "Define a broader technology funding proxy",
          body: "To estimate the scale of the funding environment in which research technologies are developed, we used the NIH Bioengineering and Biotechnology research categories. For the 2025 financial year, the NIH reported approximately **7.212 billion dollars** for Bioengineering and **8.846 billion dollars** for Biotechnology, from its Research, Condition, and Disease Categorization (RCDC) system [3.4]. These categories are broader than research-tool development, since they include projects that would not result in a new laboratory tool, but they provide an initial benchmark for the technology-oriented biomedical research environment our tool would be used in. They cannot simply be added together, because NIH categories overlap, so we treat them as the lower and upper boundaries of a technology-oriented funding proxy rather than as two separate markets.",
        },
        {
          title: "Apply the cilia research share",
          body: "Using our estimated cilia research share of approximately 0.05 percent, we applied that proportion to the two NIH technology-oriented funding proxies.",
        },
      ],
    },
{
      kind: "prose",
      heading: "What does our estimate actually represent?",
      body: [
        "Our model suggests that cilia biology is a small but established research niche within the larger biomedical research ecosystem. Based on the relative publication activity of the field and the size of the NIH's technology-oriented funding categories, we estimate an NIH-supported cilia research-technology opportunity of approximately 3.6 to 4.4 million dollars annually.",
        "Research funding supports many different expenses, including personnel, laboratory infrastructure, experiments, equipment, reagents and technology development. Our estimate represents the approximate funding environment that could support the development and adoption of cilia-focused research technologies. For our platform, that includes the areas potential users are studying: ciliary signalling, GPCR biology, receptor trafficking, ubiquitination, developmental signalling and ciliopathies.",
        "For our technology, this estimate suggests our immediate market is specialised rather than mass market. Instead of designing the platform as a broad biotechnology platform, our first users should be researchers already studying ciliary proteins and signalling pathways. This reinforces our idea of making the platform adaptable across different ciliary targets and easy to implement in individual research labs. At the same time, the focused size of the cilia research community suggests that long term growth depends both on our ability to demonstrate that the targeted ubiquitination strategy works and on whether it can be applied to arbitrary proteins on the primary cilium.",
      ],
    },
{
      kind: "cards",
      id: "market-limits",
      heading: "Limitations of our model",
      intro: "This model is intentionally an estimate rather than a reported market value, and several assumptions affect its accuracy.",
      items: [
        { title: "Publications are not spending", body: "Cilia publication activity is not equivalent to research spending; different fields require different amounts of funding, so 0.05 percent of publications does not necessarily correspond to 0.05 percent of research dollars." },
        { title: "Cilia, broadly", body: "Our publication estimate includes cilia broadly, since we searched for the term “cilia”, so it can include research on both primary and motile cilia. Our platform focuses much more narrowly on signalling proteins of the primary cilium." },
        { title: "Field share is not tool share", body: "Funding for cilia research as a share of the whole biomedical space does not map proportionally onto the research-tool subspace within it." },
        { title: "Proxies, not budgets", body: "Bioengineering and Biotechnology are broader than research-tool development. Since we could not find a single NIH research-tool budget, we used their funding levels only as proxies for the larger technology-oriented environment, not as direct measures of research-tool spending." },
        { title: "NIH only", body: "Our estimate considers NIH funding rather than the entire global market." },
      ],
    },
        ],
      },
      {
        kind: "details",
        id: "neighbouring-markets",
        heading: "What neighbouring markets tell us",
        summary: "CRISPR, RNAi, small molecules, targeted protein degradation and research antibodies: their size, their growth, and what that says about ours.",
        blocks: [
{
      kind: "table",
      id: "market-table",
      heading: "Researchers invest heavily in protein-altering technologies",
      intro:
        "Commercial market estimates for relevant technologies, emphasising the opportunity of certain implementation strategies. Each has its estimated 2025 market size and its compound annual growth rate (CAGR), the expected average annual growth over the next five years.",
      columns: ["Existing technology", "2025 estimated global market and five-year CAGR", "Why this matters"],
      rows: [
        ["CRISPR-based gene editing", "2025: 4.53 billion USD [4]. CAGR: 19.89%", "The market shows strong demand for programmable tools that let researchers alter specific biological targets. CRISPR is powerful for determining whether a gene matters, but it generally changes the protein across the whole cell rather than specifically in the primary cilium."],
        ["RNAi gene silencing", "2025: 2.2 billion USD [5]. CAGR: 12.3%", "The market shows strong demand for tools that reduce rather than remove gene expression. This overlaps with interest in protein abundance, though RNAi still acts on the whole cell."],
        ["Small molecule drugs", "2025: 67.42 billion USD [6]. CAGR: 8.86%", "A massive drug market using small molecules. Its success shows the potential benefit of adjustable, dose-dependent control."],
        ["Targeted protein degradation", "2025: 0.42 billion USD [7]. CAGR: 23.5%", "The closest existing market to our system, since it recruits cellular degradation machinery toward selected proteins. PROTACs alone represented 47.56% of this market in 2025."],
        ["Research antibodies", "2025: 3.98 billion USD [8]. CAGR: 7.37%", "Another proposed implementation, in which antibodies would provide the target-recognition and recruitment components of the platform."],
      ],
    },
{
      kind: "borrow",
      id: "borrowed",
      heading: "What the platform borrows, and what it adds",
      items: [
        { glyph: "spray", caption: "adjustable dosing" },
        { glyph: "antibody", caption: "antibody-like specificity" },
        { glyph: "grabber", caption: "degradation-based control" },
      ],
      outcome:
        "And adds what none of them were designed around: control of protein abundance specifically **within the primary cilium**.",
    },
{
      kind: "prose",
      body: [
        "The pattern across these markets reveals growing interest in tools that give researchers and pharmaceutical developers more control over biological systems, led by technologies such as targeted protein degradation, with the highest CAGR at 23.5 percent, and CRISPR-based gene editing at 19.9 percent. While these markets are not direct measurements of demand for a primary cilium platform, their growth suggests that biotechnology developers have a continued interest in programmable control of protein production. Rather than competing in existing markets, the high growth and high market size tell us that the value of our technology is in building on the strengths of existing technologies to provide one primary innovation: programmable control over specific biological targets within a high interest cellular region.",
        "The market data also influences our [implementation decision](/human-practices#implementation-strategy). The size of the small molecule drug market supports our interest in a potential small molecule therapeutic application. Yet, for research platforms, antibodies seem highly coveted. Similarly, the strong growth of targeted protein degradation suggests the approach of removing proteins directly rather than blocking their activity. Taken together, these trends suggest that our platform could fit naturally between several established technologies, with the adjustable dosing typical of small molecule drugs, antibody-like specificity, and degradation-based protein control, while adding a feature these tools were not designed around: control of protein abundance specifically within the primary cilium.",
        "In 2024, Addgene distributed 184,824 materials to 39,529 scientists across 86 countries, demonstrating the scale at which standardised, shareable biological tools can spread through the research community [9]. Given the spread of research tools, alongside the technology gap in a growing market, our market model shows a strong reason to develop a research tool capable of modulating specific signalling proteins on the primary cilium.",
      ],
    },
        ],
      },
{
      kind: "prose",
      id: "entrepreneurship",
      section: "Entrepreneurship",
      heading: "Entrepreneurship: from research to adoption",
      body: [
        "As our market analysis revealed, ciliary biology is a specialised but established research community, while existing tools from neighbouring markets have broader use cases that give researchers more global control over biological systems. Identifying a market opportunity does not automatically tell us how our technology can reach that market, however. We were confident that we wanted to spend as much time as possible developing the technology and giving researchers the ability to use it openly and accessibly, but we did not know how to achieve that goal. We started with a lot of potential avenues: patenting, licensing, creating a company, distributing it openly to labs. To understand how our project should approach these decisions, we spoke to [Roi Eisenkot](stakeholder:eisenkot), Associate Director of Bioengineering at UW CoMotion, who works with researchers to translate university technologies toward real world use.",
      ],
    },
{
      kind: "prose",
      heading: "Starting with an end goal",
      body: [
        "One of the first lessons we learned from our conversations with [Mr. Eisenkot](stakeholder:eisenkot) is that there is no straightforward correct pathway. He encouraged us to first define what we ultimately want the technology to achieve. If our priority lies with broad scientific access, an open nonprofit model could let researchers obtain and use the platform more easily. If continued development requires significant investment, we could use intellectual property and commercial partnerships to sustain those costs.",
        "This changed the way we viewed intellectual property. Rather than considering patenting a way to maintain control over our technology, it could instead ensure the technology remains in the open domain. Since patents require substantial time and resources, they generally make the most sense with a method to recover that investment. At the same time, simply distributing the technology as a black box could reduce adoption if researchers do not have the proper validation or know how to implement it in their own science.",
        "We therefore decided that patents, licensing and direct distribution should not be treated as final decisions, and should instead follow evidence about our users' needs and what the technology must contain to be useful to them.",
      ],
    },
{
      kind: "rail",
      id: "to-market",
      heading: "To-market strategy",
      intro: "Five stages, in order. Above the line is what we have done; below it is what we are planning.",
      hereLabel: "we are here",
      stages: [
        {
          title: "Establish proof of concept",
          body: [
            "The first step in effectively developing and distributing our technology is demonstrating that the technology works. Our [Community Need](/human-practices#community-need) and [Designing for Adoption](/human-practices#adoption) work identified an opportunity for a tunable, target-specific research tool for studying ciliary protein abundance, but the value of that opportunity depends on whether our proposed system can reliably produce the intended biological effect. See our [home page](/) for a refresher on the project.",
            "Our [wet lab](/experiments) and [modelling](/model) teams have begun building this proof of concept. Wet Lab has been testing whether bringing the MMM-associated ubiquitination machinery toward our initial target, SMO, produces a measurable change in its abundance, while our protein design work has been designing the inhibitor protein. In parallel, our mathematical models examine system behaviour, including the tunability and off-target effects of the system.",
            "For entrepreneurship, a potential market is only meaningful if we can first demonstrate a convincing and reproducible use case. Establishing that foundation lets us move to the next question: how can we best develop our technology in a way another researcher would actually need and be willing to use?",
          ],
        },
        {
          title: "Define our minimum viable research tool",
          body: [
            "As our stakeholders, primarily [Mr. Eisenkot](stakeholder:eisenkot), [Mr. Chamberlain](stakeholder:chamberlain) and the founders of [NuukBio](stakeholder:nuukbio), Dr. Lee and Dr. Chun, pointed out, developing a research tool that tries to address many individual needs can become very broad very quickly. To focus development on the features a user would actually need, we were recommended to consider our minimum viable research tool: the simplest version of the platform that can reliably demonstrate value to another researcher, before investing time in a more complex commercialised version.",
            "Our first iteration does not have to work for every ciliary membrane target. It needs to demonstrate one compelling, reproducible use case and provide enough information for other users to understand and repeat the experiment. For our platform, the minimum requirements are: a validated method for recruiting the MMM ubiquitination machinery toward our current target, SMO, or an alternative predefined target; convincing evidence that the ciliary abundance of the selected protein changes; followable positive and negative controls that let researchers distinguish the intended mechanism from nonspecific effects; information on the tunability, timing and efficiency of the tool; a reproducible protocol with clear starting conditions; and evidence that the tool could eventually be expanded to alternative targets.",
            "These requirements follow our [design requirements](/human-practices#design-requirements), and are the conditions our users told us they would need before adopting the tool. Our immediate entrepreneurship milestone is not selling a product but producing enough convincing evidence for intended users to feel confident implementing our technology.",
          ],
        },
        {
          title: "Customer discovery",
          here: true,
          body: [
            "The most important recommendation from our CoMotion conversation was to increase customer discovery. Researchers saying that an idea sounds interesting is not enough evidence that they would adopt it. As [Mr. Eisenkot](stakeholder:eisenkot) put it, actions speak louder than words, and we had to understand how researchers currently adjust protein abundance in the cilium before pitching our solution to them. Our goal is to move from measuring interest to measuring likely behaviour: a researcher spending significant time and funds to overcome the limitation we address is much stronger evidence of a market need than a researcher saying our tool is useful.",
            "We have begun this process through our stakeholder interviews. Rather than asking whether researchers liked our concept, we probed deeper, asking cilia and signalling researchers what biological questions they currently struggle to answer, which proteins would make meaningful targets, and what models and controls they would require to use our technology. [Dr. Mark Bothwell](stakeholder:bothwell) identified concrete potential applications involving GLP-1R, ciliary GPCRs involved in appetite regulation, and PC1, emphasising that users would need to see both a measurable localisation change and a corresponding biological effect to be confident in using it. [Dr. Steven Vokes](stakeholder:vokes) pushed us to compare our platform against cheaper existing approaches and helped us think about which targets and delivery formats could give a genuine advantage. [Dr. John Wallingford](stakeholder:wallingford) explained that a major limitation in cilia research is studying ciliary dynamics in live cells, since approaches such as expansion microscopy require fixation and so lose the connection between structure and real time behaviour; he suggested our platform could be useful for examining how changing SMO ubiquitination affects Hedgehog signalling dynamics in living cells.",
            "Our next step is to make this customer discovery more systematic and behaviour-focused. We plan to ask more about: current methods of characterising and measuring the abundance of ciliary proteins; which parts of the current workflow are difficult, time-consuming or expensive; the problems a lab is spending significant time or funding to solve; individual needs in a research tool and the controls and validation expected; delivery and implementation format preferences; and how labs decide between their current workflow and a newly implemented tool.",
            "Several of our entrepreneurship stakeholders mentioned the **NSF I-Corps programme**, and the founders of [NuukBio](stakeholder:nuukbio) highlighted it as an important part of understanding users while developing their own platform. I-Corps was created to help researchers assess the real world potential of academic inventions through experiential customer discovery. It is particularly relevant to our next stage because it is designed around structured interviews with potential customers, and uses those conversations to define a beachhead customer, a value proposition and product-market fit. UW's Northwest I-Corps programme trains teams to design impactful questions, conduct at least twenty customer discovery interviews, and discuss next product steps with other teams. Participating would be a natural next step: rather than immediately deciding how to sell or distribute the platform, we would use the programme to test our assumptions about our first users, the problems they value most, and whether the minimum viable research tool we defined fits their existing workflow. The results then directly inform the next stages of our implementation timeline.",
          ],
        },
        {
          title: "Validate transferability",
          body: [
            "Based on current customer discovery and our minimum viable research tool, we envision the next step as validating the transferability of our research tool, in two senses. **Technical transferability:** can the same platform be redirected from SMO to other ciliary proteins? **User transferability:** can another lab reproduce and use the system independently?",
            "Because SMO is already naturally regulated by the MMM complex, [Dr. Ning Zheng](stakeholder:zheng) recommended that future work test a protein that is not normally targeted by MMM. A wet lab experiment could replace the SMO-targeting component with a binder for a new target while keeping the rest of the recruitment system as consistent as possible. We would then test whether the new target is successfully recruited toward the MMM-associated machinery, whether its ubiquitination increases, whether its overall and ciliary abundance changes, and whether an expected downstream biological effect can be measured. We would also use stakeholder-recommended controls, such as catalytically inactive MGRN1 and non-recruiting targeting components, to confirm that any change results from our engineered recruitment strategy rather than nonspecific effects. Our modelling team would help characterise dose-response and time-course experiments to determine whether tunability is preserved for the new target, adjusting parameters such as target abundance, recruitment strength and ubiquitination rate against new experimental data so that target abundance can be predicted from recruitment strength.",
            "A useful research platform does not require our team to troubleshoot every experiment once it is in users' hands. We envision a platform that provides outside laboratories with a consistent toolkit, our current model being the [implementation tools](/human-practices#implementation). We would start with a small set of users who have expressed strong interest and for whom the technology is most pertinent. Given our materials, these groups could repeat one of our validation experiments and compare whether they observe a similar direction and magnitude of target reduction. Any step that needs consistent clarification or produces large variation between laboratories is a part of the platform that needs simplification or stronger validation. Rather than requiring every new user to search a large range of conditions experimentally, we envision the model letting researchers enter the basic characteristics of their target and experimental conditions, with data from external users compared against the model's prediction and used to refine it. Combined with standardised protocols and controls, that would tell us whether the platform is genuinely **reproducible** outside the environment it was developed in.",
          ],
        },
        {
          title: "Choose a dissemination model and expansion decision",
          body: [
            "Once we have demonstrated proof of concept, defined a minimum viable research tool, expanded customer discovery and validated transferability, we would need to decide how the platform should actually reach researchers. Our stakeholder conversations showed us that there is no single best pathway. The appropriate model depends on how much support the technology requires, the resources needed for continued development, and the importance of broad access against the demand for sustained commercialisation. With the advice of [Mr. Eisenkot](stakeholder:eisenkot), [Mr. Chamberlain](stakeholder:chamberlain) and our other entrepreneurship stakeholders, we developed a table of the pathways our technology might take after these initial steps.",
          ],
          table: {
            columns: ["Potential pathway", "What it could look like for our platform", "When we would choose this pathway"],
            rows: [
              ["Open academic distribution", "Publicly share designs, protocols, controls and validation data so laboratories can reproduce and modify the system themselves.", "If the platform is easy to reproduce, requires little ongoing support for individual users, and the priority is maximising scientific access."],
              ["Research repository", "Deposit validated biological machinery through an established research repository so labs can obtain standardised components with clear documentation.", "If the platform can be standardised into reproducible components and the validated information is easy to understand with little additional support."],
              ["Licensing to an existing company", "License the technology to an existing research or biotechnology company with an established manufacturing and distribution pipeline.", "If the platform requires more formal manufacturing, quality control and user assistance than our team could sustainably provide. The more likely option given enough demonstrated demand."],
              ["Startup or spinout", "Form a company focused on developing additional targets and standardised products, with support for researchers using the platform.", "If customer discovery reveals a repeated, valuable unmet need that researchers are willing to pay to solve, and if continued development would benefit from a dedicated team and interested investors."],
              ["Patent plus licensing or commercialisation", "Protect key aspects of the technology before partnering with companies or pursuing a startup pathway.", "A clear and defensible invention, substantial investment needed to mature the technology, and intellectual property that would help attract partners or funding."],
            ],
          },
        },
      ],
    },
{
      kind: "prose",
      heading: "How would we decide?",
      body: [
        "We envision revisiting these options after completing the earlier stages of our to-market strategy. Evidence from customer discovery will tell us whether there is a real need that researchers are willing to learn, and pay, to meet. Transferability experiments will show how much technical assistance users would require. Continued development will reveal the time and financial resources successful manufacturing demands. For now, our goal is to preserve multiple dissemination pathways while collecting the evidence we need to make that decision responsibly.",
      ],
    },
{
      kind: "prose",
      section: "Adoption",
      id: "adoption",
      heading: "Designing for adoption: our initial assumption",
      body: [
        "At the beginning of our project, we were focused on one question: could we make the technology work? We envisioned a programmable platform that could use the MMM ubiquitination complex to tune the abundance of a chosen ciliary protein. Because MMM naturally promotes the ubiquitination and downregulation of Smoothened (SMO), it gave us a logical starting point for testing whether this machinery could be redirected toward other targets.",
        "At first, we defined success almost entirely in technical terms: could we recruit the right target, produce a measurable change in its ciliary abundance, and control the magnitude of that change? We assumed that if we could demonstrate this proof of concept, we would have built a useful research tool.",
        "As we began speaking with researchers, we realised that making the platform work was only the first step. A tool also has to be trustworthy, reproducible, adaptable, and practical enough for another researcher to build their own experiments around it.",
      ],
    },
{
      kind: "prose",
      id: "with-stakeholders",
      heading: "Designing with stakeholders in mind",
      body: [
        "Speaking to researchers and biotechnology developers changed our definition of a successful platform. [Dr. Samuel Miller](stakeholder:miller) pushed us to think beyond whether the system could alter receptor abundance and instead ask whether that change would produce a meaningful biological effect. He also pointed out that researchers care about practical factors such as cost, technical difficulty, reproducibility, and the risk of false positive or false negative results. [Dr. John Wallingford](stakeholder:wallingford) similarly emphasised that a new ciliary tool would need clear information about its degradation rate, effectiveness and efficiency before other researchers could confidently use it. Our conversations with the co-founders of [NuukBio](stakeholder:nuukbio) reinforced that a research platform cannot rely on assumed value. These conversations encouraged us to first define the specific scientific question our technology could answer, and then build strong experimental evidence around it, so that researchers have the confidence to use our technology.",
        "Other stakeholders expanded what we thought trust meant. [Dr. Paul Pottinger](stakeholder:pottinger) encouraged us to think about unintended effects across larger biological systems and to set clear boundaries between what our platform can demonstrate now and what is only possible in the future. [Dr. Stacey Ogden](stakeholder:ogden) reminded us that the protein abundance we modulate has real physiological meaning: modulating SMO, for example, directly affects the Hedgehog pathway, with its important roles in development, so a technology that alters these systems must be used responsibly. [Dr. Herbert Sauro's](stakeholder:sauro) feedback on our kinetic models showed us that strong adoption depends on having a clear biological model and knowing what experimental data are needed to support it.",
        "Together, these early conversations shifted our question from technical feasibility to how we can develop a platform that another researcher would trust enough to build into their experiments. Such a platform needs convincing biological evidence, clear validation, reproducibility, practical usability and responsible boundaries.",
      ],
    },
{
      kind: "personas",
      id: "who-would-use-this",
      heading: "Who would use this?",
      intro: "Six kinds of researcher who would pick this up, and what each of them would need from it first.",
      people: [
        {
          title: "Ciliary biologist",
          persona: "cilia",
          role: "Cilia biologists study how the primary cilium is built and used as a signalling compartment. They are especially interested in how proteins move into and out of the cilium and how changes in protein composition affect the cell's behaviour [1].",
          stake: "Many ciliary proteins also exist elsewhere in the cell, so cilia biologists often need ways to separate a protein's specific function in the primary cilium from its function in the rest of the cell. A tool that changes how much of a chosen protein accumulates in the primary cilium could help them study this compartment better.",
          cares: "They would need confidence that the platform truly changes protein abundance in the primary cilium without broadly disrupting the cilium or unrelated ciliary proteins. They would also care about how quickly the modulation occurs, how strong it is, and whether it can be measured reliably, as [Dr. John Wallingford](stakeholder:wallingford) highlighted when discussing degradation rate, effectiveness, efficiency, and the difficulty of studying ciliary dynamics with existing methods.",
          use: "A cilia biologist could use the platform to gradually increase or decrease the amount of a receptor in the primary cilium and observe what happens to its trafficking or downstream signalling. They could ask whether a receptor must reach a certain ciliary abundance before signalling changes, or whether changing only the ciliary population of a protein produces a different effect from altering the protein across the whole cell.",
        },
        {
          title: "GPCR and signalling researcher",
          persona: "gpcr",
          role: "GPCR and signalling researchers study how receptors sense signals outside the cell and how the cell converts those signals into responses. Many GPCRs can localise to the primary cilium, where the cilium acts as a concentrated signalling environment that can regulate signalling [2].",
          stake: "For this group, the main interest is how receptor abundance affects a specific pathway's output. They are especially relevant to our project because our current proof of concept target, Smoothened (SMO), is a GPCR. A platform that changes the amount of a GPCR solely in the primary cilium could help separate the contribution of the ciliary receptors from the same receptor elsewhere in the cell.",
          cares: "They would want to know whether changing receptor abundance actually causes a meaningful change in signalling output, and whether that relationship is measurable. [Dr. Samuel Miller](stakeholder:miller) emphasised this point in our interviews, challenging us to show that receptor copy number influences a measurable biological response rather than assuming that more or less receptor simply means stronger or weaker signalling.",
          use: "A GPCR or signalling researcher could use the platform to test dose-response relationships or signalling thresholds. They could gradually reduce the ciliary abundance of a receptor and measure whether downstream signalling decreases linearly, changes only after a threshold is reached, or responds differently depending on protein abundance.",
        },
        {
          title: "Developmental biologist",
          persona: "developmental",
          role: "Developmental biologists study how cells communicate and make decisions as tissues and organs form. The primary cilium is especially relevant in vertebrates because it is required for Hedgehog signalling, a pathway that helps control cell identity and tissue patterning during development [3].",
          stake: "Developmental signalling often depends on both the strength and the timing of a signal, which makes an adjustable ciliary protein abundance system quite useful. Rather than completely removing a signalling protein, researchers could use our platform to explore how different levels of a ciliary receptor influence developmental responses over time [4].",
          cares: "These researchers would care about whether the platform can produce controlled changes without broadly disrupting normal developmental signalling. In our conversation with [Dr. Stacey Ogden](stakeholder:ogden), she emphasised how widely Hedgehog signalling is used during development and the importance of considering the use and impact of altering this pathway.",
          use: "A developmental biologist could use the platform to test how changing ciliary receptor abundance affects the strength, timing or threshold of a developmental signal, for example by gradually changing ciliary SMO abundance and examining whether different levels of Hedgehog signalling lead to different cellular responses.",
        },
        {
          title: "Disease and ciliopathy researcher",
          persona: "disease",
          role: "Disease and ciliopathy researchers study how abnormalities in the primary cilium contribute to human disease. Because primary cilia are present on so many cells and help coordinate several signalling pathways, problems with ciliary structure or trafficking can affect many organs, leading to disorders called ciliopathies, which can affect the kidneys, brain, eyes, skeleton and other tissues [5].",
          stake: "These researchers may want to understand how a disease-caused change in a specific ciliary protein affects signalling, without having to remove that protein from the entire cell. A tool that can selectively adjust protein abundance to match the disease-caused change within the primary cilium could help reflect disease-related cellular behaviour. This is especially relevant because cilia can differ in composition across cells, which could explain the wide diversity of ciliopathy symptoms [5].",
          cares: "They would care strongly about whether the effect is specific, reproducible and biologically meaningful, ensuring that changing one ciliary protein's concentration does not unintentionally disrupt other pathways or the primary cilium itself. [Dr. Paul Pottinger](stakeholder:pottinger) emphasised this systems-level concern in our interviews, encouraging us to examine broader biological effects and eventually test a validated system in a more physiologically relevant model such as organoids.",
          use: "A disease or ciliopathy researcher could use the platform to model different levels of abnormal ciliary protein abundance and observe any signalling or cellular effects. Rather than comparing a healthy cell against one where protein activity is completely lost, they could test the impact of partial changes in ciliary abundance in a diseased state.",
        },
        {
          title: "Protein trafficking and ubiquitination researcher",
          persona: "trafficking",
          role: "Protein trafficking and ubiquitination researchers study how cells decide where proteins go and when they are removed. In the primary cilium, ubiquitin is an important molecule that can act as a signal, helping trafficking machinery such as the BBSome remove certain receptors from the ciliary membrane [6].",
          stake: "For this group, our platform directly manipulates the process that helps control protein retention in, and removal from, the primary cilium. By recruiting the MMM-associated E3 ubiquitin ligase toward a specific target, the system provides a unique way to study how targeted ubiquitination affects receptor trafficking in a controlled environment.",
          cares: "They would want to know whether the effect observed truly comes from ubiquitination of the intended target rather than from broader changes to the system. They would also care about the degradation rate and efficiency of the E3 ligase activity, which is why controls such as our catalytically inactive MGRN1 are important in our wet lab experimental designs.",
          use: "A trafficking or ubiquitination researcher could use the platform to test how adding ubiquitin to one selected ciliary protein changes its accumulation, exit or degradation over time.",
        },
        {
          title: "Synthetic biologist and tool developer",
          persona: "synbio",
          role: "Synthetic biologists and tool developers build systems that can be reused and modified to answer new biological questions. Their focus is a modular, reproducible tool that other researchers can adapt to different targets.",
          stake: "For this group, the main value of our platform is as a generalisable control system rather than a single-use experiment. Because our proof of concept focuses on recruiting the MMM complex to a chosen target, the long term aim is to make the targeting component interchangeable, so researchers can adapt the system to new ciliary membrane proteins.",
          cares: "This group cares strongly about modularity, transparency, clear design rules and easy transfer between labs. Our conversations with the co-founders of [NuukBio](stakeholder:nuukbio), who are developing a platform technology of their own, reinforced that platforms need rigorous validation and a clear scientific purpose.",
          use: "A synthetic biologist or tool developer could use the platform as a starting framework, modifying the targeting component or the experimental readout to answer a new biological question.",
        },
      ],
    },
{
      kind: "prose",
      id: "shared-needs",
      heading: "Shared needs",
      body: [
        "Although these researchers would use our platform to answer very different scientific questions, we noticed that many of their requirements were surprisingly similar. A cilia biologist might care most about whether a protein truly changes inside the primary cilium, while a GPCR researcher may focus more on whether that change produces a measurable effect on the pathway; both depend on the change being specific and measurable. A developmental biologist may focus on timing and partial changes in signalling, while a ciliopathy researcher may care more about whether the system causes unintended effects in a biological context; again, both need a platform that is tunable and on target. Despite their different priorities, the groups showed similar needs. Collating them, researchers need confidence that the platform is specific, tunable, well validated, adaptable, and safe enough to build upon. This reinforced the conversations we had with our stakeholders. Across these different users, five shared needs emerged.",
      ],
    },
{
      kind: "facts",
      items: [
        { title: "Specificity", body: "Researchers need to be confident that the platform is changing the intended protein, and that the effect is occurring only on the primary ciliary membrane rather than across the cell." },
        { title: "Tunability", body: "Researchers need more than an on-or-off change. They may want to compare the effects of different levels of protein abundance on signalling pathways." },
        { title: "Validation", body: "Researchers need clear evidence that the platform worked: confirmation that ciliary protein abundance changed, and that a downstream biological effect is connected to that change." },
        { title: "Adaptability", body: "Different researchers study different proteins and cell types and have different biological questions. For the platform to be useful beyond our proof of concept, it should be possible to adapt it to new targets without rebuilding the entire system." },
        { title: "Safety and biological integrity", body: "Researchers need confidence that changing one ciliary protein does not unintentionally disrupt the cilium itself or alter unrelated proteins, creating broader effects that make the experiment difficult to interpret." },
      ],
    },
{
      kind: "table",
      id: "design-requirements",
      heading: "Design requirements",
      intro:
        "These shared needs give us a clearer definition of what adoption actually requires. The next step was to turn each of them from a general expectation into a concrete design requirement for our platform.",
      columns: ["Shared need", "Design requirement", "How this is reflected in the platform", "What this enables"],
      rows: [
        [
          "Specificity",
          "Target the right protein in the right place. The platform should change the intended protein specifically within the primary cilium, minimising effects on unrelated proteins.",
          "We use a targeting system designed to bring the MMM complex to one chosen protein, and then measure changes specifically in the primary cilium.",
          "Researchers can more confidently connect an observed effect to the target protein on the ciliary membrane.",
        ],
        [
          "Tunability",
          "Create controllable levels of protein abundance. The system should allow intermediate levels of protein reduction rather than only normal against complete degradation.",
          "We test different amounts of our linker and inhibitor so we can explore different levels of target protein [reduction](/model).",
          "Researchers can study dose-response relationships, signalling thresholds and intermediate biological states of the system, which a purely on/off experiment would miss.",
        ],
        [
          "Validation",
          "Confirm the system worked in multiple ways: measure ciliary protein abundance, verify the intended mechanism, and connect the change to a related readout.",
          "We use multiple experiments to check whether the target protein is actually reduced, whether it leaves the cilium, and whether signalling changes as expected.",
          "Researchers can distinguish a true platform effect from experimental noise, and gain confidence that the observed results are sound and biologically important.",
        ],
        [
          "Adaptability",
          "Build the platform so it can be modified for new targets. The targeting components should eventually be exchangeable, so the system can move beyond our initial SMO proof of concept.",
          "The platform is built around a separate targeting component and the ubiquitination machinery. Our current proof of concept targets SMO, while the long term design is for the targeting module to be exchangeable, so the same MMM-based framework can be redirected toward other ciliary membrane proteins.",
          "Researchers studying different proteins or pathways can adapt the same basic platform with their own adjustments to answer their scientific questions, rather than starting from scratch.",
        ],
        [
          "Safety and biological integrity",
          "Check the system around the target. Monitor ciliary structure, off-target effects and any unintended changes to broader pathways.",
          "We include controls to check that the [effect really comes from MMM activity](/experiments#experiments), and use [modelling](/model#mc4r-safety) to look for possible off-target effects on other pathways.",
          "Researchers can interpret results with more confidence, knowing that the observed effect was caused by altering the intended protein's abundance rather than by damage to the cilium or broad signalling disruption.",
        ],
      ],
    },
{
      kind: "prose",
      id: "what-adoption-means",
      heading: "What adoption now means to us",
      body: [
        "At the start of our project, adoption depended on whether the platform succeeded in changing protein abundance in the primary cilium. Through our conversations with researchers and our examination of existing technology, that definition has become much broader. A tool is not useful just because it works once in our hands. The eventual user, another researcher, needs to be able to understand what the tool is doing, trust the results, reproduce the tool, and adapt it to their own research question. Feedback around biological relevance, validation, efficiency and unintended effects gave us the framework and the steps needed to shift our focus toward these wider requirements.",
        "Now, for us, successful adoption means developing a platform that is not only functional, but also specific, tunable, well validated, adaptable, and biologically interpretable. These principles guide how we evaluate our current proof of concept, and how we think about sharing our platform with future researchers.",
      ],
    },
{
      kind: "table",
      id: "implementation-strategy",
      heading: "Implementation strategy",
      intro: "Three ways to build the component that recognises the target, and what each would cost us.",
      columns: ["Format", "Strengths", "Weaknesses"],
      rows: [
        ["Small molecule", "Small molecule PROTACs are well studied. Cheap to produce.", "Higher likelihood of off-target effects. Could be cell permeable, leading to more possible binding targets. Difficult to generate without a lead chemical. Risk of instability in a variety of systems."],
        ["Antibody", "High degree of specificity. Using knob-into-hole technology could be easy to generalise for different targets. Proven efficacy in other systems.", "Expensive and time-consuming to produce. Higher possibility of failure in vitro."],
        ["Protein", "Relatively affordable. Protein designs are rapidly advancing in efficacy. High degree of specificity. Costs are declining rapidly.", "De novo protein design currently has a relatively small hit rate. Protein design tools are inaccessible to scientists without a background in protein engineering. Risk of aggregation."],
      ],
    },
{
      kind: "prose",
      body: [
        "We are currently developing a protein PROTAC system for our linker. After our discussion with [Dr. David Younger](stakeholder:younger), we realised the importance of developing our technology along with the field. As synthetic biology advances, the tools for protein design are advancing with it, and by the time we bring our technology to market it is quite possible that some of the current flaws of a protein system will have been solved. As more scientists adopt de novo protein design, libraries of untested candidate binders are also growing quickly. As these models are used and improved, we hope to fine tune the MMM complex binding domain, followed by a variable-length glycine chain, and ask researchers to test candidate binders already designed, tuning the length of the linker to maximise efficacy.",
      ],
    },
{
      kind: "prose",
      id: "implementation",
      heading: "Implementation",
      body: [
        "Taking in all of these parts and sources of feedback, we hope to deliver a final product that can be easily adopted for a wide variety of research interests, while being thoughtful about possible misuse. From our interview with [Dr. David Younger](stakeholder:younger), we realised that there are large databases of existing candidate binders for a wide variety of targets. Because of this, our protein linker system can be adapted to a new target without a researcher needing any de novo protein design software, although we need to guide scientists to the right resources, which is why we aim to include a guide to using candidate binders in our final product. Since reproducible results are foundational to science, we also aim to open source our results, giving scientists known working concentrations for our product. By giving scientists known use cases we can encourage them to use our technology while also advising them on experimental design. Integrating all of this with stakeholder feedback, the final product package would include the following.",
      ],
    },
{
      kind: "cards",
      items: [
        { title: "A linker aliquot", body: "An aliquot of our designed linker for SMO, to normalise degradation efficacy against." },
        { title: "An inhibitor aliquot", body: "An aliquot of our minibinder inhibitor for the MMM complex." },
        { title: "A binder-finding guide", body: "A guide to finding candidate or existing binders for a desired target." },
        { title: "A data pamphlet", body: "A pamphlet with the existing data for our system in our own use case." },
      ],
    },
{
      kind: "prose",
      section: "Responsible use",
      id: "responsible",
      heading: "Responsible platform development",
      body: [
        "Any exciting scientific advancement must also be used with the utmost responsibility. Tampering with the cilium could have unintended consequences throughout the body, or be used unethically. We aim to prevent unintended consequences by modelling off-target effects and by using custom technology such as de novo protein design to reach a high level of target specificity. We likewise aim to keep our protocols open source, so that other scientists can reach a high level of specificity for their own target of interest.",
        "The possibility that a target of interest could be detrimental to someone's health also deserves consideration. The cilium is responsible for far more than cancer: it is implicated in wound healing, phototransduction, mechanosensation, cardiovascular fibrosis, bone development, kidney health, and much more [1]. Just as our technology can bring the cilium into homeostasis, it can also be used to cause dysregulation. A complete understanding of the target mutation is a prerequisite for using our technology, along with transparency and informed consent among any clinical candidates that come from our platform.",
        "Further, the cilium is foundational to early developmental processes. While our technology opens the possibility of tuning ciliary receptors with a precision other therapeutics lack, using it to fine tune developmental biology raises a number of ethical alarm bells. Given that many of the conditions our tool could be adapted to treat are diagnosed before birth, and given the histories of developmental biology in eugenicist movements, we must stay critical of the technology we create. The most straightforward recommendation we often see is that such a technology should only be used as an intervention when the health of an individual could reasonably be compromised. But that leaves much to common notions of health and of the individual. The exclusionary box of traditional health often fails to recognise disability as anything but an avenue of suffering; we maintain that our technology is not, and will never be, a cure for developmental conditions, but a tool that can be used to develop treatments for life-threatening conditions. And the only individual typically discussed is the child; we maintain that more research is needed on the effects of ciliary signalling on the health of birthing mothers.",
        "Given this long list of concerns about our platform, a question arises: is it ethical to leave a technology this foundational open source? We hope a direct comparison can help.",
      ],
    },
{
      kind: "cards",
      id: "openness",
      heading: "How open should our platform be?",
      items: [
        {
          title: "Open source",
          body: "**For:** easy for scientists to adapt; builds trust with users; lowering barriers to access allows more widespread use by scientists. **Against:** once the technology is out of our hands we have no control over it, and open source projects typically struggle to get startup funding without guaranteed profit.",
        },
        {
          title: "Private and proprietary",
          body: "**For:** we hold whole responsibility over our technology, and can prevent misuse by requesting purposes and methods from clients. **Against:** some would argue we should not have sole authority over the use of a research platform; a lack of trust and transparency; and a higher barrier to entry for scientists.",
        },
      ],
    },
{
      kind: "prose",
      body: [
        "Given the advice we have received from a number of stakeholders on developing a research platform, we are choosing to keep much of our research open and available, while maintaining responsibility with guardrails for our technology.",
      ],
    },
...DELIVERABLES,
      {
        kind: "details",
        id: "references",
        section: "References",
        heading: "References",
        summary: "Fifty-one sources, listed by section. The [n] markers in the text point here.",
        blocks: [
{
      kind: "references",
      heading: "Project inspiration",
      for: "Background",
      items: [
        { n: "1", text: "J. Su et al., Cell–cell communication: new insights and clinical implications. Signal Transduct. Target. Ther. 9, 196 (2024).", href: "https://doi.org/10.1038/s41392-024-01888-z" },
        { n: "2", text: "A. M. Skoda et al., The role of the Hedgehog signaling pathway in cancer: a comprehensive review. Bosn. J. Basic Med. Sci. 18, 8–20 (2018).", href: "https://doi.org/10.17305/bjbms.2018.2756" },
        { n: "3", text: "J. Jing et al., Hedgehog signaling in tissue homeostasis, cancers and targeted therapies. Signal Transduct. Target. Ther. 8, 315 (2023).", href: "https://doi.org/10.1038/s41392-023-01559-5" },
        { n: "4", text: "C. Williams et al., Design principles of a membrane-spanning ubiquitin ligase. bioRxiv (2025).", href: "https://doi.org/10.1101/2025.09.11.675358" },
        { n: "5", text: "S. Liu et al., G protein-coupled receptors: a century of research and discovery. Circ. Res. 135, 174–197 (2024).", href: "https://doi.org/10.1161/CIRCRESAHA.124.323067" },
        { n: "6", text: "D. M. Rosenbaum, S. G. F. Rasmussen and B. K. Kobilka, The structure and function of G-protein-coupled receptors. Nature 459, 356–363 (2009).", href: "https://doi.org/10.1038/nature08144" },
        { n: "7", text: "N. F. Berbari et al., The primary cilium as a complex signaling center. Curr. Biol. 19, R526–R535 (2009).", href: "https://doi.org/10.1016/j.cub.2009.05.025" },
        { n: "8", text: "R. Buqaileh, L. A. Alshriem and W. AbouAlaiwi, Ciliary G-protein coupled receptor signaling in polycystic kidney disease. Int. J. Mol. Sci. 26, 4971 (2025).", href: "https://doi.org/10.3390/ijms26114971" },
        { n: "9", text: "K. Ford, D. McDonald and P. Mali, Functional genomics via CRISPR–Cas. J. Mol. Biol. 431, 48–65 (2019).", href: "https://doi.org/10.1016/j.jmb.2018.06.034" },
        { n: "10", text: "O. Shalem, N. E. Sanjana and F. Zhang, High-throughput functional genomics using CRISPR–Cas9. Nat. Rev. Genet. 16, 299–311 (2015).", href: "https://doi.org/10.1038/nrg3899" },
        { n: "11", text: "R. Ahmad, S. Wojciech and R. Jockers, Hunting for the function of orphan GPCRs: beyond the search for the endogenous ligand. Br. J. Pharmacol. 172, 3212–3228 (2015).", href: "https://doi.org/10.1111/bph.12942" },
      ],
    },
{
      kind: "references",
      heading: "Community need",
      for: "Community need",
      items: [
        { n: "1", text: "R. Pala, N. Alomari and S. M. Nauli, Primary cilium-dependent signaling mechanisms. Int. J. Mol. Sci. 18, 2272 (2017).", href: "https://doi.org/10.3390/ijms18112272" },
        { n: "2", text: "B. Li, Y.-Y. He and Z.-M. Yang, Primary cilia function as hubs for signal transduction. Cell Biosci. 15 (2025).", href: "https://doi.org/10.1186/s13578-025-01471-1" },
        { n: "3", text: "M. V. Nachury and D. U. Mick, Establishing and regulating the composition of cilia for signal transduction. Nat. Rev. Mol. Cell Biol. 20, 389–405 (2019).", href: "https://doi.org/10.1038/s41580-019-0116-4" },
        { n: "4", text: "K. C. Corbit et al., Vertebrate Smoothened functions at the primary cilium. Nature 437, 1018–1021 (2005).", href: "https://doi.org/10.1038/nature04117" },
        { n: "5", text: "D. Stamataki et al., A gradient of Gli activity mediates graded Sonic Hedgehog signaling in the neural tube. Genes Dev. 19, 626–641 (2005).", href: "https://doi.org/10.1101/gad.325905" },
        { n: "6", text: "M. R. Mahjoub, The importance of a single primary cilium. Organogenesis 9, 61–69 (2013).", href: "https://doi.org/10.4161/org.25144" },
        { n: "7", text: "E. D. Gigante et al., Hypomorphic Smo mutant with inefficient ciliary enrichment disrupts the highest level of vertebrate Hedgehog response. Dev. Biol. 437, 152–162 (2018).", href: "https://doi.org/10.1016/j.ydbio.2018.03.019" },
        { n: "8", text: "O. Shalem, N. E. Sanjana and F. Zhang, High-throughput functional genomics using CRISPR–Cas9. Nat. Rev. Genet. 16, 299–311 (2015).", href: "https://doi.org/10.1038/nrg3899" },
        { n: "9", text: "K. Ford, D. McDonald and P. Mali, Functional genomics via CRISPR–Cas. J. Mol. Biol. 431, 48–65 (2019).", href: "https://doi.org/10.1016/j.jmb.2018.06.034" },
        { n: "10", text: "Y. Li and L. Zhou, dCas9 techniques for transcriptional repression in mammalian cells: progress, applications and challenges. BioEssays 43 (2021).", href: "https://doi.org/10.1002/bies.202100086" },
        { n: "11", text: "R. C. Wilson and J. A. Doudna, Molecular mechanisms of RNA interference. Annu. Rev. Biophys. 42, 217–239 (2013).", href: "https://doi.org/10.1146/annurev-biophys-083012-130404" },
        { n: "12", text: "H. K. Hoffman and R. Prekeris, Roles of the actin cytoskeleton in ciliogenesis. J. Cell Sci. 135 (2022).", href: "https://doi.org/10.1242/jcs.259030" },
        { n: "13", text: "V. M. Wu et al., Small molecule inhibitors of Smoothened ciliary localization and ciliogenesis. Proc. Natl. Acad. Sci. USA 109, 13644–13649 (2012).", href: "https://doi.org/10.1073/pnas.1207170109" },
        { n: "14", text: "T. Natsume and M. T. Kanemaki, Conditional degrons for controlling protein expression at the protein level. Annu. Rev. Genet. 51, 83–102 (2017).", href: "https://doi.org/10.1146/annurev-genet-120116-024656" },
        { n: "15", text: "A. Kohso et al., Aurora-A promotes cell-cycle progression from quiescence through primary cilia disassembly. Cancer Sci. 116, 2763–2773 (2025).", href: "https://doi.org/10.1111/cas.70153" },
        { n: "16", text: "J. L. Wingfield, K.-F. Lechtreck and E. Lorentzen, Trafficking of ciliary membrane proteins by the intraflagellar transport/BBSome machinery. Essays Biochem. 62, 753–763 (2018).", href: "https://doi.org/10.1042/ebc20180030" },
        { n: "17", text: "G. M. Liew et al., The intraflagellar transport protein IFT27 promotes BBSome exit from cilia through the GTPase ARL6/BBS3. Dev. Cell 31, 265–278 (2014).", href: "https://doi.org/10.1016/j.devcel.2014.09.004" },
        { n: "18", text: "J. M. Tsai et al., Targeted protein degradation: from mechanisms to clinic. Nat. Rev. Mol. Cell Biol. 25, 740–757 (2024).", href: "https://doi.org/10.1038/s41580-024-00729-9" },
        { n: "19", text: "S. M. Banik et al., Lysosome-targeting chimaeras for degradation of extracellular proteins. Nature 584, 291–297 (2020).", href: "https://doi.org/10.1038/s41586-020-2545-9" },
        { n: "20", text: "S. R. Shinde, A. R. Nager and M. V. Nachury, Ubiquitin chains earmark GPCRs for BBSome-mediated removal from cilia. J. Cell Biol. 219 (2020).", href: "https://doi.org/10.1083/jcb.202003020" },
      ],
    },
{
      kind: "references",
      heading: "Market model",
      for: "Market",
      items: [
        { n: "1", text: "J. S. Lorente et al., GPCR drug discovery: new agents, targets and indications. Nat. Rev. Drug Discov. 24, 458–479 (2025).", href: "https://doi.org/10.1038/s41573-025-01139-y" },
        { n: "2", text: "D. Jenkins and P. L. Beales, Genes and mechanisms in human ciliopathies. In Emery and Rimoin's Principles and Practice of Medical Genetics (2013).", href: "https://doi.org/10.1016/b978-0-12-383834-6.00174-9" },
        { n: "3", text: "M. Saito, W. Otsu, K. Miyadera and Y. Nishimura, Recent advances in the understanding of cilia mechanisms and their applications as therapeutic targets. Front. Mol. Biosci. 10 (2023).", href: "https://doi.org/10.3389/fmolb.2023.1232188" },
        { n: "3.1", text: "C.-J. Liu et al., CiliaKB: a comprehensive knowledge base for cilia-associated genes. PLOS Biol. 24, e3003774 (2026).", href: "https://doi.org/10.1371/journal.pbio.3003774" },
        { n: "3.2", text: "National Library of Medicine, PubMed total records by publication year (2020).", href: "https://datadiscovery.nlm.nih.gov/Information-Management/PubMed-total-records-by-publication-year/eds5-ig9r/about_data" },
        { n: "3.3", text: "National Institute of General Medical Sciences, Technology Development Programs (2026).", href: "https://www.nigms.nih.gov/grants/Pages/Technology-Development-Programs" },
        { n: "3.4", text: "NIH RePORT, Estimates of funding for various research, condition, and disease categories (2026).", href: "https://report.nih.gov/funding/categorical-spending#/" },
        { n: "4", text: "Mordor Intelligence, CRISPR technology market size and share analysis, 2025 to 2030 (2025).", href: "https://www.mordorintelligence.com/industry-reports/crispr-technology-market" },
        { n: "5", text: "Grand View Horizon, Global gene silencing market size and outlook, 2026 to 2033 (2025).", href: "https://www.grandviewresearch.com/horizon/outlook/gene-silencing-market/united-states" },
        { n: "6", text: "Mordor Intelligence, Small molecule drug discovery market size and share analysis, 2026 to 2031 (2026).", href: "https://www.mordorintelligence.com/industry-reports/small-molecule-drug-discovery-market" },
        { n: "7", text: "Market.us, Targeted protein degradation market size and share (2026).", href: "https://market.us/report/targeted-protein-degradation-market/" },
        { n: "8", text: "Fortune Business Insights, Research antibodies market size and share, industry report to 2034 (2026).", href: "https://www.fortunebusinessinsights.com/research-antibodies-market-116028" },
        { n: "9", text: "C. Jones, Reflections and looking ahead. Addgene blog (2025).", href: "https://blog.addgene.org/reflections-and-looking-ahead-2025" },
      ],
    },
{
      kind: "references",
      heading: "Designing for adoption",
      for: "Adoption",
      items: [
        { n: "1", text: "V. Reddy Palicharla and S. Mukhopadhyay, Molecular and structural perspectives on protein trafficking to the primary cilium membrane. Biochem. Soc. Trans. 52, 1473–1487 (2024).", href: "https://doi.org/10.1042/bst20231403" },
        { n: "2", text: "K. I. Hilgendorf, C. T. Johnson and P. K. Jackson, The primary cilium as a cellular receiver: organizing ciliary GPCR signaling. Curr. Opin. Cell Biol. 39, 84–92 (2016).", href: "https://doi.org/10.1016/j.ceb.2016.02.008" },
        { n: "3", text: "S. C. Goetz and K. V. Anderson, The primary cilium: a signalling centre during vertebrate development. Nat. Rev. Genet. 11, 331–344 (2010).", href: "https://doi.org/10.1038/nrg2774" },
        { n: "4", text: "E. K. Ho and T. Stearns, Hedgehog signaling and the primary cilium: implications for spatial and temporal constraints on signaling. Development 148 (2021).", href: "https://doi.org/10.1242/dev.195552" },
        { n: "5", text: "P. Mill, S. T. Christensen and L. B. Pedersen, Primary cilia as dynamic and diverse signalling hubs in development and disease. Nat. Rev. Genet. 24, 421–441 (2023).", href: "https://doi.org/10.1038/s41576-023-00587-9" },
        { n: "6", text: "S. R. Shinde, A. R. Nager and M. V. Nachury, Ubiquitin chains earmark GPCRs for BBSome-mediated removal from cilia. J. Cell Biol. 219 (2020).", href: "https://doi.org/10.1083/jcb.202003020" },
      ],
    },
{
      kind: "references",
      heading: "Responsible platform development",
      for: "Responsible use",
      items: [
        { n: "1", text: "R. Pala, N. Alomari and S. M. Nauli, Primary cilium-dependent signaling mechanisms. Int. J. Mol. Sci. 18, 2272 (2017).", href: "https://doi.org/10.3390/ijms18112272" },
      ],
    },
        ],
      },
  ],
};

const education: Page = {
  slug: "/education",
  title: "Sharing the Garden",
  kicker: "chapter 09 · education",
  medal: true,
  storyBeat: "The best part of a garden is showing someone else around it.",
  intro:
    "We built our outreach around one idea: synthetic biology should be engaging, accessible, fun for kids, fun for the elderly, and inspiring. Here is what that looked like.",
  blocks: [
    {
      kind: "pillars",
      id: "programme",
      heading: "What we built, and the gap each one fills",
      intro:
        "Nine activities, grouped under those qualities, with fun for kids and fun for the elderly sharing one bed.",
      pillars: [
        {
          word: "engaging",
          activities: [
            {
              name: "SynBio Hotline",
              audience: "anyone with a question, online",
              why: "Synthetic biology has not been well understood and the field often feels out of reach for a general audience, possibly due to a lack of familiarity with the phrase in popular media, confusion surrounding what SynBio is, or hesitation to jump into a new, unknown field of study. Most people do not have a scientist in their life.",
              what: "An interactive, judgement free space where anyone could ask anything about synbio and get a detailed answer and explanation. People emailed in their questions relating to synbio, the team researched them and responded with short form content, with the platform chosen to lower barriers to access and meet audiences where they were.",
            },
            {
              name: "Trivia Tabling",
              audience: "high school and college students",
              why: "Students learn fundamental concepts of each science subject in school but often have fewer chances to explore the real world applications of science.",
              what: "An interactive trivia challenge hosted at club fairs. Participants spun a wheel to choose a trivia category. Four categories, Sustainable Synthetic Biology, (Bio)Ethics/Policy, Synthetic Biology Techniques, and Famous Scientists, covered everything from lab procedures to ethical considerations, representing the considerations made across all iGEM subteams. A fifth wild card category, Washington iGEM, covered the design principles behind the team's past projects. The ethics section used open ended questions to open dialogue about public perceptions of synbio.",
            },
          ],
        },
        {
          word: "accessible",
          activities: [
            {
              name: "Can You Beat DNA Polymerase",
              audience: "school students, plus their parents and teachers",
              why: "People of all ages and backgrounds are familiar with the term DNA and with it being the blueprint of life, but public understanding largely stops there.",
              what: "Students acted as DNA polymerase, attaching corresponding base pairs to a given template strand using the basis of widely recognised stacking toys, racing another player to build a complementary strand. Run at the University of Washington's Engineering Discovery Days, where the activity was adapted on the fly: errors were used to discuss mutations, and older participants used Uracil instead of Thymine so they acted as RNA polymerase instead. After educators and parents asked to reproduce it, the team made a pamphlet or handbook on how to recreate the activity, using universal design principles, written and visual instructions for constructing each station, and colorblind friendly graphics.",
              numbers:
                "Run at Engineering Discovery Days, a free two-day campus festival that invited over 12,000 students in years 4 to 8, with their parents and teachers, from across Washington State. The take-home kit costs under five dollars a set.",
            },
            {
              name: "How to Read Scientific Papers (Video Series)",
              audience: "students meeting research papers for the first time",
              why: "Science is often inaccessible due to jargon filled literature and institutional paywalls, and undergraduate students often struggle with getting started on reading scientific literature.",
              what: "A tutorial series on how to read research papers, built as recorded interviews with first authors of academic publications: Dr. Swati Mishra of UW Medicine, UT Austin grad students Kangsan Kim and Clay Kosonocky, and postdoc Dr. Nikol Kaderabkova. Short associated worksheets were provided for educators to distribute to students.",
            },
          ],
        },
        {
          word: "fun for all ages",
          activities: [
            {
              name: "A SynBio Whodunnit!",
              audience: "younger students",
              why: "Most education events targeted at a younger audience give little detail into the given field and opt to focus on the scientific method, which leaves many children lacking a sense of what science actually looks like.",
              what: "A murder mystery activity taking inspiration from the board game CLUE, giving a high level overview of basic laboratory techniques in three parts. Determine who committed the crime: students extracted DNA from a strawberry sample, a visual demonstration of the basics of genomics. Determine where the crime was done: students used pH strips on samples taken in different rooms to learn how different chemicals have unique properties like acidity. Determine the poison used: students performed paper chromatography with paper towels and food dyes to see a visual representation of polarity in action. The team also created a document outlining the procedure so the activity stays open source and easy to adopt.",
            },
            {
              name: "Build a Baselet",
              audience: "any age, with a harder version for older students",
              why: "The central dogma is the foundation of biology and advanced science builds on it, yet it is often not fully understood. Many younger students struggle to comprehend how DNA, RNA and proteins work together and find it difficult to visualize the microscopic processes.",
              what: "A hands on bracelet building kit introducing the central dogma. Each kit contains 12 colored beads, 2 charms, string, and a detailed handbook. Students string 6 colored beads, each color a different nitrogenous base, then string 6 complementary beads using RNA base pairing rules. The RNA is split into groups of 3 to model codons, and students use the handbook's amino acid chart to work out which amino acids their RNA codes for, each represented by a charm, so they add a miniature protein to the bracelet. For students who already understand the central dogma, the handbook provides mutations they can experiment with on their bracelet.",
            },
            {
              name: "SYNBIngO",
              audience: "older adults",
              why: "Most education efforts are directed to younger age ranges, which leaves the elderly and most adults disconnected from the sciences, and in America today academics and the life sciences have only grown farther away from the general public. People are also more likely to trust and stick to a treatment when they understand what it is doing in their body.",
              what: "An education event geared towards the elderly: a presentation on how synthetic biology impacts their lives by outlining how many common medications work, paired with bingo boards and a prize for the first BINGO to help with attention. The event closed with discussion prompts to foster open dialogue, asking participants to question the sciences and how involved they are in their lives, and inviting both the anxieties and the excitements they have about the future of synthetic biology.",
            },
          ],
        },
        {
          word: "inspiring",
          activities: [
            {
              name: "Conversations in Synthetic Biology",
              audience: "students new to the field",
              why: "SynBio is not included in a typical K-12 curriculum and most extracurricular resources contain extremely technical language, so the field remains relatively unfamiliar and daunting to many students.",
              what: "A welcome week panel event. Speakers opened with an introduction of their career journey, followed by a guided Q&A led by iGEM members, after which students asked their own questions and participated in conversations with the panelists. The objectives were to showcase the many disciplines SynBio intersects with and to give students the opportunity to interact with professionals in the field, keeping the information easy to understand for students at different familiarity levels.",
            },
            {
              name: "Scientists You Might Not Know",
              audience: "middle and high school students",
              why: "When we hear about major scientific accomplishments we often hear the same few names, yet many discoveries we take for granted are already integrated into everyday science, among wet lab protocols, new therapeutics, or medical practices, without us knowing the people behind these innovations.",
              what: "A set of profiles highlighting scientists whose work changed medicine and biotechnology even though their names do not always appear in textbooks, showing that progress can come from asking an unexpected question, challenging what people thought was possible, or continuing to investigate when others might have stopped.",
            },
          ],
        },
      ],
      source: "Education and Outreach draft, 2026.",
    },
    {
      kind: "prose",
      id: "alchemy",
      heading: "iGEM Alchemy, the game",
      body: [
        "Four atoms on a workbench. Drag one onto another and they combine: hydrogen and oxygen make a hydroxyl group, a carboxyl group, an amine group and a side chain make an amino acid, two amino acids make a protein. Four levels take a player from those atoms to DNA and RNA, to a working animal cell, and finally to a plasmid carrying a jellyfish gene that makes cells glow. Every new thing comes with a one-line explanation, and an encyclopedia keeps everything found.",
        "[Play iGEM Alchemy](/alchemy). It runs in the browser, on a phone or a laptop, and saves progress on the device.",
      ],
    },
    {
      kind: "prose",
      heading: "And this website",
      body: [
        "The garden you are reading is part of the outreach, not decoration around it. The **Playground** is a small space where anyone can walk the hedgehog around and plant flowers, which is exactly the audience that will not sit through a paragraph about ubiquitin ligases.",
      ],
    },
  ],
};

const safety: Page = {
  slug: "/safety-and-security",
  title: "Tending Safely",
  kicker: "chapter 13 · safety",
  storyBeat: "Gloves on. Some things in a garden bite.",
  intro:
    "This page is not finished. It records what we can state now, and the rest follows once the iGEM safety form is done.",
  blocks: [
    {
      kind: "facts",
      heading: "What we can state now",
      items: [
        {
          title: "Where we work",
          body: "Cloning in E. coli plasmids, and mammalian cell culture in NIH/3T3 and HEK293T lines. Work is done in the advising lab under its existing protocols.",
        },
        {
          title: "Reagents",
          body: "Any hazardous reagents come through the advising lab under its protocols, rather than being bought on a student grant.",
        },
        {
          title: "The honest state",
          body: "There is no biosafety document written yet. The exact biosafety level and a dual-use statement will be set out here once the safety form is done.",
        },
      ],
    },
  ],
};

/* ===================================================================== *
 * ATTRIBUTIONS
 * ===================================================================== */

const attributions: Page = {
  slug: "/attributions",
  title: "Who Helped Us Dig",
  kicker: "chapter 12 · attributions",
  storyBeat: "None of this was one hedgehog.",
  intro: "What we did ourselves, and what we had help with.",
  blocks: [
    {
      kind: "cards",
      heading: "Advisors and mentors",
      items: [
        {
          title: "Dr. Frank DiMaio",
          body: "Protein design mentor at the Institute for Protein Design. Set the tool choices, the filter metrics, and the target-selection rules, and gave us a seat on the DIGS cluster.",
        },
        {
          title: "Dr. Jennifer Kong",
          body: "Wet lab advisor. The MMM complex comes from her lab, and she guides the biology and supplies reagents.",
        },
        {
          title: "Dr. Claudia Vasquez",
          body: "Wet lab advisor. Feasibility review and experimental design.",
        },
        {
          title: "Dr. Herbert Sauro",
          body: "Systems biology advisor. Reshaped the kinetic modelling into a model-selection approach.",
        },
        {
          title: "Dr. Stacey Ogden",
          body: "Hedgehog signalling researcher at St. Jude. Gave us the disease picture and the honest limits of the approach.",
        },
        {
          title: "Adam Chazin-Gray",
          body: "PhD student at the Institute for Protein Design who mentored hands-on lab work.",
        },
      ],
    },
    {
      kind: "cards",
      heading: "Support and sponsors",
      items: [
        {
          title: "Institute for Protein Design",
          body: "Lab space, mentorship, and funding.",
        },
        {
          title: "Biochemistry Department",
          body: "Recurring annual support and the lab that hosts us.",
        },
        {
          title: "Student Technology Fee",
          body: "Funds the Hyak compute we run the design pipeline on.",
        },
        { title: "Biology and Microbiology", body: "Departmental support." },
        {
          title: "Reagent grants",
          body: "DNA and reagents in kind from Twist Bioscience, IDT, GenScript, NEB, and Zymo.",
        },
        {
          title: "Research Computing Club",
          body: "Access to the Hyak cluster.",
        },
      ],
    },
    {
      kind: "cards",
      heading: "Software we did not write",
      items: [
        { title: "RFdiffusion3", body: "Backbone generation." },
        { title: "ProteinMPNN", body: "Sequence design." },
        { title: "RoseTTAFold3", body: "Forward folding to check designs." },
        {
          title: "BindCraft",
          body: "The second, more stringent design track.",
        },
        {
          title: "Rosetta and PyMOL",
          body: "Interface scoring and structural inspection.",
        },
        { title: "Tellurium and SciPy", body: "Modelling the ODE system." },
      ],
    },
  ],
};

/* ===================================================================== *
 * PAGES THE ARCHITECTURE ASKS FOR THAT ARE NOT WRITTEN YET
 *
 * Each one is a real page with a real address, so the nav is the agreed
 * architecture from the first day rather than growing into it. Each says what
 * belongs on it. Delete the `todo` block as the content arrives.
 * ===================================================================== */

const implementation: Page = {
  slug: "/implementation",
  title: "Out of the Greenhouse",
  kicker: "chapter 04 · proposed implementation",
  storyBeat: "A seedling is not a garden. Who plants this, and where?",
  intro:
    "Who would use this tool outside our lab, how it would reach them, and what has to be true first.",
  blocks: [
    {
      kind: "prose",
      heading: "Who this is for",
      body: [
        "Our Human Practices work points at cilia labs that want to raise or lower one receptor in the primary cilium, not at patients. [Six kinds of researcher](/human-practices#who-would-use-this) told us what each would need before trusting a tool like this. Those needs became our [design requirements](/human-practices#design-requirements), and the [implementation strategy](/human-practices#implementation-strategy) compares the small molecule, antibody and protein routes to the component that recognises the target. What a lab would actually receive is set out in the [final package](/human-practices#implementation), and how it would get there in the [to-market strategy](/human-practices#to-market).",
        "The tools below are the same ones on the Human Practices page: a way to decide whether the platform fits a project, the workflow for using it, the flyer we hand out, and where this goes next.",
      ],
    },
    ...DELIVERABLES,
  ],
};

const parts: Page = {
  slug: "/parts",
  title: "Seeds We Logged",
  kicker: "chapter 06 · parts and registry",
  storyBeat:
    "Every seed saved and labelled, so the next gardener can plant it.",
  intro: "The parts we designed, built and submitted to the iGEM Registry.",
  blocks: [
    {
      kind: "todo",
      body: [
        "Not written yet. What belongs here:",
        "Each part: its registry number, what it is, and the sequence.",
        "Which are basic parts and which are composite.",
        "The characterisation data for each one, and a link to the experiment it came from.",
        "Which parts we improved rather than made, and what the improvement was.",
      ],
    },
  ],
};

const contribution: Page = {
  slug: "/contribution",
  title: "What We Leave Behind",
  kicker: "chapter 10 · contribution",
  medal: true,
  storyBeat: "The part of the garden that is for whoever comes next.",
  intro: "The documented thing a future team gets to start from.",
  blocks: [
    {
      kind: "todo",
      body: [
        "Not written yet, and this one is a medal page, so it needs to be specific.",
        "The contribution itself: the part, the data, the method or the documentation another team can pick up.",
        "Why it is useful to someone who is not us, with the evidence that it works.",
        "Where it lives, so it can be found: registry entry, repository, or protocol.",
      ],
    },
  ],
};

const judging: Page = {
  slug: "/judging",
  title: "The Checklist",
  kicker: "chapter 11 · judging",
  storyBeat: "Everything we claim, and where on this wiki to check it.",
  intro:
    "Where each medal criterion is evidenced, so nothing has to be hunted for.",
  blocks: [
    {
      kind: "todo",
      body: [
        "Not written yet. What belongs here:",
        "One row per medal criterion we are claiming, each with a link straight to the page and section that evidences it.",
        "The safety and security form, the attributions, and the deliverables, each ticked off or honestly marked as outstanding.",
        "Cross-check against the official 2026 requirements before the wiki freeze.",
      ],
    },
  ],
};

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
];

export function pageBySlug(slug: string): Page | undefined {
  return PAGES.find((p) => p.slug === slug);
}

/** Previous/next page in reading order, for the "keep walking" footer link. */
export function pageNeighbours(slug: string): { prev?: Page; next?: Page } {
  const i = PAGES.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: PAGES[i - 1], next: PAGES[i + 1] };
}
