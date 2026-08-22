import { CameraRig } from './CameraRig'
import { Starfield } from './Particles'
import { Singularity } from './Singularity'
import { Ignition } from './Ignition'
import { Effects } from './Effects'
import { EpochDirector } from './EpochDirector'
import { Inflation } from './epochs/Inflation'

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
      <Inflation />
      {/* QuarkSoup · FirstLight · CosmicDawn land next (Phase 3b); later epochs Phase 4 */}
      <Effects />
    </>
  )
}
