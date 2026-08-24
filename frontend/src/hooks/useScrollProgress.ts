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
 *  Scroll stays locked until the boot gate lifts (FR-01 error case). */
export function useScrollProgress() {
  useEffect(() => {
    const l = new Lenis()
    lenis.current = l
    l.stop()
    const unlock = useStore.subscribe((s, prev) => {
      if (s.booted !== prev.booted) s.booted ? l.start() : l.stop()
    })

    return () => {
      unlock()
      l.destroy()
      journey.raw = 0
      if (lenis.current === l) lenis.current = null
    }
  }, [])
}
