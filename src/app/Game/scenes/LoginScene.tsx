"use client";

import { cursorTo } from "readline";
import MenuLoginScene from "./MenuLoginScene";

export default class LoginScene extends Phaser.Scene {
  private backgroundLogin!: Phaser.GameObjects.Rectangle;
  private backgroundFrame!: Phaser.GameObjects.Image;
  private LoginContainer!: Phaser.GameObjects.Container;
  private spr_btn_x!: Phaser.GameObjects.Sprite;
  private usernameInput!: Phaser.GameObjects.Text;
  private passwordInput!: Phaser.GameObjects.Text;
  private usernameText: string = "";
  private passwordText: string = "";
  private readonly MAX_USERNAME_LENGTH = 10;
  private readonly MAX_PASSWORD_LENGTH = 10;
  private usernameContainer!: Phaser.GameObjects.Container;
  private passwordContainer!: Phaser.GameObjects.Container;
  private isPasswordVisible: boolean = false;
  private iconGG!: Phaser.GameObjects.Sprite;
  private iconFB!: Phaser.GameObjects.Sprite;
  constructor() {
    super("LoginScene");
  }

  create() {
    const Width = this.scale.width;
    const Height = this.scale.height;

    // Thêm meta viewport để kiểm soát việc zoom và scroll
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(metaViewport);

    // Thêm CSS để ngăn chặn việc scroll khi focus vào input
    const style = document.createElement("style");
    style.textContent = `
      html, body {
        height: 100%;
        overflow: hidden;
        position: fixed;
        width: 100%;
      }
      #username-input-container input,
      #password-input-container input {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
    document.head.appendChild(style);

    // Tạo container và các thành phần khác...
    this.LoginContainer = this.add.container(0, 0);

    // Tạo các thành phần theo thứ tự từ dưới lên
    this.createBackground();
    this.createFrame();
    this.createInputFields();
    this.createButtonX();
    this.createIconGG();
    this.createIconFB();

    // Thêm các thành phần vào container theo đúng thứ tự layer
    this.LoginContainer.add([
      this.backgroundLogin, // Layer dưới cùng
      this.backgroundFrame, // Layer giữa
      this.usernameContainer, // Layer trên (chứa icon và input)
      this.passwordContainer, // Layer trên (chứa icon và input)
      this.spr_btn_x, // Layer trên cùng
      this.iconGG,
      this.iconFB,
    ]);

    this.LoginContainer.setPosition(Width * 0.5, Height * 0.58);
    this.LoginContainer.setScale(0.85);

    // Thêm sự kiện click bên ngoài để tắt bàn phím ảo
    document.addEventListener("click", (event) => {
      const usernameInput = document.querySelector(
        "#username-input-container input"
      ) as HTMLInputElement;
      const passwordInput = document.querySelector(
        "#password-input-container input"
      ) as HTMLInputElement;

      if (usernameInput && !usernameInput.contains(event.target as Node)) {
        usernameInput.blur();
      }
      if (passwordInput && !passwordInput.contains(event.target as Node)) {
        passwordInput.blur();
      }
    });

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
    this.iconGG = this.add.sprite(0, 0, "icon_GG");
    this.iconGG.setOrigin(0);
    this.iconGG.setScale(1.2);
    this.iconGG.setPosition(-frameWidth / 5.5, frameHeight * 0.17);
    this.iconGG.setInteractive({ cursor: "pointer" });
    this.iconGG.on("pointerover", () => {
      this.iconGG.setFrame(1);
    });
    this.iconGG.on("pointerdown", () => {
      this.iconGG.setFrame(2);
    });
    this.iconGG.on("pointerout", () => {
      this.iconGG.setFrame(0);
    });
    this.iconGG.on("pointerup", () => {
      this.iconGG.setFrame(1);
      console.log("click iconGG ");
    });
  }
  private createIconFB() {
    const frameWidth = this.backgroundFrame.width;
    const frameHeight = this.backgroundFrame.height;
    this.iconFB = this.add.sprite(0, 0, "icon_FB");
    this.iconFB.setOrigin(0);
    this.iconFB.setScale(1.2);
    this.iconFB.setPosition(frameWidth / 30, frameHeight * 0.17);
    this.iconFB.setInteractive({ cursor: "pointer" });
    this.iconFB.on("pointerover", () => {
      this.iconFB.setFrame(1);
    });
    this.iconFB.on("pointerdown", () => {
      this.iconFB.setFrame(2);
    });
    this.iconFB.on("pointerout", () => {
      this.iconFB.setFrame(0);
    });
    this.iconFB.on("pointerup", () => {
      this.iconFB.setFrame(1);
      console.log("click iconFB ");
    });
  }

  private createInputFields() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    // Tạo style chung cho input
    const inputStyle = {
      position: "absolute",
      width: `${frameWidth * 0.65}px`,
      height: `${frameHeight * 0.15}px`,
      fontSize: `${Math.floor(frameHeight * 0.15 * 0.4)}px`,
      fontFamily: "Kavoon",
      color: "#A67943",
      textAlign: "center",
      backgroundColor: "#e5decd",
      border: "3px solid #A67943",
      borderRadius: `${(frameHeight * 0.15) / 4}px`,
      padding: `0 ${frameHeight * 0.15 * 0.2}px`,
      outline: "none",
    };

    // Tạo container cho username input và icon
    this.usernameContainer = this.add.container(0, -frameHeight / 6.5);

    // Tạo HTML input cho username
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "Username";
    usernameInput.setAttribute("autocomplete", "off");
    usernameInput.setAttribute("autocorrect", "off");
    usernameInput.setAttribute("autocapitalize", "off");
    usernameInput.setAttribute("spellcheck", "false");
    Object.assign(usernameInput.style, inputStyle);

    // Tạo DOM element container
    const domContainer = document.createElement("div");
    domContainer.id = "username-input-container";
    domContainer.style.position = "absolute";
    domContainer.style.width = `${frameWidth * 0.65}px`;
    domContainer.style.height = `${frameHeight * 0.15}px`;
    domContainer.appendChild(usernameInput);

    // Thêm DOM container vào game canvas
    const domElement = this.add.dom(0, 0, domContainer);
    domElement.setOrigin(0.5, 0.5);

    // Tạo icon cho username
    const usernameIcon = this.add.image(
      -frameWidth * 0.325 + frameHeight * 0.15 * 0.2,
      0,
      "username_icon"
    );
    const iconScale = (frameHeight * 0.15 * 0.8) / usernameIcon.height;
    usernameIcon.setScale(iconScale);

    // Thêm icon và DOM element vào container
    this.usernameContainer.add([usernameIcon, domElement]);

    // Thêm event listeners cho input
    usernameInput.addEventListener("focus", () => {
      if (usernameInput.value === "") {
        usernameInput.placeholder = "";
      }
    });

    usernameInput.addEventListener("blur", () => {
      if (usernameInput.value === "") {
        usernameInput.placeholder = "Username";
      }
    });

    usernameInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length <= this.MAX_USERNAME_LENGTH) {
        this.usernameText = target.value;
      }
    });

    // Thêm container vào LoginContainer chính
    this.LoginContainer.add(this.usernameContainer);

    // Tạo container cho password input và icon
    this.passwordContainer = this.add.container(0, frameHeight / 15);

    // Tạo HTML input cho password
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    Object.assign(passwordInput.style, inputStyle);

    // Tạo DOM element container cho password
    const passwordDomContainer = document.createElement("div");
    passwordDomContainer.id = "password-input-container";
    passwordDomContainer.style.position = "absolute";
    passwordDomContainer.style.width = `${frameWidth * 0.65}px`;
    passwordDomContainer.style.height = `${frameHeight * 0.15}px`;
    passwordDomContainer.appendChild(passwordInput);

    // Thêm DOM container vào game canvas
    const passwordDomElement = this.add.dom(0, 0, passwordDomContainer);
    passwordDomElement.setOrigin(0.5, 0.5);

    // Tạo icon cho password
    const passwordIcon = this.add.image(
      -frameWidth * 0.325 + frameHeight * 0.15 * 0.2,
      0,
      "password_icon"
    );
    passwordIcon.setScale(iconScale);

    // Thêm icon và DOM element vào container
    this.passwordContainer.add([passwordIcon, passwordDomElement]);

    // Thêm event listeners cho password input
    passwordInput.addEventListener("focus", () => {
      if (passwordInput.value === "") {
        passwordInput.placeholder = "";
      }
    });

    passwordInput.addEventListener("blur", () => {
      if (passwordInput.value === "") {
        passwordInput.placeholder = "Password";
      }
    });

    passwordInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value.length <= this.MAX_PASSWORD_LENGTH) {
        this.passwordText = target.value;
      }
    });

    // Thêm container vào LoginContainer chính
    this.LoginContainer.add(this.passwordContainer);
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
