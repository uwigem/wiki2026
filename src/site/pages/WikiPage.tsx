import { useMemo, useState } from "react";
import type { Block, Page, Persona } from "../content/pages";
import { pageNeighbours } from "../content/pages";
import { Link, useSectionJump } from "../router";
import FlowerBedCard from "../components/FlowerBedCard";
import GardenSection, { SectionBreak, SectionDivider } from "../components/GardenSection";
import PixelSign, { QuoteSign, TextPanel, TodoPanel,} from "../components/PixelSign";
import RichText, { inline } from "../components/RichText";
import CycleWheel from "../components/CycleWheel";
import SignalDial from "../components/SignalDial";
import BalanceLogo from "../components/BalanceLogo";
import CapabilityMatrix from "../components/CapabilityMatrix";
import DoseCurve from "../components/DoseCurve";
import FunnelChart from "../components/FunnelChart";
import TornadoChart from "../components/TornadoChart";
import FigureFrame from "../components/FigureFrame";
import HedgehogNote from "../components/HedgehogNote";
import ProgrammePillars from "../components/ProgrammePillars";
import MmmDiagram from "../components/MmmDiagram";
import StakeholderGarden from "../components/StakeholderGarden";
import StatRow from "../components/StatRow";
import StructureView from "../components/StructureView";
import ToolShed from "../components/ToolShed";
import Callout from "../components/Callout";
import ConstructDiagram from "../components/ConstructDiagram";
import Procedure from "../components/Procedure";
import DataTable from "../components/DataTable";
import DecisionTree from "../components/DecisionTree";
import MembraneLandscape from "../components/MembraneLandscape";
import { SectionAside, SectionMenu, type RailItem, type RailSection } from "../components/SectionRail";
import { CitationContext, slugify } from "../components/citations";
import Details from "../components/Details";
import PixelSprite from "../components/PixelSprite";
import { ACCESSORIES } from "../components/gardenArt";
import References from "../components/References";
import ScienceFigure from "../components/ScienceFigure";
import BorrowStrip from "../components/BorrowStrip";
import VideoRow from "../components/VideoRow";
import PdfEmbed from "../components/PdfEmbed";
import Gallery from "../components/Gallery";
import LinkCards from "../components/LinkCards";
import StageRail from "../components/StageRail";
import StakeholderModal from "../components/StakeholderModal";
import Workflow from "../components/Workflow";
import Pipeline from "../components/Pipeline";
import PartTrail from "../components/PartTrail";
import RecipeStrip from "../components/RecipeStrip";
import ResultsSoon from "../components/ResultsSoon";
import Hog from "../components/alchemy/Hog";
import { StakeholderContext, stakeholderId } from "../components/stakeholders";
import { CreditGroup, PeopleCredits } from "../components/AttributionGroups";

/**
 * Generic content page, rendered from data in `content/pages.ts`.
 *
 * No garden is drawn here. The background is the image `GardenBackdrop` shows
 * behind every page, and the hedgehog in the margin is `HedgehogGuide`. This
 * file only lays out readable panels on top of them.
 *
 * To add or change a page, edit `content/pages.ts`. You should not need to
 * touch this file unless you are adding a new kind of block.
 */
