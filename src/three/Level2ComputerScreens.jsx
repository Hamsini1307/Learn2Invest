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
      setLocalExplored((prev) => [...prev, m.id])
    }
  }

  const stats = useMemo(() => computeModuleStats(mod, amount, duration), [mod, amount, duration])
  const completedMods = Array.from(new Set([...(state?.completedModules || []), ...localExplored]))
  const isCompleted = completedMods.includes(mod.id)

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
        background: 'linear-gradient(160deg, #070D19 0%, #0F172A 100%)',
        color: '#F8FAFC',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(56,189,248,0.22)', paddingBottom: '6px', marginBottom: '7px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#0284C7', color: '#fff', fontWeight: 900, fontSize: '10px', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.7px' }}>
            🖥️ COMPUTER 1 • ALL 6 SIMULATORS
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#E2E8F0' }}>
            PPF • Fixed Deposit • NSC • Sukanya Samriddhi • RD • Post Office MIS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10.5px', color: '#38BDF8', fontWeight: 800, background: 'rgba(56,189,248,0.12)', padding: '3px 8px', borderRadius: '999px', border: '1px solid rgba(56,189,248,0.3)' }}>
            ✓ {completedMods.length}/6 Schemes
          </span>
          {handleNext && (
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16,185,129,0.35)',
              }}
            >
              Complete & Walk to Computer 2 →
            </button>
          )}
        </div>
      </div>

      {/* 6 Scheme Tabs with FULL Names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px', marginBottom: '8px', flexShrink: 0 }}>
        {SIMULATOR_MODULES.map((m) => {
          const active = m.id === selectedId
          const done = completedMods.includes(m.id)
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMod(m)}
              style={{
                background: active ? `${m.color}28` : 'rgba(30,41,59,0.75)',
                border: active ? `2px solid ${m.color}` : '1px solid rgba(148,163,184,0.22)',
                borderRadius: '8px',
                padding: '5px 4px',
                color: active ? '#FFFFFF' : '#CBD5E1',
                fontSize: '10.5px',
                fontWeight: active ? 900 : 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                transition: 'all 0.15s',
                textAlign: 'center',
                lineHeight: 1.15,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '12px' }}>{m.icon}</span>
                <span style={{ fontSize: '9.5px', color: active ? '#38BDF8' : '#94A3B8', fontWeight: 800 }}>{m.rate}%</span>
                {done && <span style={{ color: '#4ADE80', fontSize: '9.5px' }}>✓</span>}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                {m.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.18fr 1fr', gap: '10px', flex: 1, minHeight: 0 }}>
        {/* Left Column: Sliders & Results */}
        <div style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '11px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '20px' }}>{mod.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#F8FAFC' }}>{mod.fullName}</div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{mod.name} • Govt / RBI Regulated</div>
                </div>
              </div>
              <span style={{ background: `${mod.color}25`, border: `1px solid ${mod.color}`, color: '#F8FAFC', fontWeight: 900, fontSize: '11.5px', padding: '2px 8px', borderRadius: '999px' }}>
                {mod.rate}% p.a.
              </span>
            </div>

            <p style={{ fontSize: '10.5px', color: '#CBD5E1', lineHeight: 1.38, margin: '0 0 8px 0' }}>
              {mod.description}
            </p>

            {/* Amount Slider */}
            <div style={{ marginBottom: '8px', background: 'rgba(30,41,59,0.55)', padding: '7px 9px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>{mod.amountLabel}</span>
                <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: '12.5px' }}>{fmtINR(amount)}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#64748B', marginTop: '2px' }}>
                <span>Min: {fmtINR(mod.minAmount)}</span>
                <span>Max: {fmtINR(mod.maxAmount)}</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div style={{ background: 'rgba(30,41,59,0.55)', padding: '7px 9px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ color: '#94A3B8', fontWeight: 700 }}>Duration ({mod.durationUnit})</span>
                <span style={{ color: '#FBBF24', fontWeight: 900, fontSize: '12.5px' }}>
                  {duration} {mod.durationUnit}
                </span>
              </div>
              {mod.durationFixed ? (
                <div style={{ fontSize: '10.5px', color: '#FBBF24', fontWeight: 700, padding: '2px 0' }}>
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
                  style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer', height: '5px' }}
                />
              )}
            </div>
          </div>

          {/* Calculated Output Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: stats.extraLabel ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '6px', marginTop: '6px' }}>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '7px', padding: '6px' }}>
              <div style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 700 }}>Total Invested</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#E2E8F0', marginTop: '2px' }}>{fmtINR(stats.totalInvested)}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '7px', padding: '6px' }}>
              <div style={{ fontSize: '9.5px', color: '#6EE7B7', fontWeight: 700 }}>Interest Earned</div>
              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>+{fmtINR(stats.totalInterest)}</div>
            </div>
            <div style={{ background: 'rgba(99,102,241,0.16)', border: '1px solid rgba(99,102,241,0.45)', borderRadius: '7px', padding: '6px' }}>
              <div style={{ fontSize: '9.5px', color: '#A5B4FC', fontWeight: 700 }}>Maturity Value</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#818CF8', marginTop: '2px' }}>{fmtINR(stats.maturityValue)}</div>
            </div>
            {stats.extraLabel && (
              <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '7px', padding: '6px' }}>
                <div style={{ fontSize: '9.5px', color: '#FDE68A', fontWeight: 700 }}>{stats.extraLabel}</div>
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#FBBF24', marginTop: '2px' }}>{stats.extraVal}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Facts & Action */}
        <div style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '11px', padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '7px' }}>
              📋 Scheme Key Takeaways & Rules
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {(mod.keyFacts || []).map((fact, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(30,41,59,0.65)',
                    borderLeft: `3px solid ${mod.color}`,
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '10.5px',
                    color: '#E2E8F0',
                    lineHeight: 1.32,
                  }}
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>

          {/* Visual Principal vs Interest Bar */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94A3B8', marginBottom: '3px', fontWeight: 700 }}>
              <span>Principal ({Math.round((stats.totalInvested / Math.max(1, stats.maturityValue)) * 100)}%)</span>
              <span>Interest ({Math.round((stats.totalInterest / Math.max(1, stats.maturityValue)) * 100)}%)</span>
            </div>
            <div style={{ height: '8px', borderRadius: '999px', background: '#1E293B', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(stats.totalInvested / Math.max(1, stats.maturityValue)) * 100}%`, background: '#38BDF8' }} />
              <div style={{ flex: 1, background: '#10B981' }} />
            </div>

            <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }}>
              <button
                onClick={handleMarkComplete}
                style={{
                  flex: 1,
                  background: isCompleted ? 'rgba(16,185,129,0.2)' : `linear-gradient(135deg, ${mod.color}, #4F46E5)`,
                  color: isCompleted ? '#4ADE80' : '#fff',
                  border: isCompleted ? '1px solid #10B981' : 'none',
                  borderRadius: '7px',
                  padding: '7px 9px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isCompleted ? '✓ Explored (+25 XP)' : '✓ Mark Explored (+25 XP)'}
              </button>
              {handleNext && (
                <button
                  onClick={handleNext}
                  style={{
                    background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '7px 11px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Computer 2 →
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
    title: 'Challenge 1: Tax-Free Retirement Champion',
    question:
      'Asha wants to invest ₹1,00,000/year for 15 years with 100% tax-free maturity under Section 80C (EEE status) for anyone. Which scheme should she add to the mixer?',
    options: ['Fixed Deposit', 'PPF Simulator', 'Post Office MIS', 'Recurring Deposit'],
    correct: 'PPF Simulator',
    explanation: 'PPF offers 7.1% p.a. with full EEE (Exempt-Exempt-Exempt) tax status over 15 years!',
  },
  {
    id: 'ch2',
    title: 'Challenge 2: Highest Girl-Child Return',
    question:
      'Rohan wants to save for his 5-year-old daughter’s higher education and wants the highest guaranteed government interest rate (8.2% p.a.). Which scheme wins?',
    options: ['NSC Calculator', 'Sukanya Samriddhi', 'Recurring Deposit', 'Fixed Deposit'],
    correct: 'Sukanya Samriddhi',
    explanation: 'Sukanya Samriddhi Yojana (SSY) gives 8.2% p.a. tax-free — the highest among all small savings schemes!',
  },
  {
    id: 'ch3',
    title: 'Challenge 3: Monthly Pocket-Money Payout',
    question:
      'Retiree Meena has ₹5,00,000 lump sum and needs a guaranteed monthly cash payout every month for 5 years. Which scheme should she choose?',
    options: ['Post Office MIS', 'PPF Simulator', 'NSC Calculator', 'Sukanya Samriddhi'],
    correct: 'Post Office MIS',
    explanation: 'Post Office MIS pays 7.4% p.a. distributed as a guaranteed monthly income!',
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
  addXP,
  onCompleteComputer2,
  onNextComputer,
  onPrevComputer,
}) {
  const handleNext = onCompleteComputer2 || onNextComputer

  // Active schemes in the simultaneous mixer (user can + Add or ✕ Remove any of the 6 schemes)
  const [activeSchemeIds, setActiveSchemeIds] = useState(['ppf', 'fd', 'nsc', 'ssy'])
  const [mixerAmount, setMixerAmount] = useState(50000)
  const [mixerYears, setMixerYears] = useState(10)

  // Sub-feature view switcher inside Computer 2 so all 7 required items are one click away and fit cleanly
  const [activeSection, setActiveSection] = useState('mixer')

  // Challenge state
  const [challengeAnswers, setChallengeAnswers] = useState({})

  // Multi-Goal Savings Planner state
  const [goals, setGoals] = useState([
    { id: 'g1', name: '💻 Coding Laptop', targetCost: 65000, years: 2, schemeId: 'rd' },
    { id: 'g2', name: '🎓 Higher Education Fund', targetCost: 500000, years: 5, schemeId: 'nsc' },
    { id: 'g3', name: '🏠 Long-Term Wealth Corpus', targetCost: 1500000, years: 15, schemeId: 'ppf' },
  ])
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalCost, setNewGoalCost] = useState(100000)
  const [newGoalYears, setNewGoalYears] = useState(5)
  const [newGoalScheme, setNewGoalScheme] = useState('ppf')

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

  const handleAddGoal = () => {
    const label = newGoalName.trim() || `🎯 Goal #${goals.length + 1}`
    setGoals((prev) => [
      ...prev,
      {
        id: 'g_' + Date.now(),
        name: label,
        targetCost: Math.max(1000, Number(newGoalCost) || 50000),
        years: Math.max(1, Number(newGoalYears) || 3),
        schemeId: newGoalScheme,
      },
    ])
    setNewGoalName('')
    if (addXP) addXP(15)
  }

  const handleRemoveGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const SECTION_TABS = [
    { id: 'mixer', label: '🎛️ Simultaneous Mixer', badge: `${activeSchemeIds.length}/6` },
    { id: 'notes', label: '📚 Educational Notes' },
    { id: 'comparison', label: '📊 Comparison Metric' },
    { id: 'know', label: '💡 What Should You Know' },
    { id: 'challenges', label: '🎯 Learning Challenges' },
    { id: 'projector', label: '🔮 Growth Projector' },
    { id: 'planner', label: '🎯 Multi-Goal Planner' },
  ]

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 15% 15%, #0F172A 0%, #060B16 100%)',
        color: '#F8FAFC',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Neon Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(16,185,129,0.28)', paddingBottom: '6px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#042F2E', fontWeight: 900, fontSize: '10px', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.7px' }}>
            🎛️ COMPUTER 2 • SAVINGS MIXER STUDIO
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 900, color: '#ECFDF5' }}>
            Simultaneous Scheme Mixer, Notes, Metrics, Challenges & Goal Planner
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {onPrevComputer && (
            <button
              onClick={onPrevComputer}
              style={{
                background: 'rgba(30,41,59,0.85)',
                color: '#CBD5E1',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '7px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Computer 1
            </button>
          )}
          {handleNext && (
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(245,158,11,0.35)',
              }}
            >
              Complete & Walk to Computer 3 →
            </button>
          )}
        </div>
      </div>

      {/* 7 Required Feature Navigation Pills */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px', flexShrink: 0 }}>
        {SECTION_TABS.map((tab) => {
          const active = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                background: active ? 'linear-gradient(135deg, #0EA5E9, #6366F1)' : 'rgba(30,41,59,0.8)',
                color: active ? '#FFFFFF' : '#CBD5E1',
                border: active ? '1px solid #38BDF8' : '1px solid rgba(148,163,184,0.2)',
                borderRadius: '999px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: active ? 900 : 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{ background: 'rgba(15,23,42,0.6)', padding: '1px 5px', borderRadius: '999px', fontSize: '9px', color: '#38BDF8' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Always-Accessible Scheme Add/Remove Strip */}
      <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(56,189,248,0.22)', borderRadius: '9px', padding: '5px 9px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8' }}>
            ⚡ CHECK SIMULTANEOUSLY — Click [+ Add] or [✕ Remove] on any scheme below:
          </span>
          <button
            onClick={addAllSchemes}
            style={{
              background: 'rgba(16,185,129,0.18)',
              border: '1px solid rgba(16,185,129,0.45)',
              color: '#34D399',
              borderRadius: '5px',
              padding: '2px 7px',
              fontSize: '9.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            + Add All 6 Schemes
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
          {SIX_CORE_SCHEMES.map((s) => {
            const isAdded = activeSchemeIds.includes(s.id)
            return (
              <div
                key={s.id}
                onClick={() => toggleSchemeInMixer(s.id)}
                style={{
                  background: isAdded ? `${s.color}24` : 'rgba(30,41,59,0.5)',
                  border: isAdded ? `1.5px solid ${s.color}` : '1px dashed rgba(148,163,184,0.3)',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', minWidth: 0 }}>
                  <span style={{ fontSize: '11px' }}>{s.icon}</span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 800, color: isAdded ? '#FFF' : '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '8.5px', color: s.color, fontWeight: 800 }}>{s.rate}% p.a.</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    padding: '1px 4px',
                    borderRadius: '4px',
                    background: isAdded ? 'rgba(239,68,68,0.22)' : 'rgba(16,185,129,0.22)',
                    color: isAdded ? '#FCA5A5' : '#6EE7B7',
                    flexShrink: 0,
                  }}
                >
                  {isAdded ? '✕' : '+Add'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Dynamic Workspace Area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
        {activeSection === 'mixer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '9px', padding: '6px 10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '2px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Simultaneous Investment Base</span>
                  <span style={{ color: '#38BDF8', fontWeight: 900 }}>{fmtINR(mixerAmount)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={150000}
                  step={5000}
                  value={mixerAmount}
                  onChange={(e) => setMixerAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer', height: '5px' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '2px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Comparison Horizon (Years)</span>
                  <span style={{ color: '#FBBF24', fontWeight: 900 }}>{mixerYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={mixerYears}
                  onChange={(e) => setMixerYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer', height: '5px' }}
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
                      background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.8))',
                      border: `1.5px solid ${scheme.color}66`,
                      borderRadius: '9px',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#FFF' }}>
                          {scheme.icon} {scheme.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: scheme.color, background: `${scheme.color}20`, padding: '1px 5px', borderRadius: '999px' }}>
                            {scheme.rate}%
                          </span>
                          <button
                            onClick={() => toggleSchemeInMixer(scheme.id)}
                            title="Remove from Mixer"
                            style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#FCA5A5', borderRadius: '4px', fontSize: '9.5px', cursor: 'pointer', padding: '1px 4px', fontWeight: 800 }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#94A3B8', marginBottom: '5px' }}>
                        Mode: <strong style={{ color: '#CBD5E1' }}>{modeLabel}</strong> • Lock-in: {scheme.lockIn}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                        <span style={{ color: '#94A3B8' }}>Invested: {fmtINR(invested)}</span>
                        <span style={{ color: '#34D399', fontWeight: 800 }}>+{fmtINR(interest)} Int.</span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#F8FAFC', marginBottom: '4px' }}>
                        Maturity: <span style={{ color: '#38BDF8' }}>{fmtINR(maturity)}</span>
                      </div>
                      <div style={{ height: '6px', background: '#0F172A', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${barPct}%`, height: '100%', background: `linear-gradient(90deg, ${scheme.color}, #38BDF8)`, borderRadius: '999px' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeSection === 'notes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
            {SIX_CORE_SCHEMES.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'rgba(15,23,42,0.9)',
                  border: `1px solid ${s.color}55`,
                  borderLeft: `4px solid ${s.color}`,
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#F8FAFC' }}>
                    {s.icon} {s.name} ({s.rate}% p.a.)
                  </span>
                  <span style={{ fontSize: '9px', color: '#34D399', fontWeight: 800 }}>{s.compounding}</span>
                </div>
                <p style={{ fontSize: '10px', color: '#CBD5E1', lineHeight: 1.38, margin: '0 0 4px 0' }}>
                  {s.educationalNote}
                </p>
                <div style={{ fontSize: '9.5px', color: '#FBBF24', fontWeight: 700 }}>
                  ★ Best For: <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{s.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'comparison' && (
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '9px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(30,41,59,0.95)', color: '#38BDF8', borderBottom: '1px solid rgba(148,163,184,0.25)' }}>
                  <th style={{ padding: '6px 8px' }}>Scheme</th>
                  <th style={{ padding: '6px 8px' }}>Interest Rate</th>
                  <th style={{ padding: '6px 8px' }}>Lock-In Period</th>
                  <th style={{ padding: '6px 8px' }}>Tax Benefit (80C)</th>
                  <th style={{ padding: '6px 8px' }}>Min / Max Limit</th>
                  <th style={{ padding: '6px 8px' }}>Risk Profile</th>
                </tr>
              </thead>
              <tbody>
                {SIX_CORE_SCHEMES.map((s, idx) => (
                  <tr
                    key={s.id}
                    style={{
                      background: idx % 2 === 0 ? 'rgba(15,23,42,0.6)' : 'rgba(30,41,59,0.4)',
                      borderBottom: '1px solid rgba(148,163,184,0.12)',
                    }}
                  >
                    <td style={{ padding: '5px 8px', fontWeight: 800, color: '#FFF' }}>
                      {s.icon} {s.name}
                    </td>
                    <td style={{ padding: '5px 8px', fontWeight: 900, color: '#34D399' }}>{s.rate}% p.a.</td>
                    <td style={{ padding: '5px 8px', color: '#E2E8F0' }}>{s.lockIn}</td>
                    <td style={{ padding: '5px 8px', color: '#FBBF24' }}>{s.taxBenefit}</td>
                    <td style={{ padding: '5px 8px', color: '#CBD5E1' }}>
                      {s.minInvest} – {s.maxInvest}
                    </td>
                    <td style={{ padding: '5px 8px', color: '#38BDF8', fontWeight: 700 }}>{s.risk}</td>
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
                  background: 'rgba(15,23,42,0.9)',
                  border: `1px solid ${card.color}55`,
                  borderRadius: '9px',
                  padding: '9px 11px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFF' }}>
                    {card.icon} {card.title}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 800, background: `${card.color}25`, color: card.color, padding: '2px 6px', borderRadius: '999px' }}>
                    {card.badge}
                  </span>
                </div>
                <p style={{ fontSize: '10.5px', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'challenges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {MIXER_CHALLENGES.map((ch) => {
              const picked = challengeAnswers[ch.id]
              const isCorrect = picked === ch.correct
              return (
                <div
                  key={ch.id}
                  style={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(148,163,184,0.22)',
                    borderRadius: '9px',
                    padding: '8px 11px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#38BDF8', marginBottom: '2px' }}>{ch.title}</div>
                  <div style={{ fontSize: '10.5px', color: '#E2E8F0', marginBottom: '6px' }}>{ch.question}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                    {ch.options.map((opt) => {
                      const selected = picked === opt
                      const right = opt === ch.correct
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            setChallengeAnswers((p) => ({ ...p, [ch.id]: opt }))
                            if (opt === ch.correct && !challengeAnswers[ch.id] && addXP) {
                              addXP(20)
                            }
                          }}
                          style={{
                            background: selected
                              ? right
                                ? 'rgba(16,185,129,0.28)'
                                : 'rgba(239,68,68,0.28)'
                              : 'rgba(30,41,59,0.8)',
                            border: selected
                              ? right
                                ? '1.5px solid #10B981'
                                : '1.5px solid #EF4444'
                              : '1px solid rgba(148,163,184,0.25)',
                            color: '#F8FAFC',
                            borderRadius: '6px',
                            padding: '4px 7px',
                            fontSize: '10px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {picked && (
                    <div style={{ marginTop: '4px', fontSize: '10px', color: isCorrect ? '#4ADE80' : '#FCA5A5', fontWeight: 700 }}>
                      {isCorrect ? `✅ Correct! (+20 XP) ${ch.explanation}` : `❌ Try again! Hint: ${ch.explanation}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activeSection === 'projector' && (
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '9px', padding: '9px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#38BDF8' }}>
                🔮 Multi-Year Wealth Growth Projector (Base: {fmtINR(mixerAmount)})
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                Showing active mixer schemes across 3Y, 5Y, 10Y, 15Y & 20Y milestones
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(30,41,59,0.95)', color: '#FBBF24' }}>
                  <th style={{ padding: '5px 7px' }}>Active Scheme</th>
                  <th style={{ padding: '5px 7px' }}>Rate</th>
                  <th style={{ padding: '5px 7px' }}>3 Years</th>
                  <th style={{ padding: '5px 7px' }}>5 Years</th>
                  <th style={{ padding: '5px 7px' }}>10 Years</th>
                  <th style={{ padding: '5px 7px' }}>15 Years</th>
                  <th style={{ padding: '5px 7px' }}>20 Years</th>
                </tr>
              </thead>
              <tbody>
                {activeSchemes.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
                    <td style={{ padding: '5px 7px', fontWeight: 800, color: '#FFF' }}>
                      {s.icon} {s.name}
                    </td>
                    <td style={{ padding: '5px 7px', color: s.color, fontWeight: 800 }}>{s.rate}%</td>
                    {[3, 5, 10, 15, 20].map((yr) => (
                      <td key={yr} style={{ padding: '5px 7px', color: '#34D399', fontWeight: 700 }}>
                        {fmtINR(computeSchemeMixerProjection(s, mixerAmount, yr).maturity)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'planner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '9px', padding: '7px 9px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 0.8fr 1.1fr auto', gap: '6px', alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>Goal Name</div>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Electric Bike / College"
                  style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: '5px', padding: '4px 6px', color: '#FFF', fontSize: '10.5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>Target Cost (₹)</div>
                <input
                  type="number"
                  value={newGoalCost}
                  onChange={(e) => setNewGoalCost(Number(e.target.value))}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: '5px', padding: '4px 6px', color: '#38BDF8', fontSize: '10.5px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>Timeline (Yrs)</div>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={newGoalYears}
                  onChange={(e) => setNewGoalYears(Number(e.target.value))}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: '5px', padding: '4px 6px', color: '#FBBF24', fontSize: '10.5px', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>Matched Scheme</div>
                <select
                  value={newGoalScheme}
                  onChange={(e) => setNewGoalScheme(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: '5px', padding: '4px 6px', color: '#FFF', fontSize: '10.5px' }}
                >
                  {SIX_CORE_SCHEMES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rate}%)
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddGoal}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                + Add Goal
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px' }}>
              {goals.map((g) => {
                const sch = SIX_CORE_SCHEMES.find((s) => s.id === g.schemeId) || SIX_CORE_SCHEMES[0]
                const rMonth = sch.rate / 100 / 12
                const months = Math.max(1, g.years * 12)
                const monthlyRequired = Math.round((g.targetCost * rMonth) / (Math.pow(1 + rMonth, months) - 1))
                return (
                  <div
                    key={g.id}
                    style={{
                      background: 'rgba(15,23,42,0.92)',
                      border: `1px solid ${sch.color}66`,
                      borderRadius: '8px',
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#FFF' }}>{g.name}</span>
                      <button
                        onClick={() => handleRemoveGoal(g.id)}
                        style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#FCA5A5', borderRadius: '4px', fontSize: '9.5px', cursor: 'pointer', padding: '1px 4px' }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '3px' }}>
                      Target: <strong style={{ color: '#F8FAFC' }}>{fmtINR(g.targetCost)}</strong> in <strong>{g.years} yrs</strong>
                    </div>
                    <div style={{ fontSize: '9.5px', color: sch.color, fontWeight: 800, marginBottom: '4px' }}>
                      Scheme: {sch.icon} {sch.name} ({sch.rate}%)
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '5px', padding: '4px 7px', fontSize: '10.5px', color: '#34D399', fontWeight: 900 }}>
                      Save {fmtINR(monthlyRequired)} / month
                    </div>
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
// - Add/remove PPF Simulator, Fixed Deposit, NSC Calculator, Sukanya Samriddhi, Recurring Deposit, Post Office MIS
// - At least 1 scheme present by default
// - Investment Plan ("When Can I Buy?" calculator)
// - Add or Remove Simulation History
// ============================================================================
export function Computer3PortfolioSimulatorScreen({
  addXP,
  onCompleteComputer3,
  onCompleteLevel2,
  onPrevComputer,
}) {
  const handleFinish = onCompleteComputer3 || onCompleteLevel2

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
  const [buySchemeId, setBuySchemeId] = useState('rd')

  // Simulation History state (add or remove history entries)
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
    if (portfolioItems.length <= 1) return // Enforce at least 1 scheme present at all times
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
    const sch = SIX_CORE_SCHEMES.find((s) => s.id === buySchemeId) || SIX_CORE_SCHEMES[0]
    const rMonthly = sch.rate / 100 / 12
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
      scheme: sch,
      months,
      years,
      remMonths,
      totalPrincipalSaved,
      interestHelp,
      finalAmount: Math.round(balance),
      targetYear,
    }
  }, [buyTargetCost, monthlySaveAmt, buySchemeId])

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
        background: 'linear-gradient(160deg, #090D1A 0%, #111827 100%)',
        color: '#F8FAFC',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245,158,11,0.28)', paddingBottom: '6px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff', fontWeight: 900, fontSize: '10px', padding: '3px 8px', borderRadius: '6px' }}>
            📊 COMPUTER 3 • PORTFOLIO SIMULATION & INVESTMENT PLAN
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FEF3C7' }}>
            Add/Remove Any Scheme • &ldquo;When Can I Buy?&rdquo; Planner • History Manager
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {onPrevComputer && (
            <button
              onClick={onPrevComputer}
              style={{
                background: 'rgba(30,41,59,0.85)',
                color: '#CBD5E1',
                border: '1px solid rgba(148,163,184,0.3)',
                borderRadius: '7px',
                padding: '4px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Computer 2
            </button>
          )}
          {handleFinish && (
            <button
              onClick={handleFinish}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '5px 11px',
                fontSize: '11px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16,185,129,0.4)',
              }}
            >
              Complete Level 2 & Walk to Veranda →
            </button>
          )}
        </div>
      </div>

      {/* Add / Remove Scheme Strip (At least 1 active enforced) */}
      <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '5px 9px', marginBottom: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#FBBF24' }}>
            ➕ ADD OR REMOVE ANY SCHEME (At least 1 scheme stays active by default):
          </span>
          <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 800 }}>
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
                  background: isActive ? `${s.color}25` : 'rgba(30,41,59,0.55)',
                  border: isActive ? `1.5px solid ${s.color}` : '1px dashed rgba(148,163,184,0.3)',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  color: isActive ? '#FFF' : '#94A3B8',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  cursor: isLastOne ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '3px',
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.icon} {s.name}
                </span>
                <span style={{ color: isActive ? (isLastOne ? '#FBBF24' : '#FCA5A5') : '#4ADE80', fontWeight: 900 }}>
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
        <div style={{ background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#38BDF8' }}>💼 Active Portfolio Allocations</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '9.5px', color: '#94A3B8' }}>Years:</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={simYears}
                  onChange={(e) => setSimYears(Math.max(1, Number(e.target.value) || 1))}
                  style={{ width: '42px', background: '#1E293B', border: '1px solid #38BDF8', borderRadius: '5px', color: '#FFF', fontSize: '10px', fontWeight: 800, padding: '2px 4px', textAlign: 'center' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {portfolioSummary.breakdown.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'rgba(30,41,59,0.65)',
                    borderLeft: `3px solid ${b.scheme.color}`,
                    borderRadius: '6px',
                    padding: '4px 7px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, color: '#FFF' }}>
                      {b.scheme.icon} {b.scheme.name} ({b.scheme.rate}%)
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#34D399', fontWeight: 800 }}>→ {fmtINR(b.maturity)}</span>
                      {portfolioItems.length > 1 && (
                        <button
                          onClick={() => handleRemoveScheme(b.id)}
                          style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#FCA5A5', borderRadius: '4px', fontSize: '9px', cursor: 'pointer', padding: '1px 4px' }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94A3B8' }}>
                    <span>Invested: {fmtINR(b.amount)}</span>
                    <span>Interest: +{fmtINR(b.interest)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(148,163,184,0.2)', paddingTop: '5px', marginTop: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '5px' }}>
              <div style={{ background: 'rgba(15,23,42,0.9)', padding: '4px 6px', borderRadius: '5px' }}>
                <div style={{ fontSize: '8.5px', color: '#94A3B8' }}>Total Invested</div>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#FFF' }}>{fmtINR(portfolioSummary.totalPrincipal)}</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.14)', padding: '4px 6px', borderRadius: '5px' }}>
                <div style={{ fontSize: '8.5px', color: '#6EE7B7' }}>Projected Maturity ({simYears}Y)</div>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#34D399' }}>{fmtINR(portfolioSummary.totalMaturity)}</div>
              </div>
            </div>
            <button
              onClick={handleSaveToHistory}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '5px',
                fontSize: '10.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              💾 Save Simulation to History (+25 XP)
            </button>
          </div>
        </div>

        {/* Column 2: Investment Plan ("When Can I Buy?" Calculator) */}
        <div style={{ background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#FBBF24', marginBottom: '2px' }}>
              🛍️ Investment Plan: &ldquo;When Can I Buy?&rdquo;
            </div>
            <div style={{ fontSize: '9.5px', color: '#94A3B8', marginBottom: '5px' }}>
              See how many years & months it takes to buy your goal if you save this much monthly!
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '9px', color: '#CBD5E1', marginBottom: '2px', fontWeight: 700 }}>What do you want to buy?</div>
              <input
                type="text"
                value={buyItemName}
                onChange={(e) => setBuyItemName(e.target.value)}
                style={{ width: '100%', background: '#1E293B', border: '1px solid #475569', borderRadius: '5px', padding: '4px 6px', color: '#FFF', fontSize: '10.5px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: '2px' }}>
                <span style={{ color: '#94A3B8' }}>Target Purchase Price</span>
                <span style={{ color: '#FBBF24', fontWeight: 900 }}>{fmtINR(buyTargetCost)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={buyTargetCost}
                onChange={(e) => setBuyTargetCost(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer', height: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: '2px' }}>
                <span style={{ color: '#94A3B8' }}>If I Save Every Month</span>
                <span style={{ color: '#38BDF8', fontWeight: 900 }}>{fmtINR(monthlySaveAmt)} / mo</span>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={monthlySaveAmt}
                onChange={(e) => setMonthlySaveAmt(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer', height: '4px' }}
              />
            </div>

            <div>
              <div style={{ fontSize: '9px', color: '#CBD5E1', marginBottom: '2px', fontWeight: 700 }}>Invest Monthly Savings In:</div>
              <select
                value={buySchemeId}
                onChange={(e) => setBuySchemeId(e.target.value)}
                style={{ width: '100%', background: '#1E293B', border: '1px solid #475569', borderRadius: '5px', padding: '3px 6px', color: '#FFF', fontSize: '10px', fontWeight: 700 }}
              >
                {SIX_CORE_SCHEMES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rate}% p.a.)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.16), rgba(16,185,129,0.16))', border: '1px solid rgba(245,158,11,0.45)', borderRadius: '7px', padding: '6px 9px', marginTop: '5px' }}>
            <div style={{ fontSize: '9.5px', color: '#FDE68A', fontWeight: 800 }}>⏱️ YOU CAN BUY IT IN:</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#4ADE80', margin: '1px 0' }}>
              {whenCanIBuyResult.years > 0 ? `${whenCanIBuyResult.years} Yr${whenCanIBuyResult.years > 1 ? 's' : ''} ` : ''}
              {whenCanIBuyResult.remMonths} Mo ({whenCanIBuyResult.months} months)
            </div>
            <div style={{ fontSize: '9px', color: '#E2E8F0', lineHeight: 1.3 }}>
              • Target Year: <strong>{whenCanIBuyResult.targetYear}</strong>
              <br />• Saved: <strong>{fmtINR(whenCanIBuyResult.totalPrincipalSaved)}</strong> + Interest: <strong style={{ color: '#34D399' }}>+{fmtINR(whenCanIBuyResult.interestHelp)}</strong>
            </div>
          </div>
        </div>

        {/* Column 3: Simulation History (Add or Remove) */}
        <div style={{ background: 'rgba(15,23,42,0.88)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '9px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#A5B4FC' }}>
                🕒 Simulation History ({historyList.length})
              </span>
              {historyList.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  style={{
                    background: 'rgba(239,68,68,0.18)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    color: '#FCA5A5',
                    borderRadius: '4px',
                    padding: '2px 5px',
                    fontSize: '9px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Clear All
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div style={{ fontSize: '10px', color: '#64748B', textAlign: 'center', padding: '20px 6px' }}>
                No saved history items. Click &ldquo;Save Simulation to History&rdquo; to add snapshots!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(30,41,59,0.75)',
                      border: '1px solid rgba(148,163,184,0.2)',
                      borderRadius: '6px',
                      padding: '5px 7px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#F8FAFC' }}>{item.label}</span>
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        title="Remove from history"
                        style={{
                          background: 'rgba(239,68,68,0.22)',
                          border: 'none',
                          color: '#FCA5A5',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: 800,
                          padding: '1px 5px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div style={{ fontSize: '9px', color: '#94A3B8' }}>
                      Invested: <strong style={{ color: '#E2E8F0' }}>{fmtINR(item.invested)}</strong> → Maturity:{' '}
                      <strong style={{ color: '#34D399' }}>{fmtINR(item.maturity)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {handleFinish && (
            <button
              onClick={handleFinish}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '10.5px',
                fontWeight: 900,
                cursor: 'pointer',
                marginTop: '5px',
              }}
            >
              ✓ Finish Level 2 & Exit Lab →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { Computer3PortfolioSimulatorScreen as Computer3PortfolioSimScreen }
