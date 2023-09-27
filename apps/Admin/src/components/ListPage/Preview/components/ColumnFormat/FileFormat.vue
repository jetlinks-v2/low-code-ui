<template>
  <span v-if="config?.fileValue === 'url'">{{ formatValue }}</span>
  <j-image :src="formatValue.split(',')?.[0]" v-else-if="config?.fileValue === 'icon'"></j-image>
  <span v-if="config?.fileValue === 'fileName'">{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';


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
  try {
    let result = value
    value = typeof value == 'string' ? JSON.parse(value) : value
    switch(true) {
      case ['url', 'icon'].includes(props.config?.fileValue):
        result = value.map((item) => {
          return item.url
        }).join(',')
      break
      case props.config?.fileValue === 'fileName':
        result = value.map((item) => {
          return item.name
        }).join(',')
      break
    }
    return result
  } catch (error) {
    return '--'
  }
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>