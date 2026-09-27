import { useState, useRef, useEffect } from 'react'
import { AI_AVATARS, CuteChibiAvatarSVG } from './AiAvatarSelector.jsx'
import soundEngine from '../utils/soundEngine.js'

const QUICK_CHIPS = [
  { icon: '🌱', label: 'What is SIP?', prompt: 'What is SIP and how does ₹500/month grow?' },
  { icon: '🏛️', label: 'Explain PPF', prompt: 'Explain Public Provident Fund (PPF) and its benefits' },
  { icon: '📄', label: 'Difference between FD & RD', prompt: 'What is the difference between FD and RD?' },
  { icon: '%', label: 'Tax saving options', prompt: 'What are the best Section 80C tax saving options?' },
]

function getSystemInstruction(userName, currentScreen, avatarName, xp = 0) {
  return `You are "${avatarName || 'Luna'}", the official Learn2Invest AI Assistant ("Your Personal Investment Learning Guide").
The user's name is ${userName || 'Friend'} and they currently have ${xp} XP.
Give clear, structured, beginner-friendly financial explanations with Indian Rupee (₹) examples (SIP, PPF, FD, RD, Section 80C, digital banking safety). Keep responses concise (90-140 words).`
}

async function fetchGeminiAssistantReply(message, history, systemInstruction, customApiKey) {
  const storedKey =
    customApiKey ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') ||
    ''

  let startIdx = 0
  while (startIdx < history.length && history[startIdx].from !== 'user') {
    startIdx++
  }
  const filteredHistory = history.slice(startIdx).slice(-8)

  const contents = [
    ...filteredHistory.map((m) => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.plainText || m.text || '' }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction, apiKey: storedKey }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    }
  } catch {}

  if (storedKey) {
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${storedKey}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 450 },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return text
        }
      } catch {}
    }
  }

  return null
}

