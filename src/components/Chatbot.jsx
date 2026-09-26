import { useState, useRef, useEffect } from 'react'
import { AI_AVATARS } from './AiAvatarSelector.jsx'

const BEGINNER_PROMPTS = [
  "What is SIP and how does it work?",
  "What is lump sum investment?",
  "Difference between SIP and lump sum",
  "Is mutual fund safe?",
  "What is insurance or LIC?",
]

const INTERMEDIATE_PROMPTS = [
  "How to earn monthly income?",
  "I have 50000 rupees, where should I invest?",
  "What is SWP and STP?",
  "What is stock trading?",
  "What is portfolio diversification?",
]

const ADVANCED_PROMPTS = [
  "What is a capital asset?",
  "Difference between short and long term capital assets?",
  "How does tax-saving under 80C work?",
  "How to build a diversified portfolio?",
  "Explain capital gains tax in India",
]

function getQuickPrompts(currentScreen) {
  if (['intermediate', 'simulation', 'int-complete'].includes(currentScreen)) {
    return INTERMEDIATE_PROMPTS
  }
  if (['advanced', 'unlock-adv', 'adv-result'].includes(currentScreen)) {
    return ADVANCED_PROMPTS
  }
  return BEGINNER_PROMPTS
}

function generateDynamicAiReply(message, userName, screen, guideName) {
  const m = message.trim()
  const name = userName || 'Learner'
  const bot = guideName || 'AI Guide'
  
  const isGreeting = /^(hi|hello|hey|namaste|greetings)\b/i.test(m)
  const isWhereToInvest = /where\s*(should\s*i|to)?\s*invest|where\s*to\s*put|how\s*to\s*invest|have\s*\d+|invest\s*\d+/i.test(m)
  
  if (isGreeting) {
    return `👋 **Namaste ${name}! I'm ${bot}, your AI Investment Tutor & Voice Assistant.**\n\nHow can I help you accelerate your financial journey today? Ask me any question or select a topic to get started!`
  }

  if (isWhereToInvest) {
    return `🏛️ **${bot}'s Top Recommended Investment Avenues for ${name}:**\n\nHere are the best Government-backed & Market schemes in India to start investing:\n\n1. **Public Provident Fund (PPF)**: 7.1% p.a. guaranteed, tax-free interest backed by Govt of India (Section 80C).\n2. **Post Office Savings Schemes (POMIS / NSC)**: 7.7% p.a. risk-free fixed income schemes with sovereign safety.\n3. **SIP in Index Mutual Funds**: Start from just ₹500/month for long-term equity compounding (12-15% historical returns).\n4. **Sukanya Samriddhi Yojana (SSY)**: 8.2% p.a. highest-yielding scheme for girl child education & savings.\n5. **Sovereign Gold Bonds (SGB) & Bank FDs**: 2.5% extra annual interest + gold price appreciation with zero default risk.\n\n📌 **Smart Tip:** Always maintain 3 to 6 months of emergency savings in a liquid bank account before locking capital into long-term schemes!`
  }

  let topicSummary = ''
  if (/sip/i.test(m)) topicSummary = 'Systematic Investment Plans (SIP) allow disciplined cost-averaging and wealth compounding over time from as little as ₹500/month.'
  else if (/swp/i.test(m)) topicSummary = 'Systematic Withdrawal Plans (SWP) provide regular monthly cash flow while keeping funds invested.'
  else if (/stp/i.test(m)) topicSummary = 'Systematic Transfer Plans (STP) shift capital gradually from liquid/debt funds to equity funds to manage market timing risk.'
  else if (/lump\s*sum/i.test(m)) topicSummary = 'Lump sum investing deploys capital all at once, optimal when market valuations are favorable for long-term horizons.'
  else if (/mutual fund|mf/i.test(m)) topicSummary = 'Mutual funds pool investor resources across diversified stocks and bonds under professional SEBI-regulated management.'
  else if (/tax|80c|elss|ppf/i.test(m)) topicSummary = 'Section 80C tax optimization provides up to ₹1.5 lakh deductions via PPF, ELSS, NSC, and SSY government schemes.'
  else if (/stock|trading|share/i.test(m)) topicSummary = 'Direct stock investing offers high equity growth potential, best complemented by index funds and disciplined risk management.'
  else if (/portfolio|diversif/i.test(m)) topicSummary = 'Strategic portfolio diversification distributes capital across equities, debt, and liquid reserves based on your risk tolerance.'
  else topicSummary = `wealth building, asset allocation, and smart investment principles tailored to your goals.`

  return `🤖 **${bot}'s AI Insights for ${name}:**\n\n💡 **Core AI Takeaway:** ${topicSummary}\n\n📌 **Smart Strategy:**\n1. Establish clear short-term vs long-term investment horizons.\n2. Balance guaranteed fixed-income assets (PPF/NSC) with inflation-beating equity growth (Index Funds).\n3. Rebalance your portfolio periodically as your financial goals evolve.\n\n💬 Feel free to ask follow-up questions or test scenarios in our Investment Lab!`
}

