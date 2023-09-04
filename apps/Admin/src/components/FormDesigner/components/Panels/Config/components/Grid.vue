<template>
  <div>
    <j-form-item label="最大列数" :name="['componentProps', 'inlineMax']">
      <j-input-number
        placeholder="请输入"
        v-model:value="target.componentProps.inlineMax"
        @change="onDataChange"
        :min="1"
        style="width: 100%;"
      />
    </j-form-item>
    <j-form-item label="列间距" :name="['componentProps', 'gutter', 1]">
      <j-input-number
        placeholder="请输入"
        v-model:value="target.componentProps.gutter[1]"
        @change="onDataChange"
        :min="0"
        style="width: 100%;"
      />
    </j-form-item>
    <j-form-item label="行间距" :name="['componentProps', 'gutter', 0]">
      <j-input-number
        placeholder="请输入"
        v-model:value="target.componentProps.gutter[0]"
        @change="onDataChange"
        :min="0"
        style="width: 100%;"
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