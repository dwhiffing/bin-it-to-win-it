export const STARTING_LEVEL = 0
export const LEVELS = [
  {
    pile: [0x0000ff, 0xff0000],
    bins: [0x0000ff, 0xff0000],
    blocks: [[1, 0, 'two']],
  },
  {
    pile: [0x0000ff, 0x0000ff, 0xff0000, 0xff0000],
    bins: [0x0000ff, 0xff0000],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold2'],
      [2, 1, 'straight'],
    ],
  },
  {
    pile: [0x0000ff, 0x0000ff, 0xff0000],
    bins: [0x0000ff, 0xff0000],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'straight'],
      [2, 1, 'flip2'],
    ],
  },
  {
    pile: [0x0000ff, 0x00ff00, 0xff0000],
    bins: [0x0000ff, 0xff0000, 0x00ff00],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold'],
      [2, 1, 'right'],
    ],
  },
  {
    pile: [0x0000ff, 0x00ff00, 0xff0000, 0xffff00],
    bins: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold'],
      [2, 1, 'hold'],
    ],
  },
  {
    pile: [0x0000ff, 0xff0000, 0xffff00, 0xff0000, 0xffff00, 0x00ff00],
    bins: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
    blocks: [
      [1, 0, 'two'],
      [1, 1, 'hold'],
      [2, 1, 'flip'],
      [0, 2, 'left'],
      [1, 2, 'flip2'],
      [2, 2, 'right'],
    ],
  },
  // //TODO
  // {
  //   pile: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
  //   bins: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
  //   blocks: [
  //     [1, 0, 'straight'],
  //     [1, 1, 'straight'],
  //     [2, 1, 'straight', 1],
  //     [0, 2, 'straight', 1],
  //     [1, 2, 'straight', 1],
  //     [2, 2, 'straight', 1],
  //   ],
  // },
  // //TODO
  // {
  //   pile: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
  //   bins: [0x0000ff, 0xff0000, 0x00ff00, 0xffff00],
  //   blocks: [
  //     [1, 0, 'straight'],
  //     [1, 1, 'straight'],
  //     [2, 1, 'straight'],
  //     [0, 2, 'straight'],
  //     [1, 2, 'straight'],
  //     [2, 2, 'straight'],
  //   ],
  // },
  // //TODO
  // {
  //   pile: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
  //   bins: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
  //   blocks: [
  //     [1, 0, 'straight'],
  //     [1, 1, 'straight'],
  //     [2, 1, 'straight'],
  //     [0, 2, 'straight'],
  //     [1, 2, 'straight'],
  //     [2, 2, 'straight'],
  //     [0, 3, 'straight'],
  //     [1, 3, 'straight'],
  //     [2, 3, 'straight'],
  //     [3, 3, 'straight'],
  //   ],
  // },
  // //TODO
  // {
  //   pile: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
  //   bins: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00, 0xff00ff],
  //   blocks: [
  //     [1, 0, 'straight'],
  //     [1, 1, 'straight'],
  //     [2, 1, 'straight'],
  //     [0, 2, 'straight'],
  //     [1, 2, 'straight'],
  //     [2, 2, 'straight'],
  //     [0, 3, 'straight'],
  //     [1, 3, 'straight'],
  //     [2, 3, 'straight'],
  //     [3, 3, 'straight'],
  //   ],
  // },
]
