<template>
  <FlowDesigner @selectedNode="nodeSelected" />
</template>

<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'

const showConfig = ref(false)
const nodeSelected = (node) => {
  console.log('配置节点', node)
  showConfig.value = true
}
</script>

<style lang="less" scoped></style>
