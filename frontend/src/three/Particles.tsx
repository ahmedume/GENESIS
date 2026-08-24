import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, PointsMaterial, SRGBColorSpace } from 'three'
import { motionPreference } from '../hooks/useReducedMotion'

/** Soft round sprite texture — kills the square-point cheapness. */
function disc() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const texture = new CanvasTexture(c)
  texture.colorSpace = SRGBColorSpace
  texture.generateMipmaps = false
  return texture
}

interface LayerSpec {
  count: number
  size: number
  color: string
  base: number
  speed: number
}

function seeded(seed: number) {
  let value = seed
  return () => (value = (value * 1664525 + 1013904223) % 4294967296) / 4294967296
}

const LAYERS: LayerSpec[] = [
  { count: 1400, size: 0.35, color: '#cfe0ff', base: 0.65, speed: 0.7 }, // dim far field
  { count: 500, size: 0.7, color: '#ffe9c9', base: 0.8, speed: 1.1 }, // warm mid stars
  { count: 130, size: 1.3, color: '#ffffff', base: 0.95, speed: 1.6 }, // bright hero stars
]

const CORRIDOR_DEPTH = 575

function StarLayer({ count, size, color, base, speed }: LayerSpec) {
  const mat = useRef<PointsMaterial>(null)
  const positions = useMemo(() => {
    const random = seeded(count * 17)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (random() - 0.5) * 120
      arr[i + 1] = (random() - 0.5) * 120
      arr[i + 2] = 15 - random() * CORRIDOR_DEPTH
    }
    return arr
  }, [count])
  const map = useMemo(() => disc(), [])

  useFrame(({ clock }) => {
    if (mat.current) mat.current.opacity = base + (motionPreference.reduced ? 0 : Math.sin(clock.elapsedTime * speed) * 0.07)
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={map}
        size={size}
        color={color}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Corridor starfield: three temperature layers with slow independent twinkle. */
export function Starfield() {
  return (
    <>
      {LAYERS.map((l) => (
        <StarLayer key={l.color} {...l} />
      ))}
    </>
  )
}
