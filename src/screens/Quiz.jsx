import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, RoundedBox, Float, Sparkles, Sky, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { quizQuestions } from '../data.js'
import { CuteChibiAvatarSVG } from '../components/AiAvatarSelector.jsx'
import soundEngine from '../utils/soundEngine.js'

const REQUIRED_LEVEL1_VIDEOS = ['video1', 'video2', 'video3', 'video4', 'video5']

const CUTE_QUESTION_THEMES = [
  { badgeIcon: '🌸🐣', mascot: '🐷👑', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.16)', tag: 'Cute Piggy Bank Challenge' },
  { badgeIcon: '🧸✨', mascot: '🐱🪙', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.16)', tag: 'Lucky Cat Savings Quest' },
  { badgeIcon: '🌱💎', mascot: '🌱📈', color: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', tag: 'Sprout Growth Puzzle' },
  { badgeIcon: '🎀🌟', mascot: '👑💰', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', tag: 'Golden Crown Treasury' },
  { badgeIcon: '🦋🍭', mascot: '🧁✨', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.16)', tag: 'Smart Habits Checkpoint' },
]

const CUTE_OPTION_ICONS = ['🌸', '✨', '🍀', '💎']

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HIGH-SPEED KINETIC "150 XP" ANIMATED ENTRY WITH SPEED LINES & SLAM
// ═══════════════════════════════════════════════════════════════════════════════
export function FastMotionXPBurst({ show, xpAmount = 150, label = 'QUIZ MASTERED!' }) {
  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.32) 0%, rgba(4, 9, 20, 0.86) 75%)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        animation: 'xpBgFlash 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Fast Motion Speed Lines */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.45 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${(i * 6) % 100}%`,
              left: '-20%',
              width: '140%',
              height: i % 2 === 0 ? 3 : 1.5,
              background: 'linear-gradient(90deg, transparent, #fde047, #f472b6, transparent)',
              transform: `rotate(${(i - 9) * 3}deg)`,
              animation: `speedLineDash ${0.22 + (i % 4) * 0.06}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Central Slamming 150 XP Badge */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '32px 52px',
          borderRadius: 32,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 18, 52, 0.95))',
          border: '3px solid #fde047',
          boxShadow: '0 0 80px rgba(250, 204, 21, 0.85), 0 0 140px rgba(236, 72, 153, 0.6)',
          animation: 'xpFastSlam 0.42s cubic-bezier(0.18, 1.45, 0.32, 1) forwards',
        }}
      >
        <div style={{ fontSize: 46, marginBottom: 4, animation: 'cuteBounce 0.5s ease infinite alternate' }}>
          🎉👑✨
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '3px',
            color: '#f472b6',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          ⚡ {label} ⚡
        </div>
        <div
          className="font-display"
          style={{
            fontSize: 82,
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(180deg, #ffffff 0%, #fef08a 45%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.8))',
            letterSpacing: '2px',
          }}
        >
          +{xpAmount} XP
        </div>
        <div
          style={{
            marginTop: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '6px 20px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 900,
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.6)',
          }}
        >
          <span>🌟 LEVEL 1 EXAM REWARD UNLOCKED!</span>
        </div>
      </div>

      <style>{`
        @keyframes xpFastSlam {
          0% { transform: scale(2.6) rotate(-8deg) translateY(-40px); opacity: 0; filter: blur(12px); }
          60% { transform: scale(0.92) rotate(2deg) translateY(0); opacity: 1; filter: blur(0px); }
          80% { transform: scale(1.06) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes speedLineDash {
          0% { transform: translateX(-40%) scaleX(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(40%) scaleX(1.2); opacity: 0; }
        }
        @keyframes cuteBounce {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-8px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. 3D WALKING CUTE GIRL (LUNA) & CUTE BOY (LEO) CHARACTER FOR EXAM HALL ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
function WalkingExamCharacter3D({
  gender = 'female',
  walkRef,
  offsetX = 0,
  offsetZ = 0,
  scale = 1.18,
  isPrimary = true,
  celebrating = false,
}) {
  const groupRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const headRef = useRef()

  const isGirl = gender === 'female'

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    const walkState = walkRef.current
    const isWalking = walkState.isWalking

    // Position along aisle from z=11.8 (outside doors) to z=-1.5 (Candidate Exam Desk)
    const currentZ = THREE.MathUtils.lerp(11.8 + offsetZ, -1.5 + offsetZ, walkState.progress)
    groupRef.current.position.x = offsetX
    groupRef.current.position.z = currentZ

    if (isWalking) {
      // Face towards the front Exam Stage (-Z direction => rotation.y = Math.PI)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI, 0.15)
      const stride = Math.sin(t * 11 + (isPrimary ? 0 : 1.5))
      groupRef.current.position.y = Math.abs(stride) * 0.12
      if (leftLegRef.current) leftLegRef.current.rotation.x = stride * 0.65
      if (rightLegRef.current) rightLegRef.current.rotation.x = -stride * 0.65
      if (leftArmRef.current) leftArmRef.current.rotation.x = -stride * 0.55
      if (rightArmRef.current) rightArmRef.current.rotation.x = stride * 0.55
      if (headRef.current) headRef.current.rotation.z = Math.sin(t * 5.5) * 0.05
    } else {
      // Arrived at desk! Face slightly towards camera or stage & celebrate on correct answers
      const targetRotY = isPrimary ? 0.25 : -0.3
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08)

      if (celebrating) {
        groupRef.current.position.y = Math.abs(Math.sin(t * 12)) * 0.32
        if (leftArmRef.current) leftArmRef.current.rotation.x = -2.4 + Math.sin(t * 14) * 0.3
        if (rightArmRef.current) rightArmRef.current.rotation.x = -2.4 - Math.sin(t * 14) * 0.3
      } else {
        groupRef.current.position.y = Math.sin(t * 2.5 + (isGirl ? 0 : 1.4)) * 0.04
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.15)
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.15)
        if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.15)
        if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.35, 0.15)
      }
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 1.8) * 0.12
    }
  })

  return (
    <group ref={groupRef} position={[offsetX, 0, 11.8 + offsetZ]} scale={scale}>
      {/* Soft Ground Shadow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color={isGirl ? '#f472b6' : '#38bdf8'} transparent opacity={0.32} />
      </mesh>

      {/* Left & Right Animated Legs */}
      <group ref={leftLegRef} position={[-0.12, 0.42, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.24, 8, 12]} />
          <meshStandardMaterial color={isGirl ? '#fce7f3' : '#1e3a8a'} roughness={0.4} />
        </mesh>
        <RoundedBox args={[0.16, 0.1, 0.24]} position={[0, -0.36, 0.04]} radius={0.04}>
          <meshStandardMaterial color={isGirl ? '#be185d' : '#0284c7'} />
        </RoundedBox>
      </group>

      <group ref={rightLegRef} position={[0.12, 0.42, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.24, 8, 12]} />
          <meshStandardMaterial color={isGirl ? '#fce7f3' : '#1e3a8a'} roughness={0.4} />
        </mesh>
        <RoundedBox args={[0.16, 0.1, 0.24]} position={[0, -0.36, 0.04]} radius={0.04}>
          <meshStandardMaterial color={isGirl ? '#be185d' : '#0284c7'} />
        </RoundedBox>
      </group>

      {/* Cute School Uniform Torso */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.56, 20]} />
        <meshStandardMaterial color={isGirl ? '#ec4899' : '#2563eb'} roughness={0.35} />
      </mesh>

      {/* White Shirt Collar & Gold Ribbon/Tie */}
      <mesh position={[0, 0.91, 0.14]}>
        <boxGeometry args={[0.24, 0.08, 0.12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.82, 0.19]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.35} />
      </mesh>

      {/* Cute Pastel School Backpack */}
      <RoundedBox args={[0.36, 0.4, 0.2]} position={[0, 0.7, -0.2]} radius={0.07} castShadow>
        <meshStandardMaterial color={isGirl ? '#f9a8d4' : '#4ade80'} roughness={0.4} />
      </RoundedBox>

      {/* Left & Right Animated Arms */}
      <group ref={leftArmRef} position={[-0.27, 0.86, 0]}>
        <mesh position={[-0.03, -0.16, 0]} rotation={[0, 0, 0.22]} castShadow>
          <capsuleGeometry args={[0.06, 0.24, 8, 12]} />
          <meshStandardMaterial color={isGirl ? '#f472b6' : '#3b82f6'} />
        </mesh>
        <mesh position={[-0.06, -0.31, 0]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#fde68a" />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.27, 0.86, 0]}>
        <mesh position={[0.03, -0.16, 0]} rotation={[0, 0, -0.22]} castShadow>
          <capsuleGeometry args={[0.06, 0.24, 8, 12]} />
          <meshStandardMaterial color={isGirl ? '#f472b6' : '#3b82f6'} />
        </mesh>
        <mesh position={[0.06, -0.31, 0]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#fde68a" />
        </mesh>
      </group>

      {/* Cute Chibi Head */}
      <group ref={headRef} position={[0, 1.24, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshStandardMaterial color="#fde68a" roughness={0.35} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.08, -0.04]} castShadow>
          <sphereGeometry args={[0.325, 24, 24]} />
          <meshStandardMaterial color={isGirl ? '#4a1d36' : '#1e1b4b'} roughness={0.45} />
        </mesh>

        {isGirl ? (
          <>
            {/* Twin Pigtails & Pink Hair Ribbons */}
            <mesh position={[-0.33, 0.06, -0.04]} castShadow>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#4a1d36" />
            </mesh>
            <mesh position={[0.33, 0.06, -0.04]} castShadow>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#4a1d36" />
            </mesh>
            <mesh position={[-0.26, 0.16, 0.06]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0.26, 0.16, 0.06]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} />
            </mesh>
          </>
        ) : (
          /* Cute Graduation / Scholar Cap on Leo */
          <group position={[0, 0.27, 0.04]}>
            <mesh>
              <cylinderGeometry args={[0.24, 0.24, 0.08, 20]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <RoundedBox args={[0.48, 0.04, 0.48]} position={[0, 0.05, 0]} radius={0.01}>
              <meshStandardMaterial color="#1e293b" />
            </RoundedBox>
          </group>
        )}

        {/* Sparkling Anime Eyes & Rosy Cheeks */}
        <mesh position={[-0.1, 0.02, 0.27]}>
          <sphereGeometry args={[0.048, 14, 14]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.1, 0.02, 0.27]}>
          <sphereGeometry args={[0.048, 14, 14]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.085, 0.04, 0.305]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.115, 0.04, 0.305]}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.17, -0.05, 0.25]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.75} />
        </mesh>
        <mesh position={[0.17, -0.05, 0.25]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.75} />
        </mesh>
      </group>

      {/* Floating Character Badge */}
      {isPrimary && (
        <Float speed={2.5} rotationIntensity={0.04} floatIntensity={0.18}>
          <group position={[0, 1.82, 0]}>
            <RoundedBox args={[1.55, 0.26, 0.04]} radius={0.08}>
              <meshStandardMaterial color={isGirl ? '#831843' : '#1e3a8a'} />
            </RoundedBox>
            <Text position={[0, 0, 0.03]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
              {isGirl ? '👧 Luna (Exam Candidate)' : '👦 Leo (Exam Candidate)'}
            </Text>
          </group>
        </Float>
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CUTE CALICO CAT PROCTOR & CROWNED PIGGY BANK TROPHY FOR EXAM HALL
// ═══════════════════════════════════════════════════════════════════════════════
function ProctorCalicoCat3D({ position = [3.6, 1.12, -6.2], rotation = [0, -0.35, 0], scale = 1.1 }) {
  const catRef = useRef()
  useFrame(({ clock }) => {
    if (catRef.current) {
      catRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 2.4) * 0.04
    }
  })
  return (
    <group ref={catRef} position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.24, 0]} castShadow>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.5} />
      </mesh>
      <mesh position={[0.11, 0.28, -0.05]}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.52, 0.06]} castShadow>
        <sphereGeometry args={[0.21, 20, 20]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.45} />
      </mesh>
      <mesh position={[-0.12, 0.7, 0.05]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.07, 0.14, 12]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0.12, 0.7, 0.05]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.07, 0.14, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Cute Proctor Scholar Cap */}
      <group position={[0, 0.73, 0.06]}>
        <RoundedBox args={[0.34, 0.04, 0.34]} radius={0.01}>
          <meshStandardMaterial color="#1e293b" />
        </RoundedBox>
        <mesh position={[0.14, -0.04, 0.14]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
      {/* Eyes */}
      <mesh position={[-0.07, 0.54, 0.23]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.07, 0.54, 0.23]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Gold Coin */}
      <mesh position={[0, 0.28, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  )
}

