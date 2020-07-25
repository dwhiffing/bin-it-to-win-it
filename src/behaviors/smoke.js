export const SMOKE = {
  options: {
    lifespan: 1000,
    angle: { start: 0, end: 360, steps: 32 },
    speed: { min: 150, max: 240 },
    quantity: 8,
    scale: { start: 0.6, end: 0 },
    frequency: 36,
    alpha: { start: 0.8, end: 0 },
    frame: 'red',
    blendMode: 'ADD',
    // lifespan: 800,
    // angle: { start: 360, end: 0, steps: 32 },
    // speed: 200,
    // quantity: 1,
    // scale: { start: 0.8, end: 0 },
    // frequency: 40,
  },

  $create: function (entity, options) {
    var particles = entity.scene.add.particles('flares')
    entity.smoke2 = particles.createEmitter({
      lifespan: 200,
      speed: { min: 0, max: 0 },
      quantity: 1,
      scale: { start: 2, end: 1 },
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
}
