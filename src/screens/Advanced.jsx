import React, { useState, useEffect, useRef } from 'react'
import { INSTITUTIONS, FORM_CATEGORIES, BANK_TEMPLATES_CONFIG } from '../config/bankTemplates'

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

const BankLogo = ({ id }) => {
  switch (id) {
    case 'canara':
      return <img src="/logos/canara.png" alt="Canara Bank" style={{ height: 75, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
    case 'karnataka':
      return <img src="/logos/karnataka.png" alt="Karnataka Bank" style={{ height: 75, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
    case 'postoffice':
      return <img src="/logos/postoffice.png" alt="India Post" style={{ height: 75, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
    case 'pnb':
      return (
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="18" fill="#A00037" />
          <circle cx="50" cy="50" r="32" fill="#FFC20E" />
          <text x="50" y="62" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#A00037" fontFamily="sans-serif">PNB</text>
        </svg>
      )
    case 'sbi':
      return (
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" fill="#00A5EC" />
          <circle cx="50" cy="38" r="18" fill="#ffffff" />
          <rect x="42" y="38" width="16" height="42" fill="#ffffff" />
        </svg>
      )
    default:
      return <span style={{ fontSize: 48 }}>🏦</span>
  }
}

export default function Advanced({ go, goBack, state, themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const registeredUserName = state?.user?.name || 'Niyathi'

  // Selected Bank & Form Category
  const [selectedBankId, setSelectedBankId] = useState('canara')
  const [docType, setDocType] = useState('deposit')

  // Search Mode for Branch / IFSC
  const [searchMode, setSearchMode] = useState('city_branch')
  const [cityInput, setCityInput] = useState('')
  const [branchInput, setBranchInput] = useState('')
  const [ifscInput, setIfscInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState(null)

  const handlePerformSearch = async () => {
    setSearchLoading(true)
    setSearchResult(null)

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
          setSearchResult(matched)
        } else {
          const currentInst = INSTITUTIONS.find(b => b.id === selectedBankId)
          const matched = {
            bankName: currentInst?.name || 'Bank',
            branchName: 'Main Branch',
            city: 'City Branch',
            ifsc: code,
            address: `Main Branch, ${currentInst?.name || 'Bank'}`
          }
          setSearchResult(matched)
        }
      } catch (err) {
        const currentInst = INSTITUTIONS.find(b => b.id === selectedBankId)
        const matched = {
          bankName: currentInst?.name || 'Bank',
          branchName: 'Main Branch',
          city: 'City Branch',
          ifsc: code,
          address: `Main Branch, ${currentInst?.name || 'Bank'}`
        }
        setSearchResult(matched)
      }
    } else {
      const cityQ = cityInput.trim()
      const branchQ = branchInput.trim()
      if (!cityQ && !branchQ) {
        alert('Please enter a City or Branch Name.')
        setSearchLoading(false)
        return
      }
      const currentInst = INSTITUTIONS.find(b => b.id === selectedBankId)
      const mockIfsc = currentInst ? currentInst.code : 'CNRB0001001'
      const matched = {
        bankName: currentInst?.name || 'Canara Bank',
        branchName: branchQ || 'Main Branch',
        city: cityQ || 'City',
        ifsc: mockIfsc,
        address: `${branchQ || 'Main'} Branch, ${cityQ || 'City'}`
      }
      setSearchResult(matched)
    }
    setSearchLoading(false)
  }

  const applySearchResultToForm = () => {
    if (!searchResult) return
    setUserData(prev => ({
      ...prev,
      branch: `${searchResult.branchName}, ${searchResult.city}`,
      ifsc: searchResult.ifsc
    }))
  }

  // Single Master User Data Object (User enters ONCE, mapped everywhere)
  const [userData, setUserData] = useState({
    name: registeredUserName,
    accountNumber: '',
    mobileNumber: '',
    email: '',
    branch: '',
    ifsc: 'CNRB0001001',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    accountType: 'SB',
    pan: '',
    chequeNumber: '',
    bankName: '',
    signature: null
  })

  const [hasCompletedSlip, setHasCompletedSlip] = useState(false)

  // Calculate live amount
  const effectiveAmount = Number(userData.amount || 0)
  const amountWords = numberToWords(effectiveAmount)

  // Certificate & Verification Modals
  const [showCertModal, setShowCertModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const handleClaimCertificate = () => {
    if (!hasCompletedSlip && !userData.accountNumber && effectiveAmount <= 0) {
      alert('🔒 Please fill in your details and click "REVIEW & PRINT FILLED FORM PDF" to practice completing at least 1 bank slip before claiming your official Banking Certificate!')
      return
    }
    setShowCertModal(true)
  }

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

      </div>

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
              LEVEL 3
            </div>
            <h1 className="font-display" style={{ fontSize: 26, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              REAL INDIAN BANK PAPER SLIP WRITER
            </h1>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: BANK SELECTION TABS ─── */}
      <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
          🏛️ SELECT FINANCIAL INSTITUTION (5 BANKS)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {INSTITUTIONS.map(inst => (
            <div
              key={inst.id}
              onClick={() => {
                setSelectedBankId(inst.id)
                setUserData(prev => ({ ...prev, ifsc: inst.code }))
              }}
              style={{
                background: selectedBankId === inst.id ? (isLight ? '#fff7ed' : 'rgba(245, 158, 11, 0.2)') : (isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'),
                border: `2.5px solid ${selectedBankId === inst.id ? '#ea580c' : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)')}`,
                borderRadius: 18, padding: '18px 16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10, transition: 'all 0.2s',
                boxShadow: selectedBankId === inst.id ? '0 8px 24px rgba(234, 88, 12, 0.35)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, width: '100%' }}>
                <BankLogo id={inst.id} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', textAlign: 'center' }}>{inst.name}</div>
              <div style={{ fontSize: 12, color: '#ea580c', fontWeight: 900 }}>IFSC: {inst.code}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECTION 2: FIND YOUR IFSC CODE USING BRANCH NAME AND CITY & VICE VERSA ─── */}
      <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
          🔍 FIND YOUR IFSC CODE USING BRANCH NAME & CITY (AND VICE VERSA)
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSearchMode('city_branch')}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 900, cursor: 'pointer',
              background: searchMode === 'city_branch' ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
              color: searchMode === 'city_branch' ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
              border: `1.5px solid ${searchMode === 'city_branch' ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
            }}
          >
            🏢 SEARCH BY CITY & BRANCH NAME
          </button>
          <button
            onClick={() => setSearchMode('ifsc')}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 900, cursor: 'pointer',
              background: searchMode === 'ifsc' ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
              color: searchMode === 'ifsc' ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
              border: `1.5px solid ${searchMode === 'ifsc' ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
            }}
          >
            ⚡ SEARCH BRANCH BY IFSC CODE
          </button>
        </div>

        {searchMode === 'city_branch' ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              placeholder="Enter City Name (e.g. Mangaluru)"
              className="input-light"
              style={{ flex: 1, minWidth: 160, padding: '8px 12px', fontSize: 12, fontWeight: 700 }}
            />
            <input
              type="text"
              value={branchInput}
              onChange={e => setBranchInput(e.target.value)}
              placeholder="Enter Branch Name (e.g. Pandeshwar)"
              className="input-light"
              style={{ flex: 1, minWidth: 160, padding: '8px 12px', fontSize: 12, fontWeight: 700 }}
            />
            <button
              onClick={handlePerformSearch}
              disabled={searchLoading}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 12, fontWeight: 900 }}
            >
              {searchLoading ? 'SEARCHING...' : 'FIND IFSC CODE'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={ifscInput}
              onChange={e => setIfscInput(e.target.value)}
              placeholder="Enter 11-Digit IFSC Code (e.g. CNRB0001001)"
              className="input-light"
              style={{ flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}
            />
            <button
              onClick={handlePerformSearch}
              disabled={searchLoading}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 12, fontWeight: 900 }}
            >
              {searchLoading ? 'SEARCHING...' : 'FIND BRANCH DETAILS'}
            </button>
          </div>
        )}

        {searchResult && (
          <div style={{ marginTop: 14, background: isLight ? '#fff7ed' : 'rgba(234, 88, 12, 0.15)', padding: 14, borderRadius: 12, border: '1.5px solid #ea580c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                🏛️ {searchResult.bankName} — {searchResult.branchName} ({searchResult.city})
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ea580c', marginTop: 2 }}>
                IFSC CODE: <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900 }}>{searchResult.ifsc}</span>
              </div>
              <div style={{ fontSize: 11, color: isLight ? '#475569' : '#9ca3af', marginTop: 2 }}>
                📍 {searchResult.address}
              </div>
            </div>
            <button
              onClick={applySearchResultToForm}
              style={{
                padding: '8px 16px', borderRadius: 10, background: '#10b981', color: '#ffffff',
                border: 'none', fontWeight: 900, fontSize: 11, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              ✓ APPLY IFSC & BRANCH TO FORM
            </button>
          </div>
        )}
      </div>

      {/* ─── SECTION 3: SELECT FORM CATEGORY TABS ─── */}
      <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
          📜 SELECT FORM CATEGORY
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {FORM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setDocType(cat.id)}
              style={{
                padding: '10px 22px', borderRadius: 999, fontSize: 13, fontWeight: 900, cursor: 'pointer',
                background: docType === cat.id ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
                color: docType === cat.id ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
                border: `2px solid ${docType === cat.id ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`,
                boxShadow: docType === cat.id ? '0 4px 14px rgba(234, 88, 12, 0.3)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTION 3: SINGLE MASTER USER INPUT FORM ─── */}
      <div className="glass-card-deep" style={{ padding: 24, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
          ✍️ ENTER YOUR INFORMATION ONCE ({docType === 'deposit' ? 'SYSTEM RENDERS IT ON CASH DEPOSIT SLIP' : docType === 'withdrawal' ? 'SYSTEM RENDERS IT ON WITHDRAWAL SLIP' : 'SYSTEM RENDERS IT ON CHEQUE LEAF'})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>
              {docType === 'cheque' ? 'PAY TO (PAYEE NAME / SELF)' : 'ACCOUNT HOLDER / PAYEE NAME'}
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={e => setUserData({ ...userData, name: e.target.value })}
              placeholder={docType === 'cheque' ? "e.g. Self or Hamsini" : "e.g. Hamsini"}
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
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>IFSC CODE</label>
            <input
              type="text"
              value={userData.ifsc}
              onChange={e => setUserData({ ...userData, ifsc: e.target.value })}
              placeholder="e.g. CNRB0001001"
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}
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

          {docType === 'cheque' ? (
            <div>
              <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>CHEQUE NUMBER (6 DIGITS)</label>
              <input
                type="text"
                value={userData.chequeNumber}
                onChange={e => setUserData({ ...userData, chequeNumber: e.target.value })}
                placeholder="e.g. 104502"
                className="input-light"
                style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
              />
            </div>
          ) : (
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
          )}

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

          <div>
            <label style={{ fontSize: 10, fontWeight: 800, color: isLight ? '#475569' : '#9ca3af', display: 'block', marginBottom: 4 }}>
              {docType === 'deposit' ? 'TOTAL DEPOSIT AMOUNT (₹)' : docType === 'withdrawal' ? 'CASH WITHDRAWAL AMOUNT (₹)' : 'CHEQUE AMOUNT (₹)'}
            </label>
            <input
              type="number"
              value={userData.amount}
              onChange={e => setUserData({ ...userData, amount: e.target.value })}
              placeholder="e.g. 5000"
              className="input-light"
              style={{ padding: '9px 12px', fontSize: 12, fontWeight: 800 }}
            />
          </div>

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
            onClick={() => { setHasCompletedSlip(true); setShowVerifyModal(true); }}
            className="btn-primary"
            style={{ flex: 1, padding: 14, fontSize: 13, fontWeight: 900 }}
          >
            📋 REVIEW & PRINT FILLED FORM PDF
          </button>
        </div>
      </div>

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
              For successfully mastering Pay-in Cash Deposit Slips, Withdrawal Slips, and Cheque Book Writing across major Indian Banks and Post Office Savings Banks.
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
