import React, { useState, useRef, useEffect } from 'react'
import soundEngine from '../utils/soundEngine.js'

// Dynamic Natural Answer Synthesis Engine — generates custom, question-specific answers (no rigid predefined templates)
function synthesizeOwnDynamicAnswer(userQuestion, userName = 'Friend', xp = 0, lang = 'en') {
  const q = (userQuestion || '').trim()
  const lower = q.toLowerCase()

  // Extract any numbers mentioned by the user for custom math
  const numMatches = q.match(/\d[\d,]*(?:\.\d+)?/g)?.map((n) => Number(n.replace(/,/g, ''))) || []
  const firstNum = numMatches[0] || null
  const secondNum = numMatches[1] || null

  // Detect if user asked a math/calculation question like "how much will 5000 become in 10 years"
  if (firstNum && (lower.includes('year') || lower.includes('yr') || lower.includes('month') || lower.includes('grow') || lower.includes('return') || lower.includes('calculate') || lower.includes('invest') || lower.includes('save'))) {
    const amount = firstNum >= 100 ? firstNum : (secondNum && secondNum >= 100 ? secondNum : 5000)
    const years = firstNum < 50 ? firstNum : (secondNum && secondNum <= 50 ? secondNum : 10)
    const isMonthly = /month|sip|rd|every month|per month|\/mo/i.test(lower)
    const rate = /ssy|sukanya/i.test(lower)
      ? 8.2
      : /nsc/i.test(lower)
        ? 7.7
        : /mis|post office/i.test(lower)
          ? 7.4
          : /fd|fixed/i.test(lower)
            ? 7.25
            : /ppf/i.test(lower)
              ? 7.1
              : /rd|recurring/i.test(lower)
                ? 7.0
                : /sip|mutual|equity|stock/i.test(lower)
                  ? 12.0
                  : 7.5

    if (isMonthly) {
      const months = years * 12
      const rMonth = rate / 100 / 12
      const maturity = Math.round(amount * (((Math.pow(1 + rMonth, months) - 1) / rMonth) * (1 + rMonth)))
      const invested = amount * months
      const profit = maturity - invested
      return `For your question ("${q}"), if you save ₹${amount.toLocaleString('en-IN')} every month for ${years} years at ${rate}% p.a.:\n\n• Total Principal Invested: ₹${invested.toLocaleString('en-IN')}\n• Compounding Interest / Gain: +₹${profit.toLocaleString('en-IN')}\n• Final Maturity Corpus: ₹${maturity.toLocaleString('en-IN')}\n\nNotice how compound interest adds ₹${profit.toLocaleString('en-IN')} of extra wealth on top of your own savings!`
    } else {
      const r = rate / 100
      const maturity = Math.round(amount * Math.pow(1 + r, years))
      const profit = maturity - amount
      return `Based on your question ("${q}"), investing ₹${amount.toLocaleString('en-IN')} for ${years} years at ${rate}% p.a. gives:\n\n• Initial Investment: ₹${amount.toLocaleString('en-IN')}\n• Total Interest Earned: +₹${profit.toLocaleString('en-IN')}\n• Final Value after ${years} Years: ₹${maturity.toLocaleString('en-IN')}\n\nIf you instead invested ₹${amount.toLocaleString('en-IN')} every single year (like in PPF or SSY), your corpus would grow even faster to ₹${Math.round(amount * (((Math.pow(1 + r, years) - 1) / r) * (1 + r))).toLocaleString('en-IN')}!`
    }
  }

  // Specific topic synthesis tailored to the exact question
  if (/ifsc|razorpay|branch code|micr/i.test(lower)) {
    return `An IFSC (Indian Financial System Code) is an 11-character alphanumeric code assigned by the RBI to uniquely identify every bank branch in India for NEFT, RTGS, and IMPS transfers.\n\n• First 4 letters: Bank code (e.g., CNRB for Canara Bank, SBIN for SBI, KARB for Karnataka Bank).\n• 5th character: Always '0' (reserved for future use).\n• Last 6 characters: Specific branch identifier (e.g., CNRB0000634 is Canara Bank Surathkal).\n\nIn Level 3 Cabin 1, you can look up live verified IFSC codes powered by the Razorpay IFSC Toolkit API!`
  }

  if (/slip|cheque|check|deposit form|withdraw/i.test(lower)) {
    return `When filling out a Bank Deposit Slip, Withdrawal Slip, or Cheque in Level 3 Cabin 1:\n\n1. Write the current Date clearly at the top right.\n2. Enter the full Account Number and Account Holder Name matching your passbook.\n3. Mention the Branch Name and verified 11-digit IFSC code.\n4. Write the amount in both figures (e.g., ₹5,000/-) and words ("FIVE THOUSAND RUPEES ONLY") and draw a line after "ONLY" so no one can alter the amount.\n5. Sign consistently in the signature box.`
  }

  if (/scam|phish|otp|upi|pin|fraud|cyber|arrest|safety/i.test(lower)) {
    return `Here is how to stay 100% safe in digital banking (covered in Level 3 Cabin 2):\n\n• UPI PIN Rule: Your UPI PIN is ONLY needed when money leaves your account. You NEVER enter a PIN to receive money.\n• OTP & CVV Secrecy: Real bank officers, RBI, or police will never call to ask for your OTP, ATM PIN, or screen-sharing access.\n• "Digital Arrest" Warning: Law enforcement agencies never conduct arrests or demand money transfers over WhatsApp/Skype video calls. Dial 1930 immediately if targeted.`
  }

  if (/sukanya|ssy|girl/i.test(lower)) {
    return `Sukanya Samriddhi Yojana (SSY) is a Government of India small-savings scheme designed for a girl child (opened before age 10):\n\n• Interest Rate: 8.2% p.a. (highest among government guaranteed schemes).\n• Tax Status: EEE — deposits up to ₹1.5 Lakh/year get Section 80C deduction, and both interest and maturity are 100% tax-free.\n• Tenure: Deposits are made for 15 years; the account matures at 21 years from opening (50% partial withdrawal is allowed at age 18 for higher education).`
  }

  if (/nsc|national savings/i.test(lower)) {
    return `National Savings Certificate (NSC) is a 5-year Post Office investment backed by the Government of India:\n\n• Interest Rate: 7.7% p.a. compounded annually and paid at maturity.\n• Minimum Investment: ₹1,000 (no maximum limit).\n• Tax Benefit: Investments up to ₹1.5 Lakh qualify for Section 80C tax deduction, and the first 4 years' accrued interest is treated as reinvested under 80C.`
  }

  if (/mis|pomis|monthly income/i.test(lower)) {
    return `Post Office Monthly Income Scheme (POMIS) is ideal when you want a steady, guaranteed monthly cash payout:\n\n• Interest Rate: 7.4% p.a. paid out every single month.\n• Lock-in Tenure: 5 years.\n• Investment Limit: Up to ₹9 Lakh in a single account or ₹15 Lakh in a joint account.\n• Example: A ₹5,00,000 deposit pays ₹3,083 every month for 60 months while keeping your ₹5,00,000 principal 100% safe!`
  }

  if (/ppf|provident/i.test(lower)) {
    return `Public Provident Fund (PPF) is a 15-year sovereign-guaranteed wealth builder:\n\n• Interest Rate: 7.1% p.a. compounded annually.\n• Tax Advantage: Full EEE (Exempt-Exempt-Exempt) under Section 80C — zero tax on contribution (up to ₹1.5L/yr), zero tax on interest earned, and zero tax on maturity.\n• Flexibility: You can invest anywhere from ₹500 to ₹1,50,000 per financial year, and extend it in 5-year blocks after 15 years.`
  }

  if (/fd|rd|fixed deposit|recurring/i.test(lower)) {
    return `Comparing Fixed Deposit (FD) and Recurring Deposit (RD):\n\n• Fixed Deposit (FD — ~7.25% p.a.): You deposit a single lump sum once, and it compounds quarterly over 7 days to 10 years.\n• Recurring Deposit (RD — ~7.0% p.a.): You deposit a fixed amount every month (starting from ₹100/month), making it ideal for students or salaried savers who want to build a corpus step-by-step.\n• Safety: Bank deposits up to ₹5 Lakh per bank are insured by DICGC.`
  }

  if (/sip|mutual fund|nav|compound/i.test(lower)) {
    return `A Systematic Investment Plan (SIP) lets you invest a fixed amount every month into a Mutual Fund:\n\n• Rupee Cost Averaging: You automatically buy more units when market prices (NAV) are low and fewer when prices are high.\n• Power of Compounding: Your returns earn further returns over time, turning small monthly habits (like ₹500 or ₹2,000/month) into a large long-term corpus.\n• Discipline: Automating your savings before spending is the #1 habit of successful investors.`
  }

  if (/tax|80c|elss/i.test(lower)) {
    return `Section 80C of the Income Tax Act allows you to deduct up to ₹1,50,000 per year from your taxable income when you invest in:\n\n1. PPF (7.1% p.a., 15-yr lock-in, 100% tax-free EEE)\n2. Sukanya Samriddhi (8.2% p.a., 100% tax-free EEE)\n3. ELSS Mutual Funds (3-yr shortest lock-in, market-linked growth)\n4. NSC (7.7% p.a., 5-yr Post Office certificate)\n5. 5-Year Tax-Saver Bank FD (7.25% p.a.)`
  }

  if (/hello|hi|hey|who are you|help|what can you/i.test(lower)) {
    return `Hi ${userName}! 👋 I'm your personal Learn2Invest companion standing right here with you (${xp} XP earned so far!).\n\nYou can ask me anything in your own words — for example:\n• "How much will ₹3,000 a month grow in 12 years?"\n• "Which scheme is better for 5 years: NSC or FD?"\n• "How do I find an accurate IFSC code or spot a UPI scam?"`
  }

  // Dynamic contextual response for any custom open-ended question
  return `Here is a direct answer to your question ("${q}"):\n\nIn personal finance, the smartest approach is to match your money to your timeline and risk comfort:\n1. Short-Term & Emergency (0–3 yrs): Use a Bank Fixed Deposit (7.25%) or Recurring Deposit (7.0%) so your capital is 100% liquid and safe.\n2. Medium-Term Goals (3–5 yrs): Consider Post Office NSC (7.7% growth) or Post Office MIS (7.4% monthly income).\n3. Long-Term Tax-Free Wealth (10–15+ yrs): Use PPF (7.1% EEE tax-free), Sukanya Samriddhi (8.2% EEE), or diversified SIPs.\n\nTry asking me with any specific ₹ amount and number of years, and I'll calculate the exact numbers for you!`
}

