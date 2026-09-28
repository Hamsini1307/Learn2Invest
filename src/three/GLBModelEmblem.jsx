import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export function GLBModelEmblem({
  url = '/models/school_emblem.glb',
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.8,
  floatAmplitude = 0.25,
  floatSpeed = 1.6,
}) {
  const groupRef = useRef()
  const { scene } = useGLTF(url)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * rotationSpeed
    groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatAmplitude
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} castShadow receiveShadow />
    </group>
  )
}

// Preload all 3 GLB models for instant rendering
useGLTF.preload('/models/school_emblem.glb')
useGLTF.preload('/models/govt_crest.glb')
useGLTF.preload('/models/portfolio_crystal.glb')

export default GLBModelEmblem
