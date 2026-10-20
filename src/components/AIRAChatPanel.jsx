import React, { useState, useEffect, useRef, useMemo } from 'react'
import { apiRequest } from '../api.js'

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT RESOLVER: Infers rich, exact contextual details from App screen & state
// ─────────────────────────────────────────────────────────────────────────────
export function resolveAiraContext(screenName, appState = {}, extraContext = {}) {
  // If explicitly overridden by Level 1/2/3 sub-stage
  if (extraContext.currentPage) {
    return {
      currentPage: extraContext.currentPage,
      currentLevel: extraContext.currentLevel || 'Level 1',
      currentModule: extraContext.currentModule || extraContext.currentPage,
      role: extraContext.role || 'AI Mentor',
      badge: extraContext.badge || '🌸 AIRA',
      greeting: extraContext.greeting || 'How can I help you in this section?',
      suggestions: extraContext.suggestions || [
        'What is diversification?',
        'How does it apply here?',
        'Explain this concept in simple words',
      ],
    }
  }

  const s = screenName || 'garden'
  const userName = appState?.user?.name || 'Learner'

  switch (s) {
    case 'intermediate':
    case 'simulation':
      return {
        currentPage: 'Portfolio Simulation & Savings Lab',
        currentLevel: 'Level 2',
        currentModule: 'Portfolio Simulation',
        role: 'Portfolio & Savings Guide',
        badge: '💼 Level 2 Lab',
        greeting: "Need help understanding your portfolio or the simulation result? Ask me anything!",
        suggestions: [
          'What is diversification?',
          'How does diversification apply here?',
          'What are gap periods and how do I use them?',
          'How does Smart Allocation maximize profit?',
        ],
      }

    case 'advanced':
      return {
        currentPage: 'Banking Hub & Cabins',
        currentLevel: 'Level 3',
        currentModule: 'Real-World Banking',
        role: 'Banking & Safety Assistant',
        badge: '🏛️ Level 3 Bank',
        greeting: "You're exploring real-world banking! Need help with bank deposit slips or digital cyber safety?",
        suggestions: [
          'How do I fill out a bank deposit slip?',
          'What is a counterfoil and why keep it?',
          'What are the golden rules of digital banking safety?',
          'What should I do if someone asks for an OTP?',
        ],
      }

    case 'quiz':
      return {
        currentPage: 'Examination Center Quiz',
        currentLevel: 'Level 1',
        currentModule: 'Financial Knowledge Quiz',
        role: 'Quiz Guide',
        badge: '📝 Level 1 Exam',
        greeting: "Ready for the quiz? I can clarify financial terms if you need a quick concept refresher!",
        suggestions: [
          'Explain the difference between PPF and FD',
          'What does compounding frequency mean?',
          'Which savings schemes have sovereign guarantee?',
        ],
      }

    case 'video':
      return {
        currentPage: 'Classroom 101 Video Lessons',
        currentLevel: 'Level 1',
        currentModule: 'Video Lecture',
        role: 'Learning Mentor',
        badge: '🎥 Classroom 101',
        greeting: "Watching financial video lessons! Ask me anything about PPF, FD, or savings habits.",
        suggestions: [
          'Why is PPF called Triple Tax-Free (EEE)?',
          'What is inflation and how do savings beat it?',
          'What is the minimum lock-in period for PPF?',
        ],
      }

    case 'level-map':
    case 'dashboard':
      return {
        currentPage: 'Campus Route & Roadmap',
        currentLevel: 'Campus Overview',
        currentModule: 'Campus Navigation',
        role: 'Campus Guide',
        badge: '🗺️ Campus Map',
        greeting: `Welcome to your roadmap, ${userName}! Where would you like to explore next?`,
        suggestions: [
          'How do I unlock Level 2 and Level 3?',
          'How do I earn more XP and climb the rank list?',
          'Where are the 3 school garden stalls located?',
        ],
      }

    case 'auth':
      return {
        currentPage: 'Sign In / Log In',
        currentLevel: 'Welcome Gate',
        currentModule: 'Authentication',
        role: 'Welcome Companion',
        badge: '🌱 Welcome',
        greeting: "Welcome to Learn2Invest! Register your account or log in to continue your adventure.",
        suggestions: [
          'What will I learn in Learn2Invest?',
          'Do I get a certificate or XP as I progress?',
        ],
      }

    case 'garden':
    case 'beginner':
    default:
      return {
        currentPage: 'School Yard & Campus',
        currentLevel: 'Level 1',
        currentModule: 'School Campus',
        role: 'Campus Mentor',
        badge: '🏫 Level 1 School',
        greeting: "Welcome to the Learn2Invest 3D Campus! Where would you like to explore today?",
        suggestions: [
          'What is diversification?',
          'How do I enter Classroom 101?',
          'Where is the 24/7 ATM and Bank located?',
          'How do the garden stalls work?',
        ],
      }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI AIRA CHARACTER COMPONENT (Interactive Avatar that tracks cursor & gets excited)
// ─────────────────────────────────────────────────────────────────────────────
function AriaFigure({
  mouseX,
  mouseY,
  isExcited = false,
  customBubble = null,
  onClick,
}) {
  const figureRef = useRef(null)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!figureRef.current) return
    const rect = figureRef.current.getBoundingClientRect()
    const figureCenterX = rect.left + rect.width / 2
    const figureCenterY = rect.top + rect.height / 3

    const dx = mouseX - figureCenterX
    const dy = mouseY - figureCenterY
    const dist = Math.hypot(dx, dy) || 1

    // Clamp pupil offset between -3.5px and +3.5px
    const maxOffset = 3.5
    const px = Math.max(-maxOffset, Math.min(maxOffset, (dx / dist) * maxOffset))
    const py = Math.max(-2.5, Math.min(2.5, (dy / dist) * 2.5))

    setPupilOffset({ x: px, y: py })
  }, [mouseX, mouseY])

  return (
    <div
      ref={figureRef}
      onClick={onClick}
      className="relative flex flex-col items-center select-none cursor-pointer group"
      title="Click to chat with AIRA!"
    >
      {/* Dynamic Speech Bubble */}
      {(isExcited || customBubble) && (
        <div className="absolute -top-14 right-2 sm:right-0 px-3.5 py-1.5 rounded-2xl bg-white text-slate-900 border-2 border-pink-400 shadow-[0_8px_25px_rgba(244,114,182,0.6)] text-xs font-black whitespace-nowrap animate-bounce z-20">
          <span className="text-pink-600 font-extrabold mr-1">🌸</span>
          {customBubble || "Yay!! Login let's explore! 🎉"}
          {/* Little speech tail pointing down to Aria */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-400 rotate-45 transform" />
        </div>
      )}

      {/* 3D-styled SVG Cute Character: Aria standing with wavy hair, blazer & animated eyes */}
      <div
        className={`w-16 h-24 sm:w-20 sm:h-28 transition-transform duration-300 ${
          isExcited ? 'scale-110 -translate-y-2' : 'group-hover:scale-105'
        }`}
      >
        <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
          {/* Shadow beneath feet */}
          <ellipse cx="50" cy="132" rx="26" ry="6" fill="rgba(15,23,42,0.4)" />

          {/* Legs & Shoes */}
          <rect x="36" y="98" width="9" height="28" rx="4.5" fill="#334155" />
          <rect x="55" y="98" width="9" height="28" rx="4.5" fill="#334155" />
          {/* Cute Pink Shoes */}
          <ellipse cx="40" cy="126" rx="8" ry="4.5" fill="#f43f5e" />
          <ellipse cx="60" cy="126" rx="8" ry="4.5" fill="#f43f5e" />

          {/* Skirt / Outfit */}
          <path d="M 32 80 L 68 80 L 72 102 L 28 102 Z" fill="#6366f1" />

          {/* Torso / Pastel Mint & Coral Blazer */}
          <rect x="32" y="52" width="36" height="32" rx="8" fill="#10b981" />
          {/* Inner Shirt Collar */}
          <polygon points="50,68 42,52 58,52" fill="#ffffff" />
          <polygon points="50,72 45,52 55,52" fill="#fbcfe8" />
          {/* Gold Learn2Invest Crest Pin */}
          <circle cx="40" cy="62" r="3" fill="#fbbf24" />

          {/* Left & Right Arms */}
          {isExcited ? (
            /* Excited Waving Arms */
            <>
              <path d="M 32 58 Q 18 42 16 30" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="28" r="4.5" fill="#fbcfe8" />
              <path d="M 68 58 Q 82 42 84 30" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="84" cy="28" r="4.5" fill="#fbcfe8" />
            </>
          ) : (
            /* Normal Cute Pose (holding pink tablet/notebook) */
            <>
              <path d="M 32 58 Q 24 74 34 82" stroke="#10b981" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 68 58 Q 76 74 66 82" stroke="#10b981" strokeWidth="7" strokeLinecap="round" fill="none" />
              {/* Pink Tablet */}
              <rect x="42" y="74" width="16" height="12" rx="2" fill="#f472b6" />
              <rect x="44" y="76" width="12" height="8" rx="1" fill="#fdf2f8" />
            </>
          )}

          {/* Head & Neck */}
          <rect x="45" y="44" width="10" height="10" rx="3" fill="#fed7aa" />
          {/* Round Face */}
          <circle cx="50" cy="34" r="22" fill="#ffedd5" />

          {/* Rosy Cheeks */}
          <circle cx="34" cy="38" r="4.5" fill="#fecdd3" opacity="0.8" />
          <circle cx="66" cy="38" r="4.5" fill="#fecdd3" opacity="0.8" />

          {/* Eyes (Outer White Sclera) */}
          <ellipse cx="39" cy="33" rx="5" ry="6.5" fill="#ffffff" />
          <ellipse cx="61" cy="33" rx="5" ry="6.5" fill="#ffffff" />

          {/* Dynamic Pupils tracking mouse pointer! */}
          <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
            <ellipse cx="39" cy="33" rx="3.4" ry="4.2" fill="#1e1b4b" />
            <circle cx="40" cy="31.5" r="1.3" fill="#ffffff" />
            <ellipse cx="61" cy="33" rx="3.4" ry="4.2" fill="#1e1b4b" />
            <circle cx="62" cy="31.5" r="1.3" fill="#ffffff" />
          </g>

          {/* Cute Smile */}
          {isExcited ? (
            <path d="M 44 40 Q 50 48 56 40 Z" fill="#ef4444" />
          ) : (
            <path d="M 45 40 Q 50 45 55 40" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          )}

          {/* Stylish Wavy Brown Hair with Pink Flower Ribbon */}
          <path
            d="M 28 34 C 26 12, 74 12, 72 34 C 74 44, 76 56, 70 58 C 66 48, 64 36, 62 26 C 50 20, 38 24, 38 26 C 36 36, 34 48, 30 58 C 24 56, 26 44, 28 34 Z"
            fill="#451a03"
          />
          {/* Hair Bangs */}
          <path d="M 32 26 Q 50 16 68 26 Q 52 28 32 26 Z" fill="#78350f" />

          {/* Pink Sakura Flower Pin on Hair */}
          <g transform="translate(64, 18)">
            <circle cx="0" cy="0" r="5.5" fill="#f472b6" />
            <circle cx="-3" cy="-3" r="3.5" fill="#fb7185" />
            <circle cx="3" cy="-3" r="3.5" fill="#fb7185" />
            <circle cx="-3" cy="3" r="3.5" fill="#fb7185" />
            <circle cx="3" cy="3" r="3.5" fill="#fb7185" />
            <circle cx="0" cy="0" r="2.2" fill="#fef08a" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL AIRA CHAT PANEL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AIRAChatPanel({
  screen = 'garden',
  state = {},
  extraContext = null,
  forceOpen = false,
  isOpen: propIsOpen,
  onToggleOpen = null,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(() => {
    // Start open by default on wide screens so AIRA is immediately welcoming
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('l2i_aira_is_open')
      return saved !== null ? saved === 'true' : window.innerWidth >= 1280
    }
    return false
  })

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen

  const setIsOpen = (nextVal) => {
    const val = typeof nextVal === 'function' ? nextVal(isOpen) : nextVal
    if (propIsOpen === undefined) {
      setInternalIsOpen(val)
    }
    onToggleOpen?.(val)
  }

  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Mouse coordinates for tracking Aria's eyes
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHoveringLoginCard, setIsHoveringLoginCard] = useState(false)
  const speechBubbleTimerRef = useRef(null)

  // Conversational History persisted across pages
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('l2i_aira_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}

    return [
      {
        id: 'init_welcome',
        role: 'assistant',
        text: `🌸 **Hello! I'm AIRA, your AI Companion on Learn2Invest.**\n\nI am right here beside you across every single level, simulation, bank cabin, and quiz! Ask me anything—from *"What is diversification?"* to *"How do I fill a bank deposit slip?"* ✨`,
        timestamp: Date.now(),
      },
    ]
  })

  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Resolve current page context whenever screen, sub-stage or level changes
  const activeContext = useMemo(() => {
    return resolveAiraContext(screen, state, extraContext || {})
  }, [screen, state, extraContext])

  // Save chat history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('l2i_aira_chat_history', JSON.stringify(chatHistory))
    } catch {}
  }, [chatHistory])

  // Sync open state
  useEffect(() => {
    try {
      localStorage.setItem('l2i_aira_is_open', String(isOpen))
    } catch {}
  }, [isOpen])

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, isSending, isOpen])

  // Track mouse coordinates & check if mouse goes through sign-in / log-in box
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // Detect if hover target or any ancestor is a login/signin box
      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (target) {
        const loginCard = target.closest('[data-login-card="true"], [data-auth-card="true"], .login-box, form')
        if (loginCard) {
          setIsHoveringLoginCard(true)
          if (speechBubbleTimerRef.current) clearTimeout(speechBubbleTimerRef.current)
          return
        }
      }

      // If moved away from login box, decay after 1.8s
      if (isHoveringLoginCard) {
        if (!speechBubbleTimerRef.current) {
          speechBubbleTimerRef.current = setTimeout(() => {
            setIsHoveringLoginCard(false)
            speechBubbleTimerRef.current = null
          }, 1800)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (speechBubbleTimerRef.current) clearTimeout(speechBubbleTimerRef.current)
    }
  }, [isHoveringLoginCard])

  // Initialize SpeechRecognition for 🎙️ voice input
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRec) {
      setSpeechSupported(true)
      const rec = new SpeechRec()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-IN'

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }
        setIsListening(false)
      }

      rec.onerror = () => setIsListening(false)
      rec.onend = () => setIsListening(false)
      recognitionRef.current = rec
    }
  }, [])

  // Toggle voice recognition
  const toggleVoiceListening = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
      }
    }
  }

  // Text to Speech playback for AIRA's messages
  const speakMessage = (text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#_`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-IN'
    utterance.rate = 1.05
    utterance.pitch = 1.15
    window.speechSynthesis.speak(utterance)
  }

  // Send message to AIRA backend
  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim()
    if (!query || isSending) return

    const userMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
      page: activeContext.currentPage,
    }

    const updatedHistory = [...chatHistory, userMessage]
    setChatHistory(updatedHistory)
    setInputMessage('')
    setIsSending(true)

    try {
      const response = await apiRequest('/api/chat', 'POST', {
        message: query,
        history: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
        context: {
          currentPage: activeContext.currentPage,
          currentLevel: activeContext.currentLevel,
          currentModule: activeContext.currentModule,
          userName: state?.user?.name || 'Learner',
          userXp: state?.xp || 0,
        },
      })

      const replyText =
        response?.reply ||
        "🌸 I am here to help you learn smart investing! Feel free to ask another question."

      const assistantMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: Date.now(),
        page: activeContext.currentPage,
      }

      setChatHistory((prev) => [...prev, assistantMessage])

      if (voiceEnabled) {
        speakMessage(replyText)
      }
    } catch (err) {
      console.warn('AIRA chat error:', err)
      const fallbackReply = `🌸 **Diversification & Financial Guide:**\n\nI understand you're asking about: *"${query}"* on **${activeContext.currentPage}**!\n\nRemember: Spreading your savings across multiple instruments (like FD, PPF, and Gold) balances high returns with capital safety. What would you like to explore next? ✨`

      setChatHistory((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          text: fallbackReply,
          timestamp: Date.now(),
          page: activeContext.currentPage,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  // Clear chat conversation
  const handleClearHistory = () => {
    const reset = [
      {
        id: 'msg_reset',
        role: 'assistant',
        text: `🌸 Conversation reset! I'm ready for new questions on **${activeContext.currentPage}**. What would you like to know?`,
        timestamp: Date.now(),
      },
    ]
    setChatHistory(reset)
    sessionStorage.removeItem('l2i_aira_chat_history')
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          COLLAPSED STATE: Cute Standing Aria Person at Bottom-Right Corner
          - Follows mouse pointer with eyes!
          - Bounces with "Yay!! Login let's explore!" when mouse hovers login card
          - Click to expand chat panel
      ───────────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <aside
          aria-label="AIRA AI Companion Assistant"
          className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto"
        >
          {/* Standing Mini Character */}
          <AriaFigure
            mouseX={mousePos.x}
            mouseY={mousePos.y}
            isExcited={isHoveringLoginCard}
            onClick={() => setIsOpen(true)}
          />

          {/* Floating Pill Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-1 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-xs shadow-[0_10px_30px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/40 cursor-pointer"
          >
            <span className="text-base animate-spin" style={{ animationDuration: '6s' }}>
              🌸
            </span>
            <span>AIRA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </aside>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          EXPANDED STATE: DEDICATED RIGHT-SIDE CHAT PANEL
          - Stays anchored on the right side across ALL pages
          - Main page content stays accessible on the left
          - Real-time conversation with context-aware role badge
      ───────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <aside
          aria-label="AIRA AI Companion Panel"
          className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] lg:w-[380px] bg-slate-950/95 backdrop-blur-2xl border-l-2 border-pink-500/40 shadow-[-15px_0_50px_rgba(0,0,0,0.85)] flex flex-col text-white transition-all duration-300 pointer-events-auto select-none"
        >
          {/* 1. AIRA Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-900 to-pink-950/70 border-b border-pink-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center text-xl">
                  🌸
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black tracking-wide text-white leading-none">
                    AIRA
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-[10px] font-black text-pink-300 uppercase tracking-wider">
                    {activeContext.role}
                  </span>
                </div>
                <div className="text-[11px] font-extrabold text-slate-400 mt-0.5 flex items-center gap-1.5 truncate max-w-[210px]">
                  <span>📍</span>
                  <span className="truncate text-emerald-400 font-black">
                    {activeContext.currentPage}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  voiceEnabled ? 'bg-pink-500/20 text-pink-300 border border-pink-400/50' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={voiceEnabled ? 'Mute AIRA Voice' : 'Enable AIRA Voice'}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                🗑️
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
                title="Collapse AIRA Panel"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 2. Context Guidance Ribbon */}
          <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
            <span className="font-bold truncate text-slate-300">
              💡 {activeContext.greeting}
            </span>
          </div>

          {/* 3. Conversation Message Stream */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 select-text"
          >
            {chatHistory.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none font-medium'
                        : 'bg-slate-900/90 border border-pink-500/25 text-slate-100 rounded-tl-none font-normal'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10 text-[10px] font-black text-pink-300">
                        <span className="flex items-center gap-1">
                          <span>🌸</span>
                          <span>AIRA</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => speakMessage(msg.text)}
                          className="opacity-70 hover:opacity-100 cursor-pointer text-xs"
                          title="Read Aloud"
                        >
                          🔊
                        </button>
                      </div>
                    )}

                    {/* Markdown rendering with simple bold, bullets & paragraphs */}
                    <div className="whitespace-pre-wrap space-y-1.5">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.split('**').map((chunk, cIdx) =>
                            cIdx % 2 === 1 ? (
                              <strong key={cIdx} className="font-black text-amber-300">
                                {chunk}
                              </strong>
                            ) : (
                              chunk
                            )
                          )}
                        </p>
                      ))}
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-pink-300 text-xs font-bold bg-slate-900/80 p-3 rounded-2xl w-fit border border-pink-500/20 animate-pulse">
                <span>🌸</span>
                <span>AIRA is thinking & analyzing context...</span>
              </div>
            )}
          </div>

          {/* 4. Quick Contextual Prompt Suggestions */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {activeContext.suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-pink-500/20 hover:border-pink-400 border border-white/10 text-[10.5px] font-extrabold text-slate-300 hover:text-pink-200 whitespace-nowrap transition-all cursor-pointer shadow-sm"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* 5. Message Input Bar with 🎙️ Voice & Send */}
          <div className="p-3 bg-slate-900 border-t border-pink-500/30 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask AIRA on ${activeContext.currentPage}...`}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 focus:border-pink-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />

                {/* 🎙️ Voice Input Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceListening}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-ping'
                        : 'text-slate-400 hover:text-pink-300'
                    }`}
                    title={isListening ? 'Listening... click to stop' : 'Speak to AIRA (Voice Input)'}
                  >
                    🎙️
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className={`px-3.5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center ${
                  inputMessage.trim() && !isSending
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                ➤
              </button>
            </form>
          </div>
        </aside>
      )}
    </>
  )
}
