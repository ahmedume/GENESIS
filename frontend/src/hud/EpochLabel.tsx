import { useEffect, useState } from 'react'
import { EPOCHS } from '../data/epochs'
import { journey } from '../hooks/useDampedProgress'

export function EpochLabel() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    let raf = 0
    let last = -1
    const check = () => {
      const next = EPOCHS.reduce((found, epoch, i) => journey.raw >= epoch.scrollStart ? i : found, 0)
      if (next !== last) { last = next; setIndex(next) }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  const epoch = EPOCHS[index]
  return (
    <div className="pointer-events-none fixed left-5 top-5 z-20 max-w-[min(45vw,340px)] sm:left-8 sm:top-8" aria-live="polite">
      <p className="font-terminal text-sm tracking-[0.18em] text-cyan-200/80">{epoch.timeLabel}</p>
      <p className="mt-1 font-display text-sm tracking-[0.16em] text-white/90">{epoch.label}</p>
    </div>
  )
}
