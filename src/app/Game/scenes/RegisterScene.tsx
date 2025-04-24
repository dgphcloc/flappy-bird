"use client";
import MenuLoginScene from "./MenuLoginScene";
import {
  VIETNAMESE_CHARS_REGEX,
  ALLOWED_CHARS_REGEX,
} from "../constants/regexPatterns";
import { createInputHandlers } from "../constants/inputUtils";
import LoginScene from "./LoginScene";
import { ErrorCodes, ErrorMessages } from "@/app/shared/errorMessages";

export default class RegisterScene extends Phaser.Scene {
  private RegisterContainer!: Phaser.GameObjects.Container;
  private InputContainer!: Phaser.GameObjects.Container;
  private InputContainerPassword!: Phaser.GameObjects.Container;
  private InputContainerPasswordComfirm!: Phaser.GameObjects.Container;
  private backgroundFrame!: Phaser.GameObjects.Image;
  private btnRegister!: Phaser.GameObjects.Sprite;
  private btnLoginBack!: Phaser.GameObjects.Sprite;
  private btnX!: Phaser.GameObjects.Sprite;
  private maxLengInput: number = 15;
  private usernameText: string = "";
  private passwordText: string = "";
  private passwordComfirmText: string = "";
  private errorText: Phaser.GameObjects.Text | null = null;
  private successText: Phaser.GameObjects.Text | null = null;
  private loadingText: Phaser.GameObjects.Text | null = null;
  private activeInput: "username" | "password" | "password-comfirm" | null =
    null;

  constructor() {
    super("RegisterScene");
  }

  create(): void {
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(metaViewport);

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
    const width = this.scale.width;
    const height = this.scale.height;
    this.RegisterContainer = this.add.container(0, 0);
    this.createFrame();
    this.createButtonX();
    this.createInputFields();
    this.createButtonRegister();
    this.createButtonLoginBack();
    this.RegisterContainer.add([
      this.backgroundFrame,
      this.btnX,
      this.InputContainer,
      this.InputContainerPassword,
      this.InputContainerPasswordComfirm,
      this.btnRegister,
      this.btnLoginBack,
    ]);
    this.RegisterContainer.setPosition(width * 0.5, height * 0.55);
    this.RegisterContainer.setScale(this.scaleRegisterContainer());

    this.RegisterContainer.setVisible(false);
    this.toggleInputsAndIcons(false);

    if (this.input && this.input.keyboard) {
      this.input.keyboard.on("keydown", this.handleKeyDown.bind(this));
    }
  }
  public showRegisterContainer(): void {
    this.RegisterContainer.setVisible(true);
    this.RegisterContainer.setScale(0.1);
    this.RegisterContainer.setAlpha(0);
    this.tweens.add({
      targets: this.RegisterContainer,
      x: this.scale.width * 0.5,
      scale: this.scaleRegisterContainer(),
      alpha: 1,
      duration: 700,
      onComplete: () => {
        this.toggleInputsAndIcons(true);
      },
    });
  }
  private scaleRegisterContainer() {
    const width = this.scale.width;
    const height = this.scale.height;
    const frameWidth = this.backgroundFrame.displayWidth;
    const frameHeight = this.backgroundFrame.displayHeight;
    const scaleX = width / frameWidth;
    const scaleY = height / frameHeight;
    const scale = Math.min(scaleX, scaleY);
    return scale * 0.7;
  }
  private toggleInputsAndIcons(show: boolean) {
    const usernameInput = document.querySelector(
      "#username-input-container .input-show"
    ) as HTMLInputElement;
    const IconUser = document.querySelector(
      "#username-input-container .icon-user"
    ) as HTMLImageElement;
    const passwordInput = document.querySelector(
      "#password-input-container .input-show"
    ) as HTMLInputElement;
    const IconPassword = document.querySelector(
      "#password-input-container .icon-password"
    ) as HTMLImageElement;

    const passwordComfirm = document.querySelector(
      "#password-input-container-comfirm .input-show"
    ) as HTMLInputElement;
    const IconPasswordComfirm = document.querySelector(
      "#password-input-container-comfirm .icon-password-comfirm"
    ) as HTMLImageElement;

    const displayValue = show ? "block" : "none";

    [
      usernameInput,
      IconUser,
      passwordInput,
      IconPassword,
      passwordComfirm,
      IconPasswordComfirm,
    ].forEach((element) => {
      if (element) {
        element.style.display = displayValue;
        if (element instanceof HTMLInputElement) {
          element.blur();
        }
      }
    });
    this.btnLoginBack.setVisible(show);
    this.btnRegister.setVisible(show);
  }

