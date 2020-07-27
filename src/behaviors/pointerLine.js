let lineEmitter
export const POINTER_LINE = {
  options: {},

  $create: function (entity, options) {
    entity.line = new Phaser.Geom.Line(entity.x, entity.y, entity.x, entity.y)
    entity.particleEmitter = entity.scene.add.particles('flares').setDepth(1)
    lineEmitter = entity.particleEmitter
      .createEmitter({
        ...LINE_OPTIONS,
        emitZone: { source: entity.line },
      })
      .setTint(0x00ff00)
    // entity.particleEmitter.createEmitter(GHOST_OPTIONS)
    entity.particleEmitter.emitters.list.forEach((e) => e.stop())
  },

  update: function (entity, options) {
    if (!entity || !entity.scene) return

    const coords = entity.scene.input.activePointer.positionToCamera(
      entity.scene.cameras.main,
    )
    const dist = Phaser.Math.Clamp(
      Phaser.Math.Distance.Between(entity.x, entity.y, coords.x, coords.y),
      200,
      2000,
    )
    if (entity.drawLine && dist >= 2000) {
      entity.release && entity.release()
    }

    lineEmitter.setScale({ start: 400 / dist, end: 800 / dist })
    let hue = ((dist / 100) * 220) / 7000
    let color = Phaser.Display.Color.HSVToRGB(0.4 - hue, 1, 0.5)
    lineEmitter.setTint(
      Phaser.Display.Color.GetColor(color.r, color.g, color.b),
    )
    entity.line.setTo(entity.x, entity.y, coords.x, coords.y)
  },
}

const LINE_OPTIONS = {
  frame: ['yellow'],
  x: 0,
  y: 0,
  scale: { start: 0.5, end: 0 },
  alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
  quantity: 30,
  lifespan: 10,
  blendMode: 'SCREEN',
}
const GHOST_OPTIONS = {
  frame: ['blue'],
  x: 0,
  y: 0,
  scale: { start: 0.8, end: 0 },
  alpha: { start: 0.15, end: 0, ease: 'Quartic.easeOut' },
  speed: { min: -100, max: 100 },
  quantity: 4,
  lifespan: 1000,
  blendMode: 'ADD',
}
