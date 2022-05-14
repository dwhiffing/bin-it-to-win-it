export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.nodeCategory = this.matter.world.nextCategory()
    this.capCategory = this.matter.world.nextCategory()

    this.shapes = this.cache.json.get('shapes')
    this.nodes = []

    this.getBlock(1, 0, 'two')
    this.getBlock(1, 1, 'hold')
    this.getBlock(2, 1, 'flip')
    this.getBlock(0, 2, 'left')
    this.getBlock(1, 2, 'flip2')
    this.getBlock(2, 2, 'hold2')
    this.getBlock(0, 3, 'straight')
    this.getBlock(1, 3, 'left')
    this.getBlock(2, 3, 'right')
    this.getBlock(0, 4, 'cup').setTint(0xff0000)
    this.getBlock(3, 4, 'cup').setTint(0x00ff00)
    this.cameras.main.setZoom(0.5)

    this.input.keyboard.addKey('Z').on('down', (event) => {
      this.getCircle(this.width / 2 - 90, -30, 0x00ff00)
    })

    this.input.keyboard.addKey('X').on('down', (event) => {
      this.getCircle(this.width / 2 + 90, -30, 0xff0000)
    })
  }

  update() {
    this.nodes.forEach((node) => {
      if (node.y > 1600) {
        node.cap && node.cap.setSensor(true)
      }
    })
  }

  getCircle(x, y, color) {
    if (this.preventSpawn) return
    setTimeout(() => {
      this.preventSpawn = false
    }, 750)
    this.preventSpawn = true
    const node = this.matter.add
      .image(x, y, 'ball')
      .setScale(0.33)
      .setCircle(14)
      .setTint(color)
      .setMass(20)
      .setCollisionCategory(this.nodeCategory)
      .setCollidesWith([this.nodeCategory])
    const cap = this.matter.add
      .image(x, y, 'ball')
      .setScale(1.35)
      .setCircle(65)
      .setTint(color)
      .setMass(20)
      .setCollisionCategory(this.capCategory)
      .setCollidesWith([this.capCategory])
    node.cap = cap

    this.matter.add.constraint(node, cap, 0, 1)
    this.nodes.push(node)

    return node
  }

  getBlock(x, y, type) {
    const xMod = y % 2 === (type === 'cup' ? 1 : 0) ? 0 : 0.5
    let _x = 170 + (x - xMod) * 374
    let _y = 280 + y * 510 + (type === 'cup' ? -20 : 0)

    if (type === 'hold') {
      _y -= 8
      _x -= 3
    }

    if (type === 'hold2') {
      _x += 7
      _y += 4
    }

    if (type === 'flip2') {
      _x -= 2
      _y -= 36
    }

    if (type === 'flip') {
      var block = this.matter.add
        .sprite(_x, _y, 'thing', 0, {
          shape: this.shapes.thing,
        })
        .setScale(0.75)

      this.matter.add.worldConstraint(block, 0, 1, {
        angularStiffness: 200,
        damping: 1,
        pointA: { x: _x, y: _y - 66 },
      })

      block.body.position.x = _x
      block.body.position.y = _y + 25
      block.body.positionPrev.x = _x
      block.body.positionPrev.y = _y + 25
      block
        .setOrigin(0.5, 0.45)
        .setFrictionAir(0.3)
        .setAngle(28)
        .setCollisionCategory(this.nodeCategory)
    }

    if (type === 'flip2') {
      var block = this.matter.add
        .sprite(_x + 30, _y + 100, 'thing2', 0, {
          shape: this.shapes.thing2,
        })
        .setScale(0.7)

      this.matter.add.worldConstraint(block, 0, 1, {
        angularStiffness: 200,
        damping: 1,
        pointA: { x: _x + 30, y: _y + 100 },
      })

      block.body.position.x = _x + 35
      block.body.position.y = _y + 100
      block.body.positionPrev.x = _x + 35
      block.body.positionPrev.y = _y + 100
      block.setFrictionAir(0.3).setCollisionCategory(this.nodeCategory)
    }
    return this.matter.add
      .sprite(_x, _y, type, 0, {
        shape: this.shapes[type],
      })
      .setScale(0.75)
      .setStatic(true)
      .setCollisionCategory(this.nodeCategory)
  }
}
