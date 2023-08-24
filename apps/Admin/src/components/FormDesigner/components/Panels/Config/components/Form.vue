<template>
  <div>
    <p>表单样式</p>
    <j-form-item label="标签对齐方式" name="layout">
      <j-radio-group
        v-model:value="target.componentProps.layout"
        button-style="solid"
      >
        <j-radio-button value="horizontal">Horizontal</j-radio-button>
        <j-radio-button value="vertical">Vertical</j-radio-button>
        <j-radio-button value="inline">Inline</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item label="组件尺寸" name="size">
      <j-radio-group
        v-model:value="target.componentProps.size"
        button-style="solid"
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
</script>