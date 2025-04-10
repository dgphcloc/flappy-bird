"use client";

export default class MenuLoginScene extends Phaser.Scene {
  // Game objects
  private birdMainBG!: Phaser.GameObjects.Sprite;
  private TextTitle!: Phaser.GameObjects.Image;
  private ContainerMenu!: Phaser.GameObjects.Container;
  private birdImageContainer!: Phaser.GameObjects.Container;
  private backgroundContainer!: Phaser.GameObjects.Rectangle;
  private backgroundMenu!: Phaser.GameObjects.Rectangle;

  // State
  private isLoggedIn: boolean = false;
  private buttonConfig: any[] = [
    { name: "login", frameIndex: 0, alwaysShow: false },
    { name: "play", frameIndex: 4, alwaysShow: false },
    { name: "birdSkins", frameIndex: 1, alwaysShow: false },
    { name: "topPlayer", frameIndex: 2, alwaysShow: true },
    { name: "settings", frameIndex: 3, alwaysShow: true },
  ];

  constructor() {
    super("MenuLoginScene");
  }

  // Public methods
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

  // Scene lifecycle methods
  create() {
    const ScaleWidth = this.scale.width;
    const ScaleHeight = this.scale.height;

    // Launch required scenes
    this.launchRequiredScenes();

    // Create UI elements
    // this.createBackgroundMenu(ScaleWidth, ScaleHeight);
    this.createMenuContainer(ScaleWidth, ScaleHeight);
    this.createMenuButtons();
    this.createBirdImageContainer(ScaleWidth, ScaleHeight);

    // Set up event listeners
    this.setupResizeListener(ScaleWidth, ScaleHeight);

    // Start bird animation
    this.birdMainBG.play("flappy");
  }

  // Private helper methods
  private launchRequiredScenes() {
    if (!this.scene.isActive("BackgroundScene")) {
      this.scene.launch("BackgroundScene");
    }
    if (!this.scene.isActive("LoginScene")) {
      this.scene.launch("LoginScene");
    }
  }

  // private createBackgroundMenu(width: number, height: number) {
  //   this.backgroundMenu = this.add.rectangle(
  //     0,
  //     0,
  //     width,
  //     height / 3,
  //     0x530000,
  //     0
  //   );
  //   this.backgroundMenu.setOrigin(0, 0);
  // }

  private createMenuContainer(width: number, height: number) {
    this.ContainerMenu = this.add.container(width, height);
    // this.ContainerMenu.setScale(1);
    this.ContainerMenu.setVisible(false);
  }

  private createMenuButtons() {
    const visibleButtons = this.getVisibleButtons(this.buttonConfig);
    this.renderButtons(visibleButtons);
    this.updateMenuPosition(visibleButtons.length);
  }

  private getVisibleButtons(buttonConfig: any[]) {
    return buttonConfig.filter((btn) => {
      if (this.isLoggedIn) {
        return (
          btn.alwaysShow || btn.name === "play" || btn.name === "birdSkins"
        );
      } else {
        return btn.alwaysShow || btn.name === "login";
      }
    });
  }

  private renderButtons(visibleButtons: any[]) {
    visibleButtons.forEach((btn, index) => {
      const spacing = this.scale.height * 0.11;
      const button = this.add.sprite(
        0,
        index * spacing,
        "button_menu",
        btn.frameIndex * 3
      );

      this.setupButtonProperties(button, btn);
      this.ContainerMenu.add(button);
    });
  }

  private setupButtonProperties(button: Phaser.GameObjects.Sprite, btn: any) {
    // Sử dụng kích thước màn hình để tính scale
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const buttonWidth = button.width;
    const buttonHeight = button.height;

    // Tính scale dựa trên kích thước màn hình
    const scaleX = screenWidth / buttonWidth;
    const scaleY = screenHeight / buttonHeight;
    const scale = Math.min(scaleX, scaleY);

    button.setScale(scale * 0.57);
    button.setOrigin(0.5, 0.5);
    button.setInteractive();

    button.on("pointerover", () => button.setFrame(btn.frameIndex * 3 + 1));
    button.on("pointerout", () => button.setFrame(btn.frameIndex * 3));
    button.on("pointerdown", () => {
      button.setFrame(btn.frameIndex * 3 + 2);
      this.handleButtonClick(btn.name);
    });
  }

