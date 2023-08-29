<template>
  <div>
    <j-form-item label="组件类型" name="type">
      <j-input :disabled="true" :value="_data.name" />
    </j-form-item>
    <j-form-item
      label="标识"
      :name="['formItemProps', 'name']"
      :rules="[
        {
          required: true,
          message: '请输入',
          trigger: 'change',
        },
      ]"
    >
      <j-input
        placeholder="请输入"
        @change="onChange"
        v-model:value="_data.formItemProps.name"
      />
    </j-form-item>
    <template v-if="['text'].includes(type)">
      <j-form-item
        label="文本内容"
        :name="['componentProps', 'value']"
        required
      >
        <j-input
          placeholder="请输入"
          @change="onChange"
          v-model:value="_data.componentProps.value"
        />
      </j-form-item>
    </template>
    <template v-if="!['text', 'switch'].includes(type)">
      <j-form-item label="提示语" :name="['componentProps', 'placeholder']">
        <j-input
          placeholder="请输入"
          @change="onChange"
          v-model:value="_data.componentProps.placeholder"
        />
      </j-form-item>
    </template>
    <template
      v-if="!['text'].includes(type)"
    >
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
      </j-form-item>
    </template>
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