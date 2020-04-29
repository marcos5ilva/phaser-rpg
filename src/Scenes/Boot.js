import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    this.levels = {
      1: 'level1',
      2: 'level2',
    };
    //load in the tilemap
    this.load.tilemapTiledJSON('level1', '/assets/tilemaps/level1.json');
    this.load.tilemapTiledJSON('level2', '/assets/tilemaps/level2.json');

    //load in the spritesheet used to build the tilemap
    this.load.spritesheet('RPGpack_sheet', '/assets/images/RPGpack_sheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    //load in the player spritesheet
    this.load.spritesheet(
      'characters',
      '/assets/images/roguelikeChar_transparent.png',
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );

    //load playerGril spritesheet
    this.load.spritesheet('playerGirl', '/assets/images/playerGirl.png', {
      frameWidth: 16,
      frameHeight: 17,
    });

    //load in the portal sprite
    this.load.image('portal', '/assets/images/raft.png');

    //load coin sprite
    this.load.image('coin', '/assets/images/coin_01.png');

    //load arrow sprite
    this.load.image('arrow', '/assets/images/arrow.png');

    //load audio
    this.load.audio('theme', [
      '/assets/sfx/Visager_-_12_-_Title_Theme_Loop.mp3',
    ]);
    this.load.audio('releaseArrow', ['/assets/sfx/shoot.ogg']);
    this.load.audio('enemyHurt', ['/assets/sfx/Hurt1.ogg']);
    this.load.audio('enemyDie', ['/assets/sfx/Hurt4.ogg']);
    this.load.audio('femaleHurt', ['/assets/sfx/femaleHurt.ogg']);
    this.load.audio('coinFall', ['/assets/sfx/coin-fall-1.ogg']);
  }

  create() {
    this.scene.start('Game', { level: 1, newGame: true, levels: this.levels });
  }
}
