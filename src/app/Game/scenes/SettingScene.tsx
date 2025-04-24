"use client";

import MenuLoginScene from "./MenuLoginScene";
import { createBrowserClient } from "@supabase/ssr";

export default class SettingScene extends Phaser.Scene {
  private bg_setting!: Phaser.GameObjects.Image;
  private bg_setting_container!: Phaser.GameObjects.Container;
  private spr_btnOK!: Phaser.GameObjects.Sprite;
  private playerNames: Phaser.GameObjects.Text[] = [];
  private name!: string;
  private avatar_url!: string;
  private nameText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private score!: number;
  private spr_btnLogout!: Phaser.GameObjects.Sprite;
  private spr_btnUpdateProfile!: Phaser.GameObjects.Sprite;
  private checkLogin: boolean = false;

  constructor() {
    super("SettingScene");
  }

  preload() {
    this.load.setPath("asset");
    this.load.image("bg_setting", "bg_setting.png");
    this.load.spritesheet("spr_btnOK", "spr_btnOK.png", {
      frameWidth: 105,
      frameHeight: 74,
    });
    this.load.image("avatar_default", "default_avatar.jpg");
    this.load.image("boder_avatar_profile", "boder_avatar_profile.png");
    this.load.spritesheet("spr_btnLogout", "spr_btnLogout.png", {
      frameWidth: 170,
      frameHeight: 45,
    });
    this.load.spritesheet("spr_btnUpdateProfile", "spr_btnUpdateProfile.png", {
      frameWidth: 170,
      frameHeight: 45,
    });

    this.createFileInput();
  }

