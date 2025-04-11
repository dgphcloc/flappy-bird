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
    this.load.image("ground", "ground.png");
    this.load.spritesheet("spr_btn_x", "spritesheet_btn_x.png", {
      frameWidth: 78,
      frameHeight: 78,
    });
    this.load.image("username_icon", "iconUser.png");
    this.load.image("password_icon", "iconPassword.png");
    this.load.image("passwordComfirm_icon", "iconCheck.png");
    this.load.image("eye_icon", "eye_icon.png");
    this.load.spritesheet("icon_GG", "icon_GG.png", {
      frameWidth: 53,
      frameHeight: 53,
    });
    this.load.spritesheet("icon_FB", "icon_FB.png", {
      frameWidth: 53,
      frameHeight: 53,
    });
    this.load.spritesheet("btn_sigUp", "spritesheet_btn_signUp.png", {
      frameWidth: 125,
      frameHeight: 60,
    });
    this.load.spritesheet("btn_Login", "spritesheet_btn_Login.png", {
      frameWidth: 125,
      frameHeight: 60,
    });
    this.load.spritesheet("btn_Register", "spritesheet_btn_Register.png", {
      frameWidth: 125,
      frameHeight: 60,
    });
    this.load.spritesheet("btn_Login_back", "spritesheet_btn_Loginback.png", {
      frameWidth: 125,
      frameHeight: 60,
    });
    this.load.image("background_register", "formRegister.png");
  }

  create() {
    this.scene.start("MenuLoginScene");
  }
}
