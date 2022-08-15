import { LEVELS } from '../constants/levels'

export default class BlockService {
  constructor(scene) {
    this.scene = scene
    this.category = scene.matter.world.nextCategory()
    this.shapes = scene.cache.json.get('shapes')
    this.init = this.init.bind(this)
  }

  update() {}

  init() {
    this.children = []
    const level = this.scene.registry.values.level
    level.blocks.forEach((block) => this.getBlock(...block))
    this.height = 0
    const lastBlock = level.blocks[level.blocks.length - 1]
    this.scene.registry.set(
      'blockHeight',
      yOffset + (lastBlock[1] + 1) * yTileSize + 200,
    )
  }

  clean() {
    if (this.children)
      this.children.forEach((child) => {
        child.body && child.body.destroy()
        child && child.destroy()
      })
  }

  getBlock(x, y, type, invert) {
    const xMod = y % 2 === 0 ? 0 : 0.5
    let _x = xOffset + (x - xMod) * xTileSize
    let _y = yOffset + y * yTileSize

    if (type === 'flip') {
      let part = this.createPart('flip-part', _x, _y)
      part.setOrigin(0.5, 0.45).setAngle(invert ? -25 : 25)
    }

    if (type === 'flip2') {
      this.createPart('flip2-part', invert ? _x - 100 : _x, _y).setScale(
        invert ? -1 : 1,
        1,
      )
    }

    const sprite = this.scene.matter.add
      .sprite(0, 0, 'sprites', type + '.png', { shape: this.shapes[type] })
      .setOrigin(0)
      .setCollisionCategory(this.category)
      .setFriction(1)

    if (invert) {
      sprite.setScale(-1, 1)
      _x += xTileSize
    }
    let { x: oX, y: oY } = sprite.body.bounds.min
    if (type === 'hold2' && invert) {
      oX -= 20
    }

    setBodyOffset(sprite.body, invert ? -oX : oX, oY)
    sprite.setPosition(_x, _y)

    this.children.push(sprite)
  }

  createPart(key, x, y) {
    const { offsetX, offsetY, originX, originY } = PART_OFFSETS[key]
    const shape = this.shapes[key]
    let part = this.scene.matter.add.sprite(x, y, 'sprites', key + '.png', {
      shape,
    })
    this.scene.matter.add.worldConstraint(part, 0, 1, {
      pointA: { x: x + offsetX, y: y + offsetY },
    })

    setBodyOffset(part.body, x + originX, y + originY)
    this.children.push(part)

    return part.setFrictionAir(0.3).setCollisionCategory(this.category)
  }
}

const setBodyOffset = (body, offsetX, offsetY) => {
  body.position.x = offsetX
  body.position.y = offsetY
  body.positionPrev.x = offsetX
  body.positionPrev.y = offsetY
}

const PART_OFFSETS = {
  'flip-part': { offsetX: 250, offsetY: 240, originX: 0, originY: 25 },
  'flip2-part': { offsetX: 310, offsetY: 450, originX: 12, originY: 25 },
}

const xTileSize = 500
const yTileSize = 679
const xOffset = 330
const yOffset = 500
