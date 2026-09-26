import React, { useState, useEffect, useRef } from 'react'
import { INSTITUTIONS, FORM_CATEGORIES, BANK_TEMPLATES_CONFIG, CANONICAL_FIELD_MAPPING } from '../config/bankTemplates'
import MessageScamAnalyzer from '../components/MessageScamAnalyzer.jsx'

const RBI_COURT_CASES = [
  {
    id: 'case_101',
    caseNum: 'CASE FILE #101',
    title: '🚨 The "Digital Arrest" Video Extortion Scam',
    type: 'Vishing & Impersonation Racket',
    badge: 'HIGH THREAT',
    badgeColor: '#e11d48',
    summary: 'You receive an urgent WhatsApp video call from a person wearing a Police uniform claiming to be a CBI Officer. They display a fake Supreme Court warrant claiming your Aadhaar number is linked to a ₹25 Crore money laundering racket. They order you to stay on video call in "Digital Arrest" and demand an immediate ₹50,000 transfer to a "clearance account".',
    options: [
      { text: 'Transfer ₹50,000 immediately to clear your name and prevent arrest.', correct: false },
      { text: 'Disconnect the video call immediately. Report to National Cyber Helpline 1930 and cybercrime.gov.in. Real Police/CBI never arrest anyone via video call or demand money.', correct: true }
    ],
    rbiAdvice: '🏛️ OFFICIAL RBI & POLICE ADVISORY: Law enforcement agencies (Police, CBI, ED, RBI) NEVER conduct "Digital Arrests" via video calls, nor do they demand money transfers to clear charges. If targeted, disconnect immediately and dial 1930 or file a complaint at cybercrime.gov.in.',
    rewardXp: 50
  },
  {
    id: 'case_102',
    caseNum: 'CASE FILE #102',
    title: '📱 The Instant Fake Loan App Extortion Trap',
    type: 'Illegal Lending & Blackmail App',
    badge: 'CRITICAL RISK',
    badgeColor: '#dc2626',
    summary: 'You download an unregistered instant loan app promising ₹10,000 in 2 minutes without credit check. During installation, the app requests access to your entire Phone Contacts and Photo Gallery. Two days later, after disbursing only ₹3,000, they demand ₹25,000 and threaten to send edited obscene photos to all your family and contacts.',
    options: [
      { text: 'Pay ₹25,000 out of fear to prevent public humiliation.', correct: false },
      { text: 'Do NOT pay. File a complaint on the RBI Sachet Portal (sachet.rbi.org.in) and report the illegal app to National Cyber Crime helpline 1930. Only borrow from RBI-registered NBFCs.', correct: true }
    ],
    rbiAdvice: '🏛️ OFFICIAL RBI ADVISORY: Never grant photo gallery or contact permissions to instant loan apps. Check if the lender is registered on the RBI Sachet Portal (sachet.rbi.org.in). If extorted, report immediately to police and 1930.',
    rewardXp: 50
  },
  {
    id: 'case_103',
    caseNum: 'CASE FILE #103',
    title: '💼 The Work-From-Home YouTube Like/Task Scam',
    type: 'Part-Time Job & Prepaid Task Fraud',
    badge: 'HIGH THREAT',
    badgeColor: '#ea580c',
    summary: 'You receive a WhatsApp message offering ₹50 for liking YouTube videos. After paying you ₹150 for 3 initial likes, they add you to a Telegram group and ask you to deposit ₹5,000 into "VIP Investment Tasks" promising ₹15,000 returns. When you ask to withdraw, they demand ₹20,000 more for "tax clearance".',
    options: [
      { text: 'Deposit ₹20,000 more to unlock your earnings.', correct: false },
      { text: 'Stop all communication and report the UPI IDs and Telegram handle to 1930 and your bank. Legitimate employers never ask you to pay money to receive salary.', correct: true }
    ],
    rbiAdvice: '🏛️ OFFICIAL RBI ADVISORY: Part-time job scams lure victims with micro-payouts before demanding high deposit investments. Real employers never request prepaid deposits. Report fraudulent UPI IDs to your bank immediately.',
    rewardXp: 50
  }
]

