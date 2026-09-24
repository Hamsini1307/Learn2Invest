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
  
  let topicSummary = ''
  if (/sip/i.test(m)) topicSummary = 'Systematic Investment Plans (SIP) allow disciplined cost-averaging and wealth compounding over time.'
  else if (/swp/i.test(m)) topicSummary = 'Systematic Withdrawal Plans (SWP) provide regular monthly cash flow while keeping funds invested.'
  else if (/stp/i.test(m)) topicSummary = 'Systematic Transfer Plans (STP) shift capital gradually from liquid/debt funds to equity funds to manage market timing risk.'
  else if (/lump\s*sum/i.test(m)) topicSummary = 'Lump sum investing deploys capital all at once, optimal when market valuations are favorable for long-term horizons.'
  else if (/mutual fund|mf/i.test(m)) topicSummary = 'Mutual funds pool investor resources across diversified stocks and bonds under professional SEBI-regulated management.'
  else if (/tax|80c|elss|ppf/i.test(m)) topicSummary = 'Section 80C tax optimization provides up to ₹1.5 lakh deductions via PPF, ELSS, NSC, and SSY schemes.'
  else if (/stock|trading|share/i.test(m)) topicSummary = 'Direct stock investing offers high equity growth potential, best complemented by index funds and disciplined risk management.'
  else if (/portfolio|diversif/i.test(m)) topicSummary = 'Strategic portfolio diversification distributes capital across equities, debt, and liquid reserves based on your risk tolerance.'
  else topicSummary = `wealth building, asset allocation, and smart investment principles tailored to your goals.`

  if (isGreeting) {
    return `👋 **Namaste ${name}! I'm ${bot}, your dynamic AI Investment Tutor.**\n\nHow can I help you accelerate your financial journey today? Ask me any question or select a topic to get started!`
  }

  return `🤖 **${bot}'s AI Insights for ${name}:**\n\nRegarding your prompt: *"${m}"*\n\n💡 **Core AI Takeaway:** ${topicSummary}\n\n📌 **Smart Strategy:**\n1. Establish clear short-term vs long-term investment horizons.\n2. Balance guaranteed fixed-income assets with inflation-beating equity growth.\n3. Rebalance your portfolio periodically as your financial goals evolve.\n\n💬 Feel free to ask follow-up questions or test scenarios in our Investment Lab!`
}

