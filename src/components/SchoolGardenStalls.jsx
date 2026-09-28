import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'

// Sound Effects Helper for Stalls & Spin Wheel
function playStallSfx(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    if (type === 'tick') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(680, now)
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.045)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now + i * 0.09)
        gain.gain.setValueAtTime(0.22, now + i * 0.09)
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.09 + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.09)
        osc.stop(now + i * 0.09 + 0.26)
      })
    } else if (type === 'buy') {
      const notes = [587.33, 880.0]
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(f, now + i * 0.08)
        gain.gain.setValueAtTime(0.2, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.18)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.2)
      })
    }
  } catch {}
}

// ============================================================================
// STALL 1 DATA: CLOTHES BOUTIQUE (MINIMUM 20 XP PER OUTFIT)
// ============================================================================
export const CLOTHING_ITEMS = [
  {
    id: 'cloth_emerald_blazer',
    name: 'Emerald Scholar Blazer',
    icon: '🧥',
    cost: 20,
    color: '#10B981',
    top: '#10B981',
    pants: '#064E3B',
    bag: '#F59E0B',
    ring: '#34D399',
    desc: 'Sharp campus blazer in signature Learn2Invest emerald green.',
  },
  {
    id: 'cloth_royal_hoodie',
    name: 'Royal Indigo Tech Hoodie',
    icon: '👕',
    cost: 25,
    color: '#6366F1',
    top: '#6366F1',
    pants: '#1E1B4B',
    bag: '#38BDF8',
    ring: '#818CF8',
    desc: 'Cozy coder & fin-tech investor hoodie with neon trim.',
  },
  {
    id: 'cloth_sunset_jacket',
    name: 'Golden Bull Varsity Jacket',
    icon: '🦺',
    cost: 30,
    color: '#F59E0B',
    top: '#F59E0B',
    pants: '#1E293B',
    bag: '#EF4444',
    ring: '#FBBF24',
    desc: 'Sporty gold & amber varsity jacket for market champions.',
  },
  {
    id: 'cloth_crimson_suit',
    name: 'Wall Street Executive Coat',
    icon: '👔',
    cost: 35,
    color: '#EC4899',
    top: '#EC4899',
    pants: '#31102F',
    bag: '#FDE047',
    ring: '#F472B6',
    desc: 'High-confidence executive coat for smart portfolio managers.',
  },
  {
    id: 'cloth_cyber_cape',
    name: 'Cyber FinTech Suit',
    icon: '🦸',
    cost: 45,
    color: '#06B6D4',
    top: '#06B6D4',
    pants: '#0F172A',
    bag: '#A855F7',
    ring: '#22D3EE',
    desc: 'Futuristic cyan suit worn by Level 3 Digital Banking masters.',
  },
]

// ============================================================================
// STALL 2 DATA: ICE CREAM PARLOUR (STRICTLY LESS THAN 10 XP)
// ============================================================================
export const ICE_CREAM_ITEMS = [
  {
    id: 'ice_vanilla',
    name: 'Classic Vanilla Bean Cone',
    icon: '🍦',
    cost: 3,
    flavorColor: '#FEF3C7',
    desc: 'Creamy vanilla cone — a sweet micro-treat that barely touches your XP budget!',
  },
  {
    id: 'ice_strawberry',
    name: 'Berry Compounding Swirl',
    icon: '🍧',
    cost: 5,
    flavorColor: '#FBCFE8',
    desc: 'Fresh strawberry swirl cup with crunchy waffle bits.',
  },
  {
    id: 'ice_mango',
    name: 'Alphonso Mango Sorbet',
    icon: '🍨',
    cost: 6,
    flavorColor: '#FDE68A',
    desc: 'Tropical sunny mango scoop for a refreshing study break.',
  },
  {
    id: 'ice_choco',
    name: 'Belgian Dark Choco Fudge',
    icon: '🍫',
    cost: 8,
    flavorColor: '#D97706',
    desc: 'Rich double chocolate fudge sundae — still under 10 XP!',
  },
  {
    id: 'ice_rainbow',
    name: 'Diversified Rainbow Gelato',
    icon: '🌈',
    cost: 9,
    flavorColor: '#A7F3D0',
    desc: '5 flavors in 1 cup — diversified just like a smart investment portfolio!',
  },
]

// ============================================================================
// STALL 3 DATA: SPIN THE FINANCE WHEEL (6 CATEGORIES & REAL-LIFE SCENARIOS)
// ============================================================================
export const WHEEL_SLICES = [
  { id: 'saving', label: 'Saving', icon: '💰', color: '#10B981', textColor: '#052E16' },
  { id: 'spending', label: 'Spending', icon: '🛍️', color: '#F59E0B', textColor: '#451A03' },
  { id: 'banking', label: 'Banking', icon: '🏦', color: '#3B82F6', textColor: '#172554' },
  { id: 'budgeting', label: 'Budgeting', icon: '📊', color: '#8B5CF6', textColor: '#2E1065' },
  { id: 'investing', label: 'Investing', icon: '📈', color: '#EC4899', textColor: '#500724' },
  { id: 'scams', label: 'Scams', icon: '🛡️', color: '#EF4444', textColor: '#450A0A' },
]

