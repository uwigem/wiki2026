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
import type { VideoItem } from "../components/VideoRow";
import type { GalleryImage } from "../components/Gallery";
import type { LinkItem } from "../components/LinkCards";
import type { TreeNode } from "../components/DecisionTree";
import type { MembraneProtein } from "../components/MembraneLandscape";
import type { WorkflowStage } from "../components/Workflow";
import type { PipelineStage } from "../components/Pipeline";
import type { TrailStep } from "../components/PartTrail";
import type { RecipePart } from "../components/RecipeStrip";
import type { PersonaKey } from "../components/gardenArt";
import { SMO_5L7D, type Structure } from "./structures";
import {
  RECRUITMENT_CONSTRUCTS,
  SCREENING_CONSTRUCTS,
  type ConstructGroup,
} from "./constructs";
import type { ProcedureGroup } from "../components/Procedure";
import { ADVISORS, INSPIRATION, SOFTWARE, SPONSORS, STUDENTS } from "./attributions";
import type { CreditSet } from "../components/AttributionGroups";
import type { FlowerKind, Profile } from "./team";

/**
 * Anything with an `id` can be linked to from anywhere else in the wiki, with
 * `[label](/model#that-id)`. Ids are kebab-case and have to be unique
 * within their page. Add one the moment a section is worth pointing at.
 */
export interface Anchored {
  id?: string;
  /**
   * What the left-hand outline calls this block, when that should be shorter
   * or plainer than the heading printed on the page. The outline is a list to
   * scan, so it wants a noun ("Market Estimate"); the page is being read, so
   * it can keep the team's own voice ("Estimating the Market for Ciliary
   * Tools"). Without this the outline just uses the heading.
   */
  navLabel?: string;
  /**
   * This block starts a named section of the page. A page with three or
   * more sections is laid out as one signboard and card per section, with a
   * list of the sections in the left margin (a corner button on a phone).
   */
  section?: string;
}

export interface CardItem {
  title: string;
  /** One paragraph, or several when the card makes more than one point. */
  body: string | string[];
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
        /** Its place in a sequence, when a run of these is one procedure. */
        step?: number;
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
    /**
     * The MMM complex drawn at the molecular level, with a button per arm:
     * the linker that drags the complex onto a chosen receptor, and the
     * minibinder that takes the complex apart.
     */
    | { kind: "mechanism" }
    /** A figure, or the marked hole where one is going. */
    | {
        kind: "figure";
        src?: string;
        /** A phone edition of the same figure, where the package ships one. */
        srcMobile?: string;
        alt?: string;
        caption: string;
        owner?: string;
        ratio?: "wide" | "square" | "tall";
        /**
         * This figure plots made-up numbers: it shows what a result would look
         * like, not one we measured. Marks the figure on the page, so nobody
         * skimming mistakes it for data.
         */
        hypothetical?: true;
        source?: string;
      }
    /** A bench procedure: numbered steps, in groups with subheadings. */
    | {
        kind: "procedure";
        heading?: string;
        intro?: string;
        groups: ProcedureGroup[];
        source?: string;
      }
    /** Genetic constructs, as rows of labelled domains. */
    | {
        kind: "constructs";
        heading?: string;
        intro?: string;
        groups: ConstructGroup[];
        footnote?: string;
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
    /** Short videos, shown as a still with a play button until one is clicked. */
    | { kind: "video"; heading?: string; intro?: string; videos: VideoItem[]; source?: string }
    /**
     * A document read in the page: the browser's own PDF viewer, with the file
     * also one click from a new tab or a download. For work that exists as a
     * finished PDF, such as the wet lab's protocols, rather than as copy.
     */
    | { kind: "pdf"; file: string; title: string; pages?: number }
    /** A few photographs side by side. */
    | { kind: "gallery"; heading?: string; intro?: string; images: GalleryImage[]; source?: string }
    /** Things to open or download: handbooks, posts, documents. */
    | { kind: "links"; heading?: string; intro?: string; items: LinkItem[]; source?: string }
    /** A visible "not written yet" marker. */
    /** One combination from iGEM Alchemy, with the game's own pictures. */
    | {
        kind: "recipe";
        heading?: string;
        intro?: string;
        inputs: RecipePart[];
        makes: RecipePart;
        action?: { label: string; to: string };
        source?: string;
      }
    /** The hedgehog imagining an experiment, on a page with no data yet. */
    | { kind: "resultsSoon"; note: string; caption?: string }
    /** Where the reader is in a page told in numbered parts. */
    | { kind: "trail"; steps: TrailStep[]; current: number }
    /** A chain of stages read downwards, each naming what it takes and returns. */
    | {
        kind: "pipeline";
        heading?: string;
        intro?: string;
        stages: PipelineStage[];
        source?: string;
      }
    /** A group of people, a pixel character each; a card opens what that person did. */
    | {
        kind: "people";
        heading: string;
        blurb?: string;
        flower: FlowerKind;
        people: Profile[];
        /** Only names on the tiles; the opened card gives each person's post and role. */
        nameOnly?: boolean;
      }
    /** Organisations and software in labelled sets, a logo each; a card opens what it gave us. */
    | {
        kind: "credits";
        heading: string;
        blurb?: string;
        flower: FlowerKind;
        sets: CreditSet[];
      }
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
  /** The guide's narration for this stop in the garden. Pages may skip it. */
  storyBeat?: string;
  /** Lede paragraph, rendered large under the title. */
  intro?: string;
  /**
   * A quiet line under the lede, for a caveat that has to be on the page but
   * must not be the first thing read: "these are proposed methods, not work
   * that has been done". A `callout` says the same thing far too loudly.
   */
  note?: string;
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
        "How much SMO sits in that cilium is not fixed. A transmembrane complex called **MMM**, made of **MEGF8, MOSMO and MGRN1**, tags SMO for degradation and clears it out. MEGF8 brings the complex to its target, MGRN1 ubiquitinates the target to tag it for degradation, and MOSMO is needed for complex stability.",
        "We build a device out of two modular parts, a **disruptor protein** and an **inducible linker**, that borrows this natural machinery to raise or lower how much of a receptor stays in the cilium.",
      ],
    },
    { kind: "mechanism", id: "mechanism" },
    {
      kind: "cards",
      id: "two-arms",
      heading: "Two arms, opposite directions",
      intro:
        "Both arms are engineered, both are genetically encodable, and they push the same pathway in opposite directions.",
      items: [
        {
          title: "Down arm",
          body: "An **inducible linker** forces **the MMM complex** onto a chosen receptor. That receptor now gets tagged and cleared, so signalling through it goes down. We test this by recruiting MGRN1 to GPR161, a receptor MMM does not normally touch.",
        },
        {
          title: "Up arm",
          body: "A **de novo minibinder** pries apart the MEGF8 and MOSMO interface. [How we design one](/engineering#pipeline). The MMM complex can no longer assemble, so it stops clearing the targeted receptor. Doing this prevents over degradation and allows us a new vector to tune ciliary abundance.",
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
        "Interview with Dr. Ning Zheng (UW Pharmacology).",
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
      "Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358).",
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
        body: "Keep a design only if it clears the **2 by 2 filter**: a **minPAE under 2** and a **backbone RMSD under 2 Angstrom** between the shape we asked for and the shape the sequence actually folds into. Both cutoffs are the published gold standard, and Dr. DiMaio told us minPAE is the single best predictor of a real binder. [What each number means](/contribution#metrics).",
      },
      {
        title: "Score the interface",
        body: "Survivors get **pLDDT** for per-residue confidence, where we treat 80 as satisfactory, and **ddG** as a computational stand-in for binding strength, where we want a negative number. **PyRosetta InterfaceAnalyzer** adds buried surface area, unsatisfied hydrogen bonds and shape complementarity, and **PyMOL** is used to look at each one by hand.",
      },
    ],
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
      "Principles of Minibinder Design (beta-strand method, Nat Commun 2025 s41467-025-67866-3).",
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
  },
];

/**
 * The three parts of the Engineering page, in order. Each part opens with this
 * list and its own index, so a reader who has scrolled past the signboard can
 * still see which part they are in and jump to another.
 */
const ENGINEERING_PARTS: TrailStep[] = [
  { label: "Kinetics modelling", to: "/engineering#kinetics" },
  { label: "Protein modelling", to: "/engineering#protein-modelling" },
  { label: "Wet lab", to: "/engineering#wet-lab" },
];

