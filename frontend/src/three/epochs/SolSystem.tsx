import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  Group,
  InstancedMesh,
  Object3D,
  SRGBColorSpace,
  TextureLoader,
} from 'three'
import { pointAt } from '../../lib/cameraPath'
import { journey } from '../../hooks/useDampedProgress'
import { useStore } from '../../state/store'

const SUN_U = 0.895 // anchored inside the finale window — the system assembles AHEAD of
// the camera during 0.84–0.95, then the crane reveal looks down on it at >0.97
const loader = new TextureLoader()
const ringTexture = loader.load('/assets/textures/2k_saturn_ring_alpha.png')
ringTexture.colorSpace = SRGBColorSpace
ringTexture.anisotropy = 8

function seeded(seed: number) {
  let value = seed
  return () => (value = (value * 1664525 + 1013904223) % 4294967296) / 4294967296
}

function proceduralPlanetTexture(base: string, accent: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, accent)
  gradient.addColorStop(0.48, base)
  gradient.addColorStop(1, '#10131c')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // Low-frequency latitude bands give the procedural worlds visual depth at a
  // fraction of the cost of another downloaded 2K map.
  for (let y = 14; y < canvas.height; y += 22) {
    ctx.fillStyle = `rgba(255,255,255,${0.035 + ((y / 22) % 3) * 0.012})`
    ctx.fillRect(0, y, canvas.width, 6)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

/** Real NASA / Solar System Scope maps (CC-BY/PD) — see ASSETS.md §1. */
function useTex(file?: string) {
  return useMemo(() => {
    if (!file) return null
    const t = loader.load(`/assets/textures/${file}`)
    t.colorSpace = SRGBColorSpace
    // Planet maps are viewed at grazing angles during the crane reveal; keep the
    // texture crisp without increasing geometry or post-processing cost.
    t.anisotropy = 8
    t.generateMipmaps = true
    return t
  }, [file])
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

interface PlanetSpec {
  file?: string
  fallback: string
  radius: number
  orbitR: number
  angle0: number
  snapAt: number
  roughness?: number
  bandColor?: string
  ring?: boolean
  atmosphere?: boolean
  atmosphereColor?: string
  moon?: boolean
}

// snap beats staggered per STORYBOARD E8 ("planets snap into orbit one-by-one, 150ms apart" ≈ scroll steps)
const PLANETS: PlanetSpec[] = [
  { fallback: '#8a8275', bandColor: '#c6b9a7', radius: 0.55, orbitR: 15, angle0: 4.6, snapAt: 0.846, roughness: 0.92 },
  { fallback: '#d9a36e', bandColor: '#f3d39a', radius: 1.0, orbitR: 22, angle0: 2.3, snapAt: 0.852, roughness: 0.88 },
  { file: '2k_mars.jpg', fallback: '#c1440e', radius: 1.3, orbitR: 30, angle0: 1.1, snapAt: 0.858 },
  { file: '2k_earth_daymap.jpg', fallback: '#38bdf8', radius: 1.7, orbitR: 39, angle0: 3.6, snapAt: 0.87, atmosphere: true, atmosphereColor: '#58b9ff', moon: true },
  { file: '2k_jupiter.jpg', fallback: '#c9a06a', radius: 4.4, orbitR: 52, angle0: 5.2, snapAt: 0.882 },
  { file: '2k_saturn.jpg', fallback: '#d8b877', radius: 3.6, orbitR: 66, angle0: 0.6, snapAt: 0.894, ring: true },
  { fallback: '#77b9c6', bandColor: '#c9f6ff', radius: 2.2, orbitR: 81, angle0: 4.0, snapAt: 0.906, atmosphere: true, atmosphereColor: '#8ee9ff' },
  { fallback: '#4568c7', bandColor: '#728fea', radius: 2.1, orbitR: 95, angle0: 1.8, snapAt: 0.918, atmosphere: true, atmosphereColor: '#6e89ff' },
]

function Planet({ spec }: { spec: PlanetSpec }) {
  const pivot = useRef<Group>(null)
  const moonPivot = useRef<Group>(null)
  const map = useTex(spec.file)
  const fallbackMap = useMemo(
    () => spec.file ? null : proceduralPlanetTexture(spec.fallback, spec.bandColor ?? spec.fallback),
    [spec.bandColor, spec.fallback, spec.file],
  )
  const surfaceMap = map ?? fallbackMap
  const moonMap = useTex(spec.moon ? '2k_moon.jpg' : undefined)

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
          <meshStandardMaterial map={surfaceMap} color={surfaceMap ? '#ffffff' : spec.fallback} roughness={spec.roughness ?? 0.85} metalness={0} />
        </mesh>
        {spec.atmosphere && (
          <mesh>
            <sphereGeometry args={[spec.radius * 1.05, 32, 32]} />
            <meshBasicMaterial color={spec.atmosphereColor ?? '#58b9ff'} transparent opacity={0.2} side={BackSide} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        )}
        {spec.ring && (
          <mesh rotation={[Math.PI / 2.25, 0.2, 0]}>
            <ringGeometry args={[spec.radius * 1.45, spec.radius * 2.3, 64]} />
            <meshBasicMaterial
              map={ringTexture}
              color="#e3cfaa"
              transparent
              opacity={0.82}
              side={DoubleSide}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}
        {spec.moon && (
          <group ref={moonPivot}>
            <mesh position={[spec.radius * 2.6, 0.4, 0]}>
              <sphereGeometry args={[0.45, 24, 24]} />
              <meshStandardMaterial map={moonMap} roughness={0.95} color={moonMap ? '#ffffff' : '#8f8f8f'} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}

const BELT_COUNTS = { low: 64, medium: 112, high: 180 } as const

/** A single instanced belt adds scale and depth to the system for one draw call. */
function AsteroidBelt() {
  const tier = useStore((state) => state.qualityTier)
  const count = BELT_COUNTS[tier]
  const belt = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const rocks = useMemo(() => {
    const random = seeded(719)
    return Array.from({ length: count }, () => ({
      radius: 42 + random() * 7,
      angle: random() * Math.PI * 2,
      height: (random() - 0.5) * 1.8,
      scale: 0.12 + random() * 0.34,
    }))
  }, [count])

  useLayoutEffect(() => {
    if (!mesh.current) return
    rocks.forEach((rock, index) => {
      dummy.position.set(Math.cos(rock.angle) * rock.radius, rock.height, Math.sin(rock.angle) * rock.radius)
      dummy.rotation.set(rock.angle * 0.7, rock.angle * 1.3, rock.angle * 0.4)
      dummy.scale.setScalar(rock.scale)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [dummy, rocks])

  useFrame((_, delta) => {
    if (!belt.current || journey.damped < 0.84) return
    belt.current.rotation.y += delta * 0.012
  })

  return (
    <group ref={belt} rotation={[0.32, 0, -0.08]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#766758" roughness={0.96} metalness={0.02} />
      </instancedMesh>
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
    const texture = new CanvasTexture(c)
    texture.colorSpace = SRGBColorSpace
    texture.generateMipmaps = false
    return texture
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
      <sprite scale={[32, 32, 1]}>
        <spriteMaterial map={glowMap} blending={AdditiveBlending} depthWrite={false} opacity={0.7} toneMapped={false} />
      </sprite>

      {/* the system plane */}
      <group ref={system} rotation={[0.32, 0, -0.08]}>
        <AsteroidBelt />
        {PLANETS.map((p) => (
          <Planet key={`${p.orbitR}-${p.angle0}`} spec={p} />
        ))}
      </group>
    </group>
  )
}
