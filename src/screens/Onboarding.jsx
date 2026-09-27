import { useState } from 'react'
import MarqueeTicker from '../components/MarqueeTicker.jsx'
import EnergyCan from '../components/EnergyCan.jsx'

const SLIDES = [
  {
    id: 'welcome',
    badge: '⚡ LUXURY FINANCIAL ARENA',
    title: 'LEARN. INVEST.\nGROW.',
    desc: 'Zero risk. Real-time Indian schemes. Clean financial learning with continuous visual storytelling.',
    bg: '#080705',
    accent: '#f59e0b',
    btnClass: 'btn-primary',
    flavor: 'lime',
    canTitle: 'LEARN2INVEST',
  },
  {
    id: 'progress',
    badge: '🎯 TRACK YOUR GROWTH',
    title: 'MASTER YOUR\nPROGRESS',
    desc: 'Watch classroom video lessons, crush quizzes, and earn XP with real-time AI guidance.',
    bg: '#080705',
    accent: '#fbbf24',
    btnClass: 'btn-primary',
    flavor: 'cyan',
    canTitle: 'SIP BOOST',
  },
  {
    id: 'rewards',
    badge: '🏆 LEVEL UP & WIN',
    title: 'UNLOCK YOUR\nFUTURE',
    desc: 'From Level 1 School to Portfolio Tower — build smart portfolios and invest like a pro.',
    bg: '#080705',
    accent: '#d97706',
    btnClass: 'btn-primary',
    flavor: 'magenta',
    canTitle: 'PORTFOLIO MAX',
  },
]

export default function Onboarding({ onDone }) {
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  const goNext = () => {
    if (animating) return
    if (slide < SLIDES.length - 1) {
      setAnimating(true)
      setVisible(false)
      setTimeout(() => {
        setSlide(s => s + 1)
        setVisible(true)
        setAnimating(false)
      }, 300)
    } else {
      onDone()
    }
  }

  const goSlide = (i) => {
    if (animating || i === slide) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setSlide(i)
      setVisible(true)
      setAnimating(false)
    }, 300)
  }

  const s = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080705',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
      overflow: 'hidden',
      color: '#fef3c7'
    }}>
      {/* Top Marquee Banner */}
      <div style={{ width: '100%' }}>
        <MarqueeTicker bg="#12100c" color="#fbbf24" speed={20} />
      </div>

      {/* Background Gold Aura Orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)`,
        top: '10%', right: '-5%', pointerEvents: 'none', transition: 'background 0.5s ease',
      }}/>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)`,
        bottom: '10%', left: '-5%', pointerEvents: 'none', transition: 'background 0.5s ease',
      }}/>

      {/* Skip Button */}
      {!isLast && (
        <button onClick={onDone} className="sticker-badge sticker-yellow" style={{
          position: 'absolute', top: 56, right: 24,
          cursor: 'pointer', zIndex: 20, fontSize: 13, padding: '8px 20px',
        }}>
          SKIP ⚡
        </button>
      )}

      {/* Main Glass Card Frame */}
      <div className="glass-card-deep" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '36px 32px', maxWidth: 480, width: '92%',
        background: '#12100c',
        border: '2px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        margin: 'auto',
        zIndex: 10,
      }}>
        
        {/* Sticker Badge */}
        <div className="sticker-badge sticker-yellow" style={{ marginBottom: 16 }}>
          {s.badge}
        </div>

        {/* 3D Energy Can Visual */}
        <div style={{ height: 165, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <EnergyCan flavor={s.flavor} title={s.canTitle} size={155} />
        </div>

        {/* Title */}
        <h1 className="font-display" style={{
          fontSize: 40, color: '#ffffff',
          marginBottom: 10, lineHeight: 1.0,
          whiteSpace: 'pre-line',
          textShadow: `0 0 20px rgba(245,158,11,0.5)`,
        }}>{s.title}</h1>

        {/* Description */}
        <p style={{
          fontSize: 14, color: '#d1d5db',
          lineHeight: 1.5, marginBottom: 24,
          fontWeight: 600,
          maxWidth: 340,
        }}>{s.desc}</p>

        {/* CTA Action Button */}
        <button
          onClick={goNext}
          className="btn-primary"
          style={{
            padding: '16px 48px',
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          {isLast ? 'GET STARTED 🚀' : 'NEXT STEP →'}
        </button>

        {/* Navigation Dots */}
        <div style={{ display: 'flex', gap: 10 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => goSlide(i)} style={{
              width: i === slide ? 32 : 12, height: 10, borderRadius: 5,
              background: i === slide ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: i === slide ? `0 0 10px #f59e0b` : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* Bottom Marquee Ticker */}
      <div style={{ width: '100%' }}>
        <MarqueeTicker bg="#12100c" color="#fbbf24" speed={25} />
      </div>
    </div>
  )
}
