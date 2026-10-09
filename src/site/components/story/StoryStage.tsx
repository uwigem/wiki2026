import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { CLOSING, CONDITIONS, CONDITION_SOURCE, HERO, STORY } from '../../content/homeStory'
import { PROJECT_TITLE } from '../../content/site'
import { useReducedMotion } from '../../hooks'
import BalanceLogo from '../BalanceLogo'
import ExploreCards from '../ExploreCards'
import { groundTop } from './garden'
import { Painter, span } from './painter'
import { ENTRY_ENDS, drawStory, type Box, type Frame, type Label } from './scenes'

/**
 * The Home 3 story: one picture pinned under the nav while the page scrolls
 * past it.
 *
 * Scrolling. Every scene is one screen of scroll with a snap point at its
 * start, so one flick of the wheel or one swipe always lands on the next
 * scene, never between two. On arrival the scene plays by itself over its
 * `seconds`.
 *
 * Every scene starts on exactly the frame the one before it ended on, and the
 * scroll is built on that, the same in both directions:
 *
 *   - Scrolling down, the scene on screen fast-forwards to its last frame
 *     while the page moves, and the next scene takes over from that frame.
 *   - Scrolling up, the scene on screen rewinds to its first frame while the
 *     page moves, and the previous scene takes over at its last frame, which
 *     is that same picture.
 *
 * So no step, either way, ever cuts from one picture to another. (Scrolling
 * up used to cut straight to the previous scene's last frame the moment the
 * page started to move, which is why going up felt broken everywhere.) The
 * words change once per step, at the start, to the words of the scene the
 * page is heading for, so they lead the picture rather than flickering
 * through every beat it passes.
 *
 * Layout. On a wide screen the words sit in a column on the left and the
 * picture fills the right; on a phone the picture takes the top and the words
 * the bottom. The hero and the closing are the exceptions: there the garden
 * fills the whole stage and the title sits in its sky. The text band has the
 * page's own cream behind it, so words never sit on top of the drawing.
 *
 * Words are HTML. Labels the scenes ask for are positioned over the canvas
 * every frame from native-pixel coordinates; the band text changes only when
 * the story crosses into a new beat.
 */

const LAST = STORY.length - 1
/** How long a scene takes to fast-forward through all of itself when the page moves on. */
const STEP_SECONDS = 0.55
/** Going back up: how long the body of a scene takes to rewind, if it were all body. */
const REWIND_BODY_SECONDS = 0.35
/** Going back up: how long a scene's entry takes to play backwards. */
const REWIND_ENTRY_SECONDS = 0.5

interface Layout {
  navH: number
  stageW: number
  stageH: number
  scale: number
  nw: number
  nh: number
  wide: boolean
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/**
 * The scene whose words the band shows. The closing has no words of its own,
 * so it keeps the last thing that was said while the band fades out, rather
 * than the words vanishing the moment the picture starts to change.
 */
function textScene(idx: number) {
  if (STORY[idx].beats.length) return idx
  if (STORY[idx].id === 'garden') return -1
  for (let i = idx - 1; i >= 0; i--) if (STORY[i].beats.length) return i
  return -1
}

function beatIndex(idx: number, t: number) {
  const ts = textScene(idx)
  if (ts < 0) return -1
  if (ts !== idx) return STORY[ts].beats.length - 1
  // The disease scene opens with the garden parting; words wait until it has.
  if (STORY[idx].id === 'diseases' && t < 0.12) return -1
  let b = 0
  STORY[idx].beats.forEach((beat, i) => {
    if (t >= beat.from) b = i
  })
  return b
}

function bandOpacity(idx: number, t: number) {
  const id = STORY[idx].id
  if (id === 'garden') return 0
  if (id === 'diseases') return span(t, 0.1, 0.2)
  if (id === 'closing') return 1 - span(t, 0, 0.18)
  return 1
}

/** What the watering scene does by itself while nobody is touching the slider. */
function autoWater(t: number) {
  if (t < 0.36) return 0.1
  if (t < 0.58) return 0.5
  if (t < 0.78) return 0.92
  return 0.5
}

export default function StoryStage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  /** Scrolls the page with the snapping held off, set up by the effect below. */
  const glide = useRef<(y: number, jump?: boolean) => void>(() => {})
  const sliderRef = useRef<HTMLInputElement>(null)

