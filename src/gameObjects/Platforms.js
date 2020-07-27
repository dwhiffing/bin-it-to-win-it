import { Coin } from './Coin'
import { Life } from './Life'
import { CLOUD } from '../behaviors'

export default class Platforms {
  constructor(scene) {
    this.scene = scene
    this.width = this.scene.cameras.main.width
    this.height = this.scene.cameras.main.height
    this.sprites = []
    this.update = this.update.bind(this)
    this.lifeGroup = this.scene.add.group({ classType: Life, maxSize: 10 })
    this.coinGroup = this.scene.add.group({ classType: Coin, maxSize: 500 })

    let yPos = this.height - 100
    let plat = this.createPlatform(0, yPos, 8)
    plat.x = this.scene.wWidth / 2
    let index = 0
    while (yPos > -this.scene.wHeight) {
      const { wWidth } = this.scene
      yPos -= 3000
      // let xPos = Phaser.Math.RND.pick([0, 1, 2])
      let xPos = [1, 0, 1, 2][index++ % 4]
      const isLife = index % 5 === 0
      const platform = this.createPlatform(xPos, yPos, isLife ? 8 : 3)
      const platformPositions = [
        platform.width * 1.6,
        wWidth / 2,
        wWidth - platform.width * 1.6,
      ]
      const x = platformPositions[xPos]
      platform.x = x
      this.sprites.push(platform)

      if (isLife) {
        this.createLife(wWidth / 2, yPos - 250)
        platform.x = platformPositions[1]
      } else {
        for (let i = 0; i < 5; i++) {
          this.createCoin(-1050 + x + i * 500, yPos - 250)
        }
      }
    }
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

  createPlatform(x, y, scale = 1) {
    let platform = this.scene.matter.add
      .image(x, y, 'platform', null, { isStatic: true })
      .setDepth(1)
      .setScale(scale)
      .setCollisionGroup(this.scene.clipGroup)
    platform.body.label = 'platform'
    this.scene.behavior.enable(platform)
    platform.behaviors.set('cloud', CLOUD, {})
    return platform
  }

  createLife(x, y) {
    const life = this.lifeGroup.get(x, y)
    if (life) {
      life.setActive(true)
      life.setVisible(true)
    }
  }

  createCoin(x, y) {
    const coin = this.coinGroup.get(x, y)
    if (coin) {
      coin.setActive(true)
      coin.setVisible(true)
    }
  }
}
