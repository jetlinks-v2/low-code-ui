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
  let result = value;
  if(Array.isArray(value)) {
    value = value.map(item => {
      if(typeof item === 'object') {
        return JSON.stringify(item)
      } else {
        return item
      }
    })
    switch(true) {
      case props.config?.fileValue === 'xxx ; xxx':
        result = value.join(';')
        break
      case props.config?.fileValue === 'xxx/xxx':
        result = value.join('/')
        break
      case props.config?.fileValue === 'xxx、xxx':
        result = value.join('、')
        break
    }
  }
  return result
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>