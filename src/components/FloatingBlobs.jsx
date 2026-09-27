// FloatingBlobs.jsx — GiGi high-energy electric background elements

const BLOB_SETS = {
  rainbow: [
    { color: 'rgba(204,255,0,0.12)', size: 450, top: '-10%', left: '-8%', delay: '0s', duration: '18s' },
    { color: 'rgba(255,0,127,0.12)', size: 400, top: '60%', right: '-10%', delay: '3s', duration: '22s' },
    { color: 'rgba(0,240,255,0.12)', size: 350, top: '30%', left: '40%', delay: '6s', duration: '20s' },
    { color: 'rgba(255,215,0,0.10)', size: 280, bottom: '-5%', left: '20%', delay: '2s', duration: '16s' },
  ],
  green: [
    { color: 'rgba(204,255,0,0.15)', size: 480, top: '-15%', left: '-5%', delay: '0s', duration: '20s' },
    { color: 'rgba(0,240,255,0.12)', size: 400, top: '50%', right: '-8%', delay: '4s', duration: '24s' },
    { color: 'rgba(34,197,94,0.10)', size: 300, top: '20%', left: '55%', delay: '8s', duration: '18s' },
  ],
  purple: [
    { color: 'rgba(255,0,127,0.14)', size: 460, top: '-12%', right: '-5%', delay: '0s', duration: '22s' },
    { color: 'rgba(157,78,221,0.12)', size: 380, bottom: '-8%', left: '-5%', delay: '5s', duration: '18s' },
    { color: 'rgba(0,240,255,0.10)', size: 320, top: '40%', left: '45%', delay: '2s', duration: '20s' },
  ],
  pink: [
    { color: 'rgba(255,0,127,0.16)', size: 440, top: '-10%', left: '-8%', delay: '0s', duration: '20s' },
    { color: 'rgba(204,255,0,0.12)', size: 380, bottom: '-5%', right: '-8%', delay: '6s', duration: '22s' },
    { color: 'rgba(255,215,0,0.10)', size: 280, top: '35%', left: '40%', delay: '3s', duration: '16s' },
  ],
}

const FloatingParticles = () => {
  const particles = [
    { emoji: '⚡', size: 16, left: '5%', duration: 22, delay: 0 },
    { emoji: '🚀', size: 18, left: '15%', duration: 25, delay: 5 },
    { emoji: '🪙', size: 14, left: '25%', duration: 20, delay: 2 },
    { emoji: '📈', size: 16, left: '35%', duration: 28, delay: 8 },
    { emoji: '⚡', size: 15, left: '45%', duration: 21, delay: 4 },
    { emoji: '💰', size: 16, left: '55%', duration: 26, delay: 1 },
    { emoji: '🔥', size: 17, left: '65%', duration: 19, delay: 7 },
    { emoji: '💎', size: 16, left: '75%', duration: 27, delay: 3 },
    { emoji: '⚡', size: 14, left: '85%', duration: 24, delay: 9 },
    { emoji: '🚀', size: 18, left: '92%', duration: 30, delay: 6 },
    { emoji: '🪙', size: 15, left: '10%', duration: 22, delay: 11 },
    { emoji: '📈', size: 16, left: '30%', duration: 25, delay: 13 },
    { emoji: '⚡', size: 14, left: '50%', duration: 23, delay: 10 },
    { emoji: '💎', size: 17, left: '70%', duration: 21, delay: 15 },
    { emoji: '🔥', size: 16, left: '80%', duration: 29, delay: 12 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <span key={i} style={{
          position: 'fixed',
          top: '-12%',
          left: p.left,
          fontSize: p.size,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.3,
          userSelect: 'none',
          animation: `floatEmojiRain ${p.duration}s linear infinite`,
          animationDelay: `${p.delay}s`,
        }}>
          {p.emoji}
        </span>
      ))}
    </>
  )
}

export default function FloatingBlobs({ type = 'rainbow' }) {
  const blobs = BLOB_SETS[type] || BLOB_SETS.rainbow

  return (
    <>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: b.size,
          height: b.size,
          borderRadius: '50%',
          background: b.color,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
          top: b.top,
          left: b.left,
          right: b.right,
          bottom: b.bottom,
          animation: `blobPulse ${b.duration} ease-in-out infinite, orbFloat ${b.duration} ease-in-out infinite`,
          animationDelay: b.delay,
        }} />
      ))}
      <FloatingParticles />
    </>
  )
}
