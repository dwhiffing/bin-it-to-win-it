import { clamp } from 'lodash'
import { KEYS } from '../constants'

export default class TrashService {
  constructor(scene) {
    this.scene = scene
    this.width = scene.width
    this.height = scene.height
    this.init = this.init.bind(this)

    this.category = scene.matter.world.nextCategory()
    this.putTrash = this.putTrash.bind(this)
    this.graphics = this.scene.add.graphics()

    this.addTrashToQueue = this.addTrashToQueue.bind(this)
    this.graphics.depth = 999
  }

  init() {
    this.trash = []
    this.pileIndex = 0
    this.scene.registry.values.queueIndex = 0
    this.pile = this.scene.registry.values.level.pile
    this.bins = this.scene.registry.values.level.bins
    this.createBottomSections()
  }

  clean() {
    if (!this.trash) return
    this.trash.forEach((child) => {
      if (!child || !child.body) return
      child.setPosition(-1000, -1000)
      child.setActive(false)
      child.destroy()
    })
  }

  update() {
    if (!this.trash) return
    this.trash = this.trash.filter((child) => {
      if (!child || !child.body) return
      if (child.y > this.scene.registry.values.blockHeight + 50) {
        // check x of child to see if it went in the right pile
        const index = this.scene.registry.values.level.bins.indexOf(child.color)
        const size = this.width / this.scene.registry.values.level.bins.length
        const minX = size * index
        const maxX = size * (index + 1)
        if (!(child.x >= minX && child.x <= maxX)) {
          this.scene.gameover()
        }
        child.setAlpha(0).setActive(false)
        return false
      }
      return true
    })
  }

  addTrashToQueue() {
    const queue = this.scene.registry.get('queue')
    if (queue.length === 10) {
      return
    }
    const color = this.pile[this.pileIndex++]
    if (color) {
      this.scene.registry.set('queue', [...queue, { color }])
    }
  }

  putTrash(_x) {
    const queue = this.scene.registry.get('queue')
    if (queue.length === 0) return
    let x = clamp(_x, this.width / 2 - 200, this.width / 2 + 200)
    const i = this.scene.registry.values.queueIndex
    const { color } = queue[i]
    this.scene.registry.set('queue', [
      ...queue.slice(0, i),
      ...queue.slice(i + 1),
    ])

    this.scene.registry.values.queueIndex = queue.length === 0 ? -1 : 0
    this.create(x, -30, color)
  }

  createBottomSections() {
    this.graphics.clear()
    for (let i = 0; i < this.bins.length; i++) {
      const color = this.bins[i]
      this.graphics.fillStyle(color, 1.0)
      const { width } = this.scene.cameras.main
      const yPos = this.scene.registry.values.blockHeight
      const chunkSize = width / this.bins.length
      this.graphics.fillRect(chunkSize * i, yPos, chunkSize, 500)
    }
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
