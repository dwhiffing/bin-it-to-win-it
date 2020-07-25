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

    this.load.image('bg', ['assets/images/bg.jpg', 'assets/images/bg-map.png'])
    this.load.atlas(
      'flares',
      'assets/images/flares.png',
      'assets/images/flares.json',
    )
    this.load.image('ball', [
      'assets/images/ball.png',
      'assets/images/ball-map.png',
    ])
    this.load.image('platform', [
      'assets/images/platform.png',
      'assets/images/platform-map.png',
    ])
    this.load.image('smoke', 'assets/images/smoke2.png')
    this.load.image('playButton', 'assets/images/button.png')
    this.load.spritesheet('icon', 'assets/images/icons.png', {
      frameWidth: 100,
      frameHeight: 100,
    })

    this.load.on('complete', () => {
      // WebFont.load({
      //   custom: {
      //     families: ['AnotherHand'],
      //   },
      //   active: () => {
      progress.destroy()
      this.scene.start('Game')
      // },
      //   })
    })
  }
}
