"use client";

import { NONE } from "phaser";
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

    // Đảm bảo avatar mặc định được tải với đường dẫn chính xác
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

    // Create a hidden file input element for avatar upload
    this.createFileInput();
  }

  private createFileInput() {
    // Remove existing file input if any
    const existingInput = document.getElementById("avatar-upload");
    if (existingInput) {
      existingInput.remove();
    }

    // Create a new file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "avatar-upload";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    // Add it to the document
    document.body.appendChild(fileInput);

    // Handle file selection
    fileInput.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.handleAvatarUpload(target.files[0]);
      }
    });
  }

  private async handleAvatarUpload(file: File) {
    // Declare imageUrl at the beginning of the function scope
    let imageUrl = "";

    try {
      // Create a URL for the selected file
      imageUrl = URL.createObjectURL(file);

      // Update avatar display immediately
      this.updateAvatarDisplay(imageUrl);

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("avatar", file);
      console.log(formData);

      // Show loading state or indicator if needed
      console.log("Uploading avatar...");

      // Call the API to upload the avatar
      const response = await fetch("/api/updateAvatar", {
        method: "POST",
        body: formData,
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Avatar uploaded successfully:", data.avatarUrl);

        // Optionally update the avatar with the URL returned from the server
        if (data.avatarUrl) {
          this.updateAvatarDisplay(data.avatarUrl);
        }

        // Refresh player data if needed
        await this.getScore();
      } else {
        console.error("Upload failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      // Show error message to user if needed
    } finally {
      // Clean up the object URL to prevent memory leaks
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  }

  private updateAvatarDisplay(imageUrl: string) {
    // Find and update the avatar container
    // This is a simplified version - you may need to adapt it to your structure
    try {
      this.loadAndDisplayAvatar(imageUrl);
    } catch (error) {
      console.error("Error updating avatar display:", error);
    }
  }

  create() {
    // Tạo một text tạm thời để kích hoạt loading font
    const fontPreloader = this.add.text(-1000, -1000, "Font Preloader", {
      fontFamily: "Coiny",
      fontSize: "20px",
    });

    // Đợi font load xong rồi mới hiển thị
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
    console.log(data);
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
    console.log(this.name);
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
    // Tạo container ở giữa màn hình
    this.bg_setting_container = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    // Tạo background trước
    this.createBackground();
    // Tạo nút OK sau để nó hiển thị trên background
    this.createButtonOK();
    this.createButtonLogout();
    this.createButtonUpdateProfile();

    // Wait for getScore to complete before showing buttons
    await this.getScore();
    // Now that we have data, show buttons based on login status
    this.showBtn(this.checkLogin);

    this.createName();

    // Đặt độ sâu cho container
    this.bg_setting_container.setDepth(1000);
  }

  private createBackground() {
    // Tạo background
    this.bg_setting = this.add.image(0, 0, "bg_setting");
    this.bg_setting.setOrigin(0.5, 0.5);
    // Scale theo tỉ lệ màn hình
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const scale = Math.min(scaleX, scaleY); // Chọn scale nhỏ hơn để đảm bảo vừa màn hình

    this.bg_setting.setScale(scale);

    // Thêm background vào container
    this.bg_setting_container.add(this.bg_setting);
  }

  private createButtonLogout() {
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.8;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.8;
    const scale = Math.min(scaleX, scaleY); // Chọn scale nhỏ hơn để đảm bảo vừa màn hình

    // Tính toán vị trí dựa trên kích thước thực tế của background sau khi scale
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

        // Reload the game after logout
        setTimeout(() => {
          window.location.reload();
        }, 500); // Short delay to allow signOut to complete
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

      // Trigger the file input click to open file dialog
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
    // Đặt nút ở phía dưới background với khoảng cách phù hợp
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.8;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.8;
    const scale = Math.min(scaleX, scaleY); // Chọn scale nhỏ hơn để đảm bảo vừa màn hình

    // Tính toán vị trí dựa trên kích thước thực tế của background sau khi scale
    const scaledHeight = this.bg_setting.height * scale;
    const yPosition = scaledHeight / 2 + 40 * scale; // Điều chỉnh khoảng cách theo tỉ lệ scale

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
    let score = Name.score.toString();
    let avatar = Name.url;
    console.log(avatar);
    const maxLength = 13;
    let displayName = trimmedName;
    if (trimmedName.length > maxLength) {
      displayName = trimmedName.substring(0, maxLength) + "...";
    }

    const nameX = -this.bg_setting.displayWidth / 25;
    const nameY = -this.bg_setting.displayHeight / 3.5;

    // Tính kích thước font theo tỉ lệ của bg_setting
    const baseFontSize = 18;
    // Lấy tỉ lệ scale thực tế đã áp dụng cho background
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const bgScale = Math.min(scaleX, scaleY); // Chọn scale nhỏ hơn như đã dùng cho bg

    const scaledFontSize = Math.round(baseFontSize * bgScale);

    const textStyle = {
      fontFamily: "Coiny, Arial, sans-serif", // Thêm font fallback
      fontWeight: "bold",
      fontStyle: "normal",
      fontSize: `${scaledFontSize}px`,
      color: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: Math.max(2, scaledFontSize * 0.1), // Giữ độ dày của viền theo tỉ lệ phù hợp
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

    // Hiển thị avatar
    this.loadAndDisplayAvatar(avatar);
  }

  private loadAndDisplayAvatar(avatarUrl: string) {
    // Calculate position and scale based on container dimensions
    const centerX = -this.bg_setting.displayWidth / 4.5;
    const centerY = -this.bg_setting.displayHeight / 4;

    // Calculate proper scaling
    const scaleX = (this.scale.width / this.bg_setting.width) * 0.9;
    const scaleY = (this.scale.height / this.bg_setting.height) * 0.9;
    const bgScale = Math.min(scaleX, scaleY);

    // Create a single container for both border and avatar
    const avatarContainer = this.add.container(centerX, centerY);
    avatarContainer.setDepth(1080);
    this.bg_setting_container.add(avatarContainer);

    // Add border first (so it's behind the avatar)
    const borderAvatar = this.add.image(0, 0, "boder_avatar_profile");
    borderAvatar.setOrigin(0.5, 0.5);
    borderAvatar.setScale(bgScale);
    avatarContainer.add(borderAvatar);

    // Calculate avatar size to fit inside the border
    const avatarSize = borderAvatar.displayWidth * 0.85; // 85% of border size

    // Add default avatar
    const defaultAvatar = this.add.image(0, 0, "avatar_default");
    defaultAvatar.setDisplaySize(avatarSize, avatarSize);
    defaultAvatar.setOrigin(0.5, 0.5);
    avatarContainer.add(defaultAvatar);

    // Load user avatar if URL is provided
    if (avatarUrl) {
      const avatarKey = "avatar_" + Date.now();
      this.load.image(avatarKey, avatarUrl);
      this.load.once("complete", () => {
        try {
          // Remove default avatar
          defaultAvatar.destroy();

          // Add user avatar
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
