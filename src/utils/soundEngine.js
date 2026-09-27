// ─────────────────────────────────────────────────────────────────────────────
//  Learn2Invest — Procedural 3D Spatial Sound & Ambient Music Engine (Web Audio API)
//  Includes user-adjustable Master & Music Volume Slider (0% - 100%), Mute Toggle,
//  hover/click SFX, camera whooshes, door chimes, XP fanfares, and zone music.
// ─────────────────────────────────────────────────────────────────────────────

class SoundEngine {
  constructor() {
    this.ctx = null
    this.muted = localStorage.getItem('l2i_sound_muted') === 'true'
    this.musicEnabled = localStorage.getItem('l2i_music_enabled') !== 'false'
    const savedVol = parseFloat(localStorage.getItem('l2i_sound_volume'))
    this.volume = Number.isFinite(savedVol) ? Math.max(0, Math.min(1, savedVol)) : 0.25
    this.currentZone = null
    this.musicNodes = []
    this.musicInterval = null
    this.masterGain = null
  }

  init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
          this.masterGain = this.ctx.createGain()
          this.masterGain.gain.value = this.muted ? 0 : this.volume
          this.masterGain.connect(this.ctx.destination)
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    } catch {
      // Ignore AudioContext autoplay restrictions until user interaction
    }
  }

  isMuted() {
    return Boolean(this.muted)
  }

  getVolume() {
    return this.volume
  }

  setVolume(val) {
    const clamped = Math.max(0, Math.min(1, Number(val)))
    this.volume = clamped
    localStorage.setItem('l2i_sound_volume', String(clamped))
    if (clamped > 0 && this.muted) {
      this.muted = false
      localStorage.setItem('l2i_sound_muted', 'false')
    }
    try {
      this.init()
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.06)
      }
      if (!this.muted && this.volume > 0 && this.musicEnabled && this.currentZone && !this.musicInterval) {
        this.startAmbientMusic(this.currentZone, true)
      }
    } catch {}
    return this.volume
  }

  setMuted(mute) {
    this.muted = Boolean(mute)
    localStorage.setItem('l2i_sound_muted', String(this.muted))
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.08)
      }
      if (this.muted) {
        this.stopMusic()
      } else if (this.musicEnabled && this.currentZone) {
        this.startAmbientMusic(this.currentZone, true)
      }
    } catch {}
  }

  toggleMute() {
    this.init()
    this.setMuted(!this.muted)
    return this.muted
  }

  playHover() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(540, now)
      osc.frequency.exponentialRampToValueAtTime(810, now + 0.07)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {}
  }

  playClick() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc2.type = 'sine'
      osc.frequency.setValueAtTime(480, now)
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12)
      osc2.frequency.setValueAtTime(720, now)
      osc2.frequency.exponentialRampToValueAtTime(1380, now + 0.12)

      gain.gain.setValueAtTime(0.11, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)

      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.14)
      osc2.stop(now + 0.14)
    } catch {}
  }

  playCameraWhoosh(duration = 1.4) {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      const now = this.ctx.currentTime
      const bufferSize = Math.floor(this.ctx.sampleRate * duration)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.Q.value = 3.0
      filter.frequency.setValueAtTime(200, now)
      filter.frequency.exponentialRampToValueAtTime(780, now + duration * 0.45)
      filter.frequency.exponentialRampToValueAtTime(220, now + duration)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.35)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      noise.start(now)
      noise.stop(now + duration)
    } catch {}
  }

  playDoorOpen() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      const now = this.ctx.currentTime
      const notes = [261.63, 329.63, 392.0, 523.25]
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.07)
        gain.gain.setValueAtTime(0.07, now + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.55)
        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + idx * 0.07)
        osc.stop(now + idx * 0.07 + 0.56)
      })
    } catch {}
  }

  playXPFanfare() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.075)
        gain.gain.setValueAtTime(0.13, now + idx * 0.075)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.075 + 0.42)
        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + idx * 0.075)
        osc.stop(now + idx * 0.075 + 0.44)
      })
    } catch {}
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval)
      this.musicInterval = null
    }
    this.musicNodes.forEach(node => {
      try { node.stop() } catch {}
      try { node.disconnect() } catch {}
    })
    this.musicNodes = []
  }

  startAmbientMusic(zone = 'garden', force = false) {
    if (this.currentZone === zone && !force && this.musicInterval) return
    this.currentZone = zone
    if (this.muted || !this.musicEnabled || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return

      this.stopMusic()

      const progressions = {
        garden: [
          [261.63, 329.63, 392.00, 523.25],
          [293.66, 369.99, 440.00, 587.33],
          [329.63, 415.30, 493.88, 659.25],
          [261.63, 349.23, 440.00, 523.25],
        ],
        exploration: [
          [261.63, 329.63, 392.00, 523.25],
          [293.66, 369.99, 440.00, 587.33],
          [349.23, 440.00, 523.25, 659.25],
          [392.00, 493.88, 587.33, 783.99],
        ],
        classroom: [
          [293.66, 369.99, 440.00, 554.37],
          [246.94, 293.66, 369.99, 440.00],
          [196.00, 246.94, 293.66, 369.99],
          [220.00, 277.18, 329.63, 440.00],
        ],
        examination: [
          [220.00, 277.18, 329.63, 440.00],
          [246.94, 329.63, 392.00, 493.88],
          [261.63, 329.63, 392.00, 523.25],
          [293.66, 369.99, 440.00, 587.33],
        ],
        level2: [
          [293.66, 369.99, 440.00, 587.33],
          [329.63, 415.30, 493.88, 659.25],
          [261.63, 349.23, 440.00, 523.25],
          [392.00, 493.88, 587.33, 783.99],
        ],
        computer_lab: [
          [329.63, 440.00, 523.25, 659.25],
          [293.66, 392.00, 493.88, 587.33],
          [261.63, 349.23, 440.00, 523.25],
          [392.00, 493.88, 587.33, 783.99],
        ],
        exit: [
          [261.63, 329.63, 392.00, 523.25],
          [349.23, 440.00, 523.25, 698.46],
          [392.00, 493.88, 587.33, 783.99],
          [523.25, 659.25, 783.99, 1046.50],
        ],
        bank_exterior: [
          [293.66, 440.00, 554.37, 659.25],
          [329.63, 493.88, 659.25, 783.99],
          [369.99, 554.37, 659.25, 880.00],
          [293.66, 440.00, 587.33, 739.99],
        ],
        bank_interior: [
          [329.63, 415.30, 493.88, 659.25],
          [369.99, 440.00, 554.37, 739.99],
          [293.66, 369.99, 440.00, 659.25],
          [440.00, 554.37, 659.25, 880.00],
        ],
        final_victory: [
          [261.63, 392.00, 523.25, 659.25],
          [349.23, 440.00, 523.25, 698.46],
          [392.00, 493.88, 587.33, 783.99],
          [523.25, 659.25, 783.99, 1046.50],
        ],
        government: [
          [196.00, 293.66, 392.00, 493.88],
          [261.63, 329.63, 392.00, 523.25],
          [220.00, 261.63, 329.63, 440.00],
          [146.83, 220.00, 293.66, 369.99],
        ],
        futuristic: [
          [130.81, 196.00, 246.94, 311.13],
          [103.83, 155.56, 196.00, 261.63],
          [116.54, 174.61, 220.00, 293.66],
          [98.00, 146.83, 196.00, 246.94],
        ],
      }

      const chords = progressions[zone] || progressions.garden
      let step = 0

      const playChordPad = () => {
        if (this.muted || this.volume <= 0 || !this.ctx || this.ctx.state !== 'running') return
        try {
          const now = this.ctx.currentTime
          const chord = chords[step % chords.length]
          step++

          chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator()
            const filter = this.ctx.createBiquadFilter()
            const gain = this.ctx.createGain()

            osc.type =
              zone === 'exploration' || zone === 'garden' || zone === 'exit' || zone === 'final_victory'
                ? 'triangle'
                : zone === 'computer_lab' || zone === 'level2' || zone === 'bank_exterior' || zone === 'bank_interior'
                  ? 'sawtooth'
                  : zone === 'futuristic'
                    ? 'sawtooth'
                    : 'sine'
            osc.frequency.setValueAtTime(freq, now)

            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(
              zone === 'bank_interior' || zone === 'bank_exterior'
                ? 920
                : zone === 'computer_lab' || zone === 'level2'
                  ? 860
                  : zone === 'exploration' || zone === 'exit' || zone === 'final_victory'
                    ? 1050
                    : zone === 'futuristic'
                      ? 520
                      : 720,
              now
            )

            const peakGain = zone === 'classroom' ? 0.014 : zone === 'final_victory' ? 0.024 : 0.019
            gain.gain.setValueAtTime(0.0001, now)
            gain.gain.linearRampToValueAtTime(peakGain, now + 1.4)
            gain.gain.setValueAtTime(peakGain, now + 2.8)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.6)

            osc.connect(filter)
            filter.connect(gain)
            gain.connect(this.masterGain)

            osc.start(now + i * 0.14)
            osc.stop(now + 4.8)
          })

          // Light adventurous / modern financial pulse arpeggio notes
          if (
            [
              'exploration',
              'garden',
              'examination',
              'level2',
              'computer_lab',
              'exit',
              'bank_exterior',
              'bank_interior',
              'final_victory',
            ].includes(zone)
          ) {
            const intervalStep =
              zone === 'bank_interior' || zone === 'bank_exterior'
                ? 0.24
                : zone === 'computer_lab' || zone === 'level2'
                  ? 0.28
                  : 0.42
            chord.forEach((freq, idx) => {
              const pluck = this.ctx.createOscillator()
              const pGain = this.ctx.createGain()
              pluck.type =
                zone === 'bank_interior' || zone === 'bank_exterior' || zone === 'computer_lab'
                  ? 'triangle'
                  : 'sine'
              pluck.frequency.setValueAtTime(freq * 2, now + idx * intervalStep)
              pGain.gain.setValueAtTime(0.024, now + idx * intervalStep)
              pGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * intervalStep + 0.36)
              pluck.connect(pGain)
              pGain.connect(this.masterGain)
              pluck.start(now + idx * intervalStep)
              pluck.stop(now + idx * intervalStep + 0.38)
            })
          }
        } catch {}
      }

      playChordPad()
      this.musicInterval = setInterval(playChordPad, 4500)
    } catch {}
  }

  playEmployeeGreeting() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return
      const now = this.ctx.currentTime
      const notes = [440.0, 554.37, 659.25, 880.0]
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.065)
        gain.gain.setValueAtTime(0.11, now + idx * 0.065)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.38)
        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + idx * 0.065)
        osc.stop(now + idx * 0.065 + 0.4)
      })
    } catch {}
  }

  playJourneyCompleteFanfare() {
    if (this.muted || this.volume <= 0) return
    try {
      this.init()
      if (!this.ctx || !this.masterGain) return
      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093.0]
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.085)
        gain.gain.setValueAtTime(0.15, now + idx * 0.085)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.085 + 0.65)
        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + idx * 0.085)
        osc.stop(now + idx * 0.085 + 0.68)
      })
    } catch {}
  }

  playLessonCompleteFanfare() {
    this.playXPFanfare()
  }
}

export const soundEngine = new SoundEngine()
export default soundEngine

