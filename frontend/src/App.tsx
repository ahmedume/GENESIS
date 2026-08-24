import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { useScrollProgress } from './hooks/useScrollProgress'
import { Scene } from './three/Scene'
import { Hud } from './hud/Hud'

/** GPU-driver resets (Windows TDR) and tab-restore context loss otherwise leave a
 *  permanently black canvas — recover by reloading once, guarded against loops. */
function useContextLossGuard() {
  useEffect(() => {
    const onLost = (e: Event) => {
      e.preventDefault()
      if (!sessionStorage.getItem('genesis-gl-reload')) {
        sessionStorage.setItem('genesis-gl-reload', '1')
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
  useEffect(() => () => sessionStorage.removeItem('genesis-gl-reload'), [])

  return (
    <>
      <div className="fixed inset-0">
        <Canvas
          dpr={[1, 1.25]}
          camera={{ fov: 60, near: 0.1, far: 800 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Scene />
        </Canvas>
      </div>
      {/* Scroll track — total journey height per STORYBOARD.md */}
      <main className="relative h-[1600vh]" aria-label="GENESIS.EXE journey" />
      <Hud />
      <div className="grain" aria-hidden />
    </>
  )
}
