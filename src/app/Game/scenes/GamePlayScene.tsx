"use client";

export default class GamePlayScene extends Phaser.Scene {
  // Các hằng số
  private readonly BIRD_SCALE = 1; // Tỉ lệ kích thước của chim so với ảnh gốc
  private readonly BASE_GRAVITY = 0.4; // Giá trị cơ bản cho trọng lực (pixel/frame)
  private readonly BASE_JUMP_FORCE = -7; // Giá trị cơ bản cho lực nhảy (pixel/frame)
  private readonly BIRD_ANIMATION_FRAME_RATE = 10; // Tốc độ animation của chim (frame/giây)
  private readonly PIPE_SPEED = -240; // Tốc độ di chuyển của ống (pixel/giây)
  private readonly INITIAL_PIPE_SPAWN_TIME = 1200; // Thời gian ban đầu
  private readonly FAST_PIPE_SPAWN_TIME = 1000; // Thời gian sau khi đạt 50 điểm
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
  private score: number = 48; // Điểm số hiện tại
  private scoreText!: Phaser.GameObjects.Text; // Text hiển thị điểm
  private passedPipes: Set<Phaser.Physics.Arcade.Sprite> = new Set(); // Tập hợp các ống đã vượt qua
  private pipePairs: Map<number, Phaser.Physics.Arcade.Sprite[]> = new Map(); // Map lưu các cặp ống
  private lastPipeId: number = 0; // ID của ống cuối cùng
  private pipeSpawnEvent!: Phaser.Time.TimerEvent; // Thêm biến để lưu sự kiện tạo ống
  private digitSprites: Phaser.GameObjects.Sprite[] = []; // Mảng lưu trữ các sprite số
  private scoreBg!: Phaser.GameObjects.Image; // Sprite background điểm số
  private scoreContainer!: Phaser.GameObjects.Container; // Container lưu trữ các sprite số

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
    this.load.image("scoreBG", "score_bg.png");
    this.load.spritesheet("number_spr", "number_spritesheet.png", {
      frameWidth: 75,
      frameHeight: 95,
    });
  }

  create() {
    // Khởi tạo các scene liên quan
    this.launchRequiredScenes();

    // Thiết lập physics
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // Ẩn ground từ BackgroundScene
    const backgroundScene = this.scene.get("BackgroundScene") as any;
    if (backgroundScene && backgroundScene.hideGround) {
      backgroundScene.hideGround();
    }

    // Tạo các đối tượng game
    this.createGround();
    this.createPipes();
    this.createBird();
    this.createScoreSprites();
    this.setupInput();

    // Bắt đầu tạo ống
    this.pipeSpawnEvent = this.time.addEvent({
      delay: this.INITIAL_PIPE_SPAWN_TIME,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
    });

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
      frameRate: 5,
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
    const width = this.scale.width;
    const height = this.scale.height;
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
    const baseDigitHeight = 95;

    // Tính toán kích thước scoreBg
    const scoreWidth = this.scoreBg.displayWidth;
    const scoreHeight = this.scoreBg.displayHeight;

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
    const digitHeight = baseDigitHeight * digitScale;

    // Tính tổng chiều rộng của tất cả chữ số
    const totalWidth = digitWidth * totalDigits;

    // Căn giữa trong scoreBg
    const startX = (scoreWidth - totalWidth) / 2;
    const startY = (scoreHeight - digitHeight) / 2;

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
    if (this.score === 50) {
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
    this.isActive = false;
    this.DeactiveScene();

    // Hiển thị thông báo game over
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Game Over!\nScore: " + this.score,
      {
        fontSize: "48px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 4,
        align: "center",
      }
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(10001);

    // Thêm nút restart
    const restartButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 100,
      "Restart",
      {
        fontSize: "32px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setDepth(10001);
    restartButton.setInteractive();
    restartButton.on("pointerdown", () => {
      // Reset trạng thái game
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

      // Khởi động lại scene
      this.scene.restart();
    });
  }

  // Quản lý trạng thái Scene
  public toggleScene(value: boolean) {
    this.isActive = value;
    if (this.isActive) {
      this.ActiveScene();
    } else {
      this.DeactiveScene();
      // Hiển thị ground trong BackgroundScene khi deactive
      const backgroundScene = this.scene.get("BackgroundScene") as any;
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
