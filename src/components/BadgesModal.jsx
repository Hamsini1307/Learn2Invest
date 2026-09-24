import React from 'react'

export const ALL_BADGES = [
  { id: 'b_early', title: '🌱 Early Saver', desc: 'Watched your first video lesson', reqXp: 30, icon: '🌱', category: 'beginner' },
  { id: 'b_scholar', title: '🎓 Quiz Scholar', desc: 'Passed the Level 1 Entry Quiz with 60%+', reqXp: 150, icon: '🎓', category: 'beginner' },
  { id: 'b_ppf', title: '🏰 PPF Fortress Master', desc: 'Mastered Public Provident Fund 15-year EEE rules', reqXp: 180, icon: '🏰', category: 'intermediate' },
  { id: 'b_sip', title: '🚀 SIP Magic Wizard', desc: 'Calculated monthly compounding growth in Lab', reqXp: 210, icon: '🚀', category: 'intermediate' },
  { id: 'b_cyber', title: '🛡️ Security Shield', desc: 'Defeated all cyber phishing & UPI scams', reqXp: 260, icon: '🛡️', category: 'intermediate' },
  { id: 'b_tower', title: '🏢 Portfolio Architect', desc: 'Created & saved a multi-asset investment portfolio', reqXp: 350, icon: '🏢', category: 'advanced' },
  { id: 'b_legend', title: '🏆 Financial Legend', desc: 'Accumulated 500+ XP in Learn2Invest', reqXp: 500, icon: '🏆', category: 'legend' },
]

export default function BadgesModal({ state, onClose }) {
  const currentXp = state.xp || 0

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} className="anim-fade" onClick={onClose}>
      <div style={{
        background: 'var(--bg-card-deep, #12100c)',
        border: '2px solid #f59e0b',
        borderRadius: 24,
        padding: '28px',
        maxWidth: 540,
        width: '100%',
        color: '#fef3c7',
        boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
        fontFamily: "'Space Grotesk', sans-serif"
      }} className="anim-scale" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🎖️</span>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, color: '#ffffff', lineHeight: 1 }}>
                ACHIEVEMENT BADGES
              </h2>
              <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>
                Earn badges as you master financial concepts!
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Badges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
          {ALL_BADGES.map(badge => {
            const unlocked = currentXp >= badge.reqXp || (badge.id === 'b_scholar' && (state.quizScore || 0) >= 60)
            return (
              <div key={badge.id} style={{
                background: unlocked ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1.5px solid ${unlocked ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 16,
                padding: '14px',
                opacity: unlocked ? 1 : 0.55,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                <div style={{
                  fontSize: 26,
                  filter: unlocked ? 'drop-shadow(0 0 8px #f59e0b)' : 'grayscale(1)',
                }}>
                  {badge.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: unlocked ? '#ffffff' : '#9ca3af' }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#d1d5db', fontWeight: 600, marginTop: 2 }}>
                    {badge.desc}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, marginTop: 6, color: unlocked ? '#10b981' : '#f59e0b' }}>
                    {unlocked ? '✓ UNLOCKED' : `🔒 REQ: ${badge.reqXp} XP`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 12 }}>
          KEEP LEARNING TO UNLOCK ALL 🚀
        </button>
      </div>
    </div>
  )
}
