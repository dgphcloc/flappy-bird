"use client";

import { Switch } from "@mantine/core";
import { Scale } from "phaser";

export default class MenuLoginScene extends Phaser.Scene {
  private bird1_bg!: Phaser.GameObjects.Sprite;
  private TextTitle!: Phaser.GameObjects.Image;

  constructor() {
    super("MenuLoginScene");
  }

  create() {
    const ScaleWidth = this.scale.width;
    const ScaleHeight = this.scale.height;

    if (!this.scene.isActive("BackgroundScene")) {
      this.scene.launch("BackgroundScene");
    }
    this.bird1_bg = this.physics.add.sprite(
      ScaleWidth * 0.35,
      ScaleHeight * 0.25,
      "bird1_spr"
    );
    this.TextTitle = this.add.image(
      ScaleWidth * 0.5,
      ScaleHeight * 0.15,
      "TextTitle"
    );

    this.anims.create({
      key: "flappy",
      frames: this.anims.generateFrameNumbers("bird1_spr", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    const updateScaleTextTitle = (width: number, height: number) => {
      // let widthmax: number = 0;
      // let heightmax: number = 0;
      // if (width > 600) {
      //   widthmax = 600;
      // } else {
      //   widthmax = width;
      // }

      // if (height > 730) {
      //   heightmax = 730;
      // } else {
      //   heightmax = height;
      // }
      const scalex = width / this.TextTitle.width;
      const scaley = height / this.TextTitle.height;
      const scaleTextTitle = Math.min(scalex, scaley);
      this.TextTitle.setScale(scaleTextTitle);
      switch (true) {
        case width < 200:
          this.TextTitle.setPosition(width * 0.5, height * 0.14);
          break;
        case width < 300:
          this.TextTitle.setPosition(width * 0.5, height * 0.15);
          break;
        case width < 400:
          this.TextTitle.setPosition(width * 0.5, height * 0.16);
          break;
        case width < 500:
          this.TextTitle.setPosition(width * 0.5, height * 0.18);
          break;
        default:
          this.TextTitle.setPosition(width * 0.5, height * 0.2);
          break;
      }
    };
    const updateScalebrid1_bg = (width: number, height: number) => {
      const scalex = (width * 0.4) / this.bird1_bg.width;
      const scaley = height / this.bird1_bg.height;
      const scalebrid1_bg = Math.min(scalex, scaley);
      this.bird1_bg.setScale(scalebrid1_bg);
      switch (true) {
        case width < 200:
          this.bird1_bg.setPosition(width * 0.35, height * 0.12);
          break;
        case width < 290:
          this.bird1_bg.setPosition(width * 0.35, height * 0.14);
          break;
        case width < 330:
          this.bird1_bg.setPosition(width * 0.35, height * 0.16);
          break;
        case width < 400:
          this.bird1_bg.setPosition(width * 0.35, height * 0.18);
          break;
        case width < 450:
          this.bird1_bg.setPosition(width * 0.35, height * 0.21);
          break;
        case width < 500:
          this.bird1_bg.setPosition(width * 0.35, height * 0.23);
          break;
        case width < 520:
          this.bird1_bg.setPosition(width * 0.35, height * 0.24);
          break;
        case width < 600:
          this.bird1_bg.setPosition(width * 0.35, height * 0.245);
          break;

        default:
          this.bird1_bg.setPosition(width * 0.35, height * 0.3);
          break;
      }
    };
    this.tweens.add({
      targets: this.bird1_bg,
      y: this.bird1_bg.y - 1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    // this.tweens.add({
    //   targets: this.TextTitle,
    //   y: this.TextTitle.y - 1,
    //   duration: 800, // Thời gian di chuyển (ms)
    //   yoyo: true, // Quay lại vị trí ban đầu
    //   repeat: -1,
    //   ease: "Sine.easeInOut", // Làm mềm chuyển động
    // });
    updateScaleTextTitle(ScaleWidth, ScaleHeight);
    updateScalebrid1_bg(ScaleWidth, ScaleHeight);
    this.scale.on("resize", (gameSize: { width: number; height: number }) => {
      // const gamewidth = this.game.config.width as number;
      // const gameheight = this.game.config.height as number;

      this.cameras.main.setSize(gameSize.width, gameSize.height);
      updateScaleTextTitle(gameSize.width, gameSize.height);
      updateScalebrid1_bg(gameSize.width, gameSize.height);
    });

    this.bird1_bg.play("flappy");
  }
}
