import { create } from 'zustand'

export type QualityTier = 'low' | 'medium' | 'high'

interface AppState {
  booted: boolean
  audioEnabled: boolean
  scrollProgress: number
  qualityTier: QualityTier
  setBooted: (booted: boolean) => void
  toggleAudio: () => void
  setQualityTier: (tier: QualityTier) => void
}

/** Global UI state only. Per-frame values flow through `journey` (useDampedProgress), never here. */
export const useStore = create<AppState>((set) => ({
  booted: false,
  audioEnabled: false,
  scrollProgress: 0,
  qualityTier: 'high',
  setBooted: (booted) => set({ booted }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setQualityTier: (qualityTier) => set({ qualityTier }),
}))
