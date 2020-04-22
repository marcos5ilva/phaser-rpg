import 'phaser';

export default class UIcene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI', active: 'true' });
  }

  init() {
    this.coinsCollected = 0;
  }

  preload() {}

  create() {
    //create health text
    this.healthText = this.add.text(12, 12, `Health: 3`, {
      fontSize: '32px',
      fill: '#fff',
    });

    //create score text
    this.scoreText = this.add.text(12, 50, `Score: ${this.coinsCollected}`, {
      fontSize: '32px',
      fill: '#fff',
    });

    //get a reference to the game scene
    this.gameScene = this.scene.get('Game');

    //listen for events from the Game scene
    this.gameScene.events.on('coinCollected', () => {
      this.coinsCollected++;
      this.scoreText.setText(`Score: ${this.coinsCollected}`);
    });

    this.gameScene.events.on('loseHealth', (health) => {
      this.healthText.setText(`Health: ${health}`);
    });

    this.gameScene.events.on('newGame', () => {
      this.coinsCollected = 0;
      this.scoreText.setText(`Score: 0`);
      this.healthText.setText(`Health: 3`);
    });
  }
}
