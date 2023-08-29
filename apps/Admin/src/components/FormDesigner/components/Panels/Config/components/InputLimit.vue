<template>
  <div>
    <p>请对输入内容做出限制</p>
    <j-form-item
      label="字符数量"
      :name="['componentProps', 'maxLength']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-input-number
        style="width: 100%"
        v-model:value="_data.componentProps.maxLength"
      />
    </j-form-item>
    <j-form-item
      label="内容类型(暂未开发)"
    >
      <j-input />
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