import { useState } from 'react'
import { apiRequest } from '../api.js'

const FloatingEmoji = ({ emoji, size = 32, style }) => (
  <div style={{
    position: 'absolute', fontSize: size, opacity: 0.3,
    userSelect: 'none', pointerEvents: 'none',
    animation: 'floatY 5s ease-in-out infinite',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
    ...style
  }}>{emoji}</div>
)

const LEVEL_OPTIONS = [
  {
    id: 'beginner', emoji: '🌱', title: 'BEGINNER PORTAL', desc: 'New to investing & finance',
    accent: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)',
    unlocks: ['✓ Playful Video Lessons', '🔒 Intermediate (unlock via quiz)', '🔒 Advanced (unlock later)'],
  },
  {
    id: 'intermediate', emoji: '🚀', title: 'INTERMEDIATE PORTAL', desc: 'Know basic money concepts',
    accent: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)',
    unlocks: ['✓ Video Lessons Skip Enabled', '✓ Real-time Asset Simulators', '🔒 Advanced (unlock via Simulators)'],
  },
]

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: 12, color: '#0f172a', marginBottom: 6, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
    {children}
  </label>
)

const InputField = ({ type, placeholder, value, onChange, onKeyDown }) => (
  <input
    className="input-light"
    type={type} placeholder={placeholder} value={value}
    onChange={onChange} onKeyDown={onKeyDown}
    style={{ color: '#0f172a', fontWeight: 900, fontSize: 13 }}
  />
)

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [levelError, setLevelError] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = e => /\S+@\S+\.\S+/.test(e)

  const handleRegister = async () => {
    setError('')
    if (!name.trim()) return setError('Please enter your name.')
    if (!validateEmail(email)) return setError('Enter a valid email.')
    if (pass.length < 6) return setError('Password must be at least 6 characters.')
    if (pass !== confirm) return setError('Passwords do not match.')
    if (!selectedLevel) { setLevelError(true); return }

    try {
      await apiRequest('/api/register', 'POST', {
        name: name.trim(),
        email,
        password: pass,
        startLevel: selectedLevel
      })
      setTab('login')
      setPass('')
      setConfirm('')
      setError('✅ Account created! Please log in.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogin = async () => {
    setError('')
    if (!validateEmail(email)) return setError('Enter a valid email.')
    if (!pass) return setError('Enter your password.')

    try {
      const data = await apiRequest('/api/login', 'POST', { email, password: pass })
      localStorage.setItem('l2i_isLoggedIn', 'true')
      localStorage.setItem('l2i_token', data.token)
      localStorage.setItem('l2i_currentUser', JSON.stringify(data.user))
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '90px 20px 40px',
      position: 'relative', zIndex: 1,
      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
    }}>
      {/* Dynamic Background Emojis */}
      <FloatingEmoji emoji="💰" size={44} style={{ top: '8%', left: '8%', animationDelay: '0s' }} />
      <FloatingEmoji emoji="⚡" size={38} style={{ top: '15%', right: '10%', animationDelay: '1s' }} />
      <FloatingEmoji emoji="🏦" size={42} style={{ bottom: '20%', left: '6%', animationDelay: '2s' }} />
      <FloatingEmoji emoji="💳" size={36} style={{ bottom: '25%', right: '8%', animationDelay: '0.5s' }} />
      <FloatingEmoji emoji="🪙" size={40} style={{ top: '55%', left: '3%', animationDelay: '1.5s' }} />
      <FloatingEmoji emoji="🚀" size={34} style={{ top: '35%', right: '4%', animationDelay: '2.5s' }} />

      {/* Main Container */}
      <div className="glass-card-deep anim-scale" style={{
        padding: '40px 36px', width: '92%', maxWidth: 510,
        position: 'relative', overflow: 'hidden',
        background: '#ffffff',
        border: '2.5px solid #ea580c',
        boxShadow: '0 24px 64px rgba(234, 88, 12, 0.25)',
        color: '#0f172a'
      }}>

        <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', marginBottom: 10 }}>
            <span className="sticker-badge sticker-yellow">⚡ LUXURY FINANCIAL ARENA</span>
          </div>
          <h1 className="font-display" style={{
            fontSize: 44, color: '#0f172a',
            lineHeight: 1, marginBottom: 4, letterSpacing: '1px'
          }}>LEARN2INVEST</h1>
          <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Fuel your financial ambition 🇮🇳
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', background: '#fff7ed',
          borderRadius: 999, padding: 4, marginBottom: 24,
          border: '2px solid #ea580c',
          position: 'relative', zIndex: 1
        }}>
          {[['register', '✨ CREATE ACCOUNT'], ['login', '🔑 SIGN IN']].map(([t, label]) => (
            <div key={t} onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1, textAlign: 'center', padding: '12px',
                borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                background: tab === t
                  ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
                  : 'transparent',
                color: tab === t ? '#ffffff' : '#0f172a',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: tab === t ? '0 4px 14px rgba(234,88,12,0.4)' : 'none',
              }}>{label}</div>
          ))}
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 14, fontSize: 13, marginBottom: 20, fontWeight: 800,
            background: error.startsWith('✅') ? '#d1fae5' : '#ffe4e6',
            color: error.startsWith('✅') ? '#065f46' : '#be123c',
            border: `1.5px solid ${error.startsWith('✅') ? '#10b981' : '#e11d48'}`,
            position: 'relative', zIndex: 1
          }}>{error}</div>
        )}

        {tab === 'register' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }} className="anim-fade">
            <div><Label>Full Name</Label>
              <InputField type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div><Label>Email Address</Label>
              <InputField type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div><Label>Password</Label>
              <InputField type="password" placeholder="Min 6 characters" value={pass} onChange={e => setPass(e.target.value)} />
            </div>
            <div><Label>Confirm Password</Label>
              <InputField type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>

            <div>
              <Label>Select your knowledge portal <span style={{ color: '#e11d48' }}>*</span></Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                {LEVEL_OPTIONS.map(lv => (
                  <div key={lv.id} onClick={() => { setSelectedLevel(lv.id); setLevelError(false) }}
                    style={{
                      border: `2px solid ${selectedLevel === lv.id ? '#ea580c' : levelError ? '#e11d48' : '#fed7aa'}`,
                      borderRadius: 18, padding: '16px', cursor: 'pointer',
                      background: selectedLevel === lv.id ? '#fff7ed' : '#fffbebe6',
                      transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: selectedLevel === lv.id ? `0 0 20px rgba(234,88,12,0.25)` : 'none',
                      transform: selectedLevel === lv.id ? 'scale(1.01)' : 'none',
                      position: 'relative'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>{lv.emoji}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>{lv.title}</div>
                        <div style={{ fontSize: 11, color: '#0f172a', fontWeight: 800 }}>{lv.desc}</div>
                      </div>
                      {selectedLevel === lv.id && (
                        <div className="sticker-badge sticker-yellow" style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px' }}>
                          ACTIVE PORTAL
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {lv.unlocks.map((u, i) => (
                        <div key={i} style={{
                          fontSize: 11, fontWeight: 900,
                          color: u.startsWith('✓') 
                            ? '#047857' 
                            : '#0f172a',
                        }}>{u}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {levelError && <p style={{ fontSize: 12, color: '#e11d48', marginTop: 6, fontWeight: 800 }}>⚠ Please select a starting level.</p>}
            </div>

            <button className="btn-primary" onClick={handleRegister} style={{ width: '100%', marginTop: 8, padding: '16px' }}>
              CREATE ACCOUNT ✨
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }} className="anim-fade">
            <div><Label>Email Address</Label>
              <InputField type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div><Label>Password</Label>
              <InputField type="password" placeholder="Your password" value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', padding: '16px' }}>
              SIGN IN 🔑
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#0f172a', fontWeight: 900 }}>
              No account yet?{' '}
              <span onClick={() => setTab('register')} style={{ color: '#c2410c', cursor: 'pointer', fontWeight: 900 }}>
                Register here
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
