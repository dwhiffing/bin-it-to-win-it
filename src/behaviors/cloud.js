let bodyEmitter, sparkEmitter, line

export const CLOUD = {
  options: {},

  $create: function (entity, options) {
    line = new Phaser.Geom.Line(400 * entity.scaleX, 0, -400 * entity.scaleX, 0)
    const particles = entity.scene.add.particles('cloud').setDepth(1)
    bodyEmitter = particles.createEmitter({
      ...BODY_OPTIONS,
      emitZone: {
        source: line,
        type: 'random',
        quantity: 1,
      },
    })
    bodyEmitter.setBlendMode(Phaser.BlendModes.SCREEN)
    bodyEmitter.startFollow(entity)
    bodyEmitter.start()
    bodyEmitter.setScale({
      start: 0.1 * entity.scaleX,
      end: entity.scaleX * 0.8,
    })
  },

  update: function (entity) {
    // console.log(bodyEmitter)
  },
}
const BODY_OPTIONS = {
  lifespan: { min: 5000, max: 7000 },
  speed: { min: -10, max: 10 },
  angle: { min: 0, max: 360 },
  rotate: { min: -100, max: 100 },
  delay: { min: 0, max: 100 },
  alpha: { start: 1, end: 0 },
  scale: { start: 0.2, end: 2.5 },
  x: { min: -150, max: 150 },
  y: { min: 0, max: 0 },
  quantity: 2,
  frequency: 4000,
  blendMode: 'SCREEN',
}
