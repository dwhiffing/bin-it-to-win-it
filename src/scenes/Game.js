import Player from '../gameObjects/Player'
import Platforms from '../gameObjects/Platforms'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.platforms = []
  }

  init() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.wWidth = this.width * 20
    this.wHeight = this.height * 100
  }

  create() {
    this.noClipGroup = this.matter.world.nextGroup(true)
    this.clipGroup = this.matter.world.nextGroup()

    this.bg = this.add
      .tileSprite(
        this.width / 2,
        this.height / 2,
        this.width,
        this.height,
        'bg',
      )
      .setScale(7)
      .setTint(0x444444)
      .setScrollFactor(0)
      .setDepth(1)
      .setPipeline('Light2D')
    this.lights.enable()
    this.lights.setAmbientColor(0xcccccc)

    this.platforms = new Platforms(this)
    this.player = new Player(this, this.noClipGroup)

    this.setupWorld()
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.player.update()
    this.platforms.update()
    this.bg.setTilePosition(
      this.cameras.main.scrollX / 10,
      this.cameras.main.scrollY / 15,
    )
  }

  setupWorld() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.2, 0.2, 0, 300)
    this.cameras.main.setDeadzone(100, 100)
    this.cameras.main.setZoom(0.5)
    const totalHeight = this.wHeight + this.height
    this.cameras.main.setBounds(0, -this.wHeight, this.wWidth, totalHeight)
    this.matter.world.setBounds(0, -this.wHeight, this.wWidth, totalHeight, 500)
  }
}
