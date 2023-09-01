<template>
  <div>
    <template v-if="listType === 'text'">
      <File v-bind="_componentProps" />
    </template>
    <template v-else>
      <Picture v-bind="_componentProps" />
    </template>
  </div>
</template>
  
  <script lang="ts" setup>
import { omit } from 'lodash-es'
import { computed } from 'vue'
import File from './File.vue'
import Picture from './Picture.vue'

const props = defineProps({
  fileSize: {
    type: Number,
    default: 2,
  },
  unit: {
    type: String,
    default: 'M',
  },
  accept: {
    type: Array,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  listType: {
    type: String,
    default: 'text',
  },
})

const _componentProps = computed(() => {
  return omit(props, 'listType')
})
</script>