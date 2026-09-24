import React from 'react'

export const AI_AVATARS = {
  female: {
    id: 'female',
    name: 'Luna',
    role: 'Senior Financial Strategist & Mentor',
    icon: '👩‍💼',
    badge: 'LUXURY AI GUIDE',
    tagline: 'Analytical, encouraging & precision-focused guidance.',
    accent: '#f59e0b',
    avatarImg: 'https://api.dicebear.com/7.x/bottts/svg?seed=LunaGold&backgroundColor=f59e0b'
  },
  male: {
    id: 'male',
    name: 'Leo',
    role: 'Portfolio Architect & Risk Specialist',
    icon: '👨‍💼',
    badge: 'TACTICAL AI MENTOR',
    tagline: 'Strategic, direct & wealth-building insights.',
    accent: '#d97706',
    avatarImg: 'https://api.dicebear.com/7.x/bottts/svg?seed=LeoGold&backgroundColor=d97706'
  }
}

export default function AiAvatarSelector({ currentAvatar = 'female', currentName, onSelect, isOpen, onClose }) {
  if (!isOpen) return null

  const [selectedId, setSelectedId] = React.useState(currentAvatar)
  const [customName, setCustomName] = React.useState(currentName || AI_AVATARS[currentAvatar]?.name || 'Luna')

  React.useEffect(() => {
    setSelectedId(currentAvatar)
    setCustomName(currentName || AI_AVATARS[currentAvatar]?.name || 'Luna')
  }, [currentAvatar, currentName, isOpen])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectAvatar = (avatarId) => {
    setSelectedId(avatarId)
    // If the name is currently one of the default names or empty, update to the new avatar's default
    if (!customName || customName === AI_AVATARS.female.name || customName === AI_AVATARS.male.name) {
      setCustomName(AI_AVATARS[avatarId].name)
    }
  }

  const handleConfirm = () => {
    const finalName = customName.trim() || AI_AVATARS[selectedId].name
    onSelect(selectedId, finalName)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(8, 7, 5, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="anim-fade">
      <div style={{
        background: 'var(--card-bg-gradient, linear-gradient(145deg, #12100c 0%, #1a1610 100%))',
        border: '2px solid #d97706',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '580px',
        width: '100%',
        boxShadow: 'var(--card-shadow, 0 0 40px rgba(217, 119, 6, 0.3))',
        color: 'var(--text-main, #fef3c7)',
        position: 'relative'
      }} className="anim-scale">
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: '#fbbf24',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="sticker-badge sticker-yellow" style={{ marginBottom: '8px' }}>
            ✨ CHOOSE & NAME YOUR AI GUIDE
          </span>
          <h2 style={{ fontSize: '28px', color: 'var(--heading-color, #fff)', margin: '8px 0', fontFamily: 'Space Grotesk' }}>
            CUSTOMIZE YOUR AI MENTOR
          </h2>
          <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: '14px' }}>
            Select an avatar personality and assign a custom name to your AI Guide.
          </p>
        </div>

        {/* Custom Avatar Name Input */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.5px' }}>
              ✏️ ENTER AI GUIDE NAME:
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #9ca3af)', fontWeight: 600 }}>
              Preview: <strong style={{ color: '#fbbf24' }}>{customName.trim() || AI_AVATARS[selectedId].name}</strong>
            </span>
          </div>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="Name your guide (e.g. Luna, Leo, Alex, Sophia)..."
            className="input-light"
            style={{ fontSize: '15px', padding: '12px 16px', fontWeight: 700, borderRadius: '12px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {Object.values(AI_AVATARS).map((avatar) => {
            const isSelected = selectedId === avatar.id
            return (
              <div
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar.id)}
                style={{
                  background: isSelected
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'var(--input-bg, rgba(255, 255, 255, 0.03))',
                  border: isSelected ? '2px solid #f59e0b' : '1.5px solid rgba(217, 119, 6, 0.2)',
                  borderRadius: '18px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? '0 0 25px rgba(245, 158, 11, 0.25)' : 'none',
                  transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '12px',
                  display: 'inline-block',
                  filter: isSelected ? 'drop-shadow(0 0 10px #f59e0b)' : 'none'
                }}>
                  {avatar.icon}
                </div>
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '1px',
                  fontWeight: 800,
                  color: isSelected ? '#fbbf24' : 'var(--text-muted, #9ca3af)',
                  marginBottom: '4px'
                }}>
                  {avatar.badge}
                </div>
                <h3 style={{ fontSize: '20px', color: 'var(--heading-color, #fff)', margin: '0 0 4px 0' }}>
                  {isSelected ? (customName.trim() || avatar.name) : avatar.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, marginBottom: '8px' }}>
                  {avatar.role}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted, #9ca3af)', lineHeight: 1.4 }}>
                  {avatar.tagline}
                </p>
                {isSelected && (
                  <div style={{
                    marginTop: '12px',
                    display: 'inline-block',
                    background: '#f59e0b',
                    color: '#080705',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '999px'
                  }}>
                    ✓ ACTIVE GUIDE
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={handleConfirm}
          className="btn-primary"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            color: '#080705',
            fontSize: '15px',
            padding: '14px',
            border: 'none',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}
        >
          CONFIRM AI GUIDE →
        </button>
      </div>
    </div>
  )
}
