import { useEffect } from 'react'
import Lenis from 'lenis'
import { journey } from './useDampedProgress'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Owns the single Lenis instance; mirrors raw scroll into `journey` every frame (SRS FR-01). */
export function useScrollProgress() {
  useEffect(() => {
    const lenis = new Lenis()
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      journey.raw = clamp01(lenis.progress)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      journey.raw = 0
    }
  }, [])
}
