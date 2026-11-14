// Audio manager using audio files with mute support

class SoundManager {
  private enabled: boolean = true;
  private cache: Record<string, HTMLAudioElement> = {};

  constructor() {
    const saved = localStorage.getItem('gridverse_sound');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('gridverse_sound', String(val));
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public play(name: 'tap' | 'correct' | 'wrong' | 'coin' | 'level_win' | 'streak' | 'celdi_poke') {
    if (!this.enabled) return;

    try {
      const path = `/audio/${name}.wav`;
      let audio = this.cache[path];
      if (!audio) {
        audio = new Audio(path);
        this.cache[path] = audio;
      }
      audio.currentTime = 0;
      audio.volume = 0.6;
      audio.play().catch(() => {
        // Ignorar si el navegador bloquea autoplay hasta interacción
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundManager();
