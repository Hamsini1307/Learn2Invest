import { useState, useEffect } from 'react'
import { quizQuestions } from '../data.js'

function XPBurst({ show }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, pointerEvents: 'none',
    }}>
      <div className="font-display" style={{
        fontSize: 54, fontWeight: 900,
        color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.8), 4px 4px 0px #000',
        animation: 'xpPop 1s ease forwards',
      }}>+150 XP ⭐</div>
    </div>
  )
}

const QuestionGraphic = ({ index }) => {
  const graphics = [
    // Q1: Interest & Compounding
    (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    // Q2: Budgeting / Money Management
    (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M7 15h4" />
      </svg>
    ),
    // Q3: Stock & Mutual Funds
    (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    // Q4: Tax Savings 80C
    (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    // Q5: Asset Allocation
    (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9h9" />
      </svg>
    )
  ]
  return graphics[index % graphics.length]
}

export default function Quiz({ go, goBack, state, update, addXP, themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const initialMappedQuestions = (quizQuestions || []).map((q, i) => ({
    id: `q${i+1}`,
    question: q.q,
    options: q.opts,
    answer: q.ans,
    hint: q.hint,
    explanation: q.explain,
    emoji: q.emoji || '📊',
  }))

  const [questions, setQuestions] = useState(initialMappedQuestions)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showXP, setShowXP] = useState(false)

  useEffect(() => {
    fetch('/content/beginner/quizzes/quiz1.json')
      .then(r => {
        if (r.ok && r.headers.get('content-type')?.includes('json')) {
          return r.json()
        }
        return null
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (done || loading || !questions.length) return

      if (!answered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1
          if (idx < (questions[current]?.options?.length || 0)) {
            handleSelect(idx)
          }
        }
      } else {
        if (e.key === 'Enter') {
          handleNext()
        }
      }
      if (e.key === 'Escape') {
        if (window.confirm('Are you sure you want to exit the quiz? Progress will not be saved.')) {
          go('beginner')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [answered, current, done, loading, questions])

  if (loading) return (
    <div className="content-area" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div style={{ textAlign:'center', fontFamily:"'Space Grotesk', sans-serif" }}>
        <div style={{ fontSize:48, marginBottom:16, animation:'floatY 1s ease-in-out infinite' }}>🎯</div>
        <p style={{ color:'#f59e0b', fontWeight:800 }}>LOADING QUIZ HALL...</p>
      </div>
    </div>
  )

  if (!questions.length) return (
    <div className="content-area" style={{ textAlign:'center', padding:40 }}>
      <p style={{ color:'#e11d48', fontFamily:"'Space Grotesk', sans-serif" }}>
        ⚠ Could not load quiz.
      </p>
      <button className="btn-outline" onClick={() => go('beginner')} style={{ marginTop:16 }}>← BACK</button>
    </div>
  )

  const q = questions[current]
  const progress = Math.min(100, Math.round((current / questions.length) * 100))

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.answer) setCorrect(c => c + 1)
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setShowHint(false)
    } else {
      const finalCorrect = correct
      const score = Math.min(100, Math.round((finalCorrect / questions.length) * 100))
      const passed = score >= 60
      if (passed) {
        setShowXP(true)
        addXP(150)
        const allBegVideos = ['video1', 'video2', 'video3', 'video4', 'video5', 'ppf', 'fd', 'nsc', 'ssy']
        const updatedWatched = Array.from(new Set([...(state.lessonsWatched || []), ...allBegVideos]))
        update({
          quizScore: score,
          correctCount: finalCorrect,
          quizTotal: questions.length,
          intermediateUnlocked: true,
          lessonsWatched: updatedWatched
        })
        setTimeout(() => { setShowXP(false); go('beg-complete') }, 1200)
      } else {
        update({ quizScore: score, correctCount: finalCorrect, quizTotal: questions.length })
        setDone(true)
      }
    }
  }

  const handleRetry = () => {
    setCurrent(0); setSelected(null); setAnswered(false)
    setCorrect(0); setDone(false); setShowHint(false)
  }

  if (done) {
    const score = Math.min(100, Math.round((correct / questions.length) * 100))
    return (
      <div className="content-area" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
        <div className="glass-card-deep anim-scale" style={{ padding:'44px 36px', maxWidth:480, width:'100%', textAlign:'center', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #ea580c' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>😅</div>
          <h2 className="font-display" style={{ fontSize:34, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom:8 }}>
            ALMOST THERE!
          </h2>
          <p style={{ color: isLight ? '#334155' : 'var(--text-sub, #d1d5db)', fontSize:15, fontWeight:600, marginBottom:20 }}>
            You scored <strong style={{ color:'#ea580c' }}>{score}%</strong> — need 60% to pass.
          </p>
          <div style={{
            background: isLight ? '#fff7ed' : 'rgba(245,158,11,0.12)',
            borderRadius:14, padding:16, border: isLight ? '1.5px solid #ea580c' : '1.5px solid #d97706', marginBottom:24,
          }}>
            <div style={{ fontSize:14, fontWeight:800, color: isLight ? '#c2410c' : '#fbbf24', fontFamily:"'Space Grotesk', sans-serif" }}>
              {correct}/{questions.length} CORRECT — RETRY TO UNLOCK INTERMEDIATE!
            </div>
          </div>
          <div style={{ display:'flex', gap:12, flexDirection:'column' }}>
            <button className="btn-primary" onClick={handleRetry} style={{ width:'100%' }}>🔄 RETRY QUIZ</button>
            <button className="btn-outline" onClick={() => go('beginner')} style={{ width:'100%' }}>📚 RE-WATCH LESSONS</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <XPBurst show={showXP} />

      {/* Progress Bar Header */}
      <div className="glass-card-sm anim-fade" style={{ padding:'18px 22px', marginBottom:20, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : '1.5px solid rgba(217, 119, 6, 0.3)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontWeight:900, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', fontSize:14 }}>
            QUESTION {current + 1} OF {questions.length}
          </span>
          <div className="sticker-badge sticker-yellow">
            ⭐ {state.xp} XP
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #ea580c, #f59e0b)',
          }}/>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card-deep anim-scale" style={{ padding:32, marginBottom:20, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: isLight ? '2px solid rgba(234, 88, 12, 0.35)' : '2px solid rgba(217, 119, 6, 0.3)', boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 12px 36px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: isLight ? '#fff7ed' : 'rgba(245,158,11,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: isLight ? '2px solid #ea580c' : '2px solid #f59e0b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <QuestionGraphic index={current} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              EXAM QUESTION 0{current + 1}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: isLight ? '#475569' : '#9ca3af' }}>
              Level 1 Financial Literacy
            </div>
          </div>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: 20, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 24, lineHeight: 1.4 }}>
          {q.question}
        </h2>

        {/* Options */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            const isCorrect = i === q.answer
            const isSelected = i === selected

            let bg = isLight ? '#f8fafc' : 'var(--input-bg, rgba(255,255,255,0.03))'
            let border = isLight ? '1.5px solid #cbd5e1' : '1.5px solid rgba(217, 119, 6, 0.25)'
            let textColor = isLight ? '#0f172a' : 'var(--heading-color, #ffffff)'

            if (answered) {
              if (isCorrect) {
                cls += ' correct'
                bg = isLight ? '#dcfce7' : 'rgba(34,197,94,0.15)'
                border = isLight ? '1.5px solid #16a34a' : '1.5px solid #22c55e'
                textColor = isLight ? '#14532d' : '#86efac'
              } else if (isSelected && !isCorrect) {
                cls += ' wrong'
                bg = isLight ? '#fee2e2' : 'rgba(239,68,68,0.15)'
                border = isLight ? '1.5px solid #dc2626' : '1.5px solid #ef4444'
                textColor = isLight ? '#7f1d1d' : '#fca5a5'
              }
            }

            return (
              <div key={i} className={cls} onClick={() => handleSelect(i)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding: '14px 18px', borderRadius: 14, cursor: answered ? 'default' : 'pointer',
                  background: bg,
                  border: border,
                  transition: 'all 0.2s'
                }}>
                <div style={{
                  width:32,height:32,borderRadius:'50%',flexShrink:0,
                  background: answered && isCorrect
                    ? '#16a34a'
                    : answered && isSelected && !isCorrect
                    ? '#dc2626'
                    : '#ea580c',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color: '#ffffff',
                  fontSize:13, fontWeight:900, transition:'all 0.3s',
                  border: '1.5px solid #ffffff',
                }}>
                  {answered && isCorrect ? '✓' : answered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65+i)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textColor }}>
                  {opt}
                </div>
              </div>
            )
          })}
        </div>

        {/* Hint Button & Drawer */}
        {!answered && (
          <button onClick={() => setShowHint(!showHint)} className="btn-outline" style={{
            fontSize:12, padding:'8px 16px', marginBottom:16,
          }}>💡 {showHint ? 'HIDE HINT' : 'SHOW HINT'}</button>
        )}

        {showHint && !answered && (
          <div className="anim-fade" style={{
            background: isLight ? '#fff7ed' : 'rgba(245,158,11,0.12)',
            border: isLight ? '1.5px solid #ea580c' : '1.5px solid #d97706',
            borderRadius:14,padding:'12px 16px',marginBottom:16,
          }}>
            <span style={{ fontSize:13, fontWeight:800, color: isLight ? '#c2410c' : '#fbbf24' }}>
              💡 {q.hint}
            </span>
          </div>
        )}

        {answered && (
          <div className="anim-fade" style={{
            background: selected === q.answer
              ? (isLight ? '#f0fdf4' : 'rgba(34,197,94,0.12)')
              : (isLight ? '#fef2f2' : 'rgba(239,68,68,0.12)'),
            border:`1.5px solid ${selected === q.answer ? (isLight ? '#16a34a' : '#22c55e') : (isLight ? '#dc2626' : '#ef4444')}`,
            borderRadius:14,padding:'14px 16px',marginBottom:20,
          }}>
            <div style={{ fontWeight:900, color: selected === q.answer ? (isLight ? '#15803d' : '#86efac') : (isLight ? '#b91c1c' : '#fca5a5'), fontSize:14, marginBottom:4 }}>
              {selected === q.answer ? '🎉 CORRECT ANSWER!' : '❌ INCORRECT'}
            </div>
            <div style={{ fontSize:13, color: isLight ? '#1e293b' : 'var(--text-sub, #d1d5db)', fontWeight:600, lineHeight: 1.5 }}>{q.explanation}</div>
          </div>
        )}

        {answered && (
          <button className="btn-primary" onClick={handleNext} style={{ width:'100%', fontSize:15, padding: '14px' }}>
            {current < questions.length - 1 ? 'NEXT QUESTION (ENTER) →' : '🏁 FINISH QUIZ (ENTER)'}
          </button>
        )}
      </div>

      {/* Score Tracker */}
      <div className="glass-card-sm" style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : '1.5px solid rgba(217, 119, 6, 0.3)' }}>
        <span style={{ fontSize:13, fontWeight:800, color: isLight ? '#334155' : 'var(--text-sub, #d1d5db)' }}>SCORE SO FAR</span>
        <span style={{ fontWeight:900, color: isLight ? '#ea580c' : '#fbbf24', fontSize:15 }}>
          {correct}/{current + (answered ? 1 : 0)} CORRECT
        </span>
      </div>
    </div>
  )
}