export const WHEEL_SCENARIOS = {
  saving: [
    {
      title: 'Birthday Gift Money! 🎂',
      situation: 'Your grandparents just gifted you ₹2,000 for your birthday! What is the smartest financial move?',
      xpReward: 20,
      choices: [
        {
          text: 'Save ₹1,500 in a Recurring Deposit / Savings Account and spend ₹500 on a treat',
          isBest: true,
          lunaExplain: 'Awesome choice! Saving 75% first ("Pay Yourself First") lets your ₹1,500 earn interest while you still enjoy ₹500 guilt-free!',
        },
        {
          text: 'Spend all ₹2,000 immediately on video game skins',
          isBest: false,
          lunaExplain: 'Game skins are fun for a day, but once spent, all ₹2,000 is gone forever with ₹0 interest earned! Saving most of it builds real wealth.',
        },
        {
          text: 'Hide the cash under your mattress for 5 years',
          isBest: false,
          lunaExplain: 'Keeping cash idle at home earns 0% interest and loses value to inflation. A bank or Post Office account grows your money safely!',
        },
      ],
    },
    {
      title: 'Emergency Rainy-Day Fund ☔',
      situation: 'Your bicycle tire gets punctured before school exams. Where should emergency repair money come from?',
      xpReward: 20,
      choices: [
        {
          text: 'From a dedicated Emergency Savings Fund kept in a liquid savings account',
          isBest: true,
          lunaExplain: 'Spot on! An emergency fund is meant specifically for unexpected needs like repairs or medical bills so you never have to borrow.',
        },
        {
          text: 'Break your 15-year PPF account early',
          isBest: false,
          lunaExplain: 'Long-term investments like PPF are locked in to build big future wealth. Always keep a small separate liquid savings buffer!',
        },
        {
          text: 'Borrow at high interest from an unknown app',
          isBest: false,
          lunaExplain: 'High-interest instant loan apps can trap you in debt! A small emergency fund protects you from ever needing them.',
        },
      ],
    },
  ],
  spending: [
    {
      title: 'Flash Sale Temptation! 👟',
      situation: 'You see sneakers online with a "50% OFF — Ends in 10 Minutes!" timer, even though your current shoes are fine.',
      xpReward: 20,
      choices: [
        {
          text: 'Follow the 24-Hour Rule: wait a day to decide if it is a true Need vs. an impulse Want',
          isBest: true,
          lunaExplain: 'Brilliant! Countdown timers are marketing tricks to trigger impulse buying. Waiting 24 hours saves you from buying things you do not need!',
        },
        {
          text: 'Buy 2 pairs immediately so you "save more"',
          isBest: false,
          lunaExplain: 'Spending money on something you did not need is not saving 50% — it is losing 100% of what you paid!',
        },
        {
          text: 'Empty your school lunch budget to buy them now',
          isBest: false,
          lunaExplain: 'Never sacrifice essential Needs (like food and education) for impulse Wants!',
        },
      ],
    },
  ],
  banking: [
    {
      title: 'Depositing Cash at the Bank 🏦',
      situation: 'You are filling out a Bank Cash Deposit Slip to deposit ₹5,000 into your savings account. What should you always double-check?',
      xpReward: 25,
      choices: [
        {
          text: 'Verify the Account Number, IFSC/Branch name, Amount in words & figures, and collect the stamped counterfoil',
          isBest: true,
          lunaExplain: '100% correct! Checking the account number and keeping the stamped counterfoil receipt is your official proof of deposit.',
        },
        {
          text: 'Write your ATM PIN on the front of the deposit slip',
          isBest: false,
          lunaExplain: 'Never write your ATM PIN or UPI PIN on any paper slip! Bank staff never need your PIN to deposit money.',
        },
        {
          text: 'Leave the amount in words blank so the cashier can fill it later',
          isBest: false,
          lunaExplain: 'Leaving blank spaces on banking slips or cheques is risky. Always write both words and figures clearly yourself!',
        },
      ],
    },
  ],
  budgeting: [
    {
      title: 'The Famous 50/30/20 Budget Rule 📊',
      situation: 'You receive ₹1,000 monthly pocket allowance. How does the classic 50/30/20 rule divide it?',
      xpReward: 25,
      choices: [
        {
          text: '₹500 for Needs (50%), ₹300 for Wants (30%), and ₹200 for Savings/Investing (20%)',
          isBest: true,
          lunaExplain: 'Yay! You nailed the 50/30/20 rule! It balances essentials, fun treats, and future wealth automatically every month.',
        },
        {
          text: '₹900 for Wants and ₹100 for Needs, with ₹0 saved',
          isBest: false,
          lunaExplain: 'Without saving at least 20%, you will not build an investment corpus for your big goals!',
        },
        {
          text: 'Spend everything in Week 1 and hope for more money in Week 2',
          isBest: false,
          lunaExplain: 'Tracking your budget across all 4 weeks prevents running out of money mid-month!',
        },
      ],
    },
  ],
  investing: [
    {
      title: 'Power of Compounding & Safe Schemes 📈',
      situation: 'You want guaranteed, 100% tax-free (EEE) long-term wealth backed by the Government of India. Which scheme fits best?',
      xpReward: 25,
      choices: [
        {
          text: 'PPF (Public Provident Fund — 7.1% p.a.) or Sukanya Samriddhi (8.2% p.a.)',
          isBest: true,
          lunaExplain: 'Superb investor mindset! Both PPF and SSY have Sovereign Guarantee and EEE tax status (tax-free deposit, interest, and maturity).',
        },
        {
          text: 'A "Double Your Money in 7 Days" WhatsApp group scheme',
          isBest: false,
          lunaExplain: 'Careful! Any scheme promising to double money in days is a Ponzi scam. Real wealth grows steadily through compounding.',
        },
        {
          text: 'Putting 100% of your money into a single unverified meme token',
          isBest: false,
          lunaExplain: 'Putting everything into one speculative asset is gambling, not investing. Diversification and government-backed schemes protect your capital!',
        },
      ],
    },
  ],
  scams: [
    {
      title: 'Urgent UPI & OTP Alert! 🛡️',
      situation: 'A caller says: "I am calling from your bank. Scan this QR code and enter your UPI PIN to RECEIVE a ₹5,000 scholarship reward!"',
      xpReward: 30,
      choices: [
        {
          text: 'Refuse immediately! You NEVER need to enter a UPI PIN or share an OTP to RECEIVE money',
          isBest: true,
          lunaExplain: 'Champion Cyber Defender! Entering your UPI PIN ALWAYS deducts money from your account — it is never required to receive funds!',
        },
        {
          text: 'Scan the QR code and enter your UPI PIN quickly before the offer expires',
          isBest: false,
          lunaExplain: 'Stop! Scanning a collect QR and entering your PIN sends ₹5,000 OUT of your bank account to the scammer!',
        },
        {
          text: 'Share your 6-digit SMS OTP so the caller can "verify" your account',
          isBest: false,
          lunaExplain: 'Never share an OTP with anyone on a call! Real banks will never ask for your OTP or PIN.',
        },
      ],
    },
  ],
}

