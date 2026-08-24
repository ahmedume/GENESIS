import { useEffect, useState } from 'react'
import { EPOCHS } from '../data/epochs'
import { journey } from '../hooks/useDampedProgress'

export function CosmicClock() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    let last = -1
    const check = () => {
      const next = Math.round(journey.raw * 1000) / 1000
      if (next !== last) { last = next; setProgress(next) }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <aside className="pointer-events-none fixed right-5 top-5 z-20 text-right sm:right-8 sm:top-8" aria-label="Cosmic timeline progress">
      <p className="font-terminal text-sm tracking-[0.18em] text-white/55">JOURNEY {Math.round(progress * 100)}%</p>
      <div className="mt-2 h-px w-28 bg-white/15 sm:w-40"><div className="h-px bg-cyan-300" style={{ width: `${progress * 100}%` }} /></div>
      <div className="mt-1 flex justify-between font-terminal text-xs text-white/35"><span>{EPOCHS[0].timeLabel}</span><span>{EPOCHS[EPOCHS.length - 1].timeLabel}</span></div>
    </aside>
  )
}
