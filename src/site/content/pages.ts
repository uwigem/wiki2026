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
import type { ChartReference, LinePanel } from "../components/LineChart";
import type { ScatterGroup, ScatterPanel } from "../components/ScatterChart";
import type { IntervalRow, IntervalSeries } from "../components/IntervalBars";
import type { DiagramEdge, DiagramNode } from "../components/NodeDiagram";
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
import { BINDER_STRUCTURES } from "./binderStructures";
import {
  ALPHA_SERIES,
  BACKBONE_ROWS,
  DDG_POINTS,
  HOTSPOT_MEGF8,
  HOTSPOT_MOSMO,
  MC4R_PANELS,
  MORRIS_POINTS,
  NORMSENS_TABLE,
  SOBOL_ROWS,
  SOBOL_S2_ROWS,
  SWEEP_PANELS,
  TIME_RESOLVED_SERIES,
} from "./modelData";
import type { PipelineStage } from "../components/Pipeline";
import type { TrailStep } from "../components/PartTrail";
import type { RecipePart } from "../components/RecipeStrip";
import type { PersonaKey } from "../components/gardenArt";
import { type Structure } from "./structures";
import {
  RECRUITMENT_CONSTRUCTS,
  SCREENING_CONSTRUCTS,
  type ConstructGroup,
} from "./constructs";
import type { ProcedureGroup } from "../components/Procedure";
import type { MedalCriterion } from "../components/MedalCriteria";
import type { MedalTier } from "./medals";
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
  /** Spans the grid, for a card that sums up the ones beside it. */
  wide?: true;
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
        /** Draw the row as Human Practices' integration counter. */
        look?: "counter";
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
    /** Lines against a shared axis: a dose sweep, a time course, a sensitivity over time. */
    | {
        kind: "line";
        heading?: string;
        intro?: string;
        panels: LinePanel[];
        xLabel: string;
        yLabel: string;
        xLog?: boolean;
        yLog?: boolean;
        xMin?: number;
        xMax?: number;
        yMin?: number;
        yMax?: number;
        references?: ChartReference[];
        legendTitle?: string;
        footnote?: string;
        source?: string;
      }
    /** Points against two measured quantities, with an optional fitted line. */
    | {
        kind: "scatter";
        heading?: string;
        intro?: string;
        panels: ScatterPanel[];
        groups?: ScatterGroup[];
        xLabel: string;
        yLabel: string;
        xLog?: boolean;
        yLog?: boolean;
        xMin?: number;
        xMax?: number;
        yMin?: number;
        yMax?: number;
        trend?: "ols" | "origin";
        references?: ChartReference[];
        diagonal?: boolean;
        sharedAxes?: boolean;
        footnote?: string;
        source?: string;
      }
    /** Bars with an uncertainty whisker on each: sensitivity indices and their intervals. */
    | {
        kind: "bars";
        heading?: string;
        intro?: string;
        series: IntervalSeries[];
        rows: IntervalRow[];
        axisLabel: string;
        min?: number;
        max?: number;
        digits?: number;
        footnote?: string;
        source?: string;
      }
    /** A wiring diagram: named species in boxes, reactions as arrows. */
    | {
        kind: "graph";
        heading?: string;
        intro?: string;
        nodes: DiagramNode[];
        edges: DiagramEdge[];
        width: number;
        height: number;
        narrow?: { width: number; height: number };
        alt: string;
        caption?: string;
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
        /** Shade every number after the first column by its size and sign. */
        heat?: boolean;
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
        /** Marks a standardised parameter or assumption drop-down. */
        tone?: "lilac";
        /** Its place in a sequence, when a run of these is one procedure. */
        step?: number;
        blocks: Block[];
      }
    /** A protein structure, drawn from coordinates. */
    | { kind: "structure"; structure: Structure }
    /** Several structures in one viewer, with a button per structure. */
    | { kind: "structures"; structures: Structure[]; label: string }
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
        /** Drawn by the site rather than loaded from a file. */
        scene?: "mmm";
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
    /** How another team swaps our receptor for theirs, as one drawing. */
    | { kind: "adapt" }
    /** One medal tier, and the criteria claimed under it. */
    | {
        kind: "medals";
        tier: MedalTier;
        intro?: string;
        items: MedalCriterion[];
      }
    /** A few photographs side by side. */
    | { kind: "gallery"; heading?: string; intro?: string; images: GalleryImage[]; ratio?: "wide" | "square" | "tall"; source?: string }
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
  title: "Project Description",
  kicker: "chapter 01 · description",
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
        "Our engineered linker and breaker provide two complementary ways to tune the ciliary abundance of the target protein.",
      items: [
        {
          title: "Down arm",
          body: "An **inducible linker** forces **the MMM complex** onto a chosen receptor. That receptor now gets tagged and cleared, so signalling through it goes down. We test this by recruiting MGRN1 to GPR161, a receptor MMM does not normally touch.",
        },
        {
          title: "Up arm",
          body: "A **de novo minibinder** pries apart the MEGF8 and MOSMO interface. [How we design one](/contribution#pipeline). The MMM complex can no longer assemble, so it stops clearing the targeted receptor. Doing this prevents over degradation and allows us a new vector to tune ciliary abundance.",
        },
        {
          title: "A dial, not a switch",
          wide: true,
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
  title: "Background",
  kicker: "chapter 02 · background",
  blocks: [
    {
      kind: "logo",
      caption:
        "Hedgehog signalling is a balance and both ends of it are problematic. Tipping it too far one way leads to ciliopathies associated with excess signalling, like medulloblastoma or basal cell carcinoma; tipping it too far the other way can lead to issues with development or injury repair. Current clinical routes are only able to either fully remove or fully enforce Hedgehog signalling. What is missing is a way to finely tune both.",
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
        "What we propose instead is [a device with two arms](/description#two-arms), which allows us to tune the abundance of SMO rather than outright blocking the receptor.",
      ],
      source: "Interview with Dr. Stacey Ogden (St. Jude).",
    },
    {
      kind: "cards",
      heading: "What we get to build on",
      items: [
        {
          title: "A membrane-bound E3 ubiquitin ligase",
          body: "The Kong lab identified the MOSMO, MEGF8 and MGRN1 (MMM) complex, a membrane-bound E3 ubiquitin ligase that naturally controls SMO levels by tagging the protein for ubiquitination. This is the biological machine our platform borrows.",
        },
        {
          title: "The MMM complex",
          body: "All three proteins have their own purpose in the membrane. MGRN1 provides the enzymatic behaviour of the complex, while its structure comes primarily from MOSMO, which promotes the abundance and stabilisation of the third protein it is bound to, MEGF8.",
        },
        {
          title: "Experimental structure",
          body: "The Kong lab has solved the cryo-EM structure of the complex and identified residues whose mutation affects the protein's folding, which suggests the [hotspots we design binders against](/model#hotspot-selection).",
        },
      ],
      source:
        "Kong lab MMM structure and interface preprint (biorxiv 2025.09.11.675358).",
    },
  ],
};

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
  title: "Engineering",
  kicker: "chapter 03 · engineering",
  medal: true,
  blocks: [
    {
      kind: "cards",
      id: "three-parts",
      heading: "Here is the story of our engineering cycle",
      intro:
        "Each subteam ran its own design, build, test, learn loop, and each one handed the next something to work with.",
      items: [
        {
          title: "Part 1: Kinetics modelling",
          body: "Cast prediction and feasibility envelopes to understand our interventions on the Hedgehog system by modelling our system as a set of equations. [Go to Part 1](/engineering#kinetics)",
        },
        {
          title: "Part 2: Protein modelling",
          body: "Designing *de novo* protein disruptors of the MEGF8-MOSMO interface to modulate signalling changes in the \"breaker system\" of our ciliary receptor abundance platform. [Go to Part 2](/engineering#protein-modelling)",
        },
        {
          title: "Part 3: Wet lab",
          body: "Designing the chemically induced dimerisation system and the experimental design to test our protein binders. [Go to Part 3](/engineering#wet-lab)",
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
        "Before any protein is designed, the modelling subteam has to show that acting on the MMM complex could move **SMO in the cilium** by a useful amount, and that the rates in the literature support it. [The model](/model) is where that work is written up; this is the loop that produced it.",
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
              body: "How often a hotspot succeeded tracked **how many designs we had attempted with it**, and not the chemistry of the residues. Talking it through with Dr. DiMaio, the reading is that hotspots tell RFdiffusion3 roughly where to aim rather than specifying residue to residue contacts. We also folded the separate scripts into one that runs the whole pipeline, so any future Washington iGEM team can design binders with a single command.",
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
              body: "Of the roughly **5,700 designs generated by that point, 255 passed**. Then we opened a few in PyMOL and found the problem: most of them were binding parts of MOSMO and MEGF8 that are **buried inside the membrane**. On the metrics they looked excellent. In a cell no protein could ever reach them. We had been designing against an incomplete picture of our own target.",
            },
            {
              title: "Learn",
              body: "Good numbers are not the same as a good binder. We rebuilt the filtering around what is physically reachable: re-fold every survivor against only the **extracellular** parts of the targets and apply the 2 by 2 filter again, then run a custom check that rejects anything still sitting within 5 to 10 Angstrom of the transmembrane helices. Dr. DiMaio added a third test, folding the binder **on its own** with no target present, to confirm it holds its shape rather than being propped up by the thing it is supposed to bind. About **25 designs** survived all of it. The filters are listed in order in [the pipeline](/contribution#pipeline).",
            },
          ],
        },
        {
          heading: "Cycle 3: Rescuing the near misses",
          intro:
            "Complete. Twenty five binders was not enough to fill a 96-well plate.",
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
              body: "It worked, and it is most of why the plate is full. Of the **96 designs we ordered, 41 are resequenced redesigns** and 55 came off their original backbones. The split is uneven by target: 23 of MOSMO's 35 and 18 of MEGF8's 61.",
            },
            {
              title: "Learn",
              body: "The rescue filled the plate, and one cost came with it. Redesigning sequences onto backbones that already passed means more of the final set comes from the **same few backbone shapes**, so the plate is less diverse than the count suggests: the 96 come from 48 backbones, and a single MOSMO backbone accounts for 17 of that target's 35. The [model page counts them](/model#backbone-diversity). The survivors become the plate the bench screens in [Experiment 2](/experiments#exp2-design), and the hits go on to purified testing in [Experiment 4](/experiments#exp4-design).",
            },
          ],
        },
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
              body: "The protein modelling subteam's filters decided what could be ordered. Most early designs bound parts of MOSMO and MEGF8 buried in the membrane, so they re-folded every survivor against only the extracellular parts and wrote a filter that rejects anything near the transmembrane helices. About 25 designs survived that round, and a rescue cycle of sequence redesign then filled the plate: 96 designs were ordered. That plate is also the format of the bench screen: [Experiment 2](/experiments#exp2-design) is a 96-well assay in mammalian cells, with each binder and its target fused to one half of a split transcription factor, a GFP reporter, and a matched GB1-only control for every binder. The kinetic modelling subteam's off-target check cleared the dose range rather than narrowing it: the effect on MC4R stays small, about 6.8 percent at 50 nM and 8.0 percent at 500 nM once the system has settled, against a ceiling of 8.2 percent that no dose can pass.",
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
          "An off-target check: the MC4R effect stays small, and has a ceiling set by how little MGRN1 there is.",
          "Confidence that the dose range in Experiment 4 does not need narrowing.",
        ],
        [
          "Protein modelling",
          "Wet lab",
          "Extracellular-only targets, and a filled 96-well plate of filtered designs.",
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
  kicker: "chapter 08 · experiments",
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
      scene: "mmm",
      alt: "A cross-section of the ciliary membrane. MEGF8 spans the membrane with MOSMO beside it, and MGRN1, labelled E3 ligase, sits on the cytoplasmic side. To the right, SMO is drawn as a seven-pass receptor being tagged with three ubiquitin marks. An arrow labelled SMO ubiquitination leads to two boxes: ciliary SMO down, then Hedgehog signal down.",
      caption:
        "Schematic representation of MMM-mediated SMO regulation. The MMM complex promotes SMO ubiquitination, limiting SMO accumulation in the primary cilium and reducing downstream Hedgehog pathway activity.",
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
      intro: "Both recruitment strategies will be evaluated in NIH/3T3 cells, using engineered SMO, MGRN1 and MEGF8 constructs.",
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
  kicker: "chapter 05 · model",
  medal: true,
  intro:
    "A kinetic model of the Hedgehog and MMM system, built to answer one question. Can the device set ciliary SMO where we want it rather than only switching it off, or is tunable just a nice word.",
  blocks: [
    {
      kind: "prose",
      id: "model-intro",
      navLabel: "The four models",
      heading: "What the modelling is for",
      body: [
        "The whole point of the device is graded control. Acting on the three-part MMM complex should let us set the amount of **SMO in the primary cilium**, where blocking SMO directly only gives on or off. That is a claim about rates, so it has to survive a kinetic model before it is worth building.",
        "There are four pieces of modelling on this page, and they answer four different questions. **The tuner model** asks whether the device can move ciliary SMO in both directions and by how much; it is the one that tests the central claim. **The GPCR model** asks what makes SMO signal in the first place, because the tuner treats SMO as a quantity to move around and something has to justify that simplification. **The safety model** asks what else the device touches, since freeing one protein from one complex necessarily offers it to another. And **the protein modelling** asks which of thousands of designed binders were worth the cost of ordering.",
        "Each one changed what we did. The tuner model sent the wet lab after a dose response and an in-cell degradation assay rather than high-resolution binding kinetics, because those are the measurements its answer actually depends on. The safety model ran before anything was built, and found that the melanocortin side effect has a hard ceiling far below the level we had set in advance as meaningful, which is why it is not a reason to hold the dose down. The protein modelling threw away more than 98 percent of what we generated, including a whole class of designs that scored well and could never have worked. The GPCR model is the one that has changed the least so far, and the section says where it still falls short.",
      ],
    },
    {
      kind: "prose",
      section: "The tuner model",
      navLabel: "KM: the tuner",
      id: "homeostasis",
      heading: "What the tuner model is for",
      body: [
        "As the Smoothened (SMO) bidirectional tuner was assembled with adjustability in mind, understanding its behaviour under variable conditions and doses is integral to its development. To approach these needs, our modelling team has constructed dedicated deterministic **ordinary differential equation** (ODE) models to predict targeted preliminary behaviours of our intervention and of essential attached systems across a selection of cell-state conditions.",
        "To estimate our system's function as a bidirectional network, including strategic dosing of both the linker and binder, we implemented a dedicated ODE network to represent the SMO signalling system upstream of the cilia itself. Included are the **MMM complex** (MGRN1, MEGF8, MOSMO) and natural inhibitor **PTCH1**, to most closely resemble the most integral components of upstream-to-SMO ciliary trafficking.",
        "To be considered active, SMO must enter the primary cilia [1]. Consequently, the upstream network of Hedgehog signalling modelled here centres around adapting the ciliary SMO concentration, especially as the proposed intervention acts directly upon it. This upstream system is selectively restricted to PTCH1 and the MMM complex because, while SMO acts on multiple other systems, one is the natural intervention and the other is our adaptation to SMO regulation. This assumption is made based on the knowledge that restricting SMO reduces downstream Hedgehog activation [2].",
      ],
      source:
        "Ciliary entry from Wilson et al. [1]; the effect of restricting SMO from Zhang et al. [2].",
    },
    {
      kind: "figure",
      id: "homeostasis-network",
      src: "model/homeostasis-network.webp",
      alt: "A reaction diagram. SMO is made in the cytoplasm and enters the primary cilium at a rate k in, leaving again at k out. Inside the cilium sits the MMM complex, drawn as MOSMO, MGRN1 the E3 ligase, and MEGF8 the membrane protein. The complex ubiquitinates ciliary SMO, which is then degraded by the proteasome. A de novo binder arrow points at MGRN1 and is labelled disrupts MMM. A proximity linker bridges the complex to ciliary SMO. PTCH1 blocks SMO entry, on in wild type and off in basal cell carcinoma. Ciliary SMO activates downstream Hedgehog signalling.",
      caption:
        "The upstream network the tuner model represents: the MMM complex and PTCH1 acting on the pool of SMO that enters the cilium, with the two arms of our device entering on the left.",
      ratio: "wide",
    },
    {
      kind: "prose",
      id: "rate-law",
      navLabel: "The rate law",
      heading: "Two ways to write the tagging step",
      body: [
        "We developed two versions of a deterministic ODE system to model how the de novo components would affect the rate of SMO ubiquitination.",
        "The original model assumes the behaviour of SMO ubiquitination mediated via the MMM complex follows **Michaelis-Menten kinetics**. This is a simplistic assumption that works well for modelling purposes; however, it becomes inaccurate as it cannot account for SMO-linker binding affinity, linker-MMM binding affinity, and the concentrations of the MMM complex and linker proteins.",
        "To resolve this, we came up with the second model. The second model implements an equation (equation 7) from the paper *Affinity and cooperativity modulate ternary complex formation to drive targeted protein degradation* by Wurz et al. [3]. This paper derives a more complete equation to model **PROTAC** systems from Michaelis-Menten reaction kinetics. This approach adds many new parameters, such as PROTAC concentration, E3 ubiquitin ligase concentration, and binding affinities for the respective complexes. This equation proved to be extremely accurate when applied to a PROTAC system similar to the MMM-SMO-linker system we developed. Thus, we incorporated this equation into our model and compared it to Michaelis-Menten reaction kinetics to see which performed better.",
        "Both ODE systems developed follow the **quasi-steady state** assumption for the MMM-linker complex. This assumption states that the MMM-linker complex reaches a stable equilibrium after the reaction starts, and its rate of change remains zero as the reactions progress. This assumption made it easier to develop our model and incorporate the de novo components into the system.",
      ],
      source:
        "Ternary-complex rate law from Wurz et al., equation 7.",
    },
    {
      kind: "prose",
      id: "bundling",
      navLabel: "Bundling",
      heading: "Why the model we run is a bundled one",
      body: [
        "As published information available in literature for the MMM complex (as a recently discovered ciliary complex) is relatively low, the computational adaptation of the model relies on a series of assumptions and certain relationships being collapsed via bundling.",
        "Parameters with no credible source were dropped instead of guessed, and the ones that survived are **swept across a range in every result below** rather than trusted at a single value. Those that remained would need to be swept later in development. As such, we adapted the cytoplasmic SMO as a non-depleting source, resolved Michaelis-Menten (and PROTAC behaviour) into mass action kinetics and re-expressed select unknown parameters in terms of known fold changes.",
      ],
    },
    {
      kind: "prose",
      id: "modelling-advice",
      navLabel: "Advice we acted on",
      heading: "What a systems biologist told us to do differently",
      body: [
        "A systems biologist at UW met the subteam twice and reset how we work. Instead of building one big model, we build a **set of candidate models** that each change one relationship, then ask which is best supported by the data we have. The same advice moved us to **Tellurium and Antimony**, had us run **Morris and Sobol** sensitivity analysis rather than only local sensitivity, sample uncertain parameters and report the spread instead of a single line, and use fold changes from knockouts as constraints, since relative data is most of what we have.",
        "Nearly everything on this page follows from those two conversations: the two rate laws kept side by side, the sweeps rather than single runs, the calibration on a knockout fold change, and the two sensitivity analyses below. The line that stuck with us was that you can only really show how models are wrong.",
      ],
    },
    {
      kind: "graph",
      id: "wire-diagram",
      navLabel: "Wire diagram",
      heading: "How the model is wired",
      intro:
        "Every species the bundled model tracks and every reaction between them. Solid arrows are flows of material; dashed arrows are one species acting on another. The two coloured arrows are the two arms of the device, and they point in opposite directions.",
      nodes: [
        { id: "influx", lines: ["influx"], x: 44, y: 250, shape: "text", nx: 44, ny: 300 },
        { id: "scil", lines: ["S_cil", "ciliary SMO", "(readout)"], x: 200, y: 250, tone: "strong", nx: 150, ny: 300 },
        { id: "void", lines: ["X"], x: 560, y: 250, shape: "circle", nx: 310, ny: 390 },
        { id: "mmm", lines: ["MMM", "active ligase"], x: 64, y: 110, tone: "filled", nx: 62, ny: 70 },
        { id: "mmmi", lines: ["MMM*", "taken apart"], x: 272, y: 100, nx: 272, ny: 70 },
        { id: "tern", lines: ["SMO·L·MMM", "ternary"], x: 262, y: 185, nx: 172, ny: 180 },
        { id: "sub", lines: ["S_ub", "tagged"], x: 560, y: 160, nx: 300, ny: 250 },
      ],
      edges: [
        { from: "influx", to: "scil" },
        { from: "scil", to: "sub", label: "ubiquitination", labelSide: "right" },
        {
          from: "scil",
          to: "void",
          label: "exit · basal loss · PTCH1 gate",
          nLabel: "exit · loss · gate",
          nLabelSide: "right",
        },
        { from: "mmm", to: "sub", label: "tags SMO", dashed: true, bend: 78, nBend: 42 },
        { from: "tern", to: "sub", label: "tags SMO faster", dashed: true, labelSide: "left" },
        { from: "mmm", to: "mmmi", label: "binder: SMO up", colour: "stem", labelSide: "right" },
        { from: "mmm", to: "tern", label: "linker: SMO down", colour: "pinkDark", labelSide: "right" },
      ],
      width: 640,
      height: 310,
      narrow: { width: 360, height: 420 },
      alt: "A wiring diagram of the bundled model. Ciliary SMO is fed by a constant influx and leaves three ways: tagged for degradation, or lost to exit, basal degradation and the PTCH1 gate. The active MMM ligase tags SMO. The binder converts active MMM into a taken-apart form, which raises SMO. The linker converts active MMM into a ternary SMO, linker and MMM complex, which tags SMO faster and so lowers it.",
      caption:
        "Here, the binder and the linker components act on a shared pool of active MMM complexes and alternate directions. All other components are the most essential components of the cell's own machinery.",
    },
    {
      kind: "details",
      id: "states",
      navLabel: "What it tracks",
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
              "Entry from the cytoplasm, and a small amount made there directly",
              "Exit, degradation, the PTCH1 gate, and tagging by the MMM complex",
            ],
            [
              "**S_ub**",
              "Tagged SMO, on its way to the proteasome. Counted cumulatively: a running total of everything the complex has ever tagged, not a standing pool, which is why it reaches hundreds of nM while ciliary SMO sits near three.",
              "Tagging by the complex, with or without the linker",
              "Nothing. The model stops following SMO once it is tagged.",
            ],
            [
              "**MMM**",
              "The active complex that tags ciliary SMO.",
              "Synthesis, reassembly from the taken-apart form, and release of the linker",
              "Turnover, the binder pulling it apart, and the linker binding it",
            ],
            [
              "**M_nf**",
              "The complex pulled apart by the binder, and unable to tag anything.",
              "The binder binding the complex",
              "Reassembly, reversibly, and turnover",
            ],
            [
              "**M_link**",
              "The complex joined to the linker. This is the form that tags SMO faster.",
              "The linker binding the complex",
              "Linker release",
            ],
          ],
          caption:
            "The bundled version folds **S_cyto** into a single constant influx rather than tracking it, which is the first of the assumptions below. The other five quantities are tracked in every version.",
        },
      ],
    },
    {
      kind: "details",
      id: "assumptions",
      navLabel: "Assumptions",
      heading: "Assumptions",
      tone: "lilac",
      blocks: [
        {
          kind: "facts",
          items: [
            {
              title: "The cytoplasm is a non-depleting source",
              body: "The cilium is a very small compartment, so ciliary SMO is a small fraction of the cell's total and the data are too sparse to fix the ratio. The cytoplasmic to ciliary transit is bundled into one influx rate. A SAG ciliary trafficking time course from wet lab would let us measure it properly, and the GPCR model below treats the same transit explicitly.",
            },
            {
              title: "The MMM complex is treated as one ligase",
              body: "MEGF8, MGRN1 and MOSMO are represented as a single structure. The literature says they do not act on SMO independently [4], and no published binding data exists to separate their rates, so the complex is reduced to its rate-limiting form.",
            },
            {
              title: "Ubiquitination is linear, not Michaelis-Menten",
              body: "The database value for a general ring E3 ligase [9] gives a Km of about 3 x 10^5 nM, far larger than our calculated ciliary SMO concentration. When Km greatly exceeds the substrate, Michaelis-Menten collapses to a first-order relationship, so that is what the model uses.",
            },
            {
              title: "The linker clears at the same rate as the natural complex",
              body: "With no measured kinetics for a designed molecule, the linker is given the complex's own rate and a neutral ternary enhancement of one. Measuring it would need binding data for the real linker.",
            },
            {
              title: "Binder and linker constants are stand-ins",
              body: "The real constraints of our binder and linker are unknown. Some are estimated from the FKBP and FRB system [10]; the rest are preset and swept across a range in every result rather than being trusted as values.",
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
      kind: "details",
      id: "core-equations",
      navLabel: "The core equations",
      heading: "The equations before the adaptation",
      summary:
        "The original system in full, both forms of the tagging step, and what each symbol is.",
      blocks: [
        {
          kind: "prose",
          body: [
            "This is the model as it was first written, before the parameters were bundled. It tracks six quantities rather than five, and it writes the tagging step the two ways described above. The version the code actually runs is the bundled one below; this is what it was bundled from.",
            "`DeNovo` is the binder and `Linker` the linker, both held constant: they are the conditions a run is set to. `MMM_nf` is the complex after the binder has taken it apart, and `MMM_L` is the complex joined to the linker.",
          ],
        },
        {
          kind: "table",
          columns: ["Quantity", "Rate of change"],
          rows: [
            [
              "**SMO_cyt**",
              "`(kform_SMO_cyt + kout*SMO_cil) - (kdeg_SMO_cyt + kin)*SMO_cyt`",
            ],
            [
              "**SMO_cil**",
              "`kin*SMO_cyt - (kdeg_SMO_cil + Vmax*SMO_cil/(Km + SMO_cil))`",
            ],
            ["**SMO_ub**", "`Vmax*SMO_cil/(Km + SMO_cil)`"],
            [
              "**MMM**",
              "`(k3*MMM_nf + kform_MMM + koff*MMM_L) - (k3*MMM*DeNovo + kdeg_MMM + kform_MMM_L*MMM*Linker)`",
            ],
            ["**MMM_nf**", "`k3*MMM*DeNovo - k_minus3*MMM_nf`"],
            ["**MMM_L**", "`kf_MMM*MMM*Linker - koff*MMM_L`"],
          ],
          caption:
            "The source document writes the influx term of the second equation against ciliary SMO rather than cytoplasmic SMO. It is transcribed here as cytoplasmic, which is what the first equation and the bundled version both treat it as, and is an open question for the subteam.",
        },
        {
          kind: "prose",
          body: [
            "The tagging step in the second and third equations is **Michaelis-Menten**, with `Vmax = kcat*MMM` and `Km = (k_minus1 + kcat)/k1`. `k1` is the rate at which the complex and ciliary SMO meet, `k_minus1` the rate that pairing comes apart again, and `kcat` the rate at which a bound SMO is tagged.",
            "The sixth equation was added for the linker, and is the quasi-steady-state assumption written out: the complex joined to the linker settles within moments, so its level depends only on how much linker and complex there is, and on the rates of forming and clearing it.",
            "The second version replaces the tagging step with the ternary-complex rate law from Wurz et al. [3]. In their terms, **alpha** is the cooperativity coefficient, `K_MMM_Linker` the ligase and linker affinity, and `K_SMO_Linker` the target and linker affinity:",
            "`v/Vmax = alpha / (alpha + 2*(K_MMM_Linker + Linker) / (Linker + SMO + K_SMO_Linker - sqrt((Linker + SMO + K_SMO_Linker)^2 - 4*Linker*SMO)))`",
            "Which rewrites the third equation, and with it the tagging term of the second, as:",
            "`d(SMO_ub)/dt = Vmax*alpha / (alpha + 2*(K_MMM_Linker + Linker) / (Linker + SMO + K_SMO_Linker - sqrt((Linker + SMO + K_SMO_Linker)^2 - 4*Linker*SMO)))`",
            "Written this way the tagging rate carries how much linker and complex are present, and how tightly each arm binds, instead of hiding all of it in one lumped constant. That is the whole reason for preferring it, and the reason the bundled version keeps **alpha** as a separate factor.",
          ],
        },
        {
          kind: "prose",
          body: [
            "The subteam's own write-up of this system, as it was handed over.",
          ],
        },
        {
          kind: "pdf",
          file: "model/core-ode-model.pdf",
          title: "An Overview of the Core Deterministic ODE Model",
          pages: 2,
        },
      ],
    },
    {
      kind: "details",
      id: "equations",
      navLabel: "Equations",
      heading: "The equations the code solves",
      summary:
        "The bundled system in full, as five rate equations and one steady state.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Concentrations in nM, time in seconds. These are the names the code uses: `Mm` is the active complex, called MMM above, `M_nf` is the form the binder has taken apart, and `MLc` is the complex joined to the linker, called M_link above.",
            "`PTCH1`, `Linker` and `DeNovo` are held constant: they are the conditions a run is set to, not quantities the model tracks. `alpha` is the ternary enhancement, the factor by which the linked complex tags SMO faster than the complex alone.",
          ],
        },
        {
          kind: "table",
          columns: ["Quantity", "Rate of change"],
          rows: [
            [
              "**S_cil**",
              "`kin - (kout + kdeg_SMO_cil + kPTCH_SMO*PTCH1)*S_cil - kMMM*Mm*S_cil - alpha*kMMM*MLc*S_cil`",
            ],
            ["**S_ub**", "`kMMM*Mm*S_cil + alpha*kMMM*MLc*S_cil`"],
            [
              "**Mm**",
              "`kform_MMM - kdeg_MMM*Mm - k3*Mm*DeNovo + k_minus3*M_nf - kf_MMM_Linker*Mm*Linker + koff*MLc`",
            ],
            ["**M_nf**", "`k3*Mm*DeNovo - k_minus3*M_nf - kdeg_MMM*M_nf`"],
            ["**MLc**", "`kf_MMM_Linker*Mm*Linker - koff*MLc`"],
          ],
        },
        {
          kind: "prose",
          body: [
            "Setting the first equation to zero gives the quantity the whole model exists to predict, the level ciliary SMO settles at:",
            "`S_cil* = kin / (kout + kdeg_SMO_cil + kPTCH_SMO*PTCH1 + kMMM*(Mm* + alpha*MLc*))`",
            "Read it as supply over disposal. The binder raises ciliary SMO by moving active complex into **M_nf**, which takes it out of the denominator. The linker lowers it by moving active complex into **MLc**, which enters the denominator multiplied by `alpha`. The two arms act on the same term from opposite sides, which is why a single device can push the readout either way.",
          ],
        },
        {
          kind: "prose",
          body: [
            "The short list of changes that produced this version from the core model above.",
          ],
        },
        {
          kind: "pdf",
          file: "model/core-ode-updated.pdf",
          title: "Updated equations, bundled form",
          pages: 1,
        },
      ],
    },
    {
      kind: "details",
      id: "parameters",
      navLabel: "Parameters",
      heading: "Parameters",
      tone: "lilac",
      blocks: [
        {
          kind: "table",
          columns: ["Parameter", "What it represents", "Value", "Where it comes from"],
          rows: [
            ["SMO_cil", "Ciliary SMO concentration", "1 nM", "Normalisation anchor. Sets the scale only."],
            ["Mm", "Active MMM complex", "0.148 nM", "Literature [5], derived from densitometry"],
            ["PTCH1", "PTCH1 concentration", "0.15 nM", "PaxDb [6], 0.01 ppm"],
            ["Influx", "Ciliary influx", "0.0691 nM per second", "Calculated, as ciliary SMO times every rate that removes it"],
            ["k_out", "Ciliary transit, exit", "9.63e-5 per second", "Literature [7], from a 2.0 hour half-life"],
            ["kdeg_SMO_cil", "SMO degradation rate", "3.21e-5 per second", "Literature [7], from a 6.0 hour half-life"],
            ["kPTCH1_SMO", "PTCH1 removal strength", "0.05 per nM per second", "**Stand-in.** Order of magnitude after [8], based on GPR161, a non-Smoothened Hedgehog inhibitor"],
            ["kMMM", "MMM-mediated ubiquitination rate", "0.42 per nM per second", "Calculated from the MEGF8 knockout fold change of 9.06"],
            ["alpha_L", "Ternary enhancement rate", "1", "**Stand-in.** Assumes the linker is non-cooperative"],
            ["kdeg_MMM", "MMM degradation, turnover", "8.86e-6 per second", "Literature [5]"],
            ["kform_MMM", "MMM synthesis", "1.31e-6 nM per second", "Calculated from degradation and abundance"],
            ["k3, k_minus3, kf_MMM_linker, koff", "Binder and linker on and off rates", "Preset", "**Stand-ins**, swept rather than trusted"],
          ],
          caption:
            "Six of these are stand-ins rather than measurements: the PTCH1 gate, the ternary enhancement, and the four binder and linker rates on the last row. The four rates are swept across a range in every result below rather than treated as known, and the ternary enhancement gets a figure of its own. Three further rows are calculated: two from the rows above them, and the ubiquitination rate from a measured fold change of 9.06 that appears nowhere else in the table and that the binder's ceiling is calibrated against. What is left is five values from the literature and one normalisation anchor, so the twelve rows rest on seven numbers.",
        },
      ],
    },
    {
      kind: "prose",
      id: "results",
      navLabel: "Preliminary results",
      heading: "What the model does when we sweep it",
      body: [
        "The equation system was adapted into **Antimony** before being solved in Python's **Tellurium** library [14]. Because six of its constants are stand-ins, we use parameter sweeps to estimate the shape of the response across the range those constants could plausibly take.",
        "We conducted initial sweeps of on-rate (k3 and kf_MMM_Linker) binding parameters over a scalar strength range of 0.1x to 10.0x. Each binding strength was validated over a dose range from 0.1 to 1000 nM. The off-rates are held at a median value so that only the on-rates move.",
        "Across this range we observe that the binder raises the SMO response matching the calibration threshold from MEGF8-KO, with an effect change of about **9.06x**. The linker observes a reduction of SMO toward 0. Within our operating terms, the linker and binder function as intended, increasing and decreasing SMO accordingly.",
      ],
    },
    {
      kind: "line",
      id: "dose-sweep",
      panels: SWEEP_PANELS,
      xLabel: "dose (nM)",
      yLabel: "ciliary SMO, as a multiple of untreated",
      xLog: true,
      yLog: true,
      legendTitle: "on-rate, as a multiple of the baseline",
      references: [{ axis: "y", value: 1, label: "untreated" }],
      footnote:
        "Ciliary SMO concentration vs intervention dose, relative to the untreated WT level. We observe five settings for each tuner arm, with binder (left) and linker (right). Both axes are logarithmic.",
      source: "Regenerated from the current model.",
    },
    {
      kind: "line",
      id: "alpha-sweep",
      navLabel: "Ternary enhancement",
      heading: "What the linker's ternary enhancement changes",
      intro:
        "The same dose range, now holding the binding rates at a median value and sweeping **alpha**, the factor by which the linked complex tags SMO faster than the complex alone. Read at 2 x 10^6 seconds, about 23 days.",
      panels: [{ series: ALPHA_SERIES }],
      xLabel: "linker dose (nM)",
      yLabel: "ciliary SMO, as a multiple of untreated",
      xLog: true,
      yLog: true,
      references: [{ axis: "y", value: 1, label: "untreated", labelAt: 0.945 }],
      footnote:
        "At **alpha = 0** the linker does the opposite of its job: binding the complex without speeding up tagging simply sequesters the complex, and ciliary SMO rises. For any alpha above zero the linker lowers SMO, and lowers it further the larger alpha is. A high ternary enhancement is what would let the linker outcompete SMO in a cell where SMO is overproduced, which is the condition the device is for. One caveat on reading it: unlike the binder, this arm is **not settled** at the time these curves are read. Run far enough and the alpha = 0 case relaxes back to the untreated level while the others fall further still, so the rise at alpha = 0 is a slow transient rather than a new resting state.",
    },
    {
      kind: "prose",
      id: "local-sensitivity",
      navLabel: "Sensitivity analysis",
      heading: "Sensitivity analysis of our tuner",
      body: [
        "To evaluate the next steps in development of this model we ran it through global and local sensitivity analysis programs to rank included components based on their relative contribution to model output.",
      ],
    },
    {
      kind: "narration",
      id: "sensitivity-analysis",
      label: "what a sensitivity analysis is",
      body: [
        "The model has dozens of numbers in it, and most of them we had to look up or stand in for. So before trusting any prediction, we nudge each number and see which ones actually move the answer.",
        "The ones that move it are the ones worth measuring properly at a bench. The ones that do not, we can stop worrying about, or drop from the model altogether.",
      ],
    },
    {
      kind: "prose",
      heading: "Local sensitivity analysis",
      body: [
        "Local sensitivity analysis moves all parameters in the model by ten percent in both directions, one at a time. It re-simulates the full model at each term.",
        "Our local sensitivity analysis was run on the un-bundled ternary version (pre-bundling), in nM and hours, at separate preset values from those included in the table. Since what we take from it is the ranking and the signs, not the levels, we use this to determine which rates matter and the direction each parameter pushes our SMO ciliary readout.",
      ],
    },
    {
      kind: "tornado",
      id: "sensitivity",
      navLabel: "Local sensitivity",
      rows: [
        { label: "SMO made in the cytoplasm", note: "k form, SMO-cyt", value: 1.3 },
        { label: "MMM complex made", note: "k form, MMM", value: -1.28 },
        { label: "Tagging rate once bound", note: "kcat", value: -1.28 },
        { label: "MMM complex degraded", note: "k deg, MMM", value: 1.26 },
        { label: "Ternary enhancement", note: "alpha", value: -0.87 },
        { label: "Linker's grip on SMO", note: "K SMO-Linker", value: 0.51 },
        { label: "Linker's grip on the complex", note: "K MMM-Linker", value: 0.31 },
        { label: "SMO entering the cilium", note: "k in", value: 0.28 },
        { label: "SMO cleared from the cytoplasm", note: "k deg, SMO-cyt", value: -0.28 },
        { label: "SMO made in the cilium", note: "k form, SMO-cil", value: 0.08 },
        { label: "Linker dose", note: "Linker", value: 0.07 },
        { label: "PTCH1 present", note: "PTCH1", value: -0.05 },
        { label: "PTCH1 gate strength", note: "k PTCH-SMO", value: -0.05 },
        { label: "SMO leaving the cilium", note: "k out", value: -0.03 },
        { label: "SMO degraded in the cilium", note: "k deg, SMO-cil", value: -0.03 },
        { label: "Binder letting go", note: "k minus 3", value: -0.02 },
        { label: "Binder dose", note: "DeNovo", value: 0.01 },
        { label: "Binder binding the complex", note: "k 3", value: 0.01 },
        { label: "Linker letting go", note: "k off", value: 0.0 },
        { label: "Linker binding the complex", note: "k f, MMM-Linker", value: 0.0 },
      ],
      positiveMeans: "more of it means more SMO in the cilium",
      negativeMeans: "more of it means less SMO in the cilium",
      footnote:
        "Four parameters carry the answer and eleven barely register.",
    },
    {
      kind: "prose",
      id: "local-findings",
      body: [
        "Ciliary SMO is controlled in equal parts by supply and by how much active complex there is. SMO synthesis raises it most strongly (1.30), and its ten percent swing is about 0.81 nM, roughly a quarter of the baseline. The complex pulls the other way: **the tagging rate and complex synthesis have identical sensitivities (-1.28), because both enter only through the same product**, and complex degradation has the opposite sign (+1.26). That run's own baseline is 3.1 nM of ciliary SMO, with 17.9 nM in the cytoplasm and 24.9 nM of free complex, which is what the swings here are measured against rather than the 1 nM anchor in the table above.",
        "A second tier holds the ternary terms: the enhancement alpha (-0.87), the linker's grip on SMO (+0.51) and on the complex (+0.31). Stronger cooperativity means more tagging and less ciliary SMO, while weaker binding to either partner does the reverse. Trafficking and PTCH1 come next and are already weak, at about 0.28 and below.",
        "The on and off rates of both the binder and the linker barely move the readout at all, which says the device's behaviour is set by how much is dosed and how well the ternary complex works, not by how quickly the parts find each other.",
      ],
    },
    {
      kind: "details",
      id: "how-sensitivity-was-run",
      navLabel: "How it was run",
      heading: "How the local analysis was run",
      summary: "The solver, the method and the 120-hour window.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Six quantities were tracked over a simulated 120 hours: cytoplasmic, ciliary and tagged SMO, the MMM complex, its taken-apart form, and the complex joined to the linker. The model was written in **Antimony** and run in **Tellurium**, using libRoadRunner's CVODES integrator at tolerances of 1e-10 and 1e-12.",
            "For every quantity and every parameter, the derivative of one with respect to the other came from libRoadRunner's forward sensitivity solver, which integrates the sensitivity equations alongside the model itself. Every coefficient was then normalised, so that parameters measured in different units can be compared directly. For the chart above, each parameter was moved by ten percent either way, one at a time, and the whole model re-simulated.",
          ],
        },
        {
          kind: "line",
          id: "time-resolved-sensitivity",
          heading: "How the ranking settles over time",
          intro:
            "The same normalised sensitivities, hour by hour rather than at the end, for the six parameters that matter. The names are the ones used in the chart above.",
          panels: [{ series: TIME_RESOLVED_SERIES }],
          xLabel: "hours",
          yLabel: "percent change in ciliary SMO per percent change in the parameter",
          footnote:
            "The order settles inside the first day and does not change after it, which is why reporting a single number at 120 hours is fair. SMO synthesis overshoots early and falls back. Complex degradation is the slowest of them: it is at 1.02 after a day and only reaches 1.26 towards the end of the window, which is why 120 hours was the window chosen. The tagging rate is drawn dashed because it lies exactly on top of MMM complex made: the two are the same line, for the reason given above.",
        },
        {
          kind: "table",
          id: "normalised-sensitivities",
          heading: "The same analysis, every quantity",
          intro:
            "Normalised sensitivity at 120 hours: the percent change in that quantity per percent change in that rate. One row per rate, one column per quantity, for the same un-bundled version as the chart above, which is why cytoplasmic SMO has a column here. The five rates left out never reach 0.1 against anything.",
          columns: NORMSENS_TABLE.columns,
          rows: NORMSENS_TABLE.rows,
          heat: true,
          caption:
            "The useful part is where the zeros are. Nothing about SMO changes how much complex there is, so the three right-hand columns stay flat for every SMO rate. Further down, the binder rates move only the taken-apart complex and the linker rates move only the linker-bound complex: each arm does its own job and nothing else, which is what lets the two be dosed independently.",
        },
      ],
    },
    {
      kind: "prose",
      id: "global-sensitivity",
      navLabel: "Global sensitivity",
      heading: "Global sensitivity analysis",
      body: [
        "Local analysis only describes a pre-set range of settings we chose. Since six of those settings are stand-ins, we also ran a **global** analysis, which samples the whole plausible range at once. To do so, we apply a combination of both Morris [11] and Sobol [12] sensitivity analysis methods sequentially, where parameters flagged by both systems would eventually be dropped from the model.",
        "Because our model is dependent on a complementary relationship through the tuner system, we adapted our output to the **log10 fold change** of ciliary SMO to ensure increases and decreases in SMO are weighted equally.",
        "GSA was run on the bundled model including the parameter defaults outlined in the table.",
      ],
    },
    {
      kind: "bars",
      id: "sobol",
      navLabel: "Sobol indices",
      heading: "How much of the spread each parameter explains",
      intro:
        "Sobol indices for ciliary SMO. **ST** counts everything a parameter does, including through its interactions with others; **S1** counts only what it does on its own. The whiskers are the run's own confidence intervals.",
      series: [{ label: "ST, with interactions" }, { label: "S1, on its own" }],
      rows: SOBOL_ROWS,
      axisLabel: "share of the spread in ciliary SMO",
      footnote:
        "Clearance by the complex leads at ST = 0.281, then the two doses (linker 0.253, binder 0.228) and the ternary enhancement (0.125). The PTCH1 gate is effectively nothing at 0.003, and the four binding rates sit between 0.064 and 0.077. Both arms work mostly through direct effects but carry a secondary interaction component: the binder runs S1 = 0.166 against ST = 0.228, the linker S1 = 0.164 against ST = 0.253. The wider gap on the linker is what a ternary complex should look like, since its effect depends on alpha and on both of its binding rates.",
      source: "Sobol analysis with SALib [13], N = 1024 including second order, 22,528 model runs.",
    },
    {
      kind: "scatter",
      id: "morris",
      navLabel: "Morris screening",
      heading: "Morris screening method",
      intro:
        "We implement the Morris screening method to evaluate and rank parameters based on how much they move readout against variance.",
      panels: [{ points: MORRIS_POINTS }],
      groups: [
        { id: "named", label: "name certain", shape: "square" },
        { id: "crowded", label: "name read from a crowded cluster", shape: "diamond" },
      ],
      xLabel: "average effect on the output",
      yLabel: "how much that effect varies",
      diagonal: true,
      footnote:
        "Morris screening, ranking by mean absolute elementary effect, labelled k_MMM as the most influential, followed by the doses of both linker and binder and ternary enhancement alpha. The least influential metric, per Morris, was the PTCH1 gate. Six of the measured rates (including the ternary enhancement) indicated high variance, implying non-linear effects inflating significance scoring through Morris and dependence on cooperativity with more influential terms.",
      source:
        "Four of the ten names sit in one cluster in the run's own figure. Those four are our reading of which point is which, and are marked as such.",
    },
    {
      kind: "details",
      id: "sobol-second-order",
      navLabel: "Second-order interactions",
      heading: "The interactions themselves",
      summary: "Every pair's confidence interval crosses zero, which is the result.",
      blocks: [
        {
          kind: "bars",
          intro:
            "Second-order Sobol indices: how much of the spread each **pair** of parameters explains together, beyond what each explains alone.",
          series: [{ label: "S2" }],
          rows: SOBOL_S2_ROWS,
          axisLabel: "share of the spread explained by the pair together",
          footnote:
            "Every interval crosses zero, so none of these pairs is distinguishable from no interaction at this sample size. What survives is the direction rather than the size: the leading pairs all involve the linker, which is consistent with a ternary complex whose effect depends on several of its own constants at once. Conclusions from this chart should be read as linker-centred, not as measured magnitudes.",
        },
      ],
    },
    {
      kind: "prose",
      id: "tuner-discussion",
      navLabel: "Discussion",
      heading: "Future directions",
      body: [
        "To advance the model, measuring the binder and linker binding constants (**SPR**) and the ternary enhancement alpha (in-cell degradation assay) would convert this feasibility envelope into a true prediction. On top of this, a second independent MEGF8-knockout fold change would further harden the single-point calibration, allowing us to move forward with more complex analytics. This would allow us to take sensitivity analysis results a step further and collapse unnecessary model components, preventing overdefinition of the model.",
        "Because PTCH1 loss defines BCC, yet the gate term observed here is non-influential, our simplified mass-action gate under-represents PTCH1's true (cholesterol-transport) mechanism. By fixing the PTCH1 gateway mechanism explicitly, we can define the model to a greater extent as seen in the GPCR system model. Currently both models adopt alternate PTCH1 concentrations (according to model-specific sourced cell types), but both rate the relevance of PTCH1's gate term as non-influential.",
        "The sensitivity ranking helps us prioritise which parameters to measure first. In GSA, we saw dose and the ternary enhancement alpha dominate the readout, while the precise binding kinetics do not; wet lab effort is best directed at the in-cell degradation assay (alpha) and dose response before high-resolution **SPR** to determine the on/off rates.",
        "The current bundled model uses a simplified single-arm ternary term, which loses potentially valuable information. By reimplementing the full two-arm cooperative rate law we could capture the high-dose **hook (prozone) effect**, which is relevant for identifying the linker's optimal dosing window to ensure oversaturation does not occur.",
      ],
    },
    {
      kind: "prose",
      section: "The GPCR system",
      navLabel: "KM: the GPCR system",
      id: "gpcr",
      heading: "How best to model SMO itself",
      body: [
        "In this section, we explore how to best model SMO signalling. In alignment with the core model, our primary objective is to probe when conditions result in excess signalling from SMO, which may potentially be oncogenic [1]. We also want to develop our model to reflect ciliary sensitivity to relevant physiological processes.",
        "SMO is regulated in the body by the Hedgehog ligand and Patched (**PTCH1**), which prevents SMO from localising to the membrane of the primary cilium and ultimately inhibits SMO. Hedgehog activates the Hedgehog pathway by inhibiting PTCH1 [2]. Despite much study on the mechanisms of these different steps, there is not a clear consensus on how the pathway works in detail. For example, in lieu of previous models of PTCH1 where PTCH1 directly binds and inhibits SMO [3], recent evidence suggests that PTCH1 regulates SMO by reducing cholesterol accessibility in the outer plasma membrane [4, 5]. Meanwhile, others claim that PTCH1 expels cholesterol out of the cell altogether [7].",
        "Here, we advance a model in which SMO signalling is modulated by outer-leaflet cholesterol in the plasma membrane and test the model's ability to replicate several experimental observations. We intend to select a model that accurately predicts SMO signalling and responds realistically to important stimuli within the body.",
        "Our model expands on previous models by dynamically modelling the distribution of cholesterol as an endogenous SMO ligand. Cholesterol naturally distributes unevenly between the outer and inner layers of phospholipid bilayers [6]. Interestingly, PTCH1 has been proposed to alter the distribution across the inner and outer leaflets by being a rare transporter of sterols [7]. Indeed, Niemann-Pick disease type C1 protein (NPC1), a close relative of PTCH1, plays a similar role in the lysosome by transporting sterols from the lysosomal lumen to the outer leaflet of the lysosome [7]. We implemented PTCH1's action both as a linear relationship and with enzyme kinetics, and will rule one out on performance once the unknown parameters have been measured.",
      ],
    },
    {
      kind: "figure",
      id: "gpcr-schematic",
      src: "model/gpcr-schematic.webp",
      alt: "A schematic of the model's reactions. A primary cilium rises out of the plasma membrane, with cholesterol, SMO, PTCH1 and the Hedgehog ligand marked in a key. PTCH1 is labelled as importing cholesterol from the outer leaflet to the inner one. SMO is made in the cytoplasm by a first-order process and diffuses between the cytoplasm and the cilium. SMO binds cholesterol at its extracellular cysteine-rich domain, and the model assumes that binding increases SMO's affinity for the membrane and that signalling is proportional to the amount of SMO there. A fast decay rate removes SMO from the membrane.",
      caption:
        "The reactions in the GPCR model: cholesterol moving between the membrane leaflets, PTCH1 acting on that distribution, and SMO activating when it binds cholesterol at the domain facing outward. Everything above the plasma membrane is outside the cell. One callout drawn on the figure has been overtaken: in the model as fitted, the signal comes from cholesterol-bound SMO alone, not from all SMO at the membrane.",
      ratio: "square",
    },
    {
      kind: "prose",
      id: "gpcr-choices",
      navLabel: "Two open questions",
      heading: "Two things we could not decide from the literature",
      body: [
        "Rather than pick, we built both and let the results choose. **PTCH1's action** is implemented once as a linear relationship and once with enzyme kinetics. This follows the same advice that shaped the tuner model: build candidates that differ in one relationship, then look for disagreement with the objectives below. If neither could be ruled out on performance, we would favour the linear one for simplicity.",
        "**How SMO reaches the cilium** is the second. One account has SMO move into the membrane and diffuse along it to the cilium [14]; the other has it travel inside the cell [8, 9]. We implement the second as a diffusion equation, where SMO moves between the cell body and the cilium to balance the two concentrations, and intend to implement the first as well and see which better matches experiment.",
      ],
    },
    {
      kind: "figure",
      id: "migration-models",
      src: "model/migration-models.webp",
      alt: "The alternative route for SMO reaching the cilium. The same cilium and plasma membrane as the previous figure, with cholesterol, SMO, PTCH1 and the Hedgehog ligand in a key. SMO is synthesised in the cytoplasm and migrates to the plasma membrane, then reaches the ciliary membrane by lateral diffusion along it. A red cross marks the base of the cilium, showing that the intracellular route between the cytoplasm and the cilium is closed in this version of the model.",
      caption:
        "The route we did not implement. Here SMO reaches the cilium by diffusing along the membrane rather than travelling through the cell, and the red cross marks the path that version closes off.",
      ratio: "square",
    },
    {
      kind: "details",
      id: "gpcr-assumptions",
      navLabel: "Assumptions",
      heading: "Assumptions",
      tone: "lilac",
      blocks: [
        {
          kind: "facts",
          items: [
            {
              title: "Only cholesterol-bound SMO signals",
              body: "Signalling could in principle come from SMO at the ciliary membrane whether or not cholesterol is bound. We set the unbound contribution to zero, so the signal in the model is proportional to cholesterol-bound SMO alone.",
            },
            {
              title: "Ciliary cholesterol behaves like cholesterol in synthetic vesicles",
              body: "The split of cholesterol between the two leaflets inside the cilium is taken from measurements in synthetic vesicles, because nobody has measured it in a cilium.",
            },
            {
              title: "Total PTCH1 is constant",
              body: "PTCH1 is neither made nor degraded here. Only the conversion between its active and inhibited forms is modelled, which is the part the Hedgehog ligand acts on.",
            },
            {
              title: "Whole-cell concentrations from counts and a sphere",
              body: "Cholesterol concentration comes from a molecule count per cell divided by the volume of a sphere of 13 micrometre radius. That gives sensible ratios of cholesterol to PTCH1 and to SMO, which is what the model needs.",
            },
            {
              title: "One scalar converts abundance into rate",
              body: "Reactions between a membrane-bound species and a soluble one need a conversion between a surface quantity and a volume one. The model uses a single tunable parameter for all of them rather than a separate factor each time.",
            },
            {
              title: "Transport is diffusion between compartments",
              body: "Movement between the cytoplasm and the cilium is proportional to the difference in concentration between them. The same rule would govern lateral movement along the membrane if the other migration route above is ever built; it is not in the model as it stands. First-order kinetics would describe the same exchange.",
            },
          ],
        },
      ],
    },
    {
      kind: "details",
      id: "gpcr-equations",
      navLabel: "The two candidates",
      heading: "Where the two candidate models differ",
      summary: "One reaction, written two ways. Everything else in the two models is identical.",
      blocks: [
        {
          kind: "prose",
          body: [
            "The whole comparison turns on a single reaction: cholesterol moving from the outer leaflet to the inner one, which is what PTCH1 is proposed to drive. Written as reactions, with concentrations in nM and time in seconds:",
          ],
        },
        {
          kind: "table",
          columns: ["Reaction", "Rate, linear", "Rate, Michaelis-Menten"],
          rows: [
            [
              "outer leaflet to inner",
              "`import_rate*PTCH1*chol_outer + exchange_in*chol_outer`",
              "`PTCH1*V_max*chol_outer/(K_m + chol_outer) + exchange_in*chol_outer`",
            ],
            ["inner leaflet to outer", "`exchange_out*chol_inner`", "the same"],
            ["PTCH1 binds Hedgehog", "`ptch1_rate*PTCH1*SHh`", "the same"],
            ["the complex comes apart", "`30*ptch1_rate*PTCH1_i`", "the same"],
          ],
          caption:
            "Only the first row differs between the two candidates, and only in its first term. The second term of that row, with the second row, is the cell's own movement of cholesterol between the leaflets, which happens with or without PTCH1; the two are balanced so that **10 percent** of the cholesterol rests in the outer leaflet. The factor 30 is the dissociation constant for PTCH1 and Hedgehog in nM.",
        },
        {
          kind: "prose",
          body: [
            "The rest of the system, which both versions share, is the one the schematic above draws: SMO is made in the cytoplasm, exchanges with the cilium by diffusion, embeds in the ciliary membrane, binds cholesterol there to become active, and decays. Runs are simulated over 10,000 seconds.",
            "Two geometric quantities set the scale of everything else. A cell of 13 micrometre radius holds about 9.2 picolitres, while a cilium of 0.2 micrometre radius and 6.5 micrometres length holds about 0.8 femtolitres, so the cell is roughly **11,000 times** the volume of its own cilium. A count of 10 to the 9 cholesterol molecules in that cell volume works out at about **180,000 nM**, which is why cholesterol dwarfs every protein in the model.",
          ],
        },
        {
          kind: "prose",
          body: [
            "The subteam's own write-up, with both candidate models written out in full, the assumptions behind them, and the volume and concentration calculations they rest on.",
          ],
        },
        {
          kind: "pdf",
          file: "model/gpcr-model-equations-parameters.pdf",
          title: "The GPCR model, in full",
          pages: 5,
        },
      ],
    },
    {
      kind: "details",
      id: "gpcr-values",
      navLabel: "Parameters",
      heading: "Parameters",
      tone: "lilac",
      blocks: [
        {
          kind: "table",
          columns: ["Quantity", "Value", "Source"],
          rows: [
            ["PTCH1 and Hedgehog dissociation constant", "30 nM", "Literature [18]. A second source gives 2 nM"],
            ["PTCH1 abundance", "1.5 ppm", "PaxDb [20]"],
            ["PTCH1 degradation", "retains 0.45 of itself over 3 hours, or 7.39e-5 per second", "Literature [17]"],
            ["Apparent cholesterol transport rate for PTCH1", "0.0935 per minute", "A fitted value [10]"],
            ["SMO abundance", "2.604 ppm", "PaxDb [20]"],
            ["SMO degradation", "8.63e-5 per second, a half-life of 2.2 hours", "Literature [13]"],
            ["SMO basal activity", "one sixty-fourth of its activated level", "Literature [4]"],
            ["SMO and cholesterol dissociation constant", "138 nM", "Measured for an oxysterol [16] and assumed similar"],
            ["Cholesterol in the outer leaflet", "10 percent of the total", "From synthetic vesicles [6]"],
            ["Cholesterol molecules per cell", "10 to the 9", "Literature [12]"],
            ["Protein molecules per cell", "10 to the 9", "Literature [19]"],
            ["Cell radius used for the volume", "13 micrometres", "The model's own geometry. A cultured human cell is about 25 micrometres across, so this is the usual figure rounded up"],
            ["Cilium radius", "0.2 micrometres", "Literature [15]"],
            ["Cilium length", "3 to 10 micrometres", "Literature [15]"],
          ],
          caption:
            "These are the values looked up before fitting. Several of the rate constants in the model are not in this table because no measurement of them exists: those were tuned against the objectives below.",
        },
      ],
    },
    {
      kind: "table",
      id: "objectives",
      navLabel: "What it has to reproduce",
      heading: "What the model has to reproduce",
      intro:
        "Five targets, chosen before fitting. Four come from published measurements and one, the cytoplasmic half-life, is a figure the subteam set. A set of parameters is scored on how closely the simulation reproduces all five.",
      columns: ["Observation", "The target"],
      rows: [
        [
          "Cholesterol transport by PTCH1, taken from its close relative NPC1 at the lysosomal membrane",
          "A decay rate of 0.09 per minute for outer-leaflet cholesterol after activation [10]",
        ],
        [
          "How much outer-leaflet cholesterol is removed on activation, measured by stripping it with methyl-beta-cyclodextrin",
          "Abundance falls to 0.429 of its original amount [11]",
        ],
        [
          "SMO's sensitivity to Hedgehog, from its half-maximal concentration of 1 nM",
          "A twofold difference in signalling between a 1 nM run and a fully activating 300 nM run [4]",
        ],
        ["How fast SMO leaves the cytoplasm", "A half-life of 20 minutes"],
        [
          "How fast SMO is degraded once activated",
          "A half-life of 2 hours at the ciliary membrane, measured after the peak [14]",
        ],
      ],
    },
    {
      kind: "prose",
      id: "gpcr-results",
      navLabel: "What the two did",
      heading: "What the two models did",
      body: [
        "Both reproduced the five objectives. Scored as the total distance from all five targets at once, the **linear model reached 0.14 and the Michaelis-Menten model 0.2**. Neither is ruled out by that, which is the case we said in advance would send us to the simpler of the two.",
        "That score is one term per objective, summed:",
        "`Loss = sum over i of (observed_i - actual_i)^2 / actual_i^2`",
        "**observed** is the value read off the simulation and **actual** the value the literature gives. Dividing by the literature value squared makes each term a relative error, so objectives measured in different units count equally and the total is a plain number rather than a quantity with units. Each observed value is taken from the run the same way the experiment took it: for the migration half-life we fit an exponential to the cytoplasmic SMO the model produces, take its half-life, and compare that with the 20 minutes, or 1,200 seconds, the literature reports. A lower total means every objective is closer at once.",
        "The figures below show each model under three conditions: no Hedgehog, enough to half-activate the pathway, and a saturating dose. The top row is PTCH1, the middle row cholesterol on each side of the membrane, and the bottom row the SMO pools, including the activated one that carries the signal.",
      ],
    },
    {
      kind: "figure",
      id: "gpcr-linear-simulations",
      src: "model/gpcr-linear-simulations.webp",
      alt: "Nine panels in three rows and three columns, for the linear model, over 10,000 seconds. The columns are basal, half-maximal and saturating Hedgehog. In the top row, activated and inhibited PTCH1 hold steady in the first two columns; under saturating Hedgehog, inhibited PTCH1 jumps almost vertically at the start and stays high while activated PTCH1 drops to a low level. The middle row is the same in all three columns: inner-leaflet cholesterol rises and settles while outer-leaflet cholesterol falls to a small fraction of it. In the bottom row, cytoplasmic SMO falls away, total and membrane SMO in the cilium rise to a peak in the first few thousand seconds and then decline slowly, and activated SMO is lowest in the basal column and higher in the other two.",
      caption: "The linear model: PTCH1 acts on the cholesterol distribution through a simple rate.",
      ratio: "square",
      source: "Produced by the modelling subteam.",
    },
    {
      kind: "figure",
      id: "gpcr-mm-simulations",
      src: "model/gpcr-mm-simulations.webp",
      alt: "The same nine panels for the Michaelis-Menten model. The cholesterol row behaves as in the linear model. The top row differs under saturating Hedgehog, where inhibited PTCH1 climbs over a few hundred seconds rather than jumping. In the bottom row the ciliary SMO pools peak earlier and then fall away more steeply than in the linear model, cytoplasmic SMO falls throughout, and activated SMO stays low in all three columns.",
      caption:
        "The Michaelis-Menten model, where PTCH1 saturates. Its switch is gradual rather than immediate, the SMO pools peak earlier and fall away faster, and activated SMO stays low throughout.",
      ratio: "square",
      source: "Produced by the modelling subteam.",
    },
    {
      kind: "prose",
      id: "gpcr-observations",
      navLabel: "What we make of it",
      heading: "What we make of the difference",
      body: [
        "While we originally believed implementing a target half-life for SMO in the cytoplasm would ensure a realistic response in signalling rate, we noticed an immediate spike in activated SMO concentration from the linear model. Meanwhile, activated SMO is very low in concentration in the Michaelis-Menten simulation. At a glance, the fits of both models are considerably different from each other. This difference is reflected in the sensitivity analysis, where the cilial degradation rate appears to most heavily influence simulations for the linear model while the forward rate of SMO membrane embedding is most significant in the Michaelis-Menten model.",
        "Given the adequate fit of our current objectives with the linear model, we anticipate moving forward with a linear approximation of PTCH1 kinetics. Measured by Gli mRNA abundance, a 64-fold difference in SMO signalling with and without 50 nM SHh was observed by Kinnebrew et al. [21]. This might serve as a valuable objective given the lack of an observable difference in response between basal and EC50 simulations between our models. The most useful thing now would be wet lab data on how SMO migrates at the cilium, and on whether that immediate rise in activated SMO is seen under a microscope at all.",
        "Without further revision of the objectives, we can replicate several experimental conditions using a model of cholesterol-liganded SMO where SMO diffuses to and from the cilium intracellularly.",
      ],
    },
    {
      kind: "details",
      id: "gpcr-sensitivity",
      navLabel: "Sensitivity",
      heading: "Which parameters each model leans on",
      summary: "Morris and Sobol for both candidates, and the interactions between pairs.",
      blocks: [
        {
          kind: "prose",
          body: [
            "The same two methods used on the tuner model, run on each candidate. The bars below are the subteam's own output. We have not redrawn them here because the underlying values have not been recovered from the run, so what we take from them is the **ordering**, not the heights.",
            "For the linear model the ciliary degradation rate leads under Morris, with the cytoplasm-to-membrane rate just behind, and Sobol puts those two first in the other order. For the Michaelis-Menten model the embedding rate leads under both methods. The PTCH1 exchange rate stays in the bottom group of every one of the four rankings.",
          ],
        },
        {
          kind: "figure",
          id: "gpcr-linear-morris",
          src: "model/gpcr-linear-morris.webp",
          alt: "A bar chart titled Linear Model Morris Significances, each bar with an error bar. The bars fall from left to right in this order: ciliary degradation rate, cytoplasm to membrane, cholesterol exchange rate, compartment diffusion, PTCH1 import rate. The last three, the embedding rate, the PTCH1 exchange rate and the SMO exchange rate, are at zero.",
          caption: "Morris screening of the linear model.",
          ratio: "square",
          source: "Produced by the modelling subteam.",
        },
        {
          kind: "figure",
          id: "gpcr-linear-sobol",
          src: "model/gpcr-linear-sobol.webp",
          alt: "A bar chart of Sobol indices for the linear model, with the parameters in a fixed order along the bottom rather than sorted. Cytoplasm to membrane is much the tallest bar and ciliary degradation the next, each with a wide interval. Every other parameter sits near zero with an interval that crosses it.",
          caption: "Sobol indices for the linear model. Every interval but the leading one crosses zero.",
          ratio: "square",
          source: "Produced by the modelling subteam.",
        },
        {
          kind: "figure",
          id: "gpcr-mm-morris",
          src: "model/gpcr-mm-morris.webp",
          alt: "A bar chart titled Michaelis-Menten Model Morris Significances, each bar with an error bar. The bars fall from left to right in this order: the embedding forward rate, the SMO exchange rate, the cytoplasm to membrane rate, the ciliary degradation rate, then V max and K m, then the PTCH1 exchange rate and compartment diffusion, with cholesterol exchange at zero.",
          caption: "Morris screening of the Michaelis-Menten model. The vertical scale here is far below the linear model's, so the two charts cannot be compared by bar height: read the ordering. The output barely moves in this model, which fits the near-zero activated SMO above.",
          ratio: "square",
          source: "Produced by the modelling subteam.",
        },
        {
          kind: "figure",
          id: "gpcr-mm-sobol",
          src: "model/gpcr-mm-sobol.webp",
          alt: "A bar chart of Sobol indices for the Michaelis-Menten model, with the parameters in a fixed order along the bottom. The SMO exchange rate and the embedding forward rate are much the tallest, and the SMO exchange rate carries an enormous interval running from well below zero to several times its own height. Three smaller bars, V max, the ciliary degradation rate and the cytoplasm to membrane rate, each carry an interval that crosses zero. The PTCH1 exchange rate, K m, compartment diffusion and cholesterol exchange sit on the axis.",
          caption: "Sobol indices for the Michaelis-Menten model.",
          ratio: "square",
          source: "Produced by the modelling subteam.",
        },
        {
          kind: "table",
          id: "gpcr-s2-linear",
          heading: "Interactions between pairs, linear model",
          intro:
            "Second-order Sobol indices: how much of the spread each pair explains together, beyond what each one explains alone.",
          columns: [
            "",
            "import",
            "SMO exch",
            "embed",
            "comp diff",
            "deg",
            "chol exch",
            "to membrane",
          ],
          rows: [
            ["PTCH1 exchange", "0", "0", "0", "0", "0", "0", "0"],
            ["PTCH1 import", "", "0.020", "0.020", "0.037", "0.025", "0.005", "0.160"],
            ["SMO exchange", "", "", "0", "0", "0", "0", "0"],
            ["embedding", "", "", "", "0.0005", "0.0005", "0.0003", "0.0008"],
            ["compartment diffusion", "", "", "", "", "0.062", "0.072", "0.046"],
            ["ciliary degradation", "", "", "", "", "", "0.032", "0.110"],
            ["cholesterol exchange", "", "", "", "", "", "", "0.160"],
          ],
          heat: true,
          caption:
            "Everything involving the cytoplasm-to-membrane rate is where the interaction sits, and the PTCH1 and SMO exchange rates interact with nothing: the entries shown as zero are all below one part in a hundred thousand. No confidence intervals were produced for these, and the negative entries in the other model suggest they would be wide.",
        },
        {
          kind: "table",
          id: "gpcr-s2-mm",
          heading: "Interactions between pairs, Michaelis-Menten model",
          columns: [
            "",
            "K m",
            "V max",
            "SMO exch",
            "embed",
            "comp diff",
            "deg",
            "chol exch",
            "to membrane",
          ],
          rows: [
            ["PTCH1 exchange", "-0.010", "0.002", "0.006", "0.0005", "-0.011", "-0.013", "-0.009", "-0.023"],
            ["K m", "", "0.016", "0.019", "-0.045", "-0.003", "-0.004", "0", "-0.015"],
            ["V max", "", "", "-0.005", "-0.019", "0.057", "0.093", "0.044", "0.150"],
            ["SMO exchange", "", "", "", "-0.170", "-0.072", "-0.097", "-0.078", "-0.050"],
            ["embedding", "", "", "", "", "-0.007", "0.021", "-0.012", "-0.017"],
            ["compartment diffusion", "", "", "", "", "", "-0.008", "-0.007", "-0.003"],
            ["ciliary degradation", "", "", "", "", "", "", "0", "0.071"],
            ["cholesterol exchange", "", "", "", "", "", "", "", "0"],
          ],
          heat: true,
          caption:
            "A second-order index cannot really be negative, so the negative entries here are the estimator's noise. They are as large as the positive ones: at this sample size none of these interactions is measured, only bounded.",
        },
      ],
    },
    {
      kind: "prose",
      section: "Safety: the melanocortin pathway",
      navLabel: "KM: safety",
      id: "mc4r-safety",
      heading: "Checking it cannot do harm somewhere else",
      body: [
        "In the MMM complex, MGRN1 and MEGF8 come together as part of the E3 ring ligase structure. Within this structure, MEGF8 concentration determines the full saturation of MMM [1]. So in a canonical fibroblast, excess MGRN1 remains unbound, potentially causing off-target effects.",
        "Within the cilia, MGRN1 also interacts with ATRN to create an E3 ligase complex that controls **MC4R** and the melanocortin pathway [2]. When the minibinder breaks MMM apart, we can expect excess MGRN1 to be available for ATRN binding, which may disrupt the melanocortin pathway. In this model, we examine whether the redistribution of MGRN1 could result in side effects to the melanocortin pathway.",
      ],
      source: "Abundances from PaxDb [9]. The MMM complex after [1] and [4]; the melanocortin arm after [2].",
    },
    {
      kind: "details",
      id: "mc4r-variables",
      navLabel: "How it is built",
      heading: "How the safety model is built",
      summary: "Why mass action rather than Michaelis-Menten, and the five quantities it follows.",
      blocks: [
        {
          kind: "prose",
          body: [
            "The model is written in Python through the Tellurium interface built by the Sauro lab [10], and uses **mass-action kinetics**. The reason is the concentrations. MC4R sits at about 0.06 nM, orders of magnitude below the usual Km of a ring E3 ligase, and that far below Km the Michaelis-Menten rate reduces to a first-order one: mass action here is the limit the fuller equation takes rather than a convenient approximation of it. The geometry points the same way, since MC4R is in the membrane and MGRN1 is recruited to it rather than meeting it in free solution, which is the picture Michaelis-Menten assumes [11].",
          ],
        },
        {
          kind: "table",
          columns: ["Quantity", "What it is", "Where its starting value comes from"],
          rows: [
            [
              "**M_free**",
              "Free cytoplasmic MGRN1, bound to nothing. The competition point: any MGRN1 the binder frees passes through here before it can reach ATRN.",
              "Whatever is left of the 0.18 nM of MGRN1 once the complex has taken its share, which is 0.032 nM",
            ],
            [
              "**M_MMM**",
              "MGRN1 held inside the full complex at the plasma membrane. This is what the binder reduces.",
              "MEGF8's PaxDb abundance before the membrane factor, 0.24 nM, times the 0.617 share of it found carrying MGRN1 in a published figure [3], which gives 0.148 nM",
            ],
            [
              "**M_ATRN**",
              "MGRN1 bound to ATRN, the complex that ubiquitinates MC4R. The off-target effector: if this rises when binder is added, MC4R is affected.",
              "Starts empty. The interaction itself is from [2]",
            ],
            [
              "**MC4R_s**",
              "Surface MC4R available for melanocortin signalling. The safety readout.",
              "PaxDb [9], 0.01 ppm",
            ],
            [
              "**f_MB**",
              "The fraction of binding sites on MEGF8 occupied by the binder, from none to full saturation.",
              "Benchmarked against a published nanobody against the same site",
            ],
          ],
          caption:
            "A sixth quantity, ubiquitinated MC4R on its way to the lysosome, is tracked only so the mass balance closes.",
          source: "Abundances from PaxDb [9].",
        },
      ],
    },
    {
      kind: "details",
      id: "mc4r-equations",
      navLabel: "Equations",
      heading: "The equations the safety model solves",
      summary: "Five rate equations and the one term the binder acts through.",
      blocks: [
        {
          kind: "table",
          columns: ["Quantity", "Rate of change"],
          rows: [
            [
              "**M_free**",
              "`k_release_MMM*M_MMM - k_bind_MEGF8*MEGF8*M_free*(1 - f_MB) - k_bind_ATRN*ATRN*M_free + k_release_ATRN*M_ATRN - k_deg_MGRN1*M_free + k_synth_MGRN1`",
            ],
            [
              "**M_MMM**",
              "`k_bind_MEGF8*MEGF8*M_free*(1 - f_MB) - k_release_MMM*M_MMM - k_deg_MGRN1*M_MMM`",
            ],
            [
              "**M_ATRN**",
              "`k_bind_ATRN*ATRN*M_free - k_release_ATRN*M_ATRN - k_deg_MGRN1*M_ATRN`",
            ],
            [
              "**MC4R_s**",
              "`k_synth_MC4R - k_ub_MC4R*M_ATRN*MC4R_s - k_deg_MC4R*MC4R_s`",
            ],
            [
              "**MC4R_ub**",
              "`k_ub_MC4R*M_ATRN*MC4R_s - k_deg_ub_MC4R*MC4R_ub`",
            ],
            ["**f_MB**", "`MB / (MB + K_d_MB)`"],
          ],
          caption:
            "The binder enters in one place only, through `f_MB`, which closes off a share of the MEGF8 sites that MGRN1 would otherwise bind. Everything downstream of that follows from the competition between MEGF8 and ATRN for the same MGRN1.",
        },
        {
          kind: "prose",
          body: [
            "The subteam's own write-up, with the five rate equations and the parameter table behind them.",
          ],
        },
        {
          kind: "pdf",
          file: "model/melanocortin-model.pdf",
          title: "Melanocortin Model EQ",
          pages: 2,
        },
      ],
    },
    {
      kind: "details",
      id: "mc4r-parameters",
      navLabel: "Parameters",
      heading: "Parameters",
      tone: "lilac",
      blocks: [
        {
          kind: "table",
          columns: ["Parameter", "Value", "Where it comes from"],
          rows: [
            ["k_release_MMM", "0.01 per second", "A dissociation constant of 10 nM times the binding rate below"],
            ["k_bind_MEGF8", "0.001 per nM per second", "The diffusion limit, after [6]"],
            ["k_bind_ATRN", "0.01 per nM per second", "An assumption, set an order of magnitude above the rate above; the shared binding motif is why ATRN binds MGRN1 at all, not why it binds faster"],
            ["k_release_ATRN", "0.5 per second", "A dissociation constant of 50 nM times the binding rate above"],
            ["k_deg_MGRN1", "9.26e-6 per second", "Literature [5], a half-life of 20.8 hours"],
            ["k_synth_MGRN1", "1.67e-6 nM per second", "Set so that MGRN1 rests at the 0.18 nM that PaxDb implies"],
            ["k_ub_MC4R", "7.35e-5 per nM per second", "Calibrated to the threefold rise in MC4R when ATRN is knocked out [2]"],
            ["k_deg_MC4R", "2.57e-6 per second", "A surface-protein half-life of about 75 hours [8]"],
            ["k_deg_ub_MC4R", "1.93e-4 per second", "Lysosomal degradation of a GPCR, a half-life of about 1 hour [7]"],
            ["k_synth_MC4R", "4.63e-7 nM per second", "Calibrated with the rate above, to the same knockout"],
            ["K_d_MB", "10.0 nM", "Benchmarked against a published nanobody against the same site [4]"],
            ["MEGF8", "2.4 nM", "PaxDb, raised tenfold for being concentrated at the membrane"],
            ["ATRN", "39.4 nM", "PaxDb"],
            ["MGRN1, total", "0.18 nM", "PaxDb"],
            ["MC4R at the surface, at the start", "0.06 nM", "PaxDb"],
            ["MEGF8 and ATRN", "held constant", "Both are in large excess over MGRN1, so neither is depleted"],
          ],
          caption:
            "Two of these are calibrated rather than looked up: the rate at which the ATRN complex tags MC4R, and the rate at which MC4R is made. The pair is set together so that removing ATRN raises MC4R threefold, which is what the measurement shows.",
          source: "Abundances from PaxDb [9].",
        },
      ],
    },
    {
      kind: "line",
      id: "mc4r-timecourse",
      navLabel: "Time courses",
      heading: "What happens in the first half hour",
      intro:
        "Every quantity the model follows, without binder and at 500 nM of it. The three MGRN1 lines are the same molecule in three places. Both runs start from the same measured distribution and settle into the model's own resting state, so the binder's contribution is the **difference between the panels**, not the movement within either. The two panels share one scale.",
      panels: MC4R_PANELS,
      xLabel: "seconds",
      yLabel: "concentration (nM)",
      footnote:
        "Most of the movement here happens with no binder at all. The starting distribution, taken from a published figure, is not where this model rests, so the complex empties and the ATRN arm fills within about ten minutes either way. What the binder adds is the gap between the panels: MGRN1 on ATRN ends at 0.070 nM without it and 0.079 nM with it. Surface MC4R, the flat line near 0.06 nM, has barely moved by the end of either run, because MC4R turns over slowly enough that the consequence of that extra MGRN1 takes days to show. That is why the dose response below is read at the settled state rather than here.",
    },
    {
      kind: "dose",
      id: "mc4r-dose",
      navLabel: "Dose response",
      heading: "How far off-target it actually goes",
      points: [
        { label: "0", value: 0 },
        { label: "1", value: 0.72 },
        { label: "5", value: 2.66 },
        { label: "10", value: 4.02 },
        { label: "50", value: 6.8 },
        { label: "100", value: 7.44 },
        { label: "250", value: 7.88 },
        { label: "500", value: 8.04 },
      ],
      xLabel: "binder added (nM)",
      yLabel: "drop in surface MC4R (percent)",
      threshold: {
        value: 20,
        label:
          "We set twenty percent as the point where an effect becomes biologically meaningful. The worst case here, at the top of the dose range and after the system has fully settled, reaches 8.0 percent.",
      },
      footnote:
        "Read at the settled state, which is the worst case; at fourteen hours the same doses give about a third of these figures. The curve flattens by about 50 nM, which already reaches five sixths of the ceiling, and a tenfold higher dose adds only a fifth again. Dose and binder strength enter the model through one quantity, the fraction of MEGF8 sites the binder occupies, which is already 0.98 at 500 nM. Nothing can push it past 1, and that limit is where the 8.2 percent ceiling comes from. A binder ten times weaker would sit at the same occupancy as the 50 nM point and so do **less** off-target harm, not more.",
    },
    {
      kind: "prose",
      id: "mc4r-observations",
      navLabel: "What it means",
      heading: "What the safety result means",
      body: [
        "Safety modelling results show that accelerated MMM recruitment has a limited impact on melanocortin pathway signalling. At steady state, the maximum predicted change in surface MC4R was an **8.0 percent** decrease at a minibinder concentration of 500 nM, which is below the **20 percent** threshold for biological significance. The observed off-target effect is a hyperbolic dose response with half-maximum effect at approximately 10 nM, as set by Kd_MB. The underlying constraint appears to be MGRN1 availability, which is maintained at about 0.18 nM total. MGRN1 levels act as a limiting component and limit the maximum possible redistribution to ATRN irrespective of effective minibinder concentration.",
      ],
    },
    {
      kind: "prose",
      section: "Protein modelling",
      navLabel: "PM: validating the binders",
      id: "protein-modelling",
      heading: "Modelling the binder against its target",
      body: [
        "Although the protein binder design process is technically complete after backbone and sequence generation (RFdiffusion3 and ProteinMPNN, see [contribution](/contribution#pipeline)) it would likely fail to yield experimentally successful binders without **computational validation** through **forward folding**. Our team used **RoseTTAFold3**, alongside molecular visualisation software like PyMOL and ChimeraX, to iteratively improve hotspot selection – an input to backbone generation – and to select which 96 of our thousands of designed binders to order for **experimental wet lab validation**.",
      ],
    },
    {
      kind: "prose",
      id: "hotspot-targets",
      navLabel: "The targets",
      heading: "The two targets, and where we aimed",
      body: [
        "A hotspot is a residue on the target that we ask the design process to build against. Both of our targets sit in the ciliary membrane, and only the part outside it is reachable, so the choice of hotspots is also a choice about which face of the protein a binder could ever touch.",
      ],
    },
    {
      kind: "gallery",
      id: "hotspot-views",
      ratio: "tall",
      intro:
        "Each target with its chosen hotspots marked in pink. MEGF8 on the left, MOSMO on the right.",
      images: [
        {
          src: "model/megf8-hotspots.webp",
          alt: "A cartoon rendering of the MEGF8 target in green. A compact domain of beta sheets sits at the top, with several of its strands and loops picked out in pink as the chosen hotspots. A single long helix runs away from the domain towards the bottom right, with no pink on it at all: that is the part of MEGF8 inside the membrane.",
          caption: "MEGF8. The long bare helix is its single pass through the membrane, and nothing was aimed at it.",
        },
        {
          src: "model/mosmo-hotspots.webp",
          alt: "A cartoon rendering of the MOSMO target in green. Four long helices form a bundle at the bottom, and a small beta hairpin with connecting loops sits on top. The hairpin and the loops around it are picked out in pink as the chosen hotspots, while the helix bundle is entirely green.",
          caption: "MOSMO. The hotspots sit on the small head above the membrane, not on the four helices inside it.",
        },
      ],
      source: "Rendered by the protein design subteam, recoloured for this page.",
    },
    {
      kind: "details",
      id: "hotspot-selection",
      navLabel: "Choosing hotspots",
      heading: "How the hotspots were chosen",
      summary:
        "Structure and hydrophobicity, and the finding that the choice mattered less than we expected.",
      open: true,
      blocks: [
        {
          kind: "prose",
          body: [
            "For our initial backbone design, molecular visualisation programs provided a variety of tools to help us select hotspots, alongside the findings from Kong et al. [1]. Analysis of **target structure**, where the predictable structures of alpha helices and beta sheets are easier to target than flexible loops, as well as residue **hydrophobicity**, where our binder would have greater binding affinity, allowed us to select a collection of hotspots to use as inputs [2].",
            "Part of what made visualisation software so well suited to the task is that RFdiffusion only loosely respects hotspots, so identifying the **overall regions of interest** was most important. The following charts help demonstrate this, as it can be seen how the rate of success was fairly constant for any hotspots we used at high volumes.",
          ],
        },
        {
          kind: "scatter",
          id: "hotspot-charts",
          heading: "Uses against successes, per residue",
          intro:
            "Every residue of each target: how many times it was named as a hotspot in a design run, and how many of those runs produced a design that passed the filters. The dashed line is fitted through the origin.",
          panels: [
            { title: "MEGF8", points: HOTSPOT_MEGF8 },
            { title: "MOSMO", points: HOTSPOT_MOSMO },
          ],
          xLabel: "times the residue was named as a hotspot",
          yLabel: "successes credited to it",
          trend: "origin",
          footnote:
            "The graph compares the amount a hotspot was used to the number of passing binders it generated, and suggests that success was more closely tied to number of attempts with a hotspot rather than the hotspot's properties. This correlation is especially strong for MOSMO binders, the target with more data points.",
        },
      ],
    },
    {
      kind: "prose",
      id: "rosettafold",
      navLabel: "What RoseTTAFold3 is",
      heading: "What the folding model can and cannot tell us",
      body: [
        "RoseTTAFold3 is an open-source, deep learning model created jointly by the Institute for Protein Design and Microsoft AI for Good [3]. It has been trained on processed structural datasets for proteins using AtomWorks. Although RoseTTAFold3 is itself not a physics model, it is very good at predicting **protein-protein interactions** like those relevant to our project, as well as other biomolecular interactions. The scores provided by RoseTTAFold are therefore **empirically useful** but do not by themselves offer estimates of physical constants describing molecular affinities (although Rosetta offers other software that performs these tasks).",
      ],
    },
    {
      kind: "prose",
      id: "filters",
      navLabel: "The filters",
      heading: "What a design had to clear",
      body: [
        "Through discussion with **Professor DiMaio** and other sources of experience in protein design, we determined a set of **filters** using these scores. These included minPAE, RMSD from the initial backbone, pLDDT, monomer RMSD (testing structural consistency by running RF3 on the binder itself, without the target, to ensure its structure is not being induced by the target), and a custom transmembrane filter.",
        "The first four **confidence metrics** are used to single out binders and backbones which have particularly favourable interactions with the target, and can be applied to most de novo binder projects. For more on how our team's approach can be applied to other projects involving binder design, please see the [contributions page](/contribution#pipeline). The **transmembrane filter** was unique to this project, allowing us to better filter out results that may be high affinity binders, but would not work in practice due to the transmembrane portions of our specific targets.",
      ],
    },
    {
      kind: "details",
      id: "metrics",
      navLabel: "The metrics",
      heading: "The metrics, and where we drew the line",
      summary:
        "Six quantities used to evaluate binder designs: the first four as filters, and the last two to rank the final batch.",
      blocks: [
        {
          kind: "table",
          columns: ["Metric", "What it measures", "Where we drew the line"],
          rows: [
            [
              "**minPAE**",
              "The lowest expected error in position, in Angstrom, between any pair of residues across the two chains. How sure the model is about where the binder sits on the target.",
              "2 or less",
            ],
            [
              "**RMSD**",
              "Average distance between the designed backbone and the folded result, in Angstrom. Whether the sequence folds back into the shape it was designed for.",
              "2 or less",
            ],
            [
              "**pLDDT**",
              "The model's own confidence, per residue, from 0 to 100. Read from the binder chain alone, so it is the binder's confidence and not the complex's.",
              "80 or more",
            ],
            [
              "**monomer RMSD**",
              "The same comparison with the target absent, so the binder has to hold its shape by itself.",
              "2 or less",
            ],
            [
              "**ddG**",
              "Change in Gibbs free energy on binding, a computed proxy for affinity. Used to rank the survivors rather than to cut.",
              "negative, and better than the natural complex",
            ],
            [
              "**dSASA**",
              "Surface area buried when the two chains come together, in square Angstrom. A measure of how much contact there is to be favourable.",
              "about 1500 to 2500",
            ],
          ],
          caption:
            "pLDDT comes out of the folding model written into the structure file's temperature column as a fraction, which the pipeline rescales and averages over the alpha carbons of the binder's own chain.",
        },
      ],
    },
    {
      kind: "details",
      id: "transmembrane",
      navLabel: "The membrane filter",
      heading: "How we got around transmembrane protein-protein interactions",
      blocks: [
        {
          kind: "prose",
          body: [
            "One issue that came up with our designs was the spatial intersection of our binders with the ciliary membrane, as we were targeting **transmembrane proteins**. MOSMO has four alpha helices within the membrane and MEGF8 has one. Because our binders would not be able to interact with these transmembrane helices **in vivo**, we had to find a way to eliminate all designs that either directly interacted with these helices or would be significantly embedded within the membrane. We designed a **script** to filter these designs out. We **manually identified** residues on MOSMO and MEGF8 as being within the membrane, and established a 5-10 Å radius around these residues we deemed within the membrane. If a binder intersected this defined region, we considered it as failing our transmembrane filter, meaning it would not be considered for our end-point designs or **redesigns** (resequencing).",
          ],
        },
      ],
    },
    {
      kind: "funnel",
      id: "binder-funnel",
      navLabel: "What survived",
      heading: "How much gets thrown away",
      intro:
        "In total, we generated just **over 8300 binders** for this project. Selecting the 96 best ones for experimental validation required a number of filters and models. The following chart visualises how much each set of filters constrained the results.",
      stages: [
        {
          label: "binders generated",
          count: 8300,
          note: "backbones from RFdiffusion3, sequences from ProteinMPNN, folded by RoseTTAFold3",
        },
        {
          label: "cleared minPAE and RMSD",
          count: 411,
          note: "both 2 Angstrom or less",
        },
        {
          label: "cleared pLDDT",
          count: 344,
          note: "80 or more, over the binder's own residues",
        },
        {
          label: "clear of the membrane",
          count: 146,
          note: "no atom within the forbidden region around either target's membrane residues",
        },
        {
          label: "folded on their own",
          count: 101,
          note: "monomer RMSD of 2 Angstrom or less, so the shape does not need the target",
        },
      ],
      goal: {
        label: "ordered for wet lab validation",
        count: 96,
      },
      source: "Counts from the subteam's own filtering workbook.",
    },
    {
      kind: "prose",
      id: "ddg",
      navLabel: "Binding energy",
      heading: "Ranking what survived",
      body: [
        "An additional energetic metric we used to predict success prior to wet lab validation was **ddG** – a measurement of change in Gibbs free energy – normalised by **dSASA**, a geometric measurement of the change in solvent-accessible surface area. The **more negative the normalised ddG**, the higher the density of favourable binder interactions. These results provide further confidence in the selection of binders for testing and are yet another way we used modelling to prepare the disruptive binder component of our project.",
        "The natural MOSMO and MEGF8 interface gives us something to beat, since it is a real interaction between the same two proteins we are designing against.",
      ],
    },
    {
      kind: "scatter",
      id: "ddg-chart",
      heading: "Binding energy against unsatisfied hydrogen bonds",
      intro:
        "Every design, with the energy per unit of buried surface up the side and the unsatisfied hydrogen bonds per unit of buried surface along the bottom. Lower is tighter on both.",
      panels: [{ points: DDG_POINTS }],
      groups: [
        { id: "MEGF8", label: "MEGF8 binders", shape: "square" },
        { id: "MOSMO", label: "MOSMO binders", shape: "circle" },
      ],
      xLabel: "unsatisfied hydrogen bonds per unit of buried surface",
      yLabel: "binding energy per unit of buried surface",
      references: [{ axis: "y", value: -2.54, label: "the natural complex" }],
      footnote:
        "**Eighteen designs have more favourable computed energetics than the natural interface**, sixteen against MEGF8 and two against MOSMO. The best is a MEGF8 design at a normalised ddG of -3.28. Each point is one of 96 binders passing each of our filters and sent for wet lab validation.",
      source: "Energies computed with Rosetta's interface analysis [4].",
    },
    {
      kind: "prose",
      id: "favourites",
      navLabel: "Six favourites",
      heading: "Six designs, in three dimensions",
      body: [
        "These are the six we would point at first, three for each target. Each is shown on the target it was designed against, so what the picture tells you is **where on the target the binder lands**. Within a target the three are superposed on the same copy, so the target holds still and only the binder moves between views.",
      ],
    },
    {
      kind: "structures",
      id: "favourite-binders",
      structures: BINDER_STRUCTURES,
      label: "Which binder to show",
    },
    {
      kind: "details",
      id: "backbone-diversity",
      navLabel: "Backbone diversity",
      heading: "How much of the plate is really different",
      open: false,
      summary: "Ninety-six designs, but fewer distinct starting shapes than that.",
      blocks: [
        {
          kind: "prose",
          body: [
            "A design's backbone is the shape RFdiffusion generated before any sequence was put on it. Several designs can come off the same backbone with different sequences, so the number of designs on the plate overstates how many distinct shapes we are testing.",
            "The 96 come from **48 backbones**. The two targets are not alike in this: MEGF8's 61 designs come from 35 backbones, while MOSMO's 35 come from 13, and a single MOSMO backbone accounts for 17 of them. If that one shape turns out not to work, a large part of the MOSMO half of the plate goes with it.",
          ],
        },
        {
          kind: "bars",
          id: "backbone-chart",
          heading: "Designs per backbone",
          series: [{ label: "designs on the plate" }],
          rows: BACKBONE_ROWS,
          axisLabel: "designs among the 96",
          digits: 0,
        },
      ],
    },
    {
      kind: "details",
      section: "Sources",
      id: "sources",
      heading: "Sources",
      blocks: [
        {
          kind: "references",
          heading: "The tuner model",
          for: "The tuner model",
          items: [
            { n: "1", text: "C. W. Wilson, M.-H. Chen and P.-T. Chuang, Smoothened adopts multiple active and inactive conformations capable of trafficking to the primary cilium. PLoS ONE 4, e5182 (2009).", href: "https://doi.org/10.1371/journal.pone.0005182" },
            { n: "2", text: "Y. Zhang, Y. Liu and J. Jia, Mechanisms of Smoothened regulation in Hedgehog signaling. Cells 10, 2138 (2021).", href: "https://doi.org/10.3390/cells10082138" },
            { n: "3", text: "R. P. Wurz et al., Affinity and cooperativity modulate ternary complex formation to drive targeted protein degradation. Nat. Commun. 14, 4177 (2023).", href: "https://doi.org/10.1038/s41467-023-39904-5" },
            { n: "4", text: "J. H. Kong et al., A membrane-tethered ubiquitination pathway regulates Hedgehog signaling and heart development. Dev. Cell 55, 432-449.e12 (2020).", href: "https://doi.org/10.1016/j.devcel.2020.08.012" },
            { n: "5", text: "J. H. Kong et al., Gene-teratogen interactions influence the penetrance of birth defects by altering Hedgehog signaling strength. Development 148, dev199867 (2021).", href: "https://doi.org/10.1242/dev.199867" },
            { n: "6", text: "M. Wang, C. J. Herrmann, M. Simonovic, D. Szklarczyk and C. von Mering, Version 4.0 of PaxDb: protein abundance data, integrated across model organisms, tissues, and cell-lines. Proteomics 15, 3163-3168 (2015).", href: "https://doi.org/10.1002/pmic.201400441" },
            { n: "7", text: "J. Kim et al., Simultaneous measurement of Smoothened entry into and exit from the primary cilium. PLoS ONE 9, e104070 (2014).", href: "https://doi.org/10.1371/journal.pone.0104070" },
            { n: "8", text: "F. Ye, A. R. Nager and M. V. Nachury, BBSome trains remove activated GPCRs from cilia by enabling passage through the transition zone. J. Cell Biol. 217, 1847-1868 (2018).", href: "https://doi.org/10.1083/jcb.201709041" },
            { n: "9", text: "A. Chang et al., BRENDA, the ELIXIR core data resource in 2021: new developments and updates. Nucleic Acids Res. 49, D498-D508 (2021).", href: "https://doi.org/10.1093/nar/gkaa1025" },
            { n: "10", text: "L. A. Banaszynski, C. W. Liu and T. J. Wandless, Characterization of the FKBP-rapamycin-FRB ternary complex. J. Am. Chem. Soc. 127, 4715-4721 (2005).", href: "https://doi.org/10.1021/ja043277y" },
            { n: "11", text: "M. D. Morris, Factorial sampling plans for preliminary computational experiments. Technometrics 33, 161-174 (1991).", href: "https://doi.org/10.1080/00401706.1991.10484804" },
            { n: "12", text: "I. M. Sobol, Global sensitivity indices for nonlinear mathematical models and their Monte Carlo estimates. Math. Comput. Simul. 55, 271-280 (2001).", href: "https://doi.org/10.1016/S0378-4754(00)00270-6" },
            { n: "13", text: "J. Herman and W. Usher, SALib: an open-source Python library for sensitivity analysis. J. Open Source Softw. 2, 97 (2017).", href: "https://doi.org/10.21105/joss.00097" },
            { n: "14", text: "K. Choi et al., Tellurium: an extensible Python-based modeling environment for systems and synthetic biology. Biosystems 171, 74-79 (2018).", href: "https://doi.org/10.1016/j.biosystems.2018.07.006" },
          ],
        },
        {
          kind: "references",
          heading: "The GPCR system",
          for: "The GPCR system",
          items: [
            { n: "1", text: "Z. Choudhry et al., Sonic hedgehog signalling pathway: a complex network. Ann. Neurosci. 21, 28-31 (2014).", href: "https://doi.org/10.5214/ans.0972.7531.210109" },
            { n: "2", text: "A. M. Arensdorf, S. Marada and S. K. Ogden, Smoothened regulation: a tale of two signals. Trends Pharmacol. Sci. 37, 62-72 (2016).", href: "https://doi.org/10.1016/j.tips.2015.09.001" },
            { n: "3", text: "J. Taipale, M. K. Cooper, T. Maiti and P. A. Beachy, Patched acts catalytically to suppress the activity of Smoothened. Nature 418, 892-896 (2002).", href: "https://doi.org/10.1038/nature00989" },
            { n: "4", text: "M. Kinnebrew et al., Patched 1 regulates Smoothened by controlling sterol binding to its extracellular cysteine-rich domain. Sci. Adv. 8, eabm5563 (2022).", href: "https://doi.org/10.1126/sciadv.abm5563" },
            { n: "5", text: "G. Luchetti et al., Cholesterol activates the G-protein coupled receptor Smoothened to promote Hedgehog signaling. eLife 5, e20304 (2016).", href: "https://doi.org/10.7554/eLife.20304" },
            { n: "6", text: "Y. Zhu et al., Unexpected asymmetric distribution of cholesterol and phospholipids in equilibrium model membranes. Biophys. J. 123, 3923-3934 (2024).", href: "https://doi.org/10.1016/j.bpj.2024.10.004" },
            { n: "7", text: "A. Hasanovic and I. Mus-Veteau, Targeting the multidrug transporter Ptch1 potentiates chemotherapy efficiency. Cells 7, 107 (2018).", href: "https://doi.org/10.3390/cells7080107" },
            { n: "8", text: "Y. Wang, Z. Zhou, C. T. Walsh and A. P. McMahon, Selective translocation of intracellular Smoothened to the primary cilium in response to Hedgehog pathway modulation. Proc. Natl. Acad. Sci. U.S.A. 106, 2623-2628 (2009).", href: "https://doi.org/10.1073/pnas.0812110106" },
            { n: "9", text: "R. Rohatgi, L. Milenkovic, R. B. Corcoran and M. P. Scott, Hedgehog signal transduction by Smoothened: pharmacologic evidence for a 2-step activation process. Proc. Natl. Acad. Sci. U.S.A. 106, 3196-3201 (2009).", href: "https://doi.org/10.1073/pnas.0813373106" },
            { n: "10", text: "D. Wustner et al., Kinetic modelling of sterol transport between plasma membrane and endo-lysosomes based on quantitative fluorescence and X-ray imaging data. Front. Cell Dev. Biol. 11, 1144936 (2023).", href: "https://doi.org/10.3389/fcell.2023.1144936" },
            { n: "11", text: "M. Kinnebrew et al., Patched 1 reduces the accessibility of cholesterol in the outer leaflet of membranes. eLife 10, e70504 (2021).", href: "https://doi.org/10.7554/eLife.70504" },
            { n: "12", text: "B. Alberts et al., Molecular Biology of the Cell, 4th ed. Garland Science, New York (2002)." },
            { n: "13", text: "S. Li et al., Hedgehog-regulated ubiquitination controls Smoothened trafficking and cell surface expression in Drosophila. PLoS Biol. 10, e1001239 (2012).", href: "https://doi.org/10.1371/journal.pbio.1001239" },
            { n: "14", text: "L. Milenkovic, M. P. Scott and R. Rohatgi, Lateral transport of Smoothened from the plasma membrane to the membrane of the cilium. J. Cell Biol. 187, 365-374 (2009).", href: "https://doi.org/10.1083/jcb.200907126" },
            { n: "15", text: "X. Long et al., Structure, function, and research progress of primary cilia in reproductive physiology and reproductive diseases. Front. Cell Dev. Biol. 12, 1418928 (2024).", href: "https://doi.org/10.3389/fcell.2024.1418928" },
            { n: "16", text: "P. Huang et al., Cellular cholesterol directly activates Smoothened in Hedgehog signaling. Cell 166, 1176-1187.e14 (2016).", href: "https://doi.org/10.1016/j.cell.2016.08.003" },
            { n: "17", text: "X. L. Chen et al., Patched-1 proapoptotic activity is downregulated by modification of K1413 by the E3 ubiquitin-protein ligase Itchy homolog. Mol. Cell. Biol. 34, 3855-3866 (2014).", href: "https://doi.org/10.1128/MCB.00960-14" },
            { n: "18", text: "A. F. Rudolf et al., The morphogen Sonic hedgehog inhibits its receptor Patched by a pincer grasp mechanism. Nat. Chem. Biol. 15, 975-982 (2019).", href: "https://doi.org/10.1038/s41589-019-0370-y" },
            { n: "19", text: "R. Milo, What is the total number of protein molecules per cell volume? A call to rethink some published values. BioEssays 35, 1050-1055 (2013).", href: "https://doi.org/10.1002/bies.201300066" },
            { n: "20", text: "M. Wang, C. J. Herrmann, M. Simonovic, D. Szklarczyk and C. von Mering, Version 4.0 of PaxDb: protein abundance data, integrated across model organisms, tissues, and cell-lines. Proteomics 15, 3163-3168 (2015).", href: "https://doi.org/10.1002/pmic.201400441" },
            { n: "21", text: "M. Kinnebrew et al., Cholesterol accessibility at the ciliary membrane controls hedgehog signaling. eLife 8, e50051 (2019).", href: "https://doi.org/10.7554/eLife.50051" },
          ],
        },
        {
          kind: "references",
          heading: "Safety: the melanocortin pathway",
          for: "Safety: the melanocortin pathway",
          items: [
            { n: "1", text: "J. H. Kong et al., A membrane-tethered ubiquitination pathway regulates Hedgehog signaling and heart development. Dev. Cell 55, 432-449.e12 (2020).", href: "https://doi.org/10.1016/j.devcel.2020.08.012" },
            { n: "2", text: "P. Parashara et al., The E3 ubiquitin ligase MGRN1 targets melanocortin receptors MC1R and MC4R via interactions with transmembrane adapters. J. Cell Sci. 138 (2025).", href: "https://doi.org/10.1242/jcs.264084" },
            { n: "3", text: "J. H. Kong et al., Gene-teratogen interactions influence the penetrance of birth defects by altering Hedgehog signaling strength. Development 148, dev199867 (2021).", href: "https://doi.org/10.1242/dev.199867" },
            { n: "4", text: "C. Williams et al., Design principles of a membrane-spanning ubiquitin ligase. Mol. Cell 86, 2207-2222.e16 (2026).", href: "https://doi.org/10.1016/j.molcel.2026.05.001" },
            { n: "5", text: "T. Mathieson et al., Systematic analysis of protein turnover in primary cells. Nat. Commun. 9, 689 (2018).", href: "https://doi.org/10.1038/s41467-018-03106-1" },
            { n: "6", text: "H. C. Berg and E. M. Purcell, Physics of chemoreception. Biophys. J. 20, 193-219 (1977).", href: "https://doi.org/10.1016/S0006-3495(77)85544-6" },
            { n: "7", text: "S. K. Shenoy, Seven-transmembrane receptors and ubiquitination. Circ. Res. 100, 1142-1154 (2007).", href: "https://doi.org/10.1161/01.RES.0000261939.88744.5a" },
            { n: "8", text: "J. F. Hare and K. Taylor, Mechanisms of plasma membrane protein degradation: recycling proteins are degraded more rapidly than those confined to the cell surface. Proc. Natl. Acad. Sci. U.S.A. 88, 5902-5906 (1991).", href: "https://doi.org/10.1073/pnas.88.13.5902" },
            { n: "9", text: "M. Wang, C. J. Herrmann, M. Simonovic, D. Szklarczyk and C. von Mering, Version 4.0 of PaxDb: protein abundance data, integrated across model organisms, tissues, and cell-lines. Proteomics 15, 3163-3168 (2015).", href: "https://doi.org/10.1002/pmic.201400441" },
            { n: "10", text: "K. Choi et al., Tellurium: an extensible Python-based modeling environment for systems and synthetic biology. Biosystems 171, 74-79 (2018).", href: "https://doi.org/10.1016/j.biosystems.2018.07.006" },
            { n: "11", text: "D. A. Beard and H. Qian, Chemical Biophysics: Quantitative Analysis of Cellular Systems. Cambridge University Press (2008)." },
          ],
        },
        {
          kind: "references",
          heading: "Protein modelling",
          for: "Protein modelling",
          items: [
            { n: "1", text: "J. H. Kong et al., A membrane-tethered ubiquitination pathway regulates Hedgehog signaling and heart development. Dev. Cell 55, 432-449.e12 (2020).", href: "https://doi.org/10.1016/j.devcel.2020.08.012" },
            { n: "2", text: "L. Cao et al., Design of protein-binding proteins from the target structure alone. Nature 605, 551-560 (2022).", href: "https://doi.org/10.1038/s41586-022-04654-9" },
            { n: "3", text: "N. Corley et al., Accelerating biomolecular modeling with AtomWorks and RF3. bioRxiv (2025).", href: "https://doi.org/10.1101/2025.08.14.670328" },
            { n: "4", text: "Rosetta InterfaceAnalyzer documentation, RosettaCommons.", href: "https://docs.rosettacommons.org/docs/latest/application_documentation/analysis/interface-analyzer" },
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
        text: "Another tool may be more suitable. [Have a look at existing methods](/human-practices#toolbox).",
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
    kind: "figure",
    id: "flyer",
    src: "implementation/flyer.png",
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
  title: "Integrated Human Practices",
  kicker: "chapter 06 · integrated human practices",
  medal: true,
  blocks: [
{
      kind: "stats",
      id: "integration",
      heading: "Integration counter",
      look: "counter",
      items: [
        { value: "16", label: "stakeholders consulted" },
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
          photo: "ihp/stakeholders/miller.jpg",
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
          photo: "ihp/stakeholders/pottinger.jpg",
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
          photo: "ihp/stakeholders/sauro.jpg",
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
          photo: "ihp/stakeholders/wallingford.jpg",
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
          photo: "ihp/stakeholders/ogden.jpg",
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
          photo: "ihp/stakeholders/zheng.jpg",
        },
        {
          id: "matula",
          name: "Dr. Thomas Matula",
          role: "President and CEO of Matchstick Technologies, where he developed PIXUL, an instrument using cavitation for fragmenting DNA for genetic and epigenetic analysis",
          group: "startup or industry",
          why: "To learn from his experience developing a research tool with a wide range of applications, since PIXUL started as an academic research tool before being commercialised.",
          said: "He described customer discovery and product development from working with UW CoMotion through to early grant applications, and urged the team to quickly develop small proof of concept technologies to attract early investors. He stressed staying utilitarian, iterating constantly on customer feedback rather than personal preference, and noted that people in labs are often set in how they already do things, so the key is finding a specific pain point the tool solves.",
          changed: "No change from this conversation is written up yet.",
          photo: "ihp/stakeholders/matula.jpg",
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
          photo: "ihp/stakeholders/younger.jpg",
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
          photo: "ihp/stakeholders/vokes.jpg",
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
          photo: "ihp/stakeholders/chamberlain.jpg",
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
          photo: "ihp/stakeholders/eisenkot.jpg",
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
          photo: "ihp/stakeholders/bothwell.jpg",
        },
        {
          id: "reiter",
          name: "Dr. Jeremy Reiter",
          role: "Professor and chair in the Departments of Biochemistry and Biophysics at the University of California San Francisco, whose lab works on ciliogenesis, compartmentalisation in cilia and signal transduction",
          group: "ciliary biologist",
          why: "To learn how the platform could be used in research and taken up by scientists studying ciliary transmembrane proteins, and where the wet lab proof of concept could be strengthened.",
          said: "He advised presenting the platform for pathological and mature settings of Hedgehog signalling, which are far less characterised than developmental ones, and noted that while loss-of-function tools are plentiful, few can act on the protein pool in a single subcompartment of a cell. For the SMO proof of concept he suggested using it alongside pharmacological inhibitors such as vismodegib, to get past second-site resistance where SMO gains mutations that block inhibitor binding. At the bench he asked whether the position of our protein tags changes how much ubiquitination we see, which confounders could be moving the result, such as linker length, and pressed for more controls: a knowingly ineffective binder for the binding assay, existing SMO nanobodies as a positive control for the dimerisation system, and cyclopamine or vismodegib as positive controls for downstream signalling.",
          changed:
            "The experiments gained controls on his advice, including a nonbinding design for the binder screen and pharmacological positive controls for the signalling readout, and subcompartment specificity is now stated as the thing existing loss-of-function tools cannot do.",
          photo: "ihp/stakeholders/reiter.jpg",
        },
        {
          id: "johnson",
          name: "Professor Teddy Johnson",
          role: "Clinical associate professor at the University of Washington School of Pharmacy and Director of Technology Development at the UW Institute of Translational Health Sciences",
          group: "startup or industry",
          why: "To understand the regulatory landscape for research tools, and for advice on commercialising the platform, on fundraising, and on the trade-off between open and proprietary development.",
          said: "He cautioned that grant funding moves slowly, follows the political climate and comes in waves of popularity, so he recommended identifying a specific market opportunity before approaching investors for gap funding, and building binders against proteins people are already interested in. He noted that research tools are lightly regulated next to medicines and devices: a Research Use Only label is generally acceptable so long as the product is not falsely advertised and its results do not drive clinical decisions. On marketing he suggested approaching labs that enjoy trying new things rather than arguing with labs that resist change, and reducing friction by selling through major vendors and staying compatible with equipment labs already own. On distribution he proposed a hybrid: an open developer community to draw research and agency attention, with proprietary products for specialised work to keep investors comfortable. He also warned that ego and team discord waste more money than overspending does.",
          changed:
            "Human Practices will analyse how the platform fits existing research workflows and identify the labs most likely to test it, and the wet lab will review the ciliary literature and design binders against a small number of high-impact targets.",
          photo: "ihp/stakeholders/johnson.jpg",
        },
        {
          id: "bergman",
          name: "Dr. Margo Bergman",
          role: "Professor of computer science at The Evergreen State College, working on AI, public health and human decision-making in economic systems",
          group: "bioethics",
          why: "To understand how researchers decide whether to adopt a new tool, and to have our market estimate checked by someone who works on decision-making.",
          said: "She expected scientists to choose tools the way anyone does, on trust and on what they already know, and warned about the information cascade: people stay with sources that appear better informed, which here means colleagues, mentors and whatever those people already use. She suggested a small pilot with a limited number of labs, then asking them how likely they would be to adopt it and what they would change. On the market estimate she agreed with the approach but cautioned against using NIH funding as a proxy given current reductions, suggesting instead counting primary cilium publications and splitting them into grant-funded and non-grant-funded work. She noted that both methods miss funded research that never reaches publication, so both underestimate the market. On AI and dual use she said how far mitigation should go depends on what we and regulatory boards accept as risk, and recommended building guardrails with biosecurity experts and enforcing them as a condition of use.",
          changed:
            "The drylab teams will consult AI developers and biosecurity experts on limiting misuse, and the market estimate now carries her caution about using grant funding as a proxy.",
          photo: "ihp/stakeholders/bergman.jpg",
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
          logo: "nuukbio",
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
        "**Top left.** PTCH1 remains in the primary cilium and suppresses SMO activation, keeping Hedgehog target genes off. **Top right.** Hedgehog binding causes PTCH1 to leave the cilium, allowing SMO to accumulate and activate downstream GLI signalling. **Bottom left.** The MMM complex associates with SMO in the ciliary membrane, positioning the E3 ligase near the receptor. **Bottom middle.** MGRN1 marks SMO with a ubiquitination tag. **Bottom right.** Ubiquitinated SMO is internalised and degraded, reducing SMO abundance on the membrane.",
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
          look: "smo",
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
          look: "gpr161",
          name: "GPR161: G protein-coupled receptor 161",
          family: "G protein-coupled receptor (GPCR)",
          body: [
            "GPR161 is a ciliary GPCR and an important negative regulator of Hedgehog signalling, normally enriched in the primary cilium when the pathway is inactive. GPR161 promotes cAMP and PKA signalling that helps suppress Hedgehog pathway activation. Following Hedgehog stimulation, GPR161 is removed from the cilium as the pathway switches toward an active state.",
            "Changing GPR161 abundance could help researchers test how much negative regulator is required to maintain Hedgehog repression. Comparing GPR161 with SMO and PTCH1 could also reveal how different ciliary regulators interact to establish signalling thresholds.",
          ],
        },
        {
          short: "GLP-1R",
          look: "glp1r",
          name: "GLP-1R: Glucagon-like peptide-1 receptor",
          family: "Class B1 (secretin family) G protein-coupled receptor",
          body: [
            "GLP-1R is involved in glucose regulation and metabolic signalling in the primary cilia of metabolically relevant cell types. GLP-1 is an important metabolic hormone helping regulate blood glucose and appetite, making its receptor a major target in treatments for type 2 diabetes and obesity. Research into its ciliary localisation may help us understand how certain cells respond to GLP-1 signals within a specialised signalling compartment.",
            "Changing only its ciliary abundance could help researchers determine whether this receptor population has a distinct role in metabolic signalling. [Dr. Mark Bothwell](stakeholder:bothwell) identified GLP-1R as an interesting future target for connecting ciliary biology with questions surrounding diabetes and metabolism.",
          ],
        },
        {
          short: "MC4R",
          look: "mc4r",
          name: "MC4R: Melanocortin-4 receptor",
          family: "Class A G protein-coupled receptor",
          body: [
            "MC4R localises to the primary cilia of specific neurons involved in metabolic regulation. Its localisation contributes to signalling pathways that influence feeding and body weight regulation. Disruption of its localisation has been associated with impaired metabolic signalling.",
            "Tuning MC4R abundance could help researchers test the effect of changing receptor quantity in the cilium on metabolic responses.",
          ],
        },
        {
          short: "PKD1/2",
          look: "pkd",
          name: "PKD1 and PKD2: Polycystin-1 and Polycystin-2",
          family: "A receptor and ion channel that function together as a complex",
          body: [
            "PKD1 and PKD2 are ciliary membrane proteins that form a polycystin signalling complex. Mutations in either protein are associated with autosomal dominant polycystic kidney disease. The PKD1/PKD2 complex in the ciliary membrane has been linked to the regulation of ion and calcium associated signalling. In the renal primary cilium, their presence is important for understanding how kidney cells respond to their environment.",
            "Tuning PKD1/PKD2 abundance in the primary cilium could allow researchers to study partial changes in polycystin signalling rather than relying only on complete genetic knockouts. [Dr. Bothwell](stakeholder:bothwell) specifically highlighted PKD1 as an interesting future system for connecting ciliary protein abundance with kidney disease biology.",
          ],
        },
        {
          short: "SSTR3",
          look: "sstr3",
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
      source:
        "References [8] to [20] below. Photographs are from each person's institutional or company page.",
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
          body: "CiliaKB, a recently developed database of cilia-associated genes, reports that a PubMed search for the keyword “cilia” identified 6,357 publications between 2015 and 2025, roughly 578 cilia publications per year across this eleven year period [4]. To estimate the size of biomedical research overall, we used PubMed as our denominator: the National Library of Medicine reports 5,734,130 PubMed records published from 2015 to 2019, approximately 1,146,826 biomedical publications per year [5]. Dividing the two gives an estimated share of biomedical research represented by cilia of **0.05 percent**. In other words, roughly one in every two thousand biomedical publications is associated with cilia research.",
        },
        {
          title: "Estimate the funding pool for research tool development",
          body: "The NIH has programmes designed specifically for this purpose. The National Institute of General Medical Sciences (NIGMS) operates dedicated Technology Development programmes; its Focused Technology Research and Development R01 programme supports projects focused on developing new biomedical technologies rather than answering new biological questions, with eligible outcomes including laboratory instruments, software, chemical reagents, and biological molecules or systems engineered for use as research tools [6], which makes it particularly relevant to our project. NIGMS also supports Biomedical Technology Optimization and Dissemination (BTOD) centres, which focus on later-stage development and distribution of research tools, receiving up to 850,000 dollars in recurring direct costs per year. Both funds give insight into spending on research tool development, but they do not cover the full market scope of research tools, and the NIH does not publish one consolidated annual budget for research-tool development: programmes have no set-aside funds, and the number and value of awards depend on appropriations and successful applications.",
        },
        {
          title: "Define a broader technology funding proxy",
          body: "To estimate the scale of the funding environment in which research technologies are developed, we used the NIH Bioengineering and Biotechnology research categories. For the 2025 financial year, the NIH reported approximately **7.212 billion dollars** for Bioengineering and **8.846 billion dollars** for Biotechnology, from its Research, Condition, and Disease Categorization (RCDC) system [7]. These categories are broader than research-tool development, since they include projects that would not result in a new laboratory tool, but they provide an initial benchmark for the technology-oriented biomedical research environment our tool would be used in. They cannot simply be added together, because NIH categories overlap, so we treat them as the lower and upper boundaries of a technology-oriented funding proxy rather than as two separate markets.",
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
        ["CRISPR-based gene editing", "2025: 4.53 billion USD [8]. CAGR: 19.89%", "The market shows strong demand for programmable tools that let researchers alter specific biological targets. CRISPR is powerful for determining whether a gene matters, but it generally changes the protein across the whole cell rather than specifically in the primary cilium."],
        ["RNAi gene silencing", "2025: 2.2 billion USD [9]. CAGR: 12.3%", "The market shows strong demand for tools that reduce rather than remove gene expression. This overlaps with interest in protein abundance, though RNAi still acts on the whole cell."],
        ["Small molecule drugs", "2025: 67.42 billion USD [10]. CAGR: 8.86%", "A massive drug market using small molecules. Its success shows the potential benefit of adjustable, dose-dependent control."],
        ["Targeted protein degradation", "2025: 0.42 billion USD [11]. CAGR: 23.5%", "The closest existing market to our system, since it recruits cellular degradation machinery toward selected proteins. PROTACs alone represented 47.56% of this market in 2025."],
        ["Research antibodies", "2025: 3.98 billion USD [12]. CAGR: 7.37%", "Another proposed implementation, in which antibodies would provide the target-recognition and recruitment components of the platform."],
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
        "In 2024, Addgene distributed 184,824 materials to 39,529 scientists across 86 countries, demonstrating the scale at which standardised, shareable biological tools can spread through the research community [13]. Given the spread of research tools, alongside the technology gap in a growing market, our market model shows a strong reason to develop a research tool capable of modulating specific signalling proteins on the primary cilium.",
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
        "That is a claim we have tested once, on ourselves. The clearest predictable off-target risk in our own design is the melanocortin pathway: the up arm works by prising the MMM complex apart, which frees MGRN1, and MGRN1 has a second job with a different partner regulating **MC4R**, and so appetite and body weight. We modelled it before building anything. The effect is small and it has a ceiling, reaching [8.2 percent of surface MC4R at most](/model#mc4r-dose), against the 20 percent we had set in advance as the point where an effect becomes biologically meaningful. The ceiling holds whatever the dose and however good the binder turns out to be, because MGRN1 is the scarce component at roughly 0.18 nM and there is only so much of it to redistribute.",
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
        { n: "4", text: "C.-J. Liu et al., CiliaKB: a comprehensive knowledge base for cilia-associated genes. PLOS Biol. 24, e3003774 (2026).", href: "https://doi.org/10.1371/journal.pbio.3003774" },
        { n: "5", text: "National Library of Medicine, PubMed total records by publication year (2020).", href: "https://datadiscovery.nlm.nih.gov/Information-Management/PubMed-total-records-by-publication-year/eds5-ig9r/about_data" },
        { n: "6", text: "National Institute of General Medical Sciences, Technology Development Programs (2026).", href: "https://www.nigms.nih.gov/grants/Pages/Technology-Development-Programs" },
        { n: "7", text: "NIH RePORT, Estimates of funding for various research, condition, and disease categories (2026).", href: "https://report.nih.gov/funding/categorical-spending#/" },
        { n: "8", text: "Mordor Intelligence, CRISPR technology market size and share analysis, 2025 to 2030 (2025).", href: "https://www.mordorintelligence.com/industry-reports/crispr-technology-market" },
        { n: "9", text: "Grand View Horizon, Global gene silencing market size and outlook, 2026 to 2033 (2025).", href: "https://www.grandviewresearch.com/horizon/outlook/gene-silencing-market/united-states" },
        { n: "10", text: "Mordor Intelligence, Small molecule drug discovery market size and share analysis, 2026 to 2031 (2026).", href: "https://www.mordorintelligence.com/industry-reports/small-molecule-drug-discovery-market" },
        { n: "11", text: "Market.us, Targeted protein degradation market size and share (2026).", href: "https://market.us/report/targeted-protein-degradation-market/" },
        { n: "12", text: "Fortune Business Insights, Research antibodies market size and share, industry report to 2034 (2026).", href: "https://www.fortunebusinessinsights.com/research-antibodies-market-116028" },
        { n: "13", text: "C. Jones, Reflections and looking ahead. Addgene blog (2025).", href: "https://blog.addgene.org/reflections-and-looking-ahead-2025" },
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
  title: "Education",
  kicker: "chapter 07 · education",
  medal: true,
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
      kind: "details",
      id: "polymerase-handbook",
      heading: "Can You Beat DNA Polymerase? Instructional manual",
      summary: "Everything needed to run it, six pages.",
      blocks: [
        {
          kind: "prose",
          body: [
            "How to build each station for under five dollars, run the race, and talk about mutations along the way. Written and visual instructions, colourblind-friendly graphics, and the science behind the activity. Also as an editable [Word document](/education/dna-polymerase.docx).",
          ],
        },
        {
          kind: "pdf",
          file: "education/dna-polymerase.pdf",
          title: "Can You Beat DNA Polymerase? Instructional manual",
          pages: 6,
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
      kind: "details",
      id: "whodunnit-guide",
      heading: "The whodunnit, station by station",
      summary: "The whole procedure, so the activity can be picked up and run, five pages.",
      blocks: [
        {
          kind: "prose",
          body: [
            "The script for the coordinator, what each of the three stations needs, and how the clues come together at the end.",
          ],
        },
        {
          kind: "pdf",
          file: "education/whodunnit.pdf",
          title: "The whodunnit, station by station",
          pages: 5,
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
      kind: "details",
      id: "baselet-handbook",
      heading: "Build a Baselet handbook",
      summary: "Everything needed to run it, six pages.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Ages 8 to 18, 30 to 45 minutes. The bead colours, the base-pairing rules, the amino acid chart, and the mutations to try. The [latest version](https://docs.google.com/document/d/10bECEVQb0TbHe4U1os_mHrUxQAWD1wqZIO4Ia7t5ic4/edit?usp=sharing) is kept as a Google Doc.",
          ],
        },
        {
          kind: "pdf",
          file: "education/baselet.pdf",
          title: "Build a Baselet handbook",
          pages: 6,
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
      kind: "details",
      id: "synbingo-guide",
      heading: "SYNBIngO: the presentation, the boards and the prompts",
      summary: "Everything needed to run it, seventeen pages.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Goals, the talk on everyday medications, the bingo boards, and the discussion questions for the end, followed by the slides themselves.",
          ],
        },
        {
          kind: "pdf",
          file: "education/synbingo.pdf",
          title: "SYNBIngO: the presentation, the boards and the prompts",
          pages: 17,
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
      kind: "details",
      id: "scientists-doc",
      heading: "Scientists You Might Not Know",
      summary: "For the classroom, thirteen pages.",
      blocks: [
        {
          kind: "prose",
          body: [
            "Profiles for chemistry and biology lessons: the people behind aspirin, thalidomide\'s halt at the FDA, and more. The [latest version](https://docs.google.com/document/d/1oJpNNe-DBpYJ4tP-zd76KM0-249qbn9j4jQ6PlO33eQ/edit?usp=sharing) is kept as a Google Doc.",
          ],
        },
        {
          kind: "pdf",
          file: "education/scientists.pdf",
          title: "Scientists You Might Not Know",
          pages: 13,
        },
      ],
    },

    {
      kind: "prose",
      section: "What education taught us",
      id: "taught-us",
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
  title: "Proposed Implementation",
  kicker: "chapter 04 · proposed implementation",
  blocks: [
    {
      kind: "prose",
      heading: "Who this is for",
      body: [
        "Developing this technology was only part of our work. Through conversations with stakeholders, we realised the importance of supplying a reproducible and responsible method for adoption. We aimed to create a platform that would be as easily accessible as possible and could be largely expanded for other usages outside of our Smoothened proof of concept.",
        "The thinking behind that sits on Human Practices: [six kinds of researchers](/human-practices#who-would-use-this) told us what each would need before trusting a tool like this, those needs became our [design requirements](/human-practices#design-requirements), and the [delivery selection](/human-practices#implementation-strategy) compares the small molecule, antibody and protein routes to the component that recognises the target.",
      ],
    },
    ...DELIVERABLES,
    ...NEXT_STEPS,
  ],
};

const parts: Page = {
  slug: "/parts",
  title: "Parts and Registry",
  kicker: "chapter 09 · parts and registry",
  blocks: [
    {
      kind: "prose",
      heading: "Overview",
      body: [
        "We designed two families of genetic parts. One controls the recruitment of the proteins that regulate **SMO**. The other characterises the computationally designed binders we made against **MEGF8** and **MOSMO**.",
        "The first family is ten mammalian expression constructs, covering chemically induced recruitment, ALFA-based recruitment, an experimental control, and two constructs for testing a second ciliary receptor. All ten were ordered from GenScript in pcDNA3.1(+)-based expression vectors.",
        "The second is a set of gene fragments from Twist Bioscience: our designed MEGF8 and MOSMO binders, and the constructs that make up the split-transcription-factor system used to screen them.",
        "This page documents the design, the components and the intended function of each part. What they are used for is on [experiments](/experiments), and when each piece was designed and ordered is in the [notebook](/notebook).",
        "The ten expression constructs are **registered on the iGEM Registry**, and each one below links to its entry. Registration records the design and the sequence we submitted; none of these parts has been tested in cells yet.",
      ],
    },
    {
      kind: "links",
      id: "registry",
      items: [
        {
          title: "Washington 2026 on the iGEM Registry",
          body: "Every part we registered this year, with its sequence and design notes.",
          href: "https://registry.igem.org/organisations/780ead9c-c73a-4a70-b847-d12a99c8771f",
          label: "Open the Registry page",
          tag: "Registry",
        },
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
      intro: "The ten mammalian expression constructs, as ordered. Each name links to its entry on the iGEM Registry.",
      columns: ["Construct", "Intended function"],
      rows: [
        ["[SMO_DmrC_T2098L_CeGFP](https://registry.igem.org/parts/bba-26ziw1o0)", "SMO fusion for chemically induced recruitment"],
        ["[MGRN1_DmrA_His6](https://registry.igem.org/parts/bba-26fv24q3)", "Direct MGRN1 recruitment"],
        ["[MGRN1_C279A_C282A_DmrA_His6](https://registry.igem.org/parts/bba-26bw0btf)", "Catalytically inactive MGRN1 control"],
        ["[MEGF8_ICD_2602_2778_DmrA_His6](https://registry.igem.org/parts/bba-26i05d6z)", "Recruitment of the MEGF8 intracellular domain"],
        ["[HA_MGRN1_NbALFA](https://registry.igem.org/parts/bba-26rcuw3v)", "ALFA-based MGRN1 recruitment"],
        ["[HA_MGRN1_C279A_C282A_NbALFA](https://registry.igem.org/parts/bba-2609kvhf)", "Catalytically inactive ALFA-recruitment control"],
        ["[SMO_His6_ALFA_v2](https://registry.igem.org/parts/bba-26qn3kuc)", "ALFA-tagged SMO construct"],
        ["[GPR161_EGFP_DmrC_T2098L](https://registry.igem.org/parts/bba-26boqvnq)", "Recruitment system for an additional ciliary receptor"],
        ["[GPR161_GFP_ALFA](https://registry.igem.org/parts/bba-26ykau4r)", "ALFA-tagged GPR161 receptor"],
        ["[DmrA_mCherry_proximity_only_control](https://registry.igem.org/parts/bba-266zj0i6)", "Proximity-only control"],
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
      caption: "Ordered from Twist Bioscience as linear gene fragments.",
    },

  ],
};

const results: Page = {
  slug: "/results",
  title: "Results",
  kicker: "wetlab · results",
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
  title: "Contribution",
  kicker: "chapter 10 · contribution",
  medal: true,
  blocks: [
    {
      kind: "prose",
      heading: "Contributions Overview",
      body: [
        "The protein design process is computationally expensive, and although the models necessary for protein design are open source, it can be challenging to set up the necessary helper scripts to automate the process and efficiently sift through results. Our team contributes instructions detailing how to set up an automated protein design pipeline on any compute cluster and how to appropriately use the pipeline and filter results (aided by the scripts we developed in-house, which are public on our GitHub).",
        "We also contribute the wet lab's toolkit of ten constructs for bringing an E3 ligase to a receptor, built so any team can modify our system to target other receptors.",
      ],
    },
    {
      kind: "prose",
      section: "Protein design",
      id: "summary",
      heading: "What is de novo protein design?",
      body: [
        "De novo protein design broadly refers to the development of new proteins with novel functions. The designs of these new proteins do not rely on existing protein structures. Instead they use biochemical principles and recent breakthrough computational methods, such as deep learning models trained on large-scale collections of experimental protein structural data [1]. One use case is the de novo design of novel **binders**, where custom proteins are computationally optimised to associate, or bind, with specific molecular targets. Use cases for these binders vary, but in this project we focus on a therapeutic use: the disruption of wild-type protein complex formation. De novo binders have also proved useful in the neutralisation of toxins or venoms, and in the precise modulation of immune responses such as inflammation [2].",
        "For our project this year we are focusing on disrupting the binding interface between two proteins, **MOSMO** and **MEGF8**. We aim to prevent formation of the MOSMO, MEGF8 and MGRN1 (**MMM**) complex through a competitively inhibitory, high affinity de novo binder. For our binder design pipeline we used RosettaCommons Foundry models: **RFdiffusion3**, **ProteinMPNN** and **RoseTTAFold3**, developed in-house at the University of Washington's Institute for Protein Design [3]. How we used them against this particular target is on [the model](/model); what follows is the general version.",
      ],
    },
    {
      kind: "pipeline",
      id: "pipeline",
      heading: "Stepwise Protein Design Pipeline",
      intro:
        "Although we use an automated script that encapsulates all elementary steps in the protein design process, it was born of many helper scripts that allow researchers to call each stage individually and analyse outputs before passing them along to the next model. We outline these steps below because the decision making at each step may be relevant to other researchers, and it provides a holistic view of our objectives and process. The scripts relevant to this automated step are located in the pipeline/ folder in our GitHub.",
      stages: [
        {
          title: "Generate backbones",
          script: "RFdiffusion3",
          body: [
            "RFdiffusion3 is a diffusion-based model that arrives at protein structures by iterative denoising, a process known as backbone generation or fold design [3]. Given a fixed target, it denoises around it to produce the coordinates of a small protein expected to interact favourably with it. These backbones are the geometric framework of the design, with no sequence yet.",
          ],
          input: "target structure and hotspot residues",
          output: "candidate binder backbones",
        },
        {
          title: "Design sequences onto them",
          script: "ProteinMPNN",
          body: [
            "ProteinMPNN is a neural network that takes the coordinates of a structure and generates a sequence of amino acids predicted to fold into it, a process known as inverse folding [4]. The output carries the complete sequence for the generated minibinder alongside the existing sequence of the target.",
          ],
          input: "backbones",
          output: "amino acid sequences for each backbone",
        },
        {
          title: "Fold the sequences back",
          script: "RoseTTAFold3",
          body: [
            "RoseTTAFold3 takes a sequence and predicts how the protein will fold, a process known as forward folding [5]. Running the designed sequence through it together with the target, and comparing against the backbone we asked for, is what tells us whether the sequence recapitulates the shape. It also tells us whether the binder still lands where it was diffused: one that refolds in the same place on the target is a strong indicator it has affinity for it.",
          ],
          input: "sequences and the target",
          output: "predicted complexes and their confidence files",
        },
      ],
    },
    {
      kind: "prose",
      id: "hyak",
      heading: "Running it on a shared cluster",
      body: [
        "To interface with these models we pulled the Foundry container created by RosettaCommons from DockerHub onto **Hyak**, the University of Washington's high-performance computing cluster. Previously our use of protein design platforms was split between local installation and the Institute for Protein Design's own cluster. Moving the entire pipeline onto Hyak, a system widely available to all University of Washington students, establishes a platform where any future team here can run automated, high throughput computational protein design.",
        "To achieve high-throughput de novo binder design we wrote Bash and Python scripts that automate the pipeline outlined above. Our design script lets a user input just the name of the target protein, the batch size, and the selected hotspots. On Hyak this brought generation times down to about **45 minutes per 75 binder designs**, from about 75 minutes for the same batch at the start.",
      ],
    },
    {
      kind: "table",
      section: "The scripts and the code",
      id: "metrics",
      heading: "Filtering designs",
      intro:
        "In addition to the automation script connecting the initial protein design process, we created a **validation script** that pulled metrics from the output files of each binder design and the binders' crystallographic information files (CIF) themselves (script can be found in the redesign/ folder in our GitHub). We extracted the following metrics from our outputs.",
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
          "Above **80**, applied over the binder's own residues. It removed 67 designs.",
        ],
        [
          "**ddG**",
          "Change in Gibbs free energy, a computational stand-in for binding affinity.",
          "Negative, and more negative than the ddG of the MOSMO to MEGF8 interface itself.",
        ],
      ],
    },
    {
      kind: "prose",
      id: "redesign",
      heading: "Redesign",
      body: [
        "To generate more binders we re-ran ProteinMPNN and RosettaFold on two groups of designs: \"near-misses\" that were close to our RMSD-minPAE-pLDDT cutoffs, and currently passing designs. This process generated a new sequence for the binder, a process that has been shown to significantly lower RMSD and increase RosettaFold prediction confidence ([source](https://www.nature.com/articles/s42004-023-01029-7)). We created two scripts for this approach. The first script identifies the near-miss binders for an input folder representing a single run through the pipeline. Then, this folder is input to a second script that re-runs the files through ProteinMPNN and RosettaFold. Both scripts can be found in the redesign/ folder in our GitHub.",
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
          title: "protein_design",
          body: "The pipeline, the redesign loop and the earlier exploratory scripts, with a quick start in the readme. Run `pipeline/batch_design.sh` from the project root.",
          href: "https://gitlab.igem.org/2026/software/washington/protein-design",
          label: "Open on GitLab",
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
      kind: "prose",
      section: "Wet lab: a construct toolkit",
      navLabel: "Wet lab: the toolkit",
      id: "toolkit",
      heading: "A genetic toolkit for receptor-targeted E3 recruitment",
      body: [
        "The second contribution is a set of **ten modular mammalian expression constructs**, designed as a starting point for recruiting an E3 ligase to a receptor you choose. Rather than building something that only works on **Smoothened (SMO)**, we designed two recruitment strategies that can be adapted to other membrane receptors.",
        "The first uses **chemically induced dimerisation**, with DmrA and DmrC(T2098L) domains brought together by the rapalog **AP21967**. The second uses **ALFA-based recruitment**, pairing an ALFA-tagged receptor with an MGRN1 fusion carrying an ALFA-binding nanobody. Both bring the E3 ligase MGRN1 into proximity with a chosen receptor, and both let the recruitment components be changed independently of the receptor.",
        "We designed receptor constructs for **SMO and GPR161**, which is the same recruitment architecture built into two different ciliary receptors. The set also includes catalytically inactive MGRN1 variants and a recruitment-only control, so a later team can tell the effect of induced proximity apart from the effect of MGRN1 actually doing its job.",
      ],
    },
    {
      kind: "adapt",
      id: "adapt",
      navLabel: "Adapting it",
    },
    {
      kind: "prose",
      id: "what-you-can-do",
      heading: "What another team can do with this",
      body: [
        "A team working on a different membrane receptor can take these constructs as design templates, replace the receptor-specific part, and keep the MGRN1 recruitment machinery as it is. The construct architectures are documented on [parts and registry](/parts), and the assays for testing recruitment, ubiquitination and any change in receptor localisation or abundance are on [protocols](/protocols) and [experiments](/experiments).",
        "**These constructs have been designed and ordered. Their biological function has not been tested.** So we cannot claim that MGRN1 recruitment will regulate every membrane receptor, and a different target may need its fusion orientation, its recruitment-domain placement or its cellular localisation changed. What we are handing over is a tested design process and a set of parts, not a result.",
      ],
    },
    {
      kind: "constructs",
      id: "toolkit-constructs",
      navLabel: "The ten constructs",
      heading: "The ten constructs",
      intro:
        "Ordered from GenScript in pcDNA3.1(+)-based expression vectors. Each one is listed with its intended function, its domains and its sequence on [parts and registry](/parts).",
      groups: RECRUITMENT_CONSTRUCTS,
      footnote: "Domain widths are not to scale.",
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
  title: "Judging",
  kicker: "chapter 11 · judging",
  blocks: [
    {
      kind: "medals",
      section: "Bronze",
      navLabel: "Bronze",
      id: "bronze",
      tier: "bronze",
      items: [
        {
          title: "Competition Deliverables",
          asks: "Complete the competition deliverables: the wiki, the presentation video, the judging form and the judging session.",
          met: "All of our work this year is on this wiki, starting at [the home page](/). The required materials are submitted, and we are looking forward to telling you about the project in the session.",
        },
        {
          title: "Project Attributions",
          asks: "Describe what work your team members did, and what other people did for your project, using the standard Project Attributions Form.",
          met: "Who did what, and everything we had help with, is on [attributions](/attributions). The standard form is submitted alongside it.",
        },
        {
          title: "Contribution",
          asks: "Make a useful contribution for future iGEM teams.",
          met: "Our education, Human Practices, wet lab, modelling and engineering work is documented thoroughly, so that another team can pick it up and build on it rather than repeat it. What we are leaving behind is on [contribution](/contribution).",
        },
      ],
    },
    {
      kind: "medals",
      section: "Silver",
      navLabel: "Silver",
      id: "silver",
      tier: "silver",
      items: [
        {
          title: "Engineering Success",
          asks: "Demonstrate engineering success in a technical aspect of your project by going through at least one iteration of the engineering design cycle.",
          met: "We iterated on the project several times over the year: three loops, one per subteam, each with the design, build, test and learn steps written out and the hand-offs between them recorded. They are on [engineering](/engineering), including the [wet lab's cycles](/engineering#wet-lab-cycles), where the kinetic model changed the gene design before anything was ordered.",
        },
        {
          title: "Human Practices",
          asks: "Explain how you have determined that your work is responsible and good for the world.",
          met: "We interviewed **16 stakeholders** and wrote down what each one changed about the project. How a responsible platform was arrived at, and what it is still missing, is on [human practices](/human-practices#stakeholders).",
        },
      ],
    },
    {
      kind: "medals",
      section: "Gold",
      navLabel: "Gold",
      id: "gold",
      tier: "gold",
      items: [
        {
          title: "Excellence in Model",
          asks: "Build a model that helps you understand and design your system, state the assumptions it rests on, and document it so others can use it.",
          met: "A kinetic model of the Hedgehog and MMM system, refined over several versions, with the sensitivity analysis that told the wet lab which rates to measure. The model, its equations and the assumptions it rests on are on [model](/model).",
        },
        {
          title: "Excellence in Education",
          asks: "Develop educational work that goes beyond outreach, and document it so that others can run it.",
          met: "Online outreach, adaptable lesson plans and campus events, each written up with the handbooks to run them again, and **[iGEM Alchemy](/alchemy)**, a browser game we built that teaches the molecules behind the project by combining them. What we did and what it taught us is on [education](/education).",
        },
        {
          title: "Excellence in Integrated Human Practices",
          asks: "Show how your project was shaped by the people it affects, through work integrated into the design.",
          met: "The same 16 interviews, read alongside an extensive literature review, shaped our understanding of community needs, responsible platform development and designing for adoption, and from them came the market model and the deliverables. Each conversation on [human practices](/human-practices#stakeholders) says what changed because of it.",
        },
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
  model,
  humanPractices,
  education,
  experiments,
  protocols,
  parts,
  results,
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
