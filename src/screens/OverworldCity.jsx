// OverworldCity.jsx — RPG Character Walkthrough City Map with learn2-invest overworld background image
import { useState, useEffect, useCallback, useMemo } from 'react'

const PLACES = [
  { id: 'school', name: 'Learn2Invest School 🏫', hint: 'Level 1 · Classrooms & Projector Lessons', x: 23, y: 30, screen: 'beginner', locked: () => false, lockHint: '' },
  { id: 'quiz', name: 'Quiz Hall 🎯', hint: 'Knowledge Checkpoint', x: 44, y: 58, screen: 'quiz', locked: () => false, lockHint: '' },
  { id: 'intermediate', name: 'Investment Lab 🧪', hint: 'Level 2 · FD, SIP & Stock Simulators', x: 69, y: 37, screen: 'intermediate', locked: () => false, lockHint: '' },
  { id: 'advanced', name: 'Portfolio Tower 🏢', hint: 'Level 3 · Financial Headquarters', x: 79, y: 73, screen: 'advanced', locked: () => false, lockHint: '' },
]

export default function OverworldCity({ go, state }) {
  const [player, setPlayer] = useState({ x: 50, y: 79 })
  const [facing, setFacing] = useState('right')
  const [nearby, setNearby] = useState(null)
  const [walking, setWalking] = useState(false)

  const move = useCallback((dx, dy) => {
    setPlayer((current) => {
      const next = { x: Math.max(7, Math.min(93, current.x + dx)), y: Math.max(16, Math.min(90, current.y + dy)) }
      if (dx) setFacing(dx < 0 ? 'left' : 'right')
      setWalking(true)
      window.setTimeout(() => setWalking(false), 180)
      return next
    })
  }, [])

  useEffect(() => {
    const handler = (event) => {
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) move(-3.5, 0)
      if (['ArrowRight', 'd', 'D'].includes(event.key)) move(3.5, 0)
      if (['ArrowUp', 'w', 'W'].includes(event.key)) move(0, -3.5)
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') move(0, 3.5)
      if (event.key === 'Enter' && nearby?.screen && !nearby.locked(state)) go(nearby.screen)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, move, nearby, state])

  const closest = useMemo(() => PLACES.reduce((best, place) => {
    const distance = Math.hypot(place.x - player.x, place.y - player.y)
    return distance < best.distance ? { place, distance } : best
  }, { place: null, distance: Number.POSITIVE_INFINITY }), [player])

  useEffect(() => {
    setNearby(closest.distance < 14 ? closest.place : null)
  }, [closest])

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header Banner */}
      <div className="glass-card anim-fade" style={{ padding: '24px 28px', marginBottom: 20, border: '1.5px solid rgba(217, 119, 6, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="sticker-badge sticker-cyan" style={{ marginBottom: 6 }}>
              2D RPG OVERWORLD MAP 🏙️
            </div>
            <h1 style={{ fontSize: 30, color: '#ffffff', margin: 0 }}>
              CAMPUS CITY WALKTHROUGH
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, margin: '4px 0 0' }}>
              Walk your character using <strong style={{ color: '#38bdf8' }}>WASD / Arrow Keys</strong>. Approach a location and press <strong style={{ color: '#10b981' }}>Enter</strong>!
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-gigi-outline" onClick={() => go('level-map')} style={{ fontSize: 12, padding: '8px 16px' }}>
              🗺️ 3D MAP VIEW
            </button>
            <div className="sticker-badge sticker-yellow">⭐ {state.xp} XP</div>
          </div>
        </div>
      </div>

      {/* Interactive Cinematic Overworld Image Map */}
      <div className="glass-card-deep" style={{
        position: 'relative', height: '64vh', minHeight: 450,
        borderRadius: 24, overflow: 'hidden',
        border: '2.5px solid rgba(217, 119, 6, 0.3)',
        backgroundImage: "url('/scenes/overworld.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8, 7, 5, 0.45)', pointerEvents: 'none' }} />

        {/* Building Locations */}
        {PLACES.map((place) => {
          const locked = place.locked(state)
          const isNear = nearby?.id === place.id
          return (
            <div key={place.id} style={{
              position: 'absolute', left: `${place.x}%`, top: `${place.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}>
              <div style={{
                position: 'relative', textAlign: 'center',
                transform: isNear ? 'scale(1.12)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}>
                <div style={{
                  background: 'rgba(18, 16, 12, 0.92)',
                  border: isNear ? '3px solid #f59e0b' : locked ? '2px solid #64748b' : '2px solid #10b981',
                  borderRadius: 14, padding: '8px 14px',
                  boxShadow: isNear ? '0 12px 28px rgba(0,0,0,0.6), 0 0 16px rgba(245,158,11,0.4)' : '0 6px 16px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: locked ? '#f43f5e' : '#38bdf8', textTransform: 'uppercase' }}>
                    {locked ? '🔒 Locked' : place.hint}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Animated Character Avatar */}
        <div style={{
          position: 'absolute', left: `${player.x}%`, top: `${player.y}%`,
          transform: `translate(-50%, -50%) ${facing === 'left' ? 'scaleX(-1)' : ''}`,
          transition: 'left 0.15s ease, top 0.15s ease',
          zIndex: 20,
        }}>
          <div style={{
            width: 38, height: 46, borderRadius: '50% 50% 40% 40%',
            background: 'linear-gradient(180deg, #10b981, #0284c7)',
            border: '2.5px solid #d97706',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 8px 16px rgba(0,0,0,0.6)',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffffff', border: '1.5px solid #d97706' }} />
          </div>
        </div>

        {/* Nearby Interactive Entrance Modal */}
        {nearby && (
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 30, width: '90%', maxWidth: 420,
            background: 'rgba(18, 16, 12, 0.95)', border: '2px solid #f59e0b',
            borderRadius: 20, padding: '16px 20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(245,158,11,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>{nearby.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>
                  {nearby.locked(state) ? nearby.lockHint : 'Press Enter or click to step inside!'}
                </div>
              </div>
              {nearby.locked(state) ? (
                <span className="sticker-badge sticker-pink text-[10px]">🔒 LOCKED</span>
              ) : (
                <button className="btn-gigi-lime" onClick={() => go(nearby.screen)} style={{ fontSize: 13, padding: '10px 20px' }}>
                  ENTER →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Touch D-Pad for Mobile */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 30,
          display: 'grid', gridTemplateColumns: 'repeat(3, 38px)', gap: 4,
        }}>
          <span />
          <button onClick={() => move(0, -4)} className="btn-gigi-outline" style={{ padding: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, background: '#ffffff' }}>↑</button>
          <span />
          <button onClick={() => move(-4, 0)} className="btn-gigi-outline" style={{ padding: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, background: '#ffffff' }}>←</button>
          <button onClick={() => move(0, 4)} className="btn-gigi-outline" style={{ padding: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, background: '#ffffff' }}>↓</button>
          <button onClick={() => move(4, 0)} className="btn-gigi-outline" style={{ padding: 0, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, background: '#ffffff' }}>→</button>
        </div>
      </div>
    </div>
  )
}
