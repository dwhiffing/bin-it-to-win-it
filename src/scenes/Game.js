import { LEVELS } from '../constants/levels'
import BlockService from '../services/BlockService'
import TrashService from '../services/TrashService'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init({ levelIndex = 0 } = {}) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.levelIndex = levelIndex
  }

  create() {
    this.registry.set('queue', [])
    this.registry.set('points', 0)
    this.registry.set('level', LEVELS[this.levelIndex])

    this.blocks = new BlockService(this)
    this.trashService = new TrashService(this)
    this.trashService.addTrashToQueue()
    this.time.addEvent({
      delay: 3000,
      repeat: -1,
      callback: this.trashService.addTrashToQueue,
    })
    const camera = this.cameras.main
    camera.zoom = 2
    const top = this.blocks.children[0]
    camera.centerOn(top.x + top.width / 2, top.y + top.height / 2)
    camera.setBounds(0, 0, camera.width, this.registry.values.blockHeight)

    this.input.keyboard.on('keyup-Z', (e) => {
      if (!e.repeat) this.changeLevel(-1)
    })
    this.input.keyboard.on('keyup-X', (e) => {
      if (!e.repeat) this.changeLevel(1)
    })

    let deltaX, deltaY
    this.input.on('pointerdown', (p) => {
      deltaX = p.x
      deltaY = p.y
    })

    this.input.on('pointerup', (p) => {
      if (Math.abs(p.x - deltaX) < 1 && Math.abs(p.y - deltaY) < 1) {
        this.trashService.putTrash(p.x)
      }
    })

    this.input.on('pointermove', (p) => {
      if (!p.isDown) return

      camera.scrollX -= (p.x - p.prevPosition.x) / camera.zoom
      camera.scrollY -= (p.y - p.prevPosition.y) / camera.zoom
    })
    this.scene.launch('Hud')
  }

  changeLevel(change) {
    setTimeout(() => {
      this.clean()
      this.scene.start('Game', { levelIndex: this.levelIndex + change })
    }, 100)
  }

  clean() {
    this.input.keyboard.off('keyup-Z')
    this.input.keyboard.off('keyup-X')
    this.input.removeAllListeners()
    this.scene.stop('Hud')
    this.time.removeAllEvents()
    this.registry.events.removeAllListeners()
  }

  gameover() {
    this.clean()
    this.scene.start('Menu')
  }

  update() {
    this.trashService.update()
  }
}
