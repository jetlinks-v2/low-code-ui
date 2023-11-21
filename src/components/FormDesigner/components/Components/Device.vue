<template>
  <Iot
    :keys="keys"
    :value="_value"
    :disabled="disabled"
    @updateValue="updateValue"
  ></Iot>
</template>
  
<script lang="ts" setup>
import Iot from './iotComponents/index.vue'
import { provide, watch, ref } from 'vue'

const props = defineProps({
  value: {
    type: Array || String,
    default: () => [],
  },
  mode: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  keys: {
    type: Array,
    default: () => [],
  },
})
const _value:any = ref()
const emit = defineEmits(['update:value','change'])

const getObj: any = (value: any) => {
  const obj = {}
  props.keys.map((item: any) => {
    if (item?.key) {
      obj[item.key] = value[item.key]
    }
  })
  return obj
}

const updateValue = (value: any) => {
  if (props.mode === 'multiple') {
    const _arr = (value || []).map((item) => {
      return getObj(item)
    }).filter(i => i?.id)
    emit('update:value', _arr)
  } else {
    emit('update:value', getObj(value)?.id ? getObj(value) : undefined)
  }
  emit('change')
}

provide('type', 'device')
provide('mode', props.mode)

watch(
  () => props.value,
  () => {
    _value.value = props.value
  },
  { deep: true, immediate: true },
)
</script>
<style lang="less" scoped>
</style>