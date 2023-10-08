<template>
  <ArrayFormat :config="config" :value="formatValue" v-if="isArray"/>
  <span v-else>{{ formatValue }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ArrayFormat from './ArrayFormat.vue';


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

const isArray = computed(() => {
  return Array.isArray(props.value)
})
/**
 * 枚举类型格式化
 */

const formatValue = computed(() => {
  if(isArray.value) {
    return props.value?.map(item => item.text)
  } else {
    return props.value?.text || '--'
  }
})
</script>