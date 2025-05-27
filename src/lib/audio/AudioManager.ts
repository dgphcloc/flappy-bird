import * as Phaser from "phaser";

class AudioManager {
  private static instance: AudioManager;
  private soundEnabled: boolean;
  private musicEnabled: boolean;
  private soundVolume: number = 1;
  private musicVolume: number = 1;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private music: Map<string, Phaser.Sound.BaseSound> = new Map();
  private scene: Phaser.Scene | null = null;

  private constructor() {
    // Chỉ lưu trạng thái bật/tắt vào localStorage
    this.soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    this.musicEnabled = localStorage.getItem("musicEnabled") !== "false";
  }

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
    localStorage.setItem("soundEnabled", this.soundEnabled.toString());
    if (!this.soundEnabled) {
      this.stopAllSounds();
    }
    return this.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem("musicEnabled", this.musicEnabled.toString());
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

  // Giữ lại các phương thức điều chỉnh âm lượng nhưng không lưu vào localStorage
  public setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (sound as any).volume = this.soundVolume;
    });
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.music.forEach((music) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (music as any).volume = this.musicVolume;
    });
  }

  public getSoundVolume(): number {
    return this.soundVolume;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }
}

export default AudioManager.getInstance();
