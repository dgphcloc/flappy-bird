"use client";

export default class RegisterScene extends Phaser.Scene {
  private RegisterContainer!: Phaser.GameObjects.Container;
  private backgroundFrame!: Phaser.GameObjects.Image;
  constructor() {
    super("RegisterScene");
  }

  public showRegisterContainer() {
    this.RegisterContainer.setVisible(true);
  }

  create() {
    const Width = this.scale.width;
    const Height = this.scale.height;
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(metaViewport);
    // Thêm CSS để ngăn chặn việc scroll khi focus vào input
    const style = document.createElement("style");
    style.textContent = `
      html, body {
        height: 100%;
        overflow: hidden;
        position: fixed;
        width: 100%;
      }
      #username-input-container input,
      #password-input-container input {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
    document.head.appendChild(style);
    this.RegisterContainer = this.add.container(0, 0);
    this.RegisterContainer.setVisible(false);
    this.createFrame();
    this.RegisterContainer.add([this.backgroundFrame]);
  }
  private createFrame() {
    this.backgroundFrame = this.add.image(0, 0, "background_register");
    this.backgroundFrame.setOrigin(0.5, 0.5);
    this.backgroundFrame.setScale(1);
  }
}