  private createFileInput() {
    const existingInput = document.getElementById("avatar-upload");
    if (existingInput) {
      existingInput.remove();
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "avatar-upload";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    document.body.appendChild(fileInput);

    fileInput.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.handleAvatarUpload(target.files[0]);
      }
    });
  }

  private async handleAvatarUpload(file: File) {
    let imageUrl = "";

    try {
      imageUrl = URL.createObjectURL(file);
      this.updateAvatarDisplay(imageUrl);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/updateAvatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (data.avatarUrl) {
          this.updateAvatarDisplay(data.avatarUrl);
        }
        await this.getScore();
      } else {
        console.error("Upload failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    } finally {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  }

  private updateAvatarDisplay(imageUrl: string) {
    try {
      this.loadAndDisplayAvatar(imageUrl);
    } catch (error) {
      console.error("Error updating avatar display:", error);
    }
  }

  create() {
    const fontPreloader = this.add.text(-1000, -1000, "Font Preloader", {
      fontFamily: "Coiny",
      fontSize: "20px",
    });

    this.time.delayedCall(100, () => {
      fontPreloader.destroy();
      this.createContainerSetting();
      this.bg_setting_container.setVisible(false);
    });
  }

  private async getScore() {
    const response = await fetch("/api/auth/me", {
      method: "GET",
    });

    const data = await response.json();

    if (data.user) {
      this.name = data.user.username;
      this.score = data.user.score;
      this.avatar_url = data.user.avatar_url;
      this.checkLogin = true;
    } else {
      this.name = " ";
      this.score = 0;
      this.avatar_url = "";
      this.checkLogin = false;
    }

    return {
      name: this.name,
      score: this.score,
      url: this.avatar_url,
      checkLogin: this.checkLogin,
    };
  }

  public showSettingContainer() {
    this.bg_setting_container.setVisible(true);
  }

  public showBtn(checkLogin: boolean) {
    if (checkLogin) {
      this.spr_btnUpdateProfile.setVisible(true);
      this.spr_btnLogout.setVisible(true);
    } else {
      this.spr_btnUpdateProfile.setVisible(false);
      this.spr_btnLogout.setVisible(false);
    }
  }

  private async createContainerSetting() {
    this.bg_setting_container = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    this.createBackground();
    this.createButtonOK();
    this.createButtonLogout();
    this.createButtonUpdateProfile();

    await this.getScore();
    this.showBtn(this.checkLogin);
    this.createName();

    this.bg_setting_container.setDepth(1000);
  }

  private createBackground() {
    this.bg_setting = this.add.image(0, 0, "bg_setting");
    this.bg_setting.setOrigin(0.5, 0.5);

    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const scale = Math.min(scaleX, scaleY);

    this.bg_setting.setScale(scale);
    this.bg_setting_container.add(this.bg_setting);
  }

  private createButtonLogout() {
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.8;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.8;
    const scale = Math.min(scaleX, scaleY);

    const scaledHeight = this.bg_setting.height * scale;
    const yPosition = scaledHeight / 50 - 30 * scale;
    this.spr_btnLogout = this.add.sprite(0, yPosition, "spr_btnLogout", 0);
    this.spr_btnLogout.setOrigin(0.5, 0.5);
    this.spr_btnLogout.setScale(scale);
    this.spr_btnLogout.setInteractive();
    this.spr_btnLogout.on("pointerup", () => {
      this.spr_btnLogout.setFrame(2);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const logout = async () => {
        await supabase.auth.signOut();

        setTimeout(() => {
          window.location.reload();
        }, 500);
      };

      logout();
    });
    this.spr_btnLogout.on("pointerover", () => {
      this.spr_btnLogout.setFrame(1);
    });
    this.spr_btnLogout.on("pointerout", () => {
      this.spr_btnLogout.setFrame(0);
    });
    this.spr_btnLogout.on("pointerdown", () => {
      this.spr_btnLogout.setFrame(1);
    });
    this.bg_setting_container.add(this.spr_btnLogout);
  }

  private createButtonUpdateProfile() {
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.8;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.8;
    const scale = Math.min(scaleX, scaleY);
    const scaledHeight = this.bg_setting.height * scale;
    const yPosition = scaledHeight / 50 - 80 * scale;
    this.spr_btnUpdateProfile = this.add.sprite(
      0,
      yPosition,
      "spr_btnUpdateProfile",
      0
    );
    this.spr_btnUpdateProfile.setOrigin(0.5, 0.5);
    this.spr_btnUpdateProfile.setScale(scale);
    this.spr_btnUpdateProfile.setInteractive();
    this.spr_btnUpdateProfile.on("pointerup", () => {
      this.spr_btnUpdateProfile.setFrame(2);

      const fileInput = document.getElementById(
        "avatar-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    });
    this.spr_btnUpdateProfile.on("pointerover", () => {
      this.spr_btnUpdateProfile.setFrame(1);
    });
    this.spr_btnUpdateProfile.on("pointerout", () => {
      this.spr_btnUpdateProfile.setFrame(0);
    });
    this.spr_btnUpdateProfile.on("pointerdown", () => {
      this.spr_btnUpdateProfile.setFrame(1);
    });
    this.bg_setting_container.add(this.spr_btnUpdateProfile);
  }

  private createButtonOK() {
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.8;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.8;
    const scale = Math.min(scaleX, scaleY);

    const scaledHeight = this.bg_setting.height * scale;
    const yPosition = scaledHeight / 2 + 40 * scale;

    this.spr_btnOK = this.add.sprite(0, yPosition, "spr_btnOK", 0);
    this.spr_btnOK.setOrigin(0.5, 0.5);
    this.spr_btnOK.setScale(scale);
    this.spr_btnOK.setInteractive();
    this.spr_btnOK.on("pointerup", () => {
      this.spr_btnOK.setFrame(0);
      this.bg_setting_container.setVisible(false);
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();
      menuScene.showBGBird();
    });
    this.spr_btnOK.on("pointerover", () => {
      this.spr_btnOK.setFrame(1);
    });
    this.spr_btnOK.on("pointerout", () => {
      this.spr_btnOK.setFrame(0);
    });
    this.spr_btnOK.on("pointerdown", () => {
      this.spr_btnOK.setFrame(1);
    });

    this.bg_setting_container.add(this.spr_btnOK);
  }

  private async createName() {
    const Name = await this.getScore();
    const trimmedName = Name.name.trim();
    const score = Name.score.toString();
    const avatar = Name.url;

    const maxLength = 13;
    let displayName = trimmedName;
    if (trimmedName.length > maxLength) {
      displayName = trimmedName.substring(0, maxLength) + "...";
    }

    const nameX = -this.bg_setting.displayWidth / 25;
    const nameY = -this.bg_setting.displayHeight / 3.5;

    const baseFontSize = 18;
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const bgScale = Math.min(scaleX, scaleY);

    const scaledFontSize = Math.round(baseFontSize * bgScale);

    const textStyle = {
      fontFamily: "Coiny, Arial, sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      fontSize: `${scaledFontSize}px`,
      color: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: Math.max(2, scaledFontSize * 0.1),
      letterSpacing: 0,
      align: "center",
    };

    this.nameText = this.add.text(nameX, nameY, displayName, textStyle);
    this.nameText.setOrigin(0, 0.5);
    this.nameText.setDepth(1080);
    this.nameText.setScale(1);

    this.playerNames.push(this.nameText);
    this.bg_setting_container.add(this.nameText);

    const scoreX = this.bg_setting.displayWidth / 5.2;
    const scoreY = -this.bg_setting.displayHeight / 4.65;

    this.scoreText = this.add.text(scoreX, scoreY, score, textStyle);
    this.scoreText.setOrigin(0, 0.5);
    this.scoreText.setDepth(1080);
    this.scoreText.setScale(1);

    this.playerNames.push(this.scoreText);
    this.bg_setting_container.add(this.scoreText);

    this.loadAndDisplayAvatar(avatar);
  }

  private loadAndDisplayAvatar(avatarUrl: string) {
    const centerX = -this.bg_setting.displayWidth / 4.5;
    const centerY = -this.bg_setting.displayHeight / 4;

    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const bgScale = Math.min(scaleX, scaleY);

    const avatarContainer = this.add.container(centerX, centerY);
    avatarContainer.setDepth(1080);
    this.bg_setting_container.add(avatarContainer);

    const borderAvatar = this.add.image(0, 0, "boder_avatar_profile");
    borderAvatar.setOrigin(0.5, 0.5);
    borderAvatar.setScale(bgScale);
    avatarContainer.add(borderAvatar);

    const avatarSize = borderAvatar.displayWidth * 0.85;

    const defaultAvatar = this.add.image(0, 0, "avatar_default");
    defaultAvatar.setDisplaySize(avatarSize, avatarSize);
    defaultAvatar.setOrigin(0.5, 0.5);
    avatarContainer.add(defaultAvatar);

    if (avatarUrl) {
      const avatarKey = "avatar_" + Date.now();
      this.load.image(avatarKey, avatarUrl);
      this.load.once("complete", () => {
        try {
          defaultAvatar.destroy();

          const userAvatar = this.add.image(0, 0, avatarKey);
          userAvatar.setDisplaySize(avatarSize, avatarSize);
          userAvatar.setOrigin(0.5, 0.5);
          avatarContainer.add(userAvatar);
        } catch (error) {
          console.error("Failed to load avatar:", error);
        }
      });
      this.load.start();
    }
  }
}
