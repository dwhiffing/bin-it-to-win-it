import { clamp } from 'lodash'

const KEYS = {
  0xff0000: 'plastic',
  0x00ff00: 'glass',
  0x0000ff: 'paper',
  0xffff00: 'metal',
  0xff00ff: 'garbage',
}

export default class TrashService {
  constructor(scene) {
    this.scene = scene
    this.width = scene.width
    this.height = scene.height
    this.trash = []
    this.pileIndex = 0
    this.pile = scene.level.pile
    this.bins = scene.level.bins
    this.createQueue()
    this.createBottomSections()
    this.category = scene.matter.world.nextCategory()
    this.putTrash = this.putTrash.bind(this)
    this.addTrashToQueue = this.addTrashToQueue.bind(this)
  }

  update() {
    this.trash = this.trash.filter((child) => {
      if (child.y > this.height) {
        // check x of child to see if it went in the right pile
        const index = this.scene.level.bins.indexOf(child.color)
        const size = this.height / this.scene.level.bins.length
        const minX = size * index
        const maxX = size * (index + 1)
        const pointChange = child.x >= minX && child.x <= maxX ? 1 : -1
        this.scene.points += pointChange
        this.scene.pointText.text = this.scene.points.toString()
        child.setAlpha(0).setActive(false)
        return false
      }
      return true
    })
  }

  createBottomSections() {
    this.queue = []
    for (let i = 0; i < this.bins.length; i++) {
      const color = this.bins[i]
      const graphics = this.scene.add.graphics()
      graphics.fillStyle(color, 1.0)
      const { width, height } = this.scene.cameras.main
      const chunkSize = width / this.bins.length
      graphics.fillRect(chunkSize * i, height - 200, chunkSize, 200)
    }
  }

  createQueue() {
    this.queue = []
    this.uiGroup = this.scene.add.group()
    for (let i = 0; i < 10; i++) {
      const sprite = this.scene.add
        .image(500 + i * 180, 100, 'sprites', 'metal.png')
        .setAlpha(0)
      this.uiGroup.add(sprite)
    }
  }

  addTrashToQueue() {
    if (this.queue.length === 10) {
      // TODO: game over
      this.scene.scene.start('Menu')
      return
    }
    const color = this.pile[this.pileIndex++]
    if (color) {
      this.queue.push({ color })
      this.updateQueueUI()
    }
  }

  updateQueueUI() {
    this.uiGroup.children.entries.forEach((c) => c.setAlpha(0))
    this.queue.forEach((o, i) => {
      const sprite = this.uiGroup.children.entries[i]
      sprite.setFrame(KEYS[o.color] + '.png')
      sprite.setAlpha(1)
    })
  }

  putTrash(_x) {
    if (this.preventSpawn || this.queue.length === 0) return
    let x = clamp(_x, this.width / 2 - 200, this.width / 2 + 200)

    setTimeout(() => (this.preventSpawn = false), 750)
    this.preventSpawn = true

    const { color } = this.queue.shift()
    this.create(x, -30, color)
    this.updateQueueUI()
  }

  create(x, y, color) {
    const node = this.scene.matter.add
      .image(x, y, 'sprites', KEYS[color] + '.png')
      .setScale(1)
      .setCircle(17)
      .setCollisionCategory(this.scene.blocks.category)
      .setCollidesWith([this.scene.blocks.category])
    const cap = this.scene.matter.add
      .image(x, y, 'sprites', KEYS[color] + '.png')
      .setAlpha(0)
      .setCircle(85)
      .setCollisionCategory(this.category)
      .setCollidesWith([this.category])

    const sprites = [node, cap]
    sprites.forEach((i) => {
      i.color = color
      i.setMass(20)
    })
    this.scene.matter.add.constraint(node, cap, 0, 1)
    this.trash.push(node)
    return node
  }
}
