import { useState } from 'react'
import { inline } from './RichText'

/**
 * Short videos, each shown as its still with a play button until the reader
 * clicks it; only then is YouTube's player loaded, into that one frame.
 *
 * A YouTube player is several hundred kilobytes of script and a dozen
 * requests before anyone has pressed play. A page with two of them would
 * spend more on players nobody started than on everything else put together,
 * so the stills come from YouTube's image host (a few kilobytes each) and
 * the player is fetched only on demand, through the no-cookie domain.
 */
export interface VideoItem {
  /** The YouTube video id, the part after `v=`. */
  id: string
  title: string
  /** One line under the title: who is in it, what it covers. */
  note?: string
}

function Video({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false)
  return (
    <figure className="min-w-0">
      <div className="relative aspect-video overflow-hidden rounded-sm border-[3px] border-leaf-700 bg-leaf-950">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
            aria-label={`Play: ${video.title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-90"
            />
            <span className="pixel-btn pixel-btn-primary relative px-5 py-2.5 text-base">▶ Play</span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-body-sm leading-snug">
        <span className="font-semibold">{video.title}</span>
        {video.note && <span className="block text-leaf-800">{inline(video.note)}</span>}
      </figcaption>
    </figure>
  )
}

export default function VideoRow({
  heading,
  intro,
  videos,
  source,
}: {
  heading?: string
  intro?: string
  videos: VideoItem[]
  source?: string
}) {
  return (
    <section className="panel min-w-0 px-5 py-5 sm:px-7 sm:py-6">
      {heading && <h2 className="text-xl">{heading}</h2>}
      {intro && <p className="mt-1 max-w-2xl text-body leading-relaxed">{inline(intro)}</p>}
      <div className={'mt-4 grid gap-4 ' + (videos.length > 1 ? 'sm:grid-cols-2' : 'max-w-2xl')}>
        {videos.map((v) => (
          <Video key={v.id} video={v} />
        ))}
      </div>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{source}</p>
      )}
    </section>
  )
}
