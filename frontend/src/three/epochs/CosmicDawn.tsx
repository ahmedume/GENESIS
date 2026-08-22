import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Group, Mesh, MeshBasicMaterial } from 'three'
import { journey } from '../../hooks/useDampedProgress'

interface Star {
  position: [number, number, number]
  igniteAt: number // scroll progress threshold
}

const STARS: Star[] = [
  { position: [-16, 8, -196], igniteAt: 0.385 },
  { position: [21, -6, -206], igniteAt: 0.4 },
  { position: [-9, -13, -216], igniteAt: 0.415 },
  { position: [14, 11, -226], igniteAt: 0.43 },
  { position: [-24, 2, -236], igniteAt: 0.443 },
  { position: [5, -18, -244], igniteAt: 0.454 },
  { position: [26, 14, -252], igniteAt: 0.464 },
]

function disc() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(190,225,255,0.55)')
  g.addColorStop(1, 'rgba(190,225,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

/** EPOCH 4 — COSMIC DAWN [SIG]: sequential blue-giant ignitions driven by scroll progress.
 *  Each birth spikes fast (flare), settles to a persistent white-blue core.
 *  Pacing: thresholds spaced ≥0.011 ≈ ≥400ms of travel (ACCESSIBILITY §2). */
export function CosmicDawn() {
  const map = useMemo(disc, [])
  const groups = useRef<(Group | null)[]>([])

  useFrame(() => {
    const p = Math.min(Math.max(journey.damped, 0), 1)
    groups.current.forEach((g, i) => {
      if (!g) return
      const k = Math.min(Math.max((p - STARS[i].igniteAt) / 0.006, 0), 1) // flare-in over ~0.6% scroll
      const settle = 1 + Math.sin(k * Math.PI) * 1.6 // overshoot mid-flare
      const scale = k === 0 ? 0 : (k < 1 ? settle : 1) * 7
      g.scale.setScalar(scale)
      const core = g.children[0] as Mesh
      ;(core.material as MeshBasicMaterial).opacity = k
    })
  })

  return (
    <group>
      {STARS.map((s, i) => (
        <group key={i} ref={(el) => void (groups.current[i] = el)} position={s.position}>
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshBasicMaterial color="#eaf6ff" transparent toneMapped={false} />
          </mesh>
          <sprite scale={[1, 1, 1]}>
            <spriteMaterial map={map} blending={AdditiveBlending} depthWrite={false} opacity={0.9} />
          </sprite>
          <sprite scale={[2.6, 0.12, 1]}>
            <spriteMaterial map={map} blending={AdditiveBlending} depthWrite={false} opacity={0.5} />
          </sprite>
        </group>
      ))}
      {/* FLARE_MS documents pacing; scroll thresholds above already space births ≥400ms of travel */}
    </group>
  )
}
