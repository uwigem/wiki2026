import { useEffect, useState } from 'react'
import { asset } from '../router'
import { LAWN_FILE, gardenFile } from '../garden/gardens'

/**
 * The page background: a lawn over the whole page, and this page's own garden
 * down its two margins.
 *
 * Both are fixed images drawn ahead of time (see `garden/gardens.ts`), shown
 * as plain CSS backgrounds. Nothing is generated here and no script runs to
 * paint them: the browser draws them the way it draws any background, so they
 * are there as soon as the page is. Each page's image is preloaded from that
 * page's own HTML, and the next page's is fetched when a link to it is pointed
 * at, so moving between pages is instant too.
 *
 * Changing page swaps one garden for the other in a single frame, once the new
 * one has loaded and decoded, so there is never a blank or half-drawn moment.
 * There is deliberately no fade: cross-fading two page-tall images made the
 * whole page stutter during the change.
 *
 * The margin strips hang off the sides of a column exactly as wide as the
 * reading column, so the garden always meets the text at the same place, at
 * any window width. Below 1040px there is no margin to speak of and the strips
 * are hidden, leaving the lawn.
 */
export default function GardenBackdrop({ path }: { path: string }) {
  const file = gardenFile(path)
  // The garden on screen. It stays until the next page's garden is ready.
  const [shown, setShown] = useState<string | null>(file)

  useEffect(() => {
    if (!file) {
      setShown(null)
      return
    }
    let live = true
    let fallback = 0
    const swap = () => {
      if (live) setShown(file)
    }
    const img = new Image()
    // Loaded is not quite enough: swapping before the image is decoded can
    // paint one frame with empty margins. So the swap waits for the decode, which
    // takes a few milliseconds. But a browser holds decodes back while the tab is
    // not being drawn, so it never waits more than a moment past the load.
    img.onload = () => {
      fallback = window.setTimeout(swap, 100)
    }
    img.onerror = swap
    img.src = asset(file)
    img.decode().then(swap, () => {})
    return () => {
      live = false
      clearTimeout(fallback)
    }
  }, [file])

  // Fetch a page's garden as soon as a link to it is pointed at or focused,
  // so it is already in the cache by the time the link is followed.
  useEffect(() => {
    const seen = new Set<string>()
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const warm = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.origin !== window.location.origin) return
      let target = a.pathname
      if (base && target.startsWith(base)) target = target.slice(base.length) || '/'
      target = target.replace(/\/+$/, '') || '/'
      const next = gardenFile(target)
      if (!next || seen.has(next)) return
      seen.add(next)
      new Image().src = asset(next)
    }
    document.addEventListener('pointerover', warm, { passive: true })
    document.addEventListener('focusin', warm)
    document.addEventListener('touchstart', warm, { passive: true })
    return () => {
      document.removeEventListener('pointerover', warm)
      document.removeEventListener('focusin', warm)
      document.removeEventListener('touchstart', warm)
    }
  }, [])

  return (
    <div aria-hidden className="garden-backdrop" style={{ backgroundImage: `url(${asset(LAWN_FILE)})` }}>
      {shown && (
        <div className="garden-column">
          <div className="garden-strip garden-strip-left" style={{ backgroundImage: `url(${asset(shown)})` }} />
          <div className="garden-strip garden-strip-right" style={{ backgroundImage: `url(${asset(shown)})` }} />
        </div>
      )}
    </div>
  )
}
