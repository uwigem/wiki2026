import { useEffect, useRef, useState } from 'react'

/**
 * A PDF, read without leaving the page.
 *
 * The wet lab's protocols are finished documents rather than text we could
 * retype, so the page shows the real file: the browser's own PDF viewer in a
 * frame, with the document also one click from a new tab or a download.
 *
 * Two things this is careful about.
 *
 * A hidden frame still loads. Seven protocols in closed accordions would pull
 * every file on arrival for a page where nothing is open yet, so the frame is
 * mounted the first time its accordion opens and kept after that, the same
 * way `VideoRow` waits for a click before it mounts a player. Finding the
 * accordion by `closest` rather than taking an `open` prop keeps this working
 * wherever the block is put, including outside a `details` altogether.
 *
 * The files themselves are served from iGEM's CDN rather than from this
 * repository. The build artifact iGEM's pipeline uploads has a size limit,
 * and sixteen documents do not fit inside it alongside the site, so they go
 * up through the wiki Uploads tool instead. That tool lays them out under
 * the same directory and file name a block already names here.
 *
 * Most phone browsers cannot render a PDF inline at all. `pdfViewerEnabled`
 * says so plainly, which beats guessing from the user agent, and the reader
 * gets the open and download controls and a line telling them why.
 */
/** Where the wiki's documents live, uploaded through iGEM's Uploads tool. */
const DOC_BASE = 'https://static.igem.wiki/teams/6229/wiki/'

interface Props {
  /** A document, by directory and file name, for example `protocols/exp1-assay.pdf`. */
  file: string
  /** What the document is, for the frame's accessible name. */
  title: string
  /** Shown beside the controls, so the length is known before opening it. */
  pages?: number
}

export default function PdfEmbed({ file, title, pages }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [inline, setInline] = useState(true)
  const href = DOC_BASE + file

  useEffect(() => {
    const nav = navigator as Navigator & { pdfViewerEnabled?: boolean }
    if (nav.pdfViewerEnabled === false) setInline(false)
  }, [])

  useEffect(() => {
    const panel = box.current?.closest('details')
    // Not inside an accordion, or inside one that is already open.
    if (!panel || panel.open) {
      setShown(true)
      return
    }
    const onToggle = () => {
      if (panel.open) setShown(true)
    }
    panel.addEventListener('toggle', onToggle)
    return () => panel.removeEventListener('toggle', onToggle)
  }, [])

  return (
    <div ref={box} className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {pages !== undefined && (
          <p className="kicker">
            PDF, {pages} {pages === 1 ? 'page' : 'pages'}
          </p>
        )}
        {/* Two controls, not one: a local file given `download` can only ever
            save, so opening it needs its own link. */}
        <a href={href} target="_blank" rel="noreferrer noopener" className="pixel-btn py-1.5 text-sm">
          Open PDF →
        </a>
        <a href={href} download className="pixel-btn py-1.5 text-sm">
          Download PDF →
        </a>
      </div>

      {inline ? (
        shown && (
          <div className="mt-3 overflow-hidden rounded-sm border-[3px] border-leaf-700 bg-leaf-50">
            <iframe src={href} title={`${title} (PDF)`} className="block h-[600px] w-full sm:h-[680px]" />
          </div>
        )
      ) : (
        <p className="mt-3 text-note text-leaf-800">
          This browser cannot show a PDF inside the page. Open PDF reads it in a new tab.
        </p>
      )}
    </div>
  )
}
