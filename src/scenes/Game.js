import { LEVELS, STARTING_LEVEL } from '../constants/levels'
import BlockService from '../services/BlockService'
import TrashService from '../services/TrashService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.registry.values.levelIndex = STARTING_LEVEL
  }

  create() {
    this.blocks = new BlockService(this)
    this.trashService = new TrashService(this)

    this.input.keyboard.on('keyup', (e) => {
      if (e.key === 'r') {
        this.restart()
      } else if (e.key === 'z') {
        if (this.registry.values.levelIndex > 0) {
          this.registry.values.levelIndex--
          this.startLevel()
        }
      } else if (e.key === 'x') {
        this.won()
      }
    })

    this.input.on('pointerdown', (p) => {
      this.trashService.putTrash(p.x)
    })

    this.scene.launch('Hud', { restart: this.restart.bind(this) })
    this.startLevel()
  }

  selectTrash(i) {
    this.registry.set('queueIndex', i)
  }

  startLevel() {
    this.clean()

    if (!this.registry.values.levelIndex) this.registry.values.levelIndex = 0
    this.registry.set('queue', [])
    this.registry.set('level', LEVELS[this.registry.values.levelIndex])
    this.blocks.init()
    this.trashService.init()
    this.trashService.addTrashToQueue()
    this.time.addEvent({
      delay: 800,
      repeat: -1,
      callback: () => {
        if (
          this.trashService.pileIndex >=
            this.registry.values.level.pile.length &&
          this.registry.values.queue.length === 0 &&
          this.trashService.trash.length === 0
        ) {
          this.won()
        } else {
          this.trashService.addTrashToQueue()
        }
      },
    })
    const camera = this.cameras.main
    camera.zoom = 1
    if (this.registry.values.blockHeight < 3400) camera.zoom = 1.25
    if (this.registry.values.blockHeight < 2700) camera.zoom = 1.5
    if (this.registry.values.blockHeight < 2000) camera.zoom = 2
    camera.setBounds(0, 0, camera.width, this.registry.values.blockHeight + 200)
  }

  restart() {
    this.clean()
    this.startLevel()
  }

  clean() {
    this.time.removeAllEvents()
    this.blocks.clean()
    this.trashService.clean()
  }

  gameover() {
    this.restart()
  }

  won() {
    if (this.registry.values.levelIndex < LEVELS.length - 1) {
      this.registry.values.levelIndex++
      this.startLevel()
    } else {
      this.scene.stop('Hud')
      this.scene.start('Win')
    }
  }

  update() {
    this.trashService.update()
  }
}