// ============================================================================
// ATTRACTIVE 3D GARDEN STALLS IN THE RIGHT-SIDE COURTYARD OF THE SCHOOL YARD
// ============================================================================
export function SchoolGardenStalls3D({ isNight, isNightMode, onSelectStall, hideLabels }) {
  const night = Boolean(isNight || isNightMode)
  const wheelMeshRef = useRef()
  const giantConeRef = useRef()
  const mannequinRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (wheelMeshRef.current) {
      wheelMeshRef.current.rotation.z = t * 1.15
    }
    if (giantConeRef.current) {
      giantConeRef.current.rotation.y = t * 0.9
      giantConeRef.current.position.y = 3.55 + Math.sin(t * 2.2) * 0.08
    }
    if (mannequinRef.current) {
      mannequinRef.current.rotation.y = Math.sin(t * 1.4) * 0.25
    }
  })

  const stalls = [
    {
      id: 'clothes',
      num: 1,
      title: '👕 Stall 1: Fashion Boutique',
      subtitle: 'Outfits • Min 20 XP',
      badge: 'NEW OUTFITS',
      pos: [12.6, 0, 9.5],
      rot: [0, -Math.PI / 2.35, 0],
      roofColor: '#EC4899',
      stripeColor: '#FCE7F3',
      counterColor: '#831843',
      trimColor: '#FDE047',
      accentColor: '#F472B6',
    },
    {
      id: 'icecream',
      num: 2,
      title: '🍦 Stall 2: Gelato Parlour',
      subtitle: 'Sweet Scoops • < 10 XP',
      badge: 'UNDER 10 XP',
      pos: [13.2, 0, 15.0],
      rot: [0, -Math.PI / 2.1, 0],
      roofColor: '#06B6D4',
      stripeColor: '#ECFEFF',
      counterColor: '#0E7490',
      trimColor: '#FBCFE8',
      accentColor: '#38BDF8',
    },
    {
      id: 'wheel',
      num: 3,
      title: '🎡 Stall 3: Spin & Win Wheel',
      subtitle: 'Mini-Game • Win Bonus XP!',
      badge: 'FREE SPIN!',
      pos: [12.4, 0, 20.5],
      rot: [0, -Math.PI / 1.85, 0],
      roofColor: '#F59E0B',
      stripeColor: '#FEF3C7',
      counterColor: '#78350F',
      trimColor: '#A855F7',
      accentColor: '#FBBF24',
    },
  ]

  return (
    <group>
      {/* 1. Decorative Terracotta & Sandstone Marketplace Plaza on the Right-Side Courtyard */}
      <mesh position={[11.6, 0.02, 15.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.2, 16.8]} />
        <meshStandardMaterial color={night ? '#1E293B' : '#F5E6D3'} roughness={0.75} />
      </mesh>
      {/* Decorative Inner Mosaic Border */}
      <mesh position={[11.6, 0.026, 15.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.4, 15.8]} />
        <meshStandardMaterial color={night ? '#334155' : '#FDE68A'} roughness={0.8} />
      </mesh>
      <mesh position={[11.6, 0.032, 15.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 15.1]} />
        <meshStandardMaterial color={night ? '#0F172A' : '#FFFBEB'} roughness={0.75} />
      </mesh>

      {/* 2. Connecting Brick Promenade Path from Main School Walkway (x=0..8.5, z=15.0) */}
      <mesh position={[5.2, 0.025, 15.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 3.2]} />
        <meshStandardMaterial color={night ? '#334155' : '#FED7AA'} roughness={0.8} />
      </mesh>
      {[-0.8, 0.8].map((zOff, i) => (
        <mesh key={i} position={[5.2, 0.03, 15.0 + zOff * 1.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.8, 0.22]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={night ? 1.1 : 0.25}
          />
        </mesh>
      ))}

      {/* 3. Grand Festive Entrance Archway to the Garden Stalls ("CAMPUS BAZAAR") */}
      <group position={[7.8, 0, 15.0]} rotation={[0, -Math.PI / 2, 0]}>
        {[-1.75, 1.75].map((px, idx) => (
          <group key={idx} position={[px, 0, 0]}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.14, 3.6, 12]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, 3.7, 0]}>
              <sphereGeometry args={[0.22, 14, 14]} />
              <meshStandardMaterial
                color="#FDE047"
                emissive="#F59E0B"
                emissiveIntensity={night ? 1.6 : 0.45}
              />
            </mesh>
          </group>
        ))}
        {/* Top Arch Beam */}
        <RoundedBox args={[3.9, 0.48, 0.28]} position={[0, 3.55, 0]} radius={0.14} castShadow>
          <meshStandardMaterial color="#EC4899" roughness={0.35} />
        </RoundedBox>
        {/* Festive Bunting Pennants under Arch */}
        {[-1.3, -0.65, 0, 0.65, 1.3].map((bx, i) => (
          <mesh key={i} position={[bx, 3.18, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.18, 0.32, 4]} />
            <meshStandardMaterial
              color={['#10B981', '#FDE047', '#38BDF8', '#A855F7', '#F43F5E'][i]}
              emissive={['#10B981', '#FDE047', '#38BDF8', '#A855F7', '#F43F5E'][i]}
              emissiveIntensity={night ? 0.8 : 0.2}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Festive Flower Planter Boxes & Glowing Bollards Around the Stalls Plaza */}
      {[
        [8.4, 0, 8.2],
        [8.4, 0, 12.2],
        [8.4, 0, 17.8],
        [8.4, 0, 21.8],
      ].map((p, idx) => (
        <group key={idx} position={p}>
          <RoundedBox args={[0.9, 0.45, 0.9]} position={[0, 0.22, 0]} radius={0.08} castShadow>
            <meshStandardMaterial color="#9A3412" roughness={0.75} />
          </RoundedBox>
          <mesh position={[0, 0.58, 0]} castShadow>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshStandardMaterial color="#22C55E" roughness={0.6} />
          </mesh>
          {[-0.16, 0.16].map((fx, fi) => (
            <mesh key={fi} position={[fx, 0.88, fi === 0 ? 0.12 : -0.12]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#F472B6' : '#FACC15'}
                emissive={idx % 2 === 0 ? '#EC4899' : '#EAB308'}
                emissiveIntensity={night ? 0.9 : 0.25}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. The 3 Vibrant Interactive Garden Stalls */}
      {stalls.map((s) => (
        <group
          key={s.id}
          position={s.pos}
          rotation={s.rot}
          onClick={(e) => {
            e.stopPropagation()
            if (onSelectStall) onSelectStall(s.id)
          }}
        >
          {/* Two-Tiered Luxury Deck Base with Glowing Rim */}
          <RoundedBox args={[4.2, 0.18, 3.2]} position={[0, 0.09, 0]} radius={0.06} receiveShadow castShadow>
            <meshStandardMaterial color="#44403C" roughness={0.75} />
          </RoundedBox>
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[4.05, 0.04, 3.05]} />
            <meshStandardMaterial
              color={s.trimColor}
              emissive={s.trimColor}
              emissiveIntensity={night ? 1.1 : 0.3}
            />
          </mesh>

          {/* Back Backdrop Wall with Decorative Frame */}
          <RoundedBox args={[3.6, 2.5, 0.18]} position={[0, 1.42, -1.15]} radius={0.06} castShadow>
            <meshStandardMaterial color={s.counterColor} roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[3.2, 1.85, 0.06]} position={[0, 1.5, -1.04]} radius={0.04}>
            <meshStandardMaterial color={s.stripeColor} roughness={0.4} />
          </RoundedBox>

          {/* Front Boutique Counter with Vertical Fluted Stripes */}
          <RoundedBox args={[3.5, 1.05, 0.92]} position={[0, 0.7, 0.78]} radius={0.08} castShadow receiveShadow>
            <meshStandardMaterial color={s.counterColor} roughness={0.45} />
          </RoundedBox>
          {[-1.2, -0.6, 0, 0.6, 1.2].map((cx, ci) => (
            <mesh key={ci} position={[cx, 0.7, 1.25]}>
              <boxGeometry args={[0.24, 0.86, 0.04]} />
              <meshStandardMaterial color={s.stripeColor} roughness={0.35} />
            </mesh>
          ))}
          {/* Polished Marble Counter Top */}
          <RoundedBox args={[3.72, 0.12, 1.08]} position={[0, 1.26, 0.78]} radius={0.04} castShadow>
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
          </RoundedBox>

          {/* 4 Golden Twist Support Pillars */}
          {[
            [-1.65, 1.58, -1.05],
            [1.65, 1.58, -1.05],
            [-1.65, 1.58, 1.05],
            [1.65, 1.58, 1.05],
          ].map((p, idx) => (
            <mesh key={idx} position={p} castShadow>
              <cylinderGeometry args={[0.075, 0.075, 2.85, 12]} />
              <meshStandardMaterial color="#FDE047" metalness={0.65} roughness={0.25} />
            </mesh>
          ))}

          {/* Pitched Festival Canopy Roof with Alternating Vibrant Stripes */}
          <group position={[0, 3.05, 0]}>
            <RoundedBox args={[4.1, 0.34, 2.9]} radius={0.08} castShadow>
              <meshStandardMaterial color={s.roofColor} roughness={0.4} />
            </RoundedBox>
            {[-1.35, -0.45, 0.45, 1.35].map((sx, i) => (
              <RoundedBox key={i} args={[0.52, 0.36, 2.94]} position={[sx, 0.01, 0]} radius={0.05}>
                <meshStandardMaterial color={s.stripeColor} roughness={0.35} />
              </RoundedBox>
            ))}
            {/* Scalloped Valance Fringe Along Front Edge */}
            {[-1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6].map((vx, vi) => (
              <mesh key={vi} position={[vx, -0.22, 1.42]}>
                <sphereGeometry args={[0.19, 12, 12]} />
                <meshStandardMaterial color={vi % 2 === 0 ? s.roofColor : s.stripeColor} />
              </mesh>
            ))}
            {/* Warm Fairy Light Bulbs Along Front Canopy */}
            {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((lx, li) => (
              <mesh key={li} position={[lx, -0.28, 1.48]}>
                <sphereGeometry args={[0.075, 10, 10]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FDE047"
                  emissiveIntensity={night ? 2.5 : 0.85}
                />
              </mesh>
            ))}
          </group>

          {/* Soft Night Glow Halo on the Ground (Zero pointLight shader recompilation!) */}
          <mesh position={[0, 0.04, 1.4]} rotation={[-Math.PI / 2, 0, 0]} visible={night}>
            <circleGeometry args={[2.8, 20]} />
            <meshBasicMaterial color={s.accentColor} transparent opacity={0.22} />
          </mesh>

          {/* ─── STALL 1 SPECIFIC PROPS: CLOTHES BOUTIQUE MANNEQUINS & JACKETS ─── */}
          {s.id === 'clothes' && (
            <group>
              {/* 3 Folded Designer Outfits & Blazers on the Counter */}
              {[-0.95, 0, 0.95].map((hx, idx) => (
                <group key={idx} position={[hx, 1.55, 0.78]}>
                  <RoundedBox args={[0.56, 0.58, 0.22]} radius={0.06} castShadow>
                    <meshStandardMaterial
                      color={['#10B981', '#6366F1', '#F59E0B'][idx]}
                      roughness={0.3}
                    />
                  </RoundedBox>
                  {/* Collar / Tie Accent */}
                  <mesh position={[0, 0.16, 0.12]}>
                    <boxGeometry args={[0.2, 0.22, 0.04]} />
                    <meshStandardMaterial color="#FFFFFF" />
                  </mesh>
                </group>
              ))}
              {/* Rotating 3D Showcase Mannequin on Golden Pedestal Next to Stall */}
              <group position={[-2.35, 0, 0.95]}>
                <mesh position={[0, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.38, 0.44, 0.4, 16]} />
                  <meshStandardMaterial color="#F59E0B" metalness={0.5} roughness={0.3} />
                </mesh>
                <group ref={mannequinRef} position={[0, 0.4, 0]}>
                  <mesh position={[0, 0.45, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.9, 10]} />
                    <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
                  </mesh>
                  <RoundedBox args={[0.52, 0.68, 0.28]} position={[0, 0.88, 0]} radius={0.08} castShadow>
                    <meshStandardMaterial color="#10B981" roughness={0.3} />
                  </RoundedBox>
                  <mesh position={[0, 1.36, 0]}>
                    <sphereGeometry args={[0.16, 14, 14]} />
                    <meshStandardMaterial color="#FDE68A" roughness={0.3} />
                  </mesh>
                </group>
              </group>
            </group>
          )}

          {/* ─── STALL 2 SPECIFIC PROPS: GIANT ROOFTOP ICE CREAM CONE & GELATO COUNTER ─── */}
          {s.id === 'icecream' && (
            <group>
              {/* Giant Floating 3D Triple-Scoop Ice Cream Cone on Roof */}
              <group ref={giantConeRef} position={[0, 3.6, 0.2]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
                  <coneGeometry args={[0.36, 0.85, 16]} />
                  <meshStandardMaterial color="#D97706" roughness={0.55} />
                </mesh>
                <mesh position={[0, 0.5, 0]} castShadow>
                  <sphereGeometry args={[0.38, 16, 16]} />
                  <meshStandardMaterial color="#FBCFE8" roughness={0.35} />
                </mesh>
                <mesh position={[0, 0.88, 0]} castShadow>
                  <sphereGeometry args={[0.31, 16, 16]} />
                  <meshStandardMaterial color="#FDE68A" roughness={0.35} />
                </mesh>
                <mesh position={[0, 1.18, 0]} castShadow>
                  <sphereGeometry args={[0.24, 14, 14]} />
                  <meshStandardMaterial color="#6EE7B7" roughness={0.35} />
                </mesh>
                {/* Cherry on Top */}
                <mesh position={[0, 1.44, 0]}>
                  <sphereGeometry args={[0.09, 12, 12]} />
                  <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.4} />
                </mesh>
              </group>

              {/* 4 Colorful Cones & Sundae Cups on the Counter */}
              {[-1.05, -0.35, 0.35, 1.05].map((ix, idx) => (
                <group key={idx} position={[ix, 1.32, 0.78]}>
                  <mesh position={[0, 0.16, 0]} rotation={[Math.PI, 0, 0]} castShadow>
                    <coneGeometry args={[0.15, 0.36, 12]} />
                    <meshStandardMaterial color="#D97706" />
                  </mesh>
                  <mesh position={[0, 0.38, 0]} castShadow>
                    <sphereGeometry args={[0.18, 14, 14]} />
                    <meshStandardMaterial
                      color={['#FBCFE8', '#FEF3C7', '#6EE7B7', '#38BDF8'][idx]}
                      roughness={0.3}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          )}

          {/* ─── STALL 3 SPECIFIC PROPS: ANIMATED 3D SPINNING PRIZE WHEEL ─── */}
          {s.id === 'wheel' && (
            <group>
              {/* Large Animated 6-Slice 3D Wheel Mounted on Front Display */}
              <group position={[0, 2.02, -0.32]}>
                <group ref={wheelMeshRef}>
                  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.92, 0.92, 0.14, 24]} />
                    <meshStandardMaterial
                      color="#F59E0B"
                      emissive="#D97706"
                      emissiveIntensity={night ? 0.65 : 0.2}
                    />
                  </mesh>
                  {/* 6 Colorful Wheel Spokes / Jewels */}
                  {[0, 1, 2, 3, 4, 5].map((wi) => {
                    const ang = (wi * Math.PI) / 3
                    return (
                      <mesh
                        key={wi}
                        position={[Math.cos(ang) * 0.56, Math.sin(ang) * 0.56, 0.09]}
                      >
                        <sphereGeometry args={[0.16, 12, 12]} />
                        <meshStandardMaterial
                          color={['#10B981', '#EC4899', '#3B82F6', '#8B5CF6', '#EF4444', '#FDE047'][wi]}
                          emissive={['#10B981', '#EC4899', '#3B82F6', '#8B5CF6', '#EF4444', '#FDE047'][wi]}
                          emissiveIntensity={night ? 0.9 : 0.3}
                        />
                      </mesh>
                    )
                  })}
                </group>
                {/* Center Golden Hub */}
                <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.16, 16]} />
                  <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
                </mesh>
              </group>

              {/* Golden Trophy Cups on Counter */}
              {[-0.9, 0.9].map((tx, ti) => (
                <group key={ti} position={[tx, 1.34, 0.78]}>
                  <mesh position={[0, 0.18, 0]} castShadow>
                    <cylinderGeometry args={[0.16, 0.09, 0.34, 12]} />
                    <meshStandardMaterial color="#FACC15" metalness={0.75} roughness={0.2} />
                  </mesh>
                </group>
              ))}
            </group>
          )}

          {/* Friendly Detailed Stall Shopkeeper Character */}
          <group position={[0, 0.18, -0.1]}>
            <mesh position={[0, 0.95, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.24, 0.62, 14]} />
              <meshStandardMaterial color={s.roofColor} roughness={0.45} />
            </mesh>
            <mesh position={[0, 1.46, 0]} castShadow>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#FDE68A" roughness={0.35} />
            </mesh>
            {/* Shopkeeper Cap */}
            <mesh position={[0, 1.62, 0]} castShadow>
              <cylinderGeometry args={[0.23, 0.23, 0.12, 14]} />
              <meshStandardMaterial color={s.counterColor} />
            </mesh>
          </group>

          {/* Clickable Floating Signboard Above Each Stall */}
          {!hideLabels && (
            <Html position={[0, 4.15, 0]} center distanceFactor={15} zIndexRange={[20, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSelectStall) onSelectStall(s.id)
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
                  color: '#0F172A',
                  border: `3px solid ${s.roofColor}`,
                  borderRadius: '16px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 26px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'transform 0.15s ease',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    background: s.roofColor,
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 900,
                    padding: '1.5px 7px',
                    borderRadius: '999px',
                    marginBottom: '2px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {s.badge}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000' }}>{s.title}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#1E293B' }}>
                  {s.subtitle} • <span style={{ color: '#059669' }}>Click to Enter →</span>
                </div>
              </button>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// INTERACTIVE MODAL FOR ALL 3 GARDEN STALLS
// ============================================================================
export function SchoolGardenStallModal({
  activeStall,
  onClose,
  onSwitchStall,
  xp,
  userXp,
  onSpendXp,
  onEarnXp,
  ownedClothes: ownedClothesProp,
  onBuyCloth,
  equippedColor,
  currentOutfitId,
  onEquipColor,
  onEquipStallOutfit,
  iceCreamsBought: iceCreamsBoughtProp,
  onBuyIceCream,
}) {
  const [wheelAngle, setWheelAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedSlice, setSelectedSlice] = useState(null)
  const [activeScenario, setActiveScenario] = useState(null)
  const [chosenIdx, setChosenIdx] = useState(null)
  const [statusToast, setStatusToast] = useState(null)
  const tickTimerRef = useRef(null)

  const [localOwnedClothes, setLocalOwnedClothes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('l2i_owned_clothes') || '[]')
    } catch {
      return []
    }
  })
  const [localIceCreams, setLocalIceCreams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('l2i_icecreams_bought') || '{}')
    } catch {
      return {}
    }
  })

  if (!activeStall) return null

  // Normalize activeStall whether passed as 1/2/3 or 'clothes'/'icecream'/'wheel'
  const normalizedStall =
    activeStall === 1 || activeStall === 'clothes'
      ? 'clothes'
      : activeStall === 2 || activeStall === 'icecream'
        ? 'icecream'
        : 'wheel'

  const availableXp = Number(xp ?? userXp ?? 0)
  const ownedClothes = ownedClothesProp || localOwnedClothes
  const iceCreamsBought = iceCreamsBoughtProp || localIceCreams

  const showMessage = (msg) => {
    setStatusToast(msg)
    setTimeout(() => setStatusToast(null), 3800)
  }

  const handleEquipItem = (item) => {
    if (onEquipColor) onEquipColor(item.color)
    if (onEquipStallOutfit) {
      onEquipStallOutfit({
        id: item.id,
        label: item.name,
        top: item.top || item.color,
        pants: item.pants || '#1E293B',
        bag: item.bag || '#F59E0B',
        ring: item.ring || item.color,
      })
    }
  }

  const handleBuyClothItem = (item) => {
    if (availableXp < item.cost) return
    playStallSfx('buy')
    if (onSpendXp) onSpendXp(item.cost)
    if (onBuyCloth) onBuyCloth(item.id, item.color)
    const updated = Array.from(new Set([...ownedClothes, item.id]))
    setLocalOwnedClothes(updated)
    try {
      localStorage.setItem('l2i_owned_clothes', JSON.stringify(updated))
    } catch {}
    handleEquipItem(item)
    showMessage(`🎉 Purchased & Equipped ${item.name} for ${item.cost} XP!`)
  }

  const handleBuyIceCreamItem = (ice) => {
    if (availableXp < ice.cost) return
    playStallSfx('buy')
    if (onSpendXp) onSpendXp(ice.cost)
    if (onBuyIceCream) onBuyIceCream(ice.id)
    const updated = { ...iceCreamsBought, [ice.id]: (iceCreamsBought[ice.id] || 0) + 1 }
    setLocalIceCreams(updated)
    try {
      localStorage.setItem('l2i_icecreams_bought', JSON.stringify(updated))
    } catch {}
    showMessage(`🍦 Yum! Bought ${ice.name} for just ${ice.cost} XP (< 10 XP smart budget)!`)
  }

  const handleSpinWheel = () => {
    if (spinning) return
    setSpinning(true)
    setChosenIdx(null)
    setActiveScenario(null)

    const sliceIdx = Math.floor(Math.random() * WHEEL_SLICES.length)
    const slice = WHEEL_SLICES[sliceIdx]
    const sliceDeg = 360 / WHEEL_SLICES.length
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360
    const targetDeg = wheelAngle + extraSpins + (360 - sliceIdx * sliceDeg - sliceDeg / 2)
    setWheelAngle(targetDeg)

    let ticks = 0
    tickTimerRef.current = setInterval(() => {
      ticks++
      playStallSfx('tick')
      if (ticks > 16) clearInterval(tickTimerRef.current)
    }, 150)

    setTimeout(() => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current)
      playStallSfx('win')
      setSpinning(false)
      setSelectedSlice(slice)
      const list = WHEEL_SCENARIOS[slice.id] || WHEEL_SCENARIOS.saving
      const scenario = list[Math.floor(Math.random() * list.length)]
      setActiveScenario(scenario)
    }, 2800)
  }

  const handleChooseWheelOption = (idx) => {
    if (chosenIdx !== null || !activeScenario) return
    setChosenIdx(idx)
    const choice = activeScenario.choices[idx]
    const reward = choice.isBest ? activeScenario.xpReward : 10
    playStallSfx(choice.isBest ? 'win' : 'buy')
    if (onEarnXp) onEarnXp(reward)
    showMessage(
      choice.isBest
        ? `🎉 +${reward} XP Awarded by Luna for the Smart Financial Choice!`
        : `💡 +${reward} XP for completing the challenge! Read Luna's explanation below.`
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99995,
        background: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(820px, 96vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '24px',
          padding: '22px 24px',
          color: '#F8FAFC',
          boxShadow: '0 25px 75px rgba(0,0,0,0.8)',
        }}
      >
        {/* Top Header + Quick Stall Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderBottom: '1px solid rgba(148,163,184,0.25)',
            paddingBottom: '14px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>
              {normalizedStall === 'clothes' ? '👕' : normalizedStall === 'icecream' ? '🍦' : '🎡'}
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#FFFFFF' }}>
                {normalizedStall === 'clothes'
                  ? 'Stall 1: Campus Clothes & Style Boutique (Min 20 XP)'
                  : normalizedStall === 'icecream'
                    ? 'Stall 2: Scoops & Smiles Ice Cream Parlour (< 10 XP)'
                    : 'Stall 3: Spin the Finance Wheel Mini-Game'}
              </h2>
              <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '3px' }}>
                School Yard Garden Bazaar • Your Wallet Balance:{' '}
                <strong style={{ color: '#FBBF24', fontSize: '13.5px' }}>⭐ {availableXp} XP</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(239,68,68,0.2)',
              color: '#FCA5A5',
              border: '1.5px solid rgba(239,68,68,0.5)',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            ✕ Close Stall
          </button>
        </div>

        {/* Interactive Stall Tabs so User Can Hop Between All 3 Stalls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            { id: 'clothes', label: '👕 Stall 1: Clothes (≥ 20 XP)', color: '#EC4899' },
            { id: 'icecream', label: '🍦 Stall 2: Ice Cream (< 10 XP)', color: '#06B6D4' },
            { id: 'wheel', label: '🎡 Stall 3: Spin the Finance Wheel', color: '#F59E0B' },
          ].map((tab) => {
            const active = normalizedStall === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playStallSfx('tick')
                  if (onSwitchStall) onSwitchStall(tab.id)
                }}
                style={{
                  flex: '1 1 180px',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  border: active ? `2px solid ${tab.color}` : '1px solid rgba(148,163,184,0.25)',
                  background: active ? `${tab.color}28` : 'rgba(15,23,42,0.65)',
                  color: active ? '#FFFFFF' : '#CBD5E1',
                  fontSize: '12.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {statusToast && (
          <div
            style={{
              marginBottom: '14px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10B981',
              color: '#6EE7B7',
              fontSize: '13px',
              fontWeight: 800,
              textAlign: 'center',
            }}
          >
            {statusToast}
          </div>
        )}

        {/* STALL 1: CLOTHES SHOP (MIN 20 XP) */}
        {normalizedStall === 'clothes' && (
          <div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: 0, marginBottom: '14px' }}>
              Upgrade your 3D character&apos;s outfit using your earned XP! Every premium campus outfit starts at{' '}
              <strong>20 XP minimum</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {CLOTHING_ITEMS.map((item) => {
                const isOwned = ownedClothes.includes(item.id)
                const isEquipped = equippedColor === item.color || currentOutfitId === item.id
                const canAfford = availableXp >= item.cost
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(15,23,42,0.88)',
                      border: isEquipped ? `2px solid ${item.color}` : '1px solid rgba(148,163,184,0.25)',
                      borderRadius: '16px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: `${item.color}30`,
                            border: `2px solid ${item.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                          }}
                        >
                          {item.icon}
                        </span>
                        <span
                          style={{
                            background: 'rgba(245,158,11,0.18)',
                            border: '1px solid rgba(245,158,11,0.45)',
                            color: '#FBBF24',
                            fontWeight: 900,
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                          }}
                        >
                          ⚡ {item.cost} XP
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>{item.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>{item.desc}</div>
                    </div>

                    {isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleEquipItem(item)
                          playStallSfx('buy')
                          showMessage(`👕 Equipped ${item.name} on your 3D character!`)
                        }}
                        style={{
                          width: '100%',
                          padding: '9px',
                          borderRadius: '10px',
                          border: 'none',
                          background: isEquipped ? '#10B981' : '#3B82F6',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {isEquipped ? '✓ Wearing Now' : '👕 Wear This Outfit'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleBuyClothItem(item)}
                        style={{
                          width: '100%',
                          padding: '9px',
                          borderRadius: '10px',
                          border: 'none',
                          background: canAfford ? `linear-gradient(135deg, ${item.color}, #4F46E5)` : 'rgba(51,65,85,0.7)',
                          color: canAfford ? '#fff' : '#64748B',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {canAfford ? `Buy & Wear (${item.cost} XP)` : `Need ${item.cost} XP`}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STALL 2: ICE CREAM PARLOUR (< 10 XP) */}
        {normalizedStall === 'icecream' && (
          <div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: 0, marginBottom: '14px' }}>
              Enjoy a refreshing campus treat! Every single cone & sundae here costs <strong>less than 10 XP</strong> so you can treat yourself while keeping your savings intact.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {ICE_CREAM_ITEMS.map((ice) => {
                const canAfford = availableXp >= ice.cost
                const count = iceCreamsBought[ice.id] || 0
                return (
                  <div
                    key={ice.id}
                    style={{
                      background: 'rgba(15,23,42,0.88)',
                      border: '1px solid rgba(56,189,248,0.32)',
                      borderRadius: '16px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '28px' }}>{ice.icon}</span>
                        <span
                          style={{
                            background: 'rgba(6,182,212,0.2)',
                            border: '1px solid #06B6D4',
                            color: '#67E8F9',
                            fontWeight: 900,
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                          }}
                        >
                          ⚡ {ice.cost} XP
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC' }}>{ice.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>{ice.desc}</div>
                      {count > 0 && (
                        <div style={{ marginTop: '6px', fontSize: '11px', color: '#4ADE80', fontWeight: 700 }}>
                          🍦 Enjoyed {count} time{count > 1 ? 's' : ''}!
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuyIceCreamItem(ice)}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '10px',
                        border: 'none',
                        background: canAfford ? 'linear-gradient(135deg, #06B6D4, #2563EB)' : 'rgba(51,65,85,0.7)',
                        color: canAfford ? '#fff' : '#64748B',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {canAfford ? `🍦 Buy Scoop (${ice.cost} XP)` : `Need ${ice.cost} XP`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STALL 3: SPIN THE FINANCE WHEEL MINI-GAME */}
        {normalizedStall === 'wheel' && (
          <div style={{ display: 'grid', gridTemplateColumns: activeScenario ? '260px 1fr' : '1fr', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '24px',
                  marginBottom: '-8px',
                  zIndex: 5,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
                }}
              >
                🔻
              </div>

              <div
                style={{
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  border: '6px solid #FBBF24',
                  boxShadow: '0 0 28px rgba(251,191,36,0.45), inset 0 0 15px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: spinning ? 'transform 2.75s cubic-bezier(0.14, 0.85, 0.22, 1)' : 'none',
                  transform: `rotate(${wheelAngle}deg)`,
                  background: `conic-gradient(
                    ${WHEEL_SLICES[0].color} 0deg 60deg,
                    ${WHEEL_SLICES[1].color} 60deg 120deg,
                    ${WHEEL_SLICES[2].color} 120deg 180deg,
                    ${WHEEL_SLICES[3].color} 180deg 240deg,
                    ${WHEEL_SLICES[4].color} 240deg 300deg,
                    ${WHEEL_SLICES[5].color} 300deg 360deg
                  )`,
                }}
              >
                {WHEEL_SLICES.map((s, idx) => {
                  const deg = idx * 60 + 30
                  return (
                    <div
                      key={s.id}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-68px)`,
                        textAlign: 'center',
                        fontWeight: 900,
                        fontSize: '10.5px',
                        color: '#FFFFFF',
                        textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>{s.icon}</div>
                      <div>{s.label}</div>
                    </div>
                  )
                })}

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#0F172A',
                    border: '3px solid #FBBF24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                  }}
                >
                  🎡
                </div>
              </div>

              <button
                type="button"
                onClick={handleSpinWheel}
                disabled={spinning}
                style={{
                  marginTop: '16px',
                  background: spinning
                    ? 'rgba(148,163,184,0.3)'
                    : 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '11px 26px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: spinning ? 'wait' : 'pointer',
                  boxShadow: '0 8px 22px rgba(236,72,153,0.4)',
                }}
              >
                {spinning ? '🎡 Spinning...' : activeScenario ? '🎡 Spin Again!' : '🎡 Spin the Finance Wheel!'}
              </button>
            </div>

            {activeScenario ? (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: `2px solid ${selectedSlice?.color || '#38BDF8'}`,
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      background: `${selectedSlice?.color}30`,
                      border: `1px solid ${selectedSlice?.color}`,
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {selectedSlice?.icon} Category: {selectedSlice?.label}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#FBBF24' }}>
                    Reward: +{activeScenario.xpReward} XP
                  </span>
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 900, color: '#F8FAFC' }}>
                  {activeScenario.title}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#E2E8F0', lineHeight: 1.45 }}>
                  {activeScenario.situation}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeScenario.choices.map((ch, idx) => {
                    const isSelected = chosenIdx === idx
                    const showOutcome = chosenIdx !== null
                    let borderCol = 'rgba(148,163,184,0.3)'
                    let bgCol = 'rgba(30,41,59,0.75)'
                    if (showOutcome) {
                      if (ch.isBest) {
                        borderCol = '#10B981'
                        bgCol = 'rgba(16,185,129,0.18)'
                      } else if (isSelected) {
                        borderCol = '#F59E0B'
                        bgCol = 'rgba(245,158,11,0.18)'
                      }
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChooseWheelOption(idx)}
                        disabled={chosenIdx !== null}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${borderCol}`,
                          background: bgCol,
                          color: '#F8FAFC',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: chosenIdx === null ? 'pointer' : 'default',
                          lineHeight: 1.35,
                        }}
                      >
                        {showOutcome && ch.isBest ? '✅ ' : showOutcome && isSelected ? '💡 ' : `${String.fromCharCode(65 + idx)}. `}
                        {ch.text}
                      </button>
                    )
                  })}
                </div>

                {chosenIdx !== null && (
                  <div
                    style={{
                      marginTop: '12px',
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(56,189,248,0.16))',
                      border: '1px solid rgba(56,189,248,0.45)',
                      borderRadius: '12px',
                      padding: '11px 13px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#38BDF8', marginBottom: '4px' }}>
                      👧✨ Luna Explains:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#F8FAFC', lineHeight: 1.45 }}>
                      {activeScenario.choices[chosenIdx].lunaExplain}
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleSpinWheel}
                        style={{
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '7px 15px',
                          fontSize: '12px',
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                      >
                        🎡 Spin Again →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '13px', marginTop: '4px' }}>
                Click <strong>&ldquo;🎡 Spin the Finance Wheel!&rdquo;</strong> to land on Saving, Spending, Banking, Budgeting, Investing, or Scams and earn bonus XP with Luna!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
