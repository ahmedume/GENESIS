import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useStore } from '../state/store'

const LINES = [
  'initializing fundamental forces........ ok',
  'seeding quantum fluctuations.... ok',
  'calibrating spacetime grid...... ok',
]
const MIN_HOLD_MS = 900
const STALL_MS = 8000

/** CRT-terminal boot gate (FR-06): streams lines + real progress, then fades to reveal the hero. */
export function BootScreen() {
  const { progress } = useProgress()
  const booted = useStore((s) => s.booted)
  const setBooted = useStore((s) => s.setBooted)
  const [shown, setShown] = useState(0)
  const [stalled, setStalled] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (shown >= LINES.length) return
    const id = setTimeout(() => setShown((n) => n + 1), 420)
    return () => clearTimeout(id)
  }, [shown])

  useEffect(() => {
    const id = setTimeout(() => setStalled(true), STALL_MS)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (shown >= LINES.length && !booted) {
      const id = setTimeout(() => setBooted(true), MIN_HOLD_MS)
      return () => clearTimeout(id)
    }
  }, [shown, booted, setBooted])

  useEffect(() => {
    if (!booted) return
    const id = setTimeout(() => setGone(true), 450) // fade-through-black exit
    return () => clearTimeout(id)
  }, [booted])

  if (gone) return null
  const pct = Math.max(progress, Math.round((Math.min(shown, LINES.length) / LINES.length) * 100))

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-center bg-black px-[8vw] transition-opacity duration-[400ms] ${
        booted ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className="font-display text-2xl tracking-[0.3em]">GENESIS.EXE</h1>
      <div className="font-terminal mt-6 text-xl leading-relaxed">
        {LINES.slice(0, shown).map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="mt-4">loading universal simulation... {pct}%</p>
      </div>
      <div className="mt-4 h-px w-full bg-white/10">
        <div className="h-px transition-all duration-300" style={{ width: `${pct}%`, background: 'var(--signal-cyan)' }} />
      </div>
      {stalled && !booted && (
        <button
          onClick={() => setBooted(true)}
          className="btn-ghost mt-10 w-fit"
        >
          Enter Anyway
        </button>
      )}
    </div>
  )
}
