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
    this.level = LEVELS[this.levelIndex]
    this.points = 0
    this.pointText = this.add.text(40, 30, '0', { fontSize: 150 })
    this.blocks = new BlockService(this)
    this.trashService = new TrashService(this)
    this.trashService.addTrashToQueue()
    this.time.addEvent({
      delay: 3000,
      repeat: -1,
      callback: this.trashService.addTrashToQueue,
    })
    this.input.on('pointerdown', (pointer) => {
      this.trashService.putTrash(pointer.downX)
    })
  }

  update() {
    this.trashService.update()
  }
}
