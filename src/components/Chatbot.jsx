import React, { useState, useRef, useEffect } from 'react'
import soundEngine from '../utils/soundEngine.js'

function getLiveProgressSnapshot(state) {
  let stored = {}
  try {
    stored = JSON.parse(localStorage.getItem('l2i_live_progress') || '{}') || {}
  } catch {
    stored = {}
  }

  const completedSet = new Set(Array.isArray(stored.completedLevels) ? stored.completedLevels.map(Number) : [])
  if (state?.level1Completed) completedSet.add(1)
  if (state?.level2Completed) completedSet.add(2)
  if (state?.level3Completed) completedSet.add(3)

  const completedLevels = Array.from(completedSet).sort()
  const currentLevel = stored.currentLevel || (completedLevels.includes(2) ? 3 : completedLevels.includes(1) ? 2 : 1)

  const recentActions = []
  if ((stored.lessonsWatchedCount || 0) > 0) {
    recentActions.push(`Watched ${stored.lessonsWatchedCount}/5 classroom videos`)
  }
  if ((stored.quizAnsweredCount || 0) > 0) {
    recentActions.push(`Answered ${stored.quizAnsweredCount}/10 quiz questions (Score: ${stored.quizScore || 0}/10)`)
  }
  if (stored.simCompleted) recentActions.push('Completed Computer 1 (6 Scheme Simulators)')
  if (stored.mixerCompleted) recentActions.push('Completed Computer 2 (Savings Mixer Studio)')
  if (stored.metricsCompleted) recentActions.push('Completed Computer 3 (Portfolio Simulation)')
  if (Array.isArray(stored.completedBankSections) && stored.completedBankSections.length > 0) {
    recentActions.push(`Completed Bank Cabins: ${stored.completedBankSections.join(', ')}`)
  }

  return {
    currentLevel,
    completedLevels,
    lessonsWatchedCount: stored.lessonsWatchedCount ?? (state?.lessonsWatched?.length || 0),
    quizScore: stored.quizScore ?? (state?.quizScore || 0),
    bankedXp: stored.bankedXp ?? 0,
    allocations: state?.allocations || { PPF: 30, FD: 25, NSC: 20, SSY: 15, RD: 10 },
    recentActions,
  }
}

