<template>
  <div>
    <j-form-item label="最大列数" :name="['componentProps', 'inlineMax']">
      <j-input
        placeholder="请输入"
        v-model:value="target.componentProps.inlineMax"
        @change="onDataChange"
      />
    </j-form-item>
    <j-form-item label="列间距" :name="['componentProps', 'placeholder']">
      <j-input
        placeholder="请输入"
        v-model:value="target.componentProps.placeholder"
        @change="onDataChange"
      />
    </j-form-item>
    <j-form-item label="行间距" :name="['componentProps', 'placeholder']">
      <j-input
        placeholder="请输入"
        v-model:value="target.componentProps.placeholder"
        @change="onDataChange"
      />
    </j-form-item>
  </div>
</template>
      
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>