import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

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
        <Html position={[0, 2.35, 0]} center distanceFactor={8}>
          <button
            onClick={onInteractClick}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-base shadow-[0_0_30px_rgba(37,99,235,0.85)] border-2 border-white hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex items-center gap-2 animate-bounce cursor-pointer"
          >
            <span>💬</span>
            <span>{promptLabel || 'Talk to Maya • Explore Bank Sections'}</span>
          </button>
        </Html>
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 3 BANK EXTERIOR ("🏛️ Bank", Image 1) + BANK INTERIOR WITH 5 NUMBERED
// SECTIONS ("1", "2", "3" Counters & "4", "5" Glass Advisory Suites, Image 4)
// Positioned along the continuous campus avenue at y = 6.2, z = -74 to -112
// ═══════════════════════════════════════════════════════════════════════════════
export default function Level3BankZone3D({
  bankDoorOpenRef,
  employeeStateRef,
  onEmployeeInteract,
  showEmployeePrompt,
  employeePromptLabel,
  activeBankSection,
  completedBankSections = [],
  sectionScreenContent,
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

  // Coordinates of the numbered Level 3 sections inside the Bank Interior (y = 6.68):
  // Counter 1: Banking Slip Writing, Counter 2: Digital Banking Safety
  const frontCounters = [
    { num: 1, x: -4.8, title: 'Banking Slip Writing' },
    { num: 2, x: 0.0, title: 'Digital Banking Safety' },
    { num: 3, x: 4.8, title: 'Customer Desk' },
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
          <group position={[-5.15, 1.55, 0.44]}>
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
          2. BANK INTERIOR LOBBY & 5 NUMBERED INTERACTIVE SECTIONS (Image 4)
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

        {/* ─── SECTIONS 1, 2, 3: FRONT NUMBERED BANKING COUNTERS (Image 4) ─── */}
        {frontCounters.map((counter) => {
          const isCurrent = activeBankSection === counter.num
          const isDone = completedBankSections.includes(counter.num)
          return (
            <group key={counter.num} position={[counter.x, 0, -5.2]}>
              {/* Warm Oak Counter Desk */}
              <RoundedBox args={[3.8, 1.1, 1.25]} position={[0, 0.55, 0]} radius={0.03} castShadow receiveShadow>
                <meshStandardMaterial color="#c88d54" roughness={0.42} />
              </RoundedBox>
              {/* Frosted Glass Teller Partition */}
              <mesh position={[0, 1.65, 0.52]}>
                <boxGeometry args={[3.6, 1.1, 0.05]} />
                <meshPhysicalMaterial color="#d1fae5" transparent opacity={0.32} roughness={0.15} />
              </mesh>
              {/* Blue Numbered Counter Badge ("1", "2", "3" - Image 4) */}
              <group position={[-1.45, 2.05, 0.56]}>
                <RoundedBox args={[0.56, 0.56, 0.08]} radius={0.06}>
                  <meshStandardMaterial color={isDone ? '#10b981' : isCurrent ? '#f59e0b' : '#0b4f9c'} />
                </RoundedBox>
                <Text position={[0, 0, 0.06]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
                  {String(counter.num)}
                </Text>
              </group>

              {/* Physical Interactive Banking Monitor on Counter */}
              <group position={[0, 1.72, -0.05]}>
                <RoundedBox args={[2.55, 1.48, 0.07]} radius={0.03} castShadow>
                  <meshStandardMaterial color="#0f172a" roughness={0.3} />
                </RoundedBox>
                <mesh position={[0, 0, 0.04]}>
                  <planeGeometry args={[2.4, 1.34]} />
                  <meshBasicMaterial color="#020617" />
                </mesh>

                {isCurrent && sectionScreenContent && (
                  <Html
                    transform
                    distanceFactor={1.16}
                    position={[0, 0, 0.048]}
                    style={{
                      width: '840px',
                      height: '472px',
                      pointerEvents: 'auto',
                      userSelect: 'none',
                    }}
                  >
                    {sectionScreenContent}
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

                {isCurrent && sectionScreenContent && (
                  <Html
                    transform
                    distanceFactor={1.16}
                    position={[0, 0, 0.048]}
                    style={{
                      width: '840px',
                      height: '472px',
                      pointerEvents: 'auto',
                      userSelect: 'none',
                    }}
                  >
                    {sectionScreenContent}
                  </Html>
                )}
              </group>
            </group>
          )
        })}
      </group>

      {/* 3. LEVEL 3 BANK EMPLOYEE GUIDE ("MAYA", Image 2) */}
      <BankEmployeeGuide3D
        employeeStateRef={employeeStateRef}
        onInteractClick={onEmployeeInteract}
        showPrompt={showEmployeePrompt}
        promptLabel={employeePromptLabel}
      />
    </group>
  )
}
