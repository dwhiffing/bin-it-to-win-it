import BlockService from '../services/BlockService'
import TrashService from '../services/TrashService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.levelIndex = 0
    this.blocks = new BlockService(this)
    this.trash = new TrashService(this)
    this.input.keyboard.addKey('Z').on('down', () => {
      this.trash.create(this.width / 2 - 100, -30, 0x00ff00)
    })

    this.input.keyboard.addKey('X').on('down', () => {
      this.trash.create(this.width / 2 + 100, -30, 0xff0000)
    })
  }

  update() {}
}
