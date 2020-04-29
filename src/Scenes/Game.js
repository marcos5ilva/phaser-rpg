import 'phaser'
import Player from '../Sprites/Player'
import Portal from '../Sprites/Portal'
import Coins from '../Groups/Coins'
import Enemies from '../Groups/Enemies'
import Arrows from '../Groups/Arrows'

export default class GameScene extends Phaser.Scene {
	constructor(key) {
		super(key)
	}
	init(data) {
		this._LEVEL = data.level
		this._LEVELS = data.levels
		this._NEWGAME = data.newGame
		this.loadingLevel = false
		if (this._NEWGAME) this.events.emit('newGame')
	}
	preload() {}

	create() {
		//listen for the resize event
		this.events.on('resize', this.resize, this)

		//listen for keyboard  input
		this.cursors = this.input.keyboard.createCursorKeys()
		this.spaceKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		)

		//create tile map
		this.createMap()

		//create player
		this.createPlayer()

		//create player animations
		this.createPlayerAnim()

		//create the portal
		this.createPortal()

		//create coins
		this.coins = this.map.createFromObjects('Coins', 'Coin', { key: 'coin' })
		this.coinsGroup = new Coins(this.physics.world, this, [], this.coins)

		//create enemies
		this.enemies = this.map.createFromObjects('Enemies', 'Enemy', {})
		this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies)

		//create arrows groups
		this.arrows = new Arrows(this.physics.world, this, [])

		//create audio
		const theme = this.sound.add('theme')
		theme.play()
		theme.loop = true
		theme.volume = 0.1

		this.releaseArrow = this.sound.add('releaseArrow')

		this.enemyHurt = this.sound.add('enemyHurt')
		this.enemyDie = this.sound.add('enemyDie')
		this.playerHurtFemale = this.sound.add('femaleHurt')
		this.coinFallSound = this.sound.add('coinFall')

		//update game camera
		this.cameras.main.startFollow(this.player)

		//add collisions
		this.addCollisions()
	}

	update() {
		this.player.update(this.cursors)
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.releaseArrow.play()
			this.player.anims.stop()
			this.player.anims.play('playerArrowLeft', true)
			this.arrows.releaseArrow(
				this.player.x,
				this.player.y,
				this.player.direction
			)
		}
	}

	resize(width, height) {
		if (width === undefined) {
			width = this.sys.game.config.width
		}

		if (height === undefined) {
			height = this.sys.game.config.width
		}
		this.cameras.resize(width, height)
	}

	createPlayer() {
		//find Player object created in tile
		this.map.findObject('Player', (obj) => {
			if (this._NEWGAME && this._LEVEL == 1) {
				if (obj.type === 'StartingPosition') {
					this.player = new Player(this, obj.x, obj.y)
					console.log('this on create player', this)
				}
			} else {
				this.player = new Player(this, obj.x, obj.y)
			}
		})
	}

	createPlayerAnim() {
		//idle animation
		this.anims.create({
			key: 'playerIdle',
			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 0,
				end: 1,
			}),
			frameRate: 4,
			yoyo: true,
			repeat: -1,
		})

		this.anims.create({
			key: 'playerTurn',
			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 0,
				end: 1,
			}),
			frameRate: 4,
			yoyo: true,
			repeat: 1,
		})

		this.anims.create({
			key: 'playerWalkDown',
			frameRate: 7,
			yoyo: true,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 2,
				end: 3,
			}),
		})

		this.anims.create({
			key: 'playerWalkUp',
			frameRate: 7,
			yoyo: true,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 4,
				end: 5,
			}),
		})

		this.anims.create({
			key: 'playerWalkLeft',
			frameRate: 7,
			yoyo: true,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 2,
				end: 3,
			}),
		})

		this.anims.create({
			key: 'playerArrowLeft',
			frameRate: 6,
			duration: 10000,

			frames: this.anims.generateFrameNumbers('playerGirl', {
				start: 6,
				end: 7,
			}),
		})
	}

	createPortal() {
		// find Portal object created in  tile
		this.map.findObject('Portal', (obj) => {
			switch (this._LEVEL) {
				case 1:
					this.portal = new Portal(this, obj.x, obj.y - 68)
					break

				case 2:
					this.portal = new Portal(this, obj.x, obj.y + 70)
					break
			}
		})
	}

	createMap() {
		//add watter background
		this.add.tileSprite(0, 0, 8000, 8000, 'RPGpack_sheet', 31)

		//create the tilemap
		this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] })

		//add tileset spritesheet
		this.tiles = this.map.addTilesetImage('RPGpack_sheet')

		//create tilemap layers
		this.backgroundLayer = this.map.createStaticLayer(
			'Background',
			this.tiles,
			0,
			0
		)

		this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0)

		this.blockedLayer.setCollisionByExclusion([-1]) //adding collision to all the block layer
	}

	addCollisions() {
		this.physics.add.collider(this.player, this.blockedLayer)

		this.physics.add.collider(this.enemiesGroup, this.blockedLayer)
		this.physics.add.overlap(
			this.player,
			this.enemiesGroup,
			this.player.enemyCollision.bind(this.player)
		)

		this.physics.add.overlap(
			this.player,
			this.portal,
			this.loadNextLevel.bind(this, false)
		)

		this.physics.add.overlap(
			this.coinsGroup,
			this.player,
			this.coinsGroup.collectCoin.bind(this.coinsGroup)
		)

		this.physics.add.overlap(
			this.arrows,
			this.enemiesGroup,
			this.arrows.enemyCollision
		)
	}

	loadNextLevel(endGame) {
		if (!this.loadingLevel) {
			this.cameras.main.fade(500, 0, 0, 0)
			this.cameras.main.on('camerafadeoutcomplete', () => {
				if (endGame) {
					this.scene.restart({
						level: 1,
						levels: this._LEVELS,
						newGame: true,
					})
				} else {
					switch (this._LEVEL) {
						case 1:
							this.scene.restart({
								level: 2,
								levels: this._LEVELS,
								newGame: false,
							})
							break

						case 2:
							this.scene.restart({
								level: 1,
								levels: this._LEVELS,
								newGame: false,
							})
							break
					}
				}
			})

			this.loadingLevel = true
		}
	}
}