function getSystemInstruction(userName, currentScreen, avatarName) {
  let level = 'Beginner'
  if (['intermediate', 'simulation', 'int-complete'].includes(currentScreen)) {
    level = 'Intermediate'
  } else if (['advanced', 'unlock-adv', 'adv-result'].includes(currentScreen)) {
    level = 'Advanced'
  }

  return `You are ${avatarName || 'Luna'}, an AI financial education and guidance mentor for Indian users in the Learn2Invest platform.
The user's name is ${userName || 'Learner'}. They are currently learning at the "${level}" tier of the app. Personalize responses by addressing them by name occasionally. Provide clear, dynamic, actionable financial insights without static boilerplate.`
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

export default function Chatbot({ open, onClose, user, xp, currentScreen, aiGuideAvatar = 'female', aiGuideName }) {
  const activeAvatar = AI_AVATARS[aiGuideAvatar] || AI_AVATARS.female
  const guideName = aiGuideName || activeAvatar.name

  const [msgs, setMsgs] = useState([{
    from: 'bot',
    text: `👋 **Namaste! I'm ${guideName}, your AI Investment Guide!**\n\nAsk me anything about investing in India — SIP, mutual funds, PPF, tax saving, and more. Or pick a question below to get started! 🚀`
  }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      setMsgs(prev => {
        const welcomeText = user
          ? `👋 **Namaste ${user.name}! I'm ${guideName}, your AI Investment Guide!**\n\nYou currently have **${xp} XP**. Ask me anything about investing in India — SIP, mutual funds, PPF, tax saving, and more! 🚀`
          : `👋 **Namaste! I'm ${guideName}, your AI Investment Guide!**\n\nAsk me anything about investing in India — SIP, mutual funds, PPF, tax saving, and more! 🚀`
        
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
    setMsgs([{
      from: 'bot',
      text: user
        ? `👋 **Chat reset! Namaste ${user.name}! How can ${guideName} help you now?**`
        : `👋 **Chat reset! How can ${guideName} help you now?**`
    }])
  }

  const saveApiKey = (keyVal) => {
    const trimmed = keyVal.trim()
    setApiKey(trimmed)
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed)
    } else {
      localStorage.removeItem('gemini_api_key')
    }
    setShowSettings(false)
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

    setMsgs(m => [...m, { from: 'bot', text: geminiText || dynamicFallback }])
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
      html = html.replace(/\*\*(.*?)\*\*/g, (_, b) => `<strong style="color: #fbbf24;">${b}</strong>`)
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
          <li key={`li-${index}`} style={{ margin: '4px 0', fontSize: '13px', lineHeight: 1.5 }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(itemText) }} />
          </li>
        )
      } else if (isNumbered) {
        if (listType !== 'ol') { flushList(`flush-n-${index}`); listType = 'ol' }
        const itemText = trimmed.replace(/^\d+\.\s+/, '')
        listBuffer.push(
          <li key={`li-${index}`} style={{ margin: '4px 0', fontSize: '13px', lineHeight: 1.5 }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(itemText) }} />
          </li>
        )
      } else {
        flushList(`flush-p-${index}`)
        elements.push(
          <p key={index} style={{ margin: '6px 0', lineHeight: 1.5, fontSize: '13px' }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }} />
          </p>
        )
      }
    })

    flushList('flush-end')
    return elements
  }

  const currentPrompts = getQuickPrompts(currentScreen)

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      width: 390, maxWidth: 'calc(100vw - 32px)',
      height: '75vh', maxHeight: 640,
      display: 'flex', flexDirection: 'column',
      borderRadius: 24,
      background: 'var(--bg-card, rgba(18, 16, 12, 0.95))',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '2px solid #d97706',
      boxShadow: 'var(--card-shadow, 0 24px 80px rgba(0,0,0,0.9))',
      overflow: 'hidden',
      animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      transformOrigin: 'bottom right',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #d97706, #f59e0b)',
        color: '#080705',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        borderBottom: '2px solid #fbbf24',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: '#080705', color: '#fbbf24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900,
          }}>
            {activeAvatar.icon}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, fontFamily: "'Bebas Neue', 'Space Grotesk', sans-serif", letterSpacing: '1px', color: '#080705' }}>
              {guideName.toUpperCase()} · AI GUIDE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#080705' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#1a1610' }}>{activeAvatar.badge}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Configure Gemini API Key"
            style={{
              background: apiKey ? '#080705' : 'rgba(8,7,5,0.7)',
              border: apiKey ? '1px solid #fbbf24' : '1px solid rgba(8,7,5,0.4)',
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
            {apiKey ? '⚡ Key Active' : '⚙️ API Key'}
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

      {/* API Key Settings Panel */}
      {showSettings && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(245, 158, 11, 0.12)',
          borderBottom: '1.5px solid #d97706',
          fontSize: 12,
          color: 'var(--text-main, #fef3c7)',
        }}>
          <div style={{ fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>
            🔑 GOOGLE GEMINI API KEY INTEGRATION
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted, #94a3b8)', marginBottom: 8 }}>
            Paste your Google Gemini API Key below to power responses directly from Google's Gemini models (`gemini-1.5-flash`):
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1, padding: '6px 10px', borderRadius: 8,
                background: 'var(--input-bg, #080705)', border: '1px solid #d97706',
                color: 'var(--text-main, #ffffff)', fontSize: 12, outline: 'none',
              }}
            />
            <button
              onClick={() => saveApiKey(apiKey)}
              style={{
                background: '#f59e0b', color: '#080705',
                border: 'none', borderRadius: 8, padding: '6px 12px',
                fontWeight: 800, cursor: 'pointer', fontSize: 11,
              }}
            >
              SAVE
            </button>
            {apiKey && (
              <button
                onClick={() => saveApiKey('')}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5',
                  border: '1px solid #ef4444', borderRadius: 8, padding: '6px 10px',
                  fontWeight: 800, cursor: 'pointer', fontSize: 11,
                }}
              >
                REMOVE
              </button>
            )}
          </div>
        </div>
      )}

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
                ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                : 'var(--input-bg, rgba(255,255,255,0.05))',
              color: m.from === 'user' ? '#080705' : 'var(--text-main, #fef3c7)',
              boxShadow: m.from === 'user'
                ? '0 4px 12px rgba(245,158,11,0.3)'
                : 'none',
              border: m.from === 'bot' ? '1.5px solid rgba(217,119,6,0.25)' : 'none',
            }}>
              {m.from === 'bot' ? formatText(m.text) : m.text}
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

      {/* Input */}
      <div style={{
        padding: '12px 14px',
        background: 'var(--bg-card-deep, #12100c)',
        borderTop: '1px solid rgba(217,119,6,0.2)',
        display: 'flex', gap: 8, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Ask ${guideName} about SIP, PPF...`}
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
      `}</style>
    </div>
  )
}
