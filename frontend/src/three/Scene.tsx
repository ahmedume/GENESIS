import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
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

/** Single visibility gate for all epochs — one useFrame instead of 7 (SRS §8). */
function EpochGate() {
  const gates = useRef<{ ref: Group; from: number; to: number }[]>([])

  useFrame(() => {
    const p = journey.raw
    gates.current.forEach((g) => {
      if (g.ref) g.ref.visible = p >= g.from && p <= g.to
    })
  })

  // Block-bodied ref callbacks — React 19 treats a returned value as a cleanup fn
  const gate = (i: number, from: number, to: number) => (r: Group | null) => {
    gates.current[i] = { ref: r as Group, from, to }
  }

  return (
    <>
      <group ref={gate(0, 0.04, 0.22)}>
        <Inflation />
      </group>
      <group ref={gate(1, 0.12, 0.32)}>
        <QuarkSoup />
      </group>
      <group ref={gate(2, 0.2, 0.42)}>
        <FirstLight />
      </group>
      <group ref={gate(3, 0.3, 0.54)}>
        <CosmicDawn />
      </group>
      <group ref={gate(4, 0.42, 0.68)}>
        <GalaxyEra />
      </group>
      <group ref={gate(5, 0.58, 0.8)}>
        <StellarForge />
      </group>
      <group ref={gate(6, 0.7, 0.9)}>
        <EventHorizon />
      </group>
      <group ref={gate(7, 0.8, 1.01)}>
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
      {/* Compile every gated epoch's shaders/programs up front (behind the boot screen) —
          otherwise each epoch stalls the frame the first time it scrolls into view */}
      <Preload all />
      <Effects />
    </>
  )
}
