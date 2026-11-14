// Zero-latency Web Audio API + HTMLAudioElement Sound Manager for Gridverse Web

export type SoundEffectName =
  | 'tap'
  | 'correct'
  | 'wrong'
  | 'coin'
  | 'level_win'
  | 'streak'
  | 'celdi_poke'
  | 'hint'
  | 'game_over';

const SFX_NAMES: SoundEffectName[] = [
  'tap',
  'correct',
  'wrong',
  'coin',
  'level_win',
  'streak',
  'celdi_poke',
  'hint',
  'game_over',
];

const SFX_VOLUMES: Record<SoundEffectName, number> = {
  tap: 0.55,
  correct: 0.9,
  wrong: 0.9,
  coin: 0.8,
  level_win: 0.95,
  streak: 0.9,
  celdi_poke: 0.85,
  hint: 0.85,
  game_over: 0.9,
};

class SoundManager {
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private rawBuffers: Record<string, ArrayBuffer> = {};
  private decodedBuffers: Record<string, AudioBuffer> = {};
  private htmlAudioPool: Record<string, HTMLAudioElement> = {};
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

    if (typeof window !== 'undefined') {
      // Pre-fetch all SFX files into memory immediately so they are ready before the user clicks
      this.preloadAllSfx();

      // Unlock AudioContext and start BGM on any user interaction
      const unlockAudio = () => {
        this.ensureAudioContext();
        if (this.bgmEnabled && (!this.bgmAudio || this.bgmAudio.paused)) {
          this.startBgm();
        }
      };

      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          this.audioCtx = new Ctx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      // Decode any raw buffers that haven't been decoded yet
      if (this.audioCtx) {
        for (const name of SFX_NAMES) {
          if (this.rawBuffers[name] && !this.decodedBuffers[name]) {
            const copy = this.rawBuffers[name].slice(0);
            this.audioCtx.decodeAudioData(
              copy,
              (decoded) => {
                this.decodedBuffers[name] = decoded;
              },
              () => {}
            );
          }
        }
      }
    } catch {
      // Ignore AudioContext init error
    }
    return this.audioCtx;
  }

  private preloadAllSfx() {
    for (const name of SFX_NAMES) {
      const path = `/audio/${name}.wav`;

      // 1. Preload HTMLAudioElement
      try {
        const el = new Audio();
        el.preload = 'auto';
        el.src = path;
        el.load();
        this.htmlAudioPool[name] = el;
      } catch {
        // Ignore
      }

      // 2. Fetch raw ArrayBuffer for Web Audio API zero-latency playback
      fetch(path)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject()))
        .then((buf) => {
          this.rawBuffers[name] = buf;
          if (this.audioCtx) {
            const copy = buf.slice(0);
            this.audioCtx.decodeAudioData(
              copy,
              (decoded) => {
                this.decodedBuffers[name] = decoded;
              },
              () => {}
            );
          }
        })
        .catch(() => {});
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
        this.bgmAudio.volume = 0.3;
      }
      this.bgmAudio.play().catch(() => {});
      this.notify();
    } catch {
      // Ignore fallback
    }
  }

  public stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.notify();
    }
  }

  public play(name: SoundEffectName) {
    if (!this.sfxEnabled) return;

    const volume = SFX_VOLUMES[name] ?? 0.85;
    const ctx = this.ensureAudioContext();

    // Path 1: Play pre-decoded AudioBuffer via Web Audio API (0ms latency, concurrent mixing)
    if (ctx && this.decodedBuffers[name]) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = this.decodedBuffers[name];
        const gain = ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall through to Path 2
      }
    }

    // Path 2: If rawBuffer is loaded but not yet decoded, decode and play immediately
    if (ctx && this.rawBuffers[name]) {
      try {
        const copy = this.rawBuffers[name].slice(0);
        ctx.decodeAudioData(
          copy,
          (decoded) => {
            this.decodedBuffers[name] = decoded;
            const source = ctx.createBufferSource();
            source.buffer = decoded;
            const gain = ctx.createGain();
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start(0);
          },
          () => {
            this.playHtmlFallback(name, volume);
          }
        );
        return;
      } catch {
        // Fall through to Path 3
      }
    }

    // Path 3: Safe HTMLAudioElement playback (cloning node so currentTime=0 never throws on readyState 0)
    this.playHtmlFallback(name, volume);
  }

  private playHtmlFallback(name: SoundEffectName, volume: number) {
    try {
      const base = this.htmlAudioPool[name];
      const audio = base ? (base.cloneNode(true) as HTMLAudioElement) : new Audio(`/audio/${name}.wav`);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundManager();
