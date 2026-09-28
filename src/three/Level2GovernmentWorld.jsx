import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Sky,
  Sparkles,
  Text,
  Html,
  RoundedBox,
  Float,
  ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import GLBModelEmblem from './GLBModelEmblem.jsx'
import soundEngine from '../utils/soundEngine.js'
import Intermediate from '../screens/Intermediate.jsx'
import Advanced from '../screens/Advanced.jsx'
import { modules } from '../data.js'

const DISTRICT_BUILDINGS = [
  {
    id: 'postoffice',
    name: 'POST OFFICE SAVINGS BHAVAN',
    subtitle: 'NSC (7.7%) • Post Office MIS (7.4%) • Sukanya Samriddhi (8.2%)',
    badge: '🏤 SOVEREIGN POSTAL SAVINGS',
    position: [-15, 0, 12],
    rotationY: Math.PI / 2,
    entryCam: { x: -7.2, y: 2.8, z: 12, lookX: -18, lookY: 2.8, lookZ: 12 },
    interiorCam: { x: -13.2, y: 2.5, z: 12, lookX: -19.5, lookY: 2.6, lookZ: 12 },
    wallColor: '#991b1b',
    trimColor: '#fef3c7',
    accent: '#f59e0b',
    schemes: ['nsc', 'po', 'ssy'],
    description:
      'Government-guaranteed Postal Savings instruments backed by the Sovereign Guarantee of India.',
  },
  {
    id: 'treasury',
    name: 'NATIONAL PROVIDENT TREASURY',
    subtitle: 'PPF 15-Year Tax-Free (7.1%) • Section 80C EEE Vault',
    badge: '🏛️ MINISTRY OF PROVIDENT FUNDS',
    position: [15, 0, 12],
    rotationY: -Math.PI / 2,
    entryCam: { x: 7.2, y: 2.8, z: 12, lookX: 18, lookY: 2.8, lookZ: 12 },
    interiorCam: { x: 13.2, y: 2.5, z: 12, lookX: 19.5, lookY: 2.6, lookZ: 12 },
    wallColor: '#d97706',
    trimColor: '#fffbeb',
    accent: '#10b981',
    schemes: ['ppf'],
    description:
      'Long-term Sovereign Provident Sanctuary with Exempt-Exempt-Exempt (EEE) tax immunity.',
  },
  {
    id: 'nationalbank',
    name: 'BHARAT RESERVE & COMMERCIAL BANK',
    subtitle: 'Fixed Deposits (7.25%) • Recurring Deposits (6.5%)',
    badge: '🏦 INSTITUTIONAL BANKING HQ',
    position: [-15, 0, -6],
    rotationY: Math.PI / 2,
    entryCam: { x: -7.2, y: 2.8, z: -6, lookX: -18, lookY: 2.8, lookZ: -6 },
    interiorCam: { x: -13.2, y: 2.5, z: -6, lookX: -19.5, lookY: 2.6, lookZ: -6 },
    wallColor: '#1e3a8a',
    trimColor: '#e2e8f0',
    accent: '#38bdf8',
    schemes: ['fd', 'rd'],
    description:
      'Structured commercial banking deposits offering high liquidity, flexible tenures, and compounded returns.',
  },
  {
    id: 'mixerlab',
    name: 'CENTRAL ASSET ALLOCATION COMMISSION',
    subtitle: 'Multi-Asset Savings Mixer • Smart Portfolio Simulator',
    badge: '⚖️ STRATEGIC ALLOCATION BUREAU',
    position: [15, 0, -6],
    rotationY: -Math.PI / 2,
    entryCam: { x: 7.2, y: 2.8, z: -6, lookX: 18, lookY: 2.8, lookZ: -6 },
    interiorCam: { x: 13.2, y: 2.5, z: -6, lookX: 19.5, lookY: 2.6, lookZ: -6 },
    wallColor: '#065f46',
    trimColor: '#ecfdf5',
    accent: '#34d399',
    schemes: ['ppf', 'fd', 'nsc', 'ssy', 'rd', 'po'],
    description:
      'Interactive institutional laboratory for balancing PPF, FD, NSC, SSY, RD, and MIS allocations.',
  },
  {
    id: 'bankslips',
    name: 'BHARAT BANKING DOCUMENTATION HALL',
    subtitle: 'Real Deposit, Withdrawal & Cheque Slip Writer + IFSC Lookup',
    badge: '📝 OFFICIAL BANKING FORMS',
    position: [-15, 0, -22],
    rotationY: Math.PI / 2,
    entryCam: { x: -7.2, y: 2.8, z: -22, lookX: -18, lookY: 2.8, lookZ: -22 },
    interiorCam: { x: -13.2, y: 2.5, z: -22, lookX: -19.5, lookY: 2.6, lookZ: -22 },
    wallColor: '#4c1d95',
    trimColor: '#f3e8ff',
    accent: '#c084fc',
    schemes: ['fd', 'ppf'],
    description:
      'Practice filling authentic Indian bank deposit slips, withdrawal forms, and cheques with live IFSC verification.',
  },
  {
    id: 'cyberbureau',
    name: 'CYBER VIGILANCE & OMBUDSMAN COURT',
    subtitle: 'RBI Cyber Crime Cases • UPI Shield & Scam Analyzer',
    badge: '🛡️ FINANCIAL SECURITY TRIBUNAL',
    position: [15, 0, -22],
    rotationY: -Math.PI / 2,
    entryCam: { x: 7.2, y: 2.8, z: -22, lookX: 18, lookY: 2.8, lookZ: -22 },
    interiorCam: { x: 13.2, y: 2.5, z: -22, lookX: 19.5, lookY: 2.6, lookZ: -22 },
    wallColor: '#7c2d12',
    trimColor: '#ffedd5',
    accent: '#fb7185',
    schemes: ['fd', 'rd'],
    description:
      'Learn to defend your wealth against phishing, fake loan apps, UPI collect traps, and digital arrest scams.',
  },
]

