class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  private constructor() {
    // Sweet chime sound for matches
    this.sounds = {
      match: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
      powerup: new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'),
      land: new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3')
    };

    // Preload sounds
    Object.values(this.sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.3; // Set a comfortable volume level
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playSound(soundName: 'match' | 'powerup' | 'land'): void {
    if (!this.muted && this.sounds[soundName]) {
      const sound = this.sounds[soundName];
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
        console.log('Sound playback failed');
      });
    }
  }

  public toggleMute(): void {
    this.muted = !this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();