// Build structured card data matching Reference Image 2
function buildStructuredAnswer(message, geminiText) {
  const lower = message.toLowerCase()
  const amountMatch = message.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i)
  const parsedAmt = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : null

  if (/sip|systematic|500|month/i.test(lower)) {
    const monthly = parsedAmt && parsedAmt >= 100 ? parsedAmt : 500
    const calcSip = (yrs) => {
      const n = yrs * 12
      const r = 0.12 / 12
      const fv = Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r))
      const inv = monthly * n
      return {
        period: `${yrs} years`,
        invested: `₹${inv.toLocaleString('en-IN')}`,
        value: `₹${fv.toLocaleString('en-IN')}`,
        gain: `₹${(fv - inv).toLocaleString('en-IN')}`,
      }
    }
    const rows = [calcSip(5), calcSip(10), calcSip(20)]
    return {
      intro: 'Great question! Let me explain ✨',
      heading: 'What is SIP?',
      body:
        geminiText ||
        `A Systematic Investment Plan (SIP) is a way to invest a fixed amount regularly (like ₹${monthly.toLocaleString('en-IN')} every month) in a mutual fund. It helps you build wealth over time with the power of compounding.`,
      tableTitle: `How does ₹${monthly.toLocaleString('en-IN')}/month grow?`,
      tableHeaders: ['Time Period', 'Total Invested', 'Estimated Value (at 12% annual return)', 'Total Gain'],
      tableRows: rows.map((r) => [r.period, r.invested, r.value, r.gain]),
      tip: `The earlier you start, the more you benefit from compounding. Even small amounts like ₹${monthly.toLocaleString('en-IN')}/month can grow significantly over time!`,
      plainText: `What is SIP? A Systematic Investment Plan is a way to invest a fixed amount like ${monthly} rupees every month in a mutual fund. In 5 years, ${rows[0].invested} grows to ${rows[0].value}. In 10 years, ${rows[1].invested} grows to ${rows[1].value}. In 20 years, ${rows[2].invested} grows to ${rows[2].value}. The earlier you start, the more you benefit from compounding.`,
    }
  }

  if (/ppf|provident/i.test(lower)) {
    return {
      intro: 'Great question! Let me explain ✨',
      heading: 'What is Public Provident Fund (PPF)?',
      body:
        geminiText ||
        'Public Provident Fund (PPF) is a 100% Government-backed long-term savings scheme offering 7.1% p.a. interest with complete EEE (Exempt-Exempt-Exempt) tax-free status under Section 80C.',
      tableTitle: 'How does ₹1,000/month (₹12,000/yr) grow in PPF?',
      tableHeaders: ['Time Period', 'Total Invested', 'Estimated Value (at 7.1% p.a.)', 'Tax-Free Gain'],
      tableRows: [
        ['5 years', '₹60,000', '₹73,900', '₹13,900'],
        ['10 years', '₹1,20,000', '₹1,78,200', '₹58,200'],
        ['15 years', '₹1,80,000', '₹3,25,457', '₹1,45,457'],
      ],
      tip: 'PPF has a 15-year lock-in and zero market risk, making it the safest pillar of your long-term portfolio!',
      plainText:
        'Public Provident Fund (PPF) is a government-backed savings scheme offering 7.1 percent tax-free interest under Section 80C. Over 15 years, 1,000 rupees per month grows to 3,25,457 rupees completely tax-free.',
    }
  }

  if (/fd|rd|fixed deposit|recurring/i.test(lower)) {
    return {
      intro: 'Here is a clear comparison! ✨',
      heading: 'Difference Between FD & RD',
      body:
        geminiText ||
        'Both Fixed Deposit (FD) and Recurring Deposit (RD) are safe bank deposits that pay guaranteed interest (~6.8% to 7.1% p.a.), but they differ in how you deposit money.',
      tableTitle: 'FD vs RD Quick Comparison',
      tableHeaders: ['Feature', 'Fixed Deposit (FD)', 'Recurring Deposit (RD)', 'Best For'],
      tableRows: [
        ['Deposit Style', 'One-time Lump Sum', 'Fixed Monthly Installment', 'Disciplined Savers'],
        [' ₹60,000 over 5 yrs', '₹60,000 upfront', '₹1,000 / month × 60 mos', 'Guaranteed Returns'],
        ['Maturity Value', '₹84,100', '₹71,650', '+6.8% to 7.1% Safe'],
      ],
      tip: 'Use an FD when you already have a lump sum saved up, and choose an RD when you want to save a fixed amount from your monthly pocket money or salary!',
      plainText:
        'Fixed Deposit (FD) is for investing a lump sum all at once, while a Recurring Deposit (RD) lets you invest a fixed amount every month. Both offer safe guaranteed bank returns around 6.8 to 7.1 percent.',
    }
  }

  if (/tax|80c/i.test(lower)) {
    return {
      intro: 'Smart thinking! Let me explain ✨',
      heading: 'Top Section 80C Tax Saving Options',
      body:
        geminiText ||
        'Under Section 80C of the Income Tax Act, you can reduce your taxable income by up to ₹1,50,000 every year by investing in approved wealth-building instruments.',
      tableTitle: 'Comparison of Section 80C Investments',
      tableHeaders: ['Instrument', 'Lock-in Period', 'Typical Return', 'Risk Level'],
      tableRows: [
        ['ELSS Tax-Saver Fund', '3 years (Shortest)', '12% – 14% p.a.', 'Moderate (Market)'],
        ['PPF (Provident Fund)', '15 years', '7.1% p.a. (Tax-Free)', 'Zero (Sovereign)'],
        ['5-Year Tax-Saver FD', '5 years', '6.8% – 7.2% p.a.', 'Very Low (Bank)'],
      ],
      tip: 'Combining PPF for safety and ELSS for growth gives you the best balance of tax savings and wealth creation!',
      plainText:
        'Under Section 80C, you can save tax on up to 1.5 Lakh rupees per year using ELSS mutual funds with a 3-year lock-in, PPF with 7.1 percent tax-free returns, or a 5-year Tax-Saver Bank FD.',
    }
  }

  const cleanText = (
    geminiText ||
    `Investing regularly helps your savings beat inflation and grow exponentially over time. Start with an emergency fund in a Bank FD, build safe tax-free wealth in PPF (7.1%), and grow long-term wealth through a monthly Mutual Fund SIP!`
  )
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim()

  return {
    intro: 'Great question! Let me explain ✨',
    heading: 'Smart Financial Insight',
    body: cleanText,
    tableTitle: 'How Monthly Investing Builds Wealth (at 12% p.a.)',
    tableHeaders: ['Time Period', 'Total Invested (₹1,000/mo)', 'Estimated Value', 'Total Gain'],
    tableRows: [
      ['5 years', '₹60,000', '₹81,496', '₹21,496'],
      ['10 years', '₹1,20,000', '₹1,93,292', '₹73,292'],
      ['20 years', '₹2,40,000', '₹5,46,815', '₹3,06,815'],
    ],
    tip: 'Consistency beats timing the market! Starting early lets compound interest do the heavy lifting for you.',
    plainText: cleanText,
  }
}

