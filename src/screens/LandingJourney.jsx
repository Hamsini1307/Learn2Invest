import React from 'react'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'
import { getText } from '../data/translations.js'

export default function LandingJourney({ go, goBack, canGoBack, state, aiGuideAvatar = 'female', openAvatarModal, themeMode, lang = 'en' }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const { xp = 0, lessonsWatched = [], intermediateUnlocked, advancedUnlocked } = state || {}

  const completedCount = lessonsWatched.length
  const isLight = themeMode === 'light'

  return (
    <div className="content-area" style={{ minHeight: '100%' }}>
      {canGoBack && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={goBack}
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
            <span>{getText('backToPrev', lang)}</span>
          </button>
        </div>
      )}
      
      {/* ─── SECTION 1: HERO HEADER ─── */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '30px 16px 40px',
        position: 'relative',
        borderRadius: '24px',
        background: isLight 
          ? 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0.95) 70%)' 
          : 'var(--bg-gradient-radial, radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.18) 0%, rgba(18, 16, 12, 0.95) 70%))',
        marginBottom: '28px'
      }}>
        {/* Ambient Gold Glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="sticker-badge sticker-yellow">
              🏆 #1 INVESTMENT APP
            </span>
            <button
              onClick={openAvatarModal}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                color: isLight ? '#b45309' : '#fbbf24',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{activeAvatar.icon}</span>
              <span>{activeAvatar.name.toUpperCase()} ⚙️</span>
            </button>
          </div>

          <h1 style={{
            fontSize: '40px',
            fontWeight: 900,
            lineHeight: 1.1,
            fontFamily: "'Space Grotesk', sans-serif",
            color: isLight ? '#7c2d12' : '#fbbf24',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            {getText('appName', lang)}
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--gold-amber, #fbbf24)',
            fontFamily: 'Space Grotesk',
            fontWeight: 700,
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            {getText('taglineSub', lang)}
          </p>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-sub, #334155)',
            margin: '0 auto 24px',
            lineHeight: 1.5,
            maxWidth: '640px'
          }}>
            {getText('heroDesc', lang)}
          </p>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '640px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => go('level-map')}
              className="btn-primary"
              style={{
                flex: '1 1 180px',
                fontSize: '14px',
                padding: '14px 20px',
                borderRadius: '999px',
                fontWeight: 900
              }}
            >
              {getText('exploreWorldMap', lang)}
            </button>
            <button
              onClick={() => go('level-map')}
              className="btn-outline"
              style={{
                flex: '1 1 180px',
                borderColor: 'var(--gold-primary, #10b981)',
                color: isLight ? '#047857' : 'var(--gold-amber, #6ee7b7)',
                fontSize: '14px',
                padding: '12px 20px',
                borderRadius: '999px',
                background: 'var(--gold-bg, rgba(16, 185, 129, 0.12))'
              }}
            >
              🗺️ VIEW CAMPUS MAP
            </button>
            <a
              href="#journey"
              className="btn-outline"
              style={{
                flex: '1 1 180px',
                borderColor: 'var(--gold-dark, #d97706)',
                color: isLight ? '#92400e' : 'var(--gold-amber, #fbbf24)',
                fontSize: '14px',
                padding: '12px 20px',
                borderRadius: '999px',
                background: 'var(--gold-bg, rgba(217, 119, 6, 0.08))',
                textDecoration: 'none',
                display: 'block'
              }}
            >
              {getText('exploreLevels', lang)}
            </a>
          </div>
        </div>

        {/* Feature Stat Bar */}
        <div style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%',
          maxWidth: '640px',
          background: isLight ? '#ffffff' : 'var(--card-bg-gradient, linear-gradient(135deg, rgba(22, 19, 14, 0.92) 0%, rgba(14, 12, 9, 0.95) 100%))',
          border: '1px solid var(--border-light, rgba(217, 119, 6, 0.3))',
          borderRadius: '20px',
          padding: '16px 14px',
          textAlign: 'center',
          boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.06)' : 'var(--card-shadow, 0 10px 30px rgba(0,0,0,0.4))'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>3 LEVELS</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>School • Lab • Tower</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>{xp} XP</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>{getText('totalXp', lang)}</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>{activeAvatar.icon}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>{activeAvatar.name}</div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: THE JOURNEY ROADMAP ─── */}
      <section id="journey" style={{ padding: '12px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            🗺️ {getText('stepProgression', lang)}
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 8px 0' }}>
            {getText('learningJourney', lang)}
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px' }}>
            {getText('learningJourneySub', lang)}
          </p>
        </div>

        {/* 3 COLUMNS RESPONSIVE GRID ON DESKTOP */}
        <div className="level-cards-grid">
          
          {/* STEP 1 ROADMAP CARD */}
          <div className="glass-card-sm" style={{ 
            padding: '24px',
            background: isLight ? '#ffffff' : undefined,
            border: isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : undefined,
            boxShadow: isLight ? '0 10px 30px rgba(194, 65, 12, 0.08)' : undefined
          }}>
            <div style={{
              background: 'var(--gold-primary, #f59e0b)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              {getText('level01', lang)}
            </div>
            <h3 style={{ fontSize: '20px', color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🌱 {getText('school', lang)}</h3>
            <p style={{ fontSize: '12px', color: isLight ? '#334155' : 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              {getText('schoolDesc', lang)}
            </p>
            <div style={{ fontSize: '11px', color: isLight ? '#c2410c' : 'var(--gold-amber, #f59e0b)', fontWeight: 800 }}>
              {getText('status', lang)}: {completedCount > 0 ? getText('inProgress', lang) : getText('readyToStart', lang)}
            </div>
          </div>

          {/* STEP 2 ROADMAP CARD */}
          <div className="glass-card-sm" style={{
            padding: '24px',
            opacity: intermediateUnlocked ? 1 : 0.85,
            background: isLight ? '#ffffff' : undefined,
            border: isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : undefined,
            boxShadow: isLight ? '0 10px 30px rgba(194, 65, 12, 0.08)' : undefined
          }}>
            <div style={{
              background: intermediateUnlocked ? 'var(--gold-primary, #f59e0b)' : 'rgba(128,128,128,0.2)',
              color: intermediateUnlocked ? '#ffffff' : (isLight ? '#475569' : 'var(--text-muted, #94a3b8)'),
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              {getText('level02', lang)}
            </div>
            <h3 style={{ fontSize: '20px', color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🧪 {getText('lab', lang)}</h3>
            <p style={{ fontSize: '12px', color: isLight ? '#334155' : 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              {getText('labDesc', lang)}
            </p>
            <div style={{ fontSize: '11px', color: intermediateUnlocked ? (isLight ? '#c2410c' : 'var(--gold-amber, #f59e0b)') : (isLight ? '#64748b' : 'var(--text-muted, #94a3b8)'), fontWeight: 800 }}>
              {getText('status', lang)}: {intermediateUnlocked ? getText('unlockedBadge', lang) : getText('reqLvl1', lang)}
            </div>
          </div>

          {/* STEP 3 ROADMAP CARD */}
          <div className="glass-card-sm" style={{
            padding: '24px',
            opacity: advancedUnlocked ? 1 : 0.85,
            background: isLight ? '#ffffff' : undefined,
            border: isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : undefined,
            boxShadow: isLight ? '0 10px 30px rgba(194, 65, 12, 0.08)' : undefined
          }}>
            <div style={{
              background: advancedUnlocked ? 'var(--gold-primary, #f59e0b)' : 'rgba(128,128,128,0.2)',
              color: advancedUnlocked ? '#ffffff' : (isLight ? '#475569' : 'var(--text-muted, #94a3b8)'),
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              {getText('level03', lang)}
            </div>
            <h3 style={{ fontSize: '20px', color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🏦 {getText('tower', lang)}</h3>
            <p style={{ fontSize: '12px', color: isLight ? '#334155' : 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              {getText('towerDesc', lang)}
            </p>
            <div style={{ fontSize: '11px', color: advancedUnlocked ? 'var(--gold-amber, #f59e0b)' : 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
              {getText('status', lang)}: {advancedUnlocked ? getText('unlockedBadge', lang) : getText('reqLvl2', lang)}
            </div>
          </div>

        </div>
      </section>

      {/* ─── BEHANCE STYLE HEADER DIVIDER ─── */}
      <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
        <span style={{
          background: 'linear-gradient(90deg, #d97706, #f59e0b)',
          color: '#080705',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: 900,
          letterSpacing: '1.5px',
          boxShadow: '0 0 15px rgba(245,158,11,0.3)'
        }}>
          UI SCREENS & MOCKUPS
        </span>
      </div>

      {/* ─── SECTION 3: LEVEL 1 SCHOOL SHOWCASE ─── */}
      <section style={{ 
        padding: '32px 16px', 
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, rgba(18, 16, 12, 0.6))', 
        borderTop: '1px solid rgba(217, 119, 6, 0.15)',
        borderRadius: '20px',
        marginBottom: '24px'
      }}>
        <div>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            {getText('level01', lang)} • THE FOUNDATION
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 12px', lineHeight: 1.2 }}>
            🌱 {getText('school', lang)}
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
            {getText('schoolDesc', lang)}
          </p>

          {/* Interactive Smartphone Screen Mockup */}
          <div style={{
            width: '100%',
            background: isLight ? '#f8fafc' : 'var(--bg-card-deep, #12100c)',
            border: '2px solid #d97706',
            borderRadius: '24px',
            padding: '14px',
            boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.05)' : 'var(--card-shadow, 0 15px 40px rgba(0,0,0,0.8))',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(217, 119, 6, 0.2)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold-amber, #fbbf24)' }}>📹 CLASSROOM SCREEN</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted, #9ca3af)' }}>{completedCount}/5 Lessons</div>
            </div>
            <div style={{
              background: isLight ? '#ffffff' : 'var(--bg-main, #000)',
              borderRadius: '12px',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245,158,11,0.3)',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>🎓</div>
              <div style={{ color: 'var(--heading-color, #fff)', fontSize: '13px', fontWeight: 700 }}>PROJECTOR LESSON 1</div>
              <div style={{ color: 'var(--text-muted, #9ca3af)', fontSize: '10px' }}>Understanding Inflation & Purchasing Power</div>
            </div>
            <button
              onClick={() => go('beginner')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px' }}
            >
              {getText('enterSchool', lang)} →
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LEVEL 2 LAB SHOWCASE ─── */}
      <section style={{ 
        padding: '32px 16px',
        background: isLight ? '#ffffff' : 'transparent',
        borderRadius: '20px',
        marginBottom: '24px' 
      }}>
        <div>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            {getText('level02', lang)} • THE LAB
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 12px', lineHeight: 1.2 }}>
            🧪 {getText('lab', lang)}
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
            {getText('labDesc', lang)}
          </p>

          <div style={{
            width: '100%',
            background: isLight ? '#f8fafc' : 'var(--bg-card-deep, #12100c)',
            border: '2px solid #d97706',
            borderRadius: '24px',
            padding: '14px',
            boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.05)' : 'var(--card-shadow, 0 15px 40px rgba(0,0,0,0.8))',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(217, 119, 6, 0.2)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gold-amber, #fbbf24)' }}>🧪 SIMULATION CANVAS</div>
              <div style={{ fontSize: '10px', color: intermediateUnlocked ? '#10b981' : '#f59e0b' }}>
                {intermediateUnlocked ? getText('unlockedBadge', lang) : getText('status', lang)}
              </div>
            </div>
            <div style={{
              background: isLight ? '#ffffff' : 'var(--input-bg, #1a1610)',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(245,158,11,0.2)',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #334155)' }}>SIP Monthly Investment:</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>₹5,000 / mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #334155)' }}>Expected Return (CAGR):</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>12.5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #334155)' }}>Est. 10-Year Corpus:</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>₹11,61,695</span>
              </div>
            </div>
            <button
              onClick={() => go('intermediate')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px' }}
            >
              {getText('enterLab', lang)} →
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: LUNA / AI GUIDE FEATURE ─── */}
      <section style={{ 
        padding: '32px 16px', 
        textAlign: 'center', 
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, rgba(18, 16, 12, 0.6))',
        borderRadius: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '44px',
          marginBottom: '8px',
          display: 'inline-block',
          filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))'
        }}>
          {activeAvatar.icon}
        </div>
        <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
          🤖 MEET YOUR AI MENTOR
        </span>
        <h2 style={{ fontSize: '26px', color: 'var(--heading-color, #fff)', margin: '4px 0 8px 0' }}>
          AI GUIDE: {activeAvatar.name.toUpperCase()}
        </h2>
        <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
          Ask anything from "What is Nifty 50?" to "How should I structure my SIP for tax efficiency?".
        </p>

        <button
          onClick={openAvatarModal}
          className="btn-outline"
          style={{
            width: '100%',
            borderColor: '#f59e0b',
            color: isLight ? '#b45309' : '#fbbf24',
            padding: '12px',
            fontSize: '13px'
          }}
        >
          CHANGE AI AVATAR ({activeAvatar.name} ACTIVE) ⚙️
        </button>
      </section>

      {/* ─── SECTION 6: FINAL CTA ─── */}
      <section style={{
        padding: '48px 16px',
        textAlign: 'center',
        background: isLight 
          ? 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(255, 255, 255, 1) 75%)' 
          : 'var(--bg-gradient-radial, radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.2) 0%, rgba(8, 7, 5, 1) 75%))',
        borderTop: '1px solid rgba(217, 119, 6, 0.3)',
        borderRadius: '24px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 900,
          color: 'var(--heading-color, #fff)',
          margin: '0 0 12px 0',
          fontFamily: 'Space Grotesk'
        }}>
          {getText('readyToLevelUp', lang)}
        </h2>
        <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '14px', marginBottom: '24px' }}>
          Take full control of your financial destiny today. Start Level 1 School now!
        </p>

        <button
          onClick={() => go('level-map')}
          className="btn-primary"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            color: '#080705',
            fontSize: '16px',
            padding: '16px',
            border: 'none',
            fontWeight: 900,
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
          }}
        >
          {getText('startLearningNow', lang)}
        </button>
      </section>

    </div>
  )
}
