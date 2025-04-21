"use client";
import MenuLoginScene from "./MenuLoginScene";

interface PlayerData {
  rank: number;
  playerName: string;
  score: number;
  avatarUrl: string;
}

export default class TopPlayerScene extends Phaser.Scene {
  private bg_topPlayer!: Phaser.GameObjects.Image;
  private containerTopPlayer!: Phaser.GameObjects.Container;
  private btn_back!: Phaser.GameObjects.Sprite;
  private bg_InputTopPlayer!: Phaser.GameObjects.Image;

  // Mảng lưu trữ các thành phần cho nhiều người chơi
  private playerRanks: Phaser.GameObjects.Sprite[] = [];
  private playerAvatarBorders: Phaser.GameObjects.Image[] = [];
  private playerAvatars: Phaser.GameObjects.Image[] = [];
  private playerIcons: Phaser.GameObjects.Sprite[] = [];
  private playerScoreDigits: Phaser.GameObjects.Sprite[][] = [];
  private playerNames: Phaser.GameObjects.Text[] = [];
  private playerInputBgs: Phaser.GameObjects.Image[] = [];

  // Các thuộc tính cũ giữ nguyên để tương thích ngược
  private spr_numberTopPlayer!: Phaser.GameObjects.Sprite;
  private boder_avatar!: Phaser.GameObjects.Image;
  private icon_TopPlayer!: Phaser.GameObjects.Sprite;
  private avatar_image!: Phaser.GameObjects.Image;
  private scoreTopPlayer!: Phaser.GameObjects.Sprite;
  private digitSprites: Phaser.GameObjects.Sprite[] = [];
  private nameText!: Phaser.GameObjects.Text;

  // Dữ liệu test
  private testPlayerData: PlayerData[] = [
    {
      rank: 1,
      playerName: "Nguyễn Văn A",
      score: 123,
      avatarUrl:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg",
    },
    {
      rank: 2,
      playerName: "Trần Thị B",
      score: 98,
      avatarUrl:
        "https://i.pinimg.com/736x/9f/81/2d/9f812d4cf313e887ef99d8722229f32a.jpg",
    },
    {
      rank: 3,
      playerName: "Lê Văn C",
      score: 85,
      avatarUrl:
        "https://i.pinimg.com/originals/32/60/b0/3260b02e9381b241f8c011c9f042f2c9.jpg",
    },
  ];

  constructor() {
    super("TopPlayerScene");
  }
  preload() {
    this.load.setPath("asset");
    this.load.image("bg_topPlayer", "bg_topPlayer.png");
    this.load.spritesheet("btn_back", "spr_btnback.png", {
      frameWidth: 105,
      frameHeight: 74,
    });
    this.load.image("bg_InputTopPlayer", "bg_InputTopPlayer.png");
    this.load.spritesheet("spr_numberTopPlayer", "spr_numberTopPlayer.png", {
      frameWidth: 20,
      frameHeight: 23,
    });
    this.load.image("boder_avatar", "boder_avatar.png");
    this.load.spritesheet("spr_iconTopPlayer", "spr_iconTop.png", {
      frameWidth: 45,
      frameHeight: 29,
    });
    this.load.spritesheet("scoreTopPlayer", "scoreTopPlayer_spritesheet.png", {
      frameWidth: 30,
      frameHeight: 30,
    });

    this.load.image("default_avatar", "default_avatar.jpg");
  }
  create() {
    this.createContainerTopPlayer();
    this.containerTopPlayer.setVisible(false);
  }
  private createContainerTopPlayer() {
    this.containerTopPlayer = this.add.container(
      this.scale.width / 2,
      this.scale.height / 1.8
    );

    this.createBackground();
    this.createBtnBack();

    // Thêm background và nút vào container
    this.containerTopPlayer.add([this.bg_topPlayer, this.btn_back]);

    // Hiển thị tất cả người chơi từ dữ liệu test
    this.displayAllPlayers(this.testPlayerData);

    const baseWidth = this.bg_topPlayer.width;
    const targetWidth = this.scale.width * 0.95; // 90% of screen width
    const containerScale = targetWidth / baseWidth;

    // Apply scale to the entire container - all children will inherit this scale
    this.containerTopPlayer.setScale(containerScale);

    // Set the depth for the container to ensure it appears above other elements
    this.containerTopPlayer.setDepth(1029);

    // Đảm bảo container hiển thị
    this.containerTopPlayer.setVisible(true);
    this.containerTopPlayer.setAlpha(1);
  }
  public showContainerTopPlayer() {
    if (!this.containerTopPlayer) {
      this.createContainerTopPlayer();
    }
    this.containerTopPlayer.setVisible(true);
  }
  public hideContainerTopPlayer() {
    if (!this.containerTopPlayer) {
      return;
    }
    this.containerTopPlayer.setVisible(false);
  }
  private createBackground() {
    this.bg_topPlayer = this.add.image(0, 0, "bg_topPlayer");
    this.bg_topPlayer.setOrigin(0.5, 0.5);
    this.bg_topPlayer.setScale(0.9);
    this.bg_topPlayer.setDepth(1030);
  }
  private createBtnBack() {
    this.btn_back = this.add.sprite(
      0,
      this.bg_topPlayer.displayHeight / 2,
      "btn_back",
      0
    );
    console.log(
      -this.bg_topPlayer.displayWidth / 2,
      this.bg_topPlayer.displayHeight / 2
    );
    this.btn_back.setOrigin(0.5, 0.5);
    this.btn_back.setScale(1);
    this.btn_back.setInteractive();
    this.btn_back.on("pointerdown", () => {
      this.btn_back.setFrame(2);
      this.hideContainerTopPlayer();
      const menuScene = this.scene.get("MenuLoginScene") as MenuLoginScene;
      menuScene.showMenu();
    });
    this.btn_back.on("pointerover", () => {
      this.btn_back.setFrame(1);
    });
    this.btn_back.on("pointerout", () => {
      this.btn_back.setFrame(0);
    });
    this.btn_back.on("pointerup", () => {
      this.btn_back.setFrame(0);
    });
    this.btn_back.on("pointerupoutside", () => {
      this.btn_back.setFrame(0);
    });
    this.btn_back.setDepth(1042);
  }

