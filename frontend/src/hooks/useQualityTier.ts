import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { QualityTier } from '../state/store'
import { useStore } from '../state/store'

/** Render-resolution ladder (FR-10) — fill rate is the dominant cost of the bloom pipeline. */
export const TIER_DPR: Record<QualityTier, [number, number]> = {
  low: [0.6, 0.9],
  medium: [0.85, 1],
  high: [1, 1.25], // matches the previous static dpr cap
}

const ORDER: readonly QualityTier[] = ['low', 'medium', 'high']

const step = (tier: QualityTier, dir: 1 | -1): QualityTier =>
  ORDER[Math.min(ORDER.length - 1, Math.max(0, ORDER.indexOf(tier) + dir))]

/** Device heuristic ceiling (FR-10): coarse-pointer/mobile and ≤4-core machines never climb past medium. */
export function deviceTierCeiling(): QualityTier {
  if (typeof window === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return coarse || cores <= 4 ? 'medium' : 'high'
}

const SAMPLE_MS = 1000
const DOWNGRADE_FPS = 45 // one bad second → step down immediately
const UPGRADE_FPS = 58 // three consecutive good seconds → step back up
const GOOD_SAMPLES_TO_UPGRADE = 3
const SWITCH_COOLDOWN_MS = 2500 // min gap between tier switches — each switch reallocates
// render targets (visible hitch), so rapid flapping around the threshold must be impossible

/**
 * FPS watchdog inside the R3F frame loop: degrades fast, recovers slow, never exceeds
 * the device ceiling (FR-10). Reads/writes tier imperatively — zero React re-renders.
 */
export function QualityGovernor({ ceiling }: { ceiling: QualityTier }) {
  const frames = useRef(0)
  const startedAt = useRef(0)
  const goodSamples = useRef(0)
  const lastSwitchAt = useRef(0)

  useFrame(() => {
    const now = performance.now()
    if (startedAt.current === 0) {
      startedAt.current = now
      return
    }
    frames.current++
    const elapsed = now - startedAt.current
    if (elapsed < SAMPLE_MS) return
    const fps = (frames.current * 1000) / elapsed
    frames.current = 0
    startedAt.current = now

    const current = useStore.getState().qualityTier
    const cooledDown = now - lastSwitchAt.current >= SWITCH_COOLDOWN_MS
    if (fps < DOWNGRADE_FPS && current !== 'low' && cooledDown) {
      goodSamples.current = 0
      lastSwitchAt.current = now
      useStore.getState().setQualityTier(step(current, -1))
    } else if (fps > UPGRADE_FPS && current !== ceiling && ++goodSamples.current >= GOOD_SAMPLES_TO_UPGRADE && cooledDown) {
      goodSamples.current = 0
      lastSwitchAt.current = now
      useStore.getState().setQualityTier(step(current, 1))
    } else if (fps <= UPGRADE_FPS) {
      goodSamples.current = 0
    }
  })

  return null
}
