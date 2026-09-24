import React, { useState, useEffect } from 'react'
import { apiRequest } from '../api.js'

export default function LeaderboardModal({ user, userXp, onClose, themeMode }) {
  const [leaderboardList, setLeaderboardList] = useState([])
  const [loading, setLoading] = useState(true)
  const isLight = themeMode === 'light'

  useEffect(() => {
    apiRequest('/api/leaderboard', 'GET')
      .then(data => {
        if (data.leaderboard && data.leaderboard.length > 0) {
          setLeaderboardList(data.leaderboard)
        } else {
          // Fallback if empty database
          setLeaderboardList([
            { name: user?.name || 'You', xp: userXp || 0, level: 'Active Learner', badge: '⚡ Financial Contender', avatar: '🌟', isYou: true }
          ])
        }
      })
      .catch(() => {
        setLeaderboardList([
          { name: user?.name || 'You', xp: userXp || 0, level: 'Active Learner', badge: '⚡ Financial Contender', avatar: '🌟', isYou: true }
        ])
      })
      .finally(() => setLoading(false))
  }, [user, userXp])

  // Ensure current active user is marked as isYou and included if missing
  const currentUserEmail = user?.email?.toLowerCase()?.trim()
  const currentUserName = user?.name || 'You'

  let list = leaderboardList.map(item => {
    const isYou = (currentUserEmail && item.email?.toLowerCase()?.trim() === currentUserEmail) || item.name.includes(currentUserName) || item.isYou
    return { ...item, isYou }
  })

  // If user is logged in but not in backend list yet, insert them
  if (!list.some(item => item.isYou)) {
    list.push({
      name: `${currentUserName} (You)`,
      xp: userXp || 0,
      level: 'Active Learner',
      badge: '⚡ Financial Contender',
      avatar: '🌟',
      isYou: true
    })
  }

  list.sort((a, b) => b.xp - a.xp)

  const userRankIndex = list.findIndex(item => item.isYou)
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} className="anim-fade" onClick={onClose}>
      <div style={{
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
        border: '2px solid #ea580c',
        borderRadius: 24,
        padding: '28px',
        maxWidth: 540,
        width: '100%',
        color: isLight ? '#0f172a' : '#fef3c7',
        boxShadow: isLight ? '0 10px 40px rgba(234, 88, 12, 0.15)' : '0 0 50px rgba(245, 158, 11, 0.3)',
        fontFamily: "'Space Grotesk', sans-serif"
      }} className="anim-scale" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🏆</span>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1 }}>
                CAMPUS LEADERBOARD
              </h2>
              <span style={{ fontSize: 11, color: isLight ? '#ea580c' : '#fbbf24', fontWeight: 800 }}>
                Live Synchronized User Rankings 🇮🇳
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#fbbf24', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* User Rank Card */}
        <div style={{
          background: isLight ? '#fff7ed' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
          border: '1.5px solid #ea580c',
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
              <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#7c2d12' : '#9ca3af', textTransform: 'uppercase' }}>YOUR CURRENT RANK (#{userRank})</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>{currentUserName} (You)</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24' }}>{userXp || 0} XP</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#059669' }}>Live Synchronized Rank</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: isLight ? '#475569' : '#9ca3af', fontWeight: 700 }}>
            Syncing live database rankings... 🔄
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {list.map((item, index) => {
              const isTop3 = index < 3
              const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`
              return (
                <div key={index} style={{
                  background: item.isYou ? (isLight ? '#ffedd5' : 'rgba(16, 185, 129, 0.2)') : (isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.04)'),
                  border: `1.5px solid ${item.isYou ? '#ea580c' : isTop3 ? 'rgba(234, 88, 12, 0.5)' : (isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.1)')}`,
                  borderRadius: 14,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, width: 28, textAlign: 'center', color: isTop3 ? (isLight ? '#ea580c' : '#fbbf24') : (isLight ? '#475569' : '#9ca3af') }}>
                      {rankEmoji}
                    </div>
                    <div style={{ fontSize: 22 }}>{item.avatar || '👦'}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: item.isYou ? (isLight ? '#ea580c' : '#6ee7b7') : (isLight ? '#0f172a' : '#ffffff') }}>
                        {item.name} {item.isYou ? '(You)' : ''}
                      </div>
                      <div style={{ fontSize: 10, color: isLight ? '#475569' : '#9ca3af', fontWeight: 700 }}>
                        {item.level} • <span style={{ color: isLight ? '#d97706' : '#fbbf24' }}>{item.badge}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24' }}>
                    {item.xp} XP
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button onClick={onClose} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 12, fontWeight: 900 }}>
          CLOSE LEADERBOARD 🚀
        </button>
      </div>
    </div>
  )
}
