export default class TrashService {
  constructor(scene) {
    this.scene = scene
    this.children = []
    this.createQueue()
    this.category = scene.matter.world.nextCategory()
    this.putLeft = this.putLeft.bind(this)
    this.add = this.add.bind(this)
    this.putRight = this.putRight.bind(this)
  }

  update() {}

  createQueue() {
    this.queue = []
    this.uiGroup = this.scene.add.group()
    for (let i = 0; i < 10; i++) {
      const sprite = this.scene.add
        .image(240 + i * 170, 100, 'ball')
        .setAlpha(0)
      this.uiGroup.add(sprite)
    }
  }

  add(color) {
    if (this.queue.length === 10) {
      // TODO: game over
      this.scene.scene.start('Menu')
      return
    }
    this.queue.push({ color })
    this.updateQueueUI()
  }

  putLeft() {
    this.put(-100)
  }

  putRight() {
    this.put(100)
  }

  updateQueueUI() {
    this.uiGroup.children.entries.forEach((c) => c.setAlpha(0))
    this.queue.forEach((o, i) => {
      const sprite = this.uiGroup.children.entries[i]
      sprite.setTint(o.color)
      sprite.setAlpha(1)
    })
  }

  put(x) {
    if (this.preventSpawn || this.queue.length === 0) return

    setTimeout(() => (this.preventSpawn = false), 750)
    this.preventSpawn = true

    const { color } = this.queue.shift()
    this.create(this.scene.width / 2 + x, -30, color)
    this.updateQueueUI()
  }

  create(x, y, color) {
    const node = this.scene.matter.add
      .image(x, y, 'ball')
      .setScale(0.5)
      .setCircle(19)
      .setCollisionCategory(this.scene.blocks.category)
      .setCollidesWith([this.scene.blocks.category])
    const cap = this.scene.matter.add
      .image(x, y, 'ball')
      .setScale(1.8)
      .setCircle(85)
      .setCollisionCategory(this.category)
      .setCollidesWith([this.category])

    const sprites = [node, cap]
    sprites.forEach((i) => i.setTint(color).setMass(20))
    this.scene.matter.add.constraint(node, cap, 0, 1)
    this.children.push(node)
    return node
  }
}
