import React from 'react'

export default function PerformanceReportModal({ user, state, onClose, themeMode = 'dark' }) {
  const xp = state.xp || 0
  const watchedCount = Math.min(4, (state.lessonsWatched || []).length)
  const quizScore = state.quizScore || 0
  const completedModules = (state.completedModules || []).length
  const isLight = themeMode === 'light'

  // Requirement FR20: Suggest things that need improvement
  const improvementSuggestions = []
  if (watchedCount < 5) {
    improvementSuggestions.push("📹 Complete all 5 video lessons in School (Level 1) to earn +150 XP.")
  }
  if (quizScore < 60) {
    improvementSuggestions.push("📝 Take or retry the Level 1 Quiz — score 60%+ to unlock Level 2 Lab.")
  } else if (quizScore < 100) {
    improvementSuggestions.push(`🎯 Re-test Quiz Hall (Current: ${quizScore}%) to achieve a perfect 100% score!`)
  }
  if (completedModules < 6) {
    improvementSuggestions.push(`🧪 Complete remaining ${6 - completedModules} simulation modules in Investment Lab.`)
  }
  if (!state.advancedUnlocked) {
    improvementSuggestions.push("🏢 Unlock Level 3 Portfolio Tower to master asset allocation & diversification.")
  }
  if (improvementSuggestions.length === 0) {
    improvementSuggestions.push("🌟 Exceptional performance! Keep testing custom portfolio models & maintaining your streak.")
  }

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} className="anim-fade" onClick={onClose}>
      <div style={{
        background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
        border: '2px solid #ea580c',
        borderRadius: 24,
        padding: '28px',
        maxWidth: 580,
        width: '100%',
        color: isLight ? '#0f172a' : '#fef3c7',
        boxShadow: isLight ? '0 10px 40px rgba(234, 88, 12, 0.15)' : '0 0 50px rgba(245, 158, 11, 0.3)',
        fontFamily: "'Space Grotesk', sans-serif"
      }} className="anim-scale" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>📊</span>
            <div>
              <h2 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1 }}>
                PERFORMANCE REPORT & TRENDS
              </h2>
              <span style={{ fontSize: 11, color: isLight ? '#c2410c' : '#fbbf24', fontWeight: 800 }}>
                Learn2Invest Progress Analytics for {user?.name || 'Learner'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#fbbf24', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Executive Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <div style={{ background: isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.12)', border: '1px solid #ea580c', padding: 12, borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: isLight ? '#7c2d12' : '#9ca3af', fontWeight: 800 }}>TOTAL XP</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24' }}>{xp}</div>
          </div>
          <div style={{ background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', padding: 12, borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: isLight ? '#065f46' : '#9ca3af', fontWeight: 800 }}>QUIZ SCORE</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#059669' : '#6ee7b7' }}>{quizScore}%</div>
          </div>
          <div style={{ background: isLight ? '#f0f9ff' : 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8', padding: 12, borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: isLight ? '#075985' : '#9ca3af', fontWeight: 800 }}>SIMS CLEARED</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: isLight ? '#0284c7' : '#a5f3fc' }}>{completedModules}/8</div>
          </div>
        </div>

        {/* FR19: Progress Trends */}
        <div style={{ background: isLight ? '#f8fafc' : 'rgba(0,0,0,0.3)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, padding: 16, borderRadius: 16, marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 10, textTransform: 'uppercase' }}>
            📈 Learning Progress Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: isLight ? '#0f172a' : '#ffffff' }}>
                <span style={{ fontWeight: 700 }}>Video Lessons (Level 1)</span>
                <strong>{watchedCount}/4 ({watchedCount * 25}%)</strong>
              </div>
              <div style={{ width: '100%', height: 6, background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: 999 }}>
                <div style={{ width: `${watchedCount * 25}%`, height: '100%', background: '#ea580c', borderRadius: 999 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: isLight ? '#0f172a' : '#ffffff' }}>
                <span style={{ fontWeight: 700 }}>Investment Lab Simulators (Level 2)</span>
                <strong>{completedModules}/8 ({Math.round((completedModules/8)*100)}%)</strong>
              </div>
              <div style={{ width: '100%', height: 6, background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: 999 }}>
                <div style={{ width: `${Math.round((completedModules/8)*100)}%`, height: '100%', background: '#0284c7', borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </div>

        {/* FR20: Areas for Improvement */}
        <div style={{ background: isLight ? '#fef2f2' : 'rgba(225, 29, 72, 0.12)', border: `1px solid ${isLight ? 'rgba(225, 29, 72, 0.3)' : 'rgba(225, 29, 72, 0.4)'}`, padding: 16, borderRadius: 16, marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 900, color: isLight ? '#be123c' : '#fda4af', marginBottom: 8, textTransform: 'uppercase' }}>
            💡 Suggested Areas for Improvement
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: isLight ? '#0f172a' : '#ffffff' }}>
            {improvementSuggestions.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontWeight: 600 }}>
                <span>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handlePrintReport} className="btn-outline" style={{ flex: 1, padding: 12, fontSize: 12, borderColor: isLight ? '#ea580c' : undefined, color: isLight ? '#c2410c' : undefined }}>
            🖨️ PRINT / DOWNLOAD PDF
          </button>
          <button onClick={onClose} className="btn-primary" style={{ flex: 1, padding: 12, fontSize: 12 }}>
            CLOSE REPORT
          </button>
        </div>
      </div>
    </div>
  )
}
