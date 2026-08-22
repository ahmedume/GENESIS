import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Group, Mesh } from 'three'
import { useStore } from '../state/store'

const POSITION: [number, number, number] = [0, 0, -18]

/** Canvas radial-gradient sprite texture — cheap glow without extra assets. */
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

/**
 * The Singularity (STORYBOARD hero): white-hot pulsing core, breathing halo,
 * one anamorphic streak. Dims to 45% once the journey ignites.
 */
export function Singularity() {
  const core = useRef<Mesh>(null)
  const halo = useRef<Group>(null)
  const glow = useMemo(() => glowTexture('rgba(255,247,230,1)', 'rgba(255,247,230,0)'), [])
  const streak = useMemo(() => glowTexture('rgba(255,247,230,0.9)', 'rgba(255,247,230,0)'), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = 1 + Math.sin(t * 1.4) * 0.06
    if (core.current) core.current.scale.setScalar(pulse)
    if (halo.current) {
      const dim = useStore.getState().ignited ? 0.45 : 1
      halo.current.scale.setScalar((1 + Math.sin(t * 1.4 + 0.8) * 0.08) * dim)
    }
  })

  return (
    <group position={POSITION}>
      <mesh ref={core}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#fff7e6" toneMapped={false} />
      </mesh>
      <group ref={halo}>
        <sprite scale={[16, 16, 1]}>
          <spriteMaterial map={glow} blending={AdditiveBlending} depthWrite={false} opacity={0.85} />
        </sprite>
        <sprite scale={[52, 1.8, 1]}>
          <spriteMaterial map={streak} blending={AdditiveBlending} depthWrite={false} opacity={0.3} />
        </sprite>
      </group>
    </group>
  )
}
