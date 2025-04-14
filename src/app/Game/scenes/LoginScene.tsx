"use client";
import MenuLoginScene from "./MenuLoginScene";
import RegisterScene from "./RegisterScene";
import {
  VIETNAMESE_CHARS_REGEX,
  VIETNAMESE_AND_SPACE_REGEX,
  ALLOWED_CHARS_REGEX,
} from "../constants/regexPatterns";
import { createInputHandlers } from "../constants/inputUtils";
import { ErrorCodes, ErrorMessages } from "@/app/shared/errorMessages";

export default class LoginScene extends Phaser.Scene {
  private backgroundFrame!: Phaser.GameObjects.Image;
  private LoginContainer!: Phaser.GameObjects.Container;
  private spr_btn_x!: Phaser.GameObjects.Sprite;
  private usernameText: string = "";
  private passwordText: string = "";
  private readonly MAX_USERNAME_LENGTH = 15;
  private readonly MAX_PASSWORD_LENGTH = 10;
  private usernameContainer!: Phaser.GameObjects.Container;
  private passwordContainer!: Phaser.GameObjects.Container;
  private iconGG!: Phaser.GameObjects.Sprite;
  private iconFB!: Phaser.GameObjects.Sprite;
  private btnSignUp!: Phaser.GameObjects.Sprite;
  private btnLogin!: Phaser.GameObjects.Sprite;
  private errorText: Phaser.GameObjects.Text | null = null;
  private successText: Phaser.GameObjects.Text | null = null;
  private loadingText: Phaser.GameObjects.Text | null = null;
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

    this.LoginContainer = this.add.container(0, 0);
    this.LoginContainer.setVisible(false);
    this.createFrame();
    this.createInputFields();
    this.createButtonX();
    this.createIconGG();
    this.createIconFB();
    this.createButtonSignUp();
    this.createButtonLogin();
    this.LoginContainer.add([
      this.backgroundFrame,
      this.usernameContainer,
      this.passwordContainer,
      this.spr_btn_x,
      this.iconGG,
      this.iconFB,
      this.btnSignUp,
      this.btnLogin,
    ]);
    this.LoginContainer.setPosition(Width * 0.5, Height * 0.58);
    this.toggleInputsAndIcons(false);

    this.LoginContainer.setScale(this.scaleLoginContainer());
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

  public toggleInputsAndIcons(show: boolean) {
    const usernameInput = document.querySelector(
      "#username-input-container input"
    ) as HTMLInputElement;
    const passwordInput = document.querySelector(
      "#password-input-container input"
    ) as HTMLInputElement;
    const usernameIcon = document.querySelector(
      "#username-input-container .icon-img"
    ) as HTMLImageElement;
    const passwordIcon = document.querySelector(
      "#password-input-container .icon-img"
    ) as HTMLImageElement;

    const displayValue = show ? "block" : "none";

    [usernameInput, passwordInput, usernameIcon, passwordIcon].forEach(
      (element) => {
        if (element) {
          element.style.display = displayValue;
          if (element instanceof HTMLInputElement) {
            element.blur();
          }
        }
      }
    );
    this.iconFB.setVisible(show);
    this.iconGG.setVisible(show);
    this.btnSignUp.setVisible(show);
    this.btnLogin.setVisible(show);
  }

  public showLoginContainer() {
    this.LoginContainer.setVisible(true);
    this.LoginContainer.setScale(0.1);
    this.LoginContainer.setAlpha(0);
    this.toggleInputsAndIcons(false);

    this.tweens.add({
      targets: this.LoginContainer,
      x: this.scale.width * 0.5,
      scale: this.scaleLoginContainer(),
      alpha: 1,
      duration: 700,
      ease: "Cubic.easeOut",
      delay: 200,
      onComplete: () => {
        this.toggleInputsAndIcons(true);
      },
    });
  }
  private scaleLoginContainer() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;
    const scaleX = screenWidth / frameWidth;
    const scaleY = screenHeight / frameHeight;
    const scale = Math.min(scaleX, scaleY);
    return scale * 0.7;
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
    this.iconGG.setOrigin(0.5);
    this.iconGG.setScale(1.2);
    this.iconGG.setPosition(-frameWidth / 9, frameHeight * 0.27);
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
    this.iconFB.setOrigin(0.5);
    this.iconFB.setScale(1.2);
    this.iconFB.setPosition(frameWidth / 9, frameHeight * 0.27);
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

