import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SPEED = 4

/** WASD + pointer-look for desktop exploration when not in XR. */
export function DesktopControls({ enabled }: { enabled: boolean }) {
  const { camera, gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const dragging = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.button === 2 || event.shiftKey) dragging.current = true
    }
    const onPointerUp = () => {
      dragging.current = false
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return
      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.y -= event.movementX * 0.002
      euler.current.x -= event.movementY * 0.002
      euler.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
    }
    const onContextMenu = (event: Event) => event.preventDefault()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    gl.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    gl.domElement.addEventListener('contextmenu', onContextMenu)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      gl.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      gl.domElement.removeEventListener('contextmenu', onContextMenu)
    }
  }, [camera, enabled, gl.domElement])

  useFrame((_, delta) => {
    if (!enabled) return
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    const move = new THREE.Vector3()
    if (keys.current.KeyW || keys.current.ArrowUp) move.add(forward)
    if (keys.current.KeyS || keys.current.ArrowDown) move.sub(forward)
    if (keys.current.KeyA || keys.current.ArrowLeft) move.sub(right)
    if (keys.current.KeyD || keys.current.ArrowRight) move.add(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * delta)
      camera.position.add(move)
      camera.position.y = Math.max(1.4, Math.min(2.2, camera.position.y))
    }
  })

  return null
}
