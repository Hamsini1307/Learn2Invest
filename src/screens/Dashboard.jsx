import { useState } from 'react'
import { modules } from '../data.js'
import BuildingCard from '../components/BuildingCard.jsx'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'

function StatCard({ icon, label, value, color, delay }) {
  return (
    <div
      className={`glass-card-sm anim-fade delay-${delay}`}
      style={{
        padding: '20px 16px',
        background: 'var(--bg-card-deep, #12100c)',
        border: `1.5px solid rgba(217,119,6,0.3)`,
        borderRadius: 16,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: `0 4px 15px rgba(0,0,0,0.4)`,
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px rgba(245,158,11,0.2)` }}
      onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 15px rgba(0,0,0,0.4)` }}
    >
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div className="font-display" style={{ fontSize: 28, color: '#fbbf24', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)', fontWeight: 800, marginTop: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ go, goBack, state, addXP, aiGuideAvatar = 'female' }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const isIntermediateStart = state.startingLevel === 'intermediate'
  const begCleared = (isIntermediateStart && (state.quizScore || 0) >= 60) || ((state.lessonsWatched || []).length >= 4 && (state.quizScore || 0) >= 60)
  const begPct = begCleared ? 100 : Math.round((Math.min(4, (state.lessonsWatched || []).length) / 4) * 100)
  const currentLevel = state.advancedUnlocked ? 'Advanced' : state.intermediateUnlocked ? 'Intermediate' : 'Beginner'

  const intCount = state.completedModules?.length || 0
  const intPct = Math.min(100, Math.round((intCount / modules.length) * 100))

  const levels = [
    {
      id: 'beginner', type: 'school', title: 'LEARN2INVEST SCHOOL', screen: 'beginner',
      desc: 'Watch 4 video lessons on PPF, FD, Stocks & Mutual Funds then take the quiz.',
      pct: begPct,
      locked: false,
      buttonText: 'Enter School →',
    },
    {
      id: 'intermediate', type: 'lab', title: 'INVESTMENT LAB', screen: 'intermediate',
      desc: 'Investment simulations & portfolio mixer — must complete videos to unlock next level.',
      pct: state.intermediateUnlocked ? (state.startingLevel === 'intermediate' && state.quizScore < 60 ? 0 : (state.advancedUnlocked ? 100 : intPct)) : 0,
      locked: !state.intermediateUnlocked,
      buttonText: state.startingLevel === 'intermediate' && state.quizScore < 60 ? 'Take Entry Quiz' : 'Continue →',
    },
    {
      id: 'advanced', type: 'tower', title: 'PORTFOLIO TOWER', screen: 'advanced',
      desc: 'Portfolio mastery, risk management & advanced Indian investment strategies.',
      pct: state.advancedUnlocked ? 20 : 0,
      locked: !state.advancedUnlocked,
      buttonText: 'Unlock Level 3',
    },
  ]

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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

      {/* Hero Greeting */}
      <div className="glass-card anim-fade" style={{ padding: '24px 28px', marginBottom: 24, border: '1.5px solid rgba(217,119,6,0.3)', background: 'var(--bg-card-deep, #12100c)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8 }}>
              📊 CAMPUS DASHBOARD · GUIDE: {activeAvatar.name.toUpperCase()} {activeAvatar.icon}
            </div>
            <h2 className="font-display" style={{ fontSize: 34, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              HEY, {state.user?.name}! ⚡
            </h2>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 14, fontWeight: 600 }}>
              Current location: <strong style={{ color: '#fbbf24' }}>{currentLevel === 'Beginner' ? 'Learn2Invest School 🏫' : currentLevel === 'Intermediate' ? 'Investment Lab 🧪' : 'Portfolio Tower 🏢'}</strong> • Keep progressing!
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn-secondary"
              onClick={() => go('saved-simulations')}
              style={{
                fontSize: 13,
                padding: '10px 18px',
                background: 'rgba(217, 119, 6, 0.15)',
                border: '1.5px solid #d97706',
                color: 'var(--text-main, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>📁</span>
              <span>SAVED SIMULATIONS</span>
            </button>
            <button
              className="btn-primary"
              onClick={() => go('quiz')}
              style={{ fontSize: 13, padding: '10px 20px' }}
            >
              ⚡ TAKE QUIZ
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon="⭐" label="XP Points" value={state.xp} color="#f59e0b" delay={1} />
        <StatCard icon="📺" label="Lessons Watched" value={`${Math.min(4, state.lessonsWatched.length)}/4`} color="#fbbf24" delay={2} />
        <StatCard icon="🎯" label="Active Location" value={currentLevel.toUpperCase()} color="#10b981" delay={3} />
      </div>

      {/* Overall Progress */}
      <div className="glass-card-sm anim-fade delay-4" style={{ padding: '20px', marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(217,119,6,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            🚀 OVERALL CAMPUS PROGRESS
          </span>
          <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: 13 }}>
            {state.advancedUnlocked ? 100 : state.intermediateUnlocked ? (40 + Math.round(intPct * 0.4)) : Math.round(begPct * 0.4)}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${state.advancedUnlocked ? 100 : state.intermediateUnlocked ? (40 + Math.round(intPct * 0.4)) : Math.round(begPct * 0.4)}%` }}
          />
        </div>
      </div>

      {/* Buildings Section */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="font-display" style={{ fontSize: 24, color: 'var(--heading-color, #ffffff)', marginBottom: 14 }}>
          CAMPUS LOCATIONS 🏫🧪🏢
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%' }}>
          {levels.map((bld) => (
            <BuildingCard
              key={bld.id}
              type={bld.type}
              title={bld.title}
              subtitle={bld.desc}
              locked={bld.locked}
              active={currentLevel.toLowerCase() === bld.id}
              pct={bld.pct}
              buttonText={bld.locked ? (bld.id === 'intermediate' ? '🔒 Score 60%+ in Quiz Hall to unlock' : '🔒 Complete Level 2 Lab to unlock') : bld.buttonText}
              onClick={() => (
                bld.id === 'intermediate' && state.startingLevel === 'intermediate' && state.quizScore < 60
                  ? go('quiz')
                  : go(bld.screen)
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
