import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, frame) {
    //constructor receives the scene, and the character's x and y position

    //super receives the scene, the character's x and y position, the spritesheet key, and sprite frame
    super(scene, x, y, 'characters', frame);
    this.scene = scene;

    //enable physics
    this.scene.physics.world.enable(this);

    //add the player to the scene
    this.scene.add.existing(this);

    //scale player
    this.setScale(4);

    //move our enemy
    this.timeEvent = this.scene.time.addEvent({
      delay: 3000,
      callback: this.move,
      loop: true,
      callbackScope: this,
    });
  }

  loseHealth() {
    this.health--;
    this.tint = 0xff0000;
    if (this.health === 0) {
      this.destroy();
    } else {
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.tint = 0xffffff;
        },
      });
    }
  }

  move() {
    const randNumber = Math.floor(Math.random() * 4 + 1);

    switch (randNumber) {
      case 1:
        this.setVelocityX(150);
        break;
      case 2:
        this.setVelocityX(-150);
        break;
      case 3:
        this.setVelocityY(150);
        break;
      case 4:
        this.setVelocityY(-150);
        break;
      default:
        this.setVelocityX(150);
    }

    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.setVelocity(0);
      },

      callbackScope: this,
    });
  }
}
