import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Group, Mesh, Sprite, Points, Material } from 'three'
import { journey } from '../hooks/useDampedProgress'
import { TRANSITION_BAND } from '../data/epochs'
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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Apply opacity recursively to all materials in a group. */
interface FadeTarget {
  material: Material
  opacity: number
}

interface EpochGateState {
  ref: Group | null
  from: number
  to: number
  targets: FadeTarget[]
  lastOpacity: number
}

/** Cache fade targets once: traversing every epoch subtree every frame was needlessly expensive.
 * Preserve each material's authored opacity so cross-fades do not brighten translucent effects. */
function cacheFadeTargets(group: Group): FadeTarget[] {
  const targets: FadeTarget[] = []
  group.traverse((obj) => {
    if (!(obj instanceof Mesh || obj instanceof Sprite || obj instanceof Points)) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    mats.forEach((material: Material) => {
      if (material.transparent) targets.push({ material, opacity: material.opacity })
    })
  })
  return targets
}

/** Smooth cross-fade gate for all epochs — one useFrame instead of 7 (SRS §8). */
function EpochGate() {
  const gates = useRef<EpochGateState[]>([])

  useFrame(() => {
    const p = journey.raw
    gates.current.forEach((g) => {
      if (!g.ref) return
      if (g.targets.length === 0) g.targets = cacheFadeTargets(g.ref)
      const half = TRANSITION_BAND / 2
      // fade in over [from - half, from + half], fade out over [to - half, to + half]
      const fadeIn = smoothstep(g.from - half, g.from + half, p)
      const fadeOut = 1 - smoothstep(g.to - half, g.to + half, p)
      const opacity = clamp01(fadeIn * fadeOut)
      if (Math.abs(opacity - g.lastOpacity) < 0.001) return
      g.lastOpacity = opacity
      g.ref.visible = opacity > 0.001
      g.targets.forEach(({ material, opacity: baseOpacity }) => {
        material.opacity = baseOpacity * opacity
      })
    })
  })

  // Block-bodied ref callbacks — React 19 treats a returned value as a cleanup fn
  const gate = (i: number, from: number, to: number) => (r: Group | null) => {
    gates.current[i] = { ref: r, from, to, targets: [], lastOpacity: -1 }
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
