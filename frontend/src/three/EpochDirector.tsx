import { useFrame } from '@react-three/fiber'
import { Color, Fog } from 'three'
import { EPOCHS, TRANSITION_BAND } from '../data/epochs'
import { journey } from '../hooks/useDampedProgress'
import { ignitionFlash } from './Ignition'

/** Shared grade channel — Effects reads `grade.bloom` for the Bloom pass. */
export const grade = { bloom: 1.2 }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const ca = new Color()
const cb = new Color()
const blended = new Color()

/**
 * Single source of per-frame grading (SDS §6): blends fog color/density, exposure and bloom
 * across transition bands centered on epoch boundaries. Mutates scene directly — zero React state.
 */
export function EpochDirector() {
  useFrame(({ scene, gl }) => {
    const p = clamp01(journey.damped)

    let i = EPOCHS.length - 2
    for (let j = 0; j < EPOCHS.length - 1; j++) {
      if (p >= EPOCHS[j].scrollStart && p < EPOCHS[j + 1].scrollStart) {
        i = j
        break
      }
    }
    const a = EPOCHS[i]
    const b = EPOCHS[Math.min(i + 1, EPOCHS.length - 1)]
    const half = TRANSITION_BAND / 2
    const k = i === EPOCHS.length - 1 ? 0 : smoothstep(b.scrollStart - half, b.scrollStart + half, p)

    ca.set(a.grade.fog)
    cb.set(b.grade.fog)
    blended.copy(ca).lerp(cb, k)
    ;(scene.background as Color)?.copy(blended)

    const fog = scene.fog as Fog | null
    if (fog) {
      fog.color.copy(blended)
      fog.near = lerp(a.grade.fogNear, b.grade.fogNear, k)
      fog.far = lerp(a.grade.fogFar, b.grade.fogFar, k)
    }

    // IGNITION flash boost composes on top of graded exposure (Ignition owns its envelope)
    gl.toneMappingExposure = lerp(a.grade.exposure, b.grade.exposure, k) + ignitionFlash.boost
    grade.bloom = lerp(a.grade.bloom, b.grade.bloom, k)
  })

  return null
}
