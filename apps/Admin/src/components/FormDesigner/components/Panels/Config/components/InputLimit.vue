<template>
  <div>
    <p>请对输入内容做出限制</p>
    <j-form-item label="字符数量" :name="['componentProps', 'maxLength']">
      <j-input-number
        style="width: 100%"
        v-model:value="_data.componentProps.maxLength"
        @change="onChange"
        placeholder="请输入"
      />
    </j-form-item>
    <template v-if="['input-number'].includes(type)">
      <j-form-item label="最大值" :name="['componentProps', 'max']">
        <j-input-number
          style="width: 100%"
          v-model:value="_data.componentProps.max"
          @change="onChange"
          placeholder="请输入"
        />
      </j-form-item>
      <j-form-item label="最小值" :name="['componentProps', 'min']">
        <j-input-number
          style="width: 100%"
          v-model:value="_data.componentProps.min"
          @change="onChange"
          placeholder="请输入"
        />
      </j-form-item>
      <j-form-item label="精度" :name="['componentProps', 'precision']">
        <j-input-number
          style="width: 100%"
          v-model:value="_data.componentProps.precision"
          @change="onChange"
          placeholder="请输入"
          :precision="0"
        />
      </j-form-item>
    </template>
    <j-form-item label="校验规则">
      <Rules v-model:value="_data.formItemProps.rules" @change="onChange" />
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watchEffect } from 'vue'
import Rules from './Rules.vue'
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