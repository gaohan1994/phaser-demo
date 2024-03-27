import Phaser, { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Section1 extends Scene {
    platforms;
    stars;
    bombs;
    player;
    scoreText;
    score = 0;
    gameOver = false;

    constructor() {
        super("Section1");
    }

    create() {
        this.createBackground();
        this.createAnimations();
        this.platforms = this.createPlatforms();
        this.stars = this.createStars();
        this.bombs = this.createBombs();
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.hitBomb,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        );
        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (this.gameOver) {
            return;
        }
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
        }
    }

    changeScene() {
        this.scene.start("MainMenu");
    }

    createBackground = () => {
        this.scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#000",
        });
        this.add.image(512, 384, "background").setAlpha(0.5);
        this.add
            .text(512, 384, "Section1", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
    };

    createPlatforms = () => {
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 768, "ground").setScale(4).refreshBody();
        // platforms.create(600, 400, "ground");
        // platforms.create(50, 250, "ground");
        // platforms.create(750, 220, "ground");
        return platforms;
    };

    createStars = () => {
        const stars = this.physics.add.group({
            key: "star",
            repeat: 2,
            setXY: { x: 12, y: 0, stepX: 80 },
        });

        stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        return stars;
    };

    createBombs = () => {
        const bombs = this.physics.add.group();
        return bombs;
    };

    createPlayer = () => {
        const player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);
        return player;
    };

    createAnimations = () => {
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    };

    collectStar = (player, star) => {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x =
                player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);
            const bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    };

    hitBomb = (player, bomb) => {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.gameOver = true;
    };
}
