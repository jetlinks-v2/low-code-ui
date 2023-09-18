<!-- 流程设计 -->
<template>
  <FlowDesigner @selectNode="nodeSelected" />

  <j-drawer
    :width="500"
    :title="selectedNode?.name"
    placement="right"
    :visible="showConfig"
    @close="showConfig = false"
  >
    <template #extra>
      <j-space>
        <j-button @click="showConfig = false">取消</j-button>
        <j-button type="primary" @click="handleSubmit">确定</j-button>
      </j-space>
    </template>

    <NodeConfig />
  </j-drawer>
</template>

<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import NodeConfig from '@/components/FlowDesigner/components/config/NodeConfig.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

const showConfig = ref(false)
const nodeSelected = (node) => {
  console.log('配置节点', node)
  showConfig.value = true
}

const handleSubmit = () => {
  showConfig.value = false
}
</script>

<style lang="less" scoped></style>
