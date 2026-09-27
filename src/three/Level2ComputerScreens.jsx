import React, { useState, useMemo } from 'react'

const fmtINR = (val) => '₹' + Math.round(Number(val) || 0).toLocaleString('en-IN')

export const SIMULATOR_MODULES = [
  {
    id: 'ppf',
    name: 'PPF Simulator',
    fullName: 'Public Provident Fund (PPF Simulator)',
    icon: '🏛️',
    rate: 7.1,
    color: '#6366F1',
    description:
      'Government-backed 15-year tax-free wealth builder under Section 80C (EEE status: Deposit, Interest & Maturity are 100% tax-free).',
    amountLabel: 'Annual Deposit (₹ / Year)',
    minAmount: 500,
    maxAmount: 150000,
    stepAmount: 500,
    defaultAmount: 50000,
    durationUnit: 'Years',
    minDuration: 15,
    maxDuration: 30,
    defaultDuration: 15,
    durationFixed: false,
    keyFacts: [
      '🏛️ 7.1% p.a. compounded annually (Sovereign Guarantee)',
      '🛡️ EEE Tax Status: Up to ₹1.5L/yr deduction under Sec 80C + Tax-free maturity',
      '🔒 15-Year lock-in (extendable in 5-year blocks); partial withdrawal from Year 7',
      '💰 Min ₹500/yr • Max ₹1,50,000/yr',
    ],
  },
  {
    id: 'fd',
    name: 'Fixed Deposit',
    fullName: 'Bank Fixed Deposit (FD Simulator)',
    icon: '🏦',
    rate: 7.25,
    color: '#10B981',
    description:
      'Safe lump-sum deposit with guaranteed quarterly compounded returns and DICGC insurance coverage up to ₹5 Lakh per bank.',
    amountLabel: 'Lump-Sum Deposit (₹)',
    minAmount: 1000,
    maxAmount: 1000000,
    stepAmount: 5000,
    defaultAmount: 100000,
    durationUnit: 'Years',
    minDuration: 1,
    maxDuration: 10,
    defaultDuration: 5,
    durationFixed: false,
    keyFacts: [
      '🏦 7.25% p.a. compounded quarterly for higher effective yield',
      '🛡️ Insured up to ₹5,00,000 per depositor per bank by DICGC (RBI)',
      '🧾 5-Year Tax-Saver FD qualifies for Section 80C deduction up to ₹1.5L',
      '⚡ Instant liquidity available via premature withdrawal (0.5%–1% penalty) or FD overdraft',
    ],
  },
  {
    id: 'nsc',
    name: 'NSC Calculator',
    fullName: 'National Savings Certificate (NSC VIII Issue)',
    icon: '📜',
    rate: 7.7,
    color: '#F59E0B',
    description:
      'India Post 5-year fixed-tenure savings bond with guaranteed 7.7% annual compounding and Section 80C tax deduction.',
    amountLabel: 'Lump-Sum Investment (₹)',
    minAmount: 1000,
    maxAmount: 500000,
    stepAmount: 1000,
    defaultAmount: 50000,
    durationUnit: 'Years',
    minDuration: 5,
    maxDuration: 5,
    defaultDuration: 5,
    durationFixed: true,
    keyFacts: [
      '📜 7.7% p.a. compounded annually, paid out in full at 5-year maturity',
      '🧾 Principal + first 4 years accrued interest qualify for Section 80C deduction',
      '🔒 Fixed 5-Year statutory lock-in period backed by Government of India',
      '📮 Minimum investment ₹1,000 with no upper limit at any Post Office',
    ],
  },
  {
    id: 'ssy',
    name: 'Sukanya Samriddhi',
    fullName: 'Sukanya Samriddhi Yojana (SSY Simulator)',
    icon: '👧',
    rate: 8.2,
    color: '#EC4899',
    description:
      'Highest-yielding Government of India girl child savings scheme offering 8.2% p.a. tax-free compounding (EEE category).',
    amountLabel: 'Annual Contribution (₹ / Year)',
    minAmount: 250,
    maxAmount: 150000,
    stepAmount: 500,
    defaultAmount: 60000,
    durationUnit: 'Years',
    minDuration: 15,
    maxDuration: 21,
    defaultDuration: 15,
    durationFixed: false,
    keyFacts: [
      '👧 8.2% p.a. — Highest guaranteed rate among all Government savings schemes',
      '🛡️ 100% Tax-Free (EEE): 80C deduction up to ₹1.5L, tax-free interest & maturity',
      '🎓 50% withdrawal allowed at age 18 for higher education; matures at 21 years',
      '💰 Min ₹250/yr • Max ₹1,50,000/yr for girl child below age 10',
    ],
  },
  {
    id: 'rd',
    name: 'Recurring Deposit',
    fullName: 'Recurring Deposit (Monthly RD Simulator)',
    icon: '🔄',
    rate: 7.0,
    color: '#06B6D4',
    description:
      'Build disciplined monthly savings from pocket money or salary with quarterly compounded interest and zero market volatility.',
    amountLabel: 'Monthly Instalment (₹ / Month)',
    minAmount: 500,
    maxAmount: 50000,
    stepAmount: 500,
    defaultAmount: 5000,
    durationUnit: 'Years',
    minDuration: 1,
    maxDuration: 10,
    defaultDuration: 5,
    durationFixed: false,
    keyFacts: [
      '🔄 7.0% p.a. compounded quarterly on every monthly instalment',
      '📅 Flexible tenure from 1 Year to 10 Years — ideal for goal-based monthly saving',
      '💰 Start with as little as ₹100–₹500/month without needing a lump sum',
      '🏦 Available across all scheduled banks and India Post offices',
    ],
  },
  {
    id: 'pomis',
    name: 'Post Office MIS',
    fullName: 'Post Office Monthly Income Scheme (POMIS)',
    icon: '📮',
    rate: 7.4,
    color: '#8B5CF6',
    description:
      'Invest a one-time lump sum and receive guaranteed monthly cash payouts at 7.4% p.a. for 5 years with 100% principal safety.',
    amountLabel: 'One-Time Deposit (₹)',
    minAmount: 1000,
    maxAmount: 900000,
    stepAmount: 5000,
    defaultAmount: 300000,
    durationUnit: 'Years',
    minDuration: 5,
    maxDuration: 5,
    defaultDuration: 5,
    durationFixed: true,
    keyFacts: [
      '📮 7.4% p.a. paid out every single month directly to your savings account',
      '💵 Steady passive cash flow — e.g., ₹3,00,000 deposit pays ₹1,850 every month',
      '🔒 5-Year tenure; 100% of principal is refunded at maturity',
      '🛡️ Max ₹9 Lakh (Single Account) or ₹15 Lakh (Joint Account)',
    ],
  },
]


