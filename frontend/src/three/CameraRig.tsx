import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { LOOKAHEAD, journeyCurve } from '../lib/cameraPath'
import { useDampedProgress } from '../hooks/useDampedProgress'

/** Dolly camera along the journey spline driven by damped scroll (SRS FR-01). */
export function CameraRig() {
  const journey = useDampedProgress()
  const pos = useMemo(() => new Vector3(), [])
  const aim = useMemo(() => new Vector3(), [])

  useFrame(({ camera }) => {
    const t = Math.min(Math.max(journey.damped, 0), 1)
    journeyCurve.getPointAt(t, pos)
    journeyCurve.getPointAt(Math.min(t + LOOKAHEAD, 1), aim)
    camera.position.copy(pos)
    camera.lookAt(aim)
  })

  return null
}
