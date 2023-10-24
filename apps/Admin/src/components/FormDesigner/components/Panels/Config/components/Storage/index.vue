<template>
  <div>
    <j-button style="width: 100%" @click="visible = true">配置</j-button>
    <Modal v-if="visible" :value="value" :type="type" @cancel="visible = false" @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  value: {
    type: Array,
  },
  type: {
    type: String,
    default: 'device',
  },
})

const emits = defineEmits(['update:value', 'change'])
const visible = ref<boolean>(false)

const onChange = (val: any) => {
  emits('update:value', val)
  emits('change', val)
}
</script>

<style lang="less" scoped>
</style>