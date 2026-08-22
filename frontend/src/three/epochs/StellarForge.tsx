import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
} from 'three'
import type { Sprite, SpriteMaterial } from 'three'
import { pointAt } from '../../lib/cameraPath'
import { journey } from '../../hooks/useDampedProgress'
import { Nebula } from '../Nebulae'

const SN_U = 0.68 // detonation point on the curve
const WIN_START = 0.655 // shockwave scrub window — deterministic & fully reversible
const WIN_END = 0.715
const ROCKS = 36

function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

/** EPOCH 6 — STELLAR FORGE [SIG]: scroll-scrubbed supernova + gold nebula seeding +
 *  tumbling asteroid debris (procedural fallback per ASSETS.md §3). */
export function StellarForge() {
  const ring = useRef<Mesh>(null)
  const flare = useRef<Sprite>(null)
  const rocks = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  const anchor = useMemo(() => pointAt(SN_U).toArray() as [number, number, number], [])
  const map = useMemo(() => glowTexture('rgba(255,240,210,1)', 'rgba(255,180,80,0)'), [])

  // debris field scattered around the forge zone; rotation state mutated in-place each frame
  const rockData = useMemo(
    () =>
      Array.from({ length: ROCKS }, (_, i) => {
        const p = pointAt(0.63 + ((i * 37) % 90) / 1000) // spread across u 0.63–0.72 deterministically
        return {
          pos: [
            p.x + (Math.random() - 0.5) * 55,
            p.y + (Math.random() - 0.5) * 55,
            p.z,
          ] as [number, number, number],
          rot: [Math.random() * 6.28, Math.random() * 6.28] as [number, number],
          speed: 0.2 + Math.random() * 0.5,
          scale: 0.5 + Math.random() * 1.6,
        }
      }),
    [],
  )

  useFrame(({ camera }, delta) => {
    // shockwave: radius & opacity scrubbed by damped progress
    if (ring.current) {
      const k = (journey.damped - WIN_START) / (WIN_END - WIN_START)
      const visible = k > 0 && k < 1
      ring.current.visible = visible
      if (visible) {
        ring.current.scale.setScalar(0.5 + k * 90)
        ;(ring.current.material as MeshBasicMaterial).opacity = 0.85 * (1 - k)
        ring.current.quaternion.copy(camera.quaternion)
      }
    }

    // core flare peaks at detonation parameter
    if (flare.current) {
      const d = journey.damped - SN_U
      const intensity = Math.exp(-(d * d) / 0.0004)
      flare.current.scale.setScalar(2 + intensity * 26)
      ;(flare.current.material as SpriteMaterial).opacity = Math.min(0.25 + intensity * 0.75, 1)
    }

    // tumble asteroids
    const m = rocks.current
    if (m) {
      for (let i = 0; i < ROCKS; i++) {
        const r = rockData[i]
        r.rot[0] += delta * r.speed
        r.rot[1] += delta * r.speed * 0.7
        dummy.position.set(...r.pos)
        dummy.rotation.set(r.rot[0], r.rot[1], 0)
        dummy.scale.setScalar(r.scale)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      {/* supernova shockwave */}
      <mesh ref={ring} visible={false} position={anchor}>
        <ringGeometry args={[0.97, 1, 72]} />
        <meshBasicMaterial
          color="#ffe9c9"
          transparent
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* detonating core */}
      <sprite ref={flare} position={anchor}>
        <spriteMaterial map={map} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      {/* gold nebula seeding behind the blast */}
      {[0.69, 0.71, 0.73].map((u, i) => {
        const p = pointAt(u)
        return (
          <Nebula
            key={i}
            position={[p.x + (i - 1) * 22, p.y + (i % 2 ? 14 : -12), p.z]}
            size={95}
            colorA="#ffd75e"
            colorB="#ff8a3d"
            seed={11 + i * 3}
            opacity={0.42}
          />
        )
      })}
      {/* asteroid debris — unlit = silhouettes against the glow */}
      <instancedMesh ref={rocks} args={[undefined, undefined, ROCKS]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4a4038" roughness={0.95} metalness={0.05} />
      </instancedMesh>
    </group>
  )
}