  private createNumberTopPlayer(number: number) {
    this.spr_numberTopPlayer = this.add.sprite(
      -this.bg_InputTopPlayer.displayWidth / 2.4,
      -this.bg_InputTopPlayer.displayHeight / 0.9,
      "spr_numberTopPlayer",
      number
    );
    this.spr_numberTopPlayer.setOrigin(0.5, 0.5);
    this.spr_numberTopPlayer.setScale(1.2);
    this.spr_numberTopPlayer.setDepth(1030);

    this.boder_avatar = this.add.image(
      -this.bg_InputTopPlayer.displayWidth / 3.4,
      -this.bg_InputTopPlayer.displayHeight / 0.9,
      "boder_avatar"
    );
    this.boder_avatar.setOrigin(0.5, 0.5);
    this.boder_avatar.setScale(1);
    this.boder_avatar.setDepth(1030);

    // Add avatar image inside the border
    this.avatar_image = this.add.image(
      this.boder_avatar.x,
      this.boder_avatar.y,
      "default_avatar"
    );
    this.avatar_image.setOrigin(0.5, 0.5);

    // Make the avatar fit inside the border
    const borderWidth = this.boder_avatar.displayWidth * 0.8;
    const borderHeight = this.boder_avatar.displayHeight * 0.8;

    // Set avatar size to fit within the border
    const scaleX = borderWidth / this.avatar_image.width;
    const scaleY = borderHeight / this.avatar_image.height;
    const scale = Math.min(scaleX, scaleY);

    this.avatar_image.setScale(scale);
    this.avatar_image.setDepth(1029); // Set depth lower than border so it appears behind it

    this.icon_TopPlayer = this.add.sprite(
      this.bg_InputTopPlayer.displayWidth / 3,
      -this.bg_InputTopPlayer.displayHeight / 0.9,
      "spr_iconTopPlayer",
      0
    );
    this.icon_TopPlayer.setOrigin(0.5, 0.5);
    this.icon_TopPlayer.setScale(1.25);
    this.icon_TopPlayer.setDepth(1030);
  }
  private createScoreTopPlayer(score: number, playerName: string) {
    const scoreString = score.toString();

    // Xóa các sprite cũ nếu có
    this.digitSprites.forEach((sprScore) => sprScore.destroy());
    this.digitSprites = [];

    // Định nghĩa kích thước và vị trí
    const digitWidth = 13; // Khoảng cách giữa các chữ số
    const startX = -this.bg_InputTopPlayer.displayWidth / 4.9; // Vị trí bắt đầu, cùng vị trí với icon_TopPlayer
    const startY = -this.bg_InputTopPlayer.displayHeight / 0.8; // Vị trí y, cùng hàng với icon

    // Tạo sprite cho từng chữ số
    for (let i = 0; i < scoreString.length; i++) {
      const digit = parseInt(scoreString[i]);
      const x = startX + i * digitWidth; // Tính toán vị trí x cho mỗi chữ số

      this.scoreTopPlayer = this.add.sprite(x, startY, "scoreTopPlayer", digit);
      this.scoreTopPlayer.setOrigin(0, 0.5);
      this.scoreTopPlayer.setScale(0.6);
      this.scoreTopPlayer.setDepth(1035);
      this.digitSprites.push(this.scoreTopPlayer);
    }

    // Hiển thị tên người chơi
    const nameX = -this.bg_InputTopPlayer.displayWidth / 4.4; // Vị trí X của tên
    const nameY = -this.bg_InputTopPlayer.displayHeight / 1.1; // Cùng hàng với điểm số

    // Tạo style cho văn bản - sử dụng kích thước tương đối với kích thước của điểm số
    const scoreScale = 0.6; // Scale của các chữ số điểm
    const baseFontSize = 18; // Kích thước cơ bản
    const scaledFontSize = Math.round(baseFontSize / scoreScale); // Điều chỉnh kích thước font để tương ứng với scale

    // Kiểm tra độ dài tên người chơi và cắt ngắn nếu cần
    let displayName = playerName;
    const maxLength = 13;
    if (playerName.length > maxLength) {
      displayName = playerName.substring(0, maxLength) + "...";
    }

    const textStyle = {
      fontFamily: "Inter",
      fontSize: `${scaledFontSize}px`, // Sử dụng kích thước phù hợp khi điểm được scale
      color: "#FFFFFF",
      strokeThickness: 2,
      padding: {
        left: 15,
        right: 15,
        top: 5,
        bottom: 5,
      },
    };

    // Tạo text và gán vào thuộc tính nameText
    this.nameText = this.add.text(nameX, nameY, displayName, textStyle);
    this.nameText.setOrigin(0, 0.5);
    this.nameText.setDepth(1035);
    this.nameText.setScale(scoreScale); // Scale văn bản giống như scale của điểm số
  }
  // Method to update avatar with URL
  public updateAvatar(imageUrl: string) {
    // Đảm bảo avatar_image đã được khởi tạo
    if (!this.avatar_image || !this.boder_avatar) {
      console.error("Avatar image or border not initialized");
      return;
    }

    console.log("Updating avatar with URL:", imageUrl);

    // Create a new texture loader for the dynamic image
    const textureKey = "avatar_" + Date.now(); // Create unique key

    // Lưu lại đường dẫn cũ
    const oldPath = this.load.path;

    // Đặt lại đường dẫn thành rỗng để không thêm tiền tố
    this.load.setPath("");

    // Dùng proxy server thay vì truy cập trực tiếp URL
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    console.log("Loading image from:", proxyUrl);

    // Load the image from URL through proxy
    this.load.image(textureKey, proxyUrl);

    // Xử lý lỗi nếu không tải được
    this.load.once("loaderror", (fileObj: any) => {
      console.error("Failed to load image:", fileObj);
      // Khôi phục đường dẫn cũ
      this.load.setPath(oldPath);

      this.avatar_image.setTexture("default_avatar");

      // Scale default avatar
      const borderWidth = this.boder_avatar.displayWidth * 0.8;
      const borderHeight = this.boder_avatar.displayHeight * 0.8;
      const scaleX = borderWidth / this.avatar_image.width;
      const scaleY = borderHeight / this.avatar_image.height;
      this.avatar_image.setScale(Math.min(scaleX, scaleY));
    });

    this.load.once("complete", () => {
      console.log("Image loaded successfully:", textureKey);
      // Khôi phục đường dẫn cũ
      this.load.setPath(oldPath);

      // Đảm bảo texture tồn tại trong cache
      if (this.textures.exists(textureKey)) {
        // Replace the current avatar with the new one
        this.avatar_image.setTexture(textureKey);
        console.log("Texture set successfully");

        // Recalculate scale to fit within the border
        const borderWidth = this.boder_avatar.displayWidth * 0.8;
        const borderHeight = this.boder_avatar.displayHeight * 0.8;

        const scaleX = borderWidth / this.avatar_image.width;
        const scaleY = borderHeight / this.avatar_image.height;
        const scale = Math.min(scaleX, scaleY);

        this.avatar_image.setScale(scale);
      } else {
        console.error("Texture not found in cache:", textureKey);
        this.avatar_image.setTexture("default_avatar");
      }
    });

    // Start loading
    this.load.start();
  }
  // Phương thức để hiển thị một người chơi từ dữ liệu
  public displayPlayer(playerData: PlayerData) {
    // Cập nhật thông tin người chơi
    this.createNumberTopPlayer(playerData.rank);
    this.createScoreTopPlayer(playerData.score, playerData.playerName);

    // Cập nhật avatar
    this.updateAvatar(playerData.avatarUrl);
  }
  // Thêm phương thức mới để hiển thị nhiều người chơi
  public displayAllPlayers(players: PlayerData[]) {
    // Xóa tất cả dữ liệu hiển thị cũ nếu có
    this.clearAllPlayerDisplays();

    // Khoảng cách tính theo phần trăm chiều cao của background chính
    const spacingPercentage = 0.14; // 15% chiều cao của bg_topPlayer
    const spacing = this.bg_topPlayer.displayHeight * spacingPercentage;

    // Hiển thị từng người chơi
    players.forEach((player, index) => {
      // Tính toán offset Y dựa trên index
      const yOffset = index * spacing;

      // Tạo và hiển thị thông tin người chơi
      this.createPlayerInputAtPosition(player, yOffset);
    });
  }

