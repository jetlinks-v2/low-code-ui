<template>
  <span>{{ formatValue }}</span>
  <span>{{ value }}</span>
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
 const normalFormat = (str: string, value: any) => {
  value = String(value)
  if(isEmpty(value) && typeof value !== 'number') {
    return '--'
  }
  if(!str) {
    return value
  }
  const last = str?.lastIndexOf('x')
  const first = str?.indexOf('x')
  let result = ''
  switch (true) {
    case last === 0:
      result = value + str.substring(str?.lastIndexOf('x') + 1, str?.length)
      break
    case last === -1:
      result = value
      break
    case last === str.length - 1 && first !== 0:
      result = str.substring(0, str?.lastIndexOf('x')) + value
      break
    case last === str.length - 1 && first === 0:
      let prefixLength = 0
      let prefix = ''
      for (let i = 0; i < str.length; i++) {
        if (str[i] !== 'x') {
          prefixLength++
          prefix += str[i]
        }
      }
      result =
        value.substring(0, prefixLength + 1) +
        prefix +
        value?.substring(prefixLength + 1)
      break
    default:
      result = value
      break
  }
  return result;
}

const formatValue = computed(() => {
  return normalFormat(props.config?.inputValue, props.value)
})
</script>