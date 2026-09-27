export default function VideoPlayer({ go, state, update, addXP }) {
  const v = state.currentVideo
  if (!v) { go('beginner'); return null }

  const alreadyWatched = state.lessonsWatched.includes(v.id)

  const handleComplete = () => {
    if (!alreadyWatched) {
      update({ lessonsWatched: [...state.lessonsWatched, v.id] })
      addXP(30)
    }
    go('beginner')
  }

  return (
    <div className="content-area">
      <button className="btn-outline" onClick={() => go('beginner')} style={{ marginBottom: 20 }}>
        ⬅ Back
      </button>

      {/* Video card */}
      <div className="glass-card anim-scale" style={{ padding: '32px', marginBottom: 24 }}>
        {/* Thumbnail / player area */}
        <div style={{
          width: '100%', paddingBottom: '52%', position: 'relative',
          borderRadius: 18, overflow: 'hidden', marginBottom: 24,
          background: v.bg, border: '2px solid rgba(255,255,255,0.8)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 64, animation: 'floatY 3s ease-in-out infinite' }}>{v.emoji}</div>
            <div style={{
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
              borderRadius: 14, padding: '12px 24px', textAlign: 'center',
              border: '1.5px solid rgba(255,255,255,0.9)',
            }}>
              <div style={{ fontWeight: 900, color: '#1e1b4b', fontSize: 16, marginBottom: 4 }}>
                📹 {v.title}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>
                Duration: {v.duration} • Add your video file to <code style={{ background: 'rgba(0,0,0,0.07)', padding: '1px 6px', borderRadius: 4 }}>{v.localPath}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: "'Times New Roman',Times,serif", fontSize: 22, fontWeight: 900, color: '#1e1b4b', marginBottom: 6 }}>
          {v.emoji} {v.title}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          {v.subtitle}
        </p>

        {/* Key points */}
        <div style={{
          background: 'rgba(255,255,255,0.6)', borderRadius: 16,
          padding: '22px', border: '1.5px solid rgba(255,255,255,0.9)',
          marginBottom: 24,
        }}>
          <h3 style={{ fontWeight: 900, color: '#1e1b4b', fontSize: 15, marginBottom: 14 }}>
            📌 Key Learning Points
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {v.points.map((pt, i) => (
              <div key={i} className={`anim-fade delay-${i+1}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#10b981,#3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 900,
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 600, lineHeight: 1.6 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP reward */}
        {!alreadyWatched && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.1))',
            border: '1.5px solid rgba(245,158,11,0.3)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          }}>
            <span style={{ fontSize: 22 }}>🎁</span>
            <span style={{ fontWeight: 800, color: '#92400e', fontSize: 13 }}>
              Complete this lesson to earn +30 XP!
            </span>
          </div>
        )}

        {alreadyWatched && (
          <div style={{
            background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(59,130,246,0.08))',
            border: '1.5px solid rgba(16,185,129,0.3)',
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <span style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>
              Already completed! +30 XP was earned.
            </span>
          </div>
        )}

        <button
          className={alreadyWatched ? 'btn-outline' : 'btn-green'}
          onClick={handleComplete}
          style={{ width: '100%', fontSize: 15 }}
        >
          {alreadyWatched ? '← Back to Videos' : '✅ Mark as Watched & Earn XP'}
        </button>
      </div>
    </div>
  )
}
