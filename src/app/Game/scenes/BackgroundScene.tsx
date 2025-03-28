"use client";

export default class BackgroundScene extends Phaser.Scene {
  rope: any;
  private bg1!: Phaser.GameObjects.TileSprite;
  private bg2!: Phaser.GameObjects.TileSprite;
  constructor() {
    super("BackgroundScene");
  }
  create() {
    this.bg1 = this.add
      .tileSprite(0, 0, 1080, 1920, "background")
      .setOrigin(0, 0); // Đặt từ góc trái

    this.bg2 = this.add
      .tileSprite(this.scale.width, 0, 1080, 1920, "background")
      .setOrigin(0, 0)
      .setFlipX(true);

    // const sizeWidth = this.scale.width;
    // const sizeHeight = this.scale.height;
    // const updatebg = (width: number, height: number) => {
    //   const scalex = width / this.bg1.width;
    //   const scaley = height / this.bg1.height;
    //   const scalebg1 = Math.min(scalex, scaley);
    //   this.bg1.setScale(scalebg1);
    //   this.bg2.setScale(scalebg1);
    // };

    const scaleX = this.scale.width / 1080;
    const scaleY = this.scale.height / 1920;
    const scale = Math.min(scaleX, scaleY); // Chọn scale lớn nhất để ảnh luôn full màn hình

    this.bg1.setScale(scale); // Scale ảnh
    const scaleX1 = this.scale.width / 1080;
    const scaleY1 = this.scale.height / 1920;
    const scale1 = Math.min(scaleX1, scaleY1); // Chọn scale lớn nhất để ảnh luôn full màn hình

    this.bg2.setScale(scale1); // Scale ảnh
    // this.bg1.setPosition(this.scale.width / 2, this.scale.height / 2); // Căn giữa

    // updatebg(sizeWidth, sizeHeight);
    // console.log(sizeHeight, sizeWidth);
    // // Xử lý khi màn hình thay đổi
    // this.scale.on("resize", (gameSize: { width: number; height: number }) => {
    //   updatebg(
    //     this.game.config.width as number,
    //     this.game.config.width as number
    //   );
    //   this.bg1.setSize(gameSize.width, gameSize.height);
    //   this.bg2.setSize(gameSize.width, gameSize.height);
    //   // this.bg1.setPosition(0, 0);
    //   // this.bg2.setPosition(gameSize.width, 0);
    // });
  }
  update() {
    this.bg1.x -= 2;
    this.bg2.x -= 2;

    // Nếu `bg1` ra khỏi màn hình, chuyển nó sang phải nối tiếp `bg2`
    if (this.bg1.x <= -this.scale.width) {
      this.bg1.x = this.bg2.x + this.scale.width;
    }

    // Nếu `bg2` ra khỏi màn hình, chuyển nó sang phải nối tiếp `bg1`
    if (this.bg2.x <= -this.scale.width) {
      this.bg2.x = this.bg1.x + this.scale.width;
    }
  }
}
