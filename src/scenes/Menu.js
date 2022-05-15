export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add
      .image(this.width / 2, this.height - 600, 'playButton')
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Game'))
  }
}
