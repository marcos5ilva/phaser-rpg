import 'phaser';
import Enemy from '../Sprites/Enemy';

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, children, spriteArray) {
    //constructor receives the scene, and the character's x and y position

    super(world, scene);
    this.scene = scene;
    this.spriteFrames = [0, 1, 54, 55, 108, 109, 162, 163];
    this.health = 3;

    //create enemies from sprite array
    this.createEnemies(scene, spriteArray);
  }

  createEnemies(scene, spriteArray) {
    spriteArray.forEach((sprite) => {
      const randNumber = Math.floor(
        Math.random() * this.spriteFrames.length - 1
      );
      //create a new enemy
      const enemy = new Enemy(
        scene,
        sprite.x,
        sprite.y,
        this.spriteFrames[randNumber]
      );
      //add to enemies group
      this.add(enemy);
      //destroy the sprite
      sprite.destroy();
    });
  }
}
