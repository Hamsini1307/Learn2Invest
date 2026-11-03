import { useState } from 'react'
import Tesseract from 'tesseract.js'

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

export default function MessageScamAnalyzer({ themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrError, setOcrError] = useState('')

  // Live evaluation to determine section color immediately when text is pasted or analyzed
  const liveResult = result || (inputText.trim().length > 5 ? analyzeMessageContent(inputText) : null)

  const isScam = liveResult && (liveResult.verdict === 'SCAM' || liveResult.threatScore >= 40)
  const isSafe = liveResult && liveResult.verdict === 'SAFE' && inputText.trim().length > 10

  // Dynamic Theme Colors: Default Blue, Red on Malicious/Unsafe, Green on Safe
  const sectionBorderColor = isScam ? '#ef4444' : isSafe ? '#10b981' : '#2563eb'
  const sectionBg = isScam ? '#fff5f5' : isSafe ? '#f0fdf4' : '#ffffff'
  const sectionShadow = isScam
    ? '0 25px 70px rgba(239, 68, 68, 0.35)'
    : isSafe
    ? '0 25px 70px rgba(16, 185, 129, 0.35)'
    : '0 25px 70px rgba(37, 99, 235, 0.28)'

  const accentColor = isScam ? '#dc2626' : isSafe ? '#059669' : '#2563eb'
  const badgeBg = isScam ? '#fee2e2' : isSafe ? '#d1fae5' : '#eff6ff'
  const badgeBorder = isScam ? '#f87171' : isSafe ? '#34d399' : '#60a5fa'
  const badgeText = isScam ? '#991b1b' : isSafe ? '#065f46' : '#1e40af'

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrError('')
    setOcrScanning(true)
    setOcrProgress(0)

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
    }
    reader.readAsDataURL(file)

    try {
      const ocrRes = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text' && typeof m.progress === 'number') {
              setOcrProgress(Math.round(m.progress * 100))
            }
          }
        }
      )
      const extractedText = (ocrRes?.data?.text || '').trim()
      if (extractedText) {
        setInputText(extractedText)
        const res = analyzeMessageContent(extractedText)
        setResult(res)
      } else {
        setOcrError('No readable text detected in this image. Please paste or enter the message text directly.')
      }
    } catch (err) {
      console.error('OCR Extraction error:', err)
      setOcrError('Failed to read text from screenshot. Please try pasting the message.')
    } finally {
      setOcrScanning(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setImagePreview(null)
    setResult(null)
    setOcrError('')
    setOcrProgress(0)
    setOcrScanning(false)
  }

  return (
    <div
      className="message-scam-analyzer"
      style={{
        background: sectionBg,
        borderRadius: 36,
        padding: '50px 56px',
        border: `5.5px solid ${sectionBorderColor}`,
        boxShadow: sectionShadow,
        marginTop: 40,
        fontFamily: "'Space Grotesk', sans-serif",
        transition: 'all 0.35s ease',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 34 }}>
        <div
          style={{
            width: 124,
            height: 124,
            borderRadius: 32,
            background: badgeBg,
            border: `5px solid ${sectionBorderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 72,
            shrink: 0,
            boxShadow: `0 10px 30px ${isScam ? 'rgba(239, 68, 68, 0.3)' : isSafe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
          }}
        >
          {isScam ? '🚨' : isSafe ? '✅' : '🛡️'}
        </div>
        <div>
          <h3
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: isScam ? '#b91c1c' : isSafe ? '#065f46' : '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            SMS & MESSAGE SCAM / SPAM ANALYZER
          </h3>
          <p
            style={{
              fontSize: 34,
              color: isScam ? '#991b1b' : isSafe ? '#047857' : '#334155',
              margin: '12px 0 0',
              fontWeight: 800,
              lineHeight: 1.45,
            }}
          >
            Upload or paste any SMS or message you received on your phone to scan for fraud
          </p>
        </div>
      </div>

      {/* Preset Example Buttons */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {PRESET_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset.text)}
              style={{
                background: badgeBg,
                border: `4px solid ${badgeBorder}`,
                borderRadius: 999,
                padding: '24px 44px',
                fontSize: 34,
                fontWeight: 900,
                color: badgeText,
                cursor: 'pointer',
                minHeight: 96,
                boxShadow: '0 8px 22px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s',
              }}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Text Box */}
      <div style={{ marginBottom: 26 }}>
        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the SMS, WhatsApp message, or email notification here (e.g. 'Dear user, your bank account will be blocked...')"
          style={{
            width: '100%',
            minHeight: 250,
            background: '#ffffff',
            border: `5px solid ${sectionBorderColor}`,
            borderRadius: 28,
            padding: '32px 38px',
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1.55,
            color: '#0f172a',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.08)',
            transition: 'border 0.3s ease',
          }}
        />
      </div>

      {/* Image Screenshot Preview if uploaded */}
      {imagePreview && (
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 18, background: badgeBg, padding: 20, borderRadius: 20, border: `3px solid ${badgeBorder}` }}>
          <img src={imagePreview} alt="Screenshot preview" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 14, border: `2px solid ${badgeBorder}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: badgeText, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>📷 SCREENSHOT {ocrScanning ? 'SCANNING...' : 'UPLOADED & SCANNED'}</span>
              {ocrScanning && <span style={{ fontSize: 22, color: accentColor }}>({ocrProgress}%)</span>}
            </div>
            <div style={{ fontSize: 22, color: '#475569', fontWeight: 800, marginTop: 4 }}>
              {ocrScanning ? 'Reading real text from image using OCR scanner...' : 'Text extracted automatically via real OCR scanner'}
            </div>
            {ocrScanning && (
              <div style={{ width: '100%', height: 10, background: '#fed7aa', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: `${ocrProgress}%`, height: '100%', background: accentColor, transition: 'width 0.2s ease' }} />
              </div>
            )}
            {ocrError && (
              <div style={{ fontSize: 22, color: '#dc2626', fontWeight: 900, marginTop: 6 }}>
                ⚠️ {ocrError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 34 }}>
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          style={{
            padding: '32px 64px',
            fontSize: 40,
            fontWeight: 900,
            borderRadius: 26,
            minHeight: 110,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            boxShadow: `0 14px 35px ${isScam ? 'rgba(239, 68, 68, 0.5)' : isSafe ? 'rgba(16, 185, 129, 0.5)' : 'rgba(37, 99, 235, 0.45)'}`,
            background: isScam
              ? 'linear-gradient(135deg, #dc2626, #ef4444)'
              : isSafe
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 48 }}>🔍</span>
          <span>ANALYZE MESSAGE</span>
        </button>

        <label
          style={{
            padding: '32px 56px',
            fontSize: 38,
            cursor: ocrScanning ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            fontWeight: 900,
            color: badgeText,
            borderColor: badgeBorder,
            border: `4px solid ${badgeBorder}`,
            borderRadius: 26,
            minHeight: 110,
            opacity: ocrScanning ? 0.6 : 1,
            background: badgeBg,
          }}
        >
          <span style={{ fontSize: 44 }}>{ocrScanning ? '⏳' : '📷'}</span>
          <span>{ocrScanning ? 'SCANNING IMAGE...' : 'UPLOAD SCREENSHOT'}</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={ocrScanning} style={{ display: 'none' }} />
        </label>

        {inputText && (
          <button
            onClick={handleClear}
            style={{
              padding: '32px 50px',
              fontSize: 38,
              fontWeight: 900,
              color: badgeText,
              borderColor: badgeBorder,
              border: `4px solid ${badgeBorder}`,
              borderRadius: 26,
              minHeight: 110,
              background: badgeBg,
              cursor: 'pointer',
            }}
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
            borderRadius: 28,
            background: result.verdict === 'SCAM' ? '#fff1f2' : result.verdict === 'SPAM' ? '#fff7ed' : '#ecfdf5',
            border: `4.5px solid ${result.border}`,
            padding: '36px 42px',
            marginTop: 20,
          }}
        >
          {/* Header & Threat Meter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 56, color: result.verdict === 'SCAM' ? '#e11d48' : result.verdict === 'SPAM' ? '#d97706' : '#059669', lineHeight: 1.2 }}>
                {result.label}
              </div>
              <div style={{ fontSize: 38, color: '#334155', marginTop: 12, fontWeight: 800 }}>
                Threat Assessment Score: <strong style={{ color: result.verdict === 'SCAM' ? '#e11d48' : result.verdict === 'SPAM' ? '#d97706' : '#059669' }}>{result.threatScore}% Risk</strong>
              </div>
            </div>

            {/* Risk Meter Bar */}
            <div style={{ width: 240, height: 22, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', border: '2px solid rgba(0,0,0,0.1)' }}>
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
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: result.verdict === 'SCAM' ? '#e11d48' : '#d97706', marginBottom: 18, textTransform: 'uppercase' }}>
                🚩 Red Flags Detected ({result.redFlags.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      padding: '28px 36px',
                      borderRadius: 22,
                      fontSize: 34,
                      fontWeight: 800,
                      color: '#991b1b',
                      border: '3.5px solid #fca5a5',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 18,
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>⚠️</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Signals */}
          {result.safeSignals.length > 0 && result.verdict === 'SAFE' && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#059669', marginBottom: 18, textTransform: 'uppercase' }}>
                ✓ Legitimate Banking Indicators ({result.safeSignals.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.safeSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      padding: '28px 36px',
                      borderRadius: 22,
                      fontSize: 34,
                      fontWeight: 800,
                      color: '#065f46',
                      border: '3.5px solid #6ee7b7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>🛡️</span>
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations & Action Plan */}
          <div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', marginBottom: 16, textTransform: 'uppercase' }}>
              🛡️ Recommended Safety Actions:
            </div>
            <ul style={{ margin: 0, paddingLeft: 34, fontSize: 34, color: '#1e293b', lineHeight: 1.6, fontWeight: 800, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
