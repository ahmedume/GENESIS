import { useRef, type ReactNode } from 'react'
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

/** Mount-window optimization (pulled forward from Phase 6): only epochs near the
 *  camera stay mounted-visible — cuts per-frame draw load ~5x so mid/low GPUs keep
 *  pace with the damping loop. Windows overlap transition bands generously; raw
 *  leads damped, so content is live before the camera arrives. */
function Gated({ from, to, children }: { from: number; to: number; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.visible = journey.raw >= from && journey.raw <= to
  })
  return <group ref={ref}>{children}</group>
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
      <Gated from={0.04} to={0.22}>
        <Inflation />
      </Gated>
      <Gated from={0.12} to={0.32}>
        <QuarkSoup />
      </Gated>
      <Gated from={0.2} to={0.42}>
        <FirstLight />
      </Gated>
      <Gated from={0.3} to={0.54}>
        <CosmicDawn />
      </Gated>
      <Gated from={0.42} to={0.68}>
        <GalaxyEra />
      </Gated>
      <Gated from={0.58} to={0.8}>
        <StellarForge />
      </Gated>
      <Gated from={0.7} to={0.9}>
        <EventHorizon />
      </Gated>
      <Gated from={0.8} to={1.01}>
        <SolSystem />
      </Gated>
      <Effects />
    </>
  )
}
