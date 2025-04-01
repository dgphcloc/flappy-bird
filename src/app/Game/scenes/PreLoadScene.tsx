"use client";

import { assert } from "console";

export default class PreLoadScene extends Phaser.Scene {
  constructor() {
    super("PreLoadScene");
  }

  preload(this: Phaser.Scene) {
    this.load.setPath("asset");
    this.load.image("background", "Background1.png");
    this.load.spritesheet("bird1_spr", "bird1_spritesheet.png", {
      frameWidth: 300,
      frameHeight: 216,
    });
    this.load.image("TextTitle", "TextTitle.png");
    this.load.spritesheet("button_menu", "spritesheet button menu.png", {
      frameWidth: 310,
      frameHeight: 100,
    });
    this.load.image("background_frame", "background_frame.png");
    this.load.spritesheet("spr_btn_x", "spritesheet_btn_x.png", {
      frameWidth: 78,
      frameHeight: 78,
    });
  }

  create() {
    this.scene.start("MenuLoginScene");
  }
}
