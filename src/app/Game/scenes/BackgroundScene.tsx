"use client";

export default class BackgroundScene extends Phaser.Scene {
  rope: any;
  private bg1!: Phaser.GameObjects.TileSprite;
  private bg2!: Phaser.GameObjects.TileSprite;
  private ground1!: Phaser.GameObjects.TileSprite;
  private ground2!: Phaser.GameObjects.TileSprite;
  constructor() {
    super("BackgroundScene");
  }
  create() {
    const widthBG = 1080;
    const heightBG = 1920;
    this.bg1 = this.add
      .tileSprite(0, 0, widthBG, heightBG, "background")
      .setOrigin(0, 0); // Đặt từ góc trái

    this.bg2 = this.add
      .tileSprite(this.scale.width, 0, widthBG, heightBG, "background")
      .setOrigin(0, 0)
      .setFlipX(true);

    const scaleX = this.scale.width / 1080;
    const scaleY = this.scale.height / 1920;
    const scale = Math.min(scaleX, scaleY);
    this.bg1.setScale(scale);
    this.bg2.setScale(scale);

    const widthGround = 1536;
    const heightGround = 468;
    this.ground1 = this.add
      .tileSprite(0, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000); // Ground layer - highest

    this.ground2 = this.add
      .tileSprite(0, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000); // Ground layer - highest

    const groundScaleX = this.scale.width / widthGround;
    const groundScaleY = this.scale.height / heightGround;

    const groundScale = Math.min(groundScaleX, groundScaleY) * 1.3; // Nhân với 0.4 để giữ tỷ lệ với background
    this.ground1.setScale(groundScale);
    this.ground1.setPosition(this.scale.width / 2, this.scale.height);

    this.ground2.setScale(groundScale);
    this.ground2
      .setPosition(
        this.ground1.x + this.ground1.displayWidth,
        this.scale.height
      )
      .setFlipX(true);

    this.ground1.setDepth(2000);
    this.ground2.setDepth(2000);
  }
  update() {
    this.bg1.x -= 1;
    this.bg2.x -= 1;
    this.ground1.x -= 2;
    this.ground2.x -= 2;

    // Nếu `bg1` ra khỏi màn hình, chuyển nó sang phải nối tiếp `bg2`
    if (this.bg1.x <= -this.scale.width) {
      this.bg1.x = this.bg2.x + this.scale.width;
    }

    // Nếu `bg2` ra khỏi màn hình, chuyển nó sang phải nối tiếp `bg1`
    if (this.bg2.x <= -this.scale.width) {
      this.bg2.x = this.bg1.x + this.scale.width;
    }

    // Sửa lại điều kiện cho ground, tính toán dựa trên origin ở giữa
    if (this.ground1.x <= -this.ground1.displayWidth / 2) {
      this.ground1.x = this.ground2.x + this.ground2.displayWidth;
    }
    if (this.ground2.x <= -this.ground2.displayWidth / 2) {
      this.ground2.x = this.ground1.x + this.ground1.displayWidth;
    }
  }

  public hideGround() {
    if (this.ground1 && this.ground2) {
      this.ground1.setVisible(false);
      this.ground2.setVisible(false);
    }
  }

  public showGround() {
    if (this.ground1 && this.ground2) {
      this.ground1.setVisible(true);
      this.ground2.setVisible(true);
    }
  }
}
