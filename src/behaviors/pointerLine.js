let emitter1, emitter2
export const POINTER_LINE = {
  options: {
    frame: 'red',
    speed: { min: -800, max: 800 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.7, end: 0 },
    lifespan: 600,
    gravityY: 800,
    blendMode: 'ADD',
  },

  $create: function (entity, options) {
    entity.line = new Phaser.Geom.Line(entity.x, entity.y, entity.x, entity.y)
    entity.particleEmitter = entity.scene.add.particles('flares')
    emitter1 = entity.particleEmitter
      .createEmitter({
        frame: ['yellow'],
        x: 0,
        y: 0,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
        quantity: 30,
        lifespan: 10,
        emitZone: { source: entity.line },
        blendMode: 'SCREEN',
      })
      .setTint(0x00ff00)
    entity.particleEmitter.createEmitter({
      frame: ['blue'],
      x: 0,
      y: 0,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.15, end: 0, ease: 'Quartic.easeOut' },
      speed: { min: -100, max: 100 },
      quantity: 4,
      lifespan: 1000,
      emitZone: { source: entity.line },
      blendMode: 'ADD',
    })
    entity.particleEmitter.setDepth(1)
    entity.particleEmitter.emitters.list.forEach((e) => e.stop())
  },

  update: function (entity, options) {
    const pointerCoords = entity.scene.input.activePointer.positionToCamera(
      entity.scene.cameras.main,
    )
    const dist = Phaser.Math.Clamp(
      Phaser.Math.Distance.Between(
        entity.x,
        entity.y,
        pointerCoords.x,
        pointerCoords.y,
      ),
      200,
      2000,
    )
    if (entity.drawLine && dist >= 2000) {
      entity.release && entity.release()
    }

    emitter1.setScale({ start: 400 / dist, end: 800 / dist })
    let hue = ((dist / 100) * 220) / 7000
    let color = Phaser.Display.Color.HSVToRGB(0.4 - hue, 1, 0.5)
    emitter1.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b))
    entity.line.setTo(entity.x, entity.y, pointerCoords.x, pointerCoords.y)
  },
}
