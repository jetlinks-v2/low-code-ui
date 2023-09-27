<template>
  <span>{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import dayjs from 'dayjs'


const props = defineProps({
  config: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  },
  value: {
    type: String,
    default: ''
  }
})

/**
 * int, long, text, double, float, string格式化
 */
 const formatFn = (value) => {
  return dayjs(value).format(props.config?.inputValue || 'YYYY-MM-DD')
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>