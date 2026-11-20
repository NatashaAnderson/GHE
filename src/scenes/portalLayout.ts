/** Hub portal world positions — front row M01–M04, back row M05–M08. */
export const PORTAL_LAYOUT: Array<[number, number, number]> = [
  [-4.5, 0, 2.5],
  [-1.5, 0, 2.5],
  [1.5, 0, 2.5],
  [4.5, 0, 2.5],
  [-4.5, 0, -2.5],
  [-1.5, 0, -2.5],
  [1.5, 0, -2.5],
  [4.5, 0, -2.5],
]

/** Horizontal radius of the teleport trigger (matches / slightly larger than cylinder). */
export const PORTAL_TELEPORT_RADIUS = 1.15

/** Where the learner appears after entering a module. */
export const MODULE_SPAWN: [number, number, number] = [0, 1.6, 7]

/**
 * Campus welcome signpost (ground position).
 * Kept south of the portal plaza so cylinders are not crowded.
 */
export const SIGNPOST_POSITION: [number, number, number] = [0, 0, 11]

/** Camera standing in front of the campus signpost, looking toward the modules. */
export const HUB_SPAWN: [number, number, number] = [0, 1.6, 13.2]

/** Look target from the signpost toward the portal plaza. */
export const HUB_LOOK_AT: [number, number, number] = [0, 1.5, 2.5]