function getSystemInstruction(userName, currentScreen, avatarName) {
  let level = 'Beginner'
  if (['intermediate', 'simulation', 'int-complete'].includes(currentScreen)) {
    level = 'Intermediate'
  } else if (['advanced', 'unlock-adv', 'adv-result'].includes(currentScreen)) {
    level = 'Advanced'
  }

  return `You are ${avatarName || 'Luna'}, an AI financial education and guidance mentor for Indian users in the Learn2Invest platform.
The user's name is ${userName || 'Learner'}. They are currently learning at the "${level}" tier of the app. Personalize responses by addressing them by name occasionally. Provide clear, dynamic, actionable financial insights. When asked where to invest, suggest specific Indian government schemes (PPF, NSC, Post Office Schemes, SSY, SGB) and low-cost SIP mutual funds. Do NOT start responses with boilerplate like "Regarding your prompt".`
}

async function getGeminiReply(message, history, systemInstruction, apiKey) {
  try {
    let startIdx = 0
    while (startIdx < history.length && history[startIdx].from !== 'user') {
      startIdx++
    }
    const filteredHistory = history.slice(startIdx).slice(-10)

    const contents = [
      ...filteredHistory.map(m => ({
        role: m.from === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const storedKey = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction, apiKey: storedKey }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    return text || null
  } catch (err) {
    return null
  }
}

export default function Chatbot({ open, onToggle, onClose, user, xp, currentScreen, aiGuideAvatar = 'female', aiGuideName, themeMode = 'dark', lang = 'en' }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name
  const isLight = themeMode === 'light'

  const [msgs, setMsgs] = useState([{
    from: 'bot',
    text: `👋 **Namaste! I'm ${guideName}, your AI Investment Guide & Voice Assistant!**\n\nAsk me anything about investing in India — SIP, mutual funds, PPF, tax saving, and more. Use voice input or text to chat! 🎙️🚀`
  }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const [speakingIdx, setSpeakingIdx] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [autoVoice, setAutoVoice] = useState(false)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [])

  const speakText = (text, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel()
      setSpeakingIdx(null)
      return
    }
    window.speechSynthesis.cancel()
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[*#_~`]/g, '')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.95
    utterance.pitch = aiGuideAvatar === 'female' ? 1.05 : 0.95
    if (lang === 'hi') utterance.lang = 'hi-IN'

    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => (
          lang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en')
        ) && (
          aiGuideAvatar === 'female'
            ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Kalpana'))
            : (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Hemant'))
        )) || voices.find(v => lang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en'))
        if (preferredVoice) utterance.voice = preferredVoice
      }
    }

    utterance.onend = () => setSpeakingIdx(null)
    utterance.onerror = () => setSpeakingIdx(null)
    setSpeakingIdx(idx)
    window.speechSynthesis.speak(utterance)
  }

  const toggleListening = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please use Google Chrome, Microsoft Edge, or Safari.')
      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
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

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0].transcript)
          .join('')
        setInput(transcript)
      }

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      console.error('Speech recognition start failed:', err)
      setIsListening(false)
    }
  }

  useEffect(() => {
    if (open) {
      setMsgs(prev => {
        const welcomeText = user
          ? `👋 **Namaste ${user.name}! I'm ${guideName}, your AI Investment Guide & Voice Assistant!**\n\nYou currently have **${xp} XP**. Ask me anything using text or voice! 🎙️🚀`
          : `👋 **Namaste! I'm ${guideName}, your AI Investment Guide & Voice Assistant!**\n\nAsk me anything using text or voice! 🎙️🚀`
        
        if (prev.length === 1 && prev[0].from === 'bot') {
          return [{ from: 'bot', text: welcomeText }]
        }
        return prev
      })
    }
  }, [open, user, xp, guideName])

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [msgs, open])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const clearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setSpeakingIdx(null)
    }
    setMsgs([{
      from: 'bot',
      text: user
        ? `👋 **Chat reset! Namaste ${user.name}! How can ${guideName} help you now?**`
        : `👋 **Chat reset! How can ${guideName} help you now?**`
    }])
  }

  const send = async (text) => {
    const t = (text || input).trim()
    if (!t) return
    const history = msgs
    setMsgs(m => [...m, { from: 'user', text: t }])
    setInput('')
    setTyping(true)

    const systemInstruction = getSystemInstruction(user?.name, currentScreen, guideName)
    const geminiText = await getGeminiReply(t, history, systemInstruction, apiKey)
    setTyping(false)

    const dynamicFallback = generateDynamicAiReply(t, user?.name, currentScreen, guideName)
    const replyText = geminiText || dynamicFallback

    setMsgs(m => {
      const newMsgs = [...m, { from: 'bot', text: replyText }]
      if (autoVoice) {
        setTimeout(() => speakText(replyText, newMsgs.length - 1), 150)
      }
      return newMsgs
    })
  }

  const formatText = (text) => {
    const lines = text.split('\n')
    const elements = []
    let listBuffer = []
    let listType = null

    const flushList = (key) => {
      if (listBuffer.length > 0) {
        if (listType === 'ul') {
          elements.push(<ul key={key} style={{ margin: '6px 0', paddingLeft: '20px' }}>{listBuffer}</ul>)
        } else if (listType === 'ol') {
          elements.push(<ol key={key} style={{ margin: '6px 0', paddingLeft: '20px' }}>{listBuffer}</ol>)
        }
        listBuffer = []
        listType = null
      }
    }

    const parseInlineMarkdown = (str) => {
      let html = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const boldColor = isLight ? '#b45309' : '#fbbf24'
      html = html.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong style="color: ${boldColor}; font-weight: 800;">${b}</strong>`)
      return html
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) { flushList(`flush-empty-${index}`); return }

      const isBullet = /^[*\-•]\s+/.test(trimmed)
      const isNumbered = /^\d+\.\s+/.test(trimmed)

      if (isBullet) {
        if (listType !== 'ul') { flushList(`flush-b-${index}`); listType = 'ul' }
        const itemText = trimmed.replace(/^[*\-•]\s+/, '')
        listBuffer.push(
          <li key={`li-${index}`} style={{ margin: '4px 0', fontSize: '13px', lineHeight: 1.5, color: isLight ? '#0f172a' : undefined }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(itemText) }} />
          </li>
        )
      } else if (isNumbered) {
        if (listType !== 'ol') { flushList(`flush-n-${index}`); listType = 'ol' }
        const itemText = trimmed.replace(/^\d+\.\s+/, '')
        listBuffer.push(
          <li key={`li-${index}`} style={{ margin: '4px 0', fontSize: '13px', lineHeight: 1.5, color: isLight ? '#0f172a' : undefined }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(itemText) }} />
          </li>
        )
      } else {
        flushList(`flush-p-${index}`)
        elements.push(
          <p key={index} style={{ margin: '6px 0', lineHeight: 1.5, fontSize: '13px', color: isLight ? '#0f172a' : undefined }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }} />
          </p>
        )
      }
    })

    flushList('flush-end')
    return elements
  }

  const currentPrompts = getQuickPrompts(currentScreen)

  if (!open) {
    return (
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 8,
        fontFamily: "'Space Grotesk', sans-serif"
      }}>
        {/* Launcher Floating Circular Button */}
        <button
          onClick={onToggle || onClose}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            border: '3px solid #38bdf8',
            color: '#ffffff', fontSize: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(2, 132, 199, 0.7)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
          }}
          title={`Chat with ${guideName} (Voice Assistant Active)`}
        >
          {activeAvatar.icon}
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: '#10b981', color: '#fff',
            fontSize: 10, fontWeight: 900, padding: '2px 6px',
            borderRadius: 10, border: '2px solid #080705',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            letterSpacing: '0.5px'
          }}>
            🎙️ AI
          </div>
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
      width: 400, maxWidth: 'calc(100vw - 32px)',
      height: '78vh', maxHeight: 660,
      display: 'flex', flexDirection: 'column',
      borderRadius: 24,
      background: 'var(--bg-card, rgba(18, 16, 12, 0.96))',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '2.5px solid #d97706',
      boxShadow: 'var(--card-shadow, 0 24px 80px rgba(0,0,0,0.95))',
      overflow: 'hidden',
      animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      transformOrigin: 'bottom right',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, #d97706, #f59e0b)',
        color: '#080705',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        borderBottom: '2px solid #fbbf24',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: '#080705', color: '#fbbf24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900,
          }}>
            {activeAvatar.icon}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, fontFamily: "'Bebas Neue', 'Space Grotesk', sans-serif", letterSpacing: '1px', color: '#080705' }}>
              {guideName.toUpperCase()} · VOICE & AI TUTOR
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#080705' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1a1610' }}>🎙️ Voice Assistant Active</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setAutoVoice(prev => !prev)}
            title={autoVoice ? "Auto-Read Responses: ON" : "Auto-Read Responses: OFF"}
            style={{
              background: autoVoice ? '#080705' : 'rgba(8,7,5,0.15)',
              border: '1px solid #080705',
              borderRadius: 8,
              padding: '4px 8px',
              color: autoVoice ? '#fbbf24' : '#080705',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {autoVoice ? '🔊 Auto Voice ON' : '🔇 Auto Voice OFF'}
          </button>
          
          <button
            onClick={clearChat}
            title="Clear Conversation"
            style={{
              background: '#080705',
              border: 'none',
              borderRadius: 8,
              padding: '4px 8px',
              color: '#fbbf24',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            🗑️ Clear
          </button>
          <button onClick={onClose} style={{
            background: '#080705', border: 'none',
            borderRadius: 8, width: 28, height: 28,
            color: '#fbbf24', cursor: 'pointer', fontSize: 14, fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--bg-main, #080705)',
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.from === 'bot' && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f59e0b', color: '#080705', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0 }}>
                {activeAvatar.icon}
              </div>
            )}
            <div style={{
              maxWidth: '84%', padding: '10px 14px',
              borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              fontSize: 13, lineHeight: 1.5, fontWeight: 600,
              background: m.from === 'user'
                ? 'linear-gradient(135deg, #d97706, #ea580c)'
                : (isLight ? '#ffffff' : 'var(--input-bg, rgba(255,255,255,0.05))'),
              color: m.from === 'user' ? '#ffffff' : (isLight ? '#0f172a' : 'var(--text-main, #fef3c7)'),
              boxShadow: m.from === 'user'
                ? '0 4px 12px rgba(245,158,11,0.3)'
                : (isLight ? '0 4px 14px rgba(0,0,0,0.06)' : 'none'),
              border: m.from === 'bot' 
                ? (isLight ? '1.5px solid rgba(234, 88, 12, 0.35)' : '1.5px solid rgba(217, 119, 6, 0.25)') 
                : 'none',
            }}>
              {m.from === 'bot' ? formatText(m.text) : m.text}

              {m.from === 'bot' && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => speakText(m.text, i)}
                    style={{
                      background: speakingIdx === i ? '#ea580c' : (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.15)'),
                      border: `1px solid ${speakingIdx === i ? '#c2410c' : (isLight ? '#ea580c' : '#f59e0b')}`,
                      borderRadius: 8,
                      padding: '4px 10px',
                      color: speakingIdx === i ? '#ffffff' : (isLight ? '#c2410c' : 'var(--gold-amber, #fbbf24)'),
                      fontSize: 11,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                    title="Listen to AI Voice Assistant"
                  >
                    <span>{speakingIdx === i ? '🔊 Speaking... (Click to stop)' : '🔊 Read Out Loud (Voice Assistant)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f59e0b', color: '#080705', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900 }}>
              {activeAvatar.icon}
            </div>
            <div style={{ padding: '10px 16px', background: 'var(--input-bg, rgba(255,255,255,0.05))', borderRadius: '18px 18px 18px 4px', border: '1.5px solid rgba(217,119,6,0.25)' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', opacity: 0.6, animation: `typingDot 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts Ticker */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(217,119,6,0.2)',
        background: 'var(--bg-card-deep, #12100c)',
        overflowX: 'auto',
        display: 'flex', gap: 8, flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        {currentPrompts.map((p,i) => (
          <button key={i} onClick={() => send(p)} className="sticker-badge sticker-yellow" style={{
            whiteSpace: 'nowrap', fontSize: 10, cursor: 'pointer', flexShrink: 0, padding: '4px 10px',
          }}>{p.length > 28 ? p.slice(0,28)+'…' : p}</button>
        ))}
      </div>

      {/* Listening Status Alert */}
      {isListening && (
        <div style={{
          padding: '6px 14px',
          background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: 8,
          flexShrink: 0
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
            🎙️ Voice Assistant Listening... Speak your question clearly!
          </span>
          <button
            type="button"
            onClick={toggleListening}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
          >Stop ✕</button>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 14px',
        background: 'var(--bg-card-deep, #12100c)',
        borderTop: '1px solid rgba(217,119,6,0.2)',
        display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center'
      }}>
        {/* Voice Input Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          style={{
            background: isListening ? '#dc2626' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)'),
            border: `1.5px solid ${isListening ? '#ef4444' : (isLight ? '#cbd5e1' : 'rgba(217,119,6,0.4)')}`,
            borderRadius: 12,
            width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isListening ? '#ffffff' : (isLight ? '#0f172a' : '#fbbf24'),
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.8)' : 'none',
            flexShrink: 0
          }}
          title={isListening ? 'Stop voice input' : 'Speak using Voice Assistant'}
        >
          {isListening ? '🛑' : '🎙️'}
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={isListening ? "Listening..." : `Ask ${guideName} or click 🎙️ to speak...`}
          className="input-light"
          style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}
        />
        <button onClick={() => send()} className="btn-primary" style={{
          width: 42, height: 42, padding: 0, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>➤</button>
      </div>

      <style>{`
        @keyframes typingDot {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
