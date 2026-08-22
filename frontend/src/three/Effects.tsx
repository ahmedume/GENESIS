import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

/**
 * Postprocessing base stack (Phase 2): Bloom + Vignette per DESIGN-SYSTEM §5.
 * ACES tone mapping + exposure are driven by R3F defaults and the Ignition envelope.
 * ChromaticAberration / Noise passes arrive with later phases; tier gating in Phase 6.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      {/* threshold/strength/radius per grade table — Singularity epoch values */}
      <Bloom intensity={1.2} luminanceThreshold={0.75} luminanceSmoothing={0.1} radius={0.85} mipmapBlur />
      <Vignette darkness={0.55} offset={0.2} />
    </EffectComposer>
  )
}
