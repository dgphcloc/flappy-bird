"use client";

import MenuLoginScene from "./MenuLoginScene";

export default class LoginScene extends Phaser.Scene {
  private backgroundLogin!: Phaser.GameObjects.Rectangle;
  private backgroundFrame!: Phaser.GameObjects.Image;
  private LoginContainer!: Phaser.GameObjects.Container;
  private spr_btn_x!: Phaser.GameObjects.Sprite;
  private usernameInput!: Phaser.GameObjects.Text;
  private passwordInput!: Phaser.GameObjects.Text;
  private loginButton!: Phaser.GameObjects.Text;
  private usernameText: string = "";
  private passwordText: string = "";
  private isPasswordVisible: boolean = false;
  private readonly MAX_USERNAME_LENGTH = 10;
  private readonly MAX_PASSWORD_LENGTH = 10;
  private usernameContainer!: Phaser.GameObjects.Container;
  private passwordContainer!: Phaser.GameObjects.Container;
  private loginButtonContainer!: Phaser.GameObjects.Container;

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
    this.createIconGG();

    // Thêm các thành phần vào container theo đúng thứ tự layer
    this.LoginContainer.add([
      this.backgroundLogin, // Layer dưới cùng
      this.backgroundFrame, // Layer giữa
      this.usernameContainer, // Layer trên (chứa icon và input)
      this.passwordContainer, // Layer trên (chứa icon và input)
      this.loginButtonContainer, // Layer trên (container chứa nút login)
      this.spr_btn_x, // Layer trên cùng
    ]);

    this.LoginContainer.setPosition(Width * 0.5, Height * 0.58);
    this.LoginContainer.setScale(0.85);

