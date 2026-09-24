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

export default function Quiz({ go, goBack, state, update, addXP }) {
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
        <div style={{ fontSize:48, marginBottom:16, animation:'floatY 1s ease-in-out infinite' }}>📝</div>
        <p style={{ color:'#f59e0b', fontWeight:800 }}>LOADING QUIZ...</p>
      </div>
    </div>
  )

  if (!questions.length) return (
    <div className="content-area" style={{ textAlign:'center', padding:40 }}>
      <p style={{ color:'#e11d48', fontFamily:"'Space Grotesk', sans-serif" }}>
        ⚠ Could not load quiz. Place quiz1.json in /content/beginner/quizzes/
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
        const allBegVideos = ['video1', 'video2', 'video3', 'video4', 'video5']
        const updatedWatched = state.startingLevel === 'intermediate'
          ? Array.from(new Set([...(state.lessonsWatched || []), ...allBegVideos]))
          : state.lessonsWatched
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
        <div className="glass-card-deep anim-scale" style={{ padding:'44px 36px', maxWidth:480, width:'100%', textAlign:'center', background: 'var(--bg-card-deep, #12100c)', border: '2px solid #d97706' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>😅</div>
          <h2 className="font-display" style={{ fontSize:34, color:'var(--heading-color, #ffffff)', marginBottom:8 }}>
            ALMOST THERE!
          </h2>
          <p style={{ color:'var(--text-sub, #d1d5db)', fontSize:15, fontWeight:600, marginBottom:20 }}>
            You scored <strong style={{ color:'#f59e0b' }}>{score}%</strong> — need 60% to pass.
          </p>
          <div style={{
            background:'rgba(245,158,11,0.12)',
            borderRadius:14, padding:16, border:'1.5px solid #d97706', marginBottom:24,
          }}>
            <div style={{ fontSize:14, fontWeight:800, color:'#fbbf24', fontFamily:"'Space Grotesk', sans-serif" }}>
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
      <div className="glass-card-sm anim-fade" style={{ padding:'18px 22px', marginBottom:20, background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(217, 119, 6, 0.3)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontWeight:900, color:'var(--heading-color, #ffffff)', fontSize:14 }}>
            QUESTION {current + 1} OF {questions.length}
          </span>
          <div className="sticker-badge sticker-yellow">
            ⭐ {state.xp} XP
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${progress}%`,
            background:'linear-gradient(90deg,#d97706,#f59e0b)',
          }}/>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:10 }}>
          {questions.map((_,i) => (
            <div key={i} style={{
              flex:1, height:6, borderRadius:999,
              background: i < current
                ? '#f59e0b'
                : i === current
                ? '#fbbf24'
                : 'rgba(255,255,255,0.1)',
              transition:'background 0.3s',
            }}/>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card-deep anim-scale" style={{ padding:32, marginBottom:20, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217, 119, 6, 0.3)' }}>
        <div style={{
          width:60,height:60,borderRadius:18,
          background:'rgba(245,158,11,0.15)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:28,marginBottom:18,
          border:'2px solid #f59e0b',
        }}>{q.emoji || '📊'}</div>

        <h2 style={{ fontWeight:900, fontSize:20, color:'var(--heading-color, #ffffff)', marginBottom:24, lineHeight:1.4 }}>
          {q.question}
        </h2>

        {/* Options */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (answered) {
              if (i === q.answer) cls += ' correct'
              else if (i === selected && i !== q.answer) cls += ' wrong'
            }
            return (
              <div key={i} className={cls} onClick={() => handleSelect(i)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding: '14px 18px', borderRadius: 14, cursor: answered ? 'default' : 'pointer',
                  background: answered ? (i === q.answer ? 'rgba(34,197,94,0.15)' : i === selected ? 'rgba(239,68,68,0.15)' : 'var(--input-bg, rgba(255,255,255,0.03))') : 'var(--input-bg, rgba(255,255,255,0.03))',
                  border: answered ? (i === q.answer ? '1.5px solid #22c55e' : i === selected ? '1.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)') : '1.5px solid rgba(217, 119, 6, 0.25)',
                  transition: 'all 0.2s'
                }}>
                <div style={{
                  width:30,height:30,borderRadius:'50%',flexShrink:0,
                  background: answered && i === q.answer
                    ? '#22c55e'
                    : answered && i === selected && i !== q.answer
                    ? '#ef4444'
                    : '#d97706',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color: (answered && (i === q.answer || (i === selected && i !== q.answer))) ? '#ffffff' : '#080705',
                  fontSize:13, fontWeight:900, transition:'all 0.3s',
                  border: '1.5px solid #fbbf24',
                }}>
                  {answered && i === q.answer ? '✓' : answered && i === selected && i !== q.answer ? '✗' : String.fromCharCode(65+i)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--heading-color, #ffffff)' }}>
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
            background:'rgba(245,158,11,0.12)',
            border:'1.5px solid #d97706',
            borderRadius:14,padding:'12px 16px',marginBottom:16,
          }}>
            <span style={{ fontSize:13, fontWeight:800, color:'#fbbf24' }}>
              💡 {q.hint}
            </span>
          </div>
        )}

        {answered && (
          <div className="anim-fade" style={{
            background: selected === q.answer
              ? 'rgba(34,197,94,0.12)'
              : 'rgba(239,68,68,0.12)',
            border:`1.5px solid ${selected === q.answer ? '#22c55e' : '#ef4444'}`,
            borderRadius:14,padding:'14px 16px',marginBottom:20,
          }}>
            <div style={{ fontWeight:900, color: selected === q.answer ? '#86efac' : '#fca5a5', fontSize:14, marginBottom:4 }}>
              {selected === q.answer ? '🎉 CORRECT!' : '❌ INCORRECT'}
            </div>
            <div style={{ fontSize:13, color:'var(--text-sub, #d1d5db)', fontWeight:600 }}>{q.explanation}</div>
          </div>
        )}

        {answered && (
          <button className="btn-primary" onClick={handleNext} style={{ width:'100%', fontSize:15 }}>
            {current < questions.length - 1 ? 'NEXT QUESTION (ENTER) →' : '🏁 FINISH QUIZ (ENTER)'}
          </button>
        )}
      </div>

      {/* Score Tracker */}
      <div className="glass-card-sm" style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', background: 'var(--bg-card-deep, #12100c)', border: '1.5px solid rgba(217, 119, 6, 0.3)' }}>
        <span style={{ fontSize:13, fontWeight:800, color:'var(--text-sub, #d1d5db)' }}>SCORE SO FAR</span>
        <span style={{ fontWeight:900, color:'#fbbf24', fontSize:15 }}>
          {correct}/{current + (answered ? 1 : 0)} CORRECT
        </span>
      </div>
    </div>
  )
}
