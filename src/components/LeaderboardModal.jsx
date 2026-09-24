import React, { useState } from 'react'

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Ananya Sharma', xp: 950, level: 'Portfolio Tower (L3)', badge: '🏆 Legend', avatar: '👩‍💼' },
  { rank: 2, name: 'Rahul Verma', xp: 820, level: 'Investment Lab (L2)', badge: '🚀 SIP Wizard', avatar: '👨‍🎓' },
  { rank: 3, name: 'Priyanshu Patel', xp: 740, level: 'Investment Lab (L2)', badge: '🏰 PPF Master', avatar: '🧑‍💻' },
  { rank: 4, name: 'Kavya Nair', xp: 620, level: 'Investment Lab (L2)', badge: '🎓 Quiz Scholar', avatar: '👩‍🏫' },
  { rank: 5, name: 'Siddharth Rao', xp: 510, level: 'School (L1)', badge: '🌱 Early Saver', avatar: '👦' },
  { rank: 6, name: 'Meera Deshmukh', xp: 430, level: 'School (L1)', badge: '🛡️ Cyber Shield', avatar: '👧' },
]

export default function LeaderboardModal({ user, userXp, onClose }) {
  const [filter, setFilter] = useState('all') // 'all' | 'friends'

  const currentUser = {
    rank: userXp > 800 ? 2 : userXp > 500 ? 4 : 5,
    name: `${user?.name || 'You'} (You)`,
    xp: userXp || 30,
    level: 'Active Learner',
    badge: '⚡ Financial Contender',
    avatar: '🌟',
    isYou: true
  }

  const list = [...MOCK_LEADERBOARD]
  // Update currentUser XP in list
  const userIdx = list.findIndex(u => u.name.includes('(You)'))
  if (userIdx === -1) {
    list.push(currentUser)
  }
  list.sort((a, b) => b.xp - a.xp)

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
        maxWidth: 520,
        width: '100%',
        color: '#fef3c7',
        boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
        fontFamily: "'Space Grotesk', sans-serif"
      }} className="anim-scale" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🏆</span>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, color: '#ffffff', lineHeight: 1 }}>
                CAMPUS LEADERBOARD
              </h2>
              <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>
                Top Financial Learners in India 🇮🇳
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* User Rank Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
          border: '1.5px solid #f59e0b',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>⭐</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>YOUR CURRENT RANK</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>{user?.name || 'You'}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fbbf24' }}>{userXp || 30} XP</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>Top 15% Learner</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
          {list.map((item, index) => {
            const isTop3 = index < 3
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`
            return (
              <div key={index} style={{
                background: item.isYou ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1.5px solid ${item.isYou ? '#10b981' : isTop3 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 14,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, width: 28, textAlign: 'center', color: isTop3 ? '#fbbf24' : '#9ca3af' }}>
                    {rankEmoji}
                  </div>
                  <div style={{ fontSize: 22 }}>{item.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: item.isYou ? '#6ee7b7' : '#ffffff' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>
                      {item.level} • <span style={{ color: '#fbbf24' }}>{item.badge}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 900, color: '#fbbf24' }}>
                  {item.xp} XP
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 12 }}>
          CLOSE LEADERBOARD 🚀
        </button>
      </div>
    </div>
  )
}
