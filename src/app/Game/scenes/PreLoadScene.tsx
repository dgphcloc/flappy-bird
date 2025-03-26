"use client";
export default class PreLoadScene extends Phaser.Scene {
  constructor() {
    super("PreLoadScene");
  }

  preload() {
    this.load.image("background", "asset/Background1.png");
  }

  create() {
    this.scene.start("BackgroundScene");
  }
}
