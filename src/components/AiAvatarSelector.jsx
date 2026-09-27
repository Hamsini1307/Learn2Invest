import React from 'react'

export function CuteChibiAvatarSVG({ type = 'female', size = 56 }) {
  if (type === 'male') {
    // Cute Chibi Boy (Wavy dark-brown hair, big warm brown eyes, rosy cheeks, cream collar & knit sweater)
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="url(#boyBg)" stroke="#f59e0b" strokeWidth="3" />
        {/* Shoulders / Cute Sweater Vest */}
        <path d="M22 92C22 76 34 68 50 68C66 68 78 76 78 92" fill="#5c4033" />
        <path d="M36 68L50 82L64 68" fill="#fef3c7" />
        <path d="M46 74L50 86L54 74Z" fill="#3b82f6" />
        {/* Neck */}
        <rect x="44" y="58" width="12" height="12" rx="5" fill="#fde2c8" />
        {/* Ears */}
        <circle cx="24" cy="48" r="6" fill="#fde2c8" />
        <circle cx="76" cy="48" r="6" fill="#fde2c8" />
        {/* Face */}
        <rect x="26" y="24" width="48" height="40" rx="20" fill="#ffe6cf" />
        {/* Big Cute Chibi Eyes */}
        <ellipse cx="39" cy="45" rx="5.5" ry="6.5" fill="#291711" />
        <ellipse cx="61" cy="45" rx="5.5" ry="6.5" fill="#291711" />
        <circle cx="41" cy="42.5" r="2.2" fill="#ffffff" />
        <circle cx="63" cy="42.5" r="2.2" fill="#ffffff" />
        <circle cx="37.5" cy="47.5" r="1.1" fill="#ffffff" />
        <circle cx="59.5" cy="47.5" r="1.1" fill="#ffffff" />
        {/* Eyebrows */}
        <path d="M33 36C36 34 41 34 44 36" stroke="#3b2219" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M56 36C59 34 64 34 67 36" stroke="#3b2219" strokeWidth="2.2" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <ellipse cx="32" cy="51" rx="4.5" ry="2.5" fill="#fb7185" fillOpacity="0.55" />
        <ellipse cx="68" cy="51" rx="4.5" ry="2.5" fill="#fb7185" fillOpacity="0.55" />
        {/* Cute Smile */}
        <path d="M44 53.5C46.5 57 53.5 57 56 53.5" stroke="#9a3412" strokeWidth="2.4" strokeLinecap="round" />
        {/* Fluffy Stylized Boy Hair */}
        <path d="M23 42C21 24 34 14 50 14C66 14 79 24 77 42C73 30 65 26 57 31C52 25 43 26 37 33C31 29 26 33 23 42Z" fill="#3b2219" />
        <path d="M32 18C42 12 58 12 68 19" stroke="#6b4435" strokeWidth="2.5" strokeLinecap="round" />
        {/* Little Green Sprout Clip */}
        <path d="M62 16C64 10 70 10 70 15C70 18 65 19 62 16Z" fill="#84cc16" />
        <defs>
          <linearGradient id="boyBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dbeafe" />
            <stop offset="1" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Cute Chibi Girl matching the uploaded reference image (Wavy chestnut hair, big sparkling brown eyes, beige knit vest over cream blouse)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="url(#girlBg)" stroke="#ec4899" strokeWidth="3" />
      {/* Wavy Long Back Hair */}
      <path d="M18 46C14 62 18 82 26 90H74C82 82 86 62 82 46C78 26 65 14 50 14C35 14 22 26 18 46Z" fill="#3b2219" />
      {/* Shoulders / Cream Blouse & Beige Knit Vest */}
      <path d="M23 92C23 76 34 68 50 68C66 68 77 76 77 92" fill="#fef3c7" />
      <path d="M28 92C29 77 37 70 50 70C63 70 71 77 72 92" fill="#8c6d53" />
      <path d="M40 68L50 81L60 68" fill="#fffbeb" />
      {/* Neck */}
      <rect x="44" y="58" width="12" height="11" rx="5" fill="#fde2c8" />
      {/* Face */}
      <rect x="26" y="25" width="48" height="39" rx="19.5" fill="#ffe6cf" />
      {/* Big Cute Chibi Eyes */}
      <ellipse cx="39" cy="45" rx="5.8" ry="6.8" fill="#291711" />
      <ellipse cx="61" cy="45" rx="5.8" ry="6.8" fill="#291711" />
      <circle cx="41.2" cy="42.2" r="2.4" fill="#ffffff" />
      <circle cx="63.2" cy="42.2" r="2.4" fill="#ffffff" />
      <circle cx="37.2" cy="47.8" r="1.2" fill="#ffffff" />
      <circle cx="59.2" cy="47.8" r="1.2" fill="#ffffff" />
      {/* Eyelashes & Brows */}
      <path d="M32 40C35 37 42 37 45 40" stroke="#291711" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M55 40C58 37 65 37 68 40" stroke="#291711" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 35C37 33 41 33 44 35" stroke="#4a2c20" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 35C59 33 63 33 66 35" stroke="#4a2c20" strokeWidth="2" strokeLinecap="round" />
      {/* Rosy Cheeks */}
      <ellipse cx="31.5" cy="51" rx="5" ry="2.8" fill="#fb7185" fillOpacity="0.6" />
      <ellipse cx="68.5" cy="51" rx="5" ry="2.8" fill="#fb7185" fillOpacity="0.6" />
      {/* Happy Smile */}
      <path d="M44 53C46.5 57 53.5 57 56 53" stroke="#be123c" strokeWidth="2.4" strokeLinecap="round" />
      {/* Wavy Parted Front Hair */}
      <path d="M22 44C22 26 35 15 50 15C65 15 78 26 78 44C72 32 60 25 50 28C40 25 28 32 22 44Z" fill="#4a2c20" />
      {/* Cute Pink Flower Hairclip */}
      <circle cx="69" cy="27" r="4.5" fill="#f472b6" />
      <circle cx="69" cy="27" r="1.8" fill="#fef08a" />
      <defs>
        <linearGradient id="girlBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fce7f3" />
          <stop offset="1" stopColor="#fbcfe8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const AI_AVATARS = {
  female: {
    id: 'female',
    name: 'Luna',
    role: 'Cute Girl Campus Guide & AI Mentor',
    icon: '👧🌸',
    badge: 'CUTE GIRL CHARACTER',
    tagline: 'Warm, cheerful & encouraging investment guide from Learn2Invest School!',
    accent: '#ec4899',
    avatarImg: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LunaCute&backgroundColor=fbcfe8',
  },
  male: {
    id: 'male',
    name: 'Leo',
    role: 'Cute Boy Campus Guide & AI Buddy',
    icon: '👦✨',
    badge: 'CUTE BOY CHARACTER',
    tagline: 'Curious, friendly & smart wealth-building buddy on your campus journey!',
    accent: '#3b82f6',
    avatarImg: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LeoCute&backgroundColor=bfdbfe',
  },
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 10, 24, 0.85)',
        backdropFilter: 'blur(18px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="anim-fade"
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #1f172a 0%, #120d1d 100%)',
          border: '2px solid #f472b6',
          borderRadius: '28px',
          padding: '32px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 24px 60px rgba(236, 72, 153, 0.28)',
          color: '#fef3c7',
          position: 'relative',
        }}
        className="anim-scale"
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: '#f472b6',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(244, 114, 182, 0.18)',
              border: '1.5px solid #f472b6',
              color: '#fbcfe8',
              borderRadius: '999px',
              padding: '4px 16px',
              fontSize: '11px',
              fontWeight: 900,
              marginBottom: '8px',
            }}
          >
            🌸✨ CUTE GIRL & CUTE BOY CHARACTER SELECTOR
          </span>
          <h2 style={{ fontSize: '28px', color: '#ffffff', margin: '8px 0', fontFamily: 'Space Grotesk', fontWeight: 900 }}>
            CHOOSE YOUR CUTE CAMPUS CHARACTER
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>
            Pick Cute Girl (Luna) or Cute Boy (Leo) as your 3D School Companion & AI Guide!
          </p>
        </div>

        {/* Custom Avatar Name Input */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#fbcfe8', letterSpacing: '0.5px' }}>
              ✏️ CHARACTER NAME:
            </label>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              Active: <strong style={{ color: '#f472b6' }}>{customName.trim() || AI_AVATARS[selectedId].name}</strong>
            </span>
          </div>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="Name your character (e.g. Luna, Leo)..."
            className="input-light"
            style={{ fontSize: '15px', padding: '12px 16px', fontWeight: 700, borderRadius: '14px', width: '100%' }}
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
                  background: isSelected ? 'rgba(244, 114, 182, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? `2.5px solid ${avatar.accent}` : '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '22px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? `0 0 28px ${avatar.accent}44` : 'none',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                }}
              >
                <div style={{ marginBottom: '12px', display: 'inline-flex', justifyContent: 'center' }}>
                  <CuteChibiAvatarSVG type={avatar.id} size={74} />
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '1px',
                    fontWeight: 900,
                    color: isSelected ? avatar.accent : '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  {avatar.badge}
                </div>
                <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 4px 0', fontWeight: 900 }}>
                  {avatar.icon} {isSelected ? customName.trim() || avatar.name : avatar.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#f9a8d4', fontWeight: 700, marginBottom: '8px' }}>
                  {avatar.role}
                </p>
                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {avatar.tagline}
                </p>
                {isSelected && (
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'inline-block',
                      background: avatar.accent,
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '4px 14px',
                      borderRadius: '999px',
                    }}
                  >
                    ✓ SELECTED CHARACTER
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '15px',
            fontWeight: 900,
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
          }}
        >
          ✨ SAVE CUTE CHARACTER ({customName.trim() || AI_AVATARS[selectedId].name})
        </button>
      </div>
    </div>
  )
}
