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

      // Energetic, uplifting melodic chord progressions (C major / D minor / G / Am / F)
      const progressions = {
        garden: [
          { root: 261.63, notes: [261.63, 329.63, 392.00, 523.25], violin: [523.25, 659.25, 783.99, 659.25] },
          { root: 220.00, notes: [220.00, 261.63, 329.63, 440.00], violin: [440.00, 523.25, 659.25, 523.25] },
          { root: 174.61, notes: [174.61, 220.00, 261.63, 349.23], violin: [698.46, 659.25, 523.25, 440.00] },
          { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00], violin: [587.33, 659.25, 783.99, 880.00] },
        ],
        exploration: [
          { root: 261.63, notes: [261.63, 329.63, 392.00, 523.25], violin: [523.25, 587.33, 659.25, 783.99] },
          { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00], violin: [783.99, 659.25, 587.33, 523.25] },
          { root: 220.00, notes: [220.00, 261.63, 329.63, 440.00], violin: [659.25, 698.46, 783.99, 880.00] },
          { root: 174.61, notes: [174.61, 220.00, 261.63, 349.23], violin: [880.00, 783.99, 659.25, 587.33] },
        ],
        classroom: [
          { root: 261.63, notes: [261.63, 329.63, 392.00, 523.25], violin: [659.25, 587.33, 523.25, 440.00] },
          { root: 174.61, notes: [174.61, 220.00, 261.63, 349.23], violin: [523.25, 587.33, 659.25, 783.99] },
          { root: 220.00, notes: [220.00, 261.63, 329.63, 440.00], violin: [659.25, 783.99, 880.00, 783.99] },
          { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00], violin: [783.99, 659.25, 587.33, 523.25] },
        ],
        level2: [
          { root: 293.66, notes: [293.66, 369.99, 440.00, 587.33], violin: [587.33, 659.25, 739.99, 880.00] },
          { root: 246.94, notes: [246.94, 311.13, 369.99, 493.88], violin: [739.99, 659.25, 587.33, 493.88] },
          { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00], violin: [587.33, 739.99, 880.00, 987.77] },
          { root: 220.00, notes: [220.00, 277.18, 329.63, 440.00], violin: [880.00, 739.99, 659.25, 587.33] },
        ],
        bank_interior: [
          { root: 261.63, notes: [261.63, 329.63, 392.00, 523.25], violin: [523.25, 659.25, 783.99, 1046.50] },
          { root: 174.61, notes: [174.61, 220.00, 261.63, 349.23], violin: [880.00, 783.99, 659.25, 523.25] },
          { root: 196.00, notes: [196.00, 246.94, 293.66, 392.00], violin: [783.99, 880.00, 987.77, 1046.50] },
          { root: 220.00, notes: [220.00, 261.63, 329.63, 440.00], violin: [880.00, 783.99, 659.25, 587.33] },
        ],
      }

      const song = progressions[zone] || progressions.garden
      let barIndex = 0

      // BPM: 124 BPM -> 1 beat = 0.484s, 4 beats (1 bar) = 1.935s
      const beatDur = 0.484
      const barDur = beatDur * 4

      // ── Synthesizer Sub-routines ──

      // 1. Snappy Acoustic Piano Strike (fundamental + 2nd harmonic with crisp attack and natural decay)
      const playPianoNote = (freq, time, vel = 0.038, dur = 0.45) => {
        if (!this.ctx || this.muted || this.volume <= 0) return
        const osc = this.ctx.createOscillator()
        const oscHarm = this.ctx.createOscillator()
        const filter = this.ctx.createBiquadFilter()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, time)

        oscHarm.type = 'sine'
        oscHarm.frequency.setValueAtTime(freq * 2, time)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1800, time)
        filter.frequency.exponentialRampToValueAtTime(700, time + dur)

        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(vel, time + 0.005) // Crisp percussive hammer strike
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)

        osc.connect(filter)
        oscHarm.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)

        osc.start(time)
        oscHarm.start(time)
        osc.stop(time + dur + 0.02)
        oscHarm.stop(time + dur + 0.02)
        this.musicNodes.push(osc, oscHarm)
      }

      // 2. Singing Bowed Violin with Warm Vibrato (Sawtooth through lowpass + LFO pitch vibrato)
      const playViolinNote = (freq, time, dur = 0.85, vel = 0.028) => {
        if (!this.ctx || this.muted || this.volume <= 0) return
        const osc = this.ctx.createOscillator()
        const filter = this.ctx.createBiquadFilter()
        const gain = this.ctx.createGain()

        // Vibrato LFO: 5.5 Hz modulation for singing expression
        const lfo = this.ctx.createOscillator()
        const lfoGain = this.ctx.createGain()
        lfo.frequency.setValueAtTime(5.5, time)
        lfoGain.gain.setValueAtTime(freq * 0.015, time) // ~1.5% pitch vibrato
        lfo.connect(osc.frequency)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, time)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1400, time)
        filter.Q.setValueAtTime(3.2, time) // Warm body resonance

        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.linearRampToValueAtTime(vel, time + 0.06) // Smooth bowing swell
        gain.gain.setValueAtTime(vel, time + dur * 0.7)
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)

        lfo.start(time)
        osc.start(time)
        lfo.stop(time + dur + 0.05)
        osc.stop(time + dur + 0.05)
        this.musicNodes.push(osc, lfo)
      }

      // 3. Punchy Kick Drum
      const playKickDrum = (time) => {
        if (!this.ctx || this.muted || this.volume <= 0) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(135, time)
        osc.frequency.exponentialRampToValueAtTime(42, time + 0.09) // Fast pitch drop

        gain.gain.setValueAtTime(0.08, time)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(time)
        osc.stop(time + 0.18)
        this.musicNodes.push(osc)
      }

      // 4. Snappy Snare Drum (White Noise + Body tone)
      const playSnareDrum = (time) => {
        if (!this.ctx || this.muted || this.volume <= 0) return
        // Noise buffer
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.15)
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28))
        }

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(1600, time)
        filter.Q.setValueAtTime(1.4, time)

        const nGain = this.ctx.createGain()
        nGain.gain.setValueAtTime(0.045, time)
        nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14)

        // Snare body tone
        const osc = this.ctx.createOscillator()
        const oGain = this.ctx.createGain()
        osc.frequency.setValueAtTime(185, time)
        osc.frequency.exponentialRampToValueAtTime(90, time + 0.08)
        oGain.gain.setValueAtTime(0.035, time)
        oGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09)

        noise.connect(filter)
        filter.connect(nGain)
        nGain.connect(this.masterGain)

        osc.connect(oGain)
        oGain.connect(this.masterGain)

        noise.start(time)
        osc.start(time)
        noise.stop(time + 0.15)
        osc.stop(time + 0.12)
        this.musicNodes.push(noise, osc)
      }

      // 5. Crisp Hi-Hat Tick
      const playHiHat = (time, accent = false) => {
        if (!this.ctx || this.muted || this.volume <= 0) return
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.045)
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1)
        }

        const source = this.ctx.createBufferSource()
        source.buffer = buffer

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(7500, time)

        const gain = this.ctx.createGain()
        const hatVol = accent ? 0.024 : 0.014
        gain.gain.setValueAtTime(hatVol, time)
        gain.gain.exponentialRampToValueAtTime(0.0005, time + (accent ? 0.05 : 0.035))

        source.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)

        source.start(time)
        source.stop(time + 0.055)
        this.musicNodes.push(source)
      }

      // Main Loop: schedule each upbeat 4-beat bar of piano chords, violin lead, and energetic drum beat
      const playEnergeticBar = () => {
        if (this.muted || this.volume <= 0 || !this.ctx || this.ctx.state !== 'running') return
        try {
          const now = this.ctx.currentTime + 0.04
          const currentChord = song[barIndex % song.length]
          barIndex++

          // Clean up old nodes
          if (this.musicNodes.length > 80) {
            this.musicNodes = this.musicNodes.slice(-40)
          }

          // A. DRUMS (Upbeat Driving Rhythm: Kick on 1 & 3; Snare on 2 & 4; Hi-hats on all 8ths)
          playKickDrum(now + 0 * beatDur)
          playKickDrum(now + 2 * beatDur)
          if (barIndex % 2 === 0) {
            playKickDrum(now + 2.5 * beatDur) // Syncopated energetic push
          }

          playSnareDrum(now + 1 * beatDur)
          playSnareDrum(now + 3 * beatDur)

          // 8th-note Hi-Hats
          for (let beat = 0; beat < 4; beat += 0.5) {
            playHiHat(now + beat * beatDur, beat % 1 === 0)
          }

          // B. PIANO (Energetic Rhythmic Chords & Arpeggio Bounces)
          // Beat 0: Root chord strike
          currentChord.notes.forEach((freq, idx) => {
            playPianoNote(freq, now + 0 * beatDur + idx * 0.015, 0.032, 0.42)
          })
          // Beat 1.5: Upbeat piano tap
          playPianoNote(currentChord.notes[1], now + 1.5 * beatDur, 0.026, 0.28)
          playPianoNote(currentChord.notes[3], now + 1.5 * beatDur + 0.01, 0.026, 0.28)

          // Beat 2.5: Melody arpeggio ping
          playPianoNote(currentChord.notes[2] * 1.5, now + 2.5 * beatDur, 0.030, 0.32)

          // Beat 3: Second inversion chord punch
          currentChord.notes.forEach((freq, idx) => {
            playPianoNote(freq, now + 3 * beatDur + idx * 0.012, 0.028, 0.35)
          })

          // C. VIOLIN (Expressive, Singing Melodic Motif Soaring Above)
          const violinNotes = currentChord.violin || [currentChord.notes[2] * 2, currentChord.notes[3] * 2]
          const noteDur = beatDur * 1.95 // Sustained singing notes
          playViolinNote(violinNotes[0], now + 0 * beatDur, noteDur, 0.026)
          playViolinNote(violinNotes[1], now + 2 * beatDur, noteDur, 0.028)
        } catch {}
      }

      playEnergeticBar()
      this.musicInterval = setInterval(playEnergeticBar, Math.floor(barDur * 1000))
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

