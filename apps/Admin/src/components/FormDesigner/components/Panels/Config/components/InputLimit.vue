<template>
  <div>
    <p>请对输入内容做出限制</p>
    <j-form-item label="字符数量" :name="['componentProps', 'maxLength']">
      <j-input-number
        style="width: 100%"
        v-model:value="target.componentProps.maxLength"
        placeholder="请输入"
      />
    </j-form-item>
    <template v-if="['input-number'].includes(type)">
      <j-form-item label="最大值" :name="['componentProps', 'max']">
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.max"
          placeholder="请输入"
        />
      </j-form-item>
      <j-form-item label="最小值" :name="['componentProps', 'min']">
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.min"
          placeholder="请输入"
        />
      </j-form-item>
      <j-form-item label="精度" :name="['componentProps', 'precision']">
        <j-input-number
          style="width: 100%"
          v-model:value="target.componentProps.precision"
          placeholder="请输入"
          :precision="0"
        />
      </j-form-item>
    </template>
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