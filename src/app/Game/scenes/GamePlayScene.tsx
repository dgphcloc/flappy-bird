"use client";
import AudioManager from "@/lib/audio/AudioManager";
export default class GamePlayScene extends Phaser.Scene {
  // Các hằng số
  private readonly BIRD_SCALE = 0.8; // Tỉ lệ kích thước của chim so với ảnh gốc
  private readonly BASE_GRAVITY = 0.3; // Giá trị cơ bản cho trọng lực (pixel/frame)
  private readonly BASE_JUMP_FORCE = -6; // Giá trị cơ bản cho lực nhảy (pixel/frame)
  private readonly BIRD_ANIMATION_FRAME_RATE = 10; // Tốc độ animation của chim (frame/giây)
  private readonly PIPE_SPEED = -240; // Tốc độ di chuyển của ống (pixel/giây)
  private readonly INITIAL_PIPE_SPAWN_TIME = 1800; // Thời gian ban đầu
  private readonly FAST_PIPE_SPAWN_TIME = 1200; // Thời gian sau khi đạt 50 điểm
  private readonly PIPE_GAP_PERCENT = 0.2; // Khoảng cách giữa 2 ống tính theo % chiều cao scene
  private readonly GROUND_SCROLL_X = 2; // Tốc độ cuộn của mặt đất (pixel/frame)
  private readonly REFERENCE_HEIGHT = 720; // Chiều cao tham chiếu để tính tỉ lệ (pixel)

  // Đối tượng game
  private isActive: boolean = false; // Trạng thái hoạt động của scene
  private gameObjects: Phaser.GameObjects.GameObject[] = []; // Danh sách các đối tượng game
  private bird!: Phaser.Physics.Arcade.Sprite; // Đối tượng chim
  private birdVelocity: number = 0; // Vận tốc hiện tại của chim
  private firstClick: boolean = false; // Kiểm tra click đầu tiên
  private pipes!: Phaser.Physics.Arcade.Group; // Nhóm các ống
  private ground1!: Phaser.GameObjects.TileSprite; // Mặt đất 1
  private ground2!: Phaser.GameObjects.TileSprite; // Mặt đất 2
  private groundX: number = 0; // Vị trí X của mặt đất
  private score: number = 0; // Điểm số hiện tại
  private passedPipes: Set<Phaser.Physics.Arcade.Sprite> = new Set(); // Tập hợp các ống đã vượt qua
  private pipePairs: Map<number, Phaser.Physics.Arcade.Sprite[]> = new Map(); // Map lưu các cặp ống
  private lastPipeId: number = 0; // ID của ống cuối cùng
  private pipeSpawnEvent!: Phaser.Time.TimerEvent; // Thêm biến để lưu sự kiện tạo ống
  private digitSprites: Phaser.GameObjects.Sprite[] = []; // Mảng lưu trữ các sprite số
  private scoreSprites: Phaser.GameObjects.Sprite[] = []; // Mảng lưu trữ các sprite số
  private bestScoreSprites: Phaser.GameObjects.Sprite[] = []; // Mảng lưu trữ các sprite số
  private txtScore!: Phaser.GameObjects.Image; // Sprite background điểm số
  private txtBest!: Phaser.GameObjects.Image; // Sprite background điểm số
  private txtNewBest!: Phaser.GameObjects.Image; // Sprite background điểm số
  private scoreBg!: Phaser.GameObjects.Image; // Sprite background điểm số
  private gameOverF!: Phaser.GameObjects.Image; // Sprite background điểm số
  private scoreContainer!: Phaser.GameObjects.Container; // Container lưu trữ các sprite số
  private bestScoreContainer!: Phaser.GameObjects.Container; // Container lưu trữ các sprite số
  private sprBtnReset!: Phaser.GameObjects.Sprite; // Sprite background điểm số
  private sprBtnHome!: Phaser.GameObjects.Sprite; // Sprite background điểm số
  private bestScoredata!: number; // Điểm số tốt nhất
  // Tính toán các giá trị dựa trên tỉ lệ kích thước scene
  private get gravity(): number {
    const scaleFactor = this.scale.height / this.REFERENCE_HEIGHT; // Tỉ lệ giữa chiều cao thực tế và chiều cao tham chiếu
    return this.BASE_GRAVITY * scaleFactor; // Trọng lực được điều chỉnh theo tỉ lệ
  }

