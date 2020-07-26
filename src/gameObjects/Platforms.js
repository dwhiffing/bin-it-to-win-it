class Life extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'flares', 'green')
    this.setDepth(2)
    this.setSensor(true)
    this.setScale(2)
    this.setStatic(true)
    this.body.ignorePointer = true
    this.body.label = 'life'
  }
}
class Coin extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'flares', 'yellow')
    this.setDepth(2)
    this.setSensor(true)
    this.setStatic(true)
    this.body.label = 'coin'
    this.body.ignorePointer = true
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
      maxSize: 10,
    })
    this.coinGroup = this.scene.add.group({
      classType: Coin,
      maxSize: 500,
    })

    let platformY = this.height - 100

    const life = this.lifeGroup.get(
      Phaser.Math.RND.between(500, 500),
      Phaser.Math.RND.between(300, 300),
    )
    if (life) {
      life.setActive(true)
      life.setVisible(true)
    }

    let platform = this.scene.matter.add
      .image(this.wWidth, platformY, 'platform', null, {
        isStatic: true,
      })
      .setTint(0xff9955)
      .setScale(200, 3)
      .setDepth(2)
      .setPipeline('Light2D')
      .setCollisionGroup(this.scene.clipGroup)
    platform.body.label = 'platform'

    while (platformY > -this.scene.wHeight) {
      platformY -= Phaser.Math.RND.between(800, 1500)
      let xOffset = Phaser.Math.RND.between(0, this.scene.wWidth)
      let xPos = this.width / 2 + xOffset
      const platform = this.scene.matter.add
        .image(xPos, platformY, 'platform', null, {
          isStatic: true,
        })
        .setDepth(1)
        .setTint(0xff9955)
        .setCollisionGroup(this.scene.clipGroup)
        .setPipeline('Light2D')
      for (let i = 0; i < 10; i++) {
        const coin = this.coinGroup.get(-440 + xPos + i * 100, platformY - 120)
        if (coin) {
          coin.setActive(true)
          coin.setVisible(true)
        }
      }
      this.sprites.push(platform)
      platform.body.label = 'platform'
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
}
