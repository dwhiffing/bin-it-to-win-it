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
    this.wWidth = this.width * 2
    this.wHeight = this.height * 10

    const totalHeight = this.wHeight + this.height
    this.boundsOpts = [0, -this.wHeight, this.wWidth, totalHeight]
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
      .setScale(2)
      .setScrollFactor(0)
      .setDepth(1)
      .setPipeline('Light2D')
    this.lights.enable()
    this.lights.setAmbientColor(0x777777)

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
      this.cameras.main.scrollX / 4,
      this.cameras.main.scrollY / 3,
    )
  }

  setupWorld() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.2, 0.2, 0, 300)
    this.cameras.main.setDeadzone(this.width - 600, 300)
    this.cameras.main.setZoom(1)
    this.cameras.main.setBounds(...this.boundsOpts)

    this.matter.world.setBounds(...this.boundsOpts)
    this.matter.add.mouseSpring({ stiffness: 0.005, damping: 0.1, length: 300 })
  }
}
