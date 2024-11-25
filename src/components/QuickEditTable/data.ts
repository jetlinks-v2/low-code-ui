export const HeaderProps = () => ({
  columns: {
    type: Array,
    default: () => []
  },
  serial: {
    type: Boolean,
    default: false
  }
})

export const BodyProps = () => ({
  ...HeaderProps(),
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 0
  },
  scroll: {
    type: Object,
    default: () => ({})
  },
  slots: {
    type: Object,
    default: () => ({})
  },
  validate: {
    type: Boolean,
    default: false
  },
  cellHeight: {
    type: Number,
    default: 66
  }
})

export const SCROLL_LEFT = 'SCROLL_LEFT'
