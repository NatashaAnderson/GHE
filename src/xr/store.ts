import { createXRStore } from '@react-three/xr'

export const xrStore = createXRStore({
  // Keep localhost emulator for desktop VR smoke tests; disable in production builds if needed.
  emulate: import.meta.env.DEV,
  hand: { teleportPointer: true },
  controller: { teleportPointer: true },
})
