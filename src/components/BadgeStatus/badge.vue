<template>
  <!-- <j-badge
    :color="_color"
    :text="text"
  ></j-badge> -->
  <div style="display: flex;">
    <j-badge :color="_color"></j-badge>
    <j-ellipsis style="max-width: 70px">{{ text }}</j-ellipsis>
  </div>
</template>

<script setup name="BadgeStatus">
import { BadgeColors } from './index'
import { hexToRgb } from '@jetlinks-web/utils'

const props = defineProps({
  text: {
    type: String,
  },
  status: {
    type: [String, Number],
    default: 'default',
  },
  statusColor: {
    type: Object,
    default: () => (BadgeColors)
  },
  /**
   * 自定义status值颜色
   * @example {
   *   1: 'success',
   *   0: 'error'
   * }
   */
  statusNames: {
    type: Object,
    default: () => ({
      'success': 'success',
      'warning': 'warning',
      'error': 'error',
      'default': 'default',
    })
  },
});

const _color = computed(() => {
  const badgeColor = props.statusColor || BadgeColors
  const code = props.statusNames[props.status] || props.status
  const c = hexToRgb(badgeColor[code]) || badgeColor[code]

  // console.log(c)
  return `rgb(${c})`
})
</script>

<style scoped>

</style>
