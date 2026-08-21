import { useMemo } from 'react'
import { CameraRig } from './CameraRig'

type XYZ = [number, number, number]

/** Temporary corridor markers so Phase-1 motion reads on screen; replaced by real epochs (Phases 3–4). */
function PlaceholderWorld() {
  const starPositions = useMemo(() => {
    const positions = new Float32Array(600 * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 90
      positions[i + 1] = (Math.random() - 0.5) * 90
      positions[i + 2] = 12 - Math.random() * 520
    }
    return positions
  }, [])

  const beacons: XYZ[] = [
    [-14, 6, -80],
    [16, -9, -170],
    [-18, -5, -260],
    [13, 8, -350],
    [-11, -7, -430],
  ]

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.4} color="#00F0FF" transparent opacity={0.8} sizeAttenuation />
      </points>
      {beacons.map(([x, y, z]) => (
        <mesh key={z} position={[x, y, z]}>
          <sphereGeometry args={[2.4, 24, 24]} />
          <meshBasicMaterial color="#FF2E88" wireframe />
        </mesh>
      ))}
    </>
  )
}

/** Persistent canvas contents — mounts once, never unmounts ("global canvas" pattern). */
export function Scene() {
  return (
    <>
      <color attach="background" args={['#05010f']} />
      <fog attach="fog" args={['#05010f', 30, 160]} />
      <CameraRig />
      <PlaceholderWorld />
    </>
  )
}
