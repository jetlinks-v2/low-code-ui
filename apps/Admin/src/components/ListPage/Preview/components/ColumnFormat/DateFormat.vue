<template>
  <span>{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import dayjs from 'dayjs'
import { isEmpty } from '../../../utils';


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
  if(isEmpty(String(value))) {
    return '--'
  }
  if(typeof value == 'string') {
    return dayjs(value, props.config?.dateValue).format(props.config?.dateValue || 'YYYY-MM-DD')
  } else {
    return dayjs(value).format(props.config?.dateValue || 'YYYY-MM-DD')
  }
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>