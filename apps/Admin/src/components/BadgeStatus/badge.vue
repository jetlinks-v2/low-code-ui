<template>
  <j-badge
    :color="_color"
    :text="text"
  ></j-badge>
</template>

<script setup name="BadgeStatus">
import { BadgeColors } from './index'

const props = defineProps({
  text: {
    type: String,
  },
  status: {
    type: [String, Number],
    default: 'default',
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
  const code = props.statusNames[props.status] || props.status
  return `rgb(${BadgeColors[code]})`
})
</script>

<style scoped>

</style>
