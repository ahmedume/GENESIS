import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import type { BloomEffect } from 'postprocessing'
import { grade } from './EpochDirector'

/**
 * Postprocessing chain (DESIGN-SYSTEM §5): Bloom → Noise(grain) → Vignette.
 * Bloom strength follows the EpochDirector grade table; ChromaticAberration/DOF
 * envelopes arrive with their set-piece beats (Phases 3–4); tier gating lands Phase 6.
 */
export function Effects() {
  const bloom = useRef<BloomEffect>(null)

  useFrame(() => {
    if (bloom.current) bloom.current.intensity = grade.bloom
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} intensity={1.2} luminanceThreshold={0.75} luminanceSmoothing={0.1} radius={0.85} mipmapBlur />
      <Noise opacity={0.045} premultiply />
      <Vignette darkness={0.55} offset={0.2} />
    </EffectComposer>
  )
}
