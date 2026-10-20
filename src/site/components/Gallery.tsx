import { asset } from '../router'
import { inline } from './RichText'

/**
 * A few photographs side by side: an event as it looked. Two across, or one
 * on a phone. Every image is lazy, so a page with several galleries only
 * fetches the ones the reader scrolls to.
 */
export interface GalleryImage {
  /** Path inside `public/`, no leading slash. */
  src: string
  alt: string
  caption?: string
}

/** Matches FigureFrame, so a ratio means the same thing wherever it is set. */
const RATIO = { wide: '16 / 9', square: '4 / 3', tall: '3 / 4' } as const

export default function Gallery({
  heading,
  intro,
  images,
  ratio,
  source,
}: {
  heading?: string
  intro?: string
  images: GalleryImage[]
  /**
   * The shape of the box each image sits in. Left unset, a photograph fills a
   * 4:3 box and is cropped to it. Set, the whole image is shown inside the
   * box instead, which is what a tall diagram or a protein rendering needs.
   */
  ratio?: keyof typeof RATIO
  source?: string
}) {
  const cols = images.length === 1 ? '' : images.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <section className="min-w-0">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}
      <div className={'grid gap-3 ' + cols + (heading || intro ? ' mt-4' : '')}>
        {images.map((im) => (
          <figure key={im.src} className="min-w-0">
            <img
              src={asset(im.src)}
              alt={im.alt}
              loading="lazy"
              decoding="async"
              className="w-full rounded-sm border-[3px] border-leaf-700"
              style={
                ratio
                  ? { aspectRatio: RATIO[ratio], objectFit: 'contain' }
                  : { aspectRatio: RATIO.square, objectFit: 'cover' }
              }
            />
            {im.caption && <figcaption className="mt-1.5 text-note text-leaf-800">{inline(im.caption)}</figcaption>}
          </figure>
        ))}
      </div>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
