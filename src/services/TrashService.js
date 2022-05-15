export default class TrashService {
  constructor(scene) {
    this.scene = scene
    this.children = []
    this.category = scene.matter.world.nextCategory()
  }

  update() {}

  create(x, y, color) {
    if (this.preventSpawn) return

    setTimeout(() => (this.preventSpawn = false), 750)
    this.preventSpawn = true

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
