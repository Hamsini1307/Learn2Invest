import React, { useState } from 'react'

export default function UserProfileModal({ user, state, update, onClose }) {
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [mobile, setMobile] = useState(localStorage.getItem('l2i_userMobile') || '')
  const [startLevel, setStartLevel] = useState(user?.startLevel || state.startingLevel || 'beginner')
  const [saveToast, setSaveToast] = useState('')

  const handleSaveProfile = () => {
    const updatedUser = { ...user, name: name.trim(), email: email.trim(), startLevel }
    localStorage.setItem('l2i_currentUser', JSON.stringify(updatedUser))
    localStorage.setItem('l2i_userMobile', mobile.trim())
    update({ user: updatedUser, startingLevel: startLevel })
    setSaveToast('✅ Profile updated successfully!')
    setTimeout(() => setSaveToast(''), 3000)
  }

  // Requirement 3.7.3: Backup & Recovery (Export Data)
  const handleExportBackup = () => {
    const backupData = {
      user: user,
      state: state,
      mobile: mobile,
      savedSimulations: localStorage.getItem('l2i_savedSimulations'),
      savedPortfolioSimulations: localStorage.getItem('l2i_savedPortfolioSimulations'),
      exportDate: new Date().toISOString(),
      version: '2.0.0'
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `learn2invest_backup_${user?.name || 'user'}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setSaveToast('💾 Backup downloaded successfully!')
    setTimeout(() => setSaveToast(''), 3000)
  }

  // Requirement 3.7.3: Backup & Recovery (Import/Restore Data)
  const handleImportBackup = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.state) {
          update({ ...data.state, user: data.user || user })
          if (data.user) localStorage.setItem('l2i_currentUser', JSON.stringify(data.user))
          if (data.savedSimulations) localStorage.setItem('l2i_savedSimulations', data.savedSimulations)
          if (data.savedPortfolioSimulations) localStorage.setItem('l2i_savedPortfolioSimulations', data.savedPortfolioSimulations)
          setSaveToast('🎉 Data restored successfully from backup!')
          setTimeout(() => setSaveToast(''), 4000)
        } else {
          alert('Invalid backup file format.')
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} className="anim-fade" onClick={onClose}>
      <div style={{
        background: 'var(--bg-card-deep, #12100c)',
        border: '2px solid #f59e0b',
        borderRadius: 24,
        padding: '28px',
        maxWidth: 520,
        width: '100%',
        color: '#fef3c7',
        boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
        fontFamily: "'Space Grotesk', sans-serif"
      }} className="anim-scale" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>👤</span>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, color: '#ffffff', lineHeight: 1 }}>
                USER PROFILE & BACKUP
              </h2>
              <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>
                Manage account settings & data backup
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {saveToast && (
          <div style={{ padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid #10b981', marginBottom: 16 }}>
            {saveToast}
          </div>
        )}

        {/* FR3: Update Profile Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>FULL NAME</label>
            <input className="input-light" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>EMAIL ADDRESS (FR1)</label>
              <input className="input-light" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>MOBILE NUMBER (FR1)</label>
              <input className="input-light" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 9876543210" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', display: 'block', marginBottom: 4 }}>LEARNING START PORTAL</label>
            <select className="input-light" value={startLevel} onChange={e => setStartLevel(e.target.value)}>
              <option value="beginner">🌱 Beginner Portal (School)</option>
              <option value="intermediate">🚀 Intermediate Portal (Lab)</option>
            </select>
          </div>

          <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: 12, width: '100%', fontSize: 13 }}>
            💾 SAVE PROFILE CHANGES
          </button>
        </div>

        {/* Requirement 3.7.3: Backup & Recovery Section */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1.5px solid rgba(217, 119, 6, 0.3)', padding: 16, borderRadius: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', marginBottom: 6 }}>
            🛡️ BACKUP & RECOVERY (REQ 3.7.3)
          </h4>
          <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>
            Safely download your learning achievements JSON or restore your data anytime.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleExportBackup} className="btn-outline" style={{ flex: 1, padding: '10px', fontSize: 11 }}>
              📥 EXPORT BACKUP
            </button>
            <label className="btn-outline" style={{ flex: 1, padding: '10px', fontSize: 11, textAlign: 'center', cursor: 'pointer' }}>
              📤 RESTORE BACKUP
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <button onClick={onClose} style={{ width: '100%', marginTop: 16, padding: 10, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
          CLOSE PROFILE
        </button>
      </div>
    </div>
  )
}