// Full 6 required schemes for Computer 1, Computer 2 (Savings Mixer), and Computer 3 (Portfolio Simulation)
export const SIX_CORE_SCHEMES = [
  {
    id: 'ppf',
    name: 'PPF Simulator',
    shortName: 'PPF Simulator',
    icon: '🏛️',
    rate: 7.1,
    color: '#6366F1',
    minYears: 15,
    lockIn: '15 Years',
    taxBenefit: 'EEE (100% Tax-Free under 80C)',
    risk: 'Zero Risk (Sovereign Guarantee)',
    minInvest: '₹500 / yr',
    maxInvest: '₹1,50,000 / yr',
    compounding: 'Annual Compounding',
    bestFor: 'Long-term tax-free retirement & wealth creation',
    educationalNote:
      'Public Provident Fund (PPF) is a 15-year Government of India scheme offering 7.1% p.a. with EEE tax status: contributions up to ₹1.5L qualify for Section 80C deduction, interest is tax-free, and maturity proceeds are 100% exempt from income tax.',
  },
  {
    id: 'fd',
    name: 'Fixed Deposit',
    shortName: 'Fixed Deposit',
    icon: '🏦',
    rate: 7.25,
    color: '#10B981',
    minYears: 1,
    lockIn: '7 Days – 10 Years',
    taxBenefit: '5-Yr Tax Saver FD under 80C (Interest Taxable)',
    risk: 'Very Low (DICGC Insured up to ₹5L)',
    minInvest: '₹1,000',
    maxInvest: 'No Upper Limit',
    compounding: 'Quarterly Compounding',
    bestFor: 'Lump-sum capital protection with guaranteed returns',
    educationalNote:
      'Bank Fixed Deposits (FD) lock in a guaranteed interest rate (around 7.25% p.a.) compounded quarterly. Deposits up to ₹5 Lakh per bank are insured by DICGC. Premature withdrawal is permitted with a small 0.5%–1% interest penalty.',
  },
  {
    id: 'nsc',
    name: 'NSC Calculator',
    shortName: 'NSC Calculator',
    icon: '📜',
    rate: 7.7,
    color: '#F59E0B',
    minYears: 5,
    lockIn: '5 Years Fixed',
    taxBenefit: '80C Deduction up to ₹1.5L',
    risk: 'Zero Risk (Post Office / Govt Backed)',
    minInvest: '₹1,000',
    maxInvest: 'No Upper Limit',
    compounding: 'Annual Compounding (Paid at Maturity)',
    bestFor: 'Medium-term 5-year guaranteed savings & tax deduction',
    educationalNote:
      'National Savings Certificate (NSC) is a 5-year Post Office savings bond paying 7.7% p.a. compounded annually. Interest for the first 4 years is deemed reinvested and also qualifies for Section 80C tax deduction.',
  },
  {
    id: 'ssy',
    name: 'Sukanya Samriddhi',
    shortName: 'Sukanya Samriddhi',
    icon: '👧',
    rate: 8.2,
    color: '#EC4899',
    minYears: 15,
    lockIn: 'Until Age 21 (Deposits for 15 Yrs)',
    taxBenefit: 'EEE (100% Tax-Free under 80C)',
    risk: 'Zero Risk (Sovereign Guarantee)',
    minInvest: '₹250 / yr',
    maxInvest: '₹1,50,000 / yr',
    compounding: 'Annual Compounding',
    bestFor: 'Highest guaranteed tax-free return for girl child education/marriage',
    educationalNote:
      'Sukanya Samriddhi Yojana (SSY) offers the highest government-guaranteed rate at 8.2% p.a. with full EEE tax exemption. Up to 50% of the corpus can be withdrawn once the girl turns 18 for higher education.',
  },
  {
    id: 'rd',
    name: 'Recurring Deposit',
    shortName: 'Recurring Deposit',
    icon: '🔄',
    rate: 7.0,
    color: '#06B6D4',
    minYears: 1,
    lockIn: '6 Months – 10 Years',
    taxBenefit: 'No 80C Benefit (Interest Taxable as per Slab)',
    risk: 'Very Low (Bank / Post Office Backed)',
    minInvest: '₹100 / month',
    maxInvest: 'No Upper Limit',
    compounding: 'Quarterly Compounding on Monthly Instalments',
    bestFor: 'Building disciplined monthly savings from salary or pocket money',
    educationalNote:
      'Recurring Deposit (RD) lets you invest a fixed amount every month instead of a large lump sum, earning FD-like quarterly compounded interest (7.0% p.a.). Ideal for students and salaried beginners.',
  },
  {
    id: 'pomis',
    name: 'Post Office MIS',
    shortName: 'Post Office MIS',
    icon: '📮',
    rate: 7.4,
    color: '#8B5CF6',
    minYears: 5,
    lockIn: '5 Years',
    taxBenefit: 'No 80C Benefit (Monthly Payout Taxable)',
    risk: 'Zero Risk (Government of India Backed)',
    minInvest: '₹1,000',
    maxInvest: '₹9L (Single) / ₹15L (Joint)',
    compounding: 'Monthly Simple Interest Payout',
    bestFor: 'Steady guaranteed monthly cash flow / passive income',
    educationalNote:
      'Post Office Monthly Income Scheme (POMIS) pays out guaranteed monthly interest at 7.4% p.a. for 5 years while keeping 100% of your principal safe to be returned at maturity.',
  },
]

function computeModuleStats(mod, amount, duration) {
  const r = mod.rate / 100
  let totalInvested = 0
  let maturityValue = 0
  let extraLabel = null
  let extraVal = null

  if (mod.id === 'ppf' || mod.id === 'ssy') {
    totalInvested = amount * duration
    maturityValue = Math.round(amount * (((Math.pow(1 + r, duration) - 1) / r) * (1 + r)))
  } else if (mod.id === 'fd') {
    totalInvested = amount
    const n = 4
    maturityValue = Math.round(amount * Math.pow(1 + r / n, n * duration))
  } else if (mod.id === 'nsc') {
    totalInvested = amount
    maturityValue = Math.round(amount * Math.pow(1 + r, duration))
  } else if (mod.id === 'rd') {
    const months = duration * 12
    totalInvested = amount * months
    let mat = 0
    for (let m = 1; m <= months; m++) {
      const yearsLeft = (months - m + 1) / 12
      mat += amount * Math.pow(1 + r / 4, 4 * yearsLeft)
    }
    maturityValue = Math.round(mat)
  } else if (mod.id === 'pomis') {
    totalInvested = amount
    const monthlyIncome = Math.round((amount * r) / 12)
    const totalInterest = monthlyIncome * duration * 12
    maturityValue = amount + totalInterest
    extraLabel = 'Monthly Income'
    extraVal = fmtINR(monthlyIncome) + '/mo'
  }

  const totalInterest = Math.max(0, maturityValue - totalInvested)
  return { totalInvested, totalInterest, maturityValue, extraLabel, extraVal }
}

function computeSchemeMixerProjection(scheme, annualOrLumpAmount, years) {
  const r = scheme.rate / 100
  if (scheme.id === 'ppf' || scheme.id === 'ssy') {
    const invested = annualOrLumpAmount * years
    const maturity = Math.round(annualOrLumpAmount * (((Math.pow(1 + r, years) - 1) / r) * (1 + r)))
    return { invested, maturity, interest: Math.max(0, maturity - invested), modeLabel: `${fmtINR(annualOrLumpAmount)}/yr` }
  }
  if (scheme.id === 'rd') {
    const monthlyAmt = Math.round(annualOrLumpAmount / 12)
    const months = years * 12
    const invested = monthlyAmt * months
    let mat = 0
    for (let m = 1; m <= months; m++) {
      mat += monthlyAmt * Math.pow(1 + r / 4, 4 * ((months - m + 1) / 12))
    }
    const maturity = Math.round(mat)
    return { invested, maturity, interest: Math.max(0, maturity - invested), modeLabel: `${fmtINR(monthlyAmt)}/mo` }
  }
  if (scheme.id === 'pomis') {
    const invested = annualOrLumpAmount
    const monthlyPayout = Math.round((invested * r) / 12)
    const totalInterest = monthlyPayout * 12 * years
    const maturity = invested + totalInterest
    return { invested, maturity, interest: totalInterest, modeLabel: `${fmtINR(monthlyPayout)}/mo payout` }
  }
  if (scheme.id === 'fd') {
    const invested = annualOrLumpAmount
    const maturity = Math.round(invested * Math.pow(1 + r / 4, 4 * years))
    return { invested, maturity, interest: Math.max(0, maturity - invested), modeLabel: 'Quarterly Comp.' }
  }
  const invested = annualOrLumpAmount
  const maturity = Math.round(invested * Math.pow(1 + r, years))
  return { invested, maturity, interest: Math.max(0, maturity - invested), modeLabel: 'Annual Comp.' }
}

