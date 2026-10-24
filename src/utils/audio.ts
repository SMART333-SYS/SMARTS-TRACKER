// Audio synthesizer and Mashup Rhythm Engine using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: NodeJS.Timeout | null = null;
  private masterMusicGain: GainNode | null = null;
  private currentStep: number = 0;
  private currentBpm: number = 128;
  private musicVolume: number = 0.5;
  private currentTrackGenre: string = 'Epic Mashup';
  private currentSongTitle: string = '';
  private onBeatCallback: ((step: number) => void) | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // --- UI Sound Effects ---

  playTap(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  playBead(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  playSuccess(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  // --- Namaz Prayer Alarm & Reminder Bell ---
  playPrayerBell(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Authentic two-tone golden bell chime (Ding-Dong harmonics)
      const chimes = [
        { f1: 880, f2: 1760, time: 0, dur: 1.2 },
        { f1: 659.25, f2: 1318.5, time: 0.35, dur: 1.6 }
      ];

      chimes.forEach(({ f1, f2, time, dur }) => {
        const start = now + time;
        // Primary bell tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(f1, start);

        gain1.gain.setValueAtTime(0.2, start);
        gain1.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(start);
        osc1.stop(start + dur);

        // Harmonic shimmer overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(f2, start);

        gain2.gain.setValueAtTime(0.08, start);
        gain2.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.7);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(start);
        osc2.stop(start + dur * 0.7);
      });
    } catch {
      // Ignore
    }
  }

  playPrayerReminderSound(enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Peaceful 5-tone spiritual Adhan / Chime progression: C4 -> F4 -> G4 -> Bb4 -> C5
      const notes = [
        { freq: 261.63, delay: 0.0, dur: 0.6, gain: 0.16 }, // C4
        { freq: 349.23, delay: 0.45, dur: 0.7, gain: 0.18 }, // F4
        { freq: 392.00, delay: 0.95, dur: 0.7, gain: 0.19 }, // G4
        { freq: 466.16, delay: 1.45, dur: 0.8, gain: 0.20 }, // Bb4
        { freq: 523.25, delay: 2.05, dur: 1.6, gain: 0.22 }, // C5 (resolving long tone)
      ];

      notes.forEach(({ freq, delay, dur, gain: noteGain }) => {
        const start = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine-triangle blend
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        // Gentle attack, warm sustain, long decay
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(noteGain, start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // Ignore
    }
  }

  // Timer Countdown Beeps (3, 2, 1, GO!)
  playTimerBeep(isFinal: boolean = false, enabled: boolean = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isFinal) {
        // High energetic victory/go beep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1174, now + 0.15); // A5 to D6
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.42);
      } else {
        // Short preparation countdown beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
    } catch {
      // Ignore
    }
  }

  // --- Real Generative Workout Music & Mashup Engine ---

  setMusicBeatCallback(cb: ((step: number) => void) | null) {
    this.onBeatCallback = cb;
  }

  setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterMusicGain && this.ctx) {
      this.masterMusicGain.gain.setValueAtTime(this.musicVolume * 0.25, this.ctx.currentTime);
    }
  }

  getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  startWorkoutMusic(bpm: number = 128, genre: string = 'Epic Mashup') {
    this.startSongPlayback('Workout Beats', bpm, genre);
  }

  // Play any song offline with real synthesized melodic lead & rhythm
  startSongPlayback(songTitle: string, bpm: number = 126, genre: string = 'Emraan Hashmi') {
    this.stopWorkoutMusic();
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    this.currentSongTitle = songTitle;
    this.currentBpm = bpm;
    this.currentTrackGenre = genre;
    this.isMusicPlaying = true;
    this.currentStep = 0;

    // Create Master Music Gain with smooth fade-in
    this.masterMusicGain = ctx.createGain();
    this.masterMusicGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterMusicGain.gain.exponentialRampToValueAtTime(Math.max(0.05, this.musicVolume * 0.35), ctx.currentTime + 0.1);
    this.masterMusicGain.connect(ctx.destination);

    // 16th note interval calculation
    const stepIntervalMs = (60 / Math.max(70, Math.min(180, bpm)) / 4) * 1000;

    this.musicInterval = setInterval(() => {
      this.playStep(this.currentStep);
      if (this.onBeatCallback) {
        this.onBeatCallback(this.currentStep);
      }
      this.currentStep = (this.currentStep + 1) % 16;
    }, stepIntervalMs);
  }

  stopWorkoutMusic() {
    this.isMusicPlaying = false;
    this.currentSongTitle = '';
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Synthesize rhythmic instruments & melodic song hooks on current 16-step grid
  private playStep(step: number) {
    const ctx = this.getContext();
    if (!ctx || !this.masterMusicGain) return;
    const now = ctx.currentTime;

    const isKick = step % 4 === 0; // 4-on-the-floor beat
    const isSnare = step === 4 || step === 12; // Backbeat snare/clap
    const isHihat = step % 2 === 0; // Offbeat / 8th hihat

    // 1. Kick Drum / Duff Bass Boom
    if (isKick) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(130, now);
      kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

      kickGain.gain.setValueAtTime(0.7, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(this.masterMusicGain);

      kickOsc.start(now);
      kickOsc.stop(now + 0.2);
    }

    // 2. Duff Rimshot / Snare
    if (isSnare) {
      const snareOsc = ctx.createOscillator();
      const snareGain = ctx.createGain();
      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(220, now);
      snareOsc.frequency.exponentialRampToValueAtTime(95, now + 0.1);

      snareGain.gain.setValueAtTime(0.35, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      snareOsc.connect(snareGain);
      snareGain.connect(this.masterMusicGain);

      snareOsc.start(now);
      snareOsc.stop(now + 0.16);
    }

    // 3. Shaker / Hi-Hat
    if (isHihat) {
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(900 + (step * 60), now);

      hatGain.gain.setValueAtTime(step % 4 === 2 ? 0.12 : 0.06, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      hatOsc.connect(hatGain);
      hatGain.connect(this.masterMusicGain);

      hatOsc.start(now);
      hatOsc.stop(now + 0.04);
    }

    // 4. Melodic Song Scales and Hook Melodies (Authentic Song Lines)
    let notesByStep: number[] = [];
    const titleLower = (this.currentSongTitle || '').toLowerCase();
    const genreLower = (this.currentTrackGenre || '').toLowerCase();

    // Check specific iconic tracks
    if (titleLower.includes('zara sa')) {
      // Zara Sa Dil Me De Jagah Tu melody (D4, E4, F4, G4, F4, E4, D4, C4...)
      notesByStep = [
        293.66, 329.63, 349.23, 392.00,
        349.23, 329.63, 293.66, 261.63,
        293.66, 329.63, 349.23, 440.00,
        392.00, 349.23, 329.63, 293.66
      ];
    } else if (titleLower.includes('woh lamhe') || titleLower.includes('wo lamhe')) {
      // Woh Lamhe Woh Baatein (Atif classic melodic line)
      notesByStep = [
        220.00, 246.94, 261.63, 293.66,
        329.63, 293.66, 261.63, 246.94,
        220.00, 261.63, 293.66, 349.23,
        329.63, 293.66, 261.63, 220.00
      ];
    } else if (titleLower.includes('toh phir aao') || titleLower.includes('phir aao')) {
      // Toh Phir Aao Mujhko Sataao melody
      notesByStep = [
        174.61, 220.00, 261.63, 293.66,
        261.63, 220.00, 196.00, 174.61,
        196.00, 220.00, 261.63, 293.66,
        349.23, 329.63, 293.66, 220.00
      ];
    } else if (titleLower.includes('pasoori') || titleLower.includes('bajao')) {
      // Pasoori / Bajao Coke Studio hook (Agg laawan majboori nu)
      notesByStep = [
        261.63, 293.66, 329.63, 349.23,
        392.00, 440.00, 392.00, 349.23,
        329.63, 293.66, 329.63, 392.00,
        440.00, 523.25, 440.00, 392.00
      ];
    } else if (titleLower.includes('tajdar') || titleLower.includes('qawwali')) {
      // Tajdar-e-Haram soulful Sufi progression
      notesByStep = [
        220.00, 246.94, 277.18, 293.66,
        329.63, 369.99, 440.00, 369.99,
        329.63, 293.66, 277.18, 246.94,
        220.00, 246.94, 277.18, 220.00
      ];
    } else if (titleLower.includes('tum hi ho')) {
      // Tum Hi Ho melody (Kyunki tum hi ho...)
      notesByStep = [
        261.63, 293.66, 311.13, 349.23,
        392.00, 349.23, 311.13, 293.66,
        261.63, 311.13, 349.23, 392.00,
        466.16, 415.30, 392.00, 349.23
      ];
    } else if (titleLower.includes('kesariya')) {
      // Kesariya tera ishq hai piya hook
      notesByStep = [
        293.66, 329.63, 369.99, 392.00,
        440.00, 392.00, 369.99, 329.63,
        293.66, 369.99, 440.00, 493.88,
        440.00, 392.00, 369.99, 293.66
      ];
    } else if (genreLower.includes('emraan') || genreLower.includes('romantic') || genreLower.includes('sad')) {
      // Emraan Hashmi classic Minor hook (D Minor / Bb Major)
      notesByStep = [
        146.83, 174.61, 220.00, 293.66,
        116.54, 146.83, 174.61, 233.08,
        130.81, 164.81, 196.00, 261.63,
        146.83, 220.00, 293.66, 349.23,
      ];
    } else if (genreLower.includes('punjabi') || genreLower.includes('pop')) {
      // Upbeat Punjabi Pop (G Major / E Minor)
      notesByStep = [
        196.00, 246.94, 293.66, 392.00,
        164.81, 196.00, 246.94, 329.63,
        130.81, 164.81, 196.00, 261.63,
        146.83, 220.00, 293.66, 392.00,
      ];
    } else if (genreLower.includes('nasheed') || genreLower.includes('sufi')) {
      // Mystical Sufi Hijaz Maqam
      notesByStep = [
        146.83, 155.56, 185.00, 220.00,
        196.00, 220.00, 246.94, 293.66,
        146.83, 185.00, 220.00, 293.66,
        130.81, 164.81, 196.00, 220.00,
      ];
    } else {
      // Standard Energetic Mashup Harmonics
      notesByStep = [
        146.83, 174.61, 220.00, 293.66,
        164.81, 196.00, 246.94, 329.63,
        174.61, 220.00, 261.63, 349.23,
        130.81, 164.81, 196.00, 261.63,
      ];
    }

    const noteFreq = notesByStep[step % notesByStep.length];
    if (noteFreq) {
      const melOsc = ctx.createOscillator();
      const melGain = ctx.createGain();

      // Instrument timbre: smooth triangle/warm sine for romantic & sufi, sawtooth for punjabi pop
      melOsc.type = genreLower.includes('nasheed') || titleLower.includes('tajdar')
        ? 'sine'
        : genreLower.includes('punjabi')
        ? 'sawtooth'
        : 'triangle';
      melOsc.frequency.setValueAtTime(noteFreq, now);

      melGain.gain.setValueAtTime(0.18, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

      melOsc.connect(melGain);
      melGain.connect(this.masterMusicGain);

      melOsc.start(now);
      melOsc.stop(now + 0.18);

      // Sub-octave bass note for full body sound on every 4th step
      if (step % 4 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(noteFreq * 0.5, now);
        bassGain.gain.setValueAtTime(0.15, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterMusicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.26);
      }
    }
  }
}

export const soundManager = new SoundManager();

export const triggerHaptic = (duration: number = 20, enabled: boolean = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch {
    // Ignore
  }
};
