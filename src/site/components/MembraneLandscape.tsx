import { useState } from 'react'
import PixelSprite from './PixelSprite'
import RichText, { inline } from './RichText'
import { PROTEINS, type ProteinLook } from './gardenArt'

/**
 * The ciliary membrane landscape: the proteins that share the compartment,
 * drawn along one membrane. Click a protein to read what it does and what a
 * tool that tunes its amount would let someone ask.
 *
 * Each protein is drawn with a stand-in pixel glyph from `gardenArt.ts` (a
 * seven-helix GPCR in three colourways, the twelve-helix Patched, the
 * polycystin channel) until Creative's sprites arrive; a protein can then
 * carry a `sprite` image and the glyph steps aside.
 */
export interface MembraneProtein {
  /** The short name on the membrane, for example "SMO". */
  short: string
  name: string
  /** What kind of protein it is. */
  family: string
  body: string[]
  /** Which stand-in glyph to draw. */
  look?: ProteinLook
  /** An image to draw instead of the glyph, once one exists. */
  sprite?: string
}

export default function MembraneLandscape({
  heading,
  intro,
  proteins,
  source,
}: {
  heading?: string
  intro?: string
  proteins: MembraneProtein[]
  source?: string
}) {
  const [at, setAt] = useState(0)
  const open = proteins[at]

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}

      {/* The membrane: a cream band with the proteins standing in it. */}
      <div className="relative mt-5 overflow-x-auto">
        <div className="relative min-w-[36rem] px-2 pb-2 pt-6">
          <div aria-hidden className="absolute inset-x-0 top-[2.1rem] h-5 border-y-[3px] border-leaf-700 bg-petal-cream" />
          <ul className="relative flex items-end justify-between gap-2" aria-label="Proteins in the ciliary membrane">
            {proteins.map((p, i) => {
              const isOpen = i === at
              return (
                <li key={p.short}>
                  <button
                    type="button"
                    onClick={() => setAt(i)}
                    aria-pressed={isOpen}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <span className={'flex h-12 items-end rounded-sm transition-transform ' + (isOpen ? 'scale-110' : 'group-hover:scale-105')}>
                      {p.sprite ? (
                        <img src={p.sprite} alt="" className="pixelated h-12" />
                      ) : (
                        <PixelSprite sprite={PROTEINS[p.look ?? 'gpcr-blue']} scale={3} />
                      )}
                    </span>
                    <span
                      className={
                        'pixel rounded-sm border-2 px-1.5 py-0.5 text-[0.65rem] ' +
                        (isOpen ? 'border-leaf-800 bg-leaf-200' : 'border-leaf-300 bg-leaf-50 group-hover:bg-leaf-100')
                      }
                    >
                      {p.short}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="panel-flat mt-4 px-5 py-4" aria-live="polite">
        <h3 className="text-lg sm:text-xl">{open.name}</h3>
        <p className="mt-0.5 text-note text-leaf-800">{open.family}</p>
        <div className="prose-garden mt-2 text-body-sm">
          <RichText paragraphs={open.body} />
        </div>
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
