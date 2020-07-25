export default class Platforms {
  constructor(scene) {
    this.scene = scene
    this.width = this.scene.cameras.main.width
    this.height = this.scene.cameras.main.height
    this.sprites = []
    this.update = this.update.bind(this)
    let platformY = this.height - 100

    let platform = this.scene.matter.add
      .image(this.width / 2, platformY, 'platform', null, {
        isStatic: true,
      })
      .setTint(0xaa4411)
      .setScale(10, 3)
      .setDepth(2)
      .setPipeline('Light2D')
      .setCollisionGroup(this.scene.clipGroup)
    platform.body.label = 'platform'

    while (platformY > -5000) {
      platformY -= Phaser.Math.RND.between(500, 600)
      let xOffset = Phaser.Math.RND.between(0, this.scene.wWidth)
      let xScale = Phaser.Math.RND.between(50, 300)
      const platform = this.scene.matter.add
        .image(this.width / 2 + xOffset, platformY, 'platform', null, {
          isStatic: true,
        })
        .setOrigin(0.5, 1)
        .setDepth(1)
        .setTint(0xaa4411)
        .setScale(xScale / 200, 1)
        .setCollisionGroup(this.scene.clipGroup)
        .setPipeline('Light2D')
      this.sprites.push(platform)
      platform.body.label = 'platform'
    }
  }

  update() {
    this.sprites.forEach((p) =>
      p.setCollisionGroup(
        this.scene.player.sprite.body.velocity.y > 0 &&
          !this.scene.player.drawLine
          ? this.scene.clipGroup
          : this.scene.noClipGroup,
      ),
    )
  }
}
