import type { Block, Page } from '../content/pages'
import { pageNeighbours } from '../content/pages'
import { Link } from '../router'
import FlowerBedCard from '../components/FlowerBedCard'
import GardenSection, { Reveal, SectionDivider } from '../components/GardenSection'
import PixelSign, { QuoteSign, TextPanel, TodoPanel } from '../components/PixelSign'
import RichText from '../components/RichText'
import CycleWheel from '../components/CycleWheel'

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

          {page.gardener && <p className="kicker normal-case">tended by {page.gardener}</p>}
        </div>
      </GardenSection>

      <SectionDivider />

      <GardenSection>
        <div className="flex flex-col gap-6 pb-4">
          {page.blocks.map((block, i) => (
            <Reveal key={i}>
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
