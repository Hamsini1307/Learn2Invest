import React, { useState, useRef, useEffect } from 'react'
import { apiRequest } from '../api.js'
import soundEngine from '../utils/soundEngine.js'

const LEVEL_OPTIONS = [
  {
    id: 'beginner',
    emoji: '🌱',
    title: 'LEVEL 1: LEARN2INVEST SCHOOL',
    desc: 'Start in the 3D Classroom & master investment fundamentals',
    accent: '#10b981',
  },
  {
    id: 'intermediate',
    emoji: '🏛️',
    title: 'LEVEL 2: GOVT FINANCIAL DISTRICT',
    desc: 'Unlock institutional simulators & sovereign schemes immediately',
    accent: '#f59e0b',
  },
]

export default function FloatingAuthPortal3D({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('beginner')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen) {
      soundEngine.playDoorOpen()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: -dy * 6, y: dx * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e)

  const handleRegister = async () => {
    soundEngine.playClick()
    setError('')
    if (!name.trim()) return setError('Please enter your full name.')
    if (!validateEmail(email)) return setError('Please enter a valid email address.')
    if (pass.length < 6) return setError('Password must be at least 6 characters.')
    if (pass !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await apiRequest('/api/register', 'POST', {
        name: name.trim(),
        email: email.trim(),
        password: pass,
        startLevel: selectedLevel,
      })
      // Automatically sign in after registration so the cinematic camera journey starts right away!
      const loginData = await apiRequest('/api/login', 'POST', {
        email: email.trim(),
        password: pass,
      })
      localStorage.setItem('l2i_isLoggedIn', 'true')
      localStorage.setItem('l2i_token', loginData.token)
      localStorage.setItem('l2i_currentUser', JSON.stringify(loginData.user))
      setLoading(false)
      onLoginSuccess(loginData.user)
    } catch (err) {
      setLoading(false)
      // If account already exists or server offline, provide clear message
      setError(err.message || 'Registration failed. Try signing in or use Quick Enter.')
    }
  }

  const handleLogin = async () => {
    soundEngine.playClick()
    setError('')
    if (!validateEmail(email)) return setError('Please enter a valid email address.')
    if (!pass) return setError('Please enter your password.')

    setLoading(true)
    try {
      const data = await apiRequest('/api/login', 'POST', { email: email.trim(), password: pass })
      localStorage.setItem('l2i_isLoggedIn', 'true')
      localStorage.setItem('l2i_token', data.token)
      localStorage.setItem('l2i_currentUser', JSON.stringify(data.user))
      setLoading(false)
      onLoginSuccess(data.user)
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Invalid credentials.')
    }
  }

  const handleQuickDemoLogin = async () => {
    soundEngine.playXPFanfare()
    setLoading(true)
    setError('')
    const demoEmail = 'student@learn2invest.in'
    const demoPass = 'invest123'
    try {
      const data = await apiRequest('/api/login', 'POST', { email: demoEmail, password: demoPass })
      localStorage.setItem('l2i_isLoggedIn', 'true')
      localStorage.setItem('l2i_token', data.token)
      localStorage.setItem('l2i_currentUser', JSON.stringify(data.user))
      setLoading(false)
      onLoginSuccess(data.user)
    } catch {
      try {
        await apiRequest('/api/register', 'POST', {
          name: 'Aarav Sharma',
          email: demoEmail,
          password: demoPass,
          startLevel: 'beginner',
        })
        const data = await apiRequest('/api/login', 'POST', { email: demoEmail, password: demoPass })
        localStorage.setItem('l2i_isLoggedIn', 'true')
        localStorage.setItem('l2i_token', data.token)
        localStorage.setItem('l2i_currentUser', JSON.stringify(data.user))
        setLoading(false)
        onLoginSuccess(data.user)
      } catch {
        // Fallback local guest user if backend isn't reachable
        const fallbackUser = { name: 'Aarav Sharma', email: demoEmail, startLevel: 'beginner' }
        localStorage.setItem('l2i_isLoggedIn', 'true')
        localStorage.setItem('l2i_currentUser', JSON.stringify(fallbackUser))
        setLoading(false)
        onLoginSuccess(fallbackUser)
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, rgba(4, 9, 18, 0.68) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        perspective: '1200px',
      }}
      onClick={onClose}
    >
      {/* Floating 3D Glassmorphic Hologram Panel */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxWidth: '490px',
          borderRadius: '28px',
          padding: '32px 30px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.78) 0%, rgba(8, 14, 28, 0.88) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1.5px solid rgba(16, 185, 129, 0.45)',
          boxShadow:
            '0 30px 80px rgba(0, 0, 0, 0.75), 0 0 50px rgba(16, 185, 129, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(20px)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
          animation: 'floatGlassPanel 5s ease-in-out infinite',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
        }}
      >
        {/* Subtle Holographic Top Glow Orb */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 75%)',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick()
            onClose()
          }}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 900,
            transition: 'all 0.2s',
          }}
          title="Return to 3D Garden"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 22, position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              color: '#6ee7b7',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: 10,
            }}
          >
            <span>✨</span> 3D VIRTUAL CAMPUS PORTAL
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 36,
              margin: 0,
              letterSpacing: '1.5px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LEARN2INVEST
          </h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
            Sign in to walk down the garden path and enter the 3D School
          </p>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(2, 6, 23, 0.65)',
            borderRadius: 999,
            padding: 4,
            marginBottom: 20,
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {[
            ['login', '🔑 SIGN IN'],
            ['register', '✨ NEW STUDENT'],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => {
                soundEngine.playHover()
                setTab(t)
                setError('')
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.6px',
                background:
                  tab === t
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'transparent',
                color: tab === t ? '#022c22' : '#cbd5e1',
                boxShadow: tab === t ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 16,
              background: 'rgba(239, 68, 68, 0.16)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {tab === 'login' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px', marginBottom: 5 }}>
                STUDENT EMAIL
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#ffffff',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px', marginBottom: 5 }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#ffffff',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 999,
                border: '1px solid #6ee7b7',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#022c22',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.8px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
                marginTop: 4,
              }}
            >
              {loading ? '⏳ OPENING SCHOOL GATES...' : '🚪 SIGN IN & ENTER 3D SCHOOL →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>OR INSTANT ACCESS</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <button
              onClick={handleQuickDemoLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 999,
                border: '1px solid rgba(251, 191, 36, 0.5)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: '0.6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ⚡ QUICK EXPLORER PASS (ENTER IMMEDIATELY)
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '62vh', overflowY: 'auto', paddingRight: 4 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 4 }}>FULL NAME</label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#ffffff',
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 4 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#ffffff',
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 4 }}>PASSWORD</label>
                <input
                  type="password"
                  placeholder="Min 6 chars"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    color: '#ffffff',
                    fontSize: 13,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 4 }}>CONFIRM</label>
                <input
                  type="password"
                  placeholder="Repeat"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    color: '#ffffff',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 6 }}>
                CHOOSE STARTING CAMPUS ZONE
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LEVEL_OPTIONS.map((lv) => (
                  <div
                    key={lv.id}
                    onClick={() => setSelectedLevel(lv.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 14,
                      cursor: 'pointer',
                      background:
                        selectedLevel === lv.id ? 'rgba(16, 185, 129, 0.14)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1.5px solid ${selectedLevel === lv.id ? lv.accent : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{lv.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#ffffff' }}>{lv.title}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{lv.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 999,
                border: '1px solid #fbbf24',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#080705',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.8px',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)',
                marginTop: 4,
              }}
            >
              {loading ? '⏳ CREATING STUDENT PASS...' : '✨ REGISTER & LAUNCH JOURNEY →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