export default function Chatbot({
  open,
  onToggle,
  onClose,
  user,
  xp,
  currentScreen,
  aiGuideAvatar = 'female',
  aiGuideName,
  lang = 'en',
}) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name || 'Luna'

  const [msgs, setMsgs] = useState([
    {
      from: 'bot',
      isGreeting: true,
      text: `Hi! I'm ${guideName} ✨\nAsk me anything about investments, savings, banking, or personal finance!`,
      plainText: `Hi! I am ${guideName}. Ask me anything about investments, savings, banking, or personal finance!`,
    },
    {
      from: 'user',
      text: 'What is SIP and how does ₹500/month grow?',
    },
    {
      from: 'bot',
      card: buildStructuredAnswer('What is SIP and how does ₹500/month grow?', null),
      plainText: buildStructuredAnswer('What is SIP and how does ₹500/month grow?', null).plainText,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [speakingIdx, setSpeakingIdx] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')

  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [msgs, open, typing])

  // ONLY reads aloud when the user explicitly clicks the "Read" option!
  const handleReadAloud = (textToRead, idx) => {
    soundEngine.playClick()
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel()
      setSpeakingIdx(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = (textToRead || '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[*#_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.98
    utterance.pitch = aiGuideAvatar === 'female' ? 1.08 : 0.96

    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length > 0) {
        const preferred =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (aiGuideAvatar === 'female'
                ? v.name.includes('Female') ||
                  v.name.includes('Zira') ||
                  v.name.includes('Google US English') ||
                  v.name.includes('Samantha')
                : v.name.includes('Male') || v.name.includes('David') || v.name.includes('George'))
          ) || voices.find((v) => v.lang.startsWith('en'))
        if (preferred) utterance.voice = preferred
      }
    }

    utterance.onend = () => setSpeakingIdx(null)
    utterance.onerror = () => setSpeakingIdx(null)
    setSpeakingIdx(idx)
    window.speechSynthesis.speak(utterance)
  }

  const stopAllSpeech = () => {
    soundEngine.playClick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeakingIdx(null)
  }

  // Asking a question ONLY displays the answer — it NEVER auto-reads aloud!
  const send = async (textOverride) => {
    const t = (textOverride !== undefined ? textOverride : input).trim()
    if (!t) return
    soundEngine.playClick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setSpeakingIdx(null)
    }

    const history = msgs
    setMsgs((m) => [...m, { from: 'user', text: t }])
    setInput('')
    setTyping(true)

    const sysInstruction = getSystemInstruction(user?.name, currentScreen, guideName, xp)
    const geminiReply = await fetchGeminiAssistantReply(t, history, sysInstruction, apiKey)
    setTyping(false)

    const card = buildStructuredAnswer(t, geminiReply)
    setMsgs((m) => [
      ...m,
      {
        from: 'bot',
        card,
        plainText: card.plainText,
      },
    ])
  }

  const handleVoiceMicInput = () => {
    soundEngine.playClick()
    if (typeof window === 'undefined') return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'

      let finalTranscript = ''
      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join('')
        finalTranscript = transcript
        setInput(transcript)
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => {
        setIsListening(false)
        if (finalTranscript.trim()) {
          send(finalTranscript.trim())
        }
      }
      recognition.start()
    } catch {
      setIsListening(false)
    }
  }

  if (!open) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 2.4vh, 28px)',
          right: 'clamp(16px, 2.4vw, 28px)',
          zIndex: 99999,
          fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
        }}
      >
        <button
          onClick={() => {
            soundEngine.playClick()
            if (onToggle) onToggle()
          }}
          onMouseEnter={() => soundEngine.playHover()}
          style={{
            minHeight: 58,
            padding: '8px 20px 8px 10px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 50%, #db2777 100%)',
            border: '2px solid rgba(244, 114, 182, 0.9)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(88, 28, 135, 0.6)',
          }}
          title="Open Learn2Invest AI Assistant"
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #f472b6',
              flexShrink: 0,
            }}
          >
            <CuteChibiAvatarSVG type={aiGuideAvatar} size={38} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>
              {guideName.toUpperCase()} · GEMINI ✨
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fbcfe8' }}>
              Investment Learning Guide
            </div>
          </div>
        </button>
      </div>
    )
  }

  const latestBotIdx = (() => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].from === 'bot') return i
    }
    return 0
  })()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'clamp(12px, 2vh, 22px)',
        right: 'clamp(12px, 2vw, 22px)',
        zIndex: 99999,
        width: 'clamp(360px, 42vw, 560px)',
        maxWidth: 'calc(100vw - 20px)',
        height: 'clamp(540px, 82vh, 740px)',
        maxHeight: 'calc(100vh - 24px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 28,
        background: 'linear-gradient(180deg, #f6f2ff 0%, #fcfaff 100%)',
        border: '2.5px solid #d8b4fe',
        boxShadow: '0 24px 80px rgba(46, 16, 101, 0.45)',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
        color: '#1e1b4b',
      }}
    >
      {/* ─── TOP HEADER BAR (Matching Reference Image 2) ─── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2e1065 0%, #3b0764 55%, #1e1b4b 100%)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          color: '#ffffff',
          borderBottom: '2px solid rgba(216, 180, 254, 0.35)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fce7f3, #e9d5ff)',
              border: '2.5px solid #f472b6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(244, 114, 182, 0.55)',
              flexShrink: 0,
            }}
          >
            <CuteChibiAvatarSVG type={aiGuideAvatar} size={44} />
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: '0.4px',
                color: '#fbcfe8',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>{guideName.toUpperCase()} · GEMINI</span>
              <span>✨</span>
            </div>
            <div style={{ fontSize: 12, color: '#e9d5ff', fontWeight: 600 }}>
              Your Personal Investment Learning Guide
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#cbd5e1',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginTop: 2,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span>Online · Voice & Text</span>
            </div>
          </div>
        </div>

        {/* Header Action Pills: Chat Count, Read / Muted Toggle, Key, Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #f472b6, #c084fc)',
              color: '#2e1065',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>💬</span>
            <span>Chat ({msgs.length})</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (speakingIdx !== null) {
                stopAllSpeech()
              } else {
                const msg = msgs[latestBotIdx]
                if (msg) handleReadAloud(msg.plainText || msg.text, latestBotIdx)
              }
            }}
            style={{
              background: speakingIdx !== null ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.12)',
              border: speakingIdx !== null ? '1.5px solid #34d399' : '1.5px solid rgba(255, 255, 255, 0.28)',
              color: '#ffffff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            title="Click Read to hear the answer aloud, or click to mute/stop"
          >
            <span>{speakingIdx !== null ? '🔊' : '🔇'}</span>
            <span>{speakingIdx !== null ? 'Reading...' : 'Muted (Click to Read)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowKeyModal((k) => !k)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#fde047',
              width: 34,
              height: 34,
              borderRadius: '50%',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Configure Gemini API Key"
          >
            🔑
          </button>

          <button
            type="button"
            onClick={() => {
              stopAllSpeech()
              if (onClose) onClose()
            }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              width: 34,
              height: 34,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close Assistant"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Input */}
      {showKeyModal && (
        <div
          style={{
            padding: '10px 16px',
            background: '#ede9fe',
            borderBottom: '1px solid #c4b5fd',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              localStorage.setItem('gemini_api_key', e.target.value)
            }}
            placeholder="Paste Gemini API Key (optional)..."
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1.5px solid #c4b5fd',
              borderRadius: 10,
              padding: '6px 10px',
              color: '#1e1b4b',
              fontSize: 12,
            }}
          />
          <button
            onClick={() => setShowKeyModal(false)}
            style={{
              background: '#7c3aed',
              border: 'none',
              color: '#ffffff',
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* ─── SCROLLABLE MESSAGE LIST (Matching Reference Image 2) ─── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {msgs.map((m, idx) => {
          if (m.from === 'user') {
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
                    color: '#3b0764',
                    padding: '10px 18px',
                    borderRadius: '20px 20px 4px 20px',
                    fontSize: 14,
                    fontWeight: 800,
                    maxWidth: '80%',
                    boxShadow: '0 4px 14px rgba(244, 114, 182, 0.25)',
                  }}
                >
                  {m.text}
                </div>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: '#fbcfe8',
                    border: '2px solid #f472b6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  👤
                </div>
              </div>
            )
          }

          if (m.isGreeting) {
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#f3e8ff',
                    border: '2px solid #d8b4fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CuteChibiAvatarSVG type={aiGuideAvatar} size={34} />
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e9d5ff',
                    borderRadius: '18px 18px 18px 4px',
                    padding: '12px 16px',
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: '#1e1b4b',
                    fontWeight: 600,
                    maxWidth: '78%',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.08)',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                </div>
              </div>
            )
          }

          const card = m.card
          const isReadingThis = speakingIdx === idx

          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#f3e8ff',
                  border: '2px solid #d8b4fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CuteChibiAvatarSVG type={aiGuideAvatar} size={34} />
              </div>

              <div
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1.5px solid #e9d5ff',
                  borderRadius: 22,
                  padding: '14px 16px',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.1)',
                }}
              >
                {/* Top Intro Row + Explicit "Read" Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b' }}>
                    {card?.intro || 'Great question! Let me explain ✨'}
                  </div>

                  {/* Read Aloud Button — ONLY reads when clicked! */}
                  <button
                    type="button"
                    onClick={() => handleReadAloud(m.plainText, idx)}
                    style={{
                      background: isReadingThis
                        ? 'linear-gradient(135deg, #ef4444, #db2777)'
                        : 'linear-gradient(135deg, #f3e8ff, #fce7f3)',
                      border: isReadingThis ? '1.5px solid #ef4444' : '1.5px solid #d8b4fe',
                      color: isReadingThis ? '#ffffff' : '#6b21a8',
                      borderRadius: 999,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      flexShrink: 0,
                    }}
                    title="Click to read this answer aloud"
                  >
                    <span>{isReadingThis ? '⏹️' : '🔊'}</span>
                    <span>{isReadingThis ? 'Stop Reading' : 'Read'}</span>
                  </button>
                </div>

                {/* Inner Structured Card (Rupee Bag + Heading + Explanation) */}
                <div
                  style={{
                    background: '#fdfaff',
                    border: '1px solid #f3e8ff',
                    borderRadius: 16,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      border: '1.5px solid #f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    💰
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#1e1b4b', marginBottom: 4 }}>
                      {card?.heading}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>
                      {card?.body}
                    </div>
                  </div>
                </div>

                {/* Growth / Comparison Table (Matching Image 2) */}
                {card?.tableRows && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#1e1b4b', marginBottom: 8 }}>
                      {card.tableTitle}
                    </div>
                    <div
                      style={{
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '1.5px solid #f3e8ff',
                      }}
                    >
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: 12.5,
                          textAlign: 'center',
                        }}
                      >
                        <thead>
                          <tr style={{ background: '#fae8ff', color: '#3b0764' }}>
                            {card.tableHeaders.map((th, i) => (
                              <th
                                key={i}
                                style={{
                                  padding: '8px 6px',
                                  fontWeight: 800,
                                  borderRight: i < card.tableHeaders.length - 1 ? '1px solid #f3e8ff' : 'none',
                                }}
                              >
                                {th}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {card.tableRows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              style={{
                                background: rIdx % 2 === 0 ? '#ffffff' : '#fdfaff',
                                borderTop: '1px solid #f3e8ff',
                              }}
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  style={{
                                    padding: '8px 6px',
                                    fontWeight: cIdx === 0 || cIdx >= 2 ? 800 : 600,
                                    color:
                                      cIdx === 3
                                        ? '#16a34a'
                                        : cIdx === 2
                                          ? '#1e1b4b'
                                          : '#334155',
                                    borderRight: cIdx < row.length - 1 ? '1px solid #f3e8ff' : 'none',
                                  }}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Lightbulb Tip Box (Matching Image 2) */}
                {card?.tip && (
                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 12,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 12.5,
                      color: '#1e3a8a',
                      fontWeight: 700,
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>💡</span>
                    <span>{card.tip}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CuteChibiAvatarSVG type={aiGuideAvatar} size={32} />
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e9d5ff',
                borderRadius: 16,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                color: '#6b21a8',
              }}
            >
              ✨ {guideName} is preparing your answer...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ─── QUICK TOPIC PILLS & BOTTOM INPUT BAR (Matching Reference Image 2) ─── */}
      <div
        style={{
          padding: '10px 16px 14px',
          background: '#f5f0ff',
          borderTop: '1.5px solid #e9d5ff',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 10,
            scrollbarWidth: 'none',
          }}
        >
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => send(chip.prompt)}
              style={{
                whiteSpace: 'nowrap',
                background: '#ffffff',
                border: i === 0 ? '1.5px solid #ec4899' : '1.5px solid #ddd6fe',
                color: '#1e1b4b',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(139, 92, 246, 0.08)',
              }}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffffff',
            border: '1.5px solid #d8b4fe',
            borderRadius: 999,
            padding: '6px 8px 6px 16px',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.1)',
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.55 }}>📎</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your investment question here..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: '#1e1b4b',
              fontSize: 13.5,
              fontWeight: 600,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleVoiceMicInput}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: 'none',
              background: isListening ? '#fee2e2' : 'transparent',
              color: isListening ? '#dc2626' : '#db2777',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Speak your question"
          >
            🎤
          </button>
          <button
            type="button"
            onClick={() => send()}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #f472b6, #d946ef)',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217, 70, 239, 0.4)',
            }}
            title="Send question"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