  private updateMenuPosition(buttonCount: number) {
    const ScaleWidth = this.scale.width;
    const ScaleHeight = this.scale.height;

    switch (buttonCount) {
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
  }

  private handleButtonClick(name: string) {
    console.log(`${name} button clicked`);

    if (name === "login" && !this.isLoggedIn) {
      this.tweens.add({
        targets: this.ContainerMenu,
        x: -this.scale.width,
        duration: 500,
        ease: "Power2",
        onComplete: () => {
          this.ContainerMenu.setVisible(false);
          this.scene.launch("LoginScene");
        },
      });
    }

    if (name === "Login") {
      this.isLoggedIn = true;
      this.scene.restart();
    }
  }

  private createBirdImageContainer(width: number, height: number) {
    this.birdImageContainer = this.add.container(0, 0);

    // Create background
    this.backgroundContainer = this.add.rectangle(
      width / 2,
      height / 6,
      width,
      height / 3,
      0x000000,
      0
    );
    this.backgroundContainer.setOrigin(0.5, 0.5);

    // Create title
    this.TextTitle = this.add.image(width * 0.5, height * 0.15, "TextTitle");

    // Create bird
    this.birdMainBG = this.physics.add.sprite(
      this.TextTitle.x * 0.75,
      this.TextTitle.y * 1.37,
      "bird1_spr"
    );

    // Create bird animation
    this.createBirdAnimation();

    // Add elements to container
    this.birdImageContainer.add([
      this.TextTitle,
      this.birdMainBG,
      this.backgroundContainer,
    ]);

    // Set layer order
    this.birdImageContainer.moveTo(this.TextTitle, 2);
    this.birdImageContainer.moveTo(this.birdMainBG, 1);

    // Update scales
    this.updateTitleScale(width, height);
    this.updateBirdScale(width, height);
  }

  private createBirdAnimation() {
    this.anims.create({
      key: "flappy",
      frames: this.anims.generateFrameNumbers("bird1_spr", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  private updateTitleScale(width: number, height: number) {
    const scalex = width / this.TextTitle.width;
    const scaley = height / this.TextTitle.height;
    const scaleTextTitle = Math.min(scalex, scaley);
    this.TextTitle.setScale(scaleTextTitle);
  }

  private updateBirdScale(width: number, height: number) {
    const scalex = (width * 0.4) / this.birdMainBG.width;
    const scaley = height / this.birdMainBG.height;
    const scalebrid1_bg = Math.min(scalex, scaley);
    this.birdMainBG.setScale(scalebrid1_bg);
    this.birdMainBG.setPosition(
      this.TextTitle.x * 0.75,
      this.TextTitle.y * 1.45
    );
  }

  private setupResizeListener(width: number, height: number) {
    this.scale.on("resize", (gameSize: { width: number; height: number }) => {
      this.birdImageContainer.setPosition(0, 0);
      this.cameras.main.setSize(gameSize.width, gameSize.height);
      this.updateTitleScale(gameSize.width, gameSize.height);
      this.updateBirdScale(gameSize.width, gameSize.height);

      // Thêm xử lý resize cho buttons
      this.updateButtonScales(gameSize.width, gameSize.height);
      this.updateMenuPosition(this.getVisibleButtons(this.buttonConfig).length);
    });
  }

  private updateButtonScales(width: number, height: number) {
    // Lặp qua tất cả các button trong ContainerMenu và cập nhật scale
    this.ContainerMenu.list.forEach((item: any) => {
      if (item instanceof Phaser.GameObjects.Sprite) {
        const buttonWidth = item.width;
        const buttonHeight = item.height;
        const scaleX = width / buttonWidth;
        const scaleY = height / buttonHeight;
        const scale = Math.min(scaleX, scaleY);
        item.setScale(scale * 0.57);
      }
    });
  }
}
