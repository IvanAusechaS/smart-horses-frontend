// Audio Manager for Smart Horses Game
// Handles background music and sound effects

class AudioManager {
  constructor() {
    this.sounds = {};
    this.bgMusic = null;
    this.isMuted = false;
    this.musicVolume = 0.24; // Reduced by 20% from 0.3
    this.sfxVolume = 0.5;
  }

  // Initialize all audio
  init() {
    // Note: Audio files should be placed in /public/audio/ directory
    // For this implementation, we'll use Web Audio API to generate simple tones
    // Replace with actual audio files when available
    
    this.initBackgroundMusic();
    this.initSoundEffects();
  }

  initBackgroundMusic() {
    // Use actual music file from public/audio directory
    try {
      this.bgMusic = new Audio('/audio/video game - David Feyslan.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.musicVolume;
    } catch (e) {
      console.log('Failed to load background music:', e);
      this.bgMusic = null;
    }
  }

  initSoundEffects() {
    // Initialize sound effects
    // In production, use actual audio files
    this.sounds = {
      buttonClick: () => this.playTone(800, 0.1, 'sine'),
      pieceMove: () => this.playTone(440, 0.15, 'triangle'),
      capture: () => this.playSequence([
        { freq: 523, duration: 0.1 },
        { freq: 659, duration: 0.15 }
      ]),
      victory: () => this.playSequence([
        { freq: 523, duration: 0.2 },
        { freq: 659, duration: 0.2 },
        { freq: 784, duration: 0.3 }
      ]),
      defeat: () => this.playSequence([
        { freq: 392, duration: 0.2 },
        { freq: 330, duration: 0.2 },
        { freq: 262, duration: 0.4 }
      ]),
      validMove: () => this.playTone(1047, 0.08, 'sine'),
      error: () => this.playTone(200, 0.2, 'sawtooth'),
      gameStart: () => this.playSequence([
        { freq: 523, duration: 0.15 },
        { freq: 784, duration: 0.15 }
      ])
    };
  }

  createBackgroundMusic() {
    // For now, return null - will be replaced with actual music
    // In production: return new Audio('/audio/background-music.mp3');
    return null;
  }

  playBackgroundMusic() {
    if (this.bgMusic && !this.isMuted) {
      this.bgMusic.play().catch(e => {
        console.log('Background music autoplay blocked:', e);
      });
    }
  }

  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  pauseBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  resumeBackgroundMusic() {
    if (this.bgMusic && !this.isMuted) {
      this.bgMusic.play().catch(e => console.log('Resume failed:', e));
    }
  }

  // Play sound effect by name
  play(soundName) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound();
    }
  }

  // Play a tone using Web Audio API
  playTone(frequency, duration, type = 'sine') {
    if (this.isMuted) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.sfxVolume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio playback error:', e);
    }
  }

  // Play a sequence of tones
  playSequence(notes) {
    if (this.isMuted) return;

    let time = 0;
    notes.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, note.type || 'sine');
      }, time * 1000);
      time += note.duration;
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }
    return this.isMuted;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume;
    }
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create singleton instance
const audioManager = new AudioManager();
audioManager.init();

export default audioManager;
