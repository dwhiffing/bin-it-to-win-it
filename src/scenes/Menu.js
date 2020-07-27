import { INITIAL_LIVES } from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.registry.set('areanum', 1)
    this.registry.set('score', 0)
    this.registry.set('lives', INITIAL_LIVES)

    this.add.image(this.width / 2, this.height - 100, 'platform').setScale(3)
    let line = new Phaser.Geom.Line(
      1400,
      this.height - 100,
      -1400,
      this.height - 100,
    )
    const particles = this.add.particles('cloud')
    particles
      .createEmitter({
        lifespan: { min: 6000, max: 9000 },
        speed: { min: -10, max: 10 },
        angle: { min: 0, max: 360 },
        rotate: { min: -100, max: 100 },
        delay: { min: 0, max: 100 },
        alpha: { start: 1, end: 0 },
        scale: { start: 0.2, end: 2 },
        x: { min: -150, max: 150 },
        y: { min: 0, max: 0 },
        quantity: 10,
        frequency: 2000,
        blendMode: 'SCREEN',
        emitZone: {
          source: line,
          type: 'random',
          quantity: 1,
        },
      })
      .setBlendMode(Phaser.BlendModes.SCREEN)
      .start()
    this.music = this.sound.add('menuMusic', { loop: true, volume: 0.35 })
    this.music.play()
    this.coinSound = this.sound.add('coin')
    this.add
      .text(this.width / 2 - 10, 500, 'Light\nPendulum', {
        fontFamily: 'AnotherHand',
        fontSize: 220,
      })
      .setAlign('center')
      .setOrigin(0.5)
      .setAlpha(0.8)
      .setStroke(0x000000, 10)

    this.mute = this.add.image(this.width - 130, this.height - 160, 'icon')
    this.mute.setOrigin(0)
    this.mute.setFrame(window.isMuted ? 2 : 1)
    this.mute.setInteractive().on('pointerdown', () => {
      window.isMuted = !window.isMuted
      this.sound.mute = window.isMuted
      localStorage.setItem('mute', window.isMuted ? 1 : 0)
      this.mute.setFrame(window.isMuted ? 2 : 1)
    })
    this.add
      .image(this.width / 2, this.height - 600, 'playButton')
      .setInteractive()
      .on('pointerdown', () => {
        this.coinSound.play()
        this.music.stop()
        this.scene.launch('Hud')
        this.scene.start('Game')
      })
    this.add
      .image(this.width / 2, this.height - 470, 'helpButton')
      .setInteractive()
      .on('pointerdown', () => {
        this.coinSound.play()
        this.scene.launch('Credits')
      })
  }
}