function fmtINR(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcFV(monthly, rate, years) {
  const r = rate / 100 / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

// ─────────────────────────────────────────────────────────────────────────────
//  1. CEREMONIAL GOVERNMENT AVENUE, SECURITY CHECKPOINT & PUBLIC DISPLAYS
// ─────────────────────────────────────────────────────────────────────────────
function GovernmentDistrictEnvironment({ onEnterLevel3 }) {
  return (
    <group>
      {/* Grand Stone & Paved District Ground */}
      <mesh position={[0, -0.02, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>

      {/* Organized Symmetrical Lawns along both sides of the Ceremonial Avenue */}
      <mesh position={[-16, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 85]} />
        <meshStandardMaterial color="#14532d" roughness={0.8} />
      </mesh>
      <mesh position={[16, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 85]} />
        <meshStandardMaterial color="#14532d" roughness={0.8} />
      </mesh>

      {/* Wide Ceremonial Asphalt Road (Central Boulevard) */}
      <mesh position={[0, 0.02, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.5, 86]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Marble Sidewalks & Gold Avenue Curbs */}
      <mesh position={[-6.2, 0.08, -5]} receiveShadow castShadow>
        <boxGeometry args={[2.0, 0.16, 86]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      <mesh position={[6.2, 0.08, -5]} receiveShadow castShadow>
        <boxGeometry args={[2.0, 0.16, 86]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* Center Road Median with Sovereign Flags & Formal Street Lamps */}
      {Array.from({ length: 12 }, (_, i) => {
        const z = 28 - i * 5.8
        return (
          <group key={i} position={[0, 0.05, z]}>
            {/* Dashed Golden Boulevard Divider */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.22, 0.04, 2.6]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
            </mesh>
            {/* Formal Street Lamps on Both Sidewalks */}
            {i % 2 === 0 && (
              <>
                <group position={[-5.6, 0, 0]}>
                  <mesh position={[0, 2.2, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.12, 4.4, 10]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 4.5, 0]}>
                    <sphereGeometry args={[0.28, 14, 14]} />
                    <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={2} />
                  </mesh>
                </group>
                <group position={[5.6, 0, 0]}>
                  <mesh position={[0, 2.2, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.12, 4.4, 10]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 4.5, 0]}>
                    <sphereGeometry args={[0.28, 14, 14]} />
                    <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={2} />
                  </mesh>
                </group>
              </>
            )}
          </group>
        )
      })}

      {/* Security Checkpoint at District Entrance (Z = 24) */}
      <group position={[0, 0, 24]}>
        {/* Left & Right Security Booths */}
        {[-6.8, 6.8].map((bx, i) => (
          <group key={i} position={[bx, 1.4, 0]}>
            <RoundedBox args={[2.2, 2.8, 2.2]} radius={0.08} castShadow receiveShadow>
              <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
            </RoundedBox>
            <mesh position={[0, 0.3, 1.12]}>
              <planeGeometry args={[1.6, 1.1]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
        {/* Overhead Security Checkpoint Arch & Digital Information Board */}
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[15.5, 1.3, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
        </mesh>
        <Text position={[0, 5.35, 0.45]} fontSize={0.42} color="#fbbf24" anchorX="center">
          🏛️ SOVEREIGN FINANCIAL DISTRICT · SECURITY CHECKPOINT
        </Text>
        <Text position={[0, 4.88, 0.45]} fontSize={0.2} color="#34d399" anchorX="center">
          AUTHORIZED INVESTOR CLEARANCE VERIFIED • CLICK ANY INSTITUTION TO ENTER
        </Text>
      </group>

      {/* Public Digital Financial Information Boards in the Plaza */}
      {[-8.5, 8.5].map((px, idx) => (
        <group key={idx} position={[px, 2.2, 3]} rotation={[0, idx === 0 ? 0.35 : -0.35, 0]}>
          <RoundedBox args={[3.4, 2.2, 0.2]} radius={0.08} castShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          <Text position={[0, 0.65, 0.14]} fontSize={0.2} color="#fbbf24" anchorX="center">
            {idx === 0 ? '📊 PUBLIC RATE DISPLAY' : '🛡️ SOVEREIGN GUARANTEE'}
          </Text>
          <Text position={[0, 0.2, 0.14]} fontSize={0.17} color="#6ee7b7" anchorX="center">
            {idx === 0 ? 'PPF: 7.1% | SSY: 8.2% | NSC: 7.7%' : '100% Backed by Govt of India'}
          </Text>
          <Text position={[0, -0.25, 0.14]} fontSize={0.16} color="#bae6fd" anchorX="center">
            {idx === 0 ? 'Post Office MIS: 7.4% | FD: 7.25%' : 'Section 80C Tax Deduction ₹1.5L'}
          </Text>
        </group>
      ))}

      {/* Central Sovereign Crest Monument with GLB Model */}
      <group position={[0, 0, 3]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.2, 0.8, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.3} />
        </mesh>
        <GLBModelEmblem url="/models/govt_crest.glb" position={[0, 2.2, 0]} scale={0.75} />
      </group>

      {/* Level 3 Futuristic Financial City Gateway Portal at North End (Z = -34) */}
      <group
        position={[0, 0, -34]}
        onClick={(e) => {
          e.stopPropagation()
          soundEngine.playClick()
          onEnterLevel3()
        }}
      >
        <mesh position={[-4.5, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 9, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[4.5, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 9, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 9.2, 0]} castShadow>
          <boxGeometry args={[11, 1.6, 1.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 4.4, 0]}>
          <planeGeometry args={[7.6, 8.2]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={1.4}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Text position={[0, 9.2, 0.82]} fontSize={0.44} color="#38bdf8" anchorX="center">
          🌆 PORTAL TO LEVEL 3: FUTURISTIC FINANCIAL CITY →
        </Text>
      </group>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  2. GRAND GOVERNMENT BUILDING WITH ANIMATED DOORS & 3D INTERIOR
// ─────────────────────────────────────────────────────────────────────────────
function InstitutionalBuilding3D({
  bld,
  isSelected,
  doorOpenProgress,
  onSelectBuilding,
  completedModules,
}) {
  const [hovered, setHovered] = useState(false)
  const leftDoorRef = useRef()
  const rightDoorRef = useRef()

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(() => {
    const targetOpen = isSelected ? doorOpenProgress : hovered ? 0.25 : 0
    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        -targetOpen * 1.45,
        0.1
      )
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        targetOpen * 1.45,
        0.1
      )
    }
  })

  const doneCount = bld.schemes.filter((s) => completedModules.includes(s)).length

  return (
    <group
      position={bld.position}
      rotation={[0, bld.rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        soundEngine.playHover()
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        soundEngine.playClick()
        onSelectBuilding(bld)
      }}
    >
      {/* Marble Steps & Foundation Plinth */}
      <mesh position={[0, 0.25, 4.2]} receiveShadow castShadow>
        <boxGeometry args={[11.5, 0.5, 2.5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* Interior Hall Floor & Walls (Revealed when doors open & camera enters!) */}
      <mesh position={[0, 0.52, -1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 9]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.3} />
      </mesh>
      {/* Back Wall of Building Interior with 3D Holographic Display */}
      <mesh position={[0, 4.2, -5.8]}>
        <boxGeometry args={[11.2, 7.8, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 4.0, -5.5]}>
        <planeGeometry args={[8.5, 4.5]} />
        <meshStandardMaterial color="#022c22" emissive={bld.accent} emissiveIntensity={0.45} />
      </mesh>
      <Text position={[0, 5.1, -5.4]} fontSize={0.38} color="#ffffff" anchorX="center">
        {bld.name}
      </Text>
      <Text position={[0, 4.3, -5.4]} fontSize={0.22} color={bld.accent} anchorX="center">
        {bld.subtitle}
      </Text>
      <Text position={[0, 3.4, -5.4]} fontSize={0.18} color="#cbd5e1" anchorX="center">
        INTERACTIVE 3D INSTITUTIONAL CHAMBER • ADJUST PARAMETERS BELOW
      </Text>

      {/* Main Stone/Marble Facade Left, Right & Top of Entrance */}
      <mesh position={[-3.6, 4.2, 3.0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 7.6, 0.6]} />
        <meshStandardMaterial color={bld.wallColor} roughness={0.55} />
      </mesh>
      <mesh position={[3.6, 4.2, 3.0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 7.6, 0.6]} />
        <meshStandardMaterial color={bld.wallColor} roughness={0.55} />
      </mesh>
      <mesh position={[0, 6.6, 3.0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.8, 0.6]} />
        <meshStandardMaterial color={bld.wallColor} roughness={0.55} />
      </mesh>

      {/* Side & Roof Enclosure */}
      <mesh position={[-5.5, 4.2, -1.4]} castShadow>
        <boxGeometry args={[0.5, 7.6, 8.8]} />
        <meshStandardMaterial color={bld.wallColor} roughness={0.6} />
      </mesh>
      <mesh position={[5.5, 4.2, -1.4]} castShadow>
        <boxGeometry args={[0.5, 7.6, 8.8]} />
        <meshStandardMaterial color={bld.wallColor} roughness={0.6} />
      </mesh>
      <mesh position={[0, 8.2, -1.4]} castShadow>
        <boxGeometry args={[11.8, 0.7, 9.6]} />
        <meshStandardMaterial color={bld.trimColor} roughness={0.4} />
      </mesh>

      {/* Sovereign Dome on Top */}
      <mesh position={[0, 8.6, -1.0]} castShadow>
        <sphereGeometry args={[2.4, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.65} roughness={0.25} />
      </mesh>

      {/* 4 Grand Neoclassical Columns */}
      {[-4.4, -2.2, 2.2, 4.4].map((cx, i) => (
        <mesh key={i} position={[cx, 4.2, 4.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.4, 7.4, 16]} />
          <meshStandardMaterial color={bld.trimColor} roughness={0.35} />
        </mesh>
      ))}

      {/* Building Entablature Sign */}
      <RoundedBox args={[10.8, 1.2, 0.8]} position={[0, 8.3, 4.1]} radius={0.06} castShadow>
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
      </RoundedBox>
      <Text position={[0, 8.3, 4.55]} fontSize={0.38} color="#fbbf24" anchorX="center">
        {bld.name}
      </Text>

      {/* Animated Double Entrance Doors */}
      <group position={[-1.55, 2.7, 3.0]} ref={leftDoorRef}>
        <RoundedBox args={[1.5, 4.4, 0.16]} position={[0.75, 0, 0]} radius={0.03} castShadow>
          <meshStandardMaterial color="#b45309" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>
      <group position={[1.55, 2.7, 3.0]} ref={rightDoorRef}>
        <RoundedBox args={[1.5, 4.4, 0.16]} position={[-0.75, 0, 0]} radius={0.03} castShadow>
          <meshStandardMaterial color="#b45309" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>

      {/* Floating 3D Institution Badge */}
      <Html position={[0, 5.8, 4.8]} center distanceFactor={15} zIndexRange={[30, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.playClick()
            onSelectBuilding(bld)
          }}
          style={{
            cursor: 'pointer',
            background: hovered
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96))'
              : 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(12px)',
            border: `2px solid ${hovered ? bld.accent : 'rgba(245, 158, 11, 0.45)'}`,
            borderRadius: 16,
            padding: '8px 14px',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            boxShadow: hovered ? `0 0 28px ${bld.accent}` : '0 8px 20px rgba(0,0,0,0.6)',
            transform: hovered ? 'scale(1.08) translateY(-4px)' : 'scale(1)',
            transition: 'all 0.2s ease',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 900, color: bld.accent }}>{bld.badge}</div>
          <div style={{ fontSize: 13, fontWeight: 900, marginTop: 2 }}>{bld.name}</div>
          <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 2 }}>
            Click to Open Doors & Enter ({doneCount}/{bld.schemes.length} Simulated) →
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  3. WALKABLE PLAYER AVATAR & GSAP DISTRICT CAMERA RIG
// ─────────────────────────────────────────────────────────────────────────────
function DistrictCameraAndAvatar({ mode, playerPos, cameraPoseRef, mouseOffsetRef }) {
  const { camera } = useThree()
  const avatarRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pose = cameraPoseRef.current

    if (avatarRef.current) {
      avatarRef.current.position.lerp(new THREE.Vector3(playerPos.x, 0, playerPos.z), 0.15)
      avatarRef.current.position.y = Math.abs(Math.sin(t * 5)) * 0.06
    }

    if (mode === 'district') {
      // Third-person camera following the player walking along the Government Financial District
      const targetX = playerPos.x * 0.45 + mouseOffsetRef.current.x * 2.2
      const targetY = 5.2 + mouseOffsetRef.current.y * 1.0
      const targetZ = playerPos.z + 14.5
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08)
      camera.lookAt(playerPos.x * 0.3, 2.2, playerPos.z - 12)
    } else {
      // Driven by GSAP when zooming into a building's doors & interior
      camera.position.set(pose.x, pose.y, pose.z)
      camera.lookAt(pose.lookX, pose.lookY, pose.lookZ)
    }
  })

  return (
    <group ref={avatarRef} position={[0, 0, 18]}>
      {/* Player Character Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.85, 8, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      {/* Glowing Ground Ring Under Player */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.75, 32]} />
        <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  4. MAIN LEVEL 2 GOVERNMENT FINANCIAL DISTRICT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Level2GovernmentWorld(props) {
  const { state, update, addXP, go } = props
  const [viewMode, setViewMode] = useState('district') // 'district' | 'entering' | 'interior' | 'full_lab' | 'full_bank'
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [doorOpenProgress, setDoorOpenProgress] = useState(0)
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 18 })

  // Interactive 3D Interior Scheme Simulator State
  const [activeSchemeId, setActiveSchemeId] = useState('nsc')
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(7.7)
  const [years, setYears] = useState(5)

  const mouseOffsetRef = useRef({ x: 0, y: 0 })
  const cameraPoseRef = useRef({ x: 0, y: 5.2, z: 32, lookX: 0, lookY: 2.2, lookZ: 4 })

  const completedModules = state?.completedModules || []

  useEffect(() => {
    soundEngine.startAmbientMusic('government')
  }, [])

  // Keyboard WASD / Arrow Keys walking around the Financial District
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'district') return
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        setPlayerPos((p) => ({ ...p, z: Math.max(-28, p.z - 2.2) }))
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        setPlayerPos((p) => ({ ...p, z: Math.min(22, p.z + 2.2) }))
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        setPlayerPos((p) => ({ ...p, x: Math.max(-5, p.x - 1.5) }))
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        setPlayerPos((p) => ({ ...p, x: Math.min(5, p.x + 1.5) }))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode])

  // Cinematic Building Entry: Camera moves toward building -> doors open -> interior appears
  const handleSelectBuilding = (bld) => {
    setSelectedBuilding(bld)
    setViewMode('entering')
    setDoorOpenProgress(0)
    soundEngine.playCameraWhoosh(1.6)

    const firstSchemeId = bld.schemes[0] || 'ppf'
    const modObj = modules.find((m) => m.id === firstSchemeId) || modules[0]
    setActiveSchemeId(modObj.id)
    setMonthly(modObj.defMonthly)
    setRate(modObj.defRate)
    setYears(modObj.defYears)

    const pose = cameraPoseRef.current
    pose.x = playerPos.x * 0.45
    pose.y = 5.2
    pose.z = playerPos.z + 14.5
    pose.lookX = bld.position[0]
    pose.lookY = 3.0
    pose.lookZ = bld.position[2]

    const tl = gsap.timeline({
      onComplete: () => {
        setViewMode('interior')
      },
    })

    // Step 1: Camera approaches building colonnade
    tl.to(pose, {
      x: bld.entryCam.x,
      y: bld.entryCam.y,
      z: bld.entryCam.z,
      lookX: bld.entryCam.lookX,
      lookY: bld.entryCam.lookY,
      lookZ: bld.entryCam.lookZ,
      duration: 1.1,
      ease: 'power2.inOut',
    })
      // Step 2: Doors swing open
      .call(() => {
        soundEngine.playDoorOpen()
        setDoorOpenProgress(1)
      })
      // Step 3: Camera glides through the open doors into the 3D institutional chamber
      .to(pose, {
        x: bld.interiorCam.x,
        y: bld.interiorCam.y,
        z: bld.interiorCam.z,
        lookX: bld.interiorCam.lookX,
        lookY: bld.interiorCam.lookY,
        lookZ: bld.interiorCam.lookZ,
        duration: 1.1,
        ease: 'power3.out',
      })
  }

  const handleExitBuildingToDistrict = () => {
    soundEngine.playClick()
    setDoorOpenProgress(0)
    setViewMode('district')
    setSelectedBuilding(null)
  }

  const handleCompleteSchemeSim = () => {
    soundEngine.playXPFanfare()
    addXP(50)
    if (!completedModules.includes(activeSchemeId)) {
      const next = [...completedModules, activeSchemeId]
      update({
        completedModules: next,
        advancedUnlocked: next.length >= 2 ? true : state.advancedUnlocked,
      })
    }
  }

  const invested = monthly * years * 12
  const fv = calcFV(monthly, rate, years)
  const profit = Math.max(0, fv - invested)
  const profitPct = invested > 0 ? ((profit / invested) * 100).toFixed(1) : '0.0'

  if (viewMode === 'full_lab') {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 90,
            padding: '10px 24px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24' }}>
            🏛️ LEVEL 2 · FULL MULTI-ASSET MIXER & SIMULATOR SUITE
          </span>
          <button
            onClick={() => setViewMode('district')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#080705',
              borderRadius: 999,
              padding: '7px 18px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            🏛️ Return to 3D Government Financial District
          </button>
        </div>
        <Intermediate {...props} />
      </div>
    )
  }

  if (viewMode === 'full_bank') {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 90,
            padding: '10px 24px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24' }}>
            📝 LEVEL 2 · OFFICIAL INDIAN BANK SLIP WRITER & CYBER TRIBUNAL
          </span>
          <button
            onClick={() => setViewMode('district')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#080705',
              borderRadius: 999,
              padding: '7px 18px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            🏛️ Return to 3D Government Financial District
          </button>
        </div>
        <Advanced {...props} />
      </div>
    )
  }

  return (
    <div
      onMouseMove={(e) => {
        mouseOffsetRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 64px)',
        minHeight: '640px',
        overflow: 'hidden',
        background: '#0b1324',
      }}
    >
      {/* ─── 3D GOVERNMENT FINANCIAL DISTRICT CANVAS ─── */}
      <Canvas
        shadows
        camera={{ position: [0, 5.2, 32], fov: 50, near: 0.1, far: 250 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
      >
        <Suspense fallback={null}>
          <Sky sunPosition={[30, 18, -20]} turbidity={0.45} rayleigh={0.6} />
          <fog attach="fog" args={['#1e293b', 28, 110]} />

          <ambientLight intensity={0.6} />
          <hemisphereLight skyColor="#fef3c7" groundColor="#1e293b" intensity={0.55} />
          <directionalLight
            position={[25, 38, 20]}
            intensity={1.6}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <DistrictCameraAndAvatar
            mode={viewMode}
            playerPos={playerPos}
            cameraPoseRef={cameraPoseRef}
            mouseOffsetRef={mouseOffsetRef}
          />

          <GovernmentDistrictEnvironment onEnterLevel3={() => go('advanced')} />

          {DISTRICT_BUILDINGS.map((bld) => (
            <InstitutionalBuilding3D
              key={bld.id}
              bld={bld}
              isSelected={selectedBuilding?.id === bld.id}
              doorOpenProgress={doorOpenProgress}
              onSelectBuilding={handleSelectBuilding}
              completedModules={completedModules}
            />
          ))}

          <Sparkles count={100} scale={[40, 12, 75]} position={[0, 5, -5]} size={2.5} speed={0.3} color="#fbbf24" />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={80} blur={2.5} far={20} />
        </Suspense>
      </Canvas>

      {/* ─── TOP HUD BAR FOR LEVEL 2 GOVERNMENT FINANCIAL DISTRICT ─── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(15, 23, 42, 0.84)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(245, 158, 11, 0.5)',
            borderRadius: 18,
            padding: '12px 18px',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 900, color: '#fbbf24', letterSpacing: '1px' }}>
            🏛️ LEVEL 2 · GOVERNMENT FINANCIAL DISTRICT (TRUST & INSTITUTIONS)
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>
            {selectedBuilding ? `Inside: ${selectedBuilding.name}` : 'Sovereign Institutional Boulevard'}
          </div>
          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>
            {selectedBuilding
              ? 'Adjust 3D holographic investment sliders below or switch institutions'
              : 'Walk with WASD / Arrow Keys or click any Government Building (Post Office, Treasury, Bank)'}
          </div>
        </div>

        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            background: 'rgba(15, 23, 42, 0.84)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            borderRadius: 999,
            padding: '6px 10px',
          }}
        >
          <button
            onClick={() => go('beginner')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⬅ Level 1 School
          </button>
          <button
            onClick={() => setViewMode('full_lab')}
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⚖️ Savings Mixer Lab
          </button>
          <button
            onClick={() => setViewMode('full_bank')}
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid #c084fc',
              color: '#e9d5ff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            📝 Bank Slip Writer & Cyber Court
          </button>
          <button
            onClick={() => go('advanced')}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              border: '1px solid #7dd3fc',
              color: '#ffffff',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            🌆 Enter Level 3: Futuristic City →
          </button>
        </div>
      </div>

      {/* ─── BOTTOM QUICK BUILDING TELEPORTER & WALK CONTROLS (WHEN IN DISTRICT) ─── */}
      {viewMode === 'district' && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '95vw',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            borderRadius: 20,
            padding: '10px 14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          }}
        >
          {DISTRICT_BUILDINGS.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelectBuilding(b)}
              onMouseEnter={() => soundEngine.playHover()}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${b.accent}88`,
                borderRadius: 12,
                padding: '7px 12px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{b.badge.split(' ')[0]}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ─── 3D FLOATING HOLOGRAPHIC INSTITUTION INTERIOR PANEL (WHEN INSIDE A BUILDING) ─── */}
      {viewMode === 'interior' && selectedBuilding && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            width: '94%',
            maxWidth: 980,
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(8, 13, 26, 0.94))',
            backdropFilter: 'blur(24px)',
            border: `2px solid ${selectedBuilding.accent}`,
            borderRadius: 26,
            padding: '22px 26px',
            color: '#ffffff',
            boxShadow: `0 25px 70px rgba(0,0,0,0.85), 0 0 40px ${selectedBuilding.accent}44`,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {/* Building Interior Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: selectedBuilding.accent, letterSpacing: '1px' }}>
                {selectedBuilding.badge} · 3D INTERIOR HOLOGRAPHIC TERMINAL
              </div>
              <h2 className="font-display" style={{ fontSize: 28, margin: '2px 0 0' }}>
                {selectedBuilding.name}
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{selectedBuilding.description}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedBuilding.id === 'mixerlab' && (
                <button
                  onClick={() => setViewMode('full_lab')}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#022c22',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  ⚖️ Open Full Multi-Asset Mixer →
                </button>
              )}
              {(selectedBuilding.id === 'bankslips' || selectedBuilding.id === 'cyberbureau') && (
                <button
                  onClick={() => setViewMode('full_bank')}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    color: '#080705',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  📝 Open Interactive Bank Slip & Cyber Suite →
                </button>
              )}
              <button
                onClick={handleExitBuildingToDistrict}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                🚪 Step Outside to District Avenue
              </button>
            </div>
          </div>

          {/* Scheme Tabs Inside This Institution */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {selectedBuilding.schemes.map((schemeId) => {
              const mod = modules.find((m) => m.id === schemeId)
              if (!mod) return null
              const isAct = activeSchemeId === mod.id
              const isDone = completedModules.includes(mod.id)
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    soundEngine.playClick()
                    setActiveSchemeId(mod.id)
                    setMonthly(mod.defMonthly)
                    setRate(mod.defRate)
                    setYears(mod.defYears)
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 900,
                    background: isAct ? selectedBuilding.accent : 'rgba(255,255,255,0.06)',
                    color: isAct ? '#080705' : '#ffffff',
                    border: `1.5px solid ${isAct ? '#ffffff' : isDone ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                  }}
                >
                  {mod.emoji} {mod.name} ({mod.rate}) {isDone ? '✓' : ''}
                </button>
              )
            })}
          </div>

          {/* 3D Interactive Sliders + Live Holographic Output */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                  <span style={{ color: '#cbd5e1' }}>MONTHLY DEPOSIT</span>
                  <span style={{ color: '#fbbf24', fontWeight: 900 }}>{fmtINR(monthly)}/mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                  <span style={{ color: '#cbd5e1' }}>SOVEREIGN INTEREST RATE</span>
                  <span style={{ color: '#34d399', fontWeight: 900 }}>{rate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                  <span style={{ color: '#cbd5e1' }}>INVESTMENT TENURE</span>
                  <span style={{ color: '#38bdf8', fontWeight: 900 }}>{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Holographic Metrics Card */}
            <div
              style={{
                background: 'rgba(2, 6, 23, 0.65)',
                border: '1.5px solid rgba(255,255,255,0.14)',
                borderRadius: 18,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>PRINCIPAL</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8' }}>{fmtINR(invested)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>MATURITY VALUE</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>{fmtINR(fv)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>NET PROFIT (+{profitPct}%)</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>+{fmtINR(profit)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button
                  onClick={handleCompleteSchemeSim}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 999,
                    border: '1px solid #6ee7b7',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#022c22',
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {completedModules.includes(activeSchemeId)
                    ? '✅ SCHEME VERIFIED (+50 XP EARNED)'
                    : '✅ VERIFY & COMPLETE SCHEME (+50 XP)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
