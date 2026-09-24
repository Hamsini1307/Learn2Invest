import React from 'react'
import { AI_AVATARS } from '../components/AiAvatarSelector.jsx'

export default function LandingJourney({ go, state, aiGuideAvatar = 'female', openAvatarModal }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const { xp = 0, lessonsWatched = [], intermediateUnlocked, advancedUnlocked } = state || {}

  const completedCount = lessonsWatched.length

  return (
    <div className="content-area" style={{ minHeight: '100%' }}>
      
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
        background: 'var(--bg-gradient-radial, radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.18) 0%, rgba(18, 16, 12, 0.95) 70%))',
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
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.28) 0%, transparent 70%)',
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
                color: '#fbbf24',
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
            fontSize: '38px',
            fontWeight: 900,
            lineHeight: 1.05,
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'var(--brand-title-gradient, linear-gradient(180deg, #ffffff 20%, #fef3c7 60%, #f59e0b 100%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            LEARN2INVEST
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--gold-amber, #fbbf24)',
            fontFamily: 'Space Grotesk',
            fontWeight: 700,
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            LEARN. INVEST. GROW.
          </p>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-sub, #d1d5db)',
            margin: '0 auto 24px',
            lineHeight: 1.5,
            maxWidth: '640px'
          }}>
            Step into the luxury financial arena. Master stock markets, simulate live SIP portfolios, and conquer risk with interactive simulations.
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
              EXPLORE WORLD MAP →
            </button>
            <button
              onClick={() => go('level-map')}
              className="btn-outline"
              style={{
                flex: '1 1 180px',
                borderColor: 'var(--gold-primary, #10b981)',
                color: 'var(--gold-amber, #6ee7b7)',
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
                color: 'var(--gold-amber, #fbbf24)',
                fontSize: '14px',
                padding: '12px 20px',
                borderRadius: '999px',
                background: 'var(--gold-bg, rgba(217, 119, 6, 0.08))',
                textDecoration: 'none',
                display: 'block'
              }}
            >
              EXPLORE LEVELS ↓
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
          background: 'var(--card-bg-gradient, linear-gradient(135deg, rgba(22, 19, 14, 0.92) 0%, rgba(14, 12, 9, 0.95) 100%))',
          border: '1px solid var(--border-light, rgba(217, 119, 6, 0.3))',
          borderRadius: '20px',
          padding: '16px 14px',
          textAlign: 'center',
          boxShadow: 'var(--card-shadow, 0 10px 30px rgba(0,0,0,0.4))'
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>3 LEVELS</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>School • Lab • Tower</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-primary, #f59e0b)' }}>{xp} XP</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>Earned XP</div>
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
            🗺️ STEP-BY-STEP PROGRESSION
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 8px 0' }}>
            THE LEARNING JOURNEY
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px' }}>
            Progress sequentially through interactive classrooms, real-time lab tools, and portfolio management.
          </p>
        </div>

        {/* 3 COLUMNS RESPONSIVE GRID ON DESKTOP */}
        <div className="level-cards-grid">
          
          {/* STEP 1 ROADMAP CARD */}
          <div className="glass-card-sm" style={{ padding: '24px' }}>
            <div style={{
              background: 'var(--gold-primary, #f59e0b)',
              color: '#080705',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              LEVEL 01
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🌱 LEARN2INVEST SCHOOL</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              Master financial fundamentals: Inflation, Compounding, Stock Markets, Mutual Funds, and Asset Classes.
            </p>
            <div style={{ fontSize: '11px', color: 'var(--gold-amber, #f59e0b)', fontWeight: 800 }}>
              STATUS: {completedCount > 0 ? 'IN PROGRESS' : 'READY TO START'}
            </div>
          </div>

          {/* STEP 2 ROADMAP CARD */}
          <div className="glass-card-sm" style={{
            padding: '24px',
            opacity: intermediateUnlocked ? 1 : 0.85
          }}>
            <div style={{
              background: intermediateUnlocked ? 'var(--gold-primary, #f59e0b)' : 'rgba(255,255,255,0.08)',
              color: intermediateUnlocked ? '#080705' : '#94a3b8',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              LEVEL 02
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🧪 INVESTMENT LAB</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              Simulate investment scenarios: Test SIP calculators, blend assets in the Mixer, and analyze risk safety scores.
            </p>
            <div style={{ fontSize: '11px', color: intermediateUnlocked ? 'var(--gold-amber, #f59e0b)' : 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
              STATUS: {intermediateUnlocked ? 'UNLOCKED ✅' : 'REQUIRES LEVEL 1 PASS'}
            </div>
          </div>

          {/* STEP 3 ROADMAP CARD */}
          <div className="glass-card-sm" style={{
            padding: '24px',
            opacity: advancedUnlocked ? 1 : 0.85
          }}>
            <div style={{
              background: advancedUnlocked ? 'var(--gold-primary, #f59e0b)' : 'rgba(255,255,255,0.08)',
              color: advancedUnlocked ? '#080705' : 'var(--text-muted, #94a3b8)',
              fontSize: '10px',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-block',
              marginBottom: '10px'
            }}>
              LEVEL 03
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--heading-color, #ffffff)', margin: '0 0 6px 0', fontFamily: 'Space Grotesk' }}>🏦 PORTFOLIO TOWER</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5, marginBottom: '16px' }}>
              Construct your custom portfolio: Allocate PPF, FD, NSC, SSY, and RD to optimize total expected return.
            </p>
            <div style={{ fontSize: '11px', color: advancedUnlocked ? 'var(--gold-amber, #f59e0b)' : 'var(--text-muted, #94a3b8)', fontWeight: 800 }}>
              STATUS: {advancedUnlocked ? 'UNLOCKED ✅' : 'REQUIRES LEVEL 2 PASS'}
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
      <section style={{ padding: '32px 16px', background: 'var(--bg-card-deep, rgba(18, 16, 12, 0.6))', borderTop: '1px solid rgba(217, 119, 6, 0.15)' }}>
        <div>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            LEVEL 01 • THE FOUNDATION
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 12px', lineHeight: 1.2 }}>
            🌱 LEARN2INVEST SCHOOL
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
            "Start with the basics." Experience structured video lessons presented on an interactive classroom projector screen.
          </p>

          {/* Interactive Smartphone Screen Mockup */}
          <div style={{
            width: '100%',
            background: 'var(--bg-card-deep, #12100c)',
            border: '3px solid #d97706',
            borderRadius: '24px',
            padding: '14px',
            boxShadow: 'var(--card-shadow, 0 15px 40px rgba(0,0,0,0.8))',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24' }}>📹 CLASSROOM SCREEN</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted, #9ca3af)' }}>{completedCount}/5 Lessons</div>
            </div>
            <div style={{
              background: 'var(--bg-main, #000)',
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
              ENTER SCHOOL →
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LEVEL 2 LAB SHOWCASE ─── */}
      <section style={{ padding: '32px 16px' }}>
        <div>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            LEVEL 02 • THE LAB
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '4px 0 12px', lineHeight: 1.2 }}>
            🧪 INVESTMENT LAB
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
            "Don't just learn it. Try it." Experiment safely with monthly SIP compounding calculators, portfolio asset mixers, and financial safety scoring.
          </p>

          <div style={{
            width: '100%',
            background: 'var(--bg-card-deep, #12100c)',
            border: '3px solid #d97706',
            borderRadius: '24px',
            padding: '14px',
            boxShadow: 'var(--card-shadow, 0 15px 40px rgba(0,0,0,0.8))',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24' }}>🧪 SIMULATION CANVAS</div>
              <div style={{ fontSize: '10px', color: intermediateUnlocked ? '#10b981' : '#f59e0b' }}>
                {intermediateUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </div>
            </div>
            <div style={{
              background: 'var(--input-bg, #1a1610)',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(245,158,11,0.2)',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #d1d5db)' }}>SIP Monthly Investment:</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>₹5,000 / mo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #d1d5db)' }}>Expected Return (CAGR):</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>12.5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub, #d1d5db)' }}>Est. 10-Year Corpus:</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>₹11,61,695</span>
              </div>
            </div>
            <button
              onClick={() => go('intermediate')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px' }}
            >
              LAUNCH INVESTMENT LAB →
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: LUNA / AI GUIDE FEATURE ─── */}
      <section style={{ padding: '32px 16px', textAlign: 'center', background: 'var(--bg-card-deep, rgba(18, 16, 12, 0.6))' }}>
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
            color: '#fbbf24',
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
        background: 'var(--bg-gradient-radial, radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.2) 0%, rgba(8, 7, 5, 1) 75%))',
        borderTop: '1px solid rgba(217, 119, 6, 0.3)'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 900,
          color: 'var(--heading-color, #fff)',
          margin: '0 0 12px 0',
          fontFamily: 'Space Grotesk'
        }}>
          READY TO LEVEL UP?
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
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
          }}
        >
          START LEARNING NOW →
        </button>
      </section>

    </div>
  )
}
