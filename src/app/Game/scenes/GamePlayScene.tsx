"use client";

export default class GamePlayScene extends Phaser.Scene {
  // Constants
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

  // Game objects
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
    console.log("GamePlayScene constructor");
  }

  init() {
    console.log("GamePlayScene init");
  }

  preload() {
    console.log("GamePlayScene preload");
  }

  create() {
    console.log("GamePlayScene create");

    // Launch required scenes
    this.launchRequiredScenes();

    // Setup physics
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // Hide ground from BackgroundScene
    const backgroundScene = this.scene.get("BackgroundScene") as any;
    if (backgroundScene && backgroundScene.hideGround) {
      backgroundScene.hideGround();
    }

    // Create ground first
    this.createGround();

    // Create pipes group
    this.createPipes();

    // Create bird
    this.createBird();

    // Create score text
    this.createScoreText();

    // Setup input
    this.setupInput();

    // Start spawning pipes
    this.pipeSpawnEvent = this.time.addEvent({
      delay: this.INITIAL_PIPE_SPAWN_TIME,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
    });

    // Start game
    this.isActive = true;
    this.ActiveScene();
  }

  private setupInput() {
    // Space or click to jump
    this.input.keyboard?.on("keydown-SPACE", () => this.jump());
    this.input.on("pointerdown", () => this.jump());
  }

  private jump() {
    if (!this.isActive) return;
    this.firstClick = true;
    this.birdVelocity = this.jumpForce;
  }

  private launchRequiredScenes() {
    console.log("Launching required scenes");
    if (!this.scene.isActive("BackgroundScene")) {
      this.scene.launch("BackgroundScene");
    }
  }

  private createBird() {
    // Create bird sprite
    const width = this.scale.width;
    const height = this.scale.height;
    this.bird = this.physics.add.sprite(width / 3, height / 2, "birdblue_spr");
    this.bird.setOrigin(0.5, 0.5);

    // Setup bird properties
    this.bird.setCollideWorldBounds(true);
    this.bird.setBounce(0.2);
    this.bird.setDepth(0);

    this.bird.setScale(this.BIRD_SCALE);
    // Thêm smooth scaling
    this.bird.texture.setFilter(Phaser.Textures.LINEAR);
    this.bird.texture.source[0].setFilter(Phaser.Textures.LINEAR);

    // Create bird animation
    this.anims.create({
      key: "flappyGameplay",
      frames: this.anims.generateFrameNumbers("birdblue_spr", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    // Play animation
    this.bird.play("flappyGameplay");
    this.bird.setPipeline("TextureTintPipeline");

    // Add to game objects
    this.gameObjects.push(this.bird);
  }

  private createPipes() {
    this.pipes = this.physics.add.group();
  }

  private createGround() {
    const width = this.scale.width;
    const height = this.scale.height;
    const widthGround = 1536;
    const heightGround = 430;

    // Create ground1
    this.ground1 = this.add
      .tileSprite(this.groundX, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000); // Ground layer - highest

    // Create ground2
    this.ground2 = this.add
      .tileSprite(this.groundX, 0, widthGround, heightGround, "ground")
      .setOrigin(0.5, 1)
      .setDepth(10000); // Ground layer - highest

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
    this.physics.add.existing(this.ground1, true); // true = static body
    this.physics.add.existing(this.ground2, true);

    // Add to game objects
    this.gameObjects.push(this.ground1, this.ground2);
  }

  private createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 4,
    });
    this.scoreText.setDepth(10001); // Hiển thị trên cùng
  }

  private spawnPipes() {
    if (!this.isActive) return;

    // Điều chỉnh vị trí cột so với màn hình
    // Giới hạn vị trí cột không quá thấp (từ 20% đến 40% chiều cao scene)
    const minY = this.scale.height * 0.25;
    const maxY = this.scale.height * 0.6;
    const centerY = Phaser.Math.Between(minY, maxY);
    const pipeId = this.lastPipeId++;

    // Create top pipe
    const topPipe = this.pipes.create(
      this.scale.width + 100,
      centerY - this.pipeGap / 2,
      "pipe_t"
    );
    topPipe.setOrigin(0.5, 1);

    // Create bottom pipe
    const bottomPipe = this.pipes.create(
      this.scale.width + 100,
      centerY + this.pipeGap / 2,
      "pipe_b"
    );
    bottomPipe.setOrigin(0.5, 0);

    // Set properties for both pipes
    [topPipe, bottomPipe].forEach((pipe) => {
      pipe.setVelocityX(this.PIPE_SPEED);
      pipe.setDepth(1);
      pipe.body.allowGravity = false;
      pipe.setImmovable(true);
      pipe.setScale(0.75);
    });

    // Store pipe pair
    this.pipePairs.set(pipeId, [topPipe, bottomPipe]);
  }

  public toggleScene(value: boolean) {
    console.log("Toggle scene:", value);
    this.isActive = value;
    if (this.isActive) {
      this.ActiveScene();
    } else {
      this.DeactiveScene();
      // Show ground in BackgroundScene when deactivating
      const backgroundScene = this.scene.get("BackgroundScene") as any;
      if (backgroundScene && backgroundScene.showGround) {
        backgroundScene.showGround();
      }
    }
  }

  private ActiveScene() {
    console.log("Active Scene");

    // Bật physics
    this.physics.world.resume();

    // Bật update loop
    this.events.emit("resume");
  }

  private DeactiveScene() {
    console.log("Deactive Scene");

    // Xóa tất cả game objects ngoại trừ ground
    this.gameObjects
      .filter((obj) => obj !== this.ground1 && obj !== this.ground2)
      .forEach((obj) => obj.destroy());
    this.gameObjects = [this.ground1, this.ground2];

    // Tắt physics
    this.physics.world.pause();

    // Tắt update loop
    this.events.emit("pause");
  }

  update() {
    if (!this.isActive) return;

    // Update bird
    if (this.firstClick) {
      this.birdVelocity += this.gravity;
    }
    this.bird.y += this.birdVelocity;

    // Rotate bird based on velocity
    this.bird.angle = this.birdVelocity * 2;

    // Kiểm tra va chạm và tính điểm cho mỗi cặp ống
    this.pipePairs.forEach((pipes, pipeId) => {
      const [topPipe, bottomPipe] = pipes;

      // Kiểm tra nếu ống đã ra khỏi màn hình
      if (topPipe.x < -100 || bottomPipe.x < -100) {
        topPipe.destroy();
        bottomPipe.destroy();
        this.pipePairs.delete(pipeId);
        return;
      }

      // Kiểm tra nếu chim đã vượt qua cặp ống
      if (!this.passedPipes.has(topPipe) && topPipe.x < this.bird.x) {
        this.passedPipes.add(topPipe);
        this.passedPipes.add(bottomPipe);
        this.increaseScore();
      }

      // Kiểm tra va chạm giữa chim và ống
      if (
        this.physics.overlap(this.bird, topPipe) || // Va chạm với ống trên
        this.physics.overlap(this.bird, bottomPipe) // Va chạm với ống dưới
      ) {
        this.gameOver(); // Kết thúc game khi va chạm
      }
    });

    // Kiểm tra va chạm với mặt đất
    if (
      this.physics.overlap(this.bird, this.ground1) || // Va chạm với mặt đất 1
      this.physics.overlap(this.bird, this.ground2) // Va chạm với mặt đất 2
    ) {
      this.gameOver(); // Kết thúc game khi va chạm
    }

    // Cập nhật vị trí mặt đất
    this.ground1.x -= this.GROUND_SCROLL_X;
    this.ground2.x -= this.GROUND_SCROLL_X;

    // Reset vị trí mặt đất khi ra khỏi màn hình
    if (this.ground1.x <= -this.ground1.displayWidth / 2) {
      this.ground1.x = this.ground2.x + this.ground2.displayWidth;
    }
    if (this.ground2.x <= -this.ground2.displayWidth / 2) {
      this.ground2.x = this.ground1.x + this.ground1.displayWidth;
    }
  }

  private increaseScore() {
    this.score += 1;
    this.scoreText.setText("Score: " + this.score);

    // Kiểm tra nếu đạt 50 điểm
    if (this.score === 50) {
      // Dừng sự kiện tạo ống cũ
      this.pipeSpawnEvent.destroy();

      // Tạo sự kiện tạo ống mới với thời gian ngắn hơn
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

    // Show game over text
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

    // Add restart button
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
      // Reset all game state
      this.score = 0;
      this.passedPipes.clear();
      this.pipePairs.clear();
      this.lastPipeId = 0;
      this.firstClick = false;
      this.birdVelocity = 0;

      // Restart scene
      this.scene.restart();
    });
  }
}
