<template>
  <span>{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';


const props = defineProps({
  config: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  },
  value: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  }
})

/**
 * int, long, text, double, float, string格式化
 */

const formatValue = computed(() => {
  return props.value?.text || '--'
})
</script>