    // Thêm input event listener với kiểm tra null
    if (this.input && this.input.keyboard) {
      this.input.keyboard.on("keydown", this.handleKeyDown, this);
    }
  }

  private createBackground() {
    this.backgroundLogin = this.add.rectangle(0, 0, 700, 700, 0x000000, 0.3);
    this.backgroundLogin.setOrigin(0.5, 0.5);
    this.backgroundLogin.setScale(0.8);
  }

  private createFrame() {
    this.backgroundFrame = this.add.image(0, 0, "background_frame");
    this.backgroundFrame.setOrigin(0.5, 0.5);
    this.backgroundFrame.setScale(1);
  }
  private createIconGG() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;
    const iconGG = this.add.sprite(0, 0, "icon_GG");
    iconGG.setOrigin(0);
    iconGG.setScale(1);
    this.usernameContainer.add(iconGG);
    iconGG.setPosition(-frameWidth / 7, frameHeight * 0.33);
  }

  private createInputFields() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    // Tính toán kích thước input dựa trên frame
    const inputWidth = frameWidth * 0.65;
    const inputHeight = frameHeight * 0.15;
    const inputPadding = inputHeight * 0.3;

    const inputStyle = {
      font: `${Math.floor(inputHeight * 0.5)}px Kavoon`,
      color: "#A67943",
      textAlign: "center",
      fixedWidth: inputWidth,
      fixedHeight: inputHeight,
    };

    // Tạo container cho username input và icon
    this.usernameContainer = this.add.container(0, -frameHeight / 4);
    this.usernameContainer.setPosition(0, -frameHeight / 6.5);

    // Tạo background và border cho input
    const usernameBg = this.add.graphics();
    usernameBg.fillStyle(0xe5decd, 1);
    usernameBg.fillRoundedRect(
      -inputWidth / 2 - inputPadding,
      -inputHeight / 2,
      inputWidth + inputPadding * 2,
      inputHeight,
      inputHeight / 4
    );
    // Thêm border
    usernameBg.lineStyle(3, 0xa67943, 1);
    usernameBg.strokeRoundedRect(
      -inputWidth / 2 - inputPadding,
      -inputHeight / 2,
      inputWidth + inputPadding * 2,
      inputHeight,
      inputHeight / 4
    );
    this.usernameContainer.add(usernameBg);

    // Tạo username input
    this.usernameInput = this.add.text(0, 0, "Name", {
      ...inputStyle,
      backgroundColor: "transparent",
      fixedHeight: inputHeight,
      padding: { x: inputPadding * 2, y: inputHeight * 0.25 },
      color: "#A67943",
    });
    this.usernameInput.setOrigin(0.5, 0.5);
    this.usernameInput.setInteractive({ cursor: "text" });
    this.usernameContainer.add(this.usernameInput);

    // Tạo icon cho username - đặt bên trong input
    const usernameIcon = this.add.image(
      -inputWidth / 2 + inputPadding,
      0,
      "username_icon"
    );
    const iconScale = (inputHeight * 0.8) / usernameIcon.height;
    usernameIcon.setScale(iconScale);
    this.usernameContainer.add(usernameIcon);

    // Thêm sự kiện focus cho username input
    this.usernameInput.on("pointerdown", () => {
      this.activeInput = "username";
      if (this.usernameText === "") {
        this.usernameInput.setText("");
      }
    });

    // Thêm sự kiện blur cho username input
    this.usernameInput.on("blur", () => {
      if (this.usernameText === "") {
        this.usernameInput.setText("Username");
      }
    });

    // Tạo container cho password input và icon
    this.passwordContainer = this.add.container(0, 0);
    this.passwordContainer.setPosition(0, frameHeight / 15);

    // Tạo background và border cho password input
    const passwordBg = this.add.graphics();
    passwordBg.fillStyle(0xe5decd, 1);
    passwordBg.fillRoundedRect(
      -inputWidth / 2 - inputPadding,
      -inputHeight / 2,
      inputWidth + inputPadding * 2,
      inputHeight,
      inputHeight / 4
    );
    // Thêm border
    passwordBg.lineStyle(3, 0xa67943, 1);
    passwordBg.strokeRoundedRect(
      -inputWidth / 2 - inputPadding,
      -inputHeight / 2,
      inputWidth + inputPadding * 2,
      inputHeight,
      inputHeight / 4
    );
    this.passwordContainer.add(passwordBg);

    // Tạo password input
    this.passwordInput = this.add.text(0, 0, "Password", {
      ...inputStyle,
      backgroundColor: "transparent",
      fixedHeight: inputHeight,
      padding: { x: inputPadding * 2, y: inputHeight * 0.3 },
      color: "#A67943",
    });
    this.passwordInput.setOrigin(0.5, 0.5);
    this.passwordInput.setInteractive({ cursor: "text" });
    this.passwordContainer.add(this.passwordInput);

    // Tạo icon cho password - đặt bên trong input
    const passwordIcon = this.add.image(
      -inputWidth / 2 + inputPadding,
      0,
      "password_icon"
    );
    passwordIcon.setScale(iconScale);
    this.passwordContainer.add(passwordIcon);

    // Tạo nút hiển thị/ẩn mật khẩu
    const eyeIcon = this.add.image(
      inputWidth / 2 - inputPadding,
      0,
      "eye_icon" // Bạn cần thêm asset này vào preload
    );
    eyeIcon.setScale(iconScale);
    eyeIcon.setInteractive({ cursor: "pointer" });
    this.passwordContainer.add(eyeIcon);

    // Xử lý sự kiện click cho nút con mắt
    eyeIcon.on("pointerdown", () => {
      this.isPasswordVisible = !this.isPasswordVisible;
      if (this.isPasswordVisible) {
        this.passwordInput.setText(this.passwordText);
        eyeIcon.setTint(0x7d5729); // Đổi màu khi hiển thị mật khẩu
      } else {
        this.passwordInput.setText("*".repeat(this.passwordText.length));
        eyeIcon.clearTint(); // Xóa màu khi ẩn mật khẩu
      }
    });

    // Thêm hover effect cho nút con mắt
    eyeIcon.on("pointerover", () => {
      eyeIcon.setScale(iconScale * 1.1);
    });

    eyeIcon.on("pointerout", () => {
      eyeIcon.setScale(iconScale);
    });

    // Thêm sự kiện focus cho password input
    this.passwordInput.on("pointerdown", () => {
      this.activeInput = "password";
      if (this.passwordText === "") {
        this.passwordInput.setText("");
      }
    });

    // Thêm sự kiện blur cho password input
    this.passwordInput.on("blur", () => {
      if (this.passwordText === "") {
        this.passwordInput.setText("Password");
      }
    });

    // Tạo login button với style mới
    this.loginButtonContainer = this.add.container(0, frameHeight / 4);
    this.loginButtonContainer.setPosition(0, frameHeight / 2);

    // Tính toán kích thước button
    const buttonWidth = inputWidth * 0.4;
    const buttonHeight = inputHeight;

    // Background cho login button
    const loginBg = this.add.graphics();
    loginBg.fillStyle(0x8b4513, 1);
    loginBg.fillRoundedRect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonHeight / 2
    );
    this.loginButtonContainer.add(loginBg);

    // Text cho login button
    this.loginButton = this.add.text(0, 0, "Login", {
      font: `${Math.floor(buttonHeight * 0.6)}px Arial`,
      color: "#ffffff",
      padding: { x: inputPadding, y: inputPadding * 0.3 },
    });
    this.loginButton.setOrigin(0.5);
    this.loginButtonContainer.add(this.loginButton);

    // Làm cho container có thể click
    this.loginButtonContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Thêm hover effect
    this.loginButtonContainer.on("pointerover", () => {
      loginBg.clear();
      loginBg.fillStyle(0x654321, 1);
      loginBg.fillRoundedRect(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        buttonHeight / 2
      );
    });

    this.loginButtonContainer.on("pointerout", () => {
      loginBg.clear();
      loginBg.fillStyle(0x8b4513, 1);
      loginBg.fillRoundedRect(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        buttonHeight / 2
      );
    });

    // Thêm click event
    this.loginButtonContainer.on("pointerdown", () => {
      this.handleLogin(this.usernameText, this.passwordText);
    });
  }

  private activeInput: "username" | "password" | null = null;

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.activeInput) return;

    // Kiểm tra nếu là ký tự tiếng Việt hoặc dấu
    if (
      event.key.match(
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/
      )
    ) {
      return; // Ngăn chặn nhập ký tự tiếng Việt
    }

    if (event.key === "Backspace") {
      if (this.activeInput === "username") {
        this.usernameText = this.usernameText.slice(0, -1);
        this.usernameInput.setText(this.usernameText);
      } else {
        this.passwordText = this.passwordText.slice(0, -1);
        this.passwordInput.setText("*".repeat(this.passwordText.length));
      }
    } else if (event.key === "Enter") {
      this.handleLogin(this.usernameText, this.passwordText);
    } else if (event.key.length === 1) {
      // Chỉ cho phép nhập chữ cái, số và một số ký tự đặc biệt
      if (
        event.key.match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)
      ) {
        if (this.activeInput === "username") {
          if (this.usernameText.length < this.MAX_USERNAME_LENGTH) {
            this.usernameText += event.key;
            this.usernameInput.setText(this.usernameText);
          }
        } else {
          if (this.passwordText.length < this.MAX_PASSWORD_LENGTH) {
            this.passwordText += event.key;
            this.passwordInput.setText("*".repeat(this.passwordText.length));
          }
        }
      }
    }
  }

  private handleLogin(username: string, password: string) {
    console.log("Login attempt:", username, password);

    if (username && password) {
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();
      this.scene.stop("LoginScene");
    } else {
      // Hiển thị thông báo lỗi
      const errorText = this.add.text(
        0,
        this.backgroundFrame.displayHeight / 2,
        "Please enter both username and password",
        { font: "20px Arial", color: "#ff0000" }
      );
      errorText.setOrigin(0.5);

      // Xóa thông báo lỗi sau 2 giây
      this.time.delayedCall(2000, () => {
        errorText.destroy();
      });
    }
  }

  private createButtonX() {
    this.spr_btn_x = this.physics.add.sprite(0, 0, "spr_btn_x", 0);
    this.spr_btn_x.setOrigin(0.5);

    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    const padding = 10;
    this.spr_btn_x.setPosition(
      frameWidth / 2.1 - padding,
      -frameHeight / 2.55 + padding
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
