import { KEYS } from '../constants'

export default class HudService {
  constructor(scene) {
    this.scene = scene
    this.width = scene.width
    this.height = scene.height
    this.bg = this.scene.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    this.bg.fillRect(0, 0, this.scene.cameras.main.width, 300)

    this.border = this.scene.add.circle(200, 150, 135)
    this.border.setStrokeStyle(20, 0xffffff)
    this.border.depth = 9999

    this.createQueue()
    this.updateQueueUI()
    this.scene.registry.events.on('changedata-queue', () => {
      this.updateQueueUI()
    })
    this.scene.registry.events.on('changedata-queueIndex', () => {
      const i = this.scene.registry.values.queueIndex
      if (i === -1) {
        this.border.x = -9999
      } else {
        this.border.x = 200 + i * 300
      }
    })
  }

  update() {}

  createQueue() {
    this.uiGroup = this.scene.add.group()
    for (let i = 0; i < 10; i++) {
      const sprite = this.scene.add
        .image(200 + i * 300, 150, 'sprites', 'metal.png')
        .setAlpha(0)
        .setScale(1.3)
        .setInteractive()
        .on('pointerdown', () => {
          this.scene.scene.get('Game').selectTrash(i)
        })
      this.uiGroup.add(sprite)
    }
  }

  updateQueueUI() {
    const queue = this.scene.registry.get('queue') || []
    this.uiGroup.children.entries.forEach((c) => c.setAlpha(0))
    queue.forEach((o, i) => {
      const sprite = this.uiGroup.children.entries[i]
      sprite.setFrame(KEYS[o.color] + '.png')
      sprite.setAlpha(1)
    })
  }
}
