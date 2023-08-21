<template>
  <div>
    <j-form-item
      label="新增状态是否展示"
      name="visible"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group
        v-model:value="_data.visible"
        button-style="solid"
        @change="onChange"
      >
        <j-radio-button :value="true">展示</j-radio-button>
        <j-radio-button :value="false">隐藏</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      label="编辑状态是否支持修改"
      v-if="!['text'].includes(type)"
      :name="['componentProps', 'required']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group
        v-model:value="_data.componentProps.required"
        button-style="solid"
        @change="onChange"
      >
        <j-radio-button :value="true">支持</j-radio-button>
        <j-radio-button :value="false">不支持</j-radio-button>
      </j-radio-group>
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