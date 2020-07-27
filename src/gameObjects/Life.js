import { SCORE_TEXT } from '../behaviors'

export class Life extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'flares', 'green')
    this.setDepth(2)
    this.setSensor(true)
    this.setScale(4)
    this.setStatic(true)
    this.setBlendMode('SCREEN')
    this.body.ignorePointer = true
    this.body.label = 'life'
    this.scene = scene
    this.scene.behavior.enable(this)
    this.score = 500
    this.behaviors.set('scoreText', SCORE_TEXT)
  }
}
