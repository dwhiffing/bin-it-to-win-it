import { SMOKE, EXPLODE } from '../behaviors'

export default class Player {
  constructor(scene, group) {
    this.scene = scene
    this.setActive = this.setActive.bind(this)
    this.sprite = scene.matter.add
      .image(400, 400, 'ball', null, {
        shape: 'circle',
        mass: 0.8,
      })
      .setScale(0.5)
      .setFriction(0.5)
      .setBounce(0.4)
      .setInteractive()
      .setCollisionGroup(group)
    this.scene.behavior.enable(this.sprite)
    this.sprite.behaviors.set('smoke', SMOKE, {})
    this.sprite.behaviors.set('explode', EXPLODE, {})
    this.cameraY = this.scene.cameras.main.scrollY
    this.sprite.setDepth(2)

    this.graphics = this.scene.add.graphics()
    this.line = new Phaser.Geom.Line(
      this.sprite.x,
      this.sprite.y,
      this.sprite.x,
      this.sprite.y,
    )
    let that = this
    this.sprite.alpha = 0.01
    this.particleEmitter = this.scene.add.particles('flares')
    this.particleEmitter.createEmitter({
      frame: ['yellow'],
      x: 0,
      y: 0,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
      quantity: 29,
      lifespan: 10,
      emitZone: { source: this.line },
      blendMode: 'SCREEN',
    })
    this.particleEmitter.createEmitter({
      frame: ['yellow'],
      x: 0,
      y: 0,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.3, end: 0, ease: 'Quartic.easeOut' },
      speed: { min: -50, max: 50 },
      quantity: 9,
      lifespan: 500,
      emitZone: { source: this.line },
      blendMode: 'ADD',
    })
    this.particleEmitter.setDepth(1)
    that.particleEmitter.emitters.list.forEach((e) => e.stop())
    this.sprite.on('pointerdown', () => {
      this.cameraY = this.scene.cameras.main.scrollY
      that.particleEmitter.emitters.list.forEach((e) => e.start())
      this.sprite.smoke.start()
      this.drawLine = true
    })

    this.scene.input.on('pointerup', () => {
      that.particleEmitter.emitters.list.forEach((e) => e.stop())
      this.drawLine = false
    })

    this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      if (bodyA.label === 'platform' || bodyB.label === 'platform') {
        if (!this.active) {
          this.sprite.burst()
        }
        this.setActive(true)
      }
    })

    this.spotlight = this.scene.lights
      .addLight(this.sprite.x, this.sprite.y, 400)
      .setIntensity(1)
      .setRadius(8000)

    this.setActive(false)
  }

  setActive(active) {
    if (active) {
      this.active = true
      this.sprite.body.ignorePointer = false
      this.sprite.smoke.stop()
      this.sprite.setTint(0x44aa44)
    } else {
      this.active = false
      this.sprite.setTint(0xaaaaaa)
      this.sprite.body.ignorePointer = true
    }
  }

  update() {
    this.graphics.clear()
    const pointerCoords = this.scene.input.activePointer.positionToCamera(
      this.scene.cameras.main,
    )
    this.line.setTo(
      this.sprite.x,
      this.sprite.y,
      pointerCoords.x,
      pointerCoords.y,
    )
    this.spotlight.x = this.sprite.x - 20
    this.spotlight.y = this.sprite.y

    if (this.drawLine) {
      this.scene.cameras.main.scrollY = this.cameraY
    }
  }
}
