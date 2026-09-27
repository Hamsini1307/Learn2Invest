import { useState, useEffect } from 'react'
import { apiRequest } from '../api.js'

export default function AdminPanel({ go }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiRequest('/api/admin/users', 'GET')
      setUsers(data)
      setError('')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load user records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to permanently delete user: ${email}? This will delete all of their progress.`)) {
      return
    }

    try {
      const res = await apiRequest(`/api/admin/users/${email}`, 'DELETE')
      alert(res.message || 'User deleted.')
      fetchUsers()
    } catch (err) {
      alert(err.message || 'Could not delete user.')
    }
  }

  const totalUsers = users.length
  const totalXP = users.reduce((acc, u) => acc + u.xp, 0)
  
  const quizScores = users.filter(u => u.quizScore > 0)
  const avgQuiz = quizScores.length > 0 
    ? Math.round(quizScores.reduce((acc, u) => acc + u.quizScore, 0) / quizScores.length)
    : 0

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header */}
      <div className="glass-card anim-fade" style={{
        padding: '24px 32px', marginBottom: 24,
        border: '2px solid var(--gigi-lime)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: 'var(--gigi-lime)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 6px 16px rgba(204,255,0,0.3)',
            border: '2px solid #000',
          }}>🛡️</div>
          <div>
            <div className="sticker-badge sticker-lime" style={{ marginBottom: 4 }}>
              ADMIN CONTROL PANEL
            </div>
            <h1 className="font-display" style={{ fontSize: 28, color: '#ffffff', margin: 0 }}>
              USER DATABASE & MONITORING
            </h1>
            <p style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 600, margin: '4px 0 0' }}>
              Monitor user registrations, learning progress, and platform activity.
            </p>
          </div>
          <button className="btn-gigi-outline" onClick={() => go('level-map')} style={{ marginLeft: 'auto' }}>
            ← MAP VIEW
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-card" style={{ padding: 24, border: '2px solid #ff007f', background: 'rgba(255,0,127,0.1)', color: '#ff007f', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <h3 style={{ margin: 0, fontWeight: 900 }}>ACCESS DENIED / ERROR</h3>
          <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: 14 }}>{error}</p>
        </div>
      ) : loading ? (
        <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: '#a1a1aa' }}>
          <div style={{ fontSize: 40, marginBottom: 12, animation: 'floatY 1s ease-in-out infinite' }}>⚡</div>
          <p style={{ fontWeight: 800, margin: 0 }}>LOADING DATABASE USER DETAILS...</p>
        </div>
      ) : (
        <div className="anim-fade">
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'TOTAL USERS REGISTERED', value: totalUsers, icon: '👥', color: '#00f0ff' },
              { label: 'CUMULATIVE PLATFORM XP', value: totalXP.toLocaleString(), icon: '⭐', color: '#ffd700' },
              { label: 'AVG QUIZ SCORE', value: `${avgQuiz}%`, icon: '📝', color: '#ccff00' },
            ].map(card => (
              <div key={card.label} className="glass-card-sm" style={{ padding: '20px 22px', borderLeft: `5px solid ${card.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.5px' }}>{card.label}</span>
                  <span style={{ fontSize: 20 }}>{card.icon}</span>
                </div>
                <div className="font-display" style={{ fontSize: 32, color: '#ffffff', lineHeight: 1 }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* User Table Card */}
          <div className="glass-card-deep" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 className="font-display" style={{ fontSize: 22, color: '#ffffff', margin: 0 }}>
                REGISTERED USERS ({filteredUsers.length} SHOWN)
              </h2>
              
              <input
                type="text"
                placeholder="🔍 Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-light"
                style={{ width: 260, padding: '8px 14px', fontSize: 13 }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>NAME</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>EMAIL</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>START LEVEL</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>TOTAL XP</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>VIDEOS WATCHED</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>SIMS PASSED</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900 }}>QUIZ SCORE</th>
                    <th style={{ padding: '12px 10px', fontSize: 11, color: '#a1a1aa', fontWeight: 900, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '30px 10px', textAlign: 'center', color: '#71717a', fontWeight: 700 }}>
                        No users match search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => (
                      <tr key={u.email} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}>
                        <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 900, color: '#ffffff' }}>{u.name}</td>
                        <td style={{ padding: '14px 10px', fontSize: 13, color: '#00f0ff', fontWeight: 800 }}>{u.email}</td>
                        <td style={{ padding: '14px 10px', fontSize: 12, fontWeight: 800 }}>
                          <span className={u.startLevel === 'intermediate' ? "sticker-badge sticker-cyan" : "sticker-badge sticker-lime"} style={{ fontSize: 9, padding: '2px 6px' }}>
                            {u.startLevel.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 900, color: '#ffd700' }}>⭐ {u.xp}</td>
                        <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 700, color: '#a1a1aa' }}>
                          🎬 {u.lessonsWatched.length}/5
                        </td>
                        <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 700, color: '#a1a1aa' }}>
                          📈 {u.completedModules.length}/6
                        </td>
                        <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 900, color: u.quizScore >= 60 ? '#ccff00' : u.quizScore > 0 ? '#ffd700' : '#71717a' }}>
                          {u.quizScore > 0 ? `${u.quizScore}%` : 'N/A'}
                        </td>
                        <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDelete(u.email)}
                            style={{
                              padding: '6px 12px', borderRadius: 999, border: 'none',
                              background: '#ff007f', color: '#ffffff', fontSize: 11,
                              fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s',
                              fontFamily: 'inherit',
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'none' }}
                          >
                            🗑️ DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
