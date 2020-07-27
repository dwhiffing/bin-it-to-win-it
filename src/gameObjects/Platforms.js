import { Coin } from './Coin'
import { Life } from './Life'
import { CLOUD } from '../behaviors'
import { CLOUDS_ENABLED, Y_STEP } from '../constants'

export default class Platforms {
  constructor(scene) {
    this.scene = scene
    this.width = this.scene.cameras.main.width
    this.height = this.scene.cameras.main.height
    this.sprites = []
    this.update = this.update.bind(this)
    this.lifeGroup = this.scene.add.group({ classType: Life, maxSize: 100 })
    this.coinGroup = this.scene.add.group({ classType: Coin, maxSize: 5000 })

    this.generateLevel()
  }

  update() {
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
      const yStep = Phaser.Math.Clamp(Y_STEP + 400 * (level - 1), 0, 9000)
      yPos -= yStep

      // place safety floor every 5 floors
      const isLife = (index + 1) % 5 === 0
      const platform = this.createPlatform(0, yPos, isLife ? 9 : 4)

      // TODO: need to be able to swap floor patterns and put more than one platform per yPos
      const w = platform.width * 1.6
      platform.x = [w, wWidth / 2, wWidth - w][[1, 0, 1, 2][index % 4]]
      this.sprites.push(platform)
      if (isLife) {
        this.createLife(wWidth / 2, yPos - 1200)
        platform.x = wWidth / 2
      }

      if (index > 0) {
        // TODO: need to be able to place coins in different patterns based on the level
        Phaser.Actions.PlaceOnLine(
          this.getCoins(4 + level),
          new Phaser.Geom.Line(
            platform.x,
            yPos * 0.97,
            platform.x +
              [wWidth / 4, wWidth / 4, wWidth / -4, wWidth / -4][index % 4],
            yPos + yStep * 0.6,
          ),
        )
      }

      Phaser.Actions.PlaceOnCircle(
        this.getCoins(12 + 2 * level),
        new Phaser.Geom.Circle(
          platform.x,
          yPos - 1200 - 50 * level,
          800 + 25 * level,
        ),
      )
      index++
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
