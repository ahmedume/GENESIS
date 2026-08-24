import { useEffect } from 'react'
import Lenis from 'lenis'
import { journey } from './useDampedProgress'
import { useStore } from '../state/store'

/** Single Lenis instance — mutable holder (HMR-stable object identity). */
export const lenis = { current: null as Lenis | null }

/** REWIND TIME (FR-11): long eased return to the Big Bang. Interruptible by any user scroll. */
export function rewindToSurface() {
  lenis.current?.scrollTo(0, { duration: 8 })
}

/** Owns the single Lenis instance; mirrors raw scroll into `journey` every frame (SRS FR-01).
 *  Scroll stays locked until the boot gate lifts (FR-01 error case).
 *  Lenis steps in its OWN rAF, decoupled from the WebGL frame loop — if the GPU stalls,
 *  page scroll (and the DOM HUD) still advances at display refresh instead of rubber-banding. */
export function useScrollProgress() {
  useEffect(() => {
    // wheelMultiplier <1 — each wheel tick advances less journey: a full 1600vh track at
    // default 1.0 flew through epochs far too fast for the pacing to land
    const l = new Lenis({ autoRaf: false, wheelMultiplier: 0.6 })
    lenis.current = l
    l.stop()

    let raf = 0
    const loop = (now: number) => {
      l.raf(now)
      journey.raw = Math.min(1, Math.max(0, l.progress))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const unlock = useStore.subscribe((s, prev) => {
      if (s.booted !== prev.booted) {
        if (s.booted) l.start()
        else l.stop()
      }
    })

    return () => {
      unlock()
      cancelAnimationFrame(raf)
      l.destroy()
      journey.raw = 0
      if (lenis.current === l) lenis.current = null
    }
  }, [])
}
