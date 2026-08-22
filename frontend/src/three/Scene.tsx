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
      {/* EPOCHS 1–4 (Phase 3); galaxy era onward lands in Phase 4 */}
      <Inflation />
      <QuarkSoup />
      <FirstLight />
      <CosmicDawn />
      <Effects />
    </>
  )
}