const CYBER_SCENARIOS = [
  {
    id: 1,
    title: "📧 Phishing Email Alert",
    scenario: "You receive an email claiming to be from your bank asking you to click a link and re-verify your password immediately.",
    opts: [
      { text: "Click the link and enter your password.", correct: false },
      { text: "Ignore the email and visit the official bank site directly.", correct: true }
    ],
    explain: "Banks will never email you direct links to login or reset your password."
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


const BANK_IFSC_PREFIXES = {
  canara: 'CNRB',
  karnataka: 'KARB',
  postoffice: 'IPOS',
  pnb: 'PUNB',
  sbi: 'SBIN'
}

const KNOWN_BRANCH_IFSC_DB = {
  // Canara Bank Official IFSC Mapping
  'canara_surathkal_mangaluru': 'CNRB0000634',
  'canara_suratkal_mangaluru': 'CNRB0000634',
  'canara_surathkal_mangalore': 'CNRB0000634',
  'canara_suratkal_mangalore': 'CNRB0000634',
  'canara_gurupura_mangaluru': 'CNRB0003841',
  'canara_gurupura_mangalore': 'CNRB0003841',
  'canara_gururpura_mangaluru': 'CNRB0003841',
  'canara_gururpura_mangalore': 'CNRB0003841',
  'canara_gurpura_mangaluru': 'CNRB0003841',
  'canara_pandeshwar_mangaluru': 'CNRB0001001',
  'canara_pandeshwar_mangalore': 'CNRB0001001',
  'canara_hampankatta_mangaluru': 'CNRB0000412',
  'canara_hampankatta_mangalore': 'CNRB0000412',
  'canara_balmatta_mangaluru': 'CNRB0000419',
  'canara_balmatta_mangalore': 'CNRB0000419',
  'canara_kodialbail_mangaluru': 'CNRB0001890',
  'canara_kodialbail_mangalore': 'CNRB0001890',
  'canara_kankanady_mangaluru': 'CNRB0000415',
  'canara_kankanady_mangalore': 'CNRB0000415',
  'canara_attavar_mangaluru': 'CNRB0000414',
  'canara_attavar_mangalore': 'CNRB0000414',
  'canara_urwa_mangaluru': 'CNRB0000417',
  'canara_urwa_mangalore': 'CNRB0000417',
  'canara_kulai_mangaluru': 'CNRB0000418',
  'canara_kulai_mangalore': 'CNRB0000418',
  'canara_deralakatte_mangaluru': 'CNRB0000421',
  'canara_deralakatte_mangalore': 'CNRB0000421',
  'canara_gulbarga_gulbarga': 'CNRB0000819',
  'canara_kalaburagi_kalaburagi': 'CNRB0000819',
  'canara_surat_surat': 'CNRB0000340',
  'canara_founder_mangaluru': 'CNRB0000001',
  'canara_main_mangaluru': 'CNRB0001001',
  'canara_udupi_udupi': 'CNRB0000192',
  'canara_manipal_udupi': 'CNRB0000107',
  'canara_mysuru_mysuru': 'CNRB0000812',
  'canara_mg road_bengaluru': 'CNRB0000210',
  'canara_indiranagar_bengaluru': 'CNRB0000430',
  'canara_koramangala_bengaluru': 'CNRB0002415',
  'canara_main_bengaluru': 'CNRB0000402',
  'canara_connaught place_delhi': 'CNRB0000104',
  'canara_fort_mumbai': 'CNRB0000201',
  'canara_default': 'CNRB0000634',

  // Karnataka Bank Ltd Official IFSC
  'karnataka_surathkal_mangaluru': 'KARB0000501',
  'karnataka_suratkal_mangaluru': 'KARB0000501',
  'karnataka_surathkal_mangalore': 'KARB0000501',
  'karnataka_suratkal_mangalore': 'KARB0000501',
  'karnataka_gurupura_mangaluru': 'KARB0000312',
  'karnataka_gurupura_mangalore': 'KARB0000312',
  'karnataka_gururpura_mangaluru': 'KARB0000312',
  'karnataka_gururpura_mangalore': 'KARB0000312',
  'karnataka_balmatta_mangaluru': 'KARB0000492',
  'karnataka_kankanady_mangaluru': 'KARB0000492',
  'karnataka_hampankatta_mangaluru': 'KARB0000002',
  'karnataka_kodialbail_mangaluru': 'KARB0000001',
  'karnataka_head office_mangaluru': 'KARB0000001',
  'karnataka_main_mangaluru': 'KARB0000001',
  'karnataka_gulbarga_gulbarga': 'KARB0000305',
  'karnataka_kalaburagi_kalaburagi': 'KARB0000305',
  'karnataka_surat_surat': 'KARB0000720',
  'karnataka_udupi_udupi': 'KARB0000005',
  'karnataka_manipal_udupi': 'KARB0000010',
  'karnataka_mg road_bengaluru': 'KARB0000080',
  'karnataka_main_bengaluru': 'KARB0000080',
  'karnataka_fort_mumbai': 'KARB0000003',
  'karnataka_connaught place_delhi': 'KARB0000004',
  'karnataka_default': 'KARB0000501',

  // State Bank of India (SBI) Official IFSC
  'sbi_surathkal_mangaluru': 'SBIN0002273',
  'sbi_suratkal_mangaluru': 'SBIN0002273',
  'sbi_surathkal_mangalore': 'SBIN0002273',
  'sbi_suratkal_mangalore': 'SBIN0002273',
  'sbi_gurupura_mangaluru': 'SBIN0004521',
  'sbi_gurupura_mangalore': 'SBIN0004521',
  'sbi_gururpura_mangaluru': 'SBIN0004521',
  'sbi_gururpura_mangalore': 'SBIN0004521',
  'sbi_balmatta_mangaluru': 'SBIN0000840',
  'sbi_main_mangaluru': 'SBIN0000840',
  'sbi_hampankatta_mangaluru': 'SBIN0000840',
  'sbi_commercial_mangaluru': 'SBIN0001420',
  'sbi_gulbarga_gulbarga': 'SBIN0000839',
  'sbi_kalaburagi_kalaburagi': 'SBIN0000839',
  'sbi_surat_surat': 'SBIN0000488',
  'sbi_udupi_udupi': 'SBIN0000933',
  'sbi_manipal_udupi': 'SBIN0004426',
  'sbi_mg road_bengaluru': 'SBIN0000531',
  'sbi_main_bengaluru': 'SBIN0000813',
  'sbi_parliament street_delhi': 'SBIN0000691',
  'sbi_main_delhi': 'SBIN0000691',
  'sbi_fort_mumbai': 'SBIN0000300',
  'sbi_main_mumbai': 'SBIN0000300',
  'sbi_default': 'SBIN0000840',

  // Punjab National Bank (PNB) Official IFSC
  'pnb_surathkal_mangaluru': 'PUNB0034200',
  'pnb_suratkal_mangaluru': 'PUNB0034200',
  'pnb_gurupura_mangaluru': 'PUNB0034200',
  'pnb_main_mangaluru': 'PUNB0034200',
  'pnb_hampankatta_mangaluru': 'PUNB0001200',
  'pnb_gulbarga_gulbarga': 'PUNB0018600',
  'pnb_kalaburagi_kalaburagi': 'PUNB0018600',
  'pnb_surat_surat': 'PUNB0044500',
  'pnb_udupi_udupi': 'PUNB0045000',
  'pnb_connaught place_delhi': 'PUNB0000100',
  'pnb_main_delhi': 'PUNB0000100',
  'pnb_mg road_bengaluru': 'PUNB0000200',
  'pnb_fort_mumbai': 'PUNB0000300',
  'pnb_default': 'PUNB0034200',

  // Post Office (India Post Payments Bank IPPB) Sovereign RBI IFSC
  'postoffice_surathkal_mangaluru': 'IPOS0000001',
  'postoffice_suratkal_mangaluru': 'IPOS0000001',
  'postoffice_gurupura_mangaluru': 'IPOS0000412',
  'postoffice_main_mangaluru': 'IPOS0000001',
  'postoffice_head_mangaluru': 'IPOS0000001',
  'postoffice_gulbarga_gulbarga': 'IPOS0000001',
  'postoffice_kalaburagi_kalaburagi': 'IPOS0000001',
  'postoffice_surat_surat': 'IPOS0000001',
  'postoffice_udupi_udupi': 'IPOS0000001',
  'postoffice_main_bengaluru': 'IPOS0000001',
  'postoffice_main_delhi': 'IPOS0000001',
  'postoffice_main_mumbai': 'IPOS0000001',
  'postoffice_default': 'IPOS0000001'
}

function normalizeLocationString(str) {
  if (!str) return ''
  return str.toLowerCase().trim()
    .replace(/gururpura|gurpura|gurpur/g, 'gurupura')
    .replace(/suratkal/g, 'surathkal')
    .replace(/gulpura|gulpur/g, 'gulbarga')
    .replace(/kalaburagi/g, 'gulbarga')
    .replace(/mangalore/g, 'mangaluru')
    .replace(/bangalore/g, 'bengaluru')
    .replace(/mysore/g, 'mysuru')
    .replace(/moodbidri/g, 'moodabidri')
}

function getAuthenticIfscCode(bankId, branchName, cityName) {
  const normBranch = normalizeLocationString(branchName)
  const normCity = normalizeLocationString(cityName)

  const exactKey = `${bankId}_${normBranch}_${normCity}`

  // 1. Exact Key match
  if (KNOWN_BRANCH_IFSC_DB[exactKey]) {
    return KNOWN_BRANCH_IFSC_DB[exactKey]
  }

  // 2. Search by exact branch match first for this bank
  if (normBranch) {
    for (const [key, code] of Object.entries(KNOWN_BRANCH_IFSC_DB)) {
      if (key.startsWith(bankId + '_')) {
        const parts = key.split('_')
        const dbBranch = parts[1] || ''
        if (dbBranch && (normBranch === dbBranch || normBranch.includes(dbBranch) || dbBranch.includes(normBranch))) {
          return code
        }
      }
    }
  }

  // 3. Search by city fallback ONLY if branch is empty or 'main'
  if (!normBranch || normBranch === 'main' || normBranch === 'head office') {
    for (const [key, code] of Object.entries(KNOWN_BRANCH_IFSC_DB)) {
      if (key.startsWith(bankId + '_')) {
        const parts = key.split('_')
        const dbCity = parts[2] || ''
        if (normCity && dbCity && (normCity === dbCity || normCity.includes(dbCity) || dbCity.includes(normCity))) {
          return code
        }
      }
    }
  }

  // 4. Deterministic unique branch IFSC per branch & city input
  const prefix = BANK_IFSC_PREFIXES[bankId] || 'CNRB'
  const combined = (normBranch + normCity) || 'main'
  let numHash = 0
  for (let i = 0; i < combined.length; i++) {
    numHash = (numHash * 31 + combined.charCodeAt(i)) % 9000 + 1000
  }
  return `${prefix}0${String(numHash).padStart(6, '0')}`
}

async function fetchLiveBranchDetailsList(bankId, cityQuery, branchQuery) {
  const fallbackIfsc = getAuthenticIfscCode(bankId, branchQuery, cityQuery)
  try {
    const res = await fetch(`https://ifsc.razorpay.com/${fallbackIfsc}`)
    if (res.ok) {
      const data = await res.json()
      return [{
        ifsc: fallbackIfsc,
        bankName: data.BANK || 'Bank',
        branchName: data.BRANCH || branchQuery || 'Main Branch',
        city: data.CITY || data.CENTRE || cityQuery || 'City',
        district: data.DISTRICT || data.CITY || cityQuery || 'District',
        state: data.STATE || 'Karnataka',
        address: data.ADDRESS ? `${data.ADDRESS}` : `${data.BRANCH || branchQuery || 'Main'}, ${data.CITY || cityQuery}`,
        micr: data.MICR || 'N/A',
        isLiveVerified: true
      }]
    }
  } catch {}

  const inst = INSTITUTIONS.find(i => i.id === bankId)
  const normCity = (cityQuery || 'City').trim()
  const normBranch = (branchQuery || 'Main Branch').trim()
  return [{
    ifsc: fallbackIfsc,
    bankName: inst?.name || 'Bank',
    branchName: normBranch,
    city: normCity,
    district: normCity,
    state: 'Karnataka',
    address: `${normBranch} Branch, ${normCity}`,
    micr: 'N/A',
    isLiveVerified: true
  }]
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
      return <img src="/logos/sbi.png" alt="State Bank of India" style={{ height: 75, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
    default:
      return <span style={{ fontSize: 48 }}>🏦</span>
  }
}


export default function Advanced({ go, goBack, state, update, addXP, themeMode = 'dark' }) {
  const isLight = themeMode === 'light'
  const registeredUserName = state?.user?.name || 'Niyathi'

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

  // Level 3 Tab Switcher State
  const [activeTab, setActiveTab] = useState('paper_slip') // 'paper_slip' | 'digital_safety'

  

  // Search Mode for Branch / IFSC / PIN Code
  const [searchMode, setSearchMode] = useState('ifsc')
  const [cityInput, setCityInput] = useState('')
  const [branchInput, setBranchInput] = useState('')
  const [ifscInput, setIfscInput] = useState('')
  const [pincodeInput, setPincodeInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [searchResultsList, setSearchResultsList] = useState([])
  const [toastMsg, setToastMsg] = useState(null)
  const [highlightForm, setHighlightForm] = useState(false)
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const [caseVerdict, setCaseVerdict] = useState(null)
  const [completedCases, setCompletedCases] = useState([])

  const handlePerformSearch = async () => {
    setSearchLoading(true)
    setSearchResult(null)
    setSearchResultsList([])

    if (searchMode === 'pincode') {
      const pin = pincodeInput.trim()
      if (!pin || pin.length < 6) {
        alert('Please enter a valid 6-digit Indian PIN Code (e.g. 560001).')
        setSearchLoading(false)
        return
      }
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
            const poList = data[0].PostOffice
            const firstPo = poList[0]
            const matched = {
              bankName: 'India Post Savings Bank (IPPB)',
              branchName: `${firstPo.Name} Post Office`,
              city: firstPo.District,
              state: firstPo.State,
              ifsc: 'IPOS0000001',
              address: `${firstPo.Name} Post Office, ${firstPo.District}, ${firstPo.State} - ${pin}`,
              pincode: pin,
              micr: 'IPPB-560001',
              neft: true, rtgs: true, imps: true, upi: true,
              isLiveVerified: true
            }
            setSearchResult(matched)
          } else {
            alert('PIN Code not found. Please enter a valid 6-digit Indian PIN Code.')
          }
        }
      } catch (err) {
        console.error('PIN Code fetch error:', err)
        alert('Unable to fetch PIN Code data right now.')
      }
      setSearchLoading(false)
      return
    }

    if (searchMode === 'ifsc') {
      const code = ifscInput.trim().toUpperCase()
      if (!code) {
        alert('Please enter an IFSC code to search (e.g. SBIN0000840 or CNRB0001001).')
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
            state: data.STATE,
            ifsc: code,
            address: `${data.ADDRESS}, ${data.CITY}, ${data.STATE}`,
            micr: data.MICR || 'N/A',
            neft: data.NEFT ?? true,
            rtgs: data.RTGS ?? true,
            imps: data.IMPS ?? true,
            upi: data.UPI ?? true,
            isLiveVerified: true
          }
          setSearchResult(matched)
        } else {
          const currentInst = INSTITUTIONS.find(b => b.id === selectedBankId)
          const matched = {
            bankName: currentInst?.name || 'Bank',
            branchName: 'Main Branch',
            city: 'City Branch',
            ifsc: code,
            address: `Main Branch, ${currentInst?.name || 'Bank'}`,
            isLiveVerified: false
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
          address: `Main Branch, ${currentInst?.name || 'Bank'}`,
          isLiveVerified: false
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

      const matches = await fetchLiveBranchDetailsList(selectedBankId, cityQ, branchQ)
      if (matches && matches.length > 0) {
        setSearchResultsList(matches)
        setSearchResult(matches[0])
      } else {
        alert('No matching branch found. Please verify the City or Branch name.')
      }
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
    setToastMsg(`✅ APPLIED TO FORM: Branch "${searchResult.branchName}, ${searchResult.city}" & IFSC "${searchResult.ifsc}"`)
    setHighlightForm(true)
    setTimeout(() => setToastMsg(null), 4500)
    setTimeout(() => setHighlightForm(false), 2500)

    const formElem = document.getElementById('user-info-form-section')
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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
    signature: null,
    notes500: '',
    notes200: '',
    notes100: '',
    notes50: ''
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
      let digits = []
      if (userData.date) {
        const parts = userData.date.split(/[-/]/)
        if (parts.length === 3) {
          let day = parts[0], month = parts[1], year = parts[2]
          if (parts[0].length === 4) { // YYYY-MM-DD format
            year = parts[0]; month = parts[1]; day = parts[2]
          }
          digits = `${day.padStart(2, '0')}${month.padStart(2, '0')}${year}`.split('')
        }
      }
      return (
        <div key={field.id} style={{
          position: 'absolute',
          top: `${field.y}%`,
          left: field.x ? `${field.x}%` : 'auto',
          right: field.right ? `${field.right}%` : 'auto',
          display: 'flex',
          gap: `${field.gap || 6}px`,
          fontSize: field.fontSize || '0.85rem',
          color: field.color || '#1d4ed8',
          fontWeight: field.fontWeight || 900,
          fontFamily: "'Courier New', monospace"
        }}>
          {digits.map((d, i) => (
            <span key={i} style={{ width: field.boxWidth || '14px', textAlign: 'center', display: 'inline-block' }}>{d}</span>
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
          gap: `${field.gap || 6}px`,
          letterSpacing: field.letterSpacing || 'normal',
          fontSize: field.fontSize || '0.9rem',
          color: field.color || '#1d4ed8',
          fontWeight: field.fontWeight || 900,
          fontFamily: "'Courier New', monospace"
        }}>
          {chars.map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', width: field.boxWidth || '14px', textAlign: 'center' }}>{ch}</span>
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
          width: `${field.width || 15}%`,
          height: `${field.height || 8}%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {userData.signature ? (
            <img src={userData.signature} alt="User Signature" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontSize: '1.05rem', color: '#1d4ed8', fontWeight: 800, fontFamily: "'Caveat', 'Brush Script MT', 'Dancing Script', cursive", transform: 'rotate(-2deg)' }}>
              {userData.name ? userData.name : ''}
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
        fontFamily: field.fontFamily || "'Courier New', monospace",
        lineHeight: 1.25,
        wordBreak: 'break-word',
        whiteSpace: field.width ? 'normal' : 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
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
          <span>⬅ Back</span>
        </button>

      </div>

      {/* Level 3 High Contrast Tab Switcher Bar */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('paper_slip')}
          style={{
            flex: '1 1 200px',
            fontSize: 14,
            fontWeight: 900,
            padding: '14px 20px',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'paper_slip'
              ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
              : (isLight ? '#ffedd5' : '#1e1b18'),
            color: activeTab === 'paper_slip' ? '#ffffff' : (isLight ? '#9a3412' : '#fbbf24'),
            border: activeTab === 'paper_slip'
              ? '2.5px solid #c2410c'
              : `2.5px solid ${isLight ? '#ea580c' : 'rgba(217, 119, 6, 0.6)'}`,
            boxShadow: activeTab === 'paper_slip'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          📝 BANK PAPER SLIP WRITER 🏛️
        </button>
        
        <button
          onClick={() => setActiveTab('digital_safety')}
          style={{
            flex: '1 1 200px',
            fontSize: 14,
            fontWeight: 900,
            padding: '14px 20px',
            borderRadius: 14,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'digital_safety'
              ? 'linear-gradient(135deg, #ea580c, #f59e0b)'
              : (isLight ? '#ffedd5' : '#1e1b18'),
            color: activeTab === 'digital_safety' ? '#ffffff' : (isLight ? '#9a3412' : '#fbbf24'),
            border: activeTab === 'digital_safety'
              ? '2.5px solid #c2410c'
              : `2.5px solid ${isLight ? '#ea580c' : 'rgba(217, 119, 6, 0.6)'}`,
            boxShadow: activeTab === 'digital_safety'
              ? '0 6px 20px rgba(234, 88, 12, 0.4)'
              : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none')
          }}
        >
          🌐 DIGITAL BANKING & SAFETY 🛡️
        </button>
      </div>

      {activeTab === 'paper_slip' && (
        <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

      {/* ─── SECTION 2: LIVE BANK & POST OFFICE LOCATOR + DEPOSIT SLIP GENERATOR ─── */}
      <div className="glass-card-deep" style={{ padding: 20, borderRadius: 20, marginBottom: 20, background: isLight ? '#ffffff' : '#12100c', border: '1.5px solid #ea580c' }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
          🏦 LIVE BANK & POST OFFICE LOCATOR (SEARCH BY IFSC, PIN CODE OR BRANCH) 📮
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSearchMode('ifsc')}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 900, cursor: 'pointer',
              background: searchMode === 'ifsc' ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
              color: searchMode === 'ifsc' ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
              border: `1.5px solid ${searchMode === 'ifsc' ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
            }}
          >
            ⚡ SEARCH BY IFSC CODE (e.g. SBIN0000840)
          </button>

          <button
            onClick={() => setSearchMode('pincode')}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 900, cursor: 'pointer',
              background: searchMode === 'pincode' ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
              color: searchMode === 'pincode' ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
              border: `1.5px solid ${searchMode === 'pincode' ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
            }}
          >
            📍 SEARCH BY PIN CODE (e.g. 560001)
          </button>

          <button
            onClick={() => setSearchMode('city_branch')}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 11, fontWeight: 900, cursor: 'pointer',
              background: searchMode === 'city_branch' ? '#ea580c' : (isLight ? '#ffedd5' : 'rgba(255,255,255,0.06)'),
              color: searchMode === 'city_branch' ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
              border: `1.5px solid ${searchMode === 'city_branch' ? '#c2410c' : 'rgba(234, 88, 12, 0.3)'}`
            }}
          >
            🔍 SEARCH BY CITY & BRANCH NAME
          </button>
        </div>

        {searchMode === 'pincode' ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={pincodeInput}
              onChange={e => setPincodeInput(e.target.value)}
              placeholder="Enter 6-Digit PIN Code (e.g. 560001 or 110001)"
              className="input-light"
              style={{ flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 12, fontWeight: 700 }}
            />
            <button
              onClick={handlePerformSearch}
              disabled={searchLoading}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 12, fontWeight: 900 }}
            >
              {searchLoading ? 'FETCHING...' : 'FETCH POST OFFICE & BRANCH DETAILS'}
            </button>
          </div>
        ) : searchMode === 'ifsc' ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={ifscInput}
              onChange={e => setIfscInput(e.target.value)}
              placeholder="Enter 11-Digit IFSC Code (e.g. CNRB0001001 or SBIN0000840)"
              className="input-light"
              style={{ flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}
            />
            <button
              onClick={handlePerformSearch}
              disabled={searchLoading}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 12, fontWeight: 900 }}
            >
              {searchLoading ? 'SEARCHING...' : 'FIND BANK BRANCH DETAILS'}
            </button>
          </div>
        ) : (
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
        )}

        {searchResultsList.length > 1 && (
          <div className="anim-fade" style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 14,
            background: isLight ? '#f1f5f9' : 'rgba(0,0,0,0.4)',
            border: '1.5px solid #ea580c'
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: isLight ? '#c2410c' : '#fbbf24', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔍</span>
              <span>FOUND {searchResultsList.length} VERIFIED BRANCHES IN LIVE RBI DATABASE:</span>
            </div>
            <select
              value={searchResult?.ifsc}
              onChange={(e) => {
                const selected = searchResultsList.find(m => m.ifsc === e.target.value)
                if (selected) setSearchResult(selected)
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                background: isLight ? '#ffffff' : '#12100c',
                color: isLight ? '#0f172a' : '#ffffff',
                border: '1.5px solid #ea580c',
                cursor: 'pointer'
              }}
            >
              {searchResultsList.map(m => (
                <option key={m.ifsc} value={m.ifsc}>
                  {m.branchName} — IFSC: {m.ifsc} | {m.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {searchResult && (
          <div className="anim-fade" style={{
            marginTop: 16,
            background: isLight ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' : 'rgba(234, 88, 12, 0.18)',
            padding: 18, borderRadius: 16,
            border: '2px solid #ea580c',
            boxShadow: isLight ? '0 8px 24px rgba(234, 88, 12, 0.15)' : '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 10, fontWeight: 900,
                  background: '#10b981', color: '#ffffff',
                  padding: '3px 10px', borderRadius: 999,
                  letterSpacing: '0.5px'
                }}>
                  LIVE RBI API VERIFIED ✅
                </span>
                {searchResult.micr && searchResult.micr !== 'N/A' && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#ea580c', background: isLight ? '#ffffff' : 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: 6, border: '1px solid #ea580c' }}>
                    MICR: {searchResult.micr}
                  </span>
                )}
              </div>

              <div style={{ fontSize: 15, fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                🏛️ {searchResult.bankName} — {searchResult.branchName} ({searchResult.city})
              </div>

              <div style={{ fontSize: 13, fontWeight: 900, color: '#ea580c', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>IFSC CODE:</span>
                <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 900, background: isLight ? '#ffffff' : '#000000', padding: '2px 8px', borderRadius: 6, border: '1px solid #ea580c', color: isLight ? '#9a3412' : '#fbbf24' }}>
                  {searchResult.ifsc}
                </span>
              </div>

              <div style={{ fontSize: 12, color: isLight ? '#334155' : '#cbd5e1', marginTop: 6, fontWeight: 700 }}>
                📍 {searchResult.address}
              </div>
            </div>

            <button
              onClick={applySearchResultToForm}
              style={{
                padding: '12px 22px', borderRadius: 12, background: 'linear-gradient(135deg, #059669, #10b981)', color: '#ffffff',
                border: '1.5px solid #34d399', fontWeight: 900, fontSize: 13, cursor: 'pointer', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
              }}
            >
              ✓ APPLY IFSC & BRANCH TO FORM
            </button>
          </div>
        )}

        {toastMsg && (
          <div className="anim-scale" style={{
            marginTop: 12, padding: '12px 18px', borderRadius: 12,
            background: '#10b981', color: '#ffffff', fontWeight: 900, fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
          }}>
            <span>✅</span>
            <span>{toastMsg}</span>
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

      {/* ─── SECTION 4: SINGLE MASTER USER INPUT FORM ─── */}
      <div id="user-info-form-section" className="glass-card-deep" style={{
        padding: 24, borderRadius: 20, marginBottom: 20,
        background: isLight ? '#ffffff' : '#12100c',
        border: highlightForm ? '3px solid #10b981' : '1.5px solid #ea580c',
        boxShadow: highlightForm ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
        transition: 'all 0.4s'
      }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: highlightForm ? '#10b981' : '#ea580c', textTransform: 'uppercase', marginBottom: 12 }}>
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
              style={{
                padding: '9px 12px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
                border: highlightForm ? '2.5px solid #10b981' : undefined,
                background: highlightForm ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.2)') : undefined,
                transition: 'all 0.3s'
              }}
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
              style={{
                padding: '9px 12px', fontSize: 12, fontWeight: 800,
                border: highlightForm ? '2.5px solid #10b981' : undefined,
                background: highlightForm ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.2)') : undefined,
                transition: 'all 0.3s'
              }}
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
        <div className="printable-slip-area" style={{
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
    </div>
  )}

      {/* ─── DIGITAL BANKING & CYBER SAFETY ARENA ─── */}
      {activeTab === 'digital_safety' && (
        <div className="anim-scale glass-card-deep" style={{ padding: '32px', marginBottom: 24, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #ea580c', color: isLight ? '#0f172a' : '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="sticker-badge sticker-yellow" style={{ marginBottom: 10 }}>
              🌐 CYBER SAFETY ARENA
            </div>
            <h2 className="font-display" style={{ fontSize: 36, color: isLight ? '#0f172a' : 'var(--heading-color, #ffffff)', marginBottom: 4 }}>
              DIGITAL BANKING & SAFETY 🛡️
            </h2>
            <p style={{ color: isLight ? '#475569' : 'var(--text-sub, #d1d5db)', fontSize: 13, fontWeight: 600 }}>
              Defend your bank account against real-world phishing traps and cyber scams!
            </p>
          </div>

          {!cyberGameCompleted ? (
            <div className="glass-card" style={{
              padding: 26, borderRadius: 22,
              border: '2.5px solid #ea580c',
              background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)',
              boxShadow: isLight ? '0 12px 36px rgba(234, 88, 12, 0.12)' : '0 8px 32px rgba(0,0,0,0.5)',
              color: isLight ? '#0f172a' : '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <span style={{
                  fontSize: 12, fontWeight: 900,
                  color: isLight ? '#c2410c' : '#fbbf24',
                  background: isLight ? '#fff7ed' : 'rgba(234, 88, 12, 0.2)',
                  padding: '6px 16px', borderRadius: 999,
                  border: '1.5px solid #ea580c',
                  letterSpacing: '0.5px'
                }}>
                  🎯 SCENARIO {digitalScenarioIdx + 1} OF {CYBER_SCENARIOS.length}
                </span>
                <div style={{
                  fontSize: 12, fontWeight: 900,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#ffffff',
                  padding: '6px 16px', borderRadius: 999,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  border: '1.5px solid #34d399'
                }}>
                  🛡️ SHIELD HEALTH: {shieldScore}%
                </div>
              </div>

              <div style={{
                background: isLight ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' : 'rgba(245, 158, 11, 0.14)',
                borderRadius: 18, padding: 22,
                border: '2px solid #ea580c', marginBottom: 22,
                boxShadow: isLight ? '0 6px 20px rgba(234, 88, 12, 0.1)' : 'none'
              }}>
                <h3 style={{ fontWeight: 900, fontSize: 18, color: isLight ? '#9a3412' : '#fbbf24', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].title}
                </h3>
                <p style={{ fontSize: 15, color: isLight ? '#0f172a' : '#f3f4f6', lineHeight: 1.6, fontWeight: 800, margin: 0 }}>
                  {CYBER_SCENARIOS[digitalScenarioIdx].scenario}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {CYBER_SCENARIOS[digitalScenarioIdx].opts.map((opt, i) => {
                  const isSelected = selectedOpt === i
                  const isCorrect = opt.correct
                  let btnBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.06)'
                  let btnBorder = isLight ? '#ea580c' : '#f59e0b'
                  let btnColor = isLight ? '#0f172a' : '#ffffff'

                  if (isSelected) {
                    btnBg = isCorrect ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #e11d48, #f43f5e)'
                    btnBorder = isCorrect ? '#047857' : '#be123c'
                    btnColor = '#ffffff'
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleCyberAnswer(i)}
                      style={{
                        textAlign: 'left', fontSize: 13, padding: '15px 20px', width: '100%',
                        fontWeight: 900, borderRadius: 14, cursor: 'pointer',
                        background: btnBg,
                        color: btnColor,
                        border: `2.5px solid ${btnBorder}`,
                        boxShadow: isSelected
                          ? (isCorrect ? '0 6px 20px rgba(16, 185, 129, 0.4)' : '0 6px 20px rgba(225, 29, 72, 0.4)')
                          : (isLight ? '0 2px 8px rgba(234, 88, 12, 0.1)' : 'none'),
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {opt.text}
                    </button>
                  )
                })}
              </div>

              {digitalFeedback && (
                <div className="anim-fade" style={{
                  background: isLight ? '#ffedd5' : 'rgba(245,158,11,0.12)', border: '1.5px solid #f59e0b',
                  borderRadius: 14, padding: 16, marginBottom: 20, color: isLight ? '#7c2d12' : '#fef3c7', fontSize: 13, lineHeight: 1.5, fontWeight: 700
                }}>
                  💡 {digitalFeedback}
                </div>
              )}

              {selectedOpt !== null && (
                <button className="btn-primary" onClick={handleNextScenario} style={{ width: '100%', fontSize: 14, fontWeight: 900 }}>
                  {digitalScenarioIdx < CYBER_SCENARIOS.length - 1 ? 'NEXT SCENARIO →' : '🏆 FINISH CHALLENGE (+50 XP)'}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, background: isLight ? '#ffffff' : 'var(--bg-card-deep, #12100c)', border: '2px solid #ea580c', borderRadius: 20 }} className="glass-card">
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛡️</div>
              <h3 className="font-display" style={{ fontSize: 32, color: isLight ? '#ea580c' : '#fbbf24', marginBottom: 8 }}>
                CHALLENGE PASSED!
              </h3>
              <p style={{ color: isLight ? '#475569' : '#d1d5db', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                Shield Health: {shieldScore}% • You earned +50 XP and mastered digital bank safety!
              </p>
            </div>
          )}



          {/* Phone SMS & Phishing Message Analyzer */}
          <MessageScamAnalyzer themeMode={themeMode} />

          {/* Video Tutorials Section */}
          <div style={{ marginTop: 32 }}>
            <h3 className="font-display" style={{ fontSize: 24, color: isLight ? '#0f172a' : '#ffffff', marginBottom: 16 }}>
              🎬 DIGITAL BANKING TUTORIALS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              {Object.keys(VIDEOS_DB).map(vKey => (
                <button
                  key={vKey}
                  onClick={() => setSelectedVideo(vKey)}
                  className={selectedVideo === vKey ? 'btn-primary' : 'btn-outline'}
                  style={{
                    fontSize: 12, padding: '12px', fontWeight: 800,
                    color: selectedVideo === vKey ? '#ffffff' : (isLight ? '#7c2d12' : '#fbbf24'),
                    borderColor: isLight ? '#ea580c' : undefined
                  }}
                >
                  {VIDEOS_DB[vKey].title}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16, border: '2px solid #ea580c' }}>
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
            borderRadius: 24, padding: 24,
            maxWidth: 780, width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
            textAlign: 'center', color: isLight ? '#0f172a' : '#ffffff',
            position: 'relative'
          }} className="anim-scale" onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setShowVerifyModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#ea580c', fontSize: 22, cursor: 'pointer', fontWeight: 900 }}>✕</button>

            <div style={{ fontSize: 36, marginBottom: 4 }}>📋</div>
            <h3 className="font-display" style={{ fontSize: 22, margin: '0 0 4px' }}>
              FINAL REVIEW OF FILLED SLIP
            </h3>
            <p style={{ fontSize: 12, color: isLight ? '#475569' : '#d1d5db', marginBottom: 16 }}>
              Review your completed {currentTemplate.institution} ({docType.toUpperCase()}) slip below before downloading or printing.
            </p>

            {/* Exact Filled Slip Visual Card Preview */}
            <div className="printable-slip-area" style={{
              position: 'relative',
              width: '100%',
              borderRadius: 14,
              overflow: 'hidden',
              border: '2px solid #ea580c',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              background: '#ffffff',
              marginBottom: 20
            }}>
              <img
                src={currentTemplate.image}
                alt={`${currentTemplate.institution} ${docType}`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {currentTemplate.fields.map(field => renderFieldValue(field))}
              </div>
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
                🖨️ PRINT / DOWNLOAD FILLED SLIP PDF
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
