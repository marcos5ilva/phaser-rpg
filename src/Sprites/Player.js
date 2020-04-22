import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    //constructor receives the scene, and the character's x and y position

    //super receives the scene, the character's x and y position, the spritesheet key, and sprite frame
    super(scene, x, y, 'characters', 378);
    this.scene = scene;
    this.health = 3;
    this.hitDelay = false;
    this.direction = 'up';

    //enable physics
    this.scene.physics.world.enable(this);

    //add the player to the scene
    this.scene.add.existing(this);

    //scale player
    this.setScale(4);
  }

  update(cursors) {
    //setting player velocity to zero
    this.setVelocity(0);
    //check up or down keys
    if (cursors.up.isDown) {
      this.direction = 'up';
      this.setVelocityY(-150);
    } else if (cursors.down.isDown) {
      this.direction = 'down';
      this.setVelocityY(150);
    }

    //check left or right keys
    if (cursors.left.isDown) {
      this.direction = 'left';
      this.setVelocityX(-150);
    } else if (cursors.right.isDown) {
      this.direction = 'right';
      this.setVelocityX(150);
    }
  }

  loseHealth() {
    this.health--;

    //send health value to UI scene
    this.scene.events.emit('loseHealth', this.health);

    if (this.health === 0) {
      this.scene.loadNextLevel(true);
    }
  }

  enemyCollision(player, enemy) {
    if (!this.hitDelay) {
      this.loseHealth();
      this.hitDelay = true;

      this.tint = 0xff0000;

      this.scene.time.addEvent({
        delay: 1200,
        callback: () => {
          this.hitDelay = false;
          this.tint = 0xffffff;
        },
        callbackScope: this,
      });
    }
  }
}
