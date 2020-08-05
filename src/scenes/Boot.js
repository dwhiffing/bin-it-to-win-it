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

    this.load.image('bg', 'assets/images/background-geo-black.jpg')
    this.load.image('left', 'assets/images/left.png')
    this.load.image('right', 'assets/images/right.png')
    this.load.image('two', 'assets/images/two.png')
    this.load.image('block', 'assets/images/block.png')
    this.load.image('straight', 'assets/images/straight.png')
    this.load.image('cup', 'assets/images/cup.png')
    this.load.image('flip', 'assets/images/flip.png')
    this.load.image('hold', 'assets/images/hold.png')
    this.load.image('hold2', 'assets/images/hold2.png')
    this.load.image('flip2', 'assets/images/flip2.png')
    this.load.image('thing2', 'assets/images/thing2.png')
    this.load.image('ball', 'assets/images/ball.png')
    this.load.image('thing', 'assets/images/thing.png')
    this.load.json('shapes', 'assets/images/tiles.json')

    this.load.image('playButton', 'assets/images/button.png')
    this.load.spritesheet('icon', 'assets/images/icons.png', {
      frameWidth: 100,
      frameHeight: 100,
    })

    this.load.on('complete', () => {
      WebFont.load({
        custom: {
          families: ['AnotherHand'],
        },
        active: () => {
          progress.destroy()
          // this.scene.start('Menu')
          this.scene.start('Game')
        },
      })
    })
  }
}
