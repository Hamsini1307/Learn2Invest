import { useEffect } from 'react'

export const THEME_CATALOG = [
  {
    id: 'classic',
    name: 'Classic Obsidian & Gold',
    desc: 'Deep obsidian nights paired with radiant gold and warm amber.',
    minXp: 0,
    icon: '🪙',
    darkSwatches: ['#080705', '#12100c', '#f59e0b', '#fbbf24'],
    lightSwatches: ['#f8fafc', '#ffffff', '#b45309', '#d97706'],
  },
  {
    id: 'emerald',
    name: 'Emerald Forest & Sage',
    desc: 'Soothing pine emerald with tranquil morning sage and fresh mint.',
    minXp: 300,
    icon: '🌲',
    darkSwatches: ['#051410', '#081e19', '#10b981', '#34d399'],
    lightSwatches: ['#f2f8f5', '#ffffff', '#059669', '#10b981'],
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst & Lavender',
    desc: 'Twilight velvet obsidian with soft lavender and calm wisteria.',
    minXp: 600,
    icon: '🔮',
    darkSwatches: ['#0c0a17', '#16122b', '#8b5cf6', '#a78bfa'],
    lightSwatches: ['#f7f6fc', '#ffffff', '#7c3aed', '#8b5cf6'],
  },
  {
    id: 'oceanic',
    name: 'Oceanic Deep & Aqua Pearl',
    desc: 'Deep marine navy blues accented with arctic pearl and calm cyan.',
    minXp: 900,
    icon: '🌊',
    darkSwatches: ['#06101c', '#0c2038', '#0ea5e9', '#38bdf8'],
    lightSwatches: ['#f0f7fb', '#ffffff', '#0284c7', '#0ea5e9'],
  },
  {
    id: 'sunset',
    name: 'Sunset Amber & Warm Sand',
    desc: 'Warm terracotta basalt stone with gentle golden hour desert hues.',
    minXp: 1200,
    icon: '🌅',
    darkSwatches: ['#140d0a', '#251610', '#ea580c', '#f97316'],
    lightSwatches: ['#faf5f0', '#ffffff', '#c2410c', '#ea580c'],
  },
  {
    id: 'rose',
    name: 'Midnight Mauve & Rose Quartz',
    desc: 'Sophisticated dusky plum obsidian with soft blushing rose quartz.',
    minXp: 1500,
    icon: '🌸',
    darkSwatches: ['#140a11', '#261121', '#f43f5e', '#fb7185'],
    lightSwatches: ['#fcf4f6', '#ffffff', '#e11d48', '#f43f5e'],
  },
]

export default function ThemeVaultModal({
  isOpen,
  onClose,
  currentTheme = 'classic',
  onSelectTheme,
  xp = 0,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(8, 7, 5, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-deep anim-scale"
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 24,
          background: 'var(--bg-card, rgba(18, 16, 12, 0.98))',
          border: '2px solid var(--border-subtle, rgba(217, 119, 6, 0.4))',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card-deep, #12100c)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'var(--gold-bg, rgba(245, 158, 11, 0.15))',
                border: '1.5px solid var(--gold-primary, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              🎨
            </div>
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: 'var(--heading-color, #ffffff)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                THEME VAULT
                <span
                  style={{
                    fontSize: 11,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid #f59e0b',
                    borderRadius: 999,
                    padding: '2px 8px',
                    fontWeight: 800,
                  }}
                >
                  ⭐ {xp} XP
                </span>
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted, #94a3b8)',
                  margin: '2px 0 0',
                }}
              >
                Unlock beautiful new color themes at every +300 XP milestone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: 22,
              cursor: 'pointer',
              padding: 6,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Themes List */}
        <div
          style={{
            padding: 24,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {THEME_CATALOG.map((thm) => {
            const isUnlocked = xp >= thm.minXp
            const isActive = currentTheme === thm.id

            return (
              <div
                key={thm.id}
                style={{
                  borderRadius: 18,
                  border: isActive
                    ? '2px solid var(--gold-primary, #f59e0b)'
                    : '1.5px solid var(--border-light, rgba(255, 255, 255, 0.1))',
                  background: isActive
                    ? 'var(--gold-bg, rgba(245, 158, 11, 0.1))'
                    : 'var(--bg-card-deep, rgba(255, 255, 255, 0.03))',
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  transition: 'all 0.2s ease',
                  opacity: isUnlocked ? 1 : 0.65,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: 'var(--bg-main, #080705)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                      border: '1.5px solid var(--border-light, rgba(255,255,255,0.1))',
                    }}
                  >
                    {thm.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: 15,
                          color: 'var(--heading-color, #ffffff)',
                        }}
                      >
                        {thm.name}
                      </span>
                      {thm.minXp > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: isUnlocked
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                            color: isUnlocked ? '#10b981' : '#f87171',
                            border: `1px solid ${isUnlocked ? '#10b981' : '#f87171'}`,
                          }}
                        >
                          {isUnlocked ? 'UNLOCKED' : `🔒 ${thm.minXp} XP`}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted, #94a3b8)',
                        marginTop: 4,
                        lineHeight: 1.4,
                      }}
                    >
                      {thm.desc}
                    </div>

                    {/* Color Swatch Previews */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', marginRight: 3, fontWeight: 700 }}>DARK:</span>
                        {thm.darkSwatches.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              background: c,
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 6 }}>
                        <span style={{ fontSize: 9, color: 'var(--text-muted, #94a3b8)', marginRight: 3, fontWeight: 700 }}>LIGHT:</span>
                        {thm.lightSwatches.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              background: c,
                              border: '1px solid rgba(0,0,0,0.15)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isActive ? (
                    <div
                      style={{
                        background: 'var(--emerald-bg, rgba(16, 185, 129, 0.15))',
                        border: '1.5px solid var(--emerald-main, #10b981)',
                        color: 'var(--emerald-main, #10b981)',
                        padding: '6px 14px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>✓</span> ACTIVE
                    </div>
                  ) : (
                    <button
                      disabled={!isUnlocked}
                      onClick={() => isUnlocked && onSelectTheme(thm.id)}
                      className={isUnlocked ? "btn-primary" : "btn-outline"}
                      style={{
                        padding: '8px 16px',
                        fontSize: 12,
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        borderRadius: 999,
                        opacity: isUnlocked ? 1 : 0.5,
                      }}
                    >
                      {isUnlocked ? 'SELECT' : `🔒 ${thm.minXp} XP NEEDED`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
