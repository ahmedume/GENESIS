import { Component, type ReactNode, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScrollProgress } from './hooks/useScrollProgress'
import { deviceTierCeiling, QualityGovernor, TIER_DPR } from './hooks/useQualityTier'
import { useStore } from './state/store'
import { Scene } from './three/Scene'
import { Hud } from './hud/Hud'
import { useReducedMotion } from './hooks/useReducedMotion'

const TIER_CEILING = deviceTierCeiling()

/** Without this, a WebGL crash unmounts the ENTIRE React tree (blank page, no scroll track). */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-center">
          <h1 className="font-display text-xl tracking-[0.3em]">SIMULATION COLLAPSED</h1>
          <p className="text-secondary mt-4 max-w-md">
            The GPU context was lost. Reload to re-enter the timeline.
          </p>
          <button className="btn-ghost mt-10" onClick={() => location.reload()}>
            Reload Simulation
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

/** GPU-driver resets (Windows TDR) and tab-restore context loss otherwise leave a
 *  permanently black canvas — recover by reloading once, guarded against loops. */
function useContextLossGuard() {
  useEffect(() => {
    const storage = {
      get: (key: string) => {
        try { return sessionStorage.getItem(key) } catch { return null }
      },
      set: (key: string, value: string) => {
        try { sessionStorage.setItem(key, value) } catch { /* private mode */ }
      },
    }
    const onLost = (e: Event) => {
      e.preventDefault()
      if (!storage.get('genesis-gl-reload')) {
        storage.set('genesis-gl-reload', '1')
        location.reload()
      }
    }
    window.addEventListener('webglcontextlost', onLost)
    return () => window.removeEventListener('webglcontextlost', onLost)
  }, [])
}

/** Persistent WebGL world behind a fixed-height scroll track; DOM HUD overlays arrive in later phases. */
export default function App() {
  useScrollProgress()
  useContextLossGuard()
  useReducedMotion()
  const tier = useStore((s) => s.qualityTier)
  useEffect(() => () => {
    try { sessionStorage.removeItem('genesis-gl-reload') } catch { /* private mode */ }
  }, [])

  return (
    <>
      <div className="fixed inset-0">
        <CanvasErrorBoundary>
          <Canvas
            dpr={TIER_DPR[tier]}
            camera={{ fov: 60, near: 0.1, far: 800 }}
            // antialias:false — the EffectComposer renders into its own targets and blits to the
            // canvas, so canvas MSAA is never applied anyway; this just wastes memory bandwidth
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <Scene />
            <QualityGovernor ceiling={TIER_CEILING} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>
      {/* Scroll track — total journey height per STORYBOARD.md */}
      <main className="relative h-[1600vh]" aria-label="GENESIS.EXE journey" />
      <Hud />
      <div className="grain" aria-hidden />
    </>
  )
}
