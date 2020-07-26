import { Coin } from './Coin'
import { Life } from './Life'

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
    this.createPlatform(0, yPos).setScale(200, 3)
    let index = 0
    while (yPos > -this.scene.wHeight) {
      const { wWidth } = this.scene
      yPos -= 5000
      // let xPos = Phaser.Math.RND.pick([0, 1, 2])
      let xPos = [1, 0, 1, 2][index++ % 4]
      const platform = this.createPlatform(xPos, yPos)
      const platformPositions = [
        platform.width * 1.6,
        wWidth / 2,
        wWidth - platform.width * 1.6,
      ]
      const x = platformPositions[xPos]
      platform.x = x
      platform.setScale(3, 1)
      this.sprites.push(platform)

      if (index % 5 === 0) {
        this.createLife(wWidth / 2, yPos - 120)
        platform.x = platformPositions[1]
        platform.setScale(10, 1)
      } else {
        for (let i = 0; i < 5; i++) {
          this.createCoin(-400 + x + i * 200, yPos - 120)
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

  createPlatform(x, y) {
    let platform = this.scene.matter.add
      .image(x, y, 'platform', null, { isStatic: true })
      .setDepth(1)
      .setTint(0xff9955)
      .setCollisionGroup(this.scene.clipGroup)
      .setPipeline('Light2D')
    platform.body.label = 'platform'
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
