import { useFrame } from '@react-three/fiber'
import { damp } from 'maath/easing'

/** Shared raw/damped progress channel — render loops read this object, never React state (SDS §5). */
export const journey = { raw: 0, damped: 0 }

const LAMBDA = 4 // scroll "weight" per SRS FR-01 / DESIGN-SYSTEM motion tokens
const MAX_DELTA = 0.1 // tab-switch guard

/** Advances shared damping inside the R3F frame loop. Mount once inside <Canvas>; read `journey`. */
export function useDampedProgress(lambda = LAMBDA) {
  useFrame((_, delta) => {
    damp(journey, 'damped', journey.raw, lambda, Math.min(delta, MAX_DELTA))
  })
  return journey
}
