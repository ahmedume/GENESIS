import { CatmullRomCurve3, Vector3 } from 'three'

type XYZ = [number, number, number]

/** Full-journey spline — one control cluster per epoch zone (STORYBOARD ranges),
 *  lateral weave for the Galaxy Era, crane rise at the finale. */
const POINTS: XYZ[] = [
  [0, 0, 10], // hero · singularity
  [5, -2, -70], // inflation
  [-7, 3, -120], // quark soup
  [8, -4, -165], // first light
  [-10, 3, -225], // cosmic dawn
  [12, -5, -295], // galaxy era weave
  [-11, 5, -355], // stellar forge
  [9, -3, -405], // event horizon
  [0, 2, -470], // solar system approach
  [0, 7, -520], // finale crane rise
]

export const journeyCurve = new CatmullRomCurve3(POINTS.map(([x, y, z]) => new Vector3(x, y, z)))

/** How far ahead along the curve the camera aims (SDS §6). */
export const LOOKAHEAD = 0.004
