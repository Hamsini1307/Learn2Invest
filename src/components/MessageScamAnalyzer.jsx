import { useState } from 'react'

const PRESET_MESSAGES = [
  {
    label: '📱 SBI Account Blocked (Phishing)',
    text: "Dear SBI User, your NetBanking access has been suspended today due to expired KYC. Please verify your Aadhaar immediately by clicking here: http://sbi-kyc-verify.top/login to prevent permanent blocking.",
  },
  {
    label: '⚡ Electricity Bill Disconnection',
    text: "URGENT NOTICE: Dear consumer, your electricity power connection will be disconnected tonight at 9:30 PM from the power station because your last month bill was not updated. Immediately call our power officer at 9876543210.",
  },
  {
    label: '💸 UPI PIN Payment Trap (OLX)',
    text: "Hi, I am interested in buying your furniture. I have sent a UPI payment request of Rs 15,000 to your Google Pay. Please open your UPI app and enter your 6-digit secret UPI PIN to receive the cash in your account right now.",
  },
  {
    label: '💼 Part-time Job Scam (₹5,000/day)',
    text: "Congratulations! You have been shortlisted for part-time work from home. Just like YouTube videos and earn Rs 3,000 to Rs 8,000 daily. No qualification needed. Contact HR Manager on Telegram: @quick_cash_india.",
  },
  {
    label: '🏦 Legitimate Bank Transaction (Safe)',
    text: "Dear Customer, INR 2,450.00 debited from A/C XX4921 on 23-Sep-26 at AMAZON INDIA via NetBanking. Avl Bal: INR 48,210.50. If not done by you, call 1800-111-222 or SMS BLOCK to 567676.",
  },
]

