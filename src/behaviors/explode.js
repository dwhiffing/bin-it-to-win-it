export const EXPLODE = {
  options: {
    frame: 'blue',
    speed: { min: -1000, max: 1000 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.7, end: 0 },
    lifespan: 700,
    gravityY: 800,
    blendMode: 'ADD',
  },

  $create: function (entity, options) {
    var particles = entity.scene.add.particles('flares')
    entity.explode = particles.createEmitter({
      ...options,
    })
    const explode2 = particles.createEmitter({
      frame: 'red',
      speed: { min: -1500, max: 1500 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 1 },
      alpha: { start: 1, end: 0 },
      lifespan: 1400,
      gravityY: 800,
      blendMode: 'ADD',
    })
    entity.explode.setBlendMode(Phaser.BlendModes.ADD)
    entity.explode.startFollow(entity)
    entity.explode.stop()
    explode2.setBlendMode(Phaser.BlendModes.ADD)
    explode2.startFollow(entity)
    explode2.stop()
    entity.burst = (quantity) => {
      if (quantity > 100) explode2.explode(quantity / 8, entity.x, entity.y)
      entity.explode.explode(quantity, entity.x, entity.y)
    }
    particles.setDepth(1)
  },
}
