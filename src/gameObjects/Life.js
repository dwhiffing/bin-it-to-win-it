export class Life extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'flares', 'green')
    this.setDepth(2)
    this.setSensor(true)
    this.setScale(6)
    this.setStatic(true)
    this.body.ignorePointer = true
    this.body.label = 'life'
  }
}
