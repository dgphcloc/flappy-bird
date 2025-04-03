"use client";

export default class PreLoadScene extends Phaser.Scene {
  constructor() {
    super("PreLoadScene");
  }

  preload() {
    // Load background images
    this.load.image("background", "assets/images/background.png");
    this.load.image("background_frame", "assets/images/background_frame.png");

    // Load UI elements
    this.load.image("username_icon", "assets/images/username_icon.png");
    this.load.image("password_icon", "assets/images/password_icon.png");
    this.load.image("eye_icon", "assets/images/eye_icon.png");
    this.load.image("spr_btn_x", "assets/images/spr_btn_x.png");

    // Load social media icons
    this.load.spritesheet("icon_GG", "assets/images/icon_GG.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("icon_FB", "assets/images/icon_FB.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Add loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const loadingText = this.add.text(
      width / 2,
      height / 2 - 50,
      "Loading...",
      {
        font: "20px monospace",
        color: "#ffffff",
      }
    );
    loadingText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.scene.start("LoginScene");
    });
  }

  create() {
    // Scene will automatically transition to LoginScene when loading is complete
  }
}