export default function WikiPage({ page }: { page: Page }) {
  const { prev, next } = pageNeighbours(page.slug);
  // A link from another page can name a section; this scrolls to it once the
  // page has rendered.
  useSectionJump(page.slug);

  // The people this page interviewed, if any. Their cards open as a dialog
  // from the stakeholder block and from any `[name](stakeholder:id)` mention.
  const people = page.blocks.flatMap((b) => (b.kind === "stakeholders" ? b.people : []));
  const [openId, setOpenId] = useState<string | null>(null);
  const openPerson = people.find((p) => stakeholderId(p) === openId);

  // Long pages (three or more declared sections) are laid out the way the
  // clearest iGEM wikis lay out theirs: a list of sections beside the column,
  // and each section as one heading over one card. Short pages stay a single
  // column of panels.
  const layout = useMemo(() => groupSections(page.blocks), [page]);
  const long = layout.sections.length >= 3;
  const rail = useMemo<RailSection[]>(
    () => [
      // What opens the page, before the first section. Without this the
      // outline starts part way down and there is no way back to the top of
      // the page from it.
      ...(() => {
        const headed = layout.lead
          .map((b) => ({ id: blockKey(b), label: b.navLabel ?? blockHeading(b) }))
          .filter((e): e is RailItem => Boolean(e.id && e.label));
        return headed.length > 0
          ? [{ id: headed[0].id, label: headed[0].label, items: headed.slice(1) }]
          : [];
      })(),
      ...layout.sections.map(({ id, label, navLabel, blocks }) => ({
        id,
        label: navLabel ?? label,
        // Every headed block after the first is a subsection. The first block
        // opens the section, so the section's own entry already stands for it.
        items: blocks.slice(1).flatMap((b) => {
          // `navLabel` lets the outline be shorter than the heading on the
          // page, and lets a block that prints no heading at all still be
          // somewhere a reader can jump to.
          const label = b.navLabel ?? blockHeading(b);
          const key = blockKey(b);
          return label && key ? [{ id: key, label }] : [];
        }),
      })),
    ],
    [layout],
  );
  const lists = useMemo(() => referenceScopes(page.blocks), [page]);

  return (
    <StakeholderContext.Provider value={{ people, open: setOpenId }}>
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">{page.kicker}</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">{page.title}</h1>
          </PixelSign>

          {/* One introduction, not two stacked boxes, and no box at all on a
              page that opens straight into its content. */}
          {(page.storyBeat || page.intro || page.note) && (
            <div className="panel w-full px-5 py-4 sm:px-7 sm:py-5">
              {page.storyBeat && (
                <p className="text-body leading-relaxed text-leaf-800">{page.storyBeat}</p>
              )}
              {page.intro && <p className="mt-3 text-lg leading-relaxed">{page.intro}</p>}
              {page.note && <p className="mt-3 text-note leading-relaxed text-leaf-800">{page.note}</p>}
            </div>
          )}

          {long && <ReadingTips hasPeople={people.length > 0} />}
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        {/* Blocks are flex items. Anything inside one that can be wider than
            the column (a table, a code line) has to be free to shrink, or it
            widens the page instead of scrolling inside itself. */}
        {/* On a long page the outline hangs off the left of this column, from its
            first block to its last, and sticks while the reader scrolls. */}
        <div className="relative">
          {long && <SectionAside sections={rail} />}

          {layout.lead.length > 0 && (
            <div className="flex flex-col gap-6 pb-10">
              {layout.lead.map((block, i) => (
                <div key={i} id={blockKey(block)} className="min-w-0">
                  <BlockView block={block} />
                </div>
              ))}
            </div>
          )}

          {long ? (
            <div className="flex flex-col gap-8 pb-4">
              {layout.sections.map((section, si) => (
                <CitationContext.Provider key={section.id} value={{ scope: slugify(section.label), lists }}>
                  {/* A marked break, so a new topic does not read as another
                      block of the one before it. */}
                  {si > 0 && <SectionBreak />}
                  <section id={section.id} aria-labelledby={section.id + "-title"} className="min-w-0">
                    <h2 id={section.id + "-title"} className="section-title">
                      {section.label}
                    </h2>
                    <div className="section-card">
                      {section.blocks.map((block, i) => (
                        <div
                          key={i}
                          id={blockKey(block)}
                          className={
                            "section-block min-w-0" +
                            (i > 0 && blockHeading(block) ? " is-sub" : "") +
                            // No heading of its own: photos, resource cards or a video that
                            // belong to the write-up above them, so they sit close to it.
                            (i > 0 && !blockHeading(block) ? " is-attached" : "")
                          }
                        >
                          <BlockView block={block} />
                        </div>
                      ))}
                    </div>
                  </section>
                </CitationContext.Provider>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-4">
              {layout.sections.flatMap((section) => section.blocks).map((block, i) => (
                <div key={i} id={block.id} className="min-w-0">
                  <BlockView block={block} />
                </div>
              ))}
            </div>
          )}
        </div>
      </GardenSection>

      <GardenSection className="pb-8 pt-8">
        <nav
          aria-label="Page navigation"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          {prev ? (
            <Link to={prev.slug} className="pixel-btn">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={next.slug} className="pixel-btn pixel-btn-primary">
              {next.title} →
            </Link>
          ) : (
            <Link to="/team" className="pixel-btn pixel-btn-primary">
              Meet the Team →
            </Link>
          )}
        </nav>
      </GardenSection>

      {openPerson && <StakeholderModal person={openPerson} onClose={() => setOpenId(null)} />}
    </article>
    {long && <SectionMenu sections={rail} />}
    </StakeholderContext.Provider>
  );
}

/** A block's heading, for the kinds that have one. */
function blockHeading(b: Block): string | undefined {
  return "heading" in b && typeof b.heading === "string" ? b.heading : undefined;
}

/**
 * The id a block can be linked to: its own, or, for a headed block without
 * one, an id made from its heading, so every subsection in the outline has
 * somewhere to land.
 */
function blockKey(b: Block): string | undefined {
  if (b.id) return b.id;
  const heading = blockHeading(b);
  return heading ? "sub-" + slugify(heading) : undefined;
}

interface SectionGroup {
  id: string;
  label: string;
  /** What the outline calls this section, where the printed title is long. */
  navLabel?: string;
  blocks: Block[];
}

/**
 * Splits a page's blocks into what comes before its first declared section
 * (`lead`) and the sections themselves. A block with `section` starts a new
 * one; every block after it belongs to it until the next.
 */
function groupSections(blocks: Block[]): { lead: Block[]; sections: SectionGroup[] } {
  const lead: Block[] = [];
  const sections: SectionGroup[] = [];
  for (const b of blocks) {
    // `navLabel` shortens the outline entry the same way it does for a
    // subsection, which a long section title needs more than a short one:
    // the page prints the full "Experiment 4: Functional Validation of MEGF8-
    // and MOSMO-Targeting Binders" while the outline stays scannable.
    if (b.section)
      sections.push({ id: "section-" + slugify(b.section), label: b.section, navLabel: b.navLabel, blocks: [b] });
    else if (sections.length > 0) sections[sections.length - 1].blocks.push(b);
    else lead.push(b);
  }
  return { lead, sections };
}

/** The sections that have a reference list of their own, so their markers can link to it. */
function referenceScopes(blocks: Block[]): ReadonlySet<string> {
  const out = new Set<string>();
  const walk = (list: Block[]) =>
    list.forEach((b) => {
      if (b.kind === "references" && b.for) out.add(slugify(b.for));
      if (b.kind === "details") walk(b.blocks);
    });
  walk(blocks);
  return out;
}

/** The "navigation tips" bar long pages open with: closed, one line, there when wanted. */
function ReadingTips({ hasPeople }: { hasPeople: boolean }) {
  return (
    <details className="panel-flat group w-full text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5">
        <span className="pixel text-sm">How to read this page</span>
        <span aria-hidden className="pixel text-xs transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <ul className="list-disc space-y-1.5 border-t-2 border-leaf-300 py-3 pl-8 pr-4 text-body-sm leading-relaxed">
        <li>The list beside the page (the button in the corner on a phone) jumps to any section.</li>
        {hasPeople && (
          <li>Open any person&apos;s card to read that conversation and what changed because of it. Their names in the text open the same card.</li>
        )}
        <li>
          Parts with a <strong>Show</strong> button hold the working behind a point. Open them only if you want the detail.
        </li>
        <li>Numbers in brackets link to the sources at the foot of the page.</li>
      </ul>
    </details>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return (
        <TextPanel heading={block.heading} source={block.source}>
          <RichText paragraphs={block.body} />
        </TextPanel>
      );

    case "quote":
      return <QuoteSign paragraphs={block.body} source={block.source} />;

    case "cards":
      return (
        <div className="panel px-5 py-5 sm:px-7 sm:py-6">
          {block.heading && <h2 className="text-xl">{block.heading}</h2>}
          {block.intro && (
            <p className="mt-1 text-body">{block.intro}</p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <FlowerBedCard
                key={i}
                title={item.title}
                body={item.body}
                note={item.note}
              />
            ))}
          </div>
          {block.source && (
            <p className="mt-3 text-note text-leaf-800">{block.source}</p>
          )}
        </div>
      );
    case "cycles":
      return (
        <CycleWheel
          heading={block.heading}
          intro={block.intro}
          cycles={block.cycles}
        />
      );
    case "steps":
      return (
        <div className="panel px-5 py-5 sm:px-7 sm:py-6">
          {block.heading && <h2 className="text-xl">{block.heading}</h2>}
          {block.intro && (
            <p className="mt-1 text-body">{block.intro}</p>
          )}
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <li key={i}>
                <FlowerBedCard
                  step={i + 1}
                  title={item.title}
                  body={item.body}
                  note={item.note}
                />
              </li>
            ))}
          </ol>
          {block.source && (
            <p className="mt-3 text-note text-leaf-800">{block.source}</p>
          )}
        </div>
      );

    case "facts":
      return (
        <TextPanel heading={block.heading}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {block.items.map((f, i) => (
              <div key={i} className="border-l-[3px] border-leaf-400 pl-3">
                <dt className="pixel text-sm">{f.title}</dt>
                <dd className="text-body leading-relaxed">{f.body}</dd>
              </div>
            ))}
          </dl>
        </TextPanel>
      );

    case "narration":
      return <HedgehogNote body={block.body} label={block.label} />;

    case "stats":
      return (
        <StatRow
          heading={block.heading}
          intro={block.intro}
          items={block.items}
          footnote={block.footnote}
          source={block.source}
        />
      );

    case "matrix":
      return (
        <CapabilityMatrix
          heading={block.heading}
          intro={block.intro}
          columns={block.columns}
          rows={block.rows}
          source={block.source}
        />
      );

    case "toolshed":
      return (
        <ToolShed
          heading={block.heading}
          intro={block.intro}
          tools={block.tools}
          source={block.source}
        />
      );

    case "tornado":
      return (
        <TornadoChart
          heading={block.heading}
          intro={block.intro}
          rows={block.rows}
          unit={block.unit}
          positiveMeans={block.positiveMeans}
          negativeMeans={block.negativeMeans}
          footnote={block.footnote}
          source={block.source}
        />
      );

    case "dose":
      return (
        <DoseCurve
          heading={block.heading}
          intro={block.intro}
          points={block.points}
          xLabel={block.xLabel}
          yLabel={block.yLabel}
          threshold={block.threshold}
          footnote={block.footnote}
          source={block.source}
        />
      );

    case "funnel":
      return (
        <FunnelChart
          heading={block.heading}
          intro={block.intro}
          stages={block.stages}
          goal={block.goal}
          footnote={block.footnote}
          source={block.source}
        />
      );

    case "pillars":
      return (
        <ProgrammePillars
          heading={block.heading}
          intro={block.intro}
          pillars={block.pillars}
          source={block.source}
        />
      );

    case "stakeholders":
      return (
        <StakeholderGarden
          heading={block.heading}
          intro={block.intro}
          people={block.people}
          pending={block.pending}
          source={block.source}
        />
      );
    case "personas":
      return (
        <PersonaCarousel
          heading={block.heading}
          intro={block.intro}
          people={block.people}
          source={block.source}
        />
      );

    case "structure":
      return <StructureView structure={block.structure} />;

    case "logo":
      return (
        <figure className="panel m-0 flex flex-col items-center gap-3 px-5 py-6 sm:flex-row sm:gap-6 sm:px-7">
          <BalanceLogo
            width={240}
            alt="Two hedgehogs sitting in the pans of a balance, which rocks gently between them."
            className="shrink-0"
          />
          <figcaption className="text-body leading-relaxed">
            {block.caption}
          </figcaption>
        </figure>
      );

    case "mechanism":
      return <MmmDiagram />;

    case "explainer":
      return <SignalDial />;

    case "procedure":
      return (
        <Procedure
          heading={block.heading}
          intro={block.intro}
          groups={block.groups}
          source={block.source}
        />
      );

    case "constructs":
      return (
        <ConstructDiagram
          heading={block.heading}
          intro={block.intro}
          groups={block.groups}
          footnote={block.footnote}
          source={block.source}
        />
      );

    case "figure":
      return (
        <FigureFrame
          src={block.src}
          srcMobile={block.srcMobile}
          alt={block.alt}
          caption={block.caption}
          owner={block.owner}
          ratio={block.ratio}
          hypothetical={block.hypothetical}
          source={block.source}
        />
      );

    case "diagram":
      return (
        <figure className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
          <ScienceFigure kind={block.figure} />
          {block.caption && (
            <figcaption className="mt-3 text-center text-body-sm leading-relaxed text-leaf-800">
              {inline(block.caption)}
            </figcaption>
          )}
          {block.source && (
            <p className="mt-3 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">
              {block.source}
            </p>
          )}
        </figure>
      );

    case "borrow":
      return (
        <BorrowStrip
          heading={block.heading}
          items={block.items}
          outcome={block.outcome}
          source={block.source}
        />
      );

    case "video":
      return <VideoRow heading={block.heading} intro={block.intro} videos={block.videos} source={block.source} />;

    case "pdf":
      return <PdfEmbed file={block.file} title={block.title} pages={block.pages} />;

    case "gallery":
      return <Gallery heading={block.heading} intro={block.intro} images={block.images} source={block.source} />;

    case "links":
      return <LinkCards heading={block.heading} intro={block.intro} items={block.items} source={block.source} />;

    case "recipe":
      return (
        <RecipeStrip
          heading={block.heading}
          intro={block.intro}
          inputs={block.inputs}
          makes={block.makes}
          action={block.action}
          source={block.source}
        />
      );

    case "resultsSoon":
      return <ResultsSoon note={block.note} caption={block.caption} />;

    case "trail":
      return <PartTrail steps={block.steps} current={block.current} />;

    case "pipeline":
      return <Pipeline heading={block.heading} intro={block.intro} stages={block.stages} source={block.source} />;

    case "callout":
      return <Callout heading={block.heading} label={block.label} body={block.body} source={block.source} />;

    case "table":
      return (
        <DataTable
          heading={block.heading}
          intro={block.intro}
          columns={block.columns}
          rows={block.rows}
          caption={block.caption}
          source={block.source}
        />
      );

    case "references":
      return <References heading={block.heading} items={block.items} scope={block.for ? slugify(block.for) : undefined} />;

    case "rail":
      return (
        <StageRail
          heading={block.heading}
          intro={block.intro}
          stages={block.stages}
          hereLabel={block.hereLabel}
          source={block.source}
        />
      );

    case "flowchart":
      return (
        <DecisionTree heading={block.heading} intro={block.intro} start={block.start} nodes={block.nodes} source={block.source} />
      );

    case "landscape":
      return <MembraneLandscape heading={block.heading} intro={block.intro} proteins={block.proteins} source={block.source} />;

    case "workflow":
      return (
        <Workflow heading={block.heading} intro={block.intro} stages={block.stages} footnote={block.footnote} source={block.source} />
      );

    case "details":
      return (
        <Details heading={block.heading} summary={block.summary} open={block.open} step={block.step}>
          {block.blocks.map((inner, i) => (
            <div key={i} id={inner.id} className="section-block min-w-0">
              <BlockView block={inner} />
            </div>
          ))}
        </Details>
      );

    case "people":
      return (
        <PeopleCredits
          heading={block.heading}
          blurb={block.blurb}
          flower={block.flower}
          people={block.people}
          nameOnly={block.nameOnly}
        />
      );

    case "credits":
      return (
        <CreditGroup
          heading={block.heading}
          blurb={block.blurb}
          flower={block.flower}
          sets={block.sets}
        />
      );

    case "todo":
      return <TodoPanel items={block.body} />;

    default:
      // Adding a `kind` to the Block union in content/pages.ts without adding a
      // case here is a TypeScript error rather than a silently blank page: the
      // assignment below only compiles while every kind is handled above.
      return assertNeverBlock(block);
  }
}
/**
 * The kinds of researcher who would adopt the platform, one at a time.
 */
