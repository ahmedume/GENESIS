import { create } from 'zustand'

export type QualityTier = 'low' | 'medium' | 'high'

interface AppState {
  booted: boolean
  ignited: boolean
  audioEnabled: boolean
  scrollProgress: number
  qualityTier: QualityTier
  autoScroll: boolean
  setBooted: (booted: boolean) => void
  setIgnited: (ignited: boolean) => void
  toggleAudio: () => void
  setQualityTier: (tier: QualityTier) => void
  setAutoScroll: (enabled: boolean) => void
}

/** Global UI state only. Per-frame values flow through `journey` (useDampedProgress), never here. */
export const useStore = create<AppState>((set) => ({
  booted: false,
  ignited: false,
  audioEnabled: false,
  scrollProgress: 0,
  qualityTier: 'medium', // conservative boot — governor upgrades capable machines after 3 good seconds
  autoScroll: false,
  setBooted: (booted) => set({ booted }),
  setIgnited: (ignited) => set({ ignited }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),
}))