  private createButtonSignUp() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;
    this.btnSignUp = this.add.sprite(0, 0, "btn_sigUp");
    this.btnSignUp.setOrigin(0.5);
    this.btnSignUp.setScale(1);
    this.btnSignUp.setPosition(-frameWidth * 0.2, frameHeight * 0.47);
    this.btnSignUp.setInteractive({ cursor: "pointer" });
    this.btnSignUp.on("pointerover", () => {
      this.btnSignUp.setFrame(1);
    });
    this.btnSignUp.on("pointerdown", () => {
      this.btnSignUp.setFrame(2);
    });
    this.btnSignUp.on("pointerout", () => {
      this.btnSignUp.setFrame(0);
    });
    this.btnSignUp.on("pointerup", () => {
      this.btnSignUp.setFrame(1);
      this.toggleInputsAndIcons(false);
      this.LoginContainer.setVisible(false);
      const registerScene = this.scene.get("RegisterScene") as RegisterScene;
      registerScene.showRegisterContainer();
    });
  }

  private createButtonLogin() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;
    this.btnLogin = this.add.sprite(0, 0, "btn_Login");
    this.btnLogin.setOrigin(0.5);
    this.btnLogin.setScale(1);
    this.btnLogin.setPosition(frameWidth * 0.2, frameHeight * 0.47);
    this.btnLogin.setInteractive({ cursor: "pointer" });
    this.btnLogin.on("pointerover", () => {
      this.btnLogin.setFrame(1);
    });
    this.btnLogin.on("pointerdown", () => {
      this.btnLogin.setFrame(2);
    });
    this.btnLogin.on("pointerout", () => {
      this.btnLogin.setFrame(0);
    });
    this.btnLogin.on("pointerup", () => {
      this.btnLogin.setFrame(1);
      this.handleLogin();
    });
  }

  private createInputFields() {
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;

    // Tạo style chung cho input
    const widthInput = frameWidth * 0.7;
    const heightInput = frameHeight * 0.17;
    const paddingInput = frameHeight * 0.13;
    const inputStyle = {
      position: "absolute",
      width: `${widthInput}px`,
      height: `${heightInput}px`,
      fontSize: `${Math.floor(frameHeight * 0.13 * 0.4)}px`,
      fontFamily: "Kavoon",
      color: "#A67943",
      backgroundColor: "#e5decd",
      border: "3px solid #A67943",
      borderRadius: `${(frameHeight * 0.15) / 4}px`,
      padding: `0 1px 0 2px`,
      outline: "none",
    };

    // Thêm CSS để ngăn chặn Google autofill thay đổi style
    const autofillStyle = document.createElement("style");
    autofillStyle.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #e5decd inset !important;
        -webkit-text-fill-color: #A67943 !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(autofillStyle);

    // Tạo container cho username input và icon
    this.usernameContainer = this.add.container(0, -frameHeight / 6.5);
    this.usernameContainer.setDepth(3);

    // Tạo HTML input cho username
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "Username";
    usernameInput.maxLength = this.MAX_USERNAME_LENGTH;
    usernameInput.setAttribute("autocomplete", "off");
    usernameInput.setAttribute("autocorrect", "off");
    usernameInput.setAttribute("autocapitalize", "off");
    usernameInput.setAttribute("spellcheck", "false");
    usernameInput.setAttribute("data-form-type", "other");
    Object.assign(usernameInput.style, inputStyle);

    // Tạo DOM element container
    const domContainer = document.createElement("div");
    domContainer.id = "username-input-container";
    domContainer.style.position = "absolute";
    domContainer.style.width = `${widthInput}px`;
    domContainer.style.height = `${heightInput}px`;
    domContainer.style.zIndex = "1";
    // Thêm DOM container vào game canvas

    // Tạo icon bằng img element
    const iconImg = document.createElement("img");
    iconImg.className = "icon-img";
    iconImg.src = "asset/iconUser.png";
    iconImg.style.position = "absolute";
    iconImg.style.left = "10px";
    iconImg.style.top = "50%";
    iconImg.style.transform = "translateY(-50%)";
    iconImg.style.height = "60%";
    iconImg.style.width = "auto";
    iconImg.style.zIndex = "2";

    // Điều chỉnh padding cho input để tránh chồng lên icon
    usernameInput.style.paddingLeft = `${paddingInput}px`;
    domContainer.appendChild(iconImg);
    domContainer.appendChild(usernameInput);
    const domElement = this.add.dom(0, 0, domContainer);
    domElement.setOrigin(0.5, 0.5);
    domElement.setDepth(5);

    this.usernameContainer.add([domElement]);

    // Thêm event listeners cho input
    createInputHandlers(
      usernameInput,
      () => {
        this.activeInput = "username";
      },
      () => {
        this.activeInput = null;
      },
      (value) => {
        this.usernameText = value;
      },
      this.MAX_USERNAME_LENGTH
    );
    // Thêm container vào LoginContainer chính
    this.LoginContainer.add(this.usernameContainer);

    // Tạo container cho password input và icon
    this.passwordContainer = this.add.container(0, frameHeight / 15);

    // Tạo HTML input cho password
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.maxLength = this.MAX_PASSWORD_LENGTH;
    passwordInput.setAttribute("autocomplete", "new-password");
    passwordInput.setAttribute("autocorrect", "off");
    passwordInput.setAttribute("autocapitalize", "off");
    passwordInput.setAttribute("spellcheck", "false");
    passwordInput.setAttribute("data-form-type", "other");
    Object.assign(passwordInput.style, inputStyle);

    // Tạo DOM element container cho password
    const passwordDomContainer = document.createElement("div");
    passwordDomContainer.id = "password-input-container";
    passwordDomContainer.style.position = "absolute";
    passwordDomContainer.style.width = `${widthInput}px`;
    passwordDomContainer.style.height = `${heightInput}px`;
    // Thêm DOM container vào game canvas
    const passwordDomElement = this.add.dom(0, 0, passwordDomContainer);
    passwordDomElement.setOrigin(0.5, 0.5);

    const iconImgPassword = document.createElement("img");
    iconImgPassword.className = "icon-img";
    iconImgPassword.src = "asset/iconPassword.png";
    iconImgPassword.style.position = "absolute";
    iconImgPassword.style.left = "10px";
    iconImgPassword.style.top = "50%";
    iconImgPassword.style.transform = "translateY(-50%)";
    iconImgPassword.style.height = "60%";
    iconImgPassword.style.width = "auto";
    iconImgPassword.style.zIndex = "2";

    passwordInput.style.paddingLeft = `${paddingInput}px`;
    passwordDomContainer.appendChild(iconImgPassword);
    passwordDomContainer.appendChild(passwordInput);

    this.passwordContainer.add([passwordDomElement]);

    // Thêm event listeners cho password input
    createInputHandlers(
      passwordInput,
      () => {
        this.activeInput = "password";
      },
      () => {
        this.activeInput = null;
      },
      (value) => {
        this.passwordText = value;
      },
      this.MAX_PASSWORD_LENGTH
    );
    // Thêm container vào LoginContainer chính
    this.LoginContainer.add(this.passwordContainer);
  }

  private activeInput: "username" | "password" | null = null;

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.activeInput) return;

    // Kiểm tra nếu là ký tự tiếng Việt hoặc dấu
    if (event.key.match(VIETNAMESE_CHARS_REGEX)) {
      return; // Ngăn chặn nhập ký tự tiếng Việt
    }

    if (event.key === "Backspace") {
      if (this.activeInput === "username") {
        this.usernameText = this.usernameText.slice(0, -1);
      } else {
        this.passwordText = this.passwordText.slice(0, -1);
      }
    } else if (event.key === "Enter") {
      this.handleLogin();
    } else if (event.key.length === 1) {
      // Chỉ cho phép nhập chữ cái, số và một số ký tự đặc biệt
      if (event.key.match(ALLOWED_CHARS_REGEX)) {
        if (this.activeInput === "username") {
          if (this.usernameText.length < this.MAX_USERNAME_LENGTH) {
            this.usernameText += event.key;
          }
        } else {
          if (this.passwordText.length < this.MAX_PASSWORD_LENGTH) {
            this.passwordText += event.key;
          }
        }
      }
    }
  }

  private handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.usernameText,
          password: this.passwordText,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.error) {
        this.showError(data.error.message);
        return;
      }

      // Update isLoggedIn in MenuLoginScene
      const menuLoginScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      if (menuLoginScene) {
        menuLoginScene.isLoggedInChange(true);
      }

      // Chuyển đến màn hình chính
      menuLoginScene.showMenu();
      this.LoginContainer.setVisible(false);
      this.toggleInputsAndIcons(false);
    } catch (error) {
      console.error("Login error:", error);
      this.showError("Lỗi đăng nhập. Vui lòng thử lại.");
    }
  };

  private createButtonX() {
    this.spr_btn_x = this.physics.add.sprite(0, 0, "spr_btn_x", 0);
    this.spr_btn_x.setOrigin(0.5);
    this.spr_btn_x.setPosition(
      this.backgroundFrame.width / 2.2,
      -this.backgroundFrame.height / 2.63
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
      this.spr_btn_x.setFrame(1);
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();
      this.LoginContainer.setVisible(false);
      this.toggleInputsAndIcons(false);
    });
  }

  private showError(message: string) {
    if (this.errorText) {
      this.errorText.destroy();
    }

    this.errorText = this.add.text(0, 0, message, {
      fontFamily: "Kavoon",
      fontSize: "20px",
      color: "#FF0000",
      align: "center",
    });

    this.errorText.setOrigin(0.5);
    this.errorText.setPosition(0, this.backgroundFrame.displayHeight * 0.6);
    this.LoginContainer.add(this.errorText);

    this.time.delayedCall(3000, () => {
      if (this.errorText) {
        this.errorText.destroy();
        this.errorText = null;
      }
    });
  }

  private showSuccess(message: string) {
    if (this.successText) {
      this.successText.destroy();
    }

    this.successText = this.add.text(0, 0, message, {
      fontFamily: "Kavoon",
      fontSize: "20px",
      color: "#00FF00",
      align: "center",
    });

    this.successText.setOrigin(0.5);
    this.successText.setPosition(0, this.backgroundFrame.displayHeight * 0.6);
    this.LoginContainer.add(this.successText);

    this.time.delayedCall(2000, () => {
      if (this.successText) {
        this.successText.destroy();
        this.successText = null;
      }
    });
  }

  private showLoading() {
    if (this.loadingText) {
      this.loadingText.destroy();
    }

    this.loadingText = this.add.text(0, 0, "Đang đăng nhập...", {
      fontFamily: "Kavoon",
      fontSize: "20px",
      color: "#FFFFFF",
      align: "center",
    });

    this.loadingText.setOrigin(0.5);
    this.loadingText.setPosition(0, this.backgroundFrame.displayHeight * 0.6);
    this.LoginContainer.add(this.loadingText);
  }

  private hideLoading() {
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = null;
    }
  }

  private disableLoginButton(seconds: number) {
    if (this.btnLogin) {
      this.btnLogin.setInteractive(false);
      this.btnLogin.setAlpha(0.5);

      this.time.delayedCall(seconds * 1000, () => {
        if (this.btnLogin) {
          this.btnLogin.setInteractive(true);
          this.btnLogin.setAlpha(1);
        }
      });
    }
  }
}