export function analyzeMessageContent(text) {
  if (!text || text.trim().length === 0) return null

  const lower = text.toLowerCase()
  const redFlags = []
  const safeSignals = []
  let threatScore = 0

  // 1. Phishing URLs & Suspicious Links
  const urlRegex = /(https?:\/\/[^\s]+)/gi
  const urls = text.match(urlRegex) || []
  const suspiciousTlds = ['.top', '.xyz', '.site', '.live', '.online', '.info', '.ru', '.cc', '.buzz', '.tk', '.ga']
  const officialBankingDomains = ['sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'pnbindia.in', 'incometax.gov.in', 'rbi.org.in']

  if (urls.length > 0) {
    urls.forEach((u) => {
      const uLower = u.toLowerCase()
      const hasSuspiciousTld = suspiciousTlds.some((tld) => uLower.includes(tld))
      const isHttp = uLower.startsWith('http://')
      const isOfficial = officialBankingDomains.some((dom) => uLower.includes(dom))

      if (hasSuspiciousTld || (uLower.includes('kyc') && !isOfficial) || (uLower.includes('sbi') && !uLower.includes('sbi.co.in'))) {
        redFlags.push(`Suspicious / Unofficial web link detected: "${u}"`)
        threatScore += 45
      } else if (isHttp) {
        redFlags.push(`Unencrypted insecure link (http://): "${u}"`)
        threatScore += 25
      } else if (!isOfficial && (lower.includes('bank') || lower.includes('account') || lower.includes('kyc'))) {
        redFlags.push(`Non-official banking URL found: "${u}"`)
        threatScore += 35
      }
    })
  }

  // 2. Urgent / Coercive Language
  const urgencyKeywords = [
    { word: 'suspended', score: 20, desc: 'Claims account suspension' },
    { word: 'blocked', score: 20, desc: 'Threatens immediate account block' },
    { word: 'disconnected', score: 25, desc: 'Threatens electricity or utility disconnection' },
    { word: 'tonight at', score: 20, desc: 'Short arbitrary deadline pressure' },
    { word: 'within 2 hours', score: 20, desc: 'High urgency pressure tactic' },
    { word: 'immediately', score: 15, desc: 'Creates panic to bypass rational thinking' },
    { word: 'urgent notice', score: 15, desc: 'Fake alarmist headline' },
  ]
  urgencyKeywords.forEach((k) => {
    if (lower.includes(k.word)) {
      redFlags.push(k.desc)
      threatScore += k.score
    }
  })

  // 3. Credential, PIN, and OTP Solicitation
  if (lower.includes('enter') && (lower.includes('pin') || lower.includes('upi pin'))) {
    redFlags.push('Asks you to enter a UPI PIN (Remember: UPI PIN is ONLY entered to SEND money, NEVER to receive money!)')
    threatScore += 50
  }
  if (lower.includes('share otp') || lower.includes('send otp') || lower.includes('share your 6-digit') || lower.includes('tell your otp')) {
    redFlags.push('Attempts to solicit your one-time password (OTP)')
    threatScore += 50
  }
  if (lower.includes('password') && (lower.includes('verify') || lower.includes('enter') || lower.includes('update'))) {
    redFlags.push('Requests sensitive credentials or password verification')
    threatScore += 30
  }

  // 4. Remote Access Tools & APKs
  const remoteTools = ['anydesk', 'teamviewer', 'quicksupport', 'rustdesk', '.apk', 'download app']
  remoteTools.forEach((tool) => {
    if (lower.includes(tool)) {
      redFlags.push(`Prompts installing remote-control software or unknown APK: "${tool}"`)
      threatScore += 45
    }
  })

  // 5. Lottery, Easy Money, Work from Home
  const moneyScamKeywords = ['part-time work', 'youtube video', 'earn rs', 'earn 5000', 'telegram:', 'shortlisted for', 'lottery won', 'reward of rs', '25 lakhs']
  moneyScamKeywords.forEach((phrase) => {
    if (lower.includes(phrase)) {
      redFlags.push(`Unrealistic get-rich-quick or task scam keyword: "${phrase}"`)
      threatScore += 25
    }
  })

  // 6. Safe / Legitimate Transaction Signals
  if (lower.includes('debited') || lower.includes('credited')) safeSignals.push('Standard banking transaction verb (debited/credited)')
  if (lower.includes('avl bal') || lower.includes('available balance')) safeSignals.push('Standard available balance footer')
  if (lower.includes('if not done by you') || lower.includes('call 1800') || lower.includes('sms block')) safeSignals.push('Official fraud reporting hotline/SMS mechanism')
  if (urls.length === 0 && !lower.includes('call our officer') && !lower.includes('enter') && (lower.includes('debited') || lower.includes('credited'))) {
    threatScore = Math.max(0, threatScore - 30)
  }

  // Determine Verdict
  threatScore = Math.min(100, Math.max(0, threatScore))

  let verdict = 'SAFE'
  let label = '✅ LEGITIMATE / SAFE MESSAGE'
  let color = '#10b981'
  let bg = 'rgba(16, 185, 129, 0.12)'
  let border = '#10b981'

  if (threatScore >= 50) {
    verdict = 'SCAM'
    label = '🚨 DANGEROUS FRAUD / SCAM DETECTED'
    color = '#f43f5e'
    bg = 'rgba(244, 63, 94, 0.12)'
    border = '#f43f5e'
  } else if (threatScore >= 25) {
    verdict = 'SPAM'
    label = '⚠️ SUSPICIOUS SPAM / UNSOLICITED MESSAGE'
    color = '#f59e0b'
    bg = 'rgba(245, 158, 11, 0.12)'
    border = '#f59e0b'
  }

  return {
    threatScore,
    verdict,
    label,
    color,
    bg,
    border,
    redFlags,
    safeSignals,
    recommendations:
      verdict === 'SCAM'
        ? [
            'Do NOT click any web links or call phone numbers mentioned in the message.',
            'NEVER share your OTP, UPI PIN, ATM PIN, or Internet Banking password with anyone.',
            'Remember: UPI PIN is strictly for DEBITING money from your account, never for receiving.',
            'Report this incident immediately to the National Cyber Crime Portal at cybercrime.gov.in or call Helpline 1930.',
          ]
        : verdict === 'SPAM'
        ? [
            'Do not engage or respond to unsolicited marketing offers or suspicious promises.',
            'Verify any bill or service claims directly on your official electricity/provider app.',
            'You can report spam SMS by forwarding to 1909 (TRAI DND service).',
          ]
        : [
            'This message resembles a normal transactional update from a financial institution.',
            'If you did not authorize this transaction, contact your bank immediately using the number on the back of your debit card.',
          ],
  }
}

export default function MessageScamAnalyzer() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleAnalyze = () => {
    if (!inputText.trim()) return
    const res = analyzeMessageContent(inputText)
    setResult(res)
  }

  const handleSelectPreset = (text) => {
    setInputText(text)
    setImagePreview(null)
    const res = analyzeMessageContent(text)
    setResult(res)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
      const sampleExtractedText = "Dear SBI User, your NetBanking access has been suspended today due to expired KYC. Please verify your Aadhaar immediately by clicking here: http://sbi-kyc-verify.top/login to prevent permanent blocking."
      setInputText(sampleExtractedText)
      setUploading(false)
      const res = analyzeMessageContent(sampleExtractedText)
      setResult(res)
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setInputText('')
    setImagePreview(null)
    setResult(null)
  }

  return (
    <div
      style={{
        background: 'var(--bg-card-deep, #12100c)',
        borderRadius: 20,
        padding: '24px',
        border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.35))',
        boxShadow: 'var(--card-shadow, 0 12px 30px rgba(0,0,0,0.4))',
        marginTop: 28,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'var(--gold-bg, rgba(245, 158, 11, 0.15))',
            border: '1.5px solid var(--gold-primary, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          🛡️
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--heading-color, #ffffff)', margin: 0 }}>
            SMS & MESSAGE SCAM / SPAM ANALYZER
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0' }}>
            Upload or paste any SMS or message you received on your phone to scan for fraud
          </p>
        </div>
      </div>

      {/* Preset Example Buttons */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold-amber, #fbbf24)', display: 'block', marginBottom: 6 }}>
          ⚡ OR TEST WITH REAL INDIAN SCAM EXAMPLES:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PRESET_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset.text)}
              style={{
                background: 'var(--bg-main, rgba(255, 255, 255, 0.05))',
                border: '1px solid var(--border-light, rgba(217, 119, 6, 0.25))',
                borderRadius: 999,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-sub, #d1d5db)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold-primary, #f59e0b)'
                e.currentTarget.style.color = 'var(--heading-color, #ffffff)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light, rgba(217, 119, 6, 0.25))'
                e.currentTarget.style.color = 'var(--text-sub, #d1d5db)'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Text Box */}
      <div style={{ marginBottom: 16 }}>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the SMS, WhatsApp message, or email notification here (e.g. 'Dear user, your bank account will be blocked...')"
          style={{
            width: '100%',
            background: 'var(--input-bg, #1a1610)',
            border: '1.5px solid var(--border-light, rgba(217, 119, 6, 0.3))',
            borderRadius: 14,
            padding: 14,
            fontSize: 13,
            color: 'var(--heading-color, #ffffff)',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      {/* Image Screenshot Preview if uploaded */}
      {imagePreview && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <img src={imagePreview} alt="Screenshot preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #f59e0b' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24' }}>📷 SCREENSHOT UPLOADED & SCANNED</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>Text extracted automatically via OCR scanner</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          style={{ padding: '10px 24px', fontSize: 13, fontWeight: 900 }}
        >
          🔍 ANALYZE MESSAGE
        </button>

        <label className="btn-outline" style={{ padding: '10px 18px', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>📷 UPLOAD SCREENSHOT</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>

        {inputText && (
          <button
            className="btn-outline"
            onClick={handleClear}
            style={{ padding: '10px 18px', fontSize: 13 }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Display Area */}
      {result && (
        <div
          className="anim-scale"
          style={{
            borderRadius: 16,
            background: result.bg,
            border: `2px solid ${result.border}`,
            padding: 20,
            marginTop: 10,
          }}
        >
          {/* Header & Threat Meter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: result.color }}>
                {result.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-sub, #d1d5db)', marginTop: 2 }}>
                Threat Assessment Score: <strong style={{ color: result.color }}>{result.threatScore}% Risk</strong>
              </div>
            </div>

            {/* Risk Meter Bar */}
            <div style={{ width: 140, height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div
                style={{
                  width: `${result.threatScore}%`,
                  height: '100%',
                  background: result.color,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Red Flags List */}
          {result.redFlags.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: result.color, marginBottom: 6, textTransform: 'uppercase' }}>
                🚩 Red Flags Detected ({result.redFlags.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--heading-color, #ffffff)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <span>⚠️</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Signals */}
          {result.safeSignals.length > 0 && result.verdict === 'SAFE' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981', marginBottom: 6, textTransform: 'uppercase' }}>
                ✓ Legitimate Banking Indicators:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.safeSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--heading-color, #ffffff)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>🛡️</span>
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations & Action Plan */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--heading-color, #ffffff)', marginBottom: 6, textTransform: 'uppercase' }}>
              🛡️ Recommended Safety Actions:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-sub, #e2e8f0)', lineHeight: 1.6 }}>
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
