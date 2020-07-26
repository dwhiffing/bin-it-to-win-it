import Player from '../gameObjects/Player'
import Platforms from '../gameObjects/Platforms'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.platforms = []
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.wWidth = this.width * 10
    this.wHeight = this.height * 20
  }

  create() {
    this.registry.set('lives', 5).set('score', 0)
    this.behavior = this.plugins.get('BehaviorPlugin')
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
      .setScale(3)
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
      this.cameras.main.scrollX / 5,
      this.cameras.main.scrollY / 7,
    )
  }

  setupWorld() {
    let pointerStartX,
      pointerStartY,
      isPanning = false
    this.input.on('pointerdown', (pointer) => {
      if (
        !this.player.sprite.drawLine &&
        this.player.sprite.body.speed < 10 &&
        this.player.sprite.canBeClicked
      ) {
        this.cameras.main.stopFollow()
        this.player.sprite.body.ignorePointer = true
        pointerStartX = pointer.x
        pointerStartY = pointer.y
        this.tweens.add({
          targets: [this.bg],
          scale: 7,
          duration: 500,
          ease: 'Quad.easeInOut',
        })
        this.cameras.main.zoomTo(0.15, 500, 'Quad.easeInOut', true, (c, p) => {
          if (p === 1) {
            isPanning = true
          }
        })
      }
    })

    this.input.on('pointermove', (pointer) => {
      if (isPanning) {
        let spriteY = this.player.sprite.y
        if (spriteY > -2500) {
          spriteY = -2500
        }
        const diffX = this.player.sprite.x + (pointerStartX - pointer.x) * 10
        const diffY = spriteY + (pointerStartY - pointer.y) * 20
        this.cameras.main.pan(
          diffX,
          diffY - this.player.sprite.width,
          0,
          'Linear',
          true,
        )
        // this.cameras.main.setScroll(diffX * 10, diffY * 5)
      }
    })

    this.input.on('pointerup', () => {
      if (!isPanning) return
      isPanning = false
      this.player.sprite.body.ignorePointer = false
      this.cameras.main.pan(
        this.player.sprite.x,
        this.player.sprite.y - this.player.sprite.width,
        500,
        'Quad.easeInOut',
        true,
        (camera, progress) => {
          if (progress === 1) {
            this.tweens.add({
              targets: [this.bg],
              scale: 3,
              duration: 500,
              ease: 'Quad.easeInOut',
            })
            this.cameras.main.zoomTo(
              0.6,
              500,
              'Quad.easeInOut',
              true,
              (c, p) => {
                if (p === 1) {
                  isPanning = false
                }
              },
            )
            this.cameras.main.startFollow(
              this.player.sprite,
              true,
              0.2,
              0.2,
              0,
              300,
            )
          }
        },
      )
    })

    this.cameras.main.startFollow(this.player.sprite, true, 0.2, 0.2, 0, 300)
    this.cameras.main.setDeadzone(100, 100)
    this.cameras.main.setZoom(0.6)
    const totalHeight = this.wHeight + this.height
    this.matter.world.setBounds(
      0,
      -this.wHeight,
      this.wWidth,
      totalHeight,
      500,
      true,
      true,
      false,
      true,
    )
    this.cameras.main.setBounds(0, -this.wHeight, this.wWidth, totalHeight)
  }
}