const engineering: Page = {
  slug: "/engineering",
  title: "Build, Test, Learn",
  kicker: "chapter 03 · engineering",
  medal: true,
  storyBeat:
    "Nothing in a garden works the first time. You plant, you watch, you move it two feet to the left.",
  intro:
    "Three subteams ran the same loop, one after the other: the kinetic model first, then the designed binder, then the bench. These are those cycles in the order we actually ran them, including the parts that did not work the first time.",
  blocks: [
    {
      kind: "cards",
      id: "three-parts",
      heading: "Three parts, in the order they happened",
      intro:
        "Each subteam ran its own design, build, test, learn loop, and each one handed the next something to work with.",
      items: [
        {
          title: "Part 1: Kinetics modelling",
          body: "Turning the Hedgehog pathway into equations we can run, and finding out which rates actually move the answer. [Go to Part 1](/engineering#kinetics)",
        },
        {
          title: "Part 2: Protein modelling",
          body: "Generating thousands of candidate binders, then learning to throw almost all of them away. [Go to Part 2](/engineering#protein-modelling)",
        },
        {
          title: "Part 3: Wet lab",
          body: "Building the constructs the biology allows, and testing whether the cilium responds. [Go to Part 3](/engineering#wet-lab)",
        },
      ],
    },
    {
      kind: "cycles",
      id: "choosing",
      heading: "Before the three parts: choosing the project",
      intro:
        "One whole-team cycle came first, and it is the reason there is a project to run cycles on.",
      cycles: [
        {
          heading: "Choosing the target: How the project became the project",
          intro: "This cycle is complete.",
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
      ],
    },
    {
      kind: "trail",
      section: "Part 1: Kinetics modelling",
      id: "kinetics",
      steps: ENGINEERING_PARTS,
      current: 0,
    },
    {
      kind: "prose",
      heading: "Where the modelling fits",
      body: [
        "The project starts as arithmetic. Before any protein is designed, the modelling subteam has to show that acting on the MMM complex could move **SMO in the cilium** by a useful amount, and that the rates in the literature support it. [The model](/model) is where that work is written up; this is the loop that produced it.",
      ],
    },
    {
      kind: "cycles",
      cycles: [
        {
          heading: "Kinetics modelling: From a pathway diagram to equations",
          intro:
            "In progress. Each pass narrows the model toward the least complicated form that still answers the question.",
          items: [
            {
              title: "Design",
              body: "We begin by defining the problem through a large-scale literature review of the Hedgehog signalling system, with the goal of mapping points of interest and molecular targets. This includes scouring databases and resources for every interaction with our target, **Smoothened (SMO)**. Once a large list of targets was identified we eliminated them on relative necessity and availability of data, ultimately forming a preliminary, shared **parameter database**. From there we can develop early reaction maps of the system.",
            },
            {
              title: "Build",
              body: "During the build stage the literature review moves beyond parameters as the focus shifts to writing equations. To understand the reactions in detail we identify the predominant reaction mechanics and search for similar applications in the literature. Reaction maps are then converted into mathematical relationships for implementation in Python's **Tellurium** library.",
            },
            {
              title: "Test",
              body: "Once converted into **Antimony** for roadrunner compatibility, we adjust the equations and adapt parameters until a functional output based on real data is confirmed. Sensitivity analysis and parameter sweeps help identify the relative importance of each model component.",
            },
            {
              title: "Learn",
              body: "By reviewing the outputs of sensitivity analysis, parameter sweeps and model selection tools, we clear away gaps in knowledge and stand-in values, and set the direction for future adaptations: the most informative yet least complex form, an ideal model. One of the gaps the model closed before the bench was the dimeriser: our first choice, rapamycin, would also have inhibited mTORC1 and confounded the result. [See the wet lab cycles](/engineering#wet-lab-cycles).",
            },
          ],
        },
      ],
    },
    {
      kind: "trail",
      section: "Part 2: Protein modelling",
      id: "protein-modelling",
      steps: ENGINEERING_PARTS,
      current: 1,
    },
    {
      kind: "prose",
      heading: "Where the design work fits",
      body: [
        "With a target worth acting on, the second loop is the binder itself. Generate candidates, throw almost all of them away, and work out why the survivors survived. The pipeline below is the machinery; the cycles after it are what we learned by running it. The general version, written so another team can run it, is on [contribution](/contribution#pipeline).",
      ],
    },
    ...designBlocks,
    {
      kind: "cycles",
      id: "cycles",
      heading: "What running the pipeline taught us",
      cycles: [
        {
          heading: "Cycle 1: Generating binders",
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
          heading: "Cycle 2: Learning to throw designs away",
          intro:
            "Complete, and the cycle we learned the most from. Our first filter was passing designs that could never work.",
          items: [
            {
              title: "Design",
              body: "With several thousand candidates we needed a cutoff. We took the two published gold standards: backbone **RMSD under 2 Angstrom** between the shape we asked for and the shape we got, and **minPAE under 2**. We call it the 2 by 2 filter, and [the metrics table](/contribution#metrics) defines both.",
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
          heading: "Cycle 3: Rescuing the near misses",
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
              body: "Too early for a rescue rate, but one cost is already clear. Redesigning sequences onto backbones that already passed means more of the final set comes from the **same few backbone shapes**, so the plate is less diverse than the count suggests. The survivors become the plate the bench screens in [Experiment 2](/experiments#exp2-design), and the hits go on to purified testing in [Experiment 4](/experiments#exp4-design).",
            },
          ],
        },
      ],
    },
    {
      kind: "prose",
      heading: "Two changes of direction",
      body: [
        "The first real change came before any protein was made. We began aiming at ATRN, then switched to the **MMM complex** once it was clear MMM had cryo-EM and an accessible interface while ATRN only had an AlphaFold model. Better data to design against was worth the switch.",
        "A second problem showed up in the pipeline itself. RoseTTAFold3 could not fold our targets well because the sequence databases were thin, so the designs were failing the fold check for the wrong reason. We fixed it by **templating MOSMO and MEGF8** during forward folding. We now have about 24 MOSMO binder backbones through sequence design. [The pipeline](/engineering#pipeline) above has every step.",
      ],
    },
    {
      kind: "trail",
      section: "Part 3: Wet lab",
      id: "wet-lab",
      steps: ENGINEERING_PARTS,
      current: 2,
    },
    {
      kind: "prose",
      heading: "Where the bench work fits",
      body: [
        "The third loop is the one that decides whether any of the first two were right. It is the least far along, because it starts once there are constructs to put into cells, and none of the assays have run yet. What it has done so far is turn the other two loops into a gene design and an experiment plan. The kinetic modelling subteam told us which dimeriser to avoid, which rates to measure, and how to measure them. The protein modelling subteam told us which part of the target a binder can reach, and how many designs we had to work with. The assays themselves, with their controls, are on [experiments](/experiments).",
      ],
    },
    {
      kind: "cycles",
      id: "wet-lab-cycles",
      heading: "How the models shaped the wet lab",
      intro:
        "Each cycle below follows one hand-off, from the model, to the construct, to the experiment.",
      cycles: [
        {
          heading: "Cycle 1: Choosing the dimeriser",
          intro:
            "Complete. The kinetic modelling subteam caught a problem with our first dimeriser before any construct was ordered.",
          items: [
            {
              title: "Design",
              body: "The [down arm](/description#two-arms) rests on one question: can **MGRN1** ubiquitinate **SMO**, and lower it, if it is forced next to it? Targeted degraders only work when the E3 ligase they recruit can productively ubiquitinate the particular target, and a ligase that binds is not guaranteed to do that. So we planned to fuse SMO to **FKBP12** and MGRN1 to **FRB**, and add a dimeriser to pull them together. If SMO falls, MGRN1 is a candidate E3 for a SMO-targeting degrader. The dimeriser we planned to use first was rapamycin.",
            },
            {
              title: "Build",
              body: "The kinetic modelling subteam took the system into the [kinetic model](/model): rapamycin bridging FKBP12 and FRB to bring SMO and MGRN1 together, alongside the cell's own FKBP12 and mTOR as competing binders for the same rapamycin. They then read our draft protocol against the literature.",
            },
            {
              title: "Test",
              body: "**FRB is the rapamycin-binding domain of mTOR**, so native FKBP12 and mTOR would compete for the rapamycin we added, and rapamycin would inhibit **mTORC1**. Any fall in SMO could then be an mTOR side effect and not MGRN1 degrading SMO. That is a problem we would otherwise have met at the bench, with a result we could not interpret. Thanks to the kinetic modelling subteam, we met it on paper.",
            },
            {
              title: "Learn",
              body: "The fix changed the gene design, not just the reagent. We moved to **AP21967** with an engineered **FRB(T2098L)** domain, designed so that AP21967 binds the engineered domain and not native mTOR. That put SMO on the FRB(T2098L) side (DmrC) and MGRN1 on its partner domain (DmrA), and it set the recruitment constructs we ordered from GenScript. A catalytically inactive MGRN1 and a DmrA-mCherry proximity-only control sit beside the wild-type pair. Lowering the risk is not removing it, so a dimeriser-only condition in [Experiment 1](/experiments#exp1-design) catches anything AP21967 does by itself. We also built a second route that needs no small molecule: MGRN1 fused to an ALFA-binding nanobody, with an ALFA tag on SMO.",
            },
          ],
        },
        {
          heading: "Cycle 2: Deciding what to measure",
          intro:
            "In progress. The model told us which rates matter, and the experiments are built to measure them. No assay has run yet.",
          items: [
            {
              title: "Design",
              body: "The [kinetic model](/model) is only as good as its numbers, and most of them are stand-ins. The kinetic modelling subteam ran a sensitivity analysis to show which numbers actually move **ciliary SMO**, and said plainly what would help most: wet lab data on how SMO moves at the cilium. Two rates stood out. One is how fast MGRN1 tags SMO once it is bound. The other, in the linear model, is the rate at which ciliary SMO is cleared. Dr. Sauro also had the subteam work from relative data such as fold changes, which is what a bench can give.",
            },
            {
              title: "Build",
              body: "Those two rates became two experiments. [Experiment 1](/experiments#exp1-design) asks whether forced recruitment raises SMO ubiquitination. [Experiment 3](/experiments#exp3-design) follows ciliary SMO over six hours after AP21967, with separate fixed wells at each timepoint, and SMO carries a GFP in the construct so the same images give both readings. After reading the protocol, the kinetic modelling subteam asked for three changes, and all three shaped the plan. A whole-cell region is measured beside the ciliary one from the same images, so we can read the ratio between them and not just an exit rate. A timepoint at **360 minutes** was added, so the series runs well past a reported half-life of about two hours. And a dose series of six to eight AP21967 concentrations is planned as a second stage, because it is the only way to see whether the response plateaus or falls away at high dose. A hook effect is a question we are asking, not a property we are assuming, and the answer is a key input for how the model treats dosing of the linker.",
            },
            {
              title: "Test",
              body: "The assays have not run, so what we could test was the plan. A member of the kinetic modelling subteam reviewed the shared protocol and sent back the changes above, which is the first outside check the plan has had.",
            },
            {
              title: "Learn",
              body: "The review left us two limits we now state up front. A fall in ciliary SMO does not show that SMO was degraded, because it may only have moved, so imaging is paired with the whole-cell measurement and, to confirm degradation, a biochemical abundance assay. And these measurements cannot separate ciliary entry from exit on their own, which would need a method such as fluorescence recovery or photoconversion. The kinetic modelling subteam's work is why the experiment asks for the right numbers, and why we know which questions it cannot answer.",
            },
          ],
        },
        {
          heading: "Cycle 3: From designed binders to a screen",
          intro:
            "In progress. Protein modelling set what the binders can reach, and the bench plan is built around that. Orders are placed and no assay has run.",
          items: [
            {
              title: "Design",
              body: "We aimed at the **MMM complex** and not at ATRN because MMM had cryo-EM structures and an accessible interface. The binders are designed against the extracellular-facing regions of human MEGF8 and MOSMO, so they can be applied to cells from the outside as purified protein.",
            },
            {
              title: "Build",
              body: "The protein modelling subteam's filters decided what could be ordered. Most early designs bound parts of MOSMO and MEGF8 buried in the membrane, so they re-folded every survivor against only the extracellular parts and wrote a filter that rejects anything near the transmembrane helices. About 25 designs survived, and a rescue cycle is working toward a full 96-well plate. That plate is also the format of the bench screen: [Experiment 2](/experiments#exp2-design) is a 96-well assay in mammalian cells, with each binder and its target fused to one half of a split transcription factor, a GFP reporter, and a matched GB1-only control for every binder. The kinetic modelling subteam's off-target check gave the binder doses a ceiling: the effect on MC4R stays small and saturates, about 2.3 percent at 50 nM and 2.75 percent at 500 nM.",
            },
            {
              title: "Test",
              body: "Nothing has been screened yet. The binder plate is ordered from Twist Bioscience and has not arrived. What we could test was whether the plan could mislead us, and it could in three ways.",
            },
            {
              title: "Learn",
              body: "A hit in the screen shows binding inside a cell and nothing more, so disruption is tested separately, in [Experiment 4](/experiments#exp4-design), with a direct check of whether MEGF8 and MOSMO still associate. The binders were designed against human proteins, so activity in NIH/3T3 cells depends on recognising the mouse ones, and a flat result would not mean a binder fails against its intended target. And because the rescue cycle reuses a few backbone shapes, hits may cluster, so we will read them with that in mind. Binders that pass are re-cloned into a vector built for secretion and expressed in Expi293F cells, and they become the purified proteins tested in [Experiment 4](/experiments#exp4-design).",
            },
          ],
        },
      ],
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
    },
    {
      kind: "table",
      id: "loops-fed-each-other",
      heading: "How the loops fed each other",
      intro:
        "Every row is a hand-off that changed something. The last one is the direction that has not happened yet.",
      columns: ["From", "To", "What was handed over", "What it changed at the bench"],
      rows: [
        [
          "Kinetic modelling",
          "Wet lab",
          "The mTOR problem with rapamycin.",
          "The gene design moved to AP21967 with FRB(T2098L) and DmrA/DmrC arms, with a dimeriser-only control in the experiments.",
        ],
        [
          "Kinetic modelling",
          "Wet lab",
          "A sensitivity analysis, and a call for time-resolved SMO data.",
          "[Experiment 3](/experiments#exp3-design): a six-hour time course to 360 minutes, a whole-cell region beside the ciliary one, and a dose series as a second stage.",
        ],
        [
          "Kinetic modelling",
          "Wet lab",
          "An off-target check: the MC4R effect stays small and saturates between 50 and 500 nM.",
          "A ceiling for the binder doses in Experiment 4.",
        ],
        [
          "Protein modelling",
          "Wet lab",
          "Extracellular-only targets, and about 25 filtered designs working toward a 96-well plate.",
          "The format of the [Experiment 2](/experiments#exp2-design) screen, matched GB1 controls, and secreted expression of hits for [Experiment 4](/experiments#exp4-design).",
        ],
        [
          "Wet lab",
          "Kinetic and protein modelling",
          "Not yet. Time-resolved SMO from Experiment 3 and the screen hits from Experiment 2 are pending.",
          "These will update the model's rates and show which binder designs worked.",
        ],
      ],
    },
  ],
};

const experiments: Page = {
  slug: "/experiments",
  title: "Experiments",
  kicker: "chapter 05 · experiments",
  intro:
    "This page outlines four proposed experiments designed to validate the individual components of HedgehogSense and its ability to regulate Hedgehog signalling.",
  blocks: [
    {
      kind: "prose",
      heading: "Overview",
      body: [
        "The Hedgehog pathway is essential to embryonic development, tissue organisation and cellular differentiation. Its activity is controlled by how much **Smoothened (SMO)** there is and by where that SMO sits: SMO is a seven-transmembrane protein that transmits Hedgehog signals from the primary cilium.",
        "Building on the naturally occurring regulatory activity of the **MGRN1, MEGF8 and MOSMO (MMM) complex**, we propose a modular system designed to increase or decrease ciliary SMO abundance through two complementary mechanisms.",
        "Together, these experiments evaluate induced SMO ubiquitination, intracellular binder recognition, receptor trafficking, and functional MMM inhibition.",
      ],
    },
    {
      kind: "figure",
      id: "mmm-overview",
      src: "wetlab/overview.svg",
      srcMobile: "wetlab/overview-mobile.svg",
      alt: "A cross-section of the cell membrane. MEGF8 spans the membrane with MOSMO beside it, and MGRN1, labelled E3 ligase, sits on the cytoplasmic side. To the right, SMO is drawn as a seven-pass receptor being tagged with three ubiquitin marks. An arrow leads to two boxes: ciliary SMO down, then Hedgehog signalling down.",
      caption:
        "Schematic representation of MMM-mediated SMO regulation. The MMM complex promotes SMO ubiquitination, limiting SMO accumulation in the primary cilium and reducing downstream Hedgehog pathway activity.",
    },
    {
      kind: "callout",
      label: "experimental status",
      heading: "Proposed Experimental Work",
      body: [
        "The four experiments presented below outline the proposed validation strategy for HedgehogSense. Construct design has been completed, and the required DNA constructs have been ordered from GenScript and Twist Bioscience. Experimental work is pending delivery of these materials.",
        "All experimental workflows are presented as proposed methods. Figures containing illustrative or simulated data are explicitly identified and do not represent experimentally measured results.",
        "Detailed construct information and project documentation are available in [parts and registry](/parts) and the [notebook](/notebook).",
      ],
    },

    {
      kind: "prose",
      section: "Experiment 1: Chemically Induced Recruitment and SMO Ubiquitination",
      navLabel: "Experiment 1: Induced recruitment",
      id: "experiments",
      heading: "Rationale",
      body: [
        "**MGRN1** functions as the E3 ubiquitin ligase within the MMM complex, while **MEGF8** and **MOSMO** contribute to complex assembly, substrate recognition, and regulation of SMO ubiquitination.",
        "Kong et al. [1] showed that MGRN1 on its own does not significantly increase SMO ubiquitination when overexpressed in HEK293T cells. MEGF8 on its own produces a small increase, probably by working through endogenous MGRN1. Expressing both together produces substantially more.",
        "This experiment evaluates whether direct recruitment of MGRN1 to SMO is sufficient to enhance ubiquitination, and whether recruitment of the MEGF8 intracellular domain can promote SMO ubiquitination through endogenous MGRN1.",
        "Two recruitment strategies will be evaluated: **AP21967**-dependent **DmrA/DmrC** heterodimerisation, and **ALFA/NbALFA**-mediated recruitment. The latter uses specific recognition of the ALFA peptide by its corresponding nanobody without requiring a chemical inducer.",
      ],
    },
    {
      kind: "figure",
      id: "fig-1a",
      src: "wetlab/exp1-recruitment-routes.svg",
      alt: "Two labelled panels. Panel A, rapalog-gated recruitment: AP21967 brings SMO-DmrC and MGRN1-DmrA together, shown before recruitment, during recruitment, and at the measurement step. Panel B, ALFA and NbALFA recruitment: NbALFA binds the ALFA tag on SMO with no chemical inducer, in the same three steps.",
      caption:
        "Schematic of the proposed DmrA/DmrC and ALFA/NbALFA recruitment strategies. AP21967 enables chemically induced proximity in the DmrA/DmrC system, whereas ALFA/NbALFA provides a constitutive protein-recognition mechanism.",
    },
    {
      kind: "steps",
      id: "exp1-design",
      heading: "Proposed Experimental Design",
      intro: "Both recruitment strategies will be evaluated in HEK293T cells, using engineered SMO, MGRN1 and MEGF8 constructs.",
      items: [
        {
          title: "Direct Recruitment of MGRN1",
          body: "SMO and MGRN1 carry compatible chemically inducible dimerisation domains, and AP21967 brings them together. Co-immunoprecipitation will measure the association, and recruitment will then be assessed for its effect on SMO ubiquitination. Wild-type MGRN1 will be compared against a catalytically inactive mutant, which tests whether any ubiquitination depends on ligase activity.",
        },
        {
          title: "MEGF8-Mediated Recruitment",
          body: "Recruitment of the MEGF8 intracellular domain to SMO will be evaluated without exogenous MGRN1 expression, to determine whether endogenous MGRN1 can associate with the recruited complex and promote SMO ubiquitination. Co-immunoprecipitation will show whether endogenous MGRN1 associates with the recruited MEGF8 and SMO, and the ubiquitination readout will show whether that association has a functional consequence.",
        },
        {
          title: "ALFA-Tag Detection",
          body: "ALFA-tagged constructs allow the engineered proteins to be isolated specifically with ALFA-binding nanobodies, and expression, recovery and association to be compared across conditions. Normalising the co-immunoprecipitated amounts against the recovered tagged protein accounts for differences in expression or in pull-down recovery rather than in recruitment.",
        },
        {
          title: "Measurement of SMO Ubiquitination",
          body: "SMO will be isolated under denaturing conditions and the ubiquitin signal read by Western blot. The conditions compared are SMO with vehicle, SMO with direct MGRN1 recruitment, SMO with a catalytically inactive MGRN1 recruited the same way, SMO with MEGF8 recruitment relying on endogenous MGRN1, and recruitment-deficient and dimeriser-only controls.",
        },
      ],
    },
    {
      kind: "prose",
      id: "exp1-outcome",
      heading: "Expected Outcomes and Interpretation",
      body: [
        "AP21967 is expected to increase association between proteins carrying compatible DmrA and DmrC domains. For direct recruitment, increased SMO ubiquitination would indicate that bringing the ligase to SMO is sufficient under these conditions.",
        "Increased SMO ubiquitination following MEGF8 recruitment would support a functional role for the recruited MEGF8 domain. Additional experiments would be required to distinguish enhanced MGRN1 recruitment from changes in ligase positioning or catalytic activity. If direct recruitment does not increase ubiquitination, proximity alone is not sufficient under the conditions tested.",
        "The results will inform selection of the most effective recruitment strategy for subsequent characterisation of SMO trafficking and Hedgehog pathway regulation.",
      ],
    },

    {
      kind: "figure",
      id: "fig-1b",
      src: "wetlab/exp1-ubiquitination.svg",
      hypothetical: true,
      alt: "A bar chart of relative SMO ubiquitination, as fold change against SMO alone. Five control bars sit at about 1: SMO only, an inert mCherry control, an inactive MGRN1 mutant, and MGRN1 and MEGF8 with no inducer. Two recruited bars rise above them: MEGF8 recruited at 2.9 times and MGRN1 recruited at 4.4 times. The figure is labelled illustrative, not measured.",
      caption:
        "Hypothetical SMO ubiquitination following induced recruitment of MGRN1 or MEGF8, compared with matched negative controls. Increased ubiquitination in the recruitment conditions would support functional engagement of the ubiquitination machinery. All plotted values are simulated and do not represent experimental measurements.",
    },
    {
      kind: "prose",
      section: "Experiment 2: Intracellular Screening of Computationally Designed Binders",
      navLabel: "Experiment 2: Binder screen",
      id: "exp2",
      heading: "Rationale",
      body: [
        "The upregulation strategy requires computationally designed binders capable of recognising MEGF8 or MOSMO. We will first evaluate intracellular target recognition using a mammalian split-transcription-factor assay, before assessing whether candidate binders disrupt MMM function.",
        "Binders will be screened against both MEGF8 and MOSMO in a 96-well mammalian protein interaction assay. The assay measures binding. It does not establish that a binder disrupts the complex, and a positive result should not be read as evidence that it does.",
        "Binder and target interaction brings the complementary transcription-factor fragments into proximity, enabling GFP reporter activation. Reporter expression therefore provides an indirect measure of intracellular interaction.",
      ],
    },
    {
      kind: "figure",
      id: "fig-2a",
      src: "wetlab/exp2-screen-workflow.svg",
      alt: "A four-step workflow. One, design and clone two target-specific binder libraries against MEGF8 and MOSMO, each fused to one half of a split transcription factor. Two, set up a 96-well screen in HEK293T cells with three plasmids per well. Three, binding reconstitutes the transcription factor and switches on a GFP reporter. Four, read by flow cytometry and prioritise candidates by their GFP and BFP double-positive fold change against a GB1-only control.",
      caption:
        "Proposed workflow for screening computationally designed MEGF8- and MOSMO-targeting binders using a mammalian split-transcription-factor assay. Binder and target interactions induce GFP reporter expression, which is quantified by flow cytometry alongside BFP expression. Candidates are evaluated relative to matched GB1-only negative controls.",
    },
    {
      kind: "steps",
      id: "exp2-design",
      heading: "Proposed Experimental Design",
      items: [
        {
          title: "Construction of Binder and Target Expression Vectors",
          body: "The computationally designed MEGF8 and MOSMO binding sequences will be cloned into the assay vector carrying one half of the split transcription factor. MEGF8 and MOSMO will be expressed as separate target fusions carrying the complementary half.",
        },
        {
          title: "96-Well Mammalian Interaction Screening",
          body: "The screen will run in a 96-well format in HEK293T cells. Each well will receive the binder construct, its corresponding target construct and the GFP reporter plasmid, so that every candidate is screened under comparable conditions.",
        },
        {
          title: "Flow-Cytometric Quantification of Reporter Activation",
          body: "Once the reporter has had time to express, cells will be collected and read by flow cytometry. Binding will be scored from the GFP and BFP double-positive population as a percentage of cells, which gives a quantitative measure of reporter activation.",
        },
        {
          title: "Background Normalisation and Candidate Prioritisation",
          body: "Every binder has a matched GB1-only carrier control containing no MEGF8 or MOSMO target, which gives the background reporter signal. Binding fold change is the double-positive population for a binder and target pair over its own GB1 control. The MEGF8 and MOSMO screens will be analysed separately, and the stronger candidates taken forward.",
        },
      ],
    },
    {
      kind: "prose",
      id: "exp2-outcome",
      heading: "Expected Outcomes and Interpretation",
      body: [
        "A binder that interacts with its intended target should raise GFP activation, and the double-positive population, above its matched GB1 control, giving a fold change greater than one.",
        "A candidate that does not differ from its control provides no evidence of binding under the conditions tested, which is not the same as evidence that it does not bind.",
        "Background reporter activity and differences in how well each fusion protein is expressed both move this number, so fold change has to be read alongside the underlying flow-cytometry populations and the assay controls rather than on its own.",
      ],
    },

    {
      kind: "figure",
      id: "fig-2b",
      src: "wetlab/exp2-flow-fold-change.svg",
      hypothetical: true,
      alt: "Panel A shows four flow cytometry plots of GFP against BFP. The two GB1-only controls sit at about 4 percent double positive; the MEGF8 binder reaches 28.5 percent and the MOSMO binder 23.4 percent. Panel B plots binding fold change for each binder against its own matched GB1 control. The figure is labelled simulated data.",
      caption:
        "Hypothetical flow-cytometry results illustrating differences in GFP and BFP double-positive populations between matched negative controls and candidate binders. Binding fold change is calculated relative to the corresponding GB1-only control. All values and distributions are simulated for illustrative purposes.",
    },
    {
      kind: "prose",
      section: "Experiment 3: Quantifying SMO Trafficking and Depletion Kinetics",
      navLabel: "Experiment 3: SMO trafficking",
      id: "exp3",
      heading: "Rationale",
      body: [
        "Following the ubiquitination measurements in Experiment 1, this experiment investigates the temporal response of SMO localisation and cellular abundance to induced MGRN1 recruitment.",
        "Ciliary SMO is what matters for signalling, but a fall in ciliary fluorescence does not establish that SMO was degraded: it may have been redistributed elsewhere in the cell. To separate the two, SMO will be measured at the cilium and across the rest of the cell from the same images, over the same time course.",
        "The [kinetic model](/model) also requires time-resolved measurements to describe how the system responds to AP21967, which is why the series runs out to 360 minutes.",
      ],
    },
    {
      kind: "figure",
      id: "fig-3a",
      src: "wetlab/exp3-imaging-workflow.svg",
      srcMobile: "wetlab/exp3-imaging-workflow-mobile.svg",
      alt: "A proposed imaging experiment in three parts. One, an AP21967 time course against vehicle, with separate fixed wells at 0, 30, 60, 120, 240 and 360 minutes. Two, a schematic cell marking two regions of interest: the ciliary region, identified by a marker, and the whole cell. Three, quantify ciliary SMO, whole-cell SMO and the ratio between them. A note reads that ciliary SMO loss can reflect trafficking without degradation.",
      caption:
        "Proposed fluorescence imaging workflow for quantifying SMO localisation over a six-hour time course following AP21967 treatment. Ciliary and whole-cell regions of interest are analysed independently to distinguish changes in ciliary accumulation from changes in overall cellular abundance.",
    },
    {
      kind: "steps",
      id: "exp3-design",
      heading: "Proposed Experimental Design",
      items: [
        {
          title: "Six-Hour Imaging Time Course",
          body: "Ciliated NIH/3T3 cells carrying the direct MGRN1 recruitment system will be treated with AP21967 or vehicle, then imaged at baseline and at roughly 30, 60, 120, 240 and 360 minutes. Separate wells fixed at each timepoint make the series practical without continuous live-cell imaging. We would use a validated fluorescent SMO readout, such as SMO-GFP or a suitable immunofluorescence assay, together with a ciliary marker.",
        },
        {
          title: "Separate Quantification of Ciliary and Whole-Cell SMO",
          body: "For each cell the cilium will be identified and background-corrected SMO fluorescence measured there, then a whole-cell region and, where possible, the non-ciliary part. Both use the same imaging channel and acquisition settings so the signals are directly comparable. Cilium length and area will be tracked as well, so that a change in cilium size is not mistaken for a change in SMO.",
        },
        {
          title: "Dimeriser Dose-Response Characterisation",
          body: "The first pass uses a single AP21967 concentration against vehicle. If that produces a measurable response, key timepoints will be repeated at further concentrations to determine whether depletion depends on dose. A longer series of six to eight concentrations could follow if the model requires it, particularly to test whether the response plateaus or falls away at high concentrations. A hook effect is a question we would be asking, not a property we are assuming.",
        },
        {
          title: "Controls",
          body: "Vehicle gives the baseline trafficking profile. Catalytically inactive MGRN1 tests whether the response requires ligase activity. A recruitment-deficient condition tests whether it requires the engineered interaction at all. A dimeriser-only control will be included to identify AP21967-dependent changes unrelated to productive MGRN1 recruitment. Cell health and the proportion of cells carrying a primary cilium will be monitored throughout.",
        },
      ],
    },
    {
      kind: "prose",
      id: "exp3-outcome",
      heading: "Expected Outcomes and Interpretation",
      body: [
        "A reduction in ciliary SMO fluorescence following AP21967 treatment would indicate a change in ciliary receptor abundance. Comparison with whole-cell fluorescence will help distinguish ciliary redistribution from a broader decrease in cellular SMO.",
        "Ciliary signal down with little change in the whole cell would be consistent with SMO being redistributed, or leaving the cilium. Both falling together would be consistent with less SMO in the cell overall, although confirming degradation would require a biochemical abundance assay rather than imaging. No change at all, with recruitment verified, would indicate that recruitment does not produce a measurable trafficking response under these conditions.",
        "These measurements would let the modelling team estimate how fast and how far ciliary SMO falls, and constrain a model of how SMO is distributed between compartments. They cannot separate ciliary entry and exit rate constants on their own: that would require another method, such as fluorescence recovery or photoconversion.",
      ],
    },

    {
      kind: "figure",
      id: "fig-3c",
      src: "wetlab/exp3-kinetics.svg",
      srcMobile: "wetlab/exp3-kinetics-mobile.svg",
      hypothetical: true,
      alt: "Two plots of SMO fluorescence over 360 minutes, normalised to baseline, comparing vehicle with AP21967 at matched timepoints. One plot is ciliary SMO, the other whole-cell SMO. The figure is labelled hypothetical data.",
      caption:
        "Hypothetical time-dependent changes in normalised ciliary and whole-cell SMO fluorescence following induced MGRN1 recruitment. A greater reduction in ciliary fluorescence relative to whole-cell fluorescence would be consistent with receptor redistribution or ciliary exit. All plotted values are simulated.",
    },
    {
      kind: "prose",
      section: "Experiment 4: Functional Validation of MEGF8- and MOSMO-Targeting Binders",
      navLabel: "Experiment 4: Binder validation",
      id: "exp4",
      heading: "Rationale",
      body: [
        "Although the split-transcription-factor assay evaluates intracellular target recognition, it does not establish whether a candidate interferes with MMM activity. Functional validation is therefore required to determine whether selected binders alter SMO localisation and Hedgehog pathway signalling.",
        "The complex drives SMO ubiquitination and limits how much SMO accumulates in the cilium. Our binders are designed against extracellular-facing regions of human MEGF8 and MOSMO, so they can be applied to cells from the outside as purified protein rather than expressed inside them.",
        "Selected candidates will be expressed in Expi293F cells, purified, and applied to ciliated NIH/3T3 cells, where ciliary SMO and downstream Hedgehog signalling will be measured. Because the binders were designed against human MEGF8 and MOSMO, activity in NIH/3T3 cells will depend on recognition of the corresponding mouse proteins and accessibility of their targeted extracellular epitopes.",
      ],
    },
    {
      kind: "figure",
      id: "fig-4a",
      src: "wetlab/exp4-validation-workflow.svg",
      srcMobile: "wetlab/exp4-validation-workflow-mobile.svg",
      alt: "A workflow in two halves. Along the top, select MEGF8 and MOSMO candidates, express them in Expi293F cells, and purify by affinity chromatography followed by size exclusion. Below, two readouts branch off: ciliary SMO by fluorescence imaging in NIH/3T3 cells, and GLI activity in Shh-LIGHT2 cells as firefly over Renilla under a submaximal SHH stimulus. A footer notes that everything is compared against nonbinding protein controls.",
      caption:
        "Proposed workflow for functional validation of MEGF8- and MOSMO-targeting binders. Selected candidates are expressed and purified from Expi293F cells before evaluation of ciliary SMO accumulation in NIH/3T3 cells and GLI-dependent reporter activity in Shh-LIGHT2 cells.",
    },
    {
      kind: "steps",
      id: "exp4-design",
      heading: "Proposed Experimental Design",
      items: [
        {
          title: "Recombinant Binder Expression and Purification",
          body: "Candidates will be chosen on their fold change in the double-positive population against the matched GB1 control. Sequences go into mammalian expression vectors built for secreted production and purification, and are expressed in Expi293F cells. Secreted binders will be collected from the culture medium, purified by an appropriate affinity method, and assessed for purity and recovery. Size-exclusion chromatography removes aggregates if needed, and concentrations will be standardised before any functional testing.",
        },
        {
          title: "Quantification of Ciliary SMO Accumulation",
          body: "Purified binders will be applied to ciliated NIH/3T3 cells, each against a matched nonbinding purified protein and a buffer-only control, at several concentrations so that dose dependence is visible. SMO localisation will be read by immunofluorescence against a primary-cilium marker, and SMO fluorescence within the cilium quantified across many cells and independent experiments. Viability and the proportion of ciliated cells will also be monitored, so that a change unrelated to MMM regulation is detectable.",
        },
        {
          title: "Assessment of GLI-Dependent Hedgehog Signalling",
          body: "Promising candidates will go into Shh-LIGHT2 cells, an NIH/3T3-derived line carrying a GLI-responsive firefly luciferase reporter and a constitutive Renilla control, under the same submaximal SHH stimulation. Firefly normalised to Renilla compares signalling across conditions, and any change will be checked for consistency with the ciliary SMO measurement. Gli1 measured by RT-qPCR would give a second readout where feasible.",
        },
        {
          title: "Specificity Controls and Interpretation of Negative Results",
          body: "Responses will be compared against the nonbinding control and checked for dose dependence. A target-dependent control, or a direct test of whether MEGF8 and MOSMO still associate, is what would show that a response comes from disrupting the complex rather than from something else the purified protein does.",
        },
      ],
    },
    {
      kind: "prose",
      id: "exp4-outcome",
      heading: "Expected Outcomes and Interpretation",
      body: [
        "A candidate that interferes with MMM regulation should raise ciliary SMO fluorescence relative to the nonbinding control, and under a matched submaximal SHH stimulus should raise normalised GLI reporter activity as well. A dose-dependent response in both would support functional inhibition of MMM-mediated regulation. It would not, on its own, establish direct disruption of the MEGF8 and MOSMO interaction, which would require a separate test of whether the two proteins still associate.",
        "A binder that raises ciliary SMO without raising GLI activity would indicate that more SMO in the cilium does not automatically produce more signal.",
        "A candidate that does nothing may have failed to reach or recognise the mouse target, or may be binding without disrupting anything. The functional assay alone cannot separate those, and a flat result here would not establish that a binder is nonfunctional against its intended human target.",
      ],
    },

    {
      kind: "figure",
      id: "fig-4b",
      src: "wetlab/exp4-sec-readouts.svg",
      srcMobile: "wetlab/exp4-sec-readouts-mobile.svg",
      hypothetical: true,
      alt: "A size exclusion chromatography trace of absorbance at 280 nanometres against elution volume, with a single main peak marked as the putative monomer, shown beside the functional readouts for ciliary SMO and GLI reporter activity. The figure is labelled simulated data.",
      caption:
        "Hypothetical size-exclusion chromatography profile and functional characterisation of selected binders. The SEC trace illustrates a predominant putative monomeric species, while the functional assays show potential changes in ciliary SMO abundance and normalised GLI reporter activity. All data are simulated and do not represent experimental measurements.",
    },
    {
      kind: "references",
      heading: "References",
      items: [
        {
          n: "1",
          text: "Kong et al., 2020. Developmental Cell.",
          href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7686252/",
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
    },
    {
      kind: "prose",
      section: "Kinetic modelling",
      id: "homeostasis",
      heading: "The homeostasis model",
      body: [
        "Because the tuner was assembled with adjustability in mind, understanding how it behaves under varying conditions and doses is part of building it. To approach that, the modelling subteam built dedicated deterministic **ordinary differential equation** models: one for the intervention itself, and others for the systems attached to it.",
        "To address the use of our system as a bidirectional network, including strategic dosing of both the linker and the binder, we implemented an ODE network representing the SMO signalling system upstream of the cilium itself. It includes the **MMM complex** (MGRN1, MEGF8, MOSMO) and the natural inhibitor **PTCH1**, the components most central to the trafficking of SMO into the cilium.",
        "To be considered active, SMO must enter the primary cilium, so the network centres on ciliary SMO concentration, which is what the intervention acts on directly. The upstream system is restricted to PTCH1 and the MMM complex because one is the natural intervention and the other is ours. Since our intervention aims to restrict the SMO population in the cilium, the MMM shuttle is coupled to an existing downstream Hedgehog model from BioModels, to check whether reductions in SMO through targeted ubiquitination are enough to actually change the output of the system.",
      ],
      source:
        "Downstream model after Sivakumar, 2011; ciliary entry after Wilson, 2009.",
    },
    {
      kind: "figure",
      id: "homeostasis-network",
      src: "model/homeostasis-network.webp",
      alt: "A reaction diagram. SMO is made in the cytoplasm and enters the primary cilium at a rate k in, leaving again at k out. Inside the cilium sits the MMM complex, drawn as MOSMO, MGRN1 the E3 ligase, and MEGF8 the membrane protein. The complex ubiquitinates ciliary SMO, which is then degraded by the proteasome. A de novo binder arrow points at MGRN1 and is labelled disrupts MMM. A proximity linker bridges the complex to ciliary SMO. PTCH1 blocks SMO entry, on in wild type and off in basal cell carcinoma. Ciliary SMO activates downstream Hedgehog signalling.",
      caption:
        "The upstream network the homeostasis model represents: the MMM complex and PTCH1 acting on the pool of SMO that enters the cilium, with the two arms of our device entering on the left.",
      ratio: "wide",
    },
    {
      kind: "details",
      id: "states",
      heading: "What the model tracks",
      summary: "The six quantities the equations follow, and how each one changes.",
      blocks: [
        {
          kind: "table",
          columns: ["Quantity", "What it is", "Gained by", "Lost to"],
          rows: [
            [
              "**S_cyto**",
              "Cytoplasmic SMO that has yet to enter the cilium. The source the cilium draws on.",
              "Synthesis, and exit from the cilium",
              "Entry to the cilium, and degradation",
            ],
            [
              "**S_cil**",
              "Ciliary SMO. The active form, and the model's readout.",
              "Entry from the cytoplasm",
              "Exit, degradation, PTCH1 inhibition, and MMM-supported ubiquitination",
            ],
            [
              "**S_ub**",
              "Ubiquitinated SMO, on its way to the proteasome.",
              "Michaelis-Menten interaction with MGRN1",
              "Degradation",
            ],
            [
              "**MMM**",
              "The functional complex that ubiquitinates ciliary SMO.",
              "Assembly from the non-functional form",
              "Interaction with the de novo binder",
            ],
            [
              "**M_nf**",
              "The non-functional complex, pulled apart.",
              "De novo binder interaction",
              "Reassembly, reversibly",
            ],
            [
              "**M_link**",
              "The complex joined to the linker. Measures an accelerated ubiquitination rate.",
              "Linker binding",
              "Linker release",
            ],
          ],
        },
      ],
    },
    {
      kind: "prose",
      heading: "The test",
      body: [
        "We run the model twice. Once as **wild type**, and once with **PTCH1 set to zero**, which is the most common mutation in basal cell carcinoma and drives SMO too high. The **tunability window** is the range where adding the binder brings the second run back onto the first run over time.",
        "The team goal, in one line, is a model-guided recruitment platform that lets us dial SMO levels in the cilium instead of simply blocking SMO activity.",
      ],
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
      kind: "details",
      id: "parameters",
      heading: "Every parameter, and where it came from",
      summary:
        "Twelve values, each marked as measured, calculated from other values, or standing in until something better exists.",
      blocks: [
        {
          kind: "table",
          columns: ["Parameter", "What it represents", "Value", "Where it comes from"],
          rows: [
            ["SMO_cil", "Ciliary SMO concentration", "1 nM", "Normalisation anchor. Sets the scale only."],
            ["M_free", "Active MMM complex", "0.148 nM", "Literature, Kong 2021, derived from densitometry"],
            ["PTCH1", "PTCH1 concentration", "0.15 nM", "PaxDb, 0.01 ppm"],
            ["Influx", "Ciliary influx", "0.116 nM per second", "Calculated from the other ciliary rates"],
            ["k_out", "Ciliary transit, exit", "9.63e-5 per second", "Literature, Milenkovic 2014, from a half-life"],
            ["kdeg_SMO_cil", "SMO degradation rate", "3.21e-5 per second", "Literature, Milenkovic 2014, from a half-life"],
            ["kPTCH1_SMO", "PTCH1 removal strength", "4.8e-4 per nM per second", "**Stand-in.** Ye 2018, based on GPR161, a non-Smoothened Hedgehog inhibitor"],
            ["kMMM", "MMM-mediated ubiquitination rate", "0.42 per nM per second", "Calculated from a fold change"],
            ["alpha_L", "Ternary enhancement rate", "1", "**Stand-in.** Assumes the linker is non-cooperative"],
            ["kdeg_MMM", "MMM degradation, turnover", "8.86e-6 per second", "Literature, Kong 2021"],
            ["kform_MMM", "MMM synthesis", "1.3e-6 nM per second", "Calculated from degradation and abundance"],
            ["k3, k_minus3, kf_MMM_linker, koff", "Binder and linker on and off rates", "Preset", "**Stand-ins**, swept rather than trusted"],
          ],
          caption:
            "Four of the twelve are stand-ins rather than measurements. They are swept across a range in every result rather than being treated as known.",
        },
      ],
    },
    {
      kind: "details",
      id: "assumptions",
      heading: "The assumptions the model rests on",
      summary:
        "Six places where the biology was simplified, and what would be needed to stop simplifying.",
      blocks: [
        {
          kind: "facts",
          items: [
            {
              title: "The cytoplasm is a non-depleting source",
              body: "The cilium is a very small compartment, so ciliary SMO is a small fraction of the cell's total and the data are too sparse to fix the ratio. The cytoplasmic to ciliary transit is bundled into one influx rate. A SAG ciliary trafficking time course from wet lab would let us measure it properly.",
            },
            {
              title: "The MMM complex is treated as one ligase",
              body: "MEGF8, MGRN1 and MOSMO are represented as a single structure. The literature says they do not act on SMO independently, and no published binding data exists to separate their rates, so the complex is reduced to its rate-limiting form.",
            },
            {
              title: "Ubiquitination is linear, not Michaelis-Menten",
              body: "The database value for a general ring E3 ligase gives a Km far larger than our calculated ciliary SMO concentration. When Km greatly exceeds the substrate, Michaelis-Menten collapses to a first-order relationship, so that is what the model uses.",
            },
            {
              title: "The linker clears at the same rate as the natural complex",
              body: "With no measured kinetics for a designed molecule, the linker is given the complex's own rate and a neutral cooperativity of one. Measuring it would need binding data for the real linker.",
            },
            {
              title: "Binder and linker constants are stand-ins",
              body: "The real constraints of our binder and linker are unknown. Some are estimated from the FKBP and FRP system; the rest are preset and swept across a range in every result rather than being trusted as values.",
            },
            {
              title: "The catalytic rate is derived, not measured",
              body: "MGRN1 is a ring ligase, so its reactivity is coupled to its E2 partner and is hard to express as a single enzyme's catalytic rate. The model derives it from the fold change in SMO ubiquitination between MEGF8 knockout and wild type.",
            },
          ],
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
    },
    {
      kind: "links",
      id: "equations",
      heading: "The equations themselves",
      intro:
        "Written out in full, outside this page. These are the working for the models above and the safety model below.",
      items: [
        {
          title: "Core ODE model",
          body: "The full equation set for the homeostasis model, before the simplifications above.",
          href: "https://www.overleaf.com/2243395337mdzbkdpkpczw#7f8ec6", // colour-ok: an Overleaf link fragment, not a colour
          label: "Read on Overleaf",
          tag: "LaTeX",
        },
        {
          title: "The GPCR system",
          body: "Reactions, initialisations and literature values for both candidate formulations of PTCH1.",
          href: "https://www.overleaf.com/read/zvpbnkppkrzd#274249", // colour-ok: an Overleaf link fragment, not a colour
          label: "Read on Overleaf",
          tag: "LaTeX",
        },
        {
          title: "Melanocortin safety model",
          body: "The mass-action equations behind the MC4R result at the foot of this page.",
          href: "https://drive.google.com/file/d/1PONnAZG1bpua0B07ge6KFhOMH_L61SFm/view",
          label: "Open the document",
          tag: "PDF, 2 pages",
        },
      ],
    },
    {
      kind: "prose",
      section: "The GPCR system",
      id: "gpcr",
      heading: "How best to model SMO itself",
      body: [
        "The model above treats SMO as a quantity to be moved around. This one asks a different question: what makes SMO signal at all, and when does that signalling become excessive. SMO is regulated by the Hedgehog ligand and by **PTCH1**, which keeps SMO out of the ciliary membrane and so inhibits it. Hedgehog activates the pathway by inhibiting PTCH1.",
        "Despite a lot of study, there is no clear consensus on the detail. Earlier models had PTCH1 binding and inhibiting SMO directly. More recent evidence suggests PTCH1 instead works by reducing the **accessibility of cholesterol** in the outer plasma membrane, and others argue it expels cholesterol from the cell altogether. Here we advance a model in which SMO signalling is modulated by outer-leaflet cholesterol, and test whether it can reproduce several experimental observations.",
        "Our model expands on previous ones by treating the distribution of cholesterol as something that changes, with cholesterol acting as SMO's own ligand. Cholesterol naturally distributes unevenly between the inner and outer layers of a membrane, and PTCH1 has been proposed to shift that distribution by acting as a rare transporter of sterols. Its close relative NPC1 does the same job in the lysosome. Once at the cilium, SMO needs a cholesterol binding step to activate, and signalling in the model is proportional to the amount of cholesterol-bound SMO. Because SMO binds at a domain that faces outward, its signalling is sensitive to which side of the membrane the cholesterol is on.",
      ],
      source:
        "After Kinnebrew 2022, Luchetti 2016, Taipale 2002 and Hasnovic and Mus-Veteau 2018.",
    },
    {
      kind: "figure",
      id: "gpcr-schematic",
      src: "model/gpcr-schematic.webp",
      alt: "A schematic of the model's reactions. A primary cilium rises out of the plasma membrane, with cholesterol, SMO, PTCH1 and the Hedgehog ligand marked in a key. PTCH1 is labelled as importing cholesterol from the outer leaflet to the inner one. SMO is made in the cytoplasm by a first-order process and diffuses between the cytoplasm and the cilium. SMO binds cholesterol at its extracellular cysteine-rich domain, and the model assumes that binding increases SMO's affinity for the membrane and that signalling is proportional to the amount of SMO there. A fast decay rate removes SMO from the membrane. An inset on the right shows the Smoothened structure shifting from inactive and locked to active and unlocked when cholesterol binds.",
      caption:
        "The reactions in the GPCR model: cholesterol moving between the membrane leaflets, PTCH1 acting on that distribution, and SMO activating when it binds cholesterol at the domain facing outward.",
      ratio: "wide",
      source: "Structure inset after the published Smoothened cryo-EM models.",
    },
    {
      kind: "prose",
      heading: "Two things we could not decide from the literature",
      body: [
        "Rather than pick, we built both and let the results choose. **PTCH1's action** is implemented once as a linear relationship and once with enzyme kinetics. On Dr. Sauro's advice on model formulation, we implemented both and looked for disagreement with the objectives below; if neither could be ruled out on performance, we would favour the linear one for simplicity.",
        "**How SMO reaches the cilium** is the second. One account has SMO move into the membrane and diffuse along it to the cilium; the other has it travel inside the cell. We implement the second as a diffusion equation, where SMO moves between the cell body and the cilium to balance the two concentrations, and intend to implement the first as well and see which better matches experiment.",
      ],
    },
    {
      kind: "figure",
      id: "migration-models",
      src: "model/migration-models.webp",
      alt: "The alternative route for SMO reaching the cilium. The same cilium and plasma membrane as the previous figure, with cholesterol, SMO, PTCH1 and the Hedgehog ligand in a key. SMO is synthesised in the cytoplasm and migrates to the plasma membrane, then reaches the ciliary membrane by lateral diffusion along it. A red cross marks the base of the cilium, showing that the intracellular route between the cytoplasm and the cilium is closed in this version of the model.",
      caption:
        "The route we did not implement. Here SMO reaches the cilium by diffusing along the membrane rather than travelling through the cell, and the red cross marks the path that version closes off.",
      ratio: "wide",
    },
    {
      kind: "table",
      id: "objectives",
      heading: "What the model has to reproduce",
      intro:
        "Five observations from the literature, chosen before fitting. A set of parameters is scored on how closely the simulation reproduces all five.",
      columns: ["Observation", "The target"],
      rows: [
        [
          "Cholesterol transport by PTCH1, taken from its close relative NPC1 at the lysosomal membrane",
          "A decay rate of 0.09 per minute for outer-leaflet cholesterol after activation",
        ],
        [
          "How much outer-leaflet cholesterol is removed on activation",
          "Abundance falls to 0.429 of its original amount",
        ],
        [
          "SMO's sensitivity to Hedgehog, from its half-maximal concentration of 1 nM",
          "A twofold difference in signalling between a 1 nM run and a fully activating 300 nM run",
        ],
        ["How fast SMO leaves the cytoplasm", "A half-life of 20 minutes"],
        [
          "How fast SMO is degraded once activated",
          "A half-life of 2 hours at the ciliary membrane, measured after the peak",
        ],
      ],
      source:
        "Sources include Wustner 2023, Kinnebrew 2021 and 2022.",
    },
    {
      kind: "prose",
      id: "gpcr-results",
      heading: "What the two models did",
      body: [
        "Both replicated the five objectives with accuracy, and the **linear model reached a total error of 0.14**. The Michaelis-Menten figure is quoted differently in two versions of the analysis, so it is not published here until the subteam settles which run is right.",
        "Both simulations hold details we would want to confirm against real data. Although a target half-life for SMO in the cytoplasm should have forced a realistic response, the linear model shows an immediate spike in activated SMO. In the Michaelis-Menten simulation, activated SMO is very low. The sensitivity analysis reflects the same split: the ciliary degradation rate dominates the linear model, while the forward rate for SMO embedding into the membrane dominates the other. Given the adequate fit, we expect to go forward with the linear approximation of PTCH1 kinetics.",
        "The most useful thing now would be wet lab data on how SMO migrates at the cilium, and on whether that immediate rise in activated SMO is seen under a microscope at all.",
      ],
    },
    {
      kind: "figure",
      id: "gpcr-simulations",
      caption:
        "The two candidate models run against the five objectives, with their sensitivity analyses side by side.",
      owner: "Kinetic Modelling",
      ratio: "wide",
    },
    {
      kind: "narration",
      section: "Sensitivity analysis",
      id: "sensitivity-analysis",
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
    },
    {
      kind: "details",
      id: "how-sensitivity-was-run",
      heading: "How the analysis was run",
      summary: "The solver, the method and the window, for anyone reproducing it.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Six quantities were tracked over a simulated 120 hours: cytoplasmic, ciliary and ubiquitinated SMO, the MMM complex, its non-functional form, and the complex joined to the linker. The model was written in **Antimony** and run in **Tellurium**, using libRoadRunner's CVODES integrator at tight tolerances.",
            "For every quantity and every parameter, the derivative of one with respect to the other was obtained from libRoadRunner's forward sensitivity solver, which integrates the sensitivity equations alongside the model itself. Every coefficient was then normalised so the parameters could be compared directly. For the chart above, each parameter was moved by ten percent either way, one at a time, and the whole model re-simulated.",
            "A **global** analysis is also under way, using Morris screening followed by Sobol analysis, on the principle that a parameter flagged as uninfluential by both can be dropped from the model. The Morris pass has run; the Sobol results are not finished.",
          ],
        },
        {
          kind: "figure",
          id: "global-sensitivity",
          caption:
            "The global analysis: Morris screening and Sobol indices side by side, with the parameters both methods find uninfluential marked.",
          owner: "Kinetic Modelling",
          ratio: "wide",
        },
      ],
    },
    {
      kind: "prose",
      section: "Safety: the melanocortin pathway",
      id: "mc4r-safety",
      heading: "Checking it cannot do harm somewhere else",
      body: [
        "[The up arm](/description#two-arms) works by pulling the MMM complex apart. That frees MGRN1, and MGRN1 has another job: with a different partner called ATRN it controls **MC4R**, a receptor in the pathway that regulates appetite and body weight. If our binder released a flood of MGRN1 into that other role, we could be causing a metabolic side effect while congratulating ourselves on the ciliary result.",
        "So we modelled it. Adding binder does shift MC4R, but the effect is **small and it saturates**: about 2.3 percent at 50 nM, and still only **2.75 percent at 500 nM**, well under the 20 percent we had set as the point where an effect becomes biologically meaningful. Past about 50 nM, adding more binder changes nothing. The reason is that MGRN1 is the scarce component at roughly 0.18 nM in total, so there is only so much of it to redistribute no matter how hard we push.",
        "The useful part is that this holds regardless of how good our binder turns out to be. In the global sensitivity analysis the binder's own binding strength had **zero** influence on the MC4R result, which means we do not have to trade therapeutic dose against this particular risk.",
      ],
      source:
        "Abundances from PaxDb; Kong et al. 2020 and 2025.",
    },
    {
      kind: "details",
      id: "mc4r-variables",
      heading: "How the safety model is built",
      summary: "Why mass action rather than Michaelis-Menten, and the five quantities it follows.",
      blocks: [
        {
          kind: "prose",
          body: [
            "The model is written in Python through the Tellurium interface built by the Sauro lab, and uses **mass-action kinetics**. MGRN1 and MC4R are both membrane-bound, so they do not satisfy the assumption of freely diffusing soluble reactants that classical Michaelis-Menten rests on. More decisively, MC4R sits at about 0.06 nM, orders of magnitude below the usual Km of a ring E3 ligase, and in that regime mass action is the exact simplification of Michaelis-Menten rather than an approximation of it.",
          ],
        },
        {
          kind: "table",
          columns: ["Quantity", "What it is", "Where its starting value comes from"],
          rows: [
            [
              "**M_free**",
              "Free cytoplasmic MGRN1, bound to nothing. The competition point: any MGRN1 the binder frees passes through here before it can reach ATRN.",
              "PaxDb, 0.03 ppm",
            ],
            [
              "**M_MMM**",
              "MGRN1 held inside the full complex at the plasma membrane. This is what the binder reduces.",
              "PaxDb, scaled by the share of MGRN1 in the complex measured from the published MOSMO figure",
            ],
            [
              "**M_ATRN**",
              "MGRN1 bound to ATRN, the complex that ubiquitinates MC4R. The off-target effector: if this rises when binder is added, MC4R is affected.",
              "Kong et al. 2025",
            ],
            [
              "**MC4R_s**",
              "Surface MC4R available for melanocortin signalling. The safety readout.",
              "PaxDb, 0.01 ppm",
            ],
            [
              "**f_MB**",
              "The fraction of binding sites on MEGF8 occupied by the binder, from none to full saturation.",
              "Benchmarked against a published nanobody against the same site",
            ],
          ],
          caption:
            "A sixth quantity, ubiquitinated MC4R on its way to the lysosome, is tracked only so the mass balance closes.",
          source: "Abundances from PaxDb.",
        },
      ],
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
    },
    {
      kind: "prose",
      section: "Protein modelling",
      id: "protein-modelling",
      heading: "Modelling the binder against its target",
      body: [
        "The binder design process is technically finished once a backbone and a sequence exist. In practice it would rarely produce a binder that works at a bench without a third step: predicting the structure back and checking it. We used **RoseTTAFold3** alongside molecular visualisation software to improve hotspot selection run by run, and to choose which 96 of several thousand designs to order and test. The pipeline that produces them is written up on [contribution](/contribution#pipeline).",
        "RoseTTAFold3 is an open-source deep learning model built jointly by the Institute for Protein Design and Microsoft AI for Good, trained on processed protein structural data. It is not a physics model. It is very good at predicting protein to protein interactions of the kind this project depends on, but its scores are empirically useful rather than estimates of the physical constants that describe how tightly two molecules hold each other.",
      ],
    },
    {
      kind: "prose",
      id: "transmembrane",
      heading: "The filter we had to write ourselves",
      body: [
        "Our targets sit in a membrane, and many of our designs tried to bind the part of them buried inside it. **MOSMO has four helices crossing the membrane and MEGF8 has one.** A binder reaching those helices is impossible in a living cell, so every such design had to go, and no published filter does this.",
        "So we wrote one. We identified by hand which residues of MOSMO and MEGF8 sit within the membrane, then drew a radius of **5 to 10 Angstrom** around them. A design whose own atoms enter that region is treated as membrane-embedded and fails the filter, which takes it out of both the final set and the redesign pool. This is the step that cut the surviving designs from 255 to about 25, described as it happened in [the second design cycle](/engineering#cycles).",
      ],
    },
    {
      kind: "details",
      section: "Sources",
      id: "sources",
      heading: "The literature this page rests on",
      summary: "Twenty sources, for the kinetic models and the safety model.",
      blocks: [
        {
          kind: "references",
          heading: "Sources",
          items: [
            { n: "1", text: "Zie et al., 2014. Annals of Neuroscience.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4117150/" },
            { n: "2", text: "Arensdorf et al., 2017. Trends in Pharmacological Sciences.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4593303/" },
            { n: "3", text: "Taipale et al., 2002. Nature.", href: "https://doi.org/10.1038/nature00989" },
            { n: "4", text: "Kinnebrew et al., 2022. Science Advances.", href: "https://doi.org/10.1126/sciadv.abm5563" },
            { n: "5", text: "Luchetti et al., 2016. eLife.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5123864/" },
            { n: "6", text: "Zhu et al., 2024. Biophysical Journal.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11617633/" },
            { n: "7", text: "Hasnovic and Mus-Veteau, 2018. Cells.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6115939/" },
            { n: "8", text: "Wang et al., 2009. Proceedings of the National Academy of Sciences.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2650314/" },
            { n: "9", text: "Rohatgi et al., 2009. Proceedings of the National Academy of Sciences.", href: "https://doi.org/10.1073/pnas.0813373106" },
            { n: "10", text: "Wustner et al., 2023. Frontiers in Cell and Developmental Biology.", href: "https://doi.org/10.3389/fcell.2023.1144936" },
            { n: "11", text: "Kinnebrew et al., 2021.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8654371/" },
            { n: "12", text: "Milenkovic et al., 2009. Journal of Cell Biology.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2779247/" },
            { n: "13", text: "Kong et al., 2020. Developmental Cell.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7686252/" },
            { n: "14", text: "Kong et al., 2025.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12752501/" },
            { n: "15", text: "Mathieson et al., 2018. Nature Communications.", href: "https://doi.org/10.1038/s41467-018-03106-1" },
            { n: "16", text: "Choi et al., 2018. PLOS Computational Biology. The Tellurium environment." },
            { n: "17", text: "Berg and Purcell, 1977. Biophysical Journal." },
            { n: "18", text: "Shenoy, 2007.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3463220/" },
            { n: "19", text: "Doherty and McMahon, 2009.", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3727619/" },
            { n: "20", text: "PaxDb, the protein abundance database.", href: "https://pax-db.org" },
          ],
        },
      ],
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
    kind: "figure",
    id: "platform-fit-chart",
    src: "ihp/platform-fit.png",
    alt: "A flowchart. Are you working with the cilia? If no, another tool may be more suitable. If yes, are you focusing on protein targets? If no, another tool. If yes, are those proteins transmembrane and localised to the ciliary membrane? If no, another tool. If yes, are you manipulating abundance or just looking for a protein tag? Tagging leads to: are you targeting SMO? Yes leads to: use our proof of concept, with a button labelled Our Workflow. Manipulating abundance, or tagging something other than SMO, leads to: do you already have a targeting binder or antibody? Yes leads to: use our platform to design your own ciliary abundance modulator, with a button labelled Our Platform. No leads to: use our guide to design a de novo protein binder for your target protein, with a button labelled Our Implementation Strategy, and then on to the platform.",
    caption:
      "Is our platform right for your project? Start at the top left and follow the arrows. The same questions are below as something you can answer.",
    ratio: "wide",
  },
{
    kind: "flowchart",
    section: "Deliverables",
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
        action: { label: "Our workflow", to: "/implementation#workflow" },
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
    kind: "prose",
    id: "technology-evaluation",
    heading: "Technology evaluation",
    body: [
      "We first wanted to provide researchers with a way to evaluate whether their research project will benefit from our ciliary platform. Not every protein is connected to ciliary function, and proteins in the ciliary membrane can also have important functions in other pathways of the cell. This is why it is important to determine if their research question and targets are even suitable fits for our platform's approach of modifying the ciliary membrane. Otherwise, researchers could end up spending a lot of time and resources on a platform that is not appropriate for their experiment.",
      "The flowchart is designed to walk researchers through a list of yes or no questions to decide if their project is suitable for our platform and to clarify what they should consider moving forward. The flowchart includes considerations about the target, intended outcome, and procedure. We hope this allows researchers to make an informed decision about adopting the platform before beginning their experimentation.",
    ],
  },
{
    kind: "workflow",
    id: "workflow",
    heading: "Experimental workflow",
    intro: "Pick a stage to read what it involves.",
    stages: [
      {
        title: "Question",
        body: [
          "Decide what you want to learn about a protein in the primary cilium, and whether the question is really about its ciliary pool rather than the protein across the whole cell. The [technology evaluation](/implementation#platform-fit) above is the quick version of this step.",
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
  },
{
    kind: "prose",
    id: "workflow-notes",
    body: [
      "Many researchers are wary of using a novel platform since there are no detailed validated protocols they can refer to along their project. Our proof of concept demonstrates that the ciliary platform can be used to modulate SMO, but applying the platform to other ciliary proteins will require researchers to modify the information provided accordingly. We wanted to make the experimentation process easier by providing clear details of what we have validated at each stage and guidance on how researchers can build off of that.",
      "The high-level workflow details how scientists can apply the platform to their own research question, identify an appropriate target, modulate its ciliary localisation, and validate whether the experiment produced the intended outcome. We hope this workflow will provide researchers with a guide of what to consider at each step and how to effectively use our platform experimentally.",
      "The guide will also provide appropriate readouts for validation at each stage, so researchers can move forward confidently or modify their experiment early on. Our troubleshooting and best practices instructions will offer newer researchers experiments to test out rather than leaving them to determine the protocol entirely on their own.",
      "While this workflow is not a specific protocol researchers can follow, we hope it provides them with a general understanding and guidance for applying our ciliary platform to their own research projects. Our validation and troubleshooting steps throughout will allow them to reduce experimental error and gain confidence in using our novel platform.",
    ],
  },
{
    kind: "todo",
    body: [
      "Two parts of the guide are written but not finished, and go here:",
      "Troubleshooting: what to try when a stage does not give the readout it should.",
      "Best practices: the habits that make the platform behave predictably from one lab to the next.",
    ],
  },
{
    kind: "figure",
    id: "flyer",
    src: "ihp/flyer.jpg",
    alt: "The HedgehogSense flyer. It introduces a research platform for studying the effects of ciliary abundance of transmembrane proteins, explains that the MMM complex is used as an E3 ubiquitin ligase for targeted ubiquitination, lists the two components (a linker system that upregulates ubiquitination by bringing a protein into proximity with the MMM complex, and an inhibitor system that downregulates it by disrupting the MEGF8 and MOSMO interface), shows a structure of the MMM complex, lists potential targets SMO, GPR161, PTCH1, SSTR3 and ARL13B, and gives a QR code and a contact email.",
    caption:
      "The flyer we hand out: what the platform is, its two components, the targets it could be pointed at, and how to reach us.",
    ratio: "tall",
  },
];

/**
 * The roadmap that closes both pages that use it. On Human Practices it is the
 * whole of the last section, because the deliverables it used to follow have
 * moved to Proposed Implementation.
 */
const NEXT_STEPS: Block[] = [
{
    kind: "prose",
    section: "Next Steps",
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
      section: "Stakeholders",
      id: "stakeholders",
      heading: "Who we asked, and what it changed",
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
    },
      {
        kind: "details",
        id: "where-this-started",
        section: "Background",
        // Open on arrival. This block is the whole of the Background section,
        // so collapsed it left the section looking empty. The Show and Hide
        // control stays, so a reader who already knows the pathway can fold it
        // away; it just starts the other way round.
        open: true,
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
    },
      {
        kind: "details",
        id: "location-and-amount",
        heading: "Protein Localization & Abundance",
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
      heading: "Existing Tools",
      intro:
        "From our conversations with stakeholders and examination into contemporary cilia research, here are several tools currently used to modulate protein abundance in the primary cilium.",
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
      source: "References [8] to [20] below.",
    },
{
      kind: "prose",
      id: "the-gap",
      heading: "Unmet Need",
      body: [
        "Across the tools researchers already use, a pattern emerges. Genetic knockouts can ask whether a protein is important, but they usually change protein levels across the whole cell rather than only in the primary cilium [8, 9]. Small molecule antagonists and inducible degrons add more control over when a change occurs, but still do not reliably distinguish between a protein's action in the primary cilium and elsewhere in the cell [13, 14, 15]. Approaches that perturb ciliary trafficking or ciliary ubiquitination can act solely within the cilium, but often affect many proteins at once rather than one chosen target [16, 17, 20]. Targeted protein degradation improves target specificity, but most existing systems are still designed to act across the cell surface rather than selectively on the ciliary membrane [18, 19].",
        "Click on [Market Model](/human-practices#market) to learn more about the quantitative economic gap.",
        "Together, these tools point to a common gap. A useful ciliary research tool would need to combine several abilities that are currently spread across different technologies.",
      ],
    },
{
      kind: "facts",
      id: "four-requirements",
      heading: "Core Requirements",
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
      navLabel: "Existing Tool Limitations",
      intro:
        "Combining these features gives researchers a much easier way to study the impact of a specific protein on the ciliary membrane independently of the rest of the cell, while also testing how different levels of that protein change signalling and cellular pathways.",
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
        "Capability assessment based on the literature review above, indicating a biological opportunity for a technology with tunable, target specific, timely control in the primary cilium.",
    },
{
      kind: "callout",
      id: "our-system",
      label: "our system",
      heading: "What we are building",
      navLabel: "Our Platform",
      body: [
        "To address this gap, we are developing a research tool for modulating protein abundance on the primary cilium. Our system uses the MMM complex, a ciliary membrane associated ubiquitination complex that naturally regulates Smoothened in the Hedgehog signalling pathway, and redirects its E3 ubiquitin ligase activity toward a chosen ciliary membrane protein. By bringing the target protein and the MMM complex into close proximity, our goal is to give researchers more control over how much of a target protein remains in the primary cilium. Rather than replacing existing tools, the platform is designed to combine the strengths of several of them into a system built specifically for ciliary biology.",
        "[Learn more about our system](/description)",
      ],
    },
{
      kind: "prose",
      id: "why-it-matters",
      heading: "Why this capability matters",
      navLabel: "Research Value",
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
      navLabel: "Founder\u2019s Theory",
      body: [
        "We believe that understanding ciliary signalling requires more than knowing whether a protein is present or not. A useful research tool should give researchers control over the target protein, and over when, where, and by how much its abundance changes. In the primary cilium, these factors shape the impact of signalling proteins on cellular pathways. A research tool that can independently control these variables lets scientists uncover signalling thresholds and cilium-specific functions that are difficult to separate with current methods. As we continue speaking with researchers and validating our platform, this theory will also continue to evolve alongside the needs of the community.",
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
      heading: "Estimating the Market for Ciliary Tools",
      navLabel: "Market Estimate",
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
        navLabel: "Estimation Method",
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
        navLabel: "Adjacent Markets",
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
      heading: "Translation Goals",
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
      heading: "Decision Framework",
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
      navLabel: "Stakeholder Insights",
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
      navLabel: "User Segments",
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
          "We include controls to check that the [effect really comes from MMM activity](/experiments#exp1-design), and use [modelling](/model#mc4r-safety) to look for possible off-target effects on other pathways.",
          "Researchers can interpret results with more confidence, knowing that the observed effect was caused by altering the intended protein's abundance rather than by damage to the cilium or broad signalling disruption.",
        ],
      ],
    },
{
      kind: "prose",
      id: "what-adoption-means",
      heading: "What adoption now means to us",
      navLabel: "Adoption Criteria",
      body: [
        "At the start of our project, adoption depended on whether the platform succeeded in changing protein abundance in the primary cilium. Through our conversations with researchers and our examination of existing technology, that definition has become much broader. A tool is not useful just because it works once in our hands. The eventual user, another researcher, needs to be able to understand what the tool is doing, trust the results, reproduce the tool, and adapt it to their own research question. Feedback around biological relevance, validation, efficiency and unintended effects gave us the framework and the steps needed to shift our focus toward these wider requirements.",
        "Now, for us, successful adoption means developing a platform that is not only functional, but also specific, tunable, well validated, adaptable, and biologically interpretable. These principles guide how we evaluate our current proof of concept, and how we think about sharing our platform with future researchers.",
      ],
    },
{
      kind: "table",
      id: "implementation-strategy",
      heading: "Delivery Selection",
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
      heading: "Platform Package",
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
        "Any exciting scientific advancement must also be used with the utmost responsibility. Tampering with the cilium could have unintended consequences throughout the body, or be used unethically. We aim to prevent unintended consequences by [modelling off-target effects](/model#mc4r-safety) and by using custom technology such as de novo protein design to reach a high level of target specificity. We likewise aim to keep our protocols open source, so that other scientists can reach a high level of specificity for their own target of interest.",
        "That is a claim we have tested once, on ourselves. The clearest predictable off-target risk in our own design is the melanocortin pathway: the up arm works by prising the MMM complex apart, which frees MGRN1, and MGRN1 has a second job with a different partner regulating **MC4R**, and so appetite and body weight. We modelled it before building anything. The effect is small and it saturates, reaching [2.75 percent at 500 nM](/model#mc4r-dose), a dose ten times higher than anything we would use, against the 20 percent we had set in advance as the point where an effect becomes biologically meaningful. It also does not depend on how good our binder turns out to be, because MGRN1 is the scarce component at roughly 0.18 nM and there is only so much of it to redistribute.",
        "One worked example is not a guarantee about every protein a future user might point this at. What it does give is a method we can hand on: before going near a bench, name the other partners the ligase already has, and model the competition for it. That check belongs in what we give anyone adopting the platform, not just in our own notes.",
        "The possibility that a target of interest could be detrimental to someone's health also deserves consideration. The cilium is responsible for far more than cancer: it is implicated in wound healing, phototransduction, mechanosensation, cardiovascular fibrosis, bone development, kidney health, and much more [1]. Just as our technology can bring the cilium into homeostasis, it can also be used to cause dysregulation. A complete understanding of the target mutation is a prerequisite for using our technology, along with transparency and informed consent among any clinical candidates that come from our platform.",
        "Further, the cilium is foundational to early developmental processes. While our technology opens the possibility of tuning ciliary receptors with a precision other therapeutics lack, using it to fine tune developmental biology raises a number of ethical alarm bells. Given that many of the conditions our tool could be adapted to treat are diagnosed before birth, and given the histories of developmental biology in eugenicist movements, we must stay critical of the technology we create. The most straightforward recommendation we often see is that such a technology should only be used as an intervention when the health of an individual could reasonably be compromised. But that leaves much to common notions of health and of the individual. The exclusionary box of traditional health often fails to recognise disability as anything but an avenue of suffering; we maintain that our technology is not, and will never be, a cure for developmental conditions, but a tool that can be used to develop treatments for life-threatening conditions. And the only individual typically discussed is the child; we maintain that more research is needed on the effects of ciliary signalling on the health of birthing mothers.",
        "Given this long list of concerns about our platform, a question arises: is it ethical to leave a technology this foundational open source? We hope a direct comparison can help.",
      ],
    },
{
      kind: "cards",
      id: "openness",
      heading: "How open should our platform be?",
      navLabel: "Access Model",
      items: [
        {
          title: "Open source",
          body: ["**For:** easy for scientists to adapt; builds trust with users; lowering barriers to access allows more widespread use by scientists.", "**Against:** once the technology is out of our hands we have no control over it, and open source projects typically struggle to get startup funding without guaranteed profit."],        },
        {
          title: "Private and proprietary",
          body: ["**For:** we hold whole responsibility over our technology, and can prevent misuse by requesting purposes and methods from clients.", "**Against:** some would argue we should not have sole authority over the use of a research platform; a lack of trust and transparency; and a higher barrier to entry for scientists."],        },
      ],
    },
{
      kind: "prose",
      body: [
        "Given the advice we have received from a number of stakeholders on developing a research platform, we are choosing to keep much of our research open and available, while maintaining responsibility with guardrails for our technology.",
      ],
    },
...NEXT_STEPS,
      {
        kind: "details",
        id: "references",
        section: "References",
        heading: "References",
        summary: "Sources in IEEE format.",
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
    "Science is everywhere in the world around us. The medicine we take, the food we eat and many of the technologies we rely on to survive are all shaped by biology. Synthetic biology expands on this: given what we know about biology, how could we use that knowledge to make something impactful?",
  blocks: [
    {
      kind: "prose",
      id: "imagining",
      heading: "Imagining SynBio education",
      body: [
        "Before we start imagining all the exciting technology synthetic biology can create, we need to first understand it. For many people, **science feels distant**. At the start of the year, we asked our peers how accessible learning science was to them. The most common response we received was that it was simply too daunting: complicated terminology, expensive laboratories, and the commitment of years of education were some of the reasons cited. We believe **it shouldn't have to feel that way**.",
        "To reimagine scientific education, throughout the year we asked ourselves: **what should synthetic biology education look like?**",
        "From all the events that we hosted, we kept four themes in mind. Our biggest takeaway: there is no single way to learn science, and anyone can become a scientist. **Here is our imagination.**",
      ],
    },
    {
      kind: "cards",
      id: "should-be",
      heading: "SynBio should be...",
      items: [
        {
          title: "Engaging",
          body: "Encouraging people to ask questions and explore the concepts they are interested in. [The hotline, trivia tabling and iGEM Alchemy](/education#hotline).",
        },
        {
          title: "Accessible",
          body: "Giving people the tools to understand science regardless of age or experience. [DNA polymerase and how to read a paper](/education#polymerase).",
        },
        {
          title: "Fun for all ages",
          body: "Because learning about DNA or biotechnology can be interactive. It doesn't have to come from a textbook! [A whodunnit, a bracelet and bingo](/education#whodunnit).",
        },
        {
          title: "Inspiring",
          body: "Showing people not only what scientists have already accomplished, but also what they themselves can **accomplish one day**. [A speaker series and the scientists you might not know](/education#speakers).",
        },
      ],
    },
    {
      kind: "stats",
      id: "by-the-numbers",
      heading: "By the numbers",
      items: [
        { value: "12,000+", label: "students, parents and educators invited to Engineering Discovery Days" },
        { value: "2,700+", label: "views of the paper-reading series across YouTube and Instagram" },
        { value: "$5", label: "or less to build one Can You Beat DNA Polymerase kit", emphasis: true },
        { value: "5", label: "handbooks and guides to download and run these activities" },
      ],
    },

    {
      kind: "prose",
      section: "Engaging",
      id: "hotline",
      heading: "SynBio Hotline",
      body: [
        "While some STEM concepts have been widely elucidated for the wider public, we've found that **synthetic biology has not been commonly understood**, leading to the field often feeling out of reach for a general audience. This could perhaps be due to a lack of familiarity with the phrase in popular media, confusion surrounding what SynBio is, or hesitation from individuals to jump into a new, unknown field of study. As a result, we wanted to create an **interactive, judgement-free space** where anyone could ask anything about SynBio and get a detailed answer and explanation to their question. We challenged our viewers to consider what they were curious about and to learn more about the life sciences. By doing so, we aimed to **open dialogue** with the general public in the most open forum in history: **the internet**. By taking inquiries seriously and engaging in scientific conversation, we hoped to be in constant conversation with public perceptions of science.",
        "For our answers, we wanted to create content that would be both **engaging and informative**. One of the biggest barriers to science for the general public is that most people do not have a scientist in their life; that, combined with our interactive format, eventually became the **SynBio Hotline**. We asked people to email in their questions about SynBio for us to research and respond to publicly through **short-form content**, an approach we were inspired to take by the journal **Nature**. It recently published an article stating that \"**social-first and visual content** is likely to become the dominant form of news. If science communicators want to remain relevant, they need to embrace this change\" [1]. The choice of platform was led in part by wanting to **lower barriers to access**, and in part by wanting to **meet audiences where they were**. Science as a field has slowly been adapting to social media, and with most people using these platforms to access information, we wanted to open up the forum and answer scientific questions ourselves.",
      ],
    },
    {
      kind: "links",
      id: "hotline-reels",
      heading: "Two answers from the hotline",
      items: [
        {
          title: "SynBio Hotline, first answer",
          body: "A question sent in by a viewer, researched by the team and answered as a short video.",
          href: "https://www.instagram.com/reel/DagitZuhIZp/",
          tag: "Instagram reel",
          label: "Watch",
        },
        {
          title: "SynBio Hotline, second answer",
          body: "The next question from the inbox, answered the same way.",
          href: "https://www.instagram.com/reel/DbTz1VMyYaK/",
          tag: "Instagram reel",
          label: "Watch",
        },
      ],
    },
    {
      kind: "prose",
      id: "trivia",
      heading: "Trivia tabling",
      body: [
        "Although students learn the fundamental concepts of each science subject in school, they often have fewer chances to explore the **real-world applications of science**. To fill this gap, we hosted an interactive trivia challenge at club fairs, giving local high school and college students a **fun, low-stakes introduction to the world of SynBio**. By asking participants to come in with an open mind, we wanted to build enthusiasm for and awareness of the field of synthetic biology.",
        "Participants began by spinning a wheel to choose their trivia category. Four of the categories, Sustainable Synthetic Biology, (Bio)Ethics and Policy, Synthetic Biology Techniques, and Famous Scientists, quizzed participants on everything from lab procedures to ethical considerations, representing the considerations made by members of every iGEM subteam. We wanted to open the floor to dialogue around **public perceptions** of SynBio through our ethics section, with questions that asked participants to rethink how science affects our everyday lives. Alongside these more general questions, we included a fifth wild-card category, Washington iGEM, about the design principles behind our team's past projects, to give real-world examples of how **anyone can get involved in SynBio**. By preparing and presenting a diverse range of trivia questions, we aimed to show the public that synthetic biology can be fun and for everyone, whatever their background.",
      ],
    },
    {
      kind: "gallery",
      id: "trivia-photos",
      images: [
        { src: "education/trivia-4.jpg", alt: "Three team members behind the Washington iGEM table at a club fair, giving thumbs up, with the trivia wheel and a bowl of sweets in front of them." },
        { src: "education/trivia-2.jpg", alt: "Two team members at an outdoor club fair table with the spinning trivia wheel, stickers and handouts." },
        { src: "education/trivia-3.jpg", alt: "A student stopping at the table to try a trivia question." },
        { src: "education/trivia-1.jpg", alt: "The table set up indoors, with laptops showing the team's work beside the trivia wheel." },
      ],
    },
    {
      kind: "cards",
      id: "trivia-examples",
      heading: "Three questions from the table",
      intro: "Each card is a question we asked, its answer, and where the conversation went next.",
      items: [
        {
          title: "Pound for pound, what naturally made, protein-based fibre is five times stronger than steel?",
          body: "**Spider silk!** The unexpected strength of spider silk is a fun bit of science trivia that many people have heard before. But once students learned just how strong spider silk actually is, our conversations quickly moved towards imagination, as students thought of how spider silk could be used and how people have made their own. This question served as a fun reminder of a popular fact, while highlighting how synthetic biologists take ordinary discoveries from nature to solve new problems.",
        },
        {
          title: "Washington iGEM students come from many backgrounds. Which of these majors has been represented on the team: electrical engineering, computer science, finance, anthropology, or all of the above?",
          body: "**All of the above!** Although most students answered this question correctly, many were still surprised to see finance and anthropology majors taking part in a synthetic biology competition. By discussing everything an iGEM team does, from wiki development to fundraising, many students realised how much of our project, and of synthetic biology as a whole, happens outside the lab. Students of all majors were excited to realise that iGEM had a place for them too.",
        },
        {
          title: "Which two women scientists discovered a way to edit the human genome with CRISPR-Cas9 and won the 2020 Nobel Prize in Chemistry?",
          body: "**Jennifer Doudna and Emmanuelle Charpentier!** With CRISPR-Cas9's broad-reaching impact on scientific research and medicine, it is hard to believe that Doudna and Charpentier's invention is not even twenty years old. This led students to reflect on the rapidly growing field of synthetic biology. Students were also eager to share ideas about bioethics, and to think of ways to make CRISPR-Cas9 and other technologies safer and more accessible.",
        },
      ],
    },
    {
      kind: "prose",
      id: "alchemy",
      heading: "iGEM Alchemy",
      body: [
        "Students are rarely excited by rote memorisation, especially in a subject like biology, where so much of the early material is vocabulary. Yet that is often how the molecules of life are first introduced: as a list of terms to learn, not as things that are built from one another. We've found that some of the best ways to **connect with younger students**, from middle to high school, are through games. This year, we set out to fill the niche of an interactive synthetic biology browser game.",
        "**Little Alchemy** is a classic browser game in which players start with a handful of base elements and combine them to create new ones, eventually unlocking almost any concept or physical object. Our version has players start with the **basic building blocks of life**: carbon, hydrogen, oxygen and nitrogen. Each level has a specific target to reach, such as synthesising a protein, DNA, or a cell organelle.",
        "We chose this format because it **mirrors how biology works**, with complex structures built up from simpler pieces. Instead of being told that amino acids make up proteins, players find it out for themselves by trying combinations and seeing what they get. A combination that doesn't work costs nothing, so students are free to **guess, experiment and try again**, a cycle that echoes the **engineering cycle** we practised this year. The stage targets give newer students a clear direction, while those with more background can explore what else they can build along the way. Our goal was to make the molecules of life feel less like vocabulary words and more like something students can put together themselves.",
      ],
    },
    {
      kind: "recipe",
      id: "alchemy-recipe",
      intro:
        "One combination from the first level. Nobody is told this one: you find it by putting two things together and seeing what happens.",
      inputs: [
        { id: "hydrogen", label: "Hydrogen" },
        { id: "oxygen", label: "Oxygen" },
      ],
      makes: { id: "hydroxyl", label: "Hydroxyl group" },
      action: { label: "Play iGEM Alchemy", to: "/alchemy" },
      source:
        "It runs in the browser, on a phone or a laptop, and saves progress on the device.",
    },

    {
      kind: "prose",
      section: "Accessible",
      id: "polymerase",
      heading: "Can you beat DNA polymerase?",
      body: [
        "Whether through news broadcasts, science fiction or school, people of all ages and backgrounds have become familiar with the term \"DNA\". However, despite widespread awareness of DNA as the \"blueprint of life\" and of its importance in genetics, public understanding largely stops there.",
        "Our activity, **Can You Beat DNA Polymerase**, was designed to introduce elementary and middle school students to the foundations of synthetic biology by guiding them through the process of DNA replication. Using the basis of widely recognised stacking toys, we challenged students to act as DNA polymerase, attaching the corresponding base pairs to a given template strand. This pushed students to think beyond common notions of DNA as \"the information encoding ourselves\" and to ask questions about how and when it is used. By pairing a complicated topic like DNA replication with the simple task of racing another player to build a complementary strand, we hoped to break these concepts down into more tangible ideas.",
        "We brought this activity to life at the University of Washington's Engineering Discovery Days, a free two-day campus festival that invited over 12,000 students in grades 4 to 8, parents and educators from across Washington State. Given the broad age range of participants, we adapted the activity to be more versatile. Throughout the event we encouraged participants to ask questions, and took the opportunity to discuss how errors in the activity correspond to mutations. Older participants were told to use uracil instead of thymine, acting as RNA polymerase instead. These adjustments let us tailor each session to our participants' level and build from where they were, making SynBio far more accessible than a fixed lecture would.",
        "While tabling, many educators and parents said they were interested in reproducing our event themselves. Inspired by the success of Engineering Discovery Days, and by educators' feedback about wanting to build their own kits, we created a pamphlet describing how to recreate the activity. To widen access further, our handbooks follow universal design principles while providing the scientific explanations users need. They include written and visual instructions for constructing each station, colourblind-friendly graphics, and recommended materials that let each kit be built for less than five dollars a set.",
      ],
    },
    {
      kind: "gallery",
      id: "polymerase-photos",
      images: [
        { src: "education/discovery-days-1.jpg", alt: "The Can You Beat DNA Polymerase tent at Engineering Discovery Days, with a crowd of schoolchildren around the table." },
        { src: "education/discovery-days-2.jpg", alt: "Students at the table racing to build a complementary strand on the bead-and-dowel stations." },
      ],
    },
    {
      kind: "links",
      id: "polymerase-handbook",
      intro: "Run it yourself.",
      items: [
        {
          title: "Can You Beat DNA Polymerase? Instructional manual",
          body: "How to build each station for under five dollars, run the race, and talk about mutations along the way. Written and visual instructions, colourblind-friendly graphics, and the science behind the activity. Also as an editable [Word document](/education/dna-polymerase.docx).",
          href: "education/dna-polymerase.pdf",
          tag: "PDF, 6 pages",
        },
      ],
    },
    {
      kind: "prose",
      id: "papers",
      heading: "How to read scientific papers",
      body: [
        "Science is often inaccessible because of jargon-filled literature and institutional paywalls. Undergraduate students often struggle to get started on reading scientific literature, so we aimed to build a **foundational understanding** of how to interpret research articles. The result was a tutorial series on how to read research papers, which became recorded **interviews** with first authors of **academic publications**: Dr. Swati Mishra of UW Medicine, and UT Austin graduate students Kangsan Kim and Clay Kosonocky with postdoc Dr. Nikol Kaderabkova. By putting a face to the technical terminology, we aimed to **improve scientific literacy** and make innovations in research more **approachable**. Our goal was to make science a **fun and exciting conversation**, showing middle and high school students that academia does not have to be daunting or unfeeling.",
        "Along with the videos, we provided short worksheets for **educators** to distribute to students, to improve their **engagement** with and understanding of the publications presented. The series has reached over **2,700 views** across YouTube and Instagram.",
      ],
    },
    {
      kind: "video",
      id: "papers-videos",
      videos: [
        { id: "RrI6ntMJaOw", title: "Episode 1: Dr. Swati Mishra, UW Medicine", note: "Reading a paper with its first author." },
        { id: "EPahLOWcFTI", title: "Episode 2: Clay Kosonocky, Dr. Nikol Kaderabkova and Kangsan Kim, UT Austin", note: "Three authors on how they read, and write, a paper." },
      ],
    },

    {
      kind: "prose",
      section: "Fun for all ages",
      id: "whodunnit",
      heading: "A SynBio whodunnit!",
      body: [
        "We wanted a fun SynBio event for younger children that both sparked curiosity and taught the foundational skills every scientist needs. Most education events aimed at a younger audience give little detail about the field itself and focus on the scientific method, which, while important, leaves many children without a sense of what science actually looks like. We wanted to keep the audience excited, which led us to a \"murder mystery\" activity. Taking inspiration from the board game Clue, and giving a high-level view of basic laboratory techniques, we broke the activity into three parts.",
      ],
    },
    {
      kind: "steps",
      id: "whodunnit-steps",
      heading: "Three departments, three clues",
      items: [
        {
          title: "Who committed the crime",
          body: "Students extracted DNA from a strawberry \"sample\", a visual demonstration of the basics of genomics, while learning how DNA makes each living thing unique.",
        },
        {
          title: "Where it was done",
          body: "Students learned how different chemicals have their own properties, such as acidity, by using pH strips on samples taken from different rooms.",
        },
        {
          title: "Which poison was used",
          body: "Students ran paper chromatography with paper towels and food dyes, to see the physical properties that tell compounds apart and watch polarity in action.",
        },
      ],
    },
    {
      kind: "links",
      id: "whodunnit-guide",
      intro: "To keep the activity open and easy to adopt, we wrote up the whole procedure.",
      items: [
        {
          title: "The whodunnit, station by station",
          body: "The script for the coordinator, what each of the three stations needs, and how the clues come together at the end.",
          href: "education/whodunnit.pdf",
          tag: "PDF, 5 pages",
        },
      ],
    },
    {
      kind: "prose",
      id: "baselet",
      heading: "Build a Baselet",
      body: [
        "The central dogma, the flow from DNA to RNA to protein, is the foundation of biology. Everything we learn in the advanced sciences builds on this model, yet it is often not fully understood. Many younger students struggle to see how the three components work together, and find it hard to picture processes that happen at a microscopic scale. We designed a hands-on activity, Build a Baselet, to meet that challenge: an engaging activity that gives a simple, visual introduction to the central dogma.",
        "Each kit contains 12 coloured beads, 2 charms, string, and a detailed handbook. Students first string six coloured beads, each colour standing for a nitrogenous base as set out in the handbook. They then use the RNA base-pairing rules to string six complementary beads. The RNA is split into groups of three to model codons, and with the handbook's amino acid chart students work out which amino acids their RNA codes for. Each amino acid is a charm, so a miniature protein goes onto the bracelet. This simple activity lets students see the general rules behind transcription and translation.",
        "For older students who already understand the central dogma, the handbook offers mutations to try out on the bracelet, to see the effects of different kinds of mutation. That opens up further discussion at whatever level of understanding the group has.",
        "Build a Baselet is designed to be engaging and informative for every age group. The low cost of the materials and the detailed handbook let families reproduce the activity anywhere. After all, who doesn't want to walk away with a fun bracelet *and* a better understanding of one of the most important ideas in biology?",
      ],
    },
    {
      kind: "links",
      id: "baselet-handbook",
      intro: "Run it yourself.",
      items: [
        {
          title: "Build a Baselet handbook",
          body: "Ages 8 to 18, 30 to 45 minutes. The bead colours, the base-pairing rules, the amino acid chart, and the mutations to try. The [latest version](https://docs.google.com/document/d/10bECEVQb0TbHe4U1os_mHrUxQAWD1wqZIO4Ia7t5ic4/edit?usp=sharing) is kept as a Google Doc.",
          href: "education/baselet.pdf",
          tag: "PDF, 6 pages",
        },
      ],
    },
    {
      kind: "prose",
      id: "synbingo",
      heading: "SYNBIngO",
      body: [
        "From a practical point of view, it makes sense that most education efforts are aimed at younger people. What is education for, if not to inspire and lead the next generation? But that leaves the elderly, and most adults, disconnected from the sciences. In America today, academia and the life sciences have only grown further from the general public. To help mend this, we set out to create an education event for older adults: a presentation on how synthetic biology touches their lives, built around how many common medications work. It has a further benefit: people are more likely to trust and stick with a treatment when they understand what is happening in their bodies. To hold attention we also made bingo boards, with a prize for the first bingo. We ended the event with discussion prompts that asked us all to question the sciences and how much they are part of our lives, because we wanted to hear both the anxieties and the excitement people have about the future of synthetic biology.",
      ],
    },
    {
      kind: "links",
      id: "synbingo-guide",
      intro: "Run it yourself.",
      items: [
        {
          title: "SYNBIngO: the presentation, the boards and the prompts",
          body: "Goals, the talk on everyday medications, the bingo boards, and the discussion questions for the end, followed by the slides themselves.",
          href: "education/synbingo.pdf",
          tag: "PDF, 17 pages",
        },
      ],
    },

    {
      kind: "prose",
      section: "Inspiring",
      id: "speakers",
      heading: "Speaker series: Conversations in Synthetic Biology",
      body: [
        "Synthetic biology is a modern, fast-growing field that remains unfamiliar to many students. Its obscurity comes mainly from the fact that SynBio is not part of a typical K-12 curriculum, and most extracurricular resources are written in highly technical language. Our team's goal was to make the field less daunting by introducing students to the scientists who do this kind of work.",
        "We did this through the welcome week event we hosted, Conversations in Synthetic Biology. Our main aims were to show the many disciplines SynBio intersects with and to give students the chance to talk with professionals in the field. We knew, though, that we had to keep the information easy to follow and provide material that students at different levels of familiarity could engage with.",
        "The event opened with the speakers introducing their career journeys, followed by a guided Q&A led by iGEM members. Students were then encouraged to ask their own questions and join the conversation with the panellists.",
      ],
    },
    {
      kind: "gallery",
      id: "speakers-photos",
      images: [
        { src: "education/speakers-1.jpg", alt: "Four panellists at the front of a classroom under a slide reading Guided Q&A, with students listening." },
        { src: "education/speakers-2.jpg", alt: "A full classroom, with students standing at the back, during the panel discussion." },
      ],
    },
    {
      kind: "prose",
      id: "scientists",
      heading: "Scientists you might not know",
      body: [
        "When we hear about major scientific accomplishments, we tend to hear the same few names. Yet many discoveries we take for granted are already woven into everyday science, in wet lab protocols, new therapeutics and medical practice, without our knowing the people behind them.",
        "Here we highlight scientists whose work changed medicine and biotechnology, even though their names do not always appear in textbooks. Their stories show that **scientific progress** does not always hinge on one famous discovery or one famous person. It can come from asking an unexpected question, challenging what people thought was possible, or continuing to investigate when others might have stopped.",
        "The material is written for chemistry and biology **educators**. By tying each story to lessons that already appear across the curriculum, we hoped to **bridge the gap** between the science and the human story behind it. Beyond introducing important innovations, we hope these stories show students that science is shaped by people with many different backgrounds and paths. **Scientific progress** can start with something as simple as staying curious and wanting to keep learning.",
      ],
    },
    {
      kind: "links",
      id: "scientists-doc",
      intro: "For the classroom.",
      items: [
        {
          title: "Scientists You Might Not Know",
          body: "Profiles for chemistry and biology lessons: the people behind aspirin, thalidomide's halt at the FDA, and more. The [latest version](https://docs.google.com/document/d/1oJpNNe-DBpYJ4tP-zd76KM0-249qbn9j4jQ6PlO33eQ/edit?usp=sharing) is kept as a Google Doc.",
          href: "education/scientists.pdf",
          tag: "PDF, 13 pages",
        },
      ],
    },

    {
      kind: "prose",
      section: "What education taught us",
      id: "taught-us",
      heading: "What education taught us",
      body: [
        "We are proud of all the work to come out of our education efforts this year. We created effective spaces for conversation and engagement online through our outreach; we developed adaptable lesson plans and events for other educators to build on; and we fostered community engagement with our peers through several campus events.",
        "Despite that, we have a lot to reflect on. The choice to use short-form content was thoroughly discussed, and while the format found us an audience, we understand that we have to be careful with a platform of such wide reach. We have always tried our best to research our videos thoroughly, and in future we aim to keep using these spaces to foster a dialogue rather than to lecture a mass audience. We also hope to take our lesson plans into a wide variety of community spaces, to reach outside the university.",
        "Our biggest challenge was getting attention. While we did our best not to sensationalise synthetic biology, we struggled to find an audience that was truly excited to hear from us. In future we hope to hold the need for engagement with synthetic biology together with the need to avoid over-promising.",
      ],
    },

    {
      kind: "details",
      id: "references",
      section: "References",
      heading: "References",
      summary: "The source cited on this page.",
      blocks: [
        {
          kind: "references",
          heading: "Engaging",
          for: "Engaging",
          items: [
            {
              n: "1",
              text: "The future of science communication is not an article like this. Nature 654, 8 (2026).",
              href: "https://doi.org/10.1038/d41586-026-01723-1",
            },
          ],
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
  title: "Attributions",
  kicker: "chapter 12 · attributions",
  storyBeat: "None of this was one hedgehog.",
  intro: "What we did ourselves, and what we had help with. Select any card to see the details.",
  blocks: [
    {
      kind: "people",
      id: "advisors",
      heading: "Advisors",
      blurb: "The principal investigators who advise the project and host the work, and the mentors who guided us.",
      flower: "fern",
      people: ADVISORS,
      nameOnly: true,
    },
    {
      kind: "people",
      id: "team",
      heading: "The Team",
      blurb: "Every student on the team, from every subteam.",
      flower: "tree",
      people: STUDENTS,
    },
    {
      kind: "credits",
      id: "support",
      heading: "Support, Software and Inspiration",
      blurb: "The departments, funds and companies that paid for the work or gave us what it needed, the software our design pipeline and model are built on, and the game that inspired the look of this wiki.",
      flower: "bush",
      sets: [
        { label: "Sponsors and support", items: SPONSORS },
        { label: "Software", items: SOFTWARE },
        { label: "Inspiration", items: INSPIRATION },
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
        "Developing this technology was only part of our work. Through conversations with stakeholders, we realised the importance of supplying a reproducible and responsible method for adoption. We aimed to create a platform that would be as easily accessible as possible and could be largely expanded for other usages outside of our Smoothened proof of concept.",
        "The thinking behind that sits on Human Practices: [six kinds of researcher](/human-practices#who-would-use-this) told us what each would need before trusting a tool like this, those needs became our [design requirements](/human-practices#design-requirements), and the [delivery selection](/human-practices#implementation-strategy) compares the small molecule, antibody and protein routes to the component that recognises the target.",
      ],
    },
    ...DELIVERABLES,
    ...NEXT_STEPS,
  ],
};

const parts: Page = {
  slug: "/parts",
  title: "Seeds We Logged",
  kicker: "chapter 06 · parts and registry",
  storyBeat:
    "Every seed saved and labelled, so the next gardener can plant it.",
  intro:
    "The genetic parts we designed for HedgehogSense: what each one is, what it is for, and where it came from.",
  blocks: [
    {
      kind: "prose",
      heading: "Overview",
      body: [
        "We designed two families of genetic parts. One controls the recruitment of the proteins that regulate **SMO**. The other characterises the computationally designed binders we made against **MEGF8** and **MOSMO**.",
        "The first family is ten mammalian expression constructs, covering chemically induced recruitment, ALFA-based recruitment, an experimental control, and two constructs for testing a second ciliary receptor. All ten were ordered from GenScript in pcDNA3.1(+)-based expression vectors.",
        "The second is a set of gene fragments from Twist Bioscience: our designed MEGF8 and MOSMO binders, and the constructs that make up the split-transcription-factor system used to screen them.",
        "This page documents the design, the components and the intended function of each part. What they are used for is on [experiments](/experiments), and when each piece was designed and ordered is in the [notebook](/notebook).",
      ],
    },
    {
      kind: "callout",
      label: "where this stands",
      heading: "Designed and ordered, not yet built",
      body: [
        "Construct design is complete and the GenScript and Twist Bioscience orders are placed. They have not arrived, so nothing here has been assembled, validated or characterised, and no part has been submitted to the Registry yet.",
        "Everything below is a designed and ordered part. Nothing on this page should be read as a characterised one.",
      ],
    },

    {
      kind: "constructs",
      section: "Engineered recruitment constructs",
      id: "recruitment-constructs",
      navLabel: "The ten constructs",
      heading: "Ten mammalian expression constructs",
      intro:
        "All ten were ordered from GenScript in pcDNA3.1(+)-based expression vectors. DmrA and DmrC are the chemically induced dimerisation domains; ALFA and NbALFA are the peptide tag and the nanobody that binds it; His6, HA, eGFP and mCherry are detection and purification tags.",
      groups: RECRUITMENT_CONSTRUCTS,
      footnote:
        "Domain widths are not to scale. The catalytically inactive MGRN1 carries the C279A and C282A substitutions, and the MEGF8 construct carries only its intracellular domain, residues 2602 to 2778.",
    },
    {
      kind: "prose",
      section: "Binder screening constructs",
      id: "screening-constructs",
      navLabel: "The screening system",
      heading: "A split transcription factor, built from parts",
      body: [
        "Our protein design subteam produced candidate binders against extracellular regions of MEGF8 and MOSMO. To find out which of them bind inside a cell, we designed a mammalian split-transcription-factor system from the **GAL4** DNA-binding domain and the **VP16** transcriptional activation domain.",
        "A binder carries one half of that transcription factor and its target carries the other. If the two meet, the halves reconstitute and switch on a reporter. The binder gene fragments and the target constructs were ordered from Twist Bioscience.",
      ],
    },
    {
      kind: "constructs",
      id: "screening-components",
      heading: "What the system is made of",
      groups: SCREENING_CONSTRUCTS,
      footnote:
        "Which half of the transcription factor sits on the binder and which on the target follows the final plasmid designs, so the halves are drawn here without being assigned. The exact names go in once those designs are settled.",
    },
    {
      kind: "table",
      section: "Parts inventory",
      id: "inventory-genscript",
      navLabel: "GenScript constructs",
      heading: "GenScript constructs",
      intro: "The ten mammalian expression constructs, as ordered.",
      columns: ["Construct", "Intended function"],
      rows: [
        ["SMO_DmrC_T2098L_CeGFP", "SMO fusion for chemically induced recruitment"],
        ["MGRN1_DmrA_His6", "Direct MGRN1 recruitment"],
        ["MGRN1_C279A_C282A_DmrA_His6", "Catalytically inactive MGRN1 control"],
        ["MEGF8_ICD_2602_2778_DmrA_His6", "Recruitment of the MEGF8 intracellular domain"],
        ["HA_MGRN1_NbALFA", "ALFA-based MGRN1 recruitment"],
        ["HA_MGRN1_C279A_C282A_NbALFA", "Catalytically inactive ALFA-recruitment control"],
        ["SMO_His6_ALFA_v2", "ALFA-tagged SMO construct"],
        ["GPR161_EGFP_DmrC_T2098L", "Recruitment system for an additional ciliary receptor"],
        ["GPR161_GFP_ALFA", "ALFA-tagged GPR161 receptor"],
        ["DmrA_mCherry_proximity_only_control", "Proximity-only control"],
      ],
    },
    {
      kind: "table",
      id: "inventory-twist",
      heading: "Twist Bioscience gene fragments",
      intro: "The binder and screening fragments, by category.",
      columns: ["Part category", "Intended function"],
      rows: [
        ["MEGF8-targeting binder gene fragments", "Encode the computationally designed MEGF8 binders"],
        ["MOSMO-targeting binder gene fragments", "Encode the computationally designed MOSMO binders"],
        ["MEGF8 target fusion constructs", "MEGF8 components for the GAL4 and VP16 screening system"],
        ["MOSMO target fusion constructs", "MOSMO components for the GAL4 and VP16 screening system"],
      ],
      caption:
        "Individual binder sequences and identifiers go in once the final design list is settled, as do the exact names and sources of the GAL4 and VP16 components, the GFP reporter, the BFP marker and the GB1 control.",
    },

    {
      kind: "prose",
      section: "iGEM Parts Registry",
      id: "registry",
      navLabel: "Registry",
      heading: "What we will submit",
      body: [
        "No part on this page has a Registry number yet. The constructs were designed and ordered this autumn and have not arrived, so none has been assembled or characterised, and we are not claiming any of them as a Registry part until that has happened.",
        "When the parts are submitted, this section gets the number, the type and the characterisation data for each one, with a link to the experiment the data came from.",
      ],
    },
  ],
};

const results: Page = {
  slug: "/results",
  title: "Results",
  kicker: "wetlab · results",
  storyBeat: "Nothing has come up yet. The seeds are in.",
  intro:
    "What the experiments actually produced. Check back after the wiki freeze is over, on 25 November.",
  blocks: [
    {
      kind: "resultsSoon",
      note: "We'll add them when we have them.",
      caption:
        "The experiments and the controls they run against are on [experiments](/experiments).",
    },
  ],
};

const protocols: Page = {
  slug: "/protocols",
  title: "Protocols",
  kicker: "wetlab · protocols",
  intro:
    "The following protocols outline the proposed experimental procedures developed for HedgehogSense. These documents describe the methods used to investigate induced protein recruitment, computational binder screening, SMO trafficking, and functional regulation of Hedgehog signalling. Each protocol is available for viewing and download.",
  note:
    "These protocols document proposed experimental methods. Their inclusion does not indicate that the corresponding experiments have been completed.",
  blocks: [
    {
      kind: "details",
      section: "Experiment 1: Chemically Induced Recruitment and SMO Ubiquitination",
      navLabel: "Experiment 1: Induced recruitment",
      id: "exp1-induced-proximity",
      heading: "Induced Proximity Assay",
      summary:
        "Whether bringing MGRN1 to SMO, directly or through the MEGF8 intracellular domain, increases SMO ubiquitination and lowers SMO abundance in HEK293T cells.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp1-induced-proximity-assay.pdf",
          title: "Induced Proximity Assay",
          pages: 5,
        },
      ],
    },

    {
      kind: "details",
      section: "Experiment 2: Computational Binder Screening",
      navLabel: "Experiment 2: Binder screen",
      id: "exp2-golden-gate",
      step: 1,
      heading: "Golden Gate Assembly and Transformation",
      summary:
        "Cloning each designed MEGF8 and MOSMO binder into the activation-domain vector by SapI Golden Gate assembly, then transforming E. coli to recover the plasmids.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp2-golden-gate-assembly.pdf",
          title: "Golden Gate Assembly and Transformation",
          pages: 3,
        },
      ],
    },
    {
      kind: "details",
      id: "exp2-miniprep-midiprep",
      step: 2,
      heading: "96-Well Miniprep and Target/Reporter Midiprep",
      summary:
        "Purifying plasmid DNA from the binder plates by miniprep, and from the target and reporter cultures by midiprep, ready for the screen.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp2-miniprep-midiprep.pdf",
          title: "96-Well Miniprep and Target/Reporter Midiprep",
          pages: 2,
        },
      ],
    },
    {
      kind: "details",
      id: "exp2-hek293t-screen",
      step: 3,
      heading: "Mammalian Binder Screening in HEK293T Cells",
      summary:
        "Transfecting HEK293T cells and reading the GFP reporter by flow cytometry, to test whether each binder meets its target inside a cell.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp2-hek293t-screen.pdf",
          title: "Mammalian Binder Screening in HEK293T Cells",
          pages: 2,
        },
      ],
    },

    {
      kind: "details",
      section: "Experiment 3: Quantifying SMO Trafficking and Depletion Kinetics",
      navLabel: "Experiment 3: SMO trafficking",
      id: "exp3-smo-trafficking",
      heading: "SMO Trafficking and Depletion Kinetics",
      summary:
        "Measuring how quickly SMO leaves the primary cilium after AP21967-induced recruitment of MGRN1, and whether whole-cell SMO changes with it.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp3-smo-trafficking.pdf",
          title: "SMO Trafficking and Depletion Kinetics",
          pages: 3,
        },
      ],
    },

    {
      kind: "details",
      section: "Experiment 4: Functional Validation of MEGF8 and MOSMO Binders",
      navLabel: "Experiment 4: Binder validation",
      id: "exp4-binder-purification",
      step: 1,
      heading: "Expression and Purification of Candidate Binders",
      summary:
        "Expressing selected binders in Expi293F cells, collecting them from the culture medium, and purifying and assessing them before any functional testing.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp4-binder-purification.pdf",
          title: "Expression and Purification of Candidate Binders",
          pages: 2,
        },
      ],
    },
    {
      kind: "details",
      id: "exp4-cell-validation",
      step: 2,
      heading: "Cell-Based Functional Validation",
      summary:
        "Testing whether purified binders raise ciliary SMO and GLI-dependent Hedgehog signalling, each against a matched nonbinding control.",
      blocks: [
        {
          kind: "pdf",
          file: "protocols/exp4-cell-validation.pdf",
          title: "Cell-Based Functional Validation",
          pages: 3,
        },
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
  intro:
    "A de novo binder design pipeline that runs end to end from one command, the scripts behind it, and the filters we learned to trust. All of it is open, and none of it is specific to our target.",
  blocks: [
    {
      kind: "prose",
      heading: "What another team gets",
      body: [
        "Designing a protein binder means driving three separate models in turn and throwing away almost everything they produce. The models are published and free. The part that is not written down anywhere is the plumbing: how to get them onto a cluster you are allowed to use, how to hand each one's output to the next, and which numbers are worth filtering on.",
        "That plumbing is our contribution. We built it on **Hyak**, the University of Washington's shared cluster, so it runs somewhere any student here can reach rather than on a lab machine nobody else can book. It is driven by **one script** that takes a target, a batch size and a set of hotspot residues. And it is **not specific to MOSMO or MEGF8**: a team with a different target and a structure to aim at can point the same pipeline at it.",
        "Below is the pipeline stage by stage, what each tool in it does, the scripts themselves, and the four numbers we use to decide whether a design is worth ordering. The whole thing is on [GitHub](https://github.com/uwigem/protein_design_2026).",
      ],
    },
    {
      kind: "prose",
      section: "Protein design",
      id: "summary",
      heading: "De novo protein design, briefly",
      body: [
        "De novo protein design broadly refers to the development of new proteins with novel functions. The designs of these new proteins do not rely on existing protein structures. Instead they use biochemical principles and recent breakthrough computational methods, such as deep learning models trained on large-scale collections of experimental protein structural data [1]. One use case is the de novo design of novel **binders**, where custom proteins are computationally optimised to associate, or bind, with specific molecular targets. Use cases for these binders vary, but in this project we focus on a therapeutic use: the disruption of wild-type protein complex formation. De novo binders have also proved useful in the neutralisation of toxins or venoms, and in the precise modulation of immune responses such as inflammation [2].",
        "For our project this year we are focusing on disrupting the binding interface between two proteins, **MOSMO** and **MEGF8**. We aim to prevent formation of the MOSMO, MEGF8 and MGRN1 (**MMM**) complex through a competitively inhibitory, high affinity de novo binder. For our binder design pipeline we used RosettaCommons Foundry models: **RFdiffusion3**, **ProteinMPNN** and **RoseTTAFold3**, developed in-house at the University of Washington's Institute for Protein Design [3]. How we used them against this particular target is on [the model](/model); what follows is the general version.",
      ],
    },
    {
      kind: "pipeline",
      id: "pipeline",
      heading: "The pipeline, stage by stage",
      intro:
        "One command runs all of it. Each stage below names the script that does the work and what it hands to the next stage, so the chain can be picked apart and re-run from any point.",
      stages: [
        {
          title: "Set the target and the hotspots",
          script: "pipeline/batch_design.sh",
          body: [
            "The whole run is started by one script, which takes a run name, a batch size, a set of hotspot residues and which target to aim at. Everything after this is automatic.",
          ],
          input: "a target structure and the residues to aim at",
          output: "a configured run on the cluster",
          note: "The input and output directories are set at the top of the script, so it can be pointed at any file layout.",
        },
        {
          title: "Generate backbones",
          script: "RFdiffusion3, through the Foundry container",
          body: [
            "RFdiffusion3 denoises around the fixed target to produce the coordinates of a small protein expected to interact favourably with it. These backbones are the geometric framework of the design, with no sequence yet.",
          ],
          input: "target structure and hotspot residues",
          output: "candidate binder backbones",
        },
        {
          title: "Design sequences onto them",
          script: "ProteinMPNN",
          body: [
            "ProteinMPNN takes the coordinates of a structure and generates a sequence of amino acids predicted to fold into it, a process known as inverse folding. The output carries the complete sequence for the generated minibinder alongside the existing sequence of the target.",
          ],
          input: "backbones",
          output: "amino acid sequences for each backbone",
        },
        {
          title: "Fold the sequences back",
          script: "RoseTTAFold3, through fold.sh",
          body: [
            "RoseTTAFold3 predicts how the designed sequence will actually fold, together with the target. Comparing that prediction against the backbone we asked for is what tells us whether the sequence recapitulates the shape, and whether the binder still lands where it was diffused.",
          ],
          input: "sequences and the target",
          output: "predicted complexes and their confidence files",
        },
        {
          title: "Pull the metrics out and filter",
          script: "pipeline/scripts, redesign/batch_confidences_fixed.py",
          body: [
            "A script aligns each folded output against the backbone it came from to calculate the deviation, and reads the confidence values out of the prediction's own summary files. Designs are then kept or dropped on [the four numbers below](/contribution#metrics).",
          ],
          input: "predicted complexes",
          output: "a table of metrics, and a list of designs worth keeping",
        },
        {
          title: "Rescue the near misses",
          script: "redesign/select_redesign.py, redesign/redesign_all_dirs.sh",
          body: [
            "Designs that came close to the cutoffs get a second pass: the first script finds them, the second sends them back through sequence design and folding. Giving a backbone a fresh sequence is known to lower deviation and raise prediction confidence, so a near miss gets another chance to settle into the shape that was asked for.",
          ],
          input: "near misses and designs that already passed",
          output: "a second generation of sequences, filtered the same way",
        },
      ],
    },
    {
      kind: "prose",
      id: "hyak",
      heading: "Running it on a shared cluster",
      body: [
        "To interface with these models we pulled the Foundry container created by RosettaCommons from DockerHub onto **Hyak**, the University of Washington's high-performance computing cluster. Previously our use of protein design platforms was split between local installation and the Institute for Protein Design's own cluster. Moving the entire pipeline onto Hyak, a system widely available to all University of Washington students, establishes a platform where any future team here can run automated, high throughput computational protein design.",
      ],
    },
    {
      kind: "prose",
      id: "rfdiffusion3",
      heading: "RFdiffusion3",
      body: [
        "RoseTTAFoldDiffusion3 is a diffusion-based protein structure-generating model that uses iterative denoising to arrive at protein structures, a process known as backbone generation or fold design [3]. These backbones can be thought of as just the geometric framework for a design: the scaffold we aim to recreate through an amino acid sequence from ProteinMPNN, and hopefully match with a RoseTTAFold3 prediction. By providing fixed protein input structures, it denoises around the fixed target to generate the coordinates of a small protein expected to interact favourably with it.",
      ],
    },
    {
      kind: "prose",
      id: "proteinmpnn",
      heading: "ProteinMPNN",
      body: [
        "ProteinMPNN is a neural network that takes the coordinates of a given protein structure as input and generates a sequence of amino acids predicted to fold into that structure, a process known as inverse folding [4]. The output of this step is a file containing the complete sequence for the generated minibinder and the pre-existing sequence of the target protein.",
      ],
    },
    {
      kind: "prose",
      id: "rosettafold3",
      heading: "RoseTTAFold3",
      body: [
        "RoseTTAFold3 is a protein structure prediction model that takes an input sequence of amino acids and predicts how the specified protein will fold, a process known as forward folding [5]. Running the ProteinMPNN output through it and comparing against the initial backbone validates that the generated sequence recapitulates the structure we diffused. Further, the comparison tells us whether the binder is predicted to bind where it was initially placed. If the binder refolds in a similar position on the target as it was generated in, that is a strong indicator it has affinity for the target.",
      ],
    },
    {
      kind: "prose",
      section: "The scripts and the code",
      id: "our-scripts",
      heading: "The scripts, and what they saved us",
      body: [
        "To achieve high-throughput de novo binder design we wrote Bash and Python scripts that automate the pipeline. Our design script lets a user input just the name of the target protein, the batch size, and the selected hotspots. This brought generation times down to about **45 minutes per 75 binder designs**, from about 75 minutes for the same batch at the start.",
        "We also wrote a validation script that pulls metrics out of the output files of each design and out of the structure files themselves.",
      ],
      source:
        "Timing measured on Hyak.",
    },
    {
      kind: "table",
      id: "metrics",
      heading: "The four numbers we filter on",
      intro:
        "Every design is judged on these, in this order. The first two are the published gold standards; the second two decide which of the survivors is worth ordering.",
      columns: ["Metric", "What it measures", "What we treat as good"],
      rows: [
        [
          "**minPAE**, minimum predicted aligned error",
          "Structural prediction confidence: the lowest expected error in the distance between any given pair of residues, in Angstrom.",
          "Under **2 Angstrom**. The gold standard cutoff.",
        ],
        [
          "**RMSD**, root mean square deviation",
          "Average distance between the backbone we asked for and the sequence's forward-folded structure, in Angstrom.",
          "Under **2 Angstrom**. The gold standard cutoff.",
        ],
        [
          "**pLDDT**",
          "Per-residue prediction confidence, scored from 0 to 100.",
          "Above **80** is satisfactory, but we do not filter designs out strictly on it.",
        ],
        [
          "**ddG**",
          "Change in Gibbs free energy, a computational stand-in for binding affinity.",
          "Negative, and more negative than the ddG of the MOSMO to MEGF8 interface itself.",
        ],
      ],
    },
    {
      kind: "links",
      id: "repository",
      heading: "The code",
      intro:
        "Public, and laid out so the active pipeline is separate from the one-off scripts that are kept only for reference.",
      items: [
        {
          title: "protein_design_2026",
          body: "The pipeline, the redesign loop and the earlier exploratory scripts, with a quick start in the readme. Run `pipeline/batch_design.sh` from the project root.",
          href: "https://github.com/uwigem/protein_design_2026",
          label: "Open on GitHub",
          tag: "Repository",
        },
      ],
    },
    {
      kind: "table",
      id: "layout",
      heading: "What is in the repository",
      columns: ["Folder", "What it holds"],
      rows: [
        [
          "`pipeline/`",
          "The automated binder-generation pipeline and the scripting layer that drives each stage. `batch_design.sh` is the end to end entry point.",
        ],
        [
          "`redesign/`",
          "The second pass: selecting near misses, re-running them, and collecting confidences.",
        ],
        [
          "`archive/`",
          "Scripts from earlier rounds, kept for reproducing old results. Not part of the active workflow.",
        ],
      ],
    },
    {
      kind: "details",
      section: "References",
      id: "references",
      heading: "References",
      summary: "The five sources behind the protein design write-up.",
      blocks: [
        {
          kind: "references",
          for: "Protein design",
          items: [
            {
              n: "1",
              text: "W. Yang et al., The past, present and future of de novo protein design. Nature, vol. 652, no. 8112, pp. 1139 to 1152, April 2026.",
              href: "https://doi.org/10.1038/s41586-026-10328-7",
            },
            {
              n: "2",
              text: "D. R. Fox, C. Taveneau, J. Clement, R. Grinter and G. J. Knott, Code to complex: AI-driven de novo binder design. Structure, vol. 33, no. 10, pp. 1631 to 1642, October 2025.",
              href: "https://doi.org/10.1016/j.str.2025.08.007",
            },
            {
              n: "3",
              text: "J. Butcher et al., De novo design of all-atom biomolecular interactions with RFdiffusion3. bioRxiv, November 2025.",
              href: "https://doi.org/10.1101/2025.09.18.676967",
            },
            {
              n: "4",
              text: "J. Dauparas et al., Robust deep learning-based protein sequence design using ProteinMPNN. Science, vol. 378, pp. 49 to 56, 2022.",
              href: "https://doi.org/10.1126/science.add2187",
            },
            {
              n: "5",
              text: "N. Corley et al., Accelerating biomolecular modeling with AtomWorks and RF3. bioRxiv, August 2025.",
              href: "https://doi.org/10.1101/2025.08.14.670328",
            },
          ],
        },
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
  protocols,
  parts,
  results,
  model,
  humanPractices,
  education,
  contribution,
  judging,
  attributions,
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
