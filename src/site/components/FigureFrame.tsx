/**
 * A figure, or the clearly marked hole where one is going.
 *
 * Most of the diagrams this wiki needs do not exist yet, and the useful thing
 * is not to hide that. A figure with no file yet renders as a sized, dashed
 * frame that says what belongs there and which subteam owns it, so the gap is
 * visible to the people who can fill it and obvious to anyone reviewing the
 * page. When the file lands, add `src` and the same block becomes the figure.
 *
 * Images are plain `<img>` with real alt text. For the competition wiki they
 * have to be uploaded to the iGEM server rather than served from here, so
 * `src` is deliberately a bare string and not an import.
 */

interface Props {
  /** Path or URL. Leave out while the figure does not exist yet. */
  src?: string
  /** What the figure shows. Required whenever `src` is set. */
  alt?: string
  caption: string
  /** Subteam that owes this figure. Shown only in the empty state. */
  owner?: string
  /** Rough shape of the finished figure, so the page does not jump later. */
  ratio?: 'wide' | 'square' | 'tall'
  source?: string
}

const RATIO: Record<NonNullable<Props['ratio']>, string> = {
  wide: '16 / 9',
  square: '4 / 3',
  tall: '3 / 4',
}

export default function FigureFrame({ src, alt, caption, owner, ratio = 'wide', source }: Props) {
  return (
    <figure className="panel m-0 px-5 py-5 sm:px-7 sm:py-6">
      {src ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="w-full rounded-sm border-[3px] border-leaf-700"
          style={{ aspectRatio: RATIO[ratio], objectFit: 'contain' }}
        />
      ) : (
        <div
          className="flex w-full flex-col items-center justify-center gap-2 rounded-sm border-[3px] border-dashed border-petal-daisy bg-leaf-50 px-6 py-6 text-center"
          style={{ aspectRatio: RATIO[ratio] }}
        >
          <p className="kicker">figure not drawn yet</p>
          <p className="max-w-md text-body-sm leading-relaxed">{caption}</p>
          {owner && <p className="text-note text-leaf-800">Owned by {owner}</p>}
        </div>
      )}

      {src && <figcaption className="mt-3 text-body-sm leading-relaxed">{caption}</figcaption>}
      {source && (
        <p className="mt-3 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </figure>
  )
}
