import Phaser from 'phaser';

import config from './config';

import BootScene from './Scenes/Boot';
import GameScene from './Scenes/Game';
import UIScene from './Scenes/UI';

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add('Boot', BootScene);
    this.scene.add('Game', GameScene);
    this.scene.add('UI', UIScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();

//listening for browse resizing
window.addEventListener(
  'resize',
  (event) => {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
  },
  false
);
