"use client";

import MenuLoginScene from "./MenuLoginScene";

export default class LoginScene extends Phaser.Scene {
  private backgroundLogin!: Phaser.GameObjects.Rectangle;
  private backgroundFrame!: Phaser.GameObjects.Image;
  private LoginContainer!: Phaser.GameObjects.Container;
  private spr_btn_x!: Phaser.GameObjects.Sprite;
  private usernameInput!: Phaser.GameObjects.DOMElement;
  private passwordInput!: Phaser.GameObjects.DOMElement;
  private loginButtonElement!: Phaser.GameObjects.DOMElement;

  constructor() {
    super("LoginScene");
  }

  create() {
    const Width = this.scale.width;
    const Height = this.scale.height;

    // Tạo container và các thành phần khác...
    this.LoginContainer = this.add.container(0, 0);

    // Tạo các thành phần theo thứ tự từ dưới lên
    this.createBackground();
    this.createFrame();
    this.createInputFields();
    this.createButtonX();

    // Thêm các thành phần vào container theo đúng thứ tự layer
    this.LoginContainer.add([
      this.backgroundLogin, // Layer dưới cùng
      this.backgroundFrame, // Layer giữa
      this.usernameInput, // Layer trên
      this.passwordInput, // Layer trên
      this.loginButtonElement, // Layer trên
      this.spr_btn_x, // Layer trên cùng
    ]);

    this.LoginContainer.setPosition(Width * 0.5, Height * 0.58);
    this.LoginContainer.setScale(0.8);
  }

  private createBackground() {
    this.backgroundLogin = this.add.rectangle(0, 0, 700, 700, 0x000000, 0.3);
    this.backgroundLogin.setOrigin(0.5);
    this.backgroundLogin.setScale(0.5);
  }

  private createFrame() {
    this.backgroundFrame = this.add.image(0, 0, "background_frame");
    this.backgroundFrame.setOrigin(0.5);
    this.backgroundFrame.setScale(0.9);
  }

  private createInputFields() {
    // Tạo style cho input
    const inputStyle = `
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #4a90e2;
      border-radius: 10px;
      padding: 10px;
      width: 200px;
      color: #333;
      font-size: 16px;
      outline: none;
      text-align: center;
      z-index: 1;
    `;

    // Tạo input username
    const usernameElement = document.createElement("input");
    usernameElement.setAttribute("type", "text");
    usernameElement.setAttribute("placeholder", "Username");
    usernameElement.style.cssText = inputStyle;

    // Tạo input password
    const passwordElement = document.createElement("input");
    passwordElement.setAttribute("type", "password");
    passwordElement.setAttribute("placeholder", "Password");
    passwordElement.style.cssText = inputStyle;

    // Tạo nút Login
    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.style.cssText = `
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 30px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
      z-index: 1;
    `;

    // Lấy kích thước của frame để định vị các elements
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    // Đặt vị trí các input ở giữa frame
    this.usernameInput = this.add.dom(0, -frameHeight / 6, usernameElement);
    this.passwordInput = this.add.dom(0, 0, passwordElement);
    this.loginButtonElement = this.add.dom(0, frameHeight / 6, loginButton);

    this.loginButtonElement.addListener("click");
    this.loginButtonElement.on("click", () => {
      const username = (this.usernameInput.node as HTMLInputElement).value;
      const password = (this.passwordInput.node as HTMLInputElement).value;
      this.handleLogin(username, password);
    });
  }

  private handleLogin(username: string, password: string) {
    // Thêm logic xử lý đăng nhập ở đây
    console.log("Login attempt:", username, password);

    // Ví dụ kiểm tra đăng nhập đơn giản
    if (username && password) {
      // Gọi API hoặc xử lý đăng nhập

      // Nếu đăng nhập thành công
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();
      this.scene.stop("LoginScene");
    } else {
      // Hiển thị thông báo lỗi
      alert("Please enter both username and password");
    }
  }

  private createButtonX() {
    this.spr_btn_x = this.physics.add.sprite(0, 0, "spr_btn_x", 0);
    this.spr_btn_x.setOrigin(0.5);

    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    const padding = 10;
    this.spr_btn_x.setPosition(
      frameWidth / 2 - padding,
      -frameHeight / 2.3 + padding
    );
    this.spr_btn_x.setScale(0.7);

    // Thêm tương tác cho nút
    this.spr_btn_x.setInteractive({ cursor: "pointer" });

    // Xử lý hover
    this.spr_btn_x.on("pointerover", () => {
      this.spr_btn_x.setFrame(1); // Frame hover
    });

    this.spr_btn_x.on("pointerout", () => {
      this.spr_btn_x.setFrame(0); // Frame bình thường
    });

    // Xử lý click
    this.spr_btn_x.on("pointerdown", () => {
      this.spr_btn_x.setFrame(2); // Frame click
    });

    this.spr_btn_x.on("pointerup", () => {
      this.spr_btn_x.setFrame(1); // Trở về frame hover khi đang hover

      // Lấy reference đến MenuLoginScene và gọi phương thức showMenu
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();

      // Tắt scene login
      this.scene.stop("LoginScene");
    });
  }
}