  private createFrame(): void {
    this.backgroundFrame = this.add.image(0, 0, "background_register");
    this.backgroundFrame.setOrigin(0.5, 0.5);
    this.backgroundFrame.setScale(1);
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

    const iconStyle = {
      position: "absolute",
      left: "1%",
      top: "50%",
      transform: "translateY(-50%)",
      width: "18%",
      height: "auto",
      zIndex: "2",
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

    this.InputContainer = this.add.container(0, -frameHeight / 6);

    const usernameInput = document.createElement("input");
    usernameInput.className = "input-show";
    usernameInput.type = "text";
    usernameInput.placeholder = "Username";
    usernameInput.maxLength = this.maxLengInput;
    usernameInput.setAttribute("data-placeholder", "Username");
    usernameInput.setAttribute("autocomplete", "off");
    usernameInput.setAttribute("autocorrect", "off");
    usernameInput.setAttribute("autocapitalize", "off");
    usernameInput.setAttribute("spellcheck", "false");
    usernameInput.setAttribute("data-form-type", "other");
    Object.assign(usernameInput.style, inputStyle);

    const domContainer = document.createElement("div");
    domContainer.id = "username-input-container";
    domContainer.style.position = "absolute";
    domContainer.style.width = `${widthInput}px`;
    domContainer.style.height = `${heightInput}px`;
    domContainer.style.zIndex = "1";

    const iconUser = document.createElement("img");
    iconUser.className = "icon-user";
    iconUser.src = "asset/iconUser.png";
    Object.assign(iconUser.style, iconStyle);

    usernameInput.style.paddingLeft = `${paddingInput}px`;
    domContainer.appendChild(iconUser);
    domContainer.appendChild(usernameInput);
    const domElement = this.add.dom(0, 0, domContainer);
    domElement.setOrigin(0.5, 0.5);
    domElement.setDepth(5);

    this.InputContainer.add([domElement]);

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
        console.log("Username updated:", this.usernameText);
      },
      this.maxLengInput
    );

    this.InputContainerPassword = this.add.container(0, frameHeight / 25);
    const passwordInput = document.createElement("input");
    passwordInput.className = "input-show";
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.maxLength = this.maxLengInput;
    passwordInput.setAttribute("data-placeholder", "Password");
    passwordInput.setAttribute("autocomplete", "off");
    passwordInput.setAttribute("autocorrect", "off");
    passwordInput.setAttribute("autocapitalize", "off");
    passwordInput.setAttribute("spellcheck", "false");
    passwordInput.setAttribute("data-form-type", "other");
    Object.assign(passwordInput.style, inputStyle);

    const domContainerPassword = document.createElement("div");
    domContainerPassword.id = "password-input-container";
    domContainerPassword.style.position = "absolute";
    domContainerPassword.style.width = `${widthInput}px`;
    domContainerPassword.style.height = `${heightInput}px`;
    domContainerPassword.style.zIndex = "1";

    const iconPassword = document.createElement("img");
    iconPassword.className = "icon-password";
    iconPassword.src = "asset/iconPassword.png";
    Object.assign(iconPassword.style, iconStyle);

    passwordInput.style.paddingLeft = `${paddingInput}px`;
    domContainerPassword.appendChild(iconPassword);
    domContainerPassword.appendChild(passwordInput);
    const domElementPassword = this.add.dom(0, 0, domContainerPassword);
    domElementPassword.setOrigin(0.5, 0.5);
    domElementPassword.setDepth(5);

