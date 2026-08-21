import { CatmullRomCurve3, Vector3 } from 'three'

type XYZ = [number, number, number]

/** Placeholder spine — straight dive down -Z. Epoch-specific control points land in Phases 3–4. */
const POINTS: XYZ[] = [
  [0, 0, 10],
  [0, 0, -60],
  [0, 0, -160],
  [0, 0, -300],
  [0, 0, -480],
]

export const journeyCurve = new CatmullRomCurve3(POINTS.map(([x, y, z]) => new Vector3(x, y, z)))

/** How far ahead along the curve the camera aims (SDS §6). */
export const LOOKAHEAD = 0.004
