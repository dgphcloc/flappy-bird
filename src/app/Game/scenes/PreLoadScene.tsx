"use client";

import { assert } from "console";

export default class PreLoadScene extends Phaser.Scene {
  constructor() {
    super("PreLoadScene");
  }

  preload(this: Phaser.Scene) {
    this.load.setPath("asset");
    this.load.image("background", "Background1.png");
    this.load.spritesheet("bird_spr", "bird1_spritesheet.png", {
      frameWidth: 300,
      frameHeight: 216,
    });
  }

  create() {
    this.scene.start("BackgroundScene");
  }
}