  const reduced = useReducedMotion()
  const [layout, setLayout] = useState<Layout | null>(null)
  const [pos, setPos] = useState({ idx: 0, beat: -1 })
  const [openCond, setOpenCond] = useState<string | null>(null)

  /** Which scene is showing and how far it has played. */
  const play = useRef({ idx: -1, t: 0 })
  const water = useRef({ value: 0.1, manual: false })
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  /* --------------------------------------------------------------- measure */
  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const navH = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const stageH = Math.max(360, window.innerHeight - navH)
      const stageW = wrap.clientWidth
      // Nothing to draw into yet (a tab opened in the background): wait for
      // the resize that gives the page its width.
      if (stageW < 1) return
      const scale = clamp(Math.floor(Math.min(stageW / 300, stageH / 190)), 2, 4)
      setLayout({
        navH,
        stageW,
        stageH,
        scale,
        nw: Math.ceil(stageW / scale),
        nh: Math.ceil(stageH / scale),
        wide: stageW >= 900,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /* ------------------------------------------------------------- scrolling */
  /**
   * How the page scrolls while this story is on screen.
   *
   * Inside the story, every scene is a snap point and one wheel gesture is one
   * scene: a wheel notch moves the page about a hundred pixels, which the
   * browser snaps straight back, so on its own a notch did nothing.
   *
   * The footer below the story is an ordinary piece of page, not a scene, so
   * once the reader is past the last scene the snapping is switched off and
   * the wheel is left alone: it scrolls normally down there. Before, dragging
   * up from the very bottom either jumped a whole scene or was yanked back
   * down by the snap, which is the part that felt broken.
   *
   * A scroll this page asks for is made with the snapping off as well, so the
   * browser cannot fight it halfway, and it goes back on once the page has
   * come to rest.
   */
  useEffect(() => {
    if (!layout) return
    const html = document.documentElement
    const was = { type: html.style.scrollSnapType, pad: html.style.scrollPaddingTop }
    const footer = document.querySelector('footer')
    const footerWas = { align: footer?.style.scrollSnapAlign ?? '', margin: footer?.style.marginTop ?? '' }
    html.style.scrollPaddingTop = `${layout.navH}px`
    if (footer) {
      // A snap point, or a swipe could never reach the footer at all, and no
      // top margin, so the closing garden sits straight on it rather than
      // over a blank strip of page background.
      footer.style.scrollSnapAlign = 'end'
      footer.style.marginTop = '0'
    }

    let snapping = false
    const setSnap = (on: boolean) => {
      if (snapping === on) return
      snapping = on
      html.style.scrollSnapType = on ? 'y mandatory' : 'none'
    }
    /** Where scene `i` sits, as a scroll position. */
    const stopAt = (i: number) => {
      const wrap = wrapRef.current
      if (!wrap) return 0
      return window.scrollY + wrap.getBoundingClientRect().top - layout.navH + i * layout.stageH
    }
    /** Still among the scenes, rather than down in the footer. */
    const inStory = () => window.scrollY <= stopAt(LAST) + 8
    setSnap(true)

    let gliding = false
    let watch = 0
    let giveUp = 0
    const glideTo = (y: number, jump = false) => {
      gliding = true
      setSnap(false)
      window.scrollTo({ top: y, behavior: jump || reducedRef.current ? 'instant' : 'smooth' })
      const settled = () => {
        cancelAnimationFrame(watch)
        window.clearTimeout(giveUp)
        gliding = false
        setSnap(inStory())
      }
      cancelAnimationFrame(watch)
      window.clearTimeout(giveUp)
      const began = performance.now()
      let last = -1
      let still = 0
      const look = () => {
        const now = Math.round(window.scrollY)
        still = now === last ? still + 1 : 0
        last = now
        // Arrived, or stopped moving. A browser can take a few frames to
        // start a smooth scroll, so a page that has not moved yet does not
        // count as one that has come to rest.
        if (Math.abs(now - y) < 2 || (still > 3 && performance.now() - began > 250)) settled()
        else watch = requestAnimationFrame(look)
      }
      watch = requestAnimationFrame(look)
      giveUp = window.setTimeout(settled, 1400)
    }
    glide.current = glideTo

    const onScroll = () => {
      if (!gliding) setSnap(inStory())
    }

    /*
     * When a wheel event counts as a step. A trackpad keeps sending events for
     * a second or so after the fingers lift, each a little smaller than the
     * last: if those counted, one flick would carry the reader past several
     * scenes. The old rule, one step per gesture with a gesture ending at a
     * quarter-second pause, stopped that, but it also swallowed a second swipe
     * made while the first one's momentum was still running, and a mouse
     * wheel turned steadily only ever moved one scene. Now an event counts if
     * the push is holding or gaining speed, measured over the last few events
     * against the gesture so far: momentum only ever slows, so it never
     * counts, while a fresh swipe or another notch does. A short lock after
     * each step lets the page get there first.
     */
    let recent: number[] = []
    let lastEvent = 0
    let lastSign = 0
    let lockedUntil = 0
    let goingTo = -1
    let arriveBy = 0
    const mean = (n: number) => {
      const xs = recent.slice(-n)
      return xs.reduce((a, b) => a + b, 0) / xs.length
    }
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      // Past the last scene the page scrolls like any other page.
      if (!inStory()) return
      e.preventDefault()
      const now = performance.now()
      const sign = Math.sign(e.deltaY)
      // A pause or a change of direction starts a new gesture.
      if (now - lastEvent > 200 || sign !== lastSign) recent = []
      lastEvent = now
      lastSign = sign
      recent.push(Math.abs(e.deltaY))
      if (recent.length > 60) recent.shift()
      if (now < lockedUntil || mean(6) < mean(40) * 0.95) return
      const list = STORY.map((_, i) => stopAt(i))
      list.push(document.documentElement.scrollHeight - window.innerHeight)
      // Step from where the page is going if it is still on its way there,
      // otherwise from the stop nearest to where it is.
      let at = 0
      if (now < arriveBy && goingTo >= 0) at = goingTo
      else
        for (let i = 1; i < list.length; i++) {
          if (Math.abs(list[i] - window.scrollY) < Math.abs(list[at] - window.scrollY)) at = i
        }
      const next = clamp(at + Math.sign(e.deltaY), 0, list.length - 1)
      if (next === at) return
      goingTo = next
      arriveBy = now + 900
      lockedUntil = now + 550
      glideTo(list[next])
    }

    // A link home while already home (the logo, the Home sign, the footer)
    // makes the router scroll smoothly back to the top, which on this page
    // means racing back through every scene and flashing each one's words.
    // Go straight to the title instead, the way a far square in the progress
    // row does. The click is left alone, so the link still does everything
    // else it does, such as closing the phone menu; this only replaces the
    // scroll it starts, once that click has finished.
    let homeJump = 0
    const onHomeLink = (e: globalThis.MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as HTMLElement | null)?.closest?.('a')
      if (link?.getAttribute('href') !== '#/') return
      window.clearTimeout(homeJump)
      homeJump = window.setTimeout(() => {
        play.current.idx = 0
        play.current.t = 1
        glideTo(stopAt(0), true)
      }, 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('click', onHomeLink, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('click', onHomeLink, true)
      window.clearTimeout(homeJump)
      cancelAnimationFrame(watch)
      window.clearTimeout(giveUp)
      html.style.scrollSnapType = was.type
      html.style.scrollPaddingTop = was.pad
      if (footer) {
        footer.style.scrollSnapAlign = footerWas.align
        footer.style.marginTop = footerWas.margin
      }
    }
  }, [layout])

  // Leaving a scene resets what the reader did in it.
  useEffect(() => {
    if (STORY[pos.idx].id !== 'diseases') setOpenCond(null)
    if (STORY[pos.idx].id !== 'water') water.current.manual = false
  }, [pos.idx])

  /* ------------------------------------------------------------------ draw */
  useEffect(() => {
    if (!layout) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = layout.nw
    canvas.height = layout.nh
    const painter = new Painter(ctx)
    painter.resize(layout.nw, layout.nh)

    const { nw, nh, wide, scale, navH, stageH } = layout
    const art: Box = wide
      ? { x: Math.round(nw * 0.4) + 4, y: 6, w: Math.round(nw * 0.6) - 10, h: nh - 12 }
      : { x: 4, y: 4, w: nw - 8, h: Math.round(nh * 0.58) - 8 }

    let raf = 0
    let running = false
    let clock = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!reducedRef.current) clock += dt

      // Where the scroll is, in scenes: a whole number at rest on a scene,
      // fractional only while the page is moving from one to the next.
      const wrap = wrapRef.current
      const top = wrap ? wrap.getBoundingClientRect().top : navH
      const u = clamp((navH - top) / stageH, 0, LAST)
      /** How far into the footer the page has scrolled past the last scene, 0 to 1. */
      const pastEnd = Math.max(0, navH - top - LAST * stageH)
      const room = document.documentElement.scrollHeight - window.innerHeight - (window.scrollY - pastEnd)
      const below = room > 0 ? clamp(pastEnd / room, 0, 1) : 0

      // The scene on screen stays on screen while the page moves toward a
      // neighbour, and hands over only once it has played through to its
      // last frame (going down) or rewound to its first (going up), so the
      // neighbour always takes over from the very picture on screen. A jump of
      // more than a scene (a square in the progress row, the End key) goes
      // straight there instead.
      const pl = play.current
      const reducedNow = reducedRef.current
      if (pl.idx < 0) {
        pl.idx = Math.round(u)
        pl.t = 0
      } else {
        const off = u - pl.idx
        const settled = reducedNow || STORY[pl.idx].seconds <= 0
        if (Math.abs(off) >= 1.5) {
          pl.idx = Math.round(u)
          pl.t = off > 0 ? 0 : 1
        } else if (off >= 0.99 && (pl.t >= 1 || settled)) {
          pl.idx = Math.min(LAST, pl.idx + 1)
          pl.t = 0
        } else if (off <= -0.99 && (pl.t <= 0 || settled)) {
          pl.idx = Math.max(0, pl.idx - 1)
          pl.t = 1
        }
      }
      const idx = pl.idx
      /** How far the page is from this scene's own place: + toward the next, - toward the previous. */
      const ahead = u - idx
      const heading = ahead > 0.02 ? 1 : ahead < -0.02 ? -1 : 0

      // Fast-forward and rewind run at their own steady rates rather than at
      // the scroll's speed. Tied to the scroll, they happened mostly in the
      // middle of it, where a smooth scroll moves fastest, so a fade could be
      // over in a few frames. Rewinding is in two speeds: quickly through the
      // body of the scene, then its entry backwards at a readable pace.
      const secs = STORY[idx].seconds
      const entry = ENTRY_ENDS[STORY[idx].id]
      if (reducedNow || secs <= 0) pl.t = 1
      else if (heading < 0)
        pl.t = Math.max(0, pl.t - dt * (pl.t > entry ? 1 / REWIND_BODY_SECONDS : entry / REWIND_ENTRY_SECONDS))
      else if (heading > 0) pl.t = Math.min(1, pl.t + dt * Math.max(1 / secs, 1 / STEP_SECONDS))
      else pl.t = Math.min(1, pl.t + dt / secs)
      const t = pl.t
      const id = STORY[idx].id

      // The words belong to where the page is going, so they change once per
      // step, at the start of it.
      const dest = clamp(idx + heading, 0, LAST)
      const beat = beatIndex(dest, heading > 0 ? 0 : heading < 0 ? 1 : t)
      setPos((p) => (p.idx === dest && p.beat === beat ? p : { idx: dest, beat }))

      // The watering slider drives itself until someone takes hold of it.
      if (id === 'water' && !water.current.manual) {
        const target = autoWater(t)
        const w = water.current
        w.value += (target - w.value) * (1 - Math.exp(-dt * 5))
        if (sliderRef.current) sliderRef.current.value = String(Math.round(w.value * 100))
      }

      const f: Frame = {
        p: painter,
        W: nw,
        H: nh,
        art,
        t,
        time: clock,
        water: water.current.value,
        reduced: reducedRef.current,
        labels: [],
      }
      const labels = drawStory(f, idx)
      if (labelsRef.current) syncLabels(labelsRef.current, labels, scale, layout.stageW)

      // The title is gone in the first stretch of leaving the top, and comes
      // back on the way up as the garden closes again behind it.
      setFade(
        heroRef.current,
        idx === 0 ? 1 - span(u, 0, 0.12) : id === 'diseases' && heading < 0 ? 1 - span(t, 0, 0.13) : 0,
      )
      // Scrolling on into the footer carries the closing screen up with the
      // page. Its words and cards fade as they go, so the bottom of the page
      // is the garden over the footer rather than a sliver of cut-off cards.
      const leaving = 1 - span(below, 0.05, 0.6)
      setFade(closingRef.current, idx === LAST ? span(t, 0.35, 0.65) * leaving : 0)
      setFade(progressRef.current, leaving)
      // Hidden outright once gone, or its squares could still be clicked.
      const shown = leaving > 0.02 ? '' : 'hidden'
      if (progressRef.current && progressRef.current.style.visibility !== shown)
        progressRef.current.style.visibility = shown
      setFade(bandRef.current, bandOpacity(idx, t))
      setFade(hintRef.current, heading === 0 && idx > 0 && idx < LAST && t >= 1 ? 1 : 0)

      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    let onScreen = true
    const sync = () => (onScreen && !document.hidden ? start() : stop())
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      sync()
    })
    if (wrapRef.current) io.observe(wrapRef.current)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [layout])

