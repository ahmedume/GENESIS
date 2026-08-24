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
      const state = useStore.getState()
      if (state.autoScroll && state.booted) {
        const next = Math.min(l.limit, l.scroll + 1.15)
        l.scrollTo(next, { immediate: true, force: true })
        if (next >= l.limit - 1) state.setAutoScroll(false)
      }
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

    const stopAutoScroll = () => {
      if (useStore.getState().autoScroll) useStore.getState().setAutoScroll(false)
    }
    window.addEventListener('wheel', stopAutoScroll, { passive: true })
    window.addEventListener('touchstart', stopAutoScroll, { passive: true })
    window.addEventListener('keydown', stopAutoScroll)

    return () => {
      unlock()
      window.removeEventListener('wheel', stopAutoScroll)
      window.removeEventListener('touchstart', stopAutoScroll)
      window.removeEventListener('keydown', stopAutoScroll)
      cancelAnimationFrame(raf)
      l.destroy()
      journey.raw = 0
      if (lenis.current === l) lenis.current = null
    }
  }, [])
}
