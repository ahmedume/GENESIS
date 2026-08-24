import { useFrame } from '@react-three/fiber'
import { damp } from 'maath/easing'
import { motionPreference } from './useReducedMotion'

/** Shared raw/damped progress channel — render loops read this object, never React state (SDS §5). */
export const journey = { raw: 0, damped: 0 }

const LAMBDA = 6.5 // scroll "weight" — raised from 4 to cut input→camera latency (~170ms vs ~250ms settle) while keeping the weighted feel
const MAX_DELTA = 0.1 // tab-switch guard

/** Advances shared damping inside the R3F frame loop. Mount once inside <Canvas>; read `journey`. */
export function useDampedProgress(lambda = LAMBDA) {
  useFrame((_, delta) => {
    if (motionPreference.reduced) journey.damped = journey.raw
    else damp(journey, 'damped', journey.raw, lambda, Math.min(delta, MAX_DELTA))
  })
  return journey
}
