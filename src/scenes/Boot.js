export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()

    window.isMuted = !!Number(localStorage.getItem('mute'))
    this.sound.mute = window.isMuted

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60,
      )
    })

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    )

    this.load.audio('menuMusic', 'assets/audio/menu-music.mp3')
    this.load.audio('gameMusic', 'assets/audio/game-music.mp3')
    this.load.audio('hit0', 'assets/audio/hit0.mp3')
    this.load.audio('hit1', 'assets/audio/hit1.mp3')
    this.load.audio('hit2', 'assets/audio/hit2.mp3')
    this.load.audio('hit3', 'assets/audio/hit3.mp3')
    this.load.audio('whoosh', 'assets/audio/whoosh1.mp3')
    this.load.audio('whoosh2', 'assets/audio/whoosh3.mp3')
    this.load.audio('throw', 'assets/audio/throw.mp3')
    this.load.audio('coin', 'assets/audio/coin.mp3')

    this.load.atlas(
      'flares',
      'assets/images/flares.png',
      'assets/images/flares.json',
    )
    this.load.image('ball', 'assets/images/ball.png')
    this.load.image('platform', 'assets/images/platform.png')
    this.load.image('cloud', 'assets/images/cloud.png')
    this.load.image('playButton', 'assets/images/button.png')
    this.load.image('helpButton', 'assets/images/help.png')
    this.load.image('backButton', 'assets/images/back.png')
    this.load.spritesheet('icon', 'assets/images/icons.png', {
      frameWidth: 100,
      frameHeight: 100,
    })

    this.load.on('complete', () => {
      this.registry.set('lives', 0).set('score', 0)
      WebFont.load({
        custom: {
          families: ['AnotherHand'],
        },
        active: () => {
          progress.destroy()
          this.scene.start('Menu')
        },
      })
    })
  }
}
