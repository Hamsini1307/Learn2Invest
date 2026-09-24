import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MarqueeTicker from '../components/MarqueeTicker.jsx'
import BuildingCard from '../components/BuildingCard.jsx'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'

export default function LevelMap({ go, goBack, state, aiGuideAvatar = 'female', aiGuideName, openAvatarModal }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name

  const [activeTarget, setActiveTarget] = useState(null)
  const [cameraState, setCameraState] = useState({ scale: 1, x: 0, y: 0 })
  const [playerPos, setPlayerPos] = useState({ x: 20, y: 55 })
  const [activeNodes, setActiveNodes] = useState([])
  const [transitioningText, setTransitioningText] = useState('')

  const isUnlocked = (id) => {
    if (id === 'beginner' || id === 'quiz') return true
    if (id === 'intermediate') return state.intermediateUnlocked
    if (id === 'advanced') return state.advancedUnlocked
    return true
  }

  const currentLevel = state.advancedUnlocked ? 'advanced'
    : state.intermediateUnlocked ? 'intermediate' : 'beginner'

  const isIntermediateStart = state.startingLevel === 'intermediate'
  const begCleared = (isIntermediateStart && (state.quizScore || 0) >= 60) || ((state.lessonsWatched || []).length >= 4 && (state.quizScore || 0) >= 60)
  const begPct = begCleared ? 100 : Math.round((Math.min(4, (state.lessonsWatched || []).length) / 4) * 100)
  const intPct = Math.min(100, Math.round(((state.completedModules?.length || 0) / 6) * 100))

  const handleLocationClick = (locId, screen, title) => {
    if (!isUnlocked(locId)) return
    if (activeTarget) return

    setActiveTarget(locId)
    setTransitioningText(`Entering ${title}...`)

    // Camera zoom coordinates
    let targetCam = { scale: 1.3, x: 0, y: 0 }
    let targetPlayer = { x: 20, y: 55 }
    let pathNodeCount = 0

    if (locId === 'beginner') {
      targetCam = { scale: 1.32, x: 180, y: -40 }
      targetPlayer = { x: 22, y: 48 }
      pathNodeCount = 3
    } else if (locId === 'intermediate') {
      targetCam = { scale: 1.35, x: 0, y: 40 }
      targetPlayer = { x: 50, y: 38 }
      pathNodeCount = 6
    } else if (locId === 'advanced') {
      targetCam = { scale: 1.32, x: -180, y: 60 }
      targetPlayer = { x: 78, y: 32 }
      pathNodeCount = 9
    }

    // Step 1: Sequential node illumination
    for (let i = 1; i <= pathNodeCount; i++) {
      setTimeout(() => {
        setActiveNodes(prev => [...prev, i])
      }, i * 100)
    }

    // Step 2: Player movement and Camera zoom
    setTimeout(() => {
      setPlayerPos(targetPlayer)
      setCameraState(targetCam)
    }, 250)

    // Step 3: Transition and navigation
    setTimeout(() => {
      go(screen)
    }, 1200)
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif", position: 'relative' }}>
      {/* Top Back Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={goBack || (() => go('landing'))}
          style={{
            background: 'var(--bg-card, rgba(18, 16, 12, 0.9))',
            border: '1.5px solid rgba(217, 119, 6, 0.4)',
            color: 'var(--gold-amber, #fbbf24)',
            borderRadius: 999,
            padding: '8px 18px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          <span>⬅</span>
          <span>Back to Main Page</span>
        </button>
      </div>
      {/* Marquee Ticker */}
      <div style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden' }}>
        <MarqueeTicker bg="var(--bg-card-deep, #12100c)" color="#fbbf24" speed={22} />
      </div>

      {/* Header Banner */}
      <div className="glass-card anim-fade" style={{ padding: '24px 28px', marginBottom: 20, textAlign: 'center', border: '1.5px solid rgba(217, 119, 6, 0.35)', background: 'var(--bg-card-deep, #12100c)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
          <span className="sticker-badge sticker-yellow">🏙️ INTERACTIVE FINANCIAL WORLD MAP</span>
          <button
            onClick={() => go('dashboard')}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>📊</span>
            <span>VIEW DASHBOARD</span>
          </button>
          <button
            onClick={openAvatarModal}
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{activeAvatar.icon}</span>
            <span>{guideName.toUpperCase()} ⚙️</span>
          </button>
        </div>
        <h1 className="font-display" style={{ fontSize: 34, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
          LUXURY FINANCIAL CAMPUS
        </h1>
        <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 14, fontWeight: 600, maxWidth: '600px', margin: '0 auto 12px' }}>
          Welcome back, <strong style={{ color: '#fbbf24' }}>{state.user?.name || 'Kavya'}</strong>! 
          Tap a location on the interactive map to travel to your destination.
        </p>
      </div>

      {/* ─── INTERACTIVE CAMERA WORLD MAP SCENE ─── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: 24,
        overflow: 'hidden',
        border: '2px solid rgba(217, 119, 6, 0.4)',
        boxShadow: 'var(--card-shadow, 0 20px 50px rgba(0,0,0,0.8))',
        marginBottom: 28,
        background: 'var(--bg-main, #0a0907)'
      }}>
        {/* Animated Camera Viewport */}
        <motion.div
          animate={{
            scale: cameraState.scale,
            x: cameraState.x,
            y: cameraState.y,
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/scenes/overworld.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformOrigin: 'center center',
          }}
        >
          {/* Ambient Lighting Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.15) 0%, rgba(8,7,5,0.45) 80%)',
            pointerEvents: 'none',
          }} />

          {/* SVG Progression Path connecting School -> Lab -> Tower */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path
              d="M 200 230 Q 350 210 500 180 T 800 150"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
              strokeDasharray="8 8"
            />
            <path
              d="M 200 230 Q 350 210 500 180 T 800 150"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeDasharray="8 8"
              style={{
                opacity: activeTarget ? 1 : 0.4,
                filter: 'drop-shadow(0 0 8px #f59e0b)',
                transition: 'opacity 0.4s ease'
              }}
            />

            {/* Path Nodes */}
            {[
              { id: 1, cx: 240, cy: 225 },
              { id: 2, cx: 300, cy: 218 },
              { id: 3, cx: 370, cy: 205 },
              { id: 4, cx: 440, cy: 192 },
              { id: 5, cx: 520, cy: 178 },
              { id: 6, cx: 600, cy: 168 },
              { id: 7, cx: 680, cy: 158 },
              { id: 8, cx: 750, cy: 150 },
            ].map(node => (
              <circle
                key={node.id}
                cx={node.cx}
                cy={node.cy}
                r={activeNodes.includes(node.id) ? 8 : 5}
                fill={activeNodes.includes(node.id) ? '#10b981' : '#fbbf24'}
                stroke="#080705"
                strokeWidth="2"
                style={{
                  filter: activeNodes.includes(node.id) ? 'drop-shadow(0 0 10px #10b981)' : 'none',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </svg>

          {/* Location 1: Learn2Invest School */}
          <div
            onClick={() => handleLocationClick('beginner', 'beginner', 'Learn2Invest School')}
            style={{
              position: 'absolute', left: '20%', top: '46%', transform: 'translate(-50%, -50%)',
              cursor: 'pointer', zIndex: 10, textAlign: 'center'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              animate={{
                boxShadow: activeTarget === 'beginner'
                  ? '0 0 35px #10b981, 0 0 15px #6ee7b7'
                  : '0 10px 25px rgba(0,0,0,0.5)'
              }}
              style={{
                background: 'var(--bg-card, rgba(18, 16, 12, 0.92))',
                border: activeTarget === 'beginner' ? '3px solid #10b981' : '2px solid #10b981',
                borderRadius: 16, padding: '10px 16px',
                color: 'var(--heading-color, #ffffff)', minWidth: 150
              }}
            >
              <div className="sticker-badge sticker-lime" style={{ fontSize: 9, marginBottom: 4 }}>LEVEL 1</div>
              <div style={{ fontWeight: 900, fontSize: 13, color: 'var(--heading-color, #ffffff)' }}>🏫 SCHOOL</div>
              <div style={{ fontSize: 10, color: '#10b981', fontWeight: 800, marginTop: 2 }}>Enter School →</div>
            </motion.div>
          </div>

          {/* Location 2: Investment Lab */}
          <div
            onClick={() => handleLocationClick('intermediate', 'intermediate', 'Investment Lab')}
            style={{
              position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)',
              cursor: state.intermediateUnlocked ? 'pointer' : 'not-allowed', zIndex: 10, textAlign: 'center',
              opacity: state.intermediateUnlocked ? 1 : 0.75
            }}
          >
            <motion.div
              whileHover={state.intermediateUnlocked ? { scale: 1.08 } : {}}
              animate={{
                boxShadow: activeTarget === 'intermediate'
                  ? '0 0 35px #38bdf8, 0 0 15px #818cf8'
                  : '0 10px 25px rgba(0,0,0,0.5)'
              }}
              style={{
                background: 'var(--bg-card, rgba(18, 16, 12, 0.92))',
                border: activeTarget === 'intermediate' ? '3px solid #38bdf8' : state.intermediateUnlocked ? '2px solid #38bdf8' : '2px solid #64748b',
                borderRadius: 16, padding: '10px 16px',
                color: 'var(--heading-color, #ffffff)', minWidth: 150
              }}
            >
              <div className="sticker-badge sticker-cyan" style={{ fontSize: 9, marginBottom: 4 }}>LEVEL 2</div>
              <div style={{ fontWeight: 900, fontSize: 13, color: 'var(--heading-color, #ffffff)' }}>🧪 INVESTMENT LAB</div>
              <div style={{ fontSize: 10, color: state.intermediateUnlocked ? '#38bdf8' : 'var(--text-muted, #94a3b8)', fontWeight: 800, marginTop: 2 }}>
                {state.intermediateUnlocked ? 'Continue →' : '🔒 Score 60%+ Quiz'}
              </div>
            </motion.div>
          </div>

          {/* Location 3: Portfolio Tower */}
          <div
            onClick={() => handleLocationClick('advanced', 'advanced', 'Portfolio Tower')}
            style={{
              position: 'absolute', left: '80%', top: '28%', transform: 'translate(-50%, -50%)',
              cursor: state.advancedUnlocked ? 'pointer' : 'not-allowed', zIndex: 10, textAlign: 'center',
              opacity: state.advancedUnlocked ? 1 : 0.75
            }}
          >
            <motion.div
              whileHover={state.advancedUnlocked ? { scale: 1.08 } : {}}
              animate={{
                boxShadow: activeTarget === 'advanced'
                  ? '0 0 35px #f59e0b, 0 0 15px #fbbf24'
                  : '0 10px 25px rgba(0,0,0,0.5)'
              }}
              style={{
                background: 'var(--bg-card, rgba(18, 16, 12, 0.92))',
                border: activeTarget === 'advanced' ? '3px solid #f59e0b' : state.advancedUnlocked ? '2px solid #f59e0b' : '2px solid #64748b',
                borderRadius: 16, padding: '10px 16px',
                color: 'var(--heading-color, #ffffff)', minWidth: 150
              }}
            >
              <div className="sticker-badge sticker-yellow" style={{ fontSize: 9, marginBottom: 4 }}>LEVEL 3</div>
              <div style={{ fontWeight: 900, fontSize: 13, color: 'var(--heading-color, #ffffff)' }}>🏢 PORTFOLIO TOWER</div>
              <div style={{ fontSize: 10, color: state.advancedUnlocked ? '#f59e0b' : 'var(--text-muted, #94a3b8)', fontWeight: 800, marginTop: 2 }}>
                {state.advancedUnlocked ? 'Unlock Level 3 →' : '🔒 Pass Level 2'}
              </div>
            </motion.div>
          </div>

          {/* Player Avatar Marker Travelling Path */}
          <motion.div
            animate={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              pointerEvents: 'none'
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #0284c7)',
              border: '2.5px solid #ffffff',
              boxShadow: '0 0 20px #10b981, 0 0 10px #ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#ffffff'
            }}>
              {(state.user?.name || 'K').charAt(0).toUpperCase()}
            </div>
          </motion.div>

        </motion.div>

        {/* Camera Transition Overlay */}
        <AnimatePresence>
          {activeTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 50,
                background: 'rgba(8, 7, 5, 0.75)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12
              }}
            >
              <div style={{ fontSize: 42, animation: 'floatY 1s ease-in-out infinite' }}>🚀</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#fbbf24', letterSpacing: '1px' }}>
                {transitioningText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Building Cards Grid */}
      <div className="level-cards-grid">
        {[
          { id: 'beginner', type: 'school', label: 'LEARN2INVEST SCHOOL', desc: 'Watch 4 projector video lessons on financial schemes', screen: 'beginner', btnText: 'Enter School →', reqText: 'Unlocked' },
          { id: 'intermediate', type: 'lab', label: 'INVESTMENT LAB', desc: 'Simulations & deeper asset allocation strategies', screen: 'intermediate', btnText: 'Continue →', reqText: '🔒 Score 60%+ in Quiz Hall to unlock' },
          { id: 'advanced', type: 'tower', label: 'PORTFOLIO TOWER', desc: 'Portfolio mastery & advanced investment strategies', screen: 'advanced', btnText: 'Unlock Level 3', reqText: '🔒 Complete Level 2 Lab to unlock' },
        ].map((bld) => {
          const unlocked = isUnlocked(bld.id)
          const pct = bld.id === 'beginner' ? begPct : bld.id === 'intermediate' ? intPct : (state.advancedUnlocked ? 20 : 0)

          return (
            <BuildingCard
              key={bld.id}
              type={bld.type}
              title={bld.label}
              subtitle={bld.desc}
              locked={!unlocked}
              active={currentLevel === bld.id}
              pct={pct}
              buttonText={unlocked ? bld.btnText : bld.reqText}
              onClick={() => handleLocationClick(bld.id, bld.screen, bld.label)}
            />
          )
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <button className="btn-primary" onClick={() => go('dashboard')} style={{ padding: '14px 32px' }}>
          📊 VIEW DASHBOARD ANALYTICS
        </button>
        <button className="btn-outline" onClick={() => go('landing')} style={{ padding: '14px 32px' }}>
          ✨ EXPLORE JOURNEY OVERVIEW
        </button>
      </div>
    </div>
  )
}
