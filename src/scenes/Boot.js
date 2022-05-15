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

    // this.load.script(
    //   'webfont',
    //   'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    // )

    this.load.json('shapes', 'assets/sheet/tiles.json')
    this.load.atlas(
      'sprites',
      'assets/images/sheet.png',
      'assets/images/sheet.json',
    )
    //   this.load.image('playButton', 'assets/images/button.png')
    // this.load.image('metal', 'assets/images/metal.png')
    // this.load.image('plastic', 'assets/images/plastic.png')
    // this.load.image('paper', 'assets/images/paper.png')
    // this.load.image('garbage', 'assets/images/garbage.png')
    // this.load.image('glass', 'assets/images/glass.png')

    // this.load.image('left', 'assets/images/left.png')
    // this.load.image('right', 'assets/images/right.png')
    // this.load.image('two', 'assets/images/two.png')
    // this.load.image('block', 'assets/images/block.png')
    // this.load.image('straight', 'assets/images/straight.png')
    // this.load.image('hold', 'assets/images/hold.png')
    // this.load.image('hold2', 'assets/images/hold2.png')
    // this.load.image('flip', 'assets/images/flip.png')
    // this.load.image('flip-part', 'assets/images/flip-part.png')
    // this.load.image('flip2', 'assets/images/flip2.png')
    // this.load.image('flip2-part', 'assets/images/flip2-part.png')

    this.load.on('complete', () => {
      // WebFont.load({
      //   custom: { families: ['AnotherHand'] },
      //   active: () => {
      progress.destroy()
      this.scene.start(true ? 'Game' : 'Menu')
      // },
      // })
    })
  }
}
