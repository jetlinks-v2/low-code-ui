<template>
  <SourceData :value="target?.children?.[0]?.componentProps?.source" @change="onChange" />
</template>
    
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'
import SourceData from './SourceData.vue'

const emits = defineEmits(['refresh'])

const { target } = useTarget()

const onChange = (obj: any) => {
  target.value.children[0].componentProps.source = obj
  emits('refresh', target.value)
}
</script>