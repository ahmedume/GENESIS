import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial } from 'three'
import { journey } from '../hooks/useDampedProgress'
import { useStore } from '../state/store'

const IGNITE_AT = 0.02 // SRS FR-03
const FLASH_MS = 250
const RING_MS = 1200
const BASE_EXPOSURE = 0.9
const SPIKE = 1.4

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * IGNITION [SIG]: one-shot exposure flash + expanding shockwave ring at first scroll (FR-03).
 * Plays exactly once per load; skipped entirely under prefers-reduced-motion.
 */
export function Ignition() {
  const ring = useRef<Mesh>(null)
  const startedAt = useRef<number | null>(null)

  useFrame(({ clock, camera, gl }) => {
    const s = useStore.getState()
    if (!s.booted || s.ignited) return

    if (journey.raw > IGNITE_AT) {
      s.setIgnited(true)
      if (!reducedMotion()) startedAt.current = clock.elapsedTime // reduced: no envelope, no ring
    }
    if (startedAt.current == null || !ring.current) return

    const e = (clock.elapsedTime - startedAt.current) * 1000
    gl.toneMappingExposure =
      e < FLASH_MS ? BASE_EXPOSURE + SPIKE * (e / FLASH_MS) : BASE_EXPOSURE + SPIKE * Math.max(0, 1 - (e - FLASH_MS) / 900)

    const k = Math.min(e / RING_MS, 1)
    ring.current.visible = k < 1
    ring.current.scale.setScalar(0.5 + k * 46)
    ;(ring.current.material as MeshBasicMaterial).opacity = 0.7 * (1 - k)
    ring.current.quaternion.copy(camera.quaternion)
  })

  return (
    <mesh ref={ring} visible={false} position={[0, 0, -18]}>
      <ringGeometry args={[0.96, 1, 64]} />
      <meshBasicMaterial
        color="#fff7e6"
        transparent
        side={DoubleSide}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
