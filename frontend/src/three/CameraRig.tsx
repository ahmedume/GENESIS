import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import { LOOKAHEAD, journeyCurve } from '../lib/cameraPath'
import { useDampedProgress } from '../hooks/useDampedProgress'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const noise = new ImprovedNoise()

/** Dolly camera along the journey spline driven by damped scroll + ≤0.5° handheld drift (SRS FR-01). */
export function CameraRig() {
  const journey = useDampedProgress()
  const pos = useMemo(() => new Vector3(), [])
  const aim = useMemo(() => new Vector3(), [])

  useFrame(({ camera, clock }) => {
    const t = Math.min(Math.max(journey.damped, 0), 1)
    journeyCurve.getPointAt(t, pos)
    journeyCurve.getPointAt(Math.min(t + LOOKAHEAD, 1), aim)
    if (!reducedMotion) {
      const t = clock.elapsedTime * 0.05
      aim.x += noise.noise(t, 3.7, 0) * 0.55
      aim.y += noise.noise(9.2, t, 0) * 0.45
    }
    camera.position.copy(pos)
    camera.lookAt(aim)
    // TEMP DEBUG (remove before commit)
    ;(window as unknown as { __g?: object }).__g = {
      raw: Number(journey.raw.toFixed(3)),
      damp: Number(journey.damped.toFixed(3)),
      x: Number(pos.x.toFixed(1)),
      y: Number(pos.y.toFixed(1)),
      z: Number(pos.z.toFixed(1)),
    }
  })

  return null
}