function ExamHallPiggyTrophy3D({ position = [-3.8, 1.38, -6.2], scale = 1.15 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2.2) * 0.04
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.2
    }
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.35, 24, 24]} scale={[1.22, 0.95, 0.95]} />
        <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.4, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.14, 0.12, 16]} />
        <meshStandardMaterial color="#fb7185" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.15, 0.11, 0.13, 6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CAMERA RIG FOR THE 3D EXAM HALL
// ═══════════════════════════════════════════════════════════════════════════════
function ExamHallCameraRig({ cameraPoseRef }) {
  const { camera } = useThree()
  const lookAtTarget = useRef(new THREE.Vector3(0, 2.2, -5))

  useFrame(() => {
    const pose = cameraPoseRef.current
    camera.position.lerp(new THREE.Vector3(pose.x, pose.y, pose.z), 0.08)
    lookAtTarget.current.lerp(new THREE.Vector3(pose.lookX, pose.lookY, pose.lookZ), 0.08)
    camera.lookAt(lookAtTarget.current)
  })

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. FULL 3D EXAMINATION HALL ARCHITECTURE & ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════════════
function Learn2InvestExamHall3D({
  doorOpenRef,
  walkRef,
  aiGuideAvatar,
  currentQuestionIndex,
  totalQuestions,
  currentQuestionText,
  scoreCount,
  celebrating,
  allVideosWatched,
  watchedLevel1Count,
}) {
  const leftDoorRef = useRef()
  const rightDoorRef = useRef()

  useFrame(() => {
    const openAmt = doorOpenRef.current
    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorRef.current.rotation.y, -openAmt * 1.45, 0.1)
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorRef.current.rotation.y, openAmt * 1.45, 0.1)
    }
  })

  const secondaryGender = aiGuideAvatar === 'female' ? 'male' : 'female'

  return (
    <group>
      {/* ─── HONEY-OAK PARQUET FLOOR & ROYAL RED/GOLD EXAM HALL AISLE CARPET ─── */}
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 28]} />
        <meshStandardMaterial color="#d69e66" roughness={0.45} metalness={0.08} />
      </mesh>

      {/* Royal Red & Gold Trimmed Center Walk-In Carpet */}
      <mesh position={[0, 0.015, 3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.7, 20.5]} />
        <meshStandardMaterial color="#be123c" roughness={0.7} />
      </mesh>
      <mesh position={[-1.38, 0.018, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 20.5]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[1.38, 0.018, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 20.5]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ─── WARM CREAM WALLS & CEILING OF THE GRAND EXAM HALL ─── */}
      {/* Front Stage Wall */}
      <mesh position={[0, 4.4, -9.2]} receiveShadow>
        <boxGeometry args={[24, 8.8, 0.5]} />
        <meshStandardMaterial color="#f8efe2" roughness={0.75} />
      </mesh>
      {/* Left Wall with Sunlit Windows */}
      <mesh position={[-10.5, 4.4, 1]} receiveShadow>
        <boxGeometry args={[0.5, 8.8, 26]} />
        <meshStandardMaterial color="#f5eadc" roughness={0.75} />
      </mesh>
      {/* Right Wall with Banners */}
      <mesh position={[10.5, 4.4, 1]} receiveShadow>
        <boxGeometry args={[0.5, 8.8, 26]} />
        <meshStandardMaterial color="#f5eadc" roughness={0.75} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 8.7, 1]}>
        <boxGeometry args={[24, 0.3, 26]} />
        <meshStandardMaterial color="#fdf8f0" roughness={0.8} />
      </mesh>

      {/* ─── ENTRANCE PORTICO & ANIMATED DOUBLE DOORS AT Z = 10.2 ─── */}
      <group position={[0, 0, 10.2]}>
        {/* Left & Right Entrance Wall Wings */}
        <RoundedBox args={[8.2, 8.6, 0.7]} position={[-6.3, 4.3, 0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#f5ece0" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[8.2, 8.6, 0.7]} position={[6.3, 4.3, 0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#f5ece0" roughness={0.7} />
        </RoundedBox>
        {/* Overhead Sign Beam Above Exam Hall Doors */}
        <RoundedBox args={[5.4, 3.8, 0.75]} position={[0, 6.7, 0]} radius={0.05} castShadow>
          <meshStandardMaterial color="#fbf5ed" roughness={0.6} />
        </RoundedBox>

        {/* "Learn2Invest EXAMINATION HALL" Sign on Entrance */}
        <RoundedBox args={[5.0, 1.45, 0.12]} position={[0, 5.75, 0.4]} radius={0.06}>
          <meshStandardMaterial color="#1e293b" />
        </RoundedBox>
        <Text position={[0, 5.95, 0.48]} fontSize={0.36} color="#fde047" anchorX="center" anchorY="middle">
          🎓 Learn2Invest
        </Text>
        <Text position={[0, 5.45, 0.48]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" letterSpacing={0.08}>
          EXAMINATION HALL
        </Text>

        {/* Animated Grand Double Doors */}
        <group ref={leftDoorRef} position={[-2.1, 0, 0]}>
          <RoundedBox args={[2.05, 4.6, 0.14]} position={[1.02, 2.3, 0]} radius={0.03} castShadow>
            <meshStandardMaterial color="#854d0e" roughness={0.45} />
          </RoundedBox>
          <RoundedBox args={[1.4, 1.8, 0.16]} position={[1.02, 2.9, 0]} radius={0.02}>
            <meshStandardMaterial color="#bae6fd" metalness={0.4} roughness={0.2} transparent opacity={0.8} />
          </RoundedBox>
        </group>

        <group ref={rightDoorRef} position={[2.1, 0, 0]}>
          <RoundedBox args={[2.05, 4.6, 0.14]} position={[-1.02, 2.3, 0]} radius={0.03} castShadow>
            <meshStandardMaterial color="#854d0e" roughness={0.45} />
          </RoundedBox>
          <RoundedBox args={[1.4, 1.8, 0.16]} position={[-1.02, 2.9, 0]} radius={0.02}>
            <meshStandardMaterial color="#bae6fd" metalness={0.4} roughness={0.2} transparent opacity={0.8} />
          </RoundedBox>
        </group>
      </group>

      {/* ─── LEFT WALL SUNLIT WINDOWS, GOLDEN SUNBEAMS & POTTED PLANTS ─── */}
      {[-4.5, 1.5, 7.0].map((wz, idx) => (
        <group key={idx} position={[-10.2, 4.2, wz]}>
          <RoundedBox args={[0.16, 3.8, 3.6]} radius={0.03}>
            <meshStandardMaterial color="#ffffff" />
          </RoundedBox>
          <mesh position={[0.09, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[3.3, 3.4]} />
            <meshBasicMaterial color="#e0f2fe" />
          </mesh>
          {/* Diagonal Golden Sunbeam Ray */}
          <mesh position={[2.8, -1.3, 0]} rotation={[0, 0, -0.52]}>
            <cylinderGeometry args={[1.1, 2.3, 6.2, 16, 1, true]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.09} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Terracotta Potted Plant on Windowsill */}
          <group position={[0.35, -1.75, 0]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.14, 0.3, 14]} />
              <meshStandardMaterial color="#c2410c" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.26, 12, 12]} />
              <meshStandardMaterial color="#16a34a" />
            </mesh>
          </group>
        </group>
      ))}

      {/* ─── RIGHT WALL HANGING EXAM BANNERS & CLOCK ─── */}
      {[
        { z: -3.5, bg: '#587e6a', text: 'Small Steps\nBig Future\n🌱\nLevel 1 Exam' },
        { z: 2.5, bg: '#4f7da8', text: 'Discipline Today\nWealth Tomorrow\n🏆\nWin +150 XP' },
      ].map((b, i) => (
        <group key={i} position={[10.15, 4.6, b.z]} rotation={[0, -Math.PI / 2, 0]}>
          <RoundedBox args={[2.8, 3.4, 0.08]} radius={0.04} castShadow>
            <meshStandardMaterial color={b.bg} roughness={0.6} />
          </RoundedBox>
          <Text position={[0, 0, 0.06]} fontSize={0.24} color="#ffffff" anchorX="center" anchorY="middle" textAlign="center" lineHeight={1.35}>
            {b.text}
          </Text>
        </group>
      ))}

      {/* ─── FRONT EXAMINATION STAGE, GRAND 3D QUESTION BOARD, PIGGY TROPHY & PROCTOR CAT ─── */}
      <group position={[0, 0, -7.2]}>
        {/* Raised Honey-Oak Stage Platform */}
        <RoundedBox args={[16.5, 0.28, 3.2]} position={[0, 0.14, 0]} radius={0.04} receiveShadow>
          <meshStandardMaterial color="#c88d54" roughness={0.5} />
        </RoundedBox>

        {/* Grand Center 3D Exam Hall Question Board on Back Wall */}
        <group position={[0, 4.5, -1.65]}>
          <RoundedBox args={[9.6, 4.6, 0.16]} radius={0.12} castShadow>
            <meshStandardMaterial color="#1e1b4b" roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[9.2, 4.2, 0.08]} position={[0, 0, 0.08]} radius={0.1}>
            <meshStandardMaterial color="#fdfbf7" roughness={0.25} />
          </RoundedBox>

          {/* Header Pill on 3D Board */}
          <RoundedBox args={[6.4, 0.58, 0.06]} position={[0, 1.52, 0.14]} radius={0.12}>
            <meshStandardMaterial color="#ec4899" />
          </RoundedBox>
          <Text position={[0, 1.52, 0.19]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
            {allVideosWatched
              ? `🌸 LEARN2INVEST EXAM HALL · QUESTION ${currentQuestionIndex + 1} OF ${totalQuestions} 🎀`
              : `🔒 EXAM HALL LOCKED · WATCH 5/5 VIDEOS (${watchedLevel1Count}/5)`}
          </Text>

          {/* Main 3D Board Question Text */}
          <Text
            position={[0, 0.35, 0.16]}
            fontSize={0.31}
            maxWidth={8.2}
            color="#1e293b"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            lineHeight={1.3}
          >
            {allVideosWatched
              ? currentQuestionText || 'Welcome to the Learn2Invest Level 1 Certification Exam!'
              : 'Please complete all 5 Classroom Videos (at least 80% each) to unlock the Exam Hall!'}
          </Text>

          {/* Bottom Score & Reward Bar on 3D Board */}
          <RoundedBox args={[7.6, 0.56, 0.06]} position={[0, -1.42, 0.14]} radius={0.1}>
            <meshStandardMaterial color="#0f172a" />
          </RoundedBox>
          <Text position={[0, -1.42, 0.19]} fontSize={0.22} color="#fde047" anchorX="center" anchorY="middle">
            {`🎯 Live Score: ${scoreCount}/${totalQuestions}   •   📹 Videos: ${watchedLevel1Count}/5   •   🏆 Reward: +150 XP`}
          </Text>
        </group>

        {/* Left Stage Marble Trophy Pedestal + Crowned Pink Piggy Bank */}
        <group position={[-5.8, 0.28, 0.2]}>
          <RoundedBox args={[1.3, 1.1, 1.1]} position={[0, 0.55, 0]} radius={0.05} castShadow>
            <meshStandardMaterial color="#f5eadc" />
          </RoundedBox>
          <Text position={[0, 0.6, 0.58]} fontSize={0.13} color="#be185d" anchorX="center" anchorY="middle" textAlign="center">
            {'EXAM REWARD\n+150 XP 🏆'}
          </Text>
          <ExamHallPiggyTrophy3D position={[0, 1.48, 0]} scale={1.1} />
        </group>

        {/* Right Stage Proctor Desk + Cute Calico Cat Proctor */}
        <group position={[5.8, 0.28, 0.2]}>
          <RoundedBox args={[1.8, 0.95, 1.1]} position={[0, 0.48, 0]} radius={0.05} castShadow>
            <meshStandardMaterial color="#9a5b25" />
          </RoundedBox>
          <Text position={[0, 0.52, 0.58]} fontSize={0.13} color="#fef08a" anchorX="center" anchorY="middle" textAlign="center">
            {'CHIEF PROCTOR\n🐱🎓'}
          </Text>
          <ProctorCalicoCat3D position={[0, 0.95, 0]} rotation={[0, -0.25, 0]} scale={1.15} />
        </group>
      </group>

      {/* ─── ROWS OF WOODEN EXAMINATION DESKS ALONG LEFT & RIGHT AISLES ─── */}
      {[
        // Left Side Exam Desks
        [-4.8, -1.5],
        [-4.8, 2.2],
        [-4.8, 5.8],
        // Right Side Exam Desks
        [4.8, -1.5],
        [4.8, 2.2],
        [4.8, 5.8],
      ].map(([dx, dz], idx) => (
        <group key={idx} position={[dx, 0, dz]}>
          {/* Desk Top */}
          <RoundedBox args={[2.3, 0.1, 1.25]} position={[0, 0.78, 0]} radius={0.03} castShadow receiveShadow>
            <meshStandardMaterial color="#c08248" roughness={0.45} />
          </RoundedBox>
          {/* Legs */}
          {[-0.95, 0.95].map((lx, l) => (
            <RoundedBox key={l} args={[0.1, 0.76, 1.05]} position={[lx, 0.38, 0]} radius={0.02} castShadow>
              <meshStandardMaterial color="#78350f" />
            </RoundedBox>
          ))}
          {/* Exam Sheet on Desk */}
          <mesh position={[0, 0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.75, 0.55]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Chair */}
          <RoundedBox args={[0.9, 0.08, 0.85]} position={[0, 0.45, 0.85]} radius={0.02} castShadow>
            <meshStandardMaterial color="#b47238" />
          </RoundedBox>
          <RoundedBox args={[0.9, 0.52, 0.08]} position={[0, 0.72, 1.24]} radius={0.02} castShadow>
            <meshStandardMaterial color="#b47238" />
          </RoundedBox>
        </group>
      ))}

      {/* ─── CENTER VIP CANDIDATE EXAM DESK (Where Character Walks To!) ─── */}
      <group position={[0, 0, -2.35]}>
        {/* Glowing Golden Floor Halo around Candidate Desk */}
        <mesh position={[0, 0.025, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.58, 36]} />
          <meshBasicMaterial color="#fde047" side={THREE.DoubleSide} />
        </mesh>

        {/* VIP Candidate Desk */}
        <RoundedBox args={[2.6, 0.12, 1.35]} position={[0, 0.82, 0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#d97706" roughness={0.35} />
        </RoundedBox>
        {[-1.1, 1.1].map((lx, l) => (
          <RoundedBox key={l} args={[0.12, 0.8, 1.1]} position={[lx, 0.4, 0]} radius={0.02} castShadow>
            <meshStandardMaterial color="#78350f" />
          </RoundedBox>
        ))}
        {/* Front Sign on Candidate Desk */}
        <RoundedBox args={[1.9, 0.34, 0.05]} position={[0, 0.55, -0.66]} radius={0.04}>
          <meshStandardMaterial color="#1e1b4b" />
        </RoundedBox>
        <Text position={[0, 0.55, -0.7]} rotation={[0, Math.PI, 0]} fontSize={0.13} color="#fde047" anchorX="center" anchorY="middle">
          🌟 CANDIDATE DESK #1
        </Text>
        {/* Glowing Exam Tablet & Sheet on VIP Desk */}
        <RoundedBox args={[0.95, 0.04, 0.68]} position={[0, 0.9, 0]} radius={0.03}>
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.4} />
        </RoundedBox>
      </group>

      {/* ─── WALKING 3D CUTE CHARACTERS (LUNA & LEO) ENTERING THE EXAM HALL ─── */}
      <WalkingExamCharacter3D
        gender={aiGuideAvatar === 'male' ? 'male' : 'female'}
        walkRef={walkRef}
        offsetX={0}
        offsetZ={0}
        scale={1.22}
        isPrimary={true}
        celebrating={celebrating}
      />
      <WalkingExamCharacter3D
        gender={secondaryGender}
        walkRef={walkRef}
        offsetX={1.25}
        offsetZ={0.9}
        scale={1.12}
        isPrimary={false}
        celebrating={celebrating}
      />

      {/* Extra Golden Celebration Sparkles When Answering Correctly */}
      {celebrating && (
        <Sparkles count={80} scale={[6, 4, 6]} position={[0, 1.8, -1.5]} size={5} speed={1.6} color="#fde047" />
      )}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MAIN QUIZ COMPONENT WITH 3D EXAM HALL WALK-IN & QUESTIONS PRESENTATION
// ═══════════════════════════════════════════════════════════════════════════════
export default function Quiz({
  go,
  goBack,
  state,
  update,
  addXP,
  themeMode = 'dark',
  aiGuideAvatar = 'female',
  onOpenVideos,
}) {
  const watchedList = state?.lessonsWatched || []
  const watchedLevel1Count = REQUIRED_LEVEL1_VIDEOS.filter((id) => watchedList.includes(id)).length
  const allVideosWatched = watchedLevel1Count >= 5

  const initialMappedQuestions = (quizQuestions || []).map((q, i) => ({
    id: `q${i + 1}`,
    question: q.q,
    options: q.opts,
    answer: q.ans,
    hint: q.hint,
    explanation: q.explain,
    emoji: q.emoji || '🌸',
  }))

  const [questions, setQuestions] = useState(initialMappedQuestions)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [miniXPPop, setMiniXPPop] = useState(false)

  // 'entering' -> character walks into the 3D Exam Hall; 'questions' -> questions presented in the Exam Hall
  const [examPhase, setExamPhase] = useState(allVideosWatched ? 'entering' : 'locked')

  const autoAdvanceTimerRef = useRef(null)
  const walkTimelineRef = useRef(null)

  // Refs driving the 3D camera, Exam Hall doors, and character walking progress
  const doorOpenRef = useRef(allVideosWatched ? 1 : 0)
  const walkRef = useRef({
    progress: 0,
    isWalking: false,
  })
  const cameraPoseRef = useRef({
    x: 0,
    y: 2.8,
    z: 14.8,
    lookX: 0,
    lookY: 2.1,
    lookZ: 4.0,
  })

  useEffect(() => {
    fetch('/content/beginner/quizzes/quiz1.json')
      .then((r) => {
        if (r.ok && r.headers.get('content-type')?.includes('json')) {
          return r.json()
        }
        return null
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data)
        }
      })
      .catch(() => {})

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
      if (walkTimelineRef.current) walkTimelineRef.current.kill()
    }
  }, [])

  // Trigger the cinematic Character Walk-In into the 3D Exam Hall whenever unlocked
  const startExamHallWalkIn = () => {
    if (walkTimelineRef.current) walkTimelineRef.current.kill()

    setExamPhase('entering')
    doorOpenRef.current = 0
    walkRef.current.progress = 0
    walkRef.current.isWalking = true

    // Start camera outside the Exam Hall entrance doors looking at the character
    cameraPoseRef.current = {
      x: 0,
      y: 2.7,
      z: 15.2,
      lookX: 0,
      lookY: 1.8,
      lookZ: 8.5,
    }

    soundEngine.playDoorOpen()
    setTimeout(() => soundEngine.playCameraWhoosh(1.6), 250)

    const tl = gsap.timeline({
      onComplete: () => {
        walkRef.current.isWalking = false
        walkRef.current.progress = 1
        setExamPhase('questions')
      },
    })
    walkTimelineRef.current = tl

    // 1. Swing open the grand Exam Hall doors
    tl.to(doorOpenRef, {
      current: 1,
      duration: 0.7,
      ease: 'power2.out',
    }, 0)

    // 2. Walk the character down the red carpet aisle to the Candidate Exam Desk
    tl.to(walkRef.current, {
      progress: 1,
      duration: 2.7,
      ease: 'power1.inOut',
    }, 0.25)

    // 3. Follow camera behind/beside the walking character through the Exam Hall doors
    tl.to(cameraPoseRef.current, {
      x: 1.6,
      y: 2.5,
      z: 7.2,
      lookX: 0,
      lookY: 1.6,
      lookZ: 1.0,
      duration: 1.35,
      ease: 'power2.inOut',
    }, 0.2)

    // 4. Glide camera into the Exam Hall framing the Candidate Desk & Grand 3D Question Stage
    tl.to(cameraPoseRef.current, {
      x: 0,
      y: 3.15,
      z: 3.2,
      lookX: 0,
      lookY: 2.7,
      lookZ: -7.5,
      duration: 1.45,
      ease: 'power3.out',
    }, 1.55)
  }

  const skipWalkIn = () => {
    if (walkTimelineRef.current) walkTimelineRef.current.kill()
    doorOpenRef.current = 1
    walkRef.current.progress = 1
    walkRef.current.isWalking = false
    cameraPoseRef.current = {
      x: 0,
      y: 3.15,
      z: 3.2,
      lookX: 0,
      lookY: 2.7,
      lookZ: -7.5,
    }
    setExamPhase('questions')
  }

  useEffect(() => {
    if (allVideosWatched) {
      startExamHallWalkIn()
    } else {
      setExamPhase('locked')
      doorOpenRef.current = 0
      walkRef.current.progress = 0
      walkRef.current.isWalking = false
      cameraPoseRef.current = {
        x: 0,
        y: 2.6,
        z: 15.2,
        lookX: 0,
        lookY: 2.4,
        lookZ: 9.0,
      }
    }
  }, [allVideosWatched])

  if (!questions.length) return null

  const q = questions[current] || questions[0]
  const cuteTheme = CUTE_QUESTION_THEMES[current % CUTE_QUESTION_THEMES.length]
  const progress = Math.min(100, Math.round(((current + (answered ? 1 : 0)) / questions.length) * 100))

  const advanceToNextQuestion = (updatedCorrectCount) => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
      setShowHint(false)
      setMiniXPPop(false)
    } else {
      const score = Math.min(100, Math.round((updatedCorrectCount / questions.length) * 100))
      const passed = score >= 60
      if (passed) {
        soundEngine.playXPFanfare()
        setShowXP(true)
        addXP(150)
        const allBegVideos = ['video1', 'video2', 'video3', 'video4', 'video5', 'ppf', 'fd', 'nsc', 'ssy']
        const updatedWatched = Array.from(new Set([...(state.lessonsWatched || []), ...allBegVideos]))
        update({
          quizScore: score,
          correctCount: updatedCorrectCount,
          quizTotal: questions.length,
          intermediateUnlocked: true,
          lessonsWatched: updatedWatched,
        })
        setTimeout(() => {
          setShowXP(false)
          go('beg-complete')
        }, 2100)
      } else {
        update({ quizScore: score, correctCount: updatedCorrectCount, quizTotal: questions.length })
        setDone(true)
      }
    }
  }

  // Requirement 6: Auto-advance to next question after selecting an answer
  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)

    const isRight = idx === q.answer
    const nextCorrect = isRight ? correct + 1 : correct
    if (isRight) {
      soundEngine.playXPFanfare()
      setCorrect(nextCorrect)
      setMiniXPPop(true)
    } else {
      soundEngine.playClick()
    }

    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
    autoAdvanceTimerRef.current = setTimeout(() => {
      advanceToNextQuestion(nextCorrect)
    }, 1350)
  }

  const handleRetry = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current)
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setCorrect(0)
    setDone(false)
    setShowHint(false)
    startExamHallWalkIn()
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 64px)',
        minHeight: '650px',
        overflow: 'hidden',
        background: '#fef3c7',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Fast-Motion 150 XP Kinetic Slam Overlay */}
      <FastMotionXPBurst show={showXP} xpAmount={150} label="LEVEL 1 EXAM COMPLETED!" />

      {/* Fast Mini XP Pop on Correct Answer */}
      {miniXPPop && (
        <div
          style={{
            position: 'fixed',
            top: '16%',
            right: '8%',
            zIndex: 900,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, #fde047, #f59e0b)',
            color: '#080705',
            padding: '10px 22px',
            borderRadius: 999,
            fontWeight: 900,
            fontSize: 20,
            boxShadow: '0 0 35px rgba(250, 204, 21, 0.85)',
            animation: 'xpFastSlam 0.35s cubic-bezier(0.18, 1.45, 0.32, 1) forwards',
          }}
        >
          🌟 AWESOME! +XP ✨
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          3D EXAMINATION HALL CANVAS (ALWAYS LIVE IN BACKGROUND)
      ═══════════════════════════════════════════════════════════════════ */}
      <Canvas
        shadows
        camera={{ position: [0, 2.8, 15.2], fov: 48, near: 0.1, far: 180 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <Suspense fallback={null}>
          <Sky sunPosition={[30, 20, 20]} turbidity={0.25} rayleigh={0.45} />
          <fog attach="fog" args={['#fdf6eb', 22, 85]} />

          <ambientLight intensity={0.82} color="#fffbeb" />
          <hemisphereLight skyColor="#fff7ed" groundColor="#d69e66" intensity={0.65} />
          <directionalLight
            position={[18, 28, 16]}
            intensity={1.35}
            color="#fff7ed"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <ExamHallCameraRig cameraPoseRef={cameraPoseRef} />

          <Learn2InvestExamHall3D
            doorOpenRef={doorOpenRef}
            walkRef={walkRef}
            aiGuideAvatar={aiGuideAvatar}
            currentQuestionIndex={current}
            totalQuestions={questions.length}
            currentQuestionText={q?.question}
            scoreCount={correct}
            celebrating={miniXPPop}
            allVideosWatched={allVideosWatched}
            watchedLevel1Count={watchedLevel1Count}
          />

          <Sparkles count={90} scale={[20, 7, 22]} position={[0, 3.5, 0]} size={2.5} speed={0.35} color="#fef08a" />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={35} blur={2} far={12} />
        </Suspense>
      </Canvas>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP EXAM HALL HUD BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          zIndex: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(14px)',
            border: '1.5px solid #f472b6',
            borderRadius: 999,
            padding: '6px 16px',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <CuteChibiAvatarSVG type={aiGuideAvatar} size={36} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#fbcfe8', letterSpacing: '0.8px' }}>
              🎓 LEARN2INVEST 3D EXAMINATION HALL
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#fde047' }}>
              {examPhase === 'entering'
                ? '🚶‍♀️ Walking Into Exam Hall...'
                : examPhase === 'locked'
                ? `🔒 Exam Locked (${watchedLevel1Count}/5 Videos)`
                : `📝 Question ${current + 1}/${questions.length} • Score: ${correct}/${questions.length}`}
            </div>
          </div>
        </div>

        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {allVideosWatched && (
            <button
              onClick={startExamHallWalkIn}
              style={{
                background: 'rgba(236, 72, 153, 0.22)',
                border: '1.5px solid #f472b6',
                color: '#fbcfe8',
                borderRadius: 999,
                padding: '7px 14px',
                fontSize: 11.5,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              🎥 Replay Exam Hall Walk-In
            </button>
          )}
          <button
            onClick={() => go('beginner')}
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              borderRadius: 999,
              padding: '7px 16px',
              fontSize: 11.5,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            🏫 Back to 3D Classroom
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE A: LOCKED OVERLAY (WHEN < 5/5 VIDEOS WATCHED AT 80%+)
      ═══════════════════════════════════════════════════════════════════ */}
      {!allVideosWatched && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(10, 8, 22, 0.55)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            className="glass-card-deep anim-scale"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: '32px 28px',
              borderRadius: 28,
              textAlign: 'center',
              background: 'linear-gradient(145deg, rgba(30, 22, 43, 0.96) 0%, rgba(17, 12, 29, 0.98) 100%)',
              border: '2.5px solid #f472b6',
              boxShadow: '0 24px 60px rgba(236, 72, 153, 0.35)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              <CuteChibiAvatarSVG type="female" size={58} />
              <div style={{ fontSize: 36 }}>🔒🏛️</div>
              <CuteChibiAvatarSVG type="male" size={58} />
            </div>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(244, 114, 182, 0.2)',
                border: '1.5px solid #f472b6',
                color: '#fbcfe8',
                padding: '4px 16px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              🌸 3D EXAM HALL DOORS LOCKED · WATCH ALL 5 VIDEOS FIRST
            </span>
            <h2 className="font-display" style={{ fontSize: 30, color: '#ffffff', marginBottom: 8 }}>
              WATCH 5/5 VIDEOS TO ENTER THE EXAM HALL!
            </h2>
            <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 16 }}>
              Watch all 5 classroom videos at least <strong style={{ color: '#6ee7b7' }}>80% completely</strong> so your character can walk into the <strong style={{ color: '#fde047' }}>3D Examination Hall</strong> and win <strong style={{ color: '#fde047' }}>+150 XP</strong>!
            </p>

            {/* Progress X/5 pill */}
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 18,
                padding: '14px 18px',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fbcfe8' }}>📹 Classroom Video Progress</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#fde047' }}>{watchedLevel1Count}/5</span>
              </div>
              <div className="progress-track" style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(watchedLevel1Count / 5) * 100}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #ec4899, #f59e0b, #10b981)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  if (onOpenVideos) onOpenVideos()
                  else go('beginner')
                }}
                style={{
                  width: '100%',
                  padding: '13px 22px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontSize: 13.5,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                }}
              >
                🖥️ Watch Classroom Videos ({watchedLevel1Count}/5) →
              </button>

              <button
                onClick={() => {
                  soundEngine.playXPFanfare()
                  const unlockedVideos = Array.from(new Set([...watchedList, ...REQUIRED_LEVEL1_VIDEOS]))
                  update({ lessonsWatched: unlockedVideos })
                }}
                style={{
                  width: '100%',
                  padding: '11px 20px',
                  borderRadius: 999,
                  border: '1.5px solid #fde047',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fde047',
                  fontSize: 12.5,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                🎓 Demo Preview: Unlock 5/5 Videos & Walk Into 3D Exam Hall Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE B: CINEMATIC WALK-IN BANNER (WHILE CHARACTER ENTERS EXAM HALL)
      ═══════════════════════════════════════════════════════════════════ */}
      {allVideosWatched && examPhase === 'entering' && (
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '2px solid #fde047',
            borderRadius: 999,
            padding: '12px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#ffffff',
            boxShadow: '0 0 35px rgba(250, 204, 21, 0.45)',
          }}
        >
          <span style={{ fontSize: 22 }}>🚶‍♀️🎓</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#fde047' }}>
              Entering the Learn2Invest 3D Examination Hall...
            </div>
            <div style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>
              Walking down the aisle to Candidate Desk #1 for your Level 1 Certification Exam!
            </div>
          </div>
          <button
            onClick={skipWalkIn}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              borderRadius: 999,
              padding: '7px 16px',
              fontSize: 11.5,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Skip to Questions →
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE C: EXAM QUESTIONS PRESENTED INSIDE THE 3D EXAM HALL
      ═══════════════════════════════════════════════════════════════════ */}
      {allVideosWatched && examPhase === 'questions' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 14,
            transform: 'translateX(-50%)',
            zIndex: 35,
            width: 'calc(100% - 28px)',
            maxWidth: 760,
            maxHeight: 'calc(100vh - 150px)',
            overflowY: 'auto',
          }}
        >
          {done ? (
            <div
              className="glass-card-deep anim-scale"
              style={{
                padding: '32px 28px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(18px)',
                border: '2.5px solid #f472b6',
                borderRadius: 26,
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>🐣🌸</div>
              <h2 className="font-display" style={{ fontSize: 32, color: '#ffffff', marginBottom: 6 }}>
                ALMOST THERE!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
                You scored <strong style={{ color: '#f472b6' }}>{Math.min(100, Math.round((correct / questions.length) * 100))}%</strong> in the Exam Hall — score 60%+ to earn <strong style={{ color: '#fde047' }}>150 XP</strong>!
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={handleRetry} style={{ padding: '12px 28px' }}>
                  🔄 RE-ENTER EXAM HALL & RETRY
                </button>
                <button className="btn-outline" onClick={() => go('beginner')} style={{ padding: '12px 28px' }}>
                  🏫 BACK TO 3D CLASSROOM
                </button>
              </div>
            </div>
          ) : (
            <div
              key={current}
              className="glass-card-deep anim-scale"
              style={{
                padding: '20px 24px',
                background: 'rgba(15, 20, 36, 0.92)',
                backdropFilter: 'blur(18px)',
                border: `2.5px solid ${cuteTheme.color}`,
                borderRadius: 26,
                boxShadow: `0 18px 50px rgba(0,0,0,0.65), 0 0 30px ${cuteTheme.color}44`,
                color: '#ffffff',
              }}
            >
              {/* Top Row inside Exam Sheet: Cute Exam Question Title + Progress X/5 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: cuteTheme.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${cuteTheme.color}`,
                      fontSize: 24,
                    }}
                  >
                    {cuteTheme.badgeIcon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: cuteTheme.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{cuteTheme.badgeIcon}</span>
                      <span>Exam Question {current + 1}</span>
                      <span>🎀</span>
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1' }}>
                      🏛️ Candidate Desk #1 • {cuteTheme.mascot} {cuteTheme.tag}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.18)',
                      border: '1px solid #10b981',
                      color: '#6ee7b7',
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 900,
                    }}
                  >
                    📹 {watchedLevel1Count}/5
                  </span>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 999,
                      padding: '4px 12px',
                      fontSize: 11.5,
                      fontWeight: 900,
                      color: '#fde047',
                    }}
                  >
                    🎯 {current + 1}/{questions.length} • Win +150 XP
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-track" style={{ height: 7, borderRadius: 999, marginBottom: 14 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #ec4899, #f59e0b, #10b981)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {/* Question Prompt */}
              <h2
                style={{
                  fontWeight: 900,
                  fontSize: 18.5,
                  color: '#ffffff',
                  marginBottom: 14,
                  lineHeight: 1.4,
                }}
              >
                {q.emoji} {q.question}
              </h2>

              {/* 2x2 Grid of Cute Options for Compact Exam Hall View */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.answer
                  const isSelected = i === selected
                  const cuteOptIcon = CUTE_OPTION_ICONS[i % CUTE_OPTION_ICONS.length]

                  let bg = 'rgba(255, 255, 255, 0.06)'
                  let border = '1.5px solid rgba(244, 114, 182, 0.3)'
                  let textColor = '#ffffff'

                  if (answered) {
                    if (isCorrect) {
                      bg = 'rgba(34, 197, 94, 0.24)'
                      border = '2px solid #22c55e'
                      textColor = '#86efac'
                    } else if (isSelected && !isCorrect) {
                      bg = 'rgba(239, 68, 68, 0.24)'
                      border = '2px solid #ef4444'
                      textColor = '#fca5a5'
                    }
                  }

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '11px 14px',
                        borderRadius: 16,
                        cursor: answered ? 'default' : 'pointer',
                        background: bg,
                        border,
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.015)' : 'scale(1)',
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          flexShrink: 0,
                          background:
                            answered && isCorrect
                              ? '#16a34a'
                              : answered && isSelected && !isCorrect
                              ? '#dc2626'
                              : cuteTheme.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: 12.5,
                          fontWeight: 900,
                          border: '1.5px solid #ffffff',
                        }}
                      >
                        {answered && isCorrect
                          ? '✓'
                          : answered && isSelected && !isCorrect
                          ? '✗'
                          : `${cuteOptIcon}${String.fromCharCode(65 + i)}`}
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: textColor, lineHeight: 1.3 }}>{opt}</div>
                    </div>
                  )
                })}
              </div>

              {/* Hint Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!answered && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="btn-outline"
                    style={{ fontSize: 11.5, padding: '6px 14px', borderRadius: 999 }}
                  >
                    💡🧸 {showHint ? 'HIDE EXAM HINT' : 'ASK PROCTOR FOR HINT'}
                  </button>
                )}
                {!answered && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#f472b6' }}>
                    ⚡ Auto-Next Enabled on Selection
                  </span>
                )}
              </div>

              {showHint && !answered && (
                <div
                  className="anim-fade"
                  style={{
                    background: 'rgba(245, 158, 11, 0.16)',
                    border: '1.5px solid #f59e0b',
                    borderRadius: 14,
                    padding: '10px 14px',
                    marginTop: 10,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fde047' }}>💡🌸 {q.hint}</span>
                </div>
              )}

              {/* Auto-Advance Feedback Banner */}
              {answered && (
                <div
                  className="anim-fade"
                  style={{
                    background: selected === q.answer ? 'rgba(34, 197, 94, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                    border: `1.5px solid ${selected === q.answer ? '#22c55e' : '#ef4444'}`,
                    borderRadius: 14,
                    padding: '10px 14px',
                    marginTop: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        color: selected === q.answer ? '#86efac' : '#fca5a5',
                        fontSize: 14,
                      }}
                    >
                      {selected === q.answer ? '🎉🌸 YAY! SUPER CORRECT!' : '💭🧸 OOPS! GOOD TRY!'}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#fde047' }}>
                      ⏭️ Next exam question in 1.3s...
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.4 }}>{q.explanation}</div>
                  <div
                    style={{
                      marginTop: 8,
                      height: 4,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.12)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #f472b6, #fde047)',
                        animation: 'autoNextFill 1.3s linear forwards',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes autoNextFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
