// Audio manager with Sound Effects and Background Music (BGM) looping

class SoundManager {
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private cache: Record<string, HTMLAudioElement> = {};
  private bgmAudio: HTMLAudioElement | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    const savedSfx = localStorage.getItem('gridverse_sound');
    if (savedSfx !== null) {
      this.sfxEnabled = savedSfx === 'true';
    }
    const savedBgm = localStorage.getItem('gridverse_bgm');
    if (savedBgm !== null) {
      this.bgmEnabled = savedBgm === 'true';
    }

    // Try auto-starting BGM on first user interaction (browser autoplay policy requirement)
    const startOnFirstGesture = () => {
      if (this.bgmEnabled && (!this.bgmAudio || this.bgmAudio.paused)) {
        this.startBgm();
      }
      window.removeEventListener('pointerdown', startOnFirstGesture);
      window.removeEventListener('keydown', startOnFirstGesture);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', startOnFirstGesture, { once: true });
      window.addEventListener('keydown', startOnFirstGesture, { once: true });
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public setSfxEnabled(val: boolean) {
    this.sfxEnabled = val;
    localStorage.setItem('gridverse_sound', String(val));
    this.notify();
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setBgmEnabled(val: boolean) {
    this.bgmEnabled = val;
    localStorage.setItem('gridverse_bgm', String(val));
    if (val) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    this.notify();
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public isBgmPlaying(): boolean {
    return Boolean(this.bgmAudio && !this.bgmAudio.paused);
  }

  public startBgm() {
    if (!this.bgmEnabled) return;
    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('/audio/bgm_chill.wav');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.35;
      }
      this.bgmAudio.play().catch(() => {
        // Will start on next gesture
      });
      this.notify();
    } catch {
      // Ignorar fallback
    }
  }

  public stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.notify();
    }
  }

  public play(name: 'tap' | 'correct' | 'wrong' | 'coin' | 'level_win' | 'streak' | 'celdi_poke' | 'hint' | 'game_over') {
    if (!this.sfxEnabled) return;

    try {
      const path = `/audio/${name}.wav`;
      let audio = this.cache[path];
      if (!audio) {
        audio = new Audio(path);
        this.cache[path] = audio;
      }
      audio.currentTime = 0;
      audio.volume = name === 'tap' ? 0.45 : 0.75;
      audio.play().catch(() => {
        // Ignore autoplay restriction
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundManager();
