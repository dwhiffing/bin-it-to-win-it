export const SCORE_TEXT = {
  options: {},

  $create: function (entity, opts) {
    entity.scoreText = entity.scene.add
      .text(0, 0, '', {
        fontFamily: 'AnotherHand',
        fontSize: 100,
      })
      .setStroke(0x000000, 10)
    entity.scoreText.setShadow(2, 2, '#333333', 2, true, true)

    entity.on('scoreText', (opts = {}) => {
      entity.scoreText.setActive(true)
      entity.scoreText.x = entity.x
      entity.scoreText.y = entity.y
      entity.scoreText.alpha = 1
      if (entity.scoreText.frame.data) {
        entity.scoreText.setText(`${opts.amount || entity.score}`)
      }
    })
  },

  update: function (entity) {
    if (entity.scoreText.active) {
      entity.scoreText.y -= 1
      entity.scoreText.alpha -= 0.01
      if (entity.scoreText.alpha <= 0) entity.scoreText.setActive(false)
    }
  },
}
