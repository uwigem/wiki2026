import { useEffect, useRef, useState } from 'react'

// A tiny generative ambience: a soft warm pad + occasional pentatonic
// "water drop" plinks. All synthesized, so there are no audio files to ship.
export function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const timerRef = useRef<number | null>(null)

  const scale = [0, 3, 5, 7, 10, 12, 15] // minor pentatonic-ish, in semitones
  const root = 220 // A3

  useEffect(() => {
    if (!enabled) {
      // fade out + tear down
      const ctx = ctxRef.current
      const master = masterRef.current
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime)
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx: AudioContext = ctxRef.current ?? new AudioCtx()
    ctxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume()

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, ctx.currentTime)
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.6)
    master.connect(ctx.destination)
    masterRef.current = master

    // warm pad: two detuned triangles through a gentle low-pass + slow tremolo
    const pad = ctx.createGain()
    pad.gain.value = 0.06
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 900
    const oscA = ctx.createOscillator()
    const oscB = ctx.createOscillator()
    oscA.type = 'triangle'
    oscB.type = 'triangle'
    oscA.frequency.value = root / 2
    oscB.frequency.value = root / 2 + 0.6
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 0.03
    lfo.connect(lfoGain).connect(pad.gain)
    oscA.connect(lp)
    oscB.connect(lp)
    lp.connect(pad).connect(master)
    oscA.start()
    oscB.start()
    lfo.start()

    // soft flowing-water bed: looping filtered noise with a gentle babble LFO
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const chan = noiseBuf.getChannelData(0)
    for (let i = 0; i < chan.length; i++) chan[i] = (Math.random() * 2 - 1) * 0.6
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop = true
    const noiseLp = ctx.createBiquadFilter()
    noiseLp.type = 'lowpass'
    noiseLp.frequency.value = 700
    noiseLp.Q.value = 0.6
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.05
    const babble = ctx.createOscillator()
    const babbleGain = ctx.createGain()
    babble.frequency.value = 0.15
    babbleGain.gain.value = 180
    babble.connect(babbleGain).connect(noiseLp.frequency)
    noise.connect(noiseLp).connect(noiseGain).connect(master)
    noise.start()
    babble.start()

    // scheduled plinks
    const plink = () => {
      if (!enabled) return
      const now = ctx.currentTime
      const semi = scale[(Math.random() * scale.length) | 0] + (Math.random() > 0.6 ? 12 : 0)
      const freq = root * Math.pow(2, semi / 12)
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(0.0001, now)
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)
      o.connect(g).connect(master)
      o.start(now)
      o.stop(now + 1.2)
      timerRef.current = window.setTimeout(plink, 2600 + Math.random() * 4000)
    }
    timerRef.current = window.setTimeout(plink, 1200)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      try {
        noise.stop()
        babble.stop()
        oscA.stop()
        oscB.stop()
        lfo.stop()
      } catch {
        /* already stopped */
      }
    }
  }, [enabled])

  return { enabled, toggle: () => setEnabled((v) => !v) }
}
