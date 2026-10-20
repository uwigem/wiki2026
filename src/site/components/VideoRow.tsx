import { inline } from './RichText'

/**
 * Short videos, listed as links rather than embedded.
 *
 * iGEM only allows an iframe to embed something already hosted on iGEM
 * infrastructure, and everything a wiki loads at runtime has to come from an
 * iGEM domain. A YouTube player, and even YouTube's still image, are neither.
 * Linking out is explicitly fine, so each video is a card that opens in a new
 * tab, which also costs the page nothing until somebody wants it.
 */
export interface VideoItem {
  /** The YouTube video id, the part after `v=`. */
  id: string
  title: string
  /** One line under the title: who is in it, what it covers. */
  note?: string
}

function Video({ video, index }: { video: VideoItem; index: number }) {
  return (
    <figure className="panel-flat flex min-w-0 flex-col gap-2 p-3">
      <p className="kicker flex items-center gap-2">
        Episode
        <span className="badge">{String(index + 1).padStart(2, '0')}</span>
      </p>
      <figcaption className="text-body-sm leading-snug">
        <span className="font-semibold">{video.title}</span>
        {video.note && <span className="mt-0.5 block text-leaf-800">{inline(video.note)}</span>}
      </figcaption>
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noreferrer noopener"
        className="pixel-btn mt-auto self-start"
      >
        Watch the episode ↗
      </a>
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
      {intro && <p className="mt-1 text-body leading-relaxed">{inline(intro)}</p>}
      <div className={'mt-4 grid gap-4 ' + (videos.length > 1 ? 'sm:grid-cols-2' : 'max-w-2xl')}>
        {videos.map((v, i) => (
          <Video key={v.id} video={v} index={i} />
        ))}
      </div>
      {source && (
        <p className="mt-4 border-t-2 border-dashed border-leaf-300 pt-2 text-note text-leaf-800">{inline(source)}</p>
      )}
    </section>
  )
}