function PersonaCarousel({
  heading,
  intro,
  people,
  source,
}: {
  heading?: string;
  intro?: string;
  people: Persona[];
  source?: string;
}) {
  const [at, setAt] = useState(0);

  if (people.length === 0) return null;

  const person = people[at];
  const step = (by: number) =>
    setAt((n) => (n + by + people.length) % people.length);

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && (
        <p className="mt-2 text-body-sm leading-relaxed">{inline(intro)}</p>
      )}

      <div className="mt-4 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous researcher"
          className="pixel-btn shrink-0"
        >
          &#8592;
        </button>

        {/* `aria-live` so stepping through announces the new profile instead of
            silently swapping the text under a screen reader. */}
        <div
          className="panel-flat min-w-0 flex-1 px-4 py-4 sm:px-5"
          aria-live="polite"
        >
          {/* The picture is floated rather than put in its own column: the
              text is several times taller than it is, so a column left a tall
              empty strip down the left of every card. Floated, the text runs
              beside the picture and then back under it. */}
          <div className="min-w-0 after:block after:clear-both after:content-['']">
            {/* The hedgehog with an accessory for the role stands in for each
                researcher until Creative's drawings (a hedgehog dressed for
                each role) arrive. */}
            <div
              className="relative mb-3 flex items-center justify-center rounded-sm border-[3px] border-leaf-300 bg-leaf-50 px-3 sm:float-left sm:mb-2 sm:mr-4 sm:w-36"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Hog scale={4} />
              {person.persona && (
                <PixelSprite sprite={ACCESSORIES[person.persona]} scale={3} className="absolute right-3 top-3" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl">{person.title}</h3>
              {person.body && (
                <p className="mt-2 text-body-sm leading-relaxed">{inline(person.body)}</p>
              )}
              {(
                [
                  ["who they are", person.role],
                  ["their stake", person.stake],
                  ["what they would need to see", person.cares],
                  ["how they would use it", person.use],
                ] as const
              ).map(
                ([label, text]) =>
                  text && (
                    <p key={label} className="mt-2 text-body-sm leading-relaxed">
                      <span className="kicker mr-1.5 normal-case">{label}</span>
                      {inline(text)}
                    </p>
                  ),
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next researcher"
          className="pixel-btn shrink-0"
        >
          &#8594;
        </button>
      </div>

      <div
        className="mt-3 flex justify-center gap-2"
        role="tablist"
        aria-label="Researchers"
      >
        {people.map((p, i) => (
          <button
            key={p.title}
            type="button"
            role="tab"
            aria-selected={i === at}
            aria-label={p.title}
            onClick={() => setAt(i)}
            className={
              "h-3 w-3 rounded-full border-2 border-leaf-800 transition-colors " +
              (i === at ? "bg-pool-400" : "bg-leaf-50 hover:bg-leaf-200")
            }
          />
        ))}
      </div>

      {source && (
        <p className="mt-3 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">
          {source}
        </p>
      )}
    </section>
  );
}

function assertNeverBlock(block: never): null {
  console.error("Unhandled block kind in BlockView:", block);
  return null;
}
