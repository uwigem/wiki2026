import { useCallback, useEffect, useRef, useState } from 'react'
import { drawSprite } from '../engine/paint'
import type { Sprite } from '../engine/sprites'
import { SITE_PALETTE } from './theme'

/* ------------------------------------------------------------------ *
 * Sprite rasterising
 *
 * Where the site needs a piece of the garden's art in the DOM (a flower
 * marking a subteam, say), it draws the engine's own sprite rather than a
 * redrawn copy. Each sprite is rendered once at 1:1 into an offscreen canvas,
 * cached as a data URL, and scaled up by CSS at integer factors with
 * `image-rendering: pixelated`, so the pixels stay square.
 * ------------------------------------------------------------------ */

const spriteCache = new Map<Sprite, string>()

export function spriteURL(sp: Sprite): string {
  const cached = spriteCache.get(sp)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = sp.w
  canvas.height = sp.h
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.imageSmoothingEnabled = false
  drawSprite(ctx, sp, 0, 0, SITE_PALETTE)
  const url = canvas.toDataURL()
  spriteCache.set(sp, url)
  return url
}

/* ------------------------------------------------------------------ *
 * Accessibility
 * ------------------------------------------------------------------ */

/** Tracks `prefers-reduced-motion`. The garden falls back to a still frame. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ------------------------------------------------------------------ *
 * Homepage opening sequence
 *
 * Only the UI (veil, signboard, title, nav) is sequenced here. The hedgehog's
 * part of the intro is a real walk through the engine, driven by
 * `gardenStage.walk` in HeroGarden.
 * ------------------------------------------------------------------ */

export type IntroStage = 'veil' | 'garden' | 'settle' | 'hop' | 'sign' | 'title' | 'nav' | 'done'

const STAGE_ORDER: IntroStage[] = ['veil', 'garden', 'settle', 'hop', 'sign', 'title', 'nav', 'done']

/** Beat sheet, in ms from the start of a playthrough. */
const STAGE_AT: Record<IntroStage, number> = {
  veil: 0, //        the garden sits dimmed and quiet
  garden: 700, //    the dim lifts: the real garden, alive, nobody moving
  settle: 1700, //   a beat of nothing but water and sparkles
  hop: 2300, //      the hedgehog walks itself into position (engine hop-walk)
  sign: 3300, //     the signboard fades up out of the grass
  title: 3900, //    the project title lands
  nav: 4500, //      navigation appears
  done: 5100, //     subtitle, buttons, scroll cue
}

const SEEN_KEY = 'wa-igem-intro-seen'

/**
 * sessionStorage throws outright in some privacy modes and in sandboxed
 * frames, so every access is guarded. Losing the flag only means the intro
 * plays again, which is a far better failure than a blank page.
 */
function seenThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function rememberSeen(remember: boolean) {
  try {
    if (remember) window.sessionStorage.setItem(SEEN_KEY, '1')
    else window.sessionStorage.removeItem(SEEN_KEY)
  } catch {
    // no storage available; the intro will just play again next load
  }
}

export interface Intro {
  stage: IntroStage
  /** True once the sequence has reached `s` or passed it. */
  at: (s: IntroStage) => boolean
  playing: boolean
  skip: () => void
  replay: () => void
}

export function useIntro(): Intro {
  const reduced = useReducedMotion()
  // Decided once, when the hook first runs: the intro plays for a visitor who
  // has not seen it this session and has not asked for reduced motion.
  const [stage, setStage] = useState<IntroStage>(() => (reduced || seenThisSession() ? 'done' : 'veil'))
  // Bumped by replay() to arm a fresh playthrough.
  const [runId, setRunId] = useState(0)
  const beats = useRef<number[]>([])

  const cancelBeats = useCallback(() => {
    beats.current.forEach(clearTimeout)
    beats.current = []
  }, [])

  const finish = useCallback(() => {
    cancelBeats()
    rememberSeen(true)
    setStage('done')
  }, [cancelBeats])

  useEffect(() => {
    // `stage` is read once per playthrough, at the moment the beats are armed.
    // It is deliberately not a dependency: the timers below are what move it,
    // and re-running this effect on every beat would re-arm the whole sheet.
    if (stage === 'done') {
      rememberSeen(true)
      return
    }
    beats.current = STAGE_ORDER.filter((s) => s !== 'veil').map((s) =>
      window.setTimeout(() => {
        if (s === 'done') rememberSeen(true)
        setStage(s)
      }, STAGE_AT[s]),
    )
    return cancelBeats
  }, [runId, cancelBeats])

  return {
    stage,
    at: (s) => STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(s),
    playing: stage !== 'done',
    // Skip has to cancel the pending beats as well as jump to the end, or they
    // keep firing and walk the sequence backwards from under the visitor.
    skip: finish,
    replay: () => {
      cancelBeats()
      rememberSeen(false)
      setStage('veil')
      setRunId((n) => n + 1)
      window.scrollTo({ top: 0 })
    },
  }
}

/* ------------------------------------------------------------------ *
 * Small utilities
 * ------------------------------------------------------------------ */

/** Closes a modal or menu on Escape. */
export function useEscape(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape)
  handler.current = onEscape
  useEffect(() => {
    if (!active) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler.current()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [active])
}

/** Fades a panel in the first time it scrolls into view. */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, shown }
}
