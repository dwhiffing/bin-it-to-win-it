import { Coin } from './Coin'
import { Life } from './Life'
import { CLOUD } from '../behaviors'
import { CLOUDS_ENABLED, MAX_Y_STEP, Y_STEP } from '../constants'

class Text extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(scene, 0, 0, '', { fontFamily: 'AnotherHand', fontSize: 100 })
    this.setStroke(0x000000, 10)
    this.spawn = this.spawn.bind(this)
  }

  spawn(x, y, score) {
    this.setActive(true)
    this.x = x
    this.y = y
    this.alpha = 1
    this.setText(`${score}`)
  }

  update(entity) {
    super.update()
    if (this.active) {
      this.y -= 1
      this.alpha -= 0.01
      if (this.alpha <= 0) this.setActive(false)
    }
  }
}

export default class Platforms {
  constructor(scene) {
    this.scene = scene
    this.width = this.scene.cameras.main.width
    this.height = this.scene.cameras.main.height
    this.sprites = []
    this.update = this.update.bind(this)
    this.lifeGroup = this.scene.add.group({
      classType: Life,
      maxSize: 100,
    })
    this.coinGroup = this.scene.add.group({
      classType: Coin,
      maxSize: 1000,
    })
    this.textGroup = this.scene.add.group({
      classType: Text,
      maxSize: 50,
    })
    this.textGroup.get().spawn(0, 0, 0)
    this.textGroup.get().spawn(0, 0, 0)

    this.generateLevel()
  }

  update() {
    this.textGroup.getChildren().forEach((p) => p.update())
    this.sprites.forEach((p) =>
      p.setCollisionGroup(
        this.scene.player.sprite.body.velocity.y > 0 &&
          !this.scene.player.sprite.drawLine
          ? this.scene.clipGroup
          : this.scene.noClipGroup,
      ),
    )
  }

  generateLevel() {
    const { wWidth } = this.scene

    let yPos = this.height - 100

    // create floor
    let plat = this.createPlatform(0, yPos, 9)
    plat.x = wWidth / 2

    let index = 0
    const level = this.scene.registry.get('areanum')
    while (yPos > -this.scene.wHeight + 6000) {
      const yStep = Phaser.Math.Clamp(Y_STEP + 400 * (level - 1), 0, MAX_Y_STEP)
      yPos -= yStep

      const layout = this.getLayout()
      let floorData = layout[index % layout.length]
      if (!Array.isArray(floorData)) {
        floorData = [floorData]
      }

      floorData.forEach((floor) => this.generateFloor(floor, index, yPos))

      index++
    }
  }

  generateFloor(floor, index, yPos) {
    const level = this.scene.registry.get('areanum')
    const scaleMod = Phaser.Math.Clamp(
      1 - (Math.ceil(level / 5) - 1) / 10,
      0.5,
      1,
    )
    const scale = floor.s || 4 * scaleMod
    const platform = this.createPlatform(0, yPos, scale)
    platform.x = floor.x
    platform.y += floor.y || 0

    this.sprites.push(platform)
    const isLife = floor.l
    if (isLife) {
      this.createLife(platform.x, yPos - 1200)
    }

    this.generateCoins(floor.c || [], index, platform.x, platform.y)
  }

