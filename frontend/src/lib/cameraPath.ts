import { CatmullRomCurve3, Vector3 } from 'three'

type XYZ = [number, number, number]

/** Gentle S-curve spine — cinematic travel instead of a straight dive.
 *  Epoch-true control points land in Phases 3–4. */
const POINTS: XYZ[] = [
  [0, 0, 10],
  [5, -2, -70],
  [-9, 4, -170],
  [10, -6, -300],
  [-5, 4, -480],
]

export const journeyCurve = new CatmullRomCurve3(POINTS.map(([x, y, z]) => new Vector3(x, y, z)))

/** How far ahead along the curve the camera aims (SDS §6). */
export const LOOKAHEAD = 0.004
