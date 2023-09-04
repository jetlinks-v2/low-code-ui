<template>
  <div>
    <j-form-item label="组件布局" name="layout">
      <j-radio-group
        v-model:value="target.componentProps.layout"
        button-style="solid"
        @change="onDataChange"
      >
        <j-radio-button value="horizontal">水平</j-radio-button>
        <j-radio-button value="vertical">垂直</j-radio-button>
        <j-radio-button value="inline">内联</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item label="组件尺寸" name="size">
      <j-radio-group
        v-model:value="target.componentProps.size"
        button-style="solid"
        @change="onDataChange"
      >
        <j-radio-button value="small">小</j-radio-button>
        <j-radio-button value="default">中</j-radio-button>
        <j-radio-button value="large">大</j-radio-button>
      </j-radio-group>
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