import { Physics, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Section1 extends Scene {
    constructor() {
        super("Section1");
    }

    create() {
        // this.cameras.main.setBackgroundColor(0x00ff00);
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

        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 768, "ground").setScale(4).refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
