import 'phaser';

export default class Arrows extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, children) {
    super(world, scene);
    this.scene = scene;

    this.createMultiple({
      frameQuantity: 5,
      key: 'arrow',
      active: false,
      visible: false,
    });
  }

  releaseArrow(x, y, direction) {
    const arrow = this.getFirstDead(false);
    const halfPlayerWidth = 32;

    if (arrow) {
      arrow.enableBody(true);
      arrow.active = true;
      arrow.visible = true;
      arrow.setPosition(x + halfPlayerWidth, y);
      arrow.setScale(3);

      switch (direction) {
        case 'up':
          arrow.setVelocityY(-300);
          arrow.angle = 0;
          arrow.angle -= 90;
          break;
        case 'down':
          arrow.setVelocityY(300);
          arrow.angle = 0;
          arrow.angle += 90;

          break;
        case 'left':
          arrow.setVelocityX(-300);
          //arrow.flipX = true;
          arrow.angle = 0;
          arrow.angle += 180;
          break;
        case 'right':
          arrow.setVelocityX(300);
          arrow.angle = 0;

          break;
        default:
          arrow.setVelocityX(300);
          arrow.angle = 0;
      }
    }
    this.scene.time.addEvent({
      delay: 1500,
      callback: () => {
        arrow.disableBody();
        arrow.active = false;
        arrow.visible = false;
        arrow.setVelocity(0);
      },
    });
  }

  enemyCollision(arrow, enemy) {
    arrow.active = false;
    arrow.visible = false;
    arrow.disableBody();
    enemy.loseHealth();
  }
}
