export class Coin extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'flares', 'yellow')
    this.setDepth(2)
    this.setScale(2)
    this.setSensor(true)
    this.setStatic(true)
    this.setBlendMode('SCREEN')
    this.body.label = 'coin'
    this.body.ignorePointer = true
  }
}
