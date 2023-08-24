<template>
  <div>
    <!-- <j-form-item>
      <Rule v-model:value="_data.formItemProps.rules" @change="onChange" />
    </j-form-item>
    <j-form-item
      label="约束"
      :name="['formItemProps', 'required']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group
        v-model:value="_data.formItemProps.required"
        button-style="solid"
        @change="onChange"
      >
        <j-radio-button :value="true">必填</j-radio-button>
        <j-radio-button :value="false">非必填</j-radio-button>
      </j-radio-group>
    </j-form-item> -->
  </div>
</template>
    
    <script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import Rule from './Rule.vue'

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