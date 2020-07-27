import { SMOKE, POINTER_LINE, EXPLODE } from '../behaviors'
import { ZOOM_LEVELS, ZOOM_SPEED } from '../constants'

export default class Player {
  constructor(scene, group) {
    this.scene = scene

    this.sprite = scene.matter.add
      .image(this.scene.wWidth / 2, 1200, 'ball', null, {
        shape: 'circle',
        mass: 5,
      })
      .setScale(0.5)
      .setFriction(0.5)
      .setBounce(0.4)
      .setInteractive()
      .setCollisionGroup(group)
      .setDepth(2)
      .setAlpha(0.01)
      .on('pointerdown', () => {
        this.setLineActive(true)
      })
    this.setActive = this.setActive.bind(this)
    this.release = this.release.bind(this)
    this.sprite.release = this.release.bind(this)
    this.hits = []
    this.throwSound = this.scene.sound.add('whoosh', { volume: 0.5 })
    this.coinSound = this.scene.sound.add('coin')
    this.hits.push(this.scene.sound.add('hit0'))
    this.hits.push(this.scene.sound.add('hit1'))
    this.hits.push(this.scene.sound.add('hit2'))
    this.hits.push(this.scene.sound.add('hit3'))

    this.scene.behavior.enable(this.sprite)
    this.sprite.behaviors.set('smoke', SMOKE, {})
    this.sprite.behaviors.set('explode', EXPLODE, {})
    this.sprite.behaviors.set('pointerLine', POINTER_LINE, {})

    this.scene.matter.world.on('collisionstart', this.onCollision.bind(this))
    this.cameraY = this.scene.cameras.main.scrollY
    this.spotlight = this.scene.lights.addLight(0, 0, 90000, 0xffffff, 2)
    this.scene.input.on('pointerup', () => {
      this.sprite.drawLine && this.release()
    })

    this.spring = this.scene.matter.add.mouseSpring({
      stiffness: 0.005,
      damping: 0.1,
      length: 300,
    })

    this.setActive(false)
  }

  update() {
    if (this.sprite.y < -this.scene.wHeight) {
      if (!this.fading) {
        this.fading = true
        this.scene.cameras.main.fade(
          1000,
          this.scene.skyColor.r,
          this.scene.skyColor.g,
          this.scene.skyColor.b,
          false,
          (c, p) => {
            p === 1 && this.scene.scene.start('Game')
          },
        )
      }
    }
    this.spotlight.x = this.sprite.x
    this.spotlight.y = this.sprite.y

    if (this.sprite.body.speed < 2 && !this.sprite.canBeClicked) {
      this.setActive(true)
    }

    if (this.sprite.drawLine) {
      this.scene.cameras.main.scrollY = this.cameraY
      // this.scene.cameras.main.scrollX = this.cameraX
    }
  }

  setActive(active) {
    if (active && !this.sprite.canBeClicked) {
      this.scene.cameras.main.zoomTo(ZOOM_LEVELS[0], 300)
      this.sprite.canBeClicked = true
      this.sprite.body.ignorePointer = false
      this.sprite.setTint(0x44aa44)
      if (this.scene.registry.values.lives === 0) {
        this.scene.scene.start('Menu')
      }
    }
    if (!active && this.sprite.canBeClicked) {
      this.sprite.canBeClicked = false
      this.sprite.setTint(0xaaaaaa)
      this.sprite.body.ignorePointer = true
    }
  }

  setLineActive(active) {
    if (active && this.sprite.canBeClicked) {
      this.cameraY = this.scene.cameras.main.scrollY
      this.cameraX = this.scene.cameras.main.scrollX
      this.sprite.particleEmitter.emitters.list.forEach((e) => e.start())
      this.sprite.drawLine = true
      this.startX = this.sprite.x
      this.startY = this.sprite.y
    } else {
      this.sprite.particleEmitter.emitters.list.forEach((e) => e.stop())
      this.sprite.drawLine = false
    }
  }

  release() {
    this.throwSound.play()
    this.setLineActive(false)
    this.setActive(false)
    this.spring.stopDrag()

    const diffY = this.startY - this.sprite.y
    if (this.sprite.body.speed > 20 || diffY > 1500) {
      this.scene.registry.values.lives -= 1
      this.scene.cameras.main.zoomTo(ZOOM_LEVELS[1], ZOOM_SPEED)
    }
  }

  getLife(lifeBody) {
    if (!lifeBody.gameObject.active) return
    this.sprite.lifeBurst(160)
    this.coinSound.play()
    lifeBody.gameObject.setActive(false)
    lifeBody.gameObject.setVisible(false)
    this.scene.registry.values.lives += 1
  }

  getCoin(coinBody) {
    if (!coinBody.gameObject.active) return
    this.sprite.coinBurst(80)
    this.coinSound.play()
    coinBody.gameObject.setActive(false)
    coinBody.gameObject.setVisible(false)
    this.scene.registry.values.score += 50
  }

  onCollision(event, bodyA, bodyB) {
    if (bodyA.label === 'life') {
      return this.getLife(bodyA)
    }
    if (bodyB.label === 'life') {
      return this.getLife(bodyB)
    }
    if (bodyA.label === 'coin') {
      return this.getCoin(bodyA)
    }
    if (bodyB.label === 'coin') {
      return this.getCoin(bodyB)
    }
    if (bodyA.label === 'platform' || bodyB.label === 'platform') {
      const v = this.sprite.body.velocity.y
      let sound = 0

      if (v > 30) {
        sound = 1
        if (v > 60) {
          this.scene.cameras.main.shake(v * 5, v / 1000)
          sound = 2
        }
        if (v > 90) {
          sound = 3
        }
        this.sprite.burst(Math.ceil(v) * 2)
      }

      if (v > 2) {
        this.hits[sound].play()
      }

      this.setActive(true)
    }
  }

  wasClickedOn() {
    return (
      this.sprite.drawLine ||
      this.sprite.body.speed >= 10 ||
      !this.sprite.canBeClicked
    )
  }
}
