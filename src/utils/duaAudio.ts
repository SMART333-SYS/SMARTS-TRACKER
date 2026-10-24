// Dua Audio Recitation Player using Web Speech Synthesis (Arabic voice) + Web Audio ambient drone

class DuaAudioPlayer {
  private isPlaying: boolean = false;
  private currentDuaId: string | null = null;
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private statusListeners: Set<(isPlaying: boolean, duaId: string | null) => void> = new Set();

  private getAudioContext(): AudioContext | null {
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

  // Soft spiritual background harmonic drone (432Hz calming tuning)
  private startAmbientDrone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      this.stopAmbientDrone();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, ctx.currentTime); // Lower spiritual octave

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.droneOsc = osc;
      this.droneGain = gain;
    } catch {
      // Ignore
    }
  }

  private stopAmbientDrone() {
    try {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (this.droneOsc) {
          try {
            this.droneOsc.stop();
            this.droneOsc.disconnect();
          } catch {}
          this.droneOsc = null;
        }
      }, 500);
    } catch {
      // Ignore
    }
  }

  playDua(duaId: string, arabicText: string, rate = 0.85) {
    if (typeof window === 'undefined') return;

    // If currently playing the same dua, stop it
    if (this.isPlaying && this.currentDuaId === duaId) {
      this.stop();
      return;
    }

    this.stop();

    this.isPlaying = true;
    this.currentDuaId = duaId;
    this.notify();

    // Start background soothing drone
    this.startAmbientDrone();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Clean Arabic text for smoother TTS recitation
      const cleanArabic = arabicText
        .replace(/[^\u0600-\u06FF\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanArabic);
      utterance.lang = 'ar-SA'; // Authentic Arabic
      utterance.rate = rate; // Gentle dignified pace
      utterance.pitch = 0.95; // Warm spiritual tone

      // Try to select an Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('maged')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        this.stop();
      };

      utterance.onerror = () => {
        this.stop();
      };

      this.speechUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: duration-based drone playback
      setTimeout(() => {
        this.stop();
      }, 8000);
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.stopAmbientDrone();
    this.isPlaying = false;
    this.currentDuaId = null;
    this.notify();
  }

  getIsPlaying(duaId?: string): boolean {
    if (duaId) {
      return this.isPlaying && this.currentDuaId === duaId;
    }
    return this.isPlaying;
  }

  getCurrentDuaId(): string | null {
    return this.currentDuaId;
  }

  subscribe(listener: (isPlaying: boolean, duaId: string | null) => void): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notify() {
    this.statusListeners.forEach((l) => l(this.isPlaying, this.currentDuaId));
  }
}

export const duaAudioPlayer = new DuaAudioPlayer();
