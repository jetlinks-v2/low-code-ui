<template>
  <div>
    <p>配置后会在该配置项名称后方展示</p>
    <j-form-item :name="['componentProps', 'descriptions']" label="说明内容">
      <j-textarea @change="onChange" :rows="3" :maxlength="100" placeholder="请输入100字以内文字" v-model:value="_data.componentProps.descriptions" />
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