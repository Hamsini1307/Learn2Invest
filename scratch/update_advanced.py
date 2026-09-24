code = '''import React, { useState, useEffect, useRef } from 'react'
import { INSTITUTIONS, FORM_CATEGORIES, BANK_TEMPLATES_CONFIG } from '../config/bankTemplates'
import MessageScamAnalyzer from '../components/MessageScamAnalyzer.jsx'

const CYBER_SCENARIOS = [
  {
    id: 1,
    title: "📱 The Phishing SMS Trap",
    scenario: "You receive an SMS from a number claiming to be your bank: 'Dear user, your bank account will be blocked. Click here to verify now: block-sbi.org'",
    opts: [
      { text: "Click the link immediately to verify and avoid getting blocked.", correct: false },
      { text: "Ignore the SMS. Banks never send warning links from random phone numbers.", correct: true }
    ],
    explain: "Banks never send SMS containing verification web links. Entering your password on unknown links leaks your credentials."
  },
  {
    id: 2,
    title: "📞 The Fake Customer Support Call",
    scenario: "A person claiming to be a bank manager calls asking for the 6-digit OTP sent to your phone to 'upgrade your KYC status' and prevent card suspension.",
    opts: [
      { text: "Share the OTP since it is from a customer support manager.", correct: false },
      { text: "Never share the OTP. Bank officials will never ask for PINs or OTPs.", correct: true }
    ],
    explain: "An OTP is a secret one-time password. Sharing it allows attackers to bypass security and transfer your funds."
  },
  {
    id: 3,
    title: "💸 The UPI Payment Trap",
    scenario: "Someone wants to buy your old bicycle online and sends a UPI 'Collect Request' asking for your UPI PIN to transfer the cash to you.",
    opts: [
      { text: "Enter your PIN to receive the payment.", correct: false },
      { text: "Decline the request. A UPI PIN is only needed to SEND money, never to receive it.", correct: true }
    ],
    explain: "This is a common UPI scam. PINs are only entered when debited. Receiving money requires no PIN."
  },
  {
    id: 4,
    title: "📶 Public Wi-Fi Danger",
    scenario: "You are at a coffee shop and want to check your bank balance. The shop has a free public Wi-Fi network.",
    opts: [
      { text: "Connect to the public Wi-Fi and complete the net banking transfer.", correct: false },
      { text: "Use cellular data (4G/5G) or a secure VPN, as public Wi-Fi can leak bank credentials.", correct: true }
    ],
    explain: "Public Wi-Fi networks can be sniffed or spoofed by hackers to capture passwords. Always use private networks for banking."
  }
]

const VIDEOS_DB = {
  upi_working: {
    title: "🏦 Part 1: Digital Banking Overview",
    url: "https://www.youtube.com/embed/zvPyqN-FEPQ?rel=0",
    desc: "An overview of digital banking and mobile channels."
  },
  safety_phishing: {
    title: "🛡️ Spam & Phishing Safety",
    url: "https://www.youtube.com/embed/NI37JI7KnSc?rel=0",
    desc: "An animated guide explaining email spam and password protection."
  },
  card_basics: {
    title: "💳 Debit & Credit Cards Guide",
    url: "https://www.youtube.com/embed/mllbYh0DFMc?rel=0",
    desc: "A breakdown of Credit vs Debit cards and interest calculation."
  }
}

// Helper to convert numeric amount to Indian Rupees in Words
function numberToWords(num) {
  if (!num || isNaN(num) || num <= 0) return ''
  const a = ['','ONE ','TWO ','THREE ','FOUR ','FIVE ','SIX ','SEVEN ','EIGHT ','NINE ','TEN ','ELEVEN ','TWELVE ','THIRTEEN ','FOURTEEN ','FIFTEEN ','SIXTEEN ','SEVENTEEN ','EIGHTEEN ','NINETEEN ']
  const b = ['', '', 'TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY']

  function inWords(n) {
    if ((n = n.toString()).length > 9) return 'overflow'
    let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!n_array) return ''
    let words = ''
    words += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'CRORE ' : ''
    words += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'LAKH ' : ''
    words += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'THOUSAND ' : ''
    words += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'HUNDRED ' : ''
    words += (n_array[5] != 0) ? ((words != '') ? 'AND ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : ''
    return words
  }

  const result = inWords(num).trim()
  return result ? `${result} RUPEES ONLY` : ''
}

export default function Advanced({ go, goBack, state, update, addXP, themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const registeredUserName = state?.user?.name || 'Niyathi'
  const [activeMainTab, setActiveMainTab] = useState('slips') // 'slips' | 'digital'

  // Selected Bank & Form Category
  const [selectedBankId, setSelectedBankId] = useState('canara')
  const [docType, setDocType] = useState('deposit')

  // Search Mode for Branch / IFSC
  const [searchMode, setSearchMode] = useState('city_branch')
  const [cityInput, setCityInput] = useState('')
  const [branchInput, setBranchInput] = useState('')
  const [ifscInput, setIfscInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedBranchInfo, setSelectedBranchInfo] = useState(null)

  // Single Master User Data Object
  const [userData, setUserData] = useState({
    name: registeredUserName,
    accountNumber: '',
    mobileNumber: '',
    email: '',
    branch: '',
    ifsc: '',
    amount: '',
    chequeNumber: '',
    date: new Date().toISOString().split('T')[0],
    notes500: 0,
    notes200: 0,
    notes100: 0,
    notes50: 0,
    signature: null
  })

  // Calibration Engine
  const [calibrationMode, setCalibrationMode] = useState(false)
  const [templateConfigs, setTemplateConfigs] = useState(BANK_TEMPLATES_CONFIG)

  // Digital Banking Game state
  const [digitalScenarioIdx, setDigitalScenarioIdx] = useState(0)
  const [shieldScore, setShieldScore] = useState(100)
  const [digitalFeedback, setDigitalFeedback] = useState('')
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [cyberGameCompleted, setCyberGameCompleted] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('upi_working')

  // Certificate State
  const [showCertModal, setShowCertModal] = useState(false)

  const templateKey = `${selectedBankId}_${docType}`
  const currentTemplate = templateConfigs[templateKey] || BANK_TEMPLATES_CONFIG['canara_deposit']

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        setUserData(prev => ({ ...prev, signature: uploadEvent.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePerformSearch = async () => {
    setSearchLoading(true)
    if (searchMode === 'ifsc') {
      const code = ifscInput.trim().toUpperCase()
      if (!code) {
        alert('Please enter an IFSC code to search.')
        setSearchLoading(false)
        return
      }
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${code}`)
        if (res.ok) {
          const data = await res.json()
          const matched = {
            bankName: data.BANK,
            branchName: data.BRANCH,
            city: data.CITY,
            ifsc: code,
            address: `${data.ADDRESS}, ${data.CITY}, ${data.STATE}`
          }
          setSelectedBranchInfo(matched)
          setUserData(prev => ({ ...prev, branch: `${data.BRANCH}, ${data.CITY}`, ifsc: code }))
        } else {
          alert(`IFSC Code "${code}" not found.`)
        }
      } catch (err) {
        alert(`Could not fetch IFSC data.`)
      }
    } else {
      const cityQ = cityInput.trim()
      const branchQ = branchInput.trim()
      if (!cityQ && !branchQ) {
        alert('Please enter a City or Branch Name.')
        setSearchLoading(false)
        return
      }
      const matched = {
        bankName: INSTITUTIONS.find(b => b.id === selectedBankId)?.name || 'Canara Bank',
        branchName: branchQ || 'Main Branch',
        city: cityQ || 'City',
        ifsc: 'CNRB0001001',
        address: `${branchQ || 'Main'} Branch, ${cityQ || 'City'}`
      }
      setSelectedBranchInfo(matched)
      setUserData(prev => ({ ...prev, branch: `${matched.branchName}, ${matched.city}` }))
    }
    setSearchLoading(false)
  }

  const updateFieldCoord = (fieldId, prop, value) => {
    setTemplateConfigs(prev => {
      const updatedFields = prev[templateKey].fields.map(f => {
        if (f.id === fieldId) {
          return { ...f, [prop]: value }
        }
        return f
      })
      return {
        ...prev,
        [templateKey]: {
          ...prev[templateKey],
          fields: updatedFields
        }
      }
    })
  }

  const denomTotal = (userData.notes500 * 500) + (userData.notes200 * 200) + (userData.notes100 * 100) + (userData.notes50 * 50)
  const effectiveAmount = denomTotal > 0 ? denomTotal : (parseFloat(userData.amount) || 0)
  const amountWords = numberToWords(effectiveAmount)

  const handleCyberAnswer = (optIndex) => {
    setSelectedOpt(optIndex)
    const currentScen = CYBER_SCENARIOS[digitalScenarioIdx]
    const isCorrect = currentScen.opts[optIndex].correct
    if (!isCorrect) {
      setShieldScore(prev => Math.max(0, prev - 25))
    }
    setDigitalFeedback(currentScen.explain)
  }

  const handleNextScenario = () => {
    setSelectedOpt(null)
    setDigitalFeedback('')
    if (digitalScenarioIdx < CYBER_SCENARIOS.length - 1) {
      setDigitalScenarioIdx(prev => prev + 1)
    } else {
      setCyberGameCompleted(true)
      if (addXP) addXP(50)
    }
  }

  const renderFieldValue = (field) => {
    let value = userData[field.bindKey]
    if (field.id.startsWith('denom500')) value = userData.notes500 > 0 ? `${userData.notes500}` : ''
    if (field.id.startsWith('denom200')) value = userData.notes200 > 0 ? `${userData.notes200}` : ''
    if (field.id.startsWith('denom100')) value = userData.notes100 > 0 ? `${userData.notes100}` : ''
    if (field.id.startsWith('denom50')) value = userData.notes50 > 0 ? `${userData.notes50}` : ''

    if (field.renderingMode === 'amount') {
      value = effectiveAmount > 0 ? `₹${effectiveAmount.toLocaleString('en-IN')}/-` : ''
    } else if (field.renderingMode === 'amountInWords') {
      value = amountWords
    }

    if (!value && field.renderingMode !== 'signature' && field.renderingMode !== 'checkbox') {
      return null
    }

    if (field.renderingMode === 'dateBoxes') {
      const digits = userData.date ? userData.date.split('-').reverse().join('').split('') : []
      return (
        <div key={field.id} style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: field.x ? `${field.x}%` : 'auto',
          right: field.right ? `${field.right}%` : 'auto',
          display: 'flex',
          gap: `${field.gap || 8}px`,
          fontSize: field.fontSize || '0.9rem',
          color: field.color || '#1d4ed8',
          fontWeight: field.fontWeight || 900,
          fontFamily: "'Courier New', monospace"
        }}>
          {digits.map((d, i) => (
            <span key={i} style={{ width: 14, textAlign: 'center' }}>{d}</span>
          ))}
        </div>
      )
    }

    if (field.renderingMode === 'accountBoxes') {
      const digits = (userData.accountNumber || '').split('')
      return (
        <div key={field.id} style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: field.x ? `${field.x}%` : 'auto',
          right: field.right ? `${field.right}%` : 'auto',
          display: 'flex',
          gap: `${field.gap || 12}px`,
          fontSize: field.fontSize || '0.95rem',
          color: field.color || '#1d4ed8',
          fontWeight: field.fontWeight || 900,
          fontFamily: "'Courier New', monospace"
        }}>
          {digits.map((d, i) => (
            <span key={i} style={{ width: 14, textAlign: 'center' }}>{d}</span>
          ))}
        </div>
      )
    }

    if (field.renderingMode === 'signature') {
      return userData.signature ? (
        <img
          key={field.id}
          src={userData.signature}
          alt="Signature"
          style={{
            position: 'absolute',
            top: `${field.y}%`,
            left: field.x ? `${field.x}%` : 'auto',
            right: field.right ? `${field.right}%` : 'auto',
            maxHeight: field.maxHeight || 40,
            maxWidth: 120,
            objectFit: 'contain',
            mixBlendMode: 'multiply'
          }}
        />
      ) : null
    }

    return (
      <div
        key={field.id}
        style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: field.x ? `${field.x}%` : 'auto',
          right: field.right ? `${field.right}%` : 'auto',
          fontSize: field.fontSize || '0.9rem',
          color: field.color || '#1e3a8a',
          fontWeight: field.fontWeight || 800,
          fontFamily: field.fontFamily || "'Comic Sans MS', 'Chalkboard SE', cursive",
          whiteSpace: 'nowrap'
        }}
      >
        {value}
      </div>
    )
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={goBack || (() => go('landing'))}
          style={{
            background: 'var(--bg-card, rgba(18, 16, 12, 0.9))',
            border: '1.5px solid rgba(217, 119, 6, 0.4)',
            color: 'var(--gold-amber, #fbbf24)',
            borderRadius: 999,
            padding: '8px 18px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          <span>⬅</span>
          <span>Back to Main Page</span>
        </button>

        <button
          onClick={() => setShowCertModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 999,
            padding: '8px 20px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
          }}
        >
          <span>🎓</span>
          <span>CLAIM BANKING CERTIFICATE</span>
        </button>
      </div>

      {/* Main Mode Switcher: Bank Slips vs Digital Banking & Safety */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveMainTab('slips')}
          className={activeMainTab === 'slips' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 200px', fontSize: 13, padding: '12px 18px' }}
        >
          📜 15 REAL INDIAN BANK FORM TEMPLATES
        </button>
        <button
          onClick={() => setActiveMainTab('digital')}
          className={activeMainTab === 'digital' ? 'btn-primary' : 'btn-outline'}
          style={{ flex: '1 1 200px', fontSize: 13, padding: '12px 18px' }}
        >
          🌐 DIGITAL BANKING & SAFETY 🛡️
        </button>
      </div>

      {activeMainTab === 'slips' && (
        <div className="anim-fade">
          {/* Title Banner */}
          <div className="glass-card-deep anim-scale" style={{
            padding: '24px', borderRadius: 24, marginBottom: 20,
            background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
            border: '2px solid #ea580c',
            boxShadow: isLight ? '0 10px 30px rgba(234, 88, 12, 0.12)' : '0 0 40px rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #ea580c, #f59e0b)',
                color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 900
              }}>
                🏛️
              </div>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom: 4 }}>
                  LEVEL 3 • 15 REAL INDIAN BANK FORM TEMPLATES
                </div>
                <h1 className="font-display" style={{ fontSize: 26, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  INDIAN BANK BRANCH FINDER & REAL PAPER SLIP WRITER
                </h1>
                <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 12, margin: '4px 0 0', fontWeight: 600 }}>
                  Select from 5 top Indian financial institutions and write inside authentic paper deposit slips, withdrawal forms, and cheque leaves!
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Bank & Form Selection Tabs */}
          <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
              🏛️ SELECT FINANCIAL INSTITUTION (5 BANKS)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 16 }}>
              {INSTITUTIONS.map(inst => (
                <div
                  key={inst.id}
                  onClick={() => setSelectedBankId(inst.id)}
                  style={{
                    background: selectedBankId === inst.id ? (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.2)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'),
                    border: `2px solid ${selectedBankId === inst.id ? '#ea580c' : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)')}`,
                    borderRadius: 14, padding: 12, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>{inst.name}</div>
                  <div style={{ fontSize: 10, color: '#ea580c', fontWeight: 700, marginTop: 2 }}>IFSC: {inst.code}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 8 }}>
              📜 SELECT FORM CATEGORY
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FORM_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setDocType(cat.id)}
                  style={{
                    padding: '8px 18px', borderRadius: 999, fontSize: 12, fontWeight: 900, cursor: 'pointer',
                    background: docType === cat.id ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
                    color: docType === cat.id ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
                    border: `1.5px solid ${docType === cat.id ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Master Input Form */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
              ✍️ ENTER YOUR INFORMATION ONCE (SYSTEM RENDERS IT IN ALL LOCATIONS ON THE SLIP)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>ACCOUNT HOLDER / PAYEE NAME</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                  placeholder="e.g. Niyathi"
                  className="input-light"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>ACCOUNT NUMBER</label>
                <input
                  type="text"
                  value={userData.accountNumber}
                  onChange={e => setUserData({ ...userData, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  placeholder="e.g. 10293847561"
                  className="input-light"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, fontWeight: 800, letterSpacing: '1px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>DATE</label>
                <input
                  type="date"
                  value={userData.date}
                  onChange={e => setUserData({ ...userData, date: e.target.value })}
                  className="input-light"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>AMOUNT (₹)</label>
                <input
                  type="number"
                  value={userData.amount}
                  onChange={e => setUserData({ ...userData, amount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="input-light"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13, fontWeight: 800 }}
                />
              </div>
            </div>

            {/* Denominations */}
            {docType === 'deposit' && (
              <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 14, border: '1px solid rgba(234, 88, 12, 0.2)', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', marginBottom: 8 }}>💵 CASH DENOMINATION BREAKDOWN</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: '#9ca3af' }}>₹500 NOTES</label>
                    <input type="number" min="0" value={userData.notes500} onChange={e => setUserData({ ...userData, notes500: parseInt(e.target.value) || 0 })} className="input-light" style={{ width: '100%', padding: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#9ca3af' }}>₹200 NOTES</label>
                    <input type="number" min="0" value={userData.notes200} onChange={e => setUserData({ ...userData, notes200: parseInt(e.target.value) || 0 })} className="input-light" style={{ width: '100%', padding: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#9ca3af' }}>₹100 NOTES</label>
                    <input type="number" min="0" value={userData.notes100} onChange={e => setUserData({ ...userData, notes100: parseInt(e.target.value) || 0 })} className="input-light" style={{ width: '100%', padding: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: '#9ca3af' }}>₹50 NOTES</label>
                    <input type="number" min="0" value={userData.notes50} onChange={e => setUserData({ ...userData, notes50: parseInt(e.target.value) || 0 })} className="input-light" style={{ width: '100%', padding: '6px' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Signature Upload */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>UPLOAD SIGNATURE PNG/JPG</label>
              <input type="file" accept="image/*" onChange={handleSignatureUpload} style={{ fontSize: 12, color: isLight ? '#0f172a' : '#ffffff' }} />
            </div>
          </div>

          {/* Section 3: Live Slip Rendering */}
          <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, background: isLight ? '#ffffff' : '#12100c', border: '2px solid #ea580c', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#ea580c', marginBottom: 12, textTransform: 'uppercase' }}>
              📜 LIVE BANK SLIP CANVAS ({currentTemplate.title})
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: 900, margin: '0 auto', overflow: 'hidden', borderRadius: 12, border: '2px solid rgba(234, 88, 12, 0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <img src={currentTemplate.image} alt={currentTemplate.title} style={{ width: '100%', display: 'block' }} />
              {currentTemplate.fields.map(field => renderFieldValue(field))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Digital Banking & Safety */}
      {activeMainTab === 'digital' && (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', marginBottom: 24, background: 'var(--bg-card-deep, #12100c)', border: '2px solid rgba(217,119,6,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
              🌐 CYBER SAFETY ARENA
            </div>
            <h2 className="font-display" style={{ fontSize: 36, color: 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              DIGITAL BANKING & SAFETY 🛡️
            </h2>
            <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
              Defend your bank account against real-world phishing traps and cyber scams!
            </p>
          </div>

          {!cyberGameCompleted ? (
            <div className="glass-card" style={{ padding: 24, border: '2px solid #f59e0b', background: 'var(--bg-card-deep, #12100c)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>
                  SCENARIO {digitalScenarioIdx + 1} OF {CYBER_SCENARIOS.length}
                </span>
                <div className="sticker-badge sticker-yellow">
                  🛡️ SHIELD HEALTH: {shieldScore}%
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.12)', borderRadius: 16, padding: 20,
                border: '1.5px solid #d97706', marginBottom: 20
              }}>
                <h3 style={{ fontWeight: 900, fontSize: 16, color: '#ffffff', marginBottom: 8 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].title}
                </h3>
                <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].scenario}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {CYBER_SCENARIOS[digitalScenarioIdx].opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCyberAnswer(i)}
                    className={selectedOpt === i ? (opt.correct ? 'btn-primary' : 'btn-pink') : 'btn-outline'}
                    style={{ textAlign: 'left', fontSize: 13, padding: '14px 18px', width: '100%' }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {digitalFeedback && (
                <div className="anim-fade" style={{
                  background: 'rgba(245,158,11,0.12)', border: '1.5px solid #f59e0b',
                  borderRadius: 14, padding: 16, marginBottom: 20, color: '#fef3c7', fontSize: 13, lineHeight: 1.5
                }}>
                  💡 {digitalFeedback}
                </div>
              )}

              {selectedOpt !== null && (
                <button className="btn-primary" onClick={handleNextScenario} style={{ width: '100%', fontSize: 14 }}>
                  {digitalScenarioIdx < CYBER_SCENARIOS.length - 1 ? 'NEXT SCENARIO →' : '🏆 FINISH CHALLENGE (+50 XP)'}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, background: 'var(--bg-card-deep, #12100c)' }} className="glass-card">
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛡️</div>
              <h3 className="font-display" style={{ fontSize: 32, color: '#fbbf24', marginBottom: 8 }}>
                CHALLENGE PASSED!
              </h3>
              <p style={{ color: 'var(--text-sub, #d1d5db)', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                Shield Health: {shieldScore}% • You earned +50 XP and mastered digital bank safety!
              </p>
              <button className="btn-primary" onClick={() => setCyberGameCompleted(false)}>
                🔄 REPLAY SAFETY ARENA
              </button>
            </div>
          )}

          {/* Message Scam Analyzer */}
          <MessageScamAnalyzer />

          {/* Video Tutorials Section */}
          <div style={{ marginTop: 32 }}>
            <h3 className="font-display" style={{ fontSize: 24, color: '#ffffff', marginBottom: 16 }}>
              🎬 DIGITAL BANKING TUTORIALS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              {Object.keys(VIDEOS_DB).map(vKey => (
                <button
                  key={vKey}
                  onClick={() => setSelectedVideo(vKey)}
                  className={selectedVideo === vKey ? 'btn-primary' : 'btn-outline'}
                  style={{ fontSize: 12, padding: '12px' }}
                >
                  {VIDEOS_DB[vKey].title}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16, border: '2px solid rgba(217,119,6,0.3)' }}>
              <iframe
                src={VIDEOS_DB[selectedVideo].url}
                title={VIDEOS_DB[selectedVideo].title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,7,5,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCertModal(false)}>
          <div className="glass-card-deep anim-scale" style={{ maxWidth: 500, width: '100%', borderRadius: 24, padding: 32, background: 'var(--bg-card-deep, #12100c)', border: '2px solid #10b981', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🎓</div>
            <h2 className="font-display" style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }}>
              OFFICIAL BANKING CERTIFICATE
            </h2>
            <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
              This certifies that <strong>{registeredUserName}</strong> has successfully completed Indian Bank Branch Identification and Paper Slip Writing Training on Learn2Invest!
            </p>
            <button className="btn-primary" onClick={() => setShowCertModal(false)} style={{ width: '100%', fontSize: 13 }}>
              CLOSE CERTIFICATE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
'''\nwith open('c:/Users/kavya/Downloads/Telegram Desktop/learn2invest_project/Learn2Invest/src/screens/Advanced.jsx', 'w', encoding='utf-8') as out:\n    out.write(advanced_code)