  const scene = STORY[pos.idx]
  const ts = textScene(pos.idx)
  const beat = ts >= 0 && pos.beat >= 0 ? STORY[ts].beats[pos.beat] : null
  const cond = CONDITIONS.find((c) => c.id === openCond)

  const onLabelClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cond]')
    if (btn) setOpenCond((cur) => (cur === btn.dataset.cond ? null : (btn.dataset.cond ?? null)))
  }

  /**
   * A square of the progress row. Next door: the same step a scroll makes.
   * Further: straight there, playing that scene from its start, because
   * gliding past five scenes would flash all five.
   */
  const goTo = (i: number) => {
    const wrap = wrapRef.current
    if (!wrap || !layout) return
    const y = window.scrollY + wrap.getBoundingClientRect().top - layout.navH + i * layout.stageH
    const far = Math.abs(i - play.current.idx) > 1
    if (far) {
      play.current.idx = i
      play.current.t = 0
    }
    glide.current(y, far)
  }

  const stageStyle = layout ? { top: layout.navH, height: layout.stageH } : { top: 0, height: '100svh' }

  return (
    <div ref={wrapRef} className="relative" style={{ height: layout ? STORY.length * layout.stageH : undefined }}>
      {/* Everything the story says, in order, for screen readers. The visual
          band shows one beat at a time and is hidden from them instead. */}
      <div className="sr-only">
        <h1>{PROJECT_TITLE}</h1>
        <p>{HERO.eyebrow}</p>
        <p>{HERO.tagline}</p>
        {STORY.map((s) =>
          s.beats.map((b, i) => (
            <p key={`${s.id}-${i}`}>
              {b.lead} {b.body}
            </p>
          )),
        )}
        <ul>
          {CONDITIONS.map((c) => (
            <li key={c.id}>
              {c.region}: {c.name}. {c.explanation}
            </li>
          ))}
        </ul>
      </div>

      {/* One snap point per scene. `scroll-snap-stop` stops a fast flick or
          a long swipe from skipping a scene. */}
      {layout &&
        STORY.map((s, i) => (
          <div
            key={s.id}
            aria-hidden
            className="pointer-events-none absolute inset-x-0"
            style={{ top: i * layout.stageH, height: layout.stageH, scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          />
        ))}

      <div className="sticky overflow-hidden bg-leaf-50" style={stageStyle}>
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pixelated absolute left-0 top-0 block"
          style={layout ? { width: layout.nw * layout.scale, height: layout.nh * layout.scale } : undefined}
        />

        {/* Labels the scenes place on the picture. Only the condition buttons
            take pointer events, so the page still scrolls through the rest. */}
        <div ref={labelsRef} onClick={onLabelClick} className="pointer-events-none absolute inset-0" />

        {/* ---------------------------------------------------------- hero */}
        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-x-0 top-0 flex h-[66%] flex-col items-center justify-center px-6 text-center"
        >
          <p className="pixel text-base text-leaf-800 sm:text-xl">{HERO.eyebrow}</p>
          <p className="mt-6 text-lg font-semibold sm:text-2xl">{HERO.welcome}</p>
          <h1 aria-hidden className="mt-1 text-4xl leading-none min-[400px]:text-5xl sm:text-7xl lg:text-8xl">
            {PROJECT_TITLE}
          </h1>
          <p className="pixel mt-4 text-lg leading-snug text-leaf-800 sm:text-2xl">{HERO.tagline}</p>
          <p className="pixel mt-10 flex flex-col items-center text-sm text-leaf-800">
            scroll
            <span aria-hidden className="motion-safe:animate-bounce mt-1 text-lg leading-none">
              &darr;
            </span>
          </p>
        </div>

        {/* ---------------------------------------------------------- band */}
        <div
          ref={bandRef}
          className={
            'absolute flex flex-col justify-center bg-leaf-50 ' +
            (layout?.wide
              ? 'inset-y-0 left-0 w-[40%] px-10 pb-10 xl:px-14'
              : 'inset-x-0 bottom-0 h-[42%] px-6 pb-8')
          }
          style={{ opacity: 0 }}
        >
          {beat && (
            <div key={`${ts}:${pos.beat}`} className="reveal" aria-hidden>
              {beat.eyebrow && <p className="pixel mb-2 text-sm text-leaf-800">{beat.eyebrow}</p>}
              <p className="text-xl font-semibold leading-snug sm:text-2xl xl:text-3xl">{beat.lead}</p>
              {beat.body && <p className="mt-3 text-base leading-relaxed text-leaf-800 sm:text-lg">{beat.body}</p>}
            </div>
          )}

          {scene.id === 'diseases' && pos.beat >= 0 && (
            <div className="mt-4 min-h-[6.5rem]">
              {cond ? (
                <div className="reveal border-l-[3px] border-petal-daisy pl-3">
                  <p className="pixel text-sm text-leaf-800">{cond.region}</p>
                  <p className="font-semibold">{cond.name}</p>
                  <p className="mt-1 text-body-sm leading-relaxed">{cond.explanation}</p>
                  <p className="mt-1 text-note text-leaf-700">{CONDITION_SOURCE}</p>
                </div>
              ) : (
                <p className="pixel text-sm text-leaf-700">Tap a magnifying glass to read about each one.</p>
              )}
            </div>
          )}

          {scene.id === 'water' && (
            <label className="mt-5 block">
              <span className="pixel text-sm text-leaf-800">How much water?</span>
              <input
                ref={sliderRef}
                type="range"
                min={0}
                max={100}
                defaultValue={10}
                onChange={(e) => {
                  water.current.manual = true
                  water.current.value = Number(e.target.value) / 100
                }}
                className="pond-range mt-2 w-full"
                aria-label="How much water the plant gets"
              />
              <span className="mt-1 flex justify-between text-note text-leaf-800">
                <span>too little</span>
                <span>just right</span>
                <span>too much</span>
              </span>
            </label>
          )}

        </div>

        {/* ------------------------------------------------------- closing */}
        {/* One screen: the name, the line and the gates to the rest of the
            site, in the sky above the garden. It fills exactly the sky, down
            to where the ground starts, so nothing sits on the meadow. */}
        <div
          ref={closingRef}
          className="absolute inset-x-0 top-0 flex flex-col items-center justify-center px-4 text-center"
          style={{
            opacity: 0,
            height: layout ? groundTop(layout.nw, layout.nh) * layout.scale : '66%',
          }}
        >
          {/* The logo is the first thing to go on a short screen. */}
          <div className="[@media(max-height:640px)]:hidden">
            <BalanceLogo width={layout?.wide ? 150 : 104} alt="" />
          </div>
          <p className="pixel mt-3 text-4xl leading-none min-[400px]:text-5xl sm:text-6xl">{PROJECT_TITLE}</p>
          <p className="pixel mt-2 text-base text-leaf-800 sm:text-xl">{CLOSING.tagline}</p>
          <div className="mt-5 w-full sm:mt-7">
            <ExploreCards path="/" compact />
          </div>
        </div>

        {/* Where you are in the story, and a nudge once a scene has finished.
            At stage level rather than inside the text band, because the band
            is hidden on the title, the gates and the closing, and those are
            exactly the stops where a reader most wants to know where they
            are. Last in the stage, so no overlay can bury it. */}
        <div
          ref={progressRef}
          className={
            'pointer-events-none absolute bottom-4 flex items-center justify-between gap-4 ' +
            (layout?.wide ? 'left-10 w-[calc(40%-5rem)] xl:left-14 xl:w-[calc(40%-7rem)]' : 'inset-x-6')
          }
        >
          <nav aria-label="Story scenes" className="pointer-events-auto flex items-center">
            {STORY.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Scene ${i + 1} of ${STORY.length}`}
                aria-current={i === pos.idx ? 'step' : undefined}
                className="p-[5px]"
              >
                <span
                  className={
                    'block h-2.5 w-2.5 rounded-[1px] border-2 border-leaf-700 ' +
                    (i === pos.idx ? 'bg-leaf-700' : i < pos.idx ? 'bg-leaf-300' : 'bg-transparent')
                  }
                />
              </button>
            ))}
          </nav>
          <p
            ref={hintRef}
            aria-hidden
            className="pixel flex items-center gap-1 text-sm text-leaf-800 transition-opacity duration-500"
            style={{ opacity: 0 }}
          >
            scroll
            <span className="motion-safe:animate-bounce leading-none">&darr;</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/** Opacity, and no pointer events while invisible, so a faded layer cannot be clicked. */
function setFade(el: HTMLElement | null, v: number) {
  if (!el) return
  const s = v.toFixed(3)
  if (el.style.opacity !== s) el.style.opacity = s
  const pe = v > 0.5 ? '' : 'none'
  if (el.style.pointerEvents !== pe) el.style.pointerEvents = pe
}

/* ------------------------------------------------------------------ labels */

const CHIP =
  'pixel absolute left-0 top-0 whitespace-nowrap rounded-sm border-2 border-leaf-700 bg-leaf-50 px-1.5 text-xs text-leaf-950 sm:text-sm'
const PLAIN = 'pixel absolute left-0 top-0 whitespace-nowrap text-xs text-leaf-950 sm:text-sm'
const COND =
  'pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-sm border-2 px-2 py-1 text-left'
const COND_ON = ' border-leaf-800 bg-petal-cream'
const COND_OFF = ' border-leaf-300 bg-leaf-50'

const MAGNIFIER =
  '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges"><rect x="3" y="1" width="6" height="2" fill="currentColor"/><rect x="1" y="3" width="2" height="6" fill="currentColor"/><rect x="9" y="3" width="2" height="6" fill="currentColor"/><rect x="3" y="9" width="6" height="2" fill="currentColor"/><rect x="10" y="10" width="2" height="2" fill="currentColor"/><rect x="12" y="12" width="3" height="3" fill="currentColor"/></svg>'

/**
 * Keep one DOM element per label id, positioned from native pixels. Built
 * imperatively because it runs every frame; React would re-render the stage
 * sixty times a second to move a few words.
 */
function syncLabels(layer: HTMLDivElement, labels: Label[], scale: number, stageW: number) {
  const seen = new Set<string>()
  for (const l of labels) {
    seen.add(l.id)
    let el = layer.querySelector<HTMLElement>(`[data-label="${l.id}"]`)
    const isCond = l.kind === 'condition'
    if (!el) {
      el = document.createElement(isCond ? 'button' : 'span')
      el.dataset.label = l.id
      if (isCond) {
        const b = el as HTMLButtonElement
        b.type = 'button'
        b.dataset.cond = l.id.replace('cond-', '')
        b.innerHTML = MAGNIFIER
        const words = document.createElement('span')
        const eyebrow = document.createElement('span')
        eyebrow.className = 'pixel block text-[0.65rem] leading-tight text-leaf-800'
        const name = document.createElement('span')
        name.className = 'block text-xs font-semibold leading-tight sm:text-sm'
        words.append(eyebrow, name)
        b.append(words)
        b.setAttribute('aria-label', '')
      } else {
        el.className = l.kind === 'chip' ? CHIP : PLAIN
      }
      layer.append(el)
    }
    if (isCond) {
      const spans = el.querySelectorAll('span span')
      if (spans[0].textContent !== (l.eyebrow ?? '')) spans[0].textContent = l.eyebrow ?? ''
      if (spans[1].textContent !== l.text) spans[1].textContent = l.text
      el.className = COND + (l.active ? COND_ON : COND_OFF)
      el.setAttribute('aria-label', `Read about ${l.text}`)
      el.tabIndex = l.alpha > 0.5 ? 0 : -1
    } else if (el.textContent !== l.text) {
      el.textContent = l.text
    }
    // Resolve the alignment to a left edge in pixels, then keep the whole label
    // on stage. A safety net: no scene should rely on it, but a label cut off
    // at the screen edge is the failure this page must never ship with.
    const w = el.offsetWidth
    const anchor = l.x * scale
    let left = l.align === 'right' ? anchor - w : l.align === 'center' ? anchor - w / 2 : anchor
    left = Math.max(4, Math.min(stageW - 4 - w, left))
    el.style.transform = `translate(${Math.round(left)}px, ${Math.round(l.y * scale)}px) translateY(-50%)`
    el.style.opacity = String(Math.max(0, Math.min(1, l.alpha)))
    el.style.visibility = l.alpha <= 0.01 ? 'hidden' : 'visible'
  }
  for (const el of Array.from(layer.children) as HTMLElement[]) {
    if (!seen.has(el.dataset.label ?? '')) el.remove()
  }
}
