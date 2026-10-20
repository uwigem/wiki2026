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

export default function Gallery({
  heading,
  intro,
  images,
  source,
}: {
  heading?: string
  intro?: string
  images: GalleryImage[]
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
              className="aspect-[4/3] w-full rounded-sm border-[3px] border-leaf-700 object-cover"
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
