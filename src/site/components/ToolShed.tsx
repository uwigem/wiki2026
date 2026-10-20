import { useState } from 'react'
import PixelSprite from './PixelSprite'
import { inline } from './RichText'
import { PROPS, SHED_CLOSED, SHED_OPEN, type PropKey } from './gardenArt'

/**
 * The garden shed: the tools researchers already have.
 *
 * Closed on load. Opening the doors shows seven props, one per tool, and
 * picking a prop shows that tool's card: what it does, where it falls short
 * for ciliary work, and how it works. One card at a time, because seven
 * stacked cards made this the longest thing on the page.
 *
 * The shed and the props are stand-in pixel art (`gardenArt.ts`) until
 * Creative's drawings replace them.
 */

export interface ToolEntry {
  name: string
  /** Short label under the prop. */
  short?: string
  /** Which prop stands for it. */
  prop?: PropKey
  /** How the tool works. */
  how: string
  /** What it is good for. */
  good: string
  /** Where it falls short for ciliary work. */
  gap: string
}

interface Props {
  heading?: string
  intro?: string
  tools: ToolEntry[]
  source?: string
}

const PROP_ORDER: PropKey[] = ['axe', 'shears', 'spray', 'puller', 'cart', 'grabber', 'tagger']

export default function ToolShed({ heading, intro, tools, source }: Props) {
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const tool = picked === null ? null : tools[picked]

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      <div className="mt-4 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            setDoorsOpen((o) => !o)
            if (doorsOpen) setPicked(null)
          }}
          aria-expanded={doorsOpen}
          aria-controls="shed-props"
          className="group flex flex-col items-center gap-2"
        >
          <PixelSprite sprite={doorsOpen ? SHED_OPEN : SHED_CLOSED} scale={6} />
          <span className="pixel-btn px-3 py-1.5 text-sm group-hover:bg-leaf-200">{doorsOpen ? 'Close the shed' : 'Open the shed'}</span>
        </button>

        {doorsOpen && (
          <ul id="shed-props" className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3" aria-label="Tools in the shed">
            {tools.map((t, i) => {
              const sprite = PROPS[t.prop ?? PROP_ORDER[i % PROP_ORDER.length]]
              const isPicked = picked === i
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setPicked(isPicked ? null : i)}
                    aria-pressed={isPicked}
                    className={
                      'flex w-[7.25rem] flex-col items-center gap-2 rounded-sm border-[3px] px-1 py-2.5 text-center transition-colors ' +
                      (isPicked
                        ? 'border-leaf-800 bg-leaf-200 shadow-[3px_3px_0_var(--p-shadow)]'
                        : 'border-leaf-300 bg-leaf-50 hover:bg-leaf-100')
                    }
                  >
                    <PixelSprite sprite={sprite} scale={4} />
                    <span className="text-note leading-tight">{t.short ?? t.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="panel-flat mt-4 px-5 py-4" aria-live="polite">
        {tool ? (
          <>
            <h3 className="text-base sm:text-lg">{tool.name}</h3>
            <p className="mt-2 text-body-sm leading-relaxed">{inline(tool.good)}</p>
            <p className="mt-2 border-l-[3px] border-petal-daisy pl-3 text-body-sm leading-relaxed">
              <span className="kicker mr-1.5 normal-case">where it falls short</span>
              {inline(tool.gap)}
            </p>
            <p className="mt-2 text-body-sm leading-relaxed text-leaf-800">
              <span className="kicker mr-1.5 normal-case">how it works</span>
              {inline(tool.how)}
            </p>
          </>
        ) : (
          <p className="text-center text-body-sm leading-relaxed">
            {doorsOpen
              ? 'Pick a tool to read what it is good for and where it stops short for ciliary work.'
              : 'Seven tools cilia labs already use. Open the shed to look at each.'}
          </p>
        )}
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
