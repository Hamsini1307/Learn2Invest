import React, { useState, useRef, useEffect } from 'react'
import soundEngine from '../utils/soundEngine.js'
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
  if (!text) return []
  const pills = []
  const lower = text.toLowerCase()

  if (lower.includes('[level 1 school]') || lower.includes('[level 1]') || lower.includes('/school')) {
    pills.push({ label: '🏫 Level 1 School', screen: 'beginner', path: '/school' })
  }
  if (lower.includes('[level 2 lab]') || lower.includes('[level 2]') || lower.includes('/government-district')) {
    pills.push({ label: '🏛️ Level 2 Lab', screen: 'intermediate', path: '/government-district' })
  }
  if (lower.includes('[level 3 banking]') || lower.includes('[level 3]') || lower.includes('/futuristic-city')) {
    pills.push({ label: '🌆 Level 3 Banking Hub', screen: 'advanced', path: '/futuristic-city' })
  }
  if (lower.includes('[campus map]') || lower.includes('/campus-map') || lower.includes('/dashboard')) {
    pills.push({ label: '🗺️ Campus Map', screen: 'level-map', path: '/campus-map' })
  }
  if (lower.includes('[saved simulations]') || lower.includes('/saved-simulations')) {
    pills.push({ label: '📁 Saved Simulations', screen: 'saved-simulations', path: '/saved-simulations' })
  }
  if (lower.includes('[admin panel]') || lower.includes('/admin')) {
    pills.push({ label: '🛡️ Admin Panel', screen: 'admin', path: '/admin' })
  }
  if (lower.includes('[leaderboard]')) {
    pills.push({ label: '🏆 Leaderboard', modal: 'leaderboard' })
  }
  if (lower.includes('[badges]')) {
    pills.push({ label: '🎖️ Badges', modal: 'badges' })
  }
  if (lower.includes('[performance report]')) {
    pills.push({ label: '📊 Performance Report', modal: 'report' })
  }

  return pills.filter((p, i, arr) => arr.findIndex(x => x.label === p.label) === i)
}

