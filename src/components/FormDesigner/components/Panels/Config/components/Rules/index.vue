<template>
  <div>
    <j-form-item>
      <Rule v-model:value="target.formItemProps.rules" @change="onChange" />
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
      <!-- <j-radio-group
        v-model:value="target.formItemProps.required"
        button-style="solid"
      >
        <j-radio-button :value="true">必填</j-radio-button>
        <j-radio-button :value="false">非必填</j-radio-button>
      </j-radio-group> -->
      <CheckButton
        :options="[
          { label: '必填', value: true },
          { label: '非必填', value: false },
        ]"
        v-model:value="target.formItemProps.required"
      />
    </j-form-item>
  </div>
</template>
    
<script lang="ts" setup>
import Rule from './Rule.vue'
import { useTarget } from '../../../../../hooks'
import { CheckButton } from '@LowCode/components/index'

const { target } = useTarget()

const onChange = (arr: any[]) => {
  target.value.formItemProps.rules = arr
}
</script>