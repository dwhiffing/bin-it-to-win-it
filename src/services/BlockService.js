import { LEVELS } from '../constants/levels'

export default class BlockService {
  constructor(scene) {
    this.scene = scene
    this.category = scene.matter.world.nextCategory()
    this.shapes = scene.cache.json.get('shapes')
    LEVELS[scene.levelIndex].forEach((block) => this.getBlock(...block))
  }

  update() {}

  getBlock(x, y, type) {
    const xMod = y % 2 === 0 ? 0 : 0.5
    let _x = xOffset + (x - xMod) * xTileSize
    let _y = yOffset + y * yTileSize

    if (type === 'flip') {
      let part = this.createPart('flip-part', _x, _y)
      part.setOrigin(0.5, 0.45).setAngle(28)
    }

    if (type === 'flip2') {
      this.createPart('flip2-part', _x, _y)
    }

    const sprite = this.scene.matter.add
      .sprite(_x, _y, type, 0, { shape: this.shapes[type] })
      .setOrigin(0)
      .setCollisionCategory(this.category)
    const { x: oX, y: oY } = sprite.body.bounds.min
    setBodyOffset(sprite.body, oX, oY)
    sprite.setPosition(_x, _y)
  }

  createPart(key, x, y) {
    const { offsetX, offsetY, originX, originY } = PART_OFFSETS[key]
    const shape = this.shapes[key]
    let part = this.scene.matter.add.sprite(x, y, key, 0, { shape })
    this.scene.matter.add.worldConstraint(part, 0, 1, {
      pointA: { x: x + offsetX, y: y + offsetY },
    })

    setBodyOffset(part.body, x + originX, y + originY)
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
  'flip2-part': { offsetX: 310, offsetY: 450, originX: 5, originY: 25 },
}

const xTileSize = 500
const yTileSize = 679
const xOffset = 330
const yOffset = 330