  private get jumpForce(): number {
    const scaleFactor = this.scale.height / this.REFERENCE_HEIGHT; // Tỉ lệ giữa chiều cao thực tế và chiều cao tham chiếu
    return this.BASE_JUMP_FORCE * scaleFactor; // Lực nhảy được điều chỉnh theo tỉ lệ
  }

  private get pipeGap(): number {
    return this.PIPE_GAP_PERCENT * this.scale.height; // Khoảng cách giữa 2 ống tính theo pixel
  }

  constructor() {
    super("GamePlayScene");
  }

  // Vòng đời Scene
  preload() {
    this.load.setPath("asset");
    this.load.audio("jump", "jumb1.wav");
    this.load.image("scoreBG", "score_bg.png");
    this.load.spritesheet("number_spr", "number_spritesheet.png", {
      frameWidth: 75,
      frameHeight: 95,
    });
    this.load.image("gameoverF", "FROM_GAMEOVER.png");
    this.load.image("ScoreNormal", "txt_SCORE.png");
    this.load.image("BestScore", "txt_BEST.png");
    this.load.image("NewBestScore", "txt_NEWBEST.png");
    this.load.spritesheet("score_spr", "score_spritesheet.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("btnRestart", "spr_btnReset.png", {
      frameWidth: 105,
      frameHeight: 74,
    });
    this.load.spritesheet("btnHome", "spr_btnHome.png", {
      frameWidth: 105,
      frameHeight: 74,
    });
  }

  create() {
    this.launchRequiredScenes();
    AudioManager.setScene(this);

    // Set maximum volume for all sound effects
    AudioManager.setSoundVolume(1.0);

    // Thiết lập physics
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // Ẩn ground từ BackgroundScene
    const backgroundScene = this.scene.get(
      "BackgroundScene"
    ) as Phaser.Scene & {
      hideGround: () => void;
      showGround: () => void;
    };
    if (backgroundScene && backgroundScene.hideGround) {
      backgroundScene.hideGround();
    }

    this.getScore();

    // Tạo các đối tượng game
    this.createGround();
    this.createPipes();
    this.createBird();
    this.createScoreSprites();
    this.setupInput();

    // Kích hoạt scene
    this.isActive = true;
    this.ActiveScene();
  }

  update() {
    if (!this.isActive) return;

    // Cập nhật chim
    if (this.firstClick) {
      this.birdVelocity += this.gravity;
    }
    this.bird.y += this.birdVelocity;
    this.bird.angle = this.birdVelocity * 2;

    // Kiểm tra va chạm và tính điểm
    this.updatePipes();
    this.checkGroundCollision();
    this.updateGround();
  }

  // Khởi tạo đối tượng
  private launchRequiredScenes() {
    if (!this.scene.isActive("BackgroundScene")) {
      this.scene.launch("BackgroundScene");
    }
  }

  private async getScore() {
    const response = await fetch("/api/auth/me", {
      method: "GET",
    });

    const data = await response.json();
    if (data) {
      this.bestScoredata = data.user.score;
    } else {
      this.bestScoredata = 0;
    }
  }

  private async updateScore() {
    await fetch("/api/updateScore", {
      method: "POST",
      body: JSON.stringify({ score: this.score }),
    });
  }

  private setupInput() {
    this.input.keyboard?.on("keydown-SPACE", () => this.jump());
    this.input.on("pointerdown", () => this.jump());
  }

  private createBird() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.bird = this.physics.add.sprite(width / 2, height / 2, "birdblue_spr");
    this.bird.setOrigin(0.5, 0.5);

    // Thiết lập thuộc tính chim
    this.bird.setCollideWorldBounds(true);
    this.bird.setBounce(0.2);
    this.bird.setDepth(0);
    this.bird.setScale(this.BIRD_SCALE);

    // Thiết lập texture
    this.bird.texture.setFilter(Phaser.Textures.LINEAR);
    this.bird.texture.source[0].setFilter(Phaser.Textures.LINEAR);

    // Tạo animation chim
    this.anims.create({
      key: "flappyGameplay",
      frames: this.anims.generateFrameNumbers("birdblue_spr", {
        start: 0,
        end: 3,
      }),
      frameRate: this.BIRD_ANIMATION_FRAME_RATE,
      repeat: -1,
    });

    this.bird.play("flappyGameplay");
    this.bird.setPipeline("TextureTintPipeline");
    this.gameObjects.push(this.bird);
  }

  private createPipes() {
    this.pipes = this.physics.add.group();
  }

  private createGround() {
    const widthGround = 1536;
    const heightGround = 468;

    // Tạo mặt đất 1
    this.ground1 = this.add
      .tileSprite(this.groundX, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000);
    this.ground1.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

    // Tạo mặt đất 2
    this.ground2 = this.add
      .tileSprite(this.groundX, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000);

    // Thiết lập scale và vị trí
    const groundScaleX = this.scale.width / widthGround;
    const groundScaleY = this.scale.height / heightGround;
    const groundScale = Math.min(groundScaleX, groundScaleY) * 1.3;

    this.ground1.setScale(groundScale);
    this.ground1.setPosition(this.scale.width / 2, this.scale.height);

    this.ground2.setScale(groundScale);
    this.ground2
      .setPosition(
        this.ground1.x + this.ground1.displayWidth,
        this.scale.height
      )
      .setFlipX(true);

    // Thêm physics body cho mặt đất
    this.physics.add.existing(this.ground1, true);
    this.physics.add.existing(this.ground2, true);

    this.gameObjects.push(this.ground1, this.ground2);
  }

  private ScoreBG() {
    this.scoreBg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 10 - 15,
      "scoreBG"
    );
    this.scoreBg.setOrigin(0.5, 0.5);
    this.scoreBg.setDepth(10005);
    this.scoreBg.setScale(0.5);
  }

  private GameOverF() {
    this.bestScoreContainer = this.add.container(0, 0);
    this.bestScoreContainer.setDepth(10007);

    // Center the container in the screen
    this.bestScoreContainer.setPosition(
      this.scale.width / 2,
      this.scale.height / 2
    );

    this.gameOverF = this.add.image(0, 0, "gameoverF");
    this.gameOverF.setOrigin(0.5, 0.5);
    this.gameOverF.setDepth(10005);

    // Calculate container scale based on screen dimensions
    const baseWidth = this.gameOverF.width;
    const targetWidth = this.scale.width * 0.9;
    const containerScale = targetWidth / baseWidth;

    // Apply scale to the entire container
    this.bestScoreContainer.setScale(containerScale);

    this.bestScoreContainer.add(this.gameOverF);
  }
  private GameOverBestScore() {
    this.GameOverF();
    this.btnRestart();
    this.btnHome();
    if (this.score > this.bestScoredata) {
      this.updateScore();
      this.refreshTopPlayer();
      this.newBestScore();
      this.bestScoredata = this.score;
    } else {
      this.bestScore();
    }
    console.log(this.bestScoredata);
    const fakebestScoreString = this.bestScoredata.toString();

    this.bestScoreSprites.forEach((sprite) => sprite.destroy());
    this.bestScoreSprites = [];
    const baseDigitWidthBest = 50;
    const digitScaleBest = 0.8;
    const scaledDigitWidthBest = baseDigitWidthBest * digitScaleBest;

    const spacingBest = scaledDigitWidthBest * 0.85; // Khoảng cách giữa các số = 80% chiều rộng của số
    const totalWidthBest =
      spacingBest * (fakebestScoreString.length - 1) + scaledDigitWidthBest;

    // Căn trái của dãy số để nó được căn giữa
    const startXBest = -totalWidthBest / 2;
    for (let i = 0; i < fakebestScoreString.length; i++) {
      const digit = parseInt(fakebestScoreString[i]);
      const sprite = this.add.sprite(
        startXBest + i * spacingBest + scaledDigitWidthBest / 2, // Vị trí X với khoảng cách thu hẹp
        this.txtBest.y + 50,
        "score_spr",
        digit
      );
      sprite.setOrigin(0.5, 0.5);
      sprite.setDepth(10009);
      sprite.setScale(1);
      this.bestScoreContainer.add(sprite);
      this.bestScoreSprites.push(sprite);
    }

    const scoreString = this.score.toString();
    this.scoreSprites.forEach((sprite) => sprite.destroy());
    this.scoreSprites = [];

    const baseDigitWidth = 50;
    const digitScale = 1;

    // Tính toán chiều rộng thực tế của mỗi số sau khi scale
    const scaledDigitWidth = baseDigitWidth * digitScale;

    const spacing = scaledDigitWidth * 0.6; // Khoảng cách giữa các số = 80% chiều rộng của số
    const totalWidth = spacing * (scoreString.length - 1) + scaledDigitWidth;

    // Căn trái của dãy số để nó được căn giữa
    const startX = -totalWidth / 2;

    for (let i = 0; i < scoreString.length; i++) {
      const digit = parseInt(scoreString[i]);
      const sprite = this.add.sprite(
        startX + i * spacing + scaledDigitWidth / 2, // Vị trí X với khoảng cách thu hẹp
        this.txtScore.y + 40,
        "score_spr",
        digit
      );
      sprite.setOrigin(0.5, 0.5);
      sprite.setDepth(10009);
      sprite.setScale(digitScale);
      this.bestScoreContainer.add(sprite);
      this.scoreSprites.push(sprite);
    }
  }
  private refreshTopPlayer() {
    if (this.scene.get("TopPlayerScene")) {
      const topPlayerScene = this.scene.get(
        "TopPlayerScene"
      ) as Phaser.Scene & {
        needRefresh: boolean;
        API_TopPlayer: () => void;
      };
      // Đặt cờ để thông báo cần làm mới dữ liệu
      topPlayerScene.needRefresh = true;
      setTimeout(() => {
        topPlayerScene.API_TopPlayer();
      }, 1000);
    }
  }

  private bestScore() {
    this.txtScore = this.add.image(
      0,
      -this.gameOverF.displayHeight * 0.17,
      "ScoreNormal"
    );
    this.txtScore.setOrigin(0.5, 0.5);
    this.txtScore.setDepth(10009);
    this.txtScore.setScale(1);
    this.bestScoreContainer.add(this.txtScore);

    this.txtBest = this.add.image(
      0,
      this.gameOverF.displayHeight * 0.04,
      "BestScore"
    );
    this.txtBest.setOrigin(0.5, 0.5);
    this.txtBest.setDepth(10009);
    this.txtBest.setScale(1);
    this.bestScoreContainer.add(this.txtBest);
  }
  private newBestScore() {
    this.txtScore = this.add.image(
      0,
      -this.gameOverF.displayHeight * 0.17,
      "ScoreNormal"
    );
    this.txtScore.setOrigin(0.5, 0.5);
    this.txtScore.setDepth(10009);
    this.txtScore.setScale(1);
    this.bestScoreContainer.add(this.txtScore);

    this.txtBest = this.add.image(
      0,
      this.gameOverF.displayHeight * 0.04,
      "NewBestScore"
    );
    this.txtBest.setOrigin(0.5, 0.5);
    this.txtBest.setDepth(10009);
    this.txtBest.setScale(1);
    this.bestScoreContainer.add(this.txtBest);
  }
  private resetEvent = () => {
    this.score = 0;
    this.digitSprites = [];
    if (this.scoreContainer) {
      this.scoreContainer.destroy();
    }
    if (this.scoreBg) {
      this.scoreBg.destroy();
    }
    this.passedPipes.clear();
    this.pipePairs.clear();
    this.lastPipeId = 0;
    this.firstClick = false;
    this.birdVelocity = 0;
  };

  private btnRestart() {
    this.sprBtnReset = this.add.sprite(0, 0, "btnRestart", 0);
    this.sprBtnReset.setOrigin(0.5, 0.5);
    this.sprBtnReset.setDepth(10001);
    this.sprBtnReset.setScale(1.3);
    this.sprBtnReset.setPosition(
      this.gameOverF.displayWidth * 0.2,
      this.gameOverF.displayHeight * 0.5
    );

    this.sprBtnReset.setInteractive();

    this.sprBtnReset.on("pointerdown", () => {
      this.sprBtnReset.setFrame(2);
      this.resetEvent();
      // Khởi động lại scene
      this.scene.restart();
    });
    this.sprBtnReset.on("pointerover", () => {
      this.sprBtnReset.setFrame(1);
    });
    this.sprBtnReset.on("pointerout", () => {
      this.sprBtnReset.setFrame(0);
    });
    this.sprBtnReset.on("pointerup", () => {
      this.sprBtnReset.setFrame(0);
    });

    this.bestScoreContainer.add(this.sprBtnReset);

    // Thêm sự kiện nhấn phím Space để kích hoạt nút Restart
    this.input.keyboard?.addKey("SPACE").on("down", () => {
      this.sprBtnReset.setFrame(2);
      setTimeout(() => {
        this.sprBtnReset.setFrame(0);
        this.resetEvent();
        this.scene.restart();
      }, 100);
    });
  }
  private btnHome() {
    this.sprBtnHome = this.add.sprite(0, 0, "btnHome", 0);
    this.sprBtnHome.setOrigin(0.5, 0.5);
    this.sprBtnHome.setDepth(10001);
    this.sprBtnHome.setScale(1.3);
    this.sprBtnHome.setPosition(
      -this.gameOverF.displayWidth * 0.2,
      this.gameOverF.displayHeight * 0.5
    );
    this.sprBtnHome.setInteractive();
    this.sprBtnHome.on("pointerdown", () => {
      this.sprBtnHome.setFrame(2);
      this.scene.stop("GamePlayScene");
      const menuLoginScene = this.scene.get(
        "MenuLoginScene"
      ) as Phaser.Scene & {
        returnMenu: () => void;
      };
      this.resetEvent();
      menuLoginScene.returnMenu();
      const backgroundScene = this.scene.get(
        "BackgroundScene"
      ) as Phaser.Scene & {
        showGround: () => void;
      };
      backgroundScene.showGround();
    });
    this.sprBtnHome.on("pointerover", () => {
      this.sprBtnHome.setFrame(1);
    });
    this.sprBtnHome.on("pointerout", () => {
      this.sprBtnHome.setFrame(0);
    });
    this.bestScoreContainer.add(this.sprBtnHome);
  }

  private createScoreSprites() {
    if (this.scoreContainer) {
      this.scoreContainer.destroy();
    }
    this.scoreContainer = this.add.container(0, 0);
    this.ScoreBG();
    this.scoreContainer.add(this.scoreBg);
    this.scoreContainer.setDepth(10001);

    const scoreString = this.score.toString();
    this.digitSprites.forEach((sprite) => sprite.destroy());
    this.digitSprites = [];

    // Kích thước cơ bản cho mỗi chữ số
    const baseDigitWidth = 75;

    // Tính toán kích thước scoreBg
    const scoreWidth = this.scoreBg.displayWidth;

    // Điều chỉnh scale dựa trên số lượng chữ số
    let digitScale = 1;
    const totalDigits = scoreString.length;

    if (totalDigits >= 4) {
      digitScale = 0.3; // Scale nhỏ hơn cho 4+ chữ số
    } else if (totalDigits === 3) {
      digitScale = 0.4; // Scale cho 3 chữ số
    } else if (totalDigits === 2) {
      digitScale = 0.5; // Scale cho 2 chữ số
    } else {
      digitScale = 0.6; // Scale cho 1 chữ số
    }

    // Tính lại kích thước chữ số sau khi scale
    const digitWidth = baseDigitWidth * digitScale;

    // Tính tổng chiều rộng của tất cả chữ số
    const totalWidth = digitWidth * totalDigits;

    // Căn giữa trong scoreBg
    const startX = (scoreWidth - totalWidth) / 2;
    // Tạo sprite cho mỗi chữ số
    for (let i = 0; i < scoreString.length; i++) {
      const digit = parseInt(scoreString[i]);
      const x = startX + i * digitWidth;

      const sprite = this.add.sprite(
        this.scoreBg.x - scoreWidth / 2 + x,
        this.scoreBg.y - 5,
        "number_spr",
        digit
      );

      sprite.setScale(digitScale);
      sprite.setOrigin(0, 0.5);
      sprite.setDepth(10001);
      this.digitSprites.push(sprite);
    }
  }

  // Logic game
  private jump() {
    if (!this.isActive) return;

    // Ensure jump sound plays at maximum volume
    AudioManager.setSoundVolume(0.2);
    AudioManager.playSound("jump");

    // Nếu là lần nhảy đầu tiên thì bắt đầu tạo ống
    if (!this.firstClick) {
      // Tạo ống đầu tiên ngay lập tức
      this.spawnPipes();

      // Bắt đầu tạo ống định kỳ
      this.pipeSpawnEvent = this.time.addEvent({
        delay: this.INITIAL_PIPE_SPAWN_TIME,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true,
      });
    }

    this.firstClick = true;
    this.birdVelocity = this.jumpForce;
  }

  private spawnPipes() {
    if (!this.isActive) return;

    // Điều chỉnh vị trí cột
    const minY = this.scale.height * 0.25;
    const maxY = this.scale.height * 0.6;
    const centerY = Phaser.Math.Between(minY, maxY);
    const pipeId = this.lastPipeId++;

    // Tạo ống trên
    const topPipe = this.pipes.create(
      this.scale.width + 100,
      centerY - this.pipeGap / 2,
      "pipe_t"
    );
    topPipe.setOrigin(0.5, 1);

    // Tạo ống dưới
    const bottomPipe = this.pipes.create(
      this.scale.width + 100,
      centerY + this.pipeGap / 2,
      "pipe_b"
    );
    bottomPipe.setOrigin(0.5, 0);

    // Thiết lập thuộc tính cho cả 2 ống
    [topPipe, bottomPipe].forEach((pipe) => {
      pipe.setVelocityX(this.PIPE_SPEED);
      pipe.setDepth(1);
      pipe.body.allowGravity = false;
      pipe.setImmovable(true);
      pipe.setScale(0.75);
    });

    this.pipePairs.set(pipeId, [topPipe, bottomPipe]);
  }

  private updatePipes() {
    this.pipePairs.forEach((pipes, pipeId) => {
      const [topPipe, bottomPipe] = pipes;

      // Kiểm tra ống ra khỏi màn hình
      if (topPipe.x < -100 || bottomPipe.x < -100) {
        topPipe.destroy();
        bottomPipe.destroy();
        this.pipePairs.delete(pipeId);
        return;
      }

      // Kiểm tra chim qua ống
      if (!this.passedPipes.has(topPipe) && topPipe.x < this.bird.x) {
        this.passedPipes.add(topPipe);
        this.passedPipes.add(bottomPipe);
        this.increaseScore();
      }

      // Kiểm tra va chạm
      if (
        this.physics.overlap(this.bird, topPipe) ||
        this.physics.overlap(this.bird, bottomPipe)
      ) {
        this.gameOver();
      }
    });
  }

  private checkGroundCollision() {
    if (
      this.physics.overlap(this.bird, this.ground1) ||
      this.physics.overlap(this.bird, this.ground2)
    ) {
      this.gameOver();
    }
  }

  private updateGround() {
    // Cập nhật vị trí mặt đất
    this.ground1.x -= this.GROUND_SCROLL_X;
    this.ground2.x -= this.GROUND_SCROLL_X;

    // Reset vị trí khi ra khỏi màn hình
    if (this.ground1.x <= -this.ground1.displayWidth / 2) {
      this.ground1.x = this.ground2.x + this.ground2.displayWidth;
    }
    if (this.ground2.x <= -this.ground2.displayWidth / 2) {
      this.ground2.x = this.ground1.x + this.ground1.displayWidth;
    }
  }

  private increaseScore() {
    this.score += 1;
    this.createScoreSprites();

    // Tăng tốc độ khi đạt 50 điểm
    if (this.score === 20) {
      // Dừng sự kiện tạo ống cũ
      this.pipeSpawnEvent.destroy();

      // Tạo sự kiện mới với thời gian ngắn hơn
      this.pipeSpawnEvent = this.time.addEvent({
        delay: this.FAST_PIPE_SPAWN_TIME,
        callback: this.spawnPipes,
        callbackScope: this,
        loop: true,
      });
    }
  }

  private gameOver() {
    if (!this.isActive) return; // Tránh gọi nhiều lần

    this.isActive = false;

    // Hiệu ứng khi chết
    this.playDeathEffect();

    // Dừng animation bay của chim
    this.bird.anims.stop();

    // Tạo hiệu ứng nhấp nháy khi chết
    this.cameras.main.shake(300, 0.02);
    this.cameras.main.flash(300, 255, 0, 0);

    // Cho chim rơi xuống đất với hiệu ứng vật lý
    this.bird.setTint(0xff0000); // Tô đỏ khi chết
    this.bird.setVelocityY(300);
    this.bird.setAngularVelocity(600); // Xoay tròn khi rơi

    // Đặt timeout để hiển thị màn hình game over sau khi hiệu ứng chết hoàn thành
    this.time.delayedCall(1000, () => {
      this.DeactiveScene();
      this.GameOverBestScore();
      this.scoreContainer.destroy();
      this.digitSprites.forEach((sprite) => sprite.destroy());
    });
  }

  // Phương thức mới để tạo hiệu ứng chết
  private playDeathEffect() {
    // Tạo particles cho hiệu ứng vỡ
    const particles = this.add.particles(0, 0, "birdblue_spr", {
      frame: 0,
      quantity: 10,
      speed: { min: 100, max: 200 },
      scale: { start: 0.4, end: 0 },
      lifespan: 800,
      gravityY: 300,
      emitting: false,
    });

    // Đặt vị trí particles tại vị trí chim
    particles.setPosition(this.bird.x, this.bird.y);
    particles.setDepth(100);

    // Phát ra particles
    particles.explode();

    // Phát âm thanh chết (nếu có)
    if (this.sound.get("hit")) {
      this.sound.play("hit");
    }
  }

  // Quản lý trạng thái Scene
  public toggleScene(value: boolean) {
    this.isActive = value;
    if (this.isActive) {
      this.ActiveScene();
    } else {
      this.DeactiveScene();
      // Hiển thị ground trong BackgroundScene khi deactive
      const backgroundScene = this.scene.get(
        "BackgroundScene"
      ) as Phaser.Scene & {
        showGround: () => void;
      };
      if (backgroundScene && backgroundScene.showGround) {
        backgroundScene.showGround();
      }
    }
  }

  private ActiveScene() {
    // Bật physics
    this.physics.world.resume();
    // Bật update loop
    this.events.emit("resume");
  }

  private DeactiveScene() {
    // Xóa game objects ngoại trừ ground
    this.gameObjects
      .filter((obj) => obj !== this.ground1 && obj !== this.ground2)
      .forEach((obj) => obj.destroy());
    this.gameObjects = [this.ground1, this.ground2];

    // Tắt physics
    this.physics.world.pause();
    // Tắt update loop
    this.events.emit("pause");
  }
}
