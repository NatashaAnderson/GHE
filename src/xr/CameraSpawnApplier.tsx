import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { useProgressStore } from '../systems/progress'

/** Applies one-shot camera teleports requested by portal / hub navigation. */
export function CameraSpawnApplier() {
  const { camera } = useThree()
  const cameraSpawn = useProgressStore((s) => s.cameraSpawn)
  const cameraLookAt = useProgressStore((s) => s.cameraLookAt)
  const clearCameraSpawn = useProgressStore((s) => s.clearCameraSpawn)

  useEffect(() => {
    if (!cameraSpawn) return
    camera.position.set(cameraSpawn[0], cameraSpawn[1], cameraSpawn[2])
    if (cameraLookAt) {
      camera.lookAt(new THREE.Vector3(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]))
    }
    clearCameraSpawn()
  }, [camera, cameraSpawn, cameraLookAt, clearCameraSpawn])

  return null
}
