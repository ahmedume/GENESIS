import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Group } from 'three'
import { Nebula } from '../Nebulae'
import { pointAt } from '../../lib/cameraPath'

const COUNT = 1200

function disc() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

const PALETTE = ['#ff8a3d', '#ffd75e', '#ff4438', '#ff8a3d']

/** EPOCH 2 — THE QUARK SOUP: turbulent ember plasma swarm + heat-fog billboards (STORYBOARD E2). */
export function QuarkSoup() {
  const cloud = useRef<Group>(null)
  const map = useMemo(disc, [])

  // anchored to the journey curve so the swarm sits exactly where the camera travels (SDS §6)
  const center = useMemo(() => pointAt(0.21), [])
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = center.x + (Math.random() - 0.5) * 90
      arr[i + 1] = center.y + (Math.random() - 0.5) * 90
      arr[i + 2] = center.z + 50 - Math.random() * 100
    }
    return arr
  }, [center])

  const n1 = useMemo(() => { const p = pointAt(0.19); return [p.x - 30, p.y + 14, p.z] }, [])
  const n2 = useMemo(() => { const p = pointAt(0.23); return [p.x + 34, p.y - 18, p.z] }, [])

  useFrame((_, delta) => {
    if (cloud.current) cloud.current.rotation.y += delta * 0.04
  })

  return (
    <group>
      <group ref={cloud}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={map}
            size={2.6}
            color={PALETTE[0]}
            vertexColors={false}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={AdditiveBlending}
            sizeAttenuation
          />
        </points>
        {/* color variance via three tinted sub-clouds is overkill — one ember cloud + nebulae carries the look */}
      </group>
      <Nebula position={n1 as [number, number, number]} size={110} colorA="#ff4438" colorB="#ff8a3d" seed={3} opacity={0.4} />
      <Nebula position={n2 as [number, number, number]} size={130} colorA="#ff8a3d" colorB="#ffd75e" seed={7} opacity={0.35} />
    </group>
  )
}
