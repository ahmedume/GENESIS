import { useEffect, useState } from 'react'
import { journey } from '../hooks/useDampedProgress'
import { rewindToSurface } from '../hooks/useScrollProgress'

const SHOW_AT = 0.945
const HIDE_BELOW = 0.92 // hysteresis so the plaque doesn't flicker at the boundary

/** Finale plaque (STORYBOARD E8) — copy verbatim; fades in as the crane settles (FR-11). */
export function FinalePlaque() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    let last = false
    const check = () => {
      const p = journey.raw
      // hysteresis equivalent of the old threshold pair; only touches React state on change
      const next = p > SHOW_AT || (p >= HIDE_BELOW && last)
      if (next !== last) {
        last = next
        setShow(next)
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col items-center justify-center text-center transition-opacity duration-[1200ms] ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <p className="font-terminal text-[clamp(16px,1.6vw,22px)] tracking-[0.3em]">T + 13,800,000,000 YEARS</p>
      <h2 className="ca-text font-display mt-3 text-[clamp(36px,7vw,88px)] leading-none">YOU ARE HERE</h2>
      <p className="text-secondary mt-6 max-w-[560px] px-6 text-[clamp(15px,1.4vw,18px)] leading-relaxed">
        Every atom you're made of was forged in the fire you just scrolled through.
      </p>
      <button className="btn-ghost mt-12" onClick={rewindToSurface}>
        ⟲ Rewind Time
      </button>
      <p className="text-secondary absolute bottom-[4vh] font-terminal text-base">
        GENESIS.EXE — built for the 3D Websites Hackathon · textures: NASA / Solar System Scope · HDRIs: Poly Haven
      </p>
    </div>
  )
}
