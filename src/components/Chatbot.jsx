import React, { useState, useRef, useEffect } from 'react'
import soundEngine from '../utils/soundEngine.js'
import { getFinancialKnowledgeAnswer } from '../data/financialKnowledge.js'
import {
  WEBSITE_INFO,
  SCREEN_KNOWLEDGE,
  getContextualSuggestions,
} from '../data/websiteKnowledge.js'

function getLiveProgressSnapshot(state, currentScreen) {
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
  const currentLevel = currentScreen === 'advanced' || currentScreen === 'futuristic-city' ? 3
    : currentScreen === 'intermediate' || currentScreen === 'simulation' || currentScreen === 'government-district' ? 2
    : (completedLevels.includes(2) ? 3 : completedLevels.includes(1) ? 2 : 1)

  const recentActions = []
  if ((stored.lessonsWatchedCount || state?.lessonsWatched?.length || 0) > 0) {
    recentActions.push(`Watched ${stored.lessonsWatchedCount || state?.lessonsWatched?.length}/5 classroom videos`)
  }
  if ((stored.quizAnsweredCount || 0) > 0 || (state?.quizScore || 0) > 0) {
    recentActions.push(`Quiz Score: ${stored.quizScore ?? state?.quizScore ?? 0}/10`)
  }
  if (stored.simCompleted || (state?.completedModules || []).length > 0) {
    recentActions.push(`Completed Modules: ${(state?.completedModules || []).join(', ') || 'Computer 1'}`)
  }
  if (stored.mixerCompleted) recentActions.push('Completed Savings Mixer Studio')
  if (stored.metricsCompleted) recentActions.push('Completed Portfolio Simulation')
  if (Array.isArray(stored.completedBankSections) && stored.completedBankSections.length > 0) {
    recentActions.push(`Completed Bank Cabins: ${stored.completedBankSections.join(', ')}`)
  }

  return {
    currentLevel,
    completedLevels,
    currentScreen: currentScreen || 'garden',
    lessonsWatchedCount: stored.lessonsWatchedCount ?? (state?.lessonsWatched?.length || 0),
    quizScore: stored.quizScore ?? (state?.quizScore || 0),
    bankedXp: stored.bankedXp ?? (state?.xp || 0),
    allocations: state?.allocations || { PPF: 30, FD: 25, NSC: 20, SSY: 15, RD: 10 },
    recentActions,
  }
}

// Extract interactive navigation buttons from bot response
function extractActionPills(text) {
  return []
}