  // Phương thức để xóa tất cả hiển thị người chơi hiện tại
  private clearAllPlayerDisplays() {
    // Xóa tất cả các thành phần đã tạo
    this.playerRanks.forEach((rank) => rank.destroy());
    this.playerAvatarBorders.forEach((border) => border.destroy());
    this.playerAvatars.forEach((avatar) => avatar.destroy());
    this.playerIcons.forEach((icon) => icon.destroy());
    this.playerScoreDigits.forEach((digits) =>
      digits.forEach((digit) => digit.destroy())
    );
    this.playerNames.forEach((name) => name.destroy());
    this.playerInputBgs.forEach((bg) => bg.destroy());

    // Làm trống các mảng
    this.playerRanks = [];
    this.playerAvatarBorders = [];
    this.playerAvatars = [];
    this.playerIcons = [];
    this.playerScoreDigits = [];
    this.playerNames = [];
    this.playerInputBgs = [];
  }

  // Phương thức để tạo thông tin người chơi tại vị trí Y cụ thể
  private createPlayerInputAtPosition(playerData: PlayerData, yOffset: number) {
    // Vị trí cơ sở Y (giống như trong createNumberTopPlayer)
    const baseY = -this.bg_topPlayer.displayHeight / 7;

    // Vị trí Y hiện tại với offset
    const currentY = baseY + yOffset;

    // ----- TẠO BACKGROUND CHO TỪNG NGƯỜI CHƠI -----
    const inputBg = this.add.image(0, currentY, "bg_InputTopPlayer");
    inputBg.setOrigin(0.5, 0.5);
    inputBg.setScale(1);
    inputBg.setDepth(1030);
    this.playerInputBgs.push(inputBg);

    // ----- HIỂN THỊ SỐ THỨ TỰ -----
    const rankSprite = this.add.sprite(
      -inputBg.displayWidth / 2.4,
      currentY,
      "spr_numberTopPlayer",
      playerData.rank // Frame bắt đầu từ 0
    );
    rankSprite.setOrigin(0.5, 0.5);
    rankSprite.setScale(1.2);
    rankSprite.setDepth(1030);
    this.playerRanks.push(rankSprite);

    // ----- HIỂN THỊ AVATAR -----
    const borderAvatar = this.add.image(
      -inputBg.displayWidth / 3.4,
      currentY,
      "boder_avatar"
    );
    borderAvatar.setOrigin(0.5, 0.5);
    borderAvatar.setScale(1);
    borderAvatar.setDepth(1030);
    this.playerAvatarBorders.push(borderAvatar);

    // Tạo avatar
    const avatar = this.add.image(
      borderAvatar.x,
      borderAvatar.y,
      "default_avatar"
    );
    avatar.setOrigin(0.5, 0.5);
    avatar.setDepth(1029);

    // Điều chỉnh kích thước avatar
    const borderWidth = borderAvatar.displayWidth * 0.8;
    const borderHeight = borderAvatar.displayHeight * 0.8;
    const scaleX = borderWidth / avatar.width;
    const scaleY = borderHeight / avatar.height;
    const scale = Math.min(scaleX, scaleY);
    avatar.setScale(scale);

    this.playerAvatars.push(avatar);

    // ----- HIỂN THỊ ICON -----
    const iconTopPlayer = this.add.sprite(
      inputBg.displayWidth / 3,
      currentY,
      "spr_iconTopPlayer",
      playerData.rank - 1
    );
    iconTopPlayer.setOrigin(0.5, 0.5);
    iconTopPlayer.setScale(1.25);
    iconTopPlayer.setDepth(1030);
    this.playerIcons.push(iconTopPlayer);

    // ----- HIỂN THỊ ĐIỂM SỐ -----
    const scoreString = playerData.score.toString();
    const digitWidth = 13;
    const startX = -inputBg.displayWidth / 4.9;
    const scoreY = currentY - inputBg.displayHeight / 10.5;
    const scoreScale = 0.6;

    // Mảng chứa chữ số của người chơi này
    const playerDigits: Phaser.GameObjects.Sprite[] = [];

    // Tạo sprite cho từng chữ số
    for (let i = 0; i < 3; i++) {
      const digit = parseInt(scoreString[i]);
      const x = startX + i * digitWidth;

      const digitSprite = this.add.sprite(x, scoreY, "scoreTopPlayer", digit);
      digitSprite.setOrigin(0, 0.5);
      digitSprite.setScale(scoreScale);
      digitSprite.setDepth(1035);

      playerDigits.push(digitSprite);
    }

    this.playerScoreDigits.push(playerDigits);

    // ----- HIỂN THỊ TÊN NGƯỜI CHƠI -----
    const trimmedName = playerData.playerName.trim();
    const maxLength = 13;
    let displayName = trimmedName;
    if (trimmedName.length > maxLength) {
      displayName = trimmedName.substring(0, maxLength) + "...";
    }

    const nameX = -inputBg.displayWidth / 4.6;
    const nameY = currentY + inputBg.displayHeight / 6;

    const baseFontSize = 18;
    const scaledFontSize = Math.round(baseFontSize / scoreScale);

    const textStyle = {
      fontFamily: "Inter",
      fontSize: `${scaledFontSize}px`,
      color: "#FFFFFF",
      strokeThickness: 2,
      padding: {
        left: 15,
        right: 15,
        top: 5,
        bottom: 5,
      },
    };

    const nameText = this.add.text(nameX, nameY, displayName, textStyle);
    nameText.setOrigin(0, 0.5);
    nameText.setDepth(1035);
    nameText.setScale(scoreScale);
    this.playerNames.push(nameText);

    // Thêm tất cả thành phần vào container
    this.containerTopPlayer.add([
      inputBg,
      rankSprite,
      borderAvatar,
      avatar,
      iconTopPlayer,
      ...playerDigits,
      nameText,
    ]);

    // Cập nhật avatar nếu có URL
    this.loadPlayerAvatar(avatar, borderAvatar, playerData.avatarUrl);
  }

