"use client";
import MenuLoginScene from "./MenuLoginScene";

interface PlayerData {
  rank: number;
  playerName: string;
  score: number;
  avatarUrl: string;
}

// Định nghĩa interface cho dữ liệu API
interface ApiPlayerData {
  id?: string;
  username: string | null;
  score: number;
  rank: number;
  profile_id?: string;
  avatar_url: string | null;
  updated_at?: string;
}

interface TopPlayersResponse {
  count: number;
  data: ApiPlayerData[];
}

interface ApiResponse {
  topPlayers: TopPlayersResponse;
  me: ApiPlayerData[];
  error?: {
    message: string;
  };
}

export default class TopPlayerScene extends Phaser.Scene {
  // Background và container
  private bg_topPlayer!: Phaser.GameObjects.Image;
  private containerTopPlayer!: Phaser.GameObjects.Container;
  private btn_back!: Phaser.GameObjects.Sprite;
  private icon_infinity!: Phaser.GameObjects.Image;

  // Mảng lưu trữ các thành phần cho danh sách người chơi
  private playerRanks: Phaser.GameObjects.Sprite[] = [];
  private playerAvatarBorders: Phaser.GameObjects.Image[] = [];
  private playerAvatars: Phaser.GameObjects.Image[] = [];
  private playerIcons: Phaser.GameObjects.Sprite[] = [];
  private playerScoreDigits: Phaser.GameObjects.Sprite[][] = [];
  private playerNames: Phaser.GameObjects.Text[] = [];
  private playerInputBgs: Phaser.GameObjects.Image[] = [];

  // Các thuộc tính cho hiển thị người chơi đặc biệt
  private spr_numberTopPlayer!: Phaser.GameObjects.Sprite;
  private boder_avatar!: Phaser.GameObjects.Image;
  private icon_TopPlayer!: Phaser.GameObjects.Sprite;
  private avatar_image!: Phaser.GameObjects.Image;
  private scoreTopPlayer!: Phaser.GameObjects.Sprite;
  private digitSprites: Phaser.GameObjects.Sprite[] = [];
  private nameText!: Phaser.GameObjects.Text;
  private isLoadingApi: boolean = false;
  private needRefresh: boolean = false;

  // Dữ liệu từ API
  private apiTopPlayers: PlayerData[] = [];
  private apiCurrentPlayer: PlayerData | null = null;

  // Dữ liệu test
  private testPlayerData1: PlayerData[] = [
    {
      rank: 99,
      playerName: "Nguyễn Văn 873",
      score: 2,
      avatarUrl:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg",
    },
  ];
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

