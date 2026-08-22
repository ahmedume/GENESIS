import { useMemo } from 'react'
import { CameraRig } from './CameraRig'
import { Singularity } from './Singularity'
import { Ignition } from './Ignition'
import { Effects } from './Effects'

/** Temporary corridor stars so travel reads on screen; replaced by real epochs (Phases 3–4). */
function PlaceholderStars({ count = 600 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 90
      arr[i + 1] = (Math.random() - 0.5) * 90
      arr[i + 2] = 12 - Math.random() * 520
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.4} color="#cfe6ff" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

/** Persistent canvas contents — mounts once, never unmounts ("global canvas" pattern). */
export function Scene() {
  return (
    <>
      <color attach="background" args={['#000005']} />
      <fog attach="fog" args={['#000005', 30, 160]} />
      <CameraRig />
      <PlaceholderStars />
      <Singularity />
      <Ignition />
      <Effects />
    </>
  )
}
