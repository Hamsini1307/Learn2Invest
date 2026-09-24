import React, { useState, useEffect, useRef } from 'react'
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

  // Digital Banking & Security Game state variables
  const [digitalScenarioIdx, setDigitalScenarioIdx] = useState(0)
  const [shieldScore, setShieldScore] = useState(100)
  const [digitalFeedback, setDigitalFeedback] = useState('')
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [cyberGameCompleted, setCyberGameCompleted] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('upi_working')

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

  // Selected Bank & Form Category
  const [selectedBankId, setSelectedBankId] = useState('canara')
  const [docType, setDocType] = useState('deposit')

  // Search Mode for Branch / IFSC
  const [searchMode, setSearchMode] = useState('city_branch')
  const [cityInput, setCityInput] = useState('')
  const [branchInput, setBranchInput] = useState('')
  const [ifscInput, setIfscInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedBranchInfo, setSelectedBranchInfo] = useState(null)

  // Single Master User Data Object (User enters ONCE, mapped everywhere)
  const [userData, setUserData] = useState({
    name: registeredUserName,
    accountNumber: '',
    mobileNumber: '',
    email: '',
    branch: '',
    ifsc: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    accountType: 'SB',
    pan: '',
    chequeNumber: '',
    bankName: '',
    notes500: 0,
    notes200: 0,
    notes100: 0,
    notes50: 0,
    signature: null // base64 string or uploaded image URL
  })

  // Calculate live total amount from note counts if deposit slip
  const cashTotal = (userData.notes500 * 500) + (userData.notes200 * 200) + (userData.notes100 * 100) + (userData.notes50 * 50)
  const effectiveAmount = docType === 'deposit' && cashTotal > 0 ? cashTotal : Number(userData.amount || 0)
  const amountWords = numberToWords(effectiveAmount)

  // Certificate & Verification Modals
  const [showCertModal, setShowCertModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  // Calibration Developer Mode State
  const [calibrationMode, setCalibrationMode] = useState(false)
  const [templateConfigs, setTemplateConfigs] = useState(BANK_TEMPLATES_CONFIG)
  const [activeFieldId, setActiveFieldId] = useState(null)

  const templateKey = `${selectedBankId}_${docType}`
  const currentTemplate = templateConfigs[templateKey] || BANK_TEMPLATES_CONFIG['canara_deposit']

  // Handle Signature Upload
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

  // Handle Branch Search
  const handlePerformSearch = async () => {
    setSearchLoading(true)
    setSearchResults([])

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
          alert(`IFSC Code "${code}" not found. Please enter branch details manually.`)
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

  // Calibration Slider Field Adjuster
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

  // Render individual field value over background image based on renderingMode
  const renderFieldValue = (field) => {
    let value = userData[field.bindKey]

    // Special binding overrides
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

    // 1. DATE BOXES RENDERING (DDMMYYYY individual box placement)
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
            <span key={i} style={{ width: '14px', textAlign: 'center' }}>{d}</span>
          ))}
        </div>
      )
    }

    // 2. CHARACTER BOXES RENDERING (Account Number / PAN per printed box)
    if (field.renderingMode === 'characterBoxes') {
      const chars = String(value || '').split('')
      return (
        <div key={field.id} style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: `${field.x}%`,
          display: 'flex',
          letterSpacing: field.letterSpacing || '4px',
          fontSize: field.fontSize || '0.9rem',
          color: field.color || '#1d4ed8',
          fontWeight: field.fontWeight || 900,
          fontFamily: "'Courier New', monospace"
        }}>
          {chars.map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', width: '14px', textAlign: 'center' }}>{ch}</span>
          ))}
        </div>
      )
    }

    // 3. CHECKBOX RENDERING (Checkmark inside selected box)
    if (field.renderingMode === 'checkbox') {
      if (userData.accountType === field.bindValue) {
        return (
          <div key={field.id} style={{
            position: 'absolute',
            top: `${field.y}%`,
            left: `${field.x}%`,
            fontSize: field.fontSize || '1.1rem',
            color: '#1d4ed8',
            fontWeight: 900
          }}>
            ✓
          </div>
        )
      }
      return null
    }

    // 4. SIGNATURE IMAGE RENDERING (User uploaded signature)
    if (field.renderingMode === 'signature') {
      return (
        <div key={field.id} style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: field.x ? `${field.x}%` : 'auto',
          right: field.right ? `${field.right}%` : 'auto',
          width: `${field.width || 18}%`,
          height: `${field.height || 8}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {userData.signature ? (
            <img src={userData.signature} alt="User Signature" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#1d4ed8', fontStyle: 'italic', fontWeight: 900 }}>
              {userData.name} (Sig)
            </div>
          )}
        </div>
      )
    }

    // 5. STANDARD TEXT / AMOUNT IN WORDS RENDERING
    return (
      <div key={field.id} style={{
        position: 'absolute',
        top: `${field.y}%`,
        left: field.x ? `${field.x}%` : 'auto',
        right: field.right ? `${field.right}%` : 'auto',
        maxWidth: field.width ? `${field.width}%` : 'none',
        fontSize: field.fontSize || '0.85rem',
        color: field.color || '#1d4ed8',
        fontWeight: field.fontWeight || 900,
        fontFamily: "'Courier New', monospace",
        lineHeight: 1.2
      }}>
        {value}
      </div>
    )
  }

  return (
    <div className="content-area" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
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
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <span>⬅</span>
          <span>BACK TO MAIN PAGE</span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setCalibrationMode(!calibrationMode)}
            style={{
              background: calibrationMode ? '#ea580c' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)'),
              color: calibrationMode ? '#ffffff' : (isLight ? '#0f172a' : '#fbbf24'),
              border: '1.5px solid #ea580c',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            {calibrationMode ? '✓ CLOSE FIELD CALIBRATION TOOL' : '🛠️ DEVELOPER FIELD CALIBRATION TOOL'}
          </button>

          <button
            onClick={() => setShowCertModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: '1.5px solid #6ee7b7',
              color: '#ffffff',
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
      </div>

      {/* High Energy Top Level Switcher Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveMainTab('slips')}
          className={activeMainTab === 'slips' ? 'btn-primary' : 'btn-outline'}
          style={{
            flex: '1 1 220px',
            fontSize: 13,
            padding: '12px 20px',
            fontWeight: 900,
            background: activeMainTab === 'slips' ? '#ea580c' : (isLight ? '#ffffff' : 'rgba(255,255,255,0.05)'),
            border: activeMainTab === 'slips' ? '2px solid #f59e0b' : '1.5px solid rgba(234,88,12,0.3)',
            color: activeMainTab === 'slips' ? '#ffffff' : (isLight ? '#0f172a' : '#fbbf24')
          }}
        >
          📜 REAL BANK SLIPS & 15 FORM TEMPLATES
        </button>
        <button
          onClick={() => setActiveMainTab('digital')}
          className={activeMainTab === 'digital' ? 'btn-primary' : 'btn-outline'}
          style={{
            flex: '1 1 220px',
            fontSize: 13,
            padding: '12px 20px',
            fontWeight: 900,
            background: activeMainTab === 'digital' ? '#ea580c' : (isLight ? '#ffffff' : 'rgba(255,255,255,0.05)'),
            border: activeMainTab === 'digital' ? '2px solid #f59e0b' : '1.5px solid rgba(234,88,12,0.3)',
            color: activeMainTab === 'digital' ? '#ffffff' : (isLight ? '#0f172a' : '#fbbf24')
          }}
        >
          🛡️ DIGITAL BANKING & SAFETY ARENA
        </button>
      </div>

      {activeMainTab === 'slips' && (
        <div className="anim-fade">
          {/* Title Banner */}
          <div className="glass-card-deep anim-scale" style={{
            padding: '24px',
            borderRadius: 24,
            marginBottom: 20,
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

      {/* ─── SECTION 1: BANK & FORM SELECTION TABS ─── */}
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

      {/* ─── SECTION 2: SINGLE MASTER USER INPUT FORM ─── */}
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
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>ACCOUNT NUMBER</label>
            <input
              type="text"
              value={userData.accountNumber}
              onChange={e => setUserData({ ...userData, accountNumber: e.target.value })}
              placeholder="e.g. 10984523910"
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>BRANCH NAME</label>
            <input
              type="text"
              value={userData.branch}
              onChange={e => setUserData({ ...userData, branch: e.target.value })}
              placeholder="e.g. Pandeshwar, Mangaluru"
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>MOBILE / PHONE NO.</label>
            <input
              type="text"
              value={userData.mobileNumber}
              onChange={e => setUserData({ ...userData, mobileNumber: e.target.value })}
              placeholder="e.g. 9876543210"
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>DATE</label>
            <input
              type="date"
              value={userData.date}
              onChange={e => setUserData({ ...userData, date: e.target.value })}
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

          {docType !== 'deposit' && (
            <div>
              <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>NUMERIC AMOUNT (₹)</label>
              <input
                type="number"
                value={userData.amount}
                onChange={e => setUserData({ ...userData, amount: e.target.value })}
                placeholder="e.g. 5000"
                className="input-light"
                style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>UPLOAD SIGNATURE IMAGE (OPTIONAL)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="input-light"
              style={{ padding: '6px 12px', fontSize: 11 }}
            />
          </div>
        </div>

        {/* Cash Denomination Notes Counter for Deposit Slips */}
        {docType === 'deposit' && (
          <div style={{ background: isLight ? '#ffffff' : 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 14, border: '1px solid rgba(234, 88, 12, 0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#ea580c', marginBottom: 8, textTransform: 'uppercase' }}>
              💵 CASH DENOMINATION COUNTER (ENTER NOTE COUNTS):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>₹500 ×</span>
                <input type="number" min="0" value={userData.notes500 || ''} onChange={e => setUserData({ ...userData, notes500: Math.max(0, Number(e.target.value)) })} placeholder="0" className="input-light" style={{ width: 55, padding: '4px', textAlign: 'center', fontSize: 11, fontWeight: 800 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>= ₹{userData.notes500 * 500}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>₹200 ×</span>
                <input type="number" min="0" value={userData.notes200 || ''} onChange={e => setUserData({ ...userData, notes200: Math.max(0, Number(e.target.value)) })} placeholder="0" className="input-light" style={{ width: 55, padding: '4px', textAlign: 'center', fontSize: 11, fontWeight: 800 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>= ₹{userData.notes200 * 200}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>₹100 ×</span>
                <input type="number" min="0" value={userData.notes100 || ''} onChange={e => setUserData({ ...userData, notes100: Math.max(0, Number(e.target.value)) })} placeholder="0" className="input-light" style={{ width: 55, padding: '4px', textAlign: 'center', fontSize: 11, fontWeight: 800 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>= ₹{userData.notes100 * 100}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>₹50 ×</span>
                <input type="number" min="0" value={userData.notes50 || ''} onChange={e => setUserData({ ...userData, notes50: Math.max(0, Number(e.target.value)) })} placeholder="0" className="input-light" style={{ width: 55, padding: '4px', textAlign: 'center', fontSize: 11, fontWeight: 800 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>= ₹{userData.notes50 * 50}</span>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 900, color: '#ea580c', textAlign: 'right' }}>
              TOTAL DEPOSIT AMOUNT: {cashTotal > 0 ? `₹${cashTotal.toLocaleString('en-IN')} (${amountWords})` : 'Enter cash note counts above'}
            </div>
          </div>
        )}
      </div>

      {/* ─── DEVELOPER CALIBRATION PANEL ─── */}
      {calibrationMode && (
        <div style={{ background: '#7c2d12', color: '#ffffff', padding: 18, borderRadius: 18, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '1px', marginBottom: 8, textTransform: 'uppercase' }}>
            🛠️ DEVELOPER COORDINATE CALIBRATOR ({currentTemplate.institution} — {docType.toUpperCase()})
          </div>
          <p style={{ fontSize: 11, opacity: 0.9, marginBottom: 12 }}>
            Select a field below and adjust its X, Y, width, or font size to position it with pixel accuracy on top of the original image!
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {currentTemplate.fields.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFieldId(f.id)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  background: activeFieldId === f.id ? '#ea580c' : '#451a03', color: '#ffffff', border: 'none'
                }}
              >
                {f.label} ({f.id})
              </button>
            ))}
          </div>

          {activeFieldId && (() => {
            const fieldObj = currentTemplate.fields.find(f => f.id === activeFieldId)
            if (!fieldObj) return null
            return (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10 }}>X POSITION (%): {fieldObj.x || 0}</label>
                  <input type="range" min="0" max="100" step="0.5" value={fieldObj.x || 0} onChange={e => updateFieldCoord(activeFieldId, 'x', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10 }}>Y POSITION (%): {fieldObj.y || 0}</label>
                  <input type="range" min="0" max="100" step="0.5" value={fieldObj.y || 0} onChange={e => updateFieldCoord(activeFieldId, 'y', parseFloat(e.target.value))} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10 }}>FONT SIZE: {fieldObj.fontSize}</label>
                  <input type="text" value={fieldObj.fontSize || '0.85rem'} onChange={e => updateFieldCoord(activeFieldId, 'fontSize', e.target.value)} style={{ width: '100%', padding: 2, color: '#000' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10 }}>LETTER SPACING: {fieldObj.letterSpacing || 'normal'}</label>
                  <input type="text" value={fieldObj.letterSpacing || 'normal'} onChange={e => updateFieldCoord(activeFieldId, 'letterSpacing', e.target.value)} style={{ width: '100%', padding: 2, color: '#000' }} />
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ─── SECTION 3: LIVE ORIGINAL IMAGE VISUAL PREVIEW ─── */}
      <div className="glass-card-deep" style={{ padding: 24, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '2.5px solid #ea580c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase' }}>
            📸 ORIGINAL TEMPLATE PREVIEW ({currentTemplate.institution} • {docType.toUpperCase()})
          </div>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 900 }}>
            🖊️ BLUE PEN INK OVERLAY ACTIVE
          </div>
        </div>

        {/* Dynamic Image Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 860,
          margin: '0 auto',
          borderRadius: 16,
          overflow: 'hidden',
          border: '2px solid #d97706',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          background: '#ffffff'
        }}>
          {/* Authentic Untouched Original Background Image */}
          <img
            src={currentTemplate.image}
            alt={`${currentTemplate.institution} ${docType}`}
            style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.94 }}
          />

          {/* OVERLAY RENDERER: Renders user inputs onto exact field coordinates */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {currentTemplate.fields.map(field => renderFieldValue(field))}
          </div>
        </div>

        {/* Print / Export Action Bar */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowVerifyModal(true)}
            className="btn-primary"
            style={{ flex: 1, padding: 14, fontSize: 13, fontWeight: 900 }}
          >
            📋 REVIEW & PRINT FILLED FORM PDF
          </button>
        </div>
      </div>
    </div>
  )}

      {activeMainTab === 'digital' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header Banner */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, background: isLight ? '#ffffff' : '#12100c', border: '2px solid #ea580c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 36 }}>🛡️</span>
              <div>
                <div className="sticker-badge sticker-yellow" style={{ marginBottom: 4 }}>
                  LEVEL 3 • DIGITAL BANKING & SAFETY ARENA
                </div>
                <h2 className="font-display" style={{ fontSize: 26, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  DIGITAL BANKING & CYBER SAFETY
                </h2>
                <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 13, margin: '4px 0 0', fontWeight: 600 }}>
                  Master net banking security, analyze suspicious messages, and watch interactive video guides.
                </p>
              </div>
            </div>
          </div>

          {/* Cyber Security Challenge */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 18, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  🛡️ CYBER SECURITY SCENARIO CHALLENGE ({digitalScenarioIdx + 1}/{CYBER_SCENARIOS.length})
                </h3>
                <p style={{ fontSize: 11, color: isLight ? '#64748b' : '#9ca3af', margin: '2px 0 0' }}>
                  Test your banking fraud awareness and protect your account score
                </p>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', padding: '6px 14px', borderRadius: 999, fontWeight: 900, fontSize: 12, color: '#10b981' }}>
                🛡️ SHIELD HEALTH: {shieldScore}%
              </div>
            </div>

            {/* Scenario Card */}
            {(() => {
              const scen = CYBER_SCENARIOS[digitalScenarioIdx]
              return (
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1.5px solid rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 16 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 900, color: '#fbbf24', marginTop: 0, marginBottom: 8 }}>
                    {scen.title}
                  </h4>
                  <p style={{ fontSize: 13, color: isLight ? '#334155' : '#e2e8f0', lineHeight: 1.6, marginBottom: 16 }}>
                    {scen.scenario}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {scen.opts.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleCyberAnswer(oIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: selectedOpt === oIdx
                            ? (opt.correct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')
                            : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)'),
                          border: `1.5px solid ${
                            selectedOpt === oIdx
                              ? (opt.correct ? '#10b981' : '#ef4444')
                              : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)')
                          }`,
                          color: isLight ? '#0f172a' : '#ffffff'
                        }}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {digitalFeedback && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1.5px solid #f59e0b', padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 12, color: '#fbbf24', lineHeight: 1.5 }}>
                      💡 <strong>Explanation:</strong> {digitalFeedback}
                    </div>
                  )}

                  {selectedOpt !== null && (
                    <button
                      className="btn-primary"
                      onClick={handleNextScenario}
                      style={{ width: '100%', fontSize: 13, padding: '10px 18px', fontWeight: 900 }}
                    >
                      {digitalScenarioIdx < CYBER_SCENARIOS.length - 1 ? 'NEXT SCENARIO ➔' : 'COMPLETE CYBER CHALLENGE 🎉'}
                    </button>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Message Scam Analyzer */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid rgba(234, 88, 12, 0.4)' }}>
            <MessageScamAnalyzer />
          </div>

          {/* Video Tutorials Section */}
          <div className="glass-card-deep" style={{ padding: 24, borderRadius: 24, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 12 }}>
              🎥 DIGITAL BANKING VIDEO TUTORIALS
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
              {Object.keys(VIDEOS_DB).map(vKey => {
                const vid = VIDEOS_DB[vKey]
                return (
                  <button
                    key={vKey}
                    onClick={() => setSelectedVideo(vKey)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: selectedVideo === vKey ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                      color: selectedVideo === vKey ? '#000000' : '#d1d5db',
                      border: '1px solid #f59e0b'
                    }}
                  >
                    {vid.title}
                  </button>
                )
              })}
            </div>

            {(() => {
              const vid = VIDEOS_DB[selectedVideo]
              return (
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>{vid.title}</h4>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 14px' }}>{vid.desc}</p>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
                    <iframe
                      src={vid.url}
                      title={vid.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ─── FINAL VERIFICATION MODAL ─── */}
      {showVerifyModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} className="anim-fade" onClick={() => setShowVerifyModal(false)}>
          
          <div style={{
            background: isLight ? '#ffffff' : '#12100c',
            border: '3px solid #ea580c',
            borderRadius: 24, padding: 28,
            maxWidth: 550, width: '100%',
            textAlign: 'center', color: isLight ? '#0f172a' : '#ffffff',
            position: 'relative'
          }} className="anim-scale" onClick={e => e.stopPropagation()}>
            
            <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
            <h3 className="font-display" style={{ fontSize: 24, margin: '0 0 8px' }}>
              FINAL REVIEW BEFORE PRINTING
            </h3>
            <p style={{ fontSize: 12, color: isLight ? '#475569' : '#d1d5db', marginBottom: 16 }}>
              Please verify all details before printing or downloading your filled bank form.
            </p>

            <div style={{ background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)', padding: 14, borderRadius: 14, textStyle: 'left', fontSize: 12, marginBottom: 20, border: '1px stroke #cbd5e1', textAlign: 'left' }}>
              <div><strong>Institution:</strong> {currentTemplate.institution}</div>
              <div><strong>Form Type:</strong> {docType.toUpperCase()}</div>
              <div><strong>Name:</strong> {userData.name || '—'}</div>
              <div><strong>Account No:</strong> {userData.accountNumber || '—'}</div>
              <div><strong>Branch:</strong> {userData.branch || '—'}</div>
              <div><strong>Date:</strong> {userData.date}</div>
              <div><strong>Amount:</strong> {effectiveAmount > 0 ? `₹${effectiveAmount.toLocaleString('en-IN')}` : '—'}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowVerifyModal(false)}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', color: isLight ? '#0f172a' : '#ffffff', border: 'none', fontWeight: 900, cursor: 'pointer' }}
              >
                ✏️ EDIT DETAILS
              </button>
              <button
                onClick={() => { setShowVerifyModal(false); window.print(); }}
                className="btn-primary"
                style={{ flex: 1, padding: 12, fontSize: 13, fontWeight: 900 }}
              >
                🖨️ GENERATE & PRINT PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── OFFICIAL BANKING CERTIFICATE MODAL ─── */}
      {showCertModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(8, 7, 5, 0.88)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} className="anim-fade" onClick={() => setShowCertModal(false)}>
          
          <div style={{
            background: isLight ? '#ffffff' : '#12100c',
            border: '4px double #ea580c',
            borderRadius: 24, padding: 32,
            maxWidth: 600, width: '100%',
            textAlign: 'center', boxShadow: '0 0 60px rgba(234, 88, 12, 0.3)',
            color: isLight ? '#0f172a' : '#ffffff',
            position: 'relative'
          }} className="anim-scale" onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setShowCertModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#ea580c', fontSize: 24, cursor: 'pointer' }}>✕</button>

            <div style={{ fontSize: 48, marginBottom: 8 }}>🏛️</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', letterSpacing: '2px', textTransform: 'uppercase' }}>
              LEARN2INVEST NATIONAL FINANCIAL LITERACY
            </div>

            <h2 className="font-display" style={{ fontSize: 32, color: isLight ? '#0f172a' : '#ffffff', margin: '8px 0 16px' }}>
              CERTIFICATE OF EXCELLENCE
            </h2>

            <p style={{ fontSize: 13, color: isLight ? '#475569' : '#d1d5db' }}>
              This official certificate is proudly awarded to:
            </p>

            <div style={{ fontSize: 26, fontWeight: 900, color: '#ea580c', borderBottom: '2px solid #ea580c', display: 'inline-block', padding: '4px 24px', margin: '12px 0 16px' }}>
              {userData.name}
            </div>

            <p style={{ fontSize: 13, color: isLight ? '#334155' : '#d1d5db', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 20px' }}>
              For successfully mastering Indian Bank Branch Location search, Pay-in Cash Deposit Slips, Withdrawal Slips, and Cheque Book Writing across major Indian Banks and Post Office Savings Banks.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)'}`, paddingTop: 16, fontSize: 11, color: isLight ? '#475569' : '#9ca3af' }}>
              <div>
                <div>📅 DATE: {new Date().toLocaleDateString('en-IN')}</div>
                <div>🆔 CERT ID: L2I-BANK-2026-994</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>🤖 Luna (AI Mentor)</div>
                <div style={{ color: '#10b981', fontWeight: 800 }}>OFFICIAL VERIFIED BADGE</div>
              </div>
            </div>

            <button onClick={() => window.print()} className="btn-primary" style={{ width: '100%', marginTop: 24, padding: 12, fontSize: 13, fontWeight: 900 }}>
              🖨️ PRINT / SAVE CERTIFICATE PDF
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
