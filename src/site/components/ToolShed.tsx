import { useState } from 'react'
import { inline } from './RichText'

/**
 * The garden shed: the tools researchers already have.
 *
 * Every tool here is something a cilia lab can use today, and every one of them
 * falls short in the same place. That shared shortfall is the argument for the
 * project, so the "where it falls short" line is not hidden behind the toggle:
 * it is the part a reader most needs, and a page of collapsed cards that hides
 * the point is a worse page.
 *
 * What collapses is the mechanism, which is reference material. One card is
 * open on load so the shape of a card is obvious without clicking anything.
 */

export interface ToolEntry {
  name: string
  /** How the tool works. The part that collapses. */
  how: string
  /** What it is good for. */
  good: string
  /** Where it falls short for ciliary work. Always visible. */
  gap: string
}

interface Props {
  heading?: string
  intro?: string
  tools: ToolEntry[]
  source?: string
}

export default function ToolShed({ heading, intro, tools, source }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="panel px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      <ul className="mt-4 flex flex-col gap-3">
        {tools.map((tool, i) => {
          const isOpen = open === i
          return (
            <li key={tool.name} className="panel-flat px-4 py-3">
              <h3 className="text-base">{tool.name}</h3>
              <p className="mt-1 text-body-sm leading-relaxed">{inline(tool.good)}</p>

              <p className="mt-2 border-l-[3px] border-petal-daisy pl-3 text-body-sm leading-relaxed">
                <span className="kicker mr-1.5 normal-case">where it falls short</span>
                {inline(tool.gap)}
              </p>

              <button
                type="button"
                className="pixel-btn mt-3 py-1 text-xs"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {isOpen ? 'Hide how it works' : 'How it works'}
              </button>

              {isOpen && <p className="mt-2 text-body-sm leading-relaxed">{inline(tool.how)}</p>}
            </li>
          )
        })}
      </ul>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
