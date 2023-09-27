<template>
  <span>{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
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
  if(isEmpty(value)) {
    return '--'
  }
  let result = value
  if (value) {
    result = props.config?.trueValue || '是'
  } else {
    result = props.config?.falseValue || '否'
  }
  return result
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>