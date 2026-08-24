import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial } from 'three'
import { journey } from '../hooks/useDampedProgress'
import { motionPreference } from '../hooks/useReducedMotion'

const COUNT = 550
const DEPTH = 560
/** Inflation window: streaks brighten as the epoch approaches, fade after (STORYBOARD E1). */
const WINDOW = { start: 0.08, end: 0.16 }

function seeded(seed: number) {
  let value = seed
  return () => (value = (value * 1664525 + 1013904223) % 4294967296) / 4294967296
}

const intensityAt = (p: number) => {
  if (p < WINDOW.start - 0.03 || p > WINDOW.end + 0.05) return 0
  const rise = Math.min(1, Math.max(0, (p - (WINDOW.start - 0.03)) / 0.05))
  const fall = Math.min(1, Math.max(0, ((WINDOW.end + 0.05) - p) / 0.04))
  return Math.min(rise, fall)
}

/**
 * SpacetimeWarp [SIG-adjacent]: radial line field the camera flies through — lines read as
 * motion-streaks when the inflation window is hot; invisible otherwise.
 */
export function SpacetimeWarp() {
  const group = useRef<Group>(null)
  const mat = useRef<LineBasicMaterial>(null)

  const geometry = useMemo(() => {
    const random = seeded(2024)
    const positions = new Float32Array(COUNT * 2 * 3)
    for (let i = 0; i < positions.length; i += 6) {
      const x = (random() - 0.5) * 110
      const y = (random() - 0.5) * 110
      const z = -random() * DEPTH
      const len = 6 + random() * 14
      positions.set([x, y, z, x, y, z - len], i)
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    const intensity = intensityAt(journey.damped)
    // fully idle outside the window — no color HSL math, no drift
    if (intensity <= 0 || motionPreference.reduced) return
    if (mat.current) {
      mat.current.opacity = intensity * 0.8
      mat.current.color.setHSL(0.75 + Math.sin(clock.elapsedTime * 0.2) * 0.02, 0.6, 0.6)
    }
    if (group.current) {
      // slow forward drift sells the stretch without fighting the camera path
      group.current.position.z = ((clock.elapsedTime * 14) % DEPTH) - DEPTH / 2
    }
  })

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial ref={mat} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} fog={false} />
      </lineSegments>
    </group>
  )
}
