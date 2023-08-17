import BadgeStatus from './badge.vue'

export const BadgeColors = {
  'default': '102, 102, 102',
  'processing': '9, 46, 231',
  'error': '229, 0, 18',
  'success': '36, 178, 118',
  'warning': '255, 144, 0',
  //告警颜色
  'level1': '229, 0,  18',
  'level2': '255, 148,  87',
  'level3': '250, 189,  71',
  'level4': '153, 153, 153',
  'level5': '196, 196,  196'
}

export const BadgeProps = () => ({
  status: {
    type: [Number, String],
    default: undefined
  },
  statusText: {
    type: String,
    default: '正常',
  },
  statusNames: {
    type: Object,
    default:()=>({'default':'default'})
  },
  statusColor: {
    type: Object,
    default: () => (BadgeColors)
  }
})



export default BadgeStatus
