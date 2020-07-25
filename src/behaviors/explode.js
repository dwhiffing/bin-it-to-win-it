export const EXPLODE = {
  options: {
    speed: { min: -800, max: 800 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.5, end: 0 },
    lifespan: 600,
    gravityY: 800,
    blendMode: 'ADD',
  },

  $create: function (entity, options) {
    var particles = entity.scene.add.particles('flares')
    entity.explode = particles.createEmitter({
      ...options,
      key: null,
    })
    entity.explode.setBlendMode(Phaser.BlendModes.ADD)
    entity.explode.startFollow(entity)
    entity.explode.stop()
    entity.burst = () => entity.explode.explode(100, entity.x, entity.y)
    particles.setDepth(1)
  },
}
