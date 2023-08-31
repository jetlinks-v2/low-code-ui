<template>
  <div>
    <j-form-item label="css样式" :name="['componentProps', 'cssCode']">
      <EditorBtn v-model:value="target.componentProps.cssCode" text="编写css" language="css" />
    </j-form-item>
    <j-form-item label="JS代码" :name="['componentProps', 'eventCode']">
      <EditorBtn v-model:value="target.componentProps.eventCode" text="编写代码" language="javascript" />
    </j-form-item>
    <j-form-item
      label="新增状态是否展示"
      :name="['componentProps', 'visible']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
      v-if="type !== 'root'"
    >
      <j-radio-group v-model:value="target.componentProps.visible" button-style="solid">
        <j-radio-button :value="true">展示</j-radio-button>
        <j-radio-button :value="false">隐藏</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      label="编辑状态是否支持修改"
      v-if="!['text', 'table', 'root'].includes(type)"
      :name="['componentProps', 'editable']"
      :rules="[
        {
          required: true,
          message: '请选择',
        },
      ]"
    >
      <j-radio-group v-model:value="target.componentProps.editable" button-style="solid">
        <j-radio-button :value="true">支持</j-radio-button>
        <j-radio-button :value="false">不支持</j-radio-button>
      </j-radio-group>
    </j-form-item>
  </div>
</template>
<script lang="ts" setup>
import EditorBtn from './EditorBtn.vue'
import { computed } from 'vue'
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const type = computed(() => {
  return target.value?.type
})
</script>