  // Phương thức mới để tải avatar riêng cho từng người chơi
  private loadPlayerAvatar(
    avatarImage: Phaser.GameObjects.Image,
    borderAvatar: Phaser.GameObjects.Image,
    imageUrl: string
  ) {
    if (!avatarImage || !borderAvatar) {
      console.error("Avatar image or border not initialized");
      return;
    }

    console.log("Loading avatar:", imageUrl);

    const textureKey =
      "avatar_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 15);
    const oldPath = this.load.path;
    this.load.setPath("");

    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;

    this.load.image(textureKey, proxyUrl);

    this.load.once("loaderror", (fileObj: any) => {
      console.error("Failed to load image:", fileObj);
      this.load.setPath(oldPath);
      avatarImage.setTexture("default_avatar");

      const borderWidth = borderAvatar.displayWidth * 0.8;
      const borderHeight = borderAvatar.displayHeight * 0.8;
      const scaleX = borderWidth / avatarImage.width;
      const scaleY = borderHeight / avatarImage.height;
      avatarImage.setScale(Math.min(scaleX, scaleY));
    });

    this.load.once("complete", () => {
      this.load.setPath(oldPath);

      if (this.textures.exists(textureKey)) {
        avatarImage.setTexture(textureKey);

        const borderWidth = borderAvatar.displayWidth * 0.8;
        const borderHeight = borderAvatar.displayHeight * 0.8;
        const scaleX = borderWidth / avatarImage.width;
        const scaleY = borderHeight / avatarImage.height;
        const scale = Math.min(scaleX, scaleY);
        avatarImage.setScale(scale);
      } else {
        console.error("Texture not found in cache:", textureKey);
        avatarImage.setTexture("default_avatar");
      }
    });

    this.load.start();
  }
}
