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
      <j-radio-group v-model:value="target.visible" button-style="solid">
        <j-radio-button :value="true">展示</j-radio-button>
        <j-radio-button :value="false">隐藏</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      label="编辑状态是否支持修改"
      v-if="!['text', 'table'].includes(type)"
      :name="['editable']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group v-model:value="target.editable" button-style="solid">
        <j-radio-button :value="true">支持</j-radio-button>
        <j-radio-button :value="false">不支持</j-radio-button>
      </j-radio-group>
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const type = computed(() => {
  return target.value?.type
})
</script>