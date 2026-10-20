import { useState } from 'react'
import PixelSprite from './PixelSprite'
import RichText, { inline } from './RichText'
import { PROTEINS, type ProteinLook } from './gardenArt'

/**
 * The ciliary membrane landscape: the proteins that share the compartment,
 * drawn along one membrane. Pick a protein to read what it does and what a
 * tool that tunes its amount would let someone ask.
 *
 * The row is built to read as something you press rather than as a legend.
 * The open protein keeps hold of the panel below it the way a browser tab
 * does: it darkens, and a notch grows from it into the top edge of the card,
 * which is flush against the row rather than floating under it.
 *
 * Each protein has its own pixel glyph in `gardenArt.ts`, with its own colour
 * and its own number of coiled helices, so no two of the seven are the same
 * drawing. A protein can still carry a `sprite` image once Creative has one,
 * and the glyph steps aside.
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

interface Props {
  heading?: string
  intro?: string
  proteins: MembraneProtein[]
  source?: string
}

/** The glyph, or the real sprite once there is one. */
function Glyph({ p }: { p: MembraneProtein }) {
  return p.sprite ? (
    <img src={p.sprite} alt="" className="pixelated h-12" />
  ) : (
    <PixelSprite sprite={PROTEINS[p.look ?? 'smo']} scale={3} />
  )
}

/** The cream band the proteins stand in. */
function Membrane() {
  return <div aria-hidden className="absolute inset-x-0 top-[2.1rem] h-5 border-y-[3px] border-leaf-700 bg-petal-cream" />
}

export default function MembraneLandscape({ heading, intro, proteins, source }: Props) {
  const [at, setAt] = useState(0)
  const open = proteins[at]

  /** Left and right walk the row, so the whole thing works from the keyboard. */
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') setAt((i) => (i + 1) % proteins.length)
    if (e.key === 'ArrowLeft') setAt((i) => (i - 1 + proteins.length) % proteins.length)
  }

  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl sm:text-2xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}

      {/* The instruction, said once, where the row starts rather than buried
          at the end of the paragraph above. */}
      <p className="mt-4 flex items-center gap-2 text-note text-leaf-800">
        <span className="badge">pick one</span>
        {proteins.length} proteins share this membrane.
      </p>

      <div className="relative mt-3 overflow-x-auto">
        <div className="relative min-w-[44rem] px-2 pb-2 pt-6">
          <Membrane />
          <ul
            className="relative flex items-end justify-between gap-2"
            aria-label="Proteins in the ciliary membrane"
            onKeyDown={onKey}
          >
            {proteins.map((p, i) => (
              <li key={p.short}>
                <Protein p={p} open={i === at} onPick={() => setAt(i)} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Flush against the row, with its top edge drawn in the same dark green
          as the open protein's notch, so the two read as one thing. */}
      <div className="panel-flat border-t-[3px] border-t-leaf-800 px-5 py-4" aria-live="polite">
        <h3 className="text-lg sm:text-xl">{open.name}</h3>
        <p className="mt-0.5 text-note text-leaf-800">{open.family}</p>
        <div className="prose-garden mt-2 text-body-sm">
          <RichText paragraphs={open.body} />
        </div>
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}

/** One protein in the row: a real pressable, with a pointer, a pressed state
 *  and a focus ring. The old row had none of these, which is why it read as a
 *  diagram rather than as a control. */
function Protein({ p, open, onPick }: { p: MembraneProtein; open: boolean; onPick: () => void }) {
  const glyph = 'flex h-12 items-end transition-transform ' + (open ? 'scale-110' : 'group-hover:scale-105')

  const label =
    'pixel rounded-sm border-2 px-1.5 py-0.5 text-[0.65rem] transition-colors ' +
    (open
      ? 'border-leaf-800 bg-leaf-200 shadow-[2px_2px_0_var(--p-shadow)]'
      : 'border-leaf-300 bg-leaf-50 shadow-[2px_2px_0_var(--p-bushLight)] group-hover:border-leaf-700 group-hover:bg-leaf-100')

  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={open}
      title={`Read about ${p.name}`}
      className="group flex cursor-pointer flex-col items-center gap-1.5 active:translate-y-px"
    >
      <span className={glyph}>
        <Glyph p={p} />
      </span>
      <span className={label}>{p.short}</span>
      {/* The open protein grows a notch that points into the card. The pull
          down lets its tip reach the card's top edge, through the padding the
          row keeps clear for its scrollbar, so the tab joins rather than
          hovering just above the join. */}
      <span
        aria-hidden
        className={
          '-mb-1.5 h-2 w-2 rotate-45 border-b-2 border-r-2 ' +
          (open ? 'border-leaf-800 bg-leaf-200' : 'border-transparent')
        }
      />
    </button>
  )
}
