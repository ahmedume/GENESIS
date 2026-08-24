import { useEffect, useState } from 'react'

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
export const motionPreference = { reduced: false }

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(reducedMotionQuery).matches
}

motionPreference.reduced = prefersReducedMotion()

/** Live preference, used by DOM controls and long-lived WebGL components. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    const update = () => {
      motionPreference.reduced = media.matches
      setReduced(media.matches)
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}
