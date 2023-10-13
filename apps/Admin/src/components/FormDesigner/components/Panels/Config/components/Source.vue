<template>
  <SourceData :value="target.componentProps.source" @change="onChange" />
</template>
    
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'
import { omit } from 'lodash-es'
import SourceData from './SourceData.vue'

const emits = defineEmits(['refresh'])

const { target } = useTarget()

const onChange = (obj: any) => {
  target.value.componentProps.source = obj
  emits('refresh', target.value)
}
</script>