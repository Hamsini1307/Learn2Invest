import React, { useState, useEffect, useRef } from 'react'

// Web Audio API High-Energy Upbeat Synth Soundtrack (134 BPM)
class EnergeticMusicEngine {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.isMuted = false
    this.step = 0
    this.timerId = null
    this.masterGain = null
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return false
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.28
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return true
  }

  start() {
    if (this.isMuted) return
    if (!this.init()) return
    if (this.isPlaying) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return
    }
    this.isPlaying = true
    const bpm = 136
    const sixteenthMs = (60 / bpm / 4) * 1000

    // Uplifting C Major / A Minor / F Major / G Major progression
    const bassNotes = [
      130.81, 130.81, 261.63, 130.81, 130.81, 261.63, 196.00, 220.00,
      110.00, 110.00, 220.00, 110.00, 110.00, 220.00, 164.81, 196.00,
      87.31,  87.31,  174.61, 87.31,  87.31,  174.61, 130.81, 146.83,
      98.00,  98.00,  196.00, 98.00,  123.47, 146.83, 196.00, 246.94,
    ]

    const leadMelody = [
      523.25, 0, 659.25, 783.99, 1046.50, 0, 783.99, 659.25,
      880.00, 0, 783.99, 659.25, 587.33, 659.25, 783.99, 0,
      698.46, 0, 880.00, 1046.50, 880.00, 0, 783.99, 698.46,
      783.99, 0, 880.00, 987.77, 1046.50, 987.77, 783.99, 659.25,
    ]

    const arpNotes = [
      523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 659.25,
      440.00, 523.25, 659.25, 880.00,  659.25, 523.25, 440.00, 523.25,
      349.23, 440.00, 523.25, 698.46,  523.25, 440.00, 349.23, 440.00,
      392.00, 493.88, 587.33, 783.99,  587.33, 493.88, 659.25, 783.99,
    ]

    this.timerId = setInterval(() => {
      if (!this.ctx || !this.isPlaying || this.isMuted) return
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
        return
      }

      const now = this.ctx.currentTime
      const idx = this.step % 32

      // 1. Punchy Four-on-the-floor Kick Drum (every 4 steps + syncopation)
      if (idx % 4 === 0 || idx === 14 || idx === 30) {
        this.playKick(now)
      }

      // 2. Energetic Snare / Clap on beats 2 and 4 (idx 4, 12, 20, 28)
      if (idx % 8 === 4) {
        this.playSnare(now)
      }

      // 3. Crisp 16th-note Hi-Hats
      this.playHiHat(now, idx % 2 === 0 ? 0.08 : 0.04)

      // 4. Driving Synth Bass
      const bFreq = bassNotes[idx]
      if (bFreq) {
        this.playBass(now, bFreq, 0.11)
      }

      // 5. Sparkling Arpeggiator
      const aFreq = arpNotes[idx]
      if (aFreq) {
        this.playArp(now, aFreq, 0.09)
      }

      // 6. Bright Heroic Lead Synth
      const lFreq = leadMelody[idx]
      if (lFreq > 0) {
        this.playLead(now, lFreq, 0.16)
      }

      this.step++
    }, sixteenthMs)
  }

  playKick(time) {
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(155, time)
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.12)
      gain.gain.setValueAtTime(0.55, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(time)
      osc.stop(time + 0.16)
    } catch {}
  }

  playSnare(time) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.09
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(750, time)
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.26, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.09)
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      noise.start(time)
    } catch {}
  }

  playHiHat(time, vol) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.035
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(6500, time)
      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(vol, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035)
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      noise.start(time)
    } catch {}
  }

  playBass(time, freq, duration) {
    try {
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, time)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(650, time)
      filter.frequency.exponentialRampToValueAtTime(180, time + duration)
      gain.gain.setValueAtTime(0.22, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration)
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      osc.start(time)
      osc.stop(time + duration + 0.01)
    } catch {}
  }

  playArp(time, freq, duration) {
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, time)
      gain.gain.setValueAtTime(0.11, time)
      gain.gain.exponentialRampToValueAtTime(0.005, time + duration)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(time)
      osc.stop(time + duration + 0.01)
    } catch {}
  }

  playLead(time, freq, duration) {
    try {
      const osc = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'square'
      osc2.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, time)
      osc2.frequency.setValueAtTime(freq * 1.004, time)
      gain.gain.setValueAtTime(0.14, time)
      gain.gain.exponentialRampToValueAtTime(0.008, time + duration)
      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(this.masterGain)
      osc.start(time)
      osc2.start(time)
      osc.stop(time + duration + 0.02)
      osc2.stop(time + duration + 0.02)
    } catch {}
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime)
    }
  }

  stop() {
    this.isPlaying = false
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.stop()
    } else {
      this.start()
    }
    return this.isMuted
  }
}

export const globalMusicEngine = new EnergeticMusicEngine()
if (typeof window !== 'undefined') {
  window.__l2iMusicEngine = globalMusicEngine
}

export default function LoadingSplashWithMusic({ isOpen = true, onFinish, onFinished }) {
  const [fadeOut, setFadeOut] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [musicActive, setMusicActive] = useState(true)
  const finishedRef = useRef(false)

  const completeSplash = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    setFadeOut(true)
    setTimeout(() => {
      globalMusicEngine.stop()
      setDismissed(true)
      if (onFinish) onFinish()
      if (onFinished) onFinished()
    }, 380)
  }

  useEffect(() => {
    if (!isOpen) return
    // Start energetic music immediately on load
    globalMusicEngine.start()

    // Unlock AudioContext on any pointer/mouse/keyboard gesture if browser suspended it
    const unlockAudio = () => {
      if (!globalMusicEngine.isMuted && !finishedRef.current) {
        globalMusicEngine.start()
      }
    }
    window.addEventListener('pointerdown', unlockAudio)
    window.addEventListener('mousemove', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio)

    const timer = setTimeout(() => {
      completeSplash()
    }, 1400)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('mousemove', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [isOpen])

  if (!isOpen || dismissed) return null

  const handleToggleMusic = (e) => {
    e.stopPropagation()
    const muted = globalMusicEngine.toggleMute()
    setMusicActive(!muted)
  }

  const handleEnterNow = (e) => {
    if (e) e.stopPropagation()
    completeSplash()
  }

  return (
    <div
      onClick={() => {
        if (musicActive && !finishedRef.current) globalMusicEngine.start()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#070B14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        transition: 'opacity 0.35s ease-in-out',
        userSelect: 'none',
      }}
    >
      {/* Full-Screen Reference Image Background (No extra duplicate loading bar overlay!) */}
      <img
        src="/images/loading-splash.png"
        alt="Learn2Invest Welcome Screen"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'contrast(1.03) saturate(1.06)',
        }}
      />

      {/* Top-Right Energetic Music Control & Enter Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={handleToggleMusic}
          style={{
            background: musicActive
              ? 'linear-gradient(135deg, rgba(16,185,129,0.92), rgba(5,150,105,0.92))'
              : 'rgba(15,23,42,0.85)',
            color: '#FFFFFF',
            border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span>{musicActive ? '🎵 Energetic Music: ON' : '🔇 Music: Muted'}</span>
        </button>

        <button
          type="button"
          onClick={handleEnterNow}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0F172A',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(245,158,11,0.45)',
          }}
        >
          Enter Now →
        </button>
      </div>
    </div>
  )
}

