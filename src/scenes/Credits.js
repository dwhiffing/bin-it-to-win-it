const INSTRUCTIONS = `Fling the light pendulum upwards into the sky.

Drag around it to see your surroundings.

Careful! You only have so many flings.
        
Collect lights for points; Green ones will give you more flings.

It will get harder as you progress.

Good luck!`

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  init(opts = {}) {
    this.score = opts.score || 0
  }

  create() {
    const { height, width } = this.game.config

    let g = this.add.graphics()
    g.fillStyle(0x326694, 1)
    g.fillRect(0, 0, width, height)

    this.add
      .text(width / 2 - 10, 150, 'Light\nPendulum', {
        fontFamily: 'AnotherHand',
        fontSize: 100,
      })
      .setAlign('center')
      .setOrigin(0.5)
      .setAlpha(0.8)
      .setStroke(0x000000, 10)

    this.creditText = this.add
      .text(
        width / 2,
        height - 140,
        'Created by Daniel Whiffing\n\nMusic by Purple Planet',
        {
          fontFamily: 'Arial',
          fontSize: 50,
          align: 'center',
          color: '#ffffff',
        },
      )
      .setShadow(2, 2, '#333333', 2, false, true)
    this.creditText.setOrigin(0.5)

    this.helpText = this.add
      .text(width / 2, height / 2 - 100, INSTRUCTIONS, {
        fontFamily: 'Arial',
        fontSize: 38,
        align: 'center',
        color: '#ffffff',
      })
      .setShadow(2, 2, '#333333', 2, false, true)
    this.helpText.setOrigin(0.5)

    this.add
      .sprite(width / 2, height - 470, 'backButton')
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scene.isPaused('Game')) {
          this.scene.resume('Game')
          this.scene.stop()
        } else {
          this.scene.stop()
        }
      })
    this.mute = this.add.image(
      this.cameras.main.width - 130,
      this.cameras.main.height - 160,
      'icon',
    )
    this.mute.setOrigin(0)
    this.mute.setFrame(window.isMuted ? 2 : 1)
    this.mute.setInteractive().on('pointerdown', () => {
      window.isMuted = !window.isMuted
      this.sound.mute = window.isMuted
      localStorage.setItem('mute', window.isMuted ? 1 : 0)
      this.mute.setFrame(window.isMuted ? 2 : 1)
    })
  }
}
