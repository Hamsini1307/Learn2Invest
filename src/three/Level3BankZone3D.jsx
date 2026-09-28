import React, { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text as DreiText, RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

function Text(props) {
  return (
    <Suspense fallback={null}>
      <DreiText {...props} />
    </Suspense>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 BANK EMPLOYEE GUIDE CHARACTER ("MAYA" — Matching Uploaded Image 2)
// Dark-brown updo hair, white collared shirt, royal-blue Bank ID lanyard ("🏛️"),
// silver chest badge, navy pencil skirt, holding navy folder & welcoming gesture
// ═══════════════════════════════════════════════════════════════════════════════
export function BankEmployeeGuide3D({ employeeStateRef, onInteractClick, showPrompt, promptLabel }) {
  const groupRef = useRef()
  const rightArmRef = useRef()
  const headRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const es = employeeStateRef?.current || { x: 0, y: 6.68, z: -92.8, rotY: 0 }

    groupRef.current.position.set(es.x, es.y, es.z)
    const rotDiff = ((es.rotY - groupRef.current.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI
    groupRef.current.rotation.y += rotDiff * 0.12

    // Gentle breathing + welcoming hand gesture (Image 2)
    groupRef.current.position.y = es.y + Math.sin(t * 2.2) * 0.025
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.65 + Math.sin(t * 3.0) * 0.12
      rightArmRef.current.rotation.x = -0.25
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.6) * 0.08
      headRef.current.rotation.z = Math.sin(t * 2.0) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[0, 6.68, -92.8]} scale={1.16}>
      {/* Subtle Blue Advisor Ground Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 28]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.32} />
      </mesh>

      {/* Left & Right Legs + Navy Heels */}
      {[-0.11, 0.11].map((lx, i) => (
        <group key={i} position={[lx, 0.44, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.068, 0.055, 0.38, 14]} />
            <meshStandardMaterial color="#f5cba7" roughness={0.45} />
          </mesh>
          <RoundedBox args={[0.14, 0.09, 0.24]} position={[0, -0.4, 0.03]} radius={0.03} castShadow>
            <meshStandardMaterial color="#172554" roughness={0.35} />
          </RoundedBox>
        </group>
      ))}

      {/* Navy-Blue High-Waisted Pencil Skirt (Matching Image 2) */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.24, 0.38, 20]} />
        <meshStandardMaterial color="#1e2952" roughness={0.5} />
      </mesh>

      {/* Crisp White Collared Button-Down Shirt Torso (Matching Image 2) */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.42, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.38} />
      </mesh>

      {/* Royal-Blue Neck Lanyard + Blue & White Bank ID Card ("🏛️") (Matching Image 2) */}
      <group position={[0, 0.88, 0.205]}>
        {/* Left & Right Blue Lanyard Ribbons */}
        <mesh position={[-0.055, 0.08, 0]} rotation={[0, 0, -0.24]}>
          <boxGeometry args={[0.028, 0.24, 0.01]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        <mesh position={[0.055, 0.08, 0]} rotation={[0, 0, 0.24]}>
          <boxGeometry args={[0.028, 0.24, 0.01]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        {/* Blue ID Card Holder + White Face + Bank Icon */}
        <RoundedBox args={[0.11, 0.14, 0.015]} position={[0, -0.07, 0.008]} radius={0.015}>
          <meshStandardMaterial color="#1d4ed8" />
        </RoundedBox>
        <mesh position={[0, -0.07, 0.018]}>
          <planeGeometry args={[0.085, 0.11]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Silver & Blue Name Badge on Left Chest (Image 2) */}
        <RoundedBox args={[0.09, 0.032, 0.015]} position={[0.11, 0.07, -0.01]} radius={0.005}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
        </RoundedBox>
      </group>

      {/* Left Arm Holding Navy-Blue Portfolio Folder & Wristwatch (Image 2) */}
      <group position={[-0.25, 1.0, 0]}>
        <mesh position={[-0.03, -0.14, 0.05]} rotation={[-0.45, 0, 0.15]} castShadow>
          <capsuleGeometry args={[0.058, 0.22, 8, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[-0.02, -0.26, 0.14]}>
          <sphereGeometry args={[0.052, 12, 12]} />
          <meshStandardMaterial color="#f5cba7" />
        </mesh>
        {/* Navy-Blue Banking Portfolio Folder Held in Left Arm (Image 2) */}
        <RoundedBox
          args={[0.24, 0.32, 0.04]}
          position={[0.04, -0.2, 0.16]}
          rotation={[0.2, 0.35, -0.2]}
          radius={0.01}
          castShadow
        >
          <meshStandardMaterial color="#1e3a6e" roughness={0.45} />
        </RoundedBox>
      </group>

      {/* Right Arm Extending in Welcoming Presentation Gesture (Image 2) */}
      <group ref={rightArmRef} position={[0.25, 1.0, 0]}>
        <mesh position={[0.08, -0.12, 0.04]} rotation={[0, 0, -0.45]} castShadow>
          <capsuleGeometry args={[0.058, 0.24, 8, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0.18, -0.22, 0.08]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#f5cba7" />
        </mesh>
      </group>

      {/* Pixar-Style Head, Expressive Warm Brown Eyes, Pearl Earrings & Dark-Brown Updo Hair (Image 2) */}
      <group ref={headRef} position={[0, 1.34, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshStandardMaterial color="#f5cba7" roughness={0.36} />
        </mesh>
        {/* Dark-Brown Updo Hair + Low Bun */}
        <mesh position={[0, 0.06, -0.03]} castShadow>
          <sphereGeometry args={[0.29, 24, 24]} />
          <meshStandardMaterial color="#2b1b14" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.05, -0.26]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#2b1b14" roughness={0.45} />
        </mesh>
        {/* Pearl Stud Earrings */}
        {[-0.26, 0.26].map((px, i) => (
          <mesh key={i} position={[px, -0.03, 0.02]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.15} />
          </mesh>
        ))}
        {/* Expressive Warm Brown Eyes */}
        {[-0.09, 0.09].map((ex, idx) => (
          <group key={idx} position={[ex, 0.02, 0.24]}>
            <mesh>
              <sphereGeometry args={[0.05, 14, 14]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.036, 12, 12]} />
              <meshBasicMaterial color="#3b1d0b" />
            </mesh>
            <mesh position={[0.012, 0.014, 0.046]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
        {/* Rosy Cheeks */}
        {[-0.15, 0.15].map((cx, i) => (
          <mesh key={i} position={[cx, -0.05, 0.22]}>
            <sphereGeometry args={[0.034, 10, 10]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Floating 3D Advisor Nameplate & Interactive Prompt */}
      <Text
        position={[0, 1.88, 0]}
        fontSize={0.17}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.022}
        outlineColor="#1e3a8a"
      >
        🏦 Maya • Bank Guide
      </Text>

      {showPrompt && (
        <Html position={[0, 2.45, 0]} center distanceFactor={8} zIndexRange={[15, 0]}>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onInteractClick}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-sm shadow-[0_0_30px_rgba(37,99,235,0.85)] border-2 border-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <span>💬</span>
              <span>{promptLabel || 'Talk to Maya • Explore Bank Sections'}</span>
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIQUE 3D ATM PAVILION WITH LIVE CASH DISPENSER, VELVET QUEUE & PEOPLE TAKING MONEY
// ═══════════════════════════════════════════════════════════════════════════════
function UniqueAtmPavilionWithQueue3D({
  isNightMode = false,
  onOpenAtm,
  atmQueuePosition = 2,
  isPlayerInAtmQueue = false,
}) {
  const roofCoinRef = useRef()
  const cashBundleSlotRef = useRef()
  const customer1GroupRef = useRef()
  const customer1ArmRef = useRef()
  const customer2GroupRef = useRef()
  const customer2ArmRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (roofCoinRef.current) {
      roofCoinRef.current.rotation.y = t * 1.8
      roofCoinRef.current.position.y = 4.55 + Math.sin(t * 2.5) * 0.08
    }
    // Cash notes sliding out of the ATM dispenser slot continuously
    if (cashBundleSlotRef.current) {
      const slide = (Math.sin(t * 3.2) + 1) * 0.5 // 0..1
      cashBundleSlotRef.current.position.z = 1.16 + slide * 0.16
    }

    // Animate Customer 1 & Customer 2 positions based on atmQueuePosition
    // When idle (!isPlayerInAtmQueue) or atmQueuePosition === 2:
    //   Customer 1 is at ATM (x=0, z=1.55) taking money; Customer 2 is in queue at (x=0, z=2.95)
    // When atmQueuePosition === 1:
    //   Customer 1 steps aside with cash to (x=2.3, z=2.1); Customer 2 is at ATM (x=0, z=1.55) taking money
    // When atmQueuePosition === 0 (Player's turn at ATM!):
    //   Customer 1 is at (x=2.5, z=2.5) counting cash; Customer 2 is at (x=-2.3, z=2.2) holding cash
    const qPos = isPlayerInAtmQueue ? atmQueuePosition : 2

    if (customer1GroupRef.current) {
      const targetX1 = qPos >= 2 ? 0 : 2.35
      const targetZ1 = qPos >= 2 ? 1.55 : 2.2
      const targetRot1 = qPos >= 2 ? Math.PI : -0.45
      customer1GroupRef.current.position.x = THREE.MathUtils.lerp(customer1GroupRef.current.position.x, targetX1, 0.08)
      customer1GroupRef.current.position.z = THREE.MathUtils.lerp(customer1GroupRef.current.position.z, targetZ1, 0.08)
      customer1GroupRef.current.position.y = Math.abs(Math.sin(t * 3.2)) * 0.03
      customer1GroupRef.current.rotation.y = THREE.MathUtils.lerp(customer1GroupRef.current.rotation.y, targetRot1, 0.1)
    }
    if (customer1ArmRef.current) {
      // Reaching for cash from the dispenser and counting notes
      customer1ArmRef.current.rotation.x = -0.85 + Math.sin(t * 4.2) * 0.25
      customer1ArmRef.current.rotation.z = -0.15 + Math.cos(t * 3.2) * 0.1
    }

    if (customer2GroupRef.current) {
      const targetX2 = qPos === 2 ? 0 : qPos === 1 ? 0 : -2.35
      const targetZ2 = qPos === 2 ? 2.95 : qPos === 1 ? 1.55 : 2.2
      const targetRot2 = qPos >= 1 ? Math.PI : 0.45
      customer2GroupRef.current.position.x = THREE.MathUtils.lerp(customer2GroupRef.current.position.x, targetX2, 0.08)
      customer2GroupRef.current.position.z = THREE.MathUtils.lerp(customer2GroupRef.current.position.z, targetZ2, 0.08)
      customer2GroupRef.current.position.y = Math.abs(Math.cos(t * 2.8)) * 0.025
      customer2GroupRef.current.rotation.y = THREE.MathUtils.lerp(customer2GroupRef.current.rotation.y, targetRot2, 0.1)
    }
    if (customer2ArmRef.current) {
      customer2ArmRef.current.rotation.x = qPos === 1 ? -0.9 + Math.sin(t * 4.5) * 0.25 : -0.45 + Math.sin(t * 2.4) * 0.1
    }
  })

  const qPos = isPlayerInAtmQueue ? atmQueuePosition : 2

  return (
    <group
      position={[12.6, -0.48, 6.8]}
      rotation={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        if (onOpenAtm) onOpenAtm()
      }}
    >
      {/* 1. Illuminated Marble & Neon Base Plaza Pad */}
      <RoundedBox args={[5.2, 0.18, 6.8]} position={[0, 0.09, 2.2]} radius={0.05} receiveShadow>
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.1} />
      </RoundedBox>
      {/* Glowing Cyan Perimeter Strip Around ATM Pad */}
      <mesh position={[0, 0.19, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.45, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.55} />
      </mesh>

      {/* 2. Futuristic Glass & Navy Gold-Trimmed ATM Vault Booth */}
      <RoundedBox args={[3.8, 3.9, 2.5]} position={[0, 2.04, 0]} radius={0.1} castShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.28} metalness={0.35} />
      </RoundedBox>
      {/* Left & Right Tempered Cyan Glass Side Panels */}
      {[-1.82, 1.82].map((gx, i) => (
        <RoundedBox key={i} args={[0.12, 3.2, 2.1]} position={[gx, 1.9, 0.1]} radius={0.03}>
          <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.42} roughness={0.1} metalness={0.2} />
        </RoundedBox>
      ))}
      {/* Gold Neon Vertical Accent Pillars */}
      {[-1.75, 1.75].map((px, i) => (
        <RoundedBox key={i} args={[0.16, 3.7, 0.18]} position={[px, 1.95, 1.22]} radius={0.04}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.45} metalness={0.7} roughness={0.2} />
        </RoundedBox>
      ))}

      {/* 3. Illuminated Top Marquee Sign + Spinning 3D Golden ₹ Coin */}
      <RoundedBox args={[4.1, 0.78, 2.85]} position={[0, 3.78, 0.1]} radius={0.08} castShadow>
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={isNightMode ? 0.95 : 0.4}
        />
      </RoundedBox>
      <Text
        position={[0, 3.86, 1.55]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#082f49"
      >
        🏧 24/7 SUPER ATM • CASH & XP
      </Text>
      <Text
        position={[0, 3.55, 1.55]}
        fontSize={0.15}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
      >
        💵 INSTANT ₹500 NOTES • LIVE QUEUE ACTIVE
      </Text>

      {/* Spinning 3D Gold Rupee Coin on Roof */}
      <group ref={roofCoinRef} position={[0, 4.55, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.52, 0.14, 28]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.35} metalness={0.85} roughness={0.15} />
        </mesh>
        <Text position={[0, 0, 0.09]} fontSize={0.46} color="#78350f" anchorX="center" anchorY="middle">
          ₹
        </Text>
        <Text position={[0, 0, -0.09]} rotation={[0, Math.PI, 0]} fontSize={0.46} color="#78350f" anchorX="center" anchorY="middle">
          ₹
        </Text>
      </group>

      {/* 4. High-Detail Dual-Screen ATM Machine Terminal Inside Booth */}
      <RoundedBox args={[1.85, 2.75, 0.75]} position={[0, 1.52, 0.75]} radius={0.06} castShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.25} />
      </RoundedBox>
      {/* Upper Digital Rate & Status Screen */}
      <mesh position={[0, 2.48, 1.14]}>
        <planeGeometry args={[1.45, 0.36]} />
        <meshBasicMaterial color="#064e3b" />
      </mesh>
      <Text position={[0, 2.48, 1.15]} fontSize={0.11} color="#34d399" anchorX="center" anchorY="middle">
        {'● DISPENSING ₹500 NOTES  |  QUEUE ACTIVE'}
      </Text>

      {/* Main Interactive Touch Screen */}
      <mesh position={[0, 1.85, 1.14]}>
        <planeGeometry args={[1.28, 0.72]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0, 1.85, 1.145]}>
        <planeGeometry args={[1.2, 0.64]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <Text position={[0, 1.92, 1.155]} fontSize={0.13} color="#020617" anchorX="center" anchorY="middle">
        {'🏧 LIVE CASH & XP ATM\nCLICK TO JOIN QUEUE / WITHDRAW'}
      </Text>
      <Text position={[0, 1.66, 1.155]} fontSize={0.1} color="#0f172a" anchorX="center" anchorY="middle">
        {'[ ₹500 ]   [ ₹1,000 ]   [ ₹2,500 ]'}
      </Text>

      {/* Glowing Green Card Reader Slot + Inserted Gold Card */}
      <RoundedBox args={[0.32, 0.09, 0.08]} position={[0.46, 1.32, 1.14]} radius={0.015}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.02, 0.14]} position={[0.46, 1.32, 1.2]} radius={0.005}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Metallic PIN Pad Shelf */}
      <RoundedBox args={[0.68, 0.08, 0.32]} position={[-0.12, 1.24, 1.22]} radius={0.02}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* 5. Animated Cash Dispenser Slot with 3D Green ₹500 Currency Notes Sliding Out! */}
      <RoundedBox args={[0.78, 0.14, 0.1]} position={[0, 1.02, 1.14]} radius={0.02}>
        <meshStandardMaterial color="#0f172a" />
      </RoundedBox>
      <mesh position={[0, 1.02, 1.19]}>
        <planeGeometry args={[0.68, 0.05]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <group ref={cashBundleSlotRef} position={[0, 1.01, 1.24]}>
        {[-0.12, 0, 0.12].map((nx, idx) => (
          <RoundedBox
            key={idx}
            args={[0.22, 0.018, 0.34]}
            position={[nx, idx * 0.015, 0]}
            rotation={[0.08, (idx - 1) * 0.14, 0]}
            radius={0.004}
          >
            <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.35} />
          </RoundedBox>
        ))}
        <Text position={[0, 0.06, 0.12]} rotation={[-Math.PI / 3, 0, 0]} fontSize={0.09} color="#dcfce7" anchorX="center" anchorY="middle">
          ₹500
        </Text>
      </group>

      {/* 6. Velvet Queue Stanchion Posts & Red Ropes + Floor Queue Footprints (#1, #2, #3) */}
      {[-1.15, 1.15].map((qx, sideIdx) => (
        <group key={sideIdx}>
          {[1.65, 3.05, 4.45].map((qz, postIdx) => (
            <group key={postIdx} position={[qx, 0.18, qz]}>
              {/* Gold Brass Base & Post */}
              <mesh position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.16, 0.18, 0.06, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.95, 12]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.98, 0]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.12} />
              </mesh>
              {/* Red Velvet Queue Rope connecting posts */}
              {postIdx < 2 && (
                <mesh position={[0, 0.76, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.028, 0.028, 1.4, 10]} />
                  <meshStandardMaterial color="#dc2626" roughness={0.6} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}

      {/* Floor Queue Spot Markers (#1 AT ATM, #2 NEXT, #3 QUEUE) */}
      {[
        { z: 1.55, label: 'SPOT #1 • AT ATM', color: '#10b981' },
        { z: 2.95, label: 'QUEUE #2 • WAIT', color: '#0ea5e9' },
        { z: 4.35, label: 'QUEUE #3 • JOIN LINE', color: '#f59e0b' },
      ].map((spot, idx) => (
        <group key={idx} position={[0, 0.19, spot.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.48, 24]} />
            <meshBasicMaterial color={spot.color} />
          </mesh>
          <Text
            position={[0, 0.01, 0.58]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.11}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
          >
            {spot.label}
          </Text>
        </group>
      ))}

      {/* 7. Animated 3D NPC Customer #1 ("Rohan") Taking Cash Notes from the ATM */}
      <group ref={customer1GroupRef} position={[0, 0.18, 1.55]} rotation={[0, Math.PI, 0]}>
        {/* Legs */}
        {[-0.1, 0.1].map((lx, i) => (
          <mesh key={i} position={[lx, 0.32, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.36, 8, 12]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
        {/* Emerald Jacket Torso */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.21, 0.19, 0.52, 16]} />
          <meshStandardMaterial color="#0d9488" roughness={0.45} />
        </mesh>
        {/* Head & Hair */}
        <mesh position={[0, 1.28, 0]} castShadow>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#f5cba7" />
        </mesh>
        <mesh position={[0, 1.36, -0.02]} castShadow>
          <sphereGeometry args={[0.23, 18, 18]} />
          <meshStandardMaterial color="#1e1b18" />
        </mesh>
        {/* Right Arm Reaching for & Holding Fan of Green ₹500 Cash Notes */}
        <group ref={customer1ArmRef} position={[0.24, 0.98, 0]}>
          <mesh position={[0, -0.14, 0.08]} castShadow>
            <capsuleGeometry args={[0.055, 0.24, 8, 10]} />
            <meshStandardMaterial color="#0d9488" />
          </mesh>
          {/* Fan of 3 Green ₹500 Currency Notes in Customer's Hand! */}
          <group position={[0.02, -0.28, 0.18]}>
            {[-0.25, 0, 0.25].map((rot, nIdx) => (
              <RoundedBox
                key={nIdx}
                args={[0.24, 0.12, 0.015]}
                position={[nIdx * 0.03, 0, 0]}
                rotation={[0.2, rot, rot * 0.6]}
                radius={0.004}
              >
                <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.4} />
              </RoundedBox>
            ))}
          </group>
        </group>
        {/* Floating Status Label Above Customer #1 */}
        <Text
          position={[0, 1.72, 0]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.13}
          color="#dcfce7"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#064e3b"
        >
          {qPos >= 2 ? '💵 Customer #1: Taking ₹2,500 Cash...' : '✅ Got ₹2,500 Cash!'}
        </Text>
      </group>

      {/* 8. Animated 3D NPC Customer #2 ("Priya") Waiting in Queue / Taking Cash */}
      <group ref={customer2GroupRef} position={[0, 0.18, 2.95]} rotation={[0, Math.PI, 0]}>
        {/* Legs */}
        {[-0.1, 0.1].map((lx, i) => (
          <mesh key={i} position={[lx, 0.32, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.36, 8, 12]} />
            <meshStandardMaterial color="#312e81" />
          </mesh>
        ))}
        {/* Coral/Pink Top Torso */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 0.5, 16]} />
          <meshStandardMaterial color="#ec4899" roughness={0.45} />
        </mesh>
        {/* Head & Hair */}
        <mesh position={[0, 1.26, 0]} castShadow>
          <sphereGeometry args={[0.21, 20, 20]} />
          <meshStandardMaterial color="#f5cba7" />
        </mesh>
        <mesh position={[0, 1.33, -0.03]} castShadow>
          <sphereGeometry args={[0.225, 18, 18]} />
          <meshStandardMaterial color="#3b1d0b" />
        </mesh>
        {/* Right Arm Holding ATM Card / Cash */}
        <group ref={customer2ArmRef} position={[0.23, 0.96, 0]}>
          <mesh position={[0, -0.13, 0.08]} castShadow>
            <capsuleGeometry args={[0.05, 0.22, 8, 10]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <RoundedBox args={[0.22, 0.11, 0.015]} position={[0, -0.26, 0.16]} radius={0.004}>
            <meshStandardMaterial
              color={qPos <= 1 ? '#22c55e' : '#38bdf8'}
              emissive={qPos <= 1 ? '#16a34a' : '#0284c7'}
              emissiveIntensity={0.4}
            />
          </RoundedBox>
        </group>
        {/* Floating Status Label Above Customer #2 */}
        <Text
          position={[0, 1.68, 0]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.13}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#713f12"
        >
          {qPos === 2
            ? '⏳ Customer #2: Waiting in Queue'
            : qPos === 1
            ? '💵 Customer #2: Withdrawing ₹1,500...'
            : '✅ Got ₹1,500 Cash!'}
        </Text>
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 BANK EXTERIOR ("🏛️ Bank", Image 1) + BANK INTERIOR WITH CABINS
// + SIDE 24/7 ATM MACHINE KIOSK + NIGHT MODE ARCHITECTURAL LIGHTING
// ═══════════════════════════════════════════════════════════════════════════════
export default function Level3BankZone3D({
  bankDoorOpenRef,
  employeeStateRef,
  onEmployeeInteract,
  onEmployeeClick,
  onSelectSection,
  showEmployeePrompt,
  employeePromptLabel,
  activeBankSection,
  completedBankSections = [],
  sectionScreenContent,
  isBankLobbyActive = false,
  isNightMode = false,
  onOpenAtm,
  onOpenXpDeposit,
  depositedXp = 0,
  atmQueuePosition = 2,
  isPlayerInAtmQueue = false,
}) {
  const leftGlassDoorRef = useRef()
  const rightGlassDoorRef = useRef()

  useFrame(() => {
    const openAmt = bankDoorOpenRef?.current ?? 1
    if (leftGlassDoorRef.current) {
      leftGlassDoorRef.current.position.x = THREE.MathUtils.lerp(-1.15, -2.55, openAmt)
    }
    if (rightGlassDoorRef.current) {
      rightGlassDoorRef.current.position.x = THREE.MathUtils.lerp(1.15, 2.55, openAmt)
    }
  })

  // Two Dedicated Level 3 Cabins inside the Bank Interior (y = 6.68):
  // Cabin 1 (x = -3.2): Section 1 — Banking Slip Writing
  // Cabin 2 (x = +3.2): Section 2 — Digital Banking Safety
  const frontCounters = [
    {
      num: 1,
      x: -3.2,
      cabinName: 'CABIN 1',
      title: 'Banking Slip Writing',
      subtitle: 'Deposit, Withdrawal, Cheque & Exact Branch IFSC',
      icon: '📝',
      accent: '#f59e0b',
    },
    {
      num: 2,
      x: 3.2,
      cabinName: 'CABIN 2',
      title: 'Digital Banking Safety',
      subtitle: 'YouTube Safety Video, UPI Defense & Scam Shield',
      icon: '🛡️',
      accent: '#06b6d4',
    },
  ]

  const glassSuites = [
    { num: 4, z: -100.2, title: 'Advisory Suite' },
    { num: 5, z: -94.6, title: 'Branch Manager' },
  ]

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════════════════
          1. BANK EXTERIOR PLAZA, 4 STONE STEPS, ATM & "🏛️ Bank" AWNING (Image 1)
             Located at y = 6.2, z = -74 to -88
      ═══════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 6.2, -82.0]}>
        {/* Sunlit Travertine Stone Sidewalk Plaza */}
        <mesh position={[0, 0.01, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[38, 16]} />
          <meshStandardMaterial color="#e7dfd5" roughness={0.38} metalness={0.08} />
        </mesh>

        {/* 4 Wide Grey-Stone Steps Rising to Bank Entrance (y: 0 -> 0.48, Image 1) */}
        {[0, 1, 2, 3].map((stepIdx) => (
          <RoundedBox
            key={stepIdx}
            args={[9.6, 0.12, 0.65]}
            position={[0, 0.06 + stepIdx * 0.12, -3.2 - stepIdx * 0.6]}
            radius={0.015}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </RoundedBox>
        ))}

        {/* Polished Stainless-Steel Handrails Flanking the 4 Stone Steps (Image 1) */}
        {[-3.6, 3.6].map((hx, idx) => (
          <group key={idx} position={[hx, 0, -4.1]}>
            <RoundedBox
              args={[0.07, 0.07, 2.8]}
              position={[0, 0.95, 0]}
              rotation={[0.18, 0, 0]}
              radius={0.02}
              castShadow
            >
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.15} />
            </RoundedBox>
            {[-1.1, 0, 1.1].map((pz, p) => (
              <mesh key={p} position={[0, 0.45 + p * 0.14, pz]}>
                <cylinderGeometry args={[0.03, 0.03, 0.85, 10]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Left & Right Stone Shrub Planter Beds Flanking Steps (Image 1) */}
        {[-6.8, 6.8].map((px, i) => (
          <group key={i} position={[px, 0, -3.8]}>
            <RoundedBox args={[3.6, 0.75, 2.2]} position={[0, 0.38, 0]} radius={0.03} castShadow>
              <meshStandardMaterial color="#d6cfc7" roughness={0.6} />
            </RoundedBox>
            {[-0.9, 0, 0.9].map((bx, b) => (
              <mesh key={b} position={[bx, 0.95, 0]} castShadow>
                <sphereGeometry args={[0.62, 14, 14]} />
                <meshStandardMaterial color="#15803d" roughness={0.75} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Freestanding Blue Bank Monument Sign on Right Sidewalk (Image 1) */}
        <group position={[6.5, 0, -1.2]} rotation={[0, -0.25, 0]}>
          <RoundedBox args={[1.35, 3.2, 0.28]} position={[0, 1.6, 0]} radius={0.04} castShadow>
            <meshStandardMaterial color="#f8fafc" />
          </RoundedBox>
          <RoundedBox args={[1.28, 1.85, 0.3]} position={[0, 2.2, 0]} radius={0.03}>
            <meshStandardMaterial color="#0b4f9c" />
          </RoundedBox>
          <Text position={[0, 2.25, 0.17]} fontSize={0.48} color="#ffffff" anchorX="center" anchorY="middle">
            🏛️
          </Text>
        </group>

        {/* ─── MODERN STONE & GLASS BANK FACADE WALL AT z = -6.0 (Matching Image 1) ─── */}
        <group position={[0, 0.48, -6.0]}>
          {/* Left & Right Travertine Stone Columns */}
          {[-5.2, 5.2].map((cx, i) => (
            <RoundedBox key={i} args={[3.4, 8.8, 0.8]} position={[cx, 4.4, 0]} radius={0.03} castShadow receiveShadow>
              <meshStandardMaterial color="#e5dec9" roughness={0.45} />
            </RoundedBox>
          ))}
          {/* Side Glass Curtain Walls */}
          {[-8.4, 8.4].map((gx, i) => (
            <group key={i} position={[gx, 4.4, 0]}>
              <RoundedBox args={[3.2, 8.8, 0.5]} radius={0.02}>
                <meshStandardMaterial color="#1e293b" />
              </RoundedBox>
              <mesh position={[0, 0, 0.27]}>
                <planeGeometry args={[2.8, 8.2]} />
                <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.55} roughness={0.1} metalness={0.2} />
              </mesh>
            </group>
          ))}

          {/* Upper Stone & Glass Transom Above Entrance */}
          <RoundedBox args={[7.2, 4.2, 0.8]} position={[0, 6.7, 0]} radius={0.02} castShadow>
            <meshStandardMaterial color="#e5dec9" roughness={0.45} />
          </RoundedBox>

          {/* ─── ROYAL-BLUE "🏛️ Bank" AWNING SIGN CANOPY (Matching Image 1) ─── */}
          <group position={[0, 5.25, 0.85]}>
            {/* White Architectural Under-Canopy Soffit */}
            <RoundedBox args={[11.8, 0.35, 1.8]} position={[0, -0.82, -0.1]} radius={0.03} castShadow>
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </RoundedBox>
            {/* 5 Warm Recessed Canopy Downlights (Image 1) */}
            {[-4.2, -2.1, 0, 2.1, 4.2].map((lx, i) => (
              <mesh key={i} position={[lx, -0.99, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.04, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            ))}
            {/* Bold Royal-Blue Sign Fascia */}
            <RoundedBox args={[11.6, 1.95, 0.45]} position={[0, 0.15, 0.55]} radius={0.05} castShadow>
              <meshStandardMaterial color="#0b4f9c" roughness={0.32} metalness={0.15} />
            </RoundedBox>

            {/* 3D White Classical Bank Temple Icon on Left of Sign (Image 1) */}
            <group position={[-3.2, 0.15, 0.82]}>
              {/* Pediment Roof Triangle */}
              <mesh position={[0, 0.52, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.78, 0.42, 3]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* 3 Classical Columns */}
              {[-0.38, 0, 0.38].map((colX, c) => (
                <RoundedBox key={c} args={[0.15, 0.58, 0.1]} position={[colX, 0.02, 0]} radius={0.02}>
                  <meshStandardMaterial color="#ffffff" />
                </RoundedBox>
              ))}
              {/* Base Plinth */}
              <RoundedBox args={[1.25, 0.14, 0.12]} position={[0, -0.36, 0]} radius={0.02}>
                <meshStandardMaterial color="#ffffff" />
              </RoundedBox>
            </group>

            {/* Bold 3D White "Bank" Lettering (Image 1) */}
            <Text
              position={[0.85, 0.12, 0.84]}
              fontSize={1.18}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#082f49"
            >
              Bank
            </Text>
          </group>

          {/* ─── BLUE "ATM" KIOSK ON LEFT STONE PILLAR (Matching Image 1) ─── */}
          <group
            position={[-5.15, 1.55, 0.44]}
            onClick={(e) => {
              e.stopPropagation()
              if (onOpenAtm) onOpenAtm()
            }}
          >
            {/* Blue ATM Surround Frame */}
            <RoundedBox args={[1.55, 3.1, 0.18]} position={[0, 0, 0]} radius={0.03} castShadow>
              <meshStandardMaterial color="#0b4f9c" roughness={0.38} />
            </RoundedBox>
            <Text position={[0, 1.18, 0.11]} fontSize={0.26} color="#ffffff" anchorX="center" anchorY="middle">
              ATM
            </Text>
            {/* Silver Metallic ATM Machine */}
            <RoundedBox args={[1.18, 2.25, 0.24]} position={[0, -0.25, 0.06]} radius={0.03}>
              <meshStandardMaterial color="#94a3b8" metalness={0.65} roughness={0.3} />
            </RoundedBox>
            {/* Glowing Blue ATM Screen */}
            <mesh position={[0, 0.12, 0.19]}>
              <planeGeometry args={[0.68, 0.48]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* ─── DEDICATED 24/7 SIDE ATM MACHINE PAVILION WITH LIVE CASH DISPENSER & QUEUE (x = 12.6) ─── */}
          <UniqueAtmPavilionWithQueue3D
            isNightMode={isNightMode}
            onOpenAtm={onOpenAtm}
            atmQueuePosition={atmQueuePosition}
            isPlayerInAtmQueue={isPlayerInAtmQueue}
          />

          {/* Night Mode Bank Facade Illumination Halo (Zero shader recompile!) */}
          <group visible={isNightMode}>
            <mesh position={[0, 0.03, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[16, 4.5]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.16} />
            </mesh>
          </group>

          {/* ─── DARK SQUARE PLANTERS WITH LUSH PALM PLANTS FLANKING ENTRANCE DOORS (Image 1) ─── */}
          {[-3.25, 3.25].map((px, i) => (
            <group key={i} position={[px, 0, 0.55]}>
              <RoundedBox args={[0.82, 0.78, 0.82]} position={[0, 0.39, 0]} radius={0.03} castShadow>
                <meshStandardMaterial color="#27272a" roughness={0.5} />
              </RoundedBox>
              <mesh position={[0, 1.25, 0]} castShadow>
                <sphereGeometry args={[0.72, 14, 14]} />
                <meshStandardMaterial color="#15803d" roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* ─── DOUBLE SLIDING GLASS ENTRANCE DOORS (Image 1) ─── */}
          <group position={[0, 2.15, 0]}>
            <RoundedBox ref={leftGlassDoorRef} args={[1.95, 4.2, 0.1]} position={[-1.15, 0, 0]} radius={0.02}>
              <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.38} roughness={0.1} />
            </RoundedBox>
            <RoundedBox ref={rightGlassDoorRef} args={[1.95, 4.2, 0.1]} position={[1.15, 0, 0]} radius={0.02}>
              <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.38} roughness={0.1} />
            </RoundedBox>
          </group>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. BANK INTERIOR LOBBY & INTERACTIVE CABINS (Image 4)
             Located at y = 6.68, z = -88.0 to -110.0
      ═══════════════════════════════════════════════════════════════════════ */}
      <group position={[0, 6.68, -99.0]}>
        {/* Polished Sunlit Cream-Marble Bank Floor (Image 4) */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20.5, 22.0]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.18} metalness={0.12} />
        </mesh>

        {/* Left, Right & Back Bank Interior Walls */}
        <mesh position={[0, 3.9, -10.5]} receiveShadow>
          <boxGeometry args={[20.5, 7.8, 0.4]} />
          <meshStandardMaterial color="#fbf5ee" roughness={0.7} />
        </mesh>
        <mesh position={[-10.1, 3.9, 0]} receiveShadow>
          <boxGeometry args={[0.4, 7.8, 22.0]} />
          <meshStandardMaterial color="#fbf5ee" roughness={0.7} />
        </mesh>
        <mesh position={[10.1, 3.9, 0]} receiveShadow>
          <boxGeometry args={[0.4, 7.8, 22.0]} />
          <meshStandardMaterial color="#fbf5ee" roughness={0.7} />
        </mesh>

        {/* Wood-Coffered Ceiling with Warm Cove Lighting (Image 4) */}
        <mesh position={[0, 7.75, 0]}>
          <boxGeometry args={[20.5, 0.25, 22.0]} />
          <meshStandardMaterial color="#fdf8f0" />
        </mesh>
        {[-4.8, 4.8].map((cx, i) => (
          <mesh key={i} position={[cx, 7.6, -2.0]}>
            <boxGeometry args={[4.2, 0.08, 12.0]} />
            <meshStandardMaterial color="#c88d54" roughness={0.45} />
          </mesh>
        ))}

        {/* ─── INTERACTIVE SIDE-WALL ATM MACHINE TERMINAL INSIDE/BESIDE BANK LOBBY ─── */}
        <group
          position={[-9.2, 0, 1.8]}
          rotation={[0, Math.PI / 2, 0]}
          onClick={(e) => {
            e.stopPropagation()
            if (onOpenAtm) onOpenAtm()
          }}
        >
          <RoundedBox args={[2.1, 3.3, 0.55]} position={[0, 1.65, 0]} radius={0.06} castShadow>
            <meshStandardMaterial color="#0284c7" roughness={0.35} />
          </RoundedBox>
          <RoundedBox args={[1.5, 2.35, 0.62]} position={[0, 1.35, 0.08]} radius={0.04}>
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 1.72, 0.4]}>
            <planeGeometry args={[1.05, 0.68]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text position={[0, 2.95, 0.32]} fontSize={0.24} color="#ffffff" anchorX="center" anchorY="middle">
            🏧 ATM MACHINE
          </Text>
          {isBankLobbyActive && !activeBankSection && (
            <Html position={[0, 3.65, 0.2]} center distanceFactor={9} zIndexRange={[15, 0]}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onOpenAtm) onOpenAtm()
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-black text-xs shadow-[0_0_24px_rgba(56,189,248,0.85)] border-2 border-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                🏧 ATM Machine • Withdraw XP ({depositedXp} XP in Bank)
              </button>
            </Html>
          )}
        </group>

        {/* ─── BACK FEATURE WALL: ROYAL-BLUE "🏛️" WALL & TRUST POSTERS (Matching Image 4) ─── */}
        <group position={[0, 4.2, -10.2]}>
          {/* Warm Wood Framing Pillars */}
          {[-3.4, 3.4].map((wx, i) => (
            <RoundedBox key={i} args={[0.9, 6.8, 0.18]} position={[wx, -0.2, 0]} radius={0.02}>
              <meshStandardMaterial color="#c87d3b" roughness={0.45} />
            </RoundedBox>
          ))}
          {/* Royal-Blue Center Wall */}
          <RoundedBox args={[5.9, 6.8, 0.16]} position={[0, -0.2, 0]} radius={0.02}>
            <meshStandardMaterial color="#0b4f9c" roughness={0.4} />
          </RoundedBox>
          {/* Large White 3D Classical Bank Emblem ("🏛️") on Blue Wall (Image 4) */}
          <Text position={[0, 1.15, 0.12]} fontSize={1.35} color="#ffffff" anchorX="center" anchorY="middle">
            🏛️
          </Text>

          {/* Left Framed Wall Poster: "Your Trusted Banking Partner" (Image 4) */}
          <group position={[-6.2, 0.65, 0.05]}>
            <RoundedBox args={[2.3, 2.9, 0.06]} radius={0.02}>
              <meshStandardMaterial color="#0b4f9c" />
            </RoundedBox>
            <mesh position={[0, 0.1, 0.04]}>
              <planeGeometry args={[2.12, 2.55]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
            <Text position={[0, 0.2, 0.06]} fontSize={0.22} color="#0f294a" anchorX="center" anchorY="middle">
              {'Your\nTrusted\nBanking\nPartner'}
            </Text>
          </group>

          {/* Right Framed Wall Poster: "Secure Savings Brighter Tomorrows 🌱" (Image 4) */}
          <group position={[5.6, 0.65, 0.05]}>
            <RoundedBox args={[2.3, 2.9, 0.06]} radius={0.02}>
              <meshStandardMaterial color="#0b4f9c" />
            </RoundedBox>
            <mesh position={[0, 0.1, 0.04]}>
              <planeGeometry args={[2.12, 2.55]} />
              <meshBasicMaterial color="#f8fafc" />
            </mesh>
            <Text position={[0, 0.2, 0.06]} fontSize={0.2} color="#0f294a" anchorX="center" anchorY="middle">
              {'Secure\nSavings\nBrighter\nTomorrows\n🌱'}
            </Text>
          </group>
        </group>

        {/* ─── FOREGROUND WAITING LOUNGE: NAVY-BLUE CHAIRS & COFFEE TABLE (Image 4) ─── */}
        <group position={[-4.6, 0, 5.2]}>
          {[-1.5, 0, 1.5].map((cx, i) => (
            <group key={i} position={[cx, 0, 0]}>
              <RoundedBox args={[1.15, 0.12, 0.95]} position={[0, 0.46, 0]} radius={0.03} castShadow>
                <meshStandardMaterial color="#1e3a6e" roughness={0.45} />
              </RoundedBox>
              <RoundedBox args={[1.15, 0.68, 0.12]} position={[0, 0.84, 0.42]} radius={0.03} castShadow>
                <meshStandardMaterial color="#1e3a6e" roughness={0.45} />
              </RoundedBox>
            </group>
          ))}
          {/* Warm Wooden Coffee Table with Potted Plant & Brochures (Image 4) */}
          <group position={[1.4, 0, 1.9]}>
            <RoundedBox args={[1.8, 0.46, 1.05]} position={[0, 0.23, 0]} radius={0.03} castShadow>
              <meshStandardMaterial color="#c87d3b" roughness={0.42} />
            </RoundedBox>
            <mesh position={[-0.35, 0.58, 0]}>
              <cylinderGeometry args={[0.14, 0.11, 0.24, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.35, 0.8, 0]}>
              <sphereGeometry args={[0.24, 12, 12]} />
              <meshStandardMaterial color="#16a34a" />
            </mesh>
          </group>
        </group>

        {/* ─── CABIN 1 & CABIN 2: TWO DEDICATED INTERACTIVE BANKING CABINS ─── */}
        {frontCounters.map((counter) => {
          const isCurrent = activeBankSection === counter.num
          const isDone = completedBankSections.includes(counter.num)
          return (
            <group
              key={counter.num}
              position={[counter.x, 0, -5.2]}
              onClick={() => {
                if (onSelectSection) onSelectSection(counter.num)
              }}
            >
              {/* Glass Cabin Side Dividers */}
              {[-2.2, 2.2].map((gx, gi) => (
                <RoundedBox key={gi} args={[0.08, 3.2, 2.2]} position={[gx, 1.6, 0.1]} radius={0.02}>
                  <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
                </RoundedBox>
              ))}

              {/* Overhead Cabin Signboard */}
              {!activeBankSection && (
                <group position={[0, 3.35, 0.55]}>
                  <RoundedBox args={[4.2, 0.62, 0.12]} radius={0.05} castShadow>
                    <meshStandardMaterial color={isDone ? '#059669' : isCurrent ? '#d97706' : '#0b4f9c'} />
                  </RoundedBox>
                  <Text
                    position={[0, 0.08, 0.08]}
                    fontSize={0.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.012}
                    outlineColor="#020617"
                  >
                    {`${counter.cabinName} • ${counter.title.toUpperCase()}`}
                  </Text>
                  <Text
                    position={[0, -0.15, 0.08]}
                    fontSize={0.12}
                    color="#fde68a"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {counter.subtitle}
                  </Text>
                </group>
              )}

              {/* Warm Oak Counter Desk */}
              <RoundedBox args={[4.1, 1.1, 1.25]} position={[0, 0.55, 0]} radius={0.03} castShadow receiveShadow>
                <meshStandardMaterial color="#c88d54" roughness={0.42} />
              </RoundedBox>
              {/* Frosted Glass Teller Partition */}
              <mesh position={[0, 1.65, 0.52]}>
                <boxGeometry args={[3.9, 1.1, 0.05]} />
                <meshPhysicalMaterial color="#d1fae5" transparent opacity={0.32} roughness={0.15} />
              </mesh>
              {/* Numbered Cabin Badge ("1", "2") */}
              {!activeBankSection && (
                <group position={[-1.6, 2.05, 0.56]}>
                  <RoundedBox args={[0.56, 0.56, 0.08]} radius={0.06}>
                    <meshStandardMaterial color={isDone ? '#10b981' : isCurrent ? '#f59e0b' : '#0b4f9c'} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.06]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
                    {String(counter.num)}
                  </Text>
                </group>
              )}

              {/* Physical Interactive Banking Monitor on Cabin Desk */}
              <group position={[0, 1.72, -0.05]}>
                <RoundedBox args={[2.75, 1.55, 0.07]} radius={0.03} castShadow>
                  <meshStandardMaterial color="#0f172a" roughness={0.3} />
                </RoundedBox>
                <mesh position={[0, 0, 0.04]}>
                  <planeGeometry args={[2.58, 1.4]} />
                  <meshBasicMaterial color={isCurrent ? '#0f172a' : '#020617'} />
                </mesh>

                {/* Embedded 3D Cabin Screen Preview */}
                {isBankLobbyActive && !activeBankSection && (
                  <Html
                    transform
                    distanceFactor={1.6}
                    position={[0, 0, 0.048]}
                    zIndexRange={[15, 0]}
                    style={{
                      width: '480px',
                      height: '260px',
                      pointerEvents: 'auto',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      onClick={() => {
                        if (onSelectSection) onSelectSection(counter.num)
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        background:
                          counter.num === 1
                            ? 'linear-gradient(145deg, #0f172a, #1e1b4b)'
                            : 'linear-gradient(145deg, #0f172a, #042f2e)',
                        border: `3px solid ${isDone ? '#10b981' : counter.accent}`,
                        borderRadius: '16px',
                        padding: '16px',
                        boxSizing: 'border-box',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            background: counter.accent,
                            color: '#020617',
                            fontWeight: 900,
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                          }}
                        >
                          {counter.cabinName} • SECTION {counter.num} OF 2
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: isDone ? '#4ade80' : '#fbbf24' }}>
                          {isDone ? '✓ Completed' : 'Click to Enter'}
                        </span>
                      </div>

                      <div>
                        <div style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>
                          {counter.icon} {counter.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>
                          {counter.num === 1
                            ? 'Practice filling Indian Bank Deposit Slips, Withdrawal Forms & Cheques with exact Branch IFSC search.'
                            : 'Watch the Digital Banking YouTube Tutorial first, then defend against UPI traps & SMS scams.'}
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          textAlign: 'center',
                          fontWeight: 900,
                          fontSize: '13px',
                          color: '#38bdf8',
                        }}
                      >
                        {`🚶 Click to Walk to ${counter.cabinName} →`}
                      </div>
                    </div>
                  </Html>
                )}
              </group>
            </group>
          )
        })}

        {/* ─── SECTIONS 4 & 5: RIGHT-SIDE GLASS-ENCLOSED ADVISORY SUITES (Image 4) ─── */}
        {glassSuites.map((suite) => {
          const isCurrent = activeBankSection === suite.num
          const isDone = completedBankSections.includes(suite.num)
          const localZ = suite.z - -99.0
          return (
            <group key={suite.num} position={[7.2, 0, localZ]}>
              {/* Glass Partition Frame & Frosted Horizontal Stripes (Image 4) */}
              <RoundedBox args={[0.12, 4.8, 4.8]} position={[-1.8, 2.4, 0]} radius={0.02}>
                <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.28} roughness={0.1} />
              </RoundedBox>
              {/* Blue Numbered Glass Suite Badge ("4", "5" - Image 4) */}
              <group position={[-1.85, 3.15, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
                <RoundedBox args={[0.58, 0.64, 0.08]} radius={0.06}>
                  <meshStandardMaterial color={isDone ? '#10b981' : isCurrent ? '#f59e0b' : '#0b4f9c'} />
                </RoundedBox>
                <Text position={[0, 0, 0.06]} fontSize={0.32} color="#ffffff" anchorX="center" anchorY="middle">
                  {String(suite.num)}
                </Text>
              </group>

              {/* Advisory Desk & Interactive Monitor Oriented Toward Center Lobby */}
              <RoundedBox args={[1.2, 0.95, 2.8]} position={[0.4, 0.48, 0]} radius={0.03} castShadow>
                <meshStandardMaterial color="#c88d54" roughness={0.42} />
              </RoundedBox>

              {/* Physical Interactive Advisory Monitor */}
              <group position={[0.15, 1.72, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <RoundedBox args={[2.55, 1.48, 0.07]} radius={0.03} castShadow>
                  <meshStandardMaterial color="#0f172a" roughness={0.3} />
                </RoundedBox>
                <mesh position={[0, 0, 0.04]}>
                  <planeGeometry args={[2.4, 1.34]} />
                  <meshBasicMaterial color="#020617" />
                </mesh>
              </group>
            </group>
          )
        })}
      </group>

      {/* 3. LEVEL 3 BANK EMPLOYEE GUIDE ("MAYA", Image 2) + XP DEPOSIT BUTTON */}
      <BankEmployeeGuide3D
        employeeStateRef={employeeStateRef}
        onInteractClick={onEmployeeInteract || onEmployeeClick}
        showPrompt={Boolean(showEmployeePrompt && !activeBankSection)}
        promptLabel={employeePromptLabel}
      />

      {isBankLobbyActive && !activeBankSection && onOpenXpDeposit && (
        <Html position={[0, 8.65, -92.8]} center distanceFactor={8} zIndexRange={[15, 0]}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenXpDeposit()
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black text-xs shadow-[0_0_24px_rgba(251,191,36,0.85)] border-2 border-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            💰 Deposit Collected XP with Guide Maya (Bank Vault: {depositedXp} XP)
          </button>
        </Html>
      )}
    </group>
  )
}
