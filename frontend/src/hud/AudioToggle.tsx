// Purpose: WebAudio graph owner; opt-in ambience ≤ −12dB (FR-08) · Phase 5
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store'
import { withBase } from '../lib/format'

/** Data sonification of the JWST "Cosmic Cliffs" in the Carina Nebula — telescope
 *  image data mapped to music by SYSTEM Sounds. Source: official NASA release.
 *  Credit: Image: NASA, ESA, CSA, STScI; Sonification: K.Arcand (CXC/SAO),
 *  M.Russo & A.Santaguida (SYSTEM Sounds), Q.Hart & C.Blome (STScI).
 *  https://science.nasa.gov/mission/webb/sonifications/ */
const TRACK_SRC = withBase('audio/carina-nebula.mp3')
const GAIN_ON = 0.24 // ≈ −12.4 dB ambience level
const FADE_IN_S = 1.2
const FADE_OUT_S = 0.6

interface Graph {
  ctx: AudioContext
  gain: GainNode
}

/** MediaElementSource may be created only once per element (throws otherwise) —
 *  stash the graph on the element itself so Strict Mode/HMR remounts reuse it. */
const GRAPH = Symbol('genesis-audio-graph')

function getGraph(el: HTMLAudioElement): Graph | null {
  const existing = (el as unknown as Record<symbol, Graph>)[GRAPH]
  if (existing) return existing
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  const ctx = new AC()
  const gain = ctx.createGain()
  gain.gain.value = 0 // silent until opted in
  ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination)
  const graph = { ctx, gain }
  ;(el as unknown as Record<symbol, Graph>)[GRAPH] = graph
  return graph
}

export function AudioToggle() {
  const booted = useStore((s) => s.booted)
  const enabled = useStore((s) => s.audioEnabled)
  const setAudioEnabled = useStore((s) => s.setAudioEnabled)
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || failed) return

    if (!enabled) return

    const graph = getGraph(el)
    if (!graph) {
      setFailed(true)
      return
    }
    let pauseTimer: number | undefined
    void graph.ctx.resume()
    const t = graph.ctx.currentTime
    graph.gain.gain.cancelScheduledValues(t)
    graph.gain.gain.setValueAtTime(graph.gain.gain.value, t)
    graph.gain.gain.linearRampToValueAtTime(GAIN_ON, t + FADE_IN_S)
    void el.play().catch(() => {
      // missing/corrupt file or codec — degrade to a dead switch instead of a lying one
      setFailed(true)
      setAudioEnabled(false)
    })

    return () => {
      window.clearTimeout(pauseTimer)
      const stopT = graph.ctx.currentTime
      graph.gain.gain.cancelScheduledValues(stopT)
      graph.gain.gain.setValueAtTime(graph.gain.gain.value, stopT)
      graph.gain.gain.linearRampToValueAtTime(0, stopT + FADE_OUT_S)
      pauseTimer = window.setTimeout(() => el.pause(), FADE_OUT_S * 1000 + 150)
    }
  }, [enabled, failed, setAudioEnabled])

  if (!booted) return null

  const dead = failed
  return (
    <>
      <audio ref={ref} src={TRACK_SRC} loop preload="none" />
      <button
        className={`btn-ghost fixed bottom-5 left-5 z-40 min-h-11 px-4 text-xs ${dead ? 'cursor-not-allowed opacity-40' : ''}`}
        aria-pressed={enabled}
        aria-disabled={dead}
        title={dead ? `Missing ${TRACK_SRC}` : undefined}
        onClick={() => !dead && setAudioEnabled(!enabled)}
      >
        {dead ? 'No Audio Signal' : enabled ? 'Sound On' : 'Sound Off'}
      </button>
    </>
  )
}
