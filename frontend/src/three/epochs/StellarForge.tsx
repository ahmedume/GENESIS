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
  PointLight,
} from 'three'
import type { Sprite, SpriteMaterial } from 'three'
import { pointAt } from '../../lib/cameraPath'
import { journey } from '../../hooks/useDampedProgress'
import { Nebula } from '../Nebulae'

const SN_U = 0.68 // detonation parameter — subject anchored AHEAD of it so the blast
const LEAD = 0.028 // grows into frame during approach and washes over the camera
const WIN_START = 0.655 // shockwave scrub window — deterministic & fully reversible
const WIN_END = 0.715
const ROCKS = 36

/** Seeded LCG — debris layout is identical on every load (QA determinism rule). */
function seeded(seed: number) {
  let s = seed
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296
}

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

  const anchor = useMemo(() => pointAt(SN_U + LEAD).toArray() as [number, number, number], [])
  const map = useMemo(() => glowTexture('rgba(255,240,210,1)', 'rgba(255,180,80,0)'), [])
  const flash = useRef<PointLight>(null)

  // debris field scattered around the forge zone; rotation state mutated in-place each frame
  const rockData = useMemo(() => {
    const rand = seeded(1337)
    return Array.from({ length: ROCKS }, (_, i) => {
      const p = pointAt(0.63 + ((i * 37) % 90) / 1000) // spread across u 0.63–0.72 deterministically
      return {
        pos: [
          p.x + (rand() - 0.5) * 55,
          p.y + (rand() - 0.5) * 55,
          p.z,
        ] as [number, number, number],
        rot: [rand() * 6.28, rand() * 6.28] as [number, number],
        speed: 0.2 + rand() * 0.5,
        scale: 0.5 + rand() * 1.6,
      }
    })
  }, [])

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

    // core flare peaks at detonation parameter; flash light rims the debris with it
    const d = journey.damped - SN_U
    const intensity = Math.exp(-(d * d) / 0.0004)
    if (flare.current) {
      flare.current.scale.setScalar(2 + intensity * 26)
      ;(flare.current.material as SpriteMaterial).opacity = Math.min(0.25 + intensity * 0.75, 1)
    }
    if (flash.current) flash.current.intensity = intensity * 2600

    // tumble asteroids — skip when Gated hides the group (saves 36 matrix composes/frame outside window)
    const m = rocks.current
    if (m && m.visible) {
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
      {/* detonating core + its light (rims the debris as the blast peaks) */}
      <pointLight ref={flash} position={anchor} color="#ffc27a" intensity={0} distance={140} decay={1.6} />
      <sprite ref={flare} position={anchor}>
        <spriteMaterial map={map} blending={AdditiveBlending} depthWrite={false} toneMapped={false} fog={false} />
      </sprite>
      {/* gold nebula seeding behind the blast */}
      {[0.69, 0.73].map((u, i) => {
        const p = pointAt(u)
        return (
          <Nebula
            key={i}
            position={[p.x + (i - 0.5) * 30, p.y + (i === 0 ? 18 : -18), p.z]}
            size={80}
            colorA="#ffd75e"
            colorB="#ff8a3d"
            seed={11 + i * 3}
            opacity={0.3}
          />
        )
      })}
      {/* asteroid debris — near-black rock, rimmed by the flash at detonation */}
      <instancedMesh ref={rocks} args={[undefined, undefined, ROCKS]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4a4038" roughness={0.95} metalness={0.05} emissive="#241c14" emissiveIntensity={0.5} />
      </instancedMesh>
    </group>
  )
}
