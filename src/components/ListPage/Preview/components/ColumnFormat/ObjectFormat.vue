<template>
  <span v-if="config?.demonstrations === 'json'">{{ value || '--' }}</span>
  <span v-else-if="config?.demonstrations === 'page'">
    <AIcon type="SearchOutlined" @click="visible = true" v-if="!isEmpty(value)"/>
    <span v-else>--</span>
  </span>
  <JsonPreview
    v-model:open="visible"
    :json="value"
    @close="visible = false"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import JsonPreview from '../JsonPreview.vue';
import { isEmpty } from '@/components/ListPage/utils';

const props = defineProps({
  config: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  value: {
    type: Object,
    default: () => {},
  },
})

const visible = ref(false)
/**
 * object格式化
 */
const formatFn = (value) => {
  return value
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>
