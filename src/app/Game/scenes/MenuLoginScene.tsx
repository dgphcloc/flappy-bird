"use client";

import { Switch } from "@mantine/core";
import { Scale } from "phaser";

export default class MenuLoginScene extends Phaser.Scene {
  private birdMainBG!: Phaser.GameObjects.Sprite;
  private TextTitle!: Phaser.GameObjects.Image;
  private ContainerMenu!: Phaser.GameObjects.Container;
  private birdImageContainer!: Phaser.GameObjects.Container;
  private backgroundContainer!: Phaser.GameObjects.Rectangle;
  private backgroundMenu!: Phaser.GameObjects.Rectangle;
  private isLoggedIn: boolean = false;
  constructor() {
    super("MenuLoginScene");
  }

  // Thêm phương thức public để hiển thị lại menu
  public showMenu() {
    if (this.ContainerMenu) {
      this.ContainerMenu.setVisible(true);
      this.tweens.add({
        targets: this.ContainerMenu,
        x: this.scale.width * 0.5,
        duration: 500,
        ease: "Power2",
      });
    }
  }

  create() {
    const ScaleWidth = this.scale.width;
    const ScaleHeight = this.scale.height;
    if (!this.scene.isActive("BackgroundScene")) {
      this.scene.launch("BackgroundScene");
    }
    // if (!this.scene.isActive("LoginScene")) {
    //   this.scene.launch("LoginScene");
    // }
    this.backgroundMenu = this.add.rectangle(
      0,
      0,
      ScaleWidth,
      ScaleHeight / 3,
      0x530000,
      0.5
    );
    this.backgroundMenu.setOrigin(0, 0);
    this.ContainerMenu = this.add.container(ScaleWidth, ScaleHeight);
    const buttonConfig = [
      { name: "login", frameIndex: 0, alwaysShow: false },
      { name: "play", frameIndex: 4, alwaysShow: false },
      { name: "birdSkins", frameIndex: 1, alwaysShow: false },
      { name: "topPlayer", frameIndex: 2, alwaysShow: true },
      { name: "settings", frameIndex: 3, alwaysShow: true },
    ];
    const visibleButtons = buttonConfig.filter((btn, index) => {
      if (this.isLoggedIn) {
        return (
          btn.alwaysShow || btn.name === "play" || btn.name === "birdSkins"
        );
      } else {
        return btn.alwaysShow || btn.name === "login";
      }
    });

    const RenderButtons = () => {
      visibleButtons.forEach((btn, index) => {
        const button = this.add.sprite(
          0,
          index * 85,
          "button_menu",
          btn.frameIndex * 3
        );
        button.setScale(0.8);
        button.setOrigin(0.5, 0.5);
        button.setInteractive();

        // Hover & Click
        button.on("pointerover", () => button.setFrame(btn.frameIndex * 3 + 1));
        button.on("pointerout", () => button.setFrame(btn.frameIndex * 3));
        button.on("pointerdown", () => {
          button.setFrame(btn.frameIndex * 3 + 2);
          handleButtonClick(btn.name);
        });

        this.ContainerMenu.add([this.backgroundMenu, button]);
      });
    };
    RenderButtons();

    const updatePositionMenu = (buttonSize: number) => {
      switch (buttonSize) {
        case 3:
          this.ContainerMenu.setPosition(ScaleWidth * 0.5, ScaleHeight * 0.45);
          break;
        case 4:
          this.ContainerMenu.setPosition(ScaleWidth * 0.5, ScaleHeight * 0.38);
          break;
        default:
          this.ContainerMenu.setPosition(ScaleWidth * 0.5, ScaleHeight * 0.38);
          break;
      }
    };
    updatePositionMenu(visibleButtons.length);

    const handleButtonClick = (name: string) => {
      console.log(`${name} button clicked`);
      switch (name) {
        case "login":
          if (this.isLoggedIn === false) {
            // this.ContainerMenu.setVisible(false);
            // Di chuyển containerMenu sang bên trái
            this.tweens.add({
              targets: this.ContainerMenu,
              // Giả sử bạn muốn di chuyển containerMenu ra khỏi màn hình,
              // hãy lấy vị trí x hiện tại và giảm nó xuống một giá trị đủ lớn (ví dụ: -this.scale.width)
              x: -this.scale.width,
              duration: 500, // thời gian di chuyển 500ms (có thể điều chỉnh)
              ease: "Power2",
              onComplete: () => {
                // Sau khi hoàn tất chuyển động, ẩn containerMenu
                this.ContainerMenu.setVisible(false);

                this.scene.launch("LoginScene");
                // Hiện ContainerLogin (Form đăng nhập) hoặc thực hiện các hành động tiếp theo
                // this.ContainerMenu.setVisible(true);
              },
            });
          }
      }

      if (name === "Login") {
        this.isLoggedIn = true; // Giả lập đăng nhập
        this.scene.restart(); // Tải lại scene để cập nhật nút
      }
    };

    this.birdImageContainer = this.add.container(0, 0);
    this.backgroundContainer = this.add.rectangle(
      ScaleWidth / 2,
      ScaleHeight / 6,
      ScaleWidth,
      ScaleHeight / 3,
      0x000000,
      0.2
    );
    this.backgroundContainer.setOrigin(0.5, 0.5);

    this.TextTitle = this.add.image(
      ScaleWidth * 0.5,
      ScaleHeight * 0.15,
      "TextTitle"
    );
    this.birdMainBG = this.physics.add.sprite(
      this.TextTitle.x * 0.75,
      this.TextTitle.y * 1.37,
      "bird1_spr"
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
      const scalex = width / this.TextTitle.width;
      const scaley = height / this.TextTitle.height;
      const scaleTextTitle = Math.min(scalex, scaley);
      this.TextTitle.setScale(scaleTextTitle);
    };
    this.birdImageContainer.add([
      this.TextTitle,
      this.birdMainBG,
      this.backgroundContainer,
    ]);
    // cách 1 thay đổi vị trí lớp
    // this.birdMainBG.setDepth(1);
    // this.TextTitle.setDepth(2);
    // this.backgroundContainer.setDepth(3);
    // cách 2
    this.birdImageContainer.moveTo(this.TextTitle, 2);
    this.birdImageContainer.moveTo(this.birdMainBG, 1);

    const updateScalebrid1_bg = (width: number, height: number) => {
      const scalex = (width * 0.4) / this.birdMainBG.width;
      const scaley = height / this.birdMainBG.height;
      const scalebrid1_bg = Math.min(scalex, scaley);
      this.birdMainBG.setScale(scalebrid1_bg);
      this.birdMainBG.setPosition(
        this.TextTitle.x * 0.75,
        this.TextTitle.y * 1.45
      );
    };
    // this.tweens.add({
    //   targets: this.birdMainBG,
    //   y: this.birdMainBG.y - 1,
    //   duration: 800,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: "Sine.easeInOut",
    // });
    // this.tweens.add({
    //   targets: this.TextTitle,
    //   y: this.TextTitle.y - 1,
    //   duration: 800, // Thời gian di chuyển (ms)
    //   yoyo: true, // Quay lại vị trí ban đầu
    //   repeat: -1,
    //   ease: "Sine.easeInOut", // Làm mềm chuyển động
    // });

    // this.ContainerMenu.setVisible(false);

    const updateContainer = () => {
      this.birdImageContainer.setPosition(0, 0);
    };
    updateScaleTextTitle(ScaleWidth, ScaleHeight);
    updateScalebrid1_bg(ScaleWidth, ScaleHeight);
    updateContainer();
    this.scale.on("resize", (gameSize: { width: number; height: number }) => {
      updateContainer();
      this.cameras.main.setSize(gameSize.width, gameSize.height);
      updateScaleTextTitle(gameSize.width, gameSize.height);
      updateScalebrid1_bg(gameSize.width, gameSize.height);
    });

    this.birdMainBG.play("flappy");
  }
}
