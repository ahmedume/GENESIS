import { useEffect, useState } from 'react'
import { journey } from '../hooks/useDampedProgress'
import { useStore } from '../state/store'
import { BootScreen } from './BootScreen'
import { FinalePlaque } from './FinalePlaque'
import { EpochLabel } from './EpochLabel'
import { CosmicClock } from './CosmicClock'
import { EPOCHS } from '../data/epochs'
import { lenis } from '../hooks/useScrollProgress'
import { useReducedMotion } from '../hooks/useReducedMotion'

const FADE_AT = 0.02 // matches IGNITE_AT — title yields as the universe begins

function HeroOverlay() {
  const booted = useStore((s) => s.booted)
  const ignited = useStore((s) => s.ignited)
  const reduced = useReducedMotion()
  const [faded, setFaded] = useState(false)

  useEffect(() => {
    if (ignited) return
    let raf = 0
    const check = () => {
      // one-way fade: stop polling entirely once past the threshold instead of
      // running a perpetual setState loop that competes with the render loop
      if (journey.raw > FADE_AT) {
        setFaded(true)
        return
      }
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
      <h1 className="ca-text max-w-[calc(100vw-2rem)] px-2 font-display text-center text-[clamp(34px,9vw,128px)] leading-[0.95] tracking-[0.06em] text-balance">
        GENESIS
      </h1>
      <p className="text-secondary mt-5 text-[clamp(15px,1.6vw,20px)] tracking-wide">13.8 billion years. One scroll.</p>
      <a className="btn-ghost mt-8 px-4 text-xs no-underline" href="/observatory">
        Enter Observatory
      </a>
      {!reduced && <div className="absolute bottom-[6vh] flex flex-col items-center gap-2">
        <svg width="18" height="12" viewBox="0 0 18 12" className="animate-cue" aria-hidden>
          <path d="M2 2l7 7 7-7" fill="none" stroke="var(--signal-cyan)" strokeWidth="2" />
        </svg>
        <span className="font-terminal text-lg">SCROLL TO BEGIN TIME</span>
      </div>}
    </div>
  )
}

function ReducedMotionNav() {
  const reduced = useReducedMotion()
  const booted = useStore((s) => s.booted)
  if (!reduced || !booted) return null

  return (
    <nav className="fixed bottom-5 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-1 overflow-x-auto overflow-y-hidden border border-white/15 bg-black/80 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Jump to epoch">
      {EPOCHS.map((epoch) => (
        <button
          key={epoch.id}
          className="min-h-11 shrink-0 px-3 font-terminal text-base text-secondary transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300"
          onClick={() => {
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
            lenis.current?.scrollTo(epoch.scrollStart * maxScroll, { duration: 0 })
          }}
        >
          {epoch.label}
        </button>
      ))}
    </nav>
  )
}

function AutoScrollButton() {
  const booted = useStore((s) => s.booted)
  const autoScroll = useStore((s) => s.autoScroll)
  const setAutoScroll = useStore((s) => s.setAutoScroll)
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    let last = -1
    const check = () => {
      const next = Math.round(journey.raw * 1000) / 1000
      if (next !== last) {
        last = next
        setProgress(next)
      }
      raf = requestAnimationFrame(check)
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])
  if (!booted || reduced || progress > 0.94) return null

  return (
    <button
      className="btn-ghost fixed bottom-5 right-5 z-40 min-h-11 px-4 text-xs sm:right-8"
      aria-pressed={autoScroll}
      onClick={() => setAutoScroll(!autoScroll)}
    >
      {autoScroll ? 'Pause Journey' : 'Auto Scroll'}
    </button>
  )
}

/** Fixed DOM layer above the canvas: boot gate + hero lockup + finale plaque. */
export function Hud() {
  return (
    <>
      <BootScreen />
      <HeroOverlay />
      <EpochLabel />
      <CosmicClock />
      <ReducedMotionNav />
      <AutoScrollButton />
      <FinalePlaque />
    </>
  )
}
