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
        fontSize: 80,
      })
      .setVisible(false)
      .setOrigin(0.5)

    this.livesText = this.add
      .text(this.width / 2, this.height - 100, this.registry.values.lives, {
        fontSize: 80,
      })
      .setOrigin(0.5)
      .setVisible(false)

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
  }

  show() {
    this.livesText.setVisible(true)
    this.scoreText.setVisible(true)
  }

  updateScore(parent, value) {
    this.scoreText.text = value
  }

  updateLives(parent, value) {
    this.livesText.text = value
  }
}
