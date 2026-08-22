import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Group } from 'three'
import { pointAt } from '../../lib/cameraPath'

function glow(inner: string, outer: string) {
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

/** Log-spiral arm star field — denser core, looser arms, thin disc. */
function armPositions(count: number, arms: number): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = Math.pow(Math.random(), 0.65)
    const r = 1 + t * 15
    const spread = (Math.random() - 0.5) * (0.5 + t * 2.4)
    const ang = ((i % arms) / arms) * Math.PI * 2 + t * 3.6 + spread
    arr[i * 3] = Math.cos(ang) * r
    arr[i * 3 + 1] = (Math.random() - 0.5) * (1.7 - t * 1.1)
    arr[i * 3 + 2] = Math.sin(ang) * r
  }
  return arr
}

interface GalaxySpec {
  u: number
  offset: [number, number]
  scale: number
  tilt: [number, number, number]
  speed: number
}

const GALAXIES: GalaxySpec[] = [
  { u: 0.495, offset: [-22, 10], scale: 1.15, tilt: [0.9, 0.2, 0.4], speed: 0.05 },
  { u: 0.53, offset: [24, -12], scale: 0.85, tilt: [0.5, 1.1, 0], speed: 0.04 },
  { u: 0.565, offset: [-18, -16], scale: 1.35, tilt: [1.3, 0.5, 0.7], speed: 0.03 },
  { u: 0.6, offset: [20, 14], scale: 0.95, tilt: [0.3, 0.8, 0.2], speed: 0.06 },
]

function SpiralGalaxy({ spec }: { spec: GalaxySpec }) {
  const group = useRef<Group>(null)
  const positions = useMemo(() => armPositions(2600, 2), [])
  const stars = useMemo(() => glow('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), [])
  const core = useMemo(() => glow('rgba(255,217,160,1)', 'rgba(255,190,120,0)'), [])
  const base = useMemo(() => {
    const p = pointAt(spec.u)
    return [p.x + spec.offset[0], p.y + spec.offset[1], p.z] as [number, number, number]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * spec.speed
  })

  return (
    <group position={base} rotation={spec.tilt} scale={spec.scale}>
      <group ref={group}>
        {/* blue-white arm stars */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={stars}
            size={0.55}
            color="#cfe0ff"
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={AdditiveBlending}
            sizeAttenuation
            fog={false}
          />
        </points>
        {/* warm core */}
        <sprite scale={[7, 7, 1]}>
          <spriteMaterial map={core} blending={AdditiveBlending} depthWrite={false} fog={false} />
        </sprite>
      </group>
    </group>
  )
}

/** EPOCH 5 — THE GALAXY ERA: realistic spiral galaxies the camera weaves between (STORYBOARD E5). */
export function GalaxyEra() {
  return (
    <>
      {GALAXIES.map((g, i) => (
        <SpiralGalaxy key={i} spec={g} />
      ))}
    </>
  )
}
