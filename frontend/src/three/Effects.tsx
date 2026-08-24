import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import type { BloomEffect } from 'postprocessing'
import { grade } from './EpochDirector'

/**
 * Postprocessing chain: Bloom → Vignette. Film grain lives in the DOM (.grain overlay in
 * global.css), so the Noise pass was cut — it duplicated that grain at the cost of a
 * full-screen fragment pass every frame. Quality tiers scale resolution, not this chain.
 */
export function Effects() {
  const bloom = useRef<BloomEffect>(null)

  useFrame(() => {
    if (bloom.current) bloom.current.intensity = grade.bloom
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} intensity={1.2} luminanceThreshold={0.75} luminanceSmoothing={0.1} radius={0.85} mipmapBlur />
      <Vignette darkness={0.55} offset={0.2} />
    </EffectComposer>
  )
}
