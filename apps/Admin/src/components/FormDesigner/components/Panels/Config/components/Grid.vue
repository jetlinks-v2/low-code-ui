<template>
  <div>
    <template v-if="type === 'grid'">
      <j-form-item :validateFirst="true" label="最大列数" :name="['componentProps', 'inlineMax']">
        <j-input-number
          placeholder="请输入"
          v-model:value="target.componentProps.inlineMax"
          @change="onDataChange"
          :min="1"
          :max="15"
          :precision="0"
          style="width: 100%"
        />
      </j-form-item>
      <j-form-item :validateFirst="true" label="列间距" :name="['componentProps', 'colSpan']">
        <j-input-number
          placeholder="请输入"
          v-model:value="target.componentProps.colSpan"
          @change="onDataChange"
          :min="0"
          :max="99999999999999"
          :precision="0"
          style="width: 100%"
        />
      </j-form-item>
      <j-form-item :validateFirst="true" label="行间距" :name="['componentProps', 'rowSpan']">
        <j-input-number
          placeholder="请输入"
          v-model:value="target.componentProps.rowSpan"
          @change="onDataChange"
          :min="0"
          :max="99999999999999"
          :precision="0"
          style="width: 100%"
        />
      </j-form-item>
    </template>
    <template v-if="type === 'grid-item'">
      <j-form-item :validateFirst="true" label="跨列栏数" :name="['componentProps', 'span']">
        <j-input-number
          placeholder="请输入"
          v-model:value="target.componentProps.span"
          @change="onDataChange"
          :min="0"
          :max="99999999999999"
          :precision="0"
          style="width: 100%"
        />
      </j-form-item>
    </template>
  </div>
</template>
      
<script lang="ts" setup>
import { computed } from 'vue'
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const type = computed(() => {
  return target.value?.type
})

const onDataChange = () => {
  emits('refresh', target.value)
}
</script>