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
      .image(this.width / 2, this.height - 1200, 'sprites', 'button.png')
      .setInteractive()
      .setScale(4)
      .on('pointerdown', () => this.scene.start('Help'))
    this.add
      .image(this.width / 2, this.height / 2 - 600, 'sprites', 'title.png')
      .setScale(3)

    this.add
      .text(
        this.width / 2,
        this.height - 250,
        'Created by Dan Whiffing\n\n Refuse art by Sam Braithwaite',
        { fontSize: 100, align: 'center' },
      )
      .setOrigin(0.5)
  }
}
