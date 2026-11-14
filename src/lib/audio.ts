// Zero-latency Web Audio API + Preloaded HTMLAudioElement Pool Sound Manager for Gridverse Web

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
  tap: 0.65,
  correct: 0.95,
  wrong: 0.95,
  coin: 0.85,
  level_win: 1.0,
  streak: 0.95,
  celdi_poke: 0.9,
  hint: 0.85,
  game_over: 0.95,
};

interface ParsedWavPcm {
  numChannels: number;
  sampleRate: number;
  channels: Float32Array[];
}

/**
 * Synchronously parses a standard 16-bit PCM WAV ArrayBuffer into Float32Array channel buffers.
 * Avoids waiting for asynchronous AudioContext.decodeAudioData() on the first user click.
 */
function parseWavPcmSync(buffer: ArrayBuffer): ParsedWavPcm | null {
  try {
    if (buffer.byteLength < 44) return null;
    const view = new DataView(buffer);
    // Check "RIFF" and "WAVE"
    if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57415645) {
      return null;
    }

    let offset = 12;
    let numChannels = 1;
    let sampleRate = 44100;
    let bitsPerSample = 16;
    let dataOffset = -1;
    let dataSize = 0;

    while (offset + 8 <= buffer.byteLength) {
      const chunkId = view.getUint32(offset, false);
      const chunkSize = view.getUint32(offset + 4, true);
      if (chunkId === 0x666d7420) {
        // "fmt "
        const audioFormat = view.getUint16(offset + 8, true);
        if (audioFormat !== 1) return null; // Only PCM = 1
        numChannels = view.getUint16(offset + 10, true);
        sampleRate = view.getUint32(offset + 12, true);
        bitsPerSample = view.getUint16(offset + 22, true);
      } else if (chunkId === 0x64617461) {
        // "data"
        dataOffset = offset + 8;
        dataSize = Math.min(chunkSize, buffer.byteLength - dataOffset);
        break;
      }
      offset += 8 + chunkSize + (chunkSize % 2);
    }

    if (dataOffset < 0 || bitsPerSample !== 16 || numChannels < 1) return null;

    const bytesPerFrame = numChannels * 2;
    const numFrames = Math.floor(dataSize / bytesPerFrame);
    const channels: Float32Array[] = Array.from({ length: numChannels }, () => new Float32Array(numFrames));

    let ptr = dataOffset;
    for (let i = 0; i < numFrames; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = view.getInt16(ptr, true);
        channels[c][i] = sample < 0 ? sample / 32768 : sample / 32767;
        ptr += 2;
      }
    }

    return { numChannels, sampleRate, channels };
  } catch {
    return null;
  }
}

const POOL_SIZE = 4;

class SoundManager {
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private rawBuffers: Record<string, ArrayBuffer> = {};
  private parsedPcm: Record<string, ParsedWavPcm> = {};
  private decodedBuffers: Record<string, AudioBuffer> = {};
  private htmlAudioPools: Record<string, HTMLAudioElement[]> = {};
  private htmlPoolCursor: Record<string, number> = {};
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
      this.preloadAllSfx();

      const unlockAudio = () => {
        const ctx = this.ensureAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        if (this.bgmEnabled && (!this.bgmAudio || this.bgmAudio.paused)) {
          this.startBgm();
        }
      };

