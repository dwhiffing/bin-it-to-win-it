import { KEYS } from '../constants'

export default class HudService {
  constructor(scene) {
    this.scene = scene
    this.width = scene.width
    this.height = scene.height
    this.bg = this.scene.add.graphics()
    this.bg.fillStyle(0x222222, 1)
    this.bg.fillRect(0, 0, this.scene.cameras.main.width, 300)
    this.pointText = this.scene.add.text(40, 40, '0', { fontSize: 150 })

    this.createQueue()
    this.updateQueueUI()
    this.scene.registry.events.on('changedata-queue', () => {
      this.updateQueueUI()
    })
    this.scene.registry.events.on('changedata-points', () => {
      this.pointText.text = this.scene.registry.values.points.toString()
    })
  }

  update() {}

  createQueue() {
    this.uiGroup = this.scene.add.group()
    for (let i = 0; i < 10; i++) {
      const sprite = this.scene.add
        .image(500 + i * 130, 150, 'sprites', 'metal.png')
        .setAlpha(0)
        .setScale(1.3)
      this.uiGroup.add(sprite)
    }
  }

  updateQueueUI() {
    this.uiGroup.children.entries.forEach((c) => c.setAlpha(0))
    this.scene.registry.get('queue').forEach((o, i) => {
      const sprite = this.uiGroup.children.entries[i]
      sprite.setFrame(KEYS[o.color] + '.png')
      sprite.setAlpha(1)
    })
  }
}
