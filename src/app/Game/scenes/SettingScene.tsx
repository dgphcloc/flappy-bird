"use client";

export default class SettingScene extends Phaser.Scene {
  private bg_setting!: Phaser.GameObjects.Image;
  private bg_setting_container!: Phaser.GameObjects.Container;

  constructor() {
    super("SettingScene");
  }

  preload() {
    this.load.setPath("asset");
    this.load.image("bg_setting", "bg_setting.png");
  }

  create() {
    this.createContainerSetting();
    this.bg_setting_container.setVisible(false);
  }

  public showSettingContainer() {
    this.bg_setting_container.setVisible(true);
  }

  private createContainerSetting() {
    // Tạo container ở giữa màn hình
    this.bg_setting_container = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    // Tạo background trước
    this.createBackground();

    // Đặt độ sâu cho container
    this.bg_setting_container.setDepth(1000);
  }

  private createBackground() {
    // Tạo background
    this.bg_setting = this.add.image(0, 0, "bg_setting");
    this.bg_setting.setOrigin(0.5, 0.5);

    // Scale theo tỉ lệ màn hình
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const scale = Math.min(scaleX, scaleY); // Chọn scale nhỏ hơn để đảm bảo vừa màn hình

    this.bg_setting.setScale(scale);

    // Thêm background vào container
    this.bg_setting_container.add(this.bg_setting);
  }
}
