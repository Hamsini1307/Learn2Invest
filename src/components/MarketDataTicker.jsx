import React from 'react'

export const MARKET_INDICATORS = [
  { label: 'RBI REPO RATE', value: '6.50%', change: 'UNCHANGED', positive: true, icon: '🏛️' },
  { label: 'PPF INTEREST', value: '7.10%', change: 'Q4 FY26', positive: true, icon: '🏰' },
  { label: 'SSY RATE', value: '8.20%', change: 'HIGHEST SAFE', positive: true, icon: '👧' },
  { label: 'CPI INFLATION', value: '5.10%', change: 'TARGET 4%', positive: false, icon: '📈' },
  { label: '10Y G-SEC YIELD', value: '7.05%', change: '-0.02%', positive: true, icon: '📜' },
  { label: 'NIFTY 50 (SIM)', value: '24,350', change: '+0.85%', positive: true, icon: '📊' },
  { label: 'SGB GOLD RATE', value: '₹7,250/g', change: '+2.5% INT', positive: true, icon: '🪙' },
]

export default function MarketDataTicker() {
  return (
    <div style={{
      background: 'rgba(8, 7, 5, 0.95)',
      borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '6px 0',
      fontSize: '11px',
      fontFamily: "'Space Grotesk', sans-serif",
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        background: '#d97706',
        color: '#080705',
        fontWeight: 900,
        padding: '2px 10px',
        marginRight: 10,
        fontSize: '10px',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <span>📡 LIVE INDIAN POLICY & MARKET RATES</span>
      </div>

      <div style={{
        display: 'inline-flex',
        gap: 24,
        animation: 'marquee 25s linear infinite',
      }}>
        {MARKET_INDICATORS.map((item, idx) => (
          <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>{item.icon}</span>
            <span style={{ color: '#9ca3af', fontWeight: 800 }}>{item.label}:</span>
            <span style={{ color: '#ffffff', fontWeight: 900 }}>{item.value}</span>
            <span style={{
              fontSize: '9px',
              padding: '1px 5px',
              borderRadius: '4px',
              fontWeight: 800,
              background: item.positive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)',
              color: item.positive ? '#6ee7b7' : '#fda4af',
              border: `1px solid ${item.positive ? '#10b981' : '#e11d48'}`
            }}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
