<template>
  <div>
    <p>请配置可选项的数据来源</p>
    <j-radio-group button-style="solid" style="margin-bottom: 24px">
      <j-radio-button :value="true">数据字典</j-radio-button>
      <j-radio-button :value="false">后端接口</j-radio-button>
    </j-radio-group>
    <j-form-item>
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