import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { journey } from '../hooks/useDampedProgress'
import { CameraRig } from './CameraRig'
import { Starfield } from './Particles'
import { Singularity } from './Singularity'
import { Ignition } from './Ignition'
import { Effects } from './Effects'
import { EpochDirector } from './EpochDirector'
import { Inflation } from './epochs/Inflation'
import { QuarkSoup } from './epochs/QuarkSoup'
import { FirstLight } from './epochs/FirstLight'
import { CosmicDawn } from './epochs/CosmicDawn'
import { GalaxyEra } from './epochs/GalaxyEra'
import { StellarForge } from './epochs/StellarForge'
import { EventHorizon } from './epochs/EventHorizon'
import { SolSystem } from './epochs/SolSystem'
import { lenis } from '../hooks/useScrollProgress'

/** Single visibility gate for all epochs — one useFrame instead of 7 (SRS §8). */
function EpochGate() {
  const gates = useRef<{ ref: Group; from: number; to: number }[]>([])

  useFrame(() => {
    // Drive Lenis + update raw progress in the SAME rAF as R3F (single frame loop)
    const l = lenis.current
    l?.raf(performance.now())
    journey.raw = Math.min(1, Math.max(0, l?.progress ?? 0))

    const p = journey.raw
    gates.current.forEach((g) => {
      if (g.ref) g.ref.visible = p >= g.from && p <= g.to
    })
  })

  return (
    <>
      <group ref={(r) => gates.current[0] = { ref: r!, from: 0.04, to: 0.22 }}>
        <Inflation />
      </group>
      <group ref={(r) => gates.current[1] = { ref: r!, from: 0.12, to: 0.32 }}>
        <QuarkSoup />
      </group>
      <group ref={(r) => gates.current[2] = { ref: r!, from: 0.2, to: 0.42 }}>
        <FirstLight />
      </group>
      <group ref={(r) => gates.current[3] = { ref: r!, from: 0.3, to: 0.54 }}>
        <CosmicDawn />
      </group>
      <group ref={(r) => gates.current[4] = { ref: r!, from: 0.42, to: 0.68 }}>
        <GalaxyEra />
      </group>
      <group ref={(r) => gates.current[5] = { ref: r!, from: 0.58, to: 0.8 }}>
        <StellarForge />
      </group>
      <group ref={(r) => gates.current[6] = { ref: r!, from: 0.7, to: 0.9 }}>
        <EventHorizon />
      </group>
      <group ref={(r) => gates.current[7] = { ref: r!, from: 0.8, to: 1.01 }}>
        <SolSystem />
      </group>
    </>
  )
}

/** Persistent canvas contents — mounts once, never unmounts ("global canvas" pattern). */
export function Scene() {
  return (
    <>
      <color attach="background" args={['#000005']} />
      <fog attach="fog" args={['#000005', 30, 160]} />
      <CameraRig />
      <EpochDirector />
      <Starfield />
      <Singularity />
      <Ignition />
      <EpochGate />
      <Effects />
    </>
  )
}
