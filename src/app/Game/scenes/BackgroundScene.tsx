"use client";

export default class BackgroundScene extends Phaser.Scene {
  count: number;
  rope: any;
  private bg1!: Phaser.GameObjects.TileSprite;
  private bg2!: Phaser.GameObjects.TileSprite;
  private bird1!: Phaser.GameObjects.Sprite;
  constructor() {
    super("BackgroundScene");
    this.count = 0;
  }
  create() {
    this.bg1 = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      "background"
    );
    this.bg2 = this.add
      .tileSprite(
        900,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        "background"
      )
      .setFlipX(true);

    this.bird1 = this.physics.add.sprite(300, 200, "bird_spr");
    this.anims.create({
      key: "flappy",
      frames: this.anims.generateFrameNumbers("bird_spr", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.bird1.setScale(0.5);
    this.bird1.play("flappy");
  }
  update() {
    let speed = 1.3;

    // Di chuyển cả hai ảnh nền
    this.bg1.x -= speed;
    this.bg2.x -= speed;

    // Khi ảnh đầu tiên ra khỏi màn hình, đưa nó về vị trí phía sau ảnh thứ hai
    if (this.bg1.x + this.bg1.width <= 300) {
      this.bg1.x = this.bg2.x + this.bg2.width - 2;
    }
    if (this.bg2.x + this.bg2.width <= 300) {
      this.bg2.x = this.bg1.x + this.bg1.width;
    }
  }
  updateBackgroundSize() {
    this.bg1.setDisplaySize(this.scale.width, this.scale.height);
    this.bg2.setDisplaySize(this.scale.width, this.scale.height);
  }
}
