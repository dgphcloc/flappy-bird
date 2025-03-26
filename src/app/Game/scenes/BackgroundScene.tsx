"use client";

export default class BackgroundScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;
  constructor() {
    super("BackgroundScene");
  }
  create() {
    // const sizeWidth = window.innerWidth
    console.log(this.scale.width);
    console.log(this.scale.height);

    this.bg = this.add
      .image(this.scale.width, this.scale.height, "background")
      .setOrigin(1, 1);
    //   .setDisplayOrigin(this.scale.width, this.scale.height);

    this.updateBackgroundSize();
    this.scale.on("resize", this.updateBackgroundSize, this);
  }

  updateBackgroundSize() {
    this.bg.setDisplaySize(this.scale.width, this.scale.height);
  }
}
