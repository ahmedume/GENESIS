/** Epoch entities — ranges/labels per STORYBOARD.md; grade values per DESIGN-SYSTEM §2 table. */

export interface EpochGrade {
  fog: string
  fogNear: number
  fogFar: number
  exposure: number
  bloom: number
}

export interface Epoch {
  id: string
  label: string
  timeLabel: string
  scrollStart: number
  grade: EpochGrade
}

/** Phases 4 entries (galaxyera…) included now so the director covers the full track;
 *  their scenes simply render nothing until built. */
export const EPOCHS: Epoch[] = [
  { id: 'singularity', label: 'THE SINGULARITY', timeLabel: 'T = 0', scrollStart: 0, grade: { fog: '#000005', fogNear: 20, fogFar: 140, exposure: 0.9, bloom: 1.2 } },
  { id: 'inflation', label: 'INFLATION', timeLabel: 'T + 10⁻³² s', scrollStart: 0.08, grade: { fog: '#0a0612', fogNear: 18, fogFar: 150, exposure: 1.15, bloom: 1.3 } },
  { id: 'quarksoup', label: 'THE QUARK SOUP', timeLabel: 'T + 1 μs', scrollStart: 0.16, grade: { fog: '#12060a', fogNear: 14, fogFar: 110, exposure: 1.25, bloom: 1.3 } },
  { id: 'firstlight', label: 'FIRST LIGHT', timeLabel: 'T + 380 kyr', scrollStart: 0.26, grade: { fog: '#160a10', fogNear: 22, fogFar: 170, exposure: 1.05, bloom: 1.0 } },
  { id: 'cosmicdawn', label: 'COSMIC DAWN', timeLabel: 'T + 200 Myr', scrollStart: 0.36, grade: { fog: '#010108', fogNear: 24, fogFar: 200, exposure: 0.85, bloom: 1.6 } },
  { id: 'galaxyera', label: 'THE GALAXY ERA', timeLabel: 'T + 2 Gyr', scrollStart: 0.48, grade: { fog: '#04040e', fogNear: 20, fogFar: 190, exposure: 1.0, bloom: 1.3 } },
  { id: 'stellarforge', label: 'STELLAR FORGE', timeLabel: 'T + 6 Gyr', scrollStart: 0.62, grade: { fog: '#100806', fogNear: 18, fogFar: 160, exposure: 1.1, bloom: 1.4 } },
  { /** EVENT HORIZON */ id: 'eventhorizon', label: 'EVENT HORIZON', timeLabel: 'T + 9 Gyr', scrollStart: 0.74, grade: { fog: '#000002', fogNear: 24, fogFar: 210, exposure: 0.95, bloom: 2.0 } },
  { id: 'solsystem', label: 'YOU ARE HERE', timeLabel: 'NOW', scrollStart: 0.84, grade: { fog: '#020208', fogNear: 22, fogFar: 180, exposure: 1.0, bloom: 1.0 } },
]

/** Width of the cross-fade band centered on each boundary (SDS §6: 6% of total progress). */
export const TRANSITION_BAND = 0.06