  getLayout() {
    const { wWidth } = this.scene
    const w = 1600
    const h = wWidth / 2
    const e = wWidth - w
    let LAYOUTS = [
      // 8
      [
        { x: w, s: 1.8, c: [0] },
        { x: h, s: 1.8, c: [0] },
        { x: e, s: 1.8, c: [0] },
        { x: h, s: 9, l: true, c: [0, 3] },
      ],
      // 2
      [
        [
          { x: w, s: 2.3, c: [0, 3] },
          { x: h, s: 2.3, c: [0, 3] },
          { x: e, s: 2.3, c: [0, 3] },
        ],
        [
          { x: w, s: 2.3 },
          { x: e, s: 2.3 },
        ],
        [
          { x: w, s: 2.3, c: [0, 3] },
          { x: h, s: 2.3, c: [0] },
          { x: e, s: 2.3, c: [0, 3] },
        ],
        { x: h, s: 9, l: true, c: [0, 3] },
      ],
      // 3
      [
        { x: h, c: [0] },
        { x: w, c: [1] },
        { x: h, c: [2] },
        { x: e, c: [2] },
        { s: 9, x: h, l: true, c: [1, 3] },
      ],
      // 4
      [
        [
          {
            x: w + Phaser.Math.RND.between(0, 1000),
            s: 3,
            c: [3],
          },
          {
            x: e + Phaser.Math.RND.between(-1000, 0),
            s: 3,
            c: [3],
          },
        ],
        {
          x: h + Phaser.Math.RND.between(-2000, 2000),
          s: 3,
          c: [3],
        },
        { s: 9, x: h, l: true, c: [3] },
      ],
      // 5
      [
        [
          { x: w, y: 0, s: 1.8, c: [0] },
          { x: h, y: -1000, s: 1.8, c: [0] },
          { x: e, y: -2000, s: 1.8, c: [0] },
        ],
        [
          { x: e, y: 0, s: 1.8 },
          { x: h, y: -1000, s: 1.8, c: [0] },
          { x: w, y: -2000, s: 1.8, c: [0] },
        ],
        { s: 9, x: h, l: true, c: [3] },
      ],
      // 6
      [
        [{ x: w, s: 2.75, c: [1, 3] }],
        [{ x: e, s: 2.75, c: [2, 3] }],
        [{ x: w, s: 2.75, c: [1, 3] }],
        { x: h, s: 9, l: true, c: [] },
      ],
      // 7
      [
        {
          x: w + Phaser.Math.RND.between(0, 3000),
          s: 2.5,
          c: [3],
        },
        {
          x: e + Phaser.Math.RND.between(-3000, 0),
          s: 2.5,
          c: [3],
        },
        {
          x: h + Phaser.Math.RND.between(-1500, 1500),
          s: 2.5,
          c: [3],
        },
        { s: 9, x: h, l: true, c: [3] },
      ],
    ]
    const level = this.scene.registry.get('areanum')
    if (level === 1) {
      // 1
      LAYOUTS[0] = [
        { x: h, s: 9, c: [0] },
        { x: h, s: 9, c: [0] },
        { x: h, s: 9, l: true, c: [0, 3] },
      ]
    }
    return LAYOUTS[(level - 1) % LAYOUTS.length]
  }

  generateCoins(coinLayouts, index, x, y) {
    const { wWidth } = this.scene
    const level = this.scene.registry.get('areanum')
    const yStep = Phaser.Math.Clamp(Y_STEP + 400 * (level - 1), 0, MAX_Y_STEP)
    const lineCoinCount = Phaser.Math.Clamp(4 + level, 4, 20)
    const clampedLevel = Phaser.Math.Clamp(level, 1, 15)
    const circleCoinCount = Phaser.Math.Clamp(12 + 2 * level, 12, 40)
    if (coinLayouts.includes(0)) {
      Phaser.Actions.PlaceOnLine(
        this.getCoins(lineCoinCount),
        new Phaser.Geom.Line(x, y * 0.97, x, y + yStep * 0.6),
      )
    }
    if (coinLayouts.includes(1)) {
      Phaser.Actions.PlaceOnLine(
        this.getCoins(lineCoinCount),
        new Phaser.Geom.Line(x, y * 0.97, x + wWidth / 4, y + yStep * 0.6),
      )
    }
    if (coinLayouts.includes(2)) {
      Phaser.Actions.PlaceOnLine(
        this.getCoins(lineCoinCount),
        new Phaser.Geom.Line(x, y * 0.97, x + wWidth / -4, y + yStep * 0.6),
      )
    }

    if (coinLayouts.includes(3)) {
      Phaser.Actions.PlaceOnCircle(
        this.getCoins(circleCoinCount),
        new Phaser.Geom.Circle(
          x,
          y - 1200 - 50 * clampedLevel,
          800 + 25 * clampedLevel,
        ),
      )
    }
  }

  getCoins(count) {
    let coins = []
    for (let i = 0; i < count; i++) {
      coins.push(this.createCoin(0, 0))
    }
    return coins
  }

  createPlatform(x, y, scale = 1) {
    let platform = this.scene.matter.add
      .image(x, y, 'platform', null, { isStatic: true })
      .setDepth(1)
      .setOrigin(0.5, 0.65)
      .setScale(scale)
      .setCollisionGroup(this.scene.clipGroup)
    platform.body.label = 'platform'
    if (CLOUDS_ENABLED) {
      this.scene.behavior.enable(platform)
      platform.behaviors.set('cloud', CLOUD, {})
    }
    return platform
  }

  createLife(x, y) {
    const life = this.lifeGroup.get(x, y)
    if (life) {
      life.setActive(true)
      life.setVisible(true)
    }
    return life
  }

  createCoin(x, y) {
    const coin = this.coinGroup.get(x, y)
    if (coin) {
      coin.setActive(true)
      coin.setVisible(true)
    }
    return coin
  }
}
