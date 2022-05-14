import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1750,
  backgroundColor: '#000',
  parent: 'phaser',
  physics: {
    default: 'matter',
    matter: { debug: false, gravity: { y: 3 } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Object.values(scenes),
}

window.game = new Phaser.Game(config)
