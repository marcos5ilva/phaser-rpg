import 'phaser';

export default class Portal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    //constructor receives the scene, and the character's x and y position

    //super receives the scene, the character's x and y position, the spritesheet key, and sprite frame
    super(scene, x, y, 'portal');
    this.scene = scene;

    //enable physics
    this.scene.physics.world.enable(this);

    //add the portal to the scene
    this.scene.add.existing(this);
  }
}
