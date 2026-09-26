import React from 'react'
import { AI_AVATARS } from './AiAvatarSelector.jsx'

export default function Navbar({
  user,
  xp,
  currentScreen,
  onChatToggle,
  go,
  goBack,
  canGoBack,
  aiGuideAvatar = 'female',
  aiGuideName,
  openAvatarModal,
  themeMode = 'dark',
  openLeaderboard,
  openBadges,
  openReport,
  openProfile,
  lang = 'en',
  setLang,
  parentChildMode = false,
  toggleParentChildMode,
  state,
}) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const [showHelpModal, setShowHelpModal] = React.useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
  const [showAccountMenu, setShowAccountMenu] = React.useState(false)

  const handleLogout = () => {
    localStorage.removeItem('l2i_isLoggedIn')
    localStorage.removeItem('l2i_currentUser')
    localStorage.removeItem('l2i_token')
    window.location.reload()
  }

  const navItems = [
    { label: 'Journey', icon: '✨', screen: 'landing' },
    { label: 'Campus', icon: '🗺️', screen: 'level-map' },
  ]

  return (
    <>
      {/* ─── FULL VIEWPORT TOP GAME HUD ─── */}
      <header style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        width: '100%',
        background: 'var(--nav-bg, rgba(12, 10, 8, 0.95))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(217, 119, 6, 0.35)',
        padding: '10px 24px',
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: 'var(--card-shadow, 0 8px 30px rgba(0,0,0,0.7))'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          {/* Brand Logo & Back Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {canGoBack && (
              <button
                onClick={goBack}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  border: '1.5px solid #fbbf24',
                  color: '#080705',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
                title="Go Back to Previous Page"
              >
                <span style={{ fontSize: 14 }}>⬅</span>
                <span>BACK</span>
              </button>
            )}

            <div onClick={() => go('landing')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #10b981, #0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#ffffff',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
                border: '1.5px solid #6ee7b7',
                fontWeight: 900
              }}>📖</div>
              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900, fontSize: 20, letterSpacing: '0.5px',
                  color: 'var(--heading-color, #ffffff)', lineHeight: 1, display: 'flex', alignItems: 'center', gap: 4
                }}>
                  LEARN<span style={{ color: '#10b981' }}>2</span>INVEST
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted, #94a3b8)', marginTop: 2 }}>
                  Your Journey to Financial Freedom
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => go('landing')}
              style={{
                background: currentScreen === 'landing' 
                  ? 'var(--gold-bg, rgba(245, 158, 11, 0.25))' 
                  : (themeMode === 'light' ? '#fff7ed' : 'rgba(255, 255, 255, 0.08)'),
                border: `1.5px solid ${currentScreen === 'landing' ? '#ea580c' : (themeMode === 'light' ? '#c2410c' : 'rgba(255, 255, 255, 0.2)')}`,
                color: currentScreen === 'landing' ? '#ea580c' : (themeMode === 'light' ? '#431407' : '#ffffff'),
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s',
                boxShadow: themeMode === 'light' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span>✨</span>
              <span>Journey</span>
            </button>

            <button
              onClick={() => go('dashboard')}
              style={{
                background: currentScreen === 'dashboard' 
                  ? 'var(--gold-bg, rgba(245, 158, 11, 0.25))' 
                  : (themeMode === 'light' ? '#fff7ed' : 'rgba(255, 255, 255, 0.08)'),
                border: `1.5px solid ${currentScreen === 'dashboard' ? '#ea580c' : (themeMode === 'light' ? '#c2410c' : 'rgba(255, 255, 255, 0.2)')}`,
                color: currentScreen === 'dashboard' ? '#ea580c' : (themeMode === 'light' ? '#431407' : '#ffffff'),
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s',
                boxShadow: themeMode === 'light' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => go('level-map')}
              style={{
                background: currentScreen === 'level-map' 
                  ? 'var(--gold-bg, rgba(245, 158, 11, 0.25))' 
                  : (themeMode === 'light' ? '#fff7ed' : 'rgba(255, 255, 255, 0.08)'),
                border: `1.5px solid ${currentScreen === 'level-map' ? '#ea580c' : (themeMode === 'light' ? '#c2410c' : 'rgba(255, 255, 255, 0.2)')}`,
                color: currentScreen === 'level-map' ? '#ea580c' : (themeMode === 'light' ? '#431407' : '#ffffff'),
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s',
                boxShadow: themeMode === 'light' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span>🗺️</span>
              <span>Campus Map</span>
            </button>

            {state?.intermediateUnlocked && (
              <button
                onClick={() => go('saved-simulations')}
                style={{
                  background: currentScreen === 'saved-simulations' 
                    ? 'var(--gold-bg, rgba(245, 158, 11, 0.25))' 
                    : (themeMode === 'light' ? '#fff7ed' : 'rgba(255, 255, 255, 0.08)'),
                  border: `1.5px solid ${currentScreen === 'saved-simulations' ? '#ea580c' : (themeMode === 'light' ? '#c2410c' : 'rgba(255, 255, 255, 0.2)')}`,
                  color: currentScreen === 'saved-simulations' ? '#ea580c' : (themeMode === 'light' ? '#431407' : '#ffffff'),
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s',
                  boxShadow: themeMode === 'light' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <span>📁</span>
                <span>Saved Sims</span>
              </button>
            )}
          </div>

          {/* Center-Right: Ask AI & Theme Toggle Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={onChatToggle}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                border: '1.5px solid #38bdf8',
                borderRadius: 999, padding: '6px 16px',
                fontSize: 12, fontWeight: 900, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 16px rgba(2, 132, 199, 0.4)',
                transition: 'transform 0.2s'
              }}
            >
              <span>{activeAvatar.icon}</span>
              <span>Ask {guideName}</span>
              <span>→</span>
            </button>

            {openLeaderboard && (
              <button
                onClick={openLeaderboard}
                style={{
                  background: themeMode === 'light' ? '#ffedd5' : 'rgba(245, 158, 11, 0.15)',
                  border: `1.5px solid ${themeMode === 'light' ? '#c2410c' : '#f59e0b'}`,
                  color: themeMode === 'light' ? '#7c2d12' : '#fbbf24',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: themeMode === 'light' ? '0 2px 8px rgba(234, 88, 12, 0.15)' : 'none'
                }}
                title="View Campus Leaderboard"
              >
                <span>🏆</span>
                <span>RANKS</span>
              </button>
            )}

            {openBadges && (
              <button
                onClick={openBadges}
                style={{
                  background: themeMode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
                  border: `1.5px solid ${themeMode === 'light' ? '#059669' : '#10b981'}`,
                  color: themeMode === 'light' ? '#064e3b' : '#6ee7b7',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: themeMode === 'light' ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                }}
                title="View Achievements & Badges"
              >
                <span>🎖️</span>
                <span>BADGES</span>
              </button>
            )}

            {openReport && (
              <button
                onClick={openReport}
                style={{
                  background: themeMode === 'light' ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)',
                  border: `1.5px solid ${themeMode === 'light' ? '#0284c7' : '#38bdf8'}`,
                  color: themeMode === 'light' ? '#075985' : '#a5f3fc',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: themeMode === 'light' ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none'
                }}
                title="View Performance Report"
              >
                <span>📊</span>
                <span>REPORT</span>
              </button>
            )}

            {setLang && (
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                style={{
                  background: themeMode === 'light' ? '#ffffff' : '#0f172a',
                  border: '2px solid #ea580c',
                  color: themeMode === 'light' ? '#9a3412' : '#fbbf24',
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: themeMode === 'light' ? '0 2px 8px rgba(234, 88, 12, 0.12)' : '0 4px 14px rgba(0,0,0,0.25)',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
                title="Select Language (English or Kannada)"
              >
                <option value="en" style={{ background: themeMode === 'light' ? '#ffffff' : '#0f172a', color: themeMode === 'light' ? '#0f172a' : '#ffffff', fontSize: '13px', fontWeight: 'bold', padding: '10px' }}>🇬🇧 English</option>
                <option value="kn" style={{ background: themeMode === 'light' ? '#ffffff' : '#0f172a', color: themeMode === 'light' ? '#0f172a' : '#ffffff', fontSize: '13px', fontWeight: 'bold', padding: '10px' }}>🌾 ಕನ್ನಡ (Kannada)</option>
              </select>
            )}


          </div>

          {/* Right Game Stats HUD Bar: XP, Corner User Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* XP Pill */}
            <div style={{
              background: themeMode === 'light' ? '#fff7ed' : 'var(--gold-bg, rgba(245, 158, 11, 0.15))',
              border: `1.5px solid ${themeMode === 'light' ? '#ea580c' : '#f59e0b'}`,
              borderRadius: '999px',
              padding: '4px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              color: themeMode === 'light' ? '#9a3412' : '#fbbf24', fontSize: 13, fontWeight: 900,
              boxShadow: themeMode === 'light' ? '0 2px 8px rgba(234, 88, 12, 0.12)' : 'none'
            }}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <div>
                <span style={{ fontSize: 9, color: themeMode === 'light' ? '#9a3412' : 'var(--text-muted, #94a3b8)', display: 'block', lineHeight: 1, fontWeight: 800 }}>XP POINTS</span>
                <span>{xp !== undefined && xp !== null ? xp : 0}</span>
              </div>
            </div>

            {/* Direct Top Header LOG OUT Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                background: themeMode === 'light' ? '#ffe4e6' : 'rgba(225, 29, 72, 0.15)',
                border: '1.5px solid #e11d48',
                color: themeMode === 'light' ? '#9f1239' : '#fda4af',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s',
                boxShadow: themeMode === 'light' ? '0 2px 8px rgba(225, 29, 72, 0.15)' : 'none'
              }}
              title="Log Out & Return to Login / Register Screen"
            >
              <span>🚪</span>
              <span>LOG OUT</span>
            </button>

            {/* Corner User Account Details with Dropdown & Logout Option */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowAccountMenu(prev => !prev)}
                style={{
                  background: showAccountMenu 
                    ? (themeMode === 'light' ? '#ffedd5' : 'rgba(245, 158, 11, 0.2)') 
                    : (themeMode === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)'),
                  border: `1.5px solid ${themeMode === 'light' ? '#ea580c' : 'rgba(217, 119, 6, 0.4)'}`,
                  borderRadius: '999px',
                  padding: '4px 12px 4px 6px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: themeMode === 'light' ? '0 2px 10px rgba(0,0,0,0.08)' : (showAccountMenu ? '0 0 14px var(--gold-bg)' : 'none')
                }}
                title="Click to view Account Details and Logout"
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #0284c7)',
                  color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, border: '1.5px solid #ffffff'
                }}>
                  {(user?.name || 'Kavya').charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: themeMode === 'light' ? '#0f172a' : 'var(--heading-color, #ffffff)', lineHeight: 1.1 }}>
                    {user?.name || 'Kavya'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: themeMode === 'light' ? '#c2410c' : 'var(--gold-amber, #f59e0b)', textTransform: 'uppercase' }}>
                    {['intermediate','simulation','int-complete'].includes(currentScreen) ? 'Level 2' :
                     ['advanced','unlock-adv','adv-result'].includes(currentScreen) ? 'Level 3' : 'Level 1'}
                  </div>
                </div>
                <span style={{ fontSize: 9, color: themeMode === 'light' ? '#64748b' : 'var(--text-muted, #94a3b8)', transform: showAccountMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </div>

              {/* Dropdown Menu Popover */}
              {showAccountMenu && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                    onClick={() => setShowAccountMenu(false)}
                  />
                  <div
                    className="glass-card-deep anim-scale"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: 280,
                      zIndex: 120,
                      background: 'var(--bg-card, #12100c)',
                      border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.4))',
                      borderRadius: 18,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Header info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light, rgba(255,255,255,0.1))', paddingBottom: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold-primary, #f59e0b), var(--gold-dark, #d97706))',
                        color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 900, border: '2px solid #ffffff'
                      }}>
                        {(user?.name || 'Kavya').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--heading-color, #ffffff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.name || 'Kavya'}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.email || 'Logged in user'}
                        </div>
                      </div>
                    </div>

                    {/* Account details breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, background: 'var(--bg-main, rgba(0,0,0,0.3))', padding: 10, borderRadius: 12, border: '1px solid var(--border-light, rgba(255,255,255,0.05))' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)' }}>
                        <span>Start Level:</span>
                        <strong style={{ color: 'var(--text-main, #ffffff)', textTransform: 'capitalize' }}>{user?.startLevel || 'Beginner'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)' }}>
                        <span>Current Location:</span>
                        <strong style={{ color: 'var(--gold-amber, #fbbf24)' }}>
                          {['intermediate','simulation','int-complete'].includes(currentScreen) ? 'Level 2 Lab 🧪' :
                           ['advanced','unlock-adv','adv-result'].includes(currentScreen) ? 'Level 3 Tower 🏢' : 'Level 1 School 🏫'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)' }}>
                        <span>Total Balance XP:</span>
                        <strong style={{ color: 'var(--gold-primary, #f59e0b)' }}>⭐ {xp || 0} XP</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)' }}>
                        <span>AI Mentor:</span>
                        <strong style={{ color: 'var(--text-main, #ffffff)' }}>{activeAvatar.icon} {guideName}</strong>
                      </div>
                    </div>

                    {/* Quick navigation actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button
                        onClick={() => { setShowAccountMenu(false); go('landing'); }}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-light, rgba(255,255,255,0.1))',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: 'var(--text-main, #e2e8f0)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          textAlign: 'left'
                        }}
                      >
                        <span>🏠</span>
                        <span>Main Page (All 3 Levels)</span>
                      </button>

                      {openProfile && (
                        <button
                          onClick={() => { setShowAccountMenu(false); openProfile(); }}
                          style={{
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid #f59e0b',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#fbbf24',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            textAlign: 'left'
                          }}
                        >
                          <span>👤</span>
                          <span>Edit Profile & Backup Data</span>
                        </button>
                      )}

                      <button
                        onClick={() => { setShowAccountMenu(false); openAvatarModal(); }}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-light, rgba(255,255,255,0.1))',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: 'var(--text-main, #e2e8f0)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          textAlign: 'left'
                        }}
                      >
                        <span>⚙️</span>
                        <span>Customize Avatar / Profile</span>
                      </button>
                    </div>

                    <div style={{ height: 1, background: 'var(--border-light, rgba(255,255,255,0.1))' }} />

                    {/* Logout Option in Account Menu */}
                    <button
                      onClick={() => {
                        setShowAccountMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      style={{
                        background: 'rgba(225, 29, 72, 0.15)',
                        border: '1.5px solid #e11d48',
                        borderRadius: 10,
                        padding: '10px 14px',
                        color: '#fda4af',
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>🚪</span>
                      <span>LOG OUT</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── STICKY BOTTOM NAVIGATION TAB BAR (MOBILE ONLY) ─── */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--nav-bg, rgba(18, 16, 12, 0.96))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1.5px solid rgba(217, 119, 6, 0.3)',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '6px 0 8px',
        boxShadow: 'var(--card-shadow, 0 -10px 30px rgba(0,0,0,0.8))',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        {navItems.map(item => {
          const isActive = currentScreen === item.screen
          return (
            <button
              key={item.screen}
              onClick={() => go(item.screen)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isActive ? '#fbbf24' : 'var(--text-muted, #9ca3af)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <span style={{
                fontSize: 18,
                filter: isActive ? 'drop-shadow(0 0 8px #f59e0b)' : 'none',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 900 : 600,
                marginTop: 2,
                letterSpacing: '0.3px',
                color: isActive ? 'var(--heading-color, #ffffff)' : 'var(--text-muted, #9ca3af)'
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: -4,
                  width: 16,
                  height: 3,
                  background: '#f59e0b',
                  borderRadius: '999px',
                  boxShadow: '0 0 8px #f59e0b'
                }} />
              )}
            </button>
          )
        })}

        {/* Chat Drawer Trigger Tab */}
        <button
          onClick={onChatToggle}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fbbf24',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: 18, filter: 'drop-shadow(0 0 8px #f59e0b)' }}>
            🤖
          </span>
          <span style={{ fontSize: 10, fontWeight: 900, marginTop: 2, color: '#fbbf24' }}>
            {guideName}
          </span>
        </button>
      </div>

      {/* ─── HEURISTIC 10: HELP & DOCUMENTATION MODAL ─── */}
      {showHelpModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} className="anim-fade" onClick={() => setShowHelpModal(false)}>
          <div style={{
            background: 'var(--card-bg-gradient, linear-gradient(145deg, #12100c 0%, #1a1610 100%))',
            border: '2px solid #d97706', borderRadius: 24, padding: '28px',
            maxWidth: 440, width: '100%', color: 'var(--text-main, #fef3c7)', boxShadow: '0 0 40px rgba(217,119,6,0.3)'
          }} className="anim-scale" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>❓</span> HOW LEARN2INVEST WORKS
              </div>
              <button onClick={() => setShowHelpModal(false)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, lineHeight: 1.5, color: 'var(--text-sub, #d1d5db)' }}>
              <div style={{ background: 'var(--gold-bg, rgba(255,255,255,0.03))', padding: 12, borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                <strong style={{ color: 'var(--heading-color, #ffffff)' }}>🏫 Level 1: School</strong>
                <p style={{ marginTop: 4 }}>Watch 5 projector video lessons on PPF, FD, Stocks & Mutual Funds. Earn +30 XP per lesson, then unlock the Quiz Hall!</p>
              </div>
              <div style={{ background: 'var(--gold-bg, rgba(255,255,255,0.03))', padding: 12, borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                <strong style={{ color: 'var(--heading-color, #ffffff)' }}>🧪 Level 2: Investment Lab</strong>
                <p style={{ marginTop: 4 }}>Simulate asset allocations & compounding returns. Master SIPs, Lump Sum, and Risk Management.</p>
              </div>
              <div style={{ background: 'var(--gold-bg, rgba(255,255,255,0.03))', padding: 12, borderRadius: 12, border: '1px solid rgba(217,119,6,0.2)' }}>
                <strong style={{ color: 'var(--heading-color, #ffffff)' }}>🤖 AI Guide Mentor ({guideName})</strong>
                <p style={{ marginTop: 4 }}>Tap the 🤖 button anytime to ask about Indian investments, tax savings under Section 80C, or financial planning.</p>
              </div>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: 12 }}>
              GOT IT! CONTINUE LEARNING 🚀
            </button>
          </div>
        </div>
      )}

      {/* ─── HEURISTIC 3: LOGOUT CONFIRMATION DIALOG ─── */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} className="anim-fade" onClick={() => setShowLogoutConfirm(false)}>
          <div style={{
            background: 'var(--bg-card-deep, #12100c)', border: '2px solid #e11d48',
            borderRadius: 20, padding: 24, maxWidth: 360, width: '100%',
            color: 'var(--text-main, #fef3c7)', textAlign: 'center'
          }} className="anim-scale" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⏏</div>
            <h3 style={{ fontSize: 18, color: 'var(--heading-color, #ffffff)', marginBottom: 8 }}>LOG OUT OF LEARN2INVEST?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-sub, #d1d5db)', marginBottom: 20 }}>Your progress is safely saved to the cloud.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-outline" style={{ flex: 1, padding: 10, fontSize: 12 }}>CANCEL</button>
              <button onClick={handleLogout} className="btn-pink" style={{ flex: 1, padding: 10, fontSize: 12 }}>YES, LOGOUT</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