    this.InputContainerPassword.add([domElementPassword]);
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
        console.log("Password updated:", this.passwordText);
      },
      this.maxLengInput
    );

    this.InputContainerPasswordComfirm = this.add.container(0, frameHeight / 4);
    const passwordComfirmInput = document.createElement("input");
    passwordComfirmInput.className = "input-show";
    passwordComfirmInput.type = "password";
    passwordComfirmInput.placeholder = "Password Comfirm";
    passwordComfirmInput.maxLength = this.maxLengInput;
    passwordComfirmInput.setAttribute("data-placeholder", "Password Comfirm");
    passwordComfirmInput.setAttribute("autocomplete", "off");
    passwordComfirmInput.setAttribute("autocorrect", "off");
    passwordComfirmInput.setAttribute("autocapitalize", "off");
    passwordComfirmInput.setAttribute("spellcheck", "false");
    passwordComfirmInput.setAttribute("data-form-type", "other");
    Object.assign(passwordComfirmInput.style, inputStyle);

    const domContainerPasswordComfirm = document.createElement("div");
    domContainerPasswordComfirm.id = "password-input-container-comfirm";
    domContainerPasswordComfirm.style.position = "absolute";
    domContainerPasswordComfirm.style.width = `${widthInput}px`;
    domContainerPasswordComfirm.style.height = `${heightInput}px`;
    domContainerPasswordComfirm.style.zIndex = "1";

    const iconPasswordComfirm = document.createElement("img");
    iconPasswordComfirm.className = "icon-password-comfirm";
    iconPasswordComfirm.src = "asset/iconCheck.png";
    Object.assign(iconPasswordComfirm.style, iconStyle);

    passwordComfirmInput.style.paddingLeft = `${paddingInput}px`;
    domContainerPasswordComfirm.appendChild(iconPasswordComfirm);
    domContainerPasswordComfirm.appendChild(passwordComfirmInput);

    const domElementPasswordComfirm = this.add.dom(
      0,
      0,
      domContainerPasswordComfirm
    );
    domElementPasswordComfirm.setOrigin(0.5, 0.5);
    domElementPasswordComfirm.setDepth(5);

    this.InputContainerPasswordComfirm.add([domElementPasswordComfirm]);

    createInputHandlers(
      passwordComfirmInput,
      () => {
        this.activeInput = "password-comfirm";
      },
      () => {
        this.activeInput = null;
      },
      (value) => {
        this.passwordComfirmText = value;
        console.log("Password comfirm updated:", this.passwordComfirmText);
      },
      this.maxLengInput
    );
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.activeInput) return;

    // Kiểm tra nếu là ký tự tiếng Việt hoặc dấu
    if (event.key.match(VIETNAMESE_CHARS_REGEX)) {
      return;
    }

    if (event.key === "Backspace") {
      if (this.activeInput === "username") {
        this.usernameText = this.usernameText.slice(0, -1);
      } else if (this.activeInput === "password") {
        this.passwordText = this.passwordText.slice(0, -1);
      } else if (this.activeInput === "password-comfirm") {
        this.passwordComfirmText = this.passwordComfirmText.slice(0, -1);
      }
    } else if (event.key === "Enter") {
      // Không làm gì khi nhấn Enter
      return;
    } else if (event.key.length === 1) {
      // Chỉ cho phép nhập chữ cái, số và một số ký tự đặc biệt
      if (event.key.match(ALLOWED_CHARS_REGEX)) {
        if (this.activeInput === "username") {
          if (this.usernameText.length < this.maxLengInput) {
            this.usernameText += event.key;
          }
        } else if (this.activeInput === "password") {
          if (this.passwordText.length < this.maxLengInput) {
            this.passwordText += event.key;
          }
        } else if (this.activeInput === "password-comfirm") {
          if (this.passwordComfirmText.length < this.maxLengInput) {
            this.passwordComfirmText += event.key;
          }
        }
      }
    }
  }

  private async handleRegister() {
    try {
      // Trim whitespace from all fields
      // const username = this.usernameText.trim();
      // const password = this.passwordText.trim();
      // const passwordConfirm = this.passwordComfirmText.trim();

      // if (!username || !password || !passwordConfirm) {
      //   this.showError(ErrorMessages[ErrorCodes.EMPTY_FIELDS]);
      //   return;
      // }

      // // Kiểm tra mật khẩu xác nhận
      // if (password !== passwordConfirm) {
      //   console.log("Debug password comparison:");
      //   console.log("Password:", password);
      //   console.log("Password Confirm:", passwordConfirm);
      //   console.log("Length password:", password.length);
      //   console.log("Length password confirm:", passwordConfirm.length);
      //   this.showError(ErrorMessages[ErrorCodes.PASSWORD_NOT_MATCH]);
      //   return;
      // }

      // // Kiểm tra độ dài mật khẩu
      // if (password.length < 6) {
      //   this.showError(ErrorMessages[ErrorCodes.PASSWORD_TOO_SHORT]);
      //   return;
      // }

      // // Kiểm tra định dạng username
      // const usernameRegex = /^[a-zA-Z0-9_]+$/;
      // if (!usernameRegex.test(username)) {
      //   this.showError(ErrorMessages[ErrorCodes.INVALID_USERNAME]);
      //   return;
      // }

      // Hiển thị loading
      this.showLoading();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.usernameText,
          password: this.passwordText,
          passwordConfirm: this.passwordComfirmText,
        }),
      });

      const registerResult = await response.json();
      console.log("registerResult:", registerResult);

      // Ẩn loading
      this.hideLoading();

      if (registerResult.error) {
        // Hiển thị thông báo lỗi từ server
        this.showError(registerResult.message);

        // Xử lý các trường hợp đặc biệt
        if (registerResult.error === ErrorCodes.USERNAME_EXISTS) {
          // Có thể thêm xử lý đặc biệt cho username đã tồn tại
          this.usernameText = "";
          const usernameInput = document.querySelector(
            "#username-input-container .input-show"
          ) as HTMLInputElement;
          if (usernameInput) {
            usernameInput.value = "";
            usernameInput.focus();
          }
        }
      } else {
        // Đăng ký thành công
        this.showSuccess("Đăng ký thành công!");

        // Reset form
        this.usernameText = "";
        this.passwordText = "";
        this.passwordComfirmText = "";

        // Chờ 2 giây rồi chuyển về scene đăng nhập
        this.time.delayedCall(2000, () => {
          this.RegisterContainer.setVisible(false);
          this.toggleInputsAndIcons(false);
          const loginScene = this.scene.get("LoginScene") as LoginScene;
          loginScene.showLoginContainer();
        });
      }
    } catch (error) {
      if (error) {
        this.hideLoading();
        this.showError(ErrorMessages[ErrorCodes.NETWORK_ERROR]);
      }
    }
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
    this.RegisterContainer.add(this.errorText);

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
    this.RegisterContainer.add(this.successText);

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

    this.loadingText = this.add.text(0, 0, "Đang đăng ký...", {
      fontFamily: "Kavoon",
      fontSize: "20px",
      color: "#FFFFFF",
      align: "center",
    });

    this.loadingText.setOrigin(0.5);
    this.loadingText.setPosition(0, this.backgroundFrame.displayHeight * 0.6);
    this.RegisterContainer.add(this.loadingText);
  }

  private hideLoading() {
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = null;
    }
  }

  private createButtonRegister(): void {
    this.btnRegister = this.add.sprite(0, 0, "btn_Register", 0);
    this.btnRegister.setOrigin(0.5);
    this.btnRegister.setScale(1.1);
    this.btnRegister.setPosition(
      this.backgroundFrame.displayWidth * 0.22,
      this.backgroundFrame.displayHeight * 0.47
    );
    this.btnRegister.setInteractive({ cursor: "pointer" });
    this.btnRegister.on("pointerover", () => {
      this.btnRegister.setFrame(1);
    });
    this.btnRegister.on("pointerout", () => {
      this.btnRegister.setFrame(0);
    });
    this.btnRegister.on("pointerdown", () => {
      this.btnRegister.setFrame(2);
    });
    this.btnRegister.on("pointerup", async () => {
      this.btnRegister.setFrame(1);
      await this.handleRegister();
    });
  }

  private createButtonLoginBack(): void {
    this.btnLoginBack = this.add.sprite(0, 0, "btn_Login_back", 0);
    this.btnLoginBack.setOrigin(0.5, 0.5);
    this.btnLoginBack.setScale(1.1);
    this.btnLoginBack.setPosition(
      -this.backgroundFrame.displayWidth * 0.22,
      this.backgroundFrame.displayHeight * 0.47
    );
    this.btnLoginBack.setInteractive({ cursor: "pointer" });
    this.btnLoginBack.on("pointerover", () => {
      this.btnLoginBack.setFrame(1);
    });
    this.btnLoginBack.on("pointerout", () => {
      this.btnLoginBack.setFrame(0);
    });
    this.btnLoginBack.on("pointerdown", () => {
      this.btnLoginBack.setFrame(2);
    });
    this.btnLoginBack.on("pointerup", () => {
      this.btnLoginBack.setFrame(1);
      console.log("Login back");
      this.RegisterContainer.setVisible(false);
      this.toggleInputsAndIcons(false);
      const loginScene = this.scene.get("LoginScene") as LoginScene;
      loginScene.showLoginContainer();
    });
  }

  private createButtonX(): void {
    this.btnX = this.add.sprite(0, 0, "spr_btn_x", 0);
    this.btnX.setOrigin(0.5, 0.5);
    this.btnX.setScale(0.7);
    this.btnX.setPosition(
      this.backgroundFrame.width / 2.2,
      -this.backgroundFrame.height / 2.63
    );
    this.btnX.setInteractive({ cursor: "pointer" });
    this.btnX.on("pointerover", () => {
      this.btnX.setFrame(1);
    });
    this.btnX.on("pointerout", () => {
      this.btnX.setFrame(0);
    });
    this.btnX.on("pointerdown", () => {
      this.btnX.setFrame(2);
    });
    this.btnX.on("pointerup", () => {
      this.btnX.setFrame(1);
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      this.RegisterContainer.setVisible(false);
      this.toggleInputsAndIcons(false);
      menuScene.showMenu();
    });
  }
}
