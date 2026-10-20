import PixelSprite from './PixelSprite'
import { inline } from './RichText'
import { ANTIBODY, PROPS, type PropKey } from './gardenArt'

/**
 * Several things that already exist, and the one thing a new technology adds
 * to them: each borrowed idea drawn with the prop that stands for it in the
 * tool shed, then an arrow, then what they add up to.
 *
 * A strip, not a claim: the captions say what the text beside it says, and
 * the outcome line is the sentence it illustrates.
 */
export type BorrowGlyph = PropKey | 'antibody'

export interface BorrowItem {
  glyph: BorrowGlyph
  caption: string
}

export default function BorrowStrip({
  heading,
  items,
  outcome,
  source,
}: {
  heading?: string
  items: BorrowItem[]
  outcome: string
  source?: string
}) {
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ul className="grid flex-1 grid-cols-3 gap-2">
          {items.map((it) => (
            <li key={it.caption} className="panel-flat flex flex-col items-center gap-1.5 px-2 py-3 text-center">
              <PixelSprite sprite={it.glyph === 'antibody' ? ANTIBODY : PROPS[it.glyph]} scale={3} />
              <span className="text-[0.7rem] leading-tight">{inline(it.caption)}</span>
            </li>
          ))}
        </ul>

        <p aria-hidden className="pixel self-center text-lg text-leaf-800 sm:px-1">
          <span className="sm:hidden">▾</span>
          <span className="hidden sm:inline">→</span>
        </p>

        <p className="panel-flat flex-1 border-petal-daisy px-4 py-3 text-body-sm leading-relaxed">{inline(outcome)}</p>
      </div>

      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