// Formatted markdown text renderer with extra-large, ultra-readable typography (30-42px)
function FormattedMessage({ text, onActionClick }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let inTable = false
  let tableRows = []

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={key} style={{ overflowX: 'auto', margin: '22px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '28px', background: 'rgba(15,23,42,0.85)', borderRadius: '16px', overflow: 'hidden' }}>
            <tbody>
              {tableRows.map((r, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(148,163,184,0.35)' }}>
                  {r.map((cell, cIdx) => (
                    rIdx === 0 ? (
                      <th key={cIdx} style={{ padding: '18px 26px', textAlign: 'left', color: '#38BDF8', fontWeight: 900, background: 'rgba(15,23,42,0.95)', fontSize: '32px' }}>
                        {formatInline(cell)}
                      </th>
                    ) : (
                      <td key={cIdx} style={{ padding: '18px 26px', color: '#F1F5F9', fontSize: '28px' }}>
                        {formatInline(cell)}
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
    }
    inTable = false
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      if (!trimmed.includes('---')) {
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim())
        tableRows.push(cells)
      }
      return
    } else if (inTable) {
      flushTable(`table_${idx}`)
    }

    if (!trimmed) {
      elements.push(<div key={`empty_${idx}`} style={{ height: '16px' }} />)
      return
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h3_${idx}`} style={{ fontSize: '38px', fontWeight: 900, color: '#38BDF8', margin: '22px 0 12px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('### ', ''))}
        </h4>
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h2_${idx}`} style={{ fontSize: '42px', fontWeight: 900, color: '#FBBF24', margin: '24px 0 14px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('## ', ''))}
        </h3>
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h1_${idx}`} style={{ fontSize: '48px', fontWeight: 900, color: '#34D399', margin: '26px 0 16px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('# ', ''))}
        </h2>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const cleanText = trimmed.startsWith('• ') ? trimmed.slice(2) : trimmed.slice(2)
      elements.push(
        <div key={`bullet_${idx}`} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', margin: '14px 0', paddingLeft: '4px' }}>
          <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: '38px', lineHeight: '1.2' }}>•</span>
          <div style={{ flex: 1, fontSize: '34px', lineHeight: 1.6, fontWeight: 600 }}>{formatInline(cleanText)}</div>
        </div>
      )
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/)
      elements.push(
        <div key={`num_${idx}`} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', margin: '14px 0', paddingLeft: '4px' }}>
          <span style={{ color: '#FBBF24', fontWeight: 900, minWidth: '40px', fontSize: '34px' }}>{match[1]}.</span>
          <div style={{ flex: 1, fontSize: '34px', lineHeight: 1.6, fontWeight: 600 }}>{formatInline(match[2])}</div>
        </div>
      )
    } else {
      elements.push(
        <p key={`p_${idx}`} style={{ margin: '16px 0', lineHeight: 1.6, fontSize: '34px', color: '#F8FAFC', fontWeight: 600 }}>
          {formatInline(trimmed)}
        </p>
      )
    }
  })

  if (inTable) flushTable(`table_end`)

  return <div>{elements}</div>
}

function formatInline(str) {
  if (!str) return ''
  const parts = str.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#FFFFFF', fontWeight: 900 }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} style={{ color: '#7DD3FC', fontStyle: 'italic', fontWeight: 700 }}>
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 14px',
            borderRadius: '10px',
            color: '#F472B6',
            fontSize: '26px',
            fontFamily: 'monospace',
            fontWeight: 700,
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

// Pure Independent AI Chatbot Client — Project-Aware
async function fetchDynamicBotAnswer(
  message,
  history,
  userName,
  xp,
  lang,
  state,
  currentScreen,
  currentPath,
  previousInteractionIdRef
) {
  const progress = getLiveProgressSnapshot(state, currentScreen)

  // Primary: Google Gemini API Engine via /api/chat Proxy (Grounding & Reasoning)

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
        previousInteractionId: previousInteractionIdRef?.current || undefined,
        userContext: {
          userName: userName || 'Learner',
          xp: xp || 0,
          lang,
          currentScreen: currentScreen || 'garden',
          currentPath: currentPath || window.location.pathname || '/',
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
      if (
        text &&
        text.trim() &&
        !text.includes('I am here to help you navigate and master Learn2Invest')
      ) {
        return text.trim()
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat proxy error:', err)
  }

  // 2. Direct Browser-to-LLM Independent Inference
  try {
    const screenInfo = SCREEN_KNOWLEDGE[currentScreen] || SCREEN_KNOWLEDGE.garden
    const directSystemInstruction = `You are ${guideName || 'Luna'}, the intelligent, direct, concise AI Financial Mentor for Learn2Invest.
CRITICAL CHATBOT GUIDELINES:
- BE CONCISE, DIRECT, AND PRACTICAL. Act like a modern smart chatbot assistant, NOT a textbook.
- NEVER start responses with generic boilerplate like "Welcome to Learn2Invest" or "Learn2Invest is a risk-free simulator" unless asked.
- ANSWER IN THE VERY FIRST SENTENCE.
- WHEN A USER ASKS WHERE TO PUT OR INVEST AN AMOUNT (e.g. "I have 10000", "I have 19999", "where should I put", "where to invest"):
  * Give an INSTANT, PRACTICAL, SMART ASSET ALLOCATION BREAKDOWN calculating exact rupee amounts:
    1. 50% (~₹X) — Index Mutual Funds (e.g. Nifty 50) for long-term growth.
    2. 30% (~₹Y) — Safe Fixed Income (PPF 7.1% or FD 7.25%) for guaranteed capital protection.
    3. 20% (~₹Z) — Emergency Savings / Gold ETF for quick liquidity.
  * Keep it clean, direct, and focused strictly on the money. DO NOT mention [Level 2 Lab] or [Campus Map].
- Keep general responses short (under 120 words), clear, using bullet points, bold key terms, and Indian Rupee formatting (₹).
- DO NOT mention [Level 2 Lab] or [Campus Map] unless the user specifically asks how to navigate there.`

    // A. Direct Client-Side Gemini Engine (Powered by user's key)
    const clientKey = import.meta.env?.VITE_GEMINI_API_KEY
    if (clientKey) {
      const directModels = [
        'gemini-3.8-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
      ]
      for (const m of directModels) {
        try {
          const gemRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${clientKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(7000),
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: directSystemInstruction }] },
                contents: contents.map((c) => ({
                  role: c.role === 'model' || c.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: c?.parts?.[0]?.text || '' }],
                })),
                generationConfig: {
                  temperature: 0.65,
                  maxOutputTokens: 1000,
                },
              }),
            }
          )
          if (gemRes.ok) {
            const gemData = await gemRes.json()
            const gemText = gemData?.candidates?.[0]?.content?.parts?.[0]?.text
            if (gemText && gemText.trim()) {
              return gemText.trim()
            }
          }
        } catch {}
      }
    }

    // B. Fast Open Fallback
    const openAiMessages = [
      { role: 'system', content: directSystemInstruction },
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
        return replyText.trim()
      }
    }
  } catch {}

  // 3. Client-Side Comprehensive Financial Knowledge Engine
  const localKnowledgeAnswer = getFinancialKnowledgeAnswer(message, currentScreen)
  if (localKnowledgeAnswer) {
    return localKnowledgeAnswer
  }

  return `I am your Learn2Invest Website Assistant! 🎓
You are currently viewing **${SCREEN_KNOWLEDGE[currentScreen]?.title || 'Campus Entrance'}**.
You can ask me:
- *"What is ELSS or SIP?"*
- *"What is the difference between PPF and FD?"*
- *"How does the Savings Mixer work?"*
- *"How do I fill out a bank deposit slip?"*
- *"Golden rules of digital banking safety?"*
- *"How do I unlock Level 2?"*

How can I assist you right now?`
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// 3D AI ROBOT CHATBOT AVATAR (WAVING WITH HEADSET & FINANCIAL TABLET)
// ═══════════════════════════════════════════════════════════════════════════════
function StandingCompanionPersonSVG({
  width = 330,
  isExcited = false,
  isDisappointed = false,
}) {
  return (
    <div
      style={{
        width: typeof width === 'number' ? `min(${width}px, 34vw)` : width,
        maxWidth: '85vw',
        filter: isExcited
          ? 'drop-shadow(0 24px 48px rgba(0,0,0,0.85)) drop-shadow(0 0 36px rgba(56, 189, 248, 0.95))'
          : 'drop-shadow(0 20px 42px rgba(0,0,0,0.8)) drop-shadow(0 0 28px rgba(56, 189, 248, 0.6))',
        transform: isExcited
          ? 'translateY(-14px) scale(1.06)'
          : isDisappointed
            ? 'translateY(8px) scale(0.96)'
            : 'translateY(0px) scale(1)',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <img
        src="/images/ai_robot_chatbot.png"
        alt="AI Robot Financial Mentor"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT (LARGER, HIGH CONTRAST, RESPONSIVE)
// ═══════════════════════════════════════════════════════════════════════════════
export default function Chatbot({
  open,
  onToggle,
  onClose,
  user,
  xp,
  state,
  currentScreen = 'garden',
  currentPath = '/',
  go,
  openLeaderboard,
  openBadges,
  openReport,
  openProfile,
  openAvatarModal,
  aiGuideAvatar = 'male',
  aiGuideName,
  lang = 'en',
}) {
  const guideName = aiGuideName || (aiGuideAvatar === 'female' ? 'Luna' : 'Leo')
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleOpen = () => {
    soundEngine.playClick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
    if (!isOpen && !isVoiceMuted) {
      setTimeout(() => {
        handleReadAloud('Hey, how can I help you?', 'auto_welcome')
      }, 250)
    }
    if (onToggle) onToggle()
    else setInternalOpen((o) => !o)
  }

  const handleCloseChat = () => {
    soundEngine.playClick()
    stopSpeech()
    if (onClose) onClose()
    else if (onToggle && isOpen) onToggle()
    else setInternalOpen(false)
  }

  const initialGreeting = `👋 Hey! How can I help you?

Ask me any financial question about investing, Indian savings schemes, or banking procedures to get started!`

  const [msgs, setMsgs] = useState(() => [
    {
      id: 'welcome_1',
      from: 'bot',
      isGreeting: true,
      text: initialGreeting,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const previousInteractionIdRef = useRef(null)

  // Voice State
  const [isVoiceMuted, setIsVoiceMuted] = useState(false)
  const [speakingIdx, setSpeakingIdx] = useState(null)
  const [isListeningVoice, setIsListeningVoice] = useState(false)
  const recognitionRef = useRef(null)
  const hasSpokenWelcomeRef = useRef(false)

  // Mouse Pointer & Quiz Reaction State
  const [lookVec, setLookVec] = useState({ x: 0, y: 0 })
  const [isExcitedByLogin, setIsExcitedByLogin] = useState(false)
  const [quizReaction, setQuizReaction] = useState(null)
  const companionRef = useRef(null)
  const chatScrollRef = useRef(null)

  // Preload speech synthesis voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      const handleVoices = () => window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = handleVoices
      return () => {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Auto-speak "Hey, how can I help you?" when chatbot opens
  useEffect(() => {
    if (isOpen) {
      if (!hasSpokenWelcomeRef.current && !isVoiceMuted) {
        hasSpokenWelcomeRef.current = true
        const timer = setTimeout(() => {
          handleReadAloud('Hey, how can I help you?', 'auto_welcome')
        }, 300)
        return () => clearTimeout(timer)
      }
    } else {
      hasSpokenWelcomeRef.current = false
      stopSpeech()
    }
  }, [isOpen, isVoiceMuted])

  // Reset conversation handler
  const handleResetChat = () => {
    soundEngine.playClick()
    stopSpeech()
    previousInteractionIdRef.current = null
    setMsgs([
      {
        id: 'welcome_' + Date.now(),
        from: 'bot',
        isGreeting: true,
        text: initialGreeting,
      },
    ])
    if (!isVoiceMuted) {
      setTimeout(() => {
        handleReadAloud('Hey, how can I help you?', 'auto_welcome')
      }, 250)
    }
  }

  // Quiz reaction event listener
  useEffect(() => {
    const handleQuizReaction = (e) => {
      const detail = e?.detail || {}
      const isRight = detail.type === 'excited'
      const qNum = detail.questionNumber || ''
      setQuizReaction({
        type: isRight ? 'excited' : 'disappointed',
        text: isRight
          ? `🎉 Correct on Q${qNum}! Superstar move!`
          : `😟 Q${qNum} wasn't right — keep going!`,
      })
      const timer = setTimeout(() => {
        setQuizReaction(null)
      }, 3400)
      return () => clearTimeout(timer)
    }

    window.addEventListener('luna-quiz-reaction', handleQuizReaction)
    return () => window.removeEventListener('luna-quiz-reaction', handleQuizReaction)
  }, [])

  // Mouse cursor tracking
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
        const pad = 80
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
  }, [msgs, loading, isOpen, isExpanded])

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeakingIdx(null)
  }

  // Voice Selector: Picks natural female voice for Luna, or natural male voice for Leo
  const getGuideVoice = (voices, isFemale) => {
    if (!voices || voices.length === 0) return null

    const femaleKeywords = [
      'female', 'neerja', 'heera', 'zira', 'samantha', 'karen', 'victoria',
      'veena', 'priya', 'swara', 'eva', 'jenny', 'aria', 'sarah', 'natasha'
    ]
    const maleKeywords = [
      'male', 'david', 'ravi', 'mark', 'george', 'daniel', 'rishi',
      'guy', 'christopher', 'eric', 'brian', 'prabhat'
    ]

    const englishVoices = voices.filter(
      (v) => v.lang && v.lang.toLowerCase().startsWith('en')
    )
    const pool = englishVoices.length > 0 ? englishVoices : voices

    if (isFemale) {
      // 1. Try Indian English Female voice (e.g. Heera, Neerja, Veena)
      const inFemale = pool.find(
        (v) =>
          (v.lang === 'en-IN' || v.lang === 'en_IN') &&
          femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (inFemale) return inFemale

      // 2. Try any English Female voice (e.g. Zira, Jenny, Samantha)
      const anyEnFemale = pool.find(
        (v) =>
          femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw)) &&
          !maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (anyEnFemale) return anyEnFemale

      // 3. Fallback: filter out known male voices
      const nonMale = pool.find(
        (v) => !maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (nonMale) return nonMale

      return pool[0]
    } else {
      // 1. Try Indian English Male voice (e.g. Ravi, Rishi, Prabhat)
      const inMale = pool.find(
        (v) =>
          (v.lang === 'en-IN' || v.lang === 'en_IN') &&
          maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (inMale) return inMale

      // 2. Try any English Male voice (e.g. David, Mark, Guy)
      const anyEnMale = pool.find(
        (v) =>
          maleKeywords.some((kw) => v.name.toLowerCase().includes(kw)) &&
          !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (anyEnMale) return anyEnMale

      // 3. Fallback: find any voice with male keyword or default
      const maleVoice = pool.find((v) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      )
      if (maleVoice) return maleVoice

      return pool[0]
    }
  }

  const handleReadAloud = (textToRead, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isVoiceMuted) return

    if (speakingIdx === idx && idx !== 'auto_welcome') {
      stopSpeech()
      return
    }

    window.speechSynthesis.cancel()
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    const cleanSpeech = (textToRead || '')
      .replace(/₹/g, ' Rupees ')
      .replace(/p\.a\./gi, ' per annum ')
      .replace(/\[(.*?)\]/g, '$1')
      .replace(/[*#_`|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanSpeech) return

    const isGirl = aiGuideAvatar === 'female' || guideName.toLowerCase().includes('luna')
    const utter = new SpeechSynthesisUtterance(cleanSpeech)
    const allVoices = window.speechSynthesis.getVoices()
    const preferredVoice = getGuideVoice(allVoices, isGirl)

    if (preferredVoice) {
      utter.voice = preferredVoice
      utter.lang = preferredVoice.lang || (isGirl ? 'en-US' : 'en-IN')
    } else {
      utter.lang = isGirl ? 'en-US' : 'en-IN'
    }

    // Set distinctive, natural vocal pitch and rate:
    // Luna (Girl) = higher sweet pitch (1.28)
    // Leo (Boy) = deeper warm pitch (0.88)
    if (isGirl) {
      utter.pitch = 1.28
      utter.rate = 1.04
    } else {
      utter.pitch = 0.88
      utter.rate = 0.98
    }

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
      user?.name || 'Learner',
      xp || 0,
      lang,
      state,
      currentScreen,
      currentPath,
      previousInteractionIdRef
    )

    const newBotMsg = {
      id: 'b_' + Date.now(),
      from: 'bot',
      text: replyText,
    }

    setMsgs((prev) => {
      const nextList = [...prev, newBotMsg]
      if (autoSpeakReply && !isVoiceMuted) {
        setTimeout(() => {
          handleReadAloud(replyText, nextList.length - 1)
        }, 150)
      }
      return nextList
    })
    setLoading(false)
  }

  // Handle direct navigation when clicking action buttons inside chat
  const handleActionClick = (action) => {
    soundEngine.playClick()
    if (action.screen && go) {
      go(action.screen)
    } else if (action.modal === 'leaderboard' && openLeaderboard) {
      openLeaderboard()
    } else if (action.modal === 'badges' && openBadges) {
      openBadges()
    } else if (action.modal === 'report' && openReport) {
      openReport()
    } else if (action.modal === 'profile' && openProfile) {
      openProfile()
    }
  }

  // Voice Speech Recognition (Speech-to-Text)
  const startOrToggleTalk = () => {
    soundEngine.playClick()
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMsgs((prev) => [
        ...prev,
        {
          id: 'b_voice_info_' + Date.now(),
          from: 'bot',
          text: `🎙️ Voice input is not supported in this browser version. You can type any question, and tap the 🔊 Listen button on any response to hear it spoken aloud!`,
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

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.lang = 'en-IN'
      recognition.interimResults = true
      recognition.continuous = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListeningVoice(true)
      }

      recognition.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript
          } else {
            interim += event.results[i][0].transcript
          }
        }
        if (interim) {
          setInput(interim)
        }
        if (final && final.trim()) {
          setInput(final.trim())
          setIsListeningVoice(false)
          handleSendMessage(final.trim(), true)
        }
      }

      recognition.onerror = (e) => {
        console.warn('SpeechRecognition error:', e.error)
        setIsListeningVoice(false)
        if (e.error === 'not-allowed' || e.error === 'permission-denied') {
          setMsgs((prev) => [
            ...prev,
            {
              id: 'b_mic_err_' + Date.now(),
              from: 'bot',
              text: `⚠️ Microphone access was blocked. Please click the lock or camera icon in your browser URL bar and allow microphone permissions to speak with ${guideName}!`,
            },
          ])
        }
      }

      recognition.onend = () => {
        setIsListeningVoice(false)
      }

      recognition.start()
    } catch (err) {
      console.warn('Speech recognition start error:', err)
      setIsListeningVoice(false)
    }
  }

  const isCompanionExcited = isExcitedByLogin || quizReaction?.type === 'excited'
  const isCompanionDisappointed = quizReaction?.type === 'disappointed'

  // Dynamic suggested quick actions based on current screen
  const contextualSuggestions = getContextualSuggestions(currentScreen)
  const defaultStarters = [
    'Explain this website',
    'Where should I start?',
    'PPF vs Mutual Funds',
    'What is Repo Rate?',
    'How do I fill a bank slip?',
    'How to spot OTP scams?',
    'Save tax under Section 80C',
  ]
  const starterChips = Array.from(new Set([...contextualSuggestions, ...defaultStarters])).slice(0, 6)

  return (
    <>
      <style>{`
        /* Chat Launcher & Window Animations */
        .l2i-chat-launcher {
          position: fixed;
          right: 28px;
          bottom: 24px;
          z-index: 99998;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          cursor: pointer;
          user-select: none;
          filter: drop-shadow(0 20px 45px rgba(0,0,0,0.8));
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        body[data-video-fullscreen="true"] .l2i-chat-launcher {
          bottom: 108px;
          right: 20px;
          transform: scale(0.85);
          transform-origin: bottom right;
        }
        .l2i-chat-launcher:hover {
          transform: scale(1.04) translateY(-6px);
        }
        body[data-video-fullscreen="true"] .l2i-chat-launcher:hover {
          transform: scale(0.9) translateY(-6px);
        }

        .l2i-chat-window {
          position: fixed;
          top: 8px;
          bottom: 8px;
          right: 12px;
          width: min(1080px, calc(100vw - 24px));
          height: calc(100vh - 16px);
          max-height: calc(100vh - 16px);
          background: linear-gradient(165deg, #070D19 0%, #0D172A 100%);
          border: 4px solid rgba(56, 189, 248, 0.85);
          border-radius: 36px;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.98);
          z-index: 99999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #F8FAFC;
          font-family: 'Space Grotesk', 'Inter', -apple-system, sans-serif;
          animation: l2iSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .l2i-chat-window.expanded {
          width: calc(100vw - 16px);
          height: calc(100vh - 12px);
          max-height: calc(100vh - 12px);
          top: 6px;
          bottom: 6px;
          right: 8px;
        }

        @keyframes l2iSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes companionHover {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }

        @media (max-width: 640px) {
          .l2i-chat-window {
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 90vh !important;
            max-height: 92vh !important;
            border-radius: 20px 20px 0 0 !important;
            border-bottom: none !important;
          }
          .l2i-chat-launcher {
            right: 14px !important;
            bottom: 14px !important;
            transform: scale(0.75);
            transform-origin: bottom right;
          }
        }

        /* Large font & placeholder for chat input */
        .l2i-chat-input,
        .l2i-chat-window input[type="text"] {
          font-size: 28px !important;
          line-height: normal !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          background: #ffffff !important;
        }

        .l2i-chat-input::placeholder,
        .l2i-chat-window input[type="text"]::placeholder,
        .l2i-chat-input::-webkit-input-placeholder,
        .l2i-chat-window input[type="text"]::-webkit-input-placeholder,
        .l2i-chat-input::-moz-placeholder,
        .l2i-chat-window input[type="text"]::-moz-placeholder,
        .l2i-chat-input:-ms-input-placeholder,
        .l2i-chat-window input[type="text"]:-ms-input-placeholder {
          font-size: 26px !important;
          font-weight: 700 !important;
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          NORMAL CHATBOT LAUNCHER (VISIBLE WHEN CLOSED)
          - 3D AI Robot Waving Companion (Big, clear, engaging)
          - Large Speech bubble tooltip prompting user to ask questions
          - Clicking cleanly opens the chat window at this exact corner
      ═══════════════════════════════════════════════════════════════════════ */}
      {!isOpen && (
        <div
          ref={companionRef}
          onClick={handleToggleOpen}
          className="l2i-chat-launcher"
          title={`Click to chat with ${guideName}!`}
        >
          {/* Dynamic Large Speech Bubble */}
          <div
            style={{
              marginBottom: '14px',
              padding: '14px 28px',
              borderRadius: '36px',
              background: quizReaction
                ? quizReaction.type === 'excited'
                  ? 'linear-gradient(135deg, #10B981, #F59E0B)'
                  : 'linear-gradient(135deg, #F43F5E, #FB7185)'
                : isExcitedByLogin
                  ? 'linear-gradient(135deg, #F59E0B, #10B981)'
                  : 'rgba(15, 23, 42, 0.96)',
              color: quizReaction || isExcitedByLogin ? '#020617' : '#F8FAFC',
              border: isCompanionExcited
                ? '3px solid #FEF08A'
                : '3px solid rgba(56,189,248,0.85)',
              boxShadow: isCompanionExcited
                ? '0 0 32px rgba(251,191,36,0.95)'
                : '0 12px 36px rgba(0,0,0,0.7), 0 0 20px rgba(56, 189, 248, 0.4)',
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '28px' }}>💬</span>
            <span>
              {quizReaction
                ? quizReaction.text
                : isExcitedByLogin
                  ? `🎉 Log in & let's explore!`
                  : `Ask ${guideName} • AI Mentor 🎙️`}
            </span>
          </div>

          {/* Large 3D Robot Avatar */}
          <div
            style={{
              animation: isCompanionExcited
                ? 'companionJump 0.5s ease-in-out infinite alternate'
                : isCompanionDisappointed
                  ? 'companionShake 0.45s ease-in-out infinite alternate'
                  : 'companionHover 2.6s ease-in-out infinite alternate',
            }}
          >
            <StandingCompanionPersonSVG
              width={330}
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
              100% { transform: translateY(-16px) rotate(2deg); }
            }
            @keyframes companionShake {
              0% { transform: translateX(-4px) rotate(-3deg); }
              100% { transform: translateX(4px) rotate(3deg); }
            }
          `}</style>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          STANDARD MODERN CHATBOT WINDOW (DOCKED AT BOTTOM-RIGHT)
          - Large, screen-filling width and height with big typography
          - 3D AI Robot avatar with live pulsing online badge in header
          - Clear conversation stream with extra-large typography (25-36px)
          - Prominent control buttons and extra-large input/mic controls
      ═══════════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className={`l2i-chat-window ${isExpanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div
            style={{
              padding: '24px 32px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid rgba(56, 189, 248, 0.4)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '94px', height: '94px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #070D19 0%, #0F172A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3.5px solid #38BDF8',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.65)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/images/ai_robot_chatbot.png"
                    alt="AI Robot Mentor"
                    style={{
                      width: '86px', height: '86px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                {/* Live pulsing online badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '3px solid #0F172A',
                    boxShadow: '0 0 12px #10B981',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '42px', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '16px',
                    lineHeight: '1.25',
                  }}
                >
                  <span>{guideName}</span>
                  <span
                    style={{
                      fontSize: '24px',
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(99,102,241,0.25))',
                      border: '2.5px solid #38BDF8',
                      color: '#7DD3FC',
                      padding: '8px 24px',
                      borderRadius: '999px',
                      fontWeight: 900,
                    }}
                  >
                    ✨ Gemini AI Mentor
                  </span>
                </div>
                <div style={{ fontSize: '25px', color: '#93C5FD', fontWeight: 800, marginTop: '8px', lineHeight: '1.25' }}>
                  {isListeningVoice
                    ? '🎙️ Listening to your voice now...'
                    : '🟢 Online • Powered by Google Gemini AI'}
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Reset Chat */}
              <button
                type="button"
                onClick={handleResetChat}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  border: '2px solid rgba(255,255,255,0.35)',
                  color: '#E2E8F0',
                  borderRadius: '16px',
                  width: '68px', height: '68px', fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Clear chat and start fresh"
              >
                🔄
              </button>

              {/* Mute/Voice Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                style={{
                  background: isVoiceMuted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.14)',
                  border: isVoiceMuted ? '2px solid #EF4444' : '2px solid rgba(255,255,255,0.35)',
                  color: '#E2E8F0',
                  borderRadius: '16px',
                  width: '68px', height: '68px', fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={isVoiceMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isVoiceMuted ? '🔇' : '🔊'}
              </button>

              {/* Expand / Collapse */}
              <button
                type="button"
                onClick={() => setIsExpanded((p) => !p)}
                style={{
                  background: isExpanded ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.14)',
                  border: '2px solid rgba(255,255,255,0.35)',
                  color: '#E2E8F0',
                  borderRadius: '16px',
                  width: '68px', height: '68px', fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={isExpanded ? 'Normal size' : 'Expand window'}
              >
                {isExpanded ? '❐' : '⛶'}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseChat}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  border: '2px solid rgba(255,255,255,0.35)',
                  color: '#E2E8F0',
                  borderRadius: '16px',
                  width: '68px', height: '68px', fontSize: '32px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Close chat window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            ref={chatScrollRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {msgs.map((m, idx) => {
              const isUser = m.from === 'user'
              const isReadingThis = speakingIdx === idx
              return (
                <div key={m.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '95%',
                      background: isUser
                        ? 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)'
                        : 'rgba(15, 23, 42, 0.92)',
                      border: isUser ? 'none' : '2.5px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: isUser ? '26px 26px 8px 26px' : '26px 26px 26px 8px',
                      padding: '28px 36px', color: '#F8FAFC', fontSize: '34px',
                      fontWeight: isUser ? 700 : 500,
                      lineHeight: 1.6,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    <FormattedMessage text={m.text} onActionClick={handleActionClick} />

                    {/* Read Aloud Button on Bot Messages */}
                    {!isUser && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
                        <button
                          type="button"
                          onClick={() => handleReadAloud(m.text, idx)}
                          disabled={isVoiceMuted}
                          style={{
                            background: isReadingThis
                              ? 'rgba(245, 158, 11, 0.35)'
                              : 'rgba(56, 189, 248, 0.22)',
                            border: isReadingThis
                              ? '3px solid #F59E0B'
                              : '3px solid rgba(56, 189, 248, 0.7)',
                            color: isVoiceMuted ? '#64748B' : isReadingThis ? '#FDE68A' : '#7DD3FC',
                            borderRadius: '999px',
                            padding: '16px 38px', fontSize: '28px', fontWeight: 900,
                            cursor: isVoiceMuted ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                          }}
                        >
                          <span style={{ fontSize: '36px' }}>{isReadingThis ? '⏹' : '🔊'}</span>
                          <span>{isReadingThis ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Starter Suggestion Chips (only rendered right below the initial welcome message) */}
                  {m.isGreeting && msgs.length === 1 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginTop: '8px',
                        paddingLeft: '4px',
                      }}
                    >
                      {starterChips.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          style={{
                            background: 'rgba(30, 41, 59, 0.95)',
                            border: '2px solid rgba(56, 189, 248, 0.5)',
                            color: '#E0F2FE',
                            borderRadius: '999px',
                            padding: '14px 26px',
                            fontSize: '20px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#38BDF8'
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)'
                            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.95)'
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {isListeningVoice && (
              <div
                style={{
                  alignSelf: 'center',
                  background: 'rgba(236, 72, 153, 0.25)',
                  border: '2px solid #F472B6',
                  borderRadius: '20px',
                  padding: '14px 28px',
                  fontSize: '21px',
                  color: '#FBCFE8',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '28px' }}>🎙️</span>
                <span>Listening to your voice... Speak now!</span>
              </div>
            )}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2.5px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '22px',
                  padding: '14px 26px',
                  fontSize: '21px',
                  color: '#38BDF8',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <span>✨ {guideName} is thinking</span>
                <span style={{ display: 'inline-flex', gap: '6px' }}>
                  <span style={{ animation: 'blink 1.2s infinite', fontSize: '26px' }}>•</span>
                  <span style={{ animation: 'blink 1.2s infinite 0.2s', fontSize: '26px' }}>•</span>
                  <span style={{ animation: 'blink 1.2s infinite 0.4s', fontSize: '26px' }}>•</span>
                </span>
                <style>{`
                  @keyframes blink {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Bottom Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            style={{
              padding: '26px 32px 28px',
              background: 'rgba(15, 23, 42, 0.98)',
              borderTop: '3px solid rgba(148, 163, 184, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={startOrToggleTalk}
                style={{
                  background: isListeningVoice
                    ? 'linear-gradient(135deg, #EC4899, #E11D48)'
                    : 'rgba(30, 41, 59, 0.95)',
                  color: '#FFFFFF',
                  border: isListeningVoice
                    ? '3.5px solid #FDE047'
                    : '3px solid rgba(56, 189, 248, 0.65)',
                  borderRadius: '24px',
                  width: '98px',
                  height: '98px',
                  fontSize: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isListeningVoice ? '0 0 28px rgba(236,72,153,0.9)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title={isListeningVoice ? 'Stop listening' : 'Speak using microphone'}
              >
                {isListeningVoice ? '🛑' : '🎙️'}
              </button>

              {/* Text Input Box */}
              <input
                type="text"
                className="l2i-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListeningVoice
                    ? 'Listening to your speech...'
                    : `Ask anything about investing or this website...`
                }
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: isListeningVoice
                    ? '3.5px solid #EC4899'
                    : '3.5px solid rgba(56, 189, 248, 0.75)',
                  borderRadius: '24px',
                  padding: '20px 34px',
                  color: '#0F172A',
                  fontSize: '32px',
                  fontWeight: 800,
                  height: '98px',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0284C7, #2563EB)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '0 48px',
                  height: '98px',
                  fontSize: '30px',
                  fontWeight: 900,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !input.trim() ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 24px rgba(2,132,199,0.45)',
                }}
              >
                <span>Send</span>
                <span style={{ fontSize: '36px' }}>➤</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
