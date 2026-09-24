// EnergyCan.jsx — Stylized 3D Financial Investment Emblem & Asset Card Component

export default function EnergyCan({ flavor = 'lime', title = 'LEARN2INVEST', subtitle = 'FINANCIAL WEALTH', size = 160, style = {} }) {
  const visualConfig = {
    lime: {
      grad: 'linear-gradient(135deg, #f59e0b, #d97706)',
      accent: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.4)',
      symbol: '💰',
      badge: 'FINANCIAL WEALTH',
      metric: '+15.4% CAGR',
    },
    cyan: {
      grad: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      accent: '#38bdf8',
      glow: 'rgba(2, 132, 199, 0.4)',
      symbol: '📈',
      badge: 'SIP COMPOUNDING',
      metric: '₹10,000 / MO',
    },
    magenta: {
      grad: 'linear-gradient(135deg, #d97706, #fbbf24)',
      accent: '#fbbf24',
      glow: 'rgba(217, 119, 6, 0.4)',
      symbol: '🏦',
      badge: 'ASSET TOWER',
      metric: 'DIVERSIFIED',
    },
    gold: {
      grad: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      accent: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.4)',
      symbol: '🪙',
      badge: 'PORTFOLIO MAX',
      metric: 'LEVEL 3',
    }
  }

  const cfg = visualConfig[flavor] || visualConfig.lime

  return (
    <div style={{
      position: 'relative',
      width: size * 0.95,
      height: size,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      filter: `drop-shadow(0 12px 28px ${cfg.glow})`,
      animation: 'floatY 4s ease-in-out infinite',
      userSelect: 'none',
      ...style
    }}>
      {/* Financial Asset Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '95%',
        borderRadius: '24px',
        background: 'linear-gradient(145deg, #1a1610 0%, #0d0b08 100%)',
        border: `2px solid ${cfg.accent}`,
        boxShadow: `inset 0 0 20px rgba(0,0,0,0.8), 0 0 25px ${cfg.glow}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 14px',
      }}>
        {/* Metallic Specular Highlight overlay */}
        <div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          background: 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.15), transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Top Financial Pill Badge */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${cfg.accent}`,
          borderRadius: 999,
          padding: '3px 10px',
          fontSize: 10,
          fontWeight: 800,
          color: cfg.accent,
          letterSpacing: '1px',
          fontFamily: "'Space Grotesk', sans-serif",
          zIndex: 2,
        }}>
          {cfg.badge}
        </div>

        {/* Center 3D Icon & Title */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          zIndex: 2, margin: 'auto 0'
        }}>
          <div style={{ fontSize: size * 0.26, filter: `drop-shadow(0 0 12px ${cfg.accent})`, marginBottom: 4 }}>
            {cfg.symbol}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', 'Space Grotesk', sans-serif",
            fontSize: size * 0.14,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '1px',
            lineHeight: 0.95,
            textShadow: '0 2px 4px #000',
          }}>
            {title}
          </div>
        </div>

        {/* Bottom Metric Tag */}
        <div style={{
          fontSize: size * 0.07,
          color: '#080705',
          background: cfg.accent,
          fontWeight: 900,
          letterSpacing: '1px',
          padding: '2px 10px',
          borderRadius: 8,
          zIndex: 2,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {cfg.metric}
        </div>
      </div>
    </div>
  )
}