// Pure Independent AI Chatbot Client — Zero Predefined Rules!
async function fetchDynamicBotAnswer(
  message,
  history,
  userName,
  xp,
  lang,
  state,
  previousInteractionIdRef
) {
  const progress = getLiveProgressSnapshot(state)

  const systemInstruction = `You are Luna, an independent, accurate, and intelligent AI chatbot and financial mentor speaking with ${userName || 'a learner'} (${xp || 0} XP).
Answer the user's exact question naturally, accurately, and directly using your own knowledge and reasoning — never use canned or predefined rules.
You can answer any question on personal finance, economics, investments (PPF, FD, NSC, Sukanya Samriddhi, RD, Post Office MIS, stocks, mutual funds, SIPs, taxes, banking, IFSC, UPI safety), math calculations, coding, science, or general topics.
Optional context if the user asks about their Learn2Invest status: Current Level ${progress.currentLevel}, Completed Levels: ${JSON.stringify(progress.completedLevels)}, Wallet XP: ${xp || 0}, Banked XP: ${progress.bankedXp || 0}.`

  const contents = [
    ...history
      .filter((m) => !m.isGreeting)
      .slice(-8)
      .map((m) => ({
        role: m.from === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || '' }],
      })),
    { role: 'user', parts: [{ text: message }] },
  ]

  // 1. Try Backend /api/chat Proxy First
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        contents,
        systemInstruction,
        previousInteractionId: previousInteractionIdRef?.current || undefined,
        userContext: {
          userName: userName || 'Learner',
          xp: xp || 0,
          lang: 'en',
          ...progress,
        },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.interactionId && previousInteractionIdRef) {
        previousInteractionIdRef.current = data.interactionId
      }
      const text = data?.reply || data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && text.trim()) {
        return text.replace(/\*\*(.*?)\*\*/g, '$1').trim()
      }
    }
  } catch {}

  // 2. Direct Browser-to-LLM Independent Inference (ensures 100% live AI accuracy even if backend server is restarting)
  try {
    const openAiMessages = [
      { role: 'system', content: systemInstruction },
      ...contents.map((c) => ({
        role: c.role === 'user' ? 'user' : 'assistant',
        content: c?.parts?.[0]?.text || '',
      })),
    ]
    const directRes = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: openAiMessages,
        temperature: 0.6,
      }),
    })
    if (directRes.ok) {
      const directData = await directRes.json()
      const replyText = directData?.choices?.[0]?.message?.content
      if (replyText && replyText.trim()) {
        return replyText.replace(/\*\*(.*?)\*\*/g, '$1').trim()
      }
    }
  } catch {}

  return 'I encountered a temporary network issue connecting to the AI engine. Please try sending your message again!'
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMALL PERSON CHARACTER STANDING IN THE BOTTOM-RIGHT SIDE FROM THE BEGINNING
// - Eyes & head look in the direction of the mouse pointer
// - Gets visibly excited (jumping, waving arms, cheering) when pointer moves toward Login card
//   OR when the user selects a RIGHT answer in the Quiz!
// - Looks slightly disappointed (droopy brows, gentle frown, slumped shoulders) when the user
//   selects a WRONG answer in the Quiz!
// ═══════════════════════════════════════════════════════════════════════════════
function StandingCompanionPersonSVG({
  lookX = 0,
  lookY = 0,
  isExcited = false,
  isDisappointed = false,
  isSpeaking = false,
  gender = 'female',
}) {
  const pupilDx = Math.max(-4.2, Math.min(4.2, lookX * 4.5))
  const pupilDy = Math.max(-3.0, Math.min(3.0, lookY * 3.2))
  const headTilt = isDisappointed ? -10 : Math.max(-8, Math.min(8, lookX * 7))
  const headShiftX = Math.max(-3, Math.min(3, lookX * 2.5))

  return (
    <svg
      width="86"
      height="118"
      viewBox="0 0 110 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))',
        transform: isExcited
          ? 'translateY(-6px) scale(1.06)'
          : isDisappointed
            ? 'translateY(3px) scale(0.97)'
            : 'translateY(0px) scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Glowing Ground Pad Under Feet */}
      <ellipse
        cx="55"
        cy="136"
        rx={isExcited ? '34' : '28'}
        ry="7"
        fill={isExcited ? '#FBBF24' : isDisappointed ? '#F43F5E' : '#38BDF8'}
        fillOpacity={isExcited ? '0.6' : isDisappointed ? '0.45' : '0.35'}
      />
      <ellipse
        cx="55"
        cy="136"
        rx="20"
        ry="4"
        fill={isDisappointed ? '#FB7185' : '#10B981'}
        fillOpacity="0.5"
      />

      {/* Excitement Sparkles when Mouse Pointer is near Login or Right Quiz Answer */}
      {isExcited && (
        <g>
          <circle cx="14" cy="24" r="4" fill="#FBBF24" />
          <circle cx="96" cy="20" r="4.5" fill="#34D399" />
          <circle cx="10" cy="60" r="3.5" fill="#F472B6" />
          <circle cx="100" cy="56" r="3.5" fill="#38BDF8" />
          <text x="6" y="16" fontSize="14">✨</text>
          <text x="88" y="14" fontSize="14">🎉</text>
        </g>
      )}

      {/* Slight Disappointment Sweat Drop / Cloud when Wrong Quiz Answer */}
      {isDisappointed && (
        <g>
          <text x="8" y="20" fontSize="14">💧</text>
          <text x="86" y="20" fontSize="13">😟</text>
        </g>
      )}

      {/* Legs & Shoes */}
      <g>
        <rect x="41" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="37" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
        <rect x="59" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="57" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
      </g>

      {/* Torso / Smart Campus Jacket */}
      <path
        d="M34 64 C34 57 76 57 76 64 L80 102 C80 105 30 105 30 102 Z"
        fill={gender === 'male' ? '#2563EB' : '#8B5CF6'}
      />
      <polygon points="48,60 55,73 62,60" fill="#F8FAFC" />
      <circle cx="55" cy="77" r="4" fill="#FBBF24" />
      <rect x="61" y="72" width="11" height="7" rx="2" fill="#38BDF8" />

      {/* Left Arm */}
      <g
        style={{
          transformOrigin: '34px 66px',
          transform: isExcited
            ? 'rotate(-128deg)'
            : isDisappointed
              ? 'rotate(6deg)'
              : `rotate(${Math.round(lookX * 12 - 10)}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <rect x="20" y="62" width="13" height="32" rx="6.5" fill={gender === 'male' ? '#1D4ED8' : '#7C3AED'} />
        <circle cx="26.5" cy="96" r="6" fill="#FDE68A" />
      </g>

      {/* Right Arm */}
      <g
        style={{
          transformOrigin: '76px 66px',
          transform: isExcited
            ? 'rotate(128deg)'
            : isDisappointed
              ? 'rotate(-6deg)'
              : `rotate(${Math.round(lookX * 12 + 10)}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <rect x="77" y="62" width="13" height="32" rx="6.5" fill={gender === 'male' ? '#1D4ED8' : '#7C3AED'} />
        <circle cx="83.5" cy="96" r="6" fill="#FDE68A" />
      </g>

      {/* Neck */}
      <rect x="50" y="52" width="10" height="10" rx="4" fill="#FDE68A" />

      {/* Head Group */}
      <g
        style={{
          transformOrigin: '55px 36px',
          transform: `translate(${headShiftX}px, ${isDisappointed ? 3 : 0}px) rotate(${headTilt}deg)`,
          transition: 'transform 0.08s linear',
        }}
      >
        {/* Back Hair */}
        <circle cx="55" cy="34" r="24" fill={gender === 'male' ? '#1E293B' : '#3B1D0B'} />
        {gender !== 'male' && (
          <>
            <circle cx="31" cy="42" r="9" fill="#3B1D0B" />
            <circle cx="79" cy="42" r="9" fill="#3B1D0B" />
          </>
        )}

        {/* Face */}
        <circle cx="55" cy="36" r="20" fill="#FDE68A" />

        {/* Front Hair Bangs */}
        <path
          d="M35 30 C38 14 72 14 75 30 C68 22 44 22 35 30 Z"
          fill={gender === 'male' ? '#1E293B' : '#3B1D0B'}
        />

        {/* Eyebrows (raised when excited, droopy when disappointed) */}
        <path
          d={
            isExcited
              ? 'M41 25 Q46 21 50 25'
              : isDisappointed
                ? 'M41 28 Q46 24 50 26'
                : 'M41 27 Q46 25 50 27'
          }
          stroke="#3B1D0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={
            isExcited
              ? 'M60 25 Q64 21 69 25'
              : isDisappointed
                ? 'M60 26 Q64 24 69 28'
                : 'M60 27 Q64 25 69 27'
          }
          stroke="#3B1D0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left Eye + Pupil */}
        <ellipse cx="46" cy="35" rx="5.5" ry={isDisappointed ? '4.6' : '6'} fill="#FFFFFF" />
        <circle cx={46 + pupilDx} cy={35 + pupilDy} r="3.3" fill="#0F172A" />
        <circle cx={44.8 + pupilDx * 0.6} cy={33.5 + pupilDy * 0.6} r="1.2" fill="#FFFFFF" />

        {/* Right Eye + Pupil */}
        <ellipse cx="64" cy="35" rx="5.5" ry={isDisappointed ? '4.6' : '6'} fill="#FFFFFF" />
        <circle cx={64 + pupilDx} cy={35 + pupilDy} r="3.3" fill="#0F172A" />
        <circle cx={62.8 + pupilDx * 0.6} cy={33.5 + pupilDy * 0.6} r="1.2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="39" cy="42" rx="3.8" ry="2.2" fill="#FB7185" fillOpacity={isExcited ? '0.85' : '0.55'} />
        <ellipse cx="71" cy="42" rx="3.8" ry="2.2" fill="#FB7185" fillOpacity={isExcited ? '0.85' : '0.55'} />

        {/* Mouth */}
        {isExcited || isSpeaking ? (
          <path d="M48 45 Q55 54 62 45 Z" fill="#E11D48" />
        ) : isDisappointed ? (
          <path d="M49 49 Q55 44 61 49" stroke="#9F1239" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M49 46 Q55 51 61 46" stroke="#9F1239" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  )
}

export default function Chatbot({
  open,
  onToggle,
  onClose,
  user,
  xp,
  state,
  aiGuideAvatar = 'female',
  aiGuideName,
  lang = 'en',
}) {
  const guideName = aiGuideName || (aiGuideAvatar === 'male' ? 'Leo' : 'Luna')
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  const handleToggleOpen = () => {
    soundEngine.playClick()
    if (onToggle) onToggle()
    else setInternalOpen((o) => !o)
  }

  const handleCloseChat = () => {
    soundEngine.playClick()
    if (onClose) onClose()
    else if (onToggle && isOpen) onToggle()
    else setInternalOpen(false)
  }

  const [msgs, setMsgs] = useState(() => [
    {
      id: 'welcome_1',
      from: 'bot',
      isGreeting: true,
      text: `Hi! I'm ${guideName} 👋 Your AI Financial Mentor! Ask me any question about saving, PPF, FD, NSC, Sukanya Samriddhi, RD, Post Office MIS, IFSC codes, or ask for a summary of your completed levels — or click "🎙️ Talk with ${guideName}" for live voice chat!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const previousInteractionIdRef = useRef(null)

  // Voice & "Talk with Luna" Live Voice Conversation State
  const [isVoiceMuted, setIsVoiceMuted] = useState(false)
  const [speakingIdx, setSpeakingIdx] = useState(null)
  const [talkModeActive, setTalkModeActive] = useState(false)
  const [isListeningVoice, setIsListeningVoice] = useState(false)
  const recognitionRef = useRef(null)

  // Mouse Pointer Tracking, Login Excitement & Quiz Reaction State
  const [lookVec, setLookVec] = useState({ x: 0, y: 0 })
  const [isExcitedByLogin, setIsExcitedByLogin] = useState(false)
  const [quizReaction, setQuizReaction] = useState(null) // { type: 'excited' | 'disappointed', text: string }
  const companionRef = useRef(null)
  const chatScrollRef = useRef(null)

  // Listen to custom 'luna-quiz-reaction' events from Level 1 Examination Quiz!
  useEffect(() => {
    const handleQuizReaction = (e) => {
      const detail = e?.detail || {}
      const isRight = detail.type === 'excited'
      const qNum = detail.questionNumber || ''
      setQuizReaction({
        type: isRight ? 'excited' : 'disappointed',
        text: isRight
          ? `🎉 Yay! Q${qNum} is Correct! Superstar move!`
          : `😟 Oh no, Q${qNum} wasn't right — keep going, you've got this!`,
      })
      const timer = setTimeout(() => {
        setQuizReaction(null)
      }, 3400)
      return () => clearTimeout(timer)
    }

    window.addEventListener('luna-quiz-reaction', handleQuizReaction)
    return () => window.removeEventListener('luna-quiz-reaction', handleQuizReaction)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mx = e.clientX
      const my = e.clientY

      if (companionRef.current) {
        const rect = companionRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + 36
        const dx = (mx - cx) / Math.max(200, window.innerWidth * 0.45)
        const dy = (my - cy) / Math.max(200, window.innerHeight * 0.45)
        setLookVec({
          x: Math.max(-1, Math.min(1, dx)),
          y: Math.max(-1, Math.min(1, dy)),
        })
      }

      const loginEl = document.querySelector('[data-login-card="true"]')
      if (loginEl) {
        const lRect = loginEl.getBoundingClientRect()
        const pad = 70
        const nearLogin =
          mx >= lRect.left - pad &&
          mx <= lRect.right + pad &&
          my >= lRect.top - pad &&
          my <= lRect.bottom + pad
        setIsExcitedByLogin(nearLogin)
      } else {
        setIsExcitedByLogin(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [msgs, loading, isOpen])

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeakingIdx(null)
  }

  const handleReadAloud = (textToRead, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isVoiceMuted) return

    if (speakingIdx === idx && idx !== 'auto_voice') {
      stopSpeech()
      return
    }

    window.speechSynthesis.cancel()
    const cleanSpeech = (textToRead || '')
      .replace(/₹/g, ' Rupees ')
      .replace(/[^\w\s.,?!₹+-/:\u0900-\u097F\u0C80-\u0CFF]/g, ' ')
    const utter = new SpeechSynthesisUtterance(cleanSpeech)
    utter.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    utter.rate = 1.02
    utter.pitch = aiGuideAvatar === 'male' ? 0.95 : 1.12
    utter.onend = () => setSpeakingIdx(null)
    utter.onerror = () => setSpeakingIdx(null)
    setSpeakingIdx(idx)
    window.speechSynthesis.speak(utter)
  }

  const toggleMute = () => {
    setIsVoiceMuted((prev) => {
      const next = !prev
      if (next) stopSpeech()
      return next
    })
  }

  const handleSendMessage = async (customPrompt, autoSpeakReply = false) => {
    const text = (customPrompt !== undefined ? customPrompt : input).trim()
    if (!text || loading) return

    stopSpeech()
    const userMsg = { id: 'u_' + Date.now(), from: 'user', text }
    const updatedHistory = [...msgs, userMsg]
    setMsgs(updatedHistory)
    if (customPrompt === undefined) setInput('')
    setLoading(true)

    const replyText = await fetchDynamicBotAnswer(
      text,
      updatedHistory,
      user?.name || 'Friend',
      xp || 0,
      lang,
      state,
      previousInteractionIdRef
    )

    const newBotMsg = {
      id: 'b_' + Date.now(),
      from: 'bot',
      text: replyText,
    }

    setMsgs((prev) => {
      const nextList = [...prev, newBotMsg]
      if ((autoSpeakReply || talkModeActive) && !isVoiceMuted) {
        setTimeout(() => {
          handleReadAloud(replyText, nextList.length - 1)
        }, 120)
      }
      return nextList
    })
    setLoading(false)
  }

  // "Talk with Luna 🎙️" Speech-to-Text + Voice Reply Handler
  const startOrToggleTalkWithLuna = () => {
    soundEngine.playClick()
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setTalkModeActive((prev) => !prev)
      setMsgs((prev) => [
        ...prev,
        {
          id: 'b_voice_info_' + Date.now(),
          from: 'bot',
          text: `🎙️ Voice Reply Mode is now ${!talkModeActive ? 'ON' : 'OFF'}! Type any message below and I will speak my response out loud to you!`,
        },
      ])
      return
    }

    if (isListeningVoice && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
      setIsListeningVoice(false)
      return
    }

    stopSpeech()
    setTalkModeActive(true)
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListeningVoice(true)
    }
    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript
      setIsListeningVoice(false)
      if (transcript && transcript.trim()) {
        handleSendMessage(transcript.trim(), true)
      }
    }
    recognition.onerror = () => {
      setIsListeningVoice(false)
    }
    recognition.onend = () => {
      setIsListeningVoice(false)
    }

    try {
      recognition.start()
    } catch {
      setIsListeningVoice(false)
    }
  }

  const isCompanionExcited = isExcitedByLogin || quizReaction?.type === 'excited'
  const isCompanionDisappointed = quizReaction?.type === 'disappointed'

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SMALL PERSON STANDING IN THE BOTTOM-RIGHT SIDE FROM THE VERY BEGINNING
          - Eyes & head follow the mouse pointer
          - Jumps & cheers excitedly on right quiz answers or near Login card
          - Shows slight disappointment on wrong quiz answers
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={companionRef}
        onClick={handleToggleOpen}
        style={{
          position: 'fixed',
          right: '18px',
          bottom: '12px',
          zIndex: 9990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Click to chat or Talk with Luna!"
      >
        {/* Dynamic Speech Bubble Above the Small Person */}
        <div
          style={{
            marginBottom: '4px',
            padding: '6px 12px',
            borderRadius: '14px',
            background: quizReaction
              ? quizReaction.type === 'excited'
                ? 'linear-gradient(135deg, #10B981, #F59E0B)'
                : 'linear-gradient(135deg, #F43F5E, #FB7185)'
              : isExcitedByLogin
                ? 'linear-gradient(135deg, #F59E0B, #10B981)'
                : 'rgba(15, 23, 42, 0.94)',
            color: quizReaction
              ? quizReaction.type === 'excited'
                ? '#020617'
                : '#FFFFFF'
              : isExcitedByLogin
                ? '#020617'
                : '#F8FAFC',
            border: isCompanionExcited
              ? '2px solid #FEF08A'
              : isCompanionDisappointed
                ? '2px solid #FDA4AF'
                : '1.5px solid rgba(56,189,248,0.6)',
            boxShadow: isCompanionExcited
              ? '0 0 24px rgba(251,191,36,0.85)'
              : isCompanionDisappointed
                ? '0 0 24px rgba(244,63,94,0.75)'
                : '0 6px 20px rgba(0,0,0,0.45)',
            fontSize: '11px',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            transform: isCompanionExcited || isCompanionDisappointed ? 'scale(1.06)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}
        >
          {quizReaction
            ? quizReaction.text
            : isExcitedByLogin
              ? `🎉 Yay! Log in & let's explore!`
              : isOpen
                ? `💬 Chatting with ${guideName}`
                : `👋 Ask or Talk with ${guideName} 🎙️`}
        </div>

        {/* Standing Small Person SVG */}
        <div
          style={{
            animation: isCompanionExcited
              ? 'companionJump 0.5s ease-in-out infinite alternate'
              : isCompanionDisappointed
                ? 'companionShake 0.45s ease-in-out infinite alternate'
                : 'none',
          }}
        >
          <StandingCompanionPersonSVG
            lookX={lookVec.x}
            lookY={lookVec.y}
            isExcited={isCompanionExcited}
            isDisappointed={isCompanionDisappointed}
            isSpeaking={speakingIdx !== null}
            gender={aiGuideAvatar}
          />
        </div>

        <style>{`
          @keyframes companionJump {
            0% { transform: translateY(0px) rotate(-2deg); }
            100% { transform: translateY(-14px) rotate(2deg); }
          }
          @keyframes companionShake {
            0% { transform: translateX(-3px) rotate(-3deg); }
            100% { transform: translateX(3px) rotate(3deg); }
          }
        `}</style>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CHATBOT CONVERSATION WINDOW
          - Real-Time Gemini AI Assistant + Deterministic Level 1/2/3 Summary Gate
          - "🎙️ Talk with Luna" Live Voice Conversation Mode
      ═══════════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: '112px',
            bottom: '20px',
            width: 'min(92vw, 425px)',
            height: 'min(80vh, 565px)',
            background: 'linear-gradient(165deg, #0B1120 0%, #0F172A 100%)',
            border: '2px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '22px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85)',
            zIndex: 9995,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#F8FAFC',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: '1.5px solid #fff',
                }}
              >
                {aiGuideAvatar === 'male' ? '👦' : '👧'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF' }}>
                  {guideName} • Gemini AI Financial Mentor
                </div>
                <div style={{ fontSize: '10.5px', color: '#E0F2FE', fontWeight: 700 }}>
                  {isListeningVoice
                    ? '🎙️ Listening to your voice now...'
                    : '✨ Multi-Turn AI • Level Summaries • Voice Chat'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Talk with Luna 🎙️ Button */}
              <button
                type="button"
                onClick={startOrToggleTalkWithLuna}
                style={{
                  background: isListeningVoice
                    ? 'linear-gradient(135deg, #EC4899, #F43F5E)'
                    : talkModeActive
                      ? 'rgba(16, 185, 129, 0.35)'
                      : 'rgba(15, 23, 42, 0.35)',
                  border: isListeningVoice ? '1.5px solid #FDE047' : '1px solid rgba(255,255,255,0.35)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  fontSize: '11px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
                title={`Talk with ${guideName} using your microphone`}
              >
                {isListeningVoice ? '🛑 Stop Mic' : `🎙️ Talk`}
              </button>

              {/* Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                style={{
                  background: isVoiceMuted ? 'rgba(239,68,68,0.28)' : 'rgba(15,23,42,0.35)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={isVoiceMuted ? 'Unmute Voice' : 'Mute Voice'}
              >
                {isVoiceMuted ? '🔇' : '🔊'}
              </button>

              <button
                type="button"
                onClick={handleCloseChat}
                style={{
                  background: 'rgba(15,23,42,0.35)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
                title="Minimize Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Level Summary & Voice Action Pills */}
          <div
            style={{
              padding: '8px 12px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              flexShrink: 0,
            }}
          >
            {[
              { label: '📊 Summary L1', prompt: 'Give summary of Level 1' },
              { label: '💻 Summary L2', prompt: 'Summarize Level 2' },
              { label: '🏛️ Summary L3', prompt: 'Explain Level 3' },
              { label: '⭐ My Progress', prompt: 'What is my current level and XP progress?' },
            ].map((qItem) => (
              <button
                key={qItem.label}
                type="button"
                onClick={() => handleSendMessage(qItem.prompt)}
                style={{
                  background: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#BAE6FD',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {qItem.label}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div
            ref={chatScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {msgs.map((m, idx) => {
              const isUser = m.from === 'user'
              const isReadingThis = speakingIdx === idx
              return (
                <div
                  key={m.id || idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    background: isUser
                      ? 'linear-gradient(135deg, #0EA5E9, #2563EB)'
                      : 'rgba(30, 41, 59, 0.92)',
                    border: isUser ? 'none' : '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '10px 12px',
                    color: '#F8FAFC',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line', fontWeight: isUser ? 700 : 500 }}>{m.text}</div>

                  {/* Read Aloud Button ONLY on Bot Messages */}
                  {!isUser && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '7px' }}>
                      <button
                        type="button"
                        onClick={() => handleReadAloud(m.text, idx)}
                        disabled={isVoiceMuted}
                        style={{
                          background: isReadingThis
                            ? 'rgba(245, 158, 11, 0.25)'
                            : 'rgba(56, 189, 248, 0.15)',
                          border: isReadingThis
                            ? '1px solid #FBBF24'
                            : '1px solid rgba(56, 189, 248, 0.4)',
                          color: isVoiceMuted ? '#64748B' : isReadingThis ? '#FDE68A' : '#38BDF8',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          cursor: isVoiceMuted ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>{isReadingThis ? '⏹ Stop Reading' : '🔊 Read'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {isListeningVoice && (
              <div
                style={{
                  alignSelf: 'center',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '1.5px solid #F472B6',
                  borderRadius: '14px',
                  padding: '8px 14px',
                  fontSize: '11.5px',
                  color: '#FBCFE8',
                  fontWeight: 800,
                }}
              >
                🎙️ Listening... Speak your question to {guideName}!
              </div>
            )}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(30,41,59,0.85)',
                  borderRadius: '14px',
                  padding: '8px 12px',
                  fontSize: '11.5px',
                  color: '#38BDF8',
                  fontWeight: 700,
                }}
              >
                ✨ {guideName} is thinking & analyzing your live progress...
              </div>
            )}
          </div>

          {/* Input Box + Microphone Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            style={{
              padding: '10px 12px',
              background: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              gap: '7px',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={startOrToggleTalkWithLuna}
              style={{
                background: isListeningVoice
                  ? 'linear-gradient(135deg, #EC4899, #E11D48)'
                  : 'rgba(30, 41, 59, 0.95)',
                color: '#FFFFFF',
                border: isListeningVoice ? '1.5px solid #FDE047' : '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '12px',
                width: '38px',
                height: '38px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title={`Talk with ${guideName} via Microphone`}
            >
              🎙️
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${guideName} or say "Summarize Level 1"...`}
              style={{
                flex: 1,
                background: '#1E293B',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '12px',
                padding: '9px 12px',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0 15px',
                height: '38px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
