export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Hud', active: true })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.scoreText = this.add
      .text(this.width / 2, 100, this.registry.values.score, {
        fontFamily: 'AnotherHand',
        fontSize: 80,
      })
      .setVisible(false)
      .setOrigin(0.5)
      .setStroke(0x000000, 10)

    this.livesText = this.add
      .text(this.width / 2, this.height - 100, this.registry.values.lives, {
        fontFamily: 'AnotherHand',
        fontSize: 80,
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setStroke(0x000000, 10)

    this.registry.events.on('changedata-score', this.updateScore, this)
    this.registry.events.on('changedata-lives', this.updateLives, this)
    this.scene
      .get('Game')
      .events.on('start', this.show, this)
      .on('pause', this.show, this)
      .on('resume', this.hide, this)
      .on('shutdown', this.hide, this)
  }

  hide() {
    this.livesText.setVisible(false)
    this.scoreText.setVisible(false)
    this.mute.setVisible(false)
  }

  show() {
    this.livesText.setVisible(true)
    this.scoreText.setVisible(true)
    if (!this.mute) {
      this.mute = this.add.image(this.width - 130, this.height - 180, 'icon')
      this.mute.setOrigin(0)
      this.mute.setFrame(window.isMuted ? 2 : 1)
      this.mute
        .setInteractive()
        .on('pointerdown', () => {
          window.isMuted = !window.isMuted
          this.sound.mute = window.isMuted
          localStorage.setItem('mute', window.isMuted ? 1 : 0)
          this.mute.setFrame(window.isMuted ? 2 : 1)
        })
        .setVisible(false)
    }
    this.mute.setVisible(true)
  }

  updateScore(parent, value) {
    this.scoreText.text = value
  }

  updateLives(parent, value) {
    this.livesText.text = value
  }
}
