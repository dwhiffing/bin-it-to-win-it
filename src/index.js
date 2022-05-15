import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  parent: 'phaser',
  type: Phaser.AUTO,
  width: 2160,
  height: 3500,
  backgroundColor: '#111',
  scene: Object.values(scenes),
  physics: {
    default: 'matter',
    matter: { debug: true, gravity: { y: 2 } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

window.game = new Phaser.Game(config)
