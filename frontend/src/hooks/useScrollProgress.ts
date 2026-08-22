import { useEffect } from 'react'
import Lenis from 'lenis'
import { journey } from './useDampedProgress'
import { useStore } from '../state/store'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Owns the single Lenis instance; mirrors raw scroll into `journey` every frame (SRS FR-01).
 *  Scroll stays locked until the boot gate lifts (FR-01 error case). */
export function useScrollProgress() {
  useEffect(() => {
    const lenis = new Lenis()
    lenis.stop()
    const unlock = useStore.subscribe((s, prev) => {
      if (s.booted !== prev.booted) s.booted ? lenis.start() : lenis.stop()
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      journey.raw = clamp01(lenis.progress)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      unlock()
      cancelAnimationFrame(raf)
      lenis.destroy()
      journey.raw = 0
    }
  }, [])
}