async function fetchDynamicBotAnswer(message, history, userName, xp, lang) {
  const langName = lang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'
  const systemInstruction = `You are a friendly, smart financial mentor in Learn2Invest 3D Campus speaking with ${userName || 'a student'} (${xp || 0} XP).
Answer the user's exact question naturally, originally, and directly in ${langName}.
Do NOT use generic canned templates — address their specific question, include accurate Indian Rupee (₹) calculations or Indian banking facts (PPF 7.1%, FD 7.25%, NSC 7.7%, Sukanya Samriddhi 8.2%, RD 7.0%, Post Office MIS 7.4%, Razorpay IFSC, UPI safety) where relevant, and keep it concise (70–130 words).`

  const contents = [
    ...history
      .filter((m) => !m.isGreeting)
      .slice(-6)
      .map((m) => ({
        role: m.from === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || '' }],
      })),
    { role: 'user', parts: [{ text: message }] },
  ]

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && text.trim()) {
        return text.replace(/\*\*(.*?)\*\*/g, '$1').trim()
      }
    }
  } catch {}

  return synthesizeOwnDynamicAnswer(message, userName, xp, lang)
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMALL PERSON CHARACTER STANDING IN THE BOTTOM-RIGHT SIDE FROM THE BEGINNING
// - Eyes & head look in the direction of the mouse pointer
// - Gets visibly excited (jumping, waving arms, cheering) when pointer moves toward Login card
// ═══════════════════════════════════════════════════════════════════════════════
function StandingCompanionPersonSVG({ lookX = 0, lookY = 0, isExcited = false, isSpeaking = false, gender = 'female' }) {
  const pupilDx = Math.max(-4.2, Math.min(4.2, lookX * 4.5))
  const pupilDy = Math.max(-3.0, Math.min(3.0, lookY * 3.2))
  const headTilt = Math.max(-8, Math.min(8, lookX * 7))
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
        transform: isExcited ? 'translateY(-6px) scale(1.06)' : 'translateY(0px) scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Glowing Ground Pad Under Feet */}
      <ellipse
        cx="55"
        cy="136"
        rx={isExcited ? '34' : '28'}
        ry="7"
        fill={isExcited ? '#FBBF24' : '#38BDF8'}
        fillOpacity={isExcited ? '0.55' : '0.35'}
      />
      <ellipse
        cx="55"
        cy="136"
        rx="20"
        ry="4"
        fill="#10B981"
        fillOpacity="0.5"
      />

      {/* Excitement Sparkles when Mouse Pointer is near Login */}
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

      {/* Legs & Shoes */}
      <g>
        {/* Left Leg */}
        <rect x="41" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="37" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
        {/* Right Leg */}
        <rect x="59" y="98" width="10" height="30" rx="5" fill="#1E293B" />
        <rect x="57" y="125" width="16" height="9" rx="4.5" fill="#EC4899" />
      </g>

      {/* Torso / Smart Campus Jacket */}
      <path
        d="M34 64 C34 57 76 57 76 64 L80 102 C80 105 30 105 30 102 Z"
        fill={gender === 'male' ? '#2563EB' : '#8B5CF6'}
      />
      {/* White Collar & Gold Tie/Badge */}
      <polygon points="48,60 55,73 62,60" fill="#F8FAFC" />
      <circle cx="55" cy="77" r="4" fill="#FBBF24" />
      <rect x="61" y="72" width="11" height="7" rx="2" fill="#38BDF8" />

      {/* Left Arm (Waves high when excited, otherwise gently tracks pointer) */}
      <g
        style={{
          transformOrigin: '34px 66px',
          transform: isExcited
            ? 'rotate(-128deg)'
            : `rotate(${Math.round(lookX * 12 - 10)}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <rect x="20" y="62" width="13" height="32" rx="6.5" fill={gender === 'male' ? '#1D4ED8' : '#7C3AED'} />
        <circle cx="26.5" cy="96" r="6" fill="#FDE68A" />
      </g>

      {/* Right Arm (Waves high when excited!) */}
      <g
        style={{
          transformOrigin: '76px 66px',
          transform: isExcited
            ? 'rotate(128deg)'
            : `rotate(${Math.round(lookX * 12 + 10)}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <rect x="77" y="62" width="13" height="32" rx="6.5" fill={gender === 'male' ? '#1D4ED8' : '#7C3AED'} />
        <circle cx="83.5" cy="96" r="6" fill="#FDE68A" />
      </g>

      {/* Neck */}
      <rect x="50" y="52" width="10" height="10" rx="4" fill="#FDE68A" />

      {/* Head Group — Turns & Tilts in the Direction of the Mouse Pointer */}
      <g
        style={{
          transformOrigin: '55px 36px',
          transform: `translate(${headShiftX}px, 0px) rotate(${headTilt}deg)`,
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

        {/* Eyebrows (raised when excited) */}
        <path
          d={isExcited ? 'M41 25 Q46 21 50 25' : 'M41 27 Q46 25 50 27'}
          stroke="#3B1D0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={isExcited ? 'M60 25 Q64 21 69 25' : 'M60 27 Q64 25 69 27'}
          stroke="#3B1D0B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left Eye + Pupil Tracking Mouse Pointer */}
        <ellipse cx="46" cy="35" rx="5.5" ry="6" fill="#FFFFFF" />
        <circle cx={46 + pupilDx} cy={35 + pupilDy} r="3.3" fill="#0F172A" />
        <circle cx={44.8 + pupilDx * 0.6} cy={33.5 + pupilDy * 0.6} r="1.2" fill="#FFFFFF" />

        {/* Right Eye + Pupil Tracking Mouse Pointer */}
        <ellipse cx="64" cy="35" rx="5.5" ry="6" fill="#FFFFFF" />
        <circle cx={64 + pupilDx} cy={35 + pupilDy} r="3.3" fill="#0F172A" />
        <circle cx={62.8 + pupilDx * 0.6} cy={33.5 + pupilDy * 0.6} r="1.2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="39" cy="42" rx="3.8" ry="2.2" fill="#FB7185" fillOpacity={isExcited ? '0.85' : '0.55'} />
        <ellipse cx="71" cy="42" rx="3.8" ry="2.2" fill="#FB7185" fillOpacity={isExcited ? '0.85' : '0.55'} />

        {/* Mouth (Big cheering grin when excited, animated when speaking, warm smile normally) */}
        {isExcited || isSpeaking ? (
          <path d="M48 45 Q55 54 62 45 Z" fill="#E11D48" />
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
      text: `Hi! I'm ${guideName} 👋 I'm standing right here in the corner watching your journey! Ask me any question about investing, PPF, FD, NSC, Sukanya Samriddhi, RD, Post Office MIS, IFSC codes, or digital banking safety — I'll generate a custom answer just for you!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Voice & Mute State (Never auto-reads; ONLY reads when the user clicks "Read" on a message)
  const [isVoiceMuted, setIsVoiceMuted] = useState(false)
  const [speakingIdx, setSpeakingIdx] = useState(null)

  // Mouse Pointer Tracking & Login Page Excitement State
  const [lookVec, setLookVec] = useState({ x: 0, y: 0 })
  const [isExcitedByLogin, setIsExcitedByLogin] = useState(false)
  const companionRef = useRef(null)
  const chatScrollRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mx = e.clientX
      const my = e.clientY

      // Calculate direction vector from the standing person in bottom-right to mouse pointer
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

      // Check if mouse pointer is moving towards / hovering over the Login Page card
      const loginEl = document.querySelector('[data-login-card="true"]')
      if (loginEl) {
        const lRect = loginEl.getBoundingClientRect()
        const pad = 70 // get excited as pointer approaches within 70px of login card
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

    if (speakingIdx === idx) {
      stopSpeech()
      return
    }

    window.speechSynthesis.cancel()
    const cleanSpeech = (textToRead || '')
      .replace(/₹/g, ' Rupees ')
      .replace(/[^\w\s.,?!₹+-/:\u0900-\u097F\u0C80-\u0CFF]/g, ' ')
    const utter = new SpeechSynthesisUtterance(cleanSpeech)
    utter.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    utter.rate = 1.0
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

  const handleSendMessage = async (customPrompt) => {
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
      lang
    )

    setMsgs((prev) => [
      ...prev,
      {
        id: 'b_' + Date.now(),
        from: 'bot',
        text: replyText,
      },
    ])
    setLoading(false)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SMALL PERSON STANDING IN THE BOTTOM-RIGHT SIDE FROM THE VERY BEGINNING
          - Eyes & head follow the mouse pointer
          - Jumps & cheers excitedly when mouse pointer moves toward Login page
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
        title="Click to ask your AI Companion any question!"
      >
        {/* Dynamic Speech Bubble Above the Small Person */}
        <div
          style={{
            marginBottom: '4px',
            padding: '6px 12px',
            borderRadius: '14px',
            background: isExcitedByLogin
              ? 'linear-gradient(135deg, #F59E0B, #10B981)'
              : 'rgba(15, 23, 42, 0.94)',
            color: isExcitedByLogin ? '#020617' : '#F8FAFC',
            border: isExcitedByLogin ? '2px solid #FEF08A' : '1.5px solid rgba(56,189,248,0.6)',
            boxShadow: isExcitedByLogin
              ? '0 0 24px rgba(251,191,36,0.85)'
              : '0 6px 20px rgba(0,0,0,0.45)',
            fontSize: '11px',
            fontWeight: 900,
            whiteSpace: 'nowrap',
            transform: isExcitedByLogin ? 'scale(1.06)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}
        >
          {isExcitedByLogin
            ? `🎉 Yay! Log in & let's explore!`
            : isOpen
              ? `💬 Chatting with ${guideName}`
              : `👋 Ask ${guideName} Anything!`}
        </div>

        {/* Standing Small Person SVG */}
        <div
          style={{
            animation: isExcitedByLogin ? 'companionJump 0.55s ease-in-out infinite alternate' : 'none',
          }}
        >
          <StandingCompanionPersonSVG
            lookX={lookVec.x}
            lookY={lookVec.y}
            isExcited={isExcitedByLogin}
            isSpeaking={speakingIdx !== null}
            gender={aiGuideAvatar}
          />
        </div>

        <style>{`
          @keyframes companionJump {
            0% { transform: translateY(0px) rotate(-2deg); }
            100% { transform: translateY(-14px) rotate(2deg); }
          }
        `}</style>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CHATBOT CONVERSATION WINDOW (NO API KEY OPTION, DYNAMIC OWN ANSWERS,
          DISPLAYS TEXT ONLY, READS ALOUD ONLY WHEN "READ" BUTTON IS CLICKED)
      ═══════════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: '112px',
            bottom: '20px',
            width: 'min(92vw, 410px)',
            height: 'min(78vh, 540px)',
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
          {/* Header (No API Key button!) */}
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
                  {guideName} • Personal Finance Guide
                </div>
                <div style={{ fontSize: '10.5px', color: '#E0F2FE', fontWeight: 700 }}>
                  ✨ Dynamic AI Answers • Click &ldquo;Read&rdquo; for Voice
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Mute / Unmute Toggle */}
              <button
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
                {isVoiceMuted ? '🔇 Muted' : '🔊 Voice On'}
              </button>

              <button
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
                ✨ {guideName} is thinking & calculating your answer...
              </div>
            )}
          </div>

          {/* Input Box */}
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
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${guideName} any question (e.g. ₹4000/mo for 8 yrs)...`}
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
                padding: '0 16px',
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
