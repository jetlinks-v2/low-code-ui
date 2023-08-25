<template>
  <div>
    <j-form-item :name="['componentProps', 'type']" label="切卡样式">
      <j-radio-group
        v-model:value="target.componentProps.type"
        button-style="solid"
      >
        <j-radio-button :value="'line'">线框</j-radio-button>
        <j-radio-button :value="'card'">卡片</j-radio-button>
      </j-radio-group>
    </j-form-item>
  </div>
</template>
      
  <script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()
</script>