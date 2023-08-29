<template>
  <div>
    <j-form-item label="调用函数（暂未开发）">
      <j-select placeholder="请选择" />
    </j-form-item>
  </div>
</template>
  
  <script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:value', 'change'])

const _data = reactive({ ...props.value })

watchEffect(() => {
  Object.assign(_data, props.value)
})

const onChange = () => {
  emits('update:value', _data)
  emits('change', _data)
}
</script>