import HudService from '../services/HudService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Hud' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.hudService = new HudService(this)
  }

  update() {}
}
