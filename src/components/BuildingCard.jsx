// BuildingCard.jsx — Stylized Campus Building Card Component (School, Lab, Tower) Gold Obsidian Theme

export default function BuildingCard({ type = 'school', title, subtitle, locked = false, active = false, pct = 0, onClick, buttonText }) {
  const configs = {
    school: {
      levelNum: 'LEVEL 1',
      defaultTitle: 'LEVEL 1: LEARN2INVEST SCHOOL',
      defaultSubtitle: 'Videos + Quiz on Indian financial schemes',
      emoji: '🏫',
      icon: '📖',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: '#d97706',
      btnClass: 'btn-primary',
      defaultBtn: 'Enter School →',
    },
    lab: {
      levelNum: 'LEVEL 2',
      defaultTitle: 'LEVEL 2: INVESTMENT LAB',
      defaultSubtitle: 'Simulations & deeper asset strategies',
      emoji: '🧪',
      icon: '🔬',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: '#d97706',
      btnClass: 'btn-primary',
      defaultBtn: 'Continue →',
    },
    tower: {
      levelNum: 'LEVEL 3',
      defaultTitle: 'LEVEL 3: PORTFOLIO TOWER',
      defaultSubtitle: 'Portfolio mastery & advanced strategies',
      emoji: '🏢',
      icon: '₹',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: '#d97706',
      btnClass: 'btn-primary',
      defaultBtn: 'Unlock Level 3',
    }
  }

  const cfg = configs[type] || configs.school
  const displayTitle = title || cfg.defaultTitle
  const displaySubtitle = subtitle || cfg.defaultSubtitle
  const displayBtn = buttonText || (locked ? `Unlock ${cfg.levelNum}` : cfg.defaultBtn)

  return (
    <div
      className="glass-card-sm"
      onClick={onClick}
      style={{
        padding: '24px',
        minHeight: '280px',
        cursor: 'pointer',
        opacity: locked ? 0.85 : 1,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative', overflow: 'hidden',
        background: 'var(--card-bg-gradient, linear-gradient(135deg, rgba(22, 19, 14, 0.92) 0%, rgba(14, 12, 9, 0.95) 100%))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: active ? `2px solid #f59e0b` : `1px solid rgba(217, 119, 6, 0.3)`,
        boxShadow: active ? `0 16px 36px rgba(217,119,6,0.35)` : 'var(--card-shadow, 0 12px 32px rgba(0,0,0,0.4))',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      }}
      onMouseOver={e => {
        if (!locked) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.borderColor = '#f59e0b'
          e.currentTarget.style.boxShadow = `0 20px 40px rgba(217,119,6,0.35)`
        }
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = active ? '#f59e0b' : 'rgba(217, 119, 6, 0.3)'
        e.currentTarget.style.boxShadow = active ? `0 16px 36px rgba(217,119,6,0.35)` : 'var(--card-shadow, 0 12px 32px rgba(0,0,0,0.4))'
      }}
    >
      {/* Top Active Location Indicator */}
      {active && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <span className="sticker-badge sticker-yellow" style={{ fontSize: 9, padding: '2px 8px', background: '#f59e0b', color: '#080705' }}>
            ACTIVE LOCATION
          </span>
        </div>
      )}

      {/* Building Visual Box */}
      <div style={{
        height: 105,
        borderRadius: 16,
        background: 'rgba(245, 158, 11, 0.08)',
        border: `1.5px solid rgba(217,119,6,0.3)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: locked ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #d97706, #f59e0b)',
          color: locked ? '#94a3b8' : '#080705',
          border: '1.5px solid #d97706',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800,
          boxShadow: locked ? 'none' : '0 0 12px rgba(245,158,11,0.3)',
          marginBottom: 4,
        }}>
          {locked ? '🔒' : cfg.icon}
        </div>

        <div style={{ fontSize: 28, filter: locked ? 'grayscale(1)' : 'none' }}>
          {cfg.emoji}
        </div>
      </div>

      {/* Title & Description */}
      <div style={{ marginBottom: 14 }}>
        <h3 className="font-display" style={{ fontSize: 22, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
          {displayTitle}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', fontWeight: 600, lineHeight: 1.4 }}>
          {displaySubtitle}
        </p>
      </div>

      {/* Progress & Action Button */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted, #94a3b8)', fontWeight: 800, textTransform: 'uppercase' }}>PROGRESS</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: locked ? '#64748b' : '#f59e0b' }}>{pct}%</span>
          </div>
          <div className="progress-track" style={{ background: 'var(--input-bg, rgba(255,255,255,0.1))', border: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}>
            <div className="progress-fill" style={{
              width: `${pct}%`,
              background: locked ? '#64748b' : 'linear-gradient(90deg, #d97706, #f59e0b)',
            }} />
          </div>
        </div>

        {!locked ? (
          <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 13 }}>
            {displayBtn}
          </button>
        ) : (
          <div style={{
            fontSize: 11, color: '#94a3b8', fontWeight: 800,
            textAlign: 'center', padding: '10px',
            background: 'rgba(255,255,255,0.05)', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            textTransform: 'uppercase',
          }}>
            🔒 {displayBtn}
          </div>
        )}
      </div>
    </div>
  )
}