      window.addEventListener('pointerdown', unlockAudio, { capture: true, passive: true });
      window.addEventListener('touchstart', unlockAudio, { capture: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { capture: true, passive: true });
      window.addEventListener('click', unlockAudio, { capture: true, passive: true });
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          this.audioCtx = new Ctx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      if (this.audioCtx) {
        // Synchronously build AudioBuffers from parsed PCM
        for (const name of SFX_NAMES) {
          if (!this.decodedBuffers[name] && this.parsedPcm[name]) {
            this.decodedBuffers[name] = this.createBufferFromPcm(this.audioCtx, this.parsedPcm[name]);
          }
        }
      }
    } catch {
      // Ignore AudioContext init error
    }
    return this.audioCtx;
  }

  private createBufferFromPcm(ctx: AudioContext, pcm: ParsedWavPcm): AudioBuffer {
    const audioBuffer = ctx.createBuffer(pcm.numChannels, pcm.channels[0].length, pcm.sampleRate);
    for (let c = 0; c < pcm.numChannels; c++) {
      audioBuffer.copyToChannel(pcm.channels[c], c);
    }
    return audioBuffer;
  }

  private preloadAllSfx() {
    for (const name of SFX_NAMES) {
      const path = `/audio/${name}.wav`;

      // 1. Pre-instantiate a rotating pool of 4 HTMLAudioElements per sound (no cloneNode needed)
      try {
        const pool: HTMLAudioElement[] = [];
        for (let i = 0; i < POOL_SIZE; i++) {
          const el = new Audio(path);
          el.preload = 'auto';
          el.volume = SFX_VOLUMES[name] ?? 0.85;
          el.load();
          pool.push(el);
        }
        this.htmlAudioPools[name] = pool;
        this.htmlPoolCursor[name] = 0;
      } catch {
        // Ignore
      }

      // 2. Fetch WAV bytes and parse PCM synchronously at startup
      fetch(path)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject()))
        .then((buf) => {
          this.rawBuffers[name] = buf;
          const pcm = parseWavPcmSync(buf);
          if (pcm) {
            this.parsedPcm[name] = pcm;
            if (this.audioCtx && !this.decodedBuffers[name]) {
              this.decodedBuffers[name] = this.createBufferFromPcm(this.audioCtx, pcm);
            }
          } else if (this.audioCtx && !this.decodedBuffers[name]) {
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
        this.bgmAudio.volume = 0.28;
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

    // Ensure synchronous buffer creation if PCM was parsed
    if (ctx && !this.decodedBuffers[name] && this.parsedPcm[name]) {
      try {
        this.decodedBuffers[name] = this.createBufferFromPcm(ctx, this.parsedPcm[name]);
      } catch {
        // Ignore
      }
    }

    // Path 1: Web Audio API when AudioContext is actively running
    if (ctx && ctx.state === 'running' && this.decodedBuffers[name]) {
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
        // Fall through to HTMLAudio pool
      }
    }

    // Path 2: Preloaded HTMLAudioElement pool (works synchronously inside user click even while AudioContext is resuming)
    const playedHtml = this.playFromHtmlPool(name, volume);

    // Also if AudioContext was suspended on this click, resume it and play via WebAudio if HTML pool failed
    if (!playedHtml && ctx) {
      ctx
        .resume()
        .then(() => {
          if (this.decodedBuffers[name]) {
            const source = ctx.createBufferSource();
            source.buffer = this.decodedBuffers[name];
            const gain = ctx.createGain();
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start(0);
          } else {
            this.playSynthFallback(ctx, name, volume);
          }
        })
        .catch(() => {});
    }
  }

  private playFromHtmlPool(name: SoundEffectName, volume: number): boolean {
    try {
      const pool = this.htmlAudioPools[name];
      if (!pool || pool.length === 0) return false;

      const idx = this.htmlPoolCursor[name] ?? 0;
      this.htmlPoolCursor[name] = (idx + 1) % pool.length;
      const el = pool[idx];

      el.volume = volume;
      if (el.readyState >= 1) {
        try {
          el.currentTime = 0;
        } catch {
          // Ignore seek error
        }
      }
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // If HTMLAudioElement failed, trigger WebAudio synth/buffer on resume
          if (this.audioCtx) {
            this.audioCtx.resume().then(() => {
              if (this.audioCtx && this.decodedBuffers[name]) {
                const src = this.audioCtx.createBufferSource();
                src.buffer = this.decodedBuffers[name];
                const g = this.audioCtx.createGain();
                g.gain.value = volume;
                src.connect(g);
                g.connect(this.audioCtx.destination);
                src.start(0);
              } else if (this.audioCtx) {
                this.playSynthFallback(this.audioCtx, name, volume);
              }
            }).catch(() => {});
          }
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  private playSynthFallback(ctx: AudioContext, name: SoundEffectName, volume: number) {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (name === 'correct' || name === 'level_win' || name === 'streak') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        gain.gain.setValueAtTime(volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (name === 'wrong' || name === 'game_over') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(165, now + 0.1);
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundManager();
