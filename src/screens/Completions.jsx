// Completion / unlock screens in Gold Obsidian aesthetic

function ConfettiDots() {
  const colors = ['#f59e0b', '#d97706', '#fbbf24', '#eab308', '#10b981', '#0284c7']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {Array.from({length: 26}).map((_,i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 4) % 100}%`,
          top: '-10px',
          width: 10 + (i % 3) * 6,
          height: 10 + (i % 3) * 6,
          borderRadius: i % 2 === 0 ? '50%' : '3px',
          background: colors[i % colors.length],
          opacity: 0.8,
          boxShadow: `0 0 10px ${colors[i % colors.length]}`,
          animation: `fadeUp ${1.5 + (i % 4) * 0.3}s ease ${i * 0.08}s both`,
          transform: `rotate(${i * 25}deg)`,
        }} />
      ))}
    </div>
  )
}

export function BeginnerComplete({ go, state }) {
  return (
    <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Space Grotesk', sans-serif" }}>
      <ConfettiDots />
      <div className="glass-card-deep anim-scale" style={{ padding: '50px 40px', maxWidth: 500, width: '100%', textAlign: 'center', background: 'var(--bg-card-deep, #12100c)', border: '2px solid #d97706' }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>🎊</div>

        <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
          BEGINNER PASSED!
        </div>

        <h1 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', marginBottom: 10 }}>
          BEGINNER COMPLETE!
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-sub, #d1d5db)', fontWeight: 600, marginBottom: 20 }}>
          You passed with <strong style={{ color: '#fbbf24' }}>{state.quizScore}%</strong>! Amazing work 🌟
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
          <div className="sticker-badge sticker-yellow" style={{ fontSize: 14, padding: '10px 18px' }}>
            ⭐ {state.xp} XP EARNED
          </div>
          <div className="sticker-badge sticker-yellow" style={{ fontSize: 14, padding: '10px 18px', background: 'rgba(245,158,11,0.2)' }}>
            🎯 {state.correctCount}/{state.quizTotal || 10} CORRECT
          </div>
        </div>

        {/* Unlocked banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '2px solid #f59e0b',
          borderRadius: 18, padding: '20px',
          marginBottom: 28, animation: 'fadeUp 0.5s ease 0.3s both',
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔓</div>
          <div className="font-display" style={{ color: '#fbbf24', fontSize: 22 }}>INTERMEDIATE LEVEL UNLOCKED!</div>
          <div style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
            Investment simulations & portfolio strategy await!
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn-primary" onClick={() => go('intermediate')} style={{ width: '100%', fontSize: 15 }}>
            🚀 GO TO INTERMEDIATE LEVEL
          </button>
          <button className="btn-outline" onClick={() => go('level-map')} style={{ width: '100%' }}>
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  )
}

export function IntermediateComplete({ go, state }) {
  return (
    <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Space Grotesk', sans-serif" }}>
      <ConfettiDots />
      <div className="glass-card-deep anim-scale" style={{ padding: '50px 40px', maxWidth: 500, width: '100%', textAlign: 'center', background: 'var(--bg-card-deep, #12100c)', border: '2px solid #d97706' }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>🏅</div>

        <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
          INTERMEDIATE PASSED!
        </div>

        <h1 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', marginBottom: 10 }}>
          INTERMEDIATE COMPLETE!
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-sub, #d1d5db)', fontWeight: 600, marginBottom: 24 }}>
          You're mastering Indian investments! Ready for the top tier? 🚀
        </p>

        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '2px solid #f59e0b',
          borderRadius: 18, padding: '20px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔓</div>
          <div className="font-display" style={{ color: '#fbbf24', fontSize: 22 }}>PORTFOLIO TOWER UNLOCKED! 🏢</div>
          <div style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
            Premium portfolio strategies & advanced tactics!
          </div>
        </div>

        <button className="btn-primary" onClick={() => go('unlock-adv')} style={{ width: '100%', fontSize: 15, marginBottom: 12 }}>
          🏢 UNLOCK PORTFOLIO TOWER
        </button>
        <button className="btn-outline" onClick={() => go('level-map')} style={{ width: '100%' }}>
          🗺️ LEVEL MAP
        </button>
      </div>
    </div>
  )
}

export function UnlockAdvanced({ go, state, update }) {
  const handleUnlock = () => {
    update({ advancedUnlocked: true })
    go('advanced')
  }

  return (
    <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="glass-card-deep anim-scale" style={{
        padding: '50px 40px', maxWidth: 500, width: '100%', textAlign: 'center',
        background: 'var(--bg-card-deep, #12100c)',
        border: '2px solid #f59e0b',
      }}>
        <div style={{ fontSize: 70, marginBottom: 16, animation: 'floatY 3s ease-in-out infinite' }}>🏆</div>

        <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
          PORTFOLIO TOWER 🏢
        </div>

        <h1 className="font-display" style={{ fontSize: 38, color: 'var(--heading-color, #ffffff)', marginBottom: 12 }}>
          PORTFOLIO TOWER
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-sub, #d1d5db)', fontWeight: 600, marginBottom: 28 }}>
          You've earned access to the most advanced investment strategies. Step inside the tower! 🏢
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {[
            '🎯 Multi-asset portfolio allocation mastery',
            '📊 Risk vs return optimization',
            '💡 80C & Capital gains tax strategies',
            '🚀 Advanced compound growth models',
          ].map((feat, i) => (
            <div key={i} className={`anim-fade delay-${i+1}`} style={{
              background: 'var(--input-bg, rgba(255,255,255,0.03))', borderRadius: 14,
              padding: '12px 16px', textAlign: 'left',
              border: '1.5px solid rgba(217,119,6,0.25)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: 800, color: 'var(--heading-color, #ffffff)',
            }}>{feat}</div>
          ))}
        </div>

        <button className="btn-primary" onClick={handleUnlock} style={{ width: '100%', fontSize: 16 }}>
          🏢 ENTER PORTFOLIO TOWER
        </button>
      </div>
    </div>
  )
}

export function AdvancedResult({ go, state }) {
  return (
    <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Space Grotesk', sans-serif" }}>
      <ConfettiDots />
      <div className="glass-card-deep anim-scale" style={{
        padding: '50px 40px', maxWidth: 500, width: '100%', textAlign: 'center',
        background: 'var(--bg-card-deep, #12100c)',
        border: '2px solid #f59e0b',
      }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: 'floatY 3s ease-in-out infinite' }}>🌟</div>

        <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
          FINANCIAL MASTERY
        </div>

        <h1 className="font-display" style={{ fontSize: 38, color: '#fbbf24', marginBottom: 12 }}>
          INVESTMENT EXPERT! 🏆
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-sub, #d1d5db)', fontWeight: 600, marginBottom: 24 }}>
          You've completed all 3 levels of Learn2Invest. You're now an Indian investment expert!
        </p>

        <div style={{
          background: 'rgba(245,158,11,0.15)',
          border: '2px solid #d97706',
          borderRadius: 18, padding: '20px', marginBottom: 28,
        }}>
          <div className="font-display" style={{ fontSize: 40, color: '#fbbf24', lineHeight: 1 }}>
            ⭐ {state.xp} XP
          </div>
          <div style={{ color: 'var(--heading-color, #ffffff)', fontWeight: 800, fontSize: 13, marginTop: 4 }}>TOTAL XP EARNED</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={() => go('level-map')} style={{ flex: 1 }}>
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  )
}
