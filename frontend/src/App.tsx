import { Canvas } from '@react-three/fiber'
import { useScrollProgress } from './hooks/useScrollProgress'
import { Scene } from './three/Scene'
import { Hud } from './hud/Hud'

/** Persistent WebGL world behind a fixed-height scroll track; DOM HUD overlays arrive in later phases. */
export default function App() {
  useScrollProgress()

  return (
    <>
      <div className="fixed inset-0">
        <Canvas dpr={[1, 1.75]} camera={{ fov: 60, near: 0.1, far: 800 }} gl={{ antialias: true }}>
          <Scene />
        </Canvas>
      </div>
      {/* Scroll track — total journey height per STORYBOARD.md */}
      <main className="relative h-[1600vh]" aria-label="GENESIS.EXE journey" />
      <Hud />
    </>
  )
}
