import { SMOKE, POINTER_LINE, EXPLODE } from '../behaviors'

export default class Player {
  constructor(scene, group) {
    this.scene = scene
    this.setActive = this.setActive.bind(this)
    this.release = this.release.bind(this)
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

    this.spotlight = this.scene.lights.addLight(0, 0, 90000, 0xffffff, 2)

    this.spring = this.scene.matter.add.mouseSpring({
      stiffness: 0.005,
      damping: 0.1,
      length: 300,
    })

    this.setActive(false)
  }

  setActive(active) {
    if (active && !this.sprite.canBeClicked) {
      this.scene.cameras.main.zoomTo(0.5, 300)
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
    if (active) {
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
    this.setLineActive(false)
    this.setActive(false)
    this.spring.stopDrag()

    const diffY = this.startY - this.sprite.y
    if (this.sprite.body.speed > 20 || diffY > 1500) {
      this.scene.registry.values.lives -= 1
      this.scene.cameras.main.zoomTo(0.3, 300)
    }
  }

  getLife(lifeBody) {
    if (!lifeBody.gameObject.active) return
    this.sprite.lifeBurst(160)
    lifeBody.gameObject.setActive(false)
    lifeBody.gameObject.setVisible(false)
    this.scene.registry.values.lives += 1
  }

  getCoin(coinBody) {
    if (!coinBody.gameObject.active) return
    this.sprite.coinBurst(80)
    coinBody.gameObject.setActive(false)
    coinBody.gameObject.setVisible(false)
    this.scene.registry.values.score += 50
  }

  update() {
    if (this.sprite.y < -this.scene.wHeight) {
      this.scene.scene.start('Game')
    }
    this.spotlight.x = this.sprite.x
    this.spotlight.y = this.sprite.y

    if (this.sprite.drawLine) {
      this.scene.cameras.main.scrollY = this.cameraY
      // this.scene.cameras.main.scrollX = this.cameraX
    }
  }
}
