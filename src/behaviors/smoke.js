let lastX = 0,
  lastY = 0,
  zoom = 0
export const SMOKE = {
  options: {
    lifespan: 800,
    angle: { start: 0, end: 360, steps: 32 },
    speed: { min: 150, max: 240 },
    quantity: 8,
    scale: { start: 0.8, end: 0 },
    frequency: 36,
    alpha: { start: 0.8, end: 0 },
    frame: 'red',
    blendMode: 'ADD',
  },

  $create: function (entity, options) {
    var particles = entity.scene.add.particles('flares')
    entity.smoke2 = particles.createEmitter({
      lifespan: 150,
      speed: { min: 0, max: 0 },
      quantity: 1,
      scale: { start: 2, end: 0.3 },
      frequency: 24,
      alpha: { start: 1, end: 1 },
      blendMode: 'ADD',
    })
    entity.smoke = particles.createEmitter({
      ...options,
      // frame: 'yellow',
      blendMode: 'ADD',
    })
    entity.smoke2.setBlendMode(Phaser.BlendModes.ADD)
    entity.smoke.setBlendMode(Phaser.BlendModes.ADD)
    entity.smoke2.startFollow(entity)
    entity.smoke.startFollow(entity)
    entity.smoke2.start()
    entity.smoke.start()
    particles.setDepth(1)
  },

  update: function (entity) {
    if (!entity || !entity.body) return
    const dist = entity.body.speed

    entity.smoke.setQuantity(Math.ceil(dist / 10))
    entity.smoke.setSpeed({ min: dist * 4, max: dist * 7 })
    entity.smoke.setScale({
      start: Phaser.Math.Clamp(0.2 + dist / 100, 0.5, 0.9),
      end: 0,
    })

    entity.smoke2.setFrame(entity.canBeClicked ? 'white' : 'red')
    entity.smoke2.setScale({
      start: Phaser.Math.Clamp(100 / dist, 0.4, 2.5),
      end: 0.3,
    })
    entity.smoke2.setLifespan(50 + dist * 2)
    entity.smoke2.setQuantity(Math.ceil(dist / 30))

    lastX = entity.x
    lastY = entity.y
  },
}
