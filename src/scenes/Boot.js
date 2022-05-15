export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()
    const { width, height } = this.sys.game.config

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, height / 2, width * value, 60)
    })

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    )

    this.load.image('playButton', 'assets/images/button.png')
    this.load.image('ball', 'assets/images/ball.png')

    this.load.json('shapes', 'assets/images/tiles.json')
    this.load.image('left', 'assets/images/left.png')
    this.load.image('right', 'assets/images/right.png')
    this.load.image('two', 'assets/images/two.png')
    this.load.image('block', 'assets/images/block.png')
    this.load.image('straight', 'assets/images/straight.png')
    this.load.image('hold', 'assets/images/hold.png')
    this.load.image('hold2', 'assets/images/hold2.png')
    this.load.image('flip', 'assets/images/flip.png')
    this.load.image('flip-part', 'assets/images/flip-part.png')
    this.load.image('flip2', 'assets/images/flip2.png')
    this.load.image('flip2-part', 'assets/images/flip2-part.png')

    this.load.on('complete', () => {
      WebFont.load({
        custom: { families: ['AnotherHand'] },
        active: () => {
          progress.destroy()
          this.scene.start(true ? 'Game' : 'Menu')
        },
      })
    })
  }
}
