import { useState } from 'react'
import { modules } from '../data.js'
import BuildingCard from '../components/BuildingCard.jsx'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'
import { getText } from '../data/translations.js'

function StatCard({ icon, label, value, color, delay, themeMode }) {
  const isLight = themeMode === 'light'
  return (
    <div
      className={`glass-card-sm anim-fade delay-${delay}`}
      style={{
        padding: '20px 16px',
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
        border: `1.5px solid rgba(217,119,6,0.3)`,
        borderRadius: 16,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.06)' : `0 4px 15px rgba(0,0,0,0.4)`,
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px rgba(245,158,11,0.2)` }}
      onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = isLight ? '0 4px 15px rgba(0,0,0,0.06)' : `0 4px 15px rgba(0,0,0,0.4)` }}
    >
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div className="font-display" style={{ fontSize: 28, color: 'var(--gold-amber, #fbbf24)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)', fontWeight: 800, marginTop: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ go, goBack, state, addXP, aiGuideAvatar = 'female', lang = 'en', themeMode }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const isLight = themeMode === 'light'
  const isIntermediateStart = state.startingLevel === 'intermediate'
  const begCleared = (isIntermediateStart && (state.quizScore || 0) >= 60) || ((state.lessonsWatched || []).length >= 4 && (state.quizScore || 0) >= 60)
  const begPct = begCleared ? 100 : Math.round((Math.min(4, (state.lessonsWatched || []).length) / 4) * 100)
  const currentLevel = state.advancedUnlocked ? 'Advanced' : state.intermediateUnlocked ? 'Intermediate' : 'Beginner'

  const intCount = state.completedModules?.length || 0
  const intPct = Math.min(100, Math.round((intCount / modules.length) * 100))

  const levels = [
    {
      id: 'beginner', type: 'school', title: `🌱 ${getText('school', lang)}`, screen: 'beginner',
      desc: getText('schoolDesc', lang),
      pct: begPct,
      locked: false,
      buttonText: `${getText('enterSchool', lang)} →`,
    },
    {
      id: 'intermediate', type: 'lab', title: `🧪 ${getText('lab', lang)}`, screen: 'intermediate',
      desc: getText('labDesc', lang),
      pct: state.intermediateUnlocked ? (state.startingLevel === 'intermediate' && state.quizScore < 60 ? 0 : (state.advancedUnlocked ? 100 : intPct)) : 0,
      locked: !state.intermediateUnlocked,
      buttonText: state.startingLevel === 'intermediate' && state.quizScore < 60 ? 'Take Entry Quiz' : `${getText('enterLab', lang)} →`,
    },
    {
      id: 'advanced', type: 'tower', title: `🏦 ${getText('tower', lang)}`, screen: 'advanced',
      desc: getText('towerDesc', lang),
      pct: state.advancedUnlocked ? 20 : 0,
      locked: !state.advancedUnlocked,
      buttonText: `${getText('enterTower', lang)} →`,
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
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
        >
          <span>⬅</span>
          <span>{getText('backToMain', lang)}</span>
        </button>
      </div>

      {/* Hero Greeting */}
      <div className="glass-card anim-fade" style={{ padding: '24px 28px', marginBottom: 24, border: '1.5px solid rgba(217,119,6,0.3)', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 8 }}>
              📊 {getText('dashboard', lang).toUpperCase()} · GUIDE: {activeAvatar.name.toUpperCase()} {activeAvatar.icon}
            </div>
            <h2 className="font-display" style={{ fontSize: 34, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              {getText('welcome', lang).toUpperCase()}, {state.user?.name}! ⚡
            </h2>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 14, fontWeight: 600 }}>
              Current location: <strong style={{ color: 'var(--gold-amber, #fbbf24)' }}>{currentLevel === 'Beginner' ? `🏫 ${getText('school', lang)}` : currentLevel === 'Intermediate' ? `🧪 ${getText('lab', lang)}` : `🏢 ${getText('tower', lang)}`}</strong>
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
              <span>{getText('savedSimulationsBtn', lang)}</span>
            </button>
            <button
              className="btn-primary"
              onClick={() => go('quiz')}
              style={{ fontSize: 13, padding: '10px 20px' }}
            >
              {getText('takeQuiz', lang)}
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.removeItem('l2i_isLoggedIn')
                localStorage.removeItem('l2i_currentUser')
                localStorage.removeItem('l2i_token')
                window.location.reload()
              }}
              style={{
                fontSize: 13,
                padding: '10px 18px',
                borderColor: '#e11d48',
                color: isLight ? '#be123c' : '#fda4af',
                background: isLight ? '#fee2e2' : 'rgba(225, 29, 72, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Log out and return to Login / Registration page"
            >
              <span>🚪</span>
              <span>{getText('logout', lang)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon="⭐" label={getText('xpPoints', lang)} value={state.xp} color="#f59e0b" delay={1} themeMode={themeMode} />
        <StatCard icon="📺" label={getText('videoLessons', lang)} value={`${Math.min(4, state.lessonsWatched.length)}/4`} color="#fbbf24" delay={2} themeMode={themeMode} />
        <StatCard icon="🎯" label={getText('status', lang)} value={currentLevel.toUpperCase()} color="#10b981" delay={3} themeMode={themeMode} />
      </div>

      {/* Overall Progress */}
      <div className="glass-card-sm anim-fade delay-4" style={{ padding: '20px', marginBottom: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(217,119,6,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 800, color: 'var(--heading-color, #ffffff)', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            🚀 {getText('campusProgress', lang)}
          </span>
          <span style={{ fontWeight: 900, color: 'var(--gold-amber, #fbbf24)', fontSize: 13 }}>
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
          {getText('campusLocations', lang)}
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
              buttonText={bld.locked ? (bld.id === 'intermediate' ? `🔒 ${getText('reqLvl1', lang)}` : `🔒 ${getText('reqLvl2', lang)}`) : bld.buttonText}
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
