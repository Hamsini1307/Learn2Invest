import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Sparkles,
  Text,
  Html,
  RoundedBox,
  Float,
  Stars,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import GLBModelEmblem from './GLBModelEmblem.jsx'
import soundEngine from '../utils/soundEngine.js'
import Advanced from '../screens/Advanced.jsx'
import SavedSimulationsManager from '../screens/SavedSimulationsManager.jsx'
import MessageScamAnalyzer from '../components/MessageScamAnalyzer.jsx'
import { advRates } from '../data.js'

const FUTURISTIC_STRUCTURES = [
  {
    id: 'portfolio_tower',
    icon: '🏢',
    name: 'PORTFOLIO TOWER',
    subtitle: '3D Holographic Portfolio Core • XP & Achievements Sanctuary',
    position: [0, 0, 0],
    height: 19,
    radius: 3.6,
    color: '#06b6d4',
    emissive: '#0891b2',
    accent: '#38bdf8',
    camPos: { x: 0, y: 6.5, z: 16, lookX: 0, lookY: 6.0, lookZ: 0 },
  },
  {
    id: 'ai_center',
    icon: '🤖',
    name: 'AI INVESTMENT CENTER',
    subtitle: 'AI Justification Engine • Smart Risk & Scam Shield',
    position: [-16, 0, 10],
    height: 12,
    radius: 2.5,
    color: '#10b981',
    emissive: '#059669',
    accent: '#34d399',
    camPos: { x: -10, y: 5.0, z: 18, lookX: -16, lookY: 5.5, lookZ: 10 },
  },
  {
    id: 'analytics_tower',
    icon: '📊',
    name: 'ADVANCED ANALYTICS TOWER',
    subtitle: '3D Compounding vs Inflation & Multi-Asset Yield Matrix',
    position: [16, 0, 10],
    height: 13,
    radius: 2.5,
    color: '#f59e0b',
    emissive: '#d97706',
    accent: '#fbbf24',
    camPos: { x: 10, y: 5.0, z: 18, lookX: 16, lookY: 5.5, lookZ: 10 },
  },
  {
    id: 'global_markets',
    icon: '🌐',
    name: 'GLOBAL MARKETS CENTER',
    subtitle: 'Sovereign Debt, Gold, Equity & Banking Documentation',
    position: [-18, 0, -10],
    height: 14,
    radius: 2.6,
    color: '#8b5cf6',
    emissive: '#6d28d9',
    accent: '#c084fc',
    camPos: { x: -11, y: 5.5, z: -2, lookX: -18, lookY: 6.0, lookZ: -10 },
  },
  {
    id: 'trading_hub',
    icon: '💹',
    name: 'TRADING & SIMULATION HUB',
    subtitle: 'Saved Simulations Vault & Historical Scenario Explorer',
    position: [18, 0, -10],
    height: 14,
    radius: 2.6,
    color: '#ec4899',
    emissive: '#be185d',
    accent: '#f472b6',
    camPos: { x: 11, y: 5.5, z: -2, lookX: 18, lookY: 6.0, lookZ: -10 },
  },
  {
    id: 'ai_assistant',
    icon: '🧠',
    name: 'AI FINANCIAL ASSISTANT',
    subtitle: 'Interactive Neural Financial Mentor & Voice Advisor',
    position: [0, 0, -20],
    height: 13.5,
    radius: 2.6,
    color: '#3b82f6',
    emissive: '#1d4ed8',
    accent: '#60a5fa',
    camPos: { x: 0, y: 5.5, z: -10, lookX: 0, lookY: 6.0, lookZ: -20 },
  },
]

