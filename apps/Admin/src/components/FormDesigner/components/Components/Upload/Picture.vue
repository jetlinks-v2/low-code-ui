<template>
  <a-upload-dragger
    name="file"
    v-model:file-list="fileList"
    :multiple="maxCount > 1"
    list-type="picture-card"
    :max-count="maxCount"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined />
      <div style="margin-top: 8px">Upload</div>
    </div>
  </a-upload-dragger>
</template>
    
<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 2,
  },
  unit: {
    type: String,
    default: 'M',
  },
  accept: {
    type: String,
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  listType: {
    type: String,
    default: 'picture',
  },
})

const fileList = ref([])
</script>