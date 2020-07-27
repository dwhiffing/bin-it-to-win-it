let bodyEmitter, sparkEmitter

export const SMOKE = {
  options: {},

  $create: function (entity, options) {
    const particles = entity.scene.add.particles('flares').setDepth(1)

    bodyEmitter = particles
      .createEmitter(BODY_OPTIONS)
      .setBlendMode(Phaser.BlendModes.ADD)
      .startFollow(entity)
      .start()

    sparkEmitter = particles
      .createEmitter(SPARK_OPTIONS)
      .setBlendMode(Phaser.BlendModes.ADD)
      .startFollow(entity)
      .start()
  },

  update: function (entity) {
    if (!entity || !entity.body) return

    const dist = entity.body.speed

    bodyEmitter
      .setFrame(entity.canBeClicked ? 'blue' : 'red')
      .setScale({
        start: Phaser.Math.Clamp(100 / dist, 0.4, 2.5),
        end: 0.3,
      })
      .setLifespan(50 + dist * 2)
      .setQuantity(Math.ceil(dist / 30))

    sparkEmitter
      .setQuantity(Math.ceil(dist / 10))
      .setSpeed({ min: dist * 4, max: dist * 7 })
      .setScale({
        start: Phaser.Math.Clamp(0.2 + dist / 100, 0.5, 0.9),
        end: 0,
      })
  },
}
const SPARK_OPTIONS = {
  lifespan: 800,
  angle: { start: 0, end: 360, steps: 32 },
  speed: { min: 150, max: 240 },
  quantity: 8,
  scale: { start: 0.8, end: 0 },
  frequency: 36,
  alpha: { start: 0.8, end: 0 },
  frame: 'red',
  blendMode: 'ADD',
}
const BODY_OPTIONS = {
  lifespan: 150,
  speed: { min: 0, max: 0 },
  quantity: 1,
  scale: { start: 2, end: 0.3 },
  frequency: 24,
  alpha: { start: 1, end: 1 },
  blendMode: 'ADD',
}