// ============================================================================
// COMPUTER 1: SIMULATOR MODULES (ALL 6 SCHEMES WITH FULL NAMES)
// ============================================================================
export function Computer1SimulatorScreen({
  state,
  update,
  addXP,
  onCompleteComputer1,
  onNextComputer,
}) {
  const handleNext = onCompleteComputer1 || onNextComputer
  const [selectedId, setSelectedId] = useState(SIMULATOR_MODULES[0].id)
  const mod = useMemo(() => SIMULATOR_MODULES.find((m) => m.id === selectedId) || SIMULATOR_MODULES[0], [selectedId])

  const [amount, setAmount] = useState(mod.defaultAmount)
  const [duration, setDuration] = useState(mod.defaultDuration)
  const [localExplored, setLocalExplored] = useState(['ppf'])

  const handleSelectMod = (m) => {
    setSelectedId(m.id)
    setAmount(m.defaultAmount)
    setDuration(m.defaultDuration)
    if (!localExplored.includes(m.id)) {
      const updated = [...localExplored, m.id]
      setLocalExplored(updated)
      if (update) {
        const nextMods = Array.from(new Set([...(state?.completedModules || []), ...updated]))
        update({ completedModules: nextMods })
      }
    }
  }

  const stats = useMemo(() => computeModuleStats(mod, amount, duration), [mod, amount, duration])
  const completedMods = Array.from(new Set([...(state?.completedModules || []), ...localExplored]))
  const isCompleted = completedMods.includes(mod.id)
  const allSixDone = completedMods.length >= 6

  const handleNextClick = () => {
    if (!allSixDone) {
      alert(`Please explore all 6 out of 6 schemes to unlock Computer 2! (Currently completed: ${completedMods.length}/6)`)
      return
    }
    if (handleNext) handleNext()
  }

  const handleMarkComplete = () => {
    if (!localExplored.includes(mod.id)) {
      setLocalExplored((prev) => [...prev, mod.id])
    }
    if (addXP) addXP(25)
    if (update) {
      const nextMods = Array.from(new Set([...(state?.completedModules || []), mod.id]))
      update({ completedModules: nextMods })
    }
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)',
        color: '#000000',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '6px', marginBottom: '7px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#0284C7', color: '#ffffff', fontWeight: 900, fontSize: '10px', padding: '3.5px 9px', borderRadius: '6px', letterSpacing: '0.7px', border: '1.5px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            🖥️ COMPUTER 1 • ALL 6 SIMULATORS
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000' }}>
            PPF • Fixed Deposit • NSC • Sukanya Samriddhi • RD • Post Office MIS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10.5px', color: '#000000', fontWeight: 900, background: '#E0F2FE', padding: '3px 9px', borderRadius: '999px', border: '1.5px solid #000000' }}>
            {allSixDone ? '✓ 6/6 Schemes Completed' : `🔒 ${completedMods.length}/6 Schemes Completed`}
          </span>
          {handleNext && (
            <button
              onClick={handleNextClick}
              style={{
                background: allSixDone ? 'linear-gradient(135deg, #059669, #10B981)' : '#E2E8F0',
                color: allSixDone ? '#ffffff' : '#64748B',
                border: '2px solid #000000',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 900,
                cursor: allSixDone ? 'pointer' : 'not-allowed',
                boxShadow: allSixDone ? '0 2px 8px rgba(16,185,129,0.25)' : 'none',
              }}
            >
              {allSixDone ? '✓ 6/6 Complete! Walk to Computer 2 →' : `🔒 Explore 6/6 Schemes (${completedMods.length}/6)`}
            </button>
          )}
        </div>
      </div>

      {/* 6 Scheme Tabs with Black Card Outlines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '8px', flexShrink: 0 }}>
        {SIMULATOR_MODULES.map((m) => {
          const active = m.id === selectedId
          const done = completedMods.includes(m.id)
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMod(m)}
              style={{
                background: active ? '#FFFFFF' : '#F8FAFC',
                border: active ? '2.5px solid #000000' : '2px solid #000000',
                borderRadius: '8px',
                padding: '6px 4px',
                color: '#000000',
                fontSize: '10.5px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                transition: 'all 0.15s',
                textAlign: 'center',
                lineHeight: 1.15,
                boxShadow: active ? '0 2px 10px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '12px' }}>{m.icon}</span>
                <span style={{ fontSize: '9.5px', color: '#000000', fontWeight: 900 }}>{m.rate}%</span>
                {done && <span style={{ color: '#059669', fontSize: '9.5px', fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', color: '#000000', fontWeight: 900 }}>
                {m.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.18fr 1fr', gap: '10px', flex: 1, minHeight: 0 }}>
        {/* Left Column: Sliders & Results (Black Border Card) */}
        <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '12px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '22px' }}>{mod.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#000000' }}>{mod.fullName}</div>
                  <div style={{ fontSize: '10.5px', color: '#000000', fontWeight: 800 }}>{mod.name} • Govt / RBI Regulated</div>
                </div>
              </div>
              <span style={{ background: '#FFF7ED', border: '2px solid #000000', color: '#000000', fontWeight: 900, fontSize: '11.5px', padding: '2px 9px', borderRadius: '999px' }}>
                {mod.rate}% p.a.
              </span>
            </div>

            <p style={{ fontSize: '10.5px', color: '#000000', lineHeight: 1.4, margin: '0 0 8px 0', fontWeight: 700 }}>
              {mod.description}
            </p>

            {/* Amount Slider Card */}
            <div style={{ marginBottom: '8px', background: '#F8FAFC', border: '2px solid #000000', padding: '7px 9px', borderRadius: '9px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ color: '#000000', fontWeight: 900 }}>{mod.amountLabel}</span>
                <span style={{ color: '#000000', fontWeight: 900, fontSize: '13px' }}>{fmtINR(amount)}</span>
              </div>
              <input
                type="range"
                min={mod.minAmount}
                max={mod.maxAmount}
                step={mod.stepAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: mod.color, cursor: 'pointer', height: '5px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#000000', marginTop: '2px', fontWeight: 800 }}>
                <span>Min: {fmtINR(mod.minAmount)}</span>
                <span>Max: {fmtINR(mod.maxAmount)}</span>
              </div>
            </div>

            {/* Duration Slider Card */}
            <div style={{ background: '#F8FAFC', border: '2px solid #000000', padding: '7px 9px', borderRadius: '9px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ color: '#000000', fontWeight: 900 }}>Duration ({mod.durationUnit})</span>
                <span style={{ color: '#000000', fontWeight: 900, fontSize: '13px' }}>
                  {duration} {mod.durationUnit}
                </span>
              </div>
              {mod.durationFixed ? (
                <div style={{ fontSize: '10.5px', color: '#000000', fontWeight: 900, padding: '2px 0' }}>
                  🔒 Fixed Statutory Tenure: {mod.defaultDuration} Years
                </div>
              ) : (
                <input
                  type="range"
                  min={mod.minDuration}
                  max={mod.maxDuration}
                  step={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer', height: '5px' }}
                />
              )}
            </div>
          </div>

          {/* Calculated Output Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: stats.extraLabel ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '6px', marginTop: '7px' }}>
            <div style={{ background: '#F8FAFC', border: '2px solid #000000', borderRadius: '8px', padding: '6px 8px' }}>
              <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800 }}>Total Invested</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>{fmtINR(stats.totalInvested)}</div>
            </div>
            <div style={{ background: '#ECFDF5', border: '2px solid #000000', borderRadius: '8px', padding: '6px 8px' }}>
              <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800 }}>Interest Earned</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>+{fmtINR(stats.totalInterest)}</div>
            </div>
            <div style={{ background: '#EEF2FF', border: '2px solid #000000', borderRadius: '8px', padding: '6px 8px' }}>
              <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800 }}>Maturity Value</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>{fmtINR(stats.maturityValue)}</div>
            </div>
            {stats.extraLabel && (
              <div style={{ background: '#FFFBEB', border: '2px solid #000000', borderRadius: '8px', padding: '6px 8px' }}>
                <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800 }}>{stats.extraLabel}</div>
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>{stats.extraVal}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Facts & Action (Black Border Card) */}
        <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '12px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '7px' }}>
              📋 SCHEME KEY TAKEAWAYS & RULES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(mod.keyFacts || []).map((fact, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #000000',
                    borderLeft: `5px solid ${mod.color}`,
                    borderRadius: '7px',
                    padding: '6px 9px',
                    fontSize: '10.5px',
                    color: '#000000',
                    fontWeight: 800,
                    lineHeight: 1.35,
                  }}
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Principal vs Interest Bar */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#000000', marginBottom: '3px', fontWeight: 900 }}>
              <span>Principal ({Math.round((stats.totalInvested / Math.max(1, stats.maturityValue)) * 100)}%)</span>
              <span>Interest ({Math.round((stats.totalInterest / Math.max(1, stats.maturityValue)) * 100)}%)</span>
            </div>
            <div style={{ height: '9px', borderRadius: '999px', background: '#E2E8F0', overflow: 'hidden', display: 'flex', border: '1.5px solid #000000' }}>
              <div style={{ width: `${(stats.totalInvested / Math.max(1, stats.maturityValue)) * 100}%`, background: '#0284C7' }} />
              <div style={{ flex: 1, background: '#10B981' }} />
            </div>

            <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }}>
              <button
                onClick={handleMarkComplete}
                style={{
                  flex: 1,
                  background: isCompleted ? '#ECFDF5' : `linear-gradient(135deg, ${mod.color}, #4F46E5)`,
                  color: isCompleted ? '#000000' : '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '7px',
                  padding: '7px 9px',
                  fontSize: '11px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: isCompleted ? 'none' : '0 2px 8px rgba(99,102,241,0.25)',
                }}
              >
                {isCompleted ? '✓ Explored (+25 XP)' : '✓ Mark Explored (+25 XP)'}
              </button>
              {handleNext && (
                <button
                  onClick={handleNextClick}
                  style={{
                    background: allSixDone ? 'linear-gradient(135deg, #0284C7, #2563EB)' : '#E2E8F0',
                    color: allSixDone ? '#ffffff' : '#64748B',
                    border: '2px solid #000000',
                    borderRadius: '7px',
                    padding: '7px 11px',
                    fontSize: '11px',
                    fontWeight: 900,
                    cursor: allSixDone ? 'pointer' : 'not-allowed',
                    boxShadow: allSixDone ? '0 2px 8px rgba(2,132,199,0.25)' : 'none',
                  }}
                >
                  {allSixDone ? 'Computer 2 →' : `🔒 (${completedMods.length}/6)`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPUTER 2: SAVINGS MIXER (COOL & UNIQUE + ALL 7 REQUIRED SECTIONS)
// ============================================================================
const MIXER_CHALLENGES = [
  {
    id: 'ch1',
    title: '🏆 Challenge 1: Tax-Free Retirement Champion',
    question:
      'Asha wants to invest ₹1,00,000/year for 15 years with 100% tax-free maturity under Section 80C (EEE status). Which scheme is best?',
    options: ['Fixed Deposit', 'PPF Simulator', 'Post Office MIS', 'Recurring Deposit'],
    correct: 'PPF Simulator',
    explanation: 'PPF offers 7.1% p.a. with full EEE (Exempt-Exempt-Exempt) tax status over 15 years!',
    proTip: '💡 EEE Status means your Deposit, Interest Earned, AND Final Maturity are 100% Tax-Free.',
  },
  {
    id: 'ch2',
    title: '👧 Challenge 2: Highest Girl-Child Guaranteed Yield',
    question:
      'Rohan wants to save for his 5-year-old daughter’s higher education at the highest government-guaranteed rate (8.2% p.a.). Which scheme wins?',
    options: ['NSC Calculator', 'Sukanya Samriddhi', 'Recurring Deposit', 'Fixed Deposit'],
    correct: 'Sukanya Samriddhi',
    explanation: 'Sukanya Samriddhi Yojana (SSY) gives 8.2% p.a. tax-free — the highest among all small savings schemes!',
    proTip: '💡 Up to 50% of the corpus can be withdrawn when she turns 18 for higher education fees.',
  },
  {
    id: 'ch3',
    title: '💵 Challenge 3: Monthly Passive Income Payout',
    question:
      'Retiree Meena has a ₹5,00,000 lump sum and needs a guaranteed cash payout every single month for 5 years. Which scheme should she pick?',
    options: ['Post Office MIS', 'PPF Simulator', 'NSC Calculator', 'Sukanya Samriddhi'],
    correct: 'Post Office MIS',
    explanation: 'Post Office MIS (POMIS) pays 7.4% p.a. distributed as a guaranteed monthly income stream!',
    proTip: '💡 A ₹3,00,000 POMIS deposit pays ₹1,850 cash into your account every month for 5 years.',
  },
  {
    id: 'ch4',
    title: '📈 Challenge 4: Beating 6% Inflation',
    question:
      'If inflation is 6.0% p.a. and you invest in NSC paying 7.7% p.a., what is your real purchasing power growth?',
    options: ['+1.7% p.a.', '+7.7% p.a.', '-1.7% p.a.', '0% p.a.'],
    correct: '+1.7% p.a.',
    explanation: 'Real Return = Nominal Interest (7.7%) − Inflation (6.0%) = +1.7% p.a. real growth!',
    proTip: '💡 Real returns reflect your true increase in purchasing power after prices rise.',
  },
]

const WHAT_YOU_SHOULD_KNOW_CARDS = [
  {
    icon: '🧮',
    title: 'Rule of 72 (Doubling Time)',
    badge: '72 ÷ Interest Rate',
    desc: 'Divide 72 by the annual interest rate to see how fast your money doubles! At 8.2% (Sukanya Samriddhi), money doubles in ~8.8 years; at 7.1% (PPF), in ~10.1 years.',
    color: '#38BDF8',
  },
  {
    icon: '🛡️',
    title: 'EEE vs ETE Tax Status',
    badge: 'Section 80C',
    desc: 'PPF & Sukanya Samriddhi are EEE (investment, interest, and maturity are all tax-free). In FD, RD, and POMIS, interest earned is taxable as per your income slab.',
    color: '#10B981',
  },
  {
    icon: '🔒',
    title: 'Liquidity vs Lock-In Tradeoff',
    badge: 'Emergency Access',
    desc: 'Never lock 100% of your money in 15-year schemes! Keep 3–6 months of expenses in a liquid FD/RD and put long-term surplus into PPF/SSY/NSC.',
    color: '#F59E0B',
  },
  {
    icon: '📈',
    title: 'Inflation-Beating Real Return',
    badge: 'Real Return = Nominal − Inflation',
    desc: 'If inflation is 5% and your scheme pays 7.7% (NSC), your real purchasing power grows by +2.7% every year with zero market risk.',
    color: '#EC4899',
  },
]

export function Computer2SavingsMixerScreen({
  state,
  addXP,
  onCompleteComputer2,
  onNextComputer,
  onPrevComputer,
}) {
  const handleNext = onCompleteComputer2 || onNextComputer

  // Track completed 6 schemes
  const completedMods = Array.from(new Set([...(state?.completedModules || [])]))
  const allSixDone = completedMods.length >= 6

  const handleNextClick = () => {
    if (!allSixDone) {
      alert(`Please explore all 6 out of 6 schemes in Computer 1 before advancing to Computer 3! (Currently completed: ${completedMods.length}/6)`)
      return
    }
    if (handleNext) handleNext()
  }

  // Active schemes in the simultaneous mixer (All 6 schemes active)
  const [activeSchemeIds, setActiveSchemeIds] = useState(['ppf', 'fd', 'nsc', 'ssy', 'rd', 'pomis'])
  const [mixerAmount, setMixerAmount] = useState(50000)
  const [mixerYears, setMixerYears] = useState(10)

  // Educational Notes is the 1st default tab
  const [activeSection, setActiveSection] = useState('notes')

  // Challenge state
  const [challengeAnswers, setChallengeAnswers] = useState({})

  const toggleSchemeInMixer = (id) => {
    setActiveSchemeIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev
        return prev.filter((x) => x !== id)
      }
      return [...prev, id]
    })
  }

  const addAllSchemes = () => setActiveSchemeIds(SIX_CORE_SCHEMES.map((s) => s.id))

  const activeSchemes = useMemo(
    () => SIX_CORE_SCHEMES.filter((s) => activeSchemeIds.includes(s.id)),
    [activeSchemeIds]
  )

  const projections = useMemo(() => {
    return activeSchemes.map((s) => ({
      scheme: s,
      ...computeSchemeMixerProjection(s, mixerAmount, mixerYears),
    }))
  }, [activeSchemes, mixerAmount, mixerYears])

  const maxMaturity = useMemo(
    () => Math.max(1, ...projections.map((p) => p.maturity)),
    [projections]
  )

  // Computer 2 Tab Navigation List
  const SECTION_TABS = [
    { id: 'notes', label: '📚 Educational Notes' },
    { id: 'comparison', label: '📊 Comparison Metric' },
    { id: 'know', label: '💡 What Should You Know' },
    { id: 'mixer', label: '🎛️ Simultaneous Mixer (6/6)' },
    { id: 'challenges', label: '🎯 Learning Challenges' },
  ]

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)',
        color: '#000000',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '6px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#10B981', color: '#FFFFFF', fontWeight: 900, fontSize: '10px', padding: '3.5px 9px', borderRadius: '6px', letterSpacing: '0.7px', border: '1.5px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            🎛️ COMPUTER 2 • SAVINGS MIXER STUDIO
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000' }}>
            Simultaneous Scheme Mixer, Notes, Metrics & Mastery Challenges
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10.5px', color: '#000000', fontWeight: 900, background: '#E0F2FE', padding: '3px 9px', borderRadius: '999px', border: '1.5px solid #000000' }}>
            {allSixDone ? '✓ 6/6 Schemes Completed' : `🔒 ${completedMods.length}/6 Schemes Completed`}
          </span>
          {onPrevComputer && (
            <button
              onClick={onPrevComputer}
              style={{
                background: '#FFFFFF',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '7px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              ← Computer 1
            </button>
          )}
          {handleNext && (
            <button
              onClick={handleNextClick}
              style={{
                background: allSixDone ? 'linear-gradient(135deg, #059669, #10B981)' : '#E2E8F0',
                color: allSixDone ? '#ffffff' : '#64748B',
                border: '2px solid #000000',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 900,
                cursor: allSixDone ? 'pointer' : 'not-allowed',
                boxShadow: allSixDone ? '0 2px 8px rgba(16,185,129,0.25)' : 'none',
              }}
            >
              {allSixDone ? 'Complete & Walk to Computer 3 →' : `🔒 Explore 6/6 Schemes (${completedMods.length}/6)`}
            </button>
          )}
        </div>
      </div>

      {/* 5 Section Navigation Pills with Black Outlines */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px', flexShrink: 0 }}>
        {SECTION_TABS.map((tab) => {
          const active = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                background: active ? '#0284C7' : '#FFFFFF',
                color: active ? '#FFFFFF' : '#000000',
                border: active ? '2.5px solid #000000' : '2px solid #000000',
                borderRadius: '999px',
                padding: '4px 11px',
                fontSize: '10.5px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: active ? '0 2px 8px rgba(2,132,199,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ background: '#E0F2FE', padding: '1px 6px', borderRadius: '999px', fontSize: '9px', color: '#000000', border: '1px solid #000000', fontWeight: 900 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Dynamic Workspace Area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
        {activeSection === 'mixer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#FFFFFF', border: '2px solid #000000', borderRadius: '9px', padding: '6px 10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '2px' }}>
                  <span style={{ color: '#000000', fontWeight: 900 }}>Simultaneous Investment Base</span>
                  <span style={{ color: '#000000', fontWeight: 900 }}>{fmtINR(mixerAmount)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={150000}
                  step={5000}
                  value={mixerAmount}
                  onChange={(e) => setMixerAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284C7', cursor: 'pointer', height: '5px' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '2px' }}>
                  <span style={{ color: '#000000', fontWeight: 900 }}>Comparison Horizon (Years)</span>
                  <span style={{ color: '#000000', fontWeight: 900 }}>{mixerYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={mixerYears}
                  onChange={(e) => setMixerYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer', height: '5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, Math.max(2, projections.length))}, 1fr)`, gap: '7px' }}>
              {projections.map(({ scheme, invested, maturity, interest, modeLabel }) => {
                const barPct = Math.max(12, Math.round((maturity / maxMaturity) * 100))
                return (
                  <div
                    key={scheme.id}
                    style={{
                      background: '#FFFFFF',
                      border: '2.5px solid #000000',
                      borderLeft: `6px solid ${scheme.color}`,
                      borderRadius: '9px',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#000000' }}>
                          {scheme.icon} {scheme.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#000000', background: '#FEF3C7', padding: '1px 5px', borderRadius: '999px', border: '1.5px solid #000000' }}>
                            {scheme.rate}%
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800, marginBottom: '5px' }}>
                        Mode: <strong style={{ color: '#000000', fontWeight: 900 }}>{modeLabel}</strong> • Lock-in: {scheme.lockIn}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px', color: '#000000', fontWeight: 900 }}>
                        <span>Invested: {fmtINR(invested)}</span>
                        <span style={{ color: '#047857', fontWeight: 900 }}>+{fmtINR(interest)} Int.</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#000000', marginBottom: '4px' }}>
                        Maturity: <span style={{ color: '#000000', fontWeight: 900 }}>{fmtINR(maturity)}</span>
                      </div>
                      <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', border: '1px solid #000000' }}>
                        <div style={{ width: `${barPct}%`, height: '100%', background: scheme.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeSection === 'notes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {SIX_CORE_SCHEMES.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#FFFFFF',
                  border: '2.5px solid #000000',
                  borderLeft: `6px solid ${s.color}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  color: '#000000',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#000000' }}>
                    {s.icon} {s.name} ({s.rate}% p.a.)
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#000000', fontWeight: 900, background: '#ECFDF5', padding: '2px 7px', borderRadius: '999px', border: '1.5px solid #000000' }}>
                    {s.compounding}
                  </span>
                </div>
                <p style={{ fontSize: '10.5px', color: '#000000', fontWeight: 700, lineHeight: 1.42, margin: '0 0 6px 0' }}>
                  {s.educationalNote}
                </p>
                <div style={{ fontSize: '10px', color: '#000000', fontWeight: 900, background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px', border: '1.5px solid #000000' }}>
                  ★ Best For: <span style={{ color: '#000000', fontWeight: 900 }}>{s.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'comparison' && (
          <div style={{ background: '#FFFFFF', border: '2.5px solid #000000', borderRadius: '9px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left', color: '#000000' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', color: '#000000', borderBottom: '2px solid #000000' }}>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Scheme</th>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Interest Rate</th>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Lock-In Period</th>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Tax Benefit (80C)</th>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Min / Max Limit</th>
                  <th style={{ padding: '6px 8px', fontWeight: 900 }}>Risk Profile</th>
                </tr>
              </thead>
              <tbody>
                {SIX_CORE_SCHEMES.map((s, idx) => (
                  <tr
                    key={s.id}
                    style={{
                      background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                      borderBottom: '1px solid #000000',
                    }}
                  >
                    <td style={{ padding: '5px 8px', fontWeight: 900, color: '#000000' }}>
                      {s.icon} {s.name}
                    </td>
                    <td style={{ padding: '5px 8px', fontWeight: 900, color: '#000000' }}>{s.rate}% p.a.</td>
                    <td style={{ padding: '5px 8px', color: '#000000', fontWeight: 800 }}>{s.lockIn}</td>
                    <td style={{ padding: '5px 8px', color: '#000000', fontWeight: 800 }}>{s.taxBenefit}</td>
                    <td style={{ padding: '5px 8px', color: '#000000', fontWeight: 800 }}>
                      {s.minInvest} – {s.maxInvest}
                    </td>
                    <td style={{ padding: '5px 8px', color: '#000000', fontWeight: 900 }}>{s.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'know' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {WHAT_YOU_SHOULD_KNOW_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  border: '2.5px solid #000000',
                  borderLeft: `6px solid ${card.color}`,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  color: '#000000',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#000000' }}>
                    {card.icon} {card.title}
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 900, background: '#E0F2FE', color: '#000000', padding: '2px 8px', borderRadius: '999px', border: '1.5px solid #000000' }}>
                    {card.badge}
                  </span>
                </div>
                <p style={{ fontSize: '10.5px', color: '#000000', fontWeight: 700, lineHeight: 1.42, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'challenges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Concept Mastery Header */}
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯 Savings Concept Mastery Challenges</span>
                  <span style={{ fontSize: '10px', background: '#ECFDF5', color: '#000000', padding: '2px 8px', borderRadius: '999px', border: '1.5px solid #000000', fontWeight: 900 }}>
                    +25 XP Per Challenge
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#000000', fontWeight: 800 }}>
                  Test your real-world financial decision skills & unlock Pro Financial Wizard badges!
                </div>
              </div>

              {/* Progress Meter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#000000' }}>
                  Mastery: {Object.keys(challengeAnswers).length}/{MIXER_CHALLENGES.length}
                </span>
                <div style={{ width: '80px', height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', border: '1.5px solid #000000' }}>
                  <div
                    style={{
                      width: `${(Object.keys(challengeAnswers).length / MIXER_CHALLENGES.length) * 100}%`,
                      height: '100%',
                      background: '#10B981',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Concept Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {MIXER_CHALLENGES.map((ch) => {
                const picked = challengeAnswers[ch.id]
                const isCorrect = picked === ch.correct
                return (
                  <div
                    key={ch.id}
                    style={{
                      background: '#FFFFFF',
                      border: '2.5px solid #000000',
                      borderLeft: picked ? (isCorrect ? '6px solid #059669' : '6px solid #DC2626') : '6px solid #0284C7',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000' }}>
                          {ch.title}
                        </span>
                        {picked && (
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 900,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                              color: '#000000',
                              border: '1.5px solid #000000',
                            }}
                          >
                            {isCorrect ? '✓ Mastered' : '✕ Re-try'}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '11px', color: '#000000', fontWeight: 700, lineHeight: 1.45, margin: '0 0 10px 0' }}>
                        {ch.question}
                      </p>

                      {/* Options Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                        {ch.options.map((opt) => {
                          const selected = picked === opt
                          const right = opt === ch.correct
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                setChallengeAnswers((p) => ({ ...p, [ch.id]: opt }))
                                if (opt === ch.correct && !challengeAnswers[ch.id] && addXP) {
                                  addXP(25)
                                }
                              }}
                              style={{
                                background: selected
                                  ? right
                                    ? '#ECFDF5'
                                    : '#FEF2F2'
                                  : '#F8FAFC',
                                border: '2px solid #000000',
                                color: '#000000',
                                borderRadius: '8px',
                                padding: '6px 8px',
                                fontSize: '10.5px',
                                fontWeight: selected ? 900 : 800,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                textAlign: 'left',
                              }}
                            >
                              {opt} {selected ? (right ? '✓' : '✕') : ''}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Educational Concept & Pro Tip Box */}
                    {picked && (
                      <div
                        style={{
                          background: isCorrect ? '#F0FDF4' : '#FEF2F2',
                          border: '2px solid #000000',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          fontSize: '10.5px',
                          color: '#000000',
                          lineHeight: 1.4,
                        }}
                      >
                        <div style={{ fontWeight: 900, marginBottom: '3px', color: '#000000' }}>
                          {isCorrect ? '🎉 Spot On Concept Breakdown:' : '💡 Concept Explanation:'} {ch.explanation}
                        </div>
                        {ch.proTip && (
                          <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 800, marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #000000' }}>
                            {ch.proTip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// COMPUTER 3: PORTFOLIO SIMULATION
// ============================================================================
export function Computer3PortfolioSimulatorScreen({
  state,
  addXP,
  onCompleteComputer3,
  onCompleteLevel2,
  onPrevComputer,
}) {
  const handleFinish = onCompleteComputer3 || onCompleteLevel2

  // Track 6/6 scheme completion state
  const completedMods = Array.from(new Set([...(state?.completedModules || [])]))
  const allSixDone = completedMods.length >= 6

  const handleFinishClick = () => {
    if (!allSixDone) {
      alert(`Please explore all 6 out of 6 schemes in Computer 1 before finishing Level 2! (Currently completed: ${completedMods.length}/6)`)
      return
    }
    if (handleFinish) handleFinish()
  }

  // Portfolio Active Schemes (at least 1 scheme by default)
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 'ppf', amount: 60000 },
    { id: 'fd', amount: 40000 },
    { id: 'nsc', amount: 30000 },
  ])
  const [simYears, setSimYears] = useState(10)

  // Investment Plan: "When Can I Buy?" Calculator state
  const [buyItemName, setBuyItemName] = useState('🏍️ Electric Scooter / Laptop')
  const [buyTargetCost, setBuyTargetCost] = useState(120000)
  const [monthlySaveAmt, setMonthlySaveAmt] = useState(4000)

  // Simulation History state
  const [historyList, setHistoryList] = useState([
    {
      id: 'hist_default_1',
      label: 'Balanced Starter Plan (PPF + FD)',
      schemesCount: 2,
      years: 10,
      invested: 100000,
      maturity: 199840,
      timestamp: 'Default Saved',
    },
  ])

  const activeIds = portfolioItems.map((p) => p.id)

  const handleAddScheme = (schemeId) => {
    if (activeIds.includes(schemeId)) return
    setPortfolioItems((prev) => [...prev, { id: schemeId, amount: 25000 }])
  }

  const handleRemoveScheme = (schemeId) => {
    if (portfolioItems.length <= 1) return
    setPortfolioItems((prev) => prev.filter((p) => p.id !== schemeId))
  }

  const handleAmountChange = (schemeId, val) => {
    setPortfolioItems((prev) =>
      prev.map((p) => (p.id === schemeId ? { ...p, amount: Math.max(1000, Number(val) || 1000) } : p))
    )
  }

  const portfolioSummary = useMemo(() => {
    let totalPrincipal = 0
    let totalMaturity = 0
    let weightedRateNum = 0

    const breakdown = portfolioItems.map((item) => {
      const sch = SIX_CORE_SCHEMES.find((s) => s.id === item.id) || SIX_CORE_SCHEMES[0]
      const r = sch.rate / 100
      const invested = item.amount
      const maturity = Math.round(invested * Math.pow(1 + r, simYears))
      totalPrincipal += invested
      totalMaturity += maturity
      weightedRateNum += invested * sch.rate
      return {
        ...item,
        scheme: sch,
        invested,
        maturity,
        interest: Math.max(0, maturity - invested),
      }
    })

    const avgRate = totalPrincipal > 0 ? (weightedRateNum / totalPrincipal).toFixed(2) : '0.00'
    return {
      breakdown,
      totalPrincipal,
      totalMaturity,
      totalProfit: Math.max(0, totalMaturity - totalPrincipal),
      avgRate,
    }
  }, [portfolioItems, simYears])

  const whenCanIBuyResult = useMemo(() => {
    const rMonthly = 0.07 / 12
    const target = Math.max(1000, Number(buyTargetCost) || 50000)
    const monthly = Math.max(500, Number(monthlySaveAmt) || 2000)

    let months = 1
    let balance = 0
    while (months < 600 && balance < target) {
      balance = (balance + monthly) * (1 + rMonthly)
      if (balance >= target) break
      months++
    }
    const years = Math.floor(months / 12)
    const remMonths = months % 12
    const totalPrincipalSaved = monthly * months
    const interestHelp = Math.max(0, Math.round(balance - totalPrincipalSaved))
    const targetYear = new Date().getFullYear() + years + (remMonths >= 6 ? 1 : 0)

    return {
      months,
      years,
      remMonths,
      totalPrincipalSaved,
      interestHelp,
      finalAmount: Math.round(balance),
      targetYear,
    }
  }, [buyTargetCost, monthlySaveAmt])

  const handleSaveToHistory = () => {
    const names = portfolioSummary.breakdown.map((b) => b.scheme.name.split(' ')[0]).join(' + ')
    const newEntry = {
      id: 'hist_' + Date.now(),
      label: `${names} (${simYears}Y @ ${portfolioSummary.avgRate}%)`,
      schemesCount: portfolioItems.length,
      years: simYears,
      invested: portfolioSummary.totalPrincipal,
      maturity: portfolioSummary.totalMaturity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setHistoryList((prev) => [newEntry, ...prev])
    if (addXP) addXP(25)
  }

  const handleDeleteHistoryItem = (id) => {
    setHistoryList((prev) => prev.filter((h) => h.id !== id))
  }

  const handleClearHistory = () => {
    setHistoryList([])
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 100%)',
        color: '#000000',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '6px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#F59E0B', color: '#FFFFFF', fontWeight: 900, fontSize: '10px', padding: '3.5px 9px', borderRadius: '6px', border: '1.5px solid #000000' }}>
            📊 COMPUTER 3 • PORTFOLIO SIMULATION & PLANNER
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#000000' }}>
            Add/Remove Any Scheme • &ldquo;When Can I Buy?&rdquo; Planner • History Manager
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10.5px', color: '#000000', fontWeight: 900, background: '#E0F2FE', padding: '3px 9px', borderRadius: '999px', border: '1.5px solid #000000' }}>
            {allSixDone ? '✓ 6/6 Schemes Completed' : `🔒 ${completedMods.length}/6 Schemes Completed`}
          </span>
          {onPrevComputer && (
            <button
              onClick={onPrevComputer}
              style={{
                background: '#FFFFFF',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '7px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              ← Computer 2
            </button>
          )}
          {handleFinish && (
            <button
              onClick={handleFinishClick}
              style={{
                background: allSixDone ? 'linear-gradient(135deg, #059669, #10B981)' : '#E2E8F0',
                color: allSixDone ? '#ffffff' : '#64748B',
                border: '2px solid #000000',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 900,
                cursor: allSixDone ? 'pointer' : 'not-allowed',
                boxShadow: allSixDone ? '0 2px 8px rgba(16,185,129,0.25)' : 'none',
              }}
            >
              {allSixDone ? '✓ Complete Level 2 & Walk to Veranda →' : `🔒 Explore 6/6 Schemes (${completedMods.length}/6)`}
            </button>
          )}
        </div>
      </div>

      {/* Add / Remove Scheme Strip */}
      <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '8px', padding: '5px 9px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#000000' }}>
            ➕ ADD OR REMOVE ANY SCHEME (At least 1 scheme stays active by default):
          </span>
          <span style={{ fontSize: '10px', color: '#000000', fontWeight: 900 }}>
            Active Schemes: {portfolioItems.length} • Blended Return: {portfolioSummary.avgRate}% p.a.
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
          {SIX_CORE_SCHEMES.map((s) => {
            const isActive = activeIds.includes(s.id)
            const isLastOne = isActive && portfolioItems.length === 1
            return (
              <button
                key={s.id}
                onClick={() => (isActive ? handleRemoveScheme(s.id) : handleAddScheme(s.id))}
                style={{
                  background: isActive ? '#FEF3C7' : '#F8FAFC',
                  border: '2px solid #000000',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  color: '#000000',
                  fontSize: '9.5px',
                  fontWeight: 900,
                  cursor: isLastOne ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '3px',
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000', fontWeight: 900 }}>
                  {s.icon} {s.name}
                </span>
                <span style={{ color: '#000000', fontWeight: 900 }}>
                  {isActive ? (isLastOne ? 'Default' : '✕') : '+'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1.1fr 0.9fr', gap: '8px', flex: 1, minHeight: 0 }}>
        {/* Column 1: Portfolio Simulation */}
        <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#000000' }}>💼 Active Portfolio Allocations</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '9.5px', color: '#000000', fontWeight: 900 }}>Years:</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={simYears}
                  onChange={(e) => setSimYears(Math.max(1, Number(e.target.value) || 1))}
                  style={{ width: '42px', background: '#F8FAFC', border: '2px solid #000000', borderRadius: '5px', color: '#000000', fontSize: '10px', fontWeight: 900, padding: '2px 4px', textAlign: 'center' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {portfolioSummary.breakdown.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: '#F8FAFC',
                    border: '2px solid #000000',
                    borderLeft: `4px solid ${b.scheme.color}`,
                    borderRadius: '6px',
                    padding: '4px 7px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 900, color: '#000000' }}>
                      {b.scheme.icon} {b.scheme.name} ({b.scheme.rate}%)
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#047857', fontWeight: 900 }}>→ {fmtINR(b.maturity)}</span>
                      {portfolioItems.length > 1 && (
                        <button
                          onClick={() => handleRemoveScheme(b.id)}
                          style={{ background: '#FEF2F2', border: '1px solid #000000', color: '#000000', borderRadius: '4px', fontSize: '9px', cursor: 'pointer', padding: '1px 4px', fontWeight: 900 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={150000}
                    step={5000}
                    value={b.amount}
                    onChange={(e) => handleAmountChange(b.id, e.target.value)}
                    style={{ width: '100%', accentColor: b.scheme.color, height: '4px', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#000000', fontWeight: 800 }}>
                    <span>Invested: {fmtINR(b.amount)}</span>
                    <span style={{ color: '#047857', fontWeight: 900 }}>Interest: +{fmtINR(b.interest)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '2px solid #000000', paddingTop: '5px', marginTop: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '5px' }}>
              <div style={{ background: '#F8FAFC', border: '2px solid #000000', padding: '4px 6px', borderRadius: '5px' }}>
                <div style={{ fontSize: '8.5px', color: '#000000', fontWeight: 800 }}>Total Invested</div>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#000000' }}>{fmtINR(portfolioSummary.totalPrincipal)}</div>
              </div>
              <div style={{ background: '#ECFDF5', border: '2px solid #000000', padding: '4px 6px', borderRadius: '5px' }}>
                <div style={{ fontSize: '8.5px', color: '#000000', fontWeight: 800 }}>Projected Maturity ({simYears}Y)</div>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#000000' }}>{fmtINR(portfolioSummary.totalMaturity)}</div>
              </div>
            </div>
            <button
              onClick={handleSaveToHistory}
              style={{
                width: '100%',
                background: '#4F46E5',
                color: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '6px',
                padding: '5px',
                fontSize: '10.5px',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              💾 Save Simulation to History (+25 XP)
            </button>
          </div>
        </div>

        {/* Column 2: Investment Plan ("When Can I Buy?" Calculator) */}
        <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#000000', marginBottom: '2px' }}>
              🛍️ Investment Plan: &ldquo;When Can I Buy?&rdquo;
            </div>
            <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 700, marginBottom: '5px' }}>
              See how many years & months it takes to buy your goal if you save this much monthly!
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '9px', color: '#000000', marginBottom: '2px', fontWeight: 800 }}>What do you want to buy?</div>
              <input
                type="text"
                value={buyItemName}
                onChange={(e) => setBuyItemName(e.target.value)}
                style={{ width: '100%', background: '#F8FAFC', border: '2px solid #000000', borderRadius: '5px', padding: '4px 6px', color: '#000000', fontSize: '10.5px', fontWeight: 800, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: '2px', color: '#000000', fontWeight: 900 }}>
                <span>Target Purchase Price</span>
                <span>{fmtINR(buyTargetCost)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={buyTargetCost}
                onChange={(e) => setBuyTargetCost(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer', height: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: '2px', color: '#000000', fontWeight: 900 }}>
                <span>If I Save Every Month</span>
                <span>{fmtINR(monthlySaveAmt)} / mo</span>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={monthlySaveAmt}
                onChange={(e) => setMonthlySaveAmt(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0284C7', cursor: 'pointer', height: '4px' }}
              />
            </div>
          </div>

          <div style={{ background: '#ECFDF5', border: '2px solid #000000', borderRadius: '7px', padding: '6px 9px', marginTop: '5px' }}>
            <div style={{ fontSize: '9.5px', color: '#000000', fontWeight: 900 }}>⏱️ YOU CAN BUY IT IN:</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#000000', margin: '1px 0' }}>
              {whenCanIBuyResult.years > 0 ? `${whenCanIBuyResult.years} Yr${whenCanIBuyResult.years > 1 ? 's' : ''} ` : ''}
              {whenCanIBuyResult.remMonths} Mo ({whenCanIBuyResult.months} months)
            </div>
            <div style={{ fontSize: '9px', color: '#000000', lineHeight: 1.3, fontWeight: 800 }}>
              • Target Year: <strong>{whenCanIBuyResult.targetYear}</strong>
              <br />• Saved: <strong>{fmtINR(whenCanIBuyResult.totalPrincipalSaved)}</strong> + Interest: <strong style={{ color: '#047857', fontWeight: 900 }}>+{fmtINR(whenCanIBuyResult.interestHelp)}</strong>
            </div>
          </div>
        </div>

        {/* Column 3: Simulation History */}
        <div style={{ background: '#FFFFFF', border: '2px solid #000000', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#000000' }}>
                🕒 Simulation History ({historyList.length})
              </span>
              {historyList.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #000000',
                    color: '#000000',
                    borderRadius: '4px',
                    padding: '2px 5px',
                    fontSize: '9px',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Clear All
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div style={{ fontSize: '10px', color: '#000000', textAlign: 'center', padding: '20px 6px', fontWeight: 700 }}>
                No saved history items. Click &ldquo;Save Simulation to History&rdquo; to add snapshots!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#F8FAFC',
                      border: '2px solid #000000',
                      borderRadius: '6px',
                      padding: '5px 7px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: '#000000' }}>{item.label}</span>
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        title="Remove from history"
                        style={{
                          background: '#FEF2F2',
                          border: '1px solid #000000',
                          color: '#000000',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: 900,
                          padding: '1px 5px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div style={{ fontSize: '9px', color: '#000000', fontWeight: 800 }}>
                      Invested: <strong style={{ color: '#000000', fontWeight: 900 }}>{fmtINR(item.invested)}</strong> → Maturity:{' '}
                      <strong style={{ color: '#047857', fontWeight: 900 }}>{fmtINR(item.maturity)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {handleFinish && (
            <button
              onClick={handleFinishClick}
              style={{
                width: '100%',
                background: allSixDone ? 'linear-gradient(135deg, #059669, #10B981)' : '#E2E8F0',
                color: allSixDone ? '#FFFFFF' : '#64748B',
                border: '2px solid #000000',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '10.5px',
                fontWeight: 900,
                cursor: allSixDone ? 'pointer' : 'not-allowed',
                marginTop: '5px',
              }}
            >
              {allSixDone ? '✓ Finish Level 2 & Exit Lab →' : `🔒 Explore 6/6 Schemes (${completedMods.length}/6)`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { Computer3PortfolioSimulatorScreen as Computer3PortfolioSimScreen }

