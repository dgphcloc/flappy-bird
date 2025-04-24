import * as Phaser from "phaser";

class AudioManager {
  private static instance: AudioManager;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private soundVolume: number = 1;
  private musicVolume: number = 1;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private music: Map<string, Phaser.Sound.BaseSound> = new Map();
  private scene: Phaser.Scene | null = null;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  public playSound(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig
  ): Phaser.Sound.BaseSound | null {
    if (!this.soundEnabled || !this.scene) return null;

    const sound = this.scene.sound.add(key, {
      ...config,
      volume: this.soundVolume,
    });
    sound.play();
    this.sounds.set(key, sound);
    return sound;
  }

  public playMusic(
    key: string,
    config?: Phaser.Types.Sound.SoundConfig
  ): Phaser.Sound.BaseSound | null {
    if (!this.musicEnabled || !this.scene) return null;

    const music = this.scene.sound.add(key, {
      ...config,
      volume: this.musicVolume,
      loop: config?.loop !== undefined ? config.loop : true,
    });
    music.play();
    this.music.set(key, music);
    return music;
  }

  public stopSound(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.stop();
      this.sounds.delete(key);
    }
  }

  public stopMusic(key: string): void {
    const music = this.music.get(key);
    if (music) {
      music.stop();
      this.music.delete(key);
    }
  }

  public stopAllSounds(): void {
    this.sounds.forEach((sound) => sound.stop());
    this.sounds.clear();
  }

  public stopAllMusic(): void {
    this.music.forEach((music) => music.stop());
    this.music.clear();
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopAllSounds();
    }
    return this.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopAllMusic();
    }
    return this.musicEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      (sound as any).volume = this.soundVolume;
    });
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.music.forEach((music) => {
      (music as any).volume = this.musicVolume;
    });
  }
}

export default AudioManager.getInstance();
