import Player from '../gameObjects/Player'
import Platforms from '../gameObjects/Platforms'
import {
  WORLD_SIZE,
  INITIAL_LIVES,
  BG_SCALE,
  BG_COLOR,
  BG_SCROLL_FACTOR,
  ZOOM_LEVELS,
  SCROLL_SPEED,
  ZOOM_SPEED,
  CAMERA_OFFSET_Y,
} from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.wWidth = this.width * WORLD_SIZE.x
    this.wHeight = this.height * WORLD_SIZE.y
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')
    this.noClipGroup = this.matter.world.nextGroup(true)
    this.clipGroup = this.matter.world.nextGroup()
    this.registry.values.score = 0
    this.registry.values.lives = INITIAL_LIVES

    this.setupBg()
    this.platforms = new Platforms(this)
    this.player = new Player(this, this.noClipGroup)

    this.setupWorld()
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.player.update()
    this.platforms.update()
    // this.bg.setTilePosition(
    //   this.cameras.main.scrollX / BG_SCROLL_FACTOR.x,
    //   this.cameras.main.scrollY / BG_SCROLL_FACTOR.y,
    // )
  }

  setupWorld() {
    this.followPlayer()
    this.panning = false

    this.input.on('pointerdown', this.startScrolling.bind(this))
    this.input.on('pointermove', this.onScroll.bind(this))
    this.input.on('pointerup', this.stopScrolling.bind(this))

    const totalHeight = this.wHeight + this.height
    const boundsOpts = [0, -this.wHeight, this.wWidth, totalHeight]
    const wallsOpts = [true, true, false, true]
    this.matter.world.setBounds(...boundsOpts, 500, ...wallsOpts)
    this.cameras.main.setBounds(...boundsOpts)
  }

  startScrolling(pointer) {
    if (!this.player.wasClickedOn()) {
      this.cameras.main.stopFollow()
      this.player.sprite.body.ignorePointer = true
      this.scrollStartX = pointer.x
      this.scrollStartY = pointer.y
      this.zoomTo(2, () => {
        this.panning = true
      })
    }
  }

  onScroll(pointer) {
    const { x, y, width } = this.player.sprite
    if (this.panning) {
      let spriteY = y
      if (spriteY > CAMERA_OFFSET_Y) {
        spriteY = CAMERA_OFFSET_Y
      }
      const diffX = x + (this.scrollStartX - pointer.x) * SCROLL_SPEED
      const diffY = spriteY + (this.scrollStartY - pointer.y) * SCROLL_SPEED
      this.panTo(diffX, diffY - width, () => {}, 0, 'Linear')
    }
  }

  stopScrolling() {
    if (!this.panning) return
    const { x, y, width, body } = this.player.sprite
    this.panning = false
    body.ignorePointer = false
    this.panTo(x, y - width, () => {
      this.followPlayer()
      this.zoomTo(0, () => {
        this.panning = false
      })
    })
  }

  setupBg() {
    // this.bg = this.add
    //   .tileSprite(
    //     this.width / 2,
    //     this.height / 2,
    //     this.width,
    //     this.height,
    //     'bg',
    //   )
    //   .setScale(BG_SCALE)
    //   // .setTint(0x444444)
    //   .setScrollFactor(0)
    //   .setDepth(1)
  }

  followPlayer() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.2, 0.2, 0, 300)
    this.cameras.main.setDeadzone(this.width - 200, 100)
    this.zoomTo(0, () => {}, 0)
  }

  panTo(x, y, callback, duration = ZOOM_SPEED, ease = 'Quad.easeInOut') {
    this.cameras.main.pan(x, y, duration, ease, true, (c, p) => {
      p === 1 && callback && callback()
    })
  }

  zoomTo(level, callback = () => {}, duration = ZOOM_SPEED) {
    this.cameras.main.zoomTo(
      ZOOM_LEVELS[level],
      duration,
      'Quad.easeInOut',
      true,
      (c, p) => {
        p === 1 && callback()
      },
    )
  }
}
