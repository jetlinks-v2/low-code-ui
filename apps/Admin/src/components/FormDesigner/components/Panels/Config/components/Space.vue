<template>
  <div>
    <j-form-item :name="['componentProps', 'align']" label="对齐">
      <j-select
        v-model:value="target.componentProps.align"
        placeholder="请选择"
      >
        <j-select-option value="start">头部</j-select-option>
        <j-select-option value="end">尾部</j-select-option>
        <j-select-option value="center">居中</j-select-option>
        <j-select-option value="baseline">基准线</j-select-option>
      </j-select>
    </j-form-item>
    <j-form-item :name="['componentProps', 'direction']" label="类型" required>
      <j-radio-group
        v-model:value="target.componentProps.direction"
        button-style="solid"
      >
        <j-radio-button :value="'vertical'">垂直</j-radio-button>
        <j-radio-button :value="'horizontal'">水平</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item :name="['componentProps', 'size']" label="间隔尺寸" required>
      <j-input-number
        v-model:value="target.componentProps.size"
        style="width: 100%"
        :precision="0"
      />
    </j-form-item>
  </div>
</template>
      
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()
</script>