import { LEVELS } from '../constants/levels'
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
    const level = LEVELS[this.levelIndex]
    this.blocks = new BlockService(this, level.blocks)
    this.trash = new TrashService(this)
    this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        this.trash.add(Phaser.Math.RND.pick(level.colors))
      },
    })
    this.input.keyboard.addKey('Z').on('down', this.trash.putLeft)
    this.input.keyboard.addKey('X').on('down', this.trash.putRight)
  }

  update() {}
}
