import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    //constructor receives the scene, and the character's x and y position

    //super receives the scene, the character's x and y position, the spritesheet key, and sprite frame
    super(scene, x, y, 'playerGirl', 0);
    this.scene = scene;
    this.health = 3;
    this.hitDelay = false;
    this.direction = 'up';
    this.isWalking = false;

    //enable physics
    this.scene.physics.world.enable(this);

    //add the player to the scene
    this.scene.add.existing(this);

    //scale player
    this.setScale(4);

    console.log('player', this);
  }

  update(cursors) {
    //setting player velocity to zero
    this.setVelocity(0);

    this.playerAnimation(this.isWalking, this.direction);

    //console.log(this.body.velocity);
    //check up or down keys
    if (cursors.up.isDown) {
      this.direction = 'up';
      this.isWalking = true;
      this.setVelocityY(-150);
      this.anims.play('playerWalkUp', true);
    } else if (cursors.down.isDown) {
      this.direction = 'down';
      this.isWalking = true;
      this.anims.play('playerWalkDown', true);
      this.setVelocityY(150);
    } else {
      this.isWalking = false;
    }

    //check left or right keys
    if (cursors.left.isDown) {
      this.direction = 'left';
      this.isWalking = true;

      this.setVelocityX(-150);
    } else if (cursors.right.isDown) {
      this.direction = 'right';
      this.isWalking = true;
      this.setVelocityX(150);
    }
  }

  loseHealth() {
    this.health--;

    this.scene.playerHurtFemale.play();

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

  playerAnimation(isWalking, direction) {
    if (isWalking) {
      switch (direction) {
        case 'up':
          this.anims.play('playerWalkUp', true);
          break;
        case 'down':
          this.anims.play('playerWalkDown', true);
          break;
        case 'left':
          this.anims.play('playerWalkDown', true);
          break;
        case 'right':
          this.anims.play('playerWalkDown', true);
          break;
      }
    } else {
      this.anims.play('playerIdle', true);
    }
  }
}