  // Tải tài nguyên cần thiết
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
    this.load.image("icon_infinity", "icon_infinity.png");
  }

  // Khởi tạo scene
  create() {
    this.API_TopPlayer();
    this.createContainerTopPlayer();
    this.containerTopPlayer.setVisible(false);
  }

  public API_TopPlayer = async () => {
    try {
      if (this.isLoadingApi) return;

      // Đánh dấu đang tải dữ liệu
      this.isLoadingApi = true;

      const response = await fetch("/api/topPlayer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as ApiResponse;

      console.log("Top Player API response:", data);

      if (data.error) {
        console.log("API error:", data.error.message);
        return;
      }

      // Xử lý dữ liệu top players
      if (data.topPlayers.data && Array.isArray(data.topPlayers.data)) {
        this.apiTopPlayers = data.topPlayers.data.map((player) => ({
          rank: player.rank,
          playerName: player.username || "",
          score: player.score,
          avatarUrl: player.avatar_url || "default_avatar.jpg",
        }));
      }

      // Xử lý dữ liệu người chơi hiện tại
      if (data.me && data.me.length > 0) {
        const currentPlayer = data.me[0];
        this.apiCurrentPlayer = {
          rank: currentPlayer.rank,
          playerName: currentPlayer.username || "",
          score: currentPlayer.score,
          avatarUrl: currentPlayer.avatar_url || "default_avatar.jpg",
        };
      } else {
        // Tạo dữ liệu mặc định nếu không có thông tin người chơi hiện tại
        this.apiCurrentPlayer = {
          rank: 0,
          playerName: "You",
          score: 0,
          avatarUrl: "asset/default_avatar.jpg",
        };
      }

      // Hiển thị thông tin người chơi hiện tại nếu UI đang hiển thị
      if (
        this.containerTopPlayer &&
        (this.containerTopPlayer.visible || this.needRefresh)
      ) {
        // Xóa các hiển thị cũ
        this.clearAllPlayerDisplays();

        // Hiển thị danh sách người chơi top
        if (this.apiTopPlayers.length > 0) {
          this.displayAllPlayers(this.apiTopPlayers);
        } else {
          // Nếu không có dữ liệu, dùng dữ liệu test
          this.displayAllPlayers(this.testPlayerData);
        }

        // Hiển thị người chơi hiện tại (với tham số true để có hiệu ứng đặc biệt)
        if (this.apiCurrentPlayer) {
          this.displayPlayer(this.apiCurrentPlayer, true);
        }

        // Reset cờ làm mới - đã hoàn thành việc cập nhật
        this.needRefresh = false;
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("API error:", error);
    } finally {
      // Đảm bảo luôn đánh dấu đã tải xong, dù có lỗi hay không
      this.isLoadingApi = false;
    }
  };

  // Tạo container chính chứa tất cả thành phần
  private createContainerTopPlayer() {
    this.containerTopPlayer = this.add.container(
      this.scale.width / 2,
      this.scale.height / 1.8
    );

    this.createBackground();
    this.createBtnBack();

    // Thêm background và nút vào container
    this.containerTopPlayer.add([this.bg_topPlayer, this.btn_back]);

    // Hiển thị dữ liệu từ API nếu có, nếu không thì hiển thị dữ liệu test
    if (this.apiTopPlayers.length > 0) {
      this.displayAllPlayers(this.apiTopPlayers);
      if (this.apiCurrentPlayer) {
        this.displayPlayer(this.apiCurrentPlayer, true);
      }
    } else {
      // Hiển thị dữ liệu test khi chưa có dữ liệu API
      this.displayAllPlayers(this.testPlayerData);
      this.displayPlayer(this.testPlayerData1[0]);
    }

    // Thiết lập scale và độ sâu cho container
    const baseWidth = this.bg_topPlayer.width;
    const targetWidth = this.scale.width * 0.95;
    const containerScale = targetWidth / baseWidth;
    this.containerTopPlayer.setScale(containerScale);
    this.containerTopPlayer.setDepth(1029);
    this.containerTopPlayer.setVisible(true);
    this.containerTopPlayer.setAlpha(1);
  }

  // Hiển thị container
  public showContainerTopPlayer() {
    if (!this.containerTopPlayer) {
      this.createContainerTopPlayer();
    } else {
      // Cập nhật dữ liệu mới nhất khi hiển thị lại
      if (this.apiTopPlayers.length > 0) {
        this.displayAllPlayers(this.apiTopPlayers);
        if (this.apiCurrentPlayer) {
          this.displayPlayer(this.apiCurrentPlayer, true);
        }
      }
    }
    this.containerTopPlayer.setVisible(true);
  }

  // Ẩn container
  public hideContainerTopPlayer() {
    if (!this.containerTopPlayer) {
      return;
    }
    this.containerTopPlayer.setVisible(false);
  }

  // Tạo background chính
  private createBackground() {
    this.bg_topPlayer = this.add.image(0, 0, "bg_topPlayer");
    this.bg_topPlayer.setOrigin(0.5, 0.5);
    this.bg_topPlayer.setScale(0.9);
    this.bg_topPlayer.setDepth(1030);
  }

  // Tạo nút quay lại
  private createBtnBack() {
    this.btn_back = this.add.sprite(
      0,
      this.bg_topPlayer.displayHeight / 2,
      "btn_back",
      0
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

  // Hiển thị một người chơi đặc biệt (từ API hoặc người chơi hiện tại)
  public displayPlayer(playerData: PlayerData, isCurrentUser: boolean = false) {
    // Xóa các đối tượng liên quan đến người chơi đặc biệt nếu đã có trước đó
    if (this.nameText) this.nameText.destroy();
    if (this.spr_numberTopPlayer) this.spr_numberTopPlayer.destroy();
    if (this.boder_avatar) this.boder_avatar.destroy();
    if (this.avatar_image) this.avatar_image.destroy();
    if (this.icon_TopPlayer) this.icon_TopPlayer.destroy();
    if (this.scoreTopPlayer) this.scoreTopPlayer.destroy();
    this.digitSprites.forEach((sprite) => sprite.destroy());
    this.digitSprites = [];

    // Vị trí hiển thị cho người chơi đặc biệt (dưới top players)
    const topPlayersHeight =
      this.testPlayerData.length * (this.bg_topPlayer.displayHeight * 0.14);
    const additionalGap = 30;
    const specialY =
      -this.bg_topPlayer.displayHeight / 7 + topPlayersHeight + additionalGap;

    // Điều chỉnh vị trí Y cao hơn 15px
    const adjustedY = specialY - 23;

    // Tạo background
    const inputBg = this.add.image(0, adjustedY, "bg_InputTopPlayer");
    inputBg.setOrigin(0.5, 0.5);
    inputBg.setScale(1.1);
    inputBg.setDepth(1080);

    this.playerInputBgs.push(inputBg);

    // Hiển thị xếp hạng - tạo sprite riêng cho mỗi chữ số
    const rankString = playerData.rank.toString();
    const rankDigitWidth = 17; // Khoảng cách giữa các chữ số
    const rankSprites: Phaser.GameObjects.Sprite[] = [];

    // Kiểm tra nếu số xếp hạng có nhiều hơn 2 chữ số
    if (rankString.length > 2) {
      // Hiển thị biểu tượng vô cực thay vì số
      this.icon_infinity = this.add.image(
        -inputBg.displayWidth / 2.4,
        adjustedY,
        "icon_infinity"
      );
      this.icon_infinity.setOrigin(0.5, 0.5);
      this.icon_infinity.setScale(1);
      this.icon_infinity.setDepth(1080);

      // Thêm vào container sau
      rankSprites.push(this.icon_infinity as any);

      // Giữ tham chiếu cho spr_numberTopPlayer để tránh lỗi
      const hiddenRankSprite = this.add.sprite(
        -inputBg.displayWidth / 2.25,
        adjustedY,
        "spr_numberTopPlayer",
        0
      );
      hiddenRankSprite.setVisible(false);
      this.spr_numberTopPlayer = hiddenRankSprite;
      this.playerRanks.push(hiddenRankSprite);
    } else {
      // Hiển thị bình thường các chữ số của xếp hạng
      for (let i = 0; i < rankString.length; i++) {
        const digit = parseInt(rankString[i]);
        const xOffset = i * rankDigitWidth;

        const rankSprite = this.add.sprite(
          -inputBg.displayWidth / 2.25 + xOffset,
          adjustedY,
          "spr_numberTopPlayer",
          digit
        );
        rankSprite.setOrigin(0.5, 0.5);
        rankSprite.setScale(1.2);
        rankSprite.setDepth(1080);

        rankSprites.push(rankSprite);
        this.playerRanks.push(rankSprite);
      }
    }

    // Lưu sprite đầu tiên làm this.spr_numberTopPlayer để tương thích với code cũ
    if (rankSprites.length > 0 && !this.spr_numberTopPlayer) {
      this.spr_numberTopPlayer = rankSprites[0] as Phaser.GameObjects.Sprite;
    }

    // Hiển thị avatar và viền
    const borderAvatar = this.add.image(
      -inputBg.displayWidth / 3.4,
      adjustedY,
      "boder_avatar"
    );
    borderAvatar.setOrigin(0.5, 0.5);
    borderAvatar.setScale(1);
    borderAvatar.setDepth(1080);

    if (isCurrentUser) {
      borderAvatar.setTint(0x4b9cd3); // Màu xanh lam cho viền người dùng hiện tại
    }

    this.playerAvatarBorders.push(borderAvatar);
    this.boder_avatar = borderAvatar;

    const avatar = this.add.image(
      borderAvatar.x,
      borderAvatar.y,
      "default_avatar"
    );
    avatar.setOrigin(0.5, 0.5);
    avatar.setDepth(1080);

    // Điều chỉnh kích thước avatar vừa với viền
    const borderWidth = borderAvatar.displayWidth * 0.8;
    const borderHeight = borderAvatar.displayHeight * 0.8;
    const scaleX = borderWidth / avatar.width;
    const scaleY = borderHeight / avatar.height;
    const scale = Math.min(scaleX, scaleY);
    avatar.setScale(scale);

    this.playerAvatars.push(avatar);
    this.avatar_image = avatar;

    // Hiển thị icon
    const iconTopPlayer = this.add.sprite(
      inputBg.displayWidth / 3,
      adjustedY,
      "spr_iconTopPlayer",
      3
    );
    iconTopPlayer.setOrigin(0.5, 0.5);
    iconTopPlayer.setScale(1.25);
    iconTopPlayer.setDepth(1080);
    this.playerIcons.push(iconTopPlayer);
    this.icon_TopPlayer = iconTopPlayer;

    // Hiển thị điểm số
    const scoreString = playerData.score.toString();
    const digitWidth = 13;
    const startX = -inputBg.displayWidth / 4.9;
    const scoreY = adjustedY - inputBg.displayHeight / 10.5;
    const scoreScale = 0.6;

    const playerDigits: Phaser.GameObjects.Sprite[] = [];

    // Hiển thị đúng số lượng chữ số của điểm số
    for (let i = 0; i < scoreString.length; i++) {
      const digit = parseInt(scoreString[i]);

      const x = startX + i * digitWidth;
      const digitSprite = this.add.sprite(x, scoreY, "scoreTopPlayer", digit);
      digitSprite.setOrigin(0, 0.5);
      digitSprite.setScale(scoreScale);
      digitSprite.setDepth(1080);

      playerDigits.push(digitSprite);
      this.digitSprites.push(digitSprite);
    }

    this.playerScoreDigits.push(playerDigits);

    // Hiển thị tên người chơi
    const trimmedName = playerData.playerName.trim();
    const maxLength = 13;
    let displayName = trimmedName;
    if (trimmedName.length > maxLength) {
      displayName = trimmedName.substring(0, maxLength) + "...";
    }

    const nameX = -inputBg.displayWidth / 4.6;
    const nameY = adjustedY + inputBg.displayHeight / 6;

    const baseFontSize = 18;
    const scaledFontSize = Math.round(baseFontSize / scoreScale);

    const textStyle = {
      fontFamily: "Inter",
      fontSize: `${scaledFontSize}px`,
      color: "#FFFFFF",
      strokeThickness: 2,
      fontStyle: isCurrentUser ? "bold" : "normal",
      padding: {
        left: 15,
        right: 15,
        top: 5,
        bottom: 5,
      },
    };

    const nameText = this.add.text(nameX, nameY, displayName, textStyle);
    nameText.setOrigin(0, 0.5);
    nameText.setDepth(1080);
    nameText.setScale(scoreScale);
    this.playerNames.push(nameText);
    this.nameText = nameText;

    // Thêm tất cả thành phần vào container
    const elements = [
      inputBg,
      ...rankSprites, // Thêm tất cả các sprite của rank
      borderAvatar,
      avatar,
      iconTopPlayer,
      ...playerDigits,
      nameText,
    ];

    this.containerTopPlayer.add(elements);

    // Tải và cập nhật avatar
    this.loadPlayerAvatar(avatar, borderAvatar, playerData.avatarUrl);
  }

  // Hiển thị danh sách người chơi top
  public displayAllPlayers(players: PlayerData[]) {
    this.clearAllPlayerDisplays();

    const spacingPercentage = 0.14; // Khoảng cách 14% chiều cao background
    const spacing = this.bg_topPlayer.displayHeight * spacingPercentage;

    players.forEach((player, index) => {
      const yOffset = index * spacing;
      this.createPlayerInputAtPosition(player, yOffset);
    });
  }

  // Xóa hiển thị danh sách người chơi
  private clearAllPlayerDisplays() {
    this.playerRanks.forEach((rank) => rank.destroy());
    this.playerAvatarBorders.forEach((border) => border.destroy());
    this.playerAvatars.forEach((avatar) => avatar.destroy());
    this.playerIcons.forEach((icon) => icon.destroy());
    this.playerScoreDigits.forEach((digits) =>
      digits.forEach((digit) => digit.destroy())
    );
    this.playerNames.forEach((name) => name.destroy());
    this.playerInputBgs.forEach((bg) => bg.destroy());

    this.playerRanks = [];
    this.playerAvatarBorders = [];
    this.playerAvatars = [];
    this.playerIcons = [];
    this.playerScoreDigits = [];
    this.playerNames = [];
    this.playerInputBgs = [];
  }

  // Tạo hiển thị cho một người chơi trong danh sách
  private createPlayerInputAtPosition(playerData: PlayerData, yOffset: number) {
    const baseY = -this.bg_topPlayer.displayHeight / 7;
    const currentY = baseY + yOffset;

    // Tạo background
    const inputBg = this.add.image(0, currentY, "bg_InputTopPlayer");
    inputBg.setOrigin(0.5, 0.5);
    inputBg.setScale(1);
    inputBg.setDepth(1030);
    this.playerInputBgs.push(inputBg);

    // Hiển thị xếp hạng
    const rankSprite = this.add.sprite(
      -inputBg.displayWidth / 2.4,
      currentY,
      "spr_numberTopPlayer",
      playerData.rank
    );
    rankSprite.setOrigin(0.5, 0.5);
    rankSprite.setScale(1.2);
    rankSprite.setDepth(1030);
    this.playerRanks.push(rankSprite);

    // Hiển thị avatar và viền
    const borderAvatar = this.add.image(
      -inputBg.displayWidth / 3.4,
      currentY,
      "boder_avatar"
    );
    borderAvatar.setOrigin(0.5, 0.5);
    borderAvatar.setScale(1);
    borderAvatar.setDepth(1030);
    this.playerAvatarBorders.push(borderAvatar);

    const avatar = this.add.image(
      borderAvatar.x,
      borderAvatar.y,
      "default_avatar"
    );
    avatar.setOrigin(0.5, 0.5);
    avatar.setDepth(1029);

    // Điều chỉnh kích thước avatar vừa với viền
    const borderWidth = borderAvatar.displayWidth * 0.8;
    const borderHeight = borderAvatar.displayHeight * 0.8;
    const scaleX = borderWidth / avatar.width;
    const scaleY = borderHeight / avatar.height;
    const scale = Math.min(scaleX, scaleY);
    avatar.setScale(scale);
    this.playerAvatars.push(avatar);

    // Hiển thị icon
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

    // Hiển thị điểm số
    const scoreString = playerData.score.toString();
    const digitWidth = 13;
    const startX = -inputBg.displayWidth / 4.9;
    const scoreY = currentY - inputBg.displayHeight / 10.5;
    const scoreScale = 0.6;

    const playerDigits: Phaser.GameObjects.Sprite[] = [];

    // Hiển thị tối đa 3 chữ số
    for (let i = 0; i < scoreString.length; i++) {
      let digit = 0;
      if (i < scoreString.length) {
        digit = parseInt(scoreString[i]);
      }

      const x = startX + i * digitWidth;
      const digitSprite = this.add.sprite(x, scoreY, "scoreTopPlayer", digit);
      digitSprite.setOrigin(0, 0.5);
      digitSprite.setScale(scoreScale);
      digitSprite.setDepth(1035);
      playerDigits.push(digitSprite);
    }
    this.playerScoreDigits.push(playerDigits);

    // Hiển thị tên người chơi
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

    // Tải và cập nhật avatar
    this.loadPlayerAvatar(avatar, borderAvatar, playerData.avatarUrl);
  }

  // Tải avatar từ URL qua proxy
  private loadPlayerAvatar(
    avatarImage: Phaser.GameObjects.Image,
    borderAvatar: Phaser.GameObjects.Image,
    imageUrl: string
  ) {
    if (!avatarImage || !borderAvatar) {
      console.error("Avatar image or border not initialized");
      return;
    }

    // Tạo key duy nhất cho texture
    const textureKey =
      "avatar_" +
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2, 15);

    const oldPath = this.load.path;
    this.load.setPath("");

    // Sử dụng proxy để tránh vấn đề CORS
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    this.load.image(textureKey, proxyUrl);

    // Xử lý lỗi khi tải ảnh
    this.load.once("loaderror", () => {
      this.load.setPath(oldPath);
      avatarImage.setTexture("default_avatar");

      // Điều chỉnh kích thước avatar mặc định
      const borderWidth = borderAvatar.displayWidth * 0.8;
      const borderHeight = borderAvatar.displayHeight * 0.8;
      const scaleX = borderWidth / avatarImage.width;
      const scaleY = borderHeight / avatarImage.height;
      avatarImage.setScale(Math.min(scaleX, scaleY));
    });

    // Xử lý khi tải thành công
    this.load.once("complete", () => {
      this.load.setPath(oldPath);

      if (this.textures.exists(textureKey)) {
        avatarImage.setTexture(textureKey);

        // Điều chỉnh kích thước avatar mới
        const borderWidth = borderAvatar.displayWidth * 0.8;
        const borderHeight = borderAvatar.displayHeight * 0.8;
        const scaleX = borderWidth / avatarImage.width;
        const scaleY = borderHeight / avatarImage.height;
        const scale = Math.min(scaleX, scaleY);
        avatarImage.setScale(scale);
      } else {
        avatarImage.setTexture("default_avatar");
      }
    });

    this.load.start();
  }
}
