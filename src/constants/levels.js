export const LEVELS = [
  {
    pile: [
      0x0000ff, 0xff0000, 0x0000ff, 0xff0000, 0x0000ff, 0xff0000, 0x0000ff,
      0xff0000, 0x0000ff, 0xff0000,
    ],
    bins: [0x0000ff, 0xff0000],
    blocks: [[1, 0, 'two']],
  },
  {
    pile: [
      0x0000ff, 0xff0000, 0x0000ff, 0xff0000, 0x0000ff, 0xff0000, 0x0000ff,
      0xff0000, 0x0000ff, 0xff0000,
    ],
    bins: [0x0000ff, 0xff0000],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold'],
      [2, 1, 'flip'],
      [0, 2, 'left'],
      [1, 2, 'flip2'],
      [2, 2, 'hold2'],
    ],
  },
  {
    pile: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
    bins: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold'],
      [2, 1, 'flip'],
      [0, 2, 'left'],
      [1, 2, 'flip2'],
      [2, 2, 'hold2'],
      [0, 3, 'straight'],
      [1, 3, 'left'],
      [2, 3, 'right'],
      [3, 3, 'right'],
    ],
  },
]
