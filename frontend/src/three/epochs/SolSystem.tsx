import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  Group,
  SRGBColorSpace,
  TextureLoader,
} from 'three'
import { pointAt } from '../../lib/cameraPath'
import { journey } from '../../hooks/useDampedProgress'

const SUN_U = 0.895 // anchored inside the finale window — the system assembles AHEAD of
// the camera during 0.84–0.95, then the crane reveal looks down on it at >0.97
const loader = new TextureLoader()

/** Real NASA / Solar System Scope maps (CC-BY/PD) — see ASSETS.md §1. */
function useTex(file: string) {
  return useMemo(() => {
    const t = loader.load(`/assets/textures/${file}`)
    t.colorSpace = SRGBColorSpace
    return t
  }, [file])
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

interface PlanetSpec {
  file: string
  fallback: string
  radius: number
  orbitR: number
  angle0: number
  snapAt: number
  ring?: boolean
  atmosphere?: boolean
  moon?: boolean
}

// snap beats staggered per STORYBOARD E8 ("planets snap into orbit one-by-one, 150ms apart" ≈ scroll steps)
const PLANETS: PlanetSpec[] = [
  { file: '2k_mars.jpg', fallback: '#c1440e', radius: 1.3, orbitR: 30, angle0: 1.1, snapAt: 0.858 },
  { file: '2k_earth_daymap.jpg', fallback: '#38bdf8', radius: 1.7, orbitR: 39, angle0: 3.6, snapAt: 0.87, atmosphere: true, moon: true },
  { file: '2k_jupiter.jpg', fallback: '#c9a06a', radius: 4.4, orbitR: 52, angle0: 5.2, snapAt: 0.882 },
  { file: '2k_saturn.jpg', fallback: '#d8b877', radius: 3.6, orbitR: 66, angle0: 0.6, snapAt: 0.894, ring: true },
]

function Planet({ spec }: { spec: PlanetSpec }) {
  const pivot = useRef<Group>(null)
  const moonPivot = useRef<Group>(null)
  const map = useTex(spec.file)

  useFrame(({ clock }, delta) => {
    if (moonPivot.current) moonPivot.current.rotation.y += delta * 0.9
    if (pivot.current) {
      pivot.current.rotation.y = clock.elapsedTime * 0.15
      // scroll-scrubbed snap-in with gravitational settle overshoot
      const k = clamp01((journey.damped - spec.snapAt) / 0.012)
      const settle = k === 0 ? 0 : k < 1 ? 1 + Math.sin(k * Math.PI) * 0.35 : 1
      pivot.current.scale.setScalar(settle)
      pivot.current.visible = k > 0
    }
  })

  return (
    <group position={[Math.cos(spec.angle0) * spec.orbitR, 0, Math.sin(spec.angle0) * spec.orbitR]}>
      <group ref={pivot}>
        <mesh>
          <sphereGeometry args={[spec.radius, 48, 48]} />
          <meshStandardMaterial map={map ?? null} color={map ? '#ffffff' : spec.fallback} roughness={0.85} metalness={0} />
        </mesh>
        {spec.atmosphere && (
          <mesh>
            <sphereGeometry args={[spec.radius * 1.05, 32, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.22} side={BackSide} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        )}
        {spec.ring && (
          <mesh rotation={[Math.PI / 2.25, 0.2, 0]}>
            <ringGeometry args={[spec.radius * 1.45, spec.radius * 2.3, 64]} />
            <meshBasicMaterial color="#d8b877" transparent opacity={0.75} side={DoubleSide} depthWrite={false} />
          </mesh>
        )}
        {spec.moon && (
          <group ref={moonPivot}>
            <mesh position={[spec.radius * 2.6, 0.4, 0]}>
              <sphereGeometry args={[0.45, 24, 24]} />
              <meshStandardMaterial map={useTex('2k_moon.jpg')} roughness={0.95} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}

/** EPOCH 8 — YOU ARE HERE: real-textured solar system assembling around a physically-lit sun
 *  (STORYBOARD E8). The crane reveal lives in the journey spline's final points. */
export function SolSystem() {
  const sunGroup = useRef<Group>(null)
  const system = useRef<Group>(null)

  const anchor = useMemo(() => pointAt(SUN_U), [])
  const sunMap = useTex('2k_sun.jpg')
  const glowMap = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
    g.addColorStop(0, 'rgba(255,241,82,0.9)')
    g.addColorStop(0.4, 'rgba(255,180,60,0.35)')
    g.addColorStop(1, 'rgba(255,150,50,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new CanvasTexture(c)
  }, [])

  useFrame((_, delta) => {
    if (system.current) system.current.rotation.y += delta * 0.02
  })

  return (
    <group ref={sunGroup} position={[anchor.x, anchor.y + 2, anchor.z]}>
      {/* the star */}
      <pointLight intensity={900} distance={320} decay={1.8} color="#fff2d5" />
      <mesh>
        <sphereGeometry args={[7, 64, 64]} />
        <meshBasicMaterial map={sunMap ?? null} color={sunMap ? '#ffffff' : '#ffd75e'} toneMapped={false} />
      </mesh>
      <sprite scale={[46, 46, 1]}>
        <spriteMaterial map={glowMap} blending={AdditiveBlending} depthWrite={false} opacity={0.85} fog={false} />
      </sprite>

      {/* the system plane */}
      <group ref={system} rotation={[0.32, 0, -0.08]}>
        {PLANETS.map((p) => (
          <Planet key={p.file} spec={p} />
        ))}
      </group>
    </group>
  )
}
