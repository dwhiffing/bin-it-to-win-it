import { SMOKE, POINTER_LINE, EXPLODE } from '../behaviors'

export default class Player {
  constructor(scene, group) {
    this.scene = scene
    this.setActive = this.setActive.bind(this)
    this.release = this.release.bind(this)
    this.sprite = scene.matter.add
      .image(this.scene.width / 2, 400, 'ball', null, {
        shape: 'circle',
        mass: 5,
      })
      .setScale(0.5)
      .setFriction(0.5)
      .setBounce(0.4)
      .setInteractive()
      .setCollisionGroup(group)
    this.sprite.release = this.release.bind(this)
    this.scene.behavior.enable(this.sprite)
    this.sprite.behaviors.set('smoke', SMOKE, {})
    this.sprite.behaviors.set('explode', EXPLODE, {})
    this.sprite.behaviors.set('pointerLine', POINTER_LINE, {})
    this.cameraY = this.scene.cameras.main.scrollY
    this.sprite.setDepth(2)
    this.sprite.alpha = 0.01

    this.sprite.on('pointerdown', () => {
      this.setLineActive(true)
    })

    this.scene.input.on('pointerup', () => {
      this.sprite.drawLine && this.release()
    })

    this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      if (bodyA.label === 'coin') {
        return this.getCoin(bodyA)
      }
      if (bodyB.label === 'coin') {
        return this.getCoin(bodyB)
      }
      if (bodyA.label === 'platform' || bodyB.label === 'platform') {
        if (this.sprite.body.velocity.y > 10) {
          if (this.sprite.body.velocity.y > 12) {
            this.scene.cameras.main.shake(
              this.sprite.body.velocity.y * 7,
              this.sprite.body.velocity.y / 800,
            )
          }
          this.sprite.burst(Math.ceil(this.sprite.body.velocity.y) * 4)
        }
        this.setActive(true)
      }
    })

    this.spotlight = this.scene.lights.addLight(0, 0, 1200, 0xffffff, 2)

    this.spring = this.scene.matter.add.mouseSpring({
      stiffness: 0.005,
      damping: 0.1,
      length: 300,
    })

    this.setActive(false)
  }

  setActive(active) {
    if (active) {
      this.sprite.active = true
      this.sprite.body.ignorePointer = false
      this.sprite.setTint(0x44aa44)
    } else {
      this.sprite.active = false
      this.sprite.setTint(0xaaaaaa)
      this.sprite.body.ignorePointer = true
    }
  }

  setLineActive(active) {
    if (active) {
      this.cameraY = this.scene.cameras.main.scrollY
      this.sprite.particleEmitter.emitters.list.forEach((e) => e.start())
      this.sprite.drawLine = true
    } else {
      this.sprite.particleEmitter.emitters.list.forEach((e) => e.stop())
      this.sprite.drawLine = false
    }
  }

  release() {
    this.setLineActive(false)
    this.setActive(false)
    this.spring.stopDrag()
  }

  getCoin(coinBody) {
    if (!coinBody.gameObject.active) return
    this.sprite.coinBurst(80)
    coinBody.gameObject.setActive(false)
    coinBody.gameObject.setVisible(false)
    this.scene.updateScore(50)
  }

  update() {
    this.spotlight.x = this.sprite.x
    this.spotlight.y = this.sprite.y

    if (this.sprite.drawLine) {
      this.scene.cameras.main.scrollY = this.cameraY
    }
  }
}