function fmtINR(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

// ─────────────────────────────────────────────────────────────────────────────
//  1. FLYING VEHICLES & ANIMATED CYBER CITY SKYLINE
// ─────────────────────────────────────────────────────────────────────────────
function FlyingVehiclesTraffic() {
  const vehiclesRef = useRef([])
  const vehicles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        radius: 22 + (i % 4) * 8,
        height: 5 + (i % 5) * 3.2,
        speed: (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 4) * 0.08),
        phase: (i * Math.PI * 2) / 18,
        color: ['#38bdf8', '#f43f5e', '#fbbf24', '#34d399', '#c084fc'][i % 5],
      })),
    []
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    vehiclesRef.current.forEach((el, idx) => {
      if (!el) return
      const v = vehicles[idx]
      const angle = t * v.speed + v.phase
      el.position.x = Math.cos(angle) * v.radius
      el.position.z = Math.sin(angle) * v.radius
      el.position.y = v.height + Math.sin(t * 2 + idx) * 0.3
      el.rotation.y = -angle + (v.speed > 0 ? 0 : Math.PI)
    })
  })

  return (
    <group>
      {vehicles.map((v, i) => (
        <group key={v.id} ref={(el) => (vehiclesRef.current[i] = el)}>
          <RoundedBox args={[0.45, 0.16, 1.35]} radius={0.06}>
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </RoundedBox>
          {/* Glowing Thruster Trail */}
          <mesh position={[0, 0, -0.7]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={v.color} emissive={v.color} emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CyberCityBackgroundSkyline() {
  const towers = useMemo(() => {
    const arr = []
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2
      const dist = 46 + (i % 3) * 10
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      const h = 14 + (i % 6) * 5.5
      const w = 3.2 + (i % 3) * 1.2
      const accent = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][i % 5]
      arr.push({ id: i, x, z, h, w, accent })
    }
    return arr
  }, [])

  return (
    <group>
      {towers.map((t) => (
        <group key={t.id} position={[t.x, t.h / 2, t.z]}>
          <mesh>
            <boxGeometry args={[t.w, t.h, t.w]} />
            <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Neon Vertical Accent Strip */}
          <mesh position={[0, 0, t.w / 2 + 0.02]}>
            <planeGeometry args={[0.35, t.h * 0.9]} />
            <meshBasicMaterial color={t.accent} />
          </mesh>
          {/* Rooftop Beacon */}
          <mesh position={[0, t.h / 2 + 0.3, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color={t.accent} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  2. FUTURISTIC SKYSCRAPER STRUCTURE & FLOATING HOLOGRAM PLATFORMS
// ─────────────────────────────────────────────────────────────────────────────
function FuturisticSkyscraper({ struct, onSelect, isInsideTower }) {
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef()
  const isCenterTower = struct.id === 'portfolio_tower'

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (isCenterTower ? 0.9 : 0.5)
    }
  })

  if (isCenterTower && isInsideTower) {
    // When inside the Portfolio Tower, hide the outer opaque shell so the 3D Hologram Sanctuary is in full view!
    return null
  }

  return (
    <group
      position={struct.position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        soundEngine.playHover()
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        soundEngine.playClick()
        onSelect(struct)
      }}
    >
      {/* Glowing Neon Base Platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[struct.radius * 1.35, struct.radius * 1.5, 0.4, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={struct.emissive}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Main Futuristic Glass & Metallic Spire */}
      <mesh position={[0, struct.height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[struct.radius * 0.72, struct.radius, struct.height, isCenterTower ? 8 : 6]} />
        <meshPhysicalMaterial
          color="#091326"
          emissive={struct.emissive}
          emissiveIntensity={hovered ? 0.85 : 0.32}
          metalness={0.85}
          roughness={0.12}
          clearcoat={1}
        />
      </mesh>

      {/* Glowing Orbital Hologram Ring */}
      <mesh ref={ringRef} position={[0, struct.height * 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[struct.radius * 1.25, 0.08, 16, 48]} />
        <meshStandardMaterial color={struct.accent} emissive={struct.accent} emissiveIntensity={2.2} />
      </mesh>

      {/* Centerpiece GLB Crystal on Top of Portfolio Tower */}
      {isCenterTower && (
        <GLBModelEmblem
          url="/models/portfolio_crystal.glb"
          position={[0, struct.height + 2.2, 0]}
          scale={1.1}
        />
      )}

      {/* Floating 3D Building Label */}
      <Html position={[0, struct.height + (isCenterTower ? 4.8 : 2.0), 0]} center distanceFactor={22} zIndexRange={[30, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.playClick()
            onSelect(struct)
          }}
          style={{
            cursor: 'pointer',
            background: hovered
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(15, 23, 42, 0.96))'
              : 'rgba(9, 15, 30, 0.85)',
            backdropFilter: 'blur(12px)',
            border: `2px solid ${hovered ? '#ffffff' : struct.accent}`,
            borderRadius: 16,
            padding: isCenterTower ? '10px 18px' : '7px 14px',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            boxShadow: `0 0 30px ${struct.accent}66`,
            transform: hovered ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
            transition: 'all 0.2s',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <div style={{ fontSize: isCenterTower ? 14 : 12, fontWeight: 900 }}>
            {struct.icon} {struct.name}
          </div>
          <div style={{ fontSize: 10, color: hovered ? '#ffffff' : struct.accent, fontWeight: 800, marginTop: 2 }}>
            {isCenterTower ? '🏆 ULTIMATE DESTINATION · CLICK TO ENTER 3D HOLOGRAM' : 'Click to Enter Hub →'}
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  3. INSIDE PORTFOLIO TOWER: 3D HOLOGRAPHIC PORTFOLIO & FLOATING XP/BADGES
// ─────────────────────────────────────────────────────────────────────────────
function PortfolioTowerHologramInterior({ portfolioAlloc, monthlyTotal, years, xp, watchedCount, modulesCount }) {
  const hologramRingRef = useRef()
  const schemes = Object.keys(portfolioAlloc)
  const colors = {
    PPF: '#10b981',
    FD: '#38bdf8',
    GOLD: '#fbbf24',
    NSC: '#f59e0b',
    SSY: '#ec4899',
    RD: '#a855f7',
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (hologramRingRef.current) {
      hologramRingRef.current.rotation.y = t * 0.45
    }
  })

  const badges = [
    { label: `⭐ ${xp || 0} TOTAL XP`, sub: 'Live Experience', col: '#fbbf24', angle: 0 },
    { label: `🎓 ${watchedCount}/5 LESSONS`, sub: 'Level 1 School', col: '#10b981', angle: (Math.PI * 2) / 4 },
    { label: `🏛️ ${modulesCount}/6 SIMULATORS`, sub: 'Level 2 District', col: '#38bdf8', angle: Math.PI },
    { label: `🏆 PORTFOLIO ARCHITECT`, sub: 'Level 3 Mastery', col: '#ec4899', angle: (Math.PI * 3) / 2 },
  ]

  return (
    <group position={[0, 0.2, 0]}>
      {/* Holographic Projector Pedestal */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 7.5, 0.6, 48]} />
        <meshStandardMaterial color="#09152b" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Rotating Holographic Base Rings */}
      <group ref={hologramRingRef} position={[0, 0.7, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.8, 0.06, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.2, 0.04, 16, 64]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* Orbiting 3D Floating XP & Achievement Crystals */}
        {badges.map((b, idx) => {
          const bx = Math.cos(b.angle) * 5.6
          const bz = Math.sin(b.angle) * 5.6
          return (
            <Float key={idx} speed={2.2} rotationIntensity={0.5} floatIntensity={0.6} position={[bx, 3.6, bz]}>
              <mesh>
                <octahedronGeometry args={[0.55, 0]} />
                <meshStandardMaterial color={b.col} emissive={b.col} emissiveIntensity={1.6} wireframe />
              </mesh>
              <Html position={[0, 0.9, 0]} center distanceFactor={14} zIndexRange={[20, 0]}>
                <div
                  style={{
                    background: 'rgba(9, 15, 30, 0.88)',
                    border: `1.5px solid ${b.col}`,
                    borderRadius: 12,
                    padding: '5px 10px',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    fontSize: 10,
                    fontWeight: 900,
                    textAlign: 'center',
                    boxShadow: `0 0 18px ${b.col}66`,
                  }}
                >
                  <div>{b.label}</div>
                  <div style={{ fontSize: 9, color: b.col }}>{b.sub}</div>
                </div>
              </Html>
            </Float>
          )
        })}
      </group>

      {/* 3D Animated Holographic Portfolio Bars (Height scales with allocation %) */}
      {schemes.map((key, idx) => {
        const pct = portfolioAlloc[key] || 0
        const angle = (idx / schemes.length) * Math.PI * 2
        const r = 2.6
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const barHeight = Math.max(0.4, (pct / 100) * 6.8)
        const col = colors[key] || '#38bdf8'
        const monthlyAmt = Math.round((pct / 100) * monthlyTotal)

        return (
          <group key={key} position={[x, 0.6, z]}>
            <mesh position={[0, barHeight / 2, 0]}>
              <cylinderGeometry args={[0.48, 0.48, barHeight, 24]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={1.2}
                transparent
                opacity={0.85}
              />
            </mesh>
            <Text
              position={[0, barHeight + 0.55, 0]}
              fontSize={0.28}
              color="#ffffff"
              anchorX="center"
            >
              {`${key} (${pct}%)`}
            </Text>
            <Text
              position={[0, barHeight + 0.22, 0]}
              fontSize={0.19}
              color={col}
              anchorX="center"
            >
              {`₹${monthlyAmt.toLocaleString('en-IN')}/mo`}
            </Text>
          </group>
        )
      })}

      {/* Central GLB Hologram Crystal */}
      <GLBModelEmblem url="/models/portfolio_crystal.glb" position={[0, 4.2, 0]} scale={0.95} />
    </group>
  )
}

function FuturisticCameraRig({ cameraPoseRef, mouseOffsetRef }) {
  const { camera } = useThree()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pose = cameraPoseRef.current
    const ox = Math.sin(t * 0.4) * 0.8 + mouseOffsetRef.current.x * 1.8
    const oy = Math.cos(t * 0.5) * 0.35 + mouseOffsetRef.current.y * 0.9
    camera.position.lerp(new THREE.Vector3(pose.x + ox, pose.y + oy, pose.z), 0.08)
    camera.lookAt(pose.lookX, pose.lookY, pose.lookZ)
  })
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
//  4. MAIN LEVEL 3 FUTURISTIC FINANCIAL CITY & PORTFOLIO TOWER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Level3FuturisticWorld(props) {
  const {
    state,
    update,
    addXP,
    go,
    onChatToggle,
    savedSimulations = [],
    savedPortfolioSimulations = [],
    onSavePortfolio,
    onUpdateSavedSimulation,
    onDeleteSavedSimulation,
    onUpdateSavedPortfolio,
    onDeleteSavedPortfolio,
  } = props

  const [cityMode, setCityMode] = useState('city') // 'city' | 'portfolio_tower'
  const [activeBuildingModal, setActiveBuildingModal] = useState(null) // 'ai_center' | 'analytics_tower' | 'global_markets' | 'trading_hub' | null

  // Interactive 3D Portfolio Hologram State
  const [portfolioAlloc, setPortfolioAlloc] = useState(
    state?.allocations || { PPF: 25, FD: 20, GOLD: 20, NSC: 15, SSY: 10, RD: 10 }
  )
  const [monthlyTotal, setMonthlyTotal] = useState(15000)
  const [years, setYears] = useState(10)
  const [savedToast, setSavedToast] = useState('')

  const mouseOffsetRef = useRef({ x: 0, y: 0 })
  const cameraPoseRef = useRef({ x: 0, y: 11, z: 29, lookX: 0, lookY: 4, lookZ: 0 })

  useEffect(() => {
    soundEngine.startAmbientMusic('futuristic')
  }, [])

  const flyToPortfolioTowerInterior = () => {
    soundEngine.playCameraWhoosh(1.6)
    setCityMode('portfolio_tower')
    setActiveBuildingModal(null)
    gsap.to(cameraPoseRef.current, {
      x: 0,
      y: 4.6,
      z: 11.2,
      lookX: 0,
      lookY: 2.8,
      lookZ: 0,
      duration: 1.5,
      ease: 'power3.inOut',
    })
  }

  const flyToCityOverview = () => {
    soundEngine.playCameraWhoosh(1.2)
    setCityMode('city')
    setActiveBuildingModal(null)
    gsap.to(cameraPoseRef.current, {
      x: 0,
      y: 11,
      z: 29,
      lookX: 0,
      lookY: 4,
      lookZ: 0,
      duration: 1.4,
      ease: 'power3.inOut',
    })
  }

  const handleSelectStructure = (struct) => {
    if (struct.id === 'portfolio_tower') {
      flyToPortfolioTowerInterior()
      return
    }
    if (struct.id === 'ai_assistant') {
      if (onChatToggle) onChatToggle()
      return
    }
    soundEngine.playCameraWhoosh(1.1)
    gsap.to(cameraPoseRef.current, {
      ...struct.camPos,
      duration: 1.1,
      ease: 'power2.out',
      onComplete: () => {
        setActiveBuildingModal(struct.id)
      },
    })
  }

  const handleAllocationSlider = (key, val) => {
    const others = Object.keys(portfolioAlloc).filter((k) => k !== key)
    const remaining = 100 - val
    const otherSum = others.reduce((s, k) => s + (portfolioAlloc[k] || 0), 0)
    const next = { ...portfolioAlloc, [key]: val }
    others.forEach((k) => {
      next[k] = otherSum > 0 ? Math.max(0, Math.round((portfolioAlloc[k] / otherSum) * remaining)) : Math.floor(remaining / others.length)
    })
    const total = Object.values(next).reduce((a, b) => a + b, 0)
    if (total !== 100 && others.length > 0) {
      next[others[0]] = Math.max(0, next[others[0]] + (100 - total))
    }
    setPortfolioAlloc(next)
  }

  // Compute live 3D Portfolio Performance
  const weightedRate = Object.entries(portfolioAlloc).reduce(
    (acc, [k, pct]) => acc + (pct / 100) * (advRates[k] || 7.5),
    0
  )
  const mRate = weightedRate / 100 / 12
  const nMonths = years * 12
  const totalInvested = monthlyTotal * nMonths
  const totalProjected =
    mRate > 0
      ? Math.round(monthlyTotal * ((Math.pow(1 + mRate, nMonths) - 1) / mRate) * (1 + mRate))
      : totalInvested
  const netGain = Math.max(0, totalProjected - totalInvested)

  const handleSave3DPortfolio = () => {
    soundEngine.playXPFanfare()
    addXP(100)
    update({ allocations: portfolioAlloc })
    if (onSavePortfolio) {
      onSavePortfolio({
        id: Date.now(),
        name: `3D Tower Hologram (${years}Y @ ${weightedRate.toFixed(1)}%)`,
        date: new Date().toLocaleDateString('en-IN'),
        results: {
          totalInvested,
          totalReturns: totalProjected,
          totalProfit: netGain,
          profitPct: totalInvested > 0 ? ((netGain / totalInvested) * 100).toFixed(1) : '0.0',
          maxHorizon: years,
        },
      })
    }
    setSavedToast('🏆 3D Holographic Portfolio Saved & +100 XP Awarded!')
    setTimeout(() => setSavedToast(''), 4000)
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
        background: '#030712',
      }}
    >
      {/* ─── 3D FUTURISTIC FINANCIAL CITY & PORTFOLIO TOWER CANVAS ─── */}
      <Canvas
        shadows
        camera={{ position: [0, 11, 29], fov: 52, near: 0.1, far: 300 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#030712']} />
          <fog attach="fog" args={['#030712', 26, 120]} />
          <Stars radius={90} depth={50} count={3500} factor={4} saturation={0.5} fade speed={1.2} />

          <ambientLight intensity={0.5} />
          <pointLight position={[0, 22, 0]} color="#38bdf8" intensity={2.5} distance={70} />
          <pointLight position={[-20, 14, 12]} color="#10b981" intensity={1.8} distance={50} />
          <pointLight position={[20, 14, 12]} color="#ec4899" intensity={1.8} distance={50} />

          <FuturisticCameraRig cameraPoseRef={cameraPoseRef} mouseOffsetRef={mouseOffsetRef} />

          {/* Reflective Cyber City Floor & Glowing Neon Grid */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[180, 180]} />
            <meshStandardMaterial color="#050b16" metalness={0.9} roughness={0.15} />
          </mesh>
          <gridHelper args={[140, 70, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />

          {/* Glowing Radial Pathways Connecting All Futuristic Buildings to Portfolio Tower */}
          {FUTURISTIC_STRUCTURES.filter((s) => s.id !== 'portfolio_tower').map((s) => {
            const len = Math.hypot(s.position[0], s.position[2])
            const angle = Math.atan2(s.position[0], s.position[2])
            return (
              <mesh
                key={s.id}
                position={[s.position[0] / 2, 0.03, s.position[2] / 2]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[0.55, 0.04, len]} />
                <meshBasicMaterial color={s.accent} />
              </mesh>
            )
          })}

          {/* Animated City Background & Flying Vehicles */}
          <CyberCityBackgroundSkyline />
          <FlyingVehiclesTraffic />

          {/* 6 Futuristic Buildings */}
          {FUTURISTIC_STRUCTURES.map((struct) => (
            <FuturisticSkyscraper
              key={struct.id}
              struct={struct}
              onSelect={handleSelectStructure}
              isInsideTower={cityMode === 'portfolio_tower'}
            />
          ))}

          {/* 3D Holographic Portfolio Sanctuary Inside Portfolio Tower */}
          {cityMode === 'portfolio_tower' && (
            <PortfolioTowerHologramInterior
              portfolioAlloc={portfolioAlloc}
              monthlyTotal={monthlyTotal}
              years={years}
              xp={state?.xp || 0}
              watchedCount={(state?.lessonsWatched || []).length}
              modulesCount={(state?.completedModules || []).length}
            />
          )}

          <Sparkles count={220} scale={[55, 22, 55]} position={[0, 8, 0]} size={3.2} speed={0.6} color="#38bdf8" />
        </Suspense>
      </Canvas>

      {/* ─── TOP HUD FOR LEVEL 3 FUTURISTIC FINANCIAL CITY ─── */}
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
            background: 'rgba(9, 15, 30, 0.85)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(56, 189, 248, 0.55)',
            borderRadius: 18,
            padding: '12px 18px',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', letterSpacing: '1px' }}>
            🌆 LEVEL 3 · FUTURISTIC FINANCIAL ECOSYSTEM & PORTFOLIO TOWER
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>
            {cityMode === 'portfolio_tower'
              ? '🏆 Inside Portfolio Tower — 3D Hologram Sanctuary'
              : 'Futuristic Financial Metropolis'}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            {cityMode === 'portfolio_tower'
              ? 'Sculpt your 3D holographic portfolio below & watch the 3D bars morph in real time'
              : 'Click the central Portfolio Tower or any surrounding futuristic hub'}
          </div>
        </div>

        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            background: 'rgba(9, 15, 30, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(56, 189, 248, 0.45)',
            borderRadius: 999,
            padding: '6px 10px',
          }}
        >
          <button
            onClick={() => go('intermediate')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⬅ Level 2 District
          </button>
          {cityMode === 'portfolio_tower' ? (
            <button
              onClick={flyToCityOverview}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                border: '1px solid #7dd3fc',
                color: '#ffffff',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              🌆 Exit to Futuristic City Skyline
            </button>
          ) : (
            <button
              onClick={flyToPortfolioTowerInterior}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: '1px solid #fde68a',
                color: '#080705',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              🏆 Enter 3D Portfolio Tower
            </button>
          )}
        </div>
      </div>

      {/* ─── BOTTOM DOCK OF FUTURISTIC BUILDINGS (WHEN IN CITY VIEW) ─── */}
      {cityMode === 'city' && !activeBuildingModal && (
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
            background: 'rgba(9, 15, 30, 0.86)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(56, 189, 248, 0.45)',
            borderRadius: 20,
            padding: '10px 14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}
        >
          {FUTURISTIC_STRUCTURES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectStructure(s)}
              onMouseEnter={() => soundEngine.playHover()}
              style={{
                background: s.id === 'portfolio_tower' ? 'rgba(6, 182, 212, 0.22)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${s.accent}`,
                borderRadius: 12,
                padding: '8px 12px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* ─── FLOATING 3D HOLOGRAPHIC PORTFOLIO DECK (WHEN INSIDE PORTFOLIO TOWER) ─── */}
      {cityMode === 'portfolio_tower' && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 35,
            width: '95%',
            maxWidth: 1060,
            background: 'linear-gradient(145deg, rgba(8, 15, 32, 0.84), rgba(4, 9, 20, 0.92))',
            backdropFilter: 'blur(22px)',
            border: '2px solid rgba(56, 189, 248, 0.6)',
            borderRadius: 26,
            padding: '18px 24px',
            color: '#ffffff',
            boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 45px rgba(6, 182, 212, 0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {savedToast && (
            <div
              style={{
                marginBottom: 10,
                padding: '8px 14px',
                borderRadius: 12,
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                fontSize: 12,
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              {savedToast}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18, alignItems: 'center' }}>
            {/* Asset Allocation Sliders that morph the 3D Hologram Bars */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', marginBottom: 8 }}>
                🎛️ LIVE 3D HOLOGRAM ASSET ALLOCATION (100% TOTAL)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(portfolioAlloc).map(([k, pct]) => (
                  <div key={k} style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 900 }}>
                      <span>{k} ({advRates[k]}%)</span>
                      <span style={{ color: '#fbbf24' }}>{pct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) => handleAllocationSlider(k, Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Capital, Horizon & Live Holographic Projection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>VIRTUAL MONTHLY SIP</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#38bdf8' }}>{fmtINR(monthlyTotal)}</div>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={monthlyTotal}
                    onChange={(e) => setMonthlyTotal(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>HORIZON ({years} YRS)</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fbbf24' }}>Avg {weightedRate.toFixed(2)}% p.a.</div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                <div style={{ background: 'rgba(2, 6, 23, 0.7)', padding: 8, borderRadius: 12, border: '1px solid rgba(56,189,248,0.3)' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 800 }}>INVESTED</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>{fmtINR(totalInvested)}</div>
                </div>
                <div style={{ background: 'rgba(2, 6, 23, 0.7)', padding: 8, borderRadius: 12, border: '1px solid rgba(16,185,129,0.4)' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 800 }}>3D PORTFOLIO VALUE</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>{fmtINR(totalProjected)}</div>
                </div>
                <div style={{ background: 'rgba(2, 6, 23, 0.7)', padding: 8, borderRadius: 12, border: '1px solid rgba(245,158,11,0.4)' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 800 }}>NET WEALTH GAIN</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>+{fmtINR(netGain)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSave3DPortfolio}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 999,
                    border: '1px solid #6ee7b7',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#022c22',
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  💾 SAVE 3D PORTFOLIO & CLAIM +100 XP
                </button>
                <button
                  onClick={() => setActiveBuildingModal('trading_hub')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 999,
                    border: '1px solid #38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#bae6fd',
                    fontWeight: 800,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  📂 History ({savedPortfolioSimulations.length + savedSimulations.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FUTURISTIC BUILDING OVERLAY MODALS ─── */}
      {activeBuildingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 210,
            background: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(18px)',
            overflowY: 'auto',
            padding: '24px 16px',
          }}
        >
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>
                🌆 LEVEL 3 FUTURISTIC HUB · {activeBuildingModal.toUpperCase().replace('_', ' ')}
              </div>
              <button
                onClick={flyToCityOverview}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: 999,
                  padding: '8px 20px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ✕ Return to 3D Futuristic Skyline
              </button>
            </div>

            {activeBuildingModal === 'ai_center' && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '2px solid #10b981',
                  borderRadius: 24,
                  padding: 24,
                  color: '#ffffff',
                }}
              >
                <h2 className="font-display" style={{ fontSize: 30, marginBottom: 8 }}>
                  🤖 AI INVESTMENT & CYBER SCAM SHIELD CENTER
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18 }}>
                  Analyze suspicious financial messages with our neural heuristic detector or launch the AI Financial Mentor.
                </p>
                <MessageScamAnalyzer />
              </div>
            )}

            {activeBuildingModal === 'analytics_tower' && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '2px solid #f59e0b',
                  borderRadius: 24,
                  padding: 28,
                  color: '#ffffff',
                }}
              >
                <h2 className="font-display" style={{ fontSize: 32, marginBottom: 12 }}>
                  📊 ADVANCED ANALYTICS TOWER · REAL VS INFLATION-ADJUSTED WEALTH
                </h2>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 20 }}>
                  Assuming India&apos;s benchmark consumer inflation of 5.1% p.a., compare how your 3D Portfolio beats inflation over {years} years:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 16, border: '1px solid #38bdf8' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>NOMINAL MATURITY CORPUS</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>{fmtINR(totalProjected)}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 16, border: '1px solid #10b981' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>INFLATION-ADJUSTED PURCHASING POWER</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', marginTop: 4 }}>
                      {fmtINR(totalProjected / Math.pow(1.051, years))}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 16, border: '1px solid #fbbf24' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>REAL ALPHA OVER INFLATION</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fbbf24', marginTop: 4 }}>
                      +{(weightedRate - 5.1).toFixed(2)}% p.a.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeBuildingModal === 'global_markets' && <Advanced {...props} />}

            {activeBuildingModal === 'trading_hub' && (
              <SavedSimulationsManager
                {...props}
                savedSimulations={savedSimulations}
                savedPortfolioSimulations={savedPortfolioSimulations}
                onUpdateSavedSimulation={onUpdateSavedSimulation}
                onDeleteSavedSimulation={onDeleteSavedSimulation}
                onUpdateSavedPortfolio={onUpdateSavedPortfolio}
                onDeleteSavedPortfolio={onDeleteSavedPortfolio}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
