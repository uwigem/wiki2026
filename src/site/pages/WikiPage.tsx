import type { Block, Page } from '../content/pages'
import { pageNeighbours } from '../content/pages'
import { Link, useSectionJump } from '../router'
import FlowerBedCard from '../components/FlowerBedCard'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import PixelSign, { QuoteSign, TextPanel, TodoPanel } from '../components/PixelSign'
import RichText from '../components/RichText'
import CycleWheel from '../components/CycleWheel'
import BalanceLogo from '../components/BalanceLogo'
import CapabilityMatrix from '../components/CapabilityMatrix'
import DoseCurve from '../components/DoseCurve'
import FunnelChart from '../components/FunnelChart'
import TornadoChart from '../components/TornadoChart'
import FigureFrame from '../components/FigureFrame'
import HedgehogNote from '../components/HedgehogNote'
import ProgrammePillars from '../components/ProgrammePillars'
import StakeholderGarden from '../components/StakeholderGarden'
import StatRow from '../components/StatRow'
import StructureView from '../components/StructureView'
import ToolShed from '../components/ToolShed'

/**
 * Generic content page, rendered from data in `content/pages.ts`.
 *
 * No garden is drawn here. The background is the canvas `PageGarden` paints
 * behind every page, and the hedgehog in the margin is `HedgehogGuide`. This
 * file only lays out readable panels on top of them.
 *
 * To add or change a page, edit `content/pages.ts`. You should not need to
 * touch this file unless you are adding a new kind of block.
 */
export default function WikiPage({ page }: { page: Page }) {
  const { prev, next } = pageNeighbours(page.slug)
  // A link from another page can name a section; this scrolls to it once the
  // page has rendered.
  useSectionJump(page.slug)

  return (
    <article>
      <GardenSection className="pb-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <PixelSign>
            <p className="pixel text-tag tracking-[0.2em]">{page.kicker}</p>
            <h1 className="mt-1 text-2xl sm:text-4xl">{page.title}</h1>
          </PixelSign>

          <p className="panel-flat max-w-2xl px-4 py-3 text-body leading-relaxed">{page.storyBeat}</p>

          {page.intro && (
            <p className="panel max-w-2xl px-5 py-4 text-lg leading-relaxed">{page.intro}</p>
          )}
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="flex flex-col gap-6 pb-4">
          {page.blocks.map((block, i) => (
            // Blocks are flex items. Anything inside one that can be wider than
            // the column (a table, a code line) has to be free to shrink, or it
            // widens the page instead of scrolling inside itself.
            <Reveal key={i} className="min-w-0" id={block.id}>
              <BlockView block={block} />
            </Reveal>
          ))}
        </div>
      </GardenSection>

      <GardenSection className="pb-8 pt-8">
        <nav aria-label="Page navigation" className="flex flex-wrap items-center justify-between gap-3">
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
    </article>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return (
        <TextPanel heading={block.heading} source={block.source}>
          <RichText paragraphs={block.body} />
        </TextPanel>
      )

    case 'quote':
      return <QuoteSign paragraphs={block.body} source={block.source} />

    case 'cards':
      return (
        <div className="panel px-5 py-5 sm:px-7 sm:py-6">
          {block.heading && <h2 className="text-xl">{block.heading}</h2>}
          {block.intro && <p className="mt-1 max-w-2xl text-body">{block.intro}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <FlowerBedCard key={i} title={item.title} body={item.body} note={item.note} />
            ))}
          </div>
          {block.source && <p className="mt-3 text-note text-leaf-800">{block.source}</p>}
        </div>
      )
    case 'cycles':
      return <CycleWheel heading={block.heading} intro={block.intro} cycles={block.cycles} />
    case 'steps':
      return (
        <div className="panel px-5 py-5 sm:px-7 sm:py-6">
          {block.heading && <h2 className="text-xl">{block.heading}</h2>}
          {block.intro && <p className="mt-1 max-w-2xl text-body">{block.intro}</p>}
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <li key={i}>
                <FlowerBedCard step={i + 1} title={item.title} body={item.body} note={item.note} />
              </li>
            ))}
          </ol>
          {block.source && <p className="mt-3 text-note text-leaf-800">{block.source}</p>}
        </div>
      )

    case 'facts':
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
      )

    case 'narration':
      return <HedgehogNote body={block.body} label={block.label} />

    case 'stats':
      return (
        <StatRow
          heading={block.heading}
          intro={block.intro}
          items={block.items}
          footnote={block.footnote}
          source={block.source}
        />
      )

    case 'matrix':
      return (
        <CapabilityMatrix
          heading={block.heading}
          intro={block.intro}
          columns={block.columns}
          rows={block.rows}
          source={block.source}
        />
      )

    case 'toolshed':
      return (
        <ToolShed heading={block.heading} intro={block.intro} tools={block.tools} source={block.source} />
      )

    case 'tornado':
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
      )

    case 'dose':
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
      )

    case 'funnel':
      return (
        <FunnelChart
          heading={block.heading}
          intro={block.intro}
          stages={block.stages}
          goal={block.goal}
          footnote={block.footnote}
          source={block.source}
        />
      )

    case 'pillars':
      return (
        <ProgrammePillars
          heading={block.heading}
          intro={block.intro}
          pillars={block.pillars}
          source={block.source}
        />
      )

    case 'stakeholders':
      return (
        <StakeholderGarden
          heading={block.heading}
          intro={block.intro}
          people={block.people}
          pending={block.pending}
          source={block.source}
        />
      )

    case 'structure':
      return <StructureView structure={block.structure} />

    case 'logo':
      return (
        <figure className="panel m-0 flex flex-col items-center gap-3 px-5 py-6 sm:flex-row sm:gap-6 sm:px-7">
          <BalanceLogo
            width={240}
            alt="Two hedgehogs sitting in the pans of a balance, which rocks gently between them."
            className="shrink-0"
          />
          <figcaption className="text-body leading-relaxed">{block.caption}</figcaption>
        </figure>
      )

    case 'figure':
      return (
        <FigureFrame
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          owner={block.owner}
          ratio={block.ratio}
          source={block.source}
        />
      )

    case 'todo':
      return <TodoPanel items={block.body} />

    default:
      // Adding a `kind` to the Block union in content/pages.ts without adding a
      // case here is a TypeScript error rather than a silently blank page: the
      // assignment below only compiles while every kind is handled above.
      return assertNeverBlock(block)
  }
}

function assertNeverBlock(block: never): null {
  console.error('Unhandled block kind in BlockView:', block)
  return null
}