// Formatted markdown text renderer with extra-large, ultra-readable typography (18-20px)
function FormattedMessage({ text, onActionClick }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let inTable = false
  let tableRows = []

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={key} style={{ overflowX: 'auto', margin: '14px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', background: 'rgba(15,23,42,0.7)', borderRadius: '10px', overflow: 'hidden' }}>
            <tbody>
              {tableRows.map((r, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(148,163,184,0.25)' }}>
                  {r.map((cell, cIdx) => (
                    rIdx === 0 ? (
                      <th key={cIdx} style={{ padding: '10px 14px', textAlign: 'left', color: '#38BDF8', fontWeight: 900, background: 'rgba(15,23,42,0.9)' }}>
                        {formatInline(cell)}
                      </th>
                    ) : (
                      <td key={cIdx} style={{ padding: '10px 14px', color: '#F1F5F9', fontSize: '16px' }}>
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
      elements.push(<div key={`empty_${idx}`} style={{ height: '10px' }} />)
      return
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h3_${idx}`} style={{ fontSize: '20px', fontWeight: 900, color: '#38BDF8', margin: '14px 0 6px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('### ', ''))}
        </h4>
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h2_${idx}`} style={{ fontSize: '22px', fontWeight: 900, color: '#FBBF24', margin: '16px 0 8px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('## ', ''))}
        </h3>
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h1_${idx}`} style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', margin: '18px 0 10px', letterSpacing: '-0.01em' }}>
          {formatInline(trimmed.replace('# ', ''))}
        </h2>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`bullet_${idx}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '8px 0', paddingLeft: '4px' }}>
          <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: '20px', lineHeight: '1.3' }}>•</span>
          <div style={{ flex: 1, fontSize: '18px', lineHeight: 1.6 }}>{formatInline(trimmed.slice(2))}</div>
        </div>
      )
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/)
      elements.push(
        <div key={`num_${idx}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '8px 0', paddingLeft: '4px' }}>
          <span style={{ color: '#FBBF24', fontWeight: 900, minWidth: '24px', fontSize: '18px' }}>{match[1]}.</span>
          <div style={{ flex: 1, fontSize: '18px', lineHeight: 1.6 }}>{formatInline(match[2])}</div>
        </div>
      )
    } else {
      elements.push(
        <p key={`p_${idx}`} style={{ margin: '8px 0', lineHeight: 1.6, fontSize: '18px', color: '#F8FAFC' }}>
          {formatInline(trimmed)}
        </p>
      )
    }
  })

  if (inTable) flushTable(`table_end`)

  const actionPills = extractActionPills(text)

  return (
    <div>
      {elements}
      {actionPills.length > 0 && onActionClick && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(148,163,184,0.25)' }}>
          {actionPills.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => onActionClick(p)}
              style={{
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(99, 102, 241, 0.35))',
                border: '2px solid #38BDF8',
                color: '#E0F2FE',
                borderRadius: '12px',
                padding: '9px 18px',
                fontSize: '17px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              }}
              title={`Click to open ${p.label}`}
            >
              <span>{p.label}</span>
              <span style={{ fontSize: '14px' }}>↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function formatInline(str) {
  if (!str) return ''
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#FFFFFF', fontWeight: 900 }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 8px',
            borderRadius: '6px',
            color: '#F472B6',
            fontSize: '16px',
            fontFamily: 'monospace',
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
      if (text && text.trim()) {
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
  * End with: "💡 You can simulate this portfolio in [Level 2 Lab]!"
- Keep general responses short (under 120 words), clear, using bullet points, bold key terms, and Indian Rupee formatting (₹).`

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

  // 3. Client-Side Deterministic Fallback grounded in website knowledge
  const qLower = message.toLowerCase()
  const numMatch = message.replace(/,/g, '').match(/\b(\d{3,9})\b/)
  if (numMatch && (qLower.includes('invest') || qLower.includes('put') || qLower.includes('have') || qLower.includes('allocate') || qLower.includes('money') || qLower.includes('rupee'))) {
    const total = parseFloat(numMatch[1])
    if (total > 0) {
      const eq = Math.round(total * 0.5)
      const debt = Math.round(total * 0.3)
      const liq = total - eq - debt
      return `Here is your smart asset allocation for **₹${total.toLocaleString('en-IN')}**:

* **50% (~₹${eq.toLocaleString('en-IN')})** — Index Mutual Funds (e.g. Nifty 50) for long-term growth.
* **30% (~₹${debt.toLocaleString('en-IN')})** — Safe Fixed Income (PPF at 7.1% or FD at 7.25%) for capital protection.
* **20% (~₹${liq.toLocaleString('en-IN')})** — Emergency Savings / Gold ETF for quick liquidity.

💡 You can simulate this portfolio in [Level 2 Lab]!`
    }
  }

  if (qLower.includes('about') || qLower.includes('website') || qLower.includes('what is this') || qLower.includes('explain this website')) {
    return `**Welcome to Learn2Invest!** 🎓
Learn2Invest is an interactive 3D gamified learning simulator designed to teach practical Indian financial literacy.

Here is what you can do on the platform:
1. **Level 1 (School Classroom)**: Watch 5 bite-sized financial literacy video lessons on PPF, FD, NSC, and Sukanya Samriddhi, then pass the 10-Question Examination Center (+100 XP).
2. **Level 2 (Government District Lab)**: Test 6 government investment scheme simulators, mix savings allocations in the Mixer Studio, and run multi-asset portfolio simulations with Smart Allocation.
3. **Level 3 (Futuristic City Banking Hub)**: Practice filling realistic Indian bank deposit slips, withdrawal forms, and cheques with dual counterfoils, and learn digital cyber safety against OTP and phishing scams.
4. **Campus Map & Saved Simulations**: Navigate between districts, earn milestone badges, and save your custom portfolio calculations.

*Note: All money and investments used in Learn2Invest are 100% educational virtual money.*`
  }

  return `I am your Learn2Invest Website Assistant! 🎓
You are currently viewing **${SCREEN_KNOWLEDGE[currentScreen]?.title || 'Campus Entrance'}**.
You can ask me:
- *"Explain this page."*
- *"Help me navigate."*
- *"How do I unlock Level 2?"*
- *"What is PPF and FD?"*
- *"How do I fill out a bank deposit slip?"*

How can I assist you right now?`
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COMPANION PERSON SVG (BOY IN BLUE JACKET / GIRL) — 175px TALL & LARGE
// ═══════════════════════════════════════════════════════════════════════════════
function StandingCompanionPersonSVG({
  lookX = 0,
  lookY = 0,
  isExcited = false,
  isDisappointed = false,
  isSpeaking = false,
  gender = 'male',
}) {
  const pupilDx = Math.max(-4.2, Math.min(4.2, lookX * 4.5))
  const pupilDy = Math.max(-3.0, Math.min(3.0, lookY * 3.2))
  const headTilt = isDisappointed ? -10 : Math.max(-8, Math.min(8, lookX * 7))
  const headShiftX = Math.max(-3, Math.min(3, lookX * 2.5))

  return (
    <svg
      width="135"
      height="175"
      viewBox="-8 -4 126 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: 'visible',
        filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.65))',
        transform: isExcited
          ? 'translateY(-8px) scale(1.06)'
          : isDisappointed
            ? 'translateY(4px) scale(0.97)'
            : 'translateY(0px) scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Glowing Ground Pad Under Feet */}
      <ellipse
        cx="55"
        cy="136"
        rx={isExcited ? '42' : '35'}
        ry="9"
        fill={isExcited ? '#FBBF24' : isDisappointed ? '#F43F5E' : '#38BDF8'}
        fillOpacity={isExcited ? '0.75' : isDisappointed ? '0.6' : '0.5'}
      />
      <ellipse
        cx="55"
        cy="136"
        rx="24"
        ry="5"
        fill={isDisappointed ? '#FB7185' : '#10B981'}
        fillOpacity="0.7"
      />

      {/* Excitement Sparkles */}
      {isExcited && (
        <g>
          <circle cx="10" cy="24" r="5" fill="#FBBF24" />
          <circle cx="100" cy="20" r="5.5" fill="#34D399" />
          <circle cx="6" cy="60" r="4.5" fill="#F472B6" />
          <circle cx="104" cy="56" r="4.5" fill="#38BDF8" />
          <text x="0" y="16" fontSize="18">✨</text>
          <text x="94" y="14" fontSize="18">🎉</text>
        </g>
      )}

      {/* Disappointment Sweat Drop */}
      {isDisappointed && (
        <g>
          <text x="2" y="20" fontSize="18">💧</text>
          <text x="92" y="20" fontSize="17">😟</text>
        </g>
      )}

      {/* Legs & Shoes */}
      <g>
        <rect x="41" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="37" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
        <rect x="59" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="57" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
      </g>

      {/* Torso / Electric Blue Jacket */}
      <path
        d="M34 64 C34 57 76 57 76 64 L80 102 C80 105 30 105 30 102 Z"
        fill={gender === 'female' ? '#8B5CF6' : '#2563EB'}
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
        <rect x="20" y="62" width="13" height="32" rx="6.5" fill={gender === 'female' ? '#7C3AED' : '#1D4ED8'} />
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
        <rect x="77" y="62" width="13" height="32" rx="6.5" fill={gender === 'female' ? '#7C3AED' : '#1D4ED8'} />
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
        <circle cx="55" cy="34" r="24" fill={gender === 'female' ? '#3B1D0B' : '#1E293B'} />
        {gender === 'female' && (
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
          fill={gender === 'female' ? '#3B1D0B' : '#1E293B'}
        />

        {/* Eyebrows */}
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

  const initialGreeting = `👋 Hello! I am ${guideName}, your personal AI Financial Mentor for Learn2Invest.

I am powered by Google Gemini and have full knowledge of Indian savings schemes, portfolio investing, banking procedures, cyber fraud protection, and this website's features.

Ask me any real-time financial question, or tap one of the suggested topics below to get started!`

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

  const handleReadAloud = (textToRead, idx) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isVoiceMuted) return

    if (speakingIdx === idx && idx !== 'auto_voice') {
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

    const utter = new SpeechSynthesisUtterance(cleanSpeech)
    const allVoices = window.speechSynthesis.getVoices()
    const preferredVoice =
      allVoices.find((v) => v.lang === 'en-IN') ||
      allVoices.find((v) => v.lang.startsWith('en')) ||
      allVoices[0]

    if (preferredVoice) {
      utter.voice = preferredVoice
      utter.lang = preferredVoice.lang
    } else {
      utter.lang = 'en-IN'
    }

    utter.rate = 1.0
    utter.pitch = aiGuideAvatar === 'female' ? 1.08 : 0.95
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
          right: 24px;
          bottom: 24px;
          z-index: 99998;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          filter: drop-shadow(0 14px 28px rgba(0,0,0,0.65));
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .l2i-chat-launcher:hover {
          transform: scale(1.06) translateY(-4px);
        }

        .l2i-chat-window {
          position: fixed;
          bottom: 24px;
          right: 28px;
          width: min(440px, calc(100vw - 32px));
          height: min(580px, calc(100vh - 48px));
          max-height: calc(100vh - 48px);
          top: auto;
          background: linear-gradient(165deg, #070D19 0%, #0D172A 100%);
          border: 2px solid rgba(56, 189, 248, 0.6);
          border-radius: 20px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9);
          z-index: 99999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: #F8FAFC;
          font-family: 'Space Grotesk', 'Inter', -apple-system, sans-serif;
          animation: l2iSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .l2i-chat-window.expanded {
          width: min(680px, calc(100vw - 32px));
          height: min(740px, calc(100vh - 48px));
          max-height: calc(100vh - 48px);
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
          100% { transform: translateY(-6px); }
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
            right: 16px !important;
            bottom: 16px !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          NORMAL CHATBOT LAUNCHER (VISIBLE WHEN CLOSED)
          - Animated boy Leo in blue jacket (135px tall, fully inside viewport)
          - Speech bubble tooltip prompting user to ask questions
          - Clicking cleanly opens the chat window at this exact corner
      ═══════════════════════════════════════════════════════════════════════ */}
      {!isOpen && (
        <div
          ref={companionRef}
          onClick={handleToggleOpen}
          className="l2i-chat-launcher"
          title={`Click to chat with ${guideName}!`}
        >
          {/* Dynamic Speech Bubble */}
          <div
            style={{
              marginBottom: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: quizReaction
                ? quizReaction.type === 'excited'
                  ? 'linear-gradient(135deg, #10B981, #F59E0B)'
                  : 'linear-gradient(135deg, #F43F5E, #FB7185)'
                : isExcitedByLogin
                  ? 'linear-gradient(135deg, #F59E0B, #10B981)'
                  : 'rgba(15, 23, 42, 0.96)',
              color: quizReaction || isExcitedByLogin ? '#020617' : '#F8FAFC',
              border: isCompanionExcited
                ? '2px solid #FEF08A'
                : '2px solid rgba(56,189,248,0.7)',
              boxShadow: isCompanionExcited
                ? '0 0 25px rgba(251,191,36,0.9)'
                : '0 8px 24px rgba(0,0,0,0.5)',
              fontSize: '14px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '16px' }}>💬</span>
            <span>
              {quizReaction
                ? quizReaction.text
                : isExcitedByLogin
                  ? `🎉 Log in & let's explore!`
                  : `Ask ${guideName} • AI Mentor 🎙️`}
            </span>
          </div>

          {/* 135px Standing Person SVG */}
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
          - Opens cleanly right at bottom: 24px, right: 24px
          - Leo's avatar with live pulsing online badge in header
          - Clear conversation stream with starter suggestions that scroll naturally
          - Direct navigation buttons for levels, bank slips, and map
          - Working speech recognition (Speech-to-Text) and text-to-speech
      ═══════════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className={`l2i-chat-window ${isExpanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0369A1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px solid rgba(56, 189, 248, 0.3)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284C7, #4F46E5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: '2px solid #38BDF8',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  }}
                >
                  {aiGuideAvatar === 'female' ? '👧' : '👦'}
                </div>
                {/* Live pulsing online badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid #0F172A',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{guideName}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'rgba(56,189,248,0.2)',
                      border: '1px solid #38BDF8',
                      color: '#7DD3FC',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}
                  >
                    AI Mentor
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#93C5FD', fontWeight: 600 }}>
                  {isListeningVoice
                    ? '🎙️ Listening to your voice now...'
                    : '⚡ Live Google Gemini AI'}
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Reset Chat */}
              <button
                type="button"
                onClick={handleResetChat}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#E2E8F0',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                  background: isVoiceMuted ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)',
                  border: isVoiceMuted ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.25)',
                  color: '#E2E8F0',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                  background: isExpanded ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#E2E8F0',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#E2E8F0',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {msgs.map((m, idx) => {
              const isUser = m.from === 'user'
              const isReadingThis = speakingIdx === idx
              return (
                <div key={m.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '88%',
                      background: isUser
                        ? 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)'
                        : 'rgba(15, 23, 42, 0.88)',
                      border: isUser ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      padding: '14px 16px',
                      color: '#F8FAFC',
                      fontSize: '15.5px',
                      lineHeight: 1.55,
                      boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
                    }}
                  >
                    <FormattedMessage text={m.text} onActionClick={handleActionClick} />

                    {/* Read Aloud Button on Bot Messages */}
                    {!isUser && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleReadAloud(m.text, idx)}
                          disabled={isVoiceMuted}
                          style={{
                            background: isReadingThis
                              ? 'rgba(245, 158, 11, 0.25)'
                              : 'rgba(56, 189, 248, 0.12)',
                            border: isReadingThis
                              ? '1px solid #F59E0B'
                              : '1px solid rgba(56, 189, 248, 0.35)',
                            color: isVoiceMuted ? '#64748B' : isReadingThis ? '#FDE68A' : '#7DD3FC',
                            borderRadius: '999px',
                            padding: '4px 12px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isVoiceMuted ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span>{isReadingThis ? '⏹ Stop' : '🔊 Listen'}</span>
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
                        gap: '8px',
                        marginTop: '4px',
                        paddingLeft: '4px',
                      }}
                    >
                      {starterChips.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          style={{
                            background: 'rgba(30, 41, 59, 0.85)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#E0F2FE',
                            borderRadius: '999px',
                            padding: '7px 14px',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#38BDF8'
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'
                            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'
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
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '1.5px solid #F472B6',
                  borderRadius: '16px',
                  padding: '10px 18px',
                  fontSize: '14.5px',
                  color: '#FBCFE8',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🎙️</span>
                <span>Listening to your voice... Speak now!</span>
              </div>
            )}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '16px',
                  padding: '10px 16px',
                  fontSize: '14.5px',
                  color: '#38BDF8',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>✨ Gemini is thinking</span>
                <span style={{ display: 'inline-flex', gap: '4px' }}>
                  <span style={{ animation: 'blink 1.2s infinite', fontSize: '18px' }}>•</span>
                  <span style={{ animation: 'blink 1.2s infinite 0.2s', fontSize: '18px' }}>•</span>
                  <span style={{ animation: 'blink 1.2s infinite 0.4s', fontSize: '18px' }}>•</span>
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
              padding: '12px 16px 14px',
              background: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                    ? '2px solid #FDE047'
                    : '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isListeningVoice ? '0 0 15px rgba(236,72,153,0.7)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title={isListeningVoice ? 'Stop listening' : 'Speak using microphone'}
              >
                {isListeningVoice ? '🛑' : '🎙️'}
              </button>

              {/* Text Input Box */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListeningVoice
                    ? 'Listening to your speech...'
                    : `Ask anything about investing or this website...`
                }
                style={{
                  flex: 1,
                  background: '#1E293B',
                  border: isListeningVoice
                    ? '1.5px solid #EC4899'
                    : '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  height: '44px',
                  outline: 'none',
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
                  borderRadius: '12px',
                  padding: '0 18px',
                  height: '44px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !input.trim() ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
                }}
              >
                <span>Send</span>
                <span style={{ fontSize: '13px' }}>➤</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11.5px',
                color: '#64748B',
                padding: '0 4px',
              }}
            >
              <span>⚡ Google Gemini AI • Live Financial Mentor</span>
              <span>{SCREEN_KNOWLEDGE[currentScreen]?.badge || 'Campus'}</span>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
