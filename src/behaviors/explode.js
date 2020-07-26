export const EXPLODE = {
  options: {},

  $create: function (entity, options) {
    var particles = entity.scene.add.particles('flares')
    particles.setDepth(1)
    const smallChunkEmitter = particles
      .createEmitter(SMALL_CHUNK_CONFIG)
      .setBlendMode(Phaser.BlendModes.ADD)
      .startFollow(entity)
      .stop()
    const bigChunkEmitter = particles
      .createEmitter(BIG_CHUNK_CONFIG)
      .setBlendMode(Phaser.BlendModes.ADD)
      .startFollow(entity)
      .stop()
    const coinBurstEmitter = particles
      .createEmitter(COIN_BURST_CONFIG)
      .setBlendMode(Phaser.BlendModes.ADD)
      .startFollow(entity)
      .stop()

    entity.burst = (quantity) => {
      if (quantity > 100)
        bigChunkEmitter.explode(quantity / 8, entity.x, entity.y)
      smallChunkEmitter.explode(quantity, entity.x, entity.y)
    }
    entity.coinBurst = (quantity) => {
      coinBurstEmitter.explode(quantity, entity.x, entity.y)
    }
  },
}

const COIN_BURST_CONFIG = {
  frame: 'yellow',
  speed: { min: -1000, max: 1000 },
  angle: { min: 0, max: 360 },
  scale: { start: 1, end: 0.4 },
  alpha: { start: 1, end: 0 },
  lifespan: 900,
  gravityY: 800,
  blendMode: 'ADD',
}
const BIG_CHUNK_CONFIG = {
  frame: 'red',
  speed: { min: -1500, max: 1500 },
  angle: { min: 0, max: 360 },
  scale: { start: 1.5, end: 1 },
  alpha: { start: 1, end: 0 },
  lifespan: 1400,
  gravityY: 800,
  blendMode: 'ADD',
}
const SMALL_CHUNK_CONFIG = {
  frame: 'blue',
  speed: { min: -1000, max: 1000 },
  angle: { min: 0, max: 360 },
  scale: { start: 0.7, end: 0 },
  lifespan: 700,
  gravityY: 800,
  blendMode: 'ADD',
}
