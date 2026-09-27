export default function MarqueeTicker({ items, bg = '#0f172a', color = '#ffffff', speed = 25 }) {
  const tickerItems = items || [
    '⚡ LEARN2INVEST CAMPUS',
    '🏫 LEVEL 1: LEARN2INVEST SCHOOL',
    '🧪 LEVEL 2: INVESTMENT LAB & SIMULATORS',
    '🏢 LEVEL 3: PORTFOLIO TOWER',
    '📈 MASTER INDIAN SCHEMES: PPF, FD, MUTUAL FUNDS & STOCKS',
    '🛡️ CYBER SAFETY & WEALTH PROTECTION',
  ]

  const textString = tickerItems.join('   •   ') + '   •   '

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: bg,
        color: color,
        padding: '9px 0',
        fontFamily: "'Bebas Neue', 'Space Grotesk', sans-serif",
        fontSize: '18px',
        letterSpacing: '1.5px',
        fontWeight: 800,
        borderTop: '1.5px solid #000',
        borderBottom: '1.5px solid #000',
        userSelect: 'none',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: `marqueeScroll ${speed}s linear infinite`,
        }}
      >
        <span>{textString}</span>
        <span>{textString}</span>
        <span>{textString}</span>
      </div>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
