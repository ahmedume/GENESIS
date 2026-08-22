import { useEffect, useState } from 'react'
import { journey } from '../hooks/useDampedProgress'
import { useStore } from '../state/store'
import { BootScreen } from './BootScreen'

const FADE_AT = 0.02 // matches IGNITE_AT — title yields as the universe begins

function HeroOverlay() {
  const booted = useStore((s) => s.booted)
  const ignited = useStore((s) => s.ignited)
  const [faded, setFaded] = useState(false)

  useEffect(() => {
    if (ignited) return
    let raf = 0
    const check = () => {
      if (journey.raw > FADE_AT) setFaded(true)
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [ignited])

  if (!booted) return null

  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-700 ${
        faded || ignited ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className="ca-text font-display text-center text-[clamp(44px,9vw,128px)] leading-none tracking-[0.06em]">
        GENESIS.EXE
      </h1>
      <p className="text-secondary mt-5 text-[clamp(15px,1.6vw,20px)] tracking-wide">13.8 billion years. One scroll.</p>
      <div className="absolute bottom-[6vh] flex flex-col items-center gap-2">
        <svg width="18" height="12" viewBox="0 0 18 12" className="animate-cue" aria-hidden>
          <path d="M2 2l7 7 7-7" fill="none" stroke="var(--signal-cyan)" strokeWidth="2" />
        </svg>
        <span className="font-terminal text-lg">SCROLL TO BEGIN TIME</span>
      </div>
    </div>
  )
}

/** Fixed DOM layer above the canvas: boot gate + hero lockup (more instruments land in Phase 5). */
export function Hud() {
  return (
    <>
      <BootScreen />
      <HeroOverlay />
    </>
  )
}
