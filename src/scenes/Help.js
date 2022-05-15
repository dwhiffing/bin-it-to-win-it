import { LEVELS } from '../constants/levels'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add
      .image(this.width / 2, this.height - 400, 'sprites', 'button.png')
      .setInteractive()
      .setScale(4)
      .on('pointerdown', () => this.scene.start('Game'))

    this.add
      .text(
        this.width / 2,
        this.height / 2 - 300,
        `Tap or Click to select a piece of refuse at the top, and then drop it into the machine to sort it into the coloured bins at the bottom.\n\n If you sort anything incorrectly you will have to try the level again. \n\nTry to beat all ${LEVELS.length} levels!`,
        { fontSize: 100, align: 'center' },
      )
      .setWordWrapWidth(1700)
      .setLineSpacing(50)
      .setOrigin(0.5)
  